/* Shared, decorative first-use cue for desktop and the mobile report. */
(() => {
  'use strict';
  const selector = '[data-decode-all], .wentian-chart-ai-coin[data-action="wentian-chart-ai-decode"]';
  const key = 'yuetian-reading-star-guide-seen-v1';
  let dismissed = false;
  try { dismissed = localStorage.getItem(key) === '1'; } catch (_) { /* Private browsing. */ }
  if (dismissed) return;
  const template = document.createElement('template');
  template.innerHTML = `<svg class="reading-star-guide" viewBox="0 0 180 180" aria-hidden="true" focusable="false">
    <g class="rsg-orbit" fill="none" stroke="#79bdff">
      <path opacity=".24" stroke-width=".65" d="M92 12 C167 3 189 77 144 119 C122 140 94 145 65 143"/>
      <path class="rsg-comet" pathLength="100" stroke-width="1.5" stroke-linecap="round" d="M92 12 C167 3 189 77 144 119 C122 140 94 145 65 143"/>
    </g>
    <g class="rsg-stars" fill="#cceaff">
      <path d="M143 23l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>
      <path d="M158 86l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5z"/>
      <circle cx="110" cy="16" r="1.6"/><circle cx="170" cy="62" r="1.2"/>
      <circle cx="53" cy="131" r="1.8"/><circle cx="76" cy="159" r="1"/>
    </g>
    <g class="rsg-touch" fill="none" stroke="#a4d5ff" stroke-width="1">
      <circle cx="103" cy="105" r="8"/><circle class="rsg-ripple" cx="103" cy="105" r="8"/>
    </g>
    <g class="rsg-hand" stroke-linecap="round" stroke-linejoin="round">
      <path fill="#183c68" fill-opacity=".32" stroke="#9bd2ff" stroke-width="1.3" d="M124 168 L110 154 L99 137 Q94 130 98 128 Q102 125 111 136 L97 109 Q95 104 99 102 Q103 100 106 106 L118 126 L115 117 Q114 112 118 112 Q122 111 125 120 L125 118 Q127 113 131 117 L137 127 Q138 120 143 124 L151 139 Q156 150 150 161 L146 169"/>
      <g fill="none" stroke="#79bdff" stroke-width=".65" opacity=".8">
        <path d="M99 105 L108 123 L119 143 L124 168 M108 123 L125 132 L119 143 L140 148 L146 169 M125 132 L137 127 L140 148 L150 155 M99 133 L119 143 L110 154 L140 148 M125 119 L125 132 L143 139 L140 148"/>
      </g>
      <g fill="#d7efff" stroke="none">
        <circle cx="99" cy="105" r="2.2"/><circle cx="108" cy="123" r="1.7"/>
        <circle cx="119" cy="143" r="2"/><circle cx="125" cy="132" r="1.8"/>
        <circle cx="137" cy="127" r="1.5"/><circle cx="140" cy="148" r="2"/>
        <circle cx="110" cy="154" r="1.5"/><circle cx="150" cy="155" r="1.4"/>
        <circle cx="124" cy="168" r="1.7"/><circle cx="146" cy="169" r="1.5"/>
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
      button.append(template.content.cloneNode(true));
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
