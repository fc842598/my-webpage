const fs = require('fs');

const dateFull = '2026-08-22T10:30:00+08:00';

const newArticles = [
  {slug:'ziwei-wuqu-zai-caibogong', title:'武曲在财帛宫：正财星坐财库，赚钱靠实干不靠运气'},
  {slug:'ziwei-wuqu-zai-jiegong', title:'武曲在疾厄宫：财星坐身体宫，健康跟「硬扛」有关'},
  {slug:'ziwei-wuqu-zai-qianyi', title:'武曲在迁移宫：在外是干将，离乡反而能出头'},
  {slug:'ziwei-wuqu-zai-puyigong', title:'武曲在仆役宫：交朋友先看能力，兄弟是战友不是酒肉'},
  {slug:'ziwei-wuqu-zai-guanlugong', title:'武曲在官禄宫：将星坐官禄，天生适合带团队打硬仗'},
  {slug:'ziwei-wuqu-zai-tianzhaigong', title:'武曲在田宅宫：对房产有直觉，家业靠一笔一笔攒'},
  {slug:'ziwei-wuqu-zai-fudegong', title:'武曲在福德宫：闲不住的福星，放松对他们来说是任务'},
  {slug:'ziwei-wuqu-zai-fumugong', title:'武曲在父母宫：父母管教严，长辈缘深但有压力'},
  {slug:'ziwei-tiantong-zai-minggong', title:'天同在命宫：福星坐命的人，天生懂生活但缺一把劲'},
  {slug:'ziwei-tiantong-zai-xiongdigong', title:'天同在兄弟宫：兄弟姐妹是福气来源，但也可能被宠着长'},
  {slug:'ziwei-tiantong-zai-fuqigong', title:'天同在夫妻宫：感情里要浪漫不要现实，伴侣缘好但怕磨合'},
  {slug:'ziwei-tiantong-zai-zinvgong', title:'天同在子女宫：子女缘深，孩子是你的开心果'},
  {slug:'ziwei-tiantong-zai-caibogong', title:'天同在财帛宫：赚钱不费劲但也不太上心，够用就好'},
  {slug:'ziwei-tiantong-zai-jiegong', title:'天同在疾厄宫：体质偏寒湿，情绪比身体更容易出问题'},
  {slug:'ziwei-tiantong-zai-qianyi', title:'天同在迁移宫：在外有人缘，出门遇贵人'},
  {slug:'ziwei-tiantong-zai-puyigong', title:'天同在仆役宫：朋友多但知心少，别什么人都信'},
  {slug:'ziwei-tiantong-zai-guanlugong', title:'天同在官禄宫：适合稳定轻松的工作，不宜高压竞争'},
  {slug:'ziwei-tiantong-zai-tianzhaigong', title:'天同在田宅宫：家里舒服最重要，居家运好'},
  {slug:'ziwei-tiantong-zai-fudegong', title:'天同在福德宫：福气最厚的位置，心态好就是最大的本钱'},
  {slug:'ziwei-tiantong-zai-fumugong', title:'天同在父母宫：父母疼爱，童年温暖但独立性晚'},
  {slug:'ziwei-lianzhen-zai-minggong', title:'廉贞在命宫：囚星坐命：能成事也能困住自己的人'},
  {slug:'ziwei-lianzhen-zai-xiongdigong', title:'廉贞在兄弟宫：同辈中有人格魅力者，但关系容易忽冷忽热'},
  {slug:'ziwei-lianzhen-zai-fuqigong', title:'廉贞在夫妻宫：感情浓烈但波折多，爱与束缚一线之隔'},
  {slug:'ziwei-lianzhen-zai-zinvgong', title:'廉贞在子女宫：子女聪明好胜，教育要给空间不要给压力'},
  {slug:'ziwei-lianzhen-zai-caibogong', title:'廉贞在财帛宫：靠交际和专业赚钱，财来财去波动大'},
  {slug:'ziwei-lianzhen-zai-jiegong', title:'廉贞在疾厄宫：注意心火和血液问题，情绪是健康开关'},
  {slug:'ziwei-lianzhen-zai-qianyi', title:'廉贞在迁移宫：在外如鱼得水，离乡发展更出彩'},
  {slug:'ziwei-lianzhen-zai-puyigong', title:'廉贞在仆役宫：朋友圈三教九流，识人是必修课'},
  {slug:'ziwei-lianzhen-zai-guanlugong', title:'廉贞在官禄宫：官禄主坐官禄，事业上能文能武'},
  {slug:'ziwei-lianzhen-zai-tianzhaigong', title:'廉贞在田宅宫：家里待不住，居家环境要常换常新'},
  {slug:'ziwei-lianzhen-zai-fudegong', title:'廉贞在福德宫：精神世界丰富但容易内耗，学会放下'},
  {slug:'ziwei-lianzhen-zai-fumugong', title:'廉贞在父母宫：与父母缘分深但管束多，文书运有波折'},
  {slug:'ziwei-tianfu-zai-minggong', title:'天府在命宫：府库星坐命：天生的管理者和守成者'},
  {slug:'ziwei-tianfu-zai-xiongdigong', title:'天府在兄弟宫：兄弟姐妹稳重可靠，是你的后盾'},
  {slug:'ziwei-tianfu-zai-fuqigong', title:'天府在夫妻宫：伴侣持家有道，婚姻安稳但缺激情'},
  {slug:'ziwei-tianfu-zai-zinvgong', title:'天府在子女宫：子女稳重懂事，教育上多给尝试机会'},
  {slug:'ziwei-tianfu-zai-caibogong', title:'天府在财帛宫：财库星坐财帛，收入稳存款多'},
  {slug:'ziwei-tianfu-zai-jiegong', title:'天府在疾厄宫：脾胃是薄弱环节，饮食规律比什么都重要'},
  {slug:'ziwei-tianfu-zai-qianyi', title:'天府在迁移宫：在外有贵人扶持，离乡稳扎稳打'}
];

let cnIndex = fs.readFileSync('articles/index.html', 'utf8');

// Check if already inserted
if (cnIndex.includes('ziwei-wuqu-zai-caibogong.html') && cnIndex.indexOf('ziwei-wuqu-zai-caibogong') > cnIndex.indexOf('<div class="article-list">', cnIndex.indexOf('<h2>主星</h2>'))) {
  console.log('Cards already in correct position, skipping');
} else {
  // Find the 主星 section's article-list div
  const h2Idx = cnIndex.indexOf('<h2>主星</h2>');
  const divIdx = cnIndex.indexOf('<div class="article-list">', h2Idx);
  const insertPos = cnIndex.indexOf('\n', divIdx) + 1;
  
  let cards = '';
  for (let i = 0; i < newArticles.length; i++) {
    const a = newArticles[i];
    const idx = String(i + 1).padStart(2, '0');
    cards += `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">主星</span><span><time datetime="${dateFull}">2026-08-22 10:30</time></span></div>
              <h3>${a.title}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;
  }
  cnIndex = cnIndex.slice(0, insertPos) + cards + cnIndex.slice(insertPos);
  fs.writeFileSync('articles/index.html', cnIndex, 'utf8');
  console.log('Cards inserted correctly in CN index');
}
