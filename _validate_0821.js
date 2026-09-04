const fs=require('fs');
const slugs=[
'ziwei-ziwei-zai-minggong','ziwei-ziwei-zai-xiongdigong','ziwei-ziwei-zai-fuqigong','ziwei-ziwei-zai-zinvgong',
'ziwei-ziwei-zai-caibogong','ziwei-ziwei-zai-jiegong','ziwei-ziwei-zai-qianyi','ziwei-ziwei-zai-puyigong',
'ziwei-ziwei-zai-guanlugong','ziwei-ziwei-zai-tianzhaigong','ziwei-ziwei-zai-fudegong','ziwei-ziwei-zai-fumugong',
'ziwei-tianji-zai-minggong','ziwei-tianji-zai-xiongdigong','ziwei-tianji-zai-fuqigong','ziwei-tianji-zai-zinvgong',
'ziwei-tianji-zai-caibogong','ziwei-tianji-zai-jiegong','ziwei-tianji-zai-qianyi','ziwei-tianji-zai-puyigong',
'ziwei-tianji-zai-guanlugong','ziwei-tianji-zai-tianzhaigong','ziwei-tianji-zai-fudegong','ziwei-tianji-zai-fumugong',
'ziwei-taiyang-zai-minggong','ziwei-taiyang-zai-xiongdigong','ziwei-taiyang-zai-fuqigong','ziwei-taiyang-zai-zinvgong',
'ziwei-taiyang-zai-caibogong','ziwei-taiyang-zai-jiegong','ziwei-taiyang-zai-qianyi','ziwei-taiyang-zai-puyigong',
'ziwei-taiyang-zai-guanlugong','ziwei-taiyang-zai-tianzhaigong','ziwei-taiyang-zai-fudegong','ziwei-taiyang-zai-fumugong',
'ziwei-wuqu-zai-minggong','ziwei-wuqu-zai-xiongdigong','ziwei-wuqu-zai-fuqigong','ziwei-wuqu-zai-zinvgong'
];
let errors=0;
// Check each article
for(const slug of slugs){
  const cnPath=`articles/${slug}.html`;
  const enPath=`articles/en/${slug}.html`;
  if(!fs.existsSync(cnPath)){console.log(`MISSING CN: ${cnPath}`);errors++;continue;}
  if(!fs.existsSync(enPath)){console.log(`MISSING EN: ${enPath}`);errors++;continue;}
  const cn=fs.readFileSync(cnPath,'utf8');
  const en=fs.readFileSync(enPath,'utf8');
  // CN checks
  if(!cn.includes('"@type": "Article"')){console.log(`CN no Article JSON-LD: ${slug}`);errors++;}
  if(!cn.includes('"@type": "BreadcrumbList"')){console.log(`CN no BreadcrumbList: ${slug}`);errors++;}
  if(!cn.includes('hreflang="en"')){console.log(`CN no hreflang en: ${slug}`);errors++;}
  if(!cn.includes('og:image')){console.log(`CN no og:image: ${slug}`);errors++;}
  if(!cn.includes('article-bottom-link')){console.log(`CN no CTA: ${slug}`);errors++;}
  if(!cn.includes('<ol>')){console.log(`CN no ol: ${slug}`);errors++;}
  // EN checks
  if(!en.includes('"@type": "Article"')){console.log(`EN no Article JSON-LD: ${slug}`);errors++;}
  if(!en.includes('hreflang="zh-CN"')){console.log(`EN no hreflang zh: ${slug}`);errors++;}
  if(!en.includes('og:image')){console.log(`EN no og:image: ${slug}`);errors++;}
  if(!en.includes('article-bottom-link')){console.log(`EN no CTA: ${slug}`);errors++;}
  if(!en.includes('<ol>')){console.log(`EN no ol: ${slug}`);errors++;}
}
// Check indexes
const cnIdx=fs.readFileSync('articles/index.html','utf8');
const enIdx=fs.readFileSync('articles/en/index.html','utf8');
const topic=fs.readFileSync('articles/ziwei-main-stars.html','utf8');
const sitemap=fs.readFileSync('sitemap.xml','utf8');
const cnFeed=fs.readFileSync('feed.xml','utf8');
const enFeed=fs.readFileSync('articles/en/feed.xml','utf8');
for(const slug of slugs){
  if(!cnIdx.includes(`${slug}.html`)){console.log(`CN index missing: ${slug}`);errors++;}
  if(!enIdx.includes(`${slug}.html`)){console.log(`EN index missing: ${slug}`);errors++;}
  if(!topic.includes(`${slug}.html`)){console.log(`Topic missing: ${slug}`);errors++;}
  if(!sitemap.includes(`articles/${slug}.html`)){console.log(`Sitemap missing CN: ${slug}`);errors++;}
  if(!sitemap.includes(`articles/en/${slug}.html`)){console.log(`Sitemap missing EN: ${slug}`);errors++;}
  if(!cnFeed.includes(`${slug}.html`)){console.log(`CN feed missing: ${slug}`);errors++;}
  if(!enFeed.includes(`${slug}.html`)){console.log(`EN feed missing: ${slug}`);errors++;}
}
// Check counts
if(!cnIdx.includes('58 篇')){console.log('CN index count not 58');errors++;}
if(!topic.includes('127 篇')){console.log('Topic count not 127');errors++;}
console.log(`\nValidation complete: ${errors===0?'ALL PASS':errors+' ERRORS'}`);
