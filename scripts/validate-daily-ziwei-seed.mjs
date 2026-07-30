import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const LOW_VALUE_PATTERNS = [
  /公司电脑|共享(?:手机|电脑)|浏览器|本机|云端|换设备|换手机|换电脑/u,
  /登录|注册|账号|手机号|邮箱|自动填充/u,
  /聊天记录|保存记录|同步记录|找回记录|清理记录/u,
  /客服|退款|支付页|支付细则|付款后|会员(?:规则|额度|次数|每天|值不值|用不满)/u,
  /免费额度|游客次数|单次补问|低价试用|碎片时间|连续问|一天.*追问/u,
];
const BANNED_PUBLIC_TERMS = [
  "文稿里", "讲义里", "他说", "倪海厦", "天纪", "source-extract", "证据卡",
];
const TEMPLATE_PHRASES = [
  "这类题最怕的，不是看不懂术语",
  "所以第一步不是急着贴一句吉凶",
  "真正把结果拉开的，往往不是多背一条断语",
  "真正实用的地方，在于先分层",
  "判断才不会越看越宽、越讲越虚",
];
const ENGLISH_TEMPLATE_PHRASES = [
  "do not judge one star or one palace alone",
  "use the palace first then read the opposite palace",
  "so the reading stays concrete instead of drifting into a fixed label",
  "in this guide the key question is",
];
const BANNED_ENGLISH_SOURCE_TERMS = [
  "ni hai xia", "tian ji lecture", "source document", "source extract", "transcript says",
];
const DOMAIN_TERMS = [
  "命宫", "身宫", "财帛", "官禄", "迁移", "夫妻", "福德", "父母", "朋友",
  "子女", "田宅", "疾厄", "兄弟", "仆役", "四化", "化禄", "化权", "化科",
  "化忌", "三方四正", "大限", "流年", "紫微", "天府", "武曲", "廉贞", "贪狼",
  "七杀", "破军", "天相", "天梁", "太阳", "太阴", "文昌", "文曲", "魁钺",
  "擎羊", "陀罗", "火星", "铃星", "天空", "地劫", "红鸾", "天喜",
];
const COMBINATION_PATTERN = /宫|三方四正|四化|化[禄权科忌]|紫微|天府|武曲|廉贞|贪狼|七杀|破军|天相|天梁|太阳|太阴|文昌|文曲|魁钺|擎羊|陀罗|火星|铃星|天空|地劫/u;

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

function normalize(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, "")
    .replace(/紫微斗数|AI算命|阅天AI/gi, "")
    .replace(/zi\s*wei\s*dou\s*shu|chinese astrology/gi, "")
    .replace(/[\s\p{P}\p{S}]/gu, "")
    .toLowerCase();
}

function grams(value, size = 2) {
  const text = normalize(value);
  const output = new Set();
  for (let index = 0; index <= text.length - size; index += 1) output.add(text.slice(index, index + size));
  return output;
}

function similarity(left, right) {
  const a = grams(left);
  const b = grams(right);
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

function coverage(claim, sourceText) {
  const claimGrams = grams(claim);
  const sourceGrams = grams(sourceText);
  if (!claimGrams.size) return 0;
  let found = 0;
  for (const item of claimGrams) if (sourceGrams.has(item)) found += 1;
  return found / claimGrams.size;
}

function longestCommonRun(left, right) {
  const a = normalize(left);
  const b = normalize(right);
  if (!a || !b) return 0;
  const previous = new Uint16Array(b.length + 1);
  let best = 0;
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = 0;
    for (let j = 1; j <= b.length; j += 1) {
      const saved = previous[j];
      previous[j] = a[i - 1] === b[j - 1] ? diagonal + 1 : 0;
      if (previous[j] > best) best = previous[j];
      diagonal = saved;
    }
  }
  return best;
}

function parseEvidenceRange(raw, paragraphCount) {
  const match = String(raw || "").match(/^(\d+)(?:-(\d+))?$/);
  if (!match) return null;
  const start = Number(match[1]);
  const end = Number(match[2] || match[1]);
  if (start < 1 || end < start || end > paragraphCount || end - start > 30) return null;
  return { start, end };
}

function readParagraphs(docxPath) {
  const python = process.env.PYTHON || "python";
  const extractor = path.join(ROOT, "scripts", "extract-docx-paragraphs.py");
  const result = spawnSync(python, [extractor, docxPath], {
    encoding: "utf8",
    env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error(result.stderr.trim() || "DOCX extraction failed");
  return JSON.parse(result.stdout);
}

function existingTitles() {
  const dir = path.join(ROOT, "articles");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith(".html") && file !== "index.html")
    .map((file) => {
      const html = readFileSync(path.join(dir, file), "utf8");
      const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();
      return title ? { file, title } : null;
    })
    .filter(Boolean);
}

function existingEnglishTitles() {
  const dir = path.join(ROOT, "articles", "en");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith(".html") && file !== "index.html")
    .map((file) => {
      const html = readFileSync(path.join(dir, file), "utf8");
      const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();
      return title ? { file, title } : null;
    })
    .filter(Boolean);
}

function articleDraft(article) {
  const openings = Array.isArray(article.openingParagraphs) ? article.openingParagraphs : [article.opening, article.focus].filter(Boolean);
  const sections = Array.isArray(article.sections)
    ? article.sections.flatMap((section) => [section.heading, ...(section.paragraphs || [])])
    : [];
  return [...openings, ...sections, article.orderText].filter(Boolean).join("\n");
}

function englishDraft(article) {
  const english = article.english || {};
  const openings = Array.isArray(english.openingParagraphs) ? english.openingParagraphs : [];
  const sections = Array.isArray(english.sections)
    ? english.sections.flatMap((section) => [section.heading, ...(section.paragraphs || [])])
    : [];
  return [...openings, ...sections, english.orderText].filter(Boolean).join("\n");
}

function englishWords(value) {
  return String(value || "").match(/[A-Za-z]+(?:[-'][A-Za-z]+)*/g) || [];
}

function distinctCount(values) {
  return new Set(values.map((item) => normalize(item)).filter(Boolean)).size;
}

function phraseOwners(articles, size = 20) {
  const owners = new Map();
  for (const article of articles) {
    const text = normalize(articleDraft(article));
    const seen = new Set();
    for (let index = 0; index <= text.length - size; index += 1) seen.add(text.slice(index, index + size));
    for (const phrase of seen) {
      if (!owners.has(phrase)) owners.set(phrase, []);
      owners.get(phrase).push(article.slug);
    }
  }
  return [...owners.entries()].filter(([, slugs]) => slugs.length >= 3);
}

function englishPhraseOwners(articles, size = 10) {
  const owners = new Map();
  for (const article of articles) {
    const words = englishWords(englishDraft(article)).map((word) => word.toLowerCase());
    const seen = new Set();
    for (let index = 0; index <= words.length - size; index += 1) seen.add(words.slice(index, index + size).join(" "));
    for (const phrase of seen) {
      if (!owners.has(phrase)) owners.set(phrase, []);
      owners.get(phrase).push(article.slug);
    }
  }
  return [...owners.entries()].filter(([, slugs]) => slugs.length >= 3);
}

function scoreArticle(article, paragraphs, oldTitles, oldEnglishTitles, batchTitles, batchEnglishTitles) {
  const failures = [];
  const warnings = [];
  const points = Array.isArray(article.points) ? article.points.filter(Boolean) : [];
  const examples = Array.isArray(article.examples) ? article.examples.filter(Boolean) : [];
  const supports = Array.isArray(article.supportPlan) ? article.supportPlan.filter(Boolean) : [];
  const evidence = Array.isArray(article.evidence) ? article.evidence : [];
  const sections = Array.isArray(article.sections) ? article.sections : [];
  const openings = Array.isArray(article.openingParagraphs) ? article.openingParagraphs.filter(Boolean) : [];
  const draft = articleDraft(article);
  const english = article.english || {};
  const englishOpenings = Array.isArray(english.openingParagraphs) ? english.openingParagraphs.filter(Boolean) : [];
  const englishSections = Array.isArray(english.sections) ? english.sections : [];
  const englishExamples = Array.isArray(english.examples) ? english.examples.filter(Boolean) : [];
  const enDraft = englishDraft(article);
  const publicText = [article.title, article.category, article.intent, article.userQuestion, article.directAnswer, article.readerValue, draft, english.title, english.description, enDraft]
    .filter(Boolean)
    .join("\n");
  const topicText = [article.title, article.intent, article.userQuestion, article.userScenario].filter(Boolean).join(" ");

  if (!Number.isInteger(article.order) || article.order < 1) failures.push("order 必须为正整数");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(article.slug || ""))) failures.push("slug 缺失或格式不正确");
  if (normalize(article.title).length < 12) failures.push("标题缺失或信息量不足");
  if (!article.category || normalize(article.category).length < 2) failures.push("缺少有效 category");
  if (!article.intent || normalize(article.intent).length < 12) failures.push("搜索意图 intent 过薄");
  if (!article.userQuestion || !/[？?]$/.test(article.userQuestion.trim())) failures.push("用户原始问法必须是完整问句");
  if (normalize(article.userScenario).length < 18) failures.push("用户场景过薄");
  if (normalize(article.directAnswer).length < 35) failures.push("直接答案过薄");
  if (normalize(article.readerValue).length < 24) failures.push("缺少独立成篇理由 readerValue");
  if (LOW_VALUE_PATTERNS.some((pattern) => pattern.test(topicText))) failures.push("命中低价值产品帮助题材");
  if (points.length < 4 || supports.length < 4) failures.push("不足4个独立观点或判断条件");
  if (distinctCount(points) < 4 || distinctCount(supports) < 4) failures.push("观点或支撑计划存在重复，未达到4个独立判断");
  if (examples.length < 2) failures.push("不足2个组合或落宫例子");
  if (distinctCount(examples) < 2 || examples.some((item) => !COMBINATION_PATTERN.test(item))) failures.push("例子必须是2个不同且明确的星曜、四化、组合或落宫案例");
  if (evidence.length < 2) failures.push("源文证据范围不足2组");
  if (new Set(evidence.map(String)).size < 2) failures.push("源文证据范围重复");
  if (openings.length < 1 || openings.length > 2) failures.push("openingParagraphs 必须为1-2段");
  if (sections.length < 3 || sections.length > 5) failures.push("sections 必须为3-5节原创结构");
  if (!article.orderText || normalize(article.orderText).length < 35) failures.push("缺少明确排盘使用顺序");

  for (const term of BANNED_PUBLIC_TERMS) if (publicText.includes(term)) failures.push(`公开正文或元数据含禁用来源词：${term}`);
  for (const phrase of TEMPLATE_PHRASES) if (draft.includes(phrase)) failures.push(`命中旧模板句：${phrase}`);

  if (englishWords(english.title).length < 6) failures.push("英文标题缺失或过薄");
  const descriptionWords = englishWords(english.description).length;
  if (descriptionWords < 18 || descriptionWords > 40) failures.push(`英文 description 应为18-40词，当前${descriptionWords}词`);
  if (englishOpenings.length < 1 || englishOpenings.length > 2) failures.push("英文 openingParagraphs 必须为1-2段");
  if (englishSections.length < 3 || englishSections.length > 5) failures.push("英文 sections 必须为3-5节原创结构");
  if (englishExamples.length < 2 || distinctCount(englishExamples) < 2) failures.push("英文稿不足2个独立现实例子");
  if (!english.orderText || englishWords(english.orderText).length < 25) failures.push("英文稿缺少明确 practical reading order");
  const englishWordCount = englishWords(enDraft).length;
  if (englishWordCount < 380 || englishWordCount > 750) failures.push(`英文正文篇幅不合格：${englishWordCount}词`);
  if (/[\u3400-\u9fff]/u.test([english.title, english.description, enDraft].join(" "))) failures.push("英文公开内容含中文，必须自然改写而非混排");
  const englishPublicLower = [english.title, english.description, enDraft].join(" ").toLowerCase();
  for (const term of BANNED_ENGLISH_SOURCE_TERMS) if (englishPublicLower.includes(term)) failures.push(`英文公开内容含来源追踪词：${term}`);
  for (const phrase of ENGLISH_TEMPLATE_PHRASES) if (englishPublicLower.includes(phrase)) failures.push(`英文稿命中旧模板句：${phrase}`);
  const englishHeadings = englishSections.map((section) => String(section.heading || "").trim().toLowerCase());
  if (new Set(englishHeadings).size !== englishSections.length) failures.push("英文文章内H2标题重复");
  for (const section of englishSections) {
    if (!section.heading || !Array.isArray(section.paragraphs) || !section.paragraphs.length) failures.push("英文 sections 项缺少标题或段落");
  }
  for (const example of englishExamples) {
    if (!normalize(enDraft).includes(normalize(example))) failures.push("英文 examples 必须实际写入英文正文");
  }

  const ranges = evidence.map((item) => parseEvidenceRange(item, paragraphs.length));
  if (ranges.some((item) => !item)) failures.push("证据编号无效或范围过宽");
  const sourceParagraphs = ranges.filter(Boolean).flatMap(({ start, end }) => paragraphs.slice(start - 1, end));
  const sourceText = sourceParagraphs.map((item) => item.text).join("\n");
  const domainOverlap = DOMAIN_TERMS.filter((term) => sourceText.includes(term) && [...points, ...examples].join(" ").includes(term));
  if (domainOverlap.length < 2) failures.push("观点与源文缺少足够术语关联");
  const claimCoverage = points.map((point) => coverage(point, sourceText));
  if (claimCoverage.some((value) => value < 0.05)) failures.push("至少一个观点无法由所列源段支持");
  else if (claimCoverage.some((value) => value < 0.08)) warnings.push("至少一个观点与所列源段文字关联偏弱，需人工复核");
  const copyRuns = [...points, ...examples].map((claim) => longestCommonRun(claim, sourceText));
  if (copyRuns.some((value) => value > 48)) failures.push("存在超过48字的连续照抄风险");

  const closeBatch = batchTitles.filter((item) => item.slug !== article.slug && similarity(article.title, item.title) >= 0.68);
  if (closeBatch.length) failures.push(`批内标题意图过近：${closeBatch.map((item) => item.slug).join(", ")}`);
  const closeExisting = oldTitles.filter((item) => item.file !== `${article.slug}.html` && similarity(article.title, item.title) >= 0.72);
  if (closeExisting.length) failures.push(`与已发标题意图过近：${closeExisting.slice(0, 3).map((item) => item.file).join(", ")}`);
  const closeEnglishBatch = batchEnglishTitles.filter((item) => item.slug !== article.slug && similarity(english.title, item.title) >= 0.72);
  if (closeEnglishBatch.length) failures.push(`批内英文标题意图过近：${closeEnglishBatch.map((item) => item.slug).join(", ")}`);
  const closeEnglishExisting = oldEnglishTitles.filter((item) => item.file !== `${article.slug}.html` && similarity(english.title, item.title) >= 0.76);
  if (closeEnglishExisting.length) failures.push(`与已发英文标题意图过近：${closeEnglishExisting.slice(0, 3).map((item) => item.file).join(", ")}`);

  const bodyLength = normalize(draft).length;
  if (bodyLength < 600 || bodyLength > 1100) failures.push(`中文正文长度不合格：${bodyLength}`);
  const uniqueHeadings = new Set(sections.map((section) => normalize(section.heading)));
  if (uniqueHeadings.size !== sections.length) failures.push("文章内H2标题重复");
  for (const section of sections) {
    if (!section.heading || !Array.isArray(section.paragraphs) || !section.paragraphs.length) failures.push("sections 项缺少标题或段落");
  }

  let score = 100;
  score -= failures.length * 12;
  score -= warnings.length * 3;
  score = Math.max(0, score);
  return {
    order: article.order,
    slug: article.slug,
    title: article.title,
    score,
    pass: failures.length === 0 && score >= 85,
    failures,
    warnings,
    evidence: {
      ranges: evidence,
      paragraphCount: sourceParagraphs.length,
      domainOverlap,
      claimCoverage: claimCoverage.map((value) => Number(value.toFixed(3))),
      longestCopyRuns: copyRuns,
      excerpts: sourceParagraphs.slice(0, 8),
    },
    english: {
      wordCount: englishWordCount,
      sectionCount: englishSections.length,
      exampleCount: englishExamples.length,
    },
  };
}

export async function validateSeedBatch({ seedPath, docxPath, date, reportPath, reportOnly = false, expectedCount = 30 }) {
  const resolvedSeed = path.resolve(seedPath);
  const resolvedDocx = path.resolve(docxPath);
  const { articles } = await import(`${pathToFileURL(resolvedSeed).href}?t=${Date.now()}`);
  if (!Array.isArray(articles) || !articles.length) throw new Error("Seed file did not export articles");
  const paragraphs = readParagraphs(resolvedDocx);
  const oldTitles = existingTitles();
  const oldEnglishTitles = existingEnglishTitles();
  const batchTitles = articles.map(({ slug, title }) => ({ slug, title }));
  const batchEnglishTitles = articles.map(({ slug, english }) => ({ slug, title: english?.title || "" }));
  const reports = articles.map((article) => scoreArticle(article, paragraphs, oldTitles, oldEnglishTitles, batchTitles, batchEnglishTitles));
  const repeatedPhrases = phraseOwners(articles);
  if (repeatedPhrases.length) {
    for (const report of reports) {
      const hits = repeatedPhrases.filter(([, slugs]) => slugs.includes(report.slug));
      if (!hits.length) continue;
      report.failures.push(`跨文章重复20字模板句：${hits[0][0]}`);
      report.score = Math.max(0, report.score - 12);
      report.pass = false;
    }
  }
  const repeatedEnglishPhrases = englishPhraseOwners(articles);
  if (repeatedEnglishPhrases.length) {
    for (const report of reports) {
      const hits = repeatedEnglishPhrases.filter(([, slugs]) => slugs.includes(report.slug));
      if (!hits.length) continue;
      report.failures.push(`跨英文文章重复10词模板句：${hits[0][0]}`);
      report.score = Math.max(0, report.score - 12);
      report.pass = false;
    }
  }
  const duplicateOrders = articles.length !== new Set(articles.map((item) => item.order)).size;
  const duplicateSlugs = articles.length !== new Set(articles.map((item) => item.slug)).size;
  const batchFailures = [];
  if (!Number.isInteger(expectedCount) || expectedCount < 1 || expectedCount > 30) batchFailures.push("expectedCount 必须是1-30的整数");
  else if (articles.length !== expectedCount) batchFailures.push(`正式批次必须有${expectedCount}篇，当前${articles.length}篇`);
  if (duplicateOrders) batchFailures.push("批次 order 重复");
  if (duplicateSlugs) batchFailures.push("批次 slug 重复");
  const output = {
    version: 1,
    date,
    generatedAt: new Date().toISOString(),
    seed: path.relative(ROOT, resolvedSeed),
    sourceDocument: path.basename(resolvedDocx),
    paragraphCount: paragraphs.length,
    expectedCount,
    articleCount: articles.length,
    passed: reports.filter((item) => item.pass).length,
    failed: reports.filter((item) => !item.pass).length,
    batchFailures,
    articles: reports,
  };
  const resolvedReport = path.resolve(reportPath || `docs/article-quality-${date}.json`);
  mkdirSync(path.dirname(resolvedReport), { recursive: true });
  writeFileSync(resolvedReport, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  if (!reportOnly && (batchFailures.length || output.failed)) {
    const batchMessage = batchFailures.length ? `; batch: ${batchFailures.join("；")}` : "";
    throw new Error(`Article quality gate failed: ${output.failed}/${output.articleCount} articles failed${batchMessage}; see ${path.relative(ROOT, resolvedReport)}`);
  }
  return output;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.seed || !args.docx || !args.date) throw new Error("Usage: node scripts/validate-daily-ziwei-seed.mjs --seed FILE --docx FILE --date YYYY-MM-DD [--expected-count 30] [--report FILE] [--report-only]");
  const expectedCount = Number(args["expected-count"] || 30);
  const output = await validateSeedBatch({
    seedPath: args.seed,
    docxPath: args.docx,
    date: args.date,
    reportPath: args.report,
    reportOnly: Boolean(args["report-only"]),
    expectedCount,
  });
  console.log(`Article quality report: ${output.passed}/${output.articleCount} passed, ${output.failed} failed.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
