const fs = require('fs');
const path = require('path');

const date = '2026-08-12T10:45:00+08:00';
const pubDate = 'Wed, 12 Aug 2026 02:45:00 +0000';

function jstr(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n'); }

const articles = [
  {
    slug: 'ziwei-guanlugong-huaquan',
    cnTitle: '紫微斗数官禄宫化权：事业上有权力，是掌权还是扛责',
    enTitle: 'Career Palace With Hua Quan: Authority or Burden?',
    cnDesc: '官禄宫化权，事业上有权力、有位置。但权和责是一体两面——你说了算是掌权，什么都找你是扛责。区别在有没有禄来配、有没有人来帮。',
    enDesc: 'Hua Quan in the Career Palace brings authority and position. But power and responsibility are two sides — calling the shots is authority; everything landing on you is burden. Check for Lu and assistants.',
    cnLead: '官禄宫化权的人，事业上通常有存在感——能管事儿、能拍板、别人搞不定的你能搞定。但化权在官禄宫有两种活法：一种是真掌权——有职位、有资源、说了有人听；另一种是假掌权——头衔好听、责任很大、但资源不够、什么都得自己来。区别不在化权本身，在有没有化禄或禄存来配，有没有左右昌曲来帮。',
    cnIntro2: '化权是掌控星，落在官禄宫，事业心和执行力都强。这种人不甘于人下，做事有魄力，适合管理岗。但权这个东西，有权无利是苦差，有权无帮是孤臣。这篇讲官禄宫化权怎么读。',
    cnSections: [
      { h: '有权有利：化权加禄是真掌权', ps: [
        '官禄宫化权，三方四正见化禄或禄存，是「权禄双全」。这种人事业上既有权力又有利益——管的事有预算、有油水，做的决定能换来实际回报。不是空有头衔的岗位，而是有实权的位置。',
        '举个确定的组合：官禄宫武曲化权，财帛宫见禄存。武曲是财星，化权在官禄主管理财务或掌握资源，禄存在财帛主收入稳——这种人可能是财务总监、投行VP、或者管预算的负责人，有权且有钱。',
        '如果化权和化禄同宫在官禄，力量更强——事业本身就是权力和资源的结合点。但要注意，权禄同宫的人容易把工作当成全部，因为事业给你的回报太直接，反而忽略了其他宫位。'
      ]},
      { h: '有权无利：化权不见禄是苦差', ps: [
        '官禄宫化权但三方不见禄，是「有权无利」。你确实在管事儿，但管的事不赚钱——可能是后台部门、合规、行政、或者责任大但预算小的岗位。别人觉得你是个领导，只有你自己知道权力有多大、资源有多紧。',
        '这种组合的人，事业上容易「名大于实」——头衔好听，实权有限。或者在一个夕阳行业、亏损部门做负责人，上面给你压力但不给你弹药。',
        '如果大限走到这种位置，这十年能熬出来就上一个台阶，熬不出来就是白忙。关键看有没有化科来救——化科主名声和专业，有权无利但有科，至少能靠专业能力建立口碑，为下一步铺路。'
      ]},
      { h: '有权有帮：左右昌曲定团队', ps: [
        '官禄宫化权加左辅、右弼，你做决策有人执行——不是光杆司令。这种人适合带团队，管理幅度大，下面有人帮你落地。',
        '加文昌、文曲，你的权力靠专业和文书支撑——可能是技术管理、法务、策划类岗位，权力不是来自职位本身，而是来自你懂的东西别人不懂。',
        '加天魁、天钺，事业上有贵人提拔——关键时刻有人提你一把。但魁钺是「运」不是「力」，贵人帮你开门，进去之后还得靠化权自己扛。',
        '反过来，化权加擎羊、天刑，事业上竞争激烈、人事斗争多。你确实有权力，但这个权力是争来的，不是给的——每天都在打仗。'
      ]},
      { h: '流年引动：权力什么时候来，什么时候累', ps: [
        '第一种：大限官禄宫化权。这十年事业上升——有职位、有权力、有责任。但如果大限官禄化权且不见禄，这十年是「熬」的十年，累但可能值得。',
        '第二种：流年化权入官禄。这一年有升职、授权、负责新项目的机会。但流年权是一年期的——今年给你权，明年可能收回去，所以要在这一年做出成绩。',
        '第三种：流年化忌冲官禄。这一年权力受挑战——被架空、被分权、项目被砍、领导换人。这种年份不宜争权，以守为主，把手里的事做好比什么都强。'
      ]},
      { h: '排盘后的使用顺序', ps: ['官禄宫看到化权，按这个顺序读：'], ol: [
        '先看什么星化权——武曲主财务权，太阳主行政权，紫微主最高权，廉贞主业务权。',
        '看三方有无化禄或禄存——有禄是实权，无禄是苦差。',
        '看左右、昌曲、魁钺——有帮是团队管理，无帮是光杆司令。',
        '看煞星：擎羊主斗争，火星主急躁，陀罗主拖延，空劫主变动。',
        '对宫夫妻宫也要看——事业强势对婚姻的影响。',
        '流年分三种：大限权主十年事业运，流年权主当年升职，流年忌冲主权位不稳。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-guanlugong-hangye-zhiwei-zeren-shui-zhong.html', text: '官禄宫看行业还是职位' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-minggong-huaquan-zhujian-haishi-guquan.html', text: '命宫化权：主见还是孤权' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' }
    ],
    enLead: 'People with Hua Quan in the Career Palace tend to have presence at work — they manage, decide, and solve what others can\'t. But there are two versions: real authority, with title, resources, and people who listen; and false authority, with a good title, heavy responsibility, insufficient resources, and everything landing on you. The difference isn\'t Hua Quan itself — it\'s whether Hua Lu or Lu Cun accompanies it, and whether assistants show up.',
    enIntro2: 'Hua Quan is the star of control. In the Career Palace it brings drive and execution. These people don\'t want to be followers. But power without profit is a grind; power without help is lonely command.',
    enSections: [
      { h: 'Power With Profit: Hua Quan Plus Lu', ps: [
        'When Hua Quan in Career meets Hua Lu or Lu Cun in the triple combination, you get authority with resources — budget, clients, decisions that pay. Not an empty title but a real seat of power.',
        'Example: Wu Qu Hua Quan in Career with Lu Cun in Wealth. Wu Qu is the finance star; you control budgets or resources, and the income is stable — think finance director or VP with P&L ownership.',
        'If Hua Quan and Hua Lu share the Career Palace, the career itself is where power and money converge. But work can become your whole life when the rewards are this direct.'
      ]},
      { h: 'Power Without Profit: A Grind', ps: [
        'Hua Quan without Lu in the triple combination means you manage things that don\'t make money — back office, compliance, administration, roles with responsibility but no budget.',
        'The title sounds good; the actual authority is limited. Or you run a losing division with pressure from above and no ammunition.',
        'Hua Ke can partially rescue this: at least you build professional reputation that sets up the next move.'
      ]},
      { h: 'Power With Help: Assistants Define the Team', ps: [
        'With Zuo Fu/You Bi, you have people who execute — you\'re not a one-person show.',
        'With Chang Qu, your authority rests on expertise — technical management, legal, planning. Your power comes from knowing what others don\'t.',
        'With Kui Yue, someone sponsors you at key moments. But sponsors open doors; you still have to carry the room.',
        'With Qing Yang or Tian Xing, the workplace is competitive and political. You fight for every inch of authority.'
      ]},
      { h: 'Timing: When Power Comes, When It Grinds', ps: [
        'A ten-year cycle with Hua Quan in Career brings a decade of rise — title, authority, responsibility. Without Lu it\'s a hard decade that may still be worth it.',
        'An annual Hua Quan entering Career brings promotion or new mandate this year. It\'s a one-year window — produce results before it shifts.',
        'An annual Hua Ji opposing Career means challenged authority — sidelining, restructuring, a new boss. Don\'t fight for power this year; hold your ground and deliver.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Quan in the Career Palace:'], ol: [
        'Which star transforms? Wu Qu = financial authority, Tai Yang = administrative, Zi Wei = top authority, Lian Zhen = operational.',
        'Check for Hua Lu/Lu Cun — with Lu it\'s real power; without it\'s a grind.',
        'Check Zuo You, Chang Qu, Kui Yue — with help you lead a team; without you\'re alone.',
        'Check malefics: Qing Yang = politics, Huo Xing = urgency, Tuo Luo = delay, Kong Jie = instability.',
        'Read the opposite Spouse Palace — career dominance affects marriage.',
        'Timing: decade Quan = career arc, annual Quan = promotion year, annual Ji opposition = unstable seat.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-guanlugong-hangye-zhiwei-zeren-shui-zhong.html', text: 'Career: Industry, Role, or Responsibility' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-minggong-huaquan-zhujian-haishi-guquan.html', text: 'Life Palace Hua Quan' },
      { href: 'ziwei-sanfang-sizheng.html', text: 'Triple Combinations' }
    ]
  },
  {
    slug: 'ziwei-tianzhaigong-huaquan',
    cnTitle: '紫微斗数田宅宫化权：家里谁说了算，房产是掌控还是压力',
    enTitle: 'Property Palace With Hua Quan: Who Rules the Home?',
    cnDesc: '田宅宫化权，家里你说了算，房产上有主导权。但化权在田宅也主房产带来的压力和家庭内部的权力争夺。是掌控还是负担，看有没有禄来配。',
    enDesc: 'Hua Quan in the Property Palace means you call the shots at home and dominate real estate decisions. But it also brings property-related pressure and family power struggles. Check for Lu.',
    cnLead: '田宅宫化权的人，在家里通常是「说了算」的那个——买不买房、装什么修、房子写谁名，都是你拍板。这种人对房产有强烈的掌控欲，也容易在不动产上有收获。但化权在田宅有两面：一面是「我的房子我做主」，另一面是「房子的事全压在我身上」。家里谁说了算和家里事谁来扛，经常是同一个人。',
    cnIntro2: '田宅宫看四样东西：房产、家庭、居住环境、库藏。化权落在这个宫位，四样东西都会带上「权」的色彩——房产上有主导权，家庭里有权威，居住环境可能大或气派，库藏上你掌握着家里的财政。但权也主压力和争夺，尤其是家庭内部。',
    cnSections: [
      { h: '房产上的主导权', ps: [
        '田宅宫化权，你在房产上有决策权和行动力。可能是家里主要推动买房的人，也可能是房产证上写你名字、房贷你还、装修你定。这种人通常不止一套房，或者房子比同阶层的人大。',
        '化权加禄存或化禄，房产带来实际利益——买得早、涨得多、租金稳。这是「房子养你」的组合，不动产是你的底气。',
        '化权加化忌或煞星，房产带来压力——房贷重、装修超支、产权纠纷、或者为了买房背了一身债。这是「你养房子」的组合，房子是资产也是枷锁。'
      ]},
      { h: '家庭里的权威', ps: [
        '田宅宫化权，你在家庭中地位高、说话有分量。如果是已婚人士，可能是家里的「掌柜的」——大事你定，小事另一半定，但什么是大事也是你定。',
        '但权威也主争执。化权加擎羊或火星，家里容易因为谁说了算而吵架——你觉得你在负责，对方觉得你在控制。尤其是跟父母同住的人，田宅宫化权加煞，两代人在家里的权力冲突很明显。',
        '举个组合：田宅宫天梁化权加擎羊。天梁是老人星，化权是强势，擎羊是冲突——家里长辈（尤其父母）要管事，你也要管事，两代人在同一个屋檐下争话语权。这种情况最好的解法是分开住，物理距离比沟通技巧有用。'
      ]},
      { h: '库藏和财政掌控', ps: [
        '田宅宫也叫「库藏宫」，看你能存住多少东西。化权在田宅，你对家里的财政有掌控权——可能是你管钱、你记账、你决定大额支出。',
        '这种人通常能存住东西——不一定是现金，但房产、贵金属、收藏品这些「硬资产」会有。化权加天府或禄存，库藏丰厚；化权加空劫，存了又花、买了又卖，库藏留不住。',
        '如果田宅宫是空宫，借对宫子女宫的星曜来读。空宫不代表没有房产——借过来的星曜决定了你跟房子的关系以什么方式呈现。'
      ]},
      { h: '流年引动：房子和家什么时候动', ps: [
        '第一种：大限田宅宫化权。这十年跟房子的关系深——可能买房、换房、装修、或者成为家里的顶梁柱。如果加禄，这十年房产增值；加忌，这十年为房所累。',
        '第二种：流年化权入田宅。这一年家里有大事——买房、搬家、装修、或者家里你说了算的程度增加。也可能是家里添丁进口（田宅宫也看家庭成员变化）。',
        '第三种：流年化忌冲田宅。这一年房产有麻烦——产权纠纷、房屋质量问题、邻居矛盾、或者家中长辈身体不好。这种年份不宜大额房产投资，签合同要格外小心。'
      ]},
      { h: '排盘后的使用顺序', ps: ['田宅宫看到化权，按这个顺序读：'], ol: [
        '先看什么星化权——天府化权主房产稳，太阴化权主女性持家，武曲化权主房产带财，天梁化权主长辈管事。',
        '看有无禄存或化禄——有禄，房产是资产；无禄，房产是压力。',
        '看煞星：擎羊火星主家庭争执，陀罗主房产拖延，空劫主库藏不稳。',
        '看家庭关系：化权在田宅，你在家是权威，但权威和控制一线之隔。',
        '空宫借对宫子女宫，看子女和家庭的互动。',
        '流年分三种：大限权主十年房产运，流年权主当年家事，流年忌冲主房产麻烦。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-tianzhaigong.html', text: '田宅宫怎么看' },
      { href: 'ziwei-tianzhaigong-hualu.html', text: '田宅宫化禄' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: '本宫没有主星怎么读' }
    ],
    enLead: 'With Hua Quan in the Property Palace, you\'re the one who calls the shots at home — whether to buy, how to renovate, whose name goes on the deed. You have strong drive around real estate and often benefit from it. But there are two sides: "my house, my rules" and "everything about the house lands on me." The person who decides and the person who carries it are often the same person.',
    enIntro2: 'The Property Palace covers real estate, family, living environment, and stored wealth. Hua Quan here colors all four: dominance in property, authority at home, possibly a large or impressive residence, and control over household finances. But power also brings pressure and disputes.',
    enSections: [
      { h: 'Dominance in Real Estate', ps: [
        'You drive property decisions — you\'re the one pushing to buy, your name is on the deed, you cover the mortgage, you choose the renovation. People with this placement often own multiple properties or larger homes than peers.',
        'With Lu Cun or Hua Lu, property pays off — bought early, appreciated well, steady rental income. The house supports you.',
        'With Hua Ji or malefics, property pressures you — heavy mortgage, budget overruns, title disputes, debt taken on to buy. You support the house.'
      ]},
      { h: 'Authority at Home', ps: [
        'You carry weight in family decisions. If married, you may be the household CFO — you decide the big things, your partner decides the small ones, and you define what counts as big.',
        'But authority breeds conflict. With Qing Yang or Huo Xing, arguments over who\'s in charge are common — you see it as responsibility, they see it as control.',
        'Example: Tian Liang Hua Quan with Qing Yang in Property. Tian Liang is the elder star; an older family member wants to run things, and so do you. Two authorities under one roof. Separate housing helps more than communication技巧.'
      ]},
      { h: 'Stored Wealth and Financial Control', ps: [
        'The Property Palace is also the storage palace. Hua Quan here means you control household finances — you manage money, track spending, approve large purchases.',
        'You tend to hold hard assets — property, precious metals, collectibles. With Tian Fu or Lu Cun, storage is abundant; with Kong Jie, things come and go.',
        'If the palace is empty, borrow the opposite Children Palace stars. An empty palace doesn\'t mean no property.'
      ]},
      { h: 'Timing: When Home and Property Move', ps: [
        'A ten-year cycle with Hua Quan in Property brings deep involvement with housing — buying, upgrading, renovating, becoming the family pillar. With Lu, appreciation; with Ji, burden.',
        'An annual Hua Quan entering Property brings a major home event — purchase, move, renovation, or increased authority at home.',
        'An annual Hua Ji opposing Property brings property trouble — disputes, defects, neighbor conflicts, elder health issues. Don\'t make large real estate investments this year.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Quan in the Property Palace:'], ol: [
        'Which star transforms? Tian Fu = stable property, Tai Yin = female running the home, Wu Qu = property wealth, Tian Liang = elder dominance.',
        'Check Lu Cun/Hua Lu — with Lu, property is an asset; without, it\'s a burden.',
        'Check malefics: Qing Yang/Huo Xing = family conflict, Tuo Luo = delays, Kong Jie = unstable storage.',
        'Authority vs. control — you run the home, but watch the line.',
        'Empty palace: borrow the Children Palace.',
        'Timing: decade Quan = property cycle, annual Quan = home event, annual Ji opposition = property trouble.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-tianzhaigong.html', text: 'The Property Palace' },
      { href: 'ziwei-tianzhaigong-hualu.html', text: 'Property Palace Hua Lu' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' },
      { href: 'ziwei-bengong-meiyou-zhuxing-zenme-du.html', text: 'Reading Empty Palaces' }
    ]
  },
  {
    slug: 'ziwei-fudegong-huaquan',
    cnTitle: '紫微斗数福德宫化权：精神上的强势，是主见还是执念',
    enTitle: 'Mental Palace With Hua Quan: Conviction or Obsession?',
    cnDesc: '福德宫化权，精神世界强大——有主见、不随波逐流。但精神上的强势也可能变成执念和控制欲。是内心坚定还是钻牛角尖，看有没有出口。',
    enDesc: 'Hua Quan in the Mental Palace gives inner strength — conviction, independence. But mental dominance can harden into obsession. Check whether there\'s an outlet.',
    cnLead: '福德宫化权的人，精神上特别有主见。别人怎么说、社会怎么看，他有自己的一套。这种人不容易被洗脑、不随大流，内心有一股「我认定的事谁也改不了」的劲。但这股劲用好了是坚定，用不好是执念——区别在于你能不能听进不同意见、有没有释放的出口。',
    cnIntro2: '福德宫看你的精神世界、潜意识、享受能力和价值观。化权落在这个宫位，精神世界是「紧」的——有力量，但不松弛。这种人通常对自己要求高，对别人也不低。这篇讲福德宫化权怎么读。',
    cnSections: [
      { h: '精神上的主见', ps: [
        '福德宫化权，你有一套自己的价值观，而且这套价值观不容易被外界动摇。别人追风口你不追，别人焦虑你不急——不是因为你佛系，而是因为你心里有杆秤。',
        '这种人适合做需要独立判断的事——投资、研究、创作、管理。你们不容易被群体情绪带着走，在别人恐慌的时候可能反而冷静。',
        '但化权在福德也主「精神上的控制欲」——你不只是自己有主见，你还希望别人认同你的主见。如果福德宫化权加煞星，这种控制欲会变成「我都是为你好」式的强加于人。'
      ]},
      { h: '坚定和执念的分界', ps: [
        '坚定是什么？是你知道自己要什么，也允许别人要别的。执念是什么？是你认定一条路，撞了南墙也不回头，还要拉着别人一起撞。',
        '福德宫化权加昌曲，精神有出口——思考、写作、学习能帮你消化执念。昌曲也主理性，你的主见经过思考，不是纯情绪。',
        '福德宫化权加陀罗，执念最重。陀罗是原地打转——一个想法翻来覆去想，别人说什么你都听不进去。这种组合的人，最大的敌人不是外界的反对，而是自己内心的那个结。',
        '福德宫化权加空劫，精神世界大但容易空——想得多、做得少，追求意义感但找不到落脚点。空劫也主宗教哲学缘分，这种人可能在信仰或灵性中找到出口。'
      ]},
      { h: '享受能力：化权在福德的人不会放松', ps: [
        '福德宫也看享受。化权在福德的人，享受都带着目标——旅游要做攻略、看电影要写影评、休息都要有「效率」。你们很难真正放空，因为精神上那根弦一直绷着。',
        '这种人要学会「无目的的放松」——不是为了更好地工作而休息，而是休息本身就是目的。福德宫化权加禄存或化禄，至少能在物质享受中找到片刻安宁；加煞星，连享受都变成竞赛。',
        '福德宫化权的人也要注意睡眠——精神紧绷的人容易失眠或浅眠。如果大限走到福德宫化权加火星铃星，这十年焦虑感会比较重，需要主动建立减压习惯。'
      ]},
      { h: '流年引动：精神状态什么时候紧', ps: [
        '第一种：大限福德宫化权。这十年精神上特别有主见——可能形成一套自己的哲学或信仰，也可能特别固执。这十年适合做需要深度思考的事，但要警惕听不进劝。',
        '第二种：流年化权入福德。这一年你内心特别有力量——知道自己要什么，不容易被左右。适合做重大决定，因为你的判断力在这一年比较强。',
        '第三种：流年化忌冲福德。这一年精神上容易出问题——焦虑、抑郁、失眠、或者价值观受到冲击。这种年份不要硬撑，找人聊、找专业人士帮，比自己扛有用。'
      ]},
      { h: '排盘后的使用顺序', ps: ['福德宫看到化权，按这个顺序读：'], ol: [
        '先看什么星化权——紫微化权主精神上的帝王感，天梁化权主道德感强，武曲化权主精神上务实，太阴化权主感性中有主见。',
        '看有无昌曲——有昌曲，思考有出口；无昌曲，主见容易变成固执。',
        '看煞星：陀罗主执念，火铃主焦虑，擎羊主刚愎，空劫主空想。',
        '看有无禄存或化禄——有禄，精神上有满足感；无禄，容易内耗。',
        '对宫财帛宫也要看——精神状态和财务状况互相影响。',
        '流年分三种：大限权主十年精神主线，流年权主当年坚定，流年忌冲主精神危机。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-fudegong-hualu.html', text: '福德宫化禄' },
      { href: 'ziwei-lianzhen-qisha-fudegong-yingcheng-bunengkang.html', text: '廉贞七杀在福德' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Quan in the Mental Palace have strong inner conviction. They don\'t follow the crowd, and once they\'ve made up their minds, few can change them. But this force cuts two ways: channeled well it\'s steadfastness; channeled poorly it\'s obsession. The difference is whether you can hear opposing views and whether you have an outlet.',
    enIntro2: 'The Mental Palace governs your inner world, subconscious, capacity for enjoyment, and values. Hua Quan here makes the mind tight — powerful, but not relaxed. These people hold themselves to high standards and others not much lower.',
    enSections: [
      { h: 'Inner Conviction', ps: [
        'You have your own value system and it doesn\'t shift with trends. You don\'t chase what everyone else chases, not because you\'re Zen, but because you have an internal scale.',
        'This suits independent judgment — investing, research, creative work, management. You stay calm when others panic.',
        'But it can also become mental control — you don\'t just have convictions; you want others to share them. With malefics, it becomes "I know best" imposed on everyone around you.'
      ]},
      { h: 'Steadfast vs. Obsessed', ps: [
        'Steadfast means you know what you want and allow others to want differently. Obsessed means you hit the wall and keep going, pulling others with you.',
        'With Chang Qu, thinking has an outlet — writing, study, analysis digest the fixation. Your convictions are reasoned, not purely emotional.',
        'With Tuo Luo, obsession is strongest — one thought loops, no one can talk you out of it. Your own mind, not external opposition, is the main obstacle.',
        'With Kong Jie, the inner world is vast but ungrounded — lots of meaning-seeking, little landing. Philosophy or spirituality may provide the outlet.'
      ]},
      { h: 'Capacity for Enjoyment: You Don\'t Know How to Relax', ps: [
        'The Mental Palace also rules enjoyment. With Hua Quan, even leisure has a goal — travel requires an itinerary, movies require reviews, rest must be "productive." You struggle to truly switch off.',
        'Learn purposeless relaxation — rest as an end, not as preparation for more work. With Lu Cun or Hua Lu, material comfort provides moments of peace; with malefics, even pleasure becomes competition.',
        'Watch sleep. Tense minds tend toward insomnia. A decade with Huo Xing/Ling Xing here brings sustained anxiety — build减压 habits proactively.'
      ]},
      { h: 'Timing: When the Mind Tightens', ps: [
        'A ten-year cycle with Hua Quan in Mental brings strong convictions — possibly a personal philosophy, possibly stubbornness. Good for deep thinking; bad for listening.',
        'An annual Hua Quan entering Mental brings a year of inner clarity and resolve. Good for major decisions.',
        'An annual Hua Ji opposing Mental brings mental struggle — anxiety, insomnia, values shaken. Don\'t tough it out alone; talk to someone, get professional help.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Quan in the Mental Palace:'], ol: [
        'Which star transforms? Zi Wei = inner sovereignty, Tian Liang = moral certainty, Wu Qu = pragmatism, Tai Yin = emotional conviction.',
        'Check Chang Qu — with them, thinking has an outlet; without, conviction hardens.',
        'Check malefics: Tuo Luo = obsession, Huo Ling = anxiety, Qing Yang = rigidity, Kong Jie = escapism.',
        'Check Lu Cun/Hua Lu — with Lu, inner satisfaction; without, internal friction.',
        'Read the opposite Wealth Palace — mind and money affect each other.',
        'Timing: decade Quan = mental theme, annual Quan = resolve, annual Ji opposition = crisis.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-fudegong-hualu.html', text: 'Mental Palace Hua Lu' },
      { href: 'ziwei-lianzhen-qisha-fudegong-yingcheng-bunengkang.html', text: 'Lian Zhen + Qi Sha in Mental' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-caibogong-huaquan',
    cnTitle: '紫微斗数财帛宫化权：赚钱要自己说了算，是掌控财还是被财掌控',
    enTitle: 'Wealth Palace With Hua Quan: Control Money or Be Controlled by It?',
    cnDesc: '财帛宫化权，赚钱有魄力、花钱有主见。但对钱的掌控欲也可能变成被钱掌控——什么都要自己管、不敢放权、为了钱累自己。',
    enDesc: 'Hua Quan in the Wealth Palace gives drive and decisiveness around money. But the need to control finances can become being controlled by them — unable to delegate, unable to rest.',
    cnLead: '财帛宫化权的人，跟钱的关系很「紧」。赚钱有魄力——看到机会敢出手；花钱有主见——钱花在哪、怎么花，自己说了算；管钱有控制欲——家里的财最好自己掌，别人管不放心。这种人通常能赚到钱，但也容易被钱拴住——因为什么都要自己抓，不敢放权、不敢休息、不敢把钱交给别人。',
    cnIntro2: '财帛宫看赚钱方式、花钱态度和现金流。化权落在这个宫位，赚钱方式是「主动型」的——不是等钱来，而是去争取。但权也主「执」，对钱的执可以变成动力，也可以变成枷锁。',
    cnSections: [
      { h: '赚钱的魄力', ps: [
        '财帛宫化权，赚钱主动且有魄力。这种人不满足于死工资，总想搞点什么——副业、投资、创业、或者在公司里争取提成高的岗位。你们对钱有直觉，敢在别人犹豫的时候出手。',
        '化权加禄存或化禄，赚钱有魄力且能守住——出手准、留得住，是真正的「会赚钱」。武曲化权加禄存在财帛，是最典型的「财权在握」组合。',
        '化权加空劫，赚钱魄力大但留不住——投资冲动、出手快但复盘少，可能大赚也可能大亏。这种组合的人要学会「止盈」和「止损」，不要让魄力变成赌性。'
      ]},
      { h: '花钱的主见', ps: [
        '财帛宫化权的人，花钱有自己的逻辑——不是不花，而是要花在「我认为值」的地方。你们可能在某些地方很大方（自己看重的），在另一些地方很抠门（自己不看重的）。',
        '这种人请客吃饭可能抢着买单，但你让他为「智商税」花一分钱都难。你们对钱的去向有掌控欲，不喜欢被人安排消费。',
        '化权加擎羊，花钱容易冲动——尤其是生气或好胜的时候，可能为了面子一掷千金。化权加陀罗，花钱犹豫——大额支出想很久，有时反而错过时机。'
      ]},
      { h: '管钱的控制欲', ps: [
        '财帛宫化权，你对「谁管钱」很在意。结婚后可能要求财政大权在自己手里，不是不信任对方，而是「钱在我手里我才安心」。',
        '这种控制欲在事业上也有体现——如果做生意，你可能什么都要自己签、自己批，不敢放权给下属。短期看是稳妥，长期看是瓶颈——你一个人能管的钱是有限的。',
        '举个组合：财帛宫紫微化权加天府。紫微是帝王，化权是掌控，天府是库藏——这种人对钱有绝对的控制欲，可能是很会管钱的人，但也可能因为什么都要自己抓而累到不行。学会授权和委托，是这种组合的必修课。'
      ]},
      { h: '流年引动：钱什么时候进，什么时候紧', ps: [
        '第一种：大限财帛宫化权。这十年赚钱动力最强——可能创业、跳槽到高薪岗位、或者开始认真投资。如果加禄，这十年收入上一个台阶；加忌，这十年为钱辛苦。',
        '第二种：流年化权入财帛。这一年有赚钱机会——加薪、奖金、投资回报、副业收入。但流年权也主「这一年钱进来得猛」，要注意不要因为今年赚得多就扩大长期支出。',
        '第三种：流年化忌冲财帛。这一年破财风险——投资亏损、被骗、大额意外支出、或者收入下降。这种年份不宜借贷、不宜担保、不宜大额投资。'
      ]},
      { h: '排盘后的使用顺序', ps: ['财帛宫看到化权，按这个顺序读：'], ol: [
        '先看什么星化权——武曲化权主正财权，太阴化权主暗财，天府化权主库藏权，廉贞化权主交际财。',
        '看有无禄存或化禄——有禄，能赚能守；无禄，白忙或过路财神。',
        '看煞星：擎羊主冲动投资，陀罗主赚钱拖延，空劫主财来财去，火铃主因急躁破财。',
        '看花钱模式：你是该花的花还是什么都抠？化权在财帛的人容易走极端。',
        '对宫福德宫也要看——赚钱的动力和精神状态互相影响。',
        '流年分三种：大限权主十年财运，流年权主当年进财，流年忌冲主破财。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-caibogong-hualu.html', text: '财帛宫化禄' },
      { href: 'ziwei-pojun-caibo-guanlu-bianjuqian.html', text: '破军在财帛和官禄' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Quan in the Wealth Palace have a tight relationship with money. They earn boldly — they act when they see opportunity; spend deliberately — money goes where they decide; and control finances tightly — they prefer to manage the money themselves because only then do they feel secure. They usually earn well, but money can also chain them — unable to delegate, unable to rest, unable to trust anyone else with it.',
    enIntro2: 'The Wealth Palace covers earning style, spending attitude, and cash flow. Hua Quan here makes earning active — you don\'t wait for money, you go after it. But power also brings grasping, which can be either drive or shackles.',
    enSections: [
      { h: 'Boldness in Earning', ps: [
        'You\'re not satisfied with a fixed salary. Side businesses, investments, entrepreneurship, commission-heavy roles — you pursue money actively and have a nose for opportunity.',
        'With Lu Cun or Hua Lu, you earn boldly and keep what you earn — Wu Qu Hua Quan with Lu Cun is the classic "financial authority" combination.',
        'With Kong Jie, boldness becomes speculation — big wins and big losses. Learn to take profits and cut losses; don\'t let courage turn into gambling.'
      ]},
      { h: 'Decisiveness in Spending', ps: [
        'You spend by your own logic — generous on what matters to you, frugal on what doesn\'t. You\'ll grab the dinner bill but won\'t pay a cent for what you see as a scam.',
        'With Qing Yang, impulsive spending — especially when angry or competing for face. With Tuo Luo, spending paralysis — overthinking large purchases and missing timing.'
      ]},
      { h: 'Control Over Money', ps: [
        'You care about who manages the money. In marriage you may want financial control — not from distrust, but because money in your own hands is the only way you feel secure.',
        'In business, you sign everything, approve everything, and can\'t delegate. It feels safe in the short term but caps your scale — one person can only manage so much.',
        'Example: Zi Wei Hua Quan with Tian Fu in Wealth. Zi Wei rules, Hua Quan controls, Tian Fu stores — you\'re excellent with money but may run yourself ragged holding every string. Learning to delegate is essential.'
      ]},
      { h: 'Timing: When Money Flows, When It Tightens', ps: [
        'A ten-year cycle with Hua Quan in Wealth brings peak earning drive — entrepreneurship, high-paying moves, serious investing. With Lu, income steps up; with Ji, it\'s a hard decade.',
        'An annual Hua Quan entering Wealth brings an earning year — raise, bonus, investment returns. Don\'t expand fixed costs just because one year is strong.',
        'An annual Hua Ji opposing Wealth brings loss risk — bad investments, scams, unexpected expenses. No borrowing, no guaranteeing loans, no big bets this year.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Quan in the Wealth Palace:'], ol: [
        'Which star transforms? Wu Qu = earned authority, Tai Yin = quiet wealth, Tian Fu = stored wealth, Lian Zhen = social/network wealth.',
        'Check Lu Cun/Hua Lu — with Lu, you earn and keep; without, money passes through.',
        'Check malefics: Qing Yang = impulsive, Tuo Luo = slow earning, Kong Jie = easy come easy go, Huo Ling = impatience costs.',
        'Spending pattern — do you spend where it matters or extremes?',
        'Read the opposite Mental Palace — earning drive and inner state affect each other.',
        'Timing: decade Quan = earning arc, annual Quan = income year, annual Ji opposition = loss year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-caibogong-hualu.html', text: 'Wealth Palace Hua Lu' },
      { href: 'ziwei-pojun-caibo-guanlu-bianjuqian.html', text: 'Po Jun in Wealth and Career' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-fumugong-huaquan',
    cnTitle: '紫微斗数父母宫化权：父母强势，是保护还是压制',
    enTitle: 'Parents Palace With Hua Quan: Protection or Control?',
    cnDesc: '父母宫化权，父母能力强、说话有分量。但强势的父母可以是靠山，也可以是压力。是保护还是压制，看有没有禄来缓和、有没有空间让你成长。',
    enDesc: 'Hua Quan in the Parents Palace means capable, authoritative parents. But strong parents can be a mountain or a weight. Check for Lu to soften it and room for you to grow.',
    cnLead: '父母宫化权的人，通常有一对强势的父母——尤其是父亲或母亲中的某一个，在家里说一不二。这种父母有能力、有主见，能给你提供保护和资源，但也容易把你的路都安排好，让你没有自己做决定的空间。靠山和靠山压在你身上，有时候是同一座山。',
    cnIntro2: '父母宫看父母、长辈、上司和文书。化权在这个宫位，父母或上司是「强人型」的——能帮你，也能管你。这篇讲怎么区分父母的强势是保护还是压制，以及成年后怎么跟这种能量相处。',
    cnSections: [
      { h: '有能力的父母：权是靠山', ps: [
        '父母宫化权，父母通常有一定的社会地位或能力——可能是干部、管理者、专业人士，或者虽然没什么学历但在家里说一不二、在外面也能扛事。',
        '这种父母能给你提供实际的保护——别人欺负你他们会出头，你遇到困难他们能托底。化权加禄存或化禄，父母既有能力又愿意给资源，是真正的「靠山」。',
        '天魁天钺在三方，父母可能是你的贵人——在关键时刻帮你铺路、介绍机会。但魁钺给的是「开门」，进门之后走成什么样还看你自己。'
      ]},
      { h: '强势的父母：权也是压力', ps: [
        '父母宫化权的另一面，是父母的控制欲。他们可能确实为你好，但「为你好」的方式是替你做决定——学什么专业、做什么工作、找什么对象，他们都有意见，而且你不听不行。',
        '化权加擎羊，父母强势且严厉——打骂教育、高压管控，你可能从小就怕他们。化权加陀罗，父母的管控是长期的、纠缠的——你三十岁了他们还把你当小孩，什么都要问、什么都要管。',
        '举个组合：父母宫太阳化权加擎羊。太阳主父亲，化权主强势，擎羊主冲突——父亲是个强人，但跟你的关系紧张。他可能确实为你铺了路，但你每走一步都觉得是在走他的路，不是自己的。'
      ]},
      { h: '成年后的课题：从服从到立边界', ps: [
        '父母宫化权的人，成年后的核心课题是「立边界」。不是跟父母决裂，而是让他们知道：你感谢他们的帮助，但你的人生你自己说了算。',
        '如果你的命宫也强（命宫化权或紫微天府），你会跟父母硬碰硬——可能在某个阶段激烈冲突，然后慢慢找到平衡。如果你的命宫柔（天同、天梁），你可能一直顺从到中年，然后在某件事上突然爆发。',
        '最好的状态是：接受父母给的资源（化权的正面），但不接受他们对你人生的控制（化权的负面）。这需要经济独立——只有你不需要他们的钱，他们的「权」才会从「控制」变成「建议」。'
      ]},
      { h: '上司和权威：同样的模式', ps: [
        '父母宫也看上司。化权在父母宫，你遇到的上司通常也是强人型——有能力、有脾气、要求高。跟这种上司相处，跟跟强势父母相处是同一个模式：你是能在强人手下成长，还是被强人压垮？',
        '化权加化科，上司虽然强但讲道理——你做得好他看得见，能学到东西。化权加化忌，上司强且难搞——有功他领、有锅你背，这种环境不宜久留。'
      ]},
      { h: '排盘后的使用顺序', ps: ['父母宫看到化权，按这个顺序读：'], ol: [
        '先看什么星化权——太阳化权主父亲强势，太阴化权主母亲强势，天梁化权主长辈式管教，紫微化权主父母地位高。',
        '看有无禄存或化禄——有禄，强势中带着给予；无禄，强势可能变成纯粹的压力。',
        '看煞星：擎羊主严厉冲突，陀罗主长期管控，火星主急躁，空劫主父母缘薄或助力落空。',
        '对照命宫：你强就会硬碰硬，你柔就容易被压住。',
        '看上司运：父母宫化权的人，上司也多是强人。',
        '流年分三种：大限权主十年长辈/上司关系，流年权入父母主当年长辈助力或压力，流年忌冲主与权威冲突。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-fumugong.html', text: '父母宫怎么看' },
      { href: 'ziwei-fumugong-hualu-jumen-geiqian-zhengzhi.html', text: '父母宫化禄见巨门' },
      { href: 'ziwei-fumu-gei-ziyuan-zong-ganyu.html', text: '父母给资源却总干预' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'People with Hua Quan in the Parents Palace often have strong-willed parents — one of them in particular calls the shots. These parents are capable and decisive; they can protect and provide, but they can also map out your entire life, leaving no room for your own decisions. A mountain that shields you and a mountain that crushes you can be the same mountain.',
    enIntro2: 'The Parents Palace covers parents, elders, bosses, and documents. Hua Quan here means the authority figures in your life are strong — they help, and they control.',
    enSections: [
      { h: 'Capable Parents: Authority as Backing', ps: [
        'Your parents typically have social standing or ability — officials, managers, professionals, or simply people who are formidable regardless of education.',
        'They provide real protection — they step in when you\'re wronged, they catch you when you fall. With Lu Cun or Hua Lu, they have both ability and willingness to give — a genuine safety net.',
        'With Kui Yue in the triple combination, parents may be your benefactors, opening doors at key moments. But they open doors; you still have to walk through.'
      ]},
      { h: 'Dominant Parents: Authority as Pressure', ps: [
        'The other side is control. They may genuinely want the best for you, but their way is to decide for you — major, career, partner — and disagreement isn\'t really an option.',
        'With Qing Yang, strict and harsh — possibly harsh discipline, fear-based upbringing. With Tuo Luo, control is chronic — you\'re 30 and they still treat you like a child.',
        'Example: Tai Yang Hua Quan with Qing Yang in Parents. The father is a strongman; the relationship is tense. He may pave your road, but every step feels like his road, not yours.'
      ]},
      { h: 'The Adult Task: Boundaries, Not Breakdown', ps: [
        'The core task is setting boundaries — not cutting them off, but making clear: you appreciate the help, but your life is yours to decide.',
        'If your Life Palace is also strong, you clash head-on and eventually find balance. If it\'s soft, you may comply until midlife and then erupt over something specific.',
        'The best outcome: accept the resources (the positive side) without accepting control (the negative side). Financial independence is what turns their "authority" from control into advice.'
      ]},
      { h: 'Bosses: The Same Pattern', ps: [
        'This palace also rules bosses. You tend to get strong, demanding bosses. The question is the same: do you grow under a strong leader, or get crushed?',
        'With Hua Ke, the boss is strong but fair — you learn, your work is seen. With Hua Ji, the boss takes credit and assigns blame — don\'t stay long.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Quan in the Parents Palace:'], ol: [
        'Which star transforms? Tai Yang = strong father, Tai Yin = strong mother, Tian Liang = elder-style discipline, Zi Wei = high-status parents.',
        'Check Lu Cun/Hua Lu — with Lu, strength comes with giving; without, it can become pure pressure.',
        'Check malefics: Qing Yang = harsh conflict, Tuo Luo = chronic control, Huo Xing = temper, Kong Jie = weak bond or failed support.',
        'Compare with Life Palace — strong you clashes; soft you gets suppressed.',
        'Boss patterns mirror parent patterns.',
        'Timing: decade Quan = authority-figure theme, annual Quan = help or pressure this year, annual Ji opposition = conflict with authority.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-fumugong.html', text: 'The Parents Palace' },
      { href: 'ziwei-fumugong-hualu-jumen-geiqian-zhengzhi.html', text: 'Parents Palace Hua Lu + Ju Men' },
      { href: 'ziwei-fumu-gei-ziyuan-zong-ganyu.html', text: 'Parents Who Give but Interfere' },
      { href: 'ziwei-minggong.html', text: 'The Life Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-minggong-huake',
    cnTitle: '紫微斗数命宫化科：名声、贵人、考试运，化科在命先看什么',
    enTitle: 'Life Palace With Hua Ke: Reputation, Benefactors, and Exam Luck',
    cnDesc: '命宫化科，名声好、贵人多、考试运佳。但化科的「好名」是有前提的——你得先有真本事，科名才挂得住。先看专业，再看名声。',
    enDesc: 'Hua Ke in the Life Palace brings reputation, benefactors, and exam luck. But the name only sticks if you have real skill behind it. Expertise first, reputation second.',
    cnLead: '命宫化科的人，给人的第一印象通常不错——得体、有气质、说话让人舒服。化科是四颗化星里最「文」的一颗，主名声、贵人、考试和文凭。命宫有化科的人，容易因为「口碑好」而获得机会。但化科有一个前提：科名不是凭空来的，它需要真东西来撑。你有本事，化科给你名声；你没本事，化科给你的只是虚名。',
    cnIntro2: '化科和化禄、化权、化忌不同——它不直接给你钱或权，它给你的是「名」。名可以带来利和权，但那是间接的。命宫化科的人，人生策略应该是「先专业后名声」——把本事练好，名声自然来。',
    cnSections: [
      { h: '化科在命的三种表现', ps: [
        '第一是名声好。你给人的印象是正面的——靠谱、有教养、值得信任。这种名声不是你吹出来的，而是别人自然对你的评价。化科在命的人，通常不喜欢高调，但口碑就是好。',
        '第二是贵人多。化科主贵人，命宫化科的人，在关键时刻总有人愿意帮你——可能是因为你平时做人到位，也可能是因为你看起来「值得帮」。天魁天钺是直接贵人，化科是间接贵人——你的名声替你开路。',
        '第三是考试运和文凭运。化科主科甲，命宫化科的人，考试、考证、申请学校通常比较顺。不是不用功就能过，而是用功了就能发挥出来——你不容易在考场上失常。'
      ]},
      { h: '化科需要真本事来撑', ps: [
        '化科最忌「有名无实」。如果你只有名声没有实力，化科给你的机会会变成打脸——别人因为你的名声给你机会，你接不住，名声反而受损。',
        '命宫化科加文昌文曲，是最典型的「真才实学」组合。昌曲主才华和学习能力，化科主名声——你的名声是靠真本事挣来的，挂得住。',
        '命宫化科加空劫，要小心「虚名」。空劫主空——可能你看起来很厉害，但实际内容不够。这种组合的人，要特别注意「先做再说」，不要让名声跑在实力前面。',
        '命宫化科加化权，名声和权力一起来——你是那种「有名又有位」的人。但权科同宫也主「好面子」——你可能因为爱惜羽毛而不敢冒险，反而限制了发展。'
      ]},
      { h: '化科在命的人怎么用这颗星', ps: [
        '第一，投资自己的专业能力。化科的名声是「专业名声」最有效——你在某个领域被认可，比泛泛的「好人缘」有用得多。',
        '第二，经营个人品牌。化科的人适合「被看见」——不是让你炫耀，而是让你的工作成果自然地被人知道。写文章、做分享、考证、拿title，这些都符合化科的能量。',
        '第三，珍惜口碑。化科在命的人，口碑是你最大的资产。一次失信可能毁掉多年积累——因为别人对你的期待本来就高，摔下来也更疼。'
      ]},
      { h: '流年引动：名声和机会什么时候来', ps: [
        '第一种：大限命宫化科。这十年是「出名」的十年——可能拿到重要证书、发表作品、升职后被更多人知道、或者在行业内建立口碑。这十年适合学习和考证。',
        '第二种：流年化科入命。这一年贵人运好、考试运佳——适合面试、答辩、考证、申请、发表。你这一年给人的印象特别好，适合「被看见」的事。',
        '第三种：流年化忌冲命。这一年名声容易受损——被误解、被非议、或者考试失常。这种年份要低调，不要争名，做好自己的事等风头过去。'
      ]},
      { h: '排盘后的使用顺序', ps: ['命宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——天梁化科主口碑型名声，文昌化科主文名，太阴化科主清名，武曲化科主专业名声。',
        '看有无昌曲——有昌曲，名声有真才实学撑；无昌曲，名声可能浮于表面。',
        '看有无化权或化禄——权科同宫主有名有位，禄科同宫主有名有利。',
        '看煞星：空劫主虚名，擎羊主名声受损，陀罗主名声来得慢。',
        '看贵人运：化科在命的人，贵人多来自「听说你不错」。',
        '流年分三种：大限科主十年出名，流年科主当年机会，流年忌冲主名声危机。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-minggong.html', text: '命宫怎么看' },
      { href: 'ziwei-minggong-hualu.html', text: '命宫化禄' },
      { href: 'ziwei-minggong-huaquan-zhujian-haishi-guquan.html', text: '命宫化权' },
      { href: 'ziwei-huake.html', text: '化科总论' },
      { href: 'ziwei-sanfang-sizheng.html', text: '三方四正怎么看' }
    ],
    enLead: 'People with Hua Ke in the Life Palace usually make a good first impression — composed, tasteful, easy to listen to. Hua Ke is the most literary of the Four Transformations: it governs reputation, benefactors, exams, and credentials. People with this placement get opportunities because of good word-of-mouth. But there\'s a precondition: the name must be backed by real substance. With skill, Hua Ke gives you reputation; without it, it gives you only a hollow name.',
    enIntro2: 'Unlike Hua Lu and Hua Quan, Hua Ke doesn\'t directly give money or power — it gives name. Name can bring money and power, but indirectly. The strategy for Hua Ke in Life is: expertise first, reputation follows.',
    enSections: [
      { h: 'Three Manifestations', ps: [
        'First, good reputation. You come across as reliable, cultivated, trustworthy. You don\'t boast; people just speak well of you.',
        'Second, benefactors. At key moments someone helps — because you\'ve treated people well, or because you look worth helping. Kui/Yue are direct benefactors; Hua Ke is indirect — your reputation opens doors.',
        'Third, exam and credential luck. Tests, certifications, school applications tend to go smoothly. Not that you don\'t need to study, but when you do, you perform — you don\'t choke.'
      ]},
      { h: 'Reputation Needs Substance', ps: [
        'Hua Ke\'s biggest risk is name without reality. If reputation outpaces skill, opportunities become embarrassments — you get the shot, can\'t take it, and the name cracks.',
        'With Wen Chang/Wen Qu, it\'s the classic real-expertise combination — your name is earned and sticks.',
        'With Kong Jie, beware hollow fame — you look impressive but lack content. Do first, talk later; don\'t let reputation outrun ability.',
        'With Hua Quan, name and position come together — but you may become risk-averse from protecting your image.'
      ]},
      { h: 'How to Use This Placement', ps: [
        'Invest in professional expertise. Reputation in a specific field is far more powerful than general likability.',
        'Build a personal brand — let your work be seen naturally. Writing, speaking, certifications, titles all align with Hua Ke.',
        'Protect your reputation. It\'s your biggest asset, and one broken trust costs more when expectations are high.'
      ]},
      { h: 'Timing: When Reputation and Opportunity Arrive', ps: [
        'A ten-year cycle with Hua Ke in Life is a "becoming known" decade — credentials, publications, promotion, industry reputation. Good for study and certification.',
        'An annual Hua Ke entering Life brings benefactor and exam luck — interviews, defenses, applications, publishing. You make an excellent impression this year.',
        'An annual Hua Ji opposing Life brings reputation risk — misunderstanding, criticism, exam failure. Keep a low profile; don\'t chase fame this year.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Life Palace:'], ol: [
        'Which star transforms? Tian Liang = word-of-mouth, Wen Chang = literary fame, Tai Yin = quiet distinction, Wu Qu = professional reputation.',
        'Check Chang Qu — with them, reputation is backed by learning.',
        'Check Hua Quan/Hua Lu — Quan+Ke = name and position, Lu+Ke = name and income.',
        'Check malefics: Kong Jie = hollow name, Qing Yang = damaged reputation, Tuo Luo = slow recognition.',
        'Benefactors come from "I heard good things about you."',
        'Timing: decade Ke = recognition, annual Ke = opportunity, annual Ji opposition = reputation crisis.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-minggong.html', text: 'The Life Palace' },
      { href: 'ziwei-minggong-hualu.html', text: 'Life Palace Hua Lu' },
      { href: 'ziwei-minggong-huaquan-zhujian-haishi-guquan.html', text: 'Life Palace Hua Quan' },
      { href: 'ziwei-huake.html', text: 'Hua Ke Overview' },
      { href: 'ziwei-sanfang-sizheng.html', text: 'Triple Combinations' }
    ]
  },
  {
    slug: 'ziwei-xiongdigong-huake',
    cnTitle: '紫微斗数兄弟宫化科：兄弟姐妹有口碑，平辈关系中的体面',
    enTitle: 'Siblings Palace With Hua Ke: Reputation Among Peers',
    cnDesc: '兄弟宫化科，兄弟姐妹有出息、名声好，你跟平辈的关系也比较体面。但化科在兄弟宫也主「比较」——兄弟姐妹太好，你可能活在他们的影子里。',
    enDesc: 'Hua Ke in the Siblings Palace means accomplished, well-regarded siblings and decent peer relationships. But it can also mean comparison — living in a sibling\'s shadow.',
    cnLead: '兄弟宫化科的人，兄弟姐妹通常有出息——学历好、工作体面、在亲戚中口碑不错。你跟兄弟姐妹的关系也比较客气、有分寸，不像化禄那样亲密无间，也不像化忌那样互相消耗。但化科在兄弟宫有一个隐忧：如果兄弟姐妹太优秀，你可能从小被拿来比较——「你看看你哥/你姐」。',
    cnIntro2: '兄弟宫看兄弟姐妹、平辈关系、同事和合作伙伴。化科在这个宫位，你的平辈圈子整体素质不错——认识的人多是有正经职业、有口碑的人。但「体面」和「亲密」是两回事。',
    cnSections: [
      { h: '兄弟姐妹有出息', ps: [
        '兄弟宫化科，兄弟姐妹中可能有人学历高、工作好、或者在某个领域小有名气。化科主名声，所以他们的「出息」更多是口碑型的——不是大富大贵，而是「说出去好听」。',
        '如果兄弟宫化科加昌曲，兄弟姐妹可能靠读书出头——老师、医生、公务员、研究员这类「有文化」的职业。加化禄，兄弟姐妹不仅有名还有利。',
        '如果你是独生子女，兄弟宫看你的平辈关系——堂表兄弟姐妹、同学、同事。化科在兄弟宫，你的平辈圈子整体「体面」。'
      ]},
      { h: '平辈关系中的分寸感', ps: [
        '化科在兄弟宫，你跟兄弟姐妹的关系是「客气型」的——互相尊重、有来有往，但不一定掏心掏肺。这种关系在成年后反而稳定——没有化禄那种不分你我，也没有化忌那种互相拖累。',
        '在同事关系上，化科在兄弟宫主你跟同事相处得体——不站队、不八卦、口碑好。你可能不是跟同事关系最近的那个，但大家提起你都说「人不错」。',
        '在合作关系上，化科主「体面的合作」——合同清楚、分工明确、好聚好散。如果你做生意，兄弟宫化科的人适合跟「有专业身份」的人合作——律师、会计师、顾问这类。'
      ]},
      { h: '比较的阴影', ps: [
        '化科在兄弟宫最大的课题，是「比较」。如果兄弟姐妹比你优秀，父母可能从小拿你跟他们比——这种比较不因为你长大了就消失，它可能内化成你对自己的评价。',
        '举个组合：兄弟宫太阳化科，命宫天同。太阳是光明星，化科是名声——兄弟姐妹（尤其哥哥）可能很优秀、很出风头；天同是享受星，命宫天同的人性格温和、不争——你可能一辈子都在被跟「优秀的哥哥」比。',
        '解法不是跟兄弟姐妹比，而是找到自己的赛道。化科在兄弟宫的人，适合走「差异化」路线——兄弟姐妹做金融，你做艺术；兄弟姐妹走仕途，你做生意。不在同一个赛道，就没有比较。'
      ]},
      { h: '流年引动：平辈关系什么时候动', ps: [
        '第一种：大限兄弟宫化科。这十年平辈关系好——可能认识有层次的朋友、跟同事相处融洽、或者兄弟姐妹有喜事。这十年适合拓展人脉，但化科的人脉是「君子之交」，不是酒肉朋友。',
        '第二种：流年化科入兄弟。这一年兄弟姐妹或平辈中有好事——升职、结婚、考上、出名。也可能是你通过平辈获得机会——同学介绍工作、同事推荐项目。',
        '第三种：流年化忌冲兄弟。这一年平辈关系有麻烦——跟同事闹矛盾、合作出问题、或者兄弟姐妹有事需要你帮忙。这种年份不宜合伙，合同要格外清楚。'
      ]},
      { h: '排盘后的使用顺序', ps: ['兄弟宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——太阳化科主兄弟出色，天梁化科主兄弟年长有口碑，文昌化科主兄弟读书好，太阴化科主姐妹有清名。',
        '看有无昌曲——有昌曲，兄弟姐妹靠读书或专业出头。',
        '看有无化禄或化权——有禄，兄弟姐妹有名有利；有权，兄弟姐妹有地位。',
        '看自己的感受：你是为兄弟姐妹骄傲，还是活在比较中？',
        '看同事和合作运：化科在兄弟宫，平辈关系整体体面。',
        '流年分三种：大限科主十年人脉，流年科主当年平辈好事，流年忌冲主平辈矛盾。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-xiongdigong.html', text: '兄弟宫怎么看' },
      { href: 'ziwei-xiongdigong-hualu-guiren-yikao.html', text: '兄弟宫化禄' },
      { href: 'ziwei-xiongdigong-huaquan.html', text: '兄弟宫化权' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' },
      { href: 'ziwei-jiaoyougong.html', text: '交友宫怎么看' }
    ],
    enLead: 'With Hua Ke in the Siblings Palace, your siblings tend to be accomplished — well-educated, respectable, well-spoken-of among relatives. Your relationship with them is polite and measured, not as close as Hua Lu or as draining as Hua Ji. But there\'s a hidden issue: if a sibling shines too brightly, you may grow up compared to them — "why can\'t you be more like your brother/sister?"',
    enIntro2: 'The Siblings Palace covers siblings, peers, colleagues, and partners. Hua Ke here means your peer circle is generally decent — people with proper professions and good reputations. But decency and intimacy are different things.',
    enSections: [
      { h: 'Accomplished Siblings', ps: [
        'A sibling may have strong credentials, a good job, or a name in a field. Hua Ke\'s success is reputation-type — not necessarily wealthy, but "sounds good when mentioned."',
        'With Chang Qu, siblings may advance through education — teachers, doctors, civil servants, researchers. With Hua Lu, they have both name and means.',
        'If you\'re an only child, this palace describes peers — cousins, classmates, colleagues — and your circle is generally respectable.'
      ]},
      { h: 'Measured Peer Relationships', ps: [
        'Your sibling relationships are polite — mutual respect, reciprocity, but not necessarily heart-to-heart. This tends to be stable in adulthood.',
        'With colleagues, you\'re tactful — no factions, no gossip, good reputation. Not the closest to everyone, but everyone says you\'re good people.',
        'In partnerships, Hua Ke means proper collaborations — clear contracts, defined roles, clean endings. Good partners are professionals — lawyers, accountants, consultants.'
      ]},
      { h: 'The Shadow of Comparison', ps: [
        'The biggest issue is comparison. If a sibling outshines you, parents may compare you from childhood, and that voice can internalize.',
        'Example: Tai Yang Hua Ke in Siblings with Tian Tong in Life. The sibling (especially older brother) is bright and prominent; you\'re gentle and non-competitive — and compared to him forever.',
        'The answer isn\'t competing but finding your own lane. Differentiate — if they\'re in finance, you\'re in arts; if they\'re in government, you\'re in business. No shared track, no comparison.'
      ]},
      { h: 'Timing: When Peer Relationships Move', ps: [
        'A ten-year cycle with Hua Ke in Siblings brings good peer relationships — quality friends, harmonious colleagues, sibling celebrations. Networking is fruitful, but these are "gentleman\'s friendships," not drinking buddies.',
        'An annual Hua Ke entering Siblings brings good news for a peer — promotion, marriage, exam success — or an opportunity through a peer.',
        'An annual Hua Ji opposing Siblings brings peer conflict — colleague disputes, partnership problems, a sibling needing help. Don\'t start a partnership this year; get contracts airtight.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Siblings Palace:'], ol: [
        'Which star transforms? Tai Yang = standout sibling, Tian Liang = older respected sibling, Wen Chang = academic sibling, Tai Yin = quietly distinguished sister.',
        'Check Chang Qu — siblings advance through study or profession.',
        'Check Hua Lu/Hua Quan — with Lu, name and means; with Quan, status.',
        'Your own feeling: proud of siblings, or living in their shadow?',
        'Colleague and partnership luck — generally decent.',
        'Timing: decade Ke = network, annual Ke = peer good news, annual Ji opposition = peer conflict.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-xiongdigong.html', text: 'The Siblings Palace' },
      { href: 'ziwei-xiongdigong-hualu-guiren-yikao.html', text: 'Siblings Palace Hua Lu' },
      { href: 'ziwei-xiongdigong-huaquan.html', text: 'Siblings Palace Hua Quan' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' },
      { href: 'ziwei-jiaoyougong.html', text: 'The Friends Palace' }
    ]
  },
  {
    slug: 'ziwei-fuqigong-huake',
    cnTitle: '紫微斗数夫妻宫化科：另一半条件好，是体面还是距离',
    enTitle: 'Spouse Palace With Hua Ke: A Presentable Partner — or a Distant One?',
    cnDesc: '夫妻宫化科，另一半条件好、有气质、名声不错。但化科的「体面」也可能变成「客气」——两个人相敬如宾，却少了亲密。',
    enDesc: 'Hua Ke in the Spouse Palace means a partner with good credentials, presence, and reputation. But that polish can also mean politeness replacing intimacy.',
    cnLead: '夫妻宫化科的人，通常能找到条件不错的另一半——学历、工作、长相、家庭，至少有一样是「拿得出手」的。对方给人的印象也好——得体、有教养、带出去有面子。但化科在夫妻宫有一个微妙的问题：太体面了，反而不够亲密。两个人像合作伙伴多过像情侣，相敬如「宾」——宾是客人的那个宾。',
    cnIntro2: '夫妻宫看婚姻、伴侣和亲密关系。化科落在这个宫位，另一半是「有口碑」的人——别人提起你的对象都说不错。但婚姻不是给别人看的，关起门来亲不亲密，只有你们自己知道。',
    cnSections: [
      { h: '另一半条件好', ps: [
        '夫妻宫化科，另一半通常有「科名」——可能学历高、有专业资格、在某个领域有口碑。太阴化科，另一半气质清雅；文昌化科，另一半有文才；天梁化科，另一半老成持重。',
        '对方的家庭背景通常也不错——不一定大富大贵，但「门风正」、父母有正经职业、亲戚关系简单。',
        '化科加化禄，另一半条件好且愿意为你花钱——这是最好的组合之一，有名有利有感情。化科加化权，另一半有地位但也强势——你可能既享受对方带来的体面，又感到被压。'
      ]},
      { h: '体面和亲密的矛盾', ps: [
        '化科在夫妻宫最大的课题，是「客气」。你们可能很少吵架——不是没有矛盾，而是两个人都太要面子、太有教养，吵不起来。矛盾被「体面」盖住了，但没有消失。',
        '这种夫妻在外面看起来特别般配——金童玉女、门当户对。但回到家可能各玩各的手机，一天说不了几句真心话。化科的「距离感」在婚姻里是双刃剑：它让你们互相尊重，但也让你们难以真正靠近。',
        '举个组合：夫妻宫天同化科加天福。天同是温和星，化科是体面，天福是福气——另一半脾气好、条件好、对你也不错，但你们的关系像一杯温水——不烫不冰，喝着舒服，但总觉得少了点什么。'
      ]},
      { h: '怎么让体面不变成距离', ps: [
        '第一，学会「不体面」地沟通。化科在夫妻宫的人，习惯了在对方面前保持形象——难过了不说、生气了讲理、需要安慰时硬撑。但亲密关系需要你暴露脆弱，而不是永远得体。',
        '第二，创造「不体面」的共处时间——一起做饭弄脏厨房、旅行时迷路、运动时出汗出到丑。这些「不体面」的时刻，反而比烛光晚餐更能拉近距离。',
        '第三，如果夫妻宫化科加煞星（尤其擎羊、火星），「体面」可能变成「冷战」——不吵但也不理，用沉默惩罚对方。这种模式比吵架更伤关系，因为吵架至少还在沟通。'
      ]},
      { h: '流年引动：感情什么时候动', ps: [
        '第一种：大限夫妻宫化科。这十年感情或婚姻比较「体面」——可能遇到条件好的对象、婚姻关系稳定、或者另一半在这十年出名/升职。但也要注意不要让体面变成距离。',
        '第二种：流年化科入夫妻。这一年有机会认识条件不错的对象——可能通过正式场合（工作、学习、介绍），不是酒吧那种随意的场合。已婚者这一年另一半有好事。',
        '第三种：流年化忌冲夫妻。这一年感情有考验——误会、冷战、或者外人的议论影响你们的关系。化科在夫妻宫的人，最怕「别人说什么」——流年忌冲时，不要让外人的嘴影响你们的关系。'
      ]},
      { h: '排盘后的使用顺序', ps: ['夫妻宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——太阴主清雅，文昌主文才，天梁主稳重，太阳主光明正派。',
        '看有无化禄或化权——有禄，条件好且大方；有权，有地位但强势。',
        '看煞星：擎羊火铃主冷战，陀罗主拖延，空劫主缘分飘忽。',
        '看亲密模式：你们是相敬如宾还是相敬如冰？',
        '对宫官禄宫也要看——婚姻和事业互相影响。',
        '流年分三种：大限科主十年感情体面，流年科主当年遇到好对象，流年忌冲主感情考验。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-fuqigong.html', text: '夫妻宫怎么看' },
      { href: 'ziwei-fuqigong-huaquan.html', text: '夫妻宫化权' },
      { href: 'ziwei-fuqigong-liantan-congre-dao-lei.html', text: '夫妻宫廉贞贪狼' },
      { href: 'ziwei-guanlugong.html', text: '官禄宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'With Hua Ke in the Spouse Palace, you tend to find a partner with good credentials — education, job, looks, or family background, at least one of which is presentable. They make a good impression — polished, cultivated, nice to bring to events. But there\'s a subtle problem: too much polish, not enough intimacy. You can feel more like business partners than lovers — respectful as guests, with "guest" being the operative word.',
    enIntro2: 'The Spouse Palace covers marriage, partners, and intimacy. Hua Ke here means a partner with a good reputation — everyone says you did well. But marriage isn\'t a show; how close you are behind closed doors only you know.',
    enSections: [
      { h: 'A Partner With Good Credentials', ps: [
        'Your partner typically has credentials — degrees, certifications, a name in a field. Tai Yin Hua Ke = refined presence; Wen Chang Hua Ke = literary talent; Tian Liang Hua Ke = mature and steady.',
        'Their family background is usually decent — not necessarily wealthy, but proper, with respectable parents and uncomplicated relatives.',
        'With Hua Lu, your partner has means and is generous — one of the best combinations. With Hua Quan, they have status but also strength — you enjoy the prestige and feel the pressure.'
      ]},
      { h: 'Polish vs. Intimacy', ps: [
        'The biggest issue is politeness. You rarely fight — not because there are no conflicts, but because you\'re both too dignified to have them. Conflicts get papered over with decency but don\'t disappear.',
        'You look perfect together. At home you may scroll separate phones and barely exchange a real sentence all evening. Hua Ke\'s distance cuts both ways: mutual respect, but difficulty truly connecting.',
        'Example: Tian Tong Hua Ke with Tian Fu in Spouse. Good-natured, well-qualified, treats you well — but the relationship is lukewarm water. Comfortable, but missing something.'
      ]},
      { h: 'Keeping Polish From Becoming Distance', ps: [
        'Learn to communicate "unpresentably." You\'re used to maintaining image — sad but silent, angry but reasonable, needing comfort but toughing it out. Intimacy requires showing vulnerability, not perpetual composure.',
        'Create unpresentable time together — messy cooking, getting lost while traveling, ugly sweating during exercise. These moments bond more than candlelit dinners.',
        'With malefics (especially Qing Yang/Huo Xing), polish can become cold war — not fighting but not speaking, punishing with silence. This damages a relationship more than arguing, because at least arguing is communication.'
      ]},
      { h: 'Timing: When Relationships Move', ps: [
        'A ten-year cycle with Hua Ke in Spouse brings a "presentable" relationship decade — meeting a qualified partner, stable marriage, or a partner\'s promotion. Watch for polish becoming distance.',
        'An annual Hua Ke entering Spouse brings a chance to meet someone through formal settings — work, study, introductions. For married people, good news for the partner.',
        'An annual Hua Ji opposing Spouse brings tests — misunderstandings, cold war, or outside gossip affecting you. Don\'t let other people\'s opinions drive your relationship.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Spouse Palace:'], ol: [
        'Which star transforms? Tai Yin = refined, Wen Chang = literary, Tian Liang = steady, Tai Yang = upright.',
        'Check Hua Lu/Hua Quan — with Lu, generous and well-off; with Quan, high-status but strong.',
        'Check malefics: Qing Yang/Huo Xing = cold war, Tuo Luo = delay, Kong Jie = elusive connection.',
        'Intimacy pattern: respectful as guests or cold as ice?',
        'Read the opposite Career Palace — marriage and work affect each other.',
        'Timing: decade Ke = presentable relationship, annual Ke = meeting someone good, annual Ji opposition = test.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-fuqigong.html', text: 'The Spouse Palace' },
      { href: 'ziwei-fuqigong-huaquan.html', text: 'Spouse Palace Hua Quan' },
      { href: 'ziwei-fuqigong-liantan-congre-dao-lei.html', text: 'Spouse Palace Lian Zhen Tan Lang' },
      { href: 'ziwei-guanlugong.html', text: 'The Career Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-zinvgong-huake',
    cnTitle: '紫微斗数子女宫化科：孩子有出息，合伙有名声',
    enTitle: 'Children Palace With Hua Ke: Accomplished Kids, Reputable Partnerships',
    cnDesc: '子女宫化科，孩子有出息、读书好，合伙关系也比较体面。但化科在子女宫也主「对孩子的期待高」——期待是动力还是压力，要看你怎么把握。',
    enDesc: 'Hua Ke in the Children Palace means accomplished, studious children and respectable partnerships. But it also means high expectations — motivation or pressure depending on how you handle them.',
    cnLead: '子女宫化科的人，孩子通常读书不错、听话、在学校有口碑。老师提起你家孩子会说「挺乖的、成绩好」。子女宫也看合伙关系，化科在这里，合伙人通常有专业身份、合作过程比较规范。但化科在子女宫有一个课题：你对孩子的期待可能比较高——「你是哥哥/姐姐要做榜样」「妈妈当年没条件，你要争气」。期待可以是动力，也可以是压力。',
    cnIntro2: '子女宫看子女、晚辈、合伙人和「作品」（你创造出来的东西）。化科落在这个宫位，你的「产出」通常有口碑——孩子有出息、合伙有名声、作品被认可。但「有口碑」和「被接纳」是两回事。',
    cnSections: [
      { h: '孩子有出息', ps: [
        '子女宫化科，孩子通常在学业或才艺上有表现——不一定是天才，但「拿得出手」。化科主科甲，孩子的考试运、学习态度通常让你省心。',
        '化科加昌曲，孩子读书好、有文才——可能是学霸、或者在写作、语言、艺术方面有特长。加化禄，孩子不仅学习好，将来赚钱也不错。加化权，孩子有主见、有领导力，但也可能比较叛逆。',
        '如果子女宫是空宫，借对宫田宅宫的星曜来读。空宫不代表没有孩子或孩子没出息——借过来的星曜决定了孩子以什么方式「有口碑」。'
      ]},
      { h: '高期待的两面', ps: [
        '化科在子女宫的人，对孩子有「体面」的期待——希望孩子成绩好、有礼貌、上得了台面。这种期待本身不是坏事，但如果孩子的气质跟你的期待不一致，就会出问题。',
        '举个组合：子女宫太阳化科，命宫天梁。太阳主光明和表现，化科主名声——你希望孩子出风头、争第一；天梁主道德和管教——你对孩子的要求既高又严。如果孩子性格内向（比如天同太阴型），你的期待会变成他的压力。',
        '最好的状态是：给孩子好的教育资源（化科的正面），但不把自己的面子绑在孩子身上（化科的负面）。孩子的口碑是他自己的，不是你的奖状。'
      ]},
      { h: '合伙和晚辈关系', ps: [
        '子女宫也看合伙人。化科在子女宫，合伙人通常有专业背景或好口碑——可能是律师、会计师、设计师、顾问这类「有身份」的人。合作过程比较规范，合同清楚。',
        '在晚辈关系上，化科主你带的人「有样学样」——你做什么他们学什么，你的口碑会传给他们。如果你是老师或主管，子女宫化科的人能带出不错的学生或下属。',
        '子女宫也看「作品」——你写的书、做的项目、创造的东西。化科在这里，你的作品容易被认可、有口碑。但化科不主大卖——大卖看化禄，化科主的是「叫好」。'
      ]},
      { h: '流年引动：孩子和合伙什么时候动', ps: [
        '第一种：大限子女宫化科。这十年孩子有出息——可能考上好学校、得奖、或者特别让你省心。也可能是这十年合伙关系好、作品被认可。',
        '第二种：流年化科入子女。这一年孩子有好事——考试顺利、得奖、当干部。也可能是你通过合伙或晚辈获得机会。想要孩子的人，这一年也适合备孕。',
        '第三种：流年化忌冲子女。这一年孩子让人操心——成绩下滑、生病、叛逆。也可能是合伙出问题、作品被批评。这种年份对孩子多陪伴少指责，合伙的事缓一缓。'
      ]},
      { h: '排盘后的使用顺序', ps: ['子女宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——太阳化科主孩子出色，天同化科主孩子温和有福气，文昌化科主孩子读书好，太阴化科主女儿有清名。',
        '看有无昌曲——有昌曲，孩子学业好、有才艺。',
        '看有无化禄或化权——有禄，孩子将来有财；有权，孩子有主见但也可能叛逆。',
        '看自己的期待：你是在支持孩子还是在满足自己的面子？',
        '看合伙和作品运：化科在子女宫，合伙体面、作品叫好。',
        '流年分三种：大限科主十年子女运，流年科主当年孩子好事，流年忌冲主孩子操心。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-zinvgong.html', text: '子女宫怎么看' },
      { href: 'ziwei-zinvgong-hualu.html', text: '子女宫化禄' },
      { href: 'ziwei-zinvgong-tianliang-huaquan.html', text: '子女宫天梁化权' },
      { href: 'ziwei-tianzhaigong.html', text: '田宅宫怎么看' },
      { href: 'ziwei-palaces.html', text: '十二宫位总览' }
    ],
    enLead: 'With Hua Ke in the Children Palace, kids tend to do well academically, behave, and have a good reputation at school. Teachers describe them as "good kids, good grades." This palace also covers partnerships, and Hua Ke here means partners with professional standing and proper collaborations. But there\'s a challenge: your expectations for your children may run high. Expectations can motivate or crush, depending on how you hold them.',
    enIntro2: 'The Children Palace covers children, juniors, partners, and your "creations" — things you bring into the world. Hua Ke here means your outputs tend to be well-regarded. But being well-regarded and being accepted are different.',
    enSections: [
      { h: 'Accomplished Children', ps: [
        'Kids tend to perform in academics or talents — not necessarily prodigies, but presentable. Hua Ke governs exam luck; children generally don\'t cause worry around school.',
        'With Chang Qu, strong academics or literary/artistic talent. With Hua Lu, they do well and earn well later. With Hua Quan, they\'re independent leaders but may rebel.',
        'If the palace is empty, borrow the opposite Property Palace stars. An empty palace doesn\'t mean childless or unsuccessful children.'
      ]},
      { h: 'High Expectations Cut Both Ways', ps: [
        'You want children who are presentable — good grades, polite, socially smooth. This isn\'t bad in itself, but problems arise if the child\'s nature doesn\'t match your expectations.',
        'Example: Tai Yang Hua Ke in Children with Tian Liang in Life. You want the child to shine and lead; you\'re also strict and moralistic. If the child is naturally introverted, your expectations become pressure.',
        'The best approach: provide educational resources (the positive side) without tying your own face to the child\'s performance (the negative side). Their reputation is theirs, not your trophy.'
      ]},
      { h: 'Partnerships and Juniors', ps: [
        'Partners tend to have professional backgrounds or good reputations — lawyers, accountants, designers, consultants. Collaborations are proper with clear contracts.',
        'With juniors, you lead by example; your reputation transfers to them. As a teacher or manager, you produce good students or subordinates.',
        'This palace also covers your creations — books, projects, products. Hua Ke means critical recognition, not necessarily big sales (that\'s Hua Lu).'
      ]},
      { h: 'Timing: When Kids and Partnerships Move', ps: [
        'A ten-year cycle with Hua Ke in Children brings a decade of children doing well — good schools, awards, easy to raise. Also good partnerships and recognized work.',
        'An annual Hua Ke entering Children brings good news for a child — exams, awards, leadership. Or opportunity through a partner/junior. Also a good year for those trying to conceive.',
        'An annual Hua Ji opposing Children brings worry — grades, health, rebellion. Or partnership problems and criticized work. Spend more time with kids, less blame; pause partnerships.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Children Palace:'], ol: [
        'Which star transforms? Tai Yang = standout child, Tian Tong = gentle fortunate child, Wen Chang = academic child, Tai Yin = quietly accomplished daughter.',
        'Check Chang Qu — academic or artistic talent.',
        'Check Hua Lu/Hua Quan — with Lu, future wealth; with Quan, independence or rebellion.',
        'Your expectations: supporting the child or satisfying your own face?',
        'Partnerships and creations — respectable, well-reviewed.',
        'Timing: decade Ke = children\'s decade, annual Ke = good news year, annual Ji opposition = worry year.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-zinvgong.html', text: 'The Children Palace' },
      { href: 'ziwei-zinvgong-hualu.html', text: 'Children Palace Hua Lu' },
      { href: 'ziwei-zinvgong-tianliang-huaquan.html', text: 'Children Palace Tian Liang Hua Quan' },
      { href: 'ziwei-tianzhaigong.html', text: 'The Property Palace' },
      { href: 'ziwei-palaces.html', text: 'All Twelve Palaces' }
    ]
  },
  {
    slug: 'ziwei-caibogong-huake',
    cnTitle: '紫微斗数财帛宫化科：靠专业赚钱，收入稳但发不了大财？',
    enTitle: 'Wealth Palace With Hua Ke: Earning Through Expertise — Stable but Not Spectacular?',
    cnDesc: '财帛宫化科，收入来自专业名声和口碑——稳、体面、可持续。但化科不主暴富，想发大财要看有没有禄来配。',
    enDesc: 'Hua Ke in the Wealth Palace means income from professional reputation — steady, respectable, sustainable. It doesn\'t promise windfalls; for that you need Lu.',
    cnLead: '财帛宫化科的人，赚钱方式跟「专业」和「口碑」绑在一起。你可能是医生、律师、会计师、设计师、老师、顾问——靠一门手艺或专业资格吃饭，收入不一定大富大贵，但稳定、体面、越老越值钱。化科在财帛宫的人，不太可能一夜暴富，但也不容易一夜返贫。',
    cnIntro2: '化科主名，化禄主利。财帛宫化科，钱是跟着名来的——你先有专业口碑，钱自然来找你。这跟化禄在财帛「钱直接来」不同，也跟化权在财帛「主动去抓钱」不同。化科的赚钱节奏是慢的、稳的、长期的。',
    cnSections: [
      { h: '靠专业赚钱', ps: [
        '财帛宫化科，你的收入跟「你是谁」「你会什么」直接相关。别人找你是因为你的专业能力——你看过的案例、你考过的证、你在行业内的口碑。这种钱赚得有尊严，因为你不是靠关系或运气，而是靠真本事。',
        '化科加昌曲，最典型的「专业人士」组合——靠知识和技术赚钱，越专业越值钱。文昌化科在财帛，可能靠写作、教育、考试相关行业赚钱；文曲化科，可能靠艺术、口才、策划赚钱。',
        '化科加天梁，适合做「越老越吃香」的行业——医生、律师、会计师、咨询师。天梁主长寿和经验，化科主口碑，这种组合的人前期可能赚得不多，但四五十岁后收入稳定且受人尊重。'
      ]},
      { h: '稳但不暴富', ps: [
        '化科在财帛宫的人，要接受一个事实：你不太可能一夜暴富。化科的钱是「细水长流」型的——月薪、顾问费、课时费、版税，都是一笔一笔来的，不是一笔大的。',
        '但「不暴富」不等于「赚不到钱」。化科加化禄或禄存，专业名声能转化为实实在在的收入——你可能不是最有钱的，但在同行业中收入中上，而且稳定。',
        '化科加空劫，要小心「叫好不叫座」——你的专业能力被认可，但赚不到大钱。可能是在非营利机构、学术圈、或者行业本身利润薄。这种组合的人，如果想提高收入，需要把专业能力产品化——写书、做课程、开公司，让一份时间卖多次。'
      ]},
      { h: '花钱的体面', ps: [
        '财帛宫化科的人，花钱也「体面」——注重品质、不买假货、愿意为专业服务付费。你可能不奢侈，但消费有品位。',
        '这种人也容易在「面子消费」上花钱——为了维持专业形象而买好车、好表、好衣服。这些消费有些是必要的（见客户确实需要体面），有些是不必要的（为了别人的眼光而买）。',
        '化科在财帛的人，理财偏保守——不喜欢高风险投资，更愿意买房、存定期、买国债。这种保守让你不会大亏，但也可能跑不赢通胀。适当配置一些权益类资产，是化科在财帛的人需要学习的。'
      ]},
      { h: '流年引动：钱什么时候来', ps: [
        '第一种：大限财帛宫化科。这十年收入稳定增长——可能升职加薪、拿到重要资格、或者在行业内建立口碑。这十年不适合投机，适合投资自己——考证、读学位、积累作品。',
        '第二种：流年化科入财帛。这一年有「名带来利」的机会——可能因为一个项目被认可而加薪、因为一篇文章而有客户找来、因为考过一个证而收入跳一级。',
        '第三种：流年化忌冲财帛。这一年收入可能受影响——降薪、客户流失、投资亏损。但化科在财帛的人，即使在差年份也不会太差——因为你的专业能力还在，口碑还在，只是暂时少赚一点。'
      ]},
      { h: '排盘后的使用顺序', ps: ['财帛宫看到化科，按这个顺序读：'], ol: [
        '先看什么星化科——武曲化科主财务专业，太阴化科主靠细致赚钱，天梁化科主经验赚钱，文昌化科主文才赚钱。',
        '看有无化禄或禄存——有禄，名声能变现；无禄，叫好不叫座。',
        '看昌曲——有昌曲，专业能力强，靠技术吃饭。',
        '看煞星：空劫主收入不稳，擎羊主因专业纠纷破财，陀罗主赚钱慢。',
        '看花钱模式：你是为品质花钱还是为面子花钱？',
        '流年分三种：大限科主十年稳定增收，流年科主当年名带来利，流年忌冲主收入暂时下降。'
      ]}
    ],
    cnSidebar: [
      { href: 'ziwei-four-transformations.html', text: '四化科权禄忌专题' },
      { href: 'ziwei-caibogong.html', text: '财帛宫怎么看' },
      { href: 'ziwei-caibogong-hualu.html', text: '财帛宫化禄' },
      { href: 'ziwei-caibogong-huaquan', text: '财帛宫化权' },
      { href: 'ziwei-huake-caibo-zhuanye.html', text: '化科坐财帛靠专业' },
      { href: 'ziwei-fudegong.html', text: '福德宫怎么看' }
    ],
    enLead: 'With Hua Ke in the Wealth Palace, your earning is tied to expertise and reputation. You might be a doctor, lawyer, accountant, designer, teacher, or consultant — earning from a craft or credential. The income may not make you rich overnight, but it\'s steady, respectable, and grows with age. You\'re unlikely to strike it rich suddenly, but also unlikely to go broke suddenly.',
    enIntro2: 'Hua Ke governs name; Hua Lu governs profit. With Hua Ke in Wealth, money follows reputation — you build professional standing first, and money comes to you. The earning rhythm is slow, steady, and long-term.',
    enSections: [
      { h: 'Earning Through Expertise', ps: [
        'Your income connects directly to who you are and what you know. People hire you for your competence — cases you\'ve handled, credentials you\'ve earned, your reputation in the field. This money has dignity; it comes from real ability, not luck or connections.',
        'With Chang Qu, it\'s the classic professional combination — knowledge and technology earn more as you specialize. Wen Chang Hua Ke may earn through writing, education, or exams; Wen Qu Hua Ke through art, speaking, or planning.',
        'With Tian Liang, you\'re in an "older is better" field — medicine, law, accounting, consulting. Early years may pay modestly, but by your forties and fifties income is stable and respected.'
      ]},
      { h: 'Steady, Not Spectacular', ps: [
        'Accept it: you probably won\'t get rich overnight. Hua Ke money flows steadily — salary, consulting fees, teaching fees, royalties — one payment at a time, not one windfall.',
        'But not spectacular doesn\'t mean not well-paid. With Hua Lu or Lu Cun, reputation converts to solid income — upper-middle range in your field, and stable.',
        'With Kong Jie, beware critical acclaim without commercial success — recognized expertise but thin earnings, perhaps in nonprofits or academia. Productize your expertise — books, courses, companies — to sell your time multiple times.'
      ]},
      { h: 'Respectable Spending', ps: [
        'You spend with taste — quality over quantity, no fakes, willing to pay for professional services. Not luxurious, but discerning.',
        'Watch "face spending" — nice car, watch, clothes to maintain a professional image. Some is necessary for clients; some is just for other people\'s eyes.',
        'You invest conservatively — property, deposits, bonds. This prevents big losses but may underperform inflation. Learning to allocate some to growth assets is a needed skill.'
      ]},
      { h: 'Timing: When Money Comes', ps: [
        'A ten-year cycle with Hua Ke in Wealth brings steady income growth — promotion, credentials, reputation. Don\'t speculate; invest in yourself — certifications, degrees, body of work.',
        'An annual Hua Ke entering Wealth brings name-to-money opportunity — a recognized project leads to a raise, an article brings clients, a certification bumps your rate.',
        'An annual Hua Ji opposing Wealth may reduce income — pay cut, lost clients, investment dip. But with Hua Ke in Wealth, even bad years aren\'t catastrophic — your expertise and reputation remain.'
      ]},
      { h: 'Reading Order After You Cast the Chart', ps: ['When you see Hua Ke in the Wealth Palace:'], ol: [
        'Which star transforms? Wu Qu = financial expertise, Tai Yin = meticulous earning, Tian Liang = experience-based, Wen Chang = literary/educational.',
        'Check Hua Lu/Lu Cun — with Lu, reputation monetizes; without, acclaim without income.',
        'Check Chang Qu — strong technical expertise.',
        'Check malefics: Kong Jie = unstable income, Qing Yang = professional disputes cost money, Tuo Luo = slow earning.',
        'Spending pattern: quality or face?',
        'Timing: decade Ke = steady growth, annual Ke = name brings money, annual Ji opposition = temporary dip.'
      ]}
    ],
    enSidebar: [
      { href: 'ziwei-four-transformations.html', text: 'Four Transformations' },
      { href: 'ziwei-caibogong.html', text: 'The Wealth Palace' },
      { href: 'ziwei-caibogong-hualu.html', text: 'Wealth Palace Hua Lu' },
      { href: 'ziwei-caibogong-huaquan.html', text: 'Wealth Palace Hua Quan' },
      { href: 'ziwei-huake-caibo-zhuanye.html', text: 'Hua Ke in Wealth: Professional Income' },
      { href: 'ziwei-fudegong.html', text: 'The Mental Palace' }
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
          <p class="article-meta"><span>四化细读</span><span><time datetime="${date}">2026-08-12 10:45</time></span></p>
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
          <p class="article-meta"><span>Four Transformations</span><span><time datetime="${date}">2026-08-12 10:45</time></span></p>
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
