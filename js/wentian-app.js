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

const state = {
  route: "home",
  stack: []
};

const view = document.getElementById("view");
const routeKicker = document.getElementById("routeKicker");
const routeTitle = document.getElementById("routeTitle");

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

function figPhone(nodeId, name, body, height = 844) {
  return `
    <div class="phone-wrap">
      <section class="figma-phone" data-node-id="${nodeId}" data-name="${name}" style="height:${height}px">
        ${body}
        <div class="fig-home-indicator"></div>
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
    ${figBox("bottom-bg", 0, 760, 390, 84, "", "background:rgba(255,255,255,.88);")}
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

function navigate(route, push = true) {
  if (!routes[route]) route = "home";
  if (push && route !== state.route) state.stack.push(state.route);
  state.route = route;
  const [kicker, title, render] = routes[route];
  routeKicker.textContent = kicker;
  routeTitle.textContent = title;
  view.innerHTML = render();
  syncActive();
  location.hash = route;
  window.scrollTo(0, 0);
}

function syncActive() {
  for (const button of document.querySelectorAll("[data-route]")) {
    button.classList.toggle("is-active", button.dataset.route === state.route);
  }
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
    ${figText("17:8", "瞎子阿炳", 96, 59, 150, 22, "#21211f", 700)}
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
    ${figText("17:18", "你好！我是瞎子阿炳", 24, 219, 316, 32, "#ba8f38", 700)}
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
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    navigate(routeButton.dataset.route);
    return;
  }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "back") navigate(state.stack.pop() || "home", false);
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

window.addEventListener("hashchange", () => navigate(location.hash.slice(1) || "home", false));
navigate(location.hash.slice(1) || "home", false);
