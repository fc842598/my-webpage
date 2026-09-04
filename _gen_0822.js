const fs=require('fs'),path=require('path');
const date='2026-08-22T10:30:00+08:00';
function jstr(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"');}

// Star data: name, element, nature, key traits CN/EN
const STARS = {
  wuqu: {cn:'武曲',en:'Wu Qu',elem:'阴金',elemEn:'yin metal',nature:'正财星、将星',natureEn:'the finance star and the general star',
    cnTraits:['刚毅实干、执行力强','对数字和资源敏感','重承诺、讲信用','不服输、能扛压','不擅表达情感'],
    enTraits:['resolute and action-oriented','sensitive to numbers and resources','values commitments and credibility','competitive and pressure-resistant','not expressive with emotions']},
  tiantong: {cn:'天同',en:'Tian Tong',elem:'阳水',elemEn:'yang water',nature:'福星、益算星',natureEn:'the blessing star',
    cnTraits:['温和善良、人缘好','懂得享受生活','有艺术天赋','容易安于现状','情绪敏感'],
    enTraits:['gentle and well-liked','knows how to enjoy life','artistically gifted','prone to complacency','emotionally sensitive']},
  lianzhen: {cn:'廉贞',en:'Lian Zhen',elem:'阴火/阴水',elemEn:'yin fire/yin water',nature:'次桃花星、官禄主',natureEn:'the secondary peach-blossom star and a Career ruler',
    cnTraits:['能文能武、多才多艺','公关能力强、有人格魅力','做事认真、要求高','感情丰富、容易纠结','带囚性、需防官非'],
    enTraits:['versatile in both civil and martial matters','strong PR ability and personal charisma','serious and demanding at work','emotionally rich and prone to entanglement','carries a binding quality, watch legal issues']},
  tianfu: {cn:'天府',en:'Tian Fu',elem:'阳土',elemEn:'yang earth',nature:'南斗主星、财库星',natureEn:'the Southern Dipper chief and the treasury star',
    cnTraits:['稳重包容、有肚量','善于管理和储蓄','有领导才能','保守谨慎','爱面子、讲究品味'],
    enTraits:['steady, tolerant, broad-minded','good at management and saving','leadership ability','conservative and cautious','face-conscious and taste-oriented']}
};

// Palace data: name, life domain CN/EN, key questions
const PALACES = {
  caibogong:{cn:'财帛宫',en:'Wealth Palace',domain:'收入方式、求财路径和现金流',domainEn:'income style, earning path, and cash flow',
    cnQuestions:['钱从哪里来','能不能存住','适合什么赚钱方式'],enQuestions:['where money comes from','whether it can be retained','what earning method fits']},
  jiegong:{cn:'疾厄宫',en:'Health Palace',domain:'体质弱点、慢性病和意外灾厄',domainEn:'physical weaknesses, chronic conditions, and accidents',
    cnQuestions:['哪里最容易出问题','什么习惯最伤身','什么时候要特别注意'],enQuestions:['what is most vulnerable','which habits harm most','when to be extra careful']},
  qianyi:{cn:'迁移宫',en:'Travel Palace',domain:'外出运势、人际外缘和远方机遇',domainEn:'travel luck, external connections, and distant opportunities',
    cnQuestions:['适不适合外出发展','外面有没有贵人','离乡是好是坏'],enQuestions:['whether leaving home suits you','whether benefactors await outside','whether departure helps or hurts']},
  puyigong:{cn:'仆役宫',en:'Friends Palace',domain:'下属、朋友、合伙人与社交圈',domainEn:'subordinates, friends, partners, and social circle',
    cnQuestions:['朋友靠不靠谱','能不能合伙','下属能不能用'],enQuestions:['whether friends are reliable','whether partnership works','whether subordinates are capable']},
  guanlugong:{cn:'官禄宫',en:'Career Palace',domain:'工作运势、事业格局和职场状态',domainEn:'work fortune, career structure, and job situation',
    cnQuestions:['适合什么行业','能不能当主管','事业天花板在哪'],enQuestions:['what industry fits','whether management suits you','where the career ceiling is']},
  tianzhaigong:{cn:'田宅宫',en:'Property Palace',domain:'房产家业、居住环境和固定资产',domainEn:'real estate, living environment, and fixed assets',
    cnQuestions:['有没有房产运','家里环境怎样','能不能守住家底'],enQuestions:['whether property luck exists','what the home environment is like','whether family assets can be kept']},
  fudegong:{cn:'福德宫',en:'Fortune Palace',domain:'精神状态、福气心态和兴趣享受',domainEn:'mental state, blessings, mindset, and enjoyment',
    cnQuestions:['内心安不安','有没有福气','花钱买开心值不值'],enQuestions:['whether the mind is at peace','whether blessings exist','whether spending on joy is worth it']},
  fumugong:{cn:'父母宫',en:'Parents Palace',domain:'父母缘分、长辈助力和文书学历',domainEn:'parents, elder support, documents, and education',
    cnQuestions:['父母能不能靠','跟长辈关系怎样','文书运好不好'],enQuestions:['whether parents can be relied on','how elder relationships are','whether document luck is good']},
  minggong:{cn:'命宫',en:'Life Palace',domain:'核心性格、长相和人生基调',domainEn:'core personality, appearance, and life direction',
    cnQuestions:['这个人本质是什么样','天生优势在哪','这辈子要学什么'],enQuestions:['what this person fundamentally is','where natural strengths lie','what this life must learn']},
  xiongdigong:{cn:'兄弟宫',en:'Siblings Palace',domain:'手足关系、同辈缘分和资金周转',domainEn:'sibling relationships, peer bonds, and cash turnover',
    cnQuestions:['兄弟姐妹能不能帮','同辈关系怎样','资金周转灵不灵'],enQuestions:['whether siblings can help','how peer relationships are','whether cash flow is flexible']},
  fuqigong:{cn:'夫妻宫',en:'Spouse Palace',domain:'感情婚姻、伴侣特质和婚恋吉凶',domainEn:'love, marriage, partner traits, and relationship fortune',
    cnQuestions:['另一半是什么样的人','感情顺不顺','婚姻要注意什么'],enQuestions:['what the partner is like','whether relationships go smoothly','what marriage needs attention']},
  zinvgong:{cn:'子女宫',en:'Children Palace',domain:'子女缘分、晚辈关系和创意产出',domainEn:'children, junior relationships, and creative output',
    cnQuestions:['孩子缘深不深','跟子女关系怎样','创造力如何'],enQuestions:['whether children luck is strong','how relationships with children are','how creativity is']}
};

// Generate article content for a star+palace combo
function genArticle(starKey, palaceKey) {
  const s = STARS[starKey], p = PALACES[palaceKey];
  const slug = `ziwei-${starKey}-zai-${palaceKey}`;
  const cnTitle = `${s.cn}在${p.cn}：${genCnTitle(starKey,palaceKey)}`;
  const enTitle = `${s.en} in ${p.en}: ${genEnTitle(starKey,palaceKey)}`;
  return {
    slug,
    cnTitle, enTitle,
    cnDesc: genCnDesc(s,p), enDesc: genEnDesc(s,p),
    cnLead: genCnLead(s,p), enLead: genEnLead(s,p),
    cnIntro2: genCnIntro2(s,p), enIntro2: genEnIntro2(s,p),
    cnSections: genCnSections(s,p,starKey,palaceKey),
    enSections: genEnSections(s,p,starKey,palaceKey),
    cnSidebar: getCnSidebar(starKey,palaceKey),
    enSidebar: getEnSidebar(starKey,palaceKey)
  };
};

// Title generators
function genCnTitle(sk,pk){
  const titles = {
    'wuqu-caibogong':'正财星坐财库，赚钱靠实干不靠运气',
    'wuqu-jiegong':'财星坐身体宫，健康跟「硬扛」有关',
    'wuqu-qianyi':'在外是干将，离乡反而能出头',
    'wuqu-puyigong':'交朋友先看能力，兄弟是战友不是酒肉',
    'wuqu-guanlugong':'将星坐官禄，天生适合带团队打硬仗',
    'wuqu-tianzhaigong':'对房产有直觉，家业靠一笔一笔攒',
    'wuqu-fudegong':'闲不住的福星，放松对他们来说是任务',
    'wuqu-fumugong':'父母管教严，长辈缘深但有压力',
    'tiantong-minggong':'福星坐命的人，天生懂生活但缺一把劲',
    'tiantong-xiongdigong':'兄弟姐妹是福气来源，但也可能被宠着长',
    'tiantong-fuqigong':'感情里要浪漫不要现实，伴侣缘好但怕磨合',
    'tiantong-zinvgong':'子女缘深，孩子是你的开心果',
    'tiantong-caibogong':'赚钱不费劲但也不太上心，够用就好',
    'tiantong-jiegong':'体质偏寒湿，情绪比身体更容易出问题',
    'tiantong-qianyi':'在外有人缘，出门遇贵人',
    'tiantong-puyigong':'朋友多但知心少，别什么人都信',
    'tiantong-guanlugong':'适合稳定轻松的工作，不宜高压竞争',
    'tiantong-tianzhaigong':'家里舒服最重要，居家运好',
    'tiantong-fudegong':'福气最厚的位置，心态好就是最大的本钱',
    'tiantong-fumugong':'父母疼爱，童年温暖但独立性晚',
    'lianzhen-minggong':'囚星坐命：能成事也能困住自己的人',
    'lianzhen-xiongdigong':'同辈中有人格魅力者，但关系容易忽冷忽热',
    'lianzhen-fuqigong':'感情浓烈但波折多，爱与束缚一线之隔',
    'lianzhen-zinvgong':'子女聪明好胜，教育要给空间不要给压力',
    'lianzhen-caibogong':'靠交际和专业赚钱，财来财去波动大',
    'lianzhen-jiegong':'注意心火和血液问题，情绪是健康开关',
    'lianzhen-qianyi':'在外如鱼得水，离乡发展更出彩',
    'lianzhen-puyigong':'朋友圈三教九流，识人是必修课',
    'lianzhen-guanlugong':'官禄主坐官禄，事业上能文能武',
    'lianzhen-tianzhaigong':'家里待不住，居家环境要常换常新',
    'lianzhen-fudegong':'精神世界丰富但容易内耗，学会放下',
    'lianzhen-fumugong':'与父母缘分深但管束多，文书运有波折',
    'tianfu-minggong':'府库星坐命：天生的管理者和守成者',
    'tianfu-xiongdigong':'兄弟姐妹稳重可靠，是你的后盾',
    'tianfu-fuqigong':'伴侣持家有道，婚姻安稳但缺激情',
    'tianfu-zinvgong':'子女稳重懂事，教育上多给尝试机会',
    'tianfu-caibogong':'财库星坐财帛，收入稳存款多',
    'tianfu-jiegong':'脾胃是薄弱环节，饮食规律比什么都重要',
    'tianfu-qianyi':'在外有贵人扶持，离乡稳扎稳打'
  };
  return titles[sk+'-'+pk] || `${STARS[sk].cn}在${PALACES[pk].cn}的独特表现`;
}

function genEnTitle(sk,pk){
  const titles = {
    'wuqu-caibogong':'The Finance Star in Its Home — Earned Money, Not Luck',
    'wuqu-jiegong':'Toughness and Its Hidden Costs',
    'wuqu-qianyi':'A Doer Away from Home — Leaving Brings Breakthrough',
    'wuqu-puyigong':'Friends as Comrades — Ability First, Pleasure Second',
    'wuqu-guanlugong':'The General in Career — Born to Lead Hard Battles',
    'wuqu-tianzhaigong':'Property Instinct — Building Assets Brick by Brick',
    'wuqu-fudegong':'A Blessing Star That Cannot Rest — Relaxation Is a Task',
    'wuqu-fumugong':'Strict Parents — Deep Bond with Heavy Expectations',
    'tiantong-minggong':'The Blessing Star in Life — Knows Comfort but Lacks Drive',
    'tiantong-xiongdigong':'Siblings as a Source of Blessing — and Spoiling',
    'tiantong-fuqigong':'Romance over Reality — Good Partner Luck, Fear of Friction',
    'tiantong-zinvgong':'Strong Children Luck — Kids Bring Joy',
    'tiantong-caibogong':'Money Comes Easily but Is Not a Priority — Enough Is Enough',
    'tiantong-jiegong':'Cold-Damp Constitution — Emotions Before Body',
    'tiantong-qianyi':'Well-Liked Away from Home — Benefactors Await Outside',
    'tiantong-puyigong':'Many Friends, Few Confidants — Trust Selectively',
    'tiantong-guanlugong':'Suited to Stable, Low-Pressure Work — Not High Competition',
    'tiantong-tianzhaigong':'Home Comfort Matters Most — Good Domestic Luck',
    'tiantong-fudegong':'Thickest Blessings — A Good Mindset Is the Greatest Asset',
    'tiantong-fumugong':'Doting Parents — Warm Childhood, Late Independence',
    'lianzhen-minggong':'The Binding Star in Life — Capable of Greatness and Self-Trap',
    'lianzhen-xiongdigong':'Charismatic Peers — Hot-and-Cold Relationships',
    'lianzhen-fuqigong':'Intense Love with Twists — Passion and Confinement Together',
    'lianzhen-zinvgong':'Bright, Competitive Children — Give Space, Not Pressure',
    'lianzhen-caibogong':'Earning Through Connections and Skill — Volatile Cash Flow',
    'lianzhen-jiegong':'Watch Heart-Fire and Blood — Emotions Control Health',
    'lianzhen-qianyi':'Thriving Outside — Leaving Home Brings Out the Best',
    'lianzhen-puyigong':'A Wide Social Circle — Reading People Is Essential',
    'lianzhen-guanlugong':'The Career Ruler in Career — Versatile and Capable',
    'lianzhen-tianzhaigong':'Cannot Stay Still at Home — Change Keeps the Space Fresh',
    'lianzhen-fudegong':'Rich Inner World but Prone to Friction — Learn to Let Go',
    'lianzhen-fumugong':'Deep Parental Bond with Control — Document Luck Has Twists',
    'tianfu-minggong':'The Treasury Star in Life — Born Manager and Preserver',
    'tianfu-xiongdigong':'Steady, Reliable Siblings — Your Backing',
    'tianfu-fuqigong':'A Partner Who Manages Home — Stable Marriage, Less Passion',
    'tianfu-zinvgong':'Steady, Sensible Children — Give Room to Try',
    'tianfu-caibogong':'Treasury Star in Wealth — Stable Income, Strong Savings',
    'tianfu-jiegong':'Spleen and Stomach Weakness — Regular Eating Beats Everything',
    'tianfu-qianyi':'Benefactors Outside — Steady Progress Away from Home'
  };
  return titles[sk+'-'+pk] || `How ${STARS[sk].en} Manifests in the ${PALACES[pk].en}`;
}

// Content generators
function genCnDesc(s,p){return `${s.cn}在${p.cn}，${p.domain}。${s.cn}是${s.nature}，落在${p.cn}有它独特的表现和需要注意的地方。`;}
function genEnDesc(s,p){return `${s.en} in the ${p.en} affects ${p.domain}. As ${s.natureEn}, it brings distinct patterns and cautions.`;}

function genCnLead(s,p){
  return `很多人看到${s.cn}在${p.cn}，第一反应是查「好不好」。但${s.cn}是${s.nature}，它落在${p.cn}不是简单的好坏问题，而是这颗星的能量会以什么方式在${p.domain}这件事上表现出来。${s.cn}的关键词是${s.cnTraits.slice(0,3).join('、')}，这些特质放到${p.cn}的场景里，会产生非常具体的现实对应。`;
}
function genEnLead(s,p){
  return `Many people seeing ${s.en} in the ${p.en} first ask "is it good or bad." But ${s.en} is ${s.natureEn}; in the ${p.en} the question is not good or bad but how its energy shows up in ${p.domainEn}. ${s.en} keywords are ${s.enTraits.slice(0,3).join(', ')}, and these traits produce very concrete patterns in the ${p.en} context.`;
}

function genCnIntro2(s,p){
  return `${p.cn}看的是${p.domain}。${s.cn}属${s.elem}，它的能量特质是${s.cnTraits[0]}。读这颗星在${p.cn}，不能只看单宫，必须回到三方四正——${p.cn}的三方会照决定了${s.cn}的能量能不能被接住。有吉星会照，${s.cn}的优点能落地；被煞星冲照，同样的特质可能变成压力和阻碍。`;
}
function genEnIntro2(s,p){
  return `The ${p.en} covers ${p.domainEn}. ${s.en} is ${s.elemEn}, with an energy of ${s.enTraits[0]}. Reading it in the ${p.en} requires the triple-direction view — the palaces that aspect the ${p.en} determine whether ${s.en}'s energy can be received. With auspicious stars, its strengths land; with malefics, the same traits can become pressure and obstacles.`;
}

function genCnSections(s,p,sk,pk){
  return [
    {h:`${s.cn}在${p.cn}的核心表现`,ps:[
      `${s.cnTraits[0]}——在${p.domain}这件事上，这个特质最直接。`,
      `${s.cnTraits[1]}——这决定了${s.cn}在${p.cn}的处理方式。`,
      `${s.cnTraits[2]}——放到${p.cn}的场景里，表现为具体的行为模式。`,
      `${s.cnTraits[3]}——这是把双刃剑，用好了是优势，用不好是内耗。`,
      `${s.cnTraits[4] ? s.cnTraits[4]+'——这一面往往被忽略，但在'+p.domain+'中很关键。' : s.cn+'的能量不是孤立的，必须看同宫和三方星曜。'}`
    ]},
    {h:`有吉星和有煞星的区别`,ps:[
      `加左辅右弼——${p.domain}中有人帮衬，${s.cn}的执行力能落地。`,
      `加天魁天钺——关键时刻有贵人提携，${p.cn}的事容易逢凶化吉。`,
      `加文昌文曲——${s.cn}的硬实力配上谋略和文采，表现更全面。`,
      `加擎羊陀罗——${p.domain}的过程更费劲，容易拖延或起冲突。`,
      `加火星铃星——突发状况多，${p.cn}的事容易被打断或急转直下。`
    ]},
    {h:`现实中的对应和建议`,ps:[
      `如果你正在经历${p.cn}相关的事，先看${s.cn}是庙旺还是落陷——亮度决定了这颗星有没有力气发挥。`,
      `庙旺时，${s.cnTraits[0]}是你的核心竞争力，可以大胆往这个方向走。`,
      `落陷时，同样的特质会打折扣，需要用后天选择来补——选对环境比硬扛更重要。`,
      `化禄化权在${p.cn}，${p.domain}有实质突破；化科是名声和认可；化忌则是卡点和执念。`,
      `记住：${s.cn}在${p.cn}不是宿命，而是一张说明书——告诉你在${p.domain}这件事上，你的出厂设置是什么。`
    ]},
    {h:'排盘使用顺序',ps:[`看到${s.cn}在${p.cn}，按这个顺序读：`],ol:[
      `先看${s.cn}亮度——庙旺有力，落陷打折。`,
      `看同宫星曜——吉星加分，煞星减分。`,
      `看三方四正——${p.cn}的三方决定了全貌。`,
      `看四化——化禄化权化科化忌分别触发什么。`,
      `看大限流年——什么时候${p.cn}的事会被激活。`,
      `问自己：${p.cnQuestions[0]}？${p.cnQuestions[1]}？${p.cnQuestions[2]}？`
    ]}
  ];
}

function genEnSections(s,p,sk,pk){
  return [
    {h:`Core Expression of ${s.en} in the ${p.en}`,ps:[
      `${s.enTraits[0]} — this is the most direct expression in matters of ${p.domainEn}.`,
      `${s.enTraits[1]} — this determines how ${s.en} handles the ${p.en}.`,
      `${s.enTraits[2]} — in the ${p.en} context, this becomes a concrete behavior pattern.`,
      `${s.enTraits[3]} — a double-edged trait: strength when used well, internal friction when not.`,
      `${s.enTraits[4] ? s.enTraits[4]+' — often overlooked, but key in matters of '+p.domainEn+'.' : s.en+"'s energy is not isolated; co-stars and triple-direction matter."}`
    ]},
    {h:'With Auspicious Stars vs Malefics',ps:[
      `With Zuo Fu/You Bi — help arrives in ${p.domainEn}; ${s.en}'s execution can land.`,
      `With Tian Kui/Tian Yue — benefactors appear at key moments; ${p.en} matters resolve.`,
      `With Wen Chang/Wen Qu — ${s.en}'s hard strength gains strategy and expression.`,
      `With Qing Yang/Tuo Luo — the process of ${p.domainEn} is harder, with delays or conflict.`,
      `With Huo Xing/Ling Xing — sudden disruptions; ${p.en} matters get interrupted or take sharp turns.`
    ]},
    {h:'Practical Correspondence and Advice',ps:[
      `If you are dealing with ${p.en} matters, first check whether ${s.en} is in temple/prosperity or fallen — brightness determines whether the star has power.`,
      `When bright, ${s.enTraits[0]} is your core advantage; move boldly in that direction.`,
      `When fallen, the same traits are discounted; compensate through conscious choices — the right environment matters more than endurance.`,
      `Lu or Quan in the ${p.en} brings real breakthroughs in ${p.domainEn}; Ke brings reputation; Ji marks a blockage or fixation.`,
      `Remember: ${s.en} in the ${p.en} is not fate but a manual — it tells you your factory settings for ${p.domainEn}.`
    ]},
    {h:'Reading Order',ps:[`For ${s.en} in the ${p.en}:`],ol:[
      `Check ${s.en} brightness — temple/prosperous: strong; fallen: discounted.`,
      `Check co-stars — auspicious stars add; malefics subtract.`,
      `Check triple direction — the ${p.en}'s aspects reveal the full picture.`,
      `Check transformations — what Lu, Quan, Ke, Ji each activate.`,
      `Check major and annual cycles — when ${p.en} matters get triggered.`,
      `Ask yourself: ${p.enQuestions[0]}? ${p.enQuestions[1]}? ${p.enQuestions[2]}?`
    ]}
  ];
}

function getCnSidebar(sk,pk){
  return [
    {href:'ziwei-main-stars.html',text:'十四主星总览'},
    {href:`ziwei-star-${sk}.html`,text:`${STARS[sk].cn}星详解`},
    {href:`ziwei-${pk}.html`,text:`${PALACES[pk].cn}详解`},
    {href:'ziwei-sanfang-sizheng.html',text:'先看三方四正'},
    {href:'ziwei-minggong.html',text:'回到命宫定位本人'},
    {href:'../pages/mingbook-onepage.html',text:'快速排盘'}
  ];
}
function getEnSidebar(sk,pk){
  return [
    {href:'ziwei-main-stars.html',text:'Main Stars'},
    {href:`ziwei-star-${sk}.html`,text:`${STARS[sk].en} Star`},
    {href:`ziwei-${pk}.html`,text:`${PALACES[pk].en}`},
    {href:'ziwei-sanfang-sizheng.html',text:'Triple Direction'},
    {href:'ziwei-minggong.html',text:'Life Palace'},
    {href:'../../pages/mingbook-onepage.html',text:'Quick Chart'}
  ];
}

// Build HTML
function buildHTML(a,isEn){
  const catPage='ziwei-main-stars.html';
  const cnCatName='主星';const enCatName='Main Stars';
  const cnTag='主星';const enTag='Main Stars';
  const sections=isEn?a.enSections:a.cnSections;
  const sidebar=isEn?a.enSidebar:a.cnSidebar;
  const lead=isEn?a.enLead:a.cnLead;
  const intro2=isEn?a.enIntro2:a.cnIntro2;
  const title=isEn?a.enTitle:a.cnTitle;
  const desc=isEn?a.enDesc:a.cnDesc;
  let sectionsHtml='';
  for(let i=0;i<sections.length;i++){
    const s=sections[i];
    sectionsHtml+=`\n        <h2 id="section-${i+1}">${s.h}</h2>\n`;
    for(const p of s.ps) sectionsHtml+=`        <p>${p}</p>\n`;
    if(s.ol){
      sectionsHtml+='        <ol>\n';
      for(const item of s.ol) sectionsHtml+=`          <li>${item}</li>\n`;
      sectionsHtml+='        </ol>\n';
    }
  }
  let sidebarHtml='';
  for(const link of sidebar) sidebarHtml+=`        <a class="card-link" href="${link.href}">${link.text}</a>\n`;
  if(isEn){
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(title)} | Zi Wei Dou Shu</title>
  <meta name="description" content="${jstr(desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:title" content="${jstr(title)}">
  <meta property="og:description" content="${jstr(desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${jstr(title)}",
  "description": "${jstr(desc)}",
  "image": "https://yuetianai.com/images/home2/triad-tian-bg.webp",
  "datePublished": "${date}",
  "dateModified": "${date}",
  "inLanguage": "en",
  "articleSection": "Zi Wei Dou Shu",
  "about": ["Zi Wei Dou Shu", "Main Stars", "${jstr(title)}"],
  "author": {"@type": "Organization", "name": "YuetianAI"},
  "publisher": {"@type": "Organization", "name": "YuetianAI"},
  "mainEntityOfPage": "https://yuetianai.com/articles/en/${a.slug}.html"
}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a><nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${a.slug}.html">Chinese</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>Main Stars</span></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-22 10:30</time></span></p>
    </div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="Related links"><h2>Read Next</h2>
${sidebarHtml}      </aside>
    </div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">Yue ICP 2026055337-1</a>　<span>© 2026 YuetianAI. All Rights Reserved. Powered By Yuetian Studio</span>　</div></footer>
</body></html>`;
  }
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(title)} | 学习紫微</title>
  <meta name="description" content="${jstr(desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:title" content="${jstr(title)}">
  <meta property="og:description" content="${jstr(desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/${a.slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${jstr(title)}",
  "description": "${jstr(desc)}",
  "image": "https://yuetianai.com/images/home2/triad-tian-bg.webp",
  "datePublished": "${date}",
  "dateModified": "${date}",
  "inLanguage": "zh-CN",
  "articleSection": "主星",
  "about": ["紫微斗数", "主星", "${jstr(title)}"],
  "author": {"@type": "Organization", "name": "阅天AI"},
  "publisher": {"@type": "Organization", "name": "阅天AI"},
  "mainEntityOfPage": "https://yuetianai.com/articles/${a.slug}.html"
}
  </script>
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "阅天AI", "item": "https://yuetianai.com/"},
    {"@type": "ListItem", "position": 2, "name": "学习紫微", "item": "https://yuetianai.com/articles/"},
    {"@type": "ListItem", "position": 3, "name": "主星", "item": "https://yuetianai.com/articles/ziwei-main-stars.html"},
    {"@type": "ListItem", "position": 4, "name": "${jstr(title)}", "item": "https://yuetianai.com/articles/${a.slug}.html"}
  ]
}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a><nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${a.slug}.html">English</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="ziwei-main-stars.html">主星</a></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>主星</span><span><time datetime="${date}">2026-08-22 10:30</time></span></p>
    </div><div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="本文导航"><h2>继续阅读</h2>
${sidebarHtml}      </aside>
    </div>
    <div class="container article-bottom-link"><span>读完这篇，回到自己的命盘上对照一遍，会比只看概念更清楚。</span><a href="../pages/mingbook-onepage.html">快速排盘 →</a></div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 阅天AI Copyright, All Rights Reserved. Powered By 阅天工作室</span>　</div></footer>
</body></html>`;
}

// Define all 39 articles
const combos = [
  // 武曲 8
  ['wuqu','caibogong'],['wuqu','jiegong'],['wuqu','qianyi'],['wuqu','puyigong'],
  ['wuqu','guanlugong'],['wuqu','tianzhaigong'],['wuqu','fudegong'],['wuqu','fumugong'],
  // 天同 12
  ['tiantong','minggong'],['tiantong','xiongdigong'],['tiantong','fuqigong'],['tiantong','zinvgong'],
  ['tiantong','caibogong'],['tiantong','jiegong'],['tiantong','qianyi'],['tiantong','puyigong'],
  ['tiantong','guanlugong'],['tiantong','tianzhaigong'],['tiantong','fudegong'],['tiantong','fumugong'],
  // 廉贞 12
  ['lianzhen','minggong'],['lianzhen','xiongdigong'],['lianzhen','fuqigong'],['lianzhen','zinvgong'],
  ['lianzhen','caibogong'],['lianzhen','jiegong'],['lianzhen','qianyi'],['lianzhen','puyigong'],
  ['lianzhen','guanlugong'],['lianzhen','tianzhaigong'],['lianzhen','fudegong'],['lianzhen','fumugong'],
  // 天府 7
  ['tianfu','minggong'],['tianfu','xiongdigong'],['tianfu','fuqigong'],['tianfu','zinvgong'],
  ['tianfu','caibogong'],['tianfu','jiegong'],['tianfu','qianyi']
];

const articles = combos.map(([sk,pk]) => genArticle(sk,pk));

for(const a of articles){
  fs.writeFileSync(path.join(__dirname,'articles',`${a.slug}.html`),buildHTML(a,false).replace(/\r\n/g,'\n'),'utf8');
  fs.writeFileSync(path.join(__dirname,'articles','en',`${a.slug}.html`),buildHTML(a,true).replace(/\r\n/g,'\n'),'utf8');
  console.log(`Created: ${a.slug}`);
}
console.log(`\nTotal: ${articles.length} articles (${articles.length*2} HTML files)`);
