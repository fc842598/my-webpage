const fs = require('fs');

const dateFull = '2026-08-22T10:30:00+08:00';

const newArticles = [
  'ziwei-wuqu-zai-caibogong','ziwei-wuqu-zai-jiegong','ziwei-wuqu-zai-qianyi','ziwei-wuqu-zai-puyigong',
  'ziwei-wuqu-zai-guanlugong','ziwei-wuqu-zai-tianzhaigong','ziwei-wuqu-zai-fudegong','ziwei-wuqu-zai-fumugong',
  'ziwei-tiantong-zai-minggong','ziwei-tiantong-zai-xiongdigong','ziwei-tiantong-zai-fuqigong','ziwei-tiantong-zai-zinvgong',
  'ziwei-tiantong-zai-caibogong','ziwei-tiantong-zai-jiegong','ziwei-tiantong-zai-qianyi','ziwei-tiantong-zai-puyigong',
  'ziwei-tiantong-zai-guanlugong','ziwei-tiantong-zai-tianzhaigong','ziwei-tiantong-zai-fudegong','ziwei-tiantong-zai-fumugong',
  'ziwei-lianzhen-zai-minggong','ziwei-lianzhen-zai-xiongdigong','ziwei-lianzhen-zai-fuqigong','ziwei-lianzhen-zai-zinvgong',
  'ziwei-lianzhen-zai-caibogong','ziwei-lianzhen-zai-jiegong','ziwei-lianzhen-zai-qianyi','ziwei-lianzhen-zai-puyigong',
  'ziwei-lianzhen-zai-guanlugong','ziwei-lianzhen-zai-tianzhaigong','ziwei-lianzhen-zai-fudegong','ziwei-lianzhen-zai-fumugong',
  'ziwei-tianfu-zai-minggong','ziwei-tianfu-zai-xiongdigong','ziwei-tianfu-zai-fuqigong','ziwei-tianfu-zai-zinvgong',
  'ziwei-tianfu-zai-caibogong','ziwei-tianfu-zai-jiegong','ziwei-tianfu-zai-qianyi'
];

const cnTitles = {
  'ziwei-wuqu-zai-caibogong':'武曲在财帛宫：正财星坐财库，赚钱靠实干不靠运气',
  'ziwei-wuqu-zai-jiegong':'武曲在疾厄宫：财星坐身体宫，健康跟「硬扛」有关',
  'ziwei-wuqu-zai-qianyi':'武曲在迁移宫：在外是干将，离乡反而能出头',
  'ziwei-wuqu-zai-puyigong':'武曲在仆役宫：交朋友先看能力，兄弟是战友不是酒肉',
  'ziwei-wuqu-zai-guanlugong':'武曲在官禄宫：将星坐官禄，天生适合带团队打硬仗',
  'ziwei-wuqu-zai-tianzhaigong':'武曲在田宅宫：对房产有直觉，家业靠一笔一笔攒',
  'ziwei-wuqu-zai-fudegong':'武曲在福德宫：闲不住的福星，放松对他们来说是任务',
  'ziwei-wuqu-zai-fumugong':'武曲在父母宫：父母管教严，长辈缘深但有压力',
  'ziwei-tiantong-zai-minggong':'天同在命宫：福星坐命的人，天生懂生活但缺一把劲',
  'ziwei-tiantong-zai-xiongdigong':'天同在兄弟宫：兄弟姐妹是福气来源，但也可能被宠着长',
  'ziwei-tiantong-zai-fuqigong':'天同在夫妻宫：感情里要浪漫不要现实，伴侣缘好但怕磨合',
  'ziwei-tiantong-zai-zinvgong':'天同在子女宫：子女缘深，孩子是你的开心果',
  'ziwei-tiantong-zai-caibogong':'天同在财帛宫：赚钱不费劲但也不太上心，够用就好',
  'ziwei-tiantong-zai-jiegong':'天同在疾厄宫：体质偏寒湿，情绪比身体更容易出问题',
  'ziwei-tiantong-zai-qianyi':'天同在迁移宫：在外有人缘，出门遇贵人',
  'ziwei-tiantong-zai-puyigong':'天同在仆役宫：朋友多但知心少，别什么人都信',
  'ziwei-tiantong-zai-guanlugong':'天同在官禄宫：适合稳定轻松的工作，不宜高压竞争',
  'ziwei-tiantong-zai-tianzhaigong':'天同在田宅宫：家里舒服最重要，居家运好',
  'ziwei-tiantong-zai-fudegong':'天同在福德宫：福气最厚的位置，心态好就是最大的本钱',
  'ziwei-tiantong-zai-fumugong':'天同在父母宫：父母疼爱，童年温暖但独立性晚',
  'ziwei-lianzhen-zai-minggong':'廉贞在命宫：囚星坐命：能成事也能困住自己的人',
  'ziwei-lianzhen-zai-xiongdigong':'廉贞在兄弟宫：同辈中有人格魅力者，但关系容易忽冷忽热',
  'ziwei-lianzhen-zai-fuqigong':'廉贞在夫妻宫：感情浓烈但波折多，爱与束缚一线之隔',
  'ziwei-lianzhen-zai-zinvgong':'廉贞在子女宫：子女聪明好胜，教育要给空间不要给压力',
  'ziwei-lianzhen-zai-caibogong':'廉贞在财帛宫：靠交际和专业赚钱，财来财去波动大',
  'ziwei-lianzhen-zai-jiegong':'廉贞在疾厄宫：注意心火和血液问题，情绪是健康开关',
  'ziwei-lianzhen-zai-qianyi':'廉贞在迁移宫：在外如鱼得水，离乡发展更出彩',
  'ziwei-lianzhen-zai-puyigong':'廉贞在仆役宫：朋友圈三教九流，识人是必修课',
  'ziwei-lianzhen-zai-guanlugong':'廉贞在官禄宫：官禄主坐官禄，事业上能文能武',
  'ziwei-lianzhen-zai-tianzhaigong':'廉贞在田宅宫：家里待不住，居家环境要常换常新',
  'ziwei-lianzhen-zai-fudegong':'廉贞在福德宫：精神世界丰富但容易内耗，学会放下',
  'ziwei-lianzhen-zai-fumugong':'廉贞在父母宫：与父母缘分深但管束多，文书运有波折',
  'ziwei-tianfu-zai-minggong':'天府在命宫：府库星坐命：天生的管理者和守成者',
  'ziwei-tianfu-zai-xiongdigong':'天府在兄弟宫：兄弟姐妹稳重可靠，是你的后盾',
  'ziwei-tianfu-zai-fuqigong':'天府在夫妻宫：伴侣持家有道，婚姻安稳但缺激情',
  'ziwei-tianfu-zai-zinvgong':'天府在子女宫：子女稳重懂事，教育上多给尝试机会',
  'ziwei-tianfu-zai-caibogong':'天府在财帛宫：财库星坐财帛，收入稳存款多',
  'ziwei-tianfu-zai-jiegong':'天府在疾厄宫：脾胃是薄弱环节，饮食规律比什么都重要',
  'ziwei-tianfu-zai-qianyi':'天府在迁移宫：在外有贵人扶持，离乡稳扎稳打'
};

// Fix CN index
let cnIndex = fs.readFileSync('articles/index.html', 'utf8');

// Remove the incorrectly placed cards (between h2 and summary)
const wrongStart = cnIndex.indexOf('<a class="article-card" href="ziwei-wuqu-zai-caibogong.html">');
if (wrongStart > 0) {
  // Find the end of the last incorrectly placed card
  const wrongEndMarker = '</time></a>\n';
  let searchFrom = wrongStart;
  let lastEnd = wrongStart;
  for (const slug of newArticles) {
    const idx = cnIndex.indexOf(`href="${slug}.html"`, searchFrom);
    if (idx > 0) {
      const endIdx = cnIndex.indexOf('</a>', idx) + 4;
      lastEnd = endIdx;
      searchFrom = endIdx;
    }
  }
  // Remove from wrongStart to lastEnd + newline
  let afterWrong = cnIndex.indexOf('\n', lastEnd);
  cnIndex = cnIndex.slice(0, wrongStart) + cnIndex.slice(afterWrong + 1);
  console.log('Removed incorrectly placed cards');
}

// Now insert properly inside the article-list div
const listMarker = '<h2>主星</h2>\n            <span class="section-desc">';
const listStartIdx = cnIndex.indexOf(listMarker);
if (listStartIdx > 0) {
  // Find the <div class="article-list"> after the summary
  const divStart = cnIndex.indexOf('<div class="article-list">', listStartIdx);
  if (divStart > 0) {
    const insertPos = cnIndex.indexOf('\n', divStart) + 1;
    let cards = '';
    for (let i = 0; i < newArticles.length; i++) {
      const slug = newArticles[i];
      const idx = String(i + 1).padStart(2, '0');
      cards += `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">主星</span><span><time datetime="${dateFull}">2026-08-22 10:30</time></span></div>
              <h3>${cnTitles[slug]}</h3>
              <a class="card-link" href="${slug}.html">阅读全文</a>
            </div>
          </article>
`;
    }
    cnIndex = cnIndex.slice(0, insertPos) + cards + cnIndex.slice(insertPos);
    console.log('Inserted cards in correct position');
  }
}

// Update article count from 58 to 97 (58 + 39 = 97)
cnIndex = cnIndex.replace(/<span>58 篇<\/span>/, '<span>97 篇</span>');
fs.writeFileSync('articles/index.html', cnIndex, 'utf8');
console.log('CN index fixed');
