import assert from "node:assert/strict";
import {
  demandSignalsFromReport,
  validateBatchDemandEvidence,
  validateDemandEvidence,
} from "./validate-daily-ziwei-seed.mjs";

const liveReport = {
  version: 3,
  date: "2026-08-02",
  days: 30,
  generatedAt: "2026-08-01T01:10:00.000Z",
  source: {
    type: "live-admin-api",
    reference: "https://api.yuetianai.com",
    searchConsoleOk: true,
    ga4Ok: true,
  },
  topQueries: [{ query: "real query 1", impressions: 3, clicks: 1 }],
  winners: [{
    page: "/articles/proven-topic.html",
    clicks: 2,
    impressions: 8,
    pageViews: 0,
    learning: { action: "expand-distinct-intent" },
  }],
};

const trustedSignals = demandSignalsFromReport(liveReport, {
  date: "2026-08-02",
  reportPath: "docs/article-performance-2026-08-02.json",
});
assert.equal(trustedSignals.available, true);
assert.equal(trustedSignals.queries.has("realquery1"), true);
assert.equal(trustedSignals.pages.has("/articles/proven-topic.html"), true);

const staleSignals = demandSignalsFromReport({ ...liveReport, generatedAt: "2026-07-30T01:10:00.000Z" }, { date: "2026-08-02" });
assert.match(staleSignals.error, /generatedAt/);
const renamedSignals = demandSignalsFromReport({ ...liveReport, date: "2026-08-01" }, { date: "2026-08-02" });
assert.match(renamedSignals.error, /日期/);
const legacySignals = demandSignalsFromReport({ ...liveReport, version: 2 }, { date: "2026-08-02" });
assert.match(legacySignals.error, /版本/);
const wrongApiSignals = demandSignalsFromReport({
  ...liveReport,
  source: { ...liveReport.source, reference: "https://example.com" },
}, { date: "2026-08-02" });
assert.match(wrongApiSignals.error, /api\.yuetianai\.com/);
const stringStatusSignals = demandSignalsFromReport({
  ...liveReport,
  source: { ...liveReport.source, searchConsoleOk: "true", ga4Ok: "false" },
}, { date: "2026-08-02" });
assert.equal(stringStatusSignals.available, false);
const importedSignals = demandSignalsFromReport({
  ...liveReport,
  source: { ...liveReport.source, type: "input-file" },
}, { date: "2026-08-02" });
assert.equal(importedSignals.available, false);
assert.equal(importedSignals.error, "");
assert.equal(importedSignals.queries.size, 0);

const malformedSignals = demandSignalsFromReport({
  ...liveReport,
  topQueries: "not-an-array",
  winners: "not-an-array",
}, { date: "2026-08-02" });
assert.equal(malformedSignals.available, false);
assert.match(malformedSignals.error, /topQueries/);
assert.equal(malformedSignals.queries.size, 0);
assert.equal(malformedSignals.pages.size, 0);

const lowSampleSignals = demandSignalsFromReport({
  ...liveReport,
  topQueries: [{ query: "one accidental impression", impressions: 1, clicks: 0 }],
  winners: [{
    ...liveReport.winners[0],
    clicks: 1,
    pageViews: 4,
  }],
}, { date: "2026-08-02" });
assert.equal(lowSampleSignals.queries.size, 0);
assert.equal(lowSampleSignals.pages.size, 0);

const signals = {
  available: true,
  report: "docs/article-performance-2026-08-02.json",
  queries: new Set(Array.from({ length: 8 }, (_, index) => `realquery${index + 1}`)),
  pages: new Set(["/articles/proven-topic.html"]),
  error: "",
};

function evidence(sourceType, reference, index) {
  return {
    sourceType,
    reference,
    query: `紫微斗数第${index}个真实用户问题应该怎么判断`,
    audience: `正在处理第${index}类现实选择并需要命盘判断顺序的用户`,
    decisionTrigger: `用户正准备在本周作出第${index}类决定，错误选择会带来真实时间或资金成本`,
    whySeparate: `这个问题有独立的决策对象、宫位主线与执行顺序，不能并入已有的宽泛入门文章`,
  };
}

const observed = validateDemandEvidence({
  demandEvidence: evidence("search-console", "real query 1", 1),
}, { required: true, signals });
assert.equal(observed.pass, true);
assert.equal(observed.anchored, true);
assert.equal(observed.confidence, "observed");

const adjacent = validateDemandEvidence({
  demandEvidence: evidence("site-performance", "https://yuetianai.com/articles/proven-topic.html", 2),
}, { required: true, signals });
assert.equal(adjacent.pass, true);
assert.equal(adjacent.anchored, true);
assert.equal(adjacent.confidence, "adjacent");

const editorial = validateDemandEvidence({
  demandEvidence: evidence("editorial-gap", "常见现实决策：背房贷时考虑换工作", 3),
}, { required: true, signals });
assert.equal(editorial.pass, true);
assert.equal(editorial.anchored, false);

const fakeEditorial = validateDemandEvidence({
  demandEvidence: evidence("editorial-gap", "GA4数据显示这个问题流量很高", 4),
}, { required: true, signals });
assert.ok(fakeEditorial.failures.some((message) => message.includes("不得冒充")));

const unknownSignal = validateDemandEvidence({
  demandEvidence: evidence("search-console", "not in report", 5),
}, { required: true, signals });
assert.ok(unknownSignal.failures.some((message) => message.includes("未出现在")));

const missing = validateDemandEvidence({}, { required: true, signals });
assert.equal(missing.pass, false);

const validBatch = Array.from({ length: 30 }, (_, index) => ({
  slug: `article-${index + 1}`,
  demandEvidence: index < 8
    ? evidence("search-console", `real query ${index + 1}`, index + 1)
    : evidence("editorial-gap", `第${index + 1}类明确现实决策场景`, index + 1),
}));
const validBatchReview = validateBatchDemandEvidence(validBatch, { required: true, signals });
assert.equal(validBatchReview.anchoredCount, 8);
assert.equal(validBatchReview.requiredAnchors, 8);
assert.deepEqual(validBatchReview.batchFailures, []);
assert.ok(validBatchReview.reviews.every((review) => review.pass));

const staleReportReview = validateBatchDemandEvidence(validBatch, { required: true, signals: staleSignals });
assert.ok(staleReportReview.batchFailures.some((message) => message.includes("完整性失败")));

const editorialOnlyBatch = Array.from({ length: 30 }, (_, index) => ({
  slug: `editorial-${index + 1}`,
  demandEvidence: evidence("editorial-gap", `第${index + 1}类独立现实决策场景`, index + 1),
}));
const offlineEditorialReview = validateBatchDemandEvidence(editorialOnlyBatch, { required: true, signals: importedSignals });
assert.equal(offlineEditorialReview.requiredAnchors, 0);
assert.deepEqual(offlineEditorialReview.batchFailures, []);
assert.ok(offlineEditorialReview.reviews.every((review) => review.pass));

const weakBatch = structuredClone(validBatch);
weakBatch[7].demandEvidence = evidence("editorial-gap", "第八类编辑判断场景", 8);
const weakBatchReview = validateBatchDemandEvidence(weakBatch, { required: true, signals });
assert.ok(weakBatchReview.batchFailures.some((message) => message.includes("支撑不足")));

const reusedSignalBatch = structuredClone(validBatch);
reusedSignalBatch[1].demandEvidence.reference = "real query 1";
reusedSignalBatch[2].demandEvidence.reference = "real query 1";
const reusedSignalReview = validateBatchDemandEvidence(reusedSignalBatch, { required: true, signals });
assert.ok(reusedSignalReview.batchFailures.some((message) => message.includes("最多支撑2篇")));

const reusedEditorialBatch = structuredClone(validBatch);
reusedEditorialBatch[10].demandEvidence.reference = reusedEditorialBatch[8].demandEvidence.reference;
reusedEditorialBatch[11].demandEvidence.reference = reusedEditorialBatch[8].demandEvidence.reference;
const reusedEditorialReview = validateBatchDemandEvidence(reusedEditorialBatch, { required: true, signals });
assert.ok(reusedEditorialReview.batchFailures.some((message) => message.includes("最多支撑2篇")));

const duplicateQueryBatch = structuredClone(validBatch);
duplicateQueryBatch[1].demandEvidence.query = duplicateQueryBatch[0].demandEvidence.query;
const duplicateQueryReview = validateBatchDemandEvidence(duplicateQueryBatch, { required: true, signals });
assert.ok(duplicateQueryReview.reviews.slice(0, 2).every((review) => !review.pass));

console.log("Daily article demand evidence tests passed.");
