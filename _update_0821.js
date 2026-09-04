const fs=require('fs');
const date='2026-08-21T10:15:00+08:00';
const dateShort='2026-08-21 10:15';

const articles=[
['ziwei-ziwei-zai-minggong','紫微在命宫：帝王星坐命的人，到底强在哪里又累在哪里','Zi Wei in Life Palace: Where the Emperor Star Is Strong and Where It Tires'],
['ziwei-ziwei-zai-xiongdigong','紫微在兄弟宫：你的兄弟姐妹是贵人还是竞争对手','Zi Wei in Siblings Palace: Are Your Siblings Benefactors or Rivals'],
['ziwei-ziwei-zai-fuqigong','紫微在夫妻宫：另一半强势是好事还是坏事','Zi Wei in Spouse Palace: Is a Dominant Partner Good or Bad'],
['ziwei-ziwei-zai-zinvgong','紫微在子女宫：孩子有主见是福气还是操心','Zi Wei in Children Palace: Is a Strong-Willed Child a Blessing or a Worry'],
['ziwei-ziwei-zai-caibogong','紫微在财帛宫：你的钱跟「地位」绑在一起','Zi Wei in Wealth Palace: Your Money Is Tied to Status'],
['ziwei-ziwei-zai-jiegong','紫微在疾厄宫：帝王星在健康宫意味着什么','Zi Wei in Health Palace: What the Emperor Star Means for Health'],
['ziwei-ziwei-zai-qianyi','紫微在迁移宫：出门在外你就是「老大」','Zi Wei in Travel Palace: You\'re the "Boss" When Out and About'],
['ziwei-ziwei-zai-puyigong','紫微在仆役宫：你的朋友圈里有「大人物」','Zi Wei in Friends Palace: There Are "Big Figures" in Your Social Circle'],
['ziwei-ziwei-zai-guanlugong','紫微在官禄宫：天生的管理者，但要小心「什么都想管」','Zi Wei in Career: A Born Manager, but Beware of Wanting to Control Everything'],
['ziwei-ziwei-zai-tianzhaigong','紫微在田宅宫：家里你说了算，但家也需要温度','Zi Wei in Property Palace: You Call the Shots at Home, but Home Needs Warmth Too'],
['ziwei-ziwei-zai-fudegong','紫微在福德宫：精神世界里的「帝王」','Zi Wei in Fortune Palace: The "Emperor" of the Inner World'],
['ziwei-ziwei-zai-fumugong','紫微在父母宫：父母中有一方是「权威型」','Zi Wei in Parents Palace: One Parent Is the "Authority Figure"'],
['ziwei-tianji-zai-minggong','天机在命宫：脑子转得最快的人，为什么反而容易纠结','Tian Ji in Life Palace: Why the Quickest Mind Tends to Overthink'],
['ziwei-tianji-zai-xiongdigong','天机在兄弟宫：聪明的兄弟姐妹，也可能是最善变的','Tian Ji in Siblings Palace: Clever Siblings, but Possibly the Most Changeable'],
['ziwei-tianji-zai-fuqigong','天机在夫妻宫：聪明的另一半，也是最需要沟通的','Tian Ji in Spouse Palace: A Clever Partner Who Needs Communication Most'],
['ziwei-tianji-zai-zinvgong','天机在子女宫：聪明的孩子，需要的是引导而不是限制','Tian Ji in Children Palace: A Clever Child Needs Guidance, Not Restriction'],
['ziwei-tianji-zai-caibogong','天机在财帛宫：靠脑子赚钱，也要靠脑子守财','Tian Ji in Wealth Palace: Earn with Your Brain, and Keep It with Your Brain Too'],
['ziwei-tianji-zai-jiegong','天机在疾厄宫：想太多的人，身体也会跟着累','Tian Ji in Health Palace: Overthinkers\' Bodies Get Tired Too'],
['ziwei-tianji-zai-qianyi','天机在迁移宫：在外脑子转得快，机会也在走动中','Tian Ji in Travel Palace: Quick Mind Out and About, Opportunities in Movement'],
['ziwei-tianji-zai-puyigong','天机在仆役宫：朋友多是聪明人，但真心的有几个','Tian Ji in Friends Palace: Many Clever Friends, but How Many Are True'],
['ziwei-tianji-zai-guanlugong','天机在官禄宫：靠脑子吃饭的事业运','Tian Ji in Career: A Career Built on Brainpower'],
['ziwei-tianji-zai-tianzhaigong','天机在田宅宫：家里的「智多星」，也可能经常搬家','Tian Ji in Property Palace: The "Brain" at Home, Possibly a Frequent Mover'],
['ziwei-tianji-zai-fudegong','天机在福德宫：停不下来的脑子，需要学会关机','Tian Ji in Fortune Palace: A Mind That Won\'t Stop Needs to Learn to Shut Down'],
['ziwei-tianji-zai-fumugong','天机在父母宫：聪明但可能善变的父母','Tian Ji in Parents Palace: Clever but Possibly Changeable Parents'],
['ziwei-taiyang-zai-minggong','太阳在命宫：发光发热的人，也要学会留能量给自己','Tai Yang in Life Palace: People Who Radiate Heat Must Also Save Energy for Themselves'],
['ziwei-taiyang-zai-xiongdigong','太阳在兄弟宫：兄弟姐妹中的「大哥大姐」','Tai Yang in Siblings Palace: The "Big Brother/Sister" Among Siblings'],
['ziwei-taiyang-zai-fuqigong','太阳在夫妻宫：另一半是「小太阳」，温暖但也可能刺眼','Tai Yang in Spouse Palace: A "Little Sun" Partner — Warm but Sometimes Blinding'],
['ziwei-taiyang-zai-zinvgong','太阳在子女宫：孩子是「小太阳」，热情但需要引导','Tai Yang in Children Palace: A "Little Sun" Child — Warm but Needing Guidance'],
['ziwei-taiyang-zai-caibogong','太阳在财帛宫：钱要赚在明处，也要花在明处','Tai Yang in Wealth Palace: Earn Openly, Spend Openly'],
['ziwei-taiyang-zai-jiegong','太阳在疾厄宫：注意心脏、眼睛和「上火」','Tai Yang in Health Palace: Watch the Heart, Eyes, and "Internal Heat"'],
['ziwei-taiyang-zai-qianyi','太阳在迁移宫：在外发光发热，贵人在远方','Tai Yang in Travel Palace: Radiating Outside, Benefactors Far Away'],
['ziwei-taiyang-zai-puyigong','太阳在仆役宫：朋友多贵人，但也要防「酒肉朋友」','Tai Yang in Friends Palace: Many Benefactor Friends, but Beware "Fair-Weather Friends"'],
['ziwei-taiyang-zai-guanlugong','太阳在官禄宫：事业上的「发光体」，适合站在台前','Tai Yang in Career: A "Luminous Body" at Work, Suited to the Spotlight'],
['ziwei-taiyang-zai-tianzhaigong','太阳在田宅宫：家里的「太阳」，温暖但也可能太强势','Tai Yang in Property Palace: The "Sun" at Home — Warm but Possibly Overbearing'],
['ziwei-taiyang-zai-fudegong','太阳在福德宫：心里有光的人，走到哪里都不暗','Tai Yang in Fortune Palace: Those with Light in Their Hearts Are Never in Darkness'],
['ziwei-taiyang-zai-fumugong','太阳在父母宫：父亲影响深远，亲子关系像阳光也像烈日','Tai Yang in Parents Palace: Deep Father Influence; Parent-Child Bond Like Sunlight or Scorching Heat'],
['ziwei-wuqu-zai-minggong','武曲在命宫：财星坐命的人，务实到骨子里','Wu Qu in Life Palace: The Finance Star in Life — Pragmatic to the Bone'],
['ziwei-wuqu-zai-xiongdigong','武曲在兄弟宫：务实的兄弟姐妹，谈钱要分明','Wu Qu in Siblings Palace: Pragmatic Siblings — Keep Money Matters Clear'],
['ziwei-wuqu-zai-fuqigong','武曲在夫妻宫：另一半务实可靠，但浪漫可能是奢侈品','Wu Qu in Spouse Palace: A Pragmatic, Reliable Partner — but Romance May Be a Luxury'],
['ziwei-wuqu-zai-zinvgong','武曲在子女宫：孩子务实坚毅，但要教他「柔软」','Wu Qu in Children Palace: A Pragmatic, Resilient Child — but Teach Softness']
];

function cnCard(slug,title,idx){
  return `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">主星</span><span><time datetime="${date}">${dateShort}</time></span></div>
              <h3><a href="${slug}.html">${title}</a></h3>
            </div>
          </article>`;
}
function enCard(slug,title,idx){
  return `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Main Stars</span><span><time datetime="${date}">${dateShort}</time></span></div>
              <h3><a href="${slug}.html">${title}</a></h3>
            </div>
          </article>`;
}

// 1. Update CN index - insert into 主星 section
let cnIdx=fs.readFileSync('articles/index.html','utf8');
const cnSectionStart=cnIdx.indexOf('<h2>主星</h2>');
const cnListStart=cnIdx.indexOf('<div class="article-list">',cnSectionStart);
const cnListEnd=cnIdx.indexOf('</div>',cnListStart);
let cnCards=articles.map((a,i)=>cnCard(a[0],a[1],238+i)).join('\n');
cnIdx=cnIdx.slice(0,cnListEnd)+'\n'+cnCards+'\n          '+cnIdx.slice(cnListEnd);
// Update count 18 -> 58
cnIdx=cnIdx.replace(/(<h2>主星<\/h2>\s*<span[^>]*>[^<]*<\/span>\s*<span class="section-toggle"><span>)\d+( 篇<\/span>)/,'$158$2');
fs.writeFileSync('articles/index.html',cnIdx,'utf8');
console.log('CN index updated');

// 2. Update EN index - insert at top of en-article-index
let enIdx=fs.readFileSync('articles/en/index.html','utf8');
const enListStart=enIdx.indexOf('id="en-article-index"');
const enListTagEnd=enIdx.indexOf('>',enListStart)+1;
let enCards=articles.map((a,i)=>enCard(a[0],a[2],860+i)).join('\n');
enIdx=enIdx.slice(0,enListTagEnd)+'\n'+enCards+enIdx.slice(enListTagEnd);
fs.writeFileSync('articles/en/index.html',enIdx,'utf8');
console.log('EN index updated');

// 3. Update topic page ziwei-main-stars.html
let topic=fs.readFileSync('articles/ziwei-main-stars.html','utf8');
// Update count 87 -> 127
topic=topic.replace(/(<span>)\d+( 篇<\/span>)/,'$1127$2');
// Insert cards into article-list
const topicListStart=topic.indexOf('<div class="article-list">');
const topicListEnd=topic.indexOf('</div>',topicListStart);
let topicCards=articles.map((a,i)=>cnCard(a[0],a[1],87+i)).join('\n');
topic=topic.slice(0,topicListEnd)+'\n'+topicCards+'\n          '+topic.slice(topicListEnd);
// Update ItemList JSON-LD - add 40 entries before closing ]
const itemListMarker='"itemListElement": [';
const itemListPos=topic.indexOf(itemListMarker);
const itemListEnd=topic.indexOf(']',itemListPos);
let newItems=articles.map((a,i)=>{
  return `,\n      {"@type":"ListItem","position":${88+i},"url":"https://yuetianai.com/articles/${a[0]}.html","name":"${a[1].replace(/"/g,'&quot;')}"}`;
}).join('');
topic=topic.slice(0,itemListEnd)+newItems+'\n    '+topic.slice(itemListEnd);
fs.writeFileSync('articles/ziwei-main-stars.html',topic,'utf8');
console.log('Topic page updated');

// 4. Update CN feed
let cnFeed=fs.readFileSync('feed.xml','utf8');
const cnFeedMarker='</channel>';
let cnFeedItems=articles.map(a=>`  <item>
    <title>${a[1]}</title>
    <link>https://yuetianai.com/articles/${a[0]}.html</link>
    <guid isPermaLink="true">https://yuetianai.com/articles/${a[0]}.html</guid>
    <pubDate>Fri, 21 Aug 2026 10:15:00 +0800</pubDate>
    <description><![CDATA[${a[1]}]]></description>
  </item>`).join('\n');
cnFeed=cnFeed.replace(cnFeedMarker,cnFeedItems+'\n'+cnFeedMarker);
fs.writeFileSync('feed.xml',cnFeed,'utf8');
console.log('CN feed updated');

// 5. Update EN feed
let enFeed=fs.readFileSync('articles/en/feed.xml','utf8');
let enFeedItems=articles.map(a=>`  <item>
    <title>${a[2]}</title>
    <link>https://yuetianai.com/articles/en/${a[0]}.html</link>
    <guid isPermaLink="true">https://yuetianai.com/articles/en/${a[0]}.html</guid>
    <pubDate>Fri, 21 Aug 2026 10:15:00 +0800</pubDate>
    <description><![CDATA[${a[2]}]]></description>
  </item>`).join('\n');
enFeed=enFeed.replace(cnFeedMarker,enFeedItems+'\n'+cnFeedMarker);
fs.writeFileSync('articles/en/feed.xml',enFeed,'utf8');
console.log('EN feed updated');

// 6. Update sitemap.xml
let sitemap=fs.readFileSync('sitemap.xml','utf8');
const sitemapMarker='</urlset>';
let sitemapUrls=[];
for(const a of articles){
  sitemapUrls.push(`  <url><loc>https://yuetianai.com/articles/${a[0]}.html</loc><lastmod>2026-08-21</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
  sitemapUrls.push(`  <url><loc>https://yuetianai.com/articles/en/${a[0]}.html</loc><lastmod>2026-08-21</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
}
sitemap=sitemap.replace(sitemapMarker,sitemapUrls.join('\n')+'\n'+sitemapMarker);
fs.writeFileSync('sitemap.xml',sitemap,'utf8');
console.log('Sitemap updated with 80 URLs');
console.log('All updates complete!');
