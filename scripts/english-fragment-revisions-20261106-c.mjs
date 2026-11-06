import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

export const modified = "2026-11-06T14:55:00+08:00";
const edits = [
  ["ziwei-zhichang-jinsheng-tiba-shiji-guanlu-feihua", [["主动", "Use a suggested timing theme to organize questions about responsibilities and opportunities, then check actual selection criteria and feedback. A chart does not confirm a promotion."]]],
  ["ziwei-zhichang-pua-jingshen-kongzhi", [["反复", "A Parents Palace reading can prompt discussion of authority figures, but it cannot establish that a manager is manipulative. Focus on documented behavior: repeated belittling, changing expectations, or promises that are not kept. Distinguish your observations from assumptions about motives, and do not treat a chart as evidence against another person."]]],
  ["ziwei-zhongnian-zhuanxing-35sui-daxian-jiaojie", [["实体", "A change of ten-year cycle can be used to compare themes of work, resources, location, and relationships. It does not establish that a business launch, relocation, or career change is the right next step. Identify what has actually changed and which responsibilities a proposed move would add."]]],
  ["ziwei-zhuxing-buruo-shaxing-duo-zenme-pingheng", [["贴身", "Distinguish a challenging star in the same palace from one connected through an aspect. Explain the chart relationship first, then compare the interpretation with the person's experience rather than treating either placement as a direct cause of events."]]],
  ["ziwei-zibei-zixin-ziwo-rentong", [["后天", "Ability and confidence do not always develop together. A chart reading can offer a vocabulary for discussing support and self-perception, but lived experience, feedback, and practice matter. Do not explain someone's confidence solely through a favorable or difficult palace label."]]],
  ["ziwei-zihuaji-ziwo-neijiu", [["小事", "For an ordinary completed task, consider whether further review would add useful information or merely repeat the same worry. Treat this as a practical reflection, not a chart-based diagnosis."]]],
  ["ziwei-zinvgong-huaji", [["省心", "The Children Palace is also used to discuss students, junior colleagues, and people being mentored. A challenging interpretation can raise questions about expectations and responsibility, but it does not prove that someone is incompetent, disloyal, or about to leave."]]],
  ["ziwei-ziwei-tianxiang-zai-zinvgong", [["成果", "The Children Palace can also frame discussion of students, junior colleagues, and creative work. With Zi Wei and Tian Xiang, explore responsibility, expectations, and rules without assuming that a child or colleague must have a particular personality."]]],
  ["ziwei-fumu-gong-buzhi-fumu-haiyou-zhangbei-wenshu-biyin", [
    ["磨合", "At work, readers may use the Parents Palace to discuss supervisors and other authority figures. Read it alongside the Career Palace and compare it with actual support, expectations, and disagreements."],
    ["后天", "Do not label parents or supervisors as bad people from challenging stars alone. Consider the relationship's history and the behavior that can actually be observed."],
  ]],
  ["ziwei-fuqi-xiangchu-moshi-hudong-wendu", [
    ["磨合", "Identify specific sources of support and recurring disagreements, then ask how both people respond to them."],
    ["磨合", "Do not infer a marriage outcome from one star. Discuss actual communication, shared expectations, and the timing layer being interpreted."],
  ], "Use the Spouse Palace and Life Palace to discuss communication, expectations, and recurring disagreements. Compare the interpretation with both people's actual behavior."],
  ["ziwei-geju-fanshui-taohua", [
    ["沉迷", "Tan Lang's traditional association with desire can prompt discussion of pleasure and boundaries. A placement does not establish an addiction, sexual behavior, or a lack of self-control."],
    ["收", "Discuss how interests and social confidence are balanced with responsibilities and agreed boundaries."],
  ]],
  ["ziwei-geju-riyue-fanbei", [
    ["靠", "This pattern is traditionally discussed through uneven support or effort that is less visible. Do not turn that symbolism into a claim that the person had no help or must struggle before a particular age."],
    ["后天", "Compare the interpretation with skills developed, support received, and choices made over time. An unfavorable pattern is not a fixed outcome or a requirement to prove yourself through hardship."],
  ]],
  ["ziwei-geju-ziwei-pojun", [
    ["耗", "Zi Wei and Po Jun bring together two traditional themes: maintaining order and changing an arrangement that no longer works. The useful question is how a person plans the transition. A chart combination does not establish that they are a natural leader, entrepreneur, or habitual destroyer."],
    ["面子", "One theme to explore is whether concern about standing or competence makes disagreement difficult. Ask for examples instead of assigning a fixed personality from the combination."],
  ]],
  ["ziwei-jiaoyougong-huake", [
    ["利益", "The Friends Palace includes friends, collaborators, and social networks. Hua Ke is often read through recognition, shared interests, or professional credibility. Ask how the actual connection developed rather than assuming it is free of obligation or competing interests."],
    ["各自", "Some friendships remain supportive without daily contact. Discuss expectations, availability, and mutual respect instead of assuming that distance either proves or weakens the bond."],
  ]],
  ["ziwei-kanpan-xiankan-dafangxiang", [
    ["后天", "Use the Body Palace to explore where sustained effort and lived experience are concentrated."],
    ["后天", "Read the Life Palace and Body Palace together, separating the traditional baseline interpretation from the person's actual development."],
  ]],
  ["ziwei-kelu-xiangfeng-mingsheng-shili", [
    ["偏差", "Locate Hua Ke and Hua Lu in the natal chart and identify which palaces and stars carry them. Do not assume that recognition automatically produces income."],
    ["偏差", "Distinguish natal, ten-year, and annual transformations before discussing timing. Compare the proposed connection between reputation and resources with actual opportunities."],
  ], "Read Hua Ke and Hua Lu together to explore recognition and resources. Check their stars, palaces, and timing without assuming that reputation guarantees income."],
  ["ziwei-liuchang-liuqu-liuyang-liutuo-liunian-ganxi", [
    ["兑现", "Keep the annual layer separate from the natal chart. Annual Lu, Chang, and Qu are traditionally discussed through support or visibility; Yang and Tuo through friction. Neither set confirms a bonus, a conflict, or another specific event."],
    ["细化", "State whether the reading concerns the year or a shorter period, and do not silently change the timing layer to make an interpretation fit."],
  ]],
  ["ziwei-minggong-sanfang-wu-jixing-zenme-du", [
    ["争取", "The absence of particular supporting stars does not mean the person will receive no help. Ask which real resources and relationships are available rather than equating a chart category with an empty life."],
    ["后天", "Read the major stars, palace relationships, and transformations together. Do not assume that a person is resilient or prone to self-doubt solely because a star is described as firm or gentle."],
  ]],
  ["ziwei-paipan-xuyao-na-xie-xinxi", [
    ["补", "Chart calculations depend on the inputs. An uncertain hour, calendar type, or birthplace may affect the result. Preserve what is known, label estimates clearly, and request missing information rather than silently supplying a precise value."],
    ["补", "If a family remembers only an approximate time such as 'around dawn,' record a range and investigate the original birth record. Do not claim that a chart comparison has proven an exact minute."],
  ]],
  ["ziwei-riyue-bingming-yuelang-tianmen-rizhao-leimen-guige", [
    ["兑现", "A favorable Sun-and-Moon pattern is a traditional description, not a promise of success. Read the actual supporting stars and transformations, then compare them with the person's responsibilities and opportunities."],
    ["兑现", "Check the pattern's stated formation conditions and the rest of the chart. A familiar name should not replace that check or be used to guarantee status and achievement."],
  ]],
  ["ziwei-tiande-zai-fudegong", [
    ["回应", "Tian De in the Inner Life Palace is often discussed through generosity, perspective, and support. Use those themes to ask about actual relationships; they do not guarantee that kindness will be repaid."],
    ["热情", "Balance helping others with your own limits and the responsibilities you can realistically sustain."],
  ]],
  ["ziwei-tianji-zai-fuqigong", [
    ["反复纠结", "Tian Ji in the Spouse Palace is traditionally read through thought, discussion, and change. Explore how the couple communicates and handles uncertainty, without assuming a partner's age, appearance, or mental state from the placement."],
    ["反复纠结", "With Hua Ji, ask whether a concern is repeatedly revisited and what information or conversation would help. The combination is not a diagnosis or evidence that a relationship cannot settle."],
  ]],
  ["ziwei-zhichang-jingzheng-yangtuo-biaoxian", [
    ["各自", "Identify Qing Yang and Tuo Luo in the relevant work-related palaces, then explain the traditional contrast between direct friction and prolonged obstacles without accusing a colleague of hidden motives."],
    ["各自", "Keep the ten-year and annual layers separate, and compare the interpretation with observed workplace events, responsibilities, and available support."],
  ], "Qing Yang and Tuo Luo are read through different forms of friction. Compare the chart's work-related palaces with observed workplace events and responsibilities."],
];

export const revisions = edits.map(([slug, corrections, description]) => {
  const file = `articles/en/${slug}.html`;
  const html = readFileSync(file, "utf8");
  const schema = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1])).find(item => item["@type"] === "Article");
  let body = html.match(/<article\b[^>]*id="article-start"[^>]*>([\s\S]*?)<\/article>/)?.[1]?.trim();
  assert(schema && body, file);
  const fullRewriteAlreadyApplied = slug === "ziwei-zihuaji-ziwo-neijiu"
    && body.includes("Zi Hua Ji means self-transformation into Hua Ji.");
  for (const [expected, paragraph] of fullRewriteAlreadyApplied ? [] : corrections) {
    const match = [...body.matchAll(/<(p|li)\b([^>]*)>([\s\S]*?)<\/\1>/g)].find(match => match[0].includes(expected));
    assert(match || body.includes(paragraph), `Unexpected source: ${file} / ${expected}`);
    if (match) body = body.replace(match[0], `<${match[1]}${match[2]}>${paragraph}</${match[1]}>`);
  }
  body = body.replaceAll('\\"', '"');
  if (slug === "ziwei-zihuaji-ziwo-neijiu") {
    body = `<p class="article-lead">Zi Hua Ji means self-transformation into Hua Ji. Translating it as 'self-jealousy' is misleading: it is a chart technique, not a claim that a person is jealous or has a particular mental-health condition.</p>
        <h2 id="section-1">What Is Transforming?</h2>
        <p>In this technique, a palace's own heavenly stem assigns Hua Ji to a star in that same palace. Identify the palace, the stem, and the star before interpreting it. Keep this separate from a birth-year Hua Ji assignment or a transformation directed from another palace.</p>
        <h2 id="section-2">Explain the Theme Without Diagnosing the Person</h2>
        <p>Traditional readings often discuss recurring attention, dissatisfaction, or difficulty letting a concern rest. Ask how the person experiences the relevant area of life rather than assuming that the chart proves anxiety, guilt, or perfectionism.</p>
        <p>For a work-related example, distinguish useful revision from repeatedly revisiting a completed task without new information. For a relationship example, distinguish a concern that needs a conversation from an interpretation of another person's motives. The chart cannot verify either situation on its own.</p>
        <h2 id="section-3">A Clear Reading Order</h2>
        <ol>
          <li>Confirm that the transformation is actually within the same palace.</li>
          <li>Name the star and keep the natal, palace-stem, and annual layers distinct.</li>
          <li>Read the related palace structure and other transformations.</li>
          <li>Compare the theme with an actual example and discuss alternative explanations.</li>
          <li>Keep practical suggestions separate from the symbolic interpretation.</li>
        </ol>`;
  }
  assert(!/[\u3400-\u9fff]/.test(body + (description || schema.description)), `Other fragments need review: ${file}`);
  return {
    file,
    title: slug === "ziwei-geju-ziwei-pojun" ? "Zi Wei and Po Jun: Building New Order Through Change"
      : slug === "ziwei-zihuaji-ziwo-neijiu" ? "Zi Hua Ji: Understanding Self-Transformation Into Hua Ji" : schema.headline,
    description: slug === "ziwei-zihuaji-ziwo-neijiu"
      ? "Zi Hua Ji is a palace-stem transformation, not self-jealousy. Identify the star and palace, separate the timing layers, and compare the reading with actual experience."
      : description || schema.description,
    body,
  };
});
assert.equal(revisions.length, 23);
