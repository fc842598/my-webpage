const fs = require('fs');

function addUrlsToSitemap(filePath, urls, isEnglish) {
  let xml = fs.readFileSync(filePath, 'utf8');

  const newEntries = urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>2026-08-11T10:15:00+08:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n') + '\n';

  // Insert after the first </url> (the index page entry)
  const firstUrlEnd = xml.indexOf('</url>') + '</url>'.length;
  xml = xml.slice(0, firstUrlEnd) + '\n' + newEntries + xml.slice(firstUrlEnd);

  xml = xml.trimEnd() + '\n';
  fs.writeFileSync(filePath, xml, 'utf8');
  console.log(`Sitemap updated: ${filePath}`);
}

// Chinese sitemap
addUrlsToSitemap('C:/Users/1/Desktop/doubao-work/sitemap-articles.xml', [
  'https://yuetianai.com/articles/ziwei-minggong-hualu.html',
  'https://yuetianai.com/articles/ziwei-zinvgong-hualu.html',
  'https://yuetianai.com/articles/ziwei-caibogong-hualu.html',
  'https://yuetianai.com/articles/ziwei-jieegong-hualu.html',
  'https://yuetianai.com/articles/ziwei-jiaoyougong-hualu.html'
]);

// English sitemap
addUrlsToSitemap('C:/Users/1/Desktop/doubao-work/sitemap-en.xml', [
  'https://yuetianai.com/articles/en/ziwei-minggong-hualu.html',
  'https://yuetianai.com/articles/en/ziwei-zinvgong-hualu.html',
  'https://yuetianai.com/articles/en/ziwei-caibogong-hualu.html',
  'https://yuetianai.com/articles/en/ziwei-jieegong-hualu.html',
  'https://yuetianai.com/articles/en/ziwei-jiaoyougong-hualu.html'
]);
