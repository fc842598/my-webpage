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

  const posterArt = {
    "ziwei-minggong.html": "/images/home2/triad-tian-bg.webp",
    "ziwei-xiongdigong.html": "/images/home2/triad-tian-bg.webp",
    "ziwei-fuqigong.html": "/images/home2/triad-ren-bg.webp",
    "ziwei-zinvgong.html": "/images/home2/triad-tian-bg.webp",
    "ziwei-caibogong.html": "/images/home2/triad-ren-bg.webp",
    "ziwei-jiegong.html": "/images/home2/triad-tian-bg.webp",
    "ziwei-qianyigong.html": "/images/home2/triad-ren-bg.webp",
    "ziwei-puyigong.html": "/images/home2/triad-tian-bg.webp",
    "ziwei-guanlugong.html": "/images/home2/triad-tian-bg.webp",
    "ziwei-tianzhaigong.html": "/images/home2/triad-tian-bg.webp",
    "ziwei-fudegong.html": "/images/home2/triad-tian-bg.webp",
    "ziwei-fumugong.html": "/images/home2/triad-tian-bg.webp",
    "ziwei-sanfang-sizheng.html": "/images/home2/triad-tian-bg.webp",
    "ziwei-shengong.html": "/images/wentian-prototype-assets/xu-dashi.webp",
    "ziwei-gongxing.html": "/images/home2/triad-ren-bg.webp",
    "ziwei-kequanlu.html": "/images/home2/triad-tian-bg.webp",
    "mianfei-ziwei-paipan-hou-xian-kan-shenme.html": "/images/home2/triad-tian-bg.webp",
    "ai-ziwei-paipan-zenme-xuan.html": "/images/home2/triad-tian-bg.webp",
    "ai-suanming-wangzhan-zenme-xuan.html": "/images/home2/triad-ren-bg.webp",
  };

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

  function posterImageBySlug(slug) {
    return posterArt[slug] || "";
  }

  function articleHref(slug) {
    return new URL(`../articles/${slug}`, window.location.href).pathname;
  }

  function posterMetrics(slug, label) {
    const dict = {
      "ziwei-minggong.html": ["性格底色", "人生主线", "发展方向"],
      "ziwei-xiongdigong.html": ["同辈关系", "合作边界", "助力阻力"],
      "ziwei-fuqigong.html": ["关系模式", "婚缘节奏", "相处边界"],
      "ziwei-zinvgong.html": ["表达延续", "投入方式", "责任感受"],
      "ziwei-caibogong.html": ["财帛格局", "收入来源", "理财守成"],
      "ziwei-jiegong.html": ["身体压力", "风险提示", "恢复节奏"],
      "ziwei-qianyigong.html": ["外出机会", "发展机缘", "环境变化"],
      "ziwei-puyigong.html": ["团队协作", "人脉结构", "资源往来"],
      "ziwei-guanlugong.html": ["事业路径", "岗位角色", "发力方式"],
      "ziwei-tianzhaigong.html": ["家宅资源", "稳定基础", "空间归属"],
      "ziwei-fudegong.html": ["内在能量", "精神重心", "放松方式"],
      "ziwei-fumugong.html": ["原生影响", "承接方式", "支持压力"],
      "ziwei-sanfang-sizheng.html": ["主宫定位", "对宫牵引", "结构合参"],
      "ziwei-shengong.html": ["行为落点", "现实姿态", "处世反应"],
      "ziwei-gongxing.html": ["宫位职责", "阅读顺序", "现实映射"],
      "ziwei-kequanlu.html": ["名声资源", "权责分布", "现实结果"],
      "mianfei-ziwei-paipan-hou-xian-kan-shenme.html": ["先看命身", "再看三方", "最后接流年"],
      "ai-ziwei-paipan-zenme-xuan.html": ["入口清楚", "边界明确", "能落地用"],
      "ai-suanming-wangzhan-zenme-xuan.html": ["隐私边界", "收费方式", "内容质量"],
      "yuetianai-shi-shenme.html": ["官网入口", "主要功能", "适合人群"],
    };
    return dict[slug] || [`${label}入门`, "结构重点", "现实用法"];
  }

  function palaceConfig(slug) {
    const index = palaces.findIndex((item) => item.slug === slug);
    if (index < 0) return null;
    const item = palaces[index];
    const preview = [-2, 2, 4].map((offset) => {
      const target = palaces[(index + offset + palaces.length) % palaces.length];
      return { href: articleHref(target.slug), image: posterImageBySlug(target.slug), label: target.label, kicker: "十二宫" };
    });
    return { series: "十二宫入门", label: item.label, serial: item.serial, preview };
  }

  function fallbackPreview() {
    return [
      { href: articleHref("ziwei-minggong.html"), image: posterImageBySlug("ziwei-minggong.html"), label: "命宫", kicker: "十二宫" },
      { href: articleHref("ziwei-sanfang-sizheng.html"), image: posterImageBySlug("ziwei-sanfang-sizheng.html"), label: "三方四正", kicker: "看盘方法" },
      { href: articleHref("ziwei-kequanlu.html"), image: posterImageBySlug("ziwei-kequanlu.html"), label: "科权禄", kicker: "星曜入门" },
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
    const summary = shortSummary(root.querySelector(".detail-subtitle")?.textContent);
    const glyph = glyphSymbol(config.label);
    const image = posterImage();
    const metrics = posterMetrics(slug, config.label).map((item) => `<span>${item}</span>`).join("");
    const stars = Array.from({ length: 7 }, (_, index) => `<span class="article-orbit__star article-orbit__star--${index + 1}"></span>`).join("");

    orbit.classList.add("article-orbit--series");
    orbit.dataset.seriesEnhanced = "true";
    orbit.removeAttribute("aria-hidden");
    if (image) {
      orbit.style.setProperty("--article-orbit-image", `url("${image}")`);
      orbit.dataset.posterImage = "true";
    }
    orbit.innerHTML = `
      <div class="article-orbit__poster">
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
          <p class="article-orbit__metrics">${metrics}</p>
        </div>
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
