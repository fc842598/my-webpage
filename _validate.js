const fs = require('fs');

const slugs = [
  'ziwei-tianzhaigong-hualu',
  'ziwei-fudegong-hualu',
  'ziwei-xiongdigong-huaquan',
  'ziwei-jieegong-huaquan',
  'ziwei-qianyigong-huaquan'
];

let errors = 0;

for (const slug of slugs) {
  // Check CN
  const cn = fs.readFileSync(`C:/Users/1/Desktop/doubao-work/articles/${slug}.html`, 'utf8');
  const cnJsonBlocks = (cn.match(/<script type="application\/ld\+json">/g) || []).length;
  const cnHasAnalytics = cn.includes('site-analytics.js');
  const cnHasCss = cn.includes('articles.css');
  const cnHasCta = cn.includes('article-bottom-link');
  const cnHasHreflangEn = cn.includes(`hreflang="en"`) && cn.includes(`en/${slug}.html`);
  const cnHasBreadcrumb = cn.includes('BreadcrumbList');
  const cnHasOrbit = cn.includes('article-orbit');
  const cnHasFooter = cn.includes('粤ICP备2026055337号-1');
  
  if (cnJsonBlocks !== 2) { console.log(`ERROR: ${slug} CN has ${cnJsonBlocks} JSON-LD blocks (expected 2)`); errors++; }
  if (!cnHasAnalytics) { console.log(`ERROR: ${slug} CN missing analytics`); errors++; }
  if (!cnHasCss) { console.log(`ERROR: ${slug} CN missing CSS`); errors++; }
  if (!cnHasCta) { console.log(`ERROR: ${slug} CN missing CTA`); errors++; }
  if (!cnHasHreflangEn) { console.log(`ERROR: ${slug} CN missing hreflang en`); errors++; }
  if (!cnHasBreadcrumb) { console.log(`ERROR: ${slug} CN missing BreadcrumbList`); errors++; }
  if (!cnHasOrbit) { console.log(`ERROR: ${slug} CN missing article-orbit`); errors++; }
  if (!cnHasFooter) { console.log(`ERROR: ${slug} CN missing footer`); errors++; }
  
  // Parse JSON-LD
  const cnJsonMatches = [...cn.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const m of cnJsonMatches) {
    try { JSON.parse(m[1]); } catch(e) { console.log(`ERROR: ${slug} CN JSON-LD parse error: ${e.message}`); errors++; }
  }
  
  // Check EN
  const en = fs.readFileSync(`C:/Users/1/Desktop/doubao-work/articles/en/${slug}.html`, 'utf8');
  const enJsonBlocks = (en.match(/<script type="application\/ld\+json">/g) || []).length;
  const enHasAnalytics = en.includes('site-analytics.js');
  const enHasCss = en.includes('articles.css');
  const enHasCta = en.includes('article-bottom-link');
  const enHasHreflangZh = en.includes(`hreflang="zh-CN"`) && en.includes(`../${slug}.html`);
  const enNoBreadcrumb = !en.includes('BreadcrumbList');
  const enNoOrbit = !en.includes('article-orbit');
  const enHasFooter = en.includes('Yue ICP 2026055337-1');
  const enHasQuickChart = en.includes('Quick Chart');
  
  if (enJsonBlocks !== 1) { console.log(`ERROR: ${slug} EN has ${enJsonBlocks} JSON-LD blocks (expected 1)`); errors++; }
  if (!enHasAnalytics) { console.log(`ERROR: ${slug} EN missing analytics`); errors++; }
  if (!enHasCss) { console.log(`ERROR: ${slug} EN missing CSS`); errors++; }
  if (!enHasCta) { console.log(`ERROR: ${slug} EN missing CTA`); errors++; }
  if (!enHasHreflangZh) { console.log(`ERROR: ${slug} EN missing hreflang zh-CN`); errors++; }
  if (!enNoBreadcrumb) { console.log(`ERROR: ${slug} EN should NOT have BreadcrumbList`); errors++; }
  if (!enNoOrbit) { console.log(`ERROR: ${slug} EN should NOT have article-orbit`); errors++; }
  if (!enHasFooter) { console.log(`ERROR: ${slug} EN missing footer`); errors++; }
  if (!enHasQuickChart) { console.log(`ERROR: ${slug} EN missing Quick Chart nav`); errors++; }
  
  const enJsonMatches = [...en.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const m of enJsonMatches) {
    try { JSON.parse(m[1]); } catch(e) { console.log(`ERROR: ${slug} EN JSON-LD parse error: ${e.message}`); errors++; }
  }
  
  console.log(`OK: ${slug} (CN: ${cnJsonBlocks} JSON-LD, EN: ${enJsonBlocks} JSON-LD)`);
}

// Check indexes
const cnIdx = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/index.html', 'utf8');
const enIdx = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/en/index.html', 'utf8');
const topic = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/ziwei-four-transformations.html', 'utf8');

for (const slug of slugs) {
  if (!cnIdx.includes(slug + '.html')) { console.log(`ERROR: CN index missing ${slug}`); errors++; }
  if (!enIdx.includes(slug + '.html')) { console.log(`ERROR: EN index missing ${slug}`); errors++; }
  if (!topic.includes(slug + '.html')) { console.log(`ERROR: Topic page missing ${slug}`); errors++; }
}

// Check feeds
const cnFeed = fs.readFileSync('C:/Users/1/Desktop/doubao-work/feed.xml', 'utf8');
const enFeed = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/en/feed.xml', 'utf8');
const cnFeedItems = (cnFeed.match(/<item>/g) || []).length;
const enFeedItems = (enFeed.match(/<item>/g) || []).length;
if (cnFeedItems !== 80) { console.log(`ERROR: CN feed has ${cnFeedItems} items (expected 80)`); errors++; }
if (enFeedItems !== 80) { console.log(`ERROR: EN feed has ${enFeedItems} items (expected 80)`); errors++; }

for (const slug of slugs) {
  if (!cnFeed.includes(slug)) { console.log(`ERROR: CN feed missing ${slug}`); errors++; }
  if (!enFeed.includes(slug)) { console.log(`ERROR: EN feed missing ${slug}`); errors++; }
}

// Check sitemaps
const cnSm = fs.readFileSync('C:/Users/1/Desktop/doubao-work/sitemap-articles.xml', 'utf8');
const enSm = fs.readFileSync('C:/Users/1/Desktop/doubao-work/sitemap-en.xml', 'utf8');
for (const slug of slugs) {
  if (!cnSm.includes(slug)) { console.log(`ERROR: CN sitemap missing ${slug}`); errors++; }
  if (!enSm.includes(slug)) { console.log(`ERROR: EN sitemap missing ${slug}`); errors++; }
}

// Validate index JSON-LD
for (const [name, content] of [['CN index', cnIdx], ['EN index', enIdx], ['Topic', topic]]) {
  const matches = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const m of matches) {
    try { JSON.parse(m[1]); } catch(e) { console.log(`ERROR: ${name} JSON-LD parse error: ${e.message}`); errors++; }
  }
  console.log(`OK: ${name} (${matches.length} JSON-LD blocks)`);
}

console.log(`CN feed items: ${cnFeedItems}, EN feed items: ${enFeedItems}`);

if (errors === 0) console.log('\n=== ALL VALIDATIONS PASSED ===');
else console.log(`\n=== ${errors} ERRORS FOUND ===`);
