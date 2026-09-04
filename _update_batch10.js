const fs = require('fs');
const path = require('path');
const date = '2026-08-19T10:15:00+08:00';
const dateDisplay = '2026-08-19 10:15';
const pubDate = 'Wed, 19 Aug 2026 02:15:00 +0000';
const smDate = '2026-08-19';

const articles = [
  { slug: 'ziwei-geju-riyue-fanbei', cnTitle: '紫微斗数日月反背格：太阳太阴明暗错位，辛苦但能成的格局', cnDesc: '日月反背是太阳落夜间宫位、太阴落白天宫位的格局，主一生辛苦、多劳少得。但反背不是注定差，很多人靠后天努力翻盘。', enTitle: 'Ri Yue Fan Bei: Sun and Moon Reversed — Hardship That Can Still Succeed', enDesc: 'Ri Yue Fan Bei is when the sun falls in night palaces and the moon in day palaces, ruling lifelong toil. But it doesn\'t guarantee failure.' },
  { slug: 'ziwei-geju-junchen-qinghui', cnTitle: '紫微斗数君臣庆会格：紫微得众星辅佐，最完整的领导格局', cnDesc: '君臣庆会是紫微在命宫，三方有左辅右弼、文昌文曲、天魁天钺会聚的格局。主领导力强、团队完整、事业有成。', enTitle: 'Jun Chen Qing Hui: Zi Wei Supported by All Ministers', enDesc: 'Jun Chen Qing Hui is when Zi Wei in Life has Zuo Fu/You Bi, Wen Chang/Wen Qu, and Tian Kui/Tian Yue gathering, ruling strong leadership.' },
  { slug: 'ziwei-geju-caisan-jiaji', cnTitle: '紫微斗数财荫夹印格：天相被化禄和天梁夹住，稳中有财的格局', cnDesc: '财荫夹印是天相在命宫，邻宫有化禄和天梁相夹的格局。主财运稳、有荫庇、事业有靠山。', enTitle: 'Cai Yin Jia Yin: Tian Xiang Sandwiched by Hua Lu and Tian Liang', enDesc: 'Cai Yin Jia Yin is when Tian Xiang in Life is sandwiched by Hua Lu and Tian Liang, ruling stable wealth and protection.' },
  { slug: 'ziwei-geju-lingchang-tuowu', cnTitle: '紫微斗数铃昌陀武格：凶格，主意外和波折，但可以提前防范', cnDesc: '铃昌陀武是铃星、文昌、陀罗、武曲四星会聚的凶格，主意外、波折和阻滞。但凶格不是注定出事，而是提醒你谨慎。', enTitle: 'Ling Chang Tuo Wu: An Inauspicious Pattern of Accidents — But Preventable', enDesc: 'Ling Chang Tuo Wu is an inauspicious pattern when Ling Xing, Wen Chang, Tuo Luo, and Wu Qu gather, ruling accidents and setbacks.' },
  { slug: 'ziwei-geju-jizhu-maoyou', cnTitle: '紫微斗数极居卯酉格：紫微在卯酉，虚名虚利还是修行命', cnDesc: '极居卯酉是紫微在卯宫或酉宫的格局，古人认为虚名虚利。但这个格局也主精神追求和修行缘分。', enTitle: 'Ji Ju Mao You: Zi Wei in Mao or You — Empty Fame or Spiritual Path', enDesc: 'Ji Ju Mao You is when Zi Wei sits in Mao or You palace, ruling empty fame but also spiritual pursuit.' },
  { slug: 'ziwei-geju-shizhong-yinyu', cnTitle: '紫微斗数石中隐玉格：巨门在子午，口才深藏不露的格局', cnDesc: '石中隐玉是巨门在子宫或午宫守命的格局，主口才好但深藏不露，中年后大放异彩。', enTitle: 'Shi Zhong Yin Yu: Ju Men in Zi or Wu — Eloquence Hidden Like Jade in Stone', enDesc: 'Shi Zhong Yin Yu is when Ju Men guards Life in Zi or Wu, ruling eloquence that stays hidden until middle age.' },
  { slug: 'ziwei-geju-yongxing-rumiao', cnTitle: '紫微斗数英星入庙格：破军在子午，破而后立的大将格局', cnDesc: '英星入庙是破军在子宫或午宫守命的格局，主开创性强、能破能立，是大器晚成的格局。', enTitle: 'Yong Xing Ru Miao: Po Jun in Zi or Wu — The General Who Breaks Then Builds', enDesc: 'Yong Xing Ru Miao is when Po Jun guards Life in Zi or Wu, ruling strong pioneering and the ability to break and build.' },
  { slug: 'ziwei-geju-matou-daijian', cnTitle: '紫微斗数马头带箭格：七杀在午加擎羊，刚猛到极致的武将格局', cnDesc: '马头带箭是七杀在午宫守命且擎羊同宫的格局，主刚猛、决断、武职荣身。但刚则易折，要防意外和刑伤。', enTitle: 'Ma Tou Dai Jian: Qi Sha in Wu with Qing Yang — The Ultimate Warrior Pattern', enDesc: 'Ma Tou Dai Jian is when Qi Sha guards Life in Wu with Qing Yang, ruling fierceness and decisiveness, but the rigid break easily.' },
  { slug: 'ziwei-geju-fanshui-taohua', cnTitle: '紫微斗数泛水桃花格：贪狼在子，桃花泛滥但也才艺出众', cnDesc: '泛水桃花是贪狼在子宫守命的格局，主桃花旺、多才多艺、感情丰富。但桃花太旺也容易感情纠葛。', enTitle: 'Fan Shui Tao Hua: Tan Lang in Zi — Overflowing Romance but Also Talent', enDesc: 'Fan Shui Tao Hua is when Tan Lang guards Life in Zi, ruling strong romance, versatility, and rich emotions.' },
  { slug: 'ziwei-geju-zifu-chaoyuan', cnTitle: '紫微斗数紫府朝垣格：紫微在命天府来朝，有主位也有资源的格局', cnDesc: '紫府朝垣是紫微在命宫、天府在三方来朝的格局，主地位高、资源足、领导力强。', enTitle: 'Zi Fu Chao Yuan: Zi Wei in Life with Tian Fu Facing — Position and Resources', enDesc: 'Zi Fu Chao Yuan is when Zi Wei is in Life and Tian Fu faces from the triple direction, ruling high status and resources.' }
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

// CN Index
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

// EN Index
function updateEnIndex() {
  const p = path.join(__dirname, 'articles', 'en', 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  // Find the main article list (after "Learn Zi Wei Dou Shu in Plain English")
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
  // Update count - "793 Articles"
  const countMatch = html.match(/(\d+)\s*Articles/);
  if (countMatch) html = html.replace(countMatch[0], (parseInt(countMatch[1]) + articles.length) + ' Articles');
  html = insertJsonLd(html, articles, true);
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated EN index');
}

// Topic Page
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
  // Update count
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
