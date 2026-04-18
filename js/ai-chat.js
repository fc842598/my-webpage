/**
 * js/ai-chat.js — AI半仙 对话面板
 *
 * 依赖全局变量（chart.html 内联脚本维护）：
 *   window._chart, window._chartInputs, window._chartRecordId
 * 依赖函数（ai-piming.js 导出）：
 *   buildChartPayload()
 */
(function () {
  var BASE = 'https://ai-piming-backend-production.up.railway.app';

  var _sessionId   = null;
  var _initialized = false;
  var _loading     = false;

  // ── 对外钩子 ────────────────────────────────────────────────
  window._chatPanelInit    = init;
  window._chatPanelRefresh = refresh;

  // ── 初始化（进入 tab 时调用）────────────────────────────────
  function init() {
    if (!document.getElementById('aip-panel-chat')) return;

    // 未排盘
    if (!window._chart || !window._chartInputs) {
      _setMsgArea('<div class="chat-sys-msg">请先完成排盘，再使用 AI半仙。</div>');
      _setInputEnabled(false);
      return;
    }

    var chartRecordId = window._chartRecordId;
    if (!chartRecordId) {
      _setMsgArea('<div class="chat-sys-msg">命盘正在保存，请稍候后再点击 AI半仙 tab。</div>');
      _setInputEnabled(false);
      return;
    }

    // 已初始化，不重复加载
    if (_initialized && _sessionId) {
      _setInputEnabled(true);
      return;
    }

    _showLoadingBar(true);
    _setInputEnabled(false);

    fetch(BASE + '/api/ai/chat/session?chartRecordId=' + encodeURIComponent(chartRecordId))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.error) throw new Error(data.error);

        _sessionId   = data.sessionId;
        _initialized = true;

        _updateBadges(data.hasMemoryA, data.hasMemoryB, data.memoryBVersion);
        _renderMessages(data.messages || []);

        if (!data.messages || data.messages.length === 0) {
          _appendMsg('assistant', '你好，我是许半仙。你的命盘我已详细查看，有什么命理问题尽管问。');
        }

        _setInputEnabled(true);
      })
      .catch(function (err) {
        _setMsgArea('<div class="chat-sys-msg chat-err">载入失败：' + _esc(err.message) + '</div>');
      })
      .finally(function () {
        _showLoadingBar(false);
      });
  }

  function refresh() {
    _initialized = false;
    _sessionId   = null;
    init();
  }

  // ── 发送消息 ─────────────────────────────────────────────────
  function send() {
    if (_loading) return;

    var input = document.getElementById('chat-input');
    var msg   = (input ? input.value : '').trim();
    if (!msg) return;

    if (!_sessionId) {
      init();
      return;
    }

    var chartData = (typeof buildChartPayload === 'function') ? buildChartPayload() : null;
    if (!chartData) {
      _appendMsg('system', '请先完成排盘。');
      return;
    }

    _loading = true;
    _setInputEnabled(false);
    if (input) input.value = '';

    _appendMsg('user', msg);
    _appendTyping();

    fetch(BASE + '/api/ai/chat/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chartRecordId: window._chartRecordId,
        message:       msg,
        chartData:     chartData,
      }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        _removeTyping();

        if (data.error) throw new Error(data.error);

        _appendMsg('assistant', data.reply);
        _updateBadges(data.hasMemoryA, data.hasMemoryB);

        if (data.memoryAJustBuilt) {
          _appendMsg('system', '✦ 命盘总档已建立，许半仙已完整读取您的命盘。');
        }
        if (data.memoryBJustBuilt) {
          _appendMsg('system', '（已自动整理本轮对话摘要）');
        }
      })
      .catch(function (err) {
        _removeTyping();
        _appendMsg('system', '发送失败：' + _esc(err.message));
      })
      .finally(function () {
        _loading = false;
        _setInputEnabled(true);
        var inp = document.getElementById('chat-input');
        if (inp) inp.focus();
      });
  }

  // ── DOM 工具 ─────────────────────────────────────────────────
  function _renderMessages(messages) {
    var box = document.getElementById('chat-messages');
    if (!box) return;
    box.innerHTML = '';
    for (var i = 0; i < messages.length; i++) {
      _appendMsg(messages[i].sender, messages[i].content);
    }
    _scrollToBottom();
  }

  function _appendMsg(sender, content) {
    var box = document.getElementById('chat-messages');
    if (!box) return;

    var div = document.createElement('div');
    div.className = 'chat-msg chat-msg-' + sender;

    if (sender === 'assistant') {
      div.innerHTML =
        '<span class="chat-sender">许半仙</span>' +
        '<span class="chat-bubble">' + _esc(content) + '</span>';
    } else if (sender === 'user') {
      div.innerHTML =
        '<span class="chat-bubble chat-bubble-user">' + _esc(content) + '</span>';
    } else {
      div.innerHTML = '<span class="chat-sys-msg">' + _esc(content) + '</span>';
    }

    box.appendChild(div);
    _scrollToBottom();
  }

  function _appendTyping() {
    var box = document.getElementById('chat-messages');
    if (!box) return;
    var div = document.createElement('div');
    div.id        = 'chat-typing';
    div.className = 'chat-msg chat-msg-assistant';
    div.innerHTML =
      '<span class="chat-sender">许半仙</span>' +
      '<span class="chat-bubble">' +
        '<span class="chat-typing-dots"><span></span><span></span><span></span></span>' +
      '</span>';
    box.appendChild(div);
    _scrollToBottom();
  }

  function _removeTyping() {
    var el = document.getElementById('chat-typing');
    if (el) el.remove();
  }

  function _setMsgArea(html) {
    var box = document.getElementById('chat-messages');
    if (box) box.innerHTML = html;
  }

  function _showLoadingBar(show) {
    var bar = document.getElementById('chat-loading-bar');
    if (bar) bar.style.display = show ? 'block' : 'none';
  }

  function _setInputEnabled(enabled) {
    var btn   = document.getElementById('chat-send-btn');
    var input = document.getElementById('chat-input');
    if (btn)   btn.disabled   = !enabled;
    if (input) input.disabled = !enabled;
  }

  function _updateBadges(hasA, hasB, bVersion) {
    var badgeA = document.getElementById('chat-badge-a');
    var badgeB = document.getElementById('chat-badge-b');
    if (badgeA) {
      badgeA.textContent = hasA ? '命档 已建立' : '命档 未建立';
      badgeA.classList.toggle('chat-badge-ok', !!hasA);
    }
    if (badgeB) {
      badgeB.textContent = hasB ? ('摘要 v' + (bVersion || 1)) : '摘要 无';
      badgeB.classList.toggle('chat-badge-ok', !!hasB);
    }
  }

  function _scrollToBottom() {
    var box = document.getElementById('chat-messages');
    if (box) {
      // rAF 保证渲染后再滚动
      requestAnimationFrame(function () { box.scrollTop = box.scrollHeight; });
    }
  }

  function _esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>');
  }

  // ── 事件绑定 ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var btn   = document.getElementById('chat-send-btn');
    var input = document.getElementById('chat-input');

    if (btn)   btn.addEventListener('click', send);
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      });
    }
  });
}());
