import assert from "node:assert/strict";
import {
  isStructuredIntentDuplicate,
  structuredIntentSimilarity,
} from "./validate-daily-ziwei-seed.mjs";

const original = {
  question: "紫微斗数想换工作，先看官禄宫还是迁移宫？",
  coreIntent: "区分岗位职责变化与外部平台变化，判断这次调整到底是换岗位还是换环境",
  answerPath: "先读官禄宫的职责与位置，再读迁移宫的平台和外部机会，最后用财帛宫确认收入是否承接",
};

const renamedClone = {
  question: "最近准备跳槽，命盘应该先看哪一个宫位？",
  coreIntent: original.coreIntent,
  answerPath: original.answerPath,
};

const copiedQuestion = {
  question: original.question,
  coreIntent: "只讨论学习方式和考试准备",
  answerPath: "先看文昌文曲，再看化科与魁钺，最后核对考试所在流年宫位",
};

const copiedAnswerPath = {
  question: "职业机会很多时怎么排先后？",
  coreIntent: "比较不同职业机会的现实承接顺序",
  answerPath: original.answerPath,
};

const distinctIntent = {
  question: "夫妻宫有化权，婚前共同财务应该怎么谈？",
  coreIntent: "把共同账户、个人账户、债务、首付和产权拆成可协商规则",
  answerPath: "先读夫妻与福德的相处方式，再核对双方财帛宫，最后用田宅宫讨论首付、产权和退出方案",
};

for (const candidate of [renamedClone, copiedQuestion, copiedAnswerPath]) {
  const metrics = structuredIntentSimilarity(original, candidate);
  assert.equal(isStructuredIntentDuplicate(metrics), true, JSON.stringify(metrics));
}

const distinctMetrics = structuredIntentSimilarity(original, distinctIntent);
assert.equal(isStructuredIntentDuplicate(distinctMetrics), false, JSON.stringify(distinctMetrics));
assert.ok(distinctMetrics.score < 0.45);
console.log("Structured article intent history tests passed.");
