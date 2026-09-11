import {readFileSync,writeFileSync,readdirSync,existsSync,copyFileSync} from 'node:fs';
import path from 'node:path';
import articles from './humanizer-20260911.mjs';
import {appendArticleCollections} from '../../scripts/append-article-collections.mjs';
const root='.article-preview-20260911',date='2026-09-11';
const errors=[],advisories=[];
const queue=readFileSync(`docs/ziwei-daily-${date}-queue.md`,'utf8');
const files=['articles/index.html','articles/en/index.html','feed.xml','articles/en/feed.xml','sitemap.xml','sitemap-articles.xml','sitemap-en.xml'];
const before=new Map(files.map(f=>[f,readFileSync(f,'utf8')]));
const strip=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const old=readdirSync('articles').filter(f=>f.endsWith('.html')).map(f=>{const s=readFileSync('articles/'+f,'utf8');return {file:f,title:strip(s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||''),paragraphs:[...s.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m=>strip(m[1]))}});
const paragraphs=new Set(old.flatMap(x=>x.paragraphs.filter(p=>p.length>55)));
const gram=s=>new Set([...s].slice(0,-1).map((x,i)=>s.slice(i,i+2)));
const sim=(a,b)=>{const x=gram(a),y=gram(b),same=[...x].filter(z=>y.has(z)).length;return 2*same/(x.size+y.size||1)};
const seen=new Set();
for(const a of articles){
 const nearest=old.map(o=>({...o,score:sim(a.title,o.title)})).sort((x,y)=>y.score-x.score).slice(0,3).map(o=>({title:o.title,file:o.file,score:+o.score.toFixed(3)}));
 advisories.push({slug:a.slug,title:a.title,nearest});
 if(seen.has(a.title)||old.some(o=>o.title===a.title))errors.push('Duplicate title '+a.slug);seen.add(a.title);
 for(const lang of ['','en/']){
  const rel=`articles/${lang}${a.slug}.html`,html=readFileSync(root+'/'+rel,'utf8');
  const blocks=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  const data=blocks.find(x=>x['@type']==='Article');const url='https://yuetianai.com/'+rel;
  if(!data||data.mainEntityOfPage!==url)errors.push('JSONLD URL '+rel);
  if(!/^2026-09-11T\d\d:\d\d:00\+08:00$/.test(data.datePublished)||data.datePublished!==data.dateModified)errors.push('Date '+rel);
  for(const tag of [`rel="canonical" href="${url}"`,`property="og:url" content="${url}"`,'name="description"','property="og:description"','hreflang="zh-CN"','hreflang="en"'])if(!html.includes(tag))errors.push('Metadata '+rel+' '+tag);
  for(const target of ['https://yuetianai.com/articles/'+a.slug+'.html','https://yuetianai.com/articles/en/'+a.slug+'.html'])if(!html.includes(target))errors.push('Alternate URL '+rel);
  const body=html.match(/<div class="article-body">([\s\S]*?)<\/div>/)?.[1]||html.match(/<main[\s\S]*?<\/main>/)?.[0]||'';
  if(/文稿里|讲义里|他说|天纪|倪海厦|证据卡|source-extract/.test(body))errors.push('Forbidden '+rel);
  if(/(?:^|>)\s*#{1,4}\s|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)/m.test(body))errors.push('Markdown '+rel);
  for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
   if(/^(?:https?:|data:|mailto:|tel:|javascript:)/.test(m[1]))continue;
   let target=path.normalize(path.join(path.dirname(rel),m[1].split(/[?#]/)[0]));if(m[1].endsWith('/'))target=path.join(target,'index.html');
   if(!existsSync(root+'/'+target)&&!existsSync(target))errors.push('Broken link '+rel+' '+m[1]);
  }
  if(!lang)for(const m of body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)){const p=strip(m[1]);if(p.length>55&&paragraphs.has(p))errors.push('Repeated old paragraph '+a.slug);}
 }
 if(existsSync('articles/'+a.slug+'.html')||existsSync('articles/en/'+a.slug+'.html'))errors.push('Premature public file '+a.slug);
}
for(const f of files)copyFileSync(f,root+'/'+f);
appendArticleCollections(root,articles,{preserveTopicHubs:true});
for(const f of files){
 const now=readFileSync(root+'/'+f,'utf8');
 if(readFileSync(f,'utf8')!==before.get(f))errors.push('Production collection changed '+f);
 for(const a of articles)if(!now.includes(a.slug+'.html'))errors.push('Missing collection '+f+' '+a.slug);
 if(f.startsWith('sitemap'))for(const m of before.get(f).matchAll(/<url>[\s\S]*?<\/url>/g)){
  if(/<loc>https:\/\/yuetianai.com\/articles\/(?:en\/)?<\/loc>/.test(m[0]))continue;
  if(!now.includes(m[0]))errors.push('Old sitemap item changed '+f);
 }
}
for(const a of articles){
 const stamp=readFileSync(root+'/articles/'+a.slug+'.html','utf8').match(/"datePublished":\s*"([^"]+)"/)[1];
 for(const f of files.filter(x=>x.startsWith('sitemap')))for(const m of readFileSync(root+'/'+f,'utf8').matchAll(/<url>[\s\S]*?<\/url>/g))if(m[0].includes(a.slug+'.html')&&!m[0].includes('<lastmod>'+stamp+'</lastmod>'))errors.push('Sitemap time '+a.slug);
 for(const f of ['feed.xml','articles/en/feed.xml']){const item=[...readFileSync(root+'/'+f,'utf8').matchAll(/<item>[\s\S]*?<\/item>/g)].find(m=>m[0].includes(a.slug+'.html'))?.[0];const d=item?.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];if(new Date(d).getTime()!==new Date(stamp).getTime())errors.push('RSS time '+a.slug);}
}
if(queue!==readFileSync(`docs/ziwei-daily-${date}-queue.md`,'utf8')||queue.includes('已发布'))errors.push('Queue changed');
writeFileSync(`docs/article-drafts/${date}-overlap-advisories.json`,JSON.stringify(advisories,null,2)+'\n');
writeFileSync(`docs/article-drafts/${date}-validation.json`,JSON.stringify({checkedAt:new Date().toISOString(),articles:30,pages:60,collections:7,errors},null,2)+'\n');
console.log(JSON.stringify({articles:30,pages:60,errors}));if(errors.length)process.exit(1);
