import { readdirSync, readFileSync } from 'node:fs';
import { normalizeEnglishZiweiTerms } from './english-ziwei-terminology.mjs';
export const modified = '2026-11-05T17:05:00+08:00';
export const revisions = readdirSync('articles/en').filter(name => name.endsWith('.html') && name !== 'index.html').flatMap(name => {
  const file = `articles/en/${name}`;
  const html = readFileSync(file, 'utf8');
  if (normalizeEnglishZiweiTerms(html) === html) return [];
  const schema = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1])).find(item => item['@type'] === 'Article');
  const body = html.match(/<article\b[^>]*id="article-start"[^>]*>([\s\S]*?)<\/article>/)?.[1];
  if (!schema || !body) throw new Error(`Article markup missing: ${file}`);
  return [{ file, title: normalizeEnglishZiweiTerms(schema.headline), description: normalizeEnglishZiweiTerms(schema.description), body: normalizeEnglishZiweiTerms(body).trim() }];
});
