import assert from "node:assert/strict";
import {
  bestEvidenceMatch,
  evidenceBindingFailures,
  evidenceBindingSummary,
} from "./validate-daily-ziwei-seed.mjs";

const evidenceRanges = [
  {
    range: "800-818",
    text: "擎羊属于六煞。擎羊代表刃，入庙旺时用刀仍可平安，但没有事也要保持警戒。",
  },
  {
    range: "1032-1033",
    text: "官禄宫坐七杀和擎羊，却没有化权，职位有名而实权不足。",
  },
];

const exaltedMatch = bestEvidenceMatch("擎羊入庙并不等于没有风险，用刀之后仍要警戒。", evidenceRanges);
assert.equal(exaltedMatch.range, "800-818");
assert.ok(exaltedMatch.coverage >= 0.05);

const summary = evidenceBindingSummary({
  points: [
    "擎羊入庙时刀锋较可控制，但仍不能取消警戒。",
    "官禄宫同时见七杀与擎羊，却没有化权时，要核对职位是否缺少实际权责。",
  ],
  examples: [
    "例子：官禄宫坐七杀、擎羊而不见化权，不能只凭职位名称判断掌权。",
  ],
  evidenceRanges,
});
assert.equal(summary.usedRangeCount, 2);
assert.deepEqual(summary.usedRanges.toSorted(), ["1032-1033", "800-818"]);
assert.ok(summary.pointMatches.every((item) => item.coverage >= 0.05));
assert.ok(summary.exampleMatches.every((item) => item.coverage >= 0.05));
assert.deepEqual(evidenceBindingFailures(summary), []);

const singleRangeSummary = evidenceBindingSummary({
  points: ["擎羊入庙时仍要警戒。"],
  examples: ["例子：擎羊入庙对应用刀，处置后仍需复核。"],
  evidenceRanges: evidenceRanges.slice(0, 1),
});
assert.ok(evidenceBindingFailures(singleRangeSummary).some((message) => message.includes("至少2组")));

const unsupported = bestEvidenceMatch("烘焙蛋糕的奶油温度决定裱花纹路。", evidenceRanges);
assert.ok(unsupported.coverage < 0.05);
const unsupportedSummary = evidenceBindingSummary({
  points: ["烘焙蛋糕的奶油温度决定裱花纹路。"],
  examples: ["例子：鲜奶油需要低温打发。"],
  evidenceRanges,
});
const unsupportedFailures = evidenceBindingFailures(unsupportedSummary);
assert.ok(unsupportedFailures.some((message) => message.includes("观点")));
assert.ok(unsupportedFailures.some((message) => message.includes("例子")));

console.log("Daily Ziwei evidence binding tests passed.");
