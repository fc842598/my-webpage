/**
 * js/ai-chat.js — AI半仙 对话面板
 *
 * 依赖全局变量（chart.html 内联脚本维护）：
 *   window._chart, window._chartInputs, window._chartRecordId
 * 依赖函数（ai-piming.js 导出）：
 *   buildChartPayload()
 */
(function () {
  var BASE           = 'https://ai-piming-backend-production.up.railway.app';
  var RETRY_DELAY    = 3000;  // chartRecordId 未就绪时的轮询间隔(ms)
  var MAX_RETRIES    = 6;     // 最多等待 18 秒

  var _sessionId          = null;
  var _initialized        = false;
  var _loading            = false;
  var _memoryAStale       = false; // 大运/流年批命完成后置 true，下次发送强制重建 A
  var _retryCount         = 0;
  var _warmUpDone         = false;
  var _lastChartRecordId  = null;  // 检测命盘切换，切换时重置会话

  // ── 对外钩子 ────────────────────────────────────────────────
  window._chatPanelInit         = init;
  window._chatPanelRefresh      = refresh;
  /**
   * dayun-panel 批命完成后调用此函数，标记 Memory A 需要刷新
   * 下次用户发送消息时，后端会强制重建 A，不影响聊天流程
   */
  window._chatInvalidateMemoryA = function () {
    _memoryAStale = true;
    // 更新命档徽章提示状态过期
    var badgeA = document.getElementById('chat-badge-a');
    if (badgeA && badgeA.textContent === '命档 已建立') {
      badgeA.textContent = '命档 待更新';
      badgeA.classList.remove('chat-badge-ok');
      badgeA.classList.add('chat-badge-stale');
    }
  };

  // ── 预热（脚本加载时立即触发，无论用户是否点 tab）──────────
  function _warmUp() {
    if (_warmUpDone) return;
    _warmUpDone = true;
    // 发一个轻量 ping，唤醒 Railway 冷启动中的服务
    // 不等结果，失败静默
    fetch(BASE + '/api/ai/chat/session?chartRecordId=__ping__', {
      method: 'GET',
      signal: (typeof AbortController !== 'undefined')
        ? (function () { var c = new AbortController(); setTimeout(function () { c.abort(); }, 8000); return c.signal; }())
        : undefined,
    }).catch(function () {});
  }

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

    // chartRecordId 尚未写入（异步 save 还没完成）→ 自动重试
    if (!chartRecordId) {
      if (_retryCount < MAX_RETRIES) {
        _retryCount++;
        _setMsgArea(
          '<div class="chat-sys-msg">命盘正在保存，稍候自动载入…（' + _retryCount + '/' + MAX_RETRIES + '）</div>'
        );
        setTimeout(init, RETRY_DELAY);
      } else {
        // 超时后显示手动重试按钮
        _setMsgArea(
          '<div class="chat-sys-msg">命盘保存超时，' +
          '<button onclick="window._chatPanelRefresh()" ' +
          'style="margin-left:6px;padding:2px 10px;border:1px solid rgba(201,169,97,.4);' +
          'border-radius:12px;background:rgba(201,169,97,.1);color:#c9a961;' +
          'font-size:12px;cursor:pointer;font-family:inherit">点击重试</button>' +
          '</div>'
        );
      }
      return;
    }

    _retryCount = 0; // 重置重试计数

    // 命盘切换时强制重置会话
    if (_lastChartRecordId && _lastChartRecordId !== chartRecordId) {
      _sessionId   = null;
      _initialized = false;
      _memoryAStale = false;
    }
    _lastChartRecordId = chartRecordId;

    // 已初始化，不重复加载
    if (_initialized && _sessionId) {
      _setInputEnabled(true);
      return;
    }

    _showLoadingBar(true);
    _setInputEnabled(false);

    var chartData = (typeof buildChartPayload === 'function') ? buildChartPayload() : null;

    // POST with chartData to trigger eager Memory A build
    var fetchOpts = chartData
      ? {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ chartRecordId: chartRecordId, chartData: chartData }),
        }
      : { method: 'GET' };
    var url = chartData
      ? (BASE + '/api/ai/chat/session')
      : (BASE + '/api/ai/chat/session?chartRecordId=' + encodeURIComponent(chartRecordId));

    fetch(url, fetchOpts)
      .then(function (r) {
        if (!r.ok && r.headers.get('content-type') && r.headers.get('content-type').indexOf('application/json') === -1) {
          throw new Error('服务器返回 ' + r.status + '，请稍后重试');
        }
        return r.json();
      })
      .then(function (data) {
        if (data.error) throw new Error(data.error);

        _sessionId   = data.sessionId;
        _initialized = true;

        _updateBadges(data.hasMemoryA, data.hasMemoryB, data.memoryBVersion);
        _renderMessages(data.messages || []);

        if (data.memoryAJustBuilt) {
          _appendMsg('system', '✦ 命盘总档已建立，许半仙已完整读取您的命盘。');
        }

        if (!data.messages || data.messages.length === 0) {
          _appendMsg('assistant', '你好，我是许半仙。你的命盘我已详细查看，有什么命理问题尽管问。');
        }

        _setInputEnabled(true);
      })
      .catch(function (err) {
        _setMsgArea(
          '<div class="chat-sys-msg chat-err">载入失败：' + _esc(err.message) +
          '&nbsp;<button onclick="window._chatPanelRefresh()" ' +
          'style="margin-left:6px;padding:2px 10px;border:1px solid rgba(200,80,80,.4);' +
          'border-radius:12px;background:rgba(200,80,80,.1);color:#c06060;' +
          'font-size:12px;cursor:pointer;font-family:inherit">重试</button>' +
          '</div>'
        );
      })
      .finally(function () {
        _showLoadingBar(false);
      });
  }

  function refresh() {
    _initialized = false;
    _sessionId   = null;
    _retryCount  = 0;
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

    // 本次是否需要强制重建 Memory A
    var doForceRefreshA = _memoryAStale;
    _memoryAStale = false; // 清标记（不管成功失败，避免每条都重建）

    _appendMsg('user', msg);
    _appendTyping();

    fetch(BASE + '/api/ai/chat/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chartRecordId:      window._chartRecordId,
        message:            msg,
        chartData:          chartData,
        forceRefreshMemoryA: doForceRefreshA || undefined,
      }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        _removeTyping();

        if (data.error) throw new Error(data.error);

        _appendMsg('assistant', data.reply);
        _updateBadges(data.hasMemoryA, data.hasMemoryB, data.memoryBVersion);

        if (data.memoryAJustBuilt) {
          _appendMsg('system', '✦ 命盘总档已建立，许半仙已完整读取您的命盘。');
        }
        if (data.memoryBJustBuilt) {
          _appendMsg('system', '（已自动整理本轮对话摘要）');
        }
      })
      .catch(function (err) {
        _removeTyping();
        _memoryAStale = doForceRefreshA; // 失败时恢复标记，下次再试
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
      badgeA.classList.remove('chat-badge-stale');
    }
    if (badgeB) {
      badgeB.textContent = hasB ? ('摘要 v' + (bVersion || 1)) : '摘要 无';
      badgeB.classList.toggle('chat-badge-ok', !!hasB);
    }
  }

  function _scrollToBottom() {
    var box = document.getElementById('chat-messages');
    if (box) {
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

  // ── 事件绑定 + 预热 ──────────────────────────────────────────
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

    // 预热：页面就绪后延迟 2 秒触发，避免和排盘请求竞争带宽
    setTimeout(_warmUp, 2000);
  });
}());
