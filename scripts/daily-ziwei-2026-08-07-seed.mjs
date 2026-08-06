import { articles as august2Articles } from "./daily-ziwei-2026-08-02-seed.mjs";

const bySlug = new Map(august2Articles.map((article) => [article.slug, article]));

function pick(slug) {
  const article = bySlug.get(slug);
  if (!article) throw new Error(`Unknown base article: ${slug}`);
  return structuredClone(article);
}

function merge(baseValue, overrideValue) {
  if (Array.isArray(overrideValue)) return overrideValue;
  if (!overrideValue || typeof overrideValue !== "object") return overrideValue;
  const output = { ...(baseValue || {}) };
  for (const [key, value] of Object.entries(overrideValue)) {
    if (value && typeof value === "object" && !Array.isArray(value)) output[key] = merge(output[key], value);
    else output[key] = value;
  }
  return output;
}

function retitleSections(sections, headings) {
  return sections.map((section, index) => ({
    ...section,
    heading: headings[index] || section.heading,
  }));
}

function zhSections(baseArticle, headings) {
  return retitleSections(baseArticle.sections, headings);
}

function enSections(baseArticle, headings) {
  return retitleSections(baseArticle.english.sections, headings);
}

function searchConsole(reference, query, audience, decisionTrigger, whySeparate) {
  return { sourceType: "search-console", reference, query, audience, decisionTrigger, whySeparate };
}

function sitePerformance(reference, query, audience, decisionTrigger, whySeparate) {
  return { sourceType: "site-performance", reference, query, audience, decisionTrigger, whySeparate };
}

function remake(baseSlug, overrides) {
  const baseArticle = pick(baseSlug);
  return merge(baseArticle, overrides(baseArticle));
}

export const articles = [
  remake("ziwei-bankong-zhechi-pa-naduan-zhuanzhe", (baseArticle) => ({
    order: 1,
    slug: "ziwei-bankong-zhechi-huandao-diaosu",
    title: "紫微斗数半空折翅格为什么常在换轨时掉速：先分路线断点还是情绪断线",
    evidence: [
      "864-877",
      "1546-1547",
    ],
    userQuestion: "半空折翅格为什么不是一开始就差，反而常在换工作、换城市或换赛道时突然掉速？",
    userScenario: "用户前面几年并不算差，真正卡住反而发生在中途换轨、升不上去或情绪突然撑不住的时候，想知道半空折翅到底最怕哪一段。",
    coreIntent: "判断半空折翅格最常在哪种中途转折里掉速，并分清路线断点和情绪断线",
    directAnswer: "半空折翅怕的通常不是起点低，而是走到一半旧办法失效、新承接又没站稳。看盘时要先分这是岗位路线改写、平台换轨，还是情绪和内在线先断掉；若本命财官迁的承接本来就偏薄，中途一动就更容易把原本还能撑的结构掀开。",
    readerValue: "读完能把半空折翅从一句中年转折，拆成换轨、承接和情绪三条排查线，不再只会等一个笼统坏年份。",
    demandEvidence: searchConsole(
      "半空折翅格",
      "半空折翅格为什么常在换轨时突然掉速",
      "已经走过前半段、正卡在换岗位、换城市或换赛道的人",
      "用户准备继续换轨或收缩投入，想先分清问题是路线接不住还是内在线先断掉",
      "真实搜索词已经证明半空折翅格有需求，旧页侧重中年转折提示，这一篇专门回答为什么常在换轨节点掉速"
    ),
    points: [
      "大限代表十年发展背景，命宫先天好也要看十年大运能否让三方四正发挥，不能只凭本命吉星下结论。",
      "判断一个大限时仍需同时看财帛、官禄、迁移等三方四正，不能把本宫一亮就直接当成全盘顺。",
      "当年命宫若走到财帛、官禄、迁移或夫妻等不同本命宫位，主事件会跟着换线，好大限也不能代替当年落宫。",
      "太阴化忌在寅宫来冲命宫、三方四正又无吉星会时，原本还能撑住的结构更容易在转折段失速。",
    ],
    examples: [
      "例子一：大限科权禄会，当年命宫却走到本命财帛宫，而本命财帛宫原有化忌，事业平台仍在上升，当年更可能卡在回款、成本或合同，而不是整条事业线失败。",
      "例子二：命宫在申，对宫寅宫太阴化忌来冲，三方四正又无吉星会；路线一变，人就容易先在情绪、关系和节奏上一起失速。",
    ],
    openingParagraphs: [
      "很多人看到半空折翅，最怕的是一句“中年会摔”。可现实里更常见的，不是某天突然掉下来，而是路线走到一半开始失速。",
      "所以这类题不要先问会不会败，而要先问在哪个转折点接不住。换岗位、换平台、换城市，还是心里先断电，结论差很多。",
    ],
    sections: zhSections(baseArticle, [
      "先分是路线改写，还是情绪先断线",
      "换轨节点最容易把旧承接掀开",
      "能不能继续走，要看财官迁怎么接",
      "找到断点，才知道该收还是该转",
    ]),
    english: {
      title: "Why the Ban Kong Zhe Chi Pattern Often Slows Down During a Pivot",
      description: "Do not read Ban Kong Zhe Chi as instant failure. Check whether the real break appears in career redirection, platform change, or emotional depletion.",
      examples: [
        "Example 1: The natal Career and Travel structure has always been loosely connected. The real slowdown appears when a platform, city, or industry shift removes the old route that used to carry the chart holder.",
        "Example 2: The money and role line still functions, but the Inner-Life and Body indicators have been under pressure for too long. The visible break comes through exhaustion and inconsistency rather than a sudden loss of title.",
      ],
      openingParagraphs: [
        "Ban Kong Zhe Chi is often remembered as a warning about a later-life fall, but many people do not experience it as a dramatic collapse. They experience it as a route that stops carrying them halfway through a transition.",
        "That is why the better question is not simply whether the pattern is bad. The better question is where the structure stops holding: during a career pivot, a platform shift, a relocation, or an internal emotional break.",
      ],
      sections: [
        {
          heading: "The pattern often breaks at a handoff, not at the starting line",
          paragraphs: [
            "Ban Kong Zhe Chi usually becomes visible when an old method stops carrying the person into the next stage. The earlier stage may still look workable because the chart owner already knows the rules, the people, and the pace. Trouble begins when that familiar route no longer transfers cleanly into a new one.",
            "That is why the pattern is often felt during a pivot. A role change, a new city, a different platform, or a different relationship structure can expose a weak handoff that had been hidden while the person stayed on familiar ground.",
          ],
        },
        {
          heading: "A route break is different from emotional depletion",
          paragraphs: [
            "Some people slow down because the external route changes faster than their support structure can adapt. Others still have a workable route, but their recovery, patience, and steady output have already been worn down for too long.",
            "Example 1: The natal Career and Travel structure has always been loosely connected. The real slowdown appears when a platform, city, or industry shift removes the old route that used to carry the chart holder.",
          ],
        },
        {
          heading: "Career, wealth, and movement show where the slowdown lands",
          paragraphs: [
            "A useful reading keeps asking where the pressure becomes concrete. Does it first show up in role responsibility, cash timing, mobility, or close relationship strain? The answer changes the advice. A route problem needs a new receiving structure; an exhaustion problem needs space for recovery before another push.",
            "Example 2: The money and role line still functions, but the Inner-Life and Body indicators have been under pressure for too long. The visible break comes through exhaustion and inconsistency rather than a sudden loss of title.",
          ],
        },
        {
          heading: "Read the transition before naming the outcome",
          paragraphs: [
            "Ban Kong Zhe Chi is easiest to misuse when it is treated like a fixed sentence about failure. A stronger reading names the transition, the weak receiving point, and the cost of continuing without adjustment.",
            "Once the real break is located, the chart owner can choose the right move: shrink, recover, redirect, or change the route itself. That is far more useful than waiting for a vague prediction to prove itself.",
          ],
        },
      ],
      orderText: "Start with the natal line that is supposed to carry the next stage, then check whether the receiving path still exists after the pivot. Separate a route break from emotional depletion, and only then decide whether the right response is recovery, redirection, or a full change of platform.",
    },
  })),
  remake("ziwei-yourengong-buneng-zhiying-bieren", (baseArticle) => ({
    order: 2,
    slug: "ziwei-guanxigong-shiqing-huidao-ziji",
    title: "紫微斗数关系宫的事为什么最后还是会回到你身上：对方、互动和本人承担要分开",
    userQuestion: "为什么父母宫、夫妻宫、朋友宫这些关系宫，明明先说别人，最后事情还是会压回我身上？",
    userScenario: "用户读盘时经常被提醒这是对方宫位，可现实里长辈、伴侣、同事一动，自己也得签字、出钱、收尾或扛结果，想知道该怎么分层。",
    coreIntent: "解释关系宫为什么不能只算别人，并区分对方状态、互动模式和本人承担",
    directAnswer: "关系宫先标出对方角色没错，但事情不一定只停在对方身上。真正实用的读法，是把对方发生了什么、双方怎样互动、以及你因此接到什么任务分开看；否则就会把本来已经回到你身上的责任，误读成单纯别人的人生。",
    readerValue: "读完能把关系宫中的对方变化、互动压力和自己要承担的现实后果拆开，不再被一句‘这是别人的宫’带过。",
    demandEvidence: sitePerformance(
      "/articles/en/life-palace.html",
      "关系宫的事为什么最后还是会回到自己身上",
      "读到关系宫位时，发现现实任务已经回到自己身上的用户",
      "用户正在判断关系宫到底是在说对方变化，还是自己必须承接的后果",
      "life palace 等方法页已经证明角色阅读有需求，这一篇专门补关系宫为什么不会只停在别人身上"
    ),
    examples: baseArticle.examples,
    openingParagraphs: [
      "很多人读到父母宫、夫妻宫、朋友宫，第一反应就是这不是我的事。可现实往往刚好相反，对方一动，最先忙起来的就是你。",
      "所以关系宫不能只讲别人是谁，还要继续讲你因此要接什么。对方状态、互动模式和本人承担，本来就是三层不同的东西。",
    ],
    sections: zhSections(baseArticle, [
      "关系宫先标角色，不代表本人可以退出",
      "对方状态、互动模式和本人承担要分层",
      "很多任务会顺着关系线回到你身上",
      "先分归属，再谈吉凶和结果",
    ]),
    english: {
      title: "Why a Relationship Palace Still Sends the Consequence Back to You",
      description: "A relationship palace names another role first, but the real event often returns through shared obligation, interaction, and cleanup that lands on you.",
      examples: baseArticle.english.examples,
      openingParagraphs: [
        "Many readers see a Parents, Spouse, or Friends Palace and assume the event belongs only to someone else. In real life, the other person's movement often creates duties, costs, and decisions that land back on the chart owner.",
        "That is why relationship palaces need a layered reading. One layer describes the other person, one describes the interaction itself, and one describes what the chart owner must now carry.",
      ],
      sections: enSections(baseArticle, [
        "A people palace names a role before it excludes the self",
        "State, interaction, and burden belong to different layers",
        "Relationship movement often returns as your task",
        "Separate ownership before making the claim",
      ]),
    },
  })),
  remake("ziwei-liunian-qianyi-dongle-meibanjiia", (baseArticle) => ({
    order: 3,
    slug: "ziwei-liunian-qianyi-bubanjia-dongzai-nali",
    title: "紫微斗数流年迁移宫动了却没搬家：先分出差、换岗、换平台还是关系变动",
    userQuestion: "流年迁移宫动了，可我没搬家，这一年到底是动在工作、平台，还是人际关系上？",
    userScenario: "用户看到年度重点落在迁移宫，却一年都没真正搬走，只是岗位变了、客户变了、出差增多，想知道这种算不算迁移宫应事。",
    coreIntent: "判断迁移宫动了却没搬家时，现实主线更可能落在哪种变化上",
    directAnswer: "迁移宫动不等于必须搬家。它更常先把外部环境、平台接口、跑动频率和对外关系推上台前；若没有真实搬迁，便要继续分出差、换岗、换平台、客户更替甚至关系线牵动谁先落地。先确认是哪一种外部连接在变化，才不会把所有动静都硬解释成搬家。",
    readerValue: "读完能把迁移宫的动从搬家一条线，拆成外部平台、工作跑动和关系接口三种现实主语。",
    demandEvidence: sitePerformance(
      "/articles/ziwei-liunian-qianyi.html",
      "流年迁移宫动了却没搬家先看什么",
      "看到迁移宫被触发、但一年里没有真实搬迁的排盘用户",
      "用户需要判断今年的动到底落在出差、平台转换、岗位变化还是对外关系",
      "赢家页已经证明流年迁移宫有持续需求，这一篇专门回答没搬家时动在外部哪一条线"
    ),
    examples: [
      "例子一：流年命宫走到本命迁移宫，搬家没有发生，可出差、跨城会议和外部客户明显变多，这种动就更像工作接口被推到台前。",
      "例子二：同样是迁移宫动，一年里真正变化的是主管、合作平台或长期客户群，住所没变，但人已经被外部关系和新规则重新编排。",
    ],
    openingParagraphs: [
      "很多人一看到迁移宫动，就先去想搬家、出国、离开原地。可现实里更多时候，动的是你和外部世界的接口，不一定先动住处。",
      "所以这类题最怕只拿‘有没有搬家’做判断。没搬，不代表迁移宫没应；要看外部哪一条线先被推起来。",
    ],
    sections: zhSections(baseArticle, [
      "先确认动的是住处，还是外部接口",
      "出差、换岗和换平台都算迁移线",
      "关系也会沿着迁移宫被改写",
      "没有搬家，也能把迁移宫读实",
    ]),
    english: {
      title: "The Travel Palace Is Active, but You Did Not Move: What Changed?",
      description: "An active Travel Palace does not require a home move. Check business travel, platform changes, role shifts, and outside-facing relationships first.",
      examples: baseArticle.english.examples,
      openingParagraphs: [
        "Many readers jump straight from an active Travel Palace to moving house, leaving the country, or physically relocating. In practice, the palace often moves the outside-facing interface before it moves the address.",
        "That is why the first question should not be, “Did I move?” The better question is, “Which connection to the outside world changed first?”",
      ],
      sections: enSections(baseArticle, [
        "Separate a home move from an outside-world shift",
        "Travel, role changes, and platforms all belong on this line",
        "Relationships can also be rewritten through the Travel Palace",
        "A Travel Palace can be real even without relocation",
      ]),
    },
  })),
  remake("ziwei-tianfu-shoucai-hui-cun-hui-guan-hui-pei", (baseArticle) => ({
    order: 4,
    slug: "ziwei-tianfu-shoucai-bushi-zhishi-baoshou",
    title: "紫微斗数天府守财为什么不只是保守：会存、会管、会分配才是真本事",
    userQuestion: "天府守财到底是太保守，还是本来就比较会存、会管、会分配资源？",
    userScenario: "用户经常被说稳、慢、不乱花，但自己也想知道这到底是胆小，还是本来就更会守住资源和预算。",
    coreIntent: "区分天府守财里的保守感和真实的资源管理能力",
    directAnswer: "天府守财若只读成保守，就会把它最有用的部分漏掉。它真正强的地方，往往是会留、会管、会配，知道什么该保、什么该动、什么该晚一点再用；判断时要继续看财帛、官禄和三方四正，才知道这是会经营资源，还是只是因为怕损失而不敢动。",
    readerValue: "读完能把天府的稳，从单纯不敢花，改读成资源管理和长期分配能力。",
    demandEvidence: baseArticle.demandEvidence,
    examples: baseArticle.examples,
    openingParagraphs: [
      "很多人一听天府守财，就先想到保守、慢、不敢花。可真正在现实里拉开差距的，往往不是抠，而是会不会管。",
      "天府要读得实，就不能只问花不花钱，还要继续问你会不会存、会不会配、会不会把资源放到该去的位置。",
    ],
    sections: zhSections(baseArticle, [
      "守财先看会不会管，不先看敢不敢花",
      "会存、会配，才是天府的长项",
      "三方四正决定这是经营还是僵住",
      "把天府的稳落到资源管理线上",
    ]),
    english: {
      title: "Why Tian Fu Guarding Wealth Is More Than Simple Caution",
      description: "Tian Fu guarding wealth is strongest when it stores, manages, and allocates resources well, not when it merely avoids spending.",
      examples: baseArticle.english.examples,
      openingParagraphs: [
        "Many people hear Tian Fu guarding wealth and picture caution, delay, or reluctance to spend. That reading is too narrow.",
        "Its more useful strength often lies in resource stewardship: knowing what to keep, what to allocate, and what should move later rather than now.",
      ],
      sections: enSections(baseArticle, [
        "Read management before you read caution",
        "Storage and allocation are part of the strength",
        "The surrounding structure shows stewardship or rigidity",
        "Place Tian Fu on the resource-management line",
      ]),
    },
  })),
  remake("ziwei-nanming-taiyin-huaji-xiantan-bianjie", (baseArticle) => ({
    order: 5,
    slug: "ziwei-nanming-taiyin-huaji-tuohun-qijia",
    title: "紫微斗数男命太阴化忌为什么总把情绪带进婚事：拖婚、妻家和边界怎么分",
    userQuestion: "男命太阴化忌时，为什么常常不是直接分手，而是一直拖着、越谈越累？",
    userScenario: "用户感情里不一定没有对象，但婚事推进反复拖、情绪压着不讲、又容易被妻家和现实安排牵动，想知道问题到底卡在哪一层。",
    coreIntent: "判断男命太阴化忌在婚事里更常先表现为拖婚、妻家压力还是边界失守",
    directAnswer: "男命太阴化忌不只是在讲婆媳或妻家问题，更常见的是情绪先憋住、婚事久拖不决，边界也跟着变薄。读盘时要先分本人不说、关系不定，还是外部家庭和现实安排先压进来；只有把拖延、压力来源和边界位置拆开，才不会一听化忌就只往单一家庭冲突上想。",
    readerValue: "读完能把男命太阴化忌在婚事里的拖、压和边界三层分开，不再只会用一句妻家压力解释所有不顺。",
    demandEvidence: sitePerformance(
      "/articles/ziwei-nanming-taiyin-huaji.html",
      "男命太阴化忌为什么总把情绪带进婚事",
      "感情推进反复拖延、又说不清是自己不定还是外部压力太重的男性用户",
      "用户正在决定婚事要继续推进还是先补边界，想知道卡点到底落在情绪、关系还是妻家",
      "赢家页已经证明男命太阴化忌有稳定需求，这一篇专门拆拖婚、情绪和妻家边界，不复写旧页"
    ),
    examples: baseArticle.examples,
    openingParagraphs: [
      "男命太阴化忌最容易被一句妻家压力盖掉。可现实里不少人不是先吵翻，而是一直拖、一直闷，婚事越谈越累。",
      "所以这条线要先拆。拖的是决定、拖的是情绪，还是拖的是外部安排，读法完全不同。",
    ],
    sections: zhSections(baseArticle, [
      "先分拖的是决定，还是情绪先压住",
      "妻家和现实安排什么时候会一起压进来",
      "边界一薄，婚事就容易久拖不决",
      "别只看化忌，要看拖延落在哪一层",
    ]),
    english: {
      title: "Why Male Tai Yin Hua Ji Can Drag Marriage Into Emotional Exhaustion",
      description: "Male Tai Yin Hua Ji often shows up through delay, blurred boundaries, and outside pressure rather than one immediate breakup scene.",
      examples: baseArticle.english.examples,
      openingParagraphs: [
        "Male Tai Yin Hua Ji is often reduced to a simple in-law problem. In real relationships, many people feel it first as delay, emotional compression, and a decision that never fully lands.",
        "That is why the useful reading separates what is being delayed, what is being carried in silence, and what outside pressure keeps crossing the boundary of the relationship.",
      ],
      sections: enSections(baseArticle, [
        "Separate delayed decisions from suppressed emotion",
        "Family and practical pressure can arrive together",
        "Weak boundaries turn hesitation into exhaustion",
        "Read the layer of delay before making the claim",
      ]),
    },
  })),
  remake("ziwei-minggong-huaquan-zhujian-haishi-guquan", (baseArticle) => ({
    order: 6,
    slug: "ziwei-minggong-huaquan-meiren-tixing",
    title: "紫微斗数命宫化权为什么越能扛事，越容易没人提醒你：主见和孤权差在哪",
    userQuestion: "命宫化权的人为什么明明很能扛事，却常常走到后来没人敢提醒、也没人敢拦？",
    userScenario: "用户做决定快、责任感重，常被当成能扛事的人，但越往后越觉得所有意见都绕着自己走，出问题也少人提前提醒。",
    coreIntent: "区分命宫化权的主见与孤权，并解释为什么能扛事的人反而更容易失去提醒系统",
    directAnswer: "命宫化权的强，不只是有主见，还常伴随决定速度快、承担多、别人默认你会扛住。问题在于承接你决定的人若不敢回话，主见就会慢慢转成孤权。看盘时要继续核对财帛、官禄、朋友和迁移怎么承接你的决定，才知道这是领导力，还是提醒系统已经失灵。",
    readerValue: "读完能分清命宫化权的优势和盲点，知道问题不在有权，而在有没有人敢回话。",
    demandEvidence: sitePerformance(
      "/articles/ziwei-minggong-huaquan-lingdao.html",
      "命宫化权为什么越能扛事越容易没人提醒",
      "常被当成主心骨、但越来越感到孤立和反馈不足的用户",
      "用户正在判断自己该继续强推决定，还是先补团队反馈和承接结构",
      "赢家页证明命宫化权有阅读需求，这一篇专门处理为什么能扛事的人反而更容易失去提醒系统"
    ),
    examples: [
      "例子一：命宫化权、官禄也能接住责任，职位上看似越来越稳，可团队开始默认你自己会扛，真正危险的是反馈越来越少，不是责任越来越多。",
      "例子二：财帛和朋友线承接不足时，命宫化权的人会越做越像一个人决断、一个人补洞，旁人不是没意见，而是已经不想再说。",
    ],
    openingParagraphs: [
      "命宫化权的人，常常最早被夸的是能扛事。可很多人真正难受的，不是事情多，而是越往后越没人提醒你哪里已经偏了。",
      "所以这条线不能只讲领导感。要继续看，为什么主见会一点点变成孤权，为什么别人开始默认你一个人扛到底。",
    ],
    sections: zhSections(baseArticle, [
      "能扛事，不代表提醒系统也在",
      "主见变孤权，常从没人敢回话开始",
      "财官朋友怎么承接你的决定",
      "补回提醒系统，主见才不会走偏",
    ]),
    english: {
      title: "Why Ming Gong Hua Quan Can Leave You With No One Willing to Warn You",
      description: "Ming Gong Hua Quan can create fast decisions and strong responsibility, but it can also weaken the feedback system that keeps those decisions balanced.",
      examples: baseArticle.english.examples,
      openingParagraphs: [
        "People with Ming Gong Hua Quan are often praised for being decisive and willing to carry responsibility. The harder problem comes later, when fewer people feel able to stop them early.",
        "That is why this pattern should not be read only as leadership. It should also be read as a question about whether the surrounding system can still answer back.",
      ],
      sections: enSections(baseArticle, [
        "Carrying more does not mean the feedback system is healthy",
        "Lonely authority often begins when no one answers back",
        "Wealth, career, and peers show how decisions are received",
        "Strong judgment still needs a working warning system",
      ]),
    },
  })),
  remake("ziwei-huotan-ge-chengju-xiankan-shenme", (baseArticle) => ({
    order: 7,
    slug: "ziwei-huotan-ge-xiankan-gongwei-chukou",
    title: "紫微斗数火贪格成局前先看什么：宫位、火势和爆发出口缺一不可",
    userQuestion: "火贪格为什么不能只看到贪狼和火星就算成立，还要继续看宫位和爆发出口？",
    userScenario: "用户一看到盘里有贪狼和火星，就想立刻套火贪格，可现实里有的人像爆发、有的人只是冲动，想知道差别在哪。",
    coreIntent: "判断火贪格成立前必须补看的宫位条件、火势强弱和现实爆发出口",
    directAnswer: "火贪格不是看到贪狼和火星就结束，而是要继续问这团火点在什么宫、能不能被主线承接、最后会往哪个现实出口喷出来。宫位不对、承接不足，往往只剩冲动和消耗；条件对齐时，才更像短时间把资源、人气或变化推大。",
    readerValue: "读完能把火贪格从两颗星的速断，改成宫位、承接和出口三步确认。",
    demandEvidence: sitePerformance(
      "/articles/en/ziwei-huotang-ge.html",
      "火贪格成局前先看宫位火势和爆发出口",
      "听过火贪格、却分不清什么是真爆发什么只是冲动的人",
      "用户正在判断盘里的火贪组合能不能当成格局成立来用",
      "英文赢家页已经证明火贪格条件题有真实需求，这一篇专门回答成立前还缺哪些确认步骤"
    ),
    examples: baseArticle.examples,
    openingParagraphs: [
      "火贪格最容易被两颗星带着跑。盘里一看到火和贪，很多人就急着贴上暴起暴落或一鸣惊人的标签。",
      "可真正难的不是认出组合，而是确认它到底有没有成局。火点在哪里，谁来承接，最后喷向什么出口，这三步不能少。",
    ],
    sections: zhSections(baseArticle, [
      "先定火点落在哪条主线，不先抢下结论",
      "火势大，不代表一定有人能接住",
      "爆发出口决定它是上升还是消耗",
      "三步确认后，再谈火贪格成不成立",
    ]),
    english: {
      title: "What Must You Check Before Calling It a Huo Tan Pattern?",
      description: "Huo Tan is not confirmed by Fire and Tan Lang alone. Check the palace, the carrying structure, and the real outlet of the surge first.",
      examples: baseArticle.english.examples,
      openingParagraphs: [
        "Many readers rush to label Huo Tan the moment they see Fire and Tan Lang together. The combination matters, but the label is too early without asking where the heat lands and what receives it.",
        "The better reading checks three things first: the palace that carries the pattern, the structure that can receive the surge, and the real-world outlet where the energy will show up.",
      ],
      sections: enSections(baseArticle, [
        "Name the main line before naming the pattern",
        "Strong heat still needs a receiving structure",
        "The outlet decides whether the surge becomes growth or cost",
        "Confirm the three steps before using the Huo Tan label",
      ]),
    },
  })),
  remake("ziwei-lianzhen-qisha-fudegong-yingcheng-bunengkang", (baseArticle) => ({
    order: 8,
    slug: "ziwei-lianzhen-qisha-fude-yizhi-yingcheng",
    title: "紫微斗数廉贞七杀在福德为什么最怕一直硬撑：能扛和压抑不是一回事",
    userQuestion: "廉贞七杀在福德时，为什么看起来很能扛，结果反而最怕一直硬撑下去？",
    userScenario: "用户平时表现得很稳、很硬，遇事也能顶住，可真正的问题是休息不下来、情绪不松、长期压着不说，想知道这是不是廉贞七杀的典型压力。",
    coreIntent: "区分廉贞七杀在福德的能扛与长期压抑，并说明为什么持续硬撑最危险",
    directAnswer: "廉贞七杀在福德的强，不等于可以无限硬撑。它常把压力压回内里，表面看起来还在顶、还在做，真正危险的是长期不松、不停、不说，最后把能扛变成消耗。看盘时要继续分当下承担力和长期恢复力，不能把顶得住当成没代价。",
    readerValue: "读完能把廉贞七杀福德的强硬感，拆成承担力、恢复力和长期代价三层。",
    demandEvidence: sitePerformance(
      "/articles/ziwei-lianzhen-qisha-fudegong-xinli.html",
      "廉贞七杀在福德为什么最怕一直硬撑",
      "长期表现能扛、但其实已经被高压和内耗拖住的人",
      "用户正在判断自己该继续扛还是先停下来修复节奏",
      "赢家页已经证明廉贞七杀在福德有稳定需求，这一篇专门回答为什么能扛的人反而最怕持续硬撑"
    ),
    examples: baseArticle.examples,
    openingParagraphs: [
      "廉贞七杀在福德的人，常常最怕听到一句“你不是很能扛吗”。因为很多问题，恰恰是从一直扛开始的。",
      "表面上的稳和硬，不代表里面真的松得开。真正要分的，是你现在能不能扛，和你还能扛多久。",
    ],
    sections: zhSections(baseArticle, [
      "能扛是一层，恢复力是另一层",
      "一直硬撑，最容易把压力压回里面",
      "睡眠、节奏和耐性是更早的警报",
      "别把冷静外表误读成没有代价",
    ]),
    english: {
      title: "Why Lian Zhen and Qi Sha in the Inner-Life Palace Can Suffer From Endless Endurance",
      description: "This pattern often looks strong from the outside, but the real risk comes when endurance replaces recovery for too long.",
      examples: baseArticle.english.examples,
      openingParagraphs: [
        "People with Lian Zhen and Qi Sha in the Inner-Life Palace are often told that they can handle pressure. The deeper problem begins when handling pressure becomes the only mode they know.",
        "Visible control does not prove inner recovery. The key distinction is between carrying something for now and turning endurance into a permanent operating system.",
      ],
      sections: enSections(baseArticle, [
        "Endurance and recovery are not the same layer",
        "Continuous suppression pushes pressure inward",
        "Sleep, rhythm, and patience often warn earlier",
        "Do not mistake a hard exterior for zero cost",
      ]),
    },
  })),
  remake("ziwei-sanfang-sizheng-shenme-shihou-bixulai-duigong", (baseArticle) => ({
    order: 9,
    slug: "ziwei-sanfang-sizheng-duigong-xianhou-20260807",
    title: "紫微斗数三方四正什么时候一定先看对宫：主事宫和牵动宫要分开",
    evidence: [
      "339-360",
      "365-368",
    ],
    userQuestion: "三方四正里，对宫到底什么时候要提前看，而不是等三方都铺完再回头补？",
    userScenario: "用户已经会看三方四正，却常在命宫、迁移、夫妻、官禄这些轴线上卡住，不知道对宫该先入场还是后补。",
    coreIntent: "建立三方四正里对宫的优先级规则，并区分主事宫和牵动宫",
    directAnswer: "对宫不该永远固定在第二步或最后一步。先问这件事是本宫主事，还是本来就被另一端牵着走；只要问题本身是强轴线、空宫借对宫，或现实就是两端拉扯，对宫就必须提前进来。先分主事宫和牵动宫，三方四正才不会看成一团。",
    readerValue: "读完能知道哪些题先抓轴线，哪些题先铺资源承接，不再对每一张盘都用同一顺序。",
    points: [
      "紫微斗数以十二宫区分本人及周围不同生活层面，命宫主要说明本人先天、个性与行为模式。",
      "命宫位置怎么转，官禄、财帛和迁移这条本命承接线也跟着轮转；先认出谁是主事宫，顺序才不会乱。",
      "看命宫时必须同时兼看财帛、官禄和迁移，不能把本宫星曜脱离三方四正单独判断。",
      "宫位本身有宫性，当年命宫走到财帛先突出钱的阻力，走到迁移即使不见天马也会加强移动主题。",
    ],
    demandEvidence: sitePerformance(
      "/articles/en/triad-and-opposite.html",
      "三方四正什么时候一定先看对宫",
      "已经会看三方四正、但总抓不准对宫先后次序的用户",
      "用户正在读盘或教别人读盘，需要明确什么时候对宫必须先入场",
      "英文赢家页已经证明 triad and opposite 有真实需求，这一篇专门回答对宫优先级，不复制总论页"
    ),
    examples: [
      "例子一：问换工作时，若本来就是本地岗位和外地平台在拉扯，对宫迁移必须先进来，不然官禄宫很容易被读成单线职业题。",
      "例子二：命宫一换位，官禄、财帛和迁移也会跟着轮转；若一开始连谁是主事宫都没认清，就很容易把对宫和三方先后看反。",
    ],
    openingParagraphs: [
      "很多人学三方四正会卡在一个细节上：对宫到底什么时候先看？如果每次都照同一顺序，越读越容易把轴线题读成单宫题。",
      "所以重点不是记口诀，而是先分这件事到底是谁主事，谁在牵动。顺序一清，盘就会立刻安静下来。",
    ],
    sections: zhSections(baseArticle, [
      "先分本宫主事，还是对冲牵动",
      "强轴线和空宫题，对宫必须更早进来",
      "资源承接题，三方仍可能先走一步",
      "顺序对了，三方四正才不会糊成一团",
    ]),
    english: {
      title: "When Must the Opposite Palace Come First in a Triad Reading?",
      description: "Use the opposite palace early when the question is axis-driven, empty-palace driven, or clearly pulled by two ends at once.",
      examples: baseArticle.english.examples,
      openingParagraphs: [
        "Many readers learn the triad and still hesitate over one practical detail: when should the opposite palace enter the reading first?",
        "The answer depends on whether the topic is owned by one main palace or already being pulled by an axis. Once that distinction is clear, the sequence becomes much cleaner.",
      ],
      sections: enSections(baseArticle, [
        "Separate a main-palace question from an axis question",
        "Strong axes and empty palaces need the opposite early",
        "Support questions may still let the triad lead",
        "Sequence keeps a triad reading from blurring together",
      ]),
    },
  })),
  remake("ziwei-guanlugong-hangye-zhiwei-zeren-shui-zhong", (baseArticle) => ({
    order: 10,
    slug: "ziwei-guanlugong-zeren-zhiwei-hangye",
    title: "紫微斗数官禄宫先看职责还是行业：职位、收入和责任别一次问完",
    userQuestion: "官禄宫到底应该先看职责、职位，还是先猜我做什么行业？",
    userScenario: "用户一问官禄宫，就想同时知道工作内容、头衔、行业和收入，结果解释越听越宽，最后什么都像。",
    coreIntent: "拆开官禄宫里的职责、职位和行业层次，建立更稳的阅读顺序",
    directAnswer: "官禄宫最先回答的通常不是行业名，而是责任结构和工作方式。职位是你在这套结构里的位置，行业还要再结合主星性质、财帛承接和迁移平台去落地；把三件事一次问完，官禄宫就很容易被读成空泛职业标签。先问你在做什么样的事，再问你坐在哪个位置，最后才问这常见于哪些行业。",
    readerValue: "读完能把官禄宫从职业目录，改读成责任结构，再慢慢映到职位与行业。",
    demandEvidence: sitePerformance(
      "/articles/en/life-palace.html",
      "官禄宫先看职责职位还是行业",
      "想从一个宫位直接看职业、却总觉得答案太宽的排盘用户",
      "用户正在做职业判断，需要先知道官禄宫优先回答哪一层问题",
      "英文 palace meaning 页面有持续阅读，这一篇专门补 Career Palace 的职责、职位和行业分层，不复制其他方法页"
    ),
    examples: [
      "例子一：官禄宫先显示的是带人、统筹、复核还是执行，这一步若没先定，就很容易把行政、运营、教师和财务全说成像。",
      "例子二：同样是官禄亮，有的人亮在位置高，有的人亮在责任重；收入和行业要再回财帛、迁移与平台，不能只凭官禄一宫拍板。",
    ],
    openingParagraphs: [
      "很多人问官禄宫，真正想要的是一句职业答案：做什么、当什么、赚多少。可一宫想包打天下，最后最容易什么都像。",
      "官禄宫要先拆层。它先讲你在承担什么样的工作，再讲你处在什么位置，最后才慢慢映到行业名称。",
    ],
    sections: zhSections(baseArticle, [
      "官禄先讲责任结构，不先报行业名",
      "职位是位置，行业要再往外接",
      "收入别急着塞回官禄宫一宫里",
      "顺序一清，职业判断才会收窄",
    ]),
    english: {
      title: "Should the Career Palace Be Read as Responsibility, Position, or Industry First?",
      description: "Start the Career Palace with responsibility structure, then position, and only then translate the pattern into likely industry settings.",
      examples: baseArticle.english.examples,
      openingParagraphs: [
        "Many people want the Career Palace to behave like a career directory: name the field, the title, and the income in one step. That usually makes the reading too broad to use.",
        "A steadier sequence starts with what kind of responsibility the person carries, then where that responsibility sits, and only then which industries commonly fit the pattern.",
      ],
      sections: enSections(baseArticle, [
        "The Career Palace speaks about work structure first",
        "Position is not the same thing as industry",
        "Income still belongs in a wider reading",
        "Clear sequence turns a vague answer into a usable one",
      ]),
    },
  })),
].toSorted((left, right) => left.order - right.order);
