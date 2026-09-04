const fs = require('fs');
const path = require('path');
const date = '2026-08-18T12:15:00+08:00';
function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

const articles = [
  {
    slug: 'ziwei-geju-zifu-tonggong',
    cnTitle: '紫微斗数紫府同宫格：紫微天府同坐，有位置也有资源，但要防孤君',
    enTitle: 'Zi Wei and Tian Fu in the Same Palace: Position and Resources, but Guard Against a Lonely Ruler',
    cnDesc: '紫府同宫是紫微和天府同坐一宫的格局，主地位高、资源足、管理能力强。但如果没有辅星配合，容易变成「孤君」——有位子但没人帮。',
    enDesc: 'Zi Fu Tong Gong is when Zi Wei and Tian Fu share a palace, ruling high status, abundant resources, and strong management. Without auxiliary stars, it can become a "lonely ruler" — position without support.',
    cnLead: '紫府同宫是紫微斗数里最「有架子」的格局之一。紫微是帝星，天府是财库星，两颗星坐在一起，就像皇帝坐在金库里——既有地位又有钱。命宫有紫府同宫的人，天生有领导气质，做事有规划，不喜欢被人管。但这个格局最大的问题是「孤」——紫微和天府都是「老大」性格，谁也不服谁，容易变成自己说了算、听不进别人意见。',
    cnIntro2: '紫府同宫只出现在寅宫和申宫。紫微属阴土，天府属阳土，两颗都是土性星，聚在一起土气极重——稳重、保守、有积蓄、但也固执。紫府同宫跟「紫府朝垣」不同：同宫是两颗星坐在一起，朝垣是紫微在命宫、天府在三方来朝。',
    cnSections: [
      { h: '成格条件', ps: [
        '紫微和天府必须同坐一宫，只在寅宫和申宫出现。',
        '命宫在寅或申，且紫微天府同坐命宫，才是标准的紫府同宫格。',
        '需要左辅右弼、文昌文曲、天魁天钺等辅星配合，格局才完整。如果没有辅星，就是「紫府无辅」，孤君之象。',
        '加煞星（擎羊、陀罗、火星、铃星）会让格局打折——帝星加煞，容易刚愎自用；天府加煞，容易守财奴。'
      ]},
      { h: '紫府同宫的性格', ps: [
        '天生有领导欲和管理能力，喜欢做决策者，不喜欢被人指挥。',
        '稳重、有规划、善于理财和积累资源，不喜欢冒险。',
        '自尊心强，好面子，不愿意在别人面前示弱。',
        '如果辅星多，是「明君」——能听意见、善用人；如果辅星少，是「暴君」——独断专行、听不进劝。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：有地位有资源、适合做管理或自己当老板。但要学会放权。',
        '财帛宫：财运好、善于理财、能积累财富。但可能太保守错过机会。',
        '官禄宫：事业上有地位、适合做管理层或体制内。但要防官僚主义。',
        '夫妻宫：配偶条件好、有能力，但两个人都强势，容易争主导权。',
        '田宅宫：家境好、有房产、家庭有积累。'
      ]},
      { h: '紫府同宫的陷阱', ps: [
        '孤君——太喜欢自己说了算，不愿意分权，结果什么事都自己扛，累得要死还做不大。',
        '保守——天府守财，紫微稳重，两颗星在一起可能过于保守，不敢冒险，错过大机会。',
        '面子——紫府同宫的人好面子，可能为了维持「体面」而做不划算的决定。',
        '固执——土性太重，不容易改变想法，在快速变化的环境中可能跟不上。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到紫府同宫，按这个顺序读：'], ol: [
        '先看在哪个宫——命宫最好，财帛官禄次之。',
        '看有没有左辅右弼——有辅星是明君，没辅星是孤君。',
        '看有没有煞星——煞星会让格局打折，刚愎自用或守财奴。',
        '看三方四正——有没有化禄化权来增强格局。',
        '紫府同宫的人要学会「放权」和「听意见」，这是格局能否发挥的关键。',
        '问自己：你是在「用资源做大事」还是「守着资源不敢动」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-tianfu-zuoming.html', text: '天府坐命' },
      { href: 'ziwei-zuofu-youbi.html', text: '左辅右弼' },
      { href: 'ziwei-geju-shapol.html', text: '杀破狼格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Zi Fu Tong Gong is one of the most "imposing" patterns. Zi Wei is the emperor star, Tian Fu is the treasury star — together they\'re like an emperor sitting in his vault: status plus money. People with this in Life have natural leadership, plan well, and hate being told what to do. But the biggest problem is loneliness — both are "alpha" personalities, neither submits, and you may end up calling all the shots without listening to anyone.',
    enIntro2: 'Zi Fu Tong Gong only appears in Yin and Shen palaces. Both are Earth stars — Zi Wei Yin Earth, Tian Fu Yang Earth — making the Earth element extremely strong: steady, conservative, accumulative, but also stubborn. It differs from "Zi Fu Chao Yuan" where Zi Wei is in Life and Tian Fu comes from the triple direction.',
    enSections: [
      { h: 'Conditions for the Pattern', ps: [
        'Zi Wei and Tian Fu must share one palace, only in Yin or Shen.',
        'Life palace in Yin or Shen with both stars is the standard pattern.',
        'Needs Zuo Fu/You Bi, Wen Chang/Wen Qu, Tian Kui/Tian Yue to be complete. Without them, it\'s "Zi Fu without assistants" — a lonely ruler.',
        'Malefics (Qing Yang, Tuo Luo, Huo Xing, Ling Xing) reduce the pattern — emperor plus malefics = tyrannical; Tian Fu plus malefics = miser.'
      ]},
      { h: 'Personality', ps: [
        'Natural leadership and management ability, likes being the decision-maker, hates being directed.',
        'Steady, planned, good at finance and accumulating resources, dislikes risk.',
        'Strong pride,面子-conscious, won\'t show weakness in front of others.',
        'With many assistants: a "wise ruler" — listens and delegates. With few: a "tyrant" — dictatorial, won\'t take advice.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: status and resources, suited to management or entrepreneurship. Learn to delegate.',
        'Wealth: good finances, good at saving and accumulating. May be too conservative and miss opportunities.',
        'Career: status at work, suited to management or institutions. Guard against bureaucracy.',
        'Spouse: partner has good conditions and ability, but both are strong-willed, may fight for control.',
        'Property: good family background, real estate, family accumulation.'
      ]},
      { h: 'The Trap', ps: [
        'Lonely ruler — too fond of calling all the shots, won\'t delegate, ends up exhausted and unable to scale.',
        'Conservative — Tian Fu saves, Zi Wei is steady; together they may be too cautious, missing big opportunities.',
        'Face — may make bad decisions to maintain "dignity."',
        'Stubborn — too much Earth element, hard to change ideas, may fall behind in fast-changing environments.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Zi Fu Tong Gong:'], ol: [
        'Which palace — Life is best, Wealth/Career second.',
        'Check Zuo Fu/You Bi — with assistants = wise ruler; without = lonely ruler.',
        'Check malefics — they reduce the pattern, leading to tyranny or miserliness.',
        'Check triple directions — Hua Lu/Hua Quan enhance the pattern.',
        'The key to making this pattern work: learn to delegate and listen.',
        'Are you "using resources for big things" or "hoarding resources and not acting"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-tianfu-zuoming.html', text: 'Tian Fu in Life' },
      { href: 'ziwei-zuofu-youbi.html', text: 'Zuo Fu & You Bi' },
      { href: 'ziwei-geju-shapol.html', text: 'Sha Po Lang' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-fuxiang-chaoyuan',
    cnTitle: '紫微斗数府相朝垣格：天府天相来朝，稳中有贵的格局',
    enTitle: 'Fu Xiang Chao Yuan: Tian Fu and Tian Xiang Facing the Palace',
    cnDesc: '府相朝垣是命宫有紫微或七杀，三方有天府天相来朝的格局。主稳重、有贵人、事业稳，但要防过于依赖体制。',
    enDesc: 'Fu Xiang Chao Yuan is when Life has Zi Wei or Qi Sha, with Tian Fu and Tian Xiang coming from the triple direction. It rules steadiness, benefactors, and stable career, but guard against over-reliance on institutions.',
    cnLead: '府相朝垣是紫微斗数里最「稳」的格局之一。天府是财库，天相是印星——一个管钱，一个管印，两颗星从三方面来朝你的命宫，就像你身边既有财务大臣又有掌印大臣。命宫有府相朝垣的人，一生不缺贵人，事业稳扎稳打，适合在大机构或体制内发展。但这个格局的人也容易「太稳」——稳到不敢冒险，稳到一辈子在一个地方待着。',
    cnIntro2: '府相朝垣的成格条件：命宫在寅或申有紫微（紫府同宫的对宫方向），或命宫在寅申有七杀，三方有天府和天相。天府和天相永远在三合相会，所以只要命宫在特定位置，三方自然会有府相。府相朝垣跟紫府同宫不同：同宫是两颗星坐在一起，朝垣是两颗星从三方面来支持你。',
    cnSections: [
      { h: '成格条件', ps: [
        '命宫在寅或申，主星为紫微或七杀。',
        '三方四正中有天府和天相来朝。',
        '加左辅右弼、天魁天钺等吉星，格局更完整。',
        '加煞星会让格局打折——天府加煞守财奴，天相加煞印星被污。'
      ]},
      { h: '府相朝垣的性格', ps: [
        '稳重、可靠、有责任感，别人愿意把事情交给你。',
        '善于协调和管理，有财务头脑和制度意识。',
        '不喜欢冒险，偏好稳定和可预期的环境。',
        '有贵人运，关键时刻总有人帮你一把。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：稳重可靠、有贵人、适合大机构或体制内。',
        '官禄宫：事业稳定、容易在大公司或政府部门发展。',
        '财帛宫：财运稳、善于理财、不缺钱但也不会暴富。',
        '夫妻宫：配偶稳重可靠、婚姻稳定。',
        '迁移宫：在外有贵人、适合在大平台发展。'
      ]},
      { h: '府相朝垣的陷阱', ps: [
        '太稳——过于依赖体制和平台，离开平台可能什么都不是。',
        '不敢冒险——机会来临时犹豫，等你想清楚了机会已经没了。',
        '守旧——天府天相都是保守星，可能不愿意改变，在变化中落后。',
        '依赖贵人——习惯了有人帮，自己独立解决问题的能力可能不足。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到府相朝垣，按这个顺序读：'], ol: [
        '先看命宫主星是紫微还是七杀——紫微偏管理，七杀偏执行。',
        '看三方有没有煞星——煞星会让府相的力量打折。',
        '看有没有吉星——吉星让贵人运更强。',
        '府相朝垣的人要学会「在稳定中求变化」，不要一辈子待在舒适区。',
        '也要培养独立能力，不要过度依赖平台和贵人。',
        '问自己：你的「稳」是「根基扎实」还是「不敢改变」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-geju-zifu-tonggong.html', text: '紫府同宫格' },
      { href: 'ziwei-tianfu-zuoming.html', text: '天府坐命' },
      { href: 'ziwei-tianxiang-zuoming.html', text: '天相坐命' },
      { href: 'ziwei-qisha-zuoming.html', text: '七杀坐命' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Fu Xiang Chao Yuan is one of the steadiest patterns. Tian Fu is the treasury, Tian Xiang is the seal star — one manages money, one holds the seal. When they face your Life palace from the triple direction, it\'s like having both a finance minister and a seal-keeper by your side. People with this pattern never lack benefactors, build careers steadily, and suit large institutions. But they can become too steady — so steady they never take risks, so steady they stay in one place their whole life.',
    enIntro2: 'Conditions: Life in Yin or Shen with Zi Wei or Qi Sha, and Tian Fu/Tian Xiang in the triple direction. Since Tian Fu and Tian Xiang always meet in triple combination, certain Life positions automatically get this pattern. Unlike Zi Fu Tong Gong (both stars in the same palace), here they support you from the sides.',
    enSections: [
      { h: 'Conditions', ps: [
        'Life palace in Yin or Shen, main star Zi Wei or Qi Sha.',
        'Tian Fu and Tian Xiang appear in the triple direction.',
        'With Zuo Fu/You Bi, Tian Kui/Tian Yue, the pattern is stronger.',
        'Malefics reduce it — Tian Fu plus malefics = miser; Tian Xiang plus malefics = tainted seal.'
      ]},
      { h: 'Personality', ps: [
        'Steady, reliable, responsible — others trust you with things.',
        'Good at coordination and management, financial sense and institutional awareness.',
        'Dislikes risk, prefers stable and predictable environments.',
        'Benefactor luck — someone always helps at critical moments.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: steady and reliable, benefactors, suited to large institutions.',
        'Career: stable career, easy to develop in big companies or government.',
        'Wealth: steady finances, good at saving, never short but not super rich.',
        'Spouse: partner is steady and reliable, stable marriage.',
        'Travel: benefactors away from home, suited to big platforms.'
      ]},
      { h: 'The Trap', ps: [
        'Too steady — over-reliant on institutions and platforms; may be nothing without the platform.',
        'Afraid of risk — hesitates when opportunities come, and by the time you decide, they\'re gone.',
        'Conservative — both stars are cautious, may resist change and fall behind.',
        'Dependent on benefactors — used to being helped, independent problem-solving may be weak.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Fu Xiang Chao Yuan:'], ol: [
        'Check if Life main star is Zi Wei (management) or Qi Sha (execution).',
        'Check malefics in triple direction — they reduce Fu Xiang\'s power.',
        'Check auspicious stars — they strengthen benefactor luck.',
        'Learn to "seek change within stability" — don\'t stay in the comfort zone forever.',
        'Build independent ability, don\'t over-rely on platforms and benefactors.',
        'Is your "steadiness" solid foundation or fear of change?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-geju-zifu-tonggong.html', text: 'Zi Fu Tong Gong' },
      { href: 'ziwei-tianfu-zuoming.html', text: 'Tian Fu in Life' },
      { href: 'ziwei-tianxiang-zuoming.html', text: 'Tian Xiang in Life' },
      { href: 'ziwei-qisha-zuoming.html', text: 'Qi Sha in Life' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-jiyue-tongliang',
    cnTitle: '紫微斗数机月同梁格：天机太阴同梁，聪明稳重的幕僚型格局',
    enTitle: 'Ji Yue Tong Liang: Tian Ji, Tai Yin, and Tian Liang — The Smart, Steady Advisor Pattern',
    cnDesc: '机月同梁是天机、太阴、天梁三颗星在三方四正相会的格局，主聪明、稳重、善于谋划。适合做幕僚、顾问、专业人士，但要防想太多做太少。',
    enDesc: 'Ji Yue Tong Liang is when Tian Ji, Tai Yin, and Tian Liang meet in the triple direction, ruling intelligence, steadiness, and strategy. Suited to advisors, consultants, and professionals, but guard against overthinking and under-doing.',
    cnLead: '机月同梁是紫微斗数里最「聪明」的格局之一。天机主智慧和变化，太阴主细腻和内敛，天梁主稳重和原则——三颗星凑在一起，就是一个「又聪明又稳重又有原则」的人。命宫有机月同梁的人，适合做军师、顾问、幕僚、专业人士——你不是冲在最前面的人，但你是那个在后面出谋划策的人。但这个格局最大的问题是「想太多」——你可能把所有可能性都想遍了，就是没行动。',
    cnIntro2: '机月同梁的成格条件：命宫在寅、申、巳、亥，三方有天机、太阴、天梁三颗星。这三颗星的组合是「智+柔+稳」——天机给你智慧，太阴给你细腻，天梁给你原则。机月同梁跟杀破狼是完全相反的两种格局：杀破狼是「行动派」，机月同梁是「思考派」。',
    cnSections: [
      { h: '成格条件', ps: [
        '命宫在寅、申、巳、亥，三方四正中有天机、太阴、天梁三颗星。',
        '加文昌文曲——智慧加表达，适合做学问或专业。',
        '加天魁天钺——有贵人提携，适合在专业领域发展。',
        '加煞星会让格局打折——天机加煞想太多，太阴加煞太敏感，天梁加煞太固执。'
      ]},
      { h: '机月同梁的性格', ps: [
        '聪明、细腻、有洞察力，善于分析和谋划。',
        '稳重、有原则、不喜欢冒险，偏好深思熟虑后再行动。',
        '内敛、低调，不喜欢出风头，适合做幕后工作。',
        '可能过于谨慎——想得多做得少，错过行动的最佳时机。'
      ]},
      { h: '适合的职业', ps: [
        '幕僚、顾问、军师——为决策者提供分析和建议。',
        '专业人士——律师、医生、会计师、学者、研究员。',
        '策划、分析、研究类工作——需要深度思考和细致分析。',
        '不适合做需要快速决策和大胆行动的工作——创业、销售、前线指挥。'
      ]},
      { h: '机月同梁的陷阱', ps: [
        '想太多——把所有可能性都分析遍了，就是不行动，等你想清楚了机会已经没了。',
        '太谨慎——不愿意冒险，可能一辈子在一个安全的位置上，错过了更大的发展。',
        '敏感——太阴的细腻加上天机的多虑，容易想太多、焦虑、内耗。',
        '固执——天梁的原则性可能变成固执，不愿意接受新观点。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到机月同梁，按这个顺序读：'], ol: [
        '先看命宫主星是什么——天机偏智，太阴偏柔，天梁偏稳。',
        '看有没有文昌文曲——智慧加表达，适合做学问。',
        '看有没有煞星——煞星会让聪明变成多虑。',
        '机月同梁的人要学会「先行动再完善」，不要等想清楚了再做。',
        '也要学会「接受不完美」——很多时候60分就可以出发了。',
        '问自己：你是在「深思熟虑」还是「拖延逃避」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-tianji-zuoming.html', text: '天机坐命' },
      { href: 'ziwei-taiyin-zuoming.html', text: '太阴坐命' },
      { href: 'ziwei-tianliang-zuoming.html', text: '天梁坐命' },
      { href: 'ziwei-geju-shapol.html', text: '杀破狼格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Ji Yue Tong Liang is one of the smartest patterns. Tian Ji rules wisdom and change, Tai Yin rules sensitivity and introspection, Tian Liang rules steadiness and principle — together they make someone "smart, steady, and principled." People with this pattern suit strategists, advisors, consultants, professionals — not the one charging ahead, but the one planning behind the scenes. The biggest problem: overthinking — you may analyze every possibility but never act.',
    enIntro2: 'Conditions: Life in Yin, Shen, Si, or Hai, with Tian Ji, Tai Yin, Tian Liang in the triple direction. This combination is "wisdom + softness + steadiness." It\'s the opposite of Sha Po Lang: Sha Po Lang is action-oriented, Ji Yue Tong Liang is thought-oriented.',
    enSections: [
      { h: 'Conditions', ps: [
        'Life in Yin, Shen, Si, or Hai, with Tian Ji, Tai Yin, Tian Liang in triple direction.',
        'With Wen Chang/Wen Qu — intelligence plus expression, suited to academia or professions.',
        'With Tian Kui/Tian Yue — benefactor support, suited to professional fields.',
        'Malefics reduce the pattern — Tian Ji plus malefics = overthinking; Tai Yin plus malefics = too sensitive; Tian Liang plus malefics = too stubborn.'
      ]},
      { h: 'Personality', ps: [
        'Smart, sensitive, insightful, good at analysis and strategy.',
        'Steady, principled, dislikes risk, prefers to think carefully before acting.',
        'Introverted, low-key, dislikes the spotlight, suited to behind-the-scenes work.',
        'May be too cautious — thinks much, does little, misses the best timing.'
      ]},
      { h: 'Suitable Careers', ps: [
        'Advisor, consultant, strategist — providing analysis and advice to decision-makers.',
        'Professional — lawyer, doctor, accountant, scholar, researcher.',
        'Planning, analysis, research — work requiring deep thought and careful analysis.',
        'Not suited to jobs requiring quick decisions and bold action — entrepreneurship, sales, frontline command.'
      ]},
      { h: 'The Trap', ps: [
        'Overthinking — analyzes every possibility but never acts; by the time you\'re ready, the opportunity is gone.',
        'Too cautious — unwilling to take risks, may stay in a safe position forever, missing bigger growth.',
        'Sensitive — Tai Yin\'s sensitivity plus Tian Ji\'s overthinking leads to anxiety and mental friction.',
        'Stubborn — Tian Liang\'s principles may become rigidity, unwilling to accept new ideas.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Ji Yue Tong Liang:'], ol: [
        'Check the Life main star — Tian Ji (wisdom), Tai Yin (softness), or Tian Liang (steadiness).',
        'Check Wen Chang/Wen Qu — intelligence plus expression, suited to academia.',
        'Check malefics — they turn intelligence into overthinking.',
        'Learn to "act first, refine later" — don\'t wait until everything is clear.',
        'Learn to accept imperfection — often 60% is enough to start.',
        'Are you "thinking carefully" or "procrastinating"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-tianji-zuoming.html', text: 'Tian Ji in Life' },
      { href: 'ziwei-taiyin-zuoming.html', text: 'Tai Yin in Life' },
      { href: 'ziwei-tianliang-zuoming.html', text: 'Tian Liang in Life' },
      { href: 'ziwei-geju-shapol.html', text: 'Sha Po Lang' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-shapol',
    cnTitle: '紫微斗数杀破狼格：七杀破军贪狼，人生大起大落的开创型格局',
    enTitle: 'Sha Po Lang: Qi Sha, Po Jun, and Tan Lang — The Pioneering Pattern of Great Ups and Downs',
    cnDesc: '杀破狼是七杀、破军、贪狼三颗星在三方四正相会的格局，主开创、变化、大起大落。命宫有杀破狼的人一生变动多，但也最容易在变革中闯出一片天。',
    enDesc: 'Sha Po Lang is when Qi Sha, Po Jun, and Tan Lang meet in the triple direction, ruling pioneering, change, and great ups and downs. People with it experience many changes but are most likely to break through in times of transformation.',
    cnLead: '杀破狼是紫微斗数里最「折腾」的格局。七杀是将星，破军是耗星，贪狼是欲望星——三颗星凑在一起，就是一个「敢打敢拼、不断折腾、永远在变」的人。命宫有杀破狼的人，一生大起大落，年轻时可能换好几份工作、搬好几次家、谈好几段恋爱。但也正是这种「折腾」，让你在别人不敢动的时候，你已经闯出了一片天。',
    cnIntro2: '杀破狼的成格条件：命宫在寅、申、巳、亥，三方有七杀、破军、贪狼三颗星。这三颗星永远在三合相会，所以命宫在这四个位置的人，三方自然会有杀破狼。杀破狼跟机月同梁是完全相反的：机月同梁是「思考派」，杀破狼是「行动派」；机月同梁求稳，杀破狼求变。',
    cnSections: [
      { h: '成格条件', ps: [
        '命宫在寅、申、巳、亥，三方四正中有七杀、破军、贪狼三颗星。',
        '加化禄化权——行动有方向和资源，不是瞎折腾。',
        '加左辅右弼——有人帮你收拾残局，不会一个人扛。',
        '加煞星——杀破狼本来就动，加煞星更冲，容易出意外或冲突。'
      ]},
      { h: '杀破狼的性格', ps: [
        '敢闯敢拼、行动力强、不喜欢一成不变。',
        '有开创精神，适合在新领域、新行业、新环境中发展。',
        '人生变动多——工作、感情、居住地都可能频繁变化。',
        '大起大落——好的时候非常好，差的时候非常差，没有中间状态。'
      ]},
      { h: '三颗星的分工', ps: [
        '七杀——「打」的力量，主开创、冲锋、竞争。七杀是将军，负责攻城略地。',
        '破军——「破」的力量，主破坏、变革、推陈出新。破军是先锋，负责打破旧秩序。',
        '贪狼——「欲」的力量，主欲望、享受、多才多艺。贪狼是动机，负责告诉你为什么要打。',
        '三颗星配合：七杀给你勇气，破军给你变革力，贪狼给你欲望和方向。缺了任何一颗，格局都不完整。'
      ]},
      { h: '杀破狼的陷阱', ps: [
        '太冲动——行动太快，没想清楚就做，容易出错或后悔。',
        '不持久——什么都想尝试，但什么都做不长久，可能一事无成。',
        '大起大落——人生波动大，心理素质不好的人可能承受不住。',
        '人际关系——杀破狼的人太直接，容易得罪人，要注意沟通方式。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到杀破狼，按这个顺序读：'], ol: [
        '先看命宫主星是七杀、破军还是贪狼——七杀偏打，破军偏破，贪狼偏欲。',
        '看有没有化禄化权——有方向的行动才是开创，没方向的行动是瞎折腾。',
        '看有没有煞星——煞星让杀破狼更冲，要防意外和冲突。',
        '杀破狼的人要学会「在变化中找方向」，不要为了变而变。',
        '也要学会「坚持」——有些事情需要熬，不能一遇到困难就换。',
        '问自己：你的「折腾」是「开创」还是「逃避」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-qisha-zuoming.html', text: '七杀坐命' },
      { href: 'ziwei-pojun-zuoming.html', text: '破军坐命' },
      { href: 'ziwei-tanlang-zuoming.html', text: '贪狼坐命' },
      { href: 'ziwei-geju-jiyue-tongliang.html', text: '机月同梁格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Sha Po Lang is the most "turbulent" pattern. Qi Sha is the general star, Po Jun is the耗 star, Tan Lang is the desire star — together they make someone "bold, restless, always changing." People with it experience great ups and downs: multiple jobs, moves, relationships when young. But it\'s this restlessness that lets you break through when others dare not move.',
    enIntro2: 'Conditions: Life in Yin, Shen, Si, or Hai, with Qi Sha, Po Jun, Tan Lang in the triple direction. These three always meet in triple combination, so Life in these four positions automatically gets Sha Po Lang. It\'s the opposite of Ji Yue Tong Liang: one is action, the other thought; one seeks change, the other stability.',
    enSections: [
      { h: 'Conditions', ps: [
        'Life in Yin, Shen, Si, or Hai, with Qi Sha, Po Jun, Tan Lang in triple direction.',
        'With Hua Lu/Hua Quan — action has direction and resources, not random折腾.',
        'With Zuo Fu/You Bi — people help clean up, you don\'t carry everything alone.',
        'With malefics — Sha Po Lang is already active; malefics make it more impulsive, prone to accidents or conflict.'
      ]},
      { h: 'Personality', ps: [
        'Bold and competitive, strong action, hates routine.',
        'Pioneering spirit, suited to new fields, new industries, new environments.',
        'Many life changes — work, relationships, residence may change frequently.',
        'Great ups and downs — very high highs, very low lows, no middle ground.'
      ]},
      { h: 'The Three Stars\' Roles', ps: [
        'Qi Sha — the "fighting" force, ruling pioneering, charging, competition. The general who conquers.',
        'Po Jun — the "breaking" force, ruling destruction, transformation, innovation. The vanguard who breaks old order.',
        'Tan Lang — the "desire" force, ruling wants, enjoyment, versatility. The motivation that tells you why to fight.',
        'Together: Qi Sha gives courage, Po Jun gives transformative power, Tan Lang gives desire and direction. Missing any one makes the pattern incomplete.'
      ]},
      { h: 'The Trap', ps: [
        'Too impulsive — acts too fast, does things without thinking, prone to mistakes and regret.',
        'Not persistent — wants to try everything but sticks with nothing, may achieve nothing.',
        'Great ups and downs — life volatility is high, those with weak mental resilience may not cope.',
        'Relationships — too direct, easily offends people, watch communication style.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Sha Po Lang:'], ol: [
        'Check Life main star — Qi Sha (fighting), Po Jun (breaking), or Tan Lang (desire).',
        'Check Hua Lu/Hua Quan — directed action is pioneering; undirected is random折腾.',
        'Check malefics — they make Sha Po Lang more impulsive, guard against accidents and conflict.',
        'Learn to "find direction within change" — don\'t change for the sake of changing.',
        'Learn persistence — some things require endurance, don\'t switch at the first difficulty.',
        'Is your "restlessness" pioneering or escapism?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-qisha-zuoming.html', text: 'Qi Sha in Life' },
      { href: 'ziwei-pojun-zuoming.html', text: 'Po Jun in Life' },
      { href: 'ziwei-tanlang-zuoming.html', text: 'Tan Lang in Life' },
      { href: 'ziwei-geju-jiyue-tongliang.html', text: 'Ji Yue Tong Liang' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-riyue-bingming',
    cnTitle: '紫微斗数日月并明格：太阳太阴同宫，光明与细腻并存',
    enTitle: 'Ri Yue Bing Ming: Tai Yang and Tai Yin in the Same Palace — Light and Sensitivity Together',
    cnDesc: '日月并明是太阳和太阴同坐一宫的格局，主光明磊落又心思细腻。命宫有日月并明的人，既有太阳的外向又有太阴的内敛，但要防性格矛盾。',
    enDesc: 'Ri Yue Bing Ming is when Tai Yang and Tai Yin share a palace, ruling openness and sensitivity together. People with it have both solar extroversion and lunar introspection, but guard against inner contradiction.',
    cnLead: '日月并明是紫微斗数里最「矛盾又和谐」的格局。太阳是白天的星，主光明、外向、热情；太阴是夜晚的星，主细腻、内敛、温柔。两颗星坐在一起，就像一个人同时拥有白天和黑夜——你既能在人群中发光，又能在独处时深思。命宫有日月并明的人，性格丰富、多才多艺，但也可能因为「既想这样又想那样」而纠结。',
    cnIntro2: '日月并明只出现在丑宫和未宫。太阳属阳火，太阴属阴水，火和水在一起本来是相克的，但在丑未二宫却能「既济」——太阳的光和太阴的柔互相补充。日月并明跟「日月反背」不同：并明是两颗星都在好的位置，反背是太阳在晚上、太阴在白天，力量打折。',
    cnSections: [
      { h: '成格条件', ps: [
        '太阳和太阴同坐丑宫或未宫。',
        '命宫在丑或未，且太阳太阴同坐命宫，才是标准的日月并明格。',
        '太阳要在庙旺之地（丑宫太阳旺，未宫太阳得地），太阴也要有力量。',
        '加吉星（文昌文曲、天魁天钺）格局更完整；加煞星会让矛盾加剧。'
      ]},
      { h: '日月并明的性格', ps: [
        '既有太阳的外向、热情、光明磊落，又有太阴的细腻、温柔、善解人意。',
        '多才多艺、兴趣广泛，能在不同领域都有不错的表现。',
        '性格矛盾——有时候想出去社交，有时候又想一个人待着；有时候很果断，有时候又很犹豫。',
        '适应力强，能在不同环境中都表现得不错。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：性格丰富、多才多艺、适应力强。但要防纠结和内耗。',
        '官禄宫：事业上能文能武，适合做需要沟通和细致的工作。',
        '夫妻宫：配偶条件好、性格丰富，但感情中可能有冷热交替。',
        '财帛宫：财运不错，既有正财又有偏财，但可能花钱矛盾——有时候大手大脚有时候又很省。',
        '福德宫：精神世界丰富，既能享受热闹又能享受独处。'
      ]},
      { h: '日月并明的陷阱', ps: [
        '纠结——太阳说「去做」，太阴说「再想想」，两个人在脑子里吵架，导致决策困难。',
        '精力分散——兴趣太多，什么都想做，结果什么都做不精。',
        '情绪波动——太阳的高和太阴的低交替出现，情绪可能像过山车。',
        '不被理解——别人可能觉得你「一会儿这样一会儿那样」，摸不透你。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到日月并明，按这个顺序读：'], ol: [
        '先看在丑还是未——丑宫太阳旺，未宫太阴旺，侧重点不同。',
        '看太阳和太阴各自的亮度——庙旺力量强，落陷力量弱。',
        '看有没有煞星——煞星会让矛盾加剧。',
        '日月并明的人要学会「整合」——把太阳的行动力和太阴的思考力结合起来，而不是让它们打架。',
        '也要学会「聚焦」——选一个方向深耕，不要什么都做。',
        '问自己：你的「丰富」是「多才多艺」还是「精力分散」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-taiyang-zuoming.html', text: '太阳坐命' },
      { href: 'ziwei-taiyin-zuoming.html', text: '太阴坐命' },
      { href: 'ziwei-geju-juri-tonggong.html', text: '巨日同宫格' },
      { href: 'ziwei-wenchang-wenqu.html', text: '文昌文曲' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Ri Yue Bing Ming is the most "contradictory yet harmonious" pattern. Tai Yang is the day star — bright, extroverted, warm; Tai Yin is the night star — sensitive, introverted, gentle. Together they\'re like one person with both day and night: you can shine in a crowd and think deeply in solitude. Rich personality, versatile, but may struggle from "wanting both this and that."',
    enIntro2: 'Only appears in Chou and Wei palaces. Tai Yang is Yang Fire, Tai Yin is Yin Water — Fire and Water normally clash, but in Chou/Wei they achieve "mutual completion." Differs from "Ri Yue Fan Bei" where the sun is at night and moon by day, reducing their power.',
    enSections: [
      { h: 'Conditions', ps: [
        'Tai Yang and Tai Yin share Chou or Wei palace.',
        'Life in Chou or Wei with both stars is the standard pattern.',
        'Tai Yang should be in a strong position (prosperous in Chou, grounded in Wei), Tai Yin should also have power.',
        'With auspicious stars (Chang/Qu, Kui/Yue) the pattern is stronger; malefics intensify the contradiction.'
      ]},
      { h: 'Personality', ps: [
        'Both Tai Yang\'s extroversion, warmth, and openness, and Tai Yin\'s sensitivity, gentleness, and empathy.',
        'Versatile, broad interests, can perform well in different fields.',
        'Contradictory — sometimes wants to socialize, sometimes wants to be alone; sometimes decisive, sometimes hesitant.',
        'Adaptable, performs well in different environments.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: rich personality, versatile, adaptable. Guard against indecision and mental friction.',
        'Career: can do both cerebral and social work, suited to jobs needing communication and attention to detail.',
        'Spouse: partner has good conditions and rich personality, but relationship may have hot-cold cycles.',
        'Wealth: good finances, both regular and windfall income, but spending may be contradictory — sometimes lavish, sometimes frugal.',
        'Mental: rich inner world, enjoys both company and solitude.'
      ]},
      { h: 'The Trap', ps: [
        'Indecision — Tai Yang says "go," Tai Yin says "think more," two voices arguing in your head, causing decision paralysis.',
        'Scattered energy — too many interests, wants to do everything, masters nothing.',
        'Mood swings — Tai Yang\'s highs and Tai Yin\'s lows alternate, emotions like a roller coaster.',
        'Hard to understand — others may find you "inconsistent," hard to pin down.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Ri Yue Bing Ming:'], ol: [
        'Chou or Wei — Chou favors Tai Yang, Wei favors Tai Yin, different emphasis.',
        'Check each star\'s brightness — temple/prosperous = strong, fallen = weak.',
        'Check malefics — they intensify contradiction.',
        'Learn to "integrate" — combine Tai Yang\'s action with Tai Yin\'s thought, don\'t let them fight.',
        'Learn to "focus" — pick one direction and go deep, don\'t do everything.',
        'Is your "richness" versatility or scattered energy?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-taiyang-zuoming.html', text: 'Tai Yang in Life' },
      { href: 'ziwei-taiyin-zuoming.html', text: 'Tai Yin in Life' },
      { href: 'ziwei-geju-juri-tonggong.html', text: 'Ju Ri Tong Gong' },
      { href: 'ziwei-wenchang-wenqu.html', text: 'Wen Chang & Wen Qu' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-juri-tonggong',
    cnTitle: '紫微斗数巨日同宫格：巨门太阳同坐，口才与光明的组合',
    enTitle: 'Ju Ri Tong Gong: Ju Men and Tai Yang Together — Eloquence and Light',
    cnDesc: '巨日同宫是巨门和太阳同坐一宫的格局，主口才好、表达力强、适合靠嘴吃饭。但巨门的暗和太阳的明要平衡好，否则容易口舌是非。',
    enDesc: 'Ju Ri Tong Gong is when Ju Men and Tai Yang share a palace, ruling eloquence and strong expression, suited to careers using the voice. But Ju Men\'s darkness and Tai Yang\'s light must be balanced, or it leads to disputes.',
    cnLead: '巨日同宫是紫微斗数里最「会说话」的格局之一。巨门是暗星，主口舌、是非、洞察；太阳是明星，主光明、热情、公开。两颗星坐在一起，就是「把暗处的东西拿到明处说」——你有洞察黑暗的能力，又有公开表达的勇气。命宫有巨日同宫的人，口才极好、适合做律师、讲师、销售、主持人，但也要防「成也嘴败也嘴」。',
    cnIntro2: '巨日同宫只出现在寅宫和申宫。巨门属阴水，太阳属阳火，水克火本来是不好的，但在寅申二宫太阳旺，能制住巨门的暗，变成「以明破暗」。巨日同宫跟「巨日隔角」不同：同宫是两颗星坐在一起，隔角是两颗星在对宫，力量不同。',
    cnSections: [
      { h: '成格条件', ps: [
        '巨门和太阳同坐寅宫或申宫。',
        '命宫在寅或申，且巨门太阳同坐命宫。',
        '太阳要庙旺——寅宫太阳旺，申宫太阳得地，太阳的光能制住巨门的暗。',
        '加文昌文曲——口才加文采，表达力更强。加煞星——口舌是非增多。'
      ]},
      { h: '巨日同宫的性格', ps: [
        '口才好、表达力强、善于辩论和说服。',
        '洞察力强——能看到别人看不到的问题，敢于说真话。',
        '性格直率——有什么说什么，不喜欢藏着掖着。',
        '可能太直接——说话不经过大脑，容易得罪人或引发口舌是非。'
      ]},
      { h: '适合的职业', ps: [
        '律师、检察官——需要口才和逻辑，巨门的洞察加太阳的正义。',
        '讲师、培训师、主持人——靠表达和感染力吃饭。',
        '销售、公关——口才加热情，适合跟人打交道的工作。',
        '记者、评论员——洞察加表达，适合揭露和评论。',
        '不适合做需要保密或沉默的工作——你忍不住要说。'
      ]},
      { h: '巨日同宫的陷阱', ps: [
        '口舌是非——巨门主是非，加太阳的直接，容易因为说话得罪人。',
        '太较真——巨门喜欢追根究底，太阳喜欢光明正大，两个人在一起可能「得理不饶人」。',
        '多疑——巨门的暗让你容易怀疑别人，太阳的明让你容易把怀疑说出来，导致人际关系紧张。',
        '大嘴巴——知道什么都想说，可能泄露秘密或说错话。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到巨日同宫，按这个顺序读：'], ol: [
        '先看在寅还是申——寅宫太阳旺，格局更好；申宫太阳稍弱。',
        '看太阳亮度——太阳旺能制巨门的暗，太阳弱则是非多。',
        '看有没有文昌文曲——口才加文采，表达力更强。',
        '看有没有煞星——煞星增加口舌是非的风险。',
        '巨日同宫的人要学会「说话之前先想三秒」，有些话不说比说了好。',
        '问自己：你的「口才」是「说服力」还是「惹祸精」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-jumen-zuoming.html', text: '巨门坐命' },
      { href: 'ziwei-taiyang-zuoming.html', text: '太阳坐命' },
      { href: 'ziwei-geju-riyue-bingming.html', text: '日月并明格' },
      { href: 'ziwei-wenchang-wenqu.html', text: '文昌文曲' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Ju Ri Tong Gong is one of the most "eloquent" patterns. Ju Men is the dark star — ruling speech, disputes, insight; Tai Yang is the bright star — ruling light, warmth, openness. Together they "bring dark things into the light" — you have the ability to see what\'s hidden and the courage to say it publicly. Excellent for law, teaching, sales, hosting — but guard against "success by mouth, failure by mouth."',
    enIntro2: 'Only appears in Yin and Shen. Ju Men is Yin Water, Tai Yang is Yang Fire — Water overcomes Fire normally, but in Yin/Shen Tai Yang is strong and can control Ju Men\'s darkness, becoming "light breaking through darkness."',
    enSections: [
      { h: 'Conditions', ps: [
        'Ju Men and Tai Yang share Yin or Shen palace.',
        'Life in Yin or Shen with both stars.',
        'Tai Yang should be prosperous — strong in Yin, grounded in Shen; its light controls Ju Men\'s darkness.',
        'With Chang/Qu — eloquence plus literary talent, stronger expression. With malefics — more disputes.'
      ]},
      { h: 'Personality', ps: [
        'Eloquent, expressive, good at debate and persuasion.',
        'Insightful — sees what others miss, dares to speak the truth.',
        'Direct — says what\'s on mind, dislikes hiding.',
        'May be too direct — speaks without thinking, easily offends people or causes disputes.'
      ]},
      { h: 'Suitable Careers', ps: [
        'Lawyer, prosecutor — needs eloquence and logic, Ju Men\'s insight plus Tai Yang\'s justice.',
        'Lecturer, trainer, host — lives on expression and charisma.',
        'Sales, PR — eloquence plus warmth, suited to people-facing work.',
        'Journalist, commentator — insight plus expression, suited to exposure and commentary.',
        'Not suited to work requiring secrecy or silence — you can\'t help talking.'
      ]},
      { h: 'The Trap', ps: [
        'Disputes — Ju Men rules conflict, plus Tai Yang\'s directness, easily offends people through words.',
        'Too relentless — Ju Men likes to get to the bottom, Tai Yang likes openness; together may be "relentless when right."',
        'Suspicious — Ju Men\'s darkness makes you doubt others; Tai Yang\'s openness makes you say the doubt out loud, straining relationships.',
        'Big mouth — wants to share everything, may leak secrets or say the wrong thing.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Ju Ri Tong Gong:'], ol: [
        'Yin or Shen — Yin has stronger Tai Yang, better pattern; Shen slightly weaker.',
        'Check Tai Yang brightness — strong Tai Yang controls Ju Men\'s darkness; weak means more disputes.',
        'Check Chang/Qu — eloquence plus literary talent.',
        'Check malefics — they increase risk of disputes.',
        'Learn to "think three seconds before speaking" — some things are better left unsaid.',
        'Is your "eloquence" persuasive or trouble-making?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-jumen-zuoming.html', text: 'Ju Men in Life' },
      { href: 'ziwei-taiyang-zuoming.html', text: 'Tai Yang in Life' },
      { href: 'ziwei-geju-riyue-bingming.html', text: 'Ri Yue Bing Ming' },
      { href: 'ziwei-wenchang-wenqu.html', text: 'Wen Chang & Wen Qu' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-wutan',
    cnTitle: '紫微斗数武贪格：武曲贪狼同宫，财欲双全的爆发型格局',
    enTitle: 'Wu Tan: Wu Qu and Tan Lang Together — The Wealth-Desire Explosive Pattern',
    cnDesc: '武贪格是武曲和贪狼同坐一宫的格局，主财欲双全、爆发力强。命宫有武贪的人有赚钱能力也有享受欲望，但要防「火贪」和「铃贪」的暴起暴跌。',
    enDesc: 'Wu Tan is when Wu Qu and Tan Lang share a palace, ruling both wealth and desire with explosive power. People with it can earn and enjoy, but guard against the sudden rises and crashes of "Huo Tan" and "Ling Tan."',
    cnLead: '武贪格是紫微斗数里最「能赚也能花」的格局。武曲是财星，主赚钱能力和决断；贪狼是欲望星，主享受、多才多艺和野心。两颗星坐在一起，就是「既有赚钱的能力又有花钱的欲望」——你不是守财奴，你是「会赚会花」的人。武贪格的人一生中有「爆发」的机会——可能突然赚到一大笔钱，但也要防突然亏掉。',
    cnIntro2: '武贪格只出现在丑宫和未宫。武曲属阴金，贪狼属阳木，金克木但在丑未二宫能形成「财欲双全」的格局。武贪加火星叫「火贪格」，加铃星叫「铃贪格」——这两个是武贪的爆发形态，主突然发财，但也可能突然破财。',
    cnSections: [
      { h: '成格条件', ps: [
        '武曲和贪狼同坐丑宫或未宫。',
        '命宫在丑或未，且武曲贪狼同坐命宫。',
        '加火星或铃星——形成「火贪格」或「铃贪格」，爆发力最强。',
        '加化禄——财运更旺；加化忌——财来财去，留不住。'
      ]},
      { h: '武贪格的性格', ps: [
        '有商业头脑、善于理财、赚钱能力强。',
        '有欲望和野心——不满足于现状，想要更多更好。',
        '多才多艺、兴趣广泛、懂得享受生活。',
        '可能过于物质——把钱和享受看得太重，忽视精神层面。'
      ]},
      { h: '火贪格和铃贪格', ps: [
        '火贪格——武贪加火星，主「突发之财」，可能在短时间内赚到一大笔钱。但火贪也主「暴败」——来得快去得也快。',
        '铃贪格——武贪加铃星，主「暗发之财」，可能通过不为人知的方式赚钱，或者慢慢积累后突然爆发。',
        '火贪和铃贪都要有「收」的功夫——赚到钱后要懂得守，不然就是一场空。',
        '火贪铃贪加吉星——爆发后能守住；加煞星——爆发后很快亏掉。'
      ]},
      { h: '武贪格的陷阱', ps: [
        '贪——贪狼的欲望加上武曲的财，可能变成「贪得无厌」，什么都想要，结果什么都做不好。',
        '暴起暴跌——火贪铃贪的爆发力强，但稳定性差，可能大赚之后大亏。',
        '物质主义——太看重钱和享受，可能忽视感情、健康和精神追求。',
        '投机——武贪的人喜欢冒险，可能沉迷赌博或投机，导致破财。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到武贪格，按这个顺序读：'], ol: [
        '先看在丑还是未——丑宫和未宫的武贪力量不同。',
        '看有没有火星铃星——火贪铃贪爆发力强但要防暴败。',
        '看有没有化禄——化禄让财运更稳。',
        '看有没有化忌——化忌让财来财去。',
        '武贪的人要学会「赚到钱后守住」，爆发之后要有规划。',
        '也要学会「精神追求」——钱很重要，但不是唯一重要的。',
        '问自己：你赚钱是为了「更好的生活」还是「更多的欲望」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-wuqu-zuoming.html', text: '武曲坐命' },
      { href: 'ziwei-tanlang-zuoming.html', text: '贪狼坐命' },
      { href: 'ziwei-huoxing-lingxing.html', text: '火星铃星' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Wu Tan is the most "can earn and can spend" pattern. Wu Qu is the wealth star — earning ability and decisiveness; Tan Lang is the desire star — enjoyment, versatility, ambition. Together they\'re "ability to earn plus desire to spend" — not a miser, but someone who "earns well and spends well." People with Wu Tan have "explosive" opportunities — may suddenly make a fortune, but guard against suddenly losing it too.',
    enIntro2: 'Only appears in Chou and Wei. Wu Qu is Yin Metal, Tan Lang is Yang Wood — Metal overcomes Wood, but in Chou/Wei they form "wealth and desire both complete." Wu Tan plus Huo Xing is "Huo Tan," plus Ling Xing is "Ling Tan" — the explosive forms, sudden wealth but also sudden loss.',
    enSections: [
      { h: 'Conditions', ps: [
        'Wu Qu and Tan Lang share Chou or Wei palace.',
        'Life in Chou or Wei with both stars.',
        'With Huo Xing or Ling Xing — forms "Huo Tan" or "Ling Tan," strongest explosive power.',
        'With Hua Lu — stronger wealth; with Hua Ji — money comes and goes, can\'t keep it.'
      ]},
      { h: 'Personality', ps: [
        'Business-minded, good at finance, strong earning ability.',
        'Desire and ambition — not satisfied with the status quo, wants more and better.',
        'Versatile, broad interests, knows how to enjoy life.',
        'May be too materialistic — values money and enjoyment too much, neglects the spiritual.'
      ]},
      { h: 'Huo Tan and Ling Tan', ps: [
        'Huo Tan — Wu Tan plus Huo Xing, rules "sudden wealth," may make a fortune in a short time. But also "sudden loss" — comes fast, goes fast.',
        'Ling Tan — Wu Tan plus Ling Xing, rules "hidden wealth," may earn through undisclosed means, or accumulate slowly then explode.',
        'Both need the skill of "holding" — after earning, know how to keep it, or it\'s all for nothing.',
        'With auspicious stars — can hold after explosion; with malefics — lose it quickly after explosion.'
      ]},
      { h: 'The Trap', ps: [
        'Greed — Tan Lang\'s desire plus Wu Qu\'s wealth may become insatiable, wanting everything, achieving nothing.',
        'Boom and bust — Huo Tan/Ling Tan have strong explosive power but poor stability, big gains followed by big losses.',
        'Materialism — values money and enjoyment too much, may neglect relationships, health, and spiritual pursuits.',
        'Speculation — likes risk, may沉迷 gambling or speculation, leading to financial loss.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Wu Tan:'], ol: [
        'Chou or Wei — different power levels.',
        'Check Huo Xing/Ling Xing — Huo Tan/Ling Tan have explosive power but guard against sudden loss.',
        'Check Hua Lu — makes wealth more stable.',
        'Check Hua Ji — money comes and goes.',
        'Learn to "hold after earning" — plan after the explosion.',
        'Also learn "spiritual pursuit" — money matters, but isn\'t everything.',
        'Do you earn for a better life or for more desire?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-wuqu-zuoming.html', text: 'Wu Qu in Life' },
      { href: 'ziwei-tanlang-zuoming.html', text: 'Tan Lang in Life' },
      { href: 'ziwei-huoxing-lingxing.html', text: 'Huo Xing & Ling Xing' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-lianqi-qisha',
    cnTitle: '紫微斗数廉贞七杀格：囚星加将星，刚猛中有刑克的格局',
    enTitle: 'Lian Zhen and Qi Sha: The Prison Star and General Star — Fierceness with Punishment',
    cnDesc: '廉贞七杀是廉贞和七杀同宫的格局，主刚猛、决断、有魄力，但也主刑克和冲突。命宫有廉杀的人适合做开创性工作，但要防脾气和意外伤害。',
    enDesc: 'Lian Zhen and Qi Sha together rule fierceness, decisiveness, and boldness, but also punishment and conflict. People with it suit pioneering work, but guard against temper and accidental injury.',
    cnLead: '廉贞七杀是紫微斗数里最「刚猛」的格局之一。廉贞是囚星，主感情、欲望、刑克；七杀是将星，主开创、决断、冲锋。两颗星坐在一起，就是「带着感情去打仗」——你有七杀的魄力，又有廉贞的细腻和感情。命宫有廉杀的人，做事果断、有冲劲、能成大事，但脾气也大，容易跟人冲突，也要防意外伤害。',
    cnIntro2: '廉贞七杀只出现在寅宫和申宫。廉贞属阴火，七杀属阳金，火克金但在寅申二宫能形成「刚中有柔」的格局。廉贞七杀是「杀破狼」的变体——命宫有廉杀，三方一定有破军和贪狼，所以也带杀破狼的变动性。',
    cnSections: [
      { h: '成格条件', ps: [
        '廉贞和七杀同坐寅宫或申宫。',
        '命宫在寅或申，且廉贞七杀同坐命宫。',
        '加化禄化权——刚猛有方向，不是瞎冲。',
        '加煞星——廉杀本来就刚，加煞星更冲，容易出意外或官非。'
      ]},
      { h: '廉贞七杀的性格', ps: [
        '果断、有魄力、敢作敢当，不喜欢拖泥带水。',
        '感情丰富——廉贞的细腻让你不是冷冰冰的人，你有温柔的一面。',
        '脾气大——容易发火，发火的时候很吓人，但发完就忘。',
        '有开创精神，适合在竞争激烈的环境中发展。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：刚猛有魄力、感情丰富、但脾气大。适合做开创性或竞争性工作。',
        '官禄宫：事业上有冲劲、适合做需要决断和执行力的工作。',
        '夫妻宫：感情浓烈但容易吵架，配偶性格强势。',
        '疾厄宫：注意心血管、火气、意外伤害。',
        '迁移宫：在外有冲劲、适合去竞争激烈的地方发展。'
      ]},
      { h: '廉贞七杀的陷阱', ps: [
        '脾气——廉杀的人容易冲动发火，可能因为一时之气做出后悔的决定。',
        '刑克——廉贞是囚星，七杀是将星，两颗星在一起有刑克之象，要防官非、手术、意外伤害。',
        '感情用事——廉贞的感情加上七杀的冲动，可能因为感情而做出不理智的决定。',
        '太刚——过刚易折，廉杀的人要学会「柔」，有时候退一步比进一步更有效。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到廉贞七杀，按这个顺序读：'], ol: [
        '先看在寅还是申——寅宫和申宫的廉杀力量不同。',
        '看有没有化禄化权——有方向的刚猛是魄力，没方向的刚猛是冲动。',
        '看有没有煞星——煞星增加刑克和意外的风险。',
        '廉杀的人要学会「情绪管理」——发火之前先深呼吸。',
        '也要学会「以柔克刚」——不是所有问题都需要硬碰硬。',
        '问自己：你的「果断」是「魄力」还是「冲动」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-lianzhen-zuoming.html', text: '廉贞坐命' },
      { href: 'ziwei-qisha-zuoming.html', text: '七杀坐命' },
      { href: 'ziwei-geju-shapol.html', text: '杀破狼格' },
      { href: 'ziwei-tianxing-xing.html', text: '天刑星' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Lian Zhen and Qi Sha is one of the fiercest patterns. Lian Zhen is the prison star — emotion, desire, punishment; Qi Sha is the general star — pioneering, decisiveness, charging. Together they\'re "going to war with feelings" — you have Qi Sha\'s boldness plus Lian Zhen\'s sensitivity. Decisive, driven, can achieve big things, but also hot-tempered, prone to conflict, and should guard against accidental injury.',
    enIntro2: 'Only appears in Yin and Shen. Lian Zhen is Yin Fire, Qi Sha is Yang Metal — Fire overcomes Metal, but in Yin/Shen they form "fierceness with softness." It\'s a variant of Sha Po Lang — with Lian Sha in Life, Po Jun and Tan Lang are always in the triple direction, bringing changeability.',
    enSections: [
      { h: 'Conditions', ps: [
        'Lian Zhen and Qi Sha share Yin or Shen palace.',
        'Life in Yin or Shen with both stars.',
        'With Hua Lu/Hua Quan — fierceness has direction, not random charging.',
        'With malefics — already fierce, malefics make it more impulsive, prone to accidents or legal trouble.'
      ]},
      { h: 'Personality', ps: [
        'Decisive, bold, takes responsibility, dislikes indecision.',
        'Emotionally rich — Lian Zhen\'s sensitivity makes you not cold; you have a gentle side.',
        'Hot-tempered — easily angered, scary when mad, but forgets quickly.',
        'Pioneering spirit, suited to competitive environments.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: fierce and bold, emotionally rich, but hot-tempered. Suited to pioneering or competitive work.',
        'Career: driven at work, suited to jobs needing decisiveness and execution.',
        'Spouse: intense relationship but prone to arguments, partner is strong-willed.',
        'Health: watch cardiovascular, inflammation, accidental injury.',
        'Travel: driven away from home, suited to competitive places.'
      ]},
      { h: 'The Trap', ps: [
        'Temper — easily angered, may make decisions in a fit of rage that are later regretted.',
        'Punishment — Lian Zhen is the prison star, Qi Sha is the general; together they carry punishment imagery, guard against lawsuits, surgery, accidents.',
        'Acting on emotion — Lian Zhen\'s feelings plus Qi Sha\'s impulsiveness may lead to irrational decisions because of emotion.',
        'Too rigid — the overly rigid break easily; learn "softness," sometimes stepping back is more effective than pushing forward.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Lian Zhen/Qi Sha:'], ol: [
        'Yin or Shen — different power levels.',
        'Check Hua Lu/Hua Quan — directed fierceness is boldness; undirected is impulsiveness.',
        'Check malefics — they increase punishment and accident risk.',
        'Learn "emotion management" — take a deep breath before getting angry.',
        'Learn "softness overcoming hardness" — not every problem needs head-on collision.',
        'Is your "decisiveness" boldness or impulsiveness?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-lianzhen-zuoming.html', text: 'Lian Zhen in Life' },
      { href: 'ziwei-qisha-zuoming.html', text: 'Qi Sha in Life' },
      { href: 'ziwei-geju-shapol.html', text: 'Sha Po Lang' },
      { href: 'ziwei-tianxing-xing.html', text: 'Tian Xing Star' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-tanlang-huaji',
    cnTitle: '紫微斗数贪狼化忌格：欲望受阻，反而是深耕和专注的机会',
    enTitle: 'Tan Lang Hua Ji: Desire Blocked — An Opportunity for Depth and Focus',
    cnDesc: '贪狼化忌是贪狼星遇化忌的格局，主欲望受阻、感情波折、才艺难展。但化忌也能让贪狼的多才多艺变成专注深耕，关键在于怎么转化。',
    enDesc: 'Tan Lang Hua Ji is when Tan Lang meets Hua Ji, ruling blocked desire, romantic setbacks, and unexpressed talent. But Hua Ji can also turn versatility into deep focus — the key is how you transform it.',
    cnLead: '贪狼化忌是紫微斗数里最「憋屈」的格局之一。贪狼是欲望星，主享受、多才多艺、桃花；化忌是「受阻」和「纠结」。贪狼遇化忌，就是「欲望被堵住了」——你想要的得不到，喜欢的人不喜欢你，学了很多东西但用不出来。但贪狼化忌不是「坏格局」——它是一个「转化」的格局：当你的欲望被堵住时，你反而有机会把分散的精力收回来，专注在一件事上深耕。',
    cnIntro2: '贪狼化忌的成格条件：贪狼在命宫或三方，且生年化忌在贪狼。甲年生人（甲廉破武阳）化忌在太阳，不是贪狼；戊年生人（戊贪阴右机）化忌在贪狼。所以贪狼化忌主要出现在戊年生人的命盘中。贪狼化忌跟贪狼化禄是相反的：化禄是欲望得到满足，化忌是欲望受到阻碍。',
    cnSections: [
      { h: '贪狼化忌的表现', ps: [
        '感情波折——贪狼主桃花，化忌让感情不顺利，可能喜欢的人不喜欢你，或者恋爱中多波折。',
        '欲望受阻——想要的东西得不到，或者得到了也不满足。',
        '才艺难展——贪狼多才多艺，化忌让你学了很多但用不出来，或者怀才不遇。',
        '容易纠结——在选择中犹豫，什么都想要但什么都不敢要。'
      ]},
      { h: '贪狼化忌的正面转化', ps: [
        '专注——贪狼本来兴趣广泛，化忌把分散的欲望堵住，反而让你能专注在一件事上。',
        '深耕——当外在的欲望得不到满足时，你会转向内在的深耕，在某个领域做到极致。',
        '深度——贪狼化忌的人对感情和欲望有更深的思考，不是肤浅的享乐主义者。',
        '艺术家气质——很多贪狼化忌的人在艺术、文学、哲学领域有很深的造诣，因为他们把欲望转化成了创作。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：欲望受阻、感情波折、但有深度。适合做需要专注和深耕的工作。',
        '夫妻宫：感情不顺利、可能晚婚或感情多波折。要学会放下执念。',
        '财帛宫：财运不稳定、投资容易亏损。不适合投机，适合稳健理财。',
        '官禄宫：工作中怀才不遇、或者换工作多。要找到一个能深耕的方向。',
        '福德宫：精神上容易不满足、想太多。要学会知足。'
      ]},
      { h: '贪狼化忌的陷阱', ps: [
        '执念——越得不到越想要，陷入执念中无法自拔。',
        '自怨自艾——觉得自己怀才不遇，抱怨命运不公。',
        '感情用事——因为感情不顺而影响工作和生活。',
        '逃避——用享乐或沉迷来逃避欲望受阻的痛苦。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到贪狼化忌，按这个顺序读：'], ol: [
        '先看化忌在哪个宫——命宫影响性格，夫妻宫影响感情，财帛宫影响财运。',
        '看贪狼的亮度——庙旺的贪狼化忌，转化能力强；落陷的贪狼化忌，阻碍更大。',
        '看有没有吉星——吉星能帮助转化。',
        '贪狼化忌的人要学会「放下」——不是你的不要强求。',
        '也要学会「转化」——把受阻的欲望变成深耕的动力。',
        '问自己：你是在「为得不到的痛苦」还是「把精力用在能得到的地方」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-tanlang-zuoming.html', text: '贪狼坐命' },
      { href: 'ziwei-huaji.html', text: '化忌星详解' },
      { href: 'ziwei-geju-wutan.html', text: '武贪格' },
      { href: 'ziwei-fuqigong.html', text: '夫妻宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tan Lang Hua Ji is one of the most "frustrating" patterns. Tan Lang is the desire star — enjoyment, versatility, romance; Hua Ji is "blockage" and "entanglement." When they meet, desire is blocked — what you want you can\'t get, the person you like doesn\'t like you back, you learn many things but can\'t use them. But it\'s not a "bad pattern" — it\'s a "transformation" pattern: when desire is blocked, you have a chance to withdraw scattered energy and focus deeply on one thing.',
    enIntro2: 'Conditions: Tan Lang in Life or triple direction, and birth-year Hua Ji falls on Tan Lang. Wu-year births (Wu Tan Yin You Ji) have Hua Ji on Tan Lang. It\'s the opposite of Tan Lang Hua Lu: Hua Lu means desire fulfilled, Hua Ji means desire obstructed.',
    enSections: [
      { h: 'Manifestations', ps: [
        'Romantic setbacks — Tan Lang rules romance, Hua Ji makes love difficult; the person you like may not like you back, or relationships have many twists.',
        'Blocked desire — what you want you can\'t get, or you\'re unsatisfied even when you get it.',
        'Unexpressed talent — Tan Lang is versatile, Hua Ji makes you learn much but use little, or talent goes unrecognized.',
        'Indecision — hesitates between choices, wants everything but dares not pursue anything.'
      ]},
      { h: 'Positive Transformation', ps: [
        'Focus — Tan Lang normally has broad interests; Hua Ji blocks scattered desire, letting you focus on one thing.',
        'Depth — when external desire is unfulfilled, you turn inward and go deep in one field.',
        'Profundity — thinks more deeply about desire and emotion, not a superficial hedonist.',
        'Artistic temperament — many with this pattern achieve deeply in art, literature, philosophy, transforming desire into creation.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: blocked desire, romantic setbacks, but depth. Suited to work requiring focus and depth.',
        'Spouse: difficult relationships, may marry late or have many twists. Learn to let go of obsession.',
        'Wealth: unstable finances, investment losses likely. Not suited to speculation, conservative finance.',
        'Career: unrecognized talent at work, or frequent job changes. Find a direction to go deep.',
        'Mental: spiritually unsatisfied, overthinks. Learn contentment.'
      ]},
      { h: 'The Trap', ps: [
        'Obsession — the more you can\'t get, the more you want it, trapped in obsession.',
        'Self-pity — feels unrecognized, complains about unfair fate.',
        'Letting emotions drive decisions — relationship troubles affect work and life.',
        'Escapism — uses pleasure or addiction to escape the pain of blocked desire.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tan Lang Hua Ji:'], ol: [
        'Which palace is Hua Ji in — Life affects personality, Spouse affects romance, Wealth affects finances.',
        'Check Tan Lang\'s brightness — temple/prosperous has stronger transformation ability; fallen has more obstruction.',
        'Check auspicious stars — they help transformation.',
        'Learn to "let go" — don\'t force what isn\'t yours.',
        'Learn to "transform" — turn blocked desire into the drive for depth.',
        'Are you "suffering over what you can\'t get" or "putting energy into what you can"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-tanlang-zuoming.html', text: 'Tan Lang in Life' },
      { href: 'ziwei-huaji.html', text: 'Hua Ji Explained' },
      { href: 'ziwei-geju-wutan.html', text: 'Wu Tan Pattern' },
      { href: 'ziwei-fuqigong.html', text: 'The Spouse Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-ziwei-pojun',
    cnTitle: '紫微斗数紫微破军格：帝星加耗星，在变革中建立新秩序',
    enTitle: 'Zi Wei and Po Jun: Emperor Star and耗 Star — Building New Order Through Change',
    cnDesc: '紫微破军是紫微和破军同宫的格局，主在变革中建立新秩序。命宫有紫破的人有领导力又有破坏力，适合做改革者，但要防「破而不立」。',
    enDesc: 'Zi Wei and Po Jun together rule building new order through change. People with it have both leadership and destructive power, suited to being reformers, but guard against "breaking without building."',
    cnLead: '紫微破军是紫微斗数里最「有颠覆性」的格局之一。紫微是帝星，主地位、领导、秩序；破军是耗星，主破坏、变革、推陈出新。两颗星坐在一起，就是「皇帝亲自拆旧房子建新房子」——你既有建立秩序的能力，又有打破旧秩序的勇气。命宫有紫破的人，适合做改革者、创业者、颠覆者，但最大的问题是「破而不立」——拆了旧的，新的没建起来。',
    cnIntro2: '紫微破军只出现在丑宫和未宫。紫微属阴土，破军属阴水，土克水但在丑未二宫能形成「破而后立」的格局。紫微破军跟杀破狼有关联——紫破的三方一定有七杀和贪狼，所以也带杀破狼的变动性，但紫破比纯杀破狼多了一份「帝王的秩序感」。',
    cnSections: [
      { h: '成格条件', ps: [
        '紫微和破军同坐丑宫或未宫。',
        '命宫在丑或未，且紫微破军同坐命宫。',
        '加左辅右弼——有人帮你「立」，不会破了之后没人收拾。',
        '加化禄化权——变革有资源和方向，不是为了破而破。'
      ]},
      { h: '紫微破军的性格', ps: [
        '有领导力和变革精神——不满足于现状，想要改变规则。',
        '果断、有魄力——敢做别人不敢做的决定。',
        '自尊心强、好面子——紫微的帝性让你不愿意认输。',
        '可能太激进——破军的破坏性加上紫微的自负，可能听不进反对意见。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：有领导力、适合做改革者或创业者。但要防破而不立。',
        '官禄宫：事业上适合做开创性或改革性的工作，不适合守成。',
        '夫妻宫：感情中有变革——可能闪婚闪离，或者配偶性格强势。',
        '财帛宫：财运大起大落——可能靠变革赚大钱，也可能因为冒险亏大钱。',
        '田宅宫：家里可能经常装修或搬家，居住环境变动大。'
      ]},
      { h: '紫微破军的陷阱', ps: [
        '破而不立——破军负责拆，紫微负责建，但如果建的速度跟不上拆的速度，就是一片废墟。',
        '自负——紫微的帝性让你觉得自己永远是对的，不愿意听别人的建议。',
        '太激进——变革太快，别人跟不上，导致众叛亲离。',
        '不稳定——一生变动大，工作、感情、居住环境都可能频繁变化。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到紫微破军，按这个顺序读：'], ol: [
        '先看在丑还是未——丑宫和未宫的紫破力量不同。',
        '看有没有左辅右弼——有辅星帮你「立」，格局才完整。',
        '看有没有化禄化权——变革有资源和方向。',
        '紫破的人要学会「先立后破」——在建好新房子之前，不要急着拆旧房子。',
        '也要学会「听意见」——改革者最容易犯的错就是觉得自己永远对。',
        '问自己：你是在「破旧立新」还是「为了破而破」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-pojun-zuoming.html', text: '破军坐命' },
      { href: 'ziwei-geju-zifu-tonggong.html', text: '紫府同宫格' },
      { href: 'ziwei-geju-shapol.html', text: '杀破狼格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Zi Wei and Po Jun is one of the most "disruptive" patterns. Zi Wei is the emperor star — status, leadership, order; Po Jun is the耗 star — destruction, transformation, innovation. Together they\'re "the emperor personally tearing down the old palace to build a new one" — you have both the ability to build order and the courage to break it. Suited to reformers, entrepreneurs, disruptors — but the biggest problem is "breaking without building" — you demolish the old but the new never gets built.',
    enIntro2: 'Only appears in Chou and Wei. Zi Wei is Yin Earth, Po Jun is Yin Water — Earth overcomes Water, but in Chou/Wei they form "break then build." Related to Sha Po Lang — with Zi Po in Life, Qi Sha and Tan Lang are always in the triple direction, bringing changeability, but Zi Po adds an "imperial sense of order" beyond pure Sha Po Lang.',
    enSections: [
      { h: 'Conditions', ps: [
        'Zi Wei and Po Jun share Chou or Wei palace.',
        'Life in Chou or Wei with both stars.',
        'With Zuo Fu/You Bi — people help you "build," so you don\'t break and leave rubble.',
        'With Hua Lu/Hua Quan — change has resources and direction, not breaking for breaking\'s sake.'
      ]},
      { h: 'Personality', ps: [
        'Leadership and transformative spirit — unsatisfied with the status quo, wants to change the rules.',
        'Decisive and bold — dares to make decisions others won\'t.',
        'Strong pride and面子-conscious — Zi Wei\'s imperial nature makes you hate losing.',
        'May be too radical — Po Jun\'s destructiveness plus Zi Wei\'s ego, may not listen to opposition.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: leadership, suited to reformer or entrepreneur. Guard against breaking without building.',
        'Career: suited to pioneering or reform work, not suited to maintaining the status quo.',
        'Spouse: transformation in relationships — may marry and divorce quickly, or partner is strong-willed.',
        'Wealth: great ups and downs — may make a fortune through change, or lose big through risk-taking.',
        'Property: frequent renovation or moving, big changes in living environment.'
      ]},
      { h: 'The Trap', ps: [
        'Breaking without building — Po Jun demolishes, Zi Wei builds; if building can\'t keep up with demolition, you get rubble.',
        'Ego — Zi Wei\'s imperial nature makes you think you\'re always right, won\'t listen to advice.',
        'Too radical — changes too fast, others can\'t keep up, leading to isolation.',
        'Instability — many life changes, work, relationships, residence all shift frequently.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Zi Wei/Po Jun:'], ol: [
        'Chou or Wei — different power levels.',
        'Check Zuo Fu/You Bi — assistants help you "build," completing the pattern.',
        'Check Hua Lu/Hua Quan — change has resources and direction.',
        'Learn "build before you break" — don\'t demolish the old house before the new one is ready.',
        'Learn to "listen" — the reformer\'s most common mistake is thinking you\'re always right.',
        'Are you "breaking the old to build the new" or "breaking for breaking\'s sake"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-pojun-zuoming.html', text: 'Po Jun in Life' },
      { href: 'ziwei-geju-zifu-tonggong.html', text: 'Zi Fu Tong Gong' },
      { href: 'ziwei-geju-shapol.html', text: 'Sha Po Lang' },
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
          <p class="article-meta"><span>${enTag}</span><span><time datetime="${date}">2026-08-18 12:15</time></span></p>
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
          <p class="article-meta"><span>${cnTag}</span><span><time datetime="${date}">2026-08-18 12:15</time></span></p>
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
