import path from "node:path";
import { pathToFileURL } from "node:url";
import { writeFile } from "node:fs/promises";
import { dailyArticleSourceText } from "./daily-article-source.mjs";
import { validateSeedBatch } from "./validate-daily-ziwei-seed.mjs";
import { assertProductionBatchSize, validateProductionSchedule } from "./daily-article-batch-policy.mjs";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) fail(`Missing value for --${key}`);
    args[key] = value;
    i += 1;
  }
  return args;
}

function parseTimes(input, production, recovery = false) {
  if (!input) fail("Missing --times");
  const times = input.split(",").map((item) => item.trim()).filter(Boolean);
  if (!times.length) fail("No publish times found");
  for (const time of times) {
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) fail(`Invalid time: ${time}`);
  }
  const unique = new Set(times);
  if (unique.size !== times.length) fail("Publish times must be unique");
  const sorted = [...times].sort();
  if (sorted.join(",") !== times.join(",")) fail("Publish times must already be sorted");
  if (production) validateProductionSchedule(times, { recovery });
  return times;
}

function queueText(date, articles, times) {
  const schedule = articles.map((article, index) => {
    const order = String(article.order).padStart(2, "0");
    return `${order}. ${date} ${times[index]} - ${article.title}`;
  }).join("\n");

  const rows = articles.map((article) => {
    const order = String(article.order).padStart(2, "0");
    return `| ${order} | 待发布 | ${article.slug} | ${article.title} | ${article.category} |`;
  }).join("\n");

  return `# 紫微文章发布队列 ${date}

规则：本批次用于 ${date} 的每日 ${articles.length} 篇紫微文章发布。中文页、英文页、索引、feed、sitemap 与 hreflang 统一由脚本生成。

## 发布时间表

${schedule}

| 顺序 | 状态 | slug | 标题 | 大类 |
|---|---|---|---|---|
${rows}
`;
}

const args = parseArgs(process.argv.slice(2));
const seedArg = args.seed;
const date = args.date;
const testMode = args["test-mode"] === "true";
const recovery = args.recovery === "true";

if (!seedArg) fail("Missing --seed");
if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) fail("Missing or invalid --date");
const seedPath = path.resolve(seedArg);
const { articles } = await import(`${pathToFileURL(seedPath).href}?t=${Date.now()}`);
if (!Array.isArray(articles) || !articles.length) fail("Seed file did not export articles");
const expectedCount = Number(args["expected-count"] || articles.length);
if (testMode && expectedCount >= 10) fail("Test mode is restricted to batches smaller than the 10-article production minimum");
if (!testMode) {
  try {
    assertProductionBatchSize(expectedCount);
  } catch (error) {
    fail(error.message);
  }
}

await validateSeedBatch({
  seedPath,
  date,
  reportPath: args.report || `docs/article-quality-${date}.json`,
  reportOnly: true,
});

const ordered = [...articles].sort((a, b) => a.order - b.order);
if (ordered.some((article, index) => article.order !== index + 1)) fail("Article orders must be sequential from 1 through the batch size");
const times = parseTimes(args.times, !testMode, recovery);
if (times.length !== ordered.length) fail(`Need ${ordered.length} publish times, got ${times.length}`);

const sourcePath = path.resolve(args.source || `docs/ziwei-daily-${date}-source.md`);
const queuePath = path.resolve(args.queue || `docs/ziwei-daily-${date}-queue.md`);

await writeFile(sourcePath, dailyArticleSourceText(date, ordered), "utf8");
const queueOutput = queueText(date, ordered, times).replace("\n", `\n\nRecovery-Mode: ${recovery ? "true" : "false"}\n`);
await writeFile(queuePath, queueOutput, "utf8");

console.log(`Wrote ${path.relative(process.cwd(), sourcePath)}`);
console.log(`Wrote ${path.relative(process.cwd(), queuePath)}`);
