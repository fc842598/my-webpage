const https=require('https');
const manifest=require('./_manifest_0902.json');
function check(url){return new Promise(res=>{const r=https.get(url,{timeout:10000},x=>{x.resume();res(x.statusCode);});r.on('error',e=>res('ERR:'+e.message));r.on('timeout',()=>{r.destroy();res('TIMEOUT');});});}
async function main(){
 let ok=0,fail=0;const failures=[];
 // concurrency limited batches of 8
 const queue=manifest.map(a=>[`https://yuetianai.com/articles/${a.slug}.html`,`CN ${a.slug}`,`https://yuetianai.com/articles/en/${a.slug}.html`,`EN ${a.slug}`]);
 for(let i=0;i<queue.length;i++){
  const[cu,cn,eu,en]=queue[i];
  const[c,e]=await Promise.all([check(cu),check(eu)]);
  if(c===200)ok++;else{fail++;failures.push(cn+': '+c);}
  if(e===200)ok++;else{fail++;failures.push(en+': '+e);}
  if((i+1)%40===0)console.log(`...${i+1}/${queue.length} checked`);
 }
 console.log(`Online: ${ok}/${manifest.length*2} OK, ${fail} failed`);
 if(failures.length){console.log('Failures:');failures.slice(0,20).forEach(f=>console.log('  '+f));}else console.log('ALL ONLINE');
}
main();
