const fs = require('fs');

const dateFull = '2026-08-22T10:30:00+08:00';

const newArticles = [
  {slug:'ziwei-wuqu-zai-caibogong', cnTitle:'武曲在财帛宫：正财星坐财库，赚钱靠实干不靠运气', enTitle:'Wu Qu in Wealth Palace: The Finance Star in Its Home', enDesc:'Wu Qu in Wealth puts the finance star in its home palace. Income ties to execution, skill, and financial instinct.'},
  {slug:'ziwei-wuqu-zai-jiegong', cnTitle:'武曲在疾厄宫：财星坐身体宫，健康跟「硬扛」有关', enTitle:'Wu Qu in Health Palace: Toughness and Its Hidden Costs', enDesc:'Wu Qu in Health gives a tough, resilient body that endures silently. Watch the respiratory system and accumulated fatigue.'},
  {slug:'ziwei-wuqu-zai-qianyi', cnTitle:'武曲在迁移宫：在外是干将，离乡反而能出头', enTitle:'Wu Qu in Travel Palace: A Doer Away from Home', enDesc:'Wu Qu in Travel means thriving outside the hometown through execution and determination.'},
  {slug:'ziwei-wuqu-zai-puyigong', cnTitle:'武曲在仆役宫：交朋友先看能力，兄弟是战友不是酒肉', enTitle:'Wu Qu in Friends Palace: Friends as Comrades', enDesc:'Wu Qu in Friends values capability in relationships; friends are comrades, not drinking buddies.'},
  {slug:'ziwei-wuqu-zai-guanlugong', cnTitle:'武曲在官禄宫：将星坐官禄，天生适合带团队打硬仗', enTitle:'Wu Qu in Career Palace: The General in Career', enDesc:'Wu Qu in Career suits leading teams through hard battles with execution and authority.'},
  {slug:'ziwei-wuqu-zai-tianzhaigong', cnTitle:'武曲在田宅宫：对房产有直觉，家业靠一笔一笔攒', enTitle:'Wu Qu in Property Palace: Property Instinct', enDesc:'Wu Qu in Property gives instinct for real estate; family assets build through disciplined accumulation.'},
  {slug:'ziwei-wuqu-zai-fudegong', cnTitle:'武曲在福德宫：闲不住的福星，放松对他们来说是任务', enTitle:'Wu Qu in Fortune Palace: A Blessing Star That Cannot Rest', enDesc:'Wu Qu in Fortune means a mind that cannot stop; relaxation itself becomes a task.'},
  {slug:'ziwei-wuqu-zai-fumugong', cnTitle:'武曲在父母宫：父母管教严，长辈缘深但有压力', enTitle:'Wu Qu in Parents Palace: Strict Parents', enDesc:'Wu Qu in Parents means strict discipline and deep elder bonds with pressure.'},
  {slug:'ziwei-tiantong-zai-minggong', cnTitle:'天同在命宫：福星坐命的人，天生懂生活但缺一把劲', enTitle:'Tian Tong in Life Palace: The Blessing Star in Life', enDesc:'Tian Tong in Life gives natural charm and enjoyment of life, but may lack drive.'},
  {slug:'ziwei-tiantong-zai-xiongdigong', cnTitle:'天同在兄弟宫：兄弟姐妹是福气来源，但也可能被宠着长', enTitle:'Tian Tong in Siblings Palace: Siblings as Blessing', enDesc:'Tian Tong in Siblings brings warm peer relationships, possibly with spoiling.'},
  {slug:'ziwei-tiantong-zai-fuqigong', cnTitle:'天同在夫妻宫：感情里要浪漫不要现实，伴侣缘好但怕磨合', enTitle:'Tian Tong in Spouse Palace: Romance over Reality', enDesc:'Tian Tong in Spouse brings good partner luck and romantic ideals, but friction is hard to handle.'},
  {slug:'ziwei-tiantong-zai-zinvgong', cnTitle:'天同在子女宫：子女缘深，孩子是你的开心果', enTitle:'Tian Tong in Children Palace: Strong Children Luck', enDesc:'Tian Tong in Children means close bonds with children who bring joy.'},
  {slug:'ziwei-tiantong-zai-caibogong', cnTitle:'天同在财帛宫：赚钱不费劲但也不太上心，够用就好', enTitle:'Tian Tong in Wealth Palace: Enough Is Enough', enDesc:'Tian Tong in Wealth means money comes without obsession; enough is enough.'},
  {slug:'ziwei-tiantong-zai-jiegong', cnTitle:'天同在疾厄宫：体质偏寒湿，情绪比身体更容易出问题', enTitle:'Tian Tong in Health Palace: Cold-Damp Constitution', enDesc:'Tian Tong in Health indicates cold-damp tendencies; emotions affect health more than body.'},
  {slug:'ziwei-tiantong-zai-qianyi', cnTitle:'天同在迁移宫：在外有人缘，出门遇贵人', enTitle:'Tian Tong in Travel Palace: Well-Liked Outside', enDesc:'Tian Tong in Travel means popularity and benefactors away from home.'},
  {slug:'ziwei-tiantong-zai-puyigong', cnTitle:'天同在仆役宫：朋友多但知心少，别什么人都信', enTitle:'Tian Tong in Friends Palace: Many Friends, Few Confidants', enDesc:'Tian Tong in Friends brings many friends but few true confidants; trust selectively.'},
  {slug:'ziwei-tiantong-zai-guanlugong', cnTitle:'天同在官禄宫：适合稳定轻松的工作，不宜高压竞争', enTitle:'Tian Tong in Career Palace: Stable, Low-Pressure Work', enDesc:'Tian Tong in Career suits stable, low-pressure environments over high competition.'},
  {slug:'ziwei-tiantong-zai-tianzhaigong', cnTitle:'天同在田宅宫：家里舒服最重要，居家运好', enTitle:'Tian Tong in Property Palace: Home Comfort Matters', enDesc:'Tian Tong in Property means good domestic luck and a comfortable home.'},
  {slug:'ziwei-tiantong-zai-fudegong', cnTitle:'天同在福德宫：福气最厚的位置，心态好就是最大的本钱', enTitle:'Tian Tong in Fortune Palace: Thickest Blessings', enDesc:'Tian Tong in Fortune is the thickest blessing position; a good mindset is the greatest asset.'},
  {slug:'ziwei-tiantong-zai-fumugong', cnTitle:'天同在父母宫：父母疼爱，童年温暖但独立性晚', enTitle:'Tian Tong in Parents Palace: Doting Parents', enDesc:'Tian Tong in Parents means doting parents and a warm childhood with late independence.'},
  {slug:'ziwei-lianzhen-zai-minggong', cnTitle:'廉贞在命宫：囚星坐命：能成事也能困住自己的人', enTitle:'Lian Zhen in Life Palace: The Binding Star in Life', enDesc:'Lian Zhen in Life gives charisma and capability but also self-imposed constraints.'},
  {slug:'ziwei-lianzhen-zai-xiongdigong', cnTitle:'廉贞在兄弟宫：同辈中有人格魅力者，但关系容易忽冷忽热', enTitle:'Lian Zhen in Siblings Palace: Charismatic Peers', enDesc:'Lian Zhen in Siblings brings charismatic peers with hot-and-cold relationships.'},
  {slug:'ziwei-lianzhen-zai-fuqigong', cnTitle:'廉贞在夫妻宫：感情浓烈但波折多，爱与束缚一线之隔', enTitle:'Lian Zhen in Spouse Palace: Intense Love with Twists', enDesc:'Lian Zhen in Spouse brings intense relationships where passion and confinement are close.'},
  {slug:'ziwei-lianzhen-zai-zinvgong', cnTitle:'廉贞在子女宫：子女聪明好胜，教育要给空间不要给压力', enTitle:'Lian Zhen in Children Palace: Bright, Competitive Children', enDesc:'Lian Zhen in Children means bright, competitive children; give space, not pressure.'},
  {slug:'ziwei-lianzhen-zai-caibogong', cnTitle:'廉贞在财帛宫：靠交际和专业赚钱，财来财去波动大', enTitle:'Lian Zhen in Wealth Palace: Earning Through Connections', enDesc:'Lian Zhen in Wealth means earning through social skills and expertise with volatile cash flow.'},
  {slug:'ziwei-lianzhen-zai-jiegong', cnTitle:'廉贞在疾厄宫：注意心火和血液问题，情绪是健康开关', enTitle:'Lian Zhen in Health Palace: Heart-Fire and Blood', enDesc:'Lian Zhen in Health calls attention to heart-fire and blood issues; emotions control health.'},
  {slug:'ziwei-lianzhen-zai-qianyi', cnTitle:'廉贞在迁移宫：在外如鱼得水，离乡发展更出彩', enTitle:'Lian Zhen in Travel Palace: Thriving Outside', enDesc:'Lian Zhen in Travel means thriving away from home where charisma shines.'},
  {slug:'ziwei-lianzhen-zai-puyigong', cnTitle:'廉贞在仆役宫：朋友圈三教九流，识人是必修课', enTitle:'Lian Zhen in Friends Palace: A Wide Social Circle', enDesc:'Lian Zhen in Friends brings a diverse social circle; reading people is essential.'},
  {slug:'ziwei-lianzhen-zai-guanlugong', cnTitle:'廉贞在官禄宫：官禄主坐官禄，事业上能文能武', enTitle:'Lian Zhen in Career Palace: The Career Ruler in Career', enDesc:'Lian Zhen in Career brings versatility and capability in professional life.'},
  {slug:'ziwei-lianzhen-zai-tianzhaigong', cnTitle:'廉贞在田宅宫：家里待不住，居家环境要常换常新', enTitle:'Lian Zhen in Property Palace: Change Keeps Home Fresh', enDesc:'Lian Zhen in Property means restlessness at home; regular changes keep the space fresh.'},
  {slug:'ziwei-lianzhen-zai-fudegong', cnTitle:'廉贞在福德宫：精神世界丰富但容易内耗，学会放下', enTitle:'Lian Zhen in Fortune Palace: Rich Inner World', enDesc:'Lian Zhen in Fortune gives a rich inner life but tendency toward internal friction.'},
  {slug:'ziwei-lianzhen-zai-fumugong', cnTitle:'廉贞在父母宫：与父母缘分深但管束多，文书运有波折', enTitle:'Lian Zhen in Parents Palace: Deep Bond with Control', enDesc:'Lian Zhen in Parents means deep parental bonds with control and document-related twists.'},
  {slug:'ziwei-tianfu-zai-minggong', cnTitle:'天府在命宫：府库星坐命：天生的管理者和守成者', enTitle:'Tian Fu in Life Palace: Born Manager and Preserver', enDesc:'Tian Fu in Life gives natural management ability and a conservative, steady nature.'},
  {slug:'ziwei-tianfu-zai-xiongdigong', cnTitle:'天府在兄弟宫：兄弟姐妹稳重可靠，是你的后盾', enTitle:'Tian Fu in Siblings Palace: Reliable Siblings', enDesc:'Tian Fu in Siblings means steady, reliable siblings who are your backing.'},
  {slug:'ziwei-tianfu-zai-fuqigong', cnTitle:'天府在夫妻宫：伴侣持家有道，婚姻安稳但缺激情', enTitle:'Tian Fu in Spouse Palace: A Partner Who Manages Home', enDesc:'Tian Fu in Spouse brings a stable, home-managing partner with less passion.'},
  {slug:'ziwei-tianfu-zai-zinvgong', cnTitle:'天府在子女宫：子女稳重懂事，教育上多给尝试机会', enTitle:'Tian Fu in Children Palace: Steady, Sensible Children', enDesc:'Tian Fu in Children means steady, sensible children; give them opportunities to try.'},
  {slug:'ziwei-tianfu-zai-caibogong', cnTitle:'天府在财帛宫：财库星坐财帛，收入稳存款多', enTitle:'Tian Fu in Wealth Palace: Stable Income, Strong Savings', enDesc:'Tian Fu in Wealth brings stable income and strong savings as the treasury star.'},
  {slug:'ziwei-tianfu-zai-jiegong', cnTitle:'天府在疾厄宫：脾胃是薄弱环节，饮食规律比什么都重要', enTitle:'Tian Fu in Health Palace: Spleen and Stomach Weakness', enDesc:'Tian Fu in Health indicates spleen and stomach weakness; regular eating is essential.'},
  {slug:'ziwei-tianfu-zai-qianyi', cnTitle:'天府在迁移宫：在外有贵人扶持，离乡稳扎稳打', enTitle:'Tian Fu in Travel Palace: Benefactors Outside', enDesc:'Tian Fu in Travel means benefactor support outside and steady progress away from home.'}
];

// 1. Fix EN index - insert articles after the first article card
console.log('Fixing EN index...');
let enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
if (!enIndex.includes(newArticles[0].slug)) {
  let enCards = '';
  for (let i = 0; i < newArticles.length; i++) {
    const a = newArticles[i];
    const idx = String(i + 2).padStart(2, '0');
    enCards += `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${dateFull}">2026-08-22 10:30</time></span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read article</a>
            </div>
          </article>
`;
  }
  // Insert after the first article's closing </article> tag
  const firstCardEnd = enIndex.indexOf('</article>', enIndex.indexOf('ziwei-shengzhi-yusuan'));
  if (firstCardEnd > 0) {
    const insertPos = enIndex.indexOf('\n', firstCardEnd) + 1;
    enIndex = enIndex.slice(0, insertPos) + enCards + enIndex.slice(insertPos);
  }
  // Update count
  enIndex = enIndex.replace(/901 Articles/, '940 Articles');
  fs.writeFileSync('articles/en/index.html', enIndex, 'utf8');
  console.log('  EN index fixed');
} else {
  console.log('  EN index already has entries');
}

// 2. Fix CN feed at root
console.log('Fixing CN feed...');
let cnFeed = fs.readFileSync('feed.xml', 'utf8');
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
  fs.writeFileSync('feed.xml', cnFeed, 'utf8');
  console.log('  CN feed fixed');
} else {
  console.log('  CN feed already has entries');
}

console.log('Done.');
