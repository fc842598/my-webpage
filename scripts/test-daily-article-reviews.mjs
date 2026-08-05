import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  dailyArticleSourceText,
  articleReviewHash,
  reviewBatchHash,
  validateDailyArticleSourceText,
  validateReviewManifestData,
} from "./validate-daily-article-reviews.mjs";

const date = "2026-08-01";
const seedPath = "scripts/daily-ziwei-2026-08-01-seed.mjs";
const manifest = JSON.parse(readFileSync("docs/article-reviews/2026-08-01-review-manifest.json", "utf8"));
const { articles } = await import(`${pathToFileURL(`${process.cwd()}/${seedPath}`).href}?test=${Date.now()}`);
const reportTexts = Object.fromEntries(manifest.reviewers.map((reviewer) => [
  reviewer.report,
  readFileSync(reviewer.report, "utf8"),
]));

const valid = validateReviewManifestData({
  date,
  seedPath,
  articles,
  manifest,
  reportTexts,
});
assert.equal(valid.articleCount, 30);
assert.equal(valid.reviewerCount, 5);

const tenArticles = articles.slice(0, 10);
const tenBatchHash = reviewBatchHash(tenArticles);
const tenSourceHash = createHash("sha256").update(dailyArticleSourceText(date, tenArticles), "utf8").digest("hex");
const tenManifest = structuredClone(manifest);
tenManifest.articleCount = 10;
tenManifest.batchHash = tenBatchHash;
tenManifest.sourceHash = tenSourceHash;
tenManifest.articles = tenManifest.articles.slice(0, 10);
for (const reviewer of tenManifest.reviewers) {
  reviewer.articleCount = 10;
  reviewer.batchHash = tenBatchHash;
  reviewer.sourceHash = tenSourceHash;
}
const tenReportTexts = Object.fromEntries(tenManifest.reviewers.map((reviewer) => [
  reviewer.report,
  [
    `Reviewer-ID: \`${reviewer.id}\``,
    `Batch-Hash: \`${tenBatchHash}\``,
    `Source-Hash: \`${tenSourceHash}\``,
    ...tenArticles.map((article) => `| ${String(article.order).padStart(2, "0")} | ${article.slug} | ${articleReviewHash(article)} | PASS |`),
  ].join("\n"),
]));
const validTen = validateReviewManifestData({
  date,
  seedPath,
  articles: tenArticles,
  manifest: tenManifest,
  reportTexts: tenReportTexts,
  expectedCount: 10,
});
assert.equal(validTen.articleCount, 10);
assert.equal(validTen.reviewerCount, 5);

const sourceText = readFileSync("docs/ziwei-daily-2026-08-01-source.md", "utf8");
assert.equal(sourceText, dailyArticleSourceText(date, articles));
assert.match(validateDailyArticleSourceText({ date, articles, sourceText }), /^[a-f0-9]{64}$/);
assert.throws(
  () => validateDailyArticleSourceText({ date, articles, sourceText: sourceText.replace("正文草稿：", "正文草稿：未经复审") }),
  /does not exactly match/,
);

const changedArticles = structuredClone(articles);
changedArticles[0].directAnswer += " 未经复审的改字。";
assert.throws(
  () => validateReviewManifestData({ date, seedPath, articles: changedArticles, manifest, reportTexts }),
  /batch hash does not match|content changed after review/,
);

const staleSourceHash = structuredClone(manifest);
staleSourceHash.sourceHash = "0".repeat(64);
assert.throws(
  () => validateReviewManifestData({ date, seedPath, articles, manifest: staleSourceHash, reportTexts }),
  /source hash does not match/,
);

const missingReviewer = structuredClone(manifest);
missingReviewer.reviewers = missingReviewer.reviewers.filter((reviewer) => reviewer.id !== "reader-value");
assert.throws(
  () => validateReviewManifestData({ date, seedPath, articles, manifest: missingReviewer, reportTexts }),
  /review roles mismatch/,
);

const sharedReport = structuredClone(manifest);
sharedReport.reviewers[1].report = sharedReport.reviewers[0].report;
assert.throws(
  () => validateReviewManifestData({ date, seedPath, articles, manifest: sharedReport, reportTexts }),
  /distinct report file/,
);

const duplicateOrder = structuredClone(manifest);
duplicateOrder.articles[1].order = duplicateOrder.articles[0].order;
assert.throws(
  () => validateReviewManifestData({ date, seedPath, articles, manifest: duplicateOrder, reportTexts }),
  /reviewed article orders must be unique/,
);

const tamperedReports = { ...reportTexts };
const firstReport = manifest.reviewers[0].report;
tamperedReports[firstReport] = tamperedReports[firstReport].replace("| 01 |", "| XX |");
assert.throws(
  () => validateReviewManifestData({ date, seedPath, articles, manifest, reportTexts: tamperedReports }),
  /report is not bound/,
);

console.log("Daily five-review gate tests passed.");
