(function () {
  "use strict";

  var STORAGE_KEY = "yuetian-health-assessment-v1";
  // Reuse the primary app browser id so health and chart chats share one quota.
  var CLIENT_ID_KEY = "ziwei_client_id";
  var GUEST_ASK_LIMIT = 3;
  var FREE_ASK_LIMIT = 8;
  var MEMBER_ASK_LIMIT = 80;
  var AUTH_SESSION_KEY = "wentian-app-auth-session-v1";
  var HEALTH_PRODUCT_KEY = "monthly_member";
  var HEALTH_PRODUCT_NAME = "阅天综合会员";
  var HEALTH_PRODUCT_AMOUNT = "19.90";
  var HEALTH_PAYPAL_AMOUNT = "2.99";
  var PAGE_IDS = ["home", "assessment", "report", "chat", "member"];
  var DEFAULT_API_BASE = "https://api.yuetianai.com";

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
    providers: [],
    product: null,
    message: ""
  };
  var healthAuthState = {
    loading: false,
    panelOpen: false,
    tone: "",
    message: ""
  };

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
    return normalizePage((window.location.hash || "#home").replace(/^#/, ""));
  }

  function setActivePage(page, options) {
    var active = normalizePage(page);
    var opts = options || {};
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

  function getAuthToken() {
    var session = readAuthSession();
    return session && session.access_token ? session.access_token : "";
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

  function normalizeHealthAuthError(message) {
    var text = String(message || "").trim();
    if (!text) return "登录失败，请稍后再试";
    if (/invalid login credentials|invalid credentials|wrong password|密码错误|密码有误/i.test(text)) {
      return "密码有误，请重新输入";
    }
    return text;
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
    var token = opts.noAuth ? "" : getAuthToken();
    if (token) headers.Authorization = "Bearer " + token;
    var url = /^https?:\/\//i.test(path) ? path : getHealthApiBase() + path;
    var response = await fetch(url, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    var text = await response.text();
    var data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (_error) {
      data = { error: text || "服务暂时不可用" };
    }
    if (!response.ok || data.error) throw new Error(data.error || "服务暂时不可用");
    return data;
  }

  function isH5PayPreferred() {
    return /MicroMessenger|Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
  }

  function getProviderLabel(provider) {
    if (provider === "paypal") return "PayPal";
    if (provider === "alipay") return "支付宝";
    return "微信支付";
  }

  function getProviderMeta(provider) {
    var fallback = {
      provider: provider,
      label: getProviderLabel(provider),
      enabled: true,
      amountYuan: provider === "paypal" ? HEALTH_PAYPAL_AMOUNT : HEALTH_PRODUCT_AMOUNT,
      currency: provider === "paypal" ? "USD" : "CNY"
    };
    var list = Array.isArray(paymentState.providers) ? paymentState.providers : [];
    if (!list.length) return fallback;
    return list.find(function (item) {
      return item.provider === provider;
    }) || fallback;
  }

  function getPaymentAmountLabel() {
    var product = paymentState.product || {};
    var providerMeta = getProviderMeta(paymentState.provider);
    var amount = providerMeta.amountYuan || product.amountYuan || HEALTH_PRODUCT_AMOUNT;
    var currency = providerMeta.currency || product.currency;
    if (paymentState.provider === "paypal" || currency === "USD") return "$" + amount;
    return "¥" + amount;
  }

  function setPayHint(text) {
    var el = $("#ylPayHint");
    if (el) el.textContent = text || "";
  }

  function isHealthMember() {
    return paymentState.isMember || paymentState.status === "paid";
  }

  function updateAskQuota() {
    var quota = state.quota || {};
    var hasSession = !!readAuthSession();
    var isMember = isHealthMember() || quota.isMember || quota.plan === "member";
    var isGuest = quota.plan === "guest" || (!hasSession && !quota.plan && !quota.dailyLimit && !quota.limit);
    var fallbackLimit = isMember ? MEMBER_ASK_LIMIT : (isGuest ? GUEST_ASK_LIMIT : FREE_ASK_LIMIT);
    var limit = Number(quota.dailyLimit || quota.limit || fallbackLimit);
    var remaining = quota.dailyRemaining ?? quota.remaining;
    var label = isMember ? "会员 " + limit + "条/天" : (isGuest ? "体验 " + limit + "条/天" : "免费 " + limit + "条/天");
    if (typeof remaining === "number") label += " · 剩余 " + Math.max(0, remaining);
    if (!isMember && typeof remaining === "number" && remaining <= 0) label = "开通会员 " + MEMBER_ASK_LIMIT + "条/天";

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
      var isMember = isHealthMember() || quota.isMember || quota.plan === "member";
      var isGuest = quota.plan === "guest" || (!hasSession && !quota.plan && !quota.dailyLimit && !quota.limit);
      var fallbackLimit = isMember ? MEMBER_ASK_LIMIT : (isGuest ? GUEST_ASK_LIMIT : FREE_ASK_LIMIT);
      var limit = Number(quota.dailyLimit || quota.limit || fallbackLimit);
      var remaining = quota.dailyRemaining ?? quota.remaining;
      miniQuota.textContent = typeof remaining === "number"
        ? "追问额度：" + Math.max(0, remaining) + "/" + limit + "条"
        : "追问额度：" + limit + "条/天";
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
      if (state.quota && typeof state.quota.dailyUsed === "number") state.askCount = state.quota.dailyUsed;
      appendChatMessage("assistant", data.reply || buildAnswer(text, primary));
      if (data.quotaExceeded) {
        setPayHint("免费追问已用完，可开通阅天综合会员提升到 " + MEMBER_ASK_LIMIT + "条/天。");
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
    if (!paymentState.payUrl || paymentState.payMethod === "h5" || paymentState.provider === "paypal" || paymentState.mockMode) {
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
    $all(".yl-pay-method").forEach(function (button) {
      var provider = button.dataset.provider || "wechat";
      var meta = getProviderMeta(provider);
      button.classList.toggle("is-active", paymentState.provider === provider);
      button.disabled = paymentState.loading || paymentState.status === "pending" || !meta.enabled;
      button.textContent = meta.enabled ? getProviderLabel(provider) : getProviderLabel(provider) + "未配置";
    });

    var productName = HEALTH_PRODUCT_NAME;
    var amount = getPaymentAmountLabel();
    var memberPrice = $("#ylMemberPrice");
    if (memberPrice) memberPrice.textContent = amount;
    var openButton = $("#ylOpenPayBtn");
    if (openButton) {
      openButton.disabled = paymentState.loading;
      if (paymentState.loading) openButton.textContent = "处理中...";
      else if (paymentState.status === "paid") openButton.textContent = "已开通阅天综合会员";
      else if (paymentState.status === "pending" && paymentState.payMethod === "h5") openButton.textContent = "打开" + getProviderLabel(paymentState.provider);
      else if (paymentState.status === "pending") openButton.textContent = "我已支付，刷新状态";
      else openButton.textContent = "确认开通" + productName + " " + amount;
    }

    var panel = $("#ylPaymentPanel");
    if (panel) panel.hidden = !paymentState.status && !paymentState.message;
    var status = $("#ylPaymentStatus");
    if (status) status.textContent = paymentState.message || "请选择支付方式后创建订单。";
    var code = $("#ylPaymentCode");
    if (code) code.hidden = !paymentState.orderNo;
    var orderNo = $("#ylPaymentOrderNo");
    if (orderNo) orderNo.textContent = paymentState.orderNo ? "订单号：" + paymentState.orderNo : "";

    var link = $("#ylPaymentLink");
    if (link) {
      var showLink = !!paymentState.payUrl && !paymentState.mockMode;
      link.hidden = !showLink;
      link.href = paymentState.payUrl || "#";
      link.textContent = paymentState.provider === "paypal" || paymentState.payMethod === "h5"
        ? "打开" + getProviderLabel(paymentState.provider)
        : "支付链接备用打开";
    }

    var refresh = $("#ylRefreshPayBtn");
    if (refresh) refresh.hidden = !paymentState.orderNo || paymentState.status === "paid";
    var mock = $("#ylMockPayBtn");
    if (mock) mock.hidden = !(paymentState.mockMode && paymentState.orderNo && paymentState.status !== "paid");

    renderPaymentQr();
    renderHealthAuthPanel();
    if (paymentState.status === "paid") {
      setPayHint("已开通阅天综合会员，后续报告和追问额度会绑定到当前账号。");
      updateAskQuota();
    }
  }

  function setHealthAuthStatus(message, tone) {
    healthAuthState.message = message || "";
    healthAuthState.tone = tone || "";
    renderHealthAuthPanel();
  }

  function renderHealthAuthPanel() {
    var panel = $("#ylHealthAuthPanel");
    if (!panel) return;
    panel.hidden = !healthAuthState.panelOpen || !!readAuthSession();
    var status = $("#ylHealthAuthStatus");
    if (status) {
      status.textContent = healthAuthState.message || "";
      status.dataset.tone = healthAuthState.tone || "";
    }
    ["#ylHealthLoginBtn", "#ylHealthRegisterBtn"].forEach(function (selector) {
      var button = $(selector);
      if (button) button.disabled = healthAuthState.loading;
    });
    var loginButton = $("#ylHealthLoginBtn");
    if (loginButton) loginButton.textContent = healthAuthState.loading ? "处理中..." : "登录并支付";
  }

  function openHealthAuthPanel() {
    healthAuthState.panelOpen = true;
    paymentState.status = "login";
    paymentState.message = "请先登录或注册阅天账号，随后本页继续支付。";
    renderPayment();
    window.setTimeout(function () {
      var panel = $("#ylHealthAuthPanel");
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
      var input = $("#ylHealthAuthAccount");
      if (input) input.focus({ preventScroll: true });
    }, 30);
  }

  async function submitHealthAuth(mode) {
    if (healthAuthState.loading) return;
    var account = ($("#ylHealthAuthAccount")?.value || "").trim();
    var password = $("#ylHealthAuthPassword")?.value || "";
    var registering = mode === "register";
    var usingEmail = /@/.test(account);
    if (!account) {
      setHealthAuthStatus(registering ? "注册请填写手机号" : "请输入手机号或邮箱", "error");
      return;
    }
    if (registering && usingEmail) {
      setHealthAuthStatus("注册请填写手机号；邮箱账号请直接登录。", "error");
      return;
    }
    if (password.length < 6) {
      setHealthAuthStatus("密码至少 6 位", "error");
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
        }).catch(function (error) {
          if (!/已注册|already|exists/i.test(error.message || "")) throw error;
          return null;
        });
        registered = !!data?.session;
      }
      if (!data?.session) {
        data = await apiFetch("/api/auth/password-login", {
          method: "POST",
          noAuth: true,
          body: { account: account, password: password }
        });
      }
      if (!saveHealthAuthSession(data?.session)) throw new Error("登录状态保存失败");
      window.yuetianTrack?.(registered ? "sign_up" : "login", { method: "password", surface: "unified_member" });
      healthAuthState.panelOpen = false;
      healthAuthState.loading = false;
      setHealthAuthStatus("登录成功，正在创建阅天综合会员订单...", "ok");
      paymentState.status = "";
      paymentState.message = "登录成功，正在创建阅天综合会员订单...";
      await hydratePaymentProduct();
      await startHealthPayment();
    } catch (error) {
      healthAuthState.loading = false;
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
    try {
      var data = await apiFetch("/api/payments/member-status?productKey=" + encodeURIComponent(HEALTH_PRODUCT_KEY));
      if (data.product) paymentState.product = data.product;
      if (data.quota) state.quota = data.quota;
      paymentState.isMember = !!data.productEntitlement?.isMember;
      if (data.productEntitlement?.isMember) {
        paymentState.status = "paid";
        paymentState.message = "当前账号已开通阅天综合会员。";
      }
      if (Array.isArray(data.providers)) {
        paymentState.providers = data.providers;
        var selected = data.providers.find(function (item) {
          return item.provider === paymentState.provider;
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
    if (readAuthSession()) return true;
    openHealthAuthPanel();
    return false;
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

  async function startHealthPayment() {
    if (paymentState.loading) return;
    if (paymentState.status === "paid") return;
    if (paymentState.status === "pending") {
      if (paymentState.payMethod === "h5" || paymentState.provider === "paypal") {
        if (paymentState.payUrl) window.location.href = paymentState.payUrl;
        return;
      }
      await refreshHealthPaymentStatus();
      return;
    }
    if (!requireHealthLogin()) return;
    window.yuetianTrack?.("begin_checkout", { surface: "unified_member", checkout_source: "member_payment" });

    paymentState.loading = true;
    paymentState.status = "loading";
    paymentState.message = "正在创建" + getProviderLabel(paymentState.provider) + "阅天综合会员订单...";
    paymentState.orderNo = "";
    paymentState.payUrl = "";
    paymentState.payMethod = "";
    paymentState.mockMode = false;
    renderPayment();
    try {
      var order = await apiFetch("/api/payments/create-order", {
        method: "POST",
        body: {
          productKey: HEALTH_PRODUCT_KEY,
          provider: paymentState.provider,
          meta: { source: "yl_health_page" },
          analytics: window.yuetianGetAnalyticsContext?.() || null
        }
      });
      var payMethod = paymentState.provider === "paypal" ? "redirect" : (isH5PayPreferred() ? "h5" : "native");
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
        : (paymentState.payMethod === "h5" || paymentState.provider === "paypal"
          ? "请打开" + getProviderLabel(paymentState.provider) + "完成支付，支付后返回刷新状态。"
          : "请使用" + getProviderLabel(paymentState.provider) + "扫码支付，完成后刷新状态。");
    } catch (error) {
      paymentState.status = "error";
      paymentState.message = error.message || "支付订单创建失败";
      setPayHint("如果支付方式不可用，可以先换微信支付或稍后重试。");
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
      }
      paymentState.message = data.status === "paid"
        ? "支付已完成，阅天综合会员已开通。"
        : "暂未确认支付成功，请完成付款后再刷新。";
    } catch (error) {
      paymentState.message = error.message || "支付状态查询失败";
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
      paymentState.message = "支付测试成功，阅天综合会员已开通。";
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
    $all(".yl-pay-method").forEach(function (button) {
      button.addEventListener("click", function () {
        if (paymentState.loading || paymentState.status === "pending") return;
        paymentState.provider = button.dataset.provider || "wechat";
        var meta = getProviderMeta(paymentState.provider);
        if (meta.currency) {
          paymentState.product = Object.assign({}, paymentState.product || {}, {
            amountYuan: meta.amountYuan || paymentState.product?.amountYuan,
            currency: meta.currency
          });
        }
        renderPayment();
      });
    });
    $("#ylOpenPayBtn").addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      startHealthPayment();
    }, true);
    $("#ylRefreshPayBtn").addEventListener("click", refreshHealthPaymentStatus);
    $("#ylMockPayBtn").addEventListener("click", completeMockPayment);
    $("#ylHealthLoginBtn").addEventListener("click", function () {
      submitHealthAuth("login");
    });
    $("#ylHealthRegisterBtn").addEventListener("click", function () {
      submitHealthAuth("register");
    });
    $("#ylHealthAuthPanel").addEventListener("submit", function (event) {
      event.preventDefault();
      submitHealthAuth("login");
    });
    if (readAuthSession()) hydratePaymentProduct();
    else {
      renderPayment();
      setPayHint("可在本页登录并开通阅天综合会员。");
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

  loadState();
  normalizeSelections();
  state.report = state.report || calculateReport();
  bindEvents();
  bindPaymentEvents();
  renderAll();
  setActivePage(pageFromHash(), { instant: true });
  window.addEventListener("hashchange", function () {
    setActivePage(pageFromHash());
  });
})();
