import { articles as moneyCareerArticles } from "./daily-ziwei-2026-08-01/money-career.mjs";
import { articles as relationshipArticles } from "./daily-ziwei-2026-08-01/relationships.mjs";
import { articles as cycleArticles } from "./daily-ziwei-2026-08-01/cycles.mjs";
import { articles as palaceCombinationArticles } from "./daily-ziwei-2026-08-01/palace-combinations.mjs";
import { articles as transformationArticlesOne } from "./daily-ziwei-2026-08-01/transformations-1.mjs";
import { articles as transformationArticlesTwo } from "./daily-ziwei-2026-08-01/transformations-2.mjs";
import { articles as starAndAuxiliaryArticles } from "./daily-ziwei-2026-08-01/stars-and-auxiliaries.mjs";
import { articles as readingMethodArticlesOne } from "./daily-ziwei-2026-08-01/reading-methods-1.mjs";
import { articles as readingMethodArticlesTwo } from "./daily-ziwei-2026-08-01/reading-methods-2.mjs";

const groupedArticles = [
  ...moneyCareerArticles,
  ...relationshipArticles,
  ...cycleArticles,
  ...palaceCombinationArticles,
  ...transformationArticlesOne,
  ...transformationArticlesTwo,
  ...starAndAuxiliaryArticles,
  ...readingMethodArticlesOne,
  ...readingMethodArticlesTwo,
];

export const articles = groupedArticles.toSorted((left, right) => left.order - right.order);

const expectedOrders = Array.from({ length: 30 }, (_, index) => index + 1);
if (articles.length !== expectedOrders.length || articles.some((article, index) => article.order !== expectedOrders[index])) {
  throw new Error("The 2026-08-01 article seed must contain every order from 1 through 30 exactly once.");
}
