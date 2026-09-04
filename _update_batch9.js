const fs = require('fs');
const path = require('path');
const date = '2026-08-18T10:15:00+08:00';
const pubDate = 'Tue, 18 Aug 2026 02:15:00 +0000';

const articles = [
  { slug: 'ziwei-taifu-fenggao', cnTitle: '紫微斗数台辅封诰：文书贵星，有这两颗星的人容易得名分和头衔', cnDesc: '台辅封诰主文书、封赠和名分。命宫有这两颗星的人，容易获得正式的头衔、证书和认可，但它们的力量需要主星来带。', enTitle: 'Tai Fu and Feng Gao: The Document Nobility Stars', enDesc: 'Tai Fu and Feng Gao rule documents, honors, and official recognition.' },
  { slug: 'ziwei-feilian-posui', cnTitle: '紫微斗数蜚廉破碎：小人损耗星，有这两颗星要防暗箭和破财', cnDesc: '蜚廉主口舌是非和小人，破碎主损耗和破坏。命宫有这两颗星的人，容易遭人暗中议论或东西损坏，但它们也有正面用法。', enTitle: 'Fei Lian and Po Sui: The Gossip and Loss Stars', enDesc: 'Fei Lian rules gossip and petty people; Po Sui rules loss and breakage.' },
  { slug: 'ziwei-tianwu-tianyue', cnTitle: '紫微斗数天巫天月：遗产与病符星，一个主继承一个主慢性病', cnDesc: '天巫主遗产、玄学和直觉，天月主慢性病和健康隐患。命宫有这两颗星的人，可能继承到东西，也要注意长期健康管理。', enTitle: 'Tian Wu and Tian Yue: The Inheritance and Illness Stars', enDesc: 'Tian Wu rules inheritance and intuition; Tian Yue rules chronic illness.' },
  { slug: 'ziwei-yinsha-xing', cnTitle: '紫微斗数阴煞星：暗星，有阴煞的人直觉强但要防小人暗害', cnDesc: '阴煞主暗中小人、阴性干扰和潜意识恐惧。命宫有阴煞的人直觉极强、容易感知到「不对劲」，但也容易焦虑和被暗中的人或事影响。', enTitle: 'Yin Sha Star: The Hidden Shadow Star', enDesc: 'Yin Sha rules hidden petty people, unseen interference, and subconscious fear.' },
  { slug: 'ziwei-tianshang-tianshi', cnTitle: '紫微斗数天伤天使：虚耗灾病星，命宫迁移宫各守一位', cnDesc: '天伤主虚耗和损伤，天使主灾病和波折。两颗星分别固定在命宫和迁移宫的对宫位置，是紫微斗数里唯一「按宫位固定」的杂曜。', enTitle: 'Tian Shang and Tian Shi: The Drain and Disaster Stars', enDesc: 'Tian Shang rules drain and injury; Tian Shi rules disaster and illness.' },
  { slug: 'ziwei-tianchu-xing', cnTitle: '紫微斗数天厨星：衣食星，有天厨的人有口福、吃穿不愁', cnDesc: '天厨星主口福、俸禄和衣食享受。命宫有天厨的人爱吃会吃、生活有品质，但也要防贪吃和安逸。', enTitle: 'Tian Chu Star: The Food and Clothing Star', enDesc: 'Tian Chu rules good food, salary, and material comfort.' },
  { slug: 'ziwei-tianguan-tianfu', cnTitle: '紫微斗数天官天福：官福双星，有这两颗星的人仕途顺、福气厚', cnDesc: '天官主官贵和仕途，天福主福气和长寿。命宫有这两颗星的人，容易在体制内发展，一生福气厚、逢凶化吉。', enTitle: 'Tian Guan and Tian Fu: The Office and Fortune Stars', enDesc: 'Tian Guan rules official rank; Tian Fu rules fortune and longevity.' },
  { slug: 'ziwei-tiancai-tianshou', cnTitle: '紫微斗数天才天寿：才智与长寿星，一个主聪明一个主寿元', cnDesc: '天才主才智和领悟力，天寿主长寿和稳重。命宫有这两颗星的人聪明且稳重，但天才也要防聪明反被聪明误。', enTitle: 'Tian Cai and Tian Shou: The Talent and Longevity Stars', enDesc: 'Tian Cai rules intelligence; Tian Shou rules longevity and steadiness.' },
  { slug: 'ziwei-jiekong-xunkong', cnTitle: '紫微斗数截空旬空：空亡星，有这两颗星的事容易中途断掉', cnDesc: '截空旬空主中断、落空和虚无。命宫有这两颗星的人，事情容易做到一半断掉，但它们也能让你「放下」不该执着的东西。', enTitle: 'Jie Kong and Xun Kong: The Void Stars', enDesc: 'Jie Kong and Xun Kong rule interruption, emptiness, and void.' },
  { slug: 'ziwei-tiande-yuede', cnTitle: '紫微斗数天德月德：德星，有这两颗星的人能逢凶化吉', cnDesc: '天德月德是消灾解厄之星。命宫有这两颗星的人，一生中即使遇到灾祸也能化解，心地善良、有德行。', enTitle: 'Tian De and Yue De: The Virtue Stars', enDesc: 'Tian De and Yue De are disaster-dissolving stars that turn misfortune into blessing.' }
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
              <div class="card-meta"><span class="tag">${cnTag}</span><span><time datetime="${date}">2026-08-18 10:15</time></span></div>
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
