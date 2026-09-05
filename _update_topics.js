const fs=require('fs');
const {CAT}=require('./_engine_topic.js');
const manifest=require(process.argv[2]);
const ordered=[...manifest].reverse();

// ---- CN index: 按分类 section 插入 ----
console.log('CN index...');
let cnIndex=fs.readFileSync('articles/index.html','utf8');
let cnAdded=0;
const bySec={};
for(const a of manifest){const c=CAT[a.cat];(bySec[c.sec]=bySec[c.sec]||[]).push(a);}
for(const sec of Object.keys(bySec)){
 if(cnIndex.includes(bySec[sec][0].slug)){console.log('  skip(already) '+sec);continue;}
 const h2=cnIndex.indexOf('<h2>'+sec+'</h2>');
 if(h2<0){console.log('  !! section not found: '+sec);continue;}
 const div=cnIndex.indexOf('<div class="article-list">',h2);
 const pos=cnIndex.indexOf('\n',div)+1;
 let cards='';
 const list=[...bySec[sec]].reverse();
 list.forEach((a,i)=>{cards+=`          <article class="article-card" data-index="${String(i+1).padStart(2,'0')}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">${CAT[a.cat].tag}</span><span><time datetime="${a.date}">${a.label}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;});
 cnIndex=cnIndex.slice(0,pos)+cards+cnIndex.slice(pos);
 // 更新该 section 计数
 const tail=cnIndex.substring(h2);
 const cm=tail.match(/<span>(\d+) 篇<\/span>/);
 if(cm){const rep='<span>'+(parseInt(cm[1])+list.length)+' 篇</span>';
   cnIndex=cnIndex.substring(0,h2)+tail.replace(cm[0],rep);}
 cnAdded+=list.length;
 console.log('  '+sec+' +'+list.length);
}
fs.writeFileSync('articles/index.html',cnIndex,'utf8');
console.log('  CN total +'+cnAdded);

// ---- EN index: 顶部插入 ----
console.log('EN index...');
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
 if(cm)enIndex=enIndex.replace(cm[0],(parseInt(cm[1])+todoEN.length)+' Articles');
 fs.writeFileSync('articles/en/index.html',enIndex,'utf8');
 console.log('  EN +'+todoEN.length);
}

// ---- 专题页：按分类 topic 插入（两种卡片格式）----
console.log('Topic pages...');
const byTopic={};
for(const a of manifest){const tp=CAT[a.cat].topic;if(!tp)continue;(byTopic[tp]=byTopic[tp]||[]).push(a);}
for(const tp of Object.keys(byTopic)){
 let page=fs.readFileSync('articles/'+tp,'utf8');
 const list=byTopic[tp].filter(a=>!page.includes(a.slug));
 if(!list.length){console.log('  skip '+tp);continue;}
 const isAnchorFormat=page.indexOf('<a class="article-card"')>=0 && page.indexOf('<div class="card-body">',page.indexOf('article-card'))<0;
 let cards='';
 if(tp==='ziwei-sihua.html'||tp==='ziwei-helper-malice-stars.html'){
  list.forEach(a=>cards+=`        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${a.date}">${a.label.slice(0,10)}</time></a>\n`);
  const fc=page.indexOf('class="article-card"');
  const pos=page.lastIndexOf('\n',fc)+1;
  page=page.slice(0,pos)+cards+page.slice(pos);
 }else{
  list.forEach((a,i)=>{cards+=`          <article class="article-card" data-index="${String(i+1).padStart(2,'0')}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">${CAT[a.cat].tag}</span><span><time datetime="${a.date}">${a.label}</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;});
  const ld=page.indexOf('<div class="article-list">');
  const p=page.indexOf('\n',ld)+1;
  page=page.slice(0,p)+cards+page.slice(p);
 }
 fs.writeFileSync('articles/'+tp,page,'utf8');
 console.log('  '+tp+' +'+list.length);
}

// ---- Feeds ----
console.log('Feeds...');
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
