const fs=require('fs'),path=require('path');
const date='2026-08-23T10:30:00+08:00';
function jstr(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"');}

const STARS = {
  tianfu: {cn:'天府',en:'Tian Fu',elem:'阳土',elemEn:'yang earth',nature:'南斗主星、财库星',natureEn:'the Southern Dipper chief and treasury star',
    cnTraits:['稳重包容、有肚量','善于管理和储蓄','有领导才能','保守谨慎','爱面子、讲究品味'],
    enTraits:['steady, tolerant, broad-minded','good at management and saving','leadership ability','conservative and cautious','face-conscious and taste-oriented']},
  taiyin: {cn:'太阴',en:'Tai Yin',elem:'阴水',elemEn:'yin water',nature:'月亮星、田宅主',natureEn:'the moon star and a Property ruler',
    cnTraits:['温柔细腻、感情丰富','重视家庭和安全感','有艺术审美、爱干净','直觉强、容易想太多','母性特质、照顾他人'],
    enTraits:['gentle, delicate, emotionally rich','values home and security','artistic taste, loves cleanliness','strong intuition, prone to overthinking','maternal, caring for others']},
  tanlang: {cn:'贪狼',en:'Tan Lang',elem:'阳木/阴水',elemEn:'yang wood/yin water',nature:'正桃花星、欲望之星',natureEn:'the primary peach-blossom star and the star of desire',
    cnTraits:['多才多艺、学习力强','交际手腕高、人缘好','野心大、欲望多','喜欢新鲜刺激','有艺术和表演天赋'],
    enTraits:['versatile, fast learner','skilled networker, popular','ambitious, many desires','loves novelty and excitement','artistic and performance talent']},
  jumen: {cn:'巨门',en:'Ju Men',elem:'阴水/阴金',elemEn:'yin water/yin metal',nature:'暗星、口舌之星',natureEn:'the dark star and the star of speech',
    cnTraits:['口才好、善于分析','心思细腻、观察力强','容易招是非口舌','多疑、喜欢追问到底','适合靠嘴和笔吃饭'],
    enTraits:['eloquent, analytical','detail-minded, observant','prone to disputes and gossip','skeptical, likes to get to the bottom','suited to work involving speech or writing']}
};

const PALACES = {
  puyigong:{cn:'仆役宫',en:'Friends Palace',domain:'下属、朋友、合伙人与社交圈',domainEn:'subordinates, friends, partners, and social circle',
    cnQuestions:['朋友靠不靠谱','能不能合伙','下属能不能用'],enQuestions:['whether friends are reliable','whether partnership works','whether subordinates are capable']},
  guanlugong:{cn:'官禄宫',en:'Career Palace',domain:'工作运势、事业格局和职场状态',domainEn:'work fortune, career structure, and job situation',
    cnQuestions:['适合什么行业','能不能当主管','事业天花板在哪'],enQuestions:['what industry fits','whether management suits you','where the career ceiling is']},
  tianzhaigong:{cn:'田宅宫',en:'Property Palace',domain:'房产家业、居住环境和固定资产',domainEn:'real estate, living environment, and fixed assets',
    cnQuestions:['有没有房产运','家里环境怎样','能不能守住家底'],enQuestions:['whether property luck exists','what the home environment is like','whether family assets can be kept']},
  fudegong:{cn:'福德宫',en:'Fortune Palace',domain:'精神状态、福气心态和兴趣享受',domainEn:'mental state, blessings, mindset, and enjoyment',
    cnQuestions:['内心安不安','有没有福气','花钱买开心值不值'],enQuestions:['whether the mind is at peace','whether blessings exist','whether spending on joy is worth it']},
  fumugong:{cn:'父母宫',en:'Parents Palace',domain:'父母缘分、长辈助力和文书学历',domainEn:'parents, elder support, documents, and education',
    cnQuestions:['父母能不能靠','跟长辈关系怎样','文书运好不好'],enQuestions:['whether parents can be relied on','how elder relationships are','whether document luck is good']},
  minggong:{cn:'命宫',en:'Life Palace',domain:'核心性格、长相和人生基调',domainEn:'core personality, appearance, and life direction',
    cnQuestions:['这个人本质是什么样','天生优势在哪','这辈子要学什么'],enQuestions:['what this person fundamentally is','where natural strengths lie','what this life must learn']},
  xiongdigong:{cn:'兄弟宫',en:'Siblings Palace',domain:'手足关系、同辈缘分和资金周转',domainEn:'sibling relationships, peer bonds, and cash turnover',
    cnQuestions:['兄弟姐妹能不能帮','同辈关系怎样','资金周转灵不灵'],enQuestions:['whether siblings can help','how peer relationships are','whether cash flow is flexible']},
  fuqigong:{cn:'夫妻宫',en:'Spouse Palace',domain:'感情婚姻、伴侣特质和婚恋吉凶',domainEn:'love, marriage, partner traits, and relationship fortune',
    cnQuestions:['另一半是什么样的人','感情顺不顺','婚姻要注意什么'],enQuestions:['what the partner is like','whether relationships go smoothly','what marriage needs attention']},
  zinvgong:{cn:'子女宫',en:'Children Palace',domain:'子女缘分、晚辈关系和创意产出',domainEn:'children, junior relationships, and creative output',
    cnQuestions:['孩子缘深不深','跟子女关系怎样','创造力如何'],enQuestions:['whether children luck is strong','how relationships with children are','how creativity is']},
  caibogong:{cn:'财帛宫',en:'Wealth Palace',domain:'收入方式、求财路径和现金流',domainEn:'income style, earning path, and cash flow',
    cnQuestions:['钱从哪里来','能不能存住','适合什么赚钱方式'],enQuestions:['where money comes from','whether it can be retained','what earning method fits']},
  jiegong:{cn:'疾厄宫',en:'Health Palace',domain:'体质弱点、慢性病和意外灾厄',domainEn:'physical weaknesses, chronic conditions, and accidents',
    cnQuestions:['哪里最容易出问题','什么习惯最伤身','什么时候要特别注意'],enQuestions:['what is most vulnerable','which habits harm most','when to be extra careful']},
  qianyi:{cn:'迁移宫',en:'Travel Palace',domain:'外出运势、人际外缘和远方机遇',domainEn:'travel luck, external connections, and distant opportunities',
    cnQuestions:['适不适合外出发展','外面有没有贵人','离乡是好是坏'],enQuestions:['whether leaving home suits you','whether benefactors await outside','whether departure helps or hurts']}
};

function genArticle(starKey, palaceKey) {
  const s = STARS[starKey], p = PALACES[palaceKey];
  const slug = `ziwei-${starKey}-zai-${palaceKey}`;
  return {
    slug,
    cnTitle: `${s.cn}在${p.cn}：${genCnTitle(starKey,palaceKey)}`,
    enTitle: `${s.en} in ${p.en}: ${genEnTitle(starKey,palaceKey)}`,
    cnDesc: `${s.cn}在${p.cn}，${p.domain}。${s.cn}是${s.nature}，落在${p.cn}有它独特的表现和需要注意的地方。`,
    enDesc: `${s.en} in the ${p.en} affects ${p.domainEn}. As ${s.natureEn}, it brings distinct patterns and cautions.`,
    cnLead: `很多人看到${s.cn}在${p.cn}，第一反应是查「好不好」。但${s.cn}是${s.nature}，它落在${p.cn}不是简单的好坏问题，而是这颗星的能量会以什么方式在${p.domain}这件事上表现出来。${s.cn}的关键词是${s.cnTraits.slice(0,3).join('、')}，这些特质放到${p.cn}的场景里，会产生非常具体的现实对应。`,
    enLead: `Many people seeing ${s.en} in the ${p.en} first ask "is it good or bad." But ${s.en} is ${s.natureEn}; in the ${p.en} the question is not good or bad but how its energy shows up in ${p.domainEn}. ${s.en} keywords are ${s.enTraits.slice(0,3).join(', ')}, and these traits produce very concrete patterns in the ${p.en} context.`,
    cnIntro2: `${p.cn}看的是${p.domain}。${s.cn}属${s.elem}，它的能量特质是${s.cnTraits[0]}。读这颗星在${p.cn}，不能只看单宫，必须回到三方四正——${p.cn}的三方会照决定了${s.cn}的能量能不能被接住。有吉星会照，${s.cn}的优点能落地；被煞星冲照，同样的特质可能变成压力和阻碍。`,
    enIntro2: `The ${p.en} covers ${p.domainEn}. ${s.en} is ${s.elemEn}, with an energy of ${s.enTraits[0]}. Reading it in the ${p.en} requires the triple-direction view — the palaces that aspect the ${p.en} determine whether ${s.en}'s energy can be received. With auspicious stars, its strengths land; with malefics, the same traits can become pressure and obstacles.`,
    cnSections: genCnSections(s,p),
    enSections: genEnSections(s,p),
    cnSidebar: getSidebar(starKey,palaceKey,false),
    enSidebar: getSidebar(starKey,palaceKey,true)
  };
}

function genCnTitle(sk,pk){
  const t = {
    'tianfu-puyigong':'用人稳字当头，朋友圈是你的资源库',
    'tianfu-guanlugong':'稳坐中军帐，适合管理和守成型事业',
    'tianfu-tianzhaigong':'财库坐田宅，房产运最厚的位置之一',
    'tianfu-fudegong':'心态稳福气厚，但要防过于安逸',
    'tianfu-fumugong':'父母是靠山，长辈给你底气和资源',
    'taiyin-minggong':'月亮坐命：温柔细腻但需要安全感的人',
    'taiyin-xiongdigong':'姐妹缘深，同辈中有人默默帮你',
    'taiyin-fuqigong':'伴侣温柔顾家，感情里要的是安全感',
    'taiyin-zinvgong':'女儿缘深，孩子贴心懂事',
    'taiyin-caibogong':'间接财运好，靠房产、储蓄和女性贵人赚钱',
    'taiyin-jiegong':'注意脾胃和妇科，情绪是健康的晴雨表',
    'taiyin-qianyi':'在外有女性贵人，离乡发展越走越稳',
    'taiyin-puyigong':'朋友多为温和型，闺蜜比兄弟靠谱',
    'taiyin-guanlugong':'适合稳定、细致、跟美有关的工作',
    'taiyin-tianzhaigong':'田宅主坐田宅，房产运极佳',
    'taiyin-fudegong':'内心细腻浪漫，精神世界丰富',
    'taiyin-fumugong':'母亲影响深，长辈缘好但容易依赖',
    'tanlang-minggong':'桃花星坐命：多才多艺、欲望旺盛的社交高手',
    'tanlang-xiongdigong':'朋友三教九流，兄弟中有人很会来事',
    'tanlang-fuqigong':'感情多姿多彩，但要防花心和诱惑',
    'tanlang-zinvgong':'孩子聪明活泼，教育要引导专注力',
    'tanlang-caibogong':'赚钱路子广，偏财运和交际财强',
    'tanlang-jiegong':'注意肝胆和泌尿系统，节制是关键',
    'tanlang-qianyi':'在外如鱼得水，外出机会多应酬多',
    'tanlang-puyigong':'朋友圈就是你的资源网，但要防酒肉朋友',
    'tanlang-guanlugong':'适合公关、销售、娱乐等跟人打交道的行业',
    'tanlang-tianzhaigong':'家里待不住，喜欢装修和改变居家环境',
    'tanlang-fudegong':'享受型人格，舍得为快乐花钱',
    'tanlang-fumugong':'父母中有人善交际，家庭氛围活跃',
    'jumen-minggong':'暗星坐命：口才犀利、心思缜密的质疑者',
    'jumen-xiongdigong':'兄弟姐妹中有人爱说话，容易拌嘴',
    'jumen-fuqigong':'感情里沟通是关键，吵不散的才是真感情',
    'jumen-zinvgong':'孩子能言善辩，教育要引导正面表达',
    'jumen-caibogong':'靠口才和专业赚钱，但要防口舌破财',
    'jumen-jiegong':'注意呼吸系统和肠胃，说话多了伤气',
    'jumen-qianyi':'在外靠嘴巴吃饭，异乡发展口才是利器',
    'jumen-puyigong':'朋友中多诤友，但也容易起争执',
    'jumen-guanlugong':'适合律师、教师、传媒等靠嘴的行业',
    'jumen-tianzhaigong':'家里容易有口舌是非，注意沟通方式'
  };
  return t[sk+'-'+pk] || `${STARS[sk].cn}在${PALACES[pk].cn}的独特表现`;
}

function genEnTitle(sk,pk){
  const t = {
    'tianfu-puyigong':'Steady Hiring — Friends as a Resource Bank',
    'tianfu-guanlugong':'Commanding the Center — Suited to Management and Preservation',
    'tianfu-tianzhaigong':'Treasury in Property — One of the Strongest Property Positions',
    'tianfu-fudegong':'Stable Mind, Thick Blessings — Guard Against Complacency',
    'tianfu-fumugong':'Parents as Backing — Elders Give Confidence and Resources',
    'taiyin-minggong':'The Moon in Life — Gentle, Sensitive, Needing Security',
    'taiyin-xiongdigong':'Strong Sister Bonds — Quiet Help from Peers',
    'taiyin-fuqigong':'A Gentle, Home-Loving Partner — Security Is What Matters',
    'taiyin-zinvgong':'Strong Daughter Luck — Thoughtful, Considerate Children',
    'taiyin-caibogong':'Indirect Wealth — Earning Through Property, Savings, and Female Benefactors',
    'taiyin-jiegong':'Watch Spleen/Stomach and Gynecology — Emotions Are the Barometer',
    'taiyin-qianyi':'Female Benefactors Outside — Leaving Home Brings Stability',
    'taiyin-puyigong':'Mostly Gentle Friends — Close Female Friends Over Brothers',
    'taiyin-guanlugong':'Suited to Stable, Detailed, Beauty-Related Work',
    'taiyin-tianzhaigong':'Property Ruler in Property — Excellent Real Estate Luck',
    'taiyin-fudegong':'A Delicate, Romantic Inner World',
    'taiyin-fumugong':'Deep Mother Influence — Good Elder Luck but Prone to Dependence',
    'tanlang-minggong':'The Peach-Blossom Star in Life — Versatile, Desirous Social Expert',
    'tanlang-xiongdigong':'A Wide Range of Friends — Savvy Siblings',
    'tanlang-fuqigong':'Colorful Relationships — Guard Against Distraction',
    'tanlang-zinvgong':'Bright, Lively Children — Guide Their Focus',
    'tanlang-caibogong':'Many Income Paths — Strong Windfall and Networking Wealth',
    'tanlang-jiegong':'Watch Liver/Gallbladder and Urinary System — Moderation Is Key',
    'tanlang-qianyi':'Thriving Outside — Many Opportunities and Social Engagements',
    'tanlang-puyigong':'Your Social Circle Is Your Resource Net — Beware Fair-Weather Friends',
    'tanlang-guanlugong':'Suited to PR, Sales, Entertainment — People-Facing Fields',
    'tanlang-tianzhaigong':'Cannot Stay Still at Home — Loves Renovation and Change',
    'tanlang-fudegong':'Enjoyment-Oriented — Willing to Spend on Pleasure',
    'tanlang-fumugong':'A Sociable Parent — Lively Family Atmosphere',
    'jumen-minggong':'The Dark Star in Life — Eloquent, Meticulous Questioner',
    'jumen-xiongdigong':'A Talkative Sibling — Prone to Arguments',
    'jumen-fuqigong':'Communication Is Key in Love — Surviving Fights Means Real Bond',
    'jumen-zinvgong':'Articulate Children — Guide Positive Expression',
    'jumen-caibogong':'Earning Through Speech and Expertise — Guard Verbal Financial Loss',
    'jumen-jiegong':'Watch Respiratory and Digestive Systems — Too Much Talk Drains Energy',
    'jumen-qianyi':'Earning by the Mouth Abroad — Eloquence Is a Weapon',
    'jumen-puyigong':'Many Straight-Talking Friends — But Prone to Disputes',
    'jumen-guanlugong':'Suited to Law, Teaching, Media — Speech-Based Professions',
    'jumen-tianzhaigong':'Verbal Disputes at Home — Mind Communication Style'
  };
  return t[sk+'-'+pk] || `How ${STARS[sk].en} Manifests in the ${PALACES[pk].en}`;
}

function genCnSections(s,p){
  return [
    {h:`${s.cn}在${p.cn}的核心表现`,ps:[
      `${s.cnTraits[0]}——在${p.domain}这件事上，这个特质最直接。`,
      `${s.cnTraits[1]}——这决定了${s.cn}在${p.cn}的处理方式。`,
      `${s.cnTraits[2]}——放到${p.cn}的场景里，表现为具体的行为模式。`,
      `${s.cnTraits[3]}——这是把双刃剑，用好了是优势，用不好是内耗。`,
      `${s.cnTraits[4] ? s.cnTraits[4]+'——这一面往往被忽略，但在'+p.domain+'中很关键。' : s.cn+'的能量不是孤立的，必须看同宫和三方星曜。'}`
    ]},
    {h:`有吉星和有煞星的区别`,ps:[
      `加左辅右弼——${p.domain}中有人帮衬，${s.cn}的执行力能落地。`,
      `加天魁天钺——关键时刻有贵人提携，${p.cn}的事容易逢凶化吉。`,
      `加文昌文曲——${s.cn}的硬实力配上谋略和文采，表现更全面。`,
      `加擎羊陀罗——${p.domain}的过程更费劲，容易拖延或起冲突。`,
      `加火星铃星——突发状况多，${p.cn}的事容易被打断或急转直下。`
    ]},
    {h:`现实中的对应和建议`,ps:[
      `如果你正在经历${p.cn}相关的事，先看${s.cn}是庙旺还是落陷——亮度决定了这颗星有没有力气发挥。`,
      `庙旺时，${s.cnTraits[0]}是你的核心竞争力，可以大胆往这个方向走。`,
      `落陷时，同样的特质会打折扣，需要用后天选择来补——选对环境比硬扛更重要。`,
      `化禄化权在${p.cn}，${p.domain}有实质突破；化科是名声和认可；化忌则是卡点和执念。`,
      `记住：${s.cn}在${p.cn}不是宿命，而是一张说明书——告诉你在${p.domain}这件事上，你的出厂设置是什么。`
    ]},
    {h:'排盘使用顺序',ps:[`看到${s.cn}在${p.cn}，按这个顺序读：`],ol:[
      `先看${s.cn}亮度——庙旺有力，落陷打折。`,
      `看同宫星曜——吉星加分，煞星减分。`,
      `看三方四正——${p.cn}的三方决定了全貌。`,
      `看四化——化禄化权化科化忌分别触发什么。`,
      `看大限流年——什么时候${p.cn}的事会被激活。`,
      `问自己：${p.cnQuestions[0]}？${p.cnQuestions[1]}？${p.cnQuestions[2]}？`
    ]}
  ];
}

function genEnSections(s,p){
  return [
    {h:`Core Expression of ${s.en} in the ${p.en}`,ps:[
      `${s.enTraits[0]} — this is the most direct expression in matters of ${p.domainEn}.`,
      `${s.enTraits[1]} — this determines how ${s.en} handles the ${p.en}.`,
      `${s.enTraits[2]} — in the ${p.en} context, this becomes a concrete behavior pattern.`,
      `${s.enTraits[3]} — a double-edged trait: strength when used well, internal friction when not.`,
      `${s.enTraits[4] ? s.enTraits[4]+' — often overlooked, but key in matters of '+p.domainEn+'.' : s.en+"'s energy is not isolated; co-stars and triple-direction matter."}`
    ]},
    {h:'With Auspicious Stars vs Malefics',ps:[
      `With Zuo Fu/You Bi — help arrives in ${p.domainEn}; ${s.en}'s execution can land.`,
      `With Tian Kui/Tian Yue — benefactors appear at key moments; ${p.en} matters resolve.`,
      `With Wen Chang/Wen Qu — ${s.en}'s hard strength gains strategy and expression.`,
      `With Qing Yang/Tuo Luo — the process of ${p.domainEn} is harder, with delays or conflict.`,
      `With Huo Xing/Ling Xing — sudden disruptions; ${p.en} matters get interrupted or take sharp turns.`
    ]},
    {h:'Practical Correspondence and Advice',ps:[
      `If you are dealing with ${p.en} matters, first check whether ${s.en} is in temple/prosperity or fallen — brightness determines whether the star has power.`,
      `When bright, ${s.enTraits[0]} is your core advantage; move boldly in that direction.`,
      `When fallen, the same traits are discounted; compensate through conscious choices — the right environment matters more than endurance.`,
      `Lu or Quan in the ${p.en} brings real breakthroughs in ${p.domainEn}; Ke brings reputation; Ji marks a blockage or fixation.`,
      `Remember: ${s.en} in the ${p.en} is not fate but a manual — it tells you your factory settings for ${p.domainEn}.`
    ]},
    {h:'Reading Order',ps:[`For ${s.en} in the ${p.en}:`],ol:[
      `Check ${s.en} brightness — temple/prosperous: strong; fallen: discounted.`,
      `Check co-stars — auspicious stars add; malefics subtract.`,
      `Check triple direction — the ${p.en}'s aspects reveal the full picture.`,
      `Check transformations — what Lu, Quan, Ke, Ji each activate.`,
      `Check major and annual cycles — when ${p.en} matters get triggered.`,
      `Ask yourself: ${p.enQuestions[0]}? ${p.enQuestions[1]}? ${p.enQuestions[2]}?`
    ]}
  ];
}

function getSidebar(sk,pk,isEn){
  return [
    {href:'ziwei-main-stars.html',text:isEn?'Main Stars':'十四主星总览'},
    {href:`ziwei-star-${sk}.html`,text:isEn?`${STARS[sk].en} Star`:`${STARS[sk].cn}星详解`},
    {href:`ziwei-${pk}.html`,text:isEn?PALACES[pk].en:PALACES[pk].cn},
    {href:'ziwei-sanfang-sizheng.html',text:isEn?'Triple Direction':'先看三方四正'},
    {href:'ziwei-minggong.html',text:isEn?'Life Palace':'回到命宫定位本人'},
    {href:isEn?'../../pages/mingbook-onepage.html':'../pages/mingbook-onepage.html',text:isEn?'Quick Chart':'快速排盘'}
  ];
}

function buildHTML(a,isEn){
  const sections=isEn?a.enSections:a.cnSections;
  const sidebar=isEn?a.enSidebar:a.cnSidebar;
  const lead=isEn?a.enLead:a.cnLead;
  const intro2=isEn?a.enIntro2:a.cnIntro2;
  const title=isEn?a.enTitle:a.cnTitle;
  const desc=isEn?a.enDesc:a.cnDesc;
  let sectionsHtml='';
  for(let i=0;i<sections.length;i++){
    const s=sections[i];
    sectionsHtml+=`\n        <h2 id="section-${i+1}">${s.h}</h2>\n`;
    for(const p of s.ps) sectionsHtml+=`        <p>${p}</p>\n`;
    if(s.ol){
      sectionsHtml+='        <ol>\n';
      for(const item of s.ol) sectionsHtml+=`          <li>${item}</li>\n`;
      sectionsHtml+='        </ol>\n';
    }
  }
  let sidebarHtml='';
  for(const link of sidebar) sidebarHtml+=`        <a class="card-link" href="${link.href}">${link.text}</a>\n`;
  if(isEn){
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
  {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${jstr(title)}",
  "description": "${jstr(desc)}",
  "image": "https://yuetianai.com/images/home2/triad-tian-bg.webp",
  "datePublished": "${date}",
  "dateModified": "${date}",
  "inLanguage": "en",
  "articleSection": "Zi Wei Dou Shu",
  "about": ["Zi Wei Dou Shu", "Main Stars", "${jstr(title)}"],
  "author": {"@type": "Organization", "name": "YuetianAI"},
  "publisher": {"@type": "Organization", "name": "YuetianAI"},
  "mainEntityOfPage": "https://yuetianai.com/articles/en/${a.slug}.html"
}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a><nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${a.slug}.html">Chinese</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>Main Stars</span></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-23 10:30</time></span></p>
    </div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="Related links"><h2>Read Next</h2>
${sidebarHtml}      </aside>
    </div>
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
  {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${jstr(title)}",
  "description": "${jstr(desc)}",
  "image": "https://yuetianai.com/images/home2/triad-tian-bg.webp",
  "datePublished": "${date}",
  "dateModified": "${date}",
  "inLanguage": "zh-CN",
  "articleSection": "主星",
  "about": ["紫微斗数", "主星", "${jstr(title)}"],
  "author": {"@type": "Organization", "name": "阅天AI"},
  "publisher": {"@type": "Organization", "name": "阅天AI"},
  "mainEntityOfPage": "https://yuetianai.com/articles/${a.slug}.html"
}
  </script>
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "阅天AI", "item": "https://yuetianai.com/"},
    {"@type": "ListItem", "position": 2, "name": "学习紫微", "item": "https://yuetianai.com/articles/"},
    {"@type": "ListItem", "position": 3, "name": "主星", "item": "https://yuetianai.com/articles/ziwei-main-stars.html"},
    {"@type": "ListItem", "position": 4, "name": "${jstr(title)}", "item": "https://yuetianai.com/articles/${a.slug}.html"}
  ]
}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a><nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${a.slug}.html">English</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="ziwei-main-stars.html">主星</a></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>主星</span><span><time datetime="${date}">2026-08-23 10:30</time></span></p>
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

const combos = [
  ['tianfu','puyigong'],['tianfu','guanlugong'],['tianfu','tianzhaigong'],['tianfu','fudegong'],['tianfu','fumugong'],
  ['taiyin','minggong'],['taiyin','xiongdigong'],['taiyin','fuqigong'],['taiyin','zinvgong'],
  ['taiyin','caibogong'],['taiyin','jiegong'],['taiyin','qianyi'],['taiyin','puyigong'],
  ['taiyin','guanlugong'],['taiyin','tianzhaigong'],['taiyin','fudegong'],['taiyin','fumugong'],
  ['tanlang','minggong'],['tanlang','xiongdigong'],['tanlang','fuqigong'],['tanlang','zinvgong'],
  ['tanlang','caibogong'],['tanlang','jiegong'],['tanlang','qianyi'],['tanlang','puyigong'],
  ['tanlang','guanlugong'],['tanlang','tianzhaigong'],['tanlang','fudegong'],['tanlang','fumugong'],
  ['jumen','minggong'],['jumen','xiongdigong'],['jumen','fuqigong'],['jumen','zinvgong'],
  ['jumen','caibogong'],['jumen','jiegong'],['jumen','qianyi'],['jumen','puyigong'],
  ['jumen','guanlugong'],['jumen','tianzhaigong']
];

const articles = combos.map(([sk,pk]) => genArticle(sk,pk));
for(const a of articles){
  fs.writeFileSync(path.join(__dirname,'articles',`${a.slug}.html`),buildHTML(a,false).replace(/\r\n/g,'\n'),'utf8');
  fs.writeFileSync(path.join(__dirname,'articles','en',`${a.slug}.html`),buildHTML(a,true).replace(/\r\n/g,'\n'),'utf8');
  console.log(`Created: ${a.slug}`);
}
console.log(`\nTotal: ${articles.length} articles (${articles.length*2} HTML files)`);
