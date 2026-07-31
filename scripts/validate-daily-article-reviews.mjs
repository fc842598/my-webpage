import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();

export const REQUIRED_REVIEW_ROLES = [
  "ziwei-logic",
  "human-tone",
  "seo-intent",
  "english-naturalness",
  "reader-value",
];

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

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

function hash(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function normalizeText(value) {
  return String(value || "").replace(/\r\n/g, "\n");
}

function bodyOf(article) {
  const opening = article.openingParagraphs.join("\n\n");
  const sections = article.sections.map((section) => `### ${section.heading}\n${section.paragraphs.join("\n\n")}`).join("\n\n");
  return `${opening}\n\n${sections}\n\n### 排盘使用顺序\n${article.orderText}`;
}

function englishBodyOf(article) {
  const english = article.english;
  const opening = english.openingParagraphs.join("\n\n");
  const sections = english.sections.map((section) => `### ${section.heading}\n${section.paragraphs.join("\n\n")}`).join("\n\n");
  return `${opening}\n\n${sections}\n\n### Practical Reading Order\n${english.orderText}`;
}

export function dailyArticleSourceText(date, articles) {
  const ordered = [...articles].sort((left, right) => left.order - right.order);
  const blocks = ordered.map((article) => {
    const evidence = article.evidence.join("、");
    const sourceHints = [
      `同步文稿段 ${evidence}`,
      `核心判断：${article.points.join("；")}`,
      `组合例子：${article.examples.join("；")}`,
    ].join("。");
    return `## ${article.order}. ${article.title}
slug：\`${article.slug}\`
搜索意图：${article.intent}
素材线索：${sourceHints}
正文草稿：
${bodyOf(article)}

英文标题：${article.english.title}
英文描述：${article.english.description}
英文正文：
${englishBodyOf(article)}`;
  });

  return `# 紫微文章源稿 ${date}

本批次共 ${ordered.length} 篇，均用于当天中英文配对发布。正文只吸收同步文稿里的判断条件、组合逻辑和落宫例子，不保留来源痕迹。

${blocks.join("\n\n---\n\n")}
`;
}

export function validateDailyArticleSourceText({ date, articles, sourceText }) {
  const expected = dailyArticleSourceText(date, articles);
  if (normalizeText(sourceText) !== expected) {
    throw new Error("Reviewed source draft does not exactly match the current seed");
  }
  return hash(expected);
}

export function articleReviewHash(article) {
  return hash(JSON.stringify(stableValue(article)));
}

export function reviewBatchHash(articles) {
  const rows = [...articles]
    .sort((left, right) => left.order - right.order)
    .map((article) => `${String(article.order).padStart(2, "0")}:${article.slug}:${articleReviewHash(article)}`);
  return hash(rows.join("\n"));
}

export function validateReviewManifestData({ date, seedPath, articles, manifest, reportTexts, expectedCount = 30 }) {
  const errors = [];
  const ordered = [...articles].sort((left, right) => left.order - right.order);
  const currentBatchHash = reviewBatchHash(ordered);
  const currentSourceHash = hash(dailyArticleSourceText(date, ordered));
  const expectedSeed = normalizePath(seedPath);
  const reviewers = Array.isArray(manifest?.reviewers) ? manifest.reviewers : [];
  const articleReviews = Array.isArray(manifest?.articles) ? manifest.articles : [];
  const reviewerIds = reviewers.map((item) => item.id);
  const reviewerReports = reviewers.map((item) => normalizePath(item.report));
  const reviewBySlug = new Map(articleReviews.map((item) => [item.slug, item]));

  if (manifest?.version !== 1) errors.push("review manifest version must be 1");
  if (manifest?.date !== date) errors.push(`review manifest date must be ${date}`);
  if (normalizePath(manifest?.seed) !== expectedSeed) errors.push(`review manifest seed must be ${expectedSeed}`);
  if (manifest?.articleCount !== expectedCount || ordered.length !== expectedCount) errors.push(`reviewed article count must be ${expectedCount}`);
  if (manifest?.batchHash !== currentBatchHash) errors.push("review batch hash does not match the current seed");
  if (manifest?.sourceHash !== currentSourceHash) errors.push("review source hash does not match the current seed");
  if (new Set(reviewerIds).size !== reviewerIds.length) errors.push("reviewer ids must be unique");
  if (new Set(reviewerReports).size !== reviewerReports.length) errors.push("each reviewer must use a distinct report file");
  if (new Set(ordered.map((item) => item.order)).size !== ordered.length) errors.push("seed article orders must be unique");
  if (new Set(articleReviews.map((item) => item.order)).size !== articleReviews.length) errors.push("reviewed article orders must be unique");
  if (new Set(articleReviews.map((item) => item.slug)).size !== articleReviews.length) errors.push("reviewed article slugs must be unique");

  const missingRoles = REQUIRED_REVIEW_ROLES.filter((role) => !reviewerIds.includes(role));
  const extraRoles = reviewerIds.filter((role) => !REQUIRED_REVIEW_ROLES.includes(role));
  if (missingRoles.length || extraRoles.length) errors.push(`review roles mismatch; missing=${missingRoles.join(",") || "none"}; extra=${extraRoles.join(",") || "none"}`);
  if (articleReviews.length !== ordered.length) errors.push("review manifest article rows do not cover the current batch");

  for (const reviewer of reviewers) {
    const reportPath = normalizePath(reviewer.report);
    const report = reportTexts[reportPath];
    if (reviewer.status !== "PASS") errors.push(`${reviewer.id} reviewer did not pass`);
    if (reviewer.articleCount !== expectedCount) errors.push(`${reviewer.id} reviewer article count mismatch`);
    if (reviewer.batchHash !== currentBatchHash) errors.push(`${reviewer.id} reviewer batch hash mismatch`);
    if (reviewer.sourceHash !== currentSourceHash) errors.push(`${reviewer.id} reviewer source hash mismatch`);
    if (!report) {
      errors.push(`${reviewer.id} review report is missing: ${reportPath}`);
      continue;
    }
    if (!report.includes(`Reviewer-ID: \`${reviewer.id}\``)) errors.push(`${reviewer.id} report id marker is missing`);
    if (!report.includes(`Batch-Hash: \`${currentBatchHash}\``)) errors.push(`${reviewer.id} report batch hash marker is missing`);
    if (!report.includes(`Source-Hash: \`${currentSourceHash}\``)) errors.push(`${reviewer.id} report source hash marker is missing`);
    const rows = [...report.matchAll(/^\|\s*(\d{2})\s*\|\s*([^|]+?)\s*\|\s*([a-f0-9]{64})\s*\|\s*(PASS|FAIL)\s*\|$/gm)];
    if (rows.length !== expectedCount) errors.push(`${reviewer.id} report must contain exactly ${expectedCount} result rows`);
  }

  for (const article of ordered) {
    const order = String(article.order).padStart(2, "0");
    const contentHash = articleReviewHash(article);
    const record = reviewBySlug.get(article.slug);
    if (!record) {
      errors.push(`${article.slug} is missing from review manifest`);
      continue;
    }
    if (record.order !== article.order) errors.push(`${article.slug} review order mismatch`);
    if (record.title !== article.title) errors.push(`${article.slug} review title mismatch`);
    if (record.contentHash !== contentHash) errors.push(`${article.slug} content changed after review`);
    const reviewStatuses = record.reviews && typeof record.reviews === "object" ? record.reviews : {};
    for (const role of REQUIRED_REVIEW_ROLES) {
      if (reviewStatuses[role] !== "PASS") errors.push(`${article.slug} is missing PASS from ${role}`);
      const reviewer = reviewers.find((item) => item.id === role);
      const report = reviewer ? reportTexts[normalizePath(reviewer.report)] : "";
      const expectedRow = `| ${order} | ${article.slug} | ${contentHash} | PASS |`;
      if (report && !report.includes(expectedRow)) errors.push(`${role} report is not bound to ${article.slug}`);
    }
    const extraReviewRoles = Object.keys(reviewStatuses).filter((role) => !REQUIRED_REVIEW_ROLES.includes(role));
    if (extraReviewRoles.length) errors.push(`${article.slug} has unexpected review roles: ${extraReviewRoles.join(",")}`);
  }

  const currentSlugs = new Set(ordered.map((article) => article.slug));
  const extraArticles = articleReviews.filter((item) => !currentSlugs.has(item.slug));
  if (extraArticles.length) errors.push(`review manifest has extra articles: ${extraArticles.map((item) => item.slug).join(",")}`);

  if (errors.length) {
    throw new Error(`Five-review gate failed:\n- ${[...new Set(errors)].slice(0, 30).join("\n- ")}`);
  }
  return {
    date,
    articleCount: ordered.length,
    reviewerCount: reviewers.length,
    batchHash: currentBatchHash,
    sourceHash: currentSourceHash,
    reportPaths: reviewers.map((item) => normalizePath(item.report)),
  };
}

function resolveReviewPath(relativePath) {
  if (!relativePath) throw new Error("Review artifact path is required");
  const resolved = path.resolve(ROOT, relativePath);
  const relative = path.relative(ROOT, resolved);
  const outsideRoot = relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
  if (outsideRoot) throw new Error(`Review artifact must stay inside the repository: ${relativePath}`);
  return resolved;
}

export async function validateReviewManifest({ date, seedPath, manifestPath, sourcePath, expectedCount = 30 }) {
  const resolvedSeed = resolveReviewPath(seedPath);
  const resolvedManifest = resolveReviewPath(manifestPath || `docs/article-reviews/${date}-review-manifest.json`);
  if (!existsSync(resolvedSeed)) throw new Error(`Review seed not found: ${seedPath}`);
  if (!existsSync(resolvedManifest)) throw new Error(`Five-review manifest not found: ${path.relative(ROOT, resolvedManifest)}`);
  const { articles } = await import(`${pathToFileURL(resolvedSeed).href}?review=${Date.now()}`);
  if (!Array.isArray(articles)) throw new Error(`Review seed must export an articles array: ${seedPath}`);
  const manifest = JSON.parse(readFileSync(resolvedManifest, "utf8"));
  const reportTexts = {};
  const manifestReviewers = Array.isArray(manifest.reviewers) ? manifest.reviewers : [];
  for (const reviewer of manifestReviewers) {
    const reportPath = normalizePath(reviewer.report);
    if (!reportPath) continue;
    const resolvedReport = resolveReviewPath(reportPath);
    if (existsSync(resolvedReport)) reportTexts[reportPath] = readFileSync(resolvedReport, "utf8");
  }
  const summary = validateReviewManifestData({
    date,
    seedPath: normalizePath(path.relative(ROOT, resolvedSeed)),
    articles,
    manifest,
    reportTexts,
    expectedCount,
  });
  let resolvedSource;
  if (sourcePath) {
    resolvedSource = resolveReviewPath(sourcePath);
    if (!existsSync(resolvedSource)) throw new Error(`Reviewed source draft not found: ${sourcePath}`);
    validateDailyArticleSourceText({
      date,
      articles,
      sourceText: readFileSync(resolvedSource, "utf8"),
    });
  }
  const seedArtifact = normalizePath(path.relative(ROOT, resolvedSeed));
  const sourceArtifact = resolvedSource ? normalizePath(path.relative(ROOT, resolvedSource)) : null;
  return {
    ...summary,
    manifestPath: normalizePath(path.relative(ROOT, resolvedManifest)),
    artifactPaths: [
      seedArtifact,
      normalizePath(path.relative(ROOT, resolvedManifest)),
      ...summary.reportPaths,
      ...(sourceArtifact ? [sourceArtifact] : []),
    ],
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const date = String(args.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !args.seed) {
    throw new Error("Usage: node scripts/validate-daily-article-reviews.mjs --date YYYY-MM-DD --seed FILE [--manifest FILE] [--source FILE]");
  }
  const summary = await validateReviewManifest({
    date,
    seedPath: args.seed,
    manifestPath: args.manifest,
    sourcePath: args.source,
    expectedCount: Number(args["expected-count"] || 30),
  });
  console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
