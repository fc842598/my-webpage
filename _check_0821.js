const https=require('https');
const slugs=[
'ziwei-ziwei-zai-minggong','ziwei-ziwei-zai-xiongdigong','ziwei-ziwei-zai-fuqigong','ziwei-ziwei-zai-zinvgong',
'ziwei-ziwei-zai-caibogong','ziwei-ziwei-zai-jiegong','ziwei-ziwei-zai-qianyi','ziwei-ziwei-zai-puyigong',
'ziwei-ziwei-zai-guanlugong','ziwei-ziwei-zai-tianzhaigong','ziwei-ziwei-zai-fudegong','ziwei-ziwei-zai-fumugong',
'ziwei-tianji-zai-minggong','ziwei-tianji-zai-xiongdigong','ziwei-tianji-zai-fuqigong','ziwei-tianji-zai-zinvgong',
'ziwei-tianji-zai-caibogong','ziwei-tianji-zai-jiegong','ziwei-tianji-zai-qianyi','ziwei-tianji-zai-puyigong',
'ziwei-tianji-zai-guanlugong','ziwei-tianji-zai-tianzhaigong','ziwei-tianji-zai-fudegong','ziwei-tianji-zai-fumugong',
'ziwei-taiyang-zai-minggong','ziwei-taiyang-zai-xiongdigong','ziwei-taiyang-zai-fuqigong','ziwei-taiyang-zai-zinvgong',
'ziwei-taiyang-zai-caibogong','ziwei-taiyang-zai-jiegong','ziwei-taiyang-zai-qianyi','ziwei-taiyang-zai-puyigong',
'ziwei-taiyang-zai-guanlugong','ziwei-taiyang-zai-tianzhaigong','ziwei-taiyang-zai-fudegong','ziwei-taiyang-zai-fumugong',
'ziwei-wuqu-zai-minggong','ziwei-wuqu-zai-xiongdigong','ziwei-wuqu-zai-fuqigong','ziwei-wuqu-zai-zinvgong'
];
function check(url){return new Promise(resolve=>{const req=https.get(url,{timeout:10000},res=>{resolve(res.statusCode);res.resume();});req.on('error',()=>resolve('ERR'));req.on('timeout',()=>{req.destroy();resolve('TIMEOUT');});});}
(async()=>{
let ok=0,fail=0;
const failures=[];
for(const slug of slugs){
  const cn=await check(`https://yuetianai.com/articles/${slug}.html`);
  const en=await check(`https://yuetianai.com/articles/en/${slug}.html`);
  if(cn===200&&en===200){ok++;}
  else{fail++;failures.push(`${slug}: CN=${cn} EN=${en}`);}
}
console.log(`OK: ${ok}/40, FAIL: ${fail}`);
if(failures.length) console.log(failures.join('\n'));
})();
