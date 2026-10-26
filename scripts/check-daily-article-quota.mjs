import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const SITE = "https://yuetianai.com/";
const COLLECTIONS = ["articles/index.html", "articles/en/index.html", "feed.xml", "articles/en/feed.xml", "sitemap.xml", "sitemap-en.xml", "sitemap-articles.xml"];

export function shanghaiDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

export function assessQuota(records, date, target = 20) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) throw new Error("Invalid date");
  if (!Number.isInteger(target) || target < 1 || target > 30) throw new Error("Invalid daily target");
  const unique = new Map();
  for (const record of records) {
    if (shanghaiDate(record.publishedAt) !== date) continue;
    if (unique.has(record.slug)) throw new Error(`Duplicate article slug: ${record.slug}`);
    unique.set(record.slug, record);
  }
  const articles = [...unique.values()];
  const failed = articles.filter((article) => !article.zhOk || !article.enOk).map((article) => article.slug);
  return { date, target, published: articles.length, verified: articles.length - failed.length, remainingToPublish: Math.max(0, target - articles.length), overQuota: articles.length > target, verificationFailures: failed, complete: articles.length === target && failed.length === 0 };
}

function git(args, options = {}) {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, windowsHide: true, ...options });
}

function parsePage(html) {
  const flatten = (value) => Array.isArray(value) ? value.flatMap(flatten) : value && typeof value === "object" ? [value, ...flatten(value["@graph"] || [])] : [];
  const objects = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap((match) => flatten(JSON.parse(match[1])));
  const article = objects.find((value) => [].concat(value["@type"]).some((type) => type === "Article" || type === "BlogPosting"));
  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]).find((tag) => /\brel=["']canonical["']/i.test(tag));
  return { title: html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim(), canonical: canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1], article };
}

export function readDailyInventory(date, ref = "origin/master") {
  assessQuota([], date);
  const revision = git(["rev-parse", "--verify", `${ref}^{commit}`]).trim();
  const additions = git(["log", revision, `--since=${date}T00:00:00+08:00`, `--until=${date}T23:59:59+08:00`, "--diff-filter=A", "--name-only", "--format=", "--", "articles"]);
  const paths = [...new Set(additions.split(/\r?\n/).filter((file) => /^articles\/[a-z0-9-]+\.html$/.test(file)))];
  const articles = [];
  for (const file of paths) {
    const page = parsePage(git(["show", `${revision}:${file}`]));
    if (!page.article || shanghaiDate(page.article.datePublished) !== date) continue;
    const slug = file.slice("articles/".length, -".html".length);
    const englishFile = `articles/en/${slug}.html`;
    let english;
    try { english = parsePage(git(["show", `${revision}:${englishFile}`], { stdio: ["pipe", "pipe", "pipe"] })); } catch { english = null; }
    articles.push({ slug, publishedAt: page.article.datePublished, zh: { file, ...page }, en: english ? { file: englishFile, ...english } : null });
  }
  return { revision, articles };
}

async function fetchText(file) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(SITE + file + (attempt ? `?verify=${Date.now()}` : ""), { headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(15000) });
      if (response.status !== 200) throw new Error(`HTTP ${response.status}: ${file}`);
      return await response.text();
    } catch (error) { lastError = error; }
  }
  throw lastError;
}

async function verifyPage(expected) {
  if (!expected) return false;
  try {
    const actual = parsePage(await fetchText(expected.file));
    return Boolean(actual.article && expected.article && actual.title === expected.title && actual.canonical === SITE + expected.file && actual.article.headline === expected.article.headline && actual.article.datePublished === expected.article.datePublished);
  } catch { return false; }
}

function remoteRevision() {
  return git(["-c", "http.proxy=", "-c", "https.proxy=", "ls-remote", "origin", "refs/heads/master"]).trim().split(/\s+/)[0];
}

export async function checkDailyQuota({ date = shanghaiDate(), ref = "origin/master" } = {}) {
  const inventory = readDailyInventory(date, ref);
  if (remoteRevision() !== inventory.revision) throw new Error("Fetch origin/master before checking the daily quota");
  const records = await Promise.all(inventory.articles.map(async (article) => {
    const [zhOk, enOk] = await Promise.all([verifyPage(article.zh), verifyPage(article.en)]);
    return { slug: article.slug, publishedAt: article.publishedAt, zhOk, enOk };
  }));
  const collectionFailures = [];
  await Promise.all(COLLECTIONS.map(async (file) => {
    try {
      const body = await fetchText(file);
      const expected = git(["show", `${inventory.revision}:${file}`]);
      if (body.replaceAll("\r\n", "\n") !== expected.replaceAll("\r\n", "\n")) throw new Error("does not match remote master");
      const english = file.includes("/en/") || file === "sitemap-en.xml";
      for (const article of inventory.articles) {
        const articleFile = english ? `articles/en/${article.slug}.html` : `articles/${article.slug}.html`;
        if (!body.includes(SITE + articleFile)) throw new Error(`missing ${article.slug}`);
      }
    } catch (error) { collectionFailures.push(`${file}: ${error.message}`); }
  }));
  const result = assessQuota(records, date);
  const unchanged = remoteRevision() === inventory.revision;
  return { ...result, complete: result.complete && collectionFailures.length === 0 && unchanged, revision: inventory.revision, remoteUnchanged: unchanged, collectionFailures, articles: records, checkedAt: new Date().toISOString() };
}

async function main() {
  const options = {};
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    if (!["--date", "--ref", "--output"].includes(key) || !args[index + 1] || args[index + 1].startsWith("--")) throw new Error("Use --date YYYY-MM-DD [--ref origin/master] [--output report.json]");
    options[key.slice(2)] = args[index + 1];
  }
  const result = await checkDailyQuota(options);
  const json = JSON.stringify(result, null, 2) + "\n";
  if (options.output) writeFileSync(options.output, json, "utf8");
  console.log(json);
  process.exitCode = result.complete ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 2; });
}
