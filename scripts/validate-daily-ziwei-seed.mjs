import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = process.env.YUETIAN_BATCH_ROOT
  ? path.resolve(process.env.YUETIAN_BATCH_ROOT)
  : process.cwd();
const BANNED_PUBLIC_TERMS = ["文稿里", "讲义里", "他说", "天纪", "倪海厦", "source-extract", "证据卡"];

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) args[token.slice(2)] = true;
    else {
      args[token.slice(2)] = next;
      index += 1;
    }
  }
  return args;
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
}

function ngrams(value, size = 2) {
  const text = normalize(value);
  if (!text) return new Set();
  if (text.length <= size) return new Set([text]);
  return new Set(Array.from({ length: text.length - size + 1 }, (_, index) => text.slice(index, index + size)));
}

export function similarity(left, right) {
  const a = ngrams(left);
  const b = ngrams(right);
  if (!a.size || !b.size) return 0;
  let overlap = 0;
  for (const item of a) if (b.has(item)) overlap += 1;
  return (2 * overlap) / (a.size + b.size);
}

function sectionText(sections) {
  return Array.isArray(sections)
    ? sections.flatMap((section) => [section?.heading, ...(Array.isArray(section?.paragraphs) ? section.paragraphs : [])]).filter(Boolean).join("\n")
    : "";
}

function chineseBody(article) {
  if (article.body || article.content) return String(article.body || article.content);
  return [
    ...(Array.isArray(article.openingParagraphs) ? article.openingParagraphs : []),
    sectionText(article.sections),
    article.orderText,
  ].filter(Boolean).join("\n");
}

function englishBody(article) {
  const english = article.english || {};
  if (english.body || english.content) return String(english.body || english.content);
  return [
    ...(Array.isArray(english.openingParagraphs) ? english.openingParagraphs : []),
    sectionText(english.sections),
    english.orderText,
  ].filter(Boolean).join("\n");
}

function publicTermFailures(article) {
  const text = `${chineseBody(article)}\n${englishBody(article)}`;
  return BANNED_PUBLIC_TERMS.filter((term) => text.includes(term)).map((term) => `正文含禁用来源词：${term}`);
}

function articleTitleFromHtml(html) {
  return html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim()
    || html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.split("|")[0]?.trim()
    || "";
}

function existingTitles(directory) {
  const full = path.join(ROOT, directory);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter((file) => file.endsWith(".html") && file !== "index.html")
    .map((file) => ({ file, title: articleTitleFromHtml(readFileSync(path.join(full, file), "utf8")) }))
    .filter((item) => item.title);
}

function similarityWarnings(article, history, batch, language = "中文") {
  const warnings = [];
  const titleOf = (item) => language === "英文" ? item.english?.title : item.title;
  const title = titleOf(article);
  if (!title) return warnings;
  const candidates = [
    ...history.map((item) => ({ source: item.file, title: item.title })),
    ...batch.filter((item) => item !== article).map((item) => ({ source: `本批次 ${item.slug || item.order}`, title: titleOf(item) })),
  ].filter((item) => item.title);
  const close = candidates
    .map((item) => ({ ...item, similarity: similarity(title, item.title) }))
    .filter((item) => item.similarity >= 0.68)
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, 3);
  for (const item of close) {
    warnings.push(`${language}标题可能相似（${item.similarity.toFixed(2)}）：${item.source}；请人工判断搜索意图是否真的重复`);
  }
  return warnings;
}

export function reviewSeedArticles(articles, { history = [], englishHistory = [] } = {}) {
  const ordered = [...articles].sort((left, right) => Number(left.order) - Number(right.order));
  const reports = ordered.map((article) => {
    const errors = [];
    if (!Number.isInteger(Number(article.order)) || Number(article.order) < 1) errors.push("order 必须是正整数");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(article.slug || ""))) errors.push("slug 格式无效");
    if (!String(article.title || "").trim()) errors.push("缺少中文标题");
    if (!chineseBody(article).trim()) errors.push("缺少中文正文");
    if (!String(article.english?.title || "").trim()) errors.push("缺少英文标题");
    if (!englishBody(article).trim()) errors.push("缺少英文正文");
    errors.push(...publicTermFailures(article));

    const warnings = [
      ...similarityWarnings(article, history, ordered, "中文"),
      ...similarityWarnings(article, englishHistory, ordered, "英文"),
    ];
    return {
      order: article.order,
      slug: article.slug,
      title: article.title,
      status: errors.length ? "needs-fix" : "ready",
      errors,
      warnings,
      metrics: {
        chineseCharacters: normalize(chineseBody(article)).length,
        englishWords: englishBody(article).trim().split(/\s+/).filter(Boolean).length,
        h2Count: Array.isArray(article.sections) ? article.sections.length : null,
        englishH2Count: Array.isArray(article.english?.sections) ? article.english.sections.length : null,
      },
    };
  });

  const batchErrors = [];
  const duplicateSlugs = ordered.map((item) => item.slug).filter((slug, index, all) => slug && all.indexOf(slug) !== index);
  if (duplicateSlugs.length) batchErrors.push(`批次 slug 重复：${[...new Set(duplicateSlugs)].join(", ")}`);
  return {
    version: 5,
    mode: "single-article-advisory",
    articleCount: reports.length,
    ready: reports.filter((item) => item.status === "ready").length,
    needsFix: reports.filter((item) => item.status === "needs-fix").length,
    warningCount: reports.reduce((sum, item) => sum + item.warnings.length, 0),
    batchErrors,
    articles: reports,
  };
}

export async function validateSeedBatch({ seedPath, date, reportPath, reportOnly = true }) {
  const resolvedSeed = path.resolve(seedPath);
  const seedModule = await import(`${pathToFileURL(resolvedSeed).href}?review=${Date.now()}`);
  const articles = Array.isArray(seedModule.articles) ? seedModule.articles : [];
  const history = existingTitles("articles");
  const englishHistory = existingTitles("articles/en");
  const output = {
    date,
    sourcePolicy: "optional-reference",
    duplicatePolicy: "manual-review-warning",
    ...reviewSeedArticles(articles, { history, englishHistory }),
  };
  const resolvedReport = path.resolve(reportPath || `docs/article-quality-${date}.json`);
  mkdirSync(path.dirname(resolvedReport), { recursive: true });
  writeFileSync(resolvedReport, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  if (!reportOnly && (output.needsFix || output.batchErrors.length)) {
    throw new Error(`Article technical review found ${output.needsFix} article(s) needing fixes`);
  }
  return output;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.seed || !args.date) throw new Error("Usage: node scripts/validate-daily-ziwei-seed.mjs --seed FILE --date YYYY-MM-DD [--report FILE] [--strict]");
  const output = await validateSeedBatch({
    seedPath: args.seed,
    date: args.date,
    reportPath: args.report,
    reportOnly: !args.strict,
  });
  console.log(`Article advisory review: ${output.ready}/${output.articleCount} ready, ${output.warningCount} warning(s).`);
}
