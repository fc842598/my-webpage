const fs = require('fs');
const path = require('path');
const date = '2026-08-19T10:15:00+08:00';
function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

const articles = [
  {
    slug: 'ziwei-geju-riyue-fanbei',
    cnTitle: '紫微斗数日月反背格：太阳太阴明暗错位，辛苦但能成的格局',
    enTitle: 'Ri Yue Fan Bei: Sun and Moon Reversed — Hardship That Can Still Succeed',
    cnDesc: '日月反背是太阳落夜间宫位、太阴落白天宫位的格局，主一生辛苦、多劳少得。但反背不是注定差，很多人靠后天努力翻盘。',
    enDesc: 'Ri Yue Fan Bei is when the sun falls in night palaces and the moon in day palaces, ruling lifelong toil. But it doesn\'t guarantee failure — many turn it around through effort.',
    cnLead: '日月反背是紫微斗数里最「委屈」的格局之一。太阳本该白天亮，却落在了晚上；太阴本该晚上明，却落在了白天。就像一个习惯熬夜的人被迫早起，或者一个夜猫子被安排上白班——不是不行，是别扭。命宫有日月反背的人，年轻时特别辛苦：同样的事，你要比别人多花一倍力气；同样的机会，你总是差那么一点。但这个格局有一个好处——你比别人更能扛。',
    cnIntro2: '日月反背的成格条件：太阳在戌、亥、子、丑宫（夜间宫位），太阴在辰、巳、午、未宫（白天宫位），且日月分别在命宫三方。日月反背跟日月并明是相反的：并明是两颗星都在最好的位置，反背是两颗星都在最别扭的位置。但反背不等于「命不好」——它只是说你的能量跟环境不同步，需要更多努力来对齐。',
    cnSections: [
      { h: '成格条件', ps: [
        '太阳落在戌、亥、子、丑宫——太阳在夜间，光被遮住了。',
        '太阴落在辰、巳、午、未宫——太阴在白天，月亮看不见。',
        '命宫三方四正中有这两颗错位的星，才是日月反背。',
        '加煞星更辛苦——擎羊陀罗增加劳碌，火铃增加焦虑，空劫增加白忙。'
      ]},
      { h: '日月反背的表现', ps: [
        '多劳少得——你付出十分努力，可能只得到五分回报。不是你不行，是时机不对。',
        '昼夜颠倒——可能适合做夜班、自由职业、或者跟海外时差有关的工作。',
        '早年辛苦——三十岁之前特别累，什么都要靠自己，没人帮你。',
        '中年后好转——随着年龄增长，你会逐渐找到跟自己节奏匹配的环境。'
      ]},
      { h: '反背不是注定差', ps: [
        '紫微斗数里没有「注定差」的格局。日月反背只是说你的能量跟主流环境不同步——白天你犯困，晚上你精神。',
        '很多反背的人后来发展得很好，因为他们习惯了「靠自己」。当别人靠天时地利的时候，你靠的是咬牙硬扛，这种能力在逆境中特别值钱。',
        '反背加吉星（昌曲、魁钺、辅弼）——辛苦但有贵人，或者靠才华翻盘。',
        '反背加化禄化权——虽然辛苦但能赚到钱、掌到权，是「劳而有成」。'
      ]},
      { h: '怎么化解反背', ps: [
        '找到适合自己的节奏——如果你是夜猫子，不要强迫自己早起；找一份时间灵活的工作。',
        '去适合的地方发展——太阳在夜间适合去南方或东方（太阳升起的方向），太阴在白天适合去北方或西方。',
        '用后天努力补先天不足——反背的人没有「躺赢」的命，但有「翻盘」的命。',
        '不要跟别人比——别人二十岁成功，你可能四十岁才起步，但你的根基更稳。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到日月反背，按这个顺序读：'], ol: [
        '先看太阳和太阴分别落在哪个宫——错位越严重，辛苦感越强。',
        '看有没有吉星——吉星能减轻辛苦，让努力有回报。',
        '看有没有化禄化权——劳而有成，辛苦但能赚到。',
        '看大限——中年后的大限如果走到日月庙旺的位置，会明显好转。',
        '不要被「反背」两个字吓到——它描述的是节奏，不是结局。',
        '问自己：你是在「抱怨辛苦」还是「把辛苦变成了根基」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-geju-riyue-bingming.html', text: '日月并明格' },
      { href: 'ziwei-taiyang-zuoming.html', text: '太阳坐命' },
      { href: 'ziwei-taiyin-zuoming.html', text: '太阴坐命' },
      { href: 'ziwei-geju-shizhong-yinyu.html', text: '石中隐玉格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Ri Yue Fan Bei is one of the most "frustrating" patterns. The sun should shine by day but falls at night; the moon should glow by night but falls by day. Like a night owl forced to work mornings — not impossible, just awkward. People with it work especially hard when young: twice the effort for half the result, always just short of opportunity. But the advantage is — you can endure more than others.',
    enIntro2: 'Conditions: Tai Yang in Xu/Hai/Zi/Chou (night palaces), Tai Yin in Chen/Si/Wu/Wei (day palaces), both in Life\'s triple direction. It\'s the opposite of Ri Yue Bing Ming where both stars are at their best. But "reversed" doesn\'t mean "bad fate" — it means your energy is out of sync with the environment, requiring more effort to align.',
    enSections: [
      { h: 'Conditions', ps: [
        'Tai Yang in Xu, Hai, Zi, Chou — the sun at night, its light hidden.',
        'Tai Yin in Chen, Si, Wu, Wei — the moon by day, invisible.',
        'Both stars in Life\'s triple direction forms the pattern.',
        'With malefics: more toil — Qing Yang/Tuo Luo add labor, Huo Ling add anxiety, Kong Jie add futility.'
      ]},
      { h: 'Manifestations', ps: [
        'More effort, less reward — ten parts effort for five parts return. Not inability, but bad timing.',
        'Day-night reversal — may suit night shifts, freelance, or work with overseas time zones.',
        'Hard early years — especially tough before thirty, everything靠 yourself, no help.',
        'Improvement after middle age — with age, you find environments matching your rhythm.'
      ]},
      { h: 'Not Doomed to Failure', ps: [
        'No pattern in Zi Wei Dou Shu guarantees failure. It just means your energy is out of sync with the mainstream — sleepy by day, alert at night.',
        'Many with this pattern succeed later because they\'re used to relying on themselves. While others rely on timing, you rely on grit — invaluable in adversity.',
        'With auspicious stars (Chang/Qu, Kui/Yue, Fu/Bi): hard work with benefactors, or talent-based turnaround.',
        'With Hua Lu/Hua Quan: toil that earns money and power — "labor with results."'
      ]},
      { h: 'How to Work With It', ps: [
        'Find your rhythm — if you\'re a night owl, don\'t force early mornings; find flexible-hours work.',
        'Go to suitable places — sun at night suits south/east (sunrise direction); moon by day suits north/west.',
        'Use后天 effort to compensate — no "easy win" fate, but a "comeback" fate.',
        'Don\'t compare — others succeed at twenty, you may start at forty, but your foundation is more solid.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Ri Yue Fan Bei:'], ol: [
        'Which palaces are the sun and moon in — the more displaced, the stronger the toil.',
        'Check auspicious stars — they reduce hardship and make effort pay off.',
        'Check Hua Lu/Hua Quan — labor with results.',
        'Check major cycles — cycles passing through temple/prosperous sun/moon positions bring marked improvement.',
        'Don\'t be scared by "reversed" — it describes rhythm, not outcome.',
        'Are you "complaining about hardship" or "turning hardship into foundation"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-geju-riyue-bingming.html', text: 'Ri Yue Bing Ming' },
      { href: 'ziwei-taiyang-zuoming.html', text: 'Tai Yang in Life' },
      { href: 'ziwei-taiyin-zuoming.html', text: 'Tai Yin in Life' },
      { href: 'ziwei-geju-shizhong-yinyu.html', text: 'Shi Zhong Yin Yu' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-junchen-qinghui',
    cnTitle: '紫微斗数君臣庆会格：紫微得众星辅佐，最完整的领导格局',
    enTitle: 'Jun Chen Qing Hui: Zi Wei Supported by All Ministers — The Most Complete Leadership Pattern',
    cnDesc: '君臣庆会是紫微在命宫，三方有左辅右弼、文昌文曲、天魁天钺会聚的格局。主领导力强、团队完整、事业有成，但要防「众星捧月」后的自负。',
    enDesc: 'Jun Chen Qing Hui is when Zi Wei in Life has Zuo Fu/You Bi, Wen Chang/Wen Qu, and Tian Kui/Tian Yue gathering in the triple direction. It rules strong leadership, complete teams, and career success, but guard against overconfidence.',
    cnLead: '君臣庆会是紫微斗数里最「完整」的领导格局。紫微是皇帝，但一个皇帝能不能成事，不看他自己多厉害，而看他身边有没有人。君臣庆会就是「皇帝配上了完整的班底」——左辅右弼是左右手，文昌文曲是智囊团，天魁天钺是贵人。命宫有这个格局的人，天生有领导力，而且最重要的是：你不是一个人在战斗。',
    cnIntro2: '君臣庆会的成格条件：紫微在命宫，三方四正中有左辅、右弼、文昌、文曲、天魁、天钺等吉星会聚。吉星越多格局越完整。这个格局跟紫府同宫不同：紫府同宫是「皇帝坐在金库里」，有资源但可能没人；君臣庆会是「皇帝上朝」，文武百官都在。',
    cnSections: [
      { h: '成格条件', ps: [
        '紫微在命宫——皇帝必须在主位。',
        '三方四正中有左辅右弼——左右手，执行力。',
        '三方四正中有文昌文曲——智囊团，谋略和文书。',
        '三方四正中有天魁天钺——贵人，关键时刻有人提携。',
        '吉星会聚越多，格局越完整。但不需要全部到齐，有三四颗就有成格的基础。'
      ]},
      { h: '君臣庆会的优势', ps: [
        '领导力强——你不是自己干，而是让别人帮你干。这是最高级的能力。',
        '团队完整——有执行的、有出主意的、有帮你开路的，什么角色都不缺。',
        '事业容易做大——因为你不是一个人在战斗，你能调动的资源比别人多。',
        '贵人运旺——天魁天钺让你在关键时刻总有人拉一把。'
      ]},
      { h: '君臣庆会的陷阱', ps: [
        '自负——众星捧月久了，你可能真觉得自己是皇帝，听不进反对意见。',
        '依赖团队——如果团队散了，你可能发现自己什么都不会。领导能力不等于个人能力。',
        '官僚主义——人多了就有流程，流程多了就低效。要防止团队变成官僚机构。',
        '煞星破格——如果三方有擎羊陀罗，团队里有小人；有空劫，可能众叛亲离。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：领导力最强、团队完整、事业容易成功。但要防自负。',
        '官禄宫：工作中有完整的团队支持、适合做CEO或高管。',
        '财帛宫：靠团队和人脉赚钱、适合做平台或生态。',
        '迁移宫：在外有贵人、适合去大平台发展。',
        '夫妻宫：配偶条件好、可能是你的贤内助或事业伙伴。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到君臣庆会，按这个顺序读：'], ol: [
        '先看紫微在哪个宫——命宫最好，官禄宫次之。',
        '数吉星——辅弼、昌曲、魁钺到了几颗？越多越完整。',
        '看有没有煞星——煞星会破坏团队和谐。',
        '看紫微的亮度——庙旺的紫微才是真皇帝，落陷的紫微是傀儡。',
        '君臣庆会的人要学会「尊重团队」——你的成就是团队给的，不是你一个人的。',
        '问自己：你是在「领导团队」还是「被团队捧着」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-zuofu-youbi.html', text: '左辅右弼' },
      { href: 'ziwei-wenchang-wenqu.html', text: '文昌文曲' },
      { href: 'ziwei-tiankui-tianyue.html', text: '天魁天钺' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Jun Chen Qing Hui is the most complete leadership pattern. Zi Wei is the emperor, but whether an emperor succeeds depends not on his own ability but on who\'s around him. This pattern is "the emperor with a complete team" — Zuo Fu/You Bi are his right and left hands, Wen Chang/Wen Qu are his brain trust, Tian Kui/Tian Yue are his benefactors. People with it are natural leaders, and most importantly: you don\'t fight alone.',
    enIntro2: 'Conditions: Zi Wei in Life, with Zuo Fu, You Bi, Wen Chang, Wen Qu, Tian Kui, Tian Yue gathering in the triple direction. More auspicious stars = more complete. Unlike Zi Fu Tong Gong (emperor in his treasury, resources but possibly no people), this is "emperor holding court" — all officials present.',
    enSections: [
      { h: 'Conditions', ps: [
        'Zi Wei in Life — the emperor must be on the throne.',
        'Zuo Fu/You Bi in triple direction — right and left hands, execution.',
        'Wen Chang/Wen Qu in triple direction — brain trust, strategy and documents.',
        'Tian Kui/Tian Yue in triple direction — benefactors, support at critical moments.',
        'More stars = more complete, but 3-4 is enough to form the pattern.'
      ]},
      { h: 'Advantages', ps: [
        'Strong leadership — you don\'t do it yourself, you get others to do it. The highest-level ability.',
        'Complete team — executors, strategists, door-openers, every role filled.',
        'Easy to scale — because you don\'t fight alone, you can mobilize more resources.',
        'Strong benefactor luck — Kui/Yue ensure someone pulls you up at key moments.'
      ]},
      { h: 'The Trap', ps: [
        'Overconfidence — after being surrounded by supporters, you may believe you\'re truly an emperor and stop listening.',
        'Dependence on team — if the team scatters, you may find you can\'t do anything alone. Leadership ≠ personal ability.',
        'Bureaucracy — more people means more process, more process means inefficiency.',
        'Malefics break the pattern — Qing Yang/Tuo Luo mean petty people on the team; Kong Jie may mean abandonment.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: strongest leadership, complete team, career success. Guard against ego.',
        'Career: full team support at work, suited to CEO or executive roles.',
        'Wealth: earning through team and connections, suited to platforms or ecosystems.',
        'Travel: benefactors away from home, suited to big platforms.',
        'Spouse: partner has good conditions, may be your helpmate or business partner.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Jun Chen Qing Hui:'], ol: [
        'Which palace is Zi Wei in — Life is best, Career second.',
        'Count auspicious stars — how many of Fu/Bi, Chang/Qu, Kui/Yue are present?',
        'Check malefics — they disrupt team harmony.',
        'Check Zi Wei\'s brightness — temple/prosperous Zi Wei is a real emperor; fallen is a puppet.',
        'Learn to respect the team — your achievements come from them, not you alone.',
        'Are you "leading the team" or "being carried by the team"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-zuofu-youbi.html', text: 'Zuo Fu & You Bi' },
      { href: 'ziwei-wenchang-wenqu.html', text: 'Wen Chang & Wen Qu' },
      { href: 'ziwei-tiankui-tianyue.html', text: 'Tian Kui & Tian Yue' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-caisan-jiaji',
    cnTitle: '紫微斗数财荫夹印格：天相被化禄和天梁夹住，稳中有财的格局',
    enTitle: 'Cai Yin Jia Yin: Tian Xiang Sandwiched by Hua Lu and Tian Liang — Stability with Wealth',
    cnDesc: '财荫夹印是天相在命宫，邻宫有化禄和天梁相夹的格局。主财运稳、有荫庇、事业有靠山，但要防「靠」字变成依赖。',
    enDesc: 'Cai Yin Jia Yin is when Tian Xiang in Life is sandwiched by Hua Lu and Tian Liang in adjacent palaces. It rules stable wealth, protection, and career backing, but guard against dependence.',
    cnLead: '财荫夹印是紫微斗数里最「有靠山」的格局之一。天相是印星，代表你自己；化禄是财星，从一边夹着你；天梁是荫星，从另一边夹着你。就像你坐在中间，左边是钱，右边是保护伞——这种人做事情特别稳，因为不管发生什么，你都有退路。但这个格局的问题也在一个「靠」字：靠久了，你可能忘了自己也能站着。',
    cnIntro2: '财荫夹印的成格条件：天相在命宫，相邻的两个宫（兄弟宫和父母宫，或者 whichever two palaces flank Life）一个有化禄，一个有天梁。化禄代表「财」，天梁代表「荫」，天相代表「印」，所以叫「财荫夹印」。这个格局强调的是「夹」——力量从两边来，把你护在中间。',
    cnSections: [
      { h: '成格条件', ps: [
        '天相在命宫——印星在主位。',
        '命宫的邻宫（兄弟宫和父母宫）一个有化禄，一个有天梁。',
        '化禄提供财务支持，天梁提供保护和荫庇。',
        '如果邻宫是化忌和天梁，则变成「刑囚夹印」，是凶格。'
      ]},
      { h: '财荫夹印的优势', ps: [
        '财运稳——化禄夹着你，赚钱不费劲，或者总有财路找上门。',
        '有靠山——天梁是荫星，遇到困难时有长辈、上司或制度保护你。',
        '事业稳——天相本身就是稳定的星，加化禄天梁，事业上不容易出大问题。',
        '适合体制内——有荫庇、有稳定收入、有制度保障，这种格局在大机构里最舒服。'
      ]},
      { h: '财荫夹印的陷阱', ps: [
        '依赖——靠山靠久了，你可能失去独立能力。一旦靠山倒了，你不知道怎么办。',
        '不冒险——因为太稳了，你可能错过高风险高回报的机会。',
        '被保护过度——天梁的荫庇可能变成「控制」，你以为有人在帮你，其实是在管你。',
        '化忌破格——如果邻宫有化忌而不是化禄，格局反转，变成财务压力和官司纠纷。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：财运稳、有靠山、事业顺利。但要防依赖。',
        '官禄宫：工作中有靠山、适合在大机构或家族企业发展。',
        '财帛宫：财运稳定、有被动收入或投资收益。',
        '田宅宫：家境好、有房产继承、家庭有荫庇。',
        '父母宫：父母有能力、能给你提供支持和资源。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到财荫夹印，按这个顺序读：'], ol: [
        '先确认天相在命宫——印星必须在主位。',
        '看邻宫是化禄还是化忌——化禄是财荫夹印，化忌是刑囚夹印。',
        '看天梁的亮度——天梁庙旺荫庇力强，落陷荫庇力弱。',
        '看有没有煞星——煞星会让靠山不稳。',
        '财荫夹印的人要学会「用靠山但不靠靠山」——借助资源发展自己的能力。',
        '问自己：你是在「利用资源成长」还是「躲在保护伞下不敢出来」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-tianxiang-zuoming.html', text: '天相坐命' },
      { href: 'ziwei-tianliang-zuoming.html', text: '天梁坐命' },
      { href: 'ziwei-hualu.html', text: '化禄星详解' },
      { href: 'ziwei-geju-fuxiang-chaoyuan.html', text: '府相朝垣格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Cai Yin Jia Yin is one of the most "backed" patterns. Tian Xiang is the seal star (you); Hua Lu is wealth on one side, Tian Liang is protection on the other. Like sitting with money on your left and an umbrella on your right — everything you do is steady because you always have a fallback. But the problem is the word "backed": rely on it too long, and you forget you can stand on your own.',
    enIntro2: 'Conditions: Tian Xiang in Life, with Hua Lu in one adjacent palace and Tian Liang in the other. Hua Lu = wealth, Tian Liang = protection, Tian Xiang = seal — hence "wealth-protection sandwich." The key is "sandwich": power comes from both sides, sheltering you in the middle.',
    enSections: [
      { h: 'Conditions', ps: [
        'Tian Xiang in Life — the seal star on the throne.',
        'Adjacent palaces (Siblings and Parents) have Hua Lu in one and Tian Liang in the other.',
        'Hua Lu provides financial support, Tian Liang provides protection.',
        'If the adjacent palace has Hua Ji instead of Hua Lu, it becomes "Xing Qiu Jia Yin" — an inauspicious pattern.'
      ]},
      { h: 'Advantages', ps: [
        'Stable wealth — Hua Lu sandwiches you, earning is effortless or opportunities find you.',
        'Backing — Tian Liang protects; when trouble comes, elders, bosses, or institutions shield you.',
        'Career stability — Tian Xiang is already steady; with Hua Lu/Tian Liang, career rarely has major problems.',
        'Suited to institutions — protection, stable income, institutional security; most comfortable in large organizations.'
      ]},
      { h: 'The Trap', ps: [
        'Dependence — after long reliance, you may lose independence. When the backing collapses, you don\'t know what to do.',
        'Risk aversion — too steady may cause you to miss high-risk, high-reward opportunities.',
        'Overprotection — Tian Liang\'s shelter can become control; you think someone\'s helping when they\'re managing you.',
        'Hua Ji reverses it — if the adjacent palace has Hua Ji instead of Hua Lu, the pattern flips to financial pressure and legal disputes.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: stable wealth, backing, smooth career. Guard against dependence.',
        'Career: backed at work, suited to large institutions or family businesses.',
        'Wealth: stable finances, passive income or investment returns.',
        'Property: good family background, inherited real estate, family protection.',
        'Parents: capable parents who provide support and resources.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Cai Yin Jia Yin:'], ol: [
        'Confirm Tian Xiang is in Life — the seal star must be central.',
        'Check whether the adjacent palace has Hua Lu or Hua Ji — Hua Lu = auspicious; Hua Ji = inauspicious.',
        'Check Tian Liang\'s brightness — temple/prosperous gives strong protection; fallen gives weak.',
        'Check malefics — they make backing unstable.',
        'Learn to "use backing without relying on it" — leverage resources to build your own ability.',
        'Are you "using resources to grow" or "hiding under the umbrella"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-tianxiang-zuoming.html', text: 'Tian Xiang in Life' },
      { href: 'ziwei-tianliang-zuoming.html', text: 'Tian Liang in Life' },
      { href: 'ziwei-hualu.html', text: 'Hua Lu Explained' },
      { href: 'ziwei-geju-fuxiang-chaoyuan.html', text: 'Fu Xiang Chao Yuan' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-lingchang-tuowu',
    cnTitle: '紫微斗数铃昌陀武格：凶格，主意外和波折，但可以提前防范',
    enTitle: 'Ling Chang Tuo Wu: An Inauspicious Pattern of Accidents and Setbacks — But Preventable',
    cnDesc: '铃昌陀武是铃星、文昌、陀罗、武曲四星会聚的凶格，主意外、波折和阻滞。但凶格不是注定出事，而是提醒你在关键年份要格外谨慎。',
    enDesc: 'Ling Chang Tuo Wu is an inauspicious pattern when Ling Xing, Wen Chang, Tuo Luo, and Wu Qu gather, ruling accidents and setbacks. But it doesn\'t guarantee disaster — it warns you to be extra cautious in key years.',
    cnLead: '铃昌陀武是紫微斗数里少数几个「听名字就觉得不好」的格局。铃星是火，陀罗是金，武曲也是金，文昌是金——四颗星凑在一起，金气极重，主「刀光剑影」。古人说「铃昌陀武，临危大险」，意思是走到这个格局的大运流年，容易出意外、波折、甚至危险。但紫微斗数的凶格从来不是「注定」，而是「预警」——它告诉你这段路要减速慢行。',
    cnIntro2: '铃昌陀武的成格条件：武曲在命宫或三方，三方四正同时有铃星、文昌、陀罗。四星会聚才成格。这个格局的关键是「同宫或三方会齐」——如果只有两三颗，力量不够。铃昌陀武跟其他凶格不同：它不是持续的凶，而是在大运流年走到特定位置时才引爆。',
    cnSections: [
      { h: '成格条件', ps: [
        '武曲在命宫或三方——武曲是将星，也是财星，金气重。',
        '三方四正同时有铃星、文昌、陀罗。',
        '四星会聚才成格，缺一颗力量大减。',
        '在辰、戌、丑、未宫（四库地）力量最强，因为金在库地更旺。'
      ]},
      { h: '铃昌陀武的表现', ps: [
        '意外——可能是身体上的意外受伤，也可能是计划外的突发事件。',
        '波折——事情做到一半出问题，需要反复折腾才能完成。',
        '阻滞——陀罗主拖延，铃星主突然，加在一起就是「突然卡住」。',
        '文书问题——文昌被煞星污染，可能签错合同、考试失利、文书出错。'
      ]},
      { h: '凶格不是注定', ps: [
        '紫微斗数的凶格是「天气预报」，不是「判决书」。它说明这段时间有风险，但你可以带伞。',
        '铃昌陀武在大运流年引动时最危险——平时可能没什么感觉，走到特定年份才爆发。',
        '化解方法：在引动的年份不要冒险——不投资、不冲动、不签大合同、不开快车、定期体检。',
        '加吉星（天魁天钺、解神、天德月德）能减轻风险，可能只是虚惊一场。'
      ]},
      { h: '怎么应对', ps: [
        '知道自己的「危险年份」——排盘后看大运流年什么时候引动铃昌陀武，提前做好准备。',
        '危险年份宜守不宜攻——不要创业、不要跳槽、不要大额投资、不要做危险活动。',
        '注意文书——签合同前仔细看，考试前多准备，不要在文书上马虎。',
        '注意安全——开车小心、运动适量、定期体检，不要心存侥幸。',
        '多做善事——天德月德等德星能化解凶格，行善积德是最好的「保险」。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到铃昌陀武，按这个顺序读：'], ol: [
        '先确认四星是否会齐——缺一颗就不成格，不要自己吓自己。',
        '看在哪个宫位——命宫影响性格，官禄宫影响事业，迁移宫影响出行安全。',
        '看什么时候引动——大运流年走到辰戌丑未或武曲的位置时要小心。',
        '看有没有吉星——吉星能减轻风险。',
        '凶格的意义是「提醒」不是「判决」——知道风险在哪里，就能提前防范。',
        '问自己：你是在「被凶格吓到」还是「用凶格做风险管理」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-wuqu-zuoming.html', text: '武曲坐命' },
      { href: 'ziwei-qingyang-tuoluo.html', text: '擎羊陀罗' },
      { href: 'ziwei-huoxing-lingxing.html', text: '火星铃星' },
      { href: 'ziwei-tiande-yuede.html', text: '天德月德' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Ling Chang Tuo Wu is one of the few patterns that sounds bad just from the name. Ling Xing is fire, Tuo Luo is metal, Wu Qu is metal, Wen Chang is metal — four stars together create extremely heavy metal energy, ruling "blades and conflict." The ancients said "Ling Chang Tuo Wu, great danger at the precipice." But inauspicious patterns in Zi Wei Dou Shu are never "fated" — they\'re warnings telling you to slow down on this stretch of road.',
    enIntro2: 'Conditions: Wu Qu in Life or triple direction, with Ling Xing, Wen Chang, and Tuo Luo all in the triple direction. All four must gather. The key is that it\'s not continuously dangerous — it detonates when major cycles or annual cycles pass through specific positions.',
    enSections: [
      { h: 'Conditions', ps: [
        'Wu Qu in Life or triple direction — the general/wealth star with heavy metal energy.',
        'Ling Xing, Wen Chang, and Tuo Luo all present in the triple direction.',
        'All four must gather; missing one greatly reduces power.',
        'Strongest in Chen, Xu, Chou, Wei (the four storage palaces) where metal is more potent.'
      ]},
      { h: 'Manifestations', ps: [
        'Accidents — physical injury or unplanned sudden events.',
        'Setbacks — problems mid-process, requiring repeated effort to complete.',
        'Obstruction — Tuo Luo delays, Ling Xing is sudden; together they mean "suddenly stuck."',
        'Document problems — Wen Chang tainted by malefics may mean signing bad contracts, exam failures, paperwork errors.'
      ]},
      { h: 'Not Fated', ps: [
        'Inauspicious patterns are "weather forecasts," not "verdicts." They signal risk, but you can bring an umbrella.',
        'Most dangerous when activated by major/annual cycles — may feel fine normally, then erupt in specific years.',
        'Mitigation: in activation years, don\'t take risks — no investments, no impulses, no big contracts, no fast driving, get regular checkups.',
        'With auspicious stars (Kui/Yue, Jie Shen, Tian De/Yue De), risk is reduced — may be just a false alarm.'
      ]},
      { h: 'How to Handle It', ps: [
        'Know your "danger years" — after casting, see when cycles activate the pattern and prepare.',
        'In danger years, defend don\'t attack — no entrepreneurship, no job changes, no big investments, no dangerous activities.',
        'Watch documents — read contracts carefully, prepare extra for exams, don\'t be careless with paperwork.',
        'Safety first — drive carefully, exercise moderately, get checkups, don\'t rely on luck.',
        'Do good — virtue stars (Tian De/Yue De) dissolve inauspicious patterns; kindness is the best insurance.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Ling Chang Tuo Wu:'], ol: [
        'Confirm all four stars gather — missing one means no pattern, don\'t scare yourself.',
        'Which palace — Life affects character, Career affects work, Travel affects safety.',
        'When does it activate — be careful when cycles pass through Chen/Xu/Chou/Wei or Wu Qu positions.',
        'Check auspicious stars — they reduce risk.',
        'The pattern\'s meaning is "reminder," not "verdict" — knowing the risk lets you prevent it.',
        'Are you "scared by the pattern" or "using it for risk management"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-wuqu-zuoming.html', text: 'Wu Qu in Life' },
      { href: 'ziwei-qingyang-tuoluo.html', text: 'Qing Yang & Tuo Luo' },
      { href: 'ziwei-huoxing-lingxing.html', text: 'Huo Xing & Ling Xing' },
      { href: 'ziwei-tiande-yuede.html', text: 'Tian De & Yue De' },
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
          <p class="article-meta"><span>${enTag}</span><span><time datetime="${date}">2026-08-19 10:15</time></span></p>
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
          <p class="article-meta"><span>${cnTag}</span><span><time datetime="${date}">2026-08-19 10:15</time></span></p>
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
