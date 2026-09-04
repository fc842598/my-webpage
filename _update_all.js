const fs = require('fs');

const date = '2026-08-11T15:30:00+08:00';
const dateShort = '2026-08-11';
const pubDate = 'Tue, 11 Aug 2026 07:30:00 +0000';

const newArticles = [
  {
    slug: 'ziwei-tianzhaigong-hualu',
    cnTitle: '紫微斗数田宅宫化禄：有房和有家是两回事',
    cnDesc: '田宅宫化禄不只是房产多。田宅宫看家庭环境、不动产和内心安全感，化禄在这里代表家运顺畅，但"有房"和"有家"要分开读。',
    enTitle: 'Property Palace With Hua Lu: Owning a House and Having a Home Are Not the Same',
    enDesc: 'Hua Lu in the Property Palace can mean real estate gains, but this palace also rules your family environment and sense of inner security.',
    cnCardText: '田宅宫化禄：有房和有家是两回事',
    enCardText: 'Property Palace With Hua Lu: House vs. Home'
  },
  {
    slug: 'ziwei-fudegong-hualu',
    cnTitle: '紫微斗数福德宫化禄：想得开和没心没肺是两回事',
    cnDesc: '福德宫化禄的人通常心态好、会享受，但福德宫看的是精神世界和潜意识，化禄在这里不代表没有烦恼，而是烦恼来得快去得也快。',
    enTitle: 'Mental Palace With Hua Lu: Letting Go and Not Caring at All Are Different',
    enDesc: 'Hua Lu in the Mental Palace usually means an easygoing nature and an ability to enjoy life. But this palace rules your inner world.',
    cnCardText: '福德宫化禄：想得开和没心没肺是两回事',
    enCardText: 'Mental Palace With Hua Lu: Letting Go vs. Not Caring'
  },
  {
    slug: 'ziwei-xiongdigong-huaquan',
    cnTitle: '紫微斗数兄弟宫化权：兄弟姐妹强势，是帮你还是压你',
    cnDesc: '兄弟宫化权代表同辈中有能力强、个性硬的人。化权是掌控星，在兄弟宫要看这个权是助力还是压力，还要和交友宫对看。',
    enTitle: 'Brothers Palace With Hua Quan: Strong Siblings Can Help or Dominate',
    enDesc: 'Hua Quan in the Brothers Palace means capable, strong-willed people in your peer group. The Authority Star here can be a powerful ally or pressure.',
    cnCardText: '兄弟宫化权：兄弟姐妹强势，是帮你还是压你',
    enCardText: 'Brothers Palace With Hua Quan: Help or Dominate'
  },
  {
    slug: 'ziwei-jieegong-huaquan',
    cnTitle: '紫微斗数疾厄宫化权：身体硬朗和硬撑是两回事',
    cnDesc: '疾厄宫化权的人通常体质结实、恢复力强，但化权也主"硬扛"——身体有信号不当回事，容易把小问题拖成大问题。',
    enTitle: 'Health Palace With Hua Quan: Toughing It Out and Being Truly Tough Are Different',
    enDesc: 'Hua Quan in the Health Palace usually means a strong constitution and fast recovery. But the Authority Star also means you push through pain.',
    cnCardText: '疾厄宫化权：身体硬朗和硬撑是两回事',
    enCardText: 'Health Palace With Hua Quan: Tough vs. Toughing It Out'
  },
  {
    slug: 'ziwei-qianyigong-huaquan',
    cnTitle: '紫微斗数迁移宫化权：在外强势，是能力还是压力',
    cnDesc: '迁移宫化权的人在外表现强势、有主见，适合外出发展。但化权在迁移也要看是"在外说了算"还是"在外压力大"，要和命宫对看。',
    enTitle: 'Travel Palace With Hua Quan: Strong on the Outside — Capable or Just Pressured?',
    enDesc: 'Hua Quan in the Travel Palace makes you assertive and capable away from home. But it can mean you lead outside or that the outside pressures you.',
    cnCardText: '迁移宫化权：在外强势，是能力还是压力',
    enCardText: 'Travel Palace With Hua Quan: Capable or Pressured'
  }
];

// ============ 1. Update Chinese index ============
console.log('Updating Chinese index...');
let cnIndex = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/index.html', 'utf8');

// Find the 四化细读 section and insert cards after the summary
const cnSectionStart = cnIndex.indexOf('四化细读</h2>');
const cnDetailsEnd = cnIndex.indexOf('</details>', cnSectionStart);

// Insert visible cards right after the <summary> line in 四化细读 section
const cnSummaryEnd = cnIndex.indexOf('</summary>', cnSectionStart) + '</summary>'.length;
let cnCards = '';
for (const a of newArticles) {
  cnCards += `\n          <a class="card-link" href="${a.slug}.html">${a.cnCardText}</a>`;
}
cnIndex = cnIndex.slice(0, cnSummaryEnd) + cnCards + cnIndex.slice(cnSummaryEnd);

// Update section count 39 -> 44
cnIndex = cnIndex.replace(/(<span>)39(\s*篇<\/span>\s*<span class="section-toggle")/, '$144$2');

// Now update JSON-LD in Chinese index - find the ItemList for 四化细读
// The JSON-LD has itemListElement arrays. We need to find the one that contains 四化细读 articles.
// Actually, looking at the structure, there are multiple JSON-LD blocks. The main one is an ItemList with all articles.
// Let me find the first ItemList and add entries at position 1, shifting others.

// Find the JSON-LD ItemList block
const cnJsonLdStart = cnIndex.indexOf('"@type": "ItemList"');
const cnJsonLdEnd = cnIndex.indexOf(']', cnIndex.indexOf('"itemListElement"', cnJsonLdStart));

// Build new items for JSON-LD (newest first, positions 1-5)
let cnNewJsonLdItems = '';
for (let i = 0; i < newArticles.length; i++) {
  const a = newArticles[i];
  cnNewJsonLdItems += `
      {
        "@type": "ListItem",
        "position": ${i + 1},
        "url": "https://yuetianai.com/articles/${a.slug}.html",
        "name": "${a.cnTitle}"
      },`;
}

// Insert after itemListElement: [
const cnItemListStart = cnIndex.indexOf('[', cnIndex.indexOf('"itemListElement"', cnJsonLdStart)) + 1;
cnIndex = cnIndex.slice(0, cnItemListStart) + cnNewJsonLdItems + cnIndex.slice(cnItemListStart);

// Now renumber all positions after the inserted ones
// Find all position entries and renumber them
let posCounter = 0;
cnIndex = cnIndex.replace(/"position":\s*\d+/g, (match) => {
  posCounter++;
  return `"position": ${posCounter}`;
});

fs.writeFileSync('C:/Users/1/Desktop/doubao-work/articles/index.html', cnIndex.replace(/\r\n/g, '\n'), 'utf8');
console.log('Chinese index updated.');

// ============ 2. Update English index ============
console.log('Updating English index...');
let enIndex = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/en/index.html', 'utf8');

// Insert visible cards at the beginning of the article list (after the first section)
// Find the first card-link in the visible section and insert before it
const enFirstCard = enIndex.indexOf('<a class="card-link"');
let enCards = '';
for (let i = 0; i < newArticles.length; i++) {
  const a = newArticles[i];
  enCards += `<a class="card-link" data-index="${String(i + 1).padStart(2, '0')}" href="${a.slug}.html">${a.enCardText}</a>\n          `;
}
enIndex = enIndex.slice(0, enFirstCard) + enCards + enIndex.slice(enFirstCard);

// Renumber all data-index values
let enCardIdx = 0;
enIndex = enIndex.replace(/data-index="\d+"/g, () => {
  enCardIdx++;
  return `data-index="${String(enCardIdx).padStart(2, '0')}"`;
});

// Update total count (686 -> 691)
enIndex = enIndex.replace(/(共\s*)686(\s*篇)/, '$1691$2');
// Also try other count formats
enIndex = enIndex.replace(/(\()686(\s*articles)/, '$1691$2');
enIndex = enIndex.replace(/>686</, '>691<');

// Update JSON-LD ItemList - add 5 new items at position 1-5
const enJsonLdStart = enIndex.indexOf('"@type": "ItemList"');
let enNewJsonLdItems = '';
for (let i = 0; i < newArticles.length; i++) {
  const a = newArticles[i];
  enNewJsonLdItems += `
      {
        "@type": "ListItem",
        "position": ${i + 1},
        "url": "https://yuetianai.com/articles/en/${a.slug}.html",
        "name": "${a.enTitle}"
      },`;
}
const enItemListStart = enIndex.indexOf('[', enIndex.indexOf('"itemListElement"', enJsonLdStart)) + 1;
enIndex = enIndex.slice(0, enItemListStart) + enNewJsonLdItems + enIndex.slice(enItemListStart);

// Renumber positions
let enPosCounter = 0;
enIndex = enIndex.replace(/"position":\s*\d+/g, () => {
  enPosCounter++;
  return `"position": ${enPosCounter}`;
});

fs.writeFileSync('C:/Users/1/Desktop/doubao-work/articles/en/index.html', enIndex.replace(/\r\n/g, '\n'), 'utf8');
console.log('English index updated.');

// ============ 3. Update topic page ============
console.log('Updating topic page...');
let topic = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/ziwei-four-transformations.html', 'utf8');

// Find the article list section and insert cards
const topicFirstCard = topic.indexOf('<a class="card-link"');
let topicCards = '';
for (const a of newArticles) {
  topicCards += `<a class="card-link" href="${a.slug}.html">${a.cnCardText}</a>\n          `;
}
if (topicFirstCard >= 0) {
  topic = topic.slice(0, topicFirstCard) + topicCards + topic.slice(topicFirstCard);
}

// Update count 73 -> 78
topic = topic.replace(/(共\s*)73(\s*篇)/, '$178$2');
topic = topic.replace(/>73</, '>78<');
topic = topic.replace(/(<span>)73(\s*篇)/, '$178$2');

// Update JSON-LD
const topicJsonLdStart = topic.indexOf('"@type": "ItemList"');
if (topicJsonLdStart >= 0) {
  let topicNewItems = '';
  for (let i = 0; i < newArticles.length; i++) {
    const a = newArticles[i];
    topicNewItems += `
        {
          "@type": "ListItem",
          "position": ${i + 1},
          "url": "https://yuetianai.com/articles/${a.slug}.html",
          "name": "${a.cnTitle}"
        },`;
  }
  const topicItemListStart = topic.indexOf('[', topic.indexOf('"itemListElement"', topicJsonLdStart)) + 1;
  topic = topic.slice(0, topicItemListStart) + topicNewItems + topic.slice(topicItemListStart);
  
  let topicPos = 0;
  topic = topic.replace(/"position":\s*\d+/g, () => {
    topicPos++;
    return `"position": ${topicPos}`;
  });
}

fs.writeFileSync('C:/Users/1/Desktop/doubao-work/articles/ziwei-four-transformations.html', topic.replace(/\r\n/g, '\n'), 'utf8');
console.log('Topic page updated.');

// ============ 4. Update feeds ============
console.log('Updating feeds...');

function makeFeedItem(a, isEn) {
  const url = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
  const title = isEn ? a.enTitle : a.cnTitle;
  const desc = isEn ? a.enDesc : a.cnDesc;
  return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
}

// Chinese feed
let cnFeed = fs.readFileSync('C:/Users/1/Desktop/doubao-work/feed.xml', 'utf8');
cnFeed = cnFeed.replace(/<lastBuildDate>[^<]+<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);
const cnChannelEnd = cnFeed.indexOf('</channel>');
let cnNewItems = newArticles.map(a => makeFeedItem(a, false)).join('\n');
// Insert after <channel>...first item
const cnFirstItem = cnFeed.indexOf('<item>');
cnFeed = cnFeed.slice(0, cnFirstItem) + cnNewItems + '\n' + cnFeed.slice(cnFirstItem);
// Trim to 80 items
const cnItemCount = (cnFeed.match(/<item>/g) || []).length;
if (cnItemCount > 80) {
  // Remove last items
  let items = cnFeed.split(/(?=<item>)/);
  // Keep header + first 80 items + footer
  const header = items[0];
  const itemParts = items.slice(1).filter(s => s.trim().startsWith('<item>'));
  const footer = itemParts.length > 80 ? itemParts.slice(80).join('') : '';
  // Actually need to be more careful - find the </channel> part
  const lastItemEnd = cnFeed.lastIndexOf('</item>') + '</item>'.length;
  const afterItems = cnFeed.slice(lastItemEnd);
  // Count and remove excess items from the end
  let allItems = [];
  let idx = 0;
  while ((idx = cnFeed.indexOf('<item>', idx)) !== -1) {
    const endIdx = cnFeed.indexOf('</item>', idx) + '</item>'.length;
    allItems.push(cnFeed.slice(idx, endIdx));
    idx = endIdx;
  }
  if (allItems.length > 80) {
    allItems = allItems.slice(0, 80);
  }
  const beforeItems = cnFeed.slice(0, cnFeed.indexOf('<item>'));
  const afterAll = cnFeed.slice(cnFeed.lastIndexOf('</item>') + '</item>'.length);
  cnFeed = beforeItems + allItems.join('\n    ') + afterAll;
}
fs.writeFileSync('C:/Users/1/Desktop/doubao-work/feed.xml', cnFeed.trimEnd() + '\n', 'utf8');
console.log('Chinese feed updated. Items: ' + (cnFeed.match(/<item>/g) || []).length);

// English feed
let enFeed = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/en/feed.xml', 'utf8');
enFeed = enFeed.replace(/<lastBuildDate>[^<]+<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);
const enFirstItem = enFeed.indexOf('<item>');
let enNewItems = newArticles.map(a => makeFeedItem(a, true)).join('\n');
enFeed = enFeed.slice(0, enFirstItem) + enNewItems + '\n' + enFeed.slice(enFirstItem);
// Trim to 80
let enAllItems = [];
let enIdx = 0;
while ((enIdx = enFeed.indexOf('<item>', enIdx)) !== -1) {
  const endIdx = enFeed.indexOf('</item>', enIdx) + '</item>'.length;
  enAllItems.push(enFeed.slice(enIdx, endIdx));
  enIdx = endIdx;
}
if (enAllItems.length > 80) enAllItems = enAllItems.slice(0, 80);
const enBeforeItems = enFeed.slice(0, enFeed.indexOf('<item>'));
const enAfterAll = enFeed.slice(enFeed.lastIndexOf('</item>') + '</item>'.length);
enFeed = enBeforeItems + enAllItems.join('\n    ') + enAfterAll;
fs.writeFileSync('C:/Users/1/Desktop/doubao-work/articles/en/feed.xml', enFeed.trimEnd() + '\n', 'utf8');
console.log('English feed updated. Items: ' + enAllItems.length);

// ============ 5. Update sitemaps ============
console.log('Updating sitemaps...');

function makeSitemapUrl(slug, isEn) {
  const url = isEn ? `https://yuetianai.com/articles/en/${slug}.html` : `https://yuetianai.com/articles/${slug}.html`;
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${dateShort}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
}

let cnSitemap = fs.readFileSync('C:/Users/1/Desktop/doubao-work/sitemap-articles.xml', 'utf8');
const cnUrlsetClose = cnSitemap.indexOf('</urlset>');
const cnNewUrls = newArticles.map(a => makeSitemapUrl(a.slug, false)).join('\n');
cnSitemap = cnSitemap.slice(0, cnUrlsetClose) + cnNewUrls + '\n' + cnSitemap.slice(cnUrlsetClose);
fs.writeFileSync('C:/Users/1/Desktop/doubao-work/sitemap-articles.xml', cnSitemap.replace(/\r\n/g, '\n'), 'utf8');
console.log('Chinese sitemap updated.');

let enSitemap = fs.readFileSync('C:/Users/1/Desktop/doubao-work/sitemap-en.xml', 'utf8');
const enUrlsetClose = enSitemap.indexOf('</urlset>');
const enNewUrls = newArticles.map(a => makeSitemapUrl(a.slug, true)).join('\n');
enSitemap = enSitemap.slice(0, enUrlsetClose) + enNewUrls + '\n' + enSitemap.slice(enUrlsetClose);
fs.writeFileSync('C:/Users/1/Desktop/doubao-work/sitemap-en.xml', enSitemap.replace(/\r\n/g, '\n'), 'utf8');
console.log('English sitemap updated.');

console.log('\n=== All updates complete ===');
