const fs=require('fs'),path=require('path');
const date='2026-08-26T10:00:00+08:00';
function jstr(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"');}

const PALACES = {
  minggong:{cn:'命宫',en:'Life Palace',domain:'核心性格、人生基调与外在表现',domainEn:'core personality, life direction, and outward expression',
    cnQuestions:['这辈子的性格优势在哪','人生整体顺不顺','我给人的第一印象是什么'],enQuestions:['where personality strengths lie','whether life flows smoothly','what first impression you give']},
  xiongdigong:{cn:'兄弟宫',en:'Siblings Palace',domain:'手足关系、同辈缘分与资金周转',domainEn:'sibling relationships, peer bonds, and cash turnover',
    cnQuestions:['兄弟姐妹能不能帮上忙','跟同辈合不合','资金周转灵不灵'],enQuestions:['whether siblings can help','how peer relationships are','whether cash flow is flexible']},
  fuqigong:{cn:'夫妻宫',en:'Spouse Palace',domain:'感情婚姻、伴侣特质与亲密关系',domainEn:'love, marriage, partner traits, and intimacy',
    cnQuestions:['另一半是什么样的人','感情顺不顺','婚姻最大的功课是什么'],enQuestions:['what the partner is like','whether relationships go smoothly','the biggest lesson in marriage']},
  zinvgong:{cn:'子女宫',en:'Children Palace',domain:'子女缘分、晚辈关系与创意产出',domainEn:'children, junior relationships, and creative output',
    cnQuestions:['孩子缘深不深','跟子女关系怎样','创造力如何'],enQuestions:['whether children luck is strong','how relationships with children are','how creativity is']},
  caibogong:{cn:'财帛宫',en:'Wealth Palace',domain:'收入方式、求财路径与现金流',domainEn:'income style, earning path, and cash flow',
    cnQuestions:['钱从哪里来','能不能存住钱','适合什么赚钱方式'],enQuestions:['where money comes from','whether it can be retained','what earning method fits']},
  jiegong:{cn:'疾厄宫',en:'Health Palace',domain:'体质弱点、慢性病与意外灾厄',domainEn:'physical weaknesses, chronic conditions, and accidents',
    cnQuestions:['哪里最容易出问题','什么习惯最伤身','什么时候要特别注意'],enQuestions:['what is most vulnerable','which habits harm most','when to be extra careful']},
  qianyi:{cn:'迁移宫',en:'Travel Palace',domain:'外出运势、人际外缘与远方机遇',domainEn:'travel luck, external connections, and distant opportunities',
    cnQuestions:['适不适合外出发展','外面有没有贵人','离乡是好是坏'],enQuestions:['whether leaving home suits you','whether benefactors await outside','whether departure helps or hurts']},
  puyigong:{cn:'仆役宫',en:'Friends Palace',domain:'下属、朋友、合伙人与社交圈',domainEn:'subordinates, friends, partners, and social circle',
    cnQuestions:['朋友靠不靠谱','能不能合伙','下属能不能用'],enQuestions:['whether friends are reliable','whether partnership works','whether subordinates are capable']},
  guanlugong:{cn:'官禄宫',en:'Career Palace',domain:'工作运势、事业格局与职场状态',domainEn:'work fortune, career structure, and job situation',
    cnQuestions:['适合什么行业','能不能当主管','事业天花板在哪'],enQuestions:['what industry fits','whether management suits you','where the career ceiling is']},
  tianzhaigong:{cn:'田宅宫',en:'Property Palace',domain:'房产家业、居住环境与固定资产',domainEn:'real estate, living environment, and fixed assets',
    cnQuestions:['有没有房产运','家里环境怎样','能不能守住家底'],enQuestions:['whether property luck exists','what the home environment is like','whether family assets can be kept']},
  fudegong:{cn:'福德宫',en:'Fortune Palace',domain:'精神状态、福气心态与兴趣享受',domainEn:'mental state, blessings, mindset, and enjoyment',
    cnQuestions:['内心安不安','有没有福气','花钱买开心值不值'],enQuestions:['whether the mind is at peace','whether blessings exist','whether spending on joy is worth it']},
  fumugong:{cn:'父母宫',en:'Parents Palace',domain:'父母缘分、长辈助力与文书学历',domainEn:'parents, elder support, documents, and education',
    cnQuestions:['父母能不能靠','跟长辈关系怎样','文书运好不好'],enQuestions:['whether parents can be relied on','how elder relationships are','whether document luck is good']}
};

const STARS = {
  qingyang: {cn:'擎羊',en:'Qing Yang',elem:'阳金',elemEn:'yang metal',nature:'刑星、煞星',natureEn:'the punishment star and malefic star',
    cnTraits:['刚烈冲动、敢打敢拼','容易受伤、有刀光血光','执行力极强、不留后路','性子急、容易得罪人','煞星用对地方是魄力'],
    enTraits:['fierce and impulsive, dares to fight','prone to injury, cuts and bloodshed','extremely strong execution, no retreat','quick-tempered, easily offends others','a malefic used right is boldness']},
  tuoluo: {cn:'陀罗',en:'Tuo Luo',elem:'阴金',elemEn:'yin metal',nature:'忌星、煞星',natureEn:'the taboo star and malefic star',
    cnTraits:['拖延纠缠、事情反复','固执己见、转不过弯','暗中进行、不光明正大','容易有慢性病和旧疾','耐心和毅力是陀罗的正面'],
    enTraits:['procrastination and entanglement, matters repeat','stubborn, cannot change direction','hidden, not above-board','prone to chronic and old ailments','patience and persistence are Tuo Luo positive side']},
  huoxing: {cn:'火星',en:'Huo Xing',elem:'阳火',elemEn:'yang fire',nature:'煞星、暴败星',natureEn:'the fire star and sudden-rise-fall star',
    cnTraits:['脾气急躁、爆发力强','突发状况多、来得快去得快','性格热情、有感染力','容易冲动坏事','火星的爆发力用对了是冲劲'],
    enTraits:['quick temper, strong explosive power','many sudden events, fast come fast go','passionate personality, infectious','prone to impulsive mistakes','Huo Xing explosiveness used right is drive']},
  lingxing: {cn:'铃星',en:'Ling Xing',elem:'阴火',elemEn:'yin fire',nature:'煞星、阴沉星',natureEn:'the bell star and gloomy malefic',
    cnTraits:['性格阴沉、喜怒不形于色','记仇、报复心强','暗中的破坏和消耗','耐心好、能忍常人不能忍','铃星的隐忍用对了是谋略'],
    enTraits:['gloomy nature, emotions hidden','holds grudges, strong vindictiveness','hidden destruction and drain','great patience, endures what others cannot','Ling Xing endurance used right is strategy']},
  dikong: {cn:'地空',en:'Di Kong',elem:'阴火',elemEn:'yin fire',nature:'空亡星、耗星',natureEn:'the void star and draining star',
    cnTraits:['精神上追求空灵、不重物质','容易破财、计划落空','思想独特、有宗教缘','做事不切实际、容易空想','地空的创造力和灵感是正面'],
    enTraits:['spiritually oriented, not materialistic','prone to financial loss, plans fall through','unique thinking, spiritual affinity','unrealistic, prone to empty ideas','Di Kong creativity and inspiration are positive']}
};

const CN_TITLES = {
  'qingyang-fudegong':'精神上急躁闲不住，放松对他们来说很难',
  'qingyang-fumugong':'父母管教严厉，与长辈关系有摩擦',
  'tuoluo-minggong':'性子慢但韧劲足，大器晚成的类型',
  'tuoluo-xiongdigong':'兄弟姐妹中有固执者，资金周转慢',
  'tuoluo-fuqigong':'感情里有纠缠，旧情难忘是功课',
  'tuoluo-zinvgong':'孩子性子慢，教育要有耐心不要催',
  'tuoluo-caibogong':'赚钱慢但能守，适合长线投资',
  'tuoluo-jiegong':'注意慢性病和旧疾，调理要坚持',
  'tuoluo-qianyi':'在外发展多拖延，离乡要耐住性子',
  'tuoluo-puyigong':'朋友中有难缠的人，合伙防纠缠',
  'tuoluo-guanlugong':'事业上大器晚成，坚持比速度重要',
  'tuoluo-tianzhaigong':'房产家事多拖延，家里有旧问题',
  'tuoluo-fudegong':'精神上容易钻牛角尖，学会放下',
  'tuoluo-fumugong':'与父母缘分有纠缠，沟通需要时间',
  'huoxing-minggong':'脾气急爆发力强，人生像过山车',
  'huoxing-xiongdigong':'兄弟姐妹中有急性子，关系时好时坏',
  'huoxing-fuqigong':'感情来得快去得快，闪婚闪离风险',
  'huoxing-zinvgong':'孩子活泼好动，教育要引导精力',
  'huoxing-caibogong':'财运暴起暴落，投机要谨慎',
  'huoxing-jiegong':'注意急性炎症和烫伤，防火',
  'huoxing-qianyi':'在外突发状况多，离乡要防意外',
  'huoxing-puyigong':'朋友中有暴躁者，合伙防冲突',
  'huoxing-guanlugong':'事业上爆发力强但不持久',
  'huoxing-tianzhaigong':'家里容易有突发状况，防火电',
  'huoxing-fudegong':'精神上急躁，情绪来得快去得快',
  'huoxing-fumugong':'父母脾气急，家庭氛围火爆',
  'lingxing-minggong':'性格内敛深沉，喜怒不形于色',
  'lingxing-xiongdigong':'兄弟姐妹中有阴沉者，关系微妙',
  'lingxing-fuqigong':'感情里有暗涌，冷战比吵架多',
  'lingxing-zinvgong':'孩子内向敏感，教育要多关注情绪',
  'lingxing-caibogong':'暗中破财，花钱不知不觉',
  'lingxing-jiegong':'注意暗疾和心理问题，定期体检',
  'lingxing-qianyi':'在外有隐性阻碍，离乡防小人',
  'lingxing-puyigong':'朋友中有人暗中算计，交友要慎',
  'lingxing-guanlugong':'事业上有暗斗，职场防小人',
  'lingxing-tianzhaigong':'家里有隐性问题，家事难断',
  'lingxing-fudegong':'精神上容易抑郁，情绪要疏导',
  'lingxing-fumugong':'与父母有隐性矛盾，心结要解',
  'dikong-minggong':'精神世界丰富但不重物质，适合创意行业',
  'dikong-xiongdigong':'兄弟姐妹缘分淡，资金周转容易落空'
};
const EN_TITLES = {
  'qingyang-fudegong':'Restless Spirit; Relaxation Is Difficult',
  'qingyang-fumugong':'Strict Parents; Friction with Elders',
  'tuoluo-minggong':'Slow but Tenacious; A Late Bloomer',
  'tuoluo-xiongdigong':'A Stubborn Sibling; Slow Cash Flow',
  'tuoluo-fuqigong':'Entanglement in Love; Letting Go of Old Flames',
  'tuoluo-zinvgong':'Slow-Paced Children; Patience Over Pressure',
  'tuoluo-caibogong':'Slow Earnings but Good at Keeping; Suited to Long-Term',
  'tuoluo-jiegong':'Watch Chronic and Old Ailments; Persist in Treatment',
  'tuoluo-qianyi':'Delays Outside; Patience When Leaving Home',
  'tuoluo-puyigong':'A Difficult Friend; Beware Entanglement',
  'tuoluo-guanlugong':'Late-Blooming Career; Persistence Over Speed',
  'tuoluo-tianzhaigong':'Property Delays; Old Problems at Home',
  'tuoluo-fudegong':'Prone to Obsessive Thinking; Learn to Let Go',
  'tuoluo-fumugong':'Entangled Parental Bonds; Communication Takes Time',
  'huoxing-minggong':'Quick Temper, Strong Drive; Life Is a Rollercoaster',
  'huoxing-xiongdigong':'A Hot-Tempered Sibling; On-Again Off-Again Relationship',
  'huoxing-fuqigong':'Love Comes and Goes Fast; Flash Marriage Risk',
  'huoxing-zinvgong':'Active, Restless Children; Guide Their Energy',
  'huoxing-caibogong':'Boom-Bust Wealth; Cautious with Speculation',
  'huoxing-jiegong':'Watch Acute Inflammation and Burns; Fire Safety',
  'huoxing-qianyi':'Sudden Events Outside; Beware Accidents',
  'huoxing-puyigong':'A Hot-Tempered Friend; Prevent Conflict',
  'huoxing-guanlugong':'Explosive but Not Sustained Drive at Work',
  'huoxing-tianzhaigong':'Sudden Problems at Home; Fire and Electrical Safety',
  'huoxing-fudegong':'Mentally Restless; Emotions Come and Go Fast',
  'huoxing-fumugong':'Hot-Tempered Parents; Fiery Family Atmosphere',
  'lingxing-minggong':'Reserved and Deep; Emotions Hidden',
  'lingxing-xiongdigong':'A Gloomy Sibling; Subtle Relationship',
  'lingxing-fuqigong':'Undercurrents in Love; Cold Wars Over Arguments',
  'lingxing-zinvgong':'Introverted, Sensitive Children; Attend to Emotions',
  'lingxing-caibogong':'Hidden Financial Loss; Money Disappears Unnoticed',
  'lingxing-jiegong':'Watch Hidden Illness and Mental Health; Regular Checkups',
  'lingxing-qianyi':'Hidden Obstacles Outside; Beware Saboteurs',
  'lingxing-puyigong':'A Secretly Calculating Friend; Choose Friends Carefully',
  'lingxing-guanlugong':'Hidden Office Politics; Beware Saboteurs',
  'lingxing-tianzhaigong':'Hidden Problems at Home; Family Matters Hard to Settle',
  'lingxing-fudegong':'Prone to Depression; Emotions Need Outlet',
  'lingxing-fumugong':'Hidden Conflict with Parents; Knots to Untie',
  'dikong-minggong':'Rich Inner World, Not Materialistic; Suited to Creative Fields',
  'dikong-xiongdigong':'Weak Sibling Bonds; Cash Flow Plans Fall Through'
};

const combos = [
  ['qingyang','fudegong'],['qingyang','fumugong'],
  ['tuoluo','minggong'],['tuoluo','xiongdigong'],['tuoluo','fuqigong'],['tuoluo','zinvgong'],
  ['tuoluo','caibogong'],['tuoluo','jiegong'],['tuoluo','qianyi'],['tuoluo','puyigong'],
  ['tuoluo','guanlugong'],['tuoluo','tianzhaigong'],['tuoluo','fudegong'],['tuoluo','fumugong'],
  ['huoxing','minggong'],['huoxing','xiongdigong'],['huoxing','fuqigong'],['huoxing','zinvgong'],
  ['huoxing','caibogong'],['huoxing','jiegong'],['huoxing','qianyi'],['huoxing','puyigong'],
  ['huoxing','guanlugong'],['huoxing','tianzhaigong'],['huoxing','fudegong'],['huoxing','fumugong'],
  ['lingxing','minggong'],['lingxing','xiongdigong'],['lingxing','fuqigong'],['lingxing','zinvgong'],
  ['lingxing','caibogong'],['lingxing','jiegong'],['lingxing','qianyi'],['lingxing','puyigong'],
  ['lingxing','guanlugong'],['lingxing','tianzhaigong'],['lingxing','fudegong'],['lingxing','fumugong'],
  ['dikong','minggong'],['dikong','xiongdigong']
];

function genArticle(starKey, pKey) {
  const s = STARS[starKey], p = PALACES[pKey];
  const slug = `ziwei-${starKey}-zai-${pKey}`;
  return {
    slug, starKey, pKey,
    cnTitle: `${s.cn}在${p.cn}：${CN_TITLES[starKey+'-'+pKey]}`,
    enTitle: `${s.en} in ${p.en}: ${EN_TITLES[starKey+'-'+pKey]}`,
    cnDesc: `${s.cn}在${p.cn}，${p.domain}。${s.cn}是${s.nature}，落在${p.cn}有它独特的表现和需要注意的地方。`,
    enDesc: `${s.en} in the ${p.en} affects ${p.domainEn}. As ${s.natureEn}, it brings distinct patterns and cautions.`,
    cnLead: `${s.cn}是${s.nature}。落在${p.cn}，它的能量会在${p.domain}这件事上表现出来。${s.cn}的关键词是${s.cnTraits.slice(0,3).join('、')}，这些特质放到${p.cn}的场景里，会产生具体的现实对应。煞星不可怕，可怕的是不知道煞在哪里、怎么化。`,
    enLead: `${s.en} is ${s.natureEn}. In the ${p.en}, its energy shows up in matters of ${p.domainEn}. ${s.en} keywords are ${s.enTraits.slice(0,3).join(', ')}, producing concrete patterns in the ${p.en} context. Malefics are not frightening; what is frightening is not knowing where the sharp edge is or how to transform it.`,
    cnIntro2: `${p.cn}看的是${p.domain}。${s.cn}属${s.elem}，能量特质是${s.cnTraits[0]}。读${s.cn}在${p.cn}不能只看单宫，必须回到三方四正——有吉星会照则煞性被制住，煞星聚则力量加倍。煞星的正面意义往往被忽略：${s.cnTraits[4]}。`,
    enIntro2: `The ${p.en} covers ${p.domainEn}. ${s.en} is ${s.elemEn}, with energy of ${s.enTraits[0]}. Reading it requires the triple-direction view — with auspicious stars the malefic is controlled; with other malefics its power doubles. The positive side is often overlooked: ${s.enTraits[4]}.`
  };
}

function cnSections(a) {
  const s = STARS[a.starKey], p = PALACES[a.pKey];
  return [
    {h:`${s.cn}在${p.cn}的核心表现`, ps:[
      `${s.cnTraits[0]}——在${p.domain}这件事上，这个特质最直接。`,
      `${s.cnTraits[1]}——这决定了${s.cn}在${p.cn}的表现方式。`,
      `${s.cnTraits[2]}——放到${p.cn}的场景里，表现为具体的行为模式。`,
      `${s.cnTraits[3]}——这是把双刃剑，用好了是优势，用不好是麻烦。`,
      `${s.cnTraits[4]}——这一面往往被忽略，但在${p.domain}中很关键。`
    ]},
    {h:`有吉星和有煞星的区别`, ps:[
      `加左辅右弼——${p.domain}中有人帮衬，${s.cn}的煞性被缓冲。`,
      `加天魁天钺——关键时刻有贵人提携，${p.cn}的灾厄能化解。`,
      `加文昌文曲——${s.cn}配上谋略和文采，煞性转为手段。`,
      `加擎羊陀罗——${p.domain}的过程更费劲，煞星聚则波折多。`,
      `加火星铃星——突发状况多，${p.cn}的事容易急转直下。`
    ]},
    {h:`现实中的对应和建议`, ps:[
      `如果你正在经历${p.cn}相关的事，先看${s.cn}同宫的主星是庙旺还是落陷。`,
      `庙旺时，${s.cnTraits[0]}是你的核心竞争力，可以大胆往这个方向走。`,
      `落陷时，同样的特质会打折扣，需要用后天选择来补——选对环境比硬扛更重要。`,
      `化禄化权在${p.cn}，${p.domain}有实质突破；化科是名声和认可；化忌则是卡点和执念。`,
      `记住：${s.cn}在${p.cn}不是宿命，而是一张说明书——告诉你${p.domain}上哪里有坑、怎么绕过去。`
    ]},
    {h:'排盘使用顺序', ps:[`看到${s.cn}在${p.cn}，按这个顺序读：`], ol:[
      `先看同宫主星——主星决定基本盘。`,
      `看${s.cn}与主星的配合——吉星制煞，煞星聚则凶。`,
      `看三方四正——${p.cn}的三方决定了全貌。`,
      `看四化——化禄化权化科化忌分别触发什么。`,
      `看大限流年——什么时候${p.cn}的事会被激活。`,
      `问自己：${p.cnQuestions[0]}？${p.cnQuestions[1]}？${p.cnQuestions[2]}？`
    ]}
  ];
}

function enSections(a) {
  const s = STARS[a.starKey], p = PALACES[a.pKey];
  return [
    {h:`Core Expression of ${s.en} in the ${p.en}`, ps:[
      `${s.enTraits[0]} — this is the most direct expression in matters of ${p.domainEn}.`,
      `${s.enTraits[1]} — this determines how ${s.en} handles the ${p.en}.`,
      `${s.enTraits[2]} — in the ${p.en} context, this becomes a concrete behavior pattern.`,
      `${s.enTraits[3]} — a double-edged trait: strength when used well, trouble when not.`,
      `${s.enTraits[4]} — often overlooked, but key in matters of ${p.domainEn}.`
    ]},
    {h:'With Auspicious Stars vs Malefics', ps:[
      `With Zuo Fu/You Bi — help arrives in ${p.domainEn}; ${s.en}'s edge is cushioned.`,
      `With Tian Kui/Tian Yue — benefactors appear at key moments; ${p.en} troubles resolve.`,
      `With Wen Chang/Wen Qu — ${s.en} gains strategy; the edge becomes a tool.`,
      `With Qing Yang/Tuo Luo — the process of ${p.domainEn} is harder; malefics together bring twists.`,
      `With Huo Xing/Ling Xing — sudden disruptions; ${p.en} matters take sharp turns.`
    ]},
    {h:'Practical Correspondence and Advice', ps:[
      `If dealing with ${p.en} matters, first check whether the ruling star is bright or fallen.`,
      `When bright, ${s.enTraits[0]} is your core advantage; move boldly.`,
      `When fallen, compensate through conscious choices — the right environment matters more than endurance.`,
      `Lu or Quan in the ${p.en} brings breakthroughs in ${p.domainEn}; Ke brings reputation; Ji marks a blockage.`,
      `Remember: ${s.en} in the ${p.en} is not fate but a manual — it shows where the pitfalls are in ${p.domainEn} and how to navigate them.`
    ]},
    {h:'Reading Order', ps:[`For ${s.en} in the ${p.en}:`], ol:[
      `Check the ruling star — it sets the baseline.`,
      `Check how ${s.en} combines with it — auspicious stars control the malefic; malefics together intensify.`,
      `Check triple direction — the ${p.en}'s aspects reveal the full picture.`,
      `Check transformations — what Lu, Quan, Ke, Ji each activate.`,
      `Check major and annual cycles — when ${p.en} matters get triggered.`,
      `Ask yourself: ${p.enQuestions[0]}? ${p.enQuestions[1]}? ${p.enQuestions[2]}?`
    ]}
  ];
}

function getSidebar(a, isEn) {
  const s = STARS[a.starKey];
  return [
    {href:'ziwei-helper-malice-stars.html',text:isEn?'Assistant & Malefic Stars':'辅曜煞曜'},
    {href:`ziwei-star-${a.starKey}.html`,text:isEn?`${s.en} Star`:`${s.cn}星详解`},
    {href:`ziwei-${a.pKey}.html`,text:isEn?PALACES[a.pKey].en:PALACES[a.pKey].cn},
    {href:'ziwei-sanfang-sizheng.html',text:isEn?'Triple Direction':'先看三方四正'},
    {href:isEn?'../../pages/mingbook-onepage.html':'../pages/mingbook-onepage.html',text:isEn?'Quick Chart':'快速排盘'}
  ];
}

function buildHTML(a, isEn) {
  const sections = isEn ? enSections(a) : cnSections(a);
  const sidebar = getSidebar(a, isEn);
  const title = isEn ? a.enTitle : a.cnTitle;
  const desc = isEn ? a.enDesc : a.cnDesc;
  const catName = isEn ? 'Assistant & Malefic Stars' : '辅煞曜';
  const lead = isEn ? a.enLead : a.cnLead;
  const intro2 = isEn ? a.enIntro2 : a.cnIntro2;
  let sectionsHtml = '';
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    sectionsHtml += `\n        <h2 id="section-${i+1}">${sec.h}</h2>\n`;
    for (const p of sec.ps) sectionsHtml += `        <p>${p}</p>\n`;
    if (sec.ol) {
      sectionsHtml += '        <ol>\n';
      for (const item of sec.ol) sectionsHtml += `          <li>${item}</li>\n`;
      sectionsHtml += '        </ol>\n';
    }
  }
  let sidebarHtml = '';
  for (const link of sidebar) sidebarHtml += `        <a class="card-link" href="${link.href}">${link.text}</a>\n`;

  if (isEn) {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(title)} | Zi Wei Dou Shu</title>
  <meta name="description" content="${jstr(desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:title" content="${jstr(title)}">
  <meta property="og:description" content="${jstr(desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${date}","dateModified":"${date}","inLanguage":"en","articleSection":"Zi Wei Dou Shu","about":["Zi Wei Dou Shu","${catName}","${jstr(title)}"],"author":{"@type":"Organization","name":"YuetianAI"},"publisher":{"@type":"Organization","name":"YuetianAI"},"mainEntityOfPage":"https://yuetianai.com/articles/en/${a.slug}.html"}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a><nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${a.slug}.html">Chinese</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${catName}</span></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-26 10:00</time></span></p>
    </div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="Related links"><h2>Read Next</h2>
${sidebarHtml}      </aside>
    </div>
    <div class="container article-bottom-link"><span>Read this, then compare it against your own chart for clearer insight.</span><a href="../../pages/mingbook-onepage.html">Quick Chart →</a></div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">Yue ICP 2026055337-1</a>　<span>© 2026 YuetianAI. All Rights Reserved. Powered By Yuetian Studio</span>　</div></footer>
</body></html>`;
  }
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(title)} | 学习紫微</title>
  <meta name="description" content="${jstr(desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:title" content="${jstr(title)}">
  <meta property="og:description" content="${jstr(desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/${a.slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${date}","dateModified":"${date}","inLanguage":"zh-CN","articleSection":"${catName}","about":["紫微斗数","${catName}","${jstr(title)}"],"author":{"@type":"Organization","name":"阅天AI"},"publisher":{"@type":"Organization","name":"阅天AI"},"mainEntityOfPage":"https://yuetianai.com/articles/${a.slug}.html"}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"阅天AI","item":"https://yuetianai.com/"},{"@type":"ListItem","position":2,"name":"学习紫微","item":"https://yuetianai.com/articles/"},{"@type":"ListItem","position":3,"name":"${catName}","item":"https://yuetianai.com/articles/ziwei-helper-malice-stars.html"},{"@type":"ListItem","position":4,"name":"${jstr(title)}","item":"https://yuetianai.com/articles/${a.slug}.html"}]}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a><nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${a.slug}.html">English</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="ziwei-helper-malice-stars.html">${catName}</a></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>${catName}</span><span><time datetime="${date}">2026-08-26 10:00</time></span></p>
    </div><div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="本文导航"><h2>继续阅读</h2>
${sidebarHtml}      </aside>
    </div>
    <div class="container article-bottom-link"><span>读完这篇，回到自己的命盘上对照一遍，会比只看概念更清楚。</span><a href="../pages/mingbook-onepage.html">快速排盘 →</a></div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 阅天AI Copyright, All Rights Reserved. Powered By 阅天工作室</span>　</div></footer>
</body></html>`;
}

const articles = combos.map(([sk,pk]) => genArticle(sk,pk));
for (const a of articles) {
  fs.writeFileSync(path.join(__dirname,'articles',`${a.slug}.html`), buildHTML(a,false).replace(/\r\n/g,'\n'), 'utf8');
  fs.writeFileSync(path.join(__dirname,'articles','en',`${a.slug}.html`), buildHTML(a,true).replace(/\r\n/g,'\n'), 'utf8');
}
console.log(`Total: ${articles.length} articles (${articles.length*2} HTML files)`);
console.log('擎羊:', articles.filter(a=>a.starKey==='qingyang').length);
console.log('陀罗:', articles.filter(a=>a.starKey==='tuoluo').length);
console.log('火星:', articles.filter(a=>a.starKey==='huoxing').length);
console.log('铃星:', articles.filter(a=>a.starKey==='lingxing').length);
console.log('地空:', articles.filter(a=>a.starKey==='dikong').length);
