const fs = require('fs');
const path = require('path');

// 四化: 化禄、化权、化科、化忌
const sihua = ['hualu', 'huaquan', 'huake', 'huaji'];
const sihuaCn = {'hualu':'化禄','huaquan':'化权','huake':'化科','huaji':'化忌'};
const palaces = ['minggong','xiongdigong','fuqigong','zinvgong','caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong','fudegong','fumugong'];
const palaceCn = {'minggong':'命宫','xiongdigong':'兄弟宫','fuqigong':'夫妻宫','zinvgong':'子女宫','caibogong':'财帛宫','jiegong':'疾厄宫','qianyi':'迁移宫','puyigong':'仆役宫','guanlugong':'官禄宫','tianzhaigong':'田宅宫','fudegong':'福德宫','fumugong':'父母宫'};

const files = fs.readdirSync('articles');
const gaps = [];
for (const sh of sihua) {
  for (const p of palaces) {
    const slug = `ziwei-${sh}-zai-${p}`;
    if (!files.includes(`${slug}.html`)) {
      gaps.push({slug, sh, p, cn: `${sihuaCn[sh]}在${palaceCn[p]}`});
    }
  }
}
console.log(`四化×十二宫 gaps: ${gaps.length}/48`);
gaps.forEach(g => console.log(`  ${g.slug} - ${g.cn}`));

// Also count total articles
const cnCount = files.filter(f => f.endsWith('.html') && f !== 'index.html' && !f.startsWith('ziwei-') === false).length;
const allHtml = files.filter(f => f.endsWith('.html'));
console.log(`\nTotal CN HTML files in articles/: ${allHtml.length}`);
