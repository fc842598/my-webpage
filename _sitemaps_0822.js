const fs = require('fs');
const path = require('path');

const base = 'https://yuetianai.com';
const today = '2026-08-22';

// Scan all article HTML files
const cnDir = 'articles';
const enDir = 'articles/en';

const cnFiles = fs.readdirSync(cnDir).filter(f => f.endsWith('.html') && f !== 'index.html');
const enFiles = fs.existsSync(enDir) ? fs.readdirSync(enDir).filter(f => f.endsWith('.html') && f !== 'index.html') : [];

console.log(`CN articles: ${cnFiles.length}, EN articles: ${enFiles.length}`);

// Generate sitemap.xml (main, includes everything)
let mainUrls = [];
// Static pages
const staticPages = [
  {loc: '/', priority: '1.0', freq: 'daily'},
  {loc: '/articles/', priority: '0.9', freq: 'daily'},
  {loc: '/articles/en/', priority: '0.9', freq: 'daily'},
  {loc: '/pages/mingbook-onepage.html', priority: '0.8', freq: 'weekly'},
  {loc: '/pages/wentian-app.html', priority: '0.7', freq: 'weekly'},
  {loc: '/pages/contact.html', priority: '0.5', freq: 'monthly'},
  {loc: '/pages/yangzhai.html', priority: '0.5', freq: 'monthly'},
  {loc: '/pages/privacy.html', priority: '0.3', freq: 'yearly'},
];
for (const p of staticPages) {
  mainUrls.push(`  <url><loc>${base}${p.loc}</loc><changefreq>${p.freq}</changefreq><priority>${p.priority}</priority></url>`);
}
// CN articles
for (const f of cnFiles) {
  mainUrls.push(`  <url><loc>${base}/articles/${f}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
}
// EN articles
for (const f of enFiles) {
  mainUrls.push(`  <url><loc>${base}/articles/en/${f}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
}

const sitemapMain = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainUrls.join('\n')}
</urlset>`;
fs.writeFileSync('sitemap.xml', sitemapMain, 'utf8');
console.log(`sitemap.xml: ${mainUrls.length} URLs`);

// Generate sitemap-articles.xml (CN articles + index)
let articleUrls = [];
articleUrls.push(`  <url><loc>${base}/articles/</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`);
for (const f of cnFiles) {
  articleUrls.push(`  <url><loc>${base}/articles/${f}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
}
const sitemapArticles = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${articleUrls.join('\n')}
</urlset>`;
fs.writeFileSync('sitemap-articles.xml', sitemapArticles, 'utf8');
console.log(`sitemap-articles.xml: ${articleUrls.length} URLs`);

// Generate sitemap-en.xml (EN articles + index)
let enUrls = [];
enUrls.push(`  <url><loc>${base}/articles/en/</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`);
for (const f of enFiles) {
  enUrls.push(`  <url><loc>${base}/articles/en/${f}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
}
const sitemapEn = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${enUrls.join('\n')}
</urlset>`;
fs.writeFileSync('sitemap-en.xml', sitemapEn, 'utf8');
console.log(`sitemap-en.xml: ${enUrls.length} URLs`);

// sitemap-pages.xml (static pages only - don't regenerate if exists, just verify)
if (!fs.existsSync('sitemap-pages.xml')) {
  let pageUrls = staticPages.map(p => `  <url><loc>${base}${p.loc}</loc><changefreq>${p.freq}</changefreq><priority>${p.priority}</priority></url>`);
  const sitemapPages = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls.join('\n')}
</urlset>`;
  fs.writeFileSync('sitemap-pages.xml', sitemapPages, 'utf8');
  console.log(`sitemap-pages.xml: ${pageUrls.length} URLs (created)`);
} else {
  const existing = fs.readFileSync('sitemap-pages.xml', 'utf8');
  const count = (existing.match(/<url>/g) || []).length;
  console.log(`sitemap-pages.xml: ${count} URLs (unchanged)`);
}

console.log('\nAll sitemaps regenerated.');
