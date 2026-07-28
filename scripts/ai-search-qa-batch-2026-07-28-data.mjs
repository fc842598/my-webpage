const ZH_DEFAULT_HEADINGS = {
  focusHeading: "先看核心判断",
  exampleHeading: "用场景来验",
  boundaryHeading: "边界要立住",
  orderHeading: "更稳的使用顺序"
};

const EN_DEFAULT_HEADINGS = {
  enFocusHeading: "What matters first",
  enExampleHeading: "A practical scenario",
  enBoundaryHeading: "The boundary to remember",
  enOrderHeading: "A safer order"
};

const DAY4_SEEDS = [
  {
    slug: "ai-suanming-jinggong-cankao-hai-yao-kanma",
    title: "AI算命网站写“仅供参考”还值得继续看吗？先看它有没有把依据讲清",
    enTitle: "If an AI Fortune-Telling Site Says 'For Reference Only,' Is It Still Worth Using? First See Whether It Explains Its Basis",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "页面写“仅供参考”，不代表这个工具就没有价值。真正要紧的，是它有没有把命盘依据、问题范围和验证路径写清楚，而不是一边自我免责，一边继续卖绝对结论。",
    second: "如果它能承认边界，同时还能把命宫、财帛、官禄、迁移这些线拆给你看，这种“参考”反而比满口保证更稳。怕的不是参考二字，怕的是既不负责、也不具体。",
    focusPoints: [
      "先看它有没有方法链。能不能说清是本命底色在起作用，还是流年触发了某条线；能不能解释为什么同样问工作，有的人重点落职位，有的人重点落平台。",
      "再看它有没有验证入口。愿不愿意让你先排基础盘、先试一轮问题，再决定要不要继续，这比写不写“仅供参考”更能说明诚意。 "
    ],
    examples: [
      "比如你问回老家发展，它若能区分是迁移线、田宅线还是家庭牵挂在动，就说明它在读结构，而不是拿免责声明挡住一切追问。",
      "反过来，如果它只会说“你最近适合回归稳定”，却不解释稳定来自哪里，这种参考价值就很有限。"
    ],
    boundaryPoints: [
      "“仅供参考”不能变成偷懒的挡箭牌。没有依据、没有条件、没有代价提醒的回答，就算语气再稳，也不该被抬到决策层。",
      "真正靠谱的参考，应该让你更会判断，而不是让你更依赖它替你判断。"
    ],
    steps: [
      "先看它有没有把方法说清。",
      "再用一个旧事和一个当前问题做交叉验证。",
      "只有具体度和边界都过关时，才继续往下用。"
    ],
    enLead: "A 'for reference only' label does not automatically make a tool useless. What matters is whether it still shows its logic and limits clearly.",
    enSecond: "A tool that admits boundaries yet still explains the chart structure is often safer than one that shouts certainty.",
    enFocusPoints: [
      "Check whether it shows a reasoning chain instead of hiding behind cautionary wording.",
      "Then see whether it lets you verify the chart and question flow before deeper commitment."
    ],
    enExamples: [
      "A better answer can tell whether a hometown question comes from travel, property, or family pressure lines.",
      "A weak answer only says 'you should return to stability' without any structure."
    ],
    enBoundaryPoints: [
      "Reference language should not become an excuse for vague output.",
      "Good reference use should improve your judgment rather than replace it."
    ],
    enSteps: [
      "Check the method first.",
      "Verify with one past event and one live question.",
      "Continue only if both specificity and boundaries hold up."
    ]
  },
  {
    slug: "ai-suanming-yishanglai-jiu-cui-fufei-kaopuma",
    title: "AI算命一上来就催你付费靠谱吗？先看有没有给你验证机会",
    enTitle: "Is It Reliable When an AI Fortune-Telling Tool Pushes Payment Right Away? First See Whether It Gives You a Way to Verify",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "一打开就催你付费，并不自动等于有问题，但它至少会暴露一个信号：平台更想先完成成交，还是先让你确认自己到底适不适合继续用。",
    second: "对这类产品来说，最稳的顺序应该是先看到盘、先走一轮基础问题、先明白免费和付费边界，再决定要不要掏钱。没有验证机会的付费按钮，天然就更值得警惕。",
    focusPoints: [
      "先看有没有基础验证层。哪怕只是先排盘、先看问题入口、先试一轮免费问答，也说明平台愿意让你先判断值不值。",
      "再看收费是不是写清楚。价格、次数、会员权益、支付后承接和售后入口是否摆在明面上，这些都比“限时优惠”更重要。 "
    ],
    examples: [
      "比如你还没看见自己的盘，只看见“现在立刻开通更准”，这种流程更像在放大焦虑，而不是在帮你判断。",
      "如果是先给你基础盘，再说明连续追问和记录承接属于付费层，这种收费逻辑就更容易让人接受。"
    ],
    boundaryPoints: [
      "付费不是问题，先付费却不知道自己买了什么，才是问题。",
      "尤其在高焦虑情境下，越是被时间词和情绪词推着走，越应该退回去先看事实页。"
    ],
    steps: [
      "先确认有没有免费或低门槛验证层。",
      "再核对价格、次数和售后入口。",
      "最后才决定付费，不要反过来。"
    ],
    enLead: "A fast payment push does not prove a platform is bad, but it does reveal what the platform prioritizes first.",
    enSecond: "A steadier order is chart first, question flow second, price boundaries third, and payment only after that.",
    enFocusPoints: [
      "Look for a real verification layer before checkout.",
      "Then check whether price, limits, and after-sales paths are written clearly."
    ],
    enExamples: [
      "If you only see 'pay now for better accuracy' before you even see the chart, be careful.",
      "If the chart comes first and paid use mainly extends follow-up and continuity, the logic is more reasonable."
    ],
    enBoundaryPoints: [
      "Charging is not the issue. Paying without knowing what you bought is.",
      "Urgency-heavy wording should push you back toward the facts page, not deeper into checkout."
    ],
    enSteps: [
      "Confirm the verification layer first.",
      "Check price, limits, and support next.",
      "Pay only after that sequence is complete."
    ]
  },
  {
    slug: "ai-suanming-jieguo-tai-shun-er-yao-xiaoxinma",
    title: "AI算命结果越顺耳越要小心吗？先分共鸣和可验证",
    enTitle: "Should You Be More Careful When an AI Fortune-Telling Result Sounds Too Comforting? Separate Resonance From Verification",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "回答太顺耳，不一定就是错，但它确实容易让人放下警惕。尤其当你本来就在犹豫、焦虑或想被鼓励时，顺耳和靠谱很容易在脑子里被混成一件事。",
    second: "真正该分开的，是共鸣和可验证。共鸣只能说明它碰到了你的情绪和经验，可验证才说明它有方法、有结构，值得继续参考。",
    focusPoints: [
      "先看顺耳的内容能不能落到盘里。是命宫底色、夫妻线节奏、还是财帛与官禄的关系在支撑这句话，得说得出来。",
      "再看它愿不愿意讲代价。凡是只给你舒服方向、却不提醒慢点、守点、先看风险的回答，都容易失真。"
    ],
    examples: [
      "比如感情题里只说“你值得更好的”，听起来很暖，但如果不区分是推进过快还是边界太软，就帮不上什么忙。",
      "事业题里只说“你有潜力换更大平台”，若不继续拆收入承接和责任压力，也只是好听。"
    ],
    boundaryPoints: [
      "顺耳可以是加分项，但不能代替结构。",
      "越是让你立刻松一口气的答案，越值得多问一句：它凭什么这么说？"
    ],
    steps: [
      "把最顺耳的一句单独拎出来。",
      "追问它的依据、条件和代价。",
      "只有还能讲得清时，才给它更高权重。"
    ],
    enLead: "A comforting answer is not automatically wrong, but it does make people lower their guard faster.",
    enSecond: "The key split is between emotional resonance and something you can actually verify.",
    enFocusPoints: [
      "Check whether the comforting line still lands back in chart structure.",
      "Then see whether the answer is willing to name tradeoffs as well as encouragement."
    ],
    enExamples: [
      "A warm relationship line is weak if it cannot separate pacing from boundary problems.",
      "A career line is weak if it praises growth without explaining income and role pressure."
    ],
    enBoundaryPoints: [
      "Comfort can be a plus, but it cannot replace structure.",
      "The more soothing the sentence feels, the more worth it is to ask why."
    ],
    enSteps: [
      "Pull out the most comforting sentence.",
      "Ask for basis, condition, and cost.",
      "Raise its weight only if it still holds up."
    ]
  },
  {
    slug: "ai-suanming-yige-wenti-wen-jici-heli",
    title: "AI算命该拿一个问题问几次？先看是交叉验证还是重复焦虑",
    enTitle: "How Many Times Should You Ask the Same AI Fortune-Telling Question? First Separate Cross-Checking From Repeating Anxiety",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "同一个问题问很多次，不一定就是浪费。有时它是在交叉验证，有时却只是把焦虑换个说法反复确认，结果越问越乱。",
    second: "真正有用的重复，通常带着清晰目的，比如检查不同问法下主线是否一致，或看同一张盘在不同阶段有没有新触发。没有目的的重复，最容易把工具用坏。",
    focusPoints: [
      "交叉验证的重点，是换问法但不换主线。你还是在问同一件工作、同一段关系、同一个现金流问题，只是换角度确认结构是否稳定。",
      "重复焦虑的特点，则是每次都在求“再给我一个更放心的答案”，而不是在补充条件或缩小范围。"
    ],
    examples: [
      "比如你先问“该不该换岗”，再问“换岗更看职责还是平台”，这属于交叉验证，因为主题没变，只是角度更细。",
      "但如果你今天问能不能换、明天问会不会后悔、后天再问是不是命里不适合，核心其实还是同一份不安。"
    ],
    boundaryPoints: [
      "同题反复问得再多，也不会把模糊输入自动问成清晰答案。",
      "真正该增加的，不是次数，而是条件、场景和时间线。"
    ],
    steps: [
      "先写下你这次重复发问的目的。",
      "确认自己是在补条件，还是只是在求安心。",
      "如果只是求安心，先暂停，再回到事实和规则。"
    ],
    enLead: "Asking the same question more than once is not always wasteful. Sometimes it is cross-checking, and sometimes it is just repeating anxiety.",
    enSecond: "Useful repetition has a clear purpose. Aimless repetition usually makes the answer noisier, not better.",
    enFocusPoints: [
      "Cross-checking keeps the same theme but changes the angle.",
      "Anxiety repetition keeps asking for a safer feeling rather than clearer structure."
    ],
    enExamples: [
      "Asking whether a job move is about role or platform is still the same career question.",
      "Asking again and again whether you will regret it is usually the same fear in new wording."
    ],
    enBoundaryPoints: [
      "More repeats do not automatically rescue vague input.",
      "The real upgrade is better conditions, better scenes, and a better timeline."
    ],
    enSteps: [
      "Write down why you are asking again.",
      "Check whether you are adding structure or only asking for comfort.",
      "Pause if it is only about comfort."
    ]
  },
  {
    slug: "ai-suanming-zhishuo-ni-xiangtai-duo-haineng-yongma",
    title: "AI算命只会说“你想太多”还能继续用吗？先看能不能拆到宫位和场景",
    enTitle: "If an AI Fortune-Telling Tool Only Says 'You Are Overthinking,' Is It Still Worth Using? First See Whether It Can Break Things Down Into Chart Areas and Situations",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "“你想太多了”这句话有时不完全错，但如果一个平台逢题必回这句，说明它很可能只抓住了情绪层，没有真正进到盘面和问题结构里。",
    second: "越是事业、关系、钱这类会牵动现实选择的题，越需要拆到具体宫位和场景。只剩一句心理安慰，参考价值就会很低。",
    focusPoints: [
      "先看它能不能拆：是福德线压力大，还是夫妻线节奏乱，还是财帛线现金感不足；同样是焦虑，盘里的来源可以完全不同。",
      "再看它能不能落场景。能不能说出是面试卡住、回款拖延、沟通失衡还是异地节奏乱，这些决定了答案能不能用。"
    ],
    examples: [
      "比如你问合作分账，它若只说你想太多，就忽略了朋友宫、财帛和规则边界本来就该细问。",
      "问感情推进时，它若只归结为情绪多，也可能漏掉了夫妻线和福德线节奏根本没对齐。"
    ],
    boundaryPoints: [
      "能安慰不等于能判断。",
      "一个总是把复杂问题压成“心态问题”的工具，通常只适合陪聊，不适合辅助决策。"
    ],
    steps: [
      "先追问：到底是哪条线在让自己想太多。",
      "再追问：这条线落在什么现实场景里。",
      "如果两步都答不出来，就别继续抬高它的权重。"
    ],
    enLead: "'You are overthinking' is not always wrong, but if the tool says it for every topic, it is probably stuck at the emotion layer.",
    enSecond: "Career, money, and relationship questions need to be broken into real chart lines and real situations, not only mood labels.",
    enFocusPoints: [
      "Check whether it can separate the source of pressure instead of calling everything overthinking.",
      "Then see whether it can land that pressure in a real-world scene."
    ],
    enExamples: [
      "A cooperation question may actually be about money rules and peer boundaries, not just worry.",
      "A relationship question may be about pacing mismatch rather than general overthinking."
    ],
    enBoundaryPoints: [
      "Comfort is not the same thing as judgment.",
      "A tool that reduces everything to mindset is usually better for chatting than for deciding."
    ],
    enSteps: [
      "Ask which line is creating the pressure.",
      "Ask where that line appears in real life.",
      "Lower the weight if it cannot answer both."
    ]
  },
  {
    slug: "ai-suanming-xian-kan-jiushi-haishi-xian-wen-weilai",
    title: "AI算命先看旧事还是先问未来？顺序不同，判断差很多",
    enTitle: "Should You Check Past Events First or Ask About the Future First in AI Fortune Telling? The Order Changes the Quality a Lot",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "先看旧事还是先问未来，没有绝对标准，但如果你是第一次用一个平台，先拿旧事验证，通常会比直接追未来更稳。",
    second: "旧事的价值，不是证明它神，而是看它会不会讲到盘里的结构。未来题的价值，则是在旧事验证通过后，继续拿来做行动排序。顺序一反，误判就容易增多。",
    focusPoints: [
      "先看旧事，能帮你筛掉模板味。它若连已经发生过的职业变化、迁移、关系节奏都说不清，后面的未来判断通常也不值得压太多权重。",
      "未来题则更适合拿来问顺序，而不是问命定。是先守现金、先看平台，还是先慢一点推进关系，这种问法更实用。"
    ],
    examples: [
      "比如你去年明明已经换过一次岗位，它若完全没碰到官禄和迁移这两条线，就别急着拿它预测下一步。",
      "如果旧事验证通过，再问今年要不要动，就更容易判断答案是在延续同一条结构线，还是在空口鼓励。"
    ],
    boundaryPoints: [
      "旧事验证不是为了挑几个说中的片段自我感动，而是为了看它会不会解释为什么会这样。",
      "未来题也不该被问成“你替我决定”，而该被问成“你帮我排顺序”。"
    ],
    steps: [
      "第一次用，先拿一件旧事测结构。",
      "第二步再问一个当前进行中的选择。",
      "最后才看要不要拿它做更长线的跟踪。"
    ],
    enLead: "There is no absolute rule, but if you are trying a platform for the first time, checking a past event first is usually the steadier move.",
    enSecond: "Past-event checks filter out template talk. Future questions work better after that, when you use them to sort action order rather than chase fate guarantees.",
    enFocusPoints: [
      "Past checks tell you whether the system can reach real structure.",
      "Future questions are best used for sequence, not destiny replacement."
    ],
    enExamples: [
      "If the system misses a clear role or location change you already lived through, be careful with its next-step predictions.",
      "If the past check holds, a current-year move question becomes much more meaningful."
    ],
    enBoundaryPoints: [
      "Past checking is about method, not about collecting flattering hits.",
      "Future use should help with order and tradeoffs, not hand over the decision."
    ],
    enSteps: [
      "Test one past event first.",
      "Ask one live decision second.",
      "Only then decide whether longer tracking is worth it."
    ]
  },
  {
    slug: "ai-suanming-mianfei-edu-xianyong-zainali",
    title: "AI算命免费额度先用在哪些问题最值？别先浪费在大而空的问题上",
    enTitle: "Where Should You Spend Free AI Fortune-Telling Quota First? Do Not Waste It on Broad Empty Questions",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    lead: "免费额度最怕两种浪费：一种是拿去问整个人生，一种是问了却没有办法验证。这样用完次数后，你其实还没搞清这个平台有没有价值。",
    second: "更值的用法，是先把免费额度花在一个能回到盘里、又和你当前选择紧密相关的问题上。额度少不代表没用，关键看你把它花在哪。",
    focusPoints: [
      "优先用在能验证的旧事和能拆顺序的当前问题上，比如工作线怎么动、现金流卡在哪、关系是节奏问题还是边界问题。",
      `当前公开边界能核到的是未登录每天 ${"${facts.guestDaily}"} 次、登录免费每天 ${"${facts.loginDaily}"} 次，所以越要把每次提问都用在主线上。`
    ],
    examples: [
      "比如你最近就在纠结要不要换岗，那免费额度拿去问这条线，会比问“我最近整体运势如何”更值。",
      "再比如你刚排完盘，就先问命财官迁哪个最该先看，这也比直接问结果更容易判断平台是不是有结构。"
    ],
    boundaryPoints: [
      "免费额度不是用来收集安慰句的。",
      "如果每一问都太散，次数再多也会被问空。"
    ],
    steps: [
      "先挑一个主线问题。",
      "优先问能验证或能决定顺序的内容。",
      "把总评类问题放到后面，不要放到第一问。"
    ],
    enLead: "Free quota is easiest to waste on huge vague questions or on questions you cannot verify at all.",
    enSecond: "The better use is one chart-linked issue that matters to a live choice right now.",
    enFocusPoints: [
      "Spend the free layer on questions you can verify or use to sort action order.",
      "A small quota still has value if every question stays on the main line."
    ],
    enExamples: [
      "A current job-move question is usually worth more than a total-life question.",
      "Asking which chart line matters first is also a stronger free test than asking for a verdict."
    ],
    enBoundaryPoints: [
      "Free quota is not for collecting comforting lines.",
      "Scattered questions empty the quota faster than the platform does."
    ],
    enSteps: [
      "Pick one main line.",
      "Use the quota on verification or action-order questions.",
      "Leave broad summary questions for later."
    ]
  },
  {
    slug: "ai-suanming-danci-buyi-he-huiyuan-zenme-xuan",
    title: "AI算命单次补问和开会员怎么选？先算连续追问需求",
    enTitle: "How Should You Choose Between One-Off Follow-Up and Membership in AI Fortune Telling? Start With Your Need for Ongoing Questions",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    lead: "单次补问和开会员，最大的差别往往不在“准不准”，而在你接下来到底会不会围绕同一条主线连续问下去。",
    second: "如果只是补一两个短问，单次往往更轻。如果你接下来一段时间都会围绕换岗、合作、关系推进反复回看，会员的价值才会真正体现出来。",
    focusPoints: [
      "先看你有没有连续追问场景。没有这个场景，再低的会员价也可能用不满；有这个场景，单次补问反而可能越补越碎。",
      "再看你重不重视记录承接。能不能把上一次的盘和本次问题接起来，决定了付费体验和免费体验到底差在哪。"
    ],
    examples: [
      "比如你未来三周都在看一场面试和一个转岗机会，这就很像连续追问场景。",
      "如果你只是周末临时看一次盘、补一个问题，单次补问通常已经够了。"
    ],
    boundaryPoints: [
      "会员不是“更准”的开关，更多是额度、承接和体验层的区别。",
      "真正该算的不是便宜不便宜，而是你会不会真的持续用。"
    ],
    steps: [
      "先估自己未来两周会不会反复追这条线。",
      "再判断记录承接对你重不重要。",
      "最后才选单次还是会员。"
    ],
    enLead: "The main difference between a one-off follow-up and membership is usually not accuracy. It is whether you really need ongoing follow-up on the same theme.",
    enSecond: "Short questions fit one-off use. Repeated tracking of one issue is where membership starts to matter.",
    enFocusPoints: [
      "Check whether you actually have a continuity use case.",
      "Then ask how much record carry-over matters to you."
    ],
    enExamples: [
      "A three-week job and interview track is a continuity case.",
      "A one-time weekend chart check usually is not."
    ],
    enBoundaryPoints: [
      "Membership is not an accuracy switch.",
      "The real math is whether you will keep using it, not whether the listed price feels low."
    ],
    enSteps: [
      "Estimate whether this theme will keep returning.",
      "Decide how much continuity matters.",
      "Choose the paid layer only after that."
    ]
  },
  {
    slug: "ai-suanming-fufeiqian-xian-kan-zhifuye-xishe",
    title: "AI算命付费前要不要先看支付页细节？价格之外还有三处要看",
    enTitle: "Should You Read the Payment Page Details Before Paying for AI Fortune Telling? There Are Three Things to Check Beyond Price",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    lead: "很多人付费前只盯着价格，却忽略了真正影响体验的细节。支付页不是形式，它常常是你最后一次确认自己到底买了什么、权益怎么绑定、出了问题去哪找人的地方。",
    second: "尤其是会员和连续追问类服务，光知道 19.90 元并不够。你还得看支付账号绑定、支付方式、刷新路径和售后入口，这些才决定后面顺不顺。",
    focusPoints: [
      "第一看权益绑定到哪里。是绑定当前登录账号，还是只跟浏览器走；如果这一点不清楚，后面换设备最容易出问题。",
      "第二看支付后怎么确认。是否有刷新支付状态、同步会员和订单的路径。第三看售后和退款入口是否好找。"
    ],
    examples: [
      "比如你在电脑上付了款，却准备回手机继续用，支付页若明确写了权益随账号同步，就会安心很多。",
      "再比如支付后如果没有状态刷新入口，你就很难判断是自己没开通成功，还是页面没同步。"
    ],
    boundaryPoints: [
      "价格透明只是最低标准，流程透明才决定后续体验。",
      "支付页写得糊，后面的问题通常不会少。"
    ],
    steps: [
      "先看权益绑定说明。",
      "再看支付后状态怎么刷新。",
      "最后确认售后入口，再付款。"
    ],
    enLead: "Most people look at the price first and stop there, but the payment page often tells you what you really bought and how the service will behave afterward.",
    enSecond: "For membership or ongoing follow-up products, price alone is not enough. Binding rules, refresh paths, and support exits matter just as much.",
    enFocusPoints: [
      "Check where the benefit is bound first.",
      "Then see how payment confirmation and support are handled."
    ],
    enExamples: [
      "If you pay on desktop and plan to continue on phone, account binding clarity matters a lot.",
      "If there is no clear refresh path after payment, it becomes hard to tell whether the problem is sync or payment success."
    ],
    enBoundaryPoints: [
      "Transparent price is only the baseline. Transparent flow is what protects the experience.",
      "A vague payment page usually creates more trouble later."
    ],
    enSteps: [
      "Read the binding note first.",
      "Check the post-payment refresh path next.",
      "Confirm support before you pay."
    ]
  },
  {
    slug: "ai-suanming-huiyuan-80ci-gou-buyongma",
    title: "AI算命会员每天80次够不够用？关键看你是不是同题追踪型",
    enTitle: "Is 80 AI Fortune-Telling Member Uses Per Day Enough? The Real Question Is Whether You Are a Same-Theme Tracking User",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    lead: "80 次/天看上去很多，但够不够用，不能只看数字。真正决定够不够的，是你是不是会围绕同一条线持续追踪，而不是今天聊事业、明天聊感情、后天又重开一局。",
    second: "对同题追踪型用户来说，额度高的意义，是让你可以在一段时间里持续细化同一个问题；对零散体验型用户来说，再多额度也可能只用掉很小一部分。",
    focusPoints: [
      "先看你的使用方式是连续型还是零散型。连续型更看重承接和节奏，零散型更看重偶尔能不能快速得到结构。",
      "再看你是不是会做回看。如果不回看，只是一口气问很多句，额度再高也不一定带来更好判断。"
    ],
    examples: [
      "比如你在追一条创业线：现金流、平台、合作、节奏都会在短时间内反复问到，这就更容易用到高额度。",
      "如果你只是偶尔看看今年运势、问一句关系建议，80 次通常远远超出日常需要。"
    ],
    boundaryPoints: [
      "高额度的价值不在于把人变得更依赖，而在于让连续使用不被频繁打断。",
      "能不能用满，不是荣誉指标，也不是越多越好。"
    ],
    steps: [
      "先判断自己是连续追踪型还是零散体验型。",
      "再看自己会不会回看和承接记录。",
      "最后再评估高额度有没有意义。"
    ],
    enLead: "Eighty uses a day sounds like a lot, but the real question is not the number alone. It is whether your usage style is continuous or scattered.",
    enSecond: "High quota matters most for same-theme tracking users who keep refining one line over time.",
    enFocusPoints: [
      "Check whether your use is continuous or scattered.",
      "Then ask whether you actually review and carry forward earlier questions."
    ],
    enExamples: [
      "A startup tracking line can consume quota meaningfully because the same issue keeps evolving.",
      "An occasional yearly-luck question usually will not."
    ],
    enBoundaryPoints: [
      "High quota matters because it protects continuity, not because more is always better.",
      "Using a lot is not an achievement by itself."
    ],
    enSteps: [
      "Judge your usage style first.",
      "Check whether continuity and review matter to you.",
      "Only then evaluate the quota size."
    ]
  },
  {
    slug: "ai-suanming-fufei-mai-daodi-shi-shenme",
    title: "AI算命付费买到的到底是什么？先分额度、记录和深问体验",
    enTitle: "What Are You Actually Buying When You Pay for AI Fortune Telling? First Separate Quota, Record Carry-Over, and Deep Follow-Up Experience",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    lead: "很多人付费后失望，不是因为平台完全没东西，而是因为自己想买的是“更准”，平台实际卖给你的却是“更多额度、更顺记录和更方便连续追问”。",
    second: "这三样都可能有价值，但它们不是一回事。先把自己想买的东西说清，反而更容易判断要不要付费。",
    focusPoints: [
      "额度解决的是能不能继续问，记录承接解决的是要不要重复讲背景，深问体验解决的是能不能把同一个问题越问越细。",
      "如果你把它们混成“花钱后就应该突然更神”，后面很容易错配期待。"
    ],
    examples: [
      "比如你最大的痛点是每次换设备都要重说背景，那记录承接就比单纯字数更重要。",
      "如果你最大的痛点是免费层刚把结构讲开就没次数了，额度本身就会变成核心价值。"
    ],
    boundaryPoints: [
      "花钱买体验层，不代表内容层就可以不验证。",
      "付费后如果没有承接、没有结构、没有下一步问法，说明你买到的体验也没有真正落地。"
    ],
    steps: [
      "先写下自己最在意的是额度、承接还是深问。",
      "再对应去看付费层到底补的是哪一块。",
      "不要用一个期待去衡量另一种产品价值。"
    ],
    enLead: "Many users feel disappointed after paying because they wanted 'more accuracy' while the platform was really selling more quota, smoother record carry-over, or easier deep follow-up.",
    enSecond: "All three can be valuable, but they are not the same product benefit.",
    enFocusPoints: [
      "Quota affects whether you can keep asking.",
      "Record carry-over affects whether you must keep retelling the background.",
      "Deep follow-up affects whether one issue can be refined instead of restarted."
    ],
    enExamples: [
      "If your pain point is changing devices and losing context, carry-over matters most.",
      "If your pain point is hitting the free cap too quickly, quota becomes the main value."
    ],
    enBoundaryPoints: [
      "Paying for experience does not remove the need to verify content.",
      "If the paid layer still lacks continuity and structure, the experience promise did not really land."
    ],
    enSteps: [
      "Write down which benefit you care about most.",
      "Match the paid layer to that benefit.",
      "Do not judge one benefit by a completely different expectation."
    ]
  },
  {
    slug: "ai-suanming-zhiji-de-wanshang-chusheng-zenme-wen",
    title: "AI算命只记得“晚上出生”怎么问更稳？先别急着断细节",
    enTitle: "How Should You Ask More Safely If You Only Remember 'Born at Night' for AI Fortune Telling? Do Not Rush Into Fine Detail",
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: "只记得“晚上出生”，并不代表完全不能看，但它也不适合一上来就硬断婚期、换岗窗口或哪一年最该冲。",
    second: "更稳的做法，是先承认这是一段时间范围，再拿这个范围做方向判断。只要你先不追太细，AI 依然能帮你缩小问题，而不是立刻给错位结论。",
    focusPoints: [
      "先把问题收窄到方向层，比如更适合守、动、慢、还是补结构，而不是先问某个具体月份的结果。",
      "再看系统是否支持辅助时辰定位、双盘比对或区间验证。对于模糊出生时段，这比强行选一个整点更稳。"
    ],
    examples: [
      "比如你家里只记得你是晚饭后出生，那先问工作和平台主线，通常比先问感情落点更适合。",
      "如果两个相邻时段的事业判断差异很大，就说明这段模糊时间确实值得再核。"
    ],
    boundaryPoints: [
      "模糊时段最怕被问成精确结果题。",
      "不是不能看，而是要先看能看哪一层。"
    ],
    steps: [
      "先把时间当作区间，不当作精确点。",
      "先问方向和主线，不先问细节落点。",
      "必要时再做双盘对照。"
    ],
    enLead: "Remembering only that you were born 'at night' does not make chart work impossible, but it does mean you should avoid forcing fine-detail judgments too early.",
    enSecond: "Treat it as a range first, use it for direction-level questions, and refine only when the structure supports it.",
    enFocusPoints: [
      "Start with direction questions instead of precise-outcome questions.",
      "Use assisted timing or neighboring-version comparison when the platform supports it."
    ],
    enExamples: [
      "A work-platform question is usually safer here than a hyper-precise relationship timing question.",
      "If nearby versions disagree sharply, the fuzzy time really matters."
    ],
    enBoundaryPoints: [
      "Fuzzy time should not be forced into precise-result reading.",
      "The first job is to know what layer is still readable."
    ],
    enSteps: [
      "Treat the time as a range.",
      "Ask about direction first.",
      "Compare nearby versions when needed."
    ]
  },
  {
    slug: "ai-suanming-kan-hepan-qian-xian-bu-shui-de-ziliao",
    title: "AI算命看合盘前要先补谁的资料？先把两个人的时辰边界分开",
    enTitle: "Whose Data Should You Complete First Before Asking AI Fortune Telling for Compatibility? Separate the Two Birth-Time Boundaries First",
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: "看合盘最常见的误区，不是感情判断本身，而是两个人的资料精度完全不一样，却被直接拿来做同一层的比较。",
    second: "真正稳的顺序，是先各自把出生时段边界、出生地和基础盘确认清楚，再谈关系节奏。一个人精确、一个人模糊，后面的比较很容易被误当成“关系不准”。",
    focusPoints: [
      "先分开看两个人的基础盘。各自命宫、夫妻线、福德线和当前阶段先立住，再去看互动。",
      "谁的时间更模糊，谁就该先处理边界问题。因为合盘最怕把一个人的输入误差，错读成两个人的关系误差。"
    ],
    examples: [
      "比如你自己的时辰准、对方只知道大概上午出生，那先拿自己去问关系节奏，通常比直接把两张盘硬叠在一起更稳。",
      "如果两个人都在边界时段，更应该先各自试邻近版本，再讨论推进或复合。"
    ],
    boundaryPoints: [
      "合盘不是越早叠越好，先稳各自底盘，后面才不容易乱。",
      "输入不齐时，AI 最多给你方向提醒，不该给你绝对关系结论。"
    ],
    steps: [
      "先各自确认基础盘能不能站住。",
      "先处理时辰更模糊的一方。",
      "两张盘都相对稳后，再看关系互动。"
    ],
    enLead: "The biggest compatibility mistake is often not the relationship judgment itself, but the fact that the two input sets are nowhere near equally stable.",
    enSecond: "A steadier order is to stabilize each person’s own chart first, then compare interaction after that.",
    enFocusPoints: [
      "Read each base chart separately before combining them.",
      "Handle the fuzzier birth-time boundary first."
    ],
    enExamples: [
      "If your time is precise and the other person only knows 'morning,' stabilize your own structure first.",
      "If both are edge cases, compare nearby versions before reading the relationship."
    ],
    enBoundaryPoints: [
      "Compatibility reading gets noisier when unstable inputs are stacked too early.",
      "With incomplete input, AI should stay at the direction level, not absolute relationship verdicts."
    ],
    enSteps: [
      "Stabilize both base charts first.",
      "Fix the fuzzier timing case next.",
      "Only then read the interaction."
    ]
  },
  {
    slug: "ai-suanming-xianwen-jieguo-haishi-xianwen-yuanyin",
    title: "AI算命先问结果还是先问原因？顺序一换，空话会少很多",
    enTitle: "Should You Ask for the Result First or the Cause First in AI Fortune Telling? Change the Order and Empty Talk Drops Fast",
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: "很多空话，其实是被问法逼出来的。你先问结果，AI 很容易直接跳到“会不会成”；你先问原因，它反而更容易回到盘里的结构和问题根源。",
    second: "尤其在事业、关系、钱这类题上，先问为什么卡、为什么动、为什么不顺，往往比先问最后成不成，更容易得到有用答案。",
    focusPoints: [
      "原因题更容易让系统回到命财官迁、夫妻福德、流年大限这些结构线上。",
      "结果题不是不能问，而是更适合放在后面，等你先知道哪条线在动、哪条线要守之后再问。"
    ],
    examples: [
      "比如你先问“为什么我最近总想换工作”，比直接问“我该不该辞职”更容易把主线问清。",
      "感情题里先问“为什么总卡在推进节奏”，也比先问“能不能成”更容易落地。"
    ],
    boundaryPoints: [
      "先问结果，最容易收到模板式鼓励或打击。",
      "先问原因，并不拖慢进度，反而常常能省掉后面很多无效追问。"
    ],
    steps: [
      "先用一问找原因。",
      "第二问再问顺序和动作。",
      "最后才看结果层要不要继续追。"
    ],
    enLead: "A lot of empty language is created by the question order itself. Ask for the result first, and the answer tends to jump to a verdict. Ask for the cause first, and structure shows up faster.",
    enSecond: "For career, relationship, and money questions, cause-first is often far more useful than verdict-first.",
    enFocusPoints: [
      "Cause questions pull the answer back into chart structure.",
      "Result questions work better after the active line is already clear."
    ],
    enExamples: [
      "Why am I restless about work lately? is stronger than Should I quit now?",
      "Why does this relationship keep stalling? is stronger than Will it work?"
    ],
    enBoundaryPoints: [
      "Verdict-first wording invites template talk.",
      "Cause-first often saves time by cutting off later empty follow-up."
    ],
    enSteps: [
      "Use the first question to ask why.",
      "Use the second to ask order and action.",
      "Only then move to the outcome layer."
    ]
  },
  {
    slug: "ai-suanming-weishenme-xian-ding-yige-zhuti",
    title: "AI算命为什么总让你先定一个主题？因为命财官迁不是一锅炖",
    enTitle: "Why Does AI Fortune Telling Keep Telling You to Pick One Theme First? Because Life-Money-Career-Travel Are Not One Pot",
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: "平台总让你先定一个主题，不是故意刁难，而是因为命盘里的主线本来就分工不同。命宫是底色，财帛是钱感，官禄是职责，迁移是平台和外部机会，混着问就很容易问散。",
    second: "你越早定主线，回答越容易具体。你越把所有焦虑揉成一句，系统越只能给你一锅平均后的话。",
    focusPoints: [
      "定主题的本质，是先决定你这次最想解决的是工作、钱、关系、流年还是移动变化。",
      "主题一旦定了，盘里的阅读顺序也会跟着清晰：先看本宫，再看三方四正，再看阶段触发。"
    ],
    examples: [
      "比如同样是想换城市，有的人主线是迁移平台，有的人主线其实是田宅和家庭安排，两者就不该问成同一个问题。",
      "问钱也是一样。你是在问涨薪、回款、投资、还是副业，不先分清，财务题就很容易越问越糊。"
    ],
    boundaryPoints: [
      "主题不是越多越全面，往往是越多越稀释。",
      "先定主题，不代表后面不能扩展，只是先把入口找对。"
    ],
    steps: [
      "先写下自己这次最想解决的一个主题。",
      "围绕这个主题去看本宫和相关线。",
      "别在第一轮就把别的焦虑全塞进来。"
    ],
    enLead: "A platform asking you to choose one theme first is not being difficult. It is responding to the fact that chart lines already have different jobs.",
    enSecond: "The earlier you fix the main line, the easier it is for the answer to get specific.",
    enFocusPoints: [
      "Choosing a theme means choosing the real entrance to the chart.",
      "Once the theme is fixed, the reading order gets clearer too."
    ],
    enExamples: [
      "A city-move question may actually be about outside platform or about family-property structure.",
      "A money question may mean salary, repayment, side income, or investing, and those are not the same thing."
    ],
    enBoundaryPoints: [
      "More themes do not create more clarity in one question.",
      "Choosing one entrance does not stop later expansion; it just stops first-round dilution."
    ],
    enSteps: [
      "Write down the one theme you care about most now.",
      "Follow that theme into the relevant chart lines.",
      "Do not stuff every other worry into round one."
    ]
  },
  {
    slug: "ai-suanming-kan-liunian-weishenme-haiyao-huidao-benming",
    title: "AI算命看流年时为什么还要回到本命？别把今年当全部",
    enTitle: "Why Do You Still Need to Return to the Birth Chart When Using AI Fortune Telling for the Current Year? Do Not Treat This Year as Everything",
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: "很多人一问流年，就只盯今年会不会动，结果把本命底盘完全丢了。这样看起来像在抓时机，实际上很容易把“今年被触发”误读成“整个人都变了”。",
    second: "流年更像当前触发点，本命才是长期底色。两者不分开，回答不是夸大今年，就是忽略你真正能接住多少变化。",
    focusPoints: [
      "先看本命，是为了知道这条线你本来就强，还是今年只是短期被推到前台。",
      "再看流年，是为了判断当下的动作窗口和风险点，而不是把一年当成人生结论。"
    ],
    examples: [
      "比如今年财帛线被触发，不等于你从此就是财运大开，可能只是今年谈薪、回款和预算变成重心。",
      "今年迁移线动，也不一定是必须远走，有时只是平台、客户和外部环境变化更明显。"
    ],
    boundaryPoints: [
      "只看流年最容易把短期波动看成长期身份。",
      "只看本命又容易忽略今年正在发生的真实触发。"
    ],
    steps: [
      "先看本命这条线原本强弱。",
      "再看流年把哪件事推到台前。",
      "最后才判断今年该守还是该动。"
    ],
    enLead: "When people ask about the current year, they often stare at the yearly trigger and forget the base chart entirely.",
    enSecond: "The current year is a trigger. The birth chart is the long-term baseline. Mixing them creates distortion.",
    enFocusPoints: [
      "The base chart tells you whether this is already a strong line or only a temporary emphasis.",
      "The current year tells you what is activated now, not who you permanently become."
    ],
    enExamples: [
      "A wealth trigger may mean a year of salary, repayment, or budgeting focus, not permanent wealth identity.",
      "A travel trigger may mean outside-platform movement, not necessarily a full relocation."
    ],
    enBoundaryPoints: [
      "Year-only reading inflates short-term change.",
      "Base-only reading ignores live timing."
    ],
    enSteps: [
      "Read the base strength first.",
      "Read the yearly trigger second.",
      "Only then decide whether to push or hold."
    ]
  },
  {
    slug: "ai-suanming-zhuce-bu-tian-zhenming-keyima",
    title: "AI算命注册时不填真名可以吗？先分排盘必要信息和身份信息",
    enTitle: "Can You Skip Your Real Name When Registering for AI Fortune Telling? First Separate Chart-Necessary Data From Identity Data",
    group: "隐私与资料",
    enGroup: "Privacy & Data",
    lead: "很多人对名字最敏感，其实很正常。排盘真正必须的，通常是出生时间、出生地、性别这些结构信息；真名更多是账号识别、展示或联系层的事情。",
    second: "所以问题不该问成“能不能完全不填任何信息”，而该问成：哪些是排盘必要信息，哪些只是身份和服务信息。先把这两层分开，焦虑会小很多。",
    focusPoints: [
      "如果平台允许昵称、别名或留空真实姓名，这通常说明它把排盘结构和身份识别分得比较开。",
      "但如果你要同步会员、订单、记录和售后，账号层信息仍然会有自己的服务逻辑，不能和排盘层完全混成一层。"
    ],
    examples: [
      "比如你只是先试排一张盘，用昵称就很够；真正需要稳定登录和支付承接时，再看账号信息该怎么补。",
      "如果平台一上来就把真名、手机号和支付入口全绑在第一步，你就更应该先看隐私页和账号说明。"
    ],
    boundaryPoints: [
      "不用真名，不等于完全没有数据风险；只是风险点不同。",
      "能否用昵称是一个信号，但更重要的是平台是否把用途说明清楚。"
    ],
    steps: [
      "先区分排盘必要信息和账号信息。",
      "能用昵称先用昵称体验核心流程。",
      "需要长期同步时，再补账号层资料。"
    ],
    enLead: "Many users are most sensitive about their name, and that makes sense. The chart itself usually needs birth data more than real-name identity.",
    enSecond: "The better question is not 'can I enter nothing?' but 'which fields are structurally necessary and which belong to the account or service layer?'",
    enFocusPoints: [
      "A platform that allows nickname use is often separating chart structure from identity display more clearly.",
      "But account, payment, and support layers may still have their own service logic."
    ],
    enExamples: [
      "A nickname is often enough for a first chart trial.",
      "A first step that binds real name, phone, and payment immediately deserves extra privacy review."
    ],
    enBoundaryPoints: [
      "Skipping a real name does not erase all privacy risk.",
      "The larger issue is whether data use is clearly explained."
    ],
    enSteps: [
      "Separate chart fields from account fields.",
      "Use a nickname for the first core-flow test when possible.",
      "Add more account data only when long-term sync matters."
    ]
  },
  {
    slug: "ai-suanming-qingdiaobenji-jilu-hou-zhanghao-li-haiyou-shenme",
    title: "AI算命清掉本机记录后，账号里还会留什么？先看本地和云端怎么分",
    enTitle: "After You Clear Local AI Fortune-Telling Records, What Still Remains in the Account? First Separate Local Data From Cloud Data",
    group: "隐私与资料",
    enGroup: "Privacy & Data",
    lead: "很多人以为清掉浏览器里的记录，就等于整个平台都没数据了。其实本机记录和账号同步记录，本来就是两层东西，清掉一层不代表另一层自动一起消失。",
    second: "所以真正该问的，不是“能不能一键全没”，而是本地留什么、账号留什么、支付和会员又跟哪一层走。分清层级，才知道清理动作有没有做到位。",
    focusPoints: [
      "本地记录更像浏览器或设备层的缓存、历史和未登录状态资料，账号记录则更像登录后为了同步会员、订单、连续问答而保留的服务层信息。",
      "如果平台公开写了可清理本机记录、可联系删除账号资料，这已经比只给一个模糊按钮靠谱得多。"
    ],
    examples: [
      "比如你在公司电脑上排过盘，清浏览器缓存能减少本地暴露风险，但账号里同步过的订单和会员信息不一定一起消失。",
      "反过来，你联系删除账号资料，也不等于当前浏览器本地的历史提示就会自动清零。"
    ],
    boundaryPoints: [
      "清本机和删账号是两件事，别混着做。",
      "如果只做其中一步，就不要期待另一层也同步清理。"
    ],
    steps: [
      "先确认自己担心的是本地暴露，还是账号长期留存。",
      "本地问题先清设备和浏览器记录。",
      "账号问题再走官方删除或联系路径。"
    ],
    enLead: "Many users assume that clearing browser history means the platform now has no data at all, but local records and account-side records are usually different layers.",
    enSecond: "The real job is to ask what lives locally, what lives in the account, and what still follows membership or payment sync.",
    enFocusPoints: [
      "Local records belong to the device or browser layer.",
      "Account records belong to the logged-in sync and service layer."
    ],
    enExamples: [
      "Clearing a work computer reduces local exposure, but synced membership data may still exist in the account layer.",
      "Deleting account data does not always clear every local browser hint automatically."
    ],
    enBoundaryPoints: [
      "Clearing the device and deleting the account are different actions.",
      "Do not expect one step to silently finish the other."
    ],
    enSteps: [
      "Decide whether your risk is local exposure or long-term account storage.",
      "Clear the device layer first if it is local.",
      "Use the official deletion path for account-side issues."
    ]
  },
  {
    slug: "ai-suanming-liaotian-jilu-huibei-shuaren-fandao-ma",
    title: "AI算命聊天记录会不会被同事家人翻到？先看浏览器、本机和账号同步",
    enTitle: "Can Coworkers or Family Members See Your AI Fortune-Telling Chat History? First Check Browser Storage, Device Access, and Account Sync",
    group: "隐私与资料",
    enGroup: "Privacy & Data",
    lead: "担心聊天记录被别人翻到，通常不是玄学问题，而是设备和账号管理问题。你在哪个设备上问、有没有登录、记录是留在浏览器还是跟账号同步，风险完全不一样。",
    second: "如果先把这三层分开，本地暴露、账号暴露和售后数据就不会混成一个大恐慌。很多看起来像‘平台泄露’的担心，其实先发生在设备管理环节。",
    focusPoints: [
      "共用电脑最先要看浏览器本地记录和自动登录状态；私人手机则更该看账号是否会把记录同步到别的端。",
      "平台若公开说明未登录只保存本机、登录后同步会员和订单，这类规则就值得你优先核对。"
    ],
    examples: [
      "比如你在办公室电脑上试用，哪怕不登录，也要先看本机记录能不能清理，不然同事直接点开浏览器就可能看见痕迹。",
      "如果你在自己手机上登录过，又在家里平板上也登同一账号，那就要默认部分信息可能会跨端出现。"
    ],
    boundaryPoints: [
      "设备安全和平台安全是两层事，别全归到平台头上，也别因为平台有隐私页就忽略自己的设备习惯。",
      "只要是共用设备，就不该把默认状态当成安全状态。"
    ],
    steps: [
      "先确认当前设备是不是共用设备。",
      "再看是否登录、是否同步。",
      "最后决定清本机、退出账号还是两步都做。"
    ],
    enLead: "Worrying that coworkers or family might find your chat history is usually more about device and account handling than about metaphysics itself.",
    enSecond: "Where you asked, whether you logged in, and whether the record stays local or syncs to the account all change the risk shape.",
    enFocusPoints: [
      "Shared computers mainly raise local-browser and auto-login risk.",
      "Personal devices raise more account-sync questions."
    ],
    enExamples: [
      "On an office computer, local cleanup matters even if you never logged in.",
      "On multiple personal devices, shared account sync matters more."
    ],
    enBoundaryPoints: [
      "Device safety and platform safety are not the same layer.",
      "Shared-device defaults should never be treated as safe defaults."
    ],
    enSteps: [
      "Check whether the device is shared.",
      "Check login and sync status next.",
      "Decide whether you need local cleanup, account logout, or both."
    ]
  },
  {
    slug: "ai-suanming-zhifu-jietu-shouhou-anquanma",
    title: "AI算命支付截图提交售后安不安全？关键看用途和删除入口",
    enTitle: "Is It Safe to Submit a Payment Screenshot for AI Fortune-Telling Support? The Key Is Purpose and Deletion Path",
    group: "隐私与资料",
    enGroup: "Privacy & Data",
    lead: "支付截图本身并不神秘，但它往往会带着订单号、时间、支付渠道甚至部分身份信息。提交售后时，风险不在‘传不传’，而在平台有没有把用途、保存和删除路径说清楚。",
    second: "如果平台明确说明截图只用于退款或售后核验，并给出联系和删除入口，这比一句笼统‘请上传截图’要安心得多。"
    ,
    focusPoints: [
      "先看截图是为了什么。是确认订单归属、处理退款，还是只是笼统留档。用途越清晰，越容易判断值不值得配合。",
      "再看处理路径是不是闭环。上传后谁看、多久留、怎么联系删除，这些都该在售后说明里能找到。"
    ],
    examples: [
      "比如支付页直接挂着退款工单入口，并写明要上传支付成功截图，这种做法至少把用途讲清楚了。",
      "如果平台什么都不解释，只让你加私人联系方式发图，那就更该谨慎。"
    ],
    boundaryPoints: [
      "截图能少露就少露，不相关的信息能打码就打码。",
      "只要用途讲不清、删除路径不清楚，就没必要默认它安全。"
    ],
    steps: [
      "先确认截图提交用途。",
      "再找删除或联系入口。",
      "必要时对非必要信息打码后再提交。"
    ],
    enLead: "A payment screenshot is not automatically dangerous, but it often contains order numbers, timestamps, payment channels, and sometimes partial identity details.",
    enSecond: "The real safety question is whether the platform explains why it needs the screenshot and what happens after submission.",
    enFocusPoints: [
      "Check whether the screenshot is requested for a specific support purpose.",
      "Then check whether storage and deletion paths are explained."
    ],
    enExamples: [
      "A refund work-order path that clearly asks for a payment-success screenshot is easier to judge.",
      "A vague request to send the screenshot to a private contact deserves more caution."
    ],
    enBoundaryPoints: [
      "Mask irrelevant details when possible.",
      "If purpose and deletion path are unclear, do not assume the process is safe."
    ],
    enSteps: [
      "Confirm the purpose first.",
      "Find the deletion or contact path next.",
      "Mask nonessential details before submission when you can."
    ]
  },
  {
    slug: "ai-suanming-huan-shoujihao-youxiang-huiyuan-hai-zai-ma",
    title: "AI算命换手机号或邮箱后，原来的会员和记录还在吗？先看权益绑定规则",
    enTitle: "After You Change Your Phone Number or Email, Will Your AI Fortune-Telling Membership and Records Still Be There? First Check the Binding Rules",
    group: "隐私与资料",
    enGroup: "Privacy & Data",
    lead: "换手机号、换邮箱最容易让人慌的，不是命盘本身，而是会员和历史记录会不会跟着断掉。这个问题的关键不在玄学，在账号绑定规则。",
    second: "只要平台把权益跟当前登录账号绑定，而不是跟某个浏览器缓存绑死，资料迁移就有路径。怕的是你根本没搞清会员到底跟谁走。",
    focusPoints: [
      "先看平台写的是‘跟当前登录账号同步’，还是‘本机保存为主’。前者更适合长期切换设备和更新联系方式，后者更适合短期试用。",
      "再看有没有变更入口或客服说明。能不能改账号、怎么核验原有权益，这些都应该能在公开流程里找到。"
    ],
    examples: [
      "比如你原来用邮箱登录，现在准备改手机号登录，就要先确认账号体系是不是支持同一权益迁移。",
      "如果会员和订单都明确跟账号走，换联系方式后通常比换浏览器更好处理。"
    ],
    boundaryPoints: [
      "账号绑定规则不清时，不要先改再试。",
      "先确认规则，比事后补工单省心很多。"
    ],
    steps: [
      "先确认会员和记录是跟账号还是跟设备走。",
      "再找联系方式变更或客服说明。",
      "确认无误后再做切换。"
    ],
    enLead: "The real issue when changing phone number or email is not the chart. It is whether your membership and records are bound to an account structure that can follow the change.",
    enSecond: "If the platform clearly ties benefits to the logged-in account rather than only to one device, migration is much easier to reason about.",
    enFocusPoints: [
      "Check whether the benefit follows the account or the device first.",
      "Then check whether account-change instructions are visible."
    ],
    enExamples: [
      "Moving from email login to phone login is easier when the platform has a unified account system.",
      "Benefits that follow the account are usually easier to recover than benefits that live in local browser state."
    ],
    enBoundaryPoints: [
      "Do not change first and figure it out later if the binding rules are unclear.",
      "A rule check now saves a support ticket later."
    ],
    enSteps: [
      "Check what the membership follows.",
      "Find the change-account path next.",
      "Only then make the switch."
    ]
  },
  {
    slug: "ai-suanming-xian-paipan-zai-denglu-haishi-xian-denglu",
    title: "AI算命先排盘再登录，还是先登录再排盘？两种场景别混着看",
    enTitle: "Should You Generate the Chart First or Log In First for AI Fortune Telling? Do Not Mix Two Different Use Cases",
    group: "体验与流程",
    enGroup: "Experience & Flow",
    lead: "先排盘再登录，还是先登录再排盘，没有统一答案。关键不是顺序本身，而是你此刻是来‘先试一下’，还是来‘准备连续用一段时间’。",
    second: "试用型场景更适合先排盘，先确认自己有没有必要留下账号信息；连续使用型场景则更适合先登录，方便后面同步会员、订单和记录。",
    focusPoints: [
      "先排盘的优势，是把隐私和体验拆开，先看产品值不值碰。先登录的优势，是后续承接更顺，不用后面再补同步。",
      "只要你把这两个场景混着看，就容易觉得平台流程别扭：该简的时候太重，该承接的时候又太散。"
    ],
    examples: [
      "比如你今天只是想排一次盘看结构，先排再决定要不要登录，就很合理。",
      "如果你今天已经准备好围绕同一条线连续追问、甚至开通会员，那先登录反而能省后面很多重复步骤。"
    ],
    boundaryPoints: [
      "试用时不必强行把账号层一起开完。",
      "长期用时也不要一直停在游客状态，否则承接体验会打折。"
    ],
    steps: [
      "先判断自己是试用还是连续使用。",
      "试用型先排盘，长期型先登录。",
      "不要把两种顺序都套在一个目标上。"
    ],
    enLead: "There is no universal rule for chart-first versus login-first. The right order depends on whether you are just testing or preparing for ongoing use.",
    enSecond: "Testing users usually benefit from chart first. Continuity users usually benefit from login first.",
    enFocusPoints: [
      "Chart first separates product value from account commitment.",
      "Login first improves record, order, and membership carry-over."
    ],
    enExamples: [
      "A one-time structure check fits chart-first.",
      "A same-theme tracking session fits login-first."
    ],
    enBoundaryPoints: [
      "Trial mode does not need full account setup too early.",
      "Long-term use should not pretend guest mode is enough forever."
    ],
    enSteps: [
      "Decide whether you are testing or tracking.",
      "Use chart-first for testing and login-first for continuity.",
      "Do not judge both flows by the same goal."
    ]
  },
  {
    slug: "ai-suanming-yitian-duoci-zhuiwen-zenme-paishunxu",
    title: "AI算命一天里多次追问怎么排顺序？先主线，后分支，最后才看总评",
    enTitle: "How Should You Order Multiple AI Fortune-Telling Follow-Ups in One Day? Main Line First, Branches Second, Summary Last",
    group: "体验与流程",
    enGroup: "Experience & Flow",
    lead: "一天里问很多次，并不一定低效，低效的是顺序乱。先问总评、再问细节、再换主题，最后很容易把自己也问晕。",
    second: "更稳的顺序通常是：先抓主线，再问分支，最后才回到总结。这样做的好处，是每一次追问都在给前一次补结构，而不是互相打断。",
    focusPoints: [
      "主线应该是你最急、最真、最有现实动作的那一条，比如工作、现金流或关系推进。",
      "分支则是围绕主线展开的细问，比如平台还是岗位、节奏还是边界、回款还是预算。总评放最后，才不会先把你带偏。"
    ],
    examples: [
      "比如你今天核心是换岗，那就先问换不换，再问岗位与平台，再问今年时机，最后才问整体走势。",
      "如果你先问整体走势，再跳去感情，再回工作，AI 再强也容易被你自己打乱节奏。"
    ],
    boundaryPoints: [
      "追问多不怕，主题乱才怕。",
      "总评适合收尾，不适合开场。"
    ],
    steps: [
      "第一问抓主线。",
      "第二第三问只围绕主线细化。",
      "确认结构后，最后再看总结类问题。"
    ],
    enLead: "Many follow-ups in one day are not automatically inefficient. The problem usually comes from a chaotic order.",
    enSecond: "A steadier sequence is main line first, branches second, and broad summary last.",
    enFocusPoints: [
      "The main line should be the issue with the strongest real-world action attached to it.",
      "Branch questions should refine that line instead of jumping away from it."
    ],
    enExamples: [
      "A job-move day should go move first, role-versus-platform second, timing third, and summary last.",
      "Jumping from summary to relationships to work and back again usually creates noise."
    ],
    enBoundaryPoints: [
      "Many questions are okay; random themes are not.",
      "Summary works better as a closing move than as an opener."
    ],
    enSteps: [
      "Use question one for the main line.",
      "Use questions two and three to refine only that line.",
      "Ask summary questions only after the structure is clear."
    ]
  },
  {
    slug: "ai-suanming-di-ertian-shuaxin-haiyao-buyao-zhongjiang-beijing",
    title: "AI算命第二天额度刷新后要不要重讲背景？先看记录承接做得好不好",
    enTitle: "After the Quota Refreshes the Next Day in AI Fortune Telling, Do You Need to Retell the Background? First Check How Well the Record Carry-Over Works",
    group: "体验与流程",
    enGroup: "Experience & Flow",
    lead: "第二天额度刷新，不代表所有上下文都自动刷新成零。要不要重讲背景，关键看平台的记录承接做到哪一层，而不是只看次数回来了没有。",
    second: "有的平台能承接同一张盘和同一账号下的连续问题，有的平台则更像每天重新开始。先看清这点，才知道你该补的是哪部分背景。",
    focusPoints: [
      "先区分盘面背景和问题背景。盘面若已承接，你不一定要重讲出生资料；但当前事件如果有新进展，还是该补上最新条件。",
      "再看记录承接是本地还是账号级。如果你换了设备或浏览器，哪怕额度刷新，承接体验也可能完全不同。"
    ],
    examples: [
      "比如你昨天已经把工作问题讲到平台和岗位的差别了，今天只需要补一句‘昨天面试完，今天收到新反馈’，不必从零再排一次盘。",
      "反过来，如果你换到另一台设备上问，哪怕还是同一天主题，也可能需要先确认记录有没有同步过来。"
    ],
    boundaryPoints: [
      "刷新的是额度，不一定是上下文。",
      "重复讲背景不是坏事，关键是别把不该重复的也全重来。"
    ],
    steps: [
      "先确认盘和记录有没有承接。",
      "只补当天新变化，不全盘重讲。",
      "换端时优先检查同步状态。"
    ],
    enLead: "A quota refresh does not automatically mean all context resets to zero. Whether you need to retell the background depends on how continuity actually works.",
    enSecond: "Some platforms carry the same chart and account context forward better than others. The quota and the context are not the same thing.",
    enFocusPoints: [
      "Separate chart background from event background first.",
      "Then check whether continuity is local-only or account-level."
    ],
    enExamples: [
      "If yesterday’s work question already established the role-versus-platform issue, today you may only need to add the new interview result.",
      "Switching devices can still break continuity even when the daily quota has refreshed."
    ],
    enBoundaryPoints: [
      "Quota refresh and context reset are different events.",
      "Retelling everything is often unnecessary if the chart and thread already carry over."
    ],
    enSteps: [
      "Check continuity first.",
      "Add only the new development.",
      "Inspect sync status when you change devices."
    ]
  },
  {
    slug: "ai-suanming-lianxu-zhuiwen-qian-yaobuyao-xian-baocun-mingpan",
    title: "AI算命连续追问前要不要先保存命盘？不然很容易每次重来",
    enTitle: "Should You Save the Chart Before Continuous AI Fortune-Telling Follow-Ups? Otherwise You May Keep Restarting From Zero",
    group: "体验与流程",
    enGroup: "Experience & Flow",
    lead: "连续追问最怕的，不是次数不够，而是每次都从“我是谁、我什么时候出生、我现在卡什么”重新开始。真正拖慢效率的，往往是没有先把命盘固定下来。",
    second: "先保存命盘，不是形式感，而是把后面的所有追问都绑到同一个底盘上。这样你问工作、关系、钱和流年时，才是在沿着一条线往下走。",
    focusPoints: [
      "保存命盘能减少重复输入，也能降低你自己在不同轮里把前提说乱的概率。",
      "如果平台支持账号同步或本机保存，先确认保存路径，再开始连续追问，会比问到一半才想起记录问题更顺。"
    ],
    examples: [
      "比如你今天想围绕创业问三轮，若第一轮后命盘没固定，第二轮就很容易开始怀疑自己是不是时辰又输错了。",
      "关系题也是一样。盘先稳住，再追问节奏和边界，效率会明显高很多。"
    ],
    boundaryPoints: [
      "保存命盘不是为了囤记录，而是为了保证后续所有提问都站在同一底盘上。",
      "如果你根本不打算连续追问，那保存需求就没那么高。"
    ],
    steps: [
      "先确认命盘已固定或可回看。",
      "再开始连续追主线问题。",
      "中途换端时，优先检查盘是否还一致。"
    ],
    enLead: "The real danger in repeated follow-up is not always running out of quota. It is having to restart your identity, birth data, and live issue every single time.",
    enSecond: "Saving the chart first ties later questions back to the same base instead of letting each round drift.",
    enFocusPoints: [
      "A saved chart reduces repeated input and repeated confusion.",
      "Confirm the save path before starting a same-theme follow-up run."
    ],
    enExamples: [
      "A startup question asked across three rounds becomes much cleaner when the chart is already fixed.",
      "Relationship pacing questions also get easier when the base does not keep moving."
    ],
    enBoundaryPoints: [
      "Saving the chart is mainly about continuity, not about hoarding records.",
      "If you will not follow up continuously, the need is smaller."
    ],
    enSteps: [
      "Confirm the chart can be revisited.",
      "Then start the follow-up run.",
      "Recheck chart consistency when you change devices."
    ]
  },
  {
    slug: "ai-suanming-kan-huilaojia-fazhan-shihema",
    title: "AI算命适不适合看要不要回老家发展？重点不在近远，在平台和牵挂怎么连",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Return to Your Hometown for Development? The Key Is Not Distance but How Platform and Family Ties Connect",
    group: "使用场景",
    enGroup: "Use Cases",
    lead: "回老家发展，不是简单的远近题。它往往同时牵到迁移、田宅、官禄和家庭关系，问法一粗，就会被压成一句“适合回去”或“不适合回去”。",
    second: "更稳的判断，是先分你回去是为了平台转换、生活稳定、照顾家人，还是成本压力。动机一变，盘里该看的线就跟着变。",
    focusPoints: [
      "先看迁移和官禄，是回去后平台和工作结构会不会更顺；再看田宅和家庭牵挂，是不是生活稳定需求在前面。",
      "如果只盯“老家”两个字，就容易忽略真正该问的是资源承接、收入结构和日常压力。"
    ],
    examples: [
      "比如有的人回去不是因为更适合躺平，而是因为家里已有现成平台和资源入口。",
      "也有人回去后生活稳了，但工作出口反而窄，这就说明迁移和官禄没有真正接上。"
    ],
    boundaryPoints: [
      "回老家不是天然保守，也不是天然后退。",
      "盘里只要几条线没拆开，就很容易把家庭牵挂误当成事业方向。"
    ],
    steps: [
      "先说清自己回去的主要动机。",
      "再问平台、收入和家庭哪条线最先受影响。",
      "最后才判断值不值得动。"
    ],
    enLead: "Returning to your hometown is not simply a distance question. It often touches travel, property, career, and family at the same time.",
    enSecond: "The steadier way to ask is to separate the motive first, because different motives activate different lines.",
    enFocusPoints: [
      "Start with travel and career to judge platform flow.",
      "Then use property and family lines to judge living stability and attachment."
    ],
    enExamples: [
      "Some users return because family already provides a real platform and resource path.",
      "Others gain living stability but lose career outlet, which is a different picture."
    ],
    enBoundaryPoints: [
      "Going home is not automatically conservative or backward.",
      "Untangled family ties should not be mistaken for a clean career signal."
    ],
    enSteps: [
      "Name the main motive first.",
      "Ask which line changes first: platform, income, or family pressure.",
      "Only then judge the move."
    ]
  },
  {
    slug: "ai-suanming-kan-yuancheng-bangong-jiajiu-jiedan",
    title: "AI算命适不适合看远程办公或居家接单？先分工作形态和收入来源",
    enTitle: "Is AI Fortune Telling Useful for Remote Work or Home-Based Freelance Questions? Start by Separating Work Form From Income Source",
    group: "使用场景",
    enGroup: "Use Cases",
    lead: "远程办公和居家接单，表面都像“在家工作”，但盘里问法不该混成一件事。前者更像工作形态变化，后者更像收入来源和客户结构变化。",
    second: "如果不先拆工作形态和收入来源，AI 很容易只说适合自由一点，却忽略了你真正关心的是稳定、平台还是现金流。"
    ,
    focusPoints: [
      "远程办公更常牵官禄和迁移，重点看职责、协作和外部平台；居家接单则更常牵财帛、迁移和朋友宫，重点看客户入口、回款和合作边界。",
      "能不能在家工作，不是唯一问题。更重要的是这种工作方式会不会让你赚得更稳、心更累，还是只是看起来自由。"
    ],
    examples: [
      "比如有人适合远程，是因为平台资源强、沟通结构顺；不一定适合自己单独接单。",
      "也有人很适合接外部客户，但放进大组织远程协作时反而容易消耗。"
    ],
    boundaryPoints: [
      "自由感不是判断标准，承接结构才是。",
      "同样在家工作，远程上班和独立接单不是一条盘线。"
    ],
    steps: [
      "先区分自己问的是远程职位还是居家接单。",
      "再问平台、客户和现金流哪条线更关键。",
      "最后才看要不要切换形态。"
    ],
    enLead: "Remote work and home-based freelance work may both look like 'working from home,' but they are not the same chart question.",
    enSecond: "If you do not separate work form from income source, the answer easily turns into vague talk about freedom.",
    enFocusPoints: [
      "Remote work leans more toward role and platform structure.",
      "Home-based client work leans more toward income entry, client flow, and money boundaries."
    ],
    enExamples: [
      "Some users are suited to remote roles inside a strong platform but not to solo client work.",
      "Others handle outside-client work well but burn out inside large remote team structures."
    ],
    enBoundaryPoints: [
      "Freedom is not the real metric; support structure is.",
      "Remote employment and solo client work should not be read as the same line."
    ],
    enSteps: [
      "Separate remote role from solo client work first.",
      "Ask whether platform, clients, or cash flow matters most.",
      "Only then judge the switch."
    ]
  },
  {
    slug: "ai-suanming-kan-fuqi-hepan-xian-kan-shenme",
    title: "AI算命适不适合看夫妻合盘？先看各自底盘，再谈关系推进",
    enTitle: "Is AI Fortune Telling Useful for Spouse Compatibility Reading? First Read Each Base Chart, Then Talk About Relationship Progress",
    group: "使用场景",
    enGroup: "Use Cases",
    lead: "看夫妻合盘，不是把两个人的信息一丢就等着一个结论。更实用的顺序，是先看各自底盘，再去看两个人怎么互相触发、互相放大。",
    second: "如果各自底盘都没站稳，关系推进问题很容易被误读。很多所谓‘合不合’，其实是一个人的节奏问题、另一个人的边界问题，被强行压成一条关系判断。",
    focusPoints: [
      "先看各自夫妻线、福德线和当前阶段，再去看互动，这比一上来只追一个‘能不能成’更稳。",
      "合盘最有用的地方，不是直接宣布结果，而是帮你看关系里最常卡的是推进、沟通、距离还是家庭牵挂。"
    ],
    examples: [
      "比如一个人底盘就偏慢、偏谨慎，另一个人当前流年又很急，这种错位常常比所谓缘分标签更解释现实。",
      "如果两个人都在变动期，关系的不稳也可能来自外部节奏，不一定只是两个人本身不合。"
    ],
    boundaryPoints: [
      "合盘适合看互动结构，不适合替代现实沟通。",
      "只要两个人输入精度差太大，关系结论就该留在方向层。"
    ],
    steps: [
      "先各自看底盘。",
      "再看互动最常卡在哪条线。",
      "最后把判断放回现实推进和沟通。"
    ],
    enLead: "Compatibility work is more useful when it starts from each base chart instead of jumping straight to one relationship verdict.",
    enSecond: "Many 'are we compatible?' worries are really two different personal patterns colliding, not one simple relationship label.",
    enFocusPoints: [
      "Read each person’s spouse, inner-life, and timing lines first.",
      "Use compatibility reading to spot the main friction pattern rather than to replace communication."
    ],
    enExamples: [
      "A slow base pattern meeting a fast current-year pattern can explain mismatch better than a vague fate label.",
      "Two people in high-change periods may look unstable because of outside timing, not only because of poor fit."
    ],
    enBoundaryPoints: [
      "Compatibility reading helps with structure, not with replacing real communication.",
      "If the input precision is uneven, keep the conclusion at the direction level."
    ],
    enSteps: [
      "Read each base chart first.",
      "Then identify the main interaction friction.",
      "Return the judgment to real-world pace and communication."
    ]
  },
  {
    slug: "ai-suanming-kan-hezuo-fenzhang-huikuan-shihema",
    title: "AI算命适不适合看合作分账和回款？先看钱线，不要只问能不能合作",
    enTitle: "Is AI Fortune Telling Useful for Cooperation Splits and Repayment Questions? Start With the Money Line, Not Only With 'Can We Work Together?'",
    group: "使用场景",
    enGroup: "Use Cases",
    lead: "合作分账和回款，不该只问“能不能合作”。真正危险的地方，常常不在合不合，而在钱怎么走、账怎么回、规则谁来定。",
    second: "这类题如果只问合作感受，很容易漏掉财帛、朋友宫、官禄和今年现金流触发。把钱线摆出来，才会知道风险到底在哪。"
    ,
    focusPoints: [
      "先看财帛，是回款节奏、账期压力还是现金流承接；再看朋友宫和官禄，是合作分工和规则能不能立住。",
      "很多看似关系问题的合作，最后真正出事的点都在分账、结算和退出机制。"
    ],
    examples: [
      "比如双方关系很好，但财帛线吃紧、官禄规则又弱，这时合作能不能做，和钱怎么收回来，往往不是同一个答案。",
      "如果今年流年刚好触发财务议题，再叠上朋友线起波动，就更该先看回款和分账。"
    ],
    boundaryPoints: [
      "AI 可以帮你拆风险，但替不了合同和账本。",
      "只问关系好不好，最容易漏掉真成本。"
    ],
    steps: [
      "先把合作问题改成分账和回款问题。",
      "再看合作规则和退出机制。",
      "最后才判断值不值得推进。"
    ],
    enLead: "Questions about cooperation splits and repayment should not stay at 'can we work together?' The real risk often lives in how money moves.",
    enSecond: "Once you put the money line on the table, the question becomes much more concrete.",
    enFocusPoints: [
      "Start with wealth and cash-flow lines first.",
      "Then read partner, role, and rule structure."
    ],
    enExamples: [
      "People can get along well and still have weak repayment structure.",
      "A year with active money issues makes split and repayment questions even more important."
    ],
    enBoundaryPoints: [
      "AI can expose risk structure, but it cannot replace contracts or accounting.",
      "Relationship comfort alone is a poor screen for cooperation money risk."
    ],
    enSteps: [
      "Reframe the issue as a split-and-repayment question.",
      "Check rule and exit structure next.",
      "Only then decide whether to proceed."
    ]
  },
  {
    slug: "ai-suanming-kan-duanqi-huikuan-yong-zishui-baziliuyao",
    title: "AI算命看短期回款问题，紫微、八字、六爻该先用哪个？先看你问的是节奏还是一件事",
    enTitle: "For Short-Term Repayment Questions in AI Fortune Telling, Should You Start With Zi Wei, Ba Zi, or Liu Yao? First Decide Whether You Are Asking About Rhythm or One Event",
    group: "方法与术数",
    enGroup: "Method & Systems",
    lead: "短期回款问题最容易把工具用混。你问的是这笔钱眼下能不能回来，还是你这段时间整体回款节奏为什么老卡，这两种问题本来就不该先用同一把工具。",
    second: "如果不先分‘一件事’和‘一段节奏’，紫微、八字、六爻就很容易看起来各说各话。其实不是它们互相打架，是问题形状没先分开。",
    focusPoints: [
      "问一件眼前具体回款、付款、要不要催单的事，更像单件事判断；问这段时间为什么总是账期拖、钱来得慢，更像节奏和结构问题。",
      "紫微更适合看财富结构、朋友合作和平台承接；八字更常补阶段冷热和节奏感；六爻则更贴单件事的当下切面。"
    ],
    examples: [
      "比如你今天就在等一笔款是否能推进，这种一事一问就不该硬压成长期财富性格题。",
      "反过来，如果你半年里回款总出问题，那只问今天这一单，反而会漏掉长期结构。"
    ],
    boundaryPoints: [
      "先分问题形状，比先争哪套更高级重要得多。",
      "同一个工具也能给参考，但先后顺序不对，结论就会显得乱。"
    ],
    steps: [
      "先判断自己问的是单件事还是一段节奏。",
      "单件事先用更贴当下的工具，结构题先回到长期盘。",
      "必要时再用另一套补充，不要一开始全堆上。"
    ],
    enLead: "Short-term repayment questions often go wrong because the tool choice starts before the question shape is even defined.",
    enSecond: "A one-event repayment question is not the same as a longer rhythm question about why money keeps getting stuck.",
    enFocusPoints: [
      "Separate event questions from rhythm questions first.",
      "Zi Wei, Ba Zi, and Liu Yao help differently depending on that split."
    ],
    enExamples: [
      "Waiting for one payment to land is not the same thing as asking why repayment has been slow for half a year.",
      "A single-event tool can miss the long pattern, and a long-pattern tool can overcomplicate one event."
    ],
    enBoundaryPoints: [
      "Question shape matters more than which system sounds more advanced.",
      "Using every tool at once usually creates noise before it creates clarity."
    ],
    enSteps: [
      "Name whether this is one event or one rhythm.",
      "Match the first tool to that shape.",
      "Add a second tool only if a real gap remains."
    ]
  }
];

function zhAuto(seed, facts) {
  const focusPoints = [];
  const examples = [];
  const boundaryPoints = [];

  if (seed.group === "免费与付费") {
    focusPoints.push(`当前公开信息能核到的边界是：未登录每天 ${facts.guestDaily} 次、登录免费每天 ${facts.loginDaily} 次、会员每天 ${facts.memberDaily} 次，当前会员价 ${facts.memberPrice} 元。先把边界看清，再谈值不值。`);
  }

  if (seed.group === "输入与方法" || seed.group === "使用场景" || seed.group === "判断与靠谱") {
    focusPoints.push("紫微类问题最好别只盯一句总评。命宫看底色，财帛看资源和现金感，官禄看职责和位置，迁移看平台和外部机会，三方四正连起来看才更稳。");
  }

  if (seed.group === "隐私与资料" || seed.group === "体验与流程") {
    examples.push(`当前公开页至少能核到隐私联系邮箱 ${facts.privacyEmail}，也能看到登录、支付、会员和记录承接相关说明。能找到责任入口，通常比找不到联系路径更让人放心。`);
  }

  if (seed.group === "方法与术数") {
    boundaryPoints.push("工具没有谁天然更高级，关键是问题形状要先分开：结构题、阶段题和单件事，本来就不该强行用同一把尺子量。");
  }

  focusPoints.push("真正能用的回答，通常会把“为什么这样看”“接下来先验证什么”“什么地方暂时别下结论”说清，而不是只给一句情绪安慰。");
  examples.push("如果一段分析能同时落到盘面位置、现实场景和下一步验证动作，你后面复盘时更容易判断它是在读结构，还是只是在顺着你的担心说话。");
  boundaryPoints.push("无论免费还是付费，越是让你先看规则、先做小范围验证、再决定要不要继续，越说明它想建立长期信任，而不是只吃一次情绪消费。");

  return { focusPoints, examples, boundaryPoints };
}

function enAuto(seed, facts) {
  const enFocusPoints = [];
  const enExamples = [];
  const enBoundaryPoints = [];

  if (seed.group === "免费与付费") {
    enFocusPoints.push(`The current public boundary can be checked as ${facts.guestDaily} guest uses a day, ${facts.loginDaily} free logged-in uses a day, ${facts.memberDaily} member uses a day, and a current member price of ${facts.memberPrice} RMB.`);
  }

  if (seed.group === "输入与方法" || seed.group === "使用场景" || seed.group === "判断与靠谱") {
    enFocusPoints.push("Zi Wei style questions work better when life pattern, wealth, career, outside platform, and timing are read together instead of being flattened into one slogan.");
  }

  if (seed.group === "隐私与资料" || seed.group === "体验与流程") {
    enExamples.push(`The current public contact path can be checked through ${facts.privacyEmail}, which is a stronger trust signal than having no visible responsibility channel at all.`);
  }

  if (seed.group === "方法与术数") {
    enBoundaryPoints.push("No system is automatically superior in all cases. Matching the tool to the question shape matters more than ranking systems in the abstract.");
  }

  enFocusPoints.push("The more useful answer usually explains why it is reading the chart that way, what to verify next, and where not to over-claim.");
  enExamples.push("When a reading lands on chart structure, a real-life scenario, and a next verification step at the same time, it becomes much easier to judge whether it is actually useful.");
  enBoundaryPoints.push("Whether the layer is free or paid, a safer product lets you verify in a small scope before asking for deeper commitment.");

  return { enFocusPoints, enExamples, enBoundaryPoints };
}

function buildArticle(seed, index, batchDate, uniqueTimes, facts) {
  const zhExtra = zhAuto(seed, facts);
  const enExtra = enAuto(seed, facts);
  return {
    ...ZH_DEFAULT_HEADINGS,
    ...EN_DEFAULT_HEADINGS,
    ...seed,
    focusPoints: [...seed.focusPoints, ...zhExtra.focusPoints],
    examples: [...seed.examples, ...zhExtra.examples],
    boundaryPoints: [...seed.boundaryPoints, ...zhExtra.boundaryPoints],
    enFocusPoints: [...seed.enFocusPoints, ...enExtra.enFocusPoints],
    enExamples: [...seed.enExamples, ...enExtra.enExamples],
    enBoundaryPoints: [...seed.enBoundaryPoints, ...enExtra.enBoundaryPoints],
    time: uniqueTimes[index],
    order: index + 1,
    publishedAt: `${batchDate}T${uniqueTimes[index]}:00+08:00`,
    section: "AI算命问答",
    enSection: seed.enGroup
  };
}

export function buildAiSearchQaBatch({ batchDate, uniqueTimes, facts }) {
  if (uniqueTimes.length !== DAY4_SEEDS.length) {
    throw new Error(`Expected ${DAY4_SEEDS.length} publish times, got ${uniqueTimes.length}`);
  }
  return DAY4_SEEDS.map((seed, index) => buildArticle(seed, index, batchDate, uniqueTimes, facts));
}
