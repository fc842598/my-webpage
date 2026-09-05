const base=require('./_topics_0904.js');
const {T,eng}=base;
const DATE='2026-09-05';
const batch={date:DATE,label:DATE,rfc:DATE+'T10:00:00+08:00'};
const groups=[
 require('./_t05_fuzhu.js'),
 require('./_t05_gongwei.js'),
 require('./_t05_ganqing.js'),
 require('./_t05_sihua.js'),
 require('./_t05_zhuxing.js'),
 require('./_t05_liunian.js'),
 require('./_t05_liuqin_faq.js')
];
const raw=groups.flat();
if(raw.length!==40){console.error('EXPECT 40 GOT',raw.length);process.exit(1);}
// slug 唯一性（批内）
const slugs=raw.map(r=>r.slug);const dup=slugs.filter((s,i)=>slugs.indexOf(s)!==i);
if(dup.length){console.error('DUP SLUG',dup);process.exit(1);}
// 与磁盘已有文章去重
const fs=require('fs');
const exist=new Set(fs.readdirSync('articles').filter(f=>f.endsWith('.html')));
const clash=slugs.filter(s=>exist.has(s+'.html'));
if(clash.length){console.error('SLUG ALREADY EXISTS',clash);process.exit(1);}
const byCat={};raw.forEach(r=>{byCat[r.cat]=(byCat[r.cat]||0)+1;});
console.log('cats',byCat);
const topics=raw.map(T);
eng.generate(topics,batch,`_manifest_${DATE}.json`);
