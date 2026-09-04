const https = require('https');
const slugs = [
  'ziwei-dikong-zai-fuqigong','ziwei-dikong-zai-zinvgong','ziwei-dikong-zai-caibogong','ziwei-dikong-zai-jiegong',
  'ziwei-dikong-zai-qianyi','ziwei-dikong-zai-puyigong','ziwei-dikong-zai-guanlugong','ziwei-dikong-zai-tianzhaigong',
  'ziwei-dikong-zai-fudegong','ziwei-dikong-zai-fumugong',
  'ziwei-dijie-zai-minggong','ziwei-dijie-zai-xiongdigong','ziwei-dijie-zai-fuqigong','ziwei-dijie-zai-zinvgong',
  'ziwei-dijie-zai-caibogong','ziwei-dijie-zai-jiegong','ziwei-dijie-zai-qianyi','ziwei-dijie-zai-puyigong',
  'ziwei-dijie-zai-guanlugong','ziwei-dijie-zai-tianzhaigong','ziwei-dijie-zai-fudegong','ziwei-dijie-zai-fumugong',
  'ziwei-tianma-zai-minggong','ziwei-tianma-zai-xiongdigong','ziwei-tianma-zai-fuqigong','ziwei-tianma-zai-zinvgong',
  'ziwei-tianma-zai-caibogong','ziwei-tianma-zai-jiegong','ziwei-tianma-zai-qianyi','ziwei-tianma-zai-puyigong',
  'ziwei-tianma-zai-guanlugong','ziwei-tianma-zai-tianzhaigong','ziwei-tianma-zai-fudegong','ziwei-tianma-zai-fumugong',
  'ziwei-lucun-zai-minggong','ziwei-lucun-zai-xiongdigong','ziwei-lucun-zai-fuqigong','ziwei-lucun-zai-zinvgong',
  'ziwei-lucun-zai-caibogong','ziwei-lucun-zai-jiegong'
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
