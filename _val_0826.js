const fs = require('fs'), path = require('path');
const slugs = [
  'ziwei-qingyang-zai-fudegong','ziwei-qingyang-zai-fumugong',
  'ziwei-tuoluo-zai-minggong','ziwei-tuoluo-zai-xiongdigong','ziwei-tuoluo-zai-fuqigong','ziwei-tuoluo-zai-zinvgong',
  'ziwei-tuoluo-zai-caibogong','ziwei-tuoluo-zai-jiegong','ziwei-tuoluo-zai-qianyi','ziwei-tuoluo-zai-puyigong',
  'ziwei-tuoluo-zai-guanlugong','ziwei-tuoluo-zai-tianzhaigong','ziwei-tuoluo-zai-fudegong','ziwei-tuoluo-zai-fumugong',
  'ziwei-huoxing-zai-minggong','ziwei-huoxing-zai-xiongdigong','ziwei-huoxing-zai-fuqigong','ziwei-huoxing-zai-zinvgong',
  'ziwei-huoxing-zai-caibogong','ziwei-huoxing-zai-jiegong','ziwei-huoxing-zai-qianyi','ziwei-huoxing-zai-puyigong',
  'ziwei-huoxing-zai-guanlugong','ziwei-huoxing-zai-tianzhaigong','ziwei-huoxing-zai-fudegong','ziwei-huoxing-zai-fumugong',
  'ziwei-lingxing-zai-minggong','ziwei-lingxing-zai-xiongdigong','ziwei-lingxing-zai-fuqigong','ziwei-lingxing-zai-zinvgong',
  'ziwei-lingxing-zai-caibogong','ziwei-lingxing-zai-jiegong','ziwei-lingxing-zai-qianyi','ziwei-lingxing-zai-puyigong',
  'ziwei-lingxing-zai-guanlugong','ziwei-lingxing-zai-tianzhaigong','ziwei-lingxing-zai-fudegong','ziwei-lingxing-zai-fumugong',
  'ziwei-dikong-zai-minggong','ziwei-dikong-zai-xiongdigong'
];
let errors = [], pass = 0;
const cnIndex = fs.readFileSync('articles/index.html', 'utf8');
const enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
const auxTopic = fs.readFileSync('articles/ziwei-helper-malice-stars.html', 'utf8');
const cnFeed = fs.readFileSync('feed.xml', 'utf8');
const enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
const smA = fs.readFileSync('sitemap-articles.xml', 'utf8');
const smE = fs.readFileSync('sitemap-en.xml', 'utf8');
for (const slug of slugs) {
  const cn = fs.readFileSync(path.join('articles', slug + '.html'), 'utf8');
  const en = fs.readFileSync(path.join('articles', 'en', slug + '.html'), 'utf8');
  const hasArticle = (s) => s.includes('"@type":"Article"') || s.includes('"@type": "Article"');
  const checks = [
    ['CN Article', hasArticle(cn)],
    ['CN Breadcrumb', cn.includes('BreadcrumbList')],
    ['CN hreflang', cn.includes('hreflang="zh-CN"') && cn.includes('hreflang="en"')],
    ['CN canonical', cn.includes('rel="canonical"')],
    ['CN og:image', cn.includes('og:image')],
    ['CN analytics', cn.includes('site-analytics.js')],
    ['CN CTA', cn.includes('mingbook-onepage.html')],
    ['CN ol', cn.includes('<ol>')],
    ['EN Article', hasArticle(en)],
    ['EN hreflang', en.includes('hreflang="en"')],
    ['EN CN link', en.includes('href="../' + slug + '.html"')],
    ['in CN index', cnIndex.includes(slug)],
    ['in EN index', enIndex.includes(slug)],
    ['in topic', auxTopic.includes(slug)],
    ['in CN feed', cnFeed.includes(slug)],
    ['in EN feed', enFeed.includes(slug)],
    ['in sitemap CN', smA.includes(slug)],
    ['in sitemap EN', smE.includes(slug)]
  ];
  for (const [n, ok] of checks) if (!ok) errors.push(slug + ': ' + n);
  pass++;
}
console.log('Validated ' + pass + '/' + slugs.length);
if (errors.length === 0) console.log('ALL PASS');
else { console.log(errors.length + ' ERRORS:'); errors.slice(0, 15).forEach(e => console.log('  - ' + e)); }
