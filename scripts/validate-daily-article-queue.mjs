import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { assertProductionBatchSize, validateProductionSchedule } from "./daily-article-batch-policy.mjs";

function fail(message) {
  throw new Error(message);
}

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

function read(relativePath) {
  if (!existsSync(relativePath)) fail(`Missing file: ${relativePath}`);
  return readFileSync(relativePath, "utf8");
}

const args = parseArgs(process.argv.slice(2));
const date = String(args.date || "");
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail("Use --date YYYY-MM-DD");

const seedPath = path.resolve(args.seed || `scripts/daily-ziwei-${date}-seed.mjs`);
const { articles } = await import(`${pathToFileURL(seedPath).href}?t=${Date.now()}`);
if (!Array.isArray(articles)) fail("Seed file must export an articles array");
const expectedCount = assertProductionBatchSize(args["expected-count"] || articles.length);
if (articles.length !== expectedCount) fail(`Expected ${expectedCount} seed articles, got ${articles.length}`);
const ordered = [...articles].sort((left, right) => left.order - right.order);
if (ordered.some((article, index) => article.order !== index + 1)) fail("Article orders must be sequential from 1 through the batch size");
const queuePath = args.queue || `docs/ziwei-daily-${date}-queue.md`;
const sourcePath = args.source || `docs/ziwei-daily-${date}-source.md`;
const queue = read(queuePath);
const source = read(sourcePath);
const schedulePattern = new RegExp(`^(\\d{2})\\.\\s+${date}\\s+(\\d{2}:\\d{2})\\s+-\\s+(.+)$`, "gm");
const schedules = [...queue.matchAll(schedulePattern)];
const rows = [...queue.matchAll(/^\|\s*(\d{2})\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|$/gm)];
if (schedules.length !== expectedCount || rows.length !== expectedCount) fail(`Expected ${expectedCount} schedule lines and rows, got ${schedules.length}/${rows.length}`);

const recovery = /^Recovery-Mode:\s*true\s*$/m.test(queue);
const cadence = validateProductionSchedule(schedules.map((match) => match[2]), { recovery });

const pending = "\u5f85\u53d1\u5e03";
const collections = [
  "articles/index.html",
  "articles/en/index.html",
  "feed.xml",
  "articles/en/feed.xml",
  "sitemap.xml",
  "sitemap-articles.xml",
  "sitemap-en.xml",
].map((file) => [file, read(file)]);
const premature = [];

for (let index = 0; index < ordered.length; index += 1) {
  const article = ordered[index];
  const order = String(article.order).padStart(2, "0");
  const schedule = schedules[index];
  const row = rows[index];
  if (schedule[1] !== order || schedule[3].trim() !== article.title) fail(`Schedule mismatch at ${order}`);
  if (row[1] !== order || row[2].trim() !== pending || row[3].trim() !== article.slug || row[4].trim() !== article.title || row[5].trim() !== article.category) {
    fail(`Queue row mismatch at ${order}`);
  }
  if (!source.includes(`## ${article.order}. ${article.title}`) || !source.includes(`slug\uff1a\`${article.slug}\``)) fail(`Source mismatch at ${order}`);
  for (const file of [`articles/${article.slug}.html`, `articles/en/${article.slug}.html`]) {
    if (existsSync(file)) premature.push(file);
  }
  for (const [file, content] of collections) {
    if (content.includes(article.slug)) premature.push(`${file}:${article.slug}`);
  }
}

if (premature.length) fail(`Future URLs were exposed early: ${premature.slice(0, 5).join(", ")}`);
console.log(JSON.stringify({
  date,
  articleCount: expectedCount,
  scheduleCount: expectedCount,
  rowCount: expectedCount,
  reviewMode: "single-article",
  releaseWindowCounts: cadence.windows,
  recoveryMode: cadence.recovery,
  minGapMinutes: Math.min(...cadence.gaps),
  prematureCount: 0,
}, null, 2));
