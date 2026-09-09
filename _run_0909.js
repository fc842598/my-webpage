const base=require('./_topics_0904.js');
const {T,eng}=base;
const DATE='2026-09-09';
const batch={date:DATE,label:DATE,rfc:DATE+'T10:00:00+08:00'};
const groups=[
 require('./_t09_kanpan.js'),
 require('./_t09_sihua.js'),
 require('./_t09_fuzhu.js'),
 require('./_t09_geju.js'),
 require('./_t09_liunian.js'),
 require('./_t09_yingyong.js'),
 require('./_t09_ganqing_faq.js')
];
const raw=groups.flat();
if(raw.length!==40){console.error('EXPECT 40 GOT',raw.length);process.exit(1);}
const slugs=raw.map(r=>r.slug);const dup=slugs.filter((s,i)=>slugs.indexOf(s)!==i);
if(dup.length){console.error('DUP SLUG',dup);process.exit(1);}
const fs=require('fs');
const exist=new Set(fs.readdirSync('articles').filter(f=>f.endsWith('.html')));
const clash=slugs.filter(s=>exist.has(s+'.html'));
if(clash.length){console.error('SLUG ALREADY EXISTS',clash);process.exit(1);}
// 字段完整性校验
let errs=[];
raw.forEach(r=>{
 const need=['cat','slug','focus','focusEn','cnT','enT','cnD','enD','cnL','enL','cnA','enA','cnLog','enLog','cnStep','enStep','cnMis','enMis','cnClose','enClose'];
 need.forEach(k=>{if(r[k]===undefined)errs.push(r.slug+' missing '+k);});
 if(r.cnLog&&r.cnLog.length!==4)errs.push(r.slug+' cnLog='+r.cnLog.length);
 if(r.enLog&&r.enLog.length!==4)errs.push(r.slug+' enLog='+r.enLog.length);
 if(r.cnStep&&r.cnStep.length!==6)errs.push(r.slug+' cnStep='+r.cnStep.length);
 if(r.enStep&&r.enStep.length!==6)errs.push(r.slug+' enStep='+r.enStep.length);
 if(r.cnMis&&r.cnMis.length!==3)errs.push(r.slug+' cnMis='+r.cnMis.length);
 if(r.enMis&&r.enMis.length!==3)errs.push(r.slug+' enMis='+r.enMis.length);
});
if(errs.length){console.error('FIELD ERRORS\n'+errs.join('\n'));process.exit(1);}
const byCat={};raw.forEach(r=>{byCat[r.cat]=(byCat[r.cat]||0)+1;});
console.log('cats',byCat);
const topics=raw.map(T);
eng.generate(topics,batch,`_manifest_${DATE}.json`);
