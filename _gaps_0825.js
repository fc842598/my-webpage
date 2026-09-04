const fs = require('fs');
const files = fs.readdirSync('articles');

// Check 四化 gaps
const sihua = ['hualu','huaquan','huake','huaji'];
const palaces = ['minggong','xiongdigong','fuqigong','zinvgong','caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong','fudegong','fumugong'];
console.log('=== 四化×十二宫 gaps ===');
let sihuaGaps = [];
for (const sh of sihua) {
  for (const p of palaces) {
    const slug = `ziwei-${sh}-zai-${p}`;
    if (!files.includes(`${slug}.html`)) sihuaGaps.push(slug);
  }
}
console.log(sihuaGaps.length + ' gaps:', sihuaGaps);

// Check 辅煞曜 gaps - which aux stars have been done
console.log('\n=== 辅煞曜 coverage ===');
const auxStars = ['zuofu','youbi','wenchang','wenqu','tiankui','tianyue','qingyang','tuoluo','huoxing','lingxing','dikong','dijie','tianma','lucun','hongluan','tianxi','xianchi','tiangui','tianguan','guchen','guasu','huagai','jieshen','tianxing','yinsha','tianshang','pojun1'];
for (const star of ['zuofu','youbi','wenchang','wenqu','tiankui','tianyue','qingyang','tuoluo','huoxing','lingxing','dikong','dijie','tianma','lucun']) {
  const count = palaces.filter(p => files.includes(`ziwei-${star}-zai-${p}.html`)).length;
  console.log(`  ${star}: ${count}/12`);
}
