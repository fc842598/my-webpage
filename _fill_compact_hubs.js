const fs=require('fs'),path=require('path');
const DRY=process.argv.includes('--write')?false:true;
const dir='articles';

// scan CN articles -> slug info
const A={};
fs.readdirSync(dir).filter(f=>f.endsWith('.html')&&f!=='index.html').forEach(f=>{
 const c=fs.readFileSync(path.join(dir,f),'utf8');
 const g=re=>{const m=c.match(re);return m?m[1]:null;};
 A[f.replace('.html','')]={sec:g(/"articleSection":"(.*?)"/),
  title:g(/<meta property="og:title" content="(.*?)"/),
  desc:g(/<meta property="og:description" content="(.*?)"/),
  date:g(/"datePublished":"(.*?)"/)};
});

const FILL=[
 {hub:'ziwei-cycles.html',secs:['大限流年'],tag:'大限流年'},
 {hub:'ziwei-money-career.html',secs:['财运事业'],tag:'财运事业'},
 {hub:'ziwei-palaces.html',secs:['十二宫细读','十二宫'],tag:'宫位组合'}
];

function existingCards(c){
 const cards=[];let p=0;
 const open='<article class="article-card"';
 while(true){
  const s=c.indexOf(open,p);if(s<0)break;
  const e=c.indexOf('</article>',s);if(e<0)break;
  const raw=c.slice(s,e+'</article>'.length);
  const dt=(raw.match(/<time datetime="(.*?)">/)||[])[1]||'';
  const slug=(raw.match(/href="([^"]+)\.html">/)||[])[1]||'';
  cards.push({raw,dt,slug});p=e+1;
 }
 return cards;
}
function makeCard(slug,v,tag,idx){
 const rfc=v.date+'T10:00:00+08:00';
 const lab=v.date+' 10:00';
 return `<article class="article-card" data-index="${idx}"><div class="card-body"><div class="card-meta"><span class="tag">${tag}</span><span><time datetime="${rfc}">${lab}</time></span></div><h3>${v.title}</h3><p>${v.desc}</p><a class="card-link" href="${slug}.html">阅读全文</a></div></article>`;
}

for(const P of FILL){
 let c=fs.readFileSync(path.join(dir,P.hub),'utf8');
 const have=existingCards(c);
 const haveSlug=new Set(have.map(x=>x.slug));
 const missing=Object.entries(A).filter(([s,v])=>P.secs.includes(v.sec)&&!haveSlug.has(s))
  .map(([s,v])=>({slug:s,v,dt:v.date+'T10:00:00+08:00'}));
 // merge & sort desc, stable (existing keep relative order via index)
 const merged=[
  ...missing.map(m=>({dt:m.dt,raw:null,slug:m.slug,v:m.v,new:true}),
  ),
  ...have.map(x=>({dt:x.dt,raw:x.raw,slug:x.slug,v:null,new:false}))
 ];
 // stable sort desc
 merged.sort((x,y)=>x.dt<y.dt?1:x.dt>y.dt?-1:0);
 const cards=merged.map((m,i)=>{
  const idx=String(i+1).padStart(2,'0');
  if(m.new)return makeCard(m.slug,m.v,P.tag,idx);
  return m.raw.replace(/data-index="\d+"/,'data-index="'+idx+'"');
 });
 const newCount=cards.length, oldCount=have.length;
 console.log('==== '+P.hub+' ====');
 console.log('existing cards:',oldCount,'| missing to add:',missing.length,'| new total:',newCount);
 console.log('missing slugs:',missing.map(m=>m.slug).join(', '));
 console.log('after sort top3:',cards.slice(0,3).map(r=>r.slice(0,70)));
 console.log('after sort last2:',cards.slice(-2).map(r=>r.slice(0,70)));
 if(!DRY){
  const listOpen='<div class="article-list">';
  const ls=c.indexOf(listOpen);
  const regionStart=c.indexOf('\n',ls+listOpen.length)+1;
  const lastEnd=c.lastIndexOf('</article>')+'</article>'.length;
  c=c.slice(0,regionStart)+cards.join('\n')+c.slice(lastEnd);
  // update count
  c=c.replace(/(<span class="section-toggle"><span>)\d+( 篇<\/span>)/,'$1'+newCount+'$2');
  fs.writeFileSync(path.join(dir,P.hub),c,'utf8');
  console.log('  WRITTEN.');
 }
 console.log();
}

// four-transformations: add notice pointing to sihua (do not duplicate cards)
{
 const hub='ziwei-four-transformations.html';
 let c=fs.readFileSync(path.join(dir,hub),'utf8');
 const marker='data-sihua-notice';
 console.log('==== '+hub+' notice ====');
 if(c.includes(marker)){console.log('notice already present, skip');}
 else{
  const notice='<div '+marker+' style="margin:14px 0;padding:12px 16px;border:1px solid #e3c98b;border-radius:10px;background:#fbf6ea;color:#5a4a24;line-height:1.7">本页为四化内容历史归档。最新四化飞星（化禄、化权、化科、化忌）的系统解读，请见 <a href="ziwei-sihua.html" style="color:#8a6d1f;font-weight:600">四化飞星专题</a>。</div>\n          ';
  const anchor='<div class="article-list">';
  const pos=c.indexOf(anchor);
  if(!DRY){c=c.slice(0,pos)+notice+c.slice(pos);fs.writeFileSync(path.join(dir,hub),c,'utf8');console.log('  notice WRITTEN.');}
  else console.log('  would insert notice before article-list (dry-run).');
 }
}
console.log(DRY?'\n[DRY-RUN, no files changed]':'\n[DONE]');
