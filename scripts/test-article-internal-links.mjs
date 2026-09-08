import {readdirSync,readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const files=['articles','articles/en'].flatMap(dir=>readdirSync(dir).filter(f=>f.endsWith('.html')).map(f=>`${dir}/${f}`));
const failures=[];let checked=0;
for(const file of files){
 const html=readFileSync(file,'utf8');
 for(const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])([^"']+)\1/gi)){
  let url;try{url=new URL(match[2].replaceAll('&amp;','&'),`https://yuetianai.com/${file}`);}catch{continue;}
  if(!['yuetianai.com','www.yuetianai.com'].includes(url.hostname)||!url.pathname.startsWith('/articles/'))continue;
  let target=decodeURIComponent(url.pathname).slice(1);if(target.endsWith('/'))target+='index.html';
  checked++;if(!existsSync(path.resolve(target)))failures.push(`${file} -> ${target}`);
 }
 for(const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
  try{JSON.parse(match[1]);}catch{failures.push(`${file}: invalid JSON-LD`);}
 }
}
assert.equal(failures.length,0,failures.slice(0,25).join('\n'));
console.log(`PASS ${files.length} article pages, ${checked} internal article links, JSON-LD valid`);
