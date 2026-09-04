const fs=require('fs'),path=require('path');
const date='2026-08-28T10:00:00+08:00';
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
  lucun: {cn:'禄存',en:'Lu Cun',elem:'阴土',elemEn:'yin earth',nature:'财星、荫星',natureEn:'the wealth star and shelter star',
    cnTraits:['财运稳、能存钱','性格保守、谨慎小心','有口福、注重享受','容易吝啬、守财奴','禄存的稳重和理财能力是正面'],
    enTraits:['stable wealth, good at saving','conservative, cautious','enjoys food and comfort','can be miserly','Lu Cun stability and financial skill are positive']},
  hongluan: {cn:'红鸾',en:'Hong Luan',elem:'阴水',elemEn:'yin water',nature:'桃花星、婚恋星',natureEn:'the romance star and marriage star',
    cnTraits:['异性缘好、桃花运旺','早婚或恋爱机会多','相貌讨喜、有魅力','感情丰富、容易动情','红鸾的社交魅力是正面'],
    enTraits:['good opposite-sex luck, strong romance','early marriage or many love opportunities','attractive appearance, charming','emotionally rich, easily falls in love','Hong Luan social charm is positive']},
  tianxi: {cn:'天喜',en:'Tian Xi',elem:'阳水',elemEn:'yang water',nature:'喜庆星、桃花星',natureEn:'the joy star and romance star',
    cnTraits:['性格开朗、爱笑','逢凶化吉、有喜事','异性缘好但偏正面','容易冲动结婚','天喜的乐观和人缘是正面'],
    enTraits:['cheerful personality, loves to laugh','turns misfortune to blessing, happy events','good opposite-sex luck, mostly positive','prone to impulsive marriage','Tian Xi optimism and popularity are positive']},
  xianchi: {cn:'咸池',en:'Xian Chi',elem:'阴水',elemEn:'yin water',nature:'桃花煞星、情欲星',natureEn:'the peach-blossom malefic and desire star',
    cnTraits:['情欲重、桃花旺但偏邪','异性缘极好但多烂桃花','相貌性感、有吸引力','感情纠纷多','咸池的艺术感和人缘是正面'],
    enTraits:['strong desire, intense but risky romance','excellent opposite-sex luck but many bad relationships','sexy appearance, attractive','many relationship disputes','Xian Chi artistry and popularity are positive']}
};

const CN_TITLES = {
  'lucun-qianyi':'在外财运稳，离乡发展有积蓄',
  'lucun-puyigong':'朋友中有有钱人，人脉带来财路',
  'lucun-guanlugong':'事业收入稳定，适合金融财务行业',
  'lucun-tianzhaigong':'家产丰厚，守财能力强',
  'lucun-fudegong':'福气厚、会享受，精神物质都不缺',
  'lucun-fumugong':'父母有积蓄，长辈经济助力大',
  'hongluan-minggong':'天生异性缘好，桃花运旺的人',
  'hongluan-xiongdigong':'兄弟姐妹中有人桃花旺，同辈介绍对象',
  'hongluan-fuqigong':'婚姻缘分深，伴侣相貌好',
  'hongluan-zinvgong':'孩子相貌好，子女感情运顺',
  'hongluan-caibogong':'因异性得财，赚钱靠人脉',
  'hongluan-jiegong':'注意肾脏和生殖系统，感情影响健康',
  'hongluan-qianyi':'在外桃花运旺，离乡有姻缘',
  'hongluan-puyigong':'朋友多异性，社交圈桃花旺',
  'hongluan-guanlugong':'事业上靠异性缘，适合公关行业',
  'hongluan-tianzhaigong':'家里有喜事，居家环境浪漫',
  'hongluan-fudegong':'精神上追求浪漫，感情生活丰富',
  'hongluan-fumugong':'父母感情好，长辈婚姻美满',
  'tianxi-minggong':'性格开朗逢凶化吉，一生多喜事',
  'tianxi-xiongdigong':'兄弟姐妹中有开心果，同辈关系和睦',
  'tianxi-fuqigong':'婚姻喜庆多，伴侣性格开朗',
  'tianxi-zinvgong':'孩子带来喜事，子女活泼开朗',
  'tianxi-caibogong':'赚钱开心，财运带喜气',
  'tianxi-jiegong':'心情好病就少，注意饮食过量',
  'tianxi-qianyi':'在外有喜事，离乡发展开心顺意',
  'tianxi-puyigong':'朋友多乐观派，社交圈欢乐多',
  'tianxi-guanlugong':'事业上有喜庆，升职加薪机会多',
  'tianxi-tianzhaigong':'家里常有喜事，居家氛围欢乐',
  'tianxi-fudegong':'心态乐观，福气来自开心',
  'tianxi-fumugong':'父母开朗，家庭氛围欢乐',
  'xianchi-minggong':'魅力十足但桃花复杂，感情要专一',
  'xianchi-xiongdigong':'兄弟姐妹中有人桃花旺，感情纠纷多',
  'xianchi-fuqigong':'感情里情欲重，要防烂桃花',
  'xianchi-zinvgong':'孩子早熟，教育要引导感情观',
  'xianchi-caibogong':'因桃花破财，花钱在异性身上',
  'xianchi-jiegong':'注意生殖系统，防感情伤身',
  'xianchi-qianyi':'在外桃花旺但多烂桃花，离乡防情伤',
  'xianchi-puyigong':'朋友中多酒色之友，社交要节制',
  'xianchi-guanlugong':'事业上靠魅力但防绯闻',
  'xianchi-tianzhaigong':'家里感情纠纷多，防婚外情'
};
const EN_TITLES = {
  'lucun-qianyi':'Stable Wealth Outside; Saving While Developing Away',
  'lucun-puyigong':'Wealthy Friends; Connections Bring Income Paths',
  'lucun-guanlugong':'Stable Career Income; Suited to Finance',
  'lucun-tianzhaigong':'Substantial Family Assets; Strong at Keeping Wealth',
  'lucun-fudegong':'Deep Blessings, Enjoys Life; Spirit and Matter Fulfilled',
  'lucun-fumugong':'Parents Have Savings; Strong Financial Support from Elders',
  'hongluan-minggong':'Born with Strong Romance and Opposite-Sex Luck',
  'hongluan-xiongdigong':'A Sibling with Strong Romance; Peer Matchmaking',
  'hongluan-fuqigong':'Deep Marriage Bond; Attractive Partner',
  'hongluan-zinvgong':'Attractive Children; Smooth Romance Luck for Kids',
  'hongluan-caibogong':'Wealth Through Opposite Sex; Earning via Connections',
  'hongluan-jiegong':'Watch Kidneys and Reproductive System; Emotions Affect Health',
  'hongluan-qianyi':'Strong Romance Outside; Marriage Destiny Away from Home',
  'hongluan-puyigong':'Many Opposite-Sex Friends; Active Social Romance',
  'hongluan-guanlugong':'Career Through Opposite-Sex Luck; Suited to PR',
  'hongluan-tianzhaigong':'Happy Events at Home; Romantic Living Environment',
  'hongluan-fudegong':'Romantic Spirit; Rich Emotional Life',
  'hongluan-fumugong':'Loving Parents; Happy Elder Marriage',
  'tianxi-minggong':'Cheerful and Lucky; Life Full of Happy Events',
  'tianxi-xiongdigong':'A Joyful Sibling; Harmonious Peer Relations',
  'tianxi-fuqigong':'Joyful Marriage; Cheerful Partner',
  'tianxi-zinvgong':'Children Bring Joy; Lively, Cheerful Kids',
  'tianxi-caibogong':'Earning Happily; Wealth Carries Joy',
  'tianxi-jiegong':'Good Mood Means Fewer Ills; Watch Overeating',
  'tianxi-qianyi':'Happy Events Outside; Joyful Development Away',
  'tianxi-puyigong':'Optimistic Friends; Joyful Social Circle',
  'tianxi-guanlugong':'Career Celebrations; Many Promotion Opportunities',
  'tianxi-tianzhaigong':'Frequent Home Celebrations; Joyful Atmosphere',
  'tianxi-fudegong':'Optimistic Mindset; Blessings from Happiness',
  'tianxi-fumugong':'Cheerful Parents; Joyful Family Atmosphere',
  'xianchi-minggong':'Irresistible Charm but Complex Romance; Be Faithful',
  'xianchi-xiongdigong':'A Sibling with Active Romance; Many Disputes',
  'xianchi-fuqigong':'Strong Desire in Love; Beware Bad Romances',
  'xianchi-zinvgong':'Early-Maturing Children; Guide Their Views on Love',
  'xianchi-caibogong':'Loss Through Romance; Spending on Opposite Sex',
  'xianchi-jiegong':'Watch Reproductive System; Prevent Emotional Harm to Health',
  'xianchi-qianyi':'Intense but Toxic Romance Outside; Beware Heartbreak',
  'xianchi-puyigong':'Wine-and-Pleasure Friends; Moderate Socializing',
  'xianchi-guanlugong':'Career Through Charm but Beware Scandal',
  'xianchi-tianzhaigong':'Relationship Disputes at Home; Beware Infidelity'
};

const combos = [
  ['lucun','qianyi'],['lucun','puyigong'],['lucun','guanlugong'],['lucun','tianzhaigong'],['lucun','fudegong'],['lucun','fumugong'],
  ['hongluan','minggong'],['hongluan','xiongdigong'],['hongluan','fuqigong'],['hongluan','zinvgong'],
  ['hongluan','caibogong'],['hongluan','jiegong'],['hongluan','qianyi'],['hongluan','puyigong'],
  ['hongluan','guanlugong'],['hongluan','tianzhaigong'],['hongluan','fudegong'],['hongluan','fumugong'],
  ['tianxi','minggong'],['tianxi','xiongdigong'],['tianxi','fuqigong'],['tianxi','zinvgong'],
  ['tianxi','caibogong'],['tianxi','jiegong'],['tianxi','qianyi'],['tianxi','puyigong'],
  ['tianxi','guanlugong'],['tianxi','tianzhaigong'],['tianxi','fudegong'],['tianxi','fumugong'],
  ['xianchi','minggong'],['xianchi','xiongdigong'],['xianchi','fuqigong'],['xianchi','zinvgong'],
  ['xianchi','caibogong'],['xianchi','jiegong'],['xianchi','qianyi'],['xianchi','puyigong'],
  ['xianchi','guanlugong'],['xianchi','tianzhaigong']
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
    cnIntro2: `${p.cn}看的是${p.domain}。${s.cn}属${s.elem}，能量特质是${s.cnTraits[0]}。读${s.cn}在${p.cn}不能只看单宫，必须回到三方四正——有吉星会照则助力落地，煞星冲照则波折增多。${s.cn}的正面意义：${s.cnTraits[4]}。`,
    enIntro2: `The ${p.en} covers ${p.domainEn}. ${s.en} is ${s.elemEn}, with energy of ${s.enTraits[0]}. Reading it requires the triple-direction view — with auspicious stars help lands; with malefics twists increase. The positive side: ${s.enTraits[4]}.`
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
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-28 10:00</time></span></p>
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
      <p class="article-meta"><span>${catName}</span><span><time datetime="${date}">2026-08-28 10:00</time></span></p>
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
console.log('禄存:', articles.filter(a=>a.starKey==='lucun').length);
console.log('红鸾:', articles.filter(a=>a.starKey==='hongluan').length);
console.log('天喜:', articles.filter(a=>a.starKey==='tianxi').length);
console.log('咸池:', articles.filter(a=>a.starKey==='xianchi').length);
