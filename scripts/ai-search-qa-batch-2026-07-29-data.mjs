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

const DAY5_SEEDS = [
  {
    slug: "ai-suanming-zong-shi-liangbian-doudui-zenme-kan",
    title: "AI算命总把话说成“两边都对”靠谱吗？先看有没有明确排除项",
    enTitle: "Is It Reliable When AI Fortune Telling Keeps Saying 'Both Sides Could Be Right'? First Check for Clear Exclusions",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "如果一个 AI 算命工具总把话说得两边都能接住，听起来像留有余地，实际上也可能是在回避判断。真正稳的回答，不一定最绝对，但至少会告诉你哪条路现在更顺，哪条路暂时不建议硬推。",
    second: "关键不是它有没有保留空间，而是它有没有给出排除项。能说出“这一步先别做”“这个条件不成立时不要往下推”，往往比一堆圆滑话更接近可用判断。",
    focusPoints: [
      "判断靠不靠谱，先看它会不会主动排除。比如工作题里，它能不能说清是平台资源暂时接不住，还是你自己还没准备好，而不是两边都说一点。"
    ],
    examples: [
      "像“要不要换岗”这种题，如果它既说可以试，又说也可以再等等，却不解释分别对应什么条件，你后面根本没法验证它有没有在读盘。"
    ],
    boundaryPoints: [
      "留余地不等于没判断。真正该警惕的，是它永远不给你排除项，也不给你优先级。"
    ],
    steps: [
      "先追问它当前更不建议哪条路。",
      "再追问这个排除是基于哪条盘面线索。",
      "最后用你手头最现实的条件去核对。"
    ],
    enLead: "If an AI fortune-telling tool keeps leaving every door half open, that may sound careful, but it can also mean it is avoiding a real judgment.",
    enSecond: "The real test is whether it can name an exclusion, not whether it sounds flexible.",
    enFocusPoints: [
      "A steadier answer can say which path should be paused first instead of keeping every option equally safe."
    ],
    enExamples: [
      "On a job-move question, 'maybe move, maybe wait' is weak unless it explains what condition makes one side more likely."
    ],
    enBoundaryPoints: [
      "Flexibility is not the same thing as usefulness if no exclusion is ever named."
    ],
    enSteps: [
      "Ask which path it currently does not recommend.",
      "Ask what chart clue supports that exclusion.",
      "Check that clue against your real situation."
    ]
  },
  {
    slug: "ai-suanming-buzhi-shuobuhao-zhishuo-keyishi",
    title: "AI算命只说“可以试试”却不说“不适合”靠谱吗？先看有没有风险提醒",
    enTitle: "Is It Reliable When AI Fortune Telling Only Says 'You Can Try' but Never 'Not Suitable'? Check for Risk Warnings First",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "很多平台最会说的一句话，就是“可以试试”。这句话本身不一定错，但如果它从不说“不适合”“先别动”“这一段风险更大”，那它更像在保住你的好感，而不是在帮你判断。",
    second: "真正有用的回答，不只是给你希望，还会给你刹车点。能不能把风险提醒讲清，往往比它说得顺不顺耳更重要。",
    focusPoints: [
      "尤其是跳槽、创业、合作这种高代价问题，只讲“可以试试”却不讲代价，会让人误把鼓励当成判断。"
    ],
    examples: [
      "比如它建议你今年可以动，但如果不继续说明现金流、责任位或家庭牵挂哪一项会成为压力，这个“可以”就太轻了。"
    ],
    boundaryPoints: [
      "一个从不提醒风险的工具，往往不是更准，而是更不愿意承担判断重量。"
    ],
    steps: [
      "先问它最该防的风险在哪一层。",
      "再问这个风险会先表现成什么现实信号。",
      "确认有了风险图，再决定要不要继续用。"
    ],
    enLead: "Many tools are happy to say 'you can try,' but a better reading also knows when to say 'not yet' or 'not this way.'",
    enSecond: "Risk warnings often tell you more than encouragement does.",
    enFocusPoints: [
      "High-cost questions need both a green light and a brake point."
    ],
    enExamples: [
      "Saying 'you can move this year' is weak if it never explains where the pressure or cost will show up first."
    ],
    enBoundaryPoints: [
      "A tool that never warns may be protecting mood more than giving judgment."
    ],
    enSteps: [
      "Ask where the main risk sits.",
      "Ask what real-world sign would show it first.",
      "Decide only after the risk map becomes concrete."
    ]
  },
  {
    slug: "ai-suanming-zishuoduo-jiushi-zhunma",
    title: "AI算命字数越多就越准吗？先看结构，不是先看篇幅",
    enTitle: "Does a Longer AI Fortune-Telling Answer Mean It Is More Accurate? Check Structure Before Length",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "很多人一看到篇幅长，就觉得这份 AI 算命报告更认真。其实真正该看的，不是写了多少，而是有没有把问题拆成结构、场景和下一步验证。",
    second: "字数只是包装层，结构才是骨架。没有骨架的长文，常常只是把同一句空话换着说几遍。",
    focusPoints: [
      "事业、感情、财务如果都用同一种语气往下铺，再长也还是同一团话。真正有价值的长文，会把线索分开。"
    ],
    examples: [
      "比如问财务，它应该分收入来源、现金流压力和今年触发点，而不是只把“你会越来越好”写成三段。"
    ],
    boundaryPoints: [
      "别把耐心阅读和判断质量混成一件事。长文只在结构清楚时才会加分。"
    ],
    steps: [
      "先挑出文里最具体的三句。",
      "再看这三句是不是落在不同结构层上。",
      "最后决定这篇长文值不值得继续参考。"
    ],
    enLead: "A longer AI fortune-telling answer can feel more serious, but length alone does not create structure.",
    enSecond: "The real question is whether the answer separates the issue into useful layers instead of repeating the same mood in more words.",
    enFocusPoints: [
      "Long form only helps when career, money, timing, or relationship lines are actually separated."
    ],
    enExamples: [
      "A wealth answer should split income source, cash pressure, and timing trigger, not repeat one hopeful sentence three ways."
    ],
    enBoundaryPoints: [
      "Reading for longer is not the same thing as getting a better judgment."
    ],
    enSteps: [
      "Pull out the three most concrete lines.",
      "See whether they land on different structural layers.",
      "Judge the report from that, not from word count."
    ]
  },
  {
    slug: "ai-suanming-shanglai-jiu-kua-ni-minghao",
    title: "AI算命一上来就夸你命好正常吗？先看它会不会讲代价",
    enTitle: "Is It Normal When AI Fortune Telling Praises Your Chart Right Away? First See Whether It Talks About Cost",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "一开口就夸你命格好、前景好、贵人多，当然很容易让人舒服。但真正稳的判断，不会只给高位词，还会告诉你这些优势要靠什么条件落地，会在哪些地方消耗。",
    second: "只会夸，不会讲代价，通常不是真懂你，而是不想让你产生阻力。命盘里再好的线，也需要时间、位置和现实承接。",
    focusPoints: [
      "比如说你有事业运，它就该继续讲清是更吃平台、职位还是专业口碑，而不是停在“你以后会起来”。"
    ],
    examples: [
      "同样说有财运，如果它不继续区分正财、偏财、现金流和风险承受，这种夸奖几乎没法拿来做决定。"
    ],
    boundaryPoints: [
      "好词不等于假，但没有代价说明的好词，参考价值一定会打折。"
    ],
    steps: [
      "先把它夸你的那句单独拎出来。",
      "再追问这份优势最怕什么拖累。",
      "如果代价答不出来，就降低对这句夸奖的权重。"
    ],
    enLead: "An opening full of praise can feel reassuring, but a steadier reading also explains what that advantage depends on and what it costs.",
    enSecond: "A good chart line still needs real-world support before it becomes useful.",
    enFocusPoints: [
      "Praise is only meaningful if it can be tied to platform, role, skill, or timing."
    ],
    enExamples: [
      "Saying 'you have wealth luck' means little if it never splits stable income, side income, and cash-flow pressure."
    ],
    enBoundaryPoints: [
      "Positive language is not the problem. Unsupported praise is."
    ],
    enSteps: [
      "Pull out the strongest praise line.",
      "Ask what can weaken it first.",
      "Lower its weight if no cost or drag is named."
    ]
  },
  {
    slug: "ai-suanming-bu-zhuiwen-jiu-gei-jielun",
    title: "AI算命不追问就直接下结论正常吗？先看条件有没有问够",
    enTitle: "Is It Normal for AI Fortune Telling to Jump to a Conclusion Without Follow-Up Questions? First Check Whether It Asked Enough Conditions",
    group: "判断与靠谱",
    enGroup: "Reliability & Choice",
    lead: "有些问题确实可以一步给方向，但很多现实题如果完全不追问背景，就很容易把不同情境的人答成同一种结论。尤其是换岗、合作、关系推进这种题，条件不够，判断就会发飘。",
    second: "真正稳的 AI，不一定要问很多句，但至少会确认你是在问哪一段时间、哪一个选择、哪一种现实约束。条件问不够，结论就很难站稳。",
    focusPoints: [
      "你要看的不是它问得多不多，而是有没有问到决定判断的那一层，比如时间边界、问题主题和现实卡点。"
    ],
    examples: [
      "同样是问要不要跳槽，不问你现在卡在收入、岗位还是城市，就直接说“适合动”，这种判断通常太粗。"
    ],
    boundaryPoints: [
      "快不等于好。跳过关键条件的快，往往只是把误差提前。"
    ],
    steps: [
      "先补一条最关键的背景条件。",
      "再看它的结论有没有明显变化。",
      "如果前后几乎不变，就要怀疑它没真的接住问题。"
    ],
    enLead: "Some questions can take a quick first direction, but many real-life decisions become sloppy when no key condition is checked first.",
    enSecond: "What matters is not the number of follow-up questions. It is whether the decisive condition was asked at all.",
    enFocusPoints: [
      "Good questioning should lock time window, theme, or real-world constraint before it lands on a verdict."
    ],
    enExamples: [
      "A job-change answer is weak if it never asks whether the real problem is money, role, or city."
    ],
    enBoundaryPoints: [
      "Fast is not automatically good when the key condition was skipped."
    ],
    enSteps: [
      "Add the most important missing condition.",
      "Check whether the answer changes after that.",
      "Question the tool if the answer barely moves."
    ]
  },
  {
    slug: "ai-suanming-youke-yongwan-yaobuyao-zhuce",
    title: "AI算命游客次数用完后先注册还是先停一下？先做一轮验真",
    enTitle: "After Your Guest AI Fortune-Telling Quota Runs Out, Should You Register Right Away or Pause First? Do One Verification Round First",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    lead: "游客次数用完，最容易让人冲动的一步，就是立刻去注册继续问。但更稳的做法，通常不是先追次数，而是先停下来判断这几次里有没有得到可验证的东西。",
    second: "如果前面的游客体验已经很空，注册后多半只是把空话继续延长；如果前面的结构、入口和节奏都对，注册才更像把体验接续下去，而不是被次数推着走。",
    focusPoints: [
      "游客层用完时，先问自己：我刚刚拿到的是能回到盘里、能回到现实里的判断，还是只是几句让人舒服的话？"
    ],
    examples: [
      "比如你已经用游客次数验证过一个旧经历，又试过一个当下问题，这时注册通常比毫无验证地继续冲更有意义。"
    ],
    boundaryPoints: [
      "次数不该变成压力。验证没过关时，停一下往往比继续注册更省钱。"
    ],
    steps: [
      "先回看游客阶段最具体的一条结论。",
      "再判断它有没有被现实验证到。",
      "只有这一步成立时，再考虑注册继续。"
    ],
    enLead: "When guest quota runs out, the easiest mistake is to keep moving forward just because the counter ended.",
    enSecond: "A steadier move is to stop and ask whether the guest round already produced something you could verify.",
    enFocusPoints: [
      "Quota pressure should not replace judgment."
    ],
    enExamples: [
      "If the guest round already helped you verify one past event and one live question, registration makes more sense."
    ],
    enBoundaryPoints: [
      "If the trial was empty, extra access usually extends the emptiness rather than fixing it."
    ],
    enSteps: [
      "Review the strongest guest-stage conclusion.",
      "Check whether reality supports it.",
      "Register only after that step passes."
    ]
  },
  {
    slug: "ai-suanming-mianfei-paipan-he-zhuiwen-fenkai-shoufei",
    title: "AI算命免费排盘、追问收费正常吗？先分入口成本和连续服务",
    enTitle: "Is It Normal for AI Fortune Telling to Offer a Free Chart but Charge for Follow-Ups? First Separate Entry Cost From Ongoing Service",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    lead: "免费排盘、追问收费，这种设计本身并不奇怪。因为排出基础盘和把同一张盘持续讲顺，本来就不是同一种服务层。前者更像入口，后者更像连续使用。",
    second: "关键不在于它有没有收费，而在于它有没有把这两层边界写清楚。只要免费层真的让你看到盘，收费层又明确是为了更顺的承接和更多追问，这套逻辑就相对合理。",
    focusPoints: [
      "真正该问的是：免费层有没有让你完成基础验证，收费层是不是解决了连续追问、记录承接或额度扩展。"
    ],
    examples: [
      "如果免费层连盘面都不给看，却把追问收费写得很热闹，这就不叫分层，而像在故意把验证往后挪。"
    ],
    boundaryPoints: [
      "入口免费不等于深度也该无上限，收费存在也不等于平台就不厚道。边界透明才是关键。"
    ],
    steps: [
      "先确认免费层能不能完成第一轮验证。",
      "再看收费层多出来的到底是什么。",
      "最后才判断这层付费是不是你真需要的。"
    ],
    enLead: "A free chart plus paid follow-ups is not automatically unreasonable because chart entry and ongoing guided use are not the same service layer.",
    enSecond: "The real test is whether the boundary between those layers is written clearly.",
    enFocusPoints: [
      "Ask whether the free layer covers first verification and whether the paid layer truly adds continuity."
    ],
    enExamples: [
      "If the free layer does not even let you see the chart, the split becomes much harder to trust."
    ],
    enBoundaryPoints: [
      "Free entry does not mean unlimited deep use, and charging does not automatically mean trickery."
    ],
    enSteps: [
      "Check whether the free layer supports real first verification.",
      "See what the paid layer actually adds.",
      "Judge the need only after that."
    ]
  },
  {
    slug: "ai-suanming-dijia-shiyong-zhibuzhi",
    title: "AI算命低价试用值不值买？关键看能不能验证连续体验",
    enTitle: "Is a Low-Cost AI Fortune-Telling Trial Worth Buying? The Key Is Whether It Verifies the Ongoing Experience",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    lead: "低价试用最容易让人觉得“反正不贵，先买了再说”。但真正该看的，不是价格低不低，而是这次试用能不能帮你验证后面的连续体验值不值得。",
    second: "如果低价试用只是把一次性的内容缩短卖给你，它帮助不大；如果它能让你测试记录承接、继续追问和额度体验，那它就比单纯打折更有意义。",
    focusPoints: [
      "低价试用最好的用途，不是买一个短答案，而是买一次接近真实使用节奏的验证。"
    ],
    examples: [
      "比如你最关心的是连续追问会不会更顺，那试用里有没有保留上下文、有没有明显承接感，比价格本身更重要。"
    ],
    boundaryPoints: [
      "便宜不等于值得。试用只在能回答“后面值不值继续”时才有价值。"
    ],
    steps: [
      "先写下你这次试用要验证哪一项体验。",
      "试用后只围绕这一项打分。",
      "别因为价格低，就顺手把后续层一起买了。"
    ],
    enLead: "A low-cost trial feels easy to justify, but the real question is whether it tests the part of the product you actually care about next.",
    enSecond: "Price matters less than whether the trial shows real continuity, not just a cheaper one-off answer.",
    enFocusPoints: [
      "The best trial checks the future experience, not only the current discount."
    ],
    enExamples: [
      "If you care about follow-up continuity, the trial should prove context carry-over, not just show one short reply."
    ],
    enBoundaryPoints: [
      "Cheap is not the same thing as worthwhile."
    ],
    enSteps: [
      "Write down the one experience you want to verify.",
      "Score only that after the trial.",
      "Do not let the low price pull you into the next layer automatically."
    ]
  },
  {
    slug: "ai-suanming-huiyuan-meiyongman-suanbu-suan-kui",
    title: "AI算命会员没用满算不算亏？先看你买的是节奏还是次数",
    enTitle: "Is It a Loss If You Do Not Use Up Your AI Fortune-Telling Membership? First Ask Whether You Bought Rhythm or Raw Count",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    lead: "很多人会盯着次数看，觉得会员没用满就是亏。但对不少人来说，真正买到的不是把数字刷满，而是更顺的提问节奏、记录承接和需要时能继续问下去的余量。",
    second: "当然，如果你根本没有连续使用场景，那没用满就说明这层可能本来就不该买。关键不在于有没有清空额度，而在于你的使用方式是不是本来就适合会员层。",
    focusPoints: [
      "有些人用会员不是为了每天都问很多，而是为了关键几周里能稳定追一条主线，这种情况下“没刷满”也不一定亏。"
    ],
    examples: [
      "比如你在准备换岗、搬家或处理一段关系推进，连续两三周稳定回看，比偶尔刷一堆零碎问题更接近会员价值。"
    ],
    boundaryPoints: [
      "如果你买之前没有主线问题，买后也没有形成连续使用，那就不是没用满的问题，而是买错层级的问题。"
    ],
    steps: [
      "先回看你这段时间是不是在追同一条主线。",
      "再看会员有没有帮你节省重讲背景的成本。",
      "最后才判断这层值不值续。"
    ],
    enLead: "Many people judge membership only by whether every count was used, but some of the value sits in rhythm, continuity, and not having to restart.",
    enSecond: "If you never had an ongoing use case, the problem may not be the unused quota. It may be the wrong layer choice.",
    enFocusPoints: [
      "Membership can be about steady follow-up rhythm, not only about maxing the counter."
    ],
    enExamples: [
      "A few focused weeks on one moving question can be a better use than many scattered asks."
    ],
    enBoundaryPoints: [
      "No mainline question usually means the mismatch started before the purchase."
    ],
    enSteps: [
      "Check whether you tracked one real mainline.",
      "See whether membership reduced restart friction.",
      "Judge renewal from that, not from the raw count alone."
    ]
  },
  {
    slug: "ai-suanming-fufeiqian-xiankan-guize-haishi-zhifu",
    title: "AI算命付费前先看会员规则还是先看支付细则？顺序别反了",
    enTitle: "Before Paying for AI Fortune Telling, Should You Read the Membership Rules or the Payment Details First? Do Not Reverse the Order",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    lead: "付费前很多人先看价格，接着就点支付。其实更稳的顺序应该先看会员规则，再看支付细则。因为你得先搞清自己买到什么，才知道支付页上的字有没有写完整。",
    second: "如果会员规则都没读清楚，支付页上的价格、退款、次数和绑定方式就很容易被你看漏。顺序一反，后面出问题时才发现自己根本没搞懂买的是哪一层。",
    focusPoints: [
      "会员规则负责回答“你买到什么”，支付细则负责回答“你怎么买、出问题去哪找人”。前者没看清，后者就容易变成走形式。"
    ],
    examples: [
      "比如你先看见 19.90 元很便宜，却没注意这是额度层、记录层还是别的服务层，后面就算支付页写清了，你也可能还是误判。"
    ],
    boundaryPoints: [
      "支付页不是第一层判断，规则页才是。价格只是最后一个确认点，不该是第一个决定点。"
    ],
    steps: [
      "先读会员规则和次数边界。",
      "再看支付页的价格、绑定和售后入口。",
      "最后才判断要不要付款。"
    ],
    enLead: "A steadier payment order is rules first, checkout second, not price first and understanding later.",
    enSecond: "You need to know what the layer is before you can read the payment details correctly.",
    enFocusPoints: [
      "Membership rules answer what you are buying. Payment details answer how it is processed."
    ],
    enExamples: [
      "A cheap number means little if you still do not know whether it buys quota, continuity, or something else."
    ],
    enBoundaryPoints: [
      "Checkout is not the first judgment layer. Rules are."
    ],
    enSteps: [
      "Read the membership rules first.",
      "Check price, binding, and support next.",
      "Pay only after both layers are clear."
    ]
  },
  {
    slug: "ai-suanming-zhidao-nongli-shengri-zenmeban",
    title: "AI算命只知道农历生日怎么办？先补季节、时段和出生地",
    enTitle: "What If You Only Know the Lunar Birthday for AI Fortune Telling? Start by Filling in Season, Time Window, and Birthplace",
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: "只知道农历生日，并不代表完全不能开始。但这类输入天生就更容易在时辰、节气和真太阳时换算上出偏差，所以不能把它当成已经完整的信息。",
    second: "更稳的做法，是先把能补的先补上：大概是白天还是晚上、出生地在哪、家里记忆是不是接近节气交界。补的不是形式，而是后面判断精细度的地基。",
    focusPoints: [
      "农历日期只是其中一层。真正影响细度的，往往是时段边界和地点校正有没有跟上。"
    ],
    examples: [
      "如果家里只记得“农历某月某天晚上”，那至少比只给一个生日好得多，因为它能先帮你缩小时段范围。"
    ],
    boundaryPoints: [
      "资料不完整时可以先问方向题，但别急着追太细的结果题。"
    ],
    steps: [
      "先补大概时段和出生地。",
      "再确认是不是临近节气或交界时段。",
      "最后先问结构和方向，不要先问细结论。"
    ],
    enLead: "Knowing only the lunar birthday does not block you completely, but it does make the birth-time and conversion layers more fragile.",
    enSecond: "The steadier move is to add whatever frame you still can before asking finer questions.",
    enFocusPoints: [
      "Lunar date alone is not enough for a fine reading if time window and place are still loose."
    ],
    enExamples: [
      "Even 'born at night' can help narrow the frame much better than a bare birthday alone."
    ],
    enBoundaryPoints: [
      "With incomplete data, start with direction questions, not precision verdicts."
    ],
    enSteps: [
      "Add the rough time window and birthplace first.",
      "Check whether the case sits near a boundary period.",
      "Ask structure before detail."
    ]
  },
  {
    slug: "ai-suanming-zhengdian-qianhou-yaobuyao-zhongpai",
    title: "AI算命出生时间卡在整点前后，要不要重排两版先比差异",
    enTitle: "If the Birth Time Sits Right Around the Hour Mark, Should You Rebuild Two AI Fortune-Telling Versions and Compare the Gap First?",
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: "出生时间卡在整点前后，最怕的不是多花几分钟重排，而是明明知道有交界风险，还硬把它当成单一版本继续追问。尤其接近时辰边界时，先比差异，通常比先问结论更重要。",
    second: "两版先比，不是为了把整盘都重看一遍，而是为了抓出最容易受影响的地方。真正要看的，往往是身宫、起限、当前追问所落的那条线有没有变化。",
    focusPoints: [
      "只要你的核心问题恰好落在边界最敏感的位置，这个整点前后的小差别，就足以影响追问方向。"
    ],
    examples: [
      "比如你现在就在问关系推进或换岗节奏，这类题如果两版里触发点不同，后面的动作顺序就不该混着看。"
    ],
    boundaryPoints: [
      "重排两版是为了缩小误差，不是为了制造更多焦虑。比完差异后，就该收回到最关键的那一层。"
    ],
    steps: [
      "先排整点前后一版各一张。",
      "只比较与你当前问题最相关的差异。",
      "差异明显时，再决定要不要继续精修输入。"
    ],
    enLead: "When the birth time sits right around the hour mark, the safer move is usually to compare two nearby versions before chasing a fine verdict.",
    enSecond: "You do not need to reread the entire chart twice. You need to isolate the part that could affect your current question.",
    enFocusPoints: [
      "Boundary-sensitive questions can change follow-up direction even when the whole chart does not look wildly different."
    ],
    enExamples: [
      "Timing-heavy questions about job moves or relationship pace are especially worth checking across both versions."
    ],
    enBoundaryPoints: [
      "Two-version comparison should reduce noise, not create endless anxiety."
    ],
    enSteps: [
      "Build one version on each side of the hour mark.",
      "Compare only the part linked to your live question.",
      "Refine the input further only if the gap is meaningful."
    ]
  },
  {
    slug: "ai-suanming-zhixiangwen-weishenme-bushun",
    title: "AI算命只问“我为什么最近不顺”为什么常空？先把主线定出来",
    enTitle: "Why Does AI Fortune Telling Often Sound Empty When You Only Ask 'Why Has Everything Felt Off Lately'? Set the Main Line First",
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: "“我为什么最近不顺”是很真实的问题，但也是最容易把回答问空的一种问法。因为它同时把工作、钱、关系、身体和情绪全压在一句话里，工具再会说，也很容易平均掉重点。",
    second: "真正更有用的办法，不是把这句情绪删掉，而是继续往下补一句：我最不顺的是哪一层。主线一出来，后面的判断就不容易滑成万能话。",
    focusPoints: [
      "不顺感本身可以是真的，但盘面分析必须落到一条线，不然只会停在情绪共鸣。"
    ],
    examples: [
      "同样说最近不顺，有人核心是现金流压力，有人核心是关系拉扯，有人核心是岗位停滞，三种盘法重点根本不是一回事。"
    ],
    boundaryPoints: [
      "别把主观感受当成完整问题。感受可以做入口，但不能代替主题。"
    ],
    steps: [
      "先补一句你最卡的是哪一层。",
      "再限定这股不顺主要发生在哪段时间。",
      "最后才让 AI 往那条主线继续拆。"
    ],
    enLead: "'Why has everything felt off lately?' is a real feeling, but it is also one of the easiest ways to get a vague answer.",
    enSecond: "The answer gets better when you name which layer feels most stuck first.",
    enFocusPoints: [
      "A chart reading needs one main line, not only one emotional sentence."
    ],
    enExamples: [
      "Cash stress, relationship drag, and career stagnation may all feel like 'off,' but they do not belong to the same reading path."
    ],
    enBoundaryPoints: [
      "Feeling is a valid entry point, but not a complete question by itself."
    ],
    enSteps: [
      "Name the most stuck layer first.",
      "Add the main time span next.",
      "Then let the tool keep unpacking that one line."
    ]
  },
  {
    slug: "ai-suanming-xiugai-ziliao-haiyao-buyao-jixu-zhuiwen",
    title: "AI算命发现出生资料可能填粗了，还要不要继续追问？先把盘校准",
    enTitle: "If You Realize the Birth Data Was Entered Too Roughly for AI Fortune Telling, Should You Keep Asking? Calibrate the Chart First",
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: "如果你已经发现出生时间、出生地或历法输入可能填粗了，最稳的做法通常不是硬着头皮继续追问，而是先回去把盘校准。因为后面的每一层判断，都是建立在这张盘上继续放大的。",
    second: "继续问当然也能得到一些方向，但只适合先看大结构，不适合马上把细结论越问越深。校准不是重来一遍，而是避免在不稳的底座上堆更多判断。",
    focusPoints: [
      "一旦输入层有明显疑点，后面最该保留的，是方向题；最该暂缓的，是细节题和代价题。"
    ],
    examples: [
      "比如你后来才想起自己出生地填成了省会，实际却是另外一个城市，这种情况先修资料，比继续问今年哪月动更重要。"
    ],
    boundaryPoints: [
      "不是所有粗资料都要停掉全部提问，但只要你要问得更细，先校准就几乎总是更稳。"
    ],
    steps: [
      "先找出最可能填粗的那一项。",
      "补齐后重新生成基础盘。",
      "再把原来的追问缩成一条主线重新接上。"
    ],
    enLead: "Once you notice the birth data may be rough or partly wrong, deeper follow-ups become much less stable.",
    enSecond: "The safer choice is usually to recalibrate the chart before chasing finer conclusions.",
    enFocusPoints: [
      "Direction questions can survive rough input better than fine-detail questions can."
    ],
    enExamples: [
      "If the birthplace was simplified too much, correcting it matters more than pushing further into month-level timing."
    ],
    enBoundaryPoints: [
      "Not every rough input stops all use, but detail-heavy use should usually wait."
    ],
    enSteps: [
      "Find the roughest input item first.",
      "Rebuild the base chart after fixing it.",
      "Reconnect only one mainline follow-up next."
    ]
  },
  {
    slug: "ai-suanming-zhidao-shengfen-buzhidao-chengshi",
    title: "AI算命只知道出生省份不知道城市怎么办？先判断是不是边界盘",
    enTitle: "What If You Only Know the Birth Province but Not the City for AI Fortune Telling? First Check Whether It Is a Boundary Chart",
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: "只知道出生省份、不知道具体城市，当然不如城市完整来得稳，但也不是所有情况都会因此完全失真。更关键的是先判断，你这张盘是不是本来就靠近边界。",
    second: "如果本来不在交界时段，省份级信息有时还能先撑起方向判断；如果本来就卡在时辰、节气或真太阳时边界，城市差异就更值得补齐，不然越往下问越容易偏。",
    focusPoints: [
      "城市缺失最怕和边界时段叠在一起。两者一叠，就不该把后续判断问得太细。"
    ],
    examples: [
      "比如家里只记得是广东出生，却不记得具体城市，这时先看出生时间是不是也在整点前后，会比先急着下结论更有效。"
    ],
    boundaryPoints: [
      "省份信息可以先用来起步，但别把它误当成已经精确到可以放心追细节。"
    ],
    steps: [
      "先判断自己是不是边界盘。",
      "不是边界盘时先问方向题。",
      "边界明显时再优先补城市信息。"
    ],
    enLead: "Knowing only the province is weaker than knowing the city, but the real question is whether the chart is already sitting near a sensitive boundary.",
    enSecond: "Boundary cases need more location precision than non-boundary cases do.",
    enFocusPoints: [
      "Province-level data is more fragile when combined with hour or solar-time boundaries."
    ],
    enExamples: [
      "If the family remembers the province but the time is also near the hour mark, location becomes more important very quickly."
    ],
    enBoundaryPoints: [
      "Province data can help you start, but it should not be mistaken for fine precision."
    ],
    enSteps: [
      "Check whether this is a boundary chart first.",
      "Use direction questions if it is not.",
      "Prioritize city detail if the boundary risk is high."
    ]
  },
  {
    slug: "ai-suanming-buliu-youxiang-haineng-bu-neng-zhaohui",
    title: "AI算命不留邮箱，之后还能找回记录吗？先分本机保存和账号保存",
    enTitle: "If You Do Not Leave an Email for AI Fortune Telling, Can You Still Recover Records Later? First Separate Local Save From Account Save",
    group: "隐私与资料",
    enGroup: "Privacy & Data",
    lead: "很多人不想留邮箱，这个顾虑很正常。问题不在于留不留，而在于你之后想找回的是哪一类记录。不同平台里，本机保存和账号保存常常不是一回事。",
    second: "如果记录只存在本机，没留邮箱也不一定有问题，但换设备后就可能丢；如果你本来就希望跨设备继续看，那账号层的联系方式就会变得更重要。关键是先分清保存层，不是先纠结邮箱本身。",
    focusPoints: [
      "能不能找回记录，先看平台把记录绑定在浏览器、本机，还是绑定在登录账号。"
    ],
    examples: [
      "有的人只是想短期试用，不留邮箱问题不大；有的人想过几周回看同一张盘，不建账号就容易断线。"
    ],
    boundaryPoints: [
      "不留邮箱不等于更安全，也不等于一定会丢。先看保存方式，才知道代价在哪。"
    ],
    steps: [
      "先确认记录是本机还是账号层保存。",
      "再判断你有没有跨设备回看的需求。",
      "最后再决定要不要留邮箱或其他联系方式。"
    ],
    enLead: "Not wanting to leave an email is reasonable. The more useful question is what type of record recovery you expect later.",
    enSecond: "Local save and account save are often very different things.",
    enFocusPoints: [
      "Recovery depends more on the save layer than on the email field by itself."
    ],
    enExamples: [
      "Short-term trial users can often stay local, while cross-device users usually need account-level continuity."
    ],
    enBoundaryPoints: [
      "No email is not automatically safer, and leaving one is not automatically necessary."
    ],
    enSteps: [
      "Check whether records are local or account-based.",
      "Decide whether cross-device continuity matters to you.",
      "Then choose whether to add contact info."
    ]
  },
  {
    slug: "ai-suanming-dingdan-jilu-huibu-hui-daichu-zhenming",
    title: "AI算命订单记录会不会带出真实身份？先看账号层和支付层怎么分",
    enTitle: "Can AI Fortune-Telling Order History Expose Your Real Identity? First See How the Account Layer and Payment Layer Are Split",
    group: "隐私与资料",
    enGroup: "Privacy & Data",
    lead: "很多人担心订单记录不是怕看到价格，而是怕由订单一路带出真实姓名、联系方式和支付痕迹。这个担心很正常，关键是看平台有没有把账号层和支付层拆开。",
    second: "如果订单只显示服务层信息，而敏感支付资料留在支付渠道内部，风险通常会小很多；反过来，如果订单页什么都堆在一起，你就更该谨慎。问题不在有没有订单，而在分层清不清。 ",
    focusPoints: [
      "看订单页时，重点不是只看金额，而是看它会不会把身份、支付和内容记录混成一层。"
    ],
    examples: [
      "例如订单页如果只写会员状态、时间和服务名称，通常比直接把一串完整支付痕迹摊出来更让人安心。"
    ],
    boundaryPoints: [
      "只要订单记录和真实身份完全不分层，哪怕回答再顺，也值得提高警惕。"
    ],
    steps: [
      "先看订单页显示了哪些字段。",
      "再确认敏感支付信息是不是留在支付渠道处理。",
      "字段混得太多时，就别轻易继续留更多资料。"
    ],
    enLead: "Order history worries are often less about price and more about whether identity, payment, and service traces are stacked into one page.",
    enSecond: "The safer pattern is a clear split between account-level service records and payment-channel details.",
    enFocusPoints: [
      "The key question is whether the order page mixes too many sensitive layers together."
    ],
    enExamples: [
      "A page that shows service name, time, and status is usually calmer than one that spills detailed payment traces into the same layer."
    ],
    enBoundaryPoints: [
      "If identity and payment are never separated, caution should go up fast."
    ],
    enSteps: [
      "Check which fields appear in order history.",
      "See whether payment detail stays in the payment layer.",
      "Do not add more sensitive data if the layers look mixed."
    ]
  },
  {
    slug: "ai-suanming-denglu-hou-benji-yunduan-zenmefen",
    title: "AI算命登录后，本机记录和云端记录怎么分？先看同步边界",
    enTitle: "After You Log In to AI Fortune Telling, How Do Local Records and Cloud Records Split? Check the Sync Boundary First",
    group: "隐私与资料",
    enGroup: "Privacy & Data",
    lead: "一登录，很多人就默认所有记录都会自动进云端，或者反过来，担心所有记录都会被永久留住。其实本机记录和云端记录常常有明确边界，只是很多人没先看清。",
    second: "你真正要确认的，不是“有没有云端”，而是哪些内容会同步、哪些内容只留在当前设备。同步边界看清之后，才能判断要不要放心继续追问或回看。",
    focusPoints: [
      "登录后的第一步，不是马上继续问，而是先弄清记录、会员、订单和聊天内容分别怎么承接。"
    ],
    examples: [
      "有的平台会同步账号权益和订单，但聊天细节仍主要留在本机；也有的平台会把记录一起承接，判断方式完全不同。"
    ],
    boundaryPoints: [
      "只要同步边界没看清，就不要假设‘一定全同步’或‘一定全留本机’。"
    ],
    steps: [
      "先确认哪些内容跟账号走。",
      "再确认哪些内容主要留在本机。",
      "弄清后再决定你的使用和清理方式。"
    ],
    enLead: "After login, people often assume everything either fully syncs or fully stays local, but the real answer is usually a boundary split.",
    enSecond: "You need to know which layer follows the account and which layer mostly stays on the device.",
    enFocusPoints: [
      "Sync boundary matters more than a vague 'cloud' label."
    ],
    enExamples: [
      "Some products sync membership and orders but keep most chat detail locally, while others carry more history across."
    ],
    enBoundaryPoints: [
      "Do not guess full sync or full local storage when the boundary is still unclear."
    ],
    enSteps: [
      "Check what follows the account.",
      "Check what mainly stays on the device.",
      "Use that split to plan your cleanup and follow-up flow."
    ]
  },
  {
    slug: "ai-suanming-huan-diannao-hou-fufei-quanyi-zenme-zhao",
    title: "AI算命换电脑后付费权益怎么找回？先看绑定的是设备还是账号",
    enTitle: "How Do You Recover Paid AI Fortune-Telling Access After Changing Computers? First Check Whether the Binding Is to the Device or the Account",
    group: "隐私与资料",
    enGroup: "Privacy & Data",
    lead: "换电脑后最容易慌的，不是盘面本身，而是付费权益会不会一起断掉。这个问题通常跟命理无关，核心就在于平台到底把权益绑在设备、本机浏览器，还是绑在登录账号上。",
    second: "只要先把绑定方式看清，你就知道该去找登录入口、订单页，还是本机记录。真正怕的不是换设备，而是之前根本没弄懂权益跟着谁走。",
    focusPoints: [
      "付费权益能不能找回，先看平台强调的是账号同步，还是只强调本机保留。"
    ],
    examples: [
      "如果原本就写明订单和会员跟随当前账号，那换电脑后优先做的就不是重买，而是先登录核对。"
    ],
    boundaryPoints: [
      "换电脑不是自动丢权益的同义词，但没看清绑定方式时，确实最容易误判。"
    ],
    steps: [
      "先找会员或订单绑定说明。",
      "再用原账号登录核对权益状态。",
      "仍找不到时，再走售后或联系入口。"
    ],
    enLead: "When you change computers, the real panic point is usually paid access, not the chart itself.",
    enSecond: "Recovery depends on whether the benefit was tied to a device, browser, or account.",
    enFocusPoints: [
      "Binding rules matter more than guesswork after the device changes."
    ],
    enExamples: [
      "If the product already says orders and membership follow the current account, login should come before any repurchase thought."
    ],
    enBoundaryPoints: [
      "A new computer does not automatically mean a lost benefit."
    ],
    enSteps: [
      "Find the binding note first.",
      "Log in with the original account next.",
      "Use support only after that check."
    ]
  },
  {
    slug: "ai-suanming-shouji-paipan-hou-huan-diannao-haiyao-zhonglai",
    title: "AI算命先在手机排盘，后来换电脑还要重来吗？先看承接方式",
    enTitle: "If You Start AI Fortune Telling on a Phone and Later Switch to a Computer, Do You Need to Start Over? Check the Carry-Over Pattern First",
    group: "体验与流程",
    enGroup: "Experience & Flow",
    lead: "很多人先在手机上试排盘，回头想在电脑上继续看，就会担心是不是要重来。这个问题的关键，不在手机还是电脑，而在平台有没有把盘、记录和权益做成能承接的流程。",
    second: "如果手机端只是一次性本机体验，换电脑重来就很常见；如果账号、记录和权益本来就是跨端设计，重点就不是重排，而是先确认怎么接回原来的上下文。",
    focusPoints: [
      "跨端体验真正要看的，是盘能不能接上、记录能不能回看、会员或额度是不是跟着账号走。"
    ],
    examples: [
      "比如你在手机上已经试过一轮旧事验证，换到电脑后最怕的不是重输资料，而是那条验证线断掉。"
    ],
    boundaryPoints: [
      "跨端不顺不一定说明产品差，但它一定会影响你值不值得长期用。"
    ],
    steps: [
      "先确认盘和记录是否跟账号承接。",
      "能承接就优先找回原上下文。",
      "不能承接时，再考虑是否值得重新开始。"
    ],
    enLead: "Starting on a phone and moving to a computer is common. The real question is whether the product was designed to carry the chart and context across.",
    enSecond: "Carry-over quality matters more than the device label itself.",
    enFocusPoints: [
      "Check chart continuity, record continuity, and account-linked benefits together."
    ],
    enExamples: [
      "If your first useful verification lived on the phone, the real risk is losing that line rather than retyping the birth data."
    ],
    enBoundaryPoints: [
      "Cross-device friction may not make the product bad, but it strongly affects long-term value."
    ],
    enSteps: [
      "Check whether chart and records follow the account.",
      "Restore the old context if they do.",
      "Only then decide whether a restart is worth it."
    ]
  },
  {
    slug: "ai-suanming-zhuiwen-qian-yaobuyao-xian-lie-jingli",
    title: "AI算命追问前要不要先列一张经历清单？这样更容易验真",
    enTitle: "Should You Make a Short Experience List Before AI Fortune-Telling Follow-Ups? It Makes Verification Easier",
    group: "体验与流程",
    enGroup: "Experience & Flow",
    lead: "很多人一追问就直接把情绪往里倒，结果越问越散。其实在连续追问前，先列一张很短的经历清单，常常能让你更快判断这个工具到底是不是在认真接你的盘。",
    second: "清单不需要很长，三五条就够。它的作用不是帮平台省事，而是帮你自己在后面核对：哪些已经被抓到，哪些只是被顺口安慰过去了。",
    focusPoints: [
      "你越能把旧经历和当前问题摆成几条线，后面的追问就越不容易被情绪带跑。"
    ],
    examples: [
      "比如先写下上一次岗位变动、一次明显的财务波动、一次关系节奏变化，后面回答一对照，就知道它抓的是主题还是表情。"
    ],
    boundaryPoints: [
      "清单不是越长越好，太长反而又会把问题摊平。核心是给验证留锚点。"
    ],
    steps: [
      "先写三到五条最关键的经历。",
      "追问时只围绕其中一条主线展开。",
      "每次对照回答时回看这张清单。"
    ],
    enLead: "Many follow-ups become messy because the user keeps pouring in feeling without leaving any anchor for verification.",
    enSecond: "A short experience list gives you those anchors.",
    enFocusPoints: [
      "Old events and current questions become easier to compare when they are named in advance."
    ],
    enExamples: [
      "One job shift, one money swing, and one relationship rhythm change can already give you a strong check frame."
    ],
    enBoundaryPoints: [
      "The list should be short enough to anchor, not long enough to flatten everything again."
    ],
    enSteps: [
      "Write down three to five key events.",
      "Use one mainline per follow-up round.",
      "Keep checking answers against the same list."
    ]
  },
  {
    slug: "ai-suanming-lianwen-banshixiaoshi-haishi-fenkaiwen",
    title: "AI算命连续问半小时和分几次问，哪个更容易问清楚",
    enTitle: "Is It Better to Ask AI Fortune Telling for Half an Hour Straight or Split It Into Several Short Rounds?",
    group: "体验与流程",
    enGroup: "Experience & Flow",
    lead: "连续问半小时，适合把一条主线一口气拆完；分几次问，适合留时间回看、验证和修正提问。哪个更好，不是看你急不急，而是看这条问题现在更需要结构梳理，还是更需要现实核对。",
    second: "如果你一口气问太多，后面容易把不同主题搅在一起；如果分得太碎，又容易每次都像重新开始。关键不是长短，而是有没有让每一轮都围绕同一条主线推进。",
    focusPoints: [
      "追问节奏最怕的是主题漂移，不是时间长短本身。"
    ],
    examples: [
      "像换岗、搬家、合作这种题，先集中拆一轮，再隔一两天回来核对现实条件，通常比一次问到没气更稳。"
    ],
    boundaryPoints: [
      "问得久不代表问得深，问得碎也不代表更细。主线不稳时，两种方式都会变乱。"
    ],
    steps: [
      "先判断这轮更需要拆结构还是做验证。",
      "结构题可以集中问一轮。",
      "验证题更适合分几次带着现实反馈回来。"
    ],
    enLead: "A long continuous round helps when one mainline needs to be unpacked in one sitting. Split rounds help when you need time to verify and return.",
    enSecond: "The real risk is topic drift, not whether the session is long or short.",
    enFocusPoints: [
      "Session quality depends more on keeping one line steady than on session length."
    ],
    enExamples: [
      "Job moves or cooperation questions often work best as one structure round followed by later verification rounds."
    ],
    enBoundaryPoints: [
      "Longer is not automatically deeper, and shorter is not automatically cleaner."
    ],
    enSteps: [
      "Decide whether this round is for structure or for verification.",
      "Use one concentrated round for structure.",
      "Use split rounds when reality feedback matters."
    ]
  },
  {
    slug: "ai-suanming-meici-dou-hui-dao-shouye-zhengchangma",
    title: "AI算命每次都像回到首页重开一轮正常吗？先看有没有记录入口",
    enTitle: "Is It Normal When AI Fortune Telling Feels Like It Restarts From the Homepage Every Time? First Check Whether There Is a Record Entry",
    group: "体验与流程",
    enGroup: "Experience & Flow",
    lead: "每次打开都像第一次来，很多人会以为只是自己没操作对。其实这件事往往直接反映了产品有没有把记录入口、继续追问和账号承接做清楚。",
    second: "偶尔重开不一定有问题，但如果你每次都得从首页重新组织问题、重新找盘、重新找入口，那就说明这套流程更偏一次性使用，而不是长期复盘工具。",
    focusPoints: [
      "有没有明显的记录入口，常常比首页写了多少功能更能说明它能不能长期用。"
    ],
    examples: [
      "如果你上次刚问完工作，这次打开却完全找不到接回那条线的位置，那后面的准确感也会被体验摩擦拖低。"
    ],
    boundaryPoints: [
      "体验问题不等于命理解读一定差，但它会直接影响你能不能持续验证同一条主线。"
    ],
    steps: [
      "先找有没有记录、历史或继续入口。",
      "再看账号登录后能不能接住上次内容。",
      "一直重开时，就别高估它的长期价值。"
    ],
    enLead: "Feeling like you start from zero every time is usually a flow signal, not only a user mistake.",
    enSecond: "Record entry and continuation design often matter more than people expect.",
    enFocusPoints: [
      "A visible history or continuation path is one of the strongest long-term quality signals."
    ],
    enExamples: [
      "If last time's career thread cannot be found at all today, continuity drops before judgment quality even begins."
    ],
    enBoundaryPoints: [
      "Flow friction does not prove poor reading quality, but it does weaken long-term verification."
    ],
    enSteps: [
      "Look for history or continue entry first.",
      "Check whether login restores the prior context.",
      "Lower long-term expectations if every session fully restarts."
    ]
  },
  {
    slug: "ai-suanming-kan-offer-zenmexuan",
    title: "AI算命适不适合看两个 offer 怎么选？先分岗位、平台和城市",
    enTitle: "Can AI Fortune Telling Help You Choose Between Two Job Offers? First Separate Role, Platform, and City",
    group: "使用场景",
    enGroup: "Use Cases",
    lead: "两个 offer 怎么选，这类题其实很适合 AI 先帮你拆结构。因为很多人表面上是在比工资，实际上卡的是岗位职责、平台资源和城市节奏一起打架。",
    second: "只要你先把这三层分开，盘面的落点就会清楚很多。官禄更像职责位，迁移更像平台和外部环境，财帛则更接近回报和现金感，混在一起问最容易乱。",
    focusPoints: [
      "真正有用的不是让它替你选，而是先看哪一层是你这次决策里最重的矛盾。"
    ],
    examples: [
      "比如一个 offer 钱更稳、另一个平台更大，这时盘里最该看的不是一句“哪边运更好”，而是哪条线更接得住你当前阶段。"
    ],
    boundaryPoints: [
      "offer 题最怕直接问“选哪一个”，却不拆清自己到底是在比什么。"
    ],
    steps: [
      "先把两个 offer 的差别拆成岗位、平台和城市。",
      "再看你当前主线最该优先哪一层。",
      "最后再让 AI 帮你排顺序，而不是替你拍板。"
    ],
    enLead: "Choosing between two offers is a strong use case when the tool helps you separate what you are really comparing.",
    enSecond: "Many people think they are comparing pay, while the real split is role, platform, and city rhythm.",
    enFocusPoints: [
      "The best use is not forced selection. It is exposing the heaviest conflict layer first."
    ],
    enExamples: [
      "One offer may be steadier in cash, while the other carries stronger platform growth. Those are not the same chart line."
    ],
    enBoundaryPoints: [
      "Offer questions become weak when you ask only 'which one' without naming what is being compared."
    ],
    enSteps: [
      "Split the two offers into role, platform, and city.",
      "Identify which layer matters most in this stage.",
      "Ask the tool to rank priorities, not replace your final choice."
    ]
  },
  {
    slug: "ai-suanming-kan-yaobuyao-banjia",
    title: "AI算命适不适合看要不要搬家？先分居住需求和发展机会",
    enTitle: "Can AI Fortune Telling Help With a Moving Decision? First Separate Living Need From Growth Opportunity",
    group: "使用场景",
    enGroup: "Use Cases",
    lead: "要不要搬家，看起来像一个生活题，其实常常同时牵着居住感、工作节奏、关系距离和现实成本。正因为它不只是一句“去不去”，所以很适合先拆，而不是先求结论。",
    second: "搬家题里最容易混淆的，是“住得舒服”和“发展更顺”未必是同一条线。田宅更贴近居住感，迁移更贴近外部机会，财帛则提醒你成本和现金流承受力。",
    focusPoints: [
      "搬家题真正该看的，是你这次搬动主要是在解决住的问题，还是在争发展的位置。"
    ],
    examples: [
      "比如一个城市更方便生活，另一个城市更接平台资源，这时就不能只问“哪个更适合我”，而要先分问题属性。"
    ],
    boundaryPoints: [
      "搬家不是单一吉凶题。问题不拆开，回答就很容易空。"
    ],
    steps: [
      "先分清居住需求和发展机会哪一项更重。",
      "再看成本和节奏是否接得住。",
      "最后再判断搬动顺序和时机。"
    ],
    enLead: "A moving decision is rarely just one decision. It often mixes comfort, work pace, distance, and cost.",
    enSecond: "That is exactly why it helps to separate the layers before asking for a verdict.",
    enFocusPoints: [
      "The key split is whether the move is solving living comfort or chasing outside opportunity."
    ],
    enExamples: [
      "One city may feel better to live in while another connects better to work opportunity. Those are different lines."
    ],
    enBoundaryPoints: [
      "Moving is not a one-word lucky or unlucky question."
    ],
    enSteps: [
      "Name whether living need or growth chance matters more first.",
      "Check whether cost and rhythm can support it next.",
      "Judge timing only after that."
    ]
  },
  {
    slug: "ai-suanming-kan-kaoyan-haishi-jiuye",
    title: "AI算命适不适合看考研还是直接就业？先看阶段主线",
    enTitle: "Can AI Fortune Telling Help With the Choice Between Graduate Study and Going Straight to Work? Start With the Stage Mainline",
    group: "使用场景",
    enGroup: "Use Cases",
    lead: "考研还是直接就业，不只是两个选项对冲，更是两个阶段节奏在碰。一个偏继续积累、继续拉长准备期，一个偏提早进场、提早接现实职责，主线不同，盘里看的地方也会不一样。",
    second: "真正更有用的问法，不是“哪条路命更好”，而是“我当前阶段更适合继续蓄力，还是更适合提早落位”。主线先定，后面才不会把焦虑问成一锅粥。",
    focusPoints: [
      "这类题要先看阶段主线，而不是先追结果标签。否则很容易把学习节奏、岗位位置和现实压力混在一起。"
    ],
    examples: [
      "有人适合先把专业线磨深一点，再进场更稳；也有人平台线已经在动，过度延后反而会让机会窗口变窄。"
    ],
    boundaryPoints: [
      "这类选择题更适合做顺序判断，不适合让工具直接给人生盖章。"
    ],
    steps: [
      "先问自己当前最缺的是积累还是位置。",
      "再让 AI 看这条主线是否顺势。",
      "最后再比较两条路的代价和节奏。"
    ],
    enLead: "Graduate study versus immediate work is really a stage-choice question before it is an either-or label.",
    enSecond: "One path extends accumulation. The other moves earlier into real-world role pressure and platform position.",
    enFocusPoints: [
      "This works best when you ask which stage fits now, not which label sounds better."
    ],
    enExamples: [
      "Some people need deeper accumulation first, while others already have a moving platform window that should not be delayed too long."
    ],
    enBoundaryPoints: [
      "This is stronger as a sequence question than as a fate-stamp question."
    ],
    enSteps: [
      "Ask whether your shortage is accumulation or position first.",
      "Check whether that mainline matches the chart stage.",
      "Compare cost and timing only after that."
    ]
  },
  {
    slug: "ai-suanming-kan-fuqi-gongtong-caiwu",
    title: "AI算命适不适合看夫妻共同财务？先分挣钱能力和用钱规则",
    enTitle: "Can AI Fortune Telling Help With Shared Spousal Finances? First Separate Earning Ability From Money Rules",
    group: "使用场景",
    enGroup: "Use Cases",
    lead: "夫妻共同财务最容易被误问成“我们合不合”。其实真正容易出问题的，往往不是感情标签，而是挣钱方式、用钱规则和风险承受不同步。",
    second: "这类题最有用的拆法，是先看各自的财务节奏，再看关系里怎么协同。财帛不只是赚不赚，夫妻线也不只是爱不爱，真正难的是规则能不能站住。",
    focusPoints: [
      "共同财务题里，先天赚钱能力和后天用钱方式常常不是同一层，混在一起就很容易答空。"
    ],
    examples: [
      "比如一方更会开源、一方更会守账，这不是谁对谁错，而是规则怎么定、谁来管哪一层的问题。"
    ],
    boundaryPoints: [
      "共同财务题适合拆结构，不适合拿来证明谁更爱谁。"
    ],
    steps: [
      "先分挣钱能力和用钱规则。",
      "再看谁更适合做预算、谁更适合做开源。",
      "最后才讨论怎么把规则落到现实。"
    ],
    enLead: "Shared spousal finance questions are often asked as compatibility questions, but the real friction usually sits in earning style, spending rules, and risk tolerance.",
    enSecond: "This works better when structure comes before emotion labels.",
    enFocusPoints: [
      "Joint finance needs separate reading of earning rhythm and money-management rule."
    ],
    enExamples: [
      "One person may be stronger at opening income while the other is stronger at guarding the budget. The issue is rule design, not blame."
    ],
    enBoundaryPoints: [
      "Shared finance is a structure question first, not a proof-of-love question."
    ],
    enSteps: [
      "Separate earning ability from money rules first.",
      "Check who suits budget control and who suits expansion better.",
      "Only then bring it back to daily arrangement."
    ]
  },
  {
    slug: "ai-suanming-kan-yaobuyao-zhudong-lianxi-jiuren",
    title: "AI算命适不适合看要不要主动联系旧人？先分旧情绪和现时机",
    enTitle: "Can AI Fortune Telling Help You Decide Whether to Reach Out to Someone From the Past? First Separate Old Emotion From Current Timing",
    group: "使用场景",
    enGroup: "Use Cases",
    lead: "要不要主动联系旧人，这类题最容易被旧情绪裹着走。你以为自己在问时机，实际可能还在问舍不得；你以为自己在问结果，实际更需要先看现在的关系窗口是不是已经变了。",
    second: "真正更稳的做法，是把旧情绪和现时机分开。福德、夫妻和流年触发点如果不分层，后面很容易把想联系误当成适合联系。",
    focusPoints: [
      "这类题最关键的，不是有没有感情，而是当前阶段有没有承接这次联系的空间。"
    ],
    examples: [
      "比如你只是最近情绪波动大，和真正关系窗口在动，盘里常常不是同一个信号。"
    ],
    boundaryPoints: [
      "“想联系”不等于“现在联系更合适”。先分层，才不容易把情绪问成命运。"
    ],
    steps: [
      "先问自己这次联系更像情绪回头还是现实推进。",
      "再看当前时机有没有承接空间。",
      "最后才判断要不要主动发出第一步。"
    ],
    enLead: "Questions about reaching out to someone from the past are often wrapped in old emotion before they become timing questions.",
    enSecond: "That is why old feeling and current window need to be separated first.",
    enFocusPoints: [
      "The key is not whether feeling exists. It is whether the present stage can hold the contact."
    ],
    enExamples: [
      "An emotional swing and a real relationship window are often different signals in the chart."
    ],
    enBoundaryPoints: [
      "'Wanting to contact' is not the same thing as 'this is the right moment to contact.'"
    ],
    enSteps: [
      "Ask whether this urge is emotional return or real forward motion.",
      "Check whether the present timing can hold it.",
      "Only then decide on the first move."
    ]
  },
  {
    slug: "ai-suanming-chuangye-xian-yong-ziwei-haishi-bazi",
    title: "AI算命第一次问创业，先用紫微还是八字？先分结构题和时机题",
    enTitle: "When You First Ask About Starting a Business in AI Fortune Telling, Should You Start With Zi Wei or Ba Zi? First Separate Structure From Timing",
    group: "方法与术数",
    enGroup: "Method & Systems",
    lead: "创业题一上来就争先看紫微还是八字，通常顺序反了。真正该先分的，不是哪套工具更厉害，而是你这次在问的是长期结构，还是眼前时机。",
    second: "如果你在问自己是不是适合扛平台、扛责任、扛资源整合，结构题意味更重；如果你更在意今年这段时间该不该动、该快还是该缓，时机题意味就更强。问题一分开，工具才不容易打架。",
    focusPoints: [
      "创业不是一句“能不能成”。它至少要拆成角色承接、资源组织和启动时机。"
    ],
    examples: [
      "有人先天更适合主导和整合，但眼前节奏不对；也有人窗口已经动了，但资源承接能力还没补够，这两种问法就不该先用同一把尺。"
    ],
    boundaryPoints: [
      "先争工具，往往比先分问题更容易把判断带偏。"
    ],
    steps: [
      "先问自己是在问结构还是时机。",
      "结构题优先看长期承接力。",
      "时机题再补看当下节奏和窗口。"
    ],
    enLead: "When business-start questions begin with 'which system is better,' the order is usually already off.",
    enSecond: "The first split should be structure versus timing, not system versus system.",
    enFocusPoints: [
      "Business questions need role capacity, resource organization, and launch timing separated."
    ],
    enExamples: [
      "One person may have the structure to lead but the wrong near-term window, while another may have a moving window before the structure is ready."
    ],
    enBoundaryPoints: [
      "Debating tools too early often hides the real shape of the question."
    ],
    enSteps: [
      "Decide whether you are asking about structure or timing.",
      "Use the first reading to test long-term carrying capacity.",
      "Then add the current window question after that."
    ]
  },
  {
    slug: "ai-suanming-ganqing-tuijin-yong-ziwei-haishi-liuyao",
    title: "AI算命问感情推进，紫微和六爻该先用哪个？先看你问的是长期还是这一次",
    enTitle: "For AI Fortune-Telling Questions About Relationship Progress, Should You Start With Zi Wei or Liu Yao? First Ask Whether This Is Long-Term or This One Moment",
    group: "方法与术数",
    enGroup: "Method & Systems",
    lead: "感情推进题最容易一上来就问“哪套更准”。其实先要分清的是，你问的是这段关系长期怎么走，还是这一次要不要主动、要不要见面、要不要推进。",
    second: "长期关系结构和眼前一次动作，本来就不是同一层问题。前者更适合看模式和节奏，后者更适合看当下这一刀切面的判断。问题形状一分开，紫微和六爻各自的长处就会清楚很多。",
    focusPoints: [
      "你越把“长期关系判断”和“这一次动作决策”混在一起，越容易觉得工具互相打架。"
    ],
    examples: [
      "比如“我们长期合不合”和“这周要不要主动联系”，就不是同一层题，当然也不该先用同一套逻辑去问。"
    ],
    boundaryPoints: [
      "不是哪套术数非赢不可，而是问题细度先要站对位置。"
    ],
    steps: [
      "先判断自己问的是长期结构还是单次动作。",
      "长期题先看关系模式和节奏。",
      "单次动作题再看眼前切面。"
    ],
    enLead: "Relationship-progress questions become much clearer once you separate long-term pattern from one immediate move.",
    enSecond: "Those are not the same question shape, so they do not need the same first tool.",
    enFocusPoints: [
      "Tool conflict often comes from mixed question scale, not from the systems themselves."
    ],
    enExamples: [
      "'Are we a long-term fit?' and 'Should I reach out this week?' are not the same reading layer."
    ],
    enBoundaryPoints: [
      "The issue is not which system wins. It is whether the question scale is placed correctly first."
    ],
    enSteps: [
      "Decide whether this is long-term structure or one immediate move.",
      "Read pattern and rhythm first for long-term questions.",
      "Use the immediate cut only for the single-step question."
    ]
  }
];

function zhAuto(seed, facts) {
  const focusPoints = [];
  const examples = [];
  const boundaryPoints = [];

  if (seed.group === "免费与付费") {
    focusPoints.push(`当前公开页面能核到的边界是：未登录每天 ${facts.guestDaily} 次、登录免费每天 ${facts.loginDaily} 次、会员每天 ${facts.memberDaily} 次，当前会员价格 ${facts.memberPrice} 元。先把边界看清，再谈值不值。`);
  }

  if (seed.group === "输入与方法" || seed.group === "使用场景" || seed.group === "判断与靠谱") {
    focusPoints.push("真正能用的回答，通常会把命宫底色、财帛资源、官禄职责、迁移平台和当前触发点拆开，而不是把不同问题都压回一句总评。");
  }

  if (seed.group === "隐私与资料" || seed.group === "体验与流程") {
    examples.push(`当前公开页面至少能核到隐私联系邮箱 ${facts.privacyEmail}，也能看到登录、支付、会员和记录承接相关说明。能找到责任入口，通常比找不到任何联系路径更让人放心。`);
  }

  if (seed.group === "方法与术数") {
    boundaryPoints.push("先把问题形状分开，往往比先争哪套术数更高级更重要。结构题、阶段题和眼前一件事，本来就不该用同一把尺硬量。");
  }

  focusPoints.push("真正值得继续参考的答案，不只会给结论，还会说清依据、场景和下一步验证顺序。");
  examples.push("如果一段分析能同时落到盘面结构、现实场景和后续验证动作上，你后面复盘时会更容易判断它到底是在读盘，还是只是在顺着你的担心说话。");
  boundaryPoints.push("无论免费还是付费，越是让你先小范围验证、先看规则、再决定要不要继续，越说明它更适合长期使用，而不是只吃一轮情绪消费。");

  return { focusPoints, examples, boundaryPoints };
}

function enAuto(seed, facts) {
  const enFocusPoints = [];
  const enExamples = [];
  const enBoundaryPoints = [];

  if (seed.group === "免费与付费") {
    enFocusPoints.push(`The current public boundary can be checked as ${facts.guestDaily} guest uses a day, ${facts.loginDaily} logged-in free uses a day, ${facts.memberDaily} member uses a day, and a current member price of ${facts.memberPrice} RMB.`);
  }

  if (seed.group === "输入与方法" || seed.group === "使用场景" || seed.group === "判断与靠谱") {
    enFocusPoints.push("The stronger answer usually splits life pattern, money line, role line, outside platform, and current trigger instead of flattening every topic into one slogan.");
  }

  if (seed.group === "隐私与资料" || seed.group === "体验与流程") {
    enExamples.push(`The current public contact path can be checked through ${facts.privacyEmail}, which is a better trust signal than having no visible responsibility path at all.`);
  }

  if (seed.group === "方法与术数") {
    enBoundaryPoints.push("Separating the question shape matters more than ranking systems in the abstract.");
  }

  enFocusPoints.push("The answers worth keeping usually explain basis, scene, and next verification order rather than only a verdict.");
  enExamples.push("When one reading lands on chart structure, a real-life scene, and a next verification step at the same time, it becomes much easier to judge whether it is actually useful.");
  enBoundaryPoints.push("Whether the layer is free or paid, safer products let you verify in a smaller scope before asking for deeper commitment.");

  return { enFocusPoints, enExamples, enBoundaryPoints };
}

const ZH_LENGTH_BOOSTS = {
  "ai-suanming-zishuoduo-jiushi-zhunma": "你可以把同一篇长回答里最像结论的三句抄出来，看看它们是不是分别对应盘面、场景和行动；如果三句只是同义改写，篇幅再长也不算加分。真正有料的长文，往往会把哪条能先验、哪条只能暂时参考分开写清。",
  "ai-suanming-kan-fuqi-gongtong-caiwu": "很多夫妻不是赚不到，而是一个敢花一个求稳、一个重现金流一个重资产配置；这类差别如果没被点出来，共同财务就很难靠一句合不合适说清。连谁更适合定预算、谁更适合谈扩张都分不清，后面就容易把感情压力误当成单纯的钱问题。",
  "ai-suanming-zhidao-nongli-shengri-zenmeban": "如果长辈还能回忆出是春夏秋冬、白天黑夜、饭前饭后这种生活线索，都比只给一个农历日期有用，因为这些线索会直接影响后面排盘时该先看哪一版。",
  "ai-suanming-kan-yaobuyao-zhudong-lianxi-jiuren": "尤其是断联很久的人，主动联系前最好先把这次联系想解决的是遗憾、试探还是重新推进分开，不然再顺的时机也可能被错误动机带偏。",
  "ai-suanming-shanglai-jiu-kua-ni-minghao": "真正有分量的好话，通常会同时告诉你这份优势在什么环境里更容易发挥、在哪类人际或金钱压力下最容易被削弱，这才叫能落地。",
  "ai-suanming-chuangye-xian-yong-ziwei-haishi-bazi": "比如你现在卡的是合伙分工、资源整合还是开张时间，问法不同，先用哪套工具的顺序也会变；先把卡点说出来，比先争哪套更高级更重要。",
  "ai-suanming-ganqing-tuijin-yong-ziwei-haishi-liuyao": "如果你只是想问这周要不要发消息，和想问这段关系半年内能不能进入稳定阶段，根本不是一个量级的问题，先分清这一点，工具就不会越用越乱。",
  "ai-suanming-zhidao-shengfen-buzhidao-chengshi": "要是出生时间本来也只是早上、下午这种粗时段，那省份加粗时段通常还能先看方向；但如果时间卡在整点附近，城市缺失就会立刻放大误差。",
  "ai-suanming-kan-yaobuyao-banjia": "搬家这题最容易把租金、通勤、家人、发展机会混在一起，你先自己分清是哪一层逼得你想动，AI 才可能把顺序排清，而不是只回一句可以考虑。",
  "ai-suanming-zhixiangwen-weishenme-bushun": "很多人其实不是整个人生都不顺，而是某一层连续卡住以后把别的层也一起染灰；先指出到底是钱、位置、关系还是身体，答复才会有抓手。",
  "ai-suanming-bu-zhuiwen-jiu-gei-jielun": "一段不问条件就直接下结论的回答，最怕的是把本来属于完全不同处境的人塞进同一个模板里，所以你至少要补上那个真正会改变结论的背景变量。",
  "ai-suanming-youke-yongwan-yaobuyao-zhuce": "如果游客阶段连一条你能回到现实里核对的判断都没有，那注册只是把次数往后推，不会把内容突然变深；先做一轮验真，反而能替你省下后面的时间和预算。",
  "ai-suanming-mianfei-paipan-he-zhuiwen-fenkai-shoufei": "你最该确认的是免费层到底能不能看见盘、能不能做第一轮旧事核对；只有这两步已经成立，后面的追问收费才像是在卖连续服务，而不是把验证入口藏起来。",
  "ai-suanming-buzhi-shuobuhao-zhishuo-keyishi": "如果一条建议只负责鼓励你去试，却不负责告诉你试错成本、回撤信号和暂停节点，那它给你的不是判断，而只是把决定的压力又推回给你自己。",
  "ai-suanming-huan-diannao-hou-fufei-quanyi-zenme-zhao": "最省事的排查顺序通常是先看原账号里会员或订单状态，再看新设备有没有承接入口，别一上来就重买，否则很容易把本来能找回的权益又买一遍。",
  "ai-suanming-kan-kaoyan-haishi-jiuye": "有的人适合先把学历和研究能力补到位，有的人更该先去真实岗位里换平台和节奏；如果回答只告诉你哪个更体面，而不讲你现阶段缺的是什么，就还不够用。",
  "ai-suanming-xiugai-ziliao-haiyao-buyao-jixu-zhuiwen": "先把粗资料修正再问，不是形式主义，因为很多看似细小的输入偏差，最后都会在流年节奏、关系窗口或职业判断里被放大成完全不同的分支。",
  "ai-suanming-zhuiwen-qian-yaobuyao-xian-lie-jingli": "这张清单不用写得像简历，只要把三到五个转折点、一次明显的关系变化和一段财务压力记清，就足够拿来测它有没有真的读到你的盘。",
  "ai-suanming-zhengdian-qianhou-yaobuyao-zhongpai": "如果两版里你最关心的那条线完全一样，就不用继续放大焦虑；可一旦那条线的主次顺序明显互换，先比差异就比硬问结果更重要。",
  "ai-suanming-meici-dou-hui-dao-shouye-zhengchangma": "短期试用时重开一轮未必是大问题，但只要你已经开始想做连续验证、隔天回看或跨设备接续，这种每次归零的流程成本就会越来越明显。",
  "ai-suanming-kan-offer-zenmexuan": "比如一个 offer 涨薪明显但平台资源弱，另一个 title 好看却要换城，你先把冲突层拆开，后面无论看命盘还是看现实成本，都会比直接问哪个更准。",
  "ai-suanming-lianwen-banshixiaoshi-haishi-fenkaiwen": "如果你这一轮是在梳理结构，连续问一阵子往往更顺；但若你已经进入验证阶段，分几次带着现实反馈回来，通常比一口气问到底更容易避免越聊越飘。",
  "ai-suanming-shouji-paipan-hou-huan-diannao-haiyao-zhonglai": "真正决定要不要重来的，不是屏幕大小，而是之前那次排盘和追问有没有被账号记住；只要上下文能接上，换端本身不该让你回到零。",
  "ai-suanming-denglu-hou-benji-yunduan-zenmefen": "尤其要看聊天记录、排盘结果、会员权益和订单状态是不是分别同步，因为很多人误以为只要登录后一切都自动在云端，结果后来清理设备时才发现判断错了。",
  "ai-suanming-dijia-shiyong-zhibuzhi": "最好的低价试用，不是让你多看一段好听的话，而是让你确认这套产品在记录承接、二次追问和额度规则上，值不值得进入下一层。",
  "ai-suanming-buliu-youxiang-haineng-bu-neng-zhaohui": "如果你本来就计划只在这一台设备上短试，邮箱的重要性确实没那么高；但只要你想以后从手机切到电脑继续看，同步入口就会比当下省这一步更关键。"
};

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
    steps: [...seed.steps, ...(ZH_LENGTH_BOOSTS[seed.slug] ? [ZH_LENGTH_BOOSTS[seed.slug]] : [])],
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
  if (uniqueTimes.length !== DAY5_SEEDS.length) {
    throw new Error(`Expected ${DAY5_SEEDS.length} publish times, got ${uniqueTimes.length}`);
  }
  return DAY5_SEEDS.map((seed, index) => buildArticle(seed, index, batchDate, uniqueTimes, facts));
}
