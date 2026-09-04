const https = require('https');
const slugs = [
  'ziwei-huaji-zai-caibogong','ziwei-huaji-zai-jiegong','ziwei-huaji-zai-qianyi','ziwei-huaji-zai-puyigong',
  'ziwei-huaji-zai-guanlugong','ziwei-huaji-zai-tianzhaigong','ziwei-huaji-zai-fudegong','ziwei-huaji-zai-fumugong',
  'ziwei-tiankui-zai-xiongdigong','ziwei-tiankui-zai-fuqigong','ziwei-tiankui-zai-zinvgong','ziwei-tiankui-zai-caibogong',
  'ziwei-tiankui-zai-jiegong','ziwei-tiankui-zai-qianyi','ziwei-tiankui-zai-puyigong','ziwei-tiankui-zai-guanlugong',
  'ziwei-tiankui-zai-tianzhaigong','ziwei-tiankui-zai-fudegong','ziwei-tiankui-zai-fumugong',
  'ziwei-tianyue-zai-xiongdigong','ziwei-tianyue-zai-fuqigong','ziwei-tianyue-zai-zinvgong','ziwei-tianyue-zai-caibogong',
  'ziwei-tianyue-zai-jiegong','ziwei-tianyue-zai-qianyi','ziwei-tianyue-zai-puyigong','ziwei-tianyue-zai-guanlugong',
  'ziwei-tianyue-zai-tianzhaigong','ziwei-tianyue-zai-fudegong','ziwei-tianyue-zai-fumugong',
  'ziwei-qingyang-zai-minggong','ziwei-qingyang-zai-xiongdigong','ziwei-qingyang-zai-fuqigong','ziwei-qingyang-zai-zinvgong',
  'ziwei-qingyang-zai-caibogong','ziwei-qingyang-zai-jiegong','ziwei-qingyang-zai-qianyi','ziwei-qingyang-zai-puyigong',
  'ziwei-qingyang-zai-guanlugong','ziwei-qingyang-zai-tianzhaigong'
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
