const fs=require('fs'),path=require('path');
function jstr(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"');}

// cat meta: CN index section h2, tag label, topic listing page (or null), EN label
const CAT={
 rumen:{sec:'看盘方法',tag:'看盘方法',topic:'ziwei-learning-path.html',enTag:'Reading Method'},
 kanpan:{sec:'看盘方法',tag:'看盘方法',topic:'ziwei-learning-path.html',enTag:'Reading Method'},
 faq:{sec:'看盘方法',tag:'看盘方法',topic:'ziwei-learning-path.html',enTag:'FAQ'},
 sihua:{sec:'四化细读',tag:'四化细读',topic:'ziwei-sihua.html',enTag:'Four Transformations'},
 geju:{sec:'格局命例',tag:'格局命例',topic:'ziwei-case-patterns.html',enTag:'Patterns'},
 zhuxing:{sec:'主星',tag:'主星',topic:'ziwei-main-stars.html',enTag:'Major Stars'},
 liunian:{sec:'大限流年',tag:'大限流年',topic:null,enTag:'Cycles'},
 yingyong:{sec:'财运事业',tag:'财运事业',topic:null,enTag:'Wealth & Career'}
};

function buildCN(t,batch){
 const cat=CAT[t.cat];
 const slug=t.slug;
 let body=`        <p class="article-lead">${t.cn.lead}</p>\n`;
 body+=`        <h2 id="section-1">这个问题到底在问什么</h2>\n        <p>${t.cn.ask}</p>\n`;
 body+=`        <h2 id="section-2">底层逻辑：先把道理讲清楚</h2>\n`;
 t.cn.logic.forEach(p=>body+=`        <p>${p}</p>\n`);
 body+=`        <h2 id="section-3">拿到盘分几步看</h2>\n        <ol>\n`;
 t.cn.steps.forEach(s=>body+=`          <li>${s}</li>\n`);
 body+=`        </ol>\n`;
 body+=`        <h2 id="section-4">三个最常见的误区</h2>\n`;
 t.cn.mistakes.forEach((m,i)=>body+=`        <p><strong>误区${['一','二','三'][i]}：</strong>${m}</p>\n`);
 body+=`        <h2 id="section-5">回到自己的命盘</h2>\n        <p>${t.cn.close}</p>\n`;
 body+=`        <h2 id="section-6">排盘使用顺序</h2>\n        <ol>\n`;
 t.cn.order.forEach(s=>body+=`          <li>${s}</li>\n`);
 body+=`        </ol>\n`;
 const sb=[
  {h:'ziwei-learning-path.html',x:'学习路径总览'},
  {h:cat.topic||'index.html',x:cat.sec+'专题'},
  {h:'ziwei-sanfang-sizheng.html',x:'先看三方四正'},
  {h:'../pages/mingbook-onepage.html',x:'快速排盘'}
 ];
 let sbh='';sb.forEach(l=>sbh+=`        <a class="card-link" href="${l.h}">${l.x}</a>\n`);
 return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(t.cnTitle)} | 学习紫微</title>
  <meta name="description" content="${jstr(t.cn.desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/${slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${slug}.html">
  <meta property="og:title" content="${jstr(t.cnTitle)}">
  <meta property="og:description" content="${jstr(t.cn.desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/${slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(t.cnTitle)}","description":"${jstr(t.cn.desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${batch.date}","dateModified":"${batch.date}","inLanguage":"zh-CN","articleSection":"${cat.tag}","about":["紫微斗数","${cat.tag}","${jstr(t.cnTitle)}"],"author":{"@type":"Organization","name":"阅天AI"},"publisher":{"@type":"Organization","name":"阅天AI"},"mainEntityOfPage":"https://yuetianai.com/articles/${slug}.html"}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"阅天AI","item":"https://yuetianai.com/"},{"@type":"ListItem","position":2,"name":"学习紫微","item":"https://yuetianai.com/articles/"},{"@type":"ListItem","position":3,"name":"${cat.tag}","item":"https://yuetianai.com/articles/${cat.topic||'index.html'}"},{"@type":"ListItem","position":4,"name":"${jstr(t.cnTitle)}","item":"https://yuetianai.com/articles/${slug}.html"}]}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a><nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${slug}.html">English</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="${cat.topic||'index.html'}">${cat.sec}</a></nav>
      <h1>${t.cnTitle}</h1><p class="detail-subtitle">${t.cn.desc}</p>
      <p class="article-meta"><span>${cat.tag}</span><span><time datetime="${batch.date}">${batch.label}</time></span></p>
    </div><div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
${body}      </article>
      <aside class="side-panel detail-rail" aria-label="本文导航"><h2>继续阅读</h2>
${sbh}      </aside>
    </div>
    <div class="container article-bottom-link"><span>读完这篇，回到自己的命盘上对照一遍，会比只看概念更清楚。</span><a href="../pages/mingbook-onepage.html">快速排盘 →</a></div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 阅天AI Copyright, All Rights Reserved. Powered By 阅天工作室</span>　</div></footer>
</body></html>`;
}

function buildEN(t,batch){
 const cat=CAT[t.cat];const slug=t.slug;
 let body=`        <p class="article-lead">${t.en.lead}</p>\n`;
 body+=`        <h2 id="section-1">What This Question Is Really Asking</h2>\n        <p>${t.en.ask}</p>\n`;
 body+=`        <h2 id="section-2">The Underlying Logic</h2>\n`;
 t.en.logic.forEach(p=>body+=`        <p>${p}</p>\n`);
 body+=`        <h2 id="section-3">A Step-by-Step Way to Read It</h2>\n        <ol>\n`;
 t.en.steps.forEach(s=>body+=`          <li>${s}</li>\n`);
 body+=`        </ol>\n`;
 body+=`        <h2 id="section-4">Three Common Mistakes</h2>\n`;
 t.en.mistakes.forEach((m,i)=>body+=`        <p><strong>Mistake ${i+1}:</strong> ${m}</p>\n`);
 body+=`        <h2 id="section-5">Back to Your Own Chart</h2>\n        <p>${t.en.close}</p>\n`;
 body+=`        <h2 id="section-6">Reading Order</h2>\n        <ol>\n`;
 t.en.order.forEach(s=>body+=`          <li>${s}</li>\n`);
 body+=`        </ol>\n`;
 const sb=[
  {h:'ziwei-learning-path.html',x:'Learning Path'},
  {h:cat.topic||'index.html',x:cat.enTag},
  {h:'ziwei-sanfang-sizheng.html',x:'Triple Direction'},
  {h:'../../pages/mingbook-onepage.html',x:'Quick Chart'}
 ];
 let sbh='';sb.forEach(l=>sbh+=`        <a class="card-link" href="${l.h}">${l.x}</a>\n`);
 return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(t.enTitle)} | Zi Wei Dou Shu</title>
  <meta name="description" content="${jstr(t.en.desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/en/${slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${slug}.html">
  <meta property="og:title" content="${jstr(t.enTitle)}">
  <meta property="og:description" content="${jstr(t.en.desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/en/${slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(t.enTitle)}","description":"${jstr(t.en.desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${batch.date}","dateModified":"${batch.date}","inLanguage":"en","articleSection":"Zi Wei Dou Shu","about":["Zi Wei Dou Shu","${cat.enTag}","${jstr(t.enTitle)}"],"author":{"@type":"Organization","name":"YuetianAI"},"publisher":{"@type":"Organization","name":"YuetianAI"},"mainEntityOfPage":"https://yuetianai.com/articles/en/${slug}.html"}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a><nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${slug}.html">Chinese</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${cat.enTag}</span></nav>
      <h1>${t.enTitle}</h1><p class="detail-subtitle">${t.en.desc}</p>
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${batch.date}">${batch.label}</time></span></p>
    </div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
${body}      </article>
      <aside class="side-panel detail-rail" aria-label="Related links"><h2>Read Next</h2>
${sbh}      </aside>
    </div>
    <div class="container article-bottom-link"><span>Read this, then compare it against your own chart for clearer insight.</span><a href="../../pages/mingbook-onepage.html">Quick Chart →</a></div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">Yue ICP 2026055337-1</a>　<span>© 2026 YuetianAI. All Rights Reserved. Powered By Yuetian Studio</span>　</div></footer>
</body></html>`;
}

function generate(topics,batch,manifestName){
 const manifest=[];
 for(const t of topics){
  fs.writeFileSync(path.join(__dirname,'articles',`${t.slug}.html`),buildCN(t,batch).replace(/\r\n/g,'\n'),'utf8');
  fs.writeFileSync(path.join(__dirname,'articles','en',`${t.slug}.html`),buildEN(t,batch).replace(/\r\n/g,'\n'),'utf8');
  manifest.push({slug:t.slug,cnTitle:t.cnTitle,enTitle:t.enTitle,cat:t.cat,
   date:batch.date,label:batch.label,rfc:batch.rfc,enDesc:t.en.desc,cnDesc:t.cn.desc});
 }
 fs.writeFileSync(path.join(__dirname,manifestName),JSON.stringify(manifest,null,1),'utf8');
 console.log(`TOTAL ${manifest.length} topics, ${manifest.length*2} HTML`);
 const by={};manifest.forEach(m=>by[m.cat]=(by[m.cat]||0)+1);
 console.log(by);
 return manifest;
}
module.exports={CAT,generate};
