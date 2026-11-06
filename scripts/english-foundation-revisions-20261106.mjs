import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

export const modified = "2026-11-06T15:07:00+08:00";
// Reviewed against the existing article intent; naming and chart structure were
// cross-checked with docs.iztro.com/learn/{palace,pattern,major-star}.
const pages = [
  ["ziwei-geju-shapol", "Sha Po Lang: Reading Qi Sha, Po Jun, and Tan Lang Together",
    "Sha Po Lang connects Qi Sha, Po Jun, and Tan Lang. Read their actual palaces, transformations, and support before turning a theme of change into a prediction.",
    "Sha Po Lang is the collective name for Qi Sha, Po Jun, and Tan Lang in a related palace structure. It is often discussed through action, change, and competing interests. It does not establish that a person must have an unstable life or repeatedly change jobs and relationships.", [
      ["Locate the Three Stars First", "Find each star in the chart instead of recognizing the pattern from a branch label alone. Start with the Life Palace, then read the Wealth Palace, Career Palace, and Migration Palace together. Say which star is actually in each position."],
      ["Give Each Star a Clear Role", "Qi Sha is commonly discussed through resolve and decisive action; Po Jun through changing and rebuilding arrangements; Tan Lang through interests, motivation, and social opportunities. These themes are starting points for questions, not three personality verdicts to impose on the person."],
      ["Ask What Makes Change Workable", "Compare Hua Lu, Hua Quan, supporting stars, and challenging stars with actual resources and responsibilities. For a work transition, ask what replaces the old role and who supports the change. Keep natal themes separate from ten-year and annual timing, and do not assume every proposed change is beneficial."],
    ]],
  ["ziwei-geju-taiyang-huaji", "Tai Yang With Hua Ji: Recognition, Responsibility, and Context",
    "Read Tai Yang with Hua Ji through its actual palace and timing layer. Do not infer illness, hostility from others, or a fixed career outcome from the label.",
    "Tai Yang with Hua Ji is traditionally discussed through visibility, responsibility, and a concern that effort is not being recognized. That interpretation should be tested against an actual situation. It does not prove that colleagues are hostile, that a parent is unwell, or that the person should avoid public work.", [
      ["Check Which Hua Ji You Mean", "Confirm that Hua Ji is assigned to Tai Yang in the layer being read. Distinguish the natal assignment from ten-year, annual, or palace-stem transformations. Another star carrying Hua Ji nearby is not automatically Tai Yang itself transforming into Hua Ji."],
      ["Separate Visibility From Support", "For a work example, distinguish being responsible for a visible project from having the authority, feedback, and help to complete it. A mismatch between effort and recognition can have practical explanations; the chart cannot verify how other people judge you."],
      ["Read the Whole Combination", "Consider Tai Yang's condition, companion stars, related palaces, and supporting transformations. Ask what additional information would change the reading. Do not use the star as a diagnosis, a reason to expect a dispute, or a guarantee that recognition will arrive later in life."],
    ]],
  ["ziwei-geju-yongxing-rumiao", "Ying Xing Ru Miao: Po Jun in Zi or Wu",
    "Ying Xing Ru Miao names a Po Jun configuration in Zi or Wu. Understand its formation and supporting factors without assuming a promised rise in middle age.",
    "Ying Xing Ru Miao is a traditional pattern associated with Po Jun in Zi or Wu. The name describes a chart configuration, not a guarantee of wealth, status, or success after a difficult youth. Keep the pattern's formation separate from its interpretation.", [
      ["Confirm the Formation", "Locate Po Jun and check whether it occupies Zi or Wu in the chart being discussed. If the article concerns the Life Palace, confirm that this is the Life Palace placement rather than a similarly named annual position."],
      ["Read Rebuilding, Not Just Disruption", "Po Jun's theme of change is more useful when the reading asks what will replace an old arrangement. For example, redesigning a service may require preserving a working process while testing a new one. The pattern does not establish that the person must reject stable work or start a business."],
      ["Check the Resources Around the Pattern", "Read Hua Lu or Hua Quan where actually present, then the supporting stars and related palaces. Ask who provides help, what responsibilities are involved, and whether the proposed change is workable. Challenging stars do not prove early failure, and a favorable pattern does not remove practical limits."],
    ]],
  ["ziwei-jiguan-suo-qianneng-fajue", "Ji Liang: Tian Ji, Tian Liang, and Thoughtful Planning",
    "Ji Liang combines Tian Ji and Tian Liang themes of planning and principles. Read the actual configuration and compare ideas with practical follow-through.",
    "Ji Liang refers to a relationship between Tian Ji and Tian Liang in the chart. Tian Ji should not be mistranslated as 'Ji Ji.' A useful discussion connects planning and adaptability with judgment and principles, without assuming a particular profession or level of ability.", [
      ["Check the Actual Star Relationship", "State whether the stars share a palace or connect through related palaces. Read their conditions, companion stars, and transformations. Do not apply a pattern name solely because both stars appear somewhere in a twelve-palace chart."],
      ["Connect the Theme to a Real Task", "For a planning role, ask how the person turns a complicated problem into a usable proposal, explains trade-offs, and responds when circumstances change. In a teaching role, distinguish subject knowledge from the ability to listen and communicate. Neither skill is proved by the chart."],
      ["Balance Analysis With Follow-Through", "A possible question is whether repeated revision improves a plan or postpones a decision. Use actual examples and agreed requirements to assess that. Keep ten-year and annual interpretations separate from the natal combination, and do not substitute an unrelated Sun-and-Moon example for this pattern."],
    ]],
  ["ziwei-jiyue-tongliang-ge-wending-tizhi-canmou-luxian", "Ji Yue Tong Liang: Planning and Coordination in the Wider Chart",
    "Identify Tian Ji, Tai Yin, Tian Tong, and Tian Liang before interpreting Ji Yue Tong Liang. The pattern does not prescribe public service or rule out entrepreneurship.",
    "Ji Yue Tong Liang brings together Tian Ji, Tai Yin, Tian Tong, and Tian Liang in the related palace structure around the Life Palace. Read the actual arrangement and the convention being used before applying the name. A traditional association with institutional work is not a career requirement.", [
      ["Name All Four Stars", "Tian Ji contributes a theme of planning and adjustment, Tai Yin of detail and resources, Tian Tong of ease and relationships, and Tian Liang of judgment and responsibility. Explain how these themes are connected in this chart rather than presenting a generic description of an office worker."],
      ["Compare Support and Constraints", "Read the conditions of the stars, assisting stars such as Wen Chang and Wen Qu, and the transformations actually present. Challenging stars may change the interpretation, but they do not establish that the person is incapable of stable work or must avoid a particular field."],
      ["Use the Reading to Ask Better Work Questions", "Compare the person's experience in planning, communication, service, or coordination with the demands of a real role. Separate skill, preference, and opportunity. Then read the ten-year and annual layers without treating a pattern name as proof of a promotion or a suitable employer."],
    ]],
  ["ziwei-shenggong-zhengque-yongfa", "Body Palace in Zi Wei Dou Shu: Read It Alongside the Life Palace",
    "The Body Palace marks a focus within one of six existing palaces. Read its stars and relationship to the Life Palace without imposing an automatic age-35 switch.",
    "The Body Palace is not a thirteenth box or a replacement for the Life Palace. It shares one of six existing palaces and is used to discuss how attention and effort develop through lived experience. Do not treat age thirty-five as an automatic switch that changes which palace a person 'lives.'", [
      ["Locate the Body Palace Marker", "The Body Palace may share the Life, Spouse, Wealth, Migration, Career, or Inner Life Palace. First identify the actual host palace and its stars. Do not confuse the marker with the physical body or use it to diagnose health."],
      ["Read the Host Palace in Context", "In the Career Palace, explore work and responsibilities; in the Spouse Palace, partnership and commitment; in the Migration Palace, outside environments and connections. Wealth and Inner Life placements invite questions about resources or inner priorities. These are areas to discuss, not outcomes the chart proves."],
      ["Compare It With Life and Timing", "When the Life and Body palaces share a position, read the same star structure without assuming an easier life. When they differ, compare the themes without calling that a defect. Use the actual ten-year and annual layers, then ask how the person describes their changing priorities."],
    ]],
  ["ziwei-tianxing-tianyao-zayao-yingxiang", "Tian Xing and Tian Yao: Read Minor Stars in Context",
    "Tian Xing and Tian Yao add traditional themes of rules, boundaries, charm, and social expression. Neither minor star establishes illness, litigation, or infidelity.",
    "Tian Xing and Tian Yao are minor stars used to refine a reading, not to decide the whole chart. Their names can sound dramatic in translation. Explain the traditional theme, then return to the major stars, transformations, and the actual question.", [
      ["Tian Xing: Rules and Boundaries", "Tian Xing is often discussed through discipline, standards, or a sense of restriction. In a work example, ask how rules and responsibilities are handled. The placement is not evidence that someone will face a lawsuit, need surgery, or have a cold personality."],
      ["Tian Yao: Charm and Expression", "Tian Yao is commonly discussed through social appeal, aesthetics, and attraction. Ask how those themes relate to actual creative work or relationships. Do not infer infidelity, sexual behavior, or a partner's intentions from the star."],
      ["Keep the Minor Star in Its Proper Role", "For Zi Wei with Tian Xing, discuss how authority and rules might be interpreted together. For Tan Lang with Tian Yao, discuss interests and social expression without turning them into a moral label. Compare the wider palace structure and timing before offering practical questions."],
    ]],
  ["ziwei-santai-bazuo", "San Tai and Ba Zuo: Status, Presentation, and Supporting Stars",
    "San Tai and Ba Zuo are supporting stars associated with dignity and presentation. Read them with the major stars rather than assuming rank, wealth, or extravagance.",
    "San Tai and Ba Zuo are supporting stars traditionally associated with dignity, presentation, and recognition. They do not confer a title, a promotion, or wealth by themselves. A useful reading distinguishes being perceived as capable from actually having resources and authority.", [
      ["Read Them With the Major Stars", "With Zi Wei, the traditional imagery emphasizes support around a central role. Check the major star's condition, assisting stars such as Zuo Fu and You Bi, and the transformations present. An impressive pattern name is not evidence of a leadership appointment."],
      ["Separate Presentation From Substance", "In the Career Palace, compare public standing with the person's actual remit. In the Wealth Palace, discuss how spending on presentation relates to real priorities, without assuming extravagance. In the Spouse Palace, ask about expectations rather than assigning a partner a social rank."],
      ["A Practical Reading Order", "Locate San Tai and Ba Zuo, identify the major-star combination, and read the related palaces. Then separate natal themes from the ten-year and annual layers. Use concrete examples to discuss the difference between recognition, responsibility, and outward appearance."],
    ]],
];

export const revisions = pages.map(([slug, title, description, lead, sections]) => {
  const file = `articles/en/${slug}.html`;
  assert(readFileSync(file, "utf8").includes('id="article-start"'), `Existing article missing: ${file}`);
  const body = `<p class="article-lead">${lead}</p>\n` + sections.map(([heading, text], index) =>
    `        <h2 id="section-${index + 1}">${heading}</h2>\n        <p>${text}</p>`).join("\n");
  assert(!/[\u3400-\u9fff]/.test(title + description + body));
  return { file, title, description, body };
});
assert.equal(revisions.length, 8);
