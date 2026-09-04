const fs = require('fs');
const path = require('path');

const slugs = [
  'ziwei-xiongdigong-huaji',
  'ziwei-fuqigong-huaji',
  'ziwei-zinvgong-huaji',
  'ziwei-caibogong-huaji',
  'ziwei-jiaoyougong-huaji',
  'ziwei-guanlugong-huaji',
  'ziwei-tianzhaigong-huaji',
  'ziwei-fudegong-huaji',
  'ziwei-fumugong-huaji',
  'ziwei-zihua-huaji'
];

let errors = 0;
function check(cond, msg) {
  if (!cond) { console.error('FAIL: ' + msg); errors++; }
}

for (const slug of slugs) {
  const cnPath = path.join(__dirname, 'articles', slug + '.html');
  const cn = fs.readFileSync(cnPath, 'utf8');
  check(cn.includes('<html lang="zh-CN">'), slug + ' CN lang');
  check(cn.includes('site-analytics.js'), slug + ' CN analytics');
  check(cn.includes('articles.css'), slug + ' CN css');
  check(cn.includes('hreflang="en"'), slug + ' CN hreflang en');
  check(cn.includes('hreflang="zh-CN"'), slug + ' CN hreflang zh');
  check(cn.includes('BreadcrumbList'), slug + ' CN breadcrumb');
  check(cn.includes('article-orbit'), slug + ' CN orbit');
  check(cn.includes('article-bottom-link'), slug + ' CN CTA');
  check(cn.includes('粤ICP备2026055337号-1'), slug + ' CN footer');
  check(cn.includes('en/' + slug + '.html'), slug + ' CN en link');

  const cnJson = [...cn.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  check(cnJson.length === 2, slug + ' CN has 2 JSON-LD');
  for (const m of cnJson) {
    try { JSON.parse(m[1].trim()); } catch (e) { check(false, slug + ' CN JSON parse: ' + e.message); }
  }

  const enPath = path.join(__dirname, 'articles', 'en', slug + '.html');
  const en = fs.readFileSync(enPath, 'utf8');
  check(en.includes('<html lang="en">'), slug + ' EN lang');
  check(en.includes('site-analytics.js'), slug + ' EN analytics');
  check(en.includes('articles.css'), slug + ' EN css');
  check(en.includes('hreflang="en"'), slug + ' EN hreflang en');
  check(en.includes('hreflang="zh-CN"'), slug + ' EN hreflang zh');
  check(!en.includes('BreadcrumbList'), slug + ' EN no breadcrumb');
  check(!en.includes('article-orbit'), slug + ' EN no orbit');
  check(en.includes('article-bottom-link'), slug + ' EN CTA');
  check(en.includes('Quick Chart'), slug + ' EN quick chart');
  check(en.includes('Yue ICP 2026055337-1'), slug + ' EN footer');
  check(en.includes('../' + slug + '.html'), slug + ' EN zh link');

  const enJson = [...en.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  check(enJson.length === 1, slug + ' EN has 1 JSON-LD');
  for (const m of enJson) {
    try { JSON.parse(m[1].trim()); } catch (e) { check(false, slug + ' EN JSON parse: ' + e.message); }
  }
}

// Check indexes/feeds/sitemaps
const cnIndex = fs.readFileSync(path.join(__dirname, 'articles', 'index.html'), 'utf8');
const enIndex = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'index.html'), 'utf8');
const topic = fs.readFileSync(path.join(__dirname, 'articles', 'ziwei-four-transformations.html'), 'utf8');
const cnFeed = fs.readFileSync(path.join(__dirname, 'feed.xml'), 'utf8');
const enFeed = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'feed.xml'), 'utf8');
const cnSm = fs.readFileSync(path.join(__dirname, 'sitemap-articles.xml'), 'utf8');
const enSm = fs.readFileSync(path.join(__dirname, 'sitemap-en.xml'), 'utf8');

for (const slug of slugs) {
  check(cnIndex.includes(slug + '.html'), 'CN index missing ' + slug);
  check(enIndex.includes(slug + '.html'), 'EN index missing ' + slug);
  check(topic.includes(slug + '.html'), 'Topic missing ' + slug);
  check(cnFeed.includes(slug + '.html'), 'CN feed missing ' + slug);
  check(enFeed.includes(slug + '.html'), 'EN feed missing ' + slug);
  check(cnSm.includes(slug + '.html'), 'CN sitemap missing ' + slug);
  check(enSm.includes(slug + '.html'), 'EN sitemap missing ' + slug);
}

const cnFeedCount = (cnFeed.match(/<item>/g) || []).length;
const enFeedCount = (enFeed.match(/<item>/g) || []).length;
check(cnFeedCount === 80, 'CN feed has ' + cnFeedCount + ' items');
check(enFeedCount === 80, 'EN feed has ' + enFeedCount + ' items');

// Parse all JSON-LD in indexes/topic
for (const [name, content] of [['CN index', cnIndex], ['EN index', enIndex], ['Topic', topic]]) {
  const blocks = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const m of blocks) {
    try { JSON.parse(m[1].trim()); } catch (e) { check(false, name + ' JSON parse: ' + e.message); }
  }
}

if (errors === 0) console.log('=== ALL VALIDATIONS PASSED ===');
else { console.log('=== ' + errors + ' ERRORS ==='); process.exit(1); }
