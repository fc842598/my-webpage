/* Shared, decorative first-use cue for desktop and the mobile report. */
(() => {
  'use strict';
  const selector = '[data-decode-all], .wentian-chart-ai-coin[data-action="wentian-chart-ai-decode"]';
  const key = 'yuetian-reading-star-guide-seen-v1';
  let dismissed = false;
  try { dismissed = localStorage.getItem(key) === '1'; } catch (_) { /* Private browsing. */ }
  if (dismissed) return;
  let instance = 0;
  const artwork = `<svg class="reading-star-guide" viewBox="0 0 180 180" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="rsg-fill-ID" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#ecfbff"/><stop offset=".24" stop-color="#b0e4fc"/><stop offset=".65" stop-color="#5cb6e9"/><stop offset="1" stop-color="#2867af"/>
      </linearGradient>
      <radialGradient id="rsg-palm-ID" cx=".34" cy=".24" r=".75">
        <stop stop-color="#e1f8ff" stop-opacity=".85"/><stop offset="1" stop-color="#69c7ed" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <g class="rsg-orbit" fill="none" stroke="#78c9ff">
      <circle cx="78" cy="67" r="65" stroke-width=".8" opacity=".23"/>
      <circle class="rsg-comet" cx="78" cy="67" r="65" pathLength="100" stroke-width="2.2" stroke-linecap="round"/>
    </g>
    <g class="rsg-orbit-star" fill="#e7f8ff">
      <path d="M78-4 L80 0 L86 2 L80 4 L78 10 L76 4 L70 2 L76 0 Z"/>
    </g>
    <g class="rsg-touch" fill="none" stroke="#b3e6ff">
      <circle class="rsg-ripple" cx="108" cy="105" r="9" stroke-width="2"/>
      <circle class="rsg-ripple rsg-ripple-echo" cx="108" cy="105" r="9" stroke-width="1.2"/>
      <circle class="rsg-contact" cx="108" cy="105" r="5" fill="#e5faff" stroke="none"/>
    </g>
    <g class="rsg-sparks" fill="#c6efff">
      <path d="M136 106l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5z"/>
      <path d="M82 127l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>
      <circle cx="127" cy="139" r="1.5"/>
    </g>
    <g class="rsg-hand">
      <g transform="translate(108 105) rotate(-26) scale(.92) translate(-19 -3)" stroke-linecap="round" stroke-linejoin="round">
        <path class="rsg-hand-shape" fill="url(#rsg-fill-ID)" stroke="#a2ddf5" stroke-width=".9" d="M19 3 C15.8 3 13.7 5.4 13.8 9 L14.4 31.8 C10.5 27.5 6 24.2 3.1 27.3 C.6 30 2 32.9 4.5 36.2 L12 46.8 C15.3 51.5 19.4 54.9 20 61.5 Q30 65 41.5 61.5 C42 56 48.8 52 49.6 43.4 L50 34.5 C50.3 28 43.6 26.5 41.5 31.2 L41.3 27.5 C41 21.3 34.9 20.7 32.6 25.3 L32.4 23.6 C31.8 17.8 26.7 17.3 23.8 21.5 L24.1 9 C24.2 5.4 22 3 19 3 Z"/>
        <path d="M16.3 31 L16.5 9 Q16.5 5.7 20 5.9" fill="none" stroke="#effcff" stroke-width="1.6" opacity=".9"/>
        <path d="M24 25 Q29 21 31 26 L31 33 Q27 29 23 32 M33 29 Q38 26 40 31 L40 37 Q36 33 32 35 M42 35 Q47 31 48 36" fill="none" stroke="#d0f3ff" stroke-width="1.3" opacity=".8"/>
        <path d="M23.5 23 L23.5 34 M32 28 L32 36 M41 33 L41 39 M13 33 Q15 38 21 41" fill="none" stroke="#2c75b4" stroke-width="1.2" opacity=".65"/>
        <ellipse cx="28" cy="44" rx="15" ry="13" fill="url(#rsg-palm-ID)"/>
        <path d="M20 59 Q30 62.5 42.5 58.5 L41.5 64 Q29 67 20.5 63.5 Z" fill="#226ca8" stroke="#8bd6fa" stroke-width=".9"/>
      </g>
    </g>
  </svg>`;
  function attach(root) {
    if (dismissed || !(root instanceof Element || root instanceof Document)) return;
    const buttons = [...root.querySelectorAll(selector)];
    if (root instanceof Element && root.matches(selector)) buttons.push(root);
    buttons.forEach(button => {
      if (button.querySelector('.reading-star-guide')) return;
      button.classList.add('has-star-guide');
      const id = ++instance;
      button.insertAdjacentHTML('beforeend', artwork.replaceAll('rsg-fill-ID', 'rsg-fill-' + id).replaceAll('rsg-palm-ID', 'rsg-palm-' + id));
    });
  }
  attach(document);
  // Mobile replaces its report DOM when switching screens or updating progress.
  const observer = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(attach));
  });
  observer.observe(document.body, { childList: true, subtree: true });
  function dismiss() {
    dismissed = true;
    observer.disconnect();
    document.querySelectorAll('.reading-star-guide').forEach(guide => {
      guide.classList.add('is-leaving');
      setTimeout(() => {
        guide.parentElement?.classList.remove('has-star-guide');
        guide.remove();
      }, 420);
    });
    document.removeEventListener('click', onClick, true);
  }
  function onClick(event) {
    const button = event.target instanceof Element && event.target.closest(selector);
    if (!button || button.disabled) return;
    try { localStorage.setItem(key, '1'); } catch (_) { /* Keep session dismissal. */ }
    dismiss();
  }
  document.addEventListener('click', onClick, true);
  window.addEventListener('storage', event => {
    if (event.key === key && event.newValue === '1') dismiss();
  });
})();
