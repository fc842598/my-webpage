const base=require('./_topics_0904.js');
const {T,eng}=base;
const DATE='2026-09-16';
const batch={date:DATE,label:DATE,rfc:DATE+'T10:00:00+08:00'};
const groups=[
 require('./_catchup_0916_01.js'),
 require('./_catchup_0916_02.js'),
 require('./_catchup_0916_03.js'),
 require('./_catchup_0916_04.js'),
 require('./_catchup_0916_05.js')
];
const raw=groups.flat();
if(raw.length!==40){console.error('EXPECT 40 GOT',raw.length);process.exit(1);}
const slugs=raw.map(r=>r.slug);const dup=slugs.filter((s,i)=>slugs.indexOf(s)!==i);
if(dup.length){console.error('DUP SLUG',dup);process.exit(1);}
const fs=require('fs');
const cnExist=new Set(fs.readdirSync('articles').filter(f=>f.endsWith('.html')));
const enExist=new Set(fs.readdirSync('articles/en').filter(f=>f.endsWith('.html')));
const clashCn=slugs.filter(s=>cnExist.has(s+'.html'));
const clashEn=slugs.filter(s=>enExist.has(s+'.html'));
if(clashCn.length){console.error('CN SLUG ALREADY EXISTS',clashCn);process.exit(1);}
if(clashEn.length){console.error('EN SLUG ALREADY EXISTS',clashEn);process.exit(1);}
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
 if(!require('./_engine_topic.js').CAT[r.cat])errs.push(r.slug+' unknown cat '+r.cat);
});
if(errs.length){console.error('FIELD ERRORS\n'+errs.join('\n'));process.exit(1);}
const byCat={};raw.forEach(r=>{byCat[r.cat]=(byCat[r.cat]||0)+1;});
console.log('cats',byCat);
const topics=raw.map(T);
eng.generate(topics,batch,`_manifest_catchup_0916.json`);
