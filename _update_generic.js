const fs=require('fs');
const manifest=require(process.argv[2]);
const ordered=[...manifest].reverse();
console.log('Updating CN index...');
let cnIndex=fs.readFileSync('articles/index.html','utf8');
const todoCN=ordered.filter(a=>!cnIndex.includes(a.slug));
if(todoCN.length){
  const h2=cnIndex.indexOf('<h2>辅煞曜</h2>');
  const div=cnIndex.indexOf('<div class="article-list">',h2);
  const pos=cnIndex.indexOf('\n',div)+1;
  let cards='';
  todoCN.forEach((a,i)=>{cards+=`          <article class="article-card" data-index="${String(i+1).padStart(2,'0')}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">辅煞曜</span><span><time datetime="${a.date}">${a.label}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;});
  cnIndex=cnIndex.slice(0,pos)+cards+cnIndex.slice(pos);
  const cm=cnIndex.substring(h2).match(/<span>(\d+) 篇<\/span>/);
  if(cm)cnIndex=cnIndex.substring(0,h2)+cnIndex.substring(h2).replace(cm[0],`<span>${parseInt(cm[1])+todoCN.length} 篇</span>`);
  fs.writeFileSync('articles/index.html',cnIndex,'utf8');
  console.log('  CN +'+todoCN.length);
}
console.log('Updating EN index...');
let enIndex=fs.readFileSync('articles/en/index.html','utf8');
const todoEN=ordered.filter(a=>!enIndex.includes(a.slug));
if(todoEN.length){
  const ld=enIndex.indexOf('<div class="article-list">');
  const fc=enIndex.indexOf('</article>',enIndex.indexOf('article-card',ld));
  const pos=enIndex.indexOf('\n',fc)+1;
  let cards='';
  todoEN.forEach((a,i)=>{cards+=`          <article class="article-card" data-index="${String(i+2).padStart(2,'0')}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${a.date}">${a.label}</time></span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read article</a>
            </div>
          </article>
`;});
  enIndex=enIndex.slice(0,pos)+cards+enIndex.slice(pos);
  const cm=enIndex.match(/(\d+) Articles/);
  if(cm)enIndex=enIndex.replace(cm[0],`${parseInt(cm[1])+todoEN.length} Articles`);
  fs.writeFileSync('articles/en/index.html',enIndex,'utf8');
  console.log('  EN +'+todoEN.length);
}
console.log('Updating topic page...');
let topic=fs.readFileSync('articles/ziwei-helper-malice-stars.html','utf8');
const todoT=ordered.filter(a=>!topic.includes(a.slug));
if(todoT.length){
  const fc=topic.indexOf('class="article-card"');
  const pos=topic.lastIndexOf('\n',fc)+1;
  let cards='';
  for(const a of todoT)cards+=`        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${a.date}">${a.label.slice(0,10)}</time></a>\n`;
  topic=topic.slice(0,pos)+cards+topic.slice(pos);
  fs.writeFileSync('articles/ziwei-helper-malice-stars.html',topic,'utf8');
  console.log('  Topic +'+todoT.length);
}
console.log('Updating feeds...');
let cnFeed=fs.readFileSync('feed.xml','utf8');
const todoFCN=manifest.filter(a=>!cnFeed.includes(a.slug));
if(todoFCN.length){
  let items='';for(const a of[...todoFCN].reverse())items+=`  <item><title>${a.cnTitle}</title><link>https://yuetianai.com/articles/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid><pubDate>${a.rfc}</pubDate><description><![CDATA[${a.cnTitle}]]></description></item>\n`;
  cnFeed=cnFeed.replace('<channel>','<channel>\n'+items);
  fs.writeFileSync('feed.xml',cnFeed,'utf8');console.log('  CN feed +'+todoFCN.length);
}
let enFeed=fs.readFileSync('articles/en/feed.xml','utf8');
const todoFEN=manifest.filter(a=>!enFeed.includes(a.slug));
if(todoFEN.length){
  let items='';for(const a of[...todoFEN].reverse())items+=`  <item><title>${a.enTitle}</title><link>https://yuetianai.com/articles/en/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid><pubDate>${a.rfc}</pubDate><description><![CDATA[${a.enTitle}]]></description></item>\n`;
  enFeed=enFeed.replace('<channel>','<channel>\n'+items);
  fs.writeFileSync('articles/en/feed.xml',enFeed,'utf8');console.log('  EN feed +'+todoFEN.length);
}
console.log('Done.');
