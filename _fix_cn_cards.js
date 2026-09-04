const fs = require('fs');
const f = 'C:/Users/1/Desktop/doubao-work/articles/index.html';
let html = fs.readFileSync(f, 'utf8');

// Find all sections with NEW data-index and fix them
// Strategy: find each <details> section, count NEW cards, renumber all cards

const detailsRegex = /<details class="article-group"[^>]*>([\s\S]*?)<\/details>/g;
let match;
let result = html;
let offset = 0;

while ((match = detailsRegex.exec(html)) !== null) {
  const section = match[0];
  const sectionStart = match.index;
  
  // Count NEW cards in this section
  const newCards = section.match(/data-index="NEW"/g);
  if (!newCards) continue;
  
  const newCount = newCards.length;
  console.log(`Section with ${newCount} NEW cards at char ${sectionStart}`);
  
  // Find section name
  const h2Match = section.match(/<h2>([^<]+)<\/h2>/);
  if (h2Match) console.log(`  Section: ${h2Match[1]}`);
  
  // Renumber all cards in this section
  let cardIndex = 0;
  let renumbered = section.replace(/data-index="(NEW|\d+)"/g, (m) => {
    cardIndex++;
    return 'data-index="' + String(cardIndex).padStart(2, '0') + '"';
  });
  
  // Replace in result
  const actualStart = sectionStart + offset;
  result = result.slice(0, actualStart) + renumbered + result.slice(actualStart + section.length);
  offset += renumbered.length - section.length;
}

// Also fix section counts if needed
// The "特定命例解读" section count might need updating
// Let's check and update counts for sections that got new cards
// For now, let's just write and verify
fs.writeFileSync(f, result, 'utf8');
console.log('Chinese index visible cards renumbered');
