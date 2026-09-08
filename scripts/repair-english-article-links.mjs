import { readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// Only repair missing English filenames with an explicit published hreflang pair.
// Never guess a destination from a similar title or redirect to unrelated content.
const root = process.cwd();
const directory = path.join(root, 'articles/en');
const files = readdirSync(directory).filter(name => name.endsWith('.html'));
const pairs = new Map();
for (const file of files) {
  const html = readFileSync(path.join(directory, file), 'utf8');
  const zh = html.match(/<link\b[^>]*hreflang=["']zh-CN["'][^>]*href=["']https:\/\/(?:www\.)?yuetianai\.com\/articles\/([^/"']+\.html)["']/i)?.[1];
  if (!zh) continue;
  if (pairs.has(zh) && pairs.get(zh) !== file) pairs.set(zh, null);
  else if (!pairs.has(zh)) pairs.set(zh, file);
}
let changedFiles = 0, repairedLinks = 0;
const changes = new Map();
for (const file of files) {
  const fullPath = path.join(directory, file);
  const html = readFileSync(fullPath, 'utf8');
  const updated = html.replace(/(<a\b[^>]*\bhref\s*=\s*)(["'])([^"']+)\2/gi, (whole, prefix, quote, href) => {
    let url;
    try { url = new URL(href, `https://yuetianai.com/articles/en/${file}`); } catch { return whole; }
    if (!['yuetianai.com', 'www.yuetianai.com'].includes(url.hostname) || !url.pathname.startsWith('/articles/en/')) return whole;
    const missing = url.pathname.slice('/articles/en/'.length);
    if (missing.includes('/') || existsSync(path.join(directory, missing))) return whole;
    const target = pairs.get(missing);
    if (!target || !existsSync(path.join(directory, target))) return whole;
    repairedLinks++;
    changes.set(missing, target);
    return `${prefix}${quote}/articles/en/${target}${url.search}${url.hash}${quote}`;
  });
  if (updated !== html) {
    changedFiles++;
    if (process.argv.includes('--write')) writeFileSync(fullPath, updated);
  }
}
console.log(JSON.stringify({ changedFiles, repairedLinks, mapping: Object.fromEntries(changes), written: process.argv.includes('--write') }, null, 2));
if (process.argv.includes('--check') && repairedLinks) process.exitCode = 1;
