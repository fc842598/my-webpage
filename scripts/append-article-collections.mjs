import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const site = 'https://yuetianai.com';
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const hubs = { '看盘方法': 'ziwei-learning-path.html', '大限流年': 'ziwei-cycles.html', '宫位组合': 'ziwei-palaces.html', '辅煞曜': 'ziwei-helper-malice-stars.html', '四化': 'ziwei-four-transformations.html', '主星细读': 'ziwei-main-stars.html', '财运事业': 'ziwei-money-career.html' };

function metadata(root, rel) {
  const html = readFileSync(path.join(root, rel), 'utf8');
  const objects = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const article = objects.find(o => o['@type'] === 'Article');
  if (!article?.datePublished || !article.mainEntityOfPage) throw new Error(`Incomplete article metadata: ${rel}`);
  return { ...article, rel };
}

function addToIndex(html, article, category, en, hub = false) {
  const url = article.mainEntityOfPage;
  const filename = path.posix.basename(article.rel);
  if (html.includes(`href="${filename}"`)) throw new Error(`Index already contains ${url}`);
  html = html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (all, start, body, end) => {
    const data = JSON.parse(body);
    if (data['@type'] !== 'ItemList') return all;
    const entries = data.itemListElement || [];
    if (!entries.some(e => e.url === url || e.item === url)) entries.unshift({ '@type': 'ListItem', position: 1, url, name: article.headline });
    data.itemListElement = entries.map((e, i) => ({ ...e, position: i + 1 }));
    return `${start}\n${JSON.stringify(data, null, 2)}\n${end}`;
  });
  const stamp = article.datePublished;
  const card = `\n<article class="article-card" data-index="01"><div class="card-body"><div class="card-meta"><span class="tag">${escape(en ? 'Zi Wei Dou Shu' : category)}</span><span><time datetime="${stamp}">${stamp.slice(0, 10)} ${stamp.slice(11, 16)}</time></span></div><h3>${escape(article.headline)}</h3><p>${escape(article.description)}</p><a class="card-link" href="${filename}">${en ? 'Read article' : '阅读全文'}</a></div></article>\n`;
  let matched = false;
  html = html.replace(/<details\b[^>]*class="article-group"[^>]*>[\s\S]*?<\/details>/g, group => {
    const selected = hub || (en ? /\d+ Articles/.test(group) : group.includes(`<h2>${category}</h2>`));
    if (!selected || matched) return group;
    if (!group.includes('<div class="article-list">')) throw new Error('Article group has no list');
    matched = true;
    let result = group.replace('<div class="article-list">', `<div class="article-list">${card}`);
    let position = 0;
    result = result.replace(/data-index="\d+"/g, () => `data-index="${String(++position).padStart(2, '0')}"`);
    result = result.replace(/(<span class="section-toggle"><span>)\d+(\s+(?:篇|Articles))/, `$1${position}$2`);
    return result;
  });
  if (!matched) throw new Error(`Article category not found: ${category}`);
  return html;
}

function addToSitemap(xml, entries, modified) {
  for (const article of entries) {
    const url = article.mainEntityOfPage;
    if (xml.includes(`<loc>${url}</loc>`)) throw new Error(`Sitemap already contains ${url}`);
    xml = xml.replace('</urlset>', `  <url><loc>${url}</loc><lastmod>${article.dateModified}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>`);
  }
  return xml.replace(/<url>[\s\S]*?<\/url>/g, node => {
    const url = node.match(/<loc>(.*?)<\/loc>/)?.[1];
    if (!modified.has(url)) return node;
    const tag = `<lastmod>${modified.get(url)}</lastmod>`;
    return /<lastmod>/.test(node) ? node.replace(/<lastmod>[^<]*<\/lastmod>/, tag) : node.replace('</loc>', `</loc>${tag}`);
  });
}

function addToFeed(xml, article) {
  const url = article.mainEntityOfPage;
  if (xml.includes(`<link>${url}</link>`)) throw new Error(`Feed already contains ${url}`);
  const time = new Date(new Date(article.datePublished).getTime() + 8 * 3600000).toUTCString().replace('GMT', '+0800');
  const item = `<item><title>${escape(article.headline)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${time}</pubDate><description>${escape(article.description)}</description></item>\n`;
  xml = xml.replace(/<lastBuildDate>[^<]*<\/lastBuildDate>/, `<lastBuildDate>${time}</lastBuildDate>`);
  return /<item>/.test(xml) ? xml.replace('<item>', item + '<item>') : xml.replace('</channel>', item + '</channel>');
}

export function appendArticleCollections(root, articles) {
  // Stage all collection changes in memory so a missing category cannot leave half a sync.
  const output = new Map();
  const get = file => output.get(file) ?? readFileSync(path.join(root, file), 'utf8');
  for (const a of articles) {
    const zh = metadata(root, `articles/${a.slug}.html`);
    const en = metadata(root, `articles/en/${a.slug}.html`);
    const hub = hubs[a.category];
    if (!hub) throw new Error(`No topic hub for ${a.category}`);
    output.set('articles/index.html', addToIndex(get('articles/index.html'), zh, a.category, false));
    output.set('articles/en/index.html', addToIndex(get('articles/en/index.html'), en, a.category, true));
    output.set(`articles/${hub}`, addToIndex(get(`articles/${hub}`), zh, a.category, false, true));
    const modified = new Map([[`${site}/articles/`, zh.datePublished], [`${site}/articles/en/`, zh.datePublished], [`${site}/articles/${hub}`, zh.datePublished]]);
    output.set('sitemap.xml', addToSitemap(get('sitemap.xml'), [zh, en], modified));
    output.set('sitemap-articles.xml', addToSitemap(get('sitemap-articles.xml'), [zh], modified));
    output.set('sitemap-en.xml', addToSitemap(get('sitemap-en.xml'), [en], modified));
    output.set('feed.xml', addToFeed(get('feed.xml'), zh));
    output.set('articles/en/feed.xml', addToFeed(get('articles/en/feed.xml'), en));
  }
  for (const [file, text] of output) writeFileSync(path.join(root, file), text);
}
