import assert from "node:assert/strict";
import {
  validateBatchDemandEvidence,
  validateDemandEvidence,
} from "./validate-daily-ziwei-seed.mjs";

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
