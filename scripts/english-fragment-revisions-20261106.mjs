import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

export const modified = "2026-11-06T14:42:00+08:00";
// Replace a reviewed paragraph, not isolated Chinese words across arbitrary text.
const edits = [
  ["ziwei-anyao-xiaosha-qun-tianxing-tianyue-tianshang-tianshi-yinsha", "微调", "A list of minor challenging stars can sound alarming. First check which major stars they accompany and whether the same theme appears elsewhere in the chart. Treat a minor star as a secondary detail, not a stand-alone warning that something bad will happen."],
  ["ziwei-benming-daxian-liunian-jixiong-bazuhe", "兑现", "When the natal chart, ten-year cycle, and annual cycle are all read as supportive, the traditional interpretation is that several layers point in the same direction. That is not a measured probability of success. Compare the opportunity with actual resources, timing, and constraints before making a major decision."],
  ["ziwei-daxian-jiaotuo-qi", "主动", "Compare the next cycle's themes with your circumstances. A favorable interpretation can prompt preparation; a difficult one is not a reason to abandon a sound plan or assume that setbacks are inevitable."],
  ["ziwei-daxian-zou-fuqi-shinian-guanxi", "磨合", "Read challenging stars as prompts to examine communication and adjustment, not as proof that a relationship will fail.", "When a ten-year cycle reaches the natal Spouse Palace, examine partnership, commitment, and shared responsibilities alongside the wider chart."],
  ["ziwei-doushu-yu-xingzuo-taluo-qubie", "起伏", "If you use several systems, be clear about the question each is being used to explore. Sun-sign descriptions offer broad personality themes, Zi Wei readings organize palace and cycle interpretations, and Tarot provides a question-focused symbolic exercise. None should replace verified information or make a decision for you."],
  ["ziwei-duigong-jiexing-jiexian", "落陷", "A star described as fallen is traditionally interpreted as having a less straightforward expression. Do not turn that label into a precise percentage: the companion stars, palace relationships, and reading convention still matter."],
  ["ziwei-fazhan-fangwei-chengshi-quyu", "奔波", "Read Tian Ma and its relationship with Lu to explore movement and opportunity, then compare the practical benefits of relocating with travel demands and disruption."],
  ["ziwei-feilian-posui", "损耗", "Fei Lian is traditionally associated with rumors and disputes; Po Sui with small losses, breakage, and things left incomplete. These are symbolic themes, not evidence that someone is spreading rumors or that possessions will be damaged. Check observable facts before applying either description.", "Fei Lian and Po Sui are traditionally associated with rumors, disputes, minor losses, and breakage. Read them in context rather than as predictions."],
  ["ziwei-fudegong-huaquan", "减压", "If the reading raises a theme of sustained mental pressure, compare it with your actual routines and workload. A star combination cannot diagnose anxiety or explain a sleep problem. Treat rest and stress management as practical matters, separate from the symbolic interpretation."],
  ["ziwei-fuqigong-buhao-hunyin-chai", "磨合", "Relationship pressure can reveal where expectations need discussion or adjustment. It does not automatically produce growth, and the chart cannot establish whether the relationship is healthy."],
  ["ziwei-fuqigong-huaji", "磨合", "Some couples develop better communication after a difficult period, but staying together is not proof that a bond has become stronger. Hua Ji can be used to discuss recurring concerns; it does not require someone to endure a harmful relationship."],
  ["ziwei-fuqigong-shendu-qinmi-guanxi-hudong-moshi", "磨合", "Challenging stars in the Spouse Palace do not establish that a divorce will occur. Use the interpretation to ask about recurring disagreements, unmet expectations, and how both people respond. Avoid judging a partner solely from chart labels or ignoring the chart owner's part in the interaction."],
  ["ziwei-geju-bu-neng-taoshuyin", "不足", "A pattern that does not meet every traditional condition is not a verdict of failure. Later opportunities, support, learned skills, and personal choices all affect real outcomes; chart labels cannot substitute for that evidence."],
  ["ziwei-geju-wutan", "沉迷", "A reading may raise questions about appetite for risk or excitement. That does not establish a person's behavior or financial capacity, and a favorable pattern is not evidence that speculation will succeed."],
  ["ziwei-geju-xingqiu-jiayin", "主动", "Do not interpret a difficult pattern as a reason to expect trouble or provoke a dispute. Assess any actual problem on its facts and seek appropriate professional support when needed."],
  ["ziwei-geju-zifu-tonggong", "面子", "One possible theme is a strong concern with competence and public standing. Ask whether that makes it harder to admit uncertainty or request help, rather than assuming that everyone with this combination behaves the same way."],
  ["ziwei-huagai-xing", "高处不胜寒", "Hua Gai is also associated with a preference for solitude or specialized interests. Feeling out of step with a group is one possible reading, but it does not prove spiritual superiority or mean that no one can understand you."],
  ["ziwei-huake-bu-yiding-youming", "气质", "Hua Ke is traditionally connected with recognition and credibility, not income by itself. A good reputation or an introduction can create an opening without producing paid work. Read it with Hua Lu, Hua Quan, the relevant palaces, and the person's actual opportunities before discussing how recognition might be used."],
  ["ziwei-hunwai-youhuo-ganqing-bianjie", "动摇", "A Spouse Palace reading can prompt questions about commitment and recurring pressure, but it cannot establish that a partner is unfaithful or that temptation will arise. Discuss observed behavior, agreed boundaries, and unmet needs rather than treating an annual star combination as evidence about another person's intentions."],
  ["ziwei-jiwa-jiaoyu-neijuan-fencun", "规律", "Distinguish a manageable challenge from a workload that overwhelms the child. Leave time for sleep, play, exercise, curiosity, and family relationships. Base educational choices on the child's demonstrated needs and development, not a chart label or a parent's fear of falling behind."],
  ["ziwei-kanpan-yao-jiehe-shiji", "现状", "Ask about the current situation: occupation, age, relationship context, and the main question. Do not assume that a chart symbol is already a real event."],
  ["ziwei-kanpan-yao-kan-nianling", "折腾", "Po Jun's theme of change can be discussed differently at different ages: trying out an identity when young, restructuring responsibilities in midlife, or reconsidering routines later on. These are illustrative contexts, not fixed stages everyone must experience."],
  ["ziwei-kongjie-bu-shi-meiyou", "偏向", "Di Kong and Di Jie are traditionally discussed through themes of emptiness and change. Di Kong is often linked with ideas or detachment, while Di Jie is discussed through tangible resources and disruption. Neither name proves that a loss will occur. Ask what is actually changing before applying the symbolism.", "Di Kong and Di Jie are associated with emptiness and change. Read their context and companion stars rather than treating their names as predictions of loss."],
  ["ziwei-kongjie-jiaming", "反复", "The palace being flanked changes the subject of the interpretation. In the Wealth Palace, discuss resources and cash flow; in the Career Palace, changing work arrangements; in the Spouse Palace, expectations and security; in the Property Palace, housing or family plans. These themes do not establish that any specific loss or disruption will happen."],
  ["ziwei-liantan-tonggong-lianzhen-tanlang-sihai-duobian", "命题", "Lian Zhen with Tan Lang should not be reduced to a claim about flirtation. A more useful discussion asks how social energy, taste, and ambition are directed, and whether the person has sustainable boundaries and an outlet for those interests."],
];

export const revisions = edits.map(([slug, expected, paragraph, description]) => {
  const file = `articles/en/${slug}.html`;
  const html = readFileSync(file, "utf8");
  const schema = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1])).find(item => item["@type"] === "Article");
  let body = html.match(/<article\b[^>]*id="article-start"[^>]*>([\s\S]*?)<\/article>/)?.[1]?.trim();
  assert(schema && body, file);
  const matches = [...body.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)].filter(match => match[0].includes(expected));
  assert(matches.length === 1 || (matches.length === 0 && body.includes(paragraph)), `Unexpected source: ${file}`);
  if (matches.length) body = body.replace(matches[0][0], `<${matches[0][1]}>${paragraph}</${matches[0][1]}>`);
  body = body.replaceAll('\\"', '"');
  assert(!/[\u3400-\u9fff]/.test(body), `Other fragments need review: ${file}`);
  const title = slug === "ziwei-kongjie-bu-shi-meiyou" ? "Kong Jie and Emptiness: Read the Full Context" : schema.headline;
  return { file, title, description: description || schema.description, body };
});
assert.equal(revisions.length, 25);
