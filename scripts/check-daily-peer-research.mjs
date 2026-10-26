import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_DIRECTORY = "C:/Users/1/Desktop/找同行";
const normalizeTitle = (value) => String(value).normalize("NFKC").toLowerCase().replace(/[\p{P}\p{S}\s]/gu, "");
const hash = (value) => createHash("sha256").update(value).digest("hex");

function checkedDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) throw new Error("Invalid research date");
  return date;
}

function urlKey(value) {
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("Research links must use HTTP(S)");
  url.hash = "";
  url.searchParams.sort();
  return url.href.replace(/\/$/, "");
}

function cardsIn(report) {
  return [...report.matchAll(/^##\s+(\d+)\.\s+([^\n]+)\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/gm)].map((match) => {
    const field = (name) => match[3].match(new RegExp(`^-\\s*${name}[：:]\\s*(.+)$`, "m"))?.[1]?.trim();
    return { number: Number(match[1]), title: match[2].trim(), url: field("原文链接"), summary: field("摘要"), topic: field("文章主题"), body: match[3], field };
  });
}

export function validateResearch({ date, report, history, recentReports = [] }) {
  checkedDate(date);
  if (!report.includes(`检索日期：${date}`) && !report.includes(`检索日期: ${date}`)) throw new Error("The report must record today's search date");
  if (!Array.isArray(history.entries)) throw new Error("Research history must contain entries");
  const cards = cardsIn(report);
  if (!cards.length || cards.length > 20) throw new Error("Research must contain 1-20 evidence-checked cards");
  if (cards.length < 20 && !/未凑满|不足\s*20|不足二十|未满\s*20/.test(report)) throw new Error("A short report must explain why fewer than 20 qualified");
  const prior = history.entries.filter((entry) => entry.date !== date);
  const priorUrls = new Set(prior.map((entry) => urlKey(entry.url)));
  const priorTitles = new Set(prior.map((entry) => normalizeTitle(entry.title)));
  for (const old of recentReports) {
    for (const card of cardsIn(old)) {
      if (card.url) priorUrls.add(urlKey(card.url));
      priorTitles.add(normalizeTitle(card.title));
    }
  }
  const urls = new Set();
  const titles = new Set();
  const topics = new Set();
  const domains = new Set();
  const required = ["作者或网站", "发布日期", "搜索关键词", "结果位置", "文章主题", "摘要", "文章结构", "可验证的独特观点", "可借鉴的选题角度", "与阅天AI现有内容可能重复的提醒"];
  for (const [index, card] of cards.entries()) {
    if (card.number !== index + 1 || !card.url || required.some((field) => !card.field(field))) throw new Error(`Incomplete research card ${index + 1}`);
    const key = urlKey(card.url);
    const title = normalizeTitle(card.title);
    const topic = normalizeTitle(card.topic);
    const domain = new URL(card.url).hostname.replace(/^www\./, "");
    const labels = domain.split(".");
    const countrySuffix = labels.at(-1).length === 2 && ["com", "co", "net", "org", "gov", "edu", "ac"].includes(labels.at(-2));
    const independentDomain = labels.slice(countrySuffix ? -3 : -2).join(".");
    if (domain === "yuetianai.com" || domain.endsWith(".yuetianai.com")) throw new Error("Own-site articles are not peer research");
    if (urls.has(key) || titles.has(title) || topics.has(topic)) throw new Error(`Duplicate research card: ${card.title}`);
    if (priorUrls.has(key) || priorTitles.has(title)) throw new Error(`Previously researched article: ${card.title}`);
    if (/摘要核验|正文无法核验|正文未核验/.test(card.body)) throw new Error(`Unverified article body: ${card.title}`);
    const length = Array.from(card.summary.trim()).length;
    if (length < 200 || length > 400) throw new Error(`Summary must contain 200-400 characters: ${card.title}`);
    const recorded = history.entries.some((entry) => entry.date === date && urlKey(entry.url) === key && normalizeTitle(entry.title) === title);
    if (!recorded) throw new Error(`Today's history is missing ${card.title}`);
    urls.add(key); titles.add(title); topics.add(topic); domains.add(independentDomain);
  }
  if (domains.size < 10) throw new Error("Research needs at least 10 independent domains before publishing");
  const linkSection = report.match(/^##\s+原文链接清单\s*\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/m)?.[1] || "";
  const rawLinks = linkSection.split(/\r?\n/).map((line) => line.trim()).filter((line) => /^https?:\/\//.test(line));
  const rawKeys = rawLinks.map(urlKey);
  if (rawKeys.length !== cards.length || new Set(rawKeys).size !== cards.length || rawKeys.some((key) => !urls.has(key))) throw new Error("The raw-link list must match every research card exactly once");
  return { date, cardCount: cards.length, domainCount: domains.size, shortfall: 20 - cards.length, urls: cards.map((card) => card.url), validationScope: "File structure, exact URL/title/topic deduplication and history consistency; source-body and main-idea checks remain editorial duties." };
}

function filePaths(date, directory) {
  checkedDate(date);
  return { report: path.join(directory, `每日更新的同行文章-${date}.md`), history: path.join(directory, "历史记录.json"), ready: path.join(directory, `同行检索状态-${date}.json`) };
}

function readSnapshot(date, directory) {
  const files = filePaths(date, directory);
  const read = (file) => readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const report = read(files.report);
  const historyText = read(files.history);
  const oldest = new Date(new Date(`${date}T00:00:00Z`).getTime() - 30 * 86400000).toISOString().slice(0, 10);
  const recentReports = readdirSync(directory).filter((file) => {
    const priorDate = file.match(/^每日更新的同行文章-(\d{4}-\d{2}-\d{2})\.md$/)?.[1];
    return priorDate && priorDate >= oldest && priorDate < date;
  }).map((file) => read(path.join(directory, file)));
  const summary = validateResearch({ date, report, history: JSON.parse(historyText), recentReports });
  return { ...summary, reportPath: path.resolve(files.report), reportSha256: hash(report), historySha256: hash(historyText) };
}

function writeState(date, directory, state) {
  const file = filePaths(date, directory).ready;
  mkdirSync(directory, { recursive: true });
  writeFileSync(file + ".tmp", JSON.stringify(state, null, 2) + "\n", "utf8");
  renameSync(file + ".tmp", file);
  return state;
}

export function finishPeerResearch({ date, directory = DEFAULT_DIRECTORY }) {
  const snapshot = readSnapshot(date, directory);
  return writeState(date, directory, { version: 1, state: "ready", ...snapshot, validatedAt: new Date().toISOString() });
}

export function assertReadyPeerResearch({ date, directory = DEFAULT_DIRECTORY }) {
  const file = filePaths(date, directory).ready;
  if (!existsSync(file)) throw new Error(`Today's peer research is not ready; complete research first: ${file}`);
  const state = JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  if (state.version !== 1 || state.date !== date || state.state !== "ready") throw new Error("Today's peer research is still in progress or invalid");
  const snapshot = readSnapshot(date, directory);
  if (state.reportSha256 !== snapshot.reportSha256 || state.historySha256 !== snapshot.historySha256) throw new Error("Peer report or history changed after handoff; validate research again");
  return snapshot;
}

function main() {
  const args = {};
  const tokens = process.argv.slice(2);
  for (let index = 0; index < tokens.length; index += 2) {
    if (!["--date", "--directory", "--mode"].includes(tokens[index]) || !tokens[index + 1]) throw new Error("Use --date YYYY-MM-DD [--directory path] [--mode begin|complete|check]");
    args[tokens[index].slice(2)] = tokens[index + 1];
  }
  const date = checkedDate(args.date || "");
  const directory = path.resolve(args.directory || DEFAULT_DIRECTORY);
  const mode = args.mode || "check";
  let result;
  if (mode === "begin") result = writeState(date, directory, { version: 1, state: "in_progress", date, startedAt: new Date().toISOString() });
  else if (mode === "complete") result = finishPeerResearch({ date, directory });
  else if (mode === "check") result = assertReadyPeerResearch({ date, directory });
  else throw new Error("Research mode must be begin, complete or check");
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
