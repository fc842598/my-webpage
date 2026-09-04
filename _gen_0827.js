const fs=require('fs'),path=require('path');
const date='2026-08-27T10:00:00+08:00';
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
  dikong: {cn:'地空',en:'Di Kong',elem:'阴火',elemEn:'yin fire',nature:'空亡星、耗星',natureEn:'the void star and draining star',
    cnTraits:['精神上追求空灵、不重物质','容易破财、计划落空','思想独特、有宗教缘','做事不切实际、容易空想','地空的创造力和灵感是正面'],
    enTraits:['spiritually oriented, not materialistic','prone to financial loss, plans fall through','unique thinking, spiritual affinity','unrealistic, prone to empty ideas','Di Kong creativity and inspiration are positive']},
  dijie: {cn:'地劫',en:'Di Jie',elem:'阳火',elemEn:'yang fire',nature:'劫煞星、耗星',natureEn:'the robbery star and draining star',
    cnTraits:['突发破财、东西被劫','性格叛逆、不按常理出牌','敢于冒险、破釜沉舟','容易轻信、被人骗','地劫的魄力和创新是正面'],
    enTraits:['sudden financial loss, things taken away','rebellious, unconventional','daring, burns bridges','gullible, easily deceived','Di Jie boldness and innovation are positive']},
  tianma: {cn:'天马',en:'Tian Ma',elem:'阳火',elemEn:'yang fire',nature:'驿马星、动星',natureEn:'the post horse star and movement star',
    cnTraits:['一生奔波、动中求财','喜欢外出、闲不住','变化多、搬家出差多','动中有机遇也有奔波','天马的行动力和视野是正面'],
    enTraits:['life of movement, earning through motion','loves going out, cannot stay still','many changes, moves and trips','opportunities and restlessness in motion','Tian Ma drive and broad perspective are positive']},
  lucun: {cn:'禄存',en:'Lu Cun',elem:'阴土',elemEn:'yin earth',nature:'财星、荫星',natureEn:'the wealth star and shelter star',
    cnTraits:['财运稳、能存钱','性格保守、谨慎小心','有口福、注重享受','容易吝啬、守财奴','禄存的稳重和理财能力是正面'],
    enTraits:['stable wealth, good at saving','conservative, cautious','enjoys food and comfort','can be miserly','Lu Cun stability and financial skill are positive']}
};

const CN_TITLES = {
  'dikong-fuqigong':'感情里追求精神共鸣，物质条件看得淡',
  'dikong-zinvgong':'孩子缘分淡或聚少离多，创造力极强',
  'dikong-caibogong':'财运起伏大，投资容易落空',
  'dikong-jiegong':'注意脾胃和精神健康，不要想太多',
  'dikong-qianyi':'在外发展多变动，离乡反而有机遇',
  'dikong-puyigong':'朋友缘分淡，社交圈不固定',
  'dikong-guanlugong':'事业上适合创意和灵性行业',
  'dikong-tianzhaigong':'房产运不稳，家里容易有空置感',
  'dikong-fudegong':'精神追求高，对物质享受没兴趣',
  'dikong-fumugong':'与父母缘分淡，长辈助力有限',
  'dijie-minggong':'性格叛逆敢冒险，人生大起大落',
  'dijie-xiongdigong':'兄弟姐妹中有破财者，资金周转防被骗',
  'dijie-fuqigong':'感情里有突发变故，伴侣可能有冒险倾向',
  'dijie-zinvgong':'孩子叛逆独立，教育要防意外破财',
  'dijie-caibogong':'财运波动大，容易突发破财',
  'dijie-jiegong':'注意意外伤灾，运动和出行要小心',
  'dijie-qianyi':'在外防被骗被劫，离乡要谨慎',
  'dijie-puyigong':'朋友中有人会让你破财，合伙要防',
  'dijie-guanlugong':'事业上敢闯敢拼，但要防重大失误',
  'dijie-tianzhaigong':'房产家事有突发变故，防失窃',
  'dijie-fudegong':'精神上容易空虚，寻找信仰是出路',
  'dijie-fumugong':'与父母缘分有突变，长辈健康要关注',
  'tianma-minggong':'一生奔波动中求财，闲不住的人',
  'tianma-xiongdigong':'兄弟姐妹在外地，资金周转靠流动',
  'tianma-fuqigong':'伴侣可能是外地人，感情多变动',
  'tianma-zinvgong':'孩子长大后远行，子女在外地发展',
  'tianma-caibogong':'收入靠跑动和出差，动中求财',
  'tianma-jiegong':'注意神经系统和四肢，运动有益',
  'tianma-qianyi':'最适合外出发展，离乡越远越有机遇',
  'tianma-puyigong':'朋友遍布各地，社交圈广',
  'tianma-guanlugong':'事业适合出差、外贸、物流等动的行业',
  'tianma-tianzhaigong':'经常搬家或装修，居家环境多变',
  'tianma-fudegong':'精神上追求自由，不喜欢被束缚',
  'tianma-fumugong':'父母在外地或经常走动，长辈缘在远方',
  'lucun-minggong':'天生会理财，性格谨慎稳重',
  'lucun-xiongdigong':'兄弟姐妹经济条件好，资金有后盾',
  'lucun-fuqigong':'伴侣会理财，婚姻经济稳定',
  'lucun-zinvgong':'孩子有财福，教育上重视理财',
  'lucun-caibogong':'财运最稳的位置之一，能赚能守',
  'lucun-jiegong':'注意脾胃和饮食，有口福但要节制'
};
const EN_TITLES = {
  'dikong-fuqigong':'Seeks Spiritual Resonance in Love; Material Conditions Matter Less',
  'dikong-zinvgong':'Weak or Distant Children Bond; Extremely Strong Creativity',
  'dikong-caibogong':'Volatile Wealth; Investments Easily Fall Through',
  'dikong-jiegong':'Watch Spleen and Mental Health; Do Not Overthink',
  'dikong-qianyi':'Many Changes Outside; Leaving Home Brings Opportunities',
  'dikong-puyigong':'Weak Friend Bonds; Unstable Social Circle',
  'dikong-guanlugong':'Suited to Creative and Spiritual Industries',
  'dikong-tianzhaigong':'Unstable Property Luck; Home Feels Empty',
  'dikong-fudegong':'High Spiritual Pursuits; Little Interest in Material Comfort',
  'dikong-fumugong':'Weak Parental Bonds; Limited Elder Support',
  'dijie-minggong':'Rebellious and Daring; Life with Major Ups and Downs',
  'dijie-xiongdigong':'A Sibling with Losses; Beware Fraud in Cash Flow',
  'dijie-fuqigong':'Sudden Changes in Love; Partner May Be Risk-Taking',
  'dijie-zinvgong':'Rebellious, Independent Children; Prevent Accidental Loss',
  'dijie-caibogong':'Highly Volatile Wealth; Sudden Losses Likely',
  'dijie-jiegong':'Watch Accidents and Injuries; Be Careful in Sports and Travel',
  'dijie-qianyi':'Beware Fraud and Robbery Outside; Cautious When Leaving Home',
  'dijie-puyigong':'A Friend May Cause Loss; Prevent Partnership Risks',
  'dijie-guanlugong':'Bold in Career but Beware Major Mistakes',
  'dijie-tianzhaigong':'Sudden Changes in Property; Prevent Theft',
  'dijie-fudegong':'Prone to Emptiness; Finding Faith Is the Way Out',
  'dijie-fumugong':'Sudden Changes with Parents; Watch Elder Health',
  'tianma-minggong':'A Life of Movement; Earning Through Motion',
  'tianma-xiongdigong':'Siblings in Other Cities; Cash Flow Through Mobility',
  'tianma-fuqigong':'Partner May Be from Elsewhere; Relationships Change Often',
  'tianma-zinvgong':'Children Travel Far; Develop Away from Home',
  'tianma-caibogong':'Income Through Travel and Movement',
  'tianma-jiegong':'Watch Nervous System and Limbs; Exercise Is Beneficial',
  'tianma-qianyi':'Best Suited to Developing Outside; Farther Means More Opportunity',
  'tianma-puyigong':'Friends Everywhere; Wide Social Circle',
  'tianma-guanlugong':'Suited to Travel, Trade, Logistics — Moving Industries',
  'tianma-tianzhaigong':'Frequent Moves or Renovations; Changing Home Environment',
  'tianma-fudegong':'Seeks Freedom Spiritually; Hates Being Tied Down',
  'tianma-fumugong':'Parents in Other Cities or Frequently Traveling; Elder Bonds Afar',
  'lucun-minggong':'Born Financial Manager; Cautious and Steady',
  'lucun-xiongdigong':'Siblings in Good Financial Shape; Cash Backing Available',
  'lucun-fuqigong':'Partner Manages Money Well; Financially Stable Marriage',
  'lucun-zinvgong':'Children with Financial Fortune; Value Financial Education',
  'lucun-caibogong':'One of the Steadiest Wealth Positions; Earns and Keeps',
  'lucun-jiegong':'Watch Spleen and Diet; Loves Food but Must Moderate'
};

const combos = [
  ['dikong','fuqigong'],['dikong','zinvgong'],['dikong','caibogong'],['dikong','jiegong'],
  ['dikong','qianyi'],['dikong','puyigong'],['dikong','guanlugong'],['dikong','tianzhaigong'],
  ['dikong','fudegong'],['dikong','fumugong'],
  ['dijie','minggong'],['dijie','xiongdigong'],['dijie','fuqigong'],['dijie','zinvgong'],
  ['dijie','caibogong'],['dijie','jiegong'],['dijie','qianyi'],['dijie','puyigong'],
  ['dijie','guanlugong'],['dijie','tianzhaigong'],['dijie','fudegong'],['dijie','fumugong'],
  ['tianma','minggong'],['tianma','xiongdigong'],['tianma','fuqigong'],['tianma','zinvgong'],
  ['tianma','caibogong'],['tianma','jiegong'],['tianma','qianyi'],['tianma','puyigong'],
  ['tianma','guanlugong'],['tianma','tianzhaigong'],['tianma','fudegong'],['tianma','fumugong'],
  ['lucun','minggong'],['lucun','xiongdigong'],['lucun','fuqigong'],['lucun','zinvgong'],
  ['lucun','caibogong'],['lucun','jiegong']
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
    cnLead: `${s.cn}是${s.nature}。落在${p.cn}，它的能量会在${p.domain}这件事上表现出来。${s.cn}的关键词是${s.cnTraits.slice(0,3).join('、')}，这些特质放到${p.cn}的场景里，会产生具体的现实对应。`,
    enLead: `${s.en} is ${s.natureEn}. In the ${p.en}, its energy shows up in matters of ${p.domainEn}. ${s.en} keywords are ${s.enTraits.slice(0,3).join(', ')}, producing concrete patterns in the ${p.en} context.`,
    cnIntro2: `${p.cn}看的是${p.domain}。${s.cn}属${s.elem}，能量特质是${s.cnTraits[0]}。读${s.cn}在${p.cn}不能只看单宫，必须回到三方四正——有吉星会照则助力落地，煞星冲照则波折增多。${s.cn}的正面意义往往被忽略：${s.cnTraits[4]}。`,
    enIntro2: `The ${p.en} covers ${p.domainEn}. ${s.en} is ${s.elemEn}, with energy of ${s.enTraits[0]}. Reading it requires the triple-direction view — with auspicious stars help lands; with malefics twists increase. The positive side is often overlooked: ${s.enTraits[4]}.`
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
      `加左辅右弼——${p.domain}中有人帮衬，${s.cn}的能量能落地。`,
      `加天魁天钺——关键时刻有贵人提携，${p.cn}的事容易逢凶化吉。`,
      `加文昌文曲——${s.cn}配上谋略和文采，表现更圆融。`,
      `加擎羊陀罗——${p.domain}的过程更费劲，容易拖延或起冲突。`,
      `加火星铃星——突发状况多，${p.cn}的事容易被打断或急转直下。`
    ]},
    {h:`现实中的对应和建议`, ps:[
      `如果你正在经历${p.cn}相关的事，先看${s.cn}同宫的主星是庙旺还是落陷。`,
      `庙旺时，${s.cnTraits[0]}是你的核心竞争力，可以大胆往这个方向走。`,
      `落陷时，同样的特质会打折扣，需要用后天选择来补——选对环境比硬扛更重要。`,
      `化禄化权在${p.cn}，${p.domain}有实质突破；化科是名声和认可；化忌则是卡点和执念。`,
      `记住：${s.cn}在${p.cn}不是宿命，而是一张说明书——告诉你${p.domain}上的出厂设置。`
    ]},
    {h:'排盘使用顺序', ps:[`看到${s.cn}在${p.cn}，按这个顺序读：`], ol:[
      `先看同宫主星——主星决定基本盘。`,
      `看${s.cn}与主星的配合——吉星加分，煞星减分。`,
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
      `With Zuo Fu/You Bi — help arrives in ${p.domainEn}; ${s.en}'s energy can land.`,
      `With Tian Kui/Tian Yue — benefactors appear at key moments; ${p.en} matters resolve.`,
      `With Wen Chang/Wen Qu — ${s.en} gains strategy and expression.`,
      `With Qing Yang/Tuo Luo — the process of ${p.domainEn} is harder, with delays or conflict.`,
      `With Huo Xing/Ling Xing — sudden disruptions; ${p.en} matters get interrupted.`
    ]},
    {h:'Practical Correspondence and Advice', ps:[
      `If dealing with ${p.en} matters, first check whether the ruling star is bright or fallen.`,
      `When bright, ${s.enTraits[0]} is your core advantage; move boldly.`,
      `When fallen, compensate through conscious choices — the right environment matters more than endurance.`,
      `Lu or Quan in the ${p.en} brings breakthroughs in ${p.domainEn}; Ke brings reputation; Ji marks a blockage.`,
      `Remember: ${s.en} in the ${p.en} is not fate but a manual — your factory settings for ${p.domainEn}.`
    ]},
    {h:'Reading Order', ps:[`For ${s.en} in the ${p.en}:`], ol:[
      `Check the ruling star — it sets the baseline.`,
      `Check how ${s.en} combines with it — auspicious adds; malefic subtracts.`,
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
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-27 10:00</time></span></p>
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
      <p class="article-meta"><span>${catName}</span><span><time datetime="${date}">2026-08-27 10:00</time></span></p>
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
console.log('地空:', articles.filter(a=>a.starKey==='dikong').length);
console.log('地劫:', articles.filter(a=>a.starKey==='dijie').length);
console.log('天马:', articles.filter(a=>a.starKey==='tianma').length);
console.log('禄存:', articles.filter(a=>a.starKey==='lucun').length);
