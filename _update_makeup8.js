const fs = require('fs');
const path = require('path');
const date = '2026-08-19T12:05:00+08:00';
const dateDisplay = '2026-08-19 12:05';
const pubDate = 'Wed, 19 Aug 2026 04:05:00 +0000';
const smDate = '2026-08-19';

const articles = [
  { slug: 'ziwei-geju-xingqiu-jiayin', cnTitle: '紫微斗数刑囚夹印格：天相加化忌和廉贞，官非刑伤的预警格局', cnDesc: '刑囚夹印是天相在命宫，邻宫有化忌和廉贞相夹的凶格，主官非、刑伤、纠纷。但凶格是预警不是判决。', enTitle: 'Xing Qiu Jia Yin: Tian Xiang with Hua Ji and Lian Zhen — Legal Trouble Warning', enDesc: 'Xing Qiu Jia Yin is an inauspicious pattern when Tian Xiang in Life is sandwiched by Hua Ji and Lian Zhen, ruling legal disputes and injury.' },
  { slug: 'ziwei-geju-taohua-gunlang', cnTitle: '紫微斗数桃花滚浪格：贪狼加煞星在水位，桃花成灾的格局', cnDesc: '桃花滚浪是贪狼在水位加煞星的格局，主桃花泛滥成灾、因色破财。跟泛水桃花不同，滚浪格有煞星推动。', enTitle: 'Tao Hua Gun Lang: Tan Lang with Malefics in Water — Romance Becomes Disaster', enDesc: 'Tao Hua Gun Lang is when Tan Lang in water positions has malefics, ruling romance overflowing into disaster and financial loss.' },
  { slug: 'ziwei-geju-lianfu-tonggong', cnTitle: '紫微斗数廉府同宫格：廉贞天府同坐，才华与稳重并存的格局', cnDesc: '廉府同宫是廉贞和天府同坐一宫的格局，主才华出众、稳重可靠、能文能武。', enTitle: 'Lian Fu Tong Gong: Lian Zhen and Tian Fu Together — Talent and Stability', enDesc: 'Lian Fu Tong Gong is when Lian Zhen and Tian Fu share a palace, ruling outstanding talent, reliability, and versatility.' },
  { slug: 'ziwei-geju-wuji-tonggong', cnTitle: '紫微斗数武机同宫格：武曲天机同坐，精明干练的技术型格局', cnDesc: '武机同宫是武曲和天机同坐一宫的格局，主精明、干练、善于计算和规划。适合做技术、金融、工程。', enTitle: 'Wu Ji Tong Gong: Wu Qu and Tian Ji Together — The Sharp Technical Pattern', enDesc: 'Wu Ji Tong Gong is when Wu Qu and Tian Ji share a palace, ruling sharpness, competence, and skill in calculation and planning.' },
  { slug: 'ziwei-geju-jiliang-tonggong', cnTitle: '紫微斗数机梁同宫格：天机天梁同坐，善谋善断的军师型格局', cnDesc: '机梁同宫是天机和天梁同坐一宫的格局，主智慧、谋略、善谏言。适合做军师、顾问、学者。', enTitle: 'Ji Liang Tong Gong: Tian Ji and Tian Liang Together — The Strategist-Advisor Pattern', enDesc: 'Ji Liang Tong Gong is when Tian Ji and Tian Liang share a palace, ruling wisdom, strategy, and skill in giving advice.' },
  { slug: 'ziwei-geju-tianji-huaji', cnTitle: '紫微斗数天机化忌格：智慧受阻，反而是深度思考的机会', cnDesc: '天机化忌是天机星遇化忌的格局，主思维受阻、计划多变、焦虑失眠。但化忌让你从想得多变成想得深。', enTitle: 'Tian Ji Hua Ji: Wisdom Blocked — An Opportunity for Deep Thinking', enDesc: 'Tian Ji Hua Ji is when Tian Ji meets Hua Ji, ruling blocked thinking, changing plans, anxiety and insomnia.' },
  { slug: 'ziwei-geju-wuqu-huaji', cnTitle: '紫微斗数武曲化忌格：财星受阻，是破财还是理财的契机', cnDesc: '武曲化忌是武曲星遇化忌的格局，主财运受阻、破财、财务压力。但化忌也让你从会赚钱变成会管钱。', enTitle: 'Wu Qu Hua Ji: Wealth Star Blocked — Financial Loss or a Chance to Manage Better', enDesc: 'Wu Qu Hua Ji is when Wu Qu meets Hua Ji, ruling blocked wealth, financial loss, and money pressure.' },
  { slug: 'ziwei-geju-taiyang-huaji', cnTitle: '紫微斗数太阳化忌格：光明受阻，是怀才不遇还是自我修炼', cnDesc: '太阳化忌是太阳星遇化忌的格局，主事业受阻、怀才不遇、男性长辈问题。但化忌让你从外放变成内敛。', enTitle: 'Tai Yang Hua Ji: Light Blocked — Unrecognized Talent or Self-Cultivation', enDesc: 'Tai Yang Hua Ji is when Tai Yang meets Hua Ji, ruling career obstruction, unrecognized talent, and issues with male elders.' }
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
              <div class="card-meta"><span class="tag">${cnTag}</span><span><time datetime="${date}">${dateDisplay}</time></span></div>
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

function insertJsonLd(html, articles, isEn) {
  const itemListIdx = html.indexOf('"@type": "ItemList"');
  const arrStart = html.indexOf('[', itemListIdx);
  const arrInsertPos = arrStart + 1;
  let jsonItems = '';
  for (const a of articles) {
    const url = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
    const name = isEn ? jstr(a.enTitle) : jstr(a.cnTitle);
    jsonItems += `
    {
      "@type": "ListItem",
      "position": 0,
      "url": "${url}",
      "name": "${name}"
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

function updateCnIndex() {
  const p = path.join(__dirname, 'articles', 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  html = insertCards(html, '<h2>格局命例</h2>', articles, '格局命例');
  html = updateCount(html, '<h2>格局命例</h2>', articles.length);
  html = renumberCards(html);
  html = insertJsonLd(html, articles, false);
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated CN index');
}

function updateEnIndex() {
  const p = path.join(__dirname, 'articles', 'en', 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  const mainSectionIdx = html.indexOf('id="en-article-index"');
  const listStart = html.indexOf('<div class="article-list">', mainSectionIdx);
  const insertPos = listStart + '<div class="article-list">'.length;
  let cards = '\n';
  for (const a of articles) {
    cards += `          <article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Patterns</span><span>Bilingual</span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read more</a>
            </div>
          </article>\n`;
  }
  html = html.slice(0, insertPos) + cards + html.slice(insertPos);
  html = renumberCards(html);
  const countMatch = html.match(/(\d+)\s*Articles/);
  if (countMatch) html = html.replace(countMatch[0], (parseInt(countMatch[1]) + articles.length) + ' Articles');
  html = insertJsonLd(html, articles, true);
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated EN index');
}

function updateTopic() {
  const p = path.join(__dirname, 'articles', 'ziwei-case-patterns.html');
  let html = fs.readFileSync(p, 'utf8');
  const firstCardIdx = html.indexOf('<article class="article-card"');
  let cards = '';
  for (const a of articles) {
    cards += `          <article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">格局命例</span><span><time datetime="${date}">${dateDisplay}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
          `;
  }
  html = html.slice(0, firstCardIdx) + cards + html.slice(firstCardIdx);
  html = renumberCards(html);
  const countMatch = html.match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    html = html.replace(countMatch[0], `<span>${oldCount + articles.length} 篇</span>`);
  }
  if (html.includes('"@type": "ItemList"')) {
    html = insertJsonLd(html, articles, false);
  }
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated topic page');
}

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

function updateSitemap(smPath, isEn) {
  let xml = fs.readFileSync(smPath, 'utf8');
  let urls = '';
  for (const a of articles) {
    const link = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
    urls += `  <url>
    <loc>${link}</loc>
    <lastmod>${smDate}</lastmod>
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
