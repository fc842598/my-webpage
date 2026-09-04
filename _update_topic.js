const fs = require('fs');
const path = 'C:/Users/1/Desktop/doubao-work/articles/ziwei-four-transformations.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Update count 68 -> 73
html = html.replace('<span>68 篇</span>', '<span>73 篇</span>');

// 2. Renumber existing cards first
const listMarker = '<div class="article-list">';
const listStart = html.indexOf(listMarker);
const sectionEnd = html.indexOf('</details>', listStart);
let sectionContent = html.slice(listStart, sectionEnd);
sectionContent = sectionContent.replace(/data-index="(\d+)"/g, (match, num) => {
  return 'data-index="' + String(parseInt(num, 10) + 5).padStart(2, '0') + '"';
});
html = html.slice(0, listStart) + sectionContent + html.slice(sectionEnd);

// 3. Insert 5 new cards
const newCards = `          <article class="article-card" data-index="01">
            <div class="card-body">
              <div class="card-meta"><span class="tag">四化细读</span><span><time datetime="2026-08-11T10:15:00+08:00">2026-08-11 10:15</time></span></div>
              <h3>紫微斗数命宫化禄：天生带资源，为什么不等于不用努力</h3>
              <p>命宫化禄的人自带亲和力，机会好像总往身上靠。但禄在命宫最大的陷阱是容易满足——资源来得不费劲，守不守得住是另一回事。</p>
              <a class="card-link" href="ziwei-minggong-hualu.html">阅读全文</a>
            </div>
          </article>
          <article class="article-card" data-index="02">
            <div class="card-body">
              <div class="card-meta"><span class="tag">四化细读</span><span><time datetime="2026-08-11T10:15:00+08:00">2026-08-11 10:15</time></span></div>
              <h3>紫微斗数子女宫化禄：子女缘、作品和延伸财怎么分</h3>
              <p>子女宫化禄不只是孩子有出息。子女宫还看作品、学生、合伙投资的下游。化禄在这里，代表你延伸出去的东西容易有回报，但三条线要分开读。</p>
              <a class="card-link" href="ziwei-zinvgong-hualu.html">阅读全文</a>
            </div>
          </article>
          <article class="article-card" data-index="03">
            <div class="card-body">
              <div class="card-meta"><span class="tag">四化细读</span><span><time datetime="2026-08-11T10:15:00+08:00">2026-08-11 10:15</time></span></div>
              <h3>紫微斗数财帛宫化禄：会赚钱和留得住钱是两回事</h3>
              <p>财帛宫化禄的人通常不缺赚钱机会，但禄在财帛最大的问题是来的容易去的也快。能不能留住，要看田宅和福德，不能只看一个宫。</p>
              <a class="card-link" href="ziwei-caibogong-hualu.html">阅读全文</a>
            </div>
          </article>
          <article class="article-card" data-index="04">
            <div class="card-body">
              <div class="card-meta"><span class="tag">四化细读</span><span><time datetime="2026-08-11T10:15:00+08:00">2026-08-11 10:15</time></span></div>
              <h3>紫微斗数疾厄宫化禄：身体好和心情好哪个更重要</h3>
              <p>疾厄宫化禄不只是身体少病。疾厄宫看身体也看情绪，化禄在这里的人通常心大、恢复力强，但心大不等于没有隐患，要和父母宫对看。</p>
              <a class="card-link" href="ziwei-jieegong-hualu.html">阅读全文</a>
            </div>
          </article>
          <article class="article-card" data-index="05">
            <div class="card-body">
              <div class="card-meta"><span class="tag">四化细读</span><span><time datetime="2026-08-11T10:15:00+08:00">2026-08-11 10:15</time></span></div>
              <h3>紫微斗数交友宫化禄：朋友多和贵人在外不是一回事</h3>
              <p>交友宫化禄的人社交圈广，但朋友多不等于贵人多。交友宫看的是众生缘和下属缘，化禄在这里要分清热闹和有用，还要和兄弟宫对看。</p>
              <a class="card-link" href="ziwei-jiaoyougong-hualu.html">阅读全文</a>
            </div>
          </article>
`;

const insertPos = html.indexOf(listMarker) + listMarker.length;
html = html.slice(0, insertPos) + '\n' + newCards + html.slice(insertPos);

// 4. JSON-LD: renumber existing positions, then insert new
const itemListKey = '"itemListElement": [';
const itemListKeyIdx = html.indexOf(itemListKey);
const itemListEnd = html.indexOf(']', itemListKeyIdx);
let itemListBlock = html.slice(itemListKeyIdx, itemListEnd);
itemListBlock = itemListBlock.replace(/"position":\s*(\d+)/g, (match, num) => {
  return '"position": ' + (parseInt(num, 10) + 5);
});
html = html.slice(0, itemListKeyIdx) + itemListBlock + html.slice(itemListEnd);

const newJsonEntries = `    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://yuetianai.com/articles/ziwei-minggong-hualu.html",
      "name": "紫微斗数命宫化禄：天生带资源，为什么不等于不用努力"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "url": "https://yuetianai.com/articles/ziwei-zinvgong-hualu.html",
      "name": "紫微斗数子女宫化禄：子女缘、作品和延伸财怎么分"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "url": "https://yuetianai.com/articles/ziwei-caibogong-hualu.html",
      "name": "紫微斗数财帛宫化禄：会赚钱和留得住钱是两回事"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "url": "https://yuetianai.com/articles/ziwei-jieegong-hualu.html",
      "name": "紫微斗数疾厄宫化禄：身体好和心情好哪个更重要"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "url": "https://yuetianai.com/articles/ziwei-jiaoyougong-hualu.html",
      "name": "紫微斗数交友宫化禄：朋友多和贵人在外不是一回事"
    },
`;

const insertJsonPos = html.indexOf(itemListKey) + itemListKey.length;
html = html.slice(0, insertJsonPos) + '\n' + newJsonEntries + html.slice(insertJsonPos);

fs.writeFileSync(path, html, 'utf8');
console.log('Four transformations topic page updated');
