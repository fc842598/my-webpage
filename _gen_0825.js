const fs=require('fs'),path=require('path');
const date='2026-08-25T10:00:00+08:00';
function jstr(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"');}

const PALACES = {
  minggong:{cn:'命宫',en:'Life Palace',domain:'核心性格、人生基调与外在表现',domainEn:'core personality, life direction, and outward expression',
    cnQuestions:['这辈子的性格优势和执念在哪','人生整体顺不顺','我给人的第一印象是什么'],enQuestions:['where personality strengths and fixations lie','whether life flows smoothly overall','what first impression you give']},
  xiongdigong:{cn:'兄弟宫',en:'Siblings Palace',domain:'手足关系、同辈缘分与资金周转',domainEn:'sibling relationships, peer bonds, and cash turnover',
    cnQuestions:['兄弟姐妹能不能帮上忙','跟同辈合不合','资金周转灵不灵'],enQuestions:['whether siblings can help','how peer relationships are','whether cash flow is flexible']},
  fuqigong:{cn:'夫妻宫',en:'Spouse Palace',domain:'感情婚姻、伴侣特质与亲密关系',domainEn:'love, marriage, partner traits, and intimacy',
    cnQuestions:['另一半是什么样的人','感情顺不顺','婚姻最大的功课是什么'],enQuestions:['what the partner is like','whether relationships go smoothly','the biggest lesson in marriage']},
  zinvgong:{cn:'子女宫',en:'Children Palace',domain:'子女缘分、晚辈关系与创意产出',domainEn:'children, junior relationships, and creative output',
    cnQuestions:['孩子缘深不深','跟子女关系怎样','创造力和合作运如何'],enQuestions:['whether children luck is strong','how relationships with children are','how creativity and partnership luck are']},
  caibogong:{cn:'财帛宫',en:'Wealth Palace',domain:'收入方式、求财路径与现金流',domainEn:'income style, earning path, and cash flow',
    cnQuestions:['钱从哪里来','能不能存住钱','适合什么赚钱方式'],enQuestions:['where money comes from','whether it can be retained','what earning method fits']},
  jiegong:{cn:'疾厄宫',en:'Health Palace',domain:'体质弱点、慢性病与意外灾厄',domainEn:'physical weaknesses, chronic conditions, and accidents',
    cnQuestions:['哪里最容易出问题','什么习惯最伤身','什么时候要特别注意'],enQuestions:['what is most vulnerable','which habits harm most','when to be extra careful']},
  qianyi:{cn:'迁移宫',en:'Travel Palace',domain:'外出运势、人际外缘与远方机遇',domainEn:'travel luck, external connections, and distant opportunities',
    cnQuestions:['适不适合外出发展','外面有没有贵人','离乡是好是坏'],enQuestions:['whether leaving home suits you','whether benefactors await outside','whether departure helps or hurts']},
  puyigong:{cn:'仆役宫',en:'Friends Palace',domain:'下属、朋友、合伙人与社交圈',domainEn:'subordinates, friends, partners, and social circle',
    cnQuestions:['朋友靠不靠谱','能不能合伙','下属能不能用'],enQuestions:['whether friends are reliable','whether partnership works','whether subordinates are capable']},
  guanlugong:{cn:'官禄宫',en:'Career Palace',domain:'工作运势、事业格局与职场状态',domainEn:'work fortune, career structure, and job situation',
    cnQuestions:['适合什么行业','能不能当主管','事业天花板在哪'],enQuestions:['what industry fits','whether management suits you','where the career ceiling is']},
  tianzhaigong:{cn:'田宅宫',en:'Property Palace',domain:'房产家业、居住环境与固定资产',domainEn:'real estate, living environment, and fixed assets',
    cnQuestions:['有没有房产运','家里环境怎样','能不能守住家底'],enQuestions:['whether property luck exists','what the home environment is like','whether family assets can be kept']},
  fudegong:{cn:'福德宫',en:'Fortune Palace',domain:'精神状态、福气心态与兴趣享受',domainEn:'mental state, blessings, mindset, and enjoyment',
    cnQuestions:['内心安不安','有没有福气','花钱买开心值不值'],enQuestions:['whether the mind is at peace','whether blessings exist','whether spending on joy is worth it']},
  fumugong:{cn:'父母宫',en:'Parents Palace',domain:'父母缘分、长辈助力与文书学历',domainEn:'parents, elder support, documents, and education',
    cnQuestions:['父母能不能靠','跟长辈关系怎样','文书运好不好'],enQuestions:['whether parents can be relied on','how elder relationships are','whether document luck is good']}
};

// 化忌 data (reuse from yesterday)
const SIHUA = {
  huaji: {cn:'化忌',en:'Hua Ji',nature:'执著、亏欠、卡点',natureEn:'the transformation of fixation, debt, and blockage',
    cnCore:'化忌代表执著、亏欠和过不去的坎。它不是简单的"坏"，而是你最在意、最放不下的地方，也是功课最重的地方。忌是收束，是让你面对和了结。',
    enCore:'Hua Ji represents fixation, debt, and blockages you cannot get past. It is not simply "bad" but what you care about most and cannot let go of — where your heaviest lesson lies. Ji is closure, forcing you to face and finish things.',
    cnTraits:['执著、放不下','容易亏欠、也容易被欠','事情卡住、反复','内心纠结、想太多','忌是功课，不是诅咒'],
    enTraits:['fixated, cannot let go','prone to owing or being owed','matters get stuck, repeat','inner tangle, overthinking','Ji is a lesson, not a curse']}
};

const HUAJI_TITLES = {
  caibogong:'赚钱辛苦存钱难，财上的执念要学会放',
  jiegong:'慢性病和意外要当心，身体在提醒你放下',
  qianyi:'在外发展多波折，离乡的功课是适应',
  puyigong:'朋友缘分有亏欠，合伙要谨慎',
  guanlugong:'事业上容易卡住，执念越深越难突破',
  tianzhaigong:'房产家事多波折，家里有放不下的事',
  fudegong:'精神上容易焦虑，想太多是最大的内耗',
  fumugong:'与父母缘分有亏欠，沟通是一辈子的功课'
};
const HUAJI_EN_TITLES = {
  caibogong:'Hard Earnings, Difficult Savings; Let Go of Money Fixation',
  jiegong:'Watch Chronic Conditions and Accidents; The Body Asks You to Release',
  qianyi:'Many Twists Outside; The Lesson of Leaving Is Adaptation',
  puyigong:'Karmic Debt with Friends; Be Cautious in Partnerships',
  guanlugong:'Career Gets Stuck; The Deeper the Fixation, the Harder the Breakthrough',
  tianzhaigong:'Property and Family Twists; Something Unresolved at Home',
  fudegong:'Prone to Anxiety; Overthinking Is the Biggest Drain',
  fumugong:'Karmic Debt with Parents; Communication Is a Lifelong Lesson'
};

// Aux stars data
const AUX = {
  tiankui: {cn:'天魁',en:'Tian Kui',elem:'阳火',elemEn:'yang fire',nature:'天乙贵人、昼贵',natureEn:'the celestial benefactor, daytime nobility',cat:'辅曜',catEn:'Assistant Stars',
    cnTraits:['贵人运强、长辈提携','光明正大的帮助','阳刚属性、男性贵人多','逢凶化吉','直接显化的助力'],
    enTraits:['strong benefactor luck, elder support','open and above-board help','yang nature, more male benefactors','turns misfortune into blessing','direct, visible assistance']},
  tianyue: {cn:'天钺',en:'Tian Yue',elem:'阴火',elemEn:'yin fire',nature:'玉堂贵人、夜贵',natureEn:'the jade hall benefactor, nighttime nobility',cat:'辅曜',catEn:'Assistant Stars',
    cnTraits:['贵人运强、暗中相助','温柔含蓄的帮助','阴柔属性、女性贵人多','逢凶化吉','间接隐密的助力'],
    enTraits:['strong benefactor luck, hidden assistance','gentle and subtle help','yin nature, more female benefactors','turns misfortune into blessing','indirect, behind-the-scenes support']},
  qingyang: {cn:'擎羊',en:'Qing Yang',elem:'阳金',elemEn:'yang metal',nature:'刑星、煞星',natureEn:'the punishment star and malefic star',cat:'辅煞曜',catEn:'Assistant and Malefic Stars',
    cnTraits:['刚烈冲动、敢打敢拼','容易受伤、有刀光血光','执行力极强、不留后路','性子急、容易得罪人','煞星用对地方是魄力'],
    enTraits:['fierce and impulsive, dares to fight','prone to injury, cuts and bloodshed','extremely strong execution, no retreat','quick-tempered, easily offends others','a malefic used right is boldness']}
};

const AUX_CN_TITLES = {
  'tiankui-xiongdigong':'兄弟姐妹中有贵人，关键时刻有人拉一把',
  'tiankui-fuqigong':'伴侣条件好，感情中有明面上的贵人',
  'tiankui-zinvgong':'孩子有出息，晚辈中出贵人',
  'tiankui-caibogong':'赚钱有贵人带，机会来得光明正大',
  'tiankui-jiegong':'逢凶化吉的体质，有病能遇良医',
  'tiankui-qianyi':'出门遇贵人，离乡发展有长辈提携',
  'tiankui-puyigong':'朋友中有贵人，关键时刻有人帮你说话',
  'tiankui-guanlugong':'事业上有伯乐，升职加薪有人提携',
  'tiankui-tianzhaigong':'家产有贵人助，置房安家有人帮忙',
  'tiankui-fudegong':'心态乐观有福气，遇事总能逢凶化吉',
  'tiankui-fumugong':'父母是贵人，长辈缘深助力大',
  'tianyue-xiongdigong':'兄弟姐妹中有人暗中帮你',
  'tianyue-fuqigong':'伴侣温柔体贴，感情中有暗助',
  'tianyue-zinvgong':'孩子懂事贴心，晚辈缘好',
  'tianyue-caibogong':'暗中有人送机会，偏财来自人脉',
  'tianyue-jiegong':'慢性病遇良医，调理比硬扛重要',
  'tianyue-qianyi':'在外有暗贵人，离乡有人默默帮',
  'tianyue-puyigong':'朋友中有人暗中提携',
  'tianyue-guanlugong':'事业上有暗中的贵人相助',
  'tianyue-tianzhaigong':'家里有隐性助力，家事有人帮衬',
  'tianyue-fudegong':'精神上有寄托，福气来自内心',
  'tianyue-fumugong':'父母温柔体贴，暗中为你铺路',
  'qingyang-minggong':'性格刚烈敢拼，人生大起大落',
  'qingyang-xiongdigong':'兄弟姐妹个性刚烈，关系有摩擦',
  'qingyang-fuqigong':'感情里有冲突，伴侣脾气急',
  'qingyang-zinvgong':'孩子叛逆好胜，教育要疏导不要压制',
  'qingyang-caibogong':'赚钱有冲劲但破财风险大',
  'qingyang-jiegong':'注意外伤和手术，运动要防护',
  'qingyang-qianyi':'在外闯荡多波折，离乡要防意外',
  'qingyang-puyigong':'朋友中有人太冲动，合伙防冲突',
  'qingyang-guanlugong':'事业上有冲劲但容易树敌',
  'qingyang-tianzhaigong':'家里有争执，房产买卖防纠纷'
};
const AUX_EN_TITLES = {
  'tiankui-xiongdigong':'A Benefactor Among Siblings; Someone Helps at Key Moments',
  'tiankui-fuqigong':'A Good Partner; Visible Benefactor in Love',
  'tiankui-zinvgong':'Promising Children; Benefactors Among Juniors',
  'tiankui-caibogong':'A Guide in Earning; Opportunities Come Openly',
  'tiankui-jiegong':'Misfortune Turns to Blessing; Good Doctors When Ill',
  'tiankui-qianyi':'Benefactors Outside; Elders Support Away from Home',
  'tiankui-puyigong':'A Benefactor Among Friends; Someone Speaks Up for You',
  'tiankui-guanlugong':'A Talent-Spotter at Work; Promotion Support',
  'tiankui-tianzhaigong':'Help with Property; Someone Assists with Housing',
  'tiankui-fudegong':'Optimistic and Blessed; Things Always Work Out',
  'tiankui-fumugong':'Parents Are Benefactors; Deep Elder Support',
  'tianyue-xiongdigong':'A Sibling Helps Behind the Scenes',
  'tianyue-fuqigong':'A Gentle Partner; Hidden Support in Love',
  'tianyue-zinvgong':'Thoughtful Children; Good Junior Bonds',
  'tianyue-caibogong':'Hidden Opportunities; Side Income from Connections',
  'tianyue-jiegong':'Good Doctors for Chronic Conditions; Adjustment Over Endurance',
  'tianyue-qianyi':'A Hidden Benefactor Outside; Quiet Help Away from Home',
  'tianyue-puyigong':'A Friend Quietly Promotes You',
  'tianyue-guanlugong':'Behind-the-Scenes Help in Career',
  'tianyue-tianzhaigong':'Hidden Help at Home; Someone Assists with Family Matters',
  'tianyue-fudegong':'Spiritual Solace; Blessings Come from Within',
  'tianyue-fumugong':'Gentle Parents; Quietly Paving Your Way',
  'qingyang-minggong':'Fierce and Bold; Life with Major Ups and Downs',
  'qingyang-xiongdigong':'Strong-Willed Siblings; Friction in Relationships',
  'qingyang-fuqigong':'Conflict in Love; A Quick-Tempered Partner',
  'qingyang-zinvgong':'Rebellious, Competitive Children; Guide, Do Not Suppress',
  'qingyang-caibogong':'Aggressive Earning but High Loss Risk',
  'qingyang-jiegong':'Watch Injuries and Surgery; Protect During Exercise',
  'qingyang-qianyi':'Many Twists Outside; Beware Accidents Away from Home',
  'qingyang-puyigong':'An Impulsive Friend; Prevent Partnership Conflict',
  'qingyang-guanlugong':'Drive at Work but Prone to Making Enemies',
  'qingyang-tianzhaigong':'Disputes at Home; Beware Property Conflicts'
};

// Build combos: 8 huaji + 11 tiankui + 11 tianyue + 10 qingyang = 40
const combos = [];
for (const p of ['caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong','fudegong','fumugong']) {
  combos.push({type:'huaji', shKey:'huaji', pKey:p});
}
for (const p of ['xiongdigong','fuqigong','zinvgong','caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong','fudegong','fumugong']) {
  combos.push({type:'aux', starKey:'tiankui', pKey:p});
}
for (const p of ['xiongdigong','fuqigong','zinvgong','caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong','fudegong','fumugong']) {
  combos.push({type:'aux', starKey:'tianyue', pKey:p});
}
for (const p of ['minggong','xiongdigong','fuqigong','zinvgong','caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong']) {
  combos.push({type:'aux', starKey:'qingyang', pKey:p});
}

function genHuajiArticle(pKey) {
  const sh = SIHUA.huaji, p = PALACES[pKey];
  const slug = `ziwei-huaji-zai-${pKey}`;
  return {
    slug, cat:'四化', catEn:'Four Transformations',
    cnTitle: `${sh.cn}在${p.cn}：${HUAJI_TITLES[pKey]}`,
    enTitle: `${sh.en} in ${p.en}: ${HUAJI_EN_TITLES[pKey]}`,
    cnDesc: `${sh.cn}在${p.cn}，${p.domain}。${sh.cnCore}`,
    enDesc: `${sh.en} in the ${p.en} affects ${p.domainEn}. ${sh.enCore}`,
    cnLead: `${sh.cn}在${p.cn}，很多人看到就紧张。但${sh.cn}不是"完蛋了"的意思，它说的是你在${p.domain}这件事上有执念、有亏欠、有过不去的坎。${sh.cn}的关键词是${sh.cnTraits.slice(0,3).join('、')}，这些能量放到${p.cn}的场景里，会表现为具体的人生功课。`,
    enLead: `Many people tense up seeing ${sh.en} in the ${p.en}. But ${sh.en} does not mean "ruined" — it means you have fixation, debt, or an unresolved block in ${p.domainEn}. ${sh.en} keywords are ${sh.enTraits.slice(0,3).join(', ')}, and these energies become concrete life lessons in the ${p.en}.`,
    cnIntro2: `${p.cn}看的是${p.domain}。${sh.cn}落在这个位置，意味着你这辈子在${p.domain}上特别在意、特别放不下。但在意不等于做不好——很多成大事的人，恰恰是因为${p.cn}有化忌，才在那个领域钻得比谁都深。关键是执著的方向：钻进去是专业，钻牛角尖是内耗。`,
    enIntro2: `The ${p.en} covers ${p.domainEn}. ${sh.en} here means you care deeply and cannot let go in ${p.domainEn}. But caring does not mean failing — many high achievers have ${sh.en} in this palace precisely because they delve deeper than anyone. The key is the direction of fixation: deep focus becomes expertise; obsessive rumination becomes drain.`
  };
}

function genAuxArticle(starKey, pKey) {
  const s = AUX[starKey], p = PALACES[pKey];
  const slug = `ziwei-${starKey}-zai-${pKey}`;
  return {
    slug, cat: s.cat, catEn: s.catEn,
    cnTitle: `${s.cn}在${p.cn}：${AUX_CN_TITLES[starKey+'-'+pKey]}`,
    enTitle: `${s.en} in ${p.en}: ${AUX_EN_TITLES[starKey+'-'+pKey]}`,
    cnDesc: `${s.cn}在${p.cn}，${p.domain}。${s.cn}是${s.nature}，落在${p.cn}有它独特的表现和需要注意的地方。`,
    enDesc: `${s.en} in the ${p.en} affects ${p.domainEn}. As ${s.natureEn}, it brings distinct patterns and cautions.`,
    cnLead: `${s.cn}是${s.nature}。落在${p.cn}，它的能量会在${p.domain}这件事上表现出来。${s.cn}的关键词是${s.cnTraits.slice(0,3).join('、')}，这些特质放到${p.cn}的场景里，会产生具体的现实对应。`,
    enLead: `${s.en} is ${s.natureEn}. In the ${p.en}, its energy shows up in matters of ${p.domainEn}. ${s.en} keywords are ${s.enTraits.slice(0,3).join(', ')}, producing concrete patterns in the ${p.en} context.`,
    cnIntro2: `${p.cn}看的是${p.domain}。${s.cn}属${s.elem}，能量特质是${s.cnTraits[0]}。读${s.cn}在${p.cn}不能只看单宫，必须回到三方四正——吉星会照则助力落地，煞星冲照则波折增多。`,
    enIntro2: `The ${p.en} covers ${p.domainEn}. ${s.en} is ${s.elemEn}, with energy of ${s.enTraits[0]}. Reading it requires the triple-direction view — with auspicious stars, help lands; with malefics, twists increase.`
  };
}

function cnSections(a, type) {
  if (type === 'huaji') {
    const sh = SIHUA.huaji, p = PALACES[a.pKey];
    return [
      {h:`${sh.cn}在${p.cn}的核心表现`, ps:[
        `${sh.cnTraits[0]}——在${p.domain}这件事上，你比一般人更在意，也更容易因此受伤。`,
        `${sh.cnTraits[1]}——${p.cn}的化忌往往意味着因果上的亏欠，可能是你欠别人的，也可能是别人欠你的。`,
        `${sh.cnTraits[2]}——${p.domain}中的事情容易反复、卡住，越急越推不动。`,
        `${sh.cnTraits[3]}——内心戏多，表面看不出什么，但自己纠结得要命。`,
        `${sh.cnTraits[4]}。${sh.cn}在${p.cn}不是判你死刑，而是指出你这辈子在${p.domain}上的修行方向。`
      ]},
      {h:`化忌在${p.cn}的转机`, ps:[
        `化忌最怕硬扛。${p.domain}上的事，越用力越容易适得其反，学会松手反而有路。`,
        `化忌喜化权冲照——有权星来冲，卡点反而变成突破的动力。`,
        `化禄入${p.cn}的对宫或三合——执念有了出口，亏欠有了弥补的机会。`,
        `大限走到${p.cn}时，是${sh.cn}能量最集中的时候，也是了结旧账的窗口期。`,
        `记住：化忌不是让你不要在乎，而是让你在乎完了之后能放下。`
      ]},
      {h:`现实中的对应和建议`, ps:[
        `如果你正在${p.domain}上经历困境，先问自己：我是不是太执著了？`,
        `执著的方向如果是专业和深度，${sh.cn}在${p.cn}能让你成为那个领域最懂的人。`,
        `执著的方向如果是控制和占有，${p.domain}就会变成你最大的内耗来源。`,
        `亏欠感要用行动来化解——该道歉道歉，该弥补弥补，该翻篇翻篇。`,
        `${sh.cn}在${p.cn}的终极功课：接受不完美，然后继续往前走。`
      ]},
      {h:'读盘顺序', ps:[`看到${sh.cn}在${p.cn}，按这个顺序读：`], ol:[
        `先看${sh.cn}挂在哪颗主星上——主星决定了执念的性质。`,
        `看主星庙旺落陷——庙旺时执念能化为成就，落陷时容易变成内耗。`,
        `看同宫和三方星曜——吉星化解，煞星加重。`,
        `看有没有化禄化权来照——有转机和出路。`,
        `看大限流年——什么时候${p.domain}的旧账会被翻出来。`,
        `问自己：${p.cnQuestions[0]}？${p.cnQuestions[1]}？${p.cnQuestions[2]}？`
      ]}
    ];
  }
  // aux sections
  const s = AUX[a.starKey], p = PALACES[a.pKey];
  return [
    {h:`${s.cn}在${p.cn}的核心表现`, ps:[
      `${s.cnTraits[0]}——在${p.domain}这件事上，这个特质最直接。`,
      `${s.cnTraits[1]}——这决定了${s.cn}在${p.cn}的表现方式。`,
      `${s.cnTraits[2]}——放到${p.cn}的场景里，表现为具体的行为模式。`,
      `${s.cnTraits[3]}——这是把双刃剑，用好了是优势，用不好是麻烦。`,
      `${s.cnTraits[4]}——这一面往往被忽略，但在${p.domain}中很关键。`
    ]},
    {h:`有吉星和有煞星的区别`, ps:[
      `加左辅右弼——${p.domain}中有人帮衬，${s.cn}的能量能落地。`,
      `加天魁天钺——关键时刻有贵人提携，${p.cn}的事容易逢凶化吉。`,
      `加文昌文曲——${s.cn}配上谋略和文采，表现更圆融。`,
      `加擎羊陀罗——${p.domain}的过程更费劲，容易拖延或起冲突。`,
      `加火星铃星——突发状况多，${p.cn}的事容易被打断或急转直下。`
    ]},
    {h:`现实中的对应和建议`, ps:[
      `如果你正在经历${p.cn}相关的事，先看${s.cn}同宫的主星是庙旺还是落陷。`,
      `庙旺时，${s.cnTraits[0]}是你的核心竞争力。`,
      `落陷时，同样的特质会打折扣，需要用后天选择来补。`,
      `化禄化权在${p.cn}，${p.domain}有实质突破；化科是名声和认可；化忌则是卡点。`,
      `记住：${s.cn}在${p.cn}不是宿命，而是一张说明书。`
    ]},
    {h:'排盘使用顺序', ps:[`看到${s.cn}在${p.cn}，按这个顺序读：`], ol:[
      `先看同宫主星——主星决定基本盘。`,
      `看${s.cn}与主星的配合——吉星加分，煞星减分。`,
      `看三方四正——${p.cn}的三方决定了全貌。`,
      `看四化——化禄化权化科化忌分别触发什么。`,
      `看大限流年——什么时候${p.cn}的事会被激活。`,
      `问自己：${p.cnQuestions[0]}？${p.cnQuestions[1]}？${p.cnQuestions[2]}？`
    ]}
  ];
}

function enSections(a, type) {
  if (type === 'huaji') {
    const sh = SIHUA.huaji, p = PALACES[a.pKey];
    return [
      {h:`Core Expression of ${sh.en} in the ${p.en}`, ps:[
        `${sh.enTraits[0]} — in matters of ${p.domainEn}, you care more than most and are more easily hurt.`,
        `${sh.enTraits[1]} — ${sh.en} in the ${p.en} often means karmic debt: you owe others, or others owe you.`,
        `${sh.enTraits[2]} — matters in ${p.domainEn} repeat and get stuck; the harder you push, the less moves.`,
        `${sh.enTraits[3]} — rich inner life; nothing shows on the surface, but inside you are tangled.`,
        `${sh.enTraits[4]}. ${sh.en} in the ${p.en} is not a death sentence but a direction for growth in ${p.domainEn}.`
      ]},
      {h:`The Turning Point for ${sh.en} in the ${p.en}`, ps:[
        `${sh.en} worsens with force. In ${p.domainEn}, the harder you grip, the more it backfires; letting go opens a path.`,
        `${sh.en} favors being clashed by Quan — the blockage becomes breakthrough motivation.`,
        `Lu entering the opposite or trinal palace gives the fixation an outlet and the debt a chance to be repaid.`,
        `When the major cycle reaches the ${p.en}, ${sh.en}'s energy peaks — a window to settle old accounts.`,
        `Remember: ${sh.en} does not ask you to stop caring, but to let go after caring.`
      ]},
      {h:'Practical Correspondence and Advice', ps:[
        `If you are struggling in ${p.domainEn}, first ask: am I too fixated?`,
        `If the fixation channels into expertise and depth, ${sh.en} in the ${p.en} can make you the most knowledgeable person in that field.`,
        `If it channels into control and possession, ${p.domainEn} becomes your biggest source of drain.`,
        `Resolve debt through action: apologize, make amends, turn the page.`,
        `The ultimate lesson of ${sh.en} in the ${p.en}: accept imperfection and keep walking.`
      ]},
      {h:'Reading Order', ps:[`For ${sh.en} in the ${p.en}:`], ol:[
        `Check which ruling star ${sh.en} attaches to — it determines the nature of fixation.`,
        `Check brightness — bright: fixation becomes achievement; fallen: it becomes drain.`,
        `Check co-stars and triple direction — auspicious stars resolve; malefics intensify.`,
        `Check whether Lu or Quan aspects — there is a turning point.`,
        `Check major and annual cycles — when old ${p.domainEn} accounts resurface.`,
        `Ask yourself: ${p.enQuestions[0]}? ${p.enQuestions[1]}? ${p.enQuestions[2]}?`
      ]}
    ];
  }
  const s = AUX[a.starKey], p = PALACES[a.pKey];
  return [
    {h:`Core Expression of ${s.en} in the ${p.en}`, ps:[
      `${s.enTraits[0]} — this is the most direct expression in matters of ${p.domainEn}.`,
      `${s.enTraits[1]} — this determines how ${s.en} handles the ${p.en}.`,
      `${s.enTraits[2]} — in the ${p.en} context, this becomes a concrete behavior pattern.`,
      `${s.enTraits[3]} — a double-edged trait: strength when used well, trouble when not.`,
      `${s.enTraits[4]} — often overlooked, but key in matters of ${p.domainEn}.`
    ]},
    {h:'With Auspicious Stars vs Malefics', ps:[
      `With Zuo Fu/You Bi — help arrives in ${p.domainEn}; ${s.en}'s energy can land.`,
      `With Tian Kui/Tian Yue — benefactors appear at key moments; ${p.en} matters resolve.`,
      `With Wen Chang/Wen Qu — ${s.en} gains strategy and expression.`,
      `With Qing Yang/Tuo Luo — the process of ${p.domainEn} is harder, with delays or conflict.`,
      `With Huo Xing/Ling Xing — sudden disruptions; ${p.en} matters get interrupted.`
    ]},
    {h:'Practical Correspondence and Advice', ps:[
      `If dealing with ${p.en} matters, first check whether the ruling star is bright or fallen.`,
      `When bright, ${s.enTraits[0]} is your core advantage.`,
      `When fallen, compensate through conscious choices.`,
      `Lu or Quan in the ${p.en} brings breakthroughs in ${p.domainEn}; Ke brings reputation; Ji marks a blockage.`,
      `Remember: ${s.en} in the ${p.en} is not fate but a manual.`
    ]},
    {h:'Reading Order', ps:[`For ${s.en} in the ${p.en}:`], ol:[
      `Check the ruling star — it sets the baseline.`,
      `Check how ${s.en} combines with it — auspicious adds; malefic subtracts.`,
      `Check triple direction — the ${p.en}'s aspects reveal the full picture.`,
      `Check transformations — what Lu, Quan, Ke, Ji each activate.`,
      `Check major and annual cycles — when ${p.en} matters get triggered.`,
      `Ask yourself: ${p.enQuestions[0]}? ${p.enQuestions[1]}? ${p.enQuestions[2]}?`
    ]}
  ];
}

function getSidebar(a, isEn) {
  if (a.type === 'huaji') {
    return [
      {href:'ziwei-sihua.html',text:isEn?'Four Transformations':'四化飞星'},
      {href:'ziwei-huaji.html',text:isEn?'Hua Ji':'化忌'},
      {href:`ziwei-${a.pKey}.html`,text:isEn?PALACES[a.pKey].en:PALACES[a.pKey].cn},
      {href:'ziwei-sanfang-sizheng.html',text:isEn?'Triple Direction':'先看三方四正'},
      {href:isEn?'../../pages/mingbook-onepage.html':'../pages/mingbook-onepage.html',text:isEn?'Quick Chart':'快速排盘'}
    ];
  }
  const s = AUX[a.starKey];
  return [
    {href:'ziwei-helper-malice-stars.html',text:isEn?'Assistant & Malefic Stars':'辅曜煞曜'},
    {href:`ziwei-star-${a.starKey}.html`,text:isEn?`${s.en} Star`:`${s.cn}星详解`},
    {href:`ziwei-${a.pKey}.html`,text:isEn?PALACES[a.pKey].en:PALACES[a.pKey].cn},
    {href:'ziwei-sanfang-sizheng.html',text:isEn?'Triple Direction':'先看三方四正'},
    {href:isEn?'../../pages/mingbook-onepage.html':'../pages/mingbook-onepage.html',text:isEn?'Quick Chart':'快速排盘'}
  ];
}

function buildHTML(a, isEn) {
  const sections = isEn ? enSections(a, a.type) : cnSections(a, a.type);
  const sidebar = getSidebar(a, isEn);
  const title = isEn ? a.enTitle : a.cnTitle;
  const desc = isEn ? a.enDesc : a.cnDesc;
  const catName = isEn ? a.catEn : a.cat;
  const lead = isEn ? a.enLead : a.cnLead;
  const intro2 = isEn ? a.enIntro2 : a.cnIntro2;
  let sectionsHtml = '';
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    sectionsHtml += `\n        <h2 id="section-${i+1}">${s.h}</h2>\n`;
    for (const p of s.ps) sectionsHtml += `        <p>${p}</p>\n`;
    if (s.ol) {
      sectionsHtml += '        <ol>\n';
      for (const item of s.ol) sectionsHtml += `          <li>${item}</li>\n`;
      sectionsHtml += '        </ol>\n';
    }
  }
  let sidebarHtml = '';
  for (const link of sidebar) sidebarHtml += `        <a class="card-link" href="${link.href}">${link.text}</a>\n`;

  const catPage = a.type === 'huaji' ? 'ziwei-sihua.html' : 'ziwei-helper-malice-stars.html';

  if (isEn) {
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
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${date}","dateModified":"${date}","inLanguage":"en","articleSection":"Zi Wei Dou Shu","about":["Zi Wei Dou Shu","${catName}","${jstr(title)}"],"author":{"@type":"Organization","name":"YuetianAI"},"publisher":{"@type":"Organization","name":"YuetianAI"},"mainEntityOfPage":"https://yuetianai.com/articles/en/${a.slug}.html"}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a><nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${a.slug}.html">Chinese</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${catName}</span></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-25 10:00</time></span></p>
    </div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="Related links"><h2>Read Next</h2>
${sidebarHtml}      </aside>
    </div>
    <div class="container article-bottom-link"><span>Read this, then compare it against your own chart for clearer insight.</span><a href="../../pages/mingbook-onepage.html">Quick Chart →</a></div>
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
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${date}","dateModified":"${date}","inLanguage":"zh-CN","articleSection":"${catName}","about":["紫微斗数","${catName}","${jstr(title)}"],"author":{"@type":"Organization","name":"阅天AI"},"publisher":{"@type":"Organization","name":"阅天AI"},"mainEntityOfPage":"https://yuetianai.com/articles/${a.slug}.html"}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"阅天AI","item":"https://yuetianai.com/"},{"@type":"ListItem","position":2,"name":"学习紫微","item":"https://yuetianai.com/articles/"},{"@type":"ListItem","position":3,"name":"${catName}","item":"https://yuetianai.com/articles/${catPage}"},{"@type":"ListItem","position":4,"name":"${jstr(title)}","item":"https://yuetianai.com/articles/${a.slug}.html"}]}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a><nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${a.slug}.html">English</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="${catPage}">${catName}</a></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>${catName}</span><span><time datetime="${date}">2026-08-25 10:00</time></span></p>
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

const articles = combos.map(c => {
  if (c.type === 'huaji') {
    const a = genHuajiArticle(c.pKey);
    a.type = 'huaji'; a.pKey = c.pKey; a.starKey = null;
    return a;
  } else {
    const a = genAuxArticle(c.starKey, c.pKey);
    a.type = 'aux'; a.starKey = c.starKey; a.pKey = c.pKey;
    return a;
  }
});

for (const a of articles) {
  fs.writeFileSync(path.join(__dirname,'articles',`${a.slug}.html`), buildHTML(a,false).replace(/\r\n/g,'\n'), 'utf8');
  fs.writeFileSync(path.join(__dirname,'articles','en',`${a.slug}.html`), buildHTML(a,true).replace(/\r\n/g,'\n'), 'utf8');
}
console.log(`Total: ${articles.length} articles (${articles.length*2} HTML files)`);
console.log('化忌:', articles.filter(a=>a.type==='huaji').length);
console.log('天魁:', articles.filter(a=>a.starKey==='tiankui').length);
console.log('天钺:', articles.filter(a=>a.starKey==='tianyue').length);
console.log('擎羊:', articles.filter(a=>a.starKey==='qingyang').length);
