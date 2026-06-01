(function () {
  var APP_TITLE = '\u9605\u5929';
  var originalTitle = document.title;
  var titleTimer = null;

  function supported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  function fallbackTitle(title) {
    if (!title) return;
    if (titleTimer) clearTimeout(titleTimer);
    document.title = title + ' - ' + originalTitle;
    titleTimer = setTimeout(function () {
      document.title = originalTitle;
      titleTimer = null;
    }, 9000);
  }

  function shouldNotify(options) {
    options = options || {};
    return options.force || document.hidden || !document.hasFocus();
  }

  window._desktopNotifyPrepare = function () {
    if (!supported()) return Promise.resolve('unsupported');
    if (Notification.permission !== 'default') return Promise.resolve(Notification.permission);
    return Notification.requestPermission().catch(function () { return 'denied'; });
  };

  window._desktopNotify = function (title, body, options) {
    options = options || {};
    title = title || APP_TITLE;
    body = body || '';

    if (!shouldNotify(options)) return false;

    if (!supported() || Notification.permission !== 'granted') {
      fallbackTitle(title);
      return false;
    }

    try {
      var notification = new Notification(title, {
        body: body,
        icon: options.icon || '../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.png',
        tag: options.tag || 'yuetian-task',
        renotify: !!options.renotify,
        silent: !!options.silent,
      });
      notification.onclick = function () {
        window.focus();
        notification.close();
      };
      setTimeout(function () { notification.close(); }, options.timeout || 9000);
      return true;
    } catch (_err) {
      fallbackTitle(title);
      return false;
    }
  };

  window._desktopNotifyTaskDone = function (label, detail, options) {
    return window._desktopNotify(
      label ? (label + '\u5df2\u5b8c\u6210') : '\u5904\u7406\u5df2\u5b8c\u6210',
      detail || '\u53ef\u4ee5\u56de\u6765\u67e5\u770b\u7ed3\u679c\u4e86\u3002',
      Object.assign({ force: true }, options || {})
    );
  };

  window._desktopNotifyTaskFailed = function (label, detail, options) {
    return window._desktopNotify(
      label ? (label + '\u5931\u8d25') : '\u5904\u7406\u5931\u8d25',
      detail || '\u8bf7\u56de\u5230\u9875\u9762\u67e5\u770b\u539f\u56e0\u3002',
      Object.assign({ force: true, tag: 'yuetian-task-error', renotify: true }, options || {})
    );
  };

  document.addEventListener('click', function (event) {
    var btn = event.target && event.target.closest ? event.target.closest('button') : null;
    if (!btn) return;
    var id = btn.id || '';
    var isAiAction = btn.classList.contains('aip-card-ai-btn')
      || id === 'chat-send-btn'
      || id === 'fc-score-generate'
      || id === 'shichen-calc'
      || id === 'sc-followup-submit'
      || id.indexOf('dlx-') === 0
      || id.indexOf('aip-') === 0;
    if (isAiAction) window._desktopNotifyPrepare();
  }, true);
}());
