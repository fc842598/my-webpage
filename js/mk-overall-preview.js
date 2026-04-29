(function () {
  'use strict';

  function qs(sel) { return document.querySelector(sel); }
  function setText(el, text) { if (el) el.textContent = text || ''; }
  function setHtml(el, html) { if (el) el.innerHTML = html || ''; }
  function setLines(el, lines) {
    if (!el) return;
    el.textContent = '';
    lines.filter(Boolean).forEach(function (line, index) {
      if (index > 0) el.appendChild(document.createElement('br'));
      el.appendChild(document.createTextNode(line));
    });
  }

  function isHidden(el) {
    if (!el) return true;
    if (el.hasAttribute('hidden')) return true;
    const style = window.getComputedStyle(el);
    return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
  }

  function spacedTitle(text) {
    const t = String(text || '').trim();
    if (!t) return '';
    if (/[A-Za-z0-9]/.test(t)) return t;
    if (/\s/.test(t)) return t;
    const chars = Array.from(t);
    if (chars.length >= 2 && chars.length <= 10) return chars.join(' ');
    return t;
  }

  function copyText(fromSel, toSel, transform) {
    const from = qs(fromSel);
    const to = qs(toSel);
    if (!to) return;
    const val = (from && !isHidden(from)) ? (from.textContent || '').trim() : '';
    setText(to, transform ? transform(val) : val);
  }

  function copyHtml(fromSel, toSel) {
    const from = qs(fromSel);
    const to = qs(toSel);
    if (!to) return;
    if (!from) {
      setHtml(to, '');
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.innerHTML = from.innerHTML || '';
    wrapper.querySelectorAll('[id]').forEach(function (node) {
      node.removeAttribute('id');
    });
    setHtml(to, wrapper.innerHTML);
  }

  function copyBlock(fromSel, toSel, prefixIfNeeded) {
    const from = qs(fromSel);
    const to = qs(toSel);
    if (!to) return;
    if (!from || isHidden(from)) {
      to.style.display = 'none';
      to.textContent = '';
      return;
    }
    const txt = (from.textContent || '').trim();
    if (!txt) {
      to.style.display = 'none';
      to.textContent = '';
      return;
    }
    to.style.display = '';
    to.textContent = prefixIfNeeded ? (prefixIfNeeded + txt) : txt;
  }

  function syncAll() {
    // 顶部 meta
    copyText('#aip-desc', '#mk-header-meta');

    // 封面副标题/主标题（尽量镜像现有展示）
    copyText('#aip-life-ttl', '#mk-life-title', spacedTitle);
    setLines(qs('#mk-cover-meta'), [
      (qs('#aip-life-ttl')?.textContent || '').trim() || '整体批命',
      (qs('#aip-desc')?.textContent || '').trim()
    ]);

    // AI 状态
    copyText('#aip-overall-status', '#mk-overall-status');

    // 卷二标题行
    copyText('#aip-life-ttl', '#mk-overall-title');

    // 主体正文（保持原结构化 HTML）
    copyHtml('#aip-life-body', '#mk-life-body');

    // 风险/依据
    copyBlock('#aip-life-risk', '#mk-life-risk');
    copyBlock('#aip-life-basis', '#mk-life-basis');

    // 命盘结构（镜像原结构内容）
    copyHtml('#aip-struct', '#mk-struct');

    // 五个专项：标题/状态/结构/正文
    const topics = [
      ['shen', '身宫'],
      ['hunyin', '婚姻'],
      ['jiankang', '健康'],
      ['caiyun', '财运'],
      ['shiye', '事业'],
    ];
    topics.forEach(([id]) => {
      copyText(`#aip-${id}-ttl`, `#mk-${id}-ttl`);
      copyText(`#aip-${id}-status`, `#mk-${id}-status`);
      copyHtml(`#aip-${id}-struct`, `#mk-${id}-struct`);
      copyHtml(`#aip-${id}-body`, `#mk-${id}-body`);
    });
  }

  function bindProxyClicks(root) {
    if (!root) return;
    root.addEventListener('click', function (e) {
      const target = e.target && e.target.closest ? e.target.closest('[data-mk-proxy-click]') : null;
      if (!target) return;
      const sel = target.getAttribute('data-mk-proxy-click');
      if (!sel) return;
      const el = qs(sel);
      if (!el) return;
      e.preventDefault();

      if (sel.charAt(0) !== '#') return;
      const mirrorDetails = qs('#mk-' + sel.slice(1).replace(/^aip-/, '').replace(/-details$/, '') + '-details');
      if (mirrorDetails && mirrorDetails.tagName === 'DETAILS') {
        mirrorDetails.toggleAttribute('open');
        syncAll();
        return;
      }

      // 1) details: 直接切换 open
      if (el.tagName === 'DETAILS') {
        el.toggleAttribute('open');
        return;
      }

      // 2) button/link: 触发原按钮
      if (typeof el.click === 'function') el.click();
    });
  }

  function init() {
    const preview = qs('#mk-overall-preview');
    if (!preview) return;

    bindProxyClicks(preview);

    // 初次同步
    syncAll();

    // 展开时再同步一次（避免首屏未渲染完）
    preview.addEventListener('toggle', function () {
      if (preview.open) syncAll();
    });

    // 监听旧版整体批命内容变化，实时镜像到预览区
    // 注意：预览区本身在 aip-panel-base 内部，不能把 observer 挂在整个面板上，否则会自触发循环。
    const srcMain = qs('.aip-main-card');
    const srcGrid = qs('.aip-specialty-grid');
    if ((!srcMain && !srcGrid) || !window.MutationObserver) return;

    let t = 0;
    const schedule = function () {
      if (!preview.open) return;
      if (t) return;
      t = window.setTimeout(function () {
        t = 0;
        syncAll();
      }, 60);
    };

    const obs = new MutationObserver(schedule);
    if (srcMain) obs.observe(srcMain, { childList: true, subtree: true, characterData: true });
    if (srcGrid) obs.observe(srcGrid, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
