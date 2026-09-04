const https = require('https');

const slugs = [
  'ziwei-wuqu-zai-caibogong','ziwei-wuqu-zai-jiegong','ziwei-wuqu-zai-qianyi','ziwei-wuqu-zai-puyigong',
  'ziwei-wuqu-zai-guanlugong','ziwei-wuqu-zai-tianzhaigong','ziwei-wuqu-zai-fudegong','ziwei-wuqu-zai-fumugong',
  'ziwei-tiantong-zai-minggong','ziwei-tiantong-zai-xiongdigong','ziwei-tiantong-zai-fuqigong','ziwei-tiantong-zai-zinvgong',
  'ziwei-tiantong-zai-caibogong','ziwei-tiantong-zai-jiegong','ziwei-tiantong-zai-qianyi','ziwei-tiantong-zai-puyigong',
  'ziwei-tiantong-zai-guanlugong','ziwei-tiantong-zai-tianzhaigong','ziwei-tiantong-zai-fudegong','ziwei-tiantong-zai-fumugong',
  'ziwei-lianzhen-zai-minggong','ziwei-lianzhen-zai-xiongdigong','ziwei-lianzhen-zai-fuqigong','ziwei-lianzhen-zai-zinvgong',
  'ziwei-lianzhen-zai-caibogong','ziwei-lianzhen-zai-jiegong','ziwei-lianzhen-zai-qianyi','ziwei-lianzhen-zai-puyigong',
  'ziwei-lianzhen-zai-guanlugong','ziwei-lianzhen-zai-tianzhaigong','ziwei-lianzhen-zai-fudegong','ziwei-lianzhen-zai-fumugong',
  'ziwei-tianfu-zai-minggong','ziwei-tianfu-zai-xiongdigong','ziwei-tianfu-zai-fuqigong','ziwei-tianfu-zai-zinvgong',
  'ziwei-tianfu-zai-caibogong','ziwei-tianfu-zai-jiegong','ziwei-tianfu-zai-qianyi'
];

function check(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {timeout: 10000}, (res) => {
      resolve(res.statusCode);
      res.resume();
    });
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
  });
}

async function main() {
  let ok = 0, fail = 0;
  for (const slug of slugs) {
    const cnCode = await check(`https://yuetianai.com/articles/${slug}.html`);
    const enCode = await check(`https://yuetianai.com/articles/en/${slug}.html`);
    if (cnCode === 200 && enCode === 200) {
      ok++;
    } else {
      fail++;
      console.log(`FAIL: ${slug} CN=${cnCode} EN=${enCode}`);
    }
  }
  console.log(`\nResult: ${ok}/${slugs.length} articles online (CN+EN both 200)`);
  if (fail === 0) console.log('ALL PASS ✓');
}
main();
