const https=require('https');
const manifest=require(process.argv[2]);
function check(url){return new Promise(r=>{const q=https.get(url,{timeout:10000},x=>{x.resume();r(x.statusCode);});q.on('error',e=>r('ERR:'+e.message));q.on('timeout',()=>{q.destroy();r('TIMEOUT');});});}
async function main(){
 let ok=0,fail=0;const failures=[];
 for(let i=0;i<manifest.length;i++){const a=manifest[i];
  const[c,e]=await Promise.all([check('https://yuetianai.com/articles/'+a.slug+'.html'),check('https://yuetianai.com/articles/en/'+a.slug+'.html')]);
  if(c===200)ok++;else{fail++;failures.push('CN '+a.slug+': '+c);}
  if(e===200)ok++;else{fail++;failures.push('EN '+a.slug+': '+e);}
 }
 console.log('Online: '+ok+'/'+(manifest.length*2)+' OK, '+fail+' failed');
 if(failures.length){failures.slice(0,20).forEach(f=>console.log('  '+f));}else console.log('ALL ONLINE');
}
main();
