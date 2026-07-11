(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function text(node) {
    return (node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function href(node) {
    return node && node.getAttribute ? node.getAttribute("href") || "" : "";
  }

  function uniqueLinks(links) {
    var seen = new Set();
    return links.filter(function (link) {
      if (!link.href || seen.has(link.href)) return false;
      seen.add(link.href);
      return true;
    });
  }

  function makeActionCard(link) {
    return '<a class="discovery-action" href="' + escapeHtml(link.href) + '">' +
      '<span class="discovery-action__label">' + escapeHtml(link.label) + '</span>' +
      '<span class="discovery-action__meta">' + escapeHtml(link.meta) + '</span>' +
    '</a>';
  }

  function buildBar(isZh, indexHref, hubLink, chartHref, languageLink) {
    var actions = [
      {
        href: indexHref,
        label: isZh ? "文章总览" : "Article index",
        meta: isZh ? "按问题和专题找" : "Browse by problem and topic"
      }
    ];

    if (hubLink && hubLink.href) {
      actions.push({
        href: hubLink.href,
        label: hubLink.label,
        meta: isZh ? "回到当前专题" : "Back to this topic"
      });
    }

    actions.push({
      href: chartHref,
      label: isZh ? "快速排盘" : "Open chart tool",
      meta: isZh ? "带着命盘回来看" : "Read with your own chart open"
    });

    if (languageLink && languageLink.href) {
      actions.push({
        href: languageLink.href,
        label: languageLink.label,
        meta: isZh ? "切到另一语言版本" : "Switch language version"
      });
    }

    return '<section class="detail-discovery-bar" aria-label="' + escapeHtml(isZh ? "找文章入口" : "Article discovery shortcuts") + '">' +
      '<div class="detail-discovery-bar__head">' +
        '<p class="discovery-eyebrow">' + escapeHtml(isZh ? "继续找文章" : "Find the next article") + '</p>' +
        '<h2>' + escapeHtml(isZh ? "不用退回首页慢慢翻，先按路径走" : "Do not start over. Move by path instead.") + '</h2>' +
        '<p>' + escapeHtml(isZh ? "先按专题、目录和下一步入口找，阅读会快很多。" : "Use topic, section, and next-step routes to keep moving quickly.") + '</p>' +
      '</div>' +
      '<div class="detail-discovery-actions">' + actions.slice(0, 4).map(makeActionCard).join("") + '</div>' +
    '</section>';
  }

  function buildToc(isZh, headings) {
    if (!headings.length) return "";
    return '<section class="discovery-card discovery-card--toc">' +
      '<p class="discovery-eyebrow">' + escapeHtml(isZh ? "本文目录" : "On this page") + '</p>' +
      '<div class="detail-toc">' +
        headings.map(function (item, index) {
          return '<a class="detail-toc__link" data-section-target="' + escapeHtml(item.id) + '" href="#' + escapeHtml(item.id) + '">' +
            '<span class="detail-toc__index">' + String(index + 1).padStart(2, "0") + '</span>' +
            '<span class="detail-toc__text">' + escapeHtml(item.label) + '</span>' +
          '</a>';
        }).join("") +
      '</div>' +
    '</section>';
  }

  function buildRelated(isZh, links) {
    if (!links.length) return "";
    return '<section class="discovery-card discovery-card--related">' +
      '<p class="discovery-eyebrow">' + escapeHtml(isZh ? "继续找这类文章" : "Keep browsing this topic") + '</p>' +
      '<div class="discovery-related-list">' +
        links.map(function (link) {
          return '<a class="discovery-related-link" href="' + escapeHtml(link.href) + '">' +
            '<span class="discovery-related-link__title">' + escapeHtml(link.label) + '</span>' +
            '<span class="discovery-related-link__meta">' + escapeHtml(isZh ? "同路径继续读" : "Next useful read") + '</span>' +
          '</a>';
        }).join("") +
      '</div>' +
    '</section>';
  }

  function buildGuide(isZh, title) {
    return '<section class="discovery-card discovery-card--guide">' +
      '<p class="discovery-eyebrow">' + escapeHtml(isZh ? "阅读导航" : "Reading guide") + '</p>' +
      '<h2>' + escapeHtml(isZh ? "这页先负责讲透一个问题" : "This page should solve one question clearly") + '</h2>' +
      '<p>' + escapeHtml(isZh ? "读完《" + title + "》后，优先去当前专题、总览页和目录，不要只在单页里来回找。" : "After this article, jump to the topic page, the index, and the section list instead of staying trapped in one page.") + '</p>' +
    '</section>';
  }

  function enhancePage() {
    var root = document.querySelector(".article-shell.article-detail");
    if (!root) return;
    var layout = root.querySelector(".article-detail-layout");
    var article = layout && layout.querySelector(".article-main");
    var rail = layout && layout.querySelector(".detail-rail");
    if (!layout || !article || !rail) return;

    var isZh = (document.documentElement.lang || "").toLowerCase().indexOf("zh") === 0;
    var title = text(document.querySelector("h1"));
    var breadcrumbLinks = Array.prototype.slice.call(root.querySelectorAll(".breadcrumb a"));
    var indexHref = href(breadcrumbLinks[0]) || "./";
    var hubAnchor = breadcrumbLinks[1] || null;
    var hubLink = hubAnchor ? { href: href(hubAnchor), label: text(hubAnchor) } : null;
    var chartHref = isZh ? "../pages/mingbook-onepage.html" : "../../pages/mingbook-onepage.html";
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
    var languageAnchor = navLinks.find(function (link) {
      return /english|chinese/i.test(text(link));
    });
    var languageLink = languageAnchor ? { href: href(languageAnchor), label: text(languageAnchor) } : null;
    var headings = Array.prototype.slice.call(article.querySelectorAll("h2[id]")).map(function (node) {
      return { id: node.id, label: text(node) };
    });

    var rawLinks = Array.prototype.slice.call(rail.querySelectorAll("a[href]")).map(function (link) {
      return { href: href(link), label: text(link) };
    });
    var relatedLinks = uniqueLinks(rawLinks.filter(function (link) {
      if (!link.href || !link.label) return false;
      if (link.href === indexHref) return false;
      if (hubLink && link.href === hubLink.href) return false;
      if (link.href === chartHref) return false;
      if (languageLink && link.href === languageLink.href) return false;
      return true;
    })).slice(0, 5);

    layout.insertAdjacentHTML("beforebegin", buildBar(isZh, indexHref, hubLink, chartHref, languageLink));

    rail.classList.add("detail-rail--enhanced");
    rail.innerHTML =
      buildGuide(isZh, title) +
      buildToc(isZh, headings) +
      buildRelated(isZh, relatedLinks);

    var tocLinks = Array.prototype.slice.call(rail.querySelectorAll("[data-section-target]"));
    if ("IntersectionObserver" in window && tocLinks.length) {
      var byId = new Map();
      tocLinks.forEach(function (link) {
        byId.set(link.getAttribute("data-section-target"), link);
      });
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = byId.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach(function (item) { item.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      }, {
        rootMargin: "-18% 0px -62% 0px",
        threshold: 0.1
      });
      headings.forEach(function (item) {
        var node = document.getElementById(item.id);
        if (node) observer.observe(node);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhancePage);
  } else {
    enhancePage();
  }
})();
