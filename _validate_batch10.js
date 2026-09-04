const fs = require('fs');
const path = require('path');

const slugs = [
  'ziwei-geju-riyue-fanbei',
  'ziwei-geju-junchen-qinghui',
  'ziwei-geju-caisan-jiaji',
  'ziwei-geju-lingchang-tuowu',
  'ziwei-geju-jizhu-maoyou',
  'ziwei-geju-shizhong-yinyu',
  'ziwei-geju-yongxing-rumiao',
  'ziwei-geju-matou-daijian',
  'ziwei-geju-fanshui-taohua',
  'ziwei-geju-zifu-chaoyuan'
];

let errors = 0;
function check(cond, msg) {
  if (!cond) { console.error('FAIL: ' + msg); errors++; }
  else console.log('PASS: ' + msg);
}

// Check each article
for (const slug of slugs) {
  const cnPath = path.join(__dirname, 'articles', `${slug}.html`);
  const enPath = path.join(__dirname, 'articles', 'en', `${slug}.html`);

  check(fs.existsSync(cnPath), `CN file exists: ${slug}`);
  check(fs.existsSync(enPath), `EN file exists: ${slug}`);

  const cn = fs.readFileSync(cnPath, 'utf8');
  const en = fs.readFileSync(enPath, 'utf8');

  // No XX placeholders
  check(!cn.includes('data-index="XX"'), `CN no XX placeholder: ${slug}`);
  check(!en.includes('data-index="XX"'), `EN no XX placeholder: ${slug}`);

  // JSON-LD
  check(cn.includes('"@type": "Article"'), `CN JSON-LD Article: ${slug}`);
  check(en.includes('"@type": "Article"'), `EN JSON-LD Article: ${slug}`);
  check(cn.includes('"datePublished": "2026-08-19'), `CN datePublished: ${slug}`);
  check(en.includes('"datePublished": "2026-08-19'), `EN datePublished: ${slug}`);

  // hreflang
  check(cn.includes(`hreflang="zh-CN" href="https://yuetianai.com/articles/${slug}.html"`), `CN hreflang zh: ${slug}`);
  check(cn.includes(`hreflang="en" href="https://yuetianai.com/articles/en/${slug}.html"`), `CN hreflang en: ${slug}`);
  check(en.includes(`hreflang="zh-CN" href="https://yuetianai.com/articles/${slug}.html"`), `EN hreflang zh: ${slug}`);
  check(en.includes(`hreflang="en" href="https://yuetianai.com/articles/en/${slug}.html"`), `EN hreflang en: ${slug}`);

  // canonical
  check(cn.includes(`<link rel="canonical" href="https://yuetianai.com/articles/${slug}.html">`), `CN canonical: ${slug}`);
  check(en.includes(`<link rel="canonical" href="https://yuetianai.com/articles/en/${slug}.html">`), `EN canonical: ${slug}`);

  // Breadcrumb in CN
  check(cn.includes('"@type": "BreadcrumbList"'), `CN BreadcrumbList: ${slug}`);
}

// Check CN index
const cnIndex = fs.readFileSync(path.join(__dirname, 'articles', 'index.html'), 'utf8');
for (const slug of slugs) {
  check(cnIndex.includes(`href="${slug}.html"`), `CN index contains: ${slug}`);
}
check(cnIndex.includes('33 篇'), 'CN index count updated to 33');

// Check EN index
const enIndex = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'index.html'), 'utf8');
for (const slug of slugs) {
  check(enIndex.includes(`href="${slug}.html"`), `EN index contains: ${slug}`);
}
check(enIndex.includes('804 Articles'), 'EN index count updated to 804');

// Check topic page
const topic = fs.readFileSync(path.join(__dirname, 'articles', 'ziwei-case-patterns.html'), 'utf8');
for (const slug of slugs) {
  check(topic.includes(`href="${slug}.html"`), `Topic page contains: ${slug}`);
}
check(topic.includes('98 篇'), 'Topic page count updated to 98');

// Check feeds
const cnFeed = fs.readFileSync(path.join(__dirname, 'feed.xml'), 'utf8');
const enFeed = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'feed.xml'), 'utf8');
for (const slug of slugs) {
  check(cnFeed.includes(`yuetianai.com/articles/${slug}.html`), `CN feed contains: ${slug}`);
  check(enFeed.includes(`yuetianai.com/articles/en/${slug}.html`), `EN feed contains: ${slug}`);
}
const cnFeedItems = (cnFeed.match(/<item>/g) || []).length;
const enFeedItems = (enFeed.match(/<item>/g) || []).length;
check(cnFeedItems <= 80, `CN feed <= 80 items (actual: ${cnFeedItems})`);
check(enFeedItems <= 80, `EN feed <= 80 items (actual: ${enFeedItems})`);

// Check sitemaps
const cnSm = fs.readFileSync(path.join(__dirname, 'sitemap-articles.xml'), 'utf8');
const enSm = fs.readFileSync(path.join(__dirname, 'sitemap-en.xml'), 'utf8');
for (const slug of slugs) {
  check(cnSm.includes(`yuetianai.com/articles/${slug}.html`), `CN sitemap contains: ${slug}`);
  check(enSm.includes(`yuetianai.com/articles/en/${slug}.html`), `EN sitemap contains: ${slug}`);
}

console.log(`\n${errors === 0 ? 'ALL CHECKS PASSED' : errors + ' CHECKS FAILED'}`);
process.exit(errors === 0 ? 0 : 1);
