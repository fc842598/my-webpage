import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const entry='<a class="index-overview__link" href="../pages/ziwei-palace-training.html">练习紫微 · 十二宫记忆训练</a>';
for(const file of ['../articles/index.html','./publish-local-article-batch.mjs']) assert.ok(readFileSync(new URL(file,import.meta.url),'utf8').includes(entry),file);
assert.ok(existsSync(new URL('../pages/ziwei-palace-training.html',import.meta.url)));
const html=readFileSync(new URL('../articles/index.html',import.meta.url),'utf8');
for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
console.log('PASS practice entry in published index and generator, target exists, JSON-LD valid');
