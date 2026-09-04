const fs = require('fs');
const path = require('path');

const slugs = [
  'ziwei-geju-xingqiu-jiayin','ziwei-geju-taohua-gunlang','ziwei-geju-lianfu-tonggong',
  'ziwei-geju-wuji-tonggong','ziwei-geju-jiliang-tonggong','ziwei-geju-tianji-huaji',
  'ziwei-geju-wuqu-huaji','ziwei-geju-taiyang-huaji'
];

let errors = 0;
function check(cond, msg) {
  if (!cond) { console.error('FAIL: ' + msg); errors++; }
}

for (const slug of slugs) {
  const cn = fs.readFileSync(path.join(__dirname, 'articles', `${slug}.html`), 'utf8');
  const en = fs.readFileSync(path.join(__dirname, 'articles', 'en', `${slug}.html`), 'utf8');
  check(!cn.includes('data-index="XX"'), `CN no XX: ${slug}`);
  check(!en.includes('data-index="XX"'), `EN no XX: ${slug}`);
  check(cn.includes('"@type": "Article"'), `CN JSON-LD: ${slug}`);
  check(en.includes('"@type": "Article"'), `EN JSON-LD: ${slug}`);
  check(cn.includes('"datePublished": "2026-08-19'), `CN date: ${slug}`);
  check(en.includes('"datePublished": "2026-08-19'), `EN date: ${slug}`);
  check(cn.includes(`hreflang="zh-CN" href="https://yuetianai.com/articles/${slug}.html"`), `CN hreflang zh: ${slug}`);
  check(cn.includes(`hreflang="en" href="https://yuetianai.com/articles/en/${slug}.html"`), `CN hreflang en: ${slug}`);
  check(en.includes(`hreflang="zh-CN" href="https://yuetianai.com/articles/${slug}.html"`), `EN hreflang zh: ${slug}`);
  check(en.includes(`hreflang="en" href="https://yuetianai.com/articles/en/${slug}.html"`), `EN hreflang en: ${slug}`);
  check(cn.includes(`<link rel="canonical" href="https://yuetianai.com/articles/${slug}.html">`), `CN canonical: ${slug}`);
  check(en.includes(`<link rel="canonical" href="https://yuetianai.com/articles/en/${slug}.html">`), `EN canonical: ${slug}`);
  check(cn.includes('"@type": "BreadcrumbList"'), `CN Breadcrumb: ${slug}`);
}

const cnIndex = fs.readFileSync(path.join(__dirname, 'articles', 'index.html'), 'utf8');
const enIndex = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'index.html'), 'utf8');
const topic = fs.readFileSync(path.join(__dirname, 'articles', 'ziwei-case-patterns.html'), 'utf8');
const cnFeed = fs.readFileSync(path.join(__dirname, 'feed.xml'), 'utf8');
const enFeed = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'feed.xml'), 'utf8');
const cnSm = fs.readFileSync(path.join(__dirname, 'sitemap-articles.xml'), 'utf8');
const enSm = fs.readFileSync(path.join(__dirname, 'sitemap-en.xml'), 'utf8');

for (const slug of slugs) {
  check(cnIndex.includes(`href="${slug}.html"`), `CN index: ${slug}`);
  check(enIndex.includes(`href="${slug}.html"`), `EN index: ${slug}`);
  check(topic.includes(`href="${slug}.html"`), `Topic: ${slug}`);
  check(cnFeed.includes(`yuetianai.com/articles/${slug}.html`), `CN feed: ${slug}`);
  check(enFeed.includes(`yuetianai.com/articles/en/${slug}.html`), `EN feed: ${slug}`);
  check(cnSm.includes(`yuetianai.com/articles/${slug}.html`), `CN sitemap: ${slug}`);
  check(enSm.includes(`yuetianai.com/articles/en/${slug}.html`), `EN sitemap: ${slug}`);
}
check(cnIndex.includes('41 篇'), 'CN count 41');
check(enIndex.includes('812 Articles'), 'EN count 812');
check(topic.includes('106 篇'), 'Topic count 106');
check((cnFeed.match(/<item>/g) || []).length <= 80, 'CN feed <= 80');
check((enFeed.match(/<item>/g) || []).length <= 80, 'EN feed <= 80');

console.log(errors === 0 ? 'ALL CHECKS PASSED' : errors + ' CHECKS FAILED');
process.exit(errors === 0 ? 0 : 1);
