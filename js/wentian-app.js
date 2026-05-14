const reports = [
  ["生命健康预测报告", "基于八字信息生成长期生命能量曲线，预见人生波峰与波谷。", "¥99"],
  ["2026丙午年预测报告", "覆盖事业、财富、感情婚姻、健康关注和行动建议。", "¥50"],
  ["八字与MBTI人格深度解析", "融合人格模型与命盘结构，拆解性格、关系与发展节奏。", "¥58"],
  ["合盘关系报告", "分析双方关系吸引力、冲突点和长期相处策略。", "¥68"]
];

const profiles = [
  ["谢广周", "普通会员 / 账号信息", "男 / 1990-05-11 / 已保存"],
  ["命主", "AI问天默认档案", "女 / 1995-08-18 / 已保存"]
];

const plans = [
  ["120 灵石", "¥12.00", "适合体验单次问答"],
  ["280 灵石", "¥28.00", "适合解锁短报告"],
  ["580 灵石", "¥58.00", "适合报告与问答组合"]
];

const convertedScreens = [
  { no: 1, title: "授权书", active: "", cards: [["本人授权问天AI依据输入资料生成排盘、合盘与AI解读。", "签署人：谢广周 / 2026-05-11"]], badge: "已授权" },
  { no: 2, title: "首页/报告商城", active: "首页", heading: "问天AI", cards: [["你的专属命理报告，立即生成", "排盘、合盘、流年、AI解读", "立即生成", "screen-26"], ["生命曲线预测报告 ¥99", "基于命盘生成完整报告", "", "screen-27"], ["2026丙午年预测报告 ¥50", "流年趋势与行动建议", "", "screen-27"], ["八字与MBTI人格深度解析 ¥58", "性格模型与命盘交叉分析", "", "screen-27"]] },
  { no: 3, title: "档案列表", active: "档案", list: [["谢｜男｜阳历 2026-05-12", "用于排盘、合盘、AI问答", "screen-25"], ["命主｜女｜阴历八月", "用于排盘、合盘、AI问答", "screen-25"], ["贵王红仪｜VIP", "用于排盘、合盘、AI问答", "screen-25"], ["情侣合盘", "用于排盘、合盘、AI问答", "screen-10"]] },
  { no: 4, title: "AI问天", active: "问天AI", ai: "base" },
  { no: 5, title: "选择档案", active: "问天AI", ai: "modal", modalTitle: "选择档案", modalItems: ["谢｜男｜阳历", "命主｜女｜阴历"], next: "screen-6" },
  { no: 6, title: "AI提问中", active: "问天AI", ai: "asking" },
  { no: 7, title: "AI回复", active: "问天AI", ai: "reply" },
  { no: 8, title: "AI长文解读", active: "问天AI", sections: ["核心结论", "性格优势", "隐性风险", "事业建议", "感情建议", "财运建议", "行动方案"] },
  { no: 9, title: "对话记录", active: "问天AI", modalTitle: "对话记录", modalItems: ["新的对话 15:18", "新的对话 22:06"], next: "screen-7" },
  { no: 10, title: "合盘类型", cards: [["情侣合盘", "合盘深度解析｜情感契合度｜冲突化解建议"], ["合盘主视觉", ""]], button: ["开始合盘对话", "screen-11"] },
  { no: 11, title: "选择合盘档案", modalTitle: "选择合盘档案", modalItems: ["谢｜男｜阳历", "命主｜女｜阴历"], next: "screen-25" },
  { no: 12, title: "随机提问", cards: [["今日适合问什么？", "事业方向 / 感情状态 / 近期机会"], ["换一批问题", ""]], button: ["开始问天", "screen-4"] },
  { no: 13, title: "抽签", active: "活动", cards: [["抽签", "静心默念问题，抽取一支签文。"]], button: ["开始抽签", "screen-14"] },
  { no: 14, title: "抽签中", active: "活动", cards: [["抽签中", "签筒正在摇动，请稍候。"]], button: ["查看结果", "screen-15"] },
  { no: 15, title: "抽签结果", active: "活动", cards: [["上上签", "当前所问宜稳中推进，先定边界，再谈扩张。"]], button: ["查看签文详情", "screen-16"] },
  { no: 16, title: "签文详情", active: "活动", sections: ["签文", "解签", "事业", "感情", "行动建议"] },
  { no: 17, title: "起卦", active: "活动", cards: [["起卦", "抛掷六次生成卦象。"]], button: ["开始投掷", "screen-18"] },
  { no: 18, title: "投掷4次", active: "活动", cards: [["已投掷 4 次", "还差 2 次完成本卦。"]], button: ["继续投掷", "screen-19"] },
  { no: 19, title: "投掷5次", active: "活动", cards: [["已投掷 5 次", "再投一次查看结果。"]], button: ["查看结果", "screen-20"] },
  { no: 20, title: "地风升", active: "活动", sections: ["本卦：地风升", "卦意", "事业建议", "关系建议", "行动窗口"], button: ["购买解读", "screen-21"] },
  { no: 21, title: "购买弹窗", active: "活动", modalTitle: "购买完整解读", modalItems: ["地风升完整卦象 ¥12", "包含本卦、变卦与行动建议"], next: "screen-29" },
  { no: 22, title: "邀请好友", active: "活动", cards: [["邀请好友", "邀请码：8R7U58ZW"], ["奖励规则", "好友注册后可获得灵石。"]], button: ["查看活动中心", "screen-23"] },
  { no: 23, title: "活动中心", active: "活动", cards: [["活动中心", "邀请、签到、兑换礼包。"], ["当前进度", "已邀请 0 人"]], button: ["邀请好友", "screen-22"] },
  { no: 24, title: "邀请详情", active: "活动", sections: ["邀请详情", "奖励说明", "到账规则", "常见问题"] },
  { no: 25, title: "档案", active: "档案", list: [["谢广周", "男｜阳历 2026-05-12", "screen-26"], ["查看命盘", "紫微命盘 / 八字", "screen-27"], ["AI问天", "使用当前档案提问", "screen-4"]] },
  { no: 26, title: "排盘表单", active: "档案", form: ["姓名", "性别", "出生日期", "出生地"], button: ["开始排盘", "screen-27"] },
  { no: 27, title: "紫微命盘", active: "档案", chart: true, button: ["购买解读", "screen-21"] },
  { no: 28, title: "卡券包", active: "我的", cards: [["卡券包", "暂无可用卡券"], ["兑换报告券", "可使用灵石兑换。"]] },
  { no: 29, title: "灵石充值", active: "我的", recharge: true },
  { no: 30, title: "支付页", active: "我的", cards: [["订单信息", "支付金额 ¥12.00"]], button: ["确认支付 ¥12.00", "screen-31"] },
  { no: 31, title: "我的", active: "我的", mine: true },
  { no: 32, title: "账户设置", active: "我的", list: [["基本信息", "", "screen-39"], ["登录方式", "", "screen-40"], ["设置密码", "", "screen-41"], ["退出登录", "", "screen-31"]] },
  { no: 33, title: "问天会员", active: "我的", cards: [["普通会员", ""], ["会员权益", "会员权益/套餐信息"], ["月度会员 ¥38", "会员权益/套餐信息"], ["年度会员 ¥348", "会员权益/套餐信息"]], button: ["立即开通 ¥38", "screen-30"] },
  { no: 34, title: "分享问天AI", active: "我的", modalTitle: "分享问天AI", modalItems: ["分享文本", "邀请码：8R7U58ZW", "微信好友 / 朋友圈 / 复制链接"], next: "screen-31" },
  { no: 35, title: "联系我们", active: "我的", list: [["电子邮箱", "", ""], ["小红书", "", ""], ["微信公众号", "", ""], ["X", "", ""]] },
  { no: 36, title: "关于我们", active: "我的", cards: [["问天AI v1.0.3199", "问天AI是一款命理排盘、合盘、抽签与AI解读工具。"], ["隐私协议", ""], ["用户协议", ""], ["检查更新", ""]] },
  { no: 37, title: "语言设置", active: "我的", modalTitle: "语言设置", modalItems: ["简体中文 ✓", "繁體中文", "English"], next: "screen-38" },
  { no: 38, title: "账户设置", active: "我的", list: [["基本信息", "", "screen-39"], ["登录方式", "", "screen-40"], ["设置密码", "", "screen-41"], ["退出登录", "", "screen-31"]] },
  { no: 39, title: "基本信息", active: "我的", form: ["昵称 谢广周", "邮箱 aa1598...@gmail.com", "手机号 绑定"], button: ["保存", "screen-38"] },
  { no: 40, title: "登录方式", active: "我的", list: [["Apple", "", ""], ["邮箱", "", ""], ["手机号", "", ""], ["Google", "", ""]] },
  { no: 41, title: "设置密码", active: "我的", form: ["新密码", "确认密码"], button: ["保存", "screen-40"] },
  { no: 42, title: "地脉道", active: "活动" },
  { no: 43, title: "选择方位成员", active: "活动" },
  { no: 44, title: "阳宅解读", active: "活动" },
  { no: 45, title: "地脉道教程", active: "活动" }
];

const convertedByNo = new Map(convertedScreens.map((screen) => [screen.no, screen]));

const screenFlowHotspots = {
  1: [[286, 24, 86, 52, "screen-26"], [48, 249, 295, 45, "screen-4"], [18, 342, 318, 157, "screen-2"], [18, 580, 354, 274, "screen-4"], [18, 875, 354, 96, "screen-10"], [18, 984, 354, 96, "screen-13"], [18, 1093, 354, 96, "screen-17"], [18, 1202, 354, 96, "screen-23"], [18, 1311, 354, 96, "screen-42"], [18, 1488, 354, 104, "screen-22"], [18, 1612, 354, 104, "screen-23"], [2, 1748, 76, 83, "screen-1"], [80, 1748, 76, 83, "screen-25"], [158, 1748, 76, 83, "screen-3"], [236, 1748, 76, 83, "screen-13"], [314, 1748, 76, 83, "screen-31"]],
  2: [[18, 282, 354, 190, "screen-4"], [18, 487, 354, 190, "screen-4"], [18, 692, 354, 175, "screen-4"]],
  3: [[285, 128, 82, 28, "screen-5"], [16, 164, 358, 84, "screen-5"], [16, 305, 358, 116, "screen-4"], [2, 761, 76, 72, "screen-1"], [80, 761, 76, 72, "screen-25"], [158, 761, 76, 72, "screen-3"], [236, 761, 76, 72, "screen-13"], [314, 761, 76, 72, "screen-31"]],
  4: [[18, 44, 48, 48, "screen-3"], [276, 44, 96, 48, "screen-9"], [300, 104, 58, 34, "screen-5"]],
  5: [[320, 116, 48, 48, "screen-4"], [34, 235, 322, 72, "screen-6"], [34, 318, 322, 72, "screen-6"], [48, 748, 294, 52, "screen-6"]],
  6: [[18, 44, 48, 48, "screen-4"], [88, 600, 220, 76, "screen-7"]],
  7: [[18, 44, 48, 48, "screen-4"], [54, 280, 282, 168, "screen-8"]],
  8: [[18, 44, 48, 48, "screen-7"]],
  9: [[18, 44, 48, 48, "screen-4"], [278, 44, 84, 48, "screen-4"], [20, 118, 350, 72, "screen-7"], [20, 198, 350, 72, "screen-7"], [20, 278, 350, 72, "screen-7"]],
  10: [[18, 44, 48, 48, "screen-1"], [24, 165, 342, 90, "screen-11"], [24, 270, 342, 90, "screen-11"], [24, 375, 342, 90, "screen-11"]],
  11: [[18, 44, 48, 48, "screen-10"], [20, 120, 350, 88, "screen-12"], [20, 220, 350, 88, "screen-12"], [42, 742, 306, 56, "screen-12"], [220, 708, 108, 44, "screen-12"]],
  12: [[18, 44, 48, 48, "screen-4"], [22, 150, 346, 72, "screen-4"], [116, 690, 158, 54, "screen-4"]],
  13: [[18, 44, 48, 48, "screen-1"], [82, 620, 226, 70, "screen-14"]],
  14: [[65, 570, 260, 90, "screen-15"]],
  15: [[18, 44, 48, 48, "screen-13"], [43, 615, 304, 58, "screen-16"]],
  16: [[18, 44, 48, 48, "screen-15"], [162, 1210, 66, 44, "screen-4"]],
  17: [[18, 44, 48, 48, "screen-1"], [70, 610, 250, 72, "screen-18"]],
  18: [[18, 44, 48, 48, "screen-17"], [70, 610, 250, 72, "screen-19"]],
  19: [[18, 44, 48, 48, "screen-18"], [70, 610, 250, 72, "screen-20"]],
  20: [[18, 44, 48, 48, "screen-19"], [42, 742, 306, 56, "screen-21"]],
  21: [[316, 175, 48, 48, "screen-20"], [50, 705, 290, 58, "screen-29"]],
  22: [[18, 44, 48, 48, "screen-31"], [250, 44, 112, 48, "screen-23"], [42, 735, 306, 62, "screen-24"]],
  23: [[18, 44, 48, 48, "screen-22"], [50, 680, 290, 58, "screen-22"]],
  24: [[18, 44, 48, 48, "screen-22"]],
  25: [[302, 54, 70, 46, "screen-26"], [18, 129, 354, 95, "screen-27"], [18, 247, 354, 95, "screen-27"], [2, 784, 76, 72, "screen-1"], [80, 784, 76, 72, "screen-25"], [158, 784, 76, 72, "screen-3"], [236, 784, 76, 72, "screen-13"], [314, 784, 76, 72, "screen-31"]],
  26: [[18, 40, 96, 54, "screen-1"]],
  27: [[18, 40, 96, 54, "screen-26"], [36, 739, 318, 44, "screen-4"]],
  28: [[18, 44, 48, 48, "screen-31"], [42, 735, 306, 58, "screen-29"]],
  29: [[18, 44, 48, 48, "screen-31"], [22, 178, 346, 70, "screen-30"], [22, 257, 346, 70, "screen-30"], [22, 336, 346, 70, "screen-30"], [34, 738, 322, 58, "screen-30"]],
  30: [[18, 44, 48, 48, "screen-29"], [42, 735, 306, 58, "screen-31"]],
  31: [[336, 54, 42, 42, "screen-38"], [16, 126, 358, 96, "screen-38"], [16, 240, 111, 75, "screen-29"], [139, 240, 111, 75, "screen-28"], [262, 240, 111, 75, "screen-9"], [16, 330, 174, 60, "screen-33"], [200, 330, 174, 60, "screen-29"], [16, 400, 174, 60, "screen-27"], [200, 400, 174, 60, "screen-30"], [16, 491, 358, 61, "screen-22"], [16, 552, 358, 61, "screen-28"], [16, 629, 358, 61, "screen-37"], [16, 690, 358, 61, "screen-34"], [16, 767, 358, 61, "screen-35"], [2, 762, 76, 72, "screen-1"], [80, 762, 76, 72, "screen-25"], [158, 762, 76, 72, "screen-3"], [236, 762, 76, 72, "screen-13"], [314, 762, 76, 72, "screen-31"]],
  32: [[18, 44, 48, 48, "screen-31"], [20, 94, 350, 56, "screen-39"], [20, 164, 350, 56, "screen-33"], [20, 236, 350, 56, "screen-40"], [20, 306, 350, 56, "screen-41"], [20, 376, 350, 56, "screen-37"], [20, 452, 350, 56, "screen-34"], [20, 520, 350, 56, "screen-35"], [20, 590, 350, 56, "screen-36"]],
  33: [[18, 44, 48, 48, "screen-31"], [42, 735, 306, 58, "screen-29"]],
  34: [[18, 44, 48, 48, "screen-31"], [42, 735, 306, 58, "screen-22"]],
  35: [[18, 44, 48, 48, "screen-38"]],
  36: [[18, 44, 48, 48, "screen-38"]],
  37: [[18, 44, 48, 48, "screen-38"], [20, 145, 350, 56, "screen-38"]],
  38: [[18, 44, 48, 48, "screen-31"], [20, 150, 350, 56, "screen-39"], [20, 220, 350, 56, "screen-40"], [20, 290, 350, 56, "screen-41"], [20, 360, 350, 56, "screen-37"], [20, 500, 350, 56, "screen-35"], [20, 570, 350, 56, "screen-36"]],
  39: [[18, 44, 48, 48, "screen-38"], [42, 742, 306, 56, "screen-38"]],
  40: [[18, 44, 48, 48, "screen-38"], [20, 236, 350, 56, "screen-41"]],
  41: [[18, 44, 48, 48, "screen-40"], [42, 742, 306, 56, "screen-40"]],
  42: [],
  43: [],
  44: [],
  45: []
};

const routes = {
  home: ["问天AI", "命理报告", renderHome],
  ai: ["问天AI", "AI问天", renderAI],
  archive: ["个人档案", "档案列表", renderArchive],
  divine: ["占问工具", "抽签与起卦", renderDivine],
  mine: ["账户中心", "我的", renderMine],
  recharge: ["账户中心", "灵石充值", renderRecharge],
  settings: ["账户中心", "账户设置", renderSettings],
  chart: ["个人档案", "排盘表单", renderChartForm],
  report: ["命理报告", "报告详情", renderReport],
  pay: ["支付", "支付页", renderPay]
};

const routeAliases = {
  "": "screen-1",
  home: "screen-1",
  index: "screen-1",
  mall: "screen-2",
  shop: "screen-2",
  store: "screen-2",
  ai: "screen-3",
  ask: "screen-3",
  chat: "screen-4",
  records: "screen-9",
  archive: "screen-25",
  archives: "screen-25",
  profile: "screen-25",
  chart: "screen-26",
  report: "screen-27",
  reports: "screen-27",
  divine: "screen-13",
  activity: "screen-13",
  treasure: "screen-13",
  mine: "screen-31",
  account: "screen-31",
  settings: "screen-38",
  recharge: "screen-29",
  pay: "screen-30",
  payment: "screen-30",
  coupons: "screen-28",
  vip: "screen-33",
  membership: "screen-33",
  invite: "screen-22",
  share: "screen-34",
  contact: "screen-35",
  about: "screen-36",
  language: "screen-37",
  basic: "screen-39",
  login: "screen-40",
  password: "screen-41"
};

const state = {
  route: "screen-1",
  stack: []
};

const view = document.getElementById("view");
const routeKicker = document.getElementById("routeKicker");
const routeTitle = document.getElementById("routeTitle");
const screenNav = document.getElementById("screenNav");
let wentianFitRaf = 0;
const WENTIAN_PHONE_WIDTH = 390;
const WENTIAN_PHONE_HEIGHT = 844;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

function figText(id, text, x, y, w, size, color, weight = 400, align = "left", extra = "") {
  return `<p class="fig-text" data-node-id="${id}" style="left:${x}px;top:${y}px;width:${w}px;font-size:${size}px;color:${color};font-weight:${weight};text-align:${align};${extra}">${text}</p>`;
}

function figBox(id, x, y, w, h, className = "", style = "", attrs = "") {
  return `<div class="fig-box ${className}" data-node-id="${id}" ${attrs} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}"></div>`;
}

function figImage(id, src, x, y, w, h, style = "") {
  return `<img class="fig-img" data-node-id="${id}" src="${src}" alt="" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}">`;
}

function figButton(id, x, y, w, h, attrs, className = "", style = "") {
  return `<button class="fig-click ${className}" type="button" data-node-id="${id}" ${attrs} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}"></button>`;
}

function figLine(id, x, y, w, color = "#e5decc") {
  return `<div class="fig-line" data-node-id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:1px;background:${color};"></div>`;
}

const WENTIAN_COLOR_UPGRADE = {
  "#111": "#1c1410",
  "#14110d": "#1c1410",
  "#16130f": "#1c1410",
  "#1e1712": "#1c1410",
  "#1f1d1a": "#201813",
  "#21211f": "#201813",
  "#222": "#201813",
  "#241d17": "#201813",
  "#251f1a": "#1c1410",
  "#25211d": "#201813",
  "#25221f": "#201813",
  "#26211c": "#201813",
  "#26261f": "#201813",
  "#2a2928": "#241b17",
  "#2b201d": "#201813",
  "#2b2722": "#201813",
  "#2d2420": "#201813",
  "#3a3732": "#2d211b",
  "#3a3834": "#2d211b",
  "#3b3934": "#2d211b",
  "#40332b": "#3b2b22",
  "#403b2e": "#3b2b22",
  "#4a3f39": "#514238",
  "#5f5a52": "#76695e",
  "#625b53": "#76695e",
  "#665940": "#756044",
  "#6e675d": "#7a6d60",
  "#6f665d": "#7a6d60",
  "#706a63": "#7a6d60",
  "#756d63": "#7a6d60",
  "#776f65": "#7a6d60",
  "#79766f": "#857a70",
  "#7f756b": "#857a70",
  "#7f766b": "#857a70",
  "#7f7a74": "#857a70",
  "#8b8176": "#8f8173",
  "#8b857d": "#8f8173",
  "#8c8275": "#8f8173",
  "#8c8c80": "#948879",
  "#8d8175": "#8f8173",
  "#8d857b": "#8f8173",
  "#8d877e": "#8f8173",
  "#8d8982": "#948879",
  "#8f857a": "#8f8173",
  "#8f867b": "#8f8173",
  "#8f887f": "#948879",
  "#8f8a84": "#948879",
  "#91897f": "#948879",
  "#928b83": "#948879",
  "#948f85": "#9d9183",
  "#969087": "#9d9183",
  "#9a9086": "#9d9183",
  "#9a938a": "#9d9183",
  "#9b9287": "#9d9183",
  "#9e968d": "#a79a8d",
  "#9e998f": "#a79a8d",
  "#9e9e94": "#a79a8d",
  "#a09890": "#a79a8d",
  "#a09a94": "#a79a8d",
  "#a19a91": "#a79a8d",
  "#a3a194": "#aca092",
  "#a3a199": "#aca092",
  "#a69b8d": "#aca092",
  "#a79986": "#aca092",
  "#a8a699": "#aca092",
  "#a99f94": "#aca092",
  "#aaa196": "#aca092",
  "#adaba1": "#b7ab9d",
  "#b4ada5": "#b7ab9d",
  "#b5ad9d": "#b7ab9d",
  "#b6b0aa": "#b7ab9d",
  "#b7ac9c": "#b7ab9d",
  "#b8b0a7": "#b7ab9d",
  "#b8b2a8": "#b7ab9d",
  "#bbb3aa": "#c0b3a4",
  "#bdb5aa": "#c0b3a4",
  "#009e40": "#2f8c72",
  "#2d7a3a": "#2f8c72",
  "#4d7a5b": "#2f8c72",
  "#4e9b93": "#2f8c72",
  "#5fae95": "#2f8c72",
  "#6fb866": "#4f8f5f",
  "#7aa65b": "#4f8f5f",
  "#7d8d52": "#5f8745",
  "#039": "#315f9a",
  "#0578e0": "#3269a6",
  "#0d75e0": "#3269a6",
  "#145bdc": "#3269a6",
  "#2d5fa0": "#3269a6",
  "#476885": "#3269a6",
  "#4f82a4": "#3269a6",
  "#6b3fa0": "#7653a7",
  "#8d251d": "#8f2c26",
  "#8d302a": "#8f2c26",
  "#963d32": "#9d3329",
  "#9b4238": "#9d3329",
  "#9c4a3e": "#a94437",
  "#9d3b2f": "#a7372f",
  "#9f2417": "#9d3329",
  "#a13824": "#a7372f",
  "#a34d33": "#a94437",
  "#a52705": "#a7372f",
  "#a73f35": "#a94437",
  "#ad3b35": "#a94437",
  "#b33a2f": "#a94437",
  "#b64c47": "#b85245",
  "#b81a05": "#a7372f",
  "#be3f2e": "#b85245",
  "#9a6b33": "#9a681c",
  "#9b742e": "#9a681c",
  "#9d8a62": "#9b7a3f",
  "#9e6b08": "#9a681c",
  "#9f741d": "#9a681c",
  "#a47420": "#a37018",
  "#a47725": "#a37018",
  "#a77721": "#a37018",
  "#a98745": "#a47a32",
  "#b07a2d": "#a37018",
  "#b2822e": "#a37018",
  "#b28b45": "#a47a32",
  "#b5903d": "#a47a32",
  "#b88c33": "#b78322",
  "#b98729": "#b78322",
  "#ba8f38": "#b78322",
  "#bd8624": "#b78322",
  "#c08a2c": "#c48b25",
  "#c09a49": "#c2953c",
  "#c3a371": "#c5a66b",
  "#c49a34": "#c48b25",
  "#c4a45a": "#c5a66b",
  "#c58a2c": "#c48b25",
  "#c58d25": "#c48b25",
  "#c69a34": "#c48b25",
  "#c69a3e": "#c2953c",
  "#c8a65f": "#c5a66b",
  "#d1a43b": "#c9952d",
  "#d2a642": "#c9952d",
  "#d5ad42": "#c9952d",
  "#d7a941": "#c9952d",
  "#d8aa3b": "#c9952d",
  "#d8ab3c": "#c9952d",
  "#df7d8f": "#d87486",
  "#e98aa0": "#d87486",
  "#ed7385": "#d87486",
  "#f0a229": "#d99326",
  "#f3d86d": "#efc85a",
  "#e0c98c": "#d9bb72",
  "#ead8ae": "#ead2a2",
  "#d6b463": "#cf9d36",
  "#d0a33c": "#c9952d",
  "#c5a458": "#c2953c",
  "#c6a04c": "#c2953c",
  "#c9aa60": "#c5a66b",
  "#cfad5c": "#c5a66b",
  "#d2c4b5": "#e2cfb8",
  "#d7d2c8": "#e0d4c5",
  "#ded9d0": "#e6d8c6",
  "#dedbd5": "#e6d8c6",
  "#dedbd6": "#e6d8c6",
  "#e1d7c8": "#e7d7bf",
  "#e3d5bd": "#e7d3b5",
  "#e4dcce": "#e7d7bf",
  "#e5dbc7": "#e7d7bf",
  "#e5decc": "#e7d7bf",
  "#e5ded3": "#e7d7bf",
  "#e6dfd0": "#eadfce",
  "#e7ddcb": "#e7d7bf",
  "#e8ded0": "#e7d7bf",
  "#eadfce": "#e7d7bf",
  "#eee8df": "#efe2d0",
  "#efe4d2": "#ead9bd",
  "#f0ebe1": "#f6ead9",
  "#f1eadf": "#f7ead8",
  "#f2ede8": "#f1e8de",
  "#f4ead8": "#fff0d6",
  "#f4ebd5": "#fff0d6",
  "#f4f2ef": "#f3ece3",
  "#f5ead4": "#fff0d6",
  "#f5f6ef": "#f5efe3",
  "#f6eddb": "#fff0d6",
  "#f7ecd5": "#fff0d6",
  "#f7efea": "#fff1ea",
  "#f7f2ea": "#fff1dc",
  "#f7f2ec": "#fff6ea",
  "#f7f7f6": "#fff7ec",
  "#f8f1e3": "#fff0d6",
  "#f8f3ea": "#fff7ec",
  "#f8f3eb": "#fff2df",
  "#f8f4ea": "#fff7ec",
  "#faf5ed": "#fff6ea",
  "#faf8f3": "#fffaf3",
  "#fae5df": "#fff0e8",
  "#fbf1dd": "#fff0d6",
  "#fbf7ef": "#fff6ea",
  "#fbf7f1": "#fff6ea",
  "#fcecea": "#fff0e8",
  "#fdfcf9": "#fffaf3",
  "#fff7e8": "#fff0d6",
  "#fff7f2": "#fff1ea",
  "#fff8ec": "#fff1dc",
  "#fff8ef": "#fff1dc",
  "#fffaf0": "#fff1dc",
  "#fffdf8": "#fffaf3"
};

function applyWentianColorUpgrade(markup) {
  return String(markup).replace(/#[0-9a-fA-F]{3,8}\b/g, (hex) => WENTIAN_COLOR_UPGRADE[hex.toLowerCase()] || hex);
}

function figStatus(time) {
  return `
    ${figText("status-time", time, 22, 16, 90, 21, "#21211f", 700)}
    ${figText("status-net", "◷  30.4\\nKB/s   5G  ▮▮▮  33 ⚡", 266, 15, 106, 10, "#21211f", 700, "right")}
  `;
}

function figPhone(nodeId, name, body, height = 844, extraClass = "", showHomeIndicator = true) {
  return `
    <div class="phone-wrap">
      <section class="figma-phone ${extraClass}" data-node-id="${nodeId}" data-name="${name}" style="height:${height}px">
        ${body}
        ${showHomeIndicator ? '<div class="fig-home-indicator"></div>' : ""}
      </section>
    </div>
  `;
}

function figBottomNav(active) {
  const items = [
    ["home", "◒", "首页"],
    ["archive", "▢", "档案"],
    ["ai", "◐", "问天AI"],
    ["home", "▣", "藏宝阁"],
    ["mine", "●", "我的"]
  ];
  return `
    ${figBox("bottom-bg", 0, 760, 390, 84, "", "background:#fff;box-shadow:0 -8px 18px rgba(0,0,0,.04);")}
    ${items.map(([route, icon, label], index) => {
      const left = [18, 95, 178, 259, 333][index];
      const color = label === active ? "#b81a05" : "#8c8c80";
      return `
        ${figButton(`bottom-${label}`, left - 8, 760, 58, 66, `data-route="${route}"`)}
        ${figText(`bottom-icon-${label}`, icon, left, 769, 34, 30, color, 700, "center")}
        ${figText(`bottom-label-${label}`, label, left - 9, 807, 50, 15, color, 500, "center")}
      `;
    }).join("")}
  `;
}

function convertedHeader(screen) {
  return `
    ${figText(`screen-${screen.no}-time`, screen.no >= 36 ? "15:19" : screen.no >= 30 ? "15:18" : "15:16", 18, 10, 70, 11, "#26211c")}
    ${figText(`screen-${screen.no}-battery`, "● ● ● 72%", 292, 10, 78, 11, "#26211c", 400, "right")}
    ${figButton(`screen-${screen.no}-back-hit`, 10, 36, 54, 54, 'data-action="back"')}
    ${figText(`screen-${screen.no}-back`, "‹", 22, 42, 30, 28, "#26211c")}
    ${figText(`screen-${screen.no}-title`, screen.title, 62, 48, 266, 17, "#26211c", 700, "center")}
  `;
}

function convertedBottomNav(active) {
  if (!active) return "";
  const current = active === "活动" ? "藏宝阁" : active;
  const items = [
    ["screen-1", "首页", "◒", 39],
    ["screen-25", "档案", "▢", 117],
    ["screen-3", "问天AI", "◐", 195],
    ["screen-13", "藏宝阁", "♧", 273],
    ["screen-31", "我的", "○", 351]
  ];
  return `
    ${figBox("converted-bottom-bg", 0, 780, 390, 64, "", "background:#fff;box-shadow:0 -4px 14px rgba(0,0,0,.06);")}
    ${items.map(([route, label, icon, x]) => {
      const on = label === current;
      const color = on ? "#a34d33" : "#79766f";
      return `
        ${figButton(`converted-bottom-${label}`, x - 37, 780, 76, 60, `data-route="${route}"`)}
        ${figText(`converted-bottom-icon-${label}`, icon, x - 16, 790, 32, 22, color, 700, "center")}
        ${figText(`converted-bottom-label-${label}`, label, x - 28, 817, 56, 12, color, on ? 700 : 400, "center")}
      `;
    }).join("")}
  `;
}

function convertedCards(screen) {
  const cards = screen.cards || [];
  return cards.map(([title, desc, cta, route], index) => {
    const y = screen.no === 2 ? [120, 250, 368, 486][index] : 112 + index * 104;
    const h = screen.no === 2 ? (index === 0 ? 104 : 92) : 86;
    const ctaStyle = screen.no === 2 ? "background:#a13824;" : "";
    return `
      ${figBox(`screen-${screen.no}-card-${index}`, 24, y, 342, h, "converted-card", "")}
      ${figText(`screen-${screen.no}-card-title-${index}`, title, 40, y + 14, 310, 15, "#26211c", 700)}
      ${desc ? figText(`screen-${screen.no}-card-desc-${index}`, desc, 40, y + 42, 310, 12, "#8c8275") : ""}
      ${cta ? figBox(`screen-${screen.no}-cta-box-${index}`, 250, y + h - 40, 96, 30, "converted-button", ctaStyle) : ""}
      ${cta ? figButton(`screen-${screen.no}-cta-${index}`, 250, y + h - 40, 96, 30, `data-route="${route || "screen-2"}"`) : ""}
      ${cta ? figText(`screen-${screen.no}-cta-text-${index}`, cta, 250, y + h - 32, 96, 11, "#fff", 500, "center") : ""}
    `;
  }).join("");
}

function convertedList(screen) {
  const list = screen.list || [];
  if (screen.no === 3) {
    return list.map(([title, desc, route], index) => {
      const y = 112 + index * 92;
      const avatar = index === 0 ? "谢" : "命";
      return `
        ${figBox(`screen-${screen.no}-row-${index}`, 24, y, 342, 70, "converted-card", "")}
        ${figButton(`screen-${screen.no}-row-hit-${index}`, 24, y, 342, 70, `data-route="${route || "screen-25"}"`)}
        ${figText(`screen-${screen.no}-row-title-${index}`, title, 40, y + 14, 310, 15, "#26211c", 700)}
        ${figText(`screen-${screen.no}-row-desc-${index}`, desc, 40, y + 42, 310, 12, "#8c8275")}
        ${figBox(`screen-${screen.no}-avatar-${index}`, 42, y + 14, 44, 44, "converted-card", "border-radius:22px;background:#f2e8d6;")}
        ${figText(`screen-${screen.no}-avatar-text-${index}`, avatar, 42, y + 26, 44, 14, "#b88c33", 700, "center")}
      `;
    }).join("");
  }
  return list.map(([title, desc, route], index) => {
    const y = 112 + index * 72;
    return `
      ${figBox(`screen-${screen.no}-row-${index}`, 24, y, 342, 56, "converted-card", "")}
      ${route ? figButton(`screen-${screen.no}-row-hit-${index}`, 24, y, 342, 56, `data-route="${route}"`) : ""}
      ${figText(`screen-${screen.no}-row-title-${index}`, title, 40, y + 14, 280, 15, "#26211c", 700)}
      ${desc ? figText(`screen-${screen.no}-row-desc-${index}`, desc, 40, y + 38, 280, 12, "#8c8275") : ""}
      ${figText(`screen-${screen.no}-row-arrow-${index}`, "›", 330, y + 13, 20, 18, "#8c8275", 700, "center")}
    `;
  }).join("");
}

function convertedForm(screen) {
  return (screen.form || []).map((label, index) => {
    const y = 120 + index * 62;
    return `
      ${figText(`screen-${screen.no}-label-${index}`, label, 34, y + 12, 110, 14, "#8c8275")}
      ${figBox(`screen-${screen.no}-input-${index}`, 130, y, 224, 42, "converted-card", "border-radius:8px;")}
      ${figText(`screen-${screen.no}-placeholder-${index}`, "请输入", 144, y + 12, 160, 13, "#b7ac9c")}
    `;
  }).join("");
}

function convertedSections(screen) {
  return (screen.sections || []).map((title, index) => {
    const y = 96 + index * 86;
    return `
      ${figBox(`screen-${screen.no}-section-${index}`, 42, y, 306, 68, "converted-card", "")}
      ${figText(`screen-${screen.no}-section-title-${index}`, title, 58, y + 14, 274, 15, "#26211c", 700)}
      ${figText(`screen-${screen.no}-section-desc-${index}`, "结合当前档案生成的命理解读与行动建议。", 58, y + 42, 274, 12, "#8c8275")}
    `;
  }).join("");
}

function convertedModal(screen) {
  if (!screen.modalTitle) return "";
  const items = screen.modalItems || [];
  return `
    ${figBox(`screen-${screen.no}-overlay`, 0, 0, 390, 844, "", "background:rgba(0,0,0,.3);")}
    ${figBox(`screen-${screen.no}-modal`, 20, 500, 350, 260, "", "border-radius:20px;background:#fff;")}
    ${figText(`screen-${screen.no}-modal-title`, screen.modalTitle, 42, 526, 200, 18, "#26211c", 700)}
    ${items.map((item, index) => `
      ${figBox(`screen-${screen.no}-modal-row-${index}`, 42, 570 + index * 42, 306, 34, "converted-card", "border-radius:10px;")}
      ${figText(`screen-${screen.no}-modal-text-${index}`, item, 58, 578 + index * 42, 274, 13, "#26211c")}
    `).join("")}
    ${figBox(`screen-${screen.no}-modal-btn`, 220, 708, 108, 44, "converted-button", "")}
    ${figButton(`screen-${screen.no}-modal-hit`, 220, 708, 108, 44, `data-route="${screen.next || "screen-2"}"`)}
    ${figText(`screen-${screen.no}-modal-confirm`, "确定", 220, 720, 108, 13, "#fff", 500, "center")}
  `;
}

function sourceHomeScreen(screen) {
  const reports = [
    ["生命健康预测报告(文字版持续更新)", "基于您的八字信息，系统将计算出横跨121年的生命能量曲线。预见人生的波峰与波谷，在关键节…", "¥99", "¥199.99", "980 灵石", 282],
    ["2026丙午年预测报告", "全面八字分析，2026概览、太岁情况、事业发展、财富运势、爱情婚姻、健康关注、风水建议、每…", "¥50", "¥99", "500 灵石", 487],
    ["八字与MBTI人格深度解析及运势全面预测", "融合八字命理学与MBTI四维模型。从五行能量场到潜意识决策模式，为您深度揭示性格底色、原生…", "¥58", "¥88", "580 灵石", 692]
  ];
  return `
    ${figText("source-2-time", "15:16", 18, 16, 70, 14, "#26211c")}
    ${figText("source-2-status", "◉  0.00  5G  ▮ 31 ⚡", 250, 14, 120, 10, "#26211c", 700, "right")}
    ${figText("source-2-back", "‹", 28, 56, 28, 28, "#c6a763", 400)}
    ${figText("source-2-title", "命理报告", 62, 61, 266, 18, "#c6a763", 700, "center")}
    ${figBox("source-2-hero", 18, 98, 354, 166, "", "border-radius:13px;background:linear-gradient(135deg,#b64c47,#8d302a);box-shadow:0 9px 22px rgba(161,56,36,.18);")}
    ${figText("source-2-hero-title", "你的专属命理报告，立即生成", 36, 119, 320, 22, "#fff", 800)}
    ${figText("source-2-hero-sub", "解锁AI专属命理报告，快速获得可执行建议", 36, 153, 304, 14, "rgba(255,255,255,.9)")}
    ${figText("source-2-hero-lines", "· 覆盖事业、情感、财富等核心场景\\n· 结合命盘结构输出高价值行动建议\\n· 下单后自动生成，可在我的报告持续复盘", 36, 184, 312, 13, "#fff", 500, "left", "line-height:1.75;")}
    ${reports.map(([title, desc, price, oldPrice, stones, y], index) => `
      ${figBox(`source-2-report-${index}`, 18, y, 354, index === 2 ? 184 : 190, "converted-card", "border-radius:12px;box-shadow:0 8px 20px rgba(70,45,25,.12);")}
      ${figBox(`source-2-tag-${index}`, 36, y + 22, 44, 28, "", "border-radius:14px;background:#fff4ec;")}
      ${figText(`source-2-tag-text-${index}`, "八字", 44, y + 29, 28, 11, "#9a6b33", 700, "center")}
      ${figText(`source-2-price-${index}`, price, 285, y + 20, 60, 26, "#8d251d", 800, "right")}
      ${figText(`source-2-card-title-${index}`, title, 36, y + 60, index === 2 ? 322 : 300, index === 2 ? 15 : 17, "#26211c", 800, "left", index === 2 ? "white-space:nowrap;" : "")}
      ${figText(`source-2-card-desc-${index}`, desc, 36, y + 92, 300, 13, "#6f665d", 400, "left", "line-height:1.55;")}
      ${figText(`source-2-old-${index}`, oldPrice, 36, y + 143, 80, 12, "#a99f94", 400, "left", "text-decoration:line-through;")}
      ${figText(`source-2-stone-${index}`, stones, 36, y + 160, 90, 13, "#6f665d")}
      ${figBox(`source-2-unlock-${index}`, 262, y + 145, 88, 32, "", "border-radius:16px;background:#fff3ef;")}
      ${figText(`source-2-unlock-text-${index}`, "立即解锁 →", 270, y + 153, 72, 12, "#8d251d", 700, "center")}
    `).join("")}
  `;
}

function sourceAppBottomNav(active, y = 778) {
  const items = [
    ["首页", "◒", 39, "screen-1"],
    ["档案", "▢", 117, "screen-25"],
    ["问天AI", "◐", 195, "screen-3"],
    ["藏宝阁", "♧", 273, "screen-13"],
    ["我的", "○", 351, "screen-31"]
  ];
  return `
    ${figBox("source-bottom-bg", 0, y, 390, 89, "", "background:#fff;box-shadow:0 -4px 14px rgba(0,0,0,.06);")}
    ${items.map(([label, icon, x, route]) => {
      const on = label === active;
      const color = on ? "#a34d33" : "#79766f";
      return `
        ${figButton(`source-bottom-hit-${label}`, x - 37, y + 6, 76, 72, `data-route="${route}"`)}
        ${figText(`source-bottom-icon-${label}`, icon, x - 16, y + 16, 32, 22, color, 700, "center")}
        ${figText(`source-bottom-label-${label}`, label, x - 28, y + 48, 56, 12, color, on ? 700 : 400, "center")}
      `;
    }).join("")}
  `;
}

function sourceArchiveScreen(screen) {
  const activeArchive = getCurrentWentianArchive();
  const active = getWentianArchiveDisplay(activeArchive);
  const masters = [
    ["许半仙", "紫微命盘", "AI解析", "", "已接入您的紫微命盘，可直接开启对话", 305]
  ];
  return `
    ${figText("source-3-time", "15:17", 18, 16, 70, 14, "#26211c")}
    ${figText("source-3-status", "◉  0.00  5G  ▮ 31 ⚡", 250, 14, 120, 10, "#26211c", 700, "right")}
    ${figText("source-3-title", "问天AI", 18, 62, 160, 29, "#26211c", 800)}
    ${figText("source-3-subtitle", "许半仙已准备好为您解读", 18, 101, 220, 13, "#7f756b")}
    ${figText("source-3-current-title", "当前档案", 18, 136, 120, 15, "#26211c", 800)}
    ${figText("source-3-change", "更换档案 〉", 284, 138, 88, 12, "#9b742e", 500, "right")}
    ${figBox("source-3-profile", 16, 164, 358, 84, "converted-card", "border-radius:12px;box-shadow:0 6px 18px rgba(90,62,34,.09);")}
    ${figImage("source-3-profile-avatar", "../images/wentian-prototype-assets/03-profile.jpg", 38, 182, 48, 48, "border-radius:24px;border:1px solid #e4d2a7;")}
    ${figText("source-3-profile-name", escapeHtml(active.name), 102, 189, 62, 16, "#26211c", 800)}
    ${figBox("source-3-gender", 128, 186, 30, 18, "", "border-radius:9px;background:#f7ecd5;")}
    ${figText("source-3-gender-text", active.gender, 128, 190, 30, 10, "#b07a2d", 700, "center")}
    ${figBox("source-3-profile-tag", 164, 186, 62, 18, "", "border-radius:9px;background:#f7ecd5;")}
    ${figText("source-3-profile-tag-text", "紫微命盘", 164, 190, 62, 10, "#c3a371", 500, "center")}
    ${figText("source-3-profile-date", escapeHtml(active.datetime), 102, 215, 170, 12, "#8d8175")}
    ${figText("source-3-profile-switch", "⇅", 334, 199, 22, 22, "#b5ad9d", 500, "center")}
    ${figText("source-3-master-title", "命理师", 18, 276, 160, 15, "#26211c", 800)}
    ${masters.map(([name, tag1, tag2, tag3, desc, y], index) => `
      ${figBox(`source-3-master-${index}`, 16, y, 358, 116, "converted-card", "border-radius:17px;background:linear-gradient(110deg,#fff,#f8f4ea);box-shadow:0 7px 20px rgba(92,64,32,.11);")}
      ${figImage(`source-3-master-avatar-${index}`, "../images/wentian-prototype-assets/xu-banxian.jpg", 34, y + 20, 62, 62, "border-radius:31px;object-fit:cover;object-position:center 18%;")}
      ${figText(`source-3-master-name-${index}`, name, 112, y + 24, 194, 17, "#26211c", 800)}
      ${figBox(`source-3-pill-a-${index}`, 112, y + 54, 62, 18, "", "border-radius:9px;background:#f7ecd8;")}
      ${figText(`source-3-pill-a-text-${index}`, tag1, 112, y + 58, 62, 10, "#b88c33", 600, "center")}
      ${figBox(`source-3-pill-b-${index}`, 184, y + 54, 62, 18, "", "border-radius:9px;background:#f7ecd8;")}
      ${figText(`source-3-pill-b-text-${index}`, tag2, 184, y + 58, 62, 10, "#b88c33", 600, "center")}
      ${tag3 ? figBox(`source-3-pill-c-${index}`, 252, y + 54, 82, 18, "", "border-radius:9px;background:#f7ecd8;") : ""}
      ${tag3 ? figText(`source-3-pill-c-text-${index}`, tag3, 252, y + 58, 82, 10, "#b88c33", 600, "center") : ""}
      ${figText(`source-3-master-desc-${index}`, desc, 112, y + 82, 232, 13, "#9a9086", 400, "left", "line-height:1.5;")}
    `).join("")}
    ${sourceAppBottomNav("问天AI", 755)}
  `;
}

function sourceAiChatScreen(screen) {
  const activeArchive = getCurrentWentianArchive();
  const active = getWentianArchiveDisplay(activeArchive);
  const starters = [
    ["人生主线", "结合我的命盘，先讲我整体的人生主线，这辈子的走法和最该把握的事。"],
    ["感情婚姻", "结合我的命盘，重点看感情婚姻，什么样的感情路子，容易卡在哪里，何时有缘。"],
    ["事业方向", "结合我的命盘，重点看事业，我适合往哪个方向发展，怎么做比较顺。"],
    ["财运投资", "结合我的命盘，重点看财运，我适合怎么赚钱，有没有偏财或投资运。"],
    ["最近一年", "结合我的命盘和当前流年，告诉我接下来一年最重要的机会和要注意的坑。"],
    ["何时转运", "结合我的命盘，我现在处于什么运势阶段，什么时候会好转，要怎么熬过去。"],
    ["健康运势", "结合我的命盘，看一下我的健康运势，有没有什么身体上需要特别留意的。"],
    ["贵人运", "结合我的命盘，我命中的贵人在哪里，什么时候容易遇到贵人，怎么把握。"],
    ["子女缘分", "结合我的命盘，看一下我的子女缘分，以及和子女相关的运势如何。"],
    ["家庭六亲", "结合我的命盘，看一下我和家人的缘分，与父母、兄弟、另一半的关系如何。"]
  ];
  return `
    ${figBox("source-4-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figText("source-4-back", "‹", 28, 35, 28, 34, "#26211c", 500)}
    ${figImage("source-4-avatar", "../images/wentian-prototype-assets/xu-banxian.jpg", 58, 31, 34, 34, "border-radius:17px;object-fit:cover;object-position:center 18%;")}
    ${figText("source-4-name", "许半仙", 100, 39, 130, 16, "#26211c", 800)}
    ${figText("source-4-record", "◷ 对话记录", 282, 40, 88, 12, "#6f665d", 500, "right")}
    ${figLine("source-4-line-a", 0, 84, 390, "#eee8df")}
    ${figText("source-4-left", "◇ 许半仙体系", 18, 101, 150, 12, "#9d8a62")}
    ${figBox("source-4-profile-pill", 286, 92, 72, 34, "", "border-radius:17px;background:#fff;box-shadow:0 4px 12px rgba(70,45,25,.08);")}
    ${figText("source-4-profile-text", `${escapeHtml(active.name)}⌄`, 296, 102, 52, 13, "#26211c", 500, "center")}
    ${figLine("source-4-line-b", 0, 137, 390, "#eee8df")}
    ${figBox("source-4-context", 22, 154, 346, 42, "", "border:1px solid #eadfce;border-radius:13px;background:#fffaf3;box-shadow:0 5px 14px rgba(70,45,25,.06);")}
    ${figBox("source-4-context-dot", 40, 170, 8, 8, "", "border-radius:4px;background:#5f8745;")}
    ${figText("source-4-context-title", "已接入命盘", 58, 163, 100, 13, "#25211d", 800)}
    ${figText("source-4-context-sub", "可直接提问", 210, 163, 120, 13, "#8f857a", 500, "right")}
    <div id="wentian-chat-status" class="wentian-chat-status">正在接入许半仙…</div>
    <div id="wentian-chat-messages" class="wentian-chat-log" aria-live="polite"></div>
    ${figText("source-4-faq-title", "常见问题", 22, 572, 90, 13, "#25211d", 800)}
    <div class="wentian-chat-starters" aria-label="常见问题">
      ${starters.map(([label, prompt]) => `
        <button class="wentian-chat-starter" type="button" data-wentian-prompt="${escapeHtml(prompt)}">${escapeHtml(label)}</button>
      `).join("")}
    </div>
    ${figBox("source-4-input-bg", 0, 742, 390, 102, "", "background:#fff;")}
    <input id="wentian-chat-input" class="wentian-chat-field" placeholder="问一问" autocomplete="off">
    <button id="wentian-chat-send" class="wentian-chat-send" type="button" data-action="wentian-chat-send" aria-label="发送">↑</button>
    ${figText("source-4-disclaimer", "内容由AI生成，仅供娱乐参考", 0, 812, 390, 10, "#b8b0a7", 400, "center")}
  `;
}

function sourceArchiveSelectScreen() {
  const archives = getWentianArchiveList();
  const activeId = wentianArchiveDraftId || getWentianSelectedArchiveId(archives);
  const activeArchive = archives.find((item) => item.id === activeId) || archives[0];
  const active = getWentianArchiveDisplay(activeArchive);
  const activeSizhu = activeArchive?.chartData?.sizhu || {};
  const displayArchives = archives.slice(0, 8);
  return `
    ${figBox("source-5-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figText("source-5-back", "‹", 28, 35, 28, 34, "#26211c", 500)}
    ${figImage("source-5-avatar", "../images/wentian-prototype-assets/xu-banxian.jpg", 58, 31, 34, 34, "border-radius:17px;object-fit:cover;object-position:center 18%;")}
    ${figText("source-5-name", "许半仙", 100, 39, 130, 16, "#26211c", 800)}
    ${figText("source-5-record", "◷ 对话记录", 282, 40, 88, 12, "#6f665d", 500, "right")}
    ${figLine("source-5-line-a", 0, 84, 390, "#eee8df")}
    ${figText("source-5-left", "◇ 剩余 1 条", 18, 101, 150, 12, "#9d8a62")}
    ${figBox("source-5-profile-pill", 286, 92, 72, 34, "", "border-radius:17px;background:#fff;box-shadow:0 4px 12px rgba(70,45,25,.08);")}
    ${figText("source-5-profile-text", `${escapeHtml(active.name)}⌄`, 296, 102, 52, 13, "#26211c", 500, "center")}
    ${figLine("source-5-line-b", 0, 137, 390, "#eee8df")}
    ${figText("source-5-hello", `你好！我是许半仙`, 24, 205, 320, 27, "#c4a45a", 800)}
    ${figText("source-5-sub", "需要我为您做些什么？", 24, 246, 260, 15, "#aaa196")}
    ${figBox("source-5-bazi", 22, 302, 346, 156, "converted-card", "border-radius:13px;box-shadow:0 6px 18px rgba(74,55,32,.12);")}
    ${figText("source-5-bazi-name", `${escapeHtml(active.name)}的八字`, 42, 324, 120, 13, "#8f857a")}
    ${["年柱", "月柱", "日柱", "时柱"].map((label, index) => figText(`source-5-bazi-label-${index}`, label, 70 + index * 76, 352, 46, 11, "#aaa196", 400, "center")).join("")}
    ${[activeSizhu.yearStem, activeSizhu.monthStem, activeSizhu.dayStem, activeSizhu.hourStem].map((label, index) => figText(`source-5-bazi-top-${index}`, label || "—", 70 + index * 76, 374, 46, 17, index === 1 ? "#7aa65b" : "#c69a3e", 800, "center")).join("")}
    ${[activeSizhu.yearBranch, activeSizhu.monthBranch, activeSizhu.dayBranch, activeSizhu.hourBranch].map((label, index) => figText(`source-5-bazi-bottom-${index}`, label || "—", 70 + index * 76, 402, 46, 17, index === 1 ? "#7aa65b" : "#c69a3e", 800, "center")).join("")}
    ${figLine("source-5-bazi-line", 40, 424, 310, "#e8ded0")}
    ${figText("source-5-bazi-foot", `日主：${activeSizhu.dayStem || "—"}    生肖：${activeArchive?.chartData?.zodiac || "—"}`, 0, 438, 390, 12, "#8f857a", 500, "center")}

    ${figBox("source-5-overlay", 0, 0, 390, 844, "", "background:rgba(0,0,0,.38);")}
    ${figBox("source-5-sheet", 0, 458, 390, 386, "", "border-radius:22px 22px 0 0;background:#fff;box-shadow:0 -12px 30px rgba(0,0,0,.14);")}
    ${figBox("source-5-sheet-handle", 160, 472, 70, 5, "", "border-radius:3px;background:#eee9e2;")}
    ${figText("source-5-sheet-title", "选择档案", 36, 498, 150, 25, "#1f1d1a", 800)}
    ${figBox("source-5-sheet-count", 304, 498, 58, 30, "", "border-radius:8px;background:#f7f2ec;")}
    ${figText("source-5-sheet-count-text", "已选 1/1", 304, 507, 58, 11, "#8b8176", 700, "center")}
    ${figText("source-5-sheet-sub", "最多选择1张", 36, 536, 150, 15, "#8b8176", 400)}
    <div class="wentian-archive-list">
    ${displayArchives.map((archive) => {
      const item = getWentianArchiveDisplay(archive);
      const selected = archive.id === activeId;
      return `
        <button class="wentian-archive-option ${selected ? "is-selected" : ""}" type="button" data-action="wentian-archive-pick" data-wentian-archive-option="1" data-archive-id="${escapeHtml(archive.id)}" aria-pressed="${selected ? "true" : "false"}">
          <span class="wentian-archive-avatar">${escapeHtml(item.name.slice(0, 1))}</span>
          <span class="wentian-archive-name">${escapeHtml(item.name)}</span>
          ${item.badge ? `<span class="wentian-archive-badge">${escapeHtml(item.badge)}</span>` : ""}
          <span class="wentian-archive-gender">${item.gender}</span>
          <span class="wentian-archive-tag">${escapeHtml(item.tag)}</span>
          <span class="wentian-archive-date">${escapeHtml(item.datetime)}</span>
          <span class="wentian-archive-pillars">${escapeHtml(item.pillars)}</span>
          <span class="wentian-archive-check">${selected ? "✓" : ""}</span>
        </button>
      `;
    }).join("")}
    </div>
    ${figLine("source-5-sheet-line", 24, 750, 342, "#eee8df")}
    <button class="wentian-archive-new" type="button" data-route="screen-26">＋ 新建档案</button>
    <button class="wentian-archive-confirm" type="button" data-action="wentian-archive-confirm">确定</button>
  `;
}

function wentianStar(name, brightness = "", mutagen = null) {
  return { name, brightness, mutagen };
}

function wentianPalace(name, branch, majorStars, minorStars = [], range = "") {
  return {
    name,
    branch,
    majorStars: majorStars.map((item) => Array.isArray(item) ? wentianStar(item[0], item[1] || "", item[2] || null) : wentianStar(item)),
    minorStars: minorStars.map((name) => ({ name })),
    decadal: range ? { range } : null,
  };
}

const WENTIAN_XU_PALACES = [
  wentianPalace("命宫", "申", ["贪狼"], ["天马", "右弼"], "6-15"),
  wentianPalace("兄弟宫", "未", ["太阳", "太阴"], ["地劫"], "116-125"),
  wentianPalace("夫妻宫", "午", ["武曲", "天府"], ["擎羊", "左辅"], "106-115"),
  wentianPalace("子女宫", "巳", ["天同"], ["禄存"], "96-105"),
  wentianPalace("财帛宫", "辰", ["破军"], ["陀罗"], "86-95"),
  wentianPalace("疾厄宫", "卯", [], ["地空"], "76-85"),
  wentianPalace("迁移宫", "寅", ["廉贞"], ["文昌"], "66-75"),
  wentianPalace("仆役宫", "丑", [], [], "56-65"),
  wentianPalace("官禄宫", "子", ["七杀"], ["文曲"], "46-55"),
  wentianPalace("田宅宫", "亥", ["天梁"], ["铃星", "天魁"], "36-45"),
  wentianPalace("福德宫", "戌", ["紫微", "天相"], [], "26-35"),
  wentianPalace("父母宫", "酉", ["天机", "巨门"], ["火星", "天钺"], "16-25"),
];

function wentianFindPalace(name) {
  return WENTIAN_XU_PALACES.find((item) => item.name === name) || null;
}

const WENTIAN_XU_CHART_BASE = {
  gender: "male",
  birthDate: "1991-02-16 22:58",
  solarTime: "1991-02-16 22:58",
  birthYear: 1991,
  birthMonth: 2,
  birthDay: 16,
  birthHour: 22,
  realCurrentAge: 36,
  isLunar: false,
  city: "",
  fiveElementsClass: "火六局",
  zodiac: "羊",
  yearStem: "辛",
  lifeMain: "廉贞",
  bodyMain: "火星",
  lifePalace: wentianFindPalace("命宫"),
  bodyPalaceDetail: wentianFindPalace("官禄宫"),
  careerPalace: wentianFindPalace("官禄宫"),
  wealthPalace: wentianFindPalace("财帛宫"),
  movePalace: wentianFindPalace("迁移宫"),
  spousePalace: wentianFindPalace("夫妻宫"),
  happinessPalace: wentianFindPalace("福德宫"),
  illnessPalace: wentianFindPalace("疾厄宫"),
  yearMutagens: [
    { star: "巨门", mutagen: "禄" },
    { star: "太阳", mutagen: "权" },
    { star: "文曲", mutagen: "科" },
    { star: "文昌", mutagen: "忌" },
  ],
  palacesSummary: WENTIAN_XU_PALACES,
  activeAge: 36,
  currentYear: 2026,
  currentDecade: {
    palace: "田宅宫",
    branch: "亥",
    range: "36-45",
    stem: "己",
    majorStars: ["天梁"],
  },
  currentLiunian: {
    name: "流年小限",
    branch: "午",
    period: "2026",
    xiaoLian: "戌",
  },
  currentXiaolian: { branch: "戌" },
  dayunTable: WENTIAN_XU_PALACES
    .map((palace) => {
      const range = String(palace.decadal?.range || "").match(/\d+/g);
      if (!range || range.length < 2) return null;
      return {
        ageStart: Number(range[0]),
        ageEnd: Number(range[1]),
        range: `${range[0]}-${range[1]}`,
        palaceName: palace.name,
        palaceBranch: palace.branch,
        palaceStem: "",
        majorStars: palace.majorStars,
      };
    })
    .filter(Boolean),
  liunianTable: [
    { age: 36, solarYear: 2026, xiaoLianBranch: "戌", yearGanzhi: "丙午", liunianGuaName: "流年小限", liunianGuaPeriod: "2026" },
  ],
  sizhu: {
    year: "辛未",
    month: "庚寅",
    day: "丁巳",
    hour: "辛亥",
    yearStem: "辛",
    yearBranch: "未",
    monthStem: "庚",
    monthBranch: "寅",
    dayStem: "丁",
    dayBranch: "巳",
    hourStem: "辛",
    hourBranch: "亥",
  },
  peakAges: [],
  valleyAges: [],
};

const wentianXuChat = {
  sessionId: null,
  sessionPromise: null,
  messages: [],
  loading: false,
};

let wentianFallbackChartRecordId = null;
const WENTIAN_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WENTIAN_CHART_STORAGE_KEY = "wentian-app-current-chart-v1";
const WENTIAN_ARCHIVES_STORAGE_KEY = "wentian-app-archives-v1";
const WENTIAN_SELECTED_ARCHIVE_KEY = "wentian-app-selected-archive-id";
const WENTIAN_LANGUAGE_STORAGE_KEY = "wentian-app-language-v1";
const WENTIAN_PROFILE_STORAGE_KEY = "wentian-app-profile-v1";
const WENTIAN_LANGUAGE_OPTIONS = [
  { code: "zh-Hans", label: "简体中文", htmlLang: "zh-CN" },
  { code: "zh-Hant", label: "繁體中文", htmlLang: "zh-TW" },
  { code: "en", label: "English", htmlLang: "en" },
];
let wentianArchiveDraftId = null;
let wentianLanguageDraft = null;
const WENTIAN_BRANCH_POSITIONS = {
  "巳": [0, 0],
  "午": [1, 0],
  "未": [2, 0],
  "申": [3, 0],
  "辰": [0, 1],
  "酉": [3, 1],
  "卯": [0, 2],
  "戌": [3, 2],
  "寅": [0, 3],
  "丑": [1, 3],
  "子": [2, 3],
  "亥": [3, 3],
};
const WENTIAN_SHICHEN = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

function getWentianApiBase() {
  const qs = new URLSearchParams(location.search);
  const queryBase = qs.get("aiBackendBase") || qs.get("pimingApiBase") || qs.get("apiBase") || "";
  const configBase = window.SITE_CONFIG?.aiBackendBase || "";
  return (queryBase || configBase || "https://ai-piming-backend.vercel.app").replace(/\/+$/, "");
}

function makeWentianUuid() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    window.crypto.getRandomValues(bytes);
  } else {
    let seed = Date.now();
    for (let i = 0; i < bytes.length; i += 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      bytes[i] = (seed + Math.floor(Math.random() * 256)) & 0xff;
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function isWentianUuid(id) {
  return typeof id === "string" && WENTIAN_UUID_RE.test(id);
}

function getWentianChartRecordId() {
  const key = "wentian-xubanxian-chart-record-id";
  try {
    let id = localStorage.getItem(key);
    if (!isWentianUuid(id)) {
      id = makeWentianUuid();
      localStorage.setItem(key, id);
    }
    return id;
  } catch (_err) {
    if (!wentianFallbackChartRecordId) wentianFallbackChartRecordId = makeWentianUuid();
    return wentianFallbackChartRecordId;
  }
}

function resetWentianChartRecordId() {
  const id = makeWentianUuid();
  try {
    localStorage.setItem("wentian-xubanxian-chart-record-id", id);
  } catch (_err) {
    wentianFallbackChartRecordId = id;
  }
  return id;
}

function getWentianSavedChart() {
  try {
    const raw = localStorage.getItem(WENTIAN_CHART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_err) {
    return null;
  }
}

function readWentianArchives() {
  try {
    const raw = localStorage.getItem(WENTIAN_ARCHIVES_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (_err) {
    return [];
  }
}

function writeWentianArchives(archives) {
  try {
    localStorage.setItem(WENTIAN_ARCHIVES_STORAGE_KEY, JSON.stringify(archives));
  } catch (_err) {}
}

function makeWentianArchiveId(prefix = "archive") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function setWentianSelectedArchiveId(id) {
  try {
    localStorage.setItem(WENTIAN_SELECTED_ARCHIVE_KEY, id);
  } catch (_err) {}
}

function getWentianSelectedArchiveId(archives) {
  let selectedId = "";
  try {
    selectedId = localStorage.getItem(WENTIAN_SELECTED_ARCHIVE_KEY) || "";
  } catch (_err) {}
  if (archives.some((item) => item.id === selectedId)) return selectedId;
  return archives[0]?.id || "";
}

function archiveFromChartState(chartState) {
  if (!chartState?.chartData) return null;
  const chartRecordId = chartState.chartData.chartRecordId || getWentianChartRecordId();
  const form = chartState.form || {};
  const id = chartState.archiveId || form.archiveId || `archive-${chartRecordId}`;
  return {
    id,
    chartRecordId,
    chart: chartState.chart || null,
    chartData: { ...chartState.chartData, chartRecordId },
    form: { ...form, archiveId: id },
    createdAt: chartState.createdAt || new Date().toISOString(),
  };
}

function buildWentianArchiveFromInput({ id, name, gender, datetime, isDefault = false }) {
  const chartRecordId = makeWentianUuid();
  const date = new Date(datetime);
  const dateStr = datetime.slice(0, 10);
  const timeIndex = getWentianTimeIndex(date.getHours(), date.getMinutes());
  let chart = null;
  let chartData = null;
  const lib = getWentianIztroLib();

  try {
    if (lib) {
      chart = typeof lib.bySolar === "function"
        ? lib.bySolar(dateStr, timeIndex, gender === "female" ? "女" : "男", true)
        : lib.astrolabeBySolarDate(dateStr, timeIndex, gender === "female" ? "女" : "男", true);
      chartData = buildWentianChartPayload(chart, { gender, date, dateStr, timeIndex, city: "" });
    }
  } catch (_err) {
    chart = null;
  }

  if (!chartData) {
    chartData = {
      ...WENTIAN_XU_CHART_BASE,
      gender,
      birthDate: formatWentianDateTime(date),
      solarTime: formatWentianDateTime(date),
    };
  }
  chartData.chartRecordId = chartRecordId;

  return {
    id,
    chartRecordId,
    chart,
    chartData,
    form: { archiveId: id, name, gender, type: "ziwei", datetime, useTrueSolar: false, isDefault },
    createdAt: new Date().toISOString(),
  };
}

function getDefaultWentianArchives() {
  return [
    {
      id: "default-xie",
      chartRecordId: makeWentianUuid(),
      chart: null,
      chartData: { ...WENTIAN_XU_CHART_BASE, chartRecordId: makeWentianUuid() },
      form: {
        archiveId: "default-xie",
        name: "谢",
        gender: "male",
        type: "ziwei",
        datetime: "1991-02-16T22:58",
        useTrueSolar: false,
        isDefault: true,
      },
      createdAt: new Date().toISOString(),
    },
    buildWentianArchiveFromInput({
      id: "default-mingzhu",
      name: "命主",
      gender: "female",
      datetime: "2026-05-12T15:08",
      isDefault: true,
    }),
  ].map((archive) => {
    if (archive.id === "default-xie") {
      archive.chartData.chartRecordId = archive.chartRecordId;
    }
    return archive;
  });
}

function normalizeWentianArchive(archive) {
  if (!archive?.chartData) return null;
  const id = archive.id || archive.form?.archiveId || makeWentianArchiveId();
  const chartRecordId = archive.chartRecordId || archive.chartData.chartRecordId || makeWentianUuid();
  return {
    ...archive,
    id,
    chartRecordId,
    chartData: { ...archive.chartData, chartRecordId },
    form: { ...(archive.form || {}), archiveId: id },
  };
}

function getWentianArchiveList() {
  let archives = readWentianArchives().map(normalizeWentianArchive).filter(Boolean);
  const currentArchive = archiveFromChartState(getWentianSavedChart());
  if (!archives.length) archives = getDefaultWentianArchives();
  if (currentArchive && !archives.some((item) => item.id === currentArchive.id)) {
    archives.unshift(currentArchive);
  }
  writeWentianArchives(archives);
  return archives;
}

function saveWentianArchiveFromChartState(chartState) {
  const archive = archiveFromChartState(chartState);
  if (!archive) return;
  const archives = getWentianArchiveList();
  const index = archives.findIndex((item) => item.id === archive.id || item.chartRecordId === archive.chartRecordId);
  if (index >= 0) archives[index] = archive;
  else archives.unshift(archive);
  writeWentianArchives(archives);
  setWentianSelectedArchiveId(archive.id);
}

function saveWentianChart(chartState, options = {}) {
  try {
    localStorage.setItem(WENTIAN_CHART_STORAGE_KEY, JSON.stringify(chartState));
  } catch (_err) {}
  if (options.upsertArchive !== false) saveWentianArchiveFromChartState(chartState);
}

function formatWentianDateTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getWentianTimeIndex(hour, minute) {
  if (typeof tstToShichen === "function") return tstToShichen(hour, minute);
  return Math.floor(((hour * 60 + minute + 60) % 1440) / 120);
}

function getWentianIztroLib() {
  return window.iztro?.astro || window.iztro || null;
}

function normalizeWentianStar(star) {
  if (!star) return null;
  if (typeof star === "string") return { name: star };
  return {
    name: star.name || "",
    brightness: star.brightness || "",
    mutagen: star.mutagen || null,
  };
}

function normalizeWentianPalace(palace) {
  if (!palace) return null;
  const range = Array.isArray(palace.decadal?.range)
    ? `${palace.decadal.range[0]}-${palace.decadal.range[1]}`
    : palace.decadal?.range || "";
  return {
    name: palace.name || "",
    branch: palace.earthlyBranch || palace.branch || "",
    stem: palace.heavenlyStem || "",
    majorStars: (palace.majorStars || []).map(normalizeWentianStar).filter(Boolean),
    minorStars: (palace.minorStars || []).map(normalizeWentianStar).filter(Boolean),
    decadal: range ? { range } : null,
    changsheng12: palace.changsheng12 || "",
    boshi12: palace.boshi12 || "",
    isBodyPalace: !!palace.isBodyPalace,
  };
}

function extractWentianPillars(chart) {
  const raw = chart?.rawDates?.chineseDate || {};
  const fromText = String(chart?.chineseDate || "").split(/\s+/).filter(Boolean);
  const pick = (key, index) => {
    const pair = raw[key] || [];
    const text = fromText[index] || "";
    return {
      stem: pair[0] || text.slice(0, 1) || "",
      branch: pair[1] || text.slice(1, 2) || "",
    };
  };
  const year = pick("yearly", 0);
  const month = pick("monthly", 1);
  const day = pick("daily", 2);
  const hour = pick("hourly", 3);
  return {
    year: `${year.stem}${year.branch}`,
    month: `${month.stem}${month.branch}`,
    day: `${day.stem}${day.branch}`,
    hour: `${hour.stem}${hour.branch}`,
    yearStem: year.stem,
    yearBranch: year.branch,
    monthStem: month.stem,
    monthBranch: month.branch,
    dayStem: day.stem,
    dayBranch: day.branch,
    hourStem: hour.stem,
    hourBranch: hour.branch,
  };
}

function buildWentianChartPayload(chart, norm) {
  const palacesSummary = (chart?.palaces || []).map(normalizeWentianPalace).filter(Boolean);
  const findPalace = (name) => palacesSummary.find((p) => p.name === name || p.name === `${name}宫`) || null;
  const sizhu = extractWentianPillars(chart);
  const birthDate = norm?.date ? formatWentianDateTime(norm.date) : `${chart?.solarDate || ""} 00:00`;
  return {
    ...WENTIAN_XU_CHART_BASE,
    chartRecordId: getWentianChartRecordId(),
    gender: norm?.gender || "male",
    birthDate,
    solarTime: birthDate,
    birthYear: norm?.date?.getFullYear?.() || Number(String(chart?.solarDate || "").slice(0, 4)) || WENTIAN_XU_CHART_BASE.birthYear,
    birthMonth: norm?.date ? norm.date.getMonth() + 1 : WENTIAN_XU_CHART_BASE.birthMonth,
    birthDay: norm?.date?.getDate?.() || WENTIAN_XU_CHART_BASE.birthDay,
    birthHour: norm?.date?.getHours?.() || WENTIAN_XU_CHART_BASE.birthHour,
    timeIndex: norm?.timeIndex,
    city: norm?.city || "",
    fiveElementsClass: chart?.fiveElementsClass || WENTIAN_XU_CHART_BASE.fiveElementsClass,
    zodiac: chart?.zodiac || WENTIAN_XU_CHART_BASE.zodiac,
    yearStem: sizhu.yearStem || WENTIAN_XU_CHART_BASE.yearStem,
    lifeMain: findPalace("命")?.majorStars?.[0]?.name || WENTIAN_XU_CHART_BASE.lifeMain,
    bodyMain: findPalace("身")?.majorStars?.[0]?.name || WENTIAN_XU_CHART_BASE.bodyMain,
    lifePalace: findPalace("命"),
    bodyPalaceDetail: palacesSummary.find((p) => p.isBodyPalace) || null,
    careerPalace: findPalace("官禄"),
    wealthPalace: findPalace("财帛"),
    movePalace: findPalace("迁移"),
    spousePalace: findPalace("夫妻"),
    happinessPalace: findPalace("福德"),
    illnessPalace: findPalace("疾厄"),
    palacesSummary,
    dayunTable: palacesSummary.map((palace) => {
      const range = String(palace.decadal?.range || "").match(/\d+/g);
      if (!range || range.length < 2) return null;
      return {
        ageStart: Number(range[0]),
        ageEnd: Number(range[1]),
        range: `${range[0]}-${range[1]}`,
        palaceName: palace.name,
        palaceBranch: palace.branch,
        palaceStem: palace.stem,
        majorStars: palace.majorStars,
      };
    }).filter(Boolean),
    sizhu,
  };
}

function getWentianChartPayload() {
  const chartRecordId = getWentianChartRecordId();
  const saved = getWentianSavedChart();
  if (saved?.chartData) return { ...saved.chartData, chartRecordId };
  return { ...WENTIAN_XU_CHART_BASE, chartRecordId };
}

function getWentianArchiveDisplay(archive) {
  const form = archive?.form || {};
  const chartData = archive?.chartData || {};
  const sizhu = chartData.sizhu || {};
  const name = form.name || "命主";
  const gender = form.gender === "female" ? "女" : "男";
  const datetime = (form.datetime || chartData.birthDate || chartData.solarTime || "").replace("T", " ").replace(/:00$/, "");
  const pillars = [sizhu.year, sizhu.month, sizhu.day, sizhu.hour].filter(Boolean).join(" ");
  return {
    name,
    gender,
    datetime,
    pillars: pillars || "辛未 庚寅 丁巳 辛亥",
    tag: "四柱八字",
    badge: form.isDefault ? "默认" : "",
  };
}

function getWentianLanguageCode() {
  let code = "";
  try {
    code = localStorage.getItem(WENTIAN_LANGUAGE_STORAGE_KEY) || "";
  } catch (_err) {}
  return WENTIAN_LANGUAGE_OPTIONS.some((item) => item.code === code) ? code : "zh-Hans";
}

function getWentianLanguageOption(code = getWentianLanguageCode()) {
  return WENTIAN_LANGUAGE_OPTIONS.find((item) => item.code === code) || WENTIAN_LANGUAGE_OPTIONS[0];
}

function setWentianLanguageCode(code) {
  const option = getWentianLanguageOption(code);
  try {
    localStorage.setItem(WENTIAN_LANGUAGE_STORAGE_KEY, option.code);
  } catch (_err) {}
  document.documentElement.lang = option.htmlLang;
}

function pickWentianLanguage(code) {
  wentianLanguageDraft = getWentianLanguageOption(code).code;
  for (const row of document.querySelectorAll("[data-wentian-language-option]")) {
    const selected = row.dataset.languageCode === wentianLanguageDraft;
    row.classList.toggle("is-selected", selected);
    row.setAttribute("aria-pressed", selected ? "true" : "false");
    const check = row.querySelector(".wentian-language-check");
    if (check) check.textContent = selected ? "✓" : "";
  }
}

function confirmWentianLanguage() {
  setWentianLanguageCode(wentianLanguageDraft || getWentianLanguageCode());
  wentianLanguageDraft = null;
  navigate(state.stack.pop() || "screen-31", false);
}

function getWentianProfile() {
  const defaults = {
    nickname: "谢广周",
    email: "aa15989267747@gmail.com",
    phone: "",
  };
  try {
    const raw = localStorage.getItem(WENTIAN_PROFILE_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    return { ...defaults, ...(saved || {}) };
  } catch (_err) {
    return defaults;
  }
}

function saveWentianProfile(profile) {
  try {
    localStorage.setItem(WENTIAN_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (_err) {}
}

function setWentianProfileStatus(text, tone = "") {
  const el = document.getElementById("wentian-profile-status");
  if (!el) return;
  el.textContent = text;
  el.dataset.tone = tone;
}

function submitWentianProfileForm() {
  const nickname = (document.getElementById("wentian-profile-nickname")?.value || "").trim();
  const email = (document.getElementById("wentian-profile-email")?.value || "").trim();
  const phone = (document.getElementById("wentian-profile-phone")?.value || "").trim();
  if (!nickname) {
    setWentianProfileStatus("请填写昵称", "error");
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setWentianProfileStatus("邮箱格式不正确", "error");
    return;
  }
  saveWentianProfile({ nickname, email, phone });
  setWentianProfileStatus("已保存", "ok");
  window.setTimeout(() => navigate(state.stack.pop() || "screen-31", false), 260);
}

function getCurrentWentianArchive() {
  const archives = getWentianArchiveList();
  const current = getWentianSavedChart();
  const currentId = current?.archiveId || current?.form?.archiveId || "";
  const selectedId = currentId || getWentianSelectedArchiveId(archives);
  return archives.find((item) => item.id === selectedId) || archives[0] || null;
}

function applyWentianArchiveToCurrent(archive) {
  if (!archive) return false;
  const chartRecordId = archive.chartRecordId || archive.chartData?.chartRecordId || makeWentianUuid();
  try {
    localStorage.setItem("wentian-xubanxian-chart-record-id", chartRecordId);
  } catch (_err) {
    wentianFallbackChartRecordId = chartRecordId;
  }
  setWentianSelectedArchiveId(archive.id);
  saveWentianChart({
    archiveId: archive.id,
    chart: archive.chart || null,
    chartData: { ...archive.chartData, chartRecordId },
    form: { ...(archive.form || {}), archiveId: archive.id },
    createdAt: archive.createdAt || new Date().toISOString(),
  }, { upsertArchive: false });
  wentianXuChat.sessionId = null;
  wentianXuChat.sessionPromise = null;
  wentianXuChat.messages = [];
  return true;
}

function pickWentianArchive(id) {
  wentianArchiveDraftId = id;
  for (const row of document.querySelectorAll("[data-wentian-archive-option]")) {
    const selected = row.dataset.archiveId === id;
    row.classList.toggle("is-selected", selected);
    row.setAttribute("aria-pressed", selected ? "true" : "false");
    const check = row.querySelector(".wentian-archive-check");
    if (check) check.textContent = selected ? "✓" : "";
  }
}

function confirmWentianArchiveSelection() {
  const archives = getWentianArchiveList();
  const id = wentianArchiveDraftId || getWentianSelectedArchiveId(archives);
  const archive = archives.find((item) => item.id === id) || archives[0];
  if (!applyWentianArchiveToCurrent(archive)) return;
  wentianArchiveDraftId = null;
  navigate("screen-4");
}

function getWentianTransientKey() {
  return `wentian-xubanxian-transient:${getWentianChartRecordId()}`;
}

function loadWentianTransientState() {
  try {
    const raw = sessionStorage.getItem(getWentianTransientKey());
    return raw ? JSON.parse(raw) : null;
  } catch (_err) {
    return null;
  }
}

function saveWentianTransientState(state) {
  try {
    if (state) sessionStorage.setItem(getWentianTransientKey(), JSON.stringify(state));
    else sessionStorage.removeItem(getWentianTransientKey());
  } catch (_err) {}
}

function waitWentian(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isWentianRetryableError(error) {
  const text = `${error?.name || ""} ${error?.message || ""}`.toLowerCase();
  return /abort|timeout|failed to fetch|network|load failed/.test(text);
}

function getWentianFriendlyError(error) {
  if (isWentianRetryableError(error)) return "网络有点慢，许半仙刚才没接上，请再点一次发送。";
  return error?.message || "许半仙暂时不可用";
}

async function wentianPostJsonOnce(path, payload, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException("request timeout", "TimeoutError")), timeoutMs);
  try {
    const response = await fetch(`${getWentianApiBase()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const contentType = String(response.headers.get("content-type") || "");
    const data = contentType.includes("application/json")
      ? await response.json()
      : { error: await response.text() };
    if (!response.ok || data.error) throw new Error(data.error || `许半仙服务异常 ${response.status}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function wentianPostJson(path, payload, timeoutMs = 90000, retries = 1) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await wentianPostJsonOnce(path, payload, timeoutMs);
    } catch (error) {
      lastError = error;
      if (attempt >= retries || !isWentianRetryableError(error)) break;
      await waitWentian(900 + attempt * 700);
    }
  }
  if (lastError) lastError.userMessage = getWentianFriendlyError(lastError);
  throw lastError;
}

function setWentianChatStatus(text, tone = "") {
  const el = document.getElementById("wentian-chat-status");
  if (!el) return;
  el.textContent = text;
  el.dataset.tone = tone;
}

function setWentianQuota(quota) {
  const el = document.querySelector('[data-node-id="source-4-left"]');
  if (!el || !quota) return;
  const remaining = quota.remaining === null || quota.remaining === undefined || quota.remaining === "" ? "--" : quota.remaining;
  const limit = quota.limit === null || quota.limit === undefined || quota.limit === "" ? "--" : quota.limit;
  el.textContent = `◇ 今日 ${remaining}/${limit}`;
}

function renderWentianMessages() {
  const box = document.getElementById("wentian-chat-messages");
  if (!box) return;
  box.innerHTML = wentianXuChat.messages.map((message) => {
    const role = message.role === "user" ? "user" : message.role === "system" ? "system" : "assistant";
    return `<div class="wentian-chat-msg is-${role}">${escapeHtml(message.text)}</div>`;
  }).join("");
  box.scrollTop = box.scrollHeight;
}

function addWentianMessage(role, text) {
  wentianXuChat.messages.push({ role, text });
  if (wentianXuChat.messages.length > 30) wentianXuChat.messages.shift();
  renderWentianMessages();
}

function setWentianChatBusy(busy) {
  wentianXuChat.loading = busy;
  const input = document.getElementById("wentian-chat-input");
  const send = document.getElementById("wentian-chat-send");
  if (input) input.disabled = busy;
  if (send) send.disabled = busy;
}

async function ensureWentianXuSession(options = {}) {
  const silent = !!options.silent;
  if (wentianXuChat.sessionId) return wentianXuChat.sessionId;
  if (wentianXuChat.sessionPromise) return wentianXuChat.sessionPromise;

  if (!silent) setWentianChatStatus("正在接入许半仙…");
  const chartData = getWentianChartPayload();
  wentianXuChat.sessionPromise = wentianPostJson("/api/ai/chat/session", {
    chartRecordId: chartData.chartRecordId,
    chartData,
    transientState: loadWentianTransientState(),
  }, 90000, 1).then((data) => {
    wentianXuChat.sessionId = data.sessionId || `transient:${chartData.chartRecordId}`;
    if (data.transientState) saveWentianTransientState(data.transientState);
    setWentianChatStatus(data.transientMode ? "临时会话已接入" : "许半仙已连接", data.transientMode ? "warn" : "ok");
    if (!wentianXuChat.messages.length) {
      if (Array.isArray(data.messages) && data.messages.length) {
        wentianXuChat.messages = data.messages.slice(-12).map((item) => ({
          role: item.sender === "user" ? "user" : item.sender === "system" ? "system" : "assistant",
          text: item.content || "",
        }));
      } else {
        addWentianMessage("assistant", "命盘我已经读到了。你可以直接问感情、事业、财运，或者问最近一年怎么走。");
      }
      renderWentianMessages();
    }
    return wentianXuChat.sessionId;
  }).catch((error) => {
    if (silent) {
      setWentianChatStatus("已接入命盘", "ok");
    } else {
      setWentianChatStatus("许半仙暂时未连上", "error");
      if (!wentianXuChat.messages.length) addWentianMessage("system", `连接失败：${getWentianFriendlyError(error)}`);
    }
    throw error;
  }).finally(() => {
    wentianXuChat.sessionPromise = null;
  });
  return wentianXuChat.sessionPromise;
}

async function sendWentianXuChat(promptText = "") {
  if (wentianXuChat.loading) return;
  const input = document.getElementById("wentian-chat-input");
  const message = (promptText || input?.value || "").trim();
  if (!message) return;
  if (input) input.value = "";

  addWentianMessage("user", message);
  addWentianMessage("assistant", "许半仙正在看盘…");
  setWentianChatBusy(true);

  try {
    const chartData = getWentianChartPayload();
    const data = await wentianPostJson("/api/ai/chat/send", {
      chartRecordId: chartData.chartRecordId,
      message,
      chartData,
      transientState: loadWentianTransientState(),
    }, 120000, 1);
    wentianXuChat.messages.pop();
    wentianXuChat.sessionId = data.sessionId || wentianXuChat.sessionId || `transient:${chartData.chartRecordId}`;
    if (data.transientState) saveWentianTransientState(data.transientState);
    setWentianQuota(data.quota);
    setWentianChatStatus(data.transientMode ? "临时会话已接入" : "许半仙已连接", data.transientMode ? "warn" : "ok");
    addWentianMessage("assistant", data.reply || "我看到了，但这轮没有返回内容，请再问一次。");
  } catch (error) {
    wentianXuChat.messages.pop();
    setWentianChatStatus("发送未完成", "error");
    addWentianMessage("system", getWentianFriendlyError(error));
  } finally {
    setWentianChatBusy(false);
    input?.focus();
  }
}

function initWentianXuChat() {
  const input = document.getElementById("wentian-chat-input");
  const send = document.getElementById("wentian-chat-send");
  if (!input || !send) return;

  const saved = getWentianSavedChart();
  const sizhu = saved?.chartData?.sizhu;
  if (sizhu) {
    const stems = [sizhu.yearStem, sizhu.monthStem, sizhu.dayStem, sizhu.hourStem];
    const branches = [sizhu.yearBranch, sizhu.monthBranch, sizhu.dayBranch, sizhu.hourBranch];
    stems.forEach((text, index) => {
      const el = document.querySelector(`[data-node-id="source-4-bazi-top-${index}"]`);
      if (el) el.textContent = text || "—";
    });
    branches.forEach((text, index) => {
      const el = document.querySelector(`[data-node-id="source-4-bazi-bottom-${index}"]`);
      if (el) el.textContent = text || "—";
    });
    const nameEl = document.querySelector('[data-node-id="source-4-bazi-name"]');
    if (nameEl) nameEl.textContent = `${saved.form?.name || "当前"}的八字`;
    const profileEl = document.querySelector('[data-node-id="source-4-profile-text"]');
    if (profileEl) profileEl.textContent = `${saved.form?.name || "当前"}⌄`;
    const footEl = document.querySelector('[data-node-id="source-4-bazi-foot"]');
    if (footEl) footEl.textContent = `日主：${sizhu.dayStem || "—"}    生肖：${saved.chartData?.zodiac || "—"}`;
  }

  send.onclick = () => sendWentianXuChat();
  input.onkeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendWentianXuChat();
    }
  };

  if (!wentianXuChat.messages.length) {
    addWentianMessage("assistant", "我是许半仙，已经切到你网站的命盘对话体系。你问一句，我按当前命盘答。");
  } else {
    renderWentianMessages();
  }
  setWentianChatStatus("已接入命盘", "ok");
  ensureWentianXuSession({ silent: true }).catch(() => {});
}

function setWentianChartStatus(text, tone = "") {
  const el = document.getElementById("wentian-chart-status");
  if (!el) return;
  el.textContent = text;
  el.dataset.tone = tone;
}

function getWentianChartFormData() {
  const rawDate = document.getElementById("wentian-chart-date")?.value || "";
  const date = rawDate ? new Date(rawDate) : null;
  if (!date || Number.isNaN(date.getTime())) throw new Error("请先选择出生日期和时间");

  const useTrueSolar = !!document.getElementById("wentian-chart-true-solar")?.checked;
  const city = (document.getElementById("wentian-chart-city")?.value || "").trim();
  let calcHour = date.getHours();
  let calcMinute = date.getMinutes();
  let trueSolarResult = null;

  if (useTrueSolar && typeof calcTrueSolarTime === "function") {
    trueSolarResult = calcTrueSolarTime({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: calcHour,
      minute: calcMinute,
      longitude: city ? undefined : 116.4,
      tzOffset: 8,
      cityName: city || "北京",
    });
    calcHour = trueSolarResult.trueSolarHour;
    calcMinute = trueSolarResult.trueSolarMinute;
  }

  return {
    name: (document.getElementById("wentian-chart-name")?.value || "").trim(),
    gender: document.getElementById("wentian-chart-gender")?.value || "male",
    type: document.getElementById("wentian-chart-type")?.value || "ziwei",
    city,
    date,
    dateStr: rawDate.slice(0, 10),
    timeIndex: getWentianTimeIndex(calcHour, calcMinute),
    trueSolarResult,
    useTrueSolar,
  };
}

async function submitWentianChartForm() {
  try {
    setWentianChartStatus("正在调用网站排盘算法...");
    const norm = getWentianChartFormData();
    const lib = getWentianIztroLib();
    if (!lib) throw new Error("排盘模块未加载，请刷新后重试");

    const genderText = norm.gender === "male" ? "男" : "女";
    const chart = typeof lib.bySolar === "function"
      ? lib.bySolar(norm.dateStr, norm.timeIndex, genderText, true)
      : lib.astrolabeBySolarDate(norm.dateStr, norm.timeIndex, genderText, true);
    resetWentianChartRecordId();
    const chartData = buildWentianChartPayload(chart, norm);

    saveWentianChart({
      archiveId: `archive-${chartData.chartRecordId}`,
      chart,
      chartData,
      form: {
        archiveId: `archive-${chartData.chartRecordId}`,
        name: norm.name,
        gender: norm.gender,
        type: norm.type,
        city: norm.city,
        datetime: document.getElementById("wentian-chart-date")?.value || "",
        useTrueSolar: norm.useTrueSolar,
      },
      createdAt: new Date().toISOString(),
    });

    wentianXuChat.sessionId = null;
    wentianXuChat.sessionPromise = null;
    wentianXuChat.messages = [];
    setWentianChartStatus("已生成命盘");
    navigate("screen-27");
  } catch (error) {
    setWentianChartStatus(error.message || "排盘失败，请检查出生信息", "error");
  }
}

function initWentianChartForm() {
  const saved = getWentianSavedChart();
  const form = saved?.form || {};
  const name = document.getElementById("wentian-chart-name");
  const gender = document.getElementById("wentian-chart-gender");
  const type = document.getElementById("wentian-chart-type");
  const date = document.getElementById("wentian-chart-date");
  const city = document.getElementById("wentian-chart-city");
  const trueSolar = document.getElementById("wentian-chart-true-solar");
  if (name) name.value = form.name || "谢";
  if (gender) gender.value = form.gender || "male";
  if (type) type.value = form.type || "ziwei";
  if (date) date.value = form.datetime || "2026-05-12T15:21";
  if (city) city.value = form.city || "";
  if (trueSolar) trueSolar.checked = !!form.useTrueSolar;
  setWentianChartStatus(saved?.chart ? "已接入网站排盘算法，可重新排盘" : "已接入网站排盘算法");
}

function sourceProfileScreen(screen) {
  const profiles = [
    ["谢", "男", "四柱八字", "1991年2月16日 22:58", "辛未 庚寅 丁巳 辛亥", 129, "默认"],
    ["命主", "男", "四柱八字", "2026年5月12日 15:08", "丙午 癸巳 丙戌 丙申", 247, ""]
  ];
  return `
    ${figText("source-25-time", "15:21", 18, 15, 70, 14, "#26211c")}
    ${figText("source-25-status", "◉  0.30  5G  ▮ 33 ⚡", 250, 14, 120, 10, "#26211c", 700, "right")}
    ${figText("source-25-title", "档案", 18, 58, 150, 30, "#26211c", 800)}
    ${figText("source-25-sub", "管理你的命盘资料", 18, 101, 180, 14, "#8f857a")}
    ${figBox("source-25-add", 296, 56, 76, 38, "", "border-radius:18px;background:#fff;box-shadow:0 5px 14px rgba(80,55,28,.10);")}
    ${figText("source-25-add-text", "+ 添加", 304, 68, 58, 13, "#a47725", 700, "center")}
    ${profiles.map(([name, gender, tag, date, detail, y, badge], index) => `
      ${figBox(`source-25-card-${index}`, 18, y, 354, 95, "converted-card", "border-radius:12px;box-shadow:0 6px 16px rgba(74,55,32,.08);")}
      ${figImage(`source-25-avatar-${index}`, "../images/wentian-prototype-assets/03-profile.jpg", 37, y + 18, 54, 54, "border-radius:27px;")}
      ${figText(`source-25-name-${index}`, name, 102, y + 20, 58, 16, "#26211c", 800)}
      ${figBox(`source-25-gender-${index}`, 154, y + 17, 28, 18, "", "border-radius:9px;background:#f6ecd7;")}
      ${figText(`source-25-gender-text-${index}`, gender, 154, y + 21, 28, 10, "#b07a2d", 700, "center")}
      ${figBox(`source-25-tag-${index}`, 188, y + 17, 62, 18, "", "border-radius:9px;background:#f6ecd7;")}
      ${figText(`source-25-tag-text-${index}`, tag, 188, y + 21, 62, 10, "#b07a2d", 500, "center")}
      ${badge ? figBox(`source-25-badge-${index}`, 326, y + 17, 36, 20, "", "border-radius:10px;background:#fbf4df;") : ""}
      ${badge ? figText(`source-25-badge-text-${index}`, badge, 326, y + 21, 36, 10, "#b88c33", 700, "center") : ""}
      ${figText(`source-25-date-${index}`, date, 102, y + 45, 190, 13, "#8f857a")}
      ${figText(`source-25-detail-${index}`, detail, 102, y + 67, 210, 13, "#8f857a")}
      ${figText(`source-25-arrow-${index}`, "›", 338, y + 36, 20, 24, "#aaa196", 500, "center")}
    `).join("")}
    ${sourceAppBottomNav("档案", 778)}
  `;
}

function sourceMineScreen(screen) {
  const languageLabel = getWentianLanguageOption().label;
  const profile = getWentianProfile();
  return `
    ${figText("source-31-time", "15:23", 18, 15, 70, 14, "#26211c")}
    ${figText("source-31-status", "◉  30.4  5G  ▮ 33 ⚡", 250, 14, 120, 10, "#26211c", 700, "right")}
    ${figText("source-31-title", "我的", 18, 58, 150, 30, "#26211c", 800)}
    ${figText("source-31-sub", "账户与偏好设置", 18, 101, 180, 14, "#8f857a")}
    ${figBox("source-31-gear", 338, 56, 38, 38, "", "border-radius:19px;background:#fff;box-shadow:0 5px 14px rgba(80,55,28,.10);")}
    ${figText("source-31-gear-text", "⚙", 338, 64, 38, 18, "#b88c33", 700, "center")}
    ${figBox("source-31-profile", 16, 126, 358, 96, "converted-card", "border-radius:12px;box-shadow:0 6px 16px rgba(74,55,32,.08);")}
    ${figBox("source-31-avatar", 34, 144, 60, 60, "", "border-radius:30px;background:#b88c33;")}
    ${figText("source-31-avatar-icon", "人", 34, 157, 60, 28, "#fff", 700, "center")}
    ${figText("source-31-name", escapeHtml(profile.nickname), 116, 150, 140, 18, "#26211c", 800)}
    ${figText("source-31-vip", "开通会员享专属权益", 116, 177, 150, 13, "#8f857a")}
    ${figText("source-31-email", escapeHtml(profile.email || "未绑定邮箱"), 116, 197, 200, 12, "#8f857a")}
    ${[["◇ 灵石", "1", 16], ["▣ 卡券", "0 个", 139], ["☵ 对话", "0 /0", 262]].map(([label, count, x], index) => `
      ${figBox(`source-31-stat-${index}`, x, 240, 111, 75, "converted-card", "border-radius:12px;box-shadow:0 5px 14px rgba(74,55,32,.08);")}
      ${figText(`source-31-stat-label-${index}`, label, x + 14, 253, 80, 12, "#9b742e", 500)}
      ${figText(`source-31-stat-count-${index}`, count, x + 14, 279, 80, 21, "#b88c33", 800)}
    `).join("")}
    ${[["♛", "问天会员", 16, 330], ["◇", "灵石充值", 200, 330], ["▤", "我的报告", 16, 400], ["▦", "订单记录", 200, 400]].map(([icon, label, x, y], index) => `
      ${figBox(`source-31-quick-${index}`, x, y, 174, 60, "converted-card", "border-radius:12px;box-shadow:0 5px 14px rgba(74,55,32,.08);")}
      ${figBox(`source-31-quick-icon-${index}`, x + 17, y + 12, 36, 36, "", "border-radius:10px;background:#f6f2e9;")}
      ${figText(`source-31-quick-icon-text-${index}`, icon, x + 17, y + 21, 36, 14, "#b88c33", 800, "center")}
      ${figText(`source-31-quick-label-${index}`, label, x + 62, y + 21, 90, 16, "#26211c", 700)}
    `).join("")}
    ${[["邀请好友", "0 人", 491], ["兑换礼包", "", 552], ["语言设置", languageLabel, 629], ["分享问天AI", "", 690], ["联系我们", "", 767]].map(([label, value, y], index) => `
      ${figBox(`source-31-row-${index}`, 16, y, 358, 61, "converted-card", `border-radius:${index === 0 || index === 2 || index === 4 ? "12px" : "0"};border-bottom:${index === 0 || index === 2 ? "0" : "1px solid #eee8df"};box-shadow:${index === 0 || index === 2 || index === 4 ? "0 5px 14px rgba(74,55,32,.08)" : "none"};`)}
      ${figText(`source-31-row-icon-${index}`, ["♧", "♁", "文", "⌯", "☏"][index], 34, y + 21, 24, 16, "#b88c33", 700, "center")}
      ${figText(`source-31-row-label-${index}`, label, 68, y + 20, 140, 16, "#26211c", 600)}
      ${value ? figText(`source-31-row-value-${index}`, value, 274, y + 21, 60, 13, "#9b742e", 500, "right") : ""}
      ${figText(`source-31-row-arrow-${index}`, "›", 342, y + 18, 16, 20, "#aaa196", 500, "center")}
    `).join("")}
    ${sourceAppBottomNav("我的", 755)}
  `;
}

function sourceBasicInfoScreen() {
  const profile = getWentianProfile();
  return `
    ${figBox("source-39-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figButton("source-39-back-hit", 18, 40, 54, 54, 'data-action="back"')}
    ${figText("source-39-back", "‹", 28, 49, 28, 30, "#26211c", 600)}
    ${figText("source-39-title", "基本信息", 0, 56, 390, 22, "#1f1d1a", 800, "center")}
    ${figBox("source-39-card", 22, 130, 346, 290, "", "border:1px solid #e2d8c8;border-radius:16px;background:#fff;box-shadow:0 6px 16px rgba(74,55,32,.06);")}

    ${figText("source-39-name-label", "昵称", 42, 162, 90, 17, "#5f5a52", 500)}
    <input id="wentian-profile-nickname" class="wentian-profile-input" style="left:132px;top:145px;width:214px" value="${escapeHtml(profile.nickname)}" placeholder="请输入昵称" autocomplete="name">
    ${figLine("source-39-line-1", 42, 210, 304, "#e6ded2")}

    ${figText("source-39-email-label", "邮箱", 42, 242, 90, 17, "#5f5a52", 500)}
    <input id="wentian-profile-email" class="wentian-profile-input" type="email" style="left:132px;top:225px;width:214px" value="${escapeHtml(profile.email)}" placeholder="请输入邮箱" autocomplete="email">
    ${figLine("source-39-line-2", 42, 290, 304, "#e6ded2")}

    ${figText("source-39-phone-label", "手机号", 42, 322, 90, 17, "#5f5a52", 500)}
    <input id="wentian-profile-phone" class="wentian-profile-input" inputmode="tel" style="left:132px;top:305px;width:214px" value="${escapeHtml(profile.phone)}" placeholder="绑定手机号" autocomplete="tel">

    ${figText("source-39-tip", "信息仅保存在当前浏览器，用于档案管理与问天服务。", 42, 454, 300, 13, "#9b9287")}
    <div id="wentian-profile-status" class="wentian-profile-status"></div>
    ${figBox("source-39-save", 36, 690, 318, 58, "", "border-radius:29px;background:#c09a49;box-shadow:0 8px 18px rgba(130,91,31,.12);")}
    ${figButton("source-39-save-hit", 36, 690, 318, 58, 'data-action="wentian-profile-save"')}
    ${figText("source-39-save-text", "保存", 36, 709, 318, 18, "#fff", 700, "center")}
  `;
}

function sourceAccountSettingsScreen() {
  const rows = [
    ["♙", "基本信息", "screen-39"],
    ["▧", "登录方式", "screen-40"],
    ["⌑", "设置密码", "screen-41"],
    ["↪", "退出登录", "screen-31"]
  ];
  return `
    ${figBox("source-settings-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figButton("source-settings-back-hit", 18, 40, 54, 54, 'data-action="back"')}
    ${figText("source-settings-back", "‹", 28, 49, 28, 30, "#26211c", 600)}
    ${figText("source-settings-title", "账户设置", 0, 56, 390, 22, "#1f1d1a", 800, "center")}
    ${figBox("source-settings-card", 22, 104, 346, 196, "", "border:1px solid #e2d8c8;border-radius:14px;background:#fff;box-shadow:0 6px 16px rgba(74,55,32,.06);")}
    ${rows.map(([icon, label, route], index) => {
      const y = 104 + index * 49;
      const red = index === rows.length - 1;
      return `
        ${index ? figLine(`source-settings-line-${index}`, 44, y, 302, "#eee8df") : ""}
        ${figText(`source-settings-icon-${index}`, icon, 40, y + 18, 24, 14, red ? "#b33a2f" : "#b88c33", 700, "center")}
        ${figText(`source-settings-label-${index}`, label, 76, y + 16, 180, 16, red ? "#b33a2f" : "#26211c", 700)}
        ${figText(`source-settings-arrow-${index}`, "›", 326, y + 14, 20, 18, "#aaa196", 700, "center")}
        ${figButton(`source-settings-hit-${index}`, 22, y, 346, 49, `data-route="${route}"`)}
      `;
    }).join("")}
  `;
}

function sourceLoginMethodsScreen() {
  const rows = [
    ["Apple", "89c6ef44-…-500dd420", "♛"],
    ["邮箱", "aa159892677…@gmail.com", "✉"],
    ["手机号", "绑定", "▯"],
    ["Google", "aa159892677…@gmail.com", "G"]
  ];
  return `
    ${figBox("source-login-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figButton("source-login-back-hit", 18, 40, 54, 54, 'data-action="back"')}
    ${figText("source-login-back", "‹", 28, 49, 28, 30, "#26211c", 600)}
    ${figText("source-login-title", "登录方式", 0, 56, 390, 22, "#1f1d1a", 800, "center")}
    ${figBox("source-login-card", 22, 108, 346, 216, "", "border:1px solid #e2d8c8;border-radius:14px;background:#fff;box-shadow:0 6px 16px rgba(74,55,32,.06);")}
    ${rows.map(([label, value, icon], index) => {
      const y = 108 + index * 54;
      return `
        ${index ? figLine(`source-login-line-${index}`, 44, y, 302, "#eee8df") : ""}
        ${figText(`source-login-icon-${index}`, icon, 42, y + 19, 24, 13, "#b88c33", 800, "center")}
        ${figText(`source-login-label-${index}`, label, 76, y + 17, 76, 15, "#26211c", 700)}
        ${figText(`source-login-value-${index}`, value, 154, y + 18, 164, 12, "#9b9287", 500, "right")}
        ${figText(`source-login-arrow-${index}`, "›", 328, y + 16, 18, 17, "#aaa196", 700, "center")}
      `;
    }).join("")}
  `;
}

function sourcePasswordSettingsScreen() {
  return `
    ${figBox("source-password-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figButton("source-password-back-hit", 18, 40, 54, 54, 'data-action="back"')}
    ${figText("source-password-back", "‹", 28, 49, 28, 30, "#26211c", 600)}
    ${figText("source-password-title", "设置密码", 0, 56, 390, 22, "#1f1d1a", 800, "center")}
    ${figBox("source-password-card", 22, 108, 346, 136, "", "border:1px solid #e2d8c8;border-radius:14px;background:#fff;box-shadow:0 6px 16px rgba(74,55,32,.06);")}
    ${figText("source-password-new-label", "新密码", 42, 132, 80, 16, "#5f5a52", 500)}
    <input class="wentian-profile-input" type="password" style="left:132px;top:118px;width:214px" placeholder="请输入" autocomplete="new-password">
    ${figLine("source-password-line-1", 42, 176, 304, "#e6ded2")}
    ${figText("source-password-confirm-label", "确认密码", 42, 198, 80, 16, "#5f5a52", 500)}
    <input class="wentian-profile-input" type="password" style="left:132px;top:184px;width:214px" placeholder="请输入" autocomplete="new-password">
    ${figBox("source-password-save", 68, 284, 254, 44, "", "border-radius:8px;background:#c09a49;box-shadow:0 8px 18px rgba(130,91,31,.12);")}
    ${figButton("source-password-save-hit", 68, 284, 254, 44, 'data-route="screen-40"')}
    ${figText("source-password-save-text", "保存", 68, 296, 254, 14, "#fff", 700, "center")}
  `;
}

function sourceLanguageSettingsScreen() {
  const activeCode = wentianLanguageDraft || getWentianLanguageCode();
  return `
    ${figBox("source-37-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figButton("source-37-back-hit", 18, 40, 54, 54, 'data-action="back"')}
    ${figText("source-37-back", "‹", 28, 49, 28, 30, "#26211c", 600)}
    ${figText("source-37-title", "语言设置", 0, 56, 390, 22, "#1f1d1a", 800, "center")}
    ${figText("source-37-copy", "选择界面显示语言", 34, 128, 220, 15, "#8f857a")}
    ${figBox("source-37-preview", 22, 166, 346, 74, "converted-card", "border-radius:14px;box-shadow:0 6px 16px rgba(74,55,32,.08);")}
    ${figText("source-37-preview-title", getWentianLanguageOption(activeCode).label, 42, 188, 180, 18, "#26211c", 800)}
    ${figText("source-37-preview-desc", "确认后会同步保存到当前浏览器", 42, 215, 260, 13, "#8f857a")}
    ${sourceAppBottomNav("我的", 755)}
    ${figBox("source-37-overlay", 0, 0, 390, 844, "", "background:rgba(0,0,0,.36);")}
    ${figBox("source-37-sheet", 20, 500, 350, 260, "", "border-radius:20px;background:#fff;box-shadow:0 -8px 24px rgba(0,0,0,.14);")}
    ${figText("source-37-sheet-title", "语言设置", 42, 526, 200, 18, "#26211c", 800)}
    ${WENTIAN_LANGUAGE_OPTIONS.map((option, index) => {
      const selected = option.code === activeCode;
      return `
        <button class="wentian-language-option ${selected ? "is-selected" : ""}" type="button" data-action="wentian-language-pick" data-wentian-language-option="1" data-language-code="${option.code}" aria-pressed="${selected ? "true" : "false"}" style="left:42px;top:${570 + index * 42}px">
          <span class="wentian-language-label">${option.label}</span>
          <span class="wentian-language-check">${selected ? "✓" : ""}</span>
        </button>
      `;
    }).join("")}
    <button class="wentian-language-confirm" type="button" data-action="wentian-language-confirm">确定</button>
  `;
}

function convertedAi(screen) {
  const base = `
    ${figBox(`screen-${screen.no}-bg`, 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figImage(`screen-${screen.no}-avatar`, "../images/wentian-prototype-assets/xu-banxian.jpg", 42, 108, 44, 44, "border-radius:22px;object-fit:cover;object-position:center 18%;")}
    ${figText(`screen-${screen.no}-hello`, "你好！我是许半仙", 92, 112, 240, 21, "#b88c33", 700)}
    ${figBox(`screen-${screen.no}-bazi`, 32, 170, 326, 88, "converted-card", "")}
    ${figText(`screen-${screen.no}-bazi-title`, "当前八字", 48, 184, 294, 15, "#26211c", 700)}
    ${figText(`screen-${screen.no}-bazi-desc`, "年 辛未｜月 癸巳｜日 丁亥｜时 辛亥", 48, 212, 294, 12, "#8c8275")}
    ${figBox(`screen-${screen.no}-ask-box`, 24, 704, 342, 44, "converted-card", "border-radius:22px;")}
    ${figText(`screen-${screen.no}-ask-text`, "问一问", 48, 718, 170, 14, "#8c8275")}
    ${figButton(`screen-${screen.no}-ask-hit`, 24, 704, 342, 44, 'data-route="screen-6"')}
    ${figText(`screen-${screen.no}-plus`, "+", 318, 710, 28, 24, "#b88c33", 700, "center")}
  `;
  if (screen.ai === "asking") {
    return base + figBox("asking-bubble", 46, 286, 298, 92, "", "border-radius:14px;background:#b88c33;") +
      figText("asking-text", "请根据我的八字，深度拆解核心性格特质。", 64, 306, 260, 14, "#fff") +
      figText("asking-wait", "推算中...", 46, 420, 200, 14, "#8c8275");
  }
  if (screen.ai === "reply") {
    return base + figBox("reply-user", 46, 260, 298, 74, "", "border-radius:14px;background:#b88c33;") +
      figText("reply-user-text", "请根据我的八字拆解性格。", 64, 282, 260, 14, "#fff") +
      figBox("reply-ai-card", 42, 360, 306, 112, "", "border-radius:14px;background:#fff;box-shadow:0 6px 16px rgba(74,55,32,.07);") +
      figText("reply-ai", "你的八字显示辛未、癸巳、丁亥、辛亥。核心是敏感、洞察力强，适合把直觉转化为决策。", 60, 384, 270, 14, "#26211c", 500, "left", "line-height:1.55;");
  }
  return base;
}

function wentianSimpleHeader(id, title, right = "") {
  return `
    ${figButton(`${id}-back-hit`, 10, 38, 54, 54, 'data-action="back"')}
    ${figText(`${id}-back`, "‹", 22, 42, 30, 30, "#25211d", 400)}
    ${figText(`${id}-title`, title, 62, 51, 266, 17, "#25211d", 800, "center")}
    ${right ? figText(`${id}-right`, right, 334, 48, 36, 20, "#8d857b", 700, "center") : ""}
  `;
}

function wentianGoldButton(id, label, route, y = 742) {
  return `
    ${figBox(`${id}-button`, 42, y, 306, 50, "", "border-radius:25px;background:#111;box-shadow:0 8px 18px rgba(20,15,10,.16);")}
    ${figButton(`${id}-button-hit`, 42, y, 306, 50, `data-route="${route}"`)}
    ${figText(`${id}-button-text`, label, 42, y + 15, 306, 14, "#fff", 800, "center")}
  `;
}

function wentianArchiveMini(id, y, name = "谢", selected = false) {
  return `
    ${figBox(`${id}-row`, 34, y, 322, 72, "", `border:1px solid ${selected ? "#d0a33c" : "#efe3d0"};border-radius:14px;background:#fff;box-shadow:0 6px 16px rgba(72,48,26,.07);`)}
    ${figBox(`${id}-avatar`, 50, y + 14, 44, 44, "", "border-radius:22px;background:#f5ead4;")}
    ${figText(`${id}-avatar-text`, name.slice(0, 1), 50, y + 27, 44, 13, "#bd8624", 800, "center")}
    ${figText(`${id}-name`, name, 110, y + 16, 78, 15, "#25211d", 800)}
    ${figText(`${id}-meta`, selected ? "默认　男　阳历" : "命主　女　阴历", 164, y + 17, 120, 11, "#b28b45", 700)}
    ${figText(`${id}-date`, selected ? "1991-02-16 22:58" : "2026-05-12 15:08", 110, y + 42, 160, 12, "#8d857b")}
    ${figText(`${id}-check`, selected ? "✓" : "○", 320, y + 25, 22, 18, selected ? "#bd8624" : "#d8cdbc", 800, "center")}
  `;
}

function wentianCoin(id, x, y, active = true) {
  return `
    ${figBox(`${id}-coin`, x, y, 46, 46, "", `border-radius:23px;background:${active ? "linear-gradient(145deg,#d8aa3b,#a47420)" : "linear-gradient(145deg,#c7b8a0,#867968)"};box-shadow:0 8px 16px rgba(93,63,24,.18);`)}
    ${figBox(`${id}-coin-in`, x + 12, y + 12, 22, 22, "", "border-radius:11px;border:2px solid rgba(255,255,255,.45);")}
  `;
}

function wentianHexLines(id, y, variant = 0) {
  const lines = variant === 1
    ? [["一爻", false], ["二爻", true], ["三爻", true], ["四爻", false], ["五爻", false], ["六爻", true]]
    : [["一爻", false], ["二爻", false], ["三爻", true], ["四爻", true], ["五爻", false], ["六爻", false]];
  return lines.map(([label, broken], index) => {
    const top = y + index * 24;
    return `
      ${figText(`${id}-line-label-${index}`, label, 52, top - 4, 40, 12, "#8f867b")}
      ${broken
        ? `${figBox(`${id}-line-a-${index}`, 110, top, 70, 4, "", "border-radius:4px;background:#2b2722;")}${figBox(`${id}-line-b-${index}`, 210, top, 70, 4, "", "border-radius:4px;background:#2b2722;")}`
        : figBox(`${id}-line-${index}`, 110, top, 170, 4, "", "border-radius:4px;background:#2b2722;")}
      ${figText(`${id}-line-side-${index}`, broken ? "阴" : "阳", 306, top - 5, 24, 12, "#8f867b")}
    `;
  }).join("");
}

const YANGZHAI_STORAGE_KEY = "wentian-yangzhai-state-v1";
const YANGZHAI_PALACES = [
  { key: "xun", gua: "巽", dir: "东南", role: "长女位", defaultItem: "长女" },
  { key: "li", gua: "离", dir: "正南", role: "二女位", defaultItem: "二女" },
  { key: "kun", gua: "坤", dir: "西南", role: "母亲位", defaultItem: "母亲" },
  { key: "zhen", gua: "震", dir: "正东", role: "长子位", defaultItem: "长子" },
  { key: "center", gua: "center", dir: "", role: "", defaultItem: "" },
  { key: "dui", gua: "兑", dir: "正西", role: "三女位", defaultItem: "三女" },
  { key: "gen", gua: "艮", dir: "东北", role: "三子位", defaultItem: "三子" },
  { key: "kan", gua: "坎", dir: "正北", role: "二子位", defaultItem: "二子" },
  { key: "qian", gua: "乾", dir: "西北", role: "父亲位", defaultItem: "父亲" }
];

const YANGZHAI_OPTIONS = [
  { label: "父亲", short: "父", type: "family" },
  { label: "母亲", short: "母", type: "family" },
  { label: "长子", short: "长", type: "family" },
  { label: "长女", short: "长", type: "family" },
  { label: "二子", short: "二", type: "family" },
  { label: "二女", short: "二", type: "family" },
  { label: "三子", short: "三", type: "family" },
  { label: "三女", short: "三", type: "family" },
  { label: "厨房", short: "厨", type: "space" },
  { label: "厕所", short: "厕", type: "space" },
  { label: "客厅", short: "厅", type: "space" },
  { label: "清空", short: "×", type: "clear" }
];

const YANGZHAI_DEFAULT_PLACEMENTS = {
  xun: ["长女"],
  li: ["二女"],
  kun: ["母亲"],
  zhen: ["长子"],
  dui: ["三女"],
  gen: ["三子"],
  kan: ["二子"],
  qian: ["父亲"]
};
const YANGZHAI_GRID_X = 5;
const YANGZHAI_GRID_Y = 112;
const YANGZHAI_CELL_W = 126.667;
const YANGZHAI_CELL_H = 184;
const YANGZHAI_GRID_W = YANGZHAI_CELL_W * 3;
const YANGZHAI_GRID_H = YANGZHAI_CELL_H * 3;
const YANGZHAI_CELL_HEADER_H = 42;
const YANGZHAI_ACTION_Y = 686;
const YANGZHAI_RESULT_TITLE_Y = 764;
const YANGZHAI_RESULT_START_Y = 804;
const YANGZHAI_RESULT_COLLAPSED_HEIGHT = 142;
const YANGZHAI_RESULT_EXPANDED_HEIGHT = 252;
const YANGZHAI_AVATAR_IMAGES = {
  父亲: "../images/wentian-prototype-assets/yangzhai-avatar-fuqin.png",
  母亲: "../images/wentian-prototype-assets/yangzhai-avatar-muqin.png",
  长子: "../images/wentian-prototype-assets/yangzhai-avatar-changzi.png",
  长女: "../images/wentian-prototype-assets/yangzhai-avatar-changnv.png",
  二子: "../images/wentian-prototype-assets/yangzhai-avatar-erzi.png",
  二女: "../images/wentian-prototype-assets/yangzhai-avatar-ernv.png",
  三子: "../images/wentian-prototype-assets/yangzhai-avatar-sanzi.png",
  三女: "../images/wentian-prototype-assets/yangzhai-avatar-sannv.png"
};
const YANGZHAI_ROLE_GUA = {
  父亲: "乾",
  母亲: "坤",
  长子: "震",
  长女: "巽",
  二子: "坎",
  二女: "离",
  三子: "艮",
  三女: "兑"
};
const YANGZHAI_SPACE_RULES = {
  厨房: {
    meaning: "刀象",
    preference: "正北或正西较佳",
    preferredPalaces: ["kan", "dui"],
    source: "S007",
    audit: "B-笔记摘要",
    status: "功能象义可发布；方位偏好后台待原书核"
  },
  厕所: {
    meaning: "是非、口舌、官司",
    preference: "谨慎口径，只做象义提示",
    preferredPalaces: [],
    source: "S007",
    audit: "B-笔记摘要",
    status: "谨慎发布，不扩写灾祸断语"
  },
  客厅: {
    meaning: "如客",
    preference: "坤位较佳",
    preferredPalaces: ["kun"],
    source: "S007",
    audit: "B-笔记摘要",
    status: "可发布但标注为笔记摘要"
  }
};
const YANGZHAI_HEX_INDEX = {
  "乾-乾": { no: "1", name: "乾为天", index: "父亲居西北角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坤-坤": { no: "2", name: "坤为地", index: "母亲居西南角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坎-震": { no: "3", name: "水雷屯", index: "二子/次子居正东", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "艮-坎": { no: "4", name: "山水蒙", index: "三子/少男居正北", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坎-乾": { no: "5", name: "水天需", index: "二子/次子居西北角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "乾-坎": { no: "6", name: "天水讼", index: "父亲居正北", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坤-坎": { no: "7", name: "地水师", index: "母亲居正北", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坎-坤": { no: "8", name: "水地比", index: "二子/次子居西南角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "巽-乾": { no: "9", name: "风天小畜", index: "长女居西北角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "乾-兑": { no: "10", name: "天泽履", index: "父亲居正西", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坤-乾": { no: "11", name: "地天泰", index: "母亲居西北角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "乾-坤": { no: "12", name: "天地否", index: "父亲居西南角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "乾-离": { no: "13", name: "天火同人", index: "父亲居正南", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "离-乾": { no: "14", name: "火天大有", index: "二女/次女居西北角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坤-艮": { no: "15", name: "地山谦", index: "母亲居东北角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "震-坤": { no: "16", name: "雷地豫", index: "长子居西南角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "兑-震": { no: "17", name: "泽雷随", index: "少女/三女居正东", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "艮-巽": { no: "18", name: "山风蛊", index: "三子/少男居东南角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坤-兑": { no: "19", name: "地泽临", index: "母亲居正西", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "巽-坤": { no: "20", name: "风地观", index: "长女居西南角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "离-震": { no: "21", name: "火雷噬嗑", index: "二女/次女居正东", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "艮-离": { no: "22", name: "山火贲", index: "三子/少男居正南", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "艮-坤": { no: "23", name: "山地剥", index: "三子/少男居西南角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坤-震": { no: "24", name: "地雷复", index: "母亲居正东", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "乾-震": { no: "25", name: "天雷无妄", index: "父亲居正东", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "艮-乾": { no: "26", name: "山天大畜", index: "三子/少男居西北角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "艮-震": { no: "27", name: "山雷颐", index: "三子/少男居正东", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "兑-巽": { no: "28", name: "泽风大过", index: "少女/三女居东南角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坎-坎": { no: "29", name: "坎为水", index: "二子/次子居正北", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "离-离": { no: "30", name: "离为火", index: "二女/次女居正南", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "兑-艮": { no: "31", name: "泽山咸", index: "少女/三女居东北角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "震-巽": { no: "32", name: "雷风恒", index: "长子居东南角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "乾-艮": { no: "33", name: "天山遁", index: "父亲居东北角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "震-乾": { no: "34", name: "雷天大壮", index: "长子居西北角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "离-坤": { no: "35", name: "火地晋", index: "二女/次女居西南角", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "坤-离": { no: "36", name: "地火明夷", index: "母亲居正南", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "巽-离": { no: "37", name: "风火家人", index: "长女居正南", audit: "B-笔记摘要可索引", source: "S004,S007" },
  "离-兑": { no: "38", name: "火泽睽", index: "二女/次女居正西", audit: "目录确认/正文待核", source: "S004,S007" },
  "坎-艮": { no: "39", name: "水山蹇", index: "二子/次子居东北角", audit: "目录确认/正文待核", source: "S004,S007" },
  "震-坎": { no: "40", name: "雷水解", index: "长子居正北", audit: "目录确认/正文待核", source: "S004,S007" },
  "艮-兑": { no: "41", name: "山泽损", index: "三子/少男居正西", audit: "目录确认/正文待核", source: "S004,S007" },
  "巽-震": { no: "42", name: "风雷益", index: "长女居正东", audit: "目录确认/正文待核", source: "S004,S007" },
  "兑-乾": { no: "43", name: "泽天夬", index: "少女/三女居西北角", audit: "目录确认/正文待核", source: "S004,S007" },
  "乾-巽": { no: "44", name: "天风姤", index: "父亲居东南角", audit: "目录确认/正文待核", source: "S004,S007" },
  "兑-坤": { no: "45", name: "泽地萃", index: "少女/三女居西南角", audit: "目录确认/正文待核", source: "S004,S007" },
  "坤-巽": { no: "46", name: "地风升", index: "母亲居东南角", audit: "目录确认/正文待核", source: "S004,S007" },
  "兑-坎": { no: "47", name: "泽水困", index: "少女/三女居正北", audit: "目录确认/正文待核", source: "S004,S007" },
  "坎-巽": { no: "48", name: "水风井", index: "二子/次子居东南角", audit: "目录确认/正文待核", source: "S004,S007" },
  "兑-离": { no: "49", name: "泽火革", index: "少女/三女居正南", audit: "目录确认/正文待核", source: "S004,S007" },
  "离-巽": { no: "50", name: "火风鼎", index: "二女/次女居东南角", audit: "目录确认/正文待核", source: "S004,S007" },
  "震-震": { no: "51", name: "震为雷", index: "长子居正东", audit: "目录确认/正文待核", source: "S004,S007" },
  "艮-艮": { no: "52", name: "艮为山", index: "三子/少男居东北角", audit: "目录确认/正文待核", source: "S004,S007" },
  "巽-艮": { no: "53", name: "风山渐", index: "长女居东北角", audit: "目录确认/正文待核", source: "S004,S007" },
  "震-兑": { no: "54", name: "雷泽归妹", index: "长子居正西", audit: "目录确认/正文待核", source: "S004,S007" },
  "震-离": { no: "55", name: "雷火丰", index: "长子居正南", audit: "目录确认/正文待核", source: "S004,S007" },
  "离-艮": { no: "56", name: "火山旅", index: "二女/次女居东北角", audit: "目录确认/正文待核", source: "S004,S007" },
  "巽-巽": { no: "57", name: "巽为风", index: "长女居东南角", audit: "目录确认/正文待核", source: "S004,S007" },
  "兑-兑": { no: "58", name: "兑为泽", index: "少女/三女居正西", audit: "目录确认/正文待核", source: "S004,S007" },
  "巽-坎": { no: "59", name: "风水涣", index: "长女居正北", audit: "目录确认/正文待核", source: "S004,S007" },
  "坎-兑": { no: "60", name: "水泽节", index: "二子/次子居正西", audit: "目录确认/正文待核", source: "S004,S007" },
  "巽-兑": { no: "61", name: "风泽中孚", index: "长女居正西", audit: "目录确认/正文待核", source: "S004,S007" },
  "震-艮": { no: "62", name: "雷山小过", index: "长子居东北角", audit: "目录确认/正文待核", source: "S004,S007" },
  "坎-离": { no: "63", name: "水火既济", index: "二子/次子居正南", audit: "目录确认/正文待核", source: "S004,S007" },
  "离-坎": { no: "64", name: "火水未济", index: "二女/次女居正北", audit: "《地脉道》PDF已核", source: "倪海厦《地脉道》" }
};

const YANGZHAI_SOURCE_TITLE = "倪海厦《地脉道》";
const YANGZHAI_HEX_READINGS = {
  1: { quote: "父居乾位", summary: "父亲归西北，重父位、主事与家中骨架。", advice: "若为本位，宜稳住父亲或主事人的独立空间。" },
  2: { quote: "地厚能载物", summary: "母亲归西南，重承载、家务与实际掌权。", advice: "已婚母亲或女主人可用，单身者不宜硬套吉凶。" },
  3: { quote: "次子越位", summary: "二子落震，主次子早动、能力越长兄。", advice: "适合看兄弟排序与家业接班，不宜只断婚恋。" },
  4: { quote: "蒙蔽之法", summary: "三子落坎，蒙象偏重赌性、迷惘与进退失据。", advice: "先调卧室位置，再看本人是否愿意受劝。" },
  5: { quote: "智慧成长快速", summary: "二子落乾，聪明刚烈，事业权位容易早显。", advice: "可取其事业上进，婚恋与宗教倾向需谨慎看。" },
  6: { quote: "官司不断", summary: "父亲落坎，为讼象，主口舌、诉讼与升迁阻滞。", advice: "优先移开父亲卧房，减少水险与是非位刺激。" },
  7: { quote: "性刚争端", summary: "母亲落坎，师象偏刚，家内争执与纠纷易起。", advice: "母亲卧房不宜居坎，先求家中安静与边界。" },
  8: { quote: "亲比之意", summary: "二子落坤，依母、助母，事业多居辅佐位。", advice: "可用于判断母子牵连，勿把辅佐位硬断为败。" },
  9: { quote: "女代父职", summary: "长女落乾，事业心强，常代父职、独立撑局。", advice: "长女若重事业可用；若问婚姻，需合八字同看。" },
  10: { quote: "进退两难", summary: "父亲落兑，为履象，主事业、官运进退难定。", advice: "先化父亲房位，再看财官是否卡在选择上。" },
  11: { quote: "安泰舒适", summary: "母亲落乾，为泰象，利夫妻和睦、家局安定。", advice: "已婚女主人可用此局稳家宅与事业。" },
  12: { quote: "否塞不通", summary: "父亲落坤，为否象，主闭塞、耗财与夫妻失和。", advice: "父亲房不宜压母位，宜回乾位或换静位。" },
  13: { quote: "主人和", summary: "父亲落离，同人象重人和、合伙与声名。", advice: "可取团队合作，但要兼看对妻位的影响。" },
  14: { quote: "女承父业", summary: "二女落乾，大有象主女承父业、事业成名。", advice: "若二女事业强，可视作可用局；婚恋另行判断。" },
  15: { quote: "劳谦之美", summary: "母亲落艮，谦象重贤德、劳心与公平处事。", advice: "适合稳家务与财务，但要防过劳。" },
  16: { quote: "因禄远行", summary: "长子落坤，豫象主母助、财官与离乡发展。", advice: "可用于长子事业出外线索，需兼顾亲缘距离。" },
  17: { quote: "全心事业", summary: "三女落震，随象偏事业驱动，婚恋需配命局。", advice: "先看事业与贵人，不把性格标签作绝对断语。" },
  18: { quote: "图利野心", summary: "三子落巽，蛊象主野心、谋利与考试发挥。", advice: "宜引导到读书、技能与正当竞争。" },
  19: { quote: "力大居小", summary: "母亲落兑，临象主母权过重、子女反弹。", advice: "母亲宜退一步，让子女位各归其位。" },
  20: { quote: "女代母职", summary: "长女落坤，观象主静观、掌家与择偶标准高。", advice: "长女不宜长期代母，婚恋需降低家务牵制。" },
  21: { quote: "少年有成", summary: "二女落震，噬嗑象主刚烈、表达锋利、事业早发。", advice: "利曝光与竞争，需管住口舌和情绪。" },
  22: { quote: "求外饰之道", summary: "三子落离，贲象主外饰、名声、考试与躁动。", advice: "可取声名考试，避免只重外表不修内实。" },
  23: { quote: "耗尽之象", summary: "三子落坤，剥象主破耗、伦理失序与身心折损。", advice: "此局不宜久住，优先移位化破耗。" },
  24: { quote: "代夫出征", summary: "母亲落震，复象主女身担责、武职与代夫行事。", advice: "利公职武职，不利夫妻长期角力。" },
  25: { quote: "无妄之灾", summary: "父亲落震，无妄象主求财遇险、子位受压。", advice: "父亲不宜占长子位，先解除父子位冲突。" },
  26: { quote: "代父之职", summary: "三子落乾，大畜象主代父、节俭与积蓄。", advice: "可用来稳家计，但不宜让三子长期扛父责。" },
  27: { quote: "饮食养身", summary: "三子落震，颐象主养身、早发与健康恢复。", advice: "适合调养、读书与早年发展，注意同父异母象不扩写。" },
  28: { quote: "身进豪门", summary: "三女落巽，大过象主早婚、嫁贵与性刚。", advice: "婚恋须看年龄差和对方条件，不宜同龄硬配。" },
  29: { quote: "正北宫有险", summary: "二子归坎，坎象主冒险、官非与婚期延后。", advice: "坎位不宜强住，必要时用既济局化险。" },
  30: { quote: "迁移外地", summary: "二女归离，离象主明理、外地心与科甲。", advice: "此为出外原文命中项，可看迁移、求学、外地发展。" },
  31: { quote: "媒妁之言", summary: "三女落艮，咸象主媒合、感应与婚先成后破。", advice: "婚事要看是否过度依赖外力撮合。" },
  32: { quote: "科甲旺", summary: "长子落巽，恒象主晚婚、信仰心与科甲自由业。", advice: "可取读书教职，婚恋不宜催急。" },
  33: { quote: "萌生退意", summary: "父亲落艮，遁象主退缩、仕途停滞与家庭无力。", advice: "父亲宜离艮位，重启事业与夫妻沟通。" },
  34: { quote: "越居父位", summary: "长子落乾，大壮象主责任重、独立自主。", advice: "长子可成一方之主，但不宜压过父位太久。" },
  35: { quote: "性柔有母爱", summary: "二女落坤，晋象主节省、母爱与晚婚。", advice: "利守成与家务，不宜把人生全部压在照顾上。" },
  36: { quote: "力求变局", summary: "母亲落离，明夷象主母位受伤、破财与暗害。", advice: "此局宜优先调整母亲卧房，不在前台扩写灾断。" },
  37: { quote: "与家人和睦", summary: "长女落离，家人象主顾家、科甲与婚期延后。", advice: "可取和睦顾家，防长女承担过多家务。" },
  38: { quote: "背离家人", summary: "二女落兑，睽象主背离、口舌与官灾象。", advice: "先降冲突，避免让二女长期居兑位。" },
  39: { quote: "官调他乡", summary: "二子落艮，蹇象利武官、公职、外调与科甲。", advice: "这是出外/他乡原文命中项，适合看公职外派。" },
  40: { quote: "刚武勇", summary: "长子落坎，解象主刚武、官非与婚缘弱。", advice: "宜移位化是非，不在前台放大凶断。" },
  41: { quote: "父母烦心", summary: "三子落兑，损象主子女耗心、官运不通、花钱不进。", advice: "三子不宜久居兑位，先管钱与作息。" },
  42: { quote: "财禄足", summary: "长女落震，益象主祖业财禄、事业强与婚不稳。", advice: "利官运与事业，婚恋需另调长女位。" },
  43: { quote: "先凶后吉", summary: "三女落乾，夬象主婚延、刚者从武、事业后起。", advice: "可转为武职、专业或独立发展。" },
  44: { quote: "在外风流", summary: "父亲落巽，姤象主外缘桃花、官司牵连与夫妻失和。", advice: "父亲不宜居巽，宜尽快回乾位或换静位。" },
  45: { quote: "退居家内", summary: "三女落坤，萃象主修业、代母职，餐饮业较利。", advice: "可取修业与餐饮，不宜长期代母。" },
  46: { quote: "平步青云", summary: "母亲落巽，升象主官职事业、祖业更新与夫妻竞争。", advice: "利事业上升，但要避免夫妻权力互压。" },
  47: { quote: "困之于人", summary: "三女落坎，困象主体弱、婚阻与财不守。", advice: "先离坎位，必要时用既济思路化困。" },
  48: { quote: "从商吉", summary: "二子落巽，井象主从商、婚配复杂，公职多阻。", advice: "适合商路与祖业，不宜硬走公职升迁。" },
  49: { quote: "天生刚勇", summary: "三女落离，革象主刚勇明理、感情扰动。", advice: "宜把刚勇导向事业与学习，婚恋慢看。" },
  50: { quote: "大利未婚女", summary: "二女落巽，鼎象主贵夫、果断、官运与科甲。", advice: "未婚二女可用，忌鼠象按原书另核。" },
  51: { quote: "贵子", summary: "长子归震，震象主贵子、祖业、科甲与官商皆可。", advice: "长子本位，婚前更明显，婚后需看变局。" },
  52: { quote: "孝子", summary: "三子归艮，艮象主科甲、健康、公职与知进退。", advice: "三子本位，可作为稳定读书与公职局。" },
  53: { quote: "常思变动", summary: "长女落艮，渐象主工作变动、婚不主动、教职利。", advice: "适合教职公职，婚恋需主动破拖延。" },
  54: { quote: "离家出走", summary: "长子落兑，归妹象主离家、艺术才艺与诸事阻。", advice: "前台只取离家/才艺线索，不展示原文敏感断语。" },
  55: { quote: "先成后破", summary: "长子落离，丰象主婚先成后破、考试顺、公职吉。", advice: "利考试公职，婚恋需提前调局。" },
  56: { quote: "科甲兴旺", summary: "二女落艮，旅象主科甲、外出旅动与婚待时。", advice: "利求学考试，婚缘看未申年份与命局。" },
  57: { quote: "婚姻幸福", summary: "长女归巽，巽象大利未婚女、婚姻、科甲与健康。", advice: "长女本位，适合作为长女安位优先解。" },
  58: { quote: "多才艺", summary: "三女归兑，兑象主感情复杂、才艺科甲、公职顺。", advice: "三女本位，宜走才艺、公职与稳态路线。" },
  59: { quote: "涣局常见", summary: "长女落坎，涣象主心向宗教、诸事涣散与是非。", advice: "长女不宜居坎，宜回巽位化散。" },
  60: { quote: "财无积余", summary: "二子落兑，节象主财难积、婚缘有条件成局。", advice: "先取节制理财，婚恋需合属相与命局细看。" },
  61: { quote: "每考必中", summary: "长女落兑，中孚象主科甲、武职与双喜。", advice: "适合考试、公职与武职路线，婚事后成。" },
  62: { quote: "感情困扰", summary: "长子落艮，小过象主情关、工作失序与过失伤人。", advice: "先离情绪位，恢复工作和作息。" },
  63: { quote: "财官双美", summary: "二子落离，既济象主财官、考试与化困。", advice: "可用作坎险/困局的化解参考。" },
  64: { quote: "从武吉", summary: "二女落坎，未济象主刚怒、商路是非，从武可吉。", advice: "二女不宜居坎；若走武职、公职需再合命局。" }
};

function loadYangzhaiState() {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(YANGZHAI_STORAGE_KEY) : "";
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object") {
      return {
        placements: normalizeYangzhaiPlacements(parsed.placements),
        activePalace: parsed.activePalace || "xun",
        pendingItems: normalizeYangzhaiItems(parsed.pendingItems || parsed.pendingItem),
        expanded: parsed.expanded || {}
      };
    }
  } catch (_) {}
  return {
    placements: normalizeYangzhaiPlacements(YANGZHAI_DEFAULT_PLACEMENTS),
    activePalace: "xun",
    pendingItems: [],
    expanded: {}
  };
}

let yangzhaiState = loadYangzhaiState();

function saveYangzhaiState() {
  try {
    if (typeof localStorage !== "undefined") {
      yangzhaiState.placements = normalizeYangzhaiPlacements(yangzhaiState.placements);
      yangzhaiState.pendingItems = normalizeYangzhaiItems(yangzhaiState.pendingItems);
      localStorage.setItem(YANGZHAI_STORAGE_KEY, JSON.stringify(yangzhaiState));
    }
  } catch (_) {}
}

function getYangzhaiPalace(key) {
  return YANGZHAI_PALACES.find((item) => item.key === key) || YANGZHAI_PALACES[0];
}

function getYangzhaiOption(label) {
  return YANGZHAI_OPTIONS.find((item) => item.label === label) || { label, short: label.slice(0, 1), type: "family" };
}

function normalizeYangzhaiItems(value) {
  const rawItems = Array.isArray(value) ? value : (value ? [value] : []);
  return [...new Set(rawItems.filter((item) => typeof item === "string" && item.trim()))];
}

function normalizeYangzhaiPlacements(placements = {}) {
  return Object.entries(placements || {}).reduce((result, [key, value]) => {
    const items = normalizeYangzhaiItems(value);
    if (items.length) result[key] = items;
    return result;
  }, {});
}

function getYangzhaiPlacementItems(key) {
  return normalizeYangzhaiItems(yangzhaiState.placements?.[key]);
}

function getYangzhaiPendingItems() {
  return normalizeYangzhaiItems(yangzhaiState.pendingItems);
}

function openYangzhaiPicker(key) {
  const palace = getYangzhaiPalace(key);
  if (palace.key === "center") return;
  yangzhaiState.activePalace = palace.key;
  yangzhaiState.pendingItems = getYangzhaiPlacementItems(palace.key);
  saveYangzhaiState();
  navigate("screen-43");
}

function pickYangzhaiOption(label) {
  const option = getYangzhaiOption(label);
  const selected = getYangzhaiPendingItems();
  if (option.type === "clear") {
    yangzhaiState.pendingItems = [];
  } else {
    yangzhaiState.pendingItems = selected.includes(label)
      ? selected.filter((item) => item !== label)
      : [...selected, label];
  }
  saveYangzhaiState();
  navigate("screen-43", false);
}

function confirmYangzhaiSelection() {
  const palace = getYangzhaiPalace(yangzhaiState.activePalace);
  const selected = getYangzhaiPendingItems();
  if (!selected.length) {
    delete yangzhaiState.placements[palace.key];
  } else {
    yangzhaiState.placements[palace.key] = selected;
  }
  yangzhaiState.pendingItems = [];
  saveYangzhaiState();
  navigate("screen-42");
}

function resetYangzhai() {
  yangzhaiState.placements = {};
  yangzhaiState.pendingItems = [];
  yangzhaiState.expanded = {};
  saveYangzhaiState();
  navigate("screen-42", false);
}

function autoFillYangzhai() {
  yangzhaiState.placements = normalizeYangzhaiPlacements(YANGZHAI_DEFAULT_PLACEMENTS);
  yangzhaiState.pendingItems = [];
  yangzhaiState.expanded = {};
  saveYangzhaiState();
  navigate("screen-42", false);
}

function analyzeYangzhai() {
  yangzhaiState.expanded = {};
  saveYangzhaiState();
  navigate("screen-44");
}

function toggleYangzhaiResult(index) {
  yangzhaiState.expanded[index] = !yangzhaiState.expanded[index];
  saveYangzhaiState();
  navigate("screen-44", false);
}

function openYangzhaiLuopanZoom() {
  const phone = view.querySelector(".figma-phone");
  if (!phone) return;
  phone.querySelector("[data-yangzhai-luopan-zoom]")?.remove();
  phone.insertAdjacentHTML("beforeend", `
    <div class="yangzhai-luopan-zoom" data-yangzhai-luopan-zoom>
      <button class="yangzhai-luopan-zoom-bg" type="button" data-action="yangzhai-luopan-close" aria-label="关闭罗盘大图"></button>
      <img class="yangzhai-luopan-zoom-img" src="../images/wentian-prototype-assets/yangzhai-luopan.png" alt="罗盘大图">
      <button class="yangzhai-luopan-zoom-close" type="button" data-action="yangzhai-luopan-close" aria-label="关闭罗盘大图">×</button>
    </div>
  `);
}

function closeYangzhaiLuopanZoom() {
  view.querySelector("[data-yangzhai-luopan-zoom]")?.remove();
}

function getYangzhaiHex(label, palace) {
  const upper = YANGZHAI_ROLE_GUA[label];
  if (!upper || !palace?.gua) return null;
  return YANGZHAI_HEX_INDEX[`${upper}-${palace.gua}`] || null;
}

function getYangzhaiHexReading(hex) {
  if (!hex) return null;
  return YANGZHAI_HEX_READINGS[Number(hex.no)] || {
    quote: "原文待核",
    summary: "已对应到六十四卦索引，正文仍待人工复核。",
    advice: "仅显示结构，不扩写吉凶。"
  };
}

function buildYangzhaiResults() {
  return YANGZHAI_PALACES
    .filter((palace) => palace.key !== "center")
    .flatMap((palace) => getYangzhaiPlacementItems(palace.key).map((label) => {
      const option = getYangzhaiOption(label);
      const short = option.short;
      if (option.type === "space") {
        const rule = YANGZHAI_SPACE_RULES[label] || {};
        const preferred = (rule.preferredPalaces || []).includes(palace.key);
        const preference = rule.preferredPalaces?.length
          ? preferred
            ? `方位偏好命中：${rule.preference}。`
            : `方位偏好：${rule.preference}，当前为${palace.dir}，仅作索引参考。`
          : `${rule.preference || "只做空间象义提示"}。`;
        const desc = `功能象义：${rule.meaning || "待核"}。${preference}`;
        return {
          kind: "space",
          title: `${label}在${palace.gua}(${palace.dir}) - 功能区象义`,
          desc,
          full: `${desc} 来源${rule.source || "待核"}，${rule.audit || "待核"}；${rule.status || "不发布未核断语"}。不扩写疾病、死亡、离散等敏感断语。`,
          short,
          matched: preferred
        };
      }
      const hex = getYangzhaiHex(label, palace);
      const matched = label === palace.defaultItem;
      const reading = getYangzhaiHexReading(hex);
      const desc = hex
        ? `第${hex.no}卦 ${hex.name}：摘句「${reading.quote}」。${reading.summary}`
        : `八宫基础：${label}住${palace.gua}(${palace.dir})，待补结构索引。`;
      return {
        kind: "hex",
        title: `${label}住${palace.gua}(${palace.dir}) - ${hex ? hex.name : palace.role}`,
        desc,
        full: hex
          ? `结构：${hex.index}；上卦=角色(${YANGZHAI_ROLE_GUA[label]})，下卦=方位(${palace.gua})。原书摘句：${reading.quote}。解读：${reading.summary} 建议：${reading.advice} 出处：${YANGZHAI_SOURCE_TITLE}。`
          : `${desc} 来源待核；前台只发布可核索引。`,
        short,
        matched
      };
    }));
}

function getYangzhaiResultHeight() {
  const results = buildYangzhaiResults();
  if (!results.length) return 930;
  let y = YANGZHAI_RESULT_START_Y;
  results.forEach((_, index) => {
    y += (yangzhaiState.expanded[index] ? YANGZHAI_RESULT_EXPANDED_HEIGHT : YANGZHAI_RESULT_COLLAPSED_HEIGHT) + 22;
  });
  return Math.max(844, y + 110);
}

function yangzhaiBg(id, height = 844) {
  return `
    ${figBox(`${id}-bg`, -720, 0, 1830, height, "", "background:#f7f7fb;")}
    ${figBox(`${id}-top`, -720, 0, 1830, 104, "", "background:#fff;")}
    ${figBox(`${id}-header-line`, 0, 103, 390, 1, "", "background:#eeeef4;")}
  `;
}

function yangzhaiHeader(id, title = "地脉道", right = "教程") {
  return `
    ${figButton(`${id}-back-hit`, 12, 38, 58, 58, 'data-action="back"')}
    ${figText(`${id}-back`, "‹", 22, 45, 28, 33, "#1f2227", 500, "center", "line-height:1;")}
    ${figText(`${id}-title`, title, 100, 47, 190, 24, "#101114", 500, "center", "line-height:1.25;")}
    ${right ? `${figBox(`${id}-tutorial`, 314, 40, 58, 38, "", "border:1px solid #1f2227;border-radius:13px;background:#fff;")}
    ${figButton(`${id}-tutorial-hit`, 314, 40, 58, 38, 'data-route="screen-45"')}
    ${figText(`${id}-tutorial-text`, right, 314, 49, 58, 17, "#101114", 500, "center")}` : ""}
  `;
}

function yangzhaiRoomAvatar(id, x, y, labels) {
  const items = normalizeYangzhaiItems(labels);
  if (!items.length) {
    return `
      ${figBox(`${id}-plus`, x + 45, y + 70, 36, 36, "", "border:1px solid #d3d0c9;border-radius:18px;background:#fff;")}
      ${figText(`${id}-plus-text`, "+", x + 45, y + 74, 36, 20, "#9b3d33", 900, "center", "line-height:1.1;")}
    `;
  }
  const label = items[0];
  const option = getYangzhaiOption(label);
  const short = option.short || label.slice(0, 1);
  const displayLabel = items.length > 1 ? `${label}等${items.length}项` : label;
  const avatarSrc = YANGZHAI_AVATAR_IMAGES[label];
  const labelSize = displayLabel.length > 5 ? 13 : 16;
  return `
    ${avatarSrc
      ? figImage(`${id}-avatar-img`, avatarSrc, x + 18, y + 62, 38, 38, "border-radius:19px;background:#f1f1ee;object-fit:cover;")
      : `${figBox(`${id}-avatar`, x + 18, y + 62, 38, 38, "", "border:1px solid #d7d5cf;border-radius:19px;background:#f1f1ee;")}
         ${figText(`${id}-avatar-text`, short, x + 18, y + 71, 38, 14, "#735122", 900, "center")}`}
    ${items.length > 1 ? `${figBox(`${id}-count`, x + 47, y + 56, 28, 19, "", "border-radius:10px;background:#b75146;box-shadow:0 3px 6px rgba(128,47,42,.20);")}
    ${figText(`${id}-count-text`, `+${items.length - 1}`, x + 47, y + 59, 28, 11, "#fff", 900, "center", "line-height:1.1;")}` : ""}
    ${figText(`${id}-label`, displayLabel, x + 18, y + 106, 88, labelSize, "#111114", 500)}
    ${figBox(`${id}-plus`, x + 77, y + 61, 38, 38, "", "border-radius:19px;background:#4a4a4a;box-shadow:0 8px 14px rgba(0,0,0,.10);")}
    ${figText(`${id}-plus-text`, "+", x + 77, y + 66, 38, 23, "#fff", 900, "center", "line-height:1.1;")}
  `;
}

function yangzhaiCompassGrid(id) {
  return YANGZHAI_PALACES.map((palace, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = YANGZHAI_GRID_X + col * YANGZHAI_CELL_W;
    const y = YANGZHAI_GRID_Y + row * YANGZHAI_CELL_H;
    if (palace.key === "center") {
      return `
        ${figText(`${id}-center-title`, "罗盘方位", x + 0, y + 50, YANGZHAI_CELL_W, 22, "#111114", 700, "center")}
        ${figImage(`${id}-luopan`, "../images/wentian-prototype-assets/yangzhai-luopan.png", x + 4, y + 92, 115, 115, "object-fit:cover;border-radius:50%;background:#fff;")}
        ${figButton(`${id}-luopan-hit`, x + 4, y + 50, YANGZHAI_CELL_W - 8, 158, 'data-action="yangzhai-luopan-open" aria-label="放大罗盘"', "", "cursor:zoom-in;")}
      `;
    }
    const items = getYangzhaiPlacementItems(palace.key);
    return `
      ${figBox(`${id}-cell-header-line-${index}`, x, y + YANGZHAI_CELL_HEADER_H, YANGZHAI_CELL_W, 1, "", "background:#dedee5;")}
      ${figText(`${id}-gua-${index}`, palace.gua, x + 12, y + 9, 24, 25, "#815cf6", 900, "left", "line-height:1;")}
      ${figText(`${id}-dir-${index}`, `(${palace.dir})`, x + 38, y + 13, 39, 14, "#111114", 500, "left", "white-space:nowrap;")}
      ${figBox(`${id}-sep-${index}`, x + 80, y + 13, 1, 17, "", "background:#dcdce2;")}
      ${figText(`${id}-role-${index}`, palace.role, x + 85, y + 13, 42, 14, "#111114", 500, "left", "white-space:nowrap;")}
      ${yangzhaiRoomAvatar(`${id}-room-${index}`, x, y, items)}
      ${figButton(`${id}-cell-hit-${index}`, x, y, YANGZHAI_CELL_W, YANGZHAI_CELL_H, `data-action="yangzhai-open" data-palace="${palace.key}"`)}
    `;
  }).join("");
}

function yangzhaiCompassShell(id) {
  return `
    ${figBox(`${id}-grid-surface`, YANGZHAI_GRID_X, YANGZHAI_GRID_Y, YANGZHAI_GRID_W, YANGZHAI_GRID_H, "", "border:1px solid #d9d9e1;background:#fff;overflow:hidden;")}
    ${figBox(`${id}-line-h1`, YANGZHAI_GRID_X, YANGZHAI_GRID_Y + YANGZHAI_CELL_H, YANGZHAI_GRID_W, 1, "", "background:#d9d9e1;")}
    ${figBox(`${id}-line-h2`, YANGZHAI_GRID_X, YANGZHAI_GRID_Y + YANGZHAI_CELL_H * 2, YANGZHAI_GRID_W, 1, "", "background:#d9d9e1;")}
    ${figBox(`${id}-line-v1`, YANGZHAI_GRID_X + YANGZHAI_CELL_W, YANGZHAI_GRID_Y, 1, YANGZHAI_GRID_H, "", "background:#d9d9e1;")}
    ${figBox(`${id}-line-v2`, YANGZHAI_GRID_X + YANGZHAI_CELL_W * 2, YANGZHAI_GRID_Y, 1, YANGZHAI_GRID_H, "", "background:#d9d9e1;")}
    ${yangzhaiCompassGrid(id)}
  `;
}

function yangzhaiActions(id, primaryText = "解读分析") {
  return `
    ${figBox(`${id}-analyze`, 12, YANGZHAI_ACTION_Y, 172, 52, "", "border-radius:18px;background:#805af6;box-shadow:0 10px 18px rgba(126,88,246,.18);")}
    ${figButton(`${id}-analyze-hit`, 12, YANGZHAI_ACTION_Y, 172, 52, 'data-action="yangzhai-analyze"')}
    ${figText(`${id}-analyze-text`, primaryText, 12, YANGZHAI_ACTION_Y + 15, 172, 18, "#fff", 500, "center")}
    ${figBox(`${id}-order`, 198, YANGZHAI_ACTION_Y, 132, 52, "", "border:1px solid #8d8d95;border-radius:18px;background:#fff;")}
    ${figButton(`${id}-order-hit`, 198, YANGZHAI_ACTION_Y, 132, 52, 'data-action="yangzhai-autofill"')}
    ${figText(`${id}-order-text`, "长幼有序,天地归位", 198, YANGZHAI_ACTION_Y + 17, 132, 13, "#5c5c64", 500, "center", "white-space:nowrap;")}
    ${figBox(`${id}-reset`, 340, YANGZHAI_ACTION_Y, 40, 52, "", "border:1px solid #8d8d95;border-radius:18px;background:#fff;")}
    ${figButton(`${id}-reset-hit`, 340, YANGZHAI_ACTION_Y, 40, 52, 'data-action="yangzhai-reset"')}
    ${figText(`${id}-reset-text`, "重置", 340, YANGZHAI_ACTION_Y + 17, 40, 15, "#5c5c64", 500, "center")}
  `;
}

function sourceYangzhaiCompassScreen() {
  return `
    ${yangzhaiBg("yz42")}
    ${yangzhaiHeader("yz42")}
    ${yangzhaiCompassShell("yz42")}
    ${yangzhaiActions("yz42")}
    ${figBox("yz42-tip", 0, 766, 390, 62, "", "background:#fff;border-radius:18px;")}
    ${figBox("yz42-tip-icon-bg", 18, 786, 18, 18, "", "border-radius:9px;background:#bfc0c5;")}
    ${figText("yz42-tip-icon", "!", 18, 789, 18, 10, "#fff", 900, "center", "line-height:1;")}
    ${figText("yz42-tip-text", "当前内容信息仅供娱乐，不等于专业测评，不代表价值评判，无任何现实指导意义，仅供娱乐参考。", 46, 783, 320, 13, "#a3a3aa", 500, "left", "line-height:1.5;")}
  `;
}

function sourceYangzhaiSelectScreen() {
  const activePalace = getYangzhaiPalace(yangzhaiState.activePalace);
  const selectedItems = getYangzhaiPendingItems();
  return `
    ${sourceYangzhaiCompassScreen()}
    ${figBox("yz43-overlay", 0, 0, 390, 844, "", "background:rgba(36,24,14,.52);")}
    ${figBox("yz43-sheet", 0, 334, 390, 510, "", "border-radius:24px 24px 0 0;background:#fffaf3;box-shadow:0 -18px 40px rgba(35,20,10,.22);")}
    ${figBox("yz43-handle", 160, 348, 70, 5, "", "border-radius:4px;background:#e2d4c0;")}
    ${figText("yz43-title", `${activePalace.gua}(${activePalace.dir}) - ${activePalace.role}`, 24, 374, 220, 20, "#201812", 900)}
    ${figText("yz43-sub", "可多选；再次点击取消，清空会移除本宫全部", 24, 404, 252, 12, "#817568", 600)}
    ${figButton("yz43-close-hit", 328, 368, 42, 42, 'data-route="screen-42"')}
    ${figText("yz43-close", "×", 330, 369, 42, 30, "#5f5a52", 500, "center")}
    ${figLine("yz43-midline", 195, 432, 312, "#eadfce")}
    ${YANGZHAI_OPTIONS.map((option, index) => {
      const label = option.label;
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = col ? 214 : 44;
      const y = 446 + row * 49;
      const isSelected = option.type === "clear" ? !selectedItems.length : selectedItems.includes(label);
      return `
        ${figBox(`yz43-option-bg-${index}`, x - 8, y - 5, 158, 42, "", `border:1px solid ${isSelected ? "#a94437" : "#eadfce"};border-radius:14px;background:${isSelected ? "#fff1e8" : "#fffdf8"};`)}
        ${figBox(`yz43-avatar-${index}`, x, y, 32, 32, "", `border-radius:16px;background:${option.type === "clear" ? "#fff1ea" : "#f2e8d7"};border:1px solid #e0d2bd;`)}
        ${figText(`yz43-avatar-text-${index}`, option.short, x, y + 8, 32, 12, option.type === "clear" ? "#a94437" : "#7f5b2a", 900, "center")}
        ${figText(`yz43-option-${index}`, label, x + 42, y + 7, 72, 14, "#201812", 800)}
        ${figBox(`yz43-radio-${index}`, x + 120, y + 7, 20, 20, "", `border:1px solid ${isSelected ? "#a94437" : "#c9bba9"};border-radius:10px;background:${isSelected ? "#a94437" : "#fffdf8"};`)}
        ${isSelected ? figText(`yz43-radio-check-${index}`, "✓", x + 120, y + 10, 20, 10, "#fffaf3", 900, "center") : ""}
        ${figButton(`yz43-option-hit-${index}`, x - 8, y - 5, 158, 42, `data-action="yangzhai-pick" data-yangzhai-option="${label}"`)}
      `;
    }).join("")}
    ${figBox("yz43-confirm", 44, 778, 302, 50, "", "border-radius:25px;background:linear-gradient(180deg,#b74e39,#983323);box-shadow:0 12px 24px rgba(158,61,43,.22);")}
    ${figButton("yz43-confirm-hit", 44, 778, 302, 50, 'data-action="yangzhai-confirm"')}
    ${figText("yz43-confirm-text", selectedItems.length ? `确认安位 (${selectedItems.length})` : "确认清空", 44, 792, 302, 16, "#fffaf3", 900, "center")}
  `;
}

function sourceYangzhaiResultScreen() {
  const results = buildYangzhaiResults();
  const height = getYangzhaiResultHeight();
  return `
    ${yangzhaiBg("yz44", height)}
    ${yangzhaiHeader("yz44")}
    ${yangzhaiCompassShell("yz44")}
    ${yangzhaiActions("yz44", "重新分析")}
    ${figText("yz44-result-title", "解读结果", 24, YANGZHAI_RESULT_TITLE_Y, 120, 16, "#201812", 900)}
    ${figText("yz44-result-meta", results.length ? `${results.length}条解读` : "尚未排布", 236, YANGZHAI_RESULT_TITLE_Y + 2, 130, 12, "#817568", 700, "right")}
    ${!results.length ? `
      ${figBox("yz44-empty", 24, YANGZHAI_RESULT_START_Y, 342, 132, "", "border:1px solid #eadfce;border-radius:18px;background:#fffdf8;box-shadow:0 10px 24px rgba(70,45,25,.07);")}
      ${figText("yz44-empty-title", "还没有可解读内容", 0, YANGZHAI_RESULT_START_Y + 42, 390, 16, "#201812", 900, "center")}
      ${figText("yz44-empty-copy", "添加父母、子女、厨房、厕所或客厅后再分析。", 0, YANGZHAI_RESULT_START_Y + 74, 390, 12, "#817568", 600, "center")}
    ` : ""}
    ${results.map((item, index) => {
      let y = YANGZHAI_RESULT_START_Y;
      for (let i = 0; i < index; i += 1) y += (yangzhaiState.expanded[i] ? YANGZHAI_RESULT_EXPANDED_HEIGHT : YANGZHAI_RESULT_COLLAPSED_HEIGHT) + 22;
      const expanded = !!yangzhaiState.expanded[index];
      const cardHeight = expanded ? YANGZHAI_RESULT_EXPANDED_HEIGHT : YANGZHAI_RESULT_COLLAPSED_HEIGHT;
      return `
        ${figBox(`yz44-card-${index}`, 24, y, 342, cardHeight, "", "border:1px solid #eadfce;border-radius:18px;background:#fffdf8;box-shadow:0 12px 26px rgba(70,45,25,.08);")}
        ${figBox(`yz44-avatar-${index}`, 42, y + 24, 34, 34, "", "border:1px solid #ddc8aa;border-radius:17px;background:#f2e8d7;")}
        ${figText(`yz44-avatar-text-${index}`, item.short, 42, y + 32, 34, 12, "#7f5b2a", 900, "center")}
        ${figText(`yz44-title-${index}`, item.title, 88, y + 22, 230, 16, "#201812", 900)}
        ${figText(`yz44-desc-${index}`, expanded ? item.full : item.desc, 42, y + 68, 278, 13, "#4c433a", 600, "left", "line-height:1.55;")}
        ${figButton(`yz44-full-hit-${index}`, 296, y + cardHeight - 34, 58, 26, `data-action="yangzhai-expand" data-yangzhai-index="${index}"`)}
        ${figText(`yz44-full-${index}`, expanded ? "收起" : "⌄ 全文", 304, y + cardHeight - 28, 48, 12, "#a94437", 900, "center")}
      `;
    }).join("")}
    ${figBox("yz44-tip", 18, height - 88, 354, 58, "", "border:1px solid #eadfce;border-radius:18px;background:#fffaf3;")}
    ${figText("yz44-tip-text", "当前内容仅供娱乐参考，不等于专业测评。", 0, height - 68, 390, 12, "#8b8073", 600, "center")}
  `;
}

function sourceYangzhaiTutorialScreen() {
  const steps = [
    ["1", "站在户型中心", "先确定房屋中心点，再按手机罗盘或户型图标出八方。"],
    ["2", "点击方位加号", "把家人、厨房、厕所、客厅放入对应宫位。"],
    ["3", "一键归位", "可用“长幼有序”快速按父母子女关系填入九宫。"],
    ["4", "解读分析", "按《地脉道》对应64卦，输出摘句、解读和安位建议。"]
  ];
  return `
    ${yangzhaiBg("yz45")}
    ${yangzhaiHeader("yz45", "教程", "")}
    ${figText("yz45-title", "地脉道怎么用", 24, 112, 180, 22, "#201812", 900)}
    ${figText("yz45-sub", "先定方位，再放人和空间；结果会对应海厦《地脉道》64卦。", 24, 148, 300, 13, "#817568", 600, "left", "line-height:1.5;")}
    ${steps.map(([num, title, desc], index) => {
      const y = 204 + index * 112;
      return `
        ${figBox(`yz45-step-${index}`, 24, y, 342, 88, "", "border:1px solid #eadfce;border-radius:18px;background:#fffdf8;box-shadow:0 10px 24px rgba(70,45,25,.07);")}
        ${figBox(`yz45-num-${index}`, 44, y + 24, 34, 34, "", "border-radius:17px;background:linear-gradient(180deg,#b74e39,#983323);")}
        ${figText(`yz45-num-text-${index}`, num, 44, y + 33, 34, 12, "#fffaf3", 900, "center")}
        ${figText(`yz45-step-title-${index}`, title, 94, y + 20, 160, 15, "#201812", 900)}
        ${figText(`yz45-step-desc-${index}`, desc, 94, y + 48, 230, 12, "#817568", 600, "left", "line-height:1.45;")}
      `;
    }).join("")}
    ${figBox("yz45-go", 42, 728, 306, 50, "", "border-radius:25px;background:linear-gradient(180deg,#b74e39,#983323);box-shadow:0 12px 24px rgba(158,61,43,.22);")}
    ${figButton("yz45-go-hit", 42, 728, 306, 50, 'data-route="screen-42"')}
    ${figText("yz45-go-text", "开始排布", 42, 743, 306, 14, "#fffaf3", 900, "center")}
  `;
}

function renderWentianPolishedScreen(screen) {
  const no = screen.no;
  if (no === 42) return sourceYangzhaiCompassScreen();
  if (no === 43) return sourceYangzhaiSelectScreen();
  if (no === 44) return sourceYangzhaiResultScreen();
  if (no === 45) return sourceYangzhaiTutorialScreen();
  if (no === 8) {
    const paragraphs = [
      ["核心结论", "你的命盘不是单一路线，而是“先观察、后出手”的结构。真正适合你的节奏，是先把信息摸透，再用稳定执行换结果。"],
      ["性格优势", "思考细密，能抓到别人忽略的线索。遇到复杂问题时，反而比简单重复的任务更能发挥。"],
      ["隐性风险", "容易在关键节点想太多，迟迟不愿下注。越重要的事情，越需要把判断拆成小步骤去验证。"],
      ["事业建议", "适合做需要判断、整合、表达的工作。近期不要频繁换方向，先把一个可见成果做厚。"],
      ["感情建议", "关系里要少用试探，多说真实需求。你适合稳定、讲信用、能一起规划生活的人。"],
      ["财运建议", "财运来自长期积累，不宜追短线。先守现金流，再考虑扩张。"],
      ["行动方案", "未来三个月，把精力放在一个主目标上，每周复盘一次，删掉消耗型关系和低回报事项。"]
    ];
    return `
      ${figBox("wt8-bg", 0, 0, 390, 1280, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt8", "AI长文解读")}
      ${figBox("wt8-master", 24, 100, 342, 92, "", "border-radius:16px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figImage("wt8-avatar", "../images/wentian-prototype-assets/xu-banxian.jpg", 42, 116, 58, 58, "border-radius:29px;object-fit:cover;object-position:center 18%;")}
      ${figText("wt8-name", "许半仙", 116, 122, 120, 17, "#25211d", 800)}
      ${figText("wt8-desc", "已结合紫微命盘、八字与当前档案生成", 116, 150, 210, 13, "#8d857b", 500)}
      ${figBox("wt8-question", 42, 222, 306, 88, "", "border-radius:14px;background:#c69a34;box-shadow:0 8px 18px rgba(148,101,25,.16);")}
      ${figText("wt8-question-text", "请根据我的八字，深度拆解我的核心性格特质、事业机会和近期行动重点。", 62, 246, 266, 14, "#fff", 700, "left", "line-height:1.55;")}
      ${paragraphs.map(([title, desc], index) => {
        const y = 344 + index * 118;
        return `
          ${figBox(`wt8-card-${index}`, 24, y, 342, 94, "", "border-radius:14px;background:#fff;box-shadow:0 6px 18px rgba(70,45,25,.07);")}
          ${figText(`wt8-title-${index}`, title, 44, y + 17, 110, 15, "#25211d", 800)}
          ${figText(`wt8-desc-${index}`, desc, 44, y + 45, 290, 13, "#625b53", 500, "left", "line-height:1.55;")}
        `;
      }).join("")}
      ${figBox("wt8-input", 24, 1198, 342, 44, "", "border-radius:22px;background:#fff;border:1px solid #eadfce;")}
      ${figText("wt8-input-text", "继续追问", 48, 1212, 160, 13, "#a09890")}
      ${figText("wt8-input-plus", "+", 318, 1205, 28, 24, "#c49a34", 800, "center")}
    `;
  }
  if (no === 9) {
    const records = [
      ["新的对话", "15:18", "根据我的八字拆解核心性格特质"],
      ["新的对话", "22:06", "最近事业机会应该怎么判断"],
      ["命盘追问", "昨天", "感情关系里需要注意什么"]
    ];
    return `
      ${sourceAiChatScreen(screen)}
      ${figBox("wt9-overlay", 0, 0, 390, 844, "", "background:rgba(0,0,0,.36);")}
      ${figBox("wt9-sheet", 0, 500, 390, 344, "", "border-radius:22px 22px 0 0;background:#fff;box-shadow:0 -14px 32px rgba(0,0,0,.16);")}
      ${figBox("wt9-handle", 160, 514, 70, 5, "", "border-radius:4px;background:#eee8df;")}
      ${figText("wt9-title", "对话记录", 28, 540, 130, 18, "#25211d", 800)}
      ${figBox("wt9-new", 270, 536, 82, 32, "", "border-radius:16px;background:#d0a03a;")}
      ${figButton("wt9-new-hit", 270, 536, 82, 32, 'data-route="screen-4"')}
      ${figText("wt9-new-text", "新对话", 270, 545, 82, 12, "#fff", 800, "center")}
      ${records.map(([title, time, desc], index) => {
        const y = 586 + index * 72;
        return `
          ${figBox(`wt9-row-${index}`, 24, y, 342, 58, "", "border-radius:14px;background:#fffaf3;border:1px solid #efe2d0;")}
          ${figBox(`wt9-row-icon-${index}`, 40, y + 15, 28, 28, "", "border-radius:14px;background:#fff0d6;")}
          ${figText(`wt9-row-icon-text-${index}`, "◷", 40, y + 21, 28, 12, "#bd8624", 800, "center")}
          ${figText(`wt9-row-title-${index}`, title, 82, y + 11, 132, 14, "#25211d", 800)}
          ${figText(`wt9-row-time-${index}`, time, 278, y + 12, 54, 12, "#a39a90", 600, "right")}
          ${figText(`wt9-row-desc-${index}`, desc, 82, y + 34, 210, 11, "#7f766b", 500)}
          ${figText(`wt9-row-arrow-${index}`, "›", 334, y + 23, 18, 18, "#c5b7a5", 800, "center")}
          ${figButton(`wt9-row-hit-${index}`, 24, y, 342, 58, 'data-route="screen-7"')}
        `;
      }).join("")}
      ${figText("wt9-foot", "仅保留最近 10 条对话", 0, 812, 390, 11, "#b2aaa2", 500, "center")}
    `;
  }
  if (no === 10) {
    return `
      ${figBox("wt10-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt10", "选择合盘类型")}
      ${figBox("wt10-card", 34, 108, 322, 584, "", "border-radius:18px;background:#fff;box-shadow:0 12px 30px rgba(69,45,24,.12);overflow:hidden;")}
      ${figText("wt10-title", "情侣合盘", 0, 136, 390, 25, "#25211d", 800, "center")}
      ${["缘分深浅", "情感契合度", "冲突化解建议"].map((text, index) => `
        ${figBox(`wt10-pill-${index}`, 122, 178 + index * 34, 146, 24, "", "border:1px solid #c8a65f;border-radius:12px;background:#fffaf0;")}
        ${figText(`wt10-pill-text-${index}`, text, 122, 184 + index * 34, 146, 11, "#7c5d22", 700, "center")}
      `).join("")}
      ${figImage("wt10-image", "../images/wentian-prototype-assets/hepan-master.jpg", 34, 320, 322, 278, "object-fit:cover;object-position:center 18%;")}
      ${figBox("wt10-start-row", 90, 564, 210, 28, "", "border-radius:14px;background:#fbf7ef;")}
      ${figText("wt10-start-text", "开启合盘对话", 90, 571, 210, 12, "#25211d", 700, "center")}
      ${figBox("wt10-record-row", 90, 604, 210, 28, "", "border-radius:14px;background:#fbf7ef;")}
      ${figText("wt10-record-text", "查看合盘记录", 90, 611, 210, 12, "#25211d", 700, "center")}
      ${wentianGoldButton("wt10", "开始合盘", "screen-11", 746)}
    `;
  }
  if (no === 11) {
    return `
      ${figBox("wt11-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt11", "选择合盘档案")}
      ${figBox("wt11-hero", 36, 120, 318, 330, "", "border-radius:18px;background:#fff;box-shadow:0 10px 24px rgba(70,45,25,.12);")}
      ${figText("wt11-title", "情侣合盘", 0, 150, 390, 22, "#25211d", 800, "center")}
      ${figImage("wt11-img", "../images/wentian-prototype-assets/hepan-master.jpg", 58, 218, 274, 178, "border-radius:0 0 14px 14px;object-fit:cover;object-position:center 18%;opacity:.9;")}
      ${figBox("wt11-overlay", 0, 0, 390, 844, "", "background:rgba(0,0,0,.32);")}
      ${figBox("wt11-sheet", 0, 486, 390, 358, "", "border-radius:22px 22px 0 0;background:#fff;")}
      ${figBox("wt11-handle", 164, 500, 62, 4, "", "border-radius:4px;background:#e3d8c8;")}
      ${figText("wt11-sheet-title", "选择档案", 28, 526, 160, 17, "#25211d", 800)}
      ${figText("wt11-step", "已选0/2", 304, 529, 48, 11, "#a79986", 600, "right")}
      ${wentianArchiveMini("wt11-a", 566, "谢", false)}
      ${wentianArchiveMini("wt11-b", 650, "命主", false)}
      ${figBox("wt11-new", 42, 746, 136, 44, "", "border:1px solid #d6b463;border-radius:10px;background:#fff;")}
      ${figText("wt11-new-text", "+ 新建档案", 42, 758, 136, 13, "#9b742e", 700, "center")}
      ${figBox("wt11-confirm", 212, 746, 136, 44, "", "border-radius:10px;background:#d2a642;opacity:.45;")}
      ${figText("wt11-confirm-text", "确定", 212, 758, 136, 13, "#fff", 800, "center")}
    `;
  }
  if (no === 12) {
    return `
      ${figBox("wt12-bg", 0, 0, 390, 844, "", "background:#f7f7f6;")}
      ${wentianSimpleHeader("wt12", "", "◷")}
      ${figImage("wt12-avatar", "../images/wentian-prototype-assets/xu-banxian.jpg", 145, 126, 100, 100, "border-radius:50px;object-fit:cover;object-position:center 18%;")}
      ${figText("wt12-name", "许半仙", 0, 252, 390, 16, "#25211d", 800, "center")}
      ${figText("wt12-sub", "写下你想问的命理问题", 0, 279, 390, 14, "#8f8a84", 500, "center")}
      ${figBox("wt12-input", 36, 356, 318, 92, "", "border-radius:12px;background:#fff;")}
      ${figText("wt12-placeholder", "请输入想问什么？", 56, 386, 220, 14, "#b6b0aa")}
      ${figBox("wt12-send", 314, 400, 32, 32, "", "border-radius:16px;background:#e4e1dd;")}
      ${figText("wt12-send-text", "+", 314, 405, 32, 20, "#fff", 800, "center")}
      ${["今日运势如何？", "最近的工作会有好的转机吗？", "我和TA的感情未来如何发展？", "近期的贵人会何时出现？"].map((text, index) => `
        ${figBox(`wt12-chip-${index}`, 54, 504 + index * 42, 282, 30, "", "border-radius:15px;background:#fff;")}
        ${figText(`wt12-chip-text-${index}`, text, 54, 512 + index * 42, 282, 12, "#7f7a74", 600, "center")}
      `).join("")}
    `;
  }
  if (no === 13 || no === 14) {
    const loading = no === 14;
    return `
      ${figBox(`wt${no}-bg`, 0, 0, 390, 844, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 48%,#f7f2ea 100%);")}
      ${wentianSimpleHeader(`wt${no}`, "黄大仙灵签", "◷")}
      ${figBox(`wt${no}-hero`, 22, 104, 346, 108, "", "border-radius:18px;background:#fff;box-shadow:0 10px 26px rgba(70,45,25,.1);")}
      ${figText(`wt${no}-hero-title`, loading ? "正在为你取签" : "心中默念所问之事", 44, 128, 210, 18, "#25211d", 800)}
      ${figText(`wt${no}-hero-copy`, loading ? "已接入当前档案，签文生成后可交给许半仙继续解读。" : "感情、事业、财运皆可问。抽签后可查看签文、解签和 AI 延展。", 44, 160, 282, 13, "#776f65", 500, "left", "line-height:1.55;")}
      ${figBox(`wt${no}-count`, 270, 126, 72, 26, "", "border-radius:13px;background:#fff7e8;border:1px solid #ead8ae;")}
      ${figText(`wt${no}-count-text`, "剩余 1 次", 270, 133, 72, 11, "#9b742e", 800, "center")}
      ${figBox(`wt${no}-stage`, 32, 246, 326, 330, "", "border-radius:24px;background:#fff;box-shadow:0 14px 34px rgba(70,45,25,.11);overflow:hidden;")}
      ${figBox(`wt${no}-halo`, 96, 268, 198, 198, "", "border-radius:99px;background:radial-gradient(circle,rgba(215,172,70,.22),rgba(215,172,70,0) 68%);")}
      ${Array.from({ length: 18 }, (_, index) => {
        const x = 86 + index * 12 + (loading ? (index % 2) * 2 : 0);
        const y = loading ? 306 + (index % 5) * 4 : 296 + Math.abs(index - 9) * 3;
        const rotate = -12 + index * 1.2;
        return figBox(`wt${no}-stick-${index}`, x, y, 7, 184, "", `border-radius:4px;background:#f3d86d;transform:rotate(${rotate}deg);transform-origin:bottom center;`);
      }).join("")}
      ${figBox(`wt${no}-bucket`, 96, 454, 198, 126, "", "border-radius:6px 6px 22px 22px;background:linear-gradient(180deg,#ebe8e2,#ddd9d2);")}
      ${figText(`wt${no}-bucket-text`, loading ? "请稍候" : "黄大仙灵签", 0, 520, 390, 16, "#7f766b", 800, "center")}
      ${loading ? `
        ${figBox(`wt${no}-load-card`, 68, 612, 254, 76, "", "border-radius:18px;background:#1f1d1a;box-shadow:0 10px 22px rgba(20,15,10,.18);")}
        ${figText(`wt${no}-load-title`, "签文将现", 68, 628, 254, 16, "#fff", 800, "center")}
        ${figText(`wt${no}-load-copy`, "正在抽取第廿九签", 68, 655, 254, 12, "#f1d88a", 700, "center")}
      ` : `
        ${["感情", "事业", "财运"].map((text, index) => `
          ${figBox(`wt${no}-chip-${index}`, 64 + index * 88, 612, 72, 30, "", "border-radius:15px;background:#fff;border:1px solid #ead8ae;")}
          ${figText(`wt${no}-chip-text-${index}`, text, 64 + index * 88, 620, 72, 11, "#9b742e", 800, "center")}
        `).join("")}
        ${wentianGoldButton(`wt${no}`, "虔诚抽签", "screen-14", 690)}
      `}
    `;
  }
  if (no === 15) {
    return `
      ${figBox("wt15-bg", 0, 0, 390, 844, "", "background:#2a2928;")}
      ${wentianSimpleHeader("wt15", "", "◷")}
      ${figBox("wt15-card", 62, 150, 266, 446, "", "border-radius:10px;background:#111;box-shadow:0 16px 36px rgba(0,0,0,.32);")}
      ${figBox("wt15-paper", 92, 184, 206, 290, "", "border:2px solid #462b2b;border-radius:3px;background:#e98aa0;")}
      ${figText("wt15-paper-title", "黄大仙灵签", 104, 220, 120, 18, "#2b201d", 800, "center")}
      ${figText("wt15-poem", "遗定良缘\n乱转涡鱼\n性立盖守\n家奇得靖\n舞烟泛鹤\n燕上晚也", 128, 264, 90, 22, "#2b201d", 800, "center", "line-height:1.22;")}
      ${figBox("wt15-seal", 234, 202, 42, 42, "", "border:2px solid #332;border-radius:21px;background:rgba(255,255,255,.12);")}
      ${figText("wt15-seal-text", "灵", 234, 213, 42, 15, "#332", 800, "center")}
      ${figText("wt15-side-copy", "诚心祈愿\n一签一问", 242, 256, 40, 13, "#4b211f", 800, "center", "line-height:1.45;")}
      ${[0,1,2,3,4,5,6,7,8].map((idx) => {
        const x = 238 + (idx % 3) * 12;
        const y = 418 + Math.floor(idx / 3) * 12;
        return figBox(`wt15-qr-${idx}`, x, y, 8, 8, "", `background:${idx % 2 ? "#e98aa0" : "#2b201d"};`);
      }).join("")}
      ${figText("wt15-result", "第廿九签", 0, 506, 390, 20, "#d7a941", 800, "center")}
      ${figText("wt15-grade", "【中吉】", 0, 538, 390, 15, "#6fb866", 800, "center")}
      ${figText("wt15-tip", "点击签面查看详情", 0, 566, 390, 12, "#bbb3aa", 500, "center")}
      ${figButton("wt15-hit", 62, 150, 266, 446, 'data-route="screen-16"')}
    `;
  }
  if (no === 16) {
    const sections = [["签文", "岁岁休言悔，莫道定难改。"], ["解签", "眼前事宜先稳住心神，不急于求成。"], ["详情", "所问之事有转机，但需顺势而行。"], ["AI解签", "请许半仙结合命盘继续解读"]];
    return `
      ${figBox("wt16-bg", 0, 0, 390, 844, "", "background:#f7f7f6;")}
      ${wentianSimpleHeader("wt16", "第廿九签\n【中吉】", "◷")}
      ${sections.map(([title, desc], index) => {
        const y = index === 0 ? 110 : 214 + (index - 1) * 130;
        const h = index === 0 ? 80 : 104;
        return `
          ${figBox(`wt16-card-${index}`, 28, y, 334, h, "", "border-radius:12px;background:#fff;box-shadow:0 6px 18px rgba(70,45,25,.07);")}
          ${figText(`wt16-title-${index}`, title, 48, y + 18, 120, 15, "#25211d", 800)}
          ${figText(`wt16-desc-${index}`, desc, 48, y + 48, 284, 13, "#706a63", 500, "left", "line-height:1.55;")}
        `;
      }).join("")}
      ${wentianGoldButton("wt16", "让 AI 继续解读此签", "screen-4", 720)}
    `;
  }
  if (no >= 17 && no <= 19) {
    const count = no === 17 ? 0 : no === 18 ? 4 : 5;
    return `
      ${figBox(`wt${no}-bg`, 0, 0, 390, 844, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 52%,#f7f2ea 100%);")}
      ${wentianSimpleHeader(`wt${no}`, "起卦", "◷")}
      ${count === 0 ? `
        ${figBox(`wt${no}-intro`, 24, 88, 342, 76, "", "border-radius:16px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
        ${figText(`wt${no}-intro-title`, "六爻在线起卦", 44, 108, 150, 17, "#25211d", 800)}
        ${figText(`wt${no}-intro-copy`, "先定问题，再投铜钱。系统会生成本卦、变卦和 AI 解读入口。", 44, 136, 282, 12, "#7f766b", 500)}
      ` : ""}
      ${figBox(`wt${no}-card`, 24, count === 0 ? 184 : 126, 342, count === 0 ? 166 : 130, "", "border-radius:14px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText(`wt${no}-method`, "起卦方式", 42, count === 0 ? 206 : 148, 80, 14, "#7f766b", 700)}
      ${figBox(`wt${no}-method-a`, 42, count === 0 ? 236 : 178, 132, 32, "", "border-radius:16px;background:#fff8ec;border:1px solid #e0c98c;")}
      ${figText(`wt${no}-method-a-text`, "在线起卦", 42, count === 0 ? 245 : 187, 132, 12, "#a77721", 800, "center")}
      ${figBox(`wt${no}-method-b`, 190, count === 0 ? 236 : 178, 132, 32, "", "border-radius:16px;background:#f2ede8;")}
      ${figText(`wt${no}-method-b-text`, "手动起卦", 190, count === 0 ? 245 : 187, 132, 12, "#8f867b", 700, "center")}
      ${figText(`wt${no}-time-label`, "起卦时间", 42, count === 0 ? 284 : 226, 80, 13, "#7f766b")}
      ${figText(`wt${no}-time`, "公历 2026-05-12 15:20", 128, count === 0 ? 283 : 225, 160, 13, "#25211d", 700)}
      ${count === 0 ? figText(`wt${no}-question`, "所问：事业近期是否适合推进新计划？", 42, 318, 260, 13, "#7f766b") : ""}
      ${[0, 1, 2].map((idx) => wentianCoin(`wt${no}-coin-${idx}`, 94 + idx * 76, count === 0 ? 404 : 328, count > idx)).join("")}
      ${count ? wentianHexLines(`wt${no}`, 470, no === 19 ? 1 : 0) : ""}
      ${wentianGoldButton(`wt${no}`, count ? `投掷 ${count} 次` : "点击投掷铜钱", no === 19 ? "screen-20" : `screen-${no + 1}`, 724)}
    `;
  }
  if (no === 20) {
    const sections = [
      ["本卦：地风升", "升而有序，适合积累资源，稳步推进。此卦重在“循序”，先把基础铺实，再谈突破。"],
      ["变卦：风地观", "外部环境正在观察你是否稳定。少解释，多用结果证明判断。"],
      ["事业建议", "不要急于换道。先把手头筹码做厚，把一个小成果做成可复用的方法。"],
      ["关系建议", "关系中宜柔和沟通，避免强推。真正有效的推进来自耐心和边界。"],
      ["行动窗口", "未来三十日适合复盘、签约、修正计划；不宜仓促做高风险扩张。"]
    ];
    return `
      ${figBox("wt20-bg", 0, 0, 390, 1072, "", "background:#f7f7f6;")}
      ${wentianSimpleHeader("wt20", "地风升")}
      ${figBox("wt20-summary", 24, 100, 342, 160, "", "border-radius:14px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText("wt20-summary-title", "地风升", 44, 122, 120, 18, "#25211d", 800)}
      ${figText("wt20-summary-sub", "升而有序，先小后大", 44, 154, 180, 13, "#756d63", 600)}
      ${wentianHexLines("wt20-mini", 184, 1)}
      ${figBox("wt20-tag", 268, 120, 70, 28, "", "border-radius:14px;background:#fff8ec;border:1px solid #e0c98c;")}
      ${figText("wt20-tag-text", "事业问卦", 268, 128, 70, 11, "#a77721", 800, "center")}
      ${sections.map(([title, desc], index) => {
        const y = 288 + index * 126;
        return `
          ${figBox(`wt20-sec-${index}`, 24, y, 342, 102, "", "border-radius:12px;background:#fff;box-shadow:0 6px 16px rgba(70,45,25,.07);")}
          ${figText(`wt20-title-${index}`, title, 44, y + 18, 160, 15, "#25211d", 800)}
          ${figText(`wt20-desc-${index}`, desc, 44, y + 46, 286, 13, "#706a63", 500, "left", "line-height:1.5;")}
        `;
      }).join("")}
      ${figBox("wt20-ai", 24, 930, 342, 70, "", "border-radius:14px;background:#fff;box-shadow:0 6px 16px rgba(70,45,25,.07);")}
      ${figText("wt20-ai-title", "AI解卦", 44, 950, 100, 15, "#25211d", 800)}
      ${figText("wt20-ai-copy", "可让许半仙结合当前命盘继续解读此卦。", 44, 978, 260, 12, "#756d63")}
      ${wentianGoldButton("wt20", "购买完整解读", "screen-21", 1012)}
    `;
  }
  if (no === 21) {
    return `
      ${figBox("wt21-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt21", "地风升", "◷")}
      ${["本卦：地风升", "卦意", "事业建议", "关系建议"].map((title, index) => {
        const y = 112 + index * 110;
        return `
          ${figBox(`wt21-under-${index}`, 24, y, 342, 82, "", "border-radius:12px;background:#fff;box-shadow:0 6px 16px rgba(70,45,25,.07);")}
          ${figText(`wt21-under-title-${index}`, title, 44, y + 18, 150, 14, "#25211d", 800)}
          ${figText(`wt21-under-desc-${index}`, "购买完整解读后可查看详细分析。", 44, y + 46, 260, 12, "#756d63")}
        `;
      }).join("")}
      ${figBox("wt21-overlay", 0, 0, 390, 844, "", "background:rgba(0,0,0,.34);")}
      ${figBox("wt21-card", 36, 376, 318, 264, "", "border-radius:16px;background:#fff;box-shadow:0 16px 36px rgba(0,0,0,.18);")}
      ${figText("wt21-title", "对话次数已用尽", 0, 408, 390, 18, "#25211d", 800, "center")}
      ${figText("wt21-desc", "可通过开通会员、购买对话包或充值灵石继续深度解读。", 70, 450, 250, 13, "#756d63", 500, "center", "line-height:1.5;")}
      ${figBox("wt21-vip", 58, 510, 274, 38, "", "border-radius:6px;background:#d1a43b;")}
      ${figText("wt21-vip-text", "开通会员", 58, 520, 274, 13, "#fff", 800, "center")}
      ${figBox("wt21-buy", 58, 558, 274, 38, "", "border-radius:6px;background:#a73f35;")}
      ${figText("wt21-buy-text", "购买对话包", 58, 568, 274, 13, "#fff", 800, "center")}
      ${figBox("wt21-cancel", 58, 604, 274, 28, "", "border:1px solid #eadfce;border-radius:6px;background:#fff;")}
      ${figText("wt21-cancel-text", "取消", 58, 611, 274, 12, "#756d63", 700, "center")}
      ${figButton("wt21-pay-hit", 58, 558, 274, 38, 'data-route="screen-29"')}
    `;
  }
  if (no === 22) {
    return `
      ${figBox("wt22-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt22", "邀请好友")}
      ${figBox("wt22-top", 16, 94, 358, 92, "", "border-radius:12px;background:linear-gradient(135deg,#d5ad42,#9f741d);")}
      ${figText("wt22-num", "0", 80, 112, 80, 34, "#fff", 800)}
      ${figText("wt22-num-label", "邀请好友人数", 80, 152, 130, 13, "#fff6df", 600)}
      ${figBox("wt22-code", 16, 202, 358, 88, "", "border-radius:12px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText("wt22-code-title", "我的邀请码", 38, 220, 100, 13, "#8f867b", 700)}
      ${figText("wt22-code-num", "8 R 7 U 5 8 Z W", 60, 252, 210, 18, "#25211d", 800, "center")}
      ${["奖励规则", "邀请奖励", "收益记录"].map((title, index) => {
        const y = 318 + index * 112;
        return `
          ${figBox(`wt22-rule-${index}`, 16, y, 358, 94, "", "border-radius:12px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.07);")}
          ${figText(`wt22-rule-title-${index}`, title, 42, y + 20, 110, 15, "#25211d", 800)}
          ${figText(`wt22-rule-desc-${index}`, "好友注册后双方可获得灵石奖励，完成付费后可继续返利。", 42, y + 50, 278, 13, "#756d63", 500, "left", "line-height:1.45;")}
        `;
      }).join("")}
      ${sourceAppBottomNav("藏宝阁", 780)}
    `;
  }
  if (no === 23) {
    return `
      ${figBox("wt23-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt23", "活动中心")}
      ${[["邀请好友注册", "邀请好友注册，双方均可获得灵石奖励", "#d8ab3c"], ["邀请好友首次充值", "好友首次付费后，邀请人可获得额外奖励", "#f0a229"], ["每日签到", "连续签到获取灵石奖励", "#5fae95"]].map(([title, desc, color], index) => {
        const y = 112 + index * 118;
        return `
          ${figBox(`wt23-card-${index}`, 16, y, 358, 94, "", "border-radius:12px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.07);")}
          ${figBox(`wt23-icon-${index}`, 34, y + 18, 52, 52, "", `border-radius:26px;background:${color};`)}
          ${figText(`wt23-icon-text-${index}`, index === 0 ? "礼" : index === 1 ? "奖" : "签", 34, y + 34, 52, 15, "#fff", 800, "center")}
          ${figText(`wt23-title-${index}`, title, 104, y + 18, 150, 16, "#25211d", 800)}
          ${figText(`wt23-desc-${index}`, desc, 104, y + 46, 210, 13, "#756d63", 500)}
          ${figText(`wt23-arrow-${index}`, "›", 338, y + 34, 20, 20, "#c9bba6", 800, "center")}
        `;
      }).join("")}
    `;
  }
  if (no === 24) {
    return `
      ${figBox("wt24-bg", 0, 0, 390, 1180, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt24", "邀请好友")}
      ${figBox("wt24-hero", 24, 98, 342, 118, "", "border-radius:16px;background:linear-gradient(135deg,#d5ad42,#9f741d);box-shadow:0 12px 26px rgba(121,82,18,.18);")}
      ${figText("wt24-hero-num", "0", 54, 126, 80, 34, "#fff", 800)}
      ${figText("wt24-hero-label", "已邀请好友", 54, 168, 120, 13, "#fff7df", 700)}
      ${figBox("wt24-hero-badge", 246, 126, 82, 34, "", "border-radius:17px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.28);")}
      ${figText("wt24-hero-badge-text", "累计奖励 0", 246, 136, 82, 11, "#fff", 800, "center")}
      ${figText("wt24-hero-copy", "邀请好友注册问天AI，双方都可获得灵石与对话奖励。", 54, 190, 250, 12, "#fff5dc", 600)}

      ${figBox("wt24-code-card", 24, 240, 342, 130, "", "border-radius:14px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText("wt24-code-title", "我的邀请码", 44, 262, 110, 14, "#7f766b", 700)}
      ${figText("wt24-code", "8R7U58ZW", 44, 298, 178, 24, "#25211d", 900)}
      ${figBox("wt24-copy-code", 260, 285, 72, 34, "", "border-radius:17px;background:#d0a03a;")}
      ${figText("wt24-copy-code-text", "复制", 260, 295, 72, 12, "#fff", 800, "center")}
      ${figText("wt24-code-tip", "好友注册时填写邀请码即可绑定邀请关系", 44, 342, 250, 12, "#9a9289", 500)}

      ${figBox("wt24-link-card", 24, 394, 342, 138, "", "border-radius:14px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText("wt24-link-title", "我的邀请链接", 44, 416, 120, 14, "#25211d", 800)}
      ${figBox("wt24-link-box", 44, 454, 248, 38, "", "border-radius:9px;background:#fff7ec;border:1px solid #ead9bd;")}
      ${figText("wt24-link", "yuetianai.com/i/8R7U58ZW", 56, 466, 220, 11, "#7f766b", 600)}
      ${figBox("wt24-copy-link", 304, 454, 42, 38, "", "border-radius:9px;background:#25211d;")}
      ${figText("wt24-copy-link-text", "复制", 304, 466, 42, 11, "#fff", 800, "center")}
      ${figText("wt24-link-tip", "也可以直接分享链接给好友，系统自动识别。", 44, 506, 260, 12, "#9a9289", 500)}

      ${figBox("wt24-reward", 24, 556, 342, 288, "", "border-radius:14px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText("wt24-reward-title", "邀请奖励", 44, 580, 120, 16, "#25211d", 800)}
      ${[["好友注册", "可获得：5 灵石 + 2 次对话", "立即到账"], ["邀请满 3 人", "额外获得：会员体验券", "阶段奖励"], ["邀请满 10 人", "额外获得：高级报告券", "进阶奖励"]].map(([title, desc, tag], index) => {
        const y = 620 + index * 66;
        return `
          ${figBox(`wt24-reward-dot-${index}`, 44, y + 8, 9, 9, "", "border-radius:5px;background:#d0a03a;")}
          ${figText(`wt24-reward-name-${index}`, title, 68, y, 92, 14, "#25211d", 800)}
          ${figText(`wt24-reward-desc-${index}`, desc, 68, y + 24, 190, 12, "#7f766b", 500)}
          ${figBox(`wt24-reward-tag-${index}`, 262, y + 4, 70, 26, "", "border-radius:13px;background:#fff0d6;")}
          ${figText(`wt24-reward-tag-text-${index}`, tag, 262, y + 11, 70, 10, "#bd8624", 800, "center")}
        `;
      }).join("")}

      ${figBox("wt24-pay", 24, 868, 342, 118, "", "border-radius:14px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText("wt24-pay-title", "好友首次充值奖励", 44, 892, 150, 16, "#25211d", 800)}
      ${figText("wt24-pay-desc", "好友完成首次付费后，邀请人可额外获得 50 灵石。", 44, 926, 238, 13, "#756d63", 500, "left", "line-height:1.45;")}
      ${figBox("wt24-pay-badge", 284, 906, 52, 52, "", "border-radius:26px;background:#fff0d6;")}
      ${figText("wt24-pay-badge-text", "+50", 284, 922, 52, 16, "#bd8624", 900, "center")}

      ${figBox("wt24-record", 24, 1010, 342, 118, "", "border-radius:14px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText("wt24-record-title", "邀请记录", 44, 1034, 120, 16, "#25211d", 800)}
      ${figBox("wt24-empty-icon", 174, 1066, 42, 26, "", "border-radius:8px;background:#eee6db;")}
      ${figText("wt24-empty", "暂无邀请记录", 0, 1104, 390, 12, "#a59d94", 600, "center")}
    `;
  }
  if (no === 28) {
    return `
      ${figBox("wt28-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt28", "卡券包")}
      ${figText("wt28-sub", "可用的报告券", 0, 92, 390, 13, "#8d857b", 500, "center")}
      ${figBox("wt28-icon", 170, 332, 50, 36, "", "border-radius:6px;background:#d8d2ca;")}
      ${figBox("wt28-icon-cut", 188, 347, 14, 14, "", "border-radius:7px;background:#fbf7ef;")}
      ${figText("wt28-empty", "暂无可用", 0, 394, 390, 14, "#a19a91", 600, "center")}
    `;
  }
  if (no === 29) {
    return `
      ${figBox("wt29-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt29", "灵石充值")}
      ${figBox("wt29-balance", 24, 118, 342, 106, "", "border-radius:14px;background:linear-gradient(135deg,#2b2620,#16130f);box-shadow:0 12px 26px rgba(25,18,12,.18);")}
      ${figText("wt29-balance-label", "当前灵石", 48, 146, 110, 15, "#c9b887", 700)}
      ${figText("wt29-balance-num", "1", 48, 172, 80, 32, "#fff", 800)}
      ${figText("wt29-note", "灵石可以在藏宝阁兑换报告券/对话包", 48, 202, 250, 12, "#a69b8d")}
      ${figText("wt29-select", "选择充值套餐", 24, 254, 130, 16, "#25211d", 800)}
      ${[["120", "¥12", 24, 290], ["280", "¥28", 118, 290], ["580", "¥58", 212, 290], ["980", "¥98", 24, 388]].map(([stone, price, x, y], index) => `
        ${figBox(`wt29-plan-${index}`, x, y, index === 3 ? 342 : 82, 74, "", `border:1px solid ${index === 0 ? "#c8a65f" : "#eadfce"};border-radius:10px;background:#fff;`)}
        ${figText(`wt29-plan-stone-${index}`, stone, x, y + 18, index === 3 ? 342 : 82, 15, "#25211d", 800, "center")}
        ${figText(`wt29-plan-price-${index}`, price, x, y + 43, index === 3 ? 342 : 82, 12, "#8d857b", 600, "center")}
      `).join("")}
      ${figText("wt29-pay-title", "选择支付方式", 24, 510, 130, 16, "#25211d", 800)}
      ${figBox("wt29-alipay", 24, 548, 150, 42, "", "border:1px solid #c8a65f;border-radius:9px;background:#fff;")}
      ${figText("wt29-alipay-text", "支付宝", 24, 560, 150, 13, "#bd8624", 800, "center")}
      ${figBox("wt29-card", 196, 548, 150, 42, "", "border:1px solid #eadfce;border-radius:9px;background:#fff;")}
      ${figText("wt29-card-text", "信用卡", 196, 560, 150, 13, "#25211d", 700, "center")}
      ${figText("wt29-terms", "灵石仅限问天AI站内使用，充值后不支持退款", 0, 692, 390, 12, "#9e968d", 500, "center")}
      ${figBox("wt29-submit", 42, 736, 306, 50, "", "border-radius:9px;background:#c49a34;")}
      ${figButton("wt29-submit-hit", 42, 736, 306, 50, 'data-route="screen-30"')}
      ${figText("wt29-submit-text", "立即充值 ¥12", 42, 751, 306, 14, "#fff", 800, "center")}
    `;
  }
  if (no === 30) {
    return `
      ${figBox("wt30-bg", 0, 0, 390, 844, "", "background:#f3f4f7;")}
      ${figBox("wt30-browser", 20, 20, 218, 34, "", "border:2px solid #111;border-radius:8px;background:#fff;")}
      ${figText("wt30-browser-text", "UniPay", 52, 29, 90, 13, "#222", 700)}
      ${figText("wt30-icons", "○  ◰", 306, 26, 48, 16, "#111", 700, "center")}
      ${figBox("wt30-card", 28, 314, 334, 172, "", "border-radius:4px;background:#fff;")}
      ${figText("wt30-title", "订单信息", 52, 342, 110, 16, "#25211d", 800)}
      ${figText("wt30-id", "订单号　PAY_20260512_cfa12a1e", 52, 390, 240, 12, "#7d7670")}
      ${figText("wt30-price-label", "支付金额", 52, 428, 100, 13, "#7d7670")}
      ${figText("wt30-price", "¥12.00", 226, 424, 90, 20, "#145bdc", 800, "right")}
      ${figBox("wt30-pay", 52, 512, 286, 42, "", "border-radius:3px;background:#145bdc;")}
      ${figButton("wt30-pay-hit", 52, 512, 286, 42, 'data-route="screen-31"')}
      ${figText("wt30-pay-text", "确认支付 ¥12.00", 52, 524, 286, 13, "#fff", 800, "center")}
      ${figText("wt30-safe", "由支付服务商安全处理支付信息", 0, 578, 390, 11, "#a09a94", 500, "center")}
    `;
  }
  if (no === 33) {
    return `
      ${figBox("wt33-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt33", "问天会员")}
      ${figBox("wt33-card", 24, 108, 342, 110, "", "border-radius:14px;background:linear-gradient(135deg,#2b2722,#14110d);")}
      ${figText("wt33-card-title", "普通会员", 52, 138, 120, 19, "#fff", 800)}
      ${figText("wt33-card-sub", "开通后享专属权益", 52, 170, 160, 13, "#c7bda8", 600)}
      ${["命盘解析", "会员报告", "专属客服"].map((text, index) => `
        ${figBox(`wt33-right-${index}`, 40 + index * 105, 252, 78, 70, "", "border-radius:10px;background:#fff;")}
        ${figText(`wt33-right-icon-${index}`, index === 0 ? "◇" : index === 1 ? "▤" : "♛", 40 + index * 105, 270, 78, 20, "#c49a34", 800, "center")}
        ${figText(`wt33-right-text-${index}`, text, 40 + index * 105, 298, 78, 12, "#25211d", 700, "center")}
      `).join("")}
      ${figText("wt33-plan-title", "选择套餐", 24, 354, 120, 16, "#25211d", 800)}
      ${figBox("wt33-month", 24, 392, 160, 94, "", "border:1px solid #c8a65f;border-radius:12px;background:#fffaf0;")}
      ${figText("wt33-month-title", "月度会员", 44, 414, 90, 15, "#25211d", 800)}
      ${figText("wt33-month-price", "¥38", 44, 444, 90, 18, "#bd8624", 800)}
      ${figBox("wt33-year", 206, 392, 160, 94, "", "border:1px solid #eadfce;border-radius:12px;background:#fff;")}
      ${figText("wt33-year-title", "年度会员", 226, 414, 90, 15, "#25211d", 800)}
      ${figText("wt33-year-price", "¥348", 226, 444, 90, 18, "#bd8624", 800)}
      ${figBox("wt33-benefit", 24, 516, 342, 130, "", "border-radius:12px;background:#fff;")}
      ${figText("wt33-benefit-title", "会员权益", 44, 538, 120, 15, "#25211d", 800)}
      ${figText("wt33-benefit-list", "1. 每月赠送灵石\\n2. 解锁会员专属报告\\n3. 享受AI问答优先通道", 44, 572, 260, 13, "#756d63", 500, "left", "line-height:1.8;")}
      ${figBox("wt33-submit", 42, 736, 306, 50, "", "border-radius:25px;background:#c49a34;")}
      ${figButton("wt33-submit-hit", 42, 736, 306, 50, 'data-route="screen-30"')}
      ${figText("wt33-submit-text", "立即开通 ¥38", 42, 751, 306, 14, "#fff", 800, "center")}
    `;
  }
  if (no === 34) {
    return `
      ${sourceMineScreen(screen)}
      ${figBox("wt34-overlay", 0, 0, 390, 844, "", "background:rgba(0,0,0,.3);")}
      ${figBox("wt34-sheet", 0, 574, 390, 270, "", "border-radius:22px 22px 0 0;background:#fff;")}
      ${figText("wt34-title", "分享文本", 0, 602, 390, 18, "#25211d", 800, "center")}
      ${figText("wt34-close", "×", 334, 600, 28, 24, "#25211d", 400, "center")}
      ${figBox("wt34-copy", 28, 644, 334, 72, "", "border-radius:10px;background:#fbf7ef;border:1px solid #eadfce;")}
      ${figText("wt34-copy-text", "推荐你使用问天AI，AI智能和八字分析平台，为你解读命运密码。使用我的邀请码：8R7U58ZW", 44, 658, 280, 13, "#756d63", 500, "left", "line-height:1.45;")}
      ${["微信好友", "朋友圈", "Chrome", "邮件"].map((text, index) => `
        ${figBox(`wt34-share-${index}`, 38 + index * 82, 742, 42, 42, "", "border-radius:21px;background:#f5ead4;")}
        ${figText(`wt34-share-icon-${index}`, index === 0 ? "微" : index === 1 ? "圈" : index === 2 ? "C" : "邮", 38 + index * 82, 755, 42, 14, "#bd8624", 800, "center")}
        ${figText(`wt34-share-text-${index}`, text, 28 + index * 82, 794, 62, 11, "#756d63", 600, "center")}
      `).join("")}
    `;
  }
  if (no === 35) {
    return `
      ${figBox("wt35-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt35", "联系我们")}
      ${[["电子邮箱", "support@yuetianai.com", "✉"], ["小红书", "问天AI命理小助手", "♡"], ["微信公众号", "悦天AI公众号", "微"], ["X", "关注我们的推特", "𝕏"]].map(([title, desc, icon], index) => {
        const y = 128 + index * 78;
        return `
          ${figBox(`wt35-row-${index}`, 24, y, 342, 56, "", "border-radius:12px;background:#fff;box-shadow:0 6px 16px rgba(70,45,25,.07);")}
          ${figText(`wt35-icon-${index}`, icon, 42, y + 16, 24, 14, "#bd8624", 800, "center")}
          ${figText(`wt35-title-${index}`, title, 82, y + 12, 120, 14, "#25211d", 800)}
          ${figText(`wt35-desc-${index}`, desc, 82, y + 32, 180, 11, "#8d857b", 500)}
          ${figText(`wt35-arrow-${index}`, "›", 330, y + 17, 20, 18, "#c9bba6", 800, "center")}
        `;
      }).join("")}
    `;
  }
  if (no === 36) {
    return `
      ${figBox("wt36-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt36", "关于我们")}
      ${figBox("wt36-logo", 158, 126, 74, 74, "", "border-radius:18px;background:#1e1712;")}
      ${figText("wt36-logo-text", "问天AI", 158, 152, 74, 16, "#d6ad3e", 800, "center")}
      ${figText("wt36-name", "问天AI", 0, 230, 390, 20, "#25211d", 800, "center")}
      ${figText("wt36-version", "v1.0.3199", 0, 260, 390, 12, "#8d857b", 600, "center")}
      ${figText("wt36-desc", "问天AI是一款手机端命理排盘、合盘、抽签与AI解读工具，帮你把复杂命理信息转成可理解、可行动的建议。", 54, 304, 282, 14, "#756d63", 500, "center", "line-height:1.65;")}
      ${["隐私协议", "用户协议", "检查更新"].map((title, index) => {
        const y = 466 + index * 70;
        return `
          ${figBox(`wt36-row-${index}`, 24, y, 342, 54, "", "border-radius:12px;background:#fff;box-shadow:0 6px 16px rgba(70,45,25,.06);")}
          ${figText(`wt36-title-${index}`, title, 58, y + 16, 160, 14, "#25211d", 800)}
          ${figText(`wt36-arrow-${index}`, "›", 330, y + 16, 20, 18, "#c9bba6", 800, "center")}
        `;
      }).join("")}
      ${figText("wt36-copy", "© 2026 YUETIAN AI All Rights Reserved", 0, 742, 390, 11, "#b4ada5", 500, "center")}
    `;
  }
  return "";
}

function convertedSpecial(screen) {
  if (screen.no === 1) {
    return `
      ${figText("screen-1-hero-title", "授权书", 0, 92, 390, 22, "#26211c", 700, "center")}
      ${figText("screen-1-auth-copy", "本人授权问天AI依据输入资料生成排盘、合盘\\n与AI解读。\\n\\n签署人：谢广周 / 2026-05-11", 42, 150, 306, 15, "#26211c", 400, "left", "line-height:1.35;")}
      ${figBox("screen-1-seal", 226, 520, 90, 90, "", "border-radius:45px;background:#a13824;")}
      ${figText("screen-1-seal-text", "已授权", 228, 552, 86, 18, "#fff", 700, "center")}
    `;
  }
  if (screen.ai === "modal") return convertedAi(screen) + convertedModal(screen);
  if (screen.ai) return convertedAi(screen);
  if (screen.modalTitle) return convertedModal(screen);
  if (screen.form) return convertedForm(screen);
  if (screen.sections) return convertedSections(screen);
  if (screen.list) return convertedList(screen);
  if (screen.recharge) {
    return `
      ${figBox("recharge-current", 42, 112, 306, 80, "converted-card", "")}
      ${figText("recharge-current-title", "当前灵石", 68, 138, 160, 18, "#26211c", 700)}
      ${figText("recharge-current-count", "1", 250, 132, 60, 26, "#b88c33", 700, "center")}
      ${[["120 ¥12", 42, 220], ["280 ¥28", 146, 220], ["580 ¥58", 250, 220], ["980 ¥98", 42, 332]].map(([label, x, y], index) => `
        ${figBox(`recharge-plan-${index}`, x, y, index === 3 ? 306 : 92, 86, "converted-card", index === 0 ? "border-color:#b88c33;" : "")}
        ${figText(`recharge-plan-text-${index}`, label, x + 8, y + 28, index === 3 ? 290 : 76, 16, index === 0 ? "#b88c33" : "#26211c", 700, "center")}
      `).join("")}
      ${figText("recharge-pay-title", "选择支付方式", 42, 462, 220, 18, "#26211c", 700)}
      ${figBox("recharge-alipay", 42, 508, 140, 44, "converted-card", "border-color:#b88c33;")}
      ${figText("recharge-alipay-text", "支付宝", 42, 520, 140, 14, "#b88c33", 500, "center")}
      ${figBox("recharge-card", 202, 508, 140, 44, "converted-card", "")}
      ${figText("recharge-card-text", "信用卡", 202, 520, 140, 14, "#26211c", 500, "center")}
    `;
  }
  if (screen.mine) {
    return `
      ${figBox("mine-profile", 24, 112, 342, 86, "converted-card", "")}
      ${figText("mine-name", "谢广周", 40, 126, 310, 15, "#26211c", 700)}
      ${figText("mine-meta", "普通会员 / 账号信息", 40, 154, 310, 12, "#8c8275")}
      ${[["问天会员", "screen-33"], ["灵石充值", "screen-29"], ["我的报告", "screen-27"], ["订单记录", "screen-30"], ["邀请好友", "screen-22"], ["语言设置", "screen-37"], ["分享问天AI", "screen-34"], ["联系我们", "screen-35"]].map(([label, route], index) => {
        const y = 224 + index * 54;
        return `
          ${figBox(`mine-row-${index}`, 24, y, 342, 42, "converted-card", "border-radius:8px;")}
          ${figButton(`mine-row-hit-${index}`, 24, y, 342, 42, `data-route="${route}"`)}
          ${figText(`mine-row-text-${index}`, label, 40, y + 14, 280, 15, "#26211c")}
          ${figText(`mine-row-arrow-${index}`, "›", 330, y + 12, 20, 16, "#8c8275", 700, "center")}
        `;
      }).join("")}
    `;
  }
  if (screen.chart) {
    return Array.from({ length: 12 }, (_, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      return `
        ${figBox(`chart-cell-${index}`, 34 + col * 108, 126 + row * 108, 98, 98, "converted-card", "border-radius:10px;")}
        ${figText(`chart-cell-title-${index}`, ["命宫","兄弟","夫妻","子女","财帛","疾厄","迁移","仆役","官禄","田宅","福德","父母"][index], 42 + col * 108, 136 + row * 108, 82, 13, "#26211c", 700, "center")}
        ${figText(`chart-cell-stars-${index}`, "紫微 天府\\n文昌 禄存", 42 + col * 108, 164 + row * 108, 82, 11, "#8c8275", 400, "center")}
      `;
    }).join("");
  }
  return convertedCards(screen);
}

function sourceDashboardHomeScreen() {
  return `
    ${figBox("source-1-bg", 0, 0, 390, 1831, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 50%,#faf5ed 100%);")}
    ${figBox("source-1-avatar", 18, 24, 44, 44, "", "border-radius:22px;background:#f4ead8;box-shadow:0 6px 16px rgba(188,142,59,.12);")}
    ${figBox("source-1-avatar-head", 33, 36, 12, 12, "", "border-radius:6px;background:#c58d25;")}
    ${figBox("source-1-avatar-body", 27, 52, 24, 13, "", "border-radius:12px 12px 5px 5px;background:#c58d25;")}
    ${figText("source-1-greet", "谢广周，安好", 78, 28, 175, 20, "#25221f", 800)}
    ${figText("source-1-date", "2026年三月廿七", 78, 53, 150, 14, "#8d877e", 500)}
    ${figBox("source-1-chart-pill", 294, 32, 78, 32, "", "border-radius:18px;background:#f3eadc;box-shadow:0 7px 16px rgba(190,142,45,.12);")}
    ${figText("source-1-chart-text", "✦ 排盘", 306, 39, 54, 16, "#bd8624", 800, "center")}

    ${figBox("source-1-mood-card", 18, 98, 354, 216, "converted-card", "border-radius:16px;box-shadow:0 10px 24px rgba(70,45,25,.13);")}
    ${figText("source-1-mood-label", "今日心情", 36, 137, 82, 19, "#26211c", 700)}
    ${figText("source-1-mood-score", "73", 116, 116, 58, 42, "#26211c", 800)}
    ${figText("source-1-mood-unit", "分", 164, 144, 20, 13, "#26211c", 700)}
    ${figBox("source-1-score-swish-a", 116, 161, 78, 7, "", "border-radius:999px;background:#e5bf91;transform:rotate(-12deg);opacity:.9;")}
    ${figBox("source-1-score-swish-b", 150, 167, 62, 5, "", "border-radius:999px;background:#ead8bd;transform:rotate(-12deg);opacity:.72;")}
    ${figText("source-1-mood-copy", "灵感迸发的一天，\n无论是吸收新知…", 36, 181, 132, 14, "#9a938a", 500, "left", "line-height:1.35;")}
    ${[["爱情", 62, 178, "#ed7385"], ["财富", 48, 220, "#c58a2c"], ["事业", 78, 262, "#4e9b93"], ["学习", 78, 304, "#4f82a4"], ["人际", 75, 346, "#9e698c"]].map(([label, score, x, color]) => {
      const h = 22 + Number(score) * 0.32;
      return `
        ${figBox(`source-1-meter-bg-${label}`, x, 119, 8, 60, "", "border-radius:8px;background:#f2efea;")}
        ${figBox(`source-1-meter-${label}`, x, 178 - h, 8, h, "", `border-radius:8px;background:${color};`)}
        ${figText(`source-1-meter-score-${label}`, score, x - 10, 197, 28, 16, "#26211c", 700, "center")}
        ${figText(`source-1-meter-label-${label}`, label, x - 14, 226, 36, 12, "#928b83", 500, "center")}
      `;
    }).join("")}
    ${figBox("source-1-ask", 48, 249, 295, 45, "", "border:1px solid #eadfce;border-radius:22px;background:#fff;")}
    ${figText("source-1-ask-icon", "♙", 60, 263, 22, 18, "#b98729", 700, "center")}
    ${figText("source-1-ask-text", "今日运势如何？事业感情有何指\n引？", 84, 258, 220, 15, "#8f887f", 500, "left", "line-height:1.25;")}
    ${figBox("source-1-ask-send", 315, 254, 36, 36, "", "border-radius:18px;background:#c08a2c;")}
    ${figText("source-1-ask-arrow", "↑", 315, 260, 36, 24, "#fff", 800, "center")}

    ${figBox("source-1-report-card", 18, 342, 318, 157, "converted-card", "border-radius:16px;box-shadow:0 10px 24px rgba(70,45,25,.12);")}
    ${figBox("source-1-report-hot", 38, 371, 39, 22, "", "border-radius:7px;background:#fbf1dd;")}
    ${figText("source-1-report-hot-text", "热门", 46, 376, 24, 11, "#b98729", 700, "center")}
    ${figText("source-1-report-icon", "▧", 292, 362, 22, 20, "#b98729", 700, "center")}
    ${figText("source-1-report-title", "万言命书", 36, 399, 150, 23, "#25221f", 800)}
    ${figText("source-1-report-sub", "逾万字的深度报告，涵盖性格逻辑、事业财富…", 36, 431, 250, 13, "#9a938a", 500)}
    ${figText("source-1-report-tags", "● 事业财运    ● 感情婚姻", 36, 468, 160, 13, "#a98745", 600)}
    ${figBox("source-1-report-btn", 220, 453, 104, 34, "", "border-radius:18px;background:#c08a2c;")}
    ${figText("source-1-report-btn-text", "立即解锁 →", 236, 462, 72, 13, "#fff", 700, "center")}
    ${figBox("source-1-report-next", 348, 342, 42, 157, "", "border-radius:16px 0 0 16px;background:#251f1a;")}
    ${figText("source-1-report-next-tag", "推荐", 358, 370, 24, 12, "#c08a2c", 700, "center")}
    ${figText("source-1-report-next-title", "问\n天", 356, 422, 28, 23, "#c08a2c", 800, "center", "line-height:1.05;")}
    ${figText("source-1-report-dots", "●  ●", 184, 514, 28, 8, "#bdb5aa", 700, "center")}

    ${figText("source-1-recommend-title", "为你推荐", 18, 548, 130, 22, "#25221f", 800)}
    ${figBox("source-1-master-1", 18, 580, 354, 274, "converted-card", "border-radius:16px;overflow:hidden;box-shadow:0 10px 24px rgba(70,45,25,.13);")}
    ${figImage("source-1-master-img-1", "../images/wentian-prototype-assets/xu-banxian.jpg", 18, 580, 354, 184, "border-radius:16px 16px 0 0;object-fit:cover;object-position:center 20%;")}
    ${figBox("source-1-master-shade", 18, 708, 354, 56, "", "background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.32));")}
    ${figText("source-1-master-name-1", "许半仙", 36, 782, 132, 24, "#25221f", 800)}
    ${figText("source-1-master-desc-1", "紫微命盘专属解析，已接入当前档案", 36, 812, 230, 14, "#91897f", 500)}
    ${figBox("source-1-chip-1a", 36, 835, 70, 24, "", "border-radius:12px;background:#f8f3ea;border:1px solid #efe4d2;")}
    ${figText("source-1-chip-1a-text", "紫微命盘", 44, 841, 54, 11, "#b2822e", 700, "center")}
    ${figBox("source-1-chip-1b", 118, 835, 62, 24, "", "border-radius:12px;background:#f8f3ea;border:1px solid #efe4d2;")}
    ${figText("source-1-chip-1b-text", "AI解析", 125, 841, 48, 11, "#b2822e", 700, "center")}
    ${figBox("source-1-master-go", 278, 807, 72, 36, "", "border-radius:18px;background:#c08a2c;")}
    ${figText("source-1-master-go-text", "去问他", 286, 817, 56, 13, "#fff", 700, "center")}

    ${[["合盘分析", "命理相合，缘分几许", "01-feature-hepan.png", "screen-10", 875], ["黄大仙灵签", "求签问卦，指引方向", "01-feature-qian.png", "screen-13", 984], ["六爻占卜", "铜钱起卦，纳甲解卦", "01-feature-gua.png", "screen-17", 1093], ["万年历", "每日宜忌，趋吉避凶", "01-feature-li.png", "screen-23", 1202], ["阳宅地脉", "罗盘九宫，安位解读", "01-feature-gua.png", "screen-42", 1311]].map(([title, sub, icon, route, y], index) => `
      ${figBox(`source-1-feature-${index}`, 18, y, 354, 96, "converted-card", "border-radius:14px;box-shadow:0 8px 20px rgba(70,45,25,.1);background:#fffdfb;")}
      ${figText(`source-1-feature-title-${index}`, title, 36, y + 30, 150, 21, "#25221f", 800)}
      ${figText(`source-1-feature-sub-${index}`, sub, 36, y + 58, 190, 14, "#969087", 500)}
      ${figImage(`source-1-feature-icon-${index}`, `../images/wentian-prototype-assets/${icon}`, 286, y + 10, 72, 76, "object-fit:contain;")}
      ${figButton(`source-1-feature-hit-${index}`, 18, y, 354, 96, `data-route="${route}"`)}
    `).join("")}
    ${figText("source-1-more-title", "更多功能", 18, 1438, 130, 22, "#25221f", 800)}
    ${[["邀请好友", "邀请好友双方获得奖励", "01-extra-invite.png", "screen-22", 1488], ["活动中心", "参与活动赢取丰厚奖励", "01-extra-activity.png", "screen-23", 1612]].map(([title, sub, icon, route, y], index) => `
      ${figBox(`source-1-extra-${index}`, 18, y, 354, 104, "converted-card", "border-radius:14px;box-shadow:0 8px 20px rgba(70,45,25,.1);")}
      ${figText(`source-1-extra-title-${index}`, title, 36, y + 31, 150, 21, "#25221f", 800)}
      ${figText(`source-1-extra-sub-${index}`, sub, 36, y + 61, 210, 14, "#969087", 500)}
      ${figImage(`source-1-extra-icon-${index}`, `../images/wentian-prototype-assets/${icon}`, 300, y + 36, 52, 50, "object-fit:contain;")}
      ${figButton(`source-1-extra-hit-${index}`, 18, y, 354, 104, `data-route="${route}"`)}
    `).join("")}
    ${sourceAppBottomNav("首页", 1748)}
  `;
}

function convertedButton(screen) {
  if (!screen.button) return "";
  const [label, route] = screen.button;
  return `
    ${figBox(`screen-${screen.no}-bottom-button`, 56, 746, 278, 44, "converted-button", "")}
    ${figButton(`screen-${screen.no}-bottom-hit`, 56, 746, 278, 44, `data-route="${route}"`)}
    ${figText(`screen-${screen.no}-bottom-label`, label, 56, 758, 278, 13, "#fff", 500, "center")}
  `;
}

function convertedFlowHotspots(screen) {
  return (screenFlowHotspots[screen.no] || []).map(([x, y, w, h, route], index) =>
    figButton(`screen-${screen.no}-flow-${index}`, x, y, w, h, `data-route="${route}"`, "flow-hotspot", "z-index:30;")
  ).join("");
}

function sourceChartFormScreen() {
  return `
    ${figBox("source-26-bg", 0, 0, 390, 867, "", "background:#fbf7ef;")}
    ${figButton("source-26-back-hit", 18, 40, 96, 54, 'data-action="back"')}
    ${figText("source-26-back", "‹ 返回", 28, 53, 92, 28, "#9f2417", 500)}
    ${figText("source-26-title", "排盘", 0, 58, 390, 26, "#1f1d1a", 800, "center")}

    ${figText("source-26-heading", "请输入出生信息", 0, 118, 390, 25, "#1f1d1a", 800, "center")}
    ${figText("source-26-subtitle", "准确的出生时间是算命的根基", 0, 157, 390, 17, "#5f5a52", 400, "center")}
    ${figBox("source-26-card", 22, 198, 346, 383, "", "border:1px solid #ded9d0;border-radius:16px;background:#fff;box-shadow:0 4px 12px rgba(70,45,25,.03);")}
    ${figText("source-26-name-label", "姓名", 38, 226, 80, 20, "#3a3834", 400)}
    <input id="wentian-chart-name" class="wentian-chart-input" style="left:160px;top:213px;width:192px" placeholder="请输入姓名（选填）" autocomplete="off">
    ${figLine("source-26-line-1", 38, 265, 314, "#dedbd6")}
    ${figText("source-26-gender-label", "性别", 38, 297, 80, 20, "#3a3834", 400)}
    <select id="wentian-chart-gender" class="wentian-chart-select" style="left:242px;top:283px;width:110px">
      <option value="male">男</option>
      <option value="female">女</option>
    </select>
    ${figLine("source-26-line-2", 38, 340, 314, "#dedbd6")}
    ${figText("source-26-type-label", "排盘类型", 38, 371, 110, 20, "#3a3834", 400)}
    <select id="wentian-chart-type" class="wentian-chart-select" style="left:216px;top:356px;width:136px">
      <option value="ziwei">紫微</option>
      <option value="bazi">八字</option>
    </select>
    ${figLine("source-26-line-3", 38, 411, 314, "#dedbd6")}
    ${figText("source-26-date-label", "出生日期", 38, 441, 110, 20, "#3a3834", 400)}
    <input id="wentian-chart-date" class="wentian-chart-input" type="datetime-local" style="left:158px;top:428px;width:194px" value="2026-05-12T15:21">
    ${figLine("source-26-line-4", 38, 465, 314, "#dedbd6")}
    ${figText("source-26-place-label", "出生地点", 38, 489, 110, 20, "#3a3834", 400)}
    <input id="wentian-chart-city" class="wentian-chart-input" style="left:170px;top:476px;width:182px" placeholder="选择出生地点" autocomplete="off">
    ${figLine("source-26-line-5", 38, 518, 314, "#dedbd6")}
    ${figText("source-26-solar-label", "使用真太阳时", 38, 548, 140, 20, "#8d8982", 400)}
    <label class="wentian-chart-toggle" style="left:306px;top:541px"><input id="wentian-chart-true-solar" type="checkbox"><span></span></label>

    ${figBox("source-26-submit", 22, 606, 346, 58, "", "border-radius:13px;background:linear-gradient(180deg,#a52705,#be3f2e);box-shadow:0 8px 18px rgba(159,36,23,.18);")}
    ${figButton("source-26-submit-hit", 22, 606, 346, 58, 'data-action="wentian-chart-submit"')}
    ${figText("source-26-submit-text", "◉  开始排盘", 0, 622, 390, 26, "#fff", 700, "center")}
    <div id="wentian-chart-status" class="wentian-chart-status"></div>
    ${figBox("source-26-tip", 22, 692, 346, 68, "", "border-radius:12px;background:#f8f1e3;")}
    ${figText("source-26-tip-icon", "i", 42, 716, 26, 18, "#c8a65f", 800, "center")}
    ${figText("source-26-tip-text", "如不知时辰，可能会导致推演不准确。可以让\nAI命理师确定时辰", 70, 708, 290, 15, "#6e675d", 400, "left", "line-height:1.45;")}
  `;
}

function getWentianDisplayChartState() {
  const saved = getWentianSavedChart();
  if (saved?.chart && saved?.chartData) return saved;
  return null;
}

function getWentianClassicMutagenClass(mutagen = "") {
  if (String(mutagen).includes("禄")) return "fc-mutagen-lu";
  if (String(mutagen).includes("权")) return "fc-mutagen-quan";
  if (String(mutagen).includes("科")) return "fc-mutagen-ke";
  if (String(mutagen).includes("忌")) return "fc-mutagen-ji";
  return "";
}

function getWentianClassicStarText(star) {
  if (!star) return "";
  if (typeof star === "string") return star;
  return `${star.name || ""}${star.brightness || ""}`;
}

function getWentianClassicRange(palace) {
  const range = palace?.decadal?.range;
  if (Array.isArray(range)) return `${range[0]}-${range[1]}`;
  return range || "";
}

function renderWentianClassicPalaceCell(palace, activeBranch) {
  if (!palace) return "";
  const branch = palace.earthlyBranch || palace.branch || "";
  const pos = WENTIAN_BRANCH_POSITIONS[branch];
  if (!pos) return "";
  const [col, row] = pos;
  const activeIndex = Math.max(0, WENTIAN_SHICHEN.indexOf(activeBranch));
  const related = [WENTIAN_SHICHEN[(activeIndex + 4) % 12], WENTIAN_SHICHEN[(activeIndex + 8) % 12], WENTIAN_SHICHEN[(activeIndex + 6) % 12]];
  const isBen = branch === activeBranch;
  const isRel = !isBen && related.includes(branch);
  const allStars = [
    ...(palace.majorStars || []),
    ...(palace.minorStars || []),
    ...(palace.adjectiveStars || palace.adjStars || []),
  ];
  const mutagenHtml = allStars
    .filter((star) => star?.mutagen)
    .map((star) => `<span class="fc-pal-mutagen ${getWentianClassicMutagenClass(star.mutagen)}">${escapeHtml(star.mutagen)}</span>`)
    .join("");
  const majorHtml = (palace.majorStars || [])
    .map((star) => `<div class="fc-major-star">${escapeHtml(getWentianClassicStarText(star))}</div>`)
    .join("") || `<div class="fc-major-star is-empty">空宫</div>`;
  const minorHtml = [
    ...(palace.minorStars || []),
    ...(palace.adjectiveStars || palace.adjStars || []),
  ].slice(0, 5).map((star) => `<div class="fc-minor-star">${escapeHtml(getWentianClassicStarText(star))}</div>`).join("");
  const shenHtml = [palace.changsheng12, palace.boshi12].filter(Boolean).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const palaceName = `${palace.isBodyPalace ? "身宫\n" : ""}${palace.name || ""}`;
  return `
    <div class="fc-cell ${isBen ? "fc-ben" : isRel ? "fc-rel" : ""}" style="grid-column:${col + 1};grid-row:${row + 1};">
      <div class="fc-cell-top">
        ${mutagenHtml ? `<div class="fc-cell-mutagen">${mutagenHtml}</div>` : ""}
        <div class="fc-major-list">${majorHtml}</div>
        <div class="fc-minor-list">${minorHtml}</div>
      </div>
      <div class="fc-cell-bottom">
        <div class="fc-shen-list">${shenHtml}</div>
        <div class="fc-palace-info">
          <span class="fc-branch">${escapeHtml(`${palace.heavenlyStem || ""}${branch}`)}</span>
          <span class="fc-age">${escapeHtml(getWentianClassicRange(palace))}</span>
          <span class="fc-palace-name">${escapeHtml(palaceName)}</span>
        </div>
      </div>
    </div>`;
}

function renderWentianClassicCenter(chart, chartData, form) {
  const pillars = chartData?.sizhu || extractWentianPillars(chart);
  const genderLabel = form.gender === "female" ? "阴女" : "阳男";
  const titleName = escapeHtml(form.name || "命主");
  const dateText = (form.datetime || chartData?.birthDate || chart?.solarDate || "").replace("T", " ").replace(/:00$/, "");
  const timeIndex = Number(chartData?.timeIndex);
  const timeName = WENTIAN_SHICHEN[Number.isFinite(timeIndex) ? timeIndex : getWentianTimeIndex(new Date(form.datetime || Date.now()).getHours(), new Date(form.datetime || Date.now()).getMinutes())] || "";
  const columns = [
    [pillars.yearStem, pillars.yearBranch, "#886a4a"],
    [pillars.monthStem, pillars.monthBranch, "#4d7a5b"],
    [pillars.dayStem, pillars.dayBranch, "#9b4238"],
    [pillars.hourStem, pillars.hourBranch, "#476885"],
  ];
  return `
    <div class="fc-center-panel" style="grid-column:2 / 4;grid-row:2 / 4;">
      <div class="fc-center-title">命主</div>
      <div class="fc-center-meta"><span class="fc-center-name">${titleName}</span><span>${escapeHtml(genderLabel)}</span></div>
      <div class="fc-center-rows">
        <div class="fc-center-row"><span class="fc-center-lbl">公历</span><span class="fc-center-val">${escapeHtml(dateText || "—")}</span></div>
        <div class="fc-center-row"><span class="fc-center-lbl">农历</span><span class="fc-center-val">${escapeHtml(chart?.lunarDate || chart?.chineseDate || "—")}</span></div>
        <div class="fc-center-row"><span class="fc-center-lbl">时辰</span><span class="fc-center-val">${escapeHtml(timeName ? `${timeName}时` : "—")}</span></div>
        <div class="fc-center-row"><span class="fc-center-lbl">局数</span><span class="fc-center-val">${escapeHtml(chart?.fiveElementsClass || "—")}</span></div>
      </div>
      <div class="fc-sizhu">
        ${columns.map(([stem, branch, color]) => (stem || branch) ? `<div class="fc-sizhu-col" style="color:${color}"><span>${escapeHtml(stem || "?")}</span><span>${escapeHtml(branch || "?")}</span></div>` : "").join("")}
      </div>
      <div class="wentian-fc-note">命宫 ${escapeHtml(chart?.earthlyBranchOfSoulPalace || "—")} · 身宫 ${escapeHtml(chart?.earthlyBranchOfBodyPalace || "—")} · 已接入</div>
    </div>`;
}

function renderWentianClassicChart(saved) {
  const chart = saved.chart;
  const form = saved.form || {};
  const chartData = saved.chartData || buildWentianChartPayload(chart, {
    gender: form.gender || "male",
    date: form.datetime ? new Date(form.datetime) : null,
    city: form.city || "",
  });
  const activeBranch = chart.earthlyBranchOfSoulPalace || (chart.palaces || []).find((p) => p.name === "命宫")?.earthlyBranch || "卯";
  return `
    <div class="wentian-native-mingpan" data-node-id="source-27-native-chart">
      <div class="fc-card">
        <div class="fc-grid-wrap">
          <div class="fc-grid">
            ${(chart.palaces || []).map((palace) => renderWentianClassicPalaceCell(palace, activeBranch)).join("")}
            ${renderWentianClassicCenter(chart, chartData, form)}
          </div>
        </div>
      </div>
    </div>`;
}

function getWentianFallbackChartState() {
  const palaceRows = [
    ["癸巳", "天同", "子女", "禄存", "96-105", "大子"],
    ["甲午", "武曲 天府", "夫妻", "擎羊 左辅", "106-115", "大夫"],
    ["乙未", "太阳 太阴", "兄弟", "地劫", "116-125", "大兄"],
    ["丙申", "贪狼", "命宫", "天马 右弼", "6-15", "大命"],
    ["壬辰", "破军", "财帛", "陀罗", "86-95", "大财"],
    ["丁酉", "天机 巨门", "父母", "火星 天钺", "16-25", "大父"],
    ["辛卯", "", "疾厄", "地空", "76-85", "大疾"],
    ["戊戌", "紫微 天相", "福德", "得 得", "26-35", "大福"],
    ["庚寅", "廉贞", "迁移", "文昌", "66-75", "大迁"],
    ["辛丑", "", "仆役", "", "56-65", "大仆"],
    ["庚子", "七杀", "官禄", "文曲", "46-55", "大官"],
    ["己亥", "天梁", "田宅", "铃星 天魁", "36-45", "大田"],
  ];
  const palaces = palaceRows.map(([stemBranch, majors, name, minors, range, stage]) => ({
    heavenlyStem: stemBranch.slice(0, -1),
    earthlyBranch: stemBranch.slice(-1),
    name,
    majorStars: majors ? majors.split(/\s+/).map((star) => ({ name: star })) : [],
    minorStars: minors ? minors.split(/\s+/).map((star) => ({ name: star })) : [],
    decadal: { range },
    changsheng12: stage,
    boshi12: "",
    isBodyPalace: name === "官禄",
  }));
  return {
    chart: {
      palaces,
      solarDate: "2026-05-12",
      lunarDate: "二〇二六年三月廿六",
      fiveElementsClass: "火六局",
      zodiac: "马",
      earthlyBranchOfSoulPalace: "申",
      earthlyBranchOfBodyPalace: "子",
    },
    chartData: {
      birthDate: "2026-05-12 15:21",
      timeIndex: 8,
      sizhu: { yearStem: "丙", yearBranch: "午", monthStem: "壬", monthBranch: "辰", dayStem: "丙", dayBranch: "戌", hourStem: "丙", hourBranch: "申" },
    },
    form: { name: "命主", gender: "male", datetime: "2026-05-12T15:21" },
  };
}

function sourceZiweiMingpanScreenFromChart(saved) {
  const focusPalace = (saved.chart?.palaces || []).find((p) => p.name === "命宫");
  return `
    ${figBox("source-27-bg", 0, 0, 390, 867, "", "background:#fbf7ef;")}
    ${figButton("source-27-back-hit", 18, 40, 96, 54, 'data-action="back"')}
    ${figText("source-27-back", "‹ 返回", 28, 54, 92, 26, "#9f2417", 500)}
    ${figText("source-27-title", "紫微命盘", 0, 58, 390, 25, "#3b3934", 800, "center")}
    ${figText("source-27-more", "•••", 330, 56, 42, 22, "#3b3934", 800, "center")}
    ${renderWentianClassicChart(saved)}
    ${figBox("source-27-ai-card", 15, 608, 360, 300, "", "border:1px solid #e0dcd3;border-radius:16px;background:#fff;box-shadow:0 4px 14px rgba(70,45,25,.06);")}
    ${figText("source-27-ai-title", `✦ ${focusPalace?.name || "命盘"} · AI解析`, 34, 630, 220, 22, "#3a3732", 800)}
    ${figText("source-27-ai-close", "×", 334, 624, 26, 30, "#66615b", 500, "center")}
    ${figLine("source-27-ai-line-1", 32, 666, 324, "#dedbd5")}
    ${figText("source-27-ai-copy", "命盘已由网站排盘算法生成，并同步给许半仙。\n可继续提问做深度解析。", 32, 684, 322, 16, "#8b857d", 400, "left", "line-height:1.62;")}
    ${figBox("source-27-ai-button", 36, 739, 318, 44, "", "border-radius:8px;background:#ad3b35;")}
    ${figButton("source-27-ai-button-hit", 36, 739, 318, 44, 'data-route="screen-4"')}
    ${figText("source-27-ai-button-text", "☵  向AI提问", 36, 751, 318, 18, "#fff", 700, "center")}
    ${figLine("source-27-ai-line-2", 32, 816, 324, "#dedbd5")}
    ${figText("source-27-ai-detail-title", "宫位详情", 32, 836, 120, 15, "#3a3732", 500)}
  `;
}

function sourceZiweiMingpanScreen() {
  return sourceZiweiMingpanScreenFromChart(getWentianDisplayChartState() || getWentianFallbackChartState());
}

function renderConvertedScreen(no) {
  const screen = convertedByNo.get(no) || convertedByNo.get(1);
  if (screen.no === 1) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} 首页`, `
      ${sourceDashboardHomeScreen()}
      ${convertedFlowHotspots(screen)}
    `, 1831, "converted source-screen no-status-shift", false);
  }
  if (screen.no === 2) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceHomeScreen(screen)}
      ${convertedFlowHotspots(screen)}
    `, 867, "converted source-screen", true);
  }
  if (screen.no === 3) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceArchiveScreen(screen)}
      ${convertedFlowHotspots(screen)}
    `, 844, "converted source-screen", true);
  }
  if (screen.no === 4) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceAiChatScreen(screen)}
      ${convertedFlowHotspots(screen)}
    `, 844, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 5) {
    wentianArchiveDraftId = null;
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceArchiveSelectScreen()}
    `, 844, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 6 || screen.no === 7) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${convertedHeader(screen)}
      ${convertedAi(screen)}
      ${convertedFlowHotspots(screen)}
    `, 844, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 25) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceProfileScreen(screen)}
      ${convertedFlowHotspots(screen)}
    `, 867, "converted source-screen", true);
  }
  if (screen.no === 31) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceMineScreen(screen)}
      ${convertedFlowHotspots(screen)}
    `, 844, "converted source-screen", true);
  }
  if (screen.no === 37) {
    wentianLanguageDraft = null;
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceLanguageSettingsScreen()}
    `, 844, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 32 || screen.no === 38) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceAccountSettingsScreen()}
      ${convertedFlowHotspots(screen)}
    `, 844, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 39) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceBasicInfoScreen()}
    `, 844, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 40) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceLoginMethodsScreen()}
      ${convertedFlowHotspots(screen)}
    `, 844, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 41) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourcePasswordSettingsScreen()}
      ${convertedFlowHotspots(screen)}
    `, 844, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 26) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceChartFormScreen()}
      ${convertedFlowHotspots(screen)}
    `, 867, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 27) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceZiweiMingpanScreen()}
      ${convertedFlowHotspots(screen)}
    `, 867, "converted source-screen no-status-shift", false);
  }
  const polishedScreen = renderWentianPolishedScreen(screen);
  if (polishedScreen) {
    const polishedHeight = screen.no === 8 ? 1280 : screen.no === 20 ? 1072 : screen.no === 24 ? 1180 : screen.no === 44 ? getYangzhaiResultHeight() : 844;
    const wideBgClass = screen.no >= 42 && screen.no <= 45 ? " wide-bg" : "";
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${polishedScreen}
      ${convertedFlowHotspots(screen)}
    `, polishedHeight, `converted source-screen no-status-shift${wideBgClass}`, false);
  }
  const heading = screen.heading ? figText(`screen-${screen.no}-heading`, screen.heading, 24, 72, 180, 26, "#26211c", 700) : "";
  const badge = screen.badge && screen.no !== 1 ? `
    ${figBox(`screen-${screen.no}-badge`, 226, 520, 90, 90, "", "border-radius:45px;background:#a13824;")}
    ${figText(`screen-${screen.no}-badge-text`, screen.badge, 228, 552, 86, 18, "#fff", 700, "center")}
  ` : "";
  return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
    ${convertedHeader(screen)}
    ${heading}
    ${convertedSpecial(screen)}
    ${badge}
    ${convertedButton(screen)}
    ${convertedBottomNav(screen.active)}
    ${convertedFlowHotspots(screen)}
  `, 844, "converted", false);
}

function normalizeRoute(route) {
  return String(route || "").split("&")[0];
}

function resolveRoute(route) {
  const clean = normalizeRoute(route).replace(/^#/, "");
  return routeAliases[clean] || clean || "screen-1";
}

function routeFromLocation() {
  const hashRoute = normalizeRoute(location.hash.slice(1));
  if (hashRoute && !hashRoute.startsWith("figmacapture=")) return resolveRoute(hashRoute);
  const screen = new URLSearchParams(location.search).get("screen");
  if (screen) return resolveRoute(screen.startsWith("screen") ? screen : `screen-${screen}`);
  return "screen-1";
}

function stripScreenshotStatusBar() {
  const phone = view.querySelector(".figma-phone");
  if (!phone) return;
  const statusNodes = phone.querySelectorAll([
    '[data-node-id="status-time"]',
    '[data-node-id="status-net"]',
    '[data-node-id$="-time"]',
    '[data-node-id$="-status"]',
    '[data-node-id$="-battery"]'
  ].join(","));
  statusNodes.forEach((node) => node.remove());
  if (phone.classList.contains("no-status-shift")) return;

  const bottomNodes = [...phone.querySelectorAll('[data-node-id^="source-bottom-"], [data-node-id^="converted-bottom-"], [data-node-id^="bottom-"]')];
  const bottomTop = bottomNodes.reduce((min, node) => {
    const top = parseFloat(node.style.top);
    return Number.isFinite(top) ? Math.min(min, top) : min;
  }, Infinity);
  const keepBottomAfter = Number.isFinite(bottomTop) ? bottomTop - 8 : Infinity;

  for (const node of phone.querySelectorAll(".fig-text, .fig-box, .fig-line, .fig-img, .fig-click, input")) {
    if (bottomNodes.includes(node)) continue;
    const top = parseFloat(node.style.top);
    if (!Number.isFinite(top) || top >= keepBottomAfter) continue;
    node.style.top = `${Math.max(0, top - 34)}px`;
  }
}

function fitActivePhoneShell() {
  if (wentianFitRaf) window.cancelAnimationFrame(wentianFitRaf);
  wentianFitRaf = window.requestAnimationFrame(() => {
    wentianFitRaf = 0;
    const wrap = view.querySelector(".phone-wrap");
    const phone = view.querySelector(".figma-phone");
    if (!wrap || !phone) return;
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || window.innerWidth || document.documentElement.clientWidth || WENTIAN_PHONE_WIDTH;
    const viewportHeight = viewport?.height || window.innerHeight || document.documentElement.clientHeight || WENTIAN_PHONE_HEIGHT;
    const desktop = window.matchMedia?.("(min-width: 881px)").matches;
    const rootStyle = getComputedStyle(document.documentElement);
    const safeTop = desktop ? 0 : (parseFloat(rootStyle.getPropertyValue("--wentian-safe-top")) || 0);
    const safeBottom = desktop ? 0 : (parseFloat(rootStyle.getPropertyValue("--wentian-safe-bottom")) || 0);
    const horizontalAvailable = Math.max(320, Math.min(viewportWidth, 430));
    const verticalChromeSpace = desktop ? 48 : 0;
    const verticalAvailable = Math.max(560, viewportHeight - verticalChromeSpace - safeTop - safeBottom);
    const rawHeight = parseFloat(phone.style.height) || phone.offsetHeight || WENTIAN_PHONE_HEIGHT;
    const heightBasis = rawHeight <= 900 ? rawHeight : WENTIAN_PHONE_HEIGHT;
    const widthScale = Math.min(1, horizontalAvailable / WENTIAN_PHONE_WIDTH);
    const heightScale = Math.min(1, verticalAvailable / heightBasis);
    const scale = Math.min(widthScale, heightScale);
    phone.style.setProperty("--wentian-phone-scale", String(scale));
    wrap.style.height = `${Math.ceil(rawHeight * scale)}px`;
  });
}

function navigate(route, push = true) {
  route = resolveRoute(route);
  if (/^screen-?\d+$/.test(route)) {
    const no = Number(route.replace(/^screen-?/, ""));
    const screen = convertedByNo.get(no) || convertedByNo.get(2);
    route = `screen-${screen.no}`;
    if (push && route !== state.route) state.stack.push(state.route);
    state.route = route;
    if (routeKicker) routeKicker.textContent = "问天AI";
    if (routeTitle) routeTitle.textContent = screen.title;
    view.innerHTML = applyWentianColorUpgrade(renderConvertedScreen(screen.no));
    stripScreenshotStatusBar();
    fitActivePhoneShell();
    syncActive();
    if (screen.no === 4) window.setTimeout(initWentianXuChat, 0);
    if (screen.no === 26) window.setTimeout(initWentianChartForm, 0);
    if (!location.hash.includes("figmacapture=")) location.hash = route;
    window.scrollTo(0, 0);
    return;
  }
  navigate("screen-1", push);
}

function syncActive() {
  const screenNo = state.route.startsWith("screen-") ? Number(state.route.replace("screen-", "")) : 0;
  let railRoute = {
    recharge: "screen-31",
    settings: "screen-31",
    pay: "screen-31",
    report: "screen-1",
    chart: "screen-3"
  }[state.route] || state.route;
  if (screenNo >= 4 && screenNo <= 9 || screenNo === 12) railRoute = "screen-4";
  if (screenNo === 3 || screenNo >= 25 && screenNo <= 27) railRoute = "screen-3";
  if (screenNo >= 13 && screenNo <= 24) railRoute = "screen-13";
  if (screenNo >= 28 && screenNo <= 41) railRoute = "screen-31";
  if (screenNo === 1 || screenNo === 2 || screenNo === 10 || screenNo === 11) railRoute = "screen-1";
  for (const button of document.querySelectorAll("[data-route]")) {
    if (button.closest(".rail-nav")) {
      button.classList.toggle("is-active", button.dataset.route === railRoute);
    } else if (button.closest(".screen-nav")) {
      button.classList.toggle("is-active", button.dataset.route === state.route);
    } else {
      button.classList.toggle("is-active", button.dataset.route === state.route);
    }
  }
  screenNav?.querySelector(`[data-route="${state.route}"]`)?.scrollIntoView({ block: "nearest" });
}

function reportCards() {
  return reports.map(([name, desc, price]) => `
    <article class="report-card">
      <div>
        <span class="tag">八字</span>
        <h3>${name}</h3>
        <p>${desc}</p>
      </div>
      <div class="price">${price}</div>
      <button class="primary-btn" type="button" data-route="report">立即解锁</button>
    </article>
  `).join("");
}

function renderHome() {
  return `
    <div class="grid">
      <section class="hero-card">
        <h2>你的专属命理报告，立即生成</h2>
        <p>覆盖事业、情感、财富等核心场景，结合命盘结构输出可执行建议。下单后自动生成，可在我的报告持续复盘。</p>
      </section>
      <section class="report-list">${reportCards()}</section>
    </div>
  `;
}

function renderAI() {
  return figPhone("17:3", "Hi-Fi 01 AI问天", `
    ${figStatus("15:17")}
    ${figButton("17:6-hit", 14, 54, 54, 62, 'data-route="home"')}
    ${figText("17:6", "‹", 28, 66, 26, 42, "#21211f", 700, "center")}
    ${figBox("17:7", 58, 54, 32, 32, "", "border-radius:50%;background:linear-gradient(145deg,#2f2f2b,#756f5f);box-shadow:inset 0 -6px 10px rgba(0,0,0,.22);")}
    ${figText("17:8", "许半仙", 96, 59, 150, 22, "#21211f", 700)}
    ${figButton("17:9-hit", 294, 54, 90, 42, 'data-route="archive"')}
    ${figText("17:9", "◷ 对话记录", 306, 63, 78, 15, "#75756e", 500, "right")}
    ${figLine("17:10", 0, 116, 390)}
    ${figText("17:11", "◇", 16, 133, 20, 16, "#ba8f38", 700, "center")}
    ${figText("17:12", "剩余", 42, 134, 44, 18, "#75756e")}
    ${figText("17:13", "1", 88, 133, 16, 19, "#ba8f38", 700)}
    ${figText("17:14", "条", 103, 134, 24, 18, "#75756e")}
    ${figBox("17:15", 318, 124, 56, 34, "fig-card fig-pill", "box-shadow:0 1px 5px rgba(0,0,0,.1);")}
    ${figText("17:16", "谢⌄", 329, 132, 34, 17, "#21211f", 700, "center")}
    ${figLine("17:17", 0, 161, 390)}
    ${figText("17:18", "你好！我是许半仙", 24, 219, 316, 32, "#ba8f38", 700)}
    ${figText("17:19", "需要我为您做些什么？", 24, 272, 260, 22, "#adaba1")}
    ${figBox("17:20", 24, 326, 342, 178, "fig-card", "border-radius:18px;box-shadow:0 4px 12px rgba(0,0,0,.16);")}
    ${figText("17:21", "谢的八字", 42, 348, 180, 20, "#75756e", 700)}
    ${["年柱", "月柱", "日柱", "时柱"].map((label, i) => figText(`pillar-label-${i}`, label, 70 + i * 78, 387, 50, 15, "#9e9e94", 400, "center")).join("")}
    ${figText("17:23", "辛", 70, 418, 50, 25, "#ba8f38", 700, "center")}
    ${figText("17:24", "未", 70, 455, 50, 25, "#6b5938", 700, "center")}
    ${figText("17:26", "庚", 148, 418, 50, 25, "#ba8f38", 700, "center")}
    ${figText("17:27", "寅", 148, 455, 50, 25, "#009e40", 700, "center")}
    ${figText("17:29", "丁", 226, 418, 50, 25, "#b81a05", 700, "center")}
    ${figText("17:30", "巳", 226, 455, 50, 25, "#b81a05", 700, "center")}
    ${figText("17:32", "辛", 304, 418, 50, 25, "#ba8f38", 700, "center")}
    ${figText("17:33", "亥", 304, 455, 50, 25, "#0d75e0", 700, "center")}
    ${figLine("17:34", 42, 486, 306, "#ded7c8")}
    ${figText("17:35", "日主：", 146, 504, 60, 16, "#75756e")}
    ${figText("17:36", "丁", 190, 502, 28, 20, "#ba8f38", 700)}
    ${figText("17:37", "生肖：", 220, 504, 62, 16, "#75756e")}
    ${figText("17:38", "羊", 272, 502, 28, 20, "#ba8f38", 700)}
    ${figBox("17:39", 18, 722, 88, 34, "", "border:1px solid #e5decc;border-radius:18px;background:#fff;")}
    ${figText("17:40", "个人性格", 25, 732, 74, 14, "#21211f", 400, "center")}
    ${figBox("17:41", 116, 722, 88, 34, "", "border:1px solid #e5decc;border-radius:18px;background:#fff;")}
    ${figText("17:42", "感情建议", 123, 732, 74, 14, "#21211f", 400, "center")}
    ${figBox("17:43", 16, 760, 358, 54, "", "border:1px solid #e5decc;border-radius:27px;background:#fbf9f3;box-shadow:0 2px 8px rgba(0,0,0,.12);")}
    <input id="askInput" class="fig-click" style="left:34px;top:774px;width:260px;height:31px;font-size:24px;color:#21211f;background:transparent;outline:0;" placeholder="问一问">
    ${figBox("17:45", 332, 766, 42, 42, "", "border-radius:50%;background:#e8e5d7;")}
    ${figButton("17:45-hit", 326, 760, 54, 54, 'data-action="ask"')}
    ${figText("17:46", "↑", 340, 770, 28, 25, "#a3a194", 700, "center")}
    ${figText("17:47", "内容由 AI 生成，仅供娱乐参考", 82, 812, 240, 13, "#a3a199", 400, "center")}
    <div id="messages" class="fig-box" style="left:24px;top:540px;width:342px;height:150px;overflow:hidden;"></div>
  `);
}

function renderArchive() {
  return `
    <div class="grid two">
      <section class="panel">
        <div class="panel-title">
          <h2>档案</h2>
          <button class="primary-btn small" type="button" data-route="chart">新增档案</button>
        </div>
        <div class="stack">
          ${profiles.map(([name, meta, detail]) => `
            <article class="profile-card">
              <h3>${name}</h3>
              <p>${meta}</p>
              <p>${detail}</p>
              <button class="ghost-btn" type="button" data-route="ai">问天咨询</button>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-title"><h3>快捷入口</h3></div>
        <div class="stack">
          <button class="choice-btn" type="button" data-route="chart">排盘表单</button>
          <button class="choice-btn" type="button" data-route="report">紫微命盘</button>
          <button class="choice-btn" type="button" data-route="ai">AI问天</button>
        </div>
      </section>
    </div>
  `;
}

function renderDivine() {
  return `
    <div class="grid three">
      <article class="panel">
        <div class="panel-title"><h2>抽签</h2></div>
        <p class="muted">静心后抽取一签，查看签文与行动建议。</p>
        <button class="primary-btn" type="button" data-action="drawLot">开始抽签</button>
      </article>
      <article class="panel">
        <div class="panel-title"><h2>起卦</h2></div>
        <p class="muted">按六次投掷生成卦象，查看本卦、变卦和解读。</p>
        <button class="primary-btn" type="button" data-action="hexagram">开始起卦</button>
      </article>
      <article class="panel" id="divineResult">
        <div class="panel-title"><h2>结果</h2></div>
        <p class="muted">等待你的选择。</p>
      </article>
    </div>
  `;
}

function renderMine() {
  return figPhone("17:97", "Hi-Fi 03 我的", `
    ${figStatus("15:23")}
    ${figText("17:100", "我的", 16, 66, 120, 35, "#21211f", 700)}
    ${figText("17:101", "账户与偏好设置", 16, 120, 160, 18, "#75756e")}
    ${figBox("17:102", 338, 70, 38, 38, "fig-card", "border-radius:13px;")}
    ${figButton("17:102-hit", 332, 64, 52, 52, 'data-route="settings"')}
    ${figText("settings-mark", "⚙", 344, 76, 26, 22, "#ba8f38", 700, "center")}
    ${figBox("17:104", 16, 160, 358, 112, "fig-card", "border-radius:18px;box-shadow:0 2px 11px rgba(0,0,0,.1);")}
    ${figBox("17:105", 34, 190, 68, 68, "", "border-radius:50%;background:linear-gradient(145deg,#d9d6ca,#fff);border:1px solid #e5decc;")}
    ${figText("17:108", "谢广周", 118, 190, 120, 24, "#21211f", 700)}
    ${figText("17:109", "开通会员享专属权益", 118, 229, 170, 17, "#75756e")}
    ${figText("17:110", "aa15989267747@gmail.com", 118, 244, 220, 15, "#9e998f")}
    ${figBox("17:111", 16, 296, 110, 78, "fig-card", "border-radius:15px;")}
    ${figText("17:112", "◇", 28, 314, 28, 20, "#ba8f38", 700, "center")}
    ${figText("17:113", "灵石", 58, 316, 54, 17, "#75756e")}
    ${figText("17:114", "1", 30, 346, 30, 25, "#ba8f38", 700)}
    ${figBox("17:116", 140, 296, 110, 78, "fig-card", "border-radius:15px;")}
    ${figText("17:117", "▰", 152, 314, 28, 20, "#ba8f38", 700, "center")}
    ${figText("17:118", "卡券", 182, 316, 54, 17, "#75756e")}
    ${figText("17:119", "0", 154, 346, 30, 25, "#ba8f38", 700)}
    ${figText("17:120", "个", 182, 353, 34, 15, "#75756e")}
    ${figBox("17:121", 264, 296, 110, 78, "fig-card", "border-radius:15px;")}
    ${figText("17:122", "☏", 276, 314, 28, 20, "#ba8f38", 700, "center")}
    ${figText("17:123", "对话", 306, 316, 54, 17, "#75756e")}
    ${figText("17:124", "0", 278, 346, 30, 25, "#ba8f38", 700)}
    ${figText("17:125", "/0", 306, 353, 34, 15, "#75756e")}
    ${figBox("17:126", 16, 394, 172, 62, "fig-card", "border-radius:15px;")}
    ${figText("17:128", "♛", 43, 414, 24, 20, "#ba8f38", 700, "center")}
    ${figText("17:129", "问天会员", 88, 414, 88, 21, "#21211f", 500)}
    ${figBox("17:130", 202, 394, 172, 62, "fig-card", "border-radius:15px;")}
    ${figButton("17:130-hit", 202, 394, 172, 62, 'data-route="recharge"')}
    ${figText("17:132", "◇", 229, 414, 24, 20, "#ba8f38", 700, "center")}
    ${figText("17:133", "灵石充值", 274, 414, 88, 21, "#21211f", 500)}
    ${figBox("17:134", 16, 472, 172, 62, "fig-card", "border-radius:15px;")}
    ${figButton("17:134-hit", 16, 472, 172, 62, 'data-route="report"')}
    ${figText("17:136", "▤", 43, 492, 24, 20, "#ba8f38", 700, "center")}
    ${figText("17:137", "我的报告", 88, 492, 88, 21, "#21211f", 500)}
    ${figBox("17:138", 202, 472, 172, 62, "fig-card", "border-radius:15px;")}
    ${figText("17:140", "▥", 229, 492, 24, 20, "#8c8c80", 700, "center")}
    ${figText("17:141", "订单记录", 274, 492, 88, 21, "#21211f", 500)}
    ${figBox("17:142", 16, 572, 358, 112, "fig-card", "border-radius:16px;")}
    ${figButton("17:142-hit", 16, 572, 358, 56, 'data-route="divine"')}
    ${figText("17:143", "♧", 34, 588, 28, 22, "#ba8f38", 700, "center")}
    ${figText("17:144", "邀请好友", 68, 589, 150, 20, "#21211f")}
    ${figText("17:145", "0人", 292, 589, 46, 18, "#ba8f38", 400, "right")}
    ${figText("17:146", "›", 344, 586, 22, 28, "#a8a699", 700, "center")}
    ${figLine("17:147", 16, 628, 358)}
    ${figText("17:148", "□", 34, 644, 28, 22, "#8c8c80", 700, "center")}
    ${figText("17:149", "兑换礼包", 68, 645, 150, 20, "#21211f")}
    ${figText("17:150", "›", 344, 642, 22, 28, "#a8a699", 700, "center")}
    ${figBox("17:151", 16, 690, 358, 112, "fig-card", "border-radius:16px;")}
    ${figText("17:152", "文", 34, 706, 28, 22, "#ba8f38", 700, "center")}
    ${figText("17:153", "语言设置", 68, 707, 150, 20, "#21211f")}
    ${figText("17:154", "简体中文", 276, 707, 72, 14, "#ba8f38", 400, "right")}
    ${figText("17:155", "›", 344, 730, 22, 28, "#a8a699", 700, "center")}
    ${figLine("17:156", 16, 746, 358)}
    ${figText("17:157", "⌯", 34, 762, 28, 22, "#8c8c80", 700, "center")}
    ${figText("17:158", "分享问天AI", 68, 763, 150, 20, "#21211f")}
    ${figText("17:159", "›", 344, 786, 22, 28, "#a8a699", 700, "center")}
    ${figBottomNav("我的")}
  `);
}

function renderRecharge() {
  return figPhone("17:49", "Hi-Fi 02 灵石充值", `
    ${figStatus("15:22")}
    ${figButton("17:52-hit", 14, 54, 54, 62, 'data-route="mine"')}
    ${figText("17:52", "‹", 28, 66, 26, 42, "#ba8f38", 700, "center")}
    ${figText("17:53", "灵石充值", 0, 68, 390, 28, "#ba8f38", 700, "center")}
    ${figBox("17:54", 22, 140, 346, 160, "", "border-radius:20px;background:linear-gradient(90deg,#40332b,#26261f);box-shadow:0 5px 16px rgba(0,0,0,.26);")}
    ${figBox("17:55", 50, 178, 52, 52, "", "border:1px solid #665940;border-radius:16px;background:#403b2e;")}
    ${figText("17:56", "◇", 61, 190, 36, 32, "#ba8f38", 700, "center")}
    ${figText("17:57", "当前灵石", 120, 174, 150, 22, "#b8b2a8", 700)}
    ${figText("17:58", "1", 122, 214, 60, 36, "#ba8f38", 700)}
    ${figText("17:59", "灵石可以在藏宝阁兑换报告券/对话包", 50, 264, 260, 15, "#948f85")}
    ${figText("17:60", "选择充值套餐", 22, 344, 220, 25, "#21211f", 700)}
    ${figBox("17:61", 22, 392, 108, 86, "fig-card", "border:1.6px solid #ba8f38;border-radius:14px;")}
    ${figText("17:62", "◇", 46, 415, 29, 25, "#ba8f38", 700, "center")}
    ${figText("17:63", "120", 70, 419, 50, 23, "#ba8f38", 700)}
    ${figText("17:64", "¥12", 48, 449, 58, 22, "#ba8f38", 700, "center")}
    ${figBox("17:65", 117, 386, 20, 20, "", "border-radius:50%;background:#ba8f38;")}
    ${figText("17:66", "✓", 120, 388, 14, 13, "#fff", 700, "center")}
    ${figBox("17:67", 142, 392, 108, 86, "fig-card", "border-radius:14px;")}
    ${figText("17:68", "◇", 166, 415, 29, 25, "#75756e", 700, "center")}
    ${figText("17:69", "280", 188, 419, 48, 23, "#21211f", 700)}
    ${figText("17:70", "+10", 218, 426, 30, 15, "#9e6b08", 700, "right")}
    ${figText("17:71", "¥28", 166, 449, 58, 22, "#75756e", 700, "center")}
    ${figBox("17:72", 262, 392, 106, 86, "fig-card", "border-radius:14px;")}
    ${figText("17:73", "◇", 286, 415, 29, 25, "#75756e", 700, "center")}
    ${figText("17:74", "580", 308, 419, 48, 23, "#21211f", 700)}
    ${figText("17:75", "+50", 338, 426, 30, 15, "#9e6b08", 700, "right")}
    ${figText("17:76", "¥58", 286, 449, 58, 22, "#75756e", 700, "center")}
    ${figBox("17:77", 22, 500, 346, 94, "fig-card", "border-radius:14px;")}
    ${figText("17:78", "◇", 46, 523, 29, 25, "#75756e", 700, "center")}
    ${figText("17:79", "980", 171, 523, 66, 25, "#21211f", 700)}
    ${figText("17:80", "+90", 318, 532, 36, 16, "#9e6b08", 700, "right")}
    ${figText("17:81", "¥98", 166, 556, 58, 22, "#75756e", 700, "center")}
    ${figText("17:82", "选择支付方式", 22, 638, 220, 25, "#21211f", 700)}
    ${figBox("17:83", 22, 692, 116, 52, "", "border:1.5px solid #ba8f38;border-radius:14px;background:#fdfaf1;box-shadow:0 2px 7px rgba(0,0,0,.1);")}
    ${figBox("17:84", 42, 708, 18, 14, "", "border-radius:2px;background:#0578e0;")}
    ${figBox("17:85", 42, 708, 18, 5, "", "border-radius:1px;background:#f2f2e5;")}
    ${figText("17:86", "支付宝", 72, 708, 58, 17, "#ba8f38", 500)}
    ${figBox("17:87", 148, 692, 116, 52, "fig-card", "border-radius:14px;")}
    ${figBox("17:88", 168, 708, 18, 14, "", "border-radius:2px;background:#0578e0;")}
    ${figBox("17:89", 168, 708, 18, 5, "", "border-radius:1px;background:#f2f2e5;")}
    ${figText("17:90", "信用卡", 198, 708, 58, 17, "#21211f", 500)}
    ${figText("17:91", "灵石仅限问天AI站内使用，充值后不支持退款", 52, 746, 286, 13, "#9e998f", 400, "center")}
    ${figText("17:92", "用户协议  |  隐私政策", 130, 770, 130, 13, "#75756e", 400, "center")}
    ${figBox("17:93", 0, 780, 390, 64, "", "background:rgba(251,247,240,.92);")}
    ${figBox("17:94", 18, 790, 354, 44, "", "border-radius:22px;background:#9e6b08;box-shadow:0 3px 12px rgba(0,0,0,.16);")}
    ${figButton("17:94-hit", 18, 790, 354, 44, 'data-route="pay"')}
    ${figText("17:95", "立即充值 ¥12", 18, 802, 354, 13, "#fff", 500, "center")}
  `);
}

function renderSettings() {
  return `
    <section class="panel">
      <div class="stack">
        <button class="choice-btn" type="button">基本信息</button>
        <button class="choice-btn" type="button">登录方式</button>
        <button class="choice-btn" type="button">设置密码</button>
        <button class="choice-btn" type="button">语言设置</button>
        <button class="choice-btn" type="button">联系我们</button>
        <button class="choice-btn" type="button">关于我们</button>
      </div>
    </section>
  `;
}

function renderChartForm() {
  return `
    <section class="panel">
      <div class="form-grid">
        <div class="field"><label>姓名</label><input value="谢广周"></div>
        <div class="field"><label>性别</label><select><option>男</option><option>女</option></select></div>
        <div class="field"><label>出生日期</label><input type="datetime-local" value="1990-05-11T15:18"></div>
        <div class="field"><label>出生地</label><input value="上海市"></div>
        <button class="primary-btn" type="button" data-route="report">生成命盘</button>
      </div>
    </section>
  `;
}

function renderReport() {
  return `
    <div class="grid two">
      <section class="panel">
        <div class="panel-title"><h2>紫微命盘</h2><span class="tag">已生成</span></div>
        <p class="muted">命宫、财帛、事业、夫妻、迁移等宫位信息已整理。</p>
        <button class="primary-btn" type="button" data-route="ai">继续问天</button>
      </section>
      <section class="panel">
        <div class="panel-title"><h2>报告摘要</h2></div>
        <p class="muted">你的行动优势在于长期规划和稳定执行。当前阶段适合收束目标，减少分散投入。</p>
      </section>
    </div>
  `;
}

function renderPay() {
  return `
    <section class="panel">
      <div class="panel-title"><h2>订单信息</h2></div>
      <div class="report-card">
        <div>
          <h3>灵石充值</h3>
          <p>订单号 PAY_20260512_cfa323ae</p>
        </div>
        <div class="price">¥12.00</div>
        <button class="primary-btn blue" type="button" data-route="mine">确认支付</button>
      </div>
    </section>
  `;
}

document.addEventListener("click", (event) => {
  const promptButton = event.target.closest("[data-wentian-prompt]");
  if (promptButton) {
    sendWentianXuChat(promptButton.dataset.wentianPrompt || "");
    return;
  }
  const earlyActionTarget = event.target.closest("[data-action]");
  const earlyAction = earlyActionTarget?.dataset.action;
  if (earlyAction === "yangzhai-open") {
    openYangzhaiPicker(earlyActionTarget.dataset.palace || "xun");
    return;
  }
  if (earlyAction === "yangzhai-luopan-open") {
    openYangzhaiLuopanZoom();
    return;
  }
  if (earlyAction === "yangzhai-luopan-close") {
    closeYangzhaiLuopanZoom();
    return;
  }
  if (earlyAction === "yangzhai-pick") {
    pickYangzhaiOption(earlyActionTarget.dataset.yangzhaiOption || "");
    return;
  }
  if (earlyAction === "yangzhai-confirm") {
    confirmYangzhaiSelection();
    return;
  }
  if (earlyAction === "yangzhai-reset") {
    resetYangzhai();
    return;
  }
  if (earlyAction === "yangzhai-autofill") {
    autoFillYangzhai();
    return;
  }
  if (earlyAction === "yangzhai-analyze") {
    analyzeYangzhai();
    return;
  }
  if (earlyAction === "yangzhai-expand") {
    toggleYangzhaiResult(Number(earlyActionTarget.dataset.yangzhaiIndex || 0));
    return;
  }
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    navigate(routeButton.dataset.route);
    return;
  }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "back") navigate(state.stack.pop() || "home", false);
  if (action === "wentian-archive-pick") {
    const option = event.target.closest("[data-archive-id]");
    if (option?.dataset.archiveId) pickWentianArchive(option.dataset.archiveId);
    return;
  }
  if (action === "wentian-archive-confirm") {
    confirmWentianArchiveSelection();
    return;
  }
  if (action === "wentian-language-pick") {
    const option = event.target.closest("[data-language-code]");
    if (option?.dataset.languageCode) pickWentianLanguage(option.dataset.languageCode);
    return;
  }
  if (action === "wentian-language-confirm") {
    confirmWentianLanguage();
    return;
  }
  if (action === "wentian-profile-save") {
    submitWentianProfileForm();
    return;
  }
  if (action === "wentian-chat-send") {
    sendWentianXuChat();
    return;
  }
  if (action === "wentian-chart-submit") {
    submitWentianChartForm();
    return;
  }
  if (action === "ask") {
    const input = document.getElementById("askInput");
    const messages = document.getElementById("messages");
    if (!input?.value.trim() || !messages) return;
    const question = escapeHtml(input.value.trim());
    messages.insertAdjacentHTML("beforeend", `<div class="bubble user">${question}</div><div class="bubble ai">我先看当前八字结构：土金偏显，判断问题时更适合先稳住边界，再决定推进节奏。</div>`);
    input.value = "";
  }
  if (action === "drawLot") {
    document.getElementById("divineResult").innerHTML = `<div class="panel-title"><h2>上上签</h2></div><p class="muted">当前所问宜稳中推进，先定边界，再谈扩张。</p>`;
  }
  if (action === "hexagram") {
    document.getElementById("divineResult").innerHTML = `<div class="panel-title"><h2>地风升</h2></div><p class="muted">升而有序，适合积累资源，等待更好的推进窗口。</p>`;
  }
});

function buildScreenNav() {
  if (!screenNav) return;
  screenNav.innerHTML = convertedScreens.map((screen) => `
    <button type="button" data-route="screen-${screen.no}">
      ${String(screen.no).padStart(2, "0")} ${screen.title}
    </button>
  `).join("");
}

window.addEventListener("hashchange", () => navigate(routeFromLocation(), false));
window.addEventListener("resize", fitActivePhoneShell);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", fitActivePhoneShell);
  window.visualViewport.addEventListener("scroll", fitActivePhoneShell);
}
buildScreenNav();
navigate(routeFromLocation(), false);
