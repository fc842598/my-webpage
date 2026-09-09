import {copyFileSync,readFileSync,writeFileSync} from 'node:fs';
import {appendArticleCollections} from '../../scripts/append-article-collections.mjs';
import articles from './humanizer-20260909.mjs';
const root='.article-preview-20260909';
const files=['articles/index.html','articles/en/index.html','feed.xml','articles/en/feed.xml','sitemap.xml','sitemap-articles.xml','sitemap-en.xml'];
const before=new Map(files.map(f=>[f,readFileSync(f,'utf8')]));
const queue=readFileSync('docs/ziwei-daily-2026-09-09-queue.md','utf8');
for(const f of files)copyFileSync(f,root+'/'+f);
appendArticleCollections(root,articles,{preserveTopicHubs:true});
const errors=[];
for(const f of files){
 if(readFileSync(f,'utf8')!==before.get(f))errors.push('Production file changed: '+f);
 const text=readFileSync(root+'/'+f,'utf8');
 for(const a of articles)if(!text.includes(a.slug+'.html'))errors.push('Missing '+a.slug+' in '+f);
 if(f.startsWith('sitemap')){
  for(const m of before.get(f).matchAll(/<url>[\s\S]*?<\/url>/g)){
   if(/<loc>https:\/\/yuetianai.com\/articles\/(?:en\/)?<\/loc>/.test(m[0]))continue;
   if(!text.includes(m[0]))errors.push('Old sitemap item changed: '+f+' '+m[0].slice(0,100));
  }
 }
}
for(const a of articles){
 const html=readFileSync(root+'/articles/'+a.slug+'.html','utf8');
 const stamp=html.match(/"datePublished":\s*"([^"]+)"/)[1];
 for(const f of ['sitemap.xml','sitemap-articles.xml','sitemap-en.xml']){
  const text=readFileSync(root+'/'+f,'utf8');
  for(const m of text.matchAll(/<url>[\s\S]*?<\/url>/g))if(m[0].includes(a.slug+'.html')&&!m[0].includes('<lastmod>'+stamp+'</lastmod>'))errors.push('Wrong sitemap date '+a.slug);
 }
 for(const f of ['feed.xml','articles/en/feed.xml']){
  const text=readFileSync(root+'/'+f,'utf8');
  const item=[...text.matchAll(/<item>[\s\S]*?<\/item>/g)].find(m=>m[0].includes(a.slug+'.html'))?.[0];
  const rss=item?.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];
  if(new Date(rss).getTime()!==new Date(stamp).getTime())errors.push('Wrong RSS date '+a.slug);
 }
}
if(queue!==readFileSync('docs/ziwei-daily-2026-09-09-queue.md','utf8')||queue.includes('已发布'))errors.push('Queue mutated');
const result={prepared:10,pages:20,collections:7,errors};
writeFileSync('docs/article-drafts/2026-09-09-validation.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));if(errors.length)process.exit(1);
