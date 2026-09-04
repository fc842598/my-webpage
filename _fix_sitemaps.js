const fs=require('fs'),path=require('path');
const today='2026-08-21';

// Regenerate sitemap-articles.xml from all CN article HTML files
const cnDir=path.join(__dirname,'articles');
const cnFiles=fs.readdirSync(cnDir).filter(f=>f.endsWith('.html'));
let cnUrls=[];
// Add articles index first
cnUrls.push(`  <url>
    <loc>https://yuetianai.com/articles/</loc>
    <lastmod>2026-08-21T10:15:00+08:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);
for(const f of cnFiles.sort()){
  const slug=f.replace('.html','');
  const stat=fs.statSync(path.join(cnDir,f));
  const mtime=stat.mtime.toISOString().replace(/\.\d{3}Z$/,'+08:00');
  cnUrls.push(`  <url>
    <loc>https://yuetianai.com/articles/${slug}.html</loc>
    <lastmod>${mtime.slice(0,10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
}
const cnSitemap=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cnUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(__dirname,'sitemap-articles.xml'),cnSitemap.replace(/\r\n/g,'\n'),'utf8');
console.log(`sitemap-articles.xml: ${cnUrls.length} URLs`);

// Regenerate sitemap-en.xml from all EN article HTML files
const enDir=path.join(__dirname,'articles','en');
const enFiles=fs.readdirSync(enDir).filter(f=>f.endsWith('.html'));
let enUrls=[];
enUrls.push(`  <url>
    <loc>https://yuetianai.com/articles/en/</loc>
    <lastmod>2026-08-21T10:15:00+08:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);
for(const f of enFiles.sort()){
  const slug=f.replace('.html','');
  enUrls.push(`  <url>
    <loc>https://yuetianai.com/articles/en/${slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
}
const enSitemap=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${enUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(__dirname,'sitemap-en.xml'),enSitemap.replace(/\r\n/g,'\n'),'utf8');
console.log(`sitemap-en.xml: ${enUrls.length} URLs`);
