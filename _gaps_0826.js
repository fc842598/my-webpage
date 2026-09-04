const fs = require('fs');
const files = fs.readdirSync('articles');
const palaces = ['minggong','xiongdigong','fuqigong','zinvgong','caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong','fudegong','fumugong'];
const stars = ['zuofu','youbi','wenchang','wenqu','tiankui','tianyue','qingyang','tuoluo','huoxing','lingxing','dikong','dijie','tianma','lucun'];
for (const star of stars) {
  const done = palaces.filter(p => files.includes(`ziwei-${star}-zai-${p}.html`));
  const missing = palaces.filter(p => !files.includes(`ziwei-${star}-zai-${p}.html`));
  console.log(`${star}: ${done.length}/12, missing: ${missing.join(', ')}`);
}
