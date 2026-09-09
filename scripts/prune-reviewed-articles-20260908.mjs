import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';

// Explicit reviewed URLs only. No score-based or keyword-based automatic deletion.
const slugs=['ziwei-tianshang-zai-caibogong','ai-suanming-hepan-qian-yinsi-ziliao-xian-queren-shenme','ai-suanming-huanchengshi-dushu-gongzuo-xiankan-ziwei-haishi-bazi','ai-suanming-kan-hezuo-xiangmu-buxiangxian-baolu-gongsixijie','ai-suanming-kan-hezuo-fenzhang-huikuan-shihema','ziwei-puyigong-haoxing-bibai-ju','ziwei-tianshi-zai-caibogong','ziwei-tianshang-zai-minggong','ziwei-tianshang-zai-xiongdigong'];
slugs.push('ziwei-tianshi-zai-xiongdigong','ziwei-tianshi-zai-minggong');
const urls=slugs.flatMap(s=>[`https://yuetianai.com/articles/${s}.html`,`https://yuetianai.com/articles/en/${s}.html`]);
const files=['articles/index.html','articles/en/index.html','articles/ziwei-helper-malice-stars.html','articles/ai-suanming-search-qa.html','articles/en/ai-fortune-telling-search-qa.html','articles/ziwei-learning-path.html','articles/ziwei-money-career.html','articles/ziwei-palaces.html'];
const pending=new Map();
for(const file of files){
 const old=readFileSync(file,'utf8');
 let updated=old.replace(/<article\b[^>]*class="article-card"[^>]*>[\s\S]*?<\/article>/g,block=>slugs.some(s=>block.includes(`href="${s}.html"`))?'':block);
 updated=updated.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,(whole,start,json,end)=>{
  const data=JSON.parse(json);let changed=false;
  function walk(value){if(!value||typeof value!=='object')return;
   if(value['@type']==='ItemList'&&Array.isArray(value.itemListElement)){
    const before=value.itemListElement.length;
    value.itemListElement=value.itemListElement.filter(i=>!urls.includes(i.url||i.item?.url||i.item));
    if(before!==value.itemListElement.length){changed=true;value.itemListElement.forEach((i,n)=>i.position=n+1);if('numberOfItems'in value)value.numberOfItems=value.itemListElement.length;}
   }
   for(const child of Object.values(value))if(Array.isArray(child))child.forEach(walk);else walk(child);
  }
  walk(data);return changed?start+'\n  '+JSON.stringify(data,null,2)+'\n  '+end:whole;
 });
 updated=updated.replace(/^[\t ]+$/gm,'');
 assert(!slugs.some(s=>updated.includes(s)),`${file}: residual URL`);
 if(updated!==old)pending.set(file,updated);
}
for(const file of ['sitemap.xml','sitemap-articles.xml','sitemap-en.xml','feed.xml','articles/en/feed.xml']){
 const old=readFileSync(file,'utf8');const updated=old.replace(/\s*<(url|item)>[\s\S]*?<\/\1>/g,block=>urls.some(url=>block.includes(url))?'':block);
 assert(!slugs.some(s=>updated.includes(s)),`${file}: residual URL`);
 if(updated!==old)pending.set(file,updated);
}
const manifest='_manifest_0902.json';
if(existsSync(manifest)){const old=readFileSync(manifest,'utf8');const data=JSON.parse(old);const remaining=data.filter(r=>!slugs.includes(r.slug));if(remaining.length!==data.length)pending.set(manifest,JSON.stringify(remaining,null,1)+'\n');}
if(process.argv.includes('--apply'))for(const [file,value] of pending)writeFileSync(file,value);
console.log(JSON.stringify({applied:process.argv.includes('--apply'),files:[...pending.keys()],retiredUrls:urls},null,2));
