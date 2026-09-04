const fs = require('fs');
const date = '2026-08-27T10:00:00+08:00';

const articles = [
  {slug:'ziwei-dikong-zai-fuqigong', cnTitle:'地空在夫妻宫：感情里追求精神共鸣，物质条件看得淡', enTitle:'Di Kong in Spouse Palace: Seeks Spiritual Resonance', enDesc:'Di Kong in Spouse means spiritual resonance over material conditions.'},
  {slug:'ziwei-dikong-zai-zinvgong', cnTitle:'地空在子女宫：孩子缘分淡或聚少离多，创造力极强', enTitle:'Di Kong in Children Palace: Distant Children Bond', enDesc:'Di Kong in Children means distant bonds but extreme creativity.'},
  {slug:'ziwei-dikong-zai-caibogong', cnTitle:'地空在财帛宫：财运起伏大，投资容易落空', enTitle:'Di Kong in Wealth Palace: Volatile Wealth', enDesc:'Di Kong in Wealth means volatile wealth and investments fall through.'},
  {slug:'ziwei-dikong-zai-jiegong', cnTitle:'地空在疾厄宫：注意脾胃和精神健康，不要想太多', enTitle:'Di Kong in Health Palace: Spleen and Mental Health', enDesc:'Di Kong in Health means watch spleen and mental health; do not overthink.'},
  {slug:'ziwei-dikong-zai-qianyi', cnTitle:'地空在迁移宫：在外发展多变动，离乡反而有机遇', enTitle:'Di Kong in Travel Palace: Changes Outside', enDesc:'Di Kong in Travel means changes outside; leaving brings opportunities.'},
  {slug:'ziwei-dikong-zai-puyigong', cnTitle:'地空在仆役宫：朋友缘分淡，社交圈不固定', enTitle:'Di Kong in Friends Palace: Weak Friend Bonds', enDesc:'Di Kong in Friends means weak bonds and unstable social circle.'},
  {slug:'ziwei-dikong-zai-guanlugong', cnTitle:'地空在官禄宫：事业上适合创意和灵性行业', enTitle:'Di Kong in Career Palace: Creative and Spiritual Fields', enDesc:'Di Kong in Career suits creative and spiritual industries.'},
  {slug:'ziwei-dikong-zai-tianzhaigong', cnTitle:'地空在田宅宫：房产运不稳，家里容易有空置感', enTitle:'Di Kong in Property Palace: Unstable Property Luck', enDesc:'Di Kong in Property means unstable luck and empty home feeling.'},
  {slug:'ziwei-dikong-zai-fudegong', cnTitle:'地空在福德宫：精神追求高，对物质享受没兴趣', enTitle:'Di Kong in Fortune Palace: High Spiritual Pursuits', enDesc:'Di Kong in Fortune means high spiritual pursuits, little material interest.'},
  {slug:'ziwei-dikong-zai-fumugong', cnTitle:'地空在父母宫：与父母缘分淡，长辈助力有限', enTitle:'Di Kong in Parents Palace: Weak Parental Bonds', enDesc:'Di Kong in Parents means weak bonds and limited elder support.'},
  {slug:'ziwei-dijie-zai-minggong', cnTitle:'地劫在命宫：性格叛逆敢冒险，人生大起大落', enTitle:'Di Jie in Life Palace: Rebellious and Daring', enDesc:'Di Jie in Life means rebellious, daring with major ups and downs.'},
  {slug:'ziwei-dijie-zai-xiongdigong', cnTitle:'地劫在兄弟宫：兄弟姐妹中有破财者，资金周转防被骗', enTitle:'Di Jie in Siblings Palace: A Sibling with Losses', enDesc:'Di Jie in Siblings means a sibling with losses; beware fraud.'},
  {slug:'ziwei-dijie-zai-fuqigong', cnTitle:'地劫在夫妻宫：感情里有突发变故，伴侣可能有冒险倾向', enTitle:'Di Jie in Spouse Palace: Sudden Changes in Love', enDesc:'Di Jie in Spouse means sudden changes; partner may be risk-taking.'},
  {slug:'ziwei-dijie-zai-zinvgong', cnTitle:'地劫在子女宫：孩子叛逆独立，教育要防意外破财', enTitle:'Di Jie in Children Palace: Rebellious Children', enDesc:'Di Jie in Children means rebellious children; prevent accidental loss.'},
  {slug:'ziwei-dijie-zai-caibogong', cnTitle:'地劫在财帛宫：财运波动大，容易突发破财', enTitle:'Di Jie in Wealth Palace: Highly Volatile Wealth', enDesc:'Di Jie in Wealth means volatile wealth and sudden losses.'},
  {slug:'ziwei-dijie-zai-jiegong', cnTitle:'地劫在疾厄宫：注意意外伤灾，运动和出行要小心', enTitle:'Di Jie in Health Palace: Watch Accidents', enDesc:'Di Jie in Health means watch accidents; be careful in sports and travel.'},
  {slug:'ziwei-dijie-zai-qianyi', cnTitle:'地劫在迁移宫：在外防被骗被劫，离乡要谨慎', enTitle:'Di Jie in Travel Palace: Beware Fraud Outside', enDesc:'Di Jie in Travel means beware fraud and robbery outside.'},
  {slug:'ziwei-dijie-zai-puyigong', cnTitle:'地劫在仆役宫：朋友中有人会让你破财，合伙要防', enTitle:'Di Jie in Friends Palace: A Friend May Cause Loss', enDesc:'Di Jie in Friends means a friend may cause loss; prevent partnership risks.'},
  {slug:'ziwei-dijie-zai-guanlugong', cnTitle:'地劫在官禄宫：事业上敢闯敢拼，但要防重大失误', enTitle:'Di Jie in Career Palace: Bold but Beware Mistakes', enDesc:'Di Jie in Career means bold but beware major mistakes.'},
  {slug:'ziwei-dijie-zai-tianzhaigong', cnTitle:'地劫在田宅宫：房产家事有突发变故，防失窃', enTitle:'Di Jie in Property Palace: Sudden Changes, Theft', enDesc:'Di Jie in Property means sudden changes; prevent theft.'},
  {slug:'ziwei-dijie-zai-fudegong', cnTitle:'地劫在福德宫：精神上容易空虚，寻找信仰是出路', enTitle:'Di Jie in Fortune Palace: Prone to Emptiness', enDesc:'Di Jie in Fortune means emptiness; finding faith is the way out.'},
  {slug:'ziwei-dijie-zai-fumugong', cnTitle:'地劫在父母宫：与父母缘分有突变，长辈健康要关注', enTitle:'Di Jie in Parents Palace: Sudden Changes', enDesc:'Di Jie in Parents means sudden changes; watch elder health.'},
  {slug:'ziwei-tianma-zai-minggong', cnTitle:'天马在命宫：一生奔波动中求财，闲不住的人', enTitle:'Tian Ma in Life Palace: A Life of Movement', enDesc:'Tian Ma in Life means movement and earning through motion.'},
  {slug:'ziwei-tianma-zai-xiongdigong', cnTitle:'天马在兄弟宫：兄弟姐妹在外地，资金周转靠流动', enTitle:'Tian Ma in Siblings Palace: Siblings in Other Cities', enDesc:'Tian Ma in Siblings means siblings away; cash flow through mobility.'},
  {slug:'ziwei-tianma-zai-fuqigong', cnTitle:'天马在夫妻宫：伴侣可能是外地人，感情多变动', enTitle:'Tian Ma in Spouse Palace: Partner from Elsewhere', enDesc:'Tian Ma in Spouse means partner from elsewhere; changing relationships.'},
  {slug:'ziwei-tianma-zai-zinvgong', cnTitle:'天马在子女宫：孩子长大后远行，子女在外地发展', enTitle:'Tian Ma in Children Palace: Children Travel Far', enDesc:'Tian Ma in Children means children travel far and develop away.'},
  {slug:'ziwei-tianma-zai-caibogong', cnTitle:'天马在财帛宫：收入靠跑动和出差，动中求财', enTitle:'Tian Ma in Wealth Palace: Income Through Travel', enDesc:'Tian Ma in Wealth means income through travel and movement.'},
  {slug:'ziwei-tianma-zai-jiegong', cnTitle:'天马在疾厄宫：注意神经系统和四肢，运动有益', enTitle:'Tian Ma in Health Palace: Nervous System and Limbs', enDesc:'Tian Ma in Health means watch nervous system; exercise is beneficial.'},
  {slug:'ziwei-tianma-zai-qianyi', cnTitle:'天马在迁移宫：最适合外出发展，离乡越远越有机遇', enTitle:'Tian Ma in Travel Palace: Best Suited to Outside', enDesc:'Tian Ma in Travel means developing outside; farther means more opportunity.'},
  {slug:'ziwei-tianma-zai-puyigong', cnTitle:'天马在仆役宫：朋友遍布各地，社交圈广', enTitle:'Tian Ma in Friends Palace: Friends Everywhere', enDesc:'Tian Ma in Friends means friends everywhere with wide social circle.'},
  {slug:'ziwei-tianma-zai-guanlugong', cnTitle:'天马在官禄宫：事业适合出差、外贸、物流等动的行业', enTitle:'Tian Ma in Career Palace: Travel, Trade, Logistics', enDesc:'Tian Ma in Career suits travel, trade, logistics and moving industries.'},
  {slug:'ziwei-tianma-zai-tianzhaigong', cnTitle:'天马在田宅宫：经常搬家或装修，居家环境多变', enTitle:'Tian Ma in Property Palace: Frequent Moves', enDesc:'Tian Ma in Property means frequent moves or renovations.'},
  {slug:'ziwei-tianma-zai-fudegong', cnTitle:'天马在福德宫：精神上追求自由，不喜欢被束缚', enTitle:'Tian Ma in Fortune Palace: Seeks Freedom', enDesc:'Tian Ma in Fortune means seeking freedom and hating being tied down.'},
  {slug:'ziwei-tianma-zai-fumugong', cnTitle:'天马在父母宫：父母在外地或经常走动，长辈缘在远方', enTitle:'Tian Ma in Parents Palace: Parents Away or Traveling', enDesc:'Tian Ma in Parents means parents away; elder bonds from afar.'},
  {slug:'ziwei-lucun-zai-minggong', cnTitle:'禄存在命宫：天生会理财，性格谨慎稳重', enTitle:'Lu Cun in Life Palace: Born Financial Manager', enDesc:'Lu Cun in Life means born financial manager, cautious and steady.'},
  {slug:'ziwei-lucun-zai-xiongdigong', cnTitle:'禄存在兄弟宫：兄弟姐妹经济条件好，资金有后盾', enTitle:'Lu Cun in Siblings Palace: Siblings in Good Shape', enDesc:'Lu Cun in Siblings means siblings with good finances and backing.'},
  {slug:'ziwei-lucun-zai-fuqigong', cnTitle:'禄存在夫妻宫：伴侣会理财，婚姻经济稳定', enTitle:'Lu Cun in Spouse Palace: Partner Manages Money Well', enDesc:'Lu Cun in Spouse means a financially savvy partner and stable marriage.'},
  {slug:'ziwei-lucun-zai-zinvgong', cnTitle:'禄存在子女宫：孩子有财福，教育上重视理财', enTitle:'Lu Cun in Children Palace: Children with Fortune', enDesc:'Lu Cun in Children means children with fortune; value financial education.'},
  {slug:'ziwei-lucun-zai-caibogong', cnTitle:'禄存在财帛宫：财运最稳的位置之一，能赚能守', enTitle:'Lu Cun in Wealth Palace: One of the Steadiest Positions', enDesc:'Lu Cun in Wealth is one of the steadiest; earns and keeps.'},
  {slug:'ziwei-lucun-zai-jiegong', cnTitle:'禄存在疾厄宫：注意脾胃和饮食，有口福但要节制', enTitle:'Lu Cun in Health Palace: Spleen and Diet', enDesc:'Lu Cun in Health means watch spleen and diet; loves food but moderate.'}
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
              <div class="card-meta"><span class="tag">辅煞曜</span><span><time datetime="${date}">2026-08-27 10:00</time></span></div>
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
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-27 10:00</time></span></div>
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
    cards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${date}">2026-08-27</time></a>\n`;
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
    items += `  <item><title>${a.cnTitle}</title><link>https://yuetianai.com/articles/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid><pubDate>Thu, 27 Aug 2026 10:00:00 +0800</pubDate><description><![CDATA[${a.cnTitle}]]></description></item>\n`;
  }
  cnFeed = cnFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('feed.xml', cnFeed, 'utf8');
  console.log('  CN feed updated');
}

let enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
if (!enFeed.includes(articles[0].slug)) {
  let items = '';
  for (const a of articles) {
    items += `  <item><title>${a.enTitle}</title><link>https://yuetianai.com/articles/en/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid><pubDate>Thu, 27 Aug 2026 10:00:00 +0800</pubDate><description><![CDATA[${a.enTitle}]]></description></item>\n`;
  }
  enFeed = enFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('articles/en/feed.xml', enFeed, 'utf8');
  console.log('  EN feed updated');
}

console.log('\nAll updates done.');
