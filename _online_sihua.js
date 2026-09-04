const https = require('https');
const slugs = [
  'ziwei-hualu-zai-minggong','ziwei-hualu-zai-xiongdigong','ziwei-hualu-zai-fuqigong','ziwei-hualu-zai-zinvgong',
  'ziwei-hualu-zai-caibogong','ziwei-hualu-zai-jiegong','ziwei-hualu-zai-qianyi','ziwei-hualu-zai-puyigong',
  'ziwei-hualu-zai-guanlugong','ziwei-hualu-zai-tianzhaigong','ziwei-hualu-zai-fudegong','ziwei-hualu-zai-fumugong',
  'ziwei-huaquan-zai-minggong','ziwei-huaquan-zai-xiongdigong','ziwei-huaquan-zai-fuqigong','ziwei-huaquan-zai-zinvgong',
  'ziwei-huaquan-zai-caibogong','ziwei-huaquan-zai-jiegong','ziwei-huaquan-zai-qianyi','ziwei-huaquan-zai-puyigong',
  'ziwei-huaquan-zai-guanlugong','ziwei-huaquan-zai-tianzhaigong','ziwei-huaquan-zai-fudegong','ziwei-huaquan-zai-fumugong',
  'ziwei-huake-zai-minggong','ziwei-huake-zai-xiongdigong','ziwei-huake-zai-fuqigong','ziwei-huake-zai-zinvgong',
  'ziwei-huake-zai-caibogong','ziwei-huake-zai-jiegong','ziwei-huake-zai-qianyi','ziwei-huake-zai-puyigong',
  'ziwei-huake-zai-guanlugong','ziwei-huake-zai-tianzhaigong','ziwei-huake-zai-fudegong','ziwei-huake-zai-fumugong',
  'ziwei-huaji-zai-minggong','ziwei-huaji-zai-xiongdigong','ziwei-huaji-zai-fuqigong','ziwei-huaji-zai-zinvgong'
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
