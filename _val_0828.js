const fs = require('fs'), path = require('path');
const slugs = [
  'ziwei-lucun-zai-qianyi','ziwei-lucun-zai-puyigong','ziwei-lucun-zai-guanlugong','ziwei-lucun-zai-tianzhaigong','ziwei-lucun-zai-fudegong','ziwei-lucun-zai-fumugong',
  'ziwei-hongluan-zai-minggong','ziwei-hongluan-zai-xiongdigong','ziwei-hongluan-zai-fuqigong','ziwei-hongluan-zai-zinvgong',
  'ziwei-hongluan-zai-caibogong','ziwei-hongluan-zai-jiegong','ziwei-hongluan-zai-qianyi','ziwei-hongluan-zai-puyigong',
  'ziwei-hongluan-zai-guanlugong','ziwei-hongluan-zai-tianzhaigong','ziwei-hongluan-zai-fudegong','ziwei-hongluan-zai-fumugong',
  'ziwei-tianxi-zai-minggong','ziwei-tianxi-zai-xiongdigong','ziwei-tianxi-zai-fuqigong','ziwei-tianxi-zai-zinvgong',
  'ziwei-tianxi-zai-caibogong','ziwei-tianxi-zai-jiegong','ziwei-tianxi-zai-qianyi','ziwei-tianxi-zai-puyigong',
  'ziwei-tianxi-zai-guanlugong','ziwei-tianxi-zai-tianzhaigong','ziwei-tianxi-zai-fudegong','ziwei-tianxi-zai-fumugong',
  'ziwei-xianchi-zai-minggong','ziwei-xianchi-zai-xiongdigong','ziwei-xianchi-zai-fuqigong','ziwei-xianchi-zai-zinvgong',
  'ziwei-xianchi-zai-caibogong','ziwei-xianchi-zai-jiegong','ziwei-xianchi-zai-qianyi','ziwei-xianchi-zai-puyigong',
  'ziwei-xianchi-zai-guanlugong','ziwei-xianchi-zai-tianzhaigong'
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
    ['CN Article', hasArticle(cn)],['CN Breadcrumb', cn.includes('BreadcrumbList')],
    ['CN hreflang', cn.includes('hreflang="zh-CN"') && cn.includes('hreflang="en"')],
    ['CN canonical', cn.includes('rel="canonical"')],['CN og:image', cn.includes('og:image')],
    ['CN analytics', cn.includes('site-analytics.js')],['CN CTA', cn.includes('mingbook-onepage.html')],
    ['CN ol', cn.includes('<ol>')],['EN Article', hasArticle(en)],
    ['EN hreflang', en.includes('hreflang="en"')],['EN CN link', en.includes('href="../' + slug + '.html"')],
    ['in CN index', cnIndex.includes(slug)],['in EN index', enIndex.includes(slug)],
    ['in topic', auxTopic.includes(slug)],['in CN feed', cnFeed.includes(slug)],
    ['in EN feed', enFeed.includes(slug)],['in sitemap CN', smA.includes(slug)],['in sitemap EN', smE.includes(slug)]
  ];
  for (const [n, ok] of checks) if (!ok) errors.push(slug + ': ' + n);
  pass++;
}
console.log('Validated ' + pass + '/' + slugs.length);
if (errors.length === 0) console.log('ALL PASS');
else { console.log(errors.length + ' ERRORS:'); errors.slice(0, 15).forEach(e => console.log('  - ' + e)); }
