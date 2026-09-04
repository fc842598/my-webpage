const fs = require('fs');
const path = require('path');

const date = '2026-08-15T10:15:00+08:00';
const pubDate = 'Sat, 15 Aug 2026 02:15:00 +0000';

const articles = [
  { slug: 'ziwei-ziwei-zuoming', cnTitle: '紫微斗数紫微坐命：帝星入命的人，领导欲强但最怕孤君', cnDesc: '紫微星坐命，天生有领导欲和贵气，但最怕没有辅星变成孤君。紫微坐命的人，面子比里子重要，学会用人才是真帝王。', enTitle: 'Zi Wei Star in Life Palace: The Emperor\u2019s Burden', enDesc: 'Zi Wei in the Life Palace brings natural leadership and nobility, but without assistant stars it becomes a lonely ruler.' },
  { slug: 'ziwei-taiyang-zuoming', cnTitle: '紫微斗数太阳坐命：光明磊落的付出型人格，但别把自己烧干', cnDesc: '太阳星坐命，热情大方、乐于助人，但也容易过度付出、为面子所累。太阳的光要照别人，但首先要照自己。', enTitle: 'Tai Yang Star in Life Palace: The Giver Who Burns Out', enDesc: 'Tai Yang in the Life Palace brings warmth, generosity, and helpfulness, but also over-giving and exhaustion.' },
  { slug: 'ziwei-wuqu-zuoming', cnTitle: '紫微斗数武曲坐命：财星入命的实干家，能赚钱但别太硬', cnDesc: '武曲星坐命，务实、刚毅、财商高，是天生的行动派。但武曲也主孤克，太硬容易伤感情，学会柔软是功课。', enTitle: 'Wu Qu Star in Life Palace: The Doer Who Means Business', enDesc: 'Wu Qu in the Life Palace brings pragmatism, resolve, and financial acumen \u2014 a born doer.' },
  { slug: 'ziwei-tiantong-zuoming', cnTitle: '紫微斗数天同坐命：福星入命的人，随和但别懒', cnDesc: '天同星坐命，随和乐观、人缘好、有福报。但天同也主懒散，太安逸会废掉，福星也要努力才接得住福。', enTitle: 'Tian Tong Star in Life Palace: The Lucky Star Who Must Not Coast', enDesc: 'Tian Tong in the Life Palace brings easygoing optimism, popularity, and good fortune, but also laziness.' },
  { slug: 'ziwei-lianzhen-zuoming', cnTitle: '紫微斗数廉贞坐命：囚星入命的人，能干但别把自己困住', cnDesc: '廉贞星坐命，能干、好强、桃花旺，但也主「囚」——容易被自己的执念困住。廉贞坐命的人，学会放下就是破局。', enTitle: 'Lian Zhen Star in Life Palace: The Prison Star Who Must Break Free', enDesc: 'Lian Zhen in the Life Palace brings capability, competitiveness, and charm, but also imprisonment by fixation.' },
  { slug: 'ziwei-tianfu-zuoming', cnTitle: '紫微斗数天府坐命：库星入命的人，稳重但别太保守', cnDesc: '天府星坐命，稳重、可靠、有库藏，但也容易保守、安于现状。天府坐命的人，学会在稳和闯之间找平衡。', enTitle: 'Tian Fu Star in Life Palace: The Treasury Keeper Who Must Not Hoard', enDesc: 'Tian Fu in the Life Palace brings steadiness, reliability, and reserves, but also conservatism.' },
  { slug: 'ziwei-taiyin-zuoming', cnTitle: '紫微斗数太阴坐命：月亮入命的人，细腻但别太敏感', cnDesc: '太阴星坐命，温柔细腻、直觉强、有财运，但也容易敏感多想。太阴坐命的人，学会把敏感变成天赋而不是内耗。', enTitle: 'Tai Yin Star in Life Palace: The Moon\u2019s Intuition and Sensitivity', enDesc: 'Tai Yin in the Life Palace brings gentleness, intuition, and wealth potential, but also sensitivity.' },
  { slug: 'ziwei-tanlang-zuoming', cnTitle: '紫微斗数贪狼坐命：桃花星入命的人，多才多艺但别贪多', cnDesc: '贪狼星坐命，多才多艺、桃花旺、欲望强，但也容易贪多嚼不烂。贪狼坐命的人，学会聚焦是一辈子的功课。', enTitle: 'Tan Lang Star in Life Palace: The Versatile Charm Who Must Focus', enDesc: 'Tan Lang in the Life Palace brings versatility, charm, and strong desire, but also spreading yourself too thin.' },
  { slug: 'ziwei-jumen-zuoming', cnTitle: '紫微斗数巨门坐命：暗星入命的人，口才好但别输在嘴上', cnDesc: '巨门星坐命，口才好、观察力强、能看透本质，但也容易口舌是非。巨门坐命的人，学会说话是一辈子的修行。', enTitle: 'Ju Men Star in Life Palace: The Dark Star With a Sharp Tongue', enDesc: 'Ju Men in the Life Palace brings eloquence and penetrating insight, but also gossip and disputes.' },
  { slug: 'ziwei-tianxiang-zuoming', cnTitle: '紫微斗数天相坐命：印星入命的人，谨慎但别随波逐流', cnDesc: '天相星坐命，谨慎、随和、善于协调，但也容易缺乏主见、随波逐流。天相坐命的人，学会独立判断是功课。', enTitle: 'Tian Xiang Star in Life Palace: The Seal Star Who Must Choose a Side', enDesc: 'Tian Xiang in the Life Palace brings caution, agreeableness, and coordination skill, but also lack of conviction.' }
];

function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

// === CN Index ===
function updateCnIndex() {
  const p = path.join(__dirname, 'articles', 'index.html');
  let html = fs.readFileSync(p, 'utf8');

  const sectionMarker = '<h2>主星细读</h2>';
  const sectionIdx = html.indexOf(sectionMarker);
  if (sectionIdx === -1) throw new Error('Cannot find 主星细读 section');

  const listStart = html.indexOf('<div class="article-list">', sectionIdx);
  if (listStart === -1) throw new Error('Cannot find article-list in 主星细读');
  const insertPos = listStart + '<div class="article-list">'.length;

  let cards = '\n';
  for (const a of articles) {
    cards += `          <article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">主星细读</span><span><time datetime="${date}">2026-08-15 10:15</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>\n`;
  }
  html = html.slice(0, insertPos) + cards + html.slice(insertPos);

  // Renumber ALL data-index globally
  let cardNum = 0;
  html = html.replace(/data-index="\d+"/g, () => {
    cardNum++;
    return `data-index="${String(cardNum).padStart(2, '0')}"`;
  });

  // Update article count for 主星细读 section
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

  const firstCardIdx = html.indexOf('<article class="article-card"');
  if (firstCardIdx === -1) throw new Error('Cannot find first card in EN index');

  let cards = '';
  for (const a of articles) {
    cards += `<article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Main Stars</span><span>Bilingual</span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read more</a>
            </div>
          </article>
          `;
  }
  html = html.slice(0, firstCardIdx) + cards + html.slice(firstCardIdx);

  let cardNum = 0;
  html = html.replace(/data-index="\d+"/g, () => {
    cardNum++;
    return `data-index="${String(cardNum).padStart(2, '0')}"`;
  });

  const countMatch = html.match(/(\d+)\s*articles/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    html = html.replace(countMatch[0], (oldCount + articles.length) + ' articles');
  }

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

// === Topic Page (main stars) ===
function updateTopic() {
  const p = path.join(__dirname, 'articles', 'ziwei-main-stars.html');
  let html = fs.readFileSync(p, 'utf8');

  const firstCardIdx = html.indexOf('<article class="article-card"');
  if (firstCardIdx === -1) throw new Error('Cannot find first card in topic page');

  let cards = '';
  for (const a of articles) {
    cards += `<article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">主星细读</span><span><time datetime="${date}">${date}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
          `;
  }
  html = html.slice(0, firstCardIdx) + cards + html.slice(firstCardIdx);

  let cardNum = 0;
  html = html.replace(/data-index="\d+"/g, () => {
    cardNum++;
    return `data-index="${String(cardNum).padStart(2, '0')}"`;
  });

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
  console.log('Updated topic page (main stars)');
}

// === Feeds ===
function updateFeed(feedPath, isEn) {
  let xml = fs.readFileSync(feedPath, 'utf8');
  xml = xml.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);

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
    <lastmod>2026-08-15</lastmod>
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
