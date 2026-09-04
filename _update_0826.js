const fs = require('fs');
const date = '2026-08-26T10:00:00+08:00';

const articles = [
  {slug:'ziwei-qingyang-zai-fudegong', cnTitle:'擎羊在福德宫：精神上急躁闲不住，放松对他们来说很难', enTitle:'Qing Yang in Fortune Palace: Restless Spirit', enDesc:'Qing Yang in Fortune means restless spirit; relaxation is difficult.'},
  {slug:'ziwei-qingyang-zai-fumugong', cnTitle:'擎羊在父母宫：父母管教严厉，与长辈关系有摩擦', enTitle:'Qing Yang in Parents Palace: Strict Parents', enDesc:'Qing Yang in Parents means strict parents and friction with elders.'},
  {slug:'ziwei-tuoluo-zai-minggong', cnTitle:'陀罗在命宫：性子慢但韧劲足，大器晚成的类型', enTitle:'Tuo Luo in Life Palace: Slow but Tenacious', enDesc:'Tuo Luo in Life means slow but tenacious; a late bloomer.'},
  {slug:'ziwei-tuoluo-zai-xiongdigong', cnTitle:'陀罗在兄弟宫：兄弟姐妹中有固执者，资金周转慢', enTitle:'Tuo Luo in Siblings Palace: A Stubborn Sibling', enDesc:'Tuo Luo in Siblings means a stubborn sibling and slow cash flow.'},
  {slug:'ziwei-tuoluo-zai-fuqigong', cnTitle:'陀罗在夫妻宫：感情里有纠缠，旧情难忘是功课', enTitle:'Tuo Luo in Spouse Palace: Entanglement in Love', enDesc:'Tuo Luo in Spouse means entanglement; letting go of old flames.'},
  {slug:'ziwei-tuoluo-zai-zinvgong', cnTitle:'陀罗在子女宫：孩子性子慢，教育要有耐心不要催', enTitle:'Tuo Luo in Children Palace: Slow-Paced Children', enDesc:'Tuo Luo in Children means slow-paced children; patience over pressure.'},
  {slug:'ziwei-tuoluo-zai-caibogong', cnTitle:'陀罗在财帛宫：赚钱慢但能守，适合长线投资', enTitle:'Tuo Luo in Wealth Palace: Slow Earnings, Good Keeper', enDesc:'Tuo Luo in Wealth means slow earnings but good at keeping; long-term suits.'},
  {slug:'ziwei-tuoluo-zai-jiegong', cnTitle:'陀罗在疾厄宫：注意慢性病和旧疾，调理要坚持', enTitle:'Tuo Luo in Health Palace: Chronic and Old Ailments', enDesc:'Tuo Luo in Health means watch chronic ailments; persist in treatment.'},
  {slug:'ziwei-tuoluo-zai-qianyi', cnTitle:'陀罗在迁移宫：在外发展多拖延，离乡要耐住性子', enTitle:'Tuo Luo in Travel Palace: Delays Outside', enDesc:'Tuo Luo in Travel means delays; patience when leaving home.'},
  {slug:'ziwei-tuoluo-zai-puyigong', cnTitle:'陀罗在仆役宫：朋友中有难缠的人，合伙防纠缠', enTitle:'Tuo Luo in Friends Palace: A Difficult Friend', enDesc:'Tuo Luo in Friends means a difficult person; beware entanglement.'},
  {slug:'ziwei-tuoluo-zai-guanlugong', cnTitle:'陀罗在官禄宫：事业上大器晚成，坚持比速度重要', enTitle:'Tuo Luo in Career Palace: Late-Blooming Career', enDesc:'Tuo Luo in Career means late blooming; persistence over speed.'},
  {slug:'ziwei-tuoluo-zai-tianzhaigong', cnTitle:'陀罗在田宅宫：房产家事多拖延，家里有旧问题', enTitle:'Tuo Luo in Property Palace: Property Delays', enDesc:'Tuo Luo in Property means delays and old problems at home.'},
  {slug:'ziwei-tuoluo-zai-fudegong', cnTitle:'陀罗在福德宫：精神上容易钻牛角尖，学会放下', enTitle:'Tuo Luo in Fortune Palace: Prone to Obsessive Thinking', enDesc:'Tuo Luo in Fortune means obsessive thinking; learn to let go.'},
  {slug:'ziwei-tuoluo-zai-fumugong', cnTitle:'陀罗在父母宫：与父母缘分有纠缠，沟通需要时间', enTitle:'Tuo Luo in Parents Palace: Entangled Parental Bonds', enDesc:'Tuo Luo in Parents means entangled bonds; communication takes time.'},
  {slug:'ziwei-huoxing-zai-minggong', cnTitle:'火星在命宫：脾气急爆发力强，人生像过山车', enTitle:'Huo Xing in Life Palace: Quick Temper, Strong Drive', enDesc:'Huo Xing in Life means quick temper and rollercoaster life.'},
  {slug:'ziwei-huoxing-zai-xiongdigong', cnTitle:'火星在兄弟宫：兄弟姐妹中有急性子，关系时好时坏', enTitle:'Huo Xing in Siblings Palace: A Hot-Tempered Sibling', enDesc:'Huo Xing in Siblings means a hot-tempered sibling with on-off relations.'},
  {slug:'ziwei-huoxing-zai-fuqigong', cnTitle:'火星在夫妻宫：感情来得快去得快，闪婚闪离风险', enTitle:'Huo Xing in Spouse Palace: Love Comes and Goes Fast', enDesc:'Huo Xing in Spouse means fast love; flash marriage risk.'},
  {slug:'ziwei-huoxing-zai-zinvgong', cnTitle:'火星在子女宫：孩子活泼好动，教育要引导精力', enTitle:'Huo Xing in Children Palace: Active, Restless Children', enDesc:'Huo Xing in Children means active children; guide their energy.'},
  {slug:'ziwei-huoxing-zai-caibogong', cnTitle:'火星在财帛宫：财运暴起暴落，投机要谨慎', enTitle:'Huo Xing in Wealth Palace: Boom-Bust Wealth', enDesc:'Huo Xing in Wealth means boom-bust; cautious with speculation.'},
  {slug:'ziwei-huoxing-zai-jiegong', cnTitle:'火星在疾厄宫：注意急性炎症和烫伤，防火', enTitle:'Huo Xing in Health Palace: Acute Inflammation and Burns', enDesc:'Huo Xing in Health means watch inflammation and burns; fire safety.'},
  {slug:'ziwei-huoxing-zai-qianyi', cnTitle:'火星在迁移宫：在外突发状况多，离乡要防意外', enTitle:'Huo Xing in Travel Palace: Sudden Events Outside', enDesc:'Huo Xing in Travel means sudden events; beware accidents.'},
  {slug:'ziwei-huoxing-zai-puyigong', cnTitle:'火星在仆役宫：朋友中有暴躁者，合伙防冲突', enTitle:'Huo Xing in Friends Palace: A Hot-Tempered Friend', enDesc:'Huo Xing in Friends means a hot-tempered friend; prevent conflict.'},
  {slug:'ziwei-huoxing-zai-guanlugong', cnTitle:'火星在官禄宫：事业上爆发力强但不持久', enTitle:'Huo Xing in Career Palace: Explosive but Not Sustained', enDesc:'Huo Xing in Career means explosive but unsustained drive.'},
  {slug:'ziwei-huoxing-zai-tianzhaigong', cnTitle:'火星在田宅宫：家里容易有突发状况，防火电', enTitle:'Huo Xing in Property Palace: Sudden Problems at Home', enDesc:'Huo Xing in Property means sudden problems; fire and electrical safety.'},
  {slug:'ziwei-huoxing-zai-fudegong', cnTitle:'火星在福德宫：精神上急躁，情绪来得快去得快', enTitle:'Huo Xing in Fortune Palace: Mentally Restless', enDesc:'Huo Xing in Fortune means restless; emotions come and go fast.'},
  {slug:'ziwei-huoxing-zai-fumugong', cnTitle:'火星在父母宫：父母脾气急，家庭氛围火爆', enTitle:'Huo Xing in Parents Palace: Hot-Tempered Parents', enDesc:'Huo Xing in Parents means hot-tempered parents and fiery atmosphere.'},
  {slug:'ziwei-lingxing-zai-minggong', cnTitle:'铃星在命宫：性格内敛深沉，喜怒不形于色', enTitle:'Ling Xing in Life Palace: Reserved and Deep', enDesc:'Ling Xing in Life means reserved and deep with hidden emotions.'},
  {slug:'ziwei-lingxing-zai-xiongdigong', cnTitle:'铃星在兄弟宫：兄弟姐妹中有阴沉者，关系微妙', enTitle:'Ling Xing in Siblings Palace: A Gloomy Sibling', enDesc:'Ling Xing in Siblings means a gloomy sibling with subtle relations.'},
  {slug:'ziwei-lingxing-zai-fuqigong', cnTitle:'铃星在夫妻宫：感情里有暗涌，冷战比吵架多', enTitle:'Ling Xing in Spouse Palace: Undercurrents in Love', enDesc:'Ling Xing in Spouse means undercurrents; cold wars over arguments.'},
  {slug:'ziwei-lingxing-zai-zinvgong', cnTitle:'铃星在子女宫：孩子内向敏感，教育要多关注情绪', enTitle:'Ling Xing in Children Palace: Introverted, Sensitive Children', enDesc:'Ling Xing in Children means introverted children; attend to emotions.'},
  {slug:'ziwei-lingxing-zai-caibogong', cnTitle:'铃星在财帛宫：暗中破财，花钱不知不觉', enTitle:'Ling Xing in Wealth Palace: Hidden Financial Loss', enDesc:'Ling Xing in Wealth means hidden loss; money disappears unnoticed.'},
  {slug:'ziwei-lingxing-zai-jiegong', cnTitle:'铃星在疾厄宫：注意暗疾和心理问题，定期体检', enTitle:'Ling Xing in Health Palace: Hidden Illness and Mental Health', enDesc:'Ling Xing in Health means hidden illness; regular checkups needed.'},
  {slug:'ziwei-lingxing-zai-qianyi', cnTitle:'铃星在迁移宫：在外有隐性阻碍，离乡防小人', enTitle:'Ling Xing in Travel Palace: Hidden Obstacles Outside', enDesc:'Ling Xing in Travel means hidden obstacles; beware saboteurs.'},
  {slug:'ziwei-lingxing-zai-puyigong', cnTitle:'铃星在仆役宫：朋友中有人暗中算计，交友要慎', enTitle:'Ling Xing in Friends Palace: A Secretly Calculating Friend', enDesc:'Ling Xing in Friends means a calculating friend; choose carefully.'},
  {slug:'ziwei-lingxing-zai-guanlugong', cnTitle:'铃星在官禄宫：事业上有暗斗，职场防小人', enTitle:'Ling Xing in Career Palace: Hidden Office Politics', enDesc:'Ling Xing in Career means hidden politics; beware saboteurs.'},
  {slug:'ziwei-lingxing-zai-tianzhaigong', cnTitle:'铃星在田宅宫：家里有隐性问题，家事难断', enTitle:'Ling Xing in Property Palace: Hidden Problems at Home', enDesc:'Ling Xing in Property means hidden problems; family matters hard to settle.'},
  {slug:'ziwei-lingxing-zai-fudegong', cnTitle:'铃星在福德宫：精神上容易抑郁，情绪要疏导', enTitle:'Ling Xing in Fortune Palace: Prone to Depression', enDesc:'Ling Xing in Fortune means prone to depression; emotions need outlet.'},
  {slug:'ziwei-lingxing-zai-fumugong', cnTitle:'铃星在父母宫：与父母有隐性矛盾，心结要解', enTitle:'Ling Xing in Parents Palace: Hidden Conflict with Parents', enDesc:'Ling Xing in Parents means hidden conflict; knots to untie.'},
  {slug:'ziwei-dikong-zai-minggong', cnTitle:'地空在命宫：精神世界丰富但不重物质，适合创意行业', enTitle:'Di Kong in Life Palace: Rich Inner World', enDesc:'Di Kong in Life means rich inner world; suited to creative fields.'},
  {slug:'ziwei-dikong-zai-xiongdigong', cnTitle:'地空在兄弟宫：兄弟姐妹缘分淡，资金周转容易落空', enTitle:'Di Kong in Siblings Palace: Weak Sibling Bonds', enDesc:'Di Kong in Siblings means weak bonds; cash flow plans fall through.'}
];

// 1. Update CN index - add to 辅煞曜 section
console.log('Updating CN index...');
let cnIndex = fs.readFileSync('articles/index.html', 'utf8');
if (!cnIndex.includes(articles[0].slug)) {
  const auxH2Idx = cnIndex.indexOf('<h2>辅煞曜</h2>');
  const auxDivIdx = cnIndex.indexOf('<div class="article-list">', auxH2Idx);
  const insertPos = cnIndex.indexOf('\n', auxDivIdx) + 1;
  let cards = '';
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    cards += `          <article class="article-card" data-index="${String(i+1).padStart(2,'0')}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">辅煞曜</span><span><time datetime="${date}">2026-08-26 10:00</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;
  }
  cnIndex = cnIndex.slice(0, insertPos) + cards + cnIndex.slice(insertPos);
  const countMatch = cnIndex.substring(auxH2Idx).match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    cnIndex = cnIndex.substring(0, auxH2Idx) + cnIndex.substring(auxH2Idx).replace(countMatch[0], `<span>${parseInt(countMatch[1])+40} 篇</span>`);
  }
  fs.writeFileSync('articles/index.html', cnIndex, 'utf8');
  console.log('  CN index updated');
}

// 2. Update EN index
console.log('Updating EN index...');
let enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
if (!enIndex.includes(articles[0].slug)) {
  const listDiv = enIndex.indexOf('<div class="article-list">');
  const firstCardEnd = enIndex.indexOf('</article>', enIndex.indexOf('article-card', listDiv));
  const insertPos = enIndex.indexOf('\n', firstCardEnd) + 1;
  let enCards = '';
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    enCards += `          <article class="article-card" data-index="${String(i+2).padStart(2,'0')}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-26 10:00</time></span></div>
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

// 3. Update aux topic page
console.log('Updating topic page...');
let auxTopic = fs.readFileSync('articles/ziwei-helper-malice-stars.html', 'utf8');
if (!auxTopic.includes(articles[0].slug)) {
  const firstCard = auxTopic.indexOf('class="article-card"');
  const lineStart = auxTopic.lastIndexOf('\n', firstCard) + 1;
  let cards = '';
  for (const a of articles) {
    cards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${date}">2026-08-26</time></a>\n`;
  }
  auxTopic = auxTopic.slice(0, lineStart) + cards + auxTopic.slice(lineStart);
  fs.writeFileSync('articles/ziwei-helper-malice-stars.html', auxTopic, 'utf8');
  console.log('  Topic page updated');
}

// 4. Update feeds
console.log('Updating feeds...');
let cnFeed = fs.readFileSync('feed.xml', 'utf8');
if (!cnFeed.includes(articles[0].slug)) {
  let items = '';
  for (const a of articles) {
    items += `  <item><title>${a.cnTitle}</title><link>https://yuetianai.com/articles/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid><pubDate>Wed, 26 Aug 2026 10:00:00 +0800</pubDate><description><![CDATA[${a.cnTitle}]]></description></item>\n`;
  }
  cnFeed = cnFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('feed.xml', cnFeed, 'utf8');
  console.log('  CN feed updated');
}

let enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
if (!enFeed.includes(articles[0].slug)) {
  let items = '';
  for (const a of articles) {
    items += `  <item><title>${a.enTitle}</title><link>https://yuetianai.com/articles/en/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid><pubDate>Wed, 26 Aug 2026 10:00:00 +0800</pubDate><description><![CDATA[${a.enTitle}]]></description></item>\n`;
  }
  enFeed = enFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('articles/en/feed.xml', enFeed, 'utf8');
  console.log('  EN feed updated');
}

console.log('\nAll updates done.');
