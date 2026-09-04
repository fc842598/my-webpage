const fs = require('fs');
const path = require('path');

const date = '2026-08-14T10:15:00+08:00';

function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

const articles = [
  {
    slug: 'ziwei-xiongdigong-huaji',
    cnTitle: '紫微斗数兄弟宫化忌：兄弟姐妹靠不靠，化忌在兄弟怎么看',
    enTitle: 'Siblings Palace With Hua Ji: Can You Rely on Brothers and Sisters?',
    cnDesc: '兄弟宫化忌，兄弟姐妹缘分薄或关系有结，也可能因兄弟破财。化忌不是无兄弟，是关系中有执念或亏欠。',
    enDesc: 'Hua Ji in the Siblings Palace means thin or tangled bonds with siblings, or financial loss through them. It does not mean no siblings — it means there is fixation or debt in the relationship.',
    cnLead: '兄弟宫化忌的人，跟兄弟姐妹的关系通常「不轻松」。可能是感情淡、可能是有过节、可能是你帮了他很多他不领情、也可能是他拖累你。化忌在兄弟宫，核心不是「有没有兄弟姐妹」，而是「这段关系里有放不下的东西」。',
    cnIntro2: '兄弟宫看兄弟姐妹、同辈关系和合伙关系。化忌落在这个宫位，关系中有「结」——可能是钱、可能是父母偏心、可能是性格不合。这个结不一定能解开，但可以学会不被它困住。',
    cnSections: [
      { h: '兄弟姐妹关系有结', ps: [
        '化忌在兄弟宫，你跟兄弟姐妹之间可能有一种「说不清的别扭」——不是大仇，但就是亲近不起来。可能是小时候父母偏心留下的疙瘩，可能是借钱不还的旧账，也可能是价值观越走越远。',
        '什么星化忌，决定了结在哪。天机化忌，兄弟姐妹之间多误会、多算计；太阴化忌，跟姐妹或母亲那边的亲戚有感情纠葛；武曲化忌，因钱伤感情；巨门化忌，吵架、口舌、谁也不服谁。',
        '举个组合：兄弟宫武曲化忌加擎羊。武曲是财星，化忌是亏欠，擎羊是争夺——这种组合容易因为家产、赡养、合伙生意跟兄弟姐妹闹翻。'
      ]},
      { h: '可能因兄弟破财', ps: [
        '兄弟宫化忌最实际的影响是「因兄弟破财」——借钱不还、担保被坑、合伙亏损。化忌是「收」，在兄弟宫就是你的钱被兄弟「收走」。',
        '这不是说兄弟姐妹故意害你，更多时候是「他也困难」「他觉得你应该帮」「你不好意思拒绝」。化忌的能量是黏的——借出去的钱难要回来，做了担保脱不了身。',
        '如果你有这种组合，跟兄弟姐妹之间的金钱往来要「先小人后君子」——写借条、不担保、不合伙。亲情归亲情，钱归钱，这不是冷漠，是保护关系。'
      ]},
      { h: '同辈和合伙关系', ps: [
        '兄弟宫也看同辈——同事、同学、合伙人。化忌在兄弟宫，你跟同辈的关系也容易有结——可能是同事抢功、同学攀比、合伙人不靠谱。',
        '在合伙上，化忌在兄弟宫的人要特别小心。你容易被「兄弟义气」绑架——朋友一叫就入伙，不好意思谈条件，结果出了问题你背锅。合伙之前一定要把退出机制、分工、分钱写清楚。',
        '化忌加天魁天钺，虽然关系有结，但关键时刻兄弟姐妹或同辈还是会帮你——只是帮的方式让你不舒服，或者帮完了念叨你十年。'
      ]},
      { h: '流年引动：兄弟关系什么时候出事', ps: [
        '第一种：大限兄弟宫化忌。这十年兄弟姐妹或同辈关系是重点——可能父母赡养问题爆发、合伙纠纷、或者兄弟姐妹出事需要你帮忙。这十年金钱往来要谨慎。',
        '第二种：流年化忌入兄弟。这一年容易因兄弟或同辈破财——借钱、担保、合伙出问题。也可能兄弟姐妹有灾病。这种年份不要做担保，借钱要量力。',
        '第三种：流年化禄入兄弟。这一年兄弟姐妹关系缓和——可能和解、合作、或者兄弟姐妹有喜事。适合解决旧账、修复关系。'
      ]},
      { h: '排盘后的使用顺序', ps: ['兄弟宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——天机主误会，太阴主感情纠葛，武曲主破财，巨门主口舌。',
        '看有无化禄化权来救——有禄则因兄弟得财（但化忌在，先得后失），有权则兄弟姐妹有能力但强势。',
        '看煞星：擎羊主争夺，陀罗主纠缠，火铃主冲突，空劫主兄弟无力。',
        '看三方四正：兄弟宫的三方是交友宫、疾厄宫、田宅宫，这些宫位影响同辈关系。',
        '看合伙运：化忌在兄弟宫，合伙要谨慎，文书要清楚。',
        '流年分三种：大限忌主十年兄弟事多，流年忌入兄弟主当年破财，流年禄入兄弟主当年关系缓和。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-xiongdigong.html', text: '兄弟宫怎么看' },
      { href: 'ziwei-xiongdigong-hualu-guiren-yikao.html', text: '兄弟宫化禄' },
      { href: 'ziwei-xiongdigong-huake.html', text: '兄弟宫化科' },
      { href: 'ziwei-jiaoyougong-huaji.html', text: '交友宫化忌' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ji in the Siblings Palace usually have uneasy relationships with brothers and sisters. It might be emotional distance, old grievances, helping without appreciation, or being dragged down. The core isn\'t whether you have siblings — it\'s that there\'s something in the relationship you can\'t let go of.',
    enIntro2: 'The Siblings Palace covers siblings, peers, and partnerships. Hua Ji here means a knot — money, parental favoritism, incompatible values. The knot may never fully untie, but you can learn not to be trapped by it.',
    enSections: [
      { h: 'A Knot in the Relationship', ps: [
        'There may be an indescribable awkwardness — not hatred, but an inability to be close. Childhood favoritism, unpaid loans, or values drifting apart.',
        'Which star transforms determines the knot: Tian Ji = misunderstandings and calculation; Tai Yin = emotional tangles with sisters or maternal relatives; Wu Qu = money hurting feelings; Ju Men = arguments and rivalry.',
        'Example: Wu Qu Hua Ji with Qing Yang in Siblings — disputes over inheritance, elder care, or business partnerships.'
      ]},
      { h: 'Financial Loss Through Siblings', ps: [
        'The most practical impact is money lost through siblings — defaulted loans, guarantees gone wrong, partnership losses. Hua Ji gathers; in Siblings it gathers your money away to them.',
        'It\'s rarely malice — more often they\'re struggling, they feel entitled to help, or you can\'t say no. Hua Ji sticks: loans are hard to recover, guarantees hard to escape.',
        'With this placement, keep money and family separate: written loan terms, no guarantees, no partnerships. This isn\'t coldness — it protects the relationship.'
      ]},
      { h: 'Peers and Partnerships', ps: [
        'The palace also covers peers — colleagues, classmates, partners. Knots appear here too: credit-stealing, competition, unreliable partners.',
        'In partnerships, be especially careful. You\'re susceptible to "brotherhood loyalty" — joining on a friend\'s word, too polite to negotiate terms, then left holding the bag. Write exit clauses, roles, and profit splits clearly.',
        'With Kui/Yue, siblings or peers do help at key moments — but in ways that make you uncomfortable, or with ten years of reminders afterward.'
      ]},
      { h: 'Timing: When Sibling Matters Flare', ps: [
        'A ten-year cycle with Hua Ji in Siblings makes siblings/peers a focus — elder care disputes, partnership conflicts, or a sibling in need. Be cautious with money this decade.',
        'An annual Hua Ji entering Siblings brings financial loss through siblings or peers — loans, guarantees, partnership problems. A sibling may also fall ill. No guarantees; lend only what you can afford to lose.',
        'An annual Hua Lu entering Siblings eases relations — reconciliation, cooperation, a sibling\'s celebration. Good year to settle old debts and repair bonds.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Siblings Palace:'], ol: [
        'Which star transforms? Tian Ji = misunderstandings, Tai Yin = emotional tangles, Wu Qu = money loss, Ju Men = arguments.',
        'Check Hua Lu/Hua Quan — with Lu, gain through siblings (but with Ji there, gained then lost); with Quan, capable but domineering siblings.',
        'Check malefics: Qing Yang = disputes, Tuo Luo = entanglement, Huo Ling = conflict, Kong Jie = helpless siblings.',
        'Read triple combination: Friends, Health, Property palaces affect peer relations.',
        'Partnership caution: paperwork must be clear.',
        'Timing: decade Ji = sibling-heavy decade, annual Ji = loss year, annual Lu = reconciliation year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-xiongdigong.html', text: 'The Siblings Palace' },
      { href: 'ziwei-xiongdigong-hualu-guiren-yikao.html', text: 'Siblings Palace Hua Lu' },
      { href: 'ziwei-xiongdigong-huake.html', text: 'Siblings Palace Hua Ke' },
      { href: 'ziwei-jiaoyougong-huaji.html', text: 'Friends Palace Hua Ji' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-fuqigong-huaji',
    cnTitle: '紫微斗数夫妻宫化忌：感情里的执念，化忌在夫妻怎么转',
    enTitle: 'Spouse Palace With Hua Ji: Obsession in Love',
    cnDesc: '夫妻宫化忌，感情里有执念——可能是遇人不淑、可能是放不下、可能是婚姻有结。化忌不等于不婚，是感情课题重。',
    enDesc: 'Hua Ji in the Spouse Palace brings fixation in love — wrong partners, inability to let go, or knots in marriage. It does not mean no marriage; it means love is a heavy lesson.',
    cnLead: '夫妻宫化忌的人，感情路通常走得「深」而「累」。你可能爱得比对方多、放得比对方晚、或者总被「不对的人」吸引。化忌在夫妻宫，不是说你结不了婚，而是你的感情课题比别人重——你需要在关系里学会「放下」和「爱自己」。',
    cnIntro2: '夫妻宫看配偶、婚姻和感情关系。化忌落在这个宫位，感情中有「执」——执着于一个人、一段关系、或者「应该怎样」的剧本。这个执用好了是深情，用不好是内耗。',
    cnSections: [
      { h: '感情里的执念', ps: [
        '化忌在夫妻宫，你在感情里容易「放不下」——分手了还想、被伤了还等、明明不合适还觉得「他会改」。你的爱很深，但也很沉，对方可能接不住。',
        '什么星化忌，决定了执念的类型。天机化忌，想太多、猜太多、沟通绕弯；太阴化忌，感情里缺乏安全感、容易遇到阴柔的对象；巨门化忌，吵架、冷战、沟通不畅；贪狼化忌，桃花多但留不住、欲望多但满足不了。',
        '举个组合：夫妻宫巨门化忌加陀罗。巨门主口舌，化忌主结，陀罗主纠缠——这种组合的婚姻可能吵了一辈子、冷战了一辈子，但就是离不了。'
      ]},
      { h: '遇人不淑还是自己吸引', ps: [
        '化忌在夫妻宫的人，容易问「为什么我总遇到不对的人」。但紫微斗数的看法是：不是你运气差，是你的能量场在吸引特定类型的人——让你又爱又痛的人。',
        '你可能被「需要你拯救」的人吸引，或者被「得不到」的人吸引。化忌的能量是「欠」——你觉得欠对方的，或者对方觉得欠你的。这种业力感让关系特别黏、特别痛、也特别难断。',
        '要转这个化忌，不是换一个人就能解决的——如果你自己的模式不变，换的人还是同一个「类型」。先学会爱自己、建立底线、不要在关系里失去自我，对的人才进得来。'
      ]},
      { h: '婚姻中的结', ps: [
        '化忌在夫妻宫，即使结了婚，婚姻里也有「结」——可能是沟通问题、性生活不和谐、经济纠纷、或者跟对方家人的矛盾。这个结不一定导致离婚，但会让婚姻「不轻松」。',
        '化忌加煞星（擎羊、火星），婚姻冲突大——吵架、动手、或者激烈的对抗。加陀罗，冷战、分居、名存实亡。加空劫，可能晚婚、不婚、或者婚姻中有很大的距离感。',
        '但化忌也有好的一面——你的婚姻如果熬过了最痛的阶段，会比别人的更牢固。因为化忌是「收」，经过磨合后，两个人的关系会收得很紧、很深。'
      ]},
      { h: '流年引动：感情什么时候动', ps: [
        '第一种：大限夫妻宫化忌。这十年感情是重大课题——可能结婚、离婚、遇到刻骨铭心的人、或者经历婚姻危机。这十年做的感情决定影响深远，不要冲动。',
        '第二种：流年化忌入夫妻。这一年感情出问题——吵架、分手、第三者、或者配偶有灾。这种年份不要在气头上做决定，给关系一点时间。',
        '第三种：流年化禄或化科入夫妻。这一年感情顺——遇到对的人、关系改善、或者婚姻有喜事。单身的人这一年容易脱单。'
      ]},
      { h: '排盘后的使用顺序', ps: ['夫妻宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——天机主想太多，太阴主不安全感，巨门主口舌，贪狼主桃花欲求。',
        '看有无化禄化权化科来救——有禄感情有甜，有权配偶强势但有能，有科感情有名分。',
        '看煞星：擎羊火铃主冲突，陀罗主纠缠，空劫主距离。',
        '看对宫官禄宫：婚姻和事业互相影响。',
        '看自己的模式：你在吸引什么类型的人？',
        '流年分三种：大限忌主十年感情课题，流年忌入夫妻主当年感情危机，流年禄科入夫妻主当年感情顺。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-fuqigong.html', text: '夫妻宫怎么看' },
      { href: 'ziwei-fuqigong-huake.html', text: '夫妻宫化科' },
      { href: 'ziwei-fuqigong-liantan-congre-dao-lei.html', text: '夫妻宫廉贪' },
      { href: 'ziwei-minggong-huaji.html', text: '命宫化忌' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ji in the Spouse Palace tend to love deeply and exhaustingly. You may love more, let go later, or keep being drawn to the wrong person. It doesn\'t mean you won\'t marry — it means love is a heavier lesson for you, one in which you must learn to let go and love yourself.',
    enIntro2: 'The Spouse Palace covers partners and marriage. Hua Ji here means fixation — on a person, a relationship, or a script of how it "should" be. Channeled well it is devotion; channeled poorly it is self-consuming.',
    enSections: [
      { h: 'Fixation in Love', ps: [
        'You struggle to let go — thinking about an ex long after, waiting after being hurt, believing "they\'ll change" when it\'s clearly wrong. Your love is deep but heavy; the other person may not be able to hold it.',
        'Which star transforms determines the fixation: Tian Ji = overthinking and miscommunication; Tai Yin = insecurity and soft partners; Ju Men = arguments and cold wars; Tan Lang = many suitors but none stay.',
        'Example: Ju Men Hua Ji with Tuo Luo in Spouse — a lifetime of arguments and cold wars, but never quite separating.'
      ]},
      { h: 'Wrong Partners — or Your Own Pattern?', ps: [
        'You may ask why you always meet the wrong person. In Zi Wei, it isn\'t bad luck — your field attracts a type: people who hurt you in a familiar way.',
        'You may be drawn to people who "need saving," or people you can\'t have. Hua Ji\'s energy is "debt" — you feel you owe them, or they you. This karmic quality makes bonds sticky, painful, and hard to break.',
        'Changing partners won\'t fix it — if your pattern doesn\'t change, the next person is the same type. Learn to love yourself, set boundaries, don\'t lose yourself; then the right person can enter.'
      ]},
      { h: 'Knots in Marriage', ps: [
        'Even married, there\'s a knot — communication, intimacy, finances, in-laws. It may not end the marriage, but it makes it uneasy.',
        'With malefics: Qing Yang/Huo Xing = open conflict; Tuo Luo = cold war or separation in all but name; Kong Jie = late marriage, no marriage, or emotional distance.',
        'But there\'s an upside: if the marriage survives the hardest phase, it\'s stronger than most. Hua Ji gathers — after磨合, the bond tightens and deepens.'
      ]},
      { h: 'Timing: When Love Moves', ps: [
        'A ten-year cycle with Hua Ji in Spouse makes love a major lesson — marriage, divorce, a unforgettable person, or crisis. Decisions this decade echo; don\'t be impulsive.',
        'An annual Hua Ji entering Spouse brings relationship trouble — fights, breakups, third parties, a partner\'s misfortune. Don\'t decide in anger; give it time.',
        'An annual Hua Lu or Hua Ke entering Spouse brings smooth love — meeting someone, improvement, celebration. Singles may couple up.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Spouse Palace:'], ol: [
        'Which star transforms? Tian Ji = overthinking, Tai Yin = insecurity, Ju Men = arguments, Tan Lang = desire.',
        'Check Hua Lu/Quan/Ke — with Lu, sweetness; with Quan, strong capable partner; with Ke, proper standing.',
        'Check malefics: Qing Yang/Huo Ling = conflict, Tuo Luo = entanglement, Kong Jie = distance.',
        'Read the opposite Career Palace — marriage and work affect each other.',
        'What type do you attract?',
        'Timing: decade Ji = love lesson decade, annual Ji = crisis year, annual Lu/Ke = smooth year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-fuqigong.html', text: 'The Spouse Palace' },
      { href: 'ziwei-fuqigong-huake.html', text: 'Spouse Palace Hua Ke' },
      { href: 'ziwei-fuqigong-liantan-congre-dao-lei.html', text: 'Lian Zhen Tan Lang in Spouse' },
      { href: 'ziwei-minggong-huaji.html', text: 'Life Palace Hua Ji' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-zinvgong-huaji',
    cnTitle: '紫微斗数子女宫化忌：跟孩子的缘分，化忌在子女怎么看',
    enTitle: 'Children Palace With Hua Ji: Bonds With Children',
    cnDesc: '子女宫化忌，跟孩子缘分薄或操心多，也可能子女来得晚。化忌不是没有孩子，是亲子关系有课题。',
    enDesc: 'Hua Ji in the Children Palace means a thin bond or heavy worry over children, or children coming late. It does not mean no children — it means parenting is a lesson.',
    cnLead: '子女宫化忌的人，跟孩子的缘分通常「不浅但累」。可能是来得晚、可能是小时候体弱、可能是青春期叛逆、可能是长大了不在身边。化忌在子女宫，你对孩子的爱很深，但操心也比别人多——你放不下他，就像他小时候你放不下他的身体一样。',
    cnIntro2: '子女宫看子女、晚辈和创造力。化忌落在这个宫位，亲子关系中有「执」——你可能把太多期待放在孩子身上，或者孩子跟你之间有一种「还不清」的感觉。',
    cnSections: [
      { h: '子女来得晚或操心多', ps: [
        '化忌在子女宫，子女可能来得晚——晚婚晚育、备孕困难、或者第一个孩子留不住。这不是绝对的，但如果大限又引动化忌，确实要注意保胎和生育安全。',
        '孩子出生后，可能体弱、难带、或者让你特别操心。什么星化忌决定了操心什么——天机化忌，孩子多动、心思多、跟你沟通有障碍；太阴化忌，女儿让你操心或孩子性格内向；武曲化忌，孩子跟你不亲或在钱上让你费心。',
        '举个组合：子女宫天机化忌加天马。天机主多动，天马主奔波——孩子可能从小坐不住、学习不专心，长大了跑很远，你想见一面都难。'
      ]},
      { h: '亲子关系有结', ps: [
        '化忌在子女宫，你跟孩子之间可能有一种「说不清的距离」——你很爱他，但不知道怎么表达；或者你管得太多，他想逃。',
        '你可能把自己未完成的梦想放在孩子身上，或者因为太担心而过度保护。化忌的能量是「收」——你想把孩子收在身边，但越收他越想走。',
        '要转这个化忌，关键是「放手」——孩子不是你的附属品，他有自己的命。你能做的是给他安全感和底线，然后让他自己走。化忌在子女宫的人，学会放手是一辈子的功课。'
      ]},
      { h: '晚辈和下属', ps: [
        '子女宫也看晚辈和下属。化忌在子女宫，你带的人可能让你不省心——能力不够、忠诚度低、或者教会了就走。',
        '在创意和作品方面，化忌在子女宫可能意味着你对自己的作品不满意——总觉得不够好、反复修改、或者创作过程很痛苦。但这种「不满意」也可能让你出精品。',
        '化忌加天魁天钺，孩子虽然让你操心，但关键时刻有出息——可能是大器晚成，或者走了一条你没想到的路但走通了。'
      ]},
      { h: '流年引动：子女的事什么时候动', ps: [
        '第一种：大限子女宫化忌。这十年子女是重点——备孕、生产、孩子升学或青春期。这十年对孩子多陪伴少控制，关系会好很多。',
        '第二种：流年化忌入子女。这一年孩子让你操心——生病、叛逆、学业问题。也可能是子女宫也看合伙，这一年跟晚辈或下属有纠纷。',
        '第三种：流年化禄入子女。这一年子女有喜事——考上好学校、结婚生子、或者关系改善。适合备孕。'
      ]},
      { h: '排盘后的使用顺序', ps: ['子女宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——天机主多动沟通难，太阴主女儿操心，武曲主不亲或钱，太阳主儿子让你费心。',
        '看有无化禄化权化科——有禄子女有出息，有权子女能干但强势，有科子女有名声。',
        '看煞星：擎羊主子女性格刚烈，陀罗主慢性子或拖延，火铃主急躁，空劫主缘分薄。',
        '看对宫田宅宫：亲子关系和家庭环境互相影响。',
        '看自己是否过度控制——化忌在子女宫，放手是功课。',
        '流年分三种：大限忌主十年子女事多，流年忌入子女主当年操心，流年禄入子女主当年喜事。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-zinvgong.html', text: '子女宫怎么看' },
      { href: 'ziwei-zinvgong-huake.html', text: '子女宫化科' },
      { href: 'ziwei-tianzhaigong-huaji.html', text: '田宅宫化忌' },
      { href: 'ziwei-fudegong-huaji.html', text: '福德宫化忌' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ji in the Children Palace often have bonds that are deep but exhausting. Children may come late, be frail in infancy, rebel in adolescence, or live far away as adults. Your love is deep, but so is your worry — you can\'t let go, just as you couldn\'t let go when they were small.',
    enIntro2: 'The Children Palace covers children, juniors, and creativity. Hua Ji here means fixation in the parent-child bond — you may place too many expectations on your child, or there\'s a sense of unpayable debt between you.',
    enSections: [
      { h: 'Late Children or Heavy Worry', ps: [
        'Children may come late — late marriage, difficulty conceiving, or miscarriage risk. When a decade also triggers Hua Ji, take extra care with pregnancy.',
        'After birth, the child may be frail, difficult, or a constant worry. Which star transforms tells you where: Tian Ji = hyperactive, poor communication; Tai Yin = worry over a daughter or introverted child; Wu Qu = emotional distance or money issues.',
        'Example: Tian Ji Hua Ji with Tian Ma in Children — a restless child who can\'t focus, then grows up and moves far away.'
      ]},
      { h: 'A Knot in the Bond', ps: [
        'There may be an indescribable distance — you love deeply but don\'t know how to show it, or you control too much and the child wants out.',
        'You may project unfulfilled dreams onto the child, or overprotect out of fear. Hua Ji gathers — you want to hold close, but the tighter you hold, the more they pull away.',
        'The key is letting go. A child isn\'t an extension of you. Give security and boundaries, then let them walk their own path. Learning to release is a lifelong lesson here.'
      ]},
      { h: 'Juniors and Creativity', ps: [
        'The palace also covers juniors and subordinates. They may not be省心 — unskilled, disloyal, or leaving once trained.',
        'In creativity, you may never be satisfied with your work — endless revisions, painful process. But that dissatisfaction can produce excellence.',
        'With Kui/Yue, despite the worry, the child succeeds at key moments — a late bloomer, or succeeding on a path you didn\'t expect.'
      ]},
      { h: 'Timing: When Children Matter', ps: [
        'A ten-year cycle with Hua Ji in Children makes children the focus — conception, birth, exams, adolescence. More presence, less control this decade.',
        'An annual Hua Ji entering Children brings worry — illness, rebellion, school problems. It may also mean disputes with juniors or subordinates.',
        'An annual Hua Lu entering Children brings celebration — admission, marriage, a grandchild, or improved relations. Good year to conceive.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Children Palace:'], ol: [
        'Which star transforms? Tian Ji = restless/communication, Tai Yin = daughter worry, Wu Qu = distance/money, Tai Yang = son worry.',
        'Check Hua Lu/Quan/Ke — with Lu, success; with Quan, capable but strong-willed; with Ke, reputation.',
        'Check malefics: Qing Yang = stubborn, Tuo Luo = slow, Huo Ling = impatient, Kong Jie = thin bond.',
        'Read the opposite Property Palace — parenting and home environment interact.',
        'Are you over-controlling? Letting go is the lesson.',
        'Timing: decade Ji = child-focused decade, annual Ji = worry year, annual Lu = celebration year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-zinvgong.html', text: 'The Children Palace' },
      { href: 'ziwei-zinvgong-huake.html', text: 'Children Palace Hua Ke' },
      { href: 'ziwei-tianzhaigong-huaji.html', text: 'Property Palace Hua Ji' },
      { href: 'ziwei-fudegong-huaji.html', text: 'Mental Palace Hua Ji' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-caibogong-huaji',
    cnTitle: '紫微斗数财帛宫化忌：赚不到还是守不住，化忌在财帛怎么看',
    enTitle: 'Wealth Palace With Hua Ji: Can\'t Earn or Can\'t Keep?',
    cnDesc: '财帛宫化忌，赚钱辛苦或守财困难，容易因钱焦虑。但化忌也主「精打细算」，用对了是理财能力。',
    enDesc: 'Hua Ji in the Wealth Palace means hard earning or difficulty keeping money, with anxiety over finances. But it also grants careful calculation — channeled well, it is financial discipline.',
    cnLead: '财帛宫化忌的人，跟钱的关系通常「紧」。你可能赚得不少但总觉得不够，或者赚得到但守不住，又或者赚钱过程特别辛苦。化忌在财帛宫，不是「穷」的意思——很多化忌在财帛的人很有钱，但他们对钱的焦虑比谁都重。',
    cnIntro2: '财帛宫看收入、理财和对钱的态度。化忌落在这个宫位，钱是你人生的「课题」——你需要学会跟钱和平相处，而不是被它牵着走。',
    cnSections: [
      { h: '赚钱辛苦还是守不住', ps: [
        '化忌在财帛宫有两种典型：一种是「赚得辛苦」——同样的钱别人轻松赚，你要费九牛二虎之力；另一种是「守不住」——赚得到但花得快、借出去、投资亏掉。',
        '什么星化忌决定了钱卡在哪。武曲化忌，正财辛苦或因钱生灾；太阴化忌，偏财不利、储蓄被掏空；天府化忌，库藏有漏洞；贪狼化忌，花钱欲望大、赚多少花多少。',
        '举个组合：财帛宫武曲化忌加陀罗。武曲是正财星，化忌是卡住，陀罗是拖延——这种人赚钱像老牛拉车，慢且累，但好在稳，不会大起大落。'
      ]},
      { h: '对钱的焦虑', ps: [
        '化忌在财帛宫最核心的影响不是钱本身，而是对钱的「焦虑」。你可能银行里有存款但还是觉得不安全，或者赚多少都觉得「不够」。',
        '这种焦虑来自化忌的「收」——你想把钱收住、守住、抓住，但越抓越紧，紧到自己难受。你可能舍不得吃舍不得穿，但一笔意外支出就让你心态崩了。',
        '要转这个化忌，需要建立「系统」而不是靠「意志力」——自动储蓄、记账、保险、分散投资。当钱的管理变成系统，焦虑会降低。'
      ]},
      { h: '化忌也主精打细算', ps: [
        '化忌在财帛宫不全是坏事。化忌是「收」，用好了就是「精打细算」——你对数字敏感、知道钱花在哪、不容易被忽悠买没用的东西。',
        '很多财务、会计、审计出身的人，财帛宫都有化忌或类似能量。他们不是赚最多的，但他们是最清楚每笔钱去向的。',
        '化忌加化禄或禄存，「先苦后甜」——早年赚钱辛苦，中年后靠积累和理财翻身。加化权，对钱有控制力，适合管钱但要防吝啬。加昌曲，靠专业赚钱，收入跟证书和资质挂钩。'
      ]},
      { h: '流年引动：钱什么时候进出', ps: [
        '第一种：大限财帛宫化忌。这十年财运紧——可能收入减少、支出增加、投资亏损。这十年不要投机、不要借钱、不要大额担保。稳扎稳打，过了这十年会好。',
        '第二种：流年化忌入财帛。这一年容易破财——投资亏损、被骗、意外支出、或者收入延迟。这种年份不要做重大投资决定，留足应急资金。',
        '第三种：流年化禄入财帛。这一年财运好——加薪、奖金、投资收益、意外之财。但化忌在财帛宫的人，有钱时更要存，不要因为一年好就大手大脚。'
      ]},
      { h: '排盘后的使用顺序', ps: ['财帛宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——武曲主正财辛苦，太阴主偏财不利，天府主库藏漏洞，贪狼主花钱欲望大。',
        '看有无化禄化权化科——有禄先苦后甜，有权管钱能力强，有科靠专业赚钱。',
        '看煞星：陀罗主赚钱慢，火铃主破财快，空劫主投资亏损。',
        '看对宫福德宫：你对钱的态度跟精神状态有关。',
        '看理财模式：你是赚得辛苦还是守不住？',
        '流年分三种：大限忌主十年财紧，流年忌入财帛主当年破财，流年禄入财帛主当年进财。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-caibogong-huake.html', text: '财帛宫化科' },
      { href: 'ziwei-caibogong-huaquan.html', text: '财帛宫化权' },
      { href: 'ziwei-fudegong-huaji.html', text: '福德宫化忌' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ji in the Wealth Palace have a tense relationship with money. You may earn well but never feel it\'s enough, or earn it but can\'t keep it, or find earning itself exhausting. This placement doesn\'t mean poverty — many wealthy people have it — but their anxiety about money is deeper than most.',
    enIntro2: 'The Wealth Palace covers income, finances, and attitude toward money. Hua Ji here makes money a life lesson — you must learn to coexist with it rather than be led by it.',
    enSections: [
      { h: 'Hard Earnings or Can\'t Keep It', ps: [
        'Two patterns: "earning is hard" — what others make easily takes you enormous effort; or "can\'t keep it" — earned but quickly spent, lent, or lost in investments.',
        'Which star transforms tells you where money sticks: Wu Qu = hard-earned income or money troubles; Tai Yin = poor windfall luck, savings drained; Tian Fu = leaks in the treasury; Tan Lang = high spending desire.',
        'Example: Wu Qu Hua Ji with Tuo Luo in Wealth — earning like an ox pulling a cart, slow and tiring, but stable, no wild swings.'
      ]},
      { h: 'Anxiety About Money', ps: [
        'The core impact isn\'t money itself but anxiety. You may have savings yet feel insecure, or never feel you have "enough" no matter how much you earn.',
        'This comes from Hua Ji\'s gathering — you want to hold, guard, grip money, and the tighter you grip, the worse you feel. You may skimp on yourself but collapse emotionally at one unexpected expense.',
        'Build systems, not willpower: automatic savings, budgeting, insurance, diversified investments. When money management is systematic, anxiety drops.'
      ]},
      { h: 'Careful Calculation', ps: [
        'It isn\'t all bad. Hua Ji gathers; used well it is meticulousness — sensitive to numbers, knowing where every dollar goes, hard to upsell.',
        'Many in finance, accounting, and audit have this energy. They don\'t earn the most, but they know exactly where the money goes.',
        'With Hua Lu or Lu Cun, "bitter first, sweet later" — hard early years, then comfort through accumulation. With Hua Quan, strong money control (beware stinginess). With Chang Qu, earnings through credentials and expertise.'
      ]},
      { h: 'Timing: When Money Moves', ps: [
        'A ten-year cycle with Hua Ji in Wealth is financially tight — reduced income, increased expenses, investment losses. No speculation, lending, or big guarantees this decade. Steady wins.',
        'An annual Hua Ji entering Wealth brings loss — bad investments, scams, unexpected costs, delayed income. No major financial decisions; keep an emergency fund.',
        'An annual Hua Lu entering Wealth brings income — raise, bonus, investment gains, windfall. But save it; don\'t let one good year trigger spending sprees.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Wealth Palace:'], ol: [
        'Which star transforms? Wu Qu = hard income, Tai Yin = poor windfalls, Tian Fu = treasury leaks, Tan Lang = spending desire.',
        'Check Hua Lu/Quan/Ke — with Lu, bitter then sweet; with Quan, money control; with Ke, professional income.',
        'Check malefics: Tuo Luo = slow earning, Huo Ling = fast loss, Kong Jie = investment loss.',
        'Read the opposite Mental Palace — your money attitude ties to your state of mind.',
        'Do you earn hard or can\'t keep?',
        'Timing: decade Ji = tight decade, annual Ji = loss year, annual Lu = income year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-caibogong-huake.html', text: 'Wealth Palace Hua Ke' },
      { href: 'ziwei-caibogong-huaquan.html', text: 'Wealth Palace Hua Quan' },
      { href: 'ziwei-fudegong-huaji.html', text: 'Mental Palace Hua Ji' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-jiaoyougong-huaji',
    cnTitle: '紫微斗数交友宫化忌：朋友是债还是劫，化忌在交友怎么看',
    enTitle: 'Friends Palace With Hua Ji: Friends as Debt or Disaster?',
    cnDesc: '交友宫化忌，朋友带来麻烦或损失，容易被朋友拖累。但化忌也主「朋友少而精」，关键是识人。',
    enDesc: 'Hua Ji in the Friends Palace means friends bring trouble or loss, and you are easily dragged down. But it also means few but close friends — the key is judging people.',
    cnLead: '交友宫化忌的人，在朋友上容易「吃亏」。可能是借钱不还、可能是被出卖、可能是合伙被坑、也可能是朋友不多但每一段都很「重」。化忌在交友宫，不是说你没有朋友，而是你的朋友关系里有「债」——要么你欠他的，要么他欠你的。',
    cnIntro2: '交友宫看朋友、下属和合伙人。化忌落在这个宫位，社交上要「精」不要「多」——你的精力和运气经不起烂朋友消耗。',
    cnSections: [
      { h: '被朋友拖累', ps: [
        '化忌在交友宫最典型的体验是「被朋友拖累」——借钱不还、做担保被坑、合伙亏损、被朋友出卖秘密。你可能觉得自己对朋友够意思，但朋友未必同样对你。',
        '什么星化忌决定了被拖累的方式。武曲化忌，因朋友破财；巨门化忌，被朋友说坏话、卷入是非；天机化忌，被朋友算计或欺骗；太阴化忌，被女性朋友或暗中的关系所伤。',
        '举个组合：交友宫武曲化忌加空劫。武曲是财，化忌是失，空劫是空——这种组合最忌合伙和借钱给朋友，大概率有去无回。'
      ]},
      { h: '朋友少而精', ps: [
        '化忌在交友宫的人，朋友通常不多，但留下来的都是「过命」的。你的社交模式是「深交」——不认识则已，认识了就掏心掏肺。',
        '这种模式的好处是知己难求但能找到，坏处是一旦看错人，伤得特别深。你可能需要很多年才能从一段被背叛的友情中走出来。',
        '化忌加天魁天钺，朋友中有贵人但也有债主——可能有人帮你大忙，也有人让你吃大亏。关键是分清谁是谁。'
      ]},
      { h: '下属和合伙人', ps: [
        '交友宫也看下属。化忌在交友宫，带团队比较累——下属能力不足、忠诚度低、或者你对他们太好他们觉得理所当然。',
        '在合伙上，这是最需要谨慎的组合之一。化忌在交友宫的人，合伙容易因财失义、因权责不清反目。如果一定要合伙，必须先签好退出协议，而且不要跟最好的朋友合伙。',
        '化忌加化禄，朋友关系中有得有失——可能先被坑后得利，或者有的朋友坑你有的朋友帮你。加昌曲，朋友中多文化人，但也可能被「有文化」的人骗。'
      ]},
      { h: '流年引动：朋友什么时候出事', ps: [
        '第一种：大限交友宫化忌。这十年朋友和下属是「坑」——可能被朋友拖累、下属背叛、合伙纠纷。这十年不要担保、不要借钱、不要新开合伙。',
        '第二种：流年化忌入交友。这一年朋友带来麻烦——借钱不还、口舌是非、或者朋友出事需要你收拾残局。这种年份保持距离，不要替人做主。',
        '第三种：流年化禄入交友。这一年朋友带来好处——介绍机会、资源互换、或者交到有用的朋友。但化忌在交友宫的人，即使好运也要留三分。'
      ]},
      { h: '排盘后的使用顺序', ps: ['交友宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——武曲主破财，巨门主是非，天机主算计，太阴主暗伤。',
        '看有无化禄化权化科——有禄有得有失，有权朋友中有强人，有科朋友有口碑。',
        '看煞星：擎羊主朋友反目，陀罗主纠缠，空劫主被骗，火铃主冲突。',
        '看对宫兄弟宫：朋友和兄弟姐妹互相影响。',
        '看识人能力：化忌在交友宫，慢热比热情安全。',
        '流年分三种：大限忌主十年朋友坑，流年忌入交友主当年朋友出事，流年禄入交友主当年朋友助力。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-jiaoyougong.html', text: '交友宫怎么看' },
      { href: 'ziwei-jiaoyougong-hualu.html', text: '交友宫化禄' },
      { href: 'ziwei-jiaoyougong-huake.html', text: '交友宫化科' },
      { href: 'ziwei-xiongdigong-huaji.html', text: '兄弟宫化忌' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ji in the Friends Palace tend to lose out through friends — defaulted loans, betrayed confidences, partnership scams, or a small social circle where every bond is heavy. It doesn\'t mean no friends; it means there\'s "debt" in the friendship — either you owe them or they owe you.',
    enIntro2: 'The Friends Palace covers friends, subordinates, and partners. Hua Ji here demands quality over quantity — your energy and luck can\'t afford being drained by bad friends.',
    enSections: [
      { h: 'Dragged Down by Friends', ps: [
        'The classic experience is being dragged down — defaulted loans, guarantees gone wrong, partnership losses, betrayed secrets. You may be loyal to friends who don\'t return it.',
        'Which star transforms determines how: Wu Qu = money loss; Ju Men = gossip and disputes; Tian Ji = calculation and deception; Tai Yin = harm through female friends or hidden ties.',
        'Example: Wu Qu Hua Ji with Kong Jie in Friends — never partner with or lend to friends; the money is gone.'
      ]},
      { h: 'Few but Close', ps: [
        'You usually have few friends, but the ones who stay are ride-or-die. Your mode is deep connection — once you know someone, you give your all.',
        'The upside: finding true confidants. The downside: when you misjudge someone, the wound is deep and takes years to heal.',
        'With Kui/Yue, some friends are benefactors and some are creditors — one may help enormously while another costs you dearly. Distinguish which is which.'
      ]},
      { h: 'Subordinates and Partners', ps: [
        'Leading teams is tiring — subordinates may be unskilled, disloyal, or take your kindness for granted.',
        'In partnerships this is one of the most cautious placements. Partnerships easily turn sour over money or unclear roles. If you must partner, sign an exit agreement first — and don\'t partner with your best friend.',
        'With Hua Lu, mixed outcomes — scammed by one friend, helped by another. With Chang Qu, cultured friends — but also the risk of being deceived by someone "sophisticated."'
      ]},
      { h: 'Timing: When Friends Cause Trouble', ps: [
        'A ten-year cycle with Hua Ji in Friends makes friends/subordinates a pitfall — dragged down, betrayed, partnership disputes. No guarantees, loans, or new partnerships this decade.',
        'An annual Hua Ji entering Friends brings trouble — defaulted loans, gossip, a friend in crisis you must clean up after. Keep distance; don\'t take charge for others.',
        'An annual Hua Lu entering Friends brings benefit — referrals, resource exchange, useful new contacts. But even in good times, keep a third in reserve.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Friends Palace:'], ol: [
        'Which star transforms? Wu Qu = money loss, Ju Men = gossip, Tian Ji = deception, Tai Yin = hidden harm.',
        'Check Hua Lu/Quan/Ke — with Lu, mixed; with Quan, strong-willed friends; with Ke, reputable friends.',
        'Check malefics: Qing Yang = falling out, Tuo Luo = entanglement, Kong Jie = deception, Huo Ling = conflict.',
        'Read the opposite Siblings Palace — friends and peers interact.',
        'Slow to warm is safer than eager.',
        'Timing: decade Ji = friend-pitfall decade, annual Ji = friend-trouble year, annual Lu = friend-benefit year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-jiaoyougong.html', text: 'The Friends Palace' },
      { href: 'ziwei-jiaoyougong-hualu.html', text: 'Friends Palace Hua Lu' },
      { href: 'ziwei-jiaoyougong-huake.html', text: 'Friends Palace Hua Ke' },
      { href: 'ziwei-xiongdigong-huaji.html', text: 'Siblings Palace Hua Ji' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-guanlugong-huaji',
    cnTitle: '紫微斗数官禄宫化忌：事业不顺还是大器晚成，化忌在官禄怎么看',
    enTitle: 'Career Palace With Hua Ji: Career Trouble or Late Bloomer?',
    cnDesc: '官禄宫化忌，事业多波折、换工作多、或对工作极度认真。化忌不是事业无成，是成功来得晚、来得辛苦。',
    enDesc: 'Hua Ji in the Career Palace means career twists, frequent job changes, or extreme diligence. It does not mean no success — it means success comes late and hard-won.',
    cnLead: '官禄宫化忌的人，事业路通常「弯」。可能是换了很多行业才找到方向，可能是一直很努力但不被看见，也可能是工作让你焦虑到失眠。化忌在官禄宫，不是「做不成事」，而是你的事业成就来得比别人晚、比别人辛苦——但一旦成了，比谁都稳。',
    cnIntro2: '官禄宫看事业、工作和社会成就。化忌落在这个宫位，事业是你的「修行」——你需要在工作中学会不执着、不比较、不急着要结果。',
    cnSections: [
      { h: '事业多波折', ps: [
        '化忌在官禄宫，事业上容易「卡」——找工作卡、升职卡、创业卡、项目卡。你可能比别人努力，但机会总是差那么一点。',
        '什么星化忌决定了卡在哪。武曲化忌，财务或技术岗辛苦；巨门化忌，靠嘴吃饭的行业多是非；天机化忌，计划赶不上变化、转行多；太阴化忌，适合幕后不适合前台；太阳化忌，跟政府或男性领导打交道不顺。',
        '举个组合：官禄宫天机化忌加天马。天机主变动，天马主奔波——这种人可能换了很多工作、很多行业，早年漂泊不定，但中年后靠丰富的经验找到自己的路。'
      ]},
      { h: '对工作极度认真', ps: [
        '化忌在官禄宫的人，对工作有一种「执念」——你可能是团队里最认真的那个，但也最容易焦虑。你受不了敷衍，也受不了别人敷衍。',
        '这种认真让你在专业上越来越强，但也让你很累。你可能把工作带回家、周末还在想项目、休假也不踏实。化忌的能量是「收」——你把所有注意力收在工作上，生活的其他部分被压缩了。',
        '要学会「够好就行」——不是所有事都需要做到100分，有些事做到60分就可以交。事业是马拉松，不是百米冲刺。'
      ]},
      { h: '大器晚成', ps: [
        '化忌在官禄宫的人，很多是「大器晚成」——早年事业不顺、换方向、被低估，但中年后突然开窍或者遇到一个机会，之前所有的积累都用上了。',
        '这是因为化忌是「收」——它把你的能量收住、压住，让你在年轻时发不出来，但也让你在底层扎了很深的根。一旦运势到了，你的根比谁都深，成就比谁都稳。',
        '化忌加化权，「先苦后成」——早年被压着，中年后有职有权。加昌曲，靠专业翻身，越老越值钱。加天魁天钺，事业上有贵人但出现得晚。'
      ]},
      { h: '流年引动：事业什么时候动', ps: [
        '第一种：大限官禄宫化忌。这十年事业压力大——可能失业、转行、项目失败、或者工作极累。但这十年也是「扎根」的十年，学到的东西以后用得上。',
        '第二种：流年化忌入官禄。这一年工作不顺——项目失败、被批评、升职无望、或者想辞职。这种年份不要冲动跳槽，先忍着，等运势转了再说。',
        '第三种：流年化禄或化权入官禄。这一年事业有突破——升职、加薪、项目成功、或者遇到好机会。化忌在官禄宫的人，好运来了要抓住，因为你等这个机会可能等了很久。'
      ]},
      { h: '排盘后的使用顺序', ps: ['官禄宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——武曲主财务技术辛苦，巨门主口舌是非，天机主变动转行，太阴主幕后，太阳主跟领导不顺。',
        '看有无化禄化权化科——有权先苦后成，有科靠专业翻身，有禄事业有财。',
        '看煞星：陀罗主升职慢，火铃主职场冲突，空劫主事业空想。',
        '看对宫夫妻宫：事业压力影响婚姻。',
        '看事业阶段：你是在扎根期还是收获期？',
        '流年分三种：大限忌主十年事业压力，流年忌入官禄主当年不顺，流年禄权入官禄主当年突破。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-guanlugong-huaquan.html', text: '官禄宫化权' },
      { href: 'ziwei-guanlugong-huake.html', text: '官禄宫化科' },
      { href: 'ziwei-minggong-huaji.html', text: '命宫化忌' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ji in the Career Palace tend to have winding career paths — switching industries before finding direction, working hard without being seen, or lying awake anxious about work. It doesn\'t mean you can\'t succeed; it means success comes later and harder than for others — but when it comes, it\'s steadier than most.',
    enIntro2: 'The Career Palace covers work and social achievement. Hua Ji here makes career your practice — you must learn non-attachment, non-comparison, and patience with results.',
    enSections: [
      { h: 'Career Twists', ps: [
        'Things get stuck — job hunting, promotion, entrepreneurship, projects. You may work harder than others but opportunity always seems just out of reach.',
        'Which star transforms determines where: Wu Qu = hard finance/tech roles; Ju Men = gossip in mouth-based industries; Tian Ji = plans change, frequent switches; Tai Yin = better behind the scenes; Tai Yang = trouble with government or male bosses.',
        'Example: Tian Ji Hua Ji with Tian Ma in Career — many jobs and industries, drifting early, but midlife experience becomes the foundation.'
      ]},
      { h: 'Extreme Diligence', ps: [
        'You have a fixation on work — likely the most conscientious on the team, but also the most anxious. You can\'t stand sloppiness, in yourself or others.',
        'This makes you increasingly expert, but also exhausted. You bring work home, think about projects on weekends, can\'t fully disconnect. Hua Ji gathers — all attention narrows onto work, squeezing the rest of life.',
        'Learn "good enough." Not everything needs 100%; some things ship at 60%. Career is a marathon, not a sprint.'
      ]},
      { h: 'Late Bloomer', ps: [
        'Many with this placement bloom late — early career frustration, direction changes, being underestimated — then midlife brings a breakthrough where all accumulated experience suddenly applies.',
        'Hua Ji gathers and holds down; in youth you can\'t express it, but you root deeply. When fortune turns, your roots are deeper and your achievement steadier.',
        'With Hua Quan, "bitter then accomplished" — suppressed early, powerful later. With Chang Qu, expertise redeems you, more valuable with age. With Kui/Yue, a benefactor appears late.'
      ]},
      { h: 'Timing: When Career Moves', ps: [
        'A ten-year cycle with Hua Ji in Career brings heavy pressure — unemployment, career change, failed projects, exhaustion. But it\'s also a rooting decade; what you learn serves you later.',
        'An annual Hua Ji entering Career brings setbacks — failed projects, criticism, no promotion, the urge to quit. Don\'t impulsively job-hop; wait for fortune to turn.',
        'An annual Hua Lu or Hua Quan entering Career brings breakthrough — promotion, raise, successful project, a great opportunity. When it comes, grab it; you may have waited a long time.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Career Palace:'], ol: [
        'Which star transforms? Wu Qu = finance/tech grind, Ju Men = gossip, Tian Ji = changes, Tai Yin = behind scenes, Tai Yang = boss trouble.',
        'Check Hua Lu/Quan/Ke — with Quan, bitter then powerful; with Ke, expertise redeems; with Lu, career pays.',
        'Check malefics: Tuo Luo = slow promotion, Huo Ling = workplace conflict, Kong Jie = empty ambition.',
        'Read the opposite Spouse Palace — career pressure affects marriage.',
        'Are you rooting or harvesting?',
        'Timing: decade Ji = pressure decade, annual Ji = setback year, annual Lu/Quan = breakthrough year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-guanlugong-huaquan.html', text: 'Career Palace Hua Quan' },
      { href: 'ziwei-guanlugong-huake.html', text: 'Career Palace Hua Ke' },
      { href: 'ziwei-minggong-huaji.html', text: 'Life Palace Hua Ji' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-tianzhaigong-huaji',
    cnTitle: '紫微斗数田宅宫化忌：家是港湾还是枷锁，化忌在田宅怎么看',
    enTitle: 'Property Palace With Hua Ji: Home as Haven or Cage?',
    cnDesc: '田宅宫化忌，房产有纠纷或家庭有压力，也可能在家待不住。化忌不是无家可归，是跟「家」的关系有课题。',
    enDesc: 'Hua Ji in the Property Palace means property disputes or family pressure, or feeling restless at home. It does not mean homelessness — it means a complicated relationship with "home."',
    cnLead: '田宅宫化忌的人，跟「家」的关系通常「不轻松」。可能是买房过程曲折、房贷压力大、家里有矛盾、或者在家待着反而焦虑。化忌在田宅宫，你可能一辈子都在「安顿」自己——物理上的房子和心理上的家，都需要经营。',
    cnIntro2: '田宅宫看房产、家庭和库藏。化忌落在这个宫位，家是你的「课题」——你需要在房子和家庭上学会放手，不要让「家」变成「枷」。',
    cnSections: [
      { h: '房产有波折', ps: [
        '化忌在田宅宫，买房过程通常不顺利——可能看中的房子被抢、贷款批不下来、交房延期、或者买了就跌。你也可能频繁搬家，或者一直租房买不起。',
        '什么星化忌决定了房产的问题。武曲化忌，房贷压力大或因房破财；太阴化忌，房子阴暗潮湿或女性家人在房产上有纠纷；巨门化忌，房产口舌、合同纠纷；天机化忌，房子有隐患或频繁变动。',
        '举个组合：田宅宫武曲化忌加擎羊。武曲是财，化忌是压力，擎羊是冲突——这种组合容易因为房产跟人打官司，或者买房后背上沉重贷款。'
      ]},
      { h: '家庭有压力', ps: [
        '化忌在田宅宫，家庭关系可能让你有压力——可能是父母同住的矛盾、配偶家人的干涉、或者家里总有操不完的心。',
        '你可能觉得「家不是休息的地方」——在家反而比在外面还累。可能是家里气氛压抑、家人情绪不稳、或者你把家当成了另一个办公室。',
        '化忌加火铃，家里容易吵架；加陀罗，家庭问题拖而不决；加空劫，家里冷清或者跟家人缘分薄。'
      ]},
      { h: '在家待不住', ps: [
        '田宅宫化忌的人，可能「在家待不住」——喜欢往外跑、出差反而放松、或者在家就焦虑。这跟迁移宫化忌的「在外不顺」不同，你是「在家不顺」。',
        '这种人适合在家以外的地方找安全感——咖啡馆、办公室、旅途中。也可能你对「家」有完美主义期待，总觉得现在的房子不够好，一直在折腾装修或换房。',
        '化忌加化禄或禄存，「先苦后甜」——早年租房或房贷压力大，中年后房产成为最大的资产。加化权，在家你说了算，但也可能因此跟家人冲突。'
      ]},
      { h: '流年引动：家什么时候动', ps: [
        '第一种：大限田宅宫化忌。这十年家是重点——买房、换房、装修、或者家庭矛盾。这十年房产交易要谨慎，合同看清楚，不要冲动买房。',
        '第二种：流年化忌入田宅。这一年家里有事——房产纠纷、家人健康、装修出问题、或者东西被盗。这种年份不宜大额房产交易。',
        '第三种：流年化禄入田宅。这一年家有喜事——买房、搬家、家里添丁、或者家庭关系改善。适合置产。'
      ]},
      { h: '排盘后的使用顺序', ps: ['田宅宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——武曲主房贷破财，太阴主房屋阴湿，巨门主合同纠纷，天机主房屋隐患。',
        '看有无化禄化权化科——有禄先苦后甜，有权在家做主，有科房产有名声。',
        '看煞星：擎羊主房产官司，陀罗主问题拖延，火铃主家吵，空劫主家冷清。',
        '看对宫子女宫：家庭和子女互相影响。',
        '看你跟家的关系：是港湾还是枷锁？',
        '流年分三种：大限忌主十年家事多，流年忌入田宅主当年家有事，流年禄入田宅主当年家有喜。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-tianzhaigong.html', text: '田宅宫怎么看' },
      { href: 'ziwei-tianzhaigong-hualu.html', text: '田宅宫化禄' },
      { href: 'ziwei-tianzhaigong-huaquan.html', text: '田宅宫化权' },
      { href: 'ziwei-zinvgong-huaji.html', text: '子女宫化忌' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ji in the Property Palace often have an uneasy relationship with "home." The home-buying process may be tortuous, the mortgage crushing, family dynamics tense, or being home itself makes you anxious. You may spend a lifetime "settling" yourself — both the physical house and the psychological home need work.',
    enIntro2: 'The Property Palace covers real estate, family, and stored wealth. Hua Ji here makes home your lesson — you must learn to let go around property and family, not letting "home" become a "cage."',
    enSections: [
      { h: 'Property Twists', ps: [
        'Buying is often rough — offers gazumped, loans rejected, delays, or buying right before a drop. You may move frequently or rent for years.',
        'Which star transforms: Wu Qu = mortgage pressure or property loss; Tai Yin = dark/damp home or female-family property disputes; Ju Men = contract disputes; Tian Ji = hidden defects or frequent changes.',
        'Example: Wu Qu Hua Ji with Qing Yang in Property — lawsuits over property, or a crushing mortgage after buying.'
      ]},
      { h: 'Family Pressure', ps: [
        'Family may stress you — in-law conflicts, interference, or endless worries at home.',
        'Home may not feel like rest — it\'s more tiring than being out. The atmosphere may be oppressive, a family member unstable, or you\'ve turned home into another office.',
        'With Huo Ling, arguments at home; with Tuo Luo, unresolved family issues; with Kong Jie, a cold or empty home.'
      ]},
      { h: 'Can\'t Stay Home', ps: [
        'You may not be able to stay home — preferring to go out, more relaxed on business trips, anxious at home. Unlike Travel Palace Hua Ji (trouble outside), here the trouble is inside.',
        'You find security outside home — cafes, offices, travel. Or you\'re perfectionistic about home, forever renovating or moving because the current place isn\'t good enough.',
        'With Hua Lu or Lu Cun, "bitter first, sweet later" — renting or mortgage stress early, property becomes your biggest asset midlife. With Hua Quan, you rule the home (and clash over it).'
      ]},
      { h: 'Timing: When Home Moves', ps: [
        'A ten-year cycle with Hua Ji in Property makes home the focus — buying, moving, renovating, or family conflict. Be cautious with transactions; read contracts; don\'t buy impulsively.',
        'An annual Hua Ji entering Property brings household trouble — disputes, family illness, renovation problems, theft. No big property transactions this year.',
        'An annual Hua Lu entering Property brings celebration — buying, moving, a new family member, improved relations. Good year to buy.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Property Palace:'], ol: [
        'Which star transforms? Wu Qu = mortgage/loss, Tai Yin = damp/disputes, Ju Men = contract issues, Tian Ji = defects.',
        'Check Hua Lu/Quan/Ke — with Lu, bitter then sweet; with Quan, you decide; with Ke, reputable property.',
        'Check malefics: Qing Yang = lawsuits, Tuo Luo = dragging issues, Huo Ling = arguments, Kong Jie = empty home.',
        'Read the opposite Children Palace — home and children interact.',
        'Is home a haven or a cage?',
        'Timing: decade Ji = home-focused decade, annual Ji = household trouble, annual Lu = home celebration.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-tianzhaigong.html', text: 'The Property Palace' },
      { href: 'ziwei-tianzhaigong-hualu.html', text: 'Property Palace Hua Lu' },
      { href: 'ziwei-tianzhaigong-huaquan.html', text: 'Property Palace Hua Quan' },
      { href: 'ziwei-zinvgong-huaji.html', text: 'Children Palace Hua Ji' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-fudegong-huaji',
    cnTitle: '紫微斗数福德宫化忌：想不开还是想得深，化忌在福德怎么转',
    enTitle: 'Mental Palace With Hua Ji: Can\'t Let Go or Thinking Deeply?',
    cnDesc: '福德宫化忌，精神上容易焦虑、多想、放不下。但化忌也主深度思考，用对了是洞察力。',
    enDesc: 'Hua Ji in the Mental Palace brings anxiety, overthinking, and inability to let go. But it also grants depth of thought — channeled well, it is insight.',
    cnLead: '福德宫化忌的人，脑子通常「停不下来」。你可能失眠、焦虑、想太多，别人觉得没什么的事你能想三天。化忌在福德宫，精神世界是你一辈子的功课——你需要学会跟自己的脑子和平相处，而不是跟它对抗。',
    cnIntro2: '福德宫看精神世界、潜意识和享受能力。化忌落在这个宫位，你的精神能量是「内旋」的——所有想法往心里钻，钻深了是智慧，钻偏了是抑郁。',
    cnSections: [
      { h: '想太多', ps: [
        '化忌在福德宫最典型的特征是「想太多」——别人一句话你想半天，一件小事你反复琢磨，晚上躺在床上脑子像放电影。',
        '什么星化忌决定了想什么。天机化忌，想各种可能性和算计，脑子停不下来；太阴化忌，想感情、想过去、容易伤感；巨门化忌，想是非、想别人怎么看自己；贪狼化忌，想欲望、想得不到的东西。',
        '举个组合：福德宫天机化忌加文昌。天机主思考，文昌主文字——这种人可能是作家、策划、或者「想得多写得多」的人，但也容易因为脑子太活跃而失眠。'
      ]},
      { h: '享受能力差', ps: [
        '福德宫也看享受。化忌在福德宫的人，「享受能力」比较差——度假时想着工作，吃饭时想着热量，放松时有罪恶感。',
        '你可能什么都有了但不快乐，因为化忌的能量是「收」——它把你的注意力收在「还缺什么」「还没做好什么」上，而不是「已经有什么」。',
        '这跟化禄在福德的「天生乐观」相反。化禄是不想，化忌是想太多。但化忌的「想」如果引导好了，能看到别人看不到的深度。'
      ]},
      { h: '深度思考和洞察力', ps: [
        '化忌在福德宫不全是坏事。你比别人想得深、看得透——别人看到表面，你看到动机；别人看到结果，你看到原因。',
        '很多哲学家、心理学家、作家、研究者的福德宫都有化忌或类似能量。他们的「想不开」变成了对人性和世界的深刻理解。',
        '化忌加昌曲，思想和表达能力强，适合写作和研究；加天魁天钺，精神上有导师缘，能遇到帮你走出困境的人；加化科，能靠名声或专业化解精神困境。'
      ]},
      { h: '流年引动：精神状态什么时候紧', ps: [
        '第一种：大限福德宫化忌。这十年精神压力大——可能焦虑、抑郁、失眠，或者经历信仰危机。这十年要主动照顾心理健康，不要硬撑。',
        '第二种：流年化忌入福德。这一年容易想不开——焦虑、低落、钻牛角尖。这种年份不要做重大决定，多运动多社交，必要时找专业人士。',
        '第三种：流年化禄或化科入福德。这一年精神状态好——想得开、心情好、可能遇到好的精神引导。适合学习、修行、创作。'
      ]},
      { h: '排盘后的使用顺序', ps: ['福德宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——天机主想太多，太阴主伤感，巨门主在意是非，贪狼主欲望不满足。',
        '看有无化禄化权化科——有科精神有出口，有禄能想开，有权能控制情绪。',
        '看煞星：火铃主焦虑急躁，陀罗主想不开，空劫主精神空虚。',
        '看对宫财帛宫：精神状态和财务状况互相影响。',
        '看精神出口：你有没有一个能让脑子停下来的爱好？',
        '流年分三种：大限忌主十年精神压力，流年忌入福德主当年想不开，流年禄科入福德主当年心境好。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-fudegong-hualu.html', text: '福德宫化禄' },
      { href: 'ziwei-fudegong-huaquan.html', text: '福德宫化权' },
      { href: 'ziwei-minggong-huaji.html', text: '命宫化忌' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ji in the Mental Palace have minds that won\'t stop — insomnia, anxiety, overthinking, chewing on something for days that others shrug off. Your inner life is a lifelong lesson: you must learn to coexist with your mind rather than fight it.',
    enIntro2: 'The Mental Palace covers inner life, subconscious, and the capacity for enjoyment. Hua Ji here turns mental energy inward — at depth it is wisdom; misdirected it is depression.',
    enSections: [
      { h: 'Overthinking', ps: [
        'The hallmark is overthinking — replaying a comment for half a day, ruminating on small things, lying in bed with a mind like a movie projector.',
        'Which star transforms determines the content: Tian Ji = possibilities and calculations; Tai Yin = feelings and the past; Ju Men = gossip and others\' opinions; Tan Lang = desire and what you can\'t have.',
        'Example: Tian Ji Hua Ji with Wen Chang in Mental — a writer or strategist who thinks and writes a lot, but whose active mind also causes insomnia.'
      ]},
      { h: 'Poor Capacity for Enjoyment', ps: [
        'You don\'t enjoy well — thinking about work on vacation, counting calories at dinner, feeling guilty when relaxing.',
        'You may have everything and still be unhappy, because Hua Ji focuses attention on what\'s missing or undone rather than what you have.',
        'This is the opposite of Hua Lu in Mental (natural optimism). Hua Lu doesn\'t think; Hua Ji thinks too much. But that thinking, well-directed, sees depth others miss.'
      ]},
      { h: 'Depth and Insight', ps: [
        'It isn\'t all bad. You think deeper and see more clearly — others see surface, you see motive; others see result, you see cause.',
        'Many philosophers, psychologists, writers, and researchers have this energy. Their "can\'t let go" becomes profound understanding of human nature.',
        'With Chang Qu, strong thought and expression — suited to writing and research. With Kui/Yue, a mentor helps you through. With Hua Ke, reputation or expertise resolves the inner crisis.'
      ]},
      { h: 'Timing: When the Mind Tightens', ps: [
        'A ten-year cycle with Hua Ji in Mental brings heavy mental pressure — anxiety, depression, insomnia, a crisis of faith. Actively care for your mental health this decade; don\'t tough it out.',
        'An annual Hua Ji entering Mental brings dark thinking — anxiety, low mood, rumination. Don\'t make major decisions; exercise, socialize, seek help if needed.',
        'An annual Hua Lu or Hua Ke entering Mental brings clarity — perspective, good mood, a spiritual guide. Good for study, practice, creation.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Mental Palace:'], ol: [
        'Which star transforms? Tian Ji = overthinking, Tai Yin = melancholy, Ju Men = opinion anxiety, Tan Lang = unmet desire.',
        'Check Hua Lu/Quan/Ke — with Ke, an outlet; with Lu, perspective; with Quan, emotional control.',
        'Check malefics: Huo Ling = anxiety, Tuo Luo = can\'t let go, Kong Jie = emptiness.',
        'Read the opposite Wealth Palace — mental state and finances interact.',
        'Do you have a hobby that stops your mind?',
        'Timing: decade Ji = mental pressure decade, annual Ji = dark year, annual Lu/Ke = clear year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-fudegong-hualu.html', text: 'Mental Palace Hua Lu' },
      { href: 'ziwei-fudegong-huaquan.html', text: 'Mental Palace Hua Quan' },
      { href: 'ziwei-minggong-huaji.html', text: 'Life Palace Hua Ji' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-fumugong-huaji',
    cnTitle: '紫微斗数父母宫化忌：跟父母的结，化忌在父母怎么解',
    enTitle: 'Parents Palace With Hua Ji: The Knot With Parents',
    cnDesc: '父母宫化忌，跟父母缘分薄或关系有结，也可能父母身体让你操心。化忌不是不孝，是亲子关系有课题。',
    enDesc: 'Hua Ji in the Parents Palace means a thin or tangled bond with parents, or worry over their health. It does not mean being unfilial — it means the parent-child bond has lessons.',
    cnLead: '父母宫化忌的人，跟父母的关系通常「有结」。可能是父母严厉、可能是沟通不畅、可能是小时候不在父母身边、也可能是父母身体不好让你操心。化忌在父母宫，你对父母的感情可能很复杂——爱、责任、委屈、愧疚混在一起，说不清道不明。',
    cnIntro2: '父母宫看父母、长辈、上司和文书。化忌落在这个宫位，你跟权威和「根」的关系有课题——你需要在孝顺和自我之间找到平衡。',
    cnSections: [
      { h: '跟父母的结', ps: [
        '化忌在父母宫，你跟父母之间可能有一种「说不清的距离」——不是不爱，而是不知道怎么亲近。可能是小时候父母忙、被爷爷奶奶带大、或者父母表达爱的方式是「严格要求」。',
        '什么星化忌决定了结的类型。太阳化忌，跟父亲关系有结——父亲严厉、缺席、或跟父亲有冲突；太阴化忌，跟母亲关系有结——母亲控制欲强、情绪化、或跟母亲有感情纠葛；巨门化忌，跟父母沟通不畅、吵架多；天机化忌，跟父母有误会或算计。',
        '举个组合：父母宫太阳化忌加擎羊。太阳主父亲，化忌是亏欠，擎羊是冲突——这种组合跟父亲的关系可能很紧张，从小被打到大或者成年后决裂。'
      ]},
      { h: '父母身体让你操心', ps: [
        '化忌在父母宫，父母的身体可能让你操心——可能是慢性病、可能是年纪大了需要照顾、也可能是突发疾病。',
        '这种操心不只是钱的问题，更是精力和情绪的消耗。你可能需要在工作和照顾父母之间平衡，或者因为不在父母身边而愧疚。',
        '化忌加天魁天钺，虽然操心但父母遇得到好医生；加昌曲，父母可能有文化但身体弱；加煞星，父母身体问题更严重或更突然。'
      ]},
      { h: '上司和文书', ps: [
        '父母宫也看上司。化忌在父母宫，你跟上司的关系可能也「有结」——遇到严厉的领导、跟领导沟通不畅、或者被领导压制。',
        '你可能不适合在「权威型」组织里工作——层级森严、领导说一不二的环境让你窒息。你更适合扁平管理、或者自己做自己的老板。',
        '在文书方面，化忌在父母宫要注意合同、签证、考试——可能因为文书出错、材料不全、或者审批延迟。重要文件要反复检查。'
      ]},
      { h: '流年引动：父母的事什么时候动', ps: [
        '第一种：大限父母宫化忌。这十年父母是重点——父母身体、养老、或者跟父母的关系需要面对。这十年多陪伴、多耐心，不要等到「子欲养而亲不待」。',
        '第二种：流年化忌入父母。这一年父母身体要注意，或者跟上司关系紧张。也可能文书出问题——合同纠纷、签证被拒、考试不顺。',
        '第三种：流年化禄或化科入父母。这一年父母有好事——身体好转、关系改善、或者遇到好领导。适合考试、签证、签合同。'
      ]},
      { h: '排盘后的使用顺序', ps: ['父母宫看到化忌，按这个顺序读：'], ol: [
        '先看什么星化忌——太阳主跟父亲的结，太阴主跟母亲的结，巨门主沟通不畅，天机主误会。',
        '看有无化禄化权化科——有科父母有名声或文书顺，有禄父母有财，有权父母强势。',
        '看煞星：擎羊主冲突，陀罗主关系拖延，火铃主急躁，空劫主缘分薄。',
        '看对宫疾厄宫：父母身体和你的健康互相影响。',
        '看你跟权威的关系：模式是什么？',
        '流年分三种：大限忌主十年父母事多，流年忌入父母主当年父母有事，流年禄科入父母主当年父母好。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-fumugong.html', text: '父母宫怎么看' },
      { href: 'ziwei-fumugong-huaquan.html', text: '父母宫化权' },
      { href: 'ziwei-fumugong-huake.html', text: '父母宫化科' },
      { href: 'ziwei-minggong-huaji.html', text: '命宫化忌' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Ji in the Parents Palace often have a knot with their parents — strictness, poor communication, being raised apart from them, or worry over their health. Your feelings toward them may be complex: love, duty, resentment, and guilt tangled together, hard to untangle.',
    enIntro2: 'The Parents Palace covers parents, elders, bosses, and documents. Hua Ji here makes your relationship with authority and "roots" a lesson — you must balance filial duty with selfhood.',
    enSections: [
      { h: 'The Knot With Parents', ps: [
        'There may be an indescribable distance — not lack of love, but not knowing how to be close. Perhaps parents were busy, you were raised by grandparents, or their love was expressed as strictness.',
        'Which star transforms determines the knot: Tai Yang = issues with father (strict, absent, conflict); Tai Yin = issues with mother (controlling, emotional, tangled); Ju Men = poor communication and arguments; Tian Ji = misunderstandings.',
        'Example: Tai Yang Hua Ji with Qing Yang in Parents — a tense relationship with the father, possibly harsh discipline or an adult rupture.'
      ]},
      { h: 'Worry Over Parents\' Health', ps: [
        'Parents\' health may worry you — chronic illness, aging care needs, or sudden disease.',
        'This isn\'t just financial; it consumes energy and emotion. You may balance work with caregiving, or feel guilty living far away.',
        'With Kui/Yue, despite worry, parents find good doctors. With Chang Qu, educated but frail parents. With malefics, more severe or sudden health issues.'
      ]},
      { h: 'Bosses and Documents', ps: [
        'Relationships with bosses may also be knotted — strict leaders, poor communication, feeling suppressed.',
        'You may not thrive in authoritarian organizations — rigid hierarchies suffocate you. Flatter structures or self-employment suit you better.',
        'For documents: watch contracts, visas, exams — errors, missing materials, delays. Double-check important paperwork.'
      ]},
      { h: 'Timing: When Parents Matter', ps: [
        'A ten-year cycle with Hua Ji in Parents makes parents the focus — health, elder care, the relationship itself. Be present and patient; don\'t wait until it\'s too late.',
        'An annual Hua Ji entering Parents means watch parents\' health, or tension with a boss. Documents may also go wrong — contract disputes, visa denials, exam failures.',
        'An annual Hua Lu or Hua Ke entering Parents brings good news — improved health, better relations, a good boss. Good year for exams, visas, contracts.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ji in the Parents Palace:'], ol: [
        'Which star transforms? Tai Yang = father knot, Tai Yin = mother knot, Ju Men = communication, Tian Ji = misunderstanding.',
        'Check Hua Lu/Quan/Ke — with Ke, reputation/smooth documents; with Lu, parental means; with Quan, strong parents.',
        'Check malefics: Qing Yang = conflict, Tuo Luo = dragging, Huo Ling = impatience, Kong Jie = thin bond.',
        'Read the opposite Health Palace — parents\' health and yours interact.',
        'What\'s your pattern with authority?',
        'Timing: decade Ji = parent-focused decade, annual Ji = parent trouble year, annual Lu/Ke = parent relief year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-fumugong.html', text: 'The Parents Palace' },
      { href: 'ziwei-fumugong-huaquan.html', text: 'Parents Palace Hua Quan' },
      { href: 'ziwei-fumugong-huake.html', text: 'Parents Palace Hua Ke' },
      { href: 'ziwei-minggong-huaji.html', text: 'Life Palace Hua Ji' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-zihua-huaji',
    cnTitle: '紫微斗数自化忌：自己跟自己过不去，自化忌怎么转',
    enTitle: 'Self-Hua Ji: When You Get in Your Own Way',
    cnDesc: '自化忌是宫位天干自己化忌回本宫，主自己消耗自己、事情自己搞砸。理解自化忌，是读懂命盘「内耗」的关键。',
    enDesc: 'Self-Hua Ji occurs when a palace\'s own stem transforms a star back into itself — self-sabotage and internal friction. Understanding it is key to reading self-defeat in a chart.',
    cnLead: '自化忌是四化里最「绕」的概念。生年化忌是「天生带的课题」，自化忌是「自己搞出来的问题」。如果说化忌是「收」，自化忌就是「自己把自己收住」——事情本来没那么难，是你自己把自己绕进去了。',
    cnIntro2: '自化忌的判断方法：某个宫位里的星曜，被该宫位天干引发化忌，就叫自化忌。比如命宫天干为癸，命宫里有贪狼，贪狼被癸干引发化忌，就是命宫自化忌。它跟生年化忌的区别是：生年化忌是「天给的」，自化忌是「自己作的」。',
    cnSections: [
      { h: '自化忌的核心：自我消耗', ps: [
        '自化忌最核心的意思是「自己消耗自己」。在哪个宫位自化忌，你就在哪个领域自己跟自己过不去——不是别人害你，不是环境不好，是你自己的行为模式把事情搞砸了。',
        '命宫自化忌，自己否定自己——明明做得不错但总觉得不够，或者关键时刻自己放弃；财帛宫自化忌，自己把钱花掉——赚得到但守不住，投资自己拍板亏损；夫妻宫自化忌，自己把关系作没了——明明好好的偏要试探、猜忌、冷战。',
        '自化忌跟生年化忌最大的区别是：生年化忌的课题是「外来的」，你需要承受和转化；自化忌的课题是「内生的」，你需要觉察和停止。'
      ]},
      { h: '十二宫自化忌', ps: [
        '命宫自化忌：自我否定，关键时刻掉链子。需要建立自信和「完成比完美重要」的意识。',
        '兄弟宫自化忌：自己跟兄弟姐妹过不去，或者因自己的决定在同辈关系中吃亏。',
        '夫妻宫自化忌：自己在感情里「作」——试探、猜忌、冷战，把对方推走。需要学会直接表达。',
        '子女宫自化忌：对孩子过度焦虑或过度控制，自己把亲子关系搞僵。',
        '财帛宫自化忌：自己破财——冲动消费、错误投资、不好意思谈钱。需要建立财务纪律。',
        '疾厄宫自化忌：自己糟蹋身体——熬夜、不运动、不忌口，或者对身体过度焦虑。',
        '迁移宫自化忌：自己在外面搞砸——说错话、做错事、或者害怕出门。',
        '交友宫自化忌：自己选错朋友——不会识人、对人太好反被利用。',
        '官禄宫自化忌：自己在事业上使绊子——不敢争取、频繁跳槽、或者跟领导对着干。',
        '田宅宫自化忌：自己把家搞乱——装修冲动、家庭矛盾中自己拱火、或者在家待不住。',
        '福德宫自化忌：自己想不开——钻牛角尖、精神内耗、享受时有罪恶感。',
        '父母宫自化忌：自己跟父母或上司搞僵——顶嘴、叛逆、或者文书自己出错。'
      ]},
      { h: '自化忌怎么转', ps: [
        '自化忌的转机在于「觉察」。因为它是你自己的行为模式造成的，所以一旦你看到了它，就能停下来。这跟生年化忌不同——生年化忌需要「转化」，自化忌需要「停止」。',
        '第一步：在哪个宫位自化忌，就承认自己在哪个领域「自己搞自己」。不要怪别人、怪环境，先承认这是自己的模式。',
        '第二步：找到那个「触发点」——你通常在什么情况下开始自我消耗？是被批评时？是比较时？是恐惧时？找到触发点，就能在它启动时认出它。',
        '第三步：给自己一个「停止动作」——深呼吸、离开现场、找人说、写下来。自化忌的能量是内旋的，你需要一个外部动作把它打断。'
      ]},
      { h: '流年引动：自化忌什么时候发作', ps: [
        '自化忌是「常态」，但在流年引动时会更明显。当流年宫位与自化忌的宫位重叠或对冲时，那一年你特别容易在该领域「自己搞自己」。',
        '比如夫妻宫自化忌的人，遇到流年化忌入夫妻或大限夫妻宫化忌，那一年感情中的「作」会变本加厉——明明没事偏要找出事来。这种年份要特别提醒自己：不要作。',
        '自化忌也有好的一面——当你学会觉察和停止后，自化忌的能量会变成「自我修正能力」。你比别人更能发现自己的问题，也更能主动调整。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到自化忌，按这个顺序读：'], ol: [
        '先找哪个宫位自化忌——宫位决定领域。',
        '看什么星自化忌——星曜决定方式（贪狼自化忌是欲望，巨门自化忌是非，天机自化忌是算计）。',
        '看有无生年化忌在同一个宫位——生年忌加自化忌，课题加倍，需要更主动地转化。',
        '看有无化禄来救——宫位有自化忌但对宫或三方有化禄，「自己搞砸但有人帮」。',
        '看自己的触发点：什么情况下你开始自我消耗？',
        '流年引动时特别注意：那一年在该领域「不要作」。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-huaji.html', text: '化忌总论' },
      { href: 'ziwei-minggong-huaji.html', text: '命宫化忌' },
      { href: 'ziwei-huake-huaji-tongjian-youshi-kadian.html', text: '化科化忌同宫' },
      { href: 'ziwei-huaji-xiankan-kadian-bukan-xiongji.html', text: '化忌先看卡点' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'Self-Hua Ji is the most intricate concept in the Four Transformations. Birth-chart Hua Ji is a lesson given by heaven; Self-Hua Ji is a problem you create yourself. If Hua Ji is "gathering in," Self-Hua Ji is "tying yourself up" — things aren\'t that hard, but you wind yourself into knots.',
    enIntro2: 'How to identify it: when a star in a palace is transformed to Hua Ji by that palace\'s own heavenly stem, it is Self-Hua Ji. For example, if the Life Palace stem is Gui and Tan Lang sits there, Gui triggers Tan Lang Hua Ji — that is Self-Hua Ji in Life. The key difference from birth Hua Ji: birth Hua Ji is given; Self-Hua Ji is self-inflicted.',
    enSections: [
      { h: 'The Core: Self-Sabotage', ps: [
        'Self-Hua Ji means self-consumption. In whichever palace it sits, you get in your own way — not because of others or circumstances, but because your own behavioral pattern screws things up.',
        'Life Palace Self-Hua Ji: self-denial, quitting at the key moment. Wealth Palace Self-Hua Ji: spending what you earn, self-approved bad investments. Spouse Palace Self-Hua Ji: testing, jealousy, cold wars that push the partner away.',
        'The key difference: birth Hua Ji comes from outside and must be transformed; Self-Hua Ji arises from within and must be recognized and stopped.'
      ]},
      { h: 'Self-Hua Ji Across Twelve Palaces', ps: [
        'Life: self-denial, choking under pressure. Build confidence; "done beats perfect."',
        'Siblings: making things difficult with siblings or peers through your own decisions.',
        'Spouse: self-sabotaging love — testing, suspicion, cold wars. Learn direct expression.',
        'Children: over-anxiety or over-control that stiffens the bond.',
        'Wealth: self-inflicted loss — impulse buys, bad investments, awkwardness around money. Build financial discipline.',
        'Health: self-neglect — late nights, no exercise, poor diet — or health anxiety.',
        'Travel: self-sabotage outside — saying the wrong thing, or fear of going out.',
        'Friends: choosing the wrong friends, being too nice and getting used.',
        'Career: self-sabotage at work — not advocating for yourself, job-hopping, clashing with bosses.',
        'Property: creating chaos at home — impulsive renovation, stoking family conflict, restlessness.',
        'Mental: overthinking, internal friction, guilt when enjoying.',
        'Parents: clashing with parents or bosses, document errors.'
      ]},
      { h: 'How to Transform It', ps: [
        'The turning point is awareness. Because the pattern is yours, once you see it, you can stop it. Birth Hua Ji needs transformation; Self-Hua Ji needs cessation.',
        'Step 1: In the palace with Self-Hua Ji, admit you self-sabotage there. Don\'t blame others or circumstances.',
        'Step 2: Find the trigger — when do you start self-consuming? When criticized? When comparing? When afraid? Naming the trigger lets you catch it activating.',
        'Step 3: Give yourself a "stop action" — deep breath, leave the room, talk to someone, write it down. Self-Hua Ji spirals inward; you need an external action to break it.'
      ]},
      { h: 'Timing: When It Flares', ps: [
        'Self-Hua Ji is constant but becomes more obvious when activated by annual cycles. When the annual palace overlaps or opposes the Self-Hua Ji palace, that year you\'re especially prone to self-sabotage in that area.',
        'For example, someone with Spouse Palace Self-Hua Ji, in a year when annual Hua Ji enters Spouse, will dramatically amplify the testing and jealousy — creating problems from nothing. Remind yourself: don\'t do it.',
        'There\'s an upside: once you learn awareness and stopping, Self-Hua Ji becomes self-correction. You\'re better than most at spotting your own issues and adjusting.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Self-Hua Ji:'], ol: [
        'Which palace has it — that determines the area.',
        'Which star self-transforms — that determines the mode (Tan Lang = desire, Ju Men = speech, Tian Ji = calculation).',
        'Is there also birth Hua Ji there? Double lesson; more active work needed.',
        'Is there Hua Lu to rescue — self-sabotage but someone helps.',
        'What\'s your trigger?',
        'When activated by annual cycles: especially remind yourself — don\'t self-sabotage.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-huaji.html', text: 'Hua Ji Overview' },
      { href: 'ziwei-minggong-huaji.html', text: 'Life Palace Hua Ji' },
      { href: 'ziwei-huake-huaji-tongjian-youshi-kadian.html', text: 'Hua Ke + Hua Ji Together' },
      { href: 'ziwei-huaji-xiankan-kadian-bukan-xiongji.html', text: 'Read the Sticking Point First' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
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
