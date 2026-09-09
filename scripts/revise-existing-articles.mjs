import assert from "node:assert/strict";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dataFile = process.argv.find(value => value.startsWith("--revision-file="))?.split("=").slice(1).join("=");
assert(dataFile, "Pass --revision-file=scripts/your-revisions.mjs; add --apply to write.");
const { modified, revisions } = await import(pathToFileURL(path.resolve(root, dataFile)));
assert(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\+08:00$/.test(modified), "Minute-precision Shanghai timestamp required");
assert(Array.isArray(revisions) && revisions.length, "No revisions supplied");
assert.equal(new Set(revisions.map(item => item.file)).size, revisions.length, "Duplicate targets");
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const ldPattern = /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
const schemas = html => [...html.matchAll(ldPattern)].map(match => JSON.parse(match[1]));
const replacements = [];
const pending = new Map();
const originals = new Map();
function read(file) {
  if (!originals.has(file)) originals.set(file, readFileSync(path.join(root, file), "utf8"));
  return pending.get(file) ?? originals.get(file);
}
function put(file, html) { if (html !== originals.get(file)) pending.set(file, html); }
for (const item of revisions) {
  assert(/^articles\/(en\/)?[a-z0-9-]+\.html$/.test(item.file), "Only existing article paths allowed");
  let html = read(item.file);
  const schema = schemas(html).find(value => value["@type"] === "Article");
  assert(schema && item.title && item.description && item.body, `Incomplete article: ${item.file}`);
  assert(!/<(?:h1|script|iframe)\b/i.test(item.body), "Body must not add an H1 or executable markup");
  assert(!/文稿里|讲义里|他说|天纪|倪海厦|source-extract|证据卡|(^|\n)\s*#{1,6}\s/.test(item.body), "Source traces or raw Markdown in body");
  assert(Date.parse(modified) >= Date.parse(schema.datePublished), "Modified date precedes publication");
  const old = { title: schema.headline, description: schema.description, published: schema.datePublished };
  replacements.push({ ...item, old, url: `https://yuetianai.com/${item.file}` });
  const articlePattern = /(<article\b[^>]*id="article-start"[^>]*>)[\s\S]*?(<\/article>)/;
  assert(articlePattern.test(html), "Article body not found");
  html = html.replace(articlePattern, (_, start, end) => `${start}\n${item.body}\n      ${end}`);
  for (const [from, to] of Object.entries(item.links || {})) html = html.replaceAll(`href="${from}"`, `href="${to}"`);
  html = html.replaceAll(escape(old.description), escape(item.description)).replaceAll(escape(old.title), escape(item.title));
  html = html.replace(/(<p class="detail-subtitle">)[\s\S]*?(<\/p>)/, (_, start, end) => start + escape(item.description) + end);
  html = html.replace(ldPattern, (block, json) => {
    let data = JSON.parse(json);
    // Update string values without reformatting unrelated markup or changing first publication.
    data = JSON.parse(JSON.stringify(data), (_, value) => value === old.title ? item.title : value === old.description ? item.description : value);
    if (data["@type"] === "Article") data.dateModified = modified;
    return block.replace(json, `\n  ${JSON.stringify(data)}\n  `);
  });
  const update = `<span class="article-updated">${item.file.includes("/en/") ? "Updated" : "更新"} <time datetime="${modified}">${modified.slice(0, 16).replace("T", " ")} (UTC+8)</time></span>`;
  html = html.replace(/\s*<span class="article-updated">[\s\S]*?<\/span>/g, "");
  assert(/<p class="article-meta">/.test(html), "Visible article date not found");
  html = html.replace(/(<p class="article-meta">[\s\S]*?)(<\/p>)/, `$1${update}$2`);
  const result = schemas(html).find(value => value["@type"] === "Article");
  assert.equal(result.datePublished, old.published);
  assert.equal(result.headline, item.title);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert(html.includes(`rel="canonical" href="https://yuetianai.com/${item.file}"`));
  assert(html.includes(`datetime="${old.published}"`));
  put(item.file, html);
}

// Keep collection cards/structured lists in sync; leave other article bodies alone.
for (const dir of ["articles", "articles/en"]) {
  for (const name of readdirSync(path.join(root, dir)).filter(name => name.endsWith(".html"))) {
    const file = `${dir}/${name}`;
    if (revisions.some(item => item.file === file)) continue;
    let html = read(file);
    if (schemas(html).some(value => value["@type"] === "Article")) continue;
    for (const item of replacements) {
      html = html.replaceAll(escape(item.old.description), escape(item.description)).replaceAll(escape(item.old.title), escape(item.title));
    }
    schemas(html);
    put(file, html);
  }
}
for (const file of ["feed.xml", "articles/en/feed.xml", "sitemap.xml", "sitemap-articles.xml", "sitemap-en.xml"]) {
  let xml = read(file);
  for (const item of replacements) {
    if (file.includes("feed")) {
      xml = xml.replace(/<item>[\s\S]*?<\/item>/g, block => block.includes(`<link>${item.url}</link>`) ? block.replaceAll(escape(item.old.description), escape(item.description)).replaceAll(escape(item.old.title), escape(item.title)) : block);
    } else {
      xml = xml.replace(/<url>[\s\S]*?<\/url>/g, block => block.includes(`<loc>${item.url}</loc>`) ? block.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${modified}</lastmod>`) : block);
    }
  }
  put(file, xml);
}
for (const item of replacements) {
  const index = item.file.includes("/en/") ? "articles/en/index.html" : "articles/index.html";
  const sitemap = item.file.includes("/en/") ? "sitemap-en.xml" : "sitemap-articles.xml";
  assert(read(index).includes(item.title), `Missing index title: ${item.file}`);
  assert(read(sitemap).includes(`<loc>${item.url}</loc><lastmod>${modified}</lastmod>`), `Missing sitemap date: ${item.file}`);
}
// Validate the whole proposed set before any writes. No removals, adds, commits or pushes.
const apply = process.argv.includes("--apply");
for (const [file, value] of pending) if (apply) writeFileSync(path.join(root, file), value, "utf8");
console.log(JSON.stringify({ mode: apply ? "applied" : "dry-run", articles: revisions.length, modified, files: [...pending.keys()] }, null, 2));
