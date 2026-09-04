const fs = require('fs');
const path = require('path');

const date = '2026-08-12T10:30:00+08:00';
const dateShort = '2026-08-12';
const pubDate = 'Wed, 12 Aug 2026 02:30:00 +0000';

function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n'); }

const articles = [
  {
    slug: 'ziwei-liunian-fumugong-zhangbei-fangzi-shouxu',
    cnTitle: '紫微斗数流年走到父母宫，是长辈有事还是房子手续先动',
    enTitle: 'When the Annual Chart Lands on the Parents Palace: Elders or Paperwork?',
    cnDesc: '流年走到父母宫，很多人第一反应是担心父母身体。但父母宫不只看长辈，还看文书、契约、遗传和上司。同一步运，应在哪条线上，要分清楚。',
    enDesc: 'When the annual Life Palace lands on your natal Parents Palace, it can mean an elder issue, but it also rules documents, contracts, genetics, and bosses. Read the right line.',
    category: '大限流年',
    crumbName: '大限流年',
    crumbHref: 'ziwei-cycles.html',
    enSection: 'Zi Wei Dou Shu',
    cnLead: '流年命宫走到父母宫，是一个很容易读窄的位置。很多人一看到，第一反应就是「我爸妈是不是要出事」。但父母宫管的不只是父母——它还看文书契约、遗传体质、上司关系，甚至你和「权威」之间的互动。同一步运，应在哪条线上，星曜和四化会告诉你。',
    cnIntro2: '父母宫是一个「对外」的宫位：它在命宫的上方，代表你之上的人、你之外的规则。流年走到这里，通常意味着这一年「上面」有事——可能是长辈，可能是文件，可能是领导。先别急着往健康上想，把四条线分开读。',
    cnSections: [
      { h: '第一条线：长辈的事', ps: [
        '流年走到父母宫，最直接的应法是长辈有事。但「有事」不等于「有灾」——可能是父母需要你帮忙办手续、搬家、看医生，也可能是他们身体出了状况需要你照顾。',
        '怎么判断？看星曜。流年父母宫见化禄、天魁、天钺，多主长辈有喜事或有人帮；见化忌、擎羊、天月，才需要特别注意长辈健康。如果流年父母宫化忌又逢煞星，这一年要主动安排体检，不要等信号。',
        '举个确定的组合：流年父母宫见天梁化忌加天月，天梁是老人星，化忌是阻滞，天月是慢性病——这一年长辈身体容易出问题，尤其要注意旧疾复发。'
      ]},
      { h: '第二条线：文书和契约', ps: [
        '父母宫也叫「文书宫」。流年走到这里，可能是签合同、办房产证、申请贷款、考试报名、公证认证——凡是跟「纸面上的事」有关的，都归父母宫管。',
        '流年父母宫化禄或化科，文书顺利，签字痛快；化权，文件有力度但可能附带条件；化忌，文书卡住、条款有争议、审批拖延。如果化忌加陀罗，手续可能拖半年以上。',
        '举个组合：流年父母宫化忌加昌曲，昌曲是文书星，化忌是阻滞——这一年容易在合同细节、考试资格、证书办理上出问题，每份文件都要逐条看。'
      ]},
      { h: '第三条线：上司和权威', ps: [
        '父母宫也代表你的上司、老师、政府机关。流年走到这里，可能是换领导、上级检查、跟政府部门打交道，或者你跟「管你的人」之间有事发生。',
        '流年父母宫化权加左辅右弼，新领导有能力且带来团队；化禄加魁钺，上司赏识你；化忌加巨门，跟领导有口舌之争，或者上级政策对你不利。',
        '如果父母宫是空宫，必须借对宫疾厄宫的星曜和三方四正来读。空宫不代表没事——借过来的星曜决定了这一年「上面」的事以什么方式发生。'
      ]},
      { h: '流年引动的三种情况', ps: [
        '第一种：大限命宫走到父母宫。这十年你跟长辈、文书、上司的关系是主线。可能是照顾父母的十年，也可能是跟合同、资质、体制打交道的十年。',
        '第二种：流年化禄或化科飞入父母宫。这一年文书顺利、长辈有助、上司认可——适合签约、考证、申请、找领导谈事。',
        '第三种：流年化忌冲入父母宫。这一年长辈健康要盯、文书容易卡、跟上司有摩擦——重要文件留备份，跟领导沟通走书面，不要只靠口头。'
      ]},
      { h: '排盘后的使用顺序', ps: ['排盘看到流年走到父母宫，按这个顺序读：'], ol: [
        '先看流年父母宫有无主星，空宫就借对宫疾厄宫和三方四正。',
        '看四化：化禄化科主顺利，化权主压力和条件，化忌主阻滞。',
        '分四条线：长辈健康、文书契约、上司关系、遗传体质——看星曜判断应在哪条。',
        '检查煞星：擎羊主急病或外伤，陀罗主拖延，天月主慢性病。',
        '大限和流年分开看：大限定十年主线，流年定当年事件。',
        '化忌冲父母宫的年份，主动安排长辈体检，重要文件提前准备。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-cycles.html', text: '大限流年专题' },
      { href: 'ziwei-fumugong.html', text: '父母宫怎么看' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: '本宫没有主星怎么读' }
    ],
    enLead: 'When the annual Life Palace lands on your natal Parents Palace, many people immediately worry about their parents\' health. But this palace covers more than elders — it also rules documents, contracts, genetic health, bosses, and your relationship with authority. The same transit can show up on very different lines.',
    enIntro2: 'The Parents Palace sits above the Life Palace. It represents people above you and rules outside of you. When the annual chart brings focus here, something from above comes into play — a parent, a contract, a boss, or a government office. Don\'t jump to health; read the four lines separately.',
    enSections: [
      { h: 'Line One: Elder Matters', ps: [
        'The most direct reading is an elder-related event. But that doesn\'t mean disaster — it could be your parents needing help with paperwork, moving, or a doctor\'s visit.',
        'Check the stars. Hua Lu (Resource Star) or Tian Kui/Tian Yue (Benefactor Stars) here usually means good news or help for elders. Hua Ji (Obstacle Star) plus Qing Yang or Tian Yue (the Chronic Star) calls for attention to an elder\'s health.',
        'A specific combination: Tian Liang (the Elder Star) with Hua Ji and Tian Yue in the annual Parents Palace points to a chronic condition flaring in an older family member. Schedule checkups proactively.'
      ]},
      { h: 'Line Two: Documents and Contracts', ps: [
        'The Parents Palace is also the Documents Palace. This transit can bring contracts, property deeds, loan applications, exam registrations, or notarizations.',
        'Hua Lu or Hua Ke (Recognition Star) here means smooth paperwork. Hua Quan (Authority Star) means binding terms. Hua Ji means delays, disputes, or rejected applications. With Tuo Luo (Stagnation Star), paperwork can drag on for months.',
        'Hua Ji with Wen Chang/Wen Qu (Document Stars) is a clear signal: read every clause, double-check every form, and keep copies.'
      ]},
      { h: 'Line Three: Bosses and Authority', ps: [
        'This palace also represents your boss, teachers, and government offices. A transit here can mean a new manager, an audit, a regulatory matter, or friction with someone in charge.',
        'Hua Quan with Zuo Fu/You Bi (Assistant Stars) suggests a capable new leader who brings structure. Hua Ji with Ju Men (the Speaking Star) means arguments with authority or unfavorable policy changes.',
        'If the palace is empty, borrow the opposite Health Palace stars and the triple combination. An empty palace never means nothing happens.'
      ]},
      { h: 'Three Timing Triggers', ps: [
        'First: a ten-year cycle brings the Life Palace to the Parents Palace. For a decade, elders, documents, or authority figures are the main theme.',
        'Second: an annual Hua Lu or Hua Ke flies into the Parents Palace. This year paperwork flows, elders help, bosses approve — good for signing, certifying, and applying.',
        'Third: an annual Hua Ji opposes or enters the Parents Palace. This year: watch elder health, expect paperwork delays, and put everything with your boss in writing.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When the annual chart lands on the Parents Palace, read in this order:'], ol: [
        'Check whether the palace has main stars; if empty, borrow the opposite Health Palace and triple combination.',
        'Read the four transformations: Lu/Ke for smoothness, Quan for pressure, Ji for blockage.',
        'Separate the four lines: elder health, documents, bosses, genetic health.',
        'Check challenging stars: Qing Yang for acute issues, Tuo Luo for delays, Tian Yue for chronic conditions.',
        'Read the ten-year cycle and the annual chart separately.',
        'In a Hua Ji year, schedule elder checkups and prepare documents early.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-cycles.html', text: 'Cycles and Annual Charts' },
      { href: 'ziwei-fumugong.html', text: 'The Parents Palace' },
      { href: 'ziwei-jieegong.html', text: 'The Health Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' },
      { href: 'ziwei-sanfang-sizheng.html', text: 'Triple Combinations' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: 'Reading Empty Palaces' }
    ]
  },
  {
    slug: 'ziwei-fumu-gei-ziyuan-zong-ganyu',
    cnTitle: '紫微斗数父母愿意给资源却总干预：化禄、化权和巨门怎么分',
    enTitle: 'When Parents Give Resources but Can\'t Stop Interfering: Hua Lu, Hua Quan, and Ju Men',
    cnDesc: '父母宫化禄是给资源，化权是要控制，巨门是话多。三个东西混在一起，就是「钱给你了但你得听我的」。分开读，才知道怎么接。',
    enDesc: 'Hua Lu in the Parents Palace gives resources; Hua Quan brings control; Ju Men brings nonstop talk. Together they mean "I\'ll help you, but on my terms." Read them separately.',
    category: '宫位组合',
    crumbName: '十二宫位',
    crumbHref: 'ziwei-palaces.html',
    enSection: 'Zi Wei Dou Shu',
    cnLead: '有一种父母很典型：愿意给你钱、给你资源、帮你铺路，但什么都要管——工作要管、对象要管、买房子要管、连孩子怎么养都要管。这种盘在父母宫上通常能看到三个信号的组合：化禄、化权和巨门。禄是给，权是控，巨门是说。三样东西混在一起，就是「我给了你就得听我的」。',
    cnIntro2: '很多人把父母宫化禄一概读成「父母好」，把化权一概读成「父母凶」，把巨门一概读成「跟父母缘薄」。这样读太粗了。禄、权、巨门各管各的事，可能同时出现，也可能只出现一两个。分开读，你才知道父母给你的是什么、要的是什么、你们之间卡在哪里。',
    cnSections: [
      { h: '化禄：给你的是资源，不一定是理解', ps: [
        '父母宫化禄，最直接的意思是父母愿意给——给钱、给关系、给帮助。这是实实在在的资源，不是假的。但化禄给的是「物质和机会」，不自动等于「理解和尊重」。',
        '父母宫化禄的人，通常从小到大物质上不缺，父母也愿意在教育、买房、创业上出钱。但如果你期待的是情感上的支持——「爸妈，我想做我自己喜欢的事」——化禄不保证这个。禄给的是「我认为对你好的东西」，不一定是「你想要的东西」。',
        '如果父母宫化禄但三方见巨门或化忌，给资源的过程会伴随条件或情绪。不是不给，是给得让你不舒服。'
      ]},
      { h: '化权：要的是控制，不一定是恶意', ps: [
        '父母宫化权，父母在你的生活中存在感强、说话有分量。他们可能确实有能力、有见识，但也习惯了「我说了算」。化权不是坏——它代表父母有主见、有能力，但这个能力用在你身上，就是控制。',
        '化权在父母宫的人，从小到大家规严、父母说了算。大了以后，父母依然要干预你的选择——工作、婚姻、住处。他们的逻辑是「我吃过的盐比你吃过的米多」，而你的感受是「你到底信不信我能行」。',
        '如果命宫也强（命宫有化权或紫微天府），你会跟父母硬碰硬；如果命宫柔（天同、天梁），你可能一直忍着，直到某件事爆发。'
      ]},
      { h: '巨门：问题出在嘴上，不一定出在心上', ps: [
        '巨门是口舌星，在父母宫代表父母话多、爱念叨、沟通方式有问题。巨门不一定是坏心——很多巨门在父母宫的人，父母其实很关心，但说出来的话永远不好听。',
        '「你看看人家」「我早就说过」「你这样不行」——这些话是巨门的标配。巨门在父母宫，亲子之间最大的问题不是不爱，是不会说话。关心变成了指责，提醒变成了唠叨。',
        '举个确定的组合：父母宫太阳化禄加巨门。太阳是父亲，化禄是愿意给，巨门是嘴碎——父亲愿意为你花钱花关系，但永远在说教、在批评、在外人面前揭你短。资源是真的，难受也是真的。'
      ]},
      { h: '三者同宫：怎么接，怎么分', ps: [
        '父母宫化禄、化权、巨门三者会聚，是最典型的「资源型控制」父母。给钱、给房、给关系，但每一样都附带话语权。你接了资源，就要接受干预；你不接，他们觉得你不识好歹。',
        '怎么分？第一步，禄是资源，该接就接，但要分清「赠与」还是「投资」——赠与是你的，投资是要还的（不一定是还钱，可能是还听话）。第二步，权是边界，要谈——哪些事可以听他们的，哪些事你必须自己决定。第三步，巨门是噪音，要过滤——他们说的话，有用的听，没用的别往心里去。',
        '如果父母宫是空宫，借对宫疾厄宫和三方四正来读。空宫不代表父母不管——借过来的星曜会告诉你他们以什么方式管。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看父母宫有没有禄、权、巨门，按这个顺序读：'], ol: [
        '先看化禄：父母给不给资源？给的是什么（钱、关系、劳动）？',
        '再看化权：父母控不控制？控制的是哪些领域（工作、婚姻、生活）？',
        '看巨门：沟通方式有没有问题？是关心说不好听，还是纯粹的否定？',
        '看主星：太阳主父亲强势，太阴主母亲细腻但管得多，天梁主长辈式说教。',
        '对照命宫：你强就硬碰硬需要策略，你柔就容易被压住需要立边界。',
        '空宫借对宫疾厄宫，看遗传和相处模式。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-palaces.html', text: '十二宫位专题' },
      { href: 'ziwei-fumugong.html', text: '父母宫怎么看' },
      { href: 'ziwei-fumugong-hualu-jumen-geiqian-zhengzhi.html', text: '父母宫化禄见巨门' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: '本宫没有主星怎么读' }
    ],
    enLead: 'There is a classic pattern: parents who give you money, connections, and help — but want a say in everything. Your job, your partner, your apartment, even how you raise your kids. In Zi Wei Dou Shu, this usually shows as a combination of three signals in the Parents Palace: Hua Lu (resources), Hua Quan (control), and Ju Men (nonstop talk). They give, they control, and they lecture — all at once.',
    enIntro2: 'Don\'t read Hua Lu in the Parents Palace as simply "good parents" or Hua Quan as "strict parents." Each transformation does something different. They can appear together or separately. Read them one by one, and you\'ll see what your parents give, what they want, and where the friction really lives.',
    enSections: [
      { h: 'Hua Lu: Resources, Not Necessarily Understanding', ps: [
        'Hua Lu in the Parents Palace means your parents are willing to give — money, connections, help. These are real resources. But Hua Lu delivers material support and opportunity, not automatically emotional understanding.',
        'People with this placement often grew up financially comfortable. Their parents paid for education, housing, or business. But if what you crave is emotional support — "I want to do what I love" — Hua Lu doesn\'t guarantee that. What they give is what they think is good for you, not necessarily what you want.',
        'If Ju Men or Hua Ji appears in the triple combination, the resources come with strings or emotional weight.'
      ]},
      { h: 'Hua Quan: Control, Not Necessarily Malice', ps: [
        'Hua Quan here means strong parental presence. They may be genuinely capable and wise, but they are used to calling the shots. Hua Quan isn\'t evil — it means your parents have strong wills and ability — but directed at you, it becomes control.',
        'If your Life Palace is also strong (Hua Quan or Zi Wei/Tian Fu there), you clash directly. If your Life Palace is soft (Tian Tong or Tian Liang), you may absorb it until something erupts.'
      ]},
      { h: 'Ju Men: The Problem Is How They Talk, Not How They Feel', ps: [
        'Ju Men is the Speaking Star. In the Parents Palace it means parents talk a lot, nag, or communicate poorly. It doesn\'t mean they don\'t care — they often care deeply — but everything comes out wrong.',
        '"Why can\'t you be more like..." "I told you so" "That won\'t work" — these are Ju Men refrains. The biggest issue isn\'t lack of love; it\'s that care sounds like criticism.',
        'A specific combination: Tai Yang (Father Star) with Hua Lu and Ju Men in the Parents Palace. The father spends money and opens doors, but never stops lecturing or putting you down in front of others. The help is real; so is the discomfort.'
      ]},
      { h: 'All Three Together: How to Receive and How to Set Boundaries', ps: [
        'When Hua Lu, Hua Quan, and Ju Men gather, you get the classic "controlling provider" parent. Every gift comes with a vote in your life. Take the help and you accept interference; refuse it and you\'re ungrateful.',
        'How to handle it: First, receive the Lu (resources) but clarify whether it\'s a gift or an investment — investments get repaid, sometimes through compliance. Second, negotiate the Quan (control) — decide which decisions are theirs to weigh in on and which are yours. Third, filter the Ju Men (talk) — take what\'s useful and let the rest go.',
        'If the palace is empty, borrow the opposite Health Palace and triple combination. An empty palace doesn\'t mean hands-off parents.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['Check the Parents Palace for Lu, Quan, and Ju Men in this order:'], ol: [
        'Hua Lu: Do they give resources? What kind — money, connections, labor?',
        'Hua Quan: Do they control? Which areas — career, marriage, lifestyle?',
        'Ju Men: Is the communication problem — care expressed badly, or pure negativity?',
        'Main stars: Tai Yang = strong father; Tai Yin = attentive but controlling mother; Tian Liang = preachy elder.',
        'Compare with your Life Palace: strong you needs strategy; soft you needs boundaries.',
        'Empty palace: borrow the Health Palace for inherited patterns.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' },
      { href: 'ziwei-fumugong.html', text: 'The Parents Palace' },
      { href: 'ziwei-fumugong-hualu-jumen-geiqian-zhengzhi.html', text: 'Parents Palace Hua Lu + Ju Men' },
      { href: 'ziwei-minggong.html', text: 'The Life Palace' },
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: 'Reading Empty Palaces' }
    ]
  },
  {
    slug: 'ziwei-minggong-huaquan-zhujian-haishi-guquan',
    cnTitle: '紫微斗数命宫化权，到底是主见还是孤权：先看谁来承接你的决定',
    enTitle: 'Life Palace With Hua Quan: Conviction or Isolated Power?',
    cnDesc: '命宫化权的人有主见、有执行力。但主见和孤权是两回事——你的决定有人接、有人跟，那是主见；你说了没人听、什么都自己扛，那是孤权。区别在三方四正。',
    enDesc: 'Hua Quan in the Life Palace gives willpower and drive. But conviction differs from isolated power: people follow conviction; with isolated power you carry everything alone. Check the triple combination.',
    category: '四化细读',
    crumbName: '四化科权禄忌',
    crumbHref: 'ziwei-four-transformations.html',
    enSection: 'Zi Wei Dou Shu',
    cnLead: '命宫化权的人，通常给人一种「这个人很有主意」的感觉。他们果断、能扛事、不轻易改方向。但化权在命宫有两种完全不同的活法：一种是「主见」——你做了决定，有人跟、有人帮、事情推得动；另一种是「孤权」——你做了决定，没人听、没人接，什么都自己扛，越扛越累。区别不在化权本身，在三方四正有没有人来承接这个权。',
    cnIntro2: '化权是掌控星，也是执行星。它给你的是「我要说了算」的驱动力。但说了算需要两个条件：第一，你确实有能力；第二，有人愿意听。第一个条件化权自己给，第二个条件要看三方四正。这篇把命宫化权的几种组合拆开讲。',
    cnSections: [
      { h: '先看：你的权有没有人接', ps: [
        '命宫化权，第一步不是看你有多强，是看你的强有没有出口。三方四正见禄存或化禄，你的权能换来实际利益——说了能算，算了能成，成了有回报。这是「实权」。',
        '三方四正见左辅、右弼，你的决定有人执行——你拍板，有人干活。见天魁、天钺，关键时刻有人挺你。见文昌、文曲，你的想法能表达、能传播、能被理解。这些都是「有人接」的信号。',
        '反过来，命宫化权但三方四正不见禄、不见辅、不见魁钺，只有一堆煞星——那就是「孤权」。你确实有主意，但身边没人跟、没人帮，说了也白说，最后什么都自己来。紫微化权无左右，就是典型的「孤君在野」。'
      ]},
      { h: '化权加吉星：主见变成领导力', ps: [
        '命宫武曲化权加禄存，是「实干型掌权」。武曲是财星，化权是执行力，禄存是守成——这种人不光能做决定，还能把决定变成结果，结果还能守住。做生意、带团队、做管理都合适。',
        '命宫紫微化权加左右，是「领袖型主见」。紫微是帝王星，化权是掌控，左右是辅佐——有人帮你执行，你的权不是空的。但这种组合也要注意：紫微化权的人容易听不进意见，左右帮你做事但不代表帮你做判断。',
        '命宫太阳化权加魁钺，是「表现型主见」。太阳主发光，化权主主导，魁钺主人缘——这种人适合站在台前，靠个人魅力和能力带动别人。'
      ]},
      { h: '化权加煞星：主见变成固执', ps: [
        '命宫化权加擎羊、火星，脾气硬、性子急，做了决定十头牛拉不回来。擎羊是硬碰硬，火星是上来一阵——这种人容易在冲动时做决定，事后后悔但嘴上不认。',
        '命宫化权加地空、地劫，想法很大但落不了地。空劫是「有方向没抓手」——你可能确实看到了别人看不到的东西，但执行层面缺人缺钱缺资源，最后变成空想。',
        '命宫化权加陀罗，是「钻牛角尖型固执」。陀罗是原地打转——你认准了一件事就反复想、反复磨，别人劝不动，自己也走不出来。陀罗在命宫化权的人，最大的敌人不是别人，是自己的执念。'
      ]},
      { h: '流年引动：权在什么时候最管用', ps: [
        '第一种：大限命宫化权。这十年是你能说了算的十年——有职位、有资源、有机会主导。但要注意，这十年也容易独断，大限化权最怕听不进话。',
        '第二种：流年化权飞入命宫。这一年你有推动力，适合启动新项目、争取职位、做重大决定。但流年权是一年期的，今年能推动不代表明年还有这个势。',
        '第三种：流年化忌冲命宫。这一年你的权受到挑战——决定被推翻、权威被质疑、有人跟你对着干。这种年份不宜硬来，以退为进比硬碰硬有效。'
      ]},
      { h: '排盘后的使用顺序', ps: ['命宫看到化权，按这个顺序读：'], ol: [
        '先看是什么星化权——武曲主实干，紫微主领袖，太阳主表现，廉贞主强硬。',
        '看三方四正有没有禄存或化禄——有禄，权能变利；无禄，权是空心的。',
        '看左右、魁钺、昌曲——有人帮、有人挺、有人懂，主见才是领导力。',
        '检查擎羊、火星、空劫、陀罗——判断是果断还是固执，是远见还是空想。',
        '对照迁移宫（对宫）——你在外的表现和你内在的主见是否一致。',
        '大限流年分三种引动：大限权主十年主导，流年权主当年推动，流年忌冲主权势受挑战。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-minggong-huaquan-meiren-tixing.html', text: '命宫化权：没人提醒' },
      { href: 'ziwei-qianyigong-huaquan.html', text: '迁移宫化权' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Quan in the Life Palace come across as decisive. They make calls, carry weight, and don\'t easily change direction. But there are two very different versions of this placement. One is conviction — you decide, people follow, things move. The other is isolated power — you decide, nobody listens, you carry everything alone. The difference isn\'t Hua Quan itself; it\'s whether the triple combination brings people who can receive your authority.',
    enIntro2: 'Hua Quan is the star of control and execution. It gives you the drive to be in charge. But being in charge requires two things: ability, and people willing to follow. The first comes from Hua Quan. The second depends on the triple combination.',
    enSections: [
      { h: 'First Question: Does Anyone Receive Your Authority?', ps: [
        'Don\'t start with how strong you are. Start with whether your strength has an outlet. If Lu Cun or Hua Lu appears in the triple combination, your authority produces real results — you decide, it happens, and it pays off.',
        'Zuo Fu/You Bi mean people execute your decisions. Tian Kui/Tian Yue mean someone backs you at key moments. Wen Chang/Wen Qu mean your ideas can be articulated and understood. These are all signals that your power is received.',
        'Without Lu or assistants in the triple combination — only challenging stars — you get isolated power. You have opinions but no followers. Zi Wei with Hua Quan and no Zuo Fu/You Bi is the classic "lonely king."',
      ]},
      { h: 'With Supporting Stars: Conviction Becomes Leadership', ps: [
        'Wu Qu with Hua Quan plus Lu Cun is practical authority — you not only decide but deliver and preserve results. Strong in business and management.',
        'Zi Wei with Hua Quan plus Zuo Fu/You Bi is leadership with a team. But watch the tendency to stop listening.',
        'Tai Yang with Hua Quan plus Kui/Yue is front-facing charisma — you lead by visibility and personal drive.'
      ]},
      { h: 'With Challenging Stars: Conviction Hardens Into Stubbornness', ps: [
        'Hua Quan plus Qing Yang or Huo Xing makes someone impulsive and immovable once decided.',
        'Hua Quan plus Di Kong/Di Jie gives big vision but no landing — you see what others don\'t but lack resources to execute.',
        'Hua Quan plus Tuo Luo is obsessive looping — you fixate and can\'t let go. Your own执念, not other people, is the main obstacle.'
      ]},
      { h: 'Timing: When Your Authority Works Best', ps: [
        'A ten-year cycle bringing Hua Quan to the Life Palace gives you a decade in charge — but also a decade of risk if you stop listening.',
        'An annual Hua Quan flying into the Life Palace gives one year of momentum — good for launching, pitching, and deciding. It doesn\'t guarantee next year.',
        'An annual Hua Ji opposing the Life Palace challenges your authority. Don\'t force it; retreat and regroup beats head-on collision.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Quan in the Life Palace:'], ol: [
        'Which star transforms? Wu Qu = execution, Zi Wei = leadership, Tai Yang = visibility, Lian Zhen = toughness.',
        'Check for Lu Cun/Hua Lu in the triple combination — with Lu, power pays; without it, power is hollow.',
        'Check for Zuo You, Kui Yue, Chang Qu — followers, backers, communicators make conviction real.',
        'Check for Qing Yang, Huo Xing, Kong Jie, Tuo Luo — decisiveness vs. stubbornness, vision vs. fantasy.',
        'Compare with the Travel Palace opposite — does your outside match your inside?',
        'Three timing triggers: decade authority, annual momentum, annual challenge.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-minggong.html', text: 'The Life Palace' },
      { href: 'ziwei-minggong-huaquan-meiren-tixing.html', text: 'Life Palace Hua Quan: No One Warns You' },
      { href: 'ziwei-qianyigong-huaquan.html', text: 'Travel Palace Hua Quan' },
      { href: 'ziwei-sanfang-sizheng.html', text: 'Triple Combinations' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-fumugong-hualu-jumen-geiqian-zhengzhi',
    cnTitle: '紫微斗数父母宫化禄又见巨门，家里给钱为什么也伴随争执',
    enTitle: 'Parents Palace With Hua Lu and Ju Men: Why Money Comes With Arguments',
    cnDesc: '父母宫化禄是父母愿意给，巨门是口舌。两个在一起，就是「给是给，但话不会少」。给钱和争吵可以同时存在，因为禄和巨门各管各的。',
    enDesc: 'Hua Lu in the Parents Palace means parents give; Ju Men means arguing. Together: they help, but they won\'t stay quiet about it. Giving and conflict coexist because each star does its own job.',
    category: '四化细读',
    crumbName: '四化科权禄忌',
    crumbHref: 'ziwei-four-transformations.html',
    enSection: 'Zi Wei Dou Shu',
    cnLead: '有些人的父母很矛盾：钱给得痛快，话说得难听。买房时首付出了，但从签约到装修天天念你；创业时资金支持了，但每次见面都问「赚了没有」；帮你带孩子，但育儿方式不一样就吵。这种盘在父母宫上通常是化禄和巨门同宫或会照——禄是给，巨门是说，两件事同时发生。',
    cnIntro2: '很多人以为父母宫化禄就一定是母慈子孝、一团和气。不是的。化禄管的是「资源给不给」，巨门管的是「嘴巴不巴」。一个父母可以既出钱又唠叨，既帮你又否定你。禄和巨门不冲突，它们各干各的。读懂这一点，你就不会因为「他们嘴上不饶人」而否定「他们确实在帮你」，也不会因为「他们确实在帮你」就必须忍受那些难听话。',
    cnSections: [
      { h: '化禄和巨门各管各的', ps: [
        '化禄在父母宫，父母愿意在你身上投入资源——钱、时间、关系、劳动。这是实打实的付出，不是嘴上说说。巨门在父母宫，父母的沟通方式有问题——唠叨、抱怨、批评、翻旧账，或者什么都要管、什么都要念。',
        '这两个信号可以同时存在，而且经常同时存在。一个母亲可以一边给你带孩子、给你做饭、给你贴钱，一边天天念你「不会过日子」「找的什么工作」「孩子被你惯坏了」。她的付出是真的，她的嘴碎也是真的。',
        '读盘的时候要把这两件事分开：禄是禄，巨门是巨门。不要因为巨门就否定禄，也不要因为禄就忍受巨门。'
      ]},
      { h: '看主星：是谁在给，是谁在说', ps: [
        '父母宫太阳化禄加巨门，通常是父亲给钱但爱说教。太阳主父亲，化禄主付出，巨门主嘴——父亲可能承担了大部分经济支持，但他的方式是「我养了你你就得听我的」。这种父子/女关系，资源不缺，但尊严感经常被伤。',
        '父母宫天同化禄加巨门，通常是母亲照顾但爱抱怨。天同主享受和照顾，化禄主给予，巨门主唠叨——母亲把你的生活照顾得无微不至，但她的情绪也通过嘴巴全部倒给你。「我为你付出了这么多」是这种组合的口头禅。',
        '父母宫天机化禄加巨门，父母用智慧和信息帮你，但主意变得快、话说得多。天机是谋略星，化禄是给点子，巨门是讨论——他们可能确实给了你好建议，但同一个建议能说一百遍，而且每次说都加新的担忧。'
      ]},
      { h: '加煞星：给钱伴随的争执有多严重', ps: [
        '化禄加巨门再加擎羊，争执容易升级。擎羊是硬碰硬——父母说话难听，你也顶回去，一句话不对就吵翻。这种组合的亲子关系，给钱是真给，吵架也是真吵，而且吵起来什么都敢说。',
        '化禄加巨门再加陀罗，争执容易拖。陀罗是纠缠——一件事翻来覆去说，一个旧账能念十年。这种父母不是不给你钱，是给了钱之后要念到你觉得「还不如不要」。',
        '化禄加巨门但三方见化科，沟通中有缓和的余地。化科是名声和理性——虽然吵，但最终能坐下来谈，或者有第三方（亲戚、老师）从中调解。'
      ]},
      { h: '流年引动：什么时候给钱，什么时候吵', ps: [
        '第一种：大限父母宫化禄。这十年父母在资源上对你帮助大——可能是买房首付、创业资金、带孩子。但如果大限父母宫同时见巨门，这十年也是亲子摩擦最多的十年，帮你和念你同步进行。',
        '第二种：流年化禄飞入父母宫。这一年父母愿意给——可能是一笔钱、一个机会、一份帮助。但流年禄是一年期的，如果这一年父母宫同时见巨门或化忌，给钱的过程会伴随争执或条件。',
        '第三种：流年巨门化忌入父母宫。这一年口舌是非多——跟父母吵翻、父母之间吵架、或者因为父母的事跟外人有口舌。这种年份少争辩、多做事，道理讲不清的时候先冷处理。'
      ]},
      { h: '排盘后的使用顺序', ps: ['父母宫看到化禄和巨门，按这个顺序读：'], ol: [
        '先确认化禄：父母给的是什么资源？钱、时间、关系还是劳动？',
        '再确认巨门：沟通问题是什么类型？唠叨、批评、翻旧账还是控制？',
        '看主星判断是谁：太阳主父亲，太阴或天同主母亲，天机主主意多。',
        '看煞星判断严重程度：擎羊主激烈，陀罗主纠缠，化科主有缓。',
        '分清楚「给的」和「说的」——该接的资源接，该过滤的话过滤。',
        '流年分开看：禄入父母主受益年，巨门化忌入父母主口舌年。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-fumugong.html', text: '父母宫怎么看' },
      { href: 'ziwei-fumu-gei-ziyuan-zong-ganyu.html', text: '父母给资源却总干预' },
      { href: 'ziwei-fumugong-taiyin-huaji-muqin.html', text: '父母宫太阴化忌与母亲' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: '本宫没有主星怎么读' }
    ],
    enLead: 'Some parents are contradictory: generous with money, harsh with words. They cover your down payment but nag daily through the renovation. They fund your startup but ask "are you making money yet?" every visit. They help with the kids but fight over how to raise them. In the chart, this is usually Hua Lu and Ju Men together in the Parents Palace — Lu gives, Ju Men talks, and both happen at once.',
    enIntro2: 'Hua Lu governs whether resources flow. Ju Men governs how communication sounds. A parent can fund you and nag you in the same breath. These stars don\'t conflict; they each do their own job. Once you see that, you won\'t dismiss the help because of the words, and you won\'t accept abuse because of the help.',
    enSections: [
      { h: 'Each Star Does Its Own Job', ps: [
        'Hua Lu in the Parents Palace means parents invest resources — money, time, connections, labor. These are real contributions. Ju Men in the same palace means problematic communication — nagging, complaining, criticizing, rehashing old arguments.',
        'Both can and often do coexist. A mother can cook, clean, and subsidize you while telling you daily that you\'re doing it wrong. The help is real; the mouth is real too.',
        'Read them separately. Don\'t dismiss the Lu because of Ju Men, and don\'t tolerate Ju Men because of Lu.'
      ]},
      { h: 'Which Star Gives, Which Star Talks', ps: [
        'Tai Yang with Hua Lu and Ju Men usually means a father who funds but lectures. The money comes with "I raised you, so you listen to me."',
        'Tian Tong with Hua Lu and Ju Men usually means a mother who cares for everything but complains endlessly. "After all I\'ve done for you" is the refrain.',
        'Tian Ji with Hua Lu and Ju Men means parents help with advice and information but repeat it a hundred times with new worries each time.'
      ]},
      { h: 'With Challenging Stars: How Bad Do the Arguments Get?', ps: [
        'Add Qing Yang and arguments escalate fast — harsh words on both sides, things said that can\'t be unsaid.',
        'Add Tuo Luo and conflicts drag on — one grievance rehashed for a decade. The money comes with so much nagging you almost wish they hadn\'t given it.',
        'If Hua Ke appears in the triple combination, there\'s room to reason — fights happen but eventually you can talk, or a third party mediates.'
      ]},
      { h: 'Timing: When They Give, When They Argue', ps: [
        'A ten-year cycle with Hua Lu in the Parents Palace brings major financial or practical support — but with Ju Men present, it\'s also the decade of maximum friction.',
        'An annual Hua Lu flying into the Parents Palace brings a year of giving — money, opportunity, help. If Ju Men or Hua Ji is also present, it comes with arguments or strings.',
        'An annual Ju Men Hua Ji entering the Parents Palace brings a year of verbal conflict — fights with parents, parents fighting each other, or disputes involving parents. Stay quiet, let things cool.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Lu and Ju Men in the Parents Palace:'], ol: [
        'Confirm the Lu: what resource do they give — money, time, connections, labor?',
        'Confirm Ju Men: what kind of communication problem — nagging, criticism, old grudges, control?',
        'Check main stars: Tai Yang = father, Tai Yin/Tian Tong = mother, Tian Ji = over-advising.',
        'Check challenging stars: Qing Yang = explosive, Tuo Luo = dragging, Hua Ke = reconcilable.',
        'Separate what they give from what they say — receive the resource, filter the noise.',
        'Timing: Lu year = receive; Ju Men Hua Ji year = keep quiet.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-fumugong.html', text: 'The Parents Palace' },
      { href: 'ziwei-fumu-gei-ziyuan-zong-ganyu.html', text: 'Parents Who Give but Interfere' },
      { href: 'ziwei-fumugong-taiyin-huaji-muqin.html', text: 'Parents Palace Tai Yin Hua Ji' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: 'Reading Empty Palaces' }
    ]
  },
  {
    slug: 'ziwei-pojun-caibo-guanlu-bianjuqian',
    cnTitle: '紫微斗数破军在财帛和官禄，赚的是变局钱还是重整钱',
    enTitle: 'Po Jun in Wealth or Career: Change Money or Turnaround Money?',
    cnDesc: '破军是「破而后立」的星。在财帛宫赚的是变局中的财，在官禄宫做的是重整的事。但先破后立和只破不立是两回事，要看化禄化权还是化忌。',
    enDesc: 'Po Jun is the star of "break then rebuild." In the Wealth Palace you earn from disruption; in the Career Palace you do turnaround work. But breaking through and breaking apart differ — check the transformations.',
    category: '主星',
    crumbName: '十四主星',
    crumbHref: 'ziwei-main-stars.html',
    enSection: 'Zi Wei Dou Shu',
    cnLead: '破军是十四主星里最「动」的一颗。它不守成、不重复、不喜欢原地踏步。破军在财帛宫的人，赚钱方式跟别人不一样——别人做稳定的生意，他做的是「别人不做了他接手」「旧模式不行了他换模式」的变局财。破军在官禄宫的人，工作性质也跟「重整」有关——接手烂摊子、开创新部门、转型、改革。但破军的核心问题是：破了之后立不立得起来？',
    cnIntro2: '破军不是煞星，但它自带「破」的性质。破可以是突破，也可以是破坏。破军化禄，是先破后得——破旧模式之后赚到钱；破军化权，是强力改革——有执行力但也有破坏力；破军化忌，是破而不立——折腾一圈什么都没剩下。这篇把破军在财帛和官禄的读法拆开讲。',
    cnSections: [
      { h: '破军在财帛：赚的是变局中的钱', ps: [
        '破军在财帛宫的人，不适合赚「死工资」。他们的财来自变化——行业洗牌时低价接手、旧设备翻新转卖、在别人退场时进场、把一个做坏的项目重新做活。这种财不是稳财，是「变局财」。',
        '破军化禄在财帛，是「先破后得」的典型。可能是先投入一大笔钱、先辞掉稳定工作、先关掉旧业务，然后在新方向上赚到。这种人的财不是月月有的那种，是「三年不开张，开张吃三年」。',
        '举个确定的组合：破军化禄在财帛，对宫官禄宫见七杀。破军主变革，七杀主冲锋——这种人适合在新兴行业或转型期行业里赚钱，敢于在别人不敢进的时候进场。但如果三方见地空地劫，变局可能变成空局——破了但没立起来，钱投进去打了水漂。'
      ]},
      { h: '破军在官禄：做的是重整的事', ps: [
        '破军在官禄宫的人，职业生涯通常跟「改变」有关。可能是被派去接手一个烂摊子、去开一个新市场、在一家公司里做转型，或者自己创业做「别人没做过的事」。',
        '破军化权在官禄，是「铁腕改革」。这种人在组织里是改革派——能做事、敢裁人、不怕得罪人。但化权也主独断，破军化权的人如果听不进意见，改革可能变成折腾。',
        '破军在官禄加紫微（紫微破军同宫），是「在体制内改革」——有平台、有资源，但要在现有框架内破局。加贪狼（对宫或三方），改革手段灵活，懂交际懂变通。加七杀，改革力度最大但风险也最大。'
      ]},
      { h: '破军加煞星：破和立的界限', ps: [
        '破军加擎羊、火星，变革来得猛、来得快，但也容易过头。擎羊是刀——改革像动手术，刀口快但伤元气；火星是火——一阵风过去，烧完了可能什么都没剩下。这种组合的人要注意：破的时候留余地，不要把退路全断了。',
        '破军加地空、地劫，是「只破不立」最危险的信号。空劫主空——想法很大、动作很大，但落不了地。破军加空劫的人，经常换方向、换项目、换行业，每次都觉得「这次一定行」，但每次都差最后一步。',
        '破军加陀罗，变革拖泥带水。陀罗是纠缠——想破但破不干净，想立但立不起来，旧的不去新的不来，卡在中间最难受。'
      ]},
      { h: '流年引动：变局什么时候来', ps: [
        '第一种：大限命宫或财帛宫见破军化禄。这十年是「破而后立」的十年——可能辞职创业、转行、大笔投资。前期可能辛苦甚至亏钱，但方向对了后期回报大。',
        '第二种：流年破军化权入官禄。这一年工作上有大变动——可能是接手新项目、被调去开荒、或者公司重组让你负责一摊。权力大了，但压力也大。',
        '第三种：流年破军化忌入财帛。这一年破财风险高——投资失败、项目中断、转型不顺。这种年份不宜大额投入，守比攻重要。'
      ]},
      { h: '排盘后的使用顺序', ps: ['破军在财帛或官禄，按这个顺序读：'], ol: [
        '先看破军有无四化——化禄主先破后得，化权主强力改革，化忌主破而不立。',
        '看同宫主星：紫微破军主体制内改革，廉贞破军主软硬兼施，武曲破军主财务重整。',
        '看对宫：财帛对官禄，官禄对财帛——赚钱方式和工作性质要对读。',
        '看煞星：擎羊火星主过猛，空劫主落空，陀罗主拖延。',
        '看禄存：破军加禄存，破中有守，不会一破到底。',
        '流年分三种：化禄主变局机遇，化权主改革责任，化忌主破财运。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星专题' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'Po Jun is the most dynamic of the fourteen main stars. It doesn\'t preserve, repeat, or stay still. With Po Jun in the Wealth Palace, you earn differently from others — you take over what others abandon, replace old models, enter when others exit. In the Career Palace, your work involves turnaround — taking over messes, launching new divisions, transforming, reforming. But the core question is always: after the break, does anything get built?',
    enIntro2: 'Po Jun isn\'t a malefic star, but it carries a breaking quality. The break can be a breakthrough or a breakdown. With Hua Lu, you gain after breaking. With Hua Quan, you reform forcefully. With Hua Ji, you break and nothing stands afterward.',
    enSections: [
      { h: 'Po Jun in Wealth: Earning From Disruption', ps: [
        'People with Po Jun in the Wealth Palace don\'t thrive on fixed salaries. Their money comes from change — buying distressed assets, flipping outdated equipment, entering markets when others exit, reviving failed projects.',
        'Po Jun with Hua Lu here is the classic "break then gain." You might invest heavily, quit the stable job, or shut down the old business first — then earn in the new direction. It\'s feast-or-famine money.',
        'Po Jun Hua Lu in Wealth with Qi Sha in the opposite Career Palace points to someone who profits in emerging or transitioning industries. But with Di Kong/Di Jie in the triple combination, the disruption leads to nothing.'
      ]},
      { h: 'Po Jun in Career: Turnaround Work', ps: [
        'Po Jun in the Career Palace means a career tied to change — turning around failing units, opening new markets, leading transformations, or building what hasn\'t been built before.',
        'Po Jun with Hua Quan here is iron-fisted reform. You get things done, make cuts, don\'t fear offending people. But if you stop listening, reform becomes chaos.',
        'With Zi Wei, you reform within a system. With Tan Lang in the triple combination, your methods are flexible and social. With Qi Sha, the reform is boldest — and riskiest.'
      ]},
      { h: 'With Challenging Stars: Where Break Meets Build', ps: [
        'With Qing Yang or Huo Xing, change comes fast and fierce — but can go too far. Leave yourself a retreat.',
        'With Di Kong/Di Jie, it\'s the most dangerous signal: big ideas, big moves, no landing. You change direction every year and always come up one step short.',
        'With Tuo Luo, the break drags — can\'t fully break the old, can\'t fully build the new, stuck in between.'
      ]},
      { h: 'Timing: When Disruption Arrives', ps: [
        'A ten-year cycle with Po Jun Hua Lu in Wealth or Life brings a break-and-build decade — quitting, pivoting, big investment. Hard early, rewarding later if the direction is right.',
        'An annual Po Jun Hua Quan entering Career brings a year of major work change — new projects, new markets, restructuring. More authority, more pressure.',
        'An annual Po Jun Hua Ji entering Wealth brings financial risk — failed investments, interrupted projects. Don\'t commit big money this year; defend don\'t attack.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When Po Jun sits in Wealth or Career:'], ol: [
        'Check transformations: Hua Lu = gain after break, Hua Quan = forceful reform, Hua Ji = break without build.',
        'Check co-stars: Zi Wei Po Jun = reform within system; Lian Zhen Po Jun = soft-hard mix; Wu Qu Po Jun = financial restructuring.',
        'Read the opposite palace: Wealth and Career mirror each other.',
        'Check challenging stars: Qing Yang/Huo Xing = too fierce, Kong Jie = empty, Tuo Luo = stuck.',
        'Check Lu Cun: with it, you break but preserve a base.',
        'Timing: Lu year = opportunity in change, Quan year = reform responsibility, Ji year = financial risk.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-sanfang-sizheng.html', text: 'Triple Combinations' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-tuoluo-qianyigong-tuoshouxu-haishixingdong',
    cnTitle: '紫微斗数陀罗在迁移宫，拖的是手续、路线还是行动',
    enTitle: 'Tuo Luo in the Travel Palace: Delayed Papers, Routes, or Decisions?',
    cnDesc: '陀罗在迁移宫，外出容易遇到「拖」——手续拖、行程拖、决定拖。但陀罗拖的是什么，要看同宫和三方的星曜。昌曲拖文书，火铃拖行程，空劫拖行动。',
    enDesc: 'Tuo Luo in the Travel Palace brings delay when you go out — paperwork, travel, or decisions. What exactly gets delayed depends on the co-stars: Chang Qu delay documents, Huo Ling delay trips, Kong Jie delay action.',
    category: '辅煞曜',
    crumbName: '辅曜煞曜',
    crumbHref: 'ziwei-helper-malice-stars.html',
    enSection: 'Zi Wei Dou Shu',
    cnLead: '陀罗是一颗「慢」星。它不像擎羊那样一刀见血，也不像火星那样一阵风——陀罗是原地打转、反反复复、想走走不了、想快快不了。陀罗在迁移宫，最直接的感受就是「出门在外，什么都比预期慢」。签证下不来、航班延误、合同卡在审批、约好的人迟迟不出现。但陀罗拖的到底是什么，要看跟它同宫和三方的星曜。',
    cnIntro2: '迁移宫看的是你在外的状态——出行、出差、搬家、移民、在外发展。陀罗在这里，「拖」是主旋律，但拖的方式和领域不同。昌曲同宫拖文书，火铃同宫拖行程，空劫同宫拖行动。还有一种陀罗，不是外面在拖你，是你自己在拖自己——犹豫不决、想太多、不敢动。这篇把陀罗在迁移宫的几种读法拆开讲。',
    cnSections: [
      { h: '陀罗加昌曲：拖的是手续和文书', ps: [
        '陀罗和文昌、文曲同宫在迁移，最典型的应法是「文书拖延」。签证审批慢、护照办理卡壳、合同条款来回改、驾照或资质认证迟迟下不来。昌曲是文书星，陀罗是拖延——两件事叠在一起，就是纸面上的事特别磨人。',
        '这种组合的人，出国、移民、异地工作的手续往往比别人多走几道程序。不是不行，是慢。应对方法是：所有文件提前准备、留足时间余量、不要卡着deadline提交。',
        '如果陀罗加昌曲再化忌，文书不只是慢，还可能出岔子——材料被退回、条款有争议、审批被拒了又要重新来。这种年份签合同要逐条看，重要文件找专业人士过一遍。'
      ]},
      { h: '陀罗加火铃：拖的是行程和交通', ps: [
        '陀罗加火星或铃星在迁移宫，拖的是「动」本身。航班延误、高铁晚点、路上堵车、约好的见面对方迟到——火铃是急性子，陀罗是慢，两个在一起就是「急着走但走不了」，特别磨人。',
        '火星加陀罗，拖延来得突然——本来好好的，临出发出状况。铃星加陀罗，拖延是慢性的——一个行程改了又改，一件事拖了又拖，让人心里一直悬着。',
        '举个组合：迁移宫陀罗加火星加天马。天马主奔波，陀罗主拖延，火星主急躁——这种人经常出差，但每次出差都有状况，不是交通延误就是行程突变。出门前留缓冲时间，是最实际的建议。'
      ]},
      { h: '陀罗加空劫：拖的是决定和行动', ps: [
        '陀罗加地空、地劫在迁移宫，拖的不是外力，是你自己。空劫主犹豫和不确定，陀罗主反复——想换城市但一直下不了决心，想出国但准备了一半停了，想搬家但看了半年还没定。',
        '这种组合的人，心里想动但行动上一直拖。不是没有机会，是机会来了自己接不住——犹豫太久，机会过了；准备太久，行情变了。空劫加陀罗在迁移，最怕的是「想了三年还在原地」。',
        '如果迁移宫是空宫，借对宫命宫的星曜来读。命宫强的人，陀罗只是让他慢一点但最终会动；命宫柔的人，陀罗可能让他一直停在想的阶段。'
      ]},
      { h: '流年引动：什么时候最拖', ps: [
        '第一种：大限迁移宫见陀罗。这十年外出发展容易遇到拖延——可能是移民排期长、异地项目周期久、驻外时间比预期长。这十年的关键词是「等」，但等的时候要保持准备，不要干等。',
        '第二种：流年陀罗入迁移宫。这一年出行、搬家、出差都容易延误。重要行程留余量，重要文件提前办，不要把时间排太满。',
        '第三种：流年化忌加陀罗入迁移。这一年不只是慢，还可能有阻滞——签证被拒、项目叫停、外出遇到纠纷。这种年份不宜强行推进外出计划，能缓则缓。'
      ]},
      { h: '排盘后的使用顺序', ps: ['陀罗在迁移宫，按这个顺序读：'], ol: [
        '先看陀罗跟谁同宫：昌曲主文书拖，火铃主行程拖，空劫主决定拖。',
        '看有无天马：天马加陀罗，奔波中拖延，人特别累。',
        '看化忌：陀罗加化忌，拖延变成阻滞，不只是慢而是卡。',
        '看禄存或化禄：有禄，拖但最终能成；无禄，拖了可能白拖。',
        '空宫借命宫：命宫强的人最终能动，命宫柔的人可能一直拖。',
        '流年分三种：大限陀罗主长期等待，流年陀罗主当年延误，化忌加陀罗主阻滞。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜专题' },
      { href: 'ziwei-qianyigong.html', text: '迁移宫怎么看' },
      { href: 'ziwei-qianyigong-huaquan.html', text: '迁移宫化权' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: '本宫没有主星怎么读' }
    ],
    enLead: 'Tuo Luo is the star of slowness. Unlike Qing Yang\'s sudden cut or Huo Xing\'s burst, Tuo Luo spins in place — repeating, stalling, unable to move forward. With Tuo Luo in the Travel Palace, the dominant feeling is: away from home, everything takes longer than expected. Visas don\'t arrive, flights delay, contracts sit in approval, people show up late. But what exactly gets delayed depends on the stars around it.',
    enIntro2: 'The Travel Palace covers travel, business trips, relocation, immigration, and life away from home. Tuo Luo here makes delay the theme — but Chang Qu delay documents, Huo Ling delay trips, and Kong Jie delay decisions. Sometimes Tuo Luo isn\'t the world delaying you; it\'s you delaying yourself.',
    enSections: [
      { h: 'Tuo Luo With Chang Qu: Delayed Documents', ps: [
        'The most direct manifestation is paperwork delay — visa approvals, passport processing, contract revisions, certifications. Chang Qu rule documents; Tuo Luo rules delay. Together, paper-based matters grind slowly.',
        'People with this combination often face extra procedural steps when going abroad or relocating. It\'s not denial; it\'s slowness. Prepare early, build in buffer time, never submit at the deadline.',
        'If Hua Ji joins, documents don\'t just slow — they go wrong: materials returned, terms disputed, applications rejected. Have professionals review important papers.'
      ]},
      { h: 'Tuo Luo With Huo Ling: Delayed Travel', ps: [
        'With Huo Xing or Ling Xing, the delay is in movement itself — flights, trains, traffic, people running late. Huo Ling wants to go fast; Tuo Luo won\'t let it. The combination is uniquely frustrating: in a hurry but unable to move.',
        'Huo Xing + Tuo Luo: sudden delays right before departure. Ling Xing + Tuo Luo: chronic rescheduling, plans in limbo.',
        'Tuo Luo + Huo Xing + Tian Ma (the Travel Star): frequent trips, each with complications. Build buffer time into every journey.'
      ]},
      { h: 'Tuo Luo With Kong Jie: Delayed Decisions', ps: [
        'With Di Kong/Di Jie, the delay is internal. You want to move but can\'t commit — considering relocation for years, preparing to go abroad then stopping, apartment-hunting for six months with no decision.',
        'Opportunities come but hesitation makes you miss them. The biggest risk is thinking for three years and still being in the same place.',
        'If the Travel Palace is empty, borrow the Life Palace stars. A strong Life Palace means you eventually move; a soft one means you may stay in the thinking phase forever.'
      ]},
      { h: 'Timing: When Delay Hits Hardest', ps: [
        'A ten-year cycle with Tuo Luo in Travel brings long waits — immigration queues, long project cycles abroad, extended postings. The keyword is "wait," but stay prepared while waiting.',
        'An annual Tuo Luo entering Travel means a year of travel delays and slow relocations. Build buffers; don\'t overschedule.',
        'An annual Hua Ji plus Tuo Luo in Travel means blockage, not just slowness — denials, cancellations, disputes. Don\'t force travel plans this year; defer when possible.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When Tuo Luo sits in the Travel Palace:'], ol: [
        'Check co-stars: Chang Qu = paperwork, Huo Ling = travel, Kong Jie = decisions.',
        'Check for Tian Ma: with it, delay happens amid constant movement — exhausting.',
        'Check for Hua Ji: Tuo Luo + Hua Ji turns delay into blockage.',
        'Check for Lu Cun/Hua Lu: with Lu, the delay still ends well; without it, waiting may be wasted.',
        'Empty palace: borrow the Life Palace — strong you eventually moves, soft you stays stuck.',
        'Timing: decade Tuo Luo = long wait, annual Tuo Luo = delays, Hua Ji + Tuo Luo = blockage.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Assistant and Malefic Stars' },
      { href: 'ziwei-qianyigong.html', text: 'The Travel Palace' },
      { href: 'ziwei-qianyigong-huaquan.html', text: 'Travel Palace Hua Quan' },
      { href: 'ziwei-minggong.html', text: 'The Life Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: 'Reading Empty Palaces' }
    ]
  },
  {
    slug: 'ziwei-yuelang-tianmen-bushi-ruo',
    cnTitle: '紫微斗数月朗天门为什么不是弱：太阴得位先看清明，不先看柔',
    enTitle: 'Moon Over the Gate: Why Yue Lang Tian Men Is Not a Weak Pattern',
    cnDesc: '太阴在亥宫守命，叫「月朗天门」。很多人一看太阴就觉得柔、弱、依赖，但太阴在亥是得位——月亮挂在天门，先看的是清明和智慧，不是柔弱。',
    enDesc: 'Tai Yin in Hai is called "Moon Over the Gate." People see Tai Yin and assume softness, but in Hai the moon is in its rightful place — clarity and wisdom come first, not weakness.',
    category: '格局命例',
    crumbName: '特定命例',
    crumbHref: 'ziwei-case-patterns.html',
    enSection: 'Zi Wei Dou Shu',
    cnLead: '太阴在亥宫守命，是紫微斗数里的一个有名格局——月朗天门。月亮挂在西北天门，又圆又亮。但很多人一听到太阴，第一反应是「柔」「弱」「靠别人」。这是把太阴读窄了。太阴在亥，是得位——就像月亮挂在它该挂的地方，光最亮、最清。这个格局先看的是清明、智慧和定力，不是柔弱。',
    cnIntro2: '太阴是月亮，主藏、主静、主柔。但月亮的「柔」不是软弱——月光是柔的，但它能照亮黑夜。太阴在亥宫（亥属水，太阴是水精，在亥为庙旺），就像月亮升到了天上最开阔的位置，光没有遮挡。这种人通常聪明、冷静、感受力强，而且有财运。但能不能成格，还要看有没有煞星来破。',
    cnSections: [
      { h: '先看清明，再看柔', ps: [
        '月朗天门的人，最大的特点不是温柔，是「清」。思路清、感受清、看人看事透。太阴主智慧，在亥宫得位，这种智慧不是天机那种机灵，而是一种「心里跟明镜似的」——什么都看在眼里，不一定说，但心里有数。',
        '太阴也主财，而且是「暗财」——不是太阳那种摆在台面上的财，是悄悄积累的财。月朗天门的人，通常对钱有感觉、会存、会投资，而且不张扬。太阴化禄或加禄存，财运更稳。',
        '太阴在亥的人也主得女性助力——母亲、妻子、女性贵人。因为太阴本身就代表女性，在得位的位置，女性缘分深、助力大。但这不代表「靠女人」——助力是双向的，你自己也有能力。'
      ]},
      { h: '加吉星：清上加清', ps: [
        '月朗天门加文昌、文曲，聪明变成才华。这种人文思好、学习能力强、考试运佳，适合做研究、写作、策划、设计。昌曲也主名声，太阴加昌曲，才华容易被看见。',
        '月朗天门加禄存，是「财中有守」。太阴本来就主财，加禄存是能赚能存，而且是长期积累型——不一定暴富，但越老越稳。',
        '月朗天门加左辅、右弼，有人帮。太阴的人通常不喜欢自己冲在前面，左右来会，代表你做决策时有人执行、有人支持。加天魁、天钺，关键时刻有贵人，而且贵人多为女性。'
      ]},
      { h: '加煞星：月亮被遮', ps: [
        '月朗天门最怕擎羊和火星。擎羊是刀，火星是火——月亮被刀伤、被火烤，格局就破了。擎羊在亥宫跟太阴同宫，聪明但性格里有刚烈的一面，容易因为冲动坏事；火星同宫，情绪起伏大，月亮的清明被焦虑盖住。',
        '月朗天门加地空、地劫，是「月亮照在空谷里」——聪明但容易想太多、追求不切实际的东西，或者精神世界丰富但物质上留不住。空劫也主宗教、哲学缘分，这种人可能对玄学、灵性有兴趣，但要注意不要脱离现实。',
        '月朗天门加陀罗，清明变纠结。陀罗是原地打转——太阴本来就想得多，加陀罗更难下决定，一件事翻来覆去想，行动力被思考淹没。',
        '太阴在亥也不是没有弱点。太阴主情绪，在亥宫虽然清明，但也容易受环境影响——满月时光亮，月缺时暗淡。这种人的状态有周期性，状态好时什么都看得透，状态差时容易低落。了解自己的周期，比强迫自己一直积极更有用。'
      ]},
      { h: '流年引动：月亮什么时候最亮', ps: [
        '第一种：大限走太阴或亥宫相关位置。这十年是「月朗」的十年——思路清晰、财运好、贵人多。适合学习、积累、做长期投资。',
        '第二种：流年太阴化禄入命或财帛。这一年财运好、心情稳，适合做财务决策、买房、存钱。太阴化禄的财是「暗财」——可能是分红、利息、租金这种不张扬的收入。',
        '第三种：流年煞星冲太阴。这一年月亮被遮——情绪低落、判断失误、财务损失。擎羊火星冲太阴的年份，不要在情绪激动时做决定，重要的事缓一缓。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到太阴在亥守命，按这个顺序读：'], ol: [
        '先确认是太阴在亥宫守命（不是迁移或其他宫），这才是月朗天门。',
        '看太阴有无四化：化禄主财稳，化权主柔中带刚，化科主名声，化忌主情绪和母亲问题。',
        '看昌曲、禄存、左右、魁钺——吉星来会，格局更清。',
        '看擎羊、火星、空劫、陀罗——煞星来破，判断破在哪里。',
        '看对宫（巳宫）和三方四正——月朗天门不是只看一颗星，要合看。',
        '流年分三种：化禄主财运年，煞星冲主低落年，大限走太阴主十年清明。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '特定命例专题' },
      { href: 'ziwei-main-stars.html', text: '十四主星怎么看' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' }
    ],
    enLead: 'Tai Yin in Hai Palace guarding the Life Palace is a famous pattern: Yue Lang Tian Men — the moon shining over the heavenly gate. But many people hear "Tai Yin" and immediately think soft, weak, dependent. That reads the star too narrowly. In Hai, the moon is in its rightful place — broad sky, full light, no obstruction. The first things to look at are clarity, wisdom, and composure — not softness.',
    enIntro2: 'Tai Yin is the moon: hidden, still, receptive. But the moon\'s softness isn\'t weakness — moonlight is gentle, yet it illuminates the night. In Hai (water palace, Tai Yin is the essence of water, exalted here), the moon hangs at its brightest. People with this pattern are typically sharp, calm, perceptive, and financially intuitive. But whether the pattern holds depends on whether challenging stars break it.',
    enSections: [
      { h: 'Clarity First, Softness Second', ps: [
        'The defining trait isn\'t gentleness — it\'s clarity. Clear thinking, clear perception, seeing through people and situations. Tai Yin\'s wisdom in Hai isn\'t Tian Ji\'s cleverness; it\'s mirror-like awareness — you notice everything, may not speak, but you know.',
        'Tai Yin also rules wealth — quiet wealth. Not Tai Yang\'s public success but steady, unflashy accumulation. People with this pattern have a feel for money, save well, invest wisely, and don\'t show off. With Hua Lu or Lu Cun, finances are especially stable.',
        'The pattern also brings strong female support — mother, wife, female mentors. This isn\'t "depending on women"; the support flows both ways.'
      ]},
      { h: 'With Supporting Stars: Clearer Still', ps: [
        'With Wen Chang/Wen Qu, intelligence becomes talent — writing, research, planning, design. Exam luck is strong and work gets noticed.',
        'With Lu Cun, wealth is preserved as well as earned. Not sudden riches but growing stability with age.',
        'With Zuo Fu/You Bi, you have people who execute while you steer. With Kui/Yue, benefactors appear at key moments — often female.'
      ]},
      { h: 'With Challenging Stars: The Moon Obscured', ps: [
        'Qing Yang or Huo Xing are the biggest threats. Qing Yang cuts the moon; Huo Xing scorches it. The pattern breaks — intelligence is there but impulsiveness or anxiety obscures it.',
        'With Di Kong/Di Jie, the moon shines on an empty valley — bright but ungrounded. Big thoughts, spiritual interests, but difficulty holding on to material things. Don\'t drift from reality.',
        'With Tuo Luo, clarity becomes rumination. Tai Yin already thinks deeply; Tuo Luo makes it loop. Decisions drown in thought.',
        'Tai Yin in Hai still has a weakness: cycles. Like the moon itself, your brightness waxes and wanes. Learn your cycles rather than forcing constant positivity.'
      ]},
      { h: 'Timing: When the Moon Shines Brightest', ps: [
        'A ten-year cycle activating Tai Yin or Hai brings a decade of clarity, good finances, and helpful people. Good for learning, saving, long-term investment.',
        'An annual Tai Yin Hua Lu entering Life or Wealth brings a year of stable income and calm judgment. The money is quiet — dividends, interest, rent.',
        'A year when challenging stars oppose Tai Yin brings clouded judgment, low mood, financial mistakes. Don\'t make decisions while emotional; defer what can wait.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tai Yin in Hai guarding Life:'], ol: [
        'Confirm it\'s Tai Yin in Hai guarding the Life Palace (not another palace) — that\'s what makes it Yue Lang Tian Men.',
        'Check transformations: Hua Lu = stable wealth, Hua Quan = soft but firm, Hua Ke = reputation, Hua Ji = mood/mother issues.',
        'Check Chang Qu, Lu Cun, Zuo You, Kui Yue — supporting stars strengthen the pattern.',
        'Check Qing Yang, Huo Xing, Kong Jie, Tuo Luo — where does the pattern break?',
        'Read the opposite palace (Si) and triple combination — one star alone doesn\'t make the pattern.',
        'Timing: Hua Lu year = finances, challenging-star year = low mood, Tai Yin decade = clarity.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Chart Patterns' },
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-minggong.html', text: 'The Life Palace' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-sanfang-sizheng.html', text: 'Triple Combinations' }
    ]
  },
  {
    slug: 'ziwei-lianzhen-qisha-fudegong-yingcheng-bunengkang',
    cnTitle: '紫微斗数廉贞七杀在福德，硬撑和能扛不是一回事',
    enTitle: 'Lian Zhen and Qi Sha in the Mental Palace: Toughing It Out vs. Being Able to Carry It',
    cnDesc: '廉贞七杀同宫在福德，精神上能扛事，但也容易硬撑。能扛是压力下不变形，硬撑是有信号不处理。区别在有没有出口——禄存是出口，昌曲是出口，煞星是把出口堵死。',
    enDesc: 'Lian Zhen and Qi Sha together in the Mental Palace give mental toughness, but also a tendency to tough it out. Carrying load well means staying intact under pressure; toughing it out means ignoring signals. Check whether there\'s an outlet.',
    category: '格局命例',
    crumbName: '特定命例',
    crumbHref: 'ziwei-case-patterns.html',
    enSection: 'Zi Wei Dou Shu',
    cnLead: '廉贞七杀在丑未宫同宫，如果落在福德宫，这个人精神上特别能扛。廉贞是「囚星」，主刚烈和执着；七杀是「将星」，主冲劲和独立。两颗星放在福德宫——一个人的内心世界——就是「什么都自己咽，什么都不示弱」。但能扛和硬撑是两回事。能扛的人，压力来了不垮，过了还能恢复；硬撑的人，压力来了不吭声，但身体和情绪在替他记账。',
    cnIntro2: '福德宫看的是你的精神状态、潜意识、享受生活的能力。廉贞七杀在福德，精神世界是紧绷的——像一根弦，拉得紧所以有力，但拉太久会断。这篇讲怎么区分「能扛」和「硬撑」，以及怎么给这根弦松一松。',
    cnSections: [
      { h: '能扛和硬撑的区别', ps: [
        '能扛是什么？是压力来了你接得住，事情过了你放得下。廉贞七杀在福德的人，天生有一种「天塌下来当被盖」的劲——遇到大事不慌、遇到难处不退。这是优点。',
        '硬撑是什么？是压力来了你不承认，身体给信号你不理，情绪在积累你假装没事。廉贞是「囚」——把感受关起来；七杀是「杀」——把脆弱杀掉。两个在一起，最容易出现的状态是「别人都觉得你没事，只有你自己知道快撑不住了」。',
        '区别在哪里？在有没有出口。能扛的人，虽然扛着，但有释放的渠道——运动、倾诉、爱好、信仰。硬撑的人，把所有出口都堵死了——不运动、不说、不休息，觉得「我能行」。'
      ]},
      { h: '加吉星：扛得住也放得下', ps: [
        '廉贞七杀在福德加禄存，是「能扛且有回报」。禄存是守成星，在福德宫代表精神上有「底」——不管外面怎么变，你心里有一个稳稳的东西托着。这种人扛事不白扛，压力最终变成成果。',
        '加文昌、文曲，精神有出口。昌曲主表达和思考——廉贞七杀的刚烈，通过写作、研究、艺术、学习来转化。这种人可能话不多，但内心世界丰富，而且能把压力变成创作或思考的素材。',
        '加左辅、右弼，心里有人撑着。左右是辅佐星，在福德宫代表你内心深处知道「不是一个人」——可能是信仰、可能是家人、可能是一段稳定的关系。这种支撑感让廉贞七杀的刚不至于变成孤。'
      ]},
      { h: '加煞星：硬撑到什么时候', ps: [
        '廉贞七杀在福德加擎羊，是「硬碰硬」。擎羊是刀——对别人狠，对自己更狠。这种人不允许自己示弱，生病了不去看，累了不休息，情绪来了压下去。擎羊在福德，身体容易出急性问题——因为精神上不处理，身体替你爆发。',
        '加火星、铃星，精神上焦虑急躁。火星是上来一阵——突然烦躁、想摔东西；铃星是慢性焦虑——心里一直悬着，放松不下来。廉贞七杀加火铃，最容易出现的状态是「白天没事人，晚上睡不着」。',
        '加地空、地劫，精神上有「空」的感觉。空劫在福德，不管扛了多少事，心里总觉得空——好像什么都没有意义。这种空不是矫情，是廉贞七杀的「刚」碰到了空劫的「空」，发现自己拼的一切好像都抓不住。这种组合的人，适合接触哲学、宗教、灵性方面的东西，给精神找一个更大的框架。',
        '加陀罗，精神上纠结。陀罗是原地打转——一件事想不开就反复想，一个结解不开就一直解。廉贞七杀加陀罗，最容易钻牛角尖，而且别人劝不动。'
      ]},
      { h: '对宫财帛：精神压力和钱的关系', ps: [
        '福德宫的对宫是财帛宫。廉贞七杀在福德，一定要看财帛宫是什么星。如果财帛宫好（有禄、有府），你虽然精神紧绷，但钱上不缺，压力有实际的回报。如果财帛宫也差（化忌、空劫），那就是「又累又穷」，精神压力最大。',
        '如果福德宫是空宫，借对宫财帛宫的星曜来读。空宫不代表精神空虚——借过来的星曜决定了你内心世界以什么方式运作。'
      ]},
      { h: '排盘后的使用顺序', ps: ['廉贞七杀在福德宫，按这个顺序读：'], ol: [
        '先确认是廉贞七杀在丑未同宫守福德（不是其他宫位）。',
        '看有无禄存或化禄——有禄，扛事有回报；无禄，白扛。',
        '看昌曲、左右——有没有精神出口和内心支撑。',
        '看擎羊、火铃、空劫、陀罗——判断硬撑的方式和风险。',
        '看对宫财帛——精神压力有没有物质回报。',
        '流年分三种：大限廉贞杀主十年高压，流年煞星冲福德主情绪爆发年，流年禄入福德主放松年。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '特定命例专题' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-fudegong-hualu.html', text: '福德宫化禄' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' }
    ],
    enLead: 'When Lian Zhen and Qi Sha share a palace and land in the Mental Palace, the person is mentally tough. Lian Zhen is the Prison Star — fierce and执着; Qi Sha is the General Star — driven and independent. Together in the palace of your inner world, they produce someone who swallows everything and never shows weakness. But carrying load well and toughing it out are different. The first means you stay intact under pressure and recover after; the second means you say nothing while your body and emotions keep score.',
    enIntro2: 'The Mental Palace governs your精神 state, subconscious, and capacity to enjoy life. Lian Zhen and Qi Sha here keep the inner world taut — like a bowstring: powerful because it\'s tight, but it snaps if never unstrung.',
    enSections: [
      { h: 'Carrying vs. Toughing It Out', ps: [
        'Carrying well means you take the pressure and let it go afterward. People with this combination have natural composure in a crisis — steady when things go wrong.',
        'Toughing it out means you deny the pressure, ignore body signals, and pretend everything is fine while emotions accumulate. Lian Zhen locks feelings up; Qi Sha kills vulnerability. The result: everyone thinks you\'re fine, and only you know you\'re barely holding on.',
        'The difference is outlets. People who carry well have release — exercise, conversation, hobbies, faith. People who tough it out seal every exit.'
      ]},
      { h: 'With Supporting Stars: Strong and Able to Release', ps: [
        'With Lu Cun, the load pays off. There\'s an inner base — something steady inside you regardless of external chaos. Pressure becomes results.',
        'With Wen Chang/Wen Qu, the mind has an outlet. The fierceness transforms through writing, study, art, or analysis.',
        'With Zuo Fu/You Bi, you don\'t feel alone inside — faith, family, or a stable relationship provides inner support that keeps the toughness from hardening into isolation.'
      ]},
      { h: 'With Challenging Stars: How Long Can You Hold?', ps: [
        'With Qing Yang, you\'re hard on others and harder on yourself. No showing weakness, no rest, no doctor visits. The body eventually erupts what the mind suppresses.',
        'With Huo Xing/Ling Xing: anxiety and irritability. Huo Xing brings sudden flares; Ling Xing brings chronic unease. The pattern: fine by day, awake at night.',
        'With Di Kong/Di Jie: an inner emptiness. No matter how much you carry, something feels meaningless. Philosophy, religion, or spirituality can give the mind a larger frame.',
        'With Tuo Luo: mental looping. One thought circles endlessly; no one can talk you out of it.'
      ]},
      { h: 'The Opposite Wealth Palace: Pressure and Pay', ps: [
        'The Mental Palace faces the Wealth Palace. If Wealth is strong (Lu, Tian Fu), the tension has material reward. If Wealth is also troubled (Hua Ji, Kong Jie), you get tired AND broke — maximum mental pressure.',
        'If the Mental Palace is empty, borrow the opposite Wealth Palace stars. An empty palace doesn\'t mean an empty mind.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When Lian Zhen and Qi Sha sit in the Mental Palace:'], ol: [
        'Confirm it\'s Lian Zhen + Qi Sha in Chou or Wei guarding the Mental Palace.',
        'Check for Lu Cun/Hua Lu — with Lu, the load pays; without it, you carry for nothing.',
        'Check Chang Qu and Zuo You — mental outlets and inner support.',
        'Check Qing Yang, Huo Ling, Kong Jie, Tuo Luo — how you tough it out and where it risks.',
        'Read the opposite Wealth Palace — does the pressure have material reward?',
        'Timing: decade = high-pressure years; challenging-star year = emotional eruption; Lu year = relief.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Chart Patterns' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-fudegong-hualu.html', text: 'Mental Palace Hua Lu' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-helper-malice-stars.html', text: 'Assistant and Malefic Stars' },
      { href: 'ziwei-sanfang-sizheng.html', text: 'Triple Combinations' }
    ]
  },
  {
    slug: 'ziwei-guanlugong-hangye-zhiwei-zeren-shui-zhong',
    cnTitle: '紫微斗数官禄宫到底更偏行业、职位还是责任：别把三个问题揉成一句话',
    enTitle: 'The Career Palace: Industry, Position, or Responsibility? Three Different Questions',
    cnDesc: '官禄宫看三件事：你在什么行业（主星定）、你做什么角色（四化定）、你担什么责任（煞星和辅星定）。混在一起读，就会得出「你适合做生意」这种没用的结论。',
    enDesc: 'The Career Palace answers three questions: what industry (main stars), what role (transformations), and what responsibility (assistant and challenging stars). Muddle them and you get useless advice like "you should do business."',
    category: '看盘方法',
    crumbName: '看盘入门',
    crumbHref: 'ziwei-learning-path.html',
    enSection: 'Zi Wei Dou Shu',
    cnLead: '很多人看官禄宫，一句话就想得到答案：「我适合做什么工作？」这个问题太大了。官禄宫其实回答三个不同的问题：第一，你在什么行业、什么领域；第二，你在这个领域里做什么角色；第三，你担多大的责任、承受多大的压力。主星回答第一个，四化回答第二个，辅星和煞星回答第三个。把三个问题揉成一句话读，就会得出「你适合做生意」「你适合上班」这种没用的结论。',
    cnIntro2: '这篇讲的是读官禄宫的方法，不是某个星在官禄宫的断语。学会分三层读，你才能把官禄宫读具体——不是「适合金融」，是「在金融行业做分析岗位，责任重但权力有限」。',
    cnSections: [
      { h: '第一层：主星定行业和领域', ps: [
        '官禄宫的主星，定的是你「在什么池子里」。紫微、天府在官禄，跟大机构、管理、金融、政府有关；武曲在官禄，跟财务、金融、军警、金属有关；天机在官禄，跟策划、技术、交通、IT有关；太阳在官禄，跟公关、政治、教育、传媒有关。',
        '贪狼在官禄，跟娱乐、销售、公关、服务业有关；巨门在官禄，跟口才、法律、教育、中介有关；天相在官禄，跟幕僚、行政、印鉴、助理有关；天梁在官禄，跟监察、审计、教育、医疗有关。',
        '七杀在官禄，跟军警、创业、竞争性行业有关；破军在官禄，跟改革、转型、开拓性工作有关；天同在官禄，跟服务、福利、休闲、文化有关；廉贞在官禄，跟政法、业务、管理、技术有关。',
        '但主星只定「池子」，不定你在池子里是大鱼还是小鱼。紫微在官禄的人可能在大公司当前台，也可能当CEO——区别在四化和辅星。'
      ]},
      { h: '第二层：四化定角色和位置', ps: [
        '化禄在官禄，工作有资源、收入好、机会多。你在组织里是「有油水」的位置——预算多、客户多、收入跟业绩挂钩。但化禄不主权力，你可能赚得多但说了不算。',
        '化权在官禄，有职位、有权力、责任重。你是「说了算」的角色——管理岗、负责人、决策者。但化权不主收入，你可能官大但钱不多，或者责任比权力大。',
        '化科在官禄，有名声、有专业、靠技术或口碑吃饭。你是「有牌子」的角色——专家、顾问、技术骨干。化科的人不一定管人，但在专业领域有话语权。',
        '化忌在官禄，工作有压力、有阻滞、事多功少。你可能在一个吃力不讨好的位置——活你干，锅你背，好处别人拿。但化忌也主「离不开」——这份工作虽然累，但你走不了或者不想走。',
        '举个组合：官禄宫武曲化权加左辅右弼。武曲主金融，化权主管理，左右主有团队——这是「在金融行业做管理岗，有团队有权力」。如果是武曲化禄加昌曲，那就是「在金融行业做专业岗，收入好但不管人」。同样是武曲在官禄，角色完全不同。'
      ]},
      { h: '第三层：辅星煞星定责任和工作方式', ps: [
        '左辅、右弼在官禄，有团队、有助手、有人帮你执行。你的工作不是单打独斗。天魁、天钺在官禄，工作上有贵人——领导赏识、关键时刻有人提你。文昌、文曲在官禄，工作跟文书、表达、专业技术有关。',
        '擎羊在官禄，工作性质带「刀」——可能是外科医生、军警、执法，也可能是工作环境竞争激烈、人事斗争多。火星在官禄，工作节奏快、性子急、容易突发状况。陀罗在官禄，工作拖泥带水、项目周期长、升职慢。',
        '地空、地劫在官禄，工作容易有变动——换岗、换公司、项目中途断掉。空劫也主「不在常规轨道上」——自由职业、创业、非主流行业。禄存在官禄，工作稳定、收入有底，但也主「固定」——不容易大富大贵但也饿不着。',
        '举个组合：官禄宫太阳化禄加魁钺加昌曲。太阳主传媒/公关，化禄主收入好，魁钺主贵人，昌曲主表达——这是「在传媒或公关行业，靠表达能力吃饭，收入好且有贵人提携」。如果加擎羊，那就是「行业好但竞争激烈，贵人帮你但也有人给你使绊子」。'
      ]},
      { h: '流年引动：工作什么时候变', ps: [
        '第一种：大限官禄宫化禄或化权。这十年事业上升——化禄主收入和机会增加，化权主职位和权力提升。但如果大限官禄化忌，这十年工作压力大、变动多，可能是最累的十年。',
        '第二种：流年化禄化权入官禄。这一年有升职、加薪、换好工作的机会。化禄主收入，化权主职位——两个一起来最好，只来一个就看你更想要钱还是权。',
        '第三种：流年化忌入官禄或冲官禄。这一年工作不顺——项目黄了、领导换了、岗位调了、或者干得不爽想走。这种年份不宜裸辞，骑驴找马比冲动离职安全。'
      ]},
      { h: '排盘后的使用顺序', ps: ['读官禄宫，按三层来：'], ol: [
        '先看主星定行业：紫微天府主大机构金融，武曲主财务军警，天机主策划技术，太阳主公关传媒，贪狼主娱乐销售，巨门主口才法律，天相主幕僚行政，天梁主监察教育，七杀主军警创业，破军主改革开拓，天同主服务福利，廉贞主政法业务。',
        '再看四化定角色：化禄主资源收入，化权主权力责任，化科主专业名声，化忌主压力阻滞。',
        '看辅星定工作方式：左右有团队，魁钺有贵人，昌曲靠文书技术。',
        '看煞星定风险：擎羊主竞争激烈，火铃主节奏快突发多，陀罗主拖延，空劫主变动。',
        '看禄存：有禄存工作稳定但天花板可见，无禄存起伏大但上限高。',
        '流年分三种：大限定十年事业走向，流年禄权主当年机会，流年忌主当年不顺。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-learning-path.html', text: '看盘入门专题' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-main-stars.html', text: '十四主星怎么看' },
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'Many people look at the Career Palace and want one answer: "What job am I suited for?" That question is too big. The Career Palace actually answers three different questions: What field are you in? What role do you play there? How much responsibility and pressure do you carry? Main stars answer the first, the Four Transformations answer the second, and assistant and malefic stars answer the third. Muddle them together and you get useless advice like "you should do business."',
    enIntro2: 'This is about method, not fixed star interpretations. Learn to read in three layers and you get specific answers — not "finance suits you" but "analytical role in finance, heavy responsibility, limited authority."',
    enSections: [
      { h: 'Layer One: Main Stars Define the Field', ps: [
        'Zi Wei/Tian Fu: large organizations, management, finance, government. Wu Qu: finance, military, metal, enforcement. Tian Ji: planning, tech, logistics, IT. Tai Yang: PR, politics, education, media.',
        'Tan Lang: entertainment, sales, hospitality. Ju Men: law, teaching, sales-by-talking, mediation. Tian Xiang: staff roles, administration, advisory. Tian Liang: audit, supervision, education, healthcare.',
        'Qi Sha: military, policing, entrepreneurship, competitive fields. Po Jun: turnaround, transformation, pioneering. Tian Tong: service, welfare, leisure, culture. Lian Zhen: legal, business operations, management, tech.',
        'But the main star only defines the pond — not whether you\'re a big or small fish in it.'
      ]},
      { h: 'Layer Two: Transformations Define the Role', ps: [
        'Hua Lu: resources and income — you\'re where the budget and clients are, but not necessarily in charge.',
        'Hua Quan: authority and responsibility — you decide, you manage, but the pay may not match the title.',
        'Hua Ke: reputation and expertise — you\'re the specialist, the consultant, the known name. You may not manage people but your expertise carries weight.',
        'Hua Ji: pressure and blockage — heavy workload, little recognition, but also a job you can\'t or won\'t leave.',
        'Example: Wu Qu Hua Quan with Zuo Fu/You Bi = management role in finance with a team. Wu Qu Hua Lu with Chang Qu = well-paid specialist role in finance, no direct reports. Same star, completely different role.'
      ]},
      { h: 'Layer Three: Assistant and Malefic Stars Define How You Work', ps: [
        'Zuo Fu/You Bi: you have a team. Kui/Yue: mentors and sponsors. Chang Qu: your work involves documents, communication, or technical skill.',
        'Qing Yang: competitive or cutthroat environment; can indicate surgical/military/law-enforcement work. Huo Ling: fast pace, emergencies. Tuo Luo: slow projects, delayed promotions.',
        'Kong Jie: instability, career changes, or off-the-beaten-path work — freelance, entrepreneurship, unconventional fields. Lu Cun: stable income with a visible ceiling.',
        'Example: Tai Yang Hua Lu with Kui/Yue and Chang Qu = media/PR, earning well through communication, with sponsors. Add Qing Yang and the field is competitive despite the help.'
      ]},
      { h: 'Timing: When Work Changes', ps: [
        'A ten-year cycle with Hua Lu or Hua Quan in Career brings a decade of advancement — Lu for income, Quan for title. Hua Ji here makes it the hardest-working decade.',
        'An annual Hua Lu/Hua Quan entering Career brings promotion, raise, or a better offer. Lu is money; Quan is title.',
        'An annual Hua Ji entering or opposing Career brings setbacks — failed projects, new boss, reassignment. Don\'t quit impulsively; line up the next thing first.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['Read the Career Palace in three layers:'], ol: [
        'Main star → industry: Zi Wei/Tian Fu = large orgs; Wu Qu = finance/enforcement; Tian Ji = tech/planning; Tai Yang = media/PR; Tan Lang = sales/entertainment; Ju Men = law/speaking; Tian Xiang = staff/admin; Tian Liang = audit/education; Qi Sha = competitive/entrepreneurial; Po Jun = turnaround; Tian Tong = service; Lian Zhen = operations/legal.',
        'Transformations → role: Lu = resources/income, Quan = authority, Ke = expertise, Ji = pressure.',
        'Assistant stars → work style: Zuo You = team, Kui Yue = sponsors, Chang Qu = documents/skill.',
        'Malefic stars → risk: Qing Yang = competition, Huo Ling = pace/emergencies, Tuo Luo = delay, Kong Jie = instability.',
        'Lu Cun → stability with a ceiling; without it, more volatility but higher upside.',
        'Timing: decade = career arc; annual Lu/Quan = opportunity; annual Ji = setback.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-learning-path.html', text: 'Learning Path' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-sanfang-sizheng.html', text: 'Triple Combinations' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  }
];

function buildCN(a) {
  let sectionsHtml = '';
  for (const s of a.cnSections) {
    sectionsHtml += `\n        <h2 id="section-${a.cnSections.indexOf(s) + 1}">${s.h}</h2>\n`;
    for (const p of s.ps) {
      sectionsHtml += `        <p>${p}</p>\n`;
    }
    if (s.ol) {
      sectionsHtml += '        <ol>\n';
      for (const item of s.ol) {
        sectionsHtml += `          <li>${item}</li>\n`;
      }
      sectionsHtml += '        </ol>\n';
    }
  }

  let sidebarHtml = '';
  for (const link of a.cnSidebar) {
    sidebarHtml += `        <a class="card-link" href="${link.href}">${link.text}</a>\n`;
  }

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(a.cnTitle)} | 学习紫微</title>
  <meta name="description" content="${jstr(a.cnDesc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:title" content="${jstr(a.cnTitle)}">
  <meta property="og:description" content="${jstr(a.cnDesc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/${a.slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${jstr(a.cnTitle)}",
  "description": "${jstr(a.cnDesc)}",
  "image": "https://yuetianai.com/images/home2/triad-tian-bg.webp",
  "datePublished": "${date}",
  "dateModified": "${date}",
  "inLanguage": "zh-CN",
  "articleSection": "${jstr(a.category)}",
  "about": [
    "紫微斗数",
    "${jstr(a.category)}",
    "${jstr(a.cnTitle)}"
  ],
  "author": {
    "@type": "Organization",
    "name": "阅天AI"
  },
  "publisher": {
    "@type": "Organization",
    "name": "阅天AI"
  },
  "mainEntityOfPage": "https://yuetianai.com/articles/${a.slug}.html"
}
  </script>
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "阅天AI",
      "item": "https://yuetianai.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "学习紫微",
      "item": "https://yuetianai.com/articles/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "${jstr(a.crumbName)}",
      "item": "https://yuetianai.com/articles/${a.crumbHref}"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "${jstr(a.cnTitle)}",
      "item": "https://yuetianai.com/articles/${a.slug}.html"
    }
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
          <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="${a.crumbHref}">${a.crumbName}</a></nav>
          <h1>${a.cnTitle}</h1>
          <p class="detail-subtitle">${a.cnDesc}</p>
          <p class="article-meta"><span>${a.category}</span><span><time datetime="${date}">2026-08-12 10:30</time></span></p>
        </div>
        <div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${a.cnLead}</p>
        <p>${a.cnIntro2}</p>${sectionsHtml}
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

function buildEN(a) {
  const aboutItems = ['"Zi Wei Dou Shu"', `"${jstr(a.enSection)}"`, `"${jstr(a.enTitle)}"`];

  let sectionsHtml = '';
  for (const s of a.enSections) {
    sectionsHtml += `\n        <h2 id="section-${a.enSections.indexOf(s) + 1}">${s.h}</h2>\n`;
    for (const p of s.ps) {
      sectionsHtml += `        <p>${p}</p>\n`;
    }
    if (s.ol) {
      sectionsHtml += '        <ol>\n';
      for (const item of s.ol) {
        sectionsHtml += `          <li>${item}</li>\n`;
      }
      sectionsHtml += '        </ol>\n';
    }
  }

  let sidebarHtml = '';
  for (const link of a.enSidebar) {
    sidebarHtml += `        <a class="card-link" href="${link.href}">${link.text}</a>\n`;
  }

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${jstr(a.enTitle)} | Zi Wei Dou Shu</title>
  <meta name="description" content="${jstr(a.enDesc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:title" content="${jstr(a.enTitle)}">
  <meta property="og:description" content="${jstr(a.enDesc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:image" content="https://yuetianai.com/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${jstr(a.enTitle)}",
  "description": "${jstr(a.enDesc)}",
  "image": "https://yuetianai.com/images/home2/triad-tian-bg.webp",
  "datePublished": "${date}",
  "dateModified": "${date}",
  "inLanguage": "en",
  "articleSection": "${jstr(a.enSection)}",
  "about": [
    ${aboutItems.join(',\n    ')}
  ],
  "author": {
    "@type": "Organization",
    "name": "YuetianAI"
  },
  "publisher": {
    "@type": "Organization",
    "name": "YuetianAI"
  },
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
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${jstr(a.enSection)}</span></nav>
          <h1>${a.enTitle}</h1>
          <p class="detail-subtitle">${a.enDesc}</p>
          <p class="article-meta"><span>${jstr(a.enSection)}</span><span><time datetime="${date}">2026-08-12 10:30</time></span></p>
        </div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${a.enLead}</p>
        <p>${a.enIntro2}</p>${sectionsHtml}
      </article>
      <aside class="side-panel detail-rail" aria-label="Article navigation">
        <h2>Read Next</h2>
${sidebarHtml}      </aside>
    </div>
    <div class="container article-bottom-link">
      <span>After reading, compare it with your own chart — it makes much more sense than concepts alone.</span>
      <a href="../../pages/mingbook-onepage.html">Quick Chart →</a>
    </div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">Yue ICP 2026055337-1</a>　<span>© 2026 YuetianAI. All Rights Reserved. Powered By Yuetian Studio</span>　</div></footer>
</body>
</html>`;
}

for (const a of articles) {
  const cnPath = path.join(__dirname, 'articles', `${a.slug}.html`);
  const enPath = path.join(__dirname, 'articles', 'en', `${a.slug}.html`);
  const cnHtml = buildCN(a).replace(/\r\n/g, '\n');
  const enHtml = buildEN(a).replace(/\r\n/g, '\n');
  fs.writeFileSync(cnPath, cnHtml, 'utf8');
  fs.writeFileSync(enPath, enHtml, 'utf8');
  console.log(`Created: ${a.slug} (CN: ${cnHtml.length} bytes, EN: ${enHtml.length} bytes)`);
}
