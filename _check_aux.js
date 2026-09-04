const fs = require('fs');
const files = fs.readdirSync('articles').filter(f => f.endsWith('.html') && f.startsWith('ziwei-'));

// Check auxiliary stars
const auxStars = ['zuofu','youbi','wenchang','wenqu','tiankui','tianyue','lucun','tianma',
  'qingyang','tuoluo','huoxing','lingxing','dikong','dijie','tianxing','tianyao','hongluan','tianxi'];
const auxCn = {'zuofu':'左辅','youbi':'右弼','wenchang':'文昌','wenqu':'文曲','tiankui':'天魁','tianyue':'天钺',
  'lucun':'禄存','tianma':'天马','qingyang':'擎羊','tuoluo':'陀罗','huoxing':'火星','lingxing':'铃星',
  'dikong':'地空','dijie':'地劫','tianxing':'天刑','tianyao':'天姚','hongluan':'红鸾','tianxi':'天喜'};

const palaces = ['minggong','xiongdigong','fuqigong','zinvgong','caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong','fudegong','fumugong'];
const palaceCn = {'minggong':'命宫','xiongdigong':'兄弟宫','fuqigong':'夫妻宫','zinvgong':'子女宫','caibogong':'财帛宫','jiegong':'疾厄宫','qianyi':'迁移宫','puyigong':'仆役宫','guanlugong':'官禄宫','tianzhaigong':'田宅宫','fudegong':'福德宫','fumugong':'父母宫'};

console.log('=== 辅煞曜×十二宫 覆盖 ===');
let totalMissing = 0;
for (const star of auxStars) {
  let missing = [];
  for (const p of palaces) {
    const pattern = `ziwei-${star}-zai-${p}`;
    const found = files.find(f => f.includes(pattern));
    if (!found) missing.push(palaceCn[p]);
  }
  if (missing.length > 0) {
    console.log(`${auxCn[star]}: 缺${missing.length}篇 (${missing.join('、')})`);
    totalMissing += missing.length;
  } else {
    console.log(`${auxCn[star]}: 已满`);
  }
}
console.log(`\n总空白: ${totalMissing}`);
