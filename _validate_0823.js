const fs = require('fs');
const path = require('path');

const slugs = [
  'ziwei-tianfu-zai-puyigong','ziwei-tianfu-zai-guanlugong','ziwei-tianfu-zai-tianzhaigong','ziwei-tianfu-zai-fudegong','ziwei-tianfu-zai-fumugong',
  'ziwei-taiyin-zai-minggong','ziwei-taiyin-zai-xiongdigong','ziwei-taiyin-zai-fuqigong','ziwei-taiyin-zai-zinvgong',
  'ziwei-taiyin-zai-caibogong','ziwei-taiyin-zai-jiegong','ziwei-taiyin-zai-qianyi','ziwei-taiyin-zai-puyigong',
  'ziwei-taiyin-zai-guanlugong','ziwei-taiyin-zai-tianzhaigong','ziwei-taiyin-zai-fudegong','ziwei-taiyin-zai-fumugong',
  'ziwei-tanlang-zai-minggong','ziwei-tanlang-zai-xiongdigong','ziwei-tanlang-zai-fuqigong','ziwei-tanlang-zai-zinvgong',
  'ziwei-tanlang-zai-caibogong','ziwei-tanlang-zai-jiegong','ziwei-tanlang-zai-qianyi','ziwei-tanlang-zai-puyigong',
  'ziwei-tanlang-zai-guanlugong','ziwei-tanlang-zai-tianzhaigong','ziwei-tanlang-zai-fudegong','ziwei-tanlang-zai-fumugong',
  'ziwei-jumen-zai-minggong','ziwei-jumen-zai-xiongdigong','ziwei-jumen-zai-fuqigong','ziwei-jumen-zai-zinvgong',
  'ziwei-jumen-zai-caibogong','ziwei-jumen-zai-jiegong','ziwei-jumen-zai-qianyi','ziwei-jumen-zai-puyigong',
  'ziwei-jumen-zai-guanlugong','ziwei-jumen-zai-tianzhaigong'
];

let errors = [];
let pass = 0;

for (const slug of slugs) {
  const cnPath = path.join('articles', `${slug}.html`);
  if (!fs.existsSync(cnPath)) { errors.push(`CN file missing: ${slug}`); continue; }
  const cn = fs.readFileSync(cnPath, 'utf8');
  const enPath = path.join('articles', 'en', `${slug}.html`);
  if (!fs.existsSync(enPath)) { errors.push(`EN file missing: ${slug}`); continue; }
  const en = fs.readFileSync(enPath, 'utf8');
  
  const checks = [
    ['CN Article JSON-LD', cn.includes('"@type": "Article"')],
    ['CN BreadcrumbList', cn.includes('"@type": "BreadcrumbList"')],
    ['CN hreflang zh', cn.includes('hreflang="zh-CN"')],
    ['CN hreflang en', cn.includes('hreflang="en"')],
    ['CN canonical', cn.includes('rel="canonical"')],
    ['CN og:image', cn.includes('og:image')],
    ['CN analytics', cn.includes('site-analytics.js')],
    ['CN CTA', cn.includes('mingbook-onepage.html')],
    ['CN ol', cn.includes('<ol>')],
    ['CN h1', cn.includes('<h1>')],
    ['EN Article JSON-LD', en.includes('"@type": "Article"')],
    ['EN hreflang', en.includes('hreflang="en"')],
    ['EN canonical', en.includes('rel="canonical"')],
    ['EN og:image', en.includes('og:image')],
    ['EN CN link', en.includes(`href="../${slug}.html"`)],
    ['EN h1', en.includes('<h1>')],
  ];
  for (const [name, ok] of checks) {
    if (!ok) errors.push(`${slug}: ${name}`);
  }
  
  const cnIndex = fs.readFileSync('articles/index.html', 'utf8');
  if (!cnIndex.includes(slug)) errors.push(`${slug}: not in CN index`);
  const enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
  if (!enIndex.includes(slug)) errors.push(`${slug}: not in EN index`);
  const topic = fs.readFileSync('articles/ziwei-main-stars.html', 'utf8');
  if (!topic.includes(slug)) errors.push(`${slug}: not in topic page`);
  const cnFeed = fs.readFileSync('feed.xml', 'utf8');
  if (!cnFeed.includes(slug)) errors.push(`${slug}: not in CN feed`);
  const enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
  if (!enFeed.includes(slug)) errors.push(`${slug}: not in EN feed`);
  const smA = fs.readFileSync('sitemap-articles.xml', 'utf8');
  if (!smA.includes(slug)) errors.push(`${slug}: not in sitemap-articles`);
  const smE = fs.readFileSync('sitemap-en.xml', 'utf8');
  if (!smE.includes(slug)) errors.push(`${slug}: not in sitemap-en`);
  
  pass++;
}

console.log(`Validated ${pass}/${slugs.length} articles`);
if (errors.length === 0) {
  console.log('ALL PASS ✓');
} else {
  console.log(`\n${errors.length} ERRORS:`);
  errors.forEach(e => console.log(`  - ${e}`));
}
