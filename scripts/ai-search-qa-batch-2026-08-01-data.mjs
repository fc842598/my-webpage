const GROUP_HEADINGS = {
  "判断与靠谱": {
    focusHeading: "先看它有没有真的在判断",
    exampleHeading: "拿现实场景去验",
    boundaryHeading: "别把顺耳当靠谱",
    orderHeading: "更稳的使用顺序",
    enFocusHeading: "Check whether it is actually making a judgment",
    enExampleHeading: "Test it against a real-life situation",
    enBoundaryHeading: "Do not confuse comfort with reliability",
    enOrderHeading: "A steadier order"
  },
  "免费与付费": {
    focusHeading: "先看你买到的是不是判断深度",
    exampleHeading: "看一看真实使用场景",
    boundaryHeading: "别把花钱当自动升级",
    orderHeading: "更稳的消费顺序",
    enFocusHeading: "Check whether the upgrade is real judgment depth",
    enExampleHeading: "Look at a real usage case",
    enBoundaryHeading: "Payment is not an automatic upgrade",
    enOrderHeading: "A steadier spending order"
  },
  "输入与方法": {
    focusHeading: "先把输入和问法摆正",
    exampleHeading: "哪里最容易把题问偏",
    boundaryHeading: "别急着先抢结论",
    orderHeading: "更稳的提问顺序",
    enFocusHeading: "Set the input and the asking order correctly first",
    enExampleHeading: "Where the question most easily drifts",
    enBoundaryHeading: "Do not rush to the conclusion first",
    enOrderHeading: "A steadier asking order"
  },
  "隐私与资料": {
    focusHeading: "先分清哪些资料真有必要",
    exampleHeading: "把资料分层来看",
    boundaryHeading: "别把过度背景当必填",
    orderHeading: "更稳的资料处理顺序",
    enFocusHeading: "Separate what is truly necessary first",
    enExampleHeading: "Handle the information in layers",
    enBoundaryHeading: "Do not treat extra background as required",
    enOrderHeading: "A steadier data-handling order"
  },
  "使用场景": {
    focusHeading: "先分清你到底在解决哪一层问题",
    exampleHeading: "看两个具体场景",
    boundaryHeading: "别把所有代价压成一句好不好",
    orderHeading: "更稳的判断顺序",
    enFocusHeading: "Separate the real layer of the decision first",
    enExampleHeading: "Look at two concrete situations",
    enBoundaryHeading: "Do not flatten every cost into one yes-or-no",
    enOrderHeading: "A steadier judgment order"
  },
  "方法与术数": {
    focusHeading: "先分清这题到底落在哪一层",
    exampleHeading: "工具一换，重心也会换",
    boundaryHeading: "别拿错工具问错题",
    orderHeading: "更稳的起手顺序",
    enFocusHeading: "Separate which layer this question belongs to first",
    enExampleHeading: "The center of gravity changes with the tool",
    enBoundaryHeading: "Do not use the wrong tool for the wrong layer",
    enOrderHeading: "A steadier starting order"
  }
};

function articleCore(title) {
  return title.replace(/^AI算命/, "").split("？")[0].trim();
}

function buildReliability({
  slug,
  title,
  enTitle,
  group = "判断与靠谱",
  enGroup = "Reliability & Choice",
  checkA,
  checkB,
  zhExamples,
  enExamples
}) {
  const core = articleCore(title);
  return {
    slug,
    title,
    enTitle,
    group,
    enGroup,
    lead: `很多人看到“${core}”这种问题时，会本能去看结论清不清楚、语气稳不稳。可真正决定值不值得继续的，往往不是一句结论，而是它有没有把判断落回 ${checkA} 和 ${checkB}。`,
    second: `只要它不能把“${core}”这件事的结论和盘面、条件、现实动作重新接上，后面越追问越容易变成情绪确认；反过来，只要这两条线在，哪怕答案不花哨，往往也比顺耳但空的内容更能用。`,
    focus: [
      `这类题先看的不是“像不像大师口气”，而是它会不会把判断拆回 ${checkA}，再说明 ${checkB} 怎么影响结论变化。`,
      `只要“${core}”的结论无法回到盘和现实动作，你就很难知道它到底在判断，还是只是在把你想听的话讲完整。`,
      `真正值得继续追问的回答，通常会把 ${checkA} 和 ${checkB} 串成同一条解释链，而不是各说一半。`
    ],
    examples: [...zhExamples, `所以碰到“${core}”这类题，最好补问一句：如果 ${checkB} 变了，盘里的判断为什么会跟着变？能答出这层，才像真的在判断。`],
    boundary: [
      `别把“讲得坚定”误当成“更靠谱”。${checkA} 和 ${checkB} 没接上时，坚定只会让模糊看起来更像答案。`,
      `也别因为它在“${core}”里说了风险就直接否定。真正值得继续的回答，恰恰敢把成立条件和不成立条件一起摆出来。`,
      `能把“${core}”的反例、边界和现实条件一起说清楚，往往比只会往一个方向下结论更值得信。`
    ],
    steps: [
      `先看它有没有回到 ${checkA}。`,
      `再看它有没有交代 ${checkB} 怎样改变结论。`,
      "两条线都能对上，再决定要不要继续追问。"
    ],
    enLead: `When people see a question like "${core}," they often focus on whether the answer sounds clear and confident. The better test is whether it returns to ${checkA} and explains ${checkB} instead of floating above them.`,
    enSecond: `If the answer cannot reconnect the conclusion to chart structure and real conditions, more follow-up usually turns into emotional confirmation. If both layers stay connected, even a plain answer is often more useful than a polished but empty one.`,
    enFocus: [
      `The first check is not tone. It is whether the answer can move back into ${checkA} and then explain how ${checkB} changes the call.`,
      "Without that return path, you cannot tell whether it is judging the question or simply completing a comforting script."
    ],
    enExamples,
    enBoundary: [
      `Do not confuse confidence with reliability. When ${checkA} and ${checkB} are still disconnected, confidence only makes vagueness sound stronger.`,
      "And do not reject an answer just because it names risk. Stronger answers usually name both the working conditions and the failure conditions."
    ],
    enSteps: [
      `Check whether it returns to ${checkA}.`,
      `Check whether it explains how ${checkB} changes the answer.`,
      "Continue only when both lines are visible."
    ]
  };
}

function buildPrivacy({
  slug,
  title,
  enTitle,
  requiredA,
  requiredB,
  zhExamples,
  enExamples
}) {
  const core = articleCore(title);
  return {
    slug,
    title,
    enTitle,
    group: "隐私与资料",
    enGroup: "Privacy & Data",
    lead: `“${core}”这类题最怕两种极端：一种是把所有背景一股脑全给出去，另一种是什么都不敢说，最后连盘都起不稳。真正稳的做法，是先把 ${requiredA} 和 ${requiredB} 这些判断必须信息守住，再决定哪些细节晚点补。`,
    second: `“${core}”并不是要你一次把故事交代完，而是先把资料分层：哪些直接影响排盘，哪些影响问题边界，哪些只是让回答更贴近场景。层次一分开，很多焦虑就会变成可操作的判断。`,
    focus: [
      `这类题先看资料有没有触及 ${requiredA} 和 ${requiredB} 这两条硬线；只要没触及，就不要轻易把更多故事当成“必须”。`,
      `资料分层之后，你才知道自己是为了让“${core}”更准一些在补信息，还是只是因为紧张在过度暴露背景。`,
      "先守住必要资料，再一点点补充场景，通常比一上来交出全部隐私更容易拿到稳的判断。"
    ],
    examples: [...zhExamples, `换句话说，“${core}”最稳的做法不是少说，而是先守住 ${requiredA} 和 ${requiredB}，其余信息等第一轮判断站稳后再决定补不补。`],
    boundary: [
      "别把谨慎理解成什么都不填。排盘必须信息不给，后面所有判断都会飘。",
      `也别把“说得越多越准”当真。像“${core}”这类题里，很多敏感背景在第一轮并不负责决定方向，只负责增加暴露面。`,
      `真正该担心的不是少给一段故事，而是为了“${core}”把不必要的细节先交出去以后，自己再也收不回来。`
    ],
    steps: [
      "先填排盘必须信息。",
      "再补直接影响问题边界的资料。",
      "其余细节等第一轮判断站稳以后再决定要不要给。"
    ],
    enLead: `Questions like "${core}" go wrong in two opposite ways: people either hand over every detail too early, or hold back so much that the chart itself becomes unstable. The steadier move is to protect the layers that are truly required first.`,
    enSecond: "Privacy handling is not about telling the whole story on round one. It is about separating chart-required data, question-boundary data, and scene-detail data so you know what each layer is doing.",
    enFocus: [
      `Start by checking whether the information touches the hard lines of ${requiredA} and ${requiredB}. If not, it should not be treated as automatically required.`,
      "Once the layers are separated, you can tell whether you are improving the reading or simply exposing more than the question needs."
    ],
    enExamples,
    enBoundary: [
      "Caution does not mean saying nothing. If you omit chart-critical input, the later judgment drifts.",
      "But more detail is not the same thing as more accuracy. In early rounds, extra personal context often enlarges exposure more than insight."
    ],
    enSteps: [
      "Fill in the chart-critical details first.",
      "Add only the data that directly shapes the question boundary.",
      "Leave scene detail for later unless the first judgment truly needs it."
    ]
  };
}

function buildInput({
  slug,
  title,
  enTitle,
  focusA,
  focusB,
  zhExamples,
  enExamples
}) {
  const core = articleCore(title);
  return {
    slug,
    title,
    enTitle,
    group: "输入与方法",
    enGroup: "Input & Method",
    lead: `“${core}”这类题看起来像是在问一个小技巧，实际决定的是后面整轮判断会不会跑偏。只要 ${focusA} 和 ${focusB} 没先摆正，AI 很容易先顺着情绪或模糊印象走，最后把题答成套话。`,
    second: `越是像“${core}”这种出生时间边界、历法输入和追问顺序问题，越不能用“差不多”带过去。入口一旦摆正，同样的问题往往立刻会变得更具体、更能验证，也更容易知道哪里还需要补资料。`,
    focus: [
      `这类题真正重要的不是多问一句，而是先把 ${focusA}、${focusB} 这些入口条件摆正。`,
      `入口条件清楚以后，你才能判断“${core}”后面的模糊，是资料还不够，还是问题本身问得太散。`,
      `很多像“${core}”这样看似“算不清”的问题，其实不是盘难，而是入口没校准，后面的回答自然越走越偏。`
    ],
    examples: [...zhExamples, `所以处理“${core}”时，别急着一次问完，先把 ${focusA} 和 ${focusB} 校准到能比较，再进入正式判断，命中的细节通常会明显变多。`],
    boundary: [
      "别把入口校准当成浪费次数。很多后续空话，本来就是因为第一步没有校准。",
      "也别急着一上来就抢结果。基础口没站稳时，先追结果往往只会追出更多误差。",
      `校准“${core}”的入口看起来慢一步，实际是在替后面省掉一整轮错误追问。`
    ],
    steps: [
      "先把输入边界缩到能比较的范围。",
      "再用一两个最容易验证的点去试差异。",
      "入口稳定后，再进入正式追问。"
    ],
    enLead: `Questions like "${core}" look like minor technique questions, but they decide whether the whole later reading will drift. If ${focusA} and ${focusB} are not set correctly first, the answer often follows mood and approximation instead of structure.`,
    enSecond: "Birth-time boundaries, calendar conversion, and asking order are not small details. Once the entry point is corrected, the same topic usually becomes far more specific and testable.",
    enFocus: [
      `The key move is not asking one extra question. It is setting ${focusA} and ${focusB} correctly before the reading opens up.`,
      "Once the entry is stable, you can tell whether later vagueness comes from missing data or from a question that is still too broad."
    ],
    enExamples,
    enBoundary: [
      "Do not treat calibration as wasted turns. Many empty follow-ups come from a weak first setup.",
      "And do not rush toward the result first. If the entry is unstable, more result-chasing usually creates more error."
    ],
    enSteps: [
      "Shrink the input range until it becomes comparable.",
      "Use one or two easy verification points to test the difference.",
      "Only then move into the full follow-up."
    ]
  };
}

function buildUseCase({
  slug,
  title,
  enTitle,
  splitA,
  splitB,
  zhExamples,
  enExamples
}) {
  const core = articleCore(title);
  return {
    slug,
    title,
    enTitle,
    group: "使用场景",
    enGroup: "Use Cases",
    lead: `像“${core}”这种现实题，表面是在问做不做，实际常常是两条线缠在一起：${splitA} 和 ${splitB}。如果不先拆层，AI 再怎么回答，也很容易把一个长期判断压扁成一句短期情绪建议。`,
    second: `更稳的用法，是先看盘里哪一层在主导，再看“${core}”这个动作会不会把代价线放大。这样同样是一个决定题，你才能知道自己是在追窗口、在补漏洞，还是在硬撑已经不合适的方向。`,
    focus: [
      `这类题真正要分的，不是简单好不好，而是 ${splitA} 解决的是短期卡点，还是 ${splitB} 决定的是长期位置。`,
      `只有把主线和代价线分开，你才能判断“${core}”这次动作是在顺势推进，还是在用一个动作掩盖更深的结构问题。`,
      `一旦把 ${splitA} 和 ${splitB} 混在一句“适不适合”里，最容易发生的就是短期舒服盖过长期代价。`
    ],
    examples: [...zhExamples, `真正把“${core}”讲清楚的回答，通常还会补一句：这次动作如果现在不做，代价会留在什么地方；如果现在硬做，最先出问题的又是哪一条线。`],
    boundary: [
      `别把 ${splitA} 自动理解成“更轻松就更对”。很多省力选择，只是把后面的代价挪到未来。`,
      `也别把 ${splitB} 理解成“更大就更值”。位置更大、动作更猛，不代表当前节奏就一定接得住。`,
      `像“${core}”这种现实决策真正难的地方，不是有没有机会，而是机会、代价和承受线有没有在同一个节奏上。`
    ],
    steps: [
      "先确认自己在解短期卡点，还是在换长期位置。",
      `再看盘里更强的是 ${splitA} 这条线，还是 ${splitB} 这条线。`,
      "主线和代价排完顺序后，再决定要不要动。"
    ],
    enLead: `A practical question like "${core}" often looks simple on the surface, but it usually mixes two lines: ${splitA} and ${splitB}. If you do not separate them first, even a smart answer can flatten a structural decision into a short emotional suggestion.`,
    enSecond: "The steadier use is to see which layer the chart is actually activating, then judge whether the immediate move enlarges the cost line or serves the main line.",
    enFocus: [
      `The key is not a flat yes-or-no. It is whether ${splitA} is solving a short-term block while ${splitB} is deciding the longer position.`,
      "Once the main line and the cost line are separated, you can tell whether the move is aligned or just covering a deeper mismatch."
    ],
    enExamples,
    enBoundary: [
      `Do not assume ${splitA} is right just because it feels lighter in the short term.`,
      `And do not assume ${splitB} is right just because it sounds bigger or more ambitious.`
    ],
    enSteps: [
      "Decide whether you are solving a short-term block or changing a longer position.",
      `Check whether the chart is leaning harder toward ${splitA} or ${splitB}.`,
      "Only then decide whether to move."
    ]
  };
}

function buildMethod({
  slug,
  title,
  enTitle,
  toolA,
  toolB,
  layerA,
  layerB,
  zhExamples,
  enExamples
}) {
  const core = articleCore(title);
  return {
    slug,
    title,
    enTitle,
    group: "方法与术数",
    enGroup: "Method & Systems",
    lead: `“${core}”这种题最容易被问成“谁更准”，可真正该先分的不是站队，而是你现在到底在判断 ${layerA}，还是在判断 ${layerB}。层次不分，工具就会看起来互相打架。`,
    second: `在“${core}”这类题里，${toolA} 和 ${toolB} 适合看的并不是同一层。先把题拆成长期结构、阶段状态和这一次动作，再选工具，结论才不会因为入口混乱而自己冲突。`,
    focus: [
      `这类题先分层，再选术数：${toolA} 更适合处理 ${layerA}，${toolB} 更适合处理 ${layerB}。`,
      `一旦把“${core}”的层次混掉，你很容易把短期窗口误看成长线适配，或者把长线位置误看成眼前这一手的成败。`,
      `把 ${toolA} 和 ${toolB} 放回各自擅长的层次，结论才不会因为入口混乱而显得互相矛盾。`
    ],
    examples: [...zhExamples, `所以像“${core}”这种题，最怕的不是工具多，而是还没先分清 ${layerA} 和 ${layerB}，就急着问哪套术数“更准”。`],
    boundary: [
      `别把 ${toolA} 和 ${toolB} 问成二选一的口号题。它们更像在回答同一个决策里的不同部分。`,
      `也别让“${core}”里的一次窗口好坏替代长期判断，或者让长期结构直接代替这一次动作。两层混起来，才最容易误判。`,
      `先分层、再为“${core}”选术数，听起来慢一点，却往往比直接站队更快接近真正能用的答案。`
    ],
    steps: [
      `先确认自己更急的是 ${layerA} 还是 ${layerB}。`,
      `看 ${toolA} 和 ${toolB} 各自负责哪一层。`,
      "层次对齐以后，再把两个结果放回同一个决策里。"
    ],
    enLead: `A question like "${core}" is easy to turn into "which system is more accurate." The better first move is to ask whether you are judging ${layerA} or ${layerB}. Without that split, the tools only appear to conflict.`,
    enSecond: `${toolA} and ${toolB} are not strongest on the same layer. Once you separate long structure from the one-event window, the division of labor becomes much cleaner.`,
    enFocus: [
      `Separate the layers first: ${toolA} is stronger on ${layerA}, while ${toolB} is stronger on ${layerB}.`,
      "When the layers collapse into one question, people often mistake a short event window for full long-term fit, or the other way around."
    ],
    enExamples,
    enBoundary: [
      `Do not turn ${toolA} and ${toolB} into a slogan-level rivalry. They often answer different parts of the same decision.`,
      "And do not let one event window replace the long-term reading, or let the long-term reading replace the event window."
    ],
    enSteps: [
      `Decide whether ${layerA} or ${layerB} is the urgent layer.`,
      `Match ${toolA} and ${toolB} to the right layer.`,
      "Then bring both readings back into one decision."
    ]
  };
}

const DAY8_SEEDS = [
  buildReliability({
    slug: "ai-suanming-zhi-gei-jielun-bugei-guocheng-zhibuzhi-jixu",
    title: "AI算命只给结论不给判断过程，值不值得继续？先看能不能回到盘和现实条件",
    enTitle: "If AI Fortune Telling Gives Only a Conclusion Without the Reasoning, Is It Worth Continuing? See Whether It Returns to the Chart and Real Conditions First",
    checkA: "盘面结构",
    checkB: "现实条件",
    zhExamples: [
      "比如你问要不要换工作，它若只说“可以换”，却不说明是官禄线动、迁移线动，还是现金流压力逼出来的动作，这种结论很难拿去做决定。",
      "再比如你问复合，它若只给“还有机会”，却不交代机会来自情绪回头、现实承接还是时间窗口，那后面补再多字也只是换一种方式含糊。"
    ],
    enExamples: [
      "On a job-change question, a weak answer says only 'you can move' without showing whether the driver is career structure, relocation pressure, or cash flow.",
      "On a reunion question, 'there is still a chance' is not enough unless it explains whether the chance comes from emotion, practical repair, or timing."
    ]
  }),
  buildReliability({
    slug: "ai-suanming-mianfei-diyilun-hou-yaobuyao-mashang-buyi-lun",
    title: "AI算命第一轮免费体验后，要不要马上补第二轮？先看有没有锁定主线和验证点",
    enTitle: "After the First Free AI Fortune-Telling Round, Should You Jump Into Round Two Right Away? Check Whether the Main Line and Verification Point Are Already Locked",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    checkA: "主线问题",
    checkB: "验证点",
    zhExamples: [
      "如果第一轮已经把你是卡在平台、职位、现金流还是关系承接讲清楚了，第二轮才值得继续往下细拆；如果连主线都还在飘，马上补第二轮通常只会把模糊说得更长。",
      "最稳的免费体验，不是一次把问题讲透，而是让你知道下一轮该追哪一个点，例如先追回款、先追迁移，还是先追关系回应。"
    ],
    enExamples: [
      "If the first round already shows whether the real issue is platform, role, cash flow, or relationship capacity, a second round can go deeper with purpose.",
      "If the first round cannot even lock the main line, paying for more text often only stretches the same fog."
    ]
  }),
  buildReliability({
    slug: "ai-suanming-shuo-liangge-xuanze-dounengzuo-kaopuma",
    title: "AI算命说“两个选择都能做”算靠谱吗？先看有没有排序和代价",
    enTitle: "Is It Reliable When AI Fortune Telling Says 'Both Options Can Work'? Check Whether It Gives Ranking and Cost",
    checkA: "优先顺序",
    checkB: "每个选择的代价线",
    zhExamples: [
      "像“留在原岗位还是去新团队”这种题，两个选择都可能成立，但靠谱的回答会告诉你哪个更吃现金流、哪个更吃平台资源，而不是两边都轻轻点头。",
      "感情题也一样。它可以说“继续和止损都说得通”，但必须补一句：哪一种更符合当前关系结构，哪一种只是情绪暂时好受。"
    ],
    enExamples: [
      "On a career choice, both paths may be possible, but the answer still needs to rank which one depends more on cash flow and which one depends more on platform lift.",
      "On a relationship choice, it is not enough to say both staying and leaving are understandable. It should still tell you which path matches the structure and which path mainly soothes emotion."
    ]
  }),
  buildReliability({
    slug: "ai-suanming-fufei-shengji-hou-shenme-caisuan-zhen-jiashen",
    title: "AI算命付费升级后，哪些变化才算真加深？先看条件、顺序和反例有没有变多",
    enTitle: "After a Paid AI Fortune-Telling Upgrade, What Counts as Real Depth? See Whether Conditions, Order, and Counterexamples Actually Increase",
    group: "免费与付费",
    enGroup: "Free vs Paid",
    checkA: "条件说明",
    checkB: "顺序与反例",
    zhExamples: [
      "真加深的升级，应该把“能不能做”拆成“先看哪条线、哪条线不成立、什么情况下先停”，而不是只把同一句安慰铺成三段。",
      "如果付费后多出来的只是更长的感受词、更圆的语气，却没有多出新的条件分叉和验证顺序，那它只是扩写，不是加深。"
    ],
    enExamples: [
      "A real upgrade should turn 'can I do it' into 'which line comes first, what breaks the conclusion, and when to pause.'",
      "If the paid layer adds only more emotion words and smoother tone, but no new branches or verification order, it is expansion, not depth."
    ]
  }),
  buildPrivacy({
    slug: "ai-suanming-hepan-qian-yinsi-ziliao-xian-queren-shenme",
    title: "AI算命合盘前担心隐私，双方哪些资料必须确认，哪些可以后补？",
    enTitle: "Before an AI Relationship Reading, If Privacy Is a Concern, Which Details Must Both Sides Confirm First and Which Can Wait?",
    requiredA: "双方出生信息",
    requiredB: "当前关系边界",
    zhExamples: [
      "合盘第一轮最需要的，通常是双方出生资料和最基本的关系状态，例如正在交往、分开中还是准备推进；至于家庭矛盾细节、聊天截图和大量旧账，并不是一开始就必须交出去。",
      "如果你连关系现状都不交代，只把情绪全倾倒出来，AI 很容易只能安慰；但如果一上来就把隐私故事全部铺开，暴露面又会远远超过第一轮判断所需。"
    ],
    enExamples: [
      "In an early relationship reading, both birth details and the current relationship stage usually matter more than long private story dumps.",
      "If you hide the relationship state entirely, the answer often becomes generic comfort. If you overshare everything on round one, exposure grows faster than insight."
    ]
  }),
  buildPrivacy({
    slug: "ai-suanming-kan-hezuo-xiangmu-buxiangxian-baolu-gongsixijie",
    title: "AI算命问合作项目前不想先暴露公司底细，哪些背景给到就够判断？",
    enTitle: "When Asking AI Fortune Telling About a Cooperation Project, If You Do Not Want to Expose Company Details Early, What Background Is Enough to Judge the Question?",
    requiredA: "合作角色边界",
    requiredB: "回款与责任结构",
    zhExamples: [
      "你往往不需要在第一轮就交出客户名单、具体报价和内部数字，但至少要说明自己站在什么角色，是资源方、执行方还是出资方，以及钱和责任怎么分。",
      "只要角色边界和回款节奏没交代清楚，AI 很容易把合作题误读成普通关系题；可一旦这些硬线说清，很多商业细节完全可以留到后面再补。"
    ],
    enExamples: [
      "You usually do not need to share client lists, exact quotes, or internal numbers in round one. But you do need to define whether you are the resource side, execution side, or capital side.",
      "Without role boundary and payback structure, a cooperation question can drift into generic relationship talk. Once those hard lines are clear, many commercial details can wait."
    ]
  }),
  buildInput({
    slug: "ai-suanming-chusheng-shijian-zhi-jide-fandian-qianhou-xian-wen-shenme",
    title: "AI算命出生时间只记得饭点前后，先问什么最容易缩小时辰范围？",
    enTitle: "If You Only Remember Your Birth Time as 'Around Mealtime,' What Should You Ask First to Narrow the Birth Hour Most Efficiently?",
    focusA: "时辰边界",
    focusB: "最容易验证的宫位差异",
    zhExamples: [
      "与其一上来重看整盘，不如先比较最容易被现实验证的差异，比如关系表达、迁移动作、读书路径或工作位置到底落在哪一边。",
      "如果只是模糊记得“午饭前后”或“晚饭前后”，最有效的不是追求一次排准，而是先拿两三个差异最大的点去缩小时段。"
    ],
    enExamples: [
      "Instead of re-reading the entire chart, compare the most testable differences first, such as relationship style, movement patterns, study path, or job position.",
      "If you remember only 'around lunch' or 'around dinner,' the efficient move is not to force perfect precision, but to shrink the window with the biggest visible differences."
    ]
  }),
  buildInput({
    slug: "ai-suanming-nongli-runyue-shengri-zenme-tiwen-bucuo",
    title: "AI算命遇到农历闰月生日，怎么提问才不把历法输错？",
    enTitle: "If Your Birthday Falls in a Lunar Leap Month, How Should You Ask So the Calendar Input Does Not Go Wrong?",
    focusA: "历法对齐",
    focusB: "原始出生记录",
    zhExamples: [
      "最稳的做法是先把家里保存的原始说法留住：农历哪一年、闰几月、哪一天、白天还是晚上，再让系统去换算，而不是自己脑补成一个公历日期直接输入。",
      "很多闰月题不是盘不准，而是输入一开始就走错了历法。只要原始记录和换算结果能并排核对，后面绝大多数误差都能提前挡住。"
    ],
    enExamples: [
      "The steadier move is to preserve the original family record first: which lunar year, which leap month, which day, and whether it was daytime or night, then let the system convert.",
      "Many leap-month errors do not come from the reading itself. They begin with the wrong calendar assumption at input."
    ]
  }),
  buildInput({
    slug: "ai-suanming-xiang-lianxu-wen-san-jian-dashi-xian-an-shenme-shunxu",
    title: "AI算命同时有三件大事想问，先按什么顺序排，才不互相污染答案？",
    enTitle: "If You Have Three Major Questions for AI Fortune Telling at the Same Time, What Order Keeps the Answers From Blurring Into One Another?",
    focusA: "主线优先级",
    focusB: "问题之间的依赖关系",
    zhExamples: [
      "比如你同时想问跳槽、异地关系和买房，最稳的顺序往往不是哪个最焦虑先问哪个，而是先问真正会改动其他两题的大主线，再问被它牵动的次题。",
      "很多人一口气把三件事混着问，最后答案听起来像什么都说了，其实什么都没有排顺。把题拆开问，反而更容易看清先后。"
    ],
    enExamples: [
      "If you want to ask about a job move, a long-distance relationship, and a housing decision, the best order is usually the question that reshapes the other two, not the one that feels most urgent.",
      "When three big questions are asked in one lump, the answer often sounds full but stays unranked. Splitting the order usually makes the judgment cleaner."
    ]
  }),
  buildInput({
    slug: "ai-suanming-ganqing-hepan-qian-xian-zhunbei-neilianglei-jiushi",
    title: "AI算命问感情合盘前，先准备哪两类旧事最容易验证关系判断？",
    enTitle: "Before an AI Relationship Reading, Which Two Kinds of Past Events Help Verify the Relationship Judgment Most Easily?",
    focusA: "关系节奏",
    focusB: "现实承接",
    zhExamples: [
      "最容易验证的旧事，通常不是最戏剧化的那件，而是关系推进节奏有没有反复失衡，以及现实承接有没有出现长期缺口，比如见面、承诺、家庭协调谁总是掉链子。",
      "只要你能先准备一类节奏旧事和一类现实旧事，AI 就更容易区分这是底盘问题，还是窗口问题。"
    ],
    enExamples: [
      "The most useful past events are usually not the most dramatic ones. They are the repeated rhythm problems and the repeated practical gaps in support or commitment.",
      "Once you bring one rhythm case and one practical case, the reading can separate a structural relationship issue from a timing issue much more cleanly."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-yaobuyao-hui-qiangongsi",
    title: "AI算命适不适合看要不要回前公司？先分熟悉资源和天花板",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Return to Your Former Company? Separate Familiar Resources From the Ceiling First",
    splitA: "熟悉资源",
    splitB: "长期天花板",
    zhExamples: [
      "有的人回前公司，短期上手极快、人脉也立刻能接上，但岗位边界完全没变，这种好处更像补眼前空档，不一定等于长期更值。",
      "也有人离开后能力和位置都变了，回去反而能拿到新的授权和更大的盘子。关键不是“熟不熟”，而是熟悉是否还能换来新的位置。"
    ],
    enExamples: [
      "Some people return and gain instant speed because the network is already there, but the role ceiling stays exactly the same. That solves a short gap, not always the long line.",
      "Others go back only after their capacity and leverage have changed, so the old platform now offers a genuinely bigger position. Familiarity matters less than whether it converts into new room."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-jiangxin-huansaidao",
    title: "AI算命适不适合看降薪换赛道？先分学习曲线和现金流缓冲",
    enTitle: "Is AI Fortune Telling Useful for Deciding on a Pay Cut to Change Tracks? Separate the Learning Curve From Cash Buffer First",
    splitA: "学习曲线",
    splitB: "现金流缓冲",
    zhExamples: [
      "如果你换的是成长更高但前半年收入明显变薄的赛道，命理判断最怕只看“方向对不对”，不看现金流能不能扛住适应期。",
      "反过来，若你本来就有足够缓冲，且新赛道更贴近长期能力结构，短期降薪就未必是坏事，重点在承接而不在面子。"
    ],
    enExamples: [
      "On a higher-growth track with a thinner first six months, the weak reading looks only at whether the direction sounds right and ignores whether cash flow can carry the transition.",
      "If the buffer is solid and the new track fits the longer ability structure, a short-term pay cut may be a strategic cost rather than a mistake."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-xian-lingzheng-haishi-xian-ban-hunli",
    title: "AI算命适不适合看先领证还是先办婚礼？先分现实安排和关系准备",
    enTitle: "Is AI Fortune Telling Useful for Deciding Between Getting Legally Married First or Holding the Wedding First? Separate Practical Arrangements From Relationship Readiness",
    splitA: "现实安排",
    splitB: "关系准备",
    zhExamples: [
      "有些情侣关系本身已经稳定，只是房子、城市、家长时间表还没对齐，这时先领证还是先办婚礼更像现实排序题。",
      "也有些关系表面推进很快，但真正的承诺、家务分担和家庭边界还没站稳，这时办婚礼再热闹，也未必说明关系真的准备好了。"
    ],
    enExamples: [
      "Some couples are already stable, but the house, city, and family schedule are still misaligned. Then the question is mostly about practical sequence.",
      "Others move fast on the surface, but commitment, daily division, and family boundaries are still loose. A big wedding does not automatically mean the relationship is ready."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-changqi-aimei-yaobuyao-jishi-zhisun",
    title: "AI算命适不适合看长期暧昧要不要及时止损？先分关系兑现和时间成本",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Stop a Long Ambiguous Relationship? Separate Relationship Delivery From Time Cost",
    splitA: "关系兑现",
    splitB: "时间成本",
    zhExamples: [
      "如果对方长期有互动热度，却始终不给明确位置，真正要看的不是甜不甜，而是热度能不能兑现成现实动作。",
      "有些暧昧不是完全没机会，而是机会窗口很短，拖着不动的成本会越来越高。时间线一旦拉长，止损本身就是结论的一部分。"
    ],
    enExamples: [
      "If the chemistry stays high but the relationship never receives a clear place, the real test is whether that heat turns into practical movement.",
      "Some ambiguous ties are not impossible. They are just expensive to keep waiting on. When the delay keeps growing, time cost becomes part of the answer."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-fuye-yaobuyao-zuozhuye",
    title: "AI算命适不适合看副业要不要做成主业？先分收入稳定和客户来源",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Turn a Side Business Into Your Main Work? Separate Income Stability From Client Source",
    splitA: "收入稳定",
    splitB: "客户来源结构",
    zhExamples: [
      "有些副业表面赚得快，但订单全靠你本职工作带来的平台和人脉，一旦全职化，来源就会一起缩水。",
      "也有些副业虽然起步慢，却已经形成稳定复购和独立流量，这时主副切换看的是节奏，不只是勇气。"
    ],
    enExamples: [
      "Some side businesses look profitable, but the orders are still borrowed from the platform and contacts of the main job. Once you go full-time, the source shrinks with it.",
      "Other side businesses grow slowly but already show repeat demand and independent traffic. Then the switch is more about timing than boldness."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-huilaojia-kaobian",
    title: "AI算命适不适合看回老家考编？先分稳定需求和发展空间",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Go Back Home and Prepare for a Public-Sector Exam? Separate the Need for Stability From the Room to Grow",
    splitA: "稳定需求",
    splitB: "发展空间",
    zhExamples: [
      "如果你当前最难的是现金流、家庭照料或城市生存压力，回老家考编更多是在补稳定底盘，而不只是职业偏好。",
      "但若你本来就还在快速扩张期，只因为短期疲惫就回头，很可能换来稳定却丢掉更大的成长窗口。"
    ],
    enExamples: [
      "If your hardest pressure is cash flow, family care, or urban survival cost, going home for a public-sector path may be about rebuilding stability, not only career taste.",
      "But if you are still in a real expansion stage and turn back only because you are tired for a moment, you may gain calm while losing a larger growth window."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-jie-haiwai-paizhu",
    title: "AI算命适不适合看要不要接海外派驻？先分平台增量和生活磨损",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Take an Overseas Assignment? Separate Platform Gain From Life Wear",
    splitA: "平台增量",
    splitB: "生活磨损",
    zhExamples: [
      "海外派驻最容易被包装成履历升级，可如果身体、伴侣关系和长期居住安排完全接不住，履历增量也可能被生活磨损吃掉。",
      "反过来，如果这次派驻直接打开了未来三五年的平台门槛，且你的迁移线本就强，这种辛苦就可能是值得换的。"
    ],
    enExamples: [
      "An overseas assignment often looks like an easy résumé upgrade, but if health, partnership, and living stability cannot carry it, life wear can eat the platform gain.",
      "If the assignment genuinely opens the next three to five years of platform access and your movement line is already strong, the hardship can be a meaningful trade."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-pengyou-touqian-zuo-xiangmu",
    title: "AI算命适不适合看要不要跟朋友一起投钱做项目？先分友情成本和资金节奏",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Invest in a Project With Friends? Separate Friendship Cost From Capital Rhythm",
    splitA: "友情成本",
    splitB: "资金节奏",
    zhExamples: [
      "朋友项目最怕看成只有赚不赚。很多组合其实输在谁先垫钱、谁扛延期、亏损时谁来收口，而不是输在想法本身。",
      "如果这段友情本来就靠长期信任维持，资金节奏又注定会有拉扯，那就要把“关系还能不能扛住亏损期”单独拎出来看。"
    ],
    enExamples: [
      "Friend-led projects rarely fail only because of the idea. They often fail on who fronts the cash, who absorbs delay, and who closes the loss.",
      "If the friendship itself is built on long trust and the capital rhythm will obviously stretch, the question becomes whether the relationship can survive the loss period."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-banlv-yiqi-chuangye",
    title: "AI算命适不适合看伴侣要不要一起创业？先分关系承压和分工现金流",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Start a Business With Your Partner? Separate Relationship Pressure Capacity From Role Division and Cash Flow",
    splitA: "关系承压",
    splitB: "分工与现金流",
    zhExamples: [
      "伴侣创业不是把感情好坏直接换成合作成败。真正危险的，往往是一个人扛责任、一个人扛情绪、两边都没有清晰分工。",
      "只要钱线、决策线和吵架后的修复线没有提前说清，感情越深有时反而越难退出。"
    ],
    enExamples: [
      "Starting a business with a partner is not a direct translation of romance into cooperation. Trouble often comes when one person carries the formal responsibility and the other carries the emotional aftermath without a clean split.",
      "If the money line, decision line, and repair line after conflict are still vague, deeper feelings can actually make exit harder."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-lichi-hou-xian-xiuxi-haishi-mashang-zhaogongzuo",
    title: "AI算命适不适合看离职后先休息还是马上找工作？先分恢复周期和机会窗口",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Rest First or Job Hunt Immediately After Leaving? Separate Recovery Cycle From Opportunity Window",
    splitA: "恢复周期",
    splitB: "机会窗口",
    zhExamples: [
      "有些人离职后最大的风险不是空档本身，而是身心根本没恢复，马上再找只会把上一段问题复制过去。",
      "也有人正好碰到市场窗口、旧资源回流或岗位边界打开，这时休息太久反而会把好机会拖没。"
    ],
    enExamples: [
      "For some people, the biggest post-resignation risk is not the gap itself but the fact that the body and mind have not recovered. Jumping in too fast only copies the old problem.",
      "For others, the market window, old network, or role opening is already live. Resting too long can let the better opening pass."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-du-zaizhi-shuoshi",
    title: "AI算命适不适合看要不要读在职硕士？先分学历回报和时间挤压",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Do a Part-Time Master's Degree? Separate Degree Return From Time Compression",
    splitA: "学历回报",
    splitB: "时间挤压",
    zhExamples: [
      "在职硕士最常见的误判，是只看文凭值不值，不看它会不会把工作表现、关系节奏和身体状态一起压垮。",
      "如果你的事业线本来就需要这一层门槛来换平台，且当前时间结构还能塞下它，这种投资就更像提前补票，而不是盲目堆履历。"
    ],
    enExamples: [
      "The classic mistake with a part-time master's is asking only whether the degree looks valuable, while ignoring whether the time squeeze will crush work, relationships, and health together.",
      "If your longer career path truly needs that credential to unlock the next platform and your time structure can still carry it, the degree becomes a strategic step rather than résumé stacking."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-gao-ticheng-di-dixin-gangwei",
    title: "AI算命适不适合看高提成低底薪岗位要不要去？先分成交能力和现金流安全",
    enTitle: "Is AI Fortune Telling Useful for Deciding on a High-Commission Low-Base-Salary Role? Separate Closing Ability From Cash Safety",
    splitA: "成交能力",
    splitB: "现金流安全",
    zhExamples: [
      "这种岗位最怕把“有赚钱机会”听成“适合我”。如果你的盘更吃稳定节奏，现金流一紧，人就容易在高压下把表现越做越差。",
      "可如果你本来就偏强在谈判、外拓和结果兑现，且手头缓冲足够，高提成反而可能把优势放大。"
    ],
    enExamples: [
      "The danger in this kind of job is hearing 'high upside' as 'good fit.' If your structure needs steadier rhythm, tight cash flow can make pressure damage performance fast.",
      "But if you are genuinely strong in negotiation, outreach, and result conversion, and your buffer is solid, commission-heavy pay can amplify a real strength."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-gen-duixiang-jian-jiazhang",
    title: "AI算命适不适合看要不要跟对象见家长？先分关系稳定和现实推进",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Meet Your Partner's Parents? Separate Relationship Stability From Practical Progress",
    splitA: "关系稳定",
    splitB: "现实推进",
    zhExamples: [
      "见家长不是单纯感情热度题。关系再热，如果工作、城市、婚期预期完全没对齐，推进得太快反而会把矛盾提前放大。",
      "反过来，有些关系并不轰烈，但现实安排已经在慢慢成形，这时见家长更像顺着节奏走，而不是情绪冲动。"
    ],
    enExamples: [
      "Meeting parents is not only about emotional intensity. If work, city plan, and marriage expectation are still misaligned, moving too fast can enlarge tension early.",
      "Some relationships are not dramatic, but the practical arrangement is already taking shape. Then meeting parents is more a natural step than an emotional jump."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-fuhe-hou-yiqi-zuoshengyi",
    title: "AI算命适不适合看复合后要不要一起做生意？先分情感修复和利益绑定",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Do Business Together After Reuniting? Separate Emotional Repair From Financial Binding",
    splitA: "情感修复",
    splitB: "利益绑定",
    zhExamples: [
      "复合刚发生时，最容易把重新靠近误读成“已经适合深度绑定”。可一起做生意会把钱线、权责线和退出线全部提到台前。",
      "如果旧冲突还没修干净，只是因为想证明关系变好了就一起上项目，生意往往成了第二次分手的放大器。"
    ],
    enExamples: [
      "Right after a reunion, renewed closeness is easy to mistake for readiness to bind more deeply. But business immediately puts money, authority, and exit on the table.",
      "If the old conflict is not truly repaired and the project is used as proof that the relationship is better, the business often becomes an amplifier of the second breakup."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-yixian-chengshi-hui-shenghui-fazhan",
    title: "AI算命适不适合看一线城市回省会发展？先分机会密度和生活成本",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Leave a First-Tier City for a Provincial Capital? Separate Opportunity Density From Life Cost",
    splitA: "机会密度",
    splitB: "生活成本",
    zhExamples: [
      "很多人回省会并不是单纯“想轻松”，而是大城市的租住、通勤和关系成本已经把成长增量吃掉了。",
      "也有人在一线城市虽然累，但行业中心、资源密度和晋升路径都还明显优于回去后的状态，这时回去解决的是疲惫，不一定解决位置。"
    ],
    enExamples: [
      "Many people consider moving back not because they dislike ambition, but because rent, commuting, and relationship cost in the first-tier city are already eating the growth gain.",
      "Others are tired in the big city, yet the industry center, resource density, and promotion path remain far stronger than what they would have after moving back. Then the move may solve fatigue but not position."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-jishu-gang-zhuan-xiaoshou-gang",
    title: "AI算命适不适合看技术岗转销售岗？先分表达兑现和业绩压力",
    enTitle: "Is AI Fortune Telling Useful for Deciding on a Shift From a Technical Role to Sales? Separate Expression Conversion From Performance Pressure",
    splitA: "表达兑现",
    splitB: "业绩压力",
    zhExamples: [
      "技术转销售最常见的误判，是只看到收入上限，却没看到自己是不是适合长期暴露在持续成交压力里。",
      "如果你的优势本来就在讲解、连接资源和推动成交，销售可能是放大项；但若你更强在深工细作，转过去可能只是把焦虑换个地方放大。"
    ],
    enExamples: [
      "The classic mistake in moving from technical work to sales is seeing only the income ceiling while ignoring whether constant closing pressure is actually sustainable for you.",
      "If your real strength is explaining, connecting resources, and converting demand, sales can amplify it. If your strength is depth and steady craft, the switch may only relocate the anxiety."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-hezuo-xian-shidan-haishi-zhiqian-niankuang",
    title: "AI算命适不适合看这段合作先试单还是直接签年框？先分信任积累和回款节奏",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether a Cooperation Should Start With a Trial Order or Go Straight Into an Annual Contract? Separate Trust Building From Payback Rhythm",
    splitA: "信任积累",
    splitB: "回款节奏",
    zhExamples: [
      "有些合作表面谈得很好，可一到执行、对账和回款节点就开始掉链子，这种时候试单本身就是在测结构，不是在浪费时间。",
      "也有些项目窗口很短，若双方边界和责任已经说清，过度拖试反而会错过最好的切入期。"
    ],
    enExamples: [
      "Some deals sound smooth in conversation but start falling apart at delivery, billing, and payback. In that case, a trial order is testing structure, not wasting time.",
      "Other projects have a narrow window. If boundary and responsibility are already clear, too much testing can miss the best entry point."
    ]
  }),
  buildUseCase({
    slug: "ai-suanming-guanxi-yaobuyao-gongkai",
    title: "AI算命适不适合看要不要把关系公开？先分稳定度和外部压力",
    enTitle: "Is AI Fortune Telling Useful for Deciding Whether to Make a Relationship Public? Separate Relationship Stability From External Pressure",
    splitA: "关系稳定度",
    splitB: "外部压力",
    zhExamples: [
      "有些关系不公开并不是见不得人，而是外部环境一旦进来，家人、同事、前任或城市安排都会立刻施压，这时公开本身就是一个放大动作。",
      "反过来，如果关系底盘已经稳，现实路径也在逐步成形，一味藏着反而会让承诺线长期悬空。"
    ],
    enExamples: [
      "Some relationships stay private not because they are shameful, but because the moment the outside world enters, family, coworkers, exes, or city plans begin to press on them.",
      "If the structure is already stable and the practical path is forming, hiding forever can leave the commitment line suspended."
    ]
  }),
  buildMethod({
    slug: "ai-suanming-hui-qiangongsi-xiankan-ziwei-haishi-liuyao",
    title: "AI算命问要不要回前公司，先看紫微还是六爻？先分长期位置和这次回流窗口",
    enTitle: "If You Ask AI Fortune Telling Whether to Return to a Former Company, Should You Start With Zi Wei or Liu Yao? Separate the Long-Term Position From This Return Window First",
    toolA: "紫微",
    toolB: "六爻",
    layerA: "长期职业位置",
    layerB: "这次回流窗口",
    zhExamples: [
      "如果你想先看的是自己长期到底适不适合回到旧平台，紫微更容易把平台、官禄和迁移这些长期位置线拆开。",
      "但若你长期上并不排斥回流，只是拿不准“现在这一次回去值不值”，六爻更适合看这次动作本身的节奏和成败窗口。"
    ],
    enExamples: [
      "If the first concern is whether your long career structure still fits the old platform, Zi Wei usually separates that longer position more clearly.",
      "If the long line already allows a return and the real doubt is whether this one timing window is worth taking, Liu Yao is usually better for the event itself."
    ]
  }),
  buildMethod({
    slug: "ai-suanming-pengyou-hehuo-touqian-xiankan-bazi-haishi-liuyao",
    title: "AI算命问朋友合伙投钱做项目，先看八字还是六爻？先分长期财务承受和这次资金动作",
    enTitle: "If You Ask AI Fortune Telling About Investing With Friends, Should You Start With Ba Zi or Liu Yao? Separate Long-Term Financial Capacity From This Capital Move First",
    toolA: "八字",
    toolB: "六爻",
    layerA: "长期财务承受",
    layerB: "这次资金动作",
    zhExamples: [
      "朋友合伙投钱，如果你最该先看的，是自己这段阶段到底扛不扛得住波动、亏损和压力，八字更容易先回答长期承受线。",
      "若长期承受本身并不差，只是拿不准这次项目值不值得出手、能不能按时回款、节奏会不会拖垮关系，那六爻更适合看这一手。"
    ],
    enExamples: [
      "When investing with friends, if the urgent question is whether your current stage can actually carry volatility, loss, and pressure, Ba Zi usually serves the long endurance layer better first.",
      "If the long endurance line is already acceptable and the real question is whether this one project deserves the money now, or whether payback timing will damage the friendship, Liu Yao is usually more direct for the move itself."
    ]
  })
];

function buildArticle(seed, index, batchDate, uniqueTimes) {
  return {
    ...GROUP_HEADINGS[seed.group],
    slug: seed.slug,
    title: seed.title,
    enTitle: seed.enTitle,
    group: seed.group,
    enGroup: seed.enGroup,
    lead: seed.lead,
    second: seed.second,
    focusPoints: seed.focus,
    examples: seed.examples,
    boundaryPoints: seed.boundary,
    steps: seed.steps,
    enLead: seed.enLead,
    enSecond: seed.enSecond,
    enFocusPoints: seed.enFocus,
    enExamples: seed.enExamples,
    enBoundaryPoints: seed.enBoundary,
    enSteps: seed.enSteps,
    time: uniqueTimes[index],
    order: index + 1,
    publishedAt: `${batchDate}T${uniqueTimes[index]}:00+08:00`,
    section: "AI算命问答",
    enSection: seed.enGroup
  };
}

export function buildAiSearchQaBatch({ batchDate, uniqueTimes }) {
  if (uniqueTimes.length !== DAY8_SEEDS.length) {
    throw new Error(`Expected ${DAY8_SEEDS.length} publish times, got ${uniqueTimes.length}`);
  }
  return DAY8_SEEDS.map((seed, index) => buildArticle(seed, index, batchDate, uniqueTimes));
}
