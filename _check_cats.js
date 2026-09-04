const fs = require('fs');
const c = fs.readFileSync('articles/index.html', 'utf8');
// Find all category links in the index
const re = /href="(ziwei-[^"]+\.html)"/g;
let m;
const pages = new Set();
while ((m = re.exec(c)) !== null) pages.add(m[1]);
console.log('Category pages linked from index:');
[...pages].sort().forEach(p => console.log(p));
