const fs = require('fs');
const date = '2026-08-29T10:00:00+08:00';

const articles = [
  {slug:'ziwei-xianchi-zai-fudegong', cnTitle:'咸池在福德宫：精神上追求刺激，感情享受要适度', enTitle:'Xian Chi in Fortune Palace: Seeks Excitement Mentally', enDesc:'Xian Chi in Fortune means seeking mental excitement; moderate romantic pleasure.'},
  {slug:'ziwei-xianchi-zai-fumugong', cnTitle:'咸池在父母宫：长辈感情复杂，家庭桃花要防纠纷', enTitle:'Xian Chi in Parents Palace: Complex Elder Romance', enDesc:'Xian Chi in Parents means complex elder romance; prevent family disputes.'},
  {slug:'ziwei-tianyao-zai-minggong', cnTitle:'天姚在命宫：口才好善交际，魅力十足的谋略型人格', enTitle:'Tian Yao in Life Palace: Eloquent and Charming', enDesc:'Tian Yao in Life means eloquence, sociability, and strategic charm.'},
  {slug:'ziwei-tianyao-zai-xiongdigong', cnTitle:'天姚在兄弟宫：兄弟姐妹中有人善交际，同辈多口舌', enTitle:'Tian Yao in Siblings Palace: A Sociable Sibling', enDesc:'Tian Yao in Siblings means a sociable sibling and peer gossip.'},
  {slug:'ziwei-tianyao-zai-fuqigong', cnTitle:'天姚在夫妻宫：伴侣口才好善交际，感情要防暧昧', enTitle:'Tian Yao in Spouse Palace: Eloquent Partner', enDesc:'Tian Yao in Spouse means an eloquent partner; beware ambiguity.'},
  {slug:'ziwei-tianyao-zai-zinvgong', cnTitle:'天姚在子女宫：孩子聪明善表达，教育要引导口才', enTitle:'Tian Yao in Children Palace: Bright Articulate Children', enDesc:'Tian Yao in Children means bright, articulate children; guide their eloquence.'},
  {slug:'ziwei-tianyao-zai-caibogong', cnTitle:'天姚在财帛宫：靠口才和交际赚钱，适合销售公关', enTitle:'Tian Yao in Wealth Palace: Earn Through Eloquence', enDesc:'Tian Yao in Wealth means earning through eloquence; suited to sales and PR.'},
  {slug:'ziwei-tianyao-zai-jiegong', cnTitle:'天姚在疾厄宫：注意泌尿生殖系统，防口舌伤身', enTitle:'Tian Yao in Health Palace: Watch Urinary System', enDesc:'Tian Yao in Health means watch urinary system; prevent gossip-related stress.'},
  {slug:'ziwei-tianyao-zai-qianyi', cnTitle:'天姚在迁移宫：在外善交际人缘好，离乡靠口才发展', enTitle:'Tian Yao in Travel Palace: Sociable Outside', enDesc:'Tian Yao in Travel means sociable and popular; develop away through eloquence.'},
  {slug:'ziwei-tianyao-zai-puyigong', cnTitle:'天姚在仆役宫：朋友多善交际之人，社交圈复杂', enTitle:'Tian Yao in Friends Palace: Sociable Friends', enDesc:'Tian Yao in Friends means sociable friends and complex social circle.'},
  {slug:'ziwei-tianyao-zai-guanlugong', cnTitle:'天姚在官禄宫：事业靠口才谋略，适合公关外交行业', enTitle:'Tian Yao in Career Palace: Career Through Eloquence', enDesc:'Tian Yao in Career means career through eloquence; suited to PR and diplomacy.'},
  {slug:'ziwei-tianyao-zai-tianzhaigong', cnTitle:'天姚在田宅宫：家里多交际应酬，居家环境有格调', enTitle:'Tian Yao in Property Palace: Home Full of Gatherings', enDesc:'Tian Yao in Property means social gatherings at home and stylish environment.'},
  {slug:'ziwei-tianyao-zai-fudegong', cnTitle:'天姚在福德宫：精神追求丰富，口才带来精神享受', enTitle:'Tian Yao in Fortune Palace: Rich Mental Pursuits', enDesc:'Tian Yao in Fortune means rich mental pursuits; eloquence brings joy.'},
  {slug:'ziwei-tianyao-zai-fumugong', cnTitle:'天姚在父母宫：父母善表达，长辈中有人口才好', enTitle:'Tian Yao in Parents Palace: Articulate Parents', enDesc:'Tian Yao in Parents means articulate parents and an eloquent elder.'},
  {slug:'ziwei-guchen-zai-minggong', cnTitle:'孤辰在命宫：性格独立不依赖人，天生自带孤克气质', enTitle:'Gu Chen in Life Palace: Independent and Self-Reliant', enDesc:'Gu Chen in Life means independence, self-reliance, and natural solitude.'},
  {slug:'ziwei-guchen-zai-xiongdigong', cnTitle:'孤辰在兄弟宫：兄弟姐妹缘分淡，同辈关系疏远', enTitle:'Gu Chen in Siblings Palace: Thin Sibling Bond', enDesc:'Gu Chen in Siblings means thin sibling bond and distant peer relations.'},
  {slug:'ziwei-guchen-zai-fuqigong', cnTitle:'孤辰在夫妻宫：感情里容易孤独，伴侣关系需主动经营', enTitle:'Gu Chen in Spouse Palace: Loneliness in Love', enDesc:'Gu Chen in Spouse means loneliness in love; actively nurture the bond.'},
  {slug:'ziwei-guchen-zai-zinvgong', cnTitle:'孤辰在子女宫：子女独立性强，亲子缘分偏淡', enTitle:'Gu Chen in Children Palace: Independent Children', enDesc:'Gu Chen in Children means independent children and thin parent-child bond.'},
  {slug:'ziwei-guchen-zai-caibogong', cnTitle:'孤辰在财帛宫：赚钱靠自己，不依赖他人资助', enTitle:'Gu Chen in Wealth Palace: Earn Independently', enDesc:'Gu Chen in Wealth means earning independently without reliance on others.'},
  {slug:'ziwei-guchen-zai-jiegong', cnTitle:'孤辰在疾厄宫：注意精神孤独影响健康，多社交', enTitle:'Gu Chen in Health Palace: Loneliness Affecting Health', enDesc:'Gu Chen in Health means watch loneliness affecting health; socialize more.'},
  {slug:'ziwei-guchen-zai-qianyi', cnTitle:'孤辰在迁移宫：在外独立打拼，离乡发展靠自己', enTitle:'Gu Chen in Travel Palace: Strive Independently Outside', enDesc:'Gu Chen in Travel means striving independently away from home.'},
  {slug:'ziwei-guchen-zai-puyigong', cnTitle:'孤辰在仆役宫：朋友少而精，社交圈独立', enTitle:'Gu Chen in Friends Palace: Few but Quality Friends', enDesc:'Gu Chen in Friends means few but quality friends and independent social circle.'},
  {slug:'ziwei-guchen-zai-guanlugong', cnTitle:'孤辰在官禄宫：事业独立创业，不适合合伙', enTitle:'Gu Chen in Career Palace: Independent Career', enDesc:'Gu Chen in Career means independent career; not suited to partnership.'},
  {slug:'ziwei-guchen-zai-tianzhaigong', cnTitle:'孤辰在田宅宫：喜欢独居空间，房产靠自己买', enTitle:'Gu Chen in Property Palace: Values Personal Space', enDesc:'Gu Chen in Property means valuing personal space and buying property independently.'},
  {slug:'ziwei-guchen-zai-fudegong', cnTitle:'孤辰在福德宫：内心孤独但自律，精神世界独立', enTitle:'Gu Chen in Fortune Palace: Lonely but Disciplined', enDesc:'Gu Chen in Fortune means lonely but disciplined with independent inner world.'},
  {slug:'ziwei-guchen-zai-fumugong', cnTitle:'孤辰在父母宫：父母缘分偏淡，长辈助力少', enTitle:'Gu Chen in Parents Palace: Thin Parent Bond', enDesc:'Gu Chen in Parents means thin parent bond and little elder support.'},
  {slug:'ziwei-guasu-zai-minggong', cnTitle:'寡宿在命宫：性格清冷不喜热闹，天生带疏离感', enTitle:'Gua Su in Life Palace: Cool and Reserved', enDesc:'Gua Su in Life means cool temperament and natural detachment.'},
  {slug:'ziwei-guasu-zai-xiongdigong', cnTitle:'寡宿在兄弟宫：兄弟姐妹关系冷淡，同辈往来少', enTitle:'Gua Su in Siblings Palace: Distant Sibling Relations', enDesc:'Gua Su in Siblings means distant relations and few peer interactions.'},
  {slug:'ziwei-guasu-zai-fuqigong', cnTitle:'寡宿在夫妻宫：感情淡薄婚姻缘浅，需要主动经营', enTitle:'Gua Su in Spouse Palace: Thin Emotional Bond', enDesc:'Gua Su in Spouse means thin emotional bond; actively nurture marriage.'},
  {slug:'ziwei-guasu-zai-zinvgong', cnTitle:'寡宿在子女宫：子女性格安静，亲子关系清淡', enTitle:'Gua Su in Children Palace: Quiet Children', enDesc:'Gua Su in Children means quiet children and calm parent-child relationship.'},
  {slug:'ziwei-guasu-zai-caibogong', cnTitle:'寡宿在财帛宫：财运清淡不贪多，赚钱靠专注', enTitle:'Gua Su in Wealth Palace: Modest Wealth', enDesc:'Gua Su in Wealth means modest wealth and earning through focus.'},
  {slug:'ziwei-guasu-zai-jiegong', cnTitle:'寡宿在疾厄宫：注意情绪郁结，独处要适度', enTitle:'Gua Su in Health Palace: Watch Emotional Stagnation', enDesc:'Gua Su in Health means watch emotional stagnation; moderate solitude.'},
  {slug:'ziwei-guasu-zai-qianyi', cnTitle:'寡宿在迁移宫：在外不喜交际，离乡发展偏安静', enTitle:'Gua Su in Travel Palace: Dislikes Socializing Outside', enDesc:'Gua Su in Travel means dislikes socializing; quiet development away.'},
  {slug:'ziwei-guasu-zai-puyigong', cnTitle:'寡宿在仆役宫：朋友不多，社交圈清净', enTitle:'Gua Su in Friends Palace: Few Friends', enDesc:'Gua Su in Friends means few friends and quiet social circle.'},
  {slug:'ziwei-guasu-zai-guanlugong', cnTitle:'寡宿在官禄宫：事业适合独立研究型工作', enTitle:'Gua Su in Career Palace: Suited to Independent Research', enDesc:'Gua Su in Career means suited to independent research work.'},
  {slug:'ziwei-guasu-zai-tianzhaigong', cnTitle:'寡宿在田宅宫：居家环境清净，喜欢简单布置', enTitle:'Gua Su in Property Palace: Quiet Home', enDesc:'Gua Su in Property means quiet home and simple decor preferences.'},
  {slug:'ziwei-guasu-zai-fudegong', cnTitle:'寡宿在福德宫：精神内省追求清净，福气来自独处', enTitle:'Gua Su in Fortune Palace: Introspective and Serene', enDesc:'Gua Su in Fortune means introspective; blessings from solitude.'},
  {slug:'ziwei-guasu-zai-fumugong', cnTitle:'寡宿在父母宫：父母性格安静，家庭氛围清淡', enTitle:'Gua Su in Parents Palace: Quiet Parents', enDesc:'Gua Su in Parents means quiet parents and calm family atmosphere.'},
  {slug:'ziwei-huagai-zai-minggong', cnTitle:'华盖在命宫：气质孤高有艺术天赋，悟性极高', enTitle:'Hua Gai in Life Palace: Dignified Artistic Talent', enDesc:'Hua Gai in Life means dignified bearing, artistic talent, and exceptional insight.'},
  {slug:'ziwei-huagai-zai-xiongdigong', cnTitle:'华盖在兄弟宫：兄弟姐妹中有人有艺术天赋', enTitle:'Hua Gai in Siblings Palace: A Sibling with Artistic Talent', enDesc:'Hua Gai in Siblings means a sibling with artistic talent.'}
];

// 1. Update CN index
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
              <div class="card-meta"><span class="tag">辅煞曜</span><span><time datetime="${date}">2026-08-29 10:00</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;
  }
  cnIndex = cnIndex.slice(0, insertPos) + cards + cnIndex.slice(insertPos);
  const countMatch = cnIndex.substring(auxH2Idx).match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) cnIndex = cnIndex.substring(0, auxH2Idx) + cnIndex.substring(auxH2Idx).replace(countMatch[0], `<span>${parseInt(countMatch[1])+40} 篇</span>`);
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
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-29 10:00</time></span></div>
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
    cards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${date}">2026-08-29</time></a>\n`;
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
    items += `  <item><title>${a.cnTitle}</title><link>https://yuetianai.com/articles/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid><pubDate>Sat, 29 Aug 2026 10:00:00 +0800</pubDate><description><![CDATA[${a.cnTitle}]]></description></item>\n`;
  }
  cnFeed = cnFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('feed.xml', cnFeed, 'utf8');
  console.log('  CN feed updated');
}

let enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
if (!enFeed.includes(articles[0].slug)) {
  let items = '';
  for (const a of articles) {
    items += `  <item><title>${a.enTitle}</title><link>https://yuetianai.com/articles/en/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid><pubDate>Sat, 29 Aug 2026 10:00:00 +0800</pubDate><description><![CDATA[${a.enTitle}]]></description></item>\n`;
  }
  enFeed = enFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('articles/en/feed.xml', enFeed, 'utf8');
  console.log('  EN feed updated');
}

console.log('\nAll updates done.');
