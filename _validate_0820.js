const fs = require('fs');
const path = require('path');
const slugs = [
  'ziwei-kanpan-buneng-zhikan-minggong',
  'ziwei-shenggong-zhengque-yongfa',
  'ziwei-duigong-jiexing-jiexian',
  'ziwei-hualu-bu-yiding-haoshi',
  'ziwei-huaquan-bu-yiding-zhangquan',
  'ziwei-huake-bu-yiding-youming',
  'ziwei-huaji-bu-yiding-huaishi',
  'ziwei-miaowang-luoxian-shizhan',
  'ziwei-shaxing-bu-kenpa',
  'ziwei-kongjie-bu-shi-meiyou',
  'ziwei-daxian-jiaotuo-qi',
  'ziwei-xiaoxian-shizhan-yongfa',
  'ziwei-geju-bu-neng-taoshuyin',
  'ziwei-kanpan-xiankan-dafangxiang',
  'ziwei-tongyi-pan-butong-jiedu',
  'ziwei-kanpan-bie-wen-weishenme',
  'ziwei-xingxing-zhijian-huixiangying',
  'ziwei-wuxing-jusheng-buneng-yingtao',
  'ziwei-kanpan-yaokan-shunxu-bushi-zhongdian',
  'ziwei-ganzhi-yongchu-buzhi-shi-fuhao'
];
let errors = 0;
function check(cond, msg) { if (!cond) { console.log('FAIL: ' + msg); errors++; } }

for (const slug of slugs) {
  for (const [dir, isEn] of [['articles', false], [path.join('articles','en'), true]]) {
    const fp = path.join(__dirname, dir, slug + '.html');
    if (!fs.existsSync(fp)) { check(false, `Missing file: ${fp}`); continue; }
    const html = fs.readFileSync(fp, 'utf8');
    check(html.includes('application/ld+json'), `${slug}: missing JSON-LD`);
    check(html.includes('"@type": "Article"'), `${slug}: missing Article schema`);
    check(html.includes('datePublished'), `${slug}: missing datePublished`);
    check(html.includes('hreflang="zh-CN"'), `${slug}: missing hreflang zh-CN`);
    check(html.includes('hreflang="en"'), `${slug}: missing hreflang en`);
    check(html.includes('rel="canonical"'), `${slug}: missing canonical`);
    check(!html.includes('data-index="XX"'), `${slug}: contains XX placeholder`);
    check(!html.includes('\\u2014'), `${slug}: contains literal \\u2014`);
    check(html.includes('2026-08-20'), `${slug}: missing date 2026-08-20`);
    check(html.includes('article-bottom-link'), `${slug}: missing bottom CTA`);
    check(html.includes('site-analytics.js'), `${slug}: missing analytics`);
    check(html.includes('triad-tian-bg.webp'), `${slug}: missing og:image`);
    check(html.includes('wentian-brand-logo-ai-gold-v1.webp'), `${slug}: missing favicon`);
    check(html.includes('articles.css'), `${slug}: missing CSS`);
    check(html.includes('breadcrumb'), `${slug}: missing breadcrumb`);
    check(html.includes('detail-rail'), `${slug}: missing sidebar`);
    if (!isEn) {
      check(html.includes('BreadcrumbList'), `${slug}: missing BreadcrumbList`);
      check(html.includes('快速排盘'), `${slug}: missing CN CTA text`);
    } else {
      check(html.includes('Quick Chart'), `${slug}: missing EN CTA text`);
      check(html.includes('Read Next'), `${slug}: missing EN sidebar heading`);
    }
  }
}

// Check indexes
const cnIndex = fs.readFileSync(path.join(__dirname, 'articles', 'index.html'), 'utf8');
const enIndex = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'index.html'), 'utf8');
const topic = fs.readFileSync(path.join(__dirname, 'articles', 'ziwei-learning-path.html'), 'utf8');
for (const slug of slugs) {
  check(cnIndex.includes(slug + '.html'), `CN index missing ${slug}`);
  check(enIndex.includes(slug + '.html'), `EN index missing ${slug}`);
  check(topic.includes(slug + '.html'), `Topic page missing ${slug}`);
}
check(!cnIndex.includes('data-index="XX"'), 'CN index has XX');
check(!enIndex.includes('data-index="XX"'), 'EN index has XX');
check(!topic.includes('data-index="XX"'), 'Topic page has XX');

// Check feeds
const cnFeed = fs.readFileSync(path.join(__dirname, 'feed.xml'), 'utf8');
const enFeed = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'feed.xml'), 'utf8');
for (const slug of slugs) {
  check(cnFeed.includes(slug + '.html'), `CN feed missing ${slug}`);
  check(enFeed.includes(slug + '.html'), `EN feed missing ${slug}`);
}
const cnFeedCount = (cnFeed.match(/<item>/g) || []).length;
const enFeedCount = (enFeed.match(/<item>/g) || []).length;
check(cnFeedCount <= 80, `CN feed has ${cnFeedCount} items (>80)`);
check(enFeedCount <= 80, `EN feed has ${enFeedCount} items (>80)`);
console.log(`CN feed items: ${cnFeedCount}, EN feed items: ${enFeedCount}`);

// Check sitemaps
const cnSm = fs.readFileSync(path.join(__dirname, 'sitemap-articles.xml'), 'utf8');
const enSm = fs.readFileSync(path.join(__dirname, 'sitemap-en.xml'), 'utf8');
for (const slug of slugs) {
  check(cnSm.includes(slug + '.html'), `CN sitemap missing ${slug}`);
  check(enSm.includes(slug + '.html'), `EN sitemap missing ${slug}`);
}

// Check counts
const cnCountMatch = cnIndex.match(/<h2>看盘方法<\/h2>[\s\S]{0,500}?<span>(\d+) 篇<\/span>/);
if (cnCountMatch) console.log(`CN 看盘方法 count: ${cnCountMatch[1]}`);
const enCountMatch = enIndex.match(/(\d+)\s*Articles/);
if (enCountMatch) console.log(`EN total count: ${enCountMatch[1]}`);
const topicCountMatch = topic.match(/<span>(\d+) 篇<\/span>/);
if (topicCountMatch) console.log(`Topic page count: ${topicCountMatch[1]}`);

if (errors === 0) console.log('\nALL CHECKS PASSED');
else console.log(`\n${errors} CHECKS FAILED`);
