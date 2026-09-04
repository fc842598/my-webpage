const fs = require('fs'), path = require('path');
const slugs = [
  'ziwei-hualu-zai-minggong','ziwei-hualu-zai-xiongdigong','ziwei-hualu-zai-fuqigong','ziwei-hualu-zai-zinvgong',
  'ziwei-hualu-zai-caibogong','ziwei-hualu-zai-jiegong','ziwei-hualu-zai-qianyi','ziwei-hualu-zai-puyigong',
  'ziwei-hualu-zai-guanlugong','ziwei-hualu-zai-tianzhaigong','ziwei-hualu-zai-fudegong','ziwei-hualu-zai-fumugong',
  'ziwei-huaquan-zai-minggong','ziwei-huaquan-zai-xiongdigong','ziwei-huaquan-zai-fuqigong','ziwei-huaquan-zai-zinvgong',
  'ziwei-huaquan-zai-caibogong','ziwei-huaquan-zai-jiegong','ziwei-huaquan-zai-qianyi','ziwei-huaquan-zai-puyigong',
  'ziwei-huaquan-zai-guanlugong','ziwei-huaquan-zai-tianzhaigong','ziwei-huaquan-zai-fudegong','ziwei-huaquan-zai-fumugong',
  'ziwei-huake-zai-minggong','ziwei-huake-zai-xiongdigong','ziwei-huake-zai-fuqigong','ziwei-huake-zai-zinvgong',
  'ziwei-huake-zai-caibogong','ziwei-huake-zai-jiegong','ziwei-huake-zai-qianyi','ziwei-huake-zai-puyigong',
  'ziwei-huake-zai-guanlugong','ziwei-huake-zai-tianzhaigong','ziwei-huake-zai-fudegong','ziwei-huake-zai-fumugong',
  'ziwei-huaji-zai-minggong','ziwei-huaji-zai-xiongdigong','ziwei-huaji-zai-fuqigong','ziwei-huaji-zai-zinvgong'
];
let errors = [], pass = 0;
const cnIndex = fs.readFileSync('articles/index.html', 'utf8');
const enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
const sihuaTopic = fs.readFileSync('articles/ziwei-sihua.html', 'utf8');
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
    ['in sihua topic', sihuaTopic.includes(slug)],
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
