import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const output = path.resolve(process.argv[2] || root);
const preview = output !== root;
const articles = [];
for (const f of readdirSync('docs/article-drafts').filter(f => /^humanizer-20260907-[a-f]\.mjs$/.test(f)).sort()) {
  articles.push(...(await import(pathToFileURL(path.join(root, 'docs/article-drafts', f)))).default);
}
const errors = [];
const check = (value, reason) => { if (!value) errors.push(reason); };
const titles = new Set();
const paras = new Map();
const existing = readdirSync(path.join(root, 'articles')).filter(f => f.endsWith('.html') && !articles.some(a => f === `${a.slug}.html`));
const oldText = existing.map(f => readFileSync(path.join(root, 'articles', f), 'utf8')).filter(html => /"@type"\s*:\s*"Article"/.test(html));
for (const a of articles) {
  check(!titles.has(a.title), `Duplicate title: ${a.title}`); titles.add(a.title);
  check(!oldText.some(html => html.includes(`<h1>${a.title}</h1>`)), `Existing title: ${a.title}`);
  for (const p of a.body.split(/\n\s*\n/).filter(p => !p.startsWith('###') && p.length > 45)) {
    check(!paras.has(p), `Repeated paragraph: ${a.slug}/${paras.get(p)}`); paras.set(p, a.slug);
    check(!oldText.some(html => html.includes(p)), `Old paragraph reused: ${a.slug}`);
  }
  const times = [];
  for (const lang of ['zh', 'en']) {
    const rel = `articles/${lang === 'en' ? 'en/' : ''}${a.slug}.html`;
    const file = path.join(output, rel);
    check(existsSync(file), `Missing page: ${rel}`);
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');
    const body = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1] || '';
    const url = `https://yuetianai.com/${rel}`;
    check((html.match(/<h1\b/g) || []).length === 1, `H1 count: ${rel}`);
    check(!/(?:^|>)\s*#{1,6}\s|文稿里|讲义里|他说|天纪|倪海厦|source-extract|证据卡/.test(body), `Visible source/Markdown: ${rel}`);
    check(!body.includes('同主题阅读'), `Inline related block: ${rel}`);
    check(html.includes(`rel="canonical" href="${url}"`), `Canonical: ${rel}`);
    check(html.includes('hreflang="en"') && html.includes('hreflang="zh-CN"'), `Alternates: ${rel}`);
    check(/<meta name="description" content="[^"]+"/.test(html), `Description: ${rel}`);
    for (const prop of ['title', 'description', 'url', 'image', 'type']) check(html.includes(`property="og:${prop}"`), `OG ${prop}: ${rel}`);
    let data;
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { const parsed = JSON.parse(match[1]); if (parsed['@type'] === 'Article') data = parsed; }
      catch { errors.push(`JSON-LD parse: ${rel}`); }
    }
    check(data?.mainEntityOfPage === url, `Article URL: ${rel}`);
    check(data?.headline === (lang === 'zh' ? a.title : a.enTitle), `Headline: ${rel}`);
    check(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\+08:00$/.test(data?.datePublished || ''), `Minute/timezone: ${rel}`);
    check(data?.dateModified === data?.datePublished, `Modified date: ${rel}`);
    check(html.includes(`<time datetime="${data?.datePublished}">`), `Visible time: ${rel}`);
    times.push(data?.datePublished);
    for (const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
      if (/^(?:https?:|data:|mailto:|tel:|javascript:)/.test(m[1])) continue;
      const target = m[1].split('?')[0];
      const local = path.resolve(root, path.dirname(rel), target);
      check(existsSync(local) || (preview && articles.some(x => local.endsWith(`${x.slug}.html`))), `Broken local link: ${rel} -> ${target}`);
    }
    if (!preview) {
      const collections = lang === 'zh' ? ['articles/index.html', 'feed.xml', 'sitemap.xml', 'sitemap-articles.xml'] : ['articles/en/index.html', 'articles/en/feed.xml', 'sitemap-en.xml'];
      for (const coll of collections) check(readFileSync(coll, 'utf8').includes(`${a.slug}.html`), `Missing collection entry: ${rel} in ${coll}`);
    }
  }
  check(times[0] === times[1], `Bilingual time mismatch: ${a.slug}`);
}
console.log(JSON.stringify({ articles: articles.length, pages: articles.length * 2, errors }, null, 2));
if (errors.length) process.exit(1);
