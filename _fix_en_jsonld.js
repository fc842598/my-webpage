const fs = require('fs');
const f = 'C:/Users/1/Desktop/doubao-work/articles/en/index.html';
let html = fs.readFileSync(f, 'utf8');

// Extract the entire JSON-LD block
const itemListKey = '"itemListElement": [';
const listStart = html.indexOf(itemListKey) + itemListKey.length;
const listEnd = html.indexOf(']', listStart);
let listContent = html.slice(listStart, listEnd);

// Parse all entries
const entryRegex = /\{[\s\S]*?"@type":\s*"ListItem"[\s\S]*?\}/g;
let entries = [];
let match;
while ((match = entryRegex.exec(listContent)) !== null) {
  entries.push(match[0]);
}
console.log('Found', entries.length, 'entries');

// Identify remote's 3 entries (by URL)
const remoteUrls = [
  'ziwei-bankong-zhechi-zhongnian-fanshen',
  'ziwei-yuelang-tianmen-huaji-poge',
  'ziwei-fuqigong-liantan-congre-dao-lei'
];
const myUrls = [
  'ziwei-minggong-hualu',
  'ziwei-zinvgong-hualu',
  'ziwei-caibogong-hualu',
  'ziwei-jieegong-hualu',
  'ziwei-jiaoyougong-hualu'
];

let remoteEntries = [];
let myEntries = [];
let oldEntries = [];

for (const entry of entries) {
  if (remoteUrls.some(u => entry.includes(u))) {
    remoteEntries.push(entry);
  } else if (myUrls.some(u => entry.includes(u))) {
    myEntries.push(entry);
  } else {
    oldEntries.push(entry);
  }
}
console.log('Remote:', remoteEntries.length, 'Mine:', myEntries.length, 'Old:', oldEntries.length);

// Rebuild in correct order: remote first, then mine, then old
const allEntries = [...remoteEntries, ...myEntries, ...oldEntries];

// Renumber all positions
const rebuilt = allEntries.map((entry, i) => {
  return entry.replace(/"position":\s*\d+/, '"position": ' + (i + 1));
});

// Rebuild the list content
const newListContent = '\n    ' + rebuilt.join(',\n    ') + '\n  ';
html = html.slice(0, listStart) + newListContent + html.slice(listEnd);

fs.writeFileSync(f, html, 'utf8');
console.log('JSON-LD rebuilt with correct order');
