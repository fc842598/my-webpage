const https = require('https');
const slugs = [
  'ziwei-tianfu-zai-puyigong','ziwei-tianfu-zai-guanlugong','ziwei-tianfu-zai-tianzhaigong','ziwei-tianfu-zai-fudegong','ziwei-tianfu-zai-fumugong',
  'ziwei-taiyin-zai-minggong','ziwei-taiyin-zai-xiongdigong','ziwei-taiyin-zai-fuqigong','ziwei-taiyin-zai-zinvgong',
  'ziwei-taiyin-zai-caibogong','ziwei-taiyin-zai-jiegong','ziwei-taiyin-zai-qianyi','ziwei-taiyin-zai-puyigong',
  'ziwei-taiyin-zai-guanlugong','ziwei-taiyin-zai-tianzhaigong','ziwei-taiyin-zai-fudegong','ziwei-taiyin-zai-fumugong',
  'ziwei-tanlang-zai-minggong','ziwei-tanlang-zai-xiongdigong','ziwei-tanlang-zai-fuqigong','ziwei-tanlang-zai-zinvgong',
  'ziwei-tanlang-zai-caibogong','ziwei-tanlang-zai-jiegong','ziwei-tanlang-zai-qianyi','ziwei-tanlang-zai-puyigong',
  'ziwei-tanlang-zai-guanlugong','ziwei-tanlang-zai-tianzhaigong','ziwei-tanlang-zai-fudegong','ziwei-tanlang-zai-fumugong',
  'ziwei-jumen-zai-minggong','ziwei-jumen-zai-xiongdigong','ziwei-jumen-zai-fuqigong','ziwei-jumen-zai-zinvgong',
  'ziwei-jumen-zai-caibogong','ziwei-jumen-zai-jiegong','ziwei-jumen-zai-qianyi','ziwei-jumen-zai-puyigong',
  'ziwei-jumen-zai-guanlugong','ziwei-jumen-zai-tianzhaigong'
];
function check(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {timeout: 10000}, (res) => { resolve(res.statusCode); res.resume(); });
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
  });
}
async function main() {
  let ok = 0, fail = 0;
  for (const slug of slugs) {
    const cn = await check(`https://yuetianai.com/articles/${slug}.html`);
    const en = await check(`https://yuetianai.com/articles/en/${slug}.html`);
    if (cn === 200 && en === 200) { ok++; }
    else { fail++; console.log(`FAIL: ${slug} CN=${cn} EN=${en}`); }
  }
  console.log(`\nResult: ${ok}/${slugs.length} articles online (CN+EN both 200)`);
  if (fail === 0) console.log('ALL PASS ✓');
}
main();
