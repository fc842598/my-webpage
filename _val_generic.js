const fs=require('fs'),path=require('path');
const manifest=require(process.argv[2]);
let errors=[],pass=0;
const cnIndex=fs.readFileSync('articles/index.html','utf8');
const enIndex=fs.readFileSync('articles/en/index.html','utf8');
const topic=fs.readFileSync('articles/ziwei-helper-malice-stars.html','utf8');
const cnFeed=fs.readFileSync('feed.xml','utf8');
const enFeed=fs.readFileSync('articles/en/feed.xml','utf8');
const smA=fs.readFileSync('sitemap-articles.xml','utf8');
const smE=fs.readFileSync('sitemap-en.xml','utf8');
for(const a of manifest){
 const slug=a.slug;
 const cn=fs.readFileSync(path.join('articles',slug+'.html'),'utf8');
 const en=fs.readFileSync(path.join('articles','en',slug+'.html'),'utf8');
 const has=s=>s.includes('"@type":"Article"')||s.includes('"@type": "Article"');
 const checks=[
  ['CN Article',has(cn)],['CN Breadcrumb',cn.includes('BreadcrumbList')],
  ['CN hreflang',cn.includes('hreflang="zh-CN"')&&cn.includes('hreflang="en"')],
  ['CN canonical',cn.includes('rel="canonical"')],['CN og',cn.includes('og:image')],
  ['CN analytics',cn.includes('site-analytics.js')],['CN CTA',cn.includes('mingbook-onepage.html')],
  ['CN ol',cn.includes('<ol>')],['EN Article',has(en)],
  ['EN hreflang',en.includes('hreflang="en"')],['EN CNlink',en.includes('href="../'+slug+'.html"')],
  ['idxCN',cnIndex.includes(slug)],['idxEN',enIndex.includes(slug)],['topic',topic.includes(slug)],
  ['feedCN',cnFeed.includes(slug)],['feedEN',enFeed.includes(slug)],['smCN',smA.includes(slug)],['smEN',smE.includes(slug)]
 ];
 for(const[n,ok]of checks)if(!ok)errors.push(slug+': '+n);
 pass++;
}
console.log('Validated '+pass+'/'+manifest.length);
if(!errors.length)console.log('ALL PASS');
else{console.log(errors.length+' ERRORS:');errors.slice(0,20).forEach(e=>console.log('  - '+e));process.exit(1);}
