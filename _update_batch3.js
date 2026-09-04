const fs = require('fs');
const path = require('path');

const pubDate = 'Wed, 12 Aug 2026 02:45:00 +0000';
const dateStr = '2026-08-12';

const articles = [
  { slug: 'ziwei-guanlugong-huaquan', cnTitle: '官禄宫化权：事业有权是掌权还是扛责', enTitle: 'Career Palace With Hua Quan: Authority or Burden?', cnDesc: '官禄宫化权，事业上有权力、有位置。但权和责是一体两面——你说了算是掌权，什么都找你是扛责。', enDesc: 'Hua Quan in the Career Palace brings authority and position. But power and responsibility are two sides of the same coin.' },
  { slug: 'ziwei-tianzhaigong-huaquan', cnTitle: '田宅宫化权：家里谁说了算，房产是掌控还是压力', enTitle: 'Property Palace With Hua Quan: Who Rules the Home?', cnDesc: '田宅宫化权，家里你说了算，房产上有主导权。但化权在田宅也主房产带来的压力和家庭内部的权力争夺。', enDesc: 'Hua Quan in the Property Palace means you call the shots at home and dominate real estate decisions.' },
  { slug: 'ziwei-fudegong-huaquan', cnTitle: '福德宫化权：精神上的强势是主见还是执念', enTitle: 'Mental Palace With Hua Quan: Conviction or Obsession?', cnDesc: '福德宫化权，精神世界强大——有主见、不随波逐流。但精神上的强势也可能变成执念和控制欲。', enDesc: 'Hua Quan in the Mental Palace gives inner strength and conviction, but it can harden into obsession.' },
  { slug: 'ziwei-caibogong-huaquan', cnTitle: '财帛宫化权：掌控财还是被财掌控', enTitle: 'Wealth Palace With Hua Quan: Control Money or Be Controlled by It?', cnDesc: '财帛宫化权，赚钱有魄力、花钱有主见。但对钱的掌控欲也可能变成被钱掌控。', enDesc: 'Hua Quan in the Wealth Palace gives drive and decisiveness around money, but the need to control can become a cage.' },
  { slug: 'ziwei-fumugong-huaquan', cnTitle: '父母宫化权：父母强势是保护还是压制', enTitle: 'Parents Palace With Hua Quan: Protection or Control?', cnDesc: '父母宫化权，父母能力强、说话有分量。但强势的父母可以是靠山，也可以是压力。', enDesc: 'Hua Quan in the Parents Palace means capable, authoritative parents who can be a mountain or a weight.' },
  { slug: 'ziwei-minggong-huake', cnTitle: '命宫化科：名声贵人考试运，化科在命先看什么', enTitle: 'Life Palace With Hua Ke: Reputation, Benefactors, and Exam Luck', cnDesc: '命宫化科，名声好、贵人多、考试运佳。但化科的好名需要真本事来撑。', enDesc: 'Hua Ke in the Life Palace brings reputation, benefactors, and exam luck — but only if backed by real skill.' },
  { slug: 'ziwei-xiongdigong-huake', cnTitle: '兄弟宫化科：兄弟姐妹有口碑，平辈关系中的体面', enTitle: 'Siblings Palace With Hua Ke: Reputation Among Peers', cnDesc: '兄弟宫化科，兄弟姐妹有出息、名声好，你跟平辈的关系也比较体面。', enDesc: 'Hua Ke in the Siblings Palace means accomplished, well-regarded siblings and decent peer relationships.' },
  { slug: 'ziwei-fuqigong-huake', cnTitle: '夫妻宫化科：另一半条件好是体面还是距离', enTitle: 'Spouse Palace With Hua Ke: A Presentable Partner — or a Distant One?', cnDesc: '夫妻宫化科，另一半条件好、有气质、名声不错。但太体面了，反而不够亲密。', enDesc: 'Hua Ke in the Spouse Palace means a partner with good credentials, but polish can replace intimacy.' },
  { slug: 'ziwei-zinvgong-huake', cnTitle: '子女宫化科：孩子有出息，合伙有名声', enTitle: 'Children Palace With Hua Ke: Accomplished Kids, Reputable Partnerships', cnDesc: '子女宫化科，孩子有出息、读书好，合伙关系也比较体面。', enDesc: 'Hua Ke in the Children Palace means accomplished, studious children and respectable partnerships.' },
  { slug: 'ziwei-caibogong-huake', cnTitle: '财帛宫化科：靠专业赚钱，收入稳但发不了大财？', enTitle: 'Wealth Palace With Hua Ke: Earning Through Expertise', cnDesc: '财帛宫化科，收入来自专业名声和口碑——稳、体面、可持续。但化科不主暴富。', enDesc: 'Hua Ke in the Wealth Palace means income from professional reputation — steady, respectable, but not windfalls.' }
];

// 1. Update Chinese index
function updateCnIndex() {
  const fp = path.join(__dirname, 'articles', 'index.html');
  let html = fs.readFileSync(fp, 'utf8');

  // Find the 四化细读 section and insert cards after </summary>
  // The section has an h2 with 四化科权禄忌 or similar
  const sectionMarker = '<h2>四化细读</h2>';
  const idx = html.indexOf(sectionMarker);
  if (idx === -1) throw new Error('Cannot find 四化细读 section in CN index');

  // Find the </summary> after this h2
  const summaryEnd = html.indexOf('</summary>', idx);
  if (summaryEnd === -1) throw new Error('Cannot find </summary> after 四化 section');

  const insertPos = summaryEnd + '</summary>'.length;

  let cards = '\n';
  for (const a of articles) {
    cards += `            <a class="card-link" href="${a.slug}.html">${a.cnTitle}</a>\n`;
  }
  cards = cards.trimEnd();

  html = html.slice(0, insertPos) + '\n' + cards + html.slice(insertPos);

  // Update JSON-LD: find first ItemList and insert at beginning of itemListElement
  const itemListMarker = '"itemListElement": [';
  const listIdx = html.indexOf(itemListMarker);
  if (listIdx === -1) throw new Error('Cannot find itemListElement in CN index');

  const insertJsonPos = listIdx + itemListMarker.length;

  // Find current max position
  const existingPositions = [...html.matchAll(/"position":\s*(\d+)/g)].map(m => parseInt(m[1]));
  let maxPos = existingPositions.length > 0 ? Math.max(...existingPositions) : 0;

  let jsonItems = '';
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    jsonItems += `\n      {"@type": "ListItem", "position": ${i + 1}, "url": "https://yuetianai.com/articles/${a.slug}.html", "name": "${a.cnTitle}"},`;
  }
  // Remove trailing comma and add it after
  jsonItems = jsonItems.replace(/,$/, '');

  html = html.slice(0, insertJsonPos) + jsonItems + ',' + html.slice(insertJsonPos);

  // Renumber all positions
  let posCounter = 0;
  html = html.replace(/"position":\s*\d+/g, () => `"position": ${++posCounter}`);

  fs.writeFileSync(fp, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated CN index');
}

// 2. Update English index
function updateEnIndex() {
  const fp = path.join(__dirname, 'articles', 'en', 'index.html');
  let html = fs.readFileSync(fp, 'utf8');

  // Insert cards before the first card-link
  const firstCard = html.indexOf('<a class="card-link"');
  if (firstCard === -1) throw new Error('Cannot find first card in EN index');

  let cards = '';
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const num = String(i + 1).padStart(2, '0');
    cards += `      <a class="card-link" href="${a.slug}.html" data-index="${num}">${a.enTitle}</a>\n`;
  }

  html = html.slice(0, firstCard) + cards + html.slice(firstCard);

  // Renumber data-index
  let idx = 0;
  html = html.replace(/data-index="\d+"/g, () => `data-index="${String(++idx).padStart(2, '0')}"`);

  // Update article count if present
  html = html.replace(/(\d+)\s*articles?/gi, (match, num) => {
    const newNum = parseInt(num) + articles.length;
    return match.replace(num, String(newNum));
  });

  // Update JSON-LD ItemList
  const itemListMarker = '"itemListElement": [';
  const listIdx = html.indexOf(itemListMarker);
  if (listIdx !== -1) {
    const insertJsonPos = listIdx + itemListMarker.length;

    let jsonItems = '';
    for (let i = 0; i < articles.length; i++) {
      const a = articles[i];
      jsonItems += `\n      {"@type": "ListItem", "position": ${i + 1}, "url": "https://yuetianai.com/articles/en/${a.slug}.html", "name": "${a.enTitle}"},`;
    }
    jsonItems = jsonItems.replace(/,$/, '');

    html = html.slice(0, insertJsonPos) + jsonItems + ',' + html.slice(insertJsonPos);

    let posCounter = 0;
    html = html.replace(/"position":\s*\d+/g, () => `"position": ${++posCounter}`);
  }

  fs.writeFileSync(fp, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated EN index');
}

// 3. Update four-transformations topic page
function updateTopicPage() {
  const fp = path.join(__dirname, 'articles', 'ziwei-four-transformations.html');
  let html = fs.readFileSync(fp, 'utf8');

  // Find the first card-link in the topic page (articles are listed there)
  const firstCard = html.indexOf('<a class="card-link"');
  if (firstCard === -1) throw new Error('Cannot find first card in topic page');

  let cards = '';
  for (const a of articles) {
    cards += `      <a class="card-link" href="${a.slug}.html">${a.cnTitle}</a>\n`;
  }

  html = html.slice(0, firstCard) + cards + html.slice(firstCard);

  // Update JSON-LD ItemList
  const itemListMarker = '"itemListElement": [';
  const listIdx = html.indexOf(itemListMarker);
  if (listIdx !== -1) {
    const insertJsonPos = listIdx + itemListMarker.length;

    let jsonItems = '';
    for (let i = 0; i < articles.length; i++) {
      const a = articles[i];
      jsonItems += `\n      {"@type": "ListItem", "position": ${i + 1}, "url": "https://yuetianai.com/articles/${a.slug}.html", "name": "${a.cnTitle}"},`;
    }
    jsonItems = jsonItems.replace(/,$/, '');

    html = html.slice(0, insertJsonPos) + jsonItems + ',' + html.slice(insertJsonPos);

    let posCounter = 0;
    html = html.replace(/"position":\s*\d+/g, () => `"position": ${++posCounter}`);
  }

  fs.writeFileSync(fp, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated topic page');
}

// 4. Update feeds
function updateFeed(feedPath, isEn) {
  let xml = fs.readFileSync(feedPath, 'utf8');

  // Update lastBuildDate
  xml = xml.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);

  // Build new items
  let newItems = '';
  for (const a of articles) {
    const title = isEn ? a.enTitle : a.cnTitle;
    const desc = isEn ? a.enDesc : a.cnDesc;
    const url = isEn
      ? `https://yuetianai.com/articles/en/${a.slug}.html`
      : `https://yuetianai.com/articles/${a.slug}.html`;
    newItems += `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  }

  // Insert after first <item>
  const firstItem = xml.indexOf('<item>');
  if (firstItem === -1) throw new Error('Cannot find first item in feed');

  xml = xml.slice(0, firstItem) + newItems + xml.slice(firstItem);

  // Trim to 80 items
  const itemCount = (xml.match(/<item>/g) || []).length;
  if (itemCount > 80) {
    // Remove last (itemCount - 80) items
    const removeCount = itemCount - 80;
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

  fs.writeFileSync(feedPath, xml.replace(/\r\n/g, '\n').trimEnd() + '\n', 'utf8');
  console.log(`Updated feed: ${feedPath}`);
}

// 5. Update sitemaps
function updateSitemap(smPath, isEn) {
  let xml = fs.readFileSync(smPath, 'utf8');

  let newUrls = '';
  for (const a of articles) {
    const url = isEn
      ? `https://yuetianai.com/articles/en/${a.slug}.html`
      : `https://yuetianai.com/articles/${a.slug}.html`;
    newUrls += `  <url>
    <loc>${url}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  xml = xml.replace('</urlset>', newUrls + '</urlset>');

  fs.writeFileSync(smPath, xml.replace(/\r\n/g, '\n').trimEnd() + '\n', 'utf8');
  console.log(`Updated sitemap: ${smPath}`);
}

updateCnIndex();
updateEnIndex();
updateTopicPage();
updateFeed(path.join(__dirname, 'feed.xml'), false);
updateFeed(path.join(__dirname, 'articles', 'en', 'feed.xml'), true);
updateSitemap(path.join(__dirname, 'sitemap-articles.xml'), false);
updateSitemap(path.join(__dirname, 'sitemap-en.xml'), true);

console.log('All updates complete.');
