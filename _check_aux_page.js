const fs = require('fs');
const f = fs.readFileSync('articles/index.html', 'utf8');

// Find the 辅煞曜 section and check for a category link before it
const idx = f.indexOf('<h2>辅煞曜</h2>');
const before = f.substring(Math.max(0, idx-500), idx);
const links = before.match(/href="[^"]+"/g);
if (links) links.forEach(l => console.log('Link before 辅煞曜:', l));

// Check for a "更多" or category link in the section
const after = f.substring(idx, idx+2000);
const moreLinks = after.match(/href="[^"]*\.html"[^>]*>[^<]*更多/g);
if (moreLinks) moreLinks.forEach(l => console.log('More link:', l));

// Check if there's a dedicated aux stars page
const fs2 = require('fs');
const files = fs2.readdirSync('articles').filter(f => f.includes('fuxing') || f.includes('fushao') || f.includes('aux') || f.includes('shaxing') || f.includes('fuyao'));
console.log('Aux-related files:', files);
