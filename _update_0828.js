const fs = require('fs');
const date = '2026-08-28T10:00:00+08:00';

const articles = [
  {slug:'ziwei-lucun-zai-qianyi', cnTitle:'禄存在迁移宫：在外财运稳，离乡发展有积蓄', enTitle:'Lu Cun in Travel Palace: Stable Wealth Outside', enDesc:'Lu Cun in Travel means stable wealth and savings away from home.'},
  {slug:'ziwei-lucun-zai-puyigong', cnTitle:'禄存在仆役宫：朋友中有有钱人，人脉带来财路', enTitle:'Lu Cun in Friends Palace: Wealthy Friends', enDesc:'Lu Cun in Friends means wealthy friends; connections bring income.'},
  {slug:'ziwei-lucun-zai-guanlugong', cnTitle:'禄存在官禄宫：事业收入稳定，适合金融财务行业', enTitle:'Lu Cun in Career Palace: Stable Career Income', enDesc:'Lu Cun in Career means stable income; suited to finance.'},
  {slug:'ziwei-lucun-zai-tianzhaigong', cnTitle:'禄存在田宅宫：家产丰厚，守财能力强', enTitle:'Lu Cun in Property Palace: Substantial Family Assets', enDesc:'Lu Cun in Property means substantial assets and strong wealth-keeping.'},
  {slug:'ziwei-lucun-zai-fudegong', cnTitle:'禄存在福德宫：福气厚、会享受，精神物质都不缺', enTitle:'Lu Cun in Fortune Palace: Deep Blessings', enDesc:'Lu Cun in Fortune means deep blessings and enjoyment; both spirit and matter fulfilled.'},
  {slug:'ziwei-lucun-zai-fumugong', cnTitle:'禄存在父母宫：父母有积蓄，长辈经济助力大', enTitle:'Lu Cun in Parents Palace: Parents Have Savings', enDesc:'Lu Cun in Parents means parents have savings and strong financial support.'},
  {slug:'ziwei-hongluan-zai-minggong', cnTitle:'红鸾在命宫：天生异性缘好，桃花运旺的人', enTitle:'Hong Luan in Life Palace: Born with Strong Romance', enDesc:'Hong Luan in Life means natural charm and strong romance luck.'},
  {slug:'ziwei-hongluan-zai-xiongdigong', cnTitle:'红鸾在兄弟宫：兄弟姐妹中有人桃花旺，同辈介绍对象', enTitle:'Hong Luan in Siblings Palace: A Sibling with Romance', enDesc:'Hong Luan in Siblings means a sibling with active romance and peer matchmaking.'},
  {slug:'ziwei-hongluan-zai-fuqigong', cnTitle:'红鸾在夫妻宫：婚姻缘分深，伴侣相貌好', enTitle:'Hong Luan in Spouse Palace: Deep Marriage Bond', enDesc:'Hong Luan in Spouse means deep marriage bond and attractive partner.'},
  {slug:'ziwei-hongluan-zai-zinvgong', cnTitle:'红鸾在子女宫：孩子相貌好，子女感情运顺', enTitle:'Hong Luan in Children Palace: Attractive Children', enDesc:'Hong Luan in Children means attractive children with smooth romance.'},
  {slug:'ziwei-hongluan-zai-caibogong', cnTitle:'红鸾在财帛宫：因异性得财，赚钱靠人脉', enTitle:'Hong Luan in Wealth Palace: Wealth Through Opposite Sex', enDesc:'Hong Luan in Wealth means earning through connections and opposite sex.'},
  {slug:'ziwei-hongluan-zai-jiegong', cnTitle:'红鸾在疾厄宫：注意肾脏和生殖系统，感情影响健康', enTitle:'Hong Luan in Health Palace: Kidneys and Reproductive System', enDesc:'Hong Luan in Health means watch kidneys; emotions affect health.'},
  {slug:'ziwei-hongluan-zai-qianyi', cnTitle:'红鸾在迁移宫：在外桃花运旺，离乡有姻缘', enTitle:'Hong Luan in Travel Palace: Strong Romance Outside', enDesc:'Hong Luan in Travel means romance and marriage destiny away from home.'},
  {slug:'ziwei-hongluan-zai-puyigong', cnTitle:'红鸾在仆役宫：朋友多异性，社交圈桃花旺', enTitle:'Hong Luan in Friends Palace: Many Opposite-Sex Friends', enDesc:'Hong Luan in Friends means many opposite-sex friends and active social romance.'},
  {slug:'ziwei-hongluan-zai-guanlugong', cnTitle:'红鸾在官禄宫：事业上靠异性缘，适合公关行业', enTitle:'Hong Luan in Career Palace: Career Through Charm', enDesc:'Hong Luan in Career means career through opposite-sex luck; suited to PR.'},
  {slug:'ziwei-hongluan-zai-tianzhaigong', cnTitle:'红鸾在田宅宫：家里有喜事，居家环境浪漫', enTitle:'Hong Luan in Property Palace: Happy Events at Home', enDesc:'Hong Luan in Property means home celebrations and romantic environment.'},
  {slug:'ziwei-hongluan-zai-fudegong', cnTitle:'红鸾在福德宫：精神上追求浪漫，感情生活丰富', enTitle:'Hong Luan in Fortune Palace: Romantic Spirit', enDesc:'Hong Luan in Fortune means romantic pursuits and rich emotional life.'},
  {slug:'ziwei-hongluan-zai-fumugong', cnTitle:'红鸾在父母宫：父母感情好，长辈婚姻美满', enTitle:'Hong Luan in Parents Palace: Loving Parents', enDesc:'Hong Luan in Parents means loving parents with happy marriage.'},
  {slug:'ziwei-tianxi-zai-minggong', cnTitle:'天喜在命宫：性格开朗逢凶化吉，一生多喜事', enTitle:'Tian Xi in Life Palace: Cheerful and Lucky', enDesc:'Tian Xi in Life means cheerful nature, turning misfortune to blessing.'},
  {slug:'ziwei-tianxi-zai-xiongdigong', cnTitle:'天喜在兄弟宫：兄弟姐妹中有开心果，同辈关系和睦', enTitle:'Tian Xi in Siblings Palace: A Joyful Sibling', enDesc:'Tian Xi in Siblings means a joyful sibling and harmonious peer relations.'},
  {slug:'ziwei-tianxi-zai-fuqigong', cnTitle:'天喜在夫妻宫：婚姻喜庆多，伴侣性格开朗', enTitle:'Tian Xi in Spouse Palace: Joyful Marriage', enDesc:'Tian Xi in Spouse means joyful marriage with cheerful partner.'},
  {slug:'ziwei-tianxi-zai-zinvgong', cnTitle:'天喜在子女宫：孩子带来喜事，子女活泼开朗', enTitle:'Tian Xi in Children Palace: Children Bring Joy', enDesc:'Tian Xi in Children means children bring happy events and are lively.'},
  {slug:'ziwei-tianxi-zai-caibogong', cnTitle:'天喜在财帛宫：赚钱开心，财运带喜气', enTitle:'Tian Xi in Wealth Palace: Earning Happily', enDesc:'Tian Xi in Wealth means joyful earning and wealth carrying happiness.'},
  {slug:'ziwei-tianxi-zai-jiegong', cnTitle:'天喜在疾厄宫：心情好病就少，注意饮食过量', enTitle:'Tian Xi in Health Palace: Good Mood Means Fewer Ills', enDesc:'Tian Xi in Health means good mood reduces illness; watch overeating.'},
  {slug:'ziwei-tianxi-zai-qianyi', cnTitle:'天喜在迁移宫：在外有喜事，离乡发展开心顺意', enTitle:'Tian Xi in Travel Palace: Happy Events Outside', enDesc:'Tian Xi in Travel means happy events and joyful development away.'},
  {slug:'ziwei-tianxi-zai-puyigong', cnTitle:'天喜在仆役宫：朋友多乐观派，社交圈欢乐多', enTitle:'Tian Xi in Friends Palace: Optimistic Friends', enDesc:'Tian Xi in Friends means optimistic friends and joyful social circle.'},
  {slug:'ziwei-tianxi-zai-guanlugong', cnTitle:'天喜在官禄宫：事业上有喜庆，升职加薪机会多', enTitle:'Tian Xi in Career Palace: Career Celebrations', enDesc:'Tian Xi in Career means celebrations and many promotion opportunities.'},
  {slug:'ziwei-tianxi-zai-tianzhaigong', cnTitle:'天喜在田宅宫：家里常有喜事，居家氛围欢乐', enTitle:'Tian Xi in Property Palace: Frequent Home Celebrations', enDesc:'Tian Xi in Property means frequent celebrations and joyful home atmosphere.'},
  {slug:'ziwei-tianxi-zai-fudegong', cnTitle:'天喜在福德宫：心态乐观，福气来自开心', enTitle:'Tian Xi in Fortune Palace: Optimistic Mindset', enDesc:'Tian Xi in Fortune means optimism; blessings come from happiness.'},
  {slug:'ziwei-tianxi-zai-fumugong', cnTitle:'天喜在父母宫：父母开朗，家庭氛围欢乐', enTitle:'Tian Xi in Parents Palace: Cheerful Parents', enDesc:'Tian Xi in Parents means cheerful parents and joyful family.'},
  {slug:'ziwei-xianchi-zai-minggong', cnTitle:'咸池在命宫：魅力十足但桃花复杂，感情要专一', enTitle:'Xian Chi in Life Palace: Irresistible Charm but Complex Romance', enDesc:'Xian Chi in Life means charm but complex romance; be faithful.'},
  {slug:'ziwei-xianchi-zai-xiongdigong', cnTitle:'咸池在兄弟宫：兄弟姐妹中有人桃花旺，感情纠纷多', enTitle:'Xian Chi in Siblings Palace: A Sibling with Active Romance', enDesc:'Xian Chi in Siblings means a sibling with romance disputes.'},
  {slug:'ziwei-xianchi-zai-fuqigong', cnTitle:'咸池在夫妻宫：感情里情欲重，要防烂桃花', enTitle:'Xian Chi in Spouse Palace: Strong Desire in Love', enDesc:'Xian Chi in Spouse means strong desire; beware bad romances.'},
  {slug:'ziwei-xianchi-zai-zinvgong', cnTitle:'咸池在子女宫：孩子早熟，教育要引导感情观', enTitle:'Xian Chi in Children Palace: Early-Maturing Children', enDesc:'Xian Chi in Children means early-maturing children; guide their love views.'},
  {slug:'ziwei-xianchi-zai-caibogong', cnTitle:'咸池在财帛宫：因桃花破财，花钱在异性身上', enTitle:'Xian Chi in Wealth Palace: Loss Through Romance', enDesc:'Xian Chi in Wealth means loss through romance and spending on opposite sex.'},
  {slug:'ziwei-xianchi-zai-jiegong', cnTitle:'咸池在疾厄宫：注意生殖系统，防感情伤身', enTitle:'Xian Chi in Health Palace: Watch Reproductive System', enDesc:'Xian Chi in Health means watch reproductive system; prevent emotional harm.'},
  {slug:'ziwei-xianchi-zai-qianyi', cnTitle:'咸池在迁移宫：在外桃花旺但多烂桃花，离乡防情伤', enTitle:'Xian Chi in Travel Palace: Intense but Toxic Romance', enDesc:'Xian Chi in Travel means intense but toxic romance; beware heartbreak.'},
  {slug:'ziwei-xianchi-zai-puyigong', cnTitle:'咸池在仆役宫：朋友中多酒色之友，社交要节制', enTitle:'Xian Chi in Friends Palace: Wine-and-Pleasure Friends', enDesc:'Xian Chi in Friends means pleasure-seeking friends; moderate socializing.'},
  {slug:'ziwei-xianchi-zai-guanlugong', cnTitle:'咸池在官禄宫：事业上靠魅力但防绯闻', enTitle:'Xian Chi in Career Palace: Career Through Charm but Beware Scandal', enDesc:'Xian Chi in Career means charm but beware scandal.'},
  {slug:'ziwei-xianchi-zai-tianzhaigong', cnTitle:'咸池在田宅宫：家里感情纠纷多，防婚外情', enTitle:'Xian Chi in Property Palace: Relationship Disputes at Home', enDesc:'Xian Chi in Property means disputes; beware infidelity.'}
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
              <div class="card-meta"><span class="tag">辅煞曜</span><span><time datetime="${date}">2026-08-28 10:00</time></span></div>
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
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-28 10:00</time></span></div>
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
    cards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${date}">2026-08-28</time></a>\n`;
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
    items += `  <item><title>${a.cnTitle}</title><link>https://yuetianai.com/articles/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid><pubDate>Fri, 28 Aug 2026 10:00:00 +0800</pubDate><description><![CDATA[${a.cnTitle}]]></description></item>\n`;
  }
  cnFeed = cnFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('feed.xml', cnFeed, 'utf8');
  console.log('  CN feed updated');
}

let enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
if (!enFeed.includes(articles[0].slug)) {
  let items = '';
  for (const a of articles) {
    items += `  <item><title>${a.enTitle}</title><link>https://yuetianai.com/articles/en/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid><pubDate>Fri, 28 Aug 2026 10:00:00 +0800</pubDate><description><![CDATA[${a.enTitle}]]></description></item>\n`;
  }
  enFeed = enFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('articles/en/feed.xml', enFeed, 'utf8');
  console.log('  EN feed updated');
}

console.log('\nAll updates done.');
