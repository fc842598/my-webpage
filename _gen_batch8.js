const fs = require('fs');
const path = require('path');
const date = '2026-08-17T10:15:00+08:00';
function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

const articles = [
  {
    slug: 'ziwei-hongluan-tianxi', cat: 'helper',
    cnTitle: '紫微斗数红鸾天喜：正桃花星，有这两颗星的人感情有喜事',
    enTitle: 'Hong Luan and Tian Xi: The Positive Romance Stars',
    cnDesc: '红鸾天喜是正桃花星，主姻缘、喜庆和人缘。命宫或夫妻宫有红鸾天喜，感情运好、容易遇到正缘，但也要防烂桃花。',
    enDesc: 'Hong Luan and Tian Xi are positive romance stars, ruling marriage, celebration, and popularity. In Life or Spouse, they bring good romance luck and true love, but watch for bad suitors.',
    cnLead: '红鸾天喜是紫微斗数里最「喜庆」的两颗星。命宫有红鸾的人，通常长得好看、人缘好、异性缘旺；夫妻宫有天喜的人，容易遇到正缘、婚姻顺利。但红鸾天喜不是「有就一定好」——桃花旺也意味着选择多，选择多就容易挑花眼。',
    cnIntro2: '红鸾属阴水，天喜属阳水（一说红鸾属木）。红鸾主「正桃花」——正经的姻缘、恋爱、结婚；天喜主「喜庆」——喜事、人缘、开心的事。两颗星永远在三合相会。红鸾天喜跟咸池天姚不同：前者是正桃花，后者是桃花煞。',
    cnSections: [
      { h: '红鸾和天喜的区别', ps: [
        '红鸾偏「姻缘」——恋爱、结婚、正缘。红鸾入命的人异性缘好，容易早婚或遇到条件好的对象。',
        '天喜偏「喜庆」——开心的事、人缘、社交。天喜入命的人性格开朗、朋友多、走到哪里都受欢迎。',
        '两颗都有最好——既有正缘又有人缘。只有红鸾可能桃花多但不一定开心，只有天喜可能人缘好但感情不一定顺。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：长相好看、人缘好、异性缘旺。但加煞星可能感情波折多。',
        '夫妻宫：最适合的位置之一——容易遇到好对象、婚姻顺利。但红鸾在夫妻宫也可能配偶桃花旺。',
        '迁移宫：在外有桃花、出门遇喜事、适合在外地发展感情。',
        '财帛宫：靠人缘赚钱、适合做跟美和社交有关的行业。',
        '福德宫：心态乐观、容易开心、有桃花运带来的好心情。'
      ]},
      { h: '红鸾天喜和咸池天姚的区别', ps: [
        '红鸾天喜是「正桃花」——正经的恋爱和婚姻，遇到的是可以结婚的对象。',
        '咸池天姚是「桃花煞」——偏桃花、烂桃花、露水情缘，遇到的可能是过客或麻烦。',
        '命宫同时有红鸾和咸池，叫「桃花混杂」——正缘和烂桃花都有，需要学会分辨。如果红鸾旺咸池弱，正缘多；咸池旺红鸾弱，烂桃花多。'
      ]},
      { h: '流年红鸾天喜', ps: [
        '流年红鸾入命宫或夫妻宫，这一年容易遇到正缘、恋爱、结婚。单身的人这一年脱单概率高。',
        '流年天喜入命，这一年喜事多——可能是结婚、生子、升职、搬家等开心的事。',
        '但红鸾天喜流年也可能「冲」——如果流年红鸾冲夫妻宫，这一年感情有变动，可能是结婚也可能是分手。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到红鸾天喜，按这个顺序读：'], ol: [
        '先看在哪个宫位——夫妻宫最好，命宫次之。',
        '看是红鸾还是天喜——红鸾主姻缘，天喜主喜庆。',
        '看有没有咸池天姚同宫——桃花混杂要分辨正缘烂桃花。',
        '看有没有煞星——加擎羊陀罗感情有波折，加空劫桃花落空。',
        '看流年——红鸾天喜入命或夫妻宫的年份是感情关键年。',
        '问自己：你的桃花是「正缘」还是「热闹」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-xianchi-tianyao.html', text: '咸池天姚' },
      { href: 'ziwei-tiankui-tianyue.html', text: '天魁天钺' },
      { href: 'ziwei-fuqigong.html', text: '夫妻宫怎么看' },
      { href: 'ziwei-tianma-xing.html', text: '天马星' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Hong Luan and Tian Xi are the most festive stars. Hong Luan in Life usually means good looks, popularity, and strong appeal; Tian Xi in Spouse means meeting the right person and smooth marriage. But they don\'t guarantee happiness — more romance means more choices, and more choices mean easier to pick wrong.',
    enIntro2: 'Hong Luan is Yin Water, ruling proper romance — dating, marriage, true love. Tian Xi is Yang Water, ruling celebration — happy events, popularity, social ease. They always meet in triple combination. Unlike Xian Chi/Tian Yao (romance malefics), these are positive romance stars.',
    enSections: [
      { h: 'The Difference', ps: [
        'Hong Luan leans toward marriage — dating, wedding, the right partner. People with it have strong opposite-sex appeal and may marry early or well.',
        'Tian Xi leans toward celebration — happy events, friends, popularity. People with it are cheerful, sociable, welcome everywhere.',
        'Both together is best — true love plus popularity. Only Hong Luan may mean many suitors but not happiness; only Tian Xi may mean popularity but rocky romance.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: attractive, popular, strong appeal. With malefics, romantic ups and downs.',
        'Spouse: one of the best placements — meeting a good partner, smooth marriage. But Hong Luan here may also mean the spouse has many suitors.',
        'Travel: romance away from home, happy events when traveling, good for long-distance relationships.',
        'Wealth: earning through popularity, suited to beauty and social industries.',
        'Mental: optimistic, easily happy, good mood from romance.'
      ]},
      { h: 'vs Xian Chi and Tian Yao', ps: [
        'Hong Luan/Tian Xi are positive romance — proper dating and marriage, marriageable partners.',
        'Xian Chi/Tian Yao are romance malefics — casual flings, bad suitors, passing affairs.',
        'Having both in Life is "mixed romance" — both true and bad suitors. If Hong Luan dominates, more true love; if Xian Chi dominates, more bad romance.'
      ]},
      { h: 'Annual Activation', ps: [
        'Annual Hong Luan entering Life or Spouse: high chance of meeting someone, dating, or marrying. Singles have a high probability of coupling up.',
        'Annual Tian Xi entering Life: many celebrations — wedding, birth, promotion, moving.',
        'But they can also "clash" — if annual Hong Luan clashes the Spouse palace, relationship changes that year: could be marriage or breakup.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hong Luan/Tian Xi:'], ol: [
        'Which palace — Spouse is best, Life second.',
        'Hong Luan or Tian Xi — marriage vs celebration.',
        'Check Xian Chi/Tian Yao in the same palace — mixed romance needs discernment.',
        'Check malefics — Qing Yang/Tuo Luo = romantic turbulence; Kong Jie = romance fizzles.',
        'Check annual cycles — years when they enter Life/Spouse are key for romance.',
        'Is your romance "the one" or just "a lot going on"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-xianchi-tianyao.html', text: 'Xian Chi & Tian Yao' },
      { href: 'ziwei-tiankui-tianyue.html', text: 'Tian Kui & Tian Yue' },
      { href: 'ziwei-fuqigong.html', text: 'The Spouse Palace' },
      { href: 'ziwei-tianma-xing.html', text: 'Tian Ma Star' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-xianchi-tianyao', cat: 'helper',
    cnTitle: '紫微斗数咸池天姚：桃花煞，魅力大但要防烂桃花',
    enTitle: 'Xian Chi and Tian Yao: The Romance Malefics',
    cnDesc: '咸池天姚是桃花煞，主魅力、情欲和偏桃花。有这两颗星的人异性缘极强，但容易遇到烂桃花或感情纠葛。',
    enDesc: 'Xian Chi and Tian Yao are romance malefics, ruling charm, desire, and casual romance. They bring enormous appeal but risk of bad suitors and romantic entanglement.',
    cnLead: '咸池天姚是紫微斗数里最「撩人」的两颗星。命宫有咸池的人，天生有一种性魅力，不用刻意打扮就吸引异性；天姚入命的人，风情万种、情商高、很会拿捏关系。但这两颗星是「桃花煞」——魅力是真的，麻烦也是真的。',
    cnIntro2: '咸池属阴水（一说属金），天姚属阴水。咸池主「沐浴桃花」——情欲、魅力、偏桃花；天姚主「风情」——妩媚、情商、社交手段。两颗星跟红鸾天喜不同：红鸾是正桃花，咸池天姚是偏桃花、烂桃花。',
    cnSections: [
      { h: '咸池和天姚的区别', ps: [
        '咸池偏「情欲魅力」——天生的性吸引力、异性缘、容易有暧昧关系。咸池入命的人可能自己没觉得，但异性就是容易被你吸引。',
        '天姚偏「风情手段」——会打扮、会说话、情商高、很懂怎么跟异性相处。天姚入命的人在社交场合如鱼得水。',
        '两颗都有最「撩人」——既有天生魅力又有手段。但也最容易陷入复杂的感情关系。'
      ]},
      { h: '桃花煞的麻烦', ps: [
        '咸池天姚最大的问题是「烂桃花」——遇到的人可能是有妇之夫、只想玩玩的、或者骗钱骗色的。你的魅力吸引来的不一定是好人。',
        '在夫妻宫，配偶可能桃花旺、容易有外遇，或者你自己在婚姻中容易被外人吸引。',
        '在命宫，你可能同时被多个人追求，选择困难；或者你自己容易在感情中「骑驴找马」。'
      ]},
      { h: '桃花煞也有好处', ps: [
        '咸池天姚不是只有坏处。魅力和情商用在对的地方，是巨大的优势。',
        '做销售、公关、演艺、服务行业的人，有咸池天姚如虎添翼——你的魅力能转化成业绩。',
        '咸池天姚加吉星（尤其是化科），魅力变成了「个人品牌」——别人喜欢你不是因为色，而是因为你的气质和能力。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：魅力强、异性缘旺、但感情容易复杂。',
        '夫妻宫：配偶桃花旺或自己在婚姻中有外心。要注意婚姻经营。',
        '迁移宫：在外魅力更强、出门遇桃花、适合在外地发展。',
        '财帛宫：靠魅力和社交赚钱、适合做跟美和人有关的行业。',
        '福德宫：精神上追求刺激和浪漫、容易有暗恋或暧昧。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到咸池天姚，按这个顺序读：'], ol: [
        '先看在哪个宫位——命宫和夫妻宫影响最大。',
        '看是咸池还是天姚——咸池主情欲魅力，天姚主风情手段。',
        '看有没有红鸾天喜——正桃花和偏桃花混杂，要分辨。',
        '看有没有吉星——加化科化禄，魅力转化成能力和财富。',
        '看有没有煞星——加擎羊陀罗，感情纠纷升级；加空劫，桃花落空。',
        '问自己：你的魅力是「优势」还是「麻烦」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-hongluan-tianxi.html', text: '红鸾天喜' },
      { href: 'ziwei-fuqigong.html', text: '夫妻宫怎么看' },
      { href: 'ziwei-tianma-xing.html', text: '天马星' },
      { href: 'ziwei-qingyang-tuoluo.html', text: '擎羊陀罗' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Xian Chi and Tian Yao are the most alluring stars. Xian Chi in Life gives natural sex appeal; Tian Yao gives charm, high EQ, and relationship skill. But these are romance malefics — the charm is real, and so is the trouble.',
    enIntro2: 'Xian Chi is Yin Water (some say Metal), ruling sensual charm and casual romance. Tian Yao is Yin Water, ruling allure, social skill, and flirtation. Unlike Hong Luan/Tian Xi (positive romance), these are偏桃花 — casual or problematic suitors.',
    enSections: [
      { h: 'The Difference', ps: [
        'Xian Chi leans toward sensual appeal — natural sex attraction, strong opposite-sex pull, easy暧昧. You may not notice it, but others are drawn to you.',
        'Tian Yao leans toward charm and skill — well-dressed, well-spoken, high EQ, knows how to work a room. Socially unstoppable.',
        'Both together is most alluring — natural charm plus skill. But also most prone to complicated relationships.'
      ]},
      { h: 'The Trouble', ps: [
        'The biggest problem is bad suitors — married people, players, scammers. Your charm doesn\'t filter for quality.',
        'In Spouse: the partner may have many suitors or be unfaithful, or you yourself may be tempted outside marriage.',
        'In Life: multiple suitors simultaneously, choice paralysis, or "riding a donkey to find a horse" in relationships.'
      ]},
      { h: 'The Upside', ps: [
        'It isn\'t all bad. Charm and EQ, used right, are enormous advantages.',
        'In sales, PR, entertainment, service — Xian Chi/Tian Yao are superpowers, converting charm into results.',
        'With auspicious stars (especially Hua Ke), charm becomes personal brand — people like you for your aura and ability, not just looks.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: strong charm, huge appeal, but relationships tend to be complicated.',
        'Spouse: partner has many suitors or you\'re tempted outside. Marriage needs work.',
        'Travel: even more alluring away from home, romance on the road.',
        'Wealth: earning through charm and social skill, suited to beauty and people industries.',
        'Mental: craves excitement and romance, prone to crushes and暧昧.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Xian Chi/Tian Yao:'], ol: [
        'Which palace — Life and Spouse have the biggest impact.',
        'Xian Chi or Tian Yao — sensual appeal vs charm and skill.',
        'Check Hong Luan/Tian Xi — mixed positive and casual romance needs discernment.',
        'Check auspicious stars — Hua Ke/Hua Lu turn charm into ability and wealth.',
        'Check malefics — Qing Yang/Tuo Luo escalate disputes; Kong Jie makes romance fizzle.',
        'Is your charm an advantage or a trouble magnet?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-hongluan-tianxi.html', text: 'Hong Luan & Tian Xi' },
      { href: 'ziwei-fuqigong.html', text: 'The Spouse Palace' },
      { href: 'ziwei-tianma-xing.html', text: 'Tian Ma Star' },
      { href: 'ziwei-qingyang-tuoluo.html', text: 'Qing Yang & Tuo Luo' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tianma-xing', cat: 'helper',
    cnTitle: '紫微斗数天马星：动星，有天马的人闲不住，动中得财',
    enTitle: 'Tian Ma Star: The Moving Star',
    cnDesc: '天马星主变动、奔波和行动力。命宫有天马的人闲不住、适合动中求财，但也可能一生漂泊不定。',
    enDesc: 'Tian Ma rules movement, travel, and action. People with it in Life can\'t sit still and thrive on earning through movement, but may also drift through life.',
    cnLead: '天马星是紫微斗数里最「闲不住」的星。命宫有天马的人，让你坐办公室一天你会疯——你需要动、需要跑、需要变化。天马不是「辛苦」的意思，它是「动中得财」——越跑越有钱，越动越有机会。但天马也有一个问题：你可能一辈子都在跑，却不知道自己要去哪。',
    cnIntro2: '天马属阳火（一说属水），主变动、奔波、行动力。天马跟禄存配合叫「禄马交驰」，是最好的财格之一——靠动中求财。天马如果没有禄存配合，叫「天马空载」——跑得很辛苦但没赚到钱。',
    cnSections: [
      { h: '天马的核心含义', ps: [
        '天马主「动」——身体上的动（出差、旅行、搬家）和思想上的动（想法多、变化快、坐不住）。',
        '天马入命的人通常精力旺盛、行动力强、不喜欢一成不变。你适合做需要经常跑动的工作——销售、物流、贸易、记者、导游。',
        '天马也主「变化」——你的人生可能比别人多几次大的变动：搬家、换工作、换城市。这不是坏事，每次变动都可能带来新机会。'
      ]},
      { h: '禄马交驰和天马空载', ps: [
        '天马加禄存（或化禄）叫「禄马交驰」——动中得财，越跑越有钱。这是紫微斗数里最好的财格之一。适合做贸易、物流、跨国生意。',
        '如果有天马但没有禄存，叫「天马空载」——跑得很辛苦但赚不到钱，或者赚了钱存不住。这种人需要主动找「禄」来配——找一个能赚钱的方向再跑。',
        '天马加化忌叫「马化龙」——跑动中有损失，可能是出差被骗、搬家破财、或者奔波中出意外。这种时候不宜远行或做大变动。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：闲不住、行动力强、一生多变动。适合动中求财。',
        '迁移宫：在外发展更好、出门遇机会、适合离开家乡。',
        '财帛宫：靠跑动赚钱、适合做贸易物流销售。',
        '夫妻宫：配偶可能经常出差、或者感情有变动（异地恋、聚少离多）。',
        '官禄宫：工作需要经常跑动、适合做外勤或业务。'
      ]},
      { h: '天马和煞星', ps: [
        '天马加擎羊叫「战马」——动中有冲突，可能在跑动中跟人吵架或出意外。',
        '天马加陀罗叫「拖马」——想动但动不了，或者动得很慢很拖。',
        '天马加火铃叫「火马」——动得很急很猛，可能突然出差、突然搬家、或者做事太急出错。',
        '天马加空劫叫「空马」——跑动中一场空，可能白跑一趟。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天马，按这个顺序读：'], ol: [
        '先看在哪个宫位——迁移宫和财帛宫最好。',
        '看有没有禄存或化禄——禄马交驰最好，天马空载要找方向。',
        '看有没有化忌——马化龙要防跑动中的损失。',
        '看煞星——擎羊主冲突，陀罗主拖延，火铃主急躁，空劫主白跑。',
        '看大运流年——天马被引动的年份适合出差、搬家、换工作。',
        '问自己：你是在「有方向地跑」还是「为了跑而跑」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-lucun-xing.html', text: '禄存星' },
      { href: 'ziwei-qianyigong.html', text: '迁移宫怎么看' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-hongluan-tianxi.html', text: '红鸾天喜' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian Ma is the most restless star. With it in Life, sitting at a desk all day drives you crazy — you need to move, travel, change. It doesn\'t mean hardship; it means earning through movement — the more you go, the more you make. But the problem is: you may run your whole life without knowing where you\'re going.',
    enIntro2: 'Tian Ma is Yang Fire (some say Water), ruling change, travel, and action. With Lu Cun it forms "Lu Ma galloping" — one of the best wealth patterns, earning through movement. Without Lu Cun it\'s "empty horse" — running hard with nothing to show.',
    enSections: [
      { h: 'Core Meaning', ps: [
        'Tian Ma rules movement — physical (travel, moving house) and mental (many ideas, quick changes, can\'t sit still).',
        'People with it are energetic, action-oriented, hate routine. Suited to sales, logistics, trade, journalism, tour guiding.',
        'It also rules change — more major life shifts: moving, job changes, new cities. Each shift can bring opportunity.'
      ]},
      { h: 'Lu Ma Galloping vs Empty Horse', ps: [
        'Tian Ma with Lu Cun (or Hua Lu) is "Lu Ma galloping" — earning through movement, the more you go the richer. One of the best wealth patterns. Suited to trade, logistics, international business.',
        'Without Lu Cun: "empty horse" — running hard but earning little, or earning but not saving. You need to actively find a "Lu" — a profitable direction before running.',
        'With Hua Ji: "horse turning into dragon" — losses through movement, scams while traveling, moving-house losses, or accidents on the road. Avoid long trips and big changes then.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: restless, action-oriented, many changes. Suited to earning through movement.',
        'Travel: better development away from home, opportunities when going out, suited to leaving hometown.',
        'Wealth: earning through running around, suited to trade/logistics/sales.',
        'Spouse: partner travels often, or relationship has changes (long-distance, time apart).',
        'Career: job requires travel, suited to field work or business.'
      ]},
      { h: 'Tian Ma and Malefics', ps: [
        'With Qing Yang: "war horse" — conflict in movement, arguments or accidents while traveling.',
        'With Tuo Luo: "dragging horse" — wanting to move but can\'t, or moving very slowly.',
        'With Huo Ling: "fire horse" — moving too fast, sudden trips or moves, or mistakes from rushing.',
        'With Kong Jie: "empty horse" — running for nothing, wasted trips.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tian Ma:'], ol: [
        'Which palace — Travel and Wealth are best.',
        'Check Lu Cun/Hua Lu — Lu Ma galloping is best; empty horse needs direction.',
        'Check Hua Ji — horse-dragon warns of losses through movement.',
        'Check malefics — Qing Yang = conflict, Tuo Luo = delay, Huo Ling = rushing, Kong Jie = wasted trips.',
        'Check cycles — years when Tian Ma activates are good for travel, moving, job changes.',
        'Are you running with direction or just running?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-lucun-xing.html', text: 'Lu Cun Star' },
      { href: 'ziwei-qianyigong.html', text: 'The Travel Palace' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-hongluan-tianxi.html', text: 'Hong Luan & Tian Xi' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tianxing-xing', cat: 'helper',
    cnTitle: '紫微斗数天刑星：刑星，主法律、伤灾和原则',
    enTitle: 'Tian Xing Star: The Punishment Star',
    cnDesc: '天刑星主法律、刑伤和原则。命宫有天刑的人有正义感、适合法律行业，但也要防官非和意外伤害。',
    enDesc: 'Tian Xing rules law, injury, and principle. People with it have a strong sense of justice and suit legal careers, but must guard against lawsuits and accidents.',
    cnLead: '天刑星是紫微斗数里最「讲原则」的星。命宫有天刑的人，黑白分明、有正义感、眼里揉不得沙子。你适合做法律、纪检、医生、军警——任何需要「按规矩来」的行业。但天刑也主「刑伤」——可能是官司、手术、外伤，你的原则性太强也容易得罪人。',
    cnIntro2: '天刑属阳火（一说属金），主刑律、伤灾、原则。天刑跟擎羊不同：擎羊是「明刀明枪」的冲突，天刑是「规则和法律」的约束。天刑入命的人不一定会有官司，但你一定是个「讲规矩」的人。',
    cnSections: [
      { h: '天刑的核心含义', ps: [
        '天刑主「原则」和「规则」。天刑入命的人有强烈的是非观，做事情有底线，不喜欢灰色地带。',
        '天刑也主「法律」和「医疗」——适合做律师、法官、医生、警察、纪检。这些行业的共同点是「按规则办事」。',
        '天刑还主「刑伤」——手术、外伤、官司。天刑在疾厄宫的人可能需要做手术，在官禄宫的人可能跟法律打交道多。'
      ]},
      { h: '天刑在十二宫', ps: [
        '命宫：讲原则、有正义感、适合法律医疗行业。但性格可能太刚直。',
        '官禄宫：工作跟法律或医疗有关、或者工作中需要严格遵守规则。',
        '疾厄宫：注意手术和外伤、可能有慢性病需要长期治疗。',
        '迁移宫：在外容易有官非或意外、出门要注意安全和守法。',
        '夫妻宫：配偶可能是法律或医疗行业、或者婚姻中有法律相关的事（如婚前协议）。'
      ]},
      { h: '天刑和吉星', ps: [
        '天刑加化科叫「刑星化科」——适合走学术或专业路线，在法律或医学领域有名声。',
        '天刑加天魁天钺——遇到官非时有贵人帮忙，或者能遇到好律师好医生。',
        '天刑加昌曲——口才和文笔好，适合做律师或写法律文书。',
        '天刑加化禄——靠法律或医疗赚钱，专业能力能变现。'
      ]},
      { h: '天刑和煞星', ps: [
        '天刑加擎羊叫「刑杖交加」——最容易有官非或外伤的组合，要特别注意守法和安全。',
        '天刑加陀罗——官司或疾病拖延，可能长期纠缠。',
        '天刑加火铃——急性外伤或突发官非，事情来得很急。',
        '天刑加空劫——虚惊一场，看起来有官司但最后没事。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天刑，按这个顺序读：'], ol: [
        '先看在哪个宫位——疾厄宫和官禄宫影响最大。',
        '看有没有化科——刑星化科适合走专业路线。',
        '看有没有天魁天钺——有贵人在官非或疾病时帮忙。',
        '看有没有擎羊——刑杖交加要防官非外伤。',
        '看大运流年——天刑被引动的年份要注意守法和安全。',
        '问自己：你的原则是「底线」还是「固执」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-qingyang-tuoluo.html', text: '擎羊陀罗' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-jieshen-xing.html', text: '解神星' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian Xing is the most principled star. With it in Life, you see black and white clearly, have a strong sense of justice, and can\'t tolerate gray areas. You suit law, discipline, medicine, police — any field where rules matter. But Tian Xing also rules "punishment and injury" — lawsuits, surgery, accidents. Your principles can also make you offend people.',
    enIntro2: 'Tian Xing is Yang Fire (some say Metal), ruling law, injury, and principle. Unlike Qing Yang\'s open conflict, Tian Xing is about rules and legal constraints. People with it won\'t necessarily have lawsuits, but they definitely play by the rules.',
    enSections: [
      { h: 'Core Meaning', ps: [
        'Tian Xing rules principle and rules. People with it have a strong moral compass, clear bottom lines, dislike gray areas.',
        'It also rules law and medicine — suited to lawyer, judge, doctor, police, inspector. The common thread: doing things by the book.',
        'It also rules punishment and injury — surgery, accidents, lawsuits. In Health, may need surgery; in Career, frequent legal dealings.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: principled, just, suited to law/medicine. But may be too rigid.',
        'Career: work related to law or medicine, or requires strict compliance.',
        'Health: watch for surgery and accidents, may have chronic conditions needing long-term treatment.',
        'Travel: prone to lawsuits or accidents away from home, be careful and law-abiding when traveling.',
        'Spouse: partner may be in law/medicine, or marriage involves legal matters (prenups).'
      ]},
      { h: 'With Auspicious Stars', ps: [
        'With Hua Ke: "punishment star transforming to recognition" — suited to academia or expertise, reputation in law or medicine.',
        'With Kui/Yue: benefactors help in lawsuits or illness, good lawyers/doctors appear.',
        'With Chang/Qu: eloquent and well-written, suited to litigation or legal writing.',
        'With Hua Lu: earning through law or medicine, expertise monetized.'
      ]},
      { h: 'With Malefics', ps: [
        'With Qing Yang: "punishment and cane together" — most prone to lawsuits or accidents, be extra law-abiding and safe.',
        'With Tuo Luo: lawsuits or illness drag on, long-term entanglement.',
        'With Huo Ling: acute injury or sudden lawsuit, things happen fast.',
        'With Kong Jie: a false alarm — looks like a lawsuit but nothing comes of it.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tian Xing:'], ol: [
        'Which palace — Health and Career have the biggest impact.',
        'Check Hua Ke — punishment-turned-recognition suits a professional path.',
        'Check Kui/Yue — benefactors help in lawsuits or illness.',
        'Check Qing Yang — punishment-cane warns of lawsuits and injury.',
        'Check cycles — years when Tian Xing activates require law-abiding and safety awareness.',
        'Is your principle a bottom line or stubbornness?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-qingyang-tuoluo.html', text: 'Qing Yang & Tuo Luo' },
      { href: 'ziwei-jieegong.html', text: 'The Health Palace' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-jieshen-xing.html', text: 'Jie Shen Star' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-jieshen-xing', cat: 'helper',
    cnTitle: '紫微斗数解神星：化解星，有解神的人逢凶能化吉',
    enTitle: 'Jie Shen Star: The Dissolving Star',
    cnDesc: '解神星主化解、消灾和转机。命宫有解神的人遇到困难总能找到出路，但也可能「大事化小」而忽视真正的问题。',
    enDesc: 'Jie Shen rules resolution, disaster-dissolving, and turning points. People with it always find a way out of trouble, but may also minimize real problems by "making a big deal small."',
    cnLead: '解神星是紫微斗数里最「会解决问题」的星。命宫有解神的人，遇到困难不慌——你总能找到办法、找到台阶、找到转圜的余地。别人觉得走投无路的事，你三两下就化解了。但解神也有一个问题：你太会「大事化小」了，有时候真正严重的问题被你化没了，等到爆发时已经来不及。',
    cnIntro2: '解神属阳木（一说属水），主化解、消灾、转机。解神跟天刑是一对——天刑是「找麻烦」，解神是「解决麻烦」。命宫有解神的人，一生中有「逢凶化吉」的运气，但这种运气不是凭空来的，是你善于找方法、找台阶、找中间路线。',
    cnSections: [
      { h: '解神的核心含义', ps: [
        '解神主「化解」——把大事化小、小事化了。解神入命的人善于调解矛盾、解决纠纷、找到折中方案。',
        '解神也主「转机」——在看似绝望的时候出现新的可能性。你可能在最低谷时遇到一个人、一件事，把局面扭转过来。',
        '解神还主「消灾」——有解神的人遇到意外或疾病时，往往能化险为夷。但这不是说你不会遇到灾，而是遇到了能解。'
      ]},
      { h: '解神在十二宫', ps: [
        '命宫：善于解决问题、有逢凶化吉的运气、适合做调解或中介。',
        '夫妻宫：感情有矛盾时能化解、婚姻不容易走到离婚。但也可能把问题压下来不解决。',
        '疾厄宫：生病时能遇到好医生、疾病有转机、但也要防拖延治疗。',
        '官禄宫：工作中遇到危机能化解、适合做公关或危机处理。',
        '财帛宫：破财后能挽回、投资亏损有转机。'
      ]},
      { h: '解神和天刑', ps: [
        '解神和天刑是对星。天刑主「刑」——官司、纠纷、伤灾；解神主「解」——化解、调解、消灾。',
        '如果命宫有天刑，三方有解神，叫「有刑有解」——虽然会遇到麻烦，但总能解决。这是好配置。',
        '如果有天刑但没有解神，叫「有刑无解」——遇到麻烦可能比较难化解，需要主动寻求帮助。',
        '解神加天魁天钺，化解能力最强——遇到困难时有贵人帮忙解决。'
      ]},
      { h: '解神的陷阱', ps: [
        '解神最大的问题是「大事化小」。你太会化解了，以至于有时候把真正严重的问题也化没了——比如身体不舒服你觉得没事，感情有裂痕你觉得能过去。',
        '解神入命的人要学会「该大的事不要化小」——有些问题需要面对而不是化解。',
        '解神加化忌，化解能力打折——遇到困难时解决起来比较费力，或者化解了又反复。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到解神，按这个顺序读：'], ol: [
        '先看在哪个宫位——哪个领域有化解能力。',
        '看有没有天刑——有刑有解最好，有刑无解要注意。',
        '看有没有天魁天钺——贵人加解神，消灾能力最强。',
        '看有没有化忌——化解能力打折，遇到困难要更主动。',
        '看大运流年——解神被引动的年份适合解决积压的问题。',
        '问自己：你是在「解决问题」还是「逃避问题」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-tianxing-xing.html', text: '天刑星' },
      { href: 'ziwei-tiankui-tianyue.html', text: '天魁天钺' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-fuqigong.html', text: '夫妻宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Jie Shen is the best problem-solving star. With it in Life, you don\'t panic in trouble — you always find a way, a loophole, a middle ground. What others see as a dead end, you resolve in minutes. But the problem is: you\'re so good at making big things small that sometimes you dissolve genuinely serious issues too, and by the time they erupt it\'s too late.',
    enIntro2: 'Jie Shen is Yang Wood (some say Water), ruling resolution, disaster-dissolving, and turning points. It pairs with Tian Xing — Tian Xing brings trouble, Jie Shen solves it. People with it have "turning misfortune into blessing" luck, but it comes from skill at finding solutions, compromises, and exit ramps.',
    enSections: [
      { h: 'Core Meaning', ps: [
        'Jie Shen rules dissolving — making big things small, small things gone. People with it excel at mediation, conflict resolution, finding compromise.',
        'It also rules turning points — new possibilities appearing when all seems lost. At your lowest, you may meet someone or something that turns the situation around.',
        'It also rules disaster-dissolving — accidents and illnesses tend to resolve. Not that you avoid them, but you can resolve them when they come.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: good at problem-solving, disaster-averting luck, suited to mediation or brokerage.',
        'Spouse: conflicts can be resolved, marriage rarely reaches divorce. But may suppress problems instead of solving them.',
        'Health: find good doctors when ill, illnesses have turning points — but watch for delaying treatment.',
        'Career: can resolve work crises, suited to PR or crisis management.',
        'Wealth: can recover losses, investment losses may turn around.'
      ]},
      { h: 'Jie Shen and Tian Xing', ps: [
        'They are paired stars. Tian Xing rules punishment — lawsuits, disputes, injuries. Jie Shen rules resolution — mediation, dissolution, disaster-averting.',
        'If Life has Tian Xing and triple has Jie Shen: "punishment with resolution" — trouble comes but always gets solved. A good setup.',
        'If Tian Xing without Jie Shen: "punishment without resolution" — trouble may be hard to solve, actively seek help.',
        'Jie Shen with Kui/Yue: strongest resolution ability — benefactors help solve difficulties.'
      ]},
      { h: 'The Trap', ps: [
        'The biggest problem is minimizing. You\'re so good at dissolving that you dissolve genuinely serious issues too — a health symptom you dismiss, a relationship crack you think will pass.',
        'Learn "don\'t make big things small when they shouldn\'t be" — some problems need facing, not dissolving.',
        'With Hua Ji: resolution ability reduced — harder to solve difficulties, or problems recur after being solved.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Jie Shen:'], ol: [
        'Which palace — where you have resolution ability.',
        'Check Tian Xing — punishment with resolution is best; without it, be careful.',
        'Check Kui/Yue — benefactor plus Jie Shen gives strongest disaster-averting.',
        'Check Hua Ji — reduced resolution, be more proactive in difficulties.',
        'Check cycles — years when Jie Shen activates are good for resolving backlogged issues.',
        'Are you solving problems or avoiding them?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-tianxing-xing.html', text: 'Tian Xing Star' },
      { href: 'ziwei-tiankui-tianyue.html', text: 'Tian Kui & Tian Yue' },
      { href: 'ziwei-jieegong.html', text: 'The Health Palace' },
      { href: 'ziwei-fuqigong.html', text: 'The Spouse Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-guchen-guasu', cat: 'helper',
    cnTitle: '紫微斗数孤辰寡宿：孤星，有这两颗星的人独立但要防孤独',
    enTitle: 'Gu Chen and Gua Su: The Lone Stars',
    cnDesc: '孤辰寡宿主孤独、独立和精神追求。命宫有这两颗星的人独立自主、有精神世界，但也容易跟人保持距离。',
    enDesc: 'Gu Chen and Gua Su rule loneliness, independence, and spiritual pursuit. People with them are self-reliant with rich inner lives, but tend to keep others at a distance.',
    cnLead: '孤辰寡宿是紫微斗数里最「独」的两颗星。命宫有孤辰的人，从小就比同龄人独立——别人还在撒娇的时候你已经自己做决定了；寡宿入命的人，精神世界丰富但不轻易让人进来。这两颗星不是「命不好」，它们是「精神贵族」的标志——你不需要很多人，但你需要真正懂你的人。',
    cnIntro2: '孤辰属阳火，寡宿属阴火。孤辰主「孤独」和「独立」——凡事靠自己、不喜欢求人；寡宿主「寡合」和「精神追求」——跟大众合不来、喜欢独处和思考。两颗星永远在三合相会。男怕孤辰，女怕寡宿——但这只是传统说法，实际上孤辰寡宿也有很多好处。',
    cnSections: [
      { h: '孤辰和寡宿的区别', ps: [
        '孤辰偏「独立」——凡事自己来、不喜欢麻烦别人、一个人也能过得很好。孤辰入命的人可能从小就离家或跟家人不亲。',
        '寡宿偏「精神孤独」——有丰富的内心世界但不轻易分享、跟周围的人格格不入、喜欢独处。寡宿入命的人可能有宗教或哲学倾向。',
        '两颗都有最「独」——既独立又精神孤独。你可能朋友不多但每个都是知己。'
      ]},
      { h: '孤辰寡宿的好处', ps: [
        '独立能力强——别人需要团队才能做的事你一个人就能搞定。',
        '精神世界丰富——你有自己的爱好、思考和追求，不需要靠社交来填充时间。',
        '不容易被外界影响——你有自己的判断和节奏，不会随波逐流。',
        '适合做研究、写作、艺术、技术——需要独处和专注的工作。'
      ]},
      { h: '孤辰寡宿的挑战', ps: [
        '跟人保持距离——你可能不是不想亲近，而是不知道怎么亲近。亲密关系中你可能让对方觉得「走不进你的心」。',
        '容易错失机会——因为你不喜欢求人，很多需要人脉的机会你就错过了。',
        '老年可能孤独——年轻时觉得一个人挺好，年纪大了可能会想要陪伴。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：独立、有精神追求、朋友少而精。但要防过于孤僻。',
        '夫妻宫：感情中容易有距离感、可能晚婚或独居。需要学会表达感情。',
        '福德宫：精神世界丰富、喜欢独处思考、可能有宗教信仰。',
        '兄弟/交友宫：跟朋友和兄弟姐妹关系淡、不喜欢社交。',
        '田宅宫：喜欢一个人住、或者家里布置得很有个人风格。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到孤辰寡宿，按这个顺序读：'], ol: [
        '先看在哪个宫位——命宫和夫妻宫影响最大。',
        '看是孤辰还是寡宿——孤辰主独立，寡宿主精神孤独。',
        '看有没有红鸾天喜——有桃花星能化解孤独感。',
        '看有没有天魁天钺——有贵人能打破孤独。',
        '看有没有煞星——加空劫孤独感更强，加火铃可能性格孤僻暴躁。',
        '问自己：你的「独立」是「强大」还是「封闭」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-hongluan-tianxi.html', text: '红鸾天喜' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-fuqigong.html', text: '夫妻宫怎么看' },
      { href: 'ziwei-huagai-xing.html', text: '华盖星' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Gu Chen and Gua Su are the loneliest stars. Gu Chen in Life means independence from childhood — making your own decisions while others still need their parents. Gua Su means a rich inner world that few are allowed into. These aren\'t "bad fate" — they\'re the mark of a spiritual aristocrat: you don\'t need many people, but you need ones who truly understand you.',
    enIntro2: 'Gu Chen is Yang Fire, ruling loneliness and independence — self-reliant, hates asking for help. Gua Su is Yin Fire, ruling social detachment and spiritual pursuit — doesn\'t fit in, enjoys solitude and reflection. They always meet in triple combination. Tradition says men fear Gu Chen and women fear Gua Su, but both have real advantages.',
    enSections: [
      { h: 'The Difference', ps: [
        'Gu Chen leans toward independence — doing everything yourself, hate bothering others, fine alone. May have left home young or be distant from family.',
        'Gua Su leans toward spiritual loneliness — rich inner world but hard to share, feels out of step with others, enjoys solitude. May have religious or philosophical leanings.',
        'Both together is most alone — independent and spiritually solitary. You may have few friends but each is a kindred spirit.'
      ]},
      { h: 'The Advantages', ps: [
        'Strong independence — what others need a team for, you handle alone.',
        'Rich inner life — your own hobbies, thoughts, pursuits; you don\'t need socializing to fill time.',
        'Not easily influenced — your own judgment and rhythm, don\'t follow the crowd.',
        'Suited to research, writing, art, tech — work requiring solitude and focus.'
      ]},
      { h: 'The Challenges', ps: [
        'Keeping distance — you may not dislike closeness but don\'t know how to be close. In relationships, partners may feel they can\'t reach your heart.',
        'Missing opportunities — because you hate asking for help, you pass up chances that need connections.',
        'Possible loneliness in old age — fine alone when young, but may want companionship later.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: independent, spiritual, few but close friends. Guard against excessive isolation.',
        'Spouse: distance in relationships, may marry late or live alone. Learn to express feelings.',
        'Mental: rich inner world, enjoys solitude and thought, may be religious.',
        'Siblings/Friends: distant from friends and siblings, dislike socializing.',
        'Property: enjoys living alone, or home decorated with strong personal style.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Gu Chen/Gua Su:'], ol: [
        'Which palace — Life and Spouse have the biggest impact.',
        'Gu Chen or Gua Su — independence vs spiritual loneliness.',
        'Check Hong Luan/Tian Xi — romance stars dissolve feelings of loneliness.',
        'Check Kui/Yue — benefactors break through isolation.',
        'Check malefics — Kong Jie intensifies loneliness; Huo Ling may make you withdrawn and irritable.',
        'Is your independence strength or self-isolation?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-hongluan-tianxi.html', text: 'Hong Luan & Tian Xi' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-fuqigong.html', text: 'The Spouse Palace' },
      { href: 'ziwei-huagai-xing.html', text: 'Hua Gai Star' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-santai-bazuo', cat: 'helper',
    cnTitle: '紫微斗数三台八座：贵星，有这两颗星的人有地位有排场',
    enTitle: 'San Tai and Ba Zuo: The Status Stars',
    cnDesc: '三台八座主地位、排场和威仪。命宫有这两颗星的人气质出众、容易获得社会地位，但也可能好面子讲排场。',
    enDesc: 'San Tai and Ba Zuo rule status, ceremony, and dignity. People with them have outstanding presence and easily gain social standing, but may also be面子-conscious and extravagant.',
    cnLead: '三台八座是紫微斗数里最「有排场」的两颗星。命宫有三台的人，气质稳重、说话有分量；八座入命的人，讲究体面、喜欢有品质的生活。这两颗星是「贵气」的辅助——它们不直接给你权力和财富，但它们让你看起来像个「人物」。',
    cnIntro2: '三台属阳土，八座属阴土。三台主「威仪」和「地位」，八座主「排场」和「享受」。两颗星永远在三合相会。三台八座跟紫微配合最好——紫微是帝星，三台八座是帝王的仪仗，有了它们紫微才像真皇帝。',
    cnSections: [
      { h: '三台和八座的区别', ps: [
        '三台偏「威仪」——气质稳重、说话有分量、在群体中容易被重视。三台入命的人可能不怒自威。',
        '八座偏「排场」——讲究生活品质、喜欢有面子的东西、在意外界的评价。八座入命的人可能对衣食住行有要求。',
        '两颗都有最「贵」——既有威仪又有排场，走到哪里都像个人物。'
      ]},
      { h: '三台八座和紫微', ps: [
        '三台八座对紫微星最重要。紫微是帝星，但如果没有三台八座、左辅右弼，就是「孤君」——有皇帝的位子但没有皇帝的排场。',
        '紫微加三台八座叫「紫微辅弼」的一部分——帝星有了仪仗，贵气十足。这种人在社会上容易获得地位和尊重。',
        '如果命宫不是紫微，但有三台八座，也主「贵气」——你可能不是领导，但你有领导的气质和排场。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：气质出众、有威仪、讲究体面。适合做管理或需要形象的工作。',
        '官禄宫：事业上有地位、容易升职、适合做管理层。',
        '迁移宫：在外有排场、出门受人尊重、适合在大城市发展。',
        '财帛宫：花钱讲究品质、可能为了面子花大钱。',
        '夫妻宫：配偶有地位或气质、或者婚姻讲究门当户对。'
      ]},
      { h: '三台八座的陷阱', ps: [
        '好面子——你可能为了维持「体面」而超支，或者为了排场做不划算的决定。',
        '讲排场——八座入命的人可能在衣食住行上要求太高，导致存不住钱。',
        '端着——三台入命的人可能太在意「形象」，不敢示弱、不敢求助，活得累。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到三台八座，按这个顺序读：'], ol: [
        '先看在哪个宫位——命宫和官禄宫最好。',
        '看有没有紫微——紫微加三台八座贵气最足。',
        '看有没有左辅右弼——辅弼加三台八座，地位和助力都有。',
        '看有没有化禄化权——贵气加上实权和财富。',
        '看有没有空劫——空劫会让排场落空，看起来贵但实际没那么好。',
        '问自己：你的「体面」是「实力」还是「包装」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-zuofu-youbi.html', text: '左辅右弼' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-tiankui-tianyue.html', text: '天魁天钺' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'San Tai and Ba Zuo are the most ceremonial stars. San Tai in Life gives steady presence and weighty speech; Ba Zuo gives taste and a love of quality. These are auxiliary "nobility" stars — they don\'t directly give power or wealth, but they make you look like someone who matters.',
    enIntro2: 'San Tai is Yang Earth, ruling dignity and status. Ba Zuo is Yin Earth, ruling ceremony and enjoyment. They always meet in triple combination. They matter most with Zi Wei — the emperor needs his imperial procession; with them, Zi Wei looks like a true emperor.',
    enSections: [
      { h: 'The Difference', ps: [
        'San Tai leans toward dignity — steady presence, weighty speech, easily respected in groups. May have an imposing aura without trying.',
        'Ba Zuo leans toward ceremony — quality of life, likes fine things, cares about others\' opinions. May have high standards for food, clothing, housing, transport.',
        'Both together is most noble — dignity plus ceremony, looks like a VIP everywhere.'
      ]},
      { h: 'With Zi Wei', ps: [
        'They matter most for Zi Wei. Zi Wei is the emperor, but without San Tai/Ba Zuo and Zuo Fu/You Bi, he\'s a lonely ruler — has the throne but no procession.',
        'Zi Wei with San Tai/Ba Zuo is part of the "Zi Wei assisted" pattern — full imperial nobility. These people easily gain status and respect in society.',
        'If Life isn\'t Zi Wei but has San Tai/Ba Zuo, it still means nobility — you may not be the boss, but you have a boss\'s bearing and presence.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: outstanding presence, dignified, cares about image. Suited to management or image-based work.',
        'Career: status at work, easy promotion, suited to management.',
        'Travel: ceremony away from home, respected when out, suited to big cities.',
        'Wealth: spends on quality, may overspend for面子.',
        'Spouse: partner has status or bearing, or marriage讲究 social standing.'
      ]},
      { h: 'The Trap', ps: [
        'Face-conscious — may overspend to maintain "image," or make bad decisions for ceremony.',
        'Extravagance — Ba Zuo people may have too-high standards and can\'t save.',
        'Putting on airs — San Tai people may care too much about "image,"不敢 show weakness or ask for help, exhausting.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see San Tai/Ba Zuo:'], ol: [
        'Which palace — Life and Career are best.',
        'Check Zi Wei — Zi Wei plus them gives fullest nobility.',
        'Check Zuo Fu/You Bi — assistants plus them gives status and support.',
        'Check Hua Lu/Hua Quan — nobility plus real power and wealth.',
        'Check Kong Jie — makes ceremony hollow, looks noble but isn\'t really.',
        'Is your "dignity" substance or packaging?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-zuofu-youbi.html', text: 'Zuo Fu & You Bi' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-tiankui-tianyue.html', text: 'Tian Kui & Tian Yue' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-huagai-xing', cat: 'helper',
    cnTitle: '紫微斗数华盖星：艺术宗教星，有华盖的人聪明但孤傲',
    enTitle: 'Hua Gai Star: The Art and Religion Star',
    cnDesc: '华盖星主艺术、宗教和孤傲。命宫有华盖的人聪明有才华、有精神追求，但也容易跟世俗格格不入。',
    enDesc: 'Hua Gai rules art, religion, and aloofness. People with it are intelligent and talented with spiritual pursuits, but may feel out of step with the mundane world.',
    cnLead: '华盖星是紫微斗数里最「仙气」的星。命宫有华盖的人，从小就跟别人不一样——你可能对宗教、哲学、艺术有天然的兴趣，对世俗的功名利禄不太上心。华盖的人聪明、有才华、有灵气，但也容易孤傲——不是你看不起别人，是你跟别人想的不在一个频道。',
    cnIntro2: '华盖属阳木（一说属土），主艺术、宗教、孤傲和玄学。华盖原本是帝王出门时的伞盖，象征「高高在上」。命宫有华盖的人，精神世界在高处，不容易跟世俗的人产生共鸣。',
    cnSections: [
      { h: '华盖的核心含义', ps: [
        '华盖主「艺术」和「才华」——有华盖的人通常有某种艺术天赋，可能是音乐、绘画、写作、设计。',
        '华盖也主「宗教」和「玄学」——对佛道、命理、神秘学有兴趣，可能有信仰或修行。',
        '华盖还主「孤傲」——精神上的高处不胜寒。你可能觉得没人懂你，或者你不屑于跟不懂的人解释。'
      ]},
      { h: '华盖在十二宫', ps: [
        '命宫：有艺术或宗教天赋、聪明但孤傲。适合做创意、研究、修行类工作。',
        '福德宫：精神世界丰富、喜欢独处思考、可能有宗教信仰。',
        '官禄宫：工作跟艺术或宗教有关、或者在工作中特立独行。',
        '夫妻宫：感情中追求精神共鸣、可能晚婚或跟配偶精神不同步。',
        '迁移宫：在外有独特气质、适合去文化或宗教圣地。'
      ]},
      { h: '华盖和孤辰寡宿', ps: [
        '华盖跟孤辰寡宿有相似之处——都主孤独和精神追求。但华盖偏「才华和灵性」，孤辰寡宿偏「独立和不合群」。',
        '华盖加孤辰寡宿叫「僧道命」——对世俗生活兴趣不大，适合出家、修行、或者做跟精神有关的工作。',
        '但这不是说你一定要出家。华盖加吉星（尤其是化禄化科），才华可以变现——做艺术家、设计师、作家都能成功。'
      ]},
      { h: '华盖的陷阱', ps: [
        '孤傲——你可能觉得「众人皆醉我独醒」，但有时候是你自己把自己架高了。',
        '不接地气——华盖的人可能对柴米油盐不感兴趣，导致生活能力差或者财务混乱。',
        '精神内耗——你想的太多、太深，容易陷入虚无主义或抑郁。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到华盖，按这个顺序读：'], ol: [
        '先看在哪个宫位——命宫和福德宫影响最大。',
        '看有没有化禄化科——才华能变现，适合做艺术或创意行业。',
        '看有没有孤辰寡宿——僧道命，精神追求重。',
        '看有没有文昌文曲——才华加表达能力，适合写作或艺术创作。',
        '看有没有空劫——精神追求更强，但也要防脱离现实。',
        '问自己：你的「仙气」是「才华」还是「逃避」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-guchen-guasu.html', text: '孤辰寡宿' },
      { href: 'ziwei-wenchang-wenqu.html', text: '文昌文曲' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-dikong-dijie.html', text: '地空地劫' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Hua Gai is the most ethereal star. With it in Life, you\'ve been different from childhood — naturally drawn to religion, philosophy, art, unmoved by worldly fame and gain. Hua Gai people are smart, talented, inspired — but also aloof. Not that you look down on others, but you\'re simply not on the same wavelength.',
    enIntro2: 'Hua Gai is Yang Wood (some say Earth), ruling art, religion, aloofness, and mysticism. Originally the imperial umbrella, it symbolizes being "high above." People with it have their spiritual world on a high place, hard to resonate with ordinary folks.',
    enSections: [
      { h: 'Core Meaning', ps: [
        'Hua Gai rules art and talent — usually gifted in music, painting, writing, or design.',
        'It also rules religion and mysticism — interest in Buddhism, Taoism, astrology, the occult; may have faith or practice.',
        'It also rules aloofness — spiritual高处不胜寒. You may feel no one understands you, or not bother explaining to those who don\'t.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: artistic or religious talent, smart but aloof. Suited to creative, research, spiritual work.',
        'Mental: rich inner world, enjoys solitude and thought, may be religious.',
        'Career: work related to art or religion, or unconventional at work.',
        'Spouse: seeks spiritual connection in love, may marry late or be out of sync with partner.',
        'Travel: unique aura away from home, suited to cultural or religious sites.'
      ]},
      { h: 'With Gu Chen/Gua Su', ps: [
        'Similar — both rule loneliness and spiritual pursuit. But Hua Gai leans toward talent and inspiration; Gu Chen/Gua Su lean toward independence and nonconformity.',
        'Hua Gai plus Gu Chen/Gua Su is "monk/nun fate" — little interest in worldly life, suited to monastic life, spiritual practice, or spirit-related work.',
        'This doesn\'t mean you must become a monk. With auspicious stars (especially Hua Lu/Hua Ke), talent monetizes — artists, designers, writers can succeed.'
      ]},
      { h: 'The Trap', ps: [
        'Aloofness — you may feel "everyone is drunk, I alone am awake," but sometimes you\'ve just put yourself on a pedestal.',
        'Un-grounded — may not care about practical matters, leading to poor life skills or financial chaos.',
        'Mental friction — thinking too much and too deep, prone to nihilism or depression.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Gai:'], ol: [
        'Which palace — Life and Mental have the biggest impact.',
        'Check Hua Lu/Hua Ke — talent can monetize, suited to art or creative industries.',
        'Check Gu Chen/Gua Su — monk/nun fate, heavy spiritual pursuit.',
        'Check Chang/Qu — talent plus expression, suited to writing or art.',
        'Check Kong Jie — stronger spiritual pursuit, but guard against losing touch with reality.',
        'Is your "ethereal quality" talent or escapism?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-guchen-guasu.html', text: 'Gu Chen & Gua Su' },
      { href: 'ziwei-wenchang-wenqu.html', text: 'Wen Chang & Wen Qu' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-dikong-dijie.html', text: 'Di Kong & Di Jie' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-longchi-fengge', cat: 'helper',
    cnTitle: '紫微斗数龙池凤阁：才艺星，有这两颗星的人有审美有品位',
    enTitle: 'Long Chi and Feng Ge: The Talent and Taste Stars',
    cnDesc: '龙池凤阁主才艺、审美和品位。命宫有这两颗星的人有艺术天赋、审美出众，但也可能眼高手低。',
    enDesc: 'Long Chi and Feng Ge rule talent, aesthetics, and taste. People with them have artistic gift and outstanding taste, but may also be high-eyed-low-handed.',
    cnLead: '龙池凤阁是紫微斗数里最「有品位」的两颗星。命宫有龙池的人，对美有天生的敏感度，穿衣服、选东西、布置家都比别人有品味；凤阁入命的人，有艺术才华，可能会某种乐器、绘画或手工艺。这两颗星不直接给你财富，但它们让你的生活有「质感」。',
    cnIntro2: '龙池属阳水，凤阁属阳土。龙池主「审美」和「鉴赏力」，凤阁主「才艺」和「创造力」。两颗星永远在三合相会。龙池凤阁跟文昌文曲不同：昌曲主「学问和考试」，龙池凤阁主「艺术和品位」。',
    cnSections: [
      { h: '龙池和凤阁的区别', ps: [
        '龙池偏「审美」——对美的敏感度高、鉴赏力强、穿衣服有品味、选东西有眼光。龙池入命的人可能不是艺术家，但你一定是个「有品位的消费者」。',
        '凤阁偏「才艺」——有某种艺术或手工艺天赋，可能会画画、弹琴、做手工、或者对美食有研究。凤阁入命的人适合做跟创意和手艺有关的工作。',
        '两颗都有最好——既有审美又有才艺，能创造美也能欣赏美。'
      ]},
      { h: '龙池凤阁和文昌文曲', ps: [
        '文昌文曲主「学问」——读书、考试、文书、学历。龙池凤阁主「艺术」——审美、才艺、品位、手艺。',
        '昌曲是「硬实力」——证书、学历、专业知识。龙池凤阁是「软实力」——气质、审美、艺术感觉。',
        '昌曲加龙池凤阁叫「文武双全」——既有学问又有才艺，是最理想的配置。适合做学者型艺术家或者有文化底蕴的设计师。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：有审美有才艺、气质出众、生活有品质。适合做设计、艺术、时尚行业。',
        '夫妻宫：配偶有才艺或审美、或者你对配偶的外貌气质要求高。',
        '田宅宫：家里布置得有品味、喜欢美的家居环境。',
        '福德宫：精神追求美和艺术、喜欢美的事物。',
        '官禄宫：工作跟艺术或设计有关、或者在工作中注重品质和美感。'
      ]},
      { h: '龙池凤阁的陷阱', ps: [
        '眼高手低——你审美很高但动手能力可能跟不上，导致对自己的作品不满意。',
        '挑剔——因为你有品位，你可能对别人的审美看不上，导致人际关系中的「优越感」。',
        '不实用——你可能为了美而牺牲实用，比如买好看但不舒服的家具。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到龙池凤阁，按这个顺序读：'], ol: [
        '先看在哪个宫位——命宫和田宅宫影响最大。',
        '看有没有文昌文曲——学问加才艺，文武双全。',
        '看有没有化科——审美和才艺能带来名声。',
        '看有没有空劫——审美更独特但可能脱离大众。',
        '看有没有煞星——加擎羊陀罗，才艺可能走偏或有技术瓶颈。',
        '问自己：你的「品位」是「优势」还是「挑剔」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-wenchang-wenqu.html', text: '文昌文曲' },
      { href: 'ziwei-huagai-xing.html', text: '华盖星' },
      { href: 'ziwei-tianzhaigong.html', text: '田宅宫怎么看' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Long Chi and Feng Ge are the most tasteful stars. Long Chi in Life gives natural sensitivity to beauty — your clothes, choices, home all have better taste than others. Feng Ge gives artistic talent — you may play an instrument, paint, or craft. They don\'t directly bring wealth, but they give your life texture.',
    enIntro2: 'Long Chi is Yang Water, ruling aesthetics and connoisseurship. Feng Ge is Yang Earth, ruling talent and creativity. They always meet in triple combination. Unlike Wen Chang/Wen Qu (scholarship and exams), Long Chi/Feng Ge rule art and taste.',
    enSections: [
      { h: 'The Difference', ps: [
        'Long Chi leans toward aesthetics — high sensitivity to beauty, strong connoisseurship, stylish dressing, good eye for things. You may not be an artist, but you\'re definitely a "tasteful consumer."',
        'Feng Ge leans toward talent — some artistic or craft gift, may paint, play music, craft, or research food. Suited to creative and craft work.',
        'Both together is best — aesthetics plus talent, can create and appreciate beauty.'
      ]},
      { h: 'vs Wen Chang/Wen Qu', ps: [
        'Chang/Qu rule scholarship — reading, exams, documents, degrees. Long Chi/Feng Ge rule art — aesthetics, talent, taste, craft.',
        'Chang/Qu are "hard power" — certificates, degrees, expertise. Long Chi/Feng Ge are "soft power" — aura, aesthetics, artistic sense.',
        'Chang/Qu plus Long Chi/Feng Ge is "both civil and martial" — scholarship plus talent, the ideal setup. Suited to scholar-artists or cultured designers.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: aesthetic and talented, outstanding aura, quality of life. Suited to design, art, fashion.',
        'Spouse: partner has talent or taste, or you have high standards for partner\'s appearance and bearing.',
        'Property: home decorated with taste, loves beautiful living spaces.',
        'Mental: spiritually pursues beauty and art, loves beautiful things.',
        'Career: work related to art or design, or values quality and aesthetics at work.'
      ]},
      { h: 'The Trap', ps: [
        'High-eyed-low-handed — your aesthetics are high but your execution may not match, leaving you dissatisfied with your own work.',
        'Picky — because you have taste, you may look down on others\' aesthetics, creating a sense of superiority in relationships.',
        'Impractical — may sacrifice function for beauty, like buying beautiful but uncomfortable furniture.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Long Chi/Feng Ge:'], ol: [
        'Which palace — Life and Property have the biggest impact.',
        'Check Chang/Qu — scholarship plus talent, both civil and martial.',
        'Check Hua Ke — aesthetics and talent can bring reputation.',
        'Check Kong Jie — more unique taste but may be out of step with the mainstream.',
        'Check malefics — Qing Yang/Tuo Luo may make talent go astray or hit technical bottlenecks.',
        'Is your "taste" an advantage or pickiness?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-wenchang-wenqu.html', text: 'Wen Chang & Wen Qu' },
      { href: 'ziwei-huagai-xing.html', text: 'Hua Gai Star' },
      { href: 'ziwei-tianzhaigong.html', text: 'The Property Palace' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-tianku-tianxu', cat: 'helper',
    cnTitle: '紫微斗数天哭天虚：情绪星，有这两颗星的人感性但要防内耗',
    enTitle: 'Tian Ku and Tian Xu: The Emotional Stars',
    cnDesc: '天哭天虚主情绪、悲观和空虚。命宫有这两颗星的人感性细腻、有同理心，但也容易想太多、情绪低落。',
    enDesc: 'Tian Ku and Tian Xu rule emotion, pessimism, and emptiness. People with them are sensitive and empathetic, but prone to overthinking and low mood.',
    cnLead: '天哭天虚是紫微斗数里最「感性」的两颗星。命宫有天哭的人，泪点低、同理心强、看个电影能哭半天；天虚入命的人，容易有空虚感、觉得什么都没意义。这两颗星不是「不好」——它们让你有丰富的情感世界和艺术感受力，但你需要学会不让情绪把自己淹没。',
    cnIntro2: '天哭属阳金，天虚属阴土。天哭主「悲伤」和「感性」——容易感动、容易哭、同理心强；天虚主「空虚」和「不实际」——容易觉得没意义、想得多做得少。两颗星永远在三合相会。',
    cnSections: [
      { h: '天哭和天虚的区别', ps: [
        '天哭偏「感性」——泪点低、容易被感动、有同理心、适合做跟人有关的工作。天哭入命的人可能是朋友里的「情绪垃圾桶」。',
        '天虚偏「空虚」——容易有虚无感、觉得什么都没意义、想得多做得少。天虚入命的人可能经常问「人活着是为了什么」。',
        '两颗都有最「感性」——既容易感动又容易空虚，情绪起伏比较大。'
      ]},
      { h: '天哭天虚的好处', ps: [
        '同理心强——你能感受到别人的情绪，适合做心理咨询、护理、社工、教育。',
        '艺术感受力强——感性的人通常有艺术天赋，适合做写作、音乐、表演。',
        '有深度——天虚的人会思考人生的意义，不容易流于肤浅。'
      ]},
      { h: '天哭天虚的挑战', ps: [
        '情绪内耗——你可能因为别人的一句话、一个眼神而难过半天，或者陷入无意义的思考中出不来。',
        '悲观——天哭天虚的人容易看到事情的负面，还没做就觉得会失败。',
        '行动力差——天虚的人想得多做得少，很多好想法停留在脑子里。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：感性细腻、有同理心、但情绪容易低落。适合做跟人或艺术有关的工作。',
        '福德宫：精神世界丰富但容易空虚、需要找到精神寄托。',
        '夫妻宫：感情中容易多愁善感、可能因为小事难过。需要学会直接表达需求。',
        '疾厄宫：注意情绪相关的健康问题——失眠、焦虑、抑郁。',
        '迁移宫：在外容易想家、或者在外地情绪低落。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到天哭天虚，按这个顺序读：'], ol: [
        '先看在哪个宫位——命宫和福德宫影响最大。',
        '看有没有化禄化权——有目标和行动力能化解空虚感。',
        '看有没有天魁天钺——有贵人能在情绪低落时拉你一把。',
        '看有没有火铃——火铃能增加行动力，但也可能让情绪更急躁。',
        '看有没有空劫——空虚感更强，需要找到精神寄托。',
        '问自己：你的「感性」是「共情力」还是「内耗」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: '辅曜煞曜总览' },
      { href: 'ziwei-guchen-guasu.html', text: '孤辰寡宿' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-jieegong.html', text: '疾厄宫怎么看' },
      { href: 'ziwei-huagai-xing.html', text: '华盖星' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Tian Ku and Tian Xu are the most emotional stars. Tian Ku in Life means a low tear threshold, strong empathy, crying at movies. Tian Xu means a tendency toward emptiness, feeling nothing matters, thinking more than doing. These aren\'t "bad" — they give you a rich emotional world and artistic sensitivity, but you need to learn not to let emotions drown you.',
    enIntro2: 'Tian Ku is Yang Metal, ruling sadness and sensitivity — easily moved, tearful, empathetic. Tian Xu is Yin Earth, ruling emptiness and impracticality — existential feelings, more thinking than doing. They always meet in triple combination.',
    enSections: [
      { h: 'The Difference', ps: [
        'Tian Ku leans toward sensitivity — low tear threshold, easily moved, empathetic, suited to people-focused work. May be the "emotional trash can" among friends.',
        'Tian Xu leans toward emptiness — existential feelings, nothing seems meaningful, more thinking than doing. May often ask "what is the point of living."',
        'Both together is most emotional — easily moved and easily empty, bigger mood swings.'
      ]},
      { h: 'The Advantages', ps: [
        'Strong empathy — you feel others\' emotions, suited to counseling, nursing, social work, education.',
        'Artistic sensitivity — emotional people usually have artistic talent, suited to writing, music, performance.',
        'Depth — Tian Xu people think about life\'s meaning, not easily superficial.'
      ]},
      { h: 'The Challenges', ps: [
        'Emotional friction — you may feel down for half a day over someone\'s word or look, or get stuck in meaningless thinking.',
        'Pessimism — tend to see the negative side, feeling it will fail before trying.',
        'Low action — Tian Xu people think much but do little, many good ideas stay in the head.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: sensitive and empathetic, but prone to low mood. Suited to people or art work.',
        'Mental: rich inner world but prone to emptiness, need to find spiritual anchor.',
        'Spouse: sentimental in relationships, may get upset over small things. Learn to express needs directly.',
        'Health: watch emotion-related issues — insomnia, anxiety, depression.',
        'Travel: prone to homesickness or low mood when away.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Tian Ku/Tian Xu:'], ol: [
        'Which palace — Life and Mental have the biggest impact.',
        'Check Hua Lu/Hua Quan — goals and action dissolve feelings of emptiness.',
        'Check Kui/Yue — benefactors pull you up when mood is low.',
        'Check Huo Ling — increases action but may make emotions more impatient.',
        'Check Kong Jie — stronger emptiness, need to find spiritual anchor.',
        'Is your sensitivity empathy or self-consuming?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-helper-malice-stars.html', text: 'Helper & Malice Stars' },
      { href: 'ziwei-guchen-guasu.html', text: 'Gu Chen & Gua Su' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-jieegong.html', text: 'The Health Palace' },
      { href: 'ziwei-huagai-xing.html', text: 'Hua Gai Star' },
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
  const articleSection = isEn ? 'Zi Wei Dou Shu' : '辅煞曜';
  const aboutCn = '辅曜煞曜';
  const aboutEn = 'Helper and Malice Stars';

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
          <p class="article-meta"><span>${enTag}</span><span><time datetime="${date}">2026-08-17 10:15</time></span></p>
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
          <p class="article-meta"><span>${cnTag}</span><span><time datetime="${date}">2026-08-17 10:15</time></span></p>
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
