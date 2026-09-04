const base=require('./_topics_0904.js');
const {T,batch,eng,DATE}=base;
const groups=[
 base.RAW,
 require('./_t_sihua.js'),
 require('./_t_kanpan.js'),
 require('./_t_geju.js'),
 require('./_t_zhuxing.js'),
 require('./_t_liunian.js'),
 require('./_t_faq.js'),
 require('./_t_yingyong.js')
];
const raw=groups.flat().filter(r=>r.slug!=='ziwei-liunian-sihua-ding-jinnian-xijie'); // 该篇留待后续批次，今日控制为40
if(raw.length!==40){console.error('EXPECT 40 GOT',raw.length);process.exit(1);}
// slug 唯一性
const slugs=raw.map(r=>r.slug);const dup=slugs.filter((s,i)=>slugs.indexOf(s)!==i);
if(dup.length){console.error('DUP SLUG',dup);process.exit(1);}
const topics=raw.map(T);
eng.generate(topics,batch,`_manifest_${DATE}.json`);
