import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

// Human-reviewed English rewrites of existing question pages. No new URLs.
export const modified = "2026-11-06T14:39:00+08:00";
const pages = [
  {
    slug: "ai-suanming-chusheng-shijian-zhi-jide-fandian-qianhou-xian-wen-shenme",
    title: "Birth Time Remembered Only as Around Mealtime: What to Check First",
    description: "Turn an approximate birth time into a documented time range. Compare candidate charts without inventing a precise hour or treating a match as proof.",
    lead: "A memory such as 'around lunch' is a clue, not an exact birth time. Start by recording what is known and what remains uncertain. Do not turn a family estimate into a precise timestamp just because a form requires one.",
    sections: [
      ["Recover the Original Time Range", "Ask whether the family remembers a clock time, daylight, a hospital routine, or a particular meal. Meal schedules vary, so 'after dinner' cannot identify a traditional two-hour period on its own. Check a birth record when one is available."],
      ["Keep Candidate Charts Separate", "If the plausible range crosses an hour boundary, compare both charts using the same date, place, and calendar settings. Record the uncertainty beside each chart. Do not quietly overwrite the estimate after an appealing interpretation."],
      ["Use Past Events Carefully", "Choose a few dated, independently remembered events rather than broad personality descriptions. Agreement with a story does not prove a birth time; selective memory can make several charts seem convincing. If the evidence remains weak, keep the time range open and explain which parts of the reading depend on it."],
    ],
  },
  {
    slug: "ai-suanming-fufei-shengji-hou-shenme-caisuan-zhen-jiashen",
    title: "What Counts as a More Useful Paid AI Chart Reading?",
    description: "Judge an upgraded chart reading by clearer assumptions, relevant comparisons, and useful limits, not a longer answer or a more confident tone.",
    lead: "A paid answer is not automatically a deeper answer. More paragraphs, stronger promises, and warmer language can make a reading feel more substantial without making its reasoning easier to assess.",
    sections: [
      ["Look for a Clear Explanation", "A useful upgrade identifies the relevant palaces, combinations, and timing layer, then explains how they relate to the question. It distinguishes chart interpretation from facts supplied by the user and from practical suggestions."],
      ["Ask What Would Change the Answer", "The reading should state its assumptions and discuss alternatives. For a career question, a possible change in responsibilities is different from an actual job offer. Ask what evidence would weaken the interpretation and what information is still missing."],
      ["Assess Usefulness Before Buying More", "Compare the stated service with what was delivered: scope, clarity, response length, and any export or follow-up features. Do not treat emotional reassurance as evidence of predictive accuracy. If an answer remains generic, request clarification rather than assuming another purchase will resolve the uncertainty."],
    ],
  },
  {
    slug: "ai-suanming-ganqing-hepan-qian-xian-zhunbei-neilianglei-jiushi",
    title: "What Past Examples Help Make a Relationship Chart Reading More Specific?",
    description: "Prepare one example of a recurring relationship pattern and one practical commitment. Keep observed events separate from chart-based interpretations.",
    lead: "A relationship reading becomes easier to discuss when both people can describe actual events. Prepare one example of a recurring interaction and one example of a practical decision, rather than only asking whether the relationship is a good match.",
    sections: [
      ["Describe a Repeated Interaction", "Choose a specific situation involving communication, distance, conflict, or reconciliation. Say what happened and roughly when. Separate what each person did from assumptions about motives; the chart cannot verify what someone secretly thinks."],
      ["Describe a Practical Commitment", "A move, shared schedule, caregiving task, or agreed expense can show how the couple coordinates real responsibilities. Explain what was agreed, what changed, and whether both people understood the arrangement in the same way."],
      ["Use the Reading as a Discussion Aid", "Ask the reader to connect each interpretation to the examples and acknowledge alternatives. Do not use a matching story as proof that the relationship will last or fail. The useful outcome is a clearer question to discuss together, not a verdict about either person's character."],
    ],
  },
  {
    slug: "ai-suanming-hui-qiangongsi-xiankan-ziwei-haishi-liuyao",
    title: "Returning to a Former Employer: Separate Career Fit From This Offer",
    description: "Distinguish a long-term career question from a specific return offer. Use chart interpretations as reflection, alongside the actual role and working conditions.",
    lead: "'Should I return to my old employer?' contains at least two questions: whether the role fits your longer-term direction, and whether the particular offer is workable now. Treating them as one yes-or-no prediction hides important differences.",
    sections: [
      ["Start With What Has Changed", "List why you left, why a return is being discussed, and what is different about the proposed role. A new title does not necessarily mean a different manager, workload, or decision-making structure."],
      ["Keep the Interpretive Methods in Context", "Zi Wei Dou Shu readings commonly discuss a broader career pattern, while a Liu Yao question focuses on a particular situation. Neither method can verify an employer's promises or guarantee an outcome. Define the question before comparing interpretations."],
      ["Check the Offer Against Your Priorities", "Compare responsibilities, reporting lines, hours, location, and written terms with the reasons you originally left. If the reading suggests a period of change, ask how that differs from the practical changes already visible. Keep unresolved facts unresolved rather than filling the gaps with a favorable chart explanation."],
    ],
  },
  {
    slug: "ai-suanming-mianfei-diyilun-hou-yaobuyao-mashang-buyi-lun",
    title: "After a Free AI Chart Reading, Is Another Question Worth Asking?",
    description: "Before a second reading, identify the question left unanswered, check the inputs, and decide what useful clarification a follow-up could provide.",
    lead: "You do not need a second reading simply because the first one was free. A useful follow-up resolves a specific gap. Repeating the same question in different words can instead create a loop of reassurance without adding information.",
    sections: [
      ["Check the First Answer", "Did it address your question, use the correct chart, and explain the relevant interpretation? If the birth details or selected chart were wrong, correct those first. More discussion of the wrong chart is not greater depth."],
      ["Name One Missing Point", "For example, ask whether a career comment refers to a change in responsibilities or a change of employer. Ask which palace combination supports that distinction and what is uncertain. This is more focused than asking for another general overview."],
      ["Know When to Stop", "Stop when the next answer would only repeat the same assumptions. You can record the interpretation and revisit it after new facts emerge. A reading should not pressure you to keep asking, spend more, or rely on repeated predictions to make an ordinary decision."],
    ],
  },
  {
    slug: "ai-suanming-nongli-runyue-shengri-zenme-tiwen-bucuo",
    title: "How to Enter a Lunar Leap-Month Birthday Without Changing the Date",
    description: "Record the lunar year, month, day, and leap-month status separately. Verify the converted date and distinguish calendar conversion from charting conventions.",
    lead: "A regular lunar month and its leap-month counterpart are different dates. Preserve the original record before starting a chart: lunar year, month, day, whether it is the leap month, and the known birth time.",
    sections: [
      ["Make the Leap-Month Status Explicit", "Write 'leap fourth month,' for example, rather than only 'fourth month.' A year may contain both. Confirm the calendar type with the person who supplied the record instead of inferring it from a familiar-looking date."],
      ["Check the Converted Calendar Date", "After conversion, compare the displayed Gregorian date with a reliable calendar reference. If the interface does not clearly distinguish the regular and leap months, do not submit a guessed date merely to continue. Keep the original details visible for correction."],
      ["Separate the Date From the Charting Rule", "A Zi Wei calculation may apply a particular convention to leap-month births. That convention is separate from identifying the person's actual birthday. Ask which rule is used and whether it affects the chart. Changing the interpretation convention must not silently rewrite the birth record."],
    ],
  },
  {
    slug: "ai-suanming-shuo-liangge-xuanze-dounengzuo-kaopuma",
    title: "When AI Says Both Options Can Work, What Should It Explain?",
    description: "A useful comparison explains each option's conditions, trade-offs, and uncertainties. 'Both can work' is not enough without a clear basis for comparing them.",
    lead: "Sometimes two choices are genuinely workable. The problem is not that an AI reading allows both; it is that the answer may avoid explaining how they differ or which priorities would favor one over the other.",
    sections: [
      ["Compare the Same Criteria", "Ask the system to use the same criteria for both options. For two roles, compare responsibilities, working conditions, location, and room to learn. For two ways of handling a relationship disagreement, compare boundaries, communication, and what both people can actually agree to."],
      ["Explain the Assumptions", "A chart-based interpretation should identify what it assumes and distinguish that from your stated circumstances. An option may look appealing only if an uncertain condition is met. Ask what would change the comparison rather than requesting a more confident prediction."],
      ["Keep the Decision With You", "A useful answer can help organize the trade-offs; it cannot determine your values or verify missing facts. If the options remain close, identify the next piece of practical information you need. Repeating a reading until it chooses your preferred option does not make the result more reliable."],
    ],
  },
  {
    slug: "ai-suanming-xiang-lianxu-wen-san-jian-dashi-xian-an-shenme-shunxu",
    title: "How to Order Three Big Questions in an AI Chart Reading",
    description: "Identify dependencies before asking about work, relationships, and housing together. Keep each question's inputs and interpretation separate.",
    lead: "When several decisions arrive at once, begin with the one that changes the conditions of the others. The most emotionally urgent question is not always the first one to resolve.",
    sections: [
      ["Map the Dependencies", "Suppose a possible job move would change your city, housing, and relationship schedule. First establish what is known about the job decision. Otherwise, later answers may assume a relocation that has not been offered or accepted."],
      ["Ask One Defined Question at a Time", "State the current situation, the decision being considered, and any relevant timeframe. When moving to the next topic, explain which earlier facts remain uncertain. An AI should not turn a tentative interpretation from one answer into a confirmed event in the next."],
      ["Separate Interpretation From Action", "For each topic, keep three short notes: the chart-based interpretation, the facts supporting or contradicting it, and the next practical step. This makes it easier to spot contradictions without requesting a fresh general reading every time one detail changes."],
    ],
  },
  {
    slug: "ai-suanming-zhi-gei-jielun-bugei-guocheng-zhibuzhi-jixu",
    title: "What to Ask When an AI Chart Reading Gives Only a Conclusion",
    description: "Request a concise explanation of the chart factors, assumptions, and uncertainty. A confident conclusion alone is not evidence of a reliable reading.",
    lead: "An answer such as 'you can make the change' is hard to assess without an explanation. Ask for the relevant factors and limits, not an increasingly confident version of the same conclusion.",
    sections: [
      ["Request an Explainable Summary", "Ask which palaces, combinations, and time period are relevant, and how they connect to the question. A concise explanation is enough; a long account of internal model reasoning is neither necessary nor proof of accuracy."],
      ["Check What Came From You", "Separate facts you supplied from interpretations drawn from the chart. If you already mentioned workplace pressure, an answer repeating that pressure is not independent confirmation. Ask what additional distinction the chart interpretation is making."],
      ["Ask About Alternatives and Limits", "What other explanation could fit, and what missing information would matter? If the answer cannot address those questions, do not treat more fluent wording as greater reliability. Keep the reading as a tentative reflection and use verifiable information for the actual decision."],
    ],
  },
];

export const revisions = pages.map(page => {
  const file = `articles/en/${page.slug}.html`;
  assert(readFileSync(file, "utf8").includes('id="article-start"'), `Existing page missing: ${file}`);
  const body = `<p class="article-lead">${page.lead}</p>\n` + page.sections.map(([title, paragraph], index) =>
    `        <h2 id="section-${index + 1}">${title}</h2>\n        <p>${paragraph}</p>`).join("\n");
  assert(!/[\u3400-\u9fff]/.test(body + page.title + page.description));
  return { file, title: page.title, description: page.description, body };
});
assert.equal(revisions.length, 9);
