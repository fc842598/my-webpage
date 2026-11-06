import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

export const modified = "2026-11-06T14:48:00+08:00";
// Fixed reviewed scope. Financial-budget and diet/health paragraphs are excluded
// for separate review rather than mechanically translating unsupported claims.
const edits = [
  ["ziwei-lianzhen-zuoming-ci-taohua-qiuxing-fuza-qituxin", "爆发力", "The traditional labels 'secondary peach blossom' and 'prison' should not be treated as evidence of promiscuity or imprisonment. In a reflective reading, discuss taste, social confidence, strong interests, and the difficulty of letting go. What matters is how the person actually handles emotions and boundaries."],
  ["ziwei-lingtan-ge-tanlang-lingxing-menfa", "兑现", "Readers often look for the ten-year or annual cycle to activate Tan Lang or Ling Xing alongside Lu or Quan. That is a traditional timing interpretation, not evidence that a windfall will occur. Keep it separate from actual earnings, business performance, and financial decisions."],
  ["ziwei-liukui-liuyue-liuluan-liuxi-liunian-zhi-xi", "兑现", "These annual stars describe a temporary interpretive layer, not a replacement for the natal chart. Luan and Xi can prompt discussion of relationships or celebrations; Tian Ma can prompt discussion of movement. Neither a favorable nor a challenging combination confirms an event, a partner's intentions, or income from travel."],
  ["ziwei-minggong-huaquan-zhujian-haishi-guquan", "执念", "With Hua Quan and Tuo Luo, one theme to explore is getting stuck on a decision or finding it difficult to delegate. Ask for a real example before applying that interpretation; the combination does not establish that the person is the sole cause of an obstacle."],
  ["ziwei-pojun-zuoming", "折腾", "Po Jun in the Life Palace is traditionally associated with change and rebuilding. A useful question is whether the person can replace an unsatisfactory arrangement without discarding what still works. Changing jobs or homes repeatedly is one possible example to discuss, not something the chart proves has happened."],
  ["ziwei-qingchunqi-panni-qinzi-goutong", "知情权", "Children show a wish for independence in different ways: direct disagreement, debate, withdrawal, or outward compliance. A chart label cannot tell a parent which explanation is correct. Ask what the teenager understands about a decision, listen to their concerns, and offer age-appropriate participation instead of treating disagreement as a fixed character defect."],
  ["ziwei-qisha-zuoming-jiangxing-de-gang-yu-gu", "攻坚", "The strengths traditionally associated with Qi Sha are decisiveness and a willingness to tackle difficult tasks. The corresponding questions concern impatience, flexibility, trust, and asking for help. Check which themes fit the person's experience rather than assigning all of them at once."],
  ["ziwei-qishuwei-guanlu-de-guanlu-xuhang", "消耗", "Within this reading method, distinguish the home palace's immediate theme from the related position used to discuss staying power. Supporting stars and transformations provide context, but they cannot measure resilience or establish how much strain a person or project can withstand."],
  ["ziwei-shaxing-bu-kenpa", "隐忍", "Ling Xing is often discussed through restraint, tension, and energy that builds before being expressed. Ask how those themes appear in practice; they do not establish hidden motives or determine which occupation someone should choose."],
  ["ziwei-siyu-liuliang-shequn-yunying", "引流", "Use the Migration Palace as a symbolic lens for reaching people beyond an existing circle, such as through public platforms or events. The reading cannot measure acquisition costs or tell you whether a campaign will work. Compare the interpretation with observed audience responses, repeat visits, and the resources needed to serve those people.", "Use the Friends, Migration, Siblings, and Wealth palaces to discuss audience relationships and community work, then compare those themes with actual engagement."],
  ["ziwei-taisui-rugua-fa-kan-yu-mouren-guanxi", "磨合", "When this method places another person's Lu or Ji in a palace, explain the traditional association and ask how it relates to observed interactions. Lu can be discussed through support, Ji through recurring concerns or attachment; neither placement proves what the other person feels or how the relationship will develop."],
  ["ziwei-taiyang-zuoming-faguang-fare-ye-yao-fang-haojin", "号召力", "If public-facing work or leadership is relevant to the person's experience, discuss how they organize and encourage others while keeping sustainable boundaries."],
  ["ziwei-tiande-yuede", "主动", "With Tian Kui or Tian Yue, readers often emphasize help from other people. Treat that as a prompt to identify actual sources of support, not a guarantee that help will arrive when needed."],
  ["ziwei-tianji-zai-fumugong", "摸索", "A parent's changing approach may reflect learning, uncertainty, or changing circumstances. Ask about specific events before attributing inconsistency to Tian Ji; understanding the context does not require excusing behavior that caused harm."],
  ["ziwei-tianshou-zai-minggong", "兑现集中", "Compare the ten-year cycle with real examples of sustained work and accumulated experience. Tian Shou does not establish when achievement will arrive or how long someone will live.", "Tian Shou is traditionally associated with patience, steadiness, and endurance. In the Life Palace, read those themes in context, not as a lifespan prediction."],
  ["ziwei-tiantong-zuoming-fuxing-suihe-yu-anyi-xianjing", "适度激发", "A manageable challenge or a clearly defined responsibility can be a useful topic when discussing Tian Tong's association with comfort. Hardship is not a requirement for achievement, and a challenging star does not guarantee that pressure will become productive."],
  ["ziwei-tianzhaigong-huaquan", "技巧", "For example, Tian Liang with Hua Quan and Qing Yang in the Property Palace can frame a discussion about authority and shared space at home. Ask who makes decisions and how disagreements are handled. The chart cannot decide whether separate housing or a different arrangement is appropriate for the family."],
  ["ziwei-wanglian-shejiao-ruanjian-tuodan", "相处", "When an online connection moves offline, judge the relationship through real interaction and consistent behavior, not a favorable chart. Take time to verify basic claims, arrange initial meetings in public, and keep someone you trust informed. Do not treat a request for money or an investment pitch as evidence of commitment."],
  ["ziwei-wanhun-mingpan-tezheng-wei-shenme-wanhun-geng-wen", "磨合", "Age pressure is not a sound reason to rush a commitment. Discuss readiness, shared expectations, and the couple's actual circumstances. A chart cannot establish that early marriage will fail or that waiting will produce a more stable relationship.", "Explore why some relationship readings emphasize taking time to develop independence and shared expectations. A chart cannot prescribe a marriage age or guarantee stability."],
  ["ziwei-wuhudun-wushudun-gonggan-liushi", "底层", "The Five-Tiger and Five-Rat rules are underlying calculation methods used for palace stems and hour stems. If you are checking a chart, distinguish these calculations from the interpretation built on top of them, and verify the inputs before following a chain of transformations."],
  ["ziwei-wutan-tongxing-wuqu-tanlang-chouwei-xianpin-houfu", "定型", "Wu Qu and Tan Lang are often described through a late-developing pattern: practical discipline gradually gives direction to varied interests. Use that as a theme to investigate, not a promise of success after thirty or a claim that other people stop developing earlier."],
  ["ziwei-yixing-rumiao-pojun-zai-ziwu-kaituo", "耗", "Po Jun's traditional association with disruption and rebuilding can be read through the difference between changing a system and simply dismantling it. Ask what replaces the old arrangement and whether the person has the support to carry the change through."],
];

export const revisions = edits.map(([slug, expected, paragraph, description]) => {
  const file = `articles/en/${slug}.html`;
  const html = readFileSync(file, "utf8");
  const schema = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1])).find(item => item["@type"] === "Article");
  let body = html.match(/<article\b[^>]*id="article-start"[^>]*>([\s\S]*?)<\/article>/)?.[1]?.trim();
  assert(schema && body, file);
  const matches = [...body.matchAll(/<(p|li)\b([^>]*)>([\s\S]*?)<\/\1>/g)].filter(match => match[0].includes(expected));
  assert(matches.length === 1 || (matches.length === 0 && body.includes(paragraph)), `Unexpected source: ${file}`);
  if (matches.length) body = body.replace(matches[0][0], `<${matches[0][1]}${matches[0][2]}>${paragraph}</${matches[0][1]}>`);
  if (slug === "ziwei-pojun-zuoming") {
    // Checked against the site's vendor iztro heavenlyStems table and
    // https://docs.iztro.com/learn/mutagen (default stem table, not a rule change).
    body = `<p class="article-lead">${paragraph}</p>
        <h2 id="section-1">Change Needs a Replacement Plan</h2>
        <p>Po Jun is traditionally associated with disruption, experimentation, and rebuilding. In the Life Palace, discuss how a person approaches an arrangement that no longer works. The useful distinction is between changing it with a workable plan and dismantling it without a replacement.</p>
        <p>For example, redesigning a team process can involve keeping the parts that work, testing a new approach, and agreeing on responsibilities. The star does not establish that someone must reject routine, leave a job, or repeatedly start over.</p>
        <h2 id="section-2">Read the Wider Palace Pattern</h2>
        <p>Po Jun is read alongside Qi Sha and Tan Lang in the Sha Po Lang pattern. Compare the Life Palace with the Wealth Palace, Career Palace, and Migration Palace. Supporting stars, challenging stars, and the relevant cycle add context; no single label establishes a successful reform or a failed relationship.</p>
        <h2 id="section-3">Po Jun's Transformations</h2>
        <p>In the standard heavenly-stem table used by this chart, a Gui stem assigns Hua Lu to Po Jun, while a Jia stem assigns Hua Quan to Po Jun. This table does not assign Hua Ke or Hua Ji to Po Jun.</p>
        <p>Hua Lu can frame a discussion about resources, activity, and the demands of change. Hua Quan draws attention to initiative, responsibility, and control. Neither transformation guarantees wealth or a leadership position. A Hua Ji marker elsewhere in the chart must not be described as Po Jun itself transforming into Hua Ji.</p>
        <h2 id="section-4">A Practical Reading Order</h2>
        <ol>
          <li>Confirm Po Jun's palace and its condition in the chart's chosen convention.</li>
          <li>Read the related Life, Wealth, Career, and Migration palaces together.</li>
          <li>Check the actual stem-based transformations rather than assuming every star can carry all four.</li>
          <li>Distinguish natal factors from the ten-year and annual layers.</li>
          <li>Compare the interpretation with actual responsibilities, available support, and the consequences of a proposed change.</li>
        </ol>`;
  }
  body = body.replaceAll('\\"', '"');
  assert(!/[\u3400-\u9fff]/.test(body + (description || schema.description)), `Other fragments need review: ${file}`);
  return {
    file,
    title: schema.headline,
    description: slug === "ziwei-pojun-zuoming"
      ? "Po Jun in the Life Palace emphasizes change and rebuilding. Read the wider chart, distinguish Hua Lu from Hua Quan, and check what a practical change requires."
      : description || schema.description,
    body,
  };
});
assert.equal(revisions.length, 22);
