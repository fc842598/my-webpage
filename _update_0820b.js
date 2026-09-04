const fs = require('fs');
const path = require('path');
const date = '2026-08-20T15:30:00+08:00';
const dateDisplay = '2026-08-20 15:30';
const pubDate = 'Thu, 20 Aug 2026 07:30:00 +0000';
const smDate = '2026-08-20';

const articles = [
  { slug:'ziwei-kanpan-xiankan-shengnian-sihua', cnTitle:'紫微斗数看盘先看生年四化：它是你这一辈子的底色', cnDesc:'生年四化是出生年天干决定的禄权科忌，伴随一生不变。看盘第一步不是看命宫，而是看生年四化落在哪里。', enTitle:'Read Natal Transformations First: They Are Your Life\'s Base Color', enDesc:'Natal transformations stay with you for life. The first step is seeing where they land.' },
  { slug:'ziwei-minggong-wu-zhuxing-zenmakan', cnTitle:'紫微斗数命宫无主星怎么看：借对宫不是唯一答案', cnDesc:'命宫没有十四主星时叫空宫，借对宫主星是常用方法，但还要看辅星煞星、三方四正和生年四化。', enTitle:'How to Read an Empty Life Palace: Borrowing Isn\'t the Only Answer', enDesc:'When Life has no main star, borrow the opposite palace but also check auxiliaries, malefics, triple direction, and natal transformations.' },
  { slug:'ziwei-sanfang-sizheng-shizhan', cnTitle:'紫微斗数三方四正实战用法：它决定一张盘的格局高低', cnDesc:'三方四正是判断一个宫位有没有支援的实战工具。本宫强但三方弱是孤君，本宫弱但三方强是时势造人。', enTitle:'Triple Direction in Practice: It Determines a Chart\'s Level', enDesc:'Triple direction judges whether a palace has support. Strong self with weak triple is a lone ruler; weak self with strong triple is the times making the person.' },
  { slug:'ziwei-liunian-shizhan-jiedu', cnTitle:'紫微斗数流年实战解读：这一年到底会发生什么', cnDesc:'流年要把天干四化、地支宫位、小限和大限叠加起来看，四层信息叠在一起才能判断具体事件。', enTitle:'Annual Forecast in Practice: What Actually Happens This Year', enDesc:'Layer annual stem transformations, branch palace, minor cycle, and major cycle together to reveal specific events.' },
  { slug:'ziwei-kanpan-yao-kanren-bukanpan', cnTitle:'紫微斗数看盘要看人不是看盘：同样的盘不同人活法不同', cnDesc:'紫微斗数算的是趋势不是定数。同样的盘，不同的人因为教育、环境、选择不同，活法完全不同。', enTitle:'Read the Person, Not Just the Chart: Same Chart, Different Lives', enDesc:'Zi Wei shows trends, not fixed fate. The same chart plays out differently based on education, environment, and choices.' },
  { slug:'ziwei-tonggong-butong-daxian', cnTitle:'紫微斗数同一个宫位在不同大限为什么含义不同', cnDesc:'大限走到不同宫位时，那个宫位的身份会变。本命财帛宫在某步大限可能变成大限命宫。', enTitle:'Why the Same Palace Means Different Things in Different Cycles', enDesc:'When a major cycle lands on a palace, that palace\'s identity changes. Natal Wealth may become cycle Life.' },
  { slug:'ziwei-feixing-sihua-zenmeyong', cnTitle:'紫微斗数飞星四化怎么用：看能量从哪里来到哪里去', cnDesc:'飞星用每个宫的宫干飞出四化，追踪能量在宫位之间的流动方向，看出一件事的前因后果。', enTitle:'How to Use Flying Star Transformations: See Where Energy Comes and Goes', enDesc:'Flying star uses palace stems to fly transformations, tracking energy flow between palaces to reveal cause and effect.' },
  { slug:'ziwei-kanpan-xiankan-youmeiyou-jie', cnTitle:'紫微斗数看盘先看有没有解：凶格不一定是死局', cnDesc:'看到煞星化忌不要慌，先看有没有解救——吉星同宫、化科解厄、大限走到好位置。有解只是虚惊。', enTitle:'First Check If There\'s a Rescue: Inauspicious Patterns Aren\'t Always Hopeless', enDesc:'Don\'t panic at malefics — check for rescue: auspicious stars, Hua Ke, or a good cycle ahead.' },
  { slug:'ziwei-kanpan-buzhi-kan-jixiong', cnTitle:'紫微斗数看盘不要只看吉凶：每颗星都有两面性', cnDesc:'没有绝对的吉星和凶星。吉星用不好是负担，煞星用对了是冲劲和突破。', enTitle:'Don\'t Only Read Good or Bad: Every Star Has Two Sides', enDesc:'There are no absolutely auspicious or malefic stars. Auspicious misused becomes burden; malefics used well are drive.' },
  { slug:'ziwei-mingpan-shi-dongtai', cnTitle:'紫微斗数命盘是动态的不是静态的：它会随大限流年变化', cnDesc:'本命盘是出厂设置，但人会随大限十年一变、流年一年一变地成长和变化。', enTitle:'The Chart Is Dynamic, Not Static: It Changes with Cycles and Years', enDesc:'The natal chart is factory settings, but people change with each decade cycle and each year.' },
  { slug:'ziwei-kanpan-yao-kan-nianling', cnTitle:'紫微斗数看盘要看年龄阶段：20岁和50岁看同一张盘重点不同', cnDesc:'20岁看学业方向，30岁看事业感情，50岁看家庭健康，60岁看晚年传承。脱离年龄容易误判。', enTitle:'Read for Life Stage: The Same Chart at 20 and 50 Has Different Focus', enDesc:'20s: education; 30s: career and love; 50s: family and health; 60s: later years and legacy.' },
  { slug:'ziwei-zihua-shi-shenme', cnTitle:'紫微斗数自化是什么：宫位里的四化会自己说话', cnDesc:'自化是宫干飞出的四化又落回本宫，代表能量自己跟自己较劲。自化禄是自己找资源，自化忌是自己拖后腿。', enTitle:'What Is Self-Transformation: Transformations Within a Palace Speak for Themselves', enDesc:'Self-transformation occurs when a palace\'s own stem flies a transformation back into itself.' },
  { slug:'ziwei-kanpan-yao-jiehe-shiji', cnTitle:'紫微斗数看盘要结合实际：盘上写的不等于生活里发生的', cnDesc:'盘上显示财运可能只是涨工资，感情波折可能只是吵一架。必须结合求测者实际生活翻译符号。', enTitle:'Ground Readings in Reality: What the Chart Shows Isn\'t Always What Happens', enDesc:'Wealth luck may just be a raise; relationship turbulence may just be an argument. Translate symbols to actual life.' },
  { slug:'ziwei-shiergong-bushi-guli', cnTitle:'紫微斗数十二宫不是孤立的：宫位之间有亲戚关系', cnDesc:'十二宫不是十二个独立格子，宫位之间有三方四正、邻宫、飞化等关系。看一件事要跨宫联读。', enTitle:'The Twelve Palaces Aren\'t Isolated: Palaces Have Family Relationships', enDesc:'Palaces have triple-direction, adjacent, and flying relationships. One matter requires cross-palace reading.' },
  { slug:'ziwei-kanpan-yongshen', cnTitle:'紫微斗数看盘要看用神：每张盘都有一个关键点', cnDesc:'一张盘里总有最关键的宫位或星曜决定整张盘走向。找到用神就找到了看盘的突破口。', enTitle:'Find the Chart\'s Key Point: Every Chart Has a Useful God', enDesc:'Every chart has one key palace or star that determines its direction. Finding it is the breakthrough.' },
  { slug:'ziwei-daxian-minggong-yu-benming', cnTitle:'紫微斗数大限命宫和本命命宫的关系：谁是真正的你', cnDesc:'本命命宫是本质的你，大限命宫是这十年扮演的角色。一致是顺势，不一致是张力也是成长。', enTitle:'Cycle Life vs Natal Life: Which Is the Real You', enDesc:'Natal Life is the essential you; cycle Life is this decade\'s role. Aligned is flow; conflicting is tension and growth.' },
  { slug:'ziwei-kanpan-bu-zhuiqiu-wanmei', cnTitle:'紫微斗数看盘不要追求完美：每张盘都有瑕疵', cnDesc:'没有完美的盘。吉星多缺冲劲，煞星多有韧性。瑕疵是特征不是缺陷，关键是把手里的牌打好。', enTitle:'Don\'t Seek a Perfect Chart: Every Chart Has Flaws', enDesc:'No perfect chart exists. Many auspicious stars lack drive; many malefics bring resilience. Flaws are features.' },
  { slug:'ziwei-panduan-yi-jian-shi-nengfou-cheng', cnTitle:'紫微斗数怎么判断一件事能不能成：看天时地利人和', cnDesc:'判断一件事要综合看大限流年给不给时机、相关宫位有没有支援、你自己状态好不好。三者齐备才容易成。', enTitle:'How to Judge Whether Something Will Succeed: Timing, Position, and People', enDesc:'Synthesize cycle timing, palace support, and your own state. All three make success likely.' },
  { slug:'ziwei-liuyue-liuri-yongfa', cnTitle:'紫微斗数流月流日怎么用：精确到月和日的判断方法', cnDesc:'流月看一月变化，流日看具体哪一天。在大限流年框架内精确时间点，适合择日和短期决策。', enTitle:'How to Use Monthly and Daily Cycles: Pinpoint Timing to Month and Day', enDesc:'Monthly cycles show monthly shifts; daily cycles pinpoint days. They refine timing within the larger framework.' },
  { slug:'ziwei-kanpan-xian-ding-ti-yong', cnTitle:'紫微斗数看盘先定体用：谁是主体谁是客体', cnDesc:'体是主体，用是客体。看盘前先定体用才不会搞混谁影响谁。体用随问题变化。', enTitle:'Establish Ti and Yong First: Which Is Subject and Which Object', enDesc:'Ti is subject, Yong is object. Establish them before reading to avoid confusing who influences whom.' }
];

function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

function insertCards(html, sectionMarker, articles, cnTag) {
  const sectionIdx = html.indexOf(sectionMarker);
  if (sectionIdx === -1) throw new Error('Cannot find section: ' + sectionMarker);
  const listStart = html.indexOf('<div class="article-list">', sectionIdx);
  if (listStart === -1) throw new Error('Cannot find article-list after: ' + sectionMarker);
  const insertPos = listStart + '<div class="article-list">'.length;
  let cards = '\n';
  for (const a of articles) {
    cards += `          <article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">${cnTag}</span><span><time datetime="${date}">${dateDisplay}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>\n`;
  }
  return html.slice(0, insertPos) + cards + html.slice(insertPos);
}

function updateCount(html, sectionMarker, add) {
  const sectionIdx = html.indexOf(sectionMarker);
  const countMatch = html.slice(sectionIdx, sectionIdx + 500).match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    html = html.slice(0, sectionIdx) + html.slice(sectionIdx).replace(countMatch[0], `<span>${oldCount + add} 篇</span>`);
  }
  return html;
}

function insertJsonLd(html, articles, isEn) {
  const itemListIdx = html.indexOf('"@type": "ItemList"');
  const arrStart = html.indexOf('[', itemListIdx);
  const arrInsertPos = arrStart + 1;
  let jsonItems = '';
  for (const a of articles) {
    const url = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
    const name = isEn ? jstr(a.enTitle) : jstr(a.cnTitle);
    jsonItems += `
    {
      "@type": "ListItem",
      "position": 0,
      "url": "${url}",
      "name": "${name}"
    },`;
  }
  html = html.slice(0, arrInsertPos) + jsonItems + html.slice(arrInsertPos);
  let pos = 0;
  const firstArrEnd = html.indexOf(']', arrInsertPos);
  const beforeArr = html.slice(0, arrInsertPos);
  const arrContent = html.slice(arrInsertPos, firstArrEnd);
  const afterArr = html.slice(firstArrEnd);
  const renumbered = arrContent.replace(/"position":\s*\d+/g, () => { pos++; return `"position": ${pos}`; });
  return beforeArr + renumbered + afterArr;
}

function renumberCards(html) {
  let cardNum = 0;
  return html.replace(/data-index="(XX|\d+)"/g, () => { cardNum++; return `data-index="${String(cardNum).padStart(2, '0')}"`; });
}

function updateCnIndex() {
  const p = path.join(__dirname, 'articles', 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  html = insertCards(html, '<h2>看盘方法</h2>', articles, '看盘方法');
  html = updateCount(html, '<h2>看盘方法</h2>', articles.length);
  html = renumberCards(html);
  html = insertJsonLd(html, articles, false);
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated CN index');
}

function updateEnIndex() {
  const p = path.join(__dirname, 'articles', 'en', 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  const mainSectionIdx = html.indexOf('id="en-article-index"');
  const listStart = html.indexOf('<div class="article-list">', mainSectionIdx);
  const insertPos = listStart + '<div class="article-list">'.length;
  let cards = '\n';
  for (const a of articles) {
    cards += `          <article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Methods</span><span>Bilingual</span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read more</a>
            </div>
          </article>\n`;
  }
  html = html.slice(0, insertPos) + cards + html.slice(insertPos);
  html = renumberCards(html);
  const countMatch = html.match(/(\d+)\s*Articles/);
  if (countMatch) html = html.replace(countMatch[0], (parseInt(countMatch[1]) + articles.length) + ' Articles');
  html = insertJsonLd(html, articles, true);
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated EN index');
}

function updateTopic() {
  const p = path.join(__dirname, 'articles', 'ziwei-learning-path.html');
  let html = fs.readFileSync(p, 'utf8');
  const firstCardIdx = html.indexOf('<article class="article-card"');
  let cards = '';
  for (const a of articles) {
    cards += `          <article class="article-card" data-index="XX">
            <div class="card-body">
              <div class="card-meta"><span class="tag">看盘方法</span><span><time datetime="${date}">${dateDisplay}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <p>${a.cnDesc}</p>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
          `;
  }
  html = html.slice(0, firstCardIdx) + cards + html.slice(firstCardIdx);
  html = renumberCards(html);
  const countMatch = html.match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    html = html.replace(countMatch[0], `<span>${oldCount + articles.length} 篇</span>`);
  }
  if (html.includes('"@type": "ItemList"')) {
    html = insertJsonLd(html, articles, false);
  }
  fs.writeFileSync(p, html.replace(/\r\n/g, '\n'), 'utf8');
  console.log('Updated topic page');
}

function updateFeed(feedPath, isEn) {
  let xml = fs.readFileSync(feedPath, 'utf8');
  xml = xml.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, `<lastBuildDate>${pubDate}</lastBuildDate>`);
  let items = '';
  for (const a of articles) {
    const title = isEn ? a.enTitle : a.cnTitle;
    const desc = isEn ? a.enDesc : a.cnDesc;
    const link = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
    items += `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  }
  const firstItem = xml.indexOf('<item>');
  xml = xml.slice(0, firstItem) + items + xml.slice(firstItem);
  const itemCount = (xml.match(/<item>/g) || []).length;
  if (itemCount > 80) {
    let removeCount = itemCount - 80;
    for (let i = 0; i < removeCount; i++) {
      const lastItemStart = xml.lastIndexOf('    <item>');
      const lastItemEnd = xml.indexOf('</item>', lastItemStart) + '</item>'.length;
      let end = lastItemEnd;
      if (xml[end] === '\n') end++;
      xml = xml.slice(0, lastItemStart) + xml.slice(end);
    }
  }
  fs.writeFileSync(feedPath, xml.trimEnd() + '\n', 'utf8');
  console.log('Updated feed: ' + feedPath);
}

function updateSitemap(smPath, isEn) {
  let xml = fs.readFileSync(smPath, 'utf8');
  let urls = '';
  for (const a of articles) {
    const link = isEn ? `https://yuetianai.com/articles/en/${a.slug}.html` : `https://yuetianai.com/articles/${a.slug}.html`;
    urls += `  <url>
    <loc>${link}</loc>
    <lastmod>${smDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }
  xml = xml.replace('</urlset>', urls + '</urlset>');
  fs.writeFileSync(smPath, xml.trimEnd() + '\n', 'utf8');
  console.log('Updated sitemap: ' + smPath);
}

updateCnIndex();
updateEnIndex();
updateTopic();
updateFeed(path.join(__dirname, 'feed.xml'), false);
updateFeed(path.join(__dirname, 'articles', 'en', 'feed.xml'), true);
updateSitemap(path.join(__dirname, 'sitemap-articles.xml'), false);
updateSitemap(path.join(__dirname, 'sitemap-en.xml'), true);
console.log('All updates complete.');
