const fs = require('fs');
const date = '2026-08-24T11:00:00+08:00';

const articles = [
  {slug:'ziwei-hualu-zai-minggong', cnTitle:'化禄在命宫：天生带缘的人，机会总比别人多一点', enTitle:'Hua Lu in Life Palace: Born with Good Karma', enDesc:'Hua Lu in Life means opportunities come more easily through natural affinity.'},
  {slug:'ziwei-hualu-zai-xiongdigong', cnTitle:'化禄在兄弟宫：兄弟姐妹有财缘，资金周转有人帮', enTitle:'Hua Lu in Siblings Palace: Siblings Bring Financial Luck', enDesc:'Hua Lu in Siblings means siblings bring financial luck and help with cash flow.'},
  {slug:'ziwei-hualu-zai-fuqigong', cnTitle:'化禄在夫妻宫：感情里有甜也有腻，伴侣缘深但要防依赖', enTitle:'Hua Lu in Spouse Palace: Sweet but Clingy Love', enDesc:'Hua Lu in Spouse means deep partner bond but watch dependency.'},
  {slug:'ziwei-hualu-zai-zinvgong', cnTitle:'化禄在子女宫：孩子是你的福星，创造力也容易变现', enTitle:'Hua Lu in Children Palace: Children Are Lucky Stars', enDesc:'Hua Lu in Children means children are lucky and creativity monetizes.'},
  {slug:'ziwei-hualu-zai-caibogong', cnTitle:'化禄在财帛宫：财源广但不一定存得住，会赚也要会守', enTitle:'Hua Lu in Wealth Palace: Many Income Streams', enDesc:'Hua Lu in Wealth means many income streams but must also save.'},
  {slug:'ziwei-hualu-zai-jiegong', cnTitle:'化禄在疾厄宫：体质偏壮实，但要防富贵病和饮食过量', enTitle:'Hua Lu in Health Palace: Sturdy Constitution', enDesc:'Hua Lu in Health means sturdy constitution but watch lifestyle diseases.'},
  {slug:'ziwei-hualu-zai-qianyi', cnTitle:'化禄在迁移宫：出门遇贵人，在外发展比在家顺', enTitle:'Hua Lu in Travel Palace: Benefactors Outside', enDesc:'Hua Lu in Travel means benefactors outside and smoother development away.'},
  {slug:'ziwei-hualu-zai-puyigong', cnTitle:'化禄在仆役宫：朋友多财路广，但要防酒肉朋友', enTitle:'Hua Lu in Friends Palace: Friends Bring Money Paths', enDesc:'Hua Lu in Friends means friends bring money paths; beware fair-weather ones.'},
  {slug:'ziwei-hualu-zai-guanlugong', cnTitle:'化禄在官禄宫：事业顺缘多，适合跟人打交道的工作', enTitle:'Hua Lu in Career Palace: Smooth Career Luck', enDesc:'Hua Lu in Career means smooth luck suited to people-facing work.'},
  {slug:'ziwei-hualu-zai-tianzhaigong', cnTitle:'化禄在田宅宫：家产运好，居家环境舒适', enTitle:'Hua Lu in Property Palace: Good Property Luck', enDesc:'Hua Lu in Property means good property luck and comfortable home.'},
  {slug:'ziwei-hualu-zai-fudegong', cnTitle:'化禄在福德宫：福气厚、心态好，但容易安于现状', enTitle:'Hua Lu in Fortune Palace: Deep Blessings', enDesc:'Hua Lu in Fortune means deep blessings and good mindset but complacency risk.'},
  {slug:'ziwei-hualu-zai-fumugong', cnTitle:'化禄在父母宫：父母有荫庇，文书学历运顺', enTitle:'Hua Lu in Parents Palace: Parental Shelter', enDesc:'Hua Lu in Parents means parental shelter and smooth education luck.'},
  {slug:'ziwei-huaquan-zai-minggong', cnTitle:'化权在命宫：天生的主导者，掌控欲强但能扛事', enTitle:'Hua Quan in Life Palace: A Born Leader', enDesc:'Hua Quan in Life means a born leader with strong control drive.'},
  {slug:'ziwei-huaquan-zai-xiongdigong', cnTitle:'化权在兄弟宫：兄弟姐妹中有强势者，资金周转靠魄力', enTitle:'Hua Quan in Siblings Palace: A Strong-Willed Sibling', enDesc:'Hua Quan in Siblings means a strong-willed sibling and bold cash flow.'},
  {slug:'ziwei-huaquan-zai-fuqigong', cnTitle:'化权在夫妻宫：伴侣强势有能力，感情里有权力博弈', enTitle:'Hua Quan in Spouse Palace: A Capable, Strong Partner', enDesc:'Hua Quan in Spouse means a capable partner with power dynamics.'},
  {slug:'ziwei-huaquan-zai-zinvgong', cnTitle:'化权在子女宫：孩子好胜独立，教育上要给主导权', enTitle:'Hua Quan in Children Palace: Competitive Children', enDesc:'Hua Quan in Children means competitive children; give them leadership.'},
  {slug:'ziwei-huaquan-zai-caibogong', cnTitle:'化权在财帛宫：赚钱有冲劲，适合竞争性强的行业', enTitle:'Hua Quan in Wealth Palace: Aggressive Earning', enDesc:'Hua Quan in Wealth means aggressive earning in competitive fields.'},
  {slug:'ziwei-huaquan-zai-jiegong', cnTitle:'化权在疾厄宫：注意外伤和急性炎症，运动要适度', enTitle:'Hua Quan in Health Palace: Watch Injuries', enDesc:'Hua Quan in Health means watch injuries and acute inflammation.'},
  {slug:'ziwei-huaquan-zai-qianyi', cnTitle:'化权在迁移宫：在外敢闯敢拼，离乡能掌权', enTitle:'Hua Quan in Travel Palace: Bold Outside', enDesc:'Hua Quan in Travel means boldness outside and gaining power away.'},
  {slug:'ziwei-huaquan-zai-puyigong', cnTitle:'化权在仆役宫：朋友中你是老大，但要防被架空', enTitle:'Hua Quan in Friends Palace: You Lead Among Friends', enDesc:'Hua Quan in Friends means you lead; beware being sidelined.'},
  {slug:'ziwei-huaquan-zai-guanlugong', cnTitle:'化权在官禄宫：职场上有实权，适合管理岗位', enTitle:'Hua Quan in Career Palace: Real Authority at Work', enDesc:'Hua Quan in Career means real authority suited to management.'},
  {slug:'ziwei-huaquan-zai-tianzhaigong', cnTitle:'化权在田宅宫：家里你说了算，房产买卖有魄力', enTitle:'Hua Quan in Property Palace: You Call the Shots at Home', enDesc:'Hua Quan in Property means you decide and bold property moves.'},
  {slug:'ziwei-huaquan-zai-fudegong', cnTitle:'化权在福德宫：精神上闲不住，总要找点事做', enTitle:'Hua Quan in Fortune Palace: Cannot Sit Still', enDesc:'Hua Quan in Fortune means always needing something to do.'},
  {slug:'ziwei-huaquan-zai-fumugong', cnTitle:'化权在父母宫：父母管教严，长辈中有掌权者', enTitle:'Hua Quan in Parents Palace: Strict Parents', enDesc:'Hua Quan in Parents means strict parents and authority figures.'},
  {slug:'ziwei-huake-zai-minggong', cnTitle:'化科在命宫：名声好、贵人多，靠口碑吃饭', enTitle:'Hua Ke in Life Palace: Good Reputation', enDesc:'Hua Ke in Life means good reputation and many benefactors.'},
  {slug:'ziwei-huake-zai-xiongdigong', cnTitle:'化科在兄弟宫：兄弟姐妹中有读书人，资金周转靠信用', enTitle:'Hua Ke in Siblings Palace: A Scholarly Sibling', enDesc:'Hua Ke in Siblings means a scholarly sibling and credit-based cash flow.'},
  {slug:'ziwei-huake-zai-fuqigong', cnTitle:'化科在夫妻宫：伴侣有学识有气质，感情体面', enTitle:'Hua Ke in Spouse Palace: An Educated Partner', enDesc:'Hua Ke in Spouse means an educated, elegant partner.'},
  {slug:'ziwei-huake-zai-zinvgong', cnTitle:'化科在子女宫：孩子读书好，教育上重视品德', enTitle:'Hua Ke in Children Palace: Academically Strong Children', enDesc:'Hua Ke in Children means academically strong children who value character.'},
  {slug:'ziwei-huake-zai-caibogong', cnTitle:'化科在财帛宫：收入靠名声和专业，细水长流', enTitle:'Hua Ke in Wealth Palace: Income Through Reputation', enDesc:'Hua Ke in Wealth means steady income through reputation and expertise.'},
  {slug:'ziwei-huake-zai-jiegong', cnTitle:'化科在疾厄宫：注意慢性病调理，心态好病就少', enTitle:'Hua Ke in Health Palace: Manage Chronic Conditions', enDesc:'Hua Ke in Health means manage chronic conditions; good mindset helps.'},
  {slug:'ziwei-huake-zai-qianyi', cnTitle:'化科在迁移宫：在外名声好，离乡有贵人引荐', enTitle:'Hua Ke in Travel Palace: Good Reputation Outside', enDesc:'Hua Ke in Travel means good reputation and benefactor introductions.'},
  {slug:'ziwei-huake-zai-puyigong', cnTitle:'化科在仆役宫：朋友多为正人君子，能互相提携', enTitle:'Hua Ke in Friends Palace: Upright Friends', enDesc:'Hua Ke in Friends means upright friends who lift each other up.'},
  {slug:'ziwei-huake-zai-guanlugong', cnTitle:'化科在官禄宫：事业平稳有声望，适合文职和学术', enTitle:'Hua Ke in Career Palace: Stable, Prestigious Career', enDesc:'Hua Ke in Career means stable prestige suited to letters and academia.'},
  {slug:'ziwei-huake-zai-tianzhaigong', cnTitle:'化科在田宅宫：家里有书香气息，房产运平稳', enTitle:'Hua Ke in Property Palace: A Scholarly Home', enDesc:'Hua Ke in Property means a scholarly home and stable property luck.'},
  {slug:'ziwei-huake-zai-fudegong', cnTitle:'化科在福德宫：精神追求高雅，心态平和', enTitle:'Hua Ke in Fortune Palace: Refined Pursuits', enDesc:'Hua Ke in Fortune means refined spiritual pursuits and peace.'},
  {slug:'ziwei-huake-zai-fumugong', cnTitle:'化科在父母宫：父母有文化修养，学历文书运好', enTitle:'Hua Ke in Parents Palace: Cultured Parents', enDesc:'Hua Ke in Parents means cultured parents and good education luck.'},
  {slug:'ziwei-huaji-zai-minggong', cnTitle:'化忌在命宫：这辈子最大的功课是放下执著', enTitle:'Hua Ji in Life Palace: Letting Go of Fixation', enDesc:'Hua Ji in Life means the biggest lesson is letting go of fixation.'},
  {slug:'ziwei-huaji-zai-xiongdigong', cnTitle:'化忌在兄弟宫：手足缘分有亏欠，资金周转容易卡', enTitle:'Hua Ji in Siblings Palace: Karmic Debt with Siblings', enDesc:'Hua Ji in Siblings means karmic debt and stuck cash flow.'},
  {slug:'ziwei-huaji-zai-fuqigong', cnTitle:'化忌在夫妻宫：感情是最大的执念，越在乎越容易出问题', enTitle:'Hua Ji in Spouse Palace: Love Is the Greatest Fixation', enDesc:'Hua Ji in Spouse means love is the greatest fixation.'},
  {slug:'ziwei-huaji-zai-zinvgong', cnTitle:'化忌在子女宫：对子女操心过度，合作上容易有纠纷', enTitle:'Hua Ji in Children Palace: Over-Worrying About Children', enDesc:'Hua Ji in Children means over-worrying and partnership disputes.'}
];

// 1. Create 四化 topic page
console.log('Creating 四化 topic page...');
let cards = '';
let itemList = '';
for (let i = 0; i < articles.length; i++) {
  const a = articles[i];
  cards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${date}">2026-08-24</time></a>\n`;
  itemList += `    {"@type":"ListItem","position":${i+1},"url":"https://yuetianai.com/articles/${a.slug}.html","name":"${a.cnTitle}"},\n`;
}
itemList = itemList.trimEnd().replace(/,$/, '');

const topicHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>紫微斗数四化飞星：化禄化权化科化忌在十二宫 | 学习紫微</title>
  <meta name="description" content="四化是紫微斗数的灵魂。化禄主缘起丰收，化权主掌控扩张，化科主名声贵人，化忌主执著亏欠。逐宫解读四化在十二宫的具体表现。">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/ziwei-sihua.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/ziwei-sihua.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/">
  <meta property="og:title" content="紫微斗数四化飞星：化禄化权化科化忌在十二宫">
  <meta property="og:description" content="四化是紫微斗数的灵魂。逐宫解读四化在十二宫的具体表现。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yuetianai.com/articles/ziwei-sihua.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260629-article-accordion-v1">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"CollectionPage","name":"紫微斗数四化飞星","url":"https://yuetianai.com/articles/ziwei-sihua.html","description":"四化是紫微斗数的灵魂。逐宫解读四化在十二宫的具体表现。"}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"ItemList","name":"紫微斗数四化飞星","itemListElement":[
${itemList}
  ]}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true" loading="eager" decoding="async"><span>阅天</span></a>
      <nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="en/">English</a></nav>
    </div>
  </header>
  <main>
    <section class="series" aria-labelledby="topic-title">
      <div class="container">
        <details class="article-group" open>
          <summary class="section-head">
            <h1 id="topic-title">紫微斗数四化飞星：化禄化权化科化忌在十二宫</h1>
            <span class="section-desc">四化是紫微斗数的灵魂。化禄主缘起丰收，化权主掌控扩张，化科主名声贵人，化忌主执著亏欠。逐宫解读，回到自己的命盘对照。</span>
            <span class="section-toggle"><span>${articles.length} 篇</span></span>
          </summary>
          <div class="article-list">
${cards}        </div>
        </details>
      </div>
    </section>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 阅天AI Copyright, All Rights Reserved. Powered By 阅天工作室</span>　</div></footer>
</body></html>`;
fs.writeFileSync('articles/ziwei-sihua.html', topicHtml.replace(/\r\n/g, '\n'), 'utf8');
console.log('  Topic page created');

// 2. Add 四化 section to CN index
console.log('Updating CN index...');
let cnIndex = fs.readFileSync('articles/index.html', 'utf8');
if (!cnIndex.includes('ziwei-hualu-zai-minggong')) {
  // Find the 主星 section end or insert after 辅煞曜 section
  const auxSectionIdx = cnIndex.indexOf('<h2>辅煞曜</h2>');
  // Find the closing </details> after 辅煞曜 section
  const auxDetailsEnd = cnIndex.indexOf('</details>', auxSectionIdx);
  const insertPos = auxDetailsEnd + '</details>'.length;

  let sihuaCards = '';
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const idx = String(i + 1).padStart(2, '0');
    sihuaCards += `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">四化</span><span><time datetime="${date}">2026-08-24 11:00</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;
  }

  const sihuaSection = `
        <details class="article-group">
          <summary class="section-head">
            <h2>四化飞星</h2>
            <span class="section-desc">化禄、化权、化科、化忌落在十二宫，逐宫解读缘起、掌控、名声与执著。</span>
            <span class="section-toggle"><span>${articles.length} 篇</span></span>
          </summary>
          <div class="article-list">
${sihuaCards}          </div>
        </details>
`;
  cnIndex = cnIndex.slice(0, insertPos) + sihuaSection + cnIndex.slice(insertPos);
  fs.writeFileSync('articles/index.html', cnIndex, 'utf8');
  console.log('  四化 section added to CN index');
}

// 3. Update EN index
console.log('Updating EN index...');
let enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
if (!enIndex.includes('ziwei-hualu-zai-minggong')) {
  const listDiv = enIndex.indexOf('<div class="article-list">');
  const firstCardEnd = enIndex.indexOf('</article>', enIndex.indexOf('article-card', listDiv));
  const insertPos = enIndex.indexOf('\n', firstCardEnd) + 1;
  let enCards = '';
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const idx = String(i + 2).padStart(2, '0');
    enCards += `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-24 11:00</time></span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read article</a>
            </div>
          </article>
`;
  }
  enIndex = enIndex.slice(0, insertPos) + enCards + enIndex.slice(insertPos);
  const countMatch = enIndex.match(/(\d+) Articles/);
  if (countMatch) {
    enIndex = enIndex.replace(countMatch[0], `${parseInt(countMatch[1]) + 40} Articles`);
  }
  fs.writeFileSync('articles/en/index.html', enIndex, 'utf8');
  console.log('  EN index updated');
}

// 4. Update feeds
console.log('Updating feeds...');
let cnFeed = fs.readFileSync('feed.xml', 'utf8');
if (!cnFeed.includes('ziwei-hualu-zai-minggong')) {
  let items = '';
  for (const a of articles) {
    items += `  <item><title>${a.cnTitle}</title><link>https://yuetianai.com/articles/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid><pubDate>Mon, 24 Aug 2026 11:00:00 +0800</pubDate><description><![CDATA[${a.cnTitle}]]></description></item>\n`;
  }
  cnFeed = cnFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('feed.xml', cnFeed, 'utf8');
  console.log('  CN feed updated');
}

let enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
if (!enFeed.includes('ziwei-hualu-zai-minggong')) {
  let items = '';
  for (const a of articles) {
    items += `  <item><title>${a.enTitle}</title><link>https://yuetianai.com/articles/en/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid><pubDate>Mon, 24 Aug 2026 11:00:00 +0800</pubDate><description><![CDATA[${a.enTitle}]]></description></item>\n`;
  }
  enFeed = enFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('articles/en/feed.xml', enFeed, 'utf8');
  console.log('  EN feed updated');
}

console.log('\nAll updates done.');
