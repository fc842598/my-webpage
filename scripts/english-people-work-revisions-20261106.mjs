import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

export const modified = "2026-11-06T15:10:00+08:00";
const pages = [
  ["ziwei-huoxing-lingxing-baofali-guanli", "Huo Xing and Ling Xing: Action, Pressure, and Context",
    "Read Huo Xing and Ling Xing through the actual star combination. Do not infer a temper, health condition, or investment style from either star alone.",
    "Huo Xing and Ling Xing are traditionally described using fire imagery. A useful English explanation distinguishes a quick response from pressure that builds over time. Neither star proves that someone is angry, suspicious, unwell, or likely to act recklessly.", [
      ["Start With the Combination", "Locate each star and identify the major stars and transformations in the same and related palaces. A chart with these stars beside the Life Palace is a different arrangement from one in which they share the Life Palace. Explain that structure before applying a personality description."],
      ["Use an Actual Example", "For a work discussion, ask how the person responds to an urgent request or a prolonged obstacle. Compare what helps them act effectively with what creates avoidable pressure. Do not assign a fixed emotional style to someone without asking."],
      ["Keep Interpretation Separate From Advice", "A symbolic theme can organize a discussion of responsibilities, boundaries, and communication. It cannot diagnose illness, determine suitability for a profession, or justify a financial decision. Read the timing layer explicitly rather than treating the natal stars as events already in progress."],
    ]],
  ["ziwei-lengzhan-moshi-tiantong-taiyin", "Tian Tong, Tai Yin, and Silence During Relationship Conflict",
    "Distinguish a mutually understood pause from repeated refusal to communicate. Chart symbolism cannot establish a partner's motives or diagnose an avoidance style.",
    "Silence during a disagreement can mean different things: taking time to think, feeling overwhelmed, or refusing to engage. A Tian Tong or Tai Yin placement does not identify which explanation applies. Start with the actual interaction rather than labeling a partner from the chart.", [
      ["Describe What Happens", "Explain what starts the disagreement, how long communication stops, and whether both people understand when it will resume. A chart reading cannot verify hidden feelings or show that silence will lead to an affair or a health problem."],
      ["Separate a Pause From an Unresolved Pattern", "A pause that both people understand is different from repeatedly leaving an issue unaddressed. Ask whether there is a clear way to return to the discussion and whether each person can express a concern without punishment. Do not use a star description to excuse coercive behavior."],
      ["Use the Reading Carefully", "The Spouse Palace can frame questions about expectations and communication; the Life Palace adds the chart owner's perspective. Compare those themes with real examples. Practical suggestions should respect both people's boundaries rather than require one partner to accept ongoing silence."],
    ]],
  ["ziwei-liunian-taohua-yindong-hongluan-tianxi", "Annual Romance Stars: Hong Luan, Tian Xi, and Xian Chi",
    "Read annual romance-star themes with the natal chart and actual relationship context. A marker cannot identify the right partner or confirm a marriage or affair.",
    "Hong Luan, Tian Xi, and Xian Chi are often discussed through relationship and social themes. Their presence is not proof that someone will meet a partner, marry, reconcile, or become involved in a love triangle. Explain the star and calculation layer being used.", [
      ["Distinguish the Traditional Themes", "Hong Luan is commonly associated with relationships and celebration, Tian Xi with joy and social occasions, and Xian Chi with attraction and social appeal. Avoid turning those distinctions into labels such as 'legitimate partner' and 'bad romance.' A star does not establish anyone's intentions."],
      ["Keep Natal and Annual Positions Separate", "Identify whether the marker belongs to the natal, ten-year, or annual chart. Read the relevant Life and Spouse palaces and the transformations actually present. Overlapping themes provide context for the interpretation, not a measured probability or a confirmed event."],
      ["Compare With the Current Situation", "A single person expanding their social circle and an established couple discussing commitment have different questions. Use the reading to organize those questions, then assess the actual relationship through communication, consent, and consistent behavior."],
    ]],
  ["ziwei-shangsi-guanxi-fumugong-quanwei", "The Parents Palace and Relationships With Supervisors",
    "The Parents Palace can frame discussion of authority figures. Compare the interpretation with actual expectations, communication, and workplace support.",
    "The Parents Palace is also used in traditional readings about teachers, elders, and workplace authority figures. It does not identify a supervisor's personality or establish that a difficult relationship is inevitable. Keep the chart owner's perspective separate from claims about another person.", [
      ["Describe the Working Arrangement", "Start with reporting lines, responsibilities, and how decisions are communicated. A disagreement about changing requirements may need a different response from unclear feedback or a mismatch in authority. The chart cannot verify any of these facts."],
      ["Read Related Palaces", "Compare the Parents Palace with the Career Palace and the wider support structure. Use Zi Wei, Tian Ji, Tai Yang, or other star themes as questions to explore, not a typology that tells you how a boss must behave. Tian Ji is the star's name; 'Ji Ji' is not the preferred English term."],
      ["Keep Practical Steps Evidence-Based", "Clarifying expectations and keeping an accurate record of agreed work can help make a discussion specific. A challenging cycle is not, by itself, a reason to expect mistreatment or change jobs. Separate symbolic interpretation from decisions based on observed working conditions."],
    ]],
  ["ziwei-yuancheng-bangong-minggong-qianyi", "Remote Work: Reading the Life and Migration Palaces in Context",
    "Discuss independence, communication, and outside connections through the chart, then assess remote work using actual tasks, resources, and experience.",
    "Remote work depends on the job, the environment, and the support available. A chart cannot determine whether someone is disciplined or whether they will work better at home. The Life and Migration palaces can provide a framework for questions, not a remote-work eligibility test.", [
      ["Separate Tasks From Preferences", "Ask which tasks require uninterrupted concentration, live collaboration, customer contact, or access to equipment. Enjoying solitude is not the same as having the resources to work remotely, and enjoying company does not rule remote work out."],
      ["Read Independence and Connection Together", "Use the Life Palace to discuss the person's working approach and the Migration Palace to discuss contact with the wider environment. Read the Career and Friends palaces as well. Do not infer procrastination, isolation, or poor communication from a single star."],
      ["Compare With a Real Trial", "Assess the arrangement through work quality, agreed deadlines, communication, and the ability to stop working at the end of the day. Discuss what support or structure would improve it. Keep those observations distinct from the chart interpretation and from any ten-year or annual timing theme."],
    ]],
  ["ziwei-zhichang-guiren-tiankui-tianyue", "Tian Kui and Tian Yue: Recognizing Practical Support at Work",
    "Tian Kui and Tian Yue are supporting stars traditionally associated with help and introductions. Read them in context without assuming a helper's gender or status.",
    "Tian Kui and Tian Yue are often called benefactor stars. In ordinary English, discuss help, introductions, mentoring, or access to an opportunity. Their presence does not guarantee that someone will arrive to solve a problem.", [
      ["Do Not Guess Who the Helper Must Be", "Traditional yin-and-yang descriptions should not be used to identify a helper's gender, rank, or motives. Nor is one star's effect a measured half of a pair's effect. Ask who actually provides advice, access, feedback, or practical assistance."],
      ["Read the Palace Context", "In the Career Palace, discuss work-related support; in the Friends Palace, peers and collaborators; in the Migration Palace, connections beyond an established circle. Read the major stars and transformations too. The placement does not verify a promised referral or a favorable offer."],
      ["Separate an Opening From an Outcome", "An introduction is not the same as demonstrated skill, a completed application, or a confirmed role. Compare the reading with what the person can show and follow through on. A useful next question is what help is needed and whether the expectations around that help are clear."],
    ]],
  ["ziwei-xianchi-tianyao", "Xian Chi and Tian Yao: Attraction Without Relationship Labels",
    "Xian Chi and Tian Yao are discussed through attraction and social expression. They do not establish sexual behavior, infidelity, or the quality of a partner.",
    "Xian Chi and Tian Yao are traditionally connected with attraction, charm, and social expression. Translating the theme as 'bad romance' turns an interpretive label into a judgment about people. Read the combination without assuming what anyone has done.", [
      ["Explain the Theme Before Applying It", "A discussion may concern interest in appearance, creative expression, attention, or an active social setting. Ask which, if any, fits the situation. Neither star establishes that someone attracts unsuitable partners or has a particular sexual behavior."],
      ["Keep the Relationship Context Visible", "Read the Life and Spouse palaces and the relevant transformations rather than isolating a romance marker. A person dating casually and a couple negotiating commitment have different expectations. The chart cannot verify consent, exclusivity, or a partner's intentions."],
      ["Use Observable Examples", "Discuss consistent behavior, stated expectations, and boundaries. Do not use a favorable star to dismiss a concern or a challenging star to accuse someone. Separate the natal description from annual timing and keep any practical suggestion grounded in the actual relationship."],
    ]],
  ["ziwei-jieshen-zai-tianzhaigong", "Jie Shen in the Property Palace: Resolving Home-Related Problems",
    "Jie Shen is traditionally associated with resolution. In the Property Palace, discuss home arrangements without assuming a move, renovation, or dispute is required.",
    "Jie Shen in the Property Palace is commonly discussed through resolving or reorganizing a home-related matter. That is a theme to investigate, not a claim that the person should move, renovate, buy, or sell a property.", [
      ["Identify the Actual Problem", "Distinguish a disagreement about shared space from maintenance, a change in household members, or a proposed move. A chart cannot establish ownership, contract terms, or which arrangement is practical."],
      ["Read the Supporting Structure", "Compare the major stars, transformations, and related palaces. Favorable support does not guarantee a smooth resolution, while challenging stars do not prove that a dispute will recur. Explain what the combination suggests before comparing it with the facts."],
      ["Separate Symbolism From a Housing Decision", "Ask what needs to change, who is affected, and what alternatives have been considered. Repeated rearrangement is not automatically progress. Keep the chart as a discussion aid and use the actual household situation to judge whether a proposed change addresses the problem."],
    ]],
];

const metadataOnly = [
  ["ziwei-jiangqian-shier-xing-shengyue-xi", "The twelve Pre-General stars add secondary context. Identify the actual stars and calculation layer rather than reading dramatic names as event predictions."],
  ["ziwei-tianfu-zuoming-caiku-zhixing-wending-baoshou", "Tian Fu in the Life Palace is traditionally associated with resources, coordination, and continuity. Read its support and constraints rather than assuming wealth."],
];
export const revisions = pages.map(([slug, title, description, lead, sections]) => {
  const file = `articles/en/${slug}.html`;
  assert(readFileSync(file, "utf8").includes('id="article-start"'), file);
  const body = `<p class="article-lead">${lead}</p>\n` + sections.map(([heading, paragraph], index) =>
    `        <h2 id="section-${index + 1}">${heading}</h2>\n        <p>${paragraph}</p>`).join("\n");
  return { file, title, description, body };
});
for (const [slug, description] of metadataOnly) {
  const file = `articles/en/${slug}.html`;
  const html = readFileSync(file, "utf8");
  const schema = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1])).find(item => item["@type"] === "Article");
  const body = html.match(/<article\b[^>]*id="article-start"[^>]*>([\s\S]*?)<\/article>/)?.[1]?.trim();
  assert(schema && body, file);
  revisions.push({ file, title: schema.headline, description, body });
}
assert.equal(revisions.length, 10);
for (const item of revisions) assert(!/[\u3400-\u9fff]/.test(item.title + item.description + item.body), item.file);
