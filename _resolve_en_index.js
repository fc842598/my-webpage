const fs = require('fs');
const f = 'C:/Users/1/Desktop/doubao-work/articles/en/index.html';
let html = fs.readFileSync(f, 'utf8');

// 1. Resolve conflict marker - correct count is 686 (678 + 3 remote + 5 mine)
html = html.replace(/<<<<<<< HEAD[\s\S]*?=======[\s\S]*?>>>>>>> [^\n]+/, '<span class="section-toggle"><span>686 Articles</span></span>');

// 2. Renumber visible cards in the main article list
// Find the main article list section
const mainMarker = '<span>686 Articles</span>';
const mainIdx = html.indexOf(mainMarker);
const listStart = html.indexOf('<div class="article-list">', mainIdx);
const sectionEnd = html.indexOf('</details>', listStart);
let section = html.slice(listStart, sectionEnd);

// First, fix the "NEW" indices from remote - they should be 01, 02, 03
let newCount = 0;
section = section.replace(/data-index="NEW"/g, () => {
  newCount++;
  return 'data-index="' + String(newCount).padStart(2, '0') + '"';
});

// Now renumber all cards: currently 01-05 are mine, 06+ are old
// After remote's 3 cards (now 01-03), my cards should be 04-08, old cards 09+
// My cards currently have 01-05, old cards have 06+
// So: my 01->04, 02->05, 03->06, 04->07, 05->08; old 06->09, 07->10, etc.
// But wait - the old cards were renumbered by my earlier script to 06-683 (from 01-678 +5)
// Now they need to be 09-686 (another +3)
// And my cards (01-05) need to be 04-08 (+3)
section = section.replace(/data-index="(\d+)"/g, (match, num) => {
  const n = parseInt(num, 10);
  return 'data-index="' + String(n + 3).padStart(2, '0') + '"';
});

html = html.slice(0, listStart) + section + html.slice(sectionEnd);

// 3. Fix JSON-LD ItemList
// The auto-merge should have combined entries. Let me check and renumber.
const itemListKey = '"itemListElement": [';
const itemListStart = html.indexOf(itemListKey);
const itemListEnd = html.indexOf(']', itemListStart);
let itemList = html.slice(itemListStart, itemListEnd);

// Check if remote entries exist (they might have "NEW" position or already numbered)
// Renumber all positions: remote's 3 entries should be 1-3, mine 4-8, old 9+
// First collect all entries
const entryRegex = /"@type":\s*"ListItem",\s*"position":\s*(\d+|NEW)/g;
let positions = [];
let m;
while ((m = entryRegex.exec(itemList)) !== null) {
  positions.push({ pos: m[1], index: m.index, fullMatch: m[0] });
}
console.log('Found', positions.length, 'JSON-LD entries');

// Check for NEW positions
let newJsonCount = 0;
itemList = itemList.replace(/"position":\s*NEW/g, () => {
  newJsonCount++;
  return '"position": ' + newJsonCount;
});
console.log('Fixed', newJsonCount, 'NEW positions');

// Now renumber all numeric positions by +3 (remote's 3 are already 1-3, mine and old need +3)
// Wait - I need to think about this more carefully.
// After auto-merge, the JSON-LD might have:
// - Remote's 3 entries with some positions
// - My 5 entries with positions 1-5
// - Old entries with positions 6-683
// I need: remote 1-3, mine 4-8, old 9-686
// So mine and old need +3
let posCount = 0;
itemList = itemList.replace(/"position":\s*(\d+)/g, (match, num) => {
  posCount++;
  const n = parseInt(num, 10);
  // Remote's entries are positions 1-3 (just fixed from NEW), keep them
  // But wait - after fixing NEW to 1-3, the regex will also match those
  // I need to skip the first 3 (remote's)
  if (posCount <= 3) {
    return match; // Keep remote's positions 1-3
  }
  return '"position": ' + (n + 3);
});
console.log('Renumbered', posCount - 3, 'entries by +3');

html = html.slice(0, itemListStart) + itemList + html.slice(itemListEnd);

fs.writeFileSync(f, html, 'utf8');
console.log('English index conflict resolved');
