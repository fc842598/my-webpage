import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

// Fixed, reviewed scope: these 35 existing pages share an untranslated
// palace-domain field. Do not discover extra targets or translate arbitrary text.
export const modified = "2026-11-06T14:34:00+08:00";
const targets = {
  lianzhen: ["caibogong", "fudegong", "fumugong", "fuqigong", "guanlugong", "minggong", "puyigong", "qianyi", "tianzhaigong", "xiongdigong", "zinvgong"],
  tianfu: ["caibogong", "fuqigong", "minggong", "qianyi", "xiongdigong", "zinvgong"],
  tiantong: ["caibogong", "fudegong", "fumugong", "fuqigong", "guanlugong", "minggong", "puyigong", "qianyi", "tianzhaigong", "xiongdigong", "zinvgong"],
  wuqu: ["caibogong", "fudegong", "fumugong", "guanlugong", "puyigong", "qianyi", "tianzhaigong"],
};
const stars = { lianzhen: "Lian Zhen", tianfu: "Tian Fu", tiantong: "Tian Tong", wuqu: "Wu Qu" };
const domains = {
  caibogong: ["Wealth Palace", "income sources, earning strategies, and cash flow"],
  fudegong: ["Inner Life Palace", "emotional outlook, rest, and the ability to enjoy life"],
  fumugong: ["Parents Palace", "family relationships, support from elders, and education"],
  fuqigong: ["Spouse Palace", "relationship expectations, a partner's priorities, and shared decisions"],
  guanlugong: ["Career Palace", "work patterns, professional responsibilities, and the workplace"],
  minggong: ["Life Palace", "temperament, self-presentation, and personal priorities"],
  puyigong: ["Friends Palace", "friends, colleagues, collaborators, and social networks"],
  qianyi: ["Migration Palace", "travel, outside connections, and opportunities away from familiar surroundings"],
  tianzhaigong: ["Property Palace", "housing, the home environment, and long-term assets"],
  xiongdigong: ["Siblings Palace", "siblings, peer relationships, and shared financial arrangements"],
  zinvgong: ["Children Palace", "relationships with children and younger people, mentoring, and creative work"],
};
export const revisions = Object.entries(targets).flatMap(([star, palaces]) => palaces.map(palace => {
  const file = `articles/en/ziwei-${star}-zai-${palace}.html`;
  const html = readFileSync(file, "utf8");
  const schema = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1])).find(item => item["@type"] === "Article");
  const body = html.match(/<article\b[^>]*id="article-start"[^>]*>([\s\S]*?)<\/article>/)?.[1]?.trim();
  assert(schema && body, `Missing existing article: ${file}`);
  assert(!/[\u3400-\u9fff]/.test(body), `Body needs separate editorial review: ${file}`);
  const [palaceName, domain] = domains[palace];
  // Standardize full palace names only inside these reviewed article bodies.
  const terms = value => value.replaceAll("Fortune Palace", "Inner Life Palace").replaceAll("Travel Palace", "Migration Palace");
  return {
    file,
    title: terms(schema.headline),
    description: `Read ${stars[star]} in the ${palaceName} through ${domain}. Compare the wider chart with real-life experience.`,
    body: terms(body),
    navigationLabels: { "Fortune Palace": "Inner Life Palace", "Travel Palace": "Migration Palace" },
  };
}));
assert.equal(revisions.length, 35);
