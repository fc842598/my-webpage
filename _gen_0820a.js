const fs = require('fs');
const path = require('path');
const date = '2026-08-20T10:15:00+08:00';
function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

const articles = [
  {
    slug: 'ziwei-kanpan-buneng-zhikan-minggong',
    cnTitle: '紫微斗数看盘为什么不能只看命宫：你忽略的宫位才是答案',
    enTitle: 'Why You Can\'t Read a Chart by Life Palace Alone',
    cnDesc: '很多人看紫微斗数只盯着命宫，但命宫只回答「你是谁」，不回答「你会遇到什么」。十二宫是一个系统，答案在宫位之间的关系里。',
    enDesc: 'Many people only look at the Life palace, but it only answers "who you are," not "what you\'ll encounter." The twelve palaces are a system; answers lie in relationships between palaces.',
    cnLead: '你是不是也这样：排完盘第一眼就看命宫，命宫有紫微星就高兴，有煞星就叹气。但如果你只看命宫，你最多只读懂了这张盘的十分之一。命宫是「你」，但你的人生不是只有「你」——你的钱在财帛宫，你的工作在官禄宫，你的感情在夫妻宫，你的十年在大限。只看命宫就像只看一个人的身份证就判断他的一生，信息远远不够。',
    cnIntro2: '命宫是十二宫的「起点」，不是「全部」。它告诉你一个人的核心性格和天赋，但性格怎么变现要看财帛和官禄，感情好不好要看夫妻和福德，有没有贵人要看迁移和交友。紫微斗数的「斗数」两个字，说的就是宫与宫之间的「数」——关系、流动、因果。',
    cnSections: [
      { h: '命宫能回答什么', ps: [
        '命宫回答「你是谁」——你的性格、天赋、核心驱动力。',
        '命宫的星曜决定你「用什么方式」面对人生——紫微是领导型，天机是思考型，七杀是开创型。',
        '但命宫不回答「你会遇到什么」——遇到什么事，要看对应的宫位。',
        '命宫也不回答「什么时候发生」——时间要看大限和流年。'
      ]},
      { h: '只看命宫会犯什么错', ps: [
        '命宫好就觉得一切都会好——命宫有紫微天府但官禄宫空宫加煞，你可能有领导力但没平台发挥。',
        '命宫差就觉得一切都完了——命宫有煞星但财帛宫化禄，你可能性格辛苦但赚钱不少。',
        '忽略宫位之间的联动——夫妻宫差但福德宫好，你可能婚姻有波折但内心强大，能扛过去。',
        '最常见的错误：命宫有化忌就觉得命不好，但化忌在命宫可能只是「性格纠结」，不代表人生失败。'
      ]},
      { h: '正确的看盘顺序', ps: ['看盘不是从命宫开始「逐颗星读」，而是按问题找宫位：'], ol: [
        '先定大方向——命宫和身宫，知道这个人的核心特质。',
        '看三方四正——命宫的三方是财帛、官禄、迁移，这三个宫决定命宫能不能「落地」。',
        '按问题找宫位——问财运看财帛，问事业看官禄，问感情看夫妻，不要什么都往命宫上套。',
        '看大限流年——本命盘是「地图」，大限流年是「你走到了哪里」。',
        '看宫位之间的关系——财帛宫化禄入官禄，是「钱投资到事业上」；官禄宫化忌入夫妻，是「工作影响婚姻」。',
        '最后才回到命宫——看这个人有没有能力承接住这些运势。'
      ]},
      { h: '一个例子', ps: [
        '两个人命宫都是紫微天府，看起来一样。但一个人官禄宫有化禄化权，另一个人官禄宫空宫加擎羊。',
        '第一个人有领导力也有平台，能做成事；第二个人有领导力但没平台，可能怀才不遇。',
        '如果只看命宫，你会觉得两个人命运一样；看了官禄宫，才知道差别在哪。',
        '这就是为什么不能只看命宫——命宫是「种子」，其他宫位是「土壤、阳光、水」。'
      ]},
      { h: '排盘后的使用顺序', ps: ['下次看盘，试试这个顺序：'], ol: [
        '先问自己：我想知道什么？（财运、事业、感情、健康）',
        '找到对应的宫位，先看那个宫，不要先看命宫。',
        '看那个宫的三方四正，了解这件事的「生态环境」。',
        '看大限流年走到哪里，知道「什么时候发生」。',
        '最后看命宫，知道「我能不能应对」。',
        '记住：命宫是你，但世界不是围着你转的。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-learning-path.html', text: '看盘方法总览' },
      { href: 'ziwei-minggong.html', text: '命宫详解' },
      { href: 'ziwei-sanfang-sizheng-shenme-shihou-bixulai-duigong.html', text: '三方四正怎么用' },
      { href: 'ziwei-daxian.html', text: '大限详解' },
      { href: 'ziwei-kanpan-xiankan-dafangxiang.html', text: '看盘先看大方向' },
      { href: '../pages/mingbook-onepage.html', text: '快速排盘' }
    ],
    enLead: 'Do you do this too: after casting a chart, you look straight at the Life palace — happy if it has Zi Wei, sighing if it has malefics. But if you only look at Life, you understand at most one-tenth of the chart. Life palace is "you," but your life isn\'t only "you" — your money is in Wealth, your work in Career, your relationships in Spouse, your decades in Major Cycles. Looking only at Life is like judging someone\'s whole life from their ID card.',
    enIntro2: 'Life palace is the "starting point," not the "whole." It tells you core personality and talents, but how personality monetizes depends on Wealth and Career; whether relationships work depends on Spouse and Fortune; benefactors depend on Travel and Friends. "Dou Shu" means the "numbers" between palaces — relationships, flows, cause and effect.',
    enSections: [
      { h: 'What Life Palace Answers', ps: [
        'Life answers "who you are" — personality, talents, core drive.',
        'Stars in Life determine "how you approach life" — Zi Wei leads, Tian Ji thinks, Qi Sha pioneers.',
        'But Life doesn\'t answer "what you\'ll encounter" — that depends on the relevant palace.',
        'Nor "when it happens" — timing depends on major cycles and annual cycles.'
      ]},
      { h: 'Mistakes of Only Looking at Life', ps: [
        'Good Life = everything will be fine — Zi Wei/Tian Fu in Life but empty Career with malefics means leadership without a platform.',
        'Bad Life = everything is ruined — malefics in Life but Hua Lu in Wealth means a tough personality but good earnings.',
        'Ignoring palace connections — bad Spouse but good Fortune means rocky marriage but inner strength to endure.',
        'Most common error: Hua Ji in Life means "bad fate," but it may just mean "overthinking personality," not life failure.'
      ]},
      { h: 'Correct Reading Order', ps: ['Don\'t read star by star from Life; find palaces by question:'], ol: [
        'Set the big picture — Life and Body palaces, core traits.',
        'Check triple direction — Wealth, Career, Travel determine whether Life can "land."',
        'Find palaces by question — Wealth for money, Career for work, Spouse for love; don\'t force everything onto Life.',
        'Check cycles — natal chart is the "map," cycles show "where you are."',
        'Check relationships between palaces — Hua Lu from Wealth to Career means "money invested in career"; Hua Ji from Career to Spouse means "work affects marriage."',
        'Return to Life last — can this person handle what the cycles bring?'
      ]},
      { h: 'An Example', ps: [
        'Two people both have Zi Wei/Tian Fu in Life — looks identical. But one has Hua Lu/Hua Quan in Career, the other has empty Career with Qing Yang.',
        'The first has leadership and a platform, gets things done; the second has leadership but no platform, may feel unrecognized.',
        'Looking only at Life, you\'d think they have the same fate; looking at Career shows the difference.',
        'That\'s why you can\'t only look at Life — Life is the "seed," other palaces are "soil, sun, water."'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['Next time, try this:'], ol: [
        'Ask: what do I want to know? (money, career, love, health)',
        'Find the relevant palace first — don\'t start with Life.',
        'Check that palace\'s triple direction for the "ecosystem."',
        'Check cycles to know "when."',
        'Finally check Life to know "can I handle it."',
        'Remember: Life is you, but the world doesn\'t revolve around you.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-learning-path.html', text: 'Reading Methods' },
      { href: 'ziwei-minggong.html', text: 'Life Palace' },
      { href: 'ziwei-sanfang-sizheng-shenme-shihou-bixulai-duigong.html', text: 'Triple Direction' },
      { href: 'ziwei-daxian.html', text: 'Major Cycles' },
      { href: 'ziwei-kanpan-xiankan-dafangxiang.html', text: 'Big Picture First' },
      { href: '../../pages/mingbook-onepage.html', text: 'Quick Chart' }
    ]
  },
  {
    slug: 'ziwei-shenggong-zhengque-yongfa',
    cnTitle: '紫微斗数身宫到底怎么用：它不是第二个命宫',
    enTitle: 'How to Actually Use the Body Palace: It\'s Not a Second Life Palace',
    cnDesc: '身宫常被误解为「第二个命宫」，其实它代表你35岁后逐渐活出的样子和后天努力的方向。身宫跟命宫一致是加成，不一致是张力。',
    enDesc: 'The Body Palace is often misunderstood as a "second Life palace." It actually represents who you gradually become after 35 and the direction of后天 effort. Aligned with Life it amplifies; misaligned it creates tension.',
    cnLead: '很多人排完盘看到身宫，第一反应是「身宫是什么？跟命宫一样吗？」然后发现身宫跟命宫不在同一个位置，就开始纠结「我到底是命宫的人还是身宫的人」。身宫不是第二个命宫，它是你「后天活出来的样子」——命宫是出厂设置，身宫是你用了几十年后修改的设置。35岁之前你活的是命宫，35岁之后身宫的力量越来越强。',
    cnIntro2: '身宫的特点：它不单独占一个宫位，而是寄生在命宫、夫妻宫、财帛宫、迁移宫、官禄宫、福德宫这六个宫之一。身宫在哪个宫，说明你后天的人生重心会偏向哪个领域。身宫跟命宫在同一个位置叫「命身同宫」，是加成；不在同一个位置，说明你先天和后天之间有张力。',
    cnSections: [
      { h: '身宫在六个宫的含义', ps: [
        '身宫在命宫——命身同宫，先天后天一致，你从小就知道自己要什么，人生方向明确。',
        '身宫在夫妻宫——后天重心在感情和婚姻，你可能为家庭付出很多，或者通过关系成长。',
        '身宫在财帛宫——后天重心在赚钱和物质，你越长大越务实，经济基础决定你的安全感。',
        '身宫在迁移宫——后天重心在外部世界，适合离开家乡发展，越在外越有出息。',
        '身宫在官禄宫——后天重心在事业，你是工作型的人，事业成就定义你的人生价值。',
        '身宫在福德宫——后天重心在精神世界，你越长大越追求内心满足，而不是外在成就。'
      ]},
      { h: '命身一致 vs 命身不一致', ps: [
        '命身同宫——先天性格和后天方向一致，人生比较顺，但也可能缺乏变化和突破。',
        '命身不同宫——先天性格和后天方向有张力，年轻时可能迷茫，但这种张力也是成长的动力。',
        '比如命宫在官禄宫（事业心重）但身宫在福德宫（追求精神满足），你可能年轻时拼命工作，中年后开始追问「这一切有什么意义」。',
        '命身不一致不是坏事——它说明你的人生有「转折」和「深化」的可能。'
      ]},
      { h: '身宫什么时候起作用', ps: [
        '童年和青少年时期，命宫的力量主导——你的性格是天生的。',
        '20-35岁，命宫和身宫开始拉锯——你在先天性格和后天追求之间挣扎。',
        '35岁以后，身宫的力量逐渐增强——你活成了自己「选择」的样子，而不只是天生的样子。',
        '大限走到身宫所在的宫位时，身宫的主题会被强烈激活。'
      ]},
      { h: '身宫怎么读', ps: [
        '先看身宫在哪个宫——确定你后天的人生重心。',
        '再看身宫里有什么星——这些星描述你后天发展的方式和资源。',
        '看身宫跟命宫的关系——一致是加成，不一致是张力。',
        '看身宫的三方四正——后天发展的环境和支持。',
        '不要把身宫当命宫读——身宫不描述「你是谁」，而描述「你成为谁」。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到身宫，按这个顺序读：'], ol: [
        '先看身宫在哪个宫——命、夫妻、财帛、迁移、官禄、福德。',
        '看身宫里的星曜——你后天用什么方式发展。',
        '对比命宫——命身一致还是不一致？',
        '看大限——什么时候走到身宫位置，那是你人生转折的十年。',
        '身宫是你的「人生第二幕」——不要忽视它。',
        '问自己：你现在活的是命宫还是身宫？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-learning-path.html', text: '看盘方法总览' },
      { href: 'ziwei-minggong.html', text: '命宫详解' },
      { href: 'ziwei-shengong.html', text: '身宫详解' },
      { href: 'ziwei-daxian.html', text: '大限详解' },
      { href: 'ziwei-kanpan-buneng-zhikan-minggong.html', text: '不能只看命宫' },
      { href: '../pages/mingbook-onepage.html', text: '快速排盘' }
    ],
    enLead: 'Many people see the Body palace and think "what is it? Is it the same as Life?" Then finding it in a different position, they wonder "which one am I?" The Body palace isn\'t a second Life palace — it\'s who you "become through后天 living." Life is factory settings; Body is settings you\'ve modified after decades. Before 35 you live Life; after 35, Body grows stronger.',
    enIntro2: 'Body palace doesn\'t occupy its own position — it parasitizes one of six palaces: Life, Spouse, Wealth, Travel, Career, or Fortune. Which palace it\'s in shows where your life重心 shifts后天. Body in Life = "Life-Body same palace" (amplification); in a different palace = tension between innate and后天.',
    enSections: [
      { h: 'Body in the Six Palaces', ps: [
        'Body in Life — innate and后天 aligned, you know what you want from young, clear direction.',
        'Body in Spouse —后天 focus on relationships and marriage; may give much to family or grow through partnership.',
        'Body in Wealth —后天 focus on earning and material; more practical as you age, financial security = safety.',
        'Body in Travel —后天 focus on the outside world; suited to leaving hometown, more successful away.',
        'Body in Career —后天 focus on work; you\'re a work-oriented person, career achievement defines self-worth.',
        'Body in Fortune —后天 focus on inner world; as you age, pursue spiritual fulfillment over external achievement.'
      ]},
      { h: 'Aligned vs Misaligned', ps: [
        'Life-Body same palace — innate personality and后天 direction aligned, smoother life but possibly less change.',
        'Different palaces — tension between innate and后天; may feel lost young, but this tension drives growth.',
        'E.g., Life in Career (work-focused) but Body in Fortune (spiritually focused) — you may work relentlessly young, then ask "what\'s the point?" in middle age.',
        'Misalignment isn\'t bad — it means your life has potential for "turning points" and "deepening."'
      ]},
      { h: 'When Body Takes Effect', ps: [
        'Childhood and teens: Life dominates — personality is innate.',
        '20s-30s: Life and Body pull — you struggle between innate character and后天 aspirations.',
        'After 35: Body strengthens — you become who you "chose" to be, not just who you were born.',
        'When a major cycle passes through the Body palace position, its theme activates strongly.'
      ]},
      { h: 'How to Read Body', ps: [
        'Which palace is Body in — determines后天 life focus.',
        'What stars are in Body — describe how and with what resources you develop后天.',
        'Relationship to Life — aligned amplifies, misaligned creates tension.',
        'Body\'s triple direction — environment and support for后天 development.',
        'Don\'t read Body like Life — Body doesn\'t describe "who you are" but "who you become."'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Body:'], ol: [
        'Which palace is it in — Life, Spouse, Wealth, Travel, Career, Fortune.',
        'What stars are there — how you develop后天.',
        'Compare with Life — aligned or misaligned?',
        'Check cycles — when do you reach Body position? That\'s your turning-point decade.',
        'Body is your "second act" — don\'t ignore it.',
        'Are you currently living Life or Body?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-learning-path.html', text: 'Reading Methods' },
      { href: 'ziwei-minggong.html', text: 'Life Palace' },
      { href: 'ziwei-shengong.html', text: 'Body Palace' },
      { href: 'ziwei-daxian.html', text: 'Major Cycles' },
      { href: 'ziwei-kanpan-buneng-zhikan-minggong.html', text: 'Don\'t Only Read Life' },
      { href: '../../pages/mingbook-onepage.html', text: 'Quick Chart' }
    ]
  },
  {
    slug: 'ziwei-duigong-jiexing-jiexian',
    cnTitle: '紫微斗数对宫借星的界限：不是所有星都能「借」',
    enTitle: 'The Limits of Borrowing from the Opposite Palace: Not Every Star Can Be Borrowed',
    cnDesc: '空宫借对宫是常用手法，但借星有界限：主星可以借，四化要分情况，煞星辅星不能直接照搬。借完还要回三方四正。',
    enDesc: 'Borrowing stars from the opposite palace for an empty palace is common, but there are limits: main stars can be borrowed, four transformations depend on context, malefics and helpers can\'t simply be copied. After borrowing, return to the triple direction.',
    cnLead: '空宫借对宫，几乎是每个学紫微斗数的人都会的第一招。命宫没主星？把对宫的星借过来用。但很多人借完就完事了，好像对宫的星真的坐在命宫一样。这是错的。借星就像借别人的衣服穿——能穿，但不合身，而且衣服的主人还在穿。对宫的星「借」过来，力量会打折，而且这颗星同时还在影响对宫的事。',
    cnIntro2: '借星的正确理解：空宫不是「没有」，而是「本宫力量弱，需要参考对宫」。借过来的星不是「坐」在本宫，而是「照」过来——就像月光，有光但不是太阳。借星之后必须看三方四正，因为本宫真正的力量来自三方星曜的组合，不只是对宫。',
    cnSections: [
      { h: '什么能借，什么不能借', ps: [
        '主星可以借——对宫的主星是空宫最重要的参考，因为主星决定宫位的「基调」。',
        '四化要分情况——生年四化可以借参考，但宫干四化不能借，因为宫干四化只属于那个宫。',
        '辅星可以参考但不能照搬——左辅右弼、文昌文曲在对宫，对本宫有间接帮助，但力量弱很多。',
        '煞星不能直接搬——擎羊陀罗在对宫，不代表本宫也有擎羊陀罗，它只是「对面有压力」。',
        '空劫不能借——地空地劫在对宫，影响的是对宫的事，本宫只是间接感受到。'
      ]},
      { h: '借星的力量打几折', ps: [
        '对宫主星借过来，力量大约是「坐」在本宫的六成到七成。',
        '如果对宫主星本身落陷，借过来力量更弱，可能只有四成。',
        '如果对宫主星庙旺，借过来力量较强，能到七成。',
        '如果本宫有辅星（昌曲、辅弼、魁钺），借过来的主星力量会增强。',
        '如果本宫有煞星，借过来的主星力量会被削弱。'
      ]},
      { h: '借完之后必须做的事', ps: [
        '回到三方四正——空宫的真正力量来自三方星曜的组合，不只是对宫。',
        '看大限——大限走到空宫时，借星的力量会变化，因为大限会带入新的星曜。',
        '看流年——流年的天干可能在空宫触发四化，这时候空宫就不「空」了。',
        '不要把借星当坐星——借星是「参考」不是「拥有」，对宫的星同时在影响对宫的事。'
      ]},
      { h: '常见错误', ps: [
        '把对宫的煞星也借过来吓自己——对面有擎羊不代表你命宫有刀。',
        '借了主星就不看三方——三方四正才是空宫的「根」。',
        '借了化忌就觉得自己完蛋了——对宫的化忌影响的是对宫的事，本宫只是间接感受。',
        '忽略本宫的辅星和煞星——本宫即使没有主星，辅星和煞星仍然在本宫起作用。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到空宫，按这个顺序读：'], ol: [
        '先确认是空宫——本宫确实没有十四主星。',
        '看对宫有什么主星——借过来当「基调」参考。',
        '看三方四正——这才是空宫真正的力量来源。',
        '看本宫的辅星煞星——它们在本宫直接起作用。',
        '看大限流年——什么时候空宫被填实，什么时候事情发生。',
        '记住：借星是「月光」不是「太阳」——有光但不暖。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-learning-path.html', text: '看盘方法总览' },
      { href: 'ziwei-konggong-xianjieduigong-zaihuisanfang.html', text: '空宫先借对宫再回三方' },
      { href: 'ziwei-minggong-konggong.html', text: '命宫空宫' },
      { href: 'ziwei-sanfang-sizheng-shenme-shihou-bixulai-duigong.html', text: '三方四正' },
      { href: 'ziwei-kanpan-buneng-zhikan-minggong.html', text: '不能只看命宫' },
      { href: '../pages/mingbook-onepage.html', text: '快速排盘' }
    ],
    enLead: 'Borrowing from the opposite palace for an empty palace is the first trick everyone learns. Life has no main star? Borrow the opposite palace\'s star. But many stop there, as if the opposite star truly sits in Life. That\'s wrong. Borrowing a star is like borrowing someone\'s clothes — wearable but ill-fitting, and the owner still wears them. A borrowed star "shines" rather than "sits" — moonlight, not sunlight.',
    enIntro2: 'Correct understanding: an empty palace isn\'t "nothing" — it means "this palace\'s own power is weak, reference the opposite." A borrowed star doesn\'t "sit" in the palace but "illuminates" it. After borrowing, you must check the triple direction, because the palace\'s real power comes from the combination of stars in the triple direction, not just the opposite.',
    enSections: [
      { h: 'What Can Be Borrowed', ps: [
        'Main stars can be borrowed — the opposite main star is the most important reference for an empty palace, setting the "tone."',
        'Four transformations depend — natal transformations can be referenced, but palace-stem transformations cannot; they belong only to that palace.',
        'Auxiliary stars can be referenced but not copied — Zuo Fu/You Bi, Chang/Qu in opposite give indirect help but much weaker.',
        'Malefics can\'t be moved directly — Qing Yang/Tuo Luo opposite don\'t mean they\'re in your palace; it\'s just "pressure across the way."',
        'Kong Jie can\'t be borrowed — Di Kong/Di Jie opposite affect the opposite palace\'s matters; this palace only feels it indirectly.'
      ]},
      { h: 'How Much Power Is Retained', ps: [
        'A borrowed opposite main star retains about 60-70% of its power.',
        'If the opposite star is fallen (落陷), power is weaker — maybe 40%.',
        'If temple/prosperous, stronger — up to 70%.',
        'If this palace has auxiliary stars (Chang/Qu, Fu/Bi, Kui/Yue), the borrowed main star strengthens.',
        'If this palace has malefics, the borrowed star weakens.'
      ]},
      { h: 'What You Must Do After Borrowing', ps: [
        'Return to triple direction — an empty palace\'s real power comes from the triple combination, not just opposite.',
        'Check major cycles — when a cycle passes through the empty palace, borrowed star power changes as new stars enter.',
        'Check annual cycles — annual stems may trigger transformations in the empty palace; then it\'s no longer "empty."',
        'Don\'t treat borrowed as seated — borrowing is "reference," not "ownership"; the star still affects the opposite palace\'s matters.'
      ]},
      { h: 'Common Errors', ps: [
        'Borrowing opposite malefics to scare yourself — Qing Yang across the way doesn\'t mean a blade in your Life.',
        'Borrowing the main star and ignoring triple — triple direction is the "root" of an empty palace.',
        'Borrowing Hua Ji and thinking you\'re doomed — opposite Hua Ji affects opposite matters; you only feel it indirectly.',
        'Ignoring this palace\'s own auxiliaries and malefics — even without a main star, they still act directly here.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see an empty palace:'], ol: [
        'Confirm it\'s empty — no fourteen main stars in this palace.',
        'Check opposite main stars — borrow as "tone" reference.',
        'Check triple direction — this is the real power source.',
        'Check this palace\'s auxiliaries and malefics — they act directly here.',
        'Check cycles — when does the empty palace get filled? That\'s when things happen.',
        'Remember: borrowed stars are "moonlight," not "sunlight" — bright but not warm.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-learning-path.html', text: 'Reading Methods' },
      { href: 'ziwei-konggong-xianjieduigong-zaihuisanfang.html', text: 'Empty Palace Method' },
      { href: 'ziwei-minggong-konggong.html', text: 'Empty Life Palace' },
      { href: 'ziwei-sanfang-sizheng-shenme-shihou-bixulai-duigong.html', text: 'Triple Direction' },
      { href: 'ziwei-kanpan-buneng-zhikan-minggong.html', text: 'Don\'t Only Read Life' },
      { href: '../../pages/mingbook-onepage.html', text: 'Quick Chart' }
    ]
  }
];

function buildHTML(a, isEn) {
  const catPage = 'ziwei-learning-path.html';
  const cnCatName = '看盘方法';
  const enCatName = 'Reading Methods';
  const cnTag = '看盘方法';
  const enTag = 'Methods';
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
  "about": ["Zi Wei Dou Shu", "Reading Methods", "${jstr(title)}"],
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
          <p class="article-meta"><span>${enTag}</span><span><time datetime="${date}">2026-08-20 10:15</time></span></p>
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
  "articleSection": "看盘方法",
  "about": ["紫微斗数", "看盘方法", "${jstr(title)}"],
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
          <p class="article-meta"><span>${cnTag}</span><span><time datetime="${date}">2026-08-20 10:15</time></span></p>
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
