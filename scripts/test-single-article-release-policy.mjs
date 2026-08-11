import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const files = {
  publisher: readFileSync("scripts/publish-local-article-batch.mjs", "utf8"),
  release: readFileSync("scripts/release-daily-article-slot.mjs", "utf8"),
  queue: readFileSync("scripts/validate-daily-article-queue.mjs", "utf8"),
  generator: readFileSync("scripts/generate-daily-ziwei-batch.mjs", "utf8"),
};

for (const [name, source] of Object.entries(files)) {
  assert.doesNotMatch(source, /validateReviewManifest|validateDailyArticleQualityAtRelease|validate-daily-article-reviews/, `${name} must not use batch review gates`);
}

assert.doesNotMatch(files.publisher, /assertProductionBatchSize/, "publisher must accept one selected article");
assert.doesNotMatch(files.release, /pathToFileURL|args\.docx|--docx/, "release must not load a seed or DOCX");
assert.match(files.release, /assertProductionBatchSize\(queueCount, "Daily publishing plan"\)/, "daily plan still requires 10-30 slots");
assert.match(files.release, /"--count", "1"/, "release must publish one article at a time");
assert.doesNotMatch(files.generator, /Missing --docx|review-manifest/, "generation must allow direct editorial content");

console.log("Single-article release policy tests passed.");
