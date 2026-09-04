const fs=require('fs'),path=require('path');
const date='2026-08-24T11:00:00+08:00';
function jstr(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"');}

const SIHUA = {
  hualu: {cn:'化禄',en:'Hua Lu',nature:'缘起、丰收、顺缘',natureEn:'the transformation of fruition, harvest, and smooth conditions',
    cnCore:'化禄代表缘分成熟、资源自然汇聚，事情往顺畅的方向走。它不是天上掉馅饼，而是之前种下的因到了结果的时候。',
    enCore:'Hua Lu represents ripe conditions and resources naturally converging; things move smoothly. It is not a free lunch but the fruition of prior causes.',
    cnTraits:['顺利、有人缘','机会主动找上门','心态乐观、愿意给','容易满足、也可能懒散','禄是因的果，不是凭空来的'],
    enTraits:['smooth, well-liked','opportunities come to you','optimistic, generous','easily content, possibly lazy','Lu is the fruit of a cause, not random luck']},
  huaquan: {cn:'化权',en:'Hua Quan',nature:'掌控、扩张、执行力',natureEn:'the transformation of control, expansion, and execution',
    cnCore:'化权代表力量增强、话语权提升，你想掌控局面并且有能力推动。权是一把火，烧对地方是成就，烧错地方是争斗。',
    enCore:'Hua Quan represents increased power and authority; you want control and have the drive to push things through. Quan is fire — achievement when directed right, conflict when misdirected.',
    cnTraits:['强势、有主见','行动力强、不服输','喜欢主导、容易独断','有领导力、也容易压人','权要配禄才稳，有权无禄是硬撑'],
    enTraits:['strong-willed, opinionated','strong action, hates losing','likes to lead, can be dictatorial','leadership ability, can overpower others','Quan needs Lu to be stable; power without resources is bluster']},
  huake: {cn:'化科',en:'Hua Ke',nature:'名声、贵人、平稳',natureEn:'the transformation of reputation, benefactors, and stability',
    cnCore:'化科代表名声好、有贵人、事情以体面的方式解决。科不是大富大贵，而是平顺中带声望，遇到困难有人帮你说话。',
    enCore:'Hua Ke represents good reputation, benefactors, and matters resolved gracefully. Ke is not great wealth but smoothness with prestige; when trouble comes, someone speaks up for you.',
    cnTraits:['名声好、有口碑','贵人运、有人提携','做事体面、注重形象','平稳但不够爆发','科是贵人，也是你的名声资产'],
    enTraits:['good reputation, word of mouth','benefactor luck, mentorship','graceful, image-conscious','stable but not explosive','Ke is a benefactor and your reputation asset']},
  huaji: {cn:'化忌',en:'Hua Ji',nature:'执著、亏欠、卡点',natureEn:'the transformation of fixation, debt, and blockage',
    cnCore:'化忌代表执著、亏欠和过不去的坎。它不是简单的"坏"，而是你最在意、最放不下的地方，也是功课最重的地方。忌是收束，是让你面对和了结。',
    enCore:'Hua Ji represents fixation, debt, and blockages you cannot get past. It is not simply "bad" but what you care about most and cannot let go of — where your heaviest lesson lies. Ji is closure, forcing you to face and finish things.',
    cnTraits:['执著、放不下','容易亏欠、也容易被欠','事情卡住、反复','内心纠结、想太多','忌是功课，不是诅咒'],
    enTraits:['fixated, cannot let go','prone to owing or being owed','matters get stuck, repeat','inner tangle, overthinking','Ji is a lesson, not a curse']}
};

const PALACES = {
  minggong:{cn:'命宫',en:'Life Palace',domain:'核心性格、人生基调与外在表现',domainEn:'core personality, life direction, and outward expression',
    cnQuestions:['这辈子的性格优势和执念在哪','人生整体顺不顺','我给人的第一印象是什么'],enQuestions:['where personality strengths and fixations lie','whether life flows smoothly overall','what first impression you give']},
  xiongdigong:{cn:'兄弟宫',en:'Siblings Palace',domain:'手足关系、同辈缘分与资金周转',domainEn:'sibling relationships, peer bonds, and cash turnover',
    cnQuestions:['兄弟姐妹能不能帮上忙','跟同辈合不合','资金周转灵不灵'],enQuestions:['whether siblings can help','how peer relationships are','whether cash flow is flexible']},
  fuqigong:{cn:'夫妻宫',en:'Spouse Palace',domain:'感情婚姻、伴侣特质与亲密关系',domainEn:'love, marriage, partner traits, and intimacy',
    cnQuestions:['另一半是什么样的人','感情顺不顺','婚姻最大的功课是什么'],enQuestions:['what the partner is like','whether relationships go smoothly','the biggest lesson in marriage']},
  zinvgong:{cn:'子女宫',en:'Children Palace',domain:'子女缘分、晚辈关系与创意产出',domainEn:'children, junior relationships, and creative output',
    cnQuestions:['孩子缘深不深','跟子女关系怎样','创造力和合作运如何'],enQuestions:['whether children luck is strong','how relationships with children are','how creativity and partnership luck are']},
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

// 40 articles: hualu 12 + huaquan 12 + huake 12 + huaji 4
const combos = [];
for(const p of Object.keys(PALACES)) combos.push(['hualu',p]);
for(const p of Object.keys(PALACES)) combos.push(['huaquan',p]);
for(const p of Object.keys(PALACES)) combos.push(['huake',p]);
for(const p of ['minggong','xiongdigong','fuqigong','zinvgong']) combos.push(['huaji',p]);

const CN_TITLES = {
  'hualu-minggong':'天生带缘的人，机会总比别人多一点',
  'hualu-xiongdigong':'兄弟姐妹有财缘，资金周转有人帮',
  'hualu-fuqigong':'感情里有甜也有腻，伴侣缘深但要防依赖',
  'hualu-zinvgong':'孩子是你的福星，创造力也容易变现',
  'hualu-caibogong':'财源广但不一定存得住，会赚也要会守',
  'hualu-jiegong':'体质偏壮实，但要防富贵病和饮食过量',
  'hualu-qianyi':'出门遇贵人，在外发展比在家顺',
  'hualu-puyigong':'朋友多财路广，但要防酒肉朋友',
  'hualu-guanlugong':'事业顺缘多，适合跟人打交道的工作',
  'hualu-tianzhaigong':'家产运好，居家环境舒适',
  'hualu-fudegong':'福气厚、心态好，但容易安于现状',
  'hualu-fumugong':'父母有荫庇，文书学历运顺',
  'huaquan-minggong':'天生的主导者，掌控欲强但能扛事',
  'huaquan-xiongdigong':'兄弟姐妹中有强势者，资金周转靠魄力',
  'huaquan-fuqigong':'伴侣强势有能力，感情里有权力博弈',
  'huaquan-zinvgong':'孩子好胜独立，教育上要给主导权',
  'huaquan-caibogong':'赚钱有冲劲，适合竞争性强的行业',
  'huaquan-jiegong':'注意外伤和急性炎症，运动要适度',
  'huaquan-qianyi':'在外敢闯敢拼，离乡能掌权',
  'huaquan-puyigong':'朋友中你是老大，但要防被架空',
  'huaquan-guanlugong':'职场上有实权，适合管理岗位',
  'huaquan-tianzhaigong':'家里你说了算，房产买卖有魄力',
  'huaquan-fudegong':'精神上闲不住，总要找点事做',
  'huaquan-fumugong':'父母管教严，长辈中有掌权者',
  'huake-minggong':'名声好、贵人多，靠口碑吃饭',
  'huake-xiongdigong':'兄弟姐妹中有读书人，资金周转靠信用',
  'huake-fuqigong':'伴侣有学识有气质，感情体面',
  'huake-zinvgong':'孩子读书好，教育上重视品德',
  'huake-caibogong':'收入靠名声和专业，细水长流',
  'huake-jiegong':'注意慢性病调理，心态好病就少',
  'huake-qianyi':'在外名声好，离乡有贵人引荐',
  'huake-puyigong':'朋友多为正人君子，能互相提携',
  'huake-guanlugong':'事业平稳有声望，适合文职和学术',
  'huake-tianzhaigong':'家里有书香气息，房产运平稳',
  'huake-fudegong':'精神追求高雅，心态平和',
  'huake-fumugong':'父母有文化修养，学历文书运好',
  'huaji-minggong':'这辈子最大的功课是放下执著',
  'huaji-xiongdigong':'手足缘分有亏欠，资金周转容易卡',
  'huaji-fuqigong':'感情是最大的执念，越在乎越容易出问题',
  'huaji-zinvgong':'对子女操心过度，合作上容易有纠纷'
};

const EN_TITLES = {
  'hualu-minggong':'Born with Good Karma; Opportunities Come More Easily',
  'hualu-xiongdigong':'Siblings Bring Financial Luck; Cash Flow Has Helpers',
  'hualu-fuqigong':'Sweet but Clingy Love; Deep Partner Bond, Watch Dependency',
  'hualu-zinvgong':'Children Are Your Lucky Stars; Creativity Monetizes Easily',
  'hualu-caibogong':'Many Income Streams but Hard to Save; Earn and Keep',
  'hualu-jiegong':'Sturdy Constitution; Watch Lifestyle Diseases and Overeating',
  'hualu-qianyi':'Benefators Outside; Developing Away from Home Is Smoother',
  'hualu-puyigong':'Friends Bring Money Paths; Beware Fair-Weather Friends',
  'hualu-guanlugong':'Smooth Career Luck; Suited to People-Facing Work',
  'hualu-tianzhaigong':'Good Property Luck; Comfortable Living Environment',
  'hualu-fudegong':'Deep Blessings, Good Mindset; Prone to Complacency',
  'hualu-fumugong':'Parental Shelter; Smooth Document and Education Luck',
  'huaquan-minggong':'A Born Leader; Strong Control Drive but Can Carry the Load',
  'huaquan-xiongdigong':'A Strong-Willed Sibling; Cash Flow Through Boldness',
  'huaquan-fuqigong':'A Capable, Strong Partner; Power Dynamics in Love',
  'huaquan-zinvgong':'Competitive, Independent Children; Give Them Leadership',
  'huaquan-caibogong':'Aggressive Earning; Suited to Competitive Industries',
  'huaquan-jiegong':'Watch Injuries and Acute Inflammation; Exercise Moderately',
  'huaquan-qianyi':'Bold Outside; Gaining Power Away from Home',
  'huaquan-puyigong':'You Lead Among Friends; Beware Being Sidelined',
  'huaquan-guanlugong':'Real Authority at Work; Suited to Management',
  'huaquan-tianzhaigong':'You Call the Shots at Home; Bold Property Decisions',
  'huaquan-fudegong':'Cannot Sit Still Spiritually; Always Need Something to Do',
  'huaquan-fumugong':'Strict Parents; An Authority Figure Among Elders',
  'huake-minggong':'Good Reputation, Many Benefactors; Living by Word of Mouth',
  'huake-xiongdigong':'A Scholarly Sibling; Cash Flow Through Credit',
  'huake-fuqigong':'An Educated, Elegant Partner; Graceful Relationship',
  'huake-zinvgong':'Academically Strong Children; Value Character in Education',
  'huake-caibogong':'Income Through Reputation and Expertise; Steady Stream',
  'huake-jiegong':'Manage Chronic Conditions; Good Mindset Means Fewer Ills',
  'huake-qianyi':'Good Reputation Outside; Benefactors Introduce You',
  'huake-puyigong':'Mostly Upright Friends Who Lift Each Other Up',
  'huake-guanlugong':'Stable, Prestigious Career; Suited to Letters and Academia',
  'huake-tianzhaigong':'A Scholarly Home Atmosphere; Stable Property Luck',
  'huake-fudegong':'Refined Spiritual Pursuits; Peaceful Mindset',
  'huake-fumugong':'Cultured Parents; Good Education and Document Luck',
  'huaji-minggong':'The Biggest Life Lesson Is Letting Go of Fixation',
  'huaji-xiongdigong':'Karmic Debt with Siblings; Cash Flow Gets Stuck Easily',
  'huaji-fuqigong':'Love Is the Greatest Fixation; The More You Care, the More Problems',
  'huaji-zinvgong':'Over-Worrying About Children; Partnership Disputes Likely'
};

function genArticle(shKey, pKey) {
  const sh = SIHUA[shKey], p = PALACES[pKey];
  const slug = `ziwei-${shKey}-zai-${pKey}`;
  const cnTitle = `${sh.cn}在${p.cn}：${CN_TITLES[shKey+'-'+pKey]}`;
  const enTitle = `${sh.en} in ${p.en}: ${EN_TITLES[shKey+'-'+pKey]}`;
  const cnDesc = `${sh.cn}在${p.cn}，${p.domain}。${sh.cnCore}`;
  const enDesc = `${sh.en} in the ${p.en} affects ${p.domainEn}. ${sh.enCore}`;
  return {slug, cnTitle, enTitle, cnDesc, enDesc, sh, p, shKey, pKey};
}

function cnSections(a) {
  const {sh, p} = a;
  return [
    {h:`${sh.cn}在${p.cn}到底意味着什么`, ps:[
      `${sh.cn}的核心是"${sh.nature}"。落在${p.cn}，意味着${p.domain}这件事上，能量以${sh.cnTraits[0]}的方式呈现。`,
      `${sh.cnTraits[1]}——这是${sh.cn}在${p.cn}最直接的表现，${p.domain}中会出现对应的人和事。`,
      `${sh.cnTraits[2]}——你的心态决定了${sh.cn}在${p.cn}是助力还是阻力。`,
      `${sh.cnTraits[3]}——这一面最容易被忽略，但恰恰是读盘时最需要注意的。`,
      `${sh.cnTraits[4]}。读懂这句话，才算真正理解${sh.cn}在${p.cn}。`
    ]},
    {h:`同宫星曜决定${sh.cn}的成色`, ps:[
      `${sh.cn}不是单独作用的，它必须挂在某颗星上。同宫主星是庙旺还是落陷，直接决定${sh.cn}的力量能不能发挥。`,
      `主星庙旺加${sh.cn}——${p.domain}上的好事能成，而且成得体面。`,
      `主星落陷加${sh.cn}——同样有机会，但过程曲折，需要更多努力才能接住。`,
      `加左辅右弼、天魁天钺——${p.domain}中有人帮，${sh.cn}的能量能落地。`,
      `加擎羊陀罗、火星铃星——${p.domain}中的${sh.cn}会打折扣，好事多磨或急转直下。`
    ]},
    {h:`${sh.cn}在${p.cn}的现实建议`, ps:[
      `先看${p.cn}的三方四正——${p.cn}不是孤立的，对宫和三合决定了${sh.cn}的全貌。`,
      `再看大限流年——${sh.cn}在${p.cn}是先天的底色，大限走到时才会真正激活。`,
      `${sh.cnTraits[0]}是你在${p.domain}上的出厂设置，顺着走比逆着来省力。`,
      `但要注意${sh.cnTraits[3]}——这是你在${p.cn}最容易踩的坑。`,
      `记住：${sh.cn}在${p.cn}不是判词，而是一张地图。它告诉你${p.domain}上哪里有风景、哪里有坑，但路还是你自己走。`
    ]},
    {h:'读盘顺序', ps:[`看到${sh.cn}在${p.cn}，按这个顺序读：`], ol:[
      `先看${sh.cn}挂在哪颗主星上——主星决定基本盘。`,
      `看主星庙旺落陷——亮度决定${sh.cn}的力量。`,
      `看同宫和三方星曜——吉星加分，煞星减分。`,
      `看${p.cn}的对宫——迁移宫是${p.cn}的外在表现。`,
      `看大限流年——什么时候${p.domain}的事会被触发。`,
      `问自己：${p.cnQuestions[0]}？${p.cnQuestions[1]}？${p.cnQuestions[2]}？`
    ]}
  ];
}

function enSections(a) {
  const {sh, p} = a;
  return [
    {h:`What ${sh.en} in the ${p.en} Actually Means`, ps:[
      `The core of ${sh.en} is "${sh.natureEn}." In the ${p.en}, this means energy shows up as ${sh.enTraits[0]} in matters of ${p.domainEn}.`,
      `${sh.enTraits[1]} — this is the most direct expression of ${sh.en} in the ${p.en}; corresponding people and events appear in ${p.domainEn}.`,
      `${sh.enTraits[2]} — your mindset determines whether ${sh.en} in the ${p.en} is an asset or resistance.`,
      `${sh.enTraits[3]} — this side is most easily overlooked, yet it is exactly what needs attention when reading the chart.`,
      `${sh.enTraits[4]}. Understand this sentence and you truly understand ${sh.en} in the ${p.en}.`
    ]},
    {h:`Co-Stars Determine the Quality of ${sh.en}`, ps:[
      `${sh.en} does not act alone; it must attach to a star. Whether the ruling star is in temple/prosperity or fallen directly determines whether ${sh.en}'s power can express itself.`,
      `A bright ruling star with ${sh.en} — good things in ${p.domainEn} come to pass, and gracefully.`,
      `A fallen ruling star with ${sh.en} — opportunities exist but the path is winding; more effort is needed to receive them.`,
      `With Zuo Fu, You Bi, Tian Kui, Tian Yue — help arrives in ${p.domainEn}; ${sh.en}'s energy can land.`,
      `With Qing Yang, Tuo Luo, Huo Xing, Ling Xing — ${sh.en} in ${p.domainEn} is discounted; good things face delays or sudden turns.`
    ]},
    {h:`Practical Advice for ${sh.en} in the ${p.en}`, ps:[
      `First check the triple-direction of the ${p.en} — it is not isolated; the opposite and trinal palaces reveal the full picture of ${sh.en}.`,
      `Then check major and annual cycles — ${sh.en} in the ${p.en} is an innate baseline; it truly activates when the cycle arrives.`,
      `${sh.enTraits[0]} is your factory setting for ${p.domainEn}; going with it is easier than going against it.`,
      `But watch for ${sh.enTraits[3]} — this is the pitfall you are most likely to hit in the ${p.en}.`,
      `Remember: ${sh.en} in the ${p.en} is not a verdict but a map. It shows where the scenery and pitfalls are in ${p.domainEn}, but you still walk the path.`
    ]},
    {h:'Reading Order', ps:[`For ${sh.en} in the ${p.en}:`], ol:[
      `First see which ruling star ${sh.en} attaches to — the star sets the baseline.`,
      `Check the star's brightness — temple/prosperity determines ${sh.en}'s power.`,
      `Check co-stars and triple direction — auspicious stars add; malefics subtract.`,
      `Check the opposite palace — it is the outward expression of the ${p.en}.`,
      `Check major and annual cycles — when ${p.domainEn} matters get triggered.`,
      `Ask yourself: ${p.enQuestions[0]}? ${p.enQuestions[1]}? ${p.enQuestions[2]}?`
    ]}
  ];
}

function getSidebar(shKey, pKey, isEn) {
  return [
    {href:'ziwei-sihua.html',text:isEn?'Four Transformations':'四化总论'},
    {href:`ziwei-${shKey}.html`,text:isEn?SIHUA[shKey].en:SIHUA[shKey].cn},
    {href:`ziwei-${pKey}.html`,text:isEn?PALACES[pKey].en:PALACES[pKey].cn},
    {href:'ziwei-sanfang-sizheng.html',text:isEn?'Triple Direction':'先看三方四正'},
    {href:isEn?'../../pages/mingbook-onepage.html':'../pages/mingbook-onepage.html',text:isEn?'Quick Chart':'快速排盘'}
  ];
}

function buildHTML(a, isEn) {
  const sections = isEn ? enSections(a) : cnSections(a);
  const sidebar = getSidebar(a.shKey, a.pKey, isEn);
  const title = isEn ? a.enTitle : a.cnTitle;
  const desc = isEn ? a.enDesc : a.cnDesc;
  const catName = isEn ? 'Four Transformations' : '四化';
  let sectionsHtml = '';
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    sectionsHtml += `\n        <h2 id="section-${i+1}">${s.h}</h2>\n`;
    for (const p of s.ps) sectionsHtml += `        <p>${p}</p>\n`;
    if (s.ol) {
      sectionsHtml += '        <ol>\n';
      for (const item of s.ol) sectionsHtml += `          <li>${item}</li>\n`;
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
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${date}","dateModified":"${date}","inLanguage":"en","articleSection":"Zi Wei Dou Shu","about":["Zi Wei Dou Shu","Four Transformations","${jstr(title)}"],"author":{"@type":"Organization","name":"YuetianAI"},"publisher":{"@type":"Organization","name":"YuetianAI"},"mainEntityOfPage":"https://yuetianai.com/articles/en/${a.slug}.html"}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a><nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${a.slug}.html">Chinese</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${catName}</span></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-24 11:00</time></span></p>
    </div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${a.enDesc}</p>
        <p>${a.sh.enCore} In the ${a.p.en}, this plays out across ${a.p.domainEn}.</p>${sectionsHtml}
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
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"阅天AI","item":"https://yuetianai.com/"},{"@type":"ListItem","position":2,"name":"学习紫微","item":"https://yuetianai.com/articles/"},{"@type":"ListItem","position":3,"name":"${catName}","item":"https://yuetianai.com/articles/ziwei-sihua.html"},{"@type":"ListItem","position":4,"name":"${jstr(title)}","item":"https://yuetianai.com/articles/${a.slug}.html"}]}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a><nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${a.slug}.html">English</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="ziwei-sihua.html">${catName}</a></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>${catName}</span><span><time datetime="${date}">2026-08-24 11:00</time></span></p>
    </div><div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${a.cnDesc}</p>
        <p>${a.sh.cnCore}${a.sh.cn}落在${a.p.cn}，就要把这股能量放到${a.p.domain}的具体场景里去看。</p>${sectionsHtml}
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
console.log('化禄:', articles.filter(a=>a.shKey==='hualu').length);
console.log('化权:', articles.filter(a=>a.shKey==='huaquan').length);
console.log('化科:', articles.filter(a=>a.shKey==='huake').length);
console.log('化忌:', articles.filter(a=>a.shKey==='huaji').length);
