const fs = require('fs');
const path = require('path');
const date = '2026-08-19T10:15:00+08:00';
function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

const articles = [
  {
    slug: 'ziwei-geju-jizhu-maoyou',
    cnTitle: '紫微斗数极居卯酉格：紫微在卯酉，虚名虚利还是修行命',
    enTitle: 'Ji Ju Mao You: Zi Wei in Mao or You — Empty Fame or a Spiritual Path',
    cnDesc: '极居卯酉是紫微在卯宫或酉宫的格局，古人认为「紫微卯酉，虚名虚利」。但这个格局也主精神追求和修行缘分，关键看你怎么选。',
    enDesc: 'Ji Ju Mao You is when Zi Wei sits in Mao or You palace. The ancients called it "empty fame and profit," but it also rules spiritual pursuit — the key is how you choose to live it.',
    cnLead: '极居卯酉是紫微斗数里最「矛盾」的格局之一。紫微是帝星，本该在辰戌丑未这些「正位」上发号施令；落在卯酉，就像皇帝出了京城，到了一个不熟悉的地方。古人说「紫微卯酉，虚名虚利」——你可能有头衔但没实权，有名气但没财富。但这个格局还有另一面：紫微在卯酉的人，精神世界特别丰富，很多人走上了修行、艺术、哲学的路。',
    cnIntro2: '极居卯酉的成格条件：紫微在卯宫或酉宫守命。卯酉是「门户」之位，紫微在这里像「出门在外的皇帝」——有架子但没根基。这个格局跟紫府同宫、紫府朝垣不同：那些格局紫微在「主场」，极居卯酉紫微在「客场」。',
    cnSections: [
      { h: '成格条件', ps: [
        '紫微独守卯宫或酉宫，没有天府同宫。',
        '命宫在卯或酉，紫微守命。',
        '加吉星（辅弼、昌曲、魁钺）能减轻「虚」的成分，让虚名变成实名。',
        '加煞星更虚——可能真的是「面子好看里子空」。'
      ]},
      { h: '极居卯酉的表现', ps: [
        '虚名虚利——有头衔但没实权，有名气但没存款，别人觉得你混得不错，只有你自己知道底子是空的。',
        '精神追求——紫微在卯酉的人对哲学、宗教、艺术有天然兴趣，不太在乎世俗的功名利禄。',
        '适合做「面子」相关的工作——品牌、公关、形象、文化、教育，这些「名」大于「利」的行业。',
        '早年可能怀才不遇——觉得自己有能力但没平台，中年后逐渐找到自己的位置。'
      ]},
      { h: '虚名怎么变成实名', ps: [
        '加左辅右弼——有人帮你把虚名变成实权，你负责形象，别人负责执行。',
        '加文昌文曲——靠才华和学问出名，名气能转化成收入。',
        '加化禄化权——虚名遇到禄权，就能变现。化禄让名气带来钱，化权让头衔有实权。',
        '大限走到紫微庙旺的位置（比如紫府同宫的大限），这十年会明显好转。'
      ]},
      { h: '修行的一面', ps: [
        '极居卯酉加华盖、天巫、阴煞——玄学缘分极深，可能对命理、风水、修行有浓厚兴趣。',
        '这个格局的人如果不走世俗路线，在精神领域可能有很高的造诣。',
        '「虚名虚利」不是坏事——当你不追求实利的时候，反而能在精神上得到更多。',
        '但要防「逃避」——不要用「我不在乎名利」来掩盖自己的不努力。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到极居卯酉，按这个顺序读：'], ol: [
        '先确认紫微在卯还是酉——两个位置的力量略有不同。',
        '看有没有吉星——吉星能把虚名变实名。',
        '看有没有化禄化权——禄权让名气变现。',
        '看有没有华盖天巫——有玄学和修行缘分。',
        '不要被「虚名虚利」吓到——名也是一种资源，关键看你怎么用。',
        '问自己：你追求的「实」是什么？钱、权、还是内心的满足？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-geju-zifu-tonggong.html', text: '紫府同宫格' },
      { href: 'ziwei-geju-junchen-qinghui.html', text: '君臣庆会格' },
      { href: 'ziwei-huagai-xing.html', text: '华盖星' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Ji Ju Mao You is one of the most contradictory patterns. Zi Wei is the emperor star, meant to command from "proper positions" like Chen/Xu/Chou/Wei; in Mao/You it\'s like an emperor away from his capital — bearing but no foundation. The ancients said "Zi Wei in Mao/You, empty fame and profit" — title without power, fame without wealth. But there\'s another side: people with this pattern have rich inner worlds, and many take up spirituality, art, or philosophy.',
    enIntro2: 'Conditions: Zi Wei alone in Mao or You guarding Life. Mao/You are "gateway" positions; Zi Wei here is an "emperor away from home" — bearing without roots. Unlike Zi Fu Tong Gong or Zi Fu Chao Yuan where Zi Wei is on home turf, here Zi Wei is on the road.',
    enSections: [
      { h: 'Conditions', ps: [
        'Zi Wei alone in Mao or You, without Tian Fu sharing the palace.',
        'Life in Mao or You with Zi Wei guarding.',
        'With auspicious stars (Fu/Bi, Chang/Qu, Kui/Yue), the "emptiness" lessens and fame becomes real.',
        'With malefics, it\'s emptier — truly "looks good on the outside, hollow within."'
      ]},
      { h: 'Manifestations', ps: [
        'Empty fame and profit — title without power, reputation without savings; others think you\'re doing well, only you know the foundation is hollow.',
        'Spiritual pursuit — natural interest in philosophy, religion, art; not much driven by worldly success.',
        'Suited to "face"-related work — branding, PR, image, culture, education, fields where name matters more than immediate profit.',
        'May feel unrecognized early on — ability without platform; finding your place after middle age.'
      ]},
      { h: 'Turning Empty Fame Real', ps: [
        'With Zuo Fu/You Bi — people help turn title into real power; you handle image, others handle execution.',
        'With Wen Chang/Wen Qu — fame through talent and scholarship, reputation converts to income.',
        'With Hua Lu/Hua Quan — empty fame meets resources and becomes real. Hua Lu brings money from fame; Hua Quan gives title real power.',
        'Major cycles passing through temple/prosperous Zi Wei positions (like Zi Fu Tong Gong) bring marked improvement.'
      ]},
      { h: 'The Spiritual Side', ps: [
        'With Hua Gai, Tian Wu, or Yin Sha — strong mystic affinity, deep interest in divination, feng shui, practice.',
        'If not taking the worldly path, may achieve highly in spiritual fields.',
        '"Empty fame" isn\'t bad — when you stop chasing material gain, you gain more spiritually.',
        'But guard against escapism — don\'t use "I don\'t care about fame" to mask not trying.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Ji Ju Mao You:'], ol: [
        'Confirm Zi Wei is in Mao or You — slightly different power.',
        'Check auspicious stars — they turn empty fame real.',
        'Check Hua Lu/Hua Quan — they monetize fame.',
        'Check Hua Gai/Tian Wu — mystic and spiritual affinity.',
        'Don\'t be scared by "empty fame" — name is also a resource; it depends how you use it.',
        'What is the "real" you pursue? Money, power, or inner contentment?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-geju-zifu-tonggong.html', text: 'Zi Fu Tong Gong' },
      { href: 'ziwei-geju-junchen-qinghui.html', text: 'Jun Chen Qing Hui' },
      { href: 'ziwei-huagai-xing.html', text: 'Hua Gai Star' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-shizhong-yinyu',
    cnTitle: '紫微斗数石中隐玉格：巨门在子午，口才深藏不露的格局',
    enTitle: 'Shi Zhong Yin Yu: Ju Men in Zi or Wu — Eloquence Hidden Like Jade in Stone',
    cnDesc: '石中隐玉是巨门在子宫或午宫守命的格局，主口才好但深藏不露，中年后大放异彩。但要防巨门的是非和暗性。',
    enDesc: 'Shi Zhong Yin Yu is when Ju Men guards Life in Zi or Wu, ruling eloquence that stays hidden until middle age, then shines. But guard against Ju Men\'s disputes and darkness.',
    cnLead: '石中隐玉是紫微斗数里最「大器晚成」的格局之一。巨门是暗星，主口舌、是非、洞察；在子午两宫，巨门入庙，暗星变成了「藏在石头里的玉」——你年轻时可能不被看好，觉得你话多、挑剔、不合群，但到了中年，你积累的洞察力和表达力会突然爆发，像玉从石头里剖出来一样。',
    cnIntro2: '石中隐玉的成格条件：巨门在子宫或午宫守命。子午是天地之位，巨门在这里入庙，暗星的力量被转化成「深刻的洞察力」。这个格局跟巨门在其他宫位不同：在其他位置巨门是「暗」，在子午巨门是「隐」——不是没有光，而是光被包在里面，等时机到了才亮。',
    cnSections: [
      { h: '成格条件', ps: [
        '巨门在子宫或午宫守命。',
        '命宫在子或午，巨门独守或与吉星同宫。',
        '加化禄——巨门化禄口才生财，是最好的配置。',
        '加化权——说话有分量，适合做律师或管理者。',
        '加煞星——石中玉可能被石头压得更紧，需要更长时间才能「剖出来」。'
      ]},
      { h: '石中隐玉的性格', ps: [
        '洞察力强——你能看到别人看不到的问题，说话一针见血。',
        '年轻时不被理解——你的深刻在别人看来是「挑剔」或「不合群」。',
        '中年后爆发——积累的经验和口才在中年后变成核心竞争力。',
        '口才好但不爱说废话——你要么不说，一说就说到点子上。'
      ]},
      { h: '适合的职业', ps: [
        '律师、法官——巨门的口才加洞察力，适合在法庭上辩论。',
        '评论家、分析师——你的深刻见解适合做评论和分析。',
        '教师、培训师——中年后你特别适合把经验传授给别人。',
        '侦探、调查员——巨门的「暗」性让你擅长发现隐藏的真相。',
        '不适合做需要「热闹」的工作——你不是社交型的人，你是深度型的人。'
      ]},
      { h: '石中隐玉的陷阱', ps: [
        '太尖锐——你的一针见血可能伤到别人，要学会「真话不全说」。',
        '多疑——巨门的暗性让你容易怀疑别人，影响人际关系。',
        '早年压抑——年轻时不被认可可能让你自卑或愤世嫉俗。',
        '口舌是非——巨门终究是口舌星，即使入庙也要防说话得罪人。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到石中隐玉，按这个顺序读：'], ol: [
        '先确认巨门在子还是午——两个位置都是庙旺。',
        '看有没有化禄化权——禄权让口才变现、说话有分量。',
        '看有没有文昌文曲——昌曲让表达更有文采。',
        '看有没有煞星——煞星增加是非和压抑感。',
        '石中隐玉的人不要急——你是大器晚成的类型，中年后才是你的主场。',
        '问自己：你的「尖锐」是「洞察力」还是「刻薄」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-jumen-zuoming.html', text: '巨门坐命' },
      { href: 'ziwei-geju-juri-tonggong.html', text: '巨日同宫格' },
      { href: 'ziwei-geju-yongxing-rumiao.html', text: '英星入庙格' },
      { href: 'ziwei-wenchang-wenqu.html', text: '文昌文曲' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Shi Zhong Yin Yu is one of the most "late bloomer" patterns. Ju Men is the dark star — speech, disputes, insight; in Zi/Wu it enters temple, and the dark star becomes "jade hidden in stone." When young you may be underestimated — seen as talkative, critical, aloof — but by middle age, your accumulated insight and eloquence suddenly erupt, like jade cut from stone.',
    enIntro2: 'Conditions: Ju Men guarding Life in Zi or Wu. Zi/Wu are the positions of heaven and earth; Ju Men enters temple here, its darkness transformed into "deep insight." Unlike Ju Men in other positions where it\'s "dark," here it\'s "hidden" — not without light, but wrapped inside, waiting for the right moment.',
    enSections: [
      { h: 'Conditions', ps: [
        'Ju Men guarding Life in Zi or Wu.',
        'Life in Zi/Wu with Ju Men alone or with auspicious stars.',
        'With Hua Lu — Ju Men Hua Lu turns eloquence into income, the best setup.',
        'With Hua Quan — words carry weight, suited to law or management.',
        'With malefics — the jade may be pressed tighter in the stone, taking longer to cut free.'
      ]},
      { h: 'Personality', ps: [
        'Strong insight — sees what others miss, speaks to the point.',
        'Misunderstood when young — your depth looks like "pickiness" or "aloofness" to others.',
        'Midlife eruption — accumulated experience and eloquence become core competence after middle age.',
        'Eloquent but doesn\'t waste words — either silent or spot-on.'
      ]},
      { h: 'Suitable Careers', ps: [
        'Lawyer, judge — Ju Men\'s eloquence plus insight, suited to courtroom debate.',
        'Critic, analyst — deep insights suit commentary and analysis.',
        'Teacher, trainer — after middle age, especially good at passing on experience.',
        'Detective, investigator — Ju Men\'s darkness makes you good at finding hidden truth.',
        'Not suited to "bustling" work — you\'re a depth person, not a social person.'
      ]},
      { h: 'The Trap', ps: [
        'Too sharp — your spot-on words may hurt others; learn "don\'t say everything true."',
        'Suspicious — Ju Men\'s darkness makes you doubt others, straining relationships.',
        'Early suppression — not being recognized young may lead to insecurity or cynicism.',
        'Disputes — Ju Men is still a speech star; even in temple, guard against offending people.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Shi Zhong Yin Yu:'], ol: [
        'Confirm Ju Men in Zi or Wu — both are temple/prosperous.',
        'Check Hua Lu/Hua Quan — they monetize eloquence and give words weight.',
        'Check Chang/Qu — they add literary quality to expression.',
        'Check malefics — they increase disputes and suppression.',
        'Don\'t rush — you\'re a late bloomer; middle age is your arena.',
        'Is your "sharpness" insight or cruelty?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-jumen-zuoming.html', text: 'Ju Men in Life' },
      { href: 'ziwei-geju-juri-tonggong.html', text: 'Ju Ri Tong Gong' },
      { href: 'ziwei-geju-yongxing-rumiao.html', text: 'Yong Xing Ru Miao' },
      { href: 'ziwei-wenchang-wenqu.html', text: 'Wen Chang & Wen Qu' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-yongxing-rumiao',
    cnTitle: '紫微斗数英星入庙格：破军在子午，破而后立的大将格局',
    enTitle: 'Yong Xing Ru Miao: Po Jun in Zi or Wu — The General Who Breaks Then Builds',
    cnDesc: '英星入庙是破军在子宫或午宫守命的格局，主开创性强、能破能立。破军入庙时破坏力被转化为建设力，是大器晚成的格局。',
    enDesc: 'Yong Xing Ru Miao is when Po Jun guards Life in Zi or Wu, ruling strong pioneering and the ability to break and build. In temple, Po Jun\'s destructiveness becomes constructive — a late-blooming general.',
    cnLead: '英星入庙是紫微斗数里最「能打」的格局之一。破军是耗星，主破坏和变革；但在子午两宫入庙后，破军的「破」变成了「破旧立新」——你不是为了破坏而破坏，你是为了建新的才拆旧的。命宫有英星入庙的人，年轻时可能折腾不断、失败多次，但到了中年，你积累的「破」的经验会变成「立」的能力。',
    cnIntro2: '英星入庙的成格条件：破军在子宫或午宫守命。子午是帝王之位，破军在这里入庙，「耗星」变成了「英星」——像一个能征善战的将军，年轻时打仗，中年后封地。这个格局跟破军在其他宫位不同：在其他位置破军是「乱破」，在子午破军是「有方向的破」。',
    cnSections: [
      { h: '成格条件', ps: [
        '破军在子宫或午宫守命。',
        '命宫在子或午，破军独守或与吉星同宫。',
        '加化禄——破军化禄，破旧之后能得到回报。',
        '加化权——破军化权，破坏力变成执行力。',
        '加煞星——入庙的破军不怕煞星，但煞星会增加早年的辛苦。'
      ]},
      { h: '英星入庙的性格', ps: [
        '开创性强——你不喜欢守成，喜欢做别人没做过的事。',
        '能破能立——拆旧房子的能力和建新房的能力你都有。',
        '早年折腾——年轻时换工作、换行业、换城市，什么都试过。',
        '中年成事——折腾够了，经验有了，中年后能做成大事。'
      ]},
      { h: '适合的职业', ps: [
        '创业者——破军的开创性适合从零开始。',
        '改革者——在大机构里推动变革，打破旧制度。',
        '军人、警察、外科医生——需要「果断出手」的职业。',
        '工程、建筑——拆旧建新，破军的破坏力用在正途。',
        '不适合做一成不变的工作——你会憋死。'
      ]},
      { h: '英星入庙的陷阱', ps: [
        '为破而破——有时候你拆了旧的，但没想好新的怎么建，结果一片废墟。',
        '太折腾——早年换太多方向，可能什么都做不精。',
        '人际关系——破军的人太直接，容易得罪人，要学会沟通。',
        '大起大落——破军的人生波动大，要学会在低谷时积蓄力量。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到英星入庙，按这个顺序读：'], ol: [
        '先确认破军在子还是午——两个位置都是入庙。',
        '看有没有化禄化权——禄权让破坏有回报、有方向。',
        '看有没有左辅右弼——有人帮你「立」，不会破了之后没人收拾。',
        '看有没有煞星——煞星增加早年辛苦但不影响最终成就。',
        '英星入庙的人要学会「先想清楚再动手」——破是手段，立是目的。',
        '问自己：你的「折腾」是在「积累经验」还是「逃避坚持」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-pojun-zuoming.html', text: '破军坐命' },
      { href: 'ziwei-geju-ziwei-pojun.html', text: '紫微破军格' },
      { href: 'ziwei-geju-shapol.html', text: '杀破狼格' },
      { href: 'ziwei-geju-shizhong-yinyu.html', text: '石中隐玉格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Yong Xing Ru Miao is one of the most capable patterns. Po Jun is the耗 star — destruction and change; but in Zi/Wu at temple, its "breaking" becomes "breaking the old to build the new" — you don\'t destroy for destruction\'s sake, you demolish to build. People with this pattern折腾 constantly and fail repeatedly when young, but by middle age, your accumulated "breaking" experience becomes "building" ability.',
    enIntro2: 'Conditions: Po Jun guarding Life in Zi or Wu. Zi/Wu are imperial positions; Po Jun enters temple and the "耗 star" becomes the "hero star" — like a battle-tested general who fights young and receives fiefdom at middle age. Unlike Po Jun elsewhere (random destruction), here it\'s "directed breaking."',
    enSections: [
      { h: 'Conditions', ps: [
        'Po Jun guarding Life in Zi or Wu.',
        'Life in Zi/Wu with Po Jun alone or with auspicious stars.',
        'With Hua Lu — after breaking the old, you get rewarded.',
        'With Hua Quan — destructiveness becomes execution power.',
        'With malefics — temple Po Jun doesn\'t fear them, but they increase early hardship.'
      ]},
      { h: 'Personality', ps: [
        'Strong pioneering spirit — dislikes maintaining the status quo, likes doing what no one has done.',
        'Can break and build — both demolish the old and construct the new.',
        'Restless youth — changing jobs, industries, cities, trying everything.',
        'Middle-age achievement — after enough折腾 and experience, big things happen.'
      ]},
      { h: 'Suitable Careers', ps: [
        'Entrepreneur — Po Jun\'s pioneering suits starting from zero.',
        'Reformer — driving change in large institutions, breaking old systems.',
        'Military, police, surgeon — professions requiring decisive action.',
        'Engineering, construction — demolish and build, Po Jun\'s destructiveness used well.',
        'Not suited to routine work — you\'d suffocate.'
      ]},
      { h: 'The Trap', ps: [
        'Breaking for breaking\'s sake — sometimes you demolish without planning the new, leaving rubble.',
        'Too restless — changing directions too often young may mean mastering nothing.',
        'Relationships — too direct, easily offends; learn communication.',
        'Big ups and downs — life volatility is high; learn to accumulate strength in low points.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Yong Xing Ru Miao:'], ol: [
        'Confirm Po Jun in Zi or Wu — both are temple.',
        'Check Hua Lu/Hua Quan — they give breaking direction and reward.',
        'Check Zuo Fu/You Bi — people help you "build," so you don\'t leave rubble.',
        'Check malefics — they increase early hardship but not final achievement.',
        'Learn to "think clearly before acting" — breaking is the means, building is the goal.',
        'Is your "restlessness" accumulating experience or escaping persistence?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-pojun-zuoming.html', text: 'Po Jun in Life' },
      { href: 'ziwei-geju-ziwei-pojun.html', text: 'Zi Wei & Po Jun' },
      { href: 'ziwei-geju-shapol.html', text: 'Sha Po Lang' },
      { href: 'ziwei-geju-shizhong-yinyu.html', text: 'Shi Zhong Yin Yu' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-matou-daijian',
    cnTitle: '紫微斗数马头带箭格：七杀在午加擎羊，刚猛到极致的武将格局',
    enTitle: 'Ma Tou Dai Jian: Qi Sha in Wu with Qing Yang — The Ultimate Warrior Pattern',
    cnDesc: '马头带箭是七杀在午宫守命且擎羊同宫的格局，主刚猛、决断、武职荣身。但刚则易折，要防意外和刑伤。',
    enDesc: 'Ma Tou Dai Jian is when Qi Sha guards Life in Wu with Qing Yang in the same palace, ruling fierceness, decisiveness, and military distinction. But the overly rigid break easily — guard against accidents and injury.',
    cnLead: '马头带箭是紫微斗数里最「刚」的格局，没有之一。七杀是将星，擎羊是刑星，两颗星在午宫（火位）碰在一起，就像一个骑在马上、箭在弦上的将军——杀气冲天。命宫有马头带箭的人，性格刚烈、决断力极强，适合做军人、警察、外科医生等需要「快准狠」的职业。但这个格局最大的问题是「过刚易折」——你太硬了，硬到容易断。',
    cnIntro2: '马头带箭的成格条件：七杀在午宫守命，且擎羊同宫。午宫属火，七杀属金，擎羊属金，火克金但金在火位反而被锻炼成「利器」。这个格局跟七杀在其他宫位不同：在其他位置七杀是「将」，在午加擎羊七杀是「箭在弦上的将」——随时准备出手。',
    cnSections: [
      { h: '成格条件', ps: [
        '七杀在午宫守命。',
        '擎羊与七杀同宫——「箭」必须在「马头」上。',
        '加吉星（辅弼、昌曲、魁钺）能化解部分刚气，让你有勇有谋。',
        '加其他煞星（陀罗、火铃、空劫）——过刚，容易出意外或刑伤。'
      ]},
      { h: '马头带箭的性格', ps: [
        '刚烈——性格直、脾气大、不喜欢拐弯抹角。',
        '决断力极强——关键时刻能在一秒钟内做决定，而且不后悔。',
        '讲义气——对朋友和下属特别好，愿意为自己人出头。',
        '不服输——越难的事越要做，越有人反对越要证明自己。'
      ]},
      { h: '适合的职业', ps: [
        '军人、警察——七杀加擎羊，天生的战士。',
        '外科医生——需要「下刀快准狠」的职业。',
        '运动员、教练——竞争性强、需要爆发力。',
        '创业者——在竞争激烈的行业里杀出一条血路。',
        '不适合做需要耐心和妥协的工作——你受不了拖泥带水。'
      ]},
      { h: '马头带箭的陷阱', ps: [
        '过刚易折——太硬了容易断，可能在最巅峰时出意外。',
        '刑伤——擎羊主刑伤，要防手术、外伤、官司。',
        '人际关系——太直接太刚烈，容易得罪人，朋友多敌人也多。',
        '冲动——决断力强是优点，但有时候决定太快，来不及想后果。'
      ]},
      { h: '怎么化解过刚', ps: [
        '学柔——练太极、瑜伽、冥想，或者做一些需要耐心的事（钓鱼、园艺）。',
        '听劝——马头带箭的人最需要一个能劝住你的人，找到你的「刹车」。',
        '注意安全——危险的运动不要做，开车不要超速，定期体检。',
        '把刚用在对的地方——对事刚，对人柔；对外刚，对内柔。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到马头带箭，按这个顺序读：'], ol: [
        '先确认七杀在午且擎羊同宫——两个条件缺一不可。',
        '看有没有吉星——吉星让你有勇有谋。',
        '看有没有其他煞星——煞星太多容易过刚出事。',
        '看大限——走到金旺或火旺的大限时要特别注意安全。',
        '马头带箭的人要记住：刚是你的武器，但不是你的全部。',
        '问自己：你的「刚」是在保护你，还是在伤害你？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-qisha-zuoming.html', text: '七杀坐命' },
      { href: 'ziwei-qingyang-tuoluo.html', text: '擎羊陀罗' },
      { href: 'ziwei-geju-lianqi-qisha.html', text: '廉贞七杀格' },
      { href: 'ziwei-geju-yongxing-rumiao.html', text: '英星入庙格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Ma Tou Dai Jian is the fiercest pattern, bar none. Qi Sha is the general star, Qing Yang is the punishment star; together in Wu (fire position), they\'re like a general on horseback with arrow nocked — killing aura sky-high. People with it are tough, decisive, suited to military, police, surgery — anything requiring "fast, precise, ruthless." But the biggest problem: the overly rigid break easily — you\'re so hard you snap.',
    enIntro2: 'Conditions: Qi Sha guarding Life in Wu, with Qing Yang in the same palace. Wu is fire; Qi Sha and Qing Yang are metal; fire tempers metal into a "weapon." Unlike Qi Sha elsewhere (a general), here it\'s "a general with arrow nocked" — always ready to strike.',
    enSections: [
      { h: 'Conditions', ps: [
        'Qi Sha guarding Life in Wu.',
        'Qing Yang sharing the palace — the "arrow" must be on the "horse head."',
        'With auspicious stars (Fu/Bi, Chang/Qu, Kui/Yue), some fierceness is softened — brave and strategic.',
        'With other malefics (Tuo Luo, Huo Ling, Kong Jie) — too rigid, prone to accidents or injury.'
      ]},
      { h: 'Personality', ps: [
        'Tough — direct, hot-tempered, hates beating around the bush.',
        'Extreme decisiveness — can decide in a second at critical moments, no regrets.',
        'Loyal — great to friends and subordinates, willing to fight for your people.',
        'Hates losing — the harder something is, the more you want to do it; opposition makes you more determined.'
      ]},
      { h: 'Suitable Careers', ps: [
        'Military, police — Qi Sha plus Qing Yang, born warrior.',
        'Surgeon — needs "fast, precise, ruthless" cutting.',
        'Athlete, coach — competitive, needs explosiveness.',
        'Entrepreneur — fighting through in competitive industries.',
        'Not suited to work requiring patience and compromise — can\'t stand dragging feet.'
      ]},
      { h: 'The Trap', ps: [
        'Over-rigid breaks easily — may have accidents at your peak.',
        'Injury — Qing Yang rules injury; guard against surgery, trauma, lawsuits.',
        'Relationships — too direct and tough, offends easily; many friends but many enemies.',
        'Impulsive — decisiveness is good, but sometimes deciding too fast means not considering consequences.'
      ]},
      { h: 'Softening the Rigidity', ps: [
        'Learn softness — tai chi, yoga, meditation, or patience-requiring activities (fishing, gardening).',
        'Listen to advice — you need someone who can stop you; find your "brake."',
        'Safety first — avoid dangerous sports, don\'t speed, get regular checkups.',
        'Use toughness in the right place — tough on issues, soft on people; tough outside, soft inside.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Ma Tou Dai Jian:'], ol: [
        'Confirm Qi Sha in Wu with Qing Yang — both conditions required.',
        'Check auspicious stars — they make you brave and strategic.',
        'Check other malefics — too many mean accidents from over-rigidity.',
        'Check cycles — be extra careful in metal/fire major cycles.',
        'Remember: toughness is your weapon, but not all of you.',
        'Is your "toughness" protecting you or hurting you?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-qisha-zuoming.html', text: 'Qi Sha in Life' },
      { href: 'ziwei-qingyang-tuoluo.html', text: 'Qing Yang & Tuo Luo' },
      { href: 'ziwei-geju-lianqi-qisha.html', text: 'Lian Zhen & Qi Sha' },
      { href: 'ziwei-geju-yongxing-rumiao.html', text: 'Yong Xing Ru Miao' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-fanshui-taohua',
    cnTitle: '紫微斗数泛水桃花格：贪狼在子，桃花泛滥但也才艺出众',
    enTitle: 'Fan Shui Tao Hua: Tan Lang in Zi — Overflowing Romance but Also Outstanding Talent',
    cnDesc: '泛水桃花是贪狼在子宫守命的格局，主桃花旺、多才多艺、感情丰富。但桃花太旺也容易感情纠葛，需要学会收放。',
    enDesc: 'Fan Shui Tao Hua is when Tan Lang guards Life in Zi, ruling strong romance, versatility, and rich emotions. But too much romance brings entanglement — learn to manage it.',
    cnLead: '泛水桃花是紫微斗数里最「浪漫」的格局之一。贪狼是欲望星和桃花星，在子宫（水位）桃花像水一样泛滥——你魅力大、异性缘好、多才多艺、感情丰富。命宫有泛水桃花的人，一生不缺追求者，也不缺故事。但桃花太多不一定是好事——你可能在感情中兜兜转转，不知道自己真正想要什么。',
    cnIntro2: '泛水桃花的成格条件：贪狼在子宫守命。子宫属水，贪狼属木（一说属水），木在水中漂流，桃花像水一样四处流淌。这个格局跟贪狼在其他宫位不同：在其他位置贪狼的欲望是「多方向」的（钱、权、色都要），在子宫贪狼的欲望集中在「情」和「艺」上。',
    cnSections: [
      { h: '成格条件', ps: [
        '贪狼在子宫守命。',
        '命宫在子，贪狼独守或与吉星同宫。',
        '加文昌文曲——才艺出众，桃花加文采，魅力最大。',
        '加化禄——桃花带来财运，可能靠魅力或才艺赚钱。',
        '加煞星——桃花变成桃花劫，感情纠纷多。'
      ]},
      { h: '泛水桃花的性格', ps: [
        '魅力大——天生有一种吸引力，不用刻意打扮就有人追。',
        '多才多艺——对音乐、艺术、文学、表演有天赋。',
        '感情丰富——你很容易爱上一个人，也很容易不爱了。',
        '浪漫——你追求的不是安稳，而是心动的感觉。'
      ]},
      { h: '适合的职业', ps: [
        '演艺、音乐、艺术——贪狼的才艺加桃花，适合在舞台上发光。',
        '公关、销售——魅力和社交能力是你的核心竞争力。',
        '美业、时尚——对美有天然的鉴赏力。',
        '写作、内容创作——感情丰富的人通常有故事可讲。',
        '不适合做枯燥、重复、不跟人打交道的工作。'
      ]},
      { h: '泛水桃花的陷阱', ps: [
        '感情纠葛——追求者太多，选择困难，或者陷入多角关系。',
        '婚姻不稳——贪狼的人害怕束缚，可能晚婚或婚姻多波折。',
        '耽于享乐——贪狼主欲望，泛水桃花的人可能沉迷酒色或玩乐。',
        '桃花劫——加煞星时，桃花变成麻烦，可能因色破财或因情惹祸。'
      ]},
      { h: '怎么管理桃花', ps: [
        '学会选择——不是所有追求者都适合你，找一个能跟你精神共鸣的人。',
        '把魅力用在事业上——桃花不只用在感情上，用在社交和事业上同样有效。',
        '给自己设底线——知道什么能做什么不能做，不要被欲望牵着走。',
        '晚婚可能更好——等你玩够了、想清楚了，婚姻反而更稳定。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到泛水桃花，按这个顺序读：'], ol: [
        '先确认贪狼在子——这是成格的基本条件。',
        '看有没有文昌文曲——才艺加文采，魅力最大。',
        '看有没有化禄——桃花能变现。',
        '看有没有煞星——煞星把桃花变成桃花劫。',
        '泛水桃花的人要学会「收」——魅力是天赋，但管理魅力是能力。',
        '问自己：你的「浪漫」是「在体验人生」还是「在逃避承诺」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-tanlang-zuoming.html', text: '贪狼坐命' },
      { href: 'ziwei-hongluan-tianxi.html', text: '红鸾天喜' },
      { href: 'ziwei-xianchi-tianyao.html', text: '咸池天姚' },
      { href: 'ziwei-geju-wutan.html', text: '武贪格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Fan Shui Tao Hua is one of the most romantic patterns. Tan Lang is the desire and romance star; in Zi (water position), romance overflows like water — great charm, strong appeal, versatile, emotionally rich. People with it never lack suitors or stories. But too much romance isn\'t necessarily good — you may circle through relationships not knowing what you truly want.',
    enIntro2: 'Conditions: Tan Lang guarding Life in Zi. Zi is water; Tan Lang is wood (some say water); wood drifting on water, romance flowing everywhere. Unlike Tan Lang elsewhere (desire spread across money, power, and sex), in Zi desire concentrates on "emotion" and "art."',
    enSections: [
      { h: 'Conditions', ps: [
        'Tan Lang guarding Life in Zi.',
        'Life in Zi with Tan Lang alone or with auspicious stars.',
        'With Wen Chang/Wen Qu — outstanding talent, romance plus literary grace, maximum charm.',
        'With Hua Lu — romance brings wealth, may earn through charm or talent.',
        'With malefics — romance becomes romantic disaster, many emotional disputes.'
      ]},
      { h: 'Personality', ps: [
        'Great charm — natural attraction, suitors without trying.',
        'Versatile — gifted in music, art, literature, performance.',
        'Emotionally rich — fall in love easily, fall out just as easily.',
        'Romantic — you don\'t seek stability, you seek the feeling of heartbeats.'
      ]},
      { h: 'Suitable Careers', ps: [
        'Entertainment, music, art — Tan Lang\'s talent plus romance, shines on stage.',
        'PR, sales — charm and social ability are core competencies.',
        'Beauty industry, fashion — natural eye for beauty.',
        'Writing, content creation — emotionally rich people have stories to tell.',
        'Not suited to boring, repetitive, isolated work.'
      ]},
      { h: 'The Trap', ps: [
        'Romantic entanglement — too many suitors, choice paralysis, or love triangles.',
        'Unstable marriage — fears commitment, may marry late or have rocky marriages.',
        'Indulgence — Tan Lang rules desire; may沉迷 in drink, sex, or pleasure.',
        'Romantic disaster — with malefics, romance becomes trouble, losing money or causing problems through love.'
      ]},
      { h: 'Managing Romance', ps: [
        'Learn to choose — not every suiter fits; find someone who resonates spiritually.',
        'Use charm in career — romance isn\'t only for relationships; it works in networking and business.',
        'Set boundaries — know what you won\'t do, don\'t be led by desire.',
        'Marrying later may be better — once you\'ve experienced enough and know your mind, marriage is more stable.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Fan Shui Tao Hua:'], ol: [
        'Confirm Tan Lang in Zi — the basic condition.',
        'Check Chang/Qu — talent plus literary grace, maximum charm.',
        'Check Hua Lu — romance can monetize.',
        'Check malefics — they turn romance into disaster.',
        'Learn to "收" — charm is a gift, but managing it is skill.',
        'Is your "romanticism" experiencing life or escaping commitment?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-tanlang-zuoming.html', text: 'Tan Lang in Life' },
      { href: 'ziwei-hongluan-tianxi.html', text: 'Hong Luan & Tian Xi' },
      { href: 'ziwei-xianchi-tianyao.html', text: 'Xian Chi & Tian Yao' },
      { href: 'ziwei-geju-wutan.html', text: 'Wu Tan Pattern' },
      { href: 'ziwei-learning-path.html', text: 'Reading Basics' }
    ]
  },
  {
    slug: 'ziwei-geju-zifu-chaoyuan',
    cnTitle: '紫微斗数紫府朝垣格：紫微在命天府来朝，有主位也有资源的格局',
    enTitle: 'Zi Fu Chao Yuan: Zi Wei in Life with Tian Fu Facing — Position and Resources',
    cnDesc: '紫府朝垣是紫微在命宫、天府在三方来朝的格局，主地位高、资源足、领导力强。跟紫府同宫不同，朝垣的两颗星各在其位，配合更灵活。',
    enDesc: 'Zi Fu Chao Yuan is when Zi Wei is in Life and Tian Fu faces from the triple direction, ruling high status, resources, and leadership. Unlike Tong Gong, the two stars each hold their own position, making the combination more flexible.',
    cnLead: '紫府朝垣是紫微斗数里最「有帝王相」的格局之一。紫微在命宫是皇帝坐在龙椅上，天府从三方来朝是各地的钱粮运到京城——你既有地位又有资源。跟紫府同宫不同，同宫是皇帝和财库挤在一起，朝垣是皇帝在朝堂、财库在地方，各安其位、互相配合。命宫有紫府朝垣的人，领导力和资源调动能力都是一流的。',
    cnIntro2: '紫府朝垣的成格条件：紫微在命宫，天府在三方四正来朝。紫府同宫只在寅申，紫府朝垣可以出现在更多宫位——只要紫微在命、天府在三方即可。朝垣比同宫更灵活，因为两颗星不挤在一起，各自发挥作用。',
    cnSections: [
      { h: '成格条件', ps: [
        '紫微在命宫——帝星在主位。',
        '天府在三方四正来朝——财库星从侧面支持。',
        '加左辅右弼、文昌文曲、天魁天钺——文武百官齐全，格局最完整。',
        '加煞星——资源调动受阻，或者有人从中作梗。'
      ]},
      { h: '紫府朝垣的优势', ps: [
        '地位和资源兼具——紫微给你地位，天府给你资源，两者配合是最强的组合之一。',
        '领导力强——你不仅能发号施令，还能调动钱粮，这种人最容易成大事。',
        '比同宫灵活——两颗星各在其位，不会互相掣肘。',
        '适合做「一把手」——你既有决策权又有资源分配权。'
      ]},
      { h: '朝垣和同宫的区别', ps: [
        '紫府同宫——两颗星挤在一起，力量集中但可能「刚愎自用」，因为皇帝和财库是同一个人，没人制衡。',
        '紫府朝垣——两颗星各在其位，紫微主决策，天府主执行和供给，分工明确。',
        '同宫的人更自我，朝垣的人更会用人——因为天府在三方代表「别人帮你管钱」，你需要信任团队。',
        '同宫适合独立创业，朝垣适合带团队或在大机构发展。'
      ]},
      { h: '在十二宫的含义', ps: [
        '命宫：领导力最强、有地位有资源、适合做一把手。',
        '官禄宫：事业上有决策权和资源调配权、适合做高管。',
        '财帛宫：财运好、能调动大笔资金、适合做金融或投资。',
        '迁移宫：在外有地位、适合去大平台或外地发展。',
        '田宅宫：家境好、有房产、家庭资源丰富。'
      ]},
      { h: '排盘后的使用顺序', ps: ['看到紫府朝垣，按这个顺序读：'], ol: [
        '先确认紫微在命宫、天府在三方——两个条件缺一不可。',
        '看天府在哪个宫——天府在财帛宫主财，在官禄宫主事业，在迁移宫主在外发展。',
        '看有没有辅弼昌曲魁钺——百官齐全格局最完整。',
        '看有没有煞星——煞星让资源调动受阻。',
        '紫府朝垣的人要学会「信任团队」——资源在别人手里，你要会用人。',
        '问自己：你是在「调动资源做大事」还是「占着位子不会用」？'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-case-patterns.html', text: '格局命例总览' },
      { href: 'ziwei-geju-zifu-tonggong.html', text: '紫府同宫格' },
      { href: 'ziwei-ziwei-zuoming.html', text: '紫微坐命' },
      { href: 'ziwei-tianfu-zuoming.html', text: '天府坐命' },
      { href: 'ziwei-geju-junchen-qinghui.html', text: '君臣庆会格' },
      { href: 'ziwei-learning-path.html', text: '看盘入门' }
    ],
    enLead: 'Zi Fu Chao Yuan is one of the most "imperial" patterns. Zi Wei in Life is the emperor on the throne; Tian Fu facing from the triple direction is grain and treasure flowing to the capital — you have both status and resources. Unlike Zi Fu Tong Gong where emperor and treasury are squeezed together, here the emperor is at court and the treasury is in the regions, each in place, cooperating. People with it have first-rate leadership and resource-mobilization ability.',
    enIntro2: 'Conditions: Zi Wei in Life, Tian Fu in the triple direction. Tong Gong only occurs in Yin/Shen; Chao Yuan can occur in more positions — as long as Zi Wei is in Life and Tian Fu is in triple. Chao Yuan is more flexible because the two stars aren\'t crowded together.',
    enSections: [
      { h: 'Conditions', ps: [
        'Zi Wei in Life — the emperor on the throne.',
        'Tian Fu facing from triple direction — the treasury supporting from the side.',
        'With Zuo Fu/You Bi, Chang/Qu, Kui/Yue — full court of officials, most complete pattern.',
        'With malefics — resource mobilization blocked, or someone obstructing.'
      ]},
      { h: 'Advantages', ps: [
        'Status plus resources — Zi Wei gives position, Tian Fu gives resources; one of the strongest combinations.',
        'Strong leadership — you can both command and mobilize supplies; most likely to achieve big things.',
        'More flexible than Tong Gong — two stars in separate positions, not constraining each other.',
        'Suited to being "number one" — you have both decision power and resource allocation.'
      ]},
      { h: 'Chao Yuan vs Tong Gong', ps: [
        'Tong Gong — two stars crowded together, concentrated power but may be "dictatorial" because emperor and treasury are one person with no checks.',
        'Chao Yuan — two stars in separate positions; Zi Wei decides, Tian Fu executes and supplies, clear division of labor.',
        'Tong Gong people are more self-reliant; Chao Yuan people are better at using others — Tian Fu in triple means "someone else manages the money," requiring trust in the team.',
        'Tong Gong suits independent entrepreneurship; Chao Yuan suits leading teams or large organizations.'
      ]},
      { h: 'Across the Twelve Palaces', ps: [
        'Life: strongest leadership, status and resources, suited to being number one.',
        'Career: decision power and resource allocation at work, suited to executive roles.',
        'Wealth: good finances, can mobilize large sums, suited to finance or investment.',
        'Travel: status away from home, suited to big platforms or developing elsewhere.',
        'Property: good family background, real estate, rich family resources.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Zi Fu Chao Yuan:'], ol: [
        'Confirm Zi Wei in Life and Tian Fu in triple — both required.',
        'Which palace is Tian Fu in — Wealth = money, Career = work, Travel = development away.',
        'Check Fu/Bi/Chang/Qu/Kui/Yue — full court makes the pattern complete.',
        'Check malefics — they block resource mobilization.',
        'Learn to "trust the team" — resources are in others\' hands; you must use people well.',
        'Are you "mobilizing resources for big things" or "holding a position you can\'t use"?'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-case-patterns.html', text: 'Patterns Overview' },
      { href: 'ziwei-geju-zifu-tonggong.html', text: 'Zi Fu Tong Gong' },
      { href: 'ziwei-ziwei-zuoming.html', text: 'Zi Wei in Life' },
      { href: 'ziwei-tianfu-zuoming.html', text: 'Tian Fu in Life' },
      { href: 'ziwei-geju-junchen-qinghui.html', text: 'Jun Chen Qing Hui' },
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
