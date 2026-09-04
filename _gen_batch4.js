const fs = require('fs');
const path = require('path');

const date = '2026-08-14T10:15:00+08:00';
const pubDate = 'Fri, 14 Aug 2026 02:15:00 +0000';

function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n'); }

const articles = [
  {
    slug: 'ziwei-jieegong-huake',
    cnTitle: '紫微斗数疾厄宫化科：身体有贵人，慢性病靠管理不靠治',
    enTitle: 'Health Palace With Hua Ke: A Body With Benefactors',
    cnDesc: '疾厄宫化科，身体出问题时遇得到好医生，慢性病靠科学管理而非猛药。化科不主无病，主有病能治、有医可投。',
    enDesc: 'Hua Ke in the Health Palace means good doctors when you need them and chronic conditions managed through science, not force. It does not mean no illness — it means illness is treatable.',
    cnLead: '疾厄宫化科的人，身体不一定最好，但「医缘」好。真出了问题，遇得到对的医生、查得出病因、治得规范。化科是四化里最「文」的一颗，落在疾厄宫，它不给你金刚不坏之身，给你的是「有病能医、有医可投」的运气。',
    cnIntro2: '疾厄宫看体质、疾病和灾厄。化科落在这个宫位，核心关键词是「缓和」——即使生病，也多是慢性病、轻症、或者能被现代医学控制的病，不太容易遇到急危重症。但化科不主无病，它主的是「病得明白、治得规范」。',
    cnSections: [
      { h: '医缘好：关键时刻遇对人', ps: [
        '疾厄宫化科最直接的好处是医缘。你可能平时不怎么跑医院，但真有问题时，总能找到靠谱的医生——不是那种最贵的，而是最对的。化科主专业和口碑，你遇到的医生通常是「同行认可」型的，不是广告打得响的。',
        '天魁天钺在三方，医缘更明显——可能是熟人介绍、偶然挂上的专家号、或者转院后遇到对的人。化科加昌曲，你自己也会查资料、懂一点医学常识，跟医生沟通效率高，不会被牵着走。',
        '举个组合：疾厄宫天梁化科。天梁是寿星和医药星，化科是规范——这种人可能有慢性病，但控制得很好，定期复查、遵医嘱、生活规律，带病长寿。'
      ]},
      { h: '慢性病体质：靠管理不靠猛药', ps: [
        '化科在疾厄宫，疾病类型偏「慢」——高血压、糖尿病、甲状腺、过敏、肠胃功能紊乱这类需要长期管理的问题，而不是急病大病。化科的能量是「缓和」的，它不让问题爆发，但也不让问题消失。',
        '这种人最忌两种极端：一种是不当回事，觉得慢性病没什么，不复查不吃药；另一种是过度焦虑，天天查百度、到处求医、什么偏方都试。化科的正确用法是「科学管理」——听医生的、定期复查、调整生活方式，跟慢性病和平共处。',
        '化科加煞星（擎羊、陀罗、火铃），慢性病可能反复或控制不佳，但也不是绝症——需要更积极地管理，不能拖。'
      ]},
      { h: '灾厄也「科」：小灾不断大灾少', ps: [
        '疾厄宫也看灾厄。化科在疾厄宫，即使遇到意外，也多是「有惊无险」——擦碰、扭伤、骨裂，不太容易遇到危及生命的大灾。化科像一层缓冲，让大事化小。',
        '但「大灾少」不等于「无灾」。化科在疾厄宫的人，可能小毛病不断——这里不舒服、那里不对劲，体检报告总有几个箭头。这些小毛病是在提醒你注意身体，不要忽视。',
        '如果疾厄宫化科加空劫，要注意「查不出原因」的问题——症状有，但检查指标正常。这种情况可能是功能性问题或心身疾病，需要看对科室。'
      ]},
      { h: '流年引动：身体什么时候需要注意', ps: [
        '第一种：大限疾厄宫化科。这十年适合建立健康管理习惯——定期体检、规律运动、调整饮食。如果已经有慢性病，这十年是控制的关键期，管好了后面十年轻松。',
        '第二种：流年化科入疾厄。这一年医缘好——适合体检、看医生、做手术、开始治疗。如果有一直拖着没看的问题，这一年去看，容易遇到对的医生。',
        '第三种：流年化忌冲疾厄。这一年身体容易出问题——旧病复发、新病冒头、或者意外受伤。这种年份不要硬撑，不舒服就去看，定期体检不能省。'
      ]},
      { h: '排盘后的使用顺序', ps: ['疾厄宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——天梁化科主医药缘，天同化科主体质温和，太阳化科主眼睛心脏，太阴化科主妇科肾脏。',
        '看有无昌曲——有昌曲，自己懂医学常识，跟医生沟通好。',
        '看煞星：擎羊主刀厄，陀罗主慢性病拖延，火铃主急性炎症，空劫主查不出原因。',
        '看三方四正：疾厄宫的三方是父母宫、田宅宫、子女宫，这些宫位的星曜也影响健康。',
        '看医缘：化科在疾厄宫的人，看病要靠口碑找医生，不要信广告。',
        '流年分三种：大限科主十年健康管理，流年科主当年医缘好，流年忌冲主当年身体亮红灯。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-jieegong-hualu.html', text: '疾厄宫化禄' },
      { href: 'ziwei-jieegong-huaquan.html', text: '疾厄宫化权' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ke in the Health Palace may not have the strongest bodies, but they have good "medical karma." When something goes wrong, they find the right doctor, get the right diagnosis, and receive proper treatment. Hua Ke is the most refined of the Four Transformations; in the Health Palace it doesn\'t give you an indestructible body — it gives you the luck of having access to good medicine when you need it.',
    enIntro2: 'The Health Palace covers constitution, illness, and accidents. Hua Ke here means "moderation": even when sick, conditions tend to be chronic, mild, or manageable by modern medicine, rather than acute crises. It doesn\'t mean no illness — it means illness that is understood and properly treated.',
    enSections: [
      { h: 'Good Medical Karma', ps: [
        'The most direct benefit is access to good doctors. You may rarely visit hospitals, but when you do, you find the right one — not the most expensive, but the most appropriate. Hua Ke governs professionalism and reputation; the doctors you meet tend to be peer-respected, not heavily advertised.',
        'With Kui/Yue in the triple combination, medical karma is even stronger — a referral, a lucky appointment, a transfer that leads to the right specialist. With Chang Qu, you research yourself and communicate efficiently with doctors.',
        'Example: Tian Liang Hua Ke in Health. Tian Liang is the longevity and medicine star; Hua Ke is proper care. You may have a chronic condition, but it\'s well-managed — regular checkups, following doctor\'s orders, disciplined lifestyle, long life with the condition.'
      ]},
      { h: 'Chronic Conditions: Managed, Not Cured by Force', ps: [
        'Illnesses tend to be chronic — hypertension, diabetes, thyroid issues, allergies, GI disorders — things requiring long-term management rather than acute crises. Hua Ke\'s energy is moderate; it prevents explosions but doesn\'t make things disappear.',
        'Avoid two extremes: ignoring it because "it\'s just chronic," or over-anxiously self-diagnosing online and trying every remedy. The right approach is scientific management — follow the doctor, check regularly, adjust lifestyle, coexist with the condition.',
        'With malefics, chronic conditions may recur or be harder to control — but still not terminal. More active management is needed; don\'t delay.'
      ]},
      { h: 'Accidents Too Are "Ke": Small Scrapes, Few Major Disasters', ps: [
        'Even accidents tend to be near-misses — bumps, sprains, hairline fractures rather than life-threatening events. Hua Ke acts as a buffer, making big things small.',
        'But "few major disasters" doesn\'t mean none. You may have constant minor issues — something always aches, test results always have a few flagged items. These are reminders, not nuisances to ignore.',
        'With Kong Jie, watch for symptoms with no clear cause — functional or psychosomatic issues that need the right department.'
      ]},
      { h: 'Timing: When to Pay Attention', ps: [
        'A ten-year cycle with Hua Ke in Health is for building health habits — regular checkups, exercise, diet. If you have a chronic condition, this decade determines how well it\'s controlled.',
        'An annual Hua Ke entering Health brings good medical karma — good year for checkups, procedures, starting treatment. That problem you\'ve been ignoring? See someone this year.',
        'An annual Hua Ji opposing Health brings health issues — recurrence, new problems, injuries. Don\'t tough it out; get checked.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Health Palace:'], ol: [
        'Which star transforms? Tian Liang = medicine karma, Tian Tong = mild constitution, Tai Yang = eyes/heart, Tai Yin = gynecology/kidneys.',
        'Check Chang Qu — with them, you understand medicine and communicate well with doctors.',
        'Check malefics: Qing Yang = surgery, Tuo Luo = chronic delay, Huo Ling = acute inflammation, Kong Jie = unexplained symptoms.',
        'Read the triple combination: Parents, Property, Children palaces also affect health.',
        'Find doctors by reputation, not advertising.',
        'Timing: decade Ke = health management, annual Ke = good medical year, annual Ji opposition = health warning.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-jieegong.html', text: 'The Health Palace' },
      { href: 'ziwei-jieegong-hualu.html', text: 'Health Palace Hua Lu' },
      { href: 'ziwei-jieegong-huaquan.html', text: 'Health Palace Hua Quan' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-qianyigong-huake',
    cnTitle: '紫微斗数迁移宫化科：在外有口碑，出门遇贵人',
    enTitle: 'Travel Palace With Hua Ke: A Good Name Away From Home',
    cnDesc: '迁移宫化科，在外形象好、口碑佳，出门容易遇贵人。适合外地发展、公开场合和需要「被看见」的工作。',
    enDesc: 'Hua Ke in the Travel Palace means a good reputation away from home and benefactors encountered out in the world. Suits relocation, public-facing work, and being seen.',
    cnLead: '迁移宫化科的人，在外面比在家里「好看」。你可能在家邋里邋遢、随意得很，但一出门就得体、有分寸、给人印象好。化科在迁移宫，你的「社会形象」是加分项——陌生人愿意信你、外地人愿意帮你、到了新环境能很快建立口碑。',
    cnIntro2: '迁移宫看外出、旅行、搬家、社交形象和在外的际遇。化科落在这个宫位，核心是「在外有名」——你的名声不在家里，在外面。这种人适合离开出生地发展，也适合需要抛头露面的工作。',
    cnSections: [
      { h: '在外有口碑', ps: [
        '迁移宫化科，你给陌生人的第一印象好——得体、可信、有教养。这种好印象不是装出来的，而是化科的能量自然散发的。你在外面的口碑，通常比你自己以为的好。',
        '这种人适合做「被看见」的工作——销售、公关、教师、律师、顾问、自媒体。你的专业形象和口碑能直接转化为机会。',
        '化科加昌曲，在外靠才华和专业赢得尊重——可能是演讲、写作、教学、咨询。加天魁天钺，出门遇贵人——在外地、旅途中、陌生场合遇到帮你的人。'
      ]},
      { h: '适合外地发展', ps: [
        '迁移宫化科的人，离开出生地发展通常更好。在家乡，你的口碑可能被「某某家的孩子」这种固定印象限制；到了外地，你是一张白纸，化科的能量能让你从零建立好名声。',
        '举个组合：迁移宫太阳化科。太阳主光明和远方，化科主名声——这种人在外地、外国、或者远离家乡的大城市发展更好，可能是「墙里开花墙外香」的类型。',
        '但「适合外地」不等于「必须远走」。如果你在家乡也能接触外地客户、做线上业务、或者经常出差，化科的能量一样能发挥。关键是「不要困在一个小圈子里」。'
      ]},
      { h: '出行安全', ps: [
        '迁移宫也看出行安全。化科在迁移宫，出行总体顺利——航班延误有但不多，迷路了也能问到人，在外地不太容易遇到大麻烦。',
        '化科加天马，经常出差或旅行，但每次都平安。加禄存，出差能赚钱——可能是差旅费好、或者在外地谈成生意。',
        '化科加煞星（擎羊、陀罗），出行可能有小波折——误机、丢东西、被宰客，但都能化解。加空劫，要注意行程临时变动和财物安全。'
      ]},
      { h: '流年引动：什么时候适合出门', ps: [
        '第一种：大限迁移宫化科。这十年适合向外发展——搬家、换城市、出国、拓展外地市场。这十年你在外面的口碑能建立起来，为以后打基础。',
        '第二种：流年化科入迁移。这一年出门遇贵人——适合旅行、出差、搬家、面试、在公开场合亮相。如果有外派或外调的机会，这一年争取。',
        '第三种：流年化忌冲迁移。这一年出门不顺——交通延误、行程取消、在外地遇到麻烦。这种年份减少不必要的出行，出门前做好预案。'
      ]},
      { h: '排盘后的使用顺序', ps: ['迁移宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——太阳化科主远方扬名，太阴化科主在外有贵人暗助，天梁化科主在外遇长辈提携，文昌化科主在外以文扬名。',
        '看有无昌曲魁钺——有昌曲靠才华，有魁钺靠贵人。',
        '看天马禄存——天马主奔波，禄存主在外得利。',
        '看煞星：擎羊主在外有竞争，陀罗主出行拖延，空劫主行程变动。',
        '对照命宫：你在家和在外是两种状态吗？',
        '流年分三种：大限科主十年向外发展，流年科主当年出门遇贵人，流年忌冲主当年出行不顺。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-qianyigong.html', text: '迁移宫怎么看' },
      { href: 'ziwei-qianyigong-huaquan.html', text: '迁移宫化权' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-jiaoyougong.html', text: '交友宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ke in the Travel Palace look better outside than at home. You might be a mess around the house, but the moment you step out, you\'re composed, measured, and impressive. Your social image is an asset — strangers trust you, outsiders help you, and you quickly build a good reputation in new environments.',
    enIntro2: 'The Travel Palace covers going out, travel, relocation, social image, and experiences away from home. Hua Ke here means "famous outside" — your reputation isn\'t at home, it\'s out in the world. These people benefit from leaving their hometown and from public-facing work.',
    enSections: [
      { h: 'Good Reputation Outside', ps: [
        'You make a strong first impression — composed, trustworthy, cultivated. It\'s not an act; it\'s how Hua Ke naturally presents. Your reputation outside is usually better than you think.',
        'This suits being seen — sales, PR, teaching, law, consulting, content creation. Your professional image converts directly to opportunity.',
        'With Chang Qu, you earn respect through talent and expertise — speaking, writing, teaching. With Kui/Yue, you meet benefactors while traveling or in unfamiliar settings.'
      ]},
      { h: 'Better Away From Home', ps: [
        'Leaving your hometown usually works better. At home you\'re boxed in as "so-and-so\'s kid"; away, you\'re a blank page and Hua Ke lets you build a name from scratch.',
        'Example: Tai Yang Hua Ke in Travel. Tai Yang governs light and distance; you do better in faraway cities or abroad — a prophet without honor in your own land.',
        'But "better away" doesn\'t require moving far. Remote work with out-of-town clients, online business, or frequent travel channels the same energy. The key is: don\'t stay trapped in a small circle.'
      ]},
      { h: 'Travel Safety', ps: [
        'Travel generally goes smoothly — delays happen but are manageable, you can ask directions when lost, and you rarely run into serious trouble away from home.',
        'With Tian Ma, frequent travel but always safe. With Lu Cun, travel pays — good per diems or deals closed on the road.',
        'With malefics, minor hiccups — missed flights, lost items, being overcharged — but resolvable. With Kong Jie, watch schedule changes and belongings.'
      ]},
      { h: 'Timing: When to Go Out', ps: [
        'A ten-year cycle with Hua Ke in Travel is for outward expansion — moving, changing cities, going abroad, developing external markets. Build your outside reputation this decade.',
        'An annual Hua Ke entering Travel brings benefactors away from home — good year for travel, business trips, relocation, interviews, public appearances. Pursue that transfer.',
        'An annual Hua Ji opposing Travel means travel troubles — delays, cancellations, problems away from home. Minimize nonessential travel; have backup plans.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Travel Palace:'], ol: [
        'Which star transforms? Tai Yang = fame afar, Tai Yin = quiet help away, Tian Liang = elder mentorship outside, Wen Chang = literary reputation abroad.',
        'Check Chang Qu/Kui Yue — talent vs. benefactors.',
        'Check Tian Ma/Lu Cun — movement and profit from travel.',
        'Check malefics: Qing Yang = competition outside, Tuo Luo = travel delays, Kong Jie = schedule changes.',
        'Compare with Life Palace — are you different at home vs. outside?',
        'Timing: decade Ke = outward decade, annual Ke = benefactor year, annual Ji opposition = difficult travel year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-qianyigong.html', text: 'The Travel Palace' },
      { href: 'ziwei-qianyigong-huaquan.html', text: 'Travel Palace Hua Quan' },
      { href: 'ziwei-minggong.html', text: 'The Life Palace' },
      { href: 'ziwei-jiaoyougong.html', text: 'The Friends Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-jiaoyougong-huake',
    cnTitle: '紫微斗数交友宫化科：朋友有层次，人脉即口碑',
    enTitle: 'Friends Palace With Hua Ke: Quality Connections',
    cnDesc: '交友宫化科，朋友圈层次高、多专业人士，人脉靠口碑自然吸引。但化科主「君子之交」，数量不多但质量好。',
    enDesc: 'Hua Ke in the Friends Palace means a high-caliber social circle of professionals, attracted naturally by reputation. These are gentleman\'s friendships — fewer in number, higher in quality.',
    cnLead: '交友宫化科的人，朋友不一定多，但「质量」高。你的朋友圈里多是有专业、有口碑、有正经职业的人——医生、律师、老师、公务员、设计师。你不太跟乱七八糟的人混，也不擅长酒肉社交。化科在交友宫，你的人脉是「口碑型」的——不是你刻意经营来的，而是别人觉得你靠谱，自然愿意跟你来往。',
    cnIntro2: '交友宫看朋友、下属、合伙人和社交圈。化科落在这个宫位，社交模式是「以文会友」——因为专业、兴趣、价值观相近而走近，不是因为利益或应酬。',
    cnSections: [
      { h: '朋友有层次', ps: [
        '交友宫化科，你的朋友通常有一定的社会地位或专业能力。不是说你嫌贫爱富，而是你自然吸引「同类」——认真生活、有一技之长、说话有分寸的人。',
        '化科加昌曲，朋友中多文化人、技术人、读书人——可能是书友、同事、行业交流认识的。加天魁天钺，朋友中有贵人——在关键时刻能帮你说话、给你机会的人。',
        '举个组合：交友宫天梁化科。天梁主年长和荫庇，化科主口碑——你的朋友可能比你年长，或者像大哥大姐一样照顾你。这种忘年交通常能给你人生指导。'
      ]},
      { h: '君子之交淡如水', ps: [
        '化科在交友宫的人，社交模式偏「淡」。你不喜欢天天黏在一起的朋友，也不擅长那种「不把你当外人」的热络。你的友谊是有距离的——互相尊重、有事说话、没事各忙各的。',
        '这种模式的好处是长久。化科的朋友关系不容易因为利益翻脸，因为一开始就不是利益结合。坏处是有时候显得「不够近」——你可能在需要帮助时不好意思开口，朋友也觉得你什么都自己扛。',
        '化科加化禄，朋友关系中有实际的互助——不是酒肉朋友，而是能资源互换的靠谱关系。加化权，朋友中有强人，但也可能有人试图影响你的决定。'
      ]},
      { h: '下属和合伙人', ps: [
        '交友宫也看下属。化科在交友宫，你带的人通常素质不错——有专业能力、做事规范、不需要你天天盯着。但化科的下属也「有骨气」——你对他好他卖命，你不尊重他他就走。',
        '在合伙关系上，化科主「体面的合伙」——合同清楚、分工明确、好聚好散。你适合跟有专业身份的人合伙，不适合跟亲戚或太熟的朋友合伙（化科需要距离感）。',
        '化科加煞星，朋友或下属中可能有「名过其实」的人——简历好看但能力一般。用人时要考察实际能力，不要只看口碑和title。'
      ]},
      { h: '流年引动：人脉什么时候动', ps: [
        '第一种：大限交友宫化科。这十年社交圈升级——可能进入更高层次的圈子、认识行业内的人、或者加入专业组织。这十年建立的人脉，能用很多年。',
        '第二种：流年化科入交友。这一年有贵人从朋友中来——可能是朋友介绍机会、老同事推荐工作、或者认识一个对你有帮助的人。适合参加行业活动、同学会。',
        '第三种：流年化忌冲交友。这一年朋友关系出问题——被朋友拖累、下属离职、合伙纠纷。这种年份不要借钱给朋友、不要给人担保、不要新开合伙。'
      ]},
      { h: '排盘后的使用顺序', ps: ['交友宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——天梁化科主年长朋友，文昌化科主文友，太阳化科主男性贵人多，太阴化科主女性贵人多。',
        '看有无昌曲魁钺——有昌曲以文会友，有魁钺朋友中贵人多。',
        '看有无化禄化权——有禄朋友能互助，有权朋友中有强人。',
        '看煞星：空劫主朋友有名无实，擎羊主朋友间争执，陀罗主关系纠缠。',
        '看下属和合伙：化科在交友宫，用人看专业不看关系。',
        '流年分三种：大限科主十年人脉升级，流年科主当年朋友贵人，流年忌冲主当年朋友出事。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-jiaoyougong.html', text: '交友宫怎么看' },
      { href: 'ziwei-jiaoyougong-hualu.html', text: '交友宫化禄' },
      { href: 'ziwei-xiongdigong-huake.html', text: '兄弟宫化科' },
      { href: 'ziwei-xiongdigong.html', text: '兄弟宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ke in the Friends Palace don\'t necessarily have the most friends, but they have the best ones. Their circle is full of professionals with reputations — doctors, lawyers, teachers, civil servants, designers. They don\'t run with a rough crowd and aren\'t good at drinking-buddy socializing. Their network is reputation-based: people find them reliable and naturally want to connect, no aggressive networking required.',
    enIntro2: 'The Friends Palace covers friends, subordinates, partners, and social circles. Hua Ke here means "friends through culture" — bonds formed through shared profession, interests, or values, not利益 or obligation.',
    enSections: [
      { h: 'Quality Friends', ps: [
        'Your friends typically have social standing or professional ability. It\'s not snobbery — you naturally attract your own kind: serious people with skills and boundaries.',
        'With Chang Qu, friends are cultured, technical, academic — book clubs, colleagues, industry peers. With Kui/Yue, some friends are benefactors who speak up for you at key moments.',
        'Example: Tian Liang Hua Ke in Friends. Friends may be older, mentor figures who guide you. These cross-generational bonds often provide life direction.'
      ]},
      { h: 'Gentleman\'s Friendship', ps: [
        'Your social mode is "light." You don\'t need daily contact or performative closeness. Your friendships have distance — mutual respect, there when needed, otherwise各自 busy.',
        'The upside is durability: Hua Ke friendships rarely break over money because they weren\'t built on it. The downside is hesitation to ask for help when you need it.',
        'With Hua Lu, friendships include practical mutual aid — reliable resource exchange, not partying. With Hua Quan, some friends are strong personalities who may try to influence you.'
      ]},
      { h: 'Subordinates and Partners', ps: [
        'Subordinates tend to be competent — professional, self-directed, no micromanaging needed. But they also have self-respect: treat them well and they\'ll run through walls; disrespect them and they leave.',
        'In partnerships, Hua Ke means proper collaborations — clear contracts, defined roles, clean endings. Partner with professionals, not relatives or too-close friends (Hua Ke needs distance).',
        'With malefics, some friends or hires may be all resume and no skill. Verify actual ability, not just reputation and title.'
      ]},
      { h: 'Timing: When Networks Move', ps: [
        'A ten-year cycle with Hua Ke in Friends upgrades your circle — higher-level connections, industry people, professional organizations. These connections last for years.',
        'An annual Hua Ke entering Friends brings benefactors through friends — referrals, recommendations, a helpful new contact. Good year for events and reunions.',
        'An annual Hua Ji opposing Friends brings friend trouble — being dragged down, subordinates quitting, partnership disputes. No lending, guaranteeing, or new partnerships this year.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Friends Palace:'], ol: [
        'Which star transforms? Tian Liang = older friends, Wen Chang = literary friends, Tai Yang = male benefactors, Tai Yin = female benefactors.',
        'Check Chang Qu/Kui Yue — friends through culture vs. benefactor friends.',
        'Check Hua Lu/Hua Quan — mutual aid vs. strong personalities.',
        'Check malefics: Kong Jie = friends in name only, Qing Yang = disputes, Tuo Luo = entanglements.',
        'Hire and partner on professionalism, not relationship.',
        'Timing: decade Ke = network upgrade, annual Ke = friend benefactor, annual Ji opposition = friend trouble.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-jiaoyougong.html', text: 'The Friends Palace' },
      { href: 'ziwei-jiaoyougong-hualu.html', text: 'Friends Palace Hua Lu' },
      { href: 'ziwei-xiongdigong-huake.html', text: 'Siblings Palace Hua Ke' },
      { href: 'ziwei-xiongdigong.html', text: 'The Siblings Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-guanlugong-huake',
    cnTitle: '紫微斗数官禄宫化科：事业靠专业，名声比权力重要',
    enTitle: 'Career Palace With Hua Ke: Reputation Over Authority',
    cnDesc: '官禄宫化科，事业上靠专业口碑立足，不适合争权夺利。你的职业护城河是「别人觉得你靠谱」，不是职位高低。',
    enDesc: 'Hua Ke in the Career Palace means building a career on professional reputation rather than power plays. Your moat is being known as reliable, not your title.',
    cnLead: '官禄宫化科的人，事业上走的是「专业路线」。你可能不是官最大的、权最重的，但你是那个「大家遇到这个问题就想到你」的人。化科在官禄宫，你的职业护城河是口碑——同事信你、领导认你、客户指定你。这种名声不像权力那样可以被收回，它长在你身上。',
    cnIntro2: '官禄宫看事业、工作和社会地位。化科落在这个宫位，事业模式是「以专业得名，以名得利」——先把本事练好，名声和收入自然跟上。这跟化权在官禄「靠权力说话」不同，也跟化禄在官禄「直接来钱」不同。',
    cnSections: [
      { h: '专业路线：越老越吃香', ps: [
        '官禄宫化科，你适合走专业路线——医生、律师、会计师、工程师、教授、设计师、顾问。这些职业的共同点是：有专业门槛、靠口碑积累、越老越值钱。',
        '化科加昌曲，专业能力突出——可能是技术大牛、学科带头人、或者在某个细分领域有话语权的人。加天魁天钺，事业上有贵人提携——前辈带你、领导赏识你。',
        '举个组合：官禄宫天梁化科加天寿。天梁主监察和医药，化科主名声——这种人可能是主任医师、资深律师、或者纪检监察类岗位，靠专业和资历建立权威，不靠争权。'
      ]},
      { h: '名声比权力重要', ps: [
        '化科在官禄宫的人，不要跟化权的人比权力。你的强项不是「说了算」，而是「说得对」。在组织里，你可能是那个没有最高头衔但意见最被重视的人。',
        '这种人在职场上最忌讳「为了升职而放弃专业」。如果你为了一个管理职位离开了自己擅长的领域，化科的能量就断了。最好的路径是「专家型管理者」——既懂专业又带团队，但根始终扎在专业上。',
        '化科加化权，是「专家有职」——你既有专业名声又有管理权力，这是最好的组合。但如果只有化科没有化权，不要焦虑——你的不可替代性比title更持久。'
      ]},
      { h: '适合的工作模式', ps: [
        '化科在官禄宫的人，适合「被看见」的工作——你的工作成果需要被人知道，不能只做幕后英雄。写文章、做演讲、拿证书、建个人品牌，这些都符合化科的能量。',
        '你也适合在「规范」的行业工作——大公司、体制内、专业机构。化科喜欢规则和秩序，在混乱的草台班子里你会很痛苦。',
        '化科加煞星，事业上可能遇到「名大于实」的困境——title好听但没实权，或者被推到前台背锅。这种时候要回到专业本身，不要被虚名绑架。'
      ]},
      { h: '流年引动：事业什么时候上台阶', ps: [
        '第一种：大限官禄宫化科。这十年是「立名」的十年——可能拿到重要资格、在行业内建立口碑、或者成为某个领域的专家。这十年不要急着赚钱，先把名立住。',
        '第二种：流年化科入官禄。这一年事业上有「被认可」的机会——评奖、升职（但可能是名誉性的）、发表重要成果、或者被媒体报道。适合考证、答辩、面试。',
        '第三种：流年化忌冲官禄。这一年事业上名声受损——项目失败、被批评、或者跟领导关系紧张。这种年份不要跳槽、不要争名，低头做事等风头过去。'
      ]},
      { h: '排盘后的使用顺序', ps: ['官禄宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——天梁化科主监察医药，太阳化科主政务教育，文昌化科主文化学术，武曲化科主财务专业。',
        '看有无昌曲——有昌曲，专业能力是核心竞争力。',
        '看有无化权化禄——有权则专家有职，有禄则名声变现。',
        '看煞星：空劫主事业虚名，擎羊主职场是非，陀罗主升职慢。',
        '看对宫夫妻宫：事业名声对婚姻的影响。',
        '流年分三种：大限科主十年立名，流年科主当年被认可，流年忌冲主当年名声受损。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-guanlugong-huaquan.html', text: '官禄宫化权' },
      { href: 'ziwei-guanlugong-hangye-zhiwei-zeren-shui-zhong.html', text: '官禄宫看行业还是职位' },
      { href: 'ziwei-minggong-huake.html', text: '命宫化科' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ke in the Career Palace walk the professional path. You may not have the biggest title or the most authority, but you\'re the person everyone thinks of when a specific problem comes up. Your moat is reputation — colleagues trust you, bosses value you, clients request you by name. Unlike authority, this kind of reputation can\'t be taken away; it\'s part of you.',
    enIntro2: 'The Career Palace covers work, career, and social standing. Hua Ke here means "build expertise, earn name, then name brings income." It differs from Hua Quan (authority speaks) and Hua Lu (money comes directly).',
    enSections: [
      { h: 'The Professional Path: Better With Age', ps: [
        'You\'re suited for professional tracks — medicine, law, accounting, engineering, academia, design, consulting. These share a barrier to entry, reputation-based accumulation, and increasing value with age.',
        'With Chang Qu, professional ability stands out — technical expert, thought leader, authority in a niche. With Kui/Yue, mentors and sponsors advance your career.',
        'Example: Tian Liang Hua Ke with Tian Shou in Career. You might be a senior physician, established lawyer, or inspector — authority built on expertise and seniority, not power grabs.'
      ]},
      { h: 'Reputation Over Authority', ps: [
        'Don\'t compete with Hua Quan people on power. Your strength isn\'t "I decide" — it\'s "I\'m right." You may be the person without the top title whose opinion carries the most weight.',
        'The biggest trap is leaving your expertise for a management title. If you abandon what you\'re good at for a promotion, Hua Ke\'s energy breaks. The best path is expert-manager — leading teams while staying rooted in your craft.',
        'With Hua Quan, you have both reputation and position — the best combination. Without it, don\'t despair: your irreplaceability outlasts any title.'
      ]},
      { h: 'Work Modes That Suit You', ps: [
        'You need to be seen — your work must be known. Writing, speaking, certifications, personal brand all channel Hua Ke. Don\'t be the unsung hero.',
        'You thrive in structured environments — large companies, institutions, professional firms. Hua Ke likes rules and order; chaotic startups will frustrate you.',
        'With malefics, you may face "name over reality" — a good title with no real power, or being pushed forward as a scapegoat. Return to your expertise; don\'t be trapped by empty titles.'
      ]},
      { h: 'Timing: When Career Steps Up', ps: [
        'A ten-year cycle with Hua Ke in Career is for "making a name" — credentials, industry reputation, becoming the expert. Don\'t chase money first; establish the name.',
        'An annual Hua Ke entering Career brings recognition — awards, promotion (possibly honorary), publications, media. Good year for certifications, defenses, interviews.',
        'An annual Hua Ji opposing Career damages reputation — failed projects, criticism, tension with leadership. Don\'t job-hop or chase fame this year; keep your head down.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Career Palace:'], ol: [
        'Which star transforms? Tian Liang = oversight/medicine, Tai Yang = government/education, Wen Chang = culture/academia, Wu Qu = finance.',
        'Check Chang Qu — expertise is your core competitiveness.',
        'Check Hua Quan/Hua Lu — with Quan, expert with position; with Lu, reputation monetizes.',
        'Check malefics: Kong Jie = empty fame, Qing Yang = workplace politics, Tuo Luo = slow promotion.',
        'Read the opposite Spouse Palace — career reputation affects marriage.',
        'Timing: decade Ke = name-building decade, annual Ke = recognition year, annual Ji opposition = reputation hit.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-guanlugong-huaquan.html', text: 'Career Palace Hua Quan' },
      { href: 'ziwei-guanlugong-hangye-zhiwei-zeren-shui-zhong.html', text: 'Career: Industry, Role, or Responsibility' },
      { href: 'ziwei-minggong-huake.html', text: 'Life Palace Hua Ke' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-tianzhaigong-huake',
    cnTitle: '紫微斗数田宅宫化科：家里有书香，房产带好名',
    enTitle: 'Property Palace With Hua Ke: A Home With Culture',
    cnDesc: '田宅宫化科，居住环境有文化气息，房产可能带学区或好名声。家里整洁有品味，家庭关系体面。',
    enDesc: 'Hua Ke in the Property Palace means a cultured living environment, possibly in a good school district or reputable building. The home is tidy and tasteful; family relations are proper.',
    cnLead: '田宅宫化科的人，家里通常「有样子」——不一定豪华，但整洁、有品味、有书香气。你可能对家居环境有要求，喜欢买书、挂画、摆绿植。化科在田宅宫，房产也可能带「好名声」——学区房、知名小区、或者有历史感的老房子。',
    cnIntro2: '田宅宫看房产、家庭、居住环境和库藏。化科落在这个宫位，核心是「体面」——住得体面、家庭关系体面、存的东西也体面。',
    cnSections: [
      { h: '居住环境有品味', ps: [
        '田宅宫化科，你对居住环境有审美要求——不一定贵，但要有「感觉」。你可能喜欢简约风格、中式元素、或者被书和植物包围的感觉。家里乱了你会不舒服。',
        '化科加昌曲，家里书多——可能有书房、书架、或者到处是书。这种家庭通常重视教育，家里有学习氛围。加天魁天钺，住的地方可能有「贵人缘」——好邻居、好物业、或者小区里住着能帮你的人。',
        '举个组合：田宅宫太阴化科。太阴主藏和润，化科主清雅——这种人家里可能收拾得很雅致，有艺术感，或者住在有水、有绿化的地方。'
      ]},
      { h: '房产带好名', ps: [
        '化科在田宅宫，你买的房子可能带「科名」——学区房、文化名盘、公务员小区、或者有历史的老建筑。房子本身不一定最大最豪华，但「说出去好听」。',
        '化科加化禄，房产既有好名声又能升值——学区房通常符合这个组合。加化权，你在房产上有决策权——买哪里、怎么装，你说了算。',
        '化科加空劫，要注意「名声好听但不实用」的房子——网红楼盘、概念房、或者看起来很美但质量有问题的房子。买房时要实际考察，不要被售楼处的包装迷惑。'
      ]},
      { h: '家庭关系体面', ps: [
        '田宅宫化科，家庭关系偏「体面」——家人之间互相尊重、有分寸，但不一定特别亲密。跟父母同住的话，两代人之间有基本的礼貌和边界。',
        '这种家庭通常重视教育和规矩——孩子要有礼貌、成绩不能太差、家里不能太乱。好处是家庭稳定、外人看来和睦；坏处是可能缺少「不体面」的亲密——很少拥抱、很少说心里话、情绪不外露。',
        '化科加煞星（擎羊、火星），家庭表面体面但内部有矛盾——「家丑不可外扬」型，外人看着挺好，关起门来吵架。这种情况需要正视问题，不要用「体面」掩盖。'
      ]},
      { h: '流年引动：家什么时候动', ps: [
        '第一种：大限田宅宫化科。这十年可能改善居住环境——换房、装修、或者搬到更好的小区。也可能这十年家里出了「有名」的事——孩子考上好学校、家人获得荣誉。',
        '第二种：流年化科入田宅。这一年适合买房、装修、搬家——容易遇到好房源、好设计师、好价格。也可能这一年家里有喜事。',
        '第三种：流年化忌冲田宅。这一年房产或家庭有麻烦——房屋质量问题、邻里纠纷、家人健康、或者装修被坑。这种年份不宜大额房产交易，签合同要仔细。'
      ]},
      { h: '排盘后的使用顺序', ps: ['田宅宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——太阴化科主清雅，天梁化科主老旧但有名，天府化科主库藏体面，太阳化科主房子采光好。',
        '看有无昌曲——有昌曲，家里有书香，重视教育。',
        '看有无化禄化权——有禄房产升值，有权你说了算。',
        '看煞星：空劫主房产有名无实，擎羊火铃主家庭矛盾，陀罗主装修拖延。',
        '看家庭关系：体面和亲密要平衡。',
        '流年分三种：大限科主十年改善居住，流年科主当年房产喜事，流年忌冲主当年房产麻烦。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-tianzhaigong.html', text: '田宅宫怎么看' },
      { href: 'ziwei-tianzhaigong-hualu.html', text: '田宅宫化禄' },
      { href: 'ziwei-tianzhaigong-huaquan.html', text: '田宅宫化权' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ke in the Property Palace tend to have homes that look right — not necessarily luxurious, but tidy, tasteful, with a scholarly air. You care about your living environment, with books, art, plants. The property itself may carry a "good name" — a top school district, a reputable complex, or a historic building.',
    enIntro2: 'The Property Palace covers real estate, family, living environment, and stored wealth. Hua Ke here means "proper" — a proper home, proper family relations, proper things stored.',
    enSections: [
      { h: 'A Tasteful Living Environment', ps: [
        'You have aesthetic standards for home — not necessarily expensive, but it has to feel right. You might favor minimalism, Chinese elements, or being surrounded by books and plants. Mess bothers you.',
        'With Chang Qu, lots of books — a study, bookshelves, reading culture. Education matters in this household. With Kui/Yue, good neighbors, good management, or helpful people in the building.',
        'Example: Tai Yin Hua Ke in Property. The home is refined and artistic, possibly near water or greenery.'
      ]},
      { h: 'Property With a Good Name', ps: [
        'Your property may carry "scholarly name" — school district, cultural landmark, civil servant community, historic building. Not the biggest, but it sounds good when mentioned.',
        'With Hua Lu, reputation and appreciation — school districts often fit. With Hua Quan, you call the shots on property decisions.',
        'With Kong Jie, beware properties that sound good but aren\'t practical — Instagram-famous buildings with quality issues. Inspect thoroughly; don\'t fall for marketing.'
      ]},
      { h: 'Proper Family Relations', ps: [
        'Family relations are proper — mutual respect and boundaries, but not necessarily intimate. If living with parents, there\'s basic courtesy between generations.',
        'These families value education and manners. The upside is stability and apparent harmony; the downside is a lack of "unpresentable" intimacy — few hugs, few heart-to-hearts, emotions hidden.',
        'With malefics, surface propriety hides conflict — "don\'t air dirty laundry" families that look fine but fight behind closed doors. Address problems; don\'t let "proper" become a cover.'
      ]},
      { h: 'Timing: When Home Moves', ps: [
        'A ten-year cycle with Hua Ke in Property may bring better housing — upgrading, renovating, moving to a better complex. Or family honors — a child getting into a good school.',
        'An annual Hua Ke entering Property is good for buying, renovating, moving — good listings, good designers, good prices. Or a family celebration.',
        'An annual Hua Ji opposing Property brings property or family trouble — defects, neighbor disputes, health issues, renovation scams. No big transactions this year; read contracts carefully.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Property Palace:'], ol: [
        'Which star transforms? Tai Yin = refined, Tian Liang = old but reputable, Tian Fu = proper storage, Tai Yang = bright home.',
        'Check Chang Qu — scholarly home, education-valued.',
        'Check Hua Lu/Hua Quan — with Lu, appreciation; with Quan, you decide.',
        'Check malefics: Kong Jie = name without substance, Qing Yang/Huo Xing = family conflict, Tuo Luo = renovation delays.',
        'Balance propriety with intimacy.',
        'Timing: decade Ke = housing upgrade, annual Ke = property celebration, annual Ji opposition = property trouble.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-tianzhaigong.html', text: 'The Property Palace' },
      { href: 'ziwei-tianzhaigong-hualu.html', text: 'Property Palace Hua Lu' },
      { href: 'ziwei-tianzhaigong-huaquan.html', text: 'Property Palace Hua Quan' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-fudegong-huake',
    cnTitle: '紫微斗数福德宫化科：精神有品味，想得开是修养',
    enTitle: 'Mental Palace With Hua Ke: Cultivated Inner Life',
    cnDesc: '福德宫化科，精神世界有品味、有追求，适合文化艺术哲学。想得开不是没心没肺，而是修养和见识带来的通透。',
    enDesc: 'Hua Ke in the Mental Palace means a cultivated, tasteful inner life suited to culture, art, and philosophy. Letting go isn\'t indifference — it\'s wisdom earned through learning.',
    cnLead: '福德宫化科的人，精神世界是「雅」的。你可能喜欢读书、听音乐、看展、品茶、或者研究哲学宗教——不是为了装，而是真的需要这些精神食粮。化科在福德宫，你的「想得开」跟化禄在福德的「天生乐观」不同，它是修养出来的——读了很多书、见了很多事、想了很多道理之后的通透。',
    cnIntro2: '福德宫看精神世界、潜意识、享受能力和价值观。化科落在这个宫位，精神追求是「文」的——你享受的东西有门槛、有品味，不太容易被低级娱乐满足。',
    cnSections: [
      { h: '精神有品味', ps: [
        '福德宫化科，你的享受方式偏「雅」——看书、听古典乐、看电影、逛博物馆、喝茶、养花。你可能对流行的东西不太感冒，反而喜欢经过时间检验的东西。',
        '化科加昌曲，精神世界丰富——可能热爱文学、历史、哲学，或者有写作、绘画、音乐的爱好。这种人即使物质条件一般，精神世界也很充实。',
        '加天魁天钺，精神上有「导师缘」——可能遇到好的老师、上师、或者一本书改变了你的人生观。'
      ]},
      { h: '想得开是修养', ps: [
        '化科在福德宫的人，面对挫折时有一种「读书人式的豁达」。不是不难过，而是能从更大的框架去理解——「人生不如意事十之八九」「塞翁失马焉知非福」。这些道理不是鸡汤，而是你真的信、真的用。',
        '这种豁达跟化禄在福德的「天生大条」不同。化禄是不想，化科是想通了。化科的人可能也会焦虑、也会失眠，但最终能靠自己的修养和见识走出来。',
        '化科加化忌或煞星，精神上可能有「雅苦」——多愁善感、伤春悲秋、或者对人生意义有执念。这种人需要警惕「想太多」——精神世界太丰富有时候也是负担。'
      ]},
      { h: '价值观：名高于利', ps: [
        '福德宫化科的人，价值观里「名」比「利」重。你可能更在意「我是不是一个体面的人」「我做的事有没有意义」，而不是「我赚了多少钱」。',
        '这不是说你不爱钱，而是钱给你的满足感不如「被认可」「有意义」来得持久。你可能愿意为了一个有价值但收入不高的工作放弃高薪，或者在花钱时更愿意为「体验」和「品味」付费。',
        '化科加空劫，可能走向「清高」——不屑于谈钱、不屑于世俗，结果把自己搞得很窘迫。要记住，化科的「雅」需要物质基础，不要把贫穷当成品味。'
      ]},
      { h: '流年引动：精神状态什么时候好', ps: [
        '第一种：大限福德宫化科。这十年精神世界成长——可能读书、修行、学一门艺术、或者经历一些事之后想通了。这十年内心比较平静，适合做需要深度思考的事。',
        '第二种：流年化科入福德。这一年精神状态好——想得开、心情平稳、可能遇到好的精神导师或读到一本好书。适合学习、修行、创作。',
        '第三种：流年化忌冲福德。这一年精神上容易钻牛角尖——焦虑、失眠、想不开。这种年份不要一个人扛，找人聊、找专业人士帮，同时减少做重大决定。'
      ]},
      { h: '排盘后的使用顺序', ps: ['福德宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——天同化科主精神安逸，天梁化科主哲学思考，太阴化科主感性细腻，文昌化科主文艺才华。',
        '看有无昌曲——有昌曲，精神世界丰富，有文艺爱好。',
        '看有无化禄——有禄，雅而且有福，能享受。',
        '看煞星：空劫主空想清高，陀罗主想不开，火铃主焦虑。',
        '看对宫财帛宫：精神追求和物质现实的平衡。',
        '流年分三种：大限科主十年精神成长，流年科主当年心境好，流年忌冲主当年想不开。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-fudegong-hualu.html', text: '福德宫化禄' },
      { href: 'ziwei-fudegong-huaquan.html', text: '福德宫化权' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ke in the Mental Palace have refined inner worlds. You may love reading, music, art, tea, philosophy, or religion — not to show off, but because you genuinely need spiritual nourishment. Unlike Hua Lu in Mental (naturally optimistic), your ability to let go is cultivated: it\'s the clarity that comes after reading widely, seeing much, and thinking deeply.',
    enIntro2: 'The Mental Palace covers inner life, subconscious, capacity for enjoyment, and values. Hua Ke here makes spiritual pursuits "cultured" — you enjoy things with a threshold of taste and aren\'t easily satisfied by lowbrow entertainment.',
    enSections: [
      { h: 'Cultivated Taste', ps: [
        'Your pleasures are refined — books, classical music, film, museums, tea, gardening. You may not care for what\'s popular, preferring things that have stood the test of time.',
        'With Chang Qu, a rich inner world — literature, history, philosophy, or creative hobbies. Even with modest means, your inner life is full.',
        'With Kui/Yue, you encounter mentors — a teacher, guru, or book that changes your outlook.'
      ]},
      { h: 'Letting Go Is Cultivated', ps: [
        'Facing setbacks, you have a scholar\'s resignation. Not that you don\'t hurt, but you frame it in a larger context — "life is mostly disappointment," "every loss is a gain." These aren\'t platitudes; you genuinely believe and use them.',
        'This differs from Hua Lu\'s natural obliviousness. Hua Lu doesn\'t think; Hua Ke thinks through. You may still get anxious, but you work your way out through cultivation and perspective.',
        'With Hua Ji or malefics, there may be "elegant suffering" — sentimentality, melancholy, obsession with meaning. Beware overthinking; a rich inner world can also be a burden.'
      ]},
      { h: 'Values: Name Over Profit', ps: [
        'In your value system, reputation matters more than profit. You care more about "am I a decent person" and "does this matter" than "how much did I make."',
        'Not that you don\'t want money, but recognition and meaning satisfy you longer. You might take a lower-paying meaningful job over a high-paying empty one, or spend on experiences and taste over status goods.',
        'With Kong Jie, this can curdle into aloofness — disdaining money and the secular world while struggling financially. Refinement needs a material base; don\'t mistake poverty for taste.'
      ]},
      { h: 'Timing: When the Mind Is Well', ps: [
        'A ten-year cycle with Hua Ke in Mental brings inner growth — study, practice, art, or hard-won clarity. A calm decade for deep thinking.',
        'An annual Hua Ke entering Mental brings a good mental year — perspective, equanimity, a mentor or book. Good for learning, practice, creating.',
        'An annual Hua Ji opposing Mental brings overthinking — anxiety, insomnia, inability to let go. Don\'t carry it alone; talk to someone, get help, and avoid major decisions.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Mental Palace:'], ol: [
        'Which star transforms? Tian Tong = easygoing spirit, Tian Liang = philosophical, Tai Yin = sensitive, Wen Chang = artistic.',
        'Check Chang Qu — rich inner life, cultural hobbies.',
        'Check Hua Lu — refinement with enjoyment.',
        'Check malefics: Kong Jie = aloof escapism, Tuo Luo = can\'t let go, Huo Ling = anxiety.',
        'Read the opposite Wealth Palace — balance spiritual pursuit with material reality.',
        'Timing: decade Ke = inner growth, annual Ke = good mindset year, annual Ji opposition = dark year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-fudegong-hualu.html', text: 'Mental Palace Hua Lu' },
      { href: 'ziwei-fudegong-huaquan.html', text: 'Mental Palace Hua Quan' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-fumugong-huake',
    cnTitle: '紫微斗数父母宫化科：父母有口碑，长辈是贵人',
    enTitle: 'Parents Palace With Hua Ke: Reputable Parents, Elder Benefactors',
    cnDesc: '父母宫化科，父母有文化、有口碑，家庭出身体面。长辈和上司是你的贵人，但关系偏「相敬如宾」。',
    enDesc: 'Hua Ke in the Parents Palace means cultured, well-regarded parents and a respectable background. Elders and bosses are benefactors, but relations are proper rather than intimate.',
    cnLead: '父母宫化科的人，通常出身于「体面」的家庭——父母可能是老师、医生、公务员、或者虽然没有高学历但通情达理、在邻里间有口碑。你从小接受的教育偏「规矩」——要有礼貌、要读书、要走正路。化科在父母宫，长辈和上司是你的贵人，但你们的关系可能偏「尊」多于「亲」。',
    cnIntro2: '父母宫看父母、长辈、上司和文书。化科落在这个宫位，父母或长辈是「有口碑」的人——不一定大富大贵，但说出去好听、让人尊重。',
    cnSections: [
      { h: '父母有文化有口碑', ps: [
        '父母宫化科，父母通常有一定的文化水平或社会声望——可能是知识分子、专业人士、或者在单位里受人尊重的老员工。他们可能不是最有钱的，但「说出去好听」。',
        '化科加昌曲，父母可能是老师、编辑、文员、或者靠笔杆子吃饭的人。加天魁天钺，父母是你的贵人——在关键时刻帮你铺路、给你机会。',
        '举个组合：父母宫太阳化科。太阳主父亲和光明，化科主名声——父亲可能是干部、老师、或者在社会上有名望的人，你从小以他为荣（或被他的名声压着）。'
      ]},
      { h: '家教好但可能有距离', ps: [
        '化科在父母宫的人，家教通常很好——有礼貌、懂规矩、知道什么场合说什么话。但这种「好家教」也可能意味着情感表达的克制——父母很少夸你、很少抱你，他们的爱藏在「为你好」的规矩里。',
        '你跟父母的关系可能偏「相敬如宾」——互相尊重，但不够亲密。成年后这种关系可能变成「报喜不报忧」——你不想让他们担心，他们也不想给你添麻烦。',
        '化科加煞星（擎羊、陀罗），父母的「规矩」可能变成「压抑」——家里气氛严肃、什么都要按规矩来、做错事会被严厉批评。这种人成年后需要学会放松，不要把父母的标准内化成对自己的苛责。'
      ]},
      { h: '上司和长辈贵人', ps: [
        '父母宫也看上司。化科在父母宫，你的上司通常是「专业型」的——有能力、讲道理、按规矩来。你容易遇到好的领导，他们愿意教你、带你。',
        '天魁天钺在三方，上司可能直接成为你的贵人——提拔你、给你机会、在关键时刻帮你说话。但化科的贵人是「公道型」的——他帮你是因为你做得好，不是因为你跟他私交好。',
        '化科加化忌，上司可能「名过其实」——看起来厉害但实际帮不上忙，或者表面客气但不给资源。这种情况下不要指望上司，靠自己更靠谱。'
      ]},
      { h: '流年引动：长辈和上司什么时候帮你', ps: [
        '第一种：大限父母宫化科。这十年长辈运好——可能遇到好的领导、导师、或者父母身体好、能帮你带孩子。这十年适合「靠前辈」——多请教、多汇报、多感恩。',
        '第二种：流年化科入父母。这一年父母或上司有好事——父母身体好转、领导升职或调走（可能给你腾出位置）、或者你得到长辈的赏识和帮助。',
        '第三种：流年化忌冲父母。这一年父母身体要注意，或者跟上司关系紧张——被批评、被边缘化、或者领导换人。这种年份多关心父母，在职场上少说话多做事。'
      ]},
      { h: '排盘后的使用顺序', ps: ['父母宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——太阳化科主父亲有名，太阴化科主母亲有文化，天梁化科主长辈是导师，文昌化科主父母靠文为生。',
        '看有无昌曲——有昌曲，父母有文化，家教好。',
        '看有无魁钺——有魁钺，父母或上司是贵人。',
        '看煞星：擎羊主父母严厉，陀罗主父母关系纠缠，空劫主父母助力有限。',
        '看文书运：化科在父母宫，考试、签证、合同等文书事通常顺利。',
        '流年分三种：大限科主十年长辈运好，流年科主当年长辈助力，流年忌冲主当年父母或上司有事。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-fumugong.html', text: '父母宫怎么看' },
      { href: 'ziwei-fumugong-hualu-jumen-geiqian-zhengzhi.html', text: '父母宫化禄见巨门' },
      { href: 'ziwei-fumugong-huaquan.html', text: '父母宫化权' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ke in the Parents Palace typically come from "proper" families — parents may be teachers, doctors, civil servants, or simply reasonable people with good reputations in the community. Your upbringing emphasized rules: be polite, study hard, stay on the right path. Elders and bosses are benefactors, but the relationship leans toward respect rather than closeness.',
    enIntro2: 'The Parents Palace covers parents, elders, bosses, and documents. Hua Ke here means the authority figures in your life are reputable — not necessarily wealthy, but respected when mentioned.',
    enSections: [
      { h: 'Cultured, Well-Regarded Parents', ps: [
        'Parents typically have education or social standing — intellectuals, professionals, or respected long-timers at their work units. Not the richest, but they sound good when mentioned.',
        'With Chang Qu, parents may be teachers, editors, clerks, or writers. With Kui/Yue, parents are benefactors who pave your way at key moments.',
        'Example: Tai Yang Hua Ke in Parents. The father may be an official, teacher, or someone with public reputation — you grew up proud of him (or pressured by his name).'
      ]},
      { h: 'Good Upbringing, Possible Distance', ps: [
        'Your upbringing is proper — polite, rule-abiding, knowing what to say when. But this can also mean emotional restraint: parents rarely praise or hug; their love hides in rules "for your own good."',
        'Your relationship with parents may be "respectful as guests" — mutual respect but not intimacy. As adults this becomes "report good news, not bad."',
        'With malefics, "rules" can become repression — a stern household where mistakes are harshly criticized. As an adult, learn to relax; don\'t internalize their standards as self-punishment.'
      ]},
      { h: 'Bosses and Elder Benefactors', ps: [
        'Bosses tend to be professional — capable, fair, rule-abiding. You encounter good leaders who teach and guide you.',
        'With Kui/Yue, bosses may directly sponsor you — promoting, giving opportunities, speaking up for you. But Hua Ke\'s benefactor is fair-minded: they help because you deliver, not because you\'re close.',
        'With Hua Ji, a boss may look impressive but can\'t actually help, or is polite without giving resources. Don\'t count on them; rely on yourself.'
      ]},
      { h: 'Timing: When Elders Help', ps: [
        'A ten-year cycle with Hua Ke in Parents brings good elder luck — a good boss, mentor, or healthy parents who help with kids. This decade favors leaning on seniors: ask, report, show gratitude.',
        'An annual Hua Ke entering Parents brings good news for parents or bosses — health improvement, a boss promoted (possibly freeing a spot for you), or recognition from an elder.',
        'An annual Hua Ji opposing Parents means watch parents\' health or tension with a boss — criticism, marginalization, leadership change. Care for your parents; speak less and do more at work.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Parents Palace:'], ol: [
        'Which star transforms? Tai Yang = reputable father, Tai Yin = cultured mother, Tian Liang = mentor elder, Wen Chang = literary parents.',
        'Check Chang Qu — educated parents, good upbringing.',
        'Check Kui/Yue — parents or bosses are benefactors.',
        'Check malefics: Qing Yang = strict parents, Tuo Luo = entangled relationship, Kong Jie = limited help.',
        'Document luck: exams, visas, contracts tend to go smoothly.',
        'Timing: decade Ke = good elder decade, annual Ke = elder help, annual Ji opposition = parent/boss issue.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-fumugong.html', text: 'The Parents Palace' },
      { href: 'ziwei-fumugong-hualu-jumen-geiqian-zhengzhi.html', text: 'Parents Palace Hua Lu + Ju Men' },
      { href: 'ziwei-fumugong-huaquan.html', text: 'Parents Palace Hua Quan' },
      { href: 'ziwei-minggong.html', text: 'The Life Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-minggong-huaji',
    cnTitle: '紫微斗数命宫化忌：执念深还是动力强，化忌在命怎么转',
    enTitle: 'Life Palace With Hua Ji: Obsession or Drive?',
    cnDesc: '命宫化忌，人生有执念、有纠结，但也有一股不服输的劲。化忌不是凶，是「收」——把能量收聚到一个点上，用好了是深度，用不好是钻牛角尖。',
    enDesc: 'Hua Ji in the Life Palace brings fixation and inner tension, but also relentless drive. It is not inauspicious — it concentrates energy. Channeled well it is depth; channeled poorly it is obsession.',
    cnLead: '命宫化忌的人，给人的感觉通常是「紧」的——认真、执着、不容易放松。你心里总有一件放不下的事、一个过不去的坎、或者一个一定要证明自己的理由。化忌在命宫，人生不是轻松的剧本，但你有一股别人没有的劲——因为你「放不下」，所以你比谁都坚持。',
    cnIntro2: '化忌是四化里最被误解的一颗。它不是「凶」，而是「收」——把能量收聚、内旋、集中到一个点上。命宫化忌的人，所有的能量都往内收，所以你深刻、专注、能忍，但也容易纠结、内耗、放不下。关键在于这股劲往哪使。',
    cnSections: [
      { h: '化忌在命的两种活法', ps: [
        '第一种是「执念型」——盯着一个点不放，可能是一个人、一件事、一个遗憾、一口气。这种人容易记仇、容易后悔、容易「如果当初」。化忌的能量在内旋，越想越窄，最后把自己困在里面。',
        '第二种是「专注型」——把那股放不下的劲用到事业、专业、或者一个目标上。化忌的「收」变成了深度——你在一个领域钻得比谁都深，因为你停不下来。很多有大成就的人，命宫都有化忌或类似的能量。',
        '区别在哪？在于你「放不下」的对象是自己能控制的，还是不能控制的。盯着不能改变的过去，是执念；盯着可以改变的未来，是动力。'
      ]},
      { h: '化忌在命的性格特征', ps: [
        '命宫化忌的人，通常重感情、念旧、心思重。别人一笑而过的事，你可能想三天。你对自己要求高，对别人也不容易满意。',
        '你可能不太会「放过自己」——做成了觉得应该的，做砸了反复想。这种性格让你靠谱，但也让你累。',
        '化忌加昌曲，想得多、写得深、适合研究——你可能是那个把一个问题想透了才开口的人。加火铃，性子急、脾气大、容易焦虑。加空劫，容易想「人生有什么意义」想到出不来。'
      ]},
      { h: '化忌怎么转', ps: [
        '第一，找到「放不下」的出口。化忌的能量需要一个载体——工作、爱好、运动、写作、信仰。把那股劲放到一个有产出的地方，它就从「内耗」变成「专注」。',
        '第二，练习「放过自己」。命宫化忌的人，最大的敌人是自己。学会接受「我已经尽力了」「这件事不是我的错」「过去的就过去了」。这些话说起来容易，但对你来说需要刻意练习。',
        '第三，不要跟轻松的人比。命宫化禄的人天生松弛，你学不来。你的优势是深度和坚持，不是轻松。接受自己的「紧」，把它用对地方。'
      ]},
      { h: '流年引动：什么时候最紧', ps: [
        '第一种：大限命宫化忌。这十年是「熬」的十年——压力大、责任重、想放放不下。但这十年也可能是你最有成就的十年，因为化忌逼你专注。关键是不要在这十年做冲动决定。',
        '第二种：流年化忌入命。这一年特别累——事多、心烦、容易钻牛角尖。身体也可能出问题（失眠、肠胃）。这种年份要对自己好一点，降低期待，不要硬撑。',
        '第三种：流年化禄入命。化忌在命的人遇到流年化禄，是难得的轻松年——有人帮、有事顺、心情好。这种年份要抓紧机会休息和享受，不要觉得「我不配」。'
      ]},
      { h: '排盘后的使用顺序', ps: ['命宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——巨门化忌主是非口舌，太阴化忌主感情纠结，武曲化忌主财务压力，天同化忌主精神困扰。',
        '看有无化禄化权化科来救——有禄则忌中有得，有权则忌能化为动力，有科则忌能靠名声化解。',
        '看煞星：火铃主急躁焦虑，陀罗主原地打转，空劫主想空了。',
        '看对宫迁移宫：你在外面的状态可能跟在家里完全不同。',
        '看「放不下」的是什么——找到它，给它一个出口。',
        '流年分三种：大限忌主十年压力，流年忌入命主当年累，流年禄入命主当年轻松。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-minggong-hualu.html', text: '命宫化禄' },
      { href: 'ziwei-minggong-huaquan-zhujian-haishi-guquan.html', text: '命宫化权' },
      { href: 'ziwei-minggong-huake.html', text: '命宫化科' },
      { href: 'ziwei-huaji.html', text: '化忌总论' }
    ],
    enLead: 'People with Hua Ji in the Life Palace tend to seem "tight" — serious, persistent, unable to relax. There\'s always something you can\'t let go of: a person, an event, a regret, or something you must prove. Life isn\'t an easy script with this placement, but you have a drive others lack — because you can\'t put it down, you outlast everyone.',
    enIntro2: 'Hua Ji is the most misunderstood transformation. It isn\'t "bad luck" — it\'s "gathering inward," concentrating energy to a point. With Hua Ji in Life, all energy turns inward, making you deep, focused, and enduring, but also prone to rumination and internal friction. The question is where that force goes.',
    enSections: [
      { h: 'Two Ways to Live With It', ps: [
        'The first is fixation — locked onto a person, event, regret, or grudge. You hold grudges, replay "what ifs," and spiral inward until you\'re trapped.',
        'The second is focus — channeling that inability to let go into work, expertise, or a goal. Hua Ji\'s gathering becomes depth: you go deeper than anyone because you can\'t stop. Many high achievers have Hua Ji in Life.',
        'The difference: is what you can\'t let go of within your control? Ruminating on an unchangeable past is fixation; working toward a changeable future is drive.'
      ]},
      { h: 'Personality Traits', ps: [
        'You\'re loyal, nostalgic, and think deeply. What others laugh off, you chew on for days. You hold yourself to high standards and aren\'t easily satisfied.',
        'You don\'t cut yourself slack — success feels expected, failure loops in your head. It makes you reliable but exhausted.',
        'With Chang Qu, deep thinking and writing — suited for research. With Huo Ling, impatience and anxiety. With Kong Jie, existential spirals.'
      ]},
      { h: 'How to Transform It', ps: [
        'Find an outlet for what you can\'t release. Hua Ji needs a vessel — work, a hobby, exercise, writing, faith. Put that force into something productive and it shifts from friction to focus.',
        'Practice letting yourself off the hook. Your biggest enemy is you. Learn "I did my best," "it wasn\'t my fault," "the past is past." It takes deliberate practice.',
        'Don\'t compare yourself to naturally relaxed people. Your advantage is depth and persistence, not ease. Accept your "tightness" and point it somewhere useful.'
      ]},
      { h: 'Timing: When It\'s Tightest', ps: [
        'A ten-year cycle with Hua Ji in Life is a grinding decade — pressure, responsibility, inability to let go. But it may also be your most accomplished decade, because Hua Ji forces focus. Don\'t make impulsive decisions.',
        'An annual Hua Ji entering Life is an exhausting year — too much on your mind, brooding, physical symptoms (insomnia, GI issues). Be kind to yourself; lower expectations; don\'t tough it out alone.',
        'An annual Hua Lu entering Life is a rare easy year — help, things going well, good mood. Seize it to rest and enjoy; don\'t feel you don\'t deserve it.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Life Palace:'], ol: [
        'Which star transforms? Ju Men = disputes, Tai Yin = emotional tangles, Wu Qu = financial pressure, Tian Tong = mental distress.',
        'Check for Lu/Quan/Ke to rescue — with Lu, gain within loss; with Quan, drive; with Ke, reputation dissolves it.',
        'Check malefics: Huo Ling = anxiety, Tuo Luo = circling, Kong Jie = existential void.',
        'Read the opposite Travel Palace — you may be different outside vs. inside.',
        'Identify what you can\'t let go of — and give it an outlet.',
        'Timing: decade Ji = pressure decade, annual Ji = exhausting year, annual Lu = relief year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-minggong.html', text: 'The Life Palace' },
      { href: 'ziwei-minggong-hualu.html', text: 'Life Palace Hua Lu' },
      { href: 'ziwei-minggong-huaquan-zhujian-haishi-guquan.html', text: 'Life Palace Hua Quan' },
      { href: 'ziwei-minggong-huake.html', text: 'Life Palace Hua Ke' },
      { href: 'ziwei-huaji.html', text: 'Hua Ji Overview' }
    ]
  },
  {
    slug: 'ziwei-jieegong-huaji',
    cnTitle: '紫微斗数疾厄宫化忌：身体哪里最弱，化忌在疾厄怎么养',
    enTitle: 'Health Palace With Hua Ji: Where the Body Is Weakest',
    cnDesc: '疾厄宫化忌，身体有一个薄弱环节，容易在同一个地方反复出问题。化忌不是绝症，是「提醒」——你需要比别人更注意那个部位。',
    enDesc: 'Hua Ji in the Health Palace marks a weak spot that recurs. It is not a death sentence — it is a reminder to care for that area more than others do.',
    cnLead: '疾厄宫化忌的人，身体通常有一个「老毛病」——可能是肠胃、可能是呼吸道、可能是腰腿、可能是过敏。这个毛病不一定严重，但它跟着你很多年，累了就犯、换季就犯、压力大了就犯。化忌在疾厄宫不是绝症，它是在告诉你：这个部位是你的「短板」，你要一辈子善待它。',
    cnIntro2: '疾厄宫看体质、疾病和灾厄。化忌落在这个宫位，核心是「薄弱」——不是全身都弱，而是有一个最弱的点。找到那个点，有针对性地保养，化忌的影响可以降到最低。',
    cnSections: [
      { h: '化忌在疾厄看什么星', ps: [
        '什么星化忌，决定了薄弱环节在哪。武曲化忌，注意呼吸系统和牙齿；天同化忌，注意肠胃和代谢；太阴化忌，注意妇科、肾脏和眼睛；巨门化忌，注意口腔、食道和肠胃；太阳化忌，注意眼睛、心脏和血压。',
        '这不是说你一定会得这些病，而是这些部位「先天偏弱」——别人造没事，你造就出事。比如同样熬夜，别人没事你可能心慌；同样吃辣，别人没事你可能胃疼。',
        '举个组合：疾厄宫天同天梁化忌。天同主肠胃和享受，天梁主脾胃和慢性病——这种人可能从小肠胃弱，吃凉的就拉、吃辣的就痛，需要一辈子注意饮食。'
      ]},
      { h: '慢性病和反复', ps: [
        '化忌在疾厄宫的疾病特点是「反复」——好了又犯、犯了又好，断不了根。这跟化权在疾厄的「硬扛」不同，也跟化科在疾厄的「规范治疗」不同，化忌是「黏」——它不走。',
        '对待这种反复的慢性病，最忌讳两种态度：一种是「习惯了不管它」，结果小问题拖成大问题；另一种是「到处求医想断根」，结果过度治疗反而伤身体。',
        '正确的态度是「与病共存」——接受这个老毛病会跟着你，学会管理它而不是消灭它。定期复查、规律作息、忌口、适度运动，把发病频率和程度降到最低。'
      ]},
      { h: '心理影响身体', ps: [
        '疾厄宫化忌的人，身体跟情绪的关联特别强——压力大了就犯病、生气了就胃疼、焦虑了就失眠。中医说「情志致病」，在你身上特别明显。',
        '所以保养身体不能只靠吃药和锻炼，还要修心。学会管理压力、表达情绪、不硬撑，对你的身体健康有直接帮助。',
        '化忌加火铃，急性发作的风险高——炎症、疼痛、突发症状。加陀罗，慢性病拖延难愈。加空劫，注意「查不出原因」的功能性问题。'
      ]},
      { h: '流年引动：身体什么时候亮红灯', ps: [
        '第一种：大限疾厄宫化忌。这十年身体是重点——旧病容易加重，也可能发现新问题。这十年要建立规律的体检习惯，不要透支身体。',
        '第二种：流年化忌入疾厄。这一年身体容易出问题——老毛病犯了、新毛病来了、或者意外受伤。这种年份不要硬撑，不舒服就去看，体检不能省。',
        '第三种：流年化科或化禄入疾厄。这一年身体好转——遇到好医生、治疗有效、或者老毛病减轻。适合做手术、开始新的治疗方案、调整生活方式。'
      ]},
      { h: '排盘后的使用顺序', ps: ['疾厄宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——星曜决定薄弱部位（武曲肺/牙，天同肠胃，太阴妇科/肾，巨门口腔/食道，太阳眼/心）。',
        '看有无化科化禄来救——有科遇得到好医生，有禄治疗有资源。',
        '看煞星：火铃主急性发作，陀罗主慢性拖延，空劫主查不出原因。',
        '看三方四正：父母宫（遗传）、田宅宫（家庭环境）、子女宫（生活习惯）。',
        '看情绪关联：你的病有多少是「心病」？',
        '流年分三种：大限忌主十年身体重点，流年忌入疾厄主当年犯病，流年科禄入疾厄主当年好转。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-jieegong-hualu.html', text: '疾厄宫化禄' },
      { href: 'ziwei-jieegong-huaquan.html', text: '疾厄宫化权' },
      { href: 'ziwei-jieegong-huake.html', text: '疾厄宫化科' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' }
    ],
    enLead: 'People with Hua Ji in the Health Palace usually have an "old problem" — GI issues, respiratory, back pain, allergies. It may not be serious, but it follows you for years, flaring when you\'re tired, when seasons change, when stress spikes. Hua Ji here isn\'t a death sentence; it tells you which part is your weak board, and you need to treat it well for life.',
    enIntro2: 'The Health Palace covers constitution, illness, and accidents. Hua Ji here means "vulnerability" — not the whole body weak, but one weakest point. Find it, care for it specifically, and the impact is minimized.',
    enSections: [
      { h: 'Which Star Determines the Weak Spot', ps: [
        'Wu Qu Hua Ji: respiratory and teeth. Tian Tong Hua Ji: digestion and metabolism. Tai Yin Hua Ji: gynecology, kidneys, eyes. Ju Men Hua Ji: mouth, esophagus, GI. Tai Yang Hua Ji: eyes, heart, blood pressure.',
        'This doesn\'t guarantee disease — these areas are congenitally weaker. What others do without consequence, you pay for. Same late night: they\'re fine, your heart races. Same spicy meal: they\'re fine, your stomach burns.',
        'Example: Tian Tong Tian Liang Hua Ji in Health. Weak digestion since childhood — cold food causes diarrhea, spicy causes pain. Diet matters for life.'
      ]},
      { h: 'Chronic and Recurring', ps: [
        'Hua Ji illnesses are recurring — better, then back, never fully gone. Unlike Hua Quan (toughing it out) or Hua Ke (proper treatment), Hua Ji sticks.',
        'Two wrong attitudes: "I\'m used to it, ignore it" (small problems become big ones), or "doctor-shop for a cure" (overtreatment harms).',
        'The right approach: coexist. Accept it follows you; manage it rather than fight it. Regular checkups, routine, dietary restrictions, moderate exercise — minimize frequency and severity.'
      ]},
      { h: 'Mind Affects Body', ps: [
        'Your body is strongly tied to emotion — stress triggers flares, anger causes stomach pain, anxiety causes insomnia. The Chinese medicine concept of "emotion causing illness" is especially true for you.',
        'So health maintenance isn\'t just pills and exercise — it\'s also mind training. Managing stress, expressing emotion, not pushing through directly affects your physical health.',
        'With Huo Ling, acute flare-ups. With Tuo Luo, chronic persistence. With Kong Jie, functional issues with no clear diagnosis.'
      ]},
      { h: 'Timing: When the Body Warns', ps: [
        'A ten-year cycle with Hua Ji in Health makes the body a focus — old conditions worsen, new ones found. Build regular checkup habits; don\'t overdraw.',
        'An annual Hua Ji entering Health brings problems — flares, new issues, injuries. Don\'t tough it out; get checked.',
        'An annual Hua Ke or Hua Lu entering Health brings improvement — good doctor, effective treatment, relief. Good year for procedures, new treatments, lifestyle changes.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Health Palace:'], ol: [
        'Which star transforms? It determines the weak spot (Wu Qu = lungs/teeth, Tian Tong = GI, Tai Yin = gynecology/kidneys, Ju Men = mouth/esophagus, Tai Yang = eyes/heart).',
        'Check Hua Ke/Hua Lu — with Ke, good doctors; with Lu, resources for treatment.',
        'Check malefics: Huo Ling = acute, Tuo Luo = chronic, Kong Jie = undiagnosable.',
        'Read triple combination: Parents (heredity), Property (home environment), Children (lifestyle).',
        'How much of your illness is "mind illness"?',
        'Timing: decade Ji = health focus decade, annual Ji = flare year, annual Ke/Lu = improvement year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-jieegong.html', text: 'The Health Palace' },
      { href: 'ziwei-jieegong-hualu.html', text: 'Health Palace Hua Lu' },
      { href: 'ziwei-jieegong-huaquan.html', text: 'Health Palace Hua Quan' },
      { href: 'ziwei-jieegong-huake.html', text: 'Health Palace Hua Ke' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' }
    ]
  },
  {
    slug: 'ziwei-qianyigong-huaji',
    cnTitle: '紫微斗数迁移宫化忌：在外不顺还是奔波有得，化忌在迁移怎么看',
    enTitle: 'Travel Palace With Hua Ji: Hardship Away From Home — or Payoff?',
    cnDesc: '迁移宫化忌，在外容易遇阻、奔波、水土不服。但化忌在迁移也主「动中得财」——越动越有，关键是怎么动。',
    enDesc: 'Hua Ji in the Travel Palace brings obstacles and travel fatigue, but also gains through movement. The key is how you move.',
    cnLead: '迁移宫化忌的人，在外面容易「不顺」——出门忘带东西、坐车堵车、到了新地方迷路、跟外地人沟通有障碍。你可能不太喜欢出差或旅行，因为每次出门都有点「折腾」。但化忌在迁移宫有一个另一面：你是「动中得财」的命——越待在家里越闷，出去跑反而有机会。',
    cnIntro2: '迁移宫看外出、旅行、搬家、社交形象和在外际遇。化忌落在这个宫位，核心是「阻」——在外有阻碍、有波折、有不适应。但「阻」不等于「凶」，它可能只是让你多走弯路，而弯路本身也是经历。',
    cnSections: [
      { h: '在外容易遇阻', ps: [
        '迁移宫化忌，出门容易遇到各种小麻烦——交通延误、证件忘带、语言不通、水土不服、被宰客。你可能觉得自己「出门就有事」，所以不太喜欢旅行。',
        '这种「阻」也体现在社交上——在陌生场合你可能放不开、不知道说什么、给人的第一印象偏严肃或紧张。你在外面的状态不如在家里放松。',
        '化忌加天马，奔波劳碌——经常出差、搬家、换城市，但每次动都不太顺。加陀罗，出行拖延——误机、堵车、等不到车。加空劫，行程临时取消或变动。'
      ]},
      { h: '动中得财：越动越有', ps: [
        '化忌在迁移宫虽然在外不顺，但也主「动中得财」——你的机会和财运往往在外面，不在家里。待在一个地方不动，反而闷出病来；出去跑、见人、出差，虽然累但有收获。',
        '举个组合：迁移宫武曲化忌加天马。武曲是财星，化忌是「收」，天马是奔波——这种人可能经常出差谈生意，每次都很累、每次都有波折，但最终能把钱赚回来。',
        '化忌加化禄或禄存，「奔波中有得」——虽然过程折腾，但结果是好的。加化权，在外有竞争力——你是那种在逆境中能杀出一条路的人。'
      ]},
      { h: '适合外地还是留在家乡', ps: [
        '迁移宫化忌的人，适不适合离开家乡？答案是：适合，但要做好「吃苦」的准备。你在外地不会一帆风顺，但你的收获也在外地。',
        '在家乡，你有安全感、有人脉、有舒适区，但化忌在迁移意味着你的「突破口」不在舒适区里。到了外地，你被迫独立、被迫成长、被迫解决问题，这些「不顺」最终变成你的能力。',
        '如果你选择留在家乡，也要「动起来」——做线上业务、经常出差、接触外地客户，不要把自己困在一个小圈子里。'
      ]},
      { h: '流年引动：什么时候适合动', ps: [
        '第一种：大限迁移宫化忌。这十年奔波多——可能换城市、换工作、经常出差。这十年在外不容易，但成长也最大。关键是不要在奔波中迷失方向，知道自己为什么动。',
        '第二种：流年化忌入迁移。这一年出门不顺——交通延误、行程取消、在外地遇到麻烦。这种年份减少不必要的出行，出门前做好预案，重要文件备份。',
        '第三种：流年化禄或化科入迁移。这一年在外顺利——出差有收获、旅行愉快、在外地遇到贵人。适合搬家、跳槽、拓展外地市场。'
      ]},
      { h: '排盘后的使用顺序', ps: ['迁移宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——巨门化忌主在外是非，太阴化忌主在外有暗损，武曲化忌主在外破财，天同化忌主在外精神不安。',
        '看有无化禄化权化科——有禄则奔波有得，有权则在外能争，有科则在外遇贵人。',
        '看天马禄存——天马主奔波，禄存主动中得财。',
        '看煞星：陀罗主拖延，火铃主急躁出事，空劫主行程变动。',
        '对照命宫：你在家和在外是两种状态吗？',
        '流年分三种：大限忌主十年奔波，流年忌入迁移主当年不顺，流年禄科入迁移主当年在外得利。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-qianyigong.html', text: '迁移宫怎么看' },
      { href: 'ziwei-qianyigong-huaquan.html', text: '迁移宫化权' },
      { href: 'ziwei-qianyigong-huake.html', text: '迁移宫化科' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-huaji.html', text: '化忌总论' }
    ],
    enLead: 'People with Hua Ji in the Travel Palace tend to encounter friction outside — forgotten items, traffic, getting lost in new places, communication barriers. You may dislike travel because every trip involves hassle. But there\'s another side: yours is a "gain through movement" chart. Staying home makes you stagnate; going out, despite the hassle, brings opportunity.',
    enIntro2: 'The Travel Palace covers going out, travel, relocation, social image, and experiences away from home. Hua Ji here means "obstruction" — hurdles, complications, discomfort outside. But obstruction isn\'t inauspicious; it may just mean detours, and detours are themselves experience.',
    enSections: [
      { h: 'Friction Outside', ps: [
        'You encounter small troubles when out — delays, forgotten documents, language barriers, culture shock, being overcharged. You may feel like "something always happens when I leave."',
        'Socially too — in unfamiliar settings you may feel awkward, quiet, or tense. You\'re less relaxed outside than at home.',
        'With Tian Ma, constant travel — frequent trips, moves, city changes, each with complications. With Tuo Luo, delays — missed flights, traffic. With Kong Jie, cancellations and schedule changes.'
      ]},
      { h: 'Gain Through Movement', ps: [
        'Despite the friction, Hua Ji in Travel means opportunity and income are outside, not at home. Staying put stagnates you; going out, though tiring, produces results.',
        'Example: Wu Qu Hua Ji with Tian Ma in Travel. Wu Qu is the finance star, Hua Ji gathers, Tian Ma moves — frequent business trips that are exhausting and complicated, but ultimately profitable.',
        'With Hua Lu or Lu Cun, the hassle pays off. With Hua Quan, you compete well outside — you\'re the person who fights through adversity.'
      ]},
      { h: 'Leave Home or Stay?', ps: [
        'Should you leave? Yes — but be prepared to struggle. It won\'t be smooth away from home, but that\'s where your growth is.',
        'At home you have safety and network, but your breakthrough isn\'t in the comfort zone. Away, you\'re forced to be independent, solve problems, and grow — the friction becomes competence.',
        'If you stay home, still move — online business, frequent travel, external clients. Don\'t trap yourself in a small circle.'
      ]},
      { h: 'Timing: When to Move', ps: [
        'A ten-year cycle with Hua Ji in Travel brings lots of movement — relocations, job changes, travel. It\'s not easy, but growth is greatest. Know why you\'re moving; don\'t lose direction in the chaos.',
        'An annual Hua Ji entering Travel means travel troubles — delays, cancellations, problems away. Minimize nonessential trips; prepare backups; copy documents.',
        'An annual Hua Lu or Hua Ke entering Travel means smooth travel — productive trips, enjoyable journeys, benefactors away. Good year to move, change jobs, expand externally.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Travel Palace:'], ol: [
        'Which star transforms? Ju Men = disputes outside, Tai Yin = hidden losses, Wu Qu = financial loss away, Tian Tong = unease outside.',
        'Check Hua Lu/Quan/Ke — with Lu, movement pays; with Quan, you compete; with Ke, benefactors outside.',
        'Check Tian Ma/Lu Cun — movement and profit from movement.',
        'Check malefics: Tuo Luo = delays, Huo Ling = rash trouble, Kong Jie = changes.',
        'Compare with Life Palace — different inside vs. outside?',
        'Timing: decade Ji = moving decade, annual Ji = difficult travel year, annual Lu/Ke = gainful travel year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-qianyigong.html', text: 'The Travel Palace' },
      { href: 'ziwei-qianyigong-huaquan.html', text: 'Travel Palace Hua Quan' },
      { href: 'ziwei-qianyigong-huake.html', text: 'Travel Palace Hua Ke' },
      { href: 'ziwei-minggong.html', text: 'The Life Palace' },
      { href: 'ziwei-huaji.html', text: 'Hua Ji Overview' }
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
  "articleSection": "四化细读",
  "about": ["紫微斗数", "四化细读", "${jstr(a.cnTitle)}"],
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
    {"@type": "ListItem", "position": 3, "name": "四化科权禄忌", "item": "https://yuetianai.com/articles/ziwei-four-transformations.html"},
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
          <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="ziwei-four-transformations.html">四化科权禄忌</a></nav>
          <h1>${a.cnTitle}</h1>
          <p class="detail-subtitle">${a.cnDesc}</p>
          <p class="article-meta"><span>四化细读</span><span><time datetime="${date}">2026-08-14 10:15</time></span></p>
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
  "about": ["Zi Wei Dou Shu", "Four Transformations", "${jstr(a.enTitle)}"],
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
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>Four Transformations</span></nav>
          <h1>${a.enTitle}</h1>
          <p class="detail-subtitle">${a.enDesc}</p>
          <p class="article-meta"><span>Four Transformations</span><span><time datetime="${date}">2026-08-14 10:15</time></span></p>
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
      <span>After reading, compare it with your own chart — it makes more sense than concepts alone.</span>
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
