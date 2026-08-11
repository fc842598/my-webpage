import assert from "node:assert/strict";
import { reviewSeedArticles } from "./validate-daily-ziwei-seed.mjs";

function article(overrides = {}) {
  return {
    order: 1,
    slug: "reader-first-article",
    title: "夫妻宫廉贞贪狼为什么相处很累",
    openingParagraphs: ["这是一篇不套固定结构的中文文章。"],
    english: {
      title: "Why Lian Zhen and Tan Lang Can Feel Exhausting",
      openingParagraphs: ["This article is intentionally short and does not use a fixed outline."],
    },
    ...overrides,
  };
}

const flexible = reviewSeedArticles([article()]);
assert.equal(flexible.ready, 1);
assert.equal(flexible.needsFix, 0);
assert.equal(flexible.warningCount, 0);

const similar = reviewSeedArticles([article()], {
  history: [{ file: "old.html", title: "夫妻宫廉贞贪狼为什么让相处很累" }],
  englishHistory: [{ file: "old-en.html", title: "Why Lian Zhen and Tan Lang May Feel Exhausting" }],
});
assert.equal(similar.ready, 1, "similarity must not block publication");
assert.ok(similar.warningCount >= 2, "Chinese and English similarity should request manual judgment");

const duplicateSlug = reviewSeedArticles([article(), article({ order: 2 })]);
assert.equal(duplicateSlug.batchErrors.length, 1, "duplicate slugs remain a technical error");

console.log("Daily article advisory review tests passed.");
