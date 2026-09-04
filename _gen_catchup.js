const fs=require('fs'),path=require('path');
function jstr(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"');}
const PORDER=['minggong','xiongdigong','fuqigong','zinvgong','caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong','fudegong','fumugong'];
const PALACES={
  minggong:{cn:'命宫',en:'Life Palace',domain:'核心性格、人生基调与外在表现',domainEn:'core personality, life direction, and outward expression',cnQ:['这辈子的性格优势在哪','人生整体顺不顺','我给人的第一印象是什么'],enQ:['where personality strengths lie','whether life flows smoothly','what first impression you give']},
  xiongdigong:{cn:'兄弟宫',en:'Siblings Palace',domain:'手足关系、同辈缘分与资金周转',domainEn:'sibling relationships, peer bonds, and cash turnover',cnQ:['兄弟姐妹能不能帮上忙','跟同辈合不合','资金周转灵不灵'],enQ:['whether siblings can help','how peer relationships are','whether cash flow is flexible']},
  fuqigong:{cn:'夫妻宫',en:'Spouse Palace',domain:'感情婚姻、伴侣特质与亲密关系',domainEn:'love, marriage, partner traits, and intimacy',cnQ:['另一半是什么样的人','感情顺不顺','婚姻最大的功课是什么'],enQ:['what the partner is like','whether relationships go smoothly','the biggest lesson in marriage']},
  zinvgong:{cn:'子女宫',en:'Children Palace',domain:'子女缘分、晚辈关系与创意产出',domainEn:'children, junior relationships, and creative output',cnQ:['孩子缘深不深','跟子女关系怎样','创造力如何'],enQ:['whether children luck is strong','how relationships with children are','how creativity is']},
  caibogong:{cn:'财帛宫',en:'Wealth Palace',domain:'收入方式、求财路径与现金流',domainEn:'income style, earning path, and cash flow',cnQ:['钱从哪里来','能不能存住钱','适合什么赚钱方式'],enQ:['where money comes from','whether it can be retained','what earning method fits']},
  jiegong:{cn:'疾厄宫',en:'Health Palace',domain:'体质弱点、慢性病与意外灾厄',domainEn:'physical weaknesses, chronic conditions, and accidents',cnQ:['哪里最容易出问题','什么习惯最伤身','什么时候要特别注意'],enQ:['what is most vulnerable','which habits harm most','when to be extra careful']},
  qianyi:{cn:'迁移宫',en:'Travel Palace',domain:'外出运势、人际外缘与远方机遇',domainEn:'travel luck, external connections, and distant opportunities',cnQ:['适不适合外出发展','外面有没有贵人','离乡是好是坏'],enQ:['whether leaving home suits you','whether benefactors await outside','whether departure helps or hurts']},
  puyigong:{cn:'仆役宫',en:'Friends Palace',domain:'下属、朋友、合伙人与社交圈',domainEn:'subordinates, friends, partners, and social circle',cnQ:['朋友靠不靠谱','能不能合伙','下属能不能用'],enQ:['whether friends are reliable','whether partnership works','whether subordinates are capable']},
  guanlugong:{cn:'官禄宫',en:'Career Palace',domain:'工作运势、事业格局与职场状态',domainEn:'work fortune, career structure, and job situation',cnQ:['适合什么行业','能不能当主管','事业天花板在哪'],enQ:['what industry fits','whether management suits you','where the career ceiling is']},
  tianzhaigong:{cn:'田宅宫',en:'Property Palace',domain:'房产家业、居住环境与固定资产',domainEn:'real estate, living environment, and fixed assets',cnQ:['有没有房产运','家里环境怎样','能不能守住家底'],enQ:['whether property luck exists','what the home environment is like','whether family assets can be kept']},
  fudegong:{cn:'福德宫',en:'Fortune Palace',domain:'精神状态、福气心态与兴趣享受',domainEn:'mental state, blessings, mindset, and enjoyment',cnQ:['内心安不安','有没有福气','花钱买开心值不值'],enQ:['whether the mind is at peace','whether blessings exist','whether spending on joy is worth it']},
  fumugong:{cn:'父母宫',en:'Parents Palace',domain:'父母缘分、长辈助力与文书学历',domainEn:'parents, elder support, documents, and education',cnQ:['父母能不能靠','跟长辈关系怎样','文书运好不好'],enQ:['whether parents can be relied on','how elder relationships are','whether document luck is good']}
};

// 每颗星：名称、五行、性质、5条特质、十二宫主题（中英，按PORDER）
const STARS={
  huagai:{cn:'华盖',en:'Hua Gai',elem:'阳木',elemEn:'yang wood',nature:'孤高星、艺术星、宗教星',natureEn:'the dignity, art, and spirituality star',
    cnT:['气质孤高、有艺术天赋','喜欢哲学宗教、精神世界丰富','聪明但不合群','容易孤芳自赏','华盖的艺术才华和悟性是正面'],
    enT:['dignified bearing, artistic talent','drawn to philosophy and religion, rich inner world','intelligent but not gregarious','prone to self-admiration','Hua Gai artistry and insight are positive'],
    th:{fuqigong:['伴侣有艺术气质，感情偏精神契合','Artistic Partner; Spiritually Attuned Bond'],zinvgong:['子女有艺术天赋，悟性高','Artistically Gifted Children'],caibogong:['靠艺术才华赚钱，适合文创宗教行业','Earn Through Art; Suited to Culture and Spirituality'],jiegong:['注意精神情志，防思虑过度','Watch Mental Health; Avoid Overthinking'],qianyi:['在外遇艺术或宗教缘，离乡有精神归宿','Art and Spirituality Await Outside'],puyigong:['朋友多艺术修行之人，社交圈清雅','Artistic and Spiritual Friends'],guanlugong:['事业适合艺术学术宗教，偏独立创作','Suited to Art, Academia, and Spirituality'],tianzhaigong:['居家有书香禅意，环境清雅','Refined Home with Scholarly Zen'],fudegong:['精神世界丰富，福气来自独处与修行','Rich Inner World; Blessings from Solitude'],fumugong:['长辈中有信佛信道或搞艺术的人','An Elder Inclined to Art or Faith']}},
  tianxing:{cn:'天刑',en:'Tian Xing',elem:'阳火',elemEn:'yang fire',nature:'刑克星、法律星、医药星',natureEn:'the discipline, law, and medicine star',
    cnT:['原则性强、讲规矩、有正义感','性格刚毅、容易较真','与法律医药有缘','容易有官司纠纷或外伤','天刑的自律和专业能力是正面'],
    enT:['principled, rule-abiding, strong justice sense','resolute, prone to being overly strict','connected to law and medicine','prone to legal disputes or injury','Tian Xing discipline and professionalism are positive'],
    th:{minggong:['原则性强有正义感，天生带刚毅气质','Principled and Resolute; Strong Sense of Justice'],xiongdigong:['兄弟姐妹中有人个性强，同辈易起争执','A Strong-Willed Sibling; Peer Disputes'],fuqigong:['伴侣原则性强，感情里要防硬碰硬','Principled Partner; Avoid Head-On Clashes'],zinvgong:['子女性格倔强，教育要讲规则','Strong-Willed Children; Teach Through Rules'],caibogong:['靠专业技术赚钱，适合法律医药行业','Earn Through Expertise; Suited to Law and Medicine'],jiegong:['注意外伤手术和筋骨，防急病炎症','Watch Injuries, Surgery, and Inflammation'],qianyi:['在外防官非口舌，离乡守规矩','Beware Legal Issues Outside; Follow Rules'],puyigong:['朋友中多耿直之人，防合伙纠纷','Straightforward Friends; Beware Partnership Disputes'],guanlugong:['事业适合法律军警医药，靠专业立身','Suited to Law, Enforcement, and Medicine'],tianzhaigong:['家里规矩多，房产文书要看清','Strict Household; Scrutinize Property Documents'],fudegong:['精神自律严，容易自我要求过高','Mentally Disciplined; Avoid Self-Criticism'],fumugong:['长辈管教严，父母中有人与法医有缘','Strict Elders; One Connected to Law or Medicine']}},
  tianshang:{cn:'天伤',en:'Tian Shang',elem:'阳水',elemEn:'yang water',nature:'耗损星、虚浮星',natureEn:'the depletion and fragility star',
    cnT:['容易损耗、根基偏虚','性格敏感、心思细腻','付出多回报少','容易遇到让自己受伤的事','天伤的同理心和细致是正面'],
    enT:['prone to depletion, fragile foundation','sensitive, attentive mind','gives more than receives','prone to hurtful experiences','Tian Shang empathy and attentiveness are positive'],
    th:{minggong:['心思细腻敏感，天生容易操心损耗','Sensitive and Attentive; Prone to Worry'],xiongdigong:['兄弟姐妹缘分有损耗，同辈助力有限','Depleted Sibling Bond; Limited Peer Help'],fuqigong:['感情里容易受伤，伴侣关系要多自爱','Easily Hurt in Love; Practice Self-Care'],zinvgong:['为子女操心多，亲子缘分有损耗','Fret Over Children; Some Depletion in Bond'],caibogong:['钱财容易耗散，赚钱要防漏财','Money Drains Easily; Prevent Leakage'],jiegong:['体质偏虚，注意慢性劳损和气血','Fragile Constitution; Watch Chronic Fatigue'],qianyi:['在外容易奔波劳累，离乡防损耗','Tiring Travels; Prevent Depletion Away'],puyigong:['为朋友付出多，防被拖累','Gives Much to Friends; Avoid Being Dragged Down'],guanlugong:['事业上多劳少得，要防过度消耗','Works Hard for Little; Avoid Burnout'],tianzhaigong:['家产守成不易，居家防隐患','Hard to Keep Assets; Prevent Hidden Risks at Home'],fudegong:['精神容易内耗，福气要靠养','Mental Drain; Blessings Must Be Cultivated'],fumugong:['父母缘分有损耗，长辈助力有限','Thin Parent Support; Limited Elder Help']}},
  tianshi:{cn:'天使',en:'Tian Shi',elem:'阳水',elemEn:'yang water',nature:'灾厄星、破败星',natureEn:'the adversity and decline star',
    cnT:['容易遇到突发破败','性格谨慎、有危机意识','逢凶处需靠贵人化解','财与事容易大起大落','天使的警觉和抗压是正面'],
    enT:['prone to sudden setbacks','cautious, crisis-aware','needs benefactors to resolve adversity','fortune and matters swing up and down','Tian Shi alertness and resilience are positive'],
    th:{minggong:['天生有危机意识，人生防大起大落','Crisis-Aware; Guard Against Swings'],xiongdigong:['兄弟姐妹中有人起伏大，同辈防拖累','A Sibling with Swings; Avoid Being Dragged'],fuqigong:['感情防突发变故，伴侣关系要稳','Beware Sudden Relationship Changes'],zinvgong:['子女缘分有波折，教育要防意外','Bumpy Children Luck; Prevent Accidents'],caibogong:['钱财防大破财，投资要留后路','Beware Big Losses; Keep a Safety Margin'],jiegong:['注意突发灾厄和意外，定期体检','Watch Sudden Accidents; Get Regular Checkups'],qianyi:['在外防意外波折，离乡行事要稳','Beware Setbacks Outside; Act Prudently Away'],puyigong:['朋友防突然翻脸，合伙要留凭证','Beware Sudden Rifts; Keep Partnership Records'],guanlugong:['事业防突发危机，要有备选方案','Beware Sudden Career Crises; Have Plan B'],tianzhaigong:['家产防破败，房产交易要谨慎','Beware Asset Decline; Cautious Property Deals'],fudegong:['精神防突发打击，心态要练稳','Beware Mental Blows; Build Steady Mindset'],fumugong:['长辈缘分有波折，父母健康多关注','Bumpy Elder Bond; Mind Parents Health']}},
  tianku:{cn:'天哭',en:'Tian Ku',elem:'阳火',elemEn:'yang fire',nature:'悲虚星、忧愁星',natureEn:'the sorrow and melancholy star',
    cnT:['容易悲观忧愁、情绪低落','性格内向、感受力强','遇事容易往坏处想','脸上常带忧色、人缘受影响','天哭的共情和深度是正面'],
    enT:['prone to pessimism and melancholy','introverted, deeply perceptive','tends to expect the worst','often looks gloomy, affecting popularity','Tian Ku empathy and depth are positive'],
    th:{minggong:['天生多愁善感，情绪容易低落','Melancholy by Nature; Prone to Low Mood'],xiongdigong:['兄弟姐妹中有人悲观，同辈氛围偏沉','A Pessimistic Sibling; Heavy Peer Mood'],fuqigong:['感情里容易忧愁，伴侣要多开导','Prone to Worry in Love; Partner Should Reassure'],zinvgong:['子女偏敏感爱哭，教育要多鼓励','Sensitive Tearful Children; Encourage More'],caibogong:['赚钱容易焦虑，财务心态要放宽','Anxious About Money; Relax Financial Mindset'],jiegong:['注意情绪致病，防忧思伤肺脾','Watch Emotion-Driven Illness; Worry Harms Body'],qianyi:['在外容易想家低落，离乡要调节情绪','Homesick Outside; Manage Emotions Away'],puyigong:['朋友中多感性之人，社交圈偏安静','Sensitive Friends; Quiet Social Circle'],guanlugong:['事业上容易焦虑，抗压要练心态','Career Anxiety; Build Mental Resilience'],tianzhaigong:['居家氛围偏静，家里要多添喜气','Quiet Home; Add More Cheer'],fudegong:['精神容易悲观，福气来自积极心态','Prone to Pessimism; Blessings from Positivity'],fumugong:['父母中有人多忧，长辈情绪多关心','A Worry-Prone Parent; Mind Elder Mood']}},
  tianxu:{cn:'天虚',en:'Tian Xu',elem:'阴火',elemEn:'yin fire',nature:'空虚星、耗散星',natureEn:'the emptiness and dissipation star',
    cnT:['容易空虚不实、缺乏安全感','性格善变、想法多落实少','表面风光内里虚','容易破财或承诺落空','天虚的灵感和想象是正面'],
    enT:['prone to emptiness and insecurity','changeable, many ideas but little follow-through','looks glamorous but hollow inside','prone to loss or broken promises','Tian Xu inspiration and imagination are positive'],
    th:{minggong:['想法多落实少，天生带空虚感','Many Ideas, Little Action; Inner Emptiness'],xiongdigong:['兄弟姐妹助力偏虚，同辈承诺难兑现','Hollow Sibling Help; Peer Promises Slip'],fuqigong:['感情防虚情假意，伴侣要看实际行动','Beware Empty Affection; Value Real Actions'],zinvgong:['子女缘分偏虚，教育要重落实','Thin Children Luck; Focus on Follow-Through'],caibogong:['钱财防虚账空账，理财要求实','Beware Empty Accounts; Seek Solid Finances'],jiegong:['注意体虚和隐性疾病，别忽视小毛病','Watch Weakness and Hidden Illness'],qianyi:['在外名声防虚浮，离乡要凭真本事','Beware Hollow Reputation; Rely on Real Skill'],puyigong:['朋友防口头交情，社交要辨真心','Beware Lip-Service Friends; Seek Sincerity'],guanlugong:['事业防空头承诺，职场要留实据','Beware Empty Promises; Keep Solid Proof'],tianzhaigong:['家产防名不副实，买房要实地看','Beware Overstated Assets; Inspect Property in Person'],fudegong:['精神容易空虚，福气要靠充实内心','Mental Emptiness; Blessings from Inner Fullness'],fumugong:['长辈助力偏虚，父母承诺多落空','Hollow Elder Support; Promises May Slip']}},
  longchi:{cn:'龙池',en:'Long Chi',elem:'阳水',elemEn:'yang water',nature:'科甲星、才艺星、贵气星',natureEn:'the academic, talent, and nobility star',
    cnT:['聪明有才华、带贵气','学习能力强、有科甲运','气质文雅、口才不错','容易眼高手低','龙池的才华和学习力是正面'],
    enT:['bright, talented, carries nobility','strong learner, good academic luck','refined bearing, articulate','prone to overestimating ability','Long Chi talent and learning ability are positive'],
    th:{minggong:['聪明有才带贵气，天生学习力强','Bright and Talented; Strong Learner by Nature'],xiongdigong:['兄弟姐妹中有人会读书，同辈有才艺','A Scholarly Sibling; Talented Peers'],fuqigong:['伴侣有才华气质好，感情偏文雅','Talented Refined Partner; Cultivated Bond'],zinvgong:['子女聪明会读书，科甲运好','Bright Studious Children; Strong Academic Luck'],caibogong:['靠才华技术赚钱，适合专业知识行业','Earn Through Talent; Suited to Knowledge Work'],jiegong:['注意肾脏泌尿系统，别过度用脑','Watch Kidneys and Urinary System; Rest the Mind'],qianyi:['在外靠才学得机遇，离乡有贵气','Opportunities Through Talent Away; Noble Air'],puyigong:['朋友多才学之士，社交圈有层次','Talented Learned Friends; Refined Circle'],guanlugong:['事业靠专业才华，适合学术文教行业','Career Through Expertise; Suited to Academia'],tianzhaigong:['居家有书卷气，环境雅致','Bookish Refined Home'],fudegong:['精神追求高雅，福气来自才学','Refined Tastes; Blessings from Learning'],fumugong:['父母重视教育，长辈中有读书人','Education-Minded Parents; A Scholarly Elder']}},
  fengge:{cn:'凤阁',en:'Feng Ge',elem:'阳土',elemEn:'yang earth',nature:'科甲星、审美星、仪表星',natureEn:'the academic, aesthetics, and appearance star',
    cnT:['注重仪表、审美能力强','气质优雅、讲究品味','有艺术和设计天赋','容易过于在意外表','凤阁的审美和风度是正面'],
    enT:['values appearance, strong aesthetic sense','elegant bearing, refined taste','gifted in art and design','prone to over-focusing on looks','Feng Ge aesthetics and grace are positive'],
    th:{minggong:['气质优雅重仪表，天生审美能力强','Elegant and Polished; Strong Aesthetic Sense'],xiongdigong:['兄弟姐妹中有人重品味，同辈多爱美','A Tasteful Sibling; Appearance-Conscious Peers'],fuqigong:['伴侣仪表好有品味，感情重美感','Stylish Tasteful Partner; Beauty-Minded Bond'],zinvgong:['子女爱美有艺术感，审美培养有优势','Artistic Beauty-Minded Children'],caibogong:['靠审美设计赚钱，适合美业艺术行业','Earn Through Aesthetics; Suited to Beauty and Art'],jiegong:['注意脾胃和皮肤，别为形象过度节食','Watch Digestion and Skin; Avoid Extreme Dieting'],qianyi:['在外靠形象风度加分，离乡发展体面','Grace Helps Outside; Presentable Development Away'],puyigong:['朋友多有品味之人，社交圈讲究格调','Tasteful Friends; Stylish Social Circle'],guanlugong:['事业适合设计美学品牌，靠形象立足','Suited to Design, Aesthetics, and Branding'],tianzhaigong:['居家讲究布置美感，环境有格调','Beautifully Styled Home with Taste'],fudegong:['精神追求美与优雅，福气来自品味','Pursues Beauty; Blessings from Refined Taste'],fumugong:['长辈中有人重仪表，家庭讲究体面','An Appearance-Minded Elder; Dignified Family']}},
  santai:{cn:'三台',en:'San Tai',elem:'阳土',elemEn:'yang earth',nature:'贵显星、辅佐星、地位星',natureEn:'the prestige, support, and status star',
    cnT:['稳重可靠、有辅佐之才','容易得到地位和尊重','做事有条理、能扛事','晋升要靠资历积累','三台的稳重和组织力是正面'],
    enT:['steady and reliable, supporting talent','prone to gaining status and respect','organized, can shoulder responsibility','promotion comes through seniority','San Tai steadiness and organization are positive'],
    th:{minggong:['稳重可靠能扛事，天生带辅佐之才','Steady and Reliable; Natural Supporting Talent'],xiongdigong:['兄弟姐妹中有人稳重，同辈是可靠助力','A Steady Sibling; Dependable Peer Support'],fuqigong:['伴侣稳重可靠，感情里有安全感','Steady Reliable Partner; Sense of Security'],zinvgong:['子女懂事稳重，成长能稳步上升','Steady Sensible Children; Steady Progress'],caibogong:['财运稳步积累，靠职位和资历增收','Wealth Accumulates Steadily Through Seniority'],jiegong:['注意脾胃和骨骼，防积劳成疾','Watch Digestion and Bones; Prevent Cumulative Strain'],qianyi:['在外靠稳重得信任，离乡逐步立足','Trust Through Steadiness; Establish Step by Step Away'],puyigong:['朋友多可靠实干之人，合伙能互补','Reliable Practical Friends; Complementary Partnership'],guanlugong:['事业适合管理辅佐岗，晋升靠资历','Suited to Management; Promotion Through Seniority'],tianzhaigong:['家产稳步增值，置业能保值','Assets Appreciate Steadily; Property Holds Value'],fudegong:['心态稳当踏实，福气来自循序渐进','Grounded Mindset; Blessings from Steady Progress'],fumugong:['长辈稳重可靠，父母是坚实后盾','Steady Dependable Parents; Solid Elder Backing']}},
  bazuo:{cn:'八座',en:'Ba Zuo',elem:'阴土',elemEn:'yin earth',nature:'贵助星、安稳星、承载星',natureEn:'the noble-support, stability, and bearing star',
    cnT:['安稳厚重、有承载力','性格温和、能容人','容易有职位和座次','过于求稳会错失机会','八座的包容和稳定是正面'],
    enT:['stable and substantial, strong bearing','gentle, tolerant of others','prone to position and standing','over-cautiousness can miss chances','Ba Zuo tolerance and stability are positive'],
    th:{minggong:['安稳厚重能容人，天生带承载之力','Stable and Tolerant; Natural Bearing'],xiongdigong:['兄弟姐妹中有人宽厚，同辈关系稳','A Generous Sibling; Stable Peer Relations'],fuqigong:['伴侣宽厚安稳，感情基础扎实','Generous Stable Partner; Solid Bond'],zinvgong:['子女安稳厚道，成长让人放心','Steady Honest Children; Reassuring Growth'],caibogong:['财运安稳，靠守成和位置得财','Stable Finances; Wealth Through Position'],jiegong:['注意脾胃消化，体质偏厚重','Watch Digestion; Solid Constitution'],qianyi:['在外安稳得助，离乡发展求稳为先','Stable Help Outside; Prioritize Stability Away'],puyigong:['朋友多宽厚之人，社交圈稳定','Generous Friends; Stable Social Circle'],guanlugong:['事业适合稳定体制岗，能坐稳位置','Suited to Stable Institutional Roles'],tianzhaigong:['家产安稳厚实，守业能力强','Stable Substantial Assets; Strong at Keeping Them'],fudegong:['心态宽厚知足，福气来自安稳','Generous Contented Mind; Blessings from Stability'],fumugong:['父母宽厚顾家，长辈助力稳定','Generous Family-Minded Parents; Stable Support']}},
  taifu:{cn:'台辅',en:'Tai Fu',elem:'阳土',elemEn:'yang earth',nature:'辅佐贵星、文书星、提携星',natureEn:'the advisory, document, and patronage star',
    cnT:['有辅佐之力、易获提携','文书运好、承诺易兑现','性格端正、有名声','过于依赖提携会缺主动','台辅的可靠和文书运是正面'],
    enT:['supporting ability, prone to patronage','good document luck, promises kept','upright, gains reputation','over-reliance on patrons reduces initiative','Tai Fu reliability and document luck are positive'],
    th:{minggong:['端正可靠易获提携，天生有辅佐之力','Upright and Patronized; Natural Advisory Talent'],xiongdigong:['兄弟姐妹中有人获贵人提携，同辈有助力','A Patronized Sibling; Helpful Peers'],fuqigong:['伴侣可靠有担当，感情里有贵人意味','Reliable Partner; A Benefactor in the Bond'],zinvgong:['子女易得师长提携，成长有贵人','Children Get Mentor Support; Benefactors in Growth'],caibogong:['靠文书合约得财，收入有保障','Wealth Through Documents; Secure Income'],jiegong:['注意慢性调理，文书病历要留好','Manage Chronic Care; Keep Medical Records'],qianyi:['在外易得贵人提携，离乡有引荐','Patronage Outside; Referrals Away from Home'],puyigong:['朋友中多提携你的人，人脉有质量','Patrons Among Friends; Quality Connections'],guanlugong:['事业易得上级赏识，文书岗位有利','Recognized by Superiors; Document Roles Favor You'],tianzhaigong:['房产文书运顺，契约签订有保障','Smooth Property Documents; Secure Contracts'],fudegong:['精神端正踏实，福气来自好名声','Upright Mind; Blessings from Good Reputation'],fumugong:['父母是贵人，长辈提携助力大','Parents as Benefactors; Strong Elder Patronage']}},
  fenggao:{cn:'封诰',en:'Feng Gao',elem:'阴土',elemEn:'yin earth',nature:'封赏星、名誉星、继承星',natureEn:'the recognition, honor, and inheritance star',
    cnT:['容易获得封赏名誉','有继承祖荫的缘分','性格重承诺、讲体面','容易为名所累','封诰的荣誉感和守信是正面'],
    enT:['prone to recognition and honors','connected to inheritance and ancestral grace','values promises and dignity','prone to being burdened by reputation','Feng Gao sense of honor and trustworthiness are positive'],
    th:{minggong:['重承诺讲体面，天生易得名誉封赏','Values Promises; Prone to Honors by Nature'],xiongdigong:['兄弟姐妹中有人有名声，同辈能沾光','A Reputable Sibling; Peers Share the Glory'],fuqigong:['伴侣重体面有名声，婚姻带荣耀感','Honorable Reputable Partner; Proud Bond'],zinvgong:['子女容易获奖得名，成长有荣誉','Children Win Awards; Honor in Their Growth'],caibogong:['靠名声品牌得财，有继承祖产缘','Earn Through Reputation; Inheritance Potential'],jiegong:['注意遗传体质，家族病史要了解','Watch Hereditary Conditions; Know Family History'],qianyi:['在外易得荣誉认可，离乡能挣名声','Honors Outside; Build a Name Away'],puyigong:['朋友中多有名望之人，社交圈体面','Reputable Friends; Dignified Social Circle'],guanlugong:['事业易得表彰封赏，适合公职机构','Career Recognition; Suited to Public Institutions'],tianzhaigong:['有继承家产缘分，田宅带祖荫','Inheritance Potential; Property Carries Ancestral Grace'],fudegong:['精神重荣誉感，福气来自被认可','Values Honor; Blessings from Recognition'],fumugong:['父母有名望祖荫，长辈能留资源','Reputable Parents with Ancestral Resources']}},
  enguang:{cn:'恩光',en:'En Guang',elem:'阳火',elemEn:'yang fire',nature:'恩惠星、科名星、提携星',natureEn:'the favor, academic-fame, and patronage star',
    cnT:['容易得到恩惠照顾','科名考试运好、易出名','性格热情、懂得感恩','容易因人情背上负担','恩光的感恩和贵人运是正面'],
    enT:['prone to favors and care','good exam luck, prone to fame','warm-hearted, grateful','prone to obligation burdens','En Guang gratitude and benefactor luck are positive'],
    th:{minggong:['热情懂感恩，天生易得恩惠照顾','Warm and Grateful; Prone to Favors by Nature'],xiongdigong:['兄弟姐妹中有人受关照，同辈多提携','A Favored Sibling; Patronizing Peers'],fuqigong:['伴侣对你有恩情，感情里多照顾','A Caring Partner; Favors Within the Bond'],zinvgong:['子女易得老师关照，考试运好','Children Get Teacher Care; Good Exam Luck'],caibogong:['靠贵人恩惠得财，收入带照顾性质','Wealth Through Favors; Supported Income'],jiegong:['生病易遇好医生，注意别讳疾忌医','Good Doctors in Illness; Do Not Avoid Treatment'],qianyi:['在外逢贵人施恩，离乡受照顾','Benefactors Favor You Outside; Cared for Away'],puyigong:['朋友多热心相助，社交圈有温情','Warm Helpful Friends; Caring Circle'],guanlugong:['事业易得领导关照，考试升迁运好','Leader Care at Work; Good Exam and Promotion Luck'],tianzhaigong:['家里常有喜事光临，置业有人帮','Happy Events at Home; Help with Property'],fudegong:['精神常怀感恩，福气来自被善待','Grateful Heart; Blessings from Kindness'],fumugong:['父母疼爱照顾多，长辈恩惠深厚','Loving Caring Parents; Deep Elder Kindness']}},
  tiangui:{cn:'天贵',en:'Tian Gui',elem:'阳火',elemEn:'yang fire',nature:'贵气星、名望星、守信星',natureEn:'the nobility, prestige, and trustworthiness star',
    cnT:['天生带贵气、受人尊重','守信用、重承诺','有名望和影响力','容易端着、放不下面子','天贵的诚信和威望是正面'],
    enT:['natural nobility, earns respect','trustworthy, honors commitments','has prestige and influence','prone to standing on dignity','Tian Gui integrity and prestige are positive'],
    th:{minggong:['守信重诺带贵气，天生受人尊重','Trustworthy and Noble; Respected by Nature'],xiongdigong:['兄弟姐妹中有人有威望，同辈信服','A Prestigious Sibling; Peers Defer to Them'],fuqigong:['伴侣有贵气讲信用，感情重承诺','Noble Trustworthy Partner; Commitment-Minded'],zinvgong:['子女有贵气守信用，从小受人看重','Noble Trustworthy Children; Valued Early On'],caibogong:['靠信誉威望得财，适合做长期口碑','Earn Through Credibility; Build Long-Term Reputation'],jiegong:['注意心脏和血压，防好面子硬撑','Watch Heart and Blood Pressure; Avoid Straining for Face'],qianyi:['在外受人尊重，离乡靠信誉立足','Respected Outside; Establish Through Credibility'],puyigong:['朋友中多有威望之人，社交讲信用','Prestigious Friends; Trust-Based Circle'],guanlugong:['事业靠信誉立身，适合管理和公职','Career Through Credibility; Suited to Management'],tianzhaigong:['家产带贵气，居住环境有档次','Prestigious Assets; Upscale Living Environment'],fudegong:['精神自重自爱，福气来自德行声望','Self-Respecting Mind; Blessings from Virtue and Prestige'],fumugong:['父母有威望受人尊重，长辈家风正','Prestigious Respected Parents; Upright Family Tradition']}}
};

// 4个批次：日期 + combos
const BATCHES=[
  {date:'2026-08-30T10:00:00+08:00',label:'2026-08-30 10:00',rfc:'Sun, 30 Aug 2026 10:00:00 +0800',
   combos:[['huagai',['fuqigong','zinvgong','caibogong','jiegong','qianyi','puyigong','guanlugong','tianzhaigong','fudegong','fumugong']],
           ['tianxing',PORDER.slice()],['tianshang',PORDER.slice()],['tianshi',PORDER.slice(0,6)]]},
  {date:'2026-08-31T10:00:00+08:00',label:'2026-08-31 10:00',rfc:'Mon, 31 Aug 2026 10:00:00 +0800',
   combos:[['tianshi',PORDER.slice(6)],['tianku',PORDER.slice()],['tianxu',PORDER.slice()],['longchi',PORDER.slice(0,10)]]},
  {date:'2026-09-01T10:00:00+08:00',label:'2026-09-01 10:00',rfc:'Tue, 01 Sep 2026 10:00:00 +0800',
   combos:[['longchi',PORDER.slice(10)],['fengge',PORDER.slice()],['santai',PORDER.slice()],['bazuo',PORDER.slice()],['taifu',PORDER.slice(0,2)]]},
  {date:'2026-09-02T10:00:00+08:00',label:'2026-09-02 10:00',rfc:'Wed, 02 Sep 2026 10:00:00 +0800',
   combos:[['taifu',PORDER.slice(2)],['fenggao',PORDER.slice()],['enguang',PORDER.slice()],['tiangui',PORDER.slice(0,6)]]}
];

function cnSections(s,p){return[
 {h:`${s.cn}在${p.cn}的核心表现`,ps:[
  `${s.cnT[0]}——在${p.domain}这件事上，这个特质最直接。`,
  `${s.cnT[1]}——这决定了${s.cn}在${p.cn}的表现方式。`,
  `${s.cnT[2]}——放到${p.cn}的场景里，表现为具体的行为模式。`,
  `${s.cnT[3]}——这是把双刃剑，用好了是优势，用不好是麻烦。`,
  `${s.cnT[4]}——这一面往往被忽略，但在${p.domain}中很关键。`]},
 {h:'有吉星和有煞星的区别',ps:[
  `加左辅右弼——${p.domain}中有人帮衬，${s.cn}的能量能落地。`,
  `加天魁天钺——关键时刻有贵人提携，${p.cn}的事容易逢凶化吉。`,
  `加文昌文曲——${s.cn}配上谋略和文采，表现更圆融。`,
  `加擎羊陀罗——${p.domain}的过程更费劲，容易拖延或起冲突。`,
  `加火星铃星——突发状况多，${p.cn}的事容易被打断或急转直下。`]},
 {h:'现实中的对应和建议',ps:[
  `如果你正在经历${p.cn}相关的事，先看${s.cn}同宫的主星是庙旺还是落陷。`,
  `庙旺时，${s.cnT[0]}是你的核心竞争力，可以大胆往这个方向走。`,
  `落陷时，同样的特质会打折扣，需要用后天选择来补——选对环境比硬扛更重要。`,
  `化禄化权在${p.cn}，${p.domain}有实质突破；化科是名声和认可；化忌则是卡点和执念。`,
  `记住：${s.cn}在${p.cn}不是宿命，而是一张说明书——告诉你${p.domain}上的出厂设置。`]},
 {h:'排盘使用顺序',ps:[`看到${s.cn}在${p.cn}，按这个顺序读：`],ol:[
  `先看同宫主星——主星决定基本盘。`,
  `看${s.cn}与主星的配合——吉星加分，煞星减分。`,
  `看三方四正——${p.cn}的三方决定了全貌。`,
  `看四化——化禄化权化科化忌分别触发什么。`,
  `看大限流年——什么时候${p.cn}的事会被激活。`,
  `问自己：${p.cnQ[0]}？${p.cnQ[1]}？${p.cnQ[2]}？`]}
];}
function enSections(s,p){return[
 {h:`Core Expression of ${s.en} in the ${p.en}`,ps:[
  `${s.enT[0]} — this is the most direct expression in matters of ${p.domainEn}.`,
  `${s.enT[1]} — this determines how ${s.en} handles the ${p.en}.`,
  `${s.enT[2]} — in the ${p.en} context, this becomes a concrete behavior pattern.`,
  `${s.enT[3]} — a double-edged trait: strength when used well, trouble when not.`,
  `${s.enT[4]} — often overlooked, but key in matters of ${p.domainEn}.`]},
 {h:'With Auspicious Stars vs Malefics',ps:[
  `With Zuo Fu/You Bi — help arrives in ${p.domainEn}; ${s.en}'s energy can land.`,
  `With Tian Kui/Tian Yue — benefactors appear at key moments; ${p.en} matters resolve.`,
  `With Wen Chang/Wen Qu — ${s.en} gains strategy and expression.`,
  `With Qing Yang/Tuo Luo — the process of ${p.domainEn} is harder, with delays or conflict.`,
  `With Huo Xing/Ling Xing — sudden disruptions; ${p.en} matters get interrupted.`]},
 {h:'Practical Correspondence and Advice',ps:[
  `If dealing with ${p.en} matters, first check whether the ruling star is bright or fallen.`,
  `When bright, ${s.enT[0]} is your core advantage; move boldly.`,
  `When fallen, compensate through conscious choices — the right environment matters more than endurance.`,
  `Lu or Quan in the ${p.en} brings breakthroughs in ${p.domainEn}; Ke brings reputation; Ji marks a blockage.`,
  `Remember: ${s.en} in the ${p.en} is not fate but a manual — your factory settings for ${p.domainEn}.`]},
 {h:'Reading Order',ps:[`For ${s.en} in the ${p.en}:`],ol:[
  `Check the ruling star — it sets the baseline.`,
  `Check how ${s.en} combines with it — auspicious adds; malefic subtracts.`,
  `Check triple direction — the ${p.en}'s aspects reveal the full picture.`,
  `Check transformations — what Lu, Quan, Ke, Ji each activate.`,
  `Check major and annual cycles — when ${p.en} matters get triggered.`,
  `Ask yourself: ${p.enQ[0]}? ${p.enQ[1]}? ${p.enQ[2]}?`]}
];}

function sidebar(s,p,isEn){return[
 {href:'ziwei-helper-malice-stars.html',text:isEn?'Assistant & Malefic Stars':'辅曜煞曜'},
 {href:`ziwei-star-${curStarKey}.html`,text:isEn?`${s.en} Star`:`${s.cn}星详解`},
 {href:`ziwei-${curP}.html`,text:isEn?p.en:p.cn},
 {href:'ziwei-sanfang-sizheng.html',text:isEn?'Triple Direction':'先看三方四正'},
 {href:isEn?'../../pages/mingbook-onepage.html':'../pages/mingbook-onepage.html',text:isEn?'Quick Chart':'快速排盘'}
];}
let curStarKey='',curP='';

function buildHTML(s,p,isEn,batch,cnTitle,enTitle){
 const sections=isEn?enSections(s,p):cnSections(s,p);
 const title=isEn?enTitle:cnTitle;
 const catName=isEn?'Assistant & Malefic Stars':'辅煞曜';
 const slug=`ziwei-${curStarKey}-zai-${curP}`;
 const desc=isEn?`${s.en} in the ${p.en} affects ${p.domainEn}. As ${s.natureEn}, it brings distinct patterns and cautions.`
               :`${s.cn}在${p.cn}，${p.domain}。${s.cn}是${s.nature}，落在${p.cn}有它独特的表现和需要注意的地方。`;
 const lead=isEn?`${s.en} is ${s.natureEn}. In the ${p.en}, its energy shows up in matters of ${p.domainEn}. ${s.en} keywords are ${s.enT.slice(0,3).join(', ')}, producing concrete patterns in the ${p.en} context.`
               :`${s.cn}是${s.nature}。落在${p.cn}，它的能量会在${p.domain}这件事上表现出来。${s.cn}的关键词是${s.cnT.slice(0,3).join('、')}，这些特质放到${p.cn}的场景里，会产生具体的现实对应。`;
 const intro2=isEn?`The ${p.en} covers ${p.domainEn}. ${s.en} is ${s.elemEn}, with energy of ${s.enT[0]}. Reading it requires the triple-direction view — with auspicious stars help lands; with malefics twists increase. The positive side: ${s.enT[4]}.`
                :`${p.cn}看的是${p.domain}。${s.cn}属${s.elem}，能量特质是${s.cnT[0]}。读${s.cn}在${p.cn}不能只看单宫，必须回到三方四正——有吉星会照则助力落地，煞星冲照则波折增多。${s.cn}的正面意义：${s.cnT[4]}。`;
 let sh='';for(const sec of sections){sh+=`\n        <h2>${sec.h}</h2>\n`;for(const x of sec.ps)sh+=`        <p>${x}</p>\n`;if(sec.ol){sh+='        <ol>\n';for(const x of sec.ol)sh+=`          <li>${x}</li>\n`;sh+='        </ol>\n';}}
 let sb='';for(const l of sidebar(s,p,isEn))sb+=`        <a class="card-link" href="${l.href}">${l.text}</a>\n`;
 if(isEn){return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(title)} | Zi Wei Dou Shu</title>
  <meta name="description" content="${jstr(desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/en/${slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${slug}.html">
  <meta property="og:title" content="${jstr(title)}">
  <meta property="og:description" content="${jstr(desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/en/${slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${batch.date}","dateModified":"${batch.date}","inLanguage":"en","articleSection":"Zi Wei Dou Shu","about":["Zi Wei Dou Shu","${catName}","${jstr(title)}"],"author":{"@type":"Organization","name":"YuetianAI"},"publisher":{"@type":"Organization","name":"YuetianAI"},"mainEntityOfPage":"https://yuetianai.com/articles/en/${slug}.html"}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a><nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${slug}.html">Chinese</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${catName}</span></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${batch.date}">${batch.label}</time></span></p>
    </div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sh}
      </article>
      <aside class="side-panel detail-rail" aria-label="Related links"><h2>Read Next</h2>
${sb}      </aside>
    </div>
    <div class="container article-bottom-link"><span>Read this, then compare it against your own chart for clearer insight.</span><a href="../../pages/mingbook-onepage.html">Quick Chart →</a></div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">Yue ICP 2026055337-1</a>　<span>© 2026 YuetianAI. All Rights Reserved. Powered By Yuetian Studio</span>　</div></footer>
</body></html>`;}
 return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(title)} | 学习紫微</title>
  <meta name="description" content="${jstr(desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/${slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${slug}.html">
  <meta property="og:title" content="${jstr(title)}">
  <meta property="og:description" content="${jstr(desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/${slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${jstr(title)}","description":"${jstr(desc)}","image":"https://yuetianai.com/images/home2/triad-tian-bg.webp","datePublished":"${batch.date}","dateModified":"${batch.date}","inLanguage":"zh-CN","articleSection":"${catName}","about":["紫微斗数","${catName}","${jstr(title)}"],"author":{"@type":"Organization","name":"阅天AI"},"publisher":{"@type":"Organization","name":"阅天AI"},"mainEntityOfPage":"https://yuetianai.com/articles/${slug}.html"}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"阅天AI","item":"https://yuetianai.com/"},{"@type":"ListItem","position":2,"name":"学习紫微","item":"https://yuetianai.com/articles/"},{"@type":"ListItem","position":3,"name":"${catName}","item":"https://yuetianai.com/articles/ziwei-helper-malice-stars.html"},{"@type":"ListItem","position":4,"name":"${jstr(title)}","item":"https://yuetianai.com/articles/${slug}.html"}]}
  </script>
</head>
<body>
  <header class="site-header"><div class="site-nav"><a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a><nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${slug}.html">English</a></nav></div></header>
  <main class="article-shell article-detail">
    <section class="detail-hero"><div class="container detail-hero-grid"><div>
      <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="ziwei-helper-malice-stars.html">${catName}</a></nav>
      <h1>${title}</h1><p class="detail-subtitle">${desc}</p>
      <p class="article-meta"><span>${catName}</span><span><time datetime="${batch.date}">${batch.label}</time></span></p>
    </div><div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div></div></section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sh}
      </article>
      <aside class="side-panel detail-rail" aria-label="本文导航"><h2>继续阅读</h2>
${sb}      </aside>
    </div>
    <div class="container article-bottom-link"><span>读完这篇，回到自己的命盘上对照一遍，会比只看概念更清楚。</span><a href="../pages/mingbook-onepage.html">快速排盘 →</a></div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 阅天AI Copyright, All Rights Reserved. Powered By 阅天工作室</span>　</div></footer>
</body></html>`;
}

const manifest=[];
for(const batch of BATCHES){
 let n=0;
 for(const [sk,palaces] of batch.combos){
  const s=STARS[sk];
  for(const pk of palaces){
   const p=PALACES[pk];curStarKey=sk;curP=pk;
   const theme=s.th[pk];
   const cnTitle=`${s.cn}在${p.cn}：${theme[0]}`;
   const enTitle=`${s.en} in ${p.en}: ${theme[1]}`;
   const slug=`ziwei-${sk}-zai-${pk}`;
   fs.writeFileSync(path.join(__dirname,'articles',`${slug}.html`),buildHTML(s,p,false,batch,cnTitle,enTitle).replace(/\r\n/g,'\n'),'utf8');
   fs.writeFileSync(path.join(__dirname,'articles','en',`${slug}.html`),buildHTML(s,p,true,batch,cnTitle,enTitle).replace(/\r\n/g,'\n'),'utf8');
   manifest.push({slug,cnTitle,enTitle,date:batch.date,label:batch.label,rfc:batch.rfc,enDesc:`${s.en} in ${p.en}. ${theme[1]}`});
   n++;
  }
 }
 console.log(`${batch.label}: ${n} articles`);
}
fs.writeFileSync(path.join(__dirname,'_manifest_0902.json'),JSON.stringify(manifest,null,1),'utf8');
console.log(`TOTAL: ${manifest.length} articles, ${manifest.length*2} HTML files`);
