const fs = require('fs');
const path = require('path');
const date = '2026-08-16T10:15:00+08:00';
function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

// category: 'main' for 主星, 'helper' for 辅煞曜
const articles = [
  {
    slug: 'ziwei-tianliang-zuoming', cat: 'main',
    cnTitle: '紫微斗数天梁坐命：荫星入命的人，老成持重但别太说教',
    enTitle: 'Tian Liang Star in Life Palace: The Protector Who Must Not Preach',
    cnDesc: '天梁星坐命，成熟稳重、逢凶化吉、有长辈缘，但也容易好为人师、想太多。天梁坐命的人，学会倾听比给建议更重要。',
    enDesc: 'Tian Liang in the Life Palace brings maturity, resilience, and elder benefactors, but also a tendency to lecture and overthink. Listening matters more than advising.',
    cnLead: '天梁坐命的人，身上有一种「老灵魂」的气质。你可能从小就比同龄人懂事，别人觉得你像个小大人；长大了你是朋友里的「人生导师」，谁有烦心事都找你聊。但天梁坐命有一个问题——你太喜欢「给建议」了。你说的都对，但不是每个人都想被教育。',
    cnIntro2: '天梁星五行属土，是「荫星」，主逢凶化吉、长寿和长辈缘。它是十四主星里最「稳」的一颗——不像紫微那样霸气，不像七杀那样冲，天梁像一棵大树，站在那里就让人觉得安全。但大树也有大树的问题：遮风挡雨久了，会忍不住想管树下的人怎么活。',
    cnSections: [
      { h: '天梁坐命的核心特质', ps: [
        '天梁坐命的人：第一，成熟，心理年龄比实际年龄大；第二，逢凶化吉，遇到危险总能化险为夷；第三，有长辈缘，容易得到老师、领导、父母的关照；第四，爱操心，别人的事你比人家自己还急。',
        '你在团队里通常是「大哥大姐」——新人你带，矛盾你调，出事你扛。这让你很受尊重，但也让你很累。你有时候觉得「为什么都靠我」，但下次有人找你帮忙你还是会答应。',
        '天梁坐命的人适合教育、医疗、法律、纪检、公益——任何需要「保护别人」和「主持公道」的领域。你不适合做需要冷酷决断的工作，因为你太容易心软。'
      ]},
      { h: '逢凶化吉的荫星', ps: [
        '天梁最大的特点是「逢凶化吉」——你人生中可能遇到过几次危险，但每次都奇迹般地躲过去了。这不是运气好，是天梁的「荫」在保护你。',
        '但天梁的逢凶化吉有一个前提：你得先经历「凶」。天梁坐命的人通常先苦后甜——年轻时波折多，中年后越来越顺。因为天梁是「老人星」，越老越有福。',
        '举个组合：天梁在午宫坐命（入庙），加天魁天钺。这叫「阳梁昌禄」的变体，一生有贵人，逢凶化吉能力最强。反过来，天梁在巳亥宫落陷加化忌，逢凶化吉的能力打折，可能需要更久才能从困境中走出来。'
      ]},
      { h: '天梁的清高和说教', ps: [
        '天梁坐命的人有「清高」的一面——你看不起溜须拍马的人，也不愿意为了钱做违心的事。这让你受人尊重，但也让你在需要「圆滑」的场合吃亏。',
        '你最大的问题是「好为人师」。朋友跟你吐槽，你不是先共情，而是先分析问题给方案。有时候别人只是想被理解，你却给了一堆建议。在亲密关系里，这会让伴侣觉得你在「教育」他而不是爱他。',
        '学会说「我理解你的感受」而不是「你应该怎样」，是天梁坐命的人最重要的功课。'
      ]},
      { h: '天梁的四化', ps: [
        '天梁化禄：荫星化禄，靠名声和贵人得财，适合教育、医疗、咨询。但天梁化禄也可能「清高人谈钱」——一边不屑一边赚。',
        '天梁化权：权威感加强，适合做管理或学术带头人。但更好为人师。',
        '天梁化科：名声最好，适合考试、学术、公职。逢凶化吉能力加强。',
        '天梁不化忌（天梁是荫星，本身就能化解灾厄，不主灾）。'
      ]},
      { h: '排盘后的使用顺序', ps: ['天梁坐命，按这个顺序读：'], ol: [
        '先看天梁在什么宫位——午宫最好（阳梁），子宫也不错，巳亥宫落陷。',
        '看有没有天魁天钺——有则贵人多，逢凶化吉能力更强。',
        '看有没有文昌文曲——有则适合学术和考试。',
        '看太阳——天梁和太阳三合，太阳强则贵气足。',
        '看煞星：擎羊让天梁变严厉，陀罗让操心加重，空劫让清高变孤僻。',
        '问自己：你是在「帮人」还是在「控制人」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-tiantong-zuoming.html', text: '天同坐命' },
      { href: 'ziwei-taiyang-zuoming.html', text: '太阳坐命' },
      { href: 'ziwei-tianji-zuoming-wenguan-dizi.html', text: '天机坐命' },
      { href: 'ziwei-fumugong.html', text: '父母宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Tian Liang in the Life Palace have an old-soul quality. You were more mature than peers as a child and became the "life coach" of your friend group. But the problem is loving to give advice too much \u2014 you\u2019re right, but not everyone wants to be educated.',
    enIntro2: 'Tian Liang is element Earth, the "protection star," ruling disaster-averting, longevity, and elder bonds. It\u2019s the steadiest of the fourteen \u2014 not domineering like Zi Wei, not charging like Qi Sha, but a great tree whose mere presence feels safe. Yet a tree that shelters long enough starts telling those beneath it how to live.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, mature beyond your years. Second, disaster-averting \u2014 danger somehow passes you by. Third, elder affinity \u2014 teachers, bosses, and parents favor you. Fourth, you worry about others\u2019 business more than they do.',
        'You\u2019re the big sibling on any team \u2014 training newcomers, mediating conflicts, taking the fall. Respected but exhausted. You wonder why everyone leans on you, then say yes when they do.',
        'Suits education, medicine, law, discipline, charity \u2014 anything protecting others and upholding fairness. Not suited to cold-blooded decision roles; you soften too easily.'
      ]},
      { h: 'The Disaster-Averting Star', ps: [
        'Tian Liang\u2019s signature is turning misfortune into fortune \u2014 you may have faced danger several times and miraculously escaped. It isn\u2019t luck; it\u2019s Tian Liang\u2019s protection.',
        'But the blessing requires first facing the danger. Tian Liang people typically have bitter early years and smooth later life. It\u2019s the old-man star \u2014 the older, the more blessed.',
        'Example: Tian Liang in Wu (exalted) with Kui/Yue \u2014 strongest benefactor and disaster-averting power. In Si/Hai (detriment) with Hua Ji, the power weakens and recovery takes longer.'
      ]},
      { h: 'Pride and Preaching', ps: [
        'You have a principled streak \u2014 you despise flattery and won\u2019t sell out for money. This earns respect but costs you in situations requiring tact.',
        'Your biggest issue is lecturing. When a friend vents, you analyze and prescribe before empathizing. Sometimes people just want to be understood, not fixed. In relationships this feels like being educated rather than loved.',
        'Learning to say "I understand how you feel" instead of "you should" is the key lesson.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Tian Liang Hua Lu: earning through reputation and benefactors \u2014 education, medicine, consulting.',
        'Tian Liang Hua Quan: stronger authority, suited to management or academia. Even more preachy.',
        'Tian Liang Hua Ke: best reputation, suited to exams, academia, public service. Stronger disaster-averting.',
        'Tian Liang never transforms to Hua Ji \u2014 it inherently dissolves misfortune.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Tian Liang in Life:'], ol: [
        'Which palace \u2014 Wu is best, Zi is good, Si/Hai is detriment.',
        'Check Kui/Yue \u2014 more benefactors and protection.',
        'Check Chang/Qu \u2014 suited to scholarship and exams.',
        'Check Tai Yang in triple combination \u2014 strong sun adds nobility.',
        'Check malefics: Qing Yang = harshness, Tuo Luo = more worry, Kong Jie = aloofness.',
        'Are you helping or controlling?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-tiantong-zuoming.html', text: 'Tian Tong in Life' },
      { href: 'ziwei-taiyang-zuoming.html', text: 'Tai Yang in Life' },
      { href: 'ziwei-tianji-zuoming-wenguan-dizi.html', text: 'Tian Ji in Life' },
      { href: 'ziwei-fumugong.html', text: 'The Parents Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-qisha-zuoming', cat: 'main',
    cnTitle: '紫微斗数七杀坐命：将星入命的人，能扛事但别太独',
    enTitle: 'Qi Sha Star in Life Palace: The General Who Carries All',
    cnDesc: '七杀星坐命，刚烈、果断、能扛事，是天生的开拓者。但七杀也主孤克，太独立容易孤军奋战，学会借力是功课。',
    enDesc: 'Qi Sha in the Life Palace brings ferocity, decisiveness, and resilience \u2014 a born pioneer. But it also means isolation; too much independence means fighting alone, and learning to leverage others is the lesson.',
    cnLead: '七杀坐命的人，身上有一种「别挡路」的气场。你做事果断、不拖泥带水，遇到问题第一个反应是「怎么解决」而不是「怎么办」。你能扛事，天塌下来你不躲。但七杀坐命有一个问题——你太独立了。独立到不信任别人，独立到什么都自己扛，独立到身边人觉得「你不需要我」。',
    cnIntro2: '七杀星五行属金（又属火），是「将星」，主冲锋、开拓和威权。它跟紫微不同——紫微是元帅，坐在帐里指挥；七杀是先锋，提枪上马第一个冲。七杀坐命的人，人生通常大起大落，但你从来不怕——因为你天生就是打硬仗的人。',
    cnSections: [
      { h: '七杀坐命的核心特质', ps: [
        '七杀坐命的人：第一，果断，做决定快，不纠结；第二，能扛压，越乱越冷静；第三，独立，不喜欢求人；第四，刚烈，脾气来了谁都拦不住。',
        '你在团队里是「救火队长」——别人搞不定的事你上，最硬的骨头你啃。这让你很有价值，但也让你很累。你可能觉得「还不如自己来」，结果什么都自己干。',
        '七杀坐命的人适合军警、创业、外科医生、竞技体育——任何需要「敢冲、敢扛、敢拍板」的领域。你不适合做按部就班的文员工作，会憋坏。'
      ]},
      { h: '七杀的孤克', ps: [
        '七杀五行属金，跟武曲一样有「孤克」的一面。你跟六亲的缘分可能比较薄——要么从小离家，要么跟家人沟通少。你的婚姻也需要经营，因为你太强势、太不善于表达温柔。',
        '七杀加擎羊叫「擎羊七杀」，性格最刚烈，容易有外伤或官司；七杀加陀罗叫「铃昌陀武」的变体，主拖延中的爆发；七杀加火铃，脾气暴躁但来得快去得快。',
        '但七杀的孤克不是无解。七杀坐命的人如果学会说「我需要你」、学会把一部分事情交给别人、学会在亲密关系里柔软一点，你的人生会轻松很多。'
      ]},
      { h: '七杀和紫微、天府的关系', ps: [
        '七杀永远在紫微和天府的对宫。这意味着七杀坐命的人，跟领导（紫微）和资源（天府）有天然的张力——你既需要他们，又不服他们。',
        '如果紫微星强（有百官拱照），七杀就是「大将」——有人给你平台和资源，你去冲锋陷阵，这是最好的配置。如果紫微弱（孤君），七杀就是「叛军」——你看不上领导，容易自己干。',
        '七杀加天府叫「杀破狼」格局的一部分，人生变动大但机会多。七杀坐命的人不怕变，因为你的能力就是在变动中体现的。'
      ]},
      { h: '七杀不四化', ps: [
        '七杀不参与四化（不化禄、不化权、不化科、不化忌）。这意味着七杀本身没有「吉凶」的偏向——它的好坏全看跟什么星配。',
        '七杀加禄存或化禄，「冲锋有粮」，能赚到钱；七杀加化权，威权更重；七杀加化科，刚中带柔，名声好；七杀加化忌（其他星化忌冲过来），冲锋受阻，容易有灾。',
        '七杀坐命的人，大运走得好时「一战成名」，走得差时「一败涂地」。但你有一个别人没有的能力——跌倒了能爬起来，而且爬起来之后更强。'
      ]},
      { h: '排盘后的使用顺序', ps: ['七杀坐命，按这个顺序读：'], ol: [
        '先看七杀在什么宫位——寅申宫最好（七杀朝斗），子午宫也不错。',
        '看对宫紫微天府——紫微强则有平台，天府强则有资源。',
        '看有没有禄存化禄——有则冲锋有回报。',
        '看煞星：擎羊主外伤，陀罗主拖延，火铃主急躁。',
        '看三合：廉贞和贪狼是否强，决定了你的手段和欲望。',
        '问自己：你是在「独立」还是在「孤立自己」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-pojun-zuoming.html', text: '破军坐命' },
      { href: 'ziwei-tanlang-zuoming.html', text: '贪狼坐命' },
      { href: 'ziwei-wuqu-zuoming.html', text: '武曲坐命' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Qi Sha in the Life Palace have a "get out of my way" aura. You decide fast, stay calm in chaos, and solve rather than panic. You carry what others can\u2019t. But the problem is being too independent \u2014 so independent that you don\u2019t trust others, carry everything alone, and leave people feeling you don\u2019t need them.',
    enIntro2: 'Qi Sha is element Metal (and Fire), the general star, ruling assault, pioneering, and authority. Unlike Zi Wei the marshal commanding from the tent, Qi Sha is the vanguard leading the charge. Life is dramatic, but you\u2019ve never been afraid \u2014 you were born for hard fights.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, decisive \u2014 quick calls, no agonizing. Second, pressure-resistant \u2014 calmer in chaos. Third, independent \u2014 you hate asking for help. Fourth, fierce \u2014 when temper hits, no one stops you.',
        'You\u2019re the firefighter \u2014 the hardest tasks come to you. Valuable but exhausted. You think "I\u2019d rather do it myself" and end up doing everything.',
        'Suits military/police, entrepreneurship, surgery, competitive sports \u2014 anything requiring daring and backbone. Routine desk work would suffocate you.'
      ]},
      { h: 'The Isolation', ps: [
        'Like Wu Qu, Metal gives Qi Sha an isolated edge \u2014 thin family bonds, perhaps leaving home young, poor communication with relatives. Marriage needs work because you\u2019re strong and bad at showing tenderness.',
        'With Qing Yang: fiercest temper, prone to injury or lawsuits. With Tuo Luo: delayed explosion. With Huo Ling: short-fused but quick to cool.',
        'It isn\u2019t hopeless. Learning to say "I need you," delegating, and softening in intimacy makes life much lighter.'
      ]},
      { h: 'Qi Sha, Zi Wei, and Tian Fu', ps: [
        'Qi Sha always opposes Zi Wei and Tian Fu. This creates natural tension with authority and resources \u2014 you need them but resist them.',
        'If Zi Wei is strong (with a full court), Qi Sha is a great general with a platform. If Zi Wei is weak (lonely ruler), Qi Sha becomes a rebel who goes independent.',
        'With Tian Fu it forms part of the "Sha Po Lang" pattern \u2014 massive change and opportunity. Qi Sha people don\u2019t fear change; that\u2019s where your ability shows.'
      ]},
      { h: 'No Transformations', ps: [
        'Qi Sha never transforms to Lu/Quan/Ke/Ji. It has no inherent bias \u2014 its quality depends entirely on companion stars.',
        'With Lu Cun or Hua Lu: "charging with supplies" \u2014 profitable. With Hua Quan: heavier authority. With Hua Ke: firm but refined. With another star\u2019s Hua Ji clashing: charge blocked, potential disaster.',
        'In good cycles you become famous in one battle; in bad ones you lose it all. But you have what others don\u2019t: the ability to rise again, stronger.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Qi Sha in Life:'], ol: [
        'Which palace \u2014 Yin/Shen is best ("Qi Sha facing the dipper"), Zi/Wu is good.',
        'Check opposite Zi Wei/Tian Fu \u2014 strong Zi Wei gives platform; strong Tian Fu gives resources.',
        'Check Lu Cun/Hua Lu \u2014 reward for the charge.',
        'Check malefics: Qing Yang = injury, Tuo Luo = delay, Huo Ling = impatience.',
        'Check triple: Lian Zhen and Tan Lang determine method and desire.',
        'Are you independent or isolating yourself?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-pojun-zuoming.html', text: 'Po Jun in Life' },
      { href: 'ziwei-tanlang-zuoming.html', text: 'Tan Lang in Life' },
      { href: 'ziwei-wuqu-zuoming.html', text: 'Wu Qu in Life' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-pojun-zuoming', cat: 'main',
    cnTitle: '紫微斗数破军坐命：耗星入命的人，敢破敢立但别乱拆',
    enTitle: 'Po Jun Star in Life Palace: The Breaker Who Builds Anew',
    cnDesc: '破军星坐命，敢于打破旧秩序、开创新局面，但也容易破坏大于建设。破军坐命的人，学会「破中有立」是功课。',
    enDesc: 'Po Jun in the Life Palace brings courage to break old orders and create anew, but risk of destruction outpacing construction. Building within the breaking is the lesson.',
    cnLead: '破军坐命的人，身上有一种「推倒重来」的劲。你看到不合理的东西就想改，待在一成不变的环境里会窒息。你可能换过很多工作、搬过很多次家、在别人眼里「很能折腾」。但破军坐命有一个问题——你太喜欢「破」了，有时候旧的拆了，新的还没建好，结果一片废墟。',
    cnIntro2: '破军星五行属水，是「耗星」，主破坏、变动和开创。它是十四主星里最「不安分」的一颗——紫微要稳，破军要变；天府要守，破军要拆。破军坐命的人，是天生的改革者和开拓者，但「破」之后能不能「立」，决定了你的人生是传奇还是折腾。',
    cnSections: [
      { h: '破军坐命的核心特质', ps: [
        '破军坐命的人：第一，敢变，不害怕从头再来；第二，有开创力，能在废墟上建新城；第三，不服管，讨厌按规矩来；第四，破坏性强，吵架时什么话狠说什么。',
        '你在团队里是「变革者」——流程太老你改，产品不行你重做，领导不对你敢顶。这让你在需要创新的地方如鱼得水，但在需要稳定的地方像颗定时炸弹。',
        '破军坐命的人适合创业、产品开发、改革型岗位、拆迁/重建类工作——任何需要「先破后立」的领域。你不适合做一成不变的执行工作。'
      ]},
      { h: '破军的「耗」', ps: [
        '破军被称为「耗星」，因为它的能量是「消耗」——消耗旧的、消耗资源、消耗自己。破军坐命的人可能花钱大手大脚、精力透支、或者在一段关系里耗尽了才走。',
        '破军加禄存或化禄叫「破军化禄」，是最好的配置——「破中有财」，拆掉旧的能赚更多钱。破军加化权，破坏力和开创力都强，适合做一把手。破军加化忌，「破而不立」，拆了但建不起来，容易一败涂地。',
        '举个组合：破军在子宫坐命（入庙），加化禄。这叫「破军化禄在子」，一生变动中得财，越折腾越有钱。反过来，破军在午宫落陷加化忌，变动多但收获少，容易反复推倒重来却始终建不成。'
      ]},
      { h: '杀破狼格局', ps: [
        '破军永远和七杀、贪狼在三合相会，组成「杀破狼」格局。这是紫微斗数里最「动」的格局——人生变动大、机会多、风险也大。',
        '杀破狼的人不适合朝九晚五的稳定生活，你的人生注定有几次大转折。关键是在转折中做对选择——破军负责破，贪狼负责欲望和机会，七杀负责执行和冲锋。',
        '如果三星庙旺有吉化，杀破狼可以成大事；如果落陷加煞，可能一生漂泊不定。'
      ]},
      { h: '破军的四化', ps: [
        '破军化禄：「先破后得」，花钱能赚钱，改行能发财。是破军最好的化。',
        '破军不化权（破军本身已经够强势了）。',
        '破军化科：破坏中有了名声，适合做改革派领袖。',
        '破军化忌：最凶的化忌之一，「破而不立」，变动中有损失。不要冲动辞职、不要冲动分手、不要冲动投资。'
      ]},
      { h: '排盘后的使用顺序', ps: ['破军坐命，按这个顺序读：'], ol: [
        '先看破军在什么宫位——子午宫最好，辰戌丑未宫也不错。',
        '看有没有禄存化禄——有则破中有财。',
        '看三合七杀和贪狼——七杀强则执行力强，贪狼强则机会多。',
        '看煞星：擎羊主破中有伤，陀罗主反复折腾，空劫主破完一场空。',
        '看对宫——破军坐命的人跟配偶和合作伙伴的关系是课题。',
        '问自己：你是在「破旧立新」还是在「为了破而破」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-main-stars.html', text: '十四主星总览' },
      { href: 'ziwei-qisha-zuoming.html', text: '七杀坐命' },
      { href: 'ziwei-tanlang-zuoming.html', text: '贪狼坐命' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'People with Po Jun in the Life Palace have a "tear it down and start over" drive. You want to fix anything irrational and suffocate in stagnation. You may have changed many jobs and homes \u2014 "always折腾." But the problem is loving the breaking too much: sometimes the old is demolished before the new is built, leaving ruins.',
    enIntro2: 'Po Jun is element Water, the "consuming star," ruling destruction, change, and pioneering. It\u2019s the most restless of the fourteen \u2014 Zi Wei wants stability, Po Jun wants change; Tian Fu wants preservation, Po Jun wants demolition. You\u2019re a born reformer, but whether you can build after breaking determines whether your life is legend or chaos.',
    enSections: [
      { h: 'Core Traits', ps: [
        'First, fearless about change and starting over. Second, pioneering \u2014 building new cities on ruins. Third, hard to manage \u2014 you hate rules. Fourth, destructive in conflict \u2014 you say the cruelest things when fighting.',
        'You\u2019re the transformer \u2014 fixing outdated processes, rebuilding products, challenging bosses. In innovative settings you thrive; in stable ones you\u2019re a time bomb.',
        'Suits entrepreneurship, product development, reform roles, demolition/reconstruction \u2014 anything requiring break-then-build. Not routine execution.'
      ]},
      { h: 'The Consuming Star', ps: [
        'Po Jun consumes \u2014 the old, resources, yourself. You may spend freely, burn out, or exhaust a relationship before leaving it.',
        'With Lu Cun or Hua Lu: "wealth through breaking" \u2014 demolishing the old earns more. With Hua Quan: strong destruction and creation, suited to top leadership. With Hua Ji: "breaking without building" \u2014 devastating losses.',
        'Example: Po Jun in Zi (exalted) with Hua Lu \u2014 wealth through change, the more you restructure the richer you get. In Wu (detriment) with Hua Ji \u2014 lots of change, little gain, repeatedly starting over without finishing.'
      ]},
      { h: 'The Sha Po Lang Pattern', ps: [
        'Po Jun always meets Qi Sha and Tan Lang in triple combination, forming "Sha Po Lang" \u2014 the most dynamic pattern: massive change, opportunity, and risk.',
        'Sha Po Lang people aren\u2019t built for 9-to-5 stability; life has several major turns. The key is choosing right at each turn \u2014 Po Jun breaks, Tan Lang supplies desire and opportunity, Qi Sha executes.',
        'When all three are exalted with auspicious transformations, great achievement; when in detriment with malefics, lifelong drifting.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Po Jun Hua Lu: "gain after breaking" \u2014 spending leads to earning, changing fields leads to wealth. The best transformation.',
        'Po Jun never transforms to Hua Quan \u2014 it\u2019s already forceful enough.',
        'Po Jun Hua Ke: reputation through reform, suited to reform leadership.',
        'Po Jun Hua Ji: one of the fiercest \u2014 breaking without building, loss through change. No impulsive quitting, breaking up, or investing.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['For Po Jun in Life:'], ol: [
        'Which palace \u2014 Zi/Wu is best, Chen/Xu/Chou/Wei is good.',
        'Check Lu Cun/Hua Lu \u2014 wealth through breaking.',
        'Check triple Qi Sha and Tan Lang \u2014 strong Qi Sha = execution; strong Tan Lang = opportunity.',
        'Check malefics: Qing Yang = injury in breaking, Tuo Luo = repeated chaos, Kong Jie = empty ruins.',
        'Read the opposite palace \u2014 relationships with partners are a lesson.',
        'Are you building after breaking, or just breaking?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-main-stars.html', text: 'Fourteen Main Stars' },
      { href: 'ziwei-qisha-zuoming.html', text: 'Qi Sha in Life' },
      { href: 'ziwei-tanlang-zuoming.html', text: 'Tan Lang in Life' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-zuofu-youbi', cat: 'helper',
    cnTitle: '紫微斗数左辅右弼：帝王的左右手，有这两颗星的人有人帮',
    enTitle: 'Zuo Fu and You Bi: The Emperor\u2019s Right and Left Hands',
    cnDesc: '左辅右弼是助力星，主有人帮、有人撑。命宫或三方有左辅右弼，做事有人搭把手，成功不孤单。',
    enDesc: 'Zuo Fu and You Bi are assistance stars \u2014 help and support. In the Life Palace or triple combination, they mean people lend a hand and success isn\u2019t lonely.',
    cnLead: '左辅右弼是紫微斗数里最「暖」的两颗星。它们不主财、不主权，只主一件事——有人帮。命宫有左辅或右弼的人，遇到困难时总有人搭把手；不是你运气好，是你天生让人愿意帮。',
    cnIntro2: '左辅属阳土，右弼属阴水（一说阴火），两颗星永远在三合相会。它们是紫微帝星的「左右手」——左辅是显性的帮助（明面上有人支持你），右弼是隐性的帮助（暗中有人帮你、替你圆场）。看盘时，左辅右弼是判断「有没有人帮」的关键。',
    cnSections: [
      { h: '左辅右弼的核心含义', ps: [
        '左辅右弼主「助力」和「包容」。这两颗星入命的人，性格通常温和、好相处、有团队精神。你不是那种单打独斗的人，你习惯在群体中发挥作用。',
        '左辅偏「明助」——有人公开支持你、给你资源、替你说话。右弼偏「暗助」——有人暗中帮你、替你补漏、在你不知道的地方替你铺路。两颗都有最好，明里暗里都有人。',
        '左辅右弼跟天魁天钺不同：魁钺是「贵人星」，主关键时刻有大人物拉你一把；辅弼是「助力星」，主日常有人帮你做事、配合你。魁钺是点，辅弼是线。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫有辅弼：有人格魅力，别人愿意跟你干。一生少求人，因为总有人主动帮。',
        '兄弟宫有辅弼：兄弟姐妹能帮你，同辈关系好。',
        '夫妻宫有辅弼：配偶能帮你，婚姻中有「队友感」。但右弼在夫妻宫也可能有隐性的感情竞争者，要结合其他星看。',
        '财帛宫有辅弼：赚钱有人帮——合伙、团队、平台。不是单打独斗的财。',
        '官禄宫有辅弼：事业上有副手和团队，适合做管理。'
      ]},
      { h: '辅弼和紫微的关系', ps: [
        '左辅右弼对紫微星最重要。紫微是帝星，没有辅弼就是「孤君」；有了辅弼才是真正的皇帝。',
        '如果命宫紫微，三方有左辅右弼，叫 "紫微辅弼"，领导力大增，有人追随。如果紫微在命但辅弼在对宫或三合，也算有帮，但不如同宫直接。',
        '如果紫微在命，完全没有辅弼、魁钺，那就是孤君——有野心但没人帮，需要主动寻找合作伙伴。'
      ]},
      { h: '辅弼不主吉凶', ps: [
        '左辅右弼是「中性偏吉」的星，它们不化禄、不化权、不化科、不化忌。它们的作用是「放大」同宫星曜的力量——吉星更吉，凶星更凶。',
        '比如左辅右弼和紫微同宫，紫微的领导力被放大；但如果和擎羊同宫，擎羊的破坏力也被放大（有人帮你打架）。',
        '所以看辅弼不能只看「有没有」，还要看「跟谁在一起」。辅弼跟对了人是如虎添翼，跟错了人是助纣为虐。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到左辅右弼，按这个顺序读：'], ol: [
        '先看它们在哪个宫位——宫位决定了哪个领域有人帮。',
        '看跟什么主星同宫——吉星则助力大，凶星则帮倒忙。',
        '看是左辅还是右弼——左辅明助，右弼暗助。',
        '看三方四正有没有其他吉星——辅弼加魁钺，贵人运最强。',
        '看有没有煞星同宫——辅弼加煞，助力打折或帮中带坑。',
        '问自己：你是否珍惜了身边帮你的人？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-tiankui-tianyue.html', text: '天魁天钺' },
      { href: 'ziwei-wenchang-wenqu.html', text: '文昌文曲' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-jiaoyougong.html', text: '交友宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Zuo Fu and You Bi are the warmest stars in Zi Wei Dou Shu. They rule neither wealth nor power \u2014 only one thing: help. People with either in the Life Palace always find a hand when stuck; not because of luck, but because others naturally want to help them.',
    enIntro2: 'Zuo Fu is Yang Earth, You Bi is Yin Water (some say Yin Fire), and they always meet in triple combination. They are the Zi Wei emperor\u2019s hands: Zuo Fu is visible help (open support), You Bi is hidden help (someone quietly covering for you). They are key to reading whether you have support.',
    enSections: [
      { h: 'Core Meaning', ps: [
        'They rule assistance and tolerance. People with these stars are usually warm, easy to work with, and team-oriented. You\u2019re not a lone wolf; you function best in groups.',
        'Zuo Fu is open help \u2014 public support, resources, advocacy. You Bi is hidden help \u2014 quiet backup, filling gaps, paving roads you don\u2019t see. Having both is best.',
        'They differ from Kui/Yue: those are benefactor stars for key moments with important people; Fu/Bi are daily assistance and cooperation. Kui/Yue are points; Fu/Bi are lines.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: personal charisma, people follow you. Rarely needing to beg for help.',
        'Siblings: brothers and sisters help; good peer relations.',
        'Spouse: partner supports you, a teammate feeling. (You Bi here can also hint at hidden romantic competition \u2014 check other stars.)',
        'Wealth: earning through partners, teams, platforms \u2014 not solo money.',
        'Career: lieutenants and teams at work; suited to management.'
      ]},
      { h: 'Fu Bi and Zi Wei', ps: [
        'They matter most for Zi Wei. The emperor without Fu/Bi is a lonely ruler; with them, a true emperor.',
        'Zi Wei in Life with Fu/Bi in triple combination greatly boosts leadership and followership. In the same palace it\u2019s most direct; in opposition or triple it still counts.',
        'Zi Wei in Life with no Fu/Bi or Kui/Yue is a lonely ruler \u2014 ambition without help; you must actively seek partners.'
      ]},
      { h: 'Neither Good Nor Bad on Their Own', ps: [
        'They are neutral-to-auspicious and never transform to Lu/Quan/Ke/Ji. They amplify the stars they share a palace with \u2014 auspicious stars become more auspicious; malefics become more harmful.',
        'With Zi Wei, leadership amplifies. With Qing Yang, the destructive power amplifies too (someone helps you fight).',
        'Don\u2019t just check whether they\u2019re present \u2014 check whom they\u2019re with. With the right star they\u2019re wings; with the wrong one they aid trouble.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Zuo Fu/You Bi:'], ol: [
        'Which palace \u2014 that determines where help comes.',
        'Which main star shares the palace \u2014 auspicious means real help; malefic means help that hurts.',
        'Zuo Fu or You Bi \u2014 open or hidden help.',
        'Check triple combination for other auspicious stars \u2014 Fu/Bi plus Kui/Yue is strongest benefactor luck.',
        'Check malefics sharing the palace \u2014 help is reduced or comes with traps.',
        'Do you appreciate the people who help you?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-tiankui-tianyue.html', text: 'Tian Kui & Tian Yue' },
      { href: 'ziwei-wenchang-wenqu.html', text: 'Wen Chang & Wen Qu' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-jiaoyougong.html', text: 'The Friends Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-wenchang-wenqu', cat: 'helper',
    cnTitle: '紫微斗数文昌文曲：才华和考试星，有这两颗星的人会读书有才艺',
    enTitle: 'Wen Chang and Wen Qu: Stars of Talent and Exams',
    cnDesc: '文昌文曲主才华、学业和文书。命宫有昌曲的人聪明好学、有文采或艺术天赋，但也可能「想得太多做得太少」。',
    enDesc: 'Wen Chang and Wen Qu rule talent, scholarship, and documents. They bring intelligence and artistic gift, but also risk of overthinking and underdoing.',
    cnLead: '文昌文曲是紫微斗数里的「文星」。命宫有这两颗星的人，通常从小学习好、文笔好、或者有某种艺术天赋。但昌曲也有一个问题——你可能太「文」了，想得多做得少，脑子里千军万马，行动上寸步难行。',
    cnIntro2: '文昌属阳金，文曲属阴水。文昌主正统学问、考试、文书、证书；文曲主口才、艺术、异路功名、非正式的才华。两颗星永远在三合相会。昌曲是判断「学习能力」和「才华」的关键星曜。',
    cnSections: [
      { h: '文昌和文曲的区别', ps: [
        '文昌是「正途文星」——考试运好、适合走学历路线、跟证书和文书有缘。文昌入命的人适合做学者、编辑、公务员、文案。',
        '文曲是「异路文星」——口才好、反应快、有艺术天赋，不一定学历高但一定聪明。文曲入命的人适合做主持、销售、演员、音乐人。',
        '两颗都有最好——既有正统学问又有街头智慧。只有文昌可能「书呆子」，只有文曲可能「聪明但不用在正地方」。'
      ]},
      { h: '昌曲在十二宫', ps: [
        '命宫有昌曲：聪明好学，有文采或才艺。但加煞星可能「怀才不遇」。',
        '官禄宫有昌曲：事业靠专业和文书，适合教育、传媒、法律、写作。',
        '财帛宫有昌曲：靠知识和才华赚钱，不是体力财。',
        '夫妻宫有昌曲：配偶有文化或才艺，但昌曲加桃花星也可能配偶太招人。',
        '父母宫有昌曲：父母有文化，或跟老师缘分好。'
      ]},
      { h: '昌曲的四化', ps: [
        '文昌化科：考试运最好，考证、考公、升学都有利。',
        '文曲化科：靠口才和才艺出名，适合演讲、表演、培训。',
        '文昌化忌：考试失利、文书出错、合同纠纷。大考年份要特别注意。',
        '文曲化忌：口才惹祸、签约被骗、或者在艺术/感情上受挫。'
      ]},
      { h: '「阳梁昌禄」和「文桂文华」', ps: [
        '文昌和天梁、太阳在三合相会，加禄存或化禄，叫「阳梁昌禄」格，是考试第一格——逢考必过，学术成就高。',
        '昌曲在命宫且庙旺，加吉星，叫「文桂文华」格，才华横溢，靠文化成名。',
        '但昌曲也有不好的格局——昌曲加擎羊陀罗叫「刑狱文星」，可能因文书惹官司；昌曲加空劫叫「书中空」，读了很多书但用不上。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到文昌文曲，按这个顺序读：'], ol: [
        '先看是文昌还是文曲——文昌主正统学问，文曲主口才才艺。',
        '看在哪个宫位——宫位决定才华用在哪个领域。',
        '看四化：化科最好，化忌防文书和考试问题。',
        '看有没有禄存化禄——阳梁昌禄格考试最强。',
        '看煞星：擎羊陀罗本主文书官司，空劫主才华落空。',
        '问自己：你的才华是「用出来了」还是「只在脑子里」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-zuofu-youbi.html', text: '左辅右弼' },
      { href: 'ziwei-tiankui-tianyue.html', text: '天魁天钺' },
      { href: 'ziwei-tianji-zuoming-wenguan-dizi.html', text: '天机坐命' },
      { href: 'ziwei-fumugong.html', text: '父母宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Wen Chang and Wen Qu are the literary stars. People with them in the Life Palace usually did well in school, write well, or have artistic talent. But the downside is being too "literary" \u2014 thinking much, doing little, with armies in your mind but paralysis in action.',
    enIntro2: 'Wen Chang is Yang Metal, ruling formal scholarship, exams, documents, and credentials. Wen Qu is Yin Water, ruling eloquence, art, and unconventional talent. They always meet in triple combination and are key to reading learning ability and talent.',
    enSections: [
      { h: 'The Difference', ps: [
        'Wen Chang is the formal literary star \u2014 good exam luck, suited to the degree path, connected to certificates and documents. Suits scholars, editors, civil servants, copywriters.',
        'Wen Qu is the unconventional literary star \u2014 eloquence, quick wit, artistic gift, not necessarily highly educated but definitely smart. Suits hosting, sales, acting, music.',
        'Both together is best \u2014 formal learning plus street smarts. Only Wen Chang can be bookish; only Wen Qu can be clever but misdirected.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: intelligent, studious, literary or artistic. With malefics, "unrecognized talent."',
        'Career: work through expertise and documents \u2014 education, media, law, writing.',
        'Wealth: earning through knowledge and talent, not physical labor.',
        'Spouse: cultured or talented partner; with romance stars, partner may draw too much attention.',
        'Parents: cultured parents or good teacher bonds.'
      ]},
      { h: 'The Four Transformations', ps: [
        'Wen Chang Hua Ke: best exam luck \u2014 credentials, civil service, degrees.',
        'Wen Qu Hua Ke: fame through eloquence and talent \u2014 speaking, performance, training.',
        'Wen Chang Hua Ji: exam failure, document errors, contract disputes. Watch in exam years.',
        'Wen Qu Hua Ji: trouble through words, signing scams, or setbacks in art/romance.'
      ]},
      { h: 'Famous Patterns', ps: [
        'Wen Chang with Tian Liang and Tai Yang in triple combination plus Lu Cun/Hua Lu forms "Yang Liang Chang Lu" \u2014 the top exam pattern, passing every test, high academic achievement.',
        'Chang/Qu in Life exalted with auspicious stars forms "Wen Gui Wen Hua" \u2014 brilliant talent, fame through culture.',
        'Negative patterns: Chang/Qu with Qing Yang/Tuo Luo can mean lawsuits through documents; with Kong Jie, "empty scholarship" \u2014 much reading, little application.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Chang/Qu:'], ol: [
        'Wen Chang or Wen Qu \u2014 formal scholarship vs eloquence/talent.',
        'Which palace \u2014 where the talent applies.',
        'Transformations: Hua Ke is best; Hua Ji warns of document/exam trouble.',
        'Check Lu Cun/Hua Lu \u2014 Yang Liang Chang Lu is strongest for exams.',
        'Check malefics: Qing Yang/Tuo Luo = document lawsuits; Kong Jie = unrealized talent.',
        'Is your talent applied or only in your head?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-zuofu-youbi.html', text: 'Zuo Fu & You Bi' },
      { href: 'ziwei-tiankui-tianyue.html', text: 'Tian Kui & Tian Yue' },
      { href: 'ziwei-tianji-zuoming-wenguan-dizi.html', text: 'Tian Ji in Life' },
      { href: 'ziwei-fumugong.html', text: 'The Parents Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tiankui-tianyue', cat: 'helper',
    cnTitle: '紫微斗数天魁天钺：贵人星，命里有这两颗星的人关键时刻有人拉',
    enTitle: 'Tian Kui and Tian Yue: The Benefactor Stars',
    cnDesc: '天魁天钺是贵人星，主关键时刻有人提携。命宫或三方有魁钺，遇难呈祥，总有人在你最需要的时候出现。',
    enDesc: 'Tian Kui and Tian Yue are benefactor stars, ruling crucial help from others. In the Life Palace or triple combination, they bring rescue at the key moment.',
    cnLead: '天魁天钺是紫微斗数里的「贵人星」。命宫有这两颗星的人，人生中总有一种「运气」——最困难的时候总有人出现帮你一把。不是你刻意经营人脉，而是你天生容易遇到好人。',
    cnIntro2: '天魁属阳火，是昼贵人（白天、公开场合、男性贵人）；天钺属阴火，是夜贵人（夜晚、私下、女性贵人）。两颗星永远在三合相会。魁钺跟左辅右弼不同：辅弼是日常有人帮，魁钺是关键时刻有人救。',
    cnSections: [
      { h: '天魁天钺的核心含义', ps: [
        '魁钺主「贵人提携」。这种贵人不是平时帮你打杂的人，而是在人生关键节点——找工作、遇困难、做重大决定时——出现的「引路人」。',
        '天魁偏「阳贵」——男性贵人、公开场合的帮助、白天发生的事。天钺偏「阴贵」——女性贵人、私下的帮助、暗中的支持。两颗都有最好，男女贵人都有。',
        '魁钺入命的人通常气质不错、给人好感，长辈和上司容易喜欢你。你可能自己没觉得，但别人就是愿意帮你。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫有魁钺：一生有贵人，遇难呈祥。',
        '官禄宫有魁钺：事业上有领导提携，升职有人帮。',
        '财帛宫有魁钺：缺钱时有人借，赚钱时有人带。',
        '迁移宫有魁钺：出门遇贵人，在外地发展比家乡好。',
        '父母宫有魁钺：父母有能力或上司是贵人。'
      ]},
      { h: '魁钺和辅弼的区别', ps: [
        '左辅右弼是「助手型」——平时帮你做事、配合你、支持你。魁钺是「伯乐型」——不一定天天出现，但在关键时刻拉你一把、给你机会。',
        '辅弼是「线」，持续不断；魁钺是「点」，关键节点。辅弼是同事和伙伴，魁钺是导师和恩人。',
        '最好的配置是辅弼魁钺都有——平时有人帮，关键时刻有人拉。如果只有魁钺没有辅弼，贵人出现但没人执行；如果只有辅弼没有魁钺，有人帮但缺大机会。'
      ]},
      { h: '魁钺不四化', ps: [
        '天魁天钺不参与四化。它们是「纯吉」的星，本身不主凶。但它们跟其他星的组合会影响贵人的类型：',
        '魁钺加昌曲：贵人是文化人、老师、学者。',
        '魁钺加禄存化禄：贵人带财，帮你赚钱。',
        '魁钺加化权：贵人是领导，给你权力。',
        '魁钺加煞星：贵人有但帮得不顺，或者帮你的人自己也有麻烦。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天魁天钺，按这个顺序读：'], ol: [
        '先看在哪个宫位——宫位决定贵人出现在哪个领域。',
        '看是天魁还是天钺——阳贵还是阴贵，男贵人还是女贵人。',
        '看跟什么星同宫——决定贵人的类型和帮助的方式。',
        '看有没有辅弼配合——辅弼加魁钺，贵人运最强。',
        '看大运流年——魁钺被引动的年份，贵人出现。',
        '问自己：你是否主动维护了那些帮过你的关系？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-zuofu-youbi.html', text: '左辅右弼' },
      { href: 'ziwei-wenchang-wenqu.html', text: '文昌文曲' },
      { href: 'ziwei-qianyigong.html', text: '迁移宫怎么看' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian Kui and Tian Yue are the benefactor stars. People with them in the Life Palace have a kind of luck \u2014 someone appears at the hardest moment. It isn\u2019t deliberate networking; you naturally encounter good people.',
    enIntro2: 'Tian Kui is Yang Fire, the daytime benefactor (public, male). Tian Yue is Yin Fire, the nighttime benefactor (private, female). They always meet in triple combination. Unlike Zuo Fu/You Bi (daily help), Kui/Yue rescue at key moments.',
    enSections: [
      { h: 'Core Meaning', ps: [
        'They rule benefactor sponsorship \u2014 not someone who runs errands for you, but a guide who appears at life\u2019s key nodes: job hunting, crisis, big decisions.',
        'Tian Kui is yang benefactor \u2014 male, public, daytime. Tian Yue is yin \u2014 female, private, behind-the-scenes. Both is best.',
        'People with Kui/Yue usually have good presence and are liked by elders and bosses. You may not notice, but people want to help you.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: lifelong benefactors, disaster turned to fortune.',
        'Career: bosses sponsor you, promotion help.',
        'Wealth: someone lends when you\u2019re short, or brings earning opportunities.',
        'Travel: benefactors away from home; developing outside your hometown may be better.',
        'Parents: capable parents or a benefactor boss.'
      ]},
      { h: 'Kui/Yue vs Fu/Bi', ps: [
        'Zuo Fu/You Bi are assistants \u2014 daily cooperation. Kui/Yue are talent-spotters \u2014 not always present, but pulling you up or giving opportunity at the key moment.',
        'Fu/Bi are a line (continuous); Kui/Yue are points (nodes). Fu/Bi are colleagues; Kui/Yue are mentors.',
        'Best setup: both. Help daily and rescue at key moments. Only Kui/Yue without Fu/Bi: opportunity arrives but no one executes. Only Fu/Bi without Kui/Yue: help but no big break.'
      ]},
      { h: 'No Transformations', ps: [
        'They never transform and are purely auspicious. But combinations shape the benefactor type:',
        'With Chang/Qu: cultured benefactors \u2014 teachers, scholars.',
        'With Lu Cun/Hua Lu: benefactors bring money.',
        'With Hua Quan: benefactors are leaders who give power.',
        'With malefics: benefactors exist but help is bumpy, or the helper has their own troubles.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Kui/Yue:'], ol: [
        'Which palace \u2014 where benefactors appear.',
        'Tian Kui or Tian Yue \u2014 yang or yin, male or female.',
        'Which stars share the palace \u2014 the type and manner of help.',
        'Check Fu/Bi \u2014 together, strongest benefactor luck.',
        'Check cycles \u2014 years when Kui/Yue activate bring benefactors.',
        'Do you actively maintain relationships with those who helped you?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-zuofu-youbi.html', text: 'Zuo Fu & You Bi' },
      { href: 'ziwei-wenchang-wenqu.html', text: 'Wen Chang & Wen Qu' },
      { href: 'ziwei-qianyigong.html', text: 'The Travel Palace' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-lucun-xing', cat: 'helper',
    cnTitle: '紫微斗数禄存星：天上的财库，有禄存的人能存钱但别抠',
    enTitle: 'Lu Cun Star: The Heavenly Treasury',
    cnDesc: '禄存星主财库和积蓄，是「守财星」。命宫或财帛宫有禄存，能赚钱也能存钱，但也可能吝啬或保守。',
    enDesc: 'Lu Cun rules treasury and savings \u2014 the wealth-preserving star. In Life or Wealth, it means earning and keeping money, but also possible stinginess or conservatism.',
    cnLead: '禄存是紫微斗数里最「实在」的星。它不主横财、不主名气，只主一件事——你手里有粮。命宫有禄存的人，通常对钱有天生的安全感需求，存钱比花钱让你舒服。但禄存也有一个问题：你可能太「守」了，守到变成抠，守到该花的钱不花，守到钱成了数字而不是工具。',
    cnIntro2: '禄存属阴土，是「财星」也是「寿星」。它跟化禄不同——化禄是「源源不断的收入」，禄存是「实实在在的库存」。化禄是水流，禄存是水库。禄存还有一个特点：它前后永远跟着擎羊和陀罗（「羊陀夹」），所以禄存的财总带点辛苦或争议。',
    cnSections: [
      { h: '禄存的核心含义', ps: [
        '禄存主「积蓄」和「稳定」。禄存入命的人通常有存钱习惯，不喜欢欠债，对财务安全有强烈需求。你可能不是赚最多的，但你是最能存的。',
        '禄存也主「保守」——你不喜欢冒险，投资偏稳健，做决定前要反复确认。这让你财务稳，但也可能错过机会。',
        '禄存和化禄的区别：化禄是「赚得到」，禄存是「存得住」。有化禄没禄存，赚得多花得多；有禄存没化禄，存得住但赚得慢；两个都有最好，又赚又存。'
      ]},
      { h: '羊陀夹禄', ps: [
        '禄存星有一个重要特征：它的前一个宫位永远是擎羊，后一个宫位永远是陀罗。这叫「羊陀夹禄」。',
        '这意味着禄存的财不是轻松来的——擎羊在前是「拼来的」，陀罗在后是「拖来的」。你的钱是靠辛苦和坚持赚来的，不是天上掉下来的。',
        '羊陀夹禄也有一个好处：因为钱来得辛苦，你更珍惜、更会守。白手起家的人很多有这个配置。'
      ]},
      { h: '禄存在十二宫', ps: [
        '命宫有禄存：稳重、有存钱意识、一生不缺钱花。但可能太保守。',
        '财帛宫有禄存：能存钱，收入稳定。是很好的财帛配置。',
        '田宅宫有禄存：有房产运，家里有库，适合买房置产。',
        '官禄宫有禄存：事业稳定，适合做金融、财务、仓储类工作。',
        '福德宫有禄存：精神上有安全感，知足常乐。但可能懒得动。'
      ]},
      { h: '禄存和天马', ps: [
        '禄存加天马叫「禄马交驰」，是最好的财格之一——靠动中求财，越跑越有钱。适合做贸易、物流、经常出差的工作。',
        '如果禄存和天马在对宫冲照，也叫「禄马交驰」，力量稍弱但也是好配置。',
        '如果有天马但没有禄存，叫「天马空载」——跑得很辛苦但没赚到钱。如果有禄存但没有天马，叫「禄存守库」——有钱但不动，靠积累致富。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到禄存，按这个顺序读：'], ol: [
        '先看禄存在哪个宫位——宫位决定钱在哪个领域。',
        '看有没有化禄配合——化禄加禄存，又赚又存。',
        '看有没有天马——禄马交驰，动中得财。',
        '看羊陀夹——禄存前后一定有擎羊陀罗，看它们落在哪些宫位。',
        '看有没有空劫——空劫夹禄或冲禄，存钱会被破。',
        '问自己：你是在「理财」还是在「守财奴」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-tianzhaigong.html', text: '田宅宫怎么看' },
      { href: 'ziwei-wuqu-zuoming.html', text: '武曲坐命' },
      { href: 'ziwei-tianfu-zuoming.html', text: '天府坐命' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Lu Cun is the most tangible star. It rules no windfall or fame \u2014 only one thing: having grain in hand. People with it in the Life Palace have an innate need for financial security; saving feels better than spending. But the problem is guarding too tightly \u2014 becoming stingy, refusing necessary spending, letting money become a number rather than a tool.',
    enIntro2: 'Lu Cun is Yin Earth, a wealth star and longevity star. Unlike Hua Lu (flowing income), Lu Cun is actual stock. Hua Lu is flowing water; Lu Cun is the reservoir. It also always has Qing Yang ahead and Tuo Luo behind ("flanked by sheep and Tuo"), so its money comes with effort or dispute.',
    enSections: [
      { h: 'Core Meaning', ps: [
        'Lu Cun rules savings and stability. People with it save habitually, dislike debt, and need financial security. You may not earn the most, but you save the most.',
        'It also means conservatism \u2014 you avoid risk, invest steadily, double-check decisions. Financially stable, but you may miss opportunities.',
        'Hua Lu is "earning well"; Lu Cun is "keeping it." Hua Lu without Lu Cun: earn much, spend much. Lu Cun without Hua Lu: keep well but earn slowly. Both is best.'
      ]},
      { h: 'Flanked by Qing Yang and Tuo Luo', ps: [
        'Lu Cun always has Qing Yang in the preceding palace and Tuo Luo in the following one \u2014 "Yang/Tuo flanking Lu."',
        'This means the money isn\u2019t easy \u2014 Qing Yang ahead means fought for; Tuo Luo behind means dragged out. Your money comes through hard work and persistence.',
        'The upside: because it\u2019s hard-earned, you value and guard it. Many self-made people have this.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: steady, savings-minded, never short of money. But possibly too conservative.',
        'Wealth: can save, stable income. An excellent wealth placement.',
        'Property: real estate luck, home treasury, good for buying property.',
        'Career: stable career, suited to finance, accounting, warehousing.',
        'Mental: inner security, contentment. But possibly lazy.'
      ]},
      { h: 'Lu Cun and Tian Ma', ps: [
        'Lu Cun with Tian Ma is "Lu Ma galloping" \u2014 one of the best wealth patterns: earning through movement, the more you travel the richer. Suited to trade, logistics, travel-heavy work.',
        'In opposition it still counts, slightly weaker.',
        'Tian Ma without Lu Cun is "empty horse" \u2014 running hard with little to show. Lu Cun without Tian Ma is "guarded treasury" \u2014 money that doesn\u2019t move, growing through accumulation.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Lu Cun:'], ol: [
        'Which palace \u2014 where the money sits.',
        'Check Hua Lu \u2014 together, earn and keep.',
        'Check Tian Ma \u2014 Lu Ma galloping means wealth through movement.',
        'Check Yang/Tuo flanking \u2014 they always follow Lu Cun; see which palaces they land in.',
        'Check Kong Jie \u2014 flanking or clashing Lu breaks savings.',
        'Are you managing money or hoarding it?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-tianzhaigong.html', text: 'The Property Palace' },
      { href: 'ziwei-wuqu-zuoming.html', text: 'Wu Qu in Life' },
      { href: 'ziwei-tianfu-zuoming.html', text: 'Tian Fu in Life' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-qingyang-tuoluo', cat: 'helper',
    cnTitle: '紫微斗数擎羊陀罗：煞星不是坏星，用对了是动力',
    enTitle: 'Qing Yang and Tuo Luo: The Malefics Are Not Evil',
    cnDesc: '擎羊陀罗是四煞中的两颗，主冲突和拖延。但煞星不是凶星——它们代表动力和磨炼，用对了反成大器。',
    enDesc: 'Qing Yang and Tuo Luo are two of the four malefics, ruling conflict and delay. But malefics aren\u2019t evil \u2014 they represent drive and tempering, and channeled well they forge achievement.',
    cnLead: '很多人一看到擎羊陀罗就紧张，觉得「完了，有煞星」。但紫微斗数里的煞星不是「坏星」——它们是「磨刀石」。命宫有擎羊的人脾气急、能冲；命宫有陀罗的人忍耐力强、能熬。两个都不是舒服的星，但很多成大事的人命里都有煞星。',
    cnIntro2: '擎羊属阳金（一说阳火），是「刑星」，主冲突、外伤和果断；陀罗属阴金（一说阴火），是「忌星」，主拖延、纠缠和忍耐。两颗星永远夹着禄存。擎羊是「明刀明枪」，陀罗是「暗磨暗耗」。',
    cnSections: [
      { h: '擎羊：冲劲和刑伤', ps: [
        '擎羊入命的人，性格刚烈、做事果断、脾气来得快。你不喜欢拖泥带水，遇到问题直接上。这种冲劲让你在需要魄力的领域很强，但也容易伤人、惹祸。',
        '擎羊也主外伤——小到磕磕碰碰，大到手术刀伤。擎羊在疾厄宫的人要注意意外伤害，在官禄宫的人容易跟同事冲突，在夫妻宫的人吵架时说话很狠。',
        '但擎羊加吉星（尤其是化禄化权），叫「擎羊得禄」，冲劲变成了执行力，能拼能赚。武曲擎羊在命宫的人，很多是军警或外科医生——把刀用在了对的地方。'
      ]},
      { h: '陀罗：忍耐和纠缠', ps: [
        '陀罗入命的人，性格隐忍、做事慢但持久。你可能不是最快的，但你是最能熬的。别人放弃了你还在坚持，最后赢的往往是你。',
        '陀罗也主「纠缠」——事情拖泥带水，关系断不干净，病也好得慢。陀罗在夫妻宫的人可能陷入长期冷战，在财帛宫的人钱来得慢，在疾厄宫的人有慢性病。',
        '陀罗加吉星叫「陀罗化气」，忍耐变成了毅力。很多学者、工匠、长跑型创业者命宫有陀罗——他们不是一夜成名，是十年磨一剑。'
      ]},
      { h: '煞星不是坏星', ps: [
        '紫微斗数里有一个重要原则：「煞星不煞，看你怎么用」。擎羊的能量是「冲」，用对了是魄力，用错了是暴力；陀罗的能量是「忍」，用对了是毅力，用错了是窝囊。',
        '没有煞星的命盘虽然平顺，但也可能「好看不好用」——一生没什么大挫折，但也没什么大成就。有煞星的人虽然辛苦，但磨出来了就是真本事。',
        '关键看煞星跟什么星在一起：煞星加化禄化权，「煞星有用」，冲劲和忍耐都变成了能力；煞星加化忌，「煞星失控」，冲突和拖延变成了灾难。'
      ]},
      { h: '擎羊陀罗在十二宫', ps: [
        '命宫：性格刚烈（擎羊）或隐忍（陀罗），人生多磨炼但能成事。',
        '兄弟/交友宫：跟朋友或兄弟姐妹有冲突（擎羊）或纠缠（陀罗）。',
        '夫妻宫：吵架狠（擎羊）或冷战长（陀罗）。婚姻需要经营。',
        '财帛宫：赚钱辛苦（擎羊主竞争，陀罗主慢），但能拼能熬。',
        '疾厄宫：注意外伤（擎羊）或慢性病（陀罗）。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到擎羊陀罗，按这个顺序读：'], ol: [
        '先看是擎羊还是陀罗——擎羊主冲，陀罗主忍。',
        '看在哪个宫位——宫位决定冲突或拖延发生在哪个领域。',
        '看有没有化禄化权——有则煞星有用，变成执行力和毅力。',
        '看有没有化忌——有则煞星失控，要防冲突和拖延。',
        '看跟什么主星同宫——武曲擎羊适合军警技术，天机陀罗适合研究。',
        '问自己：你的「煞」是用在拼事业上，还是耗在内耗上？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-huoxing-lingxing.html', text: '火星铃星' },
      { href: 'ziwei-dikong-dijie.html', text: '地空地劫' },
      { href: 'ziwei-qisha-zuoming.html', text: '七杀坐命' },
      { href: 'ziwei-wuqu-zuoming.html', text: '武曲坐命' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Many people panic at Qing Yang or Tuo Luo, thinking "malefics \u2014 I\u2019m doomed." But malefics aren\u2019t bad stars; they\u2019re whetstones. Qing Yang people are fierce and decisive; Tuo Luo people are enduring. Neither is comfortable, but many high achievers have malefics in their charts.',
    enIntro2: 'Qing Yang is Yang Metal (some say Fire), the punishment star, ruling conflict, injury, and decisiveness. Tuo Luo is Yin Metal (some say Fire), the entanglement star, ruling delay and endurance. They always flank Lu Cun. Qing Yang is open combat; Tuo Luo is hidden grinding.',
    enSections: [
      { h: 'Qing Yang: Drive and Injury', ps: [
        'Qing Yang in Life means a fierce, decisive character with a quick temper. You hate dragging and charge directly. This drive makes you strong in bold fields but can hurt others and cause trouble.',
        'It also rules physical injury \u2014 from bumps to surgery. In Health, watch accidents; in Career, conflicts with colleagues; in Spouse, cruel words in fights.',
        'But Qing Yang with auspicious stars (especially Hua Lu/Hua Quan) is "Qing Yang gaining reward" \u2014 drive becomes execution. Wu Qu with Qing Yang in Life often produces military/police or surgeons \u2014 the blade used right.'
      ]},
      { h: 'Tuo Luo: Endurance and Entanglement', ps: [
        'Tuo Luo in Life means a patient, slow-but-persistent character. You may not be fastest, but you outlast everyone. Others quit; you keep going and often win.',
        'It also rules entanglement \u2014 things drag, relationships don\u2019t cleanly end, illnesses heal slowly. In Spouse, long cold wars; in Wealth, slow money; in Health, chronic conditions.',
        'Tuo Luo with auspicious stars turns endurance into persistence. Many scholars, craftsmen, and long-haul entrepreneurs have it \u2014 not overnight fame but a decade sharpening one blade.'
      ]},
      { h: 'Malefics Aren\u2019t Evil', ps: [
        'A key principle: "Malefics aren\u2019t malefic \u2014 it depends how you use them." Qing Yang\u2019s energy is charge; channeled it\u2019s boldness, misused it\u2019s violence. Tuo Luo\u2019s energy is endurance; channeled it\u2019s persistence, misused it\u2019s spinelessness.',
        'A chart without malefics is smooth but may look good without working well \u2014 few setbacks but few achievements. A chart with malefics is harder, but what\u2019s tempered is real ability.',
        'The key is companions: with Hua Lu/Hua Quan, malefics become useful drive and stamina; with Hua Ji, they become uncontrolled conflict and delay.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: fierce (Qing Yang) or enduring (Tuo Luo), a tempered life that can achieve.',
        'Siblings/Friends: conflict (Qing Yang) or entanglement (Tuo Luo) with peers.',
        'Spouse: cruel fights (Qing Yang) or long cold wars (Tuo Luo). Marriage needs work.',
        'Wealth: hard earning (Qing Yang = competition, Tuo Luo = slow), but you can fight and outlast.',
        'Health: watch accidents (Qing Yang) or chronic conditions (Tuo Luo).'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Qing Yang/Tuo Luo:'], ol: [
        'Qing Yang or Tuo Luo \u2014 charge vs endurance.',
        'Which palace \u2014 where conflict or delay plays out.',
        'Check Hua Lu/Hua Quan \u2014 malefics become drive and stamina.',
        'Check Hua Ji \u2014 malefics spiral into disaster.',
        'Which main star shares the palace \u2014 Wu Qu/Qing Yang suits military/tech; Tian Ji/Tuo Luo suits research.',
        'Is your "edge" spent on achievement or internal friction?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-huoxing-lingxing.html', text: 'Huo Xing & Ling Xing' },
      { href: 'ziwei-dikong-dijie.html', text: 'Di Kong & Di Jie' },
      { href: 'ziwei-qisha-zuoming.html', text: 'Qi Sha in Life' },
      { href: 'ziwei-wuqu-zuoming.html', text: 'Wu Qu in Life' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-huoxing-lingxing', cat: 'helper',
    cnTitle: '紫微斗数火星铃星：爆发力和隐忍的火，用对了能成大事',
    enTitle: 'Huo Xing and Ling Xing: Explosive and Smoldering Fire',
    cnDesc: '火星铃星是四煞中的火性煞星，主急躁和爆发。但火也主能量和行动力，跟贪狼组合更有突发横财的可能。',
    enDesc: 'Huo Xing and Ling Xing are the fire malefics, ruling impatience and eruption. But fire also means energy and action \u2014 with Tan Lang they can bring sudden windfall.',
    cnLead: '火星铃星是两颗「火性」煞星。火星是明火——脾气来得快去得快，做事风风火火；铃星是暗火——表面不吭声，憋到一定程度突然爆发。两颗星都让人不舒服，但它们也代表巨大的能量——用对了是爆发力，用错了是破坏力。',
    cnIntro2: '火星属阳火，铃星属阴火。火星主急躁、冲动和突发；铃星主阴沉、记仇和隐忍后的爆发。两颗星跟擎羊陀罗不同：擎羊是金的「刚」，火铃是火的「烈」。火铃最著名的组合是跟贪狼同宫——「火贪格」和「铃贪格」，主突发横财。',
    cnSections: [
      { h: '火星：急性子和爆发力', ps: [
        '火星入命的人，性格急躁、说话快、走路快、做决定快。你不喜欢等，排队能让你发疯。这种急性子让你执行力强，但也容易冲动——吵架时话赶话，投资时追涨杀跌。',
        '火星也主「突发」——事情来得突然，好的坏的都可能突然发生。火星在迁移宫的人可能突然出差或搬家，在财帛宫的人可能突然破财或突然进财。',
        '但火星的能量如果引导好了，是极强的行动力。运动员、消防员、急诊医生、创业者很多有火星在命宫——他们需要在瞬间做出反应。'
      ]},
      { h: '铃星：隐忍和记仇', ps: [
        '铃星入命的人，表面看起来可能很平静，但内心有一团火。你不轻易发火，但惹到你了你会记很久。铃星的爆发不是火星那种「来得快去得快」，而是「憋了很久一次算总账」。',
        '铃星也主「暗耗」——精神上的内耗、焦虑、失眠。铃星在福德宫的人容易想不开，在夫妻宫的人可能长期隐忍后突然分手。',
        '铃星的好处是「耐力型爆发力」——你能在长期隐忍后突然出手，一击必中。很多谈判专家、狙击手、长线投资者命宫有铃星。'
      ]},
      { h: '火贪格和铃贪格', ps: [
        '火星或铃星跟贪狼同宫，叫「火贪格」或「铃贪格」，是紫微斗数里最著名的「突发格」——可能突然暴富、突然成名、突然升职。',
        '这个格局的原理是：贪狼主欲望和机会，火铃主突发和能量，两个加在一起就是「机会突然来了而且你有能量抓住」。',
        '但火贪格也有一个问题：「暴起暴落」。突然成功的人如果守不住，摔得也快。火贪格的人一定要在好运时做好风控，不要把所有筹码都押上去。'
      ]},
      { h: '火铃在十二宫', ps: [
        '命宫：性格急躁（火星）或阴沉（铃星），行动力强但要防冲动。',
        '夫妻宫：吵架激烈（火星）或冷战后爆发（铃星）。',
        '财帛宫：花钱冲动（火星）或暗中破财（铃星）。但火贪格在这里主突发横财。',
        '官禄宫：事业上有突发机会，适合竞争激烈的行业。',
        '福德宫：脾气急（火星）或精神内耗（铃星），需要学会情绪管理。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到火星铃星，按这个顺序读：'], ol: [
        '先看是火星还是铃星——火星主明火急性，铃星主暗火隐忍。',
        '看在哪个宫位——宫位决定突发或内耗在哪个领域。',
        '看有没有贪狼同宫——火贪格、铃贪格主突发。',
        '看有没有化禄——火铃加化禄，爆发力变成赚钱的动力。',
        '看有没有化忌——火铃加化忌，冲动或内耗变成灾难。',
        '问自己：你的火是「发动机」还是「火灾」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-qingyang-tuoluo.html', text: '擎羊陀罗' },
      { href: 'ziwei-dikong-dijie.html', text: '地空地劫' },
      { href: 'ziwei-tanlang-zuoming.html', text: '贪狼坐命' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Huo Xing and Ling Xing are the fire malefics. Huo Xing is open fire \u2014 quick temper, fast everything. Ling Xing is hidden fire \u2014 calm on the surface, erupting after a long buildup. Both are uncomfortable, but they represent enormous energy \u2014 channeled it\u2019s explosive power; misused it\u2019s destruction.',
    enIntro2: 'Huo Xing is Yang Fire, ruling impatience, impulse, and suddenness. Ling Xing is Yin Fire, ruling sullenness, grudges, and delayed eruption. Unlike Qing Yang/Tuo Luo\u2019s metal hardness, fire is intensity. Their most famous combination is with Tan Lang \u2014 the "Fire Tan" and "Bell Tan" patterns of sudden windfall.',
    enSections: [
      { h: 'Huo Xing: Impatience and Burst', ps: [
        'Huo Xing in Life means a fast temper, fast speech, fast decisions. You hate waiting; queues drive you mad. This gives strong execution but impulsiveness \u2014 arguments escalate, investments chase highs.',
        'It also rules suddenness \u2014 things happen abruptly, good or bad. In Travel, sudden trips or moves; in Wealth, sudden loss or gain.',
        'Channeled well, it\u2019s tremendous action. Athletes, firefighters, ER doctors, entrepreneurs often have it \u2014 they need instant reactions.'
      ]},
      { h: 'Ling Xing: Endurance and Grudges', ps: [
        'Ling Xing in Life means a calm surface with fire underneath. You don\u2019t anger easily, but you remember. The eruption isn\u2019t Huo Xing\u2019s flash; it\u2019s a settling of accounts after long silence.',
        'It also rules hidden drain \u2014 mental friction, anxiety, insomnia. In Mental, dark thoughts; in Spouse, a sudden breakup after long endurance.',
        'The upside is "stamina-type explosion" \u2014 you can hold long and strike once, fatally. Negotiators, snipers, long-term investors often have it.'
      ]},
      { h: 'Fire Tan and Bell Tan', ps: [
        'Huo Xing or Ling Xing with Tan Lang forms the famous "sudden" patterns \u2014 sudden wealth, fame, or promotion.',
        'The principle: Tan Lang rules desire and opportunity; fire stars rule suddenness and energy. Together, opportunity arrives suddenly and you have the energy to seize it.',
        'But the risk is "rise fast, fall fast." Sudden achievers who can\u2019t hold on crash hard. With these patterns, manage risk in good times and never bet everything.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: impatient (Huo) or sullen (Ling), strong action but watch impulse.',
        'Spouse: fierce fights (Huo) or cold-war eruption (Ling).',
        'Wealth: impulsive spending (Huo) or hidden loss (Ling). But Fire Tan here means sudden windfall.',
        'Career: sudden opportunities, suited to competitive industries.',
        'Mental: quick temper (Huo) or internal friction (Ling) \u2014 emotional management needed.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Huo Xing/Ling Xing:'], ol: [
        'Huo or Ling \u2014 open fire vs hidden fire.',
        'Which palace \u2014 where suddenness or friction hits.',
        'Check Tan Lang in the same palace \u2014 Fire Tan/Bell Tan means sudden breakthrough.',
        'Check Hua Lu \u2014 fire plus Lu turns explosion into earning drive.',
        'Check Hua Ji \u2014 fire plus Ji turns impulse or friction into disaster.',
        'Is your fire an engine or a wildfire?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-qingyang-tuoluo.html', text: 'Qing Yang & Tuo Luo' },
      { href: 'ziwei-dikong-dijie.html', text: 'Di Kong & Di Jie' },
      { href: 'ziwei-tanlang-zuoming.html', text: 'Tan Lang in Life' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-dikong-dijie', cat: 'helper',
    cnTitle: '紫微斗数地空地劫：空的智慧，有这两颗星的人不适合走寻常路',
    enTitle: 'Di Kong and Di Jie: The Wisdom of Emptiness',
    cnDesc: '地空地劫主空亡和损耗，传统认为不吉。但空劫也主灵感和超脱，用对了适合宗教、艺术、创新，走寻常路反而痛苦。',
    enDesc: 'Di Kong and Di Jie rule emptiness and loss, traditionally inauspicious. But they also bring inspiration and transcendence \u2014 channeled well they suit religion, art, and innovation; the conventional path makes them miserable.',
    cnLead: '地空地劫是紫微斗数里最「玄」的两颗星。传统说法是「空劫破财」，命宫有空劫的人存不住钱、容易空想、不切实际。但如果你仔细观察，很多艺术家、修行人、创新者命里都有空劫——他们不是「破财」，他们是「不属于这个格子」。',
    cnIntro2: '地空属阴火，地劫属阳火（一说空属火、劫属木）。地空主「精神上的空」——灵感、直觉、超脱；地劫主「物质上的空」——破财、变动、损耗。两颗星永远在三合相会。空劫最忌在财帛宫和田宅宫，但在命宫、福德宫反而可能出异类天才。',
    cnSections: [
      { h: '地空和地劫的区别', ps: [
        '地空偏「精神空」——你对玄学、宗教、哲学、艺术有天然兴趣，直觉强，灵感多。地空入命的人可能从小就觉得「我不属于这里」。',
        '地劫偏「物质空」——钱来钱去，东西容易丢，计划容易变。地劫入命的人可能经历过突然的损失，但也因此学会了「不执着」。',
        '两颗都有最明显——既有精神上的超脱，又有物质上的波动。如果走寻常路（存钱、买房、稳定工作），空劫会让你很痛苦；如果走创意、灵性、创新路线，空劫反而是天赋。'
      ]},
      { h: '空劫破财的真相', ps: [
        '空劫确实主「破」——在财帛宫存不住钱，在田宅宫房产有波折，在官禄宫事业多变动。但「破」不等于「穷」——空劫破的是「固定的财」，如果你做的是跟「空」有关的行业（互联网、创意、金融衍生品），反而能赚钱。',
        '空劫加化禄叫「空里求财」——钱从意想不到的地方来，不是传统工资。空劫加化权叫「空中掌权」——在新兴领域或虚拟世界有影响力。',
        '空劫加化忌才是真的「破」——投资亏损、东西被盗、计划泡汤。这种时候不要执着，越执着损失越大。'
      ]},
      { h: '空劫的天赋', ps: [
        '空劫入命的人有超越常人的直觉和灵感。你可能做过预知梦、对玄学有天赋、或者在别人还没想到的时候你已经看到了趋势。',
        '很多成功的创业者、艺术家、修行人命宫有空劫——因为他们能「看到」别人看不到的东西，也愿意放弃别人放不下的东西。',
        '空劫加昌曲，灵感和表达能力双强，适合写作、音乐、设计。空劫加贪狼，欲望和超脱并存，可能经历大起大落后开悟。'
      ]},
      { h: '空劫在十二宫', ps: [
        '命宫：思想独特、不走寻常路，适合创意和灵性领域。',
        '财帛宫：存不住钱，钱来钱去。适合做现金流快的行业，不适合重资产。',
        '田宅宫：房产有波折，可能频繁搬家或房子有问题。',
        '官禄宫：事业多变动，适合自由职业、创业、新兴行业。',
        '福德宫：精神世界丰富，对哲学宗教有兴趣，但要防抑郁。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到地空地劫，按这个顺序读：'], ol: [
        '先看是地空还是地劫——地空主精神灵感，地劫主物质波动。',
        '看在哪个宫位——财帛田宅最怕空劫，命宫福德可能出天才。',
        '看有没有化禄化权——空里求财、空中掌权，走非传统路线能成。',
        '看有没有化忌——空劫加化忌才是真破，要防投资亏损。',
        '看跟什么星同宫——昌曲加空劫出艺术家，贪狼加空劫出开悟者。',
        '问自己：你是在「对抗空」还是在「利用空」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-qingyang-tuoluo.html', text: '擎羊陀罗' },
      { href: 'ziwei-huoxing-lingxing.html', text: '火星铃星' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Di Kong and Di Jie are the most mystical stars. Tradition says they "break wealth" \u2014 people with them can\u2019t save, daydream too much, seem impractical. But look closely: many artists, spiritual practitioners, and innovators have them \u2014 not because they\u2019re broke, but because they don\u2019t fit in the box.',
    enIntro2: 'Di Kong is Yin Fire, ruling spiritual emptiness \u2014 inspiration, intuition, transcendence. Di Jie is Yang Fire (some say Wood), ruling material emptiness \u2014 loss, change, depletion. They always meet in triple combination. They\u2019re worst in Wealth and Property, but in Life or Mental they can produce unconventional geniuses.',
    enSections: [
      { h: 'The Difference', ps: [
        'Di Kong is spiritual emptiness \u2014 natural affinity for mysticism, religion, philosophy, art; strong intuition and inspiration. You may have felt from childhood "I don\u2019t belong here."',
        'Di Jie is material emptiness \u2014 money comes and goes, things get lost, plans change. You may have experienced sudden loss, but learned non-attachment through it.',
        'Both together is most pronounced. On the conventional path (saving, mortgage, stable job), they make you miserable; on creative, spiritual, or innovative paths, they\u2019re a gift.'
      ]},
      { h: 'The Truth About "Broken Wealth"', ps: [
        'They do rule breaking \u2014 in Wealth, money slips; in Property, real estate has twists; in Career, work changes often. But "break" doesn\u2019t mean poor \u2014 they break fixed wealth. In "empty" fields (internet, creative, derivatives), you can earn well.',
        'With Hua Lu: "seeking wealth in emptiness" \u2014 money from unexpected sources, not salary. With Hua Quan: "power in emptiness" \u2014 influence in emerging or virtual fields.',
        'With Hua Ji it\u2019s real loss \u2014 bad investments, theft, collapsed plans. Don\u2019t cling; clinging worsens it.'
      ]},
      { h: 'The Gift', ps: [
        'People with Kong/Jie have extraordinary intuition. You may have had prophetic dreams, a talent for metaphysics, or seen trends before others.',
        'Many successful entrepreneurs, artists, and practitioners have them \u2014 they see what others don\u2019t and can release what others can\u2019t.',
        'With Chang/Qu: inspiration plus expression \u2014 writing, music, design. With Tan Lang: desire and transcendence coexist \u2014 big rises and falls followed by awakening.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: unique mind, unconventional path, suited to creative/spiritual fields.',
        'Wealth: can\u2019t hold money; suited to fast cash-flow, not heavy assets.',
        'Property: real estate twists, frequent moves or housing problems.',
        'Career: frequent changes, suited to freelance, entrepreneurship, emerging industries.',
        'Mental: rich inner world, interest in philosophy/religion \u2014 watch for depression.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Di Kong/Di Jie:'], ol: [
        'Di Kong or Di Jie \u2014 spiritual inspiration vs material fluctuation.',
        'Which palace \u2014 Wealth/Property fear them most; Life/Mental may produce genius.',
        'Check Hua Lu/Hua Quan \u2014 unconventional paths can succeed.',
        'Check Hua Ji \u2014 real loss; watch investments.',
        'Which stars share the palace \u2014 Chang/Qu + Kong/Jie = artist; Tan Lang + Kong/Jie = awakened.',
        'Are you fighting the emptiness or using it?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-qingyang-tuoluo.html', text: 'Qing Yang & Tuo Luo' },
      { href: 'ziwei-huoxing-lingxing.html', text: 'Huo Xing & Ling Xing' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  }
];

function buildHTML(a, isEn) {
  const cat = a.cat;
  const catPage = cat === 'main' ? 'ziwei-main-stars.html' : 'ziwei-helper-malice-stars.html';
  const cnCatName = cat === 'main' ? '十四主星' : '辅曜煞曜';
  const enCatName = cat === 'main' ? 'Fourteen Main Stars' : 'Helper & Malice Stars';
  const cnTag = cat === 'main' ? '主星' : '辅煞曜';
  const enTag = cat === 'main' ? 'Main Stars' : 'Helper Stars';
  const articleSection = isEn ? 'Zi Wei Dou Shu' : (cat === 'main' ? '主星' : '辅煞曜');
  const aboutCn = cat === 'main' ? '十四主星' : '辅曜煞曜';
  const aboutEn = cat === 'main' ? 'Fourteen Main Stars' : 'Helper and Malice Stars';

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
  "articleSection": "${articleSection}",
  "about": ["Zi Wei Dou Shu", "${jstr(aboutEn)}", "${jstr(title)}"],
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
          <p class="article-meta"><span>${enTag}</span><span><time datetime="${date}">2026-08-16 10:15</time></span></p>
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
  "articleSection": "${articleSection}",
  "about": ["紫微斗数", "${jstr(aboutCn)}", "${jstr(title)}"],
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
          <p class="article-meta"><span>${cnTag}</span><span><time datetime="${date}">2026-08-16 10:15</time></span></p>
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
  const cnPath = path.join(__dirname, 'articles', `${a.slug}.html`);
  const enPath = path.join(__dirname, 'articles', 'en', `${a.slug}.html`);
  fs.writeFileSync(cnPath, buildHTML(a, false).replace(/\r\n/g, '\n'), 'utf8');
  fs.writeFileSync(enPath, buildHTML(a, true).replace(/\r\n/g, '\n'), 'utf8');
  console.log(`Created: ${a.slug}`);
}
