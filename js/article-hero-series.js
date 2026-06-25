(() => {
  const palaces = [
    ["ziwei-minggong.html", "命宫", "01"],
    ["ziwei-xiongdigong.html", "兄弟宫", "02"],
    ["ziwei-fuqigong.html", "夫妻宫", "03"],
    ["ziwei-zinvgong.html", "子女宫", "04"],
    ["ziwei-caibogong.html", "财帛宫", "05"],
    ["ziwei-jiegong.html", "疾厄宫", "06"],
    ["ziwei-qianyigong.html", "迁移宫", "07"],
    ["ziwei-puyigong.html", "仆役宫", "08"],
    ["ziwei-guanlugong.html", "官禄宫", "09"],
    ["ziwei-tianzhaigong.html", "田宅宫", "10"],
    ["ziwei-fudegong.html", "福德宫", "11"],
    ["ziwei-fumugong.html", "父母宫", "12"],
  ].map(([slug, label, serial]) => ({ slug, label, serial }));

  const custom = {
    "ziwei-sanfang-sizheng.html": ["看盘方法", "三方四正", "M1"],
    "ziwei-shengong.html": ["看盘方法", "身宫", "M2"],
    "ziwei-gongxing.html": ["流年入门", "宫性", "G1"],
    "ziwei-kequanlu.html": ["星曜入门", "科权禄", "H1"],
    "mianfei-ziwei-paipan-hou-xian-kan-shenme.html": ["实用指南", "先看什么", "U1"],
    "ai-ziwei-paipan-zenme-xuan.html": ["实用指南", "怎么选", "U2"],
    "ai-suanming-wangzhan-zenme-xuan.html": ["实用指南", "算命网站", "U3"],
    "yuetianai-shi-shenme.html": ["阅天AI", "品牌介绍", "Y1"],
  };

  function text(node) {
    return (node?.textContent || "").replace(/\s+/g, " ").trim();
  }

  function shortSummary(value) {
    const clean = text({ textContent: value });
    return clean.length > 18 ? `${clean.slice(0, 18)}…` : clean || "看结构，也看现实里的用法。";
  }

  function stripTitle(value) {
    return text({ textContent: value })
      .replace(/^紫微斗数/, "")
      .replace(/^免费紫微斗数排盘后/, "")
      .replace(/^AI命理师/, "")
      .replace(/怎么看$/, "")
      .replace(/是什么意思$/, "")
      .replace(/怎么选$/, "")
      .replace(/后先看什么$/, "先看什么");
  }

  function glyphSymbol(label) {
    const clean = text({ textContent: label })
      .replace(/系列文章$/, "")
      .replace(/阅天AI$/, "阅")
      .replace(/品牌介绍$/, "阅")
      .replace(/三方四正$/, "三")
      .replace(/算命网站$/, "算")
      .replace(/怎么选$/, "选")
      .replace(/先看什么$/, "先")
      .replace(/宫$/, "");
    return Array.from(clean)[0] || "阅";
  }

  function posterImage() {
    const raw = document.querySelector('meta[property="og:image"]')?.content || "";
    if (!raw || !/(images\/home2\/|xu-dashi\.webp)/i.test(raw)) return "";
    try {
      const url = new URL(raw, window.location.href);
      return /(^|\.)yuetianai\.com$/i.test(url.hostname) ? `${url.pathname}${url.search}` : url.href;
    } catch (_error) {
      return raw;
    }
  }

  function palaceConfig(slug) {
    const index = palaces.findIndex((item) => item.slug === slug);
    if (index < 0) return null;
    const item = palaces[index];
    const preview = [-2, 2, 4].map((offset) => {
      const target = palaces[(index + offset + palaces.length) % palaces.length];
      return { href: target.slug, label: target.label, kicker: "十二宫" };
    });
    return { series: "十二宫入门", label: item.label, serial: item.serial, preview };
  }

  function fallbackPreview() {
    return [
      { href: "ziwei-minggong.html", label: "命宫", kicker: "十二宫" },
      { href: "ziwei-sanfang-sizheng.html", label: "三方四正", kicker: "看盘方法" },
      { href: "ziwei-kequanlu.html", label: "科权禄", kicker: "星曜入门" },
    ];
  }

  function getConfig(slug, root) {
    const palace = palaceConfig(slug);
    if (palace) return palace;

    if (custom[slug]) {
      const [series, label, serial] = custom[slug];
      return { series, label, serial, preview: fallbackPreview() };
    }

    const crumb = root.querySelector(".breadcrumb span:last-child");
    const title = root.querySelector("h1");
    return {
      series: text(crumb) || "学习紫微",
      label: stripTitle(text(title)) || "系列文章",
      serial: "A1",
      preview: fallbackPreview(),
    };
  }

  function miniCards(items) {
    return items.slice(0, 3).map((item) => `
      <a class="article-orbit__mini" href="${item.href}">
        <span>${item.kicker}</span>
        <strong>${item.label}</strong>
      </a>
    `).join("");
  }

  function enhance(orbit) {
    if (orbit.dataset.seriesEnhanced === "true") return;

    const root = orbit.closest(".article-detail");
    if (!root) return;

    const slug = window.location.pathname.split("/").pop() || "";
    const config = getConfig(slug, root);
    const summary = shortSummary(root.querySelector(".detail-subtitle")?.textContent);
    const glyph = glyphSymbol(config.label);
    const image = posterImage();
    const stars = Array.from({ length: 7 }, (_, index) => `<span class="article-orbit__star article-orbit__star--${index + 1}"></span>`).join("");

    orbit.classList.add("article-orbit--series");
    orbit.dataset.seriesEnhanced = "true";
    orbit.removeAttribute("aria-hidden");
    if (image) {
      orbit.style.setProperty("--article-orbit-image", `url("${image}")`);
      orbit.dataset.posterImage = "true";
    }
    orbit.innerHTML = `
      <div class="article-orbit__glow" aria-hidden="true"></div>
      <div class="article-orbit__glyph" aria-hidden="true">
        <span class="article-orbit__ring article-orbit__ring--outer"></span>
        <span class="article-orbit__ring article-orbit__ring--mid"></span>
        <span class="article-orbit__ring article-orbit__ring--inner"></span>
        <span class="article-orbit__core"></span>
        <span class="article-orbit__core-label">${glyph}</span>
        ${stars}
      </div>
      <div class="article-orbit__copy">
        <p class="article-orbit__eyebrow">${config.series}</p>
        <p class="article-orbit__title">${config.label}</p>
        <p class="article-orbit__summary">${summary}</p>
      </div>
      <div class="article-orbit__rail">
        <span class="article-orbit__serial">SERIES ${config.serial}</span>
        <span class="article-orbit__rule" aria-hidden="true"></span>
        <div class="article-orbit__mini-list">${miniCards(config.preview)}</div>
      </div>
    `;
  }

  function init() {
    document.querySelectorAll(".article-orbit").forEach(enhance);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
