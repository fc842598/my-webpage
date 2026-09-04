const m=require('./_manifest_2026-09-04.json');const {execSync}=require('child_process');
let non=[];
for(const a of m){for(const p of ['articles/'+a.slug+'.html','articles/en/'+a.slug+'.html']){
 const st=execSync('git status --porcelain -- "'+p+'"').toString().trim();
 if(!st.startsWith('??'))non.push(st);
}}
console.log('non-new:',non.length);console.log(non.slice(0,10).join('\n'));
