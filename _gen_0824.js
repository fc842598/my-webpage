const fs=require('fs'),path=require('path');
const date='2026-08-24T10:30:00+08:00';
function jstr(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"');}

const STARS = {
  jumen: {cn:'巨门',en:'Ju Men',elem:'阴水/阴金',elemEn:'yin water/yin metal',nature:'暗星、口舌之星',natureEn:'the dark star and the star of speech',cat:'主星',catEn:'Main Stars',
    cnTraits:['口才好、善于分析','心思细腻、观察力强','容易招是非口舌','多疑、喜欢追问到底','适合靠嘴和笔吃饭'],
    enTraits:['eloquent, analytical','detail-minded, observant','prone to disputes and gossip','skeptical, likes to get to the bottom','suited to work involving speech or writing']},
  tianxiang: {cn:'天相',en:'Tian Xiang',elem:'阳水',elemEn:'yang water',nature:'印星、衣食之星',natureEn:'the seal star and the star of food and clothing',cat:'主星',catEn:'Main Stars',
    cnTraits:['稳重踏实、做事有板有眼','重视公平和规则','善于协调和辅佐','注重外表和礼仪','容易想太多、优柔寡断'],
    enTraits:['steady and methodical','values fairness and rules','good at coordination and assistance','cares about appearance and etiquette','prone to overthinking and indecision']},
  tianliang: {cn:'天梁',en:'Tian Liang',elem:'阳土',elemEn:'yang earth',nature:'荫星、寿星、监察星',natureEn:'the shelter star, longevity star, and inspector',cat:'主星',catEn:'Main Stars',
    cnTraits:['正直善良、乐于助人','有长辈缘、逢凶化吉','思想成熟、喜欢教育人','清高、不爱争名夺利','有点固执和说教'],
    enTraits:['upright and helpful','good elder luck, turns misfortune into blessing','mature thinker, likes to teach others','pure-minded, dislikes competition','somewhat stubborn and preachy']},
  qisha: {cn:'七杀',en:'Qi Sha',elem:'阴金/火',elemEn:'yin metal/fire',nature:'将星、肃杀之星',natureEn:'the general star and the star of stern authority',cat:'主星',catEn:'Main Stars',
    cnTraits:['刚毅果断、敢作敢当','独立好强、不依赖人','行动力极强、喜欢挑战','脾气急、容易冲动','一生波动大、大起大落'],
    enTraits:['resolute and decisive','independent and competitive','extremely strong action orientation, loves challenges','quick-tempered and impulsive','life with major ups and downs']},
  pojun: {cn:'破军',en:'Po Jun',elem:'阴水',elemEn:'yin water',nature:'耗星、先锋之星',natureEn:'the wasting star and the vanguard star',cat:'主星',catEn:'Main Stars',
    cnTraits:['敢闯敢拼、破坏后重建','创新求变、不走寻常路','独立性强、不服管束','花钱大方、财来财去','感情和事业都容易多变'],
    enTraits:['bold and pioneering, destroys then rebuilds','innovative, takes unconventional paths','highly independent, resists control','spends freely, money comes and goes','relationships and career prone to change']},
  zuofu: {cn:'左辅',en:'Zuo Fu',elem:'阳土',elemEn:'yang earth',nature:'辅佐吉星',natureEn:'the left assistant auspicious star',cat:'辅曜',catEn:'Assistant Stars',
    cnTraits:['忠厚善良、乐于助人','执行力强、是好帮手','稳重可靠、值得信赖','有包容心','单独出现力量有限'],
    enTraits:['honest and helpful','strong execution, a good assistant','steady and reliable','tolerant and inclusive','limited power when appearing alone']},
  youbi: {cn:'右弼',en:'You Bi',elem:'阴水',elemEn:'yin water',nature:'辅佐吉星',natureEn:'the right assistant auspicious star',cat:'辅曜',catEn:'Assistant Stars',
    cnTraits:['聪明机智、反应快','善于交际、人缘好','灵活变通、懂迂回','有艺术感','感情上容易有隐情'],
    enTraits:['clever and quick-witted','sociable and popular','flexible and tactful','artistic sensibility','prone to hidden romantic matters']},
  wenchang: {cn:'文昌',en:'Wen Chang',elem:'阳金',elemEn:'yang metal',nature:'文星、科甲星',natureEn:'the literary star and examination star',cat:'辅曜',catEn:'Assistant Stars',
    cnTraits:['聪明好学、文笔好','重视正规学历和考试','逻辑清晰、有条理','有文书契约缘','化忌时容易考试失利'],
    enTraits:['intelligent and studious, good writing','values formal education and exams','clear logic and organization','affinity for documents and contracts','with Hua Ji, exam setbacks are likely']},
  wenqu: {cn:'文曲',en:'Wen Qu',elem:'阴水',elemEn:'yin water',nature:'文星、才艺星',natureEn:'the literary star and talent star',cat:'辅曜',catEn:'Assistant Stars',
    cnTraits:['多才多艺、口才好','直觉强、有创意','适合艺术、演艺、策划','感情丰富','与文昌不同，偏非正式学问'],
    enTraits:['versatile and eloquent','strong intuition and creativity','suited to arts, performance, planning','emotionally rich','unlike Wen Chang, favors informal learning']},
  tiankui: {cn:'天魁',en:'Tian Kui',elem:'阳火',elemEn:'yang fire',nature:'天乙贵人、昼贵',natureEn:'the celestial benefactor, daytime nobility',cat:'辅曜',catEn:'Assistant Stars',
    cnTraits:['贵人运强、长辈提携','光明正大的帮助','阳刚属性、男性贵人多','逢凶化吉','直接显化的助力'],
    enTraits:['strong benefactor luck, elder support','open and above-board help','yang nature, more male benefactors','turns misfortune into blessing','direct, visible assistance']},
  tianyue: {cn:'天钺',en:'Tian Yue',elem:'阴火',elemEn:'yin fire',nature:'玉堂贵人、夜贵',natureEn:'the jade hall benefactor, nighttime nobility',cat:'辅曜',catEn:'Assistant Stars',
    cnTraits:['贵人运强、暗中相助','温柔含蓄的帮助','阴柔属性、女性贵人多','逢凶化吉','间接隐密的助力'],
    enTraits:['strong benefactor luck, hidden assistance','gentle and subtle help','yin nature, more female benefactors','turns misfortune into blessing','indirect, behind-the-scenes support']}
};

const PALACES = {
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
    cnQuestions:['孩子缘深不深','跟子女关系怎样','创造力如何'],enQuestions:['whether children luck is strong','how relationships with children are','how creativity is']},
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
    cnQuestions:['有没有房产运','家里环境怎样','能不能守住家底'],enQuestions:['whether property luck exists','what the home environment is like','whether family assets can be kept']}
};

// Title generators
const CN_TITLES = {
  'jumen-fudegong':'心思太重的人，福气都被想没了',
  'jumen-fumugong':'跟父母沟通靠讲理，但家不是辩论场',
  'tianxiang-minggong':'印星坐命：天生的二把手和协调者',
  'tianxiang-xiongdigong':'兄弟姐妹中有人当和事佬',
  'tianxiang-fuqigong':'伴侣稳重体面，婚姻讲究门当户对',
  'tianxiang-zinvgong':'孩子懂事守规矩，教育要给主见',
  'tianxiang-caibogong':'收入稳但不暴富，靠专业和信誉赚钱',
  'tianxiang-jiegong':'注意肾脏和泌尿系统，饮食要规律',
  'tianxiang-qianyi':'在外形象好，离乡靠口碑吃饭',
  'tianxiang-puyigong':'朋友多为正派人士，但知心不多',
  'tianxiang-guanlugong':'适合辅佐型岗位，是最佳二把手',
  'tianxiang-tianzhaigong':'家里整洁有序，居家运平稳',
  'tianxiang-fudegong':'心态平和但容易纠结，学会做决定',
  'tianxiang-fumugong':'父母有身份地位，家教严格',
  'tianliang-minggong':'荫星坐命：逢凶化吉的老灵魂',
  'tianliang-xiongdigong':'兄弟姐妹中有贵人，年龄差距大',
  'tianliang-fuqigong':'伴侣像长辈一样照顾你，感情有年龄差',
  'tianliang-zinvgong':'孩子懂事独立，教育要放手不要操心',
  'tianliang-caibogong':'收入来自荫庇和专业，不适合投机',
  'tianliang-jiegong':'注意脾胃和消化系统，长寿体质',
  'tianliang-qianyi':'在外遇贵人，离乡发展有长辈提携',
  'tianliang-puyigong':'朋友多为年长者，诤友多',
  'tianliang-guanlugong':'适合教育、医疗、法律等助人行业',
  'tianliang-tianzhaigong':'家产有荫庇，可能继承祖业',
  'tianliang-fudegong':'福气最厚的位置之一，心态好逢凶化吉',
  'tianliang-fumugong':'父母是你的保护伞，长辈缘极深',
  'qisha-minggong':'将星坐命：独来独往的开路人',
  'qisha-xiongdigong':'兄弟姐妹个性强，关系淡但关键时刻靠得住',
  'qisha-fuqigong':'伴侣强势独立，感情像战友不像情侣',
  'qisha-zinvgong':'孩子好胜独立，教育要给空间不要压制',
  'qisha-caibogong':'财运大开大合，适合高风险高回报',
  'qisha-jiegong':'注意外伤和急性病，运动要热身',
  'qisha-qianyi':'在外闯荡能出头，离乡反而是出路',
  'qisha-puyigong':'朋友少而精，都是能一起扛事的人',
  'qisha-guanlugong':'适合军警、创业、竞争性强的行业',
  'qisha-tianzhaigong':'房产运波动大，容易买卖频繁',
  'qisha-fudegong':'停不下来的人，放松对他们来说很难',
  'qisha-fumugong':'父母管教严厉，关系有距离感',
  'pojun-minggong':'先锋星坐命：先破后立的变革者',
  'pojun-xiongdigong':'兄弟姐妹中有人不走寻常路',
  'pojun-fuqigong':'感情波折多，伴侣需要能接受变化',
  'pojun-zinvgong':'孩子叛逆有主见，教育要引导不要堵',
  'pojun-caibogong':'财来财去波动大，适合创新行业',
  'pojun-jiegong':'注意牙齿和骨骼，旧伤容易复发',
  'pojun-qianyi':'在外开创新局面，离乡发展更精彩',
  'pojun-puyigong':'朋友流动性大，旧友去新友来',
  'pojun-guanlugong':'适合创业、改革、开拓新市场',
  'pojun-tianzhaigong':'居家环境常变，房产买卖频繁',
  'pojun-fudegong':'精神上追求突破，不满足于现状',
  'pojun-fumugong':'与父母缘分多变，可能离家早',
  'zuofu-minggong':'忠厚老实的好帮手，贵人来自你的靠谱',
  'zuofu-xiongdigong':'兄弟姐妹是你的后盾，有人帮你扛事',
  'zuofu-fuqigong':'伴侣是你的贤内助，婚姻稳定',
  'zuofu-zinvgong':'子女乖巧听话，教育上多给陪伴',
  'zuofu-caibogong':'收入靠稳扎稳打，有人带你赚钱',
  'zuofu-jiegong':'体质偏壮实，但要注意饮食过量',
  'zuofu-qianyi':'外出遇贵人帮忙，离乡有人照应',
  'zuofu-puyigong':'朋友忠诚可靠，是你的左膀右臂',
  'zuofu-guanlugong':'职场上有贵人提拔，适合辅佐岗位',
  'zuofu-tianzhaigong':'家里有帮手，置业运稳',
  'zuofu-fudegong':'心态宽厚，福气来自厚道',
  'zuofu-fumugong':'父母温和有助力，家庭氛围好',
  'youbi-minggong':'聪明圆融的交际家，到哪都有人帮',
  'youbi-xiongdigong':'兄弟姐妹中有人善交际，能帮你牵线',
  'youbi-fuqigong':'伴侣善解人意，但要防第三者',
  'youbi-zinvgong':'孩子聪明机灵，教育要防分心',
  'youbi-caibogong':'赚钱靠人脉和机会，有人介绍生意',
  'youbi-jiegong':'注意肾脏和内分泌，情绪影响健康',
  'youbi-qianyi':'在外人缘极好，出门靠朋友',
  'youbi-puyigong':'朋友遍天下，但要防表面朋友',
  'youbi-guanlugong':'职场上靠人际关系上位',
  'youbi-tianzhaigong':'家里常有客人，居家氛围活跃',
  'youbi-fudegong':'精神上需要陪伴，怕孤独',
  'youbi-fumugong':'父母随和开明，沟通顺畅',
  'wenchang-minggong':'文笔出众的读书人，靠知识改变命运',
  'wenchang-xiongdigong':'兄弟姐妹中有学霸，文书上能帮你',
  'wenchang-fuqigong':'伴侣有学识，感情讲究精神共鸣',
  'wenchang-zinvgong':'孩子读书好，教育上重视学业',
  'wenchang-caibogong':'靠专业知识和文书赚钱',
  'wenchang-jiegong':'注意呼吸系统和大肠，用脑过度',
  'wenchang-qianyi':'在外靠学历和证书立足',
  'wenchang-puyigong':'朋友多为文化人，能交流学问',
  'wenchang-guanlugong':'适合教育、写作、公职等文职',
  'wenchang-tianzhaigong':'家里书房布置好，有家学渊源',
  'wenchang-fudegong':'精神追求高雅，喜欢读书思考',
  'wenchang-fumugong':'父母重视教育，学历运好',
  'wenqu-minggong':'多才多艺的创意人，靠才华吃饭',
  'wenqu-xiongdigong':'兄弟姐妹中有才艺出众者',
  'wenqu-fuqigong':'伴侣浪漫有情趣，感情丰富',
  'wenqu-zinvgong':'孩子有艺术天赋，教育要因材施教',
  'wenqu-caibogong':'靠才艺和口才赚钱，偏门财路多',
  'wenqu-jiegong':'注意肾脏和生殖系统，不要熬夜',
  'wenqu-qianyi':'在外靠才艺和口才吸引人',
  'wenqu-puyigong':'朋友多为艺术圈人士',
  'wenqu-guanlugong':'适合艺术、传媒、策划等创意行业',
  'wenqu-tianzhaigong':'家里有艺术氛围，装修有品味',
  'wenqu-fudegong':'精神世界浪漫多彩，喜欢享受',
  'wenqu-fumugong':'父母有才艺，家庭有艺术氛围',
  'tiankui-minggong':'贵人坐命：光明正大的好运气',
  'tianyue-minggong':'贵人坐命：暗中相助的好运气'
};

const EN_TITLES = {
  'jumen-fudegong':'Overthinking Drains Away Blessings',
  'jumen-fumugong':'Reasoning with Parents, but Home Is Not a Debate Court',
  'tianxiang-minggong':'The Seal Star in Life: Born Second-in-Command',
  'tianxiang-xiongdigong':'A Peacemaker Among Siblings',
  'tianxiang-fuqigong':'A Steady, Presentable Partner; Marriage Values Matching Status',
  'tianxiang-zinvgong':'Well-Behaved Children; Give Them Independent Thinking',
  'tianxiang-caibogong':'Stable Income, No Windfalls; Earning Through Expertise and Reputation',
  'tianxiang-jiegong':'Watch Kidneys and Urinary System; Regular Eating Habits',
  'tianxiang-qianyi':'Good Reputation Outside; Earning by Word of Mouth',
  'tianxiang-puyigong':'Mostly Upright Friends, but Few Confidants',
  'tianxiang-guanlugong':'Suited to Support Roles; The Best Deputy',
  'tianxiang-tianzhaigong':'Tidy, Orderly Home; Stable Domestic Luck',
  'tianxiang-fudegong':'Peaceful Mind but Prone to Indecision; Learn to Choose',
  'tianxiang-fumugong':'Parents Have Status; Strict Family Education',
  'tianliang-minggong':'The Shelter Star in Life: An Old Soul Who Turns Misfortune Around',
  'tianliang-xiongdigong':'A Benefactor Among Siblings; Large Age Gap',
  'tianliang-fuqigong':'A Partner Who Cares Like an Elder; Age Gap in Love',
  'tianliang-zinvgong':'Independent, Sensible Children; Let Go, Do Not Fret',
  'tianliang-caibogong':'Income from Shelter and Expertise; Not for Speculation',
  'tianliang-jiegong':'Watch Spleen and Digestion; Longevity Constitution',
  'tianliang-qianyi':'Benefactors Outside; Elder Support Away from Home',
  'tianliang-puyigong':'Mostly Older Friends; Many Straight Talkers',
  'tianliang-guanlugong':'Suited to Education, Medicine, Law — Helping Professions',
  'tianliang-tianzhaigong':'Family Property with Shelter; May Inherit Ancestral Assets',
  'tianliang-fudegong':'One of the Most Blessed Positions; Good Mindset Turns Misfortune',
  'tianliang-fumugong':'Parents Are Your Umbrella; Deepest Elder Bonds',
  'qisha-minggong':'The General in Life: An Independent Trailblazer',
  'qisha-xiongdigong':'Strong-Willed Siblings; Distant but Reliable in Crisis',
  'qisha-fuqigong':'A Strong, Independent Partner; Love Is Like Comradeship',
  'qisha-zinvgong':'Competitive, Independent Children; Give Space, Do Not Suppress',
  'qisha-caibogong':'Big Swings in Wealth; Suited to High Risk, High Reward',
  'qisha-jiegong':'Watch Injuries and Acute Illness; Warm Up Before Exercise',
  'qisha-qianyi':'Breaking Through Outside; Leaving Home Is the Path',
  'qisha-puyigong':'Few but Loyal Friends; People Who Carry Burdens with You',
  'qisha-guanlugong':'Suited to Military, Police, Entrepreneurship, Competitive Fields',
  'qisha-tianzhaigong':'Volatile Property Luck; Frequent Buying and Selling',
  'qisha-fudegong':'Someone Who Cannot Stop; Relaxation Is Hard',
  'qisha-fumugong':'Strict Parents; Distant Relationship',
  'pojun-minggong':'The Vanguard in Life: A Revolutionary Who Destroys Then Rebuilds',
  'pojun-xiongdigong':'A Sibling Who Takes an Unconventional Path',
  'pojun-fuqigong':'Many Relationship Twists; Partner Must Accept Change',
  'pojun-zinvgong':'Rebellious, Opinionated Children; Guide, Do Not Block',
  'pojun-caibogong':'Volatile Cash Flow; Suited to Innovative Industries',
  'pojun-jiegong':'Watch Teeth and Bones; Old Injuries May Recur',
  'pojun-qianyi':'Creating New Frontiers Outside; Leaving Home Brings Excitement',
  'pojun-puyigong':'High Friend Turnover; Old Friends Go, New Ones Come',
  'pojun-guanlugong':'Suited to Entrepreneurship, Reform, New Market Development',
  'pojun-tianzhaigong':'Frequent Home Changes; Active Property Trading',
  'pojun-fudegong':'Spiritual Pursuit of Breakthrough; Never Satisfied with Status Quo',
  'pojun-fumugong':'Changeable Parental Bonds; May Leave Home Early',
  'zuofu-minggong':'An Honest, Reliable Helper; Benefactors Come from Your Trustworthiness',
  'zuofu-xiongdigong':'Siblings Are Your Backing; Someone Helps Carry the Load',
  'zuofu-fuqigong':'A Supportive Partner; Stable Marriage',
  'zuofu-zinvgong':'Well-Behaved Children; Give Them Companionship',
  'zuofu-caibogong':'Steady Income; Someone Guides You to Earn',
  'zuofu-jiegong':'Sturdy Constitution; Watch Overeating',
  'zuofu-qianyi':'Benefactors Help Outside; Someone Looks After You Away',
  'zuofu-puyigong':'Loyal, Reliable Friends; Your Right and Left Hands',
  'zuofu-guanlugong':'Benefactors Promote You at Work; Suited to Support Roles',
  'zuofu-tianzhaigong':'Help at Home; Stable Property Luck',
  'zuofu-fudegong':'Generous Mindset; Blessings Come from Kindness',
  'zuofu-fumugong':'Gentle, Helpful Parents; Good Family Atmosphere',
  'youbi-minggong':'A Clever, Harmonious Networker; Helped Wherever You Go',
  'youbi-xiongdigong':'A Sociable Sibling Who Makes Connections for You',
  'youbi-fuqigong':'An Understanding Partner; Watch for Third Parties',
  'youbi-zinvgong':'Clever, Quick-Witted Children; Prevent Distraction',
  'youbi-caibogong':'Earning Through Connections and Opportunities; Referrals Come',
  'youbi-jiegong':'Watch Kidneys and Endocrine; Emotions Affect Health',
  'youbi-qianyi':'Extremely Popular Outside; Rely on Friends Away from Home',
  'youbi-puyigong':'Friends Everywhere; Beware Superficial Ones',
  'youbi-guanlugong':'Advancing Through Relationships at Work',
  'youbi-tianzhaigong':'Frequent Guests; Lively Home Atmosphere',
  'youbi-fudegong':'Needs Companionship Spiritually; Fears Loneliness',
  'youbi-fumugong':'Easy-Going, Open-Minded Parents; Smooth Communication',
  'wenchang-minggong':'An Outstanding Writer; Knowledge Changes Destiny',
  'wenchang-xiongdigong':'A Scholarly Sibling Who Helps with Documents',
  'wenchang-fuqigong':'An Educated Partner; Love Needs Intellectual Resonance',
  'wenchang-zinvgong':'Academically Inclined Children; Value Education',
  'wenchang-caibogong':'Earning Through Expert Knowledge and Documents',
  'wenchang-jiegong':'Watch Respiratory System and Colon; Overthinking Drains',
  'wenchang-qianyi':'Establishing Outside Through Credentials and Certificates',
  'wenchang-puyigong':'Mostly Literary Friends; Intellectual Exchange',
  'wenchang-guanlugong':'Suited to Education, Writing, Civil Service — Literary Fields',
  'wenchang-tianzhaigong':'A Good Study at Home; Family Scholarly Tradition',
  'wenchang-fudegong':'Refined Spiritual Pursuits; Loves Reading and Thinking',
  'wenchang-fumugong':'Parents Value Education; Good Academic Luck',
  'wenqu-minggong':'A Versatile Creative; Living by Talent',
  'wenqu-xiongdigong':'A Sibling with Artistic Talent',
  'wenqu-fuqigong':'A Romantic, Charming Partner; Emotionally Rich',
  'wenqu-zinvgong':'Artistically Gifted Children; Teach According to Aptitude',
  'wenqu-caibogong':'Earning Through Talent and Eloquence; Many Side Income Paths',
  'wenqu-jiegong':'Watch Kidneys and Reproductive System; Avoid Late Nights',
  'wenqu-qianyi':'Attracting Others Through Talent and Speech Outside',
  'wenqu-puyigong':'Mostly Friends from Artistic Circles',
  'wenqu-guanlugong':'Suited to Arts, Media, Planning — Creative Industries',
  'wenqu-tianzhaigong':'An Artistic Home; Tasteful Decoration',
  'wenqu-fudegong':'A Romantic, Colorful Inner World; Loves Enjoyment',
  'wenqu-fumugong':'Artistic Parents; Creative Family Atmosphere',
  'tiankui-minggong':'Benefactor in Life: Open, Above-Board Good Fortune',
  'tianyue-minggong':'Benefactor in Life: Hidden, Behind-the-Scenes Good Fortune'
};

function genArticle(starKey, palaceKey) {
  const s = STARS[starKey], p = PALACES[palaceKey];
  const slug = `ziwei-${starKey}-zai-${palaceKey}`;
  return {
    slug,
    cnTitle: `${s.cn}在${p.cn}：${CN_TITLES[starKey+'-'+palaceKey]||s.cn+'在'+p.cn}`,
    enTitle: `${s.en} in ${p.en}: ${EN_TITLES[starKey+'-'+palaceKey]||s.en+' in '+p.en}`,
    cnDesc: `${s.cn}在${p.cn}，${p.domain}。${s.cn}是${s.nature}，落在${p.cn}有它独特的表现和需要注意的地方。`,
    enDesc: `${s.en} in the ${p.en} affects ${p.domainEn}. As ${s.natureEn}, it brings distinct patterns and cautions.`,
    cnLead: `很多人看到${s.cn}在${p.cn}，第一反应是查「好不好」。但${s.cn}是${s.nature}，它落在${p.cn}不是简单的好坏问题，而是这颗星的能量会以什么方式在${p.domain}这件事上表现出来。${s.cn}的关键词是${s.cnTraits.slice(0,3).join('、')}，这些特质放到${p.cn}的场景里，会产生非常具体的现实对应。`,
    enLead: `Many people seeing ${s.en} in the ${p.en} first ask "is it good or bad." But ${s.en} is ${s.natureEn}; in the ${p.en} the question is not good or bad but how its energy shows up in ${p.domainEn}. ${s.en} keywords are ${s.enTraits.slice(0,3).join(', ')}, and these traits produce very concrete patterns in the ${p.en} context.`,
    cnIntro2: `${p.cn}看的是${p.domain}。${s.cn}属${s.elem}，它的能量特质是${s.cnTraits[0]}。读这颗星在${p.cn}，不能只看单宫，必须回到三方四正——${p.cn}的三方会照决定了${s.cn}的能量能不能被接住。有吉星会照，${s.cn}的优点能落地；被煞星冲照，同样的特质可能变成压力和阻碍。`,
    enIntro2: `The ${p.en} covers ${p.domainEn}. ${s.en} is ${s.elemEn}, with an energy of ${s.enTraits[0]}. Reading it in the ${p.en} requires the triple-direction view — the palaces that aspect the ${p.en} determine whether ${s.en}'s energy can be received. With auspicious stars, its strengths land; with malefics, the same traits can become pressure and obstacles.`,
    cnSections: genCnSections(s,p),
    enSections: genEnSections(s,p),
    cnSidebar: getSidebar(starKey,palaceKey,false),
    enSidebar: getSidebar(starKey,palaceKey,true),
    cat: s.cat, catEn: s.catEn
  };
}

function genCnSections(s,p){
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

function genEnSections(s,p){
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

function getSidebar(sk,pk,isEn){
  const s = STARS[sk];
  const catPage = s.cat === '主星' ? 'ziwei-main-stars.html' : 'ziwei-aux-stars.html';
  const catText = isEn ? s.catEn : s.cat;
  return [
    {href:'ziwei-main-stars.html',text:isEn?'Main Stars':'十四主星总览'},
    {href:catPage,text:catText},
    {href:`ziwei-star-${sk}.html`,text:isEn?`${s.en} Star`:`${s.cn}星详解`},
    {href:`ziwei-${pk}.html`,text:isEn?PALACES[pk].en:PALACES[pk].cn},
    {href:'ziwei-sanfang-sizheng.html',text:isEn?'Triple Direction':'先看三方四正'},
    {href:isEn?'../../pages/mingbook-onepage.html':'../pages/mingbook-onepage.html',text:isEn?'Quick Chart':'快速排盘'}
  ];
}

function buildHTML(a,isEn){
  const sections=isEn?a.enSections:a.cnSections;
  const sidebar=isEn?a.enSidebar:a.cnSidebar;
  const lead=isEn?a.enLead:a.cnLead;
  const intro2=isEn?a.enIntro2:a.cnIntro2;
  const title=isEn?a.enTitle:a.cnTitle;
  const desc=isEn?a.enDesc:a.cnDesc;
  const catName=isEn?a.catEn:a.cat;
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
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${date}","dateModified":"${date}","inLanguage":"en","articleSection":"Zi Wei Dou Shu","about":["Zi Wei Dou Shu","${catName}","${jstr(title)}"],"author":{"@type":"Organization","name":"YuetianAI"},"publisher":{"@type":"Organization","name":"YuetianAI"},"mainEntityOfPage":"https://yuetianai.com/articles/en/${a.slug}.html"}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a><nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${a.slug}.html">Chinese</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${catName}</span></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${date}">2026-08-24 10:30</time></span></p>
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
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${date}","dateModified":"${date}","inLanguage":"zh-CN","articleSection":"${catName}","about":["紫微斗数","${catName}","${jstr(title)}"],"author":{"@type":"Organization","name":"阅天AI"},"publisher":{"@type":"Organization","name":"阅天AI"},"mainEntityOfPage":"https://yuetianai.com/articles/${a.slug}.html"}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"阅天AI","item":"https://yuetianai.com/"},{"@type":"ListItem","position":2,"name":"学习紫微","item":"https://yuetianai.com/articles/"},{"@type":"ListItem","position":3,"name":"${catName}","item":"https://yuetianai.com/articles/ziwei-main-stars.html"},{"@type":"ListItem","position":4,"name":"${jstr(title)}","item":"https://yuetianai.com/articles/${a.slug}.html"}]}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a><nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${a.slug}.html">English</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="ziwei-main-stars.html">${catName}</a></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>${catName}</span><span><time datetime="${date}">2026-08-24 10:30</time></span></p>
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

// 100 articles: 50 main stars + 50 auxiliary stars
const combos = [
  // 巨门 2
  ['jumen','fudegong'],['jumen','fumugong'],
  // 天相 12
  ['tianxiang','minggong'],['tianxiang','xiongdigong'],['tianxiang','fuqigong'],['tianxiang','zinvgong'],
  ['tianxiang','caibogong'],['tianxiang','jiegong'],['tianxiang','qianyi'],['tianxiang','puyigong'],
  ['tianxiang','guanlugong'],['tianxiang','tianzhaigong'],['tianxiang','fudegong'],['tianxiang','fumugong'],
  // 天梁 12
  ['tianliang','minggong'],['tianliang','xiongdigong'],['tianliang','fuqigong'],['tianliang','zinvgong'],
  ['tianliang','caibogong'],['tianliang','jiegong'],['tianliang','qianyi'],['tianliang','puyigong'],
  ['tianliang','guanlugong'],['tianliang','tianzhaigong'],['tianliang','fudegong'],['tianliang','fumugong'],
  // 七杀 12
  ['qisha','minggong'],['qisha','xiongdigong'],['qisha','fuqigong'],['qisha','zinvgong'],
  ['qisha','caibogong'],['qisha','jiegong'],['qisha','qianyi'],['qisha','puyigong'],
  ['qisha','guanlugong'],['qisha','tianzhaigong'],['qisha','fudegong'],['qisha','fumugong'],
  // 破军 12
  ['pojun','minggong'],['pojun','xiongdigong'],['pojun','fuqigong'],['pojun','zinvgong'],
  ['pojun','caibogong'],['pojun','jiegong'],['pojun','qianyi'],['pojun','puyigong'],
  ['pojun','guanlugong'],['pojun','tianzhaigong'],['pojun','fudegong'],['pojun','fumugong'],
  // 左辅 12
  ['zuofu','minggong'],['zuofu','xiongdigong'],['zuofu','fuqigong'],['zuofu','zinvgong'],
  ['zuofu','caibogong'],['zuofu','jiegong'],['zuofu','qianyi'],['zuofu','puyigong'],
  ['zuofu','guanlugong'],['zuofu','tianzhaigong'],['zuofu','fudegong'],['zuofu','fumugong'],
  // 右弼 12
  ['youbi','minggong'],['youbi','xiongdigong'],['youbi','fuqigong'],['youbi','zinvgong'],
  ['youbi','caibogong'],['youbi','jiegong'],['youbi','qianyi'],['youbi','puyigong'],
  ['youbi','guanlugong'],['youbi','tianzhaigong'],['youbi','fudegong'],['youbi','fumugong'],
  // 文昌 12
  ['wenchang','minggong'],['wenchang','xiongdigong'],['wenchang','fuqigong'],['wenchang','zinvgong'],
  ['wenchang','caibogong'],['wenchang','jiegong'],['wenchang','qianyi'],['wenchang','puyigong'],
  ['wenchang','guanlugong'],['wenchang','tianzhaigong'],['wenchang','fudegong'],['wenchang','fumugong'],
  // 文曲 12
  ['wenqu','minggong'],['wenqu','xiongdigong'],['wenqu','fuqigong'],['wenqu','zinvgong'],
  ['wenqu','caibogong'],['wenqu','jiegong'],['wenqu','qianyi'],['wenqu','puyigong'],
  ['wenqu','guanlugong'],['wenqu','tianzhaigong'],['wenqu','fudegong'],['wenqu','fumugong'],
  // 天魁 1 + 天钺 1
  ['tiankui','minggong'],['tianyue','minggong']
];

const articles = combos.map(([sk,pk]) => genArticle(sk,pk));
for(const a of articles){
  fs.writeFileSync(path.join(__dirname,'articles',`${a.slug}.html`),buildHTML(a,false).replace(/\r\n/g,'\n'),'utf8');
  fs.writeFileSync(path.join(__dirname,'articles','en',`${a.slug}.html`),buildHTML(a,true).replace(/\r\n/g,'\n'),'utf8');
}
console.log(`Total: ${articles.length} articles (${articles.length*2} HTML files)`);
console.log('Main stars:', articles.filter(a=>a.cat==='主星').length);
console.log('Aux stars:', articles.filter(a=>a.cat==='辅曜').length);
