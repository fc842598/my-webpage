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

  const posterSlugs = new Set([
    "ziwei-minggong.html",
    "ziwei-xiongdigong.html",
    "ziwei-fuqigong.html",
    "ziwei-zinvgong.html",
    "ziwei-caibogong.html",
    "ziwei-jiegong.html",
    "ziwei-qianyigong.html",
    "ziwei-puyigong.html",
    "ziwei-guanlugong.html",
    "ziwei-tianzhaigong.html",
    "ziwei-fudegong.html",
    "ziwei-fumugong.html",
    "ziwei-sanfang-sizheng.html",
    "ziwei-shengong.html",
    "ziwei-gongxing.html",
    "ziwei-kequanlu.html",
    "mianfei-ziwei-paipan-hou-xian-kan-shenme.html",
    "ai-ziwei-paipan-zenme-xuan.html",
    "ai-suanming-wangzhan-zenme-xuan.html",
    "yuetianai-shi-shenme.html",
  ]);

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

  function posterImageBySlug(slug, size = "poster") {
    if (!posterSlugs.has(slug)) return "";
    const name = slug.replace(/\.html$/, ".webp");
    const folder = size === "thumb" ? "thumbs/" : "";
    return `/images/articles/posters/${folder}${name}`;
  }

  function articleHref(slug) {
    return new URL(`../articles/${slug}`, window.location.href).pathname;
  }

  function palaceConfig(slug) {
    const index = palaces.findIndex((item) => item.slug === slug);
    if (index < 0) return null;
    const item = palaces[index];
    const preview = [-2, 2, 4].map((offset) => {
      const target = palaces[(index + offset + palaces.length) % palaces.length];
      return { href: articleHref(target.slug), image: posterImageBySlug(target.slug, "thumb"), label: target.label, kicker: "十二宫" };
    });
    return { series: "十二宫入门", label: item.label, serial: item.serial, preview };
  }

  function fallbackPreview() {
    return [
      { href: articleHref("ziwei-minggong.html"), image: posterImageBySlug("ziwei-minggong.html", "thumb"), label: "命宫", kicker: "十二宫" },
      { href: articleHref("ziwei-sanfang-sizheng.html"), image: posterImageBySlug("ziwei-sanfang-sizheng.html", "thumb"), label: "三方四正", kicker: "看盘方法" },
      { href: articleHref("ziwei-kequanlu.html"), image: posterImageBySlug("ziwei-kequanlu.html", "thumb"), label: "科权禄", kicker: "星曜入门" },
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
      <a class="article-orbit__mini" href="${item.href}"${item.image ? ` style="--article-mini-image:url('${item.image}');"` : ""}>
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
    const image = posterImageBySlug(slug);

    orbit.classList.add("article-orbit--series");
    orbit.dataset.seriesEnhanced = "true";
    orbit.removeAttribute("aria-hidden");
    orbit.innerHTML = `
      <div class="article-orbit__poster">
        ${image ? `<img class="article-orbit__image" src="${image}" alt="" width="960" height="540" decoding="async">` : ""}
      </div>
      <div class="article-orbit__related">
        <div class="article-orbit__rail">
          <span class="article-orbit__serial">SERIES ${config.serial}</span>
          <span class="article-orbit__rule" aria-hidden="true"></span>
          <div class="article-orbit__related-head">
            <strong>同系列课程</strong>
            <a href="${articleHref("index.html")}">查看全部</a>
          </div>
          <div class="article-orbit__mini-list">${miniCards(config.preview)}</div>
          <p class="article-orbit__related-note">统一一视觉，替换宫位内容即可应用到更多文章</p>
        </div>
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
