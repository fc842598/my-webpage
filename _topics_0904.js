// 2026-09-04 调研驱动选题库（40篇）。来源主题与观点见 docs/ziwei-research-2026-09-04-source.md
// 正文为原创改写，不出现来源痕迹。
const eng=require('./_engine_topic.js');
const DATE='2026-09-04';
const batch={date:DATE,label:'2026-09-04',rfc:DATE+'T10:00:00+08:00'};

// 自动生成「排盘使用顺序」
function ord(focus,focusEn){
 return {cn:[
  `先排好本命盘，定位与${focus}相关的宫位和主星，不急着下判断`,
  '把这些宫位的三方四正一起摊开，吉星、煞星、辅星分别数清楚',
  '看生年四化落在哪几宫，先定这张盘的先天底色',
  `看十年大限的四化，确认${focus}这条线在当前阶段有没有被引动`,
  '再看流年四化与流年落宫，定今年具体的触发点和节奏',
  '把先天、大限、流年叠起来下结论，最后才决定怎么行动，而不是先贴吉凶标签'
 ],en:[
  `Cast the natal chart first and locate the palaces and major stars tied to ${focusEn} before judging anything`,
  'Open the triple-direction of those palaces and count the auspicious, malefic and assistant stars separately',
  'Check where the natal Four Transformations land to set the chart\'s baseline tone',
  `Read the decade-limit transformations to see whether the ${focusEn} line is activated in this stage`,
  'Then read the annual transformations and the year\'s palace to pin down this year\'s trigger and timing',
  'Layer natal, decade and year before concluding, then decide how to act rather than labeling good or bad'
 ]};
}
let _id=0;
function T(o){
 const o1=ord(o.focus,o.focusEn);
 return {slug:o.slug,cat:o.cat,cnTitle:o.cnT,enTitle:o.enT,
  cn:{desc:o.cnD,lead:o.cnL,ask:o.cnA,logic:o.cnLog,steps:o.cnStep,mistakes:o.cnMis,close:o.cnClose,order:o1.cn},
  en:{desc:o.enD,lead:o.enL,ask:o.enA,logic:o.enLog,steps:o.enStep,mistakes:o.enMis,close:o.enClose,order:o1.en}};
}

const RAW=[
// ============ 入门基础 5 ============
{cat:'rumen',slug:'ziwei-shiergong-zenme-ji-ruhe-kuaisu-zhanglei',focus:'十二宫',focusEn:'the twelve palaces',
 cnT:'紫微斗数十二宫怎么记最快：把十二宫想成人生的十二个剧场',enT:'How to Memorize the Twelve Palaces in Zi Wei Dou Shu: Twelve Stages of Life',
 cnD:'十二宫不是十二张孤立标签，而是同一件事在不同人生面向上的分工，记住宫位之间的对宫关系，比死背顺序更重要。',
 enD:'The twelve palaces are not isolated labels. They are twelve facets of one life, and learning their opposite-palace pairs beats rote memorization.',
 cnL:'记十二宫最快的方法，不是背口诀，而是把它当成一个人一辈子要处理的十二件事，再用六组对宫串起来。',
 enL:'The fastest way to learn the twelve palaces is to treat them as the twelve things a person deals with in life, then link them through six opposite pairs.',
 cnA:'新手记十二宫，常常从命宫开始顺着背，背到福德、父母就乱。真正的问题不是记性差，而是把宫位当成了互不相干的名词。',
 enA:'Beginners usually memorize the palaces in order starting from the Life Palace and get lost near Karma and Parents. The real issue is treating them as unrelated terms.',
 cnLog:['命、兄、夫、子、财、疾、迁、友、官、田、福、父，本质是一个人从自我出发，向外展开的关系圈与事务圈。','六组对宫互为表里：命宫对迁移是自我与外界，财帛对福德是赚钱与花钱的感受，官禄对夫妻是事业与亲密关系互相占用时间。','对宫像镜子，本宫写正面，对宫补反面，单看一宫永远只读到一半。','十二宫不是十二个命运，而是同一件事要在这十二个角度上同时成立。'],
 enLog:['Life, Siblings, Spouse, Children, Wealth, Health, Travel, Friends, Career, Property, Karma and Parents expand outward from the self into relationships and affairs.','Six opposite pairs work as two sides: Self vs. the outer world, earning vs. the feeling of spending, career vs. the time a relationship takes.','The opposite palace is a mirror: the home palace shows the front, its opposite shows the back, so one palace alone is always half the story.','The twelve palaces are not twelve fates but twelve angles on which a single matter must hold at once.'],
 cnStep:['先按「自我—关系—事务」把十二宫分三堆，降低记忆量','再记六组对宫，用「我和外界、钱和感受、事业和家庭」这种对照去记','每记一宫就问一句：它管的事在现实里对应哪个场景','用自己的盘逐宫点一遍，比抄十遍口诀都牢','最后记四化和星曜怎么落到这些宫位上，宫位只是舞台，星才是演员','合起三方四正，理解宫与宫不是排队关系而是网络关系'],
 enStep:['Split the twelve into self, relationships and affairs to shrink the memory load','Learn the six opposite pairs through contrasts such as self vs. world, money vs. feeling, career vs. family','For each palace ask which real-life scene it maps to','Click through your own chart palace by palace; it sticks better than copying rhymes ten times','Only then learn how stars and transformations land on these palaces—the palace is the stage, the star is the actor','Close with the triple-direction to see the palaces as a network, not a queue'],
 cnMis:['把宫位顺序当成吉凶顺序，觉得排在前面的宫更重要','只背宫名却不理解对宫，结果看任何一宫都缺另一半','把十二宫当成十二个独立命运，忽略了它们在同一件事上的联动'],
 enMis:['Treating the palace order as a ranking of importance, as if earlier palaces mattered more','Memorizing names without the opposite palace, so every reading misses its other half','Reading the twelve palaces as twelve separate fates and missing how they interact'],
 cnClose:'记住十二宫，只是拿到了一张人生地图的坐标。真正读盘时，要把星曜、四化和大限放进去，地图才会动起来。',
 enClose:'Memorizing the twelve palaces only gives you the coordinates of a life map. A chart comes alive only when stars, transformations and the decade limit are placed on it.'},

{cat:'rumen',slug:'ziwei-shengong-shi-shenme-he-minggong-qubie',focus:'身宫',focusEn:'the Body Palace',
 cnT:'紫微斗数身宫是什么：身宫和命宫到底差在哪',enT:'What Is the Body Palace in Zi Wei Dou Shu, and How It Differs from the Life Palace',
 cnD:'命宫是天生的底色，身宫是后天越活越靠近的方向，身宫寄在六个宫位上，提醒你三十五岁后重心往哪移。',
 enD:'The Life Palace is your innate baseline while the Body Palace is the direction you grow toward; it is attached to one of six palaces and shows where your focus shifts after your mid-thirties.',
 cnL:'命宫像出厂设置，身宫像你用了几十年后调成的模式，一个偏先天，一个偏后天养成。',
 enL:'The Life Palace is the factory setting; the Body Palace is the mode you tune after decades of use—one is innate, the other is acquired.',
 cnA:'很多人看到盘上多一个身宫就懵，以为是第十三个宫。其实身宫不单独占宫，它寄在命、夫妻、财帛、迁移、官禄、福德其中之一。',
 enA:'Many people are confused by an extra Body Palace and treat it as a thirteenth palace. In fact it never stands alone; it is attached to Life, Spouse, Wealth, Travel, Career or Karma.',
 cnLog:['命宫描述天生的性格与起点，身宫描述后天努力与阅历会把你推向哪里。','身宫只寄于六宫，寄在哪宫，人生后段就更被那件事牵引。','年轻时段命宫的表现更明显，阅历渐长后身宫的作用越来越重。','命身同宫的人前后较一致，命身分离的人成长前后反差更大。'],
 enLog:['The Life Palace describes innate temperament and starting point; the Body Palace shows where effort and experience push you.','The Body Palace attaches to only six palaces, and whichever it joins pulls your later life.','The Life Palace dominates when young; the Body Palace gains weight as experience accumulates.','When Life and Body share a palace you stay consistent; when they differ, you change more across life.'],
 cnStep:['先找到命宫，确认先天性格底色','再找身宫寄在六个宫位中的哪一个','对比命宫与身宫所在宫位，看先天和后天是不是同一方向','若同向，说明你越活越顺本性；若不同向，说明后天在补课','结合大限看身宫被引动的年龄段','用身宫解释「为什么年轻时和现在像两个人」，而不是另断一条命'],
 enStep:['Find the Life Palace and confirm the innate temperament','Then find which of the six palaces the Body Palace attaches to','Compare the two to see whether innate and acquired point the same way','Same direction means you grow into your nature; different direction means life trains you in a missing area','Use the decade limit to see when the Body Palace activates','Use it to explain why you seem like two people at different ages, not to read a second fate'],
 cnMis:['把身宫当成独立的第十三个宫位另起一套解读','只看命宫忽略身宫，解释不了人随年龄的变化','认为身宫好就可以不努力，其实身宫恰恰是后天修出来的'],
 enMis:['Treating the Body Palace as an independent thirteenth palace with its own reading','Reading only the Life Palace and being unable to explain change with age','Assuming a strong Body Palace means no effort is needed, when it is exactly what you cultivate'],
 cnClose:'身宫的价值，是让你看到一个人不是被命宫定死的，后天的选择会一点点改写重心。',
 enClose:'The value of the Body Palace is showing that no one is fixed by the Life Palace: later choices gradually rewrite where your center of gravity sits.'},

{cat:'rumen',slug:'ziwei-sanfang-sizheng-wei-shenme-shi-kanpan-gujia',focus:'三方四正',focusEn:'the triple-direction and opposite palace',
 cnT:'紫微斗数三方四正为什么是看盘骨架：单宫不成命',enT:'Why the Triple-Direction Is the Backbone of a Zi Wei Dou Shu Reading',
 cnD:'任何一宫都要拉上它的财帛位、官禄位和对宫一起看，本宫只是舞台中央，三方四正才是这台戏的完整班底。',
 enD:'Every palace must be read with its wealth position, career position and opposite palace. The home palace is center stage, but the triple-direction is the whole cast.',
 cnL:'单看一宫就下结论，是新手最容易犯的错；三方四正合起来，才知道这一宫背后有没有人撑、有没有人拆台。',
 enL:'Judging from one palace alone is the classic beginner error; only the full triple-direction shows whether a palace has support or hidden opposition.',
 cnA:'很多人问「我命宫有紫微是不是就很好」，问题在于一颗星再强，也要看三方四正有没有辅佐、有没有煞星冲。',
 enA:'People ask whether Zi Wei in the Life Palace guarantees success, but even the strongest star depends on whether its triple-direction offers support or sends malefics.',
 cnLog:['对宫是本宫的正对面，三合的两个宫与本宫构成「三方」，加对宫合称三方四正。','本宫写核心，对宫写牵引，两个三合宫写资源与执行，缺一不可。','吉星会照叫有援，煞星冲照叫有破，强弱要看净效果而不是单颗星。','三方四正也是判断格局成不成立的基本单位。'],
 enLog:['The opposite palace sits directly across, and the two trine palaces plus the home palace form the triple-direction; adding the opposite makes four directions.','The home palace is the core, the opposite is the pull, and the two trine palaces supply resources and execution.','Auspicious meetings mean support and malefic clashes mean breaks; strength is the net effect, not a single star.','The triple-direction is also the basic unit for judging whether a pattern holds.'],
 cnStep:['锁定要问的那一宫作为本宫','找到正对面的对宫，看它怎么牵引本宫','沿三合找到另外两个宫，看资源和执行力够不够','把本宫、对宫、两个三合宫的主星全部列出','再数其中的吉星、煞星、四化，算净效果','最后才判断这一宫是稳、是虚，还是表面好看'],
 enStep:['Lock the palace you are asking about as the home palace','Find its opposite to see the pull','Follow the trine to the other two palaces for resources and execution','List the major stars in all four positions','Count auspicious stars, malefics and transformations for the net effect','Only then decide whether the palace is solid, hollow, or merely good-looking'],
 cnMis:['只盯着本宫一颗星，忽略对宫和三合','看到一颗煞星就判坏，没看它是否被吉星化解','把三方四正背成口诀，却不会在自己盘上实际连线'],
 enMis:['Fixating on one star in the home palace while ignoring the opposite and trines','Judging a single malefic as bad without checking whether auspicious stars resolve it','Knowing the rhyme but never actually drawing the lines on a real chart'],
 cnClose:'学会三方四正，看盘就从「看一颗星」升级成「看一张关系网」，这是从背星到会读盘的第一道门槛。',
 enClose:'Mastering the triple-direction moves you from reading a single star to reading a network—the first threshold between memorizing stars and truly reading a chart.'},

{cat:'rumen',slug:'ziwei-paipan-wei-shenme-yong-nongli-bushi-gongli',focus:'农历排盘',focusEn:'the lunar calendar for casting',
 cnT:'紫微斗数排盘为什么用农历：用错历法整张盘都偏',enT:'Why Zi Wei Dou Shu Uses the Lunar Calendar: The Wrong Calendar Shifts the Whole Chart',
 cnD:'紫微按阴历的月和时辰安命身、布星曜，直接拿公历生日排盘，命宫位置和星曜都可能错，闰月还要特别处理。',
 enD:'Zi Wei places the Life and Body palaces and stars by lunar month and hour. Feeding a solar birthday directly can shift the Life Palace and stars, and leap months need special handling.',
 cnL:'排盘第一步不是点按钮，而是把公历生日准确换算成农历，历法错了，后面所有解读都是在错盘上进行。',
 enL:'The first step is not clicking a button but converting the solar birthday to lunar; if the calendar is wrong, every later interpretation sits on a wrong chart.',
 cnA:'有人拿着公历生日直接填进排盘工具，看到结果不准就怀疑命理，其实是输入的历法就错了。',
 enA:'Some people enter a solar birthday directly, find the reading off, and doubt the system—when the input calendar itself was wrong.',
 cnLog:['紫微斗数以阴历（农历）的年月日时为排盘基准，和八字用节气换月不同。','命宫由生月与生时推得，月份一错命宫就跟着换宫。','闰月出生要按流派规则处理，常见做法是闰月前后半月分别参照或定盘校正。','时辰跨子时还要分早子时、晚子时，涉及换日。'],
 enLog:['Zi Wei casts from the lunar year, month, day and hour, unlike BaZi which changes months by solar terms.','The Life Palace derives from birth month and hour, so a wrong month moves the Life Palace.','Leap-month births follow school-specific rules, often splitting the month at its midpoint or correcting via chart verification.','Hours crossing midnight split into early and late Zi hour because the date changes.'],
 cnStep:['先拿到准确的公历出生年月日时和出生地','用可靠工具换算成农历，注意是否落在闰月','确认出生时辰落在哪个时辰区间，跨子时要分早晚子时','用农历数据排出命身宫和十二宫','布完主星后用性格、过往大事做一次定盘核对','核对无误再开始解读，宁可慢在排盘，不要错在起点'],
 enStep:['Get the exact solar date, time and birthplace','Convert to lunar with a reliable tool and check for a leap month','Confirm the two-hour time block, splitting early and late Zi hour around midnight','Cast the Life, Body and twelve palaces from the lunar data','After placing major stars, verify the chart against personality and past events','Only then interpret—better to be slow at casting than wrong at the start'],
 cnMis:['直接用公历日期排盘还不自知','遇到闰月想当然按当月算，不做定盘','忽略早晚子时，把跨夜出生的盘排成前一天或后一天'],
 enMis:['Casting directly from the solar date without realizing it','Assuming a leap month equals the regular month with no verification','Ignoring early vs. late Zi hour and shifting a midnight birth to the wrong day'],
 cnClose:'历法是排盘的地基。地基对了，星曜、四化、大限才有意义；地基错了，再精彩的解读也是空中楼阁。',
 enClose:'The calendar is the foundation of a chart. When it is right, stars, transformations and limits mean something; when it is wrong, even a brilliant reading is a house on sand.'},

{cat:'rumen',slug:'ziwei-miao-wang-luo-xian-shi-shenme-yisi',focus:'庙旺落陷',focusEn:'star brightness (exaltation and fall)',
 cnT:'紫微斗数庙旺落陷是什么意思：星曜的亮度不等于吉凶',enT:'Miao, Wang and Fall in Zi Wei Dou Shu: Star Brightness Is Not Good or Bad',
 cnD:'庙旺是星曜在某个宫位力量舒展，落陷是力量受限，但吉星落陷也未必坏、煞星得地反而更有破坏力，要组合着看。',
 enD:'Exaltation means a star expresses its strength in a palace; fall means it is constrained. Yet a fallen auspicious star is not always bad and an empowered malefic can do more damage—read them in combination.',
 cnL:'庙旺落陷讲的是星曜「有没有力气发挥」，不是简单的好坏，真正的吉凶要看它和谁在一起、落在什么事上。',
 enL:'Brightness describes whether a star has the power to express itself, not simple good or bad; the verdict depends on company and context.',
 cnA:'新手常把庙旺当加分、落陷当扣分，结果看到落陷的吉星就吓自己，看到庙旺的煞星还以为是好事。',
 enA:'Beginners treat exaltation as a plus and fall as a minus, then fear a fallen auspicious star and welcome an exalted malefic.',
 cnLog:['庙、旺、得地表示星性舒展，落陷、失地表示星性别扭、难发挥。','庙旺放大的是星的本性：吉星庙旺更稳，煞星庙旺破坏力也更强。','落陷不是消失，吉星落陷常表现为「好处打折、需要条件」。','同一颗星在不同宫位，亮度不同，表现方式也不同。'],
 enLog:['Miao, wang and grounded mean the star\'s nature expresses; fall and loss mean it is awkward and constrained.','Brightness amplifies nature: an exalted auspicious star is steadier, an exalted malefic hits harder.','Fall does not erase a star; a fallen auspicious star often means its benefit is discounted and conditional.','The same star expresses differently as its brightness changes across palaces.'],
 cnStep:['先认出这颗星的基本星性是吉是凶还是中性','查它在当前宫位的亮度，判断力量大小','看它和哪些主星、辅煞同宫或会照','吉星落陷，找有没有化科化禄或辅星补救','煞星庙旺，反而要提高警惕看它破在哪','把亮度、星性、组合三者合起来，再下结论'],
 enStep:['First identify whether the star is auspicious, malefic or neutral by nature','Check its brightness in the current palace to gauge its power','See which major and assistant stars share or meet it','For a fallen auspicious star, look for Hua Ke, Hua Lu or assistants that rescue it','For an exalted malefic, stay alert to where it breaks things','Combine brightness, nature and company before concluding'],
 cnMis:['把庙旺直接等于好、落陷直接等于坏','只看单星亮度，不看同宫和三方的搭配','以为落陷就无解，忽略了四化和辅星的补救空间'],
 enMis:['Equating exaltation with good and fall with bad','Reading one star\'s brightness without its company and triple-direction','Assuming fall is hopeless and ignoring rescue by transformations and assistants'],
 cnClose:'庙旺落陷是力量的调节器，不是吉凶的判决书。学会把亮度放回组合里，你对一颗星的判断才会立体。',
 enClose:'Brightness is a power dial, not a verdict. Putting brightness back into combination is what makes your reading of a star three-dimensional.'},
];

module.exports={RAW,T,batch,DATE,eng};
