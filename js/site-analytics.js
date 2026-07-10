(() => {
  const GOOGLE_ANALYTICS_ID = "G-5K7WRWHT3T";
  const LIVE_HOSTS = new Set(["yuetianai.com", "www.yuetianai.com"]);
  const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
  const TRACKABLE_EVENTS = new Set([
    "article_view",
    "article_cta_click",
    "chart_landing",
    "chart_start",
    "chart_complete",
    "login",
    "sign_up",
    "begin_checkout",
    "purchase",
    "ai_question_submit",
    "ai_answer_success",
  ]);
  const ATTRIBUTION_KEY = "yuetian-analytics-attribution-v1";
  const PURCHASE_KEY_PREFIX = "yuetian-analytics-purchase-v1:";
  const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

  const hostname = String(window.location.hostname || "").toLowerCase();
  const isLiveHost = LIVE_HOSTS.has(hostname);
  const isLocalHost = LOCAL_HOSTS.has(hostname);
  const localDebug = isLocalHost && new URLSearchParams(window.location.search).get("ga_debug") === "1";
  if (!isLiveHost && !localDebug) return;
  if (!GOOGLE_ANALYTICS_ID || !/^G-[A-Z0-9]+$/i.test(GOOGLE_ANALYTICS_ID)) return;
  if (window.__YUETIAN_ANALYTICS_READY__) return;
  window.__YUETIAN_ANALYTICS_READY__ = true;

  function safeReadAttribution() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "{}") || {};
      if (typeof parsed !== "object" || Array.isArray(parsed)) return {};
      const updatedAt = new Date(parsed.updatedAt || 0).getTime();
      if (updatedAt && Date.now() - updatedAt > ATTRIBUTION_TTL_MS) return {};
      return parsed;
    } catch (_error) {
      return {};
    }
  }

  function safeWriteAttribution(value) {
    try {
      localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(value));
    } catch (_error) {
      // Analytics must never block the product flow.
    }
  }

  function createJourneyId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `journey-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function safeDecode(value) {
    try {
      return decodeURIComponent(String(value || ""));
    } catch (_error) {
      return String(value || "");
    }
  }

  function cleanIdentifier(value, maxLength) {
    const text = safeDecode(value).trim();
    if (!text || /@/.test(text) || /(?:\+?\d[\s._~-]*){7,}/.test(text)) return "";
    if (!/^[a-z0-9._~-]+$/i.test(text)) return "";
    return text.slice(0, maxLength);
  }

  function cleanJourneyId(value) {
    const text = safeDecode(value).trim();
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)) return text;
    if (/^journey-[a-z0-9-]{8,70}$/i.test(text)) return text.slice(0, 80);
    return "";
  }

  function cleanCampaignValue(value, maxLength) {
    const text = safeDecode(value).trim();
    if (!text || /@/.test(text) || /(?:\+?\d[\s._~-]*){7,}/.test(text)) return "";
    return text.replace(/[^\p{L}\p{N}._~-]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, maxLength);
  }

  function readGaClientId() {
    const raw = document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith("_ga="))?.slice(4) || "";
    const match = raw.match(/^GA\d+\.\d+\.(\d+\.\d+)$/);
    return match?.[1]?.slice(0, 80) || "";
  }

  function articleSlug(pathname = window.location.pathname) {
    return cleanIdentifier(String(pathname || "").match(/\/articles\/(?:en\/)?([^/]+)\.html$/i)?.[1] || "", 100);
  }

  function updateAttribution() {
    const params = new URLSearchParams(window.location.search);
    const currentArticle = articleSlug();
    const linkedArticle = cleanIdentifier(params.get("article"), 100);
    const incomingSource = cleanCampaignValue(params.get("utm_source"), 60);
    const incomingCampaign = cleanCampaignValue(params.get("utm_campaign"), 80);
    const stored = safeReadAttribution();
    const startsNewCampaign = incomingSource && incomingSource !== stored.acquisitionSource;
    const existing = startsNewCampaign ? {} : stored;
    const next = {
      journeyId: cleanJourneyId(params.get("journey_id")) || cleanJourneyId(existing.journeyId) || createJourneyId(),
      firstArticle: cleanIdentifier(existing.firstArticle || currentArticle || linkedArticle, 100),
      lastArticle: cleanIdentifier(currentArticle || linkedArticle || existing.lastArticle, 100),
      internalSource: cleanCampaignValue(params.get("source"), 40) || cleanCampaignValue(existing.internalSource, 40),
      acquisitionSource: incomingSource || cleanCampaignValue(existing.acquisitionSource, 60),
      medium: cleanCampaignValue(params.get("utm_medium"), 60) || cleanCampaignValue(existing.medium, 60),
      campaign: incomingCampaign || cleanCampaignValue(existing.campaign, 80),
      gaClientId: readGaClientId() || (/^\d+\.\d+$/.test(existing.gaClientId || "") ? existing.gaClientId : ""),
      updatedAt: new Date().toISOString(),
    };
    safeWriteAttribution(next);
    return next;
  }

  function safeParameters(parameters = {}) {
    const safe = {};
    for (const [key, value] of Object.entries(parameters)) {
      if (!/^[a-z][a-z0-9_]{0,39}$/i.test(key)) continue;
      if (/email|phone|password|token|secret|name/i.test(key)) continue;
      if (typeof value === "number" && Number.isFinite(value)) safe[key] = value;
      else if (typeof value === "boolean") safe[key] = value;
      else if (typeof value === "string") safe[key] = value.slice(0, 120);
    }
    return safe;
  }

  const tagScript = document.createElement("script");
  tagScript.async = true;
  tagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ANALYTICS_ID)}`;
  document.head.appendChild(tagScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  const attribution = updateAttribution();
  window.yuetianTrack = function yuetianTrack(eventName, parameters = {}) {
    if (!TRACKABLE_EVENTS.has(eventName)) return;
    window.gtag("event", eventName, safeParameters({
      ...parameters,
      journey_id: attribution.journeyId,
      first_article: attribution.firstArticle,
      last_article: attribution.lastArticle,
      acquisition_source: attribution.acquisitionSource,
      internal_source: attribution.internalSource,
      utm_medium: attribution.medium,
      utm_campaign: attribution.campaign,
    }));
  };

  window.yuetianTrackPurchase = function yuetianTrackPurchase(details = {}) {
    if (details.mockMode) return;
    const transactionId = String(details.orderNo || "").trim().slice(0, 100);
    if (!transactionId) return;
    const storageKey = `${PURCHASE_KEY_PREFIX}${transactionId}`;
    try {
      if (localStorage.getItem(storageKey) === "1") return;
    } catch (_error) {
      // GA4 transaction_id also protects reporting from accidental duplicates.
    }

    window.yuetianTrack("purchase", {
      transaction_id: transactionId,
      value: Number(details.value || 0),
      currency: String(details.currency || "CNY").toUpperCase(),
      surface: String(details.surface || "payment"),
      payment_provider: String(details.provider || "unknown"),
      product_key: String(details.productKey || "membership"),
    });
    try {
      localStorage.setItem(storageKey, "1");
    } catch (_error) {
      // Analytics must never block payment completion.
    }
  };

  window.yuetianGetAnalyticsContext = function yuetianGetAnalyticsContext() {
    return {
      journeyId: attribution.journeyId,
      firstArticle: attribution.firstArticle,
      lastArticle: attribution.lastArticle,
      internalSource: attribution.internalSource,
      acquisitionSource: attribution.acquisitionSource,
      medium: attribution.medium,
      campaign: attribution.campaign,
      gaClientId: readGaClientId() || attribution.gaClientId,
    };
  };

  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ANALYTICS_ID, localDebug ? { debug_mode: true } : {});

  const currentArticle = articleSlug();
  if (currentArticle) {
    window.yuetianTrack("article_view", {
      article_slug: currentArticle,
      article_language: /\/articles\/en\//i.test(window.location.pathname) ? "en" : "zh-CN",
    });
  }
  if (/\/pages\/(?:mingbook-onepage|wentian-app)\.html$/i.test(window.location.pathname) && attribution.lastArticle) {
    window.yuetianTrack("chart_landing", { source_article: attribution.lastArticle });
  }

  document.addEventListener("click", (event) => {
    if (!currentArticle) return;
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const target = new URL(link.href, window.location.href);
    if (!/\/pages\/(?:mingbook-onepage|wentian-app)\.html$/i.test(target.pathname)) return;
    target.searchParams.set("source", "article");
    target.searchParams.set("article", currentArticle);
    target.searchParams.set("journey_id", attribution.journeyId);
    link.href = target.href;
    window.yuetianTrack("article_cta_click", {
      article_slug: currentArticle,
      cta_location: link.classList.contains("rail-cta") ? "article_rail" : "article_link",
    });
  }, true);
})();
