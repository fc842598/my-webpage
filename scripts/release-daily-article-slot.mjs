import { closeSync, existsSync, openSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { validateReviewManifest } from "./validate-daily-article-reviews.mjs";

const ROOT = process.cwd();
const SITE = "https://yuetianai.com";
const TOPIC_HUBS = [
  "ziwei-learning-path.html",
  "ziwei-palaces.html",
  "ziwei-four-transformations.html",
  "ziwei-main-stars.html",
  "ziwei-helper-malice-stars.html",
  "ziwei-case-patterns.html",
  "ziwei-cycles.html",
  "ziwei-money-career.html",
];
const BANNED_PUBLIC_TERMS = ["文稿里", "讲义里", "他说", "天纪", "倪海厦", "source-extract", "证据卡"];

function fail(message) {
  throw new Error(message);
}

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

function run(command, args, allowed = [0]) {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: "utf8", windowsHide: true });
  if (!allowed.includes(result.status)) {
    fail(`${command} ${args.join(" ")} failed (${result.status}): ${(result.stderr || result.stdout).trim()}`);
  }
  return result;
}

function git(args, allowed = [0]) {
  return run("git", args, allowed);
}

function shanghaiNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts().filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

function parseSlot(queue, date, order) {
  const schedule = queue.match(new RegExp(`^${order}\\.\\s+${date}\\s+(\\d{2}:\\d{2})\\s+-`, "m"));
  const row = queue.match(new RegExp(`^\\|\\s*${order}\\s*\\|\\s*([^|]+)\\|\\s*([^|]+)\\|\\s*([^|]+)\\|\\s*([^|]+)\\|\\s*$`, "m"));
  if (!schedule || !row) fail(`Queue slot ${order} is incomplete for ${date}`);
  return { plannedTime: schedule[1], status: row[1].trim(), slug: row[2].trim(), category: row[4].trim() };
}

function topicHubForCategory(category) {
  const label = String(category || "").trim();
  if (label.includes("看盘方法")) return "ziwei-learning-path.html";
  if (label.includes("宫位组合") || label.includes("婚恋与关系")) return "ziwei-palaces.html";
  if (label.includes("四化")) return "ziwei-four-transformations.html";
  if (label.includes("主星")) return "ziwei-main-stars.html";
  if (label.includes("辅煞曜")) return "ziwei-helper-malice-stars.html";
  if (label.includes("特定命例")) return "ziwei-case-patterns.html";
  if (label.includes("大限流年")) return "ziwei-cycles.html";
  if (label.includes("财运事业")) return "ziwei-money-career.html";
  return "";
}

function managedPaths(date, slug, category) {
  const topicHub = topicHubForCategory(category);
  const topicHubPaths = topicHub ? [`articles/${topicHub}`] : TOPIC_HUBS.map((file) => `articles/${file}`);
  return [
    `docs/ziwei-daily-${date}-queue.md`,
    `articles/${slug}.html`,
    `articles/en/${slug}.html`,
    "articles/index.html",
    "articles/en/index.html",
    "feed.xml",
    "articles/en/feed.xml",
    "sitemap.xml",
    "sitemap-articles.xml",
    "sitemap-en.xml",
    ...topicHubPaths,
  ];
}

function synchronizeRepository() {
  if (git(["diff", "--cached", "--quiet"], [0, 1]).status !== 0) fail("Refusing to publish while unrelated files are staged");
  git(["fetch", "origin", "master", "--quiet"]);
  const [behind, ahead] = git(["rev-list", "--left-right", "--count", "origin/master...HEAD"]).stdout.trim().split(/\s+/).map(Number);
  if (behind && ahead) fail(`Local master has diverged from origin/master (${behind} behind, ${ahead} ahead)`);
  if (behind) {
    git(["merge", "--ff-only", "origin/master"]);
    return { fastForwarded: true, behind, ahead: 0 };
  }
  if (ahead) git(["push", "origin", "master"]);
  return { fastForwarded: false, behind: 0, ahead };
}

function assertRepositoryReady(paths) {
  if (git(["diff", "--cached", "--quiet"], [0, 1]).status !== 0) fail("Refusing to publish while unrelated files are staged");
  const managedStatus = git(["status", "--porcelain", "--untracked-files=all", "--", ...paths]).stdout.trim();
  if (managedStatus) fail(`Managed release files are already dirty:\n${managedStatus}`);
}

function validatePage(file, expectedUrl, publishedAt) {
  const html = readFileSync(path.join(ROOT, file), "utf8");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi)];
  const nodes = blocks.flatMap((match) => {
    const value = JSON.parse(match[1]);
    return Array.isArray(value?.["@graph"]) ? value["@graph"] : [value];
  });
  const article = nodes.find((node) => ["Article", "BlogPosting"].includes(node?.["@type"]));
  if (!article || article.datePublished !== publishedAt || article.dateModified !== publishedAt) fail(`Invalid Article JSON-LD in ${file}`);
  if (!html.includes(`<link rel="canonical" href="${expectedUrl}">`)) fail(`Canonical mismatch in ${file}`);
  if (!html.includes("hreflang=")) fail(`Missing hreflang in ${file}`);
  const banned = BANNED_PUBLIC_TERMS.find((term) => html.includes(term));
  if (banned) fail(`Banned public term ${banned} in ${file}`);
}

function validateCollections(slug, topicHub) {
  const files = ["articles/index.html", "articles/en/index.html", "feed.xml", "articles/en/feed.xml", "sitemap.xml", "sitemap-articles.xml", "sitemap-en.xml"];
  if (topicHub) files.push(`articles/${topicHub}`);
  for (const file of files) {
    if (!readFileSync(path.join(ROOT, file), "utf8").includes(slug)) fail(`${file} does not include ${slug}`);
  }
}

async function verifyOnline(slug, topicHub) {
  const urls = [
    `${SITE}/articles/${slug}.html`,
    `${SITE}/articles/en/${slug}.html`,
    `${SITE}/articles/index.html`,
    `${SITE}/articles/en/index.html`,
    `${SITE}/feed.xml`,
    `${SITE}/articles/en/feed.xml`,
    `${SITE}/sitemap.xml`,
    `${SITE}/sitemap-articles.xml`,
    `${SITE}/sitemap-en.xml`,
  ];
  if (topicHub) urls.push(`${SITE}/articles/${topicHub}`);
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const checks = await Promise.all(urls.map(async (url) => {
      const response = await fetch(url, { cache: "no-store" });
      const body = await response.text();
      return response.ok && body.includes(slug);
    }));
    if (checks.every(Boolean)) return;
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  fail(`Online verification timed out for ${slug}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const date = String(args.date || "");
  const order = String(args.order || "").padStart(2, "0");
  const syncRestarts = Number(args["sync-restarts"] || 0);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}$/.test(order)) fail("Use --date YYYY-MM-DD --order NN");
  if (!Number.isInteger(syncRestarts) || syncRestarts < 0 || syncRestarts > 2) fail("Invalid internal sync restart count");
  const sync = synchronizeRepository();
  if (sync.fastForwarded) {
    if (syncRestarts >= 2) fail("Remote master changed repeatedly during release synchronization");
    const restarted = spawnSync(process.execPath, [path.resolve(process.argv[1]), ...process.argv.slice(2), "--sync-restarts", String(syncRestarts + 1)], {
      cwd: ROOT,
      encoding: "utf8",
      windowsHide: true,
    });
    if (restarted.stdout) process.stdout.write(restarted.stdout);
    if (restarted.stderr) process.stderr.write(restarted.stderr);
    if (restarted.status !== 0) fail(`Restart after fast-forward failed (${restarted.status})`);
    return;
  }
  const queuePath = `docs/ziwei-daily-${date}-queue.md`;
  const sourcePath = `docs/ziwei-daily-${date}-source.md`;
  if (!existsSync(queuePath) || !existsSync(sourcePath)) fail(`Missing source or queue for ${date}`);
  const reviewGate = await validateReviewManifest({
    date,
    seedPath: `scripts/daily-ziwei-${date}-seed.mjs`,
    manifestPath: `docs/article-reviews/${date}-review-manifest.json`,
    sourcePath,
    expectedCount: 30,
  });

  let queue = readFileSync(queuePath, "utf8");
  const slot = parseSlot(queue, date, order);
  const paths = managedPaths(date, slot.slug, slot.category);
  const topicHub = topicHubForCategory(slot.category);
  const zhFile = `articles/${slot.slug}.html`;
  const enFile = `articles/en/${slot.slug}.html`;
  const alreadyPublished = slot.status.includes("http") && existsSync(zhFile) && existsSync(enFile);
  if (alreadyPublished) {
    if (!args["skip-online-check"]) await verifyOnline(slot.slug, topicHub);
    console.log(`Slot ${order} already published: ${slot.slug}`);
    return;
  }
  if (existsSync(zhFile) || existsSync(enFile) || slot.status.includes("http")) fail(`Partial release state for slot ${order}`);

  const now = shanghaiNow();
  if (args["allow-early"] && !args["dry-run"]) fail("--allow-early is restricted to --dry-run checks");
  if (!args["allow-early"] && (now.date !== date || now.time < slot.plannedTime)) {
    fail(`Slot ${order} is scheduled for ${date} ${slot.plannedTime}; now is ${now.date} ${now.time}`);
  }
  if (args["dry-run"]) {
    console.log(JSON.stringify({ date, order, slug: slot.slug, plannedTime: slot.plannedTime, reviewerCount: reviewGate.reviewerCount, reviewBatchHash: reviewGate.batchHash, managedPaths: paths, now }, null, 2));
    return;
  }

  assertRepositoryReady([...paths, ...reviewGate.artifactPaths]);
  const lockPath = path.join(ROOT, ".git", "yuetian-article-release.lock");
  const lock = openSync(lockPath, "wx");
  closeSync(lock);
  try {
    const releaseNow = shanghaiNow();
    if (releaseNow.date !== date || releaseNow.time < slot.plannedTime) fail(`Release time moved outside slot ${date} ${slot.plannedTime}`);
    const publishTime = releaseNow.time;
    const publishedAt = `${date}T${publishTime}:00+08:00`;
    run(process.execPath, [
      "scripts/publish-local-article-batch.mjs",
      "--queue", queuePath,
      "--source", sourcePath,
      "--count", "1",
      "--order", order,
      "--date", date,
      "--time", publishTime,
    ]);
    if (publishTime !== slot.plannedTime) {
      queue = readFileSync(queuePath, "utf8").replace(
        new RegExp(`^${order}\\.\\s+${date}\\s+${slot.plannedTime}\\s+-`, "m"),
        `${order}. ${date} ${publishTime} -`,
      );
      writeFileSync(queuePath, queue, "utf8");
    }
    validatePage(zhFile, `${SITE}/${zhFile}`, publishedAt);
    validatePage(enFile, `${SITE}/${enFile}`, publishedAt);
    validateCollections(slot.slug, topicHub);

    git(["add", "--", ...paths]);
    const staged = git(["diff", "--cached", "--name-only"]).stdout.trim().split(/\r?\n/).filter(Boolean);
    const allowed = new Set(paths);
    const unexpected = staged.filter((file) => !allowed.has(file.replace(/\\/g, "/")));
    if (unexpected.length) fail(`Unexpected staged files:\n${unexpected.join("\n")}`);
    git(["commit", "-m", `Publish Ziwei article ${date} ${publishTime} (${order}/30)`]);
    git(["push", "origin", "master"]);
    git(["fetch", "origin", "master", "--quiet"]);
    const head = git(["rev-parse", "HEAD"]).stdout.trim();
    const remote = git(["rev-parse", "origin/master"]).stdout.trim();
    if (head !== remote) fail("HEAD does not match origin/master after push");
    if (!args["skip-online-check"]) await verifyOnline(slot.slug, topicHub);
    console.log(JSON.stringify({ date, order, slug: slot.slug, publishedAt, commit: head, online: !args["skip-online-check"] }, null, 2));
  } finally {
    if (existsSync(lockPath)) unlinkSync(lockPath);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
