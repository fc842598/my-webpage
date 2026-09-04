const fs = require('fs');

const slugs = [
  'ziwei-liunian-fumugong-zhangbei-fangzi-shouxu',
  'ziwei-fumu-gei-ziyuan-zong-ganyu',
  'ziwei-minggong-huaquan-zhujian-haishi-guquan',
  'ziwei-fumugong-hualu-jumen-geiqian-zhengzhi',
  'ziwei-pojun-caibo-guanlu-bianjuqian',
  'ziwei-tuoluo-qianyigong-tuoshouxu-haishixingdong',
  'ziwei-yuelang-tianmen-bushi-ruo',
  'ziwei-lianzhen-qisha-fudegong-yingcheng-bunengkang',
  'ziwei-guanlugong-hangye-zhiwei-zeren-shui-zhong'
];

let errors = 0;

for (const slug of slugs) {
  const cn = fs.readFileSync(`C:/Users/1/Desktop/doubao-work/articles/${slug}.html`, 'utf8');
  const en = fs.readFileSync(`C:/Users/1/Desktop/doubao-work/articles/en/${slug}.html`, 'utf8');
  
  // CN checks
  const cnJsonBlocks = (cn.match(/<script type="application\/ld\+json">/g) || []).length;
  if (cnJsonBlocks !== 2) { console.log(`ERROR: ${slug} CN has ${cnJsonBlocks} JSON-LD blocks`); errors++; }
  if (!cn.includes('site-analytics.js')) { console.log(`ERROR: ${slug} CN missing analytics`); errors++; }
  if (!cn.includes('articles.css')) { console.log(`ERROR: ${slug} CN missing CSS`); errors++; }
  if (!cn.includes('article-bottom-link')) { console.log(`ERROR: ${slug} CN missing CTA`); errors++; }
  if (!cn.includes(`en/${slug}.html`)) { console.log(`ERROR: ${slug} CN missing hreflang en`); errors++; }
  if (!cn.includes('BreadcrumbList')) { console.log(`ERROR: ${slug} CN missing BreadcrumbList`); errors++; }
  if (!cn.includes('article-orbit')) { console.log(`ERROR: ${slug} CN missing orbit`); errors++; }
  if (!cn.includes('粤ICP备2026055337号-1')) { console.log(`ERROR: ${slug} CN missing footer`); errors++; }
  
  const cnJsonMatches = [...cn.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const m of cnJsonMatches) {
    try { JSON.parse(m[1]); } catch(e) { console.log(`ERROR: ${slug} CN JSON-LD: ${e.message}`); errors++; }
  }
  
  // EN checks
  const enJsonBlocks = (en.match(/<script type="application\/ld\+json">/g) || []).length;
  if (enJsonBlocks !== 1) { console.log(`ERROR: ${slug} EN has ${enJsonBlocks} JSON-LD blocks`); errors++; }
  if (!en.includes('site-analytics.js')) { console.log(`ERROR: ${slug} EN missing analytics`); errors++; }
  if (!en.includes('articles.css')) { console.log(`ERROR: ${slug} EN missing CSS`); errors++; }
  if (!en.includes('article-bottom-link')) { console.log(`ERROR: ${slug} EN missing CTA`); errors++; }
  if (!en.includes(`../${slug}.html`)) { console.log(`ERROR: ${slug} EN missing hreflang zh`); errors++; }
  if (en.includes('BreadcrumbList')) { console.log(`ERROR: ${slug} EN should not have BreadcrumbList`); errors++; }
  if (en.includes('article-orbit')) { console.log(`ERROR: ${slug} EN should not have orbit`); errors++; }
  if (!en.includes('Yue ICP 2026055337-1')) { console.log(`ERROR: ${slug} EN missing footer`); errors++; }
  if (!en.includes('Quick Chart')) { console.log(`ERROR: ${slug} EN missing Quick Chart`); errors++; }
  
  const enJsonMatches = [...en.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const m of enJsonMatches) {
    try { JSON.parse(m[1]); } catch(e) { console.log(`ERROR: ${slug} EN JSON-LD: ${e.message}`); errors++; }
  }
  
  console.log(`OK: ${slug}`);
}

// Check indexes
const cnIdx = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/index.html', 'utf8');
const enIdx = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/en/index.html', 'utf8');
const topic = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/ziwei-four-transformations.html', 'utf8');

for (const slug of slugs) {
  if (!cnIdx.includes(slug + '.html')) { console.log(`ERROR: CN index missing ${slug}`); errors++; }
  if (!enIdx.includes(slug + '.html')) { console.log(`ERROR: EN index missing ${slug}`); errors++; }
}
// Topic page should have 四化 articles
const topicSlugs = slugs.filter(s => s.includes('huaquan-zhujian') || s.includes('hualu-jumen'));
for (const slug of topicSlugs) {
  if (!topic.includes(slug + '.html')) { console.log(`ERROR: Topic missing ${slug}`); errors++; }
}

// Check feeds
const cnFeed = fs.readFileSync('C:/Users/1/Desktop/doubao-work/feed.xml', 'utf8');
const enFeed = fs.readFileSync('C:/Users/1/Desktop/doubao-work/articles/en/feed.xml', 'utf8');
if ((cnFeed.match(/<item>/g) || []).length !== 80) { console.log(`ERROR: CN feed has ${(cnFeed.match(/<item>/g) || []).length} items`); errors++; }
if ((enFeed.match(/<item>/g) || []).length !== 80) { console.log(`ERROR: EN feed has ${(enFeed.match(/<item>/g) || []).length} items`); errors++; }

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
    try { JSON.parse(m[1]); } catch(e) { console.log(`ERROR: ${name} JSON-LD: ${e.message}`); errors++; }
  }
}

if (errors === 0) console.log('\n=== ALL VALIDATIONS PASSED ===');
else console.log(`\n=== ${errors} ERRORS ===`);
