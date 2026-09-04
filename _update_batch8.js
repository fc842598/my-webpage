const fs = require('fs');
const path = require('path');
const date = '2026-08-17T10:15:00+08:00';
const pubDate = 'Mon, 17 Aug 2026 02:15:00 +0000';

const articles = [
  { slug: 'ziwei-hongluan-tianxi', cnTitle: '紫微斗数红鸾天喜：正桃花星，有这两颗星的人感情有喜事', cnDesc: '红鸾天喜是正桃花星，主姻缘、喜庆和人缘。命宫或夫妻宫有红鸾天喜，感情运好、容易遇到正缘，但也要防烂桃花。', enTitle: 'Hong Luan and Tian Xi: The Positive Romance Stars', enDesc: 'Hong Luan and Tian Xi are positive romance stars, ruling marriage, celebration, and popularity.' },
  { slug: 'ziwei-xianchi-tianyao', cnTitle: '紫微斗数咸池天姚：桃花煞，魅力大但要防烂桃花', cnDesc: '咸池天姚是桃花煞，主魅力、情欲和偏桃花。有这两颗星的人异性缘极强，但容易遇到烂桃花或感情纠葛。', enTitle: 'Xian Chi and Tian Yao: The Romance Malefics', enDesc: 'Xian Chi and Tian Yao are romance malefics, ruling charm, desire, and casual romance.' },
  { slug: 'ziwei-tianma-xing', cnTitle: '紫微斗数天马星：动星，有天马的人闲不住，动中得财', cnDesc: '天马星主变动、奔波和行动力。命宫有天马的人闲不住、适合动中求财，但也可能一生漂泊不定。', enTitle: 'Tian Ma Star: The Moving Star', enDesc: 'Tian Ma rules movement, travel, and action. People with it can\'t sit still and thrive on earning through movement.' },
  { slug: 'ziwei-tianxing-xing', cnTitle: '紫微斗数天刑星：刑星，主法律、伤灾和原则', cnDesc: '天刑星主法律、刑伤和原则。命宫有天刑的人有正义感、适合法律行业，但也要防官非和意外伤害。', enTitle: 'Tian Xing Star: The Punishment Star', enDesc: 'Tian Xing rules law, injury, and principle. People with it have a strong sense of justice and suit legal careers.' },
  { slug: 'ziwei-jieshen-xing', cnTitle: '紫微斗数解神星：化解星，有解神的人逢凶能化吉', cnDesc: '解神星主化解、消灾和转机。命宫有解神的人遇到困难总能找到出路，但也可能「大事化小」而忽视真正的问题。', enTitle: 'Jie Shen Star: The Dissolving Star', enDesc: 'Jie Shen rules resolution, disaster-dissolving, and turning points. People with it always find a way out of trouble.' },
  { slug: 'ziwei-guchen-guasu', cnTitle: '紫微斗数孤辰寡宿：孤星，有这两颗星的人独立但要防孤独', cnDesc: '孤辰寡宿主孤独、独立和精神追求。命宫有这两颗星的人独立自主、有精神世界，但也容易跟人保持距离。', enTitle: 'Gu Chen and Gua Su: The Lone Stars', enDesc: 'Gu Chen and Gua Su rule loneliness, independence, and spiritual pursuit. People with them are self-reliant with rich inner lives.' },
  { slug: 'ziwei-santai-bazuo', cnTitle: '紫微斗数三台八座：贵星，有这两颗星的人有地位有排场', cnDesc: '三台八座主地位、排场和威仪。命宫有这两颗星的人气质出众、容易获得社会地位，但也可能好面子讲排场。', enTitle: 'San Tai and Ba Zuo: The Status Stars', enDesc: 'San Tai and Ba Zuo rule status, ceremony, and dignity. People with them have outstanding presence and easily gain social standing.' },
  { slug: 'ziwei-huagai-xing', cnTitle: '紫微斗数华盖星：艺术宗教星，有华盖的人聪明但孤傲', cnDesc: '华盖星主艺术、宗教和孤傲。命宫有华盖的人聪明有才华、有精神追求，但也容易跟世俗格格不入。', enTitle: 'Hua Gai Star: The Art and Religion Star', enDesc: 'Hua Gai rules art, religion, and aloofness. People with it are intelligent and talented with spiritual pursuits.' },
  { slug: 'ziwei-longchi-fengge', cnTitle: '紫微斗数龙池凤阁：才艺星，有这两颗星的人有审美有品位', cnDesc: '龙池凤阁主才艺、审美和品位。命宫有这两颗星的人有艺术天赋、审美出众，但也可能眼高手低。', enTitle: 'Long Chi and Feng Ge: The Talent and Taste Stars', enDesc: 'Long Chi and Feng Ge rule talent, aesthetics, and taste. People with them have artistic gift and outstanding taste.' },
  { slug: 'ziwei-tianku-tianxu', cnTitle: '紫微斗数天哭天虚：情绪星，有这两颗星的人感性但要防内耗', cnDesc: '天哭天虚主情绪、悲观和空虚。命宫有这两颗星的人感性细腻、有同理心，但也容易想太多、情绪低落。', enTitle: 'Tian Ku and Tian Xu: The Emotional Stars', enDesc: 'Tian Ku and Tian Xu rule emotion, pessimism, and emptiness. People with them are sensitive and empathetic, but prone to overthinking.' }
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
              <div class="card-meta"><span class="tag">${cnTag}</span><span><time datetime="${date}">2026-08-17 10:15</time></span></div>
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
  return html.replace(/data-index="\d+"/g, () => { cardNum++; return `data-index="${String(cardNum).padStart(2, '0')}"`; });
}

// CN Index
function updateCnIndex() {
  const p = path.join(__dirname, 'articles', 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  html = insertCards(html, '<h2>辅煞曜</h2>', articles, '辅煞曜');
  html = updateCount(html, '<h2>辅煞曜</h2>', articles.length);
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
              <div class="card-meta"><span class="tag">Helper Stars</span><span>Bilingual</span></div>
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

// Topic Page
function updateTopic() {
  const p = path.join(__dirname, 'articles', 'ziwei-helper-malice-stars.html');
  let html = fs.readFileSync(p, 'utf8');
  const firstCardIdx = html.indexOf('<article class="article-card"');
  let cards = '';
  for (const a of articles) {
    cards += `<article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">辅煞曜</span><span><time datetime="${date}">${date}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
          `;
  }
  html = html.slice(0, firstCardIdx) + cards + html.slice(firstCardIdx);
  html = renumberCards(html);
  html = insertJsonLd(html, articles);
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
    <lastmod>2026-08-17</lastmod>
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
