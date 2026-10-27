// 2026-10-23 补20篇（3组 7+7+6）=40 HTML（中英双语）
const fs=require('fs');
const {T,eng}=require('./_topics_0904.js');
const DATE='2026-10-23';
const batch={date:DATE,label:DATE,rfc:DATE+'T10:00:00+08:00'};
const g1=require('./_t1023_01_jiaoyu.js');
const g2=require('./_t1023_02_xiaofei.js');
const g3=require('./_t1023_03_jiating.js');
const raw=[...g1,...g2,...g3];
const EXPECT=20;
const cats={};
raw.forEach(a=>{cats[a.cat]=(cats[a.cat]||0)+1;});
console.log('cats',cats);
if(raw.length!==EXPECT){console.error('COUNT FAIL',raw.length,'expected',EXPECT);process.exit(1);}
// 批内去重
const slugs=new Set();
for(const a of raw){
  if(slugs.has(a.slug)){console.error('BATCH DUP slug',a.slug);process.exit(1);}
  slugs.add(a.slug);
}
// 全站去重（articles 与 articles/en）
const cn=new Set(fs.readdirSync('articles').filter(f=>f.endsWith('.html')).map(f=>f.replace('.html','')));
const en=new Set(fs.readdirSync('articles/en').filter(f=>f.endsWith('.html')).map(f=>f.replace('.html','')));
for(const a of raw){
  if(cn.has(a.slug)){console.error('CN DUP slug',a.slug);process.exit(1);}
  if(en.has(a.slug)){console.error('EN DUP slug',a.slug);process.exit(1);}
}
// 字段完整性
const need=['cat','slug','focus','focusEn','cnT','enT','cnD','enD','cnL','enL','cnA','enA','cnLog','enLog','cnStep','enStep','cnMis','enMis','cnClose','enClose'];
for(const a of raw){
  for(const k of need){if(!a[k]){console.error('MISSING',k,a.slug);process.exit(1);}}
  [['cnLog',4],['enLog',4],['cnStep',6],['enStep',6],['cnMis',3],['enMis',3]].forEach(([k,n])=>{
    if(!Array.isArray(a[k])||a[k].length!==n){console.error('ARRAY',k,'len',a[k]&&a[k].length,a.slug);process.exit(1);}
  });
}
const topics=raw.map(T);
console.log('TOTAL',topics.length,'topics,',topics.length*2,'HTML');
eng.generate(topics,batch,'_manifest_'+DATE+'.json');
