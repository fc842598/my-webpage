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
        <stop stop-color="#f3fcff"/><stop offset=".48" stop-color="#bce8ff"/><stop offset="1" stop-color="#57a7f2"/>
      </linearGradient>
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
      <g transform="translate(108 105) rotate(-28) scale(.82) translate(-19 -3)" stroke-linecap="round" stroke-linejoin="round">
        <path class="rsg-hand-shape" fill="url(#rsg-fill-ID)" stroke="#76baf2" stroke-width="1.5" d="M19 3 C16 3 14 5 14 8 L14 35 L10 31 C4 25 -2 31 2 36 L10 49 C13 54 18 57 19 63 L43 63 C43 58 51 53 51 44 L51 34 C51 27 42 27 42 34 L42 28 C42 21 33 21 33 28 L33 23 C33 16 24 16 24 23 L24 8 C24 5 22 3 19 3 Z"/>
        <path d="M17 31 V9 Q17 6 20 6" fill="none" stroke="#fff" stroke-width="2.1" opacity=".85"/>
        <path d="M24 25 V34 M33 29 V35 M42 35 V39 M14 36 L20 42" fill="none" stroke="#559ddd" stroke-width="1.25" opacity=".8"/>
        <path d="M19 58 Q30 61 44 57 L43 65 L20 65 Z" fill="#559bdb" stroke="#b7e4ff" stroke-width="1.2"/>
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
      button.insertAdjacentHTML('beforeend', artwork.replaceAll('rsg-fill-ID', 'rsg-fill-' + (++instance)));
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
