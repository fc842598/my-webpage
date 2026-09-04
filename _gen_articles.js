const fs = require('fs');

const date = '2026-08-11T15:30:00+08:00';
const dateDisplay = '2026-08-11 15:30';

const articles = [
  {
    slug: 'ziwei-tianzhaigong-hualu',
    cnTitle: '紫微斗数田宅宫化禄：有房和有家是两回事',
    cnDesc: '田宅宫化禄不只是房产多。田宅宫看家庭环境、不动产和内心安全感，化禄在这里代表家运顺畅，但"有房"和"有家"要分开读。',
    enTitle: 'Property Palace With Hua Lu: Owning a House and Having a Home Are Not the Same',
    enDesc: 'Hua Lu in the Property Palace can mean real estate gains, but this palace also rules your family environment and sense of inner security. Read the property line and the home line separately.',
    category: '四化细读',
    cnH1: '紫微斗数田宅宫化禄：有房和有家是两回事',
    enH1: 'Property Palace With Hua Lu: Owning a House and Having a Home Are Not the Same',
    cnLead: '田宅宫是一个很容易被读窄的宫位。很多人一看到田宅宫化禄，第一反应就是"有房产"。但田宅宫不只是房子——它看你的家庭环境、居住品质、祖业根基，甚至你内心那个"安不安"的感觉。化禄在田宅宫，确实代表家运顺畅、不动产有缘，但"有房"和"有家"是两条线，要分开读。',
    cnIntro2: '化禄是资源星，落在田宅宫，资源往"家"的方向走。可能是家里条件不错，可能是买房比别人顺利，也可能是你天生对"安顿"这件事有感觉。但禄在田宅也有陷阱：房子越多不一定越安心，家产越厚不一定家越齐。这篇把田宅宫化禄的几种组合拆开讲。',
    cnSections: [
      {
        h: '田宅宫化禄先看：家产是挣来的还是继承的',
        ps: [
          '田宅宫化禄的第一层意思是"家运有禄"。但这个禄从哪来，要看主星和三方四正。田宅宫见武曲、天府化禄，多半是自己挣下的家产；见太阴化禄，可能与祖业、母系资助或房产增值有关；见天同化禄，则更偏向居住环境舒适、家里条件好，但不一定是大富。',
          '田宅宫化禄加禄存，是"有产有库"的组合。化禄是财源不断，禄存是守得住，这种人不光买房有缘，还能让房子保值增值。如果田宅宫化禄但不见禄存，又见大耗，那房产可能有但留不住——买了卖、卖了买，或者房子有但贷款压力大，名下有产但手里没余钱。',
          '举个确定的组合：田宅宫武曲化禄加天府，三方见禄存。武曲是财星，天府是库星，禄存是守星——这是典型的"白手起家置产"组合。反过来，田宅宫太阳化禄但三方见地空地劫，可能是家里看着体面，实际家底空，或者房产有名无权。'
        ]
      },
      {
        h: '田宅宫化禄加吉星：家庭环境好到什么程度',
        ps: [
          '田宅宫化禄加天魁、天钺，家里容易出贵人，或者搬家、买房时常有人帮忙。这种组合的人通常家庭关系和睦，关键时候家人能拉一把。但魁钺是外人星，在田宅宫也可能代表"贵人不在家里在家外"——家里条件一般，但邻居、社区、物业方面有人帮。',
          '田宅宫化禄加左辅、右弼，家庭稳定，有人操持。这种组合的人通常家里不缺帮手——配偶能干、父母帮忙、或者住得离亲戚近有照应。如果田宅宫在辰戌丑未（四库地）又见左右，家运更稳。',
          '田宅宫化禄加文昌、文曲，家里有书香气息，或者因为文书、学历、资质而得产。这种组合适合从事与房产相关的文书工作，也代表居住环境有文化氛围。但昌曲是文星，不主大财，房子可能不大但雅致。'
        ]
      },
      {
        h: '田宅宫化禄加煞星：房子有了但家不安',
        ps: [
          '田宅宫化禄最怕什么？不是没房，是"有房但家不安"。田宅宫化禄加擎羊、火星，家里容易有争执——房产纠纷、家人吵架、装修出问题。这种组合的人可能有房，但住得不踏实，或者因为房子跟人打官司。',
          '田宅宫化禄加地空、地劫，是"房产有缘但留不住"的典型。可能买了房又卖，或者房子有产权问题，或者家里东西经常坏、经常修。空劫在田宅也主"家大但空"——房子不小，但家里人少或不常聚，物理空间和心理空间都空。',
          '田宅宫化禄加陀罗，房产事宜拖泥带水。买房过户慢、装修拖工期、家产分配纠缠不清。陀罗在田宅也主"老宅"——可能住老房子，或者家产传承过程漫长。如果田宅宫是空宫，必须借对宫子女宫的星曜和三方四正来读，不能直接判"田宅弱"。'
        ]
      },
      {
        h: '田宅宫化禄在流年：搬家、买房和家运变化',
        ps: [
          '田宅宫化禄在大限流年怎么应，要分三种情况看。',
          '<strong>第一种：大限田宅宫化禄，或大限命宫走到田宅宫化禄。</strong>这十年是置产、搬家、改善居住环境的好时机。家运在上升期，买房、装修、搬家都比较顺利。但这十年也容易"越换越大"——要注意不要因为贪舒服而背负过重贷款。',
          '<strong>第二种：流年化禄飞入田宅宫。</strong>这一年家里有喜事——可能是买房、搬家、家里添丁，或者家人收入增加改善了居住条件。流年禄入田宅也主"安家"，适合签长租、定下来。但流年禄是一年期的，如果这一年买房，要确认自己的长期还款能力，不要只看今年顺。',
          '<strong>第三种：流年田宅宫化忌冲田宅宫。</strong>这一年家运容易出问题——房子漏水、家电坏、家人不和、房产纠纷。如果流年忌入田宅又逢煞星，不宜在这一年买房或大装修，也不宜做房产担保。'
        ]
      },
      {
        h: '排盘后的使用顺序',
        ps: [
          '排盘看到田宅宫化禄，建议按这个顺序读：',
        ],
        ol: [
          '先看田宅宫主星是什么星化禄——武曲天府主自置产，太阴主祖业或母系，天同主舒适环境。',
          '再看禄存是否同宫或在三方，判断家产能不能守住。',
          '看魁钺、左右、昌曲哪些来会，判断家庭助力的来源。',
          '检查擎羊、空劫、陀罗等煞星，找出"有房但家不安"的风险点。',
          '田宅宫是空宫时，必须借对宫子女宫和三方四正来读，不能直接判弱。',
          '大限流年分三种引动：大限禄主置产期、流年禄主安家年、流年忌冲主家运波动。'
        ]
      }
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-tianzhaigong.html', text: '田宅宫怎么看' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: '本宫没有主星怎么读' }
    ],
    enLead: 'The Property Palace is easy to misread. Most people see Hua Lu here and immediately think "real estate." But this palace covers more than property — it rules your living environment, your family atmosphere, your ancestral foundation, and even that inner sense of "home." Hua Lu in the Property Palace does suggest smooth home luck and an affinity for real estate, but owning property and feeling at home are two different readings.',
    enIntro2: 'Hua Lu is the Resource Star. When it lands in the Property Palace, resources flow toward home and stability. It might mean a comfortable upbringing, an easier time buying property, or a natural instinct for settling down. But the trap is confusing square footage with security. This article breaks down the common combinations.',
    enSections: [
      {
        h: 'First Question: Did You Build It, or Did You Inherit It?',
        ps: [
          'The first layer of Hua Lu in the Property Palace is "good home fortune." But where the fortune comes from depends on the main star. Wu Qu (Finance Star) or Tian Fu (Treasury Star) with Hua Lu usually points to property you build yourself. Tai Yin (Moon Star) with Hua Lu can mean inheritance, support from the mother\'s side, or gains through property appreciation. Tian Tong with Hua Lu leans more toward comfort — a nice place to live, not necessarily great wealth.',
          'Hua Lu plus Lu Cun (the Storage Star) in the Property Palace is the "owns it and keeps it" pattern. Hua Lu brings the flow; Lu Cun holds it. People with this combination not only buy well but see their property hold value. If Hua Lu sits without Lu Cun and Da Hao (the Consumption Star) appears, property may come and go — buying and selling, or owning but carrying heavy debt.',
          'A concrete pattern: Property Palace has Wu Qi with Hua Lu and Tian Fu, with Lu Cun in the triads. Wu Qu earns, Tian Fu stores, Lu Cun protects — this is classic self-made property wealth. Compare that to Property Palace with Tai Yang and Hua Lu but Di Kong and Di Jie (Emptiness Stars) in the triads: the family looks respectable on the outside, but the actual foundation is thin.'
        ]
      },
      {
        h: 'With Supporting Stars: How Good Is the Home Environment?',
        ps: [
          'Hua Lu plus Tian Kui or Tian Yue (Benefactor Stars) in the Property Palace means help comes through home and living situations — someone helps with a deposit, a neighbor becomes a resource, a move goes smoothly. But Kui and Yue are "outside" stars; they can also mean your benefactors aren\'t family but community.',
          'Hua Lu plus Zuo Fu or You Bi (Assistant Stars) means a stable household with people who help run it — a capable spouse, supportive parents, or extended family nearby. If the Property Palace sits in Chen, Xu, Chou, or Wei (the four storage positions) with Zuo-You, home stability is even stronger.',
          'Hua Lu plus Wen Chang or Wen Qu (Scholar Stars) brings a bookish, cultured home environment, or property gained through credentials and paperwork. This combination suits real estate law, architecture, or academic housing. The home may not be large, but it has character.'
        ]
      },
      {
        h: 'With Challenging Stars: A Roof Over Your Head but No Peace Inside',
        ps: [
          'The hardest pattern isn\'t "no house" — it\'s "a house but no peace." Hua Lu plus Qing Yang (Sharpening Star) or Huo Xing (Fire Star) brings disputes into the home: property disagreements, family arguments, renovation problems. You may own a place but not enjoy living in it.',
          'Hua Lu plus Di Kong or Di Jie (Emptiness Stars) is the classic "property comes and goes" pattern. You buy and sell, face title issues, or find that things in the home constantly break and need repair. Kong-Jie in the Property Palace can also mean a big but empty house — lots of square footage, few people inside.',
          'Hua Lu plus Tuo Luo (Stagnation Star) drags out property matters: slow closings, endless renovations, tangled inheritance. If the Property Palace is empty (no main star), you must borrow stars from the opposite Children Palace and read the triads — never call an empty Property Palace "weak" on its own.'
        ]
      },
      {
        h: 'In Timing: Moving, Buying, and Shifts in Home Luck',
        ps: [
          'There are three distinct ways this activates in timing.',
          '<strong>First: a ten-year cycle brings Hua Lu to the Property Palace.</strong> This is a decade for buying, upgrading, or improving your living situation. Home luck is rising. But these ten years also tempt you to over-upgrade — be careful not to take on more mortgage than the long term supports.',
          '<strong>Second: a yearly Hua Lu flies into the Property Palace.</strong> This year brings a home event — a purchase, a move, a new family member, or a raise that improves where you live. A yearly Lu is good for signing long leases or putting down roots. But it lasts one year; if you buy, make sure the payment works beyond this year.',
          '<strong>Third: a yearly Hua Ji (Obstacle Star) hits or opposes the Property Palace.</strong> This year brings home problems — leaks, breakdowns, family friction, property disputes. Don\'t buy or renovate big in a Ji year, and don\'t co-sign on property.'
        ]
      },
      {
        h: 'Reading Order After You Cast the Chart',
        ps: [
          'When you find Hua Lu in the Property Palace, read it in this order:',
        ],
        ol: [
          'Check which star carries the Hua Lu — Wu Qu/Tian Fu point to self-made wealth, Tai Yin to inheritance, Tian Tong to comfort.',
          'Look for Lu Cun in the palace or triads to see if the property holds.',
          'Check Kui-Yue, Zuo-You, and Chang-Qu for the type of home support.',
          'Check Qing Yang, Kong-Jie, and Tuo Luo for "house but no peace" risks.',
          'If the palace is empty, borrow the opposite Children Palace and read the triads — never call it weak directly.',
          'Separate the three timing triggers: ten-year Lu for buying, yearly Lu for settling, yearly Ji for home problems.'
        ]
      }
    ],
    enSidebar: [
      { href: '../../pages/mingbook-onepage.html', text: 'Cast Your Chart (Quick Chart)' },
      { href: './', text: 'English article index' },
      { href: '../ziwei-tianzhaigong-hualu.html', text: 'Read in Chinese' },
      { href: '../ziwei-four-transformations.html', text: 'Four Transformations topic page' },
      { href: '../ziwei-sanfang-sizheng.html', text: 'Triads and opposite palace' },
      { href: '../ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: 'What an empty palace really means' }
    ]
  },
  {
    slug: 'ziwei-fudegong-hualu',
    cnTitle: '紫微斗数福德宫化禄：想得开和没心没肺是两回事',
    cnDesc: '福德宫化禄的人通常心态好、会享受，但福德宫看的是精神世界和潜意识，化禄在这里不代表没有烦恼，而是烦恼来得快去得也快。',
    enTitle: 'Mental Palace With Hua Lu: Letting Go and Not Caring at All Are Different',
    enDesc: 'Hua Lu in the Mental Palace usually means an easygoing nature and an ability to enjoy life. But this palace rules your inner world — the Lu here means worries pass quickly, not that nothing bothers you.',
    category: '四化细读',
    cnH1: '紫微斗数福德宫化禄：想得开和没心没肺是两回事',
    enH1: 'Mental Palace With Hua Lu: Letting Go and Not Caring at All Are Different',
    cnLead: '福德宫是十二宫里最"虚"的一个宫。它看你的精神状态、潜意识、兴趣爱好，甚至你这辈子"享不享福"。化禄落在福德宫，最常见的说法是"心态好、有福报"。但心态好分两种：一种是真想得开，事情过了就过了；另一种是逃避，不想面对所以假装没事。这两种在盘上长得完全不一样。',
    cnIntro2: '化禄在福德宫的人通常有个共同点：恢复力强。遇到不开心的事，别人可能纠结半个月，他睡一觉就好多了。但恢复力强不等于没有问题——福德宫化禄的人容易把不舒服压下去，表面没事，潜意识里记着账。这篇把福德宫化禄的组合拆开讲。',
    cnSections: [
      {
        h: '福德宫化禄先看：福气是天生的还是修来的',
        ps: [
          '福德宫化禄的第一层意思是"精神上不缺"。这种人通常能在小事里找到乐趣——一杯好茶、一个好天气、一部好剧就能让他满足。但同样是福德宫化禄，主星不同，福气的性质完全不同。',
          '天同、天梁在福德宫化禄，是天生的"想得开"。天同主享受，天梁主荫庇，这两颗星在福德宫化禄的人，心态上有底座，遇到难事能自我消化。太阴在福德宫化禄，则偏向内心细腻、情感丰富，能从艺术、自然中获得滋养，但也容易想多。',
          '贪狼在福德宫化禄，是"会玩"的组合。兴趣广泛、好奇心强，什么都想试，但贪狼是欲望之星，化禄在这里也主"欲望多但容易满足"——想要的东西不少，但得到了就开心，不太钻牛角尖。如果福德宫化禄加禄存，则是"能享能存"——不光会享福，还有积蓄福气的能力，晚年心态更稳。'
        ]
      },
      {
        h: '福德宫化禄加吉星：精神世界有多丰富',
        ps: [
          '福德宫化禄加文昌、文曲，精神世界丰富，喜欢阅读、音乐、艺术或任何需要动脑的爱好。这种人通常有自己的精神角落，哪怕物质条件一般，内心也不空虚。但昌曲在福德也主"想得多"，容易在脑子里反复回放事情。',
          '福德宫化禄加天魁、天钺，在精神层面有贵人——可能是遇到好的老师、导师，或者在低谷时读到一本书、听到一句话就想通了。这种组合的人通常在人生关键节点有"顿悟"的体验。',
          '福德宫化禄加左辅、右弼，内心有支撑感。这种人不太容易被打垮，因为潜意识里总觉得"有人帮我"或"总会有办法"。这种乐观不是盲目的，而是一种深层的安全感。'
        ]
      },
      {
        h: '福德宫化禄加煞星：表面开心内心焦虑',
        ps: [
          '福德宫化禄最需要警惕的组合是"禄逢空"。化禄加地空、地劫在福德宫，是典型的"表面没事，内心空"。这种人在外面看起来很乐观，但独处时容易感到虚无——什么都有了，但就是觉得没意思。空劫在福德也主"精神追求偏门"，容易对宗教、玄学、灵修感兴趣，但要注意别走极端。',
          '福德宫化禄加擎羊、火星，脾气来得快去得也快。这种人不记仇，但发火的时候很猛，容易出口伤人然后后悔。化禄加铃星则更麻烦——表面笑嘻嘻，内心焦虑得不行，铃星是暗火，在福德宫主"长期精神紧张"。',
          '福德宫化禄加陀罗，是"想不开但假装想开"。陀罗主纠缠，在福德宫会让人反复想一件事，表面说"算了"，心里其实没放下。这种组合的人容易失眠或焦虑，因为大脑在睡觉时还在转。如果福德宫是空宫，要借对宫财帛宫的星曜来读——对宫化禄或化忌，直接影响你的精神状态。'
        ]
      },
      {
        h: '福德宫化禄在流年：心态转变的年份',
        ps: [
          '福德宫化禄在大限流年怎么应，要分三种情况。',
          '<strong>第一种：大限福德宫化禄。</strong>这十年是心态最好的十年，精神放松、享受生活。但这十年也容易"躺平"——太舒服了不想动。如果这十年正好是事业关键期，要提醒自己别因为心态好就失去紧迫感。',
          '<strong>第二种：流年化禄飞入福德宫。</strong>这一年心情好、想得开，适合调整心态、培养兴趣、处理心结。流年禄入福德也主"精神上的收获"——可能想通了一件困扰很久的事。这一年适合做心理调整、学习新东西，但不适合做重大财务决策，因为心态太松容易低估风险。',
          '<strong>第三种：流年化忌冲入福德宫。</strong>这一年容易焦虑、失眠、想不开。化忌是执念之星，冲入福德宫会让人钻牛角尖。这一年要刻意运动、社交、不要一个人闷着。如果流年忌入福德又逢铃星、陀罗，要特别注意情绪健康。'
        ]
      },
      {
        h: '排盘后的使用顺序',
        ps: [
          '排盘看到福德宫化禄，建议按这个顺序读：',
        ],
        ol: [
          '先看福德宫主星是什么星化禄——天同天梁主天生豁达，太阴主细腻，贪狼主多欲但易满足。',
          '再看禄存是否来会，判断福气能不能"存住"。',
          '看昌曲、魁钺、左右哪些来会，判断精神世界的丰富度和支撑来源。',
          '检查空劫、擎羊、铃星、陀罗，找出"表面开心内心焦虑"的风险点。',
          '福德宫是空宫时，借对宫财帛宫和三方四正来读，财运直接影响心态。',
          '大限流年分三种：大限禄主享福但防躺平、流年禄主心态调整年、流年忌冲主焦虑年。'
        ]
      }
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: '本宫没有主星怎么读' }
    ],
    enLead: 'The Mental Palace (Fu De Gong) is the most abstract of the twelve palaces. It rules your mental state, your subconscious, your interests, and even whether you "enjoy life" in a deep sense. When Hua Lu lands here, the common reading is "good attitude, blessed." But there are two kinds of good attitude: genuinely letting go, and avoiding what you don\'t want to face. They look very different on a chart.',
    enIntro2: 'People with Hua Lu in the Mental Palace share one trait: they bounce back. Upsets that would haunt someone else for weeks are processed after a night\'s sleep. But bouncing back isn\'t the same as processing. The Lu here can also mean you push discomfort down — fine on the surface, but the subconscious keeps score.',
    enSections: [
      {
        h: 'First Question: Is the Contentment Built In or Earned?',
        ps: [
          'The first layer of Hua Lu in the Mental Palace is "no lack spiritually." These people find joy in small things — good tea, nice weather, a solid show. But the main star changes the flavor entirely.',
          'Tian Tong (Comfort Star) or Tian Liang (Shelter Star) with Hua Lu here is the natural "let it go" type. They have an emotional baseline that absorbs difficulty. Tai Yin (Moon Star) with Hua Lu is more nuanced — rich inner life, nourished by art and nature, but also prone to overthinking.',
          'Tan Lang (Desire Star) with Hua Lu is the "knows how to have fun" pattern. Wide interests, strong curiosity, wants a lot but is easily satisfied once they get it. If Lu Cun (Storage Star) joins, it\'s "enjoys life and also saves for later" — contentment that builds over time, especially in later years.'
        ]
      },
      {
        h: 'With Supporting Stars: How Rich Is the Inner World?',
        ps: [
          'Hua Lu plus Wen Chang or Wen Qu (Scholar Stars) gives a rich inner life — reading, music, art, anything that engages the mind. These people have a private mental room they can retreat to. But Chang-Qu in the Mental Palace also means replaying things in your head.',
          'Hua Lu plus Tian Kui or Tian Yue (Benefactor Stars) brings mentors or teachers at the mental level — a book, a quote, a conversation that shifts how you see things. These people often have "aha" moments at life\'s turning points.',
          'Hua Lu plus Zuo Fu or You Bi (Assistant Stars) gives a deep sense of inner support. These people don\'t break easily because somewhere inside, they believe "someone has my back" or "there\'s always a way." It\'s not blind optimism; it\'s foundational security.'
        ]
      },
      {
        h: 'With Challenging Stars: Fine on the Outside, Anxious Underneath',
        ps: [
          'The pattern to watch most carefully is "Lu meets emptiness." Hua Lu plus Di Kong or Di Jie in the Mental Palace is the classic "looks fine, feels empty" combination. Outwardly optimistic, but alone they feel a vague void — they have much but little that matters. Kong-Jie here also draws people to spirituality or the esoteric, which can be helpful or escapist.',
          'Hua Lu plus Qing Yang or Huo Xing means a quick temper that passes fast. They don\'t hold grudges, but the outburst can wound before it fades. Hua Lu plus Ling Xing (Sirens Star) is harder: smiling outside, anxious inside, a slow-burning tension that doesn\'t show.',
          'Hua Lu plus Tuo Luo (Stagnation Star) is "can\'t let go but pretends to." Tuo Luo loops the same thought. They say "it\'s fine" while their mind keeps spinning. This pattern is linked to insomnia and anxiety. If the Mental Palace is empty, borrow the opposite Wealth Palace stars — how money flows directly affects how you feel.'
        ]
      },
      {
        h: 'In Timing: Years When Your Mindset Shifts',
        ps: [
          'Three distinct ways this activates in timing.',
          '<strong>First: a ten-year cycle brings Hua Lu to the Mental Palace.</strong> This is a relaxed decade where you enjoy life. The risk is going too soft — if these are prime career years, don\'t let comfort kill your edge.',
          '<strong>Second: a yearly Hua Lu flies into the Mental Palace.</strong> This year brings good mood and perspective. It\'s a good year to resolve old mental knots, start a hobby, or begin therapy. But don\'t make big financial decisions on a yearly Lu — you\'re too relaxed to price risk correctly.',
          '<strong>Third: a yearly Hua Ji opposes or enters the Mental Palace.</strong> This year brings anxiety, insomnia, and fixation. Ji is the star of obsession; in the Mental Palace it makes you loop. Force yourself to exercise, socialize, and not sit alone with your thoughts. If Ling Xing or Tuo Luo joins, take emotional health seriously.'
        ]
      },
      {
        h: 'Reading Order After You Cast the Chart',
        ps: [
          'When you find Hua Lu in the Mental Palace, read it in this order:',
        ],
        ol: [
          'Check which star carries the Hua Lu — Tian Tong/Tian Liang for natural ease, Tai Yin for sensitivity, Tan Lang for many desires easily met.',
          'Look for Lu Cun to see if the contentment builds over time.',
          'Check Chang-Qu, Kui-Yue, and Zuo-You for inner-world richness and support.',
          'Check Kong-Jie, Qing Yang, Ling Xing, and Tuo Luo for "fine outside, anxious inside" risks.',
          'If the palace is empty, borrow the opposite Wealth Palace and triads — money and mood are directly linked here.',
          'Separate timing: ten-year Lu for enjoyment (watch for complacency), yearly Lu for mindset shifts, yearly Ji for anxiety.'
        ]
      }
    ],
    enSidebar: [
      { href: '../../pages/mingbook-onepage.html', text: 'Cast Your Chart (Quick Chart)' },
      { href: './', text: 'English article index' },
      { href: '../ziwei-fudegong-hualu.html', text: 'Read in Chinese' },
      { href: '../ziwei-four-transformations.html', text: 'Four Transformations topic page' },
      { href: '../ziwei-sanfang-sizheng.html', text: 'Triads and opposite palace' },
      { href: '../ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: 'What an empty palace really means' }
    ]
  },
  {
    slug: 'ziwei-xiongdigong-huaquan',
    cnTitle: '紫微斗数兄弟宫化权：兄弟姐妹强势，是帮你还是压你',
    cnDesc: '兄弟宫化权代表同辈中有能力强、个性硬的人。化权是掌控星，在兄弟宫要看这个权是助力还是压力，还要和交友宫对看。',
    enTitle: 'Brothers Palace With Hua Quan: Strong Siblings Can Help or Dominate',
    enDesc: 'Hua Quan in the Brothers Palace means capable, strong-willed people in your peer group. The Authority Star here can be a powerful ally or a source of pressure — read it against the Friends Palace.',
    category: '四化细读',
    cnH1: '紫微斗数兄弟宫化权：兄弟姐妹强势，是帮你还是压你',
    enH1: 'Brothers Palace With Hua Quan: Strong Siblings Can Help or Dominate',
    cnLead: '兄弟宫看的不只是亲兄弟姐妹。它看你所有的"同辈关系"——兄弟姐妹、合伙人、同学同事中跟你平起平坐的人。化权落在兄弟宫，最直接的意思是：你的同辈里有人很强。但"强"有两种：一种是能扛事、能帮你；另一种是强势、要你听他的。这两种在盘上区别很大。',
    cnIntro2: '化权是掌控星、执行力星。在兄弟宫，它可能代表你有一个能干的哥哥或姐姐，也可能代表你在合伙关系中遇到一个强势的搭档。关键是看：这个权在你这边还是在对方那边？他掌权对你有利还是有压？这篇把兄弟宫化权的组合拆开讲。',
    cnSections: [
      {
        h: '兄弟宫化权先看：谁掌握话语权',
        ps: [
          '兄弟宫化权的第一层意思是"同辈中有能人"。但这个能人是帮你还是管你，要看主星和化权的关系。紫微、天府在兄弟宫化权，同辈中有"老大型"的人——有能力、有担当，但也喜欢说了算。如果这种人是你哥哥姐姐，小时候可能管你管得严，但长大了是靠山。',
          '武曲在兄弟宫化权，同辈中有实干型的人——能赚钱、能做事，但脾气硬、不讲情面。这种关系更像"战友"而不是"朋友"，一起做事可以，但别指望他跟你谈感情。太阳在兄弟宫化权则不同，同辈中有热心但爱表现的人，愿意帮你但帮完要让所有人知道。',
          '如果兄弟宫化权但命宫也强（命宫有化权或紫微天府），那"权"在你自己手里，你在同辈关系中是主导者。如果命宫弱而兄弟宫化权，那你在同辈关系中容易处于被动——别人说了算，你跟着走。'
        ]
      },
      {
        h: '兄弟宫化权加吉星：强势但有能的同辈',
        ps: [
          '兄弟宫化权加天魁、天钺，同辈中有贵人——这个人不光强，还愿意拉你一把。这种组合通常有一个"大哥型"的朋友或兄弟姐妹，关键时刻能替你出头。但要注意：魁钺是贵人星，化权是掌控星，这个贵人帮你的方式可能比较"霸道"——他觉得对你好的，你必须接受。',
          '兄弟宫化权加左辅、右弼，同辈关系稳定且有执行力。这种组合适合合伙做生意——有人掌舵（化权），有人辅佐（左右），分工明确。如果左右在命宫而化权在兄弟宫，你是辅佐者；如果左右在兄弟宫而化权在命宫，别人辅佐你。',
          '兄弟宫化权加文昌、文曲，同辈中有能说会写的人。这种组合的合伙人可能擅长谈判、合同、营销，靠脑子而不是靠蛮力。但昌曲加化权也主"嘴上不服人"，同辈之间容易因为意见不同而争执。'
        ]
      },
      {
        h: '兄弟宫化权加煞星：同辈关系紧张',
        ps: [
          '兄弟宫化权加擎羊、火星，同辈关系紧张——兄弟姐妹或合伙人脾气大、容易冲突。这种组合的人可能跟哥哥姐姐打过架，或者跟合伙人拍过桌子。化权加擎羊是"硬碰硬"，如果你的命宫也强，那就是两强相争；如果命宫弱，那就是被压制。',
          '兄弟宫化权加地空、地劫，同辈关系中有"空"的成分——可能兄弟姐妹缘薄，或者合伙人能力强但不靠谱。空劫在兄弟宫也主"合伙破财"，对方有能力但方向不对，或者中途退出让你收拾烂摊子。',
          '兄弟宫化权加陀罗，同辈关系纠缠不清——合伙纠纷拖很久，兄弟姐妹之间有陈年旧账。陀罗在兄弟宫也主"同辈中有慢性病或固执的人"。如果兄弟宫是空宫，要借对宫交友宫的星曜来读，不能直接判"兄弟弱"。兄弟宫空宫但交友宫化权，可能是亲兄弟平平但朋友中有强人。'
        ]
      },
      {
        h: '兄弟宫化权在流年：合伙、竞争和同辈变动',
        ps: [
          '兄弟宫化权在大限流年怎么应，要分三种情况。',
          '<strong>第一种：大限兄弟宫化权。</strong>这十年同辈关系是你的重点——可能合伙创业、跟兄弟姐妹一起做事，或者在一个强势的领导/同事手下工作。这十年适合借助同辈的力量，但要注意权责分明，先小人后君子，合同一定要签清楚。',
          '<strong>第二种：流年化权飞入兄弟宫。</strong>这一年同辈中有人掌权或升职，可能直接影响你——哥哥升了职能帮你，合伙人想扩权，或者同事成了你的上级。流年权入兄弟也主"这一年同辈关系有变动"，适合主动跟强人合作，但不宜在这一年跟同辈硬碰硬。',
          '<strong>第三种：流年兄弟宫化忌或化忌冲兄弟宫。</strong>这一年同辈关系容易出问题——合伙纠纷、兄弟姐妹矛盾、朋友背叛。化忌是是非星，入兄弟宫主同辈关系有执念或纠缠。这一年不宜新合伙、不宜借钱给同辈，也不宜跟兄弟姐妹谈分家产。'
        ]
      },
      {
        h: '排盘后的使用顺序',
        ps: [
          '排盘看到兄弟宫化权，建议按这个顺序读：',
        ],
        ol: [
          '先看兄弟宫主星是什么星化权——紫微天府主老大型，武曲主实干型，太阳主热心表现型。',
          '再看命宫强弱，判断这个"权"在你手里还是在对方手里。',
          '看魁钺、左右、昌曲哪些来会，判断同辈助力的方式。',
          '检查擎羊、空劫、陀罗，找出同辈关系中的冲突和风险。',
          '兄弟宫是空宫时，借对宫交友宫和三方四正来读，亲兄弟和朋友要分开看。',
          '大限流年分三种：大限权主合伙期、流年权主同辈变动年、流年忌冲主同辈纠纷年。'
        ]
      }
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-xiongdigong.html', text: '兄弟宫怎么看' },
      { href: 'ziwei-xiongdigong-hualu-guiren-yikao.html', text: '兄弟宫化禄：贵人还是依靠' },
      { href: 'ziwei-jiaoyougong.html', text: '交友宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: '本宫没有主星怎么读' }
    ],
    enLead: 'The Brothers Palace covers more than blood siblings. It rules all your peer-level relationships — brothers and sisters, business partners, classmates, colleagues who stand on equal footing. When Hua Quan (the Authority Star) lands here, the direct meaning is: someone in your peer group is strong. But "strong" splits two ways: someone who can carry weight and help you, or someone who dominates and demands compliance.',
    enIntro2: 'Hua Quan is the star of control and execution. In the Brothers Palace it might mean a capable older sibling, or a forceful business partner. The key question is: does this authority work for you or against you? This article breaks down the combinations.',
    enSections: [
      {
        h: 'First Question: Who Holds the Power?',
        ps: [
          'The first layer is "there is a capable person among your peers." Whether that person helps or controls depends on the main star. Zi Wei (Emperor Star) or Tian Fu (Treasury Star) with Hua Quan here points to a "boss type" — capable and responsible, but also accustomed to being in charge. As an older sibling, they may have been strict growing up but become your anchor later.',
          'Wu Qu (Finance Star) with Hua Quan gives a peer who is all action — makes money, gets things done, but is blunt and unsentimental. This is a "comrade" relationship, not a warm one. Tai Yang (Sun Star) with Hua Quan is different: a peer who is enthusiastic and helpful but needs everyone to know it.',
          'If your Life Palace is also strong (Hua Quan or Zi Wei/Tian Fu there), the power sits with you — you lead among peers. If the Life Palace is soft while the Brothers Palace has Hua Quan, you tend to follow in peer relationships.'
        ]
      },
      {
        h: 'With Supporting Stars: Strong Peers Who Actually Help',
        ps: [
          'Hua Quan plus Tian Kui or Tian Yue (Benefactor Stars) means a peer who is both strong and willing to pull you up — a "big brother" or mentor figure. But note: Kui-Yue bring help, while Hua Quan brings control. This person\'s help may come in a "my way or the highway" style.',
          'Hua Quan plus Zuo Fu or You Bi (Assistant Stars) makes for stable, executable peer relationships — good for business partnerships where one leads and one supports. If Zuo-You are in your Life Palace and Hua Quan is in the Brothers Palace, you\'re the supporter; reverse it and others support you.',
          'Hua Quan plus Wen Chang or Wen Qu (Scholar Stars) gives a peer who is articulate and sharp — strong in negotiation, contracts, or marketing. But Chang-Qu with Hua Quan also means "never loses an argument" — peer disagreements can turn into word wars.'
        ]
      },
      {
        h: 'With Challenging Stars: Tension in Peer Relationships',
        ps: [
          'Hua Quan plus Qing Yang (Sharpening Star) or Huo Xing (Fire Star) makes peer relationships volatile — hot tempers, direct conflict. If your Life Palace is also strong, it\'s a clash of titans; if soft, you\'re the one getting pressed.',
          'Hua Quan plus Di Kong or Di Jie (Emptiness Stars) brings an "empty" quality — siblings may be distant, or a partner is capable but unreliable. Kong-Jie here also signals "partnership loses money" — the person has ability but wrong direction, or bails mid-project.',
          'Hua Quan plus Tuo Luo (Stagnation Star) drags out peer disputes — partnership conflicts that never fully resolve, old debts between siblings. If the Brothers Palace is empty, borrow the opposite Friends Palace stars — an empty Brothers Palace with a strong Friends Palace may mean weak siblings but powerful friends.'
        ]
      },
      {
        h: 'In Timing: Partnerships, Rivalries, and Peer Changes',
        ps: [
          'Three distinct timing triggers.',
          '<strong>First: a ten-year cycle brings Hua Quan to the Brothers Palace.</strong> This decade puts peer relationships front and center — starting a business with a partner, working under a strong colleague, or collaborating with siblings. It\'s a good decade to borrow peer strength, but get roles and contracts in writing first.',
          '<strong>Second: a yearly Hua Quan flies into the Brothers Palace.</strong> This year a peer gains power or a promotion that affects you — a sibling moves up, a partner wants more control, a colleague becomes your boss. It\'s a year to align with strong people, not to fight them head-on.',
          '<strong>Third: a yearly Hua Ji (Obstacle Star) enters or opposes the Brothers Palace.</strong> This year brings peer conflict — partnership disputes, sibling arguments, betrayal among friends. Don\'t start new partnerships, don\'t lend money to peers, and don\'t negotiate inheritance this year.'
        ]
      },
      {
        h: 'Reading Order After You Cast the Chart',
        ps: [
          'When you find Hua Quan in the Brothers Palace, read it in this order:',
        ],
        ol: [
          'Check which star carries the Hua Quan — Zi Wei/Tian Fu for the boss type, Wu Qu for the doer, Tai Yang for the performer.',
          'Check your Life Palace strength to see if the power is yours or theirs.',
          'Check Kui-Yue, Zuo-You, and Chang-Qu for the style of peer support.',
          'Check Qing Yang, Kong-Jie, and Tuo Luo for conflict and risk.',
          'If the palace is empty, borrow the opposite Friends Palace and triads — read siblings and friends separately.',
          'Separate timing: ten-year Quan for partnerships, yearly Quan for peer shifts, yearly Ji for peer disputes.'
        ]
      }
    ],
    enSidebar: [
      { href: '../../pages/mingbook-onepage.html', text: 'Cast Your Chart (Quick Chart)' },
      { href: './', text: 'English article index' },
      { href: '../ziwei-xiongdigong-huaquan.html', text: 'Read in Chinese' },
      { href: '../ziwei-four-transformations.html', text: 'Four Transformations topic page' },
      { href: '../ziwei-sanfang-sizheng.html', text: 'Triads and opposite palace' },
      { href: '../ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: 'What an empty palace really means' }
    ]
  },
  {
    slug: 'ziwei-jieegong-huaquan',
    cnTitle: '紫微斗数疾厄宫化权：身体硬朗和硬撑是两回事',
    cnDesc: '疾厄宫化权的人通常体质结实、恢复力强，但化权也主"硬扛"——身体有信号不当回事，容易把小问题拖成大问题。',
    enTitle: 'Health Palace With Hua Quan: Toughing It Out and Being Truly Tough Are Different',
    enDesc: 'Hua Quan in the Health Palace usually means a strong constitution and fast recovery. But the Authority Star also means you push through pain — ignoring signals until small problems become big ones.',
    category: '四化细读',
    cnH1: '紫微斗数疾厄宫化权：身体硬朗和硬撑是两回事',
    enH1: 'Health Palace With Hua Quan: Toughing It Out and Being Truly Tough Are Different',
    cnLead: '疾厄宫化权的人有一个共同特点：不爱看病。不是不怕死，是觉得"这点小毛病算什么"。化权是硬星，落在疾厄宫，体质通常偏强——骨架大、力气足、生病少。但"体质强"和"硬扛"是两回事：真正的体质强是恢复快，硬扛是有信号不接，最后小问题拖成大问题。',
    cnIntro2: '疾厄宫看身体也看情绪。化权在疾厄宫的人，身体上偏硬朗，情绪上偏压抑——什么事都自己扛，不习惯示弱。这种人在外面是"铁人"，但身体会用自己的方式讨债。这篇把疾厄宫化权的组合拆开讲。',
    cnSections: [
      {
        h: '疾厄宫化权先看：体质偏强还是偏硬',
        ps: [
          '疾厄宫化权的第一层意思是"身体有底子"。但这个底子是哪种强，要看主星。武曲、七杀在疾厄宫化权，体质偏"硬"——骨架粗、肌肉型、耐受力强，但容易有筋骨伤、手术风险。这种人适合体力劳动或运动，但要注意外伤。',
          '紫微、天府在疾厄宫化权，体质偏"稳"——身体机能均衡，少大病，但容易因为"太稳"而忽视体检。这种人通常中年以前不怎么生病，但一生病就是大问题，因为平时不关注。',
          '天机、天同在疾厄宫化权则不同——体质不算最强，但恢复力惊人。天机主神经系统，化权在这里可能表现为神经敏感但控制力强；天同主泌尿和代谢，化权在这里是"底子一般但能扛"。如果疾厄宫化权加禄存，体质强且能持久，是"长寿型"的底子。'
        ]
      },
      {
        h: '疾厄宫化权加吉星：抗病能力强',
        ps: [
          '疾厄宫化权加天魁、天钺，生病时有良医——关键时刻能遇到好医生，或者治疗过程顺利。这种组合的人如果真生病了，不要硬扛，因为魁钺代表"医缘"，你去看了才能遇到对的人。',
          '疾厄宫化权加左辅、右弼，身体有"备用系统"——一个器官出问题，另一个能代偿。这种人通常恢复力强，手术后愈合快。但左右也主"有人照顾"，生病时不缺人管。',
          '疾厄宫化权加文昌、文曲，要注意神经系统和呼吸系统。昌曲主文，在疾厄宫化权可能表现为用脑过度导致的神经衰弱、失眠。这种人适合做脑力工作，但必须刻意运动来平衡。'
        ]
      },
      {
        h: '疾厄宫化权加煞星：硬扛出来的病',
        ps: [
          '疾厄宫化权最需要警惕的组合是化权加擎羊。擎羊主刀伤，在疾厄宫化权加擎羊，是"硬扛到开刀"的典型信号。这种人通常小病不看，等到必须手术了才去。擎羊也主外伤和急性病，化权加擎羊的人要特别注意安全，避免高风险运动。',
          '疾厄宫化权加火星、铃星，身体有"炎症"倾向。火星主急性炎症——突然发烧、急性肠胃炎；铃星主慢性炎症——长期胃炎、慢性肝炎。化权加火铃的人脾气也急，情绪走身体，一生气就胃痛或头痛。',
          '疾厄宫化权加陀罗，慢性病的信号。陀罗主拖延和纠缠，在疾厄宫代表"病拖很久"——可能是慢性病，也可能是诊断过程漫长。化权加陀罗的人最容易犯的错是"拖着不看"。如果疾厄宫是空宫，要借对宫父母宫的星曜来读——父母宫的星曜直接影响你的遗传体质，不能因为疾厄宫空就判"身体好"。'
        ]
      },
      {
        h: '疾厄宫化权在流年：身体容易出状况的年份',
        ps: [
          '疾厄宫化权在大限流年怎么应，要分三种情况。',
          '<strong>第一种：大限疾厄宫化权。</strong>这十年身体底子在巅峰，但也是最容易硬扛的十年。这十年适合锻炼、增肌、提高体能，但要注意运动伤害。化权在大限疾厄也主"这十年身体说了算"——你不照顾它，它就给你颜色看。',
          '<strong>第二种：流年化权飞入疾厄宫。</strong>这一年身体偏硬、精力旺，但也容易过度消耗——熬夜、加班、拼命运动。流年权入疾厄是"身体给你底气但也给你脾气"的一年，适合体检和建立运动习惯，不宜硬撑带伤工作。',
          '<strong>第三种：流年化忌冲入疾厄宫。</strong>这一年身体容易出问题——化忌主阻滞，冲入疾厄宫代表气血不通、慢性病加重或检查出问题。这一年必须体检，有信号不要拖。如果流年忌入疾厄又逢擎羊、陀罗，要特别注意，该看医生就看。'
        ]
      },
      {
        h: '排盘后的使用顺序',
        ps: [
          '排盘看到疾厄宫化权，建议按这个顺序读：',
        ],
        ol: [
          '先看疾厄宫主星是什么星化权——武曲七杀偏硬，紫微天府偏稳，天机天同偏恢复力。',
          '再看禄存是否来会，判断体质能不能持久。',
          '看魁钺、左右、昌曲，判断医缘、恢复力和需要注意的系统。',
          '检查擎羊、火铃、陀罗，找出"硬扛出病"的风险点。',
          '疾厄宫是空宫时，借对宫父母宫和三方四正来读，遗传和体质要分开看。',
          '大限流年分三种：大限权主体能巅峰但防硬扛、流年权防过度消耗、流年忌冲必须体检。'
        ]
      }
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-fumugong.html', text: '父母宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: '本宫没有主星怎么读' }
    ],
    enLead: 'People with Hua Quan in the Health Palace share one habit: they avoid doctors. Not out of fear, but because "it\'s just a small thing." Hua Quan is a hard star. In the Health Palace it usually means a strong constitution — big frame, good stamina, rarely sick. But "strong constitution" and "pushing through" are different. Real strength means fast recovery; pushing through means ignoring signals until small things become big ones.',
    enIntro2: 'The Health Palace covers both body and mind. Hua Quan here gives physical toughness and emotional suppression — you carry everything yourself and hate showing weakness. You\'re the "iron person" to everyone else, but the body collects its debts.',
    enSections: [
      {
        h: 'First Question: Are You Strong, or Just Hard?',
        ps: [
          'The first layer is "a body with a foundation." But the main star determines what kind. Wu Qu (Finance Star) or Qi Sha (Seven Killings) with Hua Quan gives a "hard" body — thick frame, muscular, high tolerance, but prone to bone injuries and surgery. Good for physical work and sports; watch for trauma.',
          'Zi Wei or Tian Fu with Hua Quan gives a "steady" body — balanced systems, few major illnesses, but the steadiness can make you skip checkups. These people often sail through youth and then get hit hard in middle age because they never paid attention.',
          'Tian Ji (Thinking Star) or Tian Tong with Hua Quan is different — not the strongest baseline, but remarkable recovery. Tian Ji rules the nervous system; Hua Quan here can mean sensitive nerves with strong control. Tian Tong rules metabolism; Hua Quan here means "average foundation but can endure." If Lu Cun joins, it\'s a long-life constitution.'
        ]
      },
      {
        h: 'With Supporting Stars: Strong Disease Resistance',
        ps: [
          'Hua Quan plus Tian Kui or Tian Yue means good doctors when you need them — you meet the right physician at the right time. But the catch is: Kui-Yue only work if you actually go. Don\'t tough it out; the benefactor star needs you to show up.',
          'Hua Quan plus Zuo Fu or You Bi gives the body a "backup system" — when one organ struggles, another compensates. Recovery is fast, wounds heal well. Zuo-You also mean someone takes care of you when you\'re down.',
          'Hua Quan plus Wen Chang or Wen Qu points to the nervous and respiratory systems. These people are prone to mental fatigue and insomnia from overthinking. They need deliberate physical exercise to balance the mental load.'
        ]
      },
      {
        h: 'With Challenging Stars: Illnesses Born of Toughing It Out',
        ps: [
          'The pattern to watch most is Hua Quan plus Qing Yang (Sharpening Star). Qing Yang rules cuts and surgery. This is the classic "tough it out until the operating table" signal. These people ignore small problems until surgery is the only option. Qing Yang also means acute injury — be careful with high-risk sports.',
          'Hua Quan plus Huo Xing (Fire Star) or Ling Xing (Sirens Star) brings inflammation. Huo Xing is acute — sudden fever, gastroenteritis. Ling Xing is chronic — long-term gastritis, hepatitis. People with this combination also run tension through the body: anger becomes stomach pain or headaches.',
          'Hua Quan plus Tuo Luo (Stagnation Star) signals chronic illness — something that drags on, either a long-term condition or a long diagnostic process. If the Health Palace is empty, borrow the opposite Parents Palace stars — your genetic foundation comes from there, and an empty Health Palace never means "automatically healthy."'
        ]
      },
      {
        h: 'In Timing: Years When the Body Speaks Up',
        ps: [
          'Three timing triggers.',
          '<strong>First: a ten-year cycle brings Hua Quan to the Health Palace.</strong> This decade is your physical peak — but also the decade you\'re most likely to overdo it. Good for building strength and fitness; watch for sports injuries. The body sets the terms these ten years.',
          '<strong>Second: a yearly Hua Quan flies into the Health Palace.</strong> This year brings high energy but also overconsumption — late nights, overwork, pushing through injuries. Use it for checkups and building exercise habits, not for working through pain.',
          '<strong>Third: a yearly Hua Ji opposes or enters the Health Palace.</strong> This year the body is vulnerable — blockages, chronic conditions flaring, or something showing up on a test. Get checked. Don\'t delay. If Qing Yang or Tuo Luo joins, take it especially seriously.'
        ]
      },
      {
        h: 'Reading Order After You Cast the Chart',
        ps: [
          'When you find Hua Quan in the Health Palace, read it in this order:',
        ],
        ol: [
          'Check which star carries the Hua Quan — Wu Qu/Qi Sha for hard, Zi Wei/Tian Fu for steady, Tian Ji/Tian Tong for recovery.',
          'Look for Lu Cun to see if the constitution lasts.',
          'Check Kui-Yue, Zuo-You, and Chang-Qu for medical luck, recovery, and which system to watch.',
          'Check Qing Yang, Huo-Ling, and Tuo Luo for "toughing it out" risks.',
          'If the palace is empty, borrow the opposite Parents Palace and triads — read genetics and constitution separately.',
          'Separate timing: ten-year Quan for peak fitness (watch injuries), yearly Quan for overconsumption, yearly Ji for mandatory checkups.'
        ]
      }
    ],
    enSidebar: [
      { href: '../../pages/mingbook-onepage.html', text: 'Cast Your Chart (Quick Chart)' },
      { href: './', text: 'English article index' },
      { href: '../ziwei-jieegong-huaquan.html', text: 'Read in Chinese' },
      { href: '../ziwei-four-transformations.html', text: 'Four Transformations topic page' },
      { href: '../ziwei-sanfang-sizheng.html', text: 'Triads and opposite palace' },
      { href: '../ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: 'What an empty palace really means' }
    ]
  },
  {
    slug: 'ziwei-qianyigong-huaquan',
    cnTitle: '紫微斗数迁移宫化权：在外强势，是能力还是压力',
    cnDesc: '迁移宫化权的人在外表现强势、有主见，适合外出发展。但化权在迁移也要看是"在外说了算"还是"在外压力大"，要和命宫对看。',
    enTitle: 'Travel Palace With Hua Quan: Strong on the Outside — Capable or Just Pressured?',
    enDesc: 'Hua Quan in the Travel Palace makes you assertive and capable away from home. But the Authority Star here can mean you lead outside or that the outside world pressures you — read it against the Life Palace.',
    category: '四化细读',
    cnH1: '紫微斗数迁移宫化权：在外强势，是能力还是压力',
    enH1: 'Travel Palace With Hua Quan: Strong on the Outside — Capable or Just Pressured?',
    cnLead: '迁移宫是命宫的对宫，看你"出门以后"的状态——在外发展、出差旅行、社交场合中的你。化权落在迁移宫，最直接的意思是：你在外面很强势。但这个强势有两种：一种是在外能扛事、说了算、别人服你；另一种是在外压力大、不得不强、回到家就垮。这两种要和命宫对看才能分清楚。',
    cnIntro2: '化权是掌控星。在迁移宫，它可能代表你适合外出发展——离乡背井反而有出息；也可能代表你在外面总是绷紧的，要维持一个"强人"的形象。关键是看：命宫能不能接住这个权。命宫强，迁移化权是"在外掌权"；命宫弱，迁移化权是"在外硬撑"。这篇把迁移宫化权的组合拆开讲。',
    cnSections: [
      {
        h: '迁移宫化权先看：外出发展是掌权还是受压',
        ps: [
          '迁移宫化权的第一层意思是"在外有掌控力"。但这个掌控力是主动还是被动，要看命宫。命宫有紫微、天府、武曲等强星，迁移宫化权是"如虎添翼"——你本身就强，出了门更能发挥。这种人适合外出发展、外派、创业，在外面比在家里更有出息。',
          '如果命宫主星偏柔（天同、天梁、太阴），迁移宫化权则是"被逼出来的强"。这种人在家可能很随和，但一出门就像换了个人——不得不强势、不得不争取。不是天生爱掌权，是环境逼的。这种人在外面能干，但回到家需要彻底放松，否则长期紧绷会出问题。',
          '迁移宫化权加禄存，是"在外能掌权又能得利"的组合。化权是位置，禄存是实利，这种人外出发展不光有面子还有里子。如果迁移宫化权但不见禄存，又见化忌，那是"在外有责任但没好处"——干活有你，分钱没你。'
        ]
      },
      {
        h: '迁移宫化权加吉星：在外有威望',
        ps: [
          '迁移宫化权加天魁、天钺，在外有贵人——这个贵人不是家里人，而是在外面认识的。可能是出差时遇到的客户、旅行中认识的朋友、或者外派时的上司。这种组合的人越动越有机会，适合经常出差或在外地发展。',
          '迁移宫化权加左辅、右弼，在外有人辅佐——到了新环境很快能建立团队，或者有下属愿意跟。这种组合适合外派管理、开拓新市场。但左右在迁移也主"外面的人帮你"，要注意区分谁是真帮忙谁是凑热闹。',
          '迁移宫化权加文昌、文曲，在外靠表达和专业能力建立权威。这种人适合在外地做培训、演讲、销售，或者靠写作、证书在外面立足。昌曲加化权在迁移，是"在外靠嘴和笔掌权"的组合。'
        ]
      },
      {
        h: '迁移宫化权加煞星：在外奔波且强势',
        ps: [
          '迁移宫化权加擎羊、火星，在外容易冲突——出差遇到麻烦、在外地跟人争执、开车有路怒。这种组合的人在外脾气急，容易因为太强势而得罪人。擎羊在迁移也主"在外有外伤风险"，出差旅行要注意安全。',
          '迁移宫化权加地空、地劫，在外的掌控力有空洞——可能职位听起来高但没实权，或者在外面看起来风光但实际没赚到钱。空劫在迁移也主"外出破财"，出差预算超支、在外地投资亏损。这种组合不适合在外地做大投资。',
          '迁移宫化权加陀罗，在外的事拖泥带水——外派时间延长、出差行程变动、在外地的项目迟迟不能收尾。陀罗在迁移也主"在外有慢性病"或者因为长期出差导致身体问题。如果迁移宫是空宫，要借对宫命宫的星曜来读——命宫的星曜直接决定你在外的状态，不能因为迁移宫空就判"不宜外出"。'
        ]
      },
      {
        h: '迁移宫化权在流年：外出、变动和升迁的年份',
        ps: [
          '迁移宫化权在大限流年怎么应，要分三种情况。',
          '<strong>第一种：大限迁移宫化权。</strong>这十年是"在外掌权"的十年——可能外派、移民、经常出差，或者在外地创业。这十年你的重心在外面，越动越有机会。但要注意家庭关系，人在外面时间长了，田宅宫和夫妻宫要同时看。',
          '<strong>第二种：流年化权飞入迁移宫。</strong>这一年在外有主导权——可能升职外派、出差谈成大单、或者在外地买房置产。流年权入迁移也主"这一年适合走出去"，不要窝在原地。但流年权是一年期的，如果这一年有外派机会，要确认是不是长期发展而不只是短期出差。',
          '<strong>第三种：流年化忌冲入迁移宫。</strong>这一年在外容易受阻——出差不顺、外派被拒、在外地遇到纠纷。化忌冲迁移也主"交通安全"，这一年出行要特别小心，不宜在这一年长途自驾或去危险地区。'
        ]
      },
      {
        h: '排盘后的使用顺序',
        ps: [
          '排盘看到迁移宫化权，建议按这个顺序读：',
        ],
        ol: [
          '先看命宫主星强弱，判断迁移化权是"在外掌权"还是"在外硬撑"。',
          '再看禄存是否来会，判断在外有没有实利。',
          '看魁钺、左右、昌曲，判断在外的贵人、团队和专业能力。',
          '检查擎羊、空劫、陀罗，找出在外的冲突、破财和拖延风险。',
          '迁移宫是空宫时，借对宫命宫和三方四正来读，命宫决定你在外的基本状态。',
          '大限流年分三种：大限权主外出发展期、流年权主走出去的年份、流年忌冲主外出受阻年。'
        ]
      }
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-qianyigong.html', text: '迁移宫怎么看' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: '本宫没有主星怎么读' }
    ],
    enLead: 'The Travel Palace sits opposite the Life Palace. It rules the version of you that shows up away from home — in travel, relocation, social situations outside your circle. When Hua Quan lands here, the direct reading is: you are strong on the outside. But that strength splits two ways: someone who genuinely leads and commands respect away from home, or someone who has to project strength because the outside world demands it — and collapses when they get home.',
    enIntro2: 'Hua Quan is the star of control. In the Travel Palace it can mean you thrive away from your birthplace, or that you live in a constant state of tension when you\'re out. The key is whether your Life Palace can support the Quan. A strong Life Palace with Travel Palace Hua Quan means you lead outside. A soft Life Palace means you perform strength outside and pay for it privately.',
    enSections: [
      {
        h: 'First Question: Do You Lead Outside, or Just Survive It?',
        ps: [
          'The first layer is "control in the outside world." Whether it\'s active or reactive depends on the Life Palace. If the Life Palace has strong stars like Zi Wei, Tian Fu, or Wu Qu, Travel Palace Hua Quan is a force multiplier — you\'re already strong, and outside you\'re even stronger. These people thrive on relocation, travel, and building away from home.',
          'If the Life Palace has softer stars (Tian Tong, Tian Liang, Tai Yin), Travel Palace Hua Quan is "strength forged by pressure." They may be easygoing at home but switch on when they walk out the door — not because they love control, but because the environment demands it. They perform outside but need complete recovery at home.',
          'Hua Quan plus Lu Cun in the Travel Palace is the "leads and profits" pattern — authority plus tangible reward. If Hua Quan sits without Lu Cun and Hua Ji appears, it\'s "responsibility without reward" — you do the work but don\'t share the gain.'
        ]
      },
      {
        h: 'With Supporting Stars: Respect and Reach Outside',
        ps: [
          'Hua Quan plus Tian Kui or Tian Yue means benefactors outside your normal circle — a client met on a trip, a friend made while traveling, a boss at an overseas posting. These people do better the more they move.',
          'Hua Quan plus Zuo Fu or You Bi means followers outside — you build teams quickly in new environments, or subordinates who stay loyal. Good for opening new markets or managing remote offices.',
          'Hua Quan plus Wen Chang or Wen Qu builds authority through words and expertise — teaching, speaking, sales, or credentials earned away from home. This is "leading outside through what you know and how you say it."'
        ]
      },
      {
        h: 'With Challenging Stars: Driven and Abrasive on the Road',
        ps: [
          'Hua Quan plus Qing Yang or Huo Xing brings conflict outside — travel delays that turn into arguments, disputes in unfamiliar places, road rage. Qing Yang in the Travel Palace also signals physical injury risk away from home; pay attention to safety.',
          'Hua Quan plus Di Kong or Di Jie gives hollow authority — a title without power, impressive appearances without profit. Kong-Jie here also means losing money away from home: blown travel budgets, bad investments in other cities. Don\'t commit big money far from home with this pattern.',
          'Hua Quan plus Tuo Luo drags out outside matters — extended postings, delayed trips, projects that won\'t close. Tuo Luo here can also mean chronic health issues from constant travel. If the Travel Palace is empty, borrow the opposite Life Palace stars — your core self directly determines how you fare away from home, and an empty Travel Palace never means "don\'t travel."'
        ]
      },
      {
        h: 'In Timing: Years for Moving, Promotion, and Travel Risk',
        ps: [
          'Three timing triggers.',
          '<strong>First: a ten-year cycle brings Hua Quan to the Travel Palace.</strong> This decade puts your center of gravity outside — relocation, frequent travel, building in another city. Opportunity increases with movement. But watch the Property and Spouse palaces; long absences have a cost.',
          '<strong>Second: a yearly Hua Quan flies into the Travel Palace.</strong> This year you lead outside — a promotion with travel, a big deal closed on the road, property bought in another city. It\'s a year to get out, not stay put. But confirm whether the opportunity is long-term or just a trip.',
          '<strong>Third: a yearly Hua Ji opposes or enters the Travel Palace.</strong> This year brings obstacles outside — trips go wrong, postings fall through, disputes away from home. It also flags travel safety. Be cautious on long drives and avoid risky destinations this year.'
        ]
      },
      {
        h: 'Reading Order After You Cast the Chart',
        ps: [
          'When you find Hua Quan in the Travel Palace, read it in this order:',
        ],
        ol: [
          'Check the Life Palace strength to see if you lead outside or just survive it.',
          'Look for Lu Cun to see if the outside authority comes with real benefit.',
          'Check Kui-Yue, Zuo-You, and Chang-Qu for outside benefactors, teams, and expertise.',
          'Check Qing Yang, Kong-Jie, and Tuo Luo for conflict, loss, and delay risks.',
          'If the palace is empty, borrow the opposite Life Palace and triads — your core self sets the baseline for how you do away from home.',
          'Separate timing: ten-year Quan for building outside, yearly Quan for a year to move, yearly Ji for obstacles and travel caution.'
        ]
      }
    ],
    enSidebar: [
      { href: '../../pages/mingbook-onepage.html', text: 'Cast Your Chart (Quick Chart)' },
      { href: './', text: 'English article index' },
      { href: '../ziwei-qianyigong-huaquan.html', text: 'Read in Chinese' },
      { href: '../ziwei-four-transformations.html', text: 'Four Transformations topic page' },
      { href: '../ziwei-sanfang-sizheng.html', text: 'Triads and opposite palace' },
      { href: '../ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: 'What an empty palace really means' }
    ]
  }
];

function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n'); }

function buildCN(a) {
  let sectionsHtml = '';
  for (const s of a.cnSections) {
    sectionsHtml += `        <h2 id="${s.h ? 'section-' + (a.cnSections.indexOf(s)+1) : ''}">${s.h}</h2>\n`;
    for (const p of s.ps) {
      if (p === '排盘看到田宅宫化禄，建议按这个顺序读：' || p === '排盘看到福德宫化禄，建议按这个顺序读：' || p === '排盘看到兄弟宫化权，建议按这个顺序读：' || p === '排盘看到疾厄宫化权，建议按这个顺序读：' || p === '排盘看到迁移宫化权，建议按这个顺序读：') {
        sectionsHtml += `        <p>${p}</p>\n`;
      } else {
        sectionsHtml += `        <p>${p}</p>\n`;
      }
    }
    if (s.ol) {
      sectionsHtml += `        <ol>\n`;
      for (const item of s.ol) {
        sectionsHtml += `          <li>${item}</li>\n`;
      }
      sectionsHtml += `        </ol>\n`;
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
  <title>${a.cnTitle} | 学习紫微</title>
  <meta name="description" content="${a.cnDesc}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:title" content="${a.cnTitle}">
  <meta property="og:description" content="${a.cnDesc}">
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
  "articleSection": "${a.category}",
  "about": [
    "紫微斗数",
    "四化细读",
    "${a.cnH1.split('：')[0].replace('紫微斗数','')}",
    "${a.slug.includes('hualu') ? '化禄' : '化权'}"
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
      "name": "四化科权禄忌",
      "item": "https://yuetianai.com/articles/ziwei-four-transformations.html"
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
          <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="ziwei-four-transformations.html">四化科权禄忌</a></nav>
          <h1>${a.cnH1}</h1>
          <p class="detail-subtitle">${a.cnDesc}</p>
          <p class="article-meta"><span>${a.category}</span><span><time datetime="${date}">${dateDisplay}</time></span></p>
        </div>
        <div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${a.cnLead}</p>
        <p>${a.cnIntro2}</p>
${sectionsHtml}      </article>
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
  for (const s of a.enSections) {
    sectionsHtml += `        <h2 id="section-${a.enSections.indexOf(s)+1}">${s.h}</h2>\n`;
    for (const p of s.ps) {
      sectionsHtml += `        <p>${p}</p>\n`;
    }
    if (s.ol) {
      sectionsHtml += `        <ol>\n`;
      for (const item of s.ol) {
        sectionsHtml += `          <li>${item}</li>\n`;
      }
      sectionsHtml += `        </ol>\n`;
    }
  }

  let sidebarHtml = '';
  for (const link of a.enSidebar) {
    sidebarHtml += `        <a class="card-link" href="${link.href}">${link.text}</a>\n`;
  }

  const aboutItems = a.slug.includes('hualu')
    ? ['"Zi Wei Dou Shu"', '"Chinese astrology chart"', `"${a.enH1.split(':')[0].replace('With Hua Lu','').trim()}"`, '"Hua Lu"']
    : ['"Zi Wei Dou Shu"', '"Chinese astrology chart"', `"${a.enH1.split(':')[0].replace('With Hua Quan','').trim()}"`, '"Hua Quan"'];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${a.enTitle} | Zi Wei Dou Shu</title>
  <meta name="description" content="${a.enDesc}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="en" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <link rel="alternate" hreflang="zh-CN" href="https://yuetianai.com/articles/${a.slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://yuetianai.com/articles/en/${a.slug}.html">
  <meta property="og:title" content="${a.enTitle}">
  <meta property="og:description" content="${a.enDesc}">
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
      <a class="brand" href="../../index.html" aria-label="YuetianAI home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a>
      <nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn</a><a href="../../pages/mingbook-onepage.html">Quick Chart</a><a href="../${a.slug}.html">Chinese</a></nav>
    </div>
  </header>
  <main class="article-shell article-detail">
    <section class="detail-hero">
      <div class="container detail-hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>Four Transformations</span></nav>
          <h1>${a.enH1}</h1>
          <p class="detail-subtitle">${a.enDesc}</p>
          <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${date}">${dateDisplay}</time></span></p>
        </div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${a.enLead}</p>
        <p>${a.enIntro2}</p>
${sectionsHtml}      </article>
      <aside class="side-panel detail-rail" aria-label="Related links">
        <h2>Read Next</h2>
${sidebarHtml}      </aside>
    </div>
    <div class="container article-bottom-link">
      <span>Cast your own chart and see where the stars land in your palaces.</span>
      <a href="../../pages/mingbook-onepage.html">Quick Chart →</a>
    </div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">Yue ICP 2026055337-1</a>　<span>© 2026 YuetianAI. All Rights Reserved. Powered By Yuetian Studio</span>　</div></footer>
</body>
</html>`;
}

for (const a of articles) {
  const cn = buildCN(a);
  const en = buildEN(a);
  fs.writeFileSync(`C:/Users/1/Desktop/doubao-work/articles/${a.slug}.html`, cn.replace(/\r\n/g, '\n'), 'utf8');
  fs.writeFileSync(`C:/Users/1/Desktop/doubao-work/articles/en/${a.slug}.html`, en.replace(/\r\n/g, '\n'), 'utf8');
  console.log(`Created: ${a.slug} (CN: ${cn.length} bytes, EN: ${en.length} bytes)`);
}
