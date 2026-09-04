const fs = require('fs');
const path = require('path');

const date = '2026-08-15T10:15:00+08:00';

function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

const articles = [
  {
    slug: 'ziwei-ziwei-zuoming',
    cnTitle: '紫微斗数紫微坐命：帝星入命的人，领导欲强但最怕孤君',
    enTitle: 'Zi Wei Star in Life Palace: The Emperor\u2019s Burden',
    cnDesc: '紫微星坐命，天生有领导欲和贵气，但最怕没有辅星变成孤君。紫微坐命的人，面子比里子重要，学会用人才是真帝王。',
    enDesc: 'Zi Wei in the Life Palace brings natural leadership and nobility, but without assistant stars it becomes a lonely ruler. Face matters more than substance; learning to use people is the real emperor\u2019s skill.',
    cnLead: '紫微星坐命的人，身上有一种「我说了算」的气场。你可能从小就是孩子王，或者在团队里不自觉地就站到了C位。但紫微坐命有一个致命的问题——你太要面子，而且你不太会求人。帝星嘛，哪有皇帝求大臣的？可恰恰是「不求人」这三个字，让很多紫微坐命的人活成了孤家寡人。',
    cnIntro2: '紫微星是十四主星之首，五行属土，主尊贵、领导和权力。但紫微不是一颗「自己干活」的星——它是皇帝，皇帝需要百官。没有左辅右弼、天魁天钺的紫微，就像没有大臣的皇帝，空有龙椅，政令出不了宫门。',
    cnSections: [
      { h: '紫微坐命的核心特质', ps: [
        '紫微坐命的人有几个明显特征：第一，好面子，你可以杀他但不能辱他；第二，有领导欲，在群体里不自觉地想做主；第三，耳根子软，喜欢听好话，被捧两句就飘；第四，眼高手低，看得远但不一定做得细。',
        '紫微星的「贵气」是真的——你通常气质不错、审美在线、对低劣的东西有本能的排斥。但这种贵气也让你放不下身段：明明自己动手能解决的事，你偏要等别人来做；明明道个歉就能翻篇，你偏要硬撑。',
        '紫微坐命的人适合做管理、创业、从政——任何需要「拍板」的位置。但你不适合做执行层的螺丝钉，因为你受不了被人管，也受不了做重复的事。'
      ]},
      { h: '紫微最怕孤君', ps: [
        '紫微坐命最需要看的不是紫微本身，而是它旁边有没有「百官」。左辅右弼是左右手，天魁天钺是贵人，文昌文曲是智囊，禄存天马是钱粮。有这些星拱照，紫微才是真皇帝；没有，就是孤君。',
        '孤君紫微是什么状态？有野心但没人帮，有想法但落不了地，身边人要么服你但能力不行，要么能力行但不服你。你可能一辈子都在找「靠谱的人」，但总觉得谁都不够格。',
        '举个组合：紫微在午宫坐命，无左辅右弼，加擎羊陀罗。这叫「暴君」——自己能力有限但脾气很大，听不进意见，身边人敢怒不敢言，最后众叛亲离。反过来，紫微在子坐命，左右魁钺昌曲齐会，这叫「明君」——不用自己干活，文武百官帮你打天下。'
      ]},
      { h: '紫微的四化', ps: [
        '紫微化权：领导力加强，说一不二，适合掌权。但也更霸道，容易听不进意见。',
        '紫微化科：名声好，有贵人提携，适合走体制内或需要名声的路线。贵气中带文雅，不像化权那么硬。',
        '紫微不化禄也不化忌（在乙干四化中紫微化权，在丙干四化中紫微化科）。这意味着紫微本身不主财也不主灾——它的好坏全看周围的星怎么配。'
      ]},
      { h: '紫微在不同宫位的差异', ps: [
        '紫微在子午宫（入庙）：气场最强，领导力最足，但也最孤。需要辅星来配。',
        '紫微在辰戌丑未宫（得地）：稳重务实，能守成，但开创力稍弱。',
        '紫微在寅申巳亥宫（落陷）：贵气打折，容易眼高手低，理想大过能力。需要更努力才能匹配野心。',
        '紫微永远和天府在三合相会。紫微是帝王，天府是府库，两个一起出现时，既有权力又有资源，是很好的组合。'
      ]},
      { h: '排盘后的使用顺序', ps: ['紫微坐命，按这个顺序读：'], ol: [
        '先看有没有左辅右弼——有则有人帮，无则孤君。',
        '看有没有天魁天钺——有则贵人多，关键时刻有人拉一把。',
        '看有没有文昌文曲——有则有智囊，决策更周全。',
        '看煞星：擎羊陀罗会让紫微变暴君，火铃让脾气急躁，空劫让贵气变空想。',
        '看四化：化权主掌权，化科主名声。',
        '看对宫迁移宫：紫微坐命的人，在外的表现跟在家里很不一样。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-tianfu-zuoming.html', text: '天府坐命' },
      { href: 'ziwei-tianxiang-zuoming.html', text: '天相坐命' },
      { href: 'ziwei-qisha-zuoming.html', text: '七杀坐命' },
      { href: 'ziwei-pojun-zuoming.html', text: '破军坐命' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Zi Wei in the Life Palace carry a "what I say goes" aura. You may have been the kid leader or the one who naturally takes center stage. But there\u2019s one fatal flaw: you care too much about face and hate asking for help. An emperor doesn\u2019t beg his ministers — yet "not asking" is exactly what turns many Zi Wei people into lonely rulers.',
    enIntro2: 'Zi Wei is the first of the fourteen main stars, element Earth, ruling nobility, leadership, and authority. But it isn\u2019t a do-it-yourself star — it\u2019s the emperor, and an emperor needs a court. Without Zuo Fu, You Bi, Kui, and Yue, Zi Wei is an emperor with no ministers: a throne with no reach.',
    enSections: [
      { h: 'Core Traits', ps: [
        'Several traits stand out: first, face matters — you can be killed but not humiliated; second, leadership drive — you naturally want to call the shots; third, you\u2019re susceptible to flattery; fourth, big vision but weak execution on details.',
        'The nobility is real — you usually have good taste and instinctive dislike of the shoddy. But it also makes you unable to lower yourself: things you could do yourself, you wait for others to handle; apologies that would settle things, you refuse to make.',
        'Zi Wei suits management, entrepreneurship, politics — any seat where decisions get made. It doesn\u2019t suit being a cog; you hate being managed and doing repetitive work.'
      ]},
      { h: 'The Lonely Emperor', ps: [
        'What matters most isn\u2019t Zi Wei itself but whether it has a court. Zuo Fu/You Bi are the right and left hands; Kui/Yue are benefactors; Chang/Qu are the brain trust; Lu Cun/Tian Ma are the treasury. With them, Zi Wei is a true emperor; without, a lonely one.',
        'A lonely Zi Wei has ambition but no help, ideas but no execution. People around you are either loyal but incapable, or capable but disloyal. You spend life looking for "reliable people" and finding no one good enough.',
        'Example: Zi Wei in Wu palace without Zuo Fu/You Bi, with Qing Yang and Tuo Luo — a tyrant: limited ability but a big temper, deaf to advice, ultimately abandoned. Conversely, Zi Wei in Zi with all six auspicious stars — a wise ruler who doesn\u2019t lift a finger while the court runs the empire.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Zi Wei Hua Quan: stronger leadership, decisive, suited to power. But also more domineering and deaf to input.',
        'Zi Wei Hua Ke: good reputation, benefactor promotion, suited to institutional or reputation-based paths. Nobility with refinement, less rigid than Hua Quan.',
        'Zi Wei never transforms to Hua Lu or Hua Ji. This means it inherently rules neither wealth nor disaster — its quality depends entirely on surrounding stars.'
      ]},
      { h: 'Zi Wei in Different Palaces', ps: [
        'Zi Wei in Zi/Wu (exalted): strongest aura and leadership, but also loneliest. Needs assistant stars.',
        'Zi Wei in Chen/Xu/Chou/Wei (moderate): steady and pragmatic, good at holding ground, weaker at pioneering.',
        'Zi Wei in Yin/Shen/Si/Hai (detriment): nobility diminished, prone to overreaching, ambition outpacing ability. More effort needed.',
        'Zi Wei always meets Tian Fu in the triple combination. Emperor plus treasury — power and resources together, an excellent pairing.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Zi Wei in Life:'], ol: [
        'Check Zuo Fu/You Bi — with them, help; without, lonely ruler.',
        'Check Kui/Yue — with them, benefactors at key moments.',
        'Check Chang/Qu — with them, a brain trust and better decisions.',
        'Check malefics: Qing Yang/Tuo Luo make a tyrant; Huo Ling make temper; Kong Jie turn nobility into fantasy.',
        'Check transformations: Hua Quan = power, Hua Ke = reputation.',
        'Read the opposite Travel Palace — Zi Wei people behave very differently at home and away.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-tianfu-zuoming.html', text: 'Tian Fu in Life' },
      { href: 'ziwei-tianxiang-zuoming.html', text: 'Tian Xiang in Life' },
      { href: 'ziwei-qisha-zuoming.html', text: 'Qi Sha in Life' },
      { href: 'ziwei-pojun-zuoming.html', text: 'Po Jun in Life' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-taiyang-zuoming',
    cnTitle: '紫微斗数太阳坐命：光明磊落的付出型人格，但别把自己烧干',
    enTitle: 'Tai Yang Star in Life Palace: The Giver Who Burns Out',
    cnDesc: '太阳星坐命，热情大方、乐于助人，但也容易过度付出、为面子所累。太阳的光要照别人，但首先要照自己。',
    enDesc: 'Tai Yang in the Life Palace brings warmth, generosity, and helpfulness, but also over-giving and exhaustion from living for others\u2019 approval. The sun shines on others \u2014 but must shine on itself first.',
    cnLead: '太阳坐命的人，身上有一种「热」。你走进一个房间，气氛会亮起来；朋友有难，第一个想到的是你。但太阳坐命的人也有一个通病——你照亮了所有人，唯独忘了自己。你付出了太多，等到自己需要的时候，发现身边没人。',
    cnIntro2: '太阳星五行属火，主光明、博爱、名声和付出。它是天上的太阳，无私地照耀万物。但太阳也有日夜之分——白天出生的太阳光芒万丈，晚上出生的太阳有力使不出。太阳坐命的人，一辈子都在学一件事：如何在照亮别人的同时，不把自己烧干。',
    cnSections: [
      { h: '太阳坐命的核心特质', ps: [
        '太阳坐命的人有几个标签：热心、直爽、爱面子、闲不住。你见不得别人受苦，帮了人还不要回报——但你心里其实希望被看见、被感谢。如果你的付出被当成理所当然，你会特别寒心。',
        '太阳也主名声。你很在意自己在别人眼里的形象，宁可自己吃亏也不能让人说不好。这种「好名声」的执念让你活得累——你不会拒绝，因为拒绝了就不是好人了。',
        '太阳坐命的人适合做公益、教育、传媒、政府工作——任何需要「发光发热」的行业。你也适合做销售和公关，因为你的热情是真的，别人感受得到。'
      ]},
      { h: '白天太阳和晚上太阳', ps: [
        '太阳在卯辰巳午未申宫（白天），光芒足，付出有回报，名声好，贵人多。尤其是午宫的太阳，叫「日丽中天」，是太阳最好的位置。',
        '太阳在酉戌亥子丑寅宫（晚上），光芒弱，付出多回报少，容易「为他人作嫁衣裳」。尤其是子宫的太阳，叫「日照雷门」，虽然弱但有爆发力，适合在逆境中翻盘。',
        '举个组合：太阳在午宫坐命，加化禄化权。这是太阳最好的配置——名声大、有实权、付出有回报。反过来，太阳在亥宫坐命，加化忌，这叫「太阳反背」——付出最多但最不被理解，容易遇到白眼狼。'
      ]},
      { h: '太阳的四化', ps: [
        '太阳化禄：靠名声赚钱，适合做品牌、传媒、教育。付出能得到物质回报。',
        '太阳化权：掌权，适合做领导。但太阳化权的领导风格是「我说的对」——比较强势，容易一言堂。',
        '太阳化科：名声最好，适合走学术、考试、体制内路线。贵而不显，细水长流。',
        '太阳化忌：最辛苦的配置。付出不被认可，好心没好报，男命跟父亲或儿子关系有结，女命跟丈夫或儿子缘分薄。但太阳化忌的人如果熬过中年，晚年反而踏实。'
      ]},
      { h: '太阳和太阴的关系', ps: [
        '太阳和太阴永远在三合相会。太阳主贵（名声、地位），太阴主富（钱财、房产）。太阳坐命的人，如果太阴也强，叫「日月并明」——既有名又有利。',
        '如果太阳强太阴弱，叫「日照雷门」——有名但钱不够；如果太阴强太阳弱，叫「明珠出海」——有钱但名声不够。两个都强最好，两个都弱最辛苦。',
        '太阳坐命的人，通常跟父亲、丈夫、儿子的关系是人生课题。太阳也代表男性长辈，化忌时这些关系容易有结。'
      ]},
      { h: '排盘后的使用顺序', ps: ['太阳坐命，按这个顺序读：'], ol: [
        '先看太阳在什么宫位——白天宫还是晚上宫，决定了光芒够不够。',
        '看有没有化禄化权化科——有则名声地位有靠，化忌则辛苦。',
        '看太阴——三合会太阴，太阴强则财运好。',
        '看煞星：擎羊让太阳变暴躁，陀罗让付出拖延，空劫让名声落空。',
        '看天魁天钺——太阳坐命有贵人，事业更顺。',
        '看你是否过度付出——学会拒绝是太阳坐命的必修课。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-taiyin-zuoming.html', text: '太阴坐命' },
      { href: 'ziwei-jumen-zuoming.html', text: '巨门坐命' },
      { href: 'ziwei-tianliang-zuoming.html', text: '天梁坐命' },
      { href: 'ziwei-fumugong.html', text: '父母宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Tai Yang in the Life Palace carry heat. You walk into a room and the atmosphere brightens; when friends are in trouble, you\u2019re the first call. But the common flaw is this: you illuminate everyone but forget yourself. You give too much, and when you finally need help, no one\u2019s there.',
    enIntro2: 'Tai Yang is element Fire, ruling light, benevolence, reputation, and giving. It is the sun in the sky, shining selflessly. But the sun has day and night: a daytime sun blazes; a nighttime sun can\u2019t express its power. Tai Yang people spend life learning one thing: how to shine on others without burning dry.',
    enSections: [
      { h: 'Core Traits', ps: [
        'Labels: warm-hearted, direct, face-conscious, unable to sit still. You can\u2019t bear seeing others suffer and help without asking return \u2014 but secretly you want to be seen and thanked. When your giving is taken for granted, it cuts deep.',
        'Tai Yang also rules reputation. You care deeply about image, preferring to lose out than be spoken of badly. This "good name" fixation is exhausting: you can\u2019t say no because saying no makes you a bad person.',
        'Suits charity, education, media, government \u2014 any field where you shine. Also sales and PR, because your warmth is genuine and people feel it.'
      ]},
      { h: 'Day Sun vs Night Sun', ps: [
        'Tai Yang in Mao/Chen/Si/Wu/Wei/Shen (daytime): strong light, giving brings return, good reputation, many benefactors. Wu palace is "sun at midday" \u2014 the best position.',
        'Tai Yang in You/Xu/Hai/Zi/Chou/Yin (nighttime): weak light, more giving than return, "making wedding clothes for others." Zi palace is "sun at the thunder gate" \u2014 weak but explosive, good at comeback.',
        'Example: Tai Yang in Wu with Hua Lu and Hua Quan \u2014 the best configuration: fame, real power, rewarded giving. Conversely, Tai Yang in Hai with Hua Ji \u2014 "sun reversed": gives the most but is understood the least, attracting ingrates.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Tai Yang Hua Lu: earning through reputation \u2014 brand, media, education. Giving brings material return.',
        'Tai Yang Hua Quan: holding power, suited to leadership. Style is "I\u2019m right" \u2014 dominant, prone to one-man rule.',
        'Tai Yang Hua Ke: best reputation, suited to academia, exams, institutions. Noble understated, steady.',
        'Tai Yang Hua Ji: the hardest configuration. Giving unrecognized, good intentions met badly. For men, knots with father/son; for women, thin bonds with husband/son. But those who survive midlife find solid footing later.'
      ]},
      { h: 'Tai Yang and Tai Yin', ps: [
        'Tai Yang and Tai Yin always meet in triple combination. Tai Yang rules nobility (fame, status); Tai Yin rules wealth (money, property). When both are strong, "sun and moon both bright" \u2014 fame and fortune.',
        'Strong sun weak moon = fame without enough money; strong moon weak sun = money without reputation. Both strong is best; both weak is hardest.',
        'For Tai Yang people, relationships with father, husband, and sons are life lessons. Tai Yang represents male elders; with Hua Ji, these bonds knot easily.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Tai Yang in Life:'], ol: [
        'Which palace is it in \u2014 daytime or nighttime? That determines the light.',
        'Check Hua Lu/Quan/Ke \u2014 with them, fame and status have support; Hua Ji means hardship.',
        'Check Tai Yin in triple combination \u2014 strong Tai Yin means good finances.',
        'Check malefics: Qing Yang = irritability, Tuo Luo = delayed return, Kong Jie = empty reputation.',
        'Check Kui/Yue \u2014 benefactors smooth the career.',
        'Are you over-giving? Learning to refuse is required.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-taiyin-zuoming.html', text: 'Tai Yin in Life' },
      { href: 'ziwei-jumen-zuoming.html', text: 'Ju Men in Life' },
      { href: 'ziwei-tianliang-zuoming.html', text: 'Tian Liang in Life' },
      { href: 'ziwei-fumugong.html', text: 'The Parents Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-wuqu-zuoming',
    cnTitle: '紫微斗数武曲坐命：财星入命的实干家，能赚钱但别太硬',
    enTitle: 'Wu Qu Star in Life Palace: The Doer Who Means Business',
    cnDesc: '武曲星坐命，务实、刚毅、财商高，是天生的行动派。但武曲也主孤克，太硬容易伤感情，学会柔软是功课。',
    enDesc: 'Wu Qu in the Life Palace brings pragmatism, resolve, and financial acumen \u2014 a born doer. But it also means isolation; too much hardness damages relationships, and softening is the lesson.',
    cnLead: '武曲坐命的人，身上有一种「别废话，干活」的气质。你不喜欢空谈，觉得想一百遍不如做一遍。你在朋友里通常是「最靠谱」的那个——答应的事一定做到，做不到的不轻易答应。但武曲坐命的人也有一个问题：你太硬了。硬到身边人觉得你不需要关心，硬到有苦自己咽，硬到把柔软当成软弱。',
    cnIntro2: '武曲星五行属金，是正财星，主财帛、行动和刚毅。它跟紫微不同——紫微是发号施令的，武曲是自己拿刀上战场的。武曲坐命的人，钱是靠实干赚来的，不是靠关系或运气。但金也主肃杀，武曲坐命的人性格里有「冷」的一面，需要火来暖、需要水来润。',
    cnSections: [
      { h: '武曲坐命的核心特质', ps: [
        '武曲坐命的人：第一，务实，不搞虚的；第二，有毅力，认准的事九头牛拉不回；第三，财商高，对钱敏感，知道怎么赚怎么存；第四，寡言，不是不会说，是觉得没必要说。',
        '你在感情里可能比较「钝」——伴侣说「我没事」，你真的以为没事；你表达爱的方式是做事而不是说话。这让你的伴侣觉得你不够浪漫，但你觉得「我钱都给你了还要怎样」。',
        '武曲坐命的人适合金融、财务、工程、军警、技术——任何需要「硬技能」和执行力的领域。你不适合做纯人际关系的工作，因为你懒得应酬。'
      ]},
      { h: '武曲的财', ps: [
        '武曲是正财星，不是偏财星。你的钱靠工资、经营、技术赚来，不是靠买彩票或投机。武曲化禄的人，正财旺，收入稳定增长；武曲化权的人，靠管钱赚钱，适合财务总监或银行高管。',
        '武曲化忌是另一回事——正财受阻，可能是收入低、破财、或者因钱生灾。武曲化忌的人要特别注意不要跟人有金钱纠纷，也不要做高风险投资。',
        '武曲和禄存同宫是最好的财配置——禄存是「存」，武曲是「赚」，又赚又存，财富能积累。武曲加天马叫「财马交驰」，靠动中求财，适合做贸易或经常出差的工作。'
      ]},
      { h: '武曲的孤克', ps: [
        '武曲五行属金，金性肃杀，所以武曲坐命的人有「孤克」的一面——跟六亲缘分薄，或者婚姻不顺。尤其是武曲在辰戌丑未宫（天罗地网宫），性格更硬，婚姻更需要经营。',
        '武曲加擎羊叫「刑杖」，容易有官司或外伤；武曲加陀罗叫「铃昌陀武」格局的一部分，主意外；武曲加火星叫「寡宿」，婚姻容易冷战。',
        '但武曲的孤克不是无解。武曲坐命的人如果学会表达感情、学会说软话、学会在亲密关系里放下「对错」，婚姻可以很稳——因为你本身是负责任的人，问题只是不会表达。'
      ]},
      { h: '武曲的四化', ps: [
        '武曲化禄：正财旺，实干得财，是武曲最好的化。',
        '武曲化权：财权在手，适合管钱管资源，性格更果断也更硬。',
        '武曲化科：靠专业名声赚钱，适合金融、会计、审计，收入跟资质挂钩。',
        '武曲化忌：破财或因钱生灾，不要借钱、不要担保、不要投机。'
      ]},
      { h: '排盘后的使用顺序', ps: ['武曲坐命，按这个顺序读：'], ol: [
        '先看武曲在什么宫位——庙旺则执行力强，落陷则辛苦。',
        '看四化：化禄化权化科都好，化忌要防破财。',
        '看有没有禄存——有禄存则能存住钱。',
        '看煞星：擎羊主官司外伤，陀罗主拖延，火铃主急躁。',
        '看对宫迁移宫——武曲坐命的人在外更拼。',
        '看感情表达：你是否因为太硬而伤了身边人？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-tianfu-zuoming.html', text: '天府坐命' },
      { href: 'ziwei-qisha-zuoming.html', text: '七杀坐命' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Wu Qu in the Life Palace have a "cut the crap, get to work" air. You dislike empty talk and believe doing once beats thinking a hundred times. You\u2019re usually the most reliable friend \u2014 your word is your bond. But the problem is hardness: so hard that people think you don\u2019t need care, so hard that you swallow suffering alone, so hard that you mistake softness for weakness.',
    enIntro2: 'Wu Qu is element Metal, the primary wealth star, ruling finance, action, and resolve. Unlike Zi Wei who commands, Wu Qu takes the sword onto the battlefield itself. Money comes through doing, not connections or luck. But Metal also means austerity; Wu Qu people have a cold side that needs Fire to warm and Water to moisten.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, pragmatic \u2014 no fluff. Second, persistent \u2014 once committed, nine bulls can\u2019t pull you back. Third, financially sharp \u2014 sensitive to money, knowing how to earn and save. Fourth, taciturn \u2014 not unable to speak, but seeing no need.',
        'You may be "dense" in romance: when your partner says "I\u2019m fine," you believe it. You show love through deeds, not words. Your partner finds this unromantic; you think, "I gave you my paycheck \u2014 what more?"',
        'Suits finance, accounting, engineering, military/police, tech \u2014 any field requiring hard skills and execution. Not suited to pure relationship work; you can\u2019t be bothered with schmoozing.'
      ]},
      { h: 'Wu Qu and Money', ps: [
        'Wu Qu is the primary wealth star, not windfall wealth. Money comes through salary, business, skill \u2014 not lottery or speculation. Wu Qu Hua Lu means strong steady income; Wu Qu Hua Quan means earning by managing money, suited to CFO or banking.',
        'Wu Qu Hua Ji is different \u2014 income blocked, loss, or money trouble. Avoid lending, guarantees, and high-risk investment.',
        'Wu Qu with Lu Cun is the best wealth setup \u2014 Lu Cun saves, Wu Qu earns, wealth accumulates. Wu Qu with Tian Ma is "wealth and horse galloping" \u2014 earning through movement, suited to trade or travel-heavy work.'
      ]},
      { h: 'The Isolation of Metal', ps: [
        'Metal\u2019s austerity gives Wu Qu people an isolated edge \u2014 thin bonds with family, or rocky marriage. Especially in Chen/Xu/Chou/Wei (the net palaces), the character is harder and marriage needs more work.',
        'Wu Qu with Qing Yang is "punishment cane" \u2014 lawsuits or injury; Wu Qu with Tuo Luo is part of the accident pattern; Wu Qu with Huo Xing is "lone widow" \u2014 cold wars in marriage.',
        'But it isn\u2019t hopeless. If Wu Qu people learn to express feelings, speak softly, and set aside "right vs wrong" in intimacy, marriage can be solid \u2014 because you\u2019re responsible at core; you just don\u2019t show it.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Wu Qu Hua Lu: strong income, the best transformation for Wu Qu.',
        'Wu Qu Hua Quan: financial authority, suited to managing money/resources, more decisive and harder.',
        'Wu Qu Hua Ke: earning through professional reputation \u2014 finance, accounting, audit; income tied to credentials.',
        'Wu Qu Hua Ji: loss or money trouble \u2014 no lending, guarantees, or speculation.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Wu Qu in Life:'], ol: [
        'Which palace is it in \u2014 exalted means strong execution, detriment means toil.',
        'Check transformations: Lu/Quan/Ke are good; Ji warns of loss.',
        'Check Lu Cun \u2014 with it, money stays.',
        'Check malefics: Qing Yang = lawsuits/injury, Tuo Luo = delay, Huo Ling = impatience.',
        'Read the opposite Travel Palace \u2014 Wu Qu people push harder away from home.',
        'Are you so hard you\u2019re hurting those close to you?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-tianfu-zuoming.html', text: 'Tian Fu in Life' },
      { href: 'ziwei-qisha-zuoming.html', text: 'Qi Sha in Life' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tiantong-zuoming',
    cnTitle: '紫微斗数天同坐命：福星入命的人，随和但别懒',
    enTitle: 'Tian Tong Star in Life Palace: The Lucky Star Who Must Not Coast',
    cnDesc: '天同星坐命，随和乐观、人缘好、有福报。但天同也主懒散，太安逸会废掉，福星也要努力才接得住福。',
    enDesc: 'Tian Tong in the Life Palace brings easygoing optimism, popularity, and good fortune. But it also means laziness; too much comfort wastes potential. Even a lucky star must work to hold its blessings.',
    cnLead: '天同坐命的人，是十四主星里最「好相处」的。你脾气好、不爱争、懂得享受生活，朋友跟你在一起觉得舒服。但天同坐命有一个陷阱——你太容易满足了。别人在拼命的时候你在喝茶，不是你没能力，是你觉得「这样也挺好」。可等到你发现「这样不够好」的时候，可能已经晚了。',
    cnIntro2: '天同星五行属水，是福星，主安乐、享受和人缘。它是十四主星里最「软」的一颗——没有紫微的霸气，没有武曲的硬气，像个被宠大的孩子。但福星不等于不用努力——天同的福是「有福气」，但福气要靠行动去接，躺着等是等不来的。',
    cnSections: [
      { h: '天同坐命的核心特质', ps: [
        '天同坐命的人：第一，脾气好，很少真的生气；第二，人缘好，因为你不争不抢；第三，懂享受，美食、旅行、艺术你都喜欢；第四，懒，能坐不站、能躺不坐。',
        '你在团队里是「老好人」——谁都不得罪，但也意味着谁都不把你当对手。你可能被低估，因为你不爱表现。但天同坐命的人一旦被逼到墙角，爆发力很强——因为你平时不发力，一发就是全力。',
        '天同坐命的人适合服务、餐饮、旅游、文创、幼教——任何让人「舒服」的行业。你不适合高压竞争的环境，因为你不喜欢冲突。'
      ]},
      { h: '福星的陷阱', ps: [
        '天同最大的问题是「懒」和「怕苦」。你遇到困难的第一反应不是冲上去，而是绕着走或者等别人解决。这让你在年轻时可能错过很多机会——不是你不行，是你没试。',
        '天同加煞星反而好——擎羊、陀罗、火铃会「逼」着天同动起来。所谓「福星夹煞，反为美局」，就是这个道理。太顺的天同反而平庸，有压力的天同才能成事。',
        '举个组合：天同在亥宫坐命（入庙），加化禄。这是天同最好的位置——福气足、人缘好、一生顺遂。但如果不加煞星，这个人可能一辈子舒舒服服但没什么成就。反过来，天同加擎羊，虽然辛苦，但能被逼出成绩。'
      ]},
      { h: '天同的四化', ps: [
        '天同化禄：福气最足，人缘最好，一生少灾。但也最懒，需要主动给自己找目标。',
        '天同化权：福星有了行动力，是天同最好的化——既有福气又有执行力。',
        '天同化科：名声好、有贵人，适合走文化、艺术、服务路线。',
        '天同不化忌。这意味着天同本身不主灾——它的问题是「不够努力」而不是「倒霉」。'
      ]},
      { h: '天同和天梁、天机的关系', ps: [
        '天同永远和天梁、天机在三合相会。天同是福星，天梁是荫星，天机是智慧星。三个在一起叫「机月同梁」格局——适合做公务员、幕僚、稳定的工作。',
        '但「机月同梁」也有一个问题：太稳了，稳到没有冲劲。这个格局的人适合在体制内发展，不适合创业——除非有煞星或化权来激发。',
        '天同坐命的人，感情通常比较顺——因为你脾气好，伴侣跟你在一起不累。但你可能因为太随和而缺乏主见，让伴侣觉得你不够有担当。'
      ]},
      { h: '排盘后的使用顺序', ps: ['天同坐命，按这个顺序读：'], ol: [
        '先看天同在什么宫位——亥宫最好，寅申巳亥宫也不错。',
        '看四化：化权最好（福星有行动力），化禄最有福气但也最懒。',
        '看有没有煞星——有煞星反而能激发斗志。',
        '看三合：天机、天梁是否强，决定了智慧和贵人运。',
        '看对宫事业宫——天同坐命的人在事业上容易安于现状。',
        '问自己：你是不是在用「随和」掩盖「不敢争取」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-tianliang-zuoming.html', text: '天梁坐命' },
      { href: 'ziwei-tianji-zuoming-wenguan-dizi.html', text: '天机坐命' },
      { href: 'ziwei-taiyin-zuoming.html', text: '太阴坐命' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Tian Tong in the Life Palace are the easiest to get along with among the fourteen stars. Good-tempered, non-competitive, knowing how to enjoy life \u2014 friends feel comfortable around you. But there\u2019s a trap: you\u2019re too easily satisfied. While others grind, you\u2019re having tea \u2014 not from inability, but because "this is fine." By the time you realize it isn\u2019t, it may be late.',
    enIntro2: 'Tian Tong is element Water, the fortune star, ruling comfort, enjoyment, and popularity. It\u2019s the softest of the fourteen \u2014 no Zi Wei dominance, no Wu Qu hardness, like a spoiled child. But fortune doesn\u2019t mean no effort: Tian Tong\u2019s blessings must be caught through action; lying still won\u2019t bring them.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, good-tempered \u2014 rarely truly angry. Second, popular \u2014 because you don\u2019t compete. Third, hedonistic in the best sense \u2014 food, travel, art. Fourth, lazy \u2014 sit if you can, lie down if you can sit.',
        'You\u2019re the "nice guy" on the team \u2014 offending no one, which also means no one sees you as a threat. You may be underestimated because you don\u2019t show off. But when backed into a corner, Tian Tong people have explosive power \u2014 you don\u2019t push often, so when you do it\u2019s full force.',
        'Suits service, F&B, tourism, creative, early childhood \u2014 anything that makes people comfortable. Not suited to high-pressure competition; you dislike conflict.'
      ]},
      { h: 'The Trap of the Fortune Star', ps: [
        'The biggest problems are laziness and fear of hardship. Your first reaction to difficulty isn\u2019t charging in but going around or waiting for someone else. This makes you miss opportunities young \u2014 not inability, but not trying.',
        'Malefics actually help Tian Tong \u2014 Qing Yang, Tuo Luo, Huo Ling force it to move. "Fortune star flanked by malefics becomes a fine configuration." A too-comfortable Tian Tong is mediocre; a pressured one achieves.',
        'Example: Tian Tong in Hai (exalted) with Hua Lu \u2014 the best position: blessed, popular, smooth life. But without malefics, the person may be comfortable but unaccomplished. With Qing Yang, though hard, results are forced out.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Tian Tong Hua Lu: most blessed, most popular, fewest disasters. But also laziest \u2014 set your own goals.',
        'Tian Tong Hua Quan: the best transformation \u2014 fortune plus execution.',
        'Tian Tong Hua Ke: good reputation, benefactors, suited to culture, art, service.',
        'Tian Tong never transforms to Hua Ji. Its problem isn\u2019t bad luck but not trying hard enough.'
      ]},
      { h: 'Tian Tong, Tian Liang, and Tian Ji', ps: [
        'Tian Tong always meets Tian Liang and Tian Ji in triple combination. Tian Tong = fortune, Tian Liang = protection, Tian Ji = wisdom. Together they form the "Ji Yue Tong Liang" pattern \u2014 suited to civil service, staff roles, stable work.',
        'But the pattern is too stable \u2014 no drive. It suits institutional careers, not entrepreneurship \u2014 unless malefics or Hua Quan ignite it.',
        'Romance is usually smooth \u2014 your good temper makes partnership easy. But you may be so agreeable that you lack backbone, leaving your partner feeling you don\u2019t step up.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Tian Tong in Life:'], ol: [
        'Which palace \u2014 Hai is best; Yin/Shen/Si/Hai are also good.',
        'Check transformations: Hua Quan is best (fortune plus action); Hua Lu is most blessed but laziest.',
        'Check malefics \u2014 they actually ignite drive.',
        'Check triple combination: are Tian Ji and Tian Liang strong? That determines wisdom and protection.',
        'Read the opposite Career Palace \u2014 Tian Tong people easily coast at work.',
        'Ask: are you using "easygoing" to hide "afraid to fight for more"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-tianliang-zuoming.html', text: 'Tian Liang in Life' },
      { href: 'ziwei-tianji-zuoming-wenguan-dizi.html', text: 'Tian Ji in Life' },
      { href: 'ziwei-taiyin-zuoming.html', text: 'Tai Yin in Life' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-lianzhen-zuoming',
    cnTitle: '紫微斗数廉贞坐命：囚星入命的人，能干但别把自己困住',
    enTitle: 'Lian Zhen Star in Life Palace: The Prison Star Who Must Break Free',
    cnDesc: '廉贞星坐命，能干、好强、桃花旺，但也主「囚」——容易被自己的执念困住。廉贞坐命的人，学会放下就是破局。',
    enDesc: 'Lian Zhen in the Life Palace brings capability, competitiveness, and charm, but also "imprisonment" \u2014 being trapped by your own fixations. Learning to let go is how you break out.',
    cnLead: '廉贞坐命的人，身上有一种「又能干又别扭」的气质。你能力很强，做事漂亮，别人搞不定的事你能搞定。但你心里有一个牢笼——可能是一段放不下的感情、一个解不开的结、或者一种「我偏要证明给你看」的执念。廉贞坐命的人，一辈子都在跟自己较劲。',
    cnIntro2: '廉贞星五行属火（又属水），是「囚星」，主权力、桃花和纠葛。它是十四主星里最复杂的一颗——既能干又纠结，既桃花又忠贞，既想当官又想自由。廉贞坐命的人，人生像过山车——大起大落，但从来不会无聊。',
    cnSections: [
      { h: '廉贞坐命的核心特质', ps: [
        '廉贞坐命的人：第一，能干，执行力强，做事有章法；第二，好强，不服输，什么都要争第一；第三，桃花旺，魅力强，异性缘好；第四，纠结，心里有很多「为什么」和「凭什么」。',
        '你在感情里是「烈性子」——爱起来轰轰烈烈，恨起来也彻彻底底。你不能接受平淡的感情，要么全有要么全无。这让你的感情经历比别人丰富，但也比别人痛。',
        '廉贞坐命的人适合做政法、纪检、管理、艺术——任何需要「敢拍板、能扛事」的领域。你也适合做跟美有关的行业，因为廉贞主桃花和审美。'
      ]},
      { h: '廉贞为什么叫囚星', ps: [
        '廉贞被称为「囚星」，因为它的能量是「困住」——不是别人困你，是你自己困自己。你可能困在一段关系里、困在一个执念里、困在「我应该怎样」的剧本里。',
        '廉贞加擎羊叫「刑杖」，容易有官司或外伤；廉贞加天相同宫叫「府相朝垣」，是好格局；廉贞加贪狼叫「廉贪」，桃花极旺但也容易沉迷酒色；廉贞加七杀叫「廉杀」，能打能拼但性格刚烈。',
        '举个组合：廉贞在亥宫坐命，加贪狼。这叫「廉贪亥子」，桃花极旺，魅力十足，但如果控制不好欲望，容易在感情和享乐上栽跟头。反过来，廉贞在寅宫加天相，叫「刑囚夹印」，适合政法系统，能掌实权。'
      ]},
      { h: '廉贞的四化', ps: [
        '廉贞化禄：靠人际关系或桃花得财，适合做公关、销售、娱乐行业。但化禄的廉贞桃花更旺，要防感情纠纷。',
        '廉贞化权：掌权，适合做管理或政法。性格更硬，但也更容易跟人冲突。',
        '廉贞化科：名声好，适合走政治或学术路线。桃花变成了魅力而不是纠葛。',
        '廉贞化忌：最凶的化忌之一。主官司、车祸、感情纠纷、血光。廉贞化忌的人要特别注意法律和安全，不要冲动，不要走捷径。'
      ]},
      { h: '廉贞的桃花', ps: [
        '廉贞是次桃花星（贪狼是正桃花），主魅力和异性缘。廉贞坐命的人通常长得不错、会打扮、情商高，很容易吸引异性。',
        '但廉贞的桃花跟贪狼不同——贪狼是「百花丛中过」，廉贞是「真爱至上」。廉贞坐命的人虽然桃花多，但真正爱上一个人后是很忠贞的。问题是你爱上的人不一定对，或者你在错误的关系里不肯走。',
        '廉贞加红鸾天喜，正缘来得早；廉贞加咸池天姚，烂桃花多；廉贞化忌，感情是最大的劫。'
      ]},
      { h: '排盘后的使用顺序', ps: ['廉贞坐命，按这个顺序读：'], ol: [
        '先看廉贞跟什么星同宫——天相主稳，贪狼主桃花，七杀主刚，天府主财。',
        '看四化：化禄化权化科各有出路，化忌要防官司血光。',
        '看煞星：擎羊主刑伤，陀罗主纠缠，火铃主急躁。',
        '看桃花星：红鸾天喜主正缘，咸池天姚主烂桃花。',
        '看对宫迁移宫——廉贞坐命的人在外更敢闯。',
        '问自己：你心里困住你的那个「结」是什么？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-tanlang-zuoming.html', text: '贪狼坐命' },
      { href: 'ziwei-qisha-zuoming.html', text: '七杀坐命' },
      { href: 'ziwei-tianxiang-zuoming.html', text: '天相坐命' },
      { href: 'ziwei-fuqigong.html', text: '夫妻宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Lian Zhen in the Life Palace have an "able but twisted" air. You\u2019re highly capable and get things done that others can\u2019t. But inside there\u2019s a cage \u2014 a relationship you can\u2019t release, a knot you can\u2019t untie, an "I\u2019ll show you" fixation. Lian Zhen people spend life wrestling with themselves.',
    enIntro2: 'Lian Zhen is element Fire (and Water), the "prison star," ruling power, romance, and entanglement. It\u2019s the most complex of the fourteen \u2014 capable yet conflicted, charming yet loyal, ambitious for office yet craving freedom. Life is a roller coaster: big ups and downs, never boring.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, capable with strong execution and method. Second, competitive \u2014 you hate losing and want to be first. Third, strong charm and appeal to the opposite sex. Fourth, tangled inside \u2014 lots of "why" and "how dare."',
        'In love you\u2019re fiery \u2014 all-consuming love, thorough hatred. You can\u2019t accept bland relationships; all or nothing. This makes your love life richer but more painful.',
        'Suits law/politics, discipline, management, art \u2014 any field requiring decisiveness and backbone. Also beauty-related fields, since Lian Zhen rules charm and aesthetics.'
      ]},
      { h: 'Why the Prison Star?', ps: [
        'Lian Zhen is called the prison star because its energy traps \u2014 not others trapping you, but you trapping yourself. You may be trapped in a relationship, a fixation, a script of "I should be\u2026"',
        'With Qing Yang: "punishment cane" \u2014 lawsuits or injury. With Tian Xiang: "Fu Xiang Chao Yuan" \u2014 a fine pattern. With Tan Lang: "Lian Tan" \u2014 massive charm but risk of indulgence. With Qi Sha: "Lian Sha" \u2014 tough and fierce.',
        'Example: Lian Zhen in Hai with Tan Lang \u2014 "Lian Tan in Hai/Zi," enormous charm, but without self-control, trouble in love and pleasure. Conversely, Lian Zhen in Yin with Tian Xiang \u2014 "punishment and seal," suited to law enforcement with real authority.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Lian Zhen Hua Lu: earning through relationships or charm \u2014 PR, sales, entertainment. But more romance; watch for disputes.',
        'Lian Zhen Hua Quan: holding power \u2014 management or law. Harder, but more conflict-prone.',
        'Lian Zhen Hua Ke: good reputation \u2014 politics or academia. Charm becomes magnetism rather than entanglement.',
        'Lian Zhen Hua Ji: one of the fiercest Hua Ji \u2014 lawsuits, accidents, romantic disputes, blood injury. Be extremely careful with law and safety; no impulsiveness or shortcuts.'
      ]},
      { h: 'The Romance', ps: [
        'Lian Zhen is the secondary romance star (Tan Lang is primary), ruling charm and appeal. Lian Zhen people are usually attractive, well-dressed, socially adept, and draw attention.',
        'But unlike Tan Lang who samples everything, Lian Zhen is "true love supreme." Despite many suitors, once you love, you\u2019re loyal. The problem is loving the wrong person or refusing to leave a bad relationship.',
        'With Hong Luan/Tian Xi: early true love. With Xian Chi/Tian Yao: bad romances. With Hua Ji: love is the biggest disaster.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Lian Zhen in Life:'], ol: [
        'Which star shares the palace \u2014 Tian Xiang = steady, Tan Lang = romance, Qi Sha = fierce, Tian Fu = wealth.',
        'Check transformations: Lu/Quan/Ke have paths; Ji warns of lawsuits/injury.',
        'Check malefics: Qing Yang = injury, Tuo Luo = entanglement, Huo Ling = impatience.',
        'Check romance stars: Hong Luan/Tian Xi = true love; Xian Chi/Tian Yao = bad romances.',
        'Read the opposite Travel Palace \u2014 Lian Zhen people dare more away from home.',
        'What is the knot trapping you?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-tanlang-zuoming.html', text: 'Tan Lang in Life' },
      { href: 'ziwei-qisha-zuoming.html', text: 'Qi Sha in Life' },
      { href: 'ziwei-tianxiang-zuoming.html', text: 'Tian Xiang in Life' },
      { href: 'ziwei-fuqigong.html', text: 'The Spouse Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tianfu-zuoming',
    cnTitle: '紫微斗数天府坐命：库星入命的人，稳重但别太保守',
    enTitle: 'Tian Fu Star in Life Palace: The Treasury Keeper Who Must Not Hoard',
    cnDesc: '天府星坐命，稳重、可靠、有库藏，但也容易保守、安于现状。天府坐命的人，学会在稳和闯之间找平衡。',
    enDesc: 'Tian Fu in the Life Palace brings steadiness, reliability, and reserves, but also conservatism and complacency. The lesson is balancing stability with boldness.',
    cnLead: '天府坐命的人，是十四主星里最「让人放心」的。你稳重、踏实、说话算数，把事情交给你别人不用催。但天府坐命有一个问题——你太「稳」了。稳到不敢冒险，稳到错过机会，稳到在舒适区里待了十年还觉得「再等等」。天府是库星，库里有粮是好事，但粮放久了会陈。',
    cnIntro2: '天府星五行属土，是南斗主星，主库藏、稳重和包容。它跟紫微是「帝星」和「府星」的关系——紫微是皇帝，天府是内务府总管。天府坐命的人不一定当老大，但通常是「二把手」或「大管家」——那个真正管钱管物、让组织运转的人。',
    cnSections: [
      { h: '天府坐命的核心特质', ps: [
        '天府坐命的人：第一，稳重，天塌下来你最后慌；第二，可靠，答应的事一定办到；第三，有库藏意识，善于存钱和资源管理；第四，保守，对未知有本能的谨慎。',
        '你在团队里通常是「定海神针」——别人慌的时候你不慌，别人冲的时候你会先想退路。这让你很适合做副手或财务管理者，但也可能让你在需要all in的时候犹豫。',
        '天府坐命的人适合金融、财务、行政、后勤、房地产——任何需要「守」和「管」的领域。你不适合做高风险创业，除非有破军或七杀来激发。'
      ]},
      { h: '天府的库', ps: [
        '天府是「库星」，主库藏。天府坐命的人通常有存钱的习惯，也容易有房产和积蓄。但天府的库有一个问题——「库」有没有钥匙。天府的对宫永远是七杀，如果七杀带煞星冲过来，天府的库可能被「打开」——破财。',
        '天府加禄存是最好的配置——库里有粮，而且锁得紧。天府化科也不错，靠名声和信用赚钱。天府加化权，有管理权，但性格更固执。',
        '天府加空劫叫「空库」——看起来有钱但实际上存不住，或者钱在别人手里。天府加擎羊陀罗叫「暗库」——有钱但拿不出来，可能是固定资产变现难。'
      ]},
      { h: '天府和紫微的关系', ps: [
        '天府永远和紫微在三合相会。紫微是「创」的，天府是「守」的。两个在一起时，既有领导力又有执行力，是很好的组合。',
        '但天府坐命的人，如果紫微在三合带煞，可能遇到「能力强但不靠谱」的领导——你帮他守着家业，他在外面瞎折腾。这时候天府要学会「敢谏」——你不是只会点头的人。',
        '天府坐命的人，婚姻通常比较稳——因为你负责任、顾家。但你可能不够浪漫，伴侣觉得你「像木头」。学会表达感情，是天府的功课。'
      ]},
      { h: '天府的四化', ps: [
        '天府不化禄（天府本身就是库星，不需要化禄来加财）。',
        '天府化权：库星有了权力，适合管钱管人，但更固执。',
        '天府化科：靠信用和名声立足，适合银行、保险、信托。',
        '天府不化忌（天府是稳星，不主灾）。天府的问题是「太稳」而不是「倒霉」。'
      ]},
      { h: '排盘后的使用顺序', ps: ['天府坐命，按这个顺序读：'], ol: [
        '先看天府在什么宫位——庙旺则库实，落陷则库虚。',
        '看有没有禄存——有禄存则能存住钱。',
        '看对宫七杀——七杀入庙带吉则库有钥匙，带煞则库被冲开。',
        '看空劫——有空劫则是空库，存不住钱。',
        '看三合紫微——紫微强则有领导力，紫微弱则只能守成。',
        '问自己：你是在「稳健」还是在「逃避冒险」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-wuqu-zuoming.html', text: '武曲坐命' },
      { href: 'ziwei-tianxiang-zuoming.html', text: '天相坐命' },
      { href: 'ziwei-tianzhaigong.html', text: '田宅宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Tian Fu in the Life Palace are the most reassuring of the fourteen. Steady, grounded, true to your word \u2014 hand something to you and no one needs to chase you. But the problem is being too steady: too steady to risk, too steady to seize opportunities, too steady to spend a decade in the comfort zone saying "let\u2019s wait." Tian Fu is the treasury star \u2014 full granaries are good, but grain goes stale in storage.',
    enIntro2: 'Tian Fu is element Earth, the South Dipper\u2019s leader, ruling reserves, steadiness, and tolerance. It relates to Zi Wei as emperor to treasurer \u2014 Zi Wei rules; Tian Fu manages the imperial stores. Tian Fu people don\u2019t always lead, but they\u2019re usually the deputy or steward who actually keeps things running.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, steady \u2014 when the sky falls, you panic last. Second, reliable \u2014 your word is bond. Third, reserve-minded \u2014 good at saving and resource management. Fourth, conservative \u2014 instinctive caution toward the unknown.',
        'You\u2019re the anchor on a team \u2014 calm when others panic, thinking of exit routes when others charge. This suits deputy or financial management roles, but can make you hesitate when an all-in is needed.',
        'Suits finance, accounting, administration, logistics, real estate \u2014 anything requiring guarding and managing. Not suited to high-risk entrepreneurship unless Po Jun or Qi Sha ignites you.'
      ]},
      { h: 'The Treasury', ps: [
        'Tian Fu rules storage. Tian Fu people usually save and accumulate property. But the treasury needs a key. The opposite palace is always Qi Sha; if Qi Sha brings malefics, the treasury gets "opened" \u2014 loss.',
        'Tian Fu with Lu Cun is best \u2014 full granary, tightly locked. Tian Fu Hua Ke is also good \u2014 earning through trust and reputation. With Hua Quan, management authority but more stubbornness.',
        'With Kong Jie: "empty treasury" \u2014 looks wealthy but can\u2019t hold money, or money is in others\u2019 hands. With Qing Yang/Tuo Luo: "dark treasury" \u2014 money exists but can\u2019t be accessed, like illiquid fixed assets.'
      ]},
      { h: 'Tian Fu and Zi Wei', ps: [
        'Tian Fu always meets Zi Wei in triple combination. Zi Wei creates; Tian Fu preserves. Together they give leadership plus execution \u2014 excellent.',
        'But if Zi Wei in the triple brings malefics, you may have a capable but unreliable leader \u2014 you guard the estate while they gamble with it. Then Tian Fu must learn to speak up \u2014 you\u2019re not just a yes-man.',
        'Marriage is usually stable \u2014 you\u2019re responsible and home-oriented. But you may be unromantic, "like a block of wood." Learning to express feelings is the lesson.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Tian Fu never transforms to Hua Lu \u2014 it is already the treasury star.',
        'Tian Fu Hua Quan: the treasury gains authority, suited to managing money and people, but more stubborn.',
        'Tian Fu Hua Ke: standing on trust and reputation \u2014 banking, insurance, trust services.',
        'Tian Fu never transforms to Hua Ji. Its problem is being too steady, not bad luck.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Tian Fu in Life:'], ol: [
        'Which palace \u2014 exalted means full treasury, detriment means empty.',
        'Check Lu Cun \u2014 with it, money stays.',
        'Check opposite Qi Sha \u2014 exalted with auspicious stars means the treasury has a key; with malefics it gets broken open.',
        'Check Kong Jie \u2014 empty treasury, can\u2019t hold money.',
        'Check Zi Wei in triple \u2014 strong Zi Wei gives leadership; weak Zi Wei means only preserving.',
        'Are you being "steady" or avoiding risk?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-wuqu-zuoming.html', text: 'Wu Qu in Life' },
      { href: 'ziwei-tianxiang-zuoming.html', text: 'Tian Xiang in Life' },
      { href: 'ziwei-tianzhaigong.html', text: 'The Property Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-taiyin-zuoming',
    cnTitle: '紫微斗数太阴坐命：月亮入命的人，细腻但别太敏感',
    enTitle: 'Tai Yin Star in Life Palace: The Moon\u2019s Intuition and Sensitivity',
    cnDesc: '太阴星坐命，温柔细腻、直觉强、有财运，但也容易敏感多想。太阴坐命的人，学会把敏感变成天赋而不是内耗。',
    enDesc: 'Tai Yin in the Life Palace brings gentleness, intuition, and wealth potential, but also sensitivity and overthinking. The lesson is turning sensitivity into a gift rather than internal friction.',
    cnLead: '太阴坐命的人，身上有一种「月光」的气质——安静、温柔、细腻。你可能不是人群中最亮的那个，但你是最懂气氛的那个。谁心情不好、谁话里有话、谁在强颜欢笑，你一眼就能看出来。但这种敏感也是双刃剑——你太容易受环境影响，别人一个眼神你能想三天。',
    cnIntro2: '太阴星五行属水，是月星，主富、田宅和感情。它跟太阳相对——太阳主贵（名声地位），太阴主富（钱财房产）。太阴坐命的人，通常对钱和家有天生的感觉，但情绪像月亮一样有阴晴圆缺。',
    cnSections: [
      { h: '太阴坐命的核心特质', ps: [
        '太阴坐命的人：第一，细腻，对美和情绪有极强的感知力；第二，直觉准，你的第一感觉通常是对的；第三，恋家，喜欢布置和收拾；第四，敏感，容易受伤但不说。',
        '你在感情里是「慢热型」——不会一见钟情，但一旦投入就很深。你需要安全感，需要被「看见」。如果伴侣忽略了你，你不会大吵大闹，而是默默疏远。',
        '太阴坐命的人适合房地产、家居、艺术、设计、护理、心理咨询——任何需要「细腻感知」的领域。你也适合做跟钱有关的工作，因为太阴主富。'
      ]},
      { h: '月圆月缺', ps: [
        '太阴跟太阳一样，也有「月明月暗」之分。太阴在酉戌亥子丑寅宫（夜晚）最亮，尤其是酉宫和亥宫，叫「月朗天门」，财运最好。',
        '太阴在卯辰巳午未申宫（白天）光芒弱，叫「太阴落陷」，财运打折，感情也容易不顺。尤其是午宫的太阴，叫「日月反背」，最辛苦。',
        '举个组合：太阴在亥宫坐命，加化禄。这是太阴最好的配置——财运好、房产多、家庭美满。反过来，太阴在午宫坐命加化忌，叫「太阴化忌在午」，感情和财运都容易受挫，尤其是女性长辈和母亲的关系有结。'
      ]},
      { h: '太阴的财', ps: [
        '太阴是「富星」，主田宅和积蓄。太阴坐命的人通常对买房置产有直觉，也容易有暗财——不是工资那种明面上的钱，而是租金、投资、利息等「钱生钱」的收入。',
        '太阴化禄：财运最好，买房置业顺利，一生不缺钱。',
        '太阴化权：掌财权，适合做财务或房产管理，但性格更强势。',
        '太阴化科：靠名声或女性贵人得财，适合做文化、艺术、女性行业。',
        '太阴化忌：破财或感情受伤，尤其是跟女性或家人有关的财务纠纷。太阴化忌的人要注意母亲和妻子的健康。'
      ]},
      { h: '太阴和太阳的关系', ps: [
        '太阴永远和太阳在三合相会。两个都强叫「日月并明」，既有名又有利；两个都弱叫「双星落陷」，最辛苦。',
        '太阴坐命的人，通常跟母亲、妻子、女儿的关系是人生课题。太阴也代表女性贵人，庙旺时女性贵人多，落陷时女性关系有结。',
        '太阴坐命的男性，通常有「阴柔」的一面——细腻、体贴、懂女人，但也可能被说「不够man」。太阴坐命的女性，通常温柔有女人味，但要防过度依赖。'
      ]},
      { h: '排盘后的使用顺序', ps: ['太阴坐命，按这个顺序读：'], ol: [
        '先看太阴在什么宫位——夜晚宫（酉到寅）则月亮财旺，白天宫则月暗。',
        '看四化：化禄财运最好，化忌防破财和感情伤。',
        '看太阳——三合会太阳，太阳强则名利双收。',
        '看煞星：擎羊主感情冲突，陀罗主暗恋拖延，空劫主财来财去。',
        '看田宅宫——太阴主田宅，田宅宫好则房产运好。',
        '问自己：你的敏感是天赋还是内耗？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-taiyang-zuoming.html', text: '太阳坐命' },
      { href: 'ziwei-tiantong-zuoming.html', text: '天同坐命' },
      { href: 'ziwei-tianliang-zuoming.html', text: '天梁坐命' },
      { href: 'ziwei-tianzhaigong.html', text: '田宅宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Tai Yin in the Life Palace have moonlight qualities \u2014 quiet, gentle, perceptive. You may not be the loudest in a room, but you read the atmosphere best. Who\u2019s down, who means something other than what they say, who\u2019s faking a smile \u2014 you see it instantly. But this sensitivity cuts both ways: you absorb your environment so easily that one look from someone can occupy your mind for three days.',
    enIntro2: 'Tai Yin is element Water, the moon star, ruling wealth, property, and feelings. It pairs with Tai Yang \u2014 the sun rules nobility (fame/status), the moon rules wealth (money/property). Tai Yin people have a natural feel for money and home, but emotions wax and wane like the moon.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, perceptive \u2014 extraordinary sensitivity to beauty and emotion. Second, intuitive \u2014 your gut is usually right. Third, home-loving \u2014 you enjoy nesting and decorating. Fourth, sensitive \u2014 easily hurt but silent about it.',
        'In love you\u2019re the slow-burn type \u2014 no love at first sight, but deep investment once committed. You need security and to be "seen." If a partner neglects you, you don\u2019t fight; you quietly distance yourself.',
        'Suits real estate, home, art, design, nursing, counseling \u2014 any field requiring fine perception. Also money-related work, since Tai Yin rules wealth.'
      ]},
      { h: 'Full Moon and Dark Moon', ps: [
        'Like the sun, Tai Yin has bright and dark phases. In You/Xu/Hai/Zi/Chou/Yin (nighttime) it\u2019s brightest, especially You and Hai \u2014 "moon bright at the heavenly gate," best wealth luck.',
        'In Mao/Chen/Si/Wu/Wei/Shen (daytime) the light is weak \u2014 "Tai Yin detriment," reduced wealth and rocky romance. Wu palace is "sun and moon reversed," the hardest.',
        'Example: Tai Yin in Hai with Hua Lu \u2014 best configuration: strong finances, property, happy home. Conversely, Tai Yin in Wu with Hua Ji \u2014 financial and romantic setbacks, especially knots with mother or female elders.'
      ]},
      { h: 'Tai Yin Wealth', ps: [
        'Tai Yin is the wealth star, ruling property and savings. Tai Yin people have instinct for real estate and often have "hidden income" \u2014 rent, investment, interest, money generating money rather than just salary.',
        'Tai Yin Hua Lu: best wealth luck, smooth property purchases, never short of money.',
        'Tai Yin Hua Quan: financial authority, suited to finance or property management, but more forceful.',
        'Tai Yin Hua Ke: earning through reputation or female benefactors \u2014 culture, art, women\u2019s industries.',
        'Tai Yin Hua Ji: loss or heartbreak, especially financial disputes involving women or family. Watch mother\u2019s and wife\u2019s health.'
      ]},
      { h: 'Tai Yin and Tai Yang', ps: [
        'Tai Yin always meets Tai Yang in triple combination. Both strong = "sun and moon both bright," fame and fortune; both weak = hardest setup.',
        'For Tai Yin people, relationships with mother, wife, and daughters are life lessons. Tai Yin also represents female benefactors \u2014 many when exalted, knotty when in detriment.',
        'Men with Tai Yin often have a soft side \u2014 attentive, understanding of women \u2014 but may be called "not man enough." Women with Tai Yin are usually feminine and gentle, but guard against overdependence.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Tai Yin in Life:'], ol: [
        'Which palace \u2014 nighttime (You to Yin) means bright moon and wealth; daytime means dim.',
        'Check transformations: Hua Lu = best finances; Hua Ji = loss and heartbreak.',
        'Check Tai Yang in triple \u2014 strong sun means fame and fortune together.',
        'Check malefics: Qing Yang = romantic clash, Tuo Luo = unrequited dragging, Kong Jie = money through fingers.',
        'Check the Property Palace \u2014 Tai Yin rules real estate.',
        'Is your sensitivity a gift or self-consuming?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-taiyang-zuoming.html', text: 'Tai Yang in Life' },
      { href: 'ziwei-tiantong-zuoming.html', text: 'Tian Tong in Life' },
      { href: 'ziwei-tianliang-zuoming.html', text: 'Tian Liang in Life' },
      { href: 'ziwei-tianzhaigong.html', text: 'The Property Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tanlang-zuoming',
    cnTitle: '紫微斗数贪狼坐命：桃花星入命的人，多才多艺但别贪多',
    enTitle: 'Tan Lang Star in Life Palace: The Versatile Charm Who Must Focus',
    cnDesc: '贪狼星坐命，多才多艺、桃花旺、欲望强，但也容易贪多嚼不烂。贪狼坐命的人，学会聚焦是一辈子的功课。',
    enDesc: 'Tan Lang in the Life Palace brings versatility, charm, and strong desire, but also spreading yourself too thin. Focus is the lifelong lesson.',
    cnLead: '贪狼坐命的人，是十四主星里最「有趣」的。你什么都会一点、什么人都聊得来、到哪里都能迅速成为焦点。但贪狼坐命有一个致命问题——你太「贪」了。兴趣太多、欲望太多、想要的太多，结果是什么都想要、什么都没做到极致。贪狼是桃花星也是欲望星，你的人生课题不是「得到」，而是「取舍」。',
    cnIntro2: '贪狼星五行属木（又属水），是正桃花星，主欲望、才艺和交际。它是十四主星里最「活」的一颗——紫微是帝王，武曲是将军，贪狼是江湖侠客。贪狼坐命的人，人生体验比别人丰富十倍，但也容易在欲望里迷路。',
    cnSections: [
      { h: '贪狼坐命的核心特质', ps: [
        '贪狼坐命的人：第一，多才多艺，音乐、美术、运动、美食你都可能涉猎；第二，社交能力强，三教九流都能交朋友；第三，桃花旺，异性缘极好；第四，欲望强，对钱、权、情、乐都有追求。',
        '你在团队里是「开心果」和「万金油」——有你在不冷场，什么活你都能顶一下。但你也可能被认为「不专业」——因为你什么都会但什么都不精。',
        '贪狼坐命的人适合娱乐、餐饮、销售、公关、艺术——任何需要「跟人打交道」和「创意」的领域。你不适合做枯燥重复的工作，会憋出病来。'
      ]},
      { h: '贪狼的桃花', ps: [
        '贪狼是正桃花星，主异性缘和魅力。贪狼坐命的人通常很有「性魅力」——不一定是长得最好看的，但一定是最有吸引力的。',
        '贪狼的桃花跟廉贞不同——廉贞是「真爱至上」，贪狼是「百花齐放」。贪狼坐命的人年轻时通常感情经历丰富，需要在经历中学会什么是真正想要的。',
        '贪狼加红鸾天喜，正缘来得早且好；贪狼加咸池天姚，烂桃花多；贪狼加天魁天钺，桃花变成贵人；贪狼化忌，桃花变成劫——感情纠纷或因色破财。'
      ]},
      { h: '贪狼的欲望和修行', ps: [
        '贪狼主欲望——不只是色欲，还有物欲、权欲、求知欲。贪狼坐命的人如果控制不住欲望，容易沉迷——赌博、酒精、游戏、购物都可能成为坑。',
        '但贪狼有一个特殊的能力：如果有火铃来配，叫「火贪格」或「铃贪格」，主突发——可能突然暴富、突然成名。这是因为贪狼的欲望被火铃激发后，变成了巨大的行动力。',
        '举个组合：贪狼在丑宫坐命，加火星。这叫「火贪格」，如果大运流年引动，可能一夜暴富或突然成功。但火贪格的人也容易「暴起暴落」——成功后如果不收敛，摔得也快。'
      ]},
      { h: '贪狼的四化', ps: [
        '贪狼化禄：靠社交和才艺得财，适合娱乐、餐饮、销售。桃花更旺，要防感情纠纷。',
        '贪狼化权：欲望变成行动力，目标感强，适合创业。但也更霸道。',
        '贪狼不化科（贪狼主桃花和欲望，跟化科的「名声」不太搭）。',
        '贪狼化忌：欲望受阻或因欲望生灾——感情纠纷、破财、沉迷。贪狼化忌的人要学会「断舍离」，不是你的不要强求。'
      ]},
      { h: '排盘后的使用顺序', ps: ['贪狼坐命，按这个顺序读：'], ol: [
        '先看贪狼在什么宫位——庙旺则才艺出众，落陷则欲望泛滥。',
        '看有没有火铃——火贪格、铃贪格主突发。',
        '看桃花星：红鸾天喜主正缘，咸池天姚主烂桃花。',
        '看四化：化禄主社交得财，化忌防因欲生灾。',
        '看对宫——贪狼坐命的人在外更放得开。',
        '问自己：你想要的那么多，真正重要的是什么？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-lianzhen-zuoming.html', text: '廉贞坐命' },
      { href: 'ziwei-pojun-zuoming.html', text: '破军坐命' },
      { href: 'ziwei-qisha-zuoming.html', text: '七杀坐命' },
      { href: 'ziwei-fuqigong.html', text: '夫妻宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Tan Lang in the Life Palace are the most interesting of the fourteen. You know a little of everything, talk to anyone, and quickly become the center of attention. But the fatal flaw is greed \u2014 too many interests, too many desires, too many wants, and nothing mastered. Tan Lang is the romance star and the desire star; your lesson isn\u2019t getting, it\u2019s choosing what to give up.',
    enIntro2: 'Tan Lang is element Wood (and Water), the primary romance star, ruling desire, talent, and social skill. It\u2019s the most alive of the fourteen \u2014 Zi Wei is emperor, Wu Qu is general, Tan Lang is the wandering swordsman. Life experience is ten times richer, but it\u2019s easy to get lost in desire.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, versatile \u2014 music, art, sports, food, you dabble in all. Second, socially magnetic \u2014 friends across all walks. Third, strong romantic appeal. Fourth, strong desire \u2014 money, power, love, pleasure, all of it.',
        'You\u2019re the entertainer and the jack-of-all-trades \u2014 never a dull moment with you around, and you can cover any role. But you may be seen as "unprofessional" \u2014 good at everything, master of nothing.',
        'Suits entertainment, F&B, sales, PR, art \u2014 anything involving people and creativity. Boring repetitive work would make you ill.'
      ]},
      { h: 'The Romance', ps: [
        'Tan Lang is the primary romance star, ruling appeal and attraction. Tan Lang people usually have strong sexual charisma \u2014 not necessarily the best-looking, but the most magnetic.',
        'Unlike Lian Zhen\u2019s "true love supreme," Tan Lang samples the garden. Young Tan Lang people usually have rich romantic histories and learn through experience what they truly want.',
        'With Hong Luan/Tian Xi: early good match. With Xian Chi/Tian Yao: bad romances. With Kui/Yue: romance becomes benefactors. With Hua Ji: romance becomes disaster \u2014 disputes or loss through love.'
      ]},
      { h: 'Desire and Discipline', ps: [
        'Tan Lang rules desire \u2014 not just lust but material, power, and knowledge desires. Without control, Tan Lang people fall into addiction \u2014 gambling, alcohol, gaming, shopping.',
        'But Tan Lang has a special capacity: with Huo Xing or Ling Xing, it forms the "Fire Tan" or "Bell Tan" pattern \u2014 sudden windfall or fame. Desire ignited by the fire stars becomes enormous action.',
        'Example: Tan Lang in Chou with Huo Xing \u2014 "Fire Tan pattern." When activated by a cycle, sudden wealth or success. But Fire Tan people also rise and fall fast \u2014 without restraint after success, the crash is hard.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Tan Lang Hua Lu: earning through social skill and talent \u2014 entertainment, F&B, sales. More romance; watch disputes.',
        'Tan Lang Hua Quan: desire becomes action, strong goal orientation, suited to entrepreneurship. Also more domineering.',
        'Tan Lang never transforms to Hua Ke \u2014 desire and reputation don\u2019t naturally align.',
        'Tan Lang Hua Ji: desire blocked or causing disaster \u2014 romantic disputes, loss, addiction. Learn "less is more"; don\u2019t force what isn\u2019t yours.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Tan Lang in Life:'], ol: [
        'Which palace \u2014 exalted means talent; detriment means runaway desire.',
        'Check Huo Xing/Ling Xing \u2014 Fire Tan/Bell Tan means sudden breakthrough.',
        'Check romance stars: Hong Luan/Tian Xi = true love; Xian Chi/Tian Yao = bad romances.',
        'Check transformations: Hua Lu = social earning; Hua Ji = desire-caused disaster.',
        'Read the opposite palace \u2014 Tan Lang people are more uninhibited away from home.',
        'Of all you want, what truly matters?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-lianzhen-zuoming.html', text: 'Lian Zhen in Life' },
      { href: 'ziwei-pojun-zuoming.html', text: 'Po Jun in Life' },
      { href: 'ziwei-qisha-zuoming.html', text: 'Qi Sha in Life' },
      { href: 'ziwei-fuqigong.html', text: 'The Spouse Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-jumen-zuoming',
    cnTitle: '紫微斗数巨门坐命：暗星入命的人，口才好但别输在嘴上',
    enTitle: 'Ju Men Star in Life Palace: The Dark Star With a Sharp Tongue',
    cnDesc: '巨门星坐命，口才好、观察力强、能看透本质，但也容易口舌是非。巨门坐命的人，学会说话是一辈子的修行。',
    enDesc: 'Ju Men in the Life Palace brings eloquence and penetrating insight, but also gossip and disputes. Learning how to speak is a lifelong practice.',
    cnLead: '巨门坐命的人，身上有一种「一眼看穿」的能力。别人绕弯子的话你一听就懂，复杂的事你一句话就能说到本质。但这种能力也有代价——你太容易看到问题、太容易说出口、太容易让人不舒服。巨门坐命的人，成也在嘴，败也在嘴。',
    cnIntro2: '巨门星五行属水（又属金），是「暗星」，主口舌、是非和研究。它是十四主星里最「招黑」的一颗——不是你故意找人吵架，是你说真话的时候别人不爱听。巨门坐命的人，一辈子都在学一件事：如何在「说真话」和「让人接受」之间找到平衡。',
    cnSections: [
      { h: '巨门坐命的核心特质', ps: [
        '巨门坐命的人：第一，口才好，能言善辩，适合靠嘴吃饭；第二，观察力强，能看到别人看不到的细节和漏洞；第三，多疑，不轻信任何人；第四，招是非，明明没说错话但总被误解。',
        '你在团队里是「那个说真话的人」——皇帝的新衣里那个小孩。别人不敢说的你敢说，但说出来之后可能被穿小鞋。你的人际关系容易两极分化：懂你的人觉得你真诚可靠，不懂你的人觉得你刻薄难搞。',
        '巨门坐命的人适合律师、教师、传媒、研究、质检——任何需要「发现问题、表达观点」的领域。你不适合做需要和稀泥的行政工作。'
      ]},
      { h: '巨门为什么招是非', ps: [
        '巨门被称为「暗星」，因为它的能量是「遮蔽」——你说的话容易被断章取义，你的好意容易被曲解。不是你说错了，是别人听岔了。',
        '巨门加化禄叫「石中隐玉」——早年被误解，中年后靠口才成名，是巨门最好的配置。巨门加化权叫「巨门化权」，说服力极强，适合做律师或演说家。巨门加化忌叫「巨门化忌」，口舌是非最多，容易犯小人。',
        '举个组合：巨门在子宫坐命，加化禄。这叫「石中隐玉格」——年轻时默默无闻甚至被排挤，但中年后口才和专业能力爆发，一举成名。反过来，巨门在午宫加化忌，叫「巨门化忌在午」，一辈子口舌不断，容易有官司或合同纠纷。'
      ]},
      { h: '巨门的研究能力', ps: [
        '巨门不只是「是非星」，它也是「研究星」。巨门坐命的人对深层真相有本能的追求——你不满足于表面答案，一定要挖到根。',
        '这种能力让你在学术、法律、医学、侦探等领域有天赋。你可能成为某个冷门领域的专家，因为别人嫌枯燥的东西你觉得有意思。',
        '巨门加文昌文曲，研究和表达能力双强，适合做学者或评论家。巨门加天魁天钺，研究成果能得到贵人认可。'
      ]},
      { h: '巨门的四化', ps: [
        '巨门化禄：靠口才赚钱，适合律师、教师、销售。「石中隐玉」，中年后成名。',
        '巨门化权：说服力极强，适合辩论、管理、政治。说话有权威感。',
        '巨门不化科（巨门主口舌是非，跟化科的「名声」有冲突，但如果有其他吉星配合也能出名）。',
        '巨门化忌：口舌是非最多，容易有官司、合同纠纷、被小人陷害。巨门化忌的人要特别注意说话方式，不要在冲动时做决定。'
      ]},
      { h: '排盘后的使用顺序', ps: ['巨门坐命，按这个顺序读：'], ol: [
        '先看巨门在什么宫位——子午宫最好（石中隐玉），卯酉宫也不错。',
        '看四化：化禄化权都好，化忌要防口舌官司。',
        '看有没有太阳——太阳照巨门则是非消散，叫「巨日同宫」。',
        '看文昌文曲——有则口才和研究能力更强。',
        '看煞星：擎羊主争吵升级，陀罗主是非纠缠，空劫主说空话。',
        '问自己：你是在「说真话」还是在「图嘴上痛快」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-taiyang-zuoming.html', text: '太阳坐命' },
      { href: 'ziwei-tianji-zuoming-wenguan-dizi.html', text: '天机坐命' },
      { href: 'ziwei-tianliang-zuoming.html', text: '天梁坐命' },
      { href: 'ziwei-jiaoyougong.html', text: '交友宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Ju Men in the Life Palace have a see-through-it ability. You instantly understand what others dance around and distill complexity to its essence in one sentence. But the price is seeing problems too clearly, speaking too readily, and making people uncomfortable. For Ju Men people, success and failure both come through the mouth.',
    enIntro2: 'Ju Men is element Water (and Metal), the "dark star," ruling speech, disputes, and research. It\u2019s the most misunderstood of the fourteen \u2014 not because you pick fights, but because people don\u2019t want to hear the truth. Ju Men people spend life learning to balance truth-telling with being heard.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, eloquent \u2014 persuasive, suited to living by words. Second, observant \u2014 you catch details and flaws others miss. Third, skeptical \u2014 you trust no one easily. Fourth, dispute-prone \u2014 misinterpreted even when you say nothing wrong.',
        'You\u2019re the one who tells the truth, the child in the emperor\u2019s new clothes. You say what others dare not, then face consequences. Relationships polarize: those who get you find you honest and reliable; those who don\u2019t find you harsh and difficult.',
        'Suits law, teaching, media, research, quality control \u2014 anything requiring spotting problems and expressing views. Not suited to papering-over-cracks administration.'
      ]},
      { h: 'Why Disputes Follow You', ps: [
        'Ju Men is the dark star because its energy obscures \u2014 your words get taken out of context, your good intentions twisted. Not that you\u2019re wrong, but others hear it wrong.',
        'Ju Men with Hua Lu is "jade hidden in stone" \u2014 misunderstood early, famous through eloquence midlife, the best configuration. Ju Men with Hua Quan is immensely persuasive, suited to law or public speaking. Ju Men with Hua Ji brings the most disputes, petty people, and lawsuits.',
        'Example: Ju Men in Zi with Hua Lu \u2014 "jade in stone": unknown or even excluded young, but eloquence and expertise erupt midlife. Conversely, Ju Men in Wu with Hua Ji \u2014 lifelong disputes, lawsuits, and contract problems.'
      ]},
      { h: 'The Research Mind', ps: [
        'Ju Men isn\u2019t just disputes \u2014 it\u2019s also the research star. Ju Men people have an instinct for deep truth; surface answers never satisfy; you dig to the root.',
        'This gives talent in academia, law, medicine, detection. You may become an expert in an obscure field because what bores others fascinates you.',
        'With Chang/Qu: strong research and expression \u2014 scholar or critic. With Kui/Yue: research gains benefactor recognition.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Ju Men Hua Lu: earning through speech \u2014 law, teaching, sales. "Jade in stone," midlife fame.',
        'Ju Men Hua Quan: immense persuasiveness \u2014 debate, management, politics. Authoritative speech.',
        'Ju Men never transforms to Hua Ke (disputes and reputation clash, though with other auspicious stars fame is possible).',
        'Ju Men Hua Ji: most disputes, lawsuits, contract issues, sabotage by petty people. Watch your words; never decide in anger.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Ju Men in Life:'], ol: [
        'Which palace \u2014 Zi/Wu is best (jade in stone); Mao/You is also good.',
        'Check transformations: Lu/Quan are good; Ji warns of disputes and lawsuits.',
        'Check Tai Yang \u2014 sun illuminating Ju Men disperses disputes ("Ju Ri Tong Gong").',
        'Check Chang/Qu \u2014 stronger eloquence and research.',
        'Check malefics: Qing Yang = escalating fights, Tuo Luo = dragging disputes, Kong Jie = empty talk.',
        'Are you telling truth or just indulging in sharpness?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-taiyang-zuoming.html', text: 'Tai Yang in Life' },
      { href: 'ziwei-tianji-zuoming-wenguan-dizi.html', text: 'Tian Ji in Life' },
      { href: 'ziwei-tianliang-zuoming.html', text: 'Tian Liang in Life' },
      { href: 'ziwei-jiaoyougong.html', text: 'The Friends Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tianxiang-zuoming',
    cnTitle: '紫微斗数天相坐命：印星入命的人，谨慎但别随波逐流',
    enTitle: 'Tian Xiang Star in Life Palace: The Seal Star Who Must Choose a Side',
    cnDesc: '天相星坐命，谨慎、随和、善于协调，但也容易缺乏主见、随波逐流。天相坐命的人，学会独立判断是功课。',
    enDesc: 'Tian Xiang in the Life Palace brings caution, agreeableness, and coordination skill, but also lack of conviction and drift. Independent judgment is the lesson.',
    cnLead: '天相坐命的人，是十四主星里最「会做人」的。你随和、得体、不得罪人，在任何群体里都能找到自己的位置。但天相坐命有一个问题——你太「会做人」了，以至于有时候不知道自己到底想要什么。你像水一样，倒进什么容器就是什么形状，但水本身没有形状。',
    cnIntro2: '天相星五行属水，是「印星」，主协调、辅佐和衣食。它是十四主星里最「被动」的一颗——紫微是帝王，天相是宰相；宰相不是自己拍板的人，是帮帝王拍板的人。天相坐命的人，适合做二把手、参谋、协调者，但要学会在「附和别人」和「坚持自己」之间找到平衡。',
    cnSections: [
      { h: '天相坐命的核心特质', ps: [
        '天相坐命的人：第一，随和，跟谁都能处；第二，有审美，穿着打扮通常得体；第三，善于协调，能在矛盾双方之间找到平衡点；第四，缺乏主见，遇到选择容易犹豫。',
        '你在团队里是「润滑剂」——有矛盾的地方有你在就缓和了。但你也可能被认为「没立场」——两边都不想得罪，结果两边都不把你当自己人。',
        '天相坐命的人适合做HR、公关、秘书、调解、设计——任何需要「协调」和「审美」的领域。你不适合做需要独断专行的一把手，除非有化权或煞星激发。'
      ]},
      { h: '天相是印星', ps: [
        '天相被称为「印星」，因为它像一枚印章——本身没有权力，但盖下去的文件就有了效力。天相坐命的人，你的价值在于「被需要」——领导需要你去执行，团队需要你去协调。',
        '但印星也有一个问题：你需要一个「好主子」。天相的对宫永远是破军，如果破军带吉，天相能辅佐出一番事业；如果破军带煞，天相可能跟着倒霉。',
        '天相加紫微叫「紫微天相」，能辅佐明君；天相加武曲叫「武曲天相」，能帮领导管钱管事；天相加廉贞叫「廉贞天相」，适合政法系统。'
      ]},
      { h: '天相的「财荫夹印」和「刑囚夹印」', ps: [
        '天相有两个重要格局：「财荫夹印」是最好的——天相被化禄和天梁（荫星）夹在中间，主有人帮、有钱花、一生安稳。',
        '「刑囚夹印」是最凶的——天相被擎羊（刑）和廉贞化忌（囚）夹住，主官司、是非、甚至牢狱之灾。但这个格局只有在特定条件下才成立，不要看到擎羊就慌。',
        '举个组合：天相在辰宫坐命，邻宫有化禄和天梁。这就是「财荫夹印」——一生有贵人、有财源、做事有人帮。反过来，天相在戌宫，邻宫有擎羊和廉贞化忌，这就是「刑囚夹印」，要特别注意法律风险。'
      ]},
      { h: '天相的四化', ps: [
        '天相不化禄（天相是印星，不主财）。',
        '天相化权：印星有了权力，从二把手变成实权人物，性格更果断。',
        '天相化科：靠名声和信用立足，适合做外交官、发言人、品牌代言。',
        '天相不化忌（天相是稳星，不主灾。但天相如果被煞星夹，也会出问题）。'
      ]},
      { h: '排盘后的使用顺序', ps: ['天相坐命，按这个顺序读：'], ol: [
        '先看天相被什么星夹——财荫夹印最好，刑囚夹印要防。',
        '看对宫破军——破军带吉则能辅佐，带煞则跟着倒霉。',
        '看三合：紫微和武曲是否强，决定了你辅佐的人靠不靠谱。',
        '看四化：化权化科都好，能让天相从被动变主动。',
        '看煞星：擎羊陀罗让天相更纠结，空劫让审美变差。',
        '问自己：你是在「顾全大局」还是在「不敢表态」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-tianfu-zuoming.html', text: '天府坐命' },
      { href: 'ziwei-pojun-zuoming.html', text: '破军坐命' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Tian Xiang in the Life Palace are the most socially adept of the fourteen. Agreeable, tactful, inoffensive \u2014 you find your place in any group. But the problem is being so adept that you sometimes don\u2019t know what you want. You\u2019re like water: whatever vessel you\u2019re poured into, you take its shape \u2014 but water itself has no shape.',
    enIntro2: 'Tian Xiang is element Water, the "seal star," ruling coordination, assistance, and comfort. It\u2019s the most passive of the fourteen \u2014 Zi Wei is emperor, Tian Xiang is the chancellor who helps the emperor decide. Tian Xiang people make excellent deputies, advisors, and coordinators, but must balance agreeing with others against standing for themselves.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, agreeable \u2014 you get along with everyone. Second, tasteful \u2014 usually well-dressed and presentable. Third, diplomatic \u2014 you find balance between conflicting sides. Fourth, indecisive \u2014 you hesitate at choices.',
        'You\u2019re the lubricant on a team \u2014 tensions ease when you\u2019re around. But you may be seen as having no stance \u2014 offending neither side means neither side claims you.',
        'Suits HR, PR, secretarial work, mediation, design \u2014 anything requiring coordination and taste. Not suited to autocratic top leadership unless Hua Quan or malefics ignite you.'
      ]},
      { h: 'The Seal Star', ps: [
        'Tian Xiang is the seal star because, like a stamp, it holds no power itself \u2014 but a document it seals becomes effective. Your value lies in being needed: leaders need you to execute, teams need you to coordinate.',
        'But the seal needs a good master. The opposite palace is always Po Jun; if Po Jun brings auspicious stars, Tian Xiang assists a great endeavor; if Po Jun brings malefics, Tian Xiang suffers along.',
        'With Zi Wei: assisting a wise ruler. With Wu Qu: helping manage money and operations. With Lian Zhen: suited to law and discipline.'
      ]},
      { h: 'Wealth-Seal and Prison-Seal', ps: [
        'Two key patterns: "Wealth and protection flanking the seal" is best \u2014 Tian Xiang flanked by Hua Lu and Tian Liang (protection), meaning help, money, and lifelong stability.',
        '"Punishment and prison flanking the seal" is worst \u2014 flanked by Qing Yang (punishment) and Lian Zhen Hua Ji (prison), meaning lawsuits, disputes, even jail. But this only forms under specific conditions; don\u2019t panic at the sight of Qing Yang.',
        'Example: Tian Xiang in Chen flanked by Hua Lu and Tian Liang \u2014 wealth-protection-seal: lifelong benefactors, income, and help. Conversely, Tian Xiang in Xu flanked by Qing Yang and Lian Zhen Hua Ji \u2014 punishment-prison-seal: watch legal risk carefully.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Tian Xiang never transforms to Hua Lu \u2014 the seal doesn\u2019t rule wealth.',
        'Tian Xiang Hua Quan: the seal gains power, moving from deputy to real authority, more decisive.',
        'Tian Xiang Hua Ke: standing on reputation and trust \u2014 diplomat, spokesperson, brand ambassador.',
        'Tian Xiang never transforms to Hua Ji \u2014 it\u2019s a steady star. But flanked by malefics, trouble still comes.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Tian Xiang in Life:'], ol: [
        'What stars flank it \u2014 wealth-protection-seal is best; punishment-prison-seal is a warning.',
        'Check opposite Po Jun \u2014 auspicious means a worthy boss; malefic means suffering along.',
        'Check triple combination: are Zi Wei and Wu Qu strong? That determines whom you assist.',
        'Check transformations: Hua Quan/Hua Ke turn passivity into initiative.',
        'Check malefics: Qing Yang/Tuo Luo make you more tangled; Kong Jie worsens taste.',
        'Are you "seeing the big picture" or afraid to take a stand?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-tianfu-zuoming.html', text: 'Tian Fu in Life' },
      { href: 'ziwei-pojun-zuoming.html', text: 'Po Jun in Life' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  }
];

function buildCN(a) {
  let sectionsHtml = '';
  for (let i = 0; i < a.cnSections.length; i++) {
    const s = a.cnSections[i];
    sectionsHtml += `\n        <h2 id="section-${i + 1}">${s.h}</h2>\n`;
    for (const p of s.ps) sectionsHtml += `        <p>${p}</p>\n`;
    if (s.ol) {
      sectionsHtml += '        <ol>\n';
      for (const item of s.ol) sectionsHtml += `          <li>${item}</li>\n`;
      sectionsHtml += '        </ol>\n';
    }
  }
  let sidebarHtml = '';
  for (const link of a.cnSidebar) sidebarHtml += `        <a class="card-link" href="${link.href}">${link.text}</a>\n`;

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
  "articleSection": "主星",
  "about": ["紫微斗数", "十四主星", "${jstr(a.cnTitle)}"],
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
    {"@type": "ListItem", "position": 3, "name": "十四主星", "item": "https://yuetianai.com/articles/ziwei-main-stars.html"},
    {"@type": "ListItem", "position": 4, "name": "${jstr(a.cnTitle)}", "item": "https://yuetianai.com/articles/${a.slug}.html"}
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
          <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="ziwei-main-stars.html">十四主星</a></nav>
          <h1>${a.cnTitle}</h1>
          <p class="detail-subtitle">${a.cnDesc}</p>
          <p class="article-meta"><span>主星</span><span><time datetime="${date}">2026-08-15 10:15</time></span></p>
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
  let sectionsHtml = '';
  for (let i = 0; i < a.enSections.length; i++) {
    const s = a.enSections[i];
    sectionsHtml += `\n        <h2 id="section-${i + 1}">${s.h}</h2>\n`;
    for (const p of s.ps) sectionsHtml += `        <p>${p}</p>\n`;
    if (s.ol) {
      sectionsHtml += '        <ol>\n';
      for (const item of s.ol) sectionsHtml += `          <li>${item}</li>\n`;
      sectionsHtml += '        </ol>\n';
    }
  }
  let sidebarHtml = '';
  for (const link of a.enSidebar) sidebarHtml += `        <a class="card-link" href="${link.href}">${link.text}</a>\n`;

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
  "articleSection": "Zi Wei Dou Shu",
  "about": ["Zi Wei Dou Shu", "Fourteen Main Stars", "${jstr(a.enTitle)}"],
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
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>Fourteen Main Stars</span></nav>
          <h1>${a.enTitle}</h1>
          <p class="detail-subtitle">${a.enDesc}</p>
          <p class="article-meta"><span>Main Stars</span><span><time datetime="${date}">2026-08-15 10:15</time></span></p>
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
      <span>After reading, compare it with your own chart \u2014 it makes more sense than concepts alone.</span>
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
  fs.writeFileSync(cnPath, buildCN(a).replace(/\r\n/g, '\n'), 'utf8');
  fs.writeFileSync(enPath, buildEN(a).replace(/\r\n/g, '\n'), 'utf8');
  console.log(`Created: ${a.slug}`);
}
