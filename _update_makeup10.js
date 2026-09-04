const fs = require('fs');
const path = require('path');
const date = '2026-08-18T12:15:00+08:00';
const pubDate = 'Tue, 18 Aug 2026 04:15:00 +0000';

const articles = [
  { slug: 'ziwei-geju-zifu-tonggong', cnTitle: '紫微斗数紫府同宫格：紫微天府同坐，有位置也有资源，但要防孤君', cnDesc: '紫府同宫是紫微和天府同坐一宫的格局，主地位高、资源足、管理能力强。但如果没有辅星配合，容易变成「孤君」。', enTitle: 'Zi Wei and Tian Fu in the Same Palace: Position and Resources', enDesc: 'Zi Fu Tong Gong is when Zi Wei and Tian Fu share a palace, ruling high status and resources.' },
  { slug: 'ziwei-geju-fuxiang-chaoyuan', cnTitle: '紫微斗数府相朝垣格：天府天相来朝，稳中有贵的格局', cnDesc: '府相朝垣是命宫有紫微或七杀，三方有天府天相来朝的格局。主稳重、有贵人、事业稳。', enTitle: 'Fu Xiang Chao Yuan: Tian Fu and Tian Xiang Facing the Palace', enDesc: 'Fu Xiang Chao Yuan rules steadiness, benefactors, and stable career.' },
  { slug: 'ziwei-geju-jiyue-tongliang', cnTitle: '紫微斗数机月同梁格：天机太阴同梁，聪明稳重的幕僚型格局', cnDesc: '机月同梁是天机、太阴、天梁三颗星在三方四正相会的格局，主聪明、稳重、善于谋划。', enTitle: 'Ji Yue Tong Liang: The Smart, Steady Advisor Pattern', enDesc: 'Ji Yue Tong Liang rules intelligence, steadiness, and strategy.' },
  { slug: 'ziwei-geju-shapol', cnTitle: '紫微斗数杀破狼格：七杀破军贪狼，人生大起大落的开创型格局', cnDesc: '杀破狼是七杀、破军、贪狼三颗星在三方四正相会的格局，主开创、变化、大起大落。', enTitle: 'Sha Po Lang: The Pioneering Pattern of Great Ups and Downs', enDesc: 'Sha Po Lang rules pioneering, change, and great ups and downs.' },
  { slug: 'ziwei-geju-riyue-bingming', cnTitle: '紫微斗数日月并明格：太阳太阴同宫，光明与细腻并存', cnDesc: '日月并明是太阳和太阴同坐一宫的格局，主光明磊落又心思细腻。', enTitle: 'Ri Yue Bing Ming: Light and Sensitivity Together', enDesc: 'Ri Yue Bing Ming rules openness and sensitivity together.' },
  { slug: 'ziwei-geju-juri-tonggong', cnTitle: '紫微斗数巨日同宫格：巨门太阳同坐，口才与光明的组合', cnDesc: '巨日同宫是巨门和太阳同坐一宫的格局，主口才好、表达力强、适合靠嘴吃饭。', enTitle: 'Ju Ri Tong Gong: Eloquence and Light', enDesc: 'Ju Ri Tong Gong rules eloquence and strong expression.' },
  { slug: 'ziwei-geju-wutan', cnTitle: '紫微斗数武贪格：武曲贪狼同宫，财欲双全的爆发型格局', cnDesc: '武贪格是武曲和贪狼同坐一宫的格局，主财欲双全、爆发力强。', enTitle: 'Wu Tan: The Wealth-Desire Explosive Pattern', enDesc: 'Wu Tan rules both wealth and desire with explosive power.' },
  { slug: 'ziwei-geju-lianqi-qisha', cnTitle: '紫微斗数廉贞七杀格：囚星加将星，刚猛中有刑克的格局', cnDesc: '廉贞七杀是廉贞和七杀同宫的格局，主刚猛、决断、有魄力，但也主刑克和冲突。', enTitle: 'Lian Zhen and Qi Sha: Fierceness with Punishment', enDesc: 'Lian Zhen and Qi Sha rule fierceness, decisiveness, and punishment.' },
  { slug: 'ziwei-geju-tanlang-huaji', cnTitle: '紫微斗数贪狼化忌格：欲望受阻，反而是深耕和专注的机会', cnDesc: '贪狼化忌是贪狼星遇化忌的格局，主欲望受阻、感情波折，但也能转化为专注深耕。', enTitle: 'Tan Lang Hua Ji: Desire Blocked, Opportunity for Depth', enDesc: 'Tan Lang Hua Ji rules blocked desire but can transform into deep focus.' },
  { slug: 'ziwei-geju-ziwei-pojun', cnTitle: '紫微斗数紫微破军格：帝星加耗星，在变革中建立新秩序', cnDesc: '紫微破军是紫微和破军同宫的格局，主在变革中建立新秩序。适合做改革者，但要防破而不立。', enTitle: 'Zi Wei and Po Jun: Building New Order Through Change', enDesc: 'Zi Wei and Po Jun rule building new order through change.' }
];

function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

function insertCards(html, sectionMarker, articles, cnTag) {
  const sectionIdx = html.indexOf(sectionMarker);
  if (sectionIdx === -1) throw new Error('Cannot find section: ' + sectionMarker);
  const listStart = html.indexOf('<div class="article-list">', sectionIdx);
  if (listStart === -1) throw new Error('Cannot find article-list after: ' + sectionMarker);
  const insertPos = listStart + '<div class="article-list">'.length;
  let cards = '\n';
  for (const a of articles) {
    cards += `          <article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">${cnTag}</span><span><time datetime="${date}">2026-08-18 12:15</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>\n`;
  }
  return html.slice(0, insertPos) + cards + html.slice(insertPos);
}

function updateCount(html, sectionMarker, add) {
  const sectionIdx = html.indexOf(sectionMarker);
  const countMatch = html.slice(sectionIdx, sectionIdx + 500).match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    html = html.slice(0, sectionIdx) + html.slice(sectionIdx).replace(countMatch[0], `<span>${oldCount + add} 篇</span>`);
  }
  return html;
}

function insertJsonLd(html, articles) {
  const itemListIdx = html.indexOf('"@type": "ItemList"');
  const arrStart = html.indexOf('[', itemListIdx);
  const arrInsertPos = arrStart + 1;
  let jsonItems = '';
  for (const a of articles) {
    jsonItems += `
    {
      "@type": "ListItem",
      "position": 0,
      "url": "https://yuetianai.com/articles/${a.slug}.html",
      "name": "${jstr(a.cnTitle)}"
    },`;
  }
  html = html.slice(0, arrInsertPos) + jsonItems + html.slice(arrInsertPos);
  let pos = 0;
  const firstArrEnd = html.indexOf(']', arrInsertPos);
  const beforeArr = html.slice(0, arrInsertPos);
  const arrContent = html.slice(arrInsertPos, firstArrEnd);
  const afterArr = html.slice(firstArrEnd);
  const renumbered = arrContent.replace(/"position":\s*\d+/g, () => { pos++; return `"position": ${pos}`; });
  return beforeArr + renumbered + afterArr;
}

function renumberCards(html) {
  let cardNum = 0;
  return html.replace(/data-index="(XX|\d+)"/g, () => { cardNum++; return `data-index="${String(cardNum).padStart(2, '0')}"`; });
}

// CN Index - 格局命例 section
function updateCnIndex() {
  const p = path.join(__dirname, 'articles', 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  html = insertCards(html, '<h2>格局命例</h2>', articles, '格局命例');
  html = updateCount(html, '<h2>格局命例</h2>', articles.length);
  html = renumberCards(html);
  html = insertJsonLd(html, articles);
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated CN index');
}

// EN Index
function updateEnIndex() {
  const p = path.join(__dirname, 'articles', 'en', 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  const firstCardIdx = html.indexOf('<article class="article-card"');
  let cards = '';
  for (const a of articles) {
    cards += `<article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Patterns</span><span>Bilingual</span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read more</a>
            </div>
          </article>
          `;
  }
  html = html.slice(0, firstCardIdx) + cards + html.slice(firstCardIdx);
  html = renumberCards(html);
  const countMatch = html.match(/(\d+)\s*articles/);
  if (countMatch) html = html.replace(countMatch[0], (parseInt(countMatch[1]) + articles.length) + ' articles');
  const itemListIdx = html.indexOf('"@type": "ItemList"');
  const arrStart = html.indexOf('[', itemListIdx);
  const arrInsertPos = arrStart + 1;
  let jsonItems = '';
  for (const a of articles) {
    jsonItems += `
      {
        "@type": "ListItem",
        "position": 0,
        "url": "https://yuetianai.com/articles/en/${a.slug}.html",
        "name": "${jstr(a.enTitle)}"
      },`;
  }
  html = html.slice(0, arrInsertPos) + jsonItems + html.slice(arrInsertPos);
  let pos = 0;
  const firstArrEnd = html.indexOf(']', arrInsertPos);
  const beforeArr = html.slice(0, arrInsertPos);
  const arrContent = html.slice(arrInsertPos, firstArrEnd);
  const afterArr = html.slice(firstArrEnd);
  html = beforeArr + arrContent.replace(/"position":\s*\d+/g, () => { pos++; return `"position": ${pos}`; }) + afterArr;
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated EN index');
}

// Topic Page - ziwei-case-patterns.html
function updateTopic() {
  const p = path.join(__dirname, 'articles', 'ziwei-case-patterns.html');
  let html = fs.readFileSync(p, 'utf8');
  const firstCardIdx = html.indexOf('<article class="article-card"');
  if (firstCardIdx === -1) {
    // Find a good insertion point - after the main content section
    const insertPoint = html.indexOf('</main>');
    let cards = '<div class="container"><div class="article-list">\n';
    for (const a of articles) {
      cards += `          <article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">格局命例</span><span><time datetime="${date}">${date}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>\n`;
    }
    cards += '</div></div>\n';
    html = html.slice(0, insertPoint) + cards + html.slice(insertPoint);
  } else {
    let cards = '';
    for (const a of articles) {
      cards += `<article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">格局命例</span><span><time datetime="${date}">${date}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
          `;
    }
    html = html.slice(0, firstCardIdx) + cards + html.slice(firstCardIdx);
  }
  html = renumberCards(html);
  // Add JSON-LD ItemList if not exists, otherwise insert
  if (html.includes('"@type": "ItemList"')) {
    html = insertJsonLd(html, articles);
  }
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated topic page');
}

// Feeds
function updateFeed(feedPath, isEn) {
  let xml = fs.readFileSync(feedPath, 'utf8');
  xml = xml.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);
  let items = '';
  for (const a of articles) {
    const title = isEn ? a.enTitle : a.cnTitle;
    const desc = isEn ? a.enDesc : a.cnDesc;
    const link = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
    items += `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  }
  const firstItem = xml.indexOf('<item>');
  xml = xml.slice(0, firstItem) + items + xml.slice(firstItem);
  const itemCount = (xml.match(/<item>/g) || []).length;
  if (itemCount > 80) {
    let removeCount = itemCount - 80;
    for (let i = 0; i < removeCount; i++) {
      const lastItemStart = xml.lastIndexOf('    <item>');
      const lastItemEnd = xml.indexOf('</item>', lastItemStart) + '</item>'.length;
      let end = lastItemEnd;
      if (xml[end] === '\n') end++;
      xml = xml.slice(0, lastItemStart) + xml.slice(end);
    }
  }
  fs.writeFileSync(feedPath, xml.trimEnd() + '\n', 'utf8');
  console.log('Updated feed: ' + feedPath);
}

// Sitemaps
function updateSitemap(smPath, isEn) {
  let xml = fs.readFileSync(smPath, 'utf8');
  let urls = '';
  for (const a of articles) {
    const link = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
    urls += `  <url>
    <loc>${link}</loc>
    <lastmod>2026-08-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }
  xml = xml.replace('</urlset>', urls + '</urlset>');
  fs.writeFileSync(smPath, xml.trimEnd() + '\n', 'utf8');
  console.log('Updated sitemap: ' + smPath);
}

updateCnIndex();
updateEnIndex();
updateTopic();
updateFeed(path.join(__dirname, 'feed.xml'), false);
updateFeed(path.join(__dirname, 'articles', 'en', 'feed.xml'), true);
updateSitemap(path.join(__dirname, 'sitemap-articles.xml'), false);
updateSitemap(path.join(__dirname, 'sitemap-en.xml'), true);
console.log('All updates complete.');
