const fs = require('fs');
const path = require('path');
const date = '2026-08-18T10:15:00+08:00';
function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

const articles = [
  {
    slug: 'ziwei-taifu-fenggao',
    cnTitle: '紫微斗数台辅封诰：文书贵星，有这两颗星的人容易得名分和头衔',
    enTitle: 'Tai Fu and Feng Gao: The Document Nobility Stars',
    cnDesc: '台辅封诰主文书、封赠和名分。命宫有这两颗星的人，容易获得正式的头衔、证书和认可，但它们的力量需要主星来带。',
    enDesc: 'Tai Fu and Feng Gao rule documents, honors, and official recognition. People with them easily gain titles and certificates, but their power needs a main star to carry it.',
    cnLead: '台辅封诰是紫微斗数里最「讲名分」的两颗星。你有没有发现，有些人能力很强但就是没有头衔，有些人能力一般但名片上印着一长串？台辅封诰管的就是后者——它不直接给你能力，但它给你「正式的认可」。命宫有这两颗星的人，一生中容易拿到证书、聘书、封号、职称这些「白纸黑字」的东西。',
    cnIntro2: '台辅属阳土，封诰属阴土。台辅主「台阁之辅」——朝廷重臣的辅佐，象征正式的官职和地位；封诰主「封赠诰命」——皇帝给的封号和文书，象征被官方承认的荣誉。两颗星永远在三合相会。台辅封诰跟三台八座不同：三台八座是「排场和威仪」，台辅封诰是「文书和名分」。前者是看起来像个人物，后者是真的有一纸证书。',
    cnSections: [
      { h: '台辅和封诰的区别', ps: [
        '台辅偏「辅佐地位」——你容易成为某个重要人物或机构的副手、助理、顾问，你的地位来自「你站在谁旁边」。台辅入命的人适合做二把手、幕僚、秘书长。',
        '封诰偏「名分荣誉」——你容易获得正式的头衔、证书、封号、职称。封诰入命的人可能证书一大堆，或者在某个领域有被官方认可的名分。',
        '两颗都有最好——既有地位又有名分。但台辅封诰都是「辅星」，它们自己力量不大，需要主星来带。主星强，台辅封诰就是锦上添花；主星弱，台辅封诰可能只是「有名无实」。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：一生容易获得正式头衔和认可、适合在体制内或大机构发展。但要防「有名无实」。',
        '官禄宫：工作中容易升职、获得职称、被正式任命。适合考公务员、评职称、走体制内路线。',
        '财帛宫：容易拿到正式的薪酬合同、股权协议、专利授权。你的财富有「文书保障」。',
        '夫妻宫：婚姻有正式的名分（结婚证很重要）、或者配偶有正式头衔。',
        '迁移宫：在外容易获得正式身份、适合出国拿身份或在外地获得正式职位。'
      ]},
      { h: '台辅封诰和其他星的配合', ps: [
        '台辅封诰加紫微——帝星有了正式的「册封」，贵气最足。这种人容易获得正式的高官厚禄。',
        '台辅封诰加太阳——太阳主贵，加台辅封诰容易在政府或国企获得正式职位。',
        '台辅封诰加化科——化科主名声，台辅封诰主名分，名声加名分，适合走学术或专业路线，容易获得行业认证。',
        '台辅封诰加文昌文曲——文书星加文书星，考试运极好，容易拿到高学历和专业证书。',
        '台辅封诰加空劫——名分落空，可能拿到证书但没用，或者头衔被撤销。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到台辅封诰，按这个顺序读：'], ol: [
        '先看在哪个宫位——官禄宫和命宫最好。',
        '看主星强不强——主星强，台辅封诰才有用；主星弱，可能有名无实。',
        '看有没有化科——化科加台辅封诰，名分和名声都有。',
        '看有没有文昌文曲——考试和证书运强。',
        '看有没有空劫——空劫会让名分落空。',
        '问自己：你追求的是「头衔」还是「实力」？最好的状态是两者都有。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-santai-bazuo.html', text: '三台八座' },
      { href: 'ziwei-wenchang-wenqu.html', text: '文昌文曲' },
      { href: 'ziwei-enguang-tiangui.html', text: '恩光天贵' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tai Fu and Feng Gao are the most "title-conscious" stars. Have you noticed how some people are very capable but have no title, while others are average but have a long list on their business card? Tai Fu/Feng Gao govern the latter — they don\'t give you ability directly, but they give you formal recognition. People with them in Life easily get certificates, appointments, titles, and professional credentials — things in black and white.',
    enIntro2: 'Tai Fu is Yang Earth, Feng Gao is Yin Earth. Tai Fu symbolizes a high-ranking minister\'s assistant — official position and status. Feng Gao symbolizes imperial enfeoffment — titles and documents granted by authority. They always meet in triple combination. Unlike San Tai/Ba Zuo (ceremony and presence), Tai Fu/Feng Gao are about documents and official status — not just looking important, but having the certificate to prove it.',
    enSections: [
      { h: 'The Difference', ps: [
        'Tai Fu leans toward assistant status — you easily become a deputy, aide, or advisor to someone important; your status comes from who you stand beside. Suited to being number two, chief of staff, or secretary-general.',
        'Feng Gao leans toward titles and honors — you easily gain formal titles, certificates, enfeoffments, professional credentials. May have a wall full of certificates or officially recognized standing in a field.',
        'Both together is best — status plus title. But they are auxiliary stars with limited power on their own; they need a strong main star. With a strong main star, they add polish; with a weak one, they may mean "all name, no substance."'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: easy to gain formal titles and recognition, suited to institutions or large organizations. Guard against hollow titles.',
        'Career: easy promotion, professional credentials, formal appointments. Suited to civil service exams, title evaluations, institutional paths.',
        'Wealth: formal salary contracts, equity agreements, patent licenses. Your wealth has "documentary protection."',
        'Spouse: marriage has formal standing (the certificate matters), or partner has official titles.',
        'Travel: easy to gain formal status away from home, suited to getting residency abroad or formal positions elsewhere.'
      ]},
      { h: 'Combinations', ps: [
        'With Zi Wei: the emperor receives formal "coronation," fullest nobility. Easy to gain high official position.',
        'With Tai Yang: nobility plus formal position, easy to get official jobs in government or state enterprises.',
        'With Hua Ke: reputation plus official recognition, suited to academia or specialist paths, easy industry certification.',
        'With Chang/Qu: document stars doubled, excellent exam luck, easy to gain high degrees and professional certificates.',
        'With Kong Jie: titles fall through — certificates that prove useless, or revoked credentials.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tai Fu/Feng Gao:'], ol: [
        'Which palace — Career and Life are best.',
        'Is the main star strong? With a weak main star, they may be hollow.',
        'Check Hua Ke — reputation plus official recognition.',
        'Check Chang/Qu — strong exam and certificate luck.',
        'Check Kong Jie — titles may fall through.',
        'Are you chasing titles or ability? Best to have both.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-santai-bazuo.html', text: 'San Tai & Ba Zuo' },
      { href: 'ziwei-wenchang-wenqu.html', text: 'Wen Chang & Wen Qu' },
      { href: 'ziwei-enguang-tiangui.html', text: 'En Guang & Tian Gui' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-feilian-posui',
    cnTitle: '紫微斗数蜚廉破碎：小人损耗星，有这两颗星要防暗箭和破财',
    enTitle: 'Fei Lian and Po Sui: The Gossip and Loss Stars',
    cnDesc: '蜚廉主口舌是非和小人，破碎主损耗和破坏。命宫有这两颗星的人，容易遭人暗中议论或东西损坏，但它们也有正面用法。',
    enDesc: 'Fei Lian rules gossip and petty people; Po Sui rules损耗 and breakage. People with them may face backbiting or broken things, but both have positive uses.',
    cnLead: '蜚廉破碎是紫微斗数里最「烦」的两颗星。蜚廉入命的人，总觉得有人在背后说你坏话——而且你的感觉往往是对的；破碎入命的人，东西容易坏、事情容易黄、钱容易漏。这两颗星不会给你大灾大难，但它们像鞋里的沙子，不致命，但走一步硌一下。',
    cnIntro2: '蜚廉属阴火（一说属水），主口舌、是非、小人、暗中的议论。蜚廉原本是一种昆虫，名字里带个「蜚」字，意思是「流言蜚语」。破碎属阴火（一说属金），主损耗、破坏、不完整。破碎跟地空地劫不同：空劫是「大空」，可能一下子没了；破碎是「小碎」，一点一点地漏。',
    cnSections: [
      { h: '蜚廉和破碎的区别', ps: [
        '蜚廉偏「人际麻烦」——小人、口舌、流言蜚语、暗中的议论。蜚廉入命的人可能莫名其妙被人讨厌，或者在团队中被排挤。',
        '破碎偏「物质损耗」——东西坏、事情黄、钱漏、计划被打乱。破碎入命的人可能手机屏幕总碎、快递总丢、约会总被放鸽子。',
        '两颗都有最「烦」——既有人际麻烦又有物质损耗。但这两颗星力量不大，属于「小凶」，不会造成致命打击。'
      ]},
      { h: '蜚廉破碎的正面用法', ps: [
        '蜚廉加吉星（尤其是化权）——你可以把「被人议论」变成「被人关注」。蜚廉的人对舆论敏感，适合做公关、媒体、舆情分析。',
        '破碎加化禄——「碎中求财」，适合做拆解、维修、回收、二手交易。别人弄坏的东西你能修好卖钱。',
        '破碎在田宅宫——家里可能经常小修小补，但也意味着你在「持续改善」居住环境，不一定是坏事。',
        '蜚廉在交友宫——你对小人特别敏感，能一眼看出谁在背后搞鬼，这种直觉是一种保护。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：容易遭口舌是非、东西容易坏。但对舆论敏感、适合做跟信息有关的工作。',
        '兄弟/交友宫：朋友或同事中有小人、容易被朋友拖累或背叛。',
        '夫妻宫：感情中有口舌是非、或者感情容易「破碎」——吵架、分手、离婚。要注意沟通方式。',
        '财帛宫：钱财容易有小损耗、不适合借钱给别人。要记账、防小偷小摸。',
        '田宅宫：家里东西容易坏、或者房产有小瑕疵。买房时要仔细检查。'
      ]},
      { h: '蜚廉破碎和煞星', ps: [
        '蜚廉加擎羊——口舌升级为冲突，可能因为一句话跟人吵架甚至动手。',
        '蜚廉加陀罗——是非纠缠不清，可能被长期造谣或官司缠身。',
        '破碎加火星——突然的破坏，东西突然坏、事情突然黄。',
        '破碎加地空地劫——小损耗变成大损失，要特别注意财务。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到蜚廉破碎，按这个顺序读：'], ol: [
        '先看在哪个宫位——交友宫和财帛宫影响最大。',
        '看有没有吉星——吉星能把小凶变成特长。',
        '看有没有煞星——煞星会让小麻烦升级。',
        '蜚廉在交友宫要防小人，破碎在财帛宫要防漏财。',
        '看大运流年——蜚廉破碎被引动的年份要特别注意口舌和损耗。',
        '问自己：你是在「被麻烦消耗」还是「把麻烦变成了信息优势」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-qingyang-tuoluo.html', text: '擎羊陀罗' },
      { href: 'ziwei-dikong-dijie.html', text: '地空地劫' },
      { href: 'ziwei-puyougong.html', text: '交友宫怎么看' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Fei Lian and Po Sui are the most annoying stars. With Fei Lian in Life, you always feel someone is talking behind your back — and you\'re usually right. With Po Sui, things break, plans fall through, money leaks. They don\'t bring disaster, but they\'re like sand in your shoe — not fatal, but you feel it every step.',
    enIntro2: 'Fei Lian is Yin Fire (some say Water), ruling gossip, disputes, petty people, and behind-the-back talk. The name evokes flying insects and "flying words" — rumors. Po Sui is Yin Fire (some say Metal), ruling损耗, breakage, incompleteness. Unlike Kong Jie\'s big emptiness (sudden total loss), Po Sui is small breakage — leaking bit by bit.',
    enSections: [
      { h: 'The Difference', ps: [
        'Fei Lian leans toward interpersonal trouble — petty people, gossip, rumors, behind-the-back talk. You may be disliked for no reason or excluded from groups.',
        'Po Sui leans toward material loss — things break, deals fall through, money leaks, plans disrupted. Phone screens crack, packages get lost, dates get canceled.',
        'Both together is most annoying — interpersonal plus material trouble. But they are "minor malefics" with limited power, not fatal blows.'
      ]},
      { h: 'The Positive Side', ps: [
        'Fei Lian with auspicious stars (especially Hua Quan): turn "being talked about" into "being noticed." Sensitive to public opinion, suited to PR, media, sentiment analysis.',
        'Po Sui with Hua Lu: "profit from breakage" — suited to dismantling, repair, recycling, second-hand trade. You fix what others broke and sell it.',
        'Po Sui in Property: frequent small repairs at home, but also means continuous improvement of your living space — not necessarily bad.',
        'Fei Lian in Friends: you\'re especially sensitive to petty people and can spot backstabbers instantly — this intuition is protection.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: prone to gossip and breakage, but sensitive to information, suited to information-related work.',
        'Siblings/Friends: petty people among friends or colleagues, easy to be dragged down or betrayed.',
        'Spouse: arguments in relationships, or relationships "break" — fights, breakups, divorce. Watch communication.',
        'Wealth: small money leaks, don\'t lend money. Keep accounts, guard against petty theft.',
        'Property: things break at home, or property has small defects. Inspect carefully when buying.'
      ]},
      { h: 'With Malefics', ps: [
        'Fei Lian with Qing Yang: gossip escalates to conflict, arguments or even fights over words.',
        'Fei Lian with Tuo Luo: disputes drag on, long-term rumors or legal entanglement.',
        'Po Sui with Huo Xing: sudden breakage — things break suddenly, deals collapse abruptly.',
        'Po Sui with Kong Jie: small loss becomes big loss, pay special attention to finances.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Fei Lian/Po Sui:'], ol: [
        'Which palace — Friends and Wealth have the biggest impact.',
        'Check auspicious stars — they can turn minor trouble into an advantage.',
        'Check malefics — they escalate small troubles.',
        'Fei Lian in Friends: guard against petty people; Po Sui in Wealth: guard against leaks.',
        'Check cycles — years when they activate require extra caution with words and money.',
        'Are you being drained by trouble, or turning it into an information advantage?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-qingyang-tuoluo.html', text: 'Qing Yang & Tuo Luo' },
      { href: 'ziwei-dikong-dijie.html', text: 'Di Kong & Di Jie' },
      { href: 'ziwei-puyougong.html', text: 'The Friends Palace' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tianwu-tianyue',
    cnTitle: '紫微斗数天巫天月：遗产与病符星，一个主继承一个主慢性病',
    enTitle: 'Tian Wu and Tian Yue: The Inheritance and Illness Stars',
    cnDesc: '天巫主遗产、玄学和直觉，天月主慢性病和健康隐患。命宫有这两颗星的人，可能继承到东西，也要注意长期健康管理。',
    enDesc: 'Tian Wu rules inheritance, mysticism, and intuition; Tian Yue rules chronic illness and hidden health issues. People with them may inherit things and should manage long-term health.',
    cnLead: '天巫天月是紫微斗数里最「一正一负」的一对星。天巫是「天上的巫师」——主遗产、直觉、玄学缘分，有天巫的人可能莫名其妙继承到一笔钱或一个机会；天月是「天上的月亮」——主慢性病、健康隐患，有天月的人可能身体没什么大毛病但总是不太舒服。这两颗星放在一起讲，是因为它们都跟「看不见的东西」有关。',
    cnIntro2: '天巫属阳火（一说属水），主遗产、继承、玄学、直觉、宗教缘分。天巫入命的人第六感强，对命理、风水、宗教有天然兴趣。天月属阴水（一说属土），主慢性病、健康隐患、体质偏弱。天月跟天刑不同：天刑主急性伤灾和手术，天月主慢性疾病和亚健康。',
    cnSections: [
      { h: '天巫的核心含义', ps: [
        '天巫主「继承」——不一定是遗产，也可能是继承一个职位、一门手艺、一批人脉、或者一种精神财富。天巫入命的人可能「接班」——接父母的班、接老师的班、接前任的班。',
        '天巫也主「玄学」——第六感强、对命理风水宗教有兴趣、容易做预知梦。天巫入命的人可能有某种「直觉」，说不上为什么但就是知道。',
        '天巫在财帛宫或田宅宫，可能通过继承获得财富或房产。但天巫加煞星，继承可能有纠纷。'
      ]},
      { h: '天月的核心含义', ps: [
        '天月主「慢性病」——不是急病大病，而是长期的、反复的、不太严重但很烦人的健康问题。比如过敏、偏头痛、失眠、肠胃弱、内分泌失调。',
        '天月也主「健康隐患」——你可能觉得没什么，但体检报告上总有几个箭头。天月入命的人要注意定期体检，不要忽视小毛病。',
        '天月在疾厄宫影响最大——体质偏弱、容易有慢性病。但天月不是「短命星」，它只是提醒你要注意养生和长期健康管理。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：直觉强、有玄学缘分、但体质偏弱。适合做跟直觉和灵性有关的工作。',
        '疾厄宫：注意慢性病和亚健康、定期体检、不要熬夜。',
        '财帛宫：可能通过继承获得财富、或者靠玄学/心理/医疗行业赚钱。',
        '田宅宫：可能继承房产、或者家里有长期生病的人。',
        '官禄宫：适合做医疗、心理、命理、社工、养老等跟「照顾和传承」有关的工作。'
      ]},
      { h: '天巫天月和其他星的配合', ps: [
        '天巫加天魁天钺——继承时有贵人帮忙，或者继承的过程顺利。',
        '天巫加化禄——继承到钱财，或者靠玄学/心理行业赚钱。',
        '天月加天刑——急性病和慢性病都有，要特别注意健康。天刑主手术，天月主慢性，可能需要长期治疗。',
        '天月加解神——疾病有转机，能遇到好医生或找到好的治疗方法。',
        '天月加煞星——慢性病加重或难以治愈，要更注意养生。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天巫天月，按这个顺序读：'], ol: [
        '先看在哪个宫位——疾厄宫看健康，财帛田宅看继承。',
        '天巫看有没有化禄——化禄加天巫，继承财运好。',
        '天月看有没有解神——解神加天月，疾病有转机。',
        '天月在疾厄宫要定期体检，不要忽视小毛病。',
        '天巫在命宫可以发展直觉和玄学兴趣，但不要迷信。',
        '问自己：你继承到的「财富」是什么？你有没有好好照顾自己的身体？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-tianxing-xing.html', text: '天刑星' },
      { href: 'ziwei-jieshen-xing.html', text: '解神星' },
      { href: 'ziwei-huagai-xing.html', text: '华盖星' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian Wu and Tian Yue are a pair of opposites. Tian Wu is the "celestial shaman" — ruling inheritance, intuition, and mystic affinity; people with it may unexpectedly inherit money or an opportunity. Tian Yue is the "celestial moon" — ruling chronic illness and hidden health issues; people with it may have no major disease but never feel quite well. They\'re paired because both concern things you can\'t see.',
    enIntro2: 'Tian Wu is Yang Fire (some say Water), ruling inheritance, succession, mysticism, intuition, and religious affinity. People with it have strong sixth sense and natural interest in astrology, feng shui, religion. Tian Yue is Yin Water (some say Earth), ruling chronic illness, hidden health issues, weak constitution. Unlike Tian Xing (acute injury and surgery), Tian Yue is chronic conditions and sub-health.',
    enSections: [
      { h: 'Tian Wu: Core Meaning', ps: [
        'Rules inheritance — not necessarily money; could be a position, a craft, a network, or spiritual legacy. You may "take over" — from parents, a teacher, a predecessor.',
        'Also rules mysticism — strong intuition, interest in divination/feng shui/religion, may have prophetic dreams. You may "just know" without knowing why.',
        'In Wealth or Property: may gain wealth or real estate through inheritance. With malefics, inheritance may involve disputes.'
      ]},
      { h: 'Tian Yue: Core Meaning', ps: [
        'Rules chronic illness — not acute or severe, but long-term, recurring, annoying: allergies, migraines, insomnia, weak digestion, hormonal issues.',
        'Also rules hidden health risks — you feel fine but checkups always show a few arrows. Get regular checkups; don\'t ignore small symptoms.',
        'Strongest in Health palace — weak constitution, prone to chronic conditions. It\'s not a "short-life star," just a reminder to manage long-term health.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: strong intuition, mystic affinity, but weak constitution. Suited to intuition and spirituality-related work.',
        'Health: watch chronic illness and sub-health, regular checkups, don\'t stay up late.',
        'Wealth: may inherit wealth, or earn through mysticism/psychology/medical fields.',
        'Property: may inherit real estate, or have a chronically ill family member at home.',
        'Career: suited to healthcare, psychology, divination, social work, elder care — fields of care and legacy.'
      ]},
      { h: 'Combinations', ps: [
        'Tian Wu with Kui/Yue: benefactors help with inheritance, smooth succession.',
        'Tian Wu with Hua Lu: inherits money, or earns through mysticism/psychology.',
        'Tian Yue with Tian Xing: both acute and chronic conditions, pay special attention to health. Surgery plus long-term treatment.',
        'Tian Yue with Jie Shen: illness has turning points, good doctors or treatments appear.',
        'Tian Yue with malefics: chronic conditions worsen or hard to cure, be more diligent about health.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tian Wu/Tian Yue:'], ol: [
        'Which palace — Health for illness, Wealth/Property for inheritance.',
        'Check Hua Lu with Tian Wu — good inheritance luck.',
        'Check Jie Shen with Tian Yue — illness has turning points.',
        'Tian Yue in Health: get regular checkups, don\'t ignore small issues.',
        'Tian Wu in Life: develop intuition and mystic interests, but don\'t be superstitious.',
        'What "wealth" have you inherited? Are you taking care of your body?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-jieegong.html', text: 'The Health Palace' },
      { href: 'ziwei-tianxing-xing.html', text: 'Tian Xing Star' },
      { href: 'ziwei-jieshen-xing.html', text: 'Jie Shen Star' },
      { href: 'ziwei-huagai-xing.html', text: 'Hua Gai Star' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-yinsha-xing',
    cnTitle: '紫微斗数阴煞星：暗星，有阴煞的人直觉强但要防小人暗害',
    enTitle: 'Yin Sha Star: The Hidden Shadow Star',
    cnDesc: '阴煞主暗中小人、阴性干扰和潜意识恐惧。命宫有阴煞的人直觉极强、容易感知到「不对劲」，但也容易焦虑和被暗中的人或事影响。',
    enDesc: 'Yin Sha rules hidden petty people, unseen interference, and subconscious fear. People with it have extremely strong intuition and sense when something is off, but are prone to anxiety and hidden influences.',
    cnLead: '阴煞是紫微斗数里最「阴」的一颗星。它不像擎羊那样明着来，也不像蜚廉那样传闲话——阴煞是「你看不见但感觉得到」的东西。命宫有阴煞的人，直觉准得吓人：你走进一个房间就能感觉到气氛不对，你见一个人第一面就知道这个人不能深交。但这种敏感也是一把双刃剑——你可能因此活得比别人累。',
    cnIntro2: '阴煞属阴水（一说属阴火），主暗中小人、阴性干扰、潜意识、莫名的恐惧和焦虑。阴煞永远跟在禄存后面（禄存的前一位是擎羊，后一位是陀罗，阴煞的位置按生年支确定）。阴煞跟蜚廉不同：蜚廉是「明面上的口舌」，阴煞是「暗地里的算计」；蜚廉你能找到是谁在说你坏话，阴煞你可能连对手是谁都不知道。',
    cnSections: [
      { h: '阴煞的核心含义', ps: [
        '阴煞主「暗中小人」——有人在你看不见的地方搞小动作，可能是抢功、打小报告、暗中使绊子。你可能事后才发现，或者永远发现不了。',
        '阴煞也主「阴性干扰」——不一定是鬼故事，更多是指环境中的负能量、不干净的气场、或者让你莫名不舒服的人和地方。',
        '阴煞还主「潜意识恐惧」——你可能有一些说不上来源的焦虑、恐惧、不安全感。阴煞入命的人容易做噩梦、怕黑、或者对某些场所有莫名的排斥。'
      ]},
      { h: '阴煞的正面：超强直觉', ps: [
        '阴煞入命的人直觉极强，对危险和欺骗有天然的雷达。你可能说不上为什么，但就是知道「这个人不对劲」「这件事有问题」——而且事后往往证明你是对的。',
        '这种直觉适合用在侦查、审计、风控、心理咨询、侦探等需要「发现隐藏信息」的工作上。',
        '阴煞加天巫或华盖——玄学天赋极强，可能有通灵或预知的体验。但要注意区分直觉和幻觉。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：直觉强、敏感、容易感知到隐藏的东西。但要防焦虑和小人暗害。',
        '交友宫：朋友中有暗中的小人、容易被人背后捅刀。交朋友要慢一点、深交之前多观察。',
        '夫妻宫：感情中有隐藏的问题、或者配偶有秘密。要注意沟通中的「暗流」。',
        '疾厄宫：注意查不出来原因的慢性病、或者跟情绪有关的身体问题。',
        '田宅宫：家里可能有「不干净」的感觉、或者房子有隐藏的问题。搬家或买房时要相信第一感觉。'
      ]},
      { h: '阴煞和其他星的配合', ps: [
        '阴煞加天魁天钺——暗中有贵人保护，虽然有小人但也有暗助。',
        '阴煞加解神——暗中的问题能化解，小人的算计不会得逞。',
        '阴煞加擎羊——暗中小人升级为明面上的冲突，可能被人公开攻击。',
        '阴煞加陀罗——被暗中的麻烦长期纠缠，可能长期被人跟踪、骚扰或算计。',
        '阴煞加化忌——最需要注意的组合，暗中的损失和背叛，可能在你最信任的人身上发生。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到阴煞，按这个顺序读：'], ol: [
        '先看在哪个宫位——交友宫和夫妻宫最需要注意。',
        '看有没有天魁天钺或解神——有暗助或能化解。',
        '看有没有化忌——化忌加阴煞要防最信任的人背叛。',
        '相信你的第一直觉——阴煞入命的人，「感觉不对」往往就是不对。',
        '但也要区分「直觉」和「焦虑」——直觉是冷静的，焦虑是慌乱的。',
        '问自己：你的敏感是在保护你，还是在消耗你？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-feilian-posui.html', text: '蜚廉破碎' },
      { href: 'ziwei-jieshen-xing.html', text: '解神星' },
      { href: 'ziwei-tianwu-tianyue.html', text: '天巫天月' },
      { href: 'ziwei-puyougong.html', text: '交友宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Yin Sha is the most "yin" star. Unlike Qing Yang\'s open attack or Fei Lian\'s gossip, Yin Sha is what you can\'t see but can feel. People with it in Life have terrifyingly accurate intuition: you walk into a room and sense the atmosphere is wrong, you meet someone and instantly know they can\'t be trusted. But this sensitivity is a double-edged sword — you may live more tired than others.',
    enIntro2: 'Yin Sha is Yin Water (some say Yin Fire), ruling hidden petty people, unseen interference, the subconscious, and nameless fear and anxiety. Unlike Fei Lian\'s open gossip, Yin Sha is behind-the-scenes scheming — with Fei Lian you can find who\'s talking; with Yin Sha you may not even know who your opponent is.',
    enSections: [
      { h: 'Core Meaning', ps: [
        'Rules hidden petty people — someone working behind your back: stealing credit, reporting to the boss, setting traps. You may find out later, or never.',
        'Also rules unseen interference — not necessarily ghost stories, more like negative energy in environments, bad vibes, people or places that make you uneasy for no reason.',
        'Also rules subconscious fear — nameless anxiety, insecurity. Prone to nightmares, fear of the dark, or unexplained aversion to certain places.'
      ]},
      { h: 'The Positive Side: Super Intuition', ps: [
        'People with Yin Sha have extremely strong intuition, a natural radar for danger and deception. You can\'t explain why, but you just know "this person is off" or "this deal is wrong" — and you\'re usually proven right.',
        'This intuition suits investigation, audit, risk control, psychology, detective work — fields that require finding hidden information.',
        'With Tian Wu or Hua Gai: strong mystic talent, may have clairvoyant or precognitive experiences. But distinguish intuition from hallucination.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: strong intuition, sensitive, perceptive of hidden things. Guard against anxiety and hidden scheming.',
        'Friends: hidden petty people among friends, easy to be stabbed in the back. Make friends slowly, observe before trusting deeply.',
        'Spouse: hidden problems in the relationship, or partner keeps secrets. Watch for undercurrents in communication.',
        'Health: watch for chronic conditions with no clear cause, or stress-related physical issues.',
        'Property: home may feel "unclean," or property has hidden problems. Trust your first instinct when moving or buying.'
      ]},
      { h: 'Combinations', ps: [
        'With Kui/Yue: hidden benefactors protect you; despite petty people, you have hidden help.',
        'With Jie Shen: hidden problems can be resolved, scheming won\'t succeed.',
        'With Qing Yang: hidden scheming escalates to open conflict, may be publicly attacked.',
        'With Tuo Luo: long-term entanglement with hidden trouble — stalking, harassment, or ongoing scheming.',
        'With Hua Ji: the most caution-worthy combination — hidden loss and betrayal, possibly from someone you trust most.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Yin Sha:'], ol: [
        'Which palace — Friends and Spouse need most attention.',
        'Check Kui/Yue or Jie Shen — hidden help or resolution.',
        'Check Hua Ji — with Yin Sha, guard against betrayal by those closest.',
        'Trust your first instinct — with Yin Sha, "feeling off" usually means off.',
        'But distinguish intuition from anxiety — intuition is calm, anxiety is frantic.',
        'Is your sensitivity protecting you or draining you?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-feilian-posui.html', text: 'Fei Lian & Po Sui' },
      { href: 'ziwei-jieshen-xing.html', text: 'Jie Shen Star' },
      { href: 'ziwei-tianwu-tianyue.html', text: 'Tian Wu & Tian Yue' },
      { href: 'ziwei-puyougong.html', text: 'The Friends Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tianshang-tianshi',
    cnTitle: '紫微斗数天伤天使：虚耗灾病星，命宫迁移宫各守一位',
    enTitle: 'Tian Shang and Tian Shi: The Drain and Disaster Stars',
    cnDesc: '天伤主虚耗和损伤，天使主灾病和波折。两颗星分别固定在命宫和迁移宫的对宫位置，是紫微斗数里唯一「按宫位固定」的杂曜。',
    enDesc: 'Tian Shang rules drain and injury; Tian Shi rules disaster and illness. They sit fixed opposite Life and Travel respectively — the only auxiliary stars with fixed palace positions.',
    cnLead: '天伤天使是紫微斗数里最「特别」的两颗星——它们不是按生年排的，而是永远固定在命宫和迁移宫的对宫。天伤永远在仆役宫（交友宫），天使永远在疾厄宫。这意味着每个人的命盘上都有这两颗星，区别只在于它们跟哪些主星同宫。它们提醒你两件事：朋友可能消耗你，身体可能出问题。',
    cnIntro2: '天伤属阳水，主虚耗、损伤、朋友带来的消耗。天使属阴水，主灾病、波折、意外。天伤天使之所以固定在仆役宫和疾厄宫，是因为紫微斗数认为：人最大的两个「漏」，一是交友不慎带来的损耗，二是身体出问题带来的灾难。这两颗星每个人都有，不需要排盘就能确定位置。',
    cnSections: [
      { h: '天伤：朋友带来的消耗', ps: [
        '天伤永远在仆役宫（交友宫），它提醒你：不是所有朋友都对你好。有些朋友会消耗你的时间、金钱、精力，甚至拖累你。',
        '天伤加煞星——朋友可能给你带来实质性的损失：借钱不还、合伙被骗、被朋友出卖。',
        '天伤加吉星——虽然有消耗，但朋友也能带来帮助。关键是学会筛选：哪些朋友值得深交，哪些要保持距离。'
      ]},
      { h: '天使：身体带来的灾难', ps: [
        '天使永远在疾厄宫，它提醒你：身体是革命的本钱。天使主灾病和波折，可能是突发疾病、意外受伤、或者健康问题打乱你的计划。',
        '天使加煞星——健康问题可能比较严重，要特别注意安全和体检。天使加擎羊防外伤手术，加陀罗防慢性病拖延，加火铃防急性病。',
        '天使加吉星——虽然有健康问题但能逢凶化吉，遇到好医生或者治疗及时。'
      ]},
      { h: '为什么这两颗星固定位置', ps: [
        '紫微斗数的设计逻辑是：每个人都要面对「交友」和「健康」这两个课题。天伤在仆役宫，天使在疾厄宫，不是巧合，而是提醒你这两个领域需要格外注意。',
        '天伤天使跟其他杂曜不同——其他杂曜按生年或生月排，每个人位置不同；天伤天使位置固定，区别只在于同宫的主星和煞星。',
        '这意味着天伤天使的影响「人人有份」，但程度不同。主星强、吉星多，天伤天使的力量就弱；主星弱、煞星多，就要格外小心。'
      ]},
      { h: '天伤天使和大运流年', ps: [
        '大运走到仆役宫或疾厄宫时，天伤天使被引动，这十年要特别注意朋友关系和身体健康。',
        '流年仆役宫或疾厄宫有煞星叠加时，这一年要防朋友拖累和健康问题。',
        '天伤天使不是「注定要出事」，而是「这个领域需要你主动管理」。朋友要筛选，身体要保养——这是两颗星给你的功课。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天伤天使，按这个顺序读：'], ol: [
        '天伤在仆役宫——看仆役宫的主星和煞星，判断朋友是帮你还是消耗你。',
        '天使在疾厄宫——看疾厄宫的主星和煞星，判断健康风险在哪里。',
        '看有没有吉星——吉星能减轻天伤天使的负面影响。',
        '看大运流年——走到这两个宫位时要格外注意。',
        '天伤的功课：学会拒绝消耗你的人。',
        '天使的功课：好好照顾身体，不要等出了问题才后悔。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-puyougong.html', text: '交友宫怎么看' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-tianxing-xing.html', text: '天刑星' },
      { href: 'ziwei-tianwu-tianyue.html', text: '天巫天月' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian Shang and Tian Shi are the most special stars — they aren\'t placed by birth year, but sit permanently opposite Life and Travel. Tian Shang is always in the Friends palace, Tian Shi always in Health. This means everyone has them; the only difference is which main stars share the palace. They remind you of two things: friends can drain you, and your body can fail you.',
    enIntro2: 'Tian Shang is Yang Water, ruling drain, injury, and消耗 from friends. Tian Shi is Yin Water, ruling disaster, illness, and setbacks. They sit fixed in Friends and Health because Zi Wei Dou Shu holds that life\'s two biggest leaks are: losses from bad friends, and disasters from failing health. Everyone has them — no chart-casting needed to locate them.',
    enSections: [
      { h: 'Tian Shang: Drain from Friends', ps: [
        'Always in Friends palace, it reminds you: not all friends are good for you. Some drain your time, money, energy, or drag you down.',
        'With malefics: friends may cause real losses — unpaid loans, partnership scams, betrayal.',
        'With auspicious stars: despite drain, friends also help. The key is filtering: which friends deserve closeness, which need distance.'
      ]},
      { h: 'Tian Shi: Disaster from the Body', ps: [
        'Always in Health palace, it reminds you: health is your foundation. It rules disaster, illness, setbacks — sudden disease, accidental injury, or health issues disrupting plans.',
        'With malefics: health problems may be serious; pay special attention to safety and checkups. With Qing Yang: watch for injury/surgery; with Tuo Luo: chronic conditions; with Huo Ling: acute illness.',
        'With auspicious stars: health issues arise but resolve well — good doctors or timely treatment.'
      ]},
      { h: 'Why Fixed Positions?', ps: [
        'Zi Wei Dou Shu\'s logic: everyone must face the lessons of friendship and health. Tian Shang in Friends and Tian Shi in Health aren\'t coincidence — they flag these areas for extra attention.',
        'Unlike other auxiliary stars (placed by birth year/month, varying per person), these are fixed; only the cohabiting main stars and malefics differ.',
        'This means everyone gets their influence, but to varying degrees. Strong main stars and many auspicious stars weaken them; weak main stars and many malefics require extra caution.'
      ]},
      { h: 'With Cycles', ps: [
        'When a major cycle passes through Friends or Health, Tian Shang/Tian Shi activate — pay special attention to friendships and health that decade.',
        'When annual Friends or Health has stacked malefics, that year guard against friend-related losses and health issues.',
        'They don\'t mean "something bad is fated" — they mean "this area needs active management." Filter friends, care for your body. That\'s their lesson.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tian Shang/Tian Shi:'], ol: [
        'Tian Shang in Friends — check the main star and malefics there to judge whether friends help or drain.',
        'Tian Shi in Health — check main star and malefics to identify health risks.',
        'Check auspicious stars — they reduce the negative impact.',
        'Check cycles — be extra careful when passing through these palaces.',
        'Tian Shang\'s lesson: learn to refuse people who drain you.',
        'Tian Shi\'s lesson: take care of your body before problems arise.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-puyougong.html', text: 'The Friends Palace' },
      { href: 'ziwei-jieegong.html', text: 'The Health Palace' },
      { href: 'ziwei-tianxing-xing.html', text: 'Tian Xing Star' },
      { href: 'ziwei-tianwu-tianyue.html', text: 'Tian Wu & Tian Yue' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tianchu-xing',
    cnTitle: '紫微斗数天厨星：衣食星，有天厨的人有口福、吃穿不愁',
    enTitle: 'Tian Chu Star: The Food and Clothing Star',
    cnDesc: '天厨星主口福、俸禄和衣食享受。命宫有天厨的人爱吃会吃、生活有品质，但也要防贪吃和安逸。',
    enDesc: 'Tian Chu rules good food, salary, and material comfort. People with it love and appreciate food and live well, but should guard against overindulgence and complacency.',
    cnLead: '天厨星是紫微斗数里最「好吃」的一颗星。命宫有天厨的人，天生对美食有鉴赏力——你可能不是大厨，但你一定知道哪家馆子好吃、哪道菜地道。天厨也主俸禄，就是「公家饭」——有天厨的人容易在体制内或大公司找到稳定的工作，吃穿不愁。但天厨的陷阱是「安逸」——太舒服了就不想动了。',
    cnIntro2: '天厨属阳火（一说属木），主口福、俸禄、衣食享受。天厨入命的人通常胃口好、爱吃、会吃，对生活品质有要求。天厨跟禄存不同：禄存是「存钱罐」，主积蓄和节俭；天厨是「饭碗」，主收入和享受。禄存的人有钱但舍不得花，天厨的人会赚也会花。',
    cnSections: [
      { h: '天厨的核心含义', ps: [
        '天厨主「口福」——爱吃、会吃、有美食运。天厨入命的人可能走到哪里都能吃到好东西，或者朋友总请你吃饭。',
        '天厨也主「俸禄」——稳定的收入、公家饭、薪水。天厨入命的人适合在体制内、大公司、或者有稳定薪酬体系的机构工作。',
        '天厨还主「生活品质」——你对衣食住行有要求，不喜欢将就。天厨入命的人可能穿得不一定贵但一定舒服，吃得不一定奢侈但一定可口。'
      ]},
      { h: '天厨在十二宫', ps: [
        '命宫：有口福、生活有品质、适合稳定工作。但要防贪吃和安逸。',
        '财帛宫：收入稳定、跟「吃」有关的行业能赚钱——餐饮、食品、农业。',
        '官禄宫：适合做餐饮、食品、公务员、大公司行政。工作稳定、福利好。',
        '田宅宫：家里吃得好、厨房讲究、或者家里有存粮。',
        '福德宫：精神上追求享受、喜欢美食和舒适的生活、容易满足。'
      ]},
      { h: '天厨和其他星的配合', ps: [
        '天厨加禄存——「饭碗加存钱罐」，既有稳定收入又能存住钱，是最好的物质配置之一。',
        '天厨加化禄——收入高、口福好、生活优渥。但也可能花得多。',
        '天厨加化忌——「饭碗破了」，可能失业、降薪、或者吃出健康问题。要注意饮食节制。',
        '天厨加天月——爱吃但身体不允许，可能有糖尿病、痛风等跟吃有关的慢性病。',
        '天厨加火星铃星——急性肠胃炎、食物中毒、或者吃饭时容易吵架。'
      ]},
      { h: '天厨的陷阱', ps: [
        '贪吃——天厨入命的人容易管不住嘴，导致肥胖、三高、消化系统问题。美食可以享受，但要节制。',
        '安逸——天厨主稳定，但太稳定了就会失去动力。你可能在一个舒服的位置上待太久，错过了成长的机会。',
        '「铁饭碗」思维——天厨加吉星确实适合体制内，但不要把稳定当成不努力的借口。天厨给你饭碗，但能端多久取决于你自己。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天厨，按这个顺序读：'], ol: [
        '先看在哪个宫位——财帛宫和官禄宫看收入，命宫看生活态度。',
        '看有没有禄存——天厨加禄存，收入稳又能存。',
        '看有没有化忌——化忌加天厨，防失业和饮食问题。',
        '看有没有天月——天月加天厨，注意跟吃有关的慢性病。',
        '享受美食但不要贪吃，追求稳定但不要安逸。',
        '问自己：你的「饭碗」是让你安心，还是让你失去了斗志？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-lucun-xing.html', text: '禄存星' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-tianwu-tianyue.html', text: '天巫天月' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian Chu is the most "food-loving" star. People with it in Life have natural gourmet taste — you may not be a chef, but you know which restaurant is good and which dish is authentic. It also rules salary — the "iron rice bowl." People with it easily find stable jobs in institutions or large companies, never short of food and clothing. But the trap is complacency — too comfortable, and you stop moving.',
    enIntro2: 'Tian Chu is Yang Fire (some say Wood), ruling good food, salary, and material comfort. People with it usually have good appetites, love eating, and appreciate quality of life. Unlike Lu Cun (the piggy bank, savings and frugality), Tian Chu is the rice bowl — income and enjoyment. Lu Cun people have money but won\'t spend it; Tian Chu people earn well and spend well.',
    enSections: [
      { h: 'Core Meaning', ps: [
        'Rules gourmet luck — love food, appreciate food, have food fortune. Wherever you go, you find good things to eat, or friends treat you.',
        'Also rules salary — stable income, the "iron rice bowl," regular paycheck. Suited to government, large companies, or organizations with structured pay.',
        'Also rules quality of life — you have standards for food, clothing, shelter, and don\'t like settling. Your clothes may not be expensive but are comfortable; your food may not be lavish but is delicious.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: good food fortune, quality of life, suited to stable work. Guard against overeating and complacency.',
        'Wealth: stable income, can earn in food-related industries — restaurants, food products, agriculture.',
        'Career: suited to F&B, food, civil service, corporate administration. Stable work with good benefits.',
        'Property: good eating at home, well-equipped kitchen, or well-stocked pantry.',
        'Mental: spiritually seeks enjoyment, loves food and comfort, easily contented.'
      ]},
      { h: 'Combinations', ps: [
        'With Lu Cun: "rice bowl plus piggy bank" — stable income and savings, one of the best material setups.',
        'With Hua Lu: high income, great food fortune, comfortable life. But may also spend heavily.',
        'With Hua Ji: "broken rice bowl" — possible job loss, pay cut, or health problems from eating. Watch diet.',
        'With Tian Yue: love food but body can\'t handle it — possible diabetes, gout, or other diet-related chronic conditions.',
        'With Huo Ling: acute gastroenteritis, food poisoning, or arguments during meals.'
      ]},
      { h: 'The Trap', ps: [
        'Overeating — prone to not controlling appetite, leading to obesity, high cholesterol, digestive issues. Enjoy food but in moderation.',
        'Complacency — stability can kill motivation. You may stay in a comfortable position too long and miss growth opportunities.',
        '"Iron rice bowl" thinking — with auspicious stars it suits institutional work, but don\'t let stability become an excuse for not trying. Tian Chu gives you the bowl; how long you hold it depends on you.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tian Chu:'], ol: [
        'Which palace — Wealth/Career for income, Life for attitude.',
        'Check Lu Cun — rice bowl plus savings.',
        'Check Hua Ji — broken bowl, watch job and diet.',
        'Check Tian Yue — diet-related chronic conditions.',
        'Enjoy food but don\'t overeat; seek stability but not complacency.',
        'Does your rice bowl give you security, or has it taken away your drive?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-lucun-xing.html', text: 'Lu Cun Star' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-tianwu-tianyue.html', text: 'Tian Wu & Tian Yue' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tianguan-tianfu',
    cnTitle: '紫微斗数天官天福：官福双星，有这两颗星的人仕途顺、福气厚',
    enTitle: 'Tian Guan and Tian Fu: The Office and Fortune Stars',
    cnDesc: '天官主官贵和仕途，天福主福气和长寿。命宫有这两颗星的人，容易在体制内发展，一生福气厚、逢凶化吉。',
    enDesc: 'Tian Guan rules official rank and career; Tian Fu rules fortune and longevity. People with them easily advance in institutions and enjoy thick fortune that turns misfortune around.',
    cnLead: '天官天福是紫微斗数里最「稳」的两颗吉曜。天官给你「官运」——不是让你当大官，而是让你在体制内或大机构里顺顺当当；天福给你「福气」——不是大富大贵，而是一辈子平平安安、逢凶化吉。这两颗星不张扬，但它们给你的是最实在的东西：稳定和好运。',
    cnIntro2: '天官属阳土，主官贵、仕途、正式的官职和地位。天福属阳土（一说属水），主福气、长寿、知足常乐。天官天福跟天魁天钺不同：魁钺是「贵人」，别人帮你；天官天福是「自带的福气」，你自己命里就有。',
    cnSections: [
      { h: '天官和天福的区别', ps: [
        '天官偏「官运」——适合在体制内、大机构、有层级的组织里发展。天官入命的人做事规矩、有上下级观念、适合走仕途或管理层。',
        '天福偏「福气」——一生平顺、知足常乐、逢凶化吉。天福入命的人可能不是最有钱最有权的，但你是最「想得开」的，这种心态本身就是最大的福气。',
        '两颗都有最好——既有官运又有福气，事业稳、心态好、一生平安。'
      ]},
      { h: '天官在十二宫', ps: [
        '命宫：做事规矩、有官相、适合体制内或大机构。但可能太按规矩来，缺乏灵活性。',
        '官禄宫：仕途顺利、容易升职、适合公务员或大公司管理岗。',
        '财帛宫：收入来自正式工资或体制内福利、稳定但不会暴富。',
        '迁移宫：在外容易获得官方身份或正式职位、适合去政府机构发展。',
        '夫妻宫：配偶可能在体制内工作、或者婚姻正式稳定。'
      ]},
      { h: '天福在十二宫', ps: [
        '命宫：一生福气厚、心态好、逢凶化吉。天福入命的人通常长寿。',
        '福德宫：精神富足、知足常乐、不喜欢跟人争。',
        '疾厄宫：身体素质好、即使生病也容易康复、有长寿的底子。',
        '田宅宫：家庭和睦、居住环境舒适、家里有福气。',
        '财帛宫：财运平稳、不缺钱花、但也不会大富大贵。'
      ]},
      { h: '天官天福和其他星的配合', ps: [
        '天官加紫微——帝星加官星，官运最旺，容易获得高位。',
        '天官加太阳——太阳主贵，加天官适合在政府或国企发展。',
        '天官加化权——有实权的官，不是虚职。',
        '天福加天寿——福寿双全，是长寿的标志。',
        '天福加解神——福气加化解能力，逢凶化吉的力量最强。',
        '天官天福加煞星——官运有阻碍或福气打折，但不会完全失效。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天官天福，按这个顺序读：'], ol: [
        '先看在哪个宫位——天官看官禄，天福看命宫和福德。',
        '看有没有紫微或太阳——主星强，官运才旺。',
        '看有没有化权——化权加天官，有实权。',
        '天福在疾厄宫是好配置——身体素质好、容易康复。',
        '看有没有煞星——煞星会让官运受阻或福气打折。',
        '问自己：你的「福气」是「知足」还是「安于现状」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-tiankui-tianyue.html', text: '天魁天钺' },
      { href: 'ziwei-enguang-tiangui.html', text: '恩光天贵' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian Guan and Tian Fu are the steadiest auspicious stars. Tian Guan gives official luck — not necessarily high office, but smooth progress in institutions. Tian Fu gives fortune — not great wealth, but a peaceful life that turns misfortune into blessing. They\'re not flashy, but they give the most practical things: stability and good luck.',
    enIntro2: 'Tian Guan is Yang Earth, ruling official rank, career, and formal position. Tian Fu is Yang Earth (some say Water), ruling fortune, longevity, and contentment. Unlike Kui/Yue (benefactors who help you from outside), Tian Guan/Tian Fu are fortune you carry within.',
    enSections: [
      { h: 'The Difference', ps: [
        'Tian Guan leans toward official career — suited to government, large institutions, hierarchical organizations. People with it follow rules, respect hierarchy, suited to administration or management.',
        'Tian Fu leans toward fortune — a smooth life, contentment, turning misfortune into blessing. You may not be the richest or most powerful, but you\'re the most at peace — and that mindset itself is the greatest fortune.',
        'Both together is best — official career plus fortune, stable work, good mindset, peaceful life.'
      ]},
      { h: 'Tian Guan Across the Palaces', ps: [
        'Life: rule-abiding, official bearing, suited to institutions. May be too rigid.',
        'Career: smooth official path, easy promotion, suited to civil service or corporate management.',
        'Wealth: income from formal salary or institutional benefits, stable but not windfall wealth.',
        'Travel: easy to gain official status or formal positions away from home.',
        'Spouse: partner may work in government, or marriage is formal and stable.'
      ]},
      { h: 'Tian Fu Across the Palaces', ps: [
        'Life: thick fortune, good mindset, turns misfortune around. Usually long-lived.',
        'Mental: spiritually content, happy with what you have, doesn\'t compete.',
        'Health: good constitution, recovers easily from illness, foundation for longevity.',
        'Property: harmonious family, comfortable living environment, fortunate home.',
        'Wealth: steady finances, never short of money, but not super rich.'
      ]},
      { h: 'Combinations', ps: [
        'Tian Guan with Zi Wei: emperor plus official star, strongest official luck, easy to reach high position.',
        'Tian Guan with Tai Yang: nobility plus official, suited to government or state enterprises.',
        'Tian Guan with Hua Quan: official with real power, not a figurehead.',
        'Tian Fu with Tian Shou: fortune and longevity both complete, a sign of long life.',
        'Tian Fu with Jie Shen: fortune plus resolution, strongest ability to turn misfortune around.',
        'With malefics: official path has obstacles or fortune is reduced, but not entirely negated.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tian Guan/Tian Fu:'], ol: [
        'Which palace — Tian Guan in Career, Tian Fu in Life/Mental.',
        'Check Zi Wei or Tai Yang — strong main star makes official luck flourish.',
        'Check Hua Quan — with Tian Guan, real power.',
        'Tian Fu in Health is good — strong constitution, easy recovery.',
        'Check malefics — they obstruct official luck or reduce fortune.',
        'Is your "fortune" contentment or complacency?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-tiankui-tianyue.html', text: 'Tian Kui & Tian Yue' },
      { href: 'ziwei-enguang-tiangui.html', text: 'En Guang & Tian Gui' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tiancai-tianshou',
    cnTitle: '紫微斗数天才天寿：才智与长寿星，一个主聪明一个主寿元',
    enTitle: 'Tian Cai and Tian Shou: The Talent and Longevity Stars',
    cnDesc: '天才主才智和领悟力，天寿主长寿和稳重。命宫有这两颗星的人聪明且稳重，但天才也要防聪明反被聪明误。',
    enDesc: 'Tian Cai rules intelligence and comprehension; Tian Shou rules longevity and steadiness. People with them are smart and steady, but Tian Cai warns against being too clever by half.',
    cnLead: '天才天寿是紫微斗数里最「聪明」的一对星。天才入命的人学东西快、领悟力强、一点就透；天寿入命的人稳重、有耐心、活得久。这两颗星放在一起讲很有意思——天才给你「快」，天寿给你「慢」；天才让你少年得志，天寿让你大器晚成。两颗都有，就是「又快又稳」。',
    cnIntro2: '天才属阴木（一说属水），主才智、聪明、领悟力、学习能力。天寿属阳土（一说属水），主长寿、稳重、耐心、福气。天才跟文昌文曲不同：昌曲是「读书考试的聪明」，天才是「领悟力和直觉的聪明」；昌曲靠努力，天才靠天赋。',
    cnSections: [
      { h: '天才和天寿的区别', ps: [
        '天才偏「才智」——学东西快、领悟力强、反应快、有创造力。天才入命的人可能不需要很努力就能考得不错，但也可能因为太聪明而不肯下笨功夫。',
        '天寿偏「长寿稳重」——性格稳重、有耐心、做事慢工出细活、寿命长。天寿入命的人可能大器晚成，越老越好。',
        '两颗都有最好——聪明加稳重，既有天赋又有耐心。这种人通常能成大事，因为天才给你方向，天寿给你坚持。'
      ]},
      { h: '天才的陷阱', ps: [
        '聪明反被聪明误——天才入命的人可能因为太聪明而走捷径、耍小聪明、不肯下苦功。结果是「小时了了，大未必佳」。',
        '骄傲——你可能觉得别人都不如你聪明，不愿意听别人的意见，导致人际关系出问题。',
        '三分钟热度——天才学东西快，但也容易失去兴趣。你可能什么都会一点，但没有一样精通。',
        '天才加煞星——聪明用错地方，可能耍心机、走偏门、或者因为聪明而遭人嫉妒。'
      ]},
      { h: '天寿的好处', ps: [
        '长寿——天寿入命的人通常寿命长，而且越老越有福气。',
        '稳重——你做事不急不躁，有耐心，能坚持。这种性格在需要长期积累的领域（学术、技术、手艺）特别有优势。',
        '逢凶化吉——天寿的人遇到困难时能「熬过去」，因为你有耐心等转机。',
        '天寿加天福——福寿双全，是最好的长寿配置。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：聪明领悟力强、性格稳重、适合做需要脑力和耐心的工作。',
        '官禄宫：工作中靠才智取胜、适合做研究、技术、策划。天寿在官禄宫适合做需要长期积累的工作。',
        '福德宫：精神丰富、有智慧、心态平和。天寿在福德宫主长寿和知足。',
        '疾厄宫：天寿在疾厄宫身体素质好、恢复力强、有长寿的底子。',
        '夫妻宫：配偶聪明或稳重、婚姻关系稳定长久。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天才天寿，按这个顺序读：'], ol: [
        '先看在哪个宫位——命宫和官禄宫影响最大。',
        '天才看有没有煞星——煞星会让聪明用错地方。',
        '天寿看有没有天福——福寿双全最好。',
        '天才入命要提醒自己下笨功夫——聪明是天赋，但成就是熬出来的。',
        '天寿入命要利用耐心优势——找一个值得长期投入的方向。',
        '问自己：你是在「靠聪明走捷径」还是「用天赋加耐心做大事」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-wenchang-wenqu.html', text: '文昌文曲' },
      { href: 'ziwei-tianguan-tianfu.html', text: '天官天福' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian Cai and Tian Shou are the brainiest pair. Tian Cai in Life means fast learning, strong comprehension, getting it on the first try. Tian Shou means steadiness, patience, long life. Together they\'re interesting — Tian Cai gives speed, Tian Shou gives slowness; Tian Cai makes you a young prodigy, Tian Shou makes you a late bloomer. Both together means fast and steady.',
    enIntro2: 'Tian Cai is Yin Wood (some say Water), ruling intelligence, comprehension, and learning ability. Tian Shou is Yang Earth (some say Water), ruling longevity, steadiness, and patience. Unlike Chang/Qu (book-smarts for exams), Tian Cai is intuitive comprehension and natural talent — Chang/Qu require effort; Tian Cai is gifted.',
    enSections: [
      { h: 'The Difference', ps: [
        'Tian Cai leans toward intellect — fast learner, strong comprehension, quick reactions, creative. May do well without much effort, but may also refuse to do the "dumb work" because everything comes too easily.',
        'Tian Shou leans toward longevity and steadiness — calm character, patient, slow-and-careful work, long life. May be a late bloomer who gets better with age.',
        'Both together is best — intelligence plus steadiness, talent plus patience. These people usually achieve big things: Tian Cai gives direction, Tian Shou gives persistence.'
      ]},
      { h: 'Tian Cai\'s Trap', ps: [
        'Too clever by half — may take shortcuts, play smart, refuse to do the hard work. Result: "bright as a child, unremarkable as an adult."',
        'Arrogance — may think others are less intelligent, refuse to listen, causing relationship problems.',
        'Short attention span — learns fast but loses interest fast. May know a little about everything but master nothing.',
        'With malefics: intelligence used wrongly — scheming, taking crooked paths, or provoking jealousy.'
      ]},
      { h: 'Tian Shou\'s Advantages', ps: [
        'Longevity — usually long life, and more fortunate with age.',
        'Steadiness — unhurried, patient, persistent. A huge advantage in fields requiring long-term accumulation (academia, tech, craft).',
        'Riding out trouble — when difficulties come, you can "outlast" them, patiently waiting for the turn.',
        'With Tian Fu: fortune and longevity both complete, the best longevity setup.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: intelligent and perceptive, steady character, suited to work requiring both brain and patience.',
        'Career: wins through intellect, suited to research, tech, planning. Tian Shou here suits long-term-accumulation work.',
        'Mental: rich inner world, wise, peaceful mindset. Tian Shou here means longevity and contentment.',
        'Health: Tian Shou here means good constitution, strong recovery, foundation for longevity.',
        'Spouse: partner is smart or steady, marriage stable and long-lasting.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tian Cai/Tian Shou:'], ol: [
        'Which palace — Life and Career have the biggest impact.',
        'Check malefics with Tian Cai — they make intelligence go astray.',
        'Check Tian Fu with Tian Shou — fortune plus longevity is best.',
        'With Tian Cai: remind yourself to do the dumb work — talent is a gift, but achievement is earned through persistence.',
        'With Tian Shou: leverage patience — find a direction worth long-term investment.',
        'Are you "taking shortcuts with cleverness" or "using talent plus patience to do something big"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-wenchang-wenqu.html', text: 'Wen Chang & Wen Qu' },
      { href: 'ziwei-tianguan-tianfu.html', text: 'Tian Guan & Tian Fu' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-jieegong.html', text: 'The Health Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-jiekong-xunkong',
    cnTitle: '紫微斗数截空旬空：空亡星，有这两颗星的事容易中途断掉',
    enTitle: 'Jie Kong and Xun Kong: The Void Stars',
    cnDesc: '截空旬空主中断、落空和虚无。命宫有这两颗星的人，事情容易做到一半断掉，但它们也能让你「放下」不该执着的东西。',
    enDesc: 'Jie Kong and Xun Kong rule interruption, emptiness, and void. Things tend to break halfway for people with them, but they also help you let go of what you shouldn\'t cling to.',
    cnLead: '截空旬空是紫微斗数里最「玄」的两颗空星。地空地劫是「大空」——一下子没了；截空旬空是「断空」——做到一半断了。你有没有过这种经历：一段感情谈得好好的突然就分了，一个项目做得差不多突然黄了，一句话说到嘴边突然忘了？截空旬空管的就是这种「莫名其妙断掉」的事。',
    cnIntro2: '截空和旬空都属火（一说截空属火、旬空属水），主中断、落空、虚无、半途而废。截空按生年排，旬空按生年的旬排。截空旬空跟地空地劫不同：空劫是「主动的空」——你自己想突破、想换跑道；截空旬空是「被动的空」——外力让事情中断，你控制不了。',
    cnSections: [
      { h: '截空和旬空的区别', ps: [
        '截空偏「截断」——事情被外力突然中断，像被一刀切断。截空入命的人可能经历突然的分手、突然的失业、突然的搬家。',
        '旬空偏「虚空」——事情看似存在但实际上是空的，像竹篮打水。旬空入命的人可能得到一个头衔但没有实权，赚到一笔钱但很快花掉，谈了一场恋爱但没有结果。',
        '两颗都有最「空」——既被截断又落空，做事情容易半途而废。但空亡星也有好处：它们让你不执着，学会放下。'
      ]},
      { h: '截空旬空的正面', ps: [
        '空亡星让人「放下」——你可能比别人更容易看开，不执着于结果。这种心态在佛学和灵修中是很高的境界。',
        '截空旬空加华盖或天巫——玄学天赋强，对「空」的理解比别人深，适合修行或研究哲学。',
        '截空在疾厄宫——「空」掉疾病，可能病着病着自己好了，或者检查出问题但复查又没了。',
        '旬空在财帛宫——对钱不太执着，不会成为钱的奴隶。但要注意理财，不要赚多少花多少。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：做事容易半途而废、计划赶不上变化。但心态好、看得开。适合做灵活多变的工作。',
        '夫妻宫：感情容易中断或有名无实。要注意维护关系，不要轻易放弃。',
        '官禄宫：事业容易有中断——可能换行、失业、或者项目中途停止。适合做自由职业或短期项目。',
        '财帛宫：钱财容易落空——赚到了又花掉、投资容易打水漂。要稳健理财。',
        '疾厄宫：疾病可能「空」掉——症状消失或查不出问题。但也要防误诊。'
      ]},
      { h: '截空旬空和其他星的配合', ps: [
        '截空旬空加化禄——「空财」，赚到钱但留不住，或者钱来得快去得也快。',
        '截空旬空加化权——权力落空，有名无实。',
        '截空旬空加化科——名声可能昙花一现，红了一阵就没人记得了。',
        '截空旬空加地空地劫——「空上加空」，对物质的执着最低，但也要防一生漂泊无依。',
        '截空旬空加吉星——吉星能减轻空亡的力量，让中断变成「转折」而不是「终结」。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到截空旬空，按这个顺序读：'], ol: [
        '先看在哪个宫位——夫妻宫和官禄宫最容易受影响。',
        '看有没有吉星——吉星能把「中断」变成「转折」。',
        '看有没有化禄化权——好东西遇到空亡会打折扣。',
        '截空旬空在命宫的人要学会「坚持」——不要轻易放弃。',
        '但也要学会「放下」——有些东西断了是因为它本来就不属于你。',
        '问自己：你经历的「断」，是「命运的打断」还是「自己没坚持」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-dikong-dijie.html', text: '地空地劫' },
      { href: 'ziwei-huagai-xing.html', text: '华盖星' },
      { href: 'ziwei-fuqigong.html', text: '夫妻宫怎么看' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Jie Kong and Xun Kong are the most mystical void stars. Di Kong/Di Jie are "big void" — gone in an instant. Jie Kong/Xun Kong are "broken void" — things break halfway. Have you ever had: a relationship going well that suddenly ends, a project nearly done that collapses, a word on the tip of your tongue that vanishes? That\'s Jie Kong/Xun Kong — things that inexplicably break off.',
    enIntro2: 'Both are Fire (some say Xun Kong is Water), ruling interruption, emptiness, and abandonment halfway. Jie Kong is placed by birth year; Xun Kong by the birth-year\'s ten-day cycle. Unlike Kong Jie (active void — you choose to break through and change paths), Jie Kong/Xun Kong are passive void — external forces interrupt things beyond your control.',
    enSections: [
      { h: 'The Difference', ps: [
        'Jie Kong leans toward severance — things are suddenly cut off by external force, like a knife cut. May experience sudden breakup, sudden job loss, sudden move.',
        'Xun Kong leans toward hollow emptiness — things exist but are empty inside, like drawing water with a bamboo basket. May get a title with no power, earn money that quickly vanishes, a relationship that goes nowhere.',
        'Both together is most void — severed and hollow, prone to abandoning things halfway. But void stars also help you let go of what you shouldn\'t cling to.'
      ]},
      { h: 'The Positive Side', ps: [
        'Void stars make you let go — you may find it easier than others to not cling to outcomes. In Buddhism and spirituality, this is a high state.',
        'With Hua Gai or Tian Wu: strong mystic talent, deeper understanding of "emptiness," suited to practice or philosophy.',
        'Jie Kong in Health: "voiding" illness — symptoms may disappear on their own, or a problem found on one test vanishes on the next.',
        'Xun Kong in Wealth: not attached to money, won\'t be its slave. But manage finances — don\'t spend everything you earn.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: prone to abandoning things halfway, plans always changing. But good mindset, can let go. Suited to flexible work.',
        'Spouse: relationships may break or exist in name only. Maintain the relationship; don\'t give up easily.',
        'Career: career interruptions — industry changes, unemployment, projects stopping midway. Suited to freelance or short-term projects.',
        'Wealth: money may fall through — earned then spent, investments may go nowhere. Invest conservatively.',
        'Health: illness may "void" — symptoms disappear or can\'t be found. But watch for misdiagnosis.'
      ]},
      { h: 'Combinations', ps: [
        'With Hua Lu: "empty wealth" — money earned but not kept, comes fast goes fast.',
        'With Hua Quan: power falls through, title without substance.',
        'With Hua Ke: fame may be fleeting, hot for a while then forgotten.',
        'With Kong Jie: "void upon void" — lowest attachment to material things, but guard against drifting through life with nothing to hold onto.',
        'With auspicious stars: they reduce void power, turning interruption into "pivot" rather than "end."'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Jie Kong/Xun Kong:'], ol: [
        'Which palace — Spouse and Career are most affected.',
        'Check auspicious stars — they turn interruption into pivot.',
        'Check Hua Lu/Hua Quan — good things are discounted when they meet void.',
        'With them in Life: learn persistence — don\'t give up easily.',
        'But also learn to let go — some things break because they were never yours to keep.',
        'Is the "break" you experienced fate interrupting, or you not persisting?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-dikong-dijie.html', text: 'Di Kong & Di Jie' },
      { href: 'ziwei-huagai-xing.html', text: 'Hua Gai Star' },
      { href: 'ziwei-fuqigong.html', text: 'The Spouse Palace' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tiande-yuede',
    cnTitle: '紫微斗数天德月德：德星，有这两颗星的人能逢凶化吉',
    enTitle: 'Tian De and Yue De: The Virtue Stars',
    cnDesc: '天德月德是消灾解厄之星。命宫有这两颗星的人，一生中即使遇到灾祸也能化解，心地善良、有德行。',
    enDesc: 'Tian De and Yue De are disaster-dissolving stars. People with them can turn misfortune into blessing even when disaster strikes; they are kind-hearted and virtuous.',
    cnLead: '天德月德是紫微斗数里最「善良」的两颗星。命宫有天德月德的人，天生心肠软、见不得别人受苦、愿意帮人。而这种善良本身就是最好的护身符——紫微斗数认为「德能解厄」，一个有德行的人，即使命盘里有煞星，灾祸也会减轻。这不是迷信，而是一个朴素的道理：好人遇到困难时，愿意帮他的人也多。',
    cnIntro2: '天德属阳火（一说属土），月德属阴水（一说属木）。天德月德都是「德星」，主消灾、解厄、逢凶化吉。它们跟解神不同：解神是「解决问题的能力」，天德月德是「德行带来的保护」。解神靠方法，天德月德靠人品。',
    cnSections: [
      { h: '天德和月德的区别', ps: [
        '天德偏「阳德」——明显的善行、见义勇为、光明磊落。天德入命的人做了好事会让人知道，也愿意公开站出来主持公道。',
        '月德偏「阴德」——暗中行善、不张扬、默默帮人。月德入命的人可能做了很多好事但不说，属于「积阴德」的类型。',
        '两颗都有最好——既光明磊落又不张扬，德行最厚。这种人即使遇到大灾大难，也总能化险为夷。'
      ]},
      { h: '德星为什么能消灾', ps: [
        '紫微斗数认为「德能解厄」——一个人的德行可以改变命运的走向。这不是玄学，而是有现实逻辑的：善良的人朋友多，遇到困难时愿意帮忙的人也多。',
        '天德月德入命的人，即使命盘里有擎羊、陀罗、化忌等煞星，灾祸的程度也会减轻。可能同样的事发生在别人身上是大灾，发生在你身上只是虚惊一场。',
        '但德星不是「免死金牌」——它不能让你为所欲为然后不受惩罚。德星的保护建立在「你真的有德行」的基础上。如果你做了坏事，德星的力量会减弱。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：心地善良、有德行、逢凶化吉。但也要防被人利用你的善良。',
        '官禄宫：工作中口碑好、受人尊重、遇到危机时有人帮你说话。',
        '疾厄宫：生病时能遇到好医生、疾病有转机、逢凶化吉。',
        '迁移宫：在外遇到困难时有贵人相助、逢凶化吉。',
        '夫妻宫：配偶善良、婚姻中有福报、遇到感情危机时能化解。'
      ]},
      { h: '天德月德和其他星的配合', ps: [
        '天德月德加天魁天钺——贵人运最强，遇到困难时有贵人主动帮忙。',
        '天德月德加解神——德行加解决能力，逢凶化吉的力量翻倍。',
        '天德月德加化忌——化忌带来的灾祸能被德星化解，大事化小。',
        '天德月德加擎羊陀罗——煞星带来的冲突和灾祸会减轻，可能只是虚惊一场。',
        '天德月德加天刑——天刑的官非能被德星化解，即使有官司也容易胜诉或和解。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天德月德，按这个顺序读：'], ol: [
        '先看在哪个宫位——命宫和疾厄宫最好。',
        '看有没有天魁天钺或解神——德星加贵人或化解能力，保护最强。',
        '看有没有煞星或化忌——德星能减轻这些凶星的力量。',
        '天德月德入命的人要继续行善——德星的力量来自你的行为。',
        '但也要学会保护自己——善良不是软弱，帮人也要有底线。',
        '问自己：你的善良是「选择」还是「习惯」？有没有因为善良而委屈过自己？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-jieshen-xing.html', text: '解神星' },
      { href: 'ziwei-tiankui-tianyue.html', text: '天魁天钺' },
      { href: 'ziwei-tianxing-xing.html', text: '天刑星' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian De and Yue De are the kindest stars. People with them in Life are naturally soft-hearted, can\'t bear to see others suffer, and willingly help. And this kindness itself is the best protection — Zi Wei Dou Shu holds that "virtue dissolves misfortune." A virtuous person, even with malefics in the chart, finds disasters lightened. This isn\'t superstition; it\'s simple logic: good people have more friends, and when trouble comes, more people will help.',
    enIntro2: 'Tian De is Yang Fire (some say Earth), Yue De is Yin Water (some say Wood). Both are "virtue stars," ruling disaster-dissolving and turning misfortune into blessing. Unlike Jie Shen (problem-solving ability), Tian De/Yue De are protection that comes from virtue. Jie Shen works through method; these work through character.',
    enSections: [
      { h: 'The Difference', ps: [
        'Tian De leans toward "yang virtue" — visible good deeds, standing up for what\'s right, open and honorable. People with it do good openly and will publicly stand for justice.',
        'Yue De leans toward "yin virtue" — doing good quietly, without fanfare, helping people silently. May do much good without speaking of it, accumulating hidden merit.',
        'Both together is best — honorable yet unassuming, thickest virtue. Even facing major disaster, such people always come through.'
      ]},
      { h: 'Why Virtue Dissolves Disaster', ps: [
        'Zi Wei Dou Shu holds that virtue can change the direction of fate. This has real logic: kind people have more friends, and when trouble comes, more people are willing to help.',
        'Even with Qing Yang, Tuo Luo, Hua Ji, the severity of disaster is reduced. The same event that\'s a catastrophe for others may be a false alarm for you.',
        'But virtue stars aren\'t a "get-out-of-jail-free card" — they don\'t let you act with impunity. Their protection rests on genuine virtue. If you do wrong, their power weakens.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: kind-hearted, virtuous, turns misfortune into blessing. Guard against people exploiting your kindness.',
        'Career: good reputation at work, respected, people speak up for you in crisis.',
        'Health: find good doctors when ill, illnesses have turning points, misfortune resolves.',
        'Travel: benefactors help when you face difficulty away from home, trouble resolves.',
        'Spouse: partner is kind, marriage has blessing, relationship crises can be resolved.'
      ]},
      { h: 'Combinations', ps: [
        'With Kui/Yue: strongest benefactor luck, people主动 help when trouble comes.',
        'With Jie Shen: virtue plus problem-solving, doubled disaster-dissolving power.',
        'With Hua Ji: the disaster Hua Ji brings is dissolved by virtue, big trouble becomes small.',
        'With Qing Yang/Tuo Luo: the conflict and disaster from malefics are reduced, may be just a false alarm.',
        'With Tian Xing: lawsuits from Tian Xing can be resolved, easy to win or settle.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tian De/Yue De:'], ol: [
        'Which palace — Life and Health are best.',
        'Check Kui/Yue or Jie Shen — virtue plus benefactors or resolution gives strongest protection.',
        'Check malefics or Hua Ji — virtue stars reduce their power.',
        'Keep doing good — their power comes from your actions.',
        'But also protect yourself — kindness isn\'t weakness; helping others needs boundaries.',
        'Is your kindness a choice or a habit? Have you wronged yourself through kindness?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-jieshen-xing.html', text: 'Jie Shen Star' },
      { href: 'ziwei-tiankui-tianyue.html', text: 'Tian Kui & Tian Yue' },
      { href: 'ziwei-tianxing-xing.html', text: 'Tian Xing Star' },
      { href: 'ziwei-jieegong.html', text: 'The Health Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  }
];

function buildHTML(a, isEn) {
  const catPage = 'ziwei-helper-malice-stars.html';
  const cnCatName = '辅曜煞曜';
  const enCatName = 'Helper & Malice Stars';
  const cnTag = '辅煞曜';
  const enTag = 'Helper Stars';
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
  "about": ["Zi Wei Dou Shu", "Helper and Malice Stars", "${jstr(title)}"],
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
          <p class="article-meta"><span>${enTag}</span><span><time datetime="${date}">2026-08-18 10:15</time></span></p>
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
  "articleSection": "辅煞曜",
  "about": ["紫微斗数", "辅曜煞曜", "${jstr(title)}"],
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
          <p class="article-meta"><span>${cnTag}</span><span><time datetime="${date}">2026-08-18 10:15</time></span></p>
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
