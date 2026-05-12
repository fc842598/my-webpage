const ASSET_BASE = "../images/wentian-prototype/";

const screens = [
  { no: 1, title: "授权书", w: 390, h: 536, image: "01-auth.jpg", hotspots: [] },
  { no: 2, title: "首页/报告商城", w: 390, h: 867, image: "02-home.jpg", hotspots: [[63,812,62,45,3,"档案"],[164,812,62,45,4,"AI问天"],[300,812,62,45,31,"我的"],[22,210,346,122,4,"报告卡片1"],[22,344,346,122,4,"报告卡片2"]] },
  { no: 3, title: "档案列表", w: 390, h: 1011, image: "03-archive.jpg", hotspots: [[18,43,48,48,2,"返回首页"],[310,43,58,48,5,"新增档案"],[20,114,350,118,4,"第一张档案"],[164,956,62,45,4,"AI问天"],[300,956,62,45,31,"我的"]] },
  { no: 4, title: "AI问天", w: 390, h: 844, image: "04-ai.jpg", hotspots: [[21,96,348,78,9,"对话记录"],[32,177,326,50,5,"切换档案"],[28,274,334,62,6,"个人性格"],[28,346,334,62,6,"感情建议"],[51,750,240,50,6,"输入框"],[301,800,62,38,31,"我的"]] },
  { no: 5, title: "AI选择档案", w: 390, h: 867, image: "05-select-archive.jpg", hotspots: [[320,116,48,48,4,"关闭"],[34,235,322,72,6,"档案1"],[34,318,322,72,6,"档案2"],[48,748,294,52,6,"确认"]] },
  { no: 6, title: "AI提问中", w: 390, h: 867, image: "06-asking.jpg", hotspots: [[18,44,48,48,4,"回AI首页"],[88,600,220,76,7,"到回复态"]] },
  { no: 7, title: "AI回复", w: 390, h: 867, image: "07-reply.jpg", hotspots: [[18,44,48,48,4,"返回AI"],[54,280,282,168,8,"查看长文"]] },
  { no: 8, title: "AI长文", w: 390, h: 3639, image: "08-long.jpg", hotspots: [[18,44,48,48,7,"返回回复"]] },
  { no: 9, title: "对话记录", w: 390, h: 867, image: "09-records.jpg", hotspots: [[18,44,48,48,4,"返回AI"],[278,44,84,48,4,"新建对话"],[20,118,350,72,7,"第一条记录"],[20,198,350,72,7,"第二条记录"],[20,278,350,72,7,"第三条记录"]] },
  { no: 10, title: "合盘类型", w: 390, h: 867, image: "10-combo-type.jpg", hotspots: [[18,44,48,48,2,"返回首页"],[24,165,342,90,11,"类型1"],[24,270,342,90,11,"类型2"],[24,375,342,90,11,"类型3"],[164,812,62,45,4,"AI问天"],[300,812,62,45,31,"我的"]] },
  { no: 11, title: "合盘选择档案", w: 390, h: 867, image: "11-combo-archive.jpg", hotspots: [[18,44,48,48,10,"返回类型"],[20,120,350,88,12,"档案1"],[20,220,350,88,12,"档案2"],[42,742,306,56,12,"确认"]] },
  { no: 12, title: "随机提问", w: 390, h: 867, image: "12-random-question.jpg", hotspots: [[18,44,48,48,4,"返回AI"],[22,150,346,72,4,"问题1"],[116,690,158,54,4,"换一批"]] },
  { no: 13, title: "抽签", w: 390, h: 867, image: "13-draw-lots.jpg", hotspots: [[18,44,48,48,2,"返回首页"],[82,620,226,70,14,"开始抽签"]] },
  { no: 14, title: "抽签中", w: 390, h: 867, image: "14-drawing.jpg", hotspots: [[65,570,260,90,15,"到结果"]] },
  { no: 15, title: "抽签结果", w: 390, h: 867, image: "15-draw-result.jpg", hotspots: [[18,44,48,48,13,"返回抽签"],[43,615,304,58,16,"查看详情"]] },
  { no: 16, title: "签文详情", w: 390, h: 1266, image: "16-lot-detail.jpg", hotspots: [[18,44,48,48,15,"返回结果"],[162,1210,66,44,4,"回AI"]] },
  { no: 17, title: "起卦", w: 390, h: 867, image: "17-hexagram-start.jpg", hotspots: [[18,44,48,48,2,"返回首页"],[70,610,250,72,18,"开始投掷"],[164,812,62,45,4,"AI问天"],[63,812,62,45,3,"档案"]] },
  { no: 18, title: "起卦投掷4次", w: 390, h: 867, image: "18-hexagram-4.jpg", hotspots: [[18,44,48,48,17,"返回起卦"],[70,610,250,72,19,"继续投掷"]] },
  { no: 19, title: "起卦投掷5次", w: 390, h: 867, image: "19-hexagram-5.jpg", hotspots: [[18,44,48,48,18,"返回上一步"],[70,610,250,72,20,"查看结果"]] },
  { no: 20, title: "地风升结果", w: 390, h: 1679, image: "20-hexagram-result.jpg", hotspots: [[18,44,48,48,19,"返回投掷"],[42,1450,306,64,21,"购买解读"]] },
  { no: 21, title: "购买弹窗", w: 390, h: 867, image: "21-purchase-modal.jpg", hotspots: [[316,175,48,48,20,"关闭"],[50,705,290,58,29,"去充值"]] },
  { no: 22, title: "邀请好友", w: 390, h: 1317, image: "22-invite-friends.jpg", hotspots: [[18,44,48,48,31,"返回我的"],[250,44,112,48,23,"活动中心"],[42,1120,306,62,24,"邀请详情"]] },
  { no: 23, title: "活动中心", w: 390, h: 867, image: "23-activity-center.jpg", hotspots: [[18,44,48,48,22,"返回邀请"],[50,680,290,58,22,"邀请好友"]] },
  { no: 24, title: "邀请详情", w: 390, h: 1316, image: "24-invite-detail.jpg", hotspots: [[18,44,48,48,22,"返回邀请"]] },
  { no: 25, title: "档案", w: 390, h: 867, image: "25-profile.jpg", hotspots: [[18,44,48,48,3,"返回档案列表"],[164,812,62,45,4,"AI问天"],[300,812,62,45,31,"我的"]] },
  { no: 26, title: "排盘表单", w: 390, h: 867, image: "26-chart-form.jpg", hotspots: [[18,44,48,48,3,"返回档案"],[42,742,306,56,27,"提交"]] },
  { no: 27, title: "紫微命盘", w: 390, h: 867, image: "27-ziwei-chart.jpg", hotspots: [[18,44,48,48,26,"返回表单"],[42,742,306,56,33,"购买解读"]] },
  { no: 28, title: "卡券包", w: 390, h: 867, image: "28-coupons.jpg", hotspots: [[18,44,48,48,31,"返回我的"],[42,735,306,58,29,"去充值"]] },
  { no: 29, title: "灵石充值", w: 390, h: 844, image: "29-recharge.jpg", hotspots: [[18,44,48,48,31,"返回我的"],[22,178,346,70,30,"120套餐"],[22,257,346,70,30,"280套餐"],[22,336,346,70,30,"580套餐"],[34,738,322,58,30,"立即充值"]] },
  { no: 30, title: "支付页", w: 390, h: 867, image: "30-payment.jpg", hotspots: [[18,44,48,48,29,"返回充值"],[42,735,306,58,31,"完成支付"]] },
  { no: 31, title: "我的", w: 390, h: 844, image: "31-mine.jpg", hotspots: [[164,800,62,38,4,"AI问天"],[20,216,350,58,29,"灵石充值"],[63,800,62,38,3,"档案"],[20,800,62,38,2,"首页"],[318,44,48,48,38,"设置"],[20,154,350,58,33,"问天会员"],[20,386,350,58,22,"邀请好友"],[20,618,350,58,34,"分享应用"]] },
  { no: 32, title: "账户设置", w: 390, h: 867, image: "32-settings.jpg", hotspots: [[18,44,48,48,31,"返回我的"],[20,520,350,56,35,"联系我们"],[20,164,350,56,33,"问天会员"],[20,452,350,56,34,"分享应用"],[20,94,350,56,39,"基本信息"],[20,236,350,56,40,"登录方式"],[20,306,350,56,41,"设置密码"],[20,376,350,56,37,"语言设置"],[20,590,350,56,36,"关于我们"]] },
  { no: 33, title: "问天会员", w: 390, h: 1090, image: "33-membership.jpg", hotspots: [[18,44,48,48,31,"返回我的"],[42,990,306,58,29,"去充值"]] },
  { no: 34, title: "分享应用", w: 390, h: 867, image: "34-share-app.jpg", hotspots: [[18,44,48,48,31,"返回我的"],[42,735,306,58,22,"邀请好友"]] },
  { no: 35, title: "联系我们", w: 390, h: 867, image: "35-contact.jpg", hotspots: [[18,44,48,48,32,"返回设置"]] },
  { no: 36, title: "关于我们", w: 390, h: 867, image: "36-about.jpg", hotspots: [[18,44,48,48,38,"返回设置"]] },
  { no: 37, title: "语言设置", w: 390, h: 867, image: "37-language.jpg", hotspots: [[18,44,48,48,38,"返回设置"],[20,145,350,56,38,"选择中文"]] },
  { no: 38, title: "账户设置", w: 390, h: 867, image: "38-settings-alt.jpg", hotspots: [[18,44,48,48,31,"返回我的"],[20,150,350,56,39,"基本信息"],[20,220,350,56,40,"登录方式"],[20,290,350,56,41,"设置密码"],[20,360,350,56,37,"语言设置"],[20,500,350,56,35,"联系我们"],[20,570,350,56,36,"关于我们"]] },
  { no: 39, title: "基本信息", w: 390, h: 867, image: "39-basic-info.jpg", hotspots: [[18,44,48,48,38,"返回设置"],[42,742,306,56,38,"保存"]] },
  { no: 40, title: "登录方式", w: 390, h: 867, image: "40-login-method.jpg", hotspots: [[18,44,48,48,38,"返回设置"],[20,236,350,56,41,"设置密码"]] },
  { no: 41, title: "设置密码", w: 390, h: 867, image: "41-set-password.jpg", hotspots: [[18,44,48,48,40,"返回登录方式"],[42,742,306,56,40,"保存"]] }
];

const byNo = new Map(screens.map((screen) => [screen.no, screen]));
const historyStack = [];

const body = document.body;
const screenList = document.getElementById("screenList");
const screenMeta = document.getElementById("screenMeta");
const screenTitle = document.getElementById("screenTitle");
const screenImage = document.getElementById("screenImage");
const hotspotLayer = document.getElementById("hotspotLayer");
const phoneCanvas = document.getElementById("phoneCanvas");
const phoneScroll = document.querySelector(".phone-scroll");

let currentNo = Number(new URLSearchParams(location.hash.slice(1)).get("screen")) || 2;

function goTo(no, pushHistory = true) {
  const next = byNo.get(no) || byNo.get(2);
  const current = byNo.get(currentNo);
  if (pushHistory && current && current.no !== next.no) {
    historyStack.push(current.no);
  }
  currentNo = next.no;
  render(next);
  const params = new URLSearchParams();
  params.set("screen", String(next.no));
  history.replaceState(null, "", `${location.pathname}#${params.toString()}`);
  body.classList.remove("nav-open");
}

function render(screen) {
  screenMeta.textContent = `PX ${String(screen.no).padStart(2, "0")}`;
  screenTitle.textContent = screen.title;
  screenImage.src = `${ASSET_BASE}${screen.image}`;
  screenImage.alt = `PX ${String(screen.no).padStart(2, "0")} ${screen.title}`;
  phoneCanvas.style.aspectRatio = `${screen.w} / ${screen.h}`;
  hotspotLayer.replaceChildren();

  for (const [x, y, w, h, target, label] of screen.hotspots) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.title = label;
    button.ariaLabel = label;
    button.dataset.target = String(target);
    button.dataset.label = label;
    button.style.left = `${(x / screen.w) * 100}%`;
    button.style.top = `${(y / screen.h) * 100}%`;
    button.style.width = `${(w / screen.w) * 100}%`;
    button.style.height = `${(h / screen.h) * 100}%`;
    button.addEventListener("click", () => goTo(target));
    hotspotLayer.appendChild(button);
  }

  for (const item of screenList.querySelectorAll(".screen-btn")) {
    item.classList.toggle("is-active", Number(item.dataset.screen) === screen.no);
  }
  phoneScroll.scrollTo({ top: 0, left: 0 });
}

function buildScreenList() {
  const fragment = document.createDocumentFragment();
  for (const screen of screens) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "screen-btn";
    button.dataset.screen = String(screen.no);
    button.textContent = `${String(screen.no).padStart(2, "0")} ${screen.title}`;
    button.addEventListener("click", () => goTo(screen.no));
    fragment.appendChild(button);
  }
  screenList.replaceChildren(fragment);
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "home") goTo(2);
  if (action === "toggle-menu") body.classList.toggle("nav-open");
  if (action === "close-menu") body.classList.remove("nav-open");
  if (action === "toggle-hotspots") body.classList.toggle("show-hotspots");
  if (action === "back") goTo(historyStack.pop() || 2, false);
  if (action === "prev") goTo(Math.max(1, currentNo - 1));
  if (action === "next") goTo(Math.min(41, currentNo + 1));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") goTo(Math.max(1, currentNo - 1));
  if (event.key === "ArrowRight") goTo(Math.min(41, currentNo + 1));
  if (event.key === "Escape") goTo(historyStack.pop() || 2, false);
});

window.addEventListener("hashchange", () => {
  const no = Number(new URLSearchParams(location.hash.slice(1)).get("screen"));
  if (no && no !== currentNo) goTo(no, false);
});

buildScreenList();
goTo(currentNo, false);
