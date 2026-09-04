const fs = require('fs'), path = require('path');
const slugs = [
  'ziwei-jumen-zai-fudegong','ziwei-jumen-zai-fumugong',
  'ziwei-tianxiang-zai-minggong','ziwei-tianxiang-zai-xiongdigong','ziwei-tianxiang-zai-fuqigong','ziwei-tianxiang-zai-zinvgong',
  'ziwei-tianxiang-zai-caibogong','ziwei-tianxiang-zai-jiegong','ziwei-tianxiang-zai-qianyi','ziwei-tianxiang-zai-puyigong',
  'ziwei-tianxiang-zai-guanlugong','ziwei-tianxiang-zai-tianzhaigong','ziwei-tianxiang-zai-fudegong','ziwei-tianxiang-zai-fumugong',
  'ziwei-tianliang-zai-minggong','ziwei-tianliang-zai-xiongdigong','ziwei-tianliang-zai-fuqigong','ziwei-tianliang-zai-zinvgong',
  'ziwei-tianliang-zai-caibogong','ziwei-tianliang-zai-jiegong','ziwei-tianliang-zai-qianyi','ziwei-tianliang-zai-puyigong',
  'ziwei-tianliang-zai-guanlugong','ziwei-tianliang-zai-tianzhaigong','ziwei-tianliang-zai-fudegong','ziwei-tianliang-zai-fumugong',
  'ziwei-qisha-zai-minggong','ziwei-qisha-zai-xiongdigong','ziwei-qisha-zai-fuqigong','ziwei-qisha-zai-zinvgong',
  'ziwei-qisha-zai-caibogong','ziwei-qisha-zai-jiegong','ziwei-qisha-zai-qianyi','ziwei-qisha-zai-puyigong',
  'ziwei-qisha-zai-guanlugong','ziwei-qisha-zai-tianzhaigong','ziwei-qisha-zai-fudegong','ziwei-qisha-zai-fumugong',
  'ziwei-pojun-zai-minggong','ziwei-pojun-zai-xiongdigong','ziwei-pojun-zai-fuqigong','ziwei-pojun-zai-zinvgong',
  'ziwei-pojun-zai-caibogong','ziwei-pojun-zai-jiegong','ziwei-pojun-zai-qianyi','ziwei-pojun-zai-puyigong',
  'ziwei-pojun-zai-guanlugong','ziwei-pojun-zai-tianzhaigong','ziwei-pojun-zai-fudegong','ziwei-pojun-zai-fumugong',
  'ziwei-zuofu-zai-minggong','ziwei-zuofu-zai-xiongdigong','ziwei-zuofu-zai-fuqigong','ziwei-zuofu-zai-zinvgong',
  'ziwei-zuofu-zai-caibogong','ziwei-zuofu-zai-jiegong','ziwei-zuofu-zai-qianyi','ziwei-zuofu-zai-puyigong',
  'ziwei-zuofu-zai-guanlugong','ziwei-zuofu-zai-tianzhaigong','ziwei-zuofu-zai-fudegong','ziwei-zuofu-zai-fumugong',
  'ziwei-youbi-zai-minggong','ziwei-youbi-zai-xiongdigong','ziwei-youbi-zai-fuqigong','ziwei-youbi-zai-zinvgong',
  'ziwei-youbi-zai-caibogong','ziwei-youbi-zai-jiegong','ziwei-youbi-zai-qianyi','ziwei-youbi-zai-puyigong',
  'ziwei-youbi-zai-guanlugong','ziwei-youbi-zai-tianzhaigong','ziwei-youbi-zai-fudegong','ziwei-youbi-zai-fumugong',
  'ziwei-wenchang-zai-minggong','ziwei-wenchang-zai-xiongdigong','ziwei-wenchang-zai-fuqigong','ziwei-wenchang-zai-zinvgong',
  'ziwei-wenchang-zai-caibogong','ziwei-wenchang-zai-jiegong','ziwei-wenchang-zai-qianyi','ziwei-wenchang-zai-puyigong',
  'ziwei-wenchang-zai-guanlugong','ziwei-wenchang-zai-tianzhaigong','ziwei-wenchang-zai-fudegong','ziwei-wenchang-zai-fumugong',
  'ziwei-wenqu-zai-minggong','ziwei-wenqu-zai-xiongdigong','ziwei-wenqu-zai-fuqigong','ziwei-wenqu-zai-zinvgong',
  'ziwei-wenqu-zai-caibogong','ziwei-wenqu-zai-jiegong','ziwei-wenqu-zai-qianyi','ziwei-wenqu-zai-puyigong',
  'ziwei-wenqu-zai-guanlugong','ziwei-wenqu-zai-tianzhaigong','ziwei-wenqu-zai-fudegong','ziwei-wenqu-zai-fumugong',
  'ziwei-tiankui-zai-minggong','ziwei-tianyue-zai-minggong'
];
let errors = [], pass = 0;
const cnIndex = fs.readFileSync('articles/index.html', 'utf8');
const enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
const mainTopic = fs.readFileSync('articles/ziwei-main-stars.html', 'utf8');
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
    ['in topic', mainTopic.includes(slug) || auxTopic.includes(slug)],
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
