const fs = require('fs');

function trimFeed(filePath) {
  let xml = fs.readFileSync(filePath, 'utf8');

  // Find all <item>...</item> blocks
  const itemRegex = /<item>[\s\S]*?<\/item>/g;
  const items = [];
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    items.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
  }
  console.log(`${filePath}: ${items.length} items`);

  if (items.length > 80) {
    const toRemove = items.length - 80;
    // Remove the last N items (oldest)
    const removeStart = items[items.length - toRemove].start;
    // Also remove whitespace/newlines before the removed items
    let actualStart = removeStart;
    while (actualStart > 0 && (xml[actualStart - 1] === ' ' || xml[actualStart - 1] === '\n' || xml[actualStart - 1] === '\r' || xml[actualStart - 1] === '\t')) {
      actualStart--;
    }
    actualStart++; // keep one newline
    const removeEnd = items[items.length - 1].end;
    xml = xml.slice(0, actualStart) + xml.slice(removeEnd);
    console.log(`Removed ${toRemove} oldest items`);
  }

  xml = xml.trimEnd() + '\n';
  fs.writeFileSync(filePath, xml, 'utf8');

  // Verify
  const verify = fs.readFileSync(filePath, 'utf8');
  const count = (verify.match(/<item>/g) || []).length;
  console.log(`Verified: ${count} items in ${filePath}`);
}

trimFeed('C:/Users/1/Desktop/doubao-work/feed.xml');
trimFeed('C:/Users/1/Desktop/doubao-work/articles/en/feed.xml');
