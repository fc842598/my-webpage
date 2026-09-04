const fs = require('fs'), path = require('path');
const slugs = [
  'ziwei-huaji-zai-caibogong','ziwei-huaji-zai-jiegong','ziwei-huaji-zai-qianyi','ziwei-huaji-zai-puyigong',
  'ziwei-huaji-zai-guanlugong','ziwei-huaji-zai-tianzhaigong','ziwei-huaji-zai-fudegong','ziwei-huaji-zai-fumugong',
  'ziwei-tiankui-zai-xiongdigong','ziwei-tiankui-zai-fuqigong','ziwei-tiankui-zai-zinvgong','ziwei-tiankui-zai-caibogong',
  'ziwei-tiankui-zai-jiegong','ziwei-tiankui-zai-qianyi','ziwei-tiankui-zai-puyigong','ziwei-tiankui-zai-guanlugong',
  'ziwei-tiankui-zai-tianzhaigong','ziwei-tiankui-zai-fudegong','ziwei-tiankui-zai-fumugong',
  'ziwei-tianyue-zai-xiongdigong','ziwei-tianyue-zai-fuqigong','ziwei-tianyue-zai-zinvgong','ziwei-tianyue-zai-caibogong',
  'ziwei-tianyue-zai-jiegong','ziwei-tianyue-zai-qianyi','ziwei-tianyue-zai-puyigong','ziwei-tianyue-zai-guanlugong',
  'ziwei-tianyue-zai-tianzhaigong','ziwei-tianyue-zai-fudegong','ziwei-tianyue-zai-fumugong',
  'ziwei-qingyang-zai-minggong','ziwei-qingyang-zai-xiongdigong','ziwei-qingyang-zai-fuqigong','ziwei-qingyang-zai-zinvgong',
  'ziwei-qingyang-zai-caibogong','ziwei-qingyang-zai-jiegong','ziwei-qingyang-zai-qianyi','ziwei-qingyang-zai-puyigong',
  'ziwei-qingyang-zai-guanlugong','ziwei-qingyang-zai-tianzhaigong'
];
let errors = [], pass = 0;
const cnIndex = fs.readFileSync('articles/index.html', 'utf8');
const enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
const sihuaTopic = fs.readFileSync('articles/ziwei-sihua.html', 'utf8');
const auxTopic = fs.readFileSync('articles/ziwei-helper-malice-stars.html', 'utf8');
const cnFeed = fs.readFileSync('feed.xml', 'utf8');
const enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
const smA = fs.readFileSync('sitemap-articles.xml', 'utf8');
const smE = fs.readFileSync('sitemap-en.xml', 'utf8');
for (const slug of slugs) {
  const cn = fs.readFileSync(path.join('articles', slug + '.html'), 'utf8');
  const en = fs.readFileSync(path.join('articles', 'en', slug + '.html'), 'utf8');
  const hasArticle = (s) => s.includes('"@type":"Article"') || s.includes('"@type": "Article"');
  const isHuaji = slug.includes('huaji');
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
    ['in topic', isHuaji ? sihuaTopic.includes(slug) : auxTopic.includes(slug)],
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
