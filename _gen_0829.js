const fs=require('fs'),path=require('path');
const date='2026-08-29T10:00:00+08:00';
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
  xianchi: {cn:'咸池',en:'Xian Chi',elem:'阴水',elemEn:'yin water',nature:'桃花煞星、情欲星',natureEn:'the peach-blossom malefic and desire star',
    cnTraits:['情欲重、桃花旺但偏邪','异性缘极好但多烂桃花','相貌性感、有吸引力','感情纠纷多','咸池的艺术感和人缘是正面'],
    enTraits:['strong desire, intense but risky romance','excellent opposite-sex luck but many bad relationships','sexy appearance, attractive','many relationship disputes','Xian Chi artistry and popularity are positive']},
  tianyao: {cn:'天姚',en:'Tian Yao',elem:'阴水',elemEn:'yin water',nature:'桃花星、口舌星、谋略星',natureEn:'the romance, eloquence, and strategy star',
    cnTraits:['口才好、善交际、有魅力','心思机敏、善于察言观色','异性缘好但偏暧昧','容易招口舌是非','天姚的口才和谋略是正面'],
    enTraits:['eloquent, sociable, charming','sharp-minded, good at reading people','good opposite-sex luck but ambiguous','prone to gossip and disputes','Tian Yao eloquence and strategy are positive']},
  guchen: {cn:'孤辰',en:'Gu Chen',elem:'阳火',elemEn:'yang fire',nature:'孤克星、独立星',natureEn:'the solitude and independence star',
    cnTraits:['性格独立、不依赖他人','内心孤独、不易交心','做事有主见、不靠别人','容易与人疏远','孤辰的独立和自律是正面'],
    enTraits:['independent, self-reliant','inner loneliness, hard to open up','strong-willed, does not rely on others','prone to emotional distance','Gu Chen independence and self-discipline are positive']},
  guasu: {cn:'寡宿',en:'Gua Su',elem:'阴火',elemEn:'yin fire',nature:'寡合星、清修星',natureEn:'the aloofness and detachment star',
    cnTraits:['性格清冷、不喜热闹','感情淡薄、容易独处','审美独特、有精神追求','婚姻缘分偏淡','寡宿的专注和内省是正面'],
    enTraits:['cool temperament, dislikes crowds','emotionally reserved, comfortable alone','unique aesthetics, spiritual pursuits','marriage bond tends to be thin','Gua Su focus and introspection are positive']},
  huagai: {cn:'华盖',en:'Hua Gai',elem:'阳木',elemEn:'yang wood',nature:'孤高星、艺术星、宗教星',natureEn:'the dignity, art, and spirituality star',
    cnTraits:['气质孤高、有艺术天赋','喜欢哲学宗教、精神世界丰富','聪明但不合群','容易孤芳自赏','华盖的艺术才华和悟性是正面'],
    enTraits:['dignified bearing, artistic talent','drawn to philosophy and religion, rich inner world','intelligent but not gregarious','prone to self-admiration','Hua Gai artistry and insight are positive']}
};

const CN_TITLES = {
  'xianchi-fudegong':'精神上追求刺激，感情享受要适度',
  'xianchi-fumugong':'长辈感情复杂，家庭桃花要防纠纷',
  'tianyao-minggong':'口才好善交际，魅力十足的谋略型人格',
  'tianyao-xiongdigong':'兄弟姐妹中有人善交际，同辈多口舌',
  'tianyao-fuqigong':'伴侣口才好善交际，感情要防暧昧',
  'tianyao-zinvgong':'孩子聪明善表达，教育要引导口才',
  'tianyao-caibogong':'靠口才和交际赚钱，适合销售公关',
  'tianyao-jiegong':'注意泌尿生殖系统，防口舌伤身',
  'tianyao-qianyi':'在外善交际人缘好，离乡靠口才发展',
  'tianyao-puyigong':'朋友多善交际之人，社交圈复杂',
  'tianyao-guanlugong':'事业靠口才谋略，适合公关外交行业',
  'tianyao-tianzhaigong':'家里多交际应酬，居家环境有格调',
  'tianyao-fudegong':'精神追求丰富，口才带来精神享受',
  'tianyao-fumugong':'父母善表达，长辈中有人口才好',
  'guchen-minggong':'性格独立不依赖人，天生自带孤克气质',
  'guchen-xiongdigong':'兄弟姐妹缘分淡，同辈关系疏远',
  'guchen-fuqigong':'感情里容易孤独，伴侣关系需主动经营',
  'guchen-zinvgong':'子女独立性强，亲子缘分偏淡',
  'guchen-caibogong':'赚钱靠自己，不依赖他人资助',
  'guchen-jiegong':'注意精神孤独影响健康，多社交',
  'guchen-qianyi':'在外独立打拼，离乡发展靠自己',
  'guchen-puyigong':'朋友少而精，社交圈独立',
  'guchen-guanlugong':'事业独立创业，不适合合伙',
  'guchen-tianzhaigong':'喜欢独居空间，房产靠自己买',
  'guchen-fudegong':'内心孤独但自律，精神世界独立',
  'guchen-fumugong':'父母缘分偏淡，长辈助力少',
  'guasu-minggong':'性格清冷不喜热闹，天生带疏离感',
  'guasu-xiongdigong':'兄弟姐妹关系冷淡，同辈往来少',
  'guasu-fuqigong':'感情淡薄婚姻缘浅，需要主动经营',
  'guasu-zinvgong':'子女性格安静，亲子关系清淡',
  'guasu-caibogong':'财运清淡不贪多，赚钱靠专注',
  'guasu-jiegong':'注意情绪郁结，独处要适度',
  'guasu-qianyi':'在外不喜交际，离乡发展偏安静',
  'guasu-puyigong':'朋友不多，社交圈清净',
  'guasu-guanlugong':'事业适合独立研究型工作',
  'guasu-tianzhaigong':'居家环境清净，喜欢简单布置',
  'guasu-fudegong':'精神内省追求清净，福气来自独处',
  'guasu-fumugong':'父母性格安静，家庭氛围清淡',
  'huagai-minggong':'气质孤高有艺术天赋，悟性极高',
  'huagai-xiongdigong':'兄弟姐妹中有人有艺术天赋'
};
const EN_TITLES = {
  'xianchi-fudegong':'Seeks Excitement Mentally; Moderate Romantic Pleasure',
  'xianchi-fumugong':'Complex Elder Romance; Prevent Family Disputes',
  'tianyao-minggong':'Eloquent and Charming; Strategic Personality',
  'tianyao-xiongdigong':'A Sociable Sibling; Peer Gossip',
  'tianyao-fuqigong':'Eloquent Partner; Beware Ambiguity',
  'tianyao-zinvgong':'Bright Articulate Children; Guide Their Eloquence',
  'tianyao-caibogong':'Earn Through Eloquence; Suited to Sales and PR',
  'tianyao-jiegong':'Watch Urinary System; Prevent Gossip-Related Stress',
  'tianyao-qianyi':'Sociable Outside; Develop Away Through Eloquence',
  'tianyao-puyigong':'Sociable Friends; Complex Social Circle',
  'tianyao-guanlugong':'Career Through Eloquence; Suited to PR and Diplomacy',
  'tianyao-tianzhaigong':'Home Full of Social Gatherings; Stylish Environment',
  'tianyao-fudegong':'Rich Mental Pursuits; Eloquence Brings Joy',
  'tianyao-fumugong':'Articulate Parents; An Eloquent Elder',
  'guchen-minggong':'Independent and Self-Reliant; Natural Solitude',
  'guchen-xiongdigong':'Thin Sibling Bond; Distant Peer Relations',
  'guchen-fuqigong':'Loneliness in Love; Actively Nurture the Bond',
  'guchen-zinvgong':'Independent Children; Thin Parent-Child Bond',
  'guchen-caibogong':'Earn Independently; No Reliance on Others',
  'guchen-jiegong':'Watch Loneliness Affecting Health; Socialize More',
  'guchen-qianyi':'Strive Independently Outside; Rely on Yourself Away',
  'guchen-puyigong':'Few but Quality Friends; Independent Social Circle',
  'guchen-guanlugong':'Independent Career; Not Suited to Partnership',
  'guchen-tianzhaigong':'Values Personal Space; Buys Property Independently',
  'guchen-fudegong':'Lonely but Disciplined; Independent Inner World',
  'guchen-fumugong':'Thin Parent Bond; Little Elder Support',
  'guasu-minggong':'Cool and Reserved; Natural Detachment',
  'guasu-xiongdigong':'Distant Sibling Relations; Few Peer Interactions',
  'guasu-fuqigong':'Thin Emotional Bond; Actively Nurture Marriage',
  'guasu-zinvgong':'Quiet Children; Calm Parent-Child Relationship',
  'guasu-caibogong':'Modest Wealth; Earn Through Focus',
  'guasu-jiegong':'Watch Emotional Stagnation; Moderate Solitude',
  'guasu-qianyi':'Dislikes Socializing Outside; Quiet Development Away',
  'guasu-puyigong':'Few Friends; Quiet Social Circle',
  'guasu-guanlugong':'Suited to Independent Research Work',
  'guasu-tianzhaigong':'Quiet Home; Prefers Simple Decor',
  'guasu-fudegong':'Introspective and Serene; Blessings from Solitude',
  'guasu-fumugong':'Quiet Parents; Calm Family Atmosphere',
  'huagai-minggong':'Dignified Artistic Talent; Exceptional Insight',
  'huagai-xiongdigong':'A Sibling with Artistic Talent'
};

const combos = [
  ['xianchi','fudegong'],['xianchi','fumugong'],
  ['tianyao','minggong'],['tianyao','xiongdigong'],['tianyao','fuqigong'],['tianyao','zinvgong'],
  ['tianyao','caibogong'],['tianyao','jiegong'],['tianyao','qianyi'],['tianyao','puyigong'],
  ['tianyao','guanlugong'],['tianyao','tianzhaigong'],['tianyao','fudegong'],['tianyao','fumugong'],
  ['guchen','minggong'],['guchen','xiongdigong'],['guchen','fuqigong'],['guchen','zinvgong'],
  ['guchen','caibogong'],['guchen','jiegong'],['guchen','qianyi'],['guchen','puyigong'],
  ['guchen','guanlugong'],['guchen','tianzhaigong'],['guchen','fudegong'],['guchen','fumugong'],
  ['guasu','minggong'],['guasu','xiongdigong'],['guasu','fuqigong'],['guasu','zinvgong'],
  ['guasu','caibogong'],['guasu','jiegong'],['guasu','qianyi'],['guasu','puyigong'],
  ['guasu','guanlugong'],['guasu','tianzhaigong'],['guasu','fudegong'],['guasu','fumugong'],
  ['huagai','minggong'],['huagai','xiongdigong']
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
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-29 10:00</time></span></p>
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
      <p class="article-meta"><span>${catName}</span><span><time datetime="${date}">2026-08-29 10:00</time></span></p>
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
for (const sk of ['xianchi','tianyao','guchen','guasu','huagai']) {
  console.log(STARS[sk].cn+':', articles.filter(a=>a.starKey===sk).length);
}
