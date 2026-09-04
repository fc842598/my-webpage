const fs = require('fs');
const path = require('path');
const date = '2026-08-20T10:15:00+08:00';
const dateDisplay = '2026-08-20 10:15';
const pubDate = 'Thu, 20 Aug 2026 02:15:00 +0000';
const smDate = '2026-08-20';

const articles = [
  { slug:'ziwei-kanpan-buneng-zhikan-minggong', cnTitle:'紫微斗数看盘为什么不能只看命宫：你忽略的宫位才是答案', cnDesc:'很多人看紫微斗数只盯着命宫，但命宫只回答你是谁，不回答你会遇到什么。十二宫是一个系统，答案在宫位之间的关系里。', enTitle:'Why You Can\'t Read a Chart by Life Palace Alone', enDesc:'Many only look at Life palace, but it only answers who you are, not what you encounter. The twelve palaces are a system.' },
  { slug:'ziwei-shenggong-zhengque-yongfa', cnTitle:'紫微斗数身宫到底怎么用：它不是第二个命宫', cnDesc:'身宫代表你35岁后逐渐活出的样子和后天努力的方向。身宫跟命宫一致是加成，不一致是张力。', enTitle:'How to Actually Use the Body Palace: It\'s Not a Second Life Palace', enDesc:'Body palace represents who you gradually become after 35 and the direction of后天 effort.' },
  { slug:'ziwei-duigong-jiexing-jiexian', cnTitle:'紫微斗数对宫借星的界限：不是所有星都能借', cnDesc:'空宫借对宫是常用手法，但借星有界限：主星可以借，四化要分情况，煞星辅星不能直接照搬。', enTitle:'The Limits of Borrowing from the Opposite Palace: Not Every Star Can Be Borrowed', enDesc:'Borrowing stars for empty palaces is common, but there are limits: main stars can be borrowed, transformations depend, malefics cannot be copied.' },
  { slug:'ziwei-hualu-bu-yiding-haoshi', cnTitle:'紫微斗数化禄不一定是好事：禄多了也会撑', cnDesc:'化禄主财源和缘分，但化禄太多或落在不对的宫位，可能变成机会太多反而分散或不劳而获失去动力。', enTitle:'Hua Lu Isn\'t Always Good: Too Much Lu Can Overwhelm', enDesc:'Hua Lu rules resources and connections, but too much or in the wrong palace can scatter opportunities or kill drive.' },
  { slug:'ziwei-huaquan-bu-yiding-zhangquan', cnTitle:'紫微斗数化权不一定是掌权：也可能是被责任压住', cnDesc:'化权主权力和执行力，但化权落在不对的位置或加煞星，可能变成责任大但权力小或被迫扛事。', enTitle:'Hua Quan Isn\'t Always Power: It Can Be Crushed by Responsibility', enDesc:'Hua Quan rules power and execution, but in the wrong position or with malefics it can mean big responsibility with little authority.' },
  { slug:'ziwei-huake-bu-yiding-youming', cnTitle:'紫微斗数化科不一定是有名：也可能只是名声好听但不实惠', cnDesc:'化科主名声和贵人，但化科无禄无权，可能变成有名无利或面子好看里子空。', enTitle:'Hua Ke Isn\'t Always Fame: It Can Be a Nice Name Without Substance', enDesc:'Hua Ke rules reputation and benefactors, but without Lu or Quan it can mean fame without profit.' },
  { slug:'ziwei-huaji-bu-yiding-huaishi', cnTitle:'紫微斗数化忌不一定是坏事：它是收束不是毁灭', cnDesc:'化忌主阻滞和执着，但化忌也代表在意和深耕。用好了化忌是专注力，用不好才是焦虑和执念。', enTitle:'Hua Ji Isn\'t Always Bad: It\'s Focus, Not Destruction', enDesc:'Hua Ji rules obstruction and fixation, but also caring and deep focus. Used well it is concentration; used poorly it is anxiety.' },
  { slug:'ziwei-miaowang-luoxian-shizhan', cnTitle:'紫微斗数庙旺落陷实战：亮度不是评分，是能量状态', cnDesc:'星曜亮度常被当成分数，庙旺就好落陷就差。其实亮度描述的是星曜能量发挥的状态，落陷的星用对了地方照样有力量。', enTitle:'Temple, Prosperous, Bright, Fallen: Brightness Is Energy State, Not a Score', enDesc:'Brightness is often treated as a score, but it describes how energy expresses; a fallen star used correctly still has power.' },
  { slug:'ziwei-shaxing-bu-kenpa', cnTitle:'紫微斗数煞星不可怕：可怕的是你不知道它在煞什么', cnDesc:'擎羊陀罗火铃空劫被称为煞星，但煞星不是灾星，它是磨刀石。用好了煞星是冲劲和突破。', enTitle:'Malefics Aren\'t Scary: What\'s Scary Is Not Knowing What They Sharpen', enDesc:'The malefics are whetstones, not disaster stars. Used well they are drive and breakthrough.' },
  { slug:'ziwei-kongjie-bu-shi-meiyou', cnTitle:'紫微斗数空劫不是什么都没有：是空掉旧的才能装新的', cnDesc:'地空地劫常被误解为破财和失去，但空劫的本质是清空——旧的不去新的不来。用好了空劫是灵感和突破。', enTitle:'Kong Jie Isn\'t Nothing: Emptying the Old Makes Room for the New', enDesc:'Di Kong and Di Jie are often misunderstood as loss, but their essence is emptying. Used well they are inspiration and breakthrough.' },
  { slug:'ziwei-daxian-jiaotuo-qi', cnTitle:'紫微斗数大限交脱期：换运前后最容易出事的三年', cnDesc:'大限交脱期是两个大限交替的前后约三年，运势转换、事件频发。知道自己什么时候交脱，就能提前准备。', enTitle:'Major Cycle Transition: The Three Riskiest Years When Changing Cycles', enDesc:'The transition between major cycles spans about three years, when fortune shifts and events cluster.' },
  { slug:'ziwei-xiaoxian-shizhan-yongfa', cnTitle:'紫微斗数小限怎么用：它不是第二个流年', cnDesc:'小限反映个人层面的年份主题，跟流年（天干四化）互补，一个看外在环境，一个看内在状态。', enTitle:'How to Use the Minor Cycle: It\'s Not a Second Annual Forecast', enDesc:'The minor cycle reflects personal-level yearly themes, complementing the annual cycle — one sees external environment, the other internal state.' },
  { slug:'ziwei-geju-bu-neng-taoshuyin', cnTitle:'紫微斗数格局不能套书印：成格条件只是起点，不是答案', cnDesc:'格局有成格条件，但成格不等于好命，破格也不等于差命。格局要看星曜组合、宫位、四化、大限综合判断。', enTitle:'Patterns Can\'t Be Applied by the Book: Conditions Are a Starting Point, Not an Answer', enDesc:'Forming a pattern doesn\'t guarantee good fate, nor does breaking one guarantee failure. Patterns require synthesizing the whole chart.' },
  { slug:'ziwei-kanpan-xiankan-dafangxiang', cnTitle:'紫微斗数看盘先看大方向：不要一上来就抠细节', cnDesc:'看盘最忌讳一上来就盯着某颗星不放。先看整体格局、三方四正、大限走势，确定大方向后再看细节。', enTitle:'Read the Big Picture First: Don\'t Start with Details', enDesc:'Fixating on one star from the start is the worst approach. First see overall structure, triple direction, and cycle trends.' },
  { slug:'ziwei-tongyi-pan-butong-jiedu', cnTitle:'紫微斗数同一张盘为什么不同人解读不同：因为问的问题不同', cnDesc:'同一张盘有多个有效解读，关键看你问什么。问财运和问感情，重点宫位完全不同。', enTitle:'Why the Same Chart Gets Different Readings: Because the Questions Differ', enDesc:'The same chart has multiple valid readings depending on the question. Wealth and love focus on entirely different palaces.' },
  { slug:'ziwei-kanpan-bie-wen-weishenme', cnTitle:'紫微斗数看盘别问为什么是我：要问接下来怎么办', cnDesc:'紫微斗数更擅长回答趋势是什么和怎么应对，而不是为什么。知道为什么不能改变任何事，知道接下来怎样才能帮你做决定。', enTitle:'Don\'t Ask Why Me: Ask What Do I Do Next', enDesc:'Zi Wei is better at answering trends and responses than why. Knowing why changes nothing; knowing what\'s next helps you decide.' },
  { slug:'ziwei-xingxing-zhijian-huixiangying', cnTitle:'紫微斗数星星之间会互相影响：不能把每颗星单独读', cnDesc:'星曜不是独立作用的，它们之间会化学反应。吉星加吉星可能更好，吉星加煞星可能变质，煞星加煞星可能极端。', enTitle:'Stars Interact: You Can\'t Read Each Star in Isolation', enDesc:'Stars chemically react with each other. Read combinations, not isolated stars.' },
  { slug:'ziwei-wuxing-jusheng-buneng-yingtao', cnTitle:'紫微斗数五行局不能硬套：它是排盘工具不是命运标签', cnDesc:'五行局主要用于定紫微星位置和起大限年龄，不是用来判断性格和命运的。', enTitle:'Five Elements Phase Can\'t Be Forced: It\'s a Charting Tool, Not a Fate Label', enDesc:'The five elements phase is mainly used to position Zi Wei and set cycle starting age, not to judge personality or fate.' },
  { slug:'ziwei-kanpan-yaokan-shunxu-bushi-zhongdian', cnTitle:'紫微斗数看盘要看顺序不是重点：哪个宫先触发才是关键', cnDesc:'运势按时间顺序发生，先触发的宫位会影响后触发的宫位。看盘要看先来后到。', enTitle:'Read in Sequence, Not by Importance: Which Palace Triggers First Matters', enDesc:'Fortune unfolds in time sequence; palaces triggered first affect later ones.' },
  { slug:'ziwei-ganzhi-yongchu-buzhi-shi-fuhao', cnTitle:'紫微斗数天干地支不只是符号：它们决定四化从哪来', cnDesc:'天干决定四化，地支决定宫位位置。不懂干支就读不懂四化的方向——禄从哪来、忌往哪去。', enTitle:'Stems and Branches Aren\'t Just Symbols: They Determine Where Transformations Come From', enDesc:'Stems determine transformations, branches determine palace positions. Without them you can\'t read the direction of transformations.' }
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
