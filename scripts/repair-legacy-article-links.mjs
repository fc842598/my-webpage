import {readdirSync, readFileSync, writeFileSync, existsSync} from 'node:fs';
import path from 'node:path';

const base = process.cwd();
const files = ['articles', 'articles/en'].flatMap(dir => readdirSync(dir).filter(f => f.endsWith('.html')).map(f => `${dir}/${f}`));
const aliases = {
  'ziwei-qianyi.html':'ziwei-qianyigong.html',
  'ziwei-jieegong.html':'ziwei-jiegong.html',
  'ziwei-jiaoyougong.html':'ziwei-puyigong.html',
  'ziwei-puyougong.html':'ziwei-puyigong.html',
  'ziwei-zinv.html':'ziwei-zinvgong.html',
  'ziwei-sihua.html':'ziwei-four-transformations.html',
  'ziwei-tianji-zuoming.html':'ziwei-tianji-zai-minggong.html',
  'ziwei-caibogong-huaquan':'ziwei-caibogong-huaquan.html',
  'ziwei-konggong.html':'ziwei-konggong-xianjieduigong-zaihuisanfang.html',
};
const stars = {
  bazuo:'santai-bazuo', santai:'santai-bazuo', dijie:'dikong-dijie', dikong:'dikong-dijie',
  enguang:'enguang-tiangui', tiangui:'enguang-tiangui', fenggao:'taifu-fenggao', taifu:'taifu-fenggao',
  fengge:'longchi-fengge', longchi:'longchi-fengge', guasu:'guchen-guasu', guchen:'guchen-guasu',
  hongluan:'hongluan-tianxi', tianxi:'hongluan-tianxi', huagai:'huagai-xing',
  huoxing:'huoxing-lingxing', lingxing:'huoxing-lingxing', lucun:'lucun-xing',
  posui:'feilian-posui', qingyang:'qingyang-tuoluo', tuoluo:'qingyang-tuoluo',
  tianku:'tianku-tianxu', tianxu:'tianku-tianxu', tianma:'tianma-xing',
  tianshang:'tianshang-tianshi', tianshi:'tianshang-tianshi', tianxing:'tianxing-xing',
  tianyao:'xianchi-tianyao', xianchi:'xianchi-tianyao', tianyue:'tiankui-tianyue',
  tiankui:'tiankui-tianyue', yinsha:'yinsha-xing', wenchang:'wenchang-wenqu',
  wenqu:'wenchang-wenqu', youbi:'zuofu-youbi', zuofu:'zuofu-youbi',
};
for (const [star, slug] of Object.entries(stars)) aliases[`ziwei-star-${star}.html`] = `ziwei-${slug}.html`;
const englishPairs = new Map();
for (const file of files.filter(f=>f.startsWith('articles/en/'))) {
  const html=readFileSync(file,'utf8');
  const zh=html.match(/<link\b[^>]*hreflang=["']zh-CN["'][^>]*href=["']https:\/\/(?:www\.)?yuetianai\.com\/articles\/([^/"']+\.html)["']/i)?.[1];
  if (zh && !englishPairs.has(zh)) englishPairs.set(zh,file);
  else if (zh && englishPairs.get(zh)!==file) englishPairs.set(zh,null);
}
const explicitEnglish = {
  'ziwei-four-transformations.html':'articles/en/four-transformations.html',
  'ziwei-sihua.html':'articles/en/four-transformations.html',
  'ziwei-palaces.html':'articles/en/palace-context.html',
  'ziwei-cycles.html':'articles/en/ten-year-cycle.html',
  'ziwei-learning-path.html':'articles/en/how-to-read-zi-wei-dou-shu-chart.html',
};
const decisions = new Map(); let changedFiles=0, repaired=0, removed=0;
for (const file of files) {
  const html=readFileSync(file,'utf8');
  const updated=html.replace(/<a\b([^>]*\bhref\s*=\s*(["'])([^"']+)\2[^>]*)>([\s\S]*?)<\/a>/gi,(whole,attrs,quote,href,body)=>{
    let url; try {url=new URL(href,`https://yuetianai.com/${file}`);} catch{return whole;}
    if(!['yuetianai.com','www.yuetianai.com'].includes(url.hostname) || !url.pathname.startsWith('/articles/'))return whole;
    const missing=url.pathname.slice(1);
    if(existsSync(path.join(base,missing)) || !/\.html$|huaquan$/.test(missing))return whole;
    const name=path.posix.basename(missing), en=missing.startsWith('articles/en/');
    const mapped=aliases[name] || name;
    const target=en ? (explicitEnglish[name] || (existsSync(`articles/en/${mapped}`) ? `articles/en/${mapped}` : englishPairs.get(mapped))) : (aliases[name] ? `articles/${mapped}` : null);
    if(target && existsSync(target)) {
      repaired++;decisions.set(missing,{target,action:'replace'});
      return `<a${attrs.replace(/(\bhref\s*=\s*)(["'])[^"']+\2/i,`$1${quote}/${target}${url.search}${url.hash}${quote}`)}>${body}</a>`;
    }
    removed++;decisions.set(missing,{target:null,action:'remove broken recommendation or unwrap inline link'});
    // Recommendation-only cards can disappear; inline prose must remain readable.
    return /\bclass\s*=\s*["'][^"']*\bcard-link\b/i.test(attrs) ? '' : body;
  });
  if(updated!==html){changedFiles++;if(process.argv.includes('--write'))writeFileSync(file,updated.replace(/^[ \t]+(?=\r?$)/gm,''));}
}
console.log(JSON.stringify({changedFiles,repaired,removed,targets:decisions.size,decisions:Object.fromEntries(decisions)},null,2));
if(process.argv.includes('--check') && (repaired||removed))process.exitCode=1;
