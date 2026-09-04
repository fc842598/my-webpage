const fs = require('fs'), path = require('path');
const slugs = [
  'ziwei-xianchi-zai-fudegong','ziwei-xianchi-zai-fumugong',
  'ziwei-tianyao-zai-minggong','ziwei-tianyao-zai-xiongdigong','ziwei-tianyao-zai-fuqigong','ziwei-tianyao-zai-zinvgong',
  'ziwei-tianyao-zai-caibogong','ziwei-tianyao-zai-jiegong','ziwei-tianyao-zai-qianyi','ziwei-tianyao-zai-puyigong',
  'ziwei-tianyao-zai-guanlugong','ziwei-tianyao-zai-tianzhaigong','ziwei-tianyao-zai-fudegong','ziwei-tianyao-zai-fumugong',
  'ziwei-guchen-zai-minggong','ziwei-guchen-zai-xiongdigong','ziwei-guchen-zai-fuqigong','ziwei-guchen-zai-zinvgong',
  'ziwei-guchen-zai-caibogong','ziwei-guchen-zai-jiegong','ziwei-guchen-zai-qianyi','ziwei-guchen-zai-puyigong',
  'ziwei-guchen-zai-guanlugong','ziwei-guchen-zai-tianzhaigong','ziwei-guchen-zai-fudegong','ziwei-guchen-zai-fumugong',
  'ziwei-guasu-zai-minggong','ziwei-guasu-zai-xiongdigong','ziwei-guasu-zai-fuqigong','ziwei-guasu-zai-zinvgong',
  'ziwei-guasu-zai-caibogong','ziwei-guasu-zai-jiegong','ziwei-guasu-zai-qianyi','ziwei-guasu-zai-puyigong',
  'ziwei-guasu-zai-guanlugong','ziwei-guasu-zai-tianzhaigong','ziwei-guasu-zai-fudegong','ziwei-guasu-zai-fumugong',
  'ziwei-huagai-zai-minggong','ziwei-huagai-zai-xiongdigong'
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
