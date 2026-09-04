const fs=require('fs'),path=require('path');
function jstr(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"');}
const PORDER=['minggong','xiongdigong','fuqigong','zinvgong','caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong','fudegong','fumugong'];
const PALACES={
  minggong:{cn:'命宫',en:'Life Palace',domain:'核心性格、人生基调与外在表现',domainEn:'core personality, life direction, and outward expression',cnQ:['这辈子的性格优势在哪','人生整体顺不顺','我给人的第一印象是什么'],enQ:['where personality strengths lie','whether life flows smoothly','what first impression you give']},
  xiongdigong:{cn:'兄弟宫',en:'Siblings Palace',domain:'手足关系、同辈缘分与资金周转',domainEn:'sibling relationships, peer bonds, and cash turnover',cnQ:['兄弟姐妹能不能帮上忙','跟同辈合不合','资金周转灵不灵'],enQ:['whether siblings can help','how peer relationships are','whether cash flow is flexible']},
  fuqigong:{cn:'夫妻宫',en:'Spouse Palace',domain:'感情婚姻、伴侣特质与亲密关系',domainEn:'love, marriage, partner traits, and intimacy',cnQ:['另一半是什么样的人','感情顺不顺','婚姻最大的功课是什么'],enQ:['what the partner is like','whether relationships go smoothly','the biggest lesson in marriage']},
  zinvgong:{cn:'子女宫',en:'Children Palace',domain:'子女缘分、晚辈关系与创意产出',domainEn:'children, junior relationships, and creative output',cnQ:['孩子缘深不深','跟子女关系怎样','创造力如何'],enQ:['whether children luck is strong','how relationships with children are','how creativity is']},
  caibogong:{cn:'财帛宫',en:'Wealth Palace',domain:'收入方式、求财路径与现金流',domainEn:'income style, earning path, and cash flow',cnQ:['钱从哪里来','能不能存住钱','适合什么赚钱方式'],enQ:['where money comes from','whether it can be retained','what earning method fits']},
  jiegong:{cn:'疾厄宫',en:'Health Palace',domain:'体质弱点、慢性病与意外灾厄',domainEn:'physical weaknesses, chronic conditions, and accidents',cnQ:['哪里最容易出问题','什么习惯最伤身','什么时候要特别注意'],enQ:['what is most vulnerable','which habits harm most','when to be extra careful']},
  qianyi:{cn:'迁移宫',en:'Travel Palace',domain:'外出运势、人际外缘与远方机遇',domainEn:'travel luck, external connections, and distant opportunities',cnQ:['适不适合外出发展','外面有没有贵人','离乡是好是坏'],enQ:['whether leaving home suits you','whether benefactors await outside','whether departure helps or hurts']},
  puyigong:{cn:'仆役宫',en:'Friends Palace',domain:'下属、朋友、合伙人与社交圈',domainEn:'subordinates, friends, partners, and social circle',cnQ:['朋友靠不靠谱','能不能合伙','下属能不能用'],enQ:['whether friends are reliable','whether partnership works','whether subordinates are capable']},
  guanlugong:{cn:'官禄宫',en:'Career Palace',domain:'工作运势、事业格局与职场状态',domainEn:'work fortune, career structure, and job situation',cnQ:['适合什么行业','能不能当主管','事业天花板在哪'],enQ:['what industry fits','whether management suits you','where the career ceiling is']},
  tianzhaigong:{cn:'田宅宫',en:'Property Palace',domain:'房产家业、居住环境与固定资产',domainEn:'real estate, living environment, and fixed assets',cnQ:['有没有房产运','家里环境怎样','能不能守住家底'],enQ:['whether property luck exists','what the home environment is like','whether family assets can be kept']},
  fudegong:{cn:'福德宫',en:'Fortune Palace',domain:'精神状态、福气心态与兴趣享受',domainEn:'mental state, blessings, mindset, and enjoyment',cnQ:['内心安不安','有没有福气','花钱买开心值不值'],enQ:['whether the mind is at peace','whether blessings exist','whether spending on joy is worth it']},
  fumugong:{cn:'父母宫',en:'Parents Palace',domain:'父母缘分、长辈助力与文书学历',domainEn:'parents, elder support, documents, and education',cnQ:['父母能不能靠','跟长辈关系怎样','文书运好不好'],enQ:['whether parents can be relied on','how elder relationships are','whether document luck is good']}
};
let curStarKey='',curP='';
function cnSections(s,p){return[
 {h:`${s.cn}在${p.cn}的核心表现`,ps:[`${s.cnT[0]}——在${p.domain}这件事上，这个特质最直接。`,`${s.cnT[1]}——这决定了${s.cn}在${p.cn}的表现方式。`,`${s.cnT[2]}——放到${p.cn}的场景里，表现为具体的行为模式。`,`${s.cnT[3]}——这是把双刃剑，用好了是优势，用不好是麻烦。`,`${s.cnT[4]}——这一面往往被忽略，但在${p.domain}中很关键。`]},
 {h:'有吉星和有煞星的区别',ps:[`加左辅右弼——${p.domain}中有人帮衬，${s.cn}的能量能落地。`,`加天魁天钺——关键时刻有贵人提携，${p.cn}的事容易逢凶化吉。`,`加文昌文曲——${s.cn}配上谋略和文采，表现更圆融。`,`加擎羊陀罗——${p.domain}的过程更费劲，容易拖延或起冲突。`,`加火星铃星——突发状况多，${p.cn}的事容易被打断或急转直下。`]},
 {h:'现实中的对应和建议',ps:[`如果你正在经历${p.cn}相关的事，先看${s.cn}同宫的主星是庙旺还是落陷。`,`庙旺时，${s.cnT[0]}是你的核心竞争力，可以大胆往这个方向走。`,`落陷时，同样的特质会打折扣，需要用后天选择来补——选对环境比硬扛更重要。`,`化禄化权在${p.cn}，${p.domain}有实质突破；化科是名声和认可；化忌则是卡点和执念。`,`记住：${s.cn}在${p.cn}不是宿命，而是一张说明书——告诉你${p.domain}上的出厂设置。`]},
 {h:'排盘使用顺序',ps:[`看到${s.cn}在${p.cn}，按这个顺序读：`],ol:[`先看同宫主星——主星决定基本盘。`,`看${s.cn}与主星的配合——吉星加分，煞星减分。`,`看三方四正——${p.cn}的三方决定了全貌。`,`看四化——化禄化权化科化忌分别触发什么。`,`看大限流年——什么时候${p.cn}的事会被激活。`,`问自己：${p.cnQ[0]}？${p.cnQ[1]}？${p.cnQ[2]}？`]}
];}
function enSections(s,p){return[
 {h:`Core Expression of ${s.en} in the ${p.en}`,ps:[`${s.enT[0]} — this is the most direct expression in matters of ${p.domainEn}.`,`${s.enT[1]} — this determines how ${s.en} handles the ${p.en}.`,`${s.enT[2]} — in the ${p.en} context, this becomes a concrete behavior pattern.`,`${s.enT[3]} — a double-edged trait: strength when used well, trouble when not.`,`${s.enT[4]} — often overlooked, but key in matters of ${p.domainEn}.`]},
 {h:'With Auspicious Stars vs Malefics',ps:[`With Zuo Fu/You Bi — help arrives in ${p.domainEn}; ${s.en}'s energy can land.`,`With Tian Kui/Tian Yue — benefactors appear at key moments; ${p.en} matters resolve.`,`With Wen Chang/Wen Qu — ${s.en} gains strategy and expression.`,`With Qing Yang/Tuo Luo — the process of ${p.domainEn} is harder, with delays or conflict.`,`With Huo Xing/Ling Xing — sudden disruptions; ${p.en} matters get interrupted.`]},
 {h:'Practical Correspondence and Advice',ps:[`If dealing with ${p.en} matters, first check whether the ruling star is bright or fallen.`,`When bright, ${s.enT[0]} is your core advantage; move boldly.`,`When fallen, compensate through conscious choices — the right environment matters more than endurance.`,`Lu or Quan in the ${p.en} brings breakthroughs in ${p.domainEn}; Ke brings reputation; Ji marks a blockage.`,`Remember: ${s.en} in the ${p.en} is not fate but a manual — your factory settings for ${p.domainEn}.`]},
 {h:'Reading Order',ps:[`For ${s.en} in the ${p.en}:`],ol:[`Check the ruling star — it sets the baseline.`,`Check how ${s.en} combines with it — auspicious adds; malefic subtracts.`,`Check triple direction — the ${p.en}'s aspects reveal the full picture.`,`Check transformations — what Lu, Quan, Ke, Ji each activate.`,`Check major and annual cycles — when ${p.en} matters get triggered.`,`Ask yourself: ${p.enQ[0]}? ${p.enQ[1]}? ${p.enQ[2]}?`]}
];}
function sidebar(s,p,isEn){return[
 {href:'ziwei-helper-malice-stars.html',text:isEn?'Assistant & Malefic Stars':'辅曜煞曜'},
 {href:`ziwei-star-${curStarKey}.html`,text:isEn?`${s.en} Star`:`${s.cn}星详解`},
 {href:`ziwei-${curP}.html`,text:isEn?p.en:p.cn},
 {href:'ziwei-sanfang-sizheng.html',text:isEn?'Triple Direction':'先看三方四正'},
 {href:isEn?'../../pages/mingbook-onepage.html':'../pages/mingbook-onepage.html',text:isEn?'Quick Chart':'快速排盘'}
];}
function buildHTML(s,p,isEn,batch,cnTitle,enTitle){
 const sections=isEn?enSections(s,p):cnSections(s,p);
 const title=isEn?enTitle:cnTitle;const catName=isEn?'Assistant & Malefic Stars':'辅煞曜';const slug=`ziwei-${curStarKey}-zai-${curP}`;
 const desc=isEn?`${s.en} in the ${p.en} affects ${p.domainEn}. As ${s.natureEn}, it brings distinct patterns and cautions.`:`${s.cn}在${p.cn}，${p.domain}。${s.cn}是${s.nature}，落在${p.cn}有它独特的表现和需要注意的地方。`;
 const lead=isEn?`${s.en} is ${s.natureEn}. In the ${p.en}, its energy shows up in matters of ${p.domainEn}. ${s.en} keywords are ${s.enT.slice(0,3).join(', ')}, producing concrete patterns in the ${p.en} context.`:`${s.cn}是${s.nature}。落在${p.cn}，它的能量会在${p.domain}这件事上表现出来。${s.cn}的关键词是${s.cnT.slice(0,3).join('、')}，这些特质放到${p.cn}的场景里，会产生具体的现实对应。`;
 const intro2=isEn?`The ${p.en} covers ${p.domainEn}. ${s.en} is ${s.elemEn}, with energy of ${s.enT[0]}. Reading it requires the triple-direction view — with auspicious stars help lands; with malefics twists increase. The positive side: ${s.enT[4]}.`:`${p.cn}看的是${p.domain}。${s.cn}属${s.elem}，能量特质是${s.cnT[0]}。读${s.cn}在${p.cn}不能只看单宫，必须回到三方四正——有吉星会照则助力落地，煞星冲照则波折增多。${s.cn}的正面意义：${s.cnT[4]}。`;
 let sh='';for(const sec of sections){sh+=`\n        <h2>${sec.h}</h2>\n`;for(const x of sec.ps)sh+=`        <p>${x}</p>\n`;if(sec.ol){sh+='        <ol>\n';for(const x of sec.ol)sh+=`          <li>${x}</li>\n`;sh+='        </ol>\n';}}
 let sb='';for(const l of sidebar(s,p,isEn))sb+=`        <a class="card-link" href="${l.href}">${l.text}</a>\n`;
 if(isEn){return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(title)} | Zi Wei Dou Shu</title>
  <meta name="description" content="${jstr(desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/en/${slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${slug}.html">
  <meta property="og:title" content="${jstr(title)}">
  <meta property="og:description" content="${jstr(desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/en/${slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${batch.date}","dateModified":"${batch.date}","inLanguage":"en","articleSection":"Zi Wei Dou Shu","about":["Zi Wei Dou Shu","${catName}","${jstr(title)}"],"author":{"@type":"Organization","name":"YuetianAI"},"publisher":{"@type":"Organization","name":"YuetianAI"},"mainEntityOfPage":"https://yuetianai.com/articles/en/${slug}.html"}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a><nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${slug}.html">Chinese</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${catName}</span></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${batch.date}">${batch.label}</time></span></p>
    </div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sh}
      </article>
      <aside class="side-panel detail-rail" aria-label="Related links"><h2>Read Next</h2>
${sb}      </aside>
    </div>
    <div class="container article-bottom-link"><span>Read this, then compare it against your own chart for clearer insight.</span><a href="../../pages/mingbook-onepage.html">Quick Chart →</a></div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">Yue ICP 2026055337-1</a>　<span>© 2026 YuetianAI. All Rights Reserved. Powered By Yuetian Studio</span>　</div></footer>
</body></html>`;}
 return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(title)} | 学习紫微</title>
  <meta name="description" content="${jstr(desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/${slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${slug}.html">
  <meta property="og:title" content="${jstr(title)}">
  <meta property="og:description" content="${jstr(desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/${slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${batch.date}","dateModified":"${batch.date}","inLanguage":"zh-CN","articleSection":"${catName}","about":["紫微斗数","${catName}","${jstr(title)}"],"author":{"@type":"Organization","name":"阅天AI"},"publisher":{"@type":"Organization","name":"阅天AI"},"mainEntityOfPage":"https://yuetianai.com/articles/${slug}.html"}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"阅天AI","item":"https://yuetianai.com/"},{"@type":"ListItem","position":2,"name":"学习紫微","item":"https://yuetianai.com/articles/"},{"@type":"ListItem","position":3,"name":"${catName}","item":"https://yuetianai.com/articles/ziwei-helper-malice-stars.html"},{"@type":"ListItem","position":4,"name":"${jstr(title)}","item":"https://yuetianai.com/articles/${slug}.html"}]}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a><nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${slug}.html">English</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="ziwei-helper-malice-stars.html">${catName}</a></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>${catName}</span><span><time datetime="${batch.date}">${batch.label}</time></span></p>
    </div><div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sh}
      </article>
      <aside class="side-panel detail-rail" aria-label="本文导航"><h2>继续阅读</h2>
${sb}      </aside>
    </div>
    <div class="container article-bottom-link"><span>读完这篇，回到自己的命盘上对照一遍，会比只看概念更清楚。</span><a href="../pages/mingbook-onepage.html">快速排盘 →</a></div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 阅天AI Copyright, All Rights Reserved. Powered By 阅天工作室</span>　</div></footer>
</body></html>`;
}
function generate(STARS,BATCHES,manifestName){
 const manifest=[];
 for(const batch of BATCHES){let n=0;
  for(const[sk,palaces]of batch.combos){const s=STARS[sk];
   for(const pk of palaces){const p=PALACES[pk];curStarKey=sk;curP=pk;
    const theme=s.th[pk];
    const cnTitle=`${s.cn}在${p.cn}：${theme[0]}`;
    const enTitle=`${s.en} in ${p.en}: ${theme[1]}`;
    const slug=`ziwei-${sk}-zai-${pk}`;
    fs.writeFileSync(path.join(__dirname,'articles',`${slug}.html`),buildHTML(s,p,false,batch,cnTitle,enTitle).replace(/\r\n/g,'\n'),'utf8');
    fs.writeFileSync(path.join(__dirname,'articles','en',`${slug}.html`),buildHTML(s,p,true,batch,cnTitle,enTitle).replace(/\r\n/g,'\n'),'utf8');
    manifest.push({slug,cnTitle,enTitle,date:batch.date,label:batch.label,rfc:batch.rfc,enDesc:`${s.en} in ${p.en}. ${theme[1]}`});
    n++;
   }}
  console.log(`${batch.label}: ${n} articles`);
 }
 fs.writeFileSync(path.join(__dirname,manifestName),JSON.stringify(manifest,null,1),'utf8');
 console.log(`TOTAL: ${manifest.length} articles, ${manifest.length*2} HTML`);
 return manifest;
}
module.exports={PORDER,PALACES,generate};
