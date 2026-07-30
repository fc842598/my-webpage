import { existsSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const referencesOnly = process.argv.includes('--references-only');
const slugs = [...new Set(process.argv.slice(2).filter((value) => value !== '--references-only'))];

if (!slugs.length) throw new Error('Pass one or more article slugs.');
for (const slug of slugs) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Invalid article slug: ${slug}`);
}

const needles = slugs.flatMap((slug) => [
  `/articles/${slug}.html`,
  `/articles/en/${slug}.html`,
  `${slug}.html`,
]);
const changedFiles = new Set();
const deletedFiles = [];

function hasRemovedArticle(text) {
  return needles.some((needle) => text.includes(needle));
}

function writeIfChanged(file, before, after) {
  if (before === after) return;
  writeFileSync(file, after, 'utf8');
  changedFiles.add(path.relative(root, file));
}

function walkHtml(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) files.push(...walkHtml(full));
    else if (entry.endsWith('.html')) files.push(full);
  }
  return files;
}

function cleanJsonLd(json) {
  const cleaned = json.replace(/\s*\{\s*"@type"\s*:\s*"ListItem"[\s\S]*?\}\s*,?/g, (item) => {
    if (hasRemovedArticle(item)) return '';
    return item;
  });
  return cleaned.replace(/,\s*]/g, '\n  ]');
}

function cleanHtml(file) {
  const before = readFileSync(file, 'utf8');
  if (!hasRemovedArticle(before)) return;

  let after = before.replace(/\s*<article\b[^>]*class="[^"]*article-card[^"]*"[^>]*>[\s\S]*?<\/article>/gi, (block) => (
    hasRemovedArticle(block) ? '' : block
  ));

  after = after.replace(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi, (block, json) => {
    if (!hasRemovedArticle(json)) return block;
    const cleaned = cleanJsonLd(json);
    JSON.parse(cleaned);
    return block.replace(json, cleaned);
  });
  writeIfChanged(file, before, after);
}

function cleanXml(file, elementName) {
  const before = readFileSync(file, 'utf8');
  let after = before.replace(new RegExp(`\\s*<${elementName}>[\\s\\S]*?<\\/${elementName}>`, 'gi'), (block) => (
    hasRemovedArticle(block) ? '' : block
  ));
  if (elementName === 'item') {
    after = after.replace(/<lastBuildDate>[^<]*<\/lastBuildDate>/, `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`);
  }
  writeIfChanged(file, before, after);
}

function cleanManifest(file) {
  const before = readFileSync(file, 'utf8');
  const manifest = JSON.parse(before);
  manifest.articles = (manifest.articles || []).filter((article) => !slugs.includes(article.slug));
  writeIfChanged(file, before, `${JSON.stringify(manifest, null, 2)}\n`);
}

for (const slug of slugs) {
  for (const file of [
    path.join(root, 'articles', `${slug}.html`),
    path.join(root, 'articles', 'en', `${slug}.html`),
  ]) {
    if (!existsSync(file)) {
      if (referencesOnly) continue;
      throw new Error(`Expected article page is missing: ${file}`);
    }
    unlinkSync(file);
    deletedFiles.push(path.relative(root, file));
  }
}

for (const file of walkHtml(path.join(root, 'articles'))) cleanHtml(file);
for (const file of [path.join(root, 'feed.xml'), path.join(root, 'articles', 'en', 'feed.xml')]) cleanXml(file, 'item');
for (const file of [path.join(root, 'sitemap.xml'), path.join(root, 'sitemap-articles.xml'), path.join(root, 'sitemap-en.xml')]) cleanXml(file, 'url');
cleanManifest(path.join(root, 'docs', 'ai-search-qa-manifest.json'));

const liveFiles = [
  ...walkHtml(path.join(root, 'articles')),
  path.join(root, 'feed.xml'),
  path.join(root, 'articles', 'en', 'feed.xml'),
  path.join(root, 'sitemap.xml'),
  path.join(root, 'sitemap-articles.xml'),
  path.join(root, 'sitemap-en.xml'),
  path.join(root, 'docs', 'ai-search-qa-manifest.json'),
];
const stale = liveFiles.filter((file) => hasRemovedArticle(readFileSync(file, 'utf8')));
if (stale.length) throw new Error(`Removed article references remain in: ${stale.join(', ')}`);

process.stdout.write(`${JSON.stringify({ deletedFiles, changedFiles: [...changedFiles].sort() }, null, 2)}\n`);
