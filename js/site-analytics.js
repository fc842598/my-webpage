(() => {
  // Replace with the live GA4 measurement ID once the property is ready.
  const GOOGLE_ANALYTICS_ID = "G-5K7WRWHT3T";
  const LIVE_HOSTS = new Set(["yuetianai.com", "www.yuetianai.com"]);
  const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

  if (!GOOGLE_ANALYTICS_ID || !/^G-[A-Z0-9]+$/i.test(GOOGLE_ANALYTICS_ID)) {
    return;
  }

  const hostname = String(window.location.hostname || "").toLowerCase();
  const isLiveHost = LIVE_HOSTS.has(hostname);
  const isLocalHost = LOCAL_HOSTS.has(hostname);

  if (!isLiveHost && !isLocalHost) {
    return;
  }

  if (window.__YUETIAN_ANALYTICS_READY__) {
    return;
  }
  window.__YUETIAN_ANALYTICS_READY__ = true;

  const tagScript = document.createElement("script");
  tagScript.async = true;
  tagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ANALYTICS_ID)}`;
  document.head.appendChild(tagScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ANALYTICS_ID, isLiveHost ? {} : { debug_mode: true });
})();
