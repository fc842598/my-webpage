const https=require('https');
https.get('https://yuetianai.com/articles/ziwei-zifu-tonggong-zhenge-jiage-zenme-bianren.html',r=>{
 let d='';r.on('data',c=>d+=c);r.on('end',()=>{
  console.log('status',r.statusCode);
  console.log('CN h1 ok',d.includes('紫微斗数紫府同宫是真格还是假格'));
  console.log('lead ok',d.includes('贵气和库藏同处一宫'));
  console.log('ol',(d.match(/<ol>/g)||[]).length,'hreflangEn',d.includes('hreflang="en"'),'jsonld',d.includes('BreadcrumbList'));
 });
});
