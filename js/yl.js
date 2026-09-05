(function () {
  "use strict";

  var STORAGE_KEY = "yuetian-health-assessment-v1";
  // Reuse the primary app browser id so health and chart chats share one quota.
  var CLIENT_ID_KEY = "ziwei_client_id";
  var GUEST_ASK_LIMIT = 3;
  var FREE_ASK_LIMIT = 8;
  var MEMBER_ASK_LIMIT = 30;
  var AUTH_SESSION_KEY = "wentian-app-auth-session-v1";
  var AUTH_REFRESH_SKEW_MS = 60 * 1000;
  var PAYMENT_HANDOFF_KEY = "yuetian-payment-handoff-v2";
  var MEMBER_RETURN_KEY = "yuetian-member-return-v1";
  var MEMBER_RETURN_TTL_MS = 2 * 60 * 60 * 1000;
  var MEMBER_PRODUCTS = {
    monthly_member: {
      productKey: "monthly_member",
      name: "三人深度月卡",
      nameEn: "Three-Profile Monthly Pass",
      amountYuan: "19.90",
      paypalAmount: "4.99",
      chartLimit: 3,
      dailyChatLimit: 30,
      chartText: "可保存3位命主",
      chartTextEn: "Save up to 3 profiles"
    },
    unlimited_member: {
      productKey: "unlimited_member",
      name: "无限畅享月卡",
      nameEn: "Unlimited Monthly Pass",
      amountYuan: "69.90",
      paypalAmount: "14.99",
      chartLimit: null,
      dailyChatLimit: 100,
      chartText: "不限命主人数",
      chartTextEn: "Unlimited profiles"
    }
  };
  var HEALTH_PRODUCT_KEY = "monthly_member";
  var HEALTH_PRODUCT_NAME = MEMBER_PRODUCTS.monthly_member.name;
  var HEALTH_PRODUCT_AMOUNT = MEMBER_PRODUCTS.monthly_member.amountYuan;
  var HEALTH_PAYPAL_AMOUNT = MEMBER_PRODUCTS.monthly_member.paypalAmount;
  var ALIPAY_CHECKOUT_VISIBLE = true;
  var ALIPAY_CHECKOUT_ENABLED = true;
  var PAYPAL_CHECKOUT_VISIBLE = true;
  var PAYPAL_CARD_CHECKOUT_VISIBLE = true;
  var PAGE_IDS = ["home", "assessment", "report", "chat", "member"];
  var DEFAULT_API_BASE = "https://api.yuetianai.com";
  var INITIAL_QUERY = new URLSearchParams(window.location.search || "");
  if (MEMBER_PRODUCTS[INITIAL_QUERY.get("productKey")]) {
    HEALTH_PRODUCT_KEY = INITIAL_QUERY.get("productKey");
    HEALTH_PRODUCT_NAME = MEMBER_PRODUCTS[HEALTH_PRODUCT_KEY].name;
    HEALTH_PRODUCT_AMOUNT = MEMBER_PRODUCTS[HEALTH_PRODUCT_KEY].amountYuan;
    HEALTH_PAYPAL_AMOUNT = MEMBER_PRODUCTS[HEALTH_PRODUCT_KEY].paypalAmount;
    MEMBER_ASK_LIMIT = MEMBER_PRODUCTS[HEALTH_PRODUCT_KEY].dailyChatLimit;
  }
  var INITIAL_RETURN_URL = INITIAL_QUERY.get("returnUrl") || "";
  var IS_ENGLISH_CHECKOUT = INITIAL_QUERY.get("lang") === "en"
    || /(?:\?|&)lang=en(?:&|#|$)/.test(INITIAL_RETURN_URL);
  var HEALTH_PAGE_TITLE = "AI中医体质分析 - 体质自评报告与健康追问";
  var MEMBER_PAGE_TITLE = IS_ENGLISH_CHECKOUT ? "Yuetian AI Monthly Pass Checkout" : "阅天AI月卡支付";

  var categories = [
    {
      id: "tongue",
      name: "舌象",
      icon: "舌",
      prompt: "选择最接近当前舌象的描述",
      options: [
        { label: "舌淡白", type: "qi", weight: 2 },
        { label: "舌红少苔", type: "yin", weight: 2 },
        { label: "舌苔厚腻", type: "damp", weight: 2 },
        { label: "有齿痕", type: "qi", weight: 1 },
        { label: "舌色偏暗", type: "stasis", weight: 2 }
      ]
    },
    {
      id: "sleep",
      name: "睡眠",
      icon: "眠",
      prompt: "最近一周睡眠状态",
      options: [
        { label: "入睡困难", type: "heat", weight: 1 },
        { label: "多梦易醒", type: "yin", weight: 2 },
        { label: "醒后仍累", type: "qi", weight: 2 },
        { label: "睡眠稳定", type: "balanced", weight: 1 }
      ]
    },
    {
      id: "mood",
      name: "情绪",
      icon: "情",
      prompt: "近期情绪与压力感受",
      options: [
        { label: "容易烦躁", type: "heat", weight: 2 },
        { label: "压力较大", type: "stagnation", weight: 2 },
        { label: "情绪低落", type: "qi", weight: 1 },
        { label: "整体平稳", type: "balanced", weight: 1 }
      ]
    },
    {
      id: "appetite",
      name: "胃口",
      icon: "胃",
      prompt: "饮食与胃口表现",
      options: [
        { label: "胃口偏差", type: "qi", weight: 2 },
        { label: "容易腹胀", type: "damp", weight: 2 },
        { label: "口干口苦", type: "heat", weight: 2 },
        { label: "饮食规律", type: "balanced", weight: 1 }
      ]
    },
    {
      id: "bowel",
      name: "大便",
      icon: "便",
      prompt: "大便情况",
      options: [
        { label: "偏稀不成形", type: "damp", weight: 2 },
        { label: "便秘偏干", type: "heat", weight: 2 },
        { label: "黏滞不爽", type: "damp", weight: 2 },
        { label: "基本正常", type: "balanced", weight: 1 }
      ]
    },
    {
      id: "eyes",
      name: "眼睛",
      icon: "眼",
      prompt: "眼睛相关感受",
      options: [
        { label: "眼干涩", type: "yin", weight: 2 },
        { label: "眼疲劳", type: "qi", weight: 1 },
        { label: "眼红易痒", type: "heat", weight: 2 },
        { label: "无明显不适", type: "balanced", weight: 1 }
      ]
    },
    {
      id: "waist",
      name: "腰腿",
      icon: "腰",
      prompt: "腰腿状态",
      options: [
        { label: "腰酸腰痛", type: "yang", weight: 2 },
        { label: "腿脚乏力", type: "qi", weight: 2 },
        { label: "久坐加重", type: "stasis", weight: 1 },
        { label: "活动正常", type: "balanced", weight: 1 }
      ]
    },
    {
      id: "temperature",
      name: "手脚冷热",
      icon: "温",
      prompt: "手脚冷热倾向",
      options: [
        { label: "手脚偏冷", type: "yang", weight: 2 },
        { label: "手心脚心热", type: "yin", weight: 2 },
        { label: "怕冷怕风", type: "yang", weight: 2 },
        { label: "冷热正常", type: "balanced", weight: 1 }
      ]
    }
  ];

  var typeMeta = {
    qi: {
      name: "气虚倾向",
      color: "#cc735d",
      summary: "精力恢复偏慢，适合从作息、饮食规律和轻运动开始调整。",
      advice: "先保证稳定三餐和睡眠节律，避免连续熬夜，运动宜缓不宜猛。"
    },
    damp: {
      name: "痰湿倾向",
      color: "#51b7ad",
      summary: "脾胃运化压力偏高，容易与困倦、腹胀、黏滞感一起出现。",
      advice: "少冷饮甜腻，晚餐减轻一点，观察舌苔和大便变化。"
    },
    heat: {
      name: "内热倾向",
      color: "#d7894f",
      summary: "近期可能偏燥、偏急或口干，先减少刺激和熬夜。",
      advice: "少辛辣酒精，睡前减少屏幕刺激，保持饮水和清淡饮食。"
    },
    yin: {
      name: "阴虚倾向",
      color: "#79b7d7",
      summary: "容易伴随眼干、多梦、手心脚心热等状态，需要先降消耗。",
      advice: "先减少熬夜和过度用眼，晚间安排更轻的节奏。"
    },
    yang: {
      name: "阳虚倾向",
      color: "#b58a49",
      summary: "偏冷、腰腿酸软或怕风时更明显，要重视保暖和节律。",
      advice: "腰腹脚踝注意保暖，运动从散步、拉伸开始。"
    },
    stagnation: {
      name: "气郁倾向",
      color: "#8c9f68",
      summary: "压力和情绪波动会牵动睡眠、胃口和身体紧绷感。",
      advice: "每天留出固定放松时间，先从呼吸、散步和规律作息入手。"
    },
    stasis: {
      name: "血瘀倾向",
      color: "#8f5f58",
      summary: "久坐、局部酸痛或舌色偏暗时要关注循环状态。",
      advice: "避免长时间固定姿势，每小时起身活动，做温和拉伸。"
    },
    balanced: {
      name: "平和倾向",
      color: "#5f9a72",
      summary: "整体节律相对稳定，重点是继续观察和保持。",
      advice: "维持当前规律，按周复盘睡眠、胃口、情绪和运动。"
    }
  };

  var state = {
    currentIndex: 0,
    selections: {},
    report: null,
    askCount: 0,
    quota: null,
    chatMessages: [],
    flashOption: ""
  };
  var chatBusy = false;

  var paymentState = {
    provider: "wechat",
    loading: false,
    orderNo: "",
    status: "",
    payUrl: "",
    payMethod: "",
    mockMode: false,
    isMember: false,
    membershipLoaded: false,
    memberExpiresAt: "",
    campaign: null,
    providers: [],
    product: null,
    message: "",
    panelDismissed: false
  };
  var paypalCardState = {
    initializing: false,
    initPromise: null,
    ready: false,
    sdkPromise: null,
    cardFields: null
  };

  function getSelectedMemberProduct() {
    return MEMBER_PRODUCTS[HEALTH_PRODUCT_KEY] || MEMBER_PRODUCTS.monthly_member;
  }

  function applySelectedMemberProduct(productKey) {
    var product = MEMBER_PRODUCTS[productKey] || MEMBER_PRODUCTS.monthly_member;
    HEALTH_PRODUCT_KEY = product.productKey;
    HEALTH_PRODUCT_NAME = product.name;
    HEALTH_PRODUCT_AMOUNT = product.amountYuan;
    HEALTH_PAYPAL_AMOUNT = product.paypalAmount;
    MEMBER_ASK_LIMIT = product.dailyChatLimit;
    paymentState.product = {
      productKey: product.productKey,
      name: product.name,
      amountYuan: product.amountYuan,
      currency: "CNY",
      chartLimit: product.chartLimit,
      dailyChatLimit: product.dailyChatLimit,
      periodDays: 31
    };
  }

  function renderMemberPlanSelection() {
    var product = getSelectedMemberProduct();
    $all(".yl-plan-option").forEach(function (button) {
      var active = button.dataset.productKey === product.productKey;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.disabled = paymentState.loading || paymentState.status === "pending" || hasRegisteredFreeCampaignAccess();
    });
    var planName = $("#ylSelectedPlanName");
    var planPrice = $("#ylMemberPrice");
    var planPeriod = $("#ylSelectedPlanPeriod");
    var planCharts = $("#ylSelectedPlanCharts");
    var planReading = $("#ylSelectedPlanReading");
    var planChats = $("#ylSelectedPlanChats");
    if (planName) planName.textContent = IS_ENGLISH_CHECKOUT ? product.nameEn : product.name;
    if (planPrice) planPrice.textContent = IS_ENGLISH_CHECKOUT ? "$" + product.paypalAmount : "¥" + product.amountYuan;
    if (planPeriod) planPeriod.textContent = IS_ENGLISH_CHECKOUT ? "Valid for 31 days" : "有效期31天";
    if (planCharts) planCharts.innerHTML = "<b>1</b> " + (IS_ENGLISH_CHECKOUT ? product.chartTextEn : product.chartText);
    if (planReading) planReading.innerHTML = "<b>2</b> " + (IS_ENGLISH_CHECKOUT
      ? "Full chart and in-depth readings"
      : "完整基础排盘与深度解读");
    if (planChats) planChats.innerHTML = "<b>3</b> " + (IS_ENGLISH_CHECKOUT
      ? product.dailyChatLimit + " follow-up questions per day"
      : "每天可追问" + product.dailyChatLimit + "次");
  }

  async function selectMemberProduct(productKey) {
    if (!MEMBER_PRODUCTS[productKey] || paymentState.loading || paymentState.status === "pending") return;
    if (HEALTH_PRODUCT_KEY === productKey) return;
    applySelectedMemberProduct(productKey);
    paymentState.providers = [];
    paymentState.status = "";
    paymentState.message = "";
    paymentState.orderNo = "";
    paymentState.payUrl = "";
    paymentState.payMethod = "";
    paymentState.panelDismissed = false;
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("productKey", productKey);
      window.history.replaceState({}, document.title, url.toString());
    } catch (_error) {}
    renderMemberPlanSelection();
    renderPayment();
    if (readAuthSession()) await hydratePaymentProduct();
  }

  applySelectedMemberProduct(HEALTH_PRODUCT_KEY);
  var healthAuthState = {
    loading: false,
    panelOpen: false,
    reauth: false,
    memberPrompted: false,
    mode: "login",
    tone: "",
    message: ""
  };
  var authRefreshPromise = null;
  var paymentConfirmationToken = "";
  var memberCheckoutContext = null;
  var accountDialogReturnFocus = null;

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function normalizePage(page) {
    return PAGE_IDS.indexOf(page) >= 0 ? page : "home";
  }

  function pageFromHash() {
    var hashPage = (window.location.hash || "#home").replace(/^#/, "").split("?")[0];
    return normalizePage(hashPage);
  }

  function setActivePage(page, options) {
    var active = normalizePage(page);
    var opts = options || {};
    document.documentElement.classList.toggle("yl-unified-checkout", active === "member");
    document.title = active === "member" ? MEMBER_PAGE_TITLE : HEALTH_PAGE_TITLE;
    $all(".yl-page").forEach(function (element) {
      element.hidden = element.dataset.page !== active;
    });
    var appGrid = $(".yl-app-grid");
    if (appGrid) {
      appGrid.classList.toggle("is-empty", active === "home" || active === "member");
      appGrid.classList.toggle("is-single", active === "assessment" || active === "report" || active === "chat");
    }
    $all(".yl-nav a").forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + active);
    });
    $all(".yl-bottom-nav a").forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + active);
    });
    if (active === "member") {
      renderHealthAuthPanel();
      if (!healthAuthState.memberPrompted && !readAuthSession() && !hasHealthPaymentAuth()) {
        healthAuthState.memberPrompted = true;
        openHealthAuthPanel(IS_ENGLISH_CHECKOUT
          ? "Sign in or create an account. Membership stays with that account."
          : "请先登录或注册，会员权益会绑定到登录账号。");
      }
    }
    if (opts.scroll !== false) {
      window.scrollTo({ top: 0, behavior: opts.instant ? "auto" : "smooth" });
    }
  }

  function goToPage(page, options) {
    var active = normalizePage(page);
    if (window.location.hash !== "#" + active) {
      window.location.hash = active;
      return;
    }
    setActivePage(active, options);
  }

  function readAuthSession() {
    try {
      var session = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || "null");
      return session && session.access_token ? session : null;
    } catch (_error) {
      return null;
    }
  }

  function clearHealthAuthSession() {
    clearPaymentConfirmation();
    try { localStorage.removeItem(AUTH_SESSION_KEY); } catch (_error) {}
  }

  function isHealthAuthSessionExpiring(session) {
    if (!session?.expires_at) return false;
    return Date.now() >= (Number(session.expires_at) * 1000) - AUTH_REFRESH_SKEW_MS;
  }

  function readPaymentHandoff() {
    try {
      var token = sessionStorage.getItem(PAYMENT_HANDOFF_KEY) || "";
      return isValidPaymentConfirmationToken(token) ? token : "";
    } catch (_error) {
      return "";
    }
  }

  function isValidPaymentConfirmationToken(value) {
    var token = String(value || "").trim();
    return /^v2\.[A-Za-z0-9_-]+$/.test(token) && token.length <= 2048;
  }

  function getPaymentConfirmationToken() {
    return isValidPaymentConfirmationToken(paymentConfirmationToken)
      ? paymentConfirmationToken
      : readPaymentHandoff();
  }

  function setPaymentConfirmationToken(value) {
    var token = String(value || "").trim();
    if (!isValidPaymentConfirmationToken(token)) return false;
    paymentConfirmationToken = token;
    return true;
  }

  function clearPaymentConfirmation() {
    paymentConfirmationToken = "";
    try { sessionStorage.removeItem(PAYMENT_HANDOFF_KEY); } catch (_error) {}
  }

  function normalizeMemberReturnPath(value) {
    try {
      var url = new URL(String(value || ""), window.location.origin);
      if (url.origin !== window.location.origin) return "";
      if (!url.pathname.startsWith("/") || url.pathname.startsWith("//")) return "";
      return url.pathname + url.search + url.hash;
    } catch (_error) {
      return "";
    }
  }

  function readMemberCheckoutContext() {
    var query = new URLSearchParams(window.location.search || "");
    var source = String(query.get("source") || "").trim().toLowerCase();
    var returnPath = normalizeMemberReturnPath(query.get("returnUrl"));
    if (/^[a-z0-9_-]{1,32}$/.test(source) && returnPath) {
      var next = { source: source, returnPath: returnPath, ts: Date.now() };
      try { sessionStorage.setItem(MEMBER_RETURN_KEY, JSON.stringify(next)); } catch (_error) {}
      return next;
    }
    try {
      var saved = JSON.parse(sessionStorage.getItem(MEMBER_RETURN_KEY) || "null");
      if (!saved || Date.now() - Number(saved.ts || 0) > MEMBER_RETURN_TTL_MS) return null;
      var savedPath = normalizeMemberReturnPath(saved.returnPath);
      if (!/^[a-z0-9_-]{1,32}$/.test(saved.source || "") || !savedPath) return null;
      return { source: saved.source, returnPath: savedPath, ts: saved.ts };
    } catch (_error) {
      return null;
    }
  }

  function initializeMemberCheckoutContext() {
    memberCheckoutContext = readMemberCheckoutContext();
    var returnLink = $("#ylMemberReturnLink");
    var continueLink = $("#ylPaymentBootContinue");
    if (!memberCheckoutContext) return;
    if (returnLink) {
      returnLink.hidden = false;
      returnLink.href = memberCheckoutContext.returnPath;
      returnLink.textContent = IS_ENGLISH_CHECKOUT ? "Back to the app" : "返回原页面";
    }
    if (continueLink) {
      continueLink.href = memberCheckoutContext.returnPath;
      continueLink.textContent = IS_ENGLISH_CHECKOUT ? "Return to the app" : "返回原页面继续使用";
    }
  }

  function applyEnglishMemberCheckoutCopy() {
    if (!IS_ENGLISH_CHECKOUT) return;
    document.documentElement.lang = "en";
    document.documentElement.classList.add("yl-english-checkout");
    document.title = MEMBER_PAGE_TITLE;
    var setText = function (selector, value) {
      var node = $(selector);
      if (node) node.textContent = value;
    };
    var skipLink = $(".skip-link");
    if (skipLink) {
      skipLink.href = "#member";
      skipLink.textContent = "Skip to membership checkout";
    }
    setText(".yl-brand-checkout", "Yuetian AI");
    setText("#ylPlanPickerTitle", "Choose a Monthly Pass");
    setText(".yl-plan-picker-head span", "Both passes are valid for 31 days");
    $all(".yl-plan-option").forEach(function (button) {
      var product = MEMBER_PRODUCTS[button.dataset.productKey];
      if (!product) return;
      var name = button.querySelector("span");
      var price = button.querySelector("strong");
      var detail = button.querySelector("em");
      if (name) name.textContent = product.nameEn;
      if (price) price.innerHTML = "$" + product.paypalAmount + " <small>/ 31 days</small>";
      if (detail) detail.textContent = product.chartLimit
        ? product.chartLimit + " profiles · Full readings · " + product.dailyChatLimit + " questions/day"
        : "Unlimited profiles · Full readings · " + product.dailyChatLimit + " questions/day";
    });
    setText(".yl-member-benefits > strong", "This Pass Includes");
    renderMemberPlanSelection();
    setText(".yl-assurance-title", "Secure Checkout");
    var assurances = $all(".yl-payment-assurance > span");
    var assuranceCopy = [
      ["Handled by the payment provider", "Your payment password stays with that provider"],
      ["Activated automatically after payment", "Benefits stay with this signed-in account"],
      ["Keep the order number for support", "We can trace payment issues by order number"]
    ];
    assurances.forEach(function (item, index) {
      var copy = assuranceCopy[index];
      if (!copy) return;
      var strong = item.querySelector("strong");
      var small = item.querySelector("small");
      if (strong) strong.textContent = copy[0];
      if (small) small.textContent = copy[1];
    });
    setText(".yl-checkout-account span", "Payment Account");
    setText(".yl-pay-heading strong", "Payment Method");
    setText(".yl-pay-heading span", "Check the amount before paying");
    setText(".yl-operator-points p:nth-child(1) b", "Payment methods");
    setText(".yl-operator-points p:nth-child(1) span", "WeChat Pay, Alipay, PayPal and international cards");
    setText(".yl-operator-points p:nth-child(2) b", "Activation");
    setText(".yl-operator-points p:nth-child(2) span", "Benefits activate automatically after payment confirmation");
    var operatorName = $(".yl-operator-card p:nth-child(1)");
    if (operatorName) {
      operatorName.replaceChildren(
        Object.assign(document.createElement("span"), { textContent: "Business operator: " }),
        document.createTextNode("雷州市客路镇阅天工作室 (Individual business)")
      );
    }
    var operatorSupport = $(".yl-operator-card p:nth-child(2)");
    if (operatorSupport) {
      operatorSupport.replaceChildren(
        Object.assign(document.createElement("span"), { textContent: "Account and payment support: " }),
        document.createTextNode("Yuetian AI")
      );
    }
    setText(".yl-operator-contact", "Payment issue? Contact support");
    var memberBenefits = $(".yl-member-benefits");
    if (memberBenefits) memberBenefits.setAttribute("aria-label", "Membership benefits");
    var paymentAssurance = $(".yl-payment-assurance");
    if (paymentAssurance) paymentAssurance.setAttribute("aria-label", "Payment security");
    var paymentMethods = $(".yl-pay-row");
    if (paymentMethods) paymentMethods.setAttribute("aria-label", "Payment methods");
    var methodButtons = $all(".yl-pay-method");
    methodButtons.forEach(function (button) {
      var provider = button.dataset.provider || "wechat";
      button.textContent = provider === "alipay" && !ALIPAY_CHECKOUT_ENABLED
        ? "Alipay (Under Review)"
        : getProviderLabel(provider);
    });
    setText("#ylCardCheckoutTitle", "Pay directly by card");
    setText("#ylCardCheckoutSubtitle", "Visa or Mastercard · No PayPal account required");
    setText("#ylCardNameLabel", "Name on card");
    setText("#ylCardNumberLabel", "Card number");
    setText("#ylCardExpiryLabel", "Expiry date");
    setText("#ylCardCvvLabel", "Security code (CVV)");
    setText("#ylCardCountryLabel", "Billing country / region");
    setText("#ylCardAddressLabel", "Billing address");
    setText("#ylCardCityLabel", "City");
    setText("#ylCardRegionLabel", "State / Province");
    setText("#ylCardPostalLabel", "Postal / ZIP code");
    setText("#ylCardSecurity", "Card details are encrypted and handled by PayPal. Yuetian AI cannot read or store them. Use the billing address registered with the card issuer.");
    var cardCountry = $("#ylCardCountry");
    if (cardCountry?.options?.[0]) cardCountry.options[0].textContent = "Select the real billing country / region";
    var cardAddress = $("#ylCardAddressLine1");
    if (cardAddress) cardAddress.placeholder = "Street address";
    var cardPrivacy = $(".yl-card-privacy");
    var cardPrivacyLink = cardPrivacy?.querySelector("a");
    if (cardPrivacy && cardPrivacyLink) {
      cardPrivacyLink.textContent = "Privacy Statement";
      cardPrivacy.replaceChildren(
        document.createTextNode("By paying, you agree that PayPal may process payment information under its "),
        cardPrivacyLink,
        document.createTextNode(".")
      );
    }
    setText("#ylOpenPayBtn", "Confirm account to continue");
    var mobileAssurances = $all(".yl-mobile-assurance span");
    if (mobileAssurances[0]) mobileAssurances[0].textContent = "Automatic activation after payment";
    if (mobileAssurances[1]) mobileAssurances[1].textContent = "Keep the order number for support";
    var mobileAssurance = $(".yl-mobile-assurance");
    if (mobileAssurance) mobileAssurance.setAttribute("aria-label", "Payment protection");
    var returnLink = $("#ylMemberReturnLink");
    if (returnLink) returnLink.textContent = "Back to the app";
    var brandLink = $(".yl-brand");
    if (brandLink) brandLink.setAttribute("aria-label", "Back to Yuetian AI home");
    var paymentPanel = $("#ylPaymentPanel");
    if (paymentPanel) paymentPanel.setAttribute("aria-label", "Payment window");
    var paymentClose = $("#ylPaymentCloseBtn");
    if (paymentClose) paymentClose.setAttribute("aria-label", "Close payment window");
    var paymentQr = $("#ylPaymentQr");
    if (paymentQr) paymentQr.setAttribute("aria-label", "Payment QR code");
    var closeButton = $("#ylAccountCloseBtn");
    if (closeButton) closeButton.setAttribute("aria-label", "Close account window");
    setText(".yl-account-dialog-head > span", "Yuetian Account");
    setText(".yl-account-dialog-head > p", "Use the same account on desktop, mobile, and WeChat.");
    setText("#ylHealthLoginModeBtn", "Sign In");
    setText("#ylHealthRegisterModeBtn", "Create Account");
    var authModeGroup = $(".yl-health-auth-mode");
    if (authModeGroup) authModeGroup.setAttribute("aria-label", "Choose sign in or create account");
    var passwordLabels = $all(".yl-health-auth label .yl-health-field-label");
    if (passwordLabels[1]) passwordLabels[1].textContent = "Password";
    if (passwordLabels[2]) passwordLabels[2].textContent = "Confirm Password";
    var passwordInput = $("#ylHealthAuthPassword");
    if (passwordInput) {
      passwordInput.placeholder = "Password";
      passwordInput.setAttribute("aria-label", "Password");
    }
    var confirmInput = $("#ylHealthAuthConfirmPassword");
    if (confirmInput) {
      confirmInput.placeholder = "Enter password again";
      confirmInput.setAttribute("aria-label", "Confirm password");
    }
    setText(".yl-health-account-main > span", "Signed-in Account");
    setText(".yl-health-account-main > small", "Shared across desktop and mobile");
    setText("#ylHealthSwitchAccountBtn", "Switch Account");
    setText("#ylHealthLogoutBtn", "Sign Out");
  }

  function decoratePaymentHandoffUrl(value) {
    try {
      var url = new URL(String(value || ""), window.location.origin);
      if (memberCheckoutContext?.source && memberCheckoutContext?.returnPath) {
        url.searchParams.set("source", memberCheckoutContext.source);
        url.searchParams.set("returnUrl", memberCheckoutContext.returnPath);
      }
      url.searchParams.set("productKey", HEALTH_PRODUCT_KEY);
      return url.toString();
    } catch (_error) {
      return String(value || "");
    }
  }

  function capturePaymentHandoff() {
    try {
      var match = (window.location.hash || "").match(/^#member\?pay_handoff=(v2\.[A-Za-z0-9_-]+)$/);
      var token = match?.[1] || "";
      if (!isValidPaymentConfirmationToken(token)) return false;
      sessionStorage.setItem(PAYMENT_HANDOFF_KEY, token);
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search + "#member");
      return true;
    } catch (_error) {
      return false;
    }
  }

  function hasHealthPaymentAuth() {
    return !!getPaymentConfirmationToken();
  }

  function buildPaymentHandoffUrl(token) {
    return decoratePaymentHandoffUrl("https://yuetianai.com/yl.html#member?pay_handoff=" + encodeURIComponent(token || ""));
  }

  function saveHealthAuthSession(session) {
    try {
      if (session?.access_token && session?.refresh_token) {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        return true;
      }
    } catch (_error) {}
    return false;
  }

  async function getHealthAuthSession(options) {
    var opts = options || {};
    var current = readAuthSession();
    if (current && !opts.force && !isHealthAuthSessionExpiring(current)) return current;
    if (!current?.refresh_token) return current;
    if (authRefreshPromise) return authRefreshPromise;

    authRefreshPromise = apiFetch("/api/auth/refresh", {
      method: "POST",
      noAuth: true,
      body: { refreshToken: current.refresh_token }
    }).then(function (data) {
      if (!saveHealthAuthSession(data?.session)) throw new Error("登录状态续期失败");
      return readAuthSession();
    }).catch(function () {
      clearHealthAuthSession();
      return null;
    }).finally(function () {
      authRefreshPromise = null;
    });

    return authRefreshPromise;
  }

  function normalizeHealthAuthError(message) {
    var text = String(message || "").trim();
    if (!text) return "登录失败，请稍后再试";
    if (/invalid login credentials|invalid credentials|wrong password|密码错误|密码有误/i.test(text)) {
      return "密码有误，请重新输入";
    }
    return text;
  }

  function isHealthLoginRequiredError(error) {
    return error?.status === 401
      || /请先登录|登录已失效|invalid jwt|jwt expired/i.test(String(error?.message || ""));
  }

  function getHealthApiBase() {
    try {
      var params = new URLSearchParams(window.location.search || "");
      var queryBase = params.get("apiBase");
      var candidate = queryBase || DEFAULT_API_BASE;
      return typeof window.resolveYuetianApiBase === "function"
        ? window.resolveYuetianApiBase(candidate)
        : DEFAULT_API_BASE;
    } catch (_error) {}
    return DEFAULT_API_BASE;
  }

  function getHealthClientId() {
    try {
      var saved = localStorage.getItem(CLIENT_ID_KEY);
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved || "")) return saved;
      var next = window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (char) {
          var value = Math.floor(Math.random() * 16);
          return (char === "x" ? value : ((value & 3) | 8)).toString(16);
        });
      localStorage.setItem(CLIENT_ID_KEY, next);
      return next;
    } catch (_error) {
      return "yl-browser";
    }
  }

  async function apiFetch(path, options) {
    var opts = options || {};
    var headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    headers["X-Wentian-Client-Id"] = getHealthClientId();
    var authSession = opts.noAuth ? null : await getHealthAuthSession();
    var token = authSession?.access_token || "";
    if (token) headers.Authorization = "Bearer " + token;
    var paymentHandoff = opts.noAuth ? "" : getPaymentConfirmationToken();
    if (paymentHandoff) headers["X-Wentian-Payment-Handoff"] = paymentHandoff;
    var url = /^https?:\/\//i.test(path) ? path : getHealthApiBase() + path;
    var response = await fetch(url, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      credentials: "include"
    });
    var text = await response.text();
    var data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (_error) {
      data = { error: text || "服务暂时不可用" };
    }
    if (response.status === 401 && paymentHandoff) {
      clearPaymentConfirmation();
    }
    if (response.status === 401 && !paymentHandoff && !opts.noAuth && !opts.authRetried && readAuthSession()?.refresh_token) {
      var refreshedSession = await getHealthAuthSession({ force: true });
      if (refreshedSession?.access_token) {
        return apiFetch(path, Object.assign({}, opts, { authRetried: true }));
      }
    }
    if (response.status === 401 && !paymentHandoff && !opts.noAuth && token) clearHealthAuthSession();
    if (!response.ok || data.error) {
      var requestError = new Error(data.error || "服务暂时不可用");
      if (data.code) requestError.code = data.code;
      requestError.status = response.status;
      throw requestError;
    }
    return data;
  }

  function isWechatBrowser() {
    var ua = navigator.userAgent || "";
    var hasWechatBridge = !!(
      window.WeixinJSBridge
      && typeof window.WeixinJSBridge.invoke === "function"
    );
    return /MicroMessenger|WeChat|Weixin|wxwork/i.test(ua) || hasWechatBridge;
  }

  function isMobileBrowser() {
    if (navigator.userAgentData && typeof navigator.userAgentData.mobile === "boolean") {
      return navigator.userAgentData.mobile;
    }
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
  }

  function getProviderLabel(provider) {
    if (provider === "paypal_card") return IS_ENGLISH_CHECKOUT ? "Credit / Debit Card" : "国际银行卡";
    if (provider === "paypal") return "PayPal";
    if (provider === "alipay") return IS_ENGLISH_CHECKOUT ? "Alipay" : "支付宝";
    return IS_ENGLISH_CHECKOUT ? "WeChat Pay" : "微信支付";
  }

  function isPayPalProvider(provider) {
    return provider === "paypal" || provider === "paypal_card";
  }

  function getBackendProvider(provider) {
    return provider === "paypal_card" ? "paypal" : provider;
  }

  function getProviderMeta(provider) {
    var backendProvider = getBackendProvider(provider);
    var fallback = {
      provider: backendProvider,
      label: getProviderLabel(provider),
      enabled: true,
      amountYuan: isPayPalProvider(provider) ? HEALTH_PAYPAL_AMOUNT : HEALTH_PRODUCT_AMOUNT,
      currency: isPayPalProvider(provider) ? "USD" : "CNY"
    };
    var list = Array.isArray(paymentState.providers) ? paymentState.providers : [];
    if (!list.length) return fallback;
    return list.find(function (item) {
      return item.provider === backendProvider;
    }) || fallback;
  }

  function getProviderMethodDetail(provider) {
    var meta = getProviderMeta(provider);
    if (!meta.enabled) return IS_ENGLISH_CHECKOUT ? "Unavailable" : "暂不可用";
    if (provider === "paypal_card") return "$" + (meta.amountYuan || HEALTH_PAYPAL_AMOUNT) + " · Visa / Mastercard";
    if (provider === "paypal") return "$" + (meta.amountYuan || HEALTH_PAYPAL_AMOUNT) + (IS_ENGLISH_CHECKOUT ? " · cross-border" : " · 跨境付款");
    if (provider === "alipay") return IS_ENGLISH_CHECKOUT
      ? (isMobileBrowser() ? "Open in Alipay" : "Scan the QR code")
      : (isMobileBrowser() ? "支付宝内支付" : "二维码支付");
    if (IS_ENGLISH_CHECKOUT) return isWechatBrowser() ? "Pay in WeChat" : (isMobileBrowser() ? "Open in WeChat" : "Scan the QR code");
    return isWechatBrowser() ? "微信内支付" : (isMobileBrowser() ? "微信内支付" : "扫码支付");
  }

  function getProviderSelectionHint(provider) {
    if (provider === "paypal_card") return IS_ENGLISH_CHECKOUT
      ? "Pay directly by Visa or Mastercard. No PayPal account or phone number is required."
      : "Visa、Mastercard 可直接支付，无需 PayPal 账号或美国手机号。";
    if (provider === "paypal") return IS_ENGLISH_CHECKOUT
      ? "Continue to PayPal and pay in USD. PayPal checks the buyer and merchant countries; a mainland-China buyer paying a mainland-China merchant may be declined."
      : "将前往 PayPal，以美元完成支付。PayPal 会核验买家和商户注册地；中国大陆买家向中国大陆商户付款可能会被合规拒绝。遇到拒绝请返回选择微信/支付宝，或使用符合条件的境外 PayPal 账户。";
    if (provider === "alipay") {
      if (IS_ENGLISH_CHECKOUT) return isMobileBrowser()
        ? "Alipay will open automatically."
        : "Scan the Alipay QR code with your phone.";
      return isMobileBrowser()
        ? "将自动打开支付宝完成付款，无需截图或扫码。"
        : "将显示支付宝二维码，请使用手机支付宝扫码。";
    }
    if (IS_ENGLISH_CHECKOUT) return isWechatBrowser()
      ? "Complete payment in WeChat."
      : (isMobileBrowser() ? "Open this page in WeChat to pay." : "Scan the QR code with WeChat.");
    if (isWechatBrowser()) return "将在当前微信页面内完成支付。";
    return isMobileBrowser()
      ? "微信支付需在微信内完成。"
      : "电脑端将显示二维码，请使用手机微信扫码。";
  }

  function isAlipayPermissionIssue(error) {
    var message = String(error?.message || "");
    return error?.code === "ALIPAY_PERMISSION_REQUIRED"
      || /接口调用权限不足|insufficient-isv-permissions|open\.alipay\.com\/api\/(?:errCheck|lowCheck)/i.test(message);
  }

  function shouldUseWechatJsapi() {
    var meta = getProviderMeta(paymentState.provider);
    return paymentState.provider === "wechat" && !meta.mockMode && isWechatBrowser();
  }

  function getCheckoutPayMethod() {
    if (paymentState.provider === "paypal_card") return "card";
    if (paymentState.provider === "paypal") return "redirect";
    if (shouldUseWechatJsapi()) return "jsapi";
    if (paymentState.provider === "alipay" && isMobileBrowser()) return "h5";
    return "native";
  }

  function isRedirectPayment() {
    return paymentState.payMethod === "h5"
      || paymentState.payMethod === "redirect"
      || paymentState.provider === "paypal";
  }

  function invokeWechatJsapi(params) {
    if (!params || typeof params !== "object") return Promise.reject(new Error("微信支付参数无效，请重新发起支付"));
    return new Promise(function (resolve, reject) {
      var finished = false;
      var timeout = 0;
      function finish(callback, value) {
        if (finished) return;
        finished = true;
        if (timeout) window.clearTimeout(timeout);
        callback(value);
      }
      function invoke() {
        if (!window.WeixinJSBridge || typeof window.WeixinJSBridge.invoke !== "function") {
          finish(reject, new Error("请在微信内打开页面后支付"));
          return;
        }
        window.WeixinJSBridge.invoke("getBrandWCPayRequest", params, function (result) {
          var message = String(result?.err_msg || result?.errMsg || "").toLowerCase();
          if (/:ok$/.test(message)) return finish(resolve, "success");
          if (/:cancel$/.test(message)) return finish(resolve, "cancel");
          return finish(resolve, "failed");
        });
      }
      if (window.WeixinJSBridge && typeof window.WeixinJSBridge.invoke === "function") {
        invoke();
        return;
      }
      document.addEventListener("WeixinJSBridgeReady", invoke, { once: true });
      timeout = window.setTimeout(function () {
        finish(reject, new Error("微信支付组件未就绪，请在微信内重新打开页面"));
      }, 6000);
    });
  }

  async function handleWechatOauthReturn() {
    var query = new URLSearchParams(window.location.search || "");
    var code = query.get("code");
    var stateToken = query.get("state");
    if (!code && !stateToken) return;

    paymentState.loading = true;
    paymentState.status = "loading";
    paymentState.message = "正在确认微信授权...";
    renderPayment();
    try {
      await apiFetch("/api/payments/wechat/oauth/exchange", {
        method: "POST",
        body: { code: code, state: stateToken }
      });
      var cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("code");
      cleanUrl.searchParams.delete("state");
      cleanUrl.hash = "#member";
      window.history.replaceState({}, document.title, cleanUrl.toString());
      paymentState.loading = false;
      paymentState.status = "";
      paymentState.message = "微信授权完成，正在打开支付...";
      setActivePage("member", { instant: true });
      await startHealthPayment();
    } catch (error) {
      paymentState.loading = false;
      paymentState.status = "error";
      paymentState.message = error.message || "微信授权未完成，请重新发起支付";
      releasePaymentBoot();
      renderPayment();
    }
  }

  function handlePayPalReturn() {
    var query = new URLSearchParams(window.location.search || "");
    var result = String(query.get("paypal_result") || "").trim().toLowerCase();
    if (!result) return false;

    var orderNo = String(query.get("orderNo") || "").trim();
    paymentState.provider = "paypal";
    paymentState.orderNo = orderNo;
    paymentState.payUrl = "";
    paymentState.payMethod = "redirect";
    paymentState.panelDismissed = false;
    if (result === "paid" || result === "already_paid") {
      paymentState.status = "pending";
      paymentState.message = "PayPal 已返回，正在确认付款状态，请稍候刷新。";
      setPayHint("如果 PayPal 已扣款但状态未更新，请保留订单号并稍后刷新，不要重复付款。");
    } else if (result === "cancelled" || result === "cancel") {
      paymentState.status = "error";
      paymentState.message = "已取消 PayPal 付款，可返回后改用其他支付方式。";
      setPayHint(getProviderSelectionHint("paypal"));
    } else {
      paymentState.status = "error";
      paymentState.message = "PayPal 未完成这笔付款。若页面提示合规拒绝，请确认买家与商户注册地符合 PayPal 的跨境收款规则。";
      setPayHint(getProviderSelectionHint("paypal"));
    }

    var cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("paypal_result");
    cleanUrl.searchParams.delete("orderNo");
    cleanUrl.hash = "#member";
    window.history.replaceState({}, document.title, cleanUrl.toString());
    setActivePage("member", { instant: true });
    renderPayment();
    return true;
  }

  function getPaymentAmountLabel() {
    var product = paymentState.product || {};
    var providerMeta = getProviderMeta(paymentState.provider);
    var amount = providerMeta.amountYuan || product.amountYuan || HEALTH_PRODUCT_AMOUNT;
    var currency = providerMeta.currency || product.currency;
    if (isPayPalProvider(paymentState.provider) || currency === "USD") return "$" + amount;
    return "¥" + amount;
  }

  function setPayHint(text) {
    var el = $("#ylPayHint");
    if (el) el.textContent = text || "";
  }

  function updatePaymentBoot(title, message, success) {
    if (!document.documentElement.classList.contains("yl-payment-boot")) return;
    var screen = $("#ylPaymentBootScreen");
    var titleElement = $("#ylPaymentBootTitle");
    var messageElement = $("#ylPaymentBootMessage");
    var continueLink = $("#ylPaymentBootContinue");
    if (screen) screen.classList.toggle("is-success", !!success);
    if (titleElement) titleElement.textContent = title || "正在打开微信支付";
    if (messageElement) messageElement.textContent = message || "请稍候，无需重复点击。";
    if (continueLink) continueLink.hidden = !success;
  }

  function releasePaymentBoot() {
    document.documentElement.classList.remove("yl-payment-boot");
  }

  function isHealthMember() {
    return paymentState.isMember || paymentState.status === "paid";
  }

  function isRegisteredFreeCampaign() {
    return !!paymentState.campaign?.active;
  }

  function hasRegisteredFreeCampaignAccess() {
    return isRegisteredFreeCampaign() && !!readAuthSession() && !!state.quota?.campaignActive;
  }

  function renderRegisteredFreeCampaign() {
    var campaign = paymentState.campaign || {};
    var active = !!campaign.active;
    var hasAccess = hasRegisteredFreeCampaignAccess();
    var memberCard = $(".yl-member-card");
    if (memberCard) memberCard.classList.toggle("is-campaign", active);
    var pickerTitle = $("#ylPlanPickerTitle");
    var pickerNote = $(".yl-plan-picker-head > span");
    var accountTitle = $("#ylCheckoutAccountSummary > div > span");
    if (pickerTitle) pickerTitle.textContent = active
      ? (IS_ENGLISH_CHECKOUT ? "Regular plans" : "原套餐价格")
      : (IS_ENGLISH_CHECKOUT ? "Choose a Monthly Pass" : "选择月卡");
    if (pickerNote) pickerNote.textContent = active
      ? (IS_ENGLISH_CHECKOUT ? "Unlimited access during the campaign" : "活动期间统一享受不限人数权益")
      : (IS_ENGLISH_CHECKOUT ? "Both passes are valid for 31 days" : "两种月卡均按31天计算");
    if (accountTitle) accountTitle.textContent = active
      ? (IS_ENGLISH_CHECKOUT ? "Your account" : "体验账号")
      : (IS_ENGLISH_CHECKOUT ? "Payment account" : "付款账号");
    if (active) {
      $("#ylSelectedPlanName").textContent = IS_ENGLISH_CHECKOUT ? "Free campaign access" : "活动期间免费权益";
      $("#ylSelectedPlanCharts").innerHTML = "<b>1</b> " + (IS_ENGLISH_CHECKOUT ? "Unlimited profiles" : "不限命主人数");
      $("#ylSelectedPlanChats").innerHTML = "<b>3</b> " + (IS_ENGLISH_CHECKOUT ? "100 follow-up questions per day" : "每天可追问100次");
    }

    var banner = $("#ylCampaignBanner");
    if (banner) banner.hidden = !active;
    var monthLabel = campaign.monthLabel || "本月";
    var eyebrow = $("#ylCampaignEyebrow");
    var title = $("#ylCampaignTitle");
    var description = $("#ylCampaignDescription");
    if (eyebrow) eyebrow.textContent = IS_ENGLISH_CHECKOUT ? "Limited-time campaign" : monthLabel + "大促";
    if (title) title.textContent = IS_ENGLISH_CHECKOUT ? "Create an account and use it free for a limited time" : "注册账号，限时免费使用";
    if (description) description.textContent = IS_ENGLISH_CHECKOUT
      ? "Sign in to use full charts, in-depth readings and up to 100 follow-up questions per day during the campaign."
      : "注册并登录后，可免费使用不限命主人数的完整排盘、深度解读与每天100次追问。";

    var paidArea = $("#ylPaidCheckoutArea");
    if (paidArea) paidArea.hidden = active;
    var humanConsult = $("#ylHumanConsult");
    if (humanConsult) humanConsult.hidden = !active;
    var humanEyebrow = $("#ylHumanConsultEyebrow");
    var humanPromo = $("#ylHumanConsultPromo");
    if (humanEyebrow) humanEyebrow.textContent = IS_ENGLISH_CHECKOUT
      ? "Human service · Free during the campaign"
      : "人工通道 · " + monthLabel + "限时免费咨询";
    if (humanPromo) humanPromo.textContent = IS_ENGLISH_CHECKOUT
      ? "Registered users can request one free human consultation during this campaign."
      : (campaign.year || new Date().getFullYear()) + "年" + monthLabel + "是网站宣传月，注册用户可申请免费人工命理咨询。";
    if (active && humanConsult && new URLSearchParams(location.search).get("service") === "human" && humanConsult.dataset.autoScrolled !== "1") {
      humanConsult.dataset.autoScrolled = "1";
      window.setTimeout(function () {
        humanConsult.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
    var campaignButton = $("#ylCampaignAccessBtn");
    if (campaignButton) {
      campaignButton.hidden = !active;
      campaignButton.classList.toggle("is-active", hasAccess);
      campaignButton.textContent = hasAccess
        ? (IS_ENGLISH_CHECKOUT ? "Free access active · Start using" : "限时免费权益已生效 · 开始使用")
        : (IS_ENGLISH_CHECKOUT ? "Sign in or register for free access" : "注册 / 登录后免费使用");
    }
  }

  function getMemberExpiresAt() {
    var quota = state.quota || {};
    return paymentState.memberExpiresAt
      || quota.memberExpiresAt
      || quota.member_expires_at
      || quota.expiresAt
      || quota.expires_at
      || "";
  }

  function formatMemberExpiryDate(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    try {
      return new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(date).replace(/\//g, "-");
    } catch (_error) {
      return date.toISOString().slice(0, 10);
    }
  }

  function getMemberRemainingDays(value) {
    var expiresAt = new Date(value || "").getTime();
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return 0;
    return Math.max(1, Math.ceil((expiresAt - Date.now()) / 86400000));
  }

  function getMemberRenewalHint(prefix) {
    var dateText = formatMemberExpiryDate(getMemberExpiresAt());
    return dateText
      ? (prefix || "月卡有效") + "，当前有效期至 " + dateText + "；再次购买自动顺延31天。"
      : (prefix || "月卡有效") + "；再次购买自动顺延31天。";
  }

  function renderMembershipState() {
    var wrap = $("#ylMembershipState");
    if (!wrap) return;
    var quota = state.quota || {};
    var loaded = paymentState.membershipLoaded || paymentState.isMember || !!quota.plan;
    var isMember = isHealthMember() || quota.isMember;
    var campaignActive = !!quota.campaignActive;
    var expiresAt = getMemberExpiresAt();
    var dateText = formatMemberExpiryDate(expiresAt);
    var days = getMemberRemainingDays(expiresAt);
    var plan = $("#ylMemberPlan");
    var expiry = $("#ylMemberExpiry");
    var remaining = $("#ylMemberRemaining");
    var selectedProduct = getSelectedMemberProduct();
    var fallbackLimit = isMember ? selectedProduct.dailyChatLimit : FREE_ASK_LIMIT;
    var quotaMode = quota.quotaMode || (isMember ? "daily" : "lifetime");
    var limit = Number((quotaMode === "daily" ? quota.dailyLimit : quota.lifetimeLimit) || quota.limit || fallbackLimit);
    if (!Number.isFinite(limit) || limit <= 0) limit = fallbackLimit;
    var quotaRemaining = quotaMode === "daily"
      ? (quota.dailyRemaining ?? quota.remaining)
      : (quota.lifetimeRemaining ?? quota.remaining);
    var quotaText = quotaMode === "daily" ? "每天 " + limit + " 次追问" : "共 " + limit + " 次追问";
    if (typeof quotaRemaining === "number") {
      quotaText += (quotaMode === "daily" ? " · 今日剩余 " : " · 剩余 ") + Math.max(0, quotaRemaining) + " 次";
    }
    var chartLimit = quota.chartLimit == null && isMember
      ? null
      : Number(quota.chartLimit || (isMember ? selectedProduct.chartLimit : 1));
    var chartUsed = Math.max(0, Number(quota.chartUsage?.used || 0));
    var chartText = chartLimit == null
      ? "不限命主人数 · 已使用 " + chartUsed + " 位"
      : "命主人数 " + chartUsed + "/" + chartLimit + " 位";

    wrap.hidden = false;
    wrap.dataset.plan = loaded ? (campaignActive ? "campaign" : (isMember ? "member" : "free")) : "loading";
    if (!loaded) {
      if (plan) plan.textContent = "会员状态";
      if (expiry) expiry.textContent = "正在读取会员状态";
      if (remaining) remaining.textContent = "请稍候";
      return;
    }

    if (campaignActive) {
      if (plan) plan.textContent = quota.planName || "限时免费体验";
      if (expiry) expiry.textContent = "注册账号已获得本月免费权益";
      if (remaining) remaining.textContent = quotaText + " · " + chartText;
      return;
    }

    if (plan) plan.textContent = isMember ? (quota.planName || "月卡用户") : "免费用户";
    if (expiry) {
      expiry.textContent = isMember
        ? (dateText ? "有效期至 " + dateText : "会员权益已生效")
        : "已登录，尚未开通月卡";
    }
    if (remaining) {
      if (isMember) {
        remaining.textContent = (days ? "剩余 " + days + " 天 · " : "")
          + quotaText + " · " + chartText + " · 续费顺延31天";
      } else {
        remaining.textContent = quotaText + " · 可使用1位命主";
      }
    }
  }

  function updateAskQuota() {
    var quota = state.quota || {};
    var hasSession = !!readAuthSession();
    var isMember = isHealthMember() || quota.isMember;
    var isGuest = quota.plan === "guest" || (!hasSession && !quota.plan && !quota.lifetimeLimit && !quota.limit);
    var quotaMode = quota.quotaMode || (isMember ? "daily" : "lifetime");
    var fallbackLimit = isMember ? getSelectedMemberProduct().dailyChatLimit : (isGuest ? GUEST_ASK_LIMIT : FREE_ASK_LIMIT);
    var limit = Number((quotaMode === "daily" ? quota.dailyLimit : quota.lifetimeLimit) || quota.limit || fallbackLimit);
    var remaining = quotaMode === "daily"
      ? (quota.dailyRemaining ?? quota.remaining)
      : (quota.lifetimeRemaining ?? quota.remaining);
    var label = isMember
      ? (quota.planName || "月卡") + " " + limit + "次/天"
      : (isGuest ? "体验 " + limit + "次" : "免费 " + limit + "次");
    if (typeof remaining === "number") label += " · 剩余" + Math.max(0, remaining);
    if (!isMember && typeof remaining === "number" && remaining <= 0) label = "选择月卡继续使用";

    ["#ylAskQuota", "#ylAskQuotaPreview"].forEach(function (selector) {
      var el = $(selector);
      if (el) el.textContent = label;
    });
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      state.currentIndex = saved.currentIndex || 0;
      state.selections = saved.selections || {};
      state.report = saved.report || null;
      state.askCount = saved.askCount || 0;
      state.quota = saved.quota || null;
      state.chatMessages = Array.isArray(saved.chatMessages) ? saved.chatMessages.slice(-20) : [];
      state.flashOption = "";
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function normalizeSelections() {
    var normalized = {};
    categories.forEach(function (category) {
      var value = state.selections[category.id];
      if (!value) return;
      normalized[category.id] = Array.isArray(value) ? value : [value];
      normalized[category.id] = normalized[category.id].filter(Boolean);
    });
    state.selections = normalized;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function selectedCount() {
    return Object.keys(state.selections).filter(function (key) {
      return Array.isArray(state.selections[key]) && state.selections[key].length > 0;
    }).length;
  }

  function selectedItems(categoryId) {
    return Array.isArray(state.selections[categoryId]) ? state.selections[categoryId] : [];
  }

  function selectedLabel(categoryId) {
    var items = selectedItems(categoryId);
    if (!items.length) return "";
    return items.map(function (item) { return item.label; }).join("、");
  }

  function cleanChatText(value) {
    return String(value || "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/^\s*[-*]\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function renderProgress() {
    var count = selectedCount();
    var percent = Math.round((count / categories.length) * 100);
    $("#ylProgressText").textContent = count + "/" + categories.length;
    $("#ylProgressBar").style.width = percent + "%";
    $("#ylProgressCardText").textContent = "已选 " + count + "/" + categories.length;
    $("#ylGenerateBtn").disabled = count < categories.length;
    $("#ylGenerateBtn").textContent = count < categories.length ? "选满 8 类生成报告" : "生成体质报告";
    var nextButton = $("#ylNextBtn");
    if (nextButton) {
      nextButton.disabled = state.currentIndex >= categories.length - 1;
      nextButton.textContent = state.currentIndex >= categories.length - 1 ? "最后一项" : "下一项";
    }
    var miniQuota = $("#ylMiniQuota");
    if (miniQuota) {
      var quota = state.quota || {};
      var hasSession = !!readAuthSession();
      var isMember = isHealthMember() || quota.isMember;
      var isGuest = quota.plan === "guest" || (!hasSession && !quota.plan && !quota.lifetimeLimit && !quota.limit);
      var quotaMode = quota.quotaMode || (isMember ? "daily" : "lifetime");
      var fallbackLimit = isMember ? MEMBER_ASK_LIMIT : (isGuest ? GUEST_ASK_LIMIT : FREE_ASK_LIMIT);
      var limit = Number((quotaMode === "daily" ? quota.dailyLimit : quota.lifetimeLimit) || quota.limit || fallbackLimit);
      var remaining = quotaMode === "daily"
        ? (quota.dailyRemaining ?? quota.remaining)
        : (quota.lifetimeRemaining ?? quota.remaining);
      miniQuota.textContent = typeof remaining === "number"
        ? "追问次数：" + Math.max(0, remaining) + "/" + limit + "次"
        : "追问次数：" + limit + (quotaMode === "daily" ? "次/天" : "次");
    }
  }

  function renderCategories() {
    var wrap = $("#ylCategoryGrid");
    var switcher = $("#ylCategorySwitcher");
    wrap.innerHTML = "";
    switcher.innerHTML = "";
    categories.forEach(function (category, index) {
      var items = selectedItems(category.id);
      var selected = items.length > 0;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "yl-category-card" + (state.currentIndex === index ? " is-active" : "") + (selected ? " is-filled" : "");
      button.innerHTML =
        "<strong>" + category.name + "</strong>" +
        "<small>" + (selected ? "已选 " + items.length : "待填") + "</small>";
      button.addEventListener("click", function () {
        state.currentIndex = index;
        saveState();
        renderAll();
      });
      wrap.appendChild(button);

      var switchButton = document.createElement("button");
      switchButton.type = "button";
      switchButton.className = "yl-switch-btn" + (state.currentIndex === index ? " is-active" : "") + (selected ? " is-filled" : "");
      switchButton.textContent = category.name;
      switchButton.addEventListener("click", function () {
        state.currentIndex = index;
        saveState();
        renderAll();
      });
      switcher.appendChild(switchButton);
    });
  }

  function renderQuestion() {
    var category = categories[state.currentIndex];
    var selected = selectedItems(category.id);
    $("#ylQuestionIndex").textContent = String(state.currentIndex + 1).padStart(2, "0");
    $("#ylQuestionTitle").textContent = category.name;
    $("#ylQuestionHint").textContent = category.prompt;

    var wrap = $("#ylOptionGrid");
    wrap.innerHTML = "";
    category.options.forEach(function (option) {
      var button = document.createElement("button");
      button.type = "button";
      var isSelected = selected.some(function (item) {
        return item.label === option.label;
      });
      var flashKey = category.id + "::" + option.label;
      var isFlash = state.flashOption === flashKey;
      button.className = "yl-option-chip" + (isSelected ? " is-selected" : "") + (isFlash ? " is-flash" : "");
      button.setAttribute("aria-pressed", isSelected ? "true" : "false");
      button.textContent = option.label;
      if (isFlash) {
        window.setTimeout(function () {
          button.classList.remove("is-flash");
          if (state.flashOption === flashKey) {
            state.flashOption = "";
            saveState();
          }
        }, 260);
      }
      button.addEventListener("click", function () {
        toggleOption(category.id, option);
        state.flashOption = flashKey;
        state.report = calculateReport();
        saveState();
        renderAll();
      });
      wrap.appendChild(button);
    });
  }

  function toggleOption(categoryId, option) {
    var items = selectedItems(categoryId).slice();
    var exists = items.some(function (item) {
      return item.label === option.label;
    });
    state.selections[categoryId] = exists
      ? items.filter(function (item) { return item.label !== option.label; })
      : items.concat([option]);
    if (!state.selections[categoryId].length) delete state.selections[categoryId];
  }

  function calculateReport() {
    var scores = {};
    Object.keys(typeMeta).forEach(function (key) {
      scores[key] = 0;
    });

    Object.keys(state.selections).forEach(function (key) {
      selectedItems(key).forEach(function (item) {
        if (!item) return;
      scores[item.type] = (scores[item.type] || 0) + item.weight;
      });
    });

    var sorted = Object.keys(scores).sort(function (a, b) {
      return scores[b] - scores[a];
    });
    var primary = sorted[0] || "balanced";
    if (scores[primary] === 0) primary = "balanced";
    var secondary = sorted.find(function (key) {
      return key !== primary && scores[key] > 0;
    });
    var maxScore = Math.max(1, scores[primary]);
    var healthScore = Math.max(62, Math.min(94, 88 - Math.round(maxScore * 4) + selectedCount()));

    return {
      primary: primary,
      secondary: secondary || null,
      scores: scores,
      healthScore: healthScore,
      generatedAt: new Date().toLocaleString("zh-CN", { hour12: false })
    };
  }

  function buildReportPayload() {
    var report = state.report || calculateReport();
    var primary = typeMeta[report.primary] || typeMeta.balanced;
    var secondary = report.secondary ? typeMeta[report.secondary] : null;
    return {
      primary: report.primary,
      primaryName: primary.name,
      secondary: report.secondary || "",
      secondaryName: secondary ? secondary.name : "暂无明显兼夹",
      healthScore: report.healthScore,
      summary: primary.summary,
      advice: primary.advice,
      scores: report.scores || {},
      generatedAt: report.generatedAt || ""
    };
  }

  function buildSelectionsPayload() {
    var payload = {};
    categories.forEach(function (category) {
      payload[category.name] = selectedItems(category.id).map(function (item) {
        return item.label;
      });
    });
    return payload;
  }

  function renderReport() {
    var report = state.report || calculateReport();
    var primary = typeMeta[report.primary];
    var secondary = report.secondary ? typeMeta[report.secondary] : null;

    $("#ylReportState").textContent = selectedCount() >= categories.length ? "已生成你的体质自评报告。" : "选择 8 类标签后生成你的报告。";
    $("#ylReportBadge").textContent = selectedCount() >= categories.length ? "已填写" : "示例";
    $("#ylScore").textContent = report.healthScore;
    $("#ylPercentile").textContent = "优于 " + Math.min(91, report.healthScore + 4) + "% 用户";
    $("#ylMainType").textContent = "体质倾向：" + primary.name;
    $("#ylPrimaryType").textContent = "主要体质：" + primary.name;
    $("#ylSecondaryType").textContent = "兼有体质：" + (secondary ? secondary.name : "暂无明显兼夹");
    $("#ylSummaryAdvice").textContent = primary.advice;
    $("#ylValueScore").textContent = report.healthScore + "分";
    $("#ylValueText").textContent = "你的体质状态优于 " + Math.min(91, report.healthScore + 4) + "% 的用户。" + primary.summary;
    var previewType = $("#ylChatPreviewType");
    if (previewType) previewType.textContent = "基于" + primary.name + "继续追问";
    var previewText = $("#ylChatPreviewText");
    if (previewText) previewText.textContent = "已带入报告和 8 类采集，可继续问睡眠、脾胃、情绪、冷热。";
    var contextType = $("#ylChatContextType");
    if (contextType) contextType.textContent = "体质倾向：" + primary.name;
    var contextScore = $("#ylChatContextScore");
    if (contextScore) contextScore.textContent = "健康值 " + report.healthScore + "分";
    var contextAdvice = $("#ylChatContextAdvice");
    if (contextAdvice) contextAdvice.textContent = primary.advice;

    var blocks = $("#ylReportBlocks");
    blocks.innerHTML = "";
    [
      ["01", "当前重点", primary.summary],
      ["02", "养生建议", primary.advice],
      ["03", "复盘方式", "连续 7 天记录睡眠、胃口、大便和手脚冷热，看趋势比看单日更可靠。"]
    ].forEach(function (item) {
      var block = document.createElement("article");
      block.className = "yl-report-item";
      block.innerHTML = "<span>" + item[0] + "</span><div><strong>" + item[1] + "</strong><p>" + item[2] + "</p></div>";
      blocks.appendChild(block);
    });

    var bars = $("#ylBars");
    bars.innerHTML = "";
    Object.keys(typeMeta).forEach(function (key) {
      if (key === "balanced") return;
      var meta = typeMeta[key];
      var score = report.scores[key] || 0;
      var height = Math.max(8, score * 18);
      var bar = document.createElement("div");
      bar.className = "yl-bar";
      bar.innerHTML =
        '<span class="yl-bar-track"><i class="yl-bar-fill" style="height:' + height + "px;background:" + meta.color + '"></i></span>' +
        "<em>" + meta.name.replace("倾向", "") + "</em>";
      bars.appendChild(bar);
    });
  }

  function renderSelectedSummary() {
    var wrap = $("#ylSelectedSummary");
    if (!wrap) return;
    wrap.innerHTML = "";
    var filled = categories.filter(function (category) {
      return selectedItems(category.id).length > 0;
    });
    if (!filled.length) {
      var empty = document.createElement("p");
      empty.className = "yl-selected-empty";
      empty.textContent = "先选择舌象、睡眠、情绪等标签，右侧会同步形成摘要。";
      wrap.appendChild(empty);
      return;
    }
    filled.slice(0, 5).forEach(function (category) {
      var item = document.createElement("div");
      item.className = "yl-selected-item";
      item.innerHTML = "<strong>" + category.name + "</strong><span>" + selectedLabel(category.id) + "</span>";
      wrap.appendChild(item);
    });
  }

  function renderChatIntro() {
    var log = $("#ylChatLog");
    var suggestions = $("#ylSuggestions");
    var report = state.report || calculateReport();
    var primary = typeMeta[report.primary];

    var title = $("#ylChatTitle");
    if (title) title.textContent = "健康追问";
    var contextType = $("#ylChatContextType");
    if (contextType) contextType.textContent = "已读取：" + primary.name + " · 8类自评";

    updateAskQuota();
    suggestions.innerHTML = "";
    [
      "睡眠怎么调？",
      "脾胃怎么养？",
      "每天看什么？"
    ].forEach(function (text) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = text;
      button.addEventListener("click", function () {
        ask(text);
      });
      suggestions.appendChild(button);
    });

    renderChatMessages(log);
  }

  function renderChatMessages(log) {
    log.innerHTML = "";
    if (!state.chatMessages.length) {
      var bubble = document.createElement("div");
      var report = state.report || calculateReport();
      var primary = typeMeta[report.primary] || typeMeta.balanced;
      bubble.className = "yl-message is-ai is-intro";
      bubble.textContent = "已读取你的体质自评：" + primary.name + "，健康值 " + report.healthScore + "分。你可以直接问睡眠、脾胃、冷热或情绪。";
      log.appendChild(bubble);
      return;
    }
    state.chatMessages.slice(-20).forEach(function (message) {
      var bubble = document.createElement("div");
      bubble.className = "yl-message " + (message.role === "user" ? "is-user" : "is-ai");
      bubble.textContent = cleanChatText(message.content);
      log.appendChild(bubble);
    });
    log.scrollTop = log.scrollHeight;
  }

  function appendChatMessage(role, content) {
    state.chatMessages.push({
      role: role,
      content: cleanChatText(content),
      ts: Date.now()
    });
    state.chatMessages = state.chatMessages.filter(function (item) {
      return item.content;
    }).slice(-20);
    saveState();
    var log = $("#ylChatLog");
    if (log) renderChatMessages(log);
  }

  function setChatBusy(isBusy) {
    chatBusy = !!isBusy;
    var input = $("#ylChatInput");
    var button = $(".yl-chat-form button");
    if (input) input.disabled = chatBusy;
    if (button) {
      button.disabled = chatBusy;
      button.textContent = chatBusy ? "生成中" : "发送";
    }
  }

  function buildHistoryPayload() {
    return state.chatMessages.slice(-10).map(function (message) {
      return {
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content
      };
    });
  }

  async function ask(question) {
    var text = (question || "").trim();
    if (!text || chatBusy) return;

    state.report = state.report || calculateReport();
    var report = state.report;
    var primary = typeMeta[report.primary] || typeMeta.balanced;
    var history = buildHistoryPayload();

    appendChatMessage("user", text);
    setChatBusy(true);

    try {
      var data = await apiFetch("/api/health/chat", {
        method: "POST",
        body: {
          question: text,
          clientId: getHealthClientId(),
          report: buildReportPayload(),
          selections: buildSelectionsPayload(),
          history: history
        }
      });
      state.quota = data.quota || state.quota;
      if (state.quota) {
        var usedCount = state.quota.quotaMode === "daily" ? state.quota.dailyUsed : state.quota.lifetimeUsed;
        if (typeof usedCount === "number") state.askCount = usedCount;
      }
      appendChatMessage("assistant", data.reply || buildAnswer(text, primary));
      if (data.quotaExceeded) {
        setPayHint("当前可用追问次数已用完，请选择月卡继续使用。");
      }
    } catch (error) {
      appendChatMessage("assistant", "健康模型暂时没有连上，请稍后再试。你也可以先把问题具体到睡眠、脾胃、情绪或手脚冷热其中一项。");
      console.error("health chat failed:", error);
    } finally {
      setChatBusy(false);
      updateAskQuota();
      saveState();
    }
  }

  function buildAnswer(question, primary) {
    if (isUrgentHealthQuestion(question)) {
      return "你提到的情况可能属于需要及时评估的明显不适。请不要只参考体质自评，建议尽快联系医生或到正规医疗机构就诊；如果伴随胸痛、呼吸困难、晕厥、突发麻木、剧烈疼痛或持续加重，请立即寻求急诊帮助。";
    }
    if (question.indexOf("睡眠") >= 0) {
      return "结合你的报告，" + primary.name + "更适合先稳定睡前节律：睡前 30 分钟减少刺激信息，晚餐少冷饮和油甜，连续记录 7 天入睡、夜醒和晨起精神。";
    }
    if (question.indexOf("脾胃") >= 0 || question.indexOf("饮食") >= 0) {
      return "饮食先抓规律、少冷、少油甜。若饭后困或腹胀明显，先把晚餐减轻一点，再观察舌苔和大便变化。";
    }
    if (question.indexOf("手脚") >= 0 || question.indexOf("冷") >= 0 || question.indexOf("热") >= 0) {
      return "手脚冷热要和睡眠、胃口、腰腿一起看。偏冷先注意腰腹和脚踝保暖；手心脚心热则先减少熬夜和辛辣。";
    }
    if (question.indexOf("复盘") >= 0 || question.indexOf("记录") >= 0) {
      return "建议复盘四项：睡眠质量、胃口胀不胀、大便形态、手脚冷热。连续 7 天看趋势，比单日感觉更可靠。";
    }
    return "可以围绕 " + primary.name + " 继续观察。先选一个最明显的问题开始，比如睡眠、胃口、情绪或冷热，不要一次改太多。";
  }

  function isUrgentHealthQuestion(question) {
    return /胸痛|胸闷|心口痛|呼吸困难|喘不上气|晕厥|昏倒|意识不清|剧烈疼痛|剧痛|突发麻木|半边麻|口角歪|说话不清|便血|吐血|持续高热|高烧不退|严重过敏|休克|自杀|轻生|服毒|中毒/.test(question || "");
  }

  function generateReport() {
    state.report = calculateReport();
    state.chatMessages = [];
    state.quota = null;
    state.askCount = 0;
    saveState();
    renderReport();
    goToPage("report");
  }

  function goNextCategory() {
    if (state.currentIndex < categories.length - 1) {
      state.currentIndex += 1;
      saveState();
      renderAll();
    }
  }

  function resetAssessment() {
    state.currentIndex = 0;
    state.selections = {};
    state.report = calculateReport();
    state.askCount = 0;
    state.quota = null;
    state.chatMessages = [];
    localStorage.removeItem(STORAGE_KEY);
    var log = $("#ylChatLog");
    if (log) log.innerHTML = "";
    renderAll();
    goToPage("assessment");
  }

  function renderPaymentQr() {
    var holder = $("#ylPaymentQr");
    if (!holder) return;
    holder.innerHTML = "";
    if (!paymentState.payUrl || isRedirectPayment() || paymentState.payMethod === "handoff" || paymentState.mockMode) {
      holder.hidden = true;
      return;
    }
    holder.hidden = false;
    if (typeof QRCode === "function") {
      new QRCode(holder, {
        text: paymentState.payUrl,
        width: 152,
        height: 152,
        correctLevel: QRCode.CorrectLevel ? QRCode.CorrectLevel.M : undefined
      });
      return;
    }
    holder.textContent = "请打开支付链接";
  }

  function renderPayment() {
    var accountConfirmed = hasHealthPaymentAuth();
    renderMemberPlanSelection();
    renderRegisteredFreeCampaign();
    var payRow = $(".yl-pay-row");
    if (payRow) payRow.classList.toggle("is-alipay-disabled", !ALIPAY_CHECKOUT_VISIBLE);
    $all(".yl-pay-method").forEach(function (button) {
      var provider = button.dataset.provider || "wechat";
      var meta = getProviderMeta(provider);
      var label = getProviderLabel(provider);
      var detail = getProviderMethodDetail(provider);
      var alipayPendingApproval = provider === "alipay" && !ALIPAY_CHECKOUT_ENABLED;
      var providerVisible = !((provider === "alipay" && !ALIPAY_CHECKOUT_VISIBLE)
        || (provider === "paypal" && !PAYPAL_CHECKOUT_VISIBLE)
        || (provider === "paypal_card" && (!PAYPAL_CHECKOUT_VISIBLE || !PAYPAL_CARD_CHECKOUT_VISIBLE)));
      var providerEnabled = providerVisible && meta.enabled && !alipayPendingApproval;
      button.hidden = !providerVisible;
      button.setAttribute("aria-hidden", providerVisible ? "false" : "true");
      button.classList.toggle("is-active", paymentState.provider === provider);
      button.classList.toggle("is-pending-approval", alipayPendingApproval);
      button.classList.toggle("is-provider-unavailable", !meta.enabled);
      button.disabled = !accountConfirmed || paymentState.loading || paymentState.status === "pending" || !providerEnabled;
      button.textContent = alipayPendingApproval
        ? label + (IS_ENGLISH_CHECKOUT ? " (Under Review)" : "审核中")
        : (meta.enabled ? label : label + (IS_ENGLISH_CHECKOUT ? " (Unavailable)" : "未配置"));
      button.dataset.detail = alipayPendingApproval ? (IS_ENGLISH_CHECKOUT ? "Available after approval" : "审核通过后开放") : detail;
      button.setAttribute("aria-label", label + (IS_ENGLISH_CHECKOUT ? ", " : "，") + button.dataset.detail);
    });

    var memberCard = $(".yl-member-card");
    if (memberCard) {
      memberCard.dataset.provider = paymentState.provider;
      memberCard.dataset.paymentState = paymentState.status || "idle";
      memberCard.dataset.payMethod = paymentState.payMethod || "";
    }

    var amount = getPaymentAmountLabel();
    var memberPrice = $("#ylMemberPrice");
    if (memberPrice) memberPrice.textContent = IS_ENGLISH_CHECKOUT
      ? "$" + getSelectedMemberProduct().paypalAmount
      : amount;
    var openButton = $("#ylOpenPayBtn");
    if (openButton) {
      openButton.hidden = paymentState.status === "handoff";
      openButton.disabled = paymentState.loading;
      if (!accountConfirmed) openButton.textContent = IS_ENGLISH_CHECKOUT ? "Confirm account to continue" : "登录后继续付款";
      else if (paymentState.loading) openButton.textContent = IS_ENGLISH_CHECKOUT ? "Processing..." : "处理中...";
      else if (paymentState.status === "handoff") openButton.textContent = IS_ENGLISH_CHECKOUT ? "Copy the WeChat payment link again" : "重新复制微信支付链接";
      else if (paymentState.status === "pending" && isRedirectPayment()) openButton.textContent = (IS_ENGLISH_CHECKOUT ? "Open " : "打开") + getProviderLabel(paymentState.provider);
      else if (paymentState.status === "pending") openButton.textContent = IS_ENGLISH_CHECKOUT ? "I paid — refresh status" : "我已支付，刷新状态";
      else {
        var providerPrefix = paymentState.provider === "paypal_card"
          ? (IS_ENGLISH_CHECKOUT ? "Enter card details and pay " : "填写银行卡支付 ")
          : paymentState.provider === "paypal"
          ? (IS_ENGLISH_CHECKOUT ? "Pay with PayPal " : "使用 PayPal ")
          : (IS_ENGLISH_CHECKOUT ? "Pay with " : "使用") + getProviderLabel(paymentState.provider) + (IS_ENGLISH_CHECKOUT ? " " : "");
        openButton.textContent = providerPrefix + (IS_ENGLISH_CHECKOUT ? "" : (paymentState.isMember ? "续费 " : "付款 ")) + amount;
      }
    }

    renderMembershipState();

    var panel = $("#ylPaymentPanel");
    if (panel) {
      var wasHidden = panel.hidden;
      panel.hidden = paymentState.panelDismissed
        || paymentState.status === "login"
        || paymentState.status === "paid"
        || (!paymentState.status && !paymentState.message);
      if (wasHidden && !panel.hidden) {
        window.setTimeout(function () { $("#ylPaymentCloseBtn")?.focus({ preventScroll: true }); }, 0);
      }
    }
    var status = $("#ylPaymentStatus");
    if (status) status.textContent = paymentState.message || (IS_ENGLISH_CHECKOUT ? "Choose a payment method to create an order." : "请选择支付方式后创建订单。");
    var code = $("#ylPaymentCode");
    if (code) code.hidden = !paymentState.orderNo;
    var orderNo = $("#ylPaymentOrderNo");
    if (orderNo) orderNo.textContent = paymentState.orderNo ? (IS_ENGLISH_CHECKOUT ? "Order: " : "订单号：") + paymentState.orderNo : "";

    var link = $("#ylPaymentLink");
    if (link) {
      var showLink = !!paymentState.payUrl && !paymentState.mockMode && isRedirectPayment();
      link.hidden = !showLink;
      link.href = paymentState.payUrl || "#";
      if (paymentState.provider === "paypal") link.textContent = IS_ENGLISH_CHECKOUT ? "Open PayPal" : "立即打开 PayPal 支付";
      else if (isRedirectPayment()) link.textContent = (IS_ENGLISH_CHECKOUT ? "Open " : "打开") + getProviderLabel(paymentState.provider);
      else link.textContent = IS_ENGLISH_CHECKOUT ? "Open payment link" : "支付链接备用打开";
    }

    var refresh = $("#ylRefreshPayBtn");
    if (refresh) refresh.hidden = !paymentState.orderNo || paymentState.status === "paid";
    var mock = $("#ylMockPayBtn");
    if (mock) mock.hidden = !(paymentState.mockMode && paymentState.orderNo && paymentState.status !== "paid");
    var copyHandoff = $("#ylCopyWechatLinkBtn");
    if (copyHandoff) copyHandoff.hidden = !(paymentState.payMethod === "handoff" && paymentState.payUrl);
    var cardCheckout = $("#ylCardCheckout");
    var cardSelected = paymentState.provider === "paypal_card";
    if (cardCheckout) cardCheckout.hidden = !cardSelected;
    var cardSubmit = $("#ylCardSubmitBtn");
    if (cardSubmit) {
      var cardPending = paymentState.status === "pending" && !!paymentState.orderNo;
      cardSubmit.disabled = paymentState.loading || !paypalCardState.ready || cardPending;
      cardSubmit.textContent = cardPending
        ? (IS_ENGLISH_CHECKOUT ? "Payment processing" : "付款处理中，请勿重复提交")
        : (IS_ENGLISH_CHECKOUT ? "Pay by card " : "使用银行卡支付 ") + amount;
    }
    var paymentActions = $(".yl-payment-actions");
    if (paymentActions) paymentActions.hidden = cardSelected && !(paymentState.status === "pending" && !!paymentState.orderNo);

    renderPaymentQr();
    renderHealthAuthPanel();
    if (paymentState.status === "paid") {
      setPayHint(getMemberRenewalHint("支付成功"));
      updateAskQuota();
    }
  }

  function setHealthAuthStatus(message, tone) {
    healthAuthState.message = message || "";
    healthAuthState.tone = tone || "";
    renderHealthAuthPanel();
  }

  function closeHealthPaymentPanel() {
    paymentState.panelDismissed = true;
    renderPayment();
    $("#ylOpenPayBtn")?.focus({ preventScroll: true });
  }

  function isHealthPaymentPanelOpen() {
    var panel = $("#ylPaymentPanel");
    return !!panel && !panel.hidden;
  }

  function isAccountDialogOpen() {
    var overlay = $("#ylAccountOverlay");
    return !!overlay && !overlay.hidden;
  }

  function renderHealthAuthPanel() {
    var panel = $("#ylHealthAuthPanel");
    if (!panel) return;
    var authSession = readAuthSession();
    var dialogOpen = healthAuthState.panelOpen;
    var shouldShow = dialogOpen && (!authSession || healthAuthState.reauth);
    var overlay = $("#ylAccountOverlay");
    if (overlay) overlay.hidden = !dialogOpen;
    document.body.classList.toggle("yl-account-open", dialogOpen);
    panel.hidden = !shouldShow;
    var accountPanel = $("#ylHealthAccount");
    if (accountPanel) accountPanel.hidden = !dialogOpen || !authSession || healthAuthState.reauth;
    var accountLabel = $("#ylHealthAccountLabel");
    if (accountLabel && authSession) accountLabel.textContent = formatHealthAccountLabel(authSession.user);
    var triggerLabel = $("#ylAccountTriggerLabel");
    if (triggerLabel) triggerLabel.textContent = authSession
      ? (IS_ENGLISH_CHECKOUT ? "Account" : "个人中心")
      : (IS_ENGLISH_CHECKOUT ? "Sign In" : "登录 / 注册");
    var accountTrigger = $("#ylAccountTrigger");
    if (accountTrigger) accountTrigger.setAttribute("aria-expanded", dialogOpen ? "true" : "false");
    var mobileTrigger = $("#ylMobileAccountTrigger");
    if (mobileTrigger) mobileTrigger.setAttribute("aria-expanded", dialogOpen ? "true" : "false");

    var checkoutLabel = $("#ylCheckoutAccountLabel");
    var checkoutMeta = $("#ylCheckoutAccountMeta");
    var checkoutButton = $("#ylCheckoutAccountBtn");
    var paymentConfirmed = hasHealthPaymentAuth();
    if (checkoutButton) checkoutButton.hidden = !authSession && paymentConfirmed;
    if (authSession) {
      if (checkoutLabel) checkoutLabel.textContent = formatHealthAccountLabel(authSession.user);
      if (checkoutMeta) {
        checkoutMeta.textContent = hasRegisteredFreeCampaignAccess()
          ? (IS_ENGLISH_CHECKOUT ? "Limited-time free access is active" : "限时免费体验已生效，无需付款")
          : paymentConfirmed
          ? (IS_ENGLISH_CHECKOUT
            ? (paymentState.isMember ? "Paid plan · payment account confirmed" : "Payment account confirmed")
            : (paymentState.isMember ? "付费会员 · 当前付款账号已确认" : "当前付款账号已确认"))
          : (IS_ENGLISH_CHECKOUT ? "Signed in · confirm your password before paying" : "已登录，付款前需要再次确认密码");
      }
      if (checkoutButton) checkoutButton.textContent = paymentConfirmed
        ? (IS_ENGLISH_CHECKOUT ? "Account" : "个人中心")
        : (IS_ENGLISH_CHECKOUT ? "Confirm Account" : "确认账号");
    } else if (paymentConfirmed) {
      if (checkoutLabel) checkoutLabel.textContent = IS_ENGLISH_CHECKOUT ? "Payment account confirmed" : "付款账号已安全确认";
      if (checkoutMeta) checkoutMeta.textContent = IS_ENGLISH_CHECKOUT ? "Choose a payment method to continue" : "可以继续选择支付方式";
    } else {
      if (checkoutLabel) checkoutLabel.textContent = IS_ENGLISH_CHECKOUT ? "Sign in first" : "请先登录账号";
      if (checkoutMeta) checkoutMeta.textContent = IS_ENGLISH_CHECKOUT ? "Your membership stays with this account" : "登录后，会员权益会绑定到该账号";
      if (checkoutButton) checkoutButton.textContent = IS_ENGLISH_CHECKOUT ? "Sign In" : "登录 / 注册";
    }

    var registering = healthAuthState.mode === "register";
    var accountInput = $("#ylHealthAuthAccount");
    if (shouldShow && !registering && accountInput && !accountInput.value && authSession?.user) {
      accountInput.value = getHealthAuthAccountValue(authSession.user);
    }
    if (accountInput) accountInput.readOnly = !!(healthAuthState.reauth && authSession && !registering);
    var dialogTitle = $("#ylAccountDialogTitle");
    if (dialogTitle) {
      dialogTitle.textContent = IS_ENGLISH_CHECKOUT
        ? (authSession && !healthAuthState.reauth
          ? "Account"
          : (healthAuthState.reauth ? "Confirm Payment Account" : (registering ? "Create Yuetian Account" : "Sign In to Yuetian")))
        : (authSession && !healthAuthState.reauth
          ? "个人中心"
          : (healthAuthState.reauth ? "确认付款账号" : (registering ? "注册阅天账号" : "登录阅天账号")));
    }
    var title = $("#ylHealthAuthTitle");
    if (title) title.textContent = IS_ENGLISH_CHECKOUT
      ? (healthAuthState.reauth ? "Confirm your account" : (registering ? "Create an account" : "Sign in to your account"))
      : (healthAuthState.reauth ? "请再次确认当前账号" : (registering ? "注册新账号" : "登录已有账号"));
    var description = $("#ylHealthAuthDescription");
    if (description) description.textContent = IS_ENGLISH_CHECKOUT
      ? (healthAuthState.reauth
        ? "Enter your password to protect membership ownership."
        : (registering ? "Creating an account does not start payment." : "Sign in to view your plan and remaining quota."))
      : (healthAuthState.reauth
        ? "为保护会员归属，请输入当前账号密码后继续付款"
        : (registering ? "注册只创建账号，不会立即创建支付订单" : "登录后可在个人中心查看会员和剩余额度"));
    var modeGroup = $(".yl-health-auth-mode");
    if (modeGroup) modeGroup.hidden = healthAuthState.reauth;
    var loginModeButton = $("#ylHealthLoginModeBtn");
    var registerModeButton = $("#ylHealthRegisterModeBtn");
    if (loginModeButton) loginModeButton.setAttribute("aria-pressed", registering ? "false" : "true");
    if (registerModeButton) registerModeButton.setAttribute("aria-pressed", registering ? "true" : "false");
    var accountFieldLabel = $("#ylHealthAccountFieldLabel");
    if (accountFieldLabel) accountFieldLabel.textContent = IS_ENGLISH_CHECKOUT
      ? (registering ? "Phone" : "Phone or Email")
      : (registering ? "手机号" : "手机号或邮箱");
    if (accountInput) {
      accountInput.placeholder = IS_ENGLISH_CHECKOUT
        ? (registering ? "11-digit phone number" : "Phone or email")
        : (registering ? "请输入 11 位手机号" : "手机号或邮箱");
      accountInput.setAttribute("aria-label", IS_ENGLISH_CHECKOUT
        ? (registering ? "Phone" : "Phone or email")
        : (registering ? "手机号" : "手机号或邮箱"));
      accountInput.setAttribute("inputmode", registering ? "numeric" : "email");
      accountInput.setAttribute("autocomplete", registering ? "tel" : "username");
    }
    var passwordInput = $("#ylHealthAuthPassword");
    if (passwordInput) passwordInput.setAttribute("autocomplete", registering ? "new-password" : "current-password");
    var confirmField = $("#ylHealthConfirmPasswordField");
    if (confirmField) confirmField.hidden = !registering;
    var recoveryButton = $("#ylHealthRecoveryBtn");
    if (recoveryButton) {
      recoveryButton.hidden = registering || healthAuthState.reauth;
      recoveryButton.disabled = healthAuthState.loading;
      recoveryButton.textContent = IS_ENGLISH_CHECKOUT ? "Forgot password? Send reset email" : "忘记密码？发送重置邮件";
    }
    var status = $("#ylHealthAuthStatus");
    if (status) {
      status.textContent = healthAuthState.message || "";
      status.dataset.tone = healthAuthState.tone || "";
    }
    ["#ylHealthLoginModeBtn", "#ylHealthRegisterModeBtn", "#ylHealthAuthSubmitBtn"].forEach(function (selector) {
      var button = $(selector);
      if (button) button.disabled = healthAuthState.loading;
    });
    var submitButton = $("#ylHealthAuthSubmitBtn");
    if (submitButton) submitButton.textContent = IS_ENGLISH_CHECKOUT
      ? (healthAuthState.loading
        ? (registering ? "Creating account..." : "Confirming account...")
        : (healthAuthState.reauth ? "Confirm and Continue" : (registering ? "Create Account" : "Sign In and Continue")))
      : (healthAuthState.loading
        ? (registering ? "正在注册..." : "正在确认账号...")
        : (healthAuthState.reauth ? "确认并继续付款" : (registering ? "注册并登录" : "登录并继续")));
    var goPayButton = $("#ylHealthGoPayBtn");
    if (goPayButton) goPayButton.textContent = hasRegisteredFreeCampaignAccess()
      ? (IS_ENGLISH_CHECKOUT ? "Start free access" : "开始免费使用")
      : (IS_ENGLISH_CHECKOUT
        ? (paymentState.isMember ? "Renew Monthly Pass" : "Choose a Monthly Pass")
        : (paymentState.isMember ? "续费月卡" : "选择月卡"));
  }

  function setHealthAuthMode(mode) {
    if (healthAuthState.loading) return;
    healthAuthState.mode = mode === "register" ? "register" : "login";
    healthAuthState.message = "";
    healthAuthState.tone = "";
    var accountInput = $("#ylHealthAuthAccount");
    if (healthAuthState.mode === "register" && /@/.test(accountInput?.value || "")) accountInput.value = "";
    var passwordInput = $("#ylHealthAuthPassword");
    var confirmInput = $("#ylHealthAuthConfirmPassword");
    if (passwordInput) passwordInput.value = "";
    if (confirmInput) confirmInput.value = "";
    renderHealthAuthPanel();
    window.setTimeout(function () { accountInput?.focus({ preventScroll: true }); }, 0);
  }

  async function requestHealthPasswordRecovery() {
    if (healthAuthState.loading) return;
    var account = String($("#ylHealthAuthAccount")?.value || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account)) {
      setHealthAuthStatus(IS_ENGLISH_CHECKOUT
        ? "Enter the email address used for this account. Phone-only accounts cannot receive email resets."
        : "请输入注册时使用的邮箱。仅手机号注册的账号暂时不能接收重置邮件。", "error");
      return;
    }
    healthAuthState.loading = true;
    renderHealthAuthPanel();
    try {
      var data = await apiFetch("/api/auth/recovery", { method: "POST", noAuth: true, body: { email: account } });
      setHealthAuthStatus(data?.message || "如果该邮箱已注册，重置链接会发送到邮箱。", "ok");
    } catch (error) {
      setHealthAuthStatus(error.message || "重置邮件发送失败，请稍后再试", "error");
    } finally {
      healthAuthState.loading = false;
      renderHealthAuthPanel();
    }
  }

  function formatHealthAccountLabel(user) {
    return getHealthAuthAccountValue(user) || "已登录账号";
  }

  function getHealthAuthAccountValue(user) {
    var phone = String(user?.user_metadata?.phone || "").replace(/\D/g, "");
    if (phone) return phone;
    var email = String(user?.user_metadata?.profile_email || user?.email || "").trim();
    if (/^phone_\d+@yuetianai\.local$/i.test(email)) {
      return email.replace(/^phone_|@yuetianai\.local$/gi, "");
    }
    return email;
  }

  function switchHealthPaymentAccount() {
    if (paymentState.orderNo && !window.confirm("当前订单仍绑定现在的账号。确定放弃当前订单并切换账号吗？")) return;
    clearHealthAuthSession();
    state.quota = null;
    paymentState.orderNo = "";
    paymentState.status = "login";
    paymentState.payUrl = "";
    paymentState.payMethod = "";
    paymentState.isMember = false;
    paymentState.membershipLoaded = false;
    paymentState.memberExpiresAt = "";
    updateAskQuota();
    healthAuthState.reauth = false;
    openHealthAuthPanel("请登录要开通会员的网站账号，再继续付款。");
  }

  function logoutHealthAccount() {
    if (paymentState.orderNo && !window.confirm("当前订单仍绑定现在的账号。确定退出登录并放弃当前订单吗？")) return;
    clearHealthAuthSession();
    state.quota = null;
    paymentState.orderNo = "";
    paymentState.status = "";
    paymentState.payUrl = "";
    paymentState.payMethod = "";
    paymentState.isMember = false;
    paymentState.membershipLoaded = false;
    paymentState.memberExpiresAt = "";
    healthAuthState.panelOpen = false;
    healthAuthState.reauth = false;
    healthAuthState.message = "";
    updateAskQuota();
    setPayHint("已退出登录。需要开通会员时，请先登录账号。");
    renderPayment();
    renderHealthAuthPanel();
    var logoutFocus = window.matchMedia("(max-width: 720px)").matches && pageFromHash() !== "member"
      ? $("#ylMobileAccountTrigger")
      : $("#ylAccountTrigger");
    logoutFocus?.focus({ preventScroll: true });
  }

  function openAccountCenter(trigger) {
    accountDialogReturnFocus = trigger || document.activeElement;
    healthAuthState.panelOpen = true;
    healthAuthState.reauth = false;
    healthAuthState.mode = "login";
    healthAuthState.message = "";
    healthAuthState.tone = "";
    renderHealthAuthPanel();
    if (readAuthSession()) hydratePaymentProduct();
    window.setTimeout(function () {
      if (readAuthSession()) $("#ylAccountCloseBtn")?.focus({ preventScroll: true });
      else $("#ylHealthAuthAccount")?.focus({ preventScroll: true });
    }, 0);
  }

  function closeAccountDialog() {
    if (healthAuthState.loading) return;
    healthAuthState.panelOpen = false;
    healthAuthState.reauth = false;
    healthAuthState.message = "";
    healthAuthState.tone = "";
    renderHealthAuthPanel();
    if (accountDialogReturnFocus && document.contains(accountDialogReturnFocus)) {
      accountDialogReturnFocus.focus?.({ preventScroll: true });
    }
    accountDialogReturnFocus = null;
  }

  function goToMemberFromAccount() {
    closeAccountDialog();
    goToPage("member", { instant: true });
    window.setTimeout(function () { $("#ylOpenPayBtn")?.focus({ preventScroll: true }); }, 0);
  }

  function openHealthAuthPanel(message, options) {
    var opts = options || {};
    var loginMessage = message || "请登录账号，确认会员要开通到哪个账号。";
    var activeElement = document.activeElement;
    accountDialogReturnFocus = opts.returnFocus
      || (activeElement && activeElement !== document.body ? activeElement : null);
    healthAuthState.panelOpen = true;
    healthAuthState.reauth = !!(opts.reauth && readAuthSession());
    healthAuthState.mode = "login";
    healthAuthState.message = loginMessage;
    healthAuthState.tone = "";
    paymentState.status = "login";
    paymentState.message = loginMessage;
    renderPayment();
    window.setTimeout(function () {
      var input = $("#ylHealthAuthAccount");
      var password = $("#ylHealthAuthPassword");
      if (healthAuthState.reauth && password) password.focus({ preventScroll: true });
      else if (input) input.focus({ preventScroll: true });
    }, 30);
  }

  function showHealthLoginRequired() {
    clearPaymentConfirmation();
    paymentState.orderNo = "";
    paymentState.payUrl = "";
    paymentState.payMethod = "";
    setPayHint("");
    openHealthAuthPanel(
      readAuthSession()
        ? "为保护会员归属，请输入当前账号密码确认后继续付款。"
        : "请先登录账号，再继续付款。",
      { reauth: !!readAuthSession() }
    );
  }

  async function submitHealthAuth() {
    if (healthAuthState.loading) return;
    var account = ($("#ylHealthAuthAccount")?.value || "").trim();
    var password = $("#ylHealthAuthPassword")?.value || "";
    var confirmPassword = $("#ylHealthAuthConfirmPassword")?.value || "";
    var registering = healthAuthState.mode === "register";
    if (!account) {
      setHealthAuthStatus(registering ? "注册请填写手机号" : "请输入手机号或邮箱", "error");
      return;
    }
    if (registering) {
      account = account.replace(/\D/g, "");
    }
    if (registering && !/^1\d{10}$/.test(account)) {
      setHealthAuthStatus("请输入正确的 11 位手机号", "error");
      return;
    }
    if (password.length < 6) {
      setHealthAuthStatus("密码至少 6 位", "error");
      return;
    }
    if (registering && password !== confirmPassword) {
      setHealthAuthStatus("两次输入的密码不一致", "error");
      return;
    }

    healthAuthState.loading = true;
    setHealthAuthStatus(registering ? "正在注册并登录..." : "正在登录...", "");
    try {
      var data = null;
      var registered = false;
      if (registering) {
        data = await apiFetch("/api/auth/register-phone", {
          method: "POST",
          noAuth: true,
          body: { phone: account, password: password }
        });
        registered = true;
      }
      if (registering && !data?.session) {
        data = await apiFetch("/api/auth/password-login", {
          method: "POST",
          noAuth: true,
          body: { account: account, password: password }
        });
      } else if (!registering) {
        data = await apiFetch("/api/auth/password-login", {
          method: "POST",
          noAuth: true,
          body: { account: account, password: password }
        });
      }
      if (!saveHealthAuthSession(data?.session)) throw new Error("登录状态保存失败");
      if (!setPaymentConfirmationToken(data?.paymentHandoffToken)) {
        throw new Error("本次付款账号确认失败，请重新登录");
      }
      window.yuetianTrack?.(registered ? "sign_up" : "login", { method: "password", surface: "unified_member" });
      healthAuthState.panelOpen = false;
      healthAuthState.reauth = false;
      healthAuthState.loading = false;
      healthAuthState.message = "";
      healthAuthState.tone = "";
      paymentState.status = "";
      paymentState.message = "";
      paymentState.panelDismissed = true;
      setPayHint("账号已确认，请选择支付方式后再点击付款。");
      var confirmInput = $("#ylHealthAuthConfirmPassword");
      var passwordInput = $("#ylHealthAuthPassword");
      if (confirmInput) confirmInput.value = "";
      if (passwordInput) passwordInput.value = "";
      await hydratePaymentProduct();
      var focusTarget = accountDialogReturnFocus;
      accountDialogReturnFocus = null;
      window.setTimeout(function () {
        if (pageFromHash() === "member") {
          $("#ylCheckoutAccountSummary")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        if (focusTarget && document.contains(focusTarget)) focusTarget.focus?.({ preventScroll: true });
        else $("#ylOpenPayBtn")?.focus({ preventScroll: true });
      }, 30);
    } catch (error) {
      healthAuthState.loading = false;
      if (registering && /已注册|already|exists/i.test(error.message || "")) {
        healthAuthState.mode = "login";
        var passwordInput = $("#ylHealthAuthPassword");
        var confirmInput = $("#ylHealthAuthConfirmPassword");
        if (passwordInput) passwordInput.value = "";
        if (confirmInput) confirmInput.value = "";
        setHealthAuthStatus("这个手机号已注册，请输入原密码登录。", "error");
        passwordInput?.focus();
        return;
      }
      setHealthAuthStatus(normalizeHealthAuthError(error.message), "error");
      renderPayment();
      var passwordInput = $("#ylHealthAuthPassword");
      if (passwordInput) {
        passwordInput.focus();
        passwordInput.select?.();
      }
    }
  }

  async function hydratePaymentProduct() {
    paymentState.membershipLoaded = false;
    var requestedProductKey = HEALTH_PRODUCT_KEY;
    try {
      var data = await apiFetch("/api/payments/member-status?productKey=" + encodeURIComponent(requestedProductKey));
      if (requestedProductKey !== HEALTH_PRODUCT_KEY) return;
      if (data.product) paymentState.product = data.product;
      if (data.quota) state.quota = { ...data.quota, chartUsage: data.chartUsage || null };
      paymentState.campaign = data.campaign || null;
      paymentState.isMember = !!(data.productEntitlement?.isMember || data.quota?.isMember);
      paymentState.memberExpiresAt = data.productEntitlement?.expiresAt
        || data.quota?.memberExpiresAt
        || "";
      paymentState.membershipLoaded = true;
      if (Array.isArray(data.providers)) {
        paymentState.providers = data.providers;
        var selected = data.providers.find(function (item) {
          return item.provider === getBackendProvider(paymentState.provider);
        });
        if (selected && selected.currency) {
          paymentState.product = Object.assign({}, paymentState.product || {}, {
            amountYuan: selected.amountYuan || paymentState.product?.amountYuan,
            currency: selected.currency
          });
        }
      }
    } catch (_error) {}
    updateAskQuota();
    renderProgress();
    saveState();
    renderPayment();
  }

  function requireHealthLogin() {
    if (hasHealthPaymentAuth()) return true;
    var session = readAuthSession();
    openHealthAuthPanel(
      session
        ? (IS_ENGLISH_CHECKOUT ? "Enter your password to confirm this payment account." : "为保护会员归属，请输入当前账号密码确认后继续付款。")
        : (IS_ENGLISH_CHECKOUT ? "Sign in or create an account to continue." : "请先登录或注册，再继续付款。"),
      { reauth: !!session }
    );
    return false;
  }

  async function copyText(text) {
    if (!text) return false;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_error) {}
    try {
      var input = document.createElement("textarea");
      input.value = text;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      var copied = document.execCommand("copy");
      input.remove();
      return copied;
    } catch (_error) {
      return false;
    }
  }

  async function createWechatPaymentHandoff() {
    paymentState.loading = true;
    paymentState.status = "loading";
    paymentState.message = "正在生成微信支付链接...";
    paymentState.orderNo = "";
    paymentState.payUrl = "";
    paymentState.payMethod = "";
    renderPayment();
    try {
      var data = await apiFetch("/api/payments/wechat/handoff", {
        method: "POST",
        body: {}
      });
      if (!data.handoffUrl) throw new Error("微信支付链接生成失败");
      var handoffUrl = decoratePaymentHandoffUrl(data.handoffUrl);
      paymentState.status = "handoff";
      paymentState.payMethod = "handoff";
      paymentState.payUrl = handoffUrl;
      var copied = await copyText(handoffUrl);
      var copyButton = $("#ylCopyWechatLinkBtn");
      if (copyButton) copyButton.textContent = copied ? "再次复制，去微信付款" : "复制链接，去微信付款";
      paymentState.message = copied
        ? "链接已复制。请打开微信，把链接发给自己，再点开链接完成支付。"
        : "请先复制链接，再打开微信，把链接发给自己并点开完成支付。";
      setPayHint("点开后直接拉起微信支付，无需重新登录；链接1小时内有效。");
    } catch (error) {
      if (isHealthLoginRequiredError(error)) {
        showHealthLoginRequired();
      } else {
        paymentState.status = "error";
        paymentState.message = error.message || "微信支付链接生成失败";
        setPayHint("请稍后重试，或改用支付宝。");
      }
    } finally {
      paymentState.loading = false;
      renderPayment();
    }
  }

  function trackHealthPurchase(data) {
    data = data || {};
    window.yuetianTrackPurchase?.({
      orderNo: data.orderNo || paymentState.orderNo,
      value: data.amountYuan || paymentState.product?.amountYuan,
      currency: data.currency || paymentState.product?.currency || "CNY",
      provider: data.provider || paymentState.provider,
      productKey: data.productKey || HEALTH_PRODUCT_KEY,
      surface: "unified_member",
      mockMode: data.mockMode ?? paymentState.mockMode
    });
  }

  function getPayPalCardErrorMessage(error) {
    var message = String(error?.message || error || "");
    var code = String(error?.code || "").toUpperCase();
    var englishMessages = {
      PAYPAL_CAPTURE_PENDING: "The card issuer is still processing this payment. Do not submit it again; refresh the status shortly.",
      PAYPAL_CARD_CVV_MISMATCH: "The security code did not match the issuer's records. Check the CVV and try again.",
      PAYPAL_CARD_INSUFFICIENT_FUNDS: "The card has insufficient available credit. Use another card or contact the issuer.",
      PAYPAL_CARD_ADDRESS_MISMATCH: "The billing address did not match the issuer's records. Enter the exact registered billing address.",
      PAYPAL_CARD_EXPIRED: "The card has expired. Use another card.",
      PAYPAL_CARD_NOT_PERMITTED: "The issuer does not allow this international online payment. Contact the issuer or use another card.",
      PAYPAL_CARD_RESTRICTED: "This card is restricted or cannot be used for this payment. Use another card.",
      PAYPAL_CARD_3DS_ERROR: "Card security verification did not complete. Retry the verification or use another card.",
      PAYPAL_CARD_3DS_FAILED: "Card security verification failed. Contact the issuer or use another card.",
      PAYPAL_CARD_RISK_DECLINED: "PayPal declined this payment for risk checks. Use another card or contact PayPal.",
      PAYPAL_CARD_DECLINED: "The issuer or PayPal declined this payment. Check the billing address, contact the issuer, or use another card.",
      PAYPAL_CARD_PROCESSING_NOT_ENABLED: "The merchant account is not yet enabled for direct card payments. Please contact support.",
      PAYPAL_MERCHANT_VERIFICATION_REQUIRED: "The merchant PayPal account needs verification before it can receive this payment.",
      PAYPAL_MERCHANT_ACTION_REQUIRED: "The merchant PayPal account needs a receiving-setting update before this payment can complete.",
      PAYPAL_PROCESSOR_UNAVAILABLE: "The card network is temporarily unavailable. Try again later.",
      PAYPAL_CARD_ISSUER_UNAVAILABLE: "The issuer is temporarily unavailable. Try again later or use another card."
    };
    var chineseMessages = {
      PAYPAL_CAPTURE_PENDING: "发卡行正在处理这笔付款，请不要重复提交，稍后刷新支付状态。",
      PAYPAL_CARD_CVV_MISMATCH: "安全码未通过发卡行验证，请核对 CVV 后重试。",
      PAYPAL_CARD_INSUFFICIENT_FUNDS: "银行卡可用额度不足，请更换银行卡或联系发卡行。",
      PAYPAL_CARD_ADDRESS_MISMATCH: "账单地址未通过发卡行验证，请填写银行登记的真实账单地址。",
      PAYPAL_CARD_EXPIRED: "银行卡已过期，请更换有效银行卡。",
      PAYPAL_CARD_NOT_PERMITTED: "发卡行不允许这笔境外线上付款，请联系发卡行或更换银行卡。",
      PAYPAL_CARD_RESTRICTED: "该银行卡受限或不支持本次付款，请更换银行卡。",
      PAYPAL_CARD_3DS_ERROR: "银行卡安全验证未完成，请重新验证或更换银行卡。",
      PAYPAL_CARD_3DS_FAILED: "银行卡安全验证失败，请联系发卡行或更换银行卡。",
      PAYPAL_CARD_RISK_DECLINED: "本次付款被 PayPal 风控拒绝，请更换银行卡或联系 PayPal。",
      PAYPAL_CARD_DECLINED: "发卡行或 PayPal 未批准这笔付款，请核对账单地址、联系发卡行或更换银行卡。",
      PAYPAL_CARD_PROCESSING_NOT_ENABLED: "商户 PayPal 账户尚未开通银行卡处理能力，请联系支持。",
      PAYPAL_MERCHANT_VERIFICATION_REQUIRED: "商户 PayPal 账户需要先完成验证，当前暂时无法收款。",
      PAYPAL_MERCHANT_ACTION_REQUIRED: "商户 PayPal 账户需要先处理收款设置，当前暂时无法完成付款。",
      PAYPAL_PROCESSOR_UNAVAILABLE: "银行卡处理网络暂时异常，请稍后重试。",
      PAYPAL_CARD_ISSUER_UNAVAILABLE: "发卡行暂时不可用，请稍后重试或更换银行卡。"
    };
    if ((IS_ENGLISH_CHECKOUT ? englishMessages : chineseMessages)[code]) {
      return (IS_ENGLISH_CHECKOUT ? englishMessages : chineseMessages)[code];
    }
    if (/instrument_declined|card.*declin|declined/i.test(message)) {
      return IS_ENGLISH_CHECKOUT
        ? "The card was declined. Try another card or contact the card issuer."
        : "银行卡被拒绝，请换卡或联系发卡行确认境外线上支付已开启。";
    }
    if (/validation|invalid.*card|card.*invalid|fields?/i.test(message)) {
      return IS_ENGLISH_CHECKOUT
        ? "Check the card details and billing address, then try again."
        : "请检查卡号、有效期、安全码和账单地址后重试。";
    }
    if (/authentication|3d.?secure|liability/i.test(message)) {
      return IS_ENGLISH_CHECKOUT
        ? "Card security verification did not complete. Please retry or use another card."
        : "银行卡安全验证未完成，请重试或更换银行卡。";
    }
    if (/not eligible|ineligible|unsupported/i.test(message)) {
      return IS_ENGLISH_CHECKOUT
        ? "Direct card payment is not available for this device or region. Use PayPal instead."
        : "当前设备或地区暂不支持银行卡直付，请改用 PayPal。";
    }
    return IS_ENGLISH_CHECKOUT
      ? "The card payment could not be completed. Check the billing details or try another card."
      : "银行卡付款未完成，请核对真实账单地址，或更换银行卡重试。";
  }

  function handlePayPalCardFailure(error) {
    if (isHealthLoginRequiredError(error)) {
      showHealthLoginRequired();
      return;
    }
    paymentState.loading = false;
    paymentState.status = error?.code === "PAYPAL_CAPTURE_PENDING" ? "pending" : "error";
    paymentState.payUrl = "";
    paymentState.payMethod = "card";
    paymentState.message = getPayPalCardErrorMessage(error);
    paymentState.panelDismissed = false;
    setPayHint(error?.code === "PAYPAL_CAPTURE_PENDING"
      ? (IS_ENGLISH_CHECKOUT ? "Do not submit another payment while this order is processing." : "该订单仍在银行处理中，请勿重复付款，可稍后刷新状态。")
      : (IS_ENGLISH_CHECKOUT
        ? "Use the billing address registered with the card issuer."
        : "请填写发卡行登记的真实账单地址；这里不需要美国手机号。"));
    renderPayment();
  }

  function updatePayPalCardBillingRules() {
    var country = String($("#ylCardCountry")?.value || "").toUpperCase();
    var region = $("#ylCardRegion");
    var regionLabel = $("#ylCardRegionLabel");
    var postal = $("#ylCardPostalCode");
    if (!region || !postal) return;

    region.setCustomValidity("");
    postal.setCustomValidity("");
    region.removeAttribute("pattern");
    postal.removeAttribute("pattern");
    region.maxLength = 120;
    region.placeholder = "";
    postal.placeholder = "";

    if (country === "US" || country === "CA") {
      region.maxLength = 2;
      region.pattern = "[A-Za-z]{2}";
      region.placeholder = country === "US"
        ? (IS_ENGLISH_CHECKOUT ? "e.g. OR" : "如 OR")
        : (IS_ENGLISH_CHECKOUT ? "e.g. ON" : "如 ON");
      if (regionLabel) {
        regionLabel.textContent = country === "US"
          ? (IS_ENGLISH_CHECKOUT ? "State code (2 letters)" : "州代码（2位）")
          : (IS_ENGLISH_CHECKOUT ? "Province code (2 letters)" : "省代码（2位）");
      }
    } else if (regionLabel) {
      regionLabel.textContent = IS_ENGLISH_CHECKOUT ? "State / Province" : "州 / 省";
    }

    if (country === "US") {
      postal.pattern = "[0-9]{5}(-?[0-9]{4})?";
      postal.placeholder = IS_ENGLISH_CHECKOUT ? "e.g. 97201" : "如 97201";
    }
  }

  function validatePayPalCardBillingAddress() {
    updatePayPalCardBillingRules();
    var country = String($("#ylCardCountry")?.value || "").toUpperCase();
    var region = $("#ylCardRegion");
    var postal = $("#ylCardPostalCode");
    if (region && (country === "US" || country === "CA")) {
      region.value = region.value.trim().toUpperCase();
      if (!/^[A-Z]{2}$/.test(region.value)) {
        region.setCustomValidity(country === "US"
          ? (IS_ENGLISH_CHECKOUT ? "Enter the 2-letter state code, for example OR." : "请填写两位州代码，例如 OR；不要填写中文或州全名。")
          : (IS_ENGLISH_CHECKOUT ? "Enter the 2-letter province code, for example ON." : "请填写两位省代码，例如 ON。"));
      }
    }
    if (postal && country === "US" && !/^[0-9]{5}(?:-?[0-9]{4})?$/.test(postal.value.trim())) {
      postal.setCustomValidity(IS_ENGLISH_CHECKOUT ? "Enter a valid US ZIP code." : "请填写正确的美国邮编，例如 97201。");
    }
  }

  function loadPayPalCardSdk(config) {
    if (window.paypal?.CardFields) return Promise.resolve(window.paypal);
    if (paypalCardState.sdkPromise) return paypalCardState.sdkPromise;
    if (!config?.clientId || !config?.clientToken) {
      return Promise.reject(new Error("PayPal card configuration is incomplete"));
    }

    paypalCardState.sdkPromise = new Promise(function (resolve, reject) {
      var existing = document.getElementById("ylPayPalCardSdk");
      if (existing) existing.remove();
      var currency = /^[A-Z]{3}$/.test(String(config.currency || "")) ? config.currency : "USD";
      var params = new URLSearchParams({
        "client-id": config.clientId,
        components: "card-fields",
        currency: currency,
        intent: "capture"
      });
      var script = document.createElement("script");
      script.id = "ylPayPalCardSdk";
      script.src = "https://www.paypal.com/sdk/js?" + params.toString();
      script.async = true;
      script.setAttribute("data-client-token", config.clientToken);
      script.onload = function () {
        if (window.paypal?.CardFields) resolve(window.paypal);
        else reject(new Error("PayPal CardFields unavailable"));
      };
      script.onerror = function () {
        reject(new Error("PayPal SDK failed to load"));
      };
      document.head.appendChild(script);
    }).catch(function (error) {
      paypalCardState.sdkPromise = null;
      throw error;
    });

    return paypalCardState.sdkPromise;
  }

  async function createPayPalCardOrder() {
    var order = await apiFetch("/api/payments/create-order", {
      method: "POST",
      body: {
        productKey: HEALTH_PRODUCT_KEY,
        provider: "paypal",
        meta: { source: "yl_health_page", checkoutMethod: "card" },
        analytics: window.yuetianGetAnalyticsContext?.() || null
      }
    });
    var session = await apiFetch("/api/payments/create-session", {
      method: "POST",
      body: { orderNo: order.orderNo, payMethod: "card" }
    });
    if (!session?.providerOrderId) throw new Error("PayPal did not return an order ID");

    paymentState.status = "pending";
    paymentState.orderNo = order.orderNo || "";
    paymentState.payUrl = "";
    paymentState.payMethod = "card";
    paymentState.mockMode = false;
    paymentState.product = {
      name: order.productName || HEALTH_PRODUCT_NAME,
      description: order.description || "",
      amountYuan: order.amountYuan || HEALTH_PAYPAL_AMOUNT,
      currency: order.currency || "USD"
    };
    paymentState.message = IS_ENGLISH_CHECKOUT
      ? "Confirming the card with the issuer..."
      : "正在由 PayPal 和发卡行验证银行卡，请稍候…";
    renderPayment();
    return session.providerOrderId;
  }

  async function approvePayPalCardPayment(data) {
    var liabilityShift = String(data?.liabilityShift || "").toUpperCase();
    if (liabilityShift === "NO" || liabilityShift === "UNKNOWN") {
      paymentState.loading = false;
      paymentState.status = "error";
      paymentState.orderNo = "";
      paymentState.message = liabilityShift === "UNKNOWN"
        ? (IS_ENGLISH_CHECKOUT ? "The card issuer verification service is unavailable. Please retry." : "发卡行验证服务暂不可用，请稍后重试。")
        : (IS_ENGLISH_CHECKOUT ? "Card security verification failed. Try another card." : "银行卡安全验证未通过，请换卡或联系发卡行。");
      renderPayment();
      return;
    }

    try {
      var result = await apiFetch("/api/payments/paypal/capture-order", {
        method: "POST",
        body: {
          orderNo: paymentState.orderNo,
          paypalOrderId: data?.orderID || ""
        }
      });
      if (result.status !== "paid") throw new Error("PayPal capture was not completed");
      paymentState.status = "paid";
      paymentState.isMember = true;
      paymentState.message = getMemberRenewalHint(IS_ENGLISH_CHECKOUT ? "Payment complete" : "银行卡支付成功");
      trackHealthPurchase(result);
      await hydratePaymentProduct();
      setPayHint(getMemberRenewalHint(IS_ENGLISH_CHECKOUT ? "Payment complete" : "支付成功"));
    } catch (error) {
      handlePayPalCardFailure(error);
      return;
    } finally {
      paymentState.loading = false;
      renderPayment();
    }
  }

  async function initializePayPalCardFields() {
    if (paypalCardState.ready && paypalCardState.cardFields) return paypalCardState.cardFields;
    if (paypalCardState.initPromise) return paypalCardState.initPromise;
    paypalCardState.initializing = true;
    paypalCardState.initPromise = (async function () {
      var config = await apiFetch("/api/payments/paypal/card-config");
      var paypal = await loadPayPalCardSdk(config);
      var cardFields = paypal.CardFields({
        createOrder: createPayPalCardOrder,
        onApprove: approvePayPalCardPayment,
        onError: handlePayPalCardFailure,
        onCancel: function () {
          paymentState.loading = false;
          paymentState.status = "card_ready";
          paymentState.orderNo = "";
          paymentState.message = IS_ENGLISH_CHECKOUT ? "Card payment cancelled." : "已取消银行卡付款，可重新填写后支付。";
          renderPayment();
        },
        style: {
          input: {
            "font-size": "16px",
            "font-family": "system-ui, -apple-system, Segoe UI, sans-serif",
            color: "#172b4d"
          },
          ".invalid": { color: "#b6251b" }
        }
      });
      if (!cardFields?.isEligible?.()) throw new Error("PayPal CardFields not eligible");

      ["#ylCardNameField", "#ylCardNumberField", "#ylCardExpiryField", "#ylCardCvvField"].forEach(function (selector) {
        document.querySelector(selector)?.replaceChildren();
      });
      await Promise.all([
        cardFields.NameField().render("#ylCardNameField"),
        cardFields.NumberField().render("#ylCardNumberField"),
        cardFields.ExpiryField().render("#ylCardExpiryField"),
        cardFields.CVVField().render("#ylCardCvvField")
      ]);
      paypalCardState.cardFields = cardFields;
      paypalCardState.ready = true;
      return cardFields;
    })().finally(function () {
      paypalCardState.initializing = false;
      paypalCardState.initPromise = null;
    });
    return paypalCardState.initPromise;
  }

  async function openPayPalCardCheckout() {
    if (!PAYPAL_CARD_CHECKOUT_VISIBLE || !PAYPAL_CHECKOUT_VISIBLE) return;
    if (!requireHealthLogin()) return;
    window.yuetianTrack?.("begin_checkout", { surface: "unified_member", checkout_source: "paypal_card" });
    paymentState.panelDismissed = false;
    paymentState.payUrl = "";
    paymentState.payMethod = "card";
    paymentState.orderNo = "";
    setPayHint(getProviderSelectionHint("paypal_card"));

    if (paypalCardState.ready) {
      paymentState.status = "card_ready";
      paymentState.message = IS_ENGLISH_CHECKOUT
        ? "Enter the card and its real billing address."
        : "请填写银行卡及其真实账单地址；不需要 PayPal 账号或美国手机号。";
      renderPayment();
      return;
    }

    paymentState.loading = true;
    paymentState.status = "loading";
    paymentState.message = IS_ENGLISH_CHECKOUT ? "Loading secure card fields..." : "正在加载 PayPal 安全银行卡输入框…";
    renderPayment();
    try {
      await initializePayPalCardFields();
      paymentState.status = "card_ready";
      paymentState.message = IS_ENGLISH_CHECKOUT
        ? "Enter the card and its real billing address."
        : "请填写银行卡及其真实账单地址；不需要 PayPal 账号或美国手机号。";
    } catch (error) {
      handlePayPalCardFailure(error);
      return;
    } finally {
      paymentState.loading = false;
      renderPayment();
    }
  }

  async function submitPayPalCardPayment(event) {
    event.preventDefault();
    if (paymentState.loading || !paypalCardState.ready || !paypalCardState.cardFields) return;
    if (paymentState.status === "pending" && paymentState.orderNo) {
      await refreshHealthPaymentStatus();
      return;
    }
    var form = $("#ylCardCheckout");
    validatePayPalCardBillingAddress();
    if (!form?.checkValidity()) {
      form?.reportValidity();
      paymentState.message = IS_ENGLISH_CHECKOUT
        ? "Complete the billing address exactly as registered with the issuer."
        : "请按发卡行记录完整填写真实账单地址；美国州请填两位代码，如 OR。";
      renderPayment();
      return;
    }

    paymentState.loading = true;
    paymentState.status = "loading";
    paymentState.orderNo = "";
    paymentState.message = IS_ENGLISH_CHECKOUT ? "Connecting securely to PayPal..." : "正在安全连接 PayPal，请勿重复点击…";
    renderPayment();
    try {
      await paypalCardState.cardFields.submit({
        billingAddress: {
          addressLine1: ($("#ylCardAddressLine1")?.value || "").trim(),
          adminArea1: ($("#ylCardRegion")?.value || "").trim(),
          adminArea2: ($("#ylCardCity")?.value || "").trim(),
          countryCode: ($("#ylCardCountry")?.value || "").trim().toUpperCase(),
          postalCode: ($("#ylCardPostalCode")?.value || "").trim()
        }
      });
    } catch (error) {
      handlePayPalCardFailure(error);
    }
  }

  async function startHealthPayment() {
    if (paymentState.loading) return;
    if (isRegisteredFreeCampaign()) {
      if (!readAuthSession()) {
        openHealthAuthPanel(IS_ENGLISH_CHECKOUT
          ? "Sign in or create an account to activate limited-time free access."
          : "请先注册或登录，登录后自动获得限时免费权益。", { reauth: false });
        return;
      }
      await hydratePaymentProduct();
      paymentState.status = "";
      paymentState.message = "";
      renderPayment();
      return;
    }
    if (isPayPalProvider(paymentState.provider) && !PAYPAL_CHECKOUT_VISIBLE) {
      paymentState.provider = "wechat";
      paymentState.status = "";
      paymentState.message = "";
      paymentState.orderNo = "";
      paymentState.payUrl = "";
      paymentState.payMethod = "";
      setPayHint("海外支付暂未开放，请使用微信支付或支付宝。");
      renderPayment();
      return;
    }
    if (paymentState.provider === "paypal_card") {
      await openPayPalCardCheckout();
      return;
    }
    if (paymentState.status === "paid") {
      paymentState.status = "";
      paymentState.message = "正在创建续费订单...";
      paymentState.orderNo = "";
      paymentState.payUrl = "";
      paymentState.payMethod = "";
      paymentState.mockMode = false;
    }
    if (paymentState.status === "pending") {
      paymentState.panelDismissed = false;
      renderPayment();
      if (isRedirectPayment()) {
        if (paymentState.payUrl) window.location.href = paymentState.payUrl;
        return;
      }
      await refreshHealthPaymentStatus();
      return;
    }
    if (!requireHealthLogin()) return;

    if (paymentState.provider === "wechat" && isMobileBrowser() && !isWechatBrowser()) {
      if (readPaymentHandoff()) {
        paymentState.status = "handoff";
        paymentState.payMethod = "handoff";
        paymentState.payUrl = buildPaymentHandoffUrl(readPaymentHandoff());
        var copiedExisting = await copyText(paymentState.payUrl);
        paymentState.message = copiedExisting
          ? "链接已复制。请打开微信，把链接发给自己，再点开链接完成支付。"
          : "请先复制链接，再打开微信，把链接发给自己并点开完成支付。";
        setPayHint("点开后直接拉起微信支付，无需重新登录；链接1小时内有效。");
        renderPayment();
        return;
      }
      await createWechatPaymentHandoff();
      return;
    }

    window.yuetianTrack?.("begin_checkout", { surface: "unified_member", checkout_source: "member_payment" });

    paymentState.loading = true;
    paymentState.status = "loading";
    paymentState.message = "正在创建" + getProviderLabel(paymentState.provider) + HEALTH_PRODUCT_NAME + "订单...";
    updatePaymentBoot("正在打开" + getProviderLabel(paymentState.provider), "账号已识别，正在准备付款，请稍候。", false);
    paymentState.orderNo = "";
    paymentState.payUrl = "";
    paymentState.payMethod = "";
    paymentState.mockMode = false;
    paymentState.panelDismissed = false;
    renderPayment();
    try {
      if (shouldUseWechatJsapi()) {
        paymentState.message = "正在确认微信支付身份...";
        renderPayment();
        var oauth = await apiFetch("/api/payments/wechat/oauth/start", {
          method: "POST",
          body: {}
        });
        if (!oauth.ready) {
          if (!oauth.authorizeUrl) throw new Error("微信授权地址生成失败，请重试");
          window.location.assign(oauth.authorizeUrl);
          return;
        }
      }

      var order = await apiFetch("/api/payments/create-order", {
        method: "POST",
        body: {
          productKey: HEALTH_PRODUCT_KEY,
          provider: paymentState.provider,
          meta: { source: "yl_health_page" },
          analytics: window.yuetianGetAnalyticsContext?.() || null
        }
      });
      var payMethod = getCheckoutPayMethod();
      var session = await apiFetch("/api/payments/create-session", {
        method: "POST",
        body: { orderNo: order.orderNo, payMethod: payMethod }
      });

      paymentState.status = "pending";
      paymentState.orderNo = order.orderNo || "";
      paymentState.provider = session.provider && session.provider !== "mock"
        ? session.provider
        : (order.provider && order.provider !== "mock" ? order.provider : paymentState.provider);
      paymentState.payUrl = session.payUrl || session.qrUrl || "";
      paymentState.payMethod = session.payMethod || payMethod;
      paymentState.mockMode = !!(order.mockMode || session.mockMode);
      paymentState.product = {
        name: order.productName || HEALTH_PRODUCT_NAME,
        description: order.description || "",
        amountYuan: order.amountYuan || HEALTH_PRODUCT_AMOUNT,
        currency: order.currency || "CNY"
      };
      paymentState.message = paymentState.mockMode
        ? "当前为支付测试模式，可点击模拟支付成功完成验证。"
        : (paymentState.payMethod === "jsapi"
          ? "正在打开微信支付..."
          : (paymentState.provider === "alipay" && paymentState.payMethod === "native" && isMobileBrowser()
          ? "请截图保存二维码，再打开支付宝扫一扫，从相册选择二维码完成付款。"
          : (isRedirectPayment()
          ? "请打开" + getProviderLabel(paymentState.provider) + "完成支付，支付后返回刷新状态。"
          : "请使用" + getProviderLabel(paymentState.provider) + "扫码支付，完成后刷新状态。")));

      if (paymentState.provider === "paypal" && paymentState.payMethod === "redirect") {
        paymentState.message = IS_ENGLISH_CHECKOUT
          ? "PayPal will check the buyer and merchant countries before payment. If PayPal declines the transaction, return here and choose another available method."
          : "PayPal 会在付款前核验买家和商户注册地。如果 PayPal 拒绝这笔交易，请返回本页改用其他可用支付方式。";
        setPayHint(getProviderSelectionHint("paypal"));
      }

      if (paymentState.provider === "alipay" && paymentState.payMethod === "h5" && paymentState.payUrl) {
        updatePaymentBoot("正在打开支付宝", "请在支付宝内完成付款，支付后将自动返回。", false);
        window.location.assign(paymentState.payUrl);
        return;
      }

      if (paymentState.payMethod === "jsapi") {
        var jsapiResult = await invokeWechatJsapi(session.jsapiParams);
        if (jsapiResult === "success") {
          paymentState.message = "已完成微信支付，正在确认开通状态...";
          updatePaymentBoot("正在确认付款", "付款已完成，正在开通会员权益。", false);
          window.setTimeout(function () { refreshHealthPaymentStatus(); }, 900);
        } else if (jsapiResult === "cancel") {
          paymentState.status = "";
          paymentState.message = "已取消微信支付，可再次点击开通。";
          releasePaymentBoot();
        } else {
          paymentState.status = "";
          paymentState.message = "微信支付未完成，请重新发起支付。";
          releasePaymentBoot();
        }
      }
    } catch (error) {
      if (isHealthLoginRequiredError(error)) {
        showHealthLoginRequired();
      } else if (paymentState.provider === "alipay" && isAlipayPermissionIssue(error)) {
        paymentState.status = "error";
        paymentState.message = "支付宝二维码生成失败，请稍后重试。";
        setPayHint("支付方式仍为支付宝，不会自动切换其他渠道。");
      } else {
        paymentState.status = "error";
        paymentState.message = error.message || "支付订单创建失败";
        setPayHint(paymentState.provider === "alipay"
          ? "支付方式仍为支付宝，不会自动切换其他渠道。"
          : "如果支付方式不可用，可以先换微信支付或稍后重试。");
      }
      releasePaymentBoot();
    } finally {
      paymentState.loading = false;
      renderPayment();
    }
  }

  async function refreshHealthPaymentStatus() {
    if (!paymentState.orderNo || paymentState.loading) return;
    paymentState.loading = true;
    paymentState.message = "正在刷新支付状态...";
    renderPayment();
    try {
      var data = await apiFetch("/api/payments/order-status?orderNo=" + encodeURIComponent(paymentState.orderNo));
      paymentState.status = data.status || paymentState.status;
      if (paymentState.status === "paid") {
        paymentState.isMember = true;
        trackHealthPurchase(data);
        await hydratePaymentProduct();
        updatePaymentBoot(
          "支付成功",
          "会员权益已更新。可切回原浏览器继续，页面会自动更新；也可留在微信内使用。",
          true
        );
      } else {
        releasePaymentBoot();
      }
      if (data.status === "paid") {
        paymentState.message = getMemberRenewalHint("支付已完成");
      } else if (data.payment?.code && data.payment.code !== "PAYPAL_CAPTURE_PENDING") {
        paymentState.status = "error";
        paymentState.message = data.payment.message || getPayPalCardErrorMessage({ code: data.payment.code });
      } else if (data.payment?.message) {
        paymentState.status = "pending";
        paymentState.message = data.payment.message;
      } else {
        paymentState.message = "暂未确认支付成功，请完成付款后再刷新。";
      }
    } catch (error) {
      paymentState.message = error.message || "支付状态查询失败";
      releasePaymentBoot();
    } finally {
      paymentState.loading = false;
      renderPayment();
    }
  }

  async function completeMockPayment() {
    if (!paymentState.orderNo || paymentState.loading) return;
    paymentState.loading = true;
    paymentState.message = "正在确认测试支付...";
    renderPayment();
    try {
      var data = await apiFetch("/api/payments/mock/complete", {
        method: "POST",
        body: { orderNo: paymentState.orderNo }
      });
      paymentState.status = data.status || "paid";
      paymentState.isMember = paymentState.status === "paid";
      if (paymentState.isMember) trackHealthPurchase(data);
      if (paymentState.isMember) await hydratePaymentProduct();
      paymentState.message = getMemberRenewalHint("支付测试成功");
    } catch (error) {
      paymentState.message = error.message || "测试支付失败";
    } finally {
      paymentState.loading = false;
      renderPayment();
    }
  }

  function bindEvents() {
    $("#ylGenerateBtn").addEventListener("click", generateReport);
    $("#ylNextBtn").addEventListener("click", goNextCategory);
    $("#ylResetBtn").addEventListener("click", resetAssessment);
    $("#ylChatForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var input = $("#ylChatInput");
      ask(input.value);
      input.value = "";
    });
  }

  function bindPaymentEvents() {
    $all(".yl-plan-option").forEach(function (button) {
      button.addEventListener("click", function () {
        selectMemberProduct(button.dataset.productKey || "monthly_member");
      });
    });
    $all(".yl-pay-method").forEach(function (button) {
      button.addEventListener("click", function () {
        if (paymentState.loading || paymentState.status === "pending") return;
        var provider = button.dataset.provider || "wechat";
        if (provider === "alipay" && !ALIPAY_CHECKOUT_ENABLED) return;
        if (provider === "paypal" && !PAYPAL_CHECKOUT_VISIBLE) return;
        if (provider === "paypal_card" && (!PAYPAL_CHECKOUT_VISIBLE || !PAYPAL_CARD_CHECKOUT_VISIBLE)) return;
        var previousProvider = paymentState.provider;
        paymentState.provider = provider;
        if (paymentState.status === "handoff") {
          paymentState.status = "";
          paymentState.message = "";
          paymentState.payUrl = "";
          paymentState.payMethod = "";
          setPayHint("");
        }
        if (provider !== previousProvider && !paymentState.orderNo) {
          paymentState.status = "";
          paymentState.message = "";
          paymentState.payUrl = "";
          paymentState.payMethod = "";
          paymentState.panelDismissed = true;
        }
        var meta = getProviderMeta(paymentState.provider);
        if (meta.currency) {
          paymentState.product = Object.assign({}, paymentState.product || {}, {
            amountYuan: meta.amountYuan || paymentState.product?.amountYuan,
            currency: meta.currency
          });
        }
        setPayHint(getProviderSelectionHint(paymentState.provider));
        renderPayment();
      });
    });
    $("#ylOpenPayBtn").addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      startHealthPayment();
    }, true);
    $("#ylCampaignAccessBtn").addEventListener("click", function () {
      if (!readAuthSession()) {
        openHealthAuthPanel(IS_ENGLISH_CHECKOUT
          ? "Sign in or create an account to activate limited-time free access."
          : "请注册或登录，登录后自动获得限时免费权益。", { reauth: false });
        return;
      }
      if (memberCheckoutContext?.returnPath) window.location.href = memberCheckoutContext.returnPath;
      else goToPage("home", { instant: true });
    });
    $("#ylCopyConsultantWechat").addEventListener("click", async function () {
      var copied = await copyText("kcqc1688");
      var status = $("#ylHumanCopyStatus");
      if (status) status.textContent = copied ? "微信号已复制：kcqc1688" : "请手动复制微信号：kcqc1688";
    });
    $("#ylRefreshPayBtn").addEventListener("click", refreshHealthPaymentStatus);
    $("#ylPaymentCloseBtn").addEventListener("click", closeHealthPaymentPanel);
    $("#ylMockPayBtn").addEventListener("click", completeMockPayment);
    $("#ylCardCheckout").addEventListener("submit", submitPayPalCardPayment);
    $("#ylCardCountry").addEventListener("change", updatePayPalCardBillingRules);
    $("#ylCardRegion").addEventListener("input", function (event) {
      var country = String($("#ylCardCountry")?.value || "").toUpperCase();
      if (country === "US" || country === "CA") event.currentTarget.value = event.currentTarget.value.toUpperCase();
      event.currentTarget.setCustomValidity("");
    });
    $("#ylCardPostalCode").addEventListener("input", function (event) {
      event.currentTarget.setCustomValidity("");
    });
    updatePayPalCardBillingRules();
    $("#ylCopyWechatLinkBtn").addEventListener("click", async function () {
      if (readAuthSession() && hasHealthPaymentAuth()) {
        await createWechatPaymentHandoff();
        return;
      }
      var copied = await copyText(paymentState.payUrl);
      paymentState.message = copied
        ? "链接已复制。请打开微信，把链接发给自己，再点开链接完成支付。"
        : "复制失败，请长按链接复制；再打开微信，把链接发给自己并点开完成支付。";
      renderPayment();
    });
    $("#ylPaymentBootContinue").addEventListener("click", function () {
      releasePaymentBoot();
    });
    $("#ylHealthLoginModeBtn").addEventListener("click", function () { setHealthAuthMode("login"); });
    $("#ylHealthRegisterModeBtn").addEventListener("click", function () { setHealthAuthMode("register"); });
    $("#ylHealthRecoveryBtn").addEventListener("click", requestHealthPasswordRecovery);
    $("#ylAccountTrigger").addEventListener("click", function (event) { openAccountCenter(event.currentTarget); });
    $("#ylMobileAccountTrigger").addEventListener("click", function (event) { openAccountCenter(event.currentTarget); });
    $("#ylCheckoutAccountBtn").addEventListener("click", function (event) {
      if (readAuthSession() && !hasHealthPaymentAuth()) {
        openHealthAuthPanel(IS_ENGLISH_CHECKOUT
          ? "Enter your password to confirm this payment account."
          : "为保护会员归属，请输入当前账号密码确认后继续付款。", {
          reauth: true,
          returnFocus: event.currentTarget
        });
        return;
      }
      openAccountCenter(event.currentTarget);
    });
    $("#ylAccountCloseBtn").addEventListener("click", closeAccountDialog);
    $("#ylHealthGoPayBtn").addEventListener("click", goToMemberFromAccount);
    $("#ylHealthSwitchAccountBtn").addEventListener("click", switchHealthPaymentAccount);
    $("#ylHealthLogoutBtn").addEventListener("click", logoutHealthAccount);
    $("#ylHealthAuthPanel").addEventListener("submit", function (event) {
      event.preventDefault();
      submitHealthAuth();
    });
    $("#ylAccountOverlay").addEventListener("click", function (event) {
      if (event.target === event.currentTarget) closeAccountDialog();
    });
    document.addEventListener("keydown", function (event) {
      if (isAccountDialogOpen()) {
        if (event.key === "Escape") {
          closeAccountDialog();
          return;
        }
        if (event.key !== "Tab") return;
        var accountFocusable = $all("#ylAccountOverlay button:not([disabled]), #ylAccountOverlay input:not([disabled]), #ylAccountOverlay a[href]")
          .filter(function (element) { return !element.closest("[hidden]"); });
        if (!accountFocusable.length) return;
        var accountFirst = accountFocusable[0];
        var accountLast = accountFocusable[accountFocusable.length - 1];
        if (event.shiftKey && document.activeElement === accountFirst) {
          event.preventDefault();
          accountLast.focus();
        } else if (!event.shiftKey && document.activeElement === accountLast) {
          event.preventDefault();
          accountFirst.focus();
        }
        return;
      }
      if (!isHealthPaymentPanelOpen()) return;
      if (event.key === "Escape") {
        closeHealthPaymentPanel();
        return;
      }
      if (event.key !== "Tab") return;
      var focusable = $all("#ylPaymentPanel button:not([disabled]):not([hidden]), #ylPaymentPanel a[href]:not([hidden]), #ylPaymentPanel input:not([disabled]), #ylPaymentPanel select:not([disabled]), #ylPaymentPanel iframe")
        .filter(function (element) { return !element.closest("[hidden]"); });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    document.addEventListener("click", function (event) {
      var panel = $("#ylPaymentPanel");
      if (!panel || panel.hidden || panel.contains(event.target)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeHealthPaymentPanel();
    }, true);
    if (!paymentHandoffCaptured) hydratePaymentProduct();
    else {
      renderPayment();
      setPayHint("");
    }
  }

  function renderAll() {
    renderProgress();
    renderCategories();
    renderQuestion();
    renderSelectedSummary();
    renderReport();
    renderChatIntro();
  }

  var paymentHandoffCaptured = !!window.__YUETIAN_PAYMENT_HANDOFF_CAPTURED__ || capturePaymentHandoff();
  initializeMemberCheckoutContext();
  applyEnglishMemberCheckoutCopy();
  loadState();
  normalizeSelections();
  state.report = state.report || calculateReport();
  bindEvents();
  bindPaymentEvents();
  renderAll();
  setActivePage(pageFromHash(), { instant: true });
  if (paymentHandoffCaptured && isWechatBrowser()) {
    paymentState.message = "账号已识别，正在打开微信支付...";
    setActivePage("member", { instant: true });
    startHealthPayment();
  } else {
    if (!handlePayPalReturn()) handleWechatOauthReturn();
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && readAuthSession() && !paymentState.loading) {
      hydratePaymentProduct();
    }
  });
  window.addEventListener("pageshow", function (event) {
    if (event.persisted && readAuthSession() && !paymentState.loading) hydratePaymentProduct();
  });
  window.addEventListener("storage", function (event) {
    if (event.key !== AUTH_SESSION_KEY) return;
    if (!readAuthSession()) {
      clearPaymentConfirmation();
      state.quota = null;
      paymentState.isMember = false;
      paymentState.membershipLoaded = false;
      paymentState.memberExpiresAt = "";
      renderPayment();
      return;
    }
    hydratePaymentProduct();
  });
  window.addEventListener("hashchange", function () {
    setActivePage(pageFromHash());
  });
})();
