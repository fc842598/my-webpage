const fs = require('fs');
const path = require('path');

const date = '2026-08-14T10:15:00+08:00';
const pubDate = 'Fri, 14 Aug 2026 02:15:00 +0000';

const articles = [
  { slug: 'ziwei-xiongdigong-huaji', cnTitle: '紫微斗数兄弟宫化忌：兄弟姐妹靠不靠，化忌在兄弟怎么看', cnDesc: '兄弟宫化忌，兄弟姐妹缘分薄或关系有结，也可能因兄弟破财。化忌不是无兄弟，是关系中有执念或亏欠。', enTitle: 'Siblings Palace With Hua Ji: Can You Rely on Brothers and Sisters?', enDesc: 'Hua Ji in the Siblings Palace means thin or tangled bonds with siblings, or financial loss through them.' },
  { slug: 'ziwei-fuqigong-huaji', cnTitle: '紫微斗数夫妻宫化忌：感情里的执念，化忌在夫妻怎么转', cnDesc: '夫妻宫化忌，感情里有执念——可能是遇人不淑、可能是放不下、可能是婚姻有结。化忌不等于不婚，是感情课题重。', enTitle: 'Spouse Palace With Hua Ji: Obsession in Love', enDesc: 'Hua Ji in the Spouse Palace brings fixation in love — wrong partners, inability to let go, or knots in marriage.' },
  { slug: 'ziwei-zinvgong-huaji', cnTitle: '紫微斗数子女宫化忌：跟孩子的缘分，化忌在子女怎么看', cnDesc: '子女宫化忌，跟孩子缘分薄或操心多，也可能子女来得晚。化忌不是没有孩子，是亲子关系有课题。', enTitle: 'Children Palace With Hua Ji: Bonds With Children', enDesc: 'Hua Ji in the Children Palace means a thin bond or heavy worry over children, or children coming late.' },
  { slug: 'ziwei-caibogong-huaji', cnTitle: '紫微斗数财帛宫化忌：赚不到还是守不住，化忌在财帛怎么看', cnDesc: '财帛宫化忌，赚钱辛苦或守财困难，容易因钱焦虑。但化忌也主「精打细算」，用对了是理财能力。', enTitle: 'Wealth Palace With Hua Ji: Can\u2019t Earn or Can\u2019t Keep?', enDesc: 'Hua Ji in the Wealth Palace means hard earning or difficulty keeping money, with anxiety over finances.' },
  { slug: 'ziwei-jiaoyougong-huaji', cnTitle: '紫微斗数交友宫化忌：朋友是债还是劫，化忌在交友怎么看', cnDesc: '交友宫化忌，朋友带来麻烦或损失，容易被朋友拖累。但化忌也主「朋友少而精」，关键是识人。', enTitle: 'Friends Palace With Hua Ji: Friends as Debt or Disaster?', enDesc: 'Hua Ji in the Friends Palace means friends bring trouble or loss, and you are easily dragged down.' },
  { slug: 'ziwei-guanlugong-huaji', cnTitle: '紫微斗数官禄宫化忌：事业不顺还是大器晚成，化忌在官禄怎么看', cnDesc: '官禄宫化忌，事业多波折、换工作多、或对工作极度认真。化忌不是事业无成，是成功来得晚、来得辛苦。', enTitle: 'Career Palace With Hua Ji: Career Trouble or Late Bloomer?', enDesc: 'Hua Ji in the Career Palace means career twists, frequent job changes, or extreme diligence.' },
  { slug: 'ziwei-tianzhaigong-huaji', cnTitle: '紫微斗数田宅宫化忌：家是港湾还是枷锁，化忌在田宅怎么看', cnDesc: '田宅宫化忌，房产有纠纷或家庭有压力，也可能在家待不住。化忌不是无家可归，是跟「家」的关系有课题。', enTitle: 'Property Palace With Hua Ji: Home as Haven or Cage?', enDesc: 'Hua Ji in the Property Palace means property disputes or family pressure, or feeling restless at home.' },
  { slug: 'ziwei-fudegong-huaji', cnTitle: '紫微斗数福德宫化忌：想不开还是想得深，化忌在福德怎么转', cnDesc: '福德宫化忌，精神上容易焦虑、多想、放不下。但化忌也主深度思考，用对了是洞察力。', enTitle: 'Mental Palace With Hua Ji: Can\u2019t Let Go or Thinking Deeply?', enDesc: 'Hua Ji in the Mental Palace brings anxiety, overthinking, and inability to let go. But it also grants depth.' },
  { slug: 'ziwei-fumugong-huaji', cnTitle: '紫微斗数父母宫化忌：跟父母的结，化忌在父母怎么解', cnDesc: '父母宫化忌，跟父母缘分薄或关系有结，也可能父母身体让你操心。化忌不是不孝，是亲子关系有课题。', enTitle: 'Parents Palace With Hua Ji: The Knot With Parents', enDesc: 'Hua Ji in the Parents Palace means a thin or tangled bond with parents, or worry over their health.' },
  { slug: 'ziwei-zihua-huaji', cnTitle: '紫微斗数自化忌：自己跟自己过不去，自化忌怎么转', cnDesc: '自化忌是宫位天干自己化忌回本宫，主自己消耗自己、事情自己搞砸。理解自化忌，是读懂命盘「内耗」的关键。', enTitle: 'Self-Hua Ji: When You Get in Your Own Way', enDesc: 'Self-Hua Ji occurs when a palace\u2019s own stem transforms a star back into itself \u2014 self-sabotage and internal friction.' }
];

function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

// === CN Index ===
function updateCnIndex() {
  const p = path.join(__dirname, 'articles', 'index.html');
  let html = fs.readFileSync(p, 'utf8');

  // Find the 四化细读 section
  const sectionMarker = '<h2>四化细读</h2>';
  const sectionIdx = html.indexOf(sectionMarker);
  if (sectionIdx === -1) throw new Error('Cannot find 四化细读 section');

  // Find the article-list div after this section
  const listStart = html.indexOf('<div class="article-list">', sectionIdx);
  if (listStart === -1) throw new Error('Cannot find article-list in 四化细读');
  const insertPos = listStart + '<div class="article-list">'.length;

  // Build cards
  let cards = '\n';
  for (const a of articles) {
    cards += `          <article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">四化细读</span><span><time datetime="${date}">2026-08-14 10:15</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>\n`;
  }
  html = html.slice(0, insertPos) + cards + html.slice(insertPos);

  // Renumber all data-index in the 四化细读 section (from first card after section to end of that div)
  // Actually, let's renumber ALL data-index in the file to be safe, section by section
  // Better approach: find all article-card within the 四化细读 details block and renumber
  // Simplest: renumber all data-index globally in order of appearance
  let cardNum = 0;
  html = html.replace(/data-index="\d+"/g, () => {
    cardNum++;
    return `data-index="${String(cardNum).padStart(2, '0')}"`;
  });

  // Update article count: find "56 篇" near 四化细读
  const countMatch = html.slice(sectionIdx, sectionIdx + 500).match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    const newCount = oldCount + articles.length;
    html = html.slice(0, sectionIdx) + html.slice(sectionIdx).replace(countMatch[0], `<span>${newCount} 篇</span>`);
  }

  // Update JSON-LD: insert new items at beginning of first ItemList
  const itemListMarker = '"@type": "ItemList"';
  const itemListIdx = html.indexOf(itemListMarker);
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

  // Renumber positions in first ItemList
  let pos = 0;
  const firstArrEnd = html.indexOf(']', arrInsertPos);
  const beforeArr = html.slice(0, arrInsertPos);
  const arrContent = html.slice(arrInsertPos, firstArrEnd);
  const afterArr = html.slice(firstArrEnd);
  const renumbered = arrContent.replace(/"position":\s*\d+/g, () => {
    pos++;
    return `"position": ${pos}`;
  });
  html = beforeArr + renumbered + afterArr;

  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated CN index');
}

// === EN Index ===
function updateEnIndex() {
  const p = path.join(__dirname, 'articles', 'en', 'index.html');
  let html = fs.readFileSync(p, 'utf8');

  // Find first article-card
  const firstCardIdx = html.indexOf('<article class="article-card"');
  if (firstCardIdx === -1) throw new Error('Cannot find first card in EN index');

  // Build cards
  let cards = '';
  for (const a of articles) {
    cards += `<article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Four Transformations</span><span>Bilingual</span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read more</a>
            </div>
          </article>
          `;
  }
  html = html.slice(0, firstCardIdx) + cards + html.slice(firstCardIdx);

  // Renumber all data-index
  let cardNum = 0;
  html = html.replace(/data-index="\d+"/g, () => {
    cardNum++;
    return `data-index="${String(cardNum).padStart(2, '0')}"`;
  });

  // Update article count if exists
  const countMatch = html.match(/(\d+)\s*articles/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    html = html.replace(countMatch[0], (oldCount + articles.length) + ' articles');
  }

  // Update JSON-LD
  const itemListMarker = '"@type": "ItemList"';
  const itemListIdx = html.indexOf(itemListMarker);
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

  // Renumber positions
  let pos = 0;
  const firstArrEnd = html.indexOf(']', arrInsertPos);
  const beforeArr = html.slice(0, arrInsertPos);
  const arrContent = html.slice(arrInsertPos, firstArrEnd);
  const afterArr = html.slice(firstArrEnd);
  const renumbered = arrContent.replace(/"position":\s*\d+/g, () => {
    pos++;
    return `"position": ${pos}`;
  });
  html = beforeArr + renumbered + afterArr;

  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated EN index');
}

// === Topic Page ===
function updateTopic() {
  const p = path.join(__dirname, 'articles', 'ziwei-four-transformations.html');
  let html = fs.readFileSync(p, 'utf8');

  // Find first article-card
  const firstCardIdx = html.indexOf('<article class="article-card"');
  if (firstCardIdx === -1) throw new Error('Cannot find first card in topic page');

  let cards = '';
  for (const a of articles) {
    cards += `<article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">四化细读</span><span><time datetime="${date}">${date}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
          `;
  }
  html = html.slice(0, firstCardIdx) + cards + html.slice(firstCardIdx);

  // Renumber all data-index
  let cardNum = 0;
  html = html.replace(/data-index="\d+"/g, () => {
    cardNum++;
    return `data-index="${String(cardNum).padStart(2, '0')}"`;
  });

  // Update JSON-LD
  const itemListMarker = '"@type": "ItemList"';
  const itemListIdx = html.indexOf(itemListMarker);
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
  const renumbered = arrContent.replace(/"position":\s*\d+/g, () => {
    pos++;
    return `"position": ${pos}`;
  });
  html = beforeArr + renumbered + afterArr;

  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated topic page');
}

// === Feeds ===
function updateFeed(feedPath, isEn) {
  let xml = fs.readFileSync(feedPath, 'utf8');

  // Update lastBuildDate
  xml = xml.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);

  // Build items
  let items = '';
  for (const a of articles) {
    const title = isEn ? a.enTitle : a.cnTitle;
    const desc = isEn ? a.enDesc : a.cnDesc;
    const link = isEn
      ? `https://yuetianai.com/articles/en/${a.slug}.html`
      : `https://yuetianai.com/articles/${a.slug}.html`;
    items += `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  }

  // Insert after <item> count - find first <item>
  const firstItem = xml.indexOf('<item>');
  xml = xml.slice(0, firstItem) + items + xml.slice(firstItem);

  // Trim to 80 items
  const itemCount = (xml.match(/<item>/g) || []).length;
  if (itemCount > 80) {
    // Remove last (itemCount - 80) items
    let removeCount = itemCount - 80;
    for (let i = 0; i < removeCount; i++) {
      const lastItemStart = xml.lastIndexOf('    <item>');
      const lastItemEnd = xml.indexOf('</item>', lastItemStart) + '</item>'.length;
      // Also remove the newline after
      let end = lastItemEnd;
      if (xml[end] === '\n') end++;
      if (xml[end] === '\r') end++;
      xml = xml.slice(0, lastItemStart) + xml.slice(end);
    }
  }

  fs.writeFileSync(feedPath, xml.trimEnd() + '\n', 'utf8');
  console.log('Updated feed: ' + feedPath);
}

// === Sitemaps ===
function updateSitemap(smPath, isEn) {
  let xml = fs.readFileSync(smPath, 'utf8');

  let urls = '';
  for (const a of articles) {
    const link = isEn
      ? `https://yuetianai.com/articles/en/${a.slug}.html`
      : `https://yuetianai.com/articles/${a.slug}.html`;
    urls += `  <url>
    <loc>${link}</loc>
    <lastmod>2026-08-14</lastmod>
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
