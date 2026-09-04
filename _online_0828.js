const https = require('https');
const slugs = [
  'ziwei-lucun-zai-qianyi','ziwei-lucun-zai-puyigong','ziwei-lucun-zai-guanlugong','ziwei-lucun-zai-tianzhaigong','ziwei-lucun-zai-fudegong','ziwei-lucun-zai-fumugong',
  'ziwei-hongluan-zai-minggong','ziwei-hongluan-zai-xiongdigong','ziwei-hongluan-zai-fuqigong','ziwei-hongluan-zai-zinvgong',
  'ziwei-hongluan-zai-caibogong','ziwei-hongluan-zai-jiegong','ziwei-hongluan-zai-qianyi','ziwei-hongluan-zai-puyigong',
  'ziwei-hongluan-zai-guanlugong','ziwei-hongluan-zai-tianzhaigong','ziwei-hongluan-zai-fudegong','ziwei-hongluan-zai-fumugong',
  'ziwei-tianxi-zai-minggong','ziwei-tianxi-zai-xiongdigong','ziwei-tianxi-zai-fuqigong','ziwei-tianxi-zai-zinvgong',
  'ziwei-tianxi-zai-caibogong','ziwei-tianxi-zai-jiegong','ziwei-tianxi-zai-qianyi','ziwei-tianxi-zai-puyigong',
  'ziwei-tianxi-zai-guanlugong','ziwei-tianxi-zai-tianzhaigong','ziwei-tianxi-zai-fudegong','ziwei-tianxi-zai-fumugong',
  'ziwei-xianchi-zai-minggong','ziwei-xianchi-zai-xiongdigong','ziwei-xianchi-zai-fuqigong','ziwei-xianchi-zai-zinvgong',
  'ziwei-xianchi-zai-caibogong','ziwei-xianchi-zai-jiegong','ziwei-xianchi-zai-qianyi','ziwei-xianchi-zai-puyigong',
  'ziwei-xianchi-zai-guanlugong','ziwei-xianchi-zai-tianzhaigong'
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
