const fs = require('fs');
const path = 'C:/Users/1/Desktop/doubao-work/articles/en/index.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Update article count 678 -> 683
html = html.replace('<span>678 Articles</span>', '<span>683 Articles</span>');

// 2. Renumber existing visible cards (01-678 -> 06-683) in the main article list
// Find the main article list (after "678 Articles" section, not the Hub)
const mainSectionMarker = '<span>683 Articles</span>';
const mainSectionIdx = html.indexOf(mainSectionMarker);
const listStart = html.indexOf('<div class="article-list">', mainSectionIdx);
const listEnd = html.indexOf('</div>\n        </details>', listStart);
// Actually find the end of this article-list div - it's followed by </details>
// Let's find the closing of this section
const sectionEnd = html.indexOf('</details>', listStart);
let sectionContent = html.slice(listStart, sectionEnd);

sectionContent = sectionContent.replace(/data-index="(\d+)"/g, (match, num) => {
  return 'data-index="' + String(parseInt(num, 10) + 5).padStart(2, '0') + '"';
});
html = html.slice(0, listStart) + sectionContent + html.slice(sectionEnd);

// 3. Insert 5 new cards at the top
const newCards = `          <article class="article-card" data-index="01">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="2026-08-11T10:15:00+08:00">2026-08-11 10:15</time></span></div>
              <h3>Life Palace With Hua Lu: Born With Resources, but That Doesn't Mean You Can Coast</h3>
              <p>Hua Lu in the Life Palace gives you natural warmth and easy opportunities. But the trap is complacency — resources arrive easily, and keeping them is a different skill.</p>
              <a class="card-link" href="ziwei-minggong-hualu.html">Read article</a>
            </div>
          </article>
          <article class="article-card" data-index="02">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="2026-08-11T10:15:00+08:00">2026-08-11 10:15</time></span></div>
              <h3>Children Palace With Hua Lu: Kids, Creations, and Passive Income Are Not the Same Thing</h3>
              <p>The Children Palace covers more than children. It also rules your creative work, students, and investments you don't manage day to day. Hua Lu here means returns on what you put out.</p>
              <a class="card-link" href="ziwei-zinvgong-hualu.html">Read article</a>
            </div>
          </article>
          <article class="article-card" data-index="03">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="2026-08-11T10:15:00+08:00">2026-08-11 10:15</time></span></div>
              <h3>Wealth Palace With Hua Lu: Earning Well and Keeping It Are Two Different Skills</h3>
              <p>Hua Lu in the Wealth Palace means earning opportunities come easily. But money arriving and money staying are different matters. You need the Property and Mental palaces too.</p>
              <a class="card-link" href="ziwei-caibogong-hualu.html">Read article</a>
            </div>
          </article>
          <article class="article-card" data-index="04">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="2026-08-11T10:15:00+08:00">2026-08-11 10:15</time></span></div>
              <h3>Health Palace With Hua Lu: A Strong Body and a Calm Mind Are Not the Same Thing</h3>
              <p>Hua Lu in the Health Palace means fast recovery and an easygoing nature. But it also makes you ignore warning signs. Read the body line and the mind line separately.</p>
              <a class="card-link" href="ziwei-jieegong-hualu.html">Read article</a>
            </div>
          </article>
          <article class="article-card" data-index="05">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="2026-08-11T10:15:00+08:00">2026-08-11 10:15</time></span></div>
              <h3>Friends Palace With Hua Lu: Knowing Everyone and Having Real Allies Are Different</h3>
              <p>Hua Lu in the Friends Palace gives you a wide social circle. But a big network is not the same as a deep one. Read it against the Brothers Palace to see the full picture.</p>
              <a class="card-link" href="ziwei-jiaoyougong-hualu.html">Read article</a>
            </div>
          </article>
`;

const insertListPos = html.indexOf('<div class="article-list">', html.indexOf(mainSectionMarker)) + '<div class="article-list">'.length;
html = html.slice(0, insertListPos) + '\n' + newCards + html.slice(insertListPos);

// 4. Add 5 new entries to JSON-LD ItemList and renumber
const newJsonEntries = `    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://yuetianai.com/articles/en/ziwei-minggong-hualu.html",
      "name": "Life Palace With Hua Lu: Born With Resources, but That Doesn't Mean You Can Coast"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "url": "https://yuetianai.com/articles/en/ziwei-zinvgong-hualu.html",
      "name": "Children Palace With Hua Lu: Kids, Creations, and Passive Income Are Not the Same Thing"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "url": "https://yuetianai.com/articles/en/ziwei-caibogong-hualu.html",
      "name": "Wealth Palace With Hua Lu: Earning Well and Keeping It Are Two Different Skills"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "url": "https://yuetianai.com/articles/en/ziwei-jieegong-hualu.html",
      "name": "Health Palace With Hua Lu: A Strong Body and a Calm Mind Are Not the Same Thing"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "url": "https://yuetianai.com/articles/en/ziwei-jiaoyougong-hualu.html",
      "name": "Friends Palace With Hua Lu: Knowing Everyone and Having Real Allies Are Different"
    },
`;

// Renumber existing positions first
const itemListKey = '"itemListElement": [';
const itemListKeyIdx = html.indexOf(itemListKey);
const itemListEnd = html.indexOf(']', itemListKeyIdx);
let itemListBlock = html.slice(itemListKeyIdx, itemListEnd);
itemListBlock = itemListBlock.replace(/"position":\s*(\d+)/g, (match, num) => {
  return '"position": ' + (parseInt(num, 10) + 5);
});
html = html.slice(0, itemListKeyIdx) + itemListBlock + html.slice(itemListEnd);

// Insert new entries
const insertJsonPos = html.indexOf(itemListKey) + itemListKey.length;
html = html.slice(0, insertJsonPos) + '\n' + newJsonEntries + html.slice(insertJsonPos);

fs.writeFileSync(path, html, 'utf8');
console.log('English index updated successfully');
