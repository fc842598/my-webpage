const https = require('https');
const slugs = [
  'ziwei-xianchi-zai-fudegong','ziwei-xianchi-zai-fumugong',
  'ziwei-tianyao-zai-minggong','ziwei-tianyao-zai-xiongdigong','ziwei-tianyao-zai-fuqigong','ziwei-tianyao-zai-zinvgong',
  'ziwei-tianyao-zai-caibogong','ziwei-tianyao-zai-jiegong','ziwei-tianyao-zai-qianyi','ziwei-tianyao-zai-puyigong',
  'ziwei-tianyao-zai-guanlugong','ziwei-tianyao-zai-tianzhaigong','ziwei-tianyao-zai-fudegong','ziwei-tianyao-zai-fumugong',
  'ziwei-guchen-zai-minggong','ziwei-guchen-zai-xiongdigong','ziwei-guchen-zai-fuqigong','ziwei-guchen-zai-zinvgong',
  'ziwei-guchen-zai-caibogong','ziwei-guchen-zai-jiegong','ziwei-guchen-zai-qianyi','ziwei-guchen-zai-puyigong',
  'ziwei-guchen-zai-guanlugong','ziwei-guchen-zai-tianzhaigong','ziwei-guchen-zai-fudegong','ziwei-guchen-zai-fumugong',
  'ziwei-guasu-zai-minggong','ziwei-guasu-zai-xiongdigong','ziwei-guasu-zai-fuqigong','ziwei-guasu-zai-zinvgong',
  'ziwei-guasu-zai-caibogong','ziwei-guasu-zai-jiegong','ziwei-guasu-zai-qianyi','ziwei-guasu-zai-puyigong',
  'ziwei-guasu-zai-guanlugong','ziwei-guasu-zai-tianzhaigong','ziwei-guasu-zai-fudegong','ziwei-guasu-zai-fumugong',
  'ziwei-huagai-zai-minggong','ziwei-huagai-zai-xiongdigong'
];
function check(url) {
  return new Promise(resolve => {
    const req = https.get(url, {timeout: 10000}, res => { res.resume(); resolve(res.statusCode); });
    req.on('error', e => resolve('ERR:' + e.message));
    req.on('timeout', () => { req.destroy(); resolve('TIMEOUT'); });
  });
}
async function main() {
  let ok = 0, fail = 0;
  const failures = [];
  for (const slug of slugs) {
    const cn = await check(`https://yuetianai.com/articles/${slug}.html`);
    const en = await check(`https://yuetianai.com/articles/en/${slug}.html`);
    if (cn === 200) ok++; else { fail++; failures.push(`CN ${slug}: ${cn}`); }
    if (en === 200) ok++; else { fail++; failures.push(`EN ${slug}: ${en}`); }
  }
  console.log(`Online check: ${ok}/80 OK, ${fail} failed`);
  if (failures.length) { console.log('Failures:'); failures.forEach(f => console.log('  ' + f)); }
  else console.log('ALL ONLINE ✓');
}
main();
