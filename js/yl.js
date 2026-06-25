(function () {
  "use strict";

  var STORAGE_KEY = "yuetian-health-assessment-v1";
  var FREE_ASK_LIMIT = 3;

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
    askCount: 0
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
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
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function selectedCount() {
    return Object.keys(state.selections).filter(function (key) {
      return state.selections[key];
    }).length;
  }

  function renderProgress() {
    var count = selectedCount();
    var percent = Math.round((count / categories.length) * 100);
    $("#ylProgressText").textContent = count + "/" + categories.length + " 已填写";
    $("#ylProgressBar").style.width = percent + "%";
    $("#ylGenerateBtn").disabled = count < categories.length;
    $("#ylGenerateBtn").textContent = count < categories.length ? "完成 8 类后生成报告" : "生成体质自评报告";
  }

  function renderCategories() {
    var wrap = $("#ylCategoryGrid");
    var switcher = $("#ylCategorySwitcher");
    wrap.innerHTML = "";
    switcher.innerHTML = "";
    categories.forEach(function (category, index) {
      var selected = state.selections[category.id];
      var button = document.createElement("button");
      button.type = "button";
      button.className = "yl-category-card" + (state.currentIndex === index ? " is-active" : "") + (selected ? " is-filled" : "");
      button.innerHTML =
        '<span class="yl-category-icon">' + category.icon + "</span>" +
        "<strong>" + category.name + "</strong>" +
        "<small>" + (selected ? selected.label : category.prompt) + "</small>";
      button.addEventListener("click", function () {
        state.currentIndex = index;
        saveState();
        renderAll();
      });
      wrap.appendChild(button);

      var switchButton = document.createElement("button");
      switchButton.type = "button";
      switchButton.className = "yl-switch-btn" + (state.currentIndex === index ? " is-active" : "");
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
    var selected = state.selections[category.id];
    $("#ylQuestionIndex").textContent = String(state.currentIndex + 1).padStart(2, "0");
    $("#ylQuestionTitle").textContent = category.name;
    $("#ylQuestionHint").textContent = category.prompt;

    var wrap = $("#ylOptionGrid");
    wrap.innerHTML = "";
    category.options.forEach(function (option) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "yl-option-chip" + (selected && selected.label === option.label ? " is-selected" : "");
      button.textContent = option.label;
      button.addEventListener("click", function () {
        state.selections[category.id] = option;
        if (state.currentIndex < categories.length - 1) {
          state.currentIndex += 1;
        }
        state.report = calculateReport();
        saveState();
        renderAll();
      });
      wrap.appendChild(button);
    });
  }

  function calculateReport() {
    var scores = {};
    Object.keys(typeMeta).forEach(function (key) {
      scores[key] = 0;
    });

    Object.keys(state.selections).forEach(function (key) {
      var item = state.selections[key];
      if (!item) return;
      scores[item.type] = (scores[item.type] || 0) + item.weight;
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

  function renderChatIntro() {
    var log = $("#ylChatLog");
    var suggestions = $("#ylSuggestions");
    var report = state.report || calculateReport();
    var primary = typeMeta[report.primary];

    $("#ylAskQuota").textContent = state.askCount >= FREE_ASK_LIMIT ? "会员可深聊" : "免费 " + (FREE_ASK_LIMIT - state.askCount) + " 次";
    $("#ylChatTitle").textContent = "围绕" + primary.name + "继续追问";

    suggestions.innerHTML = "";
    [
      "睡眠怎么先调整？",
      "脾胃和饮食怎么观察？",
      "手脚冷热说明什么？",
      "我每天复盘看什么？"
    ].forEach(function (text) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = text;
      button.addEventListener("click", function () {
        ask(text);
      });
      suggestions.appendChild(button);
    });

    if (log.children.length > 0) return;
    var bubble = document.createElement("div");
    bubble.className = "yl-message is-ai";
    bubble.textContent = "我会基于这份体质自评报告继续追问。你可以问睡眠、脾胃、情绪、腰腿或手脚冷热怎么观察。";
    log.appendChild(bubble);
  }

  function ask(question) {
    var text = (question || "").trim();
    if (!text) return;

    var report = state.report || calculateReport();
    var primary = typeMeta[report.primary];
    var log = $("#ylChatLog");

    var user = document.createElement("div");
    user.className = "yl-message is-user";
    user.textContent = text;
    log.appendChild(user);

    var ai = document.createElement("div");
    ai.className = "yl-message is-ai";
    ai.textContent = buildAnswer(text, primary);
    log.appendChild(ai);
    log.scrollTop = log.scrollHeight;

    state.askCount += 1;
    $("#ylAskQuota").textContent = state.askCount >= FREE_ASK_LIMIT ? "会员可深聊" : "免费 " + (FREE_ASK_LIMIT - state.askCount) + " 次";
    saveState();
  }

  function buildAnswer(question, primary) {
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

  function generateReport() {
    state.report = calculateReport();
    saveState();
    renderReport();
    $("#report").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetAssessment() {
    state.currentIndex = 0;
    state.selections = {};
    state.report = calculateReport();
    state.askCount = 0;
    localStorage.removeItem(STORAGE_KEY);
    $("#ylChatLog").innerHTML = "";
    renderAll();
  }

  function bindEvents() {
    $("#ylGenerateBtn").addEventListener("click", generateReport);
    $("#ylResetBtn").addEventListener("click", resetAssessment);
    $("#ylChatForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var input = $("#ylChatInput");
      ask(input.value);
      input.value = "";
    });
    $("#ylOpenPayBtn").addEventListener("click", function () {
      $("#ylPayHint").textContent = "已确认健康会员商品。下一步接入统一支付接口时，将从这里创建健康会员订单。";
      $("#member").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function renderAll() {
    renderProgress();
    renderCategories();
    renderQuestion();
    renderReport();
    renderChatIntro();
  }

  loadState();
  state.report = state.report || calculateReport();
  bindEvents();
  renderAll();
})();
