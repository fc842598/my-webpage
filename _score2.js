const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'articles');
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.html')&&f!=='index.html');
const nonArticles=['ziwei-xiongdiongong.html','ziwei-case-patterns.html','ziwei-cycles.html','ziwei-four-transformations.html','ziwei-helper-malice-stars.html','ziwei-learning-path.html','ziwei-main-stars.html','ziwei-money-career.html','ziwei-palaces.html','ai-suanming-search-qa.html'];
const results=[];
for(const f of files){
  if(nonArticles.includes(f)) continue;
  const slug=f.replace('.html','');
  const html=fs.readFileSync(path.join(dir,f),'utf8');
  const m=html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if(!m) continue;
  const text=m[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const enPath=path.join(dir,'en',f);
  const enExists=fs.existsSync(enPath);
  let enLen=0;
  if(enExists){const em=fs.readFileSync(enPath,'utf8').match(/<article[^>]*>([\s\S]*?)<\/article>/);if(em)enLen=em[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().length;}
  const h2=(m[1].match(/<h2/g)||[]).length;
  const hasOl=/<ol>/.test(m[1]);
  const hasLead=/article-lead/.test(html);
  const hasJsonLd=html.includes('"@type": "Article"');
  const hasBreadcrumb=html.includes('BreadcrumbList');
  const hasOgImage=html.includes('og:image');
  const hasCta=html.includes('article-bottom-link');
  const titleM=html.match(/<h1[^>]*>(.*?)<\/h1>/);
  const title=titleM?titleM[1].replace(/<[^>]+>/g,''):'';
  const dateM=html.match(/datetime="([^"]+)"/);
  const date=dateM?dateM[1].substring(0,10):'';
  const garbled=/[\u00c3\u00c2\u201a\u00ac]/.test(text);
  results.push({slug,title,date,cnLen:text.length,enLen,h2,hasOl,hasLead,hasJsonLd,hasBreadcrumb,hasOgImage,hasCta,enExists,garbled});
}
results.forEach(r=>{
  let c=0;
  if(r.cnLen>=3000)c=40;else if(r.cnLen>=2000)c=35;else if(r.cnLen>=1500)c=28;else if(r.cnLen>=1000)c=20;else if(r.cnLen>=700)c=12;else c=5;
  let s=0;
  if(r.h2>=4)s+=10;else if(r.h2>=2)s+=5;
  if(r.hasOl)s+=5;
  if(r.hasLead)s+=5;
  let t=0;
  if(r.hasJsonLd)t+=7;if(r.hasBreadcrumb)t+=6;if(r.hasOgImage)t+=6;if(r.hasCta)t+=6;
  let e=0;
  if(r.enExists){e+=7;if(r.enLen>=r.cnLen*0.6)e+=8;}
  r.total=c+s+t+e;
  if(r.garbled)r.total-=10;
  r.scores={content:c,struct:s,tech:t,en:e};
});
results.sort((a,b)=>a.total-b.total);
console.log('=== WORST 20 ACTUAL ARTICLES ===\n');
for(let i=0;i<20;i++){
  const r=results[i];
  console.log('#'+(i+1)+' ['+r.total+'/100] '+r.slug+' ('+r.date+')');
  console.log('   '+r.title.substring(0,70));
  console.log('   CN:'+r.cnLen+' EN:'+r.enLen+' H2:'+r.h2+' OL:'+r.hasOl+' Lead:'+r.hasLead+' JSON:'+r.hasJsonLd+' BC:'+r.hasBreadcrumb+' OG:'+r.hasOgImage+' CTA:'+r.hasCta+' EN:'+r.enExists+(r.garbled?' GARBLED':''));
  console.log('   Scores: content='+r.scores.content+' struct='+r.scores.struct+' tech='+r.scores.tech+' en='+r.scores.en);
  console.log('');
}
console.log('Total actual articles:',results.length);
console.log('Avg score:',Math.round(results.reduce((s,r)=>s+r.total,0)/results.length));
console.log('No EN version:',results.filter(r=>!r.enExists).length);
console.log('<1000 chars:',results.filter(r=>r.cnLen<1000).length);
