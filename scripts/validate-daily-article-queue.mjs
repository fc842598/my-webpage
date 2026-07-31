import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

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
if (!Array.isArray(articles) || articles.length !== 30) fail(`Expected 30 seed articles, got ${articles?.length || 0}`);

const queue = read(args.queue || `docs/ziwei-daily-${date}-queue.md`);
const source = read(args.source || `docs/ziwei-daily-${date}-source.md`);
const schedulePattern = new RegExp(`^(\\d{2})\\.\\s+${date}\\s+(\\d{2}:\\d{2})\\s+-\\s+(.+)$`, "gm");
const schedules = [...queue.matchAll(schedulePattern)];
const rows = [...queue.matchAll(/^\|\s*(\d{2})\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|$/gm)];
if (schedules.length !== 30 || rows.length !== 30) fail(`Expected 30 schedule lines and rows, got ${schedules.length}/${rows.length}`);

const minutes = schedules.map((match) => Number(match[2].slice(0, 2)) * 60 + Number(match[2].slice(3)));
if (new Set(minutes).size !== 30) fail("Publish times must be unique");
if (minutes.some((minute, index) => index > 0 && minute <= minutes[index - 1])) fail("Publish times must be sorted");
const gaps = minutes.slice(1).map((minute, index) => minute - minutes[index]);
if (gaps.some((gap) => gap < 10)) fail("Publish slots must be at least 10 minutes apart");
const buckets = Array(6).fill(0);
minutes.forEach((minute) => { buckets[Math.floor(minute / 240)] += 1; });
if (buckets.some((count) => count < 4)) fail(`Each four-hour bucket needs at least 4 slots: ${buckets.join(",")}`);

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

for (let index = 0; index < articles.length; index += 1) {
  const article = articles[index];
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
console.log(JSON.stringify({ date, articleCount: 30, scheduleCount: 30, rowCount: 30, bucketCounts: buckets, minGapMinutes: Math.min(...gaps), prematureCount: 0 }, null, 2));
