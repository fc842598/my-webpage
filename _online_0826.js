const https = require('https');
const slugs = [
  'ziwei-qingyang-zai-fudegong','ziwei-qingyang-zai-fumugong',
  'ziwei-tuoluo-zai-minggong','ziwei-tuoluo-zai-xiongdigong','ziwei-tuoluo-zai-fuqigong','ziwei-tuoluo-zai-zinvgong',
  'ziwei-tuoluo-zai-caibogong','ziwei-tuoluo-zai-jiegong','ziwei-tuoluo-zai-qianyi','ziwei-tuoluo-zai-puyigong',
  'ziwei-tuoluo-zai-guanlugong','ziwei-tuoluo-zai-tianzhaigong','ziwei-tuoluo-zai-fudegong','ziwei-tuoluo-zai-fumugong',
  'ziwei-huoxing-zai-minggong','ziwei-huoxing-zai-xiongdigong','ziwei-huoxing-zai-fuqigong','ziwei-huoxing-zai-zinvgong',
  'ziwei-huoxing-zai-caibogong','ziwei-huoxing-zai-jiegong','ziwei-huoxing-zai-qianyi','ziwei-huoxing-zai-puyigong',
  'ziwei-huoxing-zai-guanlugong','ziwei-huoxing-zai-tianzhaigong','ziwei-huoxing-zai-fudegong','ziwei-huoxing-zai-fumugong',
  'ziwei-lingxing-zai-minggong','ziwei-lingxing-zai-xiongdigong','ziwei-lingxing-zai-fuqigong','ziwei-lingxing-zai-zinvgong',
  'ziwei-lingxing-zai-caibogong','ziwei-lingxing-zai-jiegong','ziwei-lingxing-zai-qianyi','ziwei-lingxing-zai-puyigong',
  'ziwei-lingxing-zai-guanlugong','ziwei-lingxing-zai-tianzhaigong','ziwei-lingxing-zai-fudegong','ziwei-lingxing-zai-fumugong',
  'ziwei-dikong-zai-minggong','ziwei-dikong-zai-xiongdigong'
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
