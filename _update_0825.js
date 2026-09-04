const fs = require('fs');
const date = '2026-08-25T10:00:00+08:00';

const huajiArticles = [
  {slug:'ziwei-huaji-zai-caibogong', cnTitle:'化忌在财帛宫：赚钱辛苦存钱难，财上的执念要学会放', enTitle:'Hua Ji in Wealth Palace: Hard Earnings, Difficult Savings', enDesc:'Hua Ji in Wealth means hard earnings and difficult savings; let go of money fixation.'},
  {slug:'ziwei-huaji-zai-jiegong', cnTitle:'化忌在疾厄宫：慢性病和意外要当心，身体在提醒你放下', enTitle:'Hua Ji in Health Palace: Watch Chronic Conditions', enDesc:'Hua Ji in Health means watch chronic conditions; the body asks you to release.'},
  {slug:'ziwei-huaji-zai-qianyi', cnTitle:'化忌在迁移宫：在外发展多波折，离乡的功课是适应', enTitle:'Hua Ji in Travel Palace: Many Twists Outside', enDesc:'Hua Ji in Travel means many twists outside; the lesson is adaptation.'},
  {slug:'ziwei-huaji-zai-puyigong', cnTitle:'化忌在仆役宫：朋友缘分有亏欠，合伙要谨慎', enTitle:'Hua Ji in Friends Palace: Karmic Debt with Friends', enDesc:'Hua Ji in Friends means karmic debt; be cautious in partnerships.'},
  {slug:'ziwei-huaji-zai-guanlugong', cnTitle:'化忌在官禄宫：事业上容易卡住，执念越深越难突破', enTitle:'Hua Ji in Career Palace: Career Gets Stuck', enDesc:'Hua Ji in Career means blockages; deeper fixation makes breakthrough harder.'},
  {slug:'ziwei-huaji-zai-tianzhaigong', cnTitle:'化忌在田宅宫：房产家事多波折，家里有放不下的事', enTitle:'Hua Ji in Property Palace: Property and Family Twists', enDesc:'Hua Ji in Property means family twists and unresolved matters at home.'},
  {slug:'ziwei-huaji-zai-fudegong', cnTitle:'化忌在福德宫：精神上容易焦虑，想太多是最大的内耗', enTitle:'Hua Ji in Fortune Palace: Prone to Anxiety', enDesc:'Hua Ji in Fortune means anxiety; overthinking is the biggest drain.'},
  {slug:'ziwei-huaji-zai-fumugong', cnTitle:'化忌在父母宫：与父母缘分有亏欠，沟通是一辈子的功课', enTitle:'Hua Ji in Parents Palace: Karmic Debt with Parents', enDesc:'Hua Ji in Parents means karmic debt; communication is a lifelong lesson.'}
];

const auxArticles = [
  {slug:'ziwei-tiankui-zai-xiongdigong', cnTitle:'天魁在兄弟宫：兄弟姐妹中有贵人，关键时刻有人拉一把', enTitle:'Tian Kui in Siblings Palace: A Benefactor Among Siblings', enDesc:'Tian Kui in Siblings means a benefactor helps at key moments.'},
  {slug:'ziwei-tiankui-zai-fuqigong', cnTitle:'天魁在夫妻宫：伴侣条件好，感情中有明面上的贵人', enTitle:'Tian Kui in Spouse Palace: A Good Partner', enDesc:'Tian Kui in Spouse means a good partner with visible benefactor luck.'},
  {slug:'ziwei-tiankui-zai-zinvgong', cnTitle:'天魁在子女宫：孩子有出息，晚辈中出贵人', enTitle:'Tian Kui in Children Palace: Promising Children', enDesc:'Tian Kui in Children means promising children and benefactors among juniors.'},
  {slug:'ziwei-tiankui-zai-caibogong', cnTitle:'天魁在财帛宫：赚钱有贵人带，机会来得光明正大', enTitle:'Tian Kui in Wealth Palace: A Guide in Earning', enDesc:'Tian Kui in Wealth means a guide helps; opportunities come openly.'},
  {slug:'ziwei-tiankui-zai-jiegong', cnTitle:'天魁在疾厄宫：逢凶化吉的体质，有病能遇良医', enTitle:'Tian Kui in Health Palace: Misfortune Turns to Blessing', enDesc:'Tian Kui in Health means good doctors when ill; misfortune turns around.'},
  {slug:'ziwei-tiankui-zai-qianyi', cnTitle:'天魁在迁移宫：出门遇贵人，离乡发展有长辈提携', enTitle:'Tian Kui in Travel Palace: Benefactors Outside', enDesc:'Tian Kui in Travel means benefactors and elder support away from home.'},
  {slug:'ziwei-tiankui-zai-puyigong', cnTitle:'天魁在仆役宫：朋友中有贵人，关键时刻有人帮你说话', enTitle:'Tian Kui in Friends Palace: A Benefactor Among Friends', enDesc:'Tian Kui in Friends means someone speaks up for you at key moments.'},
  {slug:'ziwei-tiankui-zai-guanlugong', cnTitle:'天魁在官禄宫：事业上有伯乐，升职加薪有人提携', enTitle:'Tian Kui in Career Palace: A Talent-Spotter at Work', enDesc:'Tian Kui in Career means a talent-spotter promotes you.'},
  {slug:'ziwei-tiankui-zai-tianzhaigong', cnTitle:'天魁在田宅宫：家产有贵人助，置房安家有人帮忙', enTitle:'Tian Kui in Property Palace: Help with Property', enDesc:'Tian Kui in Property means help with housing and family assets.'},
  {slug:'ziwei-tiankui-zai-fudegong', cnTitle:'天魁在福德宫：心态乐观有福气，遇事总能逢凶化吉', enTitle:'Tian Kui in Fortune Palace: Optimistic and Blessed', enDesc:'Tian Kui in Fortune means optimism and things always work out.'},
  {slug:'ziwei-tiankui-zai-fumugong', cnTitle:'天魁在父母宫：父母是贵人，长辈缘深助力大', enTitle:'Tian Kui in Parents Palace: Parents Are Benefactors', enDesc:'Tian Kui in Parents means parents are benefactors with deep support.'},
  {slug:'ziwei-tianyue-zai-xiongdigong', cnTitle:'天钺在兄弟宫：兄弟姐妹中有人暗中帮你', enTitle:'Tian Yue in Siblings Palace: A Sibling Helps Behind the Scenes', enDesc:'Tian Yue in Siblings means a sibling helps quietly.'},
  {slug:'ziwei-tianyue-zai-fuqigong', cnTitle:'天钺在夫妻宫：伴侣温柔体贴，感情中有暗助', enTitle:'Tian Yue in Spouse Palace: A Gentle Partner', enDesc:'Tian Yue in Spouse means a gentle partner with hidden support.'},
  {slug:'ziwei-tianyue-zai-zinvgong', cnTitle:'天钺在子女宫：孩子懂事贴心，晚辈缘好', enTitle:'Tian Yue in Children Palace: Thoughtful Children', enDesc:'Tian Yue in Children means thoughtful children and good junior bonds.'},
  {slug:'ziwei-tianyue-zai-caibogong', cnTitle:'天钺在财帛宫：暗中有人送机会，偏财来自人脉', enTitle:'Tian Yue in Wealth Palace: Hidden Opportunities', enDesc:'Tian Yue in Wealth means hidden opportunities and side income from connections.'},
  {slug:'ziwei-tianyue-zai-jiegong', cnTitle:'天钺在疾厄宫：慢性病遇良医，调理比硬扛重要', enTitle:'Tian Yue in Health Palace: Good Doctors for Chronic Conditions', enDesc:'Tian Yue in Health means good doctors; adjustment over endurance.'},
  {slug:'ziwei-tianyue-zai-qianyi', cnTitle:'天钺在迁移宫：在外有暗贵人，离乡有人默默帮', enTitle:'Tian Yue in Travel Palace: A Hidden Benefactor Outside', enDesc:'Tian Yue in Travel means quiet help away from home.'},
  {slug:'ziwei-tianyue-zai-puyigong', cnTitle:'天钺在仆役宫：朋友中有人暗中提携', enTitle:'Tian Yue in Friends Palace: A Friend Quietly Promotes You', enDesc:'Tian Yue in Friends means behind-the-scenes support.'},
  {slug:'ziwei-tianyue-zai-guanlugong', cnTitle:'天钺在官禄宫：事业上有暗中的贵人相助', enTitle:'Tian Yue in Career Palace: Behind-the-Scenes Help', enDesc:'Tian Yue in Career means hidden benefactor support.'},
  {slug:'ziwei-tianyue-zai-tianzhaigong', cnTitle:'天钺在田宅宫：家里有隐性助力，家事有人帮衬', enTitle:'Tian Yue in Property Palace: Hidden Help at Home', enDesc:'Tian Yue in Property means quiet help with family matters.'},
  {slug:'ziwei-tianyue-zai-fudegong', cnTitle:'天钺在福德宫：精神上有寄托，福气来自内心', enTitle:'Tian Yue in Fortune Palace: Spiritual Solace', enDesc:'Tian Yue in Fortune means blessings come from within.'},
  {slug:'ziwei-tianyue-zai-fumugong', cnTitle:'天钺在父母宫：父母温柔体贴，暗中为你铺路', enTitle:'Tian Yue in Parents Palace: Gentle Parents', enDesc:'Tian Yue in Parents means gentle parents quietly paving your way.'},
  {slug:'ziwei-qingyang-zai-minggong', cnTitle:'擎羊在命宫：性格刚烈敢拼，人生大起大落', enTitle:'Qing Yang in Life Palace: Fierce and Bold', enDesc:'Qing Yang in Life means a fierce nature with major ups and downs.'},
  {slug:'ziwei-qingyang-zai-xiongdigong', cnTitle:'擎羊在兄弟宫：兄弟姐妹个性刚烈，关系有摩擦', enTitle:'Qing Yang in Siblings Palace: Strong-Willed Siblings', enDesc:'Qing Yang in Siblings means strong-willed siblings with friction.'},
  {slug:'ziwei-qingyang-zai-fuqigong', cnTitle:'擎羊在夫妻宫：感情里有冲突，伴侣脾气急', enTitle:'Qing Yang in Spouse Palace: Conflict in Love', enDesc:'Qing Yang in Spouse means conflict and a quick-tempered partner.'},
  {slug:'ziwei-qingyang-zai-zinvgong', cnTitle:'擎羊在子女宫：孩子叛逆好胜，教育要疏导不要压制', enTitle:'Qing Yang in Children Palace: Rebellious Children', enDesc:'Qing Yang in Children means rebellious children; guide, do not suppress.'},
  {slug:'ziwei-qingyang-zai-caibogong', cnTitle:'擎羊在财帛宫：赚钱有冲劲但破财风险大', enTitle:'Qing Yang in Wealth Palace: Aggressive Earning, High Loss Risk', enDesc:'Qing Yang in Wealth means aggressive earning but high loss risk.'},
  {slug:'ziwei-qingyang-zai-jiegong', cnTitle:'擎羊在疾厄宫：注意外伤和手术，运动要防护', enTitle:'Qing Yang in Health Palace: Watch Injuries and Surgery', enDesc:'Qing Yang in Health means watch injuries; protect during exercise.'},
  {slug:'ziwei-qingyang-zai-qianyi', cnTitle:'擎羊在迁移宫：在外闯荡多波折，离乡要防意外', enTitle:'Qing Yang in Travel Palace: Many Twists Outside', enDesc:'Qing Yang in Travel means many twists; beware accidents away.'},
  {slug:'ziwei-qingyang-zai-puyigong', cnTitle:'擎羊在仆役宫：朋友中有人太冲动，合伙防冲突', enTitle:'Qing Yang in Friends Palace: An Impulsive Friend', enDesc:'Qing Yang in Friends means an impulsive friend; prevent conflict.'},
  {slug:'ziwei-qingyang-zai-guanlugong', cnTitle:'擎羊在官禄宫：事业上有冲劲但容易树敌', enTitle:'Qing Yang in Career Palace: Drive but Prone to Enemies', enDesc:'Qing Yang in Career means drive but prone to making enemies.'},
  {slug:'ziwei-qingyang-zai-tianzhaigong', cnTitle:'擎羊在田宅宫：家里有争执，房产买卖防纠纷', enTitle:'Qing Yang in Property Palace: Disputes at Home', enDesc:'Qing Yang in Property means home disputes; beware property conflicts.'}
];

// 1. Update CN index
console.log('Updating CN index...');
let cnIndex = fs.readFileSync('articles/index.html', 'utf8');

// Add huaji to 四化 section
if (!cnIndex.includes(huajiArticles[0].slug)) {
  const sihuaListIdx = cnIndex.indexOf('<h2>四化飞星</h2>');
  const sihuaDivIdx = cnIndex.indexOf('<div class="article-list">', sihuaListIdx);
  const sihuaCloseIdx = cnIndex.indexOf('</div>', sihuaDivIdx);
  let cards = '';
  for (let i = 0; i < huajiArticles.length; i++) {
    const a = huajiArticles[i];
    cards += `          <article class="article-card" data-index="${String(i+37).padStart(2,'0')}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">四化</span><span><time datetime="${date}">2026-08-25 10:00</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;
  }
  cnIndex = cnIndex.slice(0, sihuaCloseIdx) + cards + cnIndex.slice(sihuaCloseIdx);
  // Update count from 40 to 48
  cnIndex = cnIndex.replace(/(<h2>四化飞星<\/h2>[\s\S]*?<span>)(\d+)( 篇<\/span>)/, (m, pre, num, post) => pre + (parseInt(num)+8) + post);
  console.log('  化忌 cards added to 四化 section');
}

// Add aux to 辅煞曜 section
if (!cnIndex.includes(auxArticles[0].slug)) {
  const auxH2Idx = cnIndex.indexOf('<h2>辅煞曜</h2>');
  const auxDivIdx = cnIndex.indexOf('<div class="article-list">', auxH2Idx);
  const insertPos = cnIndex.indexOf('\n', auxDivIdx) + 1;
  let cards = '';
  for (let i = 0; i < auxArticles.length; i++) {
    const a = auxArticles[i];
    cards += `          <article class="article-card" data-index="${String(i+1).padStart(2,'0')}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">辅煞曜</span><span><time datetime="${date}">2026-08-25 10:00</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;
  }
  cnIndex = cnIndex.slice(0, insertPos) + cards + cnIndex.slice(insertPos);
  const countMatch = cnIndex.substring(auxH2Idx).match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    cnIndex = cnIndex.substring(0, auxH2Idx) + cnIndex.substring(auxH2Idx).replace(countMatch[0], `<span>${parseInt(countMatch[1])+32} 篇</span>`);
  }
  console.log('  Aux cards added to 辅煞曜 section');
}
fs.writeFileSync('articles/index.html', cnIndex, 'utf8');

// 2. Update EN index
console.log('Updating EN index...');
let enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
if (!enIndex.includes(huajiArticles[0].slug)) {
  const listDiv = enIndex.indexOf('<div class="article-list">');
  const firstCardEnd = enIndex.indexOf('</article>', enIndex.indexOf('article-card', listDiv));
  const insertPos = enIndex.indexOf('\n', firstCardEnd) + 1;
  const all = [...huajiArticles, ...auxArticles];
  let enCards = '';
  for (let i = 0; i < all.length; i++) {
    const a = all[i];
    enCards += `          <article class="article-card" data-index="${String(i+2).padStart(2,'0')}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-25 10:00</time></span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read article</a>
            </div>
          </article>
`;
  }
  enIndex = enIndex.slice(0, insertPos) + enCards + enIndex.slice(insertPos);
  const countMatch = enIndex.match(/(\d+) Articles/);
  if (countMatch) enIndex = enIndex.replace(countMatch[0], `${parseInt(countMatch[1])+40} Articles`);
  fs.writeFileSync('articles/en/index.html', enIndex, 'utf8');
  console.log('  EN index updated');
}

// 3. Update topic pages
console.log('Updating topic pages...');
let sihuaTopic = fs.readFileSync('articles/ziwei-sihua.html', 'utf8');
if (!sihuaTopic.includes(huajiArticles[0].slug)) {
  const listDiv = sihuaTopic.indexOf('<div class="article-list">');
  const insertPos = sihuaTopic.indexOf('\n', listDiv) + 1;
  let cards = '';
  for (const a of huajiArticles) {
    cards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${date}">2026-08-25</time></a>\n`;
  }
  sihuaTopic = sihuaTopic.slice(0, insertPos) + cards + sihuaTopic.slice(insertPos);
  sihuaTopic = sihuaTopic.replace(/<span>(\d+) 篇<\/span>/, (m, n) => `<span>${parseInt(n)+8} 篇</span>`);
  fs.writeFileSync('articles/ziwei-sihua.html', sihuaTopic, 'utf8');
  console.log('  四化 topic page updated');
}

let auxTopic = fs.readFileSync('articles/ziwei-helper-malice-stars.html', 'utf8');
if (!auxTopic.includes(auxArticles[0].slug)) {
  const firstCard = auxTopic.indexOf('class="article-card"');
  const lineStart = auxTopic.lastIndexOf('\n', firstCard) + 1;
  let cards = '';
  for (const a of auxArticles) {
    cards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${date}">2026-08-25</time></a>\n`;
  }
  auxTopic = auxTopic.slice(0, lineStart) + cards + auxTopic.slice(lineStart);
  fs.writeFileSync('articles/ziwei-helper-malice-stars.html', auxTopic, 'utf8');
  console.log('  辅煞曜 topic page updated');
}

// 4. Update feeds
console.log('Updating feeds...');
let cnFeed = fs.readFileSync('feed.xml', 'utf8');
if (!cnFeed.includes(huajiArticles[0].slug)) {
  let items = '';
  for (const a of [...huajiArticles, ...auxArticles]) {
    items += `  <item><title>${a.cnTitle}</title><link>https://yuetianai.com/articles/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid><pubDate>Tue, 25 Aug 2026 10:00:00 +0800</pubDate><description><![CDATA[${a.cnTitle}]]></description></item>\n`;
  }
  cnFeed = cnFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('feed.xml', cnFeed, 'utf8');
  console.log('  CN feed updated');
}

let enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
if (!enFeed.includes(huajiArticles[0].slug)) {
  let items = '';
  for (const a of [...huajiArticles, ...auxArticles]) {
    items += `  <item><title>${a.enTitle}</title><link>https://yuetianai.com/articles/en/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid><pubDate>Tue, 25 Aug 2026 10:00:00 +0800</pubDate><description><![CDATA[${a.enTitle}]]></description></item>\n`;
  }
  enFeed = enFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('articles/en/feed.xml', enFeed, 'utf8');
  console.log('  EN feed updated');
}

console.log('\nAll updates done.');
