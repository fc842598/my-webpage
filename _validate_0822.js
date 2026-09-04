const fs = require('fs');
const path = require('path');

const slugs = [
  'ziwei-wuqu-zai-caibogong','ziwei-wuqu-zai-jiegong','ziwei-wuqu-zai-qianyi','ziwei-wuqu-zai-puyigong',
  'ziwei-wuqu-zai-guanlugong','ziwei-wuqu-zai-tianzhaigong','ziwei-wuqu-zai-fudegong','ziwei-wuqu-zai-fumugong',
  'ziwei-tiantong-zai-minggong','ziwei-tiantong-zai-xiongdigong','ziwei-tiantong-zai-fuqigong','ziwei-tiantong-zai-zinvgong',
  'ziwei-tiantong-zai-caibogong','ziwei-tiantong-zai-jiegong','ziwei-tiantong-zai-qianyi','ziwei-tiantong-zai-puyigong',
  'ziwei-tiantong-zai-guanlugong','ziwei-tiantong-zai-tianzhaigong','ziwei-tiantong-zai-fudegong','ziwei-tiantong-zai-fumugong',
  'ziwei-lianzhen-zai-minggong','ziwei-lianzhen-zai-xiongdigong','ziwei-lianzhen-zai-fuqigong','ziwei-lianzhen-zai-zinvgong',
  'ziwei-lianzhen-zai-caibogong','ziwei-lianzhen-zai-jiegong','ziwei-lianzhen-zai-qianyi','ziwei-lianzhen-zai-puyigong',
  'ziwei-lianzhen-zai-guanlugong','ziwei-lianzhen-zai-tianzhaigong','ziwei-lianzhen-zai-fudegong','ziwei-lianzhen-zai-fumugong',
  'ziwei-tianfu-zai-minggong','ziwei-tianfu-zai-xiongdigong','ziwei-tianfu-zai-fuqigong','ziwei-tianfu-zai-zinvgong',
  'ziwei-tianfu-zai-caibogong','ziwei-tianfu-zai-jiegong','ziwei-tianfu-zai-qianyi'
];

let errors = [];
let pass = 0;

for (const slug of slugs) {
  // Check CN file
  const cnPath = path.join('articles', `${slug}.html`);
  if (!fs.existsSync(cnPath)) { errors.push(`CN file missing: ${slug}`); continue; }
  const cn = fs.readFileSync(cnPath, 'utf8');
  
  // Check EN file
  const enPath = path.join('articles', 'en', `${slug}.html`);
  if (!fs.existsSync(enPath)) { errors.push(`EN file missing: ${slug}`); continue; }
  const en = fs.readFileSync(enPath, 'utf8');
  
  // CN checks
  const checks = [
    ['CN has Article JSON-LD', cn.includes('"@type": "Article"')],
    ['CN has BreadcrumbList JSON-LD', cn.includes('"@type": "BreadcrumbList"')],
    ['CN has hreflang zh-CN', cn.includes('hreflang="zh-CN"')],
    ['CN has hreflang en', cn.includes('hreflang="en"')],
    ['CN has canonical', cn.includes('rel="canonical"')],
    ['CN has og:image', cn.includes('og:image')],
    ['CN has GA4', cn.includes('G-5K7WRWHT3T')],
    ['CN has CTA link', cn.includes('mingbook-onepage.html')],
    ['CN has ol list', cn.includes('<ol>')],
    ['CN has h1', cn.includes('<h1>')],
    ['EN has Article JSON-LD', en.includes('"@type": "Article"')],
    ['EN has hreflang zh-CN', en.includes('hreflang="zh-CN"')],
    ['EN has hreflang en', en.includes('hreflang="en"')],
    ['EN has canonical', en.includes('rel="canonical"')],
    ['EN has og:image', en.includes('og:image')],
    ['EN has Chinese link', en.includes(`href="../${slug}.html"`)],
    ['EN has h1', en.includes('<h1>')],
  ];
  
  for (const [name, ok] of checks) {
    if (!ok) errors.push(`${slug}: ${name}`);
  }
  
  // Check index inclusion
  const cnIndex = fs.readFileSync('articles/index.html', 'utf8');
  if (!cnIndex.includes(slug)) errors.push(`${slug}: not in CN index`);
  
  const enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
  if (!enIndex.includes(slug)) errors.push(`${slug}: not in EN index`);
  
  // Check topic page
  const topic = fs.readFileSync('articles/ziwei-main-stars.html', 'utf8');
  if (!topic.includes(slug)) errors.push(`${slug}: not in topic page`);
  
  // Check feeds
  const cnFeed = fs.readFileSync('feed.xml', 'utf8');
  if (!cnFeed.includes(slug)) errors.push(`${slug}: not in CN feed`);
  
  const enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
  if (!enFeed.includes(slug)) errors.push(`${slug}: not in EN feed`);
  
  // Check sitemaps
  const smArticles = fs.readFileSync('sitemap-articles.xml', 'utf8');
  if (!smArticles.includes(slug)) errors.push(`${slug}: not in sitemap-articles`);
  
  const smEn = fs.readFileSync('sitemap-en.xml', 'utf8');
  if (!smEn.includes(slug)) errors.push(`${slug}: not in sitemap-en`);
  
  pass++;
}

console.log(`Validated ${pass}/${slugs.length} articles`);
if (errors.length === 0) {
  console.log('ALL PASS ✓');
} else {
  console.log(`\n${errors.length} ERRORS:`);
  errors.forEach(e => console.log(`  - ${e}`));
}
