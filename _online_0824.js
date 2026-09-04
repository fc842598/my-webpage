const https = require('https');
const slugs = [
  'ziwei-jumen-zai-fudegong','ziwei-jumen-zai-fumugong',
  'ziwei-tianxiang-zai-minggong','ziwei-tianxiang-zai-xiongdigong','ziwei-tianxiang-zai-fuqigong','ziwei-tianxiang-zai-zinvgong',
  'ziwei-tianxiang-zai-caibogong','ziwei-tianxiang-zai-jiegong','ziwei-tianxiang-zai-qianyi','ziwei-tianxiang-zai-puyigong',
  'ziwei-tianxiang-zai-guanlugong','ziwei-tianxiang-zai-tianzhaigong','ziwei-tianxiang-zai-fudegong','ziwei-tianxiang-zai-fumugong',
  'ziwei-tianliang-zai-minggong','ziwei-tianliang-zai-xiongdigong','ziwei-tianliang-zai-fuqigong','ziwei-tianliang-zai-zinvgong',
  'ziwei-tianliang-zai-caibogong','ziwei-tianliang-zai-jiegong','ziwei-tianliang-zai-qianyi','ziwei-tianliang-zai-puyigong',
  'ziwei-tianliang-zai-guanlugong','ziwei-tianliang-zai-tianzhaigong','ziwei-tianliang-zai-fudegong','ziwei-tianliang-zai-fumugong',
  'ziwei-qisha-zai-minggong','ziwei-qisha-zai-xiongdigong','ziwei-qisha-zai-fuqigong','ziwei-qisha-zai-zinvgong',
  'ziwei-qisha-zai-caibogong','ziwei-qisha-zai-jiegong','ziwei-qisha-zai-qianyi','ziwei-qisha-zai-puyigong',
  'ziwei-qisha-zai-guanlugong','ziwei-qisha-zai-tianzhaigong','ziwei-qisha-zai-fudegong','ziwei-qisha-zai-fumugong',
  'ziwei-pojun-zai-minggong','ziwei-pojun-zai-xiongdigong','ziwei-pojun-zai-fuqigong','ziwei-pojun-zai-zinvgong',
  'ziwei-pojun-zai-caibogong','ziwei-pojun-zai-jiegong','ziwei-pojun-zai-qianyi','ziwei-pojun-zai-puyigong',
  'ziwei-pojun-zai-guanlugong','ziwei-pojun-zai-tianzhaigong','ziwei-pojun-zai-fudegong','ziwei-pojun-zai-fumugong',
  'ziwei-zuofu-zai-minggong','ziwei-zuofu-zai-xiongdigong','ziwei-zuofu-zai-fuqigong','ziwei-zuofu-zai-zinvgong',
  'ziwei-zuofu-zai-caibogong','ziwei-zuofu-zai-jiegong','ziwei-zuofu-zai-qianyi','ziwei-zuofu-zai-puyigong',
  'ziwei-zuofu-zai-guanlugong','ziwei-zuofu-zai-tianzhaigong','ziwei-zuofu-zai-fudegong','ziwei-zuofu-zai-fumugong',
  'ziwei-youbi-zai-minggong','ziwei-youbi-zai-xiongdigong','ziwei-youbi-zai-fuqigong','ziwei-youbi-zai-zinvgong',
  'ziwei-youbi-zai-caibogong','ziwei-youbi-zai-jiegong','ziwei-youbi-zai-qianyi','ziwei-youbi-zai-puyigong',
  'ziwei-youbi-zai-guanlugong','ziwei-youbi-zai-tianzhaigong','ziwei-youbi-zai-fudegong','ziwei-youbi-zai-fumugong',
  'ziwei-wenchang-zai-minggong','ziwei-wenchang-zai-xiongdigong','ziwei-wenchang-zai-fuqigong','ziwei-wenchang-zai-zinvgong',
  'ziwei-wenchang-zai-caibogong','ziwei-wenchang-zai-jiegong','ziwei-wenchang-zai-qianyi','ziwei-wenchang-zai-puyigong',
  'ziwei-wenchang-zai-guanlugong','ziwei-wenchang-zai-tianzhaigong','ziwei-wenchang-zai-fudegong','ziwei-wenchang-zai-fumugong',
  'ziwei-wenqu-zai-minggong','ziwei-wenqu-zai-xiongdigong','ziwei-wenqu-zai-fuqigong','ziwei-wenqu-zai-zinvgong',
  'ziwei-wenqu-zai-caibogong','ziwei-wenqu-zai-jiegong','ziwei-wenqu-zai-qianyi','ziwei-wenqu-zai-puyigong',
  'ziwei-wenqu-zai-guanlugong','ziwei-wenqu-zai-tianzhaigong','ziwei-wenqu-zai-fudegong','ziwei-wenqu-zai-fumugong',
  'ziwei-tiankui-zai-minggong','ziwei-tianyue-zai-minggong'
];

function check(url) {
  return new Promise(resolve => {
    const req = https.get(url, {timeout: 10000}, res => {
      res.resume();
      resolve(res.statusCode);
    });
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
  console.log(`Online check: ${ok}/200 OK, ${fail} failed`);
  if (failures.length) { console.log('Failures:'); failures.forEach(f => console.log('  ' + f)); }
  else console.log('ALL ONLINE ✓');
}
main();
