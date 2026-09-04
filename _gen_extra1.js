const fs = require('fs');
const path = require('path');
const date = '2026-08-17T16:30:00+08:00';
const pubDate = 'Mon, 17 Aug 2026 08:30:00 +0000';
function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

const a = {
  slug: 'ziwei-enguang-tiangui',
  cnTitle: '紫微斗数恩光天贵：暗贵星，有这两颗星的人容易遇贵人、得荣誉',
  enTitle: 'En Guang and Tian Gui: The Hidden Nobility Stars',
  cnDesc: '恩光天贵是暗贵星，主贵人、荣誉和间接的帮助。命宫有这两颗星的人，一生中容易在关键时刻遇到提携你的人，但这种帮助往往不是明面上的。',
  enDesc: 'En Guang and Tian Gui are hidden nobility stars, ruling benefactors, honors, and indirect help. People with them meet mentors at critical moments, but the help often comes quietly.',
  cnLead: '恩光天贵是紫微斗数里最「低调」的贵星。天魁天钺是明面上的贵人——你一眼就能看出谁在帮你；恩光天贵是暗地里的贵人——帮了你的人可能你自己都没意识到，或者帮助以一种你意想不到的方式出现。命宫有恩光天贵的人，一生中总有「逢凶化吉」的运气，但你要学会回头看，才会发现那些曾经拉过你一把的人。',
  cnIntro2: '恩光属阳火，天贵属阳土（一说恩光属金）。恩光主「恩惠」和「提携」，天贵主「尊贵」和「荣誉」。两颗星永远在三合相会。恩光天贵跟天魁天钺不同：魁钺是直接的、明显的贵人；恩光天贵是间接的、隐藏的贵人，可能是一个不经意的推荐、一句关键的话、或者一个你没放在心上的机会。',
  cnSections: [
    { h: '恩光和天贵的区别', ps: [
      '恩光偏「恩惠」——别人对你好、给你机会、在你需要的时候拉你一把。恩光入命的人，一生中容易遇到愿意帮你的人，但这种帮助往往不是大张旗鼓的，而是润物细无声的。',
      '天贵偏「尊贵」和「荣誉」——你容易获得别人的尊重和认可，可能是名声、头衔、或者社会地位。天贵入命的人，即使不刻意追求，也容易在群体中被高看一眼。',
      '两颗都有最好——既有贵人提携，又有荣誉加身。但这种贵气是「暗」的，不像紫微三台那样张扬，需要时间才能显现。'
    ]},
    { h: '暗贵和明贵的区别', ps: [
      '天魁天钺是「明贵」——贵人就在你面前，帮你是明明白白的。你知道谁是你的贵人，你也知道他帮了你什么。',
      '恩光天贵是「暗贵」——贵人可能藏在你身边，你当时没察觉，事后回想才发现「原来那件事是他帮的」。或者帮助以间接的方式出现——一个朋友随口提的一个名字，后来成了你的重要客户。',
      '暗贵的好处是不容易被人嫉妒——因为别人也没注意到你得到了帮助。坏处是你自己可能不懂得感恩，因为你没意识到那是别人的恩惠。'
    ]},
    { h: '在十二宫的含义', ps: [
      '命宫：一生有暗贵人相助、容易获得荣誉和尊重。但要学会察觉和感恩。',
      '官禄宫：工作中容易遇到提携你的上司或前辈、容易获得行业认可。适合在大机构或有师承的行业发展。',
      '迁移宫：在外遇贵人、出门有帮助、适合离开家乡发展。',
      '财帛宫：容易得到别人的投资或资助、或者通过人脉获得财富机会。',
      '夫妻宫：配偶可能是你的贵人、或者婚姻带来地位和荣誉的提升。'
    ]},
    { h: '恩光天贵和其他星的配合', ps: [
      '恩光天贵加天魁天钺叫「明贵暗贵齐聚」——贵人运极旺，明里暗里都有人帮。这是最好的贵人配置。',
      '恩光天贵加化科叫「贵科相逢」——容易通过学术或专业获得名声和荣誉，适合走专家路线。',
      '恩光天贵加左辅右弼——贵人不仅帮你，还愿意长期追随你，你的团队会越来越强。',
      '恩光天贵加煞星——贵人来得快去得也快，或者帮助附带条件。要注意分辨真心帮你的人和利用你的人。'
    ]},
    { h: '排盘后的使用顺序', ps: ['看到恩光天贵，按这个顺序读：'], ol: [
      '先看在哪个宫位——官禄宫和迁移宫最好。',
      '看有没有天魁天钺——明贵暗贵齐聚，贵人运最强。',
      '看有没有化科——贵科相逢，适合走专业和学术路线。',
      '看有没有煞星——煞星会让贵人帮助打折扣或附带条件。',
      '回头看自己的经历——有没有一些「当时没在意，后来发现很重要」的人和事？那就是恩光天贵在起作用。',
      '问自己：你有没有对那些暗中帮过你的人说过谢谢？'
    ]}
  ],
  cnSidebar: [
    { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
    { href: 'ziwei-tiankui-tianyue.html', text: '天魁天钺' },
    { href: 'ziwei-zuofu-youbi.html', text: '左辅右弼' },
    { href: 'ziwei-santai-bazuo.html', text: '三台八座' },
    { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
    { href: 'ziwei-learning-path.html', text: '看盘入门' }
  ],
  enLead: 'En Guang and Tian Gui are the most low-key nobility stars. Tian Kui/Tian Yue are obvious benefactors — you can see who\'s helping you. En Guang/Tian Gui are hidden benefactors — the person who helped you may be someone you didn\'t even notice, or the help came in a way you never expected. People with them in Life always have "turning misfortune into blessing" luck, but you have to look back to see who pulled you up.',
  enIntro2: 'En Guang is Yang Fire, Tian Gui is Yang Earth (some say En Guang is Metal). En Guang rules favors and mentorship; Tian Gui rules dignity and honor. They always meet in triple combination. Unlike Kui/Yue\'s direct, obvious help, En Guang/Tian Gui\'s help is indirect and hidden — a casual recommendation, a key word, an opportunity you didn\'t take seriously at the time.',
  enSections: [
    { h: 'The Difference', ps: [
      'En Guang leans toward favors — people are kind to you, give you opportunities, pull you up when you need it. The help is usually quiet, not grandstanding.',
      'Tian Gui leans toward dignity and honor — you easily gain respect and recognition, whether fame, titles, or social standing. People look up to you even if you don\'t seek it.',
      'Both together is best — mentorship plus honor. But this nobility is "hidden," not flashy like Zi Wei/San Tai, and takes time to show.'
    ]},
    { h: 'Hidden vs Obvious Nobility', ps: [
      'Kui/Yue are "obvious nobility" — the benefactor is right in front of you, the help is clear. You know who helped and how.',
      'En Guang/Tian Gui are "hidden nobility" — the benefactor may be beside you, unnoticed at the time, and you realize later "so that was their doing." Or help comes indirectly — a name a friend mentioned offhand becomes your biggest client.',
      'The advantage of hidden nobility: less jealousy, because no one noticed you got help. The disadvantage: you may not feel grateful, because you didn\'t realize it was a favor.'
    ]},
    { h: 'Across the Twelve Palaces', ps: [
      'Life: hidden benefactors throughout life, easy to gain honor and respect. Learn to notice and be grateful.',
      'Career: mentors and seniors at work, easy industry recognition. Suited to large institutions or mentorship-based fields.',
      'Travel: benefactors away from home, help when going out, suited to leaving hometown.',
      'Wealth: easy to get investment or funding, or wealth opportunities through connections.',
      'Spouse: partner may be your benefactor, or marriage brings status and honor.'
    ]},
    { h: 'Combinations', ps: [
      'With Kui/Yue: "both obvious and hidden nobility" — strongest benefactor luck, help from all directions. The best configuration.',
      'With Hua Ke: "nobility and recognition meet" — gain fame through academia or expertise, suited to specialist paths.',
      'With Zuo Fu/You Bi: benefactors not only help but stay loyal, your team grows stronger.',
      'With malefics: benefactors come and go quickly, or help comes with strings attached. Distinguish genuine help from exploitation.'
    ]},
    { h: 'Reading Order After You Cast the Chart', ps: ['When you see En Guang/Tian Gui:'], ol: [
      'Which palace — Career and Travel are best.',
      'Check Kui/Yue — both obvious and hidden nobility gives strongest benefactor luck.',
      'Check Hua Ke — nobility-recognition suits specialist and academic paths.',
      'Check malefics — they reduce benefactor help or attach conditions.',
      'Look back at your life — any people or events you didn\'t value at the time but later proved important? That\'s En Guang/Tian Gui at work.',
      'Have you thanked the people who quietly helped you?'
    ]}
  ],
  enSidebar: [
    { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
    { href: 'ziwei-tiankui-tianyue.html', text: 'Tian Kui & Tian Yue' },
    { href: 'ziwei-zuofu-youbi.html', text: 'Zuo Fu & You Bi' },
    { href: 'ziwei-santai-bazuo.html', text: 'San Tai & Ba Zuo' },
    { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
    { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
  ]
};

function buildHTML(a, isEn) {
  const catPage = 'ziwei-helper-malice-stars.html';
  const cnCatName = '辅曜煞曜';
  const enCatName = 'Helper & Malice Stars';
  const cnTag = '辅煞曜';
  const enTag = 'Helper Stars';
  const sections = isEn ? a.enSections : a.cnSections;
  const sidebar = isEn ? a.enSidebar : a.cnSidebar;
  const lead = isEn ? a.enLead : a.cnLead;
  const intro2 = isEn ? a.enIntro2 : a.cnIntro2;
  const title = isEn ? a.enTitle : a.cnTitle;
  const desc = isEn ? a.enDesc : a.cnDesc;

  let sectionsHtml = '';
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    sectionsHtml += `\n        <h2 id="section-${i + 1}">${s.h}</h2>\n`;
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
  "about": ["Zi Wei Dou Shu", "Helper and Malice Stars", "${jstr(title)}"],
  "author": {"@type": "Organization", "name": "YuetianAI"},
  "publisher": {"@type": "Organization", "name": "YuetianAI"},
  "mainEntityOfPage": "https://yuetianai.com/articles/en/${a.slug}.html"
}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a>
      <nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${a.slug}.html">Chinese</a></nav>
    </div>
  </header>
  <main class="article-shell article-detail">
    <section class="detail-hero">
      <div class="container detail-hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${enCatName}</span></nav>
          <h1>${title}</h1>
          <p class="detail-subtitle">${desc}</p>
          <p class="article-meta"><span>${enTag}</span><span><time datetime="${date}">2026-08-17 16:30</time></span></p>
        </div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="Article navigation">
        <h2>Read Next</h2>
${sidebarHtml}      </aside>
    </div>
    <div class="container article-bottom-link">
      <span>After reading, compare it with your own chart \u2014 it makes more sense than concepts alone.</span>
      <a href="../../pages/mingbook-onepage.html">Quick Chart →</a>
    </div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">Yue ICP 2026055337-1</a>　<span>© 2026 YuetianAI. All Rights Reserved. Powered By Yuetian Studio</span>　</div></footer>
</body>
</html>`;
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
  "articleSection": "辅煞曜",
  "about": ["紫微斗数", "辅曜煞曜", "${jstr(title)}"],
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
    {"@type": "ListItem", "position": 3, "name": "${cnCatName}", "item": "https://yuetianai.com/articles/${catPage}"},
    {"@type": "ListItem", "position": 4, "name": "${jstr(title)}", "item": "https://yuetianai.com/articles/${a.slug}.html"}
  ]
}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a>
      <nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${a.slug}.html">English</a></nav>
    </div>
  </header>
  <main class="article-shell article-detail">
    <section class="detail-hero">
      <div class="container detail-hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="${catPage}">${cnCatName}</a></nav>
          <h1>${title}</h1>
          <p class="detail-subtitle">${desc}</p>
          <p class="article-meta"><span>${cnTag}</span><span><time datetime="${date}">2026-08-17 16:30</time></span></p>
        </div>
        <div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="本文导航">
        <h2>继续阅读</h2>
${sidebarHtml}      </aside>
    </div>
    <div class="container article-bottom-link">
      <span>读完这篇，回到自己的命盘上对照一遍，会比只看概念更清楚。</span>
      <a href="../pages/mingbook-onepage.html">快速排盘 →</a>
    </div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 阅天AI Copyright, All Rights Reserved. Powered By 阅天工作室</span>　</div></footer>
</body>
</html>`;
}

// Generate files
fs.writeFileSync(path.join(__dirname, 'articles', `${a.slug}.html`), buildHTML(a, false).replace(/\r\n/g, '\n'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'articles', 'en', `${a.slug}.html`), buildHTML(a, true).replace(/\r\n/g, '\n'), 'utf8');
console.log('Created article files');

// Helper: renumber data-index
function renum(html) {
  let n = 0;
  return html.replace(/data-index="(XX|\d+)"/g, () => { n++; return 'data-index="' + String(n).padStart(2, '0') + '"'; });
}

// CN Index - insert into 辅煞曜 section
let cnIdx = fs.readFileSync(path.join(__dirname, 'articles', 'index.html'), 'utf8');
{
  const sectionIdx = cnIdx.indexOf('<h2>辅煞曜</h2>');
  const listStart = cnIdx.indexOf('<div class="article-list">', sectionIdx);
  const insertPos = listStart + '<div class="article-list">'.length;
  const card = `\n          <article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">辅煞曜</span><span><time datetime="${date}">2026-08-17 16:30</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>\n`;
  cnIdx = cnIdx.slice(0, insertPos) + card + cnIdx.slice(insertPos);
  // update count
  const countMatch = cnIdx.slice(sectionIdx, sectionIdx + 500).match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    cnIdx = cnIdx.slice(0, sectionIdx) + cnIdx.slice(sectionIdx).replace(countMatch[0], `<span>${oldCount + 1} 篇</span>`);
  }
  cnIdx = renum(cnIdx);
  // JSON-LD ItemList
  const itemListIdx = cnIdx.indexOf('"@type": "ItemList"');
  const arrStart = cnIdx.indexOf('[', itemListIdx);
  const arrInsertPos = arrStart + 1;
  const jsonItem = `
    {
      "@type": "ListItem",
      "position": 0,
      "url": "https://yuetianai.com/articles/${a.slug}.html",
      "name": "${jstr(a.cnTitle)}"
    },`;
  cnIdx = cnIdx.slice(0, arrInsertPos) + jsonItem + cnIdx.slice(arrInsertPos);
  let pos = 0;
  const firstArrEnd = cnIdx.indexOf(']', arrInsertPos);
  const beforeArr = cnIdx.slice(0, arrInsertPos);
  const arrContent = cnIdx.slice(arrInsertPos, firstArrEnd);
  const afterArr = cnIdx.slice(firstArrEnd);
  cnIdx = beforeArr + arrContent.replace(/"position":\s*\d+/g, () => { pos++; return `"position": ${pos}`; }) + afterArr;
}
fs.writeFileSync(path.join(__dirname, 'articles', 'index.html'), cnIdx.replace(/\r\n/g, '\n'), 'utf8');
console.log('Updated CN index');

// EN Index
let enIdx = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'index.html'), 'utf8');
{
  const firstCardIdx = enIdx.indexOf('<article class="article-card"');
  const card = `<article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Helper Stars</span><span>Bilingual</span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read more</a>
            </div>
          </article>
          `;
  enIdx = enIdx.slice(0, firstCardIdx) + card + enIdx.slice(firstCardIdx);
  enIdx = renum(enIdx);
  const countMatch = enIdx.match(/(\d+)\s*articles/);
  if (countMatch) enIdx = enIdx.replace(countMatch[0], (parseInt(countMatch[1]) + 1) + ' articles');
  const itemListIdx = enIdx.indexOf('"@type": "ItemList"');
  const arrStart = enIdx.indexOf('[', itemListIdx);
  const arrInsertPos = arrStart + 1;
  const jsonItem = `
      {
        "@type": "ListItem",
        "position": 0,
        "url": "https://yuetianai.com/articles/en/${a.slug}.html",
        "name": "${jstr(a.enTitle)}"
      },`;
  enIdx = enIdx.slice(0, arrInsertPos) + jsonItem + enIdx.slice(arrInsertPos);
  let pos = 0;
  const firstArrEnd = enIdx.indexOf(']', arrInsertPos);
  const beforeArr = enIdx.slice(0, arrInsertPos);
  const arrContent = enIdx.slice(arrInsertPos, firstArrEnd);
  const afterArr = enIdx.slice(firstArrEnd);
  enIdx = beforeArr + arrContent.replace(/"position":\s*\d+/g, () => { pos++; return `"position": ${pos}`; }) + afterArr;
}
fs.writeFileSync(path.join(__dirname, 'articles', 'en', 'index.html'), enIdx.replace(/\r\n/g, '\n'), 'utf8');
console.log('Updated EN index');

// Topic page
let topic = fs.readFileSync(path.join(__dirname, 'articles', 'ziwei-helper-malice-stars.html'), 'utf8');
{
  const firstCardIdx = topic.indexOf('<article class="article-card"');
  const card = `<article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">辅煞曜</span><span><time datetime="${date}">${date}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
          `;
  topic = topic.slice(0, firstCardIdx) + card + topic.slice(firstCardIdx);
  topic = renum(topic);
  const itemListIdx = topic.indexOf('"@type": "ItemList"');
  const arrStart = topic.indexOf('[', itemListIdx);
  const arrInsertPos = arrStart + 1;
  const jsonItem = `
    {
      "@type": "ListItem",
      "position": 0,
      "url": "https://yuetianai.com/articles/${a.slug}.html",
      "name": "${jstr(a.cnTitle)}"
    },`;
  topic = topic.slice(0, arrInsertPos) + jsonItem + topic.slice(arrInsertPos);
  let pos = 0;
  const firstArrEnd = topic.indexOf(']', arrInsertPos);
  const beforeArr = topic.slice(0, arrInsertPos);
  const arrContent = topic.slice(arrInsertPos, firstArrEnd);
  const afterArr = topic.slice(firstArrEnd);
  topic = beforeArr + arrContent.replace(/"position":\s*\d+/g, () => { pos++; return `"position": ${pos}`; }) + afterArr;
}
fs.writeFileSync(path.join(__dirname, 'articles', 'ziwei-helper-malice-stars.html'), topic.replace(/\r\n/g, '\n'), 'utf8');
console.log('Updated topic page');

// CN Feed
let cnFeed = fs.readFileSync(path.join(__dirname, 'feed.xml'), 'utf8');
{
  cnFeed = cnFeed.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);
  const item = `    <item>
      <title>${a.cnTitle}</title>
      <link>https://yuetianai.com/articles/${a.slug}.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid>
      <description><![CDATA[${a.cnDesc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  const firstItem = cnFeed.indexOf('<item>');
  cnFeed = cnFeed.slice(0, firstItem) + item + cnFeed.slice(firstItem);
  const itemCount = (cnFeed.match(/<item>/g) || []).length;
  if (itemCount > 80) {
    const lastItemStart = cnFeed.lastIndexOf('    <item>');
    const lastItemEnd = cnFeed.indexOf('</item>', lastItemStart) + '</item>'.length;
    let end = lastItemEnd;
    if (cnFeed[end] === '\n') end++;
    cnFeed = cnFeed.slice(0, lastItemStart) + cnFeed.slice(end);
  }
}
fs.writeFileSync(path.join(__dirname, 'feed.xml'), cnFeed.trimEnd() + '\n', 'utf8');
console.log('Updated CN feed');

// EN Feed
let enFeed = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'feed.xml'), 'utf8');
{
  enFeed = enFeed.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);
  const item = `    <item>
      <title>${a.enTitle}</title>
      <link>https://yuetianai.com/articles/en/${a.slug}.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid>
      <description><![CDATA[${a.enDesc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  const firstItem = enFeed.indexOf('<item>');
  enFeed = enFeed.slice(0, firstItem) + item + enFeed.slice(firstItem);
  const itemCount = (enFeed.match(/<item>/g) || []).length;
  if (itemCount > 80) {
    const lastItemStart = enFeed.lastIndexOf('    <item>');
    const lastItemEnd = enFeed.indexOf('</item>', lastItemStart) + '</item>'.length;
    let end = lastItemEnd;
    if (enFeed[end] === '\n') end++;
    enFeed = enFeed.slice(0, lastItemStart) + enFeed.slice(end);
  }
}
fs.writeFileSync(path.join(__dirname, 'articles', 'en', 'feed.xml'), enFeed.trimEnd() + '\n', 'utf8');
console.log('Updated EN feed');

// CN Sitemap
let cnSm = fs.readFileSync(path.join(__dirname, 'sitemap-articles.xml'), 'utf8');
cnSm = cnSm.replace('</urlset>', `  <url>
    <loc>https://yuetianai.com/articles/${a.slug}.html</loc>
    <lastmod>2026-08-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`);
fs.writeFileSync(path.join(__dirname, 'sitemap-articles.xml'), cnSm.trimEnd() + '\n', 'utf8');
console.log('Updated CN sitemap');

// EN Sitemap
let enSm = fs.readFileSync(path.join(__dirname, 'sitemap-en.xml'), 'utf8');
enSm = enSm.replace('</urlset>', `  <url>
    <loc>https://yuetianai.com/articles/en/${a.slug}.html</loc>
    <lastmod>2026-08-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`);
fs.writeFileSync(path.join(__dirname, 'sitemap-en.xml'), enSm.trimEnd() + '\n', 'utf8');
console.log('Updated EN sitemap');

console.log('ALL DONE');
