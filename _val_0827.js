const fs = require('fs'), path = require('path');
const slugs = [
  'ziwei-dikong-zai-fuqigong','ziwei-dikong-zai-zinvgong','ziwei-dikong-zai-caibogong','ziwei-dikong-zai-jiegong',
  'ziwei-dikong-zai-qianyi','ziwei-dikong-zai-puyigong','ziwei-dikong-zai-guanlugong','ziwei-dikong-zai-tianzhaigong',
  'ziwei-dikong-zai-fudegong','ziwei-dikong-zai-fumugong',
  'ziwei-dijie-zai-minggong','ziwei-dijie-zai-xiongdigong','ziwei-dijie-zai-fuqigong','ziwei-dijie-zai-zinvgong',
  'ziwei-dijie-zai-caibogong','ziwei-dijie-zai-jiegong','ziwei-dijie-zai-qianyi','ziwei-dijie-zai-puyigong',
  'ziwei-dijie-zai-guanlugong','ziwei-dijie-zai-tianzhaigong','ziwei-dijie-zai-fudegong','ziwei-dijie-zai-fumugong',
  'ziwei-tianma-zai-minggong','ziwei-tianma-zai-xiongdigong','ziwei-tianma-zai-fuqigong','ziwei-tianma-zai-zinvgong',
  'ziwei-tianma-zai-caibogong','ziwei-tianma-zai-jiegong','ziwei-tianma-zai-qianyi','ziwei-tianma-zai-puyigong',
  'ziwei-tianma-zai-guanlugong','ziwei-tianma-zai-tianzhaigong','ziwei-tianma-zai-fudegong','ziwei-tianma-zai-fumugong',
  'ziwei-lucun-zai-minggong','ziwei-lucun-zai-xiongdigong','ziwei-lucun-zai-fuqigong','ziwei-lucun-zai-zinvgong',
  'ziwei-lucun-zai-caibogong','ziwei-lucun-zai-jiegong'
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
