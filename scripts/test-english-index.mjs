import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { normalizeEnglishIndex } from './normalize-english-index.mjs';

const html = readFileSync(new URL('../articles/en/index.html', import.meta.url), 'utf8');
const normalized = normalizeEnglishIndex(html);
const links = text => [...text.matchAll(/class="card-link" href="([^"]+)"/g)].map(m => m[1]).sort();
assert.deepEqual(links(normalized), links(html), 'Do not lose or duplicate any article');
assert.equal(normalizeEnglishIndex(normalized), normalized, 'Normalization is idempotent');
const groups = [...normalized.matchAll(/<details class="article-group"[^>]*>[\s\S]*?<\/details>/g)].map(m => m[0]);
assert.equal((groups[0].match(/<article /g) || []).length, 1);
assert.ok(groups[1].includes(`${links(html).length - 1} Articles`));
assert.doesNotMatch(groups[0], /围绕靠谱不靠谱/);
for (const json of normalized.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(json[1]);
const generator = readFileSync(new URL('./publish-local-article-batch.mjs', import.meta.url), 'utf8');
assert.match(generator, /escapeHtml\(item\.enName\)[\s\S]{0,80}escapeHtml\(item\.enDesc\)/);
console.log(`PASS English index keeps ${links(html).length} cards, separate groups, translated summary and valid JSON-LD`);
