const fs = require('fs');
const files = fs.readdirSync('articles').filter(f => f.endsWith('.html') && f.startsWith('ziwei-'));

// Palace name variants in slugs
const palaceVariants = {
  '命宫': ['minggong'],
  '兄弟宫': ['xiongdigong', 'xiongdiongong'],
  '夫妻宫': ['fuqigong'],
  '子女宫': ['zinvgong', 'zinvgong'],
  '财帛宫': ['caibogong'],
  '疾厄宫': ['jiegong', 'jieegong'],
  '迁移宫': ['qianyi', 'qianyigong'],
  '仆役宫': ['puyigong', 'jiaoyougong', 'pengyougong'],
  '官禄宫': ['guanlugong'],
  '田宅宫': ['tianzhaigong'],
  '福德宫': ['fudegong'],
  '父母宫': ['fumugong']
};

const sihua = ['hualu', 'huaquan', 'huake', 'huaji'];
const sihuaCn = {'hualu':'化禄','huaquan':'化权','huake':'化科','huaji':'化忌'};

console.log('=== 四化×十二宫 覆盖（含变体名）===');
let missing = [];
for (const sh of sihua) {
  for (const [palaceCn, variants] of Object.entries(palaceVariants)) {
    let found = false;
    for (const v of variants) {
      // Check patterns: ziwei-{v}-{sh}, ziwei-{sh}-{v}, or just contains both
      if (files.find(f => f.includes(v) && f.includes(sh) && !f.includes('zai'))) {
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(`MISSING: ${sihuaCn[sh]}在${palaceCn}`);
      missing.push(`${sihuaCn[sh]}在${palaceCn}`);
    }
  }
}
console.log(`\nTotal missing: ${missing.length}`);

// Also check main stars × palaces more carefully
const stars = ['wuqu','tiantong','lianzhen','tianfu','taiyin','tanlang','jumen','tianxiang','tianliang','qisha','pojun'];
const starCn = {'wuqu':'武曲','tiantong':'天同','lianzhen':'廉贞','tianfu':'天府','taiyin':'太阴','tanlang':'贪狼','jumen':'巨门','tianxiang':'天相','tianliang':'天梁','qisha':'七杀','pojun':'破军'};

console.log('\n=== 主星×十二宫 缺失 ===');
let starMissing = [];
for (const s of stars) {
  for (const [palaceCn, variants] of Object.entries(palaceVariants)) {
    let found = false;
    for (const v of variants) {
      if (files.find(f => f.includes(`ziwei-${s}-zai-${v}`))) {
        found = true;
        break;
      }
    }
    if (!found) {
      starMissing.push(`${starCn[s]}在${palaceCn}`);
    }
  }
}
console.log(`Total missing star×palace: ${starMissing.length}`);
starMissing.forEach(m => console.log(`MISSING: ${m}`));
