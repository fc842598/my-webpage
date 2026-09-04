const fs = require('fs');
const path = require('path');

const date = '2026-08-22';
const dateFull = '2026-08-22T10:30:00+08:00';

// New article slugs and titles
const newArticles = [
  {slug:'ziwei-wuqu-zai-caibogong', cnTitle:'武曲在财帛宫：正财星坐财库，赚钱靠实干不靠运气', enTitle:'Wu Qu in Wealth Palace: The Finance Star in Its Home'},
  {slug:'ziwei-wuqu-zai-jiegong', cnTitle:'武曲在疾厄宫：财星坐身体宫，健康跟「硬扛」有关', enTitle:'Wu Qu in Health Palace: Toughness and Its Hidden Costs'},
  {slug:'ziwei-wuqu-zai-qianyi', cnTitle:'武曲在迁移宫：在外是干将，离乡反而能出头', enTitle:'Wu Qu in Travel Palace: A Doer Away from Home'},
  {slug:'ziwei-wuqu-zai-puyigong', cnTitle:'武曲在仆役宫：交朋友先看能力，兄弟是战友不是酒肉', enTitle:'Wu Qu in Friends Palace: Friends as Comrades'},
  {slug:'ziwei-wuqu-zai-guanlugong', cnTitle:'武曲在官禄宫：将星坐官禄，天生适合带团队打硬仗', enTitle:'Wu Qu in Career Palace: The General in Career'},
  {slug:'ziwei-wuqu-zai-tianzhaigong', cnTitle:'武曲在田宅宫：对房产有直觉，家业靠一笔一笔攒', enTitle:'Wu Qu in Property Palace: Property Instinct'},
  {slug:'ziwei-wuqu-zai-fudegong', cnTitle:'武曲在福德宫：闲不住的福星，放松对他们来说是任务', enTitle:'Wu Qu in Fortune Palace: A Blessing Star That Cannot Rest'},
  {slug:'ziwei-wuqu-zai-fumugong', cnTitle:'武曲在父母宫：父母管教严，长辈缘深但有压力', enTitle:'Wu Qu in Parents Palace: Strict Parents'},
  {slug:'ziwei-tiantong-zai-minggong', cnTitle:'天同在命宫：福星坐命的人，天生懂生活但缺一把劲', enTitle:'Tian Tong in Life Palace: The Blessing Star in Life'},
  {slug:'ziwei-tiantong-zai-xiongdigong', cnTitle:'天同在兄弟宫：兄弟姐妹是福气来源，但也可能被宠着长', enTitle:'Tian Tong in Siblings Palace: Siblings as Blessing'},
  {slug:'ziwei-tiantong-zai-fuqigong', cnTitle:'天同在夫妻宫：感情里要浪漫不要现实，伴侣缘好但怕磨合', enTitle:'Tian Tong in Spouse Palace: Romance over Reality'},
  {slug:'ziwei-tiantong-zai-zinvgong', cnTitle:'天同在子女宫：子女缘深，孩子是你的开心果', enTitle:'Tian Tong in Children Palace: Strong Children Luck'},
  {slug:'ziwei-tiantong-zai-caibogong', cnTitle:'天同在财帛宫：赚钱不费劲但也不太上心，够用就好', enTitle:'Tian Tong in Wealth Palace: Enough Is Enough'},
  {slug:'ziwei-tiantong-zai-jiegong', cnTitle:'天同在疾厄宫：体质偏寒湿，情绪比身体更容易出问题', enTitle:'Tian Tong in Health Palace: Cold-Damp Constitution'},
  {slug:'ziwei-tiantong-zai-qianyi', cnTitle:'天同在迁移宫：在外有人缘，出门遇贵人', enTitle:'Tian Tong in Travel Palace: Well-Liked Outside'},
  {slug:'ziwei-tiantong-zai-puyigong', cnTitle:'天同在仆役宫：朋友多但知心少，别什么人都信', enTitle:'Tian Tong in Friends Palace: Many Friends, Few Confidants'},
  {slug:'ziwei-tiantong-zai-guanlugong', cnTitle:'天同在官禄宫：适合稳定轻松的工作，不宜高压竞争', enTitle:'Tian Tong in Career Palace: Stable, Low-Pressure Work'},
  {slug:'ziwei-tiantong-zai-tianzhaigong', cnTitle:'天同在田宅宫：家里舒服最重要，居家运好', enTitle:'Tian Tong in Property Palace: Home Comfort Matters'},
  {slug:'ziwei-tiantong-zai-fudegong', cnTitle:'天同在福德宫：福气最厚的位置，心态好就是最大的本钱', enTitle:'Tian Tong in Fortune Palace: Thickest Blessings'},
  {slug:'ziwei-tiantong-zai-fumugong', cnTitle:'天同在父母宫：父母疼爱，童年温暖但独立性晚', enTitle:'Tian Tong in Parents Palace: Doting Parents'},
  {slug:'ziwei-lianzhen-zai-minggong', cnTitle:'廉贞在命宫：囚星坐命：能成事也能困住自己的人', enTitle:'Lian Zhen in Life Palace: The Binding Star in Life'},
  {slug:'ziwei-lianzhen-zai-xiongdigong', cnTitle:'廉贞在兄弟宫：同辈中有人格魅力者，但关系容易忽冷忽热', enTitle:'Lian Zhen in Siblings Palace: Charismatic Peers'},
  {slug:'ziwei-lianzhen-zai-fuqigong', cnTitle:'廉贞在夫妻宫：感情浓烈但波折多，爱与束缚一线之隔', enTitle:'Lian Zhen in Spouse Palace: Intense Love with Twists'},
  {slug:'ziwei-lianzhen-zai-zinvgong', cnTitle:'廉贞在子女宫：子女聪明好胜，教育要给空间不要给压力', enTitle:'Lian Zhen in Children Palace: Bright, Competitive Children'},
  {slug:'ziwei-lianzhen-zai-caibogong', cnTitle:'廉贞在财帛宫：靠交际和专业赚钱，财来财去波动大', enTitle:'Lian Zhen in Wealth Palace: Earning Through Connections'},
  {slug:'ziwei-lianzhen-zai-jiegong', cnTitle:'廉贞在疾厄宫：注意心火和血液问题，情绪是健康开关', enTitle:'Lian Zhen in Health Palace: Heart-Fire and Blood'},
  {slug:'ziwei-lianzhen-zai-qianyi', cnTitle:'廉贞在迁移宫：在外如鱼得水，离乡发展更出彩', enTitle:'Lian Zhen in Travel Palace: Thriving Outside'},
  {slug:'ziwei-lianzhen-zai-puyigong', cnTitle:'廉贞在仆役宫：朋友圈三教九流，识人是必修课', enTitle:'Lian Zhen in Friends Palace: A Wide Social Circle'},
  {slug:'ziwei-lianzhen-zai-guanlugong', cnTitle:'廉贞在官禄宫：官禄主坐官禄，事业上能文能武', enTitle:'Lian Zhen in Career Palace: The Career Ruler in Career'},
  {slug:'ziwei-lianzhen-zai-tianzhaigong', cnTitle:'廉贞在田宅宫：家里待不住，居家环境要常换常新', enTitle:'Lian Zhen in Property Palace: Change Keeps Home Fresh'},
  {slug:'ziwei-lianzhen-zai-fudegong', cnTitle:'廉贞在福德宫：精神世界丰富但容易内耗，学会放下', enTitle:'Lian Zhen in Fortune Palace: Rich Inner World'},
  {slug:'ziwei-lianzhen-zai-fumugong', cnTitle:'廉贞在父母宫：与父母缘分深但管束多，文书运有波折', enTitle:'Lian Zhen in Parents Palace: Deep Bond with Control'},
  {slug:'ziwei-tianfu-zai-minggong', cnTitle:'天府在命宫：府库星坐命：天生的管理者和守成者', enTitle:'Tian Fu in Life Palace: Born Manager and Preserver'},
  {slug:'ziwei-tianfu-zai-xiongdigong', cnTitle:'天府在兄弟宫：兄弟姐妹稳重可靠，是你的后盾', enTitle:'Tian Fu in Siblings Palace: Reliable Siblings'},
  {slug:'ziwei-tianfu-zai-fuqigong', cnTitle:'天府在夫妻宫：伴侣持家有道，婚姻安稳但缺激情', enTitle:'Tian Fu in Spouse Palace: A Partner Who Manages Home'},
  {slug:'ziwei-tianfu-zai-zinvgong', cnTitle:'天府在子女宫：子女稳重懂事，教育上多给尝试机会', enTitle:'Tian Fu in Children Palace: Steady, Sensible Children'},
  {slug:'ziwei-tianfu-zai-caibogong', cnTitle:'天府在财帛宫：财库星坐财帛，收入稳存款多', enTitle:'Tian Fu in Wealth Palace: Stable Income, Strong Savings'},
  {slug:'ziwei-tianfu-zai-jiegong', cnTitle:'天府在疾厄宫：脾胃是薄弱环节，饮食规律比什么都重要', enTitle:'Tian Fu in Health Palace: Spleen and Stomach Weakness'},
  {slug:'ziwei-tianfu-zai-qianyi', cnTitle:'天府在迁移宫：在外有贵人扶持，离乡稳扎稳打', enTitle:'Tian Fu in Travel Palace: Benefactors Outside'}
];

// Helper: insert article links into an HTML file before a marker
function insertBeforeMarker(filePath, marker, html) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(newArticles[0].slug)) {
    console.log(`  Already has entries in ${path.basename(filePath)}, skipping insert`);
    return false;
  }
  content = content.replace(marker, html + marker);
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

// 1. Update CN index (articles/index.html) - insert into 主星 section
// Find the article list in the 主星 category
console.log('Updating CN index...');
let cnIndex = fs.readFileSync('articles/index.html', 'utf8');
if (!cnIndex.includes(newArticles[0].slug)) {
  // Build article cards for CN index
  let cnCards = '';
  for (const a of newArticles) {
    cnCards += `        <a class="article-card" href="${a.slug}.html"><span class="article-card-cat">主星</span><h3>${a.cnTitle}</h3><time datetime="${dateFull}">2026-08-22</time></a>\n`;
  }
  // Insert before the first article card in the 主星 section or at a suitable marker
  // Look for the category section for 主星
  const marker = '<!-- ARTICLES_MAIN_STARS -->';
  if (cnIndex.includes(marker)) {
    cnIndex = cnIndex.replace(marker, cnCards + marker);
  } else {
    // Try to find a good insertion point - after the 主星 category header
    const starSectionMatch = cnIndex.match(/(<h[23][^>]*>主星<\/h[23]>)/);
    if (starSectionMatch) {
      const idx = cnIndex.indexOf(starSectionMatch[0]) + starSectionMatch[0].length;
      cnIndex = cnIndex.slice(0, idx) + '\n' + cnCards + cnIndex.slice(idx);
    } else {
      console.log('  WARNING: Could not find 主星 section in CN index');
    }
  }
  fs.writeFileSync('articles/index.html', cnIndex, 'utf8');
  console.log('  CN index updated');
} else {
  console.log('  CN index already has entries');
}

// 2. Update EN index (articles/en/index.html)
console.log('Updating EN index...');
let enIndexPath = 'articles/en/index.html';
if (fs.existsSync(enIndexPath)) {
  let enIndex = fs.readFileSync(enIndexPath, 'utf8');
  if (!enIndex.includes(newArticles[0].slug)) {
    let enCards = '';
    for (const a of newArticles) {
      enCards += `        <a class="article-card" href="${a.slug}.html"><span class="article-card-cat">Main Stars</span><h3>${a.enTitle}</h3><time datetime="${dateFull}">2026-08-22</time></a>\n`;
    }
    const marker = '<!-- ARTICLES_MAIN_STARS -->';
    if (enIndex.includes(marker)) {
      enIndex = enIndex.replace(marker, enCards + marker);
    } else {
      const starSectionMatch = enIndex.match(/(<h[23][^>]*>Main Stars<\/h[23]>)/i);
      if (starSectionMatch) {
        const idx = enIndex.indexOf(starSectionMatch[0]) + starSectionMatch[0].length;
        enIndex = enIndex.slice(0, idx) + '\n' + enCards + enIndex.slice(idx);
      } else {
        console.log('  WARNING: Could not find Main Stars section in EN index');
      }
    }
    fs.writeFileSync(enIndexPath, enIndex, 'utf8');
    console.log('  EN index updated');
  } else {
    console.log('  EN index already has entries');
  }
} else {
  console.log('  EN index not found, skipping');
}

// 3. Update topic page ziwei-main-stars.html
console.log('Updating topic page ziwei-main-stars.html...');
let topicPath = 'articles/ziwei-main-stars.html';
let topic = fs.readFileSync(topicPath, 'utf8');
if (!topic.includes(newArticles[0].slug)) {
  let topicCards = '';
  for (const a of newArticles) {
    topicCards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${dateFull}">2026-08-22</time></a>\n`;
  }
  // Insert at the beginning of the article list or after a marker
  const marker = '<!-- ARTICLES_LIST_START -->';
  if (topic.includes(marker)) {
    topic = topic.replace(marker, topicCards + marker);
  } else {
    // Find the first article card and insert before it
    const firstCard = topic.indexOf('class="article-card"');
    if (firstCard > 0) {
      // Find the start of the line containing the first card
      const lineStart = topic.lastIndexOf('\n', firstCard) + 1;
      topic = topic.slice(0, lineStart) + topicCards + topic.slice(lineStart);
    } else {
      console.log('  WARNING: Could not find article list in topic page');
    }
  }
  // Update article count if present
  const countMatch = topic.match(/(\d+)\s*篇/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    // Find the count near the top/description area
    const countIdx = topic.indexOf(countMatch[0]);
    const before = topic.substring(Math.max(0, countIdx - 200), countIdx);
    if (before.includes('主星') || before.includes('文章') || countIdx < 5000) {
      topic = topic.substring(0, countIdx) + (oldCount + 39) + ' 篇' + topic.substring(countIdx + countMatch[0].length);
    }
  }
  fs.writeFileSync(topicPath, topic, 'utf8');
  console.log('  Topic page updated');
} else {
  console.log('  Topic page already has entries');
}

// 4. Update CN feed
console.log('Updating CN feed...');
let cnFeedPath = 'articles/feed.xml';
if (fs.existsSync(cnFeedPath)) {
  let cnFeed = fs.readFileSync(cnFeedPath, 'utf8');
  if (!cnFeed.includes(newArticles[0].slug)) {
    let cnItems = '';
    for (const a of newArticles) {
      cnItems += `  <item>
    <title>${a.cnTitle}</title>
    <link>https://yuetianai.com/articles/${a.slug}.html</link>
    <guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid>
    <pubDate>Sat, 22 Aug 2026 10:30:00 +0800</pubDate>
    <description><![CDATA[${a.cnTitle}]]></description>
  </item>
`;
    }
    cnFeed = cnFeed.replace('<channel>', '<channel>\n' + cnItems);
    fs.writeFileSync(cnFeedPath, cnFeed, 'utf8');
    console.log('  CN feed updated');
  } else {
    console.log('  CN feed already has entries');
  }
}

// 5. Update EN feed
console.log('Updating EN feed...');
let enFeedPath = 'articles/en/feed.xml';
if (fs.existsSync(enFeedPath)) {
  let enFeed = fs.readFileSync(enFeedPath, 'utf8');
  if (!enFeed.includes(newArticles[0].slug)) {
    let enItems = '';
    for (const a of newArticles) {
      enItems += `  <item>
    <title>${a.enTitle}</title>
    <link>https://yuetianai.com/articles/en/${a.slug}.html</link>
    <guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid>
    <pubDate>Sat, 22 Aug 2026 10:30:00 +0800</pubDate>
    <description><![CDATA[${a.enTitle}]]></description>
  </item>
`;
    }
    enFeed = enFeed.replace('<channel>', '<channel>\n' + enItems);
    fs.writeFileSync(enFeedPath, enFeed, 'utf8');
    console.log('  EN feed updated');
  } else {
    console.log('  EN feed already has entries');
  }
}

console.log('\nDone updating indexes, topic page, and feeds.');
