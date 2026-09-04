const fs = require('fs');
const path = require('path');
const date = '2026-08-19T12:05:00+08:00';
function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

const articles = [
  {
    slug: 'ziwei-geju-xingqiu-jiayin',
    cnTitle: '紫微斗数刑囚夹印格：天相加化忌和廉贞，官非刑伤的预警格局',
    enTitle: 'Xing Qiu Jia Yin: Tian Xiang with Hua Ji and Lian Zhen — Legal Trouble Warning',
    cnDesc: '刑囚夹印是天相在命宫，邻宫有化忌和廉贞相夹的凶格，主官非、刑伤、纠纷。但凶格是预警不是判决，可提前防范。',
    enDesc: 'Xing Qiu Jia Yin is an inauspicious pattern when Tian Xiang in Life is sandwiched by Hua Ji and Lian Zhen, ruling legal disputes and injury. But it is a warning, not a verdict.',
    cnLead: '刑囚夹印是紫微斗数里少数几个名字就带「凶」字的格局。天相是印星，代表你自己；化忌是「刑」，廉贞是「囚」，两颗凶星从两边把你夹住。就像一个人站在中间，左边是官司，右边是牢狱——这种格局的人一生容易遇到纠纷、合同问题、甚至法律麻烦。但紫微斗数的凶格从来不是「注定坐牢」，而是「这条路有坑，你要绕着走」。',
    cnIntro2: '刑囚夹印的成格条件：天相在命宫，相邻的两个宫一个有化忌，一个有廉贞。化忌代表「刑」——阻滞、纠纷、是非；廉贞代表「囚」——官非、牢狱、桃花劫。这个格局跟财荫夹印是完全相反的：财荫夹印是化禄和天梁夹天相，主有靠山；刑囚夹印是化忌和廉贞夹天相，主有麻烦。',
    cnSections: [
      { h: '成格条件', ps: [
        '天相在命宫——印星在主位。',
        '命宫的邻宫一个有化忌，一个有廉贞。',
        '化忌提供「刑」的力量——是非、纠纷、阻滞。',
        '廉贞提供「囚」的力量——官非、牢狱、桃花劫。',
        '如果邻宫是化禄和天梁，则变成财荫夹印，是吉格。'
      ]},
      { h: '刑囚夹印的表现', ps: [
        '官非纠纷——容易遇到合同纠纷、劳动争议、甚至被起诉。',
        '刑伤——可能有手术、外伤、或因他人牵连受罚。',
        '桃花劫——廉贞本身是桃花星，加化忌可能因感情惹祸。',
        '职场小人——工作中容易遇到陷害、背黑锅、被人利用。'
      ]},
      { h: '怎么化解', ps: [
        '签合同前找律师——不要嫌麻烦，刑囚夹印的人最容易在合同上吃亏。',
        '不替人担保——不要给任何人做担保，包括亲戚朋友。',
        '远离是非——别人吵架你不要掺和，别人的秘密你不要听。',
        '感情上谨慎——不要搞婚外情，不要跟有夫之妇/有妇之夫纠缠。',
        '定期体检——廉贞也主血液和内分泌，化忌可能有健康问题。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：一生容易有官非纠纷，要特别注意法律风险。',
        '官禄宫：工作中容易有合同纠纷、职场斗争、被解雇。',
        '财帛宫：因财惹祸，可能因投资或借贷产生法律问题。',
        '夫妻宫：婚姻中有纠纷，可能离婚打官司。',
        '迁移宫：在外容易惹祸，出行要注意安全和法律。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到刑囚夹印，按这个顺序读：'], ol: [
        '先确认天相在命宫——印星必须在主位。',
        '看邻宫是化忌还是化禄——化忌是刑囚夹印，化禄是财荫夹印。',
        '看廉贞的亮度——廉贞庙旺囚力强，落陷囚力弱。',
        '看有没有吉星——天魁天钺、解神能减轻凶性。',
        '刑囚夹印的人要记住「不惹事、不怕事」——不主动惹是非，但遇到了要找专业人士。',
        '问自己：你最近有没有在合同上偷懒？有没有替人担保？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-geju-caisan-jiaji.html', text: '财荫夹印格' },
      { href: 'ziwei-tianxiang-zuoming.html', text: '天相坐命' },
      { href: 'ziwei-lianzhen-zuoming.html', text: '廉贞坐命' },
      { href: 'ziwei-huaji.html', text: '化忌星详解' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Xing Qiu Jia Yin is one of the few patterns whose name itself carries "inauspicious." Tian Xiang is the seal star (you); Hua Ji is "punishment," Lian Zhen is "imprisonment" — two malefic stars sandwiching you from both sides. Like standing between a lawsuit on the left and prison on the right. People with it tend to encounter disputes, contract issues, even legal trouble. But inauspicious patterns never mean "fated for jail" — they mean "there\'s a pit on this road, walk around it."',
    enIntro2: 'Conditions: Tian Xiang in Life, with Hua Ji in one adjacent palace and Lian Zhen in the other. Hua Ji = "punishment" — obstruction, disputes, trouble; Lian Zhen = "imprisonment" — legal issues, jail, romantic disasters. It\'s the opposite of Cai Yin Jia Yin (Hua Lu and Tian Liang sandwiching Tian Xiang, ruling backing).',
    enSections: [
      { h: 'Conditions', ps: [
        'Tian Xiang in Life — the seal star on the throne.',
        'One adjacent palace has Hua Ji, the other has Lian Zhen.',
        'Hua Ji provides "punishment" — disputes, obstruction, trouble.',
        'Lian Zhen provides "imprisonment" — legal issues, jail, romantic disasters.',
        'If adjacent palaces have Hua Lu and Tian Liang instead, it becomes Cai Yin Jia Yin, an auspicious pattern.'
      ]},
      { h: 'Manifestations', ps: [
        'Legal disputes — contract issues, labor disputes, even being sued.',
        'Injury — surgery, trauma, or punishment through others\' actions.',
        'Romantic disaster — Lian Zhen is a romance star; with Hua Ji, trouble through relationships.',
        'Workplace petty people — framing, taking the blame, being used.'
      ]},
      { h: 'How to Mitigate', ps: [
        'Get a lawyer before signing contracts — don\'t skip this; people with this pattern lose most on contracts.',
        'Never co-sign or guarantee for anyone — including relatives and friends.',
        'Stay away from trouble — don\'t join others\' arguments, don\'t listen to others\' secrets.',
        'Be cautious in relationships — no affairs, no entanglement with married people.',
        'Regular checkups — Lian Zhen also rules blood and endocrine; Hua Ji may bring health issues.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: prone to legal disputes lifelong, pay special attention to legal risk.',
        'Career: contract disputes, office politics, being fired at work.',
        'Wealth: trouble through money, legal issues from investments or loans.',
        'Spouse: marital disputes, possibly divorce litigation.',
        'Travel: trouble away from home, watch safety and law when traveling.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Xing Qiu Jia Yin:'], ol: [
        'Confirm Tian Xiang in Life — the seal star must be central.',
        'Check if adjacent palace has Hua Ji or Hua Lu — Hua Ji = inauspicious; Hua Lu = auspicious.',
        'Check Lian Zhen\'s brightness — temple/prosperous gives stronger imprisonment; fallen gives weaker.',
        'Check auspicious stars — Kui/Yue, Jie Shen reduce the malefic nature.',
        'Remember "don\'t start trouble, don\'t fear trouble" — don\'t主动 seek disputes, but when they come, find professionals.',
        'Have you been lazy with contracts lately? Co-signed for anyone?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-geju-caisan-jiaji.html', text: 'Cai Yin Jia Yin' },
      { href: 'ziwei-tianxiang-zuoming.html', text: 'Tian Xiang in Life' },
      { href: 'ziwei-lianzhen-zuoming.html', text: 'Lian Zhen in Life' },
      { href: 'ziwei-huaji.html', text: 'Hua Ji Explained' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-taohua-gunlang',
    cnTitle: '紫微斗数桃花滚浪格：贪狼加煞星在水位，桃花成灾的格局',
    enTitle: 'Tao Hua Gun Lang: Tan Lang with Malefics in Water — Romance Becomes Disaster',
    cnDesc: '桃花滚浪是贪狼在水位（子亥）加煞星的格局，主桃花泛滥成灾、因色破财、感情纠葛。跟泛水桃花不同，滚浪格有煞星推动，破坏力更大。',
    enDesc: 'Tao Hua Gun Lang is when Tan Lang in water positions (Zi/Hai) has malefics, ruling romance overflowing into disaster, financial loss through sex, and emotional entanglement. Unlike Fan Shui Tao Hua, this pattern has malefics amplifying destruction.',
    cnLead: '桃花滚浪跟泛水桃花只有一字之差，但破坏力天差地别。泛水桃花是贪狼在子宫，桃花像水一样流——虽然多但还算温柔；桃花滚浪是贪狼在水位加了煞星，桃花像浪一样滚——一浪接一浪，把人卷进去出不来。命宫有桃花滚浪的人，不是桃花多，是桃花「凶」——容易因感情破财、因色惹祸、甚至身败名裂。',
    cnIntro2: '桃花滚浪的成格条件：贪狼在子宫或亥宫（水位），且同宫或三方有擎羊、陀罗、火星、铃星等煞星。煞星把贪狼的桃花欲望推到极致，变成「滚浪」——一浪接一浪，停不下来。这个格局跟泛水桃花的区别就在于有没有煞星：有煞星是滚浪（凶），没煞星是泛水（中性偏吉）。',
    cnSections: [
      { h: '成格条件', ps: [
        '贪狼在子宫或亥宫（水位）。',
        '同宫或三方有擎羊、陀罗、火星、铃星等煞星。',
        '煞星越多，浪越大，破坏力越强。',
        '加化忌——桃花变成桃花劫，因情生恨。',
        '加吉星（昌曲、魁钺）——能减轻凶性，桃花变成才艺和魅力。'
      ]},
      { h: '桃花滚浪的表现', ps: [
        '因色破财——为情人花钱、被仙人跳、因感情纠纷赔钱。',
        '感情纠葛——同时跟多个人有关系，剪不断理还乱。',
        '身败名裂——桃花事件可能影响事业和名誉，尤其是公众人物。',
        '健康问题——贪狼主欲望，加煞星可能有性病、纵欲过度等问题。'
      ]},
      { h: '跟泛水桃花的区别', ps: [
        '泛水桃花——贪狼在子无煞星，桃花多但温柔，主才艺和魅力。',
        '桃花滚浪——贪狼在子加煞星，桃花凶，主破财和灾祸。',
        '泛水桃花的人「多情但不滥情」，桃花滚浪的人「滥情且失控」。',
        '关键看煞星——有煞星是滚浪，没煞星是泛水。'
      ]},
      { h: '怎么化解', ps: [
        '把欲望引导到事业上——贪狼的欲望用在赚钱和创作上，比用在感情上安全。',
        '不碰已婚的人——桃花滚浪的人最容易因第三者惹祸。',
        '财务独立——不要把钱交给情人管，不要为感情大额支出。',
        '培养健康的爱好——运动、艺术、学习，把精力花在正途上。',
        '晚婚——等心智成熟了再结婚，婚姻更稳定。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到桃花滚浪，按这个顺序读：'], ol: [
        '先确认贪狼在子或亥——水位是基础条件。',
        '看有没有煞星——有煞星是滚浪，没煞星是泛水。',
        '数煞星——煞星越多破坏力越大。',
        '看有没有吉星——吉星能把桃花转化为才艺。',
        '桃花滚浪的人要学会「止损」——感情上的损失要及时切断，不要越陷越深。',
        '问自己：你最近的感情是在「滋养你」还是「消耗你」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-geju-fanshui-taohua.html', text: '泛水桃花格' },
      { href: 'ziwei-tanlang-zuoming.html', text: '贪狼坐命' },
      { href: 'ziwei-qingyang-tuoluo.html', text: '擎羊陀罗' },
      { href: 'ziwei-huoxing-lingxing.html', text: '火星铃星' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tao Hua Gun Lang differs from Fan Shui Tao Hua by one word, but the destruction is vastly different. Fan Shui Tao Hua is Tan Lang in Zi with romance flowing like water — plentiful but gentle. Tao Hua Gun Lang is Tan Lang in water with malefics, romance rolling like waves — one after another, pulling you under. People with this pattern don\'t just have many romances; their romances are "vicious" — financial loss through sex, trouble through love, even ruin.',
    enIntro2: 'Conditions: Tan Lang in Zi or Hai (water positions), with malefics (Qing Yang, Tuo Luo, Huo Xing, Ling Xing) in the same palace or triple direction. Malefics push Tan Lang\'s romantic desire to the extreme, becoming "rolling waves" — endless, unstoppable. The difference from Fan Shui Tao Hua is the presence of malefics: with them = Gun Lang (inauspicious); without = Fan Shui (neutral to auspicious).',
    enSections: [
      { h: 'Conditions', ps: [
        'Tan Lang in Zi or Hai (water positions).',
        'Malefics (Qing Yang, Tuo Luo, Huo Xing, Ling Xing) in same palace or triple direction.',
        'More malefics = bigger waves = more destruction.',
        'With Hua Ji — romance becomes romantic disaster, love turning to hate.',
        'With auspicious stars (Chang/Qu, Kui/Yue) — reduces malefic nature, romance becomes talent and charm.'
      ]},
      { h: 'Manifestations', ps: [
        'Financial loss through sex — spending on lovers, honey traps, paying through romantic disputes.',
        'Emotional entanglement — multiple simultaneous relationships, impossible to untangle.',
        'Ruin — romantic events may affect career and reputation, especially for public figures.',
        'Health issues — Tan Lang rules desire; with malefics, possible STDs, excess.'
      ]},
      { h: 'vs Fan Shui Tao Hua', ps: [
        'Fan Shui Tao Hua — Tan Lang in Zi without malefics, many but gentle romances, talent and charm.',
        'Tao Hua Gun Lang — Tan Lang in Zi with malefics, vicious romance, financial loss and disaster.',
        'Fan Shui people are "romantic but not promiscuous"; Gun Lang people are "promiscuous and out of control."',
        'Key is malefics — with them = Gun Lang; without = Fan Shui.'
      ]},
      { h: 'How to Mitigate', ps: [
        'Channel desire into career — Tan Lang\'s desire is safer in money-making and creativity than in romance.',
        'Don\'t touch married people — those with this pattern most often get into trouble through third parties.',
        'Financial independence — don\'t give money to lovers, don\'t spend big on relationships.',
        'Cultivate healthy hobbies — sports, art, learning, channel energy into positive pursuits.',
        'Marry later — marriage is more stable when you\'re more mature.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tao Hua Gun Lang:'], ol: [
        'Confirm Tan Lang in Zi or Hai — water position is the basic condition.',
        'Check for malefics — with them = Gun Lang; without = Fan Shui.',
        'Count malefics — more = greater destruction.',
        'Check auspicious stars — they transform romance into talent.',
        'Learn to "cut losses" — cut emotional losses promptly, don\'t sink deeper.',
        'Is your current relationship nourishing you or draining you?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-geju-fanshui-taohua.html', text: 'Fan Shui Tao Hua' },
      { href: 'ziwei-tanlang-zuoming.html', text: 'Tan Lang in Life' },
      { href: 'ziwei-qingyang-tuoluo.html', text: 'Qing Yang & Tuo Luo' },
      { href: 'ziwei-huoxing-lingxing.html', text: 'Huo Xing & Ling Xing' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-lianfu-tonggong',
    cnTitle: '紫微斗数廉府同宫格：廉贞天府同坐，才华与稳重并存的格局',
    enTitle: 'Lian Fu Tong Gong: Lian Zhen and Tian Fu Together — Talent and Stability',
    cnDesc: '廉府同宫是廉贞和天府同坐一宫的格局，主才华出众、稳重可靠、能文能武。但廉贞的桃花和天府的保守之间有张力，要平衡好。',
    enDesc: 'Lian Fu Tong Gong is when Lian Zhen and Tian Fu share a palace, ruling outstanding talent, reliability, and versatility. But there\'s tension between Lian Zhen\'s romance and Tian Fu\'s conservatism.',
    cnLead: '廉府同宫是紫微斗数里最「能文能武」的格局之一。廉贞是次桃花星，主才华、交际、感情；天府是财库星，主稳重、保守、管理。两颗星同坐一宫，就像一个艺术家坐在财务总监的位置上——你既有创意又有执行力，既有魅力又有分寸。命宫有廉府同宫的人，在事业上特别吃得开，因为你既能搞定人又能搞定事。',
    cnIntro2: '廉府同宫的成格条件：廉贞和天府同坐一宫（在寅宫或申宫）。寅申是「迁移」之位，廉府在这里同宫，主在外发展好、适合离开家乡。这个格局跟紫府同宫不同：紫府同宫是「皇帝坐在金库里」，地位高但可能孤；廉府同宫是「才子坐在金库里」，有才华又有资源，更接地气。',
    cnSections: [
      { h: '成格条件', ps: [
        '廉贞和天府同坐寅宫或申宫。',
        '命宫在寅或申，廉府同守。',
        '加吉星（辅弼、昌曲、魁钺）——才华和稳重都得到发挥。',
        '加煞星——廉贞的桃花被煞星激发，可能因感情惹祸；天府的保守被煞星打破，可能财务出问题。'
      ]},
      { h: '廉府同宫的优势', ps: [
        '能文能武——廉贞的才华加天府的稳重，既能做创意工作又能做管理工作。',
        '社交能力强——廉贞主交际，天府主可靠，别人既喜欢你又信任你。',
        '财运好——天府是财库星，廉贞能生财，两者配合赚钱能力强。',
        '适合做管理——你既有个人魅力又有制度意识，带团队特别合适。'
      ]},
      { h: '廉府同宫的张力', ps: [
        '创意 vs 保守——廉贞想创新，天府想守成，你内心经常在「要不要冒险」之间纠结。',
        '感情 vs 责任——廉贞桃花旺，天府重责任，你可能在感情和家庭之间摇摆。',
        '外表 vs 内心——你看起来很稳重（天府），但内心其实很浪漫（廉贞），别人可能不了解真正的你。',
        '关键是平衡——不要让廉贞压过天府（变得花心），也不要让天府压过廉贞（变得无趣）。'
      ]},
      { h: '适合的职业', ps: [
        '管理岗——部门经理、总监、CEO，既能带团队又能管财务。',
        '金融行业——天府的财库加廉贞的敏锐，适合做投资、银行、保险。',
        '文化产业——廉贞的才华加天府的运营，适合做文化公司、媒体、出版。',
        '公关和销售——廉贞的交际加天府的可靠，客户既喜欢你又信任你。',
        '不适合做纯技术或纯艺术——你需要跟人打交道，也需要一定的稳定性。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到廉府同宫，按这个顺序读：'], ol: [
        '先确认廉贞天府在寅或申同宫——两个位置略有不同。',
        '看有没有吉星——吉星让才华和稳重都发挥出来。',
        '看有没有煞星——煞星打破平衡，可能感情或财务出问题。',
        '看化禄化权——禄权让廉府的赚钱和管理能力更强。',
        '廉府同宫的人要学会「平衡」——创意和稳重、感情和责任，都要兼顾。',
        '问自己：你最近是在「发挥才华」还是「过度保守」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-geju-zifu-tonggong.html', text: '紫府同宫格' },
      { href: 'ziwei-lianzhen-zuoming.html', text: '廉贞坐命' },
      { href: 'ziwei-tianfu-zuoming.html', text: '天府坐命' },
      { href: 'ziwei-geju-caisan-jiaji.html', text: '财荫夹印格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Lian Fu Tong Gong is one of the most versatile patterns. Lian Zhen is the secondary romance star — talent, sociability, emotion; Tian Fu is the treasury star — stability, conservatism, management. Together they\'re like an artist sitting in a CFO\'s chair — creative yet execution-oriented, charming yet measured. People with it excel in career because they can handle both people and tasks.',
    enIntro2: 'Conditions: Lian Zhen and Tian Fu sharing a palace (in Yin or Shen). Yin/Shen are "travel" positions; Lian Fu here rules good development away from home, suited to leaving hometown. Unlike Zi Fu Tong Gong (emperor in treasury, high status but possibly lonely), Lian Fu is "talent in treasury" — gifted with resources, more down-to-earth.',
    enSections: [
      { h: 'Conditions', ps: [
        'Lian Zhen and Tian Fu sharing Yin or Shen palace.',
        'Life in Yin or Shen with both stars.',
        'With auspicious stars (Fu/Bi, Chang/Qu, Kui/Yue) — both talent and stability flourish.',
        'With malefics — Lian Zhen\'s romance amplified, trouble through relationships; Tian Fu\'s conservatism broken, financial issues.'
      ]},
      { h: 'Advantages', ps: [
        'Versatile — Lian Zhen\'s talent plus Tian Fu\'s stability, can do both creative and management work.',
        'Strong social skills — Lian Zhen\'s sociability plus Tian Fu\'s reliability, people both like and trust you.',
        'Good wealth — Tian Fu is treasury, Lian Zhen generates income; together strong earning ability.',
        'Suited to management — personal charm plus institutional awareness, great for leading teams.'
      ]},
      { h: 'The Tension', ps: [
        'Creativity vs conservatism — Lian Zhen wants to innovate, Tian Fu wants to preserve; inner debate about risk-taking.',
        'Emotion vs responsibility — Lian Zhen\'s strong romance, Tian Fu\'s sense of duty; wavering between love and family.',
        'Appearance vs inner self — you look stable (Tian Fu) but are romantic inside (Lian Zhen); others may not know the real you.',
        'Key is balance — don\'t let Lian Zhen overpower Tian Fu (become promiscuous), nor Tian Fu overpower Lian Zhen (become boring).'
      ]},
      { h: 'Suitable Careers', ps: [
        'Management — department head, director, CEO; can lead teams and manage finances.',
        'Finance — Tian Fu\'s treasury plus Lian Zhen\'s acuity, suited to investment, banking, insurance.',
        'Culture industry — Lian Zhen\'s talent plus Tian Fu\'s operations, suited to media, publishing.',
        'PR and sales — Lian Zhen\'s sociability plus Tian Fu\'s reliability, clients like and trust you.',
        'Not suited to pure tech or pure art — you need people interaction and some stability.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Lian Fu Tong Gong:'], ol: [
        'Confirm Lian Zhen and Tian Fu in Yin or Shen — slightly different at each position.',
        'Check auspicious stars — they let both talent and stability flourish.',
        'Check malefics — they break balance, possible relationship or financial issues.',
        'Check Hua Lu/Hua Quan — they strengthen earning and management ability.',
        'Learn "balance" — creativity and stability, emotion and responsibility, both matter.',
        'Are you currently "expressing talent" or "being overly conservative"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-geju-zifu-tonggong.html', text: 'Zi Fu Tong Gong' },
      { href: 'ziwei-lianzhen-zuoming.html', text: 'Lian Zhen in Life' },
      { href: 'ziwei-tianfu-zuoming.html', text: 'Tian Fu in Life' },
      { href: 'ziwei-geju-caisan-jiaji.html', text: 'Cai Yin Jia Yin' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-wuji-tonggong',
    cnTitle: '紫微斗数武机同宫格：武曲天机同坐，精明干练的技术型格局',
    enTitle: 'Wu Ji Tong Gong: Wu Qu and Tian Ji Together — The Sharp Technical Pattern',
    cnDesc: '武机同宫是武曲和天机同坐一宫的格局，主精明、干练、善于计算和规划。适合做技术、金融、工程，但要防过于算计而失人心。',
    enDesc: 'Wu Ji Tong Gong is when Wu Qu and Tian Ji share a palace, ruling sharpness, competence, and skill in calculation and planning. Suited to tech, finance, engineering, but guard against over-calculation losing people.',
    cnLead: '武机同宫是紫微斗数里最「精明」的格局之一。武曲是财星和将星，主果断、实际、重利益；天机是智慧星，主聪明、善变、善谋划。两颗星同坐，就像一个精算师加一个战略家——你算得比谁都精，想得比谁都远。命宫有武机同宫的人，在需要理性和计算的领域特别强，但太精了也有问题——别人会觉得你「太会算了」，不敢跟你深交。',
    cnIntro2: '武机同宫的成格条件：武曲和天机同坐一宫（在辰宫或戌宫）。辰戌是「天罗地网」之位，武机在这里同宫，主需要突破束缚才能发展。这个格局跟武贪格不同：武贪是「财欲双全」的爆发型，武机是「精打细算」的稳健型。',
    cnSections: [
      { h: '成格条件', ps: [
        '武曲和天机同坐辰宫或戌宫。',
        '命宫在辰或戌，武机同守。',
        '加文昌文曲——计算和规划能力更强，适合做学术或技术。',
        '加化禄化权——精明能变现，适合做金融或管理。',
        '加煞星——精明变成刻薄，算计变成阴谋，容易树敌。'
      ]},
      { h: '武机同宫的优势', ps: [
        '计算能力强——你对数字、逻辑、系统特别敏感，能快速找到最优解。',
        '规划能力强——天机善谋划，武曲善执行，你既能做计划又能落地。',
        '理性冷静——遇到问题不情绪化，能客观分析利弊。',
        '适合做专业人士——医生、律师、工程师、分析师，这些需要精准和理性的职业。'
      ]},
      { h: '武机同宫的陷阱', ps: [
        '过于算计——你算得太精，别人跟你合作总觉得「吃亏」，久而久之没人愿意跟你玩。',
        '缺乏人情味——武曲重利益，天机善变，你可能在感情上比较冷漠。',
        '想太多——天机的善变加武曲的果断，你可能反复权衡后错失机会。',
        '天罗地网——辰戌宫位本身有束缚感，武机在这里容易觉得「怀才不遇」。'
      ]},
      { h: '适合的职业', ps: [
        '金融——分析师、交易员、风控，武曲的财感加天机的谋划。',
        '工程和技术——程序员、架构师、工程师，需要精准和系统思维。',
        '法律和医学——律师、医生、咨询师，需要理性判断和专业知识。',
        '战略咨询——帮企业做规划和决策，你的分析能力是核心竞争力。',
        '不适合做需要「人情味」的工作——客服、HR、社工，你可能太理性了。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到武机同宫，按这个顺序读：'], ol: [
        '先确认武曲天机在辰或戌同宫——两个位置略有不同。',
        '看有没有昌曲——昌曲让你的精明用在学术和技术上。',
        '看有没有化禄化权——禄权让精明变现。',
        '看有没有煞星——煞星让精明变成刻薄。',
        '武机同宫的人要学会「难得糊涂」——有些事不要算太精，给别人留余地。',
        '问自己：你最近的「精明」是在「解决问题」还是在「占小便宜」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-geju-wutan.html', text: '武贪格' },
      { href: 'ziwei-wuqu-zuoming.html', text: '武曲坐命' },
      { href: 'ziwei-tianji-zuoming.html', text: '天机坐命' },
      { href: 'ziwei-geju-jiliang-tonggong.html', text: '机梁同宫格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Wu Ji Tong Gong is one of the sharpest patterns. Wu Qu is the wealth and general star — decisive, practical, profit-oriented; Tian Ji is the wisdom star — smart, adaptable, strategic. Together they\'re like an actuary plus a strategist — you calculate sharper than anyone, plan farther than anyone. People with it excel in fields requiring rationality and calculation, but being too sharp has a problem — others find you "too calculating" and won\'t get close.',
    enIntro2: 'Conditions: Wu Qu and Tian Ji sharing a palace (in Chen or Xu). Chen/Xu are the "heaven\'s net and earth\'s trap" positions; Wu Ji here rules needing to break through constraints to develop. Unlike Wu Tan (wealth-desire explosive type), Wu Ji is the "careful calculation" steady type.',
    enSections: [
      { h: 'Conditions', ps: [
        'Wu Qu and Tian Ji sharing Chen or Xu palace.',
        'Life in Chen or Xu with both stars.',
        'With Wen Chang/Wen Qu — stronger calculation and planning, suited to academia or tech.',
        'With Hua Lu/Hua Quan — sharpness monetizes, suited to finance or management.',
        'With malefics — sharpness becomes cruelty, calculation becomes scheming, easy to make enemies.'
      ]},
      { h: 'Advantages', ps: [
        'Strong calculation — sensitive to numbers, logic, systems; quickly find optimal solutions.',
        'Strong planning — Tian Ji strategizes, Wu Qu executes; can both plan and implement.',
        'Rational and calm — not emotional when problems arise, objectively analyze pros and cons.',
        'Suited to professions — doctor, lawyer, engineer, analyst; careers requiring precision and rationality.'
      ]},
      { h: 'The Trap', ps: [
        'Over-calculation — you calculate too precisely; partners always feel they "lose out," eventually no one wants to work with you.',
        'Lack of warmth — Wu Qu is profit-oriented, Tian Ji is adaptable; you may be cold in relationships.',
        'Overthinking — Tian Ji\'s adaptability plus Wu Qu\'s decisiveness; may weigh options repeatedly and miss chances.',
        'Heaven\'s net — Chen/Xu positions inherently feel constraining; Wu Ji here may feel "unrecognized talent."'
      ]},
      { h: 'Suitable Careers', ps: [
        'Finance — analyst, trader, risk control; Wu Qu\'s financial sense plus Tian Ji\'s strategy.',
        'Engineering and tech — programmer, architect, engineer; needs precision and systems thinking.',
        'Law and medicine — lawyer, doctor, consultant; needs rational judgment and expertise.',
        'Strategy consulting — helping enterprises plan and decide; your analysis is core competence.',
        'Not suited to "warmth"-requiring work — customer service, HR, social work; you may be too rational.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Wu Ji Tong Gong:'], ol: [
        'Confirm Wu Qu and Tian Ji in Chen or Xu — slightly different at each position.',
        'Check Chang/Qu — they channel sharpness into academia and tech.',
        'Check Hua Lu/Hua Quan — they monetize sharpness.',
        'Check malefics — they turn sharpness into cruelty.',
        'Learn "where ignorance is bliss, it is folly to be wise" — don\'t calculate everything, leave room for others.',
        'Is your recent "sharpness" solving problems or taking petty advantage?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-geju-wutan.html', text: 'Wu Tan Pattern' },
      { href: 'ziwei-wuqu-zuoming.html', text: 'Wu Qu in Life' },
      { href: 'ziwei-tianji-zuoming.html', text: 'Tian Ji in Life' },
      { href: 'ziwei-geju-jiliang-tonggong.html', text: 'Ji Liang Tong Gong' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-jiliang-tonggong',
    cnTitle: '紫微斗数机梁同宫格：天机天梁同坐，善谋善断的军师型格局',
    enTitle: 'Ji Liang Tong Gong: Tian Ji and Tian Liang Together — The Strategist-Advisor Pattern',
    cnDesc: '机梁同宫是天机和天梁同坐一宫的格局，主智慧、谋略、善谏言。适合做军师、顾问、学者，但要防「善谋而不能断」和口舌是非。',
    enDesc: 'Ji Liang Tong Gong is when Tian Ji and Tian Liang share a palace, ruling wisdom, strategy, and skill in giving advice. Suited to strategist, advisor, scholar roles, but guard against "good at planning but bad at deciding" and verbal disputes.',
    cnLead: '机梁同宫是紫微斗数里最「军师」的格局。天机是智慧星，善谋划、善分析；天梁是荫星和寿星，主正直、善谏言、有长辈缘。两颗星同坐，就像诸葛亮加魏征——你既能出谋划策，又敢直言进谏。命宫有机梁同宫的人，特别适合做二号人物——给一把手当参谋，因为你看问题透彻，说话有分量，但自己当一把手可能反而不行。',
    cnIntro2: '机梁同宫的成格条件：天机和天梁同坐一宫（在辰宫或戌宫）。辰戌是天罗地网，机梁在这里主「善谋但需要突破」。这个格局跟机月同梁不同：机月同梁是天机太阴天梁三星会，更偏向幕僚和行政；机梁同宫是两颗星同坐，更偏向军师和顾问。',
    cnSections: [
      { h: '成格条件', ps: [
        '天机和天梁同坐辰宫或戌宫。',
        '命宫在辰或戌，机梁同守。',
        '加文昌文曲——谋略更有文采，适合做学术或写作。',
        '加化禄化权——谋略能得到重用和回报。',
        '加煞星——直言变成刻薄，谋略变成阴谋，容易得罪人。'
      ]},
      { h: '机梁同宫的优势', ps: [
        '洞察力强——天机善分析，天梁善总结，你能快速看透问题本质。',
        '善于谏言——天梁主正直，你敢说真话，而且说得有道理。',
        '长辈缘好——天梁是荫星，你容易得到长辈、上司、老师的赏识和帮助。',
        '适合做智囊——给领导当顾问、给企业做咨询，你的价值在于「出主意」。'
      ]},
      { h: '机梁同宫的陷阱', ps: [
        '善谋不善断——你能想出十个方案，但让你选一个，你可能犹豫半天。',
        '口舌是非——天梁主「说」，天机主「变」，你可能话说太多、说太直，得罪人。',
        '怀才不遇——辰戌宫有束缚感，你可能觉得自己的谋略没人听。',
        '适合当二把手——你出主意行，但自己拍板可能不行，因为你想太多。'
      ]},
      { h: '适合的职业', ps: [
        '顾问和咨询——管理咨询、法律咨询、心理咨询，你的分析和建议是核心。',
        '学术和研究——学者、研究员、分析师，天机的智慧加天梁的严谨。',
        '秘书和助理——给领导当参谋，机梁的人特别适合做「左右手」。',
        '媒体和评论——评论员、专栏作家，你的洞察力和表达力适合做内容。',
        '不适合做需要「快速决断」的一把手——你可能在关键时刻犹豫。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到机梁同宫，按这个顺序读：'], ol: [
        '先确认天机天梁在辰或戌同宫。',
        '看有没有昌曲——昌曲让谋略更有文采。',
        '看有没有化禄化权——禄权让谋略得到重用。',
        '看有没有煞星——煞星让直言变刻薄。',
        '机梁同宫的人要学会「谋而后断」——想清楚了就做决定，不要一直想。',
        '问自己：你最近是在「出主意」还是在「说闲话」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-geju-jiyue-tongliang.html', text: '机月同梁格' },
      { href: 'ziwei-tianji-zuoming.html', text: '天机坐命' },
      { href: 'ziwei-tianliang-zuoming.html', text: '天梁坐命' },
      { href: 'ziwei-geju-wuji-tonggong.html', text: '武机同宫格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Ji Liang Tong Gong is the most "strategist" pattern. Tian Ji is the wisdom star — good at planning and analysis; Tian Liang is the protection and longevity star — honest, good at remonstrance, favored by elders. Together they\'re like Zhuge Liang plus Wei Zheng — you can strategize and dare to speak truth to power. People with it are especially suited to being number two — advisor to the leader — because you see problems clearly and speak with weight, but being the top decision-maker yourself may not work.',
    enIntro2: 'Conditions: Tian Ji and Tian Liang sharing a palace (in Chen or Xu). Chen/Xu are heaven\'s net; Ji Liang here rules "good at planning but needing breakthrough." Unlike Ji Yue Tong Liang (Tian Ji, Tai Yin, Tian Liang meeting, more administrative), Ji Liang Tong Gong is two stars together, more strategist and advisor.',
    enSections: [
      { h: 'Conditions', ps: [
        'Tian Ji and Tian Liang sharing Chen or Xu palace.',
        'Life in Chen or Xu with both stars.',
        'With Wen Chang/Wen Qu — strategy with literary grace, suited to academia or writing.',
        'With Hua Lu/Hua Quan — strategy gets recognition and reward.',
        'With malefics — frankness becomes cruelty, strategy becomes scheming, easy to offend.'
      ]},
      { h: 'Advantages', ps: [
        'Strong insight — Tian Ji analyzes, Tian Liang synthesizes; quickly see the essence of problems.',
        'Good at remonstrance — Tian Liang is honest; you dare to tell truth, and make sense.',
        'Good with elders — Tian Liang is protection star; easily appreciated by elders, bosses, teachers.',
        'Suited to brain trust — advisor to leaders, consultant to enterprises; your value is in "ideas."'
      ]},
      { h: 'The Trap', ps: [
        'Good at planning, bad at deciding — can come up with ten options, but choosing one may take forever.',
        'Verbal disputes — Tian Liang rules "speaking," Tian Ji rules "changing"; may talk too much, too directly, offend people.',
        'Unrecognized talent — Chen/Xu positions feel constraining; may feel your strategies aren\'t heard.',
        'Suited to number two — good at giving ideas, but making the final call yourself may not work due to overthinking.'
      ]},
      { h: 'Suitable Careers', ps: [
        'Consulting — management, legal, psychological consulting; your analysis and advice are core.',
        'Academia and research — scholar, researcher, analyst; Tian Ji\'s wisdom plus Tian Liang\'s rigor.',
        'Secretary and assistant — strategist to leaders; Ji Liang people excel as "right hand."',
        'Media and commentary — commentator, columnist; your insight and expression suit content creation.',
        'Not suited to top roles requiring "quick decisions" — may hesitate at critical moments.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Ji Liang Tong Gong:'], ol: [
        'Confirm Tian Ji and Tian Liang in Chen or Xu.',
        'Check Chang/Qu — they add literary grace to strategy.',
        'Check Hua Lu/Hua Quan — they get strategy recognized.',
        'Check malefics — they turn frankness into cruelty.',
        'Learn "plan then decide" — once clear, make the call, don\'t keep thinking.',
        'Are you currently "giving ideas" or "gossiping"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-geju-jiyue-tongliang.html', text: 'Ji Yue Tong Liang' },
      { href: 'ziwei-tianji-zuoming.html', text: 'Tian Ji in Life' },
      { href: 'ziwei-tianliang-zuoming.html', text: 'Tian Liang in Life' },
      { href: 'ziwei-geju-wuji-tonggong.html', text: 'Wu Ji Tong Gong' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-tianji-huaji',
    cnTitle: '紫微斗数天机化忌格：智慧受阻，反而是深度思考的机会',
    enTitle: 'Tian Ji Hua Ji: Wisdom Blocked — An Opportunity for Deep Thinking',
    cnDesc: '天机化忌是天机星遇化忌的格局，主思维受阻、计划多变、焦虑失眠。但化忌不是毁灭，而是让你从「想得多」变成「想得深」。',
    enDesc: 'Tian Ji Hua Ji is when Tian Ji meets Hua Ji, ruling blocked thinking, changing plans, anxiety and insomnia. But Hua Ji isn\'t destruction — it transforms "thinking a lot" into "thinking deeply."',
    cnLead: '天机化忌是紫微斗数里最「累脑」的格局之一。天机是智慧星，主思考、谋划、变动；化忌是阻滞星，主阻碍、纠结、反复。天机遇到化忌，就像一台高速运转的电脑突然中了病毒——你不是不聪明，而是脑子停不下来，想太多、想太细、想到失眠。命宫有天机化忌的人，一辈子都在跟自己的脑子较劲，但较劲的结果可能是比别人想得更深。',
    cnIntro2: '天机化忌的成格条件：天机星在命宫或三方，且遇化忌。化忌让天机的「善变」变成「反复」，让天机的「善谋」变成「多虑」。这个格局跟天机化禄相反：天机化禄是「越想越顺」，天机化忌是「越想越乱」。但乱到极致可能反而通透——因为你把所有可能性都想过了。',
    cnSections: [
      { h: '成格条件', ps: [
        '天机在命宫或三方四正。',
        '天机遇化忌（生年化忌或大限流年化忌）。',
        '生年化忌影响一生，大限流年化忌只影响那段时间。',
        '加煞星——焦虑更严重，可能有神经衰弱或抑郁倾向。',
        '加吉星（昌曲、魁钺）——能把多虑转化为深度思考。'
      ]},
      { h: '天机化忌的表现', ps: [
        '想太多——一件事翻来覆去想，别人都忘了你还在琢磨。',
        '计划多变——早上定的计划下午就改，自己也烦自己。',
        '焦虑失眠——脑子停不下来，晚上躺在床上还在想事情。',
        '钻牛角尖——容易在细节上纠结，看不到大局。'
      ]},
      { h: '化忌不是坏事', ps: [
        '深度思考——天机化忌的人虽然想得多，但想得深，能看到别人看不到的细节。',
        '适合做研究——在学术、技术、分析领域，你的「钻牛角尖」是优势。',
        '危机意识——你总能提前想到风险，适合做风控和安全。',
        '化忌是「磨」——把你的思维磨得更锋利，只是过程比较痛苦。'
      ]},
      { h: '怎么应对', ps: [
        '写下来——把想的东西写在纸上，脑子就空了，不要在脑子里反复转。',
        '定截止时间——给自己一个「想的截止时间」，到点就做决定，不管想没想完。',
        '运动——天机化忌的人需要身体疲劳来让脑子休息，跑步、游泳、健身都有效。',
        '不要熬夜——越晚脑子越兴奋，形成恶性循环。',
        '找个「想得少」的朋友——让他们帮你做决定，你负责分析就好。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天机化忌，按这个顺序读：'], ol: [
        '先确认是生年化忌还是大限流年化忌——生年影响一生，大限只影响十年。',
        '看天机在哪个宫——命宫影响性格，官禄宫影响事业，夫妻宫影响感情。',
        '看有没有煞星——煞星加重焦虑和失眠。',
        '看有没有吉星——吉星把多虑转化为深度。',
        '天机化忌的人要学会「放下」——有些事想不明白就先放一放，答案可能自己出来。',
        '问自己：你最近的「思考」是在「解决问题」还是在「制造焦虑」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-tianji-zuoming.html', text: '天机坐命' },
      { href: 'ziwei-huaji.html', text: '化忌星详解' },
      { href: 'ziwei-geju-jiliang-tonggong.html', text: '机梁同宫格' },
      { href: 'ziwei-geju-wuji-tonggong.html', text: '武机同宫格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian Ji Hua Ji is one of the most "brain-tiring" patterns. Tian Ji is the wisdom star — thinking, planning, change; Hua Ji is obstruction — blocking, entanglement, repetition. Tian Ji meeting Hua Ji is like a high-speed computer catching a virus — you\'re not unintelligent, but your brain won\'t stop: overthinking, over-detailing, thinking until insomnia. People with it wrestle with their own minds lifelong, but the result may be thinking deeper than others.',
    enIntro2: 'Conditions: Tian Ji in Life or triple direction, meeting Hua Ji (natal or major/annual cycle). Hua Ji turns Tian Ji\'s "adaptability" into "indecision," its "strategy" into "over-worry." Unlike Tian Ji Hua Lu ("thinking gets smoother"), Tian Ji Hua Ji is "thinking gets messier." But extreme mess may lead to clarity — because you\'ve considered every possibility.',
    enSections: [
      { h: 'Conditions', ps: [
        'Tian Ji in Life or triple direction.',
        'Tian Ji meets Hua Ji (natal or cycle-based).',
        'Natal Hua Ji affects lifelong; cycle-based only affects that period.',
        'With malefics — more severe anxiety, possible nervous exhaustion or depression.',
        'With auspicious stars (Chang/Qu, Kui/Yue) — transform over-worry into deep thinking.'
      ]},
      { h: 'Manifestations', ps: [
        'Overthinking — turning one thing over and over; others have forgotten, you\'re still pondering.',
        'Changing plans — plan made in morning changed by afternoon; even you\'re annoyed at yourself.',
        'Anxiety and insomnia — brain won\'t stop, lying in bed at night still thinking.',
        'Getting stuck on details — easily fixate on details, miss the big picture.'
      ]},
      { h: 'Hua Ji Isn\'t All Bad', ps: [
        'Deep thinking — although you think a lot, you think deeply, seeing details others miss.',
        'Suited to research — in academia, tech, analysis, your "getting stuck" is an advantage.',
        'Crisis awareness — always anticipate risks early, suited to risk control and security.',
        'Hua Ji is "polishing" — sharpening your thinking, just the process is painful.'
      ]},
      { h: 'How to Cope', ps: [
        'Write it down — put thoughts on paper, the brain empties; don\'t keep spinning in your head.',
        'Set deadlines — give yourself a "thinking deadline," decide when time\'s up whether done or not.',
        'Exercise — Tian Ji Hua Ji people need physical fatigue to rest the brain; running, swimming, gym work.',
        'Don\'t stay up late — later at night the brain gets more excited, creating a vicious cycle.',
        'Find a "simple-thinking" friend — let them help you decide; you handle the analysis.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tian Ji Hua Ji:'], ol: [
        'Confirm natal or cycle Hua Ji — natal affects lifelong, cycle only ten years.',
        'Which palace is Tian Ji in — Life = character, Career = work, Spouse = relationships.',
        'Check malefics — they worsen anxiety and insomnia.',
        'Check auspicious stars — they transform over-worry into depth.',
        'Learn to "let go" — some things, if you can\'t figure them out, set them aside; answers may come on their own.',
        'Is your recent "thinking" solving problems or creating anxiety?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-tianji-zuoming.html', text: 'Tian Ji in Life' },
      { href: 'ziwei-huaji.html', text: 'Hua Ji Explained' },
      { href: 'ziwei-geju-jiliang-tonggong.html', text: 'Ji Liang Tong Gong' },
      { href: 'ziwei-geju-wuji-tonggong.html', text: 'Wu Ji Tong Gong' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-wuqu-huaji',
    cnTitle: '紫微斗数武曲化忌格：财星受阻，是破财还是理财的契机',
    enTitle: 'Wu Qu Hua Ji: Wealth Star Blocked — Financial Loss or a Chance to Manage Better',
    cnDesc: '武曲化忌是武曲星遇化忌的格局，主财运受阻、破财、财务压力。但化忌也让你从「会赚钱」变成「会管钱」，是理财能力的磨刀石。',
    enDesc: 'Wu Qu Hua Ji is when Wu Qu meets Hua Ji, ruling blocked wealth, financial loss, and money pressure. But Hua Ji also transforms you from "good at earning" to "good at managing" — a sharpening stone for financial skills.',
    cnLead: '武曲化忌是紫微斗数里最「心疼」的格局之一。武曲是正财星，主赚钱、理财、实际利益；化忌是阻滞星，主损失、阻碍、反复。武曲遇到化忌，就像一个印钞机突然卡纸了——你不是不会赚钱，而是钱来了又走，存不住、留不下。命宫有武曲化忌的人，年轻时可能经历过破财、投资失败、被人欠钱，但这些经历最终会让你成为最会管钱的人。',
    cnIntro2: '武曲化忌的成格条件：武曲星在命宫或三方，且遇化忌。化忌让武曲的「果断」变成「冲动」，让武曲的「重利」变成「贪利受损」。这个格局跟武曲化禄相反：武曲化禄是「钱越赚越多」，武曲化忌是「钱越管越少」。但少到极致你会开始反思——反思之后就是真正的理财能力。',
    cnSections: [
      { h: '成格条件', ps: [
        '武曲在命宫或三方四正。',
        '武曲遇化忌（生年化忌或大限流年化忌）。',
        '生年化忌影响一生的财运模式，大限流年化忌只影响那段时间。',
        '加煞星——破财更严重，可能有诈骗、盗窃、投资暴雷。',
        '加吉星（禄存、化禄、天魁天钺）——能减轻损失，或破财后有贵人相助。'
      ]},
      { h: '武曲化忌的表现', ps: [
        '破财——投资失败、被人欠钱、意外支出、钱存不住。',
        '财务压力——总是觉得钱不够用，或者刚赚到就花掉了。',
        '冲动消费——武曲的果断加化忌的阻滞，可能一时冲动买了不该买的东西。',
        '因财起纠纷——可能跟合伙人、家人、朋友因为钱闹矛盾。'
      ]},
      { h: '化忌是理财课', ps: [
        '交学费——武曲化忌的人年轻时大概率会在钱上「交学费」，但交完学费你就懂了。',
        '风险意识——你比别人更懂「投资有风险」，因为你真的亏过。',
        '适合做风控——亏过钱的人最懂怎么防风险，适合做财务、审计、风控。',
        '大器晚成——武曲化忌的人财运往往中年后好转，因为你终于学会了怎么管钱。'
      ]},
      { h: '怎么应对', ps: [
        '不碰高风险投资——股票、期货、加密货币，这些对你来说是「送钱」。',
        '不替人担保——武曲化忌的人最容易因为担保破财。',
        '强制储蓄——每个月工资到账先存30%，剩下的再花，不要反过来。',
        '买保险——武曲化忌主意外支出，保险是最好的对冲。',
        '找个会管钱的伴侣——你的另一半如果财运好，可以互补。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到武曲化忌，按这个顺序读：'], ol: [
        '先确认是生年化忌还是大限流年化忌。',
        '看武曲在哪个宫——命宫影响整体财运，财帛宫影响赚钱方式，官禄宫影响事业收入。',
        '看有没有煞星——煞星加重破财。',
        '看有没有禄存化禄——禄存化禄能对冲化忌的损失。',
        '武曲化忌的人要记住「慢就是快」——不要急着赚钱，先学会不亏钱。',
        '问自己：你最近的财务决策是「经过思考」还是「一时冲动」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-wuqu-zuoming.html', text: '武曲坐命' },
      { href: 'ziwei-huaji.html', text: '化忌星详解' },
      { href: 'ziwei-hualu.html', text: '化禄星详解' },
      { href: 'ziwei-geju-wutan.html', text: '武贪格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Wu Qu Hua Ji is one of the most "painful" patterns. Wu Qu is the primary wealth star — earning, managing money, practical benefits; Hua Ji is obstruction — loss, hindrance, repetition. Wu Qu meeting Hua Ji is like a money printer jamming — you\'re not bad at earning, but money comes and goes, can\'t save or keep it. People with it may experience financial loss, failed investments, unpaid debts when young, but these experiences ultimately make you the best at managing money.',
    enIntro2: 'Conditions: Wu Qu in Life or triple direction, meeting Hua Ji. Hua Ji turns Wu Qu\'s "decisiveness" into "impulsiveness," its "profit focus" into "loss through greed." Unlike Wu Qu Hua Lu ("more and more money"), Wu Qu Hua Ji is "less and less through management." But at the extreme of loss, you start reflecting — and after reflection comes real financial skill.',
    enSections: [
      { h: 'Conditions', ps: [
        'Wu Qu in Life or triple direction.',
        'Wu Qu meets Hua Ji (natal or cycle-based).',
        'Natal affects lifelong financial patterns; cycle-based only that period.',
        'With malefics — more severe loss, possible fraud, theft, investment collapse.',
        'With auspicious stars (Lu Cun, Hua Lu, Kui/Yue) — reduce losses, or benefactors help after loss.'
      ]},
      { h: 'Manifestations', ps: [
        'Financial loss — failed investments, unpaid debts, unexpected expenses, can\'t save.',
        'Financial pressure — always feel money isn\'t enough, or earn then immediately spend.',
        'Impulse spending — Wu Qu\'s decisiveness plus Hua Ji\'s obstruction; may impulsively buy unnecessary things.',
        'Disputes over money — conflicts with partners, family, friends because of money.'
      ]},
      { h: 'Hua Ji Is a Finance Course', ps: [
        'Paying tuition — Wu Qu Hua Ji people likely "pay tuition" on money when young, but after paying, you understand.',
        'Risk awareness — you understand "investment has risk" better than anyone because you\'ve actually lost.',
        'Suited to risk control — those who\'ve lost money know best how to prevent it; suited to finance, audit, risk control.',
        'Late bloomer — wealth often improves after middle age, because you finally learn how to manage money.'
      ]},
      { h: 'How to Cope', ps: [
        'Avoid high-risk investments — stocks, futures, crypto are "giving money away" for you.',
        'Never co-sign or guarantee — Wu Qu Hua Ji people most often lose money through guarantees.',
        'Force savings — save 30% of salary first upon receipt, then spend the rest; not the reverse.',
        'Buy insurance — Wu Qu Hua Ji rules unexpected expenses; insurance is the best hedge.',
        'Find a money-savvy partner — if your spouse has good wealth luck, you complement each other.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Wu Qu Hua Ji:'], ol: [
        'Confirm natal or cycle Hua Ji.',
        'Which palace is Wu Qu in — Life = overall wealth, Wealth = earning style, Career = work income.',
        'Check malefics — they worsen financial loss.',
        'Check Lu Cun/Hua Lu — they offset Hua Ji\'s losses.',
        'Remember "slow is fast" — don\'t rush to earn; first learn not to lose.',
        'Are your recent financial decisions "thought through" or "impulsive"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-wuqu-zuoming.html', text: 'Wu Qu in Life' },
      { href: 'ziwei-huaji.html', text: 'Hua Ji Explained' },
      { href: 'ziwei-hualu.html', text: 'Hua Lu Explained' },
      { href: 'ziwei-geju-wutan.html', text: 'Wu Tan Pattern' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-taiyang-huaji',
    cnTitle: '紫微斗数太阳化忌格：光明受阻，是怀才不遇还是自我修炼',
    enTitle: 'Tai Yang Hua Ji: Light Blocked — Unrecognized Talent or Self-Cultivation',
    cnDesc: '太阳化忌是太阳星遇化忌的格局，主事业受阻、怀才不遇、男性长辈问题。但化忌也让你从「外放」变成「内敛」，是沉淀和修炼的机会。',
    enDesc: 'Tai Yang Hua Ji is when Tai Yang meets Hua Ji, ruling career obstruction, unrecognized talent, and issues with male elders. But Hua Ji also transforms you from "outward" to "inward" — an opportunity for沉淀 and cultivation.',
    cnLead: '太阳化忌是紫微斗数里最「憋屈」的格局之一。太阳是光明星，主事业、名声、男性、外放；化忌是阻滞星，主阻碍、是非、反复。太阳遇到化忌，就像太阳被乌云遮住了——你不是没有光，而是光照不出去。命宫有太阳化忌的人，年轻时可能觉得自己怀才不遇、努力没人看见、付出没有回报，但这些经历会让你学会「不需要别人认可也能发光」。',
    cnIntro2: '太阳化忌的成格条件：太阳星在命宫或三方，且遇化忌。化忌让太阳的「光明」变成「刺眼」，让太阳的「外放」变成「招是非」。这个格局跟太阳化禄相反：太阳化禄是「越发光越受人爱戴」，太阳化忌是「越发光越有人嫉妒」。但嫉妒到极致你会学会收敛——收敛之后是真正的强大。',
    cnSections: [
      { h: '成格条件', ps: [
        '太阳在命宫或三方四正。',
        '太阳遇化忌（生年化忌或大限流年化忌）。',
        '太阳在落陷宫（戌亥子丑）遇化忌，力量最强；在庙旺宫（卯辰巳午）遇化忌，力量较弱。',
        '加煞星——是非更多，可能有官非或职场斗争。',
        '加吉星（禄存、化禄、天魁天钺）——能减轻阻滞，或有贵人相助。'
      ]},
      { h: '太阳化忌的表现', ps: [
        '怀才不遇——你有能力但没机会，或者做了很多但没人看见。',
        '职场是非——太阳主名声，化忌主是非，容易在工作中被人嫉妒、陷害。',
        '男性长辈问题——可能跟父亲、上司、老师关系不好，或他们健康有问题。',
        '眼目和心血管——太阳主眼睛和心脏，化忌可能有近视、眼疾、高血压。'
      ]},
      { h: '化忌是修炼', ps: [
        '学会内敛——太阳化忌的人年轻时喜欢表现，但越表现越招是非，后来学会了低调。',
        '厚积薄发——光被遮住的时候正好积累，等云散了你的光会更亮。',
        '适合做幕后——太阳化忌不适合做台前，适合做幕后策划、技术、研究。',
        '大器晚成——太阳化忌的人往往中年后转运，因为你终于学会了怎么发光不刺眼。'
      ]},
      { h: '怎么应对', ps: [
        '低调——不要抢风头，不要在公开场合表现自己，做幕后英雄。',
        '跟男性长辈搞好关系——太阳化忌的人容易跟父亲、上司闹矛盾，要主动沟通。',
        '注意眼睛和心脏——定期体检，不要熬夜，不要过度用眼。',
        '不要太在意别人的评价——太阳化忌的人最容易因为别人的否定而受伤，要学会自我肯定。',
        '找个太阴型的伴侣——太阴的内敛和温柔能平衡太阳的外放。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到太阳化忌，按这个顺序读：'], ol: [
        '先确认太阳在哪个宫——庙旺还是落陷，落陷化忌力量更强。',
        '看是生年化忌还是大限流年化忌。',
        '看有没有煞星——煞星加重是非和阻滞。',
        '看有没有吉星——吉星减轻阻碍。',
        '太阳化忌的人要记住「是金子总会发光」——但发光之前要先学会忍耐。',
        '问自己：你最近的「努力」是在「做事」还是在「求认可」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-taiyang-zuoming.html', text: '太阳坐命' },
      { href: 'ziwei-huaji.html', text: '化忌星详解' },
      { href: 'ziwei-geju-riyue-fanbei.html', text: '日月反背格' },
      { href: 'ziwei-geju-riyue-bingming.html', text: '日月并明格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tai Yang Hua Ji is one of the most "frustrating" patterns. Tai Yang is the light star — career, reputation, masculinity, outward expression; Hua Ji is obstruction — hindrance, trouble, repetition. Tai Yang meeting Hua Ji is like the sun covered by clouds — you have light, but it can\'t shine out. People with it may feel unrecognized when young, efforts unseen,付出 unrewarded, but these experiences teach you to "shine without needing others\' approval."',
    enIntro2: 'Conditions: Tai Yang in Life or triple direction, meeting Hua Ji. Hua Ji turns Tai Yang\'s "light" into "glare," its "outwardness" into "attracting trouble." Unlike Tai Yang Hua Lu ("the more you shine, the more loved"), Tai Yang Hua Ji is "the more you shine, the more envied." But at the extreme of envy, you learn restraint — and after restraint comes true strength.',
    enSections: [
      { h: 'Conditions', ps: [
        'Tai Yang in Life or triple direction.',
        'Tai Yang meets Hua Ji (natal or cycle-based).',
        'Tai Yang in fallen positions (Xu/Hai/Zi/Chou) with Hua Ji is strongest; in temple/prosperous (Mao/Chen/Si/Wu) is weaker.',
        'With malefics — more trouble, possible legal or workplace disputes.',
        'With auspicious stars (Lu Cun, Hua Lu, Kui/Yue) — reduce obstruction, or benefactors help.'
      ]},
      { h: 'Manifestations', ps: [
        'Unrecognized talent — ability but no opportunity, or doing much but no one sees.',
        'Workplace trouble — Tai Yang rules reputation, Hua Ji rules disputes; easily envied and framed at work.',
        'Male elder issues — poor relations with father, boss, teacher, or their health problems.',
        'Eyes and cardiovascular — Tai Yang rules eyes and heart; Hua Ji may bring myopia, eye disease, high blood pressure.'
      ]},
      { h: 'Hua Ji Is Cultivation', ps: [
        'Learn restraint — Tai Yang Hua Ji people like to perform when young, but the more they perform the more trouble; later they learn低调.',
        'Accumulate then release — when light is blocked, accumulate; when clouds part, your light shines brighter.',
        'Suited to behind-the-scenes — not suited to the spotlight; suited to behind-the-scenes planning, tech, research.',
        'Late bloomer — fortune often turns after middle age, because you finally learn how to shine without glaring.'
      ]},
      { h: 'How to Cope', ps: [
        'Stay low-key — don\'t grab the spotlight, don\'t perform publicly; be the hero behind the scenes.',
        'Get along with male elders — easily conflict with father/boss; communicate proactively.',
        'Watch eyes and heart — regular checkups, don\'t stay up late, don\'t overuse eyes.',
        'Don\'t care too much about others\' evaluation — most easily hurt by others\'否定; learn self-affirmation.',
        'Find a Tai Yin-type partner — Tai Yin\'s restraint and gentleness balance Tai Yang\'s outwardness.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tai Yang Hua Ji:'], ol: [
        'Confirm which palace Tai Yang is in — temple/prosperous or fallen; fallen Hua Ji is stronger.',
        'Check natal or cycle Hua Ji.',
        'Check malefics — they worsen trouble and obstruction.',
        'Check auspicious stars — they reduce hindrance.',
        'Remember "gold will eventually shine" — but before shining, first learn patience.',
        'Is your recent "effort" about "doing the work" or "seeking recognition"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-taiyang-zuoming.html', text: 'Tai Yang in Life' },
      { href: 'ziwei-huaji.html', text: 'Hua Ji Explained' },
      { href: 'ziwei-geju-riyue-fanbei.html', text: 'Ri Yue Fan Bei' },
      { href: 'ziwei-geju-riyue-bingming.html', text: 'Ri Yue Bing Ming' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  }
];

function buildHTML(a, isEn) {
  const catPage = 'ziwei-case-patterns.html';
  const cnCatName = '格局命例';
  const enCatName = 'Case Patterns';
  const cnTag = '格局命例';
  const enTag = 'Patterns';
  const sections = isEn ? a.enSections : a.cnSections;
  const sidebar = isEn ? a.enSidebar : a.cnSidebar;
  const lead = isEn ? a.enLead : a.cnLead;
  const intro2 = isEn ? a.enIntro2 : a.cnIntro2;
  const title = isEn ? a.enTitle : a.cnTitle;
  const desc = isEn ? a.enDesc : a.cnDesc;

  let sectionsHtml = '';
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    sectionsHtml += `\n        <h2 id="section-${i + 1}">${s.h}</h2>\n`;
    for (const p of s.ps) sectionsHtml += `        <p>${p}</p>\n`;
    if (s.ol) {
      sectionsHtml += '        <ol>\n';
      for (const item of s.ol) sectionsHtml += `          <li>${item}</li>\n`;
      sectionsHtml += '        </ol>\n';
    }
  }
  let sidebarHtml = '';
  for (const link of sidebar) sidebarHtml += `        <a class="card-link" href="${link.href}">${link.text}</a>\n`;

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
  "about": ["Zi Wei Dou Shu", "Case Patterns", "${jstr(title)}"],
  "author": {"@type": "Organization", "name": "YuetianAI"},
  "publisher": {"@type": "Organization", "name": "YuetianAI"},
  "mainEntityOfPage": "https://yuetianai.com/articles/en/${a.slug}.html"
}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../../index.html" aria-label="YuetianAI Home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a>
      <nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${a.slug}.html">Chinese</a></nav>
    </div>
  </header>
  <main class="article-shell article-detail">
    <section class="detail-hero">
      <div class="container detail-hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${enCatName}</span></nav>
          <h1>${title}</h1>
          <p class="detail-subtitle">${desc}</p>
          <p class="article-meta"><span>${enTag}</span><span><time datetime="${date}">2026-08-19 12:05</time></span></p>
        </div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="Article navigation">
        <h2>Read Next</h2>
${sidebarHtml}      </aside>
    </div>
    <div class="container article-bottom-link">
      <span>After reading, compare it with your own chart \u2014 it makes more sense than concepts alone.</span>
      <a href="../../pages/mingbook-onepage.html">Quick Chart →</a>
    </div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">Yue ICP 2026055337-1</a>　<span>© 2026 YuetianAI. All Rights Reserved. Powered By Yuetian Studio</span>　</div></footer>
</body>
</html>`;
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
  "articleSection": "格局命例",
  "about": ["紫微斗数", "格局命例", "${jstr(title)}"],
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
    {"@type": "ListItem", "position": 3, "name": "${cnCatName}", "item": "https://yuetianai.com/articles/${catPage}"},
    {"@type": "ListItem", "position": 4, "name": "${jstr(title)}", "item": "https://yuetianai.com/articles/${a.slug}.html"}
  ]
}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a>
      <nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${a.slug}.html">English</a></nav>
    </div>
  </header>
  <main class="article-shell article-detail">
    <section class="detail-hero">
      <div class="container detail-hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="${catPage}">${cnCatName}</a></nav>
          <h1>${title}</h1>
          <p class="detail-subtitle">${desc}</p>
          <p class="article-meta"><span>${cnTag}</span><span><time datetime="${date}">2026-08-19 12:05</time></span></p>
        </div>
        <div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${lead}</p>
        <p>${intro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="本文导航">
        <h2>继续阅读</h2>
${sidebarHtml}      </aside>
    </div>
    <div class="container article-bottom-link">
      <span>读完这篇，回到自己的命盘上对照一遍，会比只看概念更清楚。</span>
      <a href="../pages/mingbook-onepage.html">快速排盘 →</a>
    </div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 阅天AI Copyright, All Rights Reserved. Powered By 阅天工作室</span>　</div></footer>
</body>
</html>`;
}

for (const a of articles) {
  fs.writeFileSync(path.join(__dirname, 'articles', `${a.slug}.html`), buildHTML(a, false).replace(/\r\n/g, '\n'), 'utf8');
  fs.writeFileSync(path.join(__dirname, 'articles', 'en', `${a.slug}.html`), buildHTML(a, true).replace(/\r\n/g, '\n'), 'utf8');
  console.log(`Created: ${a.slug}`);
}
