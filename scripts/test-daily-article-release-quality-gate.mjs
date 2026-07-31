import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateDailyArticleQualityAtRelease } from "./validate-daily-ziwei-seed.mjs";

const current = await validateDailyArticleQualityAtRelease({ date: "2026-08-01" });
assert.equal(current.version, 5);
assert.equal(current.articleCount, 30);
assert.equal(current.passed, 30);
assert.equal(current.failed, 0);
assert.equal(current.existingTitleSource, "committed");

await assert.rejects(
  validateDailyArticleQualityAtRelease({
    date: "2026-08-02",
    seedPath: "scripts/daily-ziwei-2026-08-01-seed.mjs",
  }),
  /Release quality gate failed[\s\S]*缺少 demandEvidence 用户需求来源卡/,
);

await assert.rejects(
  validateDailyArticleQualityAtRelease({
    date: "2026-08-01",
    seedPath: "scripts/missing-daily-ziwei-seed.mjs",
  }),
  /Release quality gate failed[\s\S]*Cannot find module/,
);

for (const file of [
  "scripts/validate-daily-article-queue.mjs",
  "scripts/release-daily-article-slot.mjs",
  "scripts/publish-local-article-batch.mjs",
]) {
  const source = readFileSync(file, "utf8");
  assert.match(source, /validateDailyArticleQualityAtRelease\s*\(/, `${file} must enforce release-time quality validation`);
}

console.log("Daily article release quality gate tests passed.");
