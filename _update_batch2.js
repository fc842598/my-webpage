const fs = require('fs');

const date = '2026-08-12T10:30:00+08:00';
const dateShort = '2026-08-12';
const pubDate = 'Wed, 12 Aug 2026 02:30:00 +0000';

const newArticles = [
  {
    slug: 'ziwei-liunian-fumugong-zhangbei-fangzi-shouxu',
    cnTitle: '紫微斗数流年走到父母宫，是长辈有事还是房子手续先动',
    enTitle: 'When the Annual Chart Lands on the Parents Palace: Elders or Paperwork?',
    cnCard: '流年走到父母宫：长辈有事还是手续先动',
    enCard: 'Annual Chart on Parents Palace: Elders or Paperwork?',
    cnCategory: '大限流年',
    enCategory: 'Zi Wei Dou Shu'
  },
  {
    slug: 'ziwei-fumu-gei-ziyuan-zong-ganyu',
    cnTitle: '紫微斗数父母愿意给资源却总干预：化禄、化权和巨门怎么分',
    enTitle: 'When Parents Give Resources but Can\'t Stop Interfering',
    cnCard: '父母给资源却总干预：化禄化权巨门怎么分',
    enCard: 'Parents Give Resources but Can\'t Stop Interfering',
    cnCategory: '宫位组合',
    enCategory: 'Zi Wei Dou Shu'
  },
  {
    slug: 'ziwei-minggong-huaquan-zhujian-haishi-guquan',
    cnTitle: '紫微斗数命宫化权，到底是主见还是孤权：先看谁来承接你的决定',
    enTitle: 'Life Palace With Hua Quan: Conviction or Isolated Power?',
    cnCard: '命宫化权：主见还是孤权',
    enCard: 'Life Palace Hua Quan: Conviction or Isolated Power',
    cnCategory: '四化细读',
    enCategory: 'Zi Wei Dou Shu'
  },
  {
    slug: 'ziwei-fumugong-hualu-jumen-geiqian-zhengzhi',
    cnTitle: '紫微斗数父母宫化禄又见巨门，家里给钱为什么也伴随争执',
    enTitle: 'Parents Palace With Hua Lu and Ju Men: Money With Arguments',
    cnCard: '父母宫化禄见巨门：给钱为什么也争执',
    enCard: 'Parents Palace Hua Lu + Ju Men: Money With Arguments',
    cnCategory: '四化细读',
    enCategory: 'Zi Wei Dou Shu'
  },
  {
    slug: 'ziwei-pojun-caibo-guanlu-bianjuqian',
    cnTitle: '紫微斗数破军在财帛和官禄，赚的是变局钱还是重整钱',
    enTitle: 'Po Jun in Wealth or Career: Change Money or Turnaround Money?',
    cnCard: '破军在财帛和官禄：变局钱还是重整钱',
    enCard: 'Po Jun in Wealth or Career: Change or Turnaround Money',
    cnCategory: '主星',
    enCategory: 'Zi Wei Dou Shu'
  },
  {
    slug: 'ziwei-tuoluo-qianyigong-tuoshouxu-haishixingdong',
    cnTitle: '紫微斗数陀罗在迁移宫，拖的是手续、路线还是行动',
    enTitle: 'Tuo Luo in the Travel Palace: Delayed Papers, Routes, or Decisions?',
    cnCard: '陀罗在迁移宫：拖的是手续还是行动',
    enCard: 'Tuo Luo in Travel Palace: What Gets Delayed?',
    cnCategory: '辅煞曜',
    enCategory: 'Zi Wei Dou Shu'
  },
  {
    slug: 'ziwei-yuelang-tianmen-bushi-ruo',
    cnTitle: '紫微斗数月朗天门为什么不是弱：太阴得位先看清明，不先看柔',
    enTitle: 'Moon Over the Gate: Why Yue Lang Tian Men Is Not Weak',
    cnCard: '月朗天门为什么不是弱：太阴得位先看清明',
    enCard: 'Moon Over the Gate: Why It\'s Not a Weak Pattern',
    cnCategory: '格局命例',
    enCategory: 'Zi Wei Dou Shu'
  },
  {
    slug: 'ziwei-lianzhen-qisha-fudegong-yingcheng-bunengkang',
    cnTitle: '紫微斗数廉贞七杀在福德，硬撑和能扛不是一回事',
    enTitle: 'Lian Zhen and Qi Sha in the Mental Palace: Toughing vs. Carrying',
    cnCard: '廉贞七杀在福德：硬撑和能扛不是一回事',
    enCard: 'Lian Zhen + Qi Sha in Mental Palace: Toughing vs. Carrying',
    cnCategory: '格局命例',
    enCategory: 'Zi Wei Dou Shu'
  },
  {
    slug: 'ziwei-guanlugong-hangye-zhiwei-zeren-shui-zhong',
    cnTitle: '紫微斗数官禄宫到底更偏行业、职位还是责任：别把三个问题揉成一句话',
    enTitle: 'The Career Palace: Industry, Position, or Responsibility?',
    cnCard: '官禄宫更偏行业、职位还是责任',
    enCard: 'Career Palace: Industry, Position, or Responsibility?',
    cnCategory: '看盘方法',
    enCategory: 'Zi Wei Dou Shu'
  }
];

// ============ 1. Chinese index ============
console.log('Updating Chinese index...');
let cnIndex = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/index.html', 'utf8');

// For each article, find its category section and insert a card after the <summary>
for (const a of newArticles) {
  // Find the category h2
  const catH2 = cnIndex.indexOf(`<h2>${a.cnCategory}</h2>`);
  if (catH2 < 0) { console.log(`WARNING: category ${a.cnCategory} not found`); continue; }
  
  // Find the <summary> after this h2
  const summaryEnd = cnIndex.indexOf('</summary>', catH2) + '</summary>'.length;
  
  // Insert card
  const card = `\n          <a class="card-link" href="${a.slug}.html">${a.cnCard}</a>`;
  cnIndex = cnIndex.slice(0, summaryEnd) + card + cnIndex.slice(summaryEnd);
}

// Update JSON-LD ItemList - add all 9 at position 1-9
const cnJsonLdStart = cnIndex.indexOf('"@type": "ItemList"');
const cnItemListStart = cnIndex.indexOf('[', cnIndex.indexOf('"itemListElement"', cnJsonLdStart)) + 1;

let cnNewJsonLd = '';
for (let i = 0; i < newArticles.length; i++) {
  cnNewJsonLd += `
      {
        "@type": "ListItem",
        "position": ${i + 1},
        "url": "https://yuetianai.com/articles/${newArticles[i].slug}.html",
        "name": "${newArticles[i].cnTitle}"
      },`;
}
cnIndex = cnIndex.slice(0, cnItemListStart) + cnNewJsonLd + cnIndex.slice(cnItemListStart);

// Renumber all positions
let cnPos = 0;
cnIndex = cnIndex.replace(/"position":\s*\d+/g, () => { cnPos++; return `"position": ${cnPos}`; });

fs.writeFileSync('C:/Users/1/Desktop/doubao-work/articles/index.html', cnIndex.replace(/\r\n/g, '\n'), 'utf8');
console.log('Chinese index updated.');

// ============ 2. English index ============
console.log('Updating English index...');
let enIndex = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/en/index.html', 'utf8');

// Insert all 9 cards at the beginning of the visible list
const enFirstCard = enIndex.indexOf('<a class="card-link"');
let enCards = '';
for (let i = 0; i < newArticles.length; i++) {
  enCards += `<a class="card-link" data-index="${String(i + 1).padStart(2, '0')}" href="${newArticles[i].slug}.html">${newArticles[i].enCard}</a>\n          `;
}
enIndex = enIndex.slice(0, enFirstCard) + enCards + enIndex.slice(enFirstCard);

// Renumber data-index
let enCardIdx = 0;
enIndex = enIndex.replace(/data-index="\d+"/g, () => { enCardIdx++; return `data-index="${String(enCardIdx).padStart(2, '0')}"`; });

// Update total count - find the count number
const enCountMatch = enIndex.match(/(\d+)\s*articles/);
if (enCountMatch) {
  const oldCount = parseInt(enCountMatch[1]);
  enIndex = enIndex.replace(/(\d+)(\s*articles)/, `${oldCount + 9}$2`);
}
// Also try Chinese count format
const enCountMatch2 = enIndex.match(/(?:共\s*)(\d+)(?:\s*篇)/);
if (enCountMatch2) {
  const oldCount = parseInt(enCountMatch2[1]);
  enIndex = enIndex.replace(/(共\s*)(\d+)(\s*篇)/, `$1${oldCount + 9}$3`);
}

// Update JSON-LD
const enJsonLdStart = enIndex.indexOf('"@type": "ItemList"');
const enItemListStart = enIndex.indexOf('[', enIndex.indexOf('"itemListElement"', enJsonLdStart)) + 1;

let enNewJsonLd = '';
for (let i = 0; i < newArticles.length; i++) {
  enNewJsonLd += `
      {
        "@type": "ListItem",
        "position": ${i + 1},
        "url": "https://yuetianai.com/articles/en/${newArticles[i].slug}.html",
        "name": "${newArticles[i].enTitle}"
      },`;
}
enIndex = enIndex.slice(0, enItemListStart) + enNewJsonLd + enIndex.slice(enItemListStart);

let enPos = 0;
enIndex = enIndex.replace(/"position":\s*\d+/g, () => { enPos++; return `"position": ${enPos}`; });

fs.writeFileSync('C:/Users/1/Desktop/doubao-work/articles/en/index.html', enIndex.replace(/\r\n/g, '\n'), 'utf8');
console.log('English index updated.');

// ============ 3. Topic page (四化细读 only: articles 3 and 4) ============
console.log('Updating topic page...');
let topic = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/ziwei-four-transformations.html', 'utf8');

const topicArticles = newArticles.filter(a => a.cnCategory === '四化细读');
const topicFirstCard = topic.indexOf('<a class="card-link"');
let topicCards = '';
for (const a of topicArticles) {
  topicCards += `<a class="card-link" href="${a.slug}.html">${a.cnCard}</a>\n          `;
}
if (topicFirstCard >= 0) {
  topic = topic.slice(0, topicFirstCard) + topicCards + topic.slice(topicFirstCard);
}

// Update JSON-LD
const topicJsonLdStart = topic.indexOf('"@type": "ItemList"');
if (topicJsonLdStart >= 0) {
  const topicItemListStart = topic.indexOf('[', topic.indexOf('"itemListElement"', topicJsonLdStart)) + 1;
  let topicNewItems = '';
  for (let i = 0; i < topicArticles.length; i++) {
    topicNewItems += `
        {
          "@type": "ListItem",
          "position": ${i + 1},
          "url": "https://yuetianai.com/articles/${topicArticles[i].slug}.html",
          "name": "${topicArticles[i].cnTitle}"
        },`;
  }
  topic = topic.slice(0, topicItemListStart) + topicNewItems + topic.slice(topicItemListStart);
  let topicPos = 0;
  topic = topic.replace(/"position":\s*\d+/g, () => { topicPos++; return `"position": ${topicPos}`; });
}

fs.writeFileSync('C:/Users/1/Desktop/doubao-work/articles/ziwei-four-transformations.html', topic.replace(/\r\n/g, '\n'), 'utf8');
console.log('Topic page updated.');

// ============ 4. Feeds ============
console.log('Updating feeds...');

function makeFeedItem(a, isEn) {
  const url = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
  const title = isEn ? a.enTitle : a.cnTitle;
  const desc = isEn ? a.enTitle : a.cnTitle;
  return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
}

function updateFeed(feedPath, isEn) {
  let feed = fs.readFileSync(feedPath, 'utf8');
  feed = feed.replace(/<lastBuildDate>[^<]+<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);
  
  const newItems = newArticles.map(a => makeFeedItem(a, isEn)).join('\n');
  const firstItem = feed.indexOf('<item>');
  feed = feed.slice(0, firstItem) + newItems + '\n' + feed.slice(firstItem);
  
  // Trim to 80
  let allItems = [];
  let idx = 0;
  while ((idx = feed.indexOf('<item>', idx)) !== -1) {
    const endIdx = feed.indexOf('</item>', idx) + '</item>'.length;
    allItems.push(feed.slice(idx, endIdx));
    idx = endIdx;
  }
  if (allItems.length > 80) allItems = allItems.slice(0, 80);
  
  const beforeItems = feed.slice(0, feed.indexOf('<item>'));
  const afterAll = feed.slice(feed.lastIndexOf('</item>') + '</item>'.length);
  feed = beforeItems + allItems.join('\n    ') + afterAll;
  
  fs.writeFileSync(feedPath, feed.trimEnd() + '\n', 'utf8');
  console.log(`${isEn ? 'EN' : 'CN'} feed: ${allItems.length} items`);
}

updateFeed('C:/Users/1/Desktop/doubao-work/feed.xml', false);
updateFeed('C:/Users/1/Desktop/doubao-work/articles/en/feed.xml', true);

// ============ 5. Sitemaps ============
console.log('Updating sitemaps...');

function makeSitemapUrl(a, isEn) {
  const url = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${dateShort}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
}

function updateSitemap(smPath, isEn) {
  let sm = fs.readFileSync(smPath, 'utf8');
  const closeIdx = sm.indexOf('</urlset>');
  const newUrls = newArticles.map(a => makeSitemapUrl(a, isEn)).join('\n');
  sm = sm.slice(0, closeIdx) + newUrls + '\n' + sm.slice(closeIdx);
  fs.writeFileSync(smPath, sm.replace(/\r\n/g, '\n'), 'utf8');
  console.log(`${isEn ? 'EN' : 'CN'} sitemap updated.`);
}

updateSitemap('C:/Users/1/Desktop/doubao-work/sitemap-articles.xml', false);
updateSitemap('C:/Users/1/Desktop/doubao-work/sitemap-en.xml', true);

console.log('\n=== All updates complete ===');
