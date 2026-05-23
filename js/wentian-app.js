const reports = [
  ["生命健康预测报告", "基于八字信息生成长期生命能量曲线，预见人生波峰与波谷。", "¥99"],
  ["2026丙午年预测报告", "覆盖事业、财富、感情婚姻、健康关注和行动建议。", "¥50"],
  ["八字与MBTI人格深度解析", "融合人格模型与命盘结构，拆解性格、关系与发展节奏。", "¥58"],
  ["合盘关系报告", "分析双方关系吸引力、冲突点和长期相处策略。", "¥68"]
];

const profiles = [
  ["谢广周", "普通会员 / 账号信息", "男 / 1990-05-11 / 已保存"],
  ["命主", "AI阅天默认档案", "女 / 1995-08-18 / 已保存"]
];

const plans = [
  ["免费版", "30次/天", "每日自动刷新"],
  ["付费版", "100次/天", "适合连续追问复盘"],
  ["计费规则", "按日算", "只按每日额度"]
];

const convertedScreens = [
  { no: 1, title: "授权书", active: "", cards: [["本人授权阅天AI依据输入资料生成排盘、合盘与AI解读。", "签署人：谢广周 / 2026-05-11"]], badge: "已授权" },
  { no: 2, title: "首页/报告商城", active: "首页", heading: "阅天AI", cards: [["你的专属命理报告，立即生成", "排盘、合盘、流年、AI解读", "立即生成", "screen-26"], ["生命曲线预测报告 ¥99", "基于命盘生成完整报告", "", "screen-27"], ["2026丙午年预测报告 ¥50", "流年趋势与行动建议", "", "screen-27"], ["八字与MBTI人格深度解析 ¥58", "性格模型与命盘交叉分析", "", "screen-27"]] },
  { no: 3, title: "档案列表", active: "档案", list: [["谢｜男｜阳历 2026-05-12", "用于排盘、合盘、AI问答", "screen-25"], ["命主｜女｜阴历八月", "用于排盘、合盘、AI问答", "screen-25"], ["贵王红仪｜VIP", "用于排盘、合盘、AI问答", "screen-25"], ["情侣合盘", "用于排盘、合盘、AI问答", "screen-10"]] },
  { no: 4, title: "AI阅天", active: "阅天AI", ai: "base" },
  { no: 5, title: "选择档案", active: "阅天AI", ai: "modal", modalTitle: "选择档案", modalItems: ["谢｜男｜阳历", "命主｜女｜阴历"], next: "screen-6" },
  { no: 6, title: "AI提问中", active: "阅天AI", ai: "asking" },
  { no: 7, title: "AI回复", active: "阅天AI", ai: "reply" },
  { no: 8, title: "AI长文解读", active: "阅天AI", sections: ["核心结论", "性格优势", "隐性风险", "事业建议", "感情建议", "财运建议", "行动方案"] },
  { no: 9, title: "对话记录", active: "阅天AI", modalTitle: "对话记录", modalItems: ["新的对话 15:18", "新的对话 22:06"], next: "screen-7" },
  { no: 10, title: "合盘类型", active: "首页", cards: [["情侣合盘", "合盘深度解析｜情感契合度｜冲突化解建议"], ["合盘主视觉", ""]], button: ["开始合盘", "screen-11"] },
  { no: 11, title: "选择合盘档案", active: "首页", modalTitle: "选择合盘档案", modalItems: ["谢｜男｜阳历", "命主｜女｜阴历"], next: "screen-49" },
  { no: 12, title: "随机提问", cards: [["今日适合问什么？", "事业方向 / 感情状态 / 近期机会"], ["换一批问题", ""]], button: ["开始阅天", "screen-4"] },
  { no: 13, title: "抽签", active: "活动", cards: [["抽签", "静心默念问题，抽取一支签文。"]], button: ["开始抽签", "screen-14"] },
  { no: 14, title: "抽签中", active: "活动", cards: [["抽签中", "签筒正在摇动，请稍候。"]], button: ["查看结果", "screen-15"] },
  { no: 15, title: "抽签结果", active: "活动", cards: [["上上签", "当前所问宜稳中推进，先定边界，再谈扩张。"]], button: ["查看签文详情", "screen-16"] },
  { no: 16, title: "签文详情", active: "活动", sections: ["签文", "解签", "事业", "感情", "行动建议"] },
  { no: 17, title: "起卦", active: "活动", cards: [["起卦", "抛掷六次生成卦象。"]], button: ["开始投掷", "screen-18"] },
  { no: 18, title: "投掷4次", active: "活动", cards: [["已投掷 4 次", "还差 2 次完成本卦。"]], button: ["继续投掷", "screen-19"] },
  { no: 19, title: "投掷5次", active: "活动", cards: [["已投掷 5 次", "再投一次查看结果。"]], button: ["查看结果", "screen-20"] },
  { no: 20, title: "地风升", active: "活动", sections: ["本卦：地风升", "卦意", "事业建议", "关系建议", "行动窗口"], button: ["购买解读", "screen-21"] },
  { no: 21, title: "购买弹窗", active: "活动", modalTitle: "购买完整解读", modalItems: ["地风升完整卦象 ¥12", "包含本卦、变卦与行动建议"], next: "screen-29" },
  { no: 22, title: "邀请好友", active: "活动", cards: [["邀请好友", "邀请码：8R7U58ZW"], ["奖励规则", "好友注册后可获得对话次数。"]], button: ["查看邀请详情", "screen-24"] },
  { no: 24, title: "邀请详情", active: "活动", sections: ["邀请详情", "奖励说明", "到账规则", "常见问题"] },
  { no: 25, title: "档案", active: "档案", list: [["谢广周", "男｜阳历 2026-05-12", "screen-26"], ["查看命盘", "紫微命盘 / 八字", "screen-27"], ["AI阅天", "使用当前档案提问", "screen-4"]] },
  { no: 26, title: "排盘表单", active: "档案", form: ["姓名", "性别", "出生日期", "出生地"], button: ["开始排盘", "screen-27"] },
  { no: 27, title: "紫微命盘", active: "档案", chart: true, button: ["购买解读", "screen-21"] },
  { no: 28, title: "卡券包", active: "我的", cards: [["卡券包", "暂无可用卡券"], ["报告券", "购买套餐后自动发放。"]] },
  { no: 29, title: "阅天套餐", active: "我的", recharge: true },
  { no: 30, title: "支付页", active: "我的", cards: [["订单信息", "支付金额 ¥19.90"]], button: ["确认支付 ¥19.90", "screen-31"] },
  { no: 31, title: "我的", active: "我的", mine: true },
  { no: 32, title: "账户设置", active: "我的", list: [["基本信息", "", "screen-39"], ["登录方式", "", "screen-40"], ["设置密码", "", "screen-41"], ["退出登录", "", "screen-31"]] },
  { no: 33, title: "阅天套餐", active: "我的", cards: [["免费版", ""], ["付费版", "100次/天"], ["付费版 ¥19.90", "按日刷新"]], button: ["立即开通 ¥19.90", "screen-30"] },
  { no: 34, title: "分享阅天AI", active: "我的", modalTitle: "分享阅天AI", modalItems: ["分享文本", "邀请码：8R7U58ZW", "微信好友 / 朋友圈 / 复制链接"], next: "screen-31" },
  { no: 35, title: "联系我们", active: "我的", list: [["电子邮箱", "", ""], ["小红书", "", ""], ["微信公众号", "", ""], ["X", "", ""]] },
  { no: 36, title: "关于我们", active: "我的", cards: [["阅天AI v1.0.3199", "阅天AI是一款命理排盘、合盘、抽签与AI解读工具。"], ["隐私协议", ""], ["用户协议", ""], ["检查更新", ""]] },
  { no: 37, title: "语言设置", active: "我的", modalTitle: "语言设置", modalItems: ["简体中文 ✓", "繁體中文", "English"], next: "screen-38" },
  { no: 38, title: "账户设置", active: "我的", list: [["基本信息", "", "screen-39"], ["登录方式", "", "screen-40"], ["设置密码", "", "screen-41"], ["退出登录", "", "screen-31"]] },
  { no: 39, title: "基本信息", active: "我的", form: ["昵称 谢广周", "邮箱 aa1598...@gmail.com", "手机号 绑定"], button: ["保存", "screen-38"] },
  { no: 40, title: "登录方式", active: "我的", list: [["Apple", "", ""], ["邮箱", "", ""], ["手机号", "", ""], ["Google", "", ""]] },
  { no: 41, title: "设置密码", active: "我的", form: ["新密码", "确认密码"], button: ["保存", "screen-40"] },
  { no: 42, title: "地脉道", active: "活动" },
  { no: 43, title: "选择方位成员", active: "活动" },
  { no: 44, title: "阳宅解读", active: "活动" },
  { no: 45, title: "地脉道教程", active: "活动" },
  { no: 46, title: "六壬法", active: "活动" },
  { no: 47, title: "六壬法教程", active: "活动" },
  { no: 48, title: "支付记录", active: "我的" },
  { no: 49, title: "合盘结果", active: "首页" }
];

const convertedByNo = new Map(convertedScreens.map((screen) => [screen.no, screen]));

const screenFlowHotspots = {
  1: [[286, 24, 86, 52, "screen-26"], [18, 130, 354, 274, "screen-5"], [18, 425, 354, 96, "hepan"], [18, 534, 354, 96, "screen-17"], [18, 643, 354, 96, "screen-42"], [18, 752, 354, 96, "screen-46"], [12, 897, 76, 83, "screen-1"], [109, 897, 76, 83, "screen-25"], [207, 897, 76, 83, "screen-3"], [304, 897, 76, 83, "screen-31"]],
  2: [[18, 282, 354, 190, "screen-4"], [18, 487, 354, 190, "screen-4"], [18, 692, 354, 175, "screen-4"]],
  3: [[285, 128, 82, 28, "screen-5"], [16, 164, 358, 84, "screen-5"], [16, 305, 358, 116, "screen-5"], [12, 761, 76, 72, "screen-1"], [109, 761, 76, 72, "screen-25"], [207, 761, 76, 72, "screen-3"], [304, 761, 76, 72, "screen-31"]],
  4: [[18, 24, 44, 56, "screen-3"], [334, 24, 38, 56, "screen-9"], [252, 26, 78, 36, "screen-5"]],
  5: [[320, 116, 48, 48, "screen-4"], [34, 235, 322, 72, "screen-6"], [34, 318, 322, 72, "screen-6"], [48, 748, 294, 52, "screen-6"]],
  6: [[18, 44, 48, 48, "screen-4"], [88, 600, 220, 76, "screen-7"]],
  7: [[18, 44, 48, 48, "screen-4"], [54, 280, 282, 168, "screen-8"]],
  8: [[18, 44, 48, 48, "screen-7"]],
  9: [[18, 44, 48, 48, "screen-4"], [278, 44, 84, 48, "screen-4"], [20, 118, 350, 72, "screen-7"], [20, 198, 350, 72, "screen-7"], [20, 278, 350, 72, "screen-7"]],
  10: [[18, 44, 48, 48, "screen-1"], [24, 165, 342, 90, "screen-11"], [24, 270, 342, 90, "screen-11"], [24, 375, 342, 90, "screen-11"]],
  11: [[18, 44, 48, 48, "screen-1"]],
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
  22: [[18, 44, 48, 48, "screen-31"], [42, 735, 306, 62, "screen-24"]],
  24: [[18, 44, 48, 48, "screen-22"]],
  25: [[330, 248, 44, 44, "screen-26"], [12, 784, 76, 72, "screen-1"], [109, 784, 76, 72, "screen-25"], [207, 784, 76, 72, "screen-3"], [304, 784, 76, 72, "screen-31"]],
  26: [[18, 40, 96, 54, "screen-1"]],
  27: [[18, 40, 96, 54, "screen-26"]],
  28: [[18, 44, 48, 48, "screen-31"], [42, 735, 306, 58, "screen-33"]],
  29: [[18, 44, 48, 48, "screen-31"], [22, 178, 346, 70, "screen-30"], [22, 257, 346, 70, "screen-30"], [22, 336, 346, 70, "screen-30"], [34, 738, 322, 58, "screen-30"]],
  30: [[18, 44, 48, 48, "screen-33"]],
  31: [[336, 54, 42, 42, "screen-38"], [16, 126, 358, 96, "screen-40"], [16, 240, 111, 75, "screen-33"], [139, 240, 111, 75, "screen-33"], [262, 240, 111, 75, "screen-9"], [16, 330, 174, 60, "screen-33"], [200, 330, 174, 60, "screen-27"], [16, 400, 174, 60, "screen-48"], [200, 400, 174, 60, "screen-22"], [16, 491, 358, 61, "screen-37"], [16, 552, 358, 61, "screen-34"], [16, 613, 358, 61, "screen-35"], [12, 762, 76, 72, "screen-1"], [109, 762, 76, 72, "screen-25"], [207, 762, 76, 72, "screen-3"], [304, 762, 76, 72, "screen-31"]],
  32: [[18, 44, 48, 48, "screen-31"], [20, 94, 350, 56, "screen-39"], [20, 164, 350, 56, "screen-33"], [20, 236, 350, 56, "screen-40"], [20, 306, 350, 56, "screen-41"], [20, 376, 350, 56, "screen-37"], [20, 452, 350, 56, "screen-34"], [20, 520, 350, 56, "screen-35"], [20, 590, 350, 56, "screen-36"]],
  33: [[18, 44, 48, 48, "screen-31"]],
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
  45: [],
  46: [],
  47: []
};

const routes = {
  home: ["阅天AI", "命理报告", renderHome],
  ai: ["阅天AI", "AI阅天", renderAI],
  archive: ["个人档案", "档案列表", renderArchive],
  divine: ["占问工具", "抽签与起卦", renderDivine],
  mine: ["账户中心", "我的", renderMine],
  recharge: ["账户中心", "阅天套餐", renderRecharge],
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
  orders: "screen-48",
  order: "screen-48",
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

const mineBackFallbackRoutes = new Set(["screen-22", "screen-34", "screen-35", "screen-37"]);

const view = document.getElementById("view");
const routeKicker = document.getElementById("routeKicker");
const routeTitle = document.getElementById("routeTitle");
const screenNav = document.getElementById("screenNav");
let wentianFitObserver = null;
let wentianFitTimers = [];
let wentianFitLoop = 0;
let wentianFitLoopUntil = 0;
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

function figImage(id, src, x, y, w, h, style = "", attrs = "") {
  return `<img class="fig-img" data-node-id="${id}" src="${src}" alt="" ${attrs} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}">`;
}

function figButton(id, x, y, w, h, attrs, className = "", style = "") {
  return `<button class="fig-click ${className}" type="button" data-node-id="${id}" ${attrs} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}"></button>`;
}

function figLine(id, x, y, w, color = "#e5decc") {
  return `<div class="fig-line" data-node-id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:1px;background:${color};"></div>`;
}

function figSvg(id, x, y, w, h, viewBox, body, style = "") {
  return `<svg data-node-id="${id}" viewBox="${viewBox}" aria-hidden="true" focusable="false" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:visible;${style}">${body}</svg>`;
}

function wentianBottomNavIcon(kind, id, x, y, color, active = false, zIndex = 50) {
  const line = `fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"`;
  const dot = `fill="${color}" stroke="none"`;
  const halo = active
    ? `<circle cx="20" cy="20" r="16" fill="#fff2d9" stroke="#d19b43" stroke-width="1.2"></circle>`
    : "";
  const bodies = {
    home: `
      ${halo}
      <circle cx="20" cy="20" r="12.5" ${line}></circle>
      <circle cx="20" cy="20" r="4.2" ${line}></circle>
      <path d="M20 6.5v5M20 28.5v5M6.5 20h5M28.5 20h5" ${line}></path>
      <path d="M11.8 28.2 28.2 11.8" ${line}></path>
      <circle cx="29" cy="27" r="1.3" ${dot}></circle>
    `,
    archive: `
      ${halo}
      <path d="M13 9.5h15.5l2 2V31H13c-2 0-3.5-1.4-3.5-3.5V13c0-2.1 1.4-3.5 3.5-3.5Z" ${line}></path>
      <path d="M28.5 9.5v6H31" ${line}></path>
      <path d="M14.5 17.5h9M14.5 22.5h11M14.5 27.5h7" ${line}></path>
      <path d="M10 13.2c2.8 1.4 5.6 1.4 8.4 0" ${line}></path>
    `,
    ai: `
      ${halo}
      <circle cx="20" cy="20" r="10.5" ${line}></circle>
      <path d="M20 7.5c6.5 3.2 7.1 8.7.9 12.4-6.2 3.8-5.7 9.2 1.1 12.6" ${line}></path>
      <path d="M20 7.5c-6.5 3.2-7.1 8.7-.9 12.4 6.2 3.8 5.7 9.2-1.1 12.6" ${line}></path>
      <circle cx="20" cy="13.2" r="1.7" ${dot}></circle>
      <circle cx="20" cy="26.8" r="1.7" ${dot}></circle>
      <path d="M10.4 20h19.2" ${line}></path>
    `,
    mine: `
      ${halo}
      <path d="M20 9.2c3.4 0 6.1 2.7 6.1 6s-2.7 6-6.1 6-6.1-2.7-6.1-6 2.7-6 6.1-6Z" ${line}></path>
      <path d="M10.8 31.5c2.1-5.4 5.2-8 9.2-8s7.1 2.6 9.2 8" ${line}></path>
      <path d="M11.8 31.5h16.4" ${line}></path>
      <circle cx="27.8" cy="9.8" r="1.2" ${dot}></circle>
    `
  };
  return figSvg(id, x, y, 34, 34, "0 0 40 40", bodies[kind] || bodies.home, `z-index:${zIndex};filter:${active ? "drop-shadow(0 7px 10px rgba(163,49,41,.16))" : "none"};`);
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
  const phoneBody = withWentianStandardBottomNav(nodeId, body, height);
  return `
    <div class="phone-wrap">
      <section class="figma-phone ${extraClass}" data-node-id="${nodeId}" data-name="${name}" style="height:${phoneBody.height}px">
        ${phoneBody.body}
        ${showHomeIndicator ? '<div class="fig-home-indicator"></div>' : ""}
      </section>
    </div>
  `;
}

function hasWentianBottomNav(body) {
  return /data-node-id="(?:source-bottom-|converted-bottom-|bottom-)/.test(String(body));
}

function getWentianBottomNavActive(nodeId) {
  const match = String(nodeId).match(/^screen-(\d+)$/);
  const no = match ? Number(match[1]) : 0;
  if (!no) return "";
  if (no === 1 || no === 2 || no === 10 || no === 11 || no === 49) return "首页";
  if (no === 3 || (no >= 25 && no <= 27)) return "档案";
  if ((no >= 4 && no <= 9) || no === 12) return "阅天AI";
  if ((no >= 28 && no <= 41) || no === 48) return "我的";
  if ((no >= 13 && no <= 24) || (no >= 42 && no <= 47)) return "首页";
  return convertedByNo.get(no)?.active || "首页";
}

function withWentianStandardBottomNav(nodeId, body, height) {
  const baseHeight = Number(height) || WENTIAN_PHONE_HEIGHT;
  if (!/^screen-\d+$/.test(String(nodeId)) || hasWentianBottomNav(body) || /class="liuyao-caster-modal"/.test(String(body)) || /liuyao-result-panel/.test(String(body))) {
    return { body, height: baseHeight };
  }
  const navY = Math.max(755, Math.round(baseHeight));
  return {
    body: `${body}${sourceAppBottomNav(getWentianBottomNavActive(nodeId), navY)}`,
    height: navY + 89
  };
}

function figBottomNav(active) {
  const items = [
    ["home", "home", "首页"],
    ["archive", "archive", "档案"],
    ["ai", "ai", "阅天AI"],
    ["mine", "mine", "我的"]
  ];
  return `
    ${figBox("bottom-bg", 0, 760, 390, 84, "", "background:#fff;box-shadow:0 -8px 18px rgba(0,0,0,.04);")}
    ${items.map(([route, iconKind, label], index) => {
      const left = [28, 125, 222, 319][index];
      const on = label === active;
      const color = on ? "#a33129" : "#8c857b";
      return `
        ${figButton(`bottom-${label}`, left - 8, 760, 58, 66, `data-route="${route}"`)}
        ${wentianBottomNavIcon(iconKind, `bottom-icon-${label}`, left, 768, color, on, 2)}
        ${figText(`bottom-label-${label}`, label, left - 9, 807, 50, 15, color, on ? 800 : 500, "center", "z-index:3;")}
        ${on ? figBox(`bottom-active-${label}`, left + 8, 826, 18, 3, "", `border-radius:999px;background:${color};opacity:.72;z-index:3;`) : ""}
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
  const current = active === "活动" ? "" : active;
  const items = [
    ["screen-1", "首页", "home", 49],
    ["screen-25", "档案", "archive", 146],
    ["screen-3", "阅天AI", "ai", 244],
    ["screen-31", "我的", "mine", 341]
  ];
  return `
    ${figBox("converted-bottom-bg", 0, 780, 390, 64, "", "background:#fff;box-shadow:0 -4px 14px rgba(0,0,0,.06);")}
    ${items.map(([route, label, iconKind, x]) => {
      const on = label === current;
      const color = on ? "#a33129" : "#8c857b";
      return `
        ${figButton(`converted-bottom-${label}`, x - 37, 780, 76, 60, `data-route="${route}"`)}
        ${wentianBottomNavIcon(iconKind, `converted-bottom-icon-${label}`, x - 17, 786, color, on, 2)}
        ${figText(`converted-bottom-label-${label}`, label, x - 28, 817, 56, 12, color, on ? 800 : 500, "center", "z-index:3;")}
        ${on ? figBox(`converted-bottom-active-${label}`, x - 9, 835, 18, 3, "", `border-radius:999px;background:${color};opacity:.72;z-index:3;`) : ""}
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
    ["生命健康预测报告(文字版持续更新)", "基于您的八字信息，系统将计算出横跨121年的生命能量曲线。预见人生的波峰与波谷，在关键节…", "¥99", "¥199.99", "直接购买", 282],
    ["2026丙午年预测报告", "全面八字分析，2026概览、太岁情况、事业发展、财富运势、爱情婚姻、健康关注、风水建议、每…", "¥50", "¥99", "直接购买", 487],
    ["八字与MBTI人格深度解析及运势全面预测", "融合八字命理学与MBTI四维模型。从五行能量场到潜意识决策模式，为您深度揭示性格底色、原生…", "¥58", "¥88", "直接购买", 692]
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
    ${reports.map(([title, desc, price, oldPrice, payLabel, y], index) => `
      ${figBox(`source-2-report-${index}`, 18, y, 354, index === 2 ? 184 : 190, "converted-card", "border-radius:12px;box-shadow:0 8px 20px rgba(70,45,25,.12);")}
      ${figBox(`source-2-tag-${index}`, 36, y + 22, 44, 28, "", "border-radius:14px;background:#fff4ec;")}
      ${figText(`source-2-tag-text-${index}`, "八字", 44, y + 29, 28, 11, "#9a6b33", 700, "center")}
      ${figText(`source-2-price-${index}`, price, 285, y + 20, 60, 26, "#8d251d", 800, "right")}
      ${figText(`source-2-card-title-${index}`, title, 36, y + 60, index === 2 ? 322 : 300, index === 2 ? 15 : 17, "#26211c", 800, "left", index === 2 ? "white-space:nowrap;" : "")}
      ${figText(`source-2-card-desc-${index}`, desc, 36, y + 92, 300, 13, "#6f665d", 400, "left", "line-height:1.55;")}
      ${figText(`source-2-old-${index}`, oldPrice, 36, y + 143, 80, 12, "#a99f94", 400, "left", "text-decoration:line-through;")}
      ${figText(`source-2-pay-label-${index}`, payLabel, 36, y + 160, 90, 13, "#6f665d")}
      ${figBox(`source-2-unlock-${index}`, 262, y + 145, 88, 32, "", "border-radius:16px;background:#fff3ef;")}
      ${figText(`source-2-unlock-text-${index}`, "立即解锁 →", 270, y + 153, 72, 12, "#8d251d", 700, "center")}
    `).join("")}
  `;
}

function sourceAppBottomNav(active, y = 778) {
  const items = [
    ["首页", "home", 49, "screen-1"],
    ["档案", "archive", 146, "screen-25"],
    ["阅天AI", "ai", 244, "screen-3"],
    ["我的", "mine", 341, "screen-31"]
  ];
  return `
    ${figBox("source-bottom-bg", 0, y, 390, 89, "", "background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(255,250,241,.98));box-shadow:0 -4px 14px rgba(62,38,18,.07);z-index:45;")}
    ${items.map(([label, iconKind, x, route]) => {
      const on = label === active;
      const color = on ? "#a33129" : "#8c857b";
      return `
        ${figButton(`source-bottom-hit-${label}`, x - 37, y + 6, 76, 72, `data-route="${route}"`, "", "z-index:55;")}
        ${wentianBottomNavIcon(iconKind, `source-bottom-icon-${label}`, x - 17, y + 13, color, on, 50)}
        ${figText(`source-bottom-label-${label}`, label, x - 28, y + 50, 56, 12, color, on ? 800 : 500, "center", "z-index:50;")}
        ${on ? figBox(`source-bottom-active-${label}`, x - 9, y + 72, 18, 3, "", `border-radius:999px;background:${color};opacity:.72;z-index:50;`) : ""}
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
    ${figText("source-3-title", "阅天AI", 18, 62, 160, 29, "#26211c", 800)}
    ${figText("source-3-subtitle", "许半仙已准备好为您解读", 18, 101, 220, 13, "#7f756b")}
    ${figText("source-3-current-title", "当前档案", 18, 136, 120, 15, "#26211c", 800)}
    ${figText("source-3-change", "更换档案 〉", 284, 138, 88, 12, "#9b742e", 500, "right")}
    ${figBox("source-3-profile", 16, 164, 358, 104, "converted-card", "border-radius:12px;box-shadow:0 6px 18px rgba(90,62,34,.09);")}
    ${figImage("source-3-profile-avatar", "../images/wentian-prototype-assets/03-profile.jpg", 38, 192, 48, 48, "border-radius:24px;border:1px solid #e4d2a7;object-fit:cover;", "loading=\"eager\" decoding=\"async\" onerror=\"this.onerror=null;this.src='../images/wentian-prototype-assets/xu-banxian.jpg';\"")}
    ${figText("source-3-profile-name", escapeHtml(active.name), 102, 184, 188, 18, "#26211c", 800)}
    ${figBox("source-3-gender", 102, 211, 30, 18, "", "border-radius:9px;background:#f7ecd5;")}
    ${figText("source-3-gender-text", active.gender, 102, 215, 30, 10, "#b07a2d", 700, "center")}
    ${figBox("source-3-profile-tag", 140, 211, 72, 18, "", "border-radius:9px;background:#f7ecd5;")}
    ${figText("source-3-profile-tag-text", "紫微命盘", 140, 215, 72, 10, "#c3a371", 500, "center")}
    ${figText("source-3-profile-date", escapeHtml(active.datetime), 102, 238, 170, 12, "#8d8175")}
    ${figText("source-3-profile-switch", "⇅", 334, 205, 22, 22, "#b5ad9d", 500, "center")}
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
    ${sourceAppBottomNav("阅天AI", 755)}
  `;
}

function sourceAiChatScreen(screen) {
  const chatContext = getWentianXuChatContext();
  const isLiuyaoChat = chatContext?.type === "liuyao";
  const isHepanChat = chatContext?.type === "hepan";
  const isLiurenChat = chatContext?.type === "liuren";
  const isContextChat = isLiuyaoChat || isHepanChat || isLiurenChat;
  const liuyaoFaqGroups = [
    {
      label: "事情成败",
      items: [
        ["能不能成", "就这次占卜看，这件事成败关键在哪里？"],
        ["最大阻力", "这卦里最大的阻力是什么，我应该先处理哪一处？"],
        ["是否该继续", "这件事现在该继续推进，还是先停一停？"],
        ["结果走向", "按本卦和变卦看，后面大概会往哪里走？"]
      ]
    },
    {
      label: "时间变化",
      items: [
        ["什么时候动", "这件事什么时候容易出现变化点？"],
        ["动爻怎么看", "请重点讲这次动爻代表的变化。"],
        ["应期提醒", "这卦能看出近期要留意的时间点吗？"],
        ["下一阶段", "变卦提示下一阶段要怎么走？"]
      ]
    },
    {
      label: "人事关系",
      items: [
        ["对方态度", "从这卦看，对方或关键人现在是什么态度？"],
        ["贵人阻力", "这件事里谁是助力，谁可能是阻力？"],
        ["沟通方式", "我接下来应该怎么沟通比较顺？"],
        ["合作风险", "如果涉及合作，这卦里要防什么风险？"]
      ]
    },
    {
      label: "行动取舍",
      items: [
        ["现在怎么做", "结合这卦，给我三步具体行动建议。"],
        ["该避什么", "这件事目前最不该做什么？"],
        ["取舍判断", "如果有两个选择，该按什么原则取舍？"],
        ["再占提醒", "这件事后面什么情况下才需要再起一卦？"]
      ]
    }
  ];
  const hepanFaqGroups = [
    {
      label: "相处判断",
      items: [
        ["适不适合", "就这次合盘看，这段关系适不适合长期推进，关键依据是什么？"],
        ["吸引在哪", "双方最容易互相吸引的点是什么，应该怎么放大？"],
        ["卡点在哪", "这段关系最容易卡在什么问题上，怎么提前处理？"],
        ["推进节奏", "如果继续发展，接下来三个月适合怎么推进？"]
      ]
    },
    {
      label: "冲突化解",
      items: [
        ["沟通方式", "双方沟通最容易误会在哪里，应该怎么说比较顺？"],
        ["边界问题", "这段关系里最需要提前讲清楚的边界是什么？"],
        ["现实压力", "现实层面的钱、时间、家人或距离，哪个最要注意？"],
        ["行动建议", "给我三条具体的相处建议，按优先级排序。"]
      ]
    }
  ];
  const liurenFaqGroups = [
    {
      label: "成败快慢",
      items: [
        ["能不能成", "就这次六壬课看，这件事成败怎么断？"],
        ["快还是慢", "这课看应事快慢如何，接下来要等还是要动？"],
        ["当前阻力", "当前最大的阻力在哪里，先处理哪一处？"],
        ["结果走向", "按这个落宫看，后面大概会往哪里走？"]
      ]
    },
    {
      label: "行动取舍",
      items: [
        ["现在怎么做", "按这次六壬课，给我一句最该做的行动建议。"],
        ["该不该催", "这件事现在适不适合主动催、主动联系？"],
        ["该避什么", "这课里最需要避开的动作是什么？"],
        ["再起课吗", "这件事什么情况下才需要重新起课？"]
      ]
    },
    {
      label: "人事消息",
      items: [
        ["对方态度", "从这次六壬课看，对方或关键人现在是什么态度？"],
        ["消息何来", "这课看消息会不会来，来自哪类人或哪种渠道？"],
        ["贵人阻力", "这件事里更像有人帮，还是有人卡？"],
        ["沟通提醒", "接下来沟通上要注意什么？"]
      ]
    }
  ];
  const chartFaqGroups = [
    {
      label: "人生主线",
      items: [
        ["这辈子怎么走", "结合我的命盘，直接说我这辈子最重要的主线是什么，适合走什么路。"],
        ["靠什么起势", "结合我的命盘，看我最容易靠什么起势，真正的优势在哪里。"],
        ["最大短板", "结合我的命盘，看我最大的短板和最容易反复出问题的地方。"],
        ["先做什么", "结合我的命盘，给我接下来最该先做的三件事。"]
      ]
    },
    {
      label: "感情婚姻",
      items: [
        ["正缘何时来", "结合我的命盘，看我的正缘什么时候容易出现，对方大概是什么类型。"],
        ["这段能成吗", "结合我的命盘，看这段关系能不能继续，适合推进还是放下。"],
        ["适合伴侣", "结合我的命盘，看我适合什么样的伴侣，什么类型的人不适合我。"],
        ["婚姻避坑", "结合我的命盘，看婚姻里最容易出问题的点，以及怎么避开。"]
      ]
    },
    {
      label: "事业工作",
      items: [
        ["适合工作", "结合我的命盘，看我适合什么行业和岗位，靠什么能力发展。"],
        ["要换工作吗", "结合我的命盘，看我现在适不适合换工作、转岗或换方向。"],
        ["能创业吗", "结合我的命盘，看我适合创业还是上班，创业要注意什么。"],
        ["事业何时起", "结合我的命盘，看事业什么时候容易起来，哪几年最关键。"]
      ]
    },
    {
      label: "财运赚钱",
      items: [
        ["财从哪里来", "结合我的命盘，看我的财从哪里来，适合靠什么赚钱。"],
        ["今年能赚钱吗", "结合我的命盘和今年流年，看今年财运怎么样，能不能赚钱。"],
        ["适合投资吗", "结合我的命盘，看我适不适合投资、合伙或做副业，风险在哪里。"],
        ["哪年财运好", "结合我的命盘，看哪几年财运比较好，哪几年要守财。"]
      ]
    },
    {
      label: "今年运势",
      items: [
        ["今年怎么走", "结合我的命盘和当前流年，看今年整体运势怎么走。"],
        ["今年抓什么", "结合我的命盘，看今年最该抓住的机会是什么。"],
        ["今年避什么", "结合我的命盘，看今年最容易踩什么坑，怎么避开。"],
        ["12个月重点", "结合我的命盘，看未来12个月每个阶段的重点和提醒。"]
      ]
    },
    {
      label: "转运节点",
      items: [
        ["何时转运", "结合我的命盘，看我什么时候转运，什么时候会明显好起来。"],
        ["低谷何时过", "结合我的命盘，看我现在这段低谷什么时候过去，应该怎么熬。"],
        ["下个大限", "结合我的命盘，看我下一个大限怎么样，会往哪里变。"],
        ["关键年份", "结合我的命盘，看未来哪些年份最关键，哪些年要主动争取。"]
      ]
    },
    {
      label: "健康身体",
      items: [
        ["身体注意", "结合我的命盘，看身体最该注意哪里，哪些习惯要改。"],
        ["今年健康", "结合我的命盘和今年流年，看今年健康方面有什么风险。"],
        ["睡眠情绪", "结合我的命盘，看睡眠、情绪和压力该怎么调整。"],
        ["怎么养运", "结合我的命盘，给我适合长期坚持的养运和生活建议。"]
      ]
    },
    {
      label: "家庭人际",
      items: [
        ["贵人在哪", "结合我的命盘，看我的贵人在哪里，什么人最能帮我。"],
        ["防什么人", "结合我的命盘，看我近期要防什么小人、口舌或人际消耗。"],
        ["父母家宅", "结合我的命盘，看父母、长辈、房子和家宅近期怎么走。"],
        ["子女缘分", "结合我的命盘，看子女缘分、亲子关系和孩子相关运势。"]
      ]
    }
  ];
  const faqGroups = isLiuyaoChat ? liuyaoFaqGroups : isHepanChat ? hepanFaqGroups : isLiurenChat ? liurenFaqGroups : chartFaqGroups;
  const contextTitle = chatContext?.title || (isHepanChat ? "情侣合盘" : isLiurenChat ? "六壬课" : "六爻占卜");
  const contextSummary = chatContext?.summaryLine || "";
  const profileText = isLiuyaoChat ? "六爻" : isHepanChat ? "合盘" : isLiurenChat ? "六壬" : "命主";
  const profileIcon = isLiuyaoChat ? "卦" : isHepanChat ? "合" : isLiurenChat ? "课" : "命";
  const profileSub = isLiuyaoChat || isLiurenChat ? "占卜" : isHepanChat ? "专批" : "切换";
  const profileTag = isContextChat ? `
    <div class="wentian-chat-profile-tag is-context" aria-label="${escapeHtml(profileText)}专批">
      <span class="wentian-chat-profile-seal" data-node-id="source-4-profile-icon" data-profile-icon="${profileIcon}" aria-hidden="true"></span>
      <span class="wentian-chat-profile-copy">
        <b data-node-id="source-4-profile-text">${profileText}</b>
        <small data-node-id="source-4-profile-sub">${profileSub}</small>
      </span>
    </div>
  ` : `
    <button class="wentian-chat-profile-tag" type="button" data-route="screen-5" aria-label="切换命盘">
      <span class="wentian-chat-profile-seal" data-node-id="source-4-profile-icon" data-profile-icon="${profileIcon}" aria-hidden="true"></span>
      <span class="wentian-chat-profile-copy">
        <b data-node-id="source-4-profile-text">${profileText}</b>
        <small data-node-id="source-4-profile-sub">${profileSub}</small>
      </span>
      <span class="wentian-chat-profile-caret">⌄</span>
    </button>
  `;
  const chatRoleText = isLiuyaoChat ? "占卜专批 · 在线" : isHepanChat ? "合盘专批 · 在线" : isLiurenChat ? "六壬专批 · 在线" : "命盘顾问 · 在线";
  const contextLabel = isHepanChat ? "本次合盘" : isLiurenChat ? "本次六壬课" : "本次占问";
  const contextQuestion = chatContext?.question || (isHepanChat ? "双方关系" : isLiurenChat ? "所念之事" : "所问之事");
  const faqTitle = isLiuyaoChat ? "占卜追问" : isHepanChat ? "合盘追问" : isLiurenChat ? "六壬追问" : "常问";
  const inputPlaceholder = isLiuyaoChat ? "追问这卦" : isHepanChat ? "追问合盘" : isLiurenChat ? "追问此课" : "问一问";
  return `
    ${figBox("source-4-bg", 0, 0, 390, 892, "", "background:#fbf7ef;")}
    ${figBox("source-4-header", 0, 0, 390, 88, "", "background:#f8f3ea;box-shadow:0 1px 0 rgba(110,82,38,.08);")}
    ${figText("source-4-back", "‹", 24, 29, 28, 34, "#26211c", 500)}
    ${figImage("source-4-avatar", "../images/wentian-prototype-assets/xu-banxian.jpg", 58, 25, 40, 40, "border-radius:20px;object-fit:cover;object-position:center 18%;")}
    ${figText("source-4-name", "许半仙", 110, 27, 110, 17, "#26211c", 800)}
    ${figText("source-4-left", chatRoleText, 110, 51, 140, 12, "#8d8377", 500)}
    ${profileTag}
    ${figText("source-4-record", "⋯", 344, 31, 22, 22, "#6f665d", 800, "center")}
    <div id="wentian-chat-status" class="wentian-chat-status">正在接入许半仙…</div>
    ${chatContext ? `
      <div class="wentian-chat-context-card">
        <span>${contextLabel}</span>
        <strong>${escapeHtml(contextQuestion)}</strong>
        <em>${escapeHtml(contextTitle)}${contextSummary ? ` · ${escapeHtml(contextSummary)}` : ""}</em>
      </div>
    ` : ""}
    <div id="wentian-chat-messages" class="wentian-chat-log ${chatContext ? "is-with-context" : ""}" aria-live="polite"></div>
    ${figText("source-4-faq-title", faqTitle, 22, 582, 84, 13, "#25211d", 800)}
    <div class="wentian-chat-starters" aria-label="常见问题分类">
      ${faqGroups.map((group) => `
        <details class="wentian-chat-faq-group">
          <summary class="wentian-chat-faq-summary" data-wentian-faq-toggle>
            <span>${escapeHtml(group.label)}</span>
            <small>细问</small>
          </summary>
          <div class="wentian-chat-subtopics">
            ${group.items.map(([label, prompt]) => `
              <button class="wentian-chat-starter" type="button" data-wentian-prompt="${escapeHtml(prompt)}">${escapeHtml(label)}</button>
            `).join("")}
          </div>
        </details>
      `).join("")}
    </div>
    ${figBox("source-4-input-bg", 0, 790, 390, 102, "", "background:#f7f3ec;box-shadow:0 -1px 0 rgba(110,82,38,.08);")}
    <textarea id="wentian-chat-input" class="wentian-chat-field" rows="1" placeholder="${inputPlaceholder}" autocomplete="off"></textarea>
    <button id="wentian-chat-send" class="wentian-chat-send" type="button" data-action="wentian-chat-send" aria-label="发送">↑</button>
    ${figText("source-4-disclaimer", "内容由AI生成，仅供娱乐参考", 0, 862, 390, 10, "#b8b0a7", 400, "center")}
  `;
}

function sourceArchiveSelectScreen() {
  const archives = getWentianArchiveList();
  const activeId = wentianArchiveDraftId || getWentianSelectedArchiveId(archives);
  const displayArchives = archives;
  return `
    ${figBox("source-5-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figBox("source-5-header", 0, 0, 390, 88, "", "background:#fffdf8;border-bottom:1px solid #eadfce;")}
    ${figButton("source-5-back-hit", 16, 28, 64, 54, 'data-action="back"')}
    ${figText("source-5-back", "‹", 28, 37, 28, 34, "#26211c", 500)}
    ${figText("source-5-title", "选择档案", 0, 42, 390, 22, "#1f1d1a", 800, "center")}
    ${figBox("source-5-count", 300, 32, 66, 32, "", "border-radius:14px;background:#f7f2ec;")}
    ${figText("source-5-count-text", `共 ${archives.length} 张`, 300, 42, 66, 11, "#8b8176", 700, "center")}

    ${figBox("source-5-intro", 24, 108, 342, 82, "", "border-radius:18px;background:linear-gradient(135deg,#fff,#f8f1e5);box-shadow:0 10px 24px rgba(70,45,25,.09);")}
    ${figImage("source-5-avatar", "../images/wentian-prototype-assets/xu-banxian.jpg", 44, 126, 46, 46, "border-radius:23px;object-fit:cover;object-position:center 18%;")}
    ${figText("source-5-name", "许半仙", 106, 124, 120, 18, "#26211c", 900)}
    ${figText("source-5-sub", "选择一个档案接入对话", 106, 150, 210, 14, "#8b8176", 600)}

    ${figBox("source-5-sheet", 18, 214, 354, 532, "", "border:1px solid #eadfce;border-radius:20px;background:#fffaf3;box-shadow:0 12px 28px rgba(70,45,25,.08);")}
    ${figText("source-5-sheet-title", "请确认命盘", 42, 240, 150, 22, "#1f1d1a", 900)}
    ${figText("source-5-sheet-sub", "确认后再进入许半仙对话", 42, 270, 210, 13, "#8b8176", 600)}
    <button class="wentian-archive-new-mini" type="button" data-route="screen-26">＋ 新建</button>
    <div class="wentian-archive-list">
    ${displayArchives.map((archive) => {
      const item = getWentianArchiveDisplay(archive);
      const selected = archive.id === activeId;
      return `
        <button class="wentian-archive-option ${selected ? "is-selected" : ""}" type="button" data-action="wentian-archive-pick" data-wentian-archive-option="1" data-archive-id="${escapeHtml(archive.id)}" aria-pressed="${selected ? "true" : "false"}">
          <span class="wentian-archive-avatar">${escapeHtml(item.name.slice(0, 1))}</span>
          <span class="wentian-archive-main">
            <span class="wentian-archive-title-row">
              <span class="wentian-archive-name">${escapeHtml(item.name)}</span>
              ${item.badge ? `<span class="wentian-archive-badge">${escapeHtml(item.badge)}</span>` : ""}
              <span class="wentian-archive-gender">${item.gender}</span>
              <span class="wentian-archive-tag">${escapeHtml(item.tag)}</span>
            </span>
            <span class="wentian-archive-date">${escapeHtml(item.datetime)}</span>
            <span class="wentian-archive-pillars">${escapeHtml(item.pillars)}</span>
          </span>
          <span class="wentian-archive-check">${selected ? "✓" : ""}</span>
        </button>
      `;
    }).join("")}
    </div>
    ${figLine("source-5-sheet-line", 24, 750, 342, "#eee8df")}
    <button class="wentian-archive-exit" type="button" data-action="wentian-archive-cancel">退出选盘</button>
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
  typingTimer: null,
  context: null,
};

let wentianFallbackChartRecordId = null;
const WENTIAN_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WENTIAN_CHART_STORAGE_KEY = "wentian-app-current-chart-v1";
const WENTIAN_ARCHIVES_STORAGE_KEY = "wentian-app-archives-v1";
const WENTIAN_SELECTED_ARCHIVE_KEY = "wentian-app-selected-archive-id";
const WENTIAN_HEPAN_SELECTION_KEY = "wentian-app-hepan-selected-ids";
const WENTIAN_HEPAN_MIN_AGE = 18;
const WENTIAN_HEPAN_MAX_AGE_GAP = 15;
const WENTIAN_HEPAN_AI_RULES = [
  "海厦《天纪06》合盘提到母子格、父女格、兄弟格、朋友格；格局先看命盘宫位/星曜对应，不按现实年龄硬猜。",
  "页面主判：一方夫妻宫所在地支落到另一张盘哪一宫，就先按那一宫立格，例如落兄弟宫为兄弟格，落朋友/仆役宫为朋友格。",
  "星曜佐证：参考父母宫星入对方命宫、命宫星入对方父母宫、兄弟宫星入对方命宫、朋友宫星入对方命宫等合参规则。",
  "情侣/夫妻格才谈婚恋推进；兄弟格、朋友格、父母格等只谈相处、边界、扶持与互动，不输出暧昧或婚恋判断。",
  "出生日期在未来、生日缺失、同一人重复选择，均不能合盘。",
  "情侣合盘只允许一男一女；男男/女女不能合盘。",
  `任一方未满${WENTIAN_HEPAN_MIN_AGE}岁不能合盘；双方年龄相差超过${WENTIAN_HEPAN_MAX_AGE_GAP}岁不能合盘。`,
  "追问时必须围绕两张盘和本次合盘格局回答，不要退回单人命盘读盘。",
].join("\n");
const WENTIAN_CLIENT_ID_KEY = "ziwei_client_id";
const WENTIAN_LANGUAGE_STORAGE_KEY = "wentian-app-language-v1";
const WENTIAN_PROFILE_STORAGE_KEY = "wentian-app-profile-v1";
const WENTIAN_AUTH_RETURN_KEY = "wentian-app-auth-return-v1";
const WENTIAN_AUTH_SESSION_KEY = "wentian-app-auth-session-v1";
const WENTIAN_AUTH_REFRESH_SKEW_MS = 60 * 1000;
const WENTIAN_XU_CONTEXT_KEY = "wentian-xubanxian-context-v1";
const WENTIAN_INVITE_PENDING_KEY = "wentian-app-pending-invite-v1";
const WENTIAN_INVITE_LOCAL_STATUS_KEY = "wentian-app-invite-status-v1";
const WENTIAN_MEMBER_PRODUCT_KEY = "monthly_member";
const WENTIAN_FREE_DAILY_LIMIT = 30;
const WENTIAN_PAID_DAILY_LIMIT = 100;
const WENTIAN_PAID_PRODUCT_NAME = "阅天AI付费版";
const WENTIAN_PAID_PRODUCT_DESC = "许半仙 AI 对话：付费用户 100次/天；免费用户 30次/天。按日刷新，不设月额度。";
const WENTIAN_PAYMENT_POLL_MS = 3500;
const WENTIAN_GOOGLE_REDIRECT_BRIDGE = "https://fc842598.github.io/my-webpage/pages/wentian-app.html";
const WENTIAN_GOOGLE_ENABLED = new URLSearchParams(window.location.search).get("overseasAuth") === "1"
  || !/^(www\.)?yuetianai\.com$/i.test(window.location.hostname);
const WENTIAN_CHART_AI_STORAGE_KEY = "wentian-app-chart-ai-v2";
const WENTIAN_HTML2PDF_URL = "../vendor/html2pdf/html2pdf.bundle.min.js?v=20260521-local-vendor";
const WENTIAN_CHART_SPECIAL_MODULES = ["shengong", "hunyin", "jiankang", "caiyun", "shiye"];
const WENTIAN_CHART_AI_TASKS = [
  { module: "overall", label: "整体批命" },
  { module: "current_luck", label: "十年大限" },
  { module: "xiaoxian_liunian", label: "小限流年" },
  { module: "shengong", label: "身宫批命" },
  { module: "hunyin", label: "婚姻批命" },
  { module: "jiankang", label: "健康批命" },
  { module: "caiyun", label: "财运批命" },
  { module: "shiye", label: "事业批命" },
  { module: "life_curve", label: "人生曲线" },
  { module: "action_advice", label: "行动建议" },
];
const WENTIAN_CHART_AI_CHAPTERS = [
  { vol: "卷一", menu: "壹", title: "整体批命", modules: ["overall"], action: "module", module: "overall", actionLabel: "单独批总局", placeholder: "等待 AI 批命生成命盘主线、格局底色与关键提醒。" },
  { vol: "卷二", menu: "贰", title: "专题批命", modules: WENTIAN_CHART_SPECIAL_MODULES, action: "specials", actionLabel: "单独批专题", placeholder: "等待生成身宫、婚姻、健康、财运、事业五项专题。" },
  { vol: "卷三", menu: "叁", title: "十年大限", modules: ["current_luck"], action: "module", module: "current_luck", actionLabel: "批当前十年", placeholder: "等待生成当前大限、流年节奏与时间窗口。" },
  { vol: "卷四", menu: "肆", title: "小限流年", modules: ["xiaoxian_liunian"], action: "module", module: "xiaoxian_liunian", actionLabel: "单独批小限", placeholder: "等待生成当前小限流年、应事宫位与提醒。" },
  { vol: "卷五", menu: "伍", title: "人生曲线", modules: ["life_curve"], action: "module", module: "life_curve", actionLabel: "生成曲线", placeholder: "等待生成客户易懂版人生曲线、低点高点和阶段提醒。" },
  { vol: "卷六", menu: "陆", title: "行动建议", modules: ["action_advice"], action: "module", module: "action_advice", actionLabel: "生成建议", placeholder: "等待汇总风险、时机和可执行建议。" },
];
const WENTIAN_LANGUAGE_OPTIONS = [
  { code: "zh-Hans", label: "简体中文", htmlLang: "zh-CN" },
  { code: "zh-Hant", label: "繁體中文", htmlLang: "zh-TW" },
  { code: "en", label: "English", htmlLang: "en" },
];
let wentianArchiveDraftId = null;
let wentianProfileSearchQuery = "";
let wentianArchiveRemoteLoaded = false;
let wentianArchiveRemotePromise = null;
let wentianLanguageDraft = null;
let wentianHepanSelectedIds = null;
let wentianChartCalMode = "solar";
let wentianChartCity = null;
let wentianMemberStatusPromise = null;
let wentianPaymentPollTimer = null;
let wentianAuthSession = null;
let wentianAuthReadyPromise = null;
let wentianPendingPaymentAfterLogin = false;
let wentianInviteReadyPromise = null;
let wentianHtml2PdfPromise = null;
const wentianAuthState = {
  mode: "login",
  error: "",
  loading: false,
};
const wentianPasswordState = {
  loading: false,
  status: "",
  error: "",
  tone: "",
};
let wentianLogoutConfirmOpen = false;
const wentianInviteState = {
  loaded: false,
  loading: false,
  error: "",
  status: "",
  summary: null,
};
const wentianOrderState = {
  loaded: false,
  loading: false,
  orders: [],
  error: "",
};
const wentianRefundTicketState = {
  open: false,
  loading: false,
  orderNo: "",
  paymentProvider: "wechat",
  paidDate: "",
  contact: "",
  note: "",
  screenshotDataUrl: "",
  screenshotName: "",
  message: "退款需上传当时支付截图，后台审核后进入对应支付渠道处理，7个工作日内完成。",
  error: "",
};
const wentianMemberState = {
  loaded: false,
  quota: null,
  product: {
    productKey: WENTIAN_MEMBER_PRODUCT_KEY,
    name: WENTIAN_PAID_PRODUCT_NAME,
    description: WENTIAN_PAID_PRODUCT_DESC,
    amountFen: 1990,
    amountYuan: "19.90",
  },
  providers: [],
  mockMode: false,
};
const wentianPaymentState = {
  status: "idle",
  orderNo: "",
  payUrl: "",
  payMethod: "",
  message: "",
  error: "",
  mockMode: false,
  provider: "wechat",
  productName: WENTIAN_PAID_PRODUCT_NAME,
  amountYuan: "19.90",
  currency: "CNY",
};
const wentianChartAiState = {
  chartRecordId: "",
  status: "idle",
  runningModule: "",
  results: {},
  curveGenerated: false,
  error: "",
  updatedAt: "",
};
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
const WENTIAN_HEPAN_LIUHE = {
  "子": "丑", "丑": "子",
  "寅": "亥", "亥": "寅",
  "卯": "戌", "戌": "卯",
  "辰": "酉", "酉": "辰",
  "巳": "申", "申": "巳",
  "午": "未", "未": "午",
};
const WENTIAN_HEPAN_TRIADS = [
  ["申", "子", "辰"],
  ["亥", "卯", "未"],
  ["寅", "午", "戌"],
  ["巳", "酉", "丑"],
];
const WENTIAN_STEM_ELEMENTS = {
  "甲": "木", "乙": "木",
  "丙": "火", "丁": "火",
  "戊": "土", "己": "土",
  "庚": "金", "辛": "金",
  "壬": "水", "癸": "水",
};
const WENTIAN_ELEMENT_GENERATES = { "木": "火", "火": "土", "土": "金", "金": "水", "水": "木" };

function getWentianClassicRelations(activeBranch) {
  const activeIndex = WENTIAN_SHICHEN.indexOf(activeBranch);
  if (activeIndex < 0) return { sanhe: [], dui: "" };
  return {
    sanhe: [WENTIAN_SHICHEN[(activeIndex + 4) % 12], WENTIAN_SHICHEN[(activeIndex + 8) % 12]],
    dui: WENTIAN_SHICHEN[(activeIndex + 6) % 12],
  };
}

function getWentianClassicCellClasses(branch, activeBranch) {
  const relations = getWentianClassicRelations(activeBranch);
  if (branch === activeBranch) return "fc-ben";
  if (relations.sanhe.includes(branch)) return "fc-rel fc-sanhe";
  if (relations.dui === branch) return "fc-rel fc-dui";
  return "";
}

function getWentianApiBase() {
  const qs = new URLSearchParams(location.search);
  const queryBase = qs.get("aiBackendBase") || qs.get("pimingApiBase") || qs.get("apiBase") || "";
  const configBase = window.SITE_CONFIG?.aiBackendBase || "";
  return (queryBase || configBase || "https://api.yuetianai.com").replace(/\/+$/, "");
}

function getWentianClientId() {
  try {
    let id = localStorage.getItem(WENTIAN_CLIENT_ID_KEY);
    if (!isWentianUuid(id)) {
      id = makeWentianUuid();
      localStorage.setItem(WENTIAN_CLIENT_ID_KEY, id);
    }
    return id;
  } catch (_err) {
    return "global";
  }
}

function normalizeWentianInviteCode(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
}

function isWentianInviteCode(value) {
  return /^[A-Z0-9]{6,12}$/.test(normalizeWentianInviteCode(value));
}

function makeWentianInviteCode(seed = getWentianClientId()) {
  const text = String(seed || "wentian");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(36).toUpperCase().padStart(8, "0").slice(0, 8);
}

function formatWentianInviteCode(code) {
  return normalizeWentianInviteCode(code).split("").join(" ");
}

function getWentianInviteLink(code = getWentianInviteCode()) {
  return `https://yuetianai.com/pages/wentian-app.html?invite=${encodeURIComponent(normalizeWentianInviteCode(code))}`;
}

function getWentianInviteCode() {
  const user = wentianAuthSession?.user;
  const saved = normalizeWentianInviteCode(user?.user_metadata?.referral_code);
  return isWentianInviteCode(saved) ? saved : makeWentianInviteCode(user?.id || getWentianClientId());
}

function getWentianPendingInviteCode() {
  try {
    return normalizeWentianInviteCode(localStorage.getItem(WENTIAN_INVITE_PENDING_KEY));
  } catch (_err) {
    return "";
  }
}

function setWentianPendingInviteCode(code) {
  const normalized = normalizeWentianInviteCode(code);
  if (!isWentianInviteCode(normalized)) return "";
  try {
    localStorage.setItem(WENTIAN_INVITE_PENDING_KEY, normalized);
  } catch (_err) {}
  return normalized;
}

function clearWentianPendingInviteCode() {
  try {
    localStorage.removeItem(WENTIAN_INVITE_PENDING_KEY);
  } catch (_err) {}
}

function getWentianInviteCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return normalizeWentianInviteCode(params.get("invite") || params.get("ref") || params.get("inviteCode"));
}

function captureWentianInviteFromUrl() {
  const code = getWentianInviteCodeFromUrl();
  if (!isWentianInviteCode(code)) return "";
  setWentianPendingInviteCode(code);
  wentianInviteState.status = "已记录好友邀请码，登录/注册后自动绑定。";
  wentianAuthState.mode = "register";
  return code;
}

function getWentianLocalInviteStatus() {
  try {
    const raw = localStorage.getItem(WENTIAN_INVITE_LOCAL_STATUS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_err) {
    return null;
  }
}

function setWentianLocalInviteStatus(data) {
  try {
    localStorage.setItem(WENTIAN_INVITE_LOCAL_STATUS_KEY, JSON.stringify(data || {}));
  } catch (_err) {}
}

function getWentianInviteSnapshot() {
  const fallbackCode = getWentianInviteCode();
  const fallback = {
    inviteCode: fallbackCode,
    inviteLink: getWentianInviteLink(fallbackCode),
    invitedCount: 0,
    paidCount: 0,
    bonusTalks: 0,
    bonusUsed: 0,
    bonusRemaining: 0,
    registerReward: 2,
    paidReward: 10,
    records: [],
  };
  return { ...fallback, ...(wentianInviteState.summary || {}) };
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

function setWentianChartRecordId(id) {
  if (!id) return "";
  try {
    localStorage.setItem("wentian-xubanxian-chart-record-id", id);
  } catch (_err) {
    wentianFallbackChartRecordId = id;
  }
  return id;
}

function normalizeWentianArchiveNameKey(value) {
  return String(value || "命主").trim().replace(/\s+/g, "");
}

function normalizeWentianArchiveDateTimeKey(value) {
  const source = String(value || "").trim().replace("T", " ").replace(/:00$/, "");
  const match = source.match(/(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})(?:日)?(?:\s+|T)?(\d{1,2})?(?::|时)?(\d{1,2})?/);
  if (!match) return source.slice(0, 16);
  const [, year, month, day, hour = "0", minute = "0"] = match;
  return [
    year,
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-") + ` ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function getWentianArchiveDuplicateKey(archive) {
  const form = archive?.form || {};
  const chartData = archive?.chartData || {};
  const raw = form.remoteRaw || {};
  const rawDateTime = raw.datetime
    || (raw.dateStr ? `${raw.dateStr}T${String(raw.cstHour ?? raw.hour ?? 0).padStart(2, "0")}:${String(raw.cstMinute ?? raw.minute ?? 0).padStart(2, "0")}` : "");
  const nameKey = normalizeWentianArchiveNameKey(form.name || raw.name || chartData.name || "命主");
  const datetimeKey = normalizeWentianArchiveDateTimeKey(form.datetime || rawDateTime || chartData.birthDate || chartData.solarTime || "");
  return nameKey && datetimeKey ? `${nameKey}|${datetimeKey}` : "";
}

function findWentianArchiveDuplicate(archives, archive) {
  const key = getWentianArchiveDuplicateKey(archive);
  if (!key) return null;
  return archives.find((item) => getWentianArchiveDuplicateKey(item) === key) || null;
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

function buildWentianArchiveFromInput({ id, name, gender, datetime, city = "", chartRecordId = makeWentianUuid(), isDefault = false }) {
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
      chartData = buildWentianChartPayload(chart, { gender, date, dateStr, timeIndex, city });
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
    form: { archiveId: id, name, gender, type: "ziwei", datetime, city, useTrueSolar: true, isDefault },
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
        useTrueSolar: true,
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
  const normalized = {
    ...archive,
    id,
    chartRecordId,
    chartData: { ...archive.chartData, chartRecordId },
    form: { ...(archive.form || {}), archiveId: id },
  };
  const onlyRecordId = Object.keys(normalized.chartData || {}).every((key) => key === "chartRecordId");
  const raw = normalized.form.remoteRaw || {};
  const rawDateTime = raw.datetime
    || (raw.dateStr ? `${raw.dateStr}T${String(raw.cstHour ?? raw.hour ?? 0).padStart(2, "0")}:${String(raw.cstMinute ?? raw.minute ?? 0).padStart(2, "0")}` : "");
  const datetime = normalized.form.datetime || rawDateTime;
  if (onlyRecordId && datetime) {
    return {
      ...buildWentianArchiveFromInput({
        id,
        chartRecordId,
        name: normalized.form.name || raw.name || "命主",
        gender: normalized.form.gender || raw.gender || "male",
        datetime,
        city: normalized.form.city || raw.city?.name || raw.city || "",
      }),
      createdAt: normalized.createdAt,
      updatedAt: normalized.updatedAt,
    };
  }
  return normalized;
}

function getWentianArchiveStamp(archive) {
  const stamp = Date.parse(archive?.updatedAt || archive?.createdAt || "");
  return Number.isFinite(stamp) ? stamp : 0;
}

function mergeWentianArchives(localArchives, remoteArchives) {
  const merged = new Map();
  const add = (archive) => {
    const normalized = normalizeWentianArchive(archive);
    if (!normalized) return;
    const key = getWentianArchiveDuplicateKey(normalized) || normalized.id || normalized.chartRecordId;
    const old = merged.get(key);
    if (!old || getWentianArchiveStamp(normalized) >= getWentianArchiveStamp(old)) {
      merged.set(key, normalized);
    }
  };
  remoteArchives.forEach(add);
  localArchives.forEach(add);
  return Array.from(merged.values())
    .sort((a, b) => getWentianArchiveStamp(b) - getWentianArchiveStamp(a))
    .slice(0, 50);
}

async function fetchWentianRemoteArchives() {
  const clientId = getWentianClientId();
  const response = await fetch(`${getWentianApiBase()}/api/wentian/archives?clientId=${encodeURIComponent(clientId)}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) throw new Error(data.error || "档案读取失败");
  return data;
}

async function pushWentianArchivesToRemote(archives) {
  try {
    const clientId = getWentianClientId();
    const syncArchives = archives
      .map(normalizeWentianArchive)
      .filter((archive) => archive && !archive.form?.isDefault)
      .slice(0, 50);
    if (!syncArchives.length) return;
    await fetch(`${getWentianApiBase()}/api/wentian/archives`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        archives: syncArchives,
        selectedArchiveId: getWentianSelectedArchiveId(archives),
      }),
    });
  } catch (error) {
    console.info("wentian archive remote sync fallback", error);
  }
}

async function hydrateWentianArchivesFromRemote(options = {}) {
  if (wentianArchiveRemotePromise) return wentianArchiveRemotePromise;
  if (wentianArchiveRemoteLoaded && !options.force) return null;
  wentianArchiveRemotePromise = fetchWentianRemoteArchives()
    .then((data) => {
      wentianArchiveRemoteLoaded = true;
      const localArchives = readWentianArchives().map(normalizeWentianArchive).filter(Boolean);
      const remoteArchives = (Array.isArray(data.archives) ? data.archives : []).map(normalizeWentianArchive).filter(Boolean);
      const merged = mergeWentianArchives(localArchives, remoteArchives);
      const before = JSON.stringify(localArchives.map((item) => item.id));
      const after = JSON.stringify(merged.map((item) => item.id));
      if (merged.length) writeWentianArchives(merged);
      if (data.selectedArchiveId && merged.some((item) => item.id === data.selectedArchiveId)) {
        setWentianSelectedArchiveId(data.selectedArchiveId);
      }
      if (merged.length && remoteArchives.length < merged.length) pushWentianArchivesToRemote(merged);
      if (options.rerender && before !== after && (state.route === "screen-5" || state.route === "screen-25")) {
        navigate(state.route, false);
      }
      return merged;
    })
    .catch((error) => {
      console.info("wentian archive remote load fallback", error);
      return null;
    })
    .finally(() => {
      wentianArchiveRemotePromise = null;
    });
  return wentianArchiveRemotePromise;
}

function getWentianArchiveList() {
  let archives = readWentianArchives().map(normalizeWentianArchive).filter(Boolean);
  const currentArchive = archiveFromChartState(getWentianSavedChart());
  if (!archives.length) archives = getDefaultWentianArchives();
  if (currentArchive && !archives.some((item) => item.id === currentArchive.id || getWentianArchiveDuplicateKey(item) === getWentianArchiveDuplicateKey(currentArchive))) {
    archives.unshift(currentArchive);
  }
  const merged = mergeWentianArchives(archives, []);
  writeWentianArchives(merged);
  return merged;
}

function saveWentianArchiveFromChartState(chartState) {
  const archive = archiveFromChartState(chartState);
  if (!archive) return;
  const archives = getWentianArchiveList();
  const archiveKey = getWentianArchiveDuplicateKey(archive);
  const index = archives.findIndex((item) => item.id === archive.id || item.chartRecordId === archive.chartRecordId || (archiveKey && getWentianArchiveDuplicateKey(item) === archiveKey));
  const old = index >= 0 ? archives[index] : null;
  const stableId = old?.id || archive.id;
  const stableRecordId = old?.chartRecordId || archive.chartRecordId;
  const archiveWithStamp = {
    ...archive,
    id: stableId,
    chartRecordId: stableRecordId,
    chartData: { ...archive.chartData, chartRecordId: stableRecordId },
    form: { ...(archive.form || {}), archiveId: stableId },
    updatedAt: new Date().toISOString(),
  };
  if (index >= 0) archives[index] = archiveWithStamp;
  else archives.unshift(archiveWithStamp);
  const merged = mergeWentianArchives(archives, []);
  writeWentianArchives(merged);
  setWentianSelectedArchiveId(archiveWithStamp.id);
  pushWentianArchivesToRemote(merged);
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

function padWentianNumber(value) {
  return String(value).padStart(2, "0");
}

function formatWentianDateInputValue(date) {
  return `${date.getFullYear()}-${padWentianNumber(date.getMonth() + 1)}-${padWentianNumber(date.getDate())}T${padWentianNumber(date.getHours())}:${padWentianNumber(date.getMinutes())}`;
}

function getWentianNumber(id) {
  const value = Number(document.getElementById(id)?.value);
  return Number.isFinite(value) ? value : 0;
}

function getWentianCityRows() {
  try {
    return typeof CITIES !== "undefined" && Array.isArray(CITIES) ? CITIES : [];
  } catch (_err) {
    return [];
  }
}

function makeWentianCity(row) {
  if (!row) return null;
  return {
    province: row[0],
    city: row[1],
    name: `${row[0]} ${row[1]}`,
    lon: Number(row[2]),
    lat: Number(row[3]),
    tzOffset: Number(row[4] ?? 8),
  };
}

function formatWentianCity(city) {
  if (!city) return "";
  return city.province === city.city ? `中国-${city.city}` : `${city.province}-${city.city}`;
}

function findWentianCity(query) {
  const q = String(query || "").trim().toLowerCase().replace(/\s/g, "");
  if (!q) return null;
  const row = getWentianCityRows().find((item) => {
    const province = String(item[0] || "").toLowerCase();
    const city = String(item[1] || "").toLowerCase();
    const text = `${province}${city}${province} ${city}`.replace(/\s/g, "");
    return text.includes(q) || city.replace(/\s/g, "").includes(q);
  });
  return makeWentianCity(row);
}

function populateWentianChartSelects() {
  const month = document.getElementById("wentian-chart-month");
  const day = document.getElementById("wentian-chart-day");
  const lunarMonth = document.getElementById("wentian-chart-lunar-month");
  const lunarDay = document.getElementById("wentian-chart-lunar-day");
  const hour = document.getElementById("wentian-chart-hour");
  const minute = document.getElementById("wentian-chart-minute");
  if (month && !month.options.length) {
    month.innerHTML = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}月</option>`).join("");
  }
  if (lunarMonth && !lunarMonth.options.length) {
    lunarMonth.innerHTML = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"].map((name, i) => `<option value="${i + 1}">${name}</option>`).join("");
  }
  if (hour && !hour.options.length) {
    hour.innerHTML = Array.from({ length: 24 }, (_, i) => `<option value="${i}">${padWentianNumber(i)}时</option>`).join("");
  }
  if (minute && !minute.options.length) {
    minute.innerHTML = Array.from({ length: 60 }, (_, i) => `<option value="${i}">${padWentianNumber(i)}分</option>`).join("");
  }
  updateWentianChartDayOptions(day, getWentianNumber("wentian-chart-year"), getWentianNumber("wentian-chart-month"));
  updateWentianChartDayOptions(lunarDay, 0, 0, 30);
}

function updateWentianChartDayOptions(dayEl, year, month, forcedMax) {
  if (!dayEl) return;
  const previous = Number(dayEl.value) || 1;
  const max = forcedMax || (year && month ? new Date(year, month, 0).getDate() : 31);
  dayEl.innerHTML = Array.from({ length: max }, (_, i) => `<option value="${i + 1}">${i + 1}日</option>`).join("");
  dayEl.value = String(Math.min(previous, max));
}

function setWentianChartCalendarMode(mode) {
  wentianChartCalMode = mode === "lunar" ? "lunar" : "solar";
  const hidden = document.getElementById("wentian-chart-cal");
  if (hidden) hidden.value = wentianChartCalMode;
  document.querySelectorAll("[data-wentian-chart-cal]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.wentianChartCal === wentianChartCalMode);
  });
  const solar = document.getElementById("wentian-chart-solar-fields");
  const lunar = document.getElementById("wentian-chart-lunar-fields");
  if (solar) solar.style.display = wentianChartCalMode === "solar" ? "grid" : "none";
  if (lunar) lunar.style.display = wentianChartCalMode === "lunar" ? "grid" : "none";
  updateWentianChartPreview();
}

function setWentianChartButtonValue(group, value) {
  const input = document.getElementById(`wentian-chart-${group}`);
  if (input) input.value = value;
  document.querySelectorAll(`[data-wentian-chart-${group}]`).forEach((btn) => {
    btn.classList.toggle("active", btn.dataset[`wentianChart${group[0].toUpperCase()}${group.slice(1)}`] === value);
  });
}

function getWentianChartDefaultGender(form = {}) {
  return normalizeWentianArchiveGender({
    form,
    gender: form.gender,
    chartData: { gender: form.gender },
  }) || "male";
}

function getWentianChartDefaultTrueSolar(form = {}) {
  if (form.trueSolarChoiceSet && form.useTrueSolar === false) return false;
  return true;
}

const WENTIAN_LUNAR_MONTH_NAMES = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

function getWentianLunarMonthName(month) {
  return WENTIAN_LUNAR_MONTH_NAMES[Number(month) - 1] || `${month}月`;
}

function getWentianLunarLeapMonth(year) {
  const VendorLunarYear = globalThis?.LunarYear;
  if (VendorLunarYear && typeof VendorLunarYear.fromYear === "function") {
    try {
      return Math.abs(Number(VendorLunarYear.fromYear(Number(year))?.getLeapMonth?.())) || 0;
    } catch (_err) {}
  }
  return 0;
}

function getWentianLunarMonthMax(year, month, isLeap = false) {
  if (typeof lunarToSolar === "function") {
    for (let day = 30; day >= 28; day--) {
      if (lunarToSolar(Number(year), Number(month), day, !!isLeap)) return day;
    }
  }
  return 30;
}

function getWentianNextLunarMonth(year, month) {
  const y = Number(year);
  const m = Number(month);
  return m >= 12 ? { year: y + 1, month: 1 } : { year: y, month: m + 1 };
}

function formatWentianLunarRuleLabel(year, month, day, isLeap = false) {
  return `${year}年${isLeap ? "闰" : ""}${getWentianLunarMonthName(month)}${day}日`;
}

function getWentianLeapMonthRuleInfo(lunar, enabled = true) {
  if (!enabled || !lunar?.isLeap) return { enabled: !!enabled, applied: false };
  const next = getWentianNextLunarMonth(lunar.year, lunar.month);
  let effectiveDay = Number(lunar.day) || 1;
  if (typeof lunarToSolar === "function") {
    while (effectiveDay > 1 && !lunarToSolar(next.year, next.month, effectiveDay, false)) effectiveDay--;
  }
  return {
    enabled: true,
    applied: true,
    actual: { year: lunar.year, month: lunar.month, day: lunar.day },
    effective: { year: next.year, month: next.month, day: effectiveDay },
    actualLabel: formatWentianLunarRuleLabel(lunar.year, lunar.month, lunar.day, true),
    effectiveLabel: formatWentianLunarRuleLabel(next.year, next.month, effectiveDay, false),
  };
}

function renderWentianChartCityDropdown(query) {
  const dropdown = document.getElementById("wentian-chart-city-dropdown");
  if (!dropdown) return;
  const q = String(query || "").trim().toLowerCase();
  if (!q) {
    dropdown.style.display = "none";
    dropdown.innerHTML = "";
    return;
  }
  const rows = getWentianCityRows()
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => `${row[0]}${row[1]} ${row[0]} ${row[1]}`.toLowerCase().includes(q))
    .slice(0, 8);
  if (!rows.length) {
    dropdown.style.display = "none";
    dropdown.innerHTML = "";
    return;
  }
  dropdown.innerHTML = rows.map(({ row, index }) => `
    <button type="button" class="wentian-chart-city-item" data-action="wentian-chart-city-pick" data-city-index="${index}">
      ${escapeHtml(row[0])} · ${escapeHtml(row[1])}<br><span>${Number(row[2]).toFixed(2)}°E / ${Number(row[3]).toFixed(2)}°N</span>
    </button>
  `).join("");
  dropdown.style.display = "block";
}

function applyWentianChartCity(city) {
  wentianChartCity = city || null;
  const input = document.getElementById("wentian-chart-city");
  const clear = document.getElementById("wentian-chart-city-clear");
  const selected = document.getElementById("wentian-chart-city-selected");
  const dropdown = document.getElementById("wentian-chart-city-dropdown");
  if (input) input.value = city ? `${city.province} · ${city.city}` : "";
  if (clear) clear.style.display = city ? "" : "none";
  if (selected) {
    selected.textContent = city ? `已选：${formatWentianCity(city)} · ${Number(city.lon).toFixed(2)}°E` : "";
    selected.style.display = city ? "block" : "none";
  }
  if (dropdown) dropdown.style.display = "none";
  updateWentianChartPreview();
}

function getWentianChartDateParts() {
  const mode = document.getElementById("wentian-chart-cal")?.value || wentianChartCalMode || "solar";
  const hour = getWentianNumber("wentian-chart-hour");
  const minute = getWentianNumber("wentian-chart-minute");
  const autoLeapMonth = document.getElementById("wentian-chart-lunar-leap")?.checked !== false;
  let year;
  let month;
  let day;
  let date;
  let calModeLabel;
  let lunar = null;
  let leapMonthRule = { enabled: autoLeapMonth, applied: false };

  if (mode === "lunar") {
    year = getWentianNumber("wentian-chart-lunar-year");
    month = getWentianNumber("wentian-chart-lunar-month");
    day = getWentianNumber("wentian-chart-lunar-day");
    if (!year || !month || !day) throw new Error("请填写完整的农历出生年月日");
    if (typeof lunarToSolar !== "function") throw new Error("农历转换模块未加载，请刷新后重试");
    const isLeap = autoLeapMonth && getWentianLunarLeapMonth(year) === month;
    const solar = lunarToSolar(year, month, day, isLeap);
    if (!solar) throw new Error("农历日期无效或超出支持范围");
    date = new Date(solar.getFullYear(), solar.getMonth(), solar.getDate(), hour, minute);
    lunar = { year, month, day, isLeap, leapMonth: getWentianLunarLeapMonth(year) };
    leapMonthRule = getWentianLeapMonthRuleInfo(lunar, autoLeapMonth);
    calModeLabel = `农历 ${formatWentianLunarRuleLabel(year, month, day, isLeap)}`;
  } else {
    year = getWentianNumber("wentian-chart-year");
    month = getWentianNumber("wentian-chart-month");
    day = getWentianNumber("wentian-chart-day");
    if (!year || !month || !day) throw new Error("请填写完整的出生年月日");
    date = new Date(year, month - 1, day, hour, minute);
    if (typeof solarToLunar === "function") {
      lunar = solarToLunar(year, month, day);
      leapMonthRule = getWentianLeapMonthRuleInfo(lunar, autoLeapMonth);
    }
    calModeLabel = `公历 ${year}-${padWentianNumber(month)}-${padWentianNumber(day)}`;
  }

  if (year < 1900 || year > 2030) throw new Error("出生年份请填写 1900-2030");
  if (Number.isNaN(date.getTime())) throw new Error("出生日期无效");
  return { mode, date, hour, minute, calModeLabel, lunar, leapMonthRule, autoLeapMonth };
}

function getWentianSolarLeapRuleInfo(date, autoLeapMonth = true) {
  if (!date || Number.isNaN(date.getTime()) || typeof solarToLunar !== "function") {
    return { lunar: null, leapMonthRule: { enabled: autoLeapMonth, applied: false } };
  }
  const lunar = solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return {
    lunar,
    leapMonthRule: getWentianLeapMonthRuleInfo(lunar, autoLeapMonth),
  };
}

function updateWentianChartPreview() {
  const preview = document.getElementById("wentian-chart-preview");
  const tst = document.getElementById("wentian-chart-tst");
  const hiddenDate = document.getElementById("wentian-chart-date");
  try {
    const parts = getWentianChartDateParts();
    const dateStr = `${parts.date.getFullYear()}-${padWentianNumber(parts.date.getMonth() + 1)}-${padWentianNumber(parts.date.getDate())}`;
    const timeStr = `${padWentianNumber(parts.hour)}:${padWentianNumber(parts.minute)}`;
    if (hiddenDate) hiddenDate.value = `${dateStr}T${timeStr}`;
    const leapText = parts.leapMonthRule?.applied ? ` · ${parts.leapMonthRule.actualLabel}按${parts.leapMonthRule.effectiveLabel}排盘` : "";
    if (preview) preview.textContent = `${parts.calModeLabel} · 北京时间 ${timeStr}${leapText}`;
    const cityText = document.getElementById("wentian-chart-city")?.value.trim() || "";
    const city = wentianChartCity || findWentianCity(cityText);
    if (tst && typeof calcTrueSolarTime === "function") {
      const result = calcTrueSolarTime({
        year: parts.date.getFullYear(),
        month: parts.date.getMonth() + 1,
        day: parts.date.getDate(),
        hour: parts.hour,
        minute: parts.minute,
        longitude: city?.lon || 116.4,
        tzOffset: city?.tzOffset ?? 8,
        cityName: city ? formatWentianCity(city) : "北京（默认）",
      });
      const used = document.getElementById("wentian-chart-true-solar")?.checked;
      const shichen = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"][getWentianTimeIndex(result.trueSolarHour, result.trueSolarMinute)] || "";
      tst.textContent = `${used ? "已采用" : "预览"}真太阳时：${padWentianNumber(result.trueSolarHour)}:${padWentianNumber(result.trueSolarMinute)} · ${shichen}时 · ${result.diffStr}`;
    }
  } catch (error) {
    if (preview) preview.textContent = error.message || "";
    if (tst) tst.textContent = "请先补全出生时间，地点可选。";
  }
}

function getWentianIztroLib() {
  return window.iztro?.astro || window.iztro || null;
}

function createWentianChartWithLeapRule(lib, norm, genderText) {
  const leapRule = norm?.leapMonthRule;
  if (leapRule?.applied) {
    const lunar = leapRule.effective;
    const lunarDateStr = `${lunar.year}-${lunar.month}-${lunar.day}`;
    if (typeof lib.byLunar === "function") return lib.byLunar(lunarDateStr, norm.timeIndex, genderText, false, false);
    if (typeof lib.astrolabeByLunarDate === "function") return lib.astrolabeByLunarDate(lunarDateStr, norm.timeIndex, genderText, false, false);
  }
  return typeof lib.bySolar === "function"
    ? lib.bySolar(norm.dateStr, norm.timeIndex, genderText, true)
    : lib.astrolabeBySolarDate(norm.dateStr, norm.timeIndex, genderText, true);
}

function buildWentianChartNormFromSaved(saved, date) {
  const form = saved?.form || {};
  const cityDetail = form.cityDetail || findWentianCity(form.city || "");
  const city = cityDetail ? formatWentianCity(cityDetail) : (form.city || "");
  const useTrueSolar = form.useTrueSolar !== false;
  const autoLeapMonth = form.autoLeapMonth !== false;
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
      longitude: cityDetail?.lon || 116.4,
      tzOffset: cityDetail?.tzOffset ?? 8,
      cityName: city || "北京（默认）",
    });
    calcHour = trueSolarResult.trueSolarHour;
    calcMinute = trueSolarResult.trueSolarMinute;
  }
  const { leapMonthRule } = getWentianSolarLeapRuleInfo(date, autoLeapMonth);
  const dateStr = `${date.getFullYear()}-${padWentianNumber(date.getMonth() + 1)}-${padWentianNumber(date.getDate())}`;
  return {
    name: form.name || saved?.chartData?.name || "",
    gender: form.gender || saved?.chartData?.gender || "male",
    type: form.type || "ziwei",
    city,
    cityDetail,
    date,
    dateStr,
    timeIndex: getWentianTimeIndex(calcHour, calcMinute),
    trueSolarResult,
    useTrueSolar,
    calMode: "solar",
    calModeLabel: `公历 ${dateStr}`,
    autoLeapMonth,
    leapMonthRule,
  };
}

function stepWentianClassicChartTime(hoursDelta) {
  const saved = getWentianDisplayChartState();
  if (!saved?.chart) return;
  const baseDate = new Date(saved.form?.datetime || saved.chartData?.birthDate || Date.now());
  if (Number.isNaN(baseDate.getTime())) return;
  const nextDate = new Date(baseDate.getTime());
  nextDate.setHours(nextDate.getHours() + hoursDelta);

  const lib = getWentianIztroLib();
  if (!lib) return;
  const norm = buildWentianChartNormFromSaved(saved, nextDate);
  const genderText = norm.gender === "male" ? "男" : "女";
  const chart = createWentianChartWithLeapRule(lib, norm, genderText);
  const chartData = buildWentianChartPayload(chart, norm);
  resetWentianChartAiState(chartData.chartRecordId);
  saveWentianChart({
    ...saved,
    chart,
    chartData,
    form: {
      ...(saved.form || {}),
      archiveId: saved.form?.archiveId || `archive-${chartData.chartRecordId}`,
      name: norm.name,
      gender: norm.gender,
      type: norm.type,
      city: norm.city,
      cityDetail: norm.cityDetail,
      calMode: norm.calMode,
      calModeLabel: norm.calModeLabel,
      autoLeapMonth: norm.autoLeapMonth,
      leapMonthRule: norm.leapMonthRule,
      datetime: formatWentianDateInputValue(nextDate),
      useTrueSolar: norm.useTrueSolar,
      trueSolarChoiceSet: true,
    },
    updatedAt: new Date().toISOString(),
  });
  navigate("screen-27", false);
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
  const currentYear = new Date().getFullYear();
  const birthYear = norm?.date?.getFullYear?.() || Number(String(chart?.solarDate || "").slice(0, 4)) || WENTIAN_XU_CHART_BASE.birthYear;
  const realCurrentAge = birthYear ? currentYear - birthYear + 1 : 0;
  const yearMutagens = palacesSummary.flatMap((palace) => [
    ...(palace.majorStars || []),
    ...(palace.minorStars || []),
  ].filter((star) => star?.mutagen).map((star) => ({
    star: star.name || "",
    type: star.mutagen || "",
    palace: palace.name || "",
  })));
  const dayunTable = palacesSummary.map((palace) => {
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
  }).filter(Boolean);
  const currentDecade = dayunTable.find((item) => realCurrentAge >= item.ageStart && realCurrentAge <= item.ageEnd) || null;
  return {
    ...WENTIAN_XU_CHART_BASE,
    chartRecordId: getWentianChartRecordId(),
    gender: norm?.gender || "male",
    birthDate,
    solarTime: birthDate,
    birthYear,
    birthMonth: norm?.date ? norm.date.getMonth() + 1 : WENTIAN_XU_CHART_BASE.birthMonth,
    birthDay: norm?.date?.getDate?.() || WENTIAN_XU_CHART_BASE.birthDay,
    birthHour: norm?.date?.getHours?.() || WENTIAN_XU_CHART_BASE.birthHour,
    realCurrentAge,
    activeAge: realCurrentAge || 1,
    currentYear,
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
    yearMutagens,
    palacesSummary,
    currentDecade,
    dayunTable,
    sizhu,
  };
}

function getWentianChartPayload() {
  const chartRecordId = getWentianChartRecordId();
  const saved = getWentianSavedChart();
  if (saved?.chartData) return { ...saved.chartData, chartRecordId };
  return { ...WENTIAN_XU_CHART_BASE, chartRecordId };
}

function syncWentianChartAiStateFromStorage() {
  const chartRecordId = getWentianChartPayload().chartRecordId;
  if (wentianChartAiState.chartRecordId === chartRecordId) return;
  Object.assign(wentianChartAiState, {
    chartRecordId,
    status: "idle",
    runningModule: "",
    results: {},
    curveGenerated: false,
    error: "",
    updatedAt: "",
  });
  try {
    const all = JSON.parse(localStorage.getItem(WENTIAN_CHART_AI_STORAGE_KEY) || "{}");
    const saved = all?.[chartRecordId];
    if (saved && typeof saved === "object") {
      const resultCount = Object.keys(saved.results || {}).length;
      Object.assign(wentianChartAiState, {
        chartRecordId,
        status: saved.status === "running" ? (resultCount ? "done" : "idle") : (saved.status || "done"),
        runningModule: "",
        results: saved.results || {},
        curveGenerated: !!saved.curveGenerated,
        error: saved.error || "",
        updatedAt: saved.updatedAt || "",
      });
    }
  } catch (_err) {}
}

function saveWentianChartAiState() {
  try {
    const all = JSON.parse(localStorage.getItem(WENTIAN_CHART_AI_STORAGE_KEY) || "{}");
    all[wentianChartAiState.chartRecordId] = {
      status: wentianChartAiState.status,
      results: wentianChartAiState.results,
      curveGenerated: !!wentianChartAiState.curveGenerated,
      error: wentianChartAiState.error,
      updatedAt: wentianChartAiState.updatedAt,
    };
    localStorage.setItem(WENTIAN_CHART_AI_STORAGE_KEY, JSON.stringify(all));
  } catch (_err) {}
}

function resetWentianChartAiState(chartRecordId = "") {
  Object.assign(wentianChartAiState, {
    chartRecordId: chartRecordId || getWentianChartPayload().chartRecordId,
    status: "idle",
    runningModule: "",
    results: {},
    curveGenerated: false,
    error: "",
    updatedAt: "",
  });
  saveWentianChartAiState();
}

function parseWentianAiJson(value) {
  if (!value || typeof value !== "string") return null;
  const text = value.trim();
  if (!text || !/^[{[]/.test(text)) return null;
  try {
    return JSON.parse(text);
  } catch (_err) {
    return null;
  }
}

function cleanWentianAiText(value) {
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```[a-z]*\n?/gi, "").replace(/```/g, ""))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(^|\n)\s{0,3}#{1,6}\s*/g, "$1")
    .replace(/(^|\n)\s{0,3}>\s*/g, "$1")
    .replace(/(^|\n)\s*[-*+]\s+/g, "$1")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/__([^_\n]+)__/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeWentianAiText(value) {
  return cleanWentianAiText(value).replace(/\s+/g, " ").trim();
}

function normalizeWentianAiData(data) {
  if (!data) return null;
  const root = parseWentianAiJson(data) || data;
  if (!root || typeof root !== "object" || Array.isArray(root)) {
    return { card: { body: cleanWentianAiText(root) } };
  }
  const parsedRoot = parseWentianAiJson(root.finalAnswer) || parseWentianAiJson(root.content) || null;
  const next = { ...root, ...(parsedRoot && typeof parsedRoot === "object" && !Array.isArray(parsedRoot) ? parsedRoot : {}) };
  const nestedCard = parseWentianAiJson(next.card) || next.card || next.data?.card || next.result?.card || parsedRoot?.card || null;
  if (nestedCard && typeof nestedCard === "object" && !Array.isArray(nestedCard)) {
    next.card = { ...nestedCard };
  } else if (typeof nestedCard === "string") {
    next.card = { body: nestedCard };
  } else if (!next.card) {
    next.card = {};
  }
  const bodyCard = parseWentianAiJson(next.card.body || next.card.summary || next.card.content);
  if (bodyCard && typeof bodyCard === "object" && !Array.isArray(bodyCard)) {
    next.card = { ...next.card, ...(bodyCard.card || bodyCard) };
  }
  return next;
}

function getWentianAiCard(data) {
  return normalizeWentianAiData(data)?.card || {};
}

function trimWentianAiText(text, max = 120) {
  const value = normalizeWentianAiText(text);
  if (!value || value.length <= max) return value;
  const head = value.slice(0, max).replace(/[，。；、,.!?！？：:]+$/, "");
  return `${head || value.slice(0, max)}…`;
}

function getWentianAiTitle(data, fallback = "AI解读") {
  const card = getWentianAiCard(data);
  const title = normalizeWentianAiText(card.title || card.name);
  return (title && !/^[a-z_]+$/i.test(title) ? title : fallback).slice(0, 24) || fallback;
}

function getWentianAiSections(data) {
  const normalized = normalizeWentianAiData(data);
  const card = normalized?.card || {};
  const sections = Array.isArray(card.sections) ? card.sections : [];
  if (sections.length) {
    return sections.map((section) => ({
      title: normalizeWentianAiText(section?.title || "解读") || "解读",
      content: cleanWentianAiText(section?.content || section?.body || section?.summary || ""),
    })).filter((section) => section.title || section.content);
  }
  const text = cleanWentianAiText(card.body || card.summary || card.text || normalized?.finalAnswer || normalized?.content || "");
  if (!text) return [];
  const chunks = text.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  return chunks.length > 1
    ? chunks.slice(0, 6).map((chunk, index) => ({ title: index ? "解读" : (getWentianAiTitle(data, "解读")), content: chunk }))
    : [{ title: getWentianAiTitle(data, "解读"), content: text }];
}

function getWentianAiSummary(data, max = 120) {
  if (!data) return "";
  const card = getWentianAiCard(data);
  const sections = getWentianAiSections(data);
  const sectionText = sections.map((section) => [section.title, section.content].filter(Boolean).join("：")).join(" ");
  const points = Array.isArray(card.points) ? card.points.join(" ") : "";
  return trimWentianAiText(card.summary || sectionText || card.body || card.text || points, max);
}

function combineWentianAiSummaries(modules, max = 132) {
  const text = modules
    .map((moduleKey) => getWentianAiSummary(wentianChartAiState.results[moduleKey], 72))
    .filter(Boolean)
    .join(" ");
  return text.slice(0, max);
}

function hasWentianChartAiResults() {
  syncWentianChartAiStateFromStorage();
  return WENTIAN_CHART_AI_TASKS.some((task) => !!wentianChartAiState.results?.[task.module]);
}

function getWentianGeneratedModuleCount() {
  syncWentianChartAiStateFromStorage();
  return WENTIAN_CHART_AI_TASKS.filter((task) => !!wentianChartAiState.results?.[task.module]).length;
}

function getWentianAiTask(moduleKey) {
  return WENTIAN_CHART_AI_TASKS.find((task) => task.module === moduleKey);
}

function renderWentianAiDetailSections(data, fallback, options = {}) {
  const sections = getWentianAiSections(data);
  const limit = Number(options.limit || 4);
  const max = Number(options.max || 260);
  const list = sections.length ? sections.slice(0, limit) : [{ title: "等待生成", content: fallback }];
  return `
    <div class="wentian-mb-detail-list">
      ${list.map((section) => `
        <section>
          <h4>${escapeHtml(section.title || "解读")}</h4>
          <p>${escapeHtml(trimWentianAiText(section.content || fallback, max))}</p>
        </section>
      `).join("")}
    </div>
  `;
}

function renderWentianSpecialDetail() {
  const results = wentianChartAiState.results || {};
  const labels = {
    shengong: "身宫",
    hunyin: "婚姻",
    jiankang: "健康",
    caiyun: "财运",
    shiye: "事业",
  };
  return `
    <div class="wentian-mb-topic-grid">
      ${WENTIAN_CHART_SPECIAL_MODULES.map((moduleKey) => {
        const body = getWentianAiSummary(results[moduleKey], 120) || "等待单独批命生成。";
        return `
          <section class="${results[moduleKey] ? "is-ready" : ""}">
            <span>${escapeHtml(labels[moduleKey] || moduleKey)}</span>
            <p>${escapeHtml(body)}</p>
            <button type="button" data-action="wentian-chart-ai-module" data-ai-module="${escapeHtml(moduleKey)}">${results[moduleKey] ? "重批" : "生成"}</button>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderWentianXiaoLianDetail(data, fallback) {
  const year = getWentianAiCurrentYear(getWentianChartPayload());
  const meta = [
    year.age ? `${year.age}岁` : "",
    year.solarYear ? `${year.solarYear}年` : "",
    year.xiaolianPalaceName ? `小限 ${year.xiaolianPalaceName}` : "",
    year.oppositePalaceName ? `对宫 ${year.oppositePalaceName}` : "",
  ].filter(Boolean);
  return `
    <div class="wentian-mb-year-meta">
      <span>当前小流年</span>
      <b>${escapeHtml(meta.slice(0, 2).join(" · ") || "当前流年")}</b>
      <p>${escapeHtml(meta.slice(2).join("；") || "点击后生成当前小限流年解读。")}</p>
    </div>
    ${renderWentianAiDetailSections(data, fallback, { limit: 4, max: 260 })}
  `;
}

function renderWentianCurveDetail(data, fallback) {
  const sections = getWentianAiSections(data);
  const ready = sections.length > 0;
  const summary = getWentianAiSummary(data, 150);
  return `
    <div class="wentian-mb-curve">
      <div>
        <strong>${ready ? escapeHtml(getWentianAiTitle(data, "人生曲线")) : "生成后显示人生起伏曲线"}</strong>
        <p>${escapeHtml(ready ? summary : (fallback || "对齐电脑端人生曲线模块，给客户看低点、高点和后势。"))}</p>
      </div>
      <svg viewBox="0 0 300 108" aria-hidden="true">
        <path class="area" d="M12 82 C46 64 74 38 104 36 C138 34 146 82 174 72 C212 58 214 22 244 22 C266 22 276 54 288 42 L288 98 L12 98 Z"></path>
        <path class="line" d="M12 82 C46 64 74 38 104 36 C138 34 146 82 174 72 C212 58 214 22 244 22 C266 22 276 54 288 42"></path>
        <circle cx="104" cy="36" r="4"></circle>
        <circle class="warn" cx="174" cy="72" r="4"></circle>
        <circle cx="244" cy="22" r="4"></circle>
      </svg>
      <div class="wentian-mb-curve-kv">
        <span>低点 36岁</span><span>高点 44岁</span><span>后势 56岁</span>
      </div>
    </div>
    ${ready ? renderWentianAiDetailSections(data, fallback, { limit: 3, max: 230 }) : ""}
  `;
}

function getWentianAdviceRows() {
  const results = wentianChartAiState.results || {};
  const sourceText = WENTIAN_CHART_AI_TASKS
    .map((task) => getWentianAiSummary(results[task.module], 150))
    .filter(Boolean)
    .join(" ");
  const sentences = sourceText.match(/[^。！？；.!?;]+[。！？；.!?;]?/g)?.map((item) => item.trim()).filter(Boolean) || [];
  const pick = (words, fallback) => sentences.find((sentence) => words.some((word) => sentence.includes(word))) || fallback;
  return [
    ["风险", pick(["风险", "压力", "注意", "避免", "不宜", "容易"], "先把命盘里的压力点收成清单，重大决定不要只看单点吉凶。")],
    ["时机", pick(["大限", "流年", "今年", "阶段", "窗口"], "先看大限节奏，再定近期动作，避免逆着时间窗口硬冲。")],
    ["动作", pick(["建议", "适合", "可以", "行动", "调整"], "先稳住基本盘，再把可执行的选择一项项落地。")],
  ];
}

function renderWentianAdviceDetail(data, fallback) {
  if (getWentianAiSections(data).length) {
    return renderWentianAiDetailSections(data, fallback, { limit: 4, max: 260 });
  }
  return `
    <div class="wentian-mb-advice">
      ${getWentianAdviceRows().map(([label, text]) => `
        <section>
          <b>${escapeHtml(label)}</b>
          <p>${escapeHtml(trimWentianAiText(text, 126))}</p>
        </section>
      `).join("")}
    </div>
  `;
}

function renderWentianMobileChapter(chapter, index) {
  const results = wentianChartAiState.results || {};
  const result = chapter.module ? results[chapter.module] : null;
  const subtitle = chapter.module && result ? getWentianAiTitle(result, chapter.title) : (chapter.body || chapter.placeholder);
  let body = "";
  if (chapter.action === "specials") {
    body = renderWentianSpecialDetail();
  } else if (chapter.module === "life_curve") {
    body = renderWentianCurveDetail(result, chapter.placeholder);
  } else if (chapter.module === "action_advice") {
    body = renderWentianAdviceDetail(result, chapter.placeholder);
  } else if (chapter.module === "xiaoxian_liunian") {
    body = renderWentianXiaoLianDetail(result, chapter.placeholder);
  } else {
    body = renderWentianAiDetailSections(result, chapter.placeholder);
  }
  const actionAttr = chapter.module
    ? `data-action="wentian-chart-ai-module" data-ai-module="${escapeHtml(chapter.module)}"`
    : `data-action="wentian-chart-ai-${escapeHtml(chapter.action)}"`;
  return `
    <article class="wentian-mb-chapter ${chapter.ready ? "is-ready" : "is-empty"}" data-wentian-report-chapter="${index}">
      <div class="wentian-mb-chapter-head">
        <span>${escapeHtml(chapter.vol)}</span>
        <div>
          <h3>${escapeHtml(chapter.title)}</h3>
          <p>${escapeHtml(chapter.ready ? trimWentianAiText(subtitle, 72) : chapter.placeholder)}</p>
        </div>
        <button type="button" ${actionAttr}>${escapeHtml(chapter.actionLabel)}</button>
      </div>
      ${body}
    </article>
  `;
}

function getWentianChartAiChapters() {
  syncWentianChartAiStateFromStorage();
  const results = wentianChartAiState.results || {};
  return WENTIAN_CHART_AI_CHAPTERS.map((chapter) => {
    const moduleReady = chapter.modules.some((moduleKey) => !!results[moduleKey]);
    const ready = moduleReady;
    const body = chapter.modules.length === 1
        ? getWentianAiSummary(results[chapter.modules[0]], 124)
        : combineWentianAiSummaries(chapter.modules, 124);
    return {
      ...chapter,
      body: body || chapter.placeholder,
      ready,
    };
  });
}

function getWentianZiweiScreenHeight() {
  syncWentianChartAiStateFromStorage();
  const count = getWentianGeneratedModuleCount();
  if (wentianChartAiState.status === "running") return 3240;
  if (count >= 8) return 3500;
  if (count >= 4) return 3320;
  if (count > 0) return 3180;
  return 3060;
}

function normalizeWentianAiStarList(stars) {
  return (Array.isArray(stars) ? stars : [])
    .map((star) => {
      if (!star) return null;
      if (typeof star === "string") return { name: star };
      return {
        name: star.name || "",
        brightness: star.brightness || "",
        mutagen: star.mutagen || null,
      };
    })
    .filter((star) => star?.name);
}

function getWentianAiPalaceByBranch(chartData, branch) {
  if (!branch) return null;
  return (chartData?.palacesSummary || []).find((palace) => palace?.branch === branch || palace?.earthlyBranch === branch) || null;
}

function getWentianAiPalacePayload(palace) {
  if (!palace) return {};
  return {
    name: palace.name || "",
    branch: palace.branch || palace.earthlyBranch || "",
    heavenlyStem: palace.stem || palace.heavenlyStem || "",
    majorStars: normalizeWentianAiStarList(palace.majorStars),
    minorStars: normalizeWentianAiStarList(palace.minorStars),
  };
}

function getWentianAiCurrentDecade(chartData = {}) {
  const activeAge = Number(chartData.activeAge || chartData.realCurrentAge || 0);
  const dayunTable = Array.isArray(chartData.dayunTable) ? chartData.dayunTable : [];
  const current = chartData.currentDecade || {};
  const hasCurrent = Object.keys(current).length > 0;
  const item = dayunTable.find((row) => {
    const start = Number(row.ageStart || row.start || 0);
    const end = Number(row.ageEnd || row.end || 0);
    return activeAge && start && end && activeAge >= start && activeAge <= end;
  }) || (hasCurrent ? current : null) || dayunTable[0] || {};
  const rangeText = String(item.rangeLabel || item.range || current.range || "").match(/\d+/g) || [];
  const ageStart = Number(item.ageStart || item.start || rangeText[0] || 0);
  const ageEnd = Number(item.ageEnd || item.end || rangeText[1] || 0);
  const branch = item.palaceBranch || item.branch || current.branch || "";
  const palace = getWentianAiPalaceByBranch(chartData, branch);
  const palaceName = item.palaceName || item.palace || palace?.name || current.palace || "大限宫";
  const majorStars = normalizeWentianAiStarList(item.majorStars?.length ? item.majorStars : (palace?.majorStars || current.majorStars));
  return {
    rangeKey: `${ageStart || "now"}-${ageEnd || "now"}-${branch || palaceName}`,
    rangeLabel: ageStart && ageEnd ? `${ageStart}-${ageEnd}岁` : (item.rangeLabel || item.range || current.range || "当前十年"),
    ageStart,
    ageEnd,
    palaceName,
    palaceBranch: branch,
    palaceStem: item.palaceStem || item.stem || current.stem || palace?.stem || "",
    majorStars,
    minorStars: normalizeWentianAiStarList(palace?.minorStars),
  };
}

function getWentianAiCurrentYear(chartData = {}) {
  const activeAge = Number(chartData.activeAge || chartData.realCurrentAge || 0);
  const currentYear = Number(chartData.currentYear || new Date().getFullYear());
  const liunianTable = Array.isArray(chartData.liunianTable) ? chartData.liunianTable : [];
  const current = chartData.currentLiunian || {};
  const row = liunianTable.find((item) => Number(item.age) === activeAge)
    || liunianTable.find((item) => Number(item.solarYear) === currentYear)
    || liunianTable[0]
    || {};
  const xiaolianBranch = row.xiaoLianBranch || row.xiaolianBranch || current.xiaoLian || chartData.currentXiaolian?.branch || "";
  const xiaolianPalace = getWentianAiPalaceByBranch(chartData, xiaolianBranch);
  const oppositeIndex = WENTIAN_SHICHEN.indexOf(xiaolianBranch);
  const oppositeBranch = oppositeIndex >= 0 ? WENTIAN_SHICHEN[(oppositeIndex + 6) % 12] : "";
  const oppositePalace = getWentianAiPalaceByBranch(chartData, oppositeBranch);
  return {
    age: activeAge || row.age || "",
    solarYear: row.solarYear || currentYear || "",
    yearGanzhi: row.yearGanzhi || current.yearGanzhi || [chartData.yearStem, chartData.yearBranch].filter(Boolean).join(""),
    xiaolianBranch,
    xiaolianPalaceName: xiaolianPalace?.name || (xiaolianBranch ? `${xiaolianBranch}宫` : ""),
    xiaolianPalace: getWentianAiPalacePayload(xiaolianPalace),
    oppositeBranch,
    oppositePalaceName: oppositePalace?.name || (oppositeBranch ? `${oppositeBranch}宫` : ""),
    oppositePalace: getWentianAiPalacePayload(oppositePalace),
    liunianGuaName: row.liunianGuaName || current.name || "流年小限",
    liunianGuaPeriod: row.liunianGuaPeriod || current.period || String(currentYear || ""),
    lineNum: row.lineNum || current.lineNum || "",
    lineType: row.lineType || current.lineType || "",
    tianjiLineNum: row.lineNum || current.lineNum || "",
    tianjiLineType: row.lineType || current.lineType || "",
  };
}

function getWentianChartAiExtraParams(moduleKey, chartData = {}) {
  const selectedDayun = getWentianAiCurrentDecade(chartData);
  const selectedYear = getWentianAiCurrentYear(chartData);
  if (moduleKey === "current_luck") {
    return { activeAge: chartData.activeAge || chartData.realCurrentAge || "", selectedDayun, decadeData: selectedDayun };
  }
  if (moduleKey === "xiaoxian_liunian") {
    return {
      activeAge: selectedYear.age || chartData.activeAge || "",
      selectedDayun,
      decadeData: selectedDayun,
      selectedYear,
      liunianData: selectedYear,
    };
  }
  if (moduleKey === "life_curve" || moduleKey === "action_advice") {
    return {
      activeAge: chartData.activeAge || chartData.realCurrentAge || "",
      selectedDayun,
      decadeData: selectedDayun,
      selectedYear,
      liunianData: selectedYear,
    };
  }
  return {};
}

function getWentianBackendAiModule(moduleKey) {
  return moduleKey === "xiaoxian_liunian" ? "liunian_year" : moduleKey;
}

function buildWentianChartAiPayload(moduleKey, chartData = {}) {
  const extraParams = getWentianChartAiExtraParams(moduleKey, chartData);
  const selectedYear = extraParams.selectedYear || getWentianAiCurrentYear(chartData);
  const selectedDayun = extraParams.selectedDayun || getWentianAiCurrentDecade(chartData);
  const aiChartData = {
    ...chartData,
    currentDecade: Object.keys(selectedDayun).length ? selectedDayun : chartData.currentDecade,
    currentLiunian: Object.keys(selectedYear).length ? { ...(chartData.currentLiunian || {}), ...selectedYear } : chartData.currentLiunian,
    currentXiaolian: selectedYear.xiaolianBranch
      ? { ...(chartData.currentXiaolian || {}), branch: selectedYear.xiaolianBranch, palaceName: selectedYear.xiaolianPalaceName }
      : chartData.currentXiaolian,
    liunianTable: Array.isArray(chartData.liunianTable) && chartData.liunianTable.length
      ? chartData.liunianTable
      : (selectedYear.age ? [selectedYear] : chartData.liunianTable),
  };
  return {
    moduleKey: getWentianBackendAiModule(moduleKey),
    chartData: aiChartData,
    extraParams,
  };
}

async function callWentianChartAiModule(moduleKey, chartData) {
  return wentianPostJson("/api/ai/run", buildWentianChartAiPayload(moduleKey, chartData), 120000, 1);
}

function refreshWentianChartAiScreen() {
  if (state.route === "screen-27") navigate("screen-27", false);
}

function scrollToWentianMobileChapter(index) {
  window.setTimeout(() => {
    document.querySelector(`[data-wentian-report-chapter="${Number(index) || 0}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

async function decodeWentianChartAiModules(moduleKeys, options = {}) {
  syncWentianChartAiStateFromStorage();
  if (wentianChartAiState.status === "running") return;
  const chartData = getWentianChartPayload();
  Object.assign(wentianChartAiState, {
    chartRecordId: chartData.chartRecordId,
    status: "running",
    runningModule: "",
    results: options.reset ? {} : { ...(wentianChartAiState.results || {}) },
    curveGenerated: options.reset ? false : !!wentianChartAiState.curveGenerated,
    error: "",
    updatedAt: "",
  });
  refreshWentianChartAiScreen();
  let success = 0;
  const tasks = moduleKeys.map(getWentianAiTask).filter(Boolean);
  for (const task of tasks) {
    wentianChartAiState.runningModule = task.module;
    refreshWentianChartAiScreen();
    try {
      wentianChartAiState.results[task.module] = await callWentianChartAiModule(task.module, chartData);
      success += 1;
      saveWentianChartAiState();
    } catch (error) {
      wentianChartAiState.error = error.message || `${task.label}生成失败`;
    }
  }
  if (options.curveGenerated) wentianChartAiState.curveGenerated = true;
  Object.assign(wentianChartAiState, {
    status: success || hasWentianChartAiResults() ? "done" : "error",
    runningModule: "",
    updatedAt: new Date().toISOString(),
  });
  saveWentianChartAiState();
  refreshWentianChartAiScreen();
  if (Number.isInteger(options.scrollIndex)) scrollToWentianMobileChapter(options.scrollIndex);
  return success;
}

async function decodeWentianChartAi() {
  return decodeWentianChartAiModules(WENTIAN_CHART_AI_TASKS.map((task) => task.module), {
    reset: true,
  });
}

async function decodeWentianChartAiModule(moduleKey) {
  const task = getWentianAiTask(moduleKey);
  if (!task) return 0;
  const indexMap = {
    overall: 0,
    current_luck: 2,
    xiaoxian_liunian: 3,
    life_curve: 4,
    action_advice: 5,
  };
  const scrollIndex = indexMap[moduleKey] ?? (WENTIAN_CHART_SPECIAL_MODULES.includes(moduleKey) ? 1 : 0);
  return decodeWentianChartAiModules([moduleKey], { scrollIndex });
}

async function decodeWentianChartAiSpecials() {
  return decodeWentianChartAiModules(WENTIAN_CHART_SPECIAL_MODULES, { scrollIndex: 1 });
}

async function decodeWentianChartAiAdvice() {
  return decodeWentianChartAiModule("action_advice");
}

function generateWentianChartCurve() {
  return decodeWentianChartAiModule("life_curve");
}

function loadWentianHtml2Pdf() {
  if (window.html2pdf) return Promise.resolve(window.html2pdf);
  if (wentianHtml2PdfPromise) return wentianHtml2PdfPromise;
  wentianHtml2PdfPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WENTIAN_HTML2PDF_URL;
    script.async = true;
    script.onload = () => (window.html2pdf ? resolve(window.html2pdf) : reject(new Error("PDF library unavailable")));
    script.onerror = () => reject(new Error("PDF library failed to load"));
    document.head.appendChild(script);
  });
  return wentianHtml2PdfPromise;
}

function safeWentianPdfFileName(value) {
  return String(value || "个人命盘")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "")
    .slice(0, 48) || "个人命盘";
}

function formatWentianPdfNow() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function getWentianPdfBirthDate(saved) {
  const form = saved?.form || {};
  const chartData = saved?.chartData || {};
  const raw = form.datetime || chartData.birthDate || chartData.solarTime || saved?.chart?.solarDate || "";
  const date = new Date(String(raw).replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatWentianPdfDateKey(saved) {
  const date = getWentianPdfBirthDate(saved);
  if (!date) return "chart";
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

function formatWentianPdfBirthText(saved) {
  const date = getWentianPdfBirthDate(saved);
  if (!date) return String(saved?.chartData?.birthDate || saved?.chartData?.solarTime || saved?.chart?.solarDate || "未填");
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getWentianPdfPillars(saved) {
  const chart = saved?.chart || {};
  const sizhu = saved?.chartData?.sizhu || extractWentianPillars(chart);
  const pillar = (key) => sizhu?.[key] || `${sizhu?.[`${key}Stem`] || ""}${sizhu?.[`${key}Branch`] || ""}`;
  return ["year", "month", "day", "hour"].map(pillar).filter(Boolean).join(" ");
}

function getWentianPdfShichen(saved) {
  const chartData = saved?.chartData || {};
  const birthDate = getWentianPdfBirthDate(saved) || new Date();
  const timeIndex = Number.isFinite(Number(chartData.timeIndex))
    ? Number(chartData.timeIndex)
    : getWentianTimeIndex(birthDate.getHours(), birthDate.getMinutes());
  return `${WENTIAN_SHICHEN[timeIndex] || ""}时`;
}

function getWentianPdfStarText(star) {
  if (!star) return "";
  if (typeof star === "string") return star;
  return `${star.name || ""}${star.brightness || ""}`.trim();
}

function getWentianPdfPalaceStars(palace, key, limit) {
  return (palace?.[key] || [])
    .slice(0, limit)
    .map(getWentianPdfStarText)
    .filter(Boolean)
    .join("、");
}

function getWentianPdfMutagens(saved) {
  const chartData = saved?.chartData || {};
  const fromPayload = (chartData.yearMutagens || [])
    .map((item) => `${item.star || ""}${item.type || ""}`.trim())
    .filter(Boolean);
  if (fromPayload.length) return fromPayload.join("、");
  const fromChart = (saved?.chart?.palaces || []).flatMap((palace) => [
    ...(palace.majorStars || []),
    ...(palace.minorStars || []),
    ...(palace.adjectiveStars || palace.adjStars || []),
  ].filter((star) => star?.mutagen).map((star) => `${star.name || ""}${star.mutagen || ""}`.trim()));
  return fromChart.filter(Boolean).join("、") || "未见四化";
}

function buildWentianPdfBasicCards(saved, generatedAt) {
  const chart = saved?.chart || {};
  const form = saved?.form || {};
  const chartData = saved?.chartData || {};
  const gender = (form.gender || chartData.gender) === "female" ? "女命" : "男命";
  const rows = [
    ["命主", form.name || "命主"],
    ["性别", gender],
    ["出生资料", formatWentianPdfBirthText(saved)],
    ["出生地点", form.city || chartData.city || "未填"],
    ["农历", chart.lunarDate || chart.chineseDate || "未填"],
    ["排盘时辰", getWentianPdfShichen(saved)],
    ["节气四柱", getWentianPdfPillars(saved) || "未排入"],
    ["五行局", chart.fiveElementsClass || chartData.fiveElementsClass || "未排入"],
    ["命宫身宫", `${chart.earthlyBranchOfSoulPalace || "未定"} · ${chart.earthlyBranchOfBodyPalace || "未定"}`],
    ["四化", getWentianPdfMutagens(saved)],
    ["生成时间", generatedAt],
  ];
  return rows.map(([label, value]) => `
    <div class="wentian-pdf-basic-card">
      <b>${escapeHtml(label)}</b>
      <span>${escapeHtml(value)}</span>
    </div>
  `).join("");
}

function buildWentianPdfChartGrid(saved) {
  const chart = saved?.chart || {};
  const chartData = saved?.chartData || {};
  const form = saved?.form || {};
  const palaces = new Map((chart.palaces || []).map((palace) => [palace.earthlyBranch || palace.branch, palace]));
  const cells = Object.entries(WENTIAN_BRANCH_POSITIONS).map(([branch, [col, row]]) => {
    const palace = palaces.get(branch) || {};
    const major = getWentianPdfPalaceStars(palace, "majorStars", 3) || "主星未显";
    const minor = [
      getWentianPdfPalaceStars(palace, "minorStars", 4),
      getWentianPdfPalaceStars(palace, "adjectiveStars", 3),
      getWentianPdfPalaceStars(palace, "adjStars", 3),
    ].filter(Boolean).join("、");
    const tags = [
      palace.name || branch,
      palace.isBodyPalace ? "身宫" : "",
    ].filter(Boolean);
    return `
      <section class="wentian-pdf-palace" style="grid-column:${col + 1};grid-row:${row + 1};">
        <header>
          <strong>${escapeHtml(tags.join(" · "))}</strong>
          <span>${escapeHtml(`${palace.heavenlyStem || palace.stem || ""}${branch}`)}</span>
        </header>
        <b>${escapeHtml(major)}</b>
        <p>${escapeHtml(minor || "辅曜待补")}</p>
        <footer><span>${escapeHtml(getWentianClassicRange(palace) || "未定")}</span><strong>${escapeHtml(palace.name || branch)}</strong></footer>
      </section>
    `;
  }).join("");
  return `
    <div class="wentian-pdf-chart-grid">
      ${cells}
      <section class="wentian-pdf-center" style="grid-column:2 / 4;grid-row:2 / 4;">
        <h3>${escapeHtml(form.name || "命主")}</h3>
        <p>${escapeHtml(formatWentianPdfBirthText(saved))}</p>
        <dl>
          <div><dt>农历</dt><dd>${escapeHtml(chart.lunarDate || chart.chineseDate || "未填")}</dd></div>
          <div><dt>时辰</dt><dd>${escapeHtml(getWentianPdfShichen(saved))}</dd></div>
          <div><dt>四柱</dt><dd>${escapeHtml(getWentianPdfPillars(saved) || "未排入")}</dd></div>
          <div><dt>四化</dt><dd>${escapeHtml(getWentianPdfMutagens(saved))}</dd></div>
          <div><dt>真太阳时</dt><dd>${escapeHtml(chartData.solarTime || chartData.birthDate || "未填")}</dd></div>
        </dl>
      </section>
    </div>
  `;
}

function buildWentianPdfTextCards(sections, fallbackTitle, fallbackText, limit = 5) {
  const list = (sections || []).filter((section) => section.title || section.content).slice(0, limit);
  const safeList = list.length ? list : [{ title: fallbackTitle, content: fallbackText }];
  return safeList.map((section) => `
    <section class="wentian-pdf-text-card">
      <strong>${escapeHtml(section.title || fallbackTitle)}</strong>
      <p>${escapeHtml(cleanWentianAiText(section.content || fallbackText || "等待生成。"))}</p>
    </section>
  `).join("");
}

function buildWentianPdfChapterBody(chapter) {
  const results = wentianChartAiState.results || {};
  if (chapter.action === "specials") {
    const labels = { shengong: "身宫", hunyin: "婚姻", jiankang: "健康", caiyun: "财运", shiye: "事业" };
    const sections = WENTIAN_CHART_SPECIAL_MODULES.map((moduleKey) => ({
      title: `${labels[moduleKey] || moduleKey}详解`,
      content: getWentianAiSummary(results[moduleKey], 260) || "等待单独批命生成。",
    }));
    return buildWentianPdfTextCards(sections, "五宫详解", chapter.placeholder, 5);
  }
  if (chapter.action === "curve") {
    return buildWentianPdfTextCards([{
      title: "人生曲线",
      content: wentianChartAiState.curveGenerated
        ? "已生成人生曲线，用于查看关键年份、高低点与阶段节奏。"
        : "等待生成人生曲线，用于查看关键年份、高低点与阶段节奏。",
    }], "人生曲线", chapter.placeholder, 1);
  }
  if (chapter.action === "advice") {
    const sections = getWentianAdviceRows().map(([title, content]) => ({ title, content }));
    return buildWentianPdfTextCards(sections, "行动建议", chapter.placeholder, 3);
  }
  const result = chapter.module ? results[chapter.module] : null;
  return buildWentianPdfTextCards(getWentianAiSections(result), chapter.title, chapter.placeholder, 5);
}

function buildWentianPdfChapters() {
  syncWentianChartAiStateFromStorage();
  return getWentianChartAiChapters().map((chapter, index) => `
    <article class="wentian-pdf-chapter">
      <header>
        <span>卷${index + 1}</span>
        <h3>${escapeHtml(chapter.title)}</h3>
      </header>
      <div class="wentian-pdf-chapter-body">
        ${buildWentianPdfChapterBody(chapter)}
      </div>
    </article>
  `).join("");
}

function buildWentianMobilePdfReportElement(saved) {
  const generatedAt = formatWentianPdfNow();
  const form = saved?.form || {};
  const gender = (form.gender || saved?.chartData?.gender) === "female" ? "女命" : "男命";
  const report = document.createElement("article");
  report.className = "wentian-pdf-report";
  report.innerHTML = `
    <header class="wentian-pdf-head">
      <span>阅天AI · 紫微命盘</span>
      <h1>${escapeHtml(form.name || "命主")}个人命盘解读</h1>
      <p>${escapeHtml(gender)} · ${escapeHtml(formatWentianPdfBirthText(saved))} · ${escapeHtml(form.city || saved?.chartData?.city || "未填地点")}</p>
      <div class="wentian-pdf-meta">
        <div><b>命盘</b><span>${escapeHtml(saved?.chart?.fiveElementsClass || saved?.chartData?.fiveElementsClass || "紫微命盘")}</span></div>
        <div><b>模块</b><span>${escapeHtml(`${getWentianGeneratedModuleCount()}/${WENTIAN_CHART_AI_TASKS.length}`)}</span></div>
        <div><b>导出</b><span>${escapeHtml(generatedAt)}</span></div>
      </div>
    </header>
    <section class="wentian-pdf-section">
      <h2>基础资料</h2>
      <div class="wentian-pdf-basic-grid">${buildWentianPdfBasicCards(saved, generatedAt)}</div>
    </section>
    <section class="wentian-pdf-section">
      <h2>命盘</h2>
      ${buildWentianPdfChartGrid(saved)}
    </section>
    <section class="wentian-pdf-section">
      <h2>命盘解读</h2>
      <div class="wentian-pdf-chapters">${buildWentianPdfChapters()}</div>
    </section>
  `;
  return report;
}

function setWentianMobilePdfStatus(message = "", mode = "") {
  const status = view.querySelector("[data-wentian-pdf-status]");
  if (!status) return;
  status.textContent = message ? translateWentianText(message) : "";
  status.classList.toggle("is-ready", mode === "ready");
  status.classList.toggle("is-error", mode === "error");
}

async function downloadWentianMingbookPdf() {
  const saved = getWentianDisplayChartState() || getWentianSavedChart() || getWentianFallbackChartState();
  const btn = view.querySelector('[data-action="wentian-open-mingbook-onepage"]');
  const originalText = btn?.textContent || translateWentianText("下载PDF");
  if (btn) {
    btn.disabled = true;
    btn.textContent = translateWentianText("正在打包PDF…");
  }
  setWentianMobilePdfStatus("正在打包PDF…", "ready");
  const host = document.createElement("div");
  host.className = "wentian-pdf-export-host";
  document.body.classList.add("is-wentian-pdf-exporting");
  try {
    const report = buildWentianMobilePdfReportElement(saved);
    host.appendChild(report);
    document.body.appendChild(host);
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    const html2pdf = await loadWentianHtml2Pdf();
    const filename = `${safeWentianPdfFileName(saved?.form?.name || "个人命盘")}-${formatWentianPdfDateKey(saved)}-紫微命盘解读.pdf`;
    const pdfWidth = 794;
    const pdfPageHeight = 1123;
    const rawPdfHeight = Math.ceil(report.scrollHeight || report.getBoundingClientRect().height || pdfPageHeight);
    const pdfHeight = Math.max(pdfPageHeight, Math.ceil(rawPdfHeight / pdfPageHeight) * pdfPageHeight);
    await html2pdf().set({
      filename,
      margin: [0, 0, 0, 0],
      image: { type: "jpeg", quality: 0.96 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fbf7ef",
        width: pdfWidth,
        height: pdfHeight,
        windowWidth: pdfWidth,
        windowHeight: pdfHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: "px", format: [pdfWidth, pdfPageHeight], orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"], avoid: [".wentian-pdf-basic-card", ".wentian-pdf-palace", ".wentian-pdf-text-card"] },
    }).from(report).save();
    setWentianMobilePdfStatus("PDF已开始下载。", "ready");
  } catch (error) {
    console.error(error);
    setWentianMobilePdfStatus("PDF下载失败，请检查网络后重试。", "error");
  } finally {
    document.body.classList.remove("is-wentian-pdf-exporting");
    host.remove();
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
}

function getWentianArchiveDisplay(archive) {
  const form = archive?.form || {};
  const chartData = archive?.chartData || {};
  const sizhu = chartData.sizhu || {};
  const name = form.name || "命主";
  const normalizedGender = normalizeWentianArchiveGender(archive);
  const gender = normalizedGender === "female" ? "女" : normalizedGender === "male" ? "男" : "未填";
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

function normalizeWentianGenderValue(value) {
  const text = String(value || "").trim().toLowerCase();
  if (["male", "m", "man", "boy", "1", "男", "阳男", "陽男", "阴男", "陰男", "阳性", "陽性", "男性"].includes(text)) return "male";
  if (["female", "f", "woman", "girl", "0", "女", "阴女", "陰女", "阳女", "陽女", "阴性", "陰性", "女性"].includes(text)) return "female";
  return "";
}

function normalizeWentianArchiveGender(archive) {
  return normalizeWentianGenderValue(
    archive?.form?.gender
    || archive?.chartData?.gender
    || archive?.gender
    || archive?.form?.remoteRaw?.gender
  );
}

function parseWentianArchiveBirthDate(archive) {
  const form = archive?.form || {};
  const chartData = archive?.chartData || {};
  const raw = [
    form.datetime,
    form.remoteRaw?.datetime,
    form.remoteRaw?.dateStr,
    chartData.birthDate,
    chartData.solarTime,
  ].find(Boolean);
  const match = String(raw || "").match(/(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function getWentianArchiveAgeInfo(archive, now = new Date()) {
  const birthDate = parseWentianArchiveBirthDate(archive);
  if (!birthDate) return { ok: false, code: "missing-birth", birthDate: null, age: null };
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
  if (birthDate.getTime() > today.getTime()) return { ok: false, code: "future-birth", birthDate, age: null };
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthday = today.getMonth() > birthDate.getMonth()
    || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hadBirthday) age -= 1;
  return { ok: true, code: "ok", birthDate, age };
}

function getWentianHepanPersonLabel(archive) {
  return getWentianArchiveDisplay(archive).name || "该档案";
}

const WENTIAN_HEPAN_RELATION_PROFILES = {
  couple: {
    label: "夫妻格",
    title: "情侣合盘",
    scope: "夫妻宫对应",
    score: 14,
    dimensions: ["缘分吸引", "沟通节奏", "长期稳定", "共同成长"],
    adviceHigh: "适合把关系往长期规划推进，重要事项先定共同目标，再分工执行。",
    adviceLow: "先慢下来观察真实相处节奏，把金钱、边界、沟通频率提前说清。",
  },
  parent: {
    label: "父母格",
    title: "父母合盘",
    scope: "父母宫对应",
    score: 6,
    dimensions: ["长幼牵引", "沟通节奏", "边界稳定", "共同成长"],
    adviceHigh: "这类合盘重在照顾与承接，适合把期待、责任和边界先说清楚。",
    adviceLow: "先减少控制和投射，避免把亲缘式牵引误当成婚恋推进力。",
  },
  sibling: {
    label: "兄弟格",
    title: "兄弟合盘",
    scope: "兄弟宫对应",
    score: 7,
    dimensions: ["同气默契", "沟通节奏", "边界稳定", "共同成长"],
    adviceHigh: "这类合盘容易像手足同伴，适合互相扶持，但资源和边界要讲明。",
    adviceLow: "先把比较心和旧账放下，遇到利益、时间和承诺问题要明说。",
  },
  friend: {
    label: "朋友格",
    title: "朋友合盘",
    scope: "朋友宫对应",
    score: 8,
    dimensions: ["同道默契", "沟通节奏", "信任稳定", "共同成长"],
    adviceHigh: "适合长期合作或互相借力，先定目标，再分清角色和收益。",
    adviceLow: "先观察信用、执行力和利益边界，不要只凭感觉推进。",
  },
  child: {
    label: "子女格",
    title: "子女合盘",
    scope: "子女宫对应",
    score: 4,
    dimensions: ["照顾牵引", "沟通节奏", "责任稳定", "共同成长"],
    adviceHigh: "这类合盘照顾感强，适合先把责任感和独立空间分开。",
    adviceLow: "不要把保护欲当成关系质量，先看对方是否能独立承担。",
  },
  life: {
    label: "命宫格",
    title: "命宫合盘",
    scope: "命宫对应",
    score: 10,
    dimensions: ["命宫牵引", "沟通节奏", "长期稳定", "共同成长"],
    adviceHigh: "双方牵引力明显，适合先看价值观与长期目标是否同向。",
    adviceLow: "吸引不等于稳定，先把现实节奏和边界对齐。",
  },
  other: {
    label: "关系格",
    title: "关系合盘",
    scope: "宫位对应",
    score: 2,
    dimensions: ["关系牵引", "沟通节奏", "长期稳定", "共同成长"],
    adviceHigh: "可以继续观察相处节奏，先把共同目标和边界说清。",
    adviceLow: "先慢下来，不急着下结论，用现实互动验证盘面提示。",
  },
};

function getWentianHepanProfile(type) {
  return WENTIAN_HEPAN_RELATION_PROFILES[type] || WENTIAN_HEPAN_RELATION_PROFILES.other;
}

function getWentianPalaceName(palace) {
  return String(palace?.name || palace?.palaceName || "");
}

function formatWentianPalaceLabel(name) {
  const text = String(name || "");
  if (!text) return "宫位";
  return text.endsWith("宫") ? text : `${text}宫`;
}

function getWentianPalaceBranch(palace) {
  return palace?.branch || palace?.earthlyBranch || palace?.palaceBranch || "";
}

function getWentianPalaceStars(palace) {
  const collect = (items) => (Array.isArray(items) ? items : []).map((star) => (
    typeof star === "string" ? star : star?.name
  )).filter(Boolean);
  return [...new Set([...collect(palace?.majorStars), ...collect(palace?.minorStars)])];
}

function getWentianArchivePalaces(archive) {
  return archive?.chartData?.palacesSummary || archive?.chartData?.palaces || [];
}

function findWentianArchivePalace(archive, labels = []) {
  const normalized = labels.map((label) => String(label || "").replace(/宫$/, ""));
  return getWentianArchivePalaces(archive).find((palace) => {
    const name = getWentianPalaceName(palace).replace(/宫$/, "");
    return normalized.some((label) => name.includes(label));
  }) || null;
}

function findWentianArchivePalaceByBranch(archive, branch) {
  if (!branch) return null;
  return getWentianArchivePalaces(archive).find((palace) => getWentianPalaceBranch(palace) === branch) || null;
}

function getWentianHepanTypeFromPalaceName(name) {
  if (name.includes("夫妻")) return "couple";
  if (name.includes("父母")) return "parent";
  if (name.includes("兄弟")) return "sibling";
  if (name.includes("仆役") || name.includes("朋友") || name.includes("交友")) return "friend";
  if (name.includes("子女")) return "child";
  if (name.includes("命")) return "life";
  return "other";
}

function getWentianHepanLanding(sourceArchive, targetArchive, sourceInfo, targetInfo) {
  const sourceSpouse = findWentianArchivePalace(sourceArchive, ["夫妻"]);
  const branch = getWentianPalaceBranch(sourceSpouse);
  const targetPalace = findWentianArchivePalaceByBranch(targetArchive, branch);
  if (!sourceSpouse || !targetPalace) return null;
  const type = getWentianHepanTypeFromPalaceName(getWentianPalaceName(targetPalace));
  const profile = getWentianHepanProfile(type);
  const sourcePalaceName = formatWentianPalaceLabel(getWentianPalaceName(sourceSpouse));
  const targetPalaceName = formatWentianPalaceLabel(getWentianPalaceName(targetPalace));
  return {
    sourceName: sourceInfo.label,
    targetName: targetInfo.label,
    sourcePalace: sourcePalaceName,
    targetPalace: targetPalaceName,
    branch,
    type,
    label: profile.label,
    scope: profile.scope,
    score: profile.score,
    evidence: `${sourceInfo.label}夫妻宫落${targetInfo.label}${targetPalaceName}，按${profile.label}看`,
  };
}

function getWentianHepanStarMatches(sourceArchive, targetArchive, sourceInfo, targetInfo) {
  const rules = [
    { source: ["父母"], target: ["命"], label: "母子格" },
    { source: ["命"], target: ["父母"], label: "父女格" },
    { source: ["兄弟"], target: ["命"], label: "兄弟格" },
    { source: ["仆役", "朋友", "交友"], target: ["命"], label: "朋友格" },
  ];
  return rules.map((rule) => {
    const sourcePalace = findWentianArchivePalace(sourceArchive, rule.source);
    const targetPalace = findWentianArchivePalace(targetArchive, rule.target);
    const sourceStars = getWentianPalaceStars(sourcePalace);
    const targetStars = getWentianPalaceStars(targetPalace);
    const overlap = sourceStars.filter((star) => targetStars.includes(star));
    if (!overlap.length) return null;
    return `${sourceInfo.label}${formatWentianPalaceLabel(getWentianPalaceName(sourcePalace))}星曜${overlap.join("、")}入${targetInfo.label}${formatWentianPalaceLabel(getWentianPalaceName(targetPalace))}，可作${rule.label}佐证`;
  }).filter(Boolean);
}

function getWentianHepanRelationship(left, right, ageInfos = []) {
  const [leftInfo, rightInfo] = ageInfos;
  const safeLeft = leftInfo || { label: getWentianHepanPersonLabel(left), gender: normalizeWentianArchiveGender(left), age: null };
  const safeRight = rightInfo || { label: getWentianHepanPersonLabel(right), gender: normalizeWentianArchiveGender(right), age: null };
  const landings = [
    getWentianHepanLanding(left, right, safeLeft, safeRight),
    getWentianHepanLanding(right, left, safeRight, safeLeft),
  ].filter(Boolean);
  const preferred = landings.find((item) => item.type !== "other") || landings[0] || null;
  const type = preferred?.type || "other";
  const profile = getWentianHepanProfile(type);
  const starEvidence = [
    ...getWentianHepanStarMatches(left, right, safeLeft, safeRight),
    ...getWentianHepanStarMatches(right, left, safeRight, safeLeft),
  ];
  const evidence = [...new Set([
    ...landings.map((item) => item.evidence),
    ...starEvidence,
  ])];
  return {
    type,
    label: preferred?.label || profile.label,
    title: profile.title,
    scope: profile.scope,
    score: preferred?.score ?? profile.score,
    dimensions: profile.dimensions,
    adviceHigh: profile.adviceHigh,
    adviceLow: profile.adviceLow,
    evidence,
    landings,
    starEvidence,
  };
}

function getWentianArchivePersonKey(archive) {
  const form = archive?.form || {};
  const chartData = archive?.chartData || {};
  const name = String(form.name || chartData.name || "").trim().replace(/\s+/g, "");
  const datetime = String(form.datetime || chartData.birthDate || chartData.solarTime || "")
    .replace("T", " ")
    .replace(/:00$/, "")
    .slice(0, 16);
  const gender = normalizeWentianArchiveGender(archive);
  return [name, datetime, gender].filter(Boolean).join("|");
}

function getWentianArchiveIdentityKey(archive) {
  const form = archive?.form || {};
  const chartData = archive?.chartData || {};
  const name = String(form.name || chartData.name || "").trim().replace(/\s+/g, "");
  const gender = normalizeWentianArchiveGender(archive);
  const genericNames = new Set(["命主", "默认", "客户", "男命", "女命"]);
  if (!name || !gender || genericNames.has(name)) return "";
  return `${name}|${gender}`;
}

function isSameWentianHepanPerson(left, right) {
  if (!left || !right) return false;
  if (left === right) return true;
  const leftIds = [left.id, left.chartRecordId, left.form?.archiveId, left.chartData?.chartRecordId].filter(Boolean);
  const rightIds = new Set([right.id, right.chartRecordId, right.form?.archiveId, right.chartData?.chartRecordId].filter(Boolean));
  if (leftIds.some((id) => rightIds.has(id))) return true;
  const leftKey = getWentianArchivePersonKey(left);
  const rightKey = getWentianArchivePersonKey(right);
  if (leftKey && rightKey && leftKey === rightKey) return true;
  const leftIdentityKey = getWentianArchiveIdentityKey(left);
  const rightIdentityKey = getWentianArchiveIdentityKey(right);
  return Boolean(leftIdentityKey && rightIdentityKey && leftIdentityKey === rightIdentityKey);
}

function validateWentianHepanPair(left, right) {
  if (!left || !right) {
    return { ok: false, code: "missing", message: "请选择两张不同档案" };
  }
  if (isSameWentianHepanPerson(left, right)) {
    return { ok: false, code: "same-person", message: "同一个人不能和自己合盘" };
  }
  const leftGender = normalizeWentianArchiveGender(left);
  const rightGender = normalizeWentianArchiveGender(right);
  if (!leftGender || !rightGender) {
    return { ok: false, code: "missing-gender", message: "档案性别不完整，请先补全后再合盘" };
  }
  const people = [
    { side: "left", archive: left, gender: leftGender, label: getWentianHepanPersonLabel(left) },
    { side: "right", archive: right, gender: rightGender, label: getWentianHepanPersonLabel(right) },
  ];
  const ageInfos = people.map((person) => ({ ...person, ...getWentianArchiveAgeInfo(person.archive) }));
  const missingBirth = ageInfos.find((item) => item.code === "missing-birth");
  if (missingBirth) {
    return { ok: false, code: "missing-birth", message: `${missingBirth.label}出生日期不完整，请先补全后再合盘` };
  }
  const futureBirth = ageInfos.find((item) => item.code === "future-birth");
  if (futureBirth) {
    return { ok: false, code: "future-birth", message: `${futureBirth.label}出生日期在未来，不能合盘` };
  }
  if (leftGender === rightGender) {
    return { ok: false, code: "same-gender", message: "情侣合盘仅支持一男一女，男男/女女不能合盘" };
  }
  const hasMinor = ageInfos.some((item) => Number.isFinite(item.age) && item.age < WENTIAN_HEPAN_MIN_AGE);
  if (hasMinor) {
    return { ok: false, code: "minor", message: `未满${WENTIAN_HEPAN_MIN_AGE}岁，不能合盘` };
  }
  const ageGap = Math.abs(Number(ageInfos[0]?.age) - Number(ageInfos[1]?.age));
  if (Number.isFinite(ageGap) && ageGap > WENTIAN_HEPAN_MAX_AGE_GAP) {
    return { ok: false, code: "age-gap", message: `双方年龄相差超过${WENTIAN_HEPAN_MAX_AGE_GAP}岁，不能合盘` };
  }
  const relationship = getWentianHepanRelationship(left, right, ageInfos);
  return { ok: true, code: "ok", message: `可开始${relationship.label}`, relationship, ageInfos };
}

function getWentianHepanValidation(archives = getWentianArchiveList(), ids = getWentianHepanSelectedIds(archives)) {
  const pair = ids.map((id) => archives.find((archive) => archive.id === id)).filter(Boolean);
  return validateWentianHepanPair(pair[0], pair[1]);
}

function clampWentianScore(value) {
  return Math.max(35, Math.min(96, Math.round(value)));
}

function getWentianHepanSelectedIds(archives = getWentianArchiveList()) {
  if (!Array.isArray(wentianHepanSelectedIds)) {
    try {
      const raw = localStorage.getItem(WENTIAN_HEPAN_SELECTION_KEY);
      const saved = raw ? JSON.parse(raw) : [];
      wentianHepanSelectedIds = Array.isArray(saved) ? saved : [];
    } catch (_err) {
      wentianHepanSelectedIds = [];
    }
  }
  const archiveIds = archives.map((archive) => archive.id);
  const selected = [];
  for (const id of wentianHepanSelectedIds) {
    if (archiveIds.includes(id) && !selected.includes(id)) selected.push(id);
    if (selected.length >= 2) break;
  }
  wentianHepanSelectedIds = selected;
  return selected;
}

function saveWentianHepanSelectedIds(ids) {
  wentianHepanSelectedIds = ids.slice(0, 2);
  try {
    localStorage.setItem(WENTIAN_HEPAN_SELECTION_KEY, JSON.stringify(wentianHepanSelectedIds));
  } catch (_err) {}
}

function toggleWentianHepanArchive(id) {
  const archives = getWentianArchiveList();
  if (!archives.some((archive) => archive.id === id)) return;
  let ids = getWentianHepanSelectedIds(archives);
  if (ids.includes(id)) ids = ids.filter((item) => item !== id);
  else ids = ids.length >= 2 ? [ids[1], id].filter(Boolean) : [...ids, id];
  saveWentianHepanSelectedIds(ids);
  if (!refreshWentianHepanSelectionView(archives, ids)) navigate("screen-11", false);
}

function confirmWentianHepanSelection() {
  const archives = getWentianArchiveList();
  const ids = getWentianHepanSelectedIds(archives);
  const validation = getWentianHepanValidation(archives, ids);
  if (!validation.ok) {
    navigate("screen-11", false);
    return;
  }
  saveWentianHepanSelectedIds(ids);
  navigate("screen-49");
}

function getWentianHepanBranchScore(a, b) {
  if (!a || !b) return { score: 0, label: "资料不足" };
  if (a === b) return { score: 5, label: `${a}${b}同气，容易理解彼此` };
  if (WENTIAN_HEPAN_LIUHE[a] === b) return { score: 16, label: `${a}${b}六合，吸引力强` };
  const ai = WENTIAN_SHICHEN.indexOf(a);
  const bi = WENTIAN_SHICHEN.indexOf(b);
  if (ai >= 0 && bi >= 0 && Math.abs(ai - bi) === 6) return { score: -18, label: `${a}${b}相冲，需要定规则` };
  if (WENTIAN_HEPAN_TRIADS.some((group) => group.includes(a) && group.includes(b))) return { score: 11, label: `${a}${b}三合同局，合作感较好` };
  return { score: 1, label: `${a}${b}平稳，可靠相处养成默契` };
}

function getWentianElementScore(a, b) {
  const ea = WENTIAN_STEM_ELEMENTS[a] || "";
  const eb = WENTIAN_STEM_ELEMENTS[b] || "";
  if (!ea || !eb) return { score: 0, label: "五行资料不足" };
  if (ea === eb) return { score: 4, label: `${ea}${eb}同频，价值观接近` };
  if (WENTIAN_ELEMENT_GENERATES[ea] === eb) return { score: 8, label: `${ea}生${eb}，一方能带动另一方` };
  if (WENTIAN_ELEMENT_GENERATES[eb] === ea) return { score: 8, label: `${eb}生${ea}，互补支持明显` };
  return { score: -2, label: `${ea}${eb}节奏不同，适合分工互补` };
}

function getWentianArchiveSizhu(archive) {
  return archive?.chartData?.sizhu || {};
}

function getWentianArchivePalaceBranch(archive, key, fallback = "") {
  return archive?.chartData?.[key]?.branch || archive?.chartData?.[key]?.earthlyBranch || fallback;
}

function getWentianHepanPalaceScore(relation) {
  const label = relation?.evidence?.[0] || "宫位对应资料不足";
  return { score: relation?.score || 0, label };
}

function getWentianHepanResult() {
  const archives = getWentianArchiveList();
  const ids = getWentianHepanSelectedIds(archives);
  const pair = ids.map((id) => archives.find((archive) => archive.id === id)).filter(Boolean);
  const [left, right] = pair;
  const validation = validateWentianHepanPair(left, right);
  if (!validation.ok) {
    return {
      ok: false,
      ...validation,
      left,
      right,
      leftDisplay: left ? getWentianArchiveDisplay(left) : null,
      rightDisplay: right ? getWentianArchiveDisplay(right) : null,
    };
  }
  const leftDisplay = getWentianArchiveDisplay(left);
  const rightDisplay = getWentianArchiveDisplay(right);
  const relationship = validation.relationship || getWentianHepanRelationship(left, right, validation.ageInfos);
  const leftSizhu = getWentianArchiveSizhu(left);
  const rightSizhu = getWentianArchiveSizhu(right);
  const day = getWentianHepanBranchScore(leftSizhu.dayBranch, rightSizhu.dayBranch);
  const year = getWentianHepanBranchScore(leftSizhu.yearBranch, rightSizhu.yearBranch);
  const hour = getWentianHepanBranchScore(leftSizhu.hourBranch, rightSizhu.hourBranch);
  const month = getWentianHepanBranchScore(leftSizhu.monthBranch, rightSizhu.monthBranch);
  const palace = getWentianHepanPalaceScore(relationship);
  const element = getWentianElementScore(leftSizhu.dayStem, rightSizhu.dayStem);
  const genderBonus = relationship.type === "couple" ? 4 : relationship.type === "sibling" ? 3 : 1;
  const attraction = clampWentianScore(64 + day.score + palace.score * 0.45 + genderBonus);
  const communication = clampWentianScore(62 + month.score + hour.score * 0.55 + element.score * 0.4);
  const stability = clampWentianScore(61 + year.score * 0.7 + palace.score * 0.55);
  const growth = clampWentianScore(63 + element.score + Math.max(day.score, 0) * 0.35 - Math.min(year.score, 0) * 0.2);
  const total = clampWentianScore((attraction + communication + stability + growth) / 4);
  const level = total >= 86 ? "上佳合盘" : total >= 76 ? "稳定相合" : total >= 66 ? "可磨合相合" : "需要慢合";
  return {
    ok: true,
    left,
    right,
    leftDisplay,
    rightDisplay,
    relationship,
    relationLabel: relationship.label,
    relationTitle: relationship.title,
    relationScope: relationship.scope,
    relationEvidence: relationship.evidence,
    relationLandings: relationship.landings,
    total,
    level,
    dimensions: [
      [relationship.dimensions[0], attraction, day.label],
      [relationship.dimensions[1], communication, hour.label],
      [relationship.dimensions[2], stability, palace.label],
      [relationship.dimensions[3], growth, element.label],
    ],
    advice: total >= 76
      ? relationship.adviceHigh
      : relationship.adviceLow,
  };
}

function makeWentianPalaceSnapshot(palace) {
  if (!palace) return null;
  return {
    name: getWentianPalaceName(palace),
    branch: getWentianPalaceBranch(palace),
    majorStars: getWentianPalaceStars({ majorStars: palace.majorStars }),
    minorStars: getWentianPalaceStars({ minorStars: palace.minorStars }),
  };
}

function makeWentianHepanChartSnapshot(archive, display, age) {
  const palaces = getWentianArchivePalaces(archive).map(makeWentianPalaceSnapshot).filter(Boolean);
  return {
    name: display.name,
    gender: display.gender,
    datetime: display.datetime,
    age,
    pillars: display.pillars,
    sizhu: getWentianArchiveSizhu(archive),
    lifePalace: makeWentianPalaceSnapshot(findWentianArchivePalace(archive, ["命"])),
    spousePalace: makeWentianPalaceSnapshot(findWentianArchivePalace(archive, ["夫妻"])),
    parentsPalace: makeWentianPalaceSnapshot(findWentianArchivePalace(archive, ["父母"])),
    siblingsPalace: makeWentianPalaceSnapshot(findWentianArchivePalace(archive, ["兄弟"])),
    friendsPalace: makeWentianPalaceSnapshot(findWentianArchivePalace(archive, ["仆役", "朋友", "交友"])),
    childrenPalace: makeWentianPalaceSnapshot(findWentianArchivePalace(archive, ["子女"])),
    palaces,
  };
}

function makeWentianHepanXuContext(result = getWentianHepanResult()) {
  if (!result?.ok) return null;
  const leftAge = getWentianArchiveAgeInfo(result.left).age;
  const rightAge = getWentianArchiveAgeInfo(result.right).age;
  const leftChart = makeWentianHepanChartSnapshot(result.left, result.leftDisplay, leftAge);
  const rightChart = makeWentianHepanChartSnapshot(result.right, result.rightDisplay, rightAge);
  return {
    type: "hepan",
    recordId: makeWentianUuid(),
    title: result.relationTitle || "关系合盘",
    question: `${result.leftDisplay.name} × ${result.rightDisplay.name}`,
    summaryLine: `${result.relationLabel || "关系合盘"} · ${result.total}分 · ${result.level}`,
    relationLabel: result.relationLabel,
    relationScope: result.relationScope,
    relationEvidence: result.relationEvidence,
    relationLandings: result.relationLandings,
    rules: WENTIAN_HEPAN_AI_RULES,
    left: {
      name: result.leftDisplay.name,
      gender: result.leftDisplay.gender,
      datetime: result.leftDisplay.datetime,
      age: leftAge,
      pillars: result.leftDisplay.pillars,
      chart: leftChart,
    },
    right: {
      name: result.rightDisplay.name,
      gender: result.rightDisplay.gender,
      datetime: result.rightDisplay.datetime,
      age: rightAge,
      pillars: result.rightDisplay.pillars,
      chart: rightChart,
    },
    score: result.total,
    level: result.level,
    dimensions: result.dimensions,
    advice: result.advice,
    createdAt: Date.now(),
  };
}

function getHepanXuOpeningMessage(context) {
  if (!context) return "这次我按关系合盘来批，先辨关系类型，再看互动、冲突和长期节奏。";
  return `这次合盘已接入：${context.question}，${context.summaryLine}。你可以继续问相处节奏、冲突点、是否适合长期推进。`;
}

function openWentianHepanXuChat() {
  const context = makeWentianHepanXuContext();
  if (!context) {
    navigate("screen-11");
    return;
  }
  setWentianXuChatContext(context);
  navigate("screen-4");
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
  rememberWentianTextSource(document.querySelector('[data-node-id="source-37-preview-title"]'), getWentianLanguageOption(wentianLanguageDraft).label);
  for (const row of document.querySelectorAll("[data-wentian-language-option]")) {
    const selected = row.dataset.languageCode === wentianLanguageDraft;
    row.classList.toggle("is-selected", selected);
    row.setAttribute("aria-pressed", selected ? "true" : "false");
    const check = row.querySelector(".wentian-language-check");
    if (check) rememberWentianTextSource(check, selected ? "✓" : "");
  }
  applyWentianLanguageText(view, wentianLanguageDraft);
}

function confirmWentianLanguage() {
  setWentianLanguageCode(wentianLanguageDraft || getWentianLanguageCode());
  wentianLanguageDraft = null;
  navigate(state.stack.pop() || "screen-31", false);
}

const wentianI18nTextSources = new WeakMap();
let wentianI18nApplying = false;
let wentianI18nQueued = false;
let wentianI18nObserver = null;

const WENTIAN_I18N = {
  en: {
    "首页": "Home",
    "档案": "Files",
    "阅天AI": "Yuetian AI",
    "我的": "Me",
    "语言设置": "Language",
    "选择界面显示语言": "Choose display language",
    "确认后会同步保存到当前浏览器": "Saved to this browser after confirmation",
    "简体中文": "Simplified Chinese",
    "繁體中文": "Traditional Chinese",
    "确定": "Confirm",
    "账户与偏好设置": "Account and preferences",
    "登录 / 注册": "Sign In / Register",
    "未登录 · 支付前需登录": "Not signed in · Sign in before payment",
    "免费版 · 可升级会员": "Free plan · Upgrade available",
    "免费版 · 可升级付费版": "Free plan · Paid upgrade available",
    "登录后可查看支付记录": "Sign in to view payments",
    "登录": "Sign In",
    "账号": "Account",
    "会员": "Member",
    "今日次数": "Today",
    "每日额度": "Daily Quota",
    "会员状态": "Plan",
    "套餐状态": "Plan",
    "免费版": "Free",
    "已开通": "Active",
    "阅天套餐": "Yuetian Plan",
    "我的报告": "My Reports",
    "订单记录": "Orders",
    "邀请好友": "Invite Friends",
    "双方获得奖励": "Both earn rewards",
    "任务与活动奖励": "Tasks and rewards",
    "分享阅天AI": "Share Yuetian AI",
    "联系我们": "Contact Us",
    "账户设置": "Account Settings",
    "基本信息": "Profile",
    "登录方式": "Sign-in Methods",
    "设置密码": "Set Password",
    "保存本机资料": "Save local profile",
    "手机号或 Google 登录": "Phone or Google sign-in",
    "登录后可设置密码": "Sign in to set password",
    "进入账号登录页": "Open sign-in page",
    "先登录再同步": "Sign in to sync",
    "未登录时只保存本机资料；登录后才能同步会员、支付和邀请奖励。": "Local-only before sign-in. Sign in to sync membership, payments, and invite rewards.",
    "账号安全": "Account Security",
    "会员、支付记录、邀请奖励会跟随当前登录账号。退出前请确认资料已保存。": "Membership, payments, and invite rewards follow the signed-in account. Confirm your data is saved before signing out.",
    "昵称、邮箱、手机号": "Nickname, email, phone",
    "查看当前账号与支付入口": "View account and payment entry",
    "修改账号登录密码": "Change account password",
    "退出登录": "Sign Out",
    "退出当前账号前会再次确认": "Confirm again before signing out",
    "昵称": "Nickname",
    "邮箱": "Email",
    "手机号": "Phone",
    "手机号 / 邮箱": "Phone / Email",
    "账号已登录，信息会用于支付与邀请展示": "Signed in. Info is used for payments and invites.",
    "未登录，本页先保存本机资料": "Not signed in. Save local profile first.",
    "保存后用于档案、昵称、邀请展示；登录账号以登录方式页为准。": "Used for files, nickname, and invites. Account identity is managed by sign-in.",
    "保存信息": "Save",
    "请输入昵称": "Enter nickname",
    "请输入邮箱": "Enter email",
    "绑定手机号": "Bind phone number",
    "会员、支付记录会绑定到账号": "Membership and payments are linked to your account",
    "注册": "Register",
    "密码": "Password",
    "请输入手机号": "Enter phone number",
    "请输入手机号或邮箱": "Enter phone number or email",
    "请输入正确手机号或邮箱": "Enter a valid phone number or email",
    "注册请填写手机号": "Use a phone number to register",
    "至少 6 位": "At least 6 characters",
    "处理中...": "Processing...",
    "注册并登录": "Register and sign in",
    "登录并继续": "Sign in and continue",
    "用 Google 登录": "Sign in with Google",
    "手机号登录使用密码，不发验证码。": "Phone sign-in uses password, not SMS codes.",
    "阅天会员": "Yuetian Member",
    "付费版": "Paid",
    "免费账号": "Free Account",
    "手机号密码": "Phone Password",
    "未绑定手机号": "No phone bound",
    "已启用": "Enabled",
    "可用": "Available",
    "Google 登录": "Google Sign-in",
    "当前账号来源": "Current account source",
    "可继续使用 Google 登录": "Google sign-in remains available",
    "账号密码": "Account Password",
    "用于邮箱或手机号登录和后续安全验证": "Email/phone sign-in & security",
    "可修改": "Editable",
    "续费会员": "Renew Membership",
    "开通会员": "Open Membership",
    "续费付费版": "Renew Paid Plan",
    "开通付费版": "Open Paid Plan",
    "支付记录": "Payment Records",
    "登录后设置账号密码": "Sign in to set account password",
    "密码会绑定到你的阅天账号，用于邮箱或手机号登录、支付记录和会员权益。": "The password is linked to your Yuetian account for email or phone sign-in, payments, and membership.",
    "新密码": "New Password",
    "确认密码": "Confirm Password",
    "再次输入": "Enter again",
    "安全提示": "Security Tip",
    "密码仅用于账号登录。设置后可继续使用 Google、邮箱或手机号密码登录。": "Password is only for account sign-in. You can still use Google, email, or phone password sign-in.",
    "保存中...": "Saving...",
    "保存密码": "Save Password",
    "确认退出登录？": "Sign out?",
    "取消": "Cancel",
    "退出": "Sign Out",
    "排盘记录": "Chart Records",
    "个人案例": "Personal Cases",
    "· 个人案例 ·": "· Personal ·",
    "典藏案例": "Classic Cases",
    "请输入姓名": "Enter name",
    "筛选": "Filter",
    "全部": "All",
    "阳历": "Solar"
  },
  "zh-Hant": {
    "首页": "首頁",
    "档案": "檔案",
    "阅天AI": "閱天AI",
    "我的": "我的",
    "语言设置": "語言設定",
    "选择界面显示语言": "選擇介面顯示語言",
    "确认后会同步保存到当前浏览器": "確認後會同步保存到目前瀏覽器",
    "简体中文": "簡體中文",
    "确定": "確定",
    "账户与偏好设置": "帳戶與偏好設定",
    "账户设置": "帳戶設定",
    "基本信息": "基本資訊",
    "登录方式": "登入方式",
    "设置密码": "設定密碼",
    "退出登录": "登出",
    "邀请好友": "邀請好友",
    "双方获得奖励": "雙方獲得獎勵",
    "任务与活动奖励": "任務與活動獎勵",
    "分享阅天AI": "分享閱天AI",
    "联系我们": "聯絡我們",
    "我的报告": "我的報告",
    "订单记录": "訂單記錄",
    "每日额度": "每日額度",
    "套餐状态": "套餐狀態",
    "付费版": "付費版",
    "免费版": "免費版",
    "选择档案": "選擇檔案",
    "选择一个档案接入对话": "選擇一個檔案接入對話",
    "请确认命盘": "請確認命盤",
    "确认后再进入许半仙对话": "確認後再進入許半仙對話",
    "退出选盘": "退出選盤",
    "切换": "切換",
    "查看": "查看",
    "本课": "本課",
    "合盘": "合盤",
    "＋ 新建": "＋ 新建",
    "排盘记录": "排盤記錄",
    "个人案例": "個人案例",
    "· 个人案例 ·": "· 個人案例 ·",
    "典藏案例": "典藏案例",
    "请输入姓名": "請輸入姓名",
    "筛选": "篩選",
    "全部": "全部",
    "阳历": "陽曆"
  }
};

const WENTIAN_I18N_EN_EXTRA = {
  "登录/注册，安好": "Sign In",
  "登录后可支付与同步订单": "Pay & sync orders",
  "✦ 排盘": "Create Chart",
  "为你推荐": "Recommended",
  "邀请好友双方获得奖励": "Invite friends and both earn rewards",
  "许半仙": "Master Xu",
  "许半仙已准备好为您解读": "Master Xu is ready",
  "紫微命盘专属解析，已接入当前档案": "Chart linked",
  "紫微命盘专属解析，已接入档案": "Zi Wei chart linked",
  "紫微命盘": "Zi Wei Chart",
  "AI解析": "AI Reading",
  "去问他": "Ask",
  "合盘分析": "Match",
  "命理相合，缘分几许": "Chart affinity",
  "六爻占卜": "Liuyao",
  "铜钱起卦，纳甲解卦": "Coin hexagram",
  "三枚铜钱 · 六次成卦": "Three coins · six casts",
  "先定一问，再起六爻": "Set one question, then cast",
  "自下而上成爻，6/9 为动爻，动则成变卦。": "Lines build from bottom to top. 6/9 are moving lines.",
  "所问之事": "Question",
  "一句话写清楚所问": "Write one clear question",
  "一句话写清楚所问，例如：本月是否推进某个项目？": "Write one clear question, e.g. should I move this project forward this month?",
  "先写清一件事；空问、乱点、随便试，不起卦。": "Write one clear matter first. Empty, random, or test casts are blocked.",
  "起卦前会先按“一事一占”审题。": "The question is checked by the one-matter rule before casting.",
  "正在审题，合格才起卦。": "Checking the question. Casting starts only if it passes.",
  "改好后再次起卦会重新审题。": "The next cast will re-check the revised question.",
  "请先写清楚要问的一件事。": "Write the one thing you want to ask first.",
  "一句话只问一件具体事情，再起卦。": "Ask one specific matter in one sentence before casting.",
  "问题还不够清楚，暂不起卦。": "The question is not clear enough. Casting is blocked.",
  "审题通过，可以起卦。": "Question approved. You may cast.",
  "审题服务暂时没接上，请稍后再试。": "Remote question check is unavailable. Please try again later.",
  "请稍后再试。": "Try again shortly.",
  "起卦方式": "Casting Method",
  "在线投币": "Coin Cast",
  "手动起卦": "Manual",
  "卦已成": "Hexagram Ready",
  "手动点每一爻切换：少阳 → 少阴 → 老阳 → 老阴。": "Tap each line to cycle: young yang → young yin → old yang → old yin.",
  "每次投三枚铜钱，按初爻到上爻依次记录。": "Each cast uses three coins, recorded from first line upward.",
  "查看卦象解读": "Read Hexagram",
  "一键起完整卦": "Cast All Six",
  "清空重排": "Clear",
  "补全六爻": "Complete Lines",
  "审题中…": "Checking...",
  "抛币中…": "Casting...",
  "卦已成": "Hexagram Ready",
  "向上滑动抛币": "Swipe Up to Cast",
  "在铜钱区向上滑动超过一段距离即可抛币；落币后按初爻到上爻依次记录。": "Swipe up on the coin area to cast. After the coins land, each line is recorded from bottom to top.",
  "三枚铜钱六次成卦": "Three coins, six casts",
  "本卦": "Original",
  "变卦": "Changed",
  "所问": "Question",
  "本卦判断": "Original Reading",
  "动爻与变卦": "Moving Lines",
  "行动建议": "Action Advice",
  "查看卦义摘要": "View Summary",
  "追问许半仙": "Ask Master Xu",
  "重新起卦": "Cast Again",
  "尚未完成起卦": "Casting Not Complete",
  "请先投满六爻，或用手动起卦补全六爻。": "Cast six lines first, or complete them manually.",
  "返回起卦": "Back to Casting",
  "重来": "Reset",
  "事业近期是否适合推进新计划？": "Is it a good time to move a new career plan forward?",
  "初爻": "Line 1",
  "二爻": "Line 2",
  "三爻": "Line 3",
  "四爻": "Line 4",
  "五爻": "Line 5",
  "上爻": "Line 6",
  "少阳": "Young Yang",
  "少阴": "Young Yin",
  "老阳": "Old Yang",
  "老阴": "Old Yin",
  "未定": "Unset",
  "无动爻": "No moving lines",
  "阳": "Yang",
  "阴": "Yin",
  "阳宅地脉": "Feng Shui",
  "方位九宫，安位解读": "Direction layout",
  "六壬法": "Liuren",
  "农历月日时，即刻起课": "Lunar time casting",
  "更多功能": "More Tools",
  "参与活动赢取丰厚奖励": "Join events for rewards",
  "命理报告": "Destiny Reports",
  "你的专属命理报告，立即生成": "Generate your personal destiny report",
  "解锁AI专属命理报告，快速获得可执行建议": "Unlock an AI report with practical guidance",
  "· 覆盖事业、情感、财富等核心场景": "· Covers career, love, wealth, and other key areas",
  "· 结合命盘结构输出高价值行动建议": "· Turns chart structure into high-value action advice",
  "· 下单后自动生成，可在我的报告持续复盘": "· Auto-generated after purchase and saved in My Reports",
  "八字": "Bazi",
  "生命健康预测报告(文字版持续更新)": "Life Health Report",
  "基于您的八字信息，系统将计算出横跨121年的生命能量曲线。预见人生的波峰与波谷，在关键节…": "Based on your Bazi, the system calculates a 121-year life energy curve so you can see key rises and dips.",
  "直接购买": "Buy Now",
  "立即解锁 →": "Unlock Now →",
  "2026丙午年预测报告": "2026 Bingwu Forecast",
  "全面八字分析，2026概览、太岁情况、事业发展、财富运势、爱情婚姻、健康关注、风水建议、每…": "Full Bazi analysis covering 2026 overview, Tai Sui, career, wealth, love, health, feng shui, and monthly focus.",
  "八字与MBTI人格深度解析及运势全面预测": "Bazi MBTI Report",
  "融合八字命理学与MBTI四维模型。从五行能量场到潜意识决策模式，为您深度揭示性格底色、原生…": "Combines Bazi and MBTI to reveal personality patterns, decision style, and life direction.",
  "当前档案": "Current File",
  "更换档案 〉": "Change File 〉",
  "男": "Male",
  "女": "Female",
  "命理师": "Advisor",
  "已接入您的紫微命盘，可直接开启对话": "Chart linked. Start chatting.",
  "命盘顾问 · 在线": "Chart Advisor · Online",
  "占卜专批 · 在线": "Divination Reading · Online",
  "命主⌄": "Owner⌄",
  "本卦⌄": "Original⌄",
  "切换": "Switch",
  "查看": "View",
  "本课": "Case",
  "已接入": "Connected",
  "已连接": "Connected",
  "占卜已接入": "Divination linked",
  "接入占卜中…": "Linking divination...",
  "正在接入许半仙…": "Connecting to Xu Banxian...",
  "我在，看命盘直接问。": "I am here. Ask about your chart.",
  "许半仙正在看卦…": "Xu Banxian is reading the hexagram...",
  "我按这卦看这件事。你可以继续问成败、应期、动爻或行动取舍。": "I will read this hexagram for this matter. Ask about outcome, timing, moving lines, or next steps.",
  "常问": "FAQ",
  "占卜追问": "Divination Follow-up",
  "本次占问": "This Casting",
  "追问这卦": "Ask About This Hexagram",
  "细问": "Details",
  "事情成败": "Outcome",
  "能不能成": "Will It Work?",
  "最大阻力": "Main Blocker",
  "是否该继续": "Keep Going?",
  "结果走向": "Likely Outcome",
  "时间变化": "Timing",
  "什么时候动": "When It Moves",
  "动爻怎么看": "Moving Lines",
  "应期提醒": "Timing Signs",
  "下一阶段": "Next Stage",
  "人事关系": "People",
  "对方态度": "Their Attitude",
  "贵人阻力": "Help or Block",
  "沟通方式": "How to Talk",
  "合作风险": "Cooperation Risk",
  "行动取舍": "Next Choice",
  "现在怎么做": "What To Do",
  "该避什么": "What To Avoid",
  "取舍判断": "How To Choose",
  "再占提醒": "Recast Timing",
  "感情婚姻": "Love",
  "事业财运": "Career",
  "近期运势": "Recent Luck",
  "家庭六亲": "Family",
  "健康状态": "Health",
  "人生主线": "Life Path",
  "内容由AI生成，仅供娱乐参考": "AI-generated, for entertainment only",
  "正缘何时来": "When Love Arrives",
  "婚姻走势": "Marriage Trend",
  "复合分手": "Reunion or Separation",
  "桃花质量": "Romance Quality",
  "适合行业": "Best Industries",
  "跳槽创业": "Job Change or Startup",
  "赚钱方式": "Money Path",
  "升职贵人": "Promotion Help",
  "最近一年": "Next Year",
  "何时转运": "Luck Turning Point",
  "关键月份": "Key Months",
  "今年避坑": "Avoid Pitfalls",
  "父母缘分": "Parents",
  "伴侣相处": "Partner Dynamics",
  "子女缘分": "Children",
  "家宅压力": "Home Pressure",
  "身体短板": "Weak Spots",
  "压力睡眠": "Stress and Sleep",
  "今年健康": "Health This Year",
  "调养建议": "Wellness Advice",
  "一生主线": "Life Theme",
  "性格底色": "Personality Base",
  "贵人小人": "Helpers and Drainers",
  "行动建议": "Action Advice",
  "◷ 对话记录": "Chat History",
  "◇ 剩余 1 条": "1 remaining",
  "你好！我是许半仙": "Hello, I am Xu Banxian",
  "需要我为您做些什么？": "What can I help with?",
  "选择档案": "Choose File",
  "共 2 张": "2 files",
  "选择一个档案接入对话": "Choose a file for this chat",
  "请确认命盘": "Confirm Chart",
  "确认后再进入许半仙对话": "Confirm before entering chat",
  "退出选盘": "Exit",
  "＋ 新建": "+ New",
  "默认": "Default",
  "命": "File",
  "命主": "Owner",
  "谢": "Xie",
  "女　四柱八字": "F · Bazi",
  "男　四柱八字": "M · Bazi",
  "丙午 壬辰 丙戌 丙申": "Bing Wu · Ren Chen · Bing Xu · Bing Shen",
  "辛未 庚寅 丁巳 辛亥": "Xin Wei · Geng Yin · Ding Si · Xin Hai",
  "四柱八字": "Bazi",
  "＋ 新建档案": "+ New File",
  "+ 新建档案": "+ New File",
  "AI提问中": "Asking AI",
  "AI回复": "AI Reply",
  "当前八字": "Current Bazi",
  "年 辛未｜月 癸巳｜日 丁亥｜时 辛亥": "Year Xin Wei | Month Gui Si | Day Ding Hai | Hour Xin Hai",
  "问一问": "Ask",
  "推算中...": "Calculating...",
  "请根据我的八字，深度拆解核心性格特质。": "Based on my Bazi, deeply analyze my core personality.",
  "请根据我的八字拆解性格。": "Please analyze my personality from my Bazi.",
  "你的八字显示辛未、癸巳、丁亥、辛亥。核心是敏感、洞察力强，适合把直觉转化为决策。": "Your Bazi shows strong sensitivity and insight. Turn intuition into decisions.",
  "AI长文解读": "Long AI Reading",
  "已结合紫微命盘、八字与当前档案生成": "Generated from Zi Wei chart, Bazi, and current file",
  "请根据我的八字，深度拆解我的核心性格特质、事业机会和近期行动重点。": "Please analyze my personality, career chances, and next actions from my Bazi.",
  "核心结论": "Core Conclusion",
  "性格优势": "Strengths",
  "隐性风险": "Hidden Risks",
  "事业建议": "Career Advice",
  "感情建议": "Love Advice",
  "财运建议": "Wealth Advice",
  "行动方案": "Action Plan",
  "你的命盘不是单一路线，而是“先观察、后出手”的结构。真正适合你的节奏，是先把信息摸透，再用稳定执行换结果。": "Your chart is not a single straight path. Your best rhythm is to observe first, understand the information, then act steadily.",
  "思考细密，能抓到别人忽略的线索。遇到复杂问题时，反而比简单重复的任务更能发挥。": "You think carefully and catch details others miss. Complex problems suit you better than repetitive work.",
  "容易在关键节点想太多，迟迟不愿下注。越重要的事情，越需要把判断拆成小步骤去验证。": "At key moments you may overthink. The bigger the decision, the more you should test it in small steps.",
  "适合做需要判断、整合、表达的工作。近期不要频繁换方向，先把一个可见成果做厚。": "Work that needs judgment, synthesis, and expression suits you. Do not switch directions too often now.",
  "关系里要少用试探，多说真实需求。你适合稳定、讲信用、能一起规划生活的人。": "In relationships, test less and state real needs more. Stable, reliable partners suit you.",
  "财运来自长期积累，不宜追短线。先守现金流，再考虑扩张。": "Wealth comes from long-term accumulation. Protect cash flow before expanding.",
  "未来三个月，把精力放在一个主目标上，每周复盘一次，删掉消耗型关系和低回报事项。": "For the next three months, focus on one main goal, review weekly, and cut low-return drains.",
  "继续追问": "Ask Follow-up",
  "对话记录": "Chat History",
  "新对话": "New Chat",
  "新的对话": "New Chat",
  "根据我的八字拆解核心性格特质": "Analyze core personality from my Bazi",
  "最近事业机会应该怎么判断": "How should I judge recent career chances?",
  "命盘追问": "Chart Follow-up",
  "昨天": "Yesterday",
  "感情关系里需要注意什么": "What should I watch in relationships?",
  "仅保留最近 10 条对话": "Only the latest 10 chats are kept",
  "选择合盘类型": "Choose Compatibility Type",
  "情侣合盘": "Couple Compatibility",
  "真命盘合参": "Compare true charts",
  "情感契合度": "Love fit",
  "冲突化解建议": "Conflict advice",
  "选择两张档案": "Choose two files",
  "最多选择两张档案进行合盘": "Choose up to two files",
  "仅支持一男一女，且不能选择同一个人": "Only one male and one female, not the same person",
  "选择两张档案后开始合盘": "Choose two files to start",
  "查看合盘结果": "View compatibility",
  "开始合盘": "Start Compatibility",
  "选择合盘档案": "Choose Compatibility Files",
  "请选择一男一女两张不同档案": "Choose one male and one female from two different files",
  "至少需要两张档案才能合盘": "At least two files are required",
  "可开始合盘": "Ready to match",
  "同一个人不能和自己合盘": "A person cannot match with themself",
  "档案性别不完整，请先补全后再合盘": "Gender is missing. Complete the files before matching",
  "情侣合盘仅支持一男一女，男男/女女不能合盘": "Couple compatibility only supports one male and one female",
  "未满18岁，不能合盘": "Minors under 18 cannot match",
  "双方年龄相差超过15岁，不能合盘": "Age gap over 15 years is not allowed",
  "规则：仅支持一男一女，未满18岁不合盘，年龄差超过15岁不合盘。": "Rule: one male and one female only, both must be adults, and age gap over 15 years is not allowed.",
  "合盘结果": "Compatibility Result",
  "分": "pts",
  "上佳合盘": "Excellent",
  "稳定相合": "Stable",
  "可磨合相合": "Workable",
  "需要慢合": "Go Slow",
  "基于双方紫微命盘、四柱日支与宫位关系生成": "Based on both charts",
  "合": "Fit",
  "合盘维度": "Compatibility",
  "缘分吸引": "Attraction",
  "沟通节奏": "Comms",
  "长期稳定": "Stability",
  "共同成长": "Growth",
  "资料不足": "Insufficient data",
  "五行资料不足": "Insufficient element data",
  "关系建议": "Relationship Advice",
  "适合把关系往长期规划推进，重要事项先定共同目标，再分工执行。": "Good for long-term planning. Set shared goals first, then divide execution.",
  "先慢下来观察真实相处节奏，把金钱、边界、沟通频率提前说清。": "Slow down and observe the real rhythm. Clarify money, boundaries, and communication frequency early.",
  "重新选择": "Choose Again",
  "追问许半仙": "Ask Xu",
  "暂不能合盘": "Cannot Match Yet",
  "已选2/2": "Selected 2/2",
  "写下你想问的命理问题": "Write your question",
  "请输入想问什么？": "What do you want to ask?",
  "今日运势如何？": "How is my luck today?",
  "最近的工作会有好的转机吗？": "Will work improve soon?",
  "我和TA的感情未来如何发展？": "How will this relationship develop?",
  "近期的贵人会何时出现？": "When will helpful people appear?",
  "黄大仙灵签": "Wong Tai Sin Lots",
  "心中默念所问之事": "Focus on your question",
  "感情、事业、财运皆可问。抽签后可查看签文、解签和 AI 延展。": "Ask about love, career, or wealth. Draw a lot for text, reading, and AI follow-up.",
  "剩余 1 次": "1 draw left",
  "感情": "Love",
  "事业": "Career",
  "财运": "Wealth",
  "虔诚抽签": "Draw Lot",
  "正在为你取签": "Drawing your lot",
  "已接入当前档案，签文生成后可交给许半仙继续解读。": "Current file is connected. Xu Banxian can explain after the lot appears.",
  "请稍候": "Please wait",
  "签文将现": "Lot appearing",
  "正在抽取第廿九签": "Drawing Lot 29",
  "遗定良缘": "Destined match",
  "乱转涡鱼": "Turbid waters",
  "性立盖守": "Stay steady",
  "家奇得靖": "Home finds calm",
  "舞烟泛鹤": "Cranes in mist",
  "燕上晚也": "Evening swallows",
  "灵": "Lot",
  "诚心祈愿": "Sincere wish",
  "一签一问": "One lot, one question",
  "第廿九签": "Lot 29",
  "【中吉】": "Moderate Luck",
  "点击签面查看详情": "Tap the lot for details",
  "签文": "Lot Text",
  "岁岁休言悔，莫道定难改。": "Do not dwell on regret; change is still possible.",
  "解签": "Reading",
  "眼前事宜先稳住心神，不急于求成。": "Stay steady first. Do not rush results.",
  "详情": "Details",
  "所问之事有转机，但需顺势而行。": "There is a turning point, but move with the timing.",
  "AI解签": "AI Lot Reading",
  "请许半仙结合命盘继续解读": "Ask Xu Banxian to read it with your chart",
  "让 AI 继续解读此签": "Let AI continue this reading",
  "起卦": "Cast Hexagram",
  "六爻在线起卦": "Online Liuyao Hexagram",
  "先定问题，再投铜钱。系统会生成本卦、变卦和 AI 解读入口。": "Set a question, toss coins, then get original and changed hexagrams plus AI reading.",
  "起卦方式": "Casting Method",
  "在线起卦": "Online Casting",
  "手动起卦": "Manual Casting",
  "起卦时间": "Casting Time",
  "所问：事业近期是否适合推进新计划？": "Question: Is it suitable to push a new work plan soon?",
  "点击投掷铜钱": "Tap to toss coins",
  "一爻": "Line 1",
  "二爻": "Line 2",
  "三爻": "Line 3",
  "四爻": "Line 4",
  "五爻": "Line 5",
  "六爻": "Line 6",
  "阳": "Yang",
  "阴": "Yin",
  "投掷 4 次": "Toss 4 times",
  "投掷 5 次": "Toss 5 times",
  "地风升": "Earth Wind Sheng",
  "升而有序，先小后大": "Rise in order, small before big",
  "事业问卦": "Career Hexagram",
  "本卦：地风升": "Original: Earth Wind Sheng",
  "升而有序，适合积累资源，稳步推进。此卦重在“循序”，先把基础铺实，再谈突破。": "Progress step by step. Build resources and foundations before pushing for a breakthrough.",
  "变卦：风地观": "Changed: Wind Earth Guan",
  "外部环境正在观察你是否稳定。少解释，多用结果证明判断。": "Others are watching your stability. Explain less; prove with results.",
  "不要急于换道。先把手头筹码做厚，把一个小成果做成可复用的方法。": "Do not switch tracks too fast. Make one small result repeatable first.",
  "关系建议": "Relationship Advice",
  "关系中宜柔和沟通，避免强推。真正有效的推进来自耐心和边界。": "Communicate softly and avoid forcing. Patience and boundaries move things forward.",
  "行动窗口": "Action Window",
  "未来三十日适合复盘、签约、修正计划；不宜仓促做高风险扩张。": "The next 30 days suit review, signing, and plan correction; avoid rushed expansion.",
  "AI解卦": "AI Hexagram Reading",
  "可让许半仙结合当前命盘继续解读此卦。": "Xu Banxian can read this hexagram with your chart.",
  "购买完整解读": "Buy Full Reading",
  "购买完整解读后可查看详细分析。": "Buy the full reading to view detailed analysis.",
  "卦意": "Hexagram Meaning",
  "对话次数已用尽": "Chat credits used up",
  "可通过开通会员或直接购买对话次数继续深度解读。": "Open membership or buy chat credits to continue.",
  "购买对话包": "Buy Chat Pack",
  "登录后生成专属邀请码": "Sign in to generate your invite code",
  "邀请好友注册、首付奖励和收益记录都会绑定到你的账号。": "Friend invites, first-payment rewards, and earnings are linked to your account.",
  "我有好友邀请码": "I have a friend's invite code",
  "先填在这里也可以；登录/注册后自动绑定。": "You can enter it here; it binds after sign-in/register.",
  "绑定": "Bind",
  "输入邀请码": "Enter invite code",
  "奖励规则": "Reward Rules",
  "好友注册成功：双方各得 2 次对话奖励。": "Friend registers: both get 2 chat credits.",
  "好友首次付费：邀请人再得 10 次对话奖励。": "Friend's first payment: inviter gets 10 more chat credits.",
  "刷新": "Sync",
  "可用奖励 0 次": "Available rewards: 0 credits",
  "去邀请": "Invite",
  "邀": "I",
  "礼": "G",
  "邀请好友注册": "Friend Sign-up",
  "双方各得 2 次对话": "Both get 2 chats",
  "奖": "R",
  "好友首次付费": "Friend first payment",
  "邀请人再得 10 次对话": "Inviter gets 10 more chats",
  "签": "C",
  "每日签到": "Daily Check-in",
  "连续签到功能待开放": "Streak check-in coming soon",
  "已邀请好友": "Friends Invited",
  "累计奖励 0": "Total rewards: 0",
  "邀请好友注册阅天AI，双方都可获得对话次数奖励。": "Invite friends and both get chat credits.",
  "我的邀请码": "My Invite Code",
  "复制": "Copy",
  "好友注册时填写邀请码即可绑定邀请关系": "Friends enter the code at registration to bind the invite.",
  "我的邀请链接": "My Invite Link",
  "也可以直接分享链接给好友，系统自动识别。": "Share the link and the system will recognize it automatically.",
  "邀请奖励": "Invite Rewards",
  "好友注册": "Friend Signs Up",
  "可获得：2 次对话": "Reward: 2 chats",
  "立即到账": "Instant",
  "邀请满 3 人": "Invite 3 friends",
  "额外获得：会员体验券": "Extra: membership trial coupon",
  "阶段奖励": "Milestone Reward",
  "邀请满 10 人": "Invite 10 friends",
  "额外获得：高级报告券": "Extra: premium report coupon",
  "进阶奖励": "Advanced Reward",
  "好友首次付费奖励": "First Payment Reward",
  "好友完成首次付费后，邀请人可额外获得 10 次对话。": "After a friend's first payment, the inviter gets 10 extra chats.",
  "邀请记录": "Invite Records",
  "暂无邀请记录": "No invite records yet",
  "管理你的命盘资料": "Manage your chart files",
  "+ 添加": "+ Add",
  "出生信息": "Birth Info",
  "排盘": "Chart",
  "姓名": "Name",
  "请输入姓名（选填）": "Enter name (optional)",
  "年": "Year",
  "农历年": "Lunar year",
  "搜索城市，如：北京、上海、Tokyo": "Search city, e.g. Beijing, Shanghai, Tokyo",
  "性别": "Gender",
  "出生日期": "Birth Date",
  "必填": "Required",
  "出生时刻": "Birth Time",
  "精确到分钟": "To the minute",
  "出生地点": "Birth Place",
  "影响真太阳时": "Affects true solar time",
  "出生日期必填": "Birth date required",
  "公历": "Solar",
  "农历": "Lunar",
  "闰月": "Leap Month",
  "闰月自动识别": "Auto Leap Month",
  "出生时刻精确到分钟": "Birth time accurate to the minute",
  "出生地点影响真太阳时": "Birth location affects true solar time",
  "采用真太阳时": "Use true solar time",
  "开始排盘": "Create Chart",
  "已接入网站排盘算法": "Site chart algorithm connected",
  "‹ 返回": "‹ Back",
  "阳男": "Yang Male",
  "二〇二六年三月廿六": "Lunar Mar 26, 2026",
  "时辰": "Hour",
  "申时": "Shen Hour",
  "局数": "Bureau",
  "火六局": "Fire Sixth Bureau",
  "命宫 申 · 身宫 子 · 已接入": "Life Palace Shen · Body Palace Zi · Connected",
  "紫微命书 · AI总批命": "Zi Wei Book · AI Full Reading",
  "✦ 命盘 · AI解读": "Chart · AI Reading",
  "对齐命书长页：总批命、7个模块、五卷报告、人生曲线、五宫详解。": "Matches the long report: full reading, 7 modules, 5 volumes, life curve, and palace details.",
  "已接入命书长页同款模块，可单独重批、追问或下载 PDF。": "Long-report modules are connected. Re-run, follow up, or download PDF.",
  "对齐电脑端六卷：总局、专题、大限、小限、曲线、建议。": "Aligned with desktop: overview, topics, decade, yearly luck, curve, and advice.",
  "已接入电脑端同款核心解读，可单独重批、追问或下载 PDF。": "Desktop-level core readings are connected. Re-run, follow up, or download PDF.",
  "总批命": "Full Reading",
  "追问": "Follow-up",
  "下载PDF": "Download PDF",
  "正在打包PDF…": "Packing PDF...",
  "PDF已开始下载。": "PDF download started.",
  "PDF下载失败，请检查网络后重试。": "PDF failed. Check network and retry.",
  "整体": "Overall",
  "大限流年": "Major Luck",
  "十年大限": "10-Year Luck",
  "小限流年": "Yearly Luck",
  "身宫": "Body Palace",
  "婚姻": "Marriage",
  "健康": "Health",
  "财运": "Wealth",
  "事业": "Career",
  "行动建议": "Action Advice",
  "模块": "Modules",
  "待生成": "Pending",
  "状态": "Status",
  "卷报告": "volumes",
  "壹": "I",
  "贰": "II",
  "叁": "III",
  "肆": "IV",
  "伍": "V",
  "陆": "VI",
  "整体批命": "Overall Reading",
  "专题批命": "Topic Readings",
  "人生曲线": "Life Curve",
  "五宫详解": "Five Palace Details",
  "卷一": "Volume 1",
  "卷二": "Volume 2",
  "卷三": "Volume 3",
  "卷四": "Volume 4",
  "卷五": "Volume 5",
  "卷六": "Volume 6",
  "等待 AI 批命生成命盘主线、格局底色与关键提醒。": "Waiting for AI to generate chart theme, structure, and key reminders.",
  "单独批总局": "Read Overall",
  "等待生成": "Waiting",
  "等待生成当前大限、流年节奏与时间窗口。": "Waiting to generate current luck, yearly rhythm, and timing windows.",
  "批当前十年": "Read Current Decade",
  "等待生成当前小限流年、应事宫位与提醒。": "Waiting to generate current yearly luck, triggered palace, and reminders.",
  "单独批小限": "Read Year",
  "等待生成客户易懂版人生曲线、低点高点和阶段提醒。": "Waiting to generate an easy life curve, lows, highs, and stage reminders.",
  "生成曲线": "Generate Curve",
  "生成后显示人生起伏曲线": "Life ups and downs appear after generation",
  "对齐命书长页的人生曲线模块，给客户看低点、高点和后势。": "Life curve module for lows, highs, and later trend.",
  "低点 36岁": "Low: age 36",
  "高点 44岁": "High: age 44",
  "后势 56岁": "Later trend: age 56",
  "等待生成身宫、婚姻、健康、财运、事业五宫详解。": "Waiting to generate body, marriage, health, wealth, and career palace details.",
  "单独批五宫": "Read Five Palaces",
  "等待生成身宫、婚姻、健康、财运、事业五项专题。": "Waiting to generate five topic readings: body, marriage, health, wealth, and career.",
  "单独批专题": "Read Topics",
  "等待单独批命生成。": "Waiting for module reading.",
  "生成": "Generate",
  "等待汇总风险、时机和可执行建议。": "Waiting to summarize risks, timing, and actions.",
  "生成建议": "Generate Advice",
  "风险": "Risks",
  "先把命盘里的压力点收成清单，重大决定不要只看单点吉凶。": "List the chart pressure points first; do not base major decisions on one sign.",
  "时机": "Timing",
  "先看大限节奏，再定近期动作，避免逆着时间窗口硬冲。": "Check the luck cycle before acting; avoid pushing against the timing window.",
  "动作": "Actions",
  "先稳住基本盘，再把可执行的选择一项项落地。": "Stabilize the base, then execute choices one by one.",
  "卡券包": "Coupons",
  "可用的报告券": "Available report coupons",
  "暂无可用": "None available",
  "当前可用次数": "Available Credits",
  "当前套餐": "Current Plan",
  "套餐规则": "Plan Rules",
  "按量购买": "Credits",
  "支付后直接增加阅天AI对话次数，无需兑换。": "Credits are added after payment. No redemption needed.",
  "选择购买套餐": "Choose Package",
  "选择支付方式": "Payment Method",
  "支付方式": "Payment Method",
  "微信支付": "WeChat Pay",
  "支付宝配置中": "Alipay Coming Soon",
  "支付宝": "Alipay",
  "信用卡": "Credit Card",
  "按次数购买，仅限阅天AI对话使用，支付后自动到账": "Credits are for Yuetian AI chat only and arrive after payment.",
  "立即购买 ¥12": "Buy Now ¥12",
  "会员支付": "Payment",
  "套餐支付": "Plan Payment",
  "确认订单": "Confirm Order",
  "阅天会员月卡": "Monthly Member",
  "阅天AI付费版": "Yuetian AI Paid Plan",
  "许半仙 AI 对话": "AI Chat",
  "商品": "Product",
  "订单号": "Order No.",
  "待创建": "Pending",
  "阅天会员月卡，19.9元/月": "Yuetian monthly membership, ¥19.9/month",
  "付费版 100次/天，按日刷新": "Paid plan: 100/day, resets daily",
  "确认支付 ¥19.90": "Pay ¥19.90",
  "微信支付完成后会员额度自动刷新": "Membership quota refreshes after WeChat Pay completes",
  "微信支付完成后付费额度自动刷新": "Paid quota refreshes after WeChat Pay completes",
  "开通后提升对话额度": "Increase chat quota after activation",
  "对话额度": "Chat Quota",
  "免费用户": "Free User",
  "付费用户": "Paid User",
  "30次/天": "30/day",
  "100次/天": "100/day",
  "按日刷新": "Resets daily",
  "每日额度自动刷新。": "Daily quota resets automatically.",
  "每日自动刷新。": "Resets daily.",
  "只按每日额度计算：免费 30次/天，付费 100次/天。": "Daily only: free 30/day, paid 100/day.",
  "免费用户 30次/天，付费用户 100次/天；每日刷新，不设月额度。": "Free 30/day, paid 100/day; resets daily with no monthly quota.",
  "开通付费版": "Open Paid Plan",
  "查看套餐规则": "View Plan Rules",
  "更适合高频追问、复盘命盘、连续做年度规划。": "Better for frequent follow-ups, chart review, and yearly planning.",
  "当前额度": "Current Quota",
  "每日额度 100次/天": "Daily quota 100/day",
  "今日剩余 100/100": "Today remaining 100/100",
  "开通会员 ¥19.90": "Open Membership ¥19.90",
  "开通付费版 ¥19.90": "Open Paid Plan ¥19.90",
  "推荐你使用阅天AI，AI排盘、命盘解读和许半仙问答都在这里。": "I recommend Yuetian AI for AI charting, chart readings, and Xu Banxian Q&A.",
  "登录后可生成专属邀请码。": "Sign in to generate your personal invite code.",
  "微信好友": "WeChat Friend",
  "朋友圈": "Moments",
  "系统分享": "System Share",
  "邮件": "Email",
  "电子邮箱": "Email",
  "小红书": "RED",
  "阅天AI命理小助手": "Yuetian AI Assistant",
  "微信公众号": "WeChat",
  "悦天AI公众号": "Yuetian AI",
  "关注我们的推特": "Follow us on X",
  "关于我们": "About Us",
  "阅天AI是一款手机端命理排盘、合盘、抽签与AI解读工具，帮你把复杂命理信息转成可理解、可行动的建议。": "Yuetian AI is a mobile tool for charting, compatibility, lots, and AI readings, turning complex destiny data into understandable guidance.",
  "隐私协议": "Privacy Policy",
  "用户协议": "Terms of Service",
  "检查更新": "Check for Updates",
  "登录/注册": "Sign In / Register",
  "地脉道": "Earth Meridian",
  "教程": "Help",
  "九宫安位": "Nine-Palace Placement",
  "逐格点击加号安位": "Tap each plus to place items",
  "罗盘方位": "Compass",
  "方位校准": "Direction",
  "东南西北": "E S W N",
  "点此安位": "Tap to place",
  "解读分析": "Analyze",
  "长幼归位": "Auto Align",
  "长幼有序,天地归位": "Aligned",
  "重置": "Reset",
  "当前内容信息仅供娱乐，不等于专业测评，不代表价值评判，无任何现实指导意义，仅供娱乐参考。": "For entertainment only. Not a professional evaluation or real-world guidance.",
  "当前内容仅供娱乐参考，不等于专业测评或现实指导。": "For entertainment only, not a professional evaluation or real-world guidance.",
  "本次安位": "Current Placement",
  "尚未排布": "Not placed yet",
  "重新分析": "Analyze Again",
  "解读结果": "Reading Results",
  "本位相合": "Aligned",
  "卦象解读": "Hexagram Reading",
  "空间象义": "Space Meaning",
  "方位适配": "Good Fit",
  "位置待调": "Needs Adjustment",
  "8条解读": "8 readings",
  "选择方位成员": "Choose Members",
  "家人、空间、清空都保留；可多选，再点取消。": "Family, spaces, and clear are all available. Multi-select; tap again to cancel.",
  "可多选；再次点击取消，清空会移除本宫全部": "Multiple choices allowed. Tap again to cancel. Clear removes all items here.",
  "父亲": "Father",
  "母亲": "Mother",
  "长子": "Eldest Son",
  "长女": "Eldest Daughter",
  "二子": "Second Son",
  "二女": "Second Daughter",
  "三子": "Third Son",
  "三女": "Third Daughter",
  "厨房": "Kitchen",
  "厕所": "Bathroom",
  "客厅": "Living Room",
  "清空": "Clear",
  "确认清空": "Confirm Clear",
  "查看全文⌄": "View Full Text⌄",
  "长女住巽(东南) - 巽为风": "Eldest Daughter in Xun (Southeast) - Xun Wind",
  "二女住离(正南) - 离为火": "Second Daughter in Li (South) - Li Fire",
  "母亲住坤(西南) - 坤为地": "Mother in Kun (Southwest) - Kun Earth",
  "长子住震(正东) - 震为雷": "Eldest Son in Zhen (East) - Zhen Thunder",
  "三女住兑(正西) - 兑为泽": "Third Daughter in Dui (West) - Dui Lake",
  "三子住艮(东北) - 艮为山": "Third Son in Gen (Northeast) - Gen Mountain",
  "二子住坎(正北) - 坎为水": "Second Son in Kan (North) - Kan Water",
  "父亲住乾(西北) - 乾为天": "Father in Qian (Northwest) - Qian Heaven",
  "第57卦 巽为风：摘句「婚姻幸福」。长女归巽，巽象大利未婚女、婚姻、科甲与健康。": "Hexagram 57 Xun Wind: excerpt \"happy marriage\". Eldest daughter in Xun favors unmarried daughters, marriage, study, and health.",
  "第30卦 离为火：摘句「迁移外地」。二女归离，离象主明理、外地心与科甲。": "Hexagram 30 Li Fire: excerpt \"relocation\". Second daughter in Li points to clarity, travel mindset, and study.",
  "第2卦 坤为地：摘句「地厚能载物」。母亲归西南，重承载、家务与实际掌权。": "Hexagram 2 Kun Earth: excerpt \"earth carries all\". Mother in southwest emphasizes support, household matters, and practical authority.",
  "第51卦 震为雷：摘句「贵子」。长子归震，震象主贵子、祖业、科甲与官商皆可。": "Hexagram 51 Zhen Thunder: excerpt \"noble son\". Eldest son in Zhen relates to heirs, family assets, study, office, and business.",
  "第58卦 兑为泽：摘句「多才艺」。三女归兑，兑象主感情复杂、才艺科甲、公职顺。": "Hexagram 58 Dui Lake: excerpt \"many talents\". Third daughter in Dui points to complex feelings, talent, study, and public roles.",
  "第52卦 艮为山：摘句「孝子」。三子归艮，艮象主科甲、健康、公职与知进退。": "Hexagram 52 Gen Mountain: excerpt \"filial son\". Third son in Gen points to study, health, public roles, and knowing when to stop.",
  "第29卦 坎为水：摘句「正北宫有险」。二子归坎，坎象主冒险、官非与婚期延后。": "Hexagram 29 Kan Water: excerpt \"risk in north palace\". Second son in Kan points to risk, disputes, and delayed marriage timing.",
  "第1卦 乾为天：摘句「父居乾位」。父亲归西北，重父位、主事与家中骨架。": "Hexagram 1 Qian Heaven: excerpt \"father in Qian\". Father in northwest emphasizes the father role, leadership, and family structure.",
  "当前内容仅供娱乐参考，不等于专业测评。": "For entertainment only, not a professional evaluation.",
  "地脉道怎么用": "How It Works",
  "先定方位，再放人和空间；结果会对应海厦《地脉道》64卦。": "Set directions, then place people and spaces; results map to 64 hexagrams.",
  "站在户型中心": "Stand at the floor-plan center",
  "先确定房屋中心点，再按手机指南针或户型图标出八方。": "Find the home center, then mark eight directions by phone compass or floor plan.",
  "点击方位加号": "Tap direction plus",
  "把家人、厨房、厕所、客厅放入对应宫位。": "Place family members, kitchen, bathroom, and living room in matching palaces.",
  "一键归位": "Auto Align",
  "可用“长幼有序”快速按父母子女关系填入九宫。": "Use family order to quickly fill the nine palaces.",
  "按《地脉道》对应64卦，输出摘句、解读和安位建议。": "Map to 64 hexagrams and output excerpts, readings, and placement advice.",
  "开始排布": "Start Placement",
  "保留原流程：定方位、点加号、选成员/空间、再解读。": "Same flow: set directions, tap plus, choose members/spaces, then analyze.",
  "核心功能不变": "Core Flow Preserved",
  "样式升级不改变九宫、选项、按钮和结果逻辑。": "The style upgrade keeps the nine-palace grid, options, actions, and result logic intact.",
  "选择并确认": "Choose and Confirm",
  "每个宫位都可点，进入选择成员或空间。": "Each palace can be tapped to choose members or spaces.",
  "父母、子女、厨房、厕所、客厅、清空全部保留。": "Parents, children, kitchen, bathroom, living room, and clear are all preserved.",
  "返回九宫后点解读，生成阳宅结果。": "Return to the grid and tap analyze to generate the home reading.",
  "开始安位": "Start Placement",
  "3分钟排出宅盘": "Build a Home Chart in 3 Minutes",
  "先定中宫，再分八方，最后把家人与空间放入宫位。": "Find the center first, mark the eight directions, then place family members and spaces.",
  "核心只有三步": "Only Three Core Steps",
  "定位、安位、解读。页面里的加号就是每个宫位的入口。": "Locate, place, and read. Each plus sign opens that palace.",
  "定中宫": "Set Center",
  "站在户型中心，以手机指南针或户型图确认八方。": "Stand at the floor-plan center and confirm the eight directions.",
  "安人事": "Place People",
  "点方位加号，放入父母子女、厨房、厕所、客厅。": "Tap a direction plus, then place family members, kitchen, bathroom, or living room.",
  "看重点": "Read Focus",
  "系统按卦位生成摘要，先读偏旺、相合、需调整。": "The system summarizes by palace: over-strong, aligned, or needs adjustment.",
  "可重排": "Rearrange",
  "不确定时可清空、长幼归位，再重新解读。": "If unsure, clear, auto-align, and read again.",
  "开始排宅盘": "Start Home Chart",
  "小六壬起课": "Xiao Liuren Casting",
  "先定一念，再看六宫": "Set one thought, then read six palaces",
  "农历月令起，大安顺推至时辰。": "Start from lunar month and count from Da'an to the hour.",
  "起课前": "Before Casting",
  "心里只问一件事，不用输入问题。确认当下时间后点击起课。": "Ask only one question in mind. Confirm current time, then cast.",
  "当前课时": "Current Time",
  "午时": "Wu Hour",
  "2026年三月30日": "Lunar Mar 30, 2026",
  "重新取时": "Refresh Time",
  "默念后起课": "Cast After Focusing",
  "月令": "Month",
  "速喜": "Quick Joy",
  "日辰": "Day",
  "留连": "Lingering",
  "待起课": "Not Cast",
  "大安": "Great Peace",
  "吉": "Good",
  "凶": "Bad",
  "赤口": "Red Mouth",
  "小吉": "Minor Luck",
  "空亡": "Void",
  "等待起课": "Waiting to Cast",
  "先定念待": "Focus First",
  "念": "Q",
  "心里只问一件事，确认当下时间后再起课。不要反复重占同一件事。": "Ask only one thing in mind. Confirm the time before casting. Do not repeat the same question.",
  "定念": "Focus",
  "当下": "Now",
  "一事一占": "One question",
  "先定念": "Focus First",
  "待": "Pending",
  "校准时间": "Calibrate Time",
  "重新定念": "Refocus",
  "复制结果": "Copy Result",
  "已取当下时间，先定念再起课": "Current time loaded. Focus before casting.",
  "六壬法教程": "Liuren Guide",
  "怎么起课": "How to Cast",
  "不用输入问题，直接以当前农历时间取象。": "No text question needed. Read from the current lunar time.",
  "一": "1",
  "取当下时间": "Use current time",
  "进入页面会自动读取手机当前公历时间，并换算成农历月日与时辰。": "The page reads current solar time and converts it to lunar month, day, and hour.",
  "二": "2",
  "从大安顺推": "Count from Da'an",
  "农历月份从大安起，接着推农历日期，再推十二时辰。": "Start lunar month at Da'an, then count day and hour.",
  "三": "3",
  "看落宫吉凶": "Read palace luck",
  "落到大安、速喜、小吉为吉；留连、赤口、空亡偏凶。": "Da'an, Quick Joy, and Minor Luck are good; Lingering, Red Mouth, and Void lean bad.",
  "四": "4",
  "只作参考": "Reference only",
  "六壬法适合快速看当下气象，重要决策仍需结合完整命盘与现实信息。": "Liuren is for quick timing. Important decisions still need chart and real-world context.",
  "六宫顺序": "Six Palace Order",
  "大安 → 留连 → 速喜 → 赤口 → 小吉 → 空亡": "Great Peace → Lingering → Quick Joy → Red Mouth → Minor Luck → Void",
  "开始起课": "Start Casting",
  "未登录": "Not signed in",
  "登录后查看支付记录": "Sign in to view payment records",
  "会员订单、支付状态和退款记录都会绑定到账号。": "Membership orders, payment status, and refunds are linked to your account.",
  "去登录": "Sign In",
  "微": "W",
  "圈": "M",
  "享": "Share",
  "邮": "@",
  "文": "A",
  "登": "Sign"
};

const WENTIAN_I18N_EN_STEM_BRANCH = {
  "甲": "Jia", "乙": "Yi", "丙": "Bing", "丁": "Ding", "戊": "Wu", "己": "Ji", "庚": "Geng", "辛": "Xin", "壬": "Ren", "癸": "Gui",
  "子": "Zi", "丑": "Chou", "寅": "Yin", "卯": "Mao", "辰": "Chen", "巳": "Si", "午": "Wu", "未": "Wei", "申": "Shen", "酉": "You", "戌": "Xu", "亥": "Hai"
};

const WENTIAN_I18N_EN_TERM_MAP = {
  "天同": "Tian Tong", "禄存": "Lu Cun", "武曲": "Wu Qu", "天府": "Tian Fu", "擎羊": "Qing Yang", "左辅": "Zuo Fu", "太阳": "Tai Yang", "太阴": "Tai Yin", "地劫": "Di Jie", "贪狼": "Tan Lang", "天马": "Tian Ma", "右弼": "You Bi", "破军": "Po Jun", "陀罗": "Tuo Luo", "天机": "Tian Ji", "巨门": "Ju Men", "火星": "Huo Xing", "天钺": "Tian Yue", "地空": "Di Kong", "紫微": "Zi Wei", "天相": "Tian Xiang", "廉贞": "Lian Zhen", "文昌": "Wen Chang", "七杀": "Qi Sha", "文曲": "Wen Qu", "天梁": "Tian Liang", "铃星": "Ling Xing", "天魁": "Tian Kui",
  "子女": "Children", "夫妻": "Spouse", "兄弟": "Siblings", "命宫": "Life Palace", "财帛": "Wealth", "父母": "Parents", "疾厄": "Health", "福德": "Fortune", "迁移": "Travel", "仆役": "Friends", "官禄": "Career", "田宅": "Property", "身宫": "Body Palace", "得": "Gain", "大子": "D.Child", "大夫": "D.Spouse", "大兄": "D.Sibling", "大命": "D.Life", "大财": "D.Wealth", "大父": "D.Parent", "大疾": "D.Health", "大福": "D.Fortune", "大迁": "D.Travel", "大仆": "D.Friends", "大官": "D.Career", "大田": "D.Property",
  "巽": "SE", "离": "S", "坤": "SW", "震": "E", "兑": "W", "艮": "NE", "坎": "N", "乾": "NW", "东南": "SE", "正南": "S", "西南": "SW", "正东": "E", "正西": "W", "东北": "NE", "正北": "N", "西北": "NW",
  "长女位": "1st Daughter", "二女位": "2nd Daughter", "母亲位": "Mother", "长子位": "1st Son", "三女位": "3rd Daughter", "三子位": "3rd Son", "二子位": "2nd Son", "父亲位": "Father", "长女": "1st Daughter", "二女": "2nd Daughter", "母亲": "Mother", "长子": "1st Son", "三女": "3rd Daughter", "三子": "3rd Son", "二子": "2nd Son", "父亲": "Father",
  "厨房": "Kitchen", "厕所": "Bathroom", "客厅": "Living Room", "厨": "Kit.", "厕": "Bath", "厅": "LR", "长": "1st", "父": "F", "母": "M"
};

const WENTIAN_I18N_EN_ZIWEI_TERMS = {
  "禄": "Lu", "权": "Quan", "科": "Ke", "忌": "Ji",
  "化禄": "Hua Lu", "化权": "Hua Quan", "化科": "Hua Ke", "化忌": "Hua Ji",
  "阳男": "Yang Male", "阴男": "Yin Male", "阳女": "Yang Female", "阴女": "Yin Female", "早子时": "Early Zi Hour", "晚子时": "Late Zi Hour",
  "天喜": "Tian Xi", "阴煞": "Yin Sha", "天贵": "Tian Gui", "凤阁": "Feng Ge", "蜚廉": "Fei Lian", "飞廉": "Fei Lian", "年解": "Nian Jie",
  "天德": "Tian De", "截路": "Jie Lu", "寡宿": "Gua Su", "三台": "San Tai", "台辅": "Tai Fu", "天巫": "Tian Wu", "天福": "Tian Fu",
  "天伤": "Tian Shang", "天使": "Tian Shi", "天空": "Tian Kong",
  "天厨": "Tian Chu", "小耗": "Xiao Hao", "华盖": "Hua Gai", "红鸾": "Hong Luan", "解神": "Jie Shen", "天寿": "Tian Shou",
  "八座": "Ba Zuo", "天官": "Tian Guan", "天刑": "Tian Xing", "天才": "Tian Cai", "天月": "Tian Yue", "恩光": "En Guang",
  "龙池": "Long Chi", "旬空": "Xun Kong", "天哭": "Tian Ku", "咸池": "Xian Chi", "月德": "Yue De", "天姚": "Tian Yao",
  "封诰": "Feng Gao", "破碎": "Po Sui", "天虚": "Tian Xu", "孤辰": "Gu Chen", "劫煞": "Jie Sha", "灾煞": "Zai Sha",
  "天煞": "Tian Sha", "指背": "Zhi Bei", "月煞": "Yue Sha", "亡神": "Wang Shen", "攀鞍": "Pan An", "岁驿": "Sui Yi",
  "息神": "Xi Shen", "将星": "Jiang Xing", "长生": "Chang Sheng", "沐浴": "Mu Yu", "冠带": "Guan Dai", "临官": "Lin Guan",
  "帝旺": "Di Wang", "衰": "Shuai", "病": "Bing", "死": "Si", "墓": "Mu", "绝": "Jue", "胎": "Tai", "养": "Yang",
  "博士": "Bo Shi", "力士": "Li Shi", "青龙": "Qing Long", "将军": "Jiang Jun", "奏书": "Zou Shu", "喜神": "Xi Shen",
  "病符": "Bing Fu", "大耗": "Da Hao", "伏兵": "Fu Bing", "官府": "Guan Fu", "岁建": "Sui Jian", "晦气": "Hui Qi",
  "丧门": "Sang Men", "贯索": "Guan Suo", "官符": "Guan Fu", "龙德": "Long De", "白虎": "Bai Hu", "吊客": "Diao Ke",
  "鼠": "Rat", "牛": "Ox", "虎": "Tiger", "兔": "Rabbit", "龙": "Dragon", "蛇": "Snake", "马": "Horse", "羊": "Goat",
  "猴": "Monkey", "鸡": "Rooster", "狗": "Dog", "猪": "Pig",
  "白羊座": "Aries", "金牛座": "Taurus", "双子座": "Gemini", "巨蟹座": "Cancer", "狮子座": "Leo", "处女座": "Virgo",
  "天秤座": "Libra", "天蝎座": "Scorpio", "射手座": "Sagittarius", "摩羯座": "Capricorn", "水瓶座": "Aquarius", "双鱼座": "Pisces"
};

const WENTIAN_I18N_EN_BRIGHTNESS = {
  "庙": "Temple", "旺": "Prosp.", "得": "Gain", "利": "Benef.", "平": "Neutral", "不": "Dim", "陷": "Fallen"
};

const WENTIAN_I18N_EN_BRIGHTNESS_PINYIN = {
  "庙": "Miao", "旺": "Wang", "得": "De", "利": "Li", "平": "Ping", "不": "Bu", "陷": "Xian"
};

const WENTIAN_I18N_EN_ELEMENT_MAP = {
  "木": "Wood", "火": "Fire", "土": "Earth", "金": "Metal", "水": "Water"
};

const WENTIAN_I18N_EN_BUREAU_MAP = {
  "二": "Second", "三": "Third", "四": "Fourth", "五": "Fifth", "六": "Sixth"
};

const WENTIAN_I18N_EN_LUNAR_MONTH_MAP = {
  "正月": "First Month", "二月": "Second Month", "三月": "Third Month", "四月": "Fourth Month", "五月": "Fifth Month", "六月": "Sixth Month",
  "七月": "Seventh Month", "八月": "Eighth Month", "九月": "Ninth Month", "十月": "Tenth Month", "十一月": "Eleventh Month", "十二月": "Twelfth Month",
  "冬月": "Eleventh Month", "腊月": "Twelfth Month"
};

const WENTIAN_I18N_EN_LUNAR_DAY_MAP = {
  "初一": "Day 1", "初二": "Day 2", "初三": "Day 3", "初四": "Day 4", "初五": "Day 5", "初六": "Day 6", "初七": "Day 7", "初八": "Day 8", "初九": "Day 9", "初十": "Day 10",
  "十一": "Day 11", "十二": "Day 12", "十三": "Day 13", "十四": "Day 14", "十五": "Day 15", "十六": "Day 16", "十七": "Day 17", "十八": "Day 18", "十九": "Day 19", "二十": "Day 20",
  "廿一": "Day 21", "廿二": "Day 22", "廿三": "Day 23", "廿四": "Day 24", "廿五": "Day 25", "廿六": "Day 26", "廿七": "Day 27", "廿八": "Day 28", "廿九": "Day 29", "三十": "Day 30"
};

const WENTIAN_I18N_HAS_HAN_RE = /\p{Script=Han}/u;

function translateWentianText(text, code = getWentianLanguageCode(), element = null) {
  const source = String(text || "").trim();
  if (!source) return source;
  const lang = getWentianLanguageOption(code).code;
  const dict = WENTIAN_I18N[lang];
  if (!dict) return source;
  if (lang === "en" && source === "阅天AI" && element?.dataset?.nodeId?.startsWith("source-bottom-label-")) return "AI";
  if (lang === "zh-Hant") {
    const solarLabel = source.match(/^阳历:(.+)$/);
    if (solarLabel) return `陽曆:${solarLabel[1]}`;
  }
  if (lang === "en") {
    if (source.includes("\n") || source.includes("\\n")) {
      return source.split(/(?:\\n|\n)+/).map((line) => translateWentianText(line, code, element)).join("\n");
    }
    const archiveSolarDate = source.match(/^阳历:(.+)$/);
    if (archiveSolarDate) return `Solar: ${archiveSolarDate[1]}`;
    const exact = WENTIAN_I18N_EN_EXTRA[source] || WENTIAN_I18N_EN_ZIWEI_TERMS[source] || WENTIAN_I18N_EN_TERM_MAP[source];
    if (exact) return exact;
    if (WENTIAN_I18N_EN_BRIGHTNESS[source]) return WENTIAN_I18N_EN_BRIGHTNESS[source];
    for (const [suffix, brightness] of Object.entries(WENTIAN_I18N_EN_BRIGHTNESS)) {
      if (source.length > suffix.length && source.endsWith(suffix)) {
        const base = source.slice(0, -suffix.length);
        const translatedBase = WENTIAN_I18N_EN_ZIWEI_TERMS[base] || WENTIAN_I18N_EN_TERM_MAP[base];
        if (translatedBase) return `${translatedBase.replace(/\s+/g, "")} ${WENTIAN_I18N_EN_BRIGHTNESS_PINYIN[suffix] || brightness}`;
      }
    }
    const palaceAiTitle = source.match(/^✦\s*(.+?)\s*·\s*AI解析$/);
    if (palaceAiTitle) return `✦ ${translateWentianText(palaceAiTitle[1], "en")} · AI Reading`;
    const dropdownName = source.match(/^(.+)⌄$/);
    if (dropdownName) return `${translateWentianText(dropdownName[1], "en")}⌄`;
    const pairNames = source.match(/^(.+?)\s*×\s*(.+)$/);
    if (pairNames) return `${translateWentianText(pairNames[1], "en")} × ${translateWentianText(pairNames[2], "en")}`;
    const people = source.match(/^(\d+)\s*人$/);
    if (people) return `${people[1]} people`;
    const scorePoints = source.match(/^(\d+)\s*分$/);
    if (scorePoints) return `${scorePoints[1]} pts`;
    const hepanSelected = source.match(/^已选\s*(\d+)\/2$/);
    if (hepanSelected) return `Selected ${hepanSelected[1]}/2`;
    const yangzhaiReadingCount = source.match(/^已生成\s*(\d+)\s*条解读$/) || source.match(/^(\d+)\s*条解读$/);
    if (yangzhaiReadingCount) return `${yangzhaiReadingCount[1]} readings`;
    const yangzhaiConfirm = source.match(/^确认本宫安位\s*\((\d+)\)$/);
    if (yangzhaiConfirm) return `Confirm Placement (${yangzhaiConfirm[1]})`;
    const yangzhaiPalaceTag = source.match(/^(.+?)宫\s*·\s*(.+?)\s*·\s*(.+)$/);
    if (yangzhaiPalaceTag) {
      return `${translateWentianText(yangzhaiPalaceTag[1], "en")} Palace · ${translateWentianText(yangzhaiPalaceTag[2], "en")} · ${translateWentianText(yangzhaiPalaceTag[3], "en")}`;
    }
    const liuyaoProgress = source.match(/^已成\s*(\d+)\/6\s*爻$/);
    if (liuyaoProgress) return `${liuyaoProgress[1]}/6 lines`;
    const liuyaoToss = source.match(/^投第\s*(\d+)\s*爻$/);
    if (liuyaoToss) return `Cast Line ${liuyaoToss[1]}`;
    const liuyaoSwipe = source.match(/^向上滑动抛第\s*(\d+)\s*爻$/);
    if (liuyaoSwipe) return `Swipe up to cast line ${liuyaoSwipe[1]}`;
    const liuyaoCasting = source.match(/^抛币中，正在定第\s*(\d+)\s*爻$/);
    if (liuyaoCasting) return `Casting line ${liuyaoCasting[1]}...`;
    const liuyaoCastingStatus = source.match(/^铜钱正在翻转，1 秒后落入第\s*(\d+)\s*爻。$/);
    if (liuyaoCastingStatus) return `Coins are turning. Line ${liuyaoCastingStatus[1]} lands after 1 second.`;
    const liuyaoLineValue = source.match(/^(6|7|8|9)\s*(少阳|少阴|老阳|老阴)(\s*[○×])?$/);
    if (liuyaoLineValue) return `${liuyaoLineValue[1]} ${translateWentianText(liuyaoLineValue[2], "en")}${liuyaoLineValue[3] || ""}`;
    const liuyaoHexNo = source.match(/^(.+)上(.+)下\s*·\s*第(\d+)卦$/);
    if (liuyaoHexNo) return `${translateWentianText(liuyaoHexNo[1], "en")} over ${translateWentianText(liuyaoHexNo[2], "en")} · Hexagram ${liuyaoHexNo[3]}`;
    const hepanArchiveCount = source.match(/^共\s*(\d+)\s*张档案，可滚动选择$/);
    if (hepanArchiveCount) return `${hepanArchiveCount[1]} files · scroll to choose`;
    const hepanMeta = source.match(/^(男|女)\s*·\s*四柱八字$/);
    if (hepanMeta) return `${hepanMeta[1] === "男" ? "M" : "F"} · Bazi`;
    const lifeBodyNote = source.match(/^命宫\s*([子丑寅卯辰巳午未申酉戌亥—-]+)\s*·\s*身宫\s*([子丑寅卯辰巳午未申酉戌亥—-]+)\s*·\s*已接入$/);
    if (lifeBodyNote) return `Life Palace ${translateWentianText(lifeBodyNote[1], "en")} · Body Palace ${translateWentianText(lifeBodyNote[2], "en")} · Connected`;
    const palaceBranch = source.match(/^(命宫|身宫)\s*([子丑寅卯辰巳午未申酉戌亥])$/);
    if (palaceBranch) return `${translateWentianText(palaceBranch[1], "en")} ${translateWentianText(palaceBranch[2], "en")}`;
    const fiveElementBureau = source.match(/^([木火土金水])([二三四五六])局$/);
    if (fiveElementBureau) return `${WENTIAN_I18N_EN_ELEMENT_MAP[fiveElementBureau[1]]} ${WENTIAN_I18N_EN_BUREAU_MAP[fiveElementBureau[2]]} Bureau`;
    const month = source.match(/^(\d{1,2})月$/);
    if (month) return `Month ${month[1]}`;
    const lunarMonthMap = WENTIAN_I18N_EN_LUNAR_MONTH_MAP;
    if (lunarMonthMap[source]) return lunarMonthMap[source];
    const lunarDate = source.match(/^(\d{4})年(.+?)(\d{1,2})日$/);
    if (lunarDate && lunarMonthMap[lunarDate[2]]) return `Lunar ${lunarDate[1]} ${lunarMonthMap[lunarDate[2]]} Day ${lunarDate[3]}`;
    const chineseLunarDate = source.match(/^([〇零一二三四五六七八九]{4})年(闰)?(.+月)(.+)$/);
    if (chineseLunarDate && lunarMonthMap[chineseLunarDate[3]] && WENTIAN_I18N_EN_LUNAR_DAY_MAP[chineseLunarDate[4]]) {
      const digitMap = { "〇": "0", "零": "0", "一": "1", "二": "2", "三": "3", "四": "4", "五": "5", "六": "6", "七": "7", "八": "8", "九": "9" };
      const year = chineseLunarDate[1].split("").map((char) => digitMap[char] || char).join("");
      const leap = chineseLunarDate[2] ? "Leap " : "";
      return `Lunar ${year} ${leap}${lunarMonthMap[chineseLunarDate[3]]} ${WENTIAN_I18N_EN_LUNAR_DAY_MAP[chineseLunarDate[4]]}`;
    }
    const day = source.match(/^(\d{1,2})日$/);
    if (day) return `Day ${day[1]}`;
    const hour = source.match(/^(\d{2})时$/);
    if (hour) return `${hour[1]}:00`;
    const minute = source.match(/^(\d{2})分$/);
    if (minute) return `${minute[1]} min`;
    const credits = source.match(/^(\d+)次$/);
    if (credits) return `${credits[1]} credits`;
    const quota = source.match(/^(\d+)次\/天 · (\d+)次\/月$/);
    if (quota) return `${quota[1]}/day · ${quota[2]}/month`;
    const directionOnly = source.match(/^\((.+)\)$/);
    if (directionOnly && WENTIAN_I18N_EN_TERM_MAP[directionOnly[1]]) return "";
    const palaceLine = source.match(/^(.+)\((.+)\) - (.+)$/);
    if (palaceLine) {
      const person = WENTIAN_I18N_EN_TERM_MAP[palaceLine[1]] || palaceLine[1];
      const direction = WENTIAN_I18N_EN_TERM_MAP[palaceLine[2]] || palaceLine[2];
      const hexagram = WENTIAN_I18N_EN_TERM_MAP[palaceLine[3]] || palaceLine[3];
      return `${person} (${direction}) - ${hexagram}`;
    }
    const branchHour = source.match(/^([子丑寅卯辰巳午未申酉戌亥])时$/);
    if (branchHour) return `${WENTIAN_I18N_EN_STEM_BRANCH[branchHour[1]]} Hour`;
    const stemBranch = source.match(/^[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]{1,2}$/);
    if (stemBranch) return source.split("").map((char) => WENTIAN_I18N_EN_STEM_BRANCH[char] || char).join(" ");
    const stemBranchLine = source.match(/^[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]{2}(?:\s+[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]{2})+$/);
    if (stemBranchLine) return source.split(/\s+/).map((item) => translateWentianText(item, "en")).join(" · ");
    const branchPairNote = source.match(/^([甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥])([甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥])(同气，容易理解彼此|六合，吸引力强|相冲，需要定规则|三合同局，合作感较好|平稳，可靠相处养成默契)$/);
    if (branchPairNote) {
      const pair = `${translateWentianText(branchPairNote[1], "en")} ${translateWentianText(branchPairNote[2], "en")}`;
      const notes = {
        "同气，容易理解彼此": "same energy, easy to understand each other",
        "六合，吸引力强": "six-harmony, strong attraction",
        "相冲，需要定规则": "clash, rules are needed",
        "三合同局，合作感较好": "triad alignment, good teamwork",
        "平稳，可靠相处养成默契": "steady, reliable rapport can grow"
      };
      return `${pair}: ${notes[branchPairNote[3]] || "compatible"}`;
    }
    const elementPairNote = source.match(/^([木火土金水])([木火土金水])(同频，价值观接近|节奏不同，适合分工互补)$/);
    if (elementPairNote) {
      const note = elementPairNote[3] === "同频，价值观接近"
        ? "aligned frequency, close values"
        : "different rhythms, good for complementary roles";
      return `${WENTIAN_I18N_EN_ELEMENT_MAP[elementPairNote[1]]} ${WENTIAN_I18N_EN_ELEMENT_MAP[elementPairNote[2]]}: ${note}`;
    }
    const elementGenerateNote = source.match(/^([木火土金水])生([木火土金水])，(.+)$/);
    if (elementGenerateNote) {
      const note = elementGenerateNote[3] === "一方能带动另一方" ? "one side can motivate the other" : "mutual support is clear";
      return `${WENTIAN_I18N_EN_ELEMENT_MAP[elementGenerateNote[1]]} generates ${WENTIAN_I18N_EN_ELEMENT_MAP[elementGenerateNote[2]]}: ${note}`;
    }
    const solarTime = source.match(/^公历 (.+) · 北京时间 (.+)$/);
    if (solarTime) return `Solar ${solarTime[1]} · Beijing time ${solarTime[2]}`;
    const trueSolar = source.match(/^预览真太阳时：(.+) · (.+) · (.+)分钟$/);
    if (trueSolar) return `True solar preview: ${trueSolar[1]} · ${translateWentianText(trueSolar[2], "en")} · ${trueSolar[3]} min`;
  }
  return dict[source] || source;
}

function rememberWentianTextSource(element, source) {
  if (!element) return;
  element.textContent = source;
  if (element.firstChild?.nodeType === Node.TEXT_NODE) {
    wentianI18nTextSources.set(element.firstChild, source.trim());
  }
}

function applyWentianLanguageText(root = view, code = getWentianLanguageCode()) {
  if (wentianI18nApplying) return;
  const option = getWentianLanguageOption(code);
  wentianI18nApplying = true;
  try {
    document.documentElement.lang = option.htmlLang;
    document.documentElement.dataset.wentianLanguage = option.code;
    if (!root || !root.querySelectorAll) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const tag = node.parentElement?.tagName;
        if (tag === "SCRIPT" || tag === "STYLE") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    for (const node of textNodes) {
      const current = node.nodeValue;
      const trimmed = current.trim();
      const source = option.code !== "zh-Hans" && WENTIAN_I18N_HAS_HAN_RE.test(trimmed)
        ? trimmed
        : wentianI18nTextSources.get(node) || trimmed;
      wentianI18nTextSources.set(node, source);
      const leading = current.match(/^\s*/)?.[0] || "";
      const trailing = current.match(/\s*$/)?.[0] || "";
      node.nodeValue = `${leading}${translateWentianText(source, option.code, node.parentElement)}${trailing}`;
    }

    for (const element of root.querySelectorAll("[placeholder]")) {
      const current = element.getAttribute("placeholder") || "";
      const source = option.code !== "zh-Hans" && WENTIAN_I18N_HAS_HAN_RE.test(current)
        ? current
        : element.dataset.wentianI18nPlaceholderSource || current;
      element.dataset.wentianI18nPlaceholderSource = source;
      element.setAttribute("placeholder", translateWentianText(source, option.code, element));
    }
  } finally {
    window.setTimeout(() => {
      wentianI18nApplying = false;
    }, 0);
  }
}

function scheduleWentianLanguageApply() {
  if (wentianI18nApplying || wentianI18nQueued || getWentianLanguageCode() === "zh-Hans") return;
  wentianI18nQueued = true;
  window.requestAnimationFrame(() => {
    wentianI18nQueued = false;
    applyWentianLanguageText(view);
  });
}

function ensureWentianLanguageObserver() {
  if (wentianI18nObserver || typeof MutationObserver === "undefined" || !view) return;
  wentianI18nObserver = new MutationObserver(scheduleWentianLanguageApply);
  wentianI18nObserver.observe(view, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["placeholder"]
  });
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

function getWentianUrlParams(source) {
  const raw = String(source || "").replace(/^[?#]/, "");
  return new URLSearchParams(raw);
}

function hasWentianAuthParams(params) {
  return ["access_token", "refresh_token", "code", "error", "error_code", "error_description"].some((key) => params.has(key));
}

function isWentianAuthCallbackUrl() {
  return hasWentianAuthParams(getWentianUrlParams(window.location.hash)) || hasWentianAuthParams(getWentianUrlParams(window.location.search));
}

function getWentianAuthCallbackError() {
  const hashParams = getWentianUrlParams(window.location.hash);
  const searchParams = getWentianUrlParams(window.location.search);
  return hashParams.get("error_description") || searchParams.get("error_description") || hashParams.get("error") || searchParams.get("error") || "";
}

function getWentianAuthCallbackValue(key) {
  const hashValue = getWentianUrlParams(window.location.hash).get(key);
  if (hashValue) return hashValue;
  return getWentianUrlParams(window.location.search).get(key);
}

function buildWentianAuthSessionFromCallback() {
  const accessToken = getWentianAuthCallbackValue("access_token");
  const refreshToken = getWentianAuthCallbackValue("refresh_token");
  if (!accessToken || !refreshToken) return null;
  const expiresIn = Number(getWentianAuthCallbackValue("expires_in") || 3600);
  const expiresAt = Number(getWentianAuthCallbackValue("expires_at"))
    || Math.floor(Date.now() / 1000) + (Number.isFinite(expiresIn) ? expiresIn : 3600);
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
    expires_in: Number.isFinite(expiresIn) ? expiresIn : null,
    token_type: getWentianAuthCallbackValue("token_type") || "bearer",
    user: null,
  };
}

function clearWentianAuthReturnState() {
  try {
    localStorage.removeItem(WENTIAN_AUTH_RETURN_KEY);
  } catch (_err) {}
}

function getWentianAuthReturnState() {
  try {
    const raw = localStorage.getItem(WENTIAN_AUTH_RETURN_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    if (!saved || Date.now() - Number(saved.ts || 0) > 10 * 60 * 1000) {
      clearWentianAuthReturnState();
      return null;
    }
    return saved;
  } catch (_err) {
    clearWentianAuthReturnState();
    return null;
  }
}

function setWentianAuthReturnState(data = {}) {
  try {
    localStorage.setItem(WENTIAN_AUTH_RETURN_KEY, JSON.stringify({ ...data, ts: Date.now() }));
  } catch (_err) {}
}

function replaceWentianUrlRoute(route) {
  const params = new URLSearchParams(window.location.search);
  ["code", "state", "error", "error_code", "error_description", "auth", "screen"].forEach((key) => params.delete(key));
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}#${route}`;
  window.history.replaceState(null, "", nextUrl);
}

function getWentianGoogleRedirectUrl() {
  if (window.location.hostname === "yuetianai.com") return WENTIAN_GOOGLE_REDIRECT_BRIDGE;
  return new URL(window.location.pathname, window.location.origin).toString();
}

function readWentianStoredSession() {
  try {
    const raw = localStorage.getItem(WENTIAN_AUTH_SESSION_KEY);
    const session = raw ? JSON.parse(raw) : null;
    return session?.access_token && session?.user ? session : null;
  } catch (_err) {
    return null;
  }
}

function saveWentianAuthSession(session) {
  try {
    if (session?.access_token && session?.refresh_token) {
      localStorage.setItem(WENTIAN_AUTH_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(WENTIAN_AUTH_SESSION_KEY);
    }
  } catch (_err) {}
}

function setWentianAuthSession(session) {
  wentianAuthSession = session || null;
  saveWentianAuthSession(session);
  wentianMemberState.loaded = false;
  wentianOrderState.loaded = false;
  wentianInviteState.loaded = false;
}

function isWentianSessionExpiring(session) {
  if (!session?.expires_at) return false;
  return Date.now() >= (Number(session.expires_at) * 1000) - WENTIAN_AUTH_REFRESH_SKEW_MS;
}

function phoneToWentianEmail(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits || digits.length < 6 || digits.length > 20) return "";
  return `phone_${digits}@yuetianai.local`;
}

function inputToWentianAuthEmail(value) {
  const raw = String(value || "").trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return raw.toLowerCase();
  return phoneToWentianEmail(raw);
}

function getWentianAuthUserLabel(session = wentianAuthSession) {
  const user = session?.user;
  if (!user) return "";
  return user.user_metadata?.phone || user.email || "已登录";
}

function getWentianAuthDisplay() {
  const profile = getWentianProfile();
  const session = wentianAuthSession?.user ? wentianAuthSession : readWentianStoredSession();
  if (session?.user && !wentianAuthSession) wentianAuthSession = session;
  const label = getWentianAuthUserLabel(session);
  if (!session?.user) {
    return {
      loggedIn: false,
      name: "登录/注册",
      sub: "登录 / 注册后可支付与同步订单",
      email: "未登录",
      initial: "登",
    };
  }
  const nickname = profile.nickname && profile.nickname !== "谢广周" ? profile.nickname : label;
  return {
    loggedIn: true,
    name: nickname || "已登录",
    sub: "账号已登录",
    email: label,
    initial: (nickname || label || "问").slice(0, 1),
  };
}

async function getWentianAuthSession(options = {}) {
  const current = wentianAuthSession || readWentianStoredSession();
  if (current && !options.force && !isWentianSessionExpiring(current)) {
    wentianAuthSession = current;
    return current;
  }
  if (!current?.refresh_token) {
    wentianAuthSession = current || null;
    return wentianAuthSession;
  }
  try {
    const data = await wentianFetchJson("/api/auth/refresh", {
      method: "POST",
      body: { refreshToken: current.refresh_token },
      noAuth: true,
    });
    setWentianAuthSession(data?.session || null);
    return wentianAuthSession;
  } catch (_err) {
    setWentianAuthSession(null);
    return null;
  }
}

async function getWentianAuthToken() {
  const session = await getWentianAuthSession();
  return session?.access_token || "";
}

function refreshWentianAuthScreens() {
  if (["screen-1", "screen-22", "screen-24", "screen-30", "screen-31", "screen-33", "screen-34", "screen-38", "screen-39", "screen-40", "screen-41", "screen-48"].includes(state.route)) {
    navigate(state.route, false);
  }
}

async function initWentianAuth() {
  if (wentianAuthReadyPromise) return wentianAuthReadyPromise;
  wentianAuthReadyPromise = getWentianAuthSession().then((session) => {
    setWentianAuthSession(session || null);
    if (wentianAuthSession?.user) {
      window.setTimeout(() => bindWentianPendingInvite({ rerender: true }), 80);
      window.setTimeout(() => hydrateWentianInvite({ force: true, rerender: true }), 160);
    }
    return wentianAuthSession;
  }).catch(() => null);
  return wentianAuthReadyPromise;
}

async function requireWentianAuth() {
  const session = await getWentianAuthSession();
  if (session?.user) return session;
  wentianAuthState.mode = "login";
  wentianAuthState.error = "请先登录后再支付，会员和订单会绑定到账号。";
  wentianPendingPaymentAfterLogin = true;
  navigate("screen-40");
  return null;
}

function openWentianLogoutConfirm() {
  wentianLogoutConfirmOpen = true;
  navigate("screen-38", false);
}

function closeWentianLogoutConfirm() {
  wentianLogoutConfirmOpen = false;
  navigate("screen-38", false);
}

function setWentianPasswordStatus(text, tone = "") {
  wentianPasswordState.status = text || "";
  wentianPasswordState.error = tone === "error" ? text || "" : "";
  wentianPasswordState.tone = tone || "";
  const el = document.getElementById("wentian-password-status");
  if (!el) return;
  el.textContent = text || "";
  el.dataset.tone = tone;
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

function collectWentianProfileForm() {
  const nickname = (document.getElementById("wentian-profile-nickname")?.value || "").trim();
  const email = (document.getElementById("wentian-profile-email")?.value || "").trim();
  const phone = (document.getElementById("wentian-profile-phone")?.value || "").trim();
  if (!nickname) {
    return { error: "请填写昵称" };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "邮箱格式不正确" };
  }
  return { nickname, email, phone };
}

function submitWentianProfileForm() {
  const profile = collectWentianProfileForm();
  if (profile.error) {
    setWentianProfileStatus(profile.error, "error");
    return;
  }
  saveWentianProfile(profile);
  setWentianProfileStatus(wentianAuthSession?.user ? "已保存到本机，可点下方同步到账号" : "已保存到本机", "ok");
}

async function syncWentianProfileToAccount() {
  const profile = collectWentianProfileForm();
  if (profile.error) {
    setWentianProfileStatus(profile.error, "error");
    return;
  }
  saveWentianProfile(profile);
  const client = getWentianAuthClient();
  const session = await getWentianAuthSession();
  if (!client || !session?.user) {
    setWentianProfileStatus("请先登录，再同步到账号", "error");
    return;
  }
  setWentianProfileStatus("正在同步到账号...", "");
  try {
    const nextMetadata = {
      ...(session.user.user_metadata || {}),
      nickname: profile.nickname,
      display_name: profile.nickname,
      profile_email: profile.email,
      phone: profile.phone || session.user.user_metadata?.phone || "",
    };
    const { data, error } = await client.auth.updateUser({ data: nextMetadata });
    if (error) throw error;
    if (data?.user) {
      setWentianAuthSession({ ...session, user: data.user });
    }
    setWentianProfileStatus("已同步到账号，换设备登录后可带出资料", "ok");
  } catch (error) {
    setWentianProfileStatus(error.message || "同步失败，请稍后重试", "error");
  }
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
  pushWentianArchivesToRemote(getWentianArchiveList());
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
  clearWentianXuChatContext();
  navigate("screen-4");
}

function cancelWentianArchiveSelection() {
  wentianArchiveDraftId = null;
  navigate(state.stack.pop() || "screen-1", false);
}

function resetWentianXuChatRuntime() {
  if (wentianXuChat.typingTimer) {
    clearTimeout(wentianXuChat.typingTimer);
    wentianXuChat.typingTimer = null;
  }
  wentianXuChat.sessionId = null;
  wentianXuChat.sessionPromise = null;
  wentianXuChat.messages = [];
  wentianXuChat.loading = false;
}

function getWentianXuChatContext() {
  if (wentianXuChat.context) return wentianXuChat.context;
  try {
    const parsed = JSON.parse(sessionStorage.getItem(WENTIAN_XU_CONTEXT_KEY) || "null");
    if ((parsed?.type === "liuyao" || parsed?.type === "hepan" || parsed?.type === "liuren") && isWentianUuid(parsed.recordId)) {
      wentianXuChat.context = parsed;
      return parsed;
    }
  } catch (_err) {}
  return null;
}

function setWentianXuChatContext(context) {
  wentianXuChat.context = context || null;
  try {
    if (context) sessionStorage.setItem(WENTIAN_XU_CONTEXT_KEY, JSON.stringify(context));
    else sessionStorage.removeItem(WENTIAN_XU_CONTEXT_KEY);
  } catch (_err) {}
  resetWentianXuChatRuntime();
}

function clearWentianXuChatContext() {
  if (!getWentianXuChatContext()) return;
  setWentianXuChatContext(null);
}

function getWentianXuChatPayload() {
  const context = getWentianXuChatContext();
  if (context?.type === "liuyao" && isWentianUuid(context.recordId)) {
    const divinationChartData = {
      chartRecordId: context.recordId,
      chatMode: "liuyao",
      source: "六爻占卜",
      divinationContext: context,
    };
    return {
      mode: "liuyao",
      chartRecordId: context.recordId,
      chartData: divinationChartData,
      divinationContext: context,
    };
  }
  if (context?.type === "hepan" && isWentianUuid(context.recordId)) {
    const hepanChartData = {
      chartRecordId: context.recordId,
      chatMode: "hepan",
      source: context.title || "关系合盘",
      hepanContext: context,
      hepanRules: WENTIAN_HEPAN_AI_RULES,
      hepanRelationship: {
        label: context.relationLabel,
        scope: context.relationScope,
        evidence: context.relationEvidence || [],
      },
      leftChart: context.left?.chart,
      rightChart: context.right?.chart,
    };
    return {
      mode: "hepan",
      chartRecordId: context.recordId,
      chartData: hepanChartData,
      divinationContext: context,
    };
  }
  if (context?.type === "liuren" && isWentianUuid(context.recordId)) {
    const liurenChartData = {
      chartRecordId: context.recordId,
      chatMode: "liuren",
      source: "六壬法",
      divinationContext: context,
    };
    return {
      mode: "liuren",
      chartRecordId: context.recordId,
      chartData: liurenChartData,
      divinationContext: context,
    };
  }
  const chartData = getWentianChartPayload();
  return {
    mode: "chart",
    chartRecordId: chartData.chartRecordId,
    chartData,
    divinationContext: null,
  };
}

function buildWentianXuOutboundMessage(message, context) {
  if (context?.type === "hepan") {
    return [
      "【关系合盘追问】",
      `本次不是单人命盘读盘，请只围绕本次${context.relationLabel || "关系合盘"}回答。`,
      "合盘前置规则：",
      context.rules || WENTIAN_HEPAN_AI_RULES,
      `关系类型：${context.relationLabel || ""}，${context.relationScope || ""}`,
      `宫位落点：${(context.relationEvidence || []).join("；")}`,
      `对象A：${context.left?.name || ""}，${context.left?.gender || ""}，${context.left?.datetime || ""}，${context.left?.age ?? ""}岁，四柱：${context.left?.pillars || ""}`,
      `对象A命盘摘要：${JSON.stringify(context.left?.chart || {})}`,
      `对象B：${context.right?.name || ""}，${context.right?.gender || ""}，${context.right?.datetime || ""}，${context.right?.age ?? ""}岁，四柱：${context.right?.pillars || ""}`,
      `对象B命盘摘要：${JSON.stringify(context.right?.chart || {})}`,
      `页面合盘：${context.score || ""}分，${context.level || ""}`,
      `维度：${(context.dimensions || []).map(([label, score, note]) => `${label}${score}分：${note}`).join("；")}`,
      context.advice ? `页面建议：${context.advice}` : "",
      "回答要求：先判断关系前提是否成立，再按关系类型讲互动点、冲突点、长期节奏和可执行建议。非情侣关系不得输出婚恋、暧昧、结婚或同居判断。",
      "",
      `我的追问：${message}`,
    ].filter(Boolean).join("\n");
  }
  if (context?.type === "liuren") {
    return [
      "【六壬法追问】",
      "请按小六壬当下课式回答，不要提紫微、命盘或六爻纳甲。",
      "如果用户没有说清具体事情，先请他补一句所问之事；但仍可按当前落宫给方向。",
      `起课时间：${context.castAtText || "未记录"}`,
      `农历课时：${context.lunarText || ""} · ${context.hourName || ""}时`,
      `顺推路径：${context.formula || ""}`,
      `月令落宫：${context.monthPalace || ""}`,
      `日辰落宫：${context.dayPalace || ""}`,
      `时辰落宫：${context.palaceName || ""}（${context.nature || ""}）`,
      `关键词：${(context.keys || []).join("、")}`,
      context.summary ? `页面初判：${context.summary}` : "",
      context.advice ? `页面建议：${context.advice}` : "",
      "回答要求：先一句话断核心结果，再讲成败快慢、阻力和下一步。不要长篇，不要说“结合命盘”。",
      "",
      `我的追问：${message}`,
    ].filter(Boolean).join("\n");
  }
  if (context?.type !== "liuyao") return message;
  return [
    "【六爻占卜追问】",
    "请按六爻占卜专批来断，围绕所问之事、本卦、变卦、动爻和页面初判回答；不要提紫微或命盘。",
    `所问之事：${context.question || "未填写"}`,
    `起卦时间：${context.castAtText || "未记录"}`,
    `本卦：${context.primaryText || ""}`,
    `变卦：${context.changedText || ""}`,
    `动爻：${context.movingText || "无"}`,
    `六爻：${context.linesText || ""}`,
    context.advice ? `页面初判：${context.advice}` : "",
    "回答格式：先断这件事，再讲变化点，再给应对和取舍。不要说“结合命盘”。",
    "",
    `我的追问：${message}`,
  ].filter(Boolean).join("\n");
}

function getWentianTransientKey(recordId = getWentianXuChatPayload().chartRecordId) {
  return `wentian-xubanxian-transient:${recordId}`;
}

function loadWentianTransientState(recordId) {
  try {
    const raw = sessionStorage.getItem(getWentianTransientKey(recordId));
    return raw ? JSON.parse(raw) : null;
  } catch (_err) {
    return null;
  }
}

function saveWentianTransientState(state, recordId) {
  try {
    if (state) sessionStorage.setItem(getWentianTransientKey(recordId), JSON.stringify(state));
    else sessionStorage.removeItem(getWentianTransientKey(recordId));
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
    const headers = { "Content-Type": "application/json" };
    const token = await getWentianAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${getWentianApiBase()}${path}`, {
      method: "POST",
      headers,
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

async function wentianFetchJson(path, options = {}) {
  const method = options.method || (options.body ? "POST" : "GET");
  const headers = options.body ? { "Content-Type": "application/json" } : { "Accept": "application/json" };
  if (options.authToken) {
    headers.Authorization = `Bearer ${options.authToken}`;
  } else if (!options.noAuth) {
    const token = await getWentianAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${getWentianApiBase()}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const contentType = String(response.headers.get("content-type") || "");
  const data = contentType.includes("application/json")
    ? await response.json()
    : { error: await response.text() };
  if (!response.ok || data.error) throw new Error(data.error || `服务异常 ${response.status}`);
  return data;
}

function refreshWentianInviteScreens() {
  if (["screen-22", "screen-24", "screen-31", "screen-34", "screen-40"].includes(state.route)) {
    navigate(state.route, false);
  }
}

async function hydrateWentianInvite(options = {}) {
  if (wentianInviteState.loading && !options.force) return wentianInviteReadyPromise;
  const session = await getWentianAuthSession();
  if (!session?.user) {
    wentianInviteState.loaded = true;
    wentianInviteState.loading = false;
    wentianInviteState.error = "";
    wentianInviteState.summary = null;
    wentianInviteState.summary = getWentianInviteSnapshot();
    if (options.rerender) refreshWentianInviteScreens();
    return wentianInviteState.summary;
  }
  wentianInviteState.loading = true;
  wentianInviteState.error = "";
  wentianInviteReadyPromise = wentianFetchJson("/api/referrals/summary")
    .then((data) => {
      wentianInviteState.loaded = true;
      wentianInviteState.summary = data;
      return data;
    })
    .catch((error) => {
      wentianInviteState.error = error.message || "邀请记录读取失败";
      return getWentianInviteSnapshot();
    })
    .finally(() => {
      wentianInviteState.loading = false;
      if (options.rerender) refreshWentianInviteScreens();
    });
  return wentianInviteReadyPromise;
}

function setWentianInviteStatus(text, tone = "") {
  wentianInviteState.status = text || "";
  ["wentian-invite-status", "wentian-share-status"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = wentianInviteState.status;
    el.dataset.tone = tone;
  });
}

function requireWentianInviteAccount() {
  if (wentianAuthSession?.user) return true;
  wentianAuthState.mode = "register";
  navigate("screen-40");
  return false;
}

async function bindWentianInviteCode(code, options = {}) {
  const normalized = normalizeWentianInviteCode(code);
  if (!isWentianInviteCode(normalized)) {
    setWentianInviteStatus("请输入正确的邀请码", "error");
    return null;
  }
  const session = await getWentianAuthSession();
  if (!session?.user) {
    setWentianPendingInviteCode(normalized);
    wentianAuthState.mode = "register";
    setWentianInviteStatus("已记录邀请码，登录/注册后自动绑定。", "ok");
    if (options.rerender) navigate("screen-40");
    return null;
  }
  try {
    const data = await wentianFetchJson("/api/referrals/bind", {
      method: "POST",
      body: { inviteCode: normalized },
    });
    clearWentianPendingInviteCode();
    setWentianLocalInviteStatus({ inviteCode: data.inviteCode, boundAt: data.invitedAt || new Date().toISOString() });
    setWentianInviteStatus(data.message || "邀请码已绑定", "ok");
    await hydrateWentianInvite({ force: true, rerender: options.rerender });
    return data;
  } catch (error) {
    setWentianInviteStatus(error.message || "邀请码绑定失败", "error");
    return null;
  }
}

async function bindWentianPendingInvite(options = {}) {
  const code = getWentianPendingInviteCode();
  if (!isWentianInviteCode(code)) return null;
  return bindWentianInviteCode(code, options);
}

async function writeWentianClipboardText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const input = document.createElement("textarea");
  input.value = text;
  input.style.position = "fixed";
  input.style.opacity = "0";
  input.style.pointerEvents = "none";
  document.body.appendChild(input);
  input.focus();
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  return copied;
}

async function copyWentianText(text, okText, failText = "复制失败，请长按文本手动复制", failTone = "error") {
  try {
    const copied = await writeWentianClipboardText(text);
    if (!copied) throw new Error("copy failed");
    setWentianInviteStatus(okText || "已复制", "ok");
    return true;
  } catch (_err) {
    setWentianInviteStatus(failText, failTone);
    return false;
  }
}

function setWentianContactStatus(text, tone = "") {
  const el = document.getElementById("wentian-contact-status");
  if (!el) return;
  el.textContent = text || "";
  el.dataset.tone = tone;
}

async function copyWentianContactText(text, okText) {
  try {
    const copied = await writeWentianClipboardText(text);
    if (!copied) throw new Error("copy failed");
    setWentianContactStatus(okText || "已复制", "ok");
    return true;
  } catch (_err) {
    setWentianContactStatus("已显示联系信息，请长按本页文字复制", "ok");
    return false;
  }
}

async function shareWentianInvite() {
  const summary = getWentianInviteSnapshot();
  const text = `我在用阅天AI排盘和问许半仙，注册时填邀请码 ${summary.inviteCode} 可领取体验次数：${summary.inviteLink}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "阅天AI", text, url: summary.inviteLink });
      setWentianInviteStatus("已打开系统分享", "ok");
      return;
    } catch (_err) {}
  }
  await copyWentianText(text, "分享文案已复制");
}

function getWentianSharePayload() {
  const account = getWentianAuthDisplay();
  const summary = getWentianInviteSnapshot();
  const appUrl = "https://yuetianai.com/pages/wentian-app.html";
  const hasInvite = account.loggedIn && isWentianInviteCode(summary.inviteCode);
  const url = hasInvite ? summary.inviteLink : appUrl;
  const inviteLine = hasInvite ? `我的邀请码：${summary.inviteCode}` : "登录后可生成专属邀请码。";
  const text = `推荐你使用阅天AI，AI排盘、命盘解读和许半仙问答都在这里。\n${inviteLine}\n${url}`;
  return {
    title: "阅天AI",
    text,
    url,
    inviteCode: hasInvite ? summary.inviteCode : "",
    hasInvite,
  };
}

async function shareWentianApp(target = "system") {
  const payload = getWentianSharePayload();
  if (target === "link") {
    await copyWentianText(payload.url, "分享链接已复制");
    return;
  }
  if (target === "wechat") {
    await copyWentianText(payload.text, "已复制，打开微信发送给好友", "浏览器限制自动复制，请长按上方文案后发给微信好友", "ok");
    return;
  }
  if (target === "moments") {
    await copyWentianText(payload.text, "已复制，打开朋友圈粘贴发布", "浏览器限制自动复制，请长按上方文案后发到朋友圈", "ok");
    return;
  }
  if (target === "mail") {
    const subject = encodeURIComponent(payload.title);
    const body = encodeURIComponent(payload.text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setWentianInviteStatus("已打开邮件分享", "ok");
    return;
  }
  if (navigator.share) {
    try {
      await navigator.share({ title: payload.title, text: payload.text, url: payload.url });
      setWentianInviteStatus("已打开系统分享", "ok");
      return;
    } catch (_err) {}
  }
  await copyWentianText(payload.text, "分享文案已复制", "浏览器未开放系统分享，请长按上方文案复制", "ok");
}

async function handleWentianContactAction(action) {
  if (action === "wentian-contact-email") {
    await copyWentianContactText("842598522@qq.com", "邮箱已复制，可直接发邮件联系");
    window.location.href = "mailto:842598522@qq.com?subject=%E9%98%85%E5%A4%A9AI%E5%92%A8%E8%AF%A2";
    return;
  }
  if (action === "wentian-contact-xiaohongshu") {
    await copyWentianContactText("阅天AI命理小助手", "小红书名称已复制，打开小红书搜索即可");
    return;
  }
  if (action === "wentian-contact-wechat") {
    await copyWentianContactText("悦天AI公众号", "公众号名称已复制，打开微信搜索即可");
    return;
  }
  if (action === "wentian-contact-x") {
    await copyWentianContactText("阅天AI yuetianai.com", "X 联系信息已复制");
  }
}

function bindWentianInviteFromInput() {
  const input = document.getElementById("wentian-invite-bind-input");
  bindWentianInviteCode(input?.value || "", { rerender: true });
}

function setWentianChatStatus(text, tone = "") {
  const el = document.getElementById("wentian-chat-status");
  if (!el) return;
  el.textContent = text;
  el.dataset.tone = tone;
}

function isWentianMobileKeyboardViewport() {
  return window.matchMedia?.("(max-width: 880px), (pointer: coarse)")?.matches || false;
}

function resizeWentianChatInput(input) {
  if (!input) return 0;
  const minHeight = 48;
  const maxHeight = 118;
  input.style.height = `${minHeight}px`;
  const nextHeight = Math.max(minHeight, Math.min(maxHeight, input.scrollHeight || minHeight));
  input.style.height = `${nextHeight}px`;
  input.style.overflowY = input.scrollHeight > maxHeight ? "auto" : "hidden";
  return nextHeight - minHeight;
}

function syncWentianChatFaqLayout() {
  const phone = document.querySelector('.figma-phone[data-node-id="screen-4"]');
  const starters = document.querySelector(".wentian-chat-starters");
  const inputBg = document.querySelector('[data-node-id="source-4-input-bg"]');
  const input = document.getElementById("wentian-chat-input");
  const send = document.getElementById("wentian-chat-send");
  const disclaimer = document.querySelector('[data-node-id="source-4-disclaimer"]');
  if (!phone || !starters || !inputBg || !input || !send || !disclaimer) return;

  const openGroup = starters.querySelector(".wentian-chat-faq-group[open]");
  const baseListHeight = 160;
  const basePhoneHeight = 892;
  const basePositions = { inputBg: 790, input: 804, send: 812, disclaimer: 862 };

  starters.classList.toggle("is-expanded", Boolean(openGroup));
  starters.style.maxHeight = openGroup ? "none" : "";
  const listHeight = openGroup ? Math.ceil(starters.scrollHeight) : baseListHeight;
  const faqExtra = openGroup ? Math.max(0, listHeight - baseListHeight + 18) : 0;
  const inputExtra = resizeWentianChatInput(input);
  const fieldHeight = 48 + inputExtra;
  const totalExtra = faqExtra + inputExtra;

  phone.style.height = `${basePhoneHeight + totalExtra}px`;
  inputBg.style.top = `${basePositions.inputBg + faqExtra}px`;
  inputBg.style.height = `${102 + inputExtra}px`;
  input.style.top = `${basePositions.input + faqExtra}px`;
  send.style.top = `${basePositions.input + faqExtra + fieldHeight - 40}px`;
  disclaimer.style.top = `${basePositions.disclaimer + totalExtra}px`;
  scheduleWentianPhoneFit();
}

function setWentianQuota(quota) {
  const el = document.querySelector('[data-node-id="source-4-left"]');
  if (quota) wentianMemberState.quota = normalizeWentianQuota({ ...(wentianMemberState.quota || {}), ...quota });
  if (!el || !quota) return;
  if (getWentianXuChatContext()) return;
  const normalized = normalizeWentianQuota(quota);
  const remainingValue = normalized.dailyRemaining ?? normalized.remaining;
  const limitValue = normalized.dailyLimit ?? normalized.limit;
  const remaining = remainingValue === null || remainingValue === undefined || remainingValue === "" ? "--" : remainingValue;
  const limit = limitValue === null || limitValue === undefined || limitValue === "" ? "--" : limitValue;
  el.textContent = `◇ 今日 ${remaining}/${limit}`;
}

function splitWentianLongSentence(sentence, maxLength = 58) {
  const chunks = String(sentence || "").match(/[^，、,]+[，、,]?/g) || [sentence];
  const groups = [];
  let current = "";
  for (const chunk of chunks) {
    if (current && current.length + chunk.length > maxLength) {
      groups.push(current.trim());
      current = "";
    }
    current += chunk;
  }
  if (current.trim()) groups.push(current.trim());
  return groups;
}

function splitWentianReplyParagraphs(text) {
  const raw = String(text || "").replace(/\r/g, "").trim();
  if (!raw) return [""];
  const explicitBlocks = raw.includes("\n")
    ? raw.split(/\n+/).map((item) => item.trim()).filter(Boolean)
    : [raw.replace(/\s+/g, " ").trim()];
  const paragraphs = [];

  for (const block of explicitBlocks) {
    const sentences = block.match(/[^。！？!?；;]+[。！？!?；;]?/g) || [block];
    const pieces = sentences.flatMap((sentence) => sentence.length > 76 ? splitWentianLongSentence(sentence) : [sentence.trim()]);
    let current = "";
    let sentenceCount = 0;
    for (const piece of pieces.filter(Boolean)) {
      const shouldBreak = current && (current.length + piece.length > 70 || sentenceCount >= 1);
      if (shouldBreak) {
        paragraphs.push(current.trim());
        current = "";
        sentenceCount = 0;
      }
      current += piece;
      sentenceCount += 1;
    }
    if (current.trim()) paragraphs.push(current.trim());
  }

  return paragraphs.length ? paragraphs : [raw];
}

function renderWentianChatMessageContent(message, role) {
  const text = String(message.text || "");
  if (role !== "assistant") return escapeHtml(text);
  return splitWentianReplyParagraphs(text)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function getWentianChatUserAvatarText() {
  const account = getWentianAuthDisplay();
  const archive = getCurrentWentianArchive();
  const display = getWentianArchiveDisplay(archive);
  const label = account.loggedIn ? account.initial : (display.name || account.initial || "我");
  return String(label || "我").trim().slice(0, 1) || "我";
}

function renderWentianMessages() {
  const box = document.getElementById("wentian-chat-messages");
  if (!box) return;
  box.innerHTML = wentianXuChat.messages.map((message) => {
    const role = message.role === "user" ? "user" : message.role === "system" ? "system" : "assistant";
    const avatar = role === "user" ? ` data-avatar="${escapeHtml(getWentianChatUserAvatarText())}"` : "";
    return `<div class="wentian-chat-msg is-${role} ${message.typing ? "is-typing" : ""}"${avatar}>${renderWentianChatMessageContent(message, role)}</div>`;
  }).join("");
  box.scrollTop = box.scrollHeight;
}

function finishWentianTyping(render = true) {
  if (wentianXuChat.typingTimer) {
    clearTimeout(wentianXuChat.typingTimer);
    wentianXuChat.typingTimer = null;
  }
  const typingMessage = wentianXuChat.messages.find((message) => message.typing);
  if (typingMessage) {
    typingMessage.text = typingMessage.fullText || typingMessage.text || "";
    typingMessage.typing = false;
    delete typingMessage.fullText;
  }
  if (render) renderWentianMessages();
}

function startWentianTyping(message) {
  if (wentianXuChat.typingTimer) {
    clearTimeout(wentianXuChat.typingTimer);
    wentianXuChat.typingTimer = null;
  }
  wentianXuChat.messages.forEach((item) => {
    if (item !== message && item.typing) {
      item.text = item.fullText || item.text || "";
      item.typing = false;
      delete item.fullText;
    }
  });
  const fullText = message.fullText || "";
  let index = 0;
  const tick = () => {
    if (!wentianXuChat.messages.includes(message)) return;
    if (index >= fullText.length) {
      message.typing = false;
      delete message.fullText;
      wentianXuChat.typingTimer = null;
      renderWentianMessages();
      return;
    }
    const char = fullText[index];
    index += 1;
    message.text = fullText.slice(0, index);
    renderWentianMessages();
    const delay = /[。！？!?]/.test(char) ? 120 : /[，、；;：:\n]/.test(char) ? 55 : 18;
    wentianXuChat.typingTimer = setTimeout(tick, delay);
  };
  tick();
}

function addWentianMessage(role, text, options = {}) {
  const message = options.typewriter && role === "assistant"
    ? { role, text: "", fullText: String(text || ""), typing: true }
    : { role, text };
  wentianXuChat.messages.push(message);
  if (wentianXuChat.messages.length > 30) wentianXuChat.messages.shift();
  renderWentianMessages();
  if (message.typing) startWentianTyping(message);
}

function setWentianChatBusy(busy) {
  wentianXuChat.loading = busy;
  const input = document.getElementById("wentian-chat-input");
  const send = document.getElementById("wentian-chat-send");
  if (input) input.disabled = busy;
  if (send) send.disabled = busy;
}

function getWentianXuModeText(mode, phase = "ready") {
  const map = {
    liuyao: { connecting: "接入占卜中…", ready: "占卜已接入", typing: "许半仙正在看卦…" },
    hepan: { connecting: "接入合盘中…", ready: "合盘已接入", typing: "许半仙正在看合盘…" },
    liuren: { connecting: "接入六壬中…", ready: "六壬已接入", typing: "许半仙正在看课…" },
    chart: { connecting: "接入中…", ready: "已连接", typing: "许半仙正在看盘…" },
  };
  return (map[mode] || map.chart)[phase] || map.chart[phase] || "";
}

async function ensureWentianXuSession(options = {}) {
  const silent = !!options.silent;
  if (wentianXuChat.sessionId) return wentianXuChat.sessionId;
  if (wentianXuChat.sessionPromise) return wentianXuChat.sessionPromise;

  const payload = getWentianXuChatPayload();
  if (!silent) setWentianChatStatus(getWentianXuModeText(payload.mode, "connecting"));
  wentianXuChat.sessionPromise = wentianPostJson("/api/ai/chat/session", {
    chartRecordId: payload.chartRecordId,
    chartData: payload.chartData,
    chatMode: payload.mode,
    divinationContext: payload.divinationContext,
    transientState: loadWentianTransientState(payload.chartRecordId),
  }, 90000, 1).then((data) => {
    wentianXuChat.sessionId = data.sessionId || `transient:${payload.chartRecordId}`;
    if (data.transientState) saveWentianTransientState(data.transientState, payload.chartRecordId);
    setWentianChatStatus(data.transientMode ? "临时会话" : getWentianXuModeText(payload.mode, "ready"), data.transientMode ? "warn" : "ok");
    if (!wentianXuChat.messages.length) {
      if (Array.isArray(data.messages) && data.messages.length) {
        wentianXuChat.messages = data.messages.slice(-12).map((item) => ({
          role: item.sender === "user" ? "user" : item.sender === "system" ? "system" : "assistant",
          text: item.content || "",
        }));
      } else {
        addWentianMessage("assistant", payload.mode === "liuyao"
          ? getLiuyaoXuOpeningMessage(payload.divinationContext)
          : payload.mode === "hepan"
            ? getHepanXuOpeningMessage(payload.divinationContext)
            : payload.mode === "liuren"
              ? getLiurenXuOpeningMessage(payload.divinationContext)
              : "命盘我已经读到了。你可以直接问感情、事业、财运，或者问最近一年怎么走。");
      }
      renderWentianMessages();
    }
    return wentianXuChat.sessionId;
  }).catch((error) => {
    if (silent) {
      setWentianChatStatus("已接入", "ok");
    } else {
      setWentianChatStatus("暂时未连上", "error");
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
  finishWentianTyping(false);
  const input = document.getElementById("wentian-chat-input");
  const message = (promptText || input?.value || "").trim();
  if (!message) return;
  if (input) {
    input.value = "";
    syncWentianChatFaqLayout();
    if (isWentianMobileKeyboardViewport()) input.blur();
  }

  const payload = getWentianXuChatPayload();
  const outboundMessage = buildWentianXuOutboundMessage(message, payload.divinationContext);
  addWentianMessage("user", message);
  addWentianMessage("assistant", getWentianXuModeText(payload.mode, "typing"));
  setWentianChatBusy(true);

  try {
    const data = await wentianPostJson("/api/ai/chat/send", {
      chartRecordId: payload.chartRecordId,
      message: outboundMessage,
      displayMessage: message,
      chartData: payload.chartData,
      chatMode: payload.mode,
      divinationContext: payload.divinationContext,
      transientState: loadWentianTransientState(payload.chartRecordId),
    }, 120000, 1);
    wentianXuChat.messages.pop();
    wentianXuChat.sessionId = data.sessionId || wentianXuChat.sessionId || `transient:${payload.chartRecordId}`;
    if (data.transientState) saveWentianTransientState(data.transientState, payload.chartRecordId);
    setWentianQuota(data.quota);
    setWentianChatStatus(data.transientMode ? "临时会话" : getWentianXuModeText(payload.mode, "ready"), data.transientMode ? "warn" : "ok");
    addWentianMessage("assistant", data.reply || "我看到了，但这轮没有返回内容，请再问一次。", { typewriter: true });
  } catch (error) {
    wentianXuChat.messages.pop();
    setWentianChatStatus("发送未完成", "error");
    addWentianMessage("system", getWentianFriendlyError(error));
  } finally {
    setWentianChatBusy(false);
    if (!isWentianMobileKeyboardViewport()) input?.focus();
  }
}

function initWentianXuChat() {
  const input = document.getElementById("wentian-chat-input");
  const send = document.getElementById("wentian-chat-send");
  if (!input || !send) return;

  const payload = getWentianXuChatPayload();
  const saved = getWentianSavedChart();
  const sizhu = payload.mode === "chart" ? saved?.chartData?.sizhu : null;
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
    if (profileEl) profileEl.textContent = "命主";
    const profileSubEl = document.querySelector('[data-node-id="source-4-profile-sub"]');
    if (profileSubEl) profileSubEl.textContent = "切换";
    const footEl = document.querySelector('[data-node-id="source-4-bazi-foot"]');
    if (footEl) footEl.textContent = `日主：${sizhu.dayStem || "—"}    生肖：${saved.chartData?.zodiac || "—"}`;
  }

  send.onclick = () => sendWentianXuChat();
  input.addEventListener("input", syncWentianChatFaqLayout);
  input.onkeydown = (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      sendWentianXuChat();
    }
  };

  if (!wentianXuChat.messages.length) {
    addWentianMessage("assistant", payload.mode === "liuyao"
      ? getLiuyaoXuOpeningMessage(payload.divinationContext)
      : payload.mode === "hepan"
        ? getHepanXuOpeningMessage(payload.divinationContext)
        : payload.mode === "liuren"
          ? getLiurenXuOpeningMessage(payload.divinationContext)
          : "我在，看命盘直接问。");
  } else {
    renderWentianMessages();
  }
  setWentianChatStatus(getWentianXuModeText(payload.mode, "ready"), "ok");
  syncWentianChatFaqLayout();
  ensureWentianXuSession({ silent: true }).catch(() => {});
}

function formatWentianMemberDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${padWentianNumber(date.getMonth() + 1)}-${padWentianNumber(date.getDate())}`;
}

function getWentianQuotaValue(key, fallback = "--") {
  const quota = wentianMemberState.quota || {};
  const value = quota[key];
  return value === null || value === undefined || value === "" ? fallback : value;
}

function normalizeWentianQuota(quota) {
  if (!quota) return quota;
  if (quota.testingUnlimited) return quota;
  const isMember = !!quota.isMember;
  const baseLimit = isMember ? WENTIAN_PAID_DAILY_LIMIT : WENTIAN_FREE_DAILY_LIMIT;
  const used = Number(quota.dailyUsed ?? quota.used ?? 0) || 0;
  const bonusRemaining = Math.max(0, Number(quota.referralBonus?.remaining || 0));
  const dailyLimit = baseLimit + bonusRemaining;
  const dailyRemaining = Math.max(0, dailyLimit - used);
  return {
    ...quota,
    dailyLimit,
    limit: dailyLimit,
    baseDailyLimit: baseLimit,
    dailyRemaining,
    remaining: dailyRemaining,
    monthlyLimit: null,
    baseMonthlyLimit: null,
    monthlyRemaining: null,
    baseMonthlyRemaining: null,
    monthlyUsed: null,
  };
}

function getWentianMemberSnapshot() {
  const quota = wentianMemberState.quota || {};
  const product = wentianMemberState.product || {};
  const isMember = !!quota.isMember;
  const defaultDailyLimit = isMember ? WENTIAN_PAID_DAILY_LIMIT : WENTIAN_FREE_DAILY_LIMIT;
  const dailyLimit = getWentianQuotaValue("dailyLimit", defaultDailyLimit);
  const dailyRemaining = getWentianQuotaValue("dailyRemaining", dailyLimit);
  return {
    isMember,
    title: isMember ? "付费版" : "免费版",
    subtitle: isMember
      ? `有效期至 ${formatWentianMemberDate(quota.memberExpiresAt) || "当前周期"}`
      : "免费 30次/天",
    daily: `${dailyRemaining}/${dailyLimit}`,
    dailyLimit: `${dailyLimit}次/天`,
    productName: product.name || WENTIAN_PAID_PRODUCT_NAME,
    amountYuan: product.amountYuan || "19.90",
    description: product.description || WENTIAN_PAID_PRODUCT_DESC,
  };
}

function getWentianPaymentProviders() {
  const list = Array.isArray(wentianMemberState.providers) ? wentianMemberState.providers : [];
  const byKey = new Map(list.map((item) => [item.provider, item]));
  return [
    { provider: "wechat", label: "微信支付", enabled: true, ...(byKey.get("wechat") || {}) },
    { provider: "alipay", label: "支付宝", enabled: false, ...(byKey.get("alipay") || {}) },
    { provider: "paypal", label: "PayPal", enabled: false, ...(byKey.get("paypal") || {}) },
  ];
}

function getWentianPaymentProviderMeta(provider = wentianPaymentState.provider) {
  return getWentianPaymentProviders().find((item) => item.provider === provider) || getWentianPaymentProviders()[0];
}

function getWentianPaymentProviderLabel() {
  return getWentianPaymentProviderMeta().label || (wentianPaymentState.provider === "paypal" ? "PayPal" : (wentianPaymentState.provider === "alipay" ? "支付宝" : "微信支付"));
}

function getWentianPaymentProviderAppLabel() {
  return getWentianPaymentProviderLabel().replace(/支付$/, "");
}

async function hydrateWentianMemberStatus(options = {}) {
  if (wentianMemberStatusPromise && !options.force) return wentianMemberStatusPromise;
  if (wentianMemberState.loaded && !options.force) return null;
  const chartRecordId = getWentianChartPayload().chartRecordId;
  const before = JSON.stringify({
    quota: wentianMemberState.quota,
    product: wentianMemberState.product,
  });
  wentianMemberStatusPromise = wentianFetchJson(`/api/payments/member-status?chartRecordId=${encodeURIComponent(chartRecordId)}`)
    .then((data) => {
      wentianMemberState.loaded = true;
      if (data.quota) wentianMemberState.quota = normalizeWentianQuota(data.quota);
      if (data.product) wentianMemberState.product = data.product;
      if (Array.isArray(data.providers)) wentianMemberState.providers = data.providers;
      if (!getWentianPaymentProviderMeta(wentianPaymentState.provider)?.enabled) {
        wentianPaymentState.provider = getWentianPaymentProviders().find((item) => item.enabled)?.provider || "wechat";
      }
      wentianMemberState.mockMode = !!data.mockMode;
      const after = JSON.stringify({
        quota: wentianMemberState.quota,
        product: wentianMemberState.product,
      });
      if (options.rerender && before !== after && ["screen-30", "screen-31", "screen-33", "screen-38", "screen-40", "screen-41"].includes(state.route)) {
        navigate(state.route, false);
      }
      return data;
    })
    .catch((error) => {
      console.info("wentian member status fallback", error);
      return null;
    })
    .finally(() => {
      wentianMemberStatusPromise = null;
    });
  return wentianMemberStatusPromise;
}

function getWentianPayMethod() {
  if (wentianPaymentState.provider === "paypal") return "redirect";
  if (wentianPaymentState.provider === "alipay" && isWentianMobilePayDevice()) return "h5";
  return "native";
}

function formatWentianPaymentAmount(amount, currency = "CNY") {
  const value = escapeHtml(amount || "19.90");
  const code = String(currency || "CNY").toUpperCase();
  if (code === "CNY") return `¥${value}`;
  if (code === "USD") return `$${value}`;
  if (code === "HKD") return `HK$${value}`;
  if (code === "SGD") return `S$${value}`;
  return `${code} ${value}`;
}

function stopWentianPaymentPoll() {
  if (wentianPaymentPollTimer) {
    clearInterval(wentianPaymentPollTimer);
    wentianPaymentPollTimer = null;
  }
}

function refreshWentianPaymentScreen() {
  if (state.route === "screen-30") navigate("screen-30", false);
}

async function checkWentianPaymentStatus() {
  if (!wentianPaymentState.orderNo) return null;
  try {
    const data = await wentianFetchJson(`/api/payments/order-status?orderNo=${encodeURIComponent(wentianPaymentState.orderNo)}`);
    wentianPaymentState.status = data.status || wentianPaymentState.status;
    wentianPaymentState.message = data.status === "paid" ? "已开通付费版" : `等待${getWentianPaymentProviderLabel()}完成`;
    if (data.status === "paid") {
      stopWentianPaymentPoll();
      await hydrateWentianMemberStatus({ force: true });
    }
    refreshWentianPaymentScreen();
    return data;
  } catch (error) {
    wentianPaymentState.error = error.message || "订单查询失败";
    refreshWentianPaymentScreen();
    return null;
  }
}

function startWentianPaymentPoll() {
  stopWentianPaymentPoll();
  if (!wentianPaymentState.orderNo || wentianPaymentState.mockMode) return;
  wentianPaymentPollTimer = setInterval(checkWentianPaymentStatus, WENTIAN_PAYMENT_POLL_MS);
}

async function startWentianMemberPayment() {
  const session = await requireWentianAuth();
  if (!session?.user) return;
  const product = wentianMemberState.product || {};
  wentianPaymentState.status = "loading";
  wentianPaymentState.message = `正在创建${getWentianPaymentProviderLabel()}订单...`;
  wentianPaymentState.error = "";
  wentianPaymentState.productName = product.name || WENTIAN_PAID_PRODUCT_NAME;
  wentianPaymentState.amountYuan = product.amountYuan || "19.90";
  navigate("screen-30");

  try {
    const chartRecordId = getWentianChartPayload().chartRecordId;
    const order = await wentianFetchJson("/api/payments/create-order", {
      method: "POST",
      body: { productKey: WENTIAN_MEMBER_PRODUCT_KEY, chartRecordId, provider: wentianPaymentState.provider },
    });
    const payMethod = getWentianPayMethod();
    const session = await wentianFetchJson("/api/payments/create-session", {
      method: "POST",
      body: { orderNo: order.orderNo, payMethod },
    });
    wentianPaymentState.status = "pending";
    wentianPaymentState.orderNo = order.orderNo;
    wentianPaymentState.payUrl = session.payUrl || "";
    wentianPaymentState.payMethod = session.payMethod || payMethod;
    wentianPaymentState.provider = session.provider || order.provider || wentianPaymentState.provider;
    wentianPaymentState.mockMode = !!(order.mockMode || session.mockMode);
    wentianPaymentState.productName = order.productName || product.name || WENTIAN_PAID_PRODUCT_NAME;
    wentianPaymentState.amountYuan = order.amountYuan || product.amountYuan || "19.90";
    wentianPaymentState.currency = order.currency || session.currency || product.currency || "CNY";
    wentianPaymentState.message = wentianPaymentState.mockMode
      ? "当前是支付测试模式"
      : (["h5", "redirect"].includes(wentianPaymentState.payMethod) ? `点击下方按钮打开${getWentianPaymentProviderLabel()}` : `请用另一台手机${getWentianPaymentProviderAppLabel()}扫码支付。`);
    startWentianPaymentPoll();
    refreshWentianPaymentScreen();
  } catch (error) {
    wentianPaymentState.status = "error";
    wentianPaymentState.error = error.message || "支付订单创建失败";
    wentianPaymentState.message = "支付服务暂时不可用";
    refreshWentianPaymentScreen();
  }
}

function getWentianPayPalReturnParams() {
  const params = new URLSearchParams(location.search || "");
  if (params.get("paypal_return") !== "1") return null;
  const orderNo = (params.get("orderNo") || "").trim();
  const paypalOrderId = (params.get("token") || "").trim();
  if (!orderNo || !paypalOrderId) return null;
  return { orderNo, paypalOrderId };
}

function clearWentianPayPalReturnParams() {
  const clean = `${location.pathname}#screen-30`;
  history.replaceState(null, "", clean);
}

async function captureWentianPayPalReturn(params = getWentianPayPalReturnParams()) {
  if (!params) return;
  wentianPaymentState.provider = "paypal";
  wentianPaymentState.orderNo = params.orderNo;
  wentianPaymentState.status = "loading";
  wentianPaymentState.message = "正在确认 PayPal 支付...";
  wentianPaymentState.error = "";
  navigate("screen-30", false);
  try {
    const data = await wentianFetchJson("/api/payments/paypal/capture-order", {
      method: "POST",
      body: { orderNo: params.orderNo, paypalOrderId: params.paypalOrderId },
    });
    wentianPaymentState.status = data.status || "paid";
    wentianPaymentState.message = "已开通付费版";
    clearWentianPayPalReturnParams();
    await hydrateWentianMemberStatus({ force: true });
  } catch (error) {
    wentianPaymentState.status = "error";
    wentianPaymentState.error = error.message || "PayPal 支付确认失败";
  }
  refreshWentianPaymentScreen();
}

function openWentianPaymentUrl() {
  if (wentianPaymentState.payUrl) window.location.href = wentianPaymentState.payUrl;
}

async function completeWentianMockPayment() {
  if (!wentianPaymentState.orderNo) return;
  wentianPaymentState.message = "正在确认测试支付...";
  refreshWentianPaymentScreen();
  try {
    const data = await wentianFetchJson("/api/payments/mock/complete", {
      method: "POST",
      body: { orderNo: wentianPaymentState.orderNo },
    });
    wentianPaymentState.status = data.status || "paid";
    wentianPaymentState.message = "已开通付费版";
    await hydrateWentianMemberStatus({ force: true });
  } catch (error) {
    wentianPaymentState.error = error.message || "测试支付失败";
  }
  refreshWentianPaymentScreen();
}

async function hydrateWentianOrders(options = {}) {
  const session = await getWentianAuthSession();
  if (!session?.user) {
    wentianOrderState.loaded = false;
    wentianOrderState.loading = false;
    wentianOrderState.orders = [];
    wentianOrderState.error = "";
    return null;
  }
  if (wentianOrderState.loading) return null;
  if (wentianOrderState.loaded && !options.force) return null;
  wentianOrderState.loading = true;
  wentianOrderState.error = "";
  if (options.rerender && state.route === "screen-48") navigate("screen-48", false);
  try {
    const data = await wentianFetchJson("/api/payments/refunds");
    wentianOrderState.orders = Array.isArray(data.orders) ? data.orders : [];
    wentianOrderState.loaded = true;
  } catch (error) {
    wentianOrderState.error = error.message || "订单读取失败";
  } finally {
    wentianOrderState.loading = false;
    if (options.rerender && state.route === "screen-48") navigate("screen-48", false);
  }
  return wentianOrderState.orders;
}

function formatWentianDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const cn = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return cn.toISOString().slice(0, 10);
}

function getWentianRefundContactDefault() {
  const user = wentianAuthSession?.user || {};
  return user.user_metadata?.phone || user.email || "";
}

function getWentianRefundSelectedOrder() {
  return (wentianOrderState.orders || []).find((order) => order.orderNo === wentianRefundTicketState.orderNo) || null;
}

function syncWentianRefundTicketFromOrder(order = getWentianRefundSelectedOrder()) {
  if (!order) return;
  wentianRefundTicketState.orderNo = order.orderNo || "";
  wentianRefundTicketState.paymentProvider = ["wechat", "alipay", "paypal"].includes(order.provider) ? order.provider : wentianRefundTicketState.paymentProvider;
  wentianRefundTicketState.paidDate = formatWentianDateInput(order.paidAt || order.createdAt) || wentianRefundTicketState.paidDate;
}

function ensureWentianRefundTicketModal() {
  let modal = document.getElementById("wentian-refund-ticket-modal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "wentian-refund-ticket-modal";
  modal.className = "wentian-refund-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="wentian-refund-sheet" role="dialog" aria-modal="true" aria-labelledby="wentian-refund-title">
      <button class="wentian-refund-close" type="button" data-wentian-refund-close aria-label="关闭">×</button>
      <div class="wentian-refund-kicker">售后工单</div>
      <div class="wentian-refund-title" id="wentian-refund-title">退款申请工单</div>
      <div class="wentian-refund-message" id="wentian-refund-message"></div>
      <label class="wentian-refund-field">
        <span>支付订单</span>
        <select id="wentian-refund-order"></select>
      </label>
      <div class="wentian-refund-grid">
        <label class="wentian-refund-field">
          <span>支付渠道</span>
          <select id="wentian-refund-provider">
            <option value="wechat">微信支付</option>
            <option value="alipay">支付宝</option>
            <option value="paypal">PayPal</option>
          </select>
        </label>
        <label class="wentian-refund-field">
          <span>支付日期</span>
          <input id="wentian-refund-paid-date" type="date">
        </label>
      </div>
      <label class="wentian-refund-field">
        <span>联系方式</span>
        <input id="wentian-refund-contact" type="text" placeholder="手机号或邮箱">
      </label>
      <label class="wentian-refund-field">
        <span>支付截图</span>
        <input id="wentian-refund-screenshot" type="file" accept="image/png,image/jpeg,image/webp">
        <small id="wentian-refund-file">请上传当时支付成功截图。</small>
      </label>
      <label class="wentian-refund-field">
        <span>补充说明</span>
        <textarea id="wentian-refund-note" rows="3" maxlength="500" placeholder="可填写退款原因或当时支付情况"></textarea>
      </label>
      <div class="wentian-refund-error" id="wentian-refund-error" hidden></div>
      <button class="wentian-refund-submit" id="wentian-refund-submit" type="button">提交工单</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-wentian-refund-close]")) closeWentianRefundTicket();
  });
  modal.querySelector("#wentian-refund-order")?.addEventListener("change", (event) => {
    wentianRefundTicketState.orderNo = event.target.value || "";
    syncWentianRefundTicketFromOrder();
    wentianRefundTicketState.error = "";
    renderWentianRefundTicketModal();
  });
  modal.querySelector("#wentian-refund-provider")?.addEventListener("change", (event) => {
    wentianRefundTicketState.paymentProvider = event.target.value || "wechat";
  });
  modal.querySelector("#wentian-refund-paid-date")?.addEventListener("input", (event) => {
    wentianRefundTicketState.paidDate = event.target.value || "";
  });
  modal.querySelector("#wentian-refund-contact")?.addEventListener("input", (event) => {
    wentianRefundTicketState.contact = event.target.value || "";
  });
  modal.querySelector("#wentian-refund-note")?.addEventListener("input", (event) => {
    wentianRefundTicketState.note = event.target.value || "";
  });
  modal.querySelector("#wentian-refund-screenshot")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0] || null;
    if (file) handleWentianRefundScreenshot(file);
  });
  modal.querySelector("#wentian-refund-submit")?.addEventListener("click", submitWentianRefundTicket);
  return modal;
}

function renderWentianRefundTicketModal() {
  const modal = ensureWentianRefundTicketModal();
  modal.hidden = !wentianRefundTicketState.open;
  document.body.classList.toggle("wentian-refund-open", wentianRefundTicketState.open);
  const orders = wentianOrderState.orders || [];
  const orderSelect = modal.querySelector("#wentian-refund-order");
  if (orderSelect) {
    orderSelect.innerHTML = orders.length
      ? orders.map((order) => {
        const disabled = order.canSubmitTicket ? "" : " disabled";
        const tag = order.ticketNo ? " · 工单处理中" : "";
        return `<option value="${escapeHtml(order.orderNo)}"${disabled}>${escapeHtml(order.productName || "会员订单")} · ¥${escapeHtml(order.amountYuan || "")}${tag}</option>`;
      }).join("")
      : '<option value="">暂无可提交工单的订单</option>';
    orderSelect.value = wentianRefundTicketState.orderNo || "";
  }
  const provider = modal.querySelector("#wentian-refund-provider");
  if (provider) provider.value = wentianRefundTicketState.paymentProvider || "wechat";
  const paidDate = modal.querySelector("#wentian-refund-paid-date");
  if (paidDate) paidDate.value = wentianRefundTicketState.paidDate || "";
  const contact = modal.querySelector("#wentian-refund-contact");
  if (contact) contact.value = wentianRefundTicketState.contact || "";
  const note = modal.querySelector("#wentian-refund-note");
  if (note) note.value = wentianRefundTicketState.note || "";
  const msg = modal.querySelector("#wentian-refund-message");
  if (msg) msg.textContent = wentianRefundTicketState.message;
  const file = modal.querySelector("#wentian-refund-file");
  if (file) file.textContent = wentianRefundTicketState.screenshotName ? `已选择：${wentianRefundTicketState.screenshotName}` : "请上传当时支付成功截图。";
  const error = modal.querySelector("#wentian-refund-error");
  if (error) {
    error.hidden = !wentianRefundTicketState.error;
    error.textContent = wentianRefundTicketState.error || "";
  }
  const submit = modal.querySelector("#wentian-refund-submit");
  if (submit) {
    const order = getWentianRefundSelectedOrder();
    submit.disabled = wentianRefundTicketState.loading || !order?.canSubmitTicket;
    submit.textContent = wentianRefundTicketState.loading ? "提交中..." : "提交工单";
  }
}

async function openWentianRefundTicket() {
  const session = await getWentianAuthSession();
  if (!session?.user) {
    wentianAuthState.mode = "login";
    navigate("screen-40");
    return;
  }
  wentianRefundTicketState.open = true;
  wentianRefundTicketState.error = "";
  wentianRefundTicketState.message = "退款需上传当时支付截图，后台审核后进入对应支付渠道处理，7个工作日内完成。";
  if (!wentianRefundTicketState.contact) wentianRefundTicketState.contact = getWentianRefundContactDefault();
  renderWentianRefundTicketModal();
  await hydrateWentianOrders({ force: true });
  const first = (wentianOrderState.orders || []).find((order) => order.canSubmitTicket) || wentianOrderState.orders[0] || null;
  if (!wentianRefundTicketState.orderNo && first) syncWentianRefundTicketFromOrder(first);
  if (!wentianOrderState.orders.length) wentianRefundTicketState.error = "当前账号暂无已支付订单。";
  renderWentianRefundTicketModal();
}

function closeWentianRefundTicket() {
  wentianRefundTicketState.open = false;
  wentianRefundTicketState.error = "";
  renderWentianRefundTicketModal();
}

function readWentianImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("截图读取失败"));
    reader.readAsDataURL(file);
  });
}

async function compressWentianRefundScreenshot(file) {
  if (!file || !/^image\/(png|jpeg|jpg|webp)$/i.test(file.type || "")) throw new Error("请上传 PNG/JPG/WebP 支付截图");
  const rawUrl = await readWentianImageAsDataUrl(file);
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("截图无法识别"));
    img.src = rawUrl;
  });
  const maxSide = 1280;
  const scale = Math.min(1, maxSide / Math.max(image.width || maxSide, image.height || maxSide));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round((image.width || maxSide) * scale));
  canvas.height = Math.max(1, Math.round((image.height || maxSide) * scale));
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", .78);
  if (dataUrl.length > 2.8 * 1024 * 1024) throw new Error("截图仍然过大，请裁剪后再上传");
  return dataUrl;
}

async function handleWentianRefundScreenshot(file) {
  wentianRefundTicketState.loading = true;
  wentianRefundTicketState.error = "";
  wentianRefundTicketState.screenshotName = file?.name || "";
  renderWentianRefundTicketModal();
  try {
    wentianRefundTicketState.screenshotDataUrl = await compressWentianRefundScreenshot(file);
  } catch (error) {
    wentianRefundTicketState.screenshotDataUrl = "";
    wentianRefundTicketState.screenshotName = "";
    wentianRefundTicketState.error = error.message || "截图处理失败";
  } finally {
    wentianRefundTicketState.loading = false;
    renderWentianRefundTicketModal();
  }
}

async function submitWentianRefundTicket() {
  if (wentianRefundTicketState.loading) return;
  const order = getWentianRefundSelectedOrder();
  if (!order?.canSubmitTicket) {
    wentianRefundTicketState.error = order?.ticketBlockedReason || "当前订单不能提交工单";
    renderWentianRefundTicketModal();
    return;
  }
  if (!wentianRefundTicketState.screenshotDataUrl) {
    wentianRefundTicketState.error = "请先上传当时支付截图";
    renderWentianRefundTicketModal();
    return;
  }
  wentianRefundTicketState.loading = true;
  wentianRefundTicketState.error = "";
  renderWentianRefundTicketModal();
  try {
    const data = await wentianFetchJson("/api/payments/refunds", {
      method: "POST",
      body: {
        orderNo: wentianRefundTicketState.orderNo,
        paymentProvider: wentianRefundTicketState.paymentProvider,
        paidDate: wentianRefundTicketState.paidDate,
        contact: wentianRefundTicketState.contact,
        note: wentianRefundTicketState.note,
        screenshotName: wentianRefundTicketState.screenshotName,
        screenshotDataUrl: wentianRefundTicketState.screenshotDataUrl,
      },
    });
    wentianRefundTicketState.message = data.message || "工单已提交，7个工作日内处理完成。";
    wentianRefundTicketState.screenshotDataUrl = "";
    wentianRefundTicketState.screenshotName = "";
    const input = document.getElementById("wentian-refund-screenshot");
    if (input) input.value = "";
    await hydrateWentianOrders({ force: true });
  } catch (error) {
    wentianRefundTicketState.error = error.message || "工单提交失败";
  } finally {
    wentianRefundTicketState.loading = false;
    renderWentianRefundTicketModal();
  }
}

function initWentianPaymentScreen() {
  const holder = document.getElementById("wentian-pay-qr");
  const url = holder?.dataset.payUrl;
  if (!holder || !url) return;
  holder.innerHTML = "";
  if (typeof QRCode === "function") {
    new QRCode(holder, {
      text: url,
      width: 172,
      height: 172,
      correctLevel: QRCode.CorrectLevel ? QRCode.CorrectLevel.M : undefined,
    });
  } else {
    holder.textContent = "二维码生成失败，请刷新重试";
  }
}

function setWentianChartStatus(text, tone = "") {
  const el = document.getElementById("wentian-chart-status");
  if (!el) return;
  el.textContent = text;
  el.dataset.tone = tone;
}

function getWentianChartFormData() {
  const parts = document.getElementById("wentian-chart-year")
    ? getWentianChartDateParts()
    : null;
  const rawDate = document.getElementById("wentian-chart-date")?.value || "";
  const date = parts?.date || (rawDate ? new Date(rawDate) : null);
  if (!date || Number.isNaN(date.getTime())) throw new Error("请先选择出生日期和时间");

  const useTrueSolar = !!document.getElementById("wentian-chart-true-solar")?.checked;
  const cityInput = (document.getElementById("wentian-chart-city")?.value || "").trim();
  const cityDetail = wentianChartCity || findWentianCity(cityInput);
  const city = cityDetail ? formatWentianCity(cityDetail) : cityInput;
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
      longitude: cityDetail?.lon || 116.4,
      tzOffset: cityDetail?.tzOffset ?? 8,
      cityName: city || "北京（默认）",
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
    dateStr: `${date.getFullYear()}-${padWentianNumber(date.getMonth() + 1)}-${padWentianNumber(date.getDate())}`,
    timeIndex: getWentianTimeIndex(calcHour, calcMinute),
    trueSolarResult,
    useTrueSolar,
    cityDetail,
    calMode: parts?.mode || "solar",
    calModeLabel: parts?.calModeLabel,
    autoLeapMonth: parts?.autoLeapMonth !== false,
    leapMonthRule: parts?.leapMonthRule || { enabled: true, applied: false },
  };
}

async function submitWentianChartForm() {
  try {
    setWentianChartStatus("正在调用网站排盘算法...");
    const norm = getWentianChartFormData();
    const lib = getWentianIztroLib();
    if (!lib) throw new Error("排盘模块未加载，请刷新后重试");

    const genderText = norm.gender === "male" ? "男" : "女";
    const chart = createWentianChartWithLeapRule(lib, norm, genderText);
    const datetimeValue = document.getElementById("wentian-chart-date")?.value || "";
    const duplicateArchive = findWentianArchiveDuplicate(getWentianArchiveList(), {
      form: { name: norm.name || "命主", datetime: datetimeValue },
    });
    const chartRecordId = duplicateArchive?.chartRecordId || duplicateArchive?.chartData?.chartRecordId || resetWentianChartRecordId();
    if (duplicateArchive) setWentianChartRecordId(chartRecordId);
    const chartData = buildWentianChartPayload(chart, norm);
    chartData.chartRecordId = chartRecordId;
    resetWentianChartAiState(chartData.chartRecordId);
    const archiveId = duplicateArchive?.id || `archive-${chartData.chartRecordId}`;

    saveWentianChart({
      archiveId,
      chart,
      chartData,
      form: {
        archiveId,
        name: norm.name,
        gender: norm.gender,
        type: norm.type,
        city: norm.city,
        cityDetail: norm.cityDetail,
        calMode: norm.calMode,
        autoLeapMonth: norm.autoLeapMonth,
        leapMonthRule: norm.leapMonthRule,
        datetime: datetimeValue,
        useTrueSolar: norm.useTrueSolar,
        trueSolarChoiceSet: true,
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
  const defaultDate = new Date(form.datetime || "2026-05-12T15:21");
  const date = Number.isNaN(defaultDate.getTime()) ? new Date("2026-05-12T15:21") : defaultDate;
  const name = document.getElementById("wentian-chart-name");
  if (name) name.value = form.name || "谢";
  populateWentianChartSelects();
  const hiddenDate = document.getElementById("wentian-chart-date");
  if (hiddenDate) hiddenDate.value = `${date.getFullYear()}-${padWentianNumber(date.getMonth() + 1)}-${padWentianNumber(date.getDate())}T${padWentianNumber(date.getHours())}:${padWentianNumber(date.getMinutes())}`;
  const year = document.getElementById("wentian-chart-year");
  const month = document.getElementById("wentian-chart-month");
  const day = document.getElementById("wentian-chart-day");
  const hour = document.getElementById("wentian-chart-hour");
  const minute = document.getElementById("wentian-chart-minute");
  if (year) year.value = String(date.getFullYear());
  if (month) month.value = String(date.getMonth() + 1);
  updateWentianChartDayOptions(day, date.getFullYear(), date.getMonth() + 1);
  if (day) day.value = String(date.getDate());
  if (hour) hour.value = String(date.getHours());
  if (minute) minute.value = String(date.getMinutes());
  const lunarYear = document.getElementById("wentian-chart-lunar-year");
  const lunarMonth = document.getElementById("wentian-chart-lunar-month");
  const lunarDay = document.getElementById("wentian-chart-lunar-day");
  if (lunarYear) lunarYear.value = String(date.getFullYear());
  if (lunarMonth) lunarMonth.value = "1";
  updateWentianChartDayOptions(lunarDay, 0, 0, getWentianLunarMonthMax(lunarYear?.value, lunarMonth?.value, false));
  if (lunarDay) lunarDay.value = "1";
  const leapAuto = document.getElementById("wentian-chart-lunar-leap");
  if (leapAuto) leapAuto.checked = form.autoLeapMonth !== false;
  setWentianChartButtonValue("gender", getWentianChartDefaultGender(form));
  setWentianChartButtonValue("type", form.type || "ziwei");
  setWentianChartCalendarMode(form.calMode || "solar");
  const trueSolar = document.getElementById("wentian-chart-true-solar");
  if (trueSolar) trueSolar.checked = getWentianChartDefaultTrueSolar(form);
  applyWentianChartCity(form.cityDetail || findWentianCity(form.city) || null);
  if (!wentianChartCity && form.city) {
    const cityInput = document.getElementById("wentian-chart-city");
    if (cityInput) cityInput.value = form.city;
  }
  updateWentianChartPreview();
  setWentianChartStatus(saved?.chart ? "已接入网站排盘算法，可重新排盘" : "已接入网站排盘算法");
}

function getWentianArchiveInitial(name) {
  const first = String(name || "").trim().charAt(0).toUpperCase();
  if (/^[A-Z]$/.test(first)) return first;
  return ({
    "陈": "C", "程": "C", "付": "F", "傅": "F", "黄": "H", "胡": "H", "何": "H", "谢": "X",
    "肖": "X", "许": "X", "李": "L", "林": "L", "刘": "L", "王": "W", "张": "Z", "赵": "Z",
    "周": "Z", "朱": "Z", "杨": "Y", "吴": "W", "徐": "X", "孙": "S", "马": "M"
  })[first] || "#";
}

function getWentianProfileSearchText(archive) {
  const item = getWentianArchiveDisplay(archive);
  return [
    item.name,
    item.gender,
    item.datetime,
    item.pillars,
    getWentianArchiveInitial(item.name)
  ].join(" ").toLowerCase();
}

function getWentianProfileVisibleArchives(archives, query = "") {
  const keyword = String(query || "").trim().toLowerCase();
  const list = keyword
    ? archives.filter((archive) => getWentianProfileSearchText(archive).includes(keyword))
    : archives;
  return list.slice(0, 6);
}

function renderWentianProfileRows(archives = getWentianArchiveList(), query = wentianProfileSearchQuery) {
  const visibleArchives = getWentianProfileVisibleArchives(archives, query);
  let y = 296;
  let lastInitial = "";
  if (!visibleArchives.length) {
    return `
      ${figText("source-25-empty-title", "暂无匹配档案", 0, 330, 390, 18, "#6e6254", 900, "center")}
      ${figText("source-25-empty-sub", "换个姓名再试试", 0, 362, 390, 13, "#a79b8e", 700, "center")}
    `;
  }
  return visibleArchives.map((archive, index) => {
    const item = getWentianArchiveDisplay(archive);
    const initial = getWentianArchiveInitial(item.name);
    const group = initial !== lastInitial ? figText(`source-25-group-${index}`, initial, 18, y + 6, 24, 14, "#aaa198", 600) : "";
    if (initial !== lastInitial) {
      lastInitial = initial;
      y += 30;
    }
    const rowY = y;
    y += 78;
    return `
      ${group}
      ${figBox(`source-25-row-line-${index}`, 88, rowY + 76, 258, 1, "", "background:#eee5d8;")}
      ${figBox(`source-25-avatar-${index}`, 18, rowY + 8, 54, 54, "", "border-radius:27px;background:linear-gradient(180deg,#d9ab73,#c88f56);box-shadow:0 5px 12px rgba(151,102,45,.14);")}
      ${figText(`source-25-avatar-text-${index}`, item.name.slice(0, 1) || "命", 18, rowY + 23, 54, 18, "#fffaf3", 900, "center")}
      ${figText(`source-25-name-${index}`, escapeHtml(item.name), 90, rowY + 7, 112, 17, "#201813", 900)}
      ${figText(`source-25-gender-text-${index}`, item.gender, 204, rowY + 10, 28, 13, "#9c938a", 700)}
      ${figText(`source-25-date-${index}`, `阳历:${escapeHtml(item.datetime.split(" ")[0] || item.datetime)}`, 90, rowY + 34, 174, 13, "#8f8780", 700)}
      ${figText(`source-25-detail-${index}`, escapeHtml(item.pillars), 90, rowY + 56, 208, 12, "#b08a4b", 600)}
      ${figText(`source-25-arrow-${index}`, "›", 330, rowY + 27, 20, 20, "#b4aaa0", 600, "center")}
      ${figButton(`source-25-open-${index}`, 0, rowY, 352, 76, `data-action="wentian-profile-open" data-archive-id="${escapeHtml(archive.id)}"`)}
    `;
  }).join("");
}

function sourceProfileScreen(screen) {
  const rows = renderWentianProfileRows(getWentianArchiveList(), wentianProfileSearchQuery);
  return `
    ${figBox("source-25-bg", 0, 0, 390, 867, "", "background:linear-gradient(180deg,#fbf6eb 0%,#fffdf8 36%,#fffdf8 100%);")}
    ${figText("source-25-time", "15:21", 18, 15, 70, 14, "#26211c")}
    ${figText("source-25-status", "◉  0.30  5G  ▮ 33 ⚡", 250, 14, 120, 10, "#26211c", 700, "right")}
    ${figText("source-25-back", "‹", 20, 56, 28, 30, "#201813", 700)}
    ${figText("source-25-title", "排盘记录", 0, 60, 390, 24, "#201813", 900, "center")}
    ${figText("source-25-menu", "☰", 334, 61, 34, 22, "#201813", 800, "center")}
    ${figBox("source-25-tabs", 110, 110, 170, 58, "", "border-radius:29px;background:rgba(255,255,255,.88);box-shadow:0 9px 20px rgba(107,75,42,.08);")}
    ${figBox("source-25-tab-active", 118, 118, 154, 42, "", "border-radius:23px;background:#604236;")}
    ${figText("source-25-tab-active-text", "· 个人案例 ·", 118, 130, 154, 16, "#fff", 900, "center")}
    ${figBox("source-25-search", 18, 188, 260, 48, "", "border-radius:24px;background:#fff;box-shadow:0 6px 14px rgba(90,62,34,.06);")}
    ${figText("source-25-search-icon", "⌕", 34, 197, 32, 25, "#201813", 700, "center")}
    <input id="wentian-profile-search" class="wentian-archive-search-input" style="left:72px;top:188px;width:188px;height:48px" value="${escapeHtml(wentianProfileSearchQuery)}" placeholder="请输入姓名" autocomplete="off" inputmode="search">
    ${figBox("source-25-filter", 294, 188, 78, 48, "", "border-radius:24px;background:#604236;box-shadow:0 8px 16px rgba(86,54,37,.16);")}
    ${figText("source-25-filter-text", "筛选", 294, 202, 78, 17, "#fffaf3", 900, "center")}
    ${figButton("source-25-filter-hit", 294, 188, 78, 48, 'data-action="wentian-profile-search-focus" aria-label="筛选档案"')}
    ${figText("source-25-all", "全部", 18, 262, 60, 18, "#bf8732", 900)}
    ${figBox("source-25-add-mini", 338, 252, 28, 28, "", "border:1px solid #dad1c6;border-radius:14px;background:#fffdf9;")}
    ${figText("source-25-add-plus", "+", 338, 257, 28, 14, "#201813", 800, "center")}
    ${figButton("source-25-add-hit", 330, 248, 44, 44, 'data-route="screen-26" aria-label="添加档案"')}
    <div id="wentian-profile-list" class="wentian-profile-list-layer">${rows}</div>
    ${figBox("source-25-index", 354, 496, 26, 224, "", "border-radius:14px;background:rgba(255,255,255,.9);box-shadow:0 7px 18px rgba(73,55,34,.14);")}
    ${figText("source-25-index-text", "A\nC\nF\nH\nJ\nL\nM\nS\nX\nZ\n#", 354, 509, 26, 10, "#6f6860", 700, "center", "line-height:1.62;")}
    ${sourceAppBottomNav("档案", 778)}
  `;
}

function sourceMembershipScreen() {
  const member = getWentianMemberSnapshot();
  const buttonText = member.isMember ? `续费付费版 ¥${member.amountYuan}` : `开通付费版 ¥${member.amountYuan}`;
  const providers = getWentianPaymentProviders();
  const methodButtons = providers.map((item, index) => {
    const compact = providers.length > 2;
    const width = compact ? 100 : 146;
    const x = compact ? 42 + index * 111 : (index === 0 ? 42 : 202);
    const active = wentianPaymentState.provider === item.provider;
    const disabled = !item.enabled;
    const bg = active ? "#fff3d9" : "#fffdf8";
    const border = active ? "#c8a65f" : "#eadfce";
    const text = disabled ? `${item.label}配置中` : item.label;
    return `
      ${figBox(`wt33-pay-method-${item.provider}`, x, 660, width, 42, "", `border:1px solid ${border};border-radius:21px;background:${bg};`)}
      ${figButton(`wt33-pay-method-hit-${item.provider}`, x, 660, width, 42, disabled ? "" : `data-action="wentian-pay-provider" data-provider="${item.provider}"`)}
      ${figText(`wt33-pay-method-text-${item.provider}`, text, x, 673, width, compact ? 11 : 12, disabled ? "#b4aaa0" : (active ? "#8f3d30" : "#756d63"), 900, "center")}
    `;
  }).join("");
  return `
    ${figBox("wt33-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${wentianSimpleHeader("wt33", "阅天套餐")}
    ${figBox("wt33-card", 24, 108, 342, 116, "", "border-radius:18px;background:linear-gradient(135deg,#2b2722,#14110d);box-shadow:0 16px 30px rgba(28,20,12,.16);")}
    ${figText("wt33-card-label", "付费版", 52, 136, 130, 20, "#fff", 900)}
    ${figText("wt33-card-sub", member.isMember ? escapeHtml(member.subtitle) : "100次/天，按日刷新", 52, 168, 190, 13, "#cfc1a9", 700)}
    ${figText("wt33-card-price", `¥${member.amountYuan}`, 238, 132, 84, 26, "#f4d293", 900, "right")}
    ${figText("wt33-card-period", "按日刷新", 246, 170, 78, 12, "#cfc1a9", 700, "right")}

    ${figText("wt33-plan-title", "对话额度", 24, 254, 120, 17, "#25211d", 900)}
    ${figBox("wt33-free", 24, 292, 342, 72, "", "border:1px solid #eadfce;border-radius:14px;background:#fff;box-shadow:0 6px 16px rgba(70,45,25,.06);")}
    ${figText("wt33-free-title", "免费用户", 44, 314, 90, 15, "#25211d", 900)}
    ${figText("wt33-free-quota", "30次/天", 174, 314, 160, 14, "#8d8377", 800, "right")}
    ${figBox("wt33-member", 24, 378, 342, 92, "", "border:1px solid #c8a65f;border-radius:16px;background:#fffaf0;box-shadow:0 10px 24px rgba(130,91,31,.10);")}
    ${figText("wt33-member-title", "付费用户", 44, 402, 100, 16, "#8f3d30", 900)}
    ${figText("wt33-member-quota", "100次/天", 174, 402, 160, 15, "#8f3d30", 900, "right")}
    ${figText("wt33-member-desc", "每日额度自动刷新。", 44, 436, 282, 13, "#756d63", 700)}

    ${figBox("wt33-benefit", 24, 508, 342, 116, "", "border-radius:16px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.07);")}
    ${figText("wt33-benefit-title", "当前额度", 44, 530, 120, 15, "#25211d", 900)}
    ${figText("wt33-benefit-list", `今日剩余 ${member.daily}<br>每日额度 ${member.dailyLimit}`, 44, 562, 260, 15, "#756d63", 800, "left", "line-height:1.8;")}
    ${figText("wt33-pay-method-title", "支付方式", 42, 636, 120, 13, "#756d63", 800)}
    ${methodButtons}
    ${figBox("wt33-submit", 42, 736, 306, 50, "", "border-radius:25px;background:linear-gradient(180deg,#b74e39,#983323);box-shadow:0 14px 28px rgba(158,61,43,.20);")}
    ${figButton("wt33-submit-hit", 42, 736, 306, 50, 'data-action="wentian-member-pay"')}
    ${figText("wt33-submit-text", buttonText, 42, 751, 306, 14, "#fffaf3", 900, "center")}
  `;
}

function sourcePaymentScreen() {
  const stateText = wentianPaymentState.status === "paid"
    ? "支付成功"
    : wentianPaymentState.status === "error"
      ? "支付异常"
      : wentianPaymentState.status === "loading"
        ? "创建订单"
        : "确认订单";
  const payUrl = wentianPaymentState.payUrl || "";
  const showQr = payUrl && !["h5", "redirect"].includes(wentianPaymentState.payMethod) && !wentianPaymentState.mockMode;
  const showOpen = payUrl && ["h5", "redirect"].includes(wentianPaymentState.payMethod) && !wentianPaymentState.mockMode;
  const message = wentianPaymentState.error || wentianPaymentState.message || "付费版 100次/天，按日刷新";
  const orderCardHeight = showQr ? 376 : 190;
  const amountText = formatWentianPaymentAmount(wentianPaymentState.amountYuan || "19.90", wentianPaymentState.currency || "CNY");
  return `
    ${figBox("wt30-bg", 0, 0, 390, 844, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 58%,#f3eadc 100%);")}
    ${figButton("wt30-back-hit", 18, 38, 58, 50, 'data-action="back"')}
    ${figText("wt30-back", "‹", 26, 46, 28, 28, "#2b251f", 600, "center")}
    ${figText("wt30-page-title", "套餐支付", 0, 52, 390, 22, "#201812", 900, "center")}
    ${figBox("wt30-status-pill", 286, 48, 74, 30, "", "border-radius:15px;background:#f4ead8;border:1px solid #eadbc2;")}
    ${figText("wt30-status-text", stateText, 286, 56, 74, 12, "#9a6f22", 800, "center")}

    ${figBox("wt30-hero", 24, 108, 342, 128, "", "border-radius:20px;background:linear-gradient(135deg,#b54c3a 0%,#8e3429 100%);box-shadow:0 16px 34px rgba(131,56,39,.18);")}
    ${figText("wt30-hero-label", WENTIAN_PAID_PRODUCT_NAME, 46, 132, 150, 13, "#f7e6cf", 700)}
    ${figText("wt30-hero-title", "100次/天", 46, 164, 180, 24, "#fffaf3", 900)}
    ${figText("wt30-hero-sub", "按日刷新，不设月额度", 46, 202, 230, 13, "#f2d8bd", 700)}
    ${figText("wt30-hero-price", amountText, 238, 154, 104, 26, "#fffaf3", 900, "right")}

    ${figBox("wt30-order-card", 24, 270, 342, orderCardHeight, "", "border:1px solid #eadfce;border-radius:18px;background:#fffdf8;box-shadow:0 10px 24px rgba(70,45,25,.08);")}
    ${figText("wt30-order-product-label", "商品", 44, 302, 80, 13, "#8d8377", 600)}
    ${figText("wt30-order-product", escapeHtml(wentianPaymentState.productName || WENTIAN_PAID_PRODUCT_NAME), 164, 302, 160, 13, "#2b251f", 800, "right")}
    ${figLine("wt30-order-line-1", 44, 334, 302, "#efe4d3")}
    ${figText("wt30-order-no-label", "订单号", 44, 358, 80, 13, "#8d8377", 600)}
    ${figText("wt30-order-no", escapeHtml(wentianPaymentState.orderNo || "待创建"), 132, 358, 190, 13, "#2b251f", 800, "right")}
    ${figLine("wt30-order-line-2", 44, 390, 302, "#efe4d3")}
    ${figText("wt30-order-tip", escapeHtml(message), 44, 416, 282, 14, wentianPaymentState.error ? "#a64032" : "#756d63", 700, "left", "line-height:1.5;")}
    ${showQr ? `<div id="wentian-pay-qr" class="wentian-pay-qr" data-pay-url="${escapeHtml(payUrl)}" style="left:109px;top:448px;width:172px;height:172px"></div>` : ""}
    ${showQr ? figText("wt30-qr-tip", `请用另一台手机打开${getWentianPaymentProviderAppLabel()}扫一扫；同一台手机截图识别通常无法支付。`, 46, 626, 298, 12, "#8d8377", 700, "center", "line-height:1.45;") : ""}

    ${showOpen ? figBox("wt30-open", 42, 650, 306, 50, "", "border-radius:25px;background:#16783d;box-shadow:0 12px 24px rgba(22,120,61,.18);") : ""}
    ${showOpen ? figButton("wt30-open-hit", 42, 650, 306, 50, 'data-action="wentian-pay-open"') : ""}
    ${showOpen ? figText("wt30-open-text", `打开${getWentianPaymentProviderLabel()}`, 42, 665, 306, 14, "#fff", 900, "center") : ""}
    ${wentianPaymentState.mockMode ? figBox("wt30-mock", 42, 650, 306, 50, "", "border-radius:25px;background:#16783d;box-shadow:0 12px 24px rgba(22,120,61,.18);") : ""}
    ${wentianPaymentState.mockMode ? figButton("wt30-mock-hit", 42, 650, 306, 50, 'data-action="wentian-pay-mock-success"') : ""}
    ${wentianPaymentState.mockMode ? figText("wt30-mock-text", "模拟支付成功", 42, 665, 306, 14, "#fff", 900, "center") : ""}
    ${figBox("wt30-pay", 42, 736, 306, 50, "", `border-radius:25px;background:${wentianPaymentState.status === "paid" ? "#7a9a4b" : "linear-gradient(180deg,#b74e39,#983323)"};box-shadow:0 14px 28px rgba(158,61,43,.18);`)}
    ${figButton("wt30-pay-hit", 42, 736, 306, 50, `data-action="${wentianPaymentState.status === "paid" ? "wentian-pay-done" : (wentianPaymentState.status === "idle" || wentianPaymentState.status === "error" ? "wentian-member-pay" : "wentian-payment-check")}"`)}
    ${figText("wt30-pay-text", wentianPaymentState.status === "paid" ? "已开通，返回我的" : (wentianPaymentState.status === "pending" ? "刷新支付状态" : `确认支付 ${amountText}`), 42, 751, 306, 14, "#fffaf3", 900, "center")}
    ${figText("wt30-safe", `${getWentianPaymentProviderLabel()}完成后付费额度自动刷新`, 0, 804, 390, 11, "#a49b91", 600, "center")}
  `;
}

function sourceOrderRecordsScreen() {
  const account = getWentianAuthDisplay();
  const orders = wentianOrderState.orders || [];
  const body = !account.loggedIn
    ? `
      ${figBox("wt48-empty", 24, 156, 342, 168, "", "border:1px solid #eadfce;border-radius:18px;background:#fffdf8;box-shadow:0 8px 20px rgba(70,45,25,.07);")}
      ${figText("wt48-empty-title", "登录后查看支付记录", 48, 194, 220, 18, "#201812", 900)}
      ${figText("wt48-empty-sub", "会员订单、支付状态和退款记录都会绑定到账号。", 48, 228, 270, 13, "#756d63", 700, "left", "line-height:1.5;")}
      ${figBox("wt48-login", 48, 270, 142, 38, "", "border-radius:19px;background:#b88c33;")}
      ${figText("wt48-login-text", "登录 / 注册", 48, 281, 142, 12, "#fff", 900, "center")}
      ${figButton("wt48-login-hit", 48, 270, 142, 38, 'data-action="wentian-login-open"')}
    `
    : wentianOrderState.loading
      ? `${figText("wt48-loading", "正在读取支付记录...", 0, 188, 390, 15, "#756d63", 700, "center")}`
      : wentianOrderState.error
        ? `
          ${figText("wt48-error", escapeHtml(wentianOrderState.error), 32, 178, 326, 14, "#a94437", 700, "center")}
          ${figBox("wt48-retry", 82, 226, 226, 44, "", "border-radius:22px;background:#fff;border:1px solid #e2d8c8;")}
          ${figText("wt48-retry-text", "重新加载", 82, 239, 226, 13, "#9b742e", 900, "center")}
          ${figButton("wt48-retry-hit", 82, 226, 226, 44, 'data-action="wentian-order-refresh"')}
        `
        : orders.length
          ? orders.map((order, index) => {
            const y = 138 + index * 92;
            const status = order.status === "paid" ? "已支付" : order.status === "refunded" ? "已退款" : order.status || "处理中";
            const paidAt = formatWentianMemberDate(order.paidAt || order.createdAt) || "未完成";
            return `
              ${figBox(`wt48-order-${index}`, 24, y, 342, 76, "", "border:1px solid #eadfce;border-radius:16px;background:#fffdf8;box-shadow:0 7px 16px rgba(70,45,25,.06);")}
              ${figText(`wt48-order-name-${index}`, escapeHtml(order.productName || WENTIAN_PAID_PRODUCT_NAME), 44, y + 16, 156, 15, "#201812", 900)}
              ${figText(`wt48-order-date-${index}`, escapeHtml(paidAt), 44, y + 44, 112, 12, "#8f857a", 700)}
              ${figText(`wt48-order-status-${index}`, escapeHtml(status), 192, y + 18, 62, 12, order.status === "paid" ? "#5f8745" : "#9b742e", 900, "right")}
              ${figText(`wt48-order-amount-${index}`, `¥${escapeHtml(order.amountYuan || "0.00")}`, 264, y + 18, 78, 17, "#9f3d2e", 900, "right")}
              ${figText(`wt48-order-no-${index}`, escapeHtml(order.orderNo || ""), 170, y + 46, 170, 10, "#b4ada5", 700, "right")}
            `;
          }).join("")
          : `
            ${figBox("wt48-empty", 24, 156, 342, 150, "", "border:1px solid #eadfce;border-radius:18px;background:#fffdf8;box-shadow:0 8px 20px rgba(70,45,25,.07);")}
            ${figText("wt48-empty-title", "暂无支付记录", 48, 194, 220, 18, "#201812", 900)}
            ${figText("wt48-empty-sub", "开通付费版后，订单会显示在这里。", 48, 228, 270, 13, "#756d63", 700)}
          `;
  return `
    ${figBox("wt48-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${wentianSimpleHeader("wt48", "支付记录", "刷新")}
    ${figButton("wt48-refresh-hit", 318, 38, 62, 54, 'data-action="wentian-order-refresh"')}
    ${figText("wt48-sub", account.loggedIn ? escapeHtml(account.email) : "未登录", 24, 96, 300, 13, "#8f857a", 700)}
    ${account.loggedIn ? figBox("wt48-ticket", 274, 92, 92, 30, "", "border:1px solid #eadfce;border-radius:15px;background:#fffdf8;") : ""}
    ${account.loggedIn ? figText("wt48-ticket-text", "退款工单", 274, 100, 92, 11, "#8f6a28", 900, "center") : ""}
    ${account.loggedIn ? figButton("wt48-ticket-hit", 274, 92, 92, 30, 'data-action="wentian-refund-ticket"') : ""}
    ${body}
  `;
}

function sourceMineScreen(screen) {
  const languageLabel = getWentianLanguageOption().label;
  const profile = getWentianProfile();
  const member = getWentianMemberSnapshot();
  const account = getWentianAuthDisplay();
  const statusText = member.isMember ? member.subtitle : (account.loggedIn ? "免费版 · 可升级付费版" : "未登录 · 可注册新账号");
  return `
    ${figText("source-31-time", "15:23", 18, 15, 70, 14, "#26211c")}
    ${figText("source-31-status", "◉  30.4  5G  ▮ 33 ⚡", 250, 14, 120, 10, "#26211c", 700, "right")}
    ${figText("source-31-title", "我的", 18, 58, 150, 30, "#26211c", 800)}
    ${figText("source-31-sub", "账户与偏好设置", 18, 101, 180, 14, "#8f857a")}
    ${figBox("source-31-gear", 338, 56, 38, 38, "", "border-radius:19px;background:#fff;box-shadow:0 5px 14px rgba(80,55,28,.10);")}
    ${figText("source-31-gear-text", "⚙", 338, 64, 38, 18, "#b88c33", 700, "center")}
    ${figButton("source-31-gear-hit", 336, 54, 42, 42, 'data-route="screen-38" aria-label="账户设置"', "", "z-index:36;")}
    ${figBox("source-31-profile", 16, 126, 358, 96, "converted-card", "border-radius:12px;box-shadow:0 6px 16px rgba(74,55,32,.08);")}
    ${figBox("source-31-avatar", 34, 144, 60, 60, "", "border-radius:30px;background:#b88c33;")}
    ${figText("source-31-avatar-icon", escapeHtml(account.initial), 34, 157, 60, 28, "#fff", 700, "center")}
    ${figText("source-31-name", escapeHtml(account.loggedIn ? account.name : "登录 / 注册"), 116, 150, 140, 18, "#26211c", 800)}
    ${figText("source-31-vip", escapeHtml(statusText), 116, 177, 170, 13, member.isMember ? "#7a9a4b" : "#8f857a")}
    ${figText("source-31-email", escapeHtml(account.loggedIn ? account.email : "登录 / 注册后可查看支付记录"), 116, 197, 200, 12, "#8f857a")}
    ${figBox("source-31-login-badge", 258, 148, 86, 24, "", `border-radius:12px;background:${member.isMember ? "#fff0d6" : "#f6f2e9"};`)}
    ${figText("source-31-login-badge-text", member.isMember ? "付费版" : (account.loggedIn ? "账号" : "登录/注册"), 258, 154, 86, 11, member.isMember ? "#9f3d2e" : "#9b742e", 800, "center")}
    ${figButton("source-31-login-hit", 16, 126, 358, 96, 'data-route="screen-40" aria-label="登录 / 注册"', "", "z-index:35;")}
    ${[["今日次数", member.daily, 16], ["每日额度", member.dailyLimit, 139], ["套餐状态", member.isMember ? "付费版" : "免费版", 262]].map(([label, count, x], index) => `
      ${figBox(`source-31-stat-${index}`, x, 240, 111, 75, "converted-card", "border-radius:12px;box-shadow:0 5px 14px rgba(74,55,32,.08);")}
      ${figText(`source-31-stat-label-${index}`, label, x + 14, 253, 80, 12, "#9b742e", 500)}
      ${figText(`source-31-stat-count-${index}`, count, x + 14, 279, 86, 20, "#b88c33", 800)}
    `).join("")}
    ${[["♛", "阅天套餐", 16, 330], ["▤", "我的报告", 200, 330], ["▦", "订单记录", 16, 400], ["♧", "邀请好友", 200, 400]].map(([icon, label, x, y], index) => `
      ${figBox(`source-31-quick-${index}`, x, y, 174, 60, "converted-card", "border-radius:12px;box-shadow:0 5px 14px rgba(74,55,32,.08);")}
      ${figBox(`source-31-quick-icon-${index}`, x + 17, y + 12, 36, 36, "", "border-radius:10px;background:#f6f2e9;")}
      ${figText(`source-31-quick-icon-text-${index}`, icon, x + 17, y + 21, 36, 14, "#b88c33", 800, "center")}
      ${figText(`source-31-quick-label-${index}`, label, x + 62, y + 21, 90, 16, "#26211c", 700)}
    `).join("")}
    ${[["语言设置", languageLabel, 491], ["分享阅天AI", "", 552], ["联系我们", "", 613]].map(([label, value, y], index) => `
      ${figBox(`source-31-row-${index}`, 16, y, 358, 61, "converted-card", "border-radius:12px;box-shadow:0 5px 14px rgba(74,55,32,.08);")}
      ${figText(`source-31-row-icon-${index}`, ["文", "⌯", "☏"][index], 34, y + 21, 24, 16, "#b88c33", 700, "center")}
      ${figText(`source-31-row-label-${index}`, label, 68, y + 20, 140, 16, "#26211c", 600)}
      ${value ? figText(`source-31-row-value-${index}`, value, 274, y + 21, 60, 13, "#9b742e", 500, "right") : ""}
      ${figText(`source-31-row-arrow-${index}`, "›", 342, y + 18, 16, 20, "#aaa196", 500, "center")}
    `).join("")}
    ${sourceAppBottomNav("我的", 755)}
  `;
}

function sourceBasicInfoScreen() {
  const profile = getWentianProfile();
  const account = getWentianAuthDisplay();
  return `
    ${figBox("source-39-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figButton("source-39-back-hit", 18, 40, 54, 54, 'data-action="back"')}
    ${figText("source-39-back", "‹", 28, 49, 28, 30, "#26211c", 700)}
    ${figText("source-39-title", "基本信息", 0, 56, 390, 22, "#1f1d1a", 900, "center")}
    ${figBox("source-39-account", 22, 112, 346, 98, "", "border:1px solid #e2d8c8;border-radius:18px;background:#fff;box-shadow:0 8px 18px rgba(74,55,32,.07);")}
    ${figBox("source-39-avatar", 42, 134, 54, 54, "", "border-radius:27px;background:#b88c33;")}
    ${figText("source-39-avatar-text", escapeHtml(account.initial), 42, 147, 54, 24, "#fff", 900, "center")}
    ${figText("source-39-account-name", escapeHtml(account.name), 114, 134, 182, 17, "#201812", 900)}
    ${figText("source-39-account-sub", account.loggedIn ? "先保存本机，再手动同步到账号" : "未登录，本页只保存本机资料", 114, 162, 210, 12, "#8f857a", 700, "left", "line-height:1.35;")}

    ${figBox("source-39-card", 22, 242, 346, 276, "", "border:1px solid #e2d8c8;border-radius:18px;background:#fff;box-shadow:0 6px 16px rgba(74,55,32,.06);")}
    ${figText("source-39-name-label", "昵称", 42, 274, 78, 16, "#5f5a52", 800)}
    <input id="wentian-profile-nickname" class="wentian-profile-input" style="left:132px;top:258px;width:214px" value="${escapeHtml(profile.nickname)}" placeholder="请输入昵称" autocomplete="name">
    ${figLine("source-39-line-1", 42, 323, 304, "#e6ded2")}
    ${figText("source-39-email-label", "邮箱", 42, 356, 78, 16, "#5f5a52", 800)}
    <input id="wentian-profile-email" class="wentian-profile-input" type="email" style="left:132px;top:340px;width:214px" value="${escapeHtml(profile.email)}" placeholder="请输入邮箱" autocomplete="email">
    ${figLine("source-39-line-2", 42, 405, 304, "#e6ded2")}
    ${figText("source-39-phone-label", "手机号", 42, 438, 78, 16, "#5f5a52", 800)}
    <input id="wentian-profile-phone" class="wentian-profile-input" inputmode="tel" style="left:132px;top:422px;width:214px" value="${escapeHtml(profile.phone)}" placeholder="绑定手机号" autocomplete="tel">

    ${figText("source-39-tip", account.loggedIn ? "保存只写本机；点同步到账号后，换设备登录才会带出资料。" : "未登录时只保存在当前浏览器；换设备、清缓存后不会自动带出。", 42, 548, 306, 13, "#9b9287", 700, "left", "line-height:1.45;")}
    <div id="wentian-profile-status" class="wentian-profile-status"></div>
    ${figBox("source-39-save", 36, account.loggedIn ? 660 : 696, 318, 52, "", "border-radius:26px;background:#c09a49;box-shadow:0 8px 18px rgba(130,91,31,.12);")}
    ${figButton("source-39-save-hit", 36, account.loggedIn ? 660 : 696, 318, 52, 'data-action="wentian-profile-save"')}
    ${figText("source-39-save-text", "保存到本机", 36, account.loggedIn ? 675 : 711, 318, 15, "#fff", 900, "center")}
    ${account.loggedIn ? `
      ${figBox("source-39-sync", 36, 728, 318, 52, "", "border-radius:26px;background:#25211d;box-shadow:0 8px 18px rgba(42,33,22,.12);")}
      ${figButton("source-39-sync-hit", 36, 728, 318, 52, 'data-action="wentian-profile-sync"')}
      ${figText("source-39-sync-text", "同步到账号", 36, 743, 318, 15, "#fffaf3", 900, "center")}
    ` : ""}
  `;
}

function sourceAccountSettingsScreen() {
  const account = getWentianAuthDisplay();
  const rows = [
    ["♙", "基本信息", account.loggedIn ? "昵称、邮箱、手机号" : "保存本机资料", "screen-39", ""],
    ["▧", "登录方式", account.loggedIn ? "查看当前账号与支付入口" : "手机号或 Google 登录", "screen-40", ""],
    ["⌑", "设置密码", account.loggedIn ? "修改账号登录密码" : "登录后可设置密码", "screen-41", ""],
    ["↪", account.loggedIn ? "退出登录" : "登录 / 注册", account.loggedIn ? "退出当前账号前会再次确认" : "进入账号登录页", account.loggedIn ? "" : "screen-40", account.loggedIn ? "wentian-auth-logout-open" : ""]
  ];
  return `
    ${figBox("source-settings-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figButton("source-settings-back-hit", 18, 40, 54, 54, 'data-action="back"')}
    ${figText("source-settings-back", "‹", 28, 49, 28, 30, "#26211c", 700)}
    ${figText("source-settings-title", "账户设置", 0, 56, 390, 22, "#1f1d1a", 900, "center")}
    ${figBox("source-settings-card", 22, 112, 346, 320, "", "border:1px solid #e2d8c8;border-radius:18px;background:#fff;box-shadow:0 8px 20px rgba(74,55,32,.07);")}
    ${rows.map(([icon, label, desc, route, action], index) => {
      const y = 112 + index * 80;
      const red = index === rows.length - 1;
      return `
        ${index ? figLine(`source-settings-line-${index}`, 44, y, 302, "#eee8df") : ""}
        ${figText(`source-settings-icon-${index}`, icon, 40, y + 29, 24, 14, red ? "#b33a2f" : "#b88c33", 900, "center")}
        ${figText(`source-settings-label-${index}`, label, 76, y + 20, 180, 17, red && account.loggedIn ? "#b33a2f" : "#26211c", 900)}
        ${figText(`source-settings-desc-${index}`, desc, 76, y + 48, 220, 12, "#8f857a", 700)}
        ${figText(`source-settings-arrow-${index}`, "›", 326, y + 30, 20, 18, "#aaa196", 900, "center")}
        ${figButton(`source-settings-hit-${index}`, 22, y, 346, 80, action ? `data-action="${action}"` : `data-route="${route}"`)}
      `;
    }).join("")}
    ${figBox("source-settings-note", 24, 466, 342, 94, "", "border-radius:16px;background:#fffaf2;border:1px solid #ead9bd;")}
    ${figText("source-settings-note-title", account.loggedIn ? "账号安全" : "先登录再同步", 46, 490, 120, 15, "#25211d", 900)}
    ${figText("source-settings-note-text", account.loggedIn ? "会员、支付记录、邀请奖励会跟随当前登录账号。退出前请确认资料已保存。" : "未登录时只保存本机资料；登录后才能同步会员、支付和邀请奖励。", 46, 520, 286, 13, "#756d63", 700, "left", "line-height:1.45;")}
    ${wentianLogoutConfirmOpen ? `
      ${figBox("source-settings-mask", 0, 0, 390, 844, "", "background:rgba(0,0,0,.28);")}
      ${figBox("source-settings-logout-sheet", 24, 548, 342, 210, "", "border-radius:22px;background:#fff;box-shadow:0 -10px 28px rgba(45,31,18,.16);")}
      ${figText("source-settings-logout-title", "确认退出登录？", 0, 580, 390, 18, "#25211d", 900, "center")}
      ${figText("source-settings-logout-desc", "退出后仍可浏览页面，但会员、支付记录和邀请奖励需要重新登录后查看。", 54, 622, 282, 13, "#756d63", 700, "center", "line-height:1.5;")}
      ${figBox("source-settings-logout-cancel", 48, 690, 132, 44, "", "border-radius:22px;background:#f6f2e9;")}
      ${figButton("source-settings-logout-cancel-hit", 48, 690, 132, 44, 'data-action="wentian-auth-logout-cancel"')}
      ${figText("source-settings-logout-cancel-text", "取消", 48, 704, 132, 13, "#756d63", 900, "center")}
      ${figBox("source-settings-logout-confirm", 210, 690, 132, 44, "", "border-radius:22px;background:#b74e39;")}
      ${figButton("source-settings-logout-confirm-hit", 210, 690, 132, 44, 'data-action="wentian-auth-logout"')}
      ${figText("source-settings-logout-confirm-text", "退出", 210, 704, 132, 13, "#fff", 900, "center")}
    ` : ""}
  `;
}

function sourceLoginMethodsScreen() {
  const account = getWentianAuthDisplay();
  const member = getWentianMemberSnapshot();
  const isRegister = wentianAuthState.mode === "register";
  const pendingInviteCode = getWentianPendingInviteCode();
  if (account.loggedIn) {
    const provider = wentianAuthSession?.user?.app_metadata?.provider || "phone";
    const phone = wentianAuthSession?.user?.user_metadata?.phone || "";
    return `
      ${figBox("source-login-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${figButton("source-login-back-hit", 18, 40, 54, 54, 'data-action="back"')}
      ${figText("source-login-back", "‹", 28, 49, 28, 30, "#26211c", 700)}
      ${figText("source-login-title", "登录方式", 0, 56, 390, 22, "#1f1d1a", 900, "center")}
      ${figBox("source-login-account", 24, 112, 342, 132, "", "border:1px solid #e2d8c8;border-radius:18px;background:#fff;box-shadow:0 8px 18px rgba(74,55,32,.08);")}
      ${figBox("source-login-avatar", 46, 144, 58, 58, "", "border-radius:29px;background:#b88c33;")}
      ${figText("source-login-avatar-text", escapeHtml(account.initial), 46, 158, 58, 24, "#fff", 900, "center")}
      ${figText("source-login-name", escapeHtml(account.name), 122, 144, 164, 18, "#201812", 900)}
      ${figText("source-login-email", escapeHtml(account.email), 122, 170, 180, 12, "#8f857a", 700)}
      ${figBox("source-login-member", 122, 198, 86, 24, "", `border-radius:12px;background:${member.isMember ? "#fff0d6" : "#f6f2e9"};`)}
      ${figText("source-login-member-text", member.isMember ? "付费版" : "免费账号", 122, 204, 86, 11, member.isMember ? "#9f3d2e" : "#9b742e", 800, "center")}

      ${figBox("source-login-method-card", 24, 274, 342, 196, "", "border-radius:18px;background:#fff;box-shadow:0 6px 16px rgba(74,55,32,.06);border:1px solid #eadfce;")}
      ${[["手机号密码", phone || "未绑定手机号", provider === "email" || phone ? "已启用" : "可用", "#5f8745"], ["Google 登录", provider === "google" ? "当前账号来源" : "可继续使用 Google 登录", provider === "google" ? "已启用" : "可用", "#9b742e"], ["账号密码", "用于邮箱或手机号登录和后续安全验证", "可修改", "#9b742e"]].map(([title, desc, badge, color], index) => {
        const y = 274 + index * 64;
        return `
          ${index ? figLine(`source-login-method-line-${index}`, 46, y, 298, "#eee8df") : ""}
          ${figText(`source-login-method-title-${index}`, title, 48, y + 18, 120, 15, "#25211d", 900)}
          ${figText(`source-login-method-desc-${index}`, escapeHtml(desc), 48, y + 40, 210, 11, "#8f857a", 700)}
          ${figBox(`source-login-method-badge-${index}`, 276, y + 22, 54, 22, "", `border-radius:11px;background:#f6f2e9;`)}
          ${figText(`source-login-method-badge-text-${index}`, badge, 276, y + 28, 54, 10, color, 900, "center")}
          ${index === 2 ? figText("source-login-method-arrow-2", "›", 336, y + 22, 12, 18, "#aaa196", 900, "center") : ""}
          ${index === 2 ? figButton("source-login-method-hit-2", 24, y, 342, 64, 'data-route="screen-41" aria-label="设置密码"') : ""}
        `;
      }).join("")}

      ${figBox("source-login-actions", 24, 502, 342, 134, "", "border-radius:18px;background:#fff;box-shadow:0 6px 16px rgba(74,55,32,.06);border:1px solid #eadfce;")}
      ${[["设置密码", "screen-41"], [member.isMember ? "续费付费版" : "开通付费版", "screen-33"], ["支付记录", "screen-48"]].map(([label, route], index) => {
        const y = 502 + index * 44;
        return `
          ${index ? figLine(`source-login-action-line-${index}`, 46, y, 298, "#eee8df") : ""}
          ${figText(`source-login-action-label-${index}`, label, 48, y + 14, 140, 14, "#25211d", 900)}
          ${figText(`source-login-action-arrow-${index}`, "›", 330, y + 12, 20, 18, "#aaa196", 900, "center")}
          ${figButton(`source-login-action-hit-${index}`, 24, y, 342, 44, `data-route="${route}"`)}
        `;
      }).join("")}

      ${figBox("source-login-logout", 42, 704, 306, 50, "", "border-radius:25px;background:#fff;border:1px solid #e2d8c8;")}
      ${figButton("source-login-logout-hit", 42, 704, 306, 50, 'data-action="wentian-auth-logout-open"')}
      ${figText("source-login-logout-text", "退出登录", 42, 719, 306, 14, "#9f3d2e", 900, "center")}
    `;
  }
  return `
    ${figBox("source-login-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figButton("source-login-back-hit", 18, 40, 54, 54, 'data-action="back"')}
    ${figText("source-login-back", "‹", 28, 49, 28, 30, "#26211c", 600)}
    ${figText("source-login-title", "登录 / 注册", 0, 56, 390, 22, "#1f1d1a", 800, "center")}
    ${figText("source-login-sub", "会员、支付记录会绑定到账号", 0, 92, 390, 13, "#8f857a", 700, "center")}
    ${figBox("source-login-card", 24, 128, 342, 390, "", "border:1px solid #e2d8c8;border-radius:18px;background:#fff;box-shadow:0 8px 20px rgba(74,55,32,.08);")}
    <button class="wentian-auth-tab ${!isRegister ? "is-active" : ""}" type="button" data-action="wentian-auth-mode" data-auth-mode="login" style="left:50px;top:154px;width:136px">登录</button>
    <button class="wentian-auth-tab ${isRegister ? "is-active" : ""}" type="button" data-action="wentian-auth-mode" data-auth-mode="register" style="left:204px;top:154px;width:136px">注册</button>
    ${figText("source-login-phone-label", isRegister ? "手机号" : "手机号 / 邮箱", 50, 224, 110, 14, "#6e6254", 800)}
    <input id="wentian-auth-phone" class="wentian-auth-input" inputmode="${isRegister ? "tel" : "email"}" autocomplete="${isRegister ? "tel" : "username"}" style="left:50px;top:248px;width:290px" placeholder="${isRegister ? "请输入手机号" : "请输入手机号或邮箱"}">
    ${figText("source-login-password-label", "密码", 50, 318, 88, 14, "#6e6254", 800)}
    <input id="wentian-auth-password" class="wentian-auth-input" type="password" autocomplete="${isRegister ? "new-password" : "current-password"}" style="left:50px;top:342px;width:290px" placeholder="至少 6 位">
    ${wentianAuthState.error ? figText("source-login-error", escapeHtml(wentianAuthState.error), 50, 404, 290, 13, "#a94437", 700, "center", "line-height:1.35;") : (pendingInviteCode ? figText("source-login-invite", `已记录邀请码 ${escapeHtml(pendingInviteCode)}，登录后自动绑定`, 50, 404, 290, 13, "#9b742e", 700, "center", "line-height:1.35;") : "")}
    ${figBox("source-login-submit", 50, 442, 290, 46, "", `border-radius:23px;background:${wentianAuthState.loading ? "#d8c7aa" : "linear-gradient(180deg,#b74e39,#983323)"};box-shadow:0 12px 24px rgba(158,61,43,.16);`)}
    ${figButton("source-login-submit-hit", 50, 442, 290, 46, 'data-action="wentian-auth-submit"')}
    ${figText("source-login-submit-text", wentianAuthState.loading ? "处理中..." : (isRegister ? "注册并登录" : "登录并继续"), 50, 456, 290, 14, "#fffaf3", 900, "center")}
    ${WENTIAN_GOOGLE_ENABLED ? `
      ${figBox("source-login-google", 50, 538, 290, 44, "", "border-radius:22px;background:#fff;border:1px solid #e2d8c8;")}
      ${figButton("source-login-google-hit", 50, 538, 290, 44, 'data-action="wentian-google-login"')}
      ${figText("source-login-google-text", "用 Google 登录", 50, 551, 290, 13, "#26211c", 800, "center")}
    ` : ""}
    ${figText("source-login-note", "手机号登录使用密码，不发验证码。", 0, 604, 390, 12, "#9b9287", 600, "center")}
  `;
}

function sourcePasswordSettingsScreen() {
  const account = getWentianAuthDisplay();
  if (!account.loggedIn) {
    return `
    ${figBox("source-password-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figButton("source-password-back-hit", 18, 40, 54, 54, 'data-action="back"')}
    ${figText("source-password-back", "‹", 28, 49, 28, 30, "#26211c", 700)}
    ${figText("source-password-title", "设置密码", 0, 56, 390, 22, "#1f1d1a", 900, "center")}
    ${figBox("source-password-login-card", 24, 136, 342, 178, "", "border-radius:18px;background:#fff;box-shadow:0 8px 18px rgba(74,55,32,.08);border:1px solid #eadfce;")}
    ${figText("source-password-login-title", "登录后设置账号密码", 48, 172, 190, 18, "#25211d", 900)}
    ${figText("source-password-login-desc", "密码会绑定到你的阅天账号，用于邮箱或手机号登录、支付记录和会员权益。", 48, 210, 280, 13, "#756d63", 700, "left", "line-height:1.45;")}
    ${figBox("source-password-login-btn", 48, 260, 150, 38, "", "border-radius:19px;background:#b74e39;")}
    ${figButton("source-password-login-hit", 48, 260, 150, 38, 'data-route="screen-40"')}
    ${figText("source-password-login-text", "登录 / 注册", 48, 272, 150, 12, "#fff", 900, "center")}
  `;
  }
  return `
    ${figBox("source-password-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${figButton("source-password-back-hit", 18, 40, 54, 54, 'data-action="back"')}
    ${figText("source-password-back", "‹", 28, 49, 28, 30, "#26211c", 700)}
    ${figText("source-password-title", "设置密码", 0, 56, 390, 22, "#1f1d1a", 900, "center")}
    ${figBox("source-password-account", 24, 112, 342, 88, "", "border-radius:18px;background:#fff;box-shadow:0 8px 18px rgba(74,55,32,.07);border:1px solid #eadfce;")}
    ${figText("source-password-account-title", escapeHtml(account.name), 46, 138, 200, 17, "#25211d", 900)}
    ${figText("source-password-account-sub", escapeHtml(account.email), 46, 166, 260, 12, "#8f857a", 700)}
    ${figBox("source-password-card", 22, 232, 346, 174, "", "border:1px solid #e2d8c8;border-radius:18px;background:#fff;box-shadow:0 6px 16px rgba(74,55,32,.06);")}
    ${figText("source-password-new-label", "新密码", 42, 262, 80, 16, "#5f5a52", 800)}
    <input id="wentian-password-new" class="wentian-profile-input" type="password" style="left:132px;top:246px;width:214px" placeholder="至少 6 位" autocomplete="new-password">
    ${figLine("source-password-line-1", 42, 326, 304, "#e6ded2")}
    ${figText("source-password-confirm-label", "确认密码", 42, 360, 80, 16, "#5f5a52", 800)}
    <input id="wentian-password-confirm" class="wentian-profile-input" type="password" style="left:132px;top:344px;width:214px" placeholder="再次输入" autocomplete="new-password">
    ${figBox("source-password-tip", 24, 438, 342, 86, "", "border-radius:16px;background:#fffaf2;border:1px solid #ead9bd;")}
    ${figText("source-password-tip-title", "安全提示", 46, 460, 90, 15, "#25211d", 900)}
    ${figText("source-password-tip-text", "密码仅用于账号登录。设置后可继续使用 Google、邮箱或手机号密码登录。", 46, 490, 286, 13, "#756d63", 700, "left", "line-height:1.45;")}
    <div id="wentian-password-status" class="wentian-profile-status" data-tone="${escapeHtml(wentianPasswordState.tone || "")}" style="top:650px">${escapeHtml(wentianPasswordState.status || "")}</div>
    ${figBox("source-password-save", 42, 704, 306, 50, "", `border-radius:25px;background:${wentianPasswordState.loading ? "#d8c7aa" : "#c09a49"};box-shadow:0 8px 18px rgba(130,91,31,.12);`)}
    ${figButton("source-password-save-hit", 42, 704, 306, 50, 'data-action="wentian-password-save"')}
    ${figText("source-password-save-text", wentianPasswordState.loading ? "保存中..." : "保存密码", 42, 719, 306, 14, "#fff", 900, "center")}
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
    ${figBox("source-37-sheet", 20, 462, 350, 252, "", "border-radius:20px;background:#fff;box-shadow:0 -8px 24px rgba(0,0,0,.14);")}
    ${figText("source-37-sheet-title", "语言设置", 42, 488, 200, 18, "#26211c", 800)}
    ${WENTIAN_LANGUAGE_OPTIONS.map((option, index) => {
      const selected = option.code === activeCode;
      return `
        <button class="wentian-language-option ${selected ? "is-selected" : ""}" type="button" data-action="wentian-language-pick" data-wentian-language-option="1" data-language-code="${option.code}" aria-pressed="${selected ? "true" : "false"}" style="left:42px;top:${532 + index * 42}px">
          <span class="wentian-language-label">${option.label}</span>
          <span class="wentian-language-check">${selected ? "✓" : ""}</span>
        </button>
      `;
    }).join("")}
    <button class="wentian-language-confirm" type="button" data-action="wentian-language-confirm">确定</button>
    ${figButton("source-37-back-top-hit", 18, 40, 54, 54, 'data-action="back" aria-label="返回我的"', "", "z-index:90;")}
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
    ${right ? figText(`${id}-right`, right, 318, 48, 52, 20, "#8d857b", 700, "center") : ""}
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

function getWentianHepanVisibleArchives(archives, selectedIds) {
  return archives.filter(Boolean);
}

function getWentianHepanHint(archives, selectedIds, validation) {
  if (selectedIds.length >= 2) return validation.message;
  if (archives.length < 2) return "至少需要两张档案才能合盘";
  return "请选择一男一女两张不同档案";
}

function refreshWentianHepanSelectionView(archives, selectedIds) {
  const list = document.querySelector(".wentian-hepan-list");
  const headCount = document.querySelector('[data-node-id="wt11-head"] b');
  const primary = document.querySelector(".wentian-hepan-primary");
  const hintNode = document.querySelector(".wentian-hepan-footer p");
  if (!list || !headCount || !primary || !hintNode) return false;
  const validation = getWentianHepanValidation(archives, selectedIds);
  const ready = validation.ok;
  const hint = getWentianHepanHint(archives, selectedIds, validation);
  headCount.textContent = `已选 ${selectedIds.length}/2`;
  headCount.classList.toggle("is-ready", ready);
  headCount.classList.toggle("is-error", !ready && selectedIds.length >= 2);
  primary.disabled = !ready;
  hintNode.textContent = hint;
  hintNode.classList.toggle("is-ready", ready);
  hintNode.classList.toggle("is-error", !ready && selectedIds.length >= 2);
  list.querySelectorAll(".wentian-hepan-option").forEach((option) => {
    const selected = selectedIds.includes(option.dataset.archiveId);
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-pressed", selected ? "true" : "false");
    const check = option.querySelector(".wentian-hepan-check");
    if (check) check.textContent = selected ? "✓" : "";
  });
  return true;
}

function sourceHepanTypeScreen() {
  return `
    ${figBox("wt10-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
    ${wentianSimpleHeader("wt10", "选择合盘类型")}
    ${figBox("wt10-card", 34, 108, 322, 584, "", "border-radius:18px;background:#fff;box-shadow:0 12px 30px rgba(69,45,24,.12);overflow:hidden;")}
    ${figText("wt10-title", "情侣合盘", 0, 136, 390, 25, "#25211d", 800, "center")}
    ${["真命盘合参", "情感契合度", "冲突化解建议"].map((text, index) => `
      ${figBox(`wt10-pill-${index}`, 122, 178 + index * 34, 146, 24, "", "border:1px solid #c8a65f;border-radius:12px;background:#fffaf0;")}
      ${figText(`wt10-pill-text-${index}`, text, 122, 184 + index * 34, 146, 11, "#7c5d22", 700, "center")}
    `).join("")}
    ${figImage("wt10-image", "../images/wentian-prototype-assets/hepan-master.jpg", 34, 320, 322, 278, "object-fit:cover;object-position:center 18%;")}
    ${figBox("wt10-start-row", 90, 564, 210, 28, "", "border-radius:14px;background:#fbf7ef;")}
    ${figButton("wt10-start-hit", 90, 564, 210, 28, 'data-route="screen-11"')}
    ${figText("wt10-start-text", "选择两张档案", 90, 571, 210, 12, "#25211d", 700, "center")}
    ${figBox("wt10-record-row", 90, 604, 210, 28, "", "border-radius:14px;background:#fbf7ef;")}
    ${figButton("wt10-record-hit", 90, 604, 210, 28, 'data-route="screen-49"')}
    ${figText("wt10-record-text", "查看合盘结果", 90, 611, 210, 12, "#25211d", 700, "center")}
    ${wentianGoldButton("wt10", "开始合盘", "screen-11", 686)}
  `;
}

function sourceHepanSelectScreen() {
  const archives = getWentianArchiveList();
  const selectedIds = getWentianHepanSelectedIds(archives);
  const visibleArchives = getWentianHepanVisibleArchives(archives, selectedIds);
  const validation = getWentianHepanValidation(archives, selectedIds);
  const ready = validation.ok;
  const hint = getWentianHepanHint(archives, selectedIds, validation);
  return `
    ${figBox("wt11-bg", 0, 0, 390, 844, "", "background:linear-gradient(180deg,#fff8ec 0%,#f4e5d2 42%,#fffdf9 100%);")}
    ${figBox("wt11-top-glow", 0, 0, 390, 238, "", "background:radial-gradient(circle at 50% 6%,rgba(212,171,88,.22),rgba(212,171,88,0) 46%),linear-gradient(180deg,#fff4df 0%,rgba(255,244,223,0) 100%);")}
    ${wentianSimpleHeader("wt11", "选择合盘档案")}
    ${figBox("wt11-summary", 24, 110, 342, 88, "", "border:1px solid #ead8bd;border-radius:20px;background:#fffdf8;box-shadow:0 14px 28px rgba(92,50,29,.08);")}
    ${figBox("wt11-summary-mark", 44, 132, 44, 44, "", "border-radius:22px;background:#fff0df;border:1px solid #ead2ad;")}
    ${figText("wt11-summary-mark-text", "合", 44, 143, 44, 17, "#a94437", 900, "center", "font-family:'Noto Serif SC','Songti SC',serif;")}
    ${figText("wt11-summary-title", "选两张档案", 104, 128, 132, 20, "#241811", 900, "left", "font-family:'Noto Serif SC','Songti SC',serif;")}
    ${figText("wt11-summary-copy", "用于关系合盘", 104, 158, 120, 13, "#8d806f", 700, "left")}
    ${figBox("wt11-count-pill", 276, 132, 64, 30, "", "border-radius:15px;background:#fff3df;border:1px solid #ead2ad;")}
    ${figText("wt11-count-text", "2人", 276, 140, 64, 12, "#9b742e", 900, "center")}
    ${figBox("wt11-sheet", 0, 220, 390, 624, "", "border-radius:28px 28px 0 0;background:#fffdfb;box-shadow:0 -12px 30px rgba(75,48,24,.14);")}
    ${figBox("wt11-handle", 164, 234, 62, 5, "", "border-radius:5px;background:#e2d4bf;")}
    <div class="wentian-hepan-head" data-node-id="wt11-head">
      <div>
        <strong>档案</strong>
        <span>点选两人</span>
      </div>
      <b class="${ready ? "is-ready" : selectedIds.length >= 2 ? "is-error" : ""}">已选 ${selectedIds.length}/2</b>
    </div>
    <div class="wentian-hepan-list" data-node-id="wt11-list">
      ${visibleArchives.map((archive, index) => {
        const item = getWentianArchiveDisplay(archive);
        const selected = selectedIds.includes(archive.id);
        return `
          <button class="wentian-hepan-option ${selected ? "is-selected" : ""}" type="button" data-action="wentian-hepan-pick" data-archive-id="${escapeHtml(archive.id)}" aria-pressed="${selected ? "true" : "false"}" aria-label="选择${escapeHtml(item.name)}">
            <span class="wentian-hepan-avatar">${escapeHtml(item.name.slice(0, 1))}</span>
            <span class="wentian-hepan-copy">
              <strong>${escapeHtml(item.name)}</strong>
              <em>${escapeHtml(item.gender)} · ${escapeHtml(item.tag)}</em>
              <small>${escapeHtml(item.datetime)}</small>
            </span>
            <span class="wentian-hepan-check">${selected ? "✓" : ""}</span>
          </button>
        `;
      }).join("")}
    </div>
    <div class="wentian-hepan-footer" data-node-id="wt11-footer">
      <button class="wentian-hepan-secondary" type="button" data-route="screen-26">+ 新建档案</button>
      <button class="wentian-hepan-primary" type="button" data-action="wentian-hepan-confirm" ${ready ? "" : "disabled"}>确定</button>
      <p class="${ready ? "is-ready" : selectedIds.length >= 2 ? "is-error" : ""}">${escapeHtml(hint)}</p>
    </div>
  `;
}

function sourceHepanResultScreen() {
  const result = getWentianHepanResult();
  if (!result.ok) return sourceHepanInvalidScreen(result);
  return `
    ${figBox("wt49-bg", 0, 0, 390, 1160, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 58%,#f3eadc 100%);")}
    ${wentianSimpleHeader("wt49", "合盘结果")}
    ${figBox("wt49-score-card", 24, 108, 342, 174, "", "border-radius:22px;background:linear-gradient(135deg,#2b2722,#14110d);box-shadow:0 16px 30px rgba(28,20,12,.16);")}
    ${figText("wt49-score", String(result.total), 44, 128, 96, 54, "#f4d293", 900, "center", "font-size:54px;line-height:1;")}
    ${figText("wt49-score-unit", "分", 132, 152, 26, 16, "#f4d293", 900)}
    ${figText("wt49-level", result.relationLabel || result.level, 178, 136, 130, 20, "#fffaf3", 900)}
    ${figText("wt49-sub", `${escapeHtml(result.level)} · 夫妻宫落点合参`, 178, 170, 140, 13, "#cfc1a9", 700, "left", "line-height:1.5;")}
    ${figText("wt49-pair", `${escapeHtml(result.leftDisplay.name)} × ${escapeHtml(result.rightDisplay.name)}`, 44, 226, 280, 18, "#fffaf3", 900, "center")}

    ${figBox("wt49-pair-card", 24, 306, 342, 116, "", "border:1px solid #eadfce;border-radius:18px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.07);")}
    ${figText("wt49-left-name", escapeHtml(result.leftDisplay.name), 44, 330, 88, 17, "#25211d", 900)}
    ${figText("wt49-left-date", escapeHtml(result.leftDisplay.datetime), 44, 360, 122, 12, "#8f8173", 700)}
    ${figText("wt49-left-pillars", escapeHtml(result.leftDisplay.pillars), 44, 386, 130, 11, "#9b742e", 700)}
    ${figText("wt49-right-name", escapeHtml(result.rightDisplay.name), 218, 330, 88, 17, "#25211d", 900, "right")}
    ${figText("wt49-right-date", escapeHtml(result.rightDisplay.datetime), 194, 360, 132, 12, "#8f8173", 700, "right")}
    ${figText("wt49-right-pillars", escapeHtml(result.rightDisplay.pillars), 190, 386, 136, 11, "#9b742e", 700, "right")}
    ${figText("wt49-heart", "格", 180, 352, 30, 20, "#b74e39", 900, "center")}

    ${figText("wt49-dim-title", "合盘维度", 24, 454, 120, 17, "#25211d", 900)}
    ${result.dimensions.map(([label, score, note], index) => {
      const y = 490 + index * 92;
      return `
        ${figBox(`wt49-dim-${index}`, 24, y, 342, 74, "", "border:1px solid #eadfce;border-radius:16px;background:#fffdf8;box-shadow:0 7px 18px rgba(70,45,25,.06);")}
        ${figText(`wt49-dim-label-${index}`, label, 44, y + 16, 110, 15, "#25211d", 900)}
        ${figText(`wt49-dim-score-${index}`, `${score}分`, 276, y + 15, 58, 15, score >= 76 ? "#8a6b22" : "#9f3d2e", 900, "right")}
        ${figBox(`wt49-dim-bar-${index}`, 44, y + 44, 240, 7, "", "border-radius:4px;background:#f0e6d8;")}
        ${figBox(`wt49-dim-fill-${index}`, 44, y + 44, Math.round(240 * score / 100), 7, "", "border-radius:4px;background:linear-gradient(90deg,#c79b42,#a13d2d);")}
        ${figText(`wt49-dim-note-${index}`, note, 44, y + 56, 282, 11, "#7a6d60", 700)}
      `;
    }).join("")}

    ${figBox("wt49-advice", 24, 882, 342, 96, "", "border-radius:18px;background:#fff1dc;border:1px solid #d6b463;box-shadow:0 8px 20px rgba(130,91,31,.08);")}
    ${figText("wt49-advice-title", "关系建议", 44, 906, 100, 15, "#8f3d30", 900)}
    ${figText("wt49-advice-text", result.advice, 44, 934, 284, 13, "#756d63", 800, "left", "line-height:1.55;")}
    ${figBox("wt49-repick", 42, 1000, 136, 44, "", "border:1px solid #d6b463;border-radius:10px;background:#fff;")}
    ${figButton("wt49-repick-hit", 42, 1000, 136, 44, 'data-route="screen-11"')}
    ${figText("wt49-repick-text", "重新选择", 42, 1012, 136, 13, "#9b742e", 800, "center")}
    ${figBox("wt49-ask", 212, 1000, 136, 44, "", "border-radius:10px;background:#b74e39;")}
    ${figButton("wt49-ask-hit", 212, 1000, 136, 44, 'data-action="wentian-hepan-ask-xu"')}
    ${figText("wt49-ask-text", "追问合盘半仙", 212, 1012, 136, 13, "#fff", 900, "center")}
  `;
}

function sourceHepanInvalidScreen(result) {
  const message = result?.message || "请选择两张不同档案";
  return `
    ${figBox("wt49-bg", 0, 0, 390, 844, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 58%,#f3eadc 100%);")}
    ${wentianSimpleHeader("wt49", "合盘结果")}
    ${figBox("wt49-invalid-card", 24, 132, 342, 318, "", "border:1px solid #eadfce;border-radius:22px;background:#fff;box-shadow:0 12px 28px rgba(70,45,25,.1);")}
    ${figBox("wt49-invalid-icon", 142, 174, 106, 106, "", "border-radius:53px;background:#fff1dc;border:1px solid #e2c27a;")}
    ${figText("wt49-invalid-icon-text", "合", 142, 204, 106, 38, "#a94437", 900, "center", "font-size:38px;")}
    ${figText("wt49-invalid-title", "暂不能合盘", 0, 304, 390, 24, "#25211d", 900, "center")}
    ${figText("wt49-invalid-copy", escapeHtml(message), 56, 346, 278, 15, "#756d63", 800, "center", "line-height:1.6;")}
    ${figText("wt49-invalid-rule", "规则：仅支持一男一女，未满18岁不合盘，年龄差超过15岁不合盘。", 56, 394, 278, 12, "#9a8f82", 700, "center", "line-height:1.55;")}
    ${figBox("wt49-repick", 42, 506, 136, 44, "", "border:1px solid #d6b463;border-radius:10px;background:#fff;")}
    ${figButton("wt49-repick-hit", 42, 506, 136, 44, 'data-route="screen-11"')}
    ${figText("wt49-repick-text", "重新选择", 42, 518, 136, 13, "#9b742e", 800, "center")}
    ${figBox("wt49-new", 212, 506, 136, 44, "", "border-radius:10px;background:#b74e39;")}
    ${figButton("wt49-new-hit", 212, 506, 136, 44, 'data-route="screen-26"')}
    ${figText("wt49-new-text", "新建档案", 212, 518, 136, 13, "#fffaf3", 900, "center")}
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

const LIUYAO_STORAGE_KEY = "wentian-liuyao-state-v1";
const LIUYAO_SAMPLE_QUESTION = "事业近期是否适合推进新计划？";
const LIUYAO_DEFAULT_QUESTION = "";
const LIUYAO_QUESTION_MAX_LENGTH = 120;
const LIUYAO_VALUES = [7, 8, 9, 6];
const LIUYAO_TOSS_ANIMATION_MS = 1000;
const LIUYAO_PULL_MAX = 132;
const LIUYAO_READY_POWER = 0.18;
const LIUYAO_SWIPE_THRESHOLD = Math.round(LIUYAO_PULL_MAX * LIUYAO_READY_POWER);
const LIUYAO_DEFAULT_POWER = 0.62;
const LIUYAO_TRIGRAM_BY_BITS = {
  "111": { gua: "乾", name: "天", key: "qian" },
  "110": { gua: "兑", name: "泽", key: "dui" },
  "101": { gua: "离", name: "火", key: "li" },
  "100": { gua: "震", name: "雷", key: "zhen" },
  "011": { gua: "巽", name: "风", key: "xun" },
  "010": { gua: "坎", name: "水", key: "kan" },
  "001": { gua: "艮", name: "山", key: "gen" },
  "000": { gua: "坤", name: "地", key: "kun" }
};

function getLiuyaoCastScreenHeight() {
  const state = getLiuyaoState();
  if (state.mode === "online" && liuyaoCastModalOpen) return 844;
  return state.mode === "manual" ? 1480 : 1024;
}
const LIUYAO_LINE_LABELS = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
const LIUYAO_MANUAL_EMPTY_COINS = [null, null, null];
let liuyaoState = null;
let liuyaoTossTimer = null;
let liuyaoTossAnimation = null;
let liuyaoSwipeStart = null;
let liuyaoQuestionGateLoading = false;
let liuyaoCastModalOpen = false;
let liuyaoResetConfirmOpen = false;

function lockLiuyaoCasterScroll(locked) {
  document.body?.classList.toggle("liuyao-caster-open", Boolean(locked));
}

function setLiuyaoCasterModalOpen(open) {
  liuyaoCastModalOpen = Boolean(open);
  if (!liuyaoCastModalOpen) {
    liuyaoResetConfirmOpen = false;
    lockLiuyaoCasterScroll(false);
  }
}

function normalizeLiuyaoCast(raw) {
  const value = Number(raw?.value);
  if (!LIUYAO_VALUES.includes(value)) return null;
  const coins = Array.isArray(raw?.coins) && raw.coins.length === 3
    ? raw.coins.map(Number).map((coin) => coin === 3 ? 3 : 2)
    : value === 6 ? [2, 2, 2] : value === 7 ? [3, 2, 2] : value === 8 ? [3, 3, 2] : [3, 3, 3];
  const power = Math.max(0, Math.min(100, Math.round(Number(raw?.power) || 0)));
  const pull = Math.max(0, Math.min(LIUYAO_PULL_MAX, Math.round(Number(raw?.pull) || 0)));
  const duration = Math.max(0, Math.min(6000, Math.round(Number(raw?.duration) || 0)));
  return { value, coins, manual: Boolean(raw?.manual), at: Number(raw?.at) || Date.now(), power, pull, duration };
}

function normalizeLiuyaoCoinFace(value) {
  const face = Number(value);
  return face === 3 || face === 2 ? face : null;
}

function normalizeLiuyaoManualCoins(raw, casts = []) {
  return Array.from({ length: 6 }, (_, lineIndex) => {
    const cast = normalizeLiuyaoCast(casts[lineIndex]);
    const source = Array.isArray(raw?.[lineIndex]) ? raw[lineIndex] : (cast?.manual ? cast.coins : []);
    return [0, 1, 2].map((coinIndex) => normalizeLiuyaoCoinFace(source?.[coinIndex]));
  });
}

function makeLiuyaoManualCoins() {
  return Array.from({ length: 6 }, () => LIUYAO_MANUAL_EMPTY_COINS.slice());
}

function normalizeLiuyaoQuestion(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, LIUYAO_QUESTION_MAX_LENGTH);
}

function normalizeLiuyaoQuestionGate(raw, question) {
  if (!raw || typeof raw !== "object") return null;
  const gateQuestion = normalizeLiuyaoQuestion(raw.question || raw.normalizedQuestion || "");
  if (gateQuestion && gateQuestion !== question) return null;
  return {
    question,
    allowed: raw.allowed === true,
    reason: normalizeLiuyaoQuestion(raw.reason || ""),
    suggestion: normalizeLiuyaoQuestion(raw.suggestion || ""),
    labels: Array.isArray(raw.labels) ? raw.labels.map(normalizeLiuyaoQuestion).filter(Boolean).slice(0, 4) : [],
    checkedAt: Number(raw.checkedAt) || Date.now(),
    retryable: raw.retryable === true,
  };
}

function makeLiuyaoDefaultState() {
  return {
    recordId: makeWentianUuid(),
    mode: "online",
    question: LIUYAO_DEFAULT_QUESTION,
    createdAt: Date.now(),
    casts: [],
    manualCoins: makeLiuyaoManualCoins(),
    questionGate: null
  };
}

function getLiuyaoState() {
  if (liuyaoState) return liuyaoState;
  try {
    const parsed = JSON.parse(localStorage.getItem(LIUYAO_STORAGE_KEY) || "null");
    if (parsed && typeof parsed === "object") {
      const casts = Array.isArray(parsed.casts) ? parsed.casts.slice(0, 6).map(normalizeLiuyaoCast) : [];
      const storedQuestion = normalizeLiuyaoQuestion(parsed.question || LIUYAO_DEFAULT_QUESTION);
      const question = storedQuestion === LIUYAO_SAMPLE_QUESTION && !casts.filter(Boolean).length ? "" : storedQuestion;
      liuyaoState = {
        recordId: isWentianUuid(parsed.recordId) ? parsed.recordId : makeWentianUuid(),
        mode: parsed.mode === "manual" ? "manual" : "online",
        question,
        createdAt: Number(parsed.createdAt) || Date.now(),
        casts,
        manualCoins: normalizeLiuyaoManualCoins(parsed.manualCoins, casts),
        questionGate: normalizeLiuyaoQuestionGate(parsed.questionGate, question)
      };
      return liuyaoState;
    }
  } catch (_err) {}
  liuyaoState = makeLiuyaoDefaultState();
  return liuyaoState;
}

function formatLiuyaoMovingLineText(movingLines, prefix = "") {
  const lines = Array.isArray(movingLines) ? movingLines : [];
  const labels = lines.map((line) => line?.label).filter(Boolean);
  const text = labels.length ? labels.join("、") : "无";
  return `${prefix}${text}`;
}

function saveLiuyaoState() {
  try {
    localStorage.setItem(LIUYAO_STORAGE_KEY, JSON.stringify(getLiuyaoState()));
  } catch (_err) {}
}

function saveLiuyaoQuestionFromDom() {
  const input = document.getElementById("liuyao-question");
  if (!input) return;
  const state = getLiuyaoState();
  const nextQuestion = normalizeLiuyaoQuestion(input.value);
  if (state.question !== nextQuestion) {
    const hadCasts = getLiuyaoValidCasts(state).length > 0;
    state.question = nextQuestion;
    state.questionGate = null;
    if (hadCasts) {
      clearLiuyaoTossAnimation();
      state.recordId = makeWentianUuid();
      state.createdAt = Date.now();
      state.casts = [];
    }
    const status = document.getElementById("liuyao-question-status");
    if (status) {
      status.textContent = "改好后点提交占问，重新审题。";
      status.dataset.tone = "hint";
    }
  }
  saveLiuyaoState();
  updateLiuyaoQuestionSubmitDom();
}

function clearLiuyaoTossAnimation() {
  if (liuyaoTossTimer) {
    clearTimeout(liuyaoTossTimer);
    liuyaoTossTimer = null;
  }
  liuyaoTossAnimation = null;
  liuyaoSwipeStart = null;
}

function navigateLiuyaoCastPreservingScroll() {
  const scrollX = window.scrollX || document.documentElement.scrollLeft || 0;
  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  navigate("screen-17", false);
  window.scrollTo(scrollX, scrollY);
  window.setTimeout(() => window.scrollTo(scrollX, scrollY), 0);
  window.setTimeout(() => window.scrollTo(scrollX, scrollY), 80);
}

function setLiuyaoMode(mode) {
  clearLiuyaoTossAnimation();
  setLiuyaoCasterModalOpen(false);
  saveLiuyaoQuestionFromDom();
  const state = getLiuyaoState();
  state.mode = mode === "manual" ? "manual" : "online";
  if (state.mode === "online") state.casts = state.casts.filter(Boolean);
  saveLiuyaoState();
  navigate("screen-17", false);
}

function resetLiuyaoState() {
  clearLiuyaoTossAnimation();
  liuyaoResetConfirmOpen = false;
  setLiuyaoCasterModalOpen(false);
  liuyaoState = makeLiuyaoDefaultState();
  saveLiuyaoState();
  navigate("screen-17", false);
}

function requestLiuyaoReset() {
  liuyaoResetConfirmOpen = true;
  navigate("screen-17", false);
}

function cancelLiuyaoReset() {
  liuyaoResetConfirmOpen = false;
  navigate("screen-17", false);
}

function confirmLiuyaoReset() {
  resetLiuyaoState();
}

function getSecureRandomByte() {
  if (window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(1);
    window.crypto.getRandomValues(bytes);
    return bytes[0];
  }
  return Math.floor(Math.random() * 256);
}

function clampLiuyaoPower(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return LIUYAO_DEFAULT_POWER;
  return Math.max(0.18, Math.min(1, number));
}

function makeLiuyaoCoinCast(gesture = {}) {
  const power = clampLiuyaoPower(gesture.power);
  const pull = Math.max(0, Math.min(LIUYAO_PULL_MAX, Math.round(Number(gesture.pull) || power * LIUYAO_PULL_MAX)));
  const duration = Math.max(0, Math.min(6000, Math.round(Number(gesture.duration) || 0)));
  const deltaX = Math.round(Number(gesture.deltaX) || 0);
  const seed = Math.round(power * 1000) + pull * 7 + duration * 3 + deltaX * 11;
  const coins = [0, 1, 2].map((_, index) => {
    const wobble = ((duration + pull + index * 37) % 9) - 4;
    const threshold = Math.max(38, Math.min(62, 50 + Math.round((power - 0.5) * 18) + wobble));
    return ((getSecureRandomByte() + seed + index * 73) % 100) < threshold ? 3 : 2;
  });
  return {
    value: coins.reduce((sum, coin) => sum + coin, 0),
    coins,
    manual: false,
    at: Date.now(),
    power: Math.round(power * 100),
    pull,
    duration,
  };
}

function getLiuyaoManualCoins(state = getLiuyaoState(), lineIndex = 0) {
  if (!Array.isArray(state.manualCoins) || state.manualCoins.length < 6) {
    state.manualCoins = normalizeLiuyaoManualCoins(state.manualCoins, state.casts);
  }
  if (!Array.isArray(state.manualCoins[lineIndex])) {
    state.manualCoins[lineIndex] = LIUYAO_MANUAL_EMPTY_COINS.slice();
  }
  return state.manualCoins[lineIndex];
}

function makeLiuyaoManualCastFromCoins(coins) {
  const faces = [0, 1, 2].map((index) => normalizeLiuyaoCoinFace(coins?.[index]));
  if (faces.some((face) => !face)) return null;
  return normalizeLiuyaoCast({
    value: faces.reduce((sum, face) => sum + face, 0),
    coins: faces,
    manual: true,
    at: Date.now(),
  });
}

function setLiuyaoQuestionGateResult(result) {
  const state = getLiuyaoState();
  const question = normalizeLiuyaoQuestion(state.question);
  state.questionGate = {
    question,
    allowed: result?.allowed === true,
    reason: normalizeLiuyaoQuestion(result?.reason || ""),
    suggestion: normalizeLiuyaoQuestion(result?.suggestion || ""),
    labels: Array.isArray(result?.labels) ? result.labels.map(normalizeLiuyaoQuestion).filter(Boolean).slice(0, 4) : [],
    checkedAt: Date.now(),
    retryable: result?.retryable === true,
  };
  saveLiuyaoState();
  return state.questionGate;
}

function getLiuyaoQuestionGateMessage(state = getLiuyaoState()) {
  if (liuyaoQuestionGateLoading) {
    return { tone: "loading", text: "正在审题，合格才起卦。" };
  }
  const question = normalizeLiuyaoQuestion(state.question);
  const gate = normalizeLiuyaoQuestionGate(state.questionGate, question);
  if (!question) {
    return { tone: "hint", text: "先写清一件事；空问、乱点、随便试，不起卦。" };
  }
  if (!gate) {
    return { tone: "hint", text: "起卦前会先按“一事一占”审题。" };
  }
  if (gate.allowed) {
    return { tone: "ok", text: gate.reason || "审题通过，可以起卦。" };
  }
  return {
    tone: "error",
    text: `${gate.reason || "问题还不够清楚，暂不起卦。"}${gate.suggestion ? ` ${gate.suggestion}` : ""}`,
  };
}

function renderLiuyaoQuestionGateStatus(state = getLiuyaoState()) {
  const status = getLiuyaoQuestionGateMessage(state);
  return `<p id="liuyao-question-status" class="liuyao-question-status" data-tone="${escapeHtml(status.tone)}">${escapeHtml(status.text)}</p>`;
}

function getLiuyaoQuestionSubmitMeta(state = getLiuyaoState()) {
  const question = normalizeLiuyaoQuestion(state.question);
  const gate = normalizeLiuyaoQuestionGate(state.questionGate, question);
  if (liuyaoQuestionGateLoading) {
    return { label: "审题中…", disabled: true, state: "loading" };
  }
  if (gate?.allowed) {
    return { label: "已通过", disabled: true, state: "approved" };
  }
  if (gate && !gate.allowed) {
    return {
      label: gate.retryable ? "重新提交" : "修改后提交",
      disabled: !gate.retryable,
      state: "rejected",
    };
  }
  return { label: "提交占问", disabled: !question, state: "idle" };
}

function renderLiuyaoQuestionSubmit(state = getLiuyaoState()) {
  const meta = getLiuyaoQuestionSubmitMeta(state);
  return `
    <button
      type="button"
      class="liuyao-question-submit ${meta.state ? `is-${meta.state}` : ""}"
      data-action="liuyao-submit-question"
      ${meta.disabled ? "disabled" : ""}
    >${escapeHtml(meta.label)}</button>
  `;
}

function updateLiuyaoQuestionSubmitDom(state = getLiuyaoState()) {
  const button = document.querySelector('[data-action="liuyao-submit-question"]');
  const meta = getLiuyaoQuestionSubmitMeta(state);
  if (button) {
    button.textContent = meta.label;
    button.disabled = meta.disabled;
    ["idle", "loading", "approved", "rejected"].forEach((name) => {
      button.classList.toggle(`is-${name}`, meta.state === name);
    });
  }
  updateLiuyaoQuestionLockedDom(state);
}

function updateLiuyaoQuestionLockedDom(state = getLiuyaoState()) {
  const question = normalizeLiuyaoQuestion(state.question);
  const ready = Boolean(normalizeLiuyaoQuestionGate(state.questionGate, question)?.allowed);
  const progress = getLiuyaoProgress(state);
  const complete = progress >= 6;
  const lockText = liuyaoQuestionGateLoading ? "审题中，稍候开放" : "提交通过后开放投币";
  const panel = document.querySelector(".liuyao-coin-panel");
  if (panel) {
    panel.classList.toggle("is-ready", ready);
    panel.classList.toggle("is-waiting", !ready);
  }
  const stage = document.querySelector('[data-action="liuyao-swipe-cast"]');
  if (stage) {
    const disabled = !ready || liuyaoQuestionGateLoading || complete || state.mode !== "online";
    stage.classList.toggle("is-disabled", disabled);
    stage.setAttribute("aria-disabled", disabled ? "true" : "false");
    stage.setAttribute("tabindex", disabled ? "-1" : "0");
    stage.setAttribute("aria-label", disabled ? lockText : `按住铜钱上拉，松手投第 ${progress + 1} 爻`);
    const cue = stage.querySelector(".liuyao-swipe-cue");
    if (cue) cue.textContent = disabled ? lockText : `按住铜钱上拉，松手投第 ${progress + 1} 爻`;
    const force = stage.querySelector(".liuyao-force-label");
    if (force && !ready) force.textContent = "待审题";
  }
  const onlineAction = document.querySelector('[data-action="liuyao-open-caster"]');
  if (onlineAction) {
    onlineAction.disabled = !ready || liuyaoQuestionGateLoading || Boolean(liuyaoTossAnimation?.active);
    onlineAction.textContent = liuyaoQuestionGateLoading ? "审题中…" : (!ready ? "提交通过后开放投币" : `全屏投第 ${progress + 1} 爻`);
  }
  if (!ready) {
    document.querySelectorAll('.liuyao-line-row[data-action="liuyao-manual-line"]').forEach((item) => {
      item.removeAttribute("data-action");
    });
  }
}

function parseLiuyaoGateJson(text) {
  const raw = String(text || "").trim();
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced ? fenced[1] : raw;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(source.slice(start, end + 1));
  } catch (_err) {
    return null;
  }
}

function reviewLiuyaoQuestionLocally(question) {
  const normalizedQuestion = normalizeLiuyaoQuestion(question);
  const compact = normalizedQuestion.replace(/[\s，。！？、,.!?；;：“”"'（）()【】\[\]]+/g, "");
  const fail = (reason, suggestion, labels = ["一事一占"]) => ({
    allowed: false,
    normalizedQuestion,
    reason,
    suggestion,
    labels,
  });

  if (!normalizedQuestion) {
    return fail("请先写清楚要问的一件事。", "一句话只问一件具体事情，再起卦。");
  }
  if (/^(随便|随机|娱乐|玩玩|试试|测试|乱点|看看|不知道|无所谓|都行|随便玩玩|随便看看|随机看看|测一下|测测|试一下|试试看|占着玩|测着玩)$/.test(compact)) {
    return fail("这个问题太随意，暂不起卦。", "请写清楚具体对象和想看的结果。", ["问题太散"]);
  }
  if (/^(事业|财运|感情|婚姻|健康|工作|学业|运势|赚钱|求财|桃花|考试|合作|项目|网站)(怎么样|如何|好吗|看看|测测|测一下)?$/.test(compact)) {
    return fail("问题还太泛，暂不起卦。", "请具体到一件事，例如“这个项目本月能不能推进”。", ["问题太泛"]);
  }
  if ((normalizedQuestion.match(/[？?]/g) || []).length > 1 || /同时|另外|还有|顺便|以及/.test(normalizedQuestion)) {
    return fail("一次只问一件事。", "请先删到一个核心问题，再提交。", ["一事一占"]);
  }

  const hasSpecificSubject = /(我|我们|本人|自己|这个|这件|该|现在|本月|今年|最近|网站|项目|公司|店|生意|工作|客户|合作|合同|订单|产品|账号|平台|考试|offer|面试|房子|投资|资金|对方|他|她|TA|孩子|家人|父母|伴侣|对象|老板|同事|合伙人)/i.test(normalizedQuestion);
  const hasOutcome = /(能不能|能否|是否|可否|会不会|要不要|该不该|适不适合|可以吗|成不成|有没有|何时|多久|结果|赚钱|盈利|回本|成交|签约|通过|录取|复合|结婚|分手|离职|跳槽|搬家|买|卖|租|开店|上线|发布|推进|合作|投资|到账|怀孕|好转)/i.test(normalizedQuestion);
  const hasQuestionCue = /[？?]|吗|呢|如何|怎样|怎么样|能|该|是否|可否|会不会|要不要/.test(normalizedQuestion);

  if (compact.length < 8 || !hasSpecificSubject || !hasOutcome || !hasQuestionCue) {
    return fail("问题还不够具体，暂不起卦。", "请写清对象、事件和想看的结果。", ["问题不具体"]);
  }
  return {
    allowed: true,
    normalizedQuestion,
    reason: "问题具体到对象、事件和结果，符合一事一占原则。",
    suggestion: "",
    labels: ["一事一占"],
  };
}

async function reviewLiuyaoQuestionViaChat(question) {
  const localGate = reviewLiuyaoQuestionLocally(question);
  if (String(window.SITE_CONFIG?.liuyaoQuestionGateMode || "remote").toLowerCase() === "local") {
    return localGate;
  }
  if (!localGate.allowed) return localGate;
  try {
    const data = await wentianPostJson("/api/ai/liuyao-question", {
      question,
      chatMode: "liuyao_question_gate",
      divinationContext: { type: "liuyao_question_gate", question },
    }, 6000, 0);
    if (typeof data?.allowed === "boolean") return data;
    const parsed = parseLiuyaoGateJson(data?.reply);
    if (!parsed) throw new Error("chat gate parse failed");
    return parsed;
  } catch (_err) {
    return localGate;
  }
}

async function ensureLiuyaoQuestionAllowed() {
  if (liuyaoQuestionGateLoading) return false;
  saveLiuyaoQuestionFromDom();
  const state = getLiuyaoState();
  const question = normalizeLiuyaoQuestion(state.question);
  if (!question) {
    setLiuyaoQuestionGateResult({
      allowed: false,
      reason: "请先写清楚要问的一件事。",
      suggestion: "一句话只问一件具体事情，再起卦。",
      labels: ["一事一占"],
    });
    navigate("screen-17", false);
    return false;
  }
  const cached = normalizeLiuyaoQuestionGate(state.questionGate, question);
  if (cached?.allowed) return true;
  if (cached && !cached.retryable) {
    navigate("screen-17", false);
    return false;
  }
  liuyaoQuestionGateLoading = true;
  navigate("screen-17", false);
  try {
    const data = await reviewLiuyaoQuestionViaChat(question);
    const gate = setLiuyaoQuestionGateResult({
      allowed: data?.allowed === true,
      reason: data?.reason || (data?.allowed ? "审题通过，可以起卦。" : "问题还不够清楚，暂不起卦。"),
      suggestion: data?.suggestion || "",
      labels: data?.labels || [],
    });
    return gate.allowed;
  } catch (_err) {
    const gate = setLiuyaoQuestionGateResult(reviewLiuyaoQuestionLocally(question));
    return gate.allowed;
  } finally {
    liuyaoQuestionGateLoading = false;
    navigate("screen-17", false);
  }
}

function prepareLiuyaoOnlineTossState() {
  saveLiuyaoQuestionFromDom();
  const state = getLiuyaoState();
  state.mode = "online";
  state.casts = state.casts.filter(Boolean);
  if (state.casts.length >= 6) {
    state.recordId = makeWentianUuid();
    state.createdAt = Date.now();
    state.casts = [];
  }
  return state;
}

function focusLiuyaoCasterModal(options = {}) {
  window.setTimeout(() => {
    const modal = document.querySelector(".liuyao-caster-modal");
    const caster = modal?.querySelector('[data-action="liuyao-swipe-cast"]');
    if (options.scroll !== false) modal?.scrollIntoView?.({ block: "start", behavior: "smooth" });
    caster?.focus?.({ preventScroll: true });
    if (modal) window.setTimeout(() => lockLiuyaoCasterScroll(liuyaoCastModalOpen), 180);
  }, 0);
}

function openLiuyaoCasterModal() {
  const state = getLiuyaoState();
  if (state.mode !== "online" || getLiuyaoProgress(state) >= 6) return;
  setLiuyaoCasterModalOpen(true);
  navigate("screen-17", false);
  focusLiuyaoCasterModal();
}

function closeLiuyaoCasterModal() {
  setLiuyaoCasterModalOpen(false);
  navigate("screen-17", false);
}

function refreshLiuyaoCasterModalDom(options = {}) {
  const modal = document.querySelector(".liuyao-caster-modal");
  if (!modal || state.route !== "screen-17") return false;
  const current = getLiuyaoState();
  const html = renderLiuyaoCasterModal(current, { complete: getLiuyaoProgress(current) >= 6 });
  if (!html) {
    modal.remove();
    return true;
  }
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const next = template.content.firstElementChild;
  if (!next) return false;
  modal.replaceWith(next);
  lockLiuyaoCasterScroll(liuyaoCastModalOpen);
  if (options.focus) {
    next.querySelector('[data-action="liuyao-swipe-cast"]')?.focus?.({ preventScroll: true });
  }
  return true;
}

function finishLiuyaoAnimatedToss() {
  const pending = liuyaoTossAnimation?.cast;
  liuyaoTossTimer = null;
  liuyaoTossAnimation = null;
  if (!pending) return;
  const state = getLiuyaoState();
  state.mode = "online";
  state.casts = state.casts.filter(Boolean);
  if (state.casts.length < 6) state.casts.push(pending);
  saveLiuyaoState();
  const complete = state.casts.length >= 6;
  setLiuyaoCasterModalOpen(!complete);
  if (complete) {
    navigate("screen-20", false);
    return;
  }
  if (!refreshLiuyaoCasterModalDom({ focus: true })) {
    navigate("screen-17", false);
    focusLiuyaoCasterModal();
  }
}

function beginLiuyaoAnimatedToss(gesture = {}) {
  if (liuyaoTossAnimation?.active) return false;
  const state = prepareLiuyaoOnlineTossState();
  if (state.casts.length >= 6) return false;
  const cast = makeLiuyaoCoinCast(gesture);
  setLiuyaoCasterModalOpen(true);
  liuyaoTossAnimation = {
    active: true,
    cast,
    lineIndex: state.casts.length,
    power: cast.power,
    pull: cast.pull,
    startedAt: Date.now(),
  };
  saveLiuyaoState();
  if (!refreshLiuyaoCasterModalDom({ focus: true })) {
    navigate("screen-17", false);
    focusLiuyaoCasterModal();
  } else {
    focusLiuyaoCasterModal({ scroll: false });
  }
  liuyaoTossTimer = setTimeout(finishLiuyaoAnimatedToss, LIUYAO_TOSS_ANIMATION_MS);
  return true;
}

async function startLiuyaoAnimatedToss(gesture = {}) {
  if (!(await ensureLiuyaoQuestionAllowed())) return false;
  return beginLiuyaoAnimatedToss(gesture);
}

async function tossLiuyaoLine(all = false) {
  if (!(await ensureLiuyaoQuestionAllowed())) return false;
  clearLiuyaoTossAnimation();
  setLiuyaoCasterModalOpen(false);
  const state = prepareLiuyaoOnlineTossState();
  do {
    state.casts.push(makeLiuyaoCoinCast({ power: LIUYAO_DEFAULT_POWER, pull: LIUYAO_PULL_MAX * LIUYAO_DEFAULT_POWER }));
  } while (all && state.casts.length < 6);
  saveLiuyaoState();
  navigate(state.casts.length >= 6 ? "screen-20" : "screen-17", false);
  return true;
}

async function cycleLiuyaoManualLine(index) {
  if (!(await ensureLiuyaoQuestionAllowed())) return false;
  clearLiuyaoTossAnimation();
  saveLiuyaoQuestionFromDom();
  const state = getLiuyaoState();
  state.mode = "manual";
  while (state.casts.length < 6) state.casts.push(null);
  const current = normalizeLiuyaoCast(state.casts[index]);
  const nextValue = current ? LIUYAO_VALUES[(LIUYAO_VALUES.indexOf(current.value) + 1) % LIUYAO_VALUES.length] : 7;
  state.casts[index] = normalizeLiuyaoCast({ value: nextValue, manual: true, at: Date.now() });
  state.manualCoins = normalizeLiuyaoManualCoins(state.manualCoins, state.casts);
  saveLiuyaoState();
  navigateLiuyaoCastPreservingScroll();
  return true;
}

async function setLiuyaoManualCoin(lineIndex, coinIndex, face) {
  if (!(await ensureLiuyaoQuestionAllowed())) return false;
  const line = Math.max(0, Math.min(5, Math.round(Number(lineIndex) || 0)));
  const coin = Math.max(0, Math.min(2, Math.round(Number(coinIndex) || 0)));
  const coinFace = normalizeLiuyaoCoinFace(face);
  if (!coinFace) return false;
  clearLiuyaoTossAnimation();
  setLiuyaoCasterModalOpen(false);
  saveLiuyaoQuestionFromDom();
  const state = getLiuyaoState();
  state.mode = "manual";
  while (state.casts.length < 6) state.casts.push(null);
  state.manualCoins = normalizeLiuyaoManualCoins(state.manualCoins, state.casts);
  const row = getLiuyaoManualCoins(state, line).slice();
  row[coin] = coinFace;
  state.manualCoins[line] = row;
  state.casts[line] = null;
  saveLiuyaoState();
  navigateLiuyaoCastPreservingScroll();
  return true;
}

async function confirmLiuyaoManualLine(lineIndex) {
  if (!(await ensureLiuyaoQuestionAllowed())) return false;
  const line = Math.max(0, Math.min(5, Math.round(Number(lineIndex) || 0)));
  clearLiuyaoTossAnimation();
  setLiuyaoCasterModalOpen(false);
  saveLiuyaoQuestionFromDom();
  const state = getLiuyaoState();
  state.mode = "manual";
  while (state.casts.length < 6) state.casts.push(null);
  state.manualCoins = normalizeLiuyaoManualCoins(state.manualCoins, state.casts);
  const cast = makeLiuyaoManualCastFromCoins(getLiuyaoManualCoins(state, line));
  if (!cast) return false;
  state.casts[line] = cast;
  state.manualCoins[line] = cast.coins.slice();
  saveLiuyaoState();
  navigateLiuyaoCastPreservingScroll();
  return true;
}

function clearLiuyaoManualLine(lineIndex) {
  const line = Math.max(0, Math.min(5, Math.round(Number(lineIndex) || 0)));
  clearLiuyaoTossAnimation();
  const state = getLiuyaoState();
  state.mode = "manual";
  while (state.casts.length < 6) state.casts.push(null);
  state.manualCoins = normalizeLiuyaoManualCoins(state.manualCoins, state.casts);
  state.manualCoins[line] = LIUYAO_MANUAL_EMPTY_COINS.slice();
  state.casts[line] = null;
  saveLiuyaoState();
  navigateLiuyaoCastPreservingScroll();
}

function clearLastLiuyaoManualLine() {
  clearLiuyaoTossAnimation();
  const state = getLiuyaoState();
  state.mode = "manual";
  while (state.casts.length < 6) state.casts.push(null);
  state.manualCoins = normalizeLiuyaoManualCoins(state.manualCoins, state.casts);
  for (let line = 5; line >= 0; line -= 1) {
    if (normalizeLiuyaoCast(state.casts[line])) {
      state.manualCoins[line] = LIUYAO_MANUAL_EMPTY_COINS.slice();
      state.casts[line] = null;
      saveLiuyaoState();
      navigateLiuyaoCastPreservingScroll();
      return;
    }
  }
}

async function showLiuyaoResultIfAllowed() {
  if (!(await ensureLiuyaoQuestionAllowed())) return false;
  if (getLiuyaoResult()) {
    navigate("screen-20", false);
    return true;
  }
  return false;
}

function getLiuyaoLineType(value) {
  return {
    6: { value: 6, name: "老阴", nature: "阴动", broken: true, moving: true, mark: "×", changesTo: "阳", changedBroken: false, coinText: "阴阴阴" },
    7: { value: 7, name: "少阳", nature: "阳静", broken: false, moving: false, mark: "", changesTo: "阳", changedBroken: false, coinText: "阳阴阴" },
    8: { value: 8, name: "少阴", nature: "阴静", broken: true, moving: false, mark: "", changesTo: "阴", changedBroken: true, coinText: "阳阳阴" },
    9: { value: 9, name: "老阳", nature: "阳动", broken: false, moving: true, mark: "○", changesTo: "阴", changedBroken: true, coinText: "阳阳阳" }
  }[Number(value)] || null;
}

function getLiuyaoValidCasts(state = getLiuyaoState()) {
  return state.casts.map(normalizeLiuyaoCast).filter(Boolean);
}

function getLiuyaoProgress(state = getLiuyaoState()) {
  return getLiuyaoValidCasts(state).length;
}

function getLiuyaoHexFromBools(bools) {
  const lower = LIUYAO_TRIGRAM_BY_BITS[bools.slice(0, 3).map(Boolean).map(Number).join("")];
  const upper = LIUYAO_TRIGRAM_BY_BITS[bools.slice(3, 6).map(Boolean).map(Number).join("")];
  const entry = upper && lower ? YANGZHAI_HEX_INDEX[`${upper.gua}-${lower.gua}`] : null;
  return {
    upper,
    lower,
    no: entry?.no || "",
    name: entry?.name || `${upper?.name || ""}${lower?.name || ""}`,
    key: `${upper?.gua || ""}-${lower?.gua || ""}`
  };
}

function getLiuyaoResult(state = getLiuyaoState()) {
  const casts = state.casts.map(normalizeLiuyaoCast);
  if (casts.length < 6 || casts.some((cast) => !cast)) return null;
  const lines = casts.map((cast, index) => {
    const type = getLiuyaoLineType(cast.value);
    return { ...type, index, label: LIUYAO_LINE_LABELS[index], coins: cast.coins || [], manual: Boolean(cast.manual) };
  });
  const originalBools = lines.map((line) => !line.broken);
  const changedBools = lines.map((line) => line.moving ? !line.changedBroken : !line.broken);
  const primary = getLiuyaoHexFromBools(originalBools);
  const changed = getLiuyaoHexFromBools(changedBools);
  const movingLines = lines.filter((line) => line.moving);
  return { recordId: state.recordId || makeWentianUuid(), question: state.question || LIUYAO_DEFAULT_QUESTION, createdAt: state.createdAt, lines, primary, changed, movingLines };
}

function getLiuyaoHexReading(hex) {
  if (!hex) return { summary: "本卦资料待补。", xian: "", hou: "", liu: "" };
  const master = window.getYijingMasterEntryByName?.(hex.name) || window.getYijingMasterEntryByNum?.(hex.no);
  const guaci = window.getGuaciEntryByName?.(hex.name);
  return {
    summary: master?.summary || guaci?.liu || "此卦重在审时度势，先明当前处境，再定进退。",
    xian: master?.xian || guaci?.xian || "",
    hou: master?.hou || guaci?.hou || "",
    liu: master?.liu || guaci?.liu || "",
    source: master?.source || ""
  };
}

function getYijingHexagramImageSrc(no) {
  const index = Number(no);
  if (!Number.isInteger(index) || index < 1 || index > 64) return "";
  return `../images/yijing-hexagrams/${String(index).padStart(2, "0")}.webp`;
}

function formatLiuyaoHexMeta(hex) {
  const noText = hex?.no ? `第${hex.no}卦` : "卦象";
  const upper = hex?.upper?.name || "";
  const lower = hex?.lower?.name || "";
  const guaText = upper || lower ? ` · ${upper}上${lower}下` : "";
  return `${noText}${guaText}`;
}

function renderLiuyaoHexImage(hex, label) {
  const src = getYijingHexagramImageSrc(hex?.no);
  if (!src) return "";
  const alt = `${label}：${formatLiuyaoHexMeta(hex)} ${hex?.name || ""}`;
  return `<img class="liuyao-hex-image" src="${src}" alt="${escapeHtml(alt)}" loading="lazy">`;
}

function renderLiuyaoMiniHex(lines, options = {}) {
  const displayLines = [5, 4, 3, 2, 1, 0].map((index) => lines?.[index] || null);
  return `
    <span class="liuyao-mini-hex" aria-label="${escapeHtml(options.label || "六爻卦象")}" title="${escapeHtml(options.label || "六爻卦象")}">
      ${displayLines.map((line) => {
        const broken = options.changed && line ? line.changedBroken : line?.broken;
        return `
          <i class="${broken ? "is-yin" : "is-yang"} ${line?.moving ? "is-moving" : ""}">
            <b></b>${broken ? "<b></b>" : ""}
          </i>
        `;
      }).join("")}
    </span>
  `;
}

function firstReadableSentence(text, fallback = "") {
  const source = String(text || "").replace(/原句：/g, "").replace(/讲解：/g, "").replace(/\s+/g, " ").trim();
  return source.split(/[。！？]/).find((part) => part.trim().length >= 6)?.trim() || fallback;
}

function getLiuyaoTopicAdvice(question, result) {
  const text = String(question || "");
  const moving = result.movingLines.length;
  if (/感情|婚姻|复合|对象|伴侣|爱情/.test(text)) return moving ? "感情看动爻，先处理变化点，不急着逼对方表态。" : "感情无动先守边界，重在稳定沟通，不宜反复试探。";
  if (/财|钱|投资|生意|收入|合作/.test(text)) return moving ? "财事有变，先控风险和合同，再谈扩张。" : "财事宜稳，先守现金流，少做高杠杆决定。";
  if (/病|健康|身体|手术/.test(text)) return "健康类问题以现实检查为准，此卦只看节奏：先确认风险，再定行动。";
  if (/事业|工作|跳槽|项目|计划|职位|考试/.test(text)) return moving ? "事业有变化点，适合小步推进，用结果换空间。" : "事业先稳住主线，少换方向，把一个成果做扎实。";
  return moving ? "当前局面有变化点，先看动爻，再看变卦走向。" : "当前局面偏静，重看本卦，不宜反复重占同一件事。";
}

function renderLiuyaoLineVisual(line, prefix) {
  const lineClass = line?.broken ? "is-yin" : "is-yang";
  return `<span class="liuyao-line-visual ${lineClass}" data-line="${prefix}">${line?.broken ? "<i></i><i></i>" : "<i></i>"}</span>`;
}

function renderLiuyaoHexStack(lines, options = {}) {
  const displayLines = [5, 4, 3, 2, 1, 0].map((index) => lines?.[index] || null);
  const landingIndex = Number.isInteger(options.landingIndex)
    ? options.landingIndex
    : (liuyaoTossAnimation?.active ? liuyaoTossAnimation.lineIndex : -1);
  const freshWindow = Number(options.freshWindow) || 2600;
  const now = Date.now();
  return `
    <div class="liuyao-hex-stack ${options.compact ? "is-compact" : ""}">
      ${displayLines.map((line, displayIndex) => {
        const realIndex = 5 - displayIndex;
        const isFresh = line?.at && now - line.at >= 0 && now - line.at <= freshWindow;
        return `
          <button class="liuyao-line-row ${line?.moving ? "is-moving" : ""} ${line ? "" : "is-empty"} ${realIndex === landingIndex ? "is-landing" : ""} ${isFresh ? "is-new" : ""}" type="button" ${options.manual ? `data-action="liuyao-manual-line" data-line-index="${realIndex}"` : ""}>
            <span class="liuyao-line-label">${LIUYAO_LINE_LABELS[realIndex]}</span>
            ${line ? renderLiuyaoLineVisual(line, `${options.id || "hex"}-${realIndex}`) : `<span class="liuyao-line-visual is-empty"><i></i></span>`}
            <span class="liuyao-line-meta">${line ? `${line.value} ${line.name}${line.mark ? ` ${line.mark}` : ""}` : "未定"}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function getLiuyaoCoinFaceLabel(coin) {
  return coin === 3 ? "正" : "反";
}

function renderLiuyaoCoinFaceStrip(coins = [], label = "落地结果") {
  const faces = Array.isArray(coins) && coins.length ? coins : [3, 2, 3];
  return `
    <div class="liuyao-coin-face-strip" aria-label="${escapeHtml(label)}">
      <span>${escapeHtml(label)}</span>
      ${faces.map((coin, index) => `
        <em class="${coin === 3 ? "is-head" : "is-tail"}">
          <i>${index + 1}</i>${getLiuyaoCoinFaceLabel(coin)}
        </em>
      `).join("")}
    </div>
  `;
}

function renderLiuyaoCoinRow(state, options = {}) {
  const last = getLiuyaoValidCasts(state).at(-1);
  const tossing = liuyaoTossAnimation?.active && state.mode === "online";
  const progress = getLiuyaoProgress(state);
  const disabled = state.mode !== "online" || progress >= 6 || options.complete || options.disabled;
  const disabledLabel = options.lockText || "卦已成";
  const coins = tossing ? liuyaoTossAnimation.cast.coins : (last?.coins || [3, 2, 3]);
  const showFaces = tossing || Boolean(last);
  const powerPercent = tossing ? Math.max(18, Math.min(100, Number(liuyaoTossAnimation.power) || 62)) : 0;
  const powerRatio = powerPercent ? powerPercent / 100 : 0;
  const meterRatio = tossing ? powerRatio : (last?.power ? Math.max(0, Math.min(1, last.power / 100)) : 0);
  const throwY = Math.round(-66 - powerRatio * 74);
  const label = tossing
    ? `力度 ${powerPercent}% · 铜钱翻转中`
    : disabled
      ? disabledLabel
      : `按住铜钱上拉，松手投第 ${progress + 1} 爻`;
  const forceLabel = tossing
    ? `本次力度 ${powerPercent}%`
    : options.lockText
      ? "待审题"
    : last?.power
      ? `上次力度 ${last.power}%`
      : "上拉蓄力";
  const renderCoin = (coin, index) => {
    const glyphs = coin === 3 ? ["乾", "隆", "通", "宝"] : ["宝", "泉", "通", "宝"];
    const face = getLiuyaoCoinFaceLabel(coin);
    const mark = showFaces ? face : "待";
    return `
      <span class="liuyao-coin-token ${coin === 3 ? "is-head" : "is-tail"}" style="--d:${index * 0.1}s" aria-label="${showFaces ? `${face}面铜钱` : "待落地铜钱"}">
        <span class="liuyao-coin ${coin === 3 ? "is-yang" : "is-yin"}">
          <i class="coin-glyph is-top">${glyphs[0]}</i>
          <i class="coin-glyph is-right">${glyphs[1]}</i>
          <b aria-hidden="true"></b>
          <i class="coin-glyph is-bottom">${glyphs[2]}</i>
          <i class="coin-glyph is-left">${glyphs[3]}</i>
        </span>
        <em class="liuyao-coin-mark">${mark}</em>
      </span>
    `;
  };
  return `
    <div class="liuyao-coin-stage ${options.modal ? "is-modal" : ""} ${last ? "has-cast" : ""} ${tossing ? "is-tossing" : ""} ${disabled ? "is-disabled" : ""}"
      data-action="liuyao-swipe-cast"
      role="button"
      tabindex="${disabled ? "-1" : "0"}"
      aria-label="${escapeHtml(label)}"
      aria-disabled="${disabled ? "true" : "false"}"
      style="--pull-y:0px;--drag-rot:0deg;--drag-rot-neg:0deg;--power:${powerRatio.toFixed(2)};--power-fill:${meterRatio.toFixed(2)};--throw-y:${throwY}px;">
      ${coins.map(renderCoin).join("")}
      <span class="liuyao-power-meter" aria-hidden="true"><i></i></span>
      <span class="liuyao-force-label">${escapeHtml(forceLabel)}</span>
      <span class="liuyao-swipe-cue">${escapeHtml(label)}</span>
    </div>
    ${showFaces ? renderLiuyaoCoinFaceStrip(coins, tossing ? "即将落地" : `第 ${progress} 爻`) : '<div class="liuyao-coin-face-strip is-empty"><span>上拉后显示正反</span></div>'}
  `;
}

function getLiuyaoQuestionInputValue(state) {
  const question = state.question || LIUYAO_DEFAULT_QUESTION;
  if (getWentianLanguageCode() === "en" && question === LIUYAO_DEFAULT_QUESTION) {
    return translateWentianText(question, "en");
  }
  return question;
}

function getLiuyaoCastLines(state = getLiuyaoState()) {
  return state.casts.map(normalizeLiuyaoCast).map((cast, index) => cast ? {
    ...getLiuyaoLineType(cast.value),
    index,
    label: LIUYAO_LINE_LABELS[index],
    coins: cast.coins || [],
    manual: Boolean(cast.manual),
    at: cast.at,
    power: cast.power,
  } : null);
}

function renderLiuyaoCoinSummary(state, options = {}) {
  const progress = getLiuyaoProgress(state);
  const last = getLiuyaoValidCasts(state).at(-1);
  const disabled = Boolean(options.disabled || options.complete);
  const tossing = liuyaoTossAnimation?.active && state.mode === "online";
  const title = options.complete ? "六爻已成" : progress ? `已落第 ${progress} 爻` : "三枚铜钱待落地";
  const desc = last
    ? `上次力度 ${last.power || 0}% · ${last.coins.map(getLiuyaoCoinFaceLabel).join(" ")}`
    : "进入全屏投币，铜钱落地后直接显示正反。";
  return `
    <div class="liuyao-coin-summary ${disabled ? "is-disabled" : ""}">
      <div>
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(tossing ? "抛币中…" : (options.complete ? "卦已成" : `第 ${progress + 1} 爻待投`))}</strong>
        <em>${escapeHtml(desc)}</em>
      </div>
      ${last ? renderLiuyaoCoinFaceStrip(last.coins, `第 ${progress} 爻`) : ""}
      <button type="button" data-action="liuyao-open-caster" ${disabled ? "disabled" : ""}>${escapeHtml(options.lockText || (tossing ? "查看落币" : "全屏投币"))}</button>
    </div>
  `;
}

function renderLiuyaoCasterModal(state, options = {}) {
  if (!liuyaoCastModalOpen || state.mode !== "online") return "";
  const progress = getLiuyaoProgress(state);
  const complete = progress >= 6 || options.complete;
  if (complete) return "";
  const tossing = liuyaoTossAnimation?.active && state.mode === "online";
  const lines = getLiuyaoCastLines(state);
  const landingIndex = liuyaoTossAnimation?.active ? liuyaoTossAnimation.lineIndex : progress - 1;
  const last = getLiuyaoValidCasts(state).at(-1);
  return `
    <div class="liuyao-caster-modal" role="dialog" aria-modal="true" aria-label="在线投币">
      <div class="liuyao-caster-head">
        <button type="button" data-action="liuyao-close-caster" aria-label="关闭投币">‹</button>
        <div>
          <span>在线投币</span>
          <strong>${escapeHtml(tossing ? `第 ${progress + 1} 爻落地中` : `投第 ${progress + 1} 爻`)}</strong>
        </div>
        <div class="liuyao-caster-actions">
          <button class="liuyao-caster-reset" type="button" data-action="liuyao-reset" ${tossing ? "disabled" : ""}>清空重来</button>
          <em>${escapeHtml(tossing ? "铜钱翻转" : "上拉松手")}</em>
        </div>
      </div>
      <div class="liuyao-caster-body">
        ${renderLiuyaoCoinRow(state, { ...options, complete, modal: true })}
      </div>
      <div class="liuyao-caster-result">
        <div>
          <span>${escapeHtml(last ? "上次落地" : "落地记录")}</span>
          <strong>${escapeHtml(last ? `${last.coins.map(getLiuyaoCoinFaceLabel).join(" ")} · ${getLiuyaoLineType(last.value).name}` : "等待第一个落爻")}</strong>
        </div>
        ${renderLiuyaoHexStack(lines, { id: "cast-modal", compact: true, landingIndex })}
      </div>
    </div>
  `;
}

function renderLiuyaoResetConfirm() {
  if (!liuyaoResetConfirmOpen) return "";
  return `
    <div class="liuyao-reset-confirm" role="dialog" aria-modal="true" aria-label="确认清空重来">
      <div class="liuyao-reset-confirm-card">
        <strong>清空重来？</strong>
        <p>当前已投的爻会清空，回到重新起卦。</p>
        <div>
          <button type="button" data-action="liuyao-reset-cancel">取消</button>
          <button type="button" class="primary" data-action="liuyao-reset-confirm">确认清空</button>
        </div>
      </div>
    </div>
  `;
}

function renderLiuyaoManualCoinInput(state, options = {}) {
  const disabled = Boolean(options.disabled);
  const casts = Array.from({ length: 6 }, (_, index) => normalizeLiuyaoCast(state.casts[index]));
  const nextIndex = casts.findIndex((cast) => !cast);
  const complete = nextIndex < 0 && casts.every(Boolean);
  const activeIndex = complete ? -1 : nextIndex;
  const currentIndex = activeIndex >= 0 ? activeIndex : 5;
  const currentCoins = activeIndex >= 0 ? getLiuyaoManualCoins(state, currentIndex) : [];
  const currentCoinCount = currentCoins.filter(Boolean).length;
  const currentCast = makeLiuyaoManualCastFromCoins(currentCoins);
  const completedRows = casts
    .map((cast, lineIndex) => ({ cast, lineIndex, type: cast ? getLiuyaoLineType(cast.value) : null }))
    .filter((item) => item.cast && item.type);
  const renderFaceButton = (lineIndex, coinIndex, value, current) => `
    <button
      type="button"
      class="${current === value ? "is-active" : ""}"
      data-action="liuyao-manual-coin"
      data-line-index="${lineIndex}"
      data-coin-index="${coinIndex}"
      data-coin-face="${value}"
      ${disabled ? "disabled" : ""}
    >${getLiuyaoCoinFaceLabel(value)}</button>
  `;
  return `
    <div class="liuyao-manual-card ${disabled ? "is-disabled" : ""}">
      <div class="liuyao-manual-head">
        <div>
          <span>真实铜钱录入</span>
          <strong>按初爻到上爻，逐爻填三枚铜钱</strong>
        </div>
        <em>${getLiuyaoProgress(state)}/6</em>
      </div>
      <p>每次只录当前这一爻：现实中抛三枚铜钱，再按结果点正反；三枚录满后点确认进入下一爻。</p>
      ${complete ? `
        <div class="liuyao-manual-done">
          <strong>六爻已录完</strong>
          <span>可以查看卦象解读，或重录上一爻。</span>
          <button type="button" class="liuyao-manual-undo" data-action="liuyao-manual-clear-last" ${disabled ? "disabled" : ""}>重录上一爻</button>
        </div>
      ` : `
        <div class="liuyao-manual-current">
          <div class="liuyao-manual-current-head">
            <div>
              <strong>${LIUYAO_LINE_LABELS[currentIndex]}</strong>
              <span>第 ${currentIndex + 1}/6 爻</span>
            </div>
            <em>${currentCoinCount}/3</em>
          </div>
          <div class="liuyao-manual-status">${currentCoinCount >= 3 ? `本爻已成：${currentCast?.value || ""} ${currentCast ? getLiuyaoLineType(currentCast.value).name : ""}。确认后进入下一爻。` : "抛三枚铜钱后，依次录入第 1、2、3 枚。"}</div>
          <div class="liuyao-manual-coins">
            ${[0, 1, 2].map((coinIndex) => `
              <div class="liuyao-manual-coin-pick">
                <i>第 ${coinIndex + 1} 枚</i>
                <span>
                  ${renderFaceButton(currentIndex, coinIndex, 3, currentCoins[coinIndex])}
                  ${renderFaceButton(currentIndex, coinIndex, 2, currentCoins[coinIndex])}
                </span>
              </div>
            `).join("")}
          </div>
          <div class="liuyao-manual-current-actions">
            <button type="button" class="liuyao-manual-clear" data-action="liuyao-manual-clear-line" data-line-index="${currentIndex}" ${disabled || !currentCoins.some(Boolean) ? "disabled" : ""}>清空本爻</button>
            <button type="button" class="liuyao-manual-confirm" data-action="liuyao-manual-confirm-line" data-line-index="${currentIndex}" ${disabled || !currentCast ? "disabled" : ""}>${currentIndex >= 5 ? "确认成卦" : "确认本爻"}</button>
          </div>
        </div>
      `}
      ${completedRows.length ? `
        <div class="liuyao-manual-history">
          <span>已录入</span>
          <div>
            ${completedRows.map(({ cast, lineIndex, type }) => `<i>${LIUYAO_LINE_LABELS[lineIndex]} ${cast.value}${type.name}${type.mark ? type.mark : ""}</i>`).join("")}
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function sourceLiuyaoCastScreen() {
  const state = getLiuyaoState();
  const casts = state.casts.map(normalizeLiuyaoCast);
  const lines = getLiuyaoCastLines(state);
  const progress = getLiuyaoProgress(state);
  const complete = progress === 6 && casts.length >= 6 && casts.every(Boolean);
  const tossing = liuyaoTossAnimation?.active && state.mode === "online";
  const gateBusy = liuyaoQuestionGateLoading;
  const actionBusy = tossing || gateBusy;
  const question = normalizeLiuyaoQuestion(state.question);
  const gate = normalizeLiuyaoQuestionGate(state.questionGate, question);
  const questionReady = Boolean(gate?.allowed);
  const questionLockText = gateBusy ? "审题中，稍候开放" : "提交通过后开放投币";
  const manualPendingCast = state.mode === "manual" && progress < 6
    ? makeLiuyaoManualCastFromCoins(getLiuyaoManualCoins(state, progress))
    : null;
  const completeResult = complete ? getLiuyaoResult(state) : null;
  const completeMovingText = completeResult ? formatLiuyaoMovingLineText(completeResult.movingLines) : "无";
  const screenHeight = getLiuyaoCastScreenHeight();
  const casterOptions = { complete, disabled: gateBusy || !questionReady, lockText: questionReady ? "" : questionLockText };
  if (state.mode === "online" && liuyaoCastModalOpen && !complete) {
    return `
      ${renderLiuyaoCasterModal(state, casterOptions)}
      ${renderLiuyaoResetConfirm()}
    `;
  }
  return `
    ${figBox("ly17-bg", 0, 0, 390, screenHeight, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 50%,#f3eadc 100%);")}
    ${wentianSimpleHeader("ly17", "六爻占卜")}
    <button class="liuyao-top-reset" type="button" data-action="liuyao-reset">重来</button>
    <section class="liuyao-panel">
      <div class="liuyao-question-card liuyao-ask-card">
        <div class="liuyao-ask-head">
          <strong>先定一问，再起六爻</strong>
        </div>
        <label for="liuyao-question">所问之事</label>
        <textarea id="liuyao-question" maxlength="${LIUYAO_QUESTION_MAX_LENGTH}" rows="2" placeholder="一句话写清楚所问，例如：本月是否推进某个项目？">${escapeHtml(getLiuyaoQuestionInputValue(state))}</textarea>
        <div class="liuyao-question-review-row">
          ${renderLiuyaoQuestionGateStatus(state)}
          ${renderLiuyaoQuestionSubmit(state)}
        </div>
      </div>
      <div class="liuyao-mode-card">
        <span>起卦方式</span>
        <div>
          <button type="button" class="${state.mode === "online" ? "is-active" : ""}" data-action="liuyao-mode" data-mode="online">在线投币</button>
          <button type="button" class="${state.mode === "manual" ? "is-active" : ""}" data-action="liuyao-mode" data-mode="manual">手动起卦</button>
        </div>
      </div>
      ${state.mode === "online" ? `
        <div class="liuyao-coin-panel ${questionReady ? "is-ready" : "is-waiting"}">
          <div class="liuyao-coin-panel-head">
            <span>在线投币</span>
            <strong>${complete ? "卦已成" : `第 ${progress + 1} 爻`}</strong>
          </div>
          ${renderLiuyaoCoinSummary(state, { complete, disabled: gateBusy || !questionReady, lockText: questionReady ? "" : questionLockText })}
        </div>
      ` : ""}
      ${state.mode === "manual" ? renderLiuyaoManualCoinInput(state, { disabled: gateBusy || !questionReady }) : ""}
      <div class="liuyao-actions ${complete || (!complete && !questionReady && !gateBusy) ? "is-single" : ""}">
        ${complete ? `
          <button type="button" class="primary" data-action="liuyao-show-result">查看卦象解读</button>
        ` : state.mode === "online" ? `
          ${gateBusy || questionReady ? `<button type="button" class="primary" data-action="liuyao-open-caster" ${actionBusy || !questionReady ? "disabled" : ""}>${gateBusy ? "审题中…" : tossing ? "抛币中…" : `全屏投第 ${progress + 1} 爻`}</button>` : ""}
          <button type="button" data-action="liuyao-reset" ${gateBusy ? "disabled" : ""}>清空重排</button>
        ` : `
          ${gateBusy || questionReady ? `<button type="button" class="primary" ${progress === 6 && !actionBusy && questionReady ? 'data-action="liuyao-show-result"' : "disabled"}>${gateBusy ? "审题中…" : progress === 6 ? "查看卦象解读" : manualPendingCast ? "先确认本爻" : "按下方录满六爻"}</button>` : ""}
          <button type="button" data-action="liuyao-reset" ${gateBusy ? "disabled" : ""}>清空重排</button>
        `}
      </div>
      <div class="liuyao-progress-card">
        <div class="liuyao-progress-head">
          <strong>${complete ? "卦已成" : `已成 ${progress}/6 爻`}</strong>
          <span>${formatWentianDateTime(new Date(state.createdAt || Date.now()))}</span>
        </div>
        ${completeResult ? `
          <div class="liuyao-progress-result">
            <div>
              <span>本卦</span>
              <strong>${escapeHtml(completeResult.primary?.name || "本卦")}</strong>
              <em>${escapeHtml(formatLiuyaoHexMeta(completeResult.primary))}</em>
            </div>
            <div>
              <span>变卦</span>
              <strong>${escapeHtml(completeResult.changed?.name || "变卦")}</strong>
              <em>${escapeHtml(formatLiuyaoHexMeta(completeResult.changed))}</em>
            </div>
            <b>动爻：${escapeHtml(completeMovingText)}</b>
          </div>
        ` : ""}
        ${tossing ? `<p class="liuyao-casting-status">本次力度 ${Math.max(18, Math.min(100, Number(liuyaoTossAnimation.power) || 62))}%；铜钱翻转 1 秒后落入第 ${progress + 1} 爻。</p>` : ""}
        ${renderLiuyaoHexStack(lines, { id: "cast" })}
      </div>
    </section>
    ${renderLiuyaoCasterModal(state, casterOptions)}
    ${renderLiuyaoResetConfirm()}
  `;
}

function sourceLiuyaoResultScreen() {
  const result = getLiuyaoResult();
  if (!result) {
    return `
      ${figBox("ly20-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("ly20", "六爻结果")}
      <section class="liuyao-panel">
        <div class="liuyao-empty-card">
          <strong>尚未完成起卦</strong>
          <span>请先投满六爻，或用手动起卦补全六爻。</span>
          <button type="button" data-route="screen-17">返回起卦</button>
        </div>
      </section>
    `;
  }
  const heroCueText = formatLiuyaoMovingLineText(result.movingLines, "动爻：");
  const screenHeight = getLiuyaoResultScreenHeight();
  return `
    ${figBox("ly20-bg", 0, 0, 390, screenHeight, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 54%,#f3eadc 100%);")}
    ${wentianSimpleHeader("ly20", result.primary.name)}
    <section class="liuyao-panel liuyao-result-panel">
      <div class="liuyao-result-hero">
        <span>本卦</span>
        <strong>${escapeHtml(result.primary.name)}</strong>
        <em>${escapeHtml(formatLiuyaoHexMeta(result.primary))}</em>
        <b>${escapeHtml(heroCueText)}</b>
      </div>
      <div class="liuyao-result-pair">
        <article class="is-image-card">
          <span>本卦</span>
          <div class="liuyao-result-card-title">
            <strong>${escapeHtml(result.primary.name)}</strong>
            ${renderLiuyaoMiniHex(result.lines, { label: `本卦六爻：${result.primary.name}` })}
          </div>
          ${renderLiuyaoHexImage(result.primary, "本卦")}
          <em>${escapeHtml(formatLiuyaoHexMeta(result.primary))}</em>
        </article>
        <article class="is-image-card">
          <span>变卦</span>
          <div class="liuyao-result-card-title">
            <strong>${escapeHtml(result.changed.name)}</strong>
            ${renderLiuyaoMiniHex(result.lines, { changed: true, label: `变卦六爻：${result.changed.name}` })}
          </div>
          ${renderLiuyaoHexImage(result.changed, "变卦")}
          <em>${escapeHtml(formatLiuyaoHexMeta(result.changed))}</em>
        </article>
      </div>
      <div class="liuyao-reading-card">
        <span>所问</span>
        <strong>${escapeHtml(result.question)}</strong>
      </div>
      <div class="liuyao-actions">
        <button type="button" class="primary" data-action="liuyao-ask-xu">追问许半仙</button>
        <button type="button" data-action="liuyao-reset">重新起卦</button>
      </div>
    </section>
  `;
}

function getLiuyaoResultScreenHeight() {
  const result = getLiuyaoResult();
  if (!result) return 844;
  const questionLength = Array.from(result.question || "").length;
  const extraLines = Math.max(0, Math.ceil((questionLength - 24) / 20));
  return Math.min(860, 660 + extraLines * 22);
}

function makeLiuyaoXuContext(result = getLiuyaoResult()) {
  if (!result) return null;
  const state = getLiuyaoState();
  if (!isWentianUuid(state.recordId)) {
    state.recordId = result.recordId || makeWentianUuid();
    saveLiuyaoState();
  }
  const primaryReading = getLiuyaoHexReading(result.primary);
  const changedReading = getLiuyaoHexReading(result.changed);
  const movingText = formatLiuyaoMovingLineText(result.movingLines);
  const primaryTip = firstReadableSentence(primaryReading.summary, "先看本卦所处局面。");
  const changedTip = result.movingLines.length
    ? firstReadableSentence(changedReading.summary, "变卦看后续走向。")
    : "无动爻时变卦与本卦同体，重在守当前局面。";
  const advice = getLiuyaoTopicAdvice(result.question, result);
  const primaryText = `第${result.primary.no || "-"}卦 ${result.primary.name || ""}（${result.primary.upper?.name || ""}上${result.primary.lower?.name || ""}下）`;
  const changedText = `第${result.changed.no || "-"}卦 ${result.changed.name || ""}（${result.changed.upper?.name || ""}上${result.changed.lower?.name || ""}下）`;
  const linesText = result.lines
    .map((line) => `${line.label}:${line.value}${line.name}${line.mark ? line.mark : ""}`)
    .join("；");
  return {
    type: "liuyao",
    recordId: state.recordId,
    title: `六爻占卜：${result.primary.name}${result.movingLines.length ? ` 之 ${result.changed.name}` : ""}`,
    summaryLine: movingText,
    question: result.question,
    createdAt: result.createdAt,
    castAtText: formatWentianDateTime(new Date(result.createdAt || Date.now())),
    primaryText,
    changedText,
    movingText,
    linesText,
    primaryTip,
    changedTip,
    advice,
  };
}

function getLiuyaoXuOpeningMessage(context) {
  if (!context) return "我按这卦看这件事。你可以继续问成败、应期、动爻或行动取舍。";
  const cleanQuestion = String(context.question || "所问之事").replace(/[？?。.!！]+$/g, "");
  return [
    "我按这卦看这件事。",
    `你刚才占问：「${cleanQuestion}」。`,
    `卦象：${context.primaryText || "本卦"}${context.changedText ? `，变卦 ${context.changedText}` : ""}，动爻：${context.movingText || "无"}。`,
    "可以继续问这件事能不能成、什么时候动、该进该退，或具体怎么做。"
  ].join("\n");
}

function openLiuyaoXuChat() {
  const context = makeLiuyaoXuContext();
  if (!context) {
    navigate("screen-17", false);
    return;
  }
  setWentianXuChatContext(context);
  navigate("screen-4");
}

function canUseLiuyaoSwipeCaster(target) {
  if (!target || target.getAttribute("aria-disabled") === "true") return false;
  if (liuyaoQuestionGateLoading) return false;
  const state = getLiuyaoState();
  const question = normalizeLiuyaoQuestion(state.question);
  const gate = normalizeLiuyaoQuestionGate(state.questionGate, question);
  return Boolean(gate?.allowed) && state.mode === "online" && getLiuyaoProgress(state) < 6 && !liuyaoTossAnimation?.active;
}

function getLiuyaoSwipeMetrics(event, start = liuyaoSwipeStart) {
  if (!start) return { deltaX: 0, deltaY: 0, pull: 0, power: 0, ready: false, duration: 0 };
  const deltaX = event.clientX - start.x;
  const deltaY = event.clientY - start.y;
  const pull = Math.max(0, Math.min(LIUYAO_PULL_MAX, Math.round(-deltaY)));
  const power = Math.max(0, Math.min(1, pull / LIUYAO_PULL_MAX));
  const powerPercent = Math.round(power * 100);
  const horizontalTolerance = Math.max(34, pull * 1.35);
  return {
    deltaX,
    deltaY,
    pull,
    power,
    ready: powerPercent >= Math.round(LIUYAO_READY_POWER * 100) && Math.abs(deltaX) <= horizontalTolerance,
    duration: Date.now() - (start.startedAt || Date.now()),
  };
}

function updateLiuyaoSwipeCasterUi(start, metrics) {
  const target = start?.target;
  if (!target) return;
  if (!start.lastMetrics || metrics.pull >= start.lastMetrics.pull) start.lastMetrics = metrics;
  const progress = getLiuyaoProgress();
  const powerPercent = Math.round(metrics.power * 100);
  target.style.setProperty("--pull-y", `${Math.round(-metrics.pull * 0.38)}px`);
  target.style.setProperty("--power", metrics.power.toFixed(2));
  target.style.setProperty("--power-fill", Math.min(1, metrics.pull / LIUYAO_SWIPE_THRESHOLD).toFixed(2));
  target.style.setProperty("--drag-rot", `${Math.round(metrics.power * 420)}deg`);
  target.style.setProperty("--drag-rot-neg", `${Math.round(metrics.power * -420)}deg`);
  target.classList.toggle("is-ready", metrics.ready);
  const cue = target.querySelector(".liuyao-swipe-cue");
  if (cue) cue.textContent = metrics.ready
    ? `力度 ${powerPercent}% · 松手投第 ${Math.min(progress + 1, 6)} 爻`
    : `继续上拉蓄力 · ${powerPercent}%`;
  const force = target.querySelector(".liuyao-force-label");
  if (force) force.textContent = `力度 ${powerPercent}%`;
}

function resetLiuyaoSwipeCasterUi(target) {
  if (!target) return;
  const state = getLiuyaoState();
  const last = getLiuyaoValidCasts(state).at(-1);
  const progress = getLiuyaoProgress(state);
  const complete = progress >= 6;
  target.style.setProperty("--pull-y", "0px");
  target.style.setProperty("--power", "0");
  target.style.setProperty("--power-fill", "0");
  target.style.setProperty("--drag-rot", "0deg");
  target.style.setProperty("--drag-rot-neg", "0deg");
  const cue = target.querySelector(".liuyao-swipe-cue");
  if (cue) cue.textContent = complete ? "卦已成" : `按住铜钱上拉，松手投第 ${progress + 1} 爻`;
  const force = target.querySelector(".liuyao-force-label");
  if (force) force.textContent = last?.power ? `上次力度 ${last.power}%` : "上拉蓄力";
}

function handleLiuyaoSwipePointerDown(event) {
  const target = event.target.closest?.('[data-action="liuyao-swipe-cast"]');
  if (!canUseLiuyaoSwipeCaster(target)) return;
  liuyaoSwipeStart = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    target,
    startedAt: Date.now(),
  };
  target.style.setProperty("--pull-y", "0px");
  target.style.setProperty("--power", "0");
  target.style.setProperty("--power-fill", "0");
  target.style.setProperty("--drag-rot", "0deg");
  target.style.setProperty("--drag-rot-neg", "0deg");
  target.classList.add("is-dragging");
  target.classList.remove("is-ready", "is-prompting");
  target.setPointerCapture?.(event.pointerId);
  updateLiuyaoSwipeCasterUi(liuyaoSwipeStart, getLiuyaoSwipeMetrics(event));
}

function handleLiuyaoSwipePointerMove(event) {
  if (!liuyaoSwipeStart || liuyaoSwipeStart.pointerId !== event.pointerId) return;
  const metrics = getLiuyaoSwipeMetrics(event);
  updateLiuyaoSwipeCasterUi(liuyaoSwipeStart, metrics);
  if (metrics.pull > 8) event.preventDefault();
}

function handleLiuyaoSwipePointerUp(event) {
  if (!liuyaoSwipeStart || liuyaoSwipeStart.pointerId !== event.pointerId) return;
  const start = liuyaoSwipeStart;
  const { target } = start;
  const releaseMetrics = getLiuyaoSwipeMetrics(event, start);
  const metrics = start.lastMetrics && start.lastMetrics.pull > releaseMetrics.pull
    ? { ...releaseMetrics, ...start.lastMetrics, duration: releaseMetrics.duration }
    : releaseMetrics;
  target.classList.remove("is-dragging");
  target.classList.remove("is-ready");
  target.releasePointerCapture?.(event.pointerId);
  liuyaoSwipeStart = null;
  if (metrics.ready) {
    event.preventDefault();
    startLiuyaoAnimatedToss(metrics);
  } else {
    resetLiuyaoSwipeCasterUi(target);
  }
}

function cancelLiuyaoSwipePointer(event) {
  if (!liuyaoSwipeStart || (event?.pointerId && liuyaoSwipeStart.pointerId !== event.pointerId)) return;
  const target = liuyaoSwipeStart.target;
  target?.classList.remove("is-dragging", "is-ready");
  resetLiuyaoSwipeCasterUi(target);
  liuyaoSwipeStart = null;
}

const YANGZHAI_STORAGE_KEY = "wentian-yangzhai-state-v1";
const YANGZHAI_STATE_VERSION = 3;
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
  { label: "长子", short: "长子", type: "family" },
  { label: "长女", short: "长女", type: "family" },
  { label: "二子", short: "二子", type: "family" },
  { label: "二女", short: "二女", type: "family" },
  { label: "三子", short: "三子", type: "family" },
  { label: "三女", short: "三女", type: "family" },
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
const YANGZHAI_GRID_X = 20;
const YANGZHAI_GRID_Y = 136;
const YANGZHAI_CELL_W = 116;
const YANGZHAI_CELL_H = 149;
const YANGZHAI_GRID_W = YANGZHAI_CELL_W * 3;
const YANGZHAI_GRID_H = YANGZHAI_CELL_H * 3;
const YANGZHAI_CELL_HEADER_H = 52;
const YANGZHAI_ACTION_Y = 606;
const YANGZHAI_RESULT_GRID_Y = 136;
const YANGZHAI_RESULT_CELL_H = 95;
const YANGZHAI_RESULT_ACTION_Y = 444;
const YANGZHAI_RESULT_TITLE_Y = 524;
const YANGZHAI_RESULT_START_Y = 562;
const YANGZHAI_RESULT_CARD_HEIGHT = 180;
const YANGZHAI_RESULT_GAP = 14;
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
    meaning: "厨房：刀象。",
    preference: "厨房在坎位或兑位最佳。",
    preferredPalaces: ["kan", "dui"],
    source: "《天纪学习笔记》阳宅基础",
    original: "厨房：刀象。厨房在坎位或兑位最佳。因为水是险。"
  },
  厕所: {
    meaning: "卫生间：是非、口舌、官司、破财。",
    preference: "厕所应该放在八方、二十四山之间不重要的位置。",
    preferredPalaces: [],
    source: "《天纪学习笔记》阳宅基础",
    original: "卫生间：是非、口舌、官司、破财。厕所应该放在八方、二十四山之间不重要的位置。"
  },
  客厅: {
    meaning: "客厅：如客人。",
    preference: "客厅放在坤位最好。",
    preferredPalaces: ["kun"],
    source: "《天纪学习笔记》阳宅基础",
    original: "客厅：如客人。客厅放在坤位最好。因为母亲要住地天泰。"
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
  1: {"quote":"此卦出現，官人逢之舉步青雲，心想事成，發達時往往比平常快，且越級晉升。","original":"此卦出現，官人逢之舉步青雲，心想事成，發達時往往比平常快，且越級晉升。商人逢之，為做生意當老闆之人，財多祿豐，領導統御手段來自天生好手，能當機立斷，掌握時機，成就不可限量。對於家庭，有強烈之責任感，為一良好丈夫，賢能的父親，但須切記，必須正名之人，即其正式負責人居之，乃可成此卦。如為未婚人，不可能出現此卦。","source":"《地脉道》地理篇"},
  2: {"quote":"此格在陽宅上出現，就如易之言地厚能載物一樣，已婚女人才有，其包含寡居，...","original":"此格在陽宅上出現，就如易之言地厚能載物一樣，已婚女人才有，其包含寡居，且有子女同住，此局方現。代表意義為婚姻主破散，孤軍奮戰，肩負一家之重任，夫宮不得志造成此果，如以事業上論，則官家掌權，商人賺錢易如反掌，女中強人型，其志過丈夫，無人能及，但缺點為到老孤單無子女願居身側，因個性會趨於孤僻。婚破後，不再有婚，何時婚破須看命，運只有佔一半並非全部。","source":"《地脉道》地理篇"},
  3: {"quote":"此卦為次子卦，時機在長子未婚，且同居一處，方可論之，一旦長子或本人結婚...","original":"此卦為次子卦，時機在長子未婚，且同居一處，方可論之，一旦長子或本人結婚，此局立消，切記。次子居此，則比長子早婚，比同時出生之人早二年結婚，但有禁忌，如肖狗或狄姓之人，主夭折，此卦大凶，又逢犬年加凶，肖牛人，必任妻擺佈，背離家庭，不顧父母。所以如其他人成此局，只不過早婚而已，對犬、牛人主凶，不利。","source":"《地脉道》地理篇"},
  4: {"quote":"陽宅上此局出現，必有三子居家中，且未婚，排行第三兒子，出此局其造成：一...","original":"陽宅上此局出現，必有三子居家中，且未婚，排行第三兒子，出此局其造成：一、以蒙蔽之法欺家人，惟利是圖。二、本身愚昧，不知進退。三、性剛不聽兄長之言，獨行獨斷。四、較次子早婚，較長子晚婚。五、比同時生人早七年婚。六、常喜賭博性之錢祿，故往往求財遇險之象。","source":"《地脉道》地理篇"},
  5: {"quote":"此卦出現，代表其人智慧成長快速，勢必超越同年紀同時生人多多，且個性剛烈...","original":"此卦出現，代表其人智慧成長快速，勢必超越同年紀同時生人多多，且個性剛烈，不受建言，須注意，如長兄一旦結婚，此局立消，局自長兄婚之日始，立變為雷天大壯收局。需卦局所表現的意義如後：一、婚事延後七年，且單歲婚。二、如逢八字中，喜慶逢凶，必入宗教或不婚。三、婚時，妻必為改嫁之人。四、於事業上，必有大成，年少居權位，受重用，進退有據。","source":"《地脉道》地理篇"},
  6: {"quote":"此局令人官司不斷，訴訟纏身，或為好訟之徒。","original":"此局令人官司不斷，訴訟纏身，或為好訟之徒。一旦離婚此局方破，否則你只好改變臥房位置，方可脫離此局之限。一、官人居此局，升官慢五年，諸事不順，即令不違法，亦受他人連累。二、商人居此局，財祿不進，必須興訟方可得財。三、夫妻婚姻主破，訴訟離婚，此須看命，如命中有，則必成格；如命中沒有，則不成格。","source":"《地脉道》地理篇"},
  7: {"quote":"此局大異其趣，吾人常見潑婦罵街，女人性剛，甚而與人毆打，其局如此，生人...","original":"此局大異其趣，吾人常見潑婦罵街，女人性剛，甚而與人毆打，其局如此，生人如此，亦為妙矣。當你發現母親如此，兇暴，易與人起爭端，仇視外人，其皆由此局產生的，當須化解，方可平安。一、對婚事必凶，有妻毆夫之象。二、事業上，亦不得志，常生糾紛，男命女身。三、獨來獨往，膽大過人。四、從商主破婚，得財，尤利虎、馬、羊三人，其商機、官運亨通，但婚則凶，各有利弊。","source":"《地脉道》地理篇"},
  8: {"quote":"此卦出現，須長兄為未婚，一旦長兄婚，此局立變為豫卦，須注意變局將如何，...","original":"此卦出現，須長兄為未婚，一旦長兄婚，此局立變為豫卦，須注意變局將如何，則看長兄之命，何時有婚，知何時生變局，此即陽宅上可見未來之象。此卦有親比之意。一、性喜從母事，且任勞任怨，家事一手包辦，與母連心。二、適婚年齡到時，喜歡比自己年長於己之女人，如命中同時生人為二十八歲婚，但此局人婚必延後三年到三十一歲才婚，且娶年長於己之女人方合格，否則婚主破散，不出一年。","source":"《地脉道》地理篇"},
  9: {"quote":"此卦局，著重於事業，不重於婚姻，凡家有女兒皆易成此局，卦局之判讀，請參...","original":"此卦局，著重於事業，不重於婚姻，凡家有女兒皆易成此局，卦局之判讀，請參閱錄影教學帶，此處不言。一、女代父職，且能力強過男人，獨立自主，不依賴他人。二、事業企圖心旺盛，早年為老闆，事業有成。三、婚事方面，須與命同參，如同時生人為二十八歲婚，而此陽宅局之人會提前二年結婚。如同時生人婚姻不成主有婚必破，此局之人必終身不嫁，全心在事業上發展，成為一女強人。","source":"《地脉道》地理篇"},
  10: {"quote":"女人無履，唯男人有之，此局可見男女之本性不同，女人外似柔弱但一遇進退兩...","original":"女人無履，唯男人有之，此局可見男女之本性不同，女人外似柔弱但一遇進退兩難之時，卻往往比男人果決，男人外似剛強，但遇險事卻往往躑躅不前，成履卦。一、事業上常有欲進不得，退之又凶，居進退兩難之局，其事勢如此，而其性亦如此，其解常靠女人決定之。二、官運不通，停滯不前。三、商機不利，運氣不佳，取捨之間，因時機已誤，喪失良好機會，徒於事懊惱而已，於事無補。","source":"《地脉道》地理篇"},
  11: {"quote":"此名為泰卦，有否極泰來，安泰舒適之象。","original":"此名為泰卦，有否極泰來，安泰舒適之象。每逢有已婚女向本人求教之時，我都以此卦教之，令改，促進夫妻和睦乃吾道中人之一大職責，此功德無量。此局大吉，無論於婚姻、事業、健康及教育子女上，都有卓越之表現，為一賢妻良母。一、於婚姻，主一世夫妻，白首到老。二、於事業，在家相夫教子亦為事業。在公事上，進退有據，受人重用，必不待言，其心想事成。","source":"《地脉道》地理篇"},
  12: {"quote":"惟男人有之，此男女本性之不同，亦可於此卦局窺見之，男人之性過剛於女，自...","original":"惟男人有之，此男女本性之不同，亦可於此卦局窺見之，男人之性過剛於女，自尊好強之心，又顯現無遺，往往天性上，有欲大力小之性而不自知，不知己之才能如何，妄度不知量進，乃終成否卦。常見個性如此之人居否局，而不自知，仍自以為是，故終其一生必無成就，每日只知怨天尤人，嘆時不利己，己不逢時而已。","source":"《地脉道》地理篇"},
  13: {"quote":"此局在陽宅上亦妙不可言，學者切勿分辨錯誤，須仔細分詳，以免誤人而不自知。","original":"此局在陽宅上亦妙不可言，學者切勿分辨錯誤，須仔細分詳，以免誤人而不自知。一、官家人逢之，必主人和，手下得力，祿命九重來，平步青雲。二、商人逢之，財祿豐盛，但須二人合夥，方可成事，一人獨資勢必不成大器。三、自由業、服務業居此局，必主名氣大，聲名遠播，財祿亨通。","source":"《地脉道》地理篇"},
  14: {"quote":"吾人常見有未婚之女，嬌美如花，事業上功成名就，但婚姻不好，即此局之人。","original":"吾人常見有未婚之女，嬌美如花，事業上功成名就，但婚姻不好，即此局之人。一、性陽剛過人，倔強固執本性展現無遺。二、不重視婚姻，也不在乎婚姻，唯對子女獨有所鐘，有未婚生子之象，且不在乎人言，且主得二子。三、如遇命中婚姻順暢，則比同時生人要早三年成婚。四、命中事業旺，祖業大之人，再加上此局，勢必為女承父業之象，兄弟無力。","source":"《地脉道》地理篇"},
  15: {"quote":"謙卦九三爻位，勞謙，君子有終，有勞謙之美。","original":"謙卦九三爻位，勞謙，君子有終，有勞謙之美。史上如周公，為其代表。常見婦人，任勞任怨，居無所苦，謙以讓人，婦之賢德，表現無遺，且始終不變，即此卦局能成。一、必為賢妻良母之人無疑，但夫卦為遯，主夫妻不利，感情退化，所以常見有賢德之婦人，往往盡心盡力為家操心，結果卻無法挽回婚姻之善，但六十五歲以後不成此局。二、身體小病痛不斷，因勞成疾多有。","source":"《地脉道》地理篇"},
  16: {"quote":"成此卦局之男人，必有因祿遠行之象，大利肖馬之人。","original":"成此卦局之男人，必有因祿遠行之象，大利肖馬之人。一、居家中為母助，家事瑣碎，巨細靡遺，有男人能做一手好菜即此局之人。二、事業財官雙美平步青雲，惟與六親遠離，母有先喪之象。三、婚姻延後，此同時出生之人晚五年婚。四、事業上為良佐之人，任何老闆或主管任用之後，都將得幸有此人相助。五、婚事有娶二婚妻之象，或年長於己之小姐。","source":"《地脉道》地理篇"},
  17: {"quote":"此卦現代人最多見，吾人常見街上有女孩，女扮男裝或粗壯過一般女人之小姐，...","original":"此卦現代人最多見，吾人常見街上有女孩，女扮男裝或粗壯過一般女人之小姐，即此局之人。一、有女同性戀之傾向，其心念一直認為自己為男人，且不屑自己為男人，且不屑一顧周圍之男人，喜與女孩同出同入。二、全心於事業，為達目的不擇手段，有時位高且居天子或董事長之身側。三、如同時生人，命中婚姻吉祥，再加此局勢必嫁入富貴人家，且比同時生人，早婚四年，如對方不富有，終必散。","source":"《地脉道》地理篇"},
  18: {"quote":"三蟲聚一盤中，互相爭食，此成蠱象，吾人常見幾位女性同居一桌，東家長西家...","original":"三蟲聚一盤中，互相爭食，此成蠱象，吾人常見幾位女性同居一桌，東家長西家短的議論他人，此雖生是非之地，但並非成蠱卦，此卦在陽宅上惟見之於男人，此又男女之不同，女人之蠱，吾人可以立見，男人之蠱在心中，表面上不易看到。一、此局男人圖利野心至大，為達目的，往往不擇手段。二、主發科甲，讀書考試成績必超人一等。","source":"《地脉道》地理篇"},
  19: {"quote":"母居此局，因對象之卦為履，故有難為之象出現。","original":"母居此局，因對象之卦為履，故有難為之象出現。已婚婦人居此由於夫宮必無力，產生以下數種狀況：一、夫業受困，乃因妻之過剛，為求功心切，招致如此，請參考履卦。二、妻為委曲求全，而以力大居小，順從於夫可也。","source":"《地脉道》地理篇"},
  20: {"quote":"觀卦之精義在以靜觀可以洞悉周圍之事，黃帝之陰符經雲：「聾者善視。","original":"觀卦之精義在以靜觀可以洞悉周圍之事，黃帝之陰符經雲：「聾者善視。」即此意。但亦有缺失，豈不聞古言：「水至清則無魚，人至明則無徒」此卦唯長女可見，婚後局消。一、其明在過明，而產生以財富論定是否願意嫁人，造成如遇未有事業之男人，即使再愛也不願結婚，寧可做有錢人的偏房，不婚。二、如逢命格婚姻有凶，則有嫁二婚夫，且對方有子之人，但須比同時生人再加六年方成正式婚姻。","source":"《地脉道》地理篇"},
  21: {"quote":"成此之局法，請觀錄影帶說明，於此不累述。","original":"成此之局法，請觀錄影帶說明，於此不累述。吾人常見有女孩小時即喜歡咬人，勸之不聽，乃生噬嗑之象。一、此女性剛，報復手段常用咬的，平日嘮叨不停。二、婚姻對象為陰柔之男人。三、本身想法動作一如男人，且主少年有成，故常見年輕之影劇圈出身小姐，名氣很大，少年得志，都屬此局。四、婚事延後六年，故同時生人如為二十六歲婚，則此局人加六年，成為三十二歲婚。","source":"《地脉道》地理篇"},
  22: {"quote":"賁卦為求外飾之道，其之於人事，惟男人居此局中成格。","original":"賁卦為求外飾之道，其之於人事，惟男人居此局中成格。諸君試想一位堂堂男子漢，如果要外飾，其目的何在呢？因為有真內實之人，其心但求充實，必捨外飾之道，不會花心思刻意去修飾。君不見真正有錢，有高智慧之人，其外觀往往很零亂，甚至衣服反穿而不自知，其原因在他根本不想花心思在這方面，你有同感嗎？一、男身女態之象，性喜誇張矯作之服飾。","source":"《地脉道》地理篇"},
  23: {"quote":"剝有耗盡之象，有人家財萬貫，但出一子耗盡家財，所謂富不過三代，其因何在？","original":"剝有耗盡之象，有人家財萬貫，但出一子耗盡家財，所謂富不過三代，其因何在？有時見三老人，居老人院中，本是安養天年與世無爭，三人結拜兄弟後，長幼有序分列，此時如剝卦現，則其中一人必散盡三人之財務，終至引發自殺或仇殺事件，其因皆為財，世人但知為財殺，卻永遠無法深入瞭解，為何貪財如此？為何年至古稀，仍無法擺脫財利之惑？","source":"《地脉道》地理篇"},
  24: {"quote":"吾人常見已婚之婦人，婚事不佳，獨立支撐家運，允文允武，屬木蘭型之人，必...","original":"吾人常見已婚之婦人，婚事不佳，獨立支撐家運，允文允武，屬木蘭型之人，必為復卦之局。一、有女身男人性格之徵。二、此卦局尤利發武官，即軍、警、法、外交等工作之人。三、代夫出征，絲毫不讓鬚眉。四、此局發官人，不發商人，尤以肖虎、兔人大吉，更旺。","source":"《地脉道》地理篇"},
  25: {"quote":"此名無妄，猶無妄之災意，居此局之丈夫成此格，即令已離婚但有子女同住，只...","original":"此名無妄，猶無妄之災意，居此局之丈夫成此格，即令已離婚但有子女同住，只要象存在，其局不變。須注意此點。一、必須為從商較吉，但須防陰人暗客，有得財遇險之象，肖豬肖鼠人成格，主大財入，但皆有陰謀其中。二、如為公職人，則易流於利慾而挺身走險。三、求財招險事，住滿第二年，局再不動，必見之。四、性剛固執，不聽人言，故生小人，自亂陣腳。","source":"《地脉道》地理篇"},
  26: {"quote":"君不見有子為家不顧一切的工作，處處為家著想，甚至放棄婚事亦在所不惜，固...","original":"君不見有子為家不顧一切的工作，處處為家著想，甚至放棄婚事亦在所不惜，固然此象不一定在三子身上發生，但大畜卦必現於三子身上。一、代父之職守，負擔一家之生計。二、節儉至矣，絕不招待花錢買奢侈品，故頗有積蓄。三、有婚也短暫，必不足三月而破，比同時生人提前二年結婚。四、此局不利公職發展，必困於工作，堆積公文如山。","source":"《地脉道》地理篇"},
  27: {"quote":"頤有飲食養身之意，如何養人？","original":"頤有飲食養身之意，如何養人？如何養正？如何知養之正確與否？何時可養？這些零碎復雜的問題，如要一一解釋，不一定全部都能知道瞭解，八卦之入宅變局，就是取自然頤養之道，使萌生之始念，由己之所需要，人之性在其認為極需要之時，你提供所需方可真正受用，如果他本身不想要，即令是你的親人也無法改變他，只造成熱臉貼到冷屁股的結果。","source":"《地脉道》地理篇"},
  28: {"quote":"大過之卦，於人事上分二解，一為犯下大過，二為立下大過於常人之功。","original":"大過之卦，於人事上分二解，一為犯下大過，二為立下大過於常人之功。地脈道比較偏狹，往往見到小妹最早嫁人，也嫁的最好，必為此卦。至於何時為大過，如何用大過之道，其進退之機，讀者可參看人間道部份，此不詳述。一、比同時生人早婚三年，且嫁夫有長十歲以上之狀況。二、身進豪門世家，享盡榮華富貴。三、性過剛，任意而為，婚前婚後都一樣。四、如婚之對象，年紀相近，必主凶，易破。","source":"《地脉道》地理篇"},
  29: {"quote":"本坎卦有險之象，位居正北，羅經上是子位，吾人常見四合院宅式，皆坐北向南...","original":"本坎卦有險之象，位居正北，羅經上是子位，吾人常見四合院宅式，皆坐北向南，入宅後以中心點為準，其正北宮常設祖先牌位，神明所在或大廳所在，不居人，其因就是此位有險，故以神明續之，今人不知，無意之間此局現，則成次子格，可以發現：一、兒子喜歡冒險，諸如賭博、毒品等舉凡驚險刺激都有興趣。二、唯肖虎，肖牛人住吉。","source":"《地脉道》地理篇"},
  30: {"quote":"此局常見，離卦本示人中虛為明，今人但以為自己很明，其實一直都沒進步，屢...","original":"此局常見，離卦本示人中虛為明，今人但以為自己很明，其實一直都沒進步，屢錯不改，茫然不知，皆肇因於不明，易經提出之中虛為明，就是隨時把自己變成空杯子，那才可以真明。家中有女，天生好手，明事理，知進退，必為此局，讀者須注意要知利用此局方是，不知運用，空言易經，吾所不恥。一、此女必心在遷移外地，不喜在本地。二、命格上如二十八歲婚，則宅局如此，必然不出二十八歲婚。","source":"《地脉道》地理篇"},
  31: {"quote":"此卦局過去常見，今人不多，但讀者亦明瞭，其變化如後：一、婚成於媒妁之言...","original":"此卦局過去常見，今人不多，但讀者亦明瞭，其變化如後：一、婚成於媒妁之言，並非自由戀愛。二、婚事先成後破，凶。三、對象必為豪門世家，比同時生人早一年婚，逢單歲婚。四、財祿事業順利，工作野心大，但科甲不興。","source":"《地脉道》地理篇"},
  32: {"quote":"今人最常見此局，化解局式，如雷地豫卦等都吉。","original":"今人最常見此局，化解局式，如雷地豫卦等都吉。一、易從宗教信仰，但不是正道之宗教。二、比同時生人晚婚一年。三、智慧被壓抑，常不知取捨，失去堅持。四、肖鼠人有吉，陰謀不生。五、官運不佳，商場不順，惟科甲旺，利教職自由業人。","source":"《地脉道》地理篇"},
  33: {"quote":"吾人常見一家之主終日唉聲嘆氣，中年即無斡勁，且工作上付出勞力很多，卻往...","original":"吾人常見一家之主終日唉聲嘆氣，中年即無斡勁，且工作上付出勞力很多，卻往往功給他人，仕途原地踏步，毫無進展，必為此卦而所約束也。一、萌生退意，肇因於該升不升，有無力感二、夫妻感情退化，終致離婚。三、事事回歸原地，必須重新出發。四、身體亦有退化現象，中年即得老年病。","source":"《地脉道》地理篇"},
  34: {"quote":"此卦局也常見不鮮，吾人須知何局為大壯局，如何利用大壯局，何時可用大壯為最利。","original":"此卦局也常見不鮮，吾人須知何局為大壯局，如何利用大壯局，何時可用大壯為最利。何時須離開此局。一、性剛為一家之主，有越居父位之象。二、家庭責任感重。三、不婚，與同時生人不同。四、如有婚，必為猴，兔，犬三肖屬之人，但常不足三月婚破。五、事業獨立自主，自由業人可為一方之主，聲名遠播。","source":"《地脉道》地理篇"},
  35: {"quote":"此局之現，讀者可以立判出。","original":"此局之現，讀者可以立判出。一、性柔有母愛之人。二、婚姻常晚，約四十歲以後。三、守財不花，性極節省之人。四、偏房之人，同時生人有婚為正房。五、婚嫁對象若肖雞，則大吉，但大年長多多。","source":"《地脉道》地理篇"},
  36: {"quote":"此卦很凶，宅局逢之，必主母先亡，且生前血光連年，希讀者遇之必力求其變局...","original":"此卦很凶，宅局逢之，必主母先亡，且生前血光連年，希讀者遇之必力求其變局，功德無量，人不知其功，乃所謂陰德也。一、妻生隱疾不好告人。二、破財且諸事不順。三、易受小人言，招人暗害。四、一旦見血光，必終致凶。五、唯肖虎人，可平安渡過。","source":"《地脉道》地理篇"},
  37: {"quote":"今日常見之卦局，讀者可知如後：一、 從官職必無法升職。","original":"今日常見之卦局，讀者可知如後：一、 從官職必無法升職。二、 科甲功名無慮。三、 婚延後五年與同時生人不同。四、 與家人相處和睦，且非常顧家。五、 多婦人病。","source":"《地脉道》地理篇"},
  38: {"quote":"我們常見有小女孩，背離家人，自顧自私，使父母深為苦惱，而無法改變，只有...","original":"我們常見有小女孩，背離家人，自顧自私，使父母深為苦惱，而無法改變，只有任其任性而為，終致一生皆凶，坎坷，實因自內生。一、性剛僻倔強，任性胡鬧，以致家無法容。二、肖牛肖鼠人見之，更凶。三、科甲不興。四、婚姻不成。五、招凶事，官司，災禍連連。六、有同性戀傾向。","source":"《地脉道》地理篇"},
  39: {"quote":"此局利從武官之人，如軍人、員警、外交、司法人員等，也可以刻意佈出此局如...","original":"此局利從武官之人，如軍人、員警、外交、司法人員等，也可以刻意佈出此局如果你想兒子從此類公職的話。一、求財亨通，且無功利之心。二、官調他鄉，與六親遠離。三、婚姻較同時生人延後七年。四、科甲吉，故考試資格必順心。五、獨自發展亦特立獨行也。","source":"《地脉道》地理篇"},
  40: {"quote":"此卦局常見，也相當特殊：一、為性剛武勇之人。","original":"此卦局常見，也相當特殊：一、為性剛武勇之人。二、總是官司是非不斷。三、無婚。四、肖兔人，劉姓人，柳姓人，主凶。五、出家為唯一可解之人事手段。","source":"《地脉道》地理篇"},
  41: {"quote":"損局在陽宅上造成兒子問題多多，父母總是煩心擔憂。","original":"損局在陽宅上造成兒子問題多多，父母總是煩心擔憂。一、與同時生人，婚事延後一年方成，對方同一人。二、官運不通，所求不成。三、性喜求樂，不求進步，須經二次大災，方能悟。四、對家庭態度，只會花錢，不會賺錢，無所事事。","source":"《地脉道》地理篇"},
  42: {"quote":"一、長女之婚事不成，或成後又破。","original":"一、長女之婚事不成，或成後又破。二、財祿足，有祖業，工作則又過於男性。三、女身男性，貴人為男人，小人為女子。四、從官運則吉，切不可貪祿，主兇。","source":"《地脉道》地理篇"},
  43: {"quote":"一、婚事延宕不成。","original":"一、婚事延宕不成。二、性剛從武，性柔從宗教，吾人可從八字中看出。三、事業先主兇後吉，主自行發展。四、科甲不興。五、身體健康差，不長壽，三十歲前有兇險。","source":"《地脉道》地理篇"},
  44: {"quote":"吾人常見丈夫在外風流多事，桃花運不斷，就是此局生成。","original":"吾人常見丈夫在外風流多事，桃花運不斷，就是此局生成。一、 商人財祿豐盛，只旺六年，須注意假像。二、 官司受牽連，同時生人可能沒事。三、 外有妾及多位女友。四、 夫妻失和，如命中屬二婚命，則必破。五、 官家人亦吉前六年，第七年以後必兇。","source":"《地脉道》地理篇"},
  45: {"quote":"較不多見，但亦有之。","original":"較不多見，但亦有之。一、女兒不想成婚，對異性沒興趣。二、終日進德修業。三、退居家內，代母行職，為良母型之人。四、如從事餐飲業則大利，為唯一帶喜之路。","source":"《地脉道》地理篇"},
  46: {"quote":"其為姤卦之對應卦，在地脈道之屢見不鮮，學者當已嫻熟於卦局之變化，立可知曉。","original":"其為姤卦之對應卦，在地脈道之屢見不鮮，學者當已嫻熟於卦局之變化，立可知曉。一、官職大利，平步青雲。二、事業財祿豐盛。三、能承繼祖業，更新門面。四、夫妻有競爭，不和之象。五、此局不變，婚姻進入第七年必有兇，同時生人不一定會發生，故陽宅影響一人至大，而人們卻茫然不知。","source":"《地脉道》地理篇"},
  47: {"quote":"困之於人大矣，吾道人士能為眾生解開此局，亦無量功德也。","original":"困之於人大矣，吾道人士能為眾生解開此局，亦無量功德也。一、體弱多病，限不過三十歲。二、性剛烈，獨行獨斷。三、婚事不成，多有阻滯。四、財祿不守，只有一線生機，故從商必兇。解之唯大過可也。","source":"《地脉道》地理篇"},
  48: {"quote":"一、婚事娶二婚妻，且妻長。","original":"一、婚事娶二婚妻，且妻長。二、心志不堅，受外在誘惑，無法自拔。三、從商吉，有祖業更吉。四、從官招陷，是非不斷，升遷受阻。","source":"《地脉道》地理篇"},
  49: {"quote":"一、 此女天生剛勇，且明事理。","original":"一、 此女天生剛勇，且明事理。二、 感情困擾多。三、 婚姻比同時生人早二年，且比姊早婚。","source":"《地脉道》地理篇"},
  50: {"quote":"此局最利未婚小姐，我常利用此局助人無數。","original":"此局最利未婚小姐，我常利用此局助人無數。一、 其必嫁貴夫。二、 果決剛斷，不易受惑。三、 婚比姊早婚，且冬天方成。四、 官運亨通，財不利。五、 鼠生人凶，不吉。六、 科甲吉，考試順利。","source":"《地脉道》地理篇"},
  51: {"quote":"生局之中，此局很特殊，未經吾派之人改，自然居此局中人，其必天生好手，在...","original":"生局之中，此局很特殊，未經吾派之人改，自然居此局中人，其必天生好手，在家為貴子無疑。一、 有承繼祖業，發揚光大之實力。二、 科甲興旺，名列前茅。三、 官運通順，只限未婚前。四、 從商亦吉，但須為負責人。五、 婚姻按命中走，紅鸞星動之年，即成婚之年。六、 須注意此局只現在婚前，婚後必不見。惟天卦可繼續其運勢。","source":"《地脉道》地理篇"},
  52: {"quote":"一、 科甲順利，必中理想之學校。","original":"一、 科甲順利，必中理想之學校。二、 健康平安，為孝子。三、 婚姻順利，進入八字中紅鸞星之年必婚。四、 公職大利。五、 知進退，為天生受人喜歡之人。","source":"《地脉道》地理篇"},
  53: {"quote":"一、 科甲不順，缺臨門一腳。","original":"一、 科甲不順，缺臨門一腳。二、 工作心念不定，常思變動。三、 身體平安，災少。四、 對婚姻不采主動，婚事難成。五、 出任公、教職大利。此局變化多，隨時成之故學者須注意。","source":"《地脉道》地理篇"},
  54: {"quote":"現代人為愛滋病所苦，目前醫學界雖仍無法認定其必由同性戀傳染來的，我也不...","original":"現代人為愛滋病所苦，目前醫學界雖仍無法認定其必由同性戀傳染來的，我也不否定其是否正確，但可以肯定的是，其行為必不為父母所能接受的，此局無人發現，自古以來因道德束縛力很強，家族同住，故較不易發生，史有明載其斷袖之癖即言同性戀，但不似今日之普遍，世界各國皆為此苦惱不已，其實易經中早已明確指出其從何而來？為何有人如此，有人不苟同？如何化解？","source":"《地脉道》地理篇"},
  55: {"quote":"此卦常出現在兒子身上一、 未經本派之人指點，乃自然居此局中之人，其與同...","original":"此卦常出現在兒子身上一、 未經本派之人指點，乃自然居此局中之人，其與同時生人不同，婚事必先成後破。二、 科甲考試順利。三、 性剛且堅，易與人爭，必為感情困擾。四、 從商必破財。五、 從官職吉。","source":"《地脉道》地理篇"},
  56: {"quote":"此局特殊，學者須識。","original":"此局特殊，學者須識。一、 科甲興旺二、 女身男態三、 婚事不成，須逢肖羊、肖猴或于未、申之年方有成。四、 城府較深，終自取咎。","source":"《地脉道》地理篇"},
  57: {"quote":"此局大利未婚女，吾每逢有未婚小姐來求教，都不厭其煩的希望他能住在此局中...","original":"此局大利未婚女，吾每逢有未婚小姐來求教，都不厭其煩的希望他能住在此局中，必主婚姻幸福。一、 科甲興旺，考試必中。二、 逢凶化吉，災事不興。三、 婚姻必能嫁好夫婿，逢紅鸞即動。四、 性情穩定，處憂不懼。五、 健康平安之人。","source":"《地脉道》地理篇"},
  58: {"quote":"一、 求婚事必不成，感情複雜又專一不二，如遇虎狼之人必傷害甚大。","original":"一、 求婚事必不成，感情複雜又專一不二，如遇虎狼之人必傷害甚大。二、 有待婚中，夫凶之象，婚比同時生人，延後三年。三、 科甲順暢，多才藝之女。四、 公職順遂，但從商必主不利。五、 體健無災，母蔭重，有無父之虞。","source":"《地脉道》地理篇"},
  59: {"quote":"渙局亦常見之，吾人利用風卦可立解。","original":"渙局亦常見之，吾人利用風卦可立解。一、心在宗教，不想結婚，但易入邪道。二、心中有鬼，諸事不成。三、禍事連連，官非牢獄災難免。四、出家化解災厄，母親終日擔憂。","source":"《地脉道》地理篇"},
  60: {"quote":"一、本人肖雞，則必大貴。","original":"一、本人肖雞，則必大貴。二、本人肖犬，則以小做大，招自陷。三、財無積餘，行險招兇。婚事不成，犬人遇雞則成，妻長一歲，與同時生人不同，且妻主大貴，助夫渡厄。","source":"《地脉道》地理篇"},
  61: {"quote":"有女每試必為狀元，即生此局之人一、科甲狀元，每考必中。","original":"有女每試必為狀元，即生此局之人一、科甲狀元，每考必中。二、武職大利，女中豪傑，今見有女司法官如此。三、雙喜同臨，常在婚姻中伴之而來金榜登科。四、喜事初不成，家中不同意，後成。但與同時生人延後三年。","source":"《地脉道》地理篇"},
  62: {"quote":"此局很多，吾人常不自知陷於局中。","original":"此局很多，吾人常不自知陷於局中。一、感情困擾，擺脫不了情關，為情不顧一切，此小人也。二、肖猴，候姓人不忌。三、無法工作，神魂顛倒。四、常過失傷人，故婚事不成。","source":"《地脉道》地理篇"},
  63: {"quote":"此局吾常用於化解困卦之局一、不重財貨，天性如此。","original":"此局吾常用於化解困卦之局一、不重財貨，天性如此。二、官運人吉，從商亦得財，故財官雙美。三、科甲亦吉，利考試。四、先有子，後有婚，如加上命中有妾，則必主正房一子，偏房一子。五、婚姻會比同時生人慢八年，也常先有妾後有婚。故吾人知如此，常俟事業安定後，用雷卦化解婚姻問題。","source":"《地脉道》地理篇"},
  64: {"quote":"一、女身男態，性剛易怒。","original":"一、女身男態，性剛易怒。二、肖虎女子，必枯坐無成。三、劉、宋、高等姓人從武吉。四、婚事必不成，與同時生人婚時不同。五、從商求財是非多，甚而官司、爭執不下。","source":"《地脉道》地理篇"}
};

function loadYangzhaiState() {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(YANGZHAI_STORAGE_KEY) : "";
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object") {
      const shouldResetForBlankDefault = Number(parsed.version || 0) < YANGZHAI_STATE_VERSION;
      const placements = shouldResetForBlankDefault ? {} : normalizeYangzhaiPlacements(parsed.placements);
      const shouldClearLegacyDefault = !parsed.version && isYangzhaiDefaultPlacementSet(placements);
      const state = {
        version: YANGZHAI_STATE_VERSION,
        placements: shouldClearLegacyDefault || shouldResetForBlankDefault ? {} : placements,
        activePalace: shouldResetForBlankDefault ? "xun" : parsed.activePalace || "xun",
        pendingItems: shouldResetForBlankDefault ? [] : normalizeYangzhaiItems(parsed.pendingItems || parsed.pendingItem),
        expanded: shouldResetForBlankDefault ? {} : parsed.expanded || {}
      };
      if ((shouldClearLegacyDefault || shouldResetForBlankDefault) && typeof localStorage !== "undefined") {
        localStorage.setItem(YANGZHAI_STORAGE_KEY, JSON.stringify(state));
      }
      return state;
    }
  } catch (_) {}
  return {
    version: YANGZHAI_STATE_VERSION,
    placements: {},
    activePalace: "xun",
    pendingItems: [],
    expanded: {}
  };
}

let yangzhaiState = loadYangzhaiState();
let yangzhaiCompassHandler = null;
let yangzhaiCompassSmoothedHeading = null;
let yangzhaiCompassLastAppliedAt = 0;
const YANGZHAI_COMPASS_MIN_DELTA = 1.4;
const YANGZHAI_COMPASS_MIN_INTERVAL = 80;
const YANGZHAI_COMPASS_SMOOTHING = 0.18;

function saveYangzhaiState() {
  try {
    if (typeof localStorage !== "undefined") {
      yangzhaiState.placements = normalizeYangzhaiPlacements(yangzhaiState.placements);
      yangzhaiState.pendingItems = normalizeYangzhaiItems(yangzhaiState.pendingItems);
      localStorage.setItem(YANGZHAI_STORAGE_KEY, JSON.stringify(yangzhaiState));
    }
  } catch (_) {}
}

function normalizeCompassHeading(value) {
  if (!Number.isFinite(value)) return null;
  return ((value % 360) + 360) % 360;
}

function getCompassDeltaDegrees(from, to) {
  const start = normalizeCompassHeading(from) || 0;
  const end = normalizeCompassHeading(to) || 0;
  return ((end - start + 540) % 360) - 180;
}

function smoothYangzhaiCompassHeading(rawHeading) {
  const raw = normalizeCompassHeading(rawHeading);
  if (raw === null) return null;
  if (yangzhaiCompassSmoothedHeading === null) {
    yangzhaiCompassSmoothedHeading = raw;
    return raw;
  }
  const delta = getCompassDeltaDegrees(yangzhaiCompassSmoothedHeading, raw);
  if (Math.abs(delta) < YANGZHAI_COMPASS_MIN_DELTA) return null;
  yangzhaiCompassSmoothedHeading = normalizeCompassHeading(
    yangzhaiCompassSmoothedHeading + delta * YANGZHAI_COMPASS_SMOOTHING
  );
  return yangzhaiCompassSmoothedHeading;
}

function resetYangzhaiCompassSmoothing() {
  yangzhaiCompassSmoothedHeading = null;
  yangzhaiCompassLastAppliedAt = 0;
}

function getYangzhaiCompassDirectionLabel(heading) {
  const directions = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
  const normalized = normalizeCompassHeading(heading) || 0;
  return directions[Math.round(normalized / 45) % directions.length];
}

function applyYangzhaiCompassHeading(rawHeading, tone = "active") {
  const raw = normalizeCompassHeading(rawHeading);
  if (raw === null) return null;
  const heading = raw;
  view.querySelectorAll("[data-yangzhai-compass-cross]").forEach((cross) => {
    cross.style.setProperty("--yangzhai-heading", `${heading}deg`);
    cross.style.setProperty("--yangzhai-luopan-rotation", `${-heading}deg`);
    cross.classList.add("is-compass-active");
  });
  setYangzhaiCompassStatus(
    `${Math.round(heading)}° ${getYangzhaiCompassDirectionLabel(heading)}`,
    tone
  );
  return heading;
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

function isYangzhaiDefaultPlacementSet(placements = {}) {
  const current = normalizeYangzhaiPlacements(placements);
  const defaults = normalizeYangzhaiPlacements(YANGZHAI_DEFAULT_PLACEMENTS);
  const keys = new Set([...Object.keys(current), ...Object.keys(defaults)]);
  if (!keys.size) return false;
  for (const key of keys) {
    const left = normalizeYangzhaiItems(current[key]).sort().join("|");
    const right = normalizeYangzhaiItems(defaults[key]).sort().join("|");
    if (left !== right) return false;
  }
  return true;
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

function setYangzhaiCompassStatus(text, tone = "") {
  const status = view.querySelector("[data-yangzhai-compass-status]");
  if (!status) return;
  status.textContent = text;
  status.dataset.tone = tone;
}

function handleYangzhaiCompassOrientation(event) {
  const webkitHeading = typeof event.webkitCompassHeading === "number" ? event.webkitCompassHeading : NaN;
  const alpha = typeof event.alpha === "number" ? event.alpha : NaN;
  const heading = Number.isFinite(webkitHeading)
    ? normalizeCompassHeading(webkitHeading)
    : normalizeCompassHeading(360 - alpha);
  if (heading === null) return;
  const now = Date.now();
  if (now - yangzhaiCompassLastAppliedAt < YANGZHAI_COMPASS_MIN_INTERVAL) return;
  const smoothed = smoothYangzhaiCompassHeading(heading);
  if (smoothed === null) return;
  yangzhaiCompassLastAppliedAt = now;
  applyYangzhaiCompassHeading(smoothed);
}

function stopYangzhaiCompass() {
  resetYangzhaiCompassSmoothing();
  if (!yangzhaiCompassHandler) return;
  window.removeEventListener("deviceorientationabsolute", yangzhaiCompassHandler, true);
  window.removeEventListener("deviceorientation", yangzhaiCompassHandler, true);
  yangzhaiCompassHandler = null;
}

async function startYangzhaiCompass() {
  if (typeof window === "undefined" || typeof window.DeviceOrientationEvent === "undefined") {
    setYangzhaiCompassStatus("不支持", "warn");
    return;
  }
  try {
    const orientationApi = window.DeviceOrientationEvent;
    if (typeof orientationApi.requestPermission === "function") {
      const permission = await orientationApi.requestPermission();
      if (permission !== "granted") {
        setYangzhaiCompassStatus("未授权", "warn");
        return;
      }
    }
    stopYangzhaiCompass();
    yangzhaiCompassHandler = handleYangzhaiCompassOrientation;
    window.addEventListener("deviceorientationabsolute", yangzhaiCompassHandler, true);
    window.addEventListener("deviceorientation", yangzhaiCompassHandler, true);
    setYangzhaiCompassStatus("读取中", "active");
  } catch (_) {
    setYangzhaiCompassStatus("启动失败", "warn");
  }
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
    original: "已对应到六十四卦索引，正文仍待人工复核。",
    source: YANGZHAI_SOURCE_TITLE
  };
}

function getYangzhaiReadingText(reading) {
  return reading?.original || reading?.summary || reading?.quote || "原文待核。";
}

function formatYangzhaiReadingText(text) {
  return String(text || "")
    .replace(/\s+/g, "")
    .replace(/([：:])(?=[一二三四五六七八九十]、)/g, "$1\n")
    .replace(/。(?=[一二三四五六七八九十]、)/g, "。\n")
    .replace(/([，,])(?=[一二三四五六七八九十]、)/g, "$1\n")
    .replace(/。(?=\S)/g, "。\n")
    .trim();
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
        const desc = `${formatYangzhaiReadingText(rule.original || `${rule.meaning || "待核"}${rule.preference || ""}`)}\n当前：${palace.gua}宫(${palace.dir})。`;
        return {
          kind: "space",
          title: `${label}在${palace.gua}(${palace.dir}) - 功能区象义`,
          desc,
          full: `${desc} 出处：${rule.source || "待核"}。`,
          short,
          matched: preferred
        };
      }
      const hex = getYangzhaiHex(label, palace);
      const matched = label === palace.defaultItem;
      const reading = getYangzhaiHexReading(hex);
      const originalText = formatYangzhaiReadingText(getYangzhaiReadingText(reading));
      const desc = hex
        ? `第${hex.no}卦 ${hex.name}：\n${originalText}`
        : `八宫基础：${label}住${palace.gua}(${palace.dir})，待补结构索引。`;
      return {
        kind: "hex",
        title: `${label}住${palace.gua}(${palace.dir}) - ${hex ? hex.name : palace.role}`,
        desc,
        full: hex
          ? `结构：${hex.index}；上卦=角色(${YANGZHAI_ROLE_GUA[label]})，下卦=方位(${palace.gua})。原文摘录：${originalText} 出处：${reading.source || YANGZHAI_SOURCE_TITLE}。`
          : `${desc} 来源待核；前台只发布可核索引。`,
        short,
        matched
      };
    }));
}

function getYangzhaiResultCardHeight(item) {
  const descLines = Math.max(4, String(item?.desc || "").split("\n").reduce((sum, line) => {
    return sum + Math.max(1, Math.ceil(line.length / 24));
  }, 0));
  return Math.max(YANGZHAI_RESULT_CARD_HEIGHT, 104 + descLines * 19);
}

function getYangzhaiResultHeight() {
  const results = buildYangzhaiResults();
  if (!results.length) return 930;
  let y = YANGZHAI_RESULT_START_Y;
  results.forEach((item) => {
    y += getYangzhaiResultCardHeight(item) + YANGZHAI_RESULT_GAP;
  });
  return Math.max(844, y + 110);
}

function getYangzhaiResultTag(item) {
  if (item.kind === "space") return item.matched ? "方位适配" : "位置待调";
  return item.matched ? "本位相合" : "卦象解读";
}

function yangzhaiBg(id, height = 844) {
  return `
    ${figBox(`${id}-bg`, -720, 0, 1830, height, "", "background:#fbf3e6;")}
    ${figBox(`${id}-paper-top`, 0, 0, 390, 190, "", "background:#fffaf1;")}
    ${figBox(`${id}-paper-main`, 0, 190, 390, Math.max(0, height - 190), "", "background:#f7eddd;")}
    ${figBox(`${id}-wash`, -88, 88, 566, 566, "", "border-radius:50%;background:rgba(234,215,184,.26);")}
    ${figBox(`${id}-top`, -720, 0, 1830, 92, "", "background:#fffaf1;")}
    ${figBox(`${id}-header-line`, 0, 91, 390, 1, "", "background:#eadbc6;")}
  `;
}

function yangzhaiHeader(id, title = "地脉道", right = "教程") {
  return `
    ${figButton(`${id}-back-hit`, 16, 34, 52, 52, 'data-action="back"')}
    ${figText(`${id}-back`, "‹", 26, 42, 24, 24, "#514437", 500, "center", "line-height:1;font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
    ${figText(`${id}-title`, title, 120, 43, 150, 20, "#241811", 700, "center", "line-height:1.25;font-family:'Noto Serif SC','Songti SC',serif;")}
    ${right ? `${figBox(`${id}-tutorial`, 322, 35, 52, 34, "", "border:1px solid #d9c5a8;border-radius:12px;background:#fffdf8;")}
    ${figButton(`${id}-tutorial-hit`, 322, 35, 52, 34, 'data-route="screen-45"')}
    ${figText(`${id}-tutorial-text`, right, 322, 44, 52, 13, "#8c342a", 700, "center", "font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}` : ""}
  `;
}

function yangzhaiRoomAvatar(id, x, y, labels, compact = false) {
  const items = normalizeYangzhaiItems(labels);
  const plusSize = compact ? 26 : 28;
  const plusX = x + YANGZHAI_CELL_W - plusSize - (compact ? 5 : 6);
  const plusY = y + (compact ? YANGZHAI_RESULT_CELL_H - plusSize - 5 : 70);
  if (!items.length) {
    return `
      ${figText(`${id}-hint`, "点此安位", x + 14, y + (compact ? 61 : 76), 72, compact ? 10 : 11, "#b0a08e", 500, "left", "line-height:1.2;font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
      ${figBox(`${id}-plus`, plusX, plusY, plusSize, plusSize, "", `border:1px solid #dec7a8;border-radius:${plusSize / 2}px;background:#fffdf8;`)}
      ${figText(`${id}-plus-text`, "+", plusX, plusY + (compact ? 2 : 3), plusSize, compact ? 16 : 18, "#9f4032", 900, "center", "line-height:1;")}
    `;
  }
  const label = items[0];
  const option = getYangzhaiOption(label);
  const displayLabel = items.length > 1 ? `${label}等${items.length}项` : label;
  const pillW = compact ? 72 : 72;
  const pillY = y + (compact ? 58 : 74);
  const labelSize = displayLabel.length > 5 ? 10 : (compact ? 10 : 11);
  return `
    ${figBox(`${id}-pill`, x + 14, pillY, pillW, compact ? 24 : 28, "", `border:1px solid #ddb988;border-radius:${compact ? 12 : 14}px;background:#fff0df;`)}
    ${figText(`${id}-label`, displayLabel, x + 14, pillY + (compact ? 6 : 7), pillW, labelSize, "#8a5a22", 700, "center", "line-height:1.15;font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
    ${figBox(`${id}-plus`, plusX, plusY, plusSize, plusSize, "", `border:1px solid #dec7a8;border-radius:${plusSize / 2}px;background:#fffdf8;`)}
    ${figText(`${id}-plus-text`, "+", plusX, plusY + (compact ? 2 : 3), plusSize, compact ? 16 : 18, "#9f4032", 900, "center", "line-height:1;")}
  `;
}

function yangzhaiCorner(id, x, y, flipX = false, flipY = false) {
  const hX = flipX ? x - 18 : x;
  const vY = flipY ? y - 18 : y;
  const h2X = flipX ? x - 17 : x + 5;
  const h2Y = flipY ? y - 5 : y + 5;
  const v2X = flipX ? x - 5 : x + 5;
  const v2Y = flipY ? y - 17 : y + 5;
  return `
    ${figBox(`${id}-h`, hX, y, 18, 1, "", "background:#dcceb8;")}
    ${figBox(`${id}-v`, x, vY, 1, 18, "", "background:#dcceb8;")}
    ${figBox(`${id}-h2`, h2X, h2Y, 12, 1, "", "background:#e7dac8;")}
    ${figBox(`${id}-v2`, v2X, v2Y, 1, 12, "", "background:#e7dac8;")}
  `;
}

function getYangzhaiGridMetrics(compact = false) {
  const cellH = compact ? YANGZHAI_RESULT_CELL_H : YANGZHAI_CELL_H;
  return {
    x: YANGZHAI_GRID_X,
    y: compact ? YANGZHAI_RESULT_GRID_Y : YANGZHAI_GRID_Y,
    cellW: YANGZHAI_CELL_W,
    cellH,
    gridW: YANGZHAI_GRID_W,
    gridH: cellH * 3
  };
}

function yangzhaiDirectionCross(id, x, y, size, compact = false, variant = "inline", attrs = "") {
  return `
    <div class="yangzhai-direction-cross is-${variant}${compact ? " is-compact" : ""}" data-node-id="${id}" ${attrs} style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;">
      <span class="yz-cross-ring"></span>
      <span class="yz-cross-line yz-cross-line-ns"></span>
      <span class="yz-cross-line yz-cross-line-ew"></span>
      <span class="yz-cross-dot"></span>
      <span class="yz-dir yz-n">北</span>
      <span class="yz-dir yz-e">东</span>
      <span class="yz-dir yz-s">南</span>
      <span class="yz-dir yz-w">西</span>
    </div>
  `;
}

function yangzhaiCompassGrid(id, compact = false) {
  const metrics = getYangzhaiGridMetrics(compact);
  return YANGZHAI_PALACES.map((palace, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = metrics.x + col * metrics.cellW;
    const y = metrics.y + row * metrics.cellH;
    if (palace.key === "center") {
      const crossSize = compact ? 64 : 82;
      const crossX = x + (metrics.cellW - crossSize) / 2;
      const crossY = y + (compact ? 18 : 24);
      return `
        ${figBox(`${id}-center-clear`, x, y, metrics.cellW, metrics.cellH, "", "border:1px solid #eadbc6;background:#fffdf7;")}
        ${yangzhaiDirectionCross(`${id}-center-cross`, crossX, crossY, crossSize, compact, "inline", 'data-yangzhai-compass-cross')}
        ${compact ? "" : `${figBox(`${id}-compass-pill`, x + 24, y + 114, 70, 28, "", "border:1px solid #ead2a9;border-radius:14px;background:#fff8e9;")}
        ${figText(`${id}-compass-text`, "开指南针", x + 24, y + 121, 70, 11, "#8a5a22", 700, "center", "line-height:1.15;")}
        <div class="yangzhai-inline-compass-status" data-node-id="${id}-compass-note" data-yangzhai-compass-status style="left:${x + 10}px;top:${y + 145}px;width:${metrics.cellW - 20}px;">未开启</div>
        ${figButton(`${id}-compass-hit`, x + 24, y + 114, 70, 28, 'data-action="yangzhai-compass-start" aria-label="开启手机指南针"', "", "cursor:pointer;")}`}
      `;
    }
    const items = getYangzhaiPlacementItems(palace.key);
    return `
      ${figText(`${id}-dir-${index}`, palace.dir, x + 13, y + (compact ? 9 : 11), 58, compact ? 14 : 17, "#201812", 900, "left", "white-space:nowrap;font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
      ${figText(`${id}-role-${index}`, palace.role, x + 13, y + (compact ? 31 : 36), 84, compact ? 9 : 11, "#55493d", 700, "left", "white-space:nowrap;font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
      ${figText(`${id}-gua-${index}`, palace.gua, x + 86, y + (compact ? 12 : 15), 16, compact ? 10 : 12, "#9f4032", 800, "right", "line-height:1;font-family:'Noto Serif SC','Songti SC',serif;")}
      ${yangzhaiRoomAvatar(`${id}-room-${index}`, x, y, items, compact)}
      ${figButton(`${id}-cell-hit-${index}`, x, y, metrics.cellW, metrics.cellH, `data-action="yangzhai-open" data-palace="${palace.key}"`)}
    `;
  }).join("");
}

function yangzhaiCompassShell(id, compact = false) {
  const metrics = getYangzhaiGridMetrics(compact);
  return `
    ${figBox(`${id}-grid-surface`, metrics.x, metrics.y, metrics.gridW, metrics.gridH, "", `border:1px solid #dcc6a6;border-radius:${compact ? 16 : 18}px;background:#fffaf2;overflow:hidden;box-shadow:0 ${compact ? 12 : 14}px ${compact ? 24 : 30}px rgba(92,50,29,.08);`)}
    ${figBox(`${id}-line-h1`, metrics.x, metrics.y + metrics.cellH, metrics.gridW, 1, "", "background:#eadbc6;")}
    ${figBox(`${id}-line-h2`, metrics.x, metrics.y + metrics.cellH * 2, metrics.gridW, 1, "", "background:#eadbc6;")}
    ${figBox(`${id}-line-v1`, metrics.x + metrics.cellW, metrics.y, 1, metrics.gridH, "", "background:#eadbc6;")}
    ${figBox(`${id}-line-v2`, metrics.x + metrics.cellW * 2, metrics.y, 1, metrics.gridH, "", "background:#eadbc6;")}
    ${yangzhaiCompassGrid(id, compact)}
  `;
}

function yangzhaiActions(id, primaryText = "解读分析", y = YANGZHAI_ACTION_Y) {
  return `
    ${figBox(`${id}-analyze`, 20, y, 150, 48, "", "border:1px solid #873127;border-radius:12px;background:linear-gradient(180deg,#b84d3d,#943629);box-shadow:0 10px 20px rgba(113,48,37,.18);")}
    ${figButton(`${id}-analyze-hit`, 20, y, 150, 48, 'data-action="yangzhai-analyze"')}
    ${figText(`${id}-analyze-text`, primaryText, 20, y + 14, 150, 16, "#fffaf3", 900, "center", "font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
    ${figBox(`${id}-order`, 184, y, 132, 48, "", "border:1px solid #dcc8aa;border-radius:12px;background:#fffdf8;")}
    ${figButton(`${id}-order-hit`, 184, y, 132, 48, 'data-action="yangzhai-autofill"')}
    ${figText(`${id}-order-text`, "长幼归位", 184, y + 15, 132, 14, "#806448", 700, "center", "white-space:nowrap;")}
    ${figBox(`${id}-reset`, 326, y, 44, 48, "", "border:1px solid #dcc8aa;border-radius:12px;background:#fffdf8;")}
    ${figButton(`${id}-reset-hit`, 326, y, 44, 48, 'data-action="yangzhai-reset"')}
    ${figText(`${id}-reset-text`, "重置", 326, y + 15, 44, 13, "#806448", 700, "center")}
  `;
}

function sourceYangzhaiCompassScreen() {
  return `
    ${yangzhaiBg("yz42")}
    ${yangzhaiHeader("yz42")}
    ${figText("yz42-section-title", "九宫安位", 22, 104, 110, 21, "#241811", 900, "left", "font-family:'Noto Serif SC','Songti SC',serif;")}
    ${figText("yz42-section-help", "逐格点击加号安位", 214, 111, 154, 12, "#8e7d68", 700, "right", "font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
    ${yangzhaiCompassShell("yz42")}
    ${yangzhaiActions("yz42")}
    ${figBox("yz42-tip", 20, 720, 350, 46, "", "border:1px solid #eadbc6;border-radius:14px;background:#fffdf8;")}
    ${figBox("yz42-tip-icon-bg", 36, 734, 18, 18, "", "border-radius:9px;background:#d0c6b6;")}
    ${figText("yz42-tip-icon", "!", 36, 737, 18, 10, "#fffdf6", 900, "center", "line-height:1;")}
    ${figText("yz42-tip-text", "当前内容仅供娱乐参考，不等于专业测评或现实指导。", 66, 732, 278, 12, "#9d907f", 600, "left", "line-height:1.45;")}
  `;
}

function sourceYangzhaiSelectScreen() {
  const activePalace = getYangzhaiPalace(yangzhaiState.activePalace);
  const selectedItems = getYangzhaiPendingItems();
  return `
    ${sourceYangzhaiCompassScreen()}
    ${figBox("yz43-overlay", 0, 0, 390, 844, "", "background:rgba(33,22,15,.50);backdrop-filter:blur(1px);")}
    ${figButton("yz43-top-back-hit", 0, 0, 96, 110, 'data-route="screen-42" aria-label="返回地脉道"')}
    ${figBox("yz43-sheet", 0, 306, 390, 538, "", "border-radius:28px 28px 0 0;background:#fffaf3;box-shadow:0 -20px 44px rgba(35,20,10,.24);")}
    ${figBox("yz43-handle", 160, 322, 70, 5, "", "border-radius:4px;background:#dfcfb8;")}
    ${figText("yz43-title", "选择方位成员", 24, 352, 142, 20, "#201812", 900, "left", "font-family:'Noto Serif SC','Songti SC',serif;")}
    ${figBox("yz43-palace-pill", 190, 346, 132, 32, "", "border:1px solid #eadbc6;border-radius:16px;background:#fffdf8;")}
    ${figText("yz43-palace-text", `${activePalace.gua}宫 · ${activePalace.dir} · ${activePalace.role}`, 198, 355, 116, 11, "#8a5a22", 800, "center", "white-space:nowrap;font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
    ${figButton("yz43-close-hit", 328, 342, 42, 42, 'data-route="screen-42"')}
    ${figText("yz43-close", "×", 330, 343, 42, 30, "#5f5a52", 500, "center")}
    ${figText("yz43-sub", "家人、空间、清空都保留；可多选，再点取消。", 24, 390, 300, 12, "#817568", 600, "left", "font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
    ${figLine("yz43-midline", 195, 414, 312, "#eadfce")}
    ${YANGZHAI_OPTIONS.map((option, index) => {
      const label = option.label;
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = col ? 214 : 44;
      const y = 426 + row * 48;
      const isSelected = option.type !== "clear" && selectedItems.includes(label);
      const shortSize = option.short.length > 1 ? 10 : 12;
      return `
        ${figBox(`yz43-option-bg-${index}`, x - 8, y - 5, 158, 42, "", `border:1px solid ${isSelected ? "#a94437" : "#eadfce"};border-radius:14px;background:${isSelected ? "#fff1e8" : "#fffdf8"};box-shadow:${isSelected ? "0 8px 18px rgba(155,62,43,.10)" : "0 6px 16px rgba(70,45,25,.04)"};`)}
        ${figBox(`yz43-avatar-${index}`, x, y, 32, 32, "", `border-radius:16px;background:${option.type === "clear" ? "#fff1ea" : "#f2e8d7"};border:1px solid #e0d2bd;`)}
        ${figText(`yz43-avatar-text-${index}`, option.short, x, y + (option.short.length > 1 ? 9 : 8), 32, shortSize, option.type === "clear" ? "#a94437" : "#7f5b2a", 900, "center")}
        ${figText(`yz43-option-${index}`, label, x + 42, y + 7, 72, 14, "#201812", 800)}
        ${figBox(`yz43-radio-${index}`, x + 120, y + 7, 20, 20, "", `border:1px solid ${isSelected ? "#a94437" : "#c9bba9"};border-radius:10px;background:${isSelected ? "#a94437" : "#fffdf8"};`)}
        ${isSelected ? figText(`yz43-radio-check-${index}`, "✓", x + 120, y + 10, 20, 10, "#fffaf3", 900, "center") : ""}
        ${figButton(`yz43-option-hit-${index}`, x - 8, y - 5, 158, 42, `data-action="yangzhai-pick" data-yangzhai-option="${label}"`)}
      `;
    }).join("")}
    ${figBox("yz43-confirm", 44, 718, 302, 50, "", "border-radius:25px;background:linear-gradient(180deg,#b74e39,#983323);box-shadow:0 12px 24px rgba(158,61,43,.22);")}
    ${figButton("yz43-confirm-hit", 44, 718, 302, 50, 'data-action="yangzhai-confirm"')}
    ${figText("yz43-confirm-text", selectedItems.length ? `确认本宫安位 (${selectedItems.length})` : "确认清空", 44, 732, 302, 16, "#fffaf3", 900, "center")}
  `;
}

function sourceYangzhaiResultScreen() {
  const results = buildYangzhaiResults();
  const height = getYangzhaiResultHeight();
  return `
    ${yangzhaiBg("yz44", height)}
    ${yangzhaiHeader("yz44")}
    ${figText("yz44-head-title", "本次安位", 22, 104, 100, 20, "#241811", 900, "left", "font-family:'Noto Serif SC','Songti SC',serif;")}
    ${figText("yz44-head-meta", results.length ? `已生成 ${results.length} 条解读` : "尚未排布", 226, 111, 142, 12, "#9f4032", 700, "right", "font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
    ${yangzhaiCompassShell("yz44", true)}
    ${yangzhaiActions("yz44", "重新分析", YANGZHAI_RESULT_ACTION_Y)}
    ${figText("yz44-result-source", YANGZHAI_SOURCE_TITLE, 22, YANGZHAI_RESULT_TITLE_Y, 152, 15, "#9b7340", 800, "left", "font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
    ${figText("yz44-result-title", "解读结果", 246, YANGZHAI_RESULT_TITLE_Y - 1, 122, 17, "#2b251c", 900, "right", "font-family:'Noto Serif SC','Songti SC',serif;")}
    ${!results.length ? `
      ${figBox("yz44-empty", 20, YANGZHAI_RESULT_START_Y, 350, 118, "", "border:1px solid #dcceb8;border-radius:14px;background:#fffdf8;box-shadow:0 10px 22px rgba(70,45,25,.06);")}
      ${yangzhaiCorner("yz44-empty-tl", 26, YANGZHAI_RESULT_START_Y + 6)}
      ${yangzhaiCorner("yz44-empty-tr", 364, YANGZHAI_RESULT_START_Y + 6, true, false)}
      ${figText("yz44-empty-title", "还没有可解读内容", 0, YANGZHAI_RESULT_START_Y + 38, 390, 16, "#2b251c", 900, "center")}
      ${figText("yz44-empty-copy", "添加父母、子女、厨房、厕所或客厅后再分析。", 0, YANGZHAI_RESULT_START_Y + 70, 390, 12, "#6e6254", 600, "center")}
    ` : ""}
    ${results.map((item, index) => {
      let y = YANGZHAI_RESULT_START_Y;
      for (let i = 0; i < index; i += 1) {
        y += getYangzhaiResultCardHeight(results[i]) + YANGZHAI_RESULT_GAP;
      }
      const cardHeight = getYangzhaiResultCardHeight(item);
      const tag = getYangzhaiResultTag(item);
      const shortSize = String(item.short || "").length > 1 ? 10 : 12;
      return `
        ${figBox(`yz44-card-${index}`, 20, y, 350, cardHeight, "", "border:1px solid #dcceb8;border-radius:14px;background:#fffdf8;box-shadow:0 10px 22px rgba(70,45,25,.06);")}
        ${yangzhaiCorner(`yz44-card-${index}-tl`, 26, y + 6)}
        ${yangzhaiCorner(`yz44-card-${index}-tr`, 364, y + 6, true, false)}
        ${yangzhaiCorner(`yz44-card-${index}-bl`, 26, y + cardHeight - 6, false, true)}
        ${yangzhaiCorner(`yz44-card-${index}-br`, 364, y + cardHeight - 6, true, true)}
        ${figBox(`yz44-avatar-${index}`, 36, y + 22, 36, 36, "", "border:1px solid #dcceb8;border-radius:18px;background:#f2e9da;")}
        ${figText(`yz44-avatar-text-${index}`, item.short, 36, y + (shortSize < 12 ? 32 : 31), 36, shortSize, "#7b3129", 900, "center", "font-family:'Noto Serif SC','Songti SC',serif;")}
        ${figText(`yz44-title-${index}`, item.title, 84, y + 20, 214, 15, "#2b251c", 900, "left", "font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
        ${figBox(`yz44-tag-${index}`, 250, y + 48, 82, 26, "", "border:1px solid #ead9bd;border-radius:13px;background:#fff1dc;")}
        ${figText(`yz44-tag-text-${index}`, tag, 250, y + 55, 82, 11, "#8a5a22", 800, "center", "line-height:1.1;")}
        ${figText(`yz44-desc-${index}`, item.desc, 42, y + 84, 300, 12, "#4c433a", 600, "left", "line-height:1.55;")}
      `;
    }).join("")}
    ${figBox("yz44-tip", 20, height - 74, 350, 44, "", "border-radius:12px;background:#fffdf8;")}
    ${figText("yz44-tip-text", "当前内容仅供娱乐参考，不等于专业测评。", 0, height - 60, 390, 12, "#a99e90", 600, "center")}
  `;
}

function sourceYangzhaiTutorialScreen() {
  const steps = [
    ["01", "定中宫", "站在户型中心，以手机指南针或户型图确认八方。"],
    ["02", "安人事", "点方位加号，放入父母子女、厨房、厕所、客厅。"],
    ["03", "看重点", "系统按卦位生成摘要，先读偏旺、相合、需调整。"],
    ["04", "可重排", "不确定时可清空、长幼归位，再重新解读。"]
  ];
  return `
    ${yangzhaiBg("yz45")}
    ${yangzhaiHeader("yz45", "教程", "")}
    ${figText("yz45-title", "3分钟排出宅盘", 24, 120, 248, 28, "#201812", 900, "left", "line-height:1.1;font-family:'Noto Serif SC','Songti SC',serif;")}
    ${figText("yz45-sub", "先定中宫，再分八方，最后把家人与空间放入宫位。", 24, 164, 318, 13, "#817568", 700, "left", "line-height:1.55;")}
    ${figBox("yz45-intro", 24, 228, 342, 136, "", "border:1px solid #ead8b8;border-radius:22px;background:#fffdf8;box-shadow:0 12px 28px rgba(70,45,25,.07);")}
    ${figBox("yz45-intro-disc", 46, 254, 86, 86, "", "border:1px solid #dcc39c;border-radius:43px;background:#f4e4c6;")}
    ${yangzhaiDirectionCross("yz45-intro-cross", 62, 270, 54, true)}
    ${figText("yz45-intro-title", "核心只有三步", 150, 262, 168, 20, "#201812", 900, "left", "font-family:'Noto Serif SC','Songti SC',serif;")}
    ${figText("yz45-intro-copy", "定位、安位、解读。页面里的加号就是每个宫位的入口。", 150, 300, 170, 13, "#6f6254", 700, "left", "line-height:1.55;")}
    ${steps.map(([num, title, desc], index) => {
      const y = 400 + index * 78;
      return `
        ${figBox(`yz45-step-${index}`, 24, y, 342, 66, "", "border:1px solid #ead8b8;border-radius:20px;background:#fffdf8;box-shadow:0 8px 18px rgba(70,45,25,.04);")}
        ${figText(`yz45-num-text-${index}`, num, 42, y + 21, 42, 16, "#a2493d", 900, "center", "font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
        ${figBox(`yz45-step-line-${index}`, 94, y + 18, 1, 30, "", "background:#ead2ad;")}
        ${figText(`yz45-step-title-${index}`, title, 112, y + 20, 66, 17, "#201812", 900, "left", "font-family:'Noto Serif SC','Songti SC',serif;")}
        ${figText(`yz45-step-desc-${index}`, desc, 190, y + 16, 144, 12, "#6f6254", 700, "left", "line-height:1.45;font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;")}
      `;
    }).join("")}
    ${figBox("yz45-go", 42, 748, 306, 58, "", "border-radius:29px;background:linear-gradient(180deg,#b74e39,#983323);box-shadow:0 14px 26px rgba(158,61,43,.22);")}
    ${figButton("yz45-go-hit", 42, 748, 306, 58, 'data-route="screen-42"')}
    ${figText("yz45-go-text", "开始排宅盘", 42, 767, 306, 17, "#fffaf3", 900, "center")}
  `;
}

const LIUREN_MONTHS = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
const LIUREN_HOURS = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const LIUREN_PALACES = [
  { name: "大安", nature: "吉", tone: "good", keys: ["安稳", "守成", "静候"], summary: "主安定、平稳，宜守不宜急。问事多能稳住，先保当前盘面。", advice: "适合确认已有计划、等待消息、修正细节。" },
  { name: "留连", nature: "凶", tone: "warn", keys: ["迟滞", "牵连", "反复"], summary: "主拖延、反复、被事情缠住。问事不宜急推，先拆开阻点。", advice: "适合催办、补资料、清理旧账；不宜仓促定案。" },
  { name: "速喜", nature: "吉", tone: "good", keys: ["消息", "喜讯", "快应"], summary: "主喜讯、消息快至、机会临近。问事多有回应，但要快接快办。", advice: "适合联系、发布、见面、确认；好消息来时立刻承接。" },
  { name: "赤口", nature: "凶", tone: "warn", keys: ["口舌", "冲突", "误会"], summary: "主争执、口舌、误会。问事要先避冲突，话不可说满。", advice: "适合沉默观察、留证据、缓谈判；避免硬碰硬。" },
  { name: "小吉", nature: "吉", tone: "good", keys: ["小成", "贵人", "顺手"], summary: "主小利、小成、有人帮扶。不是暴涨，但推进顺手。", advice: "适合小步试探、先拿结果、借力推进。" },
  { name: "空亡", nature: "凶", tone: "warn", keys: ["落空", "虚耗", "暂无"], summary: "主落空、虚耗、信息不实。问事多需重新核对根基。", advice: "适合暂停、查证、换方案；不要把希望压在单一路径。" }
];
const LIUREN_HAND_POINTS = [
  { left: 39.2, top: 58.0, width: 10.8, height: 13.2 },
  { left: 38.4, top: 42.0, width: 10.6, height: 13.0 },
  { left: 50.0, top: 35.0, width: 10.6, height: 13.0 },
  { left: 62.2, top: 43.8, width: 10.6, height: 13.0 },
  { left: 68.2, top: 62.4, width: 11.2, height: 13.7 },
  { left: 50.8, top: 58.0, width: 10.8, height: 13.2 }
];
const LIUREN_HAND_BADGE_COLORS = [
  { accent: "#6f8d6b", glow: "rgba(111,141,107,.25)", soft: "rgba(111,141,107,.10)" },
  { accent: "#8b7aaa", glow: "rgba(139,122,170,.23)", soft: "rgba(139,122,170,.10)" },
  { accent: "#b7832f", glow: "rgba(183,131,47,.28)", soft: "rgba(183,131,47,.12)" },
  { accent: "#b06454", glow: "rgba(176,100,84,.24)", soft: "rgba(176,100,84,.10)" },
  { accent: "#c39531", glow: "rgba(195,149,49,.32)", soft: "rgba(195,149,49,.14)" },
  { accent: "#6f91a1", glow: "rgba(111,145,161,.23)", soft: "rgba(111,145,161,.10)" }
];
const LIUREN_FLASH_INTERVAL_SECONDS = 0.2;
const LIUREN_SCREEN_HEIGHT = 1900;
let liurenHasStarted = false;
let liurenXuRecordId = null;
let liurenActiveDate = null;

function formatLiurenDayName(day) {
  const names = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
  return names[day - 1] || `${day}日`;
}

function formatLiurenLunar(lunar) {
  if (!lunar) return "农历未识别";
  const month = `${lunar.isLeap ? "闰" : ""}${LIUREN_MONTHS[lunar.month - 1] || `${lunar.month}月`}`;
  return `${lunar.year}年${month}${lunar.day}日`;
}

function formatLiurenLunarBrief(lunar, hourName) {
  if (!lunar) return "农历未识别";
  const month = `${lunar.isLeap ? "闰" : ""}${LIUREN_MONTHS[lunar.month - 1] || `${lunar.month}月`}`;
  return `${month} ${formatLiurenDayName(lunar.day)} ${hourName}时`;
}

function getLiurenLunar(date) {
  if (typeof solarToLunar !== "function") throw new Error("农历转换模块未加载，请刷新后重试");
  const lunar = solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
  if (!lunar) throw new Error("当前日期超出农历支持范围");
  return lunar;
}

function getLiurenResultByDate(date) {
  const lunar = getLiurenLunar(date);
  const hourIndex = getWentianTimeIndex(date.getHours(), date.getMinutes());
  const hourNumber = hourIndex + 1;
  const monthPalaceIndex = (lunar.month - 1) % LIUREN_PALACES.length;
  const dayPalaceIndex = (monthPalaceIndex + lunar.day - 1) % LIUREN_PALACES.length;
  const palaceIndex = (dayPalaceIndex + hourNumber - 1) % LIUREN_PALACES.length;
  const palace = LIUREN_PALACES[palaceIndex];
  return {
    date,
    lunar,
    hourIndex,
    hourName: LIUREN_HOURS[hourIndex] || "子",
    hourNumber,
    monthPalaceIndex,
    dayPalaceIndex,
    palaceIndex,
    palace,
    formula: `${lunar.month}月 → ${lunar.day}日 → ${hourNumber}时位`
  };
}

function getLiurenInputDate() {
  if (!document.getElementById("liuren-year")) {
    return new Date((liurenActiveDate || new Date()).getTime());
  }
  const year = getWentianNumber("liuren-year");
  const month = getWentianNumber("liuren-month");
  const day = getWentianNumber("liuren-day");
  const hour = getWentianNumber("liuren-hour");
  const minute = getWentianNumber("liuren-minute");
  if (!year || !month || !day) throw new Error("请先补全公历日期");
  if (year < 1900 || year > 2099) throw new Error("年份请填写 1900-2099");
  const date = new Date(year, month - 1, day, hour, minute);
  if (Number.isNaN(date.getTime()) || date.getMonth() !== month - 1 || date.getDate() !== day) throw new Error("日期无效");
  return date;
}

function renderLiurenTrack(result, reveal = true) {
  return LIUREN_PALACES.map((item, index) => `
    <div class="liuren-track-item ${reveal && index === result.palaceIndex ? "is-active" : ""} ${item.tone === "good" ? "is-good" : "is-warn"}">
      <em>${index + 1}</em>
      <strong>${item.name}</strong>
      <span>${item.nature}</span>
    </div>
  `).join("");
}

function getLiurenHandBadgeStyle(index, order = index) {
  const point = LIUREN_HAND_POINTS[index] || LIUREN_HAND_POINTS[0];
  const color = LIUREN_HAND_BADGE_COLORS[index] || LIUREN_HAND_BADGE_COLORS[0];
  return [
    `--x:${point.left}%`,
    `--y:${point.top}%`,
    `--badge-width:${point.width}%`,
    `--badge-height:${point.height}%`,
    `--badge-order:${order}`,
    `--badge-accent:${color.accent}`,
    `--badge-glow:${color.glow}`,
    `--badge-soft:${color.soft}`
  ].join(";");
}

function getLiurenVisualSequence(result) {
  const sequence = [];
  const pushWalk = (fromIndex, steps, includeStart = true) => {
    if (includeStart) sequence.push(fromIndex % LIUREN_PALACES.length);
    for (let step = 1; step <= steps; step += 1) {
      sequence.push((fromIndex + step) % LIUREN_PALACES.length);
    }
  };
  pushWalk(0, Math.max(0, result.lunar.month - 1), true);
  pushWalk(result.monthPalaceIndex, Math.max(0, result.lunar.day - 1), true);
  pushWalk(result.dayPalaceIndex, Math.max(0, result.hourNumber - 1), true);
  if (sequence[sequence.length - 1] !== result.palaceIndex) sequence.push(result.palaceIndex);
  return sequence;
}

function renderLiurenPalaceBadges(result, reveal = true) {
  const finalIndex = reveal ? result.palaceIndex : -1;
  return LIUREN_PALACES.map((palace, index) => `
    <span class="liuren-palace-button ${palace.tone === "good" ? "is-good" : "is-warn"} ${index === finalIndex ? "is-final" : ""}" style="${getLiurenHandBadgeStyle(index)}">
      <i>${index + 1}</i>
      <strong>${palace.name}</strong>
      <em>${palace.nature}</em>
    </span>
  `).join("");
}

function renderLiurenPalacePulses(result) {
  return getLiurenVisualSequence(result).map((index, order) => {
    const palace = LIUREN_PALACES[index] || LIUREN_PALACES[0];
    return `
      <span class="liuren-palace-pulse ${palace.tone === "good" ? "is-good" : "is-warn"}" style="${getLiurenHandBadgeStyle(index, order)};--pulse-delay:${(order * LIUREN_FLASH_INTERVAL_SECONDS).toFixed(2)}s;">
        <i>${index + 1}</i>
        <strong>${palace.name}</strong>
        <em>${palace.nature}</em>
      </span>
    `;
  }).join("");
}

function renderLiurenPath(result, reveal = true) {
  const items = [
    ["月令", `${result.lunar.month}月`, LIUREN_PALACES[result.monthPalaceIndex]?.name || "-"],
    ["日辰", `${result.lunar.day}日`, LIUREN_PALACES[result.dayPalaceIndex]?.name || "-"],
    ["时辰", `${result.hourName}时`, reveal ? result.palace.name : "待起课"]
  ];
  const activePalace = reveal ? result.palace.name : "待起课";
  const visualSequence = reveal ? getLiurenVisualSequence(result) : [];
  const finalDelay = reveal ? visualSequence.length * LIUREN_FLASH_INTERVAL_SECONDS + 0.1 : 0;
  return `
    <div class="liuren-hand-board ${reveal ? "is-revealed" : "is-idle"}" style="--liuren-step-duration:${LIUREN_FLASH_INTERVAL_SECONDS.toFixed(2)}s;--liuren-final-delay:${finalDelay.toFixed(2)}s;" aria-label="小六壬掌诀三指六位推演图">
      <img src="../images/wentian-prototype-assets/liuren-hand-board-base.png" alt="" aria-hidden="true" loading="eager" decoding="sync" fetchpriority="high" onerror="this.onerror=null;this.src='../images/wentian-prototype-assets/liuren-hand-board.png';">
      <div class="liuren-palace-layer" aria-hidden="true">${renderLiurenPalaceBadges(result, reveal)}</div>
      ${reveal ? `<div class="liuren-palace-pulses" aria-hidden="true">${renderLiurenPalacePulses(result)}</div>` : ""}
      <div class="liuren-hand-a11y" aria-live="polite">
        ${items.map(([label, value, palace]) => `<span>${label}：${value}，${palace}</span>`).join("")}
        <span>当前落宫：${activePalace}</span>
      </div>
    </div>
  `;
}

function getLiurenProcessRows(result) {
  const monthPalace = LIUREN_PALACES[result.monthPalaceIndex]?.name || "-";
  const dayPalace = LIUREN_PALACES[result.dayPalaceIndex]?.name || "-";
  return [
    { label: "月令步数", from: "大安", steps: Math.max(0, result.lunar.month - 1), to: monthPalace, final: false },
    { label: "日令步数", from: monthPalace, steps: Math.max(0, result.lunar.day - 1), to: dayPalace, final: false },
    { label: "时令步数", from: dayPalace, steps: Math.max(0, result.hourNumber - 1), to: result.palace.name, final: true }
  ];
}

function getLiurenProcessLines(result) {
  return getLiurenProcessRows(result).map((row) => {
    const action = row.steps > 0 ? `从${row.from}开始走 ${row.steps} 步` : `从${row.from}起，原位不动`;
    return `${row.label}：${action} → ${row.final ? "最终到达" : "到达"}：${row.to}`;
  });
}

function renderLiurenProcess(result, reveal = true) {
  if (!reveal) return "";
  const rows = getLiurenProcessRows(result);
  return `
    <details class="liuren-process-card">
      <summary class="liuren-process-head" aria-label="查看六壬推算过程">
        <div>
          <span>推算过程</span>
          <strong>传统农历日期：${formatLiurenLunarBrief(result.lunar, result.hourName)}</strong>
        </div>
        <em>${result.palace.name}</em>
      </summary>
      <div class="liuren-process-list">
        ${rows.map((row, index) => {
          const action = row.steps > 0 ? `从${row.from}开始走 ${row.steps} 步` : `从${row.from}起，原位不动`;
          return `
            <div class="liuren-process-step ${row.final ? "is-final" : ""}">
              <i>${index + 1}</i>
              <div>
                <span>${row.label}</span>
                <strong>${action}</strong>
                <em>${row.final ? "最终到达" : "到达"}：${row.to}</em>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </details>
  `;
}

function renderLiurenResultHtml(result, reveal = true) {
  if (!reveal) {
    return `
      <article class="liuren-result-card is-waiting">
        <div class="liuren-result-top">
          <div>
            <span class="liuren-kicker">等待起课</span>
            <h3>先定念<small>待</small></h3>
          </div>
          <div class="liuren-seal">念</div>
        </div>
        <p class="liuren-summary">心里只问一件事，确认当下时间后再起课。不要反复重占同一件事。</p>
        <div class="liuren-tags"><span>定念</span><span>当下</span><span>一事一占</span></div>
        <textarea id="liuren-copy-text" class="liuren-copy-text" readonly></textarea>
      </article>
    `;
  }
  const palace = result.palace;
  const copyText = [
    `六壬法：${palace.name}（${palace.nature}）`,
    `公历：${formatWentianDateTime(result.date)}`,
    `农历：${formatLiurenLunar(result.lunar)} · ${result.hourName}时`,
    ...getLiurenProcessLines(result),
    `解读：${palace.summary}`,
    `建议：${palace.advice}`
  ].join("\n");
  return `
    <article class="liuren-result-card ${palace.tone === "good" ? "is-good" : "is-warn"}">
      <div class="liuren-result-top">
        <div>
          <span class="liuren-kicker">占卜结果</span>
          <h3>${palace.name}<small>${palace.nature}</small></h3>
        </div>
        <div class="liuren-seal">${palace.name.slice(0, 1)}</div>
      </div>
      <p class="liuren-summary">${palace.summary}</p>
      <div class="liuren-tags">${palace.keys.map((key) => `<span>${key}</span>`).join("")}</div>
      <div class="liuren-detail">
        <strong>当前课式</strong>
        <span>${formatLiurenLunar(result.lunar)} · ${result.hourName}时 · ${result.formula}</span>
      </div>
      <div class="liuren-detail">
        <strong>行动建议</strong>
        <span>${palace.advice}</span>
      </div>
      <textarea id="liuren-copy-text" class="liuren-copy-text" readonly>${escapeHtml(copyText)}</textarea>
    </article>
  `;
}

function populateLiurenSelects() {
  const month = document.getElementById("liuren-month");
  const day = document.getElementById("liuren-day");
  const hour = document.getElementById("liuren-hour");
  const minute = document.getElementById("liuren-minute");
  if (month && !month.options.length) month.innerHTML = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}月</option>`).join("");
  if (hour && !hour.options.length) hour.innerHTML = Array.from({ length: 24 }, (_, i) => `<option value="${i}">${padWentianNumber(i)}时</option>`).join("");
  if (minute && !minute.options.length) minute.innerHTML = Array.from({ length: 60 }, (_, i) => `<option value="${i}">${padWentianNumber(i)}分</option>`).join("");
  updateLiurenDayOptions();
  if (day && !day.value) day.value = "1";
}

function updateLiurenDayOptions() {
  const day = document.getElementById("liuren-day");
  if (!day) return;
  const previous = Number(day.value) || 1;
  const year = getWentianNumber("liuren-year") || new Date().getFullYear();
  const month = getWentianNumber("liuren-month") || 1;
  const max = new Date(year, month, 0).getDate();
  day.innerHTML = Array.from({ length: max }, (_, i) => `<option value="${i + 1}">${i + 1}日</option>`).join("");
  day.value = String(Math.min(previous, max));
}

function setLiurenDateTime(date, options = {}) {
  liurenActiveDate = new Date(date.getTime());
  populateLiurenSelects();
  const year = document.getElementById("liuren-year");
  const month = document.getElementById("liuren-month");
  const day = document.getElementById("liuren-day");
  const hour = document.getElementById("liuren-hour");
  const minute = document.getElementById("liuren-minute");
  if (year) year.value = String(date.getFullYear());
  if (month) month.value = String(date.getMonth() + 1);
  updateLiurenDayOptions();
  if (day) day.value = String(date.getDate());
  if (hour) hour.value = String(date.getHours());
  if (minute) minute.value = String(date.getMinutes());
  updateLiurenPreview({ reveal: options.reveal ?? liurenHasStarted });
}

function setLiurenStatus(text, tone = "") {
  const status = document.getElementById("liuren-status");
  if (!status) return;
  status.textContent = text || "";
  status.dataset.tone = tone;
}

function updateLiurenPreview(options = {}) {
  const preview = document.getElementById("liuren-preview");
  const track = document.getElementById("liuren-track");
  const path = document.getElementById("liuren-path");
  const process = document.getElementById("liuren-process");
  const resultWrap = document.getElementById("liuren-result");
  const startText = document.querySelector("[data-liuren-start-text]");
  const reveal = options.reveal ?? liurenHasStarted;
  try {
    const result = getLiurenResultByDate(getLiurenInputDate());
    if (preview) {
      preview.innerHTML = `
        <span>当前课时</span>
        <strong>${result.hourName}时</strong>
        <em>${formatLiurenLunar(result.lunar)}</em>
        <small>${formatWentianDateTime(result.date)}</small>
      `;
    }
    if (track) track.innerHTML = renderLiurenTrack(result, reveal);
    if (path) path.innerHTML = renderLiurenPath(result, reveal);
    if (process) process.innerHTML = renderLiurenProcess(result, reveal);
    if (resultWrap) resultWrap.innerHTML = renderLiurenResultHtml(result, reveal);
    if (startText) startText.textContent = reveal ? "重新定念起课" : "默念后起课";
    const askButton = document.querySelector('[data-action="liuren-ask-xu"]');
    if (askButton) {
      askButton.disabled = !reveal;
      askButton.textContent = reveal ? "追问许半仙" : "起课后问许半仙";
    }
    setLiurenStatus(reveal ? "已按农历月日时起课" : "已取当下时间，先定念再起课", reveal ? "ok" : "");
  } catch (error) {
    if (preview) preview.innerHTML = "<span>当前课时</span><strong>待起课</strong><em>请补全时间</em>";
    if (process) process.innerHTML = "";
    setLiurenStatus(error.message || "起课失败", "error");
  }
}

function initLiurenScreen() {
  if (!document.querySelector(".liuren-panel")) return;
  liurenHasStarted = false;
  liurenXuRecordId = null;
  setLiurenDateTime(new Date(), { reveal: false });
}

function calculateLiurenFromInputs() {
  liurenHasStarted = true;
  liurenXuRecordId = makeWentianUuid();
  updateLiurenPreview({ reveal: true });
}

function resetLiuren() {
  liurenHasStarted = false;
  liurenXuRecordId = null;
  setLiurenDateTime(new Date(), { reveal: false });
}

async function copyLiurenResult() {
  const text = document.getElementById("liuren-copy-text")?.value || "";
  if (!text) return;
  try {
    if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
    await navigator.clipboard.writeText(text);
    setLiurenStatus("结果已复制", "ok");
  } catch (_err) {
    setLiurenStatus("复制受限，可长按结果手动复制", "error");
  }
}

function makeLiurenXuContext() {
  if (!liurenHasStarted) return null;
  const result = getLiurenResultByDate(getLiurenInputDate());
  const recordId = liurenXuRecordId || makeWentianUuid();
  liurenXuRecordId = recordId;
  const monthPalace = LIUREN_PALACES[result.monthPalaceIndex]?.name || "";
  const dayPalace = LIUREN_PALACES[result.dayPalaceIndex]?.name || "";
  const lunarText = formatLiurenLunar(result.lunar);
  const castAtText = formatWentianDateTime(result.date);
  return {
    type: "liuren",
    recordId,
    title: `六壬法：${result.palace.name}`,
    question: "默念之事",
    summaryLine: `${result.palace.name} · ${result.palace.nature}`,
    createdAt: result.date.getTime(),
    castAtText,
    lunarText,
    hourName: result.hourName,
    hourNumber: result.hourNumber,
    monthPalace,
    dayPalace,
    processLines: getLiurenProcessLines(result),
    palaceIndex: result.palaceIndex,
    palaceName: result.palace.name,
    nature: result.palace.nature,
    keys: result.palace.keys,
    summary: result.palace.summary,
    advice: result.palace.advice,
    formula: result.formula,
    copyText: document.getElementById("liuren-copy-text")?.value || "",
  };
}

function getLiurenXuOpeningMessage(context) {
  if (!context) return "我按这课看当下这件事。你先把所问之事说清楚，我看成败、快慢和下一步。";
  return [
    "我按这课看当下这件事。",
    `当前课落「${context.palaceName}」，${context.nature}；${context.summary}`,
    "你可以直接说具体事情，我按这个课看成败、快慢、阻力和该怎么做。"
  ].join("\n");
}

function openLiurenXuChat() {
  const context = makeLiurenXuContext();
  if (!context) {
    setLiurenStatus("先定念起课，再追问许半仙", "error");
    return;
  }
  setWentianXuChatContext(context);
  navigate("screen-4");
}

function makeLiurenInitialResult(date) {
  try {
    return getLiurenResultByDate(date);
  } catch (_err) {
    const hourIndex = getWentianTimeIndex(date.getHours(), date.getMinutes());
    return {
      date,
      lunar: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), isLeap: false },
      hourIndex,
      hourName: LIUREN_HOURS[hourIndex] || "子",
      hourNumber: hourIndex + 1,
      monthPalaceIndex: 0,
      dayPalaceIndex: 0,
      palaceIndex: 0,
      palace: LIUREN_PALACES[0],
      formula: "待农历换算"
    };
  }
}

function sourceLiurenScreen() {
  const initial = makeLiurenInitialResult(new Date());
  return `
    ${figBox("lr46-bg", 0, 0, 390, LIUREN_SCREEN_HEIGHT, "", "background:linear-gradient(180deg,#fffaf3 0%,#fbf5eb 46%,#fffaf3 100%);")}
    ${wentianSimpleHeader("lr46", "六壬法", "教程")}
    ${figButton("lr46-tutorial-hit", 318, 38, 62, 54, 'data-route="screen-47"')}
    <section class="liuren-panel">
      <div class="liuren-hero-card">
        <div class="liuren-hero-shade"></div>
        <div class="liuren-hero-copy">
          <span>小六壬起课</span>
          <strong>先定一念，再看六宫</strong>
          <em>农历月令起，大安顺推至时辰。</em>
        </div>
      </div>
      <div class="liuren-intent-card">
        <strong>起课前</strong>
        <span>心里只问一件事，不用输入问题。确认当下时间后点击起课。</span>
      </div>
      <div class="liuren-now-card">
        <div id="liuren-preview" class="liuren-preview">
          <span>当前课时</span>
          <strong>${initial.hourName}时</strong>
          <em>${formatLiurenLunar(initial.lunar)}</em>
          <small>${formatWentianDateTime(initial.date)}</small>
        </div>
        <button type="button" class="liuren-now" data-action="liuren-use-now">重新取时</button>
      </div>
      <button type="button" class="liuren-start" data-action="liuren-calc"><span data-liuren-start-text>默念后起课</span></button>
      <div id="liuren-path">${renderLiurenPath(initial, false)}</div>
      <div id="liuren-process">${renderLiurenProcess(initial, false)}</div>
      <div id="liuren-track" class="liuren-track">${renderLiurenTrack(initial, false)}</div>
      <div id="liuren-result">${renderLiurenResultHtml(initial, false)}</div>
      <div class="liuren-actions">
        <button type="button" class="primary liuren-ask-xu" data-action="liuren-ask-xu" disabled>起课后问许半仙</button>
        <button type="button" class="primary liuren-reset-action" data-action="liuren-reset">重新定念</button>
      </div>
      <p id="liuren-status" class="liuren-status">已取当下时间，先定念再起课</p>
    </section>
  `;
}

function sourceLiurenTutorialScreen() {
  const steps = [
    ["一", "取当下时间", "进入页面会自动读取手机当前公历时间，并换算成农历月日与时辰。"],
    ["二", "从大安顺推", "农历月份从大安起，接着推农历日期，再推十二时辰。"],
    ["三", "看落宫吉凶", "落到大安、速喜、小吉为吉；留连、赤口、空亡偏凶。"],
    ["四", "只作参考", "六壬法适合快速看当下气象，重要决策仍需结合完整命盘与现实信息。"]
  ];
  return `
    ${figBox("lr47-bg", 0, 0, 390, 844, "", "background:linear-gradient(180deg,#fffaf3 0%,#fbf5eb 100%);")}
    ${wentianSimpleHeader("lr47", "六壬法教程")}
    ${figText("lr47-main-title", "怎么起课", 24, 112, 150, 24, "#201812", 900, "left", "font-family:'Noto Serif SC','Songti SC',serif;")}
    ${figText("lr47-sub", "不用输入问题，直接以当前农历时间取象。", 24, 146, 280, 13, "#817568", 600)}
    ${steps.map(([num, title, desc], index) => {
      const y = 198 + index * 112;
      return `
        ${figBox(`lr47-step-${index}`, 24, y, 342, 88, "", "border:1px solid #eadfce;border-radius:18px;background:#fffdf8;box-shadow:0 10px 24px rgba(70,45,25,.07);")}
        ${figBox(`lr47-num-${index}`, 44, y + 24, 34, 34, "", "border-radius:17px;background:#9e4738;")}
        ${figText(`lr47-num-text-${index}`, num, 44, y + 32, 34, 13, "#fffaf3", 900, "center")}
        ${figText(`lr47-step-title-${index}`, title, 94, y + 20, 180, 15, "#201812", 900)}
        ${figText(`lr47-step-desc-${index}`, desc, 94, y + 48, 236, 12, "#817568", 600, "left", "line-height:1.45;")}
      `;
    }).join("")}
    ${figBox("lr47-palace", 24, 662, 342, 76, "", "border:1px solid #eadfce;border-radius:18px;background:#fffdf8;")}
    ${figText("lr47-palace-title", "六宫顺序", 44, 682, 88, 15, "#201812", 900)}
    ${figText("lr47-palace-list", "大安 → 留连 → 速喜 → 赤口 → 小吉 → 空亡", 44, 710, 290, 13, "#6e6254", 700)}
    ${figBox("lr47-go", 42, 772, 306, 50, "", "border-radius:25px;background:linear-gradient(180deg,#b74e39,#983323);box-shadow:0 12px 24px rgba(158,61,43,.22);")}
    ${figButton("lr47-go-hit", 42, 772, 306, 50, 'data-route="screen-46"')}
    ${figText("lr47-go-text", "开始起课", 42, 786, 306, 16, "#fffaf3", 900, "center")}
  `;
}

function renderWentianPolishedScreen(screen) {
  const no = screen.no;
  if (no === 42) return sourceYangzhaiCompassScreen();
  if (no === 43) return sourceYangzhaiSelectScreen();
  if (no === 44) return sourceYangzhaiResultScreen();
  if (no === 45) return sourceYangzhaiTutorialScreen();
  if (no === 46) return sourceLiurenScreen();
  if (no === 47) return sourceLiurenTutorialScreen();
  if (no >= 17 && no <= 19) return sourceLiuyaoCastScreen();
  if (no === 20) return sourceLiuyaoResultScreen();
  if (no === 30) return sourcePaymentScreen();
  if (no === 33) return sourceMembershipScreen();
  if (no === 49) return sourceHepanResultScreen();
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
    return sourceHepanTypeScreen();
  }
  if (no === 11) {
    return sourceHepanSelectScreen();
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
      ${figText("wt21-desc", "免费用户 30次/天，付费用户 100次/天；每日刷新，不设月额度。", 70, 450, 250, 13, "#756d63", 500, "center", "line-height:1.5;")}
      ${figBox("wt21-vip", 58, 510, 274, 38, "", "border-radius:6px;background:#d1a43b;")}
      ${figText("wt21-vip-text", "开通付费版", 58, 520, 274, 13, "#fff", 800, "center")}
      ${figBox("wt21-buy", 58, 558, 274, 38, "", "border-radius:6px;background:#a73f35;")}
      ${figText("wt21-buy-text", "查看套餐规则", 58, 568, 274, 13, "#fff", 800, "center")}
      ${figBox("wt21-cancel", 58, 604, 274, 28, "", "border:1px solid #eadfce;border-radius:6px;background:#fff;")}
      ${figText("wt21-cancel-text", "取消", 58, 611, 274, 12, "#756d63", 700, "center")}
      ${figButton("wt21-pay-hit", 58, 558, 274, 38, 'data-route="screen-29"')}
    `;
  }
  if (no === 22) {
    const invite = getWentianInviteSnapshot();
    const account = getWentianAuthDisplay();
    const code = invite.inviteCode;
    const pendingCode = getWentianPendingInviteCode();
    const bound = getWentianLocalInviteStatus();
    const status = wentianInviteState.status || wentianInviteState.error || (pendingCode ? `待绑定邀请码：${pendingCode}` : (bound?.inviteCode ? `已绑定邀请码：${bound.inviteCode}` : ""));
    const records = (invite.records || []).slice(0, 3);
    if (!account.loggedIn) {
      return `
      ${figBox("wt22-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt22", "邀请好友")}
      ${figBox("wt22-login-card", 16, 112, 358, 178, "", "border-radius:18px;background:linear-gradient(135deg,#d5ad42,#9f741d);box-shadow:0 12px 26px rgba(121,82,18,.18);")}
      ${figText("wt22-login-title", "登录后生成专属邀请码", 38, 154, 260, 22, "#fff", 900)}
      ${figText("wt22-login-desc", "邀请好友注册、首付奖励和收益记录都会绑定到你的账号。", 38, 194, 292, 13, "#fff6df", 800, "left", "line-height:1.55;")}
      ${figBox("wt22-login-btn", 38, 234, 140, 38, "", "border-radius:19px;background:#fff;")}
      ${figButton("wt22-login-hit", 38, 234, 140, 38, 'data-route="screen-40"')}
      ${figText("wt22-login-text", "登录 / 注册", 38, 246, 140, 12, "#9b742e", 900, "center")}

      ${figBox("wt22-bind", 16, 320, 358, 148, "", "border-radius:18px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText("wt22-bind-title", "我有好友邀请码", 38, 346, 140, 15, "#25211d", 900)}
      ${figText("wt22-bind-desc", "先填在这里也可以；登录/注册后自动绑定。", 38, 372, 286, 12, "#8f867b", 700)}
      <input id="wentian-invite-bind-input" class="wentian-invite-input" style="left:38px;top:406px;width:200px" value="${escapeHtml(pendingCode || "")}" placeholder="输入邀请码">
      ${figBox("wt22-bind-btn", 252, 406, 88, 38, "", "border-radius:19px;background:#b74e39;")}
      ${figButton("wt22-bind-hit", 252, 406, 88, 38, 'data-action="wentian-invite-bind"')}
      ${figText("wt22-bind-text", "绑定", 252, 418, 88, 12, "#fff", 900, "center")}
      <div id="wentian-invite-status" class="wentian-invite-status" style="left:38px;top:456px;width:314px" data-tone="${wentianInviteState.error ? "error" : ""}">${escapeHtml(status)}</div>

      ${figBox("wt22-rule", 16, 506, 358, 134, "", "border-radius:18px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.07);")}
      ${figText("wt22-rule-title", "奖励规则", 42, 532, 110, 16, "#25211d", 900)}
      ${figText("wt22-rule-desc", "好友注册成功：双方各得 2 次对话奖励。<br>好友首次付费：邀请人再得 10 次对话奖励。", 42, 564, 292, 13, "#756d63", 700, "left", "line-height:1.55;")}
    `;
    }
    return `
      ${figBox("wt22-bg", 0, 0, 390, 1120, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt22", "邀请好友", "刷新")}
      ${figButton("wt22-refresh-hit", 318, 38, 62, 54, 'data-action="wentian-invite-refresh"')}
      ${figBox("wt22-top", 16, 94, 358, 112, "", "border-radius:18px;background:linear-gradient(135deg,#d5ad42,#9f741d);box-shadow:0 12px 26px rgba(121,82,18,.18);")}
      ${figText("wt22-num", String(invite.invitedCount || 0), 44, 118, 80, 36, "#fff", 900)}
      ${figText("wt22-num-label", "邀请好友人数", 44, 162, 130, 13, "#fff6df", 800)}
      ${figText("wt22-reward", `可用奖励 ${Number(invite.bonusRemaining ?? invite.bonusTalks ?? 0)} 次`, 214, 122, 120, 14, "#fff7df", 900, "right")}
      ${figText("wt22-paid", `首付好友 ${Number(invite.paidCount || 0)} 人`, 214, 158, 120, 12, "#fff1cc", 700, "right")}

      ${figBox("wt22-code", 16, 226, 358, 172, "", "border-radius:18px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText("wt22-code-title", "我的邀请码", 38, 250, 100, 13, "#8f867b", 800)}
      ${figText("wt22-code-num", formatWentianInviteCode(code), 38, 282, 314, 24, "#25211d", 900, "center")}
      ${figBox("wt22-copy-code", 36, 328, 96, 38, "", "border-radius:19px;background:#d0a03a;")}
      ${figButton("wt22-copy-code-hit", 36, 328, 96, 38, 'data-action="wentian-invite-copy-code"')}
      ${figText("wt22-copy-code-text", "复制码", 36, 340, 96, 12, "#fff", 900, "center")}
      ${figBox("wt22-copy-link", 146, 328, 96, 38, "", "border-radius:19px;background:#25211d;")}
      ${figButton("wt22-copy-link-hit", 146, 328, 96, 38, 'data-action="wentian-invite-copy-link"')}
      ${figText("wt22-copy-link-text", "复制链接", 146, 340, 96, 12, "#fff", 900, "center")}
      ${figBox("wt22-share", 256, 328, 96, 38, "", "border-radius:19px;background:#fff7ec;border:1px solid #ead9bd;")}
      ${figButton("wt22-share-hit", 256, 328, 96, 38, 'data-action="wentian-invite-share"')}
      ${figText("wt22-share-text", "系统分享", 256, 340, 96, 12, "#9b742e", 900, "center")}

      ${figBox("wt22-bind", 16, 422, 358, 140, "", "border-radius:18px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.08);")}
      ${figText("wt22-bind-title", "绑定好友邀请码", 38, 446, 140, 15, "#25211d", 900)}
      ${figText("wt22-bind-desc", "收到好友邀请码时填在这里；登录后每个账号只绑定一次。", 38, 472, 286, 12, "#8f867b", 700)}
      <input id="wentian-invite-bind-input" class="wentian-invite-input" style="left:38px;top:506px;width:200px" value="${escapeHtml(pendingCode || "")}" placeholder="输入邀请码">
      ${figBox("wt22-bind-btn", 252, 506, 88, 38, "", "border-radius:19px;background:#b74e39;")}
      ${figButton("wt22-bind-hit", 252, 506, 88, 38, 'data-action="wentian-invite-bind"')}
      ${figText("wt22-bind-text", "绑定", 252, 518, 88, 12, "#fff", 900, "center")}
      <div id="wentian-invite-status" class="wentian-invite-status" style="left:38px;top:574px;width:314px" data-tone="${wentianInviteState.error ? "error" : ""}">${escapeHtml(status)}</div>

      ${figBox("wt22-rule", 16, 618, 358, 134, "", "border-radius:18px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.07);")}
      ${figText("wt22-rule-title", "奖励规则", 42, 644, 110, 16, "#25211d", 900)}
      ${figText("wt22-rule-desc", `好友注册成功：双方各得 ${invite.registerReward || 2} 次对话奖励。<br>好友首次付费：邀请人再得 ${invite.paidReward || 10} 次对话奖励。`, 42, 676, 292, 13, "#756d63", 700, "left", "line-height:1.55;")}

      ${figBox("wt22-record", 16, 780, 358, 244, "", "border-radius:18px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.07);")}
      ${figText("wt22-record-title", "收益记录", 42, 806, 110, 16, "#25211d", 900)}
      ${wentianInviteState.loading ? figText("wt22-loading", "正在读取邀请记录...", 42, 854, 260, 13, "#8f867b", 700) : records.length ? records.map((item, index) => {
        const y = 848 + index * 48;
        return `
          ${figText(`wt22-record-name-${index}`, escapeHtml(item.label || "好友账号"), 42, y, 138, 13, "#25211d", 800)}
          ${figText(`wt22-record-date-${index}`, escapeHtml(formatWentianMemberDate(item.joinedAt) || "已注册"), 42, y + 22, 138, 11, "#9a9289", 600)}
          ${figText(`wt22-record-reward-${index}`, item.paidAt ? `+${invite.paidReward || 10} 次` : `+${invite.registerReward || 2} 次`, 262, y + 4, 72, 13, item.paidAt ? "#b74e39" : "#9b742e", 900, "right")}
        `;
      }).join("") : figText("wt22-empty", "暂无邀请记录，复制链接发给好友即可开始。", 42, 866, 272, 13, "#9a9289", 700)}
    `;
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
          ${figText(`wt22-rule-desc-${index}`, "好友注册后双方可获得对话次数奖励，完成付费后可继续返利。", 42, y + 50, 278, 13, "#756d63", 500, "left", "line-height:1.45;")}
        `;
      }).join("")}
      ${sourceAppBottomNav("藏宝阁", 780)}
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
      ${figText("wt24-hero-copy", "邀请好友注册阅天AI，双方都可获得对话次数奖励。", 54, 190, 250, 12, "#fff5dc", 600)}

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
      ${[["好友注册", "可获得：2 次对话", "立即到账"], ["邀请满 3 人", "额外获得：会员体验券", "阶段奖励"], ["邀请满 10 人", "额外获得：高级报告券", "进阶奖励"]].map(([title, desc, tag], index) => {
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
      ${figText("wt24-pay-title", "好友首次付费奖励", 44, 892, 150, 16, "#25211d", 800)}
      ${figText("wt24-pay-desc", "好友完成首次付费后，邀请人可额外获得 10 次对话。", 44, 926, 238, 13, "#756d63", 500, "left", "line-height:1.45;")}
      ${figBox("wt24-pay-badge", 284, 906, 52, 52, "", "border-radius:26px;background:#fff0d6;")}
      ${figText("wt24-pay-badge-text", "+10", 284, 922, 52, 16, "#bd8624", 900, "center")}

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
    const member = getWentianMemberSnapshot();
    return `
      ${figBox("wt29-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt29", "阅天套餐")}
      ${figBox("wt29-balance", 24, 118, 342, 122, "", "border-radius:18px;background:linear-gradient(135deg,#2b2620,#16130f);box-shadow:0 12px 26px rgba(25,18,12,.18);")}
      ${figText("wt29-balance-label", "当前套餐", 48, 146, 130, 15, "#c9b887", 700)}
      ${figText("wt29-balance-num", member.title, 48, 172, 120, 30, "#fff", 900)}
      ${figText("wt29-note", `今日剩余 ${member.daily} · 每日额度 ${member.dailyLimit}`, 48, 208, 260, 13, "#a69b8d", 700)}

      ${figText("wt29-select", "套餐规则", 24, 274, 130, 16, "#25211d", 900)}
      ${figBox("wt29-free", 24, 312, 342, 78, "", "border:1px solid #eadfce;border-radius:14px;background:#fff;box-shadow:0 6px 16px rgba(70,45,25,.06);")}
      ${figText("wt29-free-title", "免费用户", 44, 336, 90, 15, "#25211d", 900)}
      ${figText("wt29-free-quota", "30次/天", 220, 336, 100, 15, "#8d8377", 900, "right")}
      ${figText("wt29-free-desc", "每日自动刷新。", 44, 362, 240, 12, "#8d8377", 700)}
      ${figBox("wt29-paid", 24, 410, 342, 104, "", "border:1px solid #c8a65f;border-radius:16px;background:#fffaf0;box-shadow:0 10px 24px rgba(130,91,31,.10);")}
      ${figText("wt29-paid-title", "付费用户", 44, 436, 90, 16, "#8f3d30", 900)}
      ${figText("wt29-paid-quota", "100次/天", 220, 436, 100, 16, "#8f3d30", 900, "right")}
      ${figText("wt29-paid-desc", "适合连续追问、复盘命盘、做阶段规划。", 44, 470, 260, 13, "#756d63", 700)}
      ${figText("wt29-pay-title", "支付方式", 24, 552, 130, 16, "#25211d", 900)}
      ${figBox("wt29-wechat", 24, 590, 150, 42, "", "border:1px solid #c8a65f;border-radius:21px;background:#fff3d9;")}
      ${figButton("wt29-wechat-hit", 24, 590, 150, 42, 'data-action="wentian-pay-provider" data-provider="wechat"')}
      ${figText("wt29-wechat-text", "微信支付", 24, 603, 150, 12, "#8f3d30", 900, "center")}
      ${figBox("wt29-alipay", 196, 590, 150, 42, "", "border:1px solid #eadfce;border-radius:21px;background:#fffdf8;")}
      ${figText("wt29-alipay-text", "支付宝配置中", 196, 603, 150, 12, "#b4aaa0", 900, "center")}
      ${figText("wt29-terms", "只按每日额度计算：免费 30次/天，付费 100次/天。", 0, 692, 390, 12, "#9e968d", 700, "center")}
      ${figBox("wt29-submit", 42, 736, 306, 50, "", "border-radius:25px;background:linear-gradient(180deg,#b74e39,#983323);box-shadow:0 14px 28px rgba(158,61,43,.20);")}
      ${figButton("wt29-submit-hit", 42, 736, 306, 50, 'data-action="wentian-member-pay"')}
      ${figText("wt29-submit-text", member.isMember ? `续费付费版 ¥${member.amountYuan}` : `开通付费版 ¥${member.amountYuan}`, 42, 751, 306, 14, "#fffaf3", 900, "center")}
    `;
  }
  if (no === 30) {
    return `
      ${figBox("wt30-bg", 0, 0, 390, 844, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 56%,#f3eadc 100%);")}
      ${figButton("wt30-back-hit", 18, 38, 58, 50, 'data-route="screen-29"')}
      ${figText("wt30-back", "‹", 26, 46, 28, 28, "#2b251f", 600, "center")}
      ${figText("wt30-page-title", "确认订单", 0, 52, 390, 22, "#201812", 900, "center")}
      ${figBox("wt30-status-pill", 286, 48, 74, 30, "", "border-radius:15px;background:#f4ead8;border:1px solid #eadbc2;")}
      ${figText("wt30-status-text", "待支付", 286, 56, 74, 12, "#9a6f22", 800, "center")}

      ${figBox("wt30-hero", 24, 108, 342, 128, "", "border-radius:20px;background:linear-gradient(135deg,#b54c3a 0%,#8e3429 100%);box-shadow:0 16px 34px rgba(131,56,39,.18);")}
      ${figText("wt30-hero-label", "阅天AI订单", 46, 132, 120, 13, "#f7e6cf", 700)}
      ${figText("wt30-hero-title", "付费版", 46, 164, 180, 24, "#fffaf3", 900)}
      ${figText("wt30-hero-sub", "100次/天，按日刷新", 46, 202, 230, 13, "#f2d8bd", 600)}
      ${figText("wt30-hero-price", "¥19.90", 250, 154, 92, 26, "#fffaf3", 900, "right")}

      ${figText("wt30-section-a", "订单记录", 24, 274, 120, 18, "#201812", 900)}
      ${figBox("wt30-order-card", 24, 310, 342, 168, "", "border:1px solid #eadfce;border-radius:18px;background:#fffdf8;box-shadow:0 10px 24px rgba(70,45,25,.08);")}
      ${figText("wt30-order-no-label", "订单号", 44, 334, 80, 13, "#8d8377", 600)}
      ${figText("wt30-order-no", "PAY_20260512_cfa12a1e", 132, 334, 190, 13, "#2b251f", 800, "right")}
      ${figLine("wt30-order-line-1", 44, 366, 302, "#efe4d3")}
      ${figText("wt30-order-product-label", "商品", 44, 390, 80, 13, "#8d8377", 600)}
      ${figText("wt30-order-product", "阅天AI付费版", 196, 390, 126, 13, "#2b251f", 800, "right")}
      ${figLine("wt30-order-line-2", 44, 422, 302, "#efe4d3")}
      ${figText("wt30-order-time-label", "创建时间", 44, 446, 80, 13, "#8d8377", 600)}
      ${figText("wt30-order-created", "2026-05-12 15:08", 182, 446, 140, 13, "#2b251f", 700, "right")}

      ${figText("wt30-section-b", "支付方式", 24, 516, 120, 18, "#201812", 900)}
      ${figBox("wt30-method", 24, 552, 342, 72, "", "border:1px solid #d9c8ac;border-radius:18px;background:#fff;box-shadow:0 8px 20px rgba(70,45,25,.06);")}
      ${figBox("wt30-method-icon", 44, 570, 36, 36, "", "border-radius:12px;background:#f5ead5;")}
      ${figText("wt30-method-icon-text", "¥", 44, 580, 36, 15, "#b2822e", 900, "center")}
      ${figText("wt30-method-title", "UniPay 安全支付", 94, 570, 150, 15, "#201812", 900)}
      ${figText("wt30-method-sub", "支持银行卡 / 钱包支付", 94, 596, 160, 12, "#8d8377", 600)}
      ${figText("wt30-method-check", "✓", 326, 577, 22, 18, "#b2822e", 900, "center")}

      ${figBox("wt30-summary", 24, 654, 342, 58, "", "border-radius:16px;background:#fff8e8;border:1px solid #eadbc2;")}
      ${figText("wt30-summary-label", "应付金额", 44, 675, 90, 13, "#7e6f5f", 700)}
      ${figText("wt30-summary-price", "¥19.90", 246, 669, 94, 22, "#a64032", 900, "right")}
      ${figBox("wt30-pay", 42, 736, 306, 50, "", "border-radius:25px;background:linear-gradient(180deg,#b74e39,#983323);box-shadow:0 14px 28px rgba(158,61,43,.22);")}
      ${figButton("wt30-pay-hit", 42, 736, 306, 50, 'data-route="screen-31"')}
      ${figText("wt30-pay-text", "确认支付 ¥19.90", 42, 751, 306, 14, "#fffaf3", 900, "center")}
      ${figText("wt30-safe", "支付信息由服务商加密处理", 0, 804, 390, 11, "#a49b91", 600, "center")}
    `;
  }
  if (no === 33) {
    return `
      ${figBox("wt33-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt33", "阅天套餐")}
      ${figBox("wt33-card", 24, 108, 342, 110, "", "border-radius:14px;background:linear-gradient(135deg,#2b2722,#14110d);")}
      ${figText("wt33-card-title", "免费版", 52, 138, 120, 19, "#fff", 800)}
      ${figText("wt33-card-sub", "30次/天，按日刷新", 52, 170, 160, 13, "#c7bda8", 600)}
      ${["命盘解析", "会员报告", "专属客服"].map((text, index) => `
        ${figBox(`wt33-right-${index}`, 40 + index * 105, 252, 78, 70, "", "border-radius:10px;background:#fff;")}
        ${figText(`wt33-right-icon-${index}`, index === 0 ? "◇" : index === 1 ? "▤" : "♛", 40 + index * 105, 270, 78, 20, "#c49a34", 800, "center")}
        ${figText(`wt33-right-text-${index}`, text, 40 + index * 105, 298, 78, 12, "#25211d", 700, "center")}
      `).join("")}
      ${figText("wt33-plan-title", "选择套餐", 24, 354, 120, 16, "#25211d", 800)}
      ${figBox("wt33-month", 24, 392, 160, 94, "", "border:1px solid #c8a65f;border-radius:12px;background:#fffaf0;")}
      ${figText("wt33-month-title", "付费版", 44, 414, 90, 15, "#25211d", 800)}
      ${figText("wt33-month-price", "¥19.90", 44, 444, 90, 18, "#bd8624", 800)}
      ${figBox("wt33-year", 206, 392, 160, 94, "", "border:1px solid #eadfce;border-radius:12px;background:#fff;")}
      ${figText("wt33-year-title", "每日额度", 226, 414, 90, 15, "#25211d", 800)}
      ${figText("wt33-year-price", "100次/天", 226, 444, 90, 18, "#bd8624", 800)}
      ${figBox("wt33-benefit", 24, 516, 342, 130, "", "border-radius:12px;background:#fff;")}
      ${figText("wt33-benefit-title", "套餐权益", 44, 538, 120, 15, "#25211d", 800)}
      ${figText("wt33-benefit-list", "1. 免费用户 30次/天\\n2. 付费用户 100次/天\\n3. 只按每日额度计算", 44, 572, 260, 13, "#756d63", 500, "left", "line-height:1.8;")}
      ${figBox("wt33-submit", 42, 736, 306, 50, "", "border-radius:25px;background:#c49a34;")}
      ${figButton("wt33-submit-hit", 42, 736, 306, 50, 'data-route="screen-30"')}
      ${figText("wt33-submit-text", "开通付费版 ¥19.90", 42, 751, 306, 14, "#fff", 800, "center")}
    `;
  }
  if (no === 34) {
    const payload = getWentianSharePayload();
    const previewText = escapeHtml(payload.text).replace(/\n/g, "<br>");
    const shareTargets = [
      ["微信好友", "微", "wentian-share-wechat"],
      ["朋友圈", "圈", "wentian-share-moments"],
      ["系统分享", "享", "wentian-share-system"],
      ["邮件", "邮", "wentian-share-mail"],
    ];
    return `
      ${sourceMineScreen(screen)}
      ${figBox("wt34-overlay", 0, 0, 390, 755, "", "background:rgba(0,0,0,.30);")}
      ${figBox("wt34-sheet", 0, 432, 390, 323, "", "border-radius:22px 22px 0 0;background:#fff;box-shadow:0 -10px 28px rgba(45,31,18,.16);")}
      ${figText("wt34-title", "分享阅天AI", 0, 462, 390, 18, "#25211d", 900, "center")}
      ${figText("wt34-close", "×", 334, 460, 28, 24, "#25211d", 500, "center")}
      ${figButton("wt34-close-hit", 322, 450, 52, 46, 'data-route="screen-31"')}
      ${figBox("wt34-copy", 28, 506, 334, 92, "", "border-radius:12px;background:#fffaf2;border:1px solid #ead9bd;")}
      ${figText("wt34-copy-text", previewText, 44, 524, 302, 13, "#756d63", 700, "left", "line-height:1.45;")}
      ${shareTargets.map(([label, icon, action], index) => {
        const x = 38 + index * 82;
        return `
          ${figBox(`wt34-share-${index}`, x, 628, 50, 50, "", "border-radius:25px;background:#f7ebd4;")}
          ${figButton(`wt34-share-hit-${index}`, x - 7, 620, 64, 78, `data-action="${action}"`)}
          ${figText(`wt34-share-icon-${index}`, icon, x, 644, 50, 14, "#bd8624", 900, "center")}
          ${figText(`wt34-share-label-${index}`, label, x - 12, 688, 74, 12, "#756d63", 800, "center")}
        `;
      }).join("")}
      <div id="wentian-share-status" class="wentian-invite-status" style="left:42px;top:724px;width:306px;text-align:center" data-tone="">${escapeHtml(wentianInviteState.status || "")}</div>
    `;
    const account = getWentianAuthDisplay();
    if (!account.loggedIn) {
      return `
      ${sourceMineScreen(screen)}
      ${figBox("wt34-overlay", 0, 0, 390, 844, "", "background:rgba(0,0,0,.3);")}
      ${figBox("wt34-sheet", 0, 604, 390, 240, "", "border-radius:22px 22px 0 0;background:#fff;")}
      ${figText("wt34-title", "分享阅天AI", 0, 632, 390, 18, "#25211d", 800, "center")}
      ${figText("wt34-close", "×", 334, 630, 28, 24, "#25211d", 400, "center")}
      ${figButton("wt34-close-hit", 322, 620, 52, 46, 'data-route="screen-31"')}
      ${figText("wt34-login-desc", "登录后生成专属邀请链接，好友注册和首付奖励会自动记到你的账号。", 42, 682, 306, 13, "#756d63", 700, "center", "line-height:1.55;")}
      ${figBox("wt34-login-btn", 78, 748, 234, 46, "", "border-radius:23px;background:#b74e39;")}
      ${figButton("wt34-login-hit", 78, 748, 234, 46, 'data-route="screen-40"')}
      ${figText("wt34-login-text", "登录 / 注册", 78, 763, 234, 12, "#fff", 900, "center")}
    `;
    }
    const invite = getWentianInviteSnapshot();
    const shareText = `推荐你使用阅天AI，注册填写邀请码 ${invite.inviteCode} 可领取体验次数。${invite.inviteLink}`;
    return `
      ${sourceMineScreen(screen)}
      ${figBox("wt34-overlay", 0, 0, 390, 844, "", "background:rgba(0,0,0,.3);")}
      ${figBox("wt34-sheet", 0, 574, 390, 270, "", "border-radius:22px 22px 0 0;background:#fff;")}
      ${figText("wt34-title", "分享阅天AI", 0, 602, 390, 18, "#25211d", 800, "center")}
      ${figText("wt34-close", "×", 334, 600, 28, 24, "#25211d", 400, "center")}
      ${figButton("wt34-close-hit", 322, 590, 52, 46, 'data-route="screen-31"')}
      ${figBox("wt34-copy", 28, 644, 334, 72, "", "border-radius:10px;background:#fbf7ef;border:1px solid #eadfce;")}
      ${figText("wt34-copy-text", escapeHtml(shareText), 44, 658, 280, 13, "#756d63", 500, "left", "line-height:1.45;")}
      ${figBox("wt34-copy-code", 38, 742, 92, 46, "", "border-radius:23px;background:#d0a03a;")}
      ${figButton("wt34-copy-code-hit", 38, 742, 92, 46, 'data-action="wentian-invite-copy-code"')}
      ${figText("wt34-copy-code-text", "复制码", 38, 757, 92, 12, "#fff", 900, "center")}
      ${figBox("wt34-copy-link", 150, 742, 92, 46, "", "border-radius:23px;background:#25211d;")}
      ${figButton("wt34-copy-link-hit", 150, 742, 92, 46, 'data-action="wentian-invite-copy-link"')}
      ${figText("wt34-copy-link-text", "复制链接", 150, 757, 92, 12, "#fff", 900, "center")}
      ${figBox("wt34-share-btn", 262, 742, 92, 46, "", "border-radius:23px;background:#fff7ec;border:1px solid #ead9bd;")}
      ${figButton("wt34-share-hit", 262, 742, 92, 46, 'data-action="wentian-invite-share"')}
      ${figText("wt34-share-text", "系统分享", 262, 757, 92, 12, "#9b742e", 900, "center")}
    `;
    return `
      ${sourceMineScreen(screen)}
      ${figBox("wt34-overlay", 0, 0, 390, 844, "", "background:rgba(0,0,0,.3);")}
      ${figBox("wt34-sheet", 0, 574, 390, 270, "", "border-radius:22px 22px 0 0;background:#fff;")}
      ${figText("wt34-title", "分享文本", 0, 602, 390, 18, "#25211d", 800, "center")}
      ${figText("wt34-close", "×", 334, 600, 28, 24, "#25211d", 400, "center")}
      ${figBox("wt34-copy", 28, 644, 334, 72, "", "border-radius:10px;background:#fbf7ef;border:1px solid #eadfce;")}
      ${figText("wt34-copy-text", "推荐你使用阅天AI，AI智能和八字分析平台，为你解读命运密码。使用我的邀请码：8R7U58ZW", 44, 658, 280, 13, "#756d63", 500, "left", "line-height:1.45;")}
      ${["微信好友", "朋友圈", "Chrome", "邮件"].map((text, index) => `
        ${figBox(`wt34-share-${index}`, 38 + index * 82, 742, 42, 42, "", "border-radius:21px;background:#f5ead4;")}
        ${figText(`wt34-share-icon-${index}`, index === 0 ? "微" : index === 1 ? "圈" : index === 2 ? "C" : "邮", 38 + index * 82, 755, 42, 14, "#bd8624", 800, "center")}
        ${figText(`wt34-share-text-${index}`, text, 28 + index * 82, 794, 62, 11, "#756d63", 600, "center")}
      `).join("")}
    `;
  }
  if (no === 35) {
    const contacts = [
      ["电子邮箱", "842598522@qq.com", "✉", "wentian-contact-email"],
    ];
    const contactStatusTop = 128 + contacts.length * 78 + 16;
    return `
      ${figBox("wt35-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt35", "联系我们")}
      ${contacts.map(([title, desc, icon, action], index) => {
        const y = 128 + index * 78;
        return `
          ${figBox(`wt35-row-${index}`, 24, y, 342, 56, "", "border-radius:12px;background:#fff;box-shadow:0 6px 16px rgba(70,45,25,.07);")}
          ${figText(`wt35-icon-${index}`, icon, 42, y + 16, 24, 14, "#bd8624", 800, "center")}
          ${figText(`wt35-title-${index}`, title, 82, y + 12, 120, 14, "#25211d", 800)}
          ${figText(`wt35-desc-${index}`, desc, 82, y + 32, 180, 11, "#8d857b", 500)}
          ${figText(`wt35-arrow-${index}`, "›", 330, y + 17, 20, 18, "#c9bba6", 800, "center")}
          ${figButton(`wt35-hit-${index}`, 24, y, 342, 56, `data-action="${action}" aria-label="${title}"`)}
        `;
      }).join("")}
      <div id="wentian-contact-status" class="wentian-invite-status" style="left:34px;top:${contactStatusTop}px;width:322px;text-align:center" data-tone=""></div>
    `;
  }
  if (no === 36) {
    return `
      ${figBox("wt36-bg", 0, 0, 390, 844, "", "background:#fbf7ef;")}
      ${wentianSimpleHeader("wt36", "关于我们")}
      ${figBox("wt36-logo", 158, 126, 74, 74, "", "border-radius:18px;background:#1e1712;")}
      ${figText("wt36-logo-text", "阅天AI", 158, 152, 74, 16, "#d6ad3e", 800, "center")}
      ${figText("wt36-name", "阅天AI", 0, 230, 390, 20, "#25211d", 800, "center")}
      ${figText("wt36-version", "v1.0.3199", 0, 260, 390, 12, "#8d857b", 600, "center")}
      ${figText("wt36-desc", "阅天AI是一款手机端命理排盘、合盘、抽签与AI解读工具，帮你把复杂命理信息转成可理解、可行动的建议。", 54, 304, 282, 14, "#756d63", 500, "center", "line-height:1.65;")}
      ${["隐私协议", "用户协议", "检查更新"].map((title, index) => {
        const y = 466 + index * 70;
        return `
          ${figBox(`wt36-row-${index}`, 24, y, 342, 54, "", "border-radius:12px;background:#fff;box-shadow:0 6px 16px rgba(70,45,25,.06);")}
          ${figText(`wt36-title-${index}`, title, 58, y + 16, 160, 14, "#25211d", 800)}
          ${figText(`wt36-arrow-${index}`, "›", 330, y + 16, 20, 18, "#c9bba6", 800, "center")}
        `;
      }).join("")}
      ${figText("wt36-copy", "粤ICP备2026055337号　© 2026 阅天AI Copyright, All Rights Reserved. Powered By 阅天工作室　", 18, 736, 354, 9, "#b4ada5", 500, "center")}
    `;
  }
  return "";
}

function convertedSpecial(screen) {
  if (screen.no === 1) {
    return `
      ${figText("screen-1-hero-title", "授权书", 0, 92, 390, 22, "#26211c", 700, "center")}
      ${figText("screen-1-auth-copy", "本人授权阅天AI依据输入资料生成排盘、合盘\\n与AI解读。\\n\\n签署人：谢广周 / 2026-05-11", 42, 150, 306, 15, "#26211c", 400, "left", "line-height:1.35;")}
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
      ${figText("recharge-current-title", "阅天套餐", 68, 138, 160, 18, "#26211c", 700)}
      ${figText("recharge-current-count", "按日算", 228, 132, 90, 24, "#b88c33", 700, "center")}
      ${[["免费 30次/天", 42, 220], ["付费 100次/天", 42, 332]].map(([label, x, y], index) => `
        ${figBox(`recharge-plan-${index}`, x, y, 306, 86, "converted-card", index === 1 ? "border-color:#b88c33;" : "")}
        ${figText(`recharge-plan-text-${index}`, label, x + 8, y + 28, 290, 16, index === 1 ? "#b88c33" : "#26211c", 700, "center")}
      `).join("")}
      ${figText("recharge-pay-title", "支付方式", 42, 462, 220, 18, "#26211c", 700)}
      ${figBox("recharge-alipay", 42, 508, 140, 44, "converted-card", "border-color:#b88c33;")}
      ${figText("recharge-alipay-text", "微信支付", 42, 520, 140, 14, "#b88c33", 500, "center")}
      ${figBox("recharge-card", 202, 508, 140, 44, "converted-card", "")}
      ${figText("recharge-card-text", "支付宝配置中", 202, 520, 140, 14, "#26211c", 500, "center")}
    `;
  }
  if (screen.mine) {
    return `
      ${figBox("mine-profile", 24, 112, 342, 86, "converted-card", "")}
      ${figText("mine-name", "谢广周", 40, 126, 310, 15, "#26211c", 700)}
      ${figText("mine-meta", "普通会员 / 账号信息", 40, 154, 310, 12, "#8c8275")}
      ${[["阅天套餐", "screen-33"], ["我的报告", "screen-27"], ["订单记录", "screen-48"], ["邀请好友", "screen-22"], ["语言设置", "screen-37"], ["分享阅天AI", "screen-34"], ["联系我们", "screen-35"]].map(([label, route], index) => {
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
  const account = getWentianAuthDisplay();
  const member = getWentianMemberSnapshot();
  const memberLabel = member.isMember ? "会员" : (account.loggedIn ? "账号" : "登录/注册");
  const accountGreet = account.loggedIn ? `${account.name}，安好` : "登录/注册";
  const accountSub = account.loggedIn ? account.sub : "登录后支付查订单";
  return `
    ${figBox("source-1-bg", 0, 0, 390, 986, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 50%,#faf5ed 100%);")}
    ${figBox("source-1-avatar", 18, 24, 44, 44, "", "border-radius:22px;background:#f4ead8;box-shadow:0 6px 16px rgba(188,142,59,.12);")}
    ${figBox("source-1-avatar-head", 33, 36, 12, 12, "", "border-radius:6px;background:#c58d25;")}
    ${figBox("source-1-avatar-body", 27, 52, 24, 13, "", "border-radius:12px 12px 5px 5px;background:#c58d25;")}
    ${figText("source-1-greet", escapeHtml(accountGreet), 78, 28, 128, 20, "#25221f", 800, "left", "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;")}
    ${figText("source-1-date", escapeHtml(accountSub), 78, 53, 130, 14, "#8d877e", 500, "left", "white-space:nowrap;")}
    ${figBox("source-1-login-pill", 212, 32, 72, 26, "", `border-radius:14px;background:${member.isMember ? "#fff1d8" : "#f3eadc"};`)}
    ${figText("source-1-login-pill-text", memberLabel, 212, 39, 72, 11, member.isMember ? "#9f3d2e" : "#bd8624", 800, "center", "white-space:nowrap;")}
    ${figButton("source-1-login-hit", 18, 20, 266, 56, 'data-action="wentian-login-open"')}
    ${figBox("source-1-chart-pill", 294, 32, 78, 32, "", "border-radius:18px;background:#f3eadc;box-shadow:0 7px 16px rgba(190,142,45,.12);")}
    ${figText("source-1-chart-text", "✦ 排盘", 306, 39, 54, 16, "#bd8624", 800, "center")}
    ${figButton("source-1-chart-hit", 294, 32, 78, 32, 'data-route="screen-26" aria-label="排盘"')}

    ${figText("source-1-recommend-title", "为你推荐", 18, 98, 130, 22, "#25221f", 800)}
    ${figBox("source-1-master-1", 18, 130, 354, 288, "converted-card", "border-radius:16px;overflow:hidden;box-shadow:0 10px 24px rgba(70,45,25,.13);")}
    ${figImage("source-1-master-img-1", "../images/wentian-prototype-assets/xu-banxian.jpg", 18, 130, 354, 170, "border-radius:16px 16px 0 0;object-fit:cover;object-position:center 20%;")}
    ${figBox("source-1-master-shade", 18, 252, 354, 48, "", "background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.24));")}
    ${figText("source-1-master-name-1", "许半仙", 36, 322, 132, 24, "#25221f", 800)}
    ${figText("source-1-master-desc-1", "紫微命盘专属解析，已接入档案", 36, 352, 214, 14, "#91897f", 500, "left", "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;")}
    ${figBox("source-1-chip-1a", 36, 380, 70, 24, "", "border-radius:12px;background:#f8f3ea;border:1px solid #efe4d2;")}
    ${figText("source-1-chip-1a-text", "紫微命盘", 44, 386, 54, 11, "#b2822e", 700, "center")}
    ${figBox("source-1-chip-1b", 118, 380, 62, 24, "", "border-radius:12px;background:#f8f3ea;border:1px solid #efe4d2;")}
    ${figText("source-1-chip-1b-text", "AI解析", 125, 386, 48, 11, "#b2822e", 700, "center")}
    ${figBox("source-1-master-go", 278, 356, 72, 38, "", "border-radius:19px;background:#c08a2c;")}
    ${figText("source-1-master-go-text", "去问他", 286, 367, 56, 13, "#fff", 700, "center")}

    ${[["合盘分析", "命理相合，缘分几许", "01-feature-hepan.png", "hepan", 438], ["六爻占卜", "铜钱起卦，纳甲解卦", "01-feature-gua.png", "screen-17", 547], ["阳宅地脉", "方位九宫，安位解读", "01-feature-gua.png", "screen-42", 656], ["六壬法", "农历月日时，即刻起课", "01-feature-gua.png", "screen-46", 765]].map(([title, sub, icon, route, y], index) => `
      ${figBox(`source-1-feature-${index}`, 18, y, 354, 96, "converted-card", "border-radius:14px;box-shadow:0 8px 20px rgba(70,45,25,.1);background:#fffdfb;")}
      ${figText(`source-1-feature-title-${index}`, title, 36, y + 30, 150, 21, "#25221f", 800)}
      ${figText(`source-1-feature-sub-${index}`, sub, 36, y + 58, 190, 14, "#969087", 500)}
      ${figImage(`source-1-feature-icon-${index}`, `../images/wentian-prototype-assets/${icon}`, 286, y + 10, 72, 76, "object-fit:contain;")}
      ${figButton(`source-1-feature-hit-${index}`, 18, y, 354, 96, `data-route="${route}"`)}
    `).join("")}
    ${sourceAppBottomNav("首页", 897)}
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

const sourceScreenOwnHotspotNos = new Set([22, 24, 29, 34, 35]);

function convertedFlowHotspots(screen) {
  if (sourceScreenOwnHotspotNos.has(screen.no)) return "";
  return (screenFlowHotspots[screen.no] || []).map(([x, y, w, h, route], index) =>
    figButton(`screen-${screen.no}-flow-${index}`, x, y, w, h, `data-route="${route}"`, "flow-hotspot", "z-index:30;")
  ).join("");
}

function sourceChartFormScreen() {
  return `
    ${figBox("source-26-bg", 0, 0, 390, 944, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 52%,#f6eee2 100%);")}
    ${figBox("source-26-top", 0, 0, 390, 92, "", "background:#fffdf8;border-bottom:1px solid #eadfce;")}
    ${figButton("source-26-back-hit", 16, 34, 64, 52, 'data-action="back"')}
    ${figText("source-26-back", "‹", 26, 42, 24, 24, "#6e6254", 500, "center", "line-height:1;")}
    ${figText("source-26-title", "排盘", 0, 43, 390, 24, "#1f1d1a", 800, "center", "font-family:'Noto Serif SC','Songti SC',serif;")}

    ${figText("source-26-heading", "出生信息", 24, 108, 140, 24, "#2b251c", 900, "left", "font-family:'Noto Serif SC','Songti SC',serif;")}
    <div class="wentian-chart-card">
      <input type="hidden" id="wentian-chart-gender" value="male">
      <input type="hidden" id="wentian-chart-type" value="ziwei">
      <input type="hidden" id="wentian-chart-cal" value="solar">
      <input type="hidden" id="wentian-chart-date" value="2026-05-12T15:21">

      <div class="wentian-chart-row two">
        <span class="wentian-chart-label">姓名</span>
        <input id="wentian-chart-name" class="wentian-chart-name" placeholder="请输入姓名（选填）" autocomplete="off">
      </div>

      <div class="wentian-chart-row two">
        <span class="wentian-chart-label">性别</span>
        <div class="wentian-chart-segment">
          <button type="button" data-action="wentian-chart-gender" data-wentian-chart-gender="male">男</button>
          <button type="button" data-action="wentian-chart-gender" data-wentian-chart-gender="female">女</button>
        </div>
      </div>

      <div class="wentian-chart-row stack">
        <div class="wentian-chart-row two" style="min-height:34px;border:0">
          <span class="wentian-chart-label">出生日期<small>必填</small></span>
          <div class="wentian-chart-segment">
            <button type="button" data-action="wentian-chart-cal" data-wentian-chart-cal="solar">公历</button>
            <button type="button" data-action="wentian-chart-cal" data-wentian-chart-cal="lunar">农历</button>
          </div>
        </div>
        <div id="wentian-chart-solar-fields" class="wentian-chart-date-grid">
          <input id="wentian-chart-year" type="number" min="1900" max="2030" inputmode="numeric" placeholder="年">
          <select id="wentian-chart-month"></select>
          <select id="wentian-chart-day"></select>
        </div>
        <div id="wentian-chart-lunar-fields" class="wentian-chart-date-grid" style="display:none">
          <input id="wentian-chart-lunar-year" type="number" min="1900" max="2030" inputmode="numeric" placeholder="农历年">
          <select id="wentian-chart-lunar-month"></select>
          <select id="wentian-chart-lunar-day"></select>
        </div>
        <label style="display:flex;align-items:center;gap:6px;color:#8d7d69;font-size:12px">
          <input id="wentian-chart-lunar-leap" type="checkbox" checked style="width:14px;height:14px"> 闰月自动识别
        </label>
        <div id="wentian-chart-preview" class="wentian-chart-preview"></div>
      </div>

      <div class="wentian-chart-row stack">
        <span class="wentian-chart-label">出生时刻<small>精确到分钟</small></span>
        <div class="wentian-chart-time-grid">
          <select id="wentian-chart-hour"></select>
          <select id="wentian-chart-minute"></select>
        </div>
      </div>

      <div class="wentian-chart-row stack">
        <span class="wentian-chart-label">出生地点<small>影响真太阳时</small></span>
        <div class="wentian-chart-city-wrap">
          <input id="wentian-chart-city" class="wentian-chart-city-input" placeholder="搜索城市，如：北京、上海、Tokyo" autocomplete="off">
          <button type="button" id="wentian-chart-city-clear" class="wentian-chart-city-clear" data-action="wentian-chart-city-clear" style="display:none">清除</button>
          <div id="wentian-chart-city-dropdown" class="wentian-chart-city-dropdown" style="display:none"></div>
        </div>
        <div id="wentian-chart-city-selected" class="wentian-chart-preview" style="display:none"></div>
      </div>

      <div class="wentian-chart-row two">
        <span class="wentian-chart-label">采用真太阳时</span>
        <label class="wentian-chart-toggle"><input id="wentian-chart-true-solar" type="checkbox"><span></span></label>
      </div>
      <div id="wentian-chart-tst" class="wentian-chart-tst">请先补全出生时间，地点可选。</div>
    </div>

    ${figBox("source-26-submit", 18, 742, 354, 54, "", "border:1px solid #7b3129;border-radius:12px;background:#9e4738;box-shadow:0 10px 20px rgba(123,49,41,.14);")}
    ${figButton("source-26-submit-hit", 18, 742, 354, 54, 'data-action="wentian-chart-submit"')}
    ${figText("source-26-submit-text", "开始排盘", 0, 758, 390, 18, "#fffdf6", 800, "center")}
    <div id="wentian-chart-status" class="wentian-chart-status"></div>
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
  const highlightClass = getWentianClassicCellClasses(branch, activeBranch);
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
    .join("");
  const minorHtml = [
    ...(palace.minorStars || []),
    ...(palace.adjectiveStars || palace.adjStars || []),
  ].slice(0, 5).map((star) => `<div class="fc-minor-star">${escapeHtml(getWentianClassicStarText(star))}</div>`).join("");
  const shenHtml = [palace.changsheng12, palace.boshi12].filter(Boolean).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const palaceName = `${palace.isBodyPalace ? "身宫\n" : ""}${palace.name || ""}`;
  return `
    <div class="fc-cell ${highlightClass}" data-action="wentian-chart-palace" data-palace-branch="${escapeHtml(branch)}" data-palace-name="${escapeHtml(palace.name || branch)}" role="button" style="grid-column:${col + 1};grid-row:${row + 1};">
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

const WENTIAN_CLASSIC_BRANCH_SIDES = {
  "巳": "NW",
  "午": "N",
  "未": "N",
  "申": "NE",
  "辰": "W",
  "卯": "W",
  "酉": "E",
  "戌": "E",
  "寅": "SW",
  "丑": "S",
  "子": "S",
  "亥": "SE",
};

function clearWentianClassicSanfangLines(svg) {
  if (!svg) return;
  svg.classList.add("is-empty");
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function getWentianClassicBranchPort(chart, branch, gridRect) {
  const cell = Array.from(chart?.querySelectorAll(".fc-cell") || []).find((item) => item.dataset.palaceBranch === branch);
  const side = WENTIAN_CLASSIC_BRANCH_SIDES[branch];
  if (!cell || !side || !gridRect) return null;
  const cellRect = cell.getBoundingClientRect();
  const x0 = cellRect.left - gridRect.left;
  const y0 = cellRect.top - gridRect.top;
  const x1 = x0 + cellRect.width;
  const y1 = y0 + cellRect.height;
  const xm = (x0 + x1) / 2;
  const ym = (y0 + y1) / 2;
  const edgePoints = {
    N: { x: xm, y: y1 },
    S: { x: xm, y: y0 },
    W: { x: x1, y: ym },
    E: { x: x0, y: ym },
    NW: { x: x1, y: y1 },
    NE: { x: x0, y: y1 },
    SW: { x: x1, y: y0 },
    SE: { x: x0, y: y0 },
  };
  return { ...edgePoints[side], side };
}

function getWentianClassicCorridor(chart, gridRect) {
  const center = chart?.querySelector(".fc-center-panel");
  if (!center || !gridRect?.width || !gridRect?.height) return null;
  const rect = center.getBoundingClientRect();
  const corridor = {
    top: rect.top - gridRect.top,
    bottom: rect.bottom - gridRect.top,
    left: rect.left - gridRect.left,
    right: rect.right - gridRect.left,
  };
  if (corridor.right <= corridor.left || corridor.bottom <= corridor.top) return null;
  return corridor;
}

function clampWentianClassicUnit(value) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function getWentianClassicPerimParam(port, corr) {
  const width = corr.right - corr.left;
  const height = corr.bottom - corr.top;
  switch (port.side) {
    case "NW": return 0;
    case "N": return clampWentianClassicUnit((port.x - corr.left) / width);
    case "NE": return 1;
    case "E": return 1 + clampWentianClassicUnit((port.y - corr.top) / height);
    case "SE": return 2;
    case "S": return 2 + clampWentianClassicUnit((corr.right - port.x) / width);
    case "SW": return 3;
    case "W": return 3 + clampWentianClassicUnit((corr.bottom - port.y) / height);
    default: return 0;
  }
}

function getWentianClassicPerimPoint(param, corr) {
  const width = corr.right - corr.left;
  const height = corr.bottom - corr.top;
  const p = ((param % 4) + 4) % 4;
  if (p <= 1) return { x: corr.left + p * width, y: corr.top };
  if (p <= 2) return { x: corr.right, y: corr.top + (p - 1) * height };
  if (p <= 3) return { x: corr.right - (p - 2) * width, y: corr.bottom };
  return { x: corr.left, y: corr.bottom - (p - 3) * height };
}

function routeWentianClassicSanfangPoints(portA, portB, corr) {
  const paramA = getWentianClassicPerimParam(portA, corr);
  const paramB = getWentianClassicPerimParam(portB, corr);
  const cwDistance = ((paramB - paramA) % 4 + 4) % 4;
  const ccwDistance = ((paramA - paramB) % 4 + 4) % 4;

  function getCorners(start, distance) {
    const corners = [];
    const end = start + distance;
    for (let corner = Math.ceil(start + 1e-6); corner <= end - 1e-6; corner += 1) {
      corners.push(getWentianClassicPerimPoint(corner, corr));
    }
    return corners;
  }

  const snapA = getWentianClassicPerimPoint(paramA, corr);
  const snapB = getWentianClassicPerimPoint(paramB, corr);
  const via = cwDistance <= ccwDistance
    ? getCorners(paramA, cwDistance)
    : getCorners(paramB, ccwDistance).reverse();
  const isNear = (a, b) => Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2;
  const points = [portA];
  if (!isNear(snapA, portA)) points.push(snapA);
  via.forEach((point) => {
    if (!isNear(point, points[points.length - 1])) points.push(point);
  });
  if (!isNear(snapB, points[points.length - 1])) points.push(snapB);
  if (!isNear(portB, points[points.length - 1])) points.push(portB);
  return points;
}

function formatWentianClassicPolylinePoints(points) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

function appendWentianClassicPolyline(svg, points, className) {
  if (!points || points.length < 2) return;
  const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  line.setAttribute("class", `fc-sanfang-line ${className}`);
  line.setAttribute("points", formatWentianClassicPolylinePoints(points));
  svg.appendChild(line);
}

function appendWentianClassicPoint(svg, point, className) {
  if (!point) return;
  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttribute("class", `fc-sanfang-point ${className}`);
  dot.setAttribute("cx", point.x.toFixed(1));
  dot.setAttribute("cy", point.y.toFixed(1));
  dot.setAttribute("r", "2.2");
  svg.appendChild(dot);
}

function renderWentianClassicSanfangLines(activeBranch) {
  const chart = view.querySelector(".wentian-native-mingpan");
  const svg = chart?.querySelector(".fc-sanfang-lines");
  const grid = chart?.querySelector(".fc-grid");
  if (!chart || !svg || !grid || !activeBranch) {
    clearWentianClassicSanfangLines(svg);
    return;
  }
  const gridRect = grid.getBoundingClientRect();
  const corridor = getWentianClassicCorridor(chart, gridRect);
  if (!gridRect.width || !gridRect.height || !corridor) {
    clearWentianClassicSanfangLines(svg);
    return;
  }
  const relations = getWentianClassicRelations(activeBranch);
  const selfPoint = getWentianClassicBranchPort(chart, activeBranch, gridRect);
  const sanhePoints = relations.sanhe.map((branch) => getWentianClassicBranchPort(chart, branch, gridRect));
  const oppositePoint = getWentianClassicBranchPort(chart, relations.dui, gridRect);
  if (!selfPoint || sanhePoints.some((point) => !point) || !oppositePoint) {
    clearWentianClassicSanfangLines(svg);
    return;
  }

  clearWentianClassicSanfangLines(svg);
  svg.setAttribute("viewBox", `0 0 ${gridRect.width.toFixed(1)} ${gridRect.height.toFixed(1)}`);
  svg.setAttribute("preserveAspectRatio", "none");
  appendWentianClassicPolyline(svg, routeWentianClassicSanfangPoints(selfPoint, sanhePoints[0], corridor), "fc-sanfang-line-sanhe");
  appendWentianClassicPolyline(svg, routeWentianClassicSanfangPoints(selfPoint, sanhePoints[1], corridor), "fc-sanfang-line-sanhe");
  appendWentianClassicPolyline(svg, routeWentianClassicSanfangPoints(sanhePoints[0], sanhePoints[1], corridor), "fc-sanfang-line-triangle");
  appendWentianClassicPolyline(svg, routeWentianClassicSanfangPoints(selfPoint, oppositePoint, corridor), "fc-sanfang-line-opposite");
  appendWentianClassicPoint(svg, selfPoint, "is-self");
  sanhePoints.forEach((point) => appendWentianClassicPoint(svg, point, "is-sanhe"));
  appendWentianClassicPoint(svg, oppositePoint, "is-opposite");
  svg.classList.remove("is-empty");
}

function getWentianClassicDefaultBranch(saved) {
  const chart = saved?.chart || getWentianDisplayChartState()?.chart;
  return chart?.earthlyBranchOfSoulPalace || (chart?.palaces || []).find((p) => p.name === "命宫")?.earthlyBranch || "";
}

function initWentianClassicChartScreen() {
  window.requestAnimationFrame(() => {
    const activeBranch = getWentianClassicDefaultBranch(getWentianDisplayChartState())
      || view.querySelector(".wentian-native-mingpan .fc-cell.fc-ben")?.dataset.palaceBranch
      || "";
    renderWentianClassicSanfangLines(activeBranch);
  });
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
      <div class="fc-center-btns" aria-label="切换排盘时辰">
        <button type="button" class="fc-center-btn" data-action="wentian-chart-time-step" data-hours-delta="-2" aria-label="上一个时辰">时↑</button>
        <button type="button" class="fc-center-btn" data-action="wentian-chart-time-step" data-hours-delta="2" aria-label="下一个时辰">时↓</button>
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
            <svg class="fc-sanfang-lines is-empty" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path class="fc-sanfang-opposite"></path>
              <path class="fc-sanfang-triangle"></path>
              <g class="fc-sanfang-points"></g>
            </svg>
            ${(chart.palaces || []).map((palace) => renderWentianClassicPalaceCell(palace, activeBranch)).join("")}
            ${renderWentianClassicCenter(chart, chartData, form)}
          </div>
        </div>
      </div>
    </div>`;
}

function highlightWentianClassicChart(branch, palaceName = "") {
  const chart = view.querySelector(".wentian-native-mingpan");
  if (!chart || !branch) return;
  const relations = getWentianClassicRelations(branch);
  chart.querySelectorAll(".fc-cell").forEach((cell) => {
    const cellBranch = cell.dataset.palaceBranch || "";
    cell.classList.remove("fc-ben", "fc-rel", "fc-sanhe", "fc-dui");
    if (cellBranch === branch) {
      cell.classList.add("fc-ben");
    } else if (relations.sanhe.includes(cellBranch)) {
      cell.classList.add("fc-rel", "fc-sanhe");
    } else if (relations.dui === cellBranch) {
      cell.classList.add("fc-rel", "fc-dui");
    }
  });
  renderWentianClassicSanfangLines(branch);
  const title = view.querySelector('[data-node-id="source-27-ai-title"]');
  if (title) title.textContent = translateWentianText(`✦ ${palaceName || branch} · AI解析`);
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

function sourceZiweiAiDecodePanel() {
  syncWentianChartAiStateFromStorage();
  const chapters = getWentianChartAiChapters();
  const isRunning = wentianChartAiState.status === "running";
  const hasResults = hasWentianChartAiResults();
  const doneCount = getWentianGeneratedModuleCount();
  const activeTask = WENTIAN_CHART_AI_TASKS.find((task) => task.module === wentianChartAiState.runningModule);
  const buttonText = isRunning ? `生成中 ${doneCount}/${WENTIAN_CHART_AI_TASKS.length}` : (hasResults ? "重新总批命" : "总批命");
  const statusText = isRunning
    ? `正在生成：${activeTask?.label || "AI解读"}`
    : wentianChartAiState.error
      ? wentianChartAiState.error
      : hasResults
        ? "已接入电脑端同款核心解读，可单独重批、追问或下载 PDF。"
        : "对齐电脑端六卷：总局、专题、大限、小限、曲线、建议。";

  return `
    <section class="wentian-chart-ai-panel" data-node-id="source-27-ai-card">
      <header class="wentian-chart-ai-head">
        <span>紫微命书 · AI总批命</span>
        <h2>✦ 命盘 · AI解读</h2>
        <p class="${wentianChartAiState.error ? "is-error" : ""}">${escapeHtml(statusText)}</p>
      </header>
      <div class="wentian-chart-ai-actions">
        <button type="button" class="wentian-chart-ai-primary" data-action="wentian-chart-ai-decode" ${isRunning ? "disabled" : ""}>${escapeHtml(buttonText)}</button>
        <button type="button" class="wentian-chart-ai-secondary" data-route="screen-4">追问</button>
        <button type="button" class="wentian-chart-ai-secondary" data-action="wentian-open-mingbook-onepage">下载PDF</button>
      </div>
      <p class="wentian-chart-ai-pdf-status" data-wentian-pdf-status></p>
      <div class="wentian-chart-ai-meter" aria-label="AI生成进度">
        ${WENTIAN_CHART_AI_TASKS.map((task) => `<i class="${wentianChartAiState.results?.[task.module] ? "is-done" : (wentianChartAiState.runningModule === task.module ? "is-running" : "")}"></i>`).join("")}
      </div>
      <div class="wentian-chart-ai-modules" aria-label="单独批命入口">
        ${WENTIAN_CHART_AI_TASKS.map((task) => `
          <button type="button" class="${wentianChartAiState.results?.[task.module] ? "is-ready" : ""}" data-action="wentian-chart-ai-module" data-ai-module="${escapeHtml(task.module)}" ${isRunning ? "disabled" : ""}>${escapeHtml(task.label.replace("批命", ""))}</button>
        `).join("")}
      </div>
      <div class="wentian-chart-ai-pulse">
        <span><b>${doneCount}/${WENTIAN_CHART_AI_TASKS.length}</b> 模块</span>
        <span><b>${hasResults ? "已生成" : (isRunning ? "生成中" : "待生成")}</b> 状态</span>
        <span><b>6</b> 卷报告</span>
      </div>
      <nav class="wentian-chart-ai-menu" aria-label="命书目录">
        ${chapters.map((chapter, index) => `
          <button type="button" class="${chapter.ready ? "is-ready" : ""}" data-action="wentian-chart-ai-jump" data-report-index="${index}">
            <b>${escapeHtml(chapter.menu)}</b><span>${escapeHtml(chapter.title)}</span>
          </button>
        `).join("")}
      </nav>
      <div class="wentian-chart-ai-list">
        ${chapters.map(renderWentianMobileChapter).join("")}
      </div>
    </section>
  `;
}

function sourceZiweiMingpanScreenFromChart(saved) {
  const screenHeight = getWentianZiweiScreenHeight();
  const bottomNavY = Math.max(755, screenHeight - 89);
  return `
    ${figBox("source-27-bg", 0, 0, 390, screenHeight, "", "background:#fbf7ef;")}
    ${figButton("source-27-back-hit", 18, 40, 96, 54, 'data-action="back"')}
    ${figText("source-27-back", "‹ 返回", 28, 54, 92, 26, "#9f2417", 500)}
    ${figText("source-27-title", "紫微命盘", 0, 58, 390, 25, "#3b3934", 800, "center")}
    ${figText("source-27-more", "•••", 330, 56, 42, 22, "#3b3934", 800, "center")}
    ${renderWentianClassicChart(saved)}
    ${sourceZiweiAiDecodePanel()}
    ${sourceAppBottomNav("档案", bottomNavY)}
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
    `, 986, "converted source-screen no-status-shift", false);
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
    `, 844, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 41) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourcePasswordSettingsScreen()}
    `, 844, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 48) {
    const orderRecordsHeight = Math.max(844, 154 + ((wentianOrderState.orders || []).length * 92) + 46);
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceOrderRecordsScreen()}
    `, orderRecordsHeight, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 26) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceChartFormScreen()}
      ${convertedFlowHotspots(screen)}
    `, 944, "converted source-screen no-status-shift", true);
  }
  if (screen.no === 27) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceZiweiMingpanScreen()}
      ${convertedFlowHotspots(screen)}
    `, getWentianZiweiScreenHeight(), "converted source-screen no-status-shift", false);
  }
  const polishedScreen = renderWentianPolishedScreen(screen);
  if (polishedScreen) {
    const polishedHeight = screen.no === 4 ? 892 : screen.no === 8 ? 1280 : screen.no === 17 ? getLiuyaoCastScreenHeight() : screen.no === 18 || screen.no === 19 ? 1480 : screen.no === 20 ? getLiuyaoResultScreenHeight() : screen.no === 22 ? 1120 : screen.no === 24 ? 1180 : screen.no === 44 ? getYangzhaiResultHeight() : screen.no === 46 ? LIUREN_SCREEN_HEIGHT : screen.no === 49 ? 1160 : 844;
    const wideBgClass = screen.no >= 42 && screen.no <= 45 ? " wide-bg" : "";
    const customHotspots = screen.no >= 17 && screen.no <= 20 ? "" : convertedFlowHotspots(screen);
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${polishedScreen}
      ${customHotspots}
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
  if (clean === "hepan" || clean === "10" || clean === "screen-10") return "screen-11";
  if (clean === "23" || clean === "screen-23") return "screen-22";
  return routeAliases[clean] || clean || "screen-1";
}

function routeFromLocation() {
  const hashRoute = normalizeRoute(location.hash.slice(1));
  if (hashRoute && !hashRoute.startsWith("figmacapture=") && !hasWentianAuthParams(getWentianUrlParams(location.hash))) return resolveRoute(hashRoute);
  const screen = new URLSearchParams(location.search).get("screen");
  if (screen) return resolveRoute(screen.startsWith("screen") ? screen : `screen-${screen}`);
  if (isWentianInviteCode(getWentianInviteCodeFromUrl())) return "screen-40";
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
  const renderedWidth = view.getBoundingClientRect?.().width || wrap.getBoundingClientRect?.().width || viewportWidth;
  const horizontalAvailable = desktop ? Math.max(320, Math.min(viewportWidth, 430)) : Math.min(viewportWidth, renderedWidth);
  const verticalChromeSpace = desktop ? 48 : 0;
  const verticalAvailable = Math.max(560, viewportHeight - verticalChromeSpace - safeTop - safeBottom);
  const rawHeight = parseFloat(phone.style.height) || phone.offsetHeight || WENTIAN_PHONE_HEIGHT;
  const heightBasis = rawHeight <= 900 ? rawHeight : WENTIAN_PHONE_HEIGHT;
  const widthScale = Math.max(0.78, Math.min(1, horizontalAvailable / WENTIAN_PHONE_WIDTH));
  const heightScale = Math.min(1, verticalAvailable / heightBasis);
  const scale = desktop
    ? Math.min(widthScale, heightScale)
    : widthScale;
  const edgeFit = !desktop && horizontalAvailable <= WENTIAN_PHONE_WIDTH;
  const layoutWidth = Math.ceil(WENTIAN_PHONE_WIDTH * scale);
  phone.style.setProperty("--wentian-phone-scale", String(scale));
  phone.style.transform = `scale(${scale})`;
  phone.style.transformOrigin = edgeFit ? "top left" : "top center";
  wrap.style.setProperty("--wentian-phone-layout-width", `${layoutWidth}px`);
  wrap.style.justifyContent = edgeFit ? "flex-start" : "center";
  wrap.style.overflow = desktop ? "visible" : "hidden";
  wrap.style.height = `${Math.ceil(rawHeight * scale)}px`;
}

function scheduleWentianPhoneFit() {
  wentianFitTimers.forEach((timer) => window.clearTimeout(timer));
  wentianFitTimers = [];
  if (wentianFitLoop) window.clearInterval(wentianFitLoop);
  wentianFitLoopUntil = Date.now() + 7000;
  fitActivePhoneShell();
  [80, 220, 520, 1100, 2200, 3600, 5600].forEach((delay) => {
    wentianFitTimers.push(window.setTimeout(fitActivePhoneShell, delay));
  });
  wentianFitLoop = window.setInterval(() => {
    fitActivePhoneShell();
    if (Date.now() >= wentianFitLoopUntil) {
      window.clearInterval(wentianFitLoop);
      wentianFitLoop = 0;
    }
  }, 280);
}

function ensureWentianPhoneFitObserver() {
  if (wentianFitObserver || typeof MutationObserver === "undefined" || !view) return;
  wentianFitObserver = new MutationObserver(() => scheduleWentianPhoneFit());
  wentianFitObserver.observe(view, { childList: true });
}

function navigate(route, push = true) {
  route = resolveRoute(route);
  if (/^screen-?\d+$/.test(route)) {
    const no = Number(route.replace(/^screen-?/, ""));
    const screen = convertedByNo.get(no) || convertedByNo.get(2);
    route = `screen-${screen.no}`;
    if (push && route !== state.route) state.stack.push(state.route);
    state.route = route;
    if (route !== "screen-38") wentianLogoutConfirmOpen = false;
    if (routeKicker) routeKicker.textContent = translateWentianText("阅天AI");
    if (routeTitle) routeTitle.textContent = translateWentianText(screen.title);
    view.innerHTML = applyWentianColorUpgrade(renderConvertedScreen(screen.no));
    stripScreenshotStatusBar();
    applyWentianLanguageText(view);
    ensureWentianLanguageObserver();
    scheduleWentianPhoneFit();
    syncActive();
    window.setTimeout(initWentianAuth, 0);
    if (screen.no === 4) window.setTimeout(initWentianXuChat, 0);
    if (screen.no === 5 || screen.no === 25) window.setTimeout(() => hydrateWentianArchivesFromRemote({ rerender: true }), 0);
    if (screen.no === 30) window.setTimeout(initWentianPaymentScreen, 0);
    if (screen.no === 1 || screen.no === 29 || screen.no === 31 || screen.no === 33 || screen.no === 38 || screen.no === 40 || screen.no === 41) window.setTimeout(() => hydrateWentianMemberStatus({ rerender: true }), 0);
    if (screen.no === 22 || screen.no === 23 || screen.no === 24 || screen.no === 31 || screen.no === 34) window.setTimeout(() => hydrateWentianInvite({ rerender: true }), 0);
    if (screen.no === 48) window.setTimeout(() => hydrateWentianOrders({ rerender: true }), 0);
    if (screen.no === 26) window.setTimeout(initWentianChartForm, 0);
    if (screen.no === 27) window.setTimeout(initWentianClassicChartScreen, 0);
    if (screen.no === 46) window.setTimeout(initLiurenScreen, 0);
    if (!location.hash.includes("figmacapture=") && !hasWentianAuthParams(getWentianUrlParams(location.hash))) location.hash = route;
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
  return figPhone("17:3", "Hi-Fi 01 AI阅天", `
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
              <button class="ghost-btn" type="button" data-route="ai">阅天咨询</button>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-title"><h3>快捷入口</h3></div>
        <div class="stack">
          <button class="choice-btn" type="button" data-route="chart">排盘表单</button>
          <button class="choice-btn" type="button" data-route="report">紫微命盘</button>
          <button class="choice-btn" type="button" data-route="ai">AI阅天</button>
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
    ${figText("17:109", "免费30次/天，付费100次/天", 118, 229, 170, 17, "#75756e")}
    ${figText("17:110", "aa15989267747@gmail.com", 118, 244, 220, 15, "#9e998f")}
    ${figBox("17:111", 16, 296, 110, 78, "fig-card", "border-radius:15px;")}
    ${figText("17:112", "◇", 28, 314, 28, 20, "#ba8f38", 700, "center")}
    ${figText("17:113", "今日次数", 58, 316, 70, 17, "#75756e")}
    ${figText("17:114", "0/0", 30, 346, 60, 25, "#ba8f38", 700)}
    ${figBox("17:116", 140, 296, 110, 78, "fig-card", "border-radius:15px;")}
    ${figText("17:117", "▰", 152, 314, 28, 20, "#ba8f38", 700, "center")}
    ${figText("17:118", "每日额度", 182, 316, 70, 17, "#75756e")}
    ${figText("17:119", "30", 154, 346, 30, 25, "#ba8f38", 700)}
    ${figText("17:120", "次/天", 182, 353, 46, 15, "#75756e")}
    ${figBox("17:121", 264, 296, 110, 78, "fig-card", "border-radius:15px;")}
    ${figText("17:122", "☏", 276, 314, 28, 20, "#ba8f38", 700, "center")}
    ${figText("17:123", "套餐", 306, 316, 54, 17, "#75756e")}
    ${figText("17:124", "0", 278, 346, 30, 25, "#ba8f38", 700)}
    ${figText("17:125", "/0", 306, 353, 34, 15, "#75756e")}
    ${figBox("17:126", 16, 394, 172, 62, "fig-card", "border-radius:15px;")}
    ${figText("17:128", "♛", 43, 414, 24, 20, "#ba8f38", 700, "center")}
    ${figText("17:129", "阅天套餐", 88, 414, 88, 21, "#21211f", 500)}
    ${figBox("17:130", 202, 394, 172, 62, "fig-card", "border-radius:15px;")}
    ${figButton("17:130-hit", 202, 394, 172, 62, 'data-route="recharge"')}
    ${figText("17:132", "◇", 229, 414, 24, 20, "#ba8f38", 700, "center")}
    ${figText("17:133", "套餐详情", 274, 414, 88, 21, "#21211f", 500)}
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
    ${figText("17:149", "语言设置", 68, 645, 150, 20, "#21211f")}
    ${figText("17:150", "›", 344, 642, 22, 28, "#a8a699", 700, "center")}
    ${figBox("17:151", 16, 690, 358, 112, "fig-card", "border-radius:16px;")}
    ${figText("17:152", "文", 34, 706, 28, 22, "#ba8f38", 700, "center")}
    ${figText("17:153", "语言设置", 68, 707, 150, 20, "#21211f")}
    ${figText("17:154", "简体中文", 276, 707, 72, 14, "#ba8f38", 400, "right")}
    ${figText("17:155", "›", 344, 730, 22, 28, "#a8a699", 700, "center")}
    ${figLine("17:156", 16, 746, 358)}
    ${figText("17:157", "⌯", 34, 762, 28, 22, "#8c8c80", 700, "center")}
    ${figText("17:158", "分享阅天AI", 68, 763, 150, 20, "#21211f")}
    ${figText("17:159", "›", 344, 786, 22, 28, "#a8a699", 700, "center")}
    ${figBottomNav("我的")}
  `);
}

function renderRecharge() {
  return figPhone("17:49", "Hi-Fi 02 阅天套餐", `
    ${figStatus("15:22")}
    ${figButton("17:52-hit", 14, 54, 54, 62, 'data-route="mine"')}
    ${figText("17:52", "‹", 28, 66, 26, 42, "#ba8f38", 700, "center")}
    ${figText("17:53", "阅天套餐", 0, 68, 390, 28, "#ba8f38", 700, "center")}
    ${figBox("17:54", 22, 140, 346, 160, "", "border-radius:20px;background:linear-gradient(90deg,#40332b,#26261f);box-shadow:0 5px 16px rgba(0,0,0,.26);")}
    ${figBox("17:55", 50, 178, 52, 52, "", "border:1px solid #665940;border-radius:16px;background:#403b2e;")}
    ${figText("17:56", "◇", 61, 190, 36, 32, "#ba8f38", 700, "center")}
    ${figText("17:57", "免费版", 120, 174, 150, 22, "#b8b2a8", 700)}
    ${figText("17:58", "30次/天", 122, 214, 120, 36, "#ba8f38", 700)}
    ${figText("17:59", "付费版 100次/天，按日刷新", 50, 264, 260, 15, "#948f85")}
    ${figText("17:60", "套餐规则", 22, 344, 220, 25, "#21211f", 700)}
    ${figBox("17:61", 22, 392, 346, 86, "fig-card", "border:1.6px solid #ba8f38;border-radius:14px;")}
    ${figText("17:62", "免费用户", 46, 416, 90, 18, "#75756e", 700)}
    ${figText("17:63", "30次/天", 248, 416, 84, 18, "#ba8f38", 700, "right")}
    ${figText("17:64", "每日自动刷新。", 46, 448, 220, 14, "#75756e", 700)}
    ${figBox("17:77", 22, 500, 346, 94, "fig-card", "border-radius:14px;")}
    ${figText("17:78", "付费用户", 46, 523, 90, 20, "#21211f", 700)}
    ${figText("17:79", "100次/天", 238, 523, 96, 20, "#ba8f38", 700, "right")}
    ${figText("17:81", "适合连续追问与深度复盘。", 46, 556, 220, 14, "#75756e", 700)}
    ${figText("17:82", "支付方式", 22, 638, 220, 25, "#21211f", 700)}
    ${figBox("17:83", 22, 692, 116, 52, "", "border:1.5px solid #ba8f38;border-radius:14px;background:#fdfaf1;box-shadow:0 2px 7px rgba(0,0,0,.1);")}
    ${figText("17:86", "微信支付", 48, 708, 70, 17, "#ba8f38", 500)}
    ${figBox("17:87", 148, 692, 116, 52, "fig-card", "border-radius:14px;")}
    ${figText("17:90", "支付宝配置中", 166, 708, 82, 17, "#75756e", 500)}
    ${figText("17:91", "只按每日额度计算，不设月额度", 52, 746, 286, 13, "#9e998f", 400, "center")}
    ${figText("17:92", "用户协议  |  隐私政策", 130, 770, 130, 13, "#75756e", 400, "center")}
    ${figBox("17:93", 0, 780, 390, 64, "", "background:rgba(251,247,240,.92);")}
    ${figBox("17:94", 18, 790, 354, 44, "", "border-radius:22px;background:#9e6b08;box-shadow:0 3px 12px rgba(0,0,0,.16);")}
    ${figButton("17:94-hit", 18, 790, 354, 44, 'data-route="pay"')}
    ${figText("17:95", "开通付费版 ¥19.90", 18, 802, 354, 13, "#fff", 500, "center")}
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
        <button class="primary-btn" type="button" data-route="ai">继续阅天</button>
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
          <h3>阅天AI付费版</h3>
          <p>订单号 PAY_20260512_cfa323ae</p>
        </div>
        <div class="price">¥19.90</div>
        <button class="primary-btn blue" type="button" data-route="mine">确认支付</button>
      </div>
    </section>
  `;
}

document.addEventListener("pointerdown", handleLiuyaoSwipePointerDown);
document.addEventListener("pointermove", handleLiuyaoSwipePointerMove);
document.addEventListener("pointerup", handleLiuyaoSwipePointerUp);
document.addEventListener("pointercancel", cancelLiuyaoSwipePointer);

document.addEventListener("keydown", (event) => {
  const target = event.target.closest?.('[data-action="liuyao-swipe-cast"]');
  if (!target || !canUseLiuyaoSwipeCaster(target)) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  startLiuyaoAnimatedToss({ power: LIUYAO_DEFAULT_POWER, pull: LIUYAO_PULL_MAX * LIUYAO_DEFAULT_POWER, duration: 320 });
});

document.addEventListener("click", (event) => {
  const promptButton = event.target.closest("[data-wentian-prompt]");
  if (promptButton) {
    promptButton.closest(".wentian-chat-faq-group")?.removeAttribute("open");
    window.setTimeout(syncWentianChatFaqLayout, 0);
    sendWentianXuChat(promptButton.dataset.wentianPrompt || "");
    return;
  }
  const faqToggle = event.target.closest("[data-wentian-faq-toggle]");
  if (faqToggle) {
    const group = faqToggle.closest(".wentian-chat-faq-group");
    document.querySelectorAll(".wentian-chat-faq-group[open]").forEach((item) => {
      if (item !== group) item.removeAttribute("open");
    });
    window.setTimeout(syncWentianChatFaqLayout, 0);
    return;
  }
  const earlyActionTarget = event.target.closest("[data-action]");
  const earlyAction = earlyActionTarget?.dataset.action;
  if (earlyAction === "yangzhai-open") {
    openYangzhaiPicker(earlyActionTarget.dataset.palace || "xun");
    return;
  }
  if (earlyAction === "yangzhai-compass-start") {
    event.preventDefault();
    event.stopPropagation();
    startYangzhaiCompass();
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
  if (earlyAction === "wentian-chart-palace") {
    highlightWentianClassicChart(earlyActionTarget.dataset.palaceBranch || "", earlyActionTarget.dataset.palaceName || "");
    return;
  }
  if (earlyAction === "wentian-chart-time-step") {
    stepWentianClassicChartTime(Number(earlyActionTarget.dataset.hoursDelta) || 0);
    return;
  }
  if (earlyAction === "liuren-use-now") {
    liurenHasStarted = false;
    liurenXuRecordId = null;
    setLiurenDateTime(new Date(), { reveal: false });
    return;
  }
  if (earlyAction === "liuren-calc") {
    calculateLiurenFromInputs();
    return;
  }
  if (earlyAction === "liuren-reset") {
    resetLiuren();
    return;
  }
  if (earlyAction === "liuren-copy") {
    copyLiurenResult();
    return;
  }
  if (earlyAction === "liuren-ask-xu") {
    openLiurenXuChat();
    return;
  }
  if (earlyAction === "liuyao-mode") {
    setLiuyaoMode(earlyActionTarget.dataset.mode || "online");
    return;
  }
  if (earlyAction === "liuyao-submit-question") {
    ensureLiuyaoQuestionAllowed();
    return;
  }
  if (earlyAction === "liuyao-open-caster" || earlyAction === "liuyao-focus-caster") {
    openLiuyaoCasterModal();
    return;
  }
  if (earlyAction === "liuyao-close-caster") {
    closeLiuyaoCasterModal();
    return;
  }
  if (earlyAction === "liuyao-toss") {
    startLiuyaoAnimatedToss({ power: LIUYAO_DEFAULT_POWER, pull: LIUYAO_PULL_MAX * LIUYAO_DEFAULT_POWER, duration: 320 });
    return;
  }
  if (earlyAction === "liuyao-toss-all") {
    tossLiuyaoLine(true);
    return;
  }
  if (earlyAction === "liuyao-manual-coin") {
    setLiuyaoManualCoin(
      Number(earlyActionTarget.dataset.lineIndex || 0),
      Number(earlyActionTarget.dataset.coinIndex || 0),
      Number(earlyActionTarget.dataset.coinFace || 0)
    );
    return;
  }
  if (earlyAction === "liuyao-manual-confirm-line") {
    confirmLiuyaoManualLine(Number(earlyActionTarget.dataset.lineIndex || 0));
    return;
  }
  if (earlyAction === "liuyao-manual-clear-line") {
    clearLiuyaoManualLine(Number(earlyActionTarget.dataset.lineIndex || 0));
    return;
  }
  if (earlyAction === "liuyao-manual-clear-last") {
    clearLastLiuyaoManualLine();
    return;
  }
  if (earlyAction === "liuyao-manual-line") {
    cycleLiuyaoManualLine(Number(earlyActionTarget.dataset.lineIndex || 0));
    return;
  }
  if (earlyAction === "liuyao-show-result") {
    showLiuyaoResultIfAllowed();
    return;
  }
  if (earlyAction === "liuyao-reset") {
    requestLiuyaoReset();
    return;
  }
  if (earlyAction === "liuyao-reset-cancel") {
    cancelLiuyaoReset();
    return;
  }
  if (earlyAction === "liuyao-reset-confirm") {
    confirmLiuyaoReset();
    return;
  }
  if (earlyAction === "liuyao-ask-xu") {
    openLiuyaoXuChat();
    return;
  }
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    if (routeButton.dataset.route !== "screen-17") setLiuyaoCasterModalOpen(false);
    if (liuyaoTossAnimation?.active && routeButton.dataset.route !== "screen-17") clearLiuyaoTossAnimation();
    if (routeButton.dataset.route === "screen-4") clearWentianXuChatContext();
    navigate(routeButton.dataset.route);
    return;
  }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "back") {
    setLiuyaoCasterModalOpen(false);
    if (state.route === "screen-43") {
      navigate("screen-42", false);
      return;
    }
    const previousRoute = state.stack.pop();
    navigate(previousRoute || (mineBackFallbackRoutes.has(state.route) ? "screen-31" : "home"), false);
    return;
  }
  if (action === "wentian-login-open") {
    wentianAuthState.mode = "login";
    wentianAuthState.error = "";
    navigate("screen-40");
    return;
  }
  if (action === "wentian-auth-mode") {
    const mode = event.target.closest("[data-auth-mode]")?.dataset.authMode || "login";
    wentianAuthState.mode = mode === "register" ? "register" : "login";
    wentianAuthState.error = "";
    navigate("screen-40", false);
    return;
  }
  if (action === "wentian-auth-submit") {
    submitWentianAuth(wentianAuthState.mode);
    return;
  }
  if (action === "wentian-google-login") {
    startWentianGoogleLogin();
    return;
  }
  if (action === "wentian-auth-logout") {
    signOutWentianAuth();
    return;
  }
  if (action === "wentian-order-refresh") {
    hydrateWentianOrders({ force: true, rerender: true });
    return;
  }
  if (action === "wentian-refund-ticket") {
    openWentianRefundTicket();
    return;
  }
  if (action === "wentian-auth-logout-open") {
    openWentianLogoutConfirm();
    return;
  }
  if (action === "wentian-auth-logout-cancel") {
    closeWentianLogoutConfirm();
    return;
  }
  if (action === "wentian-password-save") {
    submitWentianPasswordForm();
    return;
  }
  if (action === "wentian-hepan-pick") {
    const option = event.target.closest("[data-archive-id]");
    if (option?.dataset.archiveId) toggleWentianHepanArchive(option.dataset.archiveId);
    return;
  }
  if (action === "wentian-hepan-confirm") {
    confirmWentianHepanSelection();
    return;
  }
  if (action === "wentian-hepan-ask-xu") {
    openWentianHepanXuChat();
    return;
  }
  if (action === "wentian-share-wechat") {
    shareWentianApp("wechat");
    return;
  }
  if (action === "wentian-share-moments") {
    shareWentianApp("moments");
    return;
  }
  if (action === "wentian-share-system") {
    shareWentianApp("system");
    return;
  }
  if (action === "wentian-share-mail") {
    shareWentianApp("mail");
    return;
  }
  if (action?.startsWith("wentian-contact-")) {
    handleWentianContactAction(action);
    return;
  }
  if (action === "wentian-invite-copy-code") {
    if (!requireWentianInviteAccount()) return;
    copyWentianText(getWentianInviteSnapshot().inviteCode, "邀请码已复制");
    return;
  }
  if (action === "wentian-invite-copy-link") {
    if (!requireWentianInviteAccount()) return;
    copyWentianText(getWentianInviteSnapshot().inviteLink, "邀请链接已复制");
    return;
  }
  if (action === "wentian-invite-share") {
    if (!requireWentianInviteAccount()) return;
    shareWentianInvite();
    return;
  }
  if (action === "wentian-invite-bind") {
    bindWentianInviteFromInput();
    return;
  }
  if (action === "wentian-invite-refresh") {
    hydrateWentianInvite({ force: true, rerender: true });
    return;
  }
  if (action === "wentian-archive-pick") {
    const option = event.target.closest("[data-archive-id]");
    if (option?.dataset.archiveId) pickWentianArchive(option.dataset.archiveId);
    return;
  }
  if (action === "wentian-archive-confirm") {
    confirmWentianArchiveSelection();
    return;
  }
  if (action === "wentian-archive-cancel") {
    cancelWentianArchiveSelection();
    return;
  }
  if (action === "wentian-profile-search-focus") {
    const input = document.getElementById("wentian-profile-search");
    input?.focus();
    input?.select?.();
    return;
  }
  if (action === "wentian-profile-open") {
    const id = event.target.closest("[data-archive-id]")?.dataset.archiveId;
    const archive = getWentianArchiveList().find((item) => item.id === id);
    if (applyWentianArchiveToCurrent(archive)) navigate("screen-27");
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
  if (action === "wentian-profile-sync") {
    syncWentianProfileToAccount();
    return;
  }
  if (action === "wentian-member-pay") {
    startWentianMemberPayment();
    return;
  }
  if (action === "wentian-pay-provider") {
    const provider = event.target.closest("[data-provider]")?.dataset.provider || "wechat";
    const meta = getWentianPaymentProviderMeta(provider);
    if (meta.enabled) wentianPaymentState.provider = provider;
    navigate(state.route, false);
    return;
  }
  if (action === "wentian-pay-open") {
    openWentianPaymentUrl();
    return;
  }
  if (action === "wentian-pay-mock-success") {
    completeWentianMockPayment();
    return;
  }
  if (action === "wentian-payment-check") {
    checkWentianPaymentStatus();
    return;
  }
  if (action === "wentian-pay-done") {
    navigate("screen-31");
    return;
  }
  if (action === "wentian-chart-ai-decode") {
    decodeWentianChartAi();
    return;
  }
  if (action === "wentian-chart-ai-module") {
    const moduleKey = event.target.closest("[data-ai-module]")?.dataset.aiModule || "";
    decodeWentianChartAiModule(moduleKey);
    return;
  }
  if (action === "wentian-chart-ai-specials") {
    decodeWentianChartAiSpecials();
    return;
  }
  if (action === "wentian-chart-ai-curve") {
    generateWentianChartCurve();
    return;
  }
  if (action === "wentian-chart-ai-advice") {
    decodeWentianChartAiAdvice();
    return;
  }
  if (action === "wentian-chart-ai-jump") {
    const index = Number(event.target.closest("[data-report-index]")?.dataset.reportIndex || 0);
    scrollToWentianMobileChapter(index);
    return;
  }
  if (action === "wentian-open-mingbook-onepage") {
    downloadWentianMingbookPdf();
    return;
  }
  if (action === "wentian-chart-gender") {
    const value = event.target.closest("[data-wentian-chart-gender]")?.dataset.wentianChartGender || "male";
    setWentianChartButtonValue("gender", value);
    updateWentianChartPreview();
    return;
  }
  if (action === "wentian-chart-type") {
    const value = event.target.closest("[data-wentian-chart-type]")?.dataset.wentianChartType || "ziwei";
    setWentianChartButtonValue("type", value);
    return;
  }
  if (action === "wentian-chart-cal") {
    const value = event.target.closest("[data-wentian-chart-cal]")?.dataset.wentianChartCal || "solar";
    setWentianChartCalendarMode(value);
    return;
  }
  if (action === "wentian-chart-city-pick") {
    const index = Number(event.target.closest("[data-city-index]")?.dataset.cityIndex);
    applyWentianChartCity(makeWentianCity(getWentianCityRows()[index]));
    return;
  }
  if (action === "wentian-chart-city-clear") {
    applyWentianChartCity(null);
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

document.addEventListener("input", (event) => {
  if (event.target.id === "wentian-profile-search") {
    wentianProfileSearchQuery = event.target.value || "";
    const list = document.getElementById("wentian-profile-list");
    if (list) list.innerHTML = renderWentianProfileRows(getWentianArchiveList(), wentianProfileSearchQuery);
    return;
  }
  if (event.target.closest?.(".liuyao-panel")) {
    if (event.target.id === "liuyao-question") saveLiuyaoQuestionFromDom();
    return;
  }
  if (event.target.closest?.(".liuren-panel")) {
    if (event.target.id === "liuren-year") updateLiurenDayOptions();
    liurenHasStarted = false;
    liurenXuRecordId = null;
    updateLiurenPreview({ reveal: false });
    return;
  }
  if (!event.target.closest?.(".wentian-chart-card")) return;
  if (event.target.id === "wentian-chart-city") {
    wentianChartCity = null;
    renderWentianChartCityDropdown(event.target.value);
  }
  if (event.target.id === "wentian-chart-year" || event.target.id === "wentian-chart-month") {
    updateWentianChartDayOptions(
      document.getElementById("wentian-chart-day"),
      getWentianNumber("wentian-chart-year"),
      getWentianNumber("wentian-chart-month")
    );
  }
  if (event.target.id === "wentian-chart-lunar-year" || event.target.id === "wentian-chart-lunar-month" || event.target.id === "wentian-chart-lunar-leap") {
    const lunarYear = getWentianNumber("wentian-chart-lunar-year");
    const lunarMonth = getWentianNumber("wentian-chart-lunar-month");
    const isLeap = document.getElementById("wentian-chart-lunar-leap")?.checked && getWentianLunarLeapMonth(lunarYear) === lunarMonth;
    updateWentianChartDayOptions(document.getElementById("wentian-chart-lunar-day"), 0, 0, getWentianLunarMonthMax(lunarYear, lunarMonth, isLeap));
  }
  updateWentianChartPreview();
});

document.addEventListener("change", (event) => {
  if (event.target.closest?.(".liuren-panel")) {
    if (event.target.id === "liuren-year" || event.target.id === "liuren-month") updateLiurenDayOptions();
    liurenHasStarted = false;
    liurenXuRecordId = null;
    updateLiurenPreview({ reveal: false });
    return;
  }
  if (!event.target.closest?.(".wentian-chart-card")) return;
  if (event.target.id === "wentian-chart-year" || event.target.id === "wentian-chart-month") {
    updateWentianChartDayOptions(
      document.getElementById("wentian-chart-day"),
      getWentianNumber("wentian-chart-year"),
      getWentianNumber("wentian-chart-month")
    );
  }
  if (event.target.id === "wentian-chart-lunar-year" || event.target.id === "wentian-chart-lunar-month" || event.target.id === "wentian-chart-lunar-leap") {
    const lunarYear = getWentianNumber("wentian-chart-lunar-year");
    const lunarMonth = getWentianNumber("wentian-chart-lunar-month");
    const isLeap = document.getElementById("wentian-chart-lunar-leap")?.checked && getWentianLunarLeapMonth(lunarYear) === lunarMonth;
    updateWentianChartDayOptions(document.getElementById("wentian-chart-lunar-day"), 0, 0, getWentianLunarMonthMax(lunarYear, lunarMonth, isLeap));
  }
  updateWentianChartPreview();
});

function buildScreenNav() {
  if (!screenNav) return;
  screenNav.innerHTML = convertedScreens.map((screen) => `
    <button type="button" data-route="screen-${screen.no}">
      ${String(screen.no).padStart(2, "0")} ${screen.title}
    </button>
  `).join("");
}

async function submitWentianAuth(mode = wentianAuthState.mode) {
  const phone = (document.getElementById("wentian-auth-phone")?.value || "").trim();
  const password = document.getElementById("wentian-auth-password")?.value || "";
  const email = inputToWentianAuthEmail(phone);
  const usingEmail = /@/.test(phone);
  if (mode === "register" && usingEmail) {
    wentianAuthState.error = "注册请填写手机号";
    navigate("screen-40", false);
    return;
  }
  if (!email) {
    wentianAuthState.error = mode === "register" ? "请输入正确手机号" : "请输入正确手机号或邮箱";
    navigate("screen-40", false);
    return;
  }
  if (password.length < 6) {
    wentianAuthState.error = "密码至少 6 位";
    navigate("screen-40", false);
    return;
  }
  wentianAuthState.loading = true;
  wentianAuthState.error = "";
  navigate("screen-40", false);
  try {
    let data = null;
    if (mode === "register") {
      data = await wentianFetchJson("/api/auth/register-phone", {
        method: "POST",
        body: { phone, password },
        noAuth: true,
      }).catch((error) => {
        if (!/已注册|already|exists/i.test(error.message || "")) throw error;
        return null;
      });
    }
    if (!data?.session) {
      data = await wentianFetchJson("/api/auth/password-login", {
        method: "POST",
        body: { account: email || phone, password },
        noAuth: true,
      });
    }
    setWentianAuthSession(data?.session || null);
    wentianAuthState.error = "";
    await bindWentianPendingInvite();
    await hydrateWentianInvite({ force: true });
    if (wentianPendingPaymentAfterLogin) {
      wentianPendingPaymentAfterLogin = false;
      await startWentianMemberPayment();
      return;
    }
    navigate("screen-31");
  } catch (error) {
    wentianAuthState.error = error.message || "登录失败";
    navigate("screen-40", false);
  } finally {
    wentianAuthState.loading = false;
  }
}

async function startWentianGoogleLogin() {
  if (!WENTIAN_GOOGLE_ENABLED) {
    wentianAuthState.error = "国内主站请使用手机号或邮箱登录";
    navigate("screen-40", false);
    return;
  }
  setWentianAuthReturnState({ after: wentianPendingPaymentAfterLogin ? "member-payment" : "account" });
  wentianAuthState.error = "";
  try {
    const data = await wentianFetchJson("/api/auth/oauth-url", {
      method: "POST",
      body: {
        provider: "google",
        redirectTo: getWentianGoogleRedirectUrl(),
      },
      noAuth: true,
    });
    if (!data?.url) throw new Error("Google 登录地址生成失败");
    window.location.href = data.url;
  } catch (error) {
    clearWentianAuthReturnState();
    wentianAuthState.error = error.message || "Google 登录失败，请稍后重试";
    navigate("screen-40", false);
  }
}

async function signOutWentianAuth() {
  setWentianAuthSession(null);
  wentianLogoutConfirmOpen = false;
  navigate("screen-31", false);
}

async function submitWentianPasswordForm() {
  if (wentianPasswordState.loading) return;
  const password = document.getElementById("wentian-password-new")?.value || "";
  const confirm = document.getElementById("wentian-password-confirm")?.value || "";
  if (password.length < 6) {
    setWentianPasswordStatus("密码至少 6 位", "error");
    return;
  }
  if (password !== confirm) {
    setWentianPasswordStatus("两次密码不一致", "error");
    return;
  }
  const session = await getWentianAuthSession();
  if (!session?.user) {
    wentianAuthState.mode = "register";
    navigate("screen-40");
    return;
  }
  wentianPasswordState.loading = true;
  setWentianPasswordStatus("正在保存...");
  try {
    await wentianFetchJson("/api/auth/password", {
      method: "POST",
      body: { password },
    });
    document.getElementById("wentian-password-new").value = "";
    document.getElementById("wentian-password-confirm").value = "";
    setWentianPasswordStatus("密码已更新", "ok");
  } catch (error) {
    setWentianPasswordStatus(error.message || "密码保存失败", "error");
  } finally {
    wentianPasswordState.loading = false;
  }
}

async function consumeWentianAuthCallback() {
  const error = getWentianAuthCallbackError();
  if (error) {
    wentianAuthState.error = String(error).replace(/\+/g, " ");
    return null;
  }
  const callbackSession = buildWentianAuthSessionFromCallback();
  if (callbackSession) {
    const data = await wentianFetchJson("/api/auth/session", {
      authToken: callbackSession.access_token,
    });
    setWentianAuthSession({ ...callbackSession, user: data?.user || null });
    if (!wentianAuthSession?.user) throw new Error("Google 登录失败，请重试");
    return wentianAuthSession;
  }
  const code = getWentianAuthCallbackValue("code");
  if (code) {
    const data = await wentianFetchJson("/api/auth/exchange-code", {
      method: "POST",
      body: { code },
      noAuth: true,
    });
    setWentianAuthSession(data?.session || null);
    return wentianAuthSession;
  }
  return initWentianAuth();
}

async function bootWentianApp() {
  buildScreenNav();
  captureWentianInviteFromUrl();
  const paypalReturn = getWentianPayPalReturnParams();
  if (!isWentianAuthCallbackUrl()) {
    navigate(paypalReturn ? "screen-30" : routeFromLocation(), false);
    if (paypalReturn) window.setTimeout(() => captureWentianPayPalReturn(paypalReturn), 120);
    return;
  }
  const returnState = getWentianAuthReturnState();
  let session = null;
  try {
    session = await consumeWentianAuthCallback();
  } catch (error) {
    wentianAuthState.error = error.message || "Google 登录失败，请稍后重试";
  }
  const nextRoute = session?.user ? "screen-31" : "screen-40";
  replaceWentianUrlRoute(nextRoute);
  navigate(nextRoute, false);
  if (session?.user) {
    wentianMemberState.loaded = false;
    wentianOrderState.loaded = false;
    wentianInviteState.loaded = false;
    await bindWentianPendingInvite();
    await hydrateWentianInvite({ force: true });
    if (returnState?.after === "member-payment") {
      window.setTimeout(() => startWentianMemberPayment(), 120);
    }
  }
  clearWentianAuthReturnState();
}

window.addEventListener("hashchange", () => navigate(routeFromLocation(), false));
window.addEventListener("resize", fitActivePhoneShell);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", fitActivePhoneShell);
  window.visualViewport.addEventListener("scroll", fitActivePhoneShell);
}
ensureWentianPhoneFitObserver();
bootWentianApp();
