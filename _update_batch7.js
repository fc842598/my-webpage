const fs = require('fs');
const path = require('path');

const date = '2026-08-16T10:15:00+08:00';
const pubDate = 'Sun, 16 Aug 2026 02:15:00 +0000';

// 3 main star articles
const mainStars = [
  { slug: 'ziwei-tianliang-zuoming', cnTitle: '紫微斗数天梁坐命：荫星入命的人，老成持重但别太说教', cnDesc: '天梁星坐命，成熟稳重、逢凶化吉、有长辈缘，但也容易好为人师、想太多。天梁坐命的人，学会倾听比给建议更重要。', enTitle: 'Tian Liang Star in Life Palace: The Protector Who Must Not Preach', enDesc: 'Tian Liang in the Life Palace brings maturity, resilience, and elder benefactors, but also a tendency to lecture.' },
  { slug: 'ziwei-qisha-zuoming', cnTitle: '紫微斗数七杀坐命：将星入命的人，能扛事但别太独', cnDesc: '七杀星坐命，刚烈、果断、能扛事，是天生的开拓者。但七杀也主孤克，太独立容易孤军奋战，学会借力是功课。', enTitle: 'Qi Sha Star in Life Palace: The General Who Carries All', enDesc: 'Qi Sha in the Life Palace brings ferocity, decisiveness, and resilience \u2014 a born pioneer.' },
  { slug: 'ziwei-pojun-zuoming', cnTitle: '紫微斗数破军坐命：耗星入命的人，敢破敢立但别乱拆', cnDesc: '破军星坐命，敢于打破旧秩序、开创新局面，但也容易破坏大于建设。破军坐命的人，学会「破中有立」是功课。', enTitle: 'Po Jun Star in Life Palace: The Breaker Who Builds Anew', enDesc: 'Po Jun in the Life Palace brings courage to break old orders and create anew, but risk of destruction outpacing construction.' }
];

// 7 helper/malice star articles
const helperStars = [
  { slug: 'ziwei-zuofu-youbi', cnTitle: '紫微斗数左辅右弼：帝王的左右手，有这两颗星的人有人帮', cnDesc: '左辅右弼是助力星，主有人帮、有人撑。命宫或三方有左辅右弼，做事有人搭把手，成功不孤单。', enTitle: 'Zuo Fu and You Bi: The Emperor\u2019s Right and Left Hands', enDesc: 'Zuo Fu and You Bi are assistance stars \u2014 help and support in all endeavors.' },
  { slug: 'ziwei-wenchang-wenqu', cnTitle: '紫微斗数文昌文曲：才华和考试星，有这两颗星的人会读书有才艺', cnDesc: '文昌文曲主才华、学业和文书。命宫有昌曲的人聪明好学、有文采或艺术天赋，但也可能「想得太多做得太少」。', enTitle: 'Wen Chang and Wen Qu: Stars of Talent and Exams', enDesc: 'Wen Chang and Wen Qu rule talent, scholarship, and documents \u2014 intelligence and artistic gift.' },
  { slug: 'ziwei-tiankui-tianyue', cnTitle: '紫微斗数天魁天钺：贵人星，命里有这两颗星的人关键时刻有人拉', cnDesc: '天魁天钺是贵人星，主关键时刻有人提携。命宫或三方有魁钺，遇难呈祥，总有人在你最需要的时候出现。', enTitle: 'Tian Kui and Tian Yue: The Benefactor Stars', enDesc: 'Tian Kui and Tian Yue are benefactor stars, ruling crucial help from others at key moments.' },
  { slug: 'ziwei-lucun-xing', cnTitle: '紫微斗数禄存星：天上的财库，有禄存的人能存钱但别抠', cnDesc: '禄存星主财库和积蓄，是「守财星」。命宫或财帛宫有禄存，能赚钱也能存钱，但也可能吝啬或保守。', enTitle: 'Lu Cun Star: The Heavenly Treasury', enDesc: 'Lu Cun rules treasury and savings \u2014 the wealth-preserving star, but also possible stinginess.' },
  { slug: 'ziwei-qingyang-tuoluo', cnTitle: '紫微斗数擎羊陀罗：煞星不是坏星，用对了是动力', cnDesc: '擎羊陀罗是四煞中的两颗，主冲突和拖延。但煞星不是凶星——它们代表动力和磨炼，用对了反成大器。', enTitle: 'Qing Yang and Tuo Luo: The Malefics Are Not Evil', enDesc: 'Qing Yang and Tuo Luo rule conflict and delay, but channeled well they forge achievement.' },
  { slug: 'ziwei-huoxing-lingxing', cnTitle: '紫微斗数火星铃星：爆发力和隐忍的火，用对了能成大事', cnDesc: '火星铃星是四煞中的火性煞星，主急躁和爆发。但火也主能量和行动力，跟贪狼组合更有突发横财的可能。', enTitle: 'Huo Xing and Ling Xing: Explosive and Smoldering Fire', enDesc: 'Huo Xing and Ling Xing rule impatience and eruption, but also energy and sudden opportunity.' },
  { slug: 'ziwei-dikong-dijie', cnTitle: '紫微斗数地空地劫：空的智慧，有这两颗星的人不适合走寻常路', cnDesc: '地空地劫主空亡和损耗，传统认为不吉。但空劫也主灵感和超脱，用对了适合宗教、艺术、创新，走寻常路反而痛苦。', enTitle: 'Di Kong and Di Jie: The Wisdom of Emptiness', enDesc: 'Di Kong and Di Jie rule emptiness and loss, but also inspiration and transcendence for unconventional paths.' }
];

const allArticles = [...mainStars, ...helperStars];

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
              <div class="card-meta"><span class="tag">${cnTag}</span><span><time datetime="${date}">2026-08-16 10:15</time></span></div>
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

// === CN Index ===
function updateCnIndex() {
  const p = path.join(__dirname, 'articles', 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  html = insertCards(html, '<h2>主星细读</h2>', mainStars, '主星细读');
  html = insertCards(html, '<h2>辅煞曜</h2>', helperStars, '辅煞曜');
  html = updateCount(html, '<h2>主星细读</h2>', mainStars.length);
  html = updateCount(html, '<h2>辅煞曜</h2>', helperStars.length);
  html = renumberCards(html);
  html = insertJsonLd(html, allArticles);
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated CN index');
}

// === EN Index ===
function updateEnIndex() {
  const p = path.join(__dirname, 'articles', 'en', 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  const firstCardIdx = html.indexOf('<article class="article-card"');
  let cards = '';
  for (const a of allArticles) {
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
  html = renumberCards(html);
  const countMatch = html.match(/(\d+)\s*articles/);
  if (countMatch) {
    html = html.replace(countMatch[0], (parseInt(countMatch[1]) + allArticles.length) + ' articles');
  }
  // JSON-LD
  const itemListIdx = html.indexOf('"@type": "ItemList"');
  const arrStart = html.indexOf('[', itemListIdx);
  const arrInsertPos = arrStart + 1;
  let jsonItems = '';
  for (const a of allArticles) {
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

// === Topic Pages ===
function updateTopic(topicFile, articles, cnTag) {
  const p = path.join(__dirname, 'articles', topicFile);
  let html = fs.readFileSync(p, 'utf8');
  const firstCardIdx = html.indexOf('<article class="article-card"');
  let cards = '';
  for (const a of articles) {
    cards += `<article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">${cnTag}</span><span><time datetime="${date}">${date}</time></span></div>
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
  console.log('Updated topic: ' + topicFile);
}

// === Feeds ===
function updateFeed(feedPath, isEn) {
  let xml = fs.readFileSync(feedPath, 'utf8');
  xml = xml.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);
  let items = '';
  for (const a of allArticles) {
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

// === Sitemaps ===
function updateSitemap(smPath, isEn) {
  let xml = fs.readFileSync(smPath, 'utf8');
  let urls = '';
  for (const a of allArticles) {
    const link = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
    urls += `  <url>
    <loc>${link}</loc>
    <lastmod>2026-08-16</lastmod>
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
updateTopic('ziwei-main-stars.html', mainStars, '主星细读');
updateTopic('ziwei-helper-malice-stars.html', helperStars, '辅煞曜');
updateFeed(path.join(__dirname, 'feed.xml'), false);
updateFeed(path.join(__dirname, 'articles', 'en', 'feed.xml'), true);
updateSitemap(path.join(__dirname, 'sitemap-articles.xml'), false);
updateSitemap(path.join(__dirname, 'sitemap-en.xml'), true);
console.log('All updates complete.');
