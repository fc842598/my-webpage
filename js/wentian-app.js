const reports = [
  ["生命健康预测报告", "基于八字信息生成长期生命能量曲线，预见人生波峰与波谷。", "¥99"],
  ["2026丙午年预测报告", "覆盖事业、财富、感情婚姻、健康关注和行动建议。", "¥50"],
  ["八字与MBTI人格深度解析", "融合人格模型与命盘结构，拆解性格、关系与发展节奏。", "¥58"],
  ["合盘关系报告", "分析双方关系吸引力、冲突点和长期相处策略。", "¥68"]
];

const profiles = [
  ["谢广周", "普通会员 / 账号信息", "男 / 1990-05-11 / 已保存"],
  ["晴子阿炳", "AI问天默认档案", "女 / 1995-08-18 / 已保存"]
];

const plans = [
  ["120 灵石", "¥12.00", "适合体验单次问答"],
  ["280 灵石", "¥28.00", "适合解锁短报告"],
  ["580 灵石", "¥58.00", "适合报告与问答组合"]
];

const convertedScreens = [
  { no: 1, title: "授权书", active: "", cards: [["本人授权问天AI依据输入资料生成排盘、合盘与AI解读。", "签署人：谢广周 / 2026-05-11"]], badge: "已授权" },
  { no: 2, title: "首页/报告商城", active: "首页", heading: "问天AI", cards: [["你的专属命理报告，立即生成", "排盘、合盘、流年、AI解读", "立即生成", "screen-26"], ["生命曲线预测报告 ¥99", "可编辑报告卡片", "", "screen-27"], ["2026丙午年预测报告 ¥50", "可编辑报告卡片", "", "screen-27"], ["八字与MBTI人格深度解析 ¥58", "可编辑报告卡片", "", "screen-27"]] },
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
  { no: 34, title: "分享应用", active: "我的", modalTitle: "分享应用", modalItems: ["分享文本", "邀请码：8R7U58ZW", "微信好友 / 朋友圈 / 复制链接"], next: "screen-31" },
  { no: 35, title: "联系我们", active: "我的", list: [["电子邮箱", "", ""], ["小红书", "", ""], ["微信公众号", "", ""], ["X", "", ""]] },
  { no: 36, title: "关于我们", active: "我的", cards: [["问天AI v1.0.3199", "问天AI是一款命理排盘、合盘、抽签与AI解读工具。"], ["隐私协议", ""], ["用户协议", ""], ["检查更新", ""]] },
  { no: 37, title: "语言设置", active: "我的", modalTitle: "语言设置", modalItems: ["简体中文 ✓", "繁體中文", "English"], next: "screen-38" },
  { no: 38, title: "账户设置", active: "我的", list: [["基本信息", "", "screen-39"], ["登录方式", "", "screen-40"], ["设置密码", "", "screen-41"], ["退出登录", "", "screen-31"]] },
  { no: 39, title: "基本信息", active: "我的", form: ["昵称 谢广周", "邮箱 aa1598...@gmail.com", "手机号 绑定"], button: ["保存", "screen-38"] },
  { no: 40, title: "登录方式", active: "我的", list: [["Apple", "", ""], ["邮箱", "", ""], ["手机号", "", ""], ["Google", "", ""]] },
  { no: 41, title: "设置密码", active: "我的", form: ["新密码", "确认密码"], button: ["保存", "screen-40"] }
];

const convertedByNo = new Map(convertedScreens.map((screen) => [screen.no, screen]));

const screenFlowHotspots = {
  1: [[286, 24, 86, 52, "screen-26"], [48, 249, 295, 45, "screen-4"], [18, 342, 318, 157, "screen-2"], [18, 580, 354, 274, "screen-4"], [18, 875, 354, 96, "screen-10"], [18, 984, 354, 96, "screen-13"], [18, 1093, 354, 96, "screen-17"], [18, 1202, 354, 96, "screen-23"], [18, 1378, 354, 104, "screen-22"], [18, 1502, 354, 104, "screen-23"], [2, 1638, 76, 83, "screen-1"], [80, 1638, 76, 83, "screen-25"], [158, 1638, 76, 83, "screen-3"], [236, 1638, 76, 83, "screen-13"], [314, 1638, 76, 83, "screen-31"]],
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
  41: [[18, 44, 48, 48, "screen-40"], [42, 742, 306, 56, "screen-40"]]
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
      ${figText(`screen-${screen.no}-section-desc-${index}`, "这里放置完整长文解读内容。", 58, y + 42, 274, 12, "#8c8275")}
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
    ${figText("source-4-hello", "你好！我是许半仙", 24, 169, 320, 27, "#c4a45a", 800)}
    ${figText("source-4-sub", "当前命盘已接入，可直接追问。", 24, 210, 260, 15, "#aaa196")}
    ${figBox("source-4-bazi", 22, 250, 346, 156, "converted-card", "border-radius:13px;box-shadow:0 6px 18px rgba(74,55,32,.12);")}
    ${figBox("source-4-mingpan-icon", 166, 282, 58, 58, "", "border-radius:18px;background:#f6efdf;")}
    ${figText("source-4-mingpan-icon-text", "紫", 166, 297, 58, 25, "#c4a45a", 800, "center")}
    ${figText("source-4-mingpan-title", "已读取您的紫微命盘", 0, 352, 390, 20, "#26211c", 800, "center")}
    ${figText("source-4-mingpan-sub", `${escapeHtml(active.name)}的命盘已接入，可直接提问`, 42, 382, 306, 13, "#8f857a", 400, "center")}
    <div id="wentian-chat-status" class="wentian-chat-status">正在接入许半仙…</div>
    <div id="wentian-chat-messages" class="wentian-chat-log" aria-live="polite"></div>
    <button class="wentian-chat-chip" type="button" style="left:18px" data-wentian-prompt="结合我的命盘，先讲我的个人性格和做事模式。">个人性格</button>
    <button class="wentian-chat-chip" type="button" style="left:112px" data-wentian-prompt="结合我的命盘，重点看感情建议，我容易卡在哪里？">感情建议</button>
    <button class="wentian-chat-chip" type="button" style="left:212px" data-wentian-prompt="结合我的命盘，看事业财运接下来怎么走。">事业财运</button>
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

async function wentianPostJson(path, payload, timeoutMs = 45000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
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

function setWentianChatStatus(text, tone = "") {
  const el = document.getElementById("wentian-chat-status");
  if (!el) return;
  el.textContent = text;
  el.dataset.tone = tone;
}

function setWentianQuota(quota) {
  const el = document.querySelector('[data-node-id="source-4-left"]');
  if (!el || !quota) return;
  const remaining = Number.isFinite(Number(quota.remaining)) ? quota.remaining : "--";
  const limit = Number.isFinite(Number(quota.limit)) ? quota.limit : "--";
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

async function ensureWentianXuSession() {
  if (wentianXuChat.sessionId) return wentianXuChat.sessionId;
  if (wentianXuChat.sessionPromise) return wentianXuChat.sessionPromise;

  setWentianChatStatus("正在接入许半仙…");
  const chartData = getWentianChartPayload();
  wentianXuChat.sessionPromise = wentianPostJson("/api/ai/chat/session", {
    chartRecordId: chartData.chartRecordId,
    chartData,
    transientState: loadWentianTransientState(),
  }, 20000).then((data) => {
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
    setWentianChatStatus("许半仙暂时未连上", "error");
    if (!wentianXuChat.messages.length) addWentianMessage("system", `连接失败：${error.message || "后端暂时不可用"}`);
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
    await ensureWentianXuSession();
    const data = await wentianPostJson("/api/ai/chat/send", {
      chartRecordId: chartData.chartRecordId,
      message,
      chartData,
      transientState: loadWentianTransientState(),
    }, 60000);
    wentianXuChat.messages.pop();
    if (data.transientState) saveWentianTransientState(data.transientState);
    setWentianQuota(data.quota);
    setWentianChatStatus(data.transientMode ? "临时会话已接入" : "许半仙已连接", data.transientMode ? "warn" : "ok");
    addWentianMessage("assistant", data.reply || "我看到了，但这轮没有返回内容，请再问一次。");
  } catch (error) {
    wentianXuChat.messages.pop();
    addWentianMessage("system", `发送失败：${error.message || "许半仙暂时不可用"}`);
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
  ensureWentianXuSession().catch(() => {});
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
    ${[["邀请好友", "0 人", 491], ["兑换礼包", "", 552], ["语言设置", languageLabel, 629], ["分享应用", "", 690], ["联系我们", "", 767]].map(([label, value, y], index) => `
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

    ${figText("source-39-tip", "信息仅保存在当前浏览器，用于原型体验。", 42, 454, 300, 13, "#9b9287")}
    <div id="wentian-profile-status" class="wentian-profile-status"></div>
    ${figBox("source-39-save", 36, 690, 318, 58, "", "border-radius:29px;background:#c09a49;box-shadow:0 8px 18px rgba(130,91,31,.12);")}
    ${figButton("source-39-save-hit", 36, 690, 318, 58, 'data-action="wentian-profile-save"')}
    ${figText("source-39-save-text", "保存", 36, 709, 318, 18, "#fff", 700, "center")}
    ${sourceAppBottomNav("我的", 755)}
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
    ${figBox(`screen-${screen.no}-avatar`, 42, 108, 44, 44, "converted-card", "border-radius:22px;background:#f2e8d6;")}
    ${figText(`screen-${screen.no}-avatar-text`, "谢", 42, 120, 44, 14, "#b88c33", 700, "center")}
    ${figText(`screen-${screen.no}-hello`, "你好！我是量子阿炳", 92, 112, 240, 21, "#b88c33", 700)}
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
      figText("reply-ai", "你的八字显示辛未、癸巳、丁亥、辛亥。核心是敏感、洞察力强，适合把直觉转化为决策。", 42, 360, 304, 14, "#26211c");
  }
  return base;
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
      ${[["问天会员", "screen-33"], ["灵石充值", "screen-29"], ["我的报告", "screen-27"], ["订单记录", "screen-30"], ["邀请好友", "screen-22"], ["语言设置", "screen-37"], ["分享应用", "screen-34"], ["联系我们", "screen-35"]].map(([label, route], index) => {
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
    ${figBox("source-1-bg", 0, 0, 390, 1721, "", "background:linear-gradient(180deg,#fffdf8 0%,#fbf7ef 50%,#faf5ed 100%);")}
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

    ${[["合盘分析", "命理相合，缘分几许", "01-feature-hepan.png", "screen-10", 875], ["黄大仙灵签", "求签问卦，指引方向", "01-feature-qian.png", "screen-13", 984], ["六爻占卜", "铜钱起卦，纳甲解卦", "01-feature-gua.png", "screen-17", 1093], ["万年历", "每日宜忌，趋吉避凶", "01-feature-li.png", "screen-23", 1202]].map(([title, sub, icon, route, y], index) => `
      ${figBox(`source-1-feature-${index}`, 18, y, 354, 96, "converted-card", "border-radius:14px;box-shadow:0 8px 20px rgba(70,45,25,.1);background:#fffdfb;")}
      ${figText(`source-1-feature-title-${index}`, title, 36, y + 30, 150, 21, "#25221f", 800)}
      ${figText(`source-1-feature-sub-${index}`, sub, 36, y + 58, 190, 14, "#969087", 500)}
      ${figImage(`source-1-feature-icon-${index}`, `../images/wentian-prototype-assets/${icon}`, 286, y + 10, 72, 76, "object-fit:contain;")}
      ${figButton(`source-1-feature-hit-${index}`, 18, y, 354, 96, `data-route="${route}"`)}
    `).join("")}
    ${figText("source-1-more-title", "更多功能", 18, 1328, 130, 22, "#25221f", 800)}
    ${[["邀请好友", "邀请好友双方获得奖励", "01-extra-invite.png", "screen-22", 1378], ["活动中心", "参与活动赢取丰厚奖励", "01-extra-activity.png", "screen-23", 1502]].map(([title, sub, icon, route, y], index) => `
      ${figBox(`source-1-extra-${index}`, 18, y, 354, 104, "converted-card", "border-radius:14px;box-shadow:0 8px 20px rgba(70,45,25,.1);")}
      ${figText(`source-1-extra-title-${index}`, title, 36, y + 31, 150, 21, "#25221f", 800)}
      ${figText(`source-1-extra-sub-${index}`, sub, 36, y + 61, 210, 14, "#969087", 500)}
      ${figImage(`source-1-extra-icon-${index}`, `../images/wentian-prototype-assets/${icon}`, 300, y + 36, 52, 50, "object-fit:contain;")}
      ${figButton(`source-1-extra-hit-${index}`, 18, y, 354, 104, `data-route="${route}"`)}
    `).join("")}
    ${sourceAppBottomNav("首页", 1638)}
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
    `, 1721, "converted source-screen no-status-shift", false);
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
  if (screen.no === 39) {
    return figPhone(`screen-${screen.no}`, `${String(screen.no).padStart(2, "0")} ${screen.title}`, `
      ${sourceBasicInfoScreen()}
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

function navigate(route, push = true) {
  route = resolveRoute(route);
  if (/^screen-?\d+$/.test(route)) {
    const no = Number(route.replace(/^screen-?/, ""));
    const screen = convertedByNo.get(no) || convertedByNo.get(2);
    route = `screen-${screen.no}`;
    if (push && route !== state.route) state.stack.push(state.route);
    state.route = route;
    routeKicker.textContent = "Figma Editable Prototype";
    routeTitle.textContent = `${String(screen.no).padStart(2, "0")} ${screen.title}`;
    view.innerHTML = renderConvertedScreen(screen.no);
    stripScreenshotStatusBar();
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
    ${figText("17:158", "分享应用", 68, 763, 150, 20, "#21211f")}
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
    ${figText("17:91", "灵石仅限问天App内使用，充值后不支持退款", 52, 746, 286, 13, "#9e998f", 400, "center")}
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
buildScreenNav();
navigate(routeFromLocation(), false);
