const fs = require('fs');
const dateFull = '2026-08-23T10:30:00+08:00';

const articles = [
  {slug:'ziwei-tianfu-zai-puyigong', cnTitle:'天府在仆役宫：用人稳字当头，朋友圈是你的资源库', enTitle:'Tian Fu in Friends Palace: Steady Hiring — Friends as a Resource Bank', enDesc:'Tian Fu in Friends means steady, reliable friends who form a resource bank.'},
  {slug:'ziwei-tianfu-zai-guanlugong', cnTitle:'天府在官禄宫：稳坐中军帐，适合管理和守成型事业', enTitle:'Tian Fu in Career Palace: Commanding the Center', enDesc:'Tian Fu in Career suits management and preservation-oriented careers.'},
  {slug:'ziwei-tianfu-zai-tianzhaigong', cnTitle:'天府在田宅宫：财库坐田宅，房产运最厚的位置之一', enTitle:'Tian Fu in Property Palace: Treasury in Property', enDesc:'Tian Fu in Property is one of the strongest positions for real estate luck.'},
  {slug:'ziwei-tianfu-zai-fudegong', cnTitle:'天府在福德宫：心态稳福气厚，但要防过于安逸', enTitle:'Tian Fu in Fortune Palace: Stable Mind, Thick Blessings', enDesc:'Tian Fu in Fortune brings stability and blessings; guard against complacency.'},
  {slug:'ziwei-tianfu-zai-fumugong', cnTitle:'天府在父母宫：父母是靠山，长辈给你底气和资源', enTitle:'Tian Fu in Parents Palace: Parents as Backing', enDesc:'Tian Fu in Parents means parents provide confidence, resources, and support.'},
  {slug:'ziwei-taiyin-zai-minggong', cnTitle:'太阴在命宫：月亮坐命：温柔细腻但需要安全感的人', enTitle:'Tai Yin in Life Palace: The Moon in Life', enDesc:'Tai Yin in Life gives a gentle, sensitive nature that needs security.'},
  {slug:'ziwei-taiyin-zai-xiongdigong', cnTitle:'太阴在兄弟宫：姐妹缘深，同辈中有人默默帮你', enTitle:'Tai Yin in Siblings Palace: Strong Sister Bonds', enDesc:'Tai Yin in Siblings brings deep bonds with sisters and quiet peer support.'},
  {slug:'ziwei-taiyin-zai-fuqigong', cnTitle:'太阴在夫妻宫：伴侣温柔顾家，感情里要的是安全感', enTitle:'Tai Yin in Spouse Palace: A Gentle, Home-Loving Partner', enDesc:'Tai Yin in Spouse means a gentle, home-loving partner who values security.'},
  {slug:'ziwei-taiyin-zai-zinvgong', cnTitle:'太阴在子女宫：女儿缘深，孩子贴心懂事', enTitle:'Tai Yin in Children Palace: Strong Daughter Luck', enDesc:'Tai Yin in Children means close bonds with thoughtful, considerate children.'},
  {slug:'ziwei-taiyin-zai-caibogong', cnTitle:'太阴在财帛宫：间接财运好，靠房产、储蓄和女性贵人赚钱', enTitle:'Tai Yin in Wealth Palace: Indirect Wealth', enDesc:'Tai Yin in Wealth brings indirect income through property, savings, and female benefactors.'},
  {slug:'ziwei-taiyin-zai-jiegong', cnTitle:'太阴在疾厄宫：注意脾胃和妇科，情绪是健康的晴雨表', enTitle:'Tai Yin in Health Palace: Spleen/Stomach and Gynecology', enDesc:'Tai Yin in Health calls attention to digestion and gynecology; emotions are the barometer.'},
  {slug:'ziwei-taiyin-zai-qianyi', cnTitle:'太阴在迁移宫：在外有女性贵人，离乡发展越走越稳', enTitle:'Tai Yin in Travel Palace: Female Benefactors Outside', enDesc:'Tai Yin in Travel means female benefactors away from home and increasing stability.'},
  {slug:'ziwei-taiyin-zai-puyigong', cnTitle:'太阴在仆役宫：朋友多为温和型，闺蜜比兄弟靠谱', enTitle:'Tai Yin in Friends Palace: Gentle Friends', enDesc:'Tai Yin in Friends brings mostly gentle friends; close female friends are most reliable.'},
  {slug:'ziwei-taiyin-zai-guanlugong', cnTitle:'太阴在官禄宫：适合稳定、细致、跟美有关的工作', enTitle:'Tai Yin in Career Palace: Stable, Detailed, Beauty-Related Work', enDesc:'Tai Yin in Career suits stable, detailed, beauty-related professions.'},
  {slug:'ziwei-taiyin-zai-tianzhaigong', cnTitle:'太阴在田宅宫：田宅主坐田宅，房产运极佳', enTitle:'Tai Yin in Property Palace: Property Ruler in Property', enDesc:'Tai Yin in Property is excellent for real estate and home ownership.'},
  {slug:'ziwei-taiyin-zai-fudegong', cnTitle:'太阴在福德宫：内心细腻浪漫，精神世界丰富', enTitle:'Tai Yin in Fortune Palace: A Delicate, Romantic Inner World', enDesc:'Tai Yin in Fortune gives a rich inner life with delicate romantic sensibility.'},
  {slug:'ziwei-taiyin-zai-fumugong', cnTitle:'太阴在父母宫：母亲影响深，长辈缘好但容易依赖', enTitle:'Tai Yin in Parents Palace: Deep Mother Influence', enDesc:'Tai Yin in Parents means deep mother influence and good elder luck with dependence risk.'},
  {slug:'ziwei-tanlang-zai-minggong', cnTitle:'贪狼在命宫：桃花星坐命：多才多艺、欲望旺盛的社交高手', enTitle:'Tan Lang in Life Palace: The Peach-Blossom Star in Life', enDesc:'Tan Lang in Life gives versatility, strong desires, and social expertise.'},
  {slug:'ziwei-tanlang-zai-xiongdigong', cnTitle:'贪狼在兄弟宫：朋友三教九流，兄弟中有人很会来事', enTitle:'Tan Lang in Siblings Palace: A Wide Range of Friends', enDesc:'Tan Lang in Siblings brings a diverse social circle and savvy siblings.'},
  {slug:'ziwei-tanlang-zai-fuqigong', cnTitle:'贪狼在夫妻宫：感情多姿多彩，但要防花心和诱惑', enTitle:'Tan Lang in Spouse Palace: Colorful Relationships', enDesc:'Tan Lang in Spouse brings colorful relationships; guard against distraction.'},
  {slug:'ziwei-tanlang-zai-zinvgong', cnTitle:'贪狼在子女宫：孩子聪明活泼，教育要引导专注力', enTitle:'Tan Lang in Children Palace: Bright, Lively Children', enDesc:'Tan Lang in Children means bright, lively children; guide their focus.'},
  {slug:'ziwei-tanlang-zai-caibogong', cnTitle:'贪狼在财帛宫：赚钱路子广，偏财运和交际财强', enTitle:'Tan Lang in Wealth Palace: Many Income Paths', enDesc:'Tan Lang in Wealth brings many income paths with strong windfall and networking wealth.'},
  {slug:'ziwei-tanlang-zai-jiegong', cnTitle:'贪狼在疾厄宫：注意肝胆和泌尿系统，节制是关键', enTitle:'Tan Lang in Health Palace: Liver/Gallbladder and Urinary System', enDesc:'Tan Lang in Health calls attention to liver/gallbladder and urinary system; moderation is key.'},
  {slug:'ziwei-tanlang-zai-qianyi', cnTitle:'贪狼在迁移宫：在外如鱼得水，外出机会多应酬多', enTitle:'Tan Lang in Travel Palace: Thriving Outside', enDesc:'Tan Lang in Travel means thriving outside with many opportunities and social events.'},
  {slug:'ziwei-tanlang-zai-puyigong', cnTitle:'贪狼在仆役宫：朋友圈就是你的资源网，但要防酒肉朋友', enTitle:'Tan Lang in Friends Palace: Social Circle as Resource Net', enDesc:'Tan Lang in Friends means your social circle is a resource net; beware fair-weather friends.'},
  {slug:'ziwei-tanlang-zai-guanlugong', cnTitle:'贪狼在官禄宫：适合公关、销售、娱乐等跟人打交道的行业', enTitle:'Tan Lang in Career Palace: People-Facing Fields', enDesc:'Tan Lang in Career suits PR, sales, entertainment, and other people-facing fields.'},
  {slug:'ziwei-tanlang-zai-tianzhaigong', cnTitle:'贪狼在田宅宫：家里待不住，喜欢装修和改变居家环境', enTitle:'Tan Lang in Property Palace: Cannot Stay Still at Home', enDesc:'Tan Lang in Property means restlessness at home and love of renovation and change.'},
  {slug:'ziwei-tanlang-zai-fudegong', cnTitle:'贪狼在福德宫：享受型人格，舍得为快乐花钱', enTitle:'Tan Lang in Fortune Palace: Enjoyment-Oriented', enDesc:'Tan Lang in Fortune means enjoyment-oriented personality willing to spend on pleasure.'},
  {slug:'ziwei-tanlang-zai-fumugong', cnTitle:'贪狼在父母宫：父母中有人善交际，家庭氛围活跃', enTitle:'Tan Lang in Parents Palace: A Sociable Parent', enDesc:'Tan Lang in Parents means a sociable parent and lively family atmosphere.'},
  {slug:'ziwei-jumen-zai-minggong', cnTitle:'巨门在命宫：暗星坐命：口才犀利、心思缜密的质疑者', enTitle:'Ju Men in Life Palace: The Dark Star in Life', enDesc:'Ju Men in Life gives eloquence, meticulous thinking, and a questioning nature.'},
  {slug:'ziwei-jumen-zai-xiongdigong', cnTitle:'巨门在兄弟宫：兄弟姐妹中有人爱说话，容易拌嘴', enTitle:'Ju Men in Siblings Palace: A Talkative Sibling', enDesc:'Ju Men in Siblings brings a talkative sibling with whom arguments are common.'},
  {slug:'ziwei-jumen-zai-fuqigong', cnTitle:'巨门在夫妻宫：感情里沟通是关键，吵不散的才是真感情', enTitle:'Ju Men in Spouse Palace: Communication Is Key', enDesc:'Ju Men in Spouse means communication is essential; surviving fights means real bond.'},
  {slug:'ziwei-jumen-zai-zinvgong', cnTitle:'巨门在子女宫：孩子能言善辩，教育要引导正面表达', enTitle:'Ju Men in Children Palace: Articulate Children', enDesc:'Ju Men in Children means articulate children; guide positive expression.'},
  {slug:'ziwei-jumen-zai-caibogong', cnTitle:'巨门在财帛宫：靠口才和专业赚钱，但要防口舌破财', enTitle:'Ju Men in Wealth Palace: Earning Through Speech', enDesc:'Ju Men in Wealth means earning through speech and expertise; guard verbal financial loss.'},
  {slug:'ziwei-jumen-zai-jiegong', cnTitle:'巨门在疾厄宫：注意呼吸系统和肠胃，说话多了伤气', enTitle:'Ju Men in Health Palace: Respiratory and Digestive Systems', enDesc:'Ju Men in Health calls attention to respiratory and digestive systems; too much talk drains energy.'},
  {slug:'ziwei-jumen-zai-qianyi', cnTitle:'巨门在迁移宫：在外靠嘴巴吃饭，异乡发展口才是利器', enTitle:'Ju Men in Travel Palace: Earning by the Mouth Abroad', enDesc:'Ju Men in Travel means eloquence is a weapon for success away from home.'},
  {slug:'ziwei-jumen-zai-puyigong', cnTitle:'巨门在仆役宫：朋友中多诤友，但也容易起争执', enTitle:'Ju Men in Friends Palace: Straight-Talking Friends', enDesc:'Ju Men in Friends brings many straight-talking friends but also disputes.'},
  {slug:'ziwei-jumen-zai-guanlugong', cnTitle:'巨门在官禄宫：适合律师、教师、传媒等靠嘴的行业', enTitle:'Ju Men in Career Palace: Speech-Based Professions', enDesc:'Ju Men in Career suits law, teaching, media, and other speech-based professions.'},
  {slug:'ziwei-jumen-zai-tianzhaigong', cnTitle:'巨门在田宅宫：家里容易有口舌是非，注意沟通方式', enTitle:'Ju Men in Property Palace: Verbal Disputes at Home', enDesc:'Ju Men in Property means verbal disputes at home; mind communication style.'}
];

// 1. Update CN index
console.log('Updating CN index...');
let cnIndex = fs.readFileSync('articles/index.html', 'utf8');
if (!cnIndex.includes(articles[0].slug)) {
  const h2Idx = cnIndex.indexOf('<h2>主星</h2>');
  const divIdx = cnIndex.indexOf('<div class="article-list">', h2Idx);
  const insertPos = cnIndex.indexOf('\n', divIdx) + 1;
  let cards = '';
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const idx = String(i + 1).padStart(2, '0');
    cards += `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">主星</span><span><time datetime="${dateFull}">2026-08-23 10:30</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;
  }
  cnIndex = cnIndex.slice(0, insertPos) + cards + cnIndex.slice(insertPos);
  // Update count - find current count in 主星 section
  const countMatch = cnIndex.substring(h2Idx).match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    cnIndex = cnIndex.substring(0, h2Idx) + cnIndex.substring(h2Idx).replace(countMatch[0], `<span>${oldCount + 39} 篇</span>`);
  }
  fs.writeFileSync('articles/index.html', cnIndex, 'utf8');
  console.log('  CN index updated');
} else {
  console.log('  CN index already has entries');
}

// 2. Update EN index
console.log('Updating EN index...');
let enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
if (!enIndex.includes(articles[0].slug)) {
  // Find the first article card in the main list
  const firstCardMarker = 'ziwei-shengzhi-yusuan';
  let searchFrom = 0;
  // Find the article list div
  const listDiv = enIndex.indexOf('<div class="article-list">');
  const firstCardEnd = enIndex.indexOf('</article>', enIndex.indexOf('article-card', listDiv));
  const insertPos = enIndex.indexOf('\n', firstCardEnd) + 1;
  let enCards = '';
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const idx = String(i + 2).padStart(2, '0');
    enCards += `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${dateFull}">2026-08-23 10:30</time></span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read article</a>
            </div>
          </article>
`;
  }
  enIndex = enIndex.slice(0, insertPos) + enCards + enIndex.slice(insertPos);
  // Update count
  const countMatch = enIndex.match(/(\d+) Articles/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    enIndex = enIndex.replace(countMatch[0], `${oldCount + 39} Articles`);
  }
  fs.writeFileSync('articles/en/index.html', enIndex, 'utf8');
  console.log('  EN index updated');
} else {
  console.log('  EN index already has entries');
}

// 3. Update topic page
console.log('Updating topic page...');
let topic = fs.readFileSync('articles/ziwei-main-stars.html', 'utf8');
if (!topic.includes(articles[0].slug)) {
  const firstCard = topic.indexOf('class="article-card"');
  const lineStart = topic.lastIndexOf('\n', firstCard) + 1;
  let topicCards = '';
  for (const a of articles) {
    topicCards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${dateFull}">2026-08-23</time></a>\n`;
  }
  topic = topic.slice(0, lineStart) + topicCards + topic.slice(lineStart);
  fs.writeFileSync('articles/ziwei-main-stars.html', topic, 'utf8');
  console.log('  Topic page updated');
} else {
  console.log('  Topic page already has entries');
}

// 4. Update CN feed
console.log('Updating CN feed...');
let cnFeed = fs.readFileSync('feed.xml', 'utf8');
if (!cnFeed.includes(articles[0].slug)) {
  let cnItems = '';
  for (const a of articles) {
    cnItems += `  <item>
    <title>${a.cnTitle}</title>
    <link>https://yuetianai.com/articles/${a.slug}.html</link>
    <guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid>
    <pubDate>Sun, 23 Aug 2026 10:30:00 +0800</pubDate>
    <description><![CDATA[${a.cnTitle}]]></description>
  </item>
`;
  }
  cnFeed = cnFeed.replace('<channel>', '<channel>\n' + cnItems);
  fs.writeFileSync('feed.xml', cnFeed, 'utf8');
  console.log('  CN feed updated');
} else {
  console.log('  CN feed already has entries');
}

// 5. Update EN feed
console.log('Updating EN feed...');
let enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
if (!enFeed.includes(articles[0].slug)) {
  let enItems = '';
  for (const a of articles) {
    enItems += `  <item>
    <title>${a.enTitle}</title>
    <link>https://yuetianai.com/articles/en/${a.slug}.html</link>
    <guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid>
    <pubDate>Sun, 23 Aug 2026 10:30:00 +0800</pubDate>
    <description><![CDATA[${a.enTitle}]]></description>
  </item>
`;
  }
  enFeed = enFeed.replace('<channel>', '<channel>\n' + enItems);
  fs.writeFileSync('articles/en/feed.xml', enFeed, 'utf8');
  console.log('  EN feed updated');
} else {
  console.log('  EN feed already has entries');
}

console.log('\nDone.');
