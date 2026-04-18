/**
 * js/ai-chat.js — AI半仙 对话面板
 *
 * 依赖全局变量：
 *   window._chart, window._chartInputs, window._chartRecordId
 * 依赖函数：
 *   buildChartPayload()
 */
(function () {
  var BASE = 'https://ai-piming-backend-production.up.railway.app';
  var RETRY_DELAY = 3000;
  var MAX_RETRIES = 6;

  var _sessionId = null;
  var _initialized = false;
  var _loading = false;
  var _memoryAStale = false;
  var _retryCount = 0;
  var _warmUpDone = false;
  var _lastChartRecordId = null;
  var _transientMode = false;

  window._chatPanelInit = init;
  window._chatPanelRefresh = refresh;
  window._chatRebuildMemoryA = rebuildMemoryA;
  window._chatInvalidateMemoryA = function () {
    _memoryAStale = true;
    _setContextPreview('命盘有新的批命结果，建议点“重读命盘”，让许半仙先把新的主线读进去。');
    _updateBadges(false, false, 0, true);
    _setModeBadge(_transientMode);
    _setMemorySources(null);
  };

  function _warmUp() {
    if (_warmUpDone) return;
    _warmUpDone = true;
    fetch(BASE + '/api/ai/run', {
      method: 'OPTIONS',
      signal: (typeof AbortController !== 'undefined')
        ? (function () {
            var controller = new AbortController();
            setTimeout(function () { controller.abort(); }, 8000);
            return controller.signal;
          }())
        : undefined,
    }).catch(function () {});
  }

  function _getChartPayload() {
    return (typeof buildChartPayload === 'function') ? buildChartPayload() : null;
  }

  function _getTransientKey(chartRecordId) {
    return 'aip-chat-transient:' + chartRecordId;
  }

  function _loadTransientState(chartRecordId) {
    if (!chartRecordId || !window.sessionStorage) return null;
    try {
      var raw = window.sessionStorage.getItem(_getTransientKey(chartRecordId));
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function _saveTransientState(chartRecordId, state) {
    if (!chartRecordId || !window.sessionStorage) return;
    try {
      if (!state) {
        window.sessionStorage.removeItem(_getTransientKey(chartRecordId));
        return;
      }
      window.sessionStorage.setItem(_getTransientKey(chartRecordId), JSON.stringify(state));
    } catch (_) {}
  }

  function _resetSessionState() {
    _sessionId = null;
    _initialized = false;
    _loading = false;
    _memoryAStale = false;
    _transientMode = false;
  }

  function init() {
    if (!document.getElementById('aip-panel-chat')) return;

    if (!window._chart || !window._chartInputs) {
      _setMsgArea('<div class="chat-sys-msg">请先完成排盘，再使用 AI半仙。</div>');
      _setInputEnabled(false);
      _setStarterEnabled(false);
      _setRefreshEnabled(false);
      _setModeBadge(false);
      _setMemorySources(null);
      _setContextPreview('先完成排盘，许半仙才能读取你的命盘主线、流年与批命结果。');
      return;
    }

    var chartRecordId = window._chartRecordId;
    if (!chartRecordId) {
      if (_retryCount < MAX_RETRIES) {
        _retryCount++;
        _setMsgArea(
          '<div class="chat-sys-msg">命盘正在保存，稍后自动载入…（' + _retryCount + '/' + MAX_RETRIES + '）</div>'
        );
        _setStarterEnabled(false);
        setTimeout(init, RETRY_DELAY);
      } else {
        _setMsgArea(
          '<div class="chat-sys-msg">命盘保存超时，' +
          '<button onclick="window._chatPanelRefresh()" style="margin-left:6px;padding:2px 10px;border:1px solid rgba(201,169,97,.4);border-radius:12px;background:rgba(201,169,97,.1);color:#c9a961;font-size:12px;cursor:pointer;font-family:inherit">点此重试</button>' +
          '</div>'
        );
      }
      _setInputEnabled(false);
      _setStarterEnabled(false);
      _setRefreshEnabled(false);
      return;
    }

    _retryCount = 0;

    if (_lastChartRecordId && _lastChartRecordId !== chartRecordId) {
      _resetSessionState();
      _setMsgArea('<div class="chat-sys-msg">检测到你切换了新的命盘，许半仙正在重新读取。</div>');
    }
    _lastChartRecordId = chartRecordId;

    if (_initialized && _sessionId && !_memoryAStale) {
      _setInputEnabled(true);
      _setStarterEnabled(true);
      _setRefreshEnabled(true);
      return;
    }

    _loadSession({
      chartRecordId: chartRecordId,
      chartData: _getChartPayload(),
      forceRefreshMemoryA: _memoryAStale,
      preserveMessages: false,
    });
  }

  function refresh() {
    _resetSessionState();
    _retryCount = 0;
    init();
  }

  function rebuildMemoryA() {
    var chartRecordId = window._chartRecordId;
    var chartData = _getChartPayload();

    if (!chartRecordId || !chartData) {
      _appendMsg('system', '请先完成排盘，再读取命盘记忆。');
      return;
    }

    _loadSession({
      chartRecordId: chartRecordId,
      chartData: chartData,
      forceRefreshMemoryA: true,
      preserveMessages: true,
      quietGreeting: true,
    });
  }

  function _loadSession(options) {
    var chartRecordId = options.chartRecordId;
    var chartData = options.chartData;
    var preserveMessages = !!options.preserveMessages;
    var quietGreeting = !!options.quietGreeting;

    _showLoadingBar(true);
    _setInputEnabled(false);
    _setStarterEnabled(false);
    _setRefreshEnabled(false);

    var usePost = !!chartData;
    var requestBody = usePost
      ? {
          chartRecordId: chartRecordId,
          chartData: chartData,
          forceRefreshMemoryA: !!options.forceRefreshMemoryA,
          transientState: _loadTransientState(chartRecordId),
        }
      : null;

    var url = usePost
      ? (BASE + '/api/ai/chat/session')
      : (BASE + '/api/ai/chat/session?chartRecordId=' + encodeURIComponent(chartRecordId));

    fetch(url, usePost ? {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    } : {
      method: 'GET',
    })
      .then(_readJsonResponse)
      .then(function (data) {
        _sessionId = data.sessionId;
        _initialized = true;
        _memoryAStale = false;
        _transientMode = !!data.transientMode;

        if (data.transientState) _saveTransientState(chartRecordId, data.transientState);
        else _saveTransientState(chartRecordId, null);

        _updateBadges(data.hasMemoryA, data.hasMemoryB, data.memoryBVersion || 0, false);
        _setModeBadge(_transientMode);
        _setContextPreview(data.memoryASummary || '');
        _setMemorySources(data.memoryAMeta || null);

        if (!preserveMessages) {
          _renderMessages(data.messages || []);
        }

        if (data.memoryAJustBuilt) {
          _appendMsg('system', '许半仙已重新读入你的命盘主线，可以继续发问。');
        }

        if (data.transientMode) {
          _appendMsg('system', '当前是临时会话模式：你现在可以继续聊，但在补聊天表 SQL 前，这段对话不会正式落库。');
        }

        if ((!data.messages || data.messages.length === 0) && !quietGreeting) {
          _appendMsg('assistant', '你好，我是许半仙。我会先按你的命盘主线、大运与流年脉络来回答，你可以直接问感情、事业、财运或最近一年。');
        }

        _setInputEnabled(true);
        _setStarterEnabled(true);
        _setRefreshEnabled(true);
      })
      .catch(function (err) {
        _handleLoadError(err);
      })
      .finally(function () {
        _showLoadingBar(false);
      });
  }

  function send() {
    if (_loading) return;

    var input = document.getElementById('chat-input');
    var msg = (input ? input.value : '').trim();
    if (!msg) return;

    if (!_sessionId) {
      init();
      return;
    }

    var chartData = _getChartPayload();
    if (!chartData) {
      _appendMsg('system', '请先完成排盘。');
      return;
    }

    _loading = true;
    _setInputEnabled(false);
    _setStarterEnabled(false);
    _setRefreshEnabled(false);
    if (input) input.value = '';

    var doForceRefreshA = _memoryAStale;
    _memoryAStale = false;

    _appendMsg('user', msg);
    _appendTyping();

    fetch(BASE + '/api/ai/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chartRecordId: window._chartRecordId,
        message: msg,
        chartData: chartData,
        forceRefreshMemoryA: doForceRefreshA || undefined,
        transientState: _loadTransientState(window._chartRecordId),
      }),
    })
      .then(_readJsonResponse)
      .then(function (data) {
        _removeTyping();
        _transientMode = !!data.transientMode;
        if (data.transientState) _saveTransientState(window._chartRecordId, data.transientState);
        else _saveTransientState(window._chartRecordId, null);
        _appendMsg('assistant', data.reply);
        _updateBadges(data.hasMemoryA, data.hasMemoryB, data.memoryBVersion || 0, false);
        _setModeBadge(_transientMode);
        _setContextPreview(data.memoryASummary || '');
        _setMemorySources(data.memoryAMeta || null);

        if (data.memoryAJustBuilt) {
          _appendMsg('system', '命盘主线已刷新，许半仙会按最新结论继续回答。');
        }
        if (data.memoryBJustBuilt) {
          _appendMsg('system', '本轮对话重点已自动整理，后续回答会更贴着你的问题走。');
        }
      })
      .catch(function (err) {
        _removeTyping();
        _memoryAStale = doForceRefreshA;

        if (err && err.setupRequired) {
          _setInputEnabled(false);
          _setStarterEnabled(false);
          _setRefreshEnabled(false);
          _setModeBadge(true);
          _setMemorySources(null);
          _setContextPreview('当前聊天数据库还没建好，许半仙暂时无法保存会话与命盘记忆。先执行 Supabase SQL，再回来重试。');
        }

        _appendMsg('system', '发送失败：' + _friendlyErrorMessage(err));
      })
      .finally(function () {
        _loading = false;
        if (!_sessionId || !(document.getElementById('chat-send-btn') || {}).disabled) {
          _setInputEnabled(true);
          _setStarterEnabled(true);
          _setRefreshEnabled(true);
        }
        var inp = document.getElementById('chat-input');
        if (inp && !inp.disabled) inp.focus();
      });
  }

  function _readJsonResponse(response) {
    var contentType = String(response.headers.get('content-type') || '').toLowerCase();

    if (contentType.indexOf('application/json') === -1) {
      return response.text().then(function () {
        var err = new Error(
          response.status === 404
            ? 'AI半仙后端还没部署到聊天接口，请稍后重试。'
            : 'AI半仙服务暂时不可用，请稍后重试。'
        );
        err.status = response.status;
        err.nonJson = true;
        throw err;
      });
    }

    return response.json().then(function (data) {
      if (!response.ok || data.error) {
        var err = new Error(_friendlyErrorMessage(data));
        err.status = response.status;
        err.code = data && data.code;
        err.setupRequired = !!(data && data.setupRequired);
        err.missingTables = (data && data.missingTables) || [];
        throw err;
      }
      return data;
    });
  }

  function _friendlyErrorMessage(errOrData) {
    var raw = typeof errOrData === 'string'
      ? errOrData
      : String((errOrData && errOrData.error) || (errOrData && errOrData.message) || '');

    if ((errOrData && errOrData.setupRequired) || /Could not find the table|schema cache|chat_sessions|chat_messages|chat_memory_snapshots/i.test(raw)) {
      return 'AI半仙还没完成数据库初始化，请先在 Supabase SQL Editor 执行聊天表 SQL。';
    }
    if (/Failed to fetch/i.test(raw)) {
      return '网络或后端服务异常，请稍后重试。';
    }
    if (/服务暂时不可用|后端还没部署/.test(raw)) {
      return raw;
    }
    return raw || 'AI半仙暂时不可用，请稍后重试。';
  }

  function _handleLoadError(err) {
    var message = _friendlyErrorMessage(err);

    if (err && err.setupRequired) {
      _setMsgArea(
        '<div class="chat-sys-msg chat-setup">' +
        'AI半仙聊天功能还没初始化完成。<br>' +
        '先到 Supabase SQL Editor 执行聊天表 SQL，再回来点“重试”。' +
        '</div>'
      );
      _setContextPreview('当前缺少聊天表，许半仙还没法保存会话记忆。先把数据库初始化好，这个板块才能真正工作。');
      _setModeBadge(false);
      _setMemorySources(null);
      _setInputEnabled(false);
      _setStarterEnabled(false);
      _setRefreshEnabled(false);
      return;
    }

    _setMsgArea(
      '<div class="chat-sys-msg chat-err">加载失败：' + _esc(message) +
      '&nbsp;<button onclick="window._chatPanelRefresh()" style="margin-left:6px;padding:2px 10px;border:1px solid rgba(200,80,80,.4);border-radius:12px;background:rgba(200,80,80,.1);color:#c06060;font-size:12px;cursor:pointer;font-family:inherit">重试</button>' +
      '</div>'
    );
    _setContextPreview('许半仙暂时没成功读到命盘或后端服务，请稍后重试。');
    _setModeBadge(false);
    _setMemorySources(null);
    _setInputEnabled(false);
    _setStarterEnabled(false);
    _setRefreshEnabled(!!window._chartRecordId);
  }

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
    div.id = 'chat-typing';
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
    var btn = document.getElementById('chat-send-btn');
    var input = document.getElementById('chat-input');
    if (btn) btn.disabled = !enabled;
    if (input) input.disabled = !enabled;
  }

  function _setRefreshEnabled(enabled) {
    var btn = document.getElementById('chat-refresh-memory-btn');
    if (btn) btn.disabled = !enabled;
  }

  function _setStarterEnabled(enabled) {
    document.querySelectorAll('.chat-starter-btn').forEach(function (btn) {
      btn.disabled = !enabled;
    });
  }

  function _setContextPreview(summary) {
    var el = document.getElementById('chat-context-preview');
    if (!el) return;

    var text = String(summary || '').replace(/\s+/g, ' ').trim();
    if (!text) {
      el.innerHTML = '命盘摘要会在这里显示。先完成排盘，许半仙会先读入你的命盘主线，再回答后面的追问。';
      return;
    }

    if (text.length > 150) text = text.slice(0, 150) + '…';
    el.innerHTML = '<strong>已读命盘：</strong>' + _esc(text);
  }

  function _setModeBadge(isTransient) {
    var badge = document.getElementById('chat-badge-mode');
    if (!badge) return;
    badge.textContent = isTransient ? '临时会话' : '会话正常';
    badge.classList.toggle('chat-badge-ok', !isTransient);
    badge.classList.toggle('chat-badge-stale', false);
    badge.classList.toggle('chat-badge-transient', !!isTransient);
  }

  function _setMemorySources(meta) {
    var el = document.getElementById('chat-memory-sources');
    if (!el) return;

    var modules = (meta && meta.modulesIncluded) || null;
    var items = [
      { label: '基础命盘', ready: !!meta },
      { label: '整体批命', ready: !!(modules && modules.overall) },
      { label: '身宫批命', ready: !!(modules && modules.shengong) },
      { label: '大运结果', ready: !!(modules && modules.dayun) },
      { label: '流年结果', ready: !!(modules && modules.liunian) },
    ];

    el.innerHTML = items.map(function (item) {
      return '<span class="chat-memory-source' + (item.ready ? ' is-ready' : '') + '">' +
        (item.ready ? '已读 ' : '待补 ') + item.label +
        '</span>';
    }).join('');
  }

  function _updateBadges(hasA, hasB, bVersion, staleA) {
    var badgeA = document.getElementById('chat-badge-a');
    var badgeB = document.getElementById('chat-badge-b');

    if (badgeA) {
      if (staleA) {
        badgeA.textContent = '命盘待刷新';
        badgeA.classList.remove('chat-badge-ok');
        badgeA.classList.add('chat-badge-stale');
      } else {
        badgeA.textContent = hasA ? '命盘已读入' : '命盘待读取';
        badgeA.classList.toggle('chat-badge-ok', !!hasA);
        badgeA.classList.remove('chat-badge-stale');
      }
    }

    if (badgeB) {
      badgeB.textContent = hasB ? ('对话已整理 v' + (bVersion || 1)) : '对话未整理';
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

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('chat-send-btn');
    var input = document.getElementById('chat-input');
    var refreshBtn = document.getElementById('chat-refresh-memory-btn');

    if (btn) btn.addEventListener('click', send);
    if (refreshBtn) refreshBtn.addEventListener('click', rebuildMemoryA);

    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      });
    }

    document.querySelectorAll('.chat-starter-btn').forEach(function (starter) {
      starter.addEventListener('click', function () {
        var prompt = starter.getAttribute('data-chat-prompt') || '';
        var chatInput = document.getElementById('chat-input');
        if (!chatInput || chatInput.disabled) return;
        chatInput.value = prompt;
        chatInput.focus();
      });
    });

    setTimeout(_warmUp, 2000);
  });
}());
