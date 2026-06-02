/**
 * js/ai-chat.js — 许大师 对话面板
 *
 * 记忆策略：A0 基础命盘按需读取，A1/A2/A3/A4 专题结论按问题按需注入。
 * 不再有任何后台预补全 / warmup 队列。
 *
 * 依赖全局变量：window._chart, window._chartInputs, window._chartRecordId
 */
(function () {
  var BASE = getBackendBase();
  var RETRY_DELAY = 3000;
  var MAX_RETRIES = 6;
  var TYPEWRITER_BASE_MS = 22;

  var _sessionId = null;
  var _initialized = false;
  var _loading = false;
  var _pendingQueue = [];
  var _composerEnabled = false;
  var _memoryAStale = false;
  var _retryCount = 0;
  var _lastChartRecordId = null;
  var _transientMode = false;
  var _chatPinnedToBottom = true;
  var _chatScrollBound = false;

  window._chatPanelInit = init;
  window._chatPanelRefresh = refresh;
  window._chatRebuildMemoryA = rebuildMemoryA;
  window._chatPanelPrepareForNewChart = prepareForNewChart;
  window._chatInvalidateMemoryA = function () {
    _memoryAStale = true;
    _setContextPreview('命盘已更新，点“重读”即可同步。');
    _updateBadges(false, false, 0, true);
    _setModeBadge(_transientMode);
    _setMemorySources(null, null);
    _setBackgroundStatus('', '');
  };

  function getBackendBase() {
    try {
      var qsBase = new URLSearchParams(location.search).get('aiBackendBase') || '';
      var cfgBase = window.SITE_CONFIG && window.SITE_CONFIG.aiBackendBase;
      return (qsBase || cfgBase || 'https://api.yuetianai.com').replace(/\/$/, '');
    } catch (_) {
      return 'https://api.yuetianai.com';
    }
  }

  function _getChartPayload() {
    return (typeof buildChartPayload === 'function') ? buildChartPayload() : null;
  }

  function _withAuthHeaders(baseHeaders) {
    var headers = Object.assign({}, baseHeaders || {});
    var getter = typeof window._getMingbookAuthToken === 'function' ? window._getMingbookAuthToken : null;
    if (!getter) return Promise.resolve(headers);
    return Promise.resolve(getter())
      .then(function (token) {
        if (token) headers.Authorization = 'Bearer ' + token;
        return headers;
      })
      .catch(function () {
        return headers;
      });
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
    _pendingQueue = [];
    _composerEnabled = false;
    _memoryAStale = false;
    _transientMode = false;
  }

  function init() {
    if (!document.getElementById('aip-panel-chat')) return;

    if (!window._chart || !window._chartInputs) {
      _setMsgArea('<div class="chat-sys-msg">请先完成排盘，再使用 许大师。</div>');
      _setInputEnabled(false);
      _setStarterEnabled(false);
      _setRefreshEnabled(false);
      _setModeBadge(false);
      _setMemorySources(null);
      _setBackgroundStatus('', '');
      _setContextPreview('完成排盘后可在这里查看命盘摘要。');
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
      _setBackgroundStatus('', '');
      return;
    }

    _retryCount = 0;

    if (_lastChartRecordId && _lastChartRecordId !== chartRecordId) {
      _resetSessionState();
      _setMsgArea('<div class="chat-sys-msg">检测到你切换了新的命盘，许大师正在重新读取。</div>');
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

  function prepareForNewChart() {
    _resetSessionState();
    _retryCount = 0;
    _lastChartRecordId = null;
    _setMsgArea('<div class="chat-sys-msg">检测到新命盘，等待保存后重新读取。</div>');
    _setInputEnabled(false);
    _setStarterEnabled(false);
    _setRefreshEnabled(false);
    _setModeBadge(false);
    _updateBadges(false, false, 0, false);
    _setMemorySources(null, null);
    _setContextPreview('新命盘正在保存，许大师稍后会重新读取，不会沿用上一张盘。');
    _setBackgroundStatus('', '');
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

    return _withAuthHeaders(usePost ? { 'Content-Type': 'application/json' } : {})
      .then(function (headers) {
        return fetch(url, usePost ? {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody),
        } : {
          method: 'GET',
          headers: headers,
        });
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
        _setMemorySources(data.memoryAMeta || null, null);
        _setBackgroundStatus('基础命盘已读入，专题结论按需调用。', 'ok');

        if (!preserveMessages) {
          _renderMessages(data.messages || []);
        }

        if (data.transientMode) {
          _appendMsg('system', '当前是临时会话模式：你现在可以继续聊，但在补聊天表 SQL 前，这段对话不会正式落库。');
        }

        if ((!data.messages || data.messages.length === 0) && !quietGreeting) {
          _appendMsg('assistant', '您好，我是许大师。基础命盘已读入，您可以直接问您关心的感情、事业、财运或最近一年等相关话题。');
        }

        _setInputEnabled(true);
        _setStarterEnabled(true);
        _setRefreshEnabled(true);
        return data;
      })
      .catch(function (err) {
        _handleLoadError(err);
        throw err;
      })
      .finally(function () {
        _showLoadingBar(false);
      });
  }

  function send() {
    var input = document.getElementById('chat-input');
    var msg = (input ? input.value : '').trim();
    if (!msg) return;
    if (typeof window._desktopNotifyPrepare === 'function') {
      window._desktopNotifyPrepare();
    }

    if (!_sessionId) {
      init();
      return;
    }

    var chartData = _getChartPayload();
    if (!chartData) {
      _appendMsg('system', '请先完成排盘。');
      return;
    }

    if (input) input.value = '';
    _syncComposerState();

    var doForceRefreshA = _memoryAStale;
    var shouldRestoreInput = true;
    _memoryAStale = false;

    _appendMsg('user', msg);
    if (_loading) {
      _pendingQueue.push({
        chartRecordId: window._chartRecordId,
        message: msg,
        chartData: chartData,
        forceRefreshMemoryA: doForceRefreshA || undefined,
      });
      _appendMsg('system', '已加入队列，许大师会按顺序回复。');
      return;
    }

    _dispatchSend({
      chartRecordId: window._chartRecordId,
      message: msg,
      chartData: chartData,
      forceRefreshMemoryA: doForceRefreshA || undefined,
      shouldRestoreInput: shouldRestoreInput,
    });
  }

  function _dispatchSend(payload) {
    var shouldRestoreInput = payload.shouldRestoreInput !== false;
    _loading = true;
    _setRefreshEnabled(false);
    _appendTyping();

    _withAuthHeaders({ 'Content-Type': 'application/json' })
      .then(function (headers) {
        return fetch(BASE + '/api/ai/chat/send', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            chartRecordId: payload.chartRecordId,
            message: payload.message,
            chartData: payload.chartData,
            forceRefreshMemoryA: payload.forceRefreshMemoryA,
            transientState: _loadTransientState(payload.chartRecordId),
          }),
        });
      })
      .then(_readJsonResponse)
      .then(function (data) {
        _removeTyping();
        _transientMode = !!data.transientMode;
        if (data.transientState) _saveTransientState(window._chartRecordId, data.transientState);
        else _saveTransientState(window._chartRecordId, null);
        return Promise.resolve(_appendMsg('assistant', data.reply, null, { animate: true }))
          .then(function () {
        _updateBadges(data.hasMemoryA, data.hasMemoryB, data.memoryBVersion || 0, false);
        _setModeBadge(_transientMode);
        _setContextPreview(data.memoryASummary || '');
        _setMemorySources(data.memoryAMeta || null, data.activeTopicTargets || null);
        if (data.quota && typeof window._updateQuotaDisplay === 'function') {
          window._updateQuotaDisplay(data.quota);
        }
        if (data.memoryAJustBuilt) {
          _appendMsg('system', '基础命盘已重新读入，许大师会按最新命盘继续回答。');
        }
        if (data.memoryBJustBuilt) {
          _appendMsg('system', '本轮对话重点已自动整理，后续回答会更贴着你的问题走。');
        }
        if (typeof window._desktopNotifyTaskDone === 'function') {
          window._desktopNotifyTaskDone('AI\u534a\u4ed9\u56de\u590d', '\u8bb8\u534a\u4ed9\u5df2\u7ecf\u56de\u5b8c\u4e86\u3002', { tag: 'yuetian-chat' });
        }
          });
      })
      .catch(function (err) {
        _removeTyping();
        _memoryAStale = !!payload.forceRefreshMemoryA;

        if (err && err.setupRequired) {
          shouldRestoreInput = false;
          _setInputEnabled(false);
          _setStarterEnabled(false);
          _setRefreshEnabled(false);
          _setModeBadge(true);
          _setMemorySources(null, null);
          _setContextPreview('当前聊天数据库还没建好，许大师暂时无法保存会话与命盘记忆。先执行 Supabase SQL，再回来重试。');
        }

        _appendMsg('system', '发送失败：' + _friendlyErrorMessage(err));
        if (typeof window._desktopNotifyTaskFailed === 'function') {
          window._desktopNotifyTaskFailed('AI\u534a\u4ed9\u56de\u590d', _friendlyErrorMessage(err), { tag: 'yuetian-chat-error' });
        }
      })
      .finally(function () {
        _loading = false;
        if (shouldRestoreInput) {
          _setInputEnabled(true);
          _setStarterEnabled(true);
          _setRefreshEnabled(true);
        }
        var inp = document.getElementById('chat-input');
        if (inp && !inp.disabled) inp.focus({ preventScroll: true });
        _drainPendingQueue();
      });
  }

  function _drainPendingQueue() {
    if (_loading || !_pendingQueue.length || !_composerEnabled) return;
    var next = _pendingQueue.shift();
    _dispatchSend({
      chartRecordId: next.chartRecordId,
      message: next.message,
      chartData: next.chartData,
      forceRefreshMemoryA: next.forceRefreshMemoryA,
      shouldRestoreInput: true,
    });
  }

  function _readJsonResponse(response) {
    var contentType = String(response.headers.get('content-type') || '').toLowerCase();

    if (contentType.indexOf('application/json') === -1) {
      return response.text().then(function () {
        var err = new Error(
          response.status === 404
            ? '许大师后端还没部署到聊天接口，请稍后重试。'
            : '许大师服务暂时不可用，请稍后重试。'
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
      return '许大师还没完成数据库初始化，请先在 Supabase SQL Editor 执行聊天表 SQL。';
    }
    if (/Failed to fetch/i.test(raw)) {
      return '网络或后端服务异常，请稍后重试。';
    }
    if (/服务暂时不可用|后端还没部署/.test(raw)) {
      return raw;
    }
    return raw || '许大师暂时不可用，请稍后重试。';
  }

  function _handleLoadError(err) {
    var message = _friendlyErrorMessage(err);

    if (err && err.setupRequired) {
      _setMsgArea(
        '<div class="chat-sys-msg chat-setup">' +
        '许大师聊天功能还没初始化完成。<br>' +
        '先到 Supabase SQL Editor 执行聊天表 SQL，再回来点"重试"。' +
        '</div>'
      );
      _setContextPreview('当前缺少聊天表，许大师还没法保存会话记忆。先把数据库初始化好，这个板块才能真正工作。');
      _setModeBadge(false);
      _setMemorySources(null);
      _setBackgroundStatus('', '');
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
    _setContextPreview('许大师暂时没成功读到命盘或后端服务，请稍后重试。');
    _setModeBadge(false);
    _setMemorySources(null);
    _setBackgroundStatus('', '');
    _setInputEnabled(false);
    _setStarterEnabled(false);
    _setRefreshEnabled(!!window._chartRecordId);
  }

  // ── UI 渲染 ──────────────────────────────────────────────────────────────────

  function _renderMessages(messages) {
    var box = _getChatBox();
    if (!box) return;
    box.innerHTML = '';
    for (var i = 0; i < messages.length; i++) {
      _appendMsg(messages[i].sender, messages[i].content, messages[i].createdAt, { instant: true });
    }
    _scrollToBottom(true, true);
  }

  function _formatChatTime(createdAt) {
    if (!createdAt) return '';
    var d = new Date(createdAt);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }

  function _getTypewriterStep(length) {
    return 1;
  }

  function _getTypewriterDelay(length) {
    if (length > 220) return 8;
    if (length > 120) return 11;
    if (length > 60) return 15;
    return TYPEWRITER_BASE_MS;
  }

  function _typeAssistantBubble(bubble, content, keepPinned) {
    var chars = Array.from(String(content || ''));
    var total = chars.length;
    if (!bubble) return Promise.resolve();
    if (!total) {
      bubble.innerHTML = '';
      bubble.classList.remove('chat-bubble-typing');
      return Promise.resolve();
    }

    var step = _getTypewriterStep(total);
    var delay = _getTypewriterDelay(total);
    var index = 0;
    bubble.classList.add('chat-bubble-typing');

    return new Promise(function (resolve) {
      function tick() {
        index = Math.min(total, index + step);
        bubble.innerHTML = _esc(chars.slice(0, index).join(''));
        _scrollToBottom(keepPinned);

        if (index >= total) {
          bubble.classList.remove('chat-bubble-typing');
          resolve();
          return;
        }

        setTimeout(tick, delay);
      }

      tick();
    });
  }

  function _appendMsg(sender, content, createdAt, options) {
    options = options || {};
    var box = _getChatBox();
    if (!box) return Promise.resolve();
    var keepPinned = options.forceScroll || (_chatPinnedToBottom && _isChatPinnedToBottom(box));

    var div = document.createElement('div');
    div.className = 'chat-msg chat-msg-' + sender;

    if (sender === 'assistant') {
      div.innerHTML =
        '<span class="chat-sender">许大师<span class="chat-sender-read-pill">已读盘</span></span>' +
        '<span class="chat-bubble"></span>';
    } else if (sender === 'user') {
      div.innerHTML =
        '<span class="chat-bubble chat-bubble-user">' + _esc(content) + '</span>';
    } else {
      div.innerHTML = '<span class="chat-sys-msg">' + _esc(content) + '</span>';
    }

    box.appendChild(div);
    _scrollToBottom(keepPinned);

    if (sender === 'assistant') {
      var bubble = div.querySelector('.chat-bubble');
      if (bubble) {
        var shouldAnimate = !options.instant && options.animate !== false;
        if (shouldAnimate) {
          return _typeAssistantBubble(bubble, content, keepPinned);
        }
        bubble.innerHTML = _esc(content);
      }
    }

    return Promise.resolve(div);
  }

  function _appendTyping() {
    var box = _getChatBox();
    if (!box) return;
    var keepPinned = _chatPinnedToBottom && _isChatPinnedToBottom(box);
    var div = document.createElement('div');
    div.id = 'chat-typing';
    div.className = 'chat-msg chat-msg-assistant';
    div.innerHTML =
      '<span class="chat-sender">许大师<span class="chat-sender-read-pill">已读盘</span></span>' +
      '<span class="chat-bubble">' +
      '<span class="chat-typing-dots"><span></span><span></span><span></span></span>' +
      '</span>';
    box.appendChild(div);
    _scrollToBottom(keepPinned);
  }

  function _removeTyping() {
    var el = document.getElementById('chat-typing');
    if (el) el.remove();
  }

  function _setMsgArea(html) {
    var box = _getChatBox();
    if (box) box.innerHTML = html;
  }

  function _showLoadingBar(show) {
    var bar = document.getElementById('chat-loading-bar');
    if (bar) bar.style.display = show ? 'block' : 'none';
  }

  function _setInputEnabled(enabled) {
    var input = document.getElementById('chat-input');
    _composerEnabled = !!enabled;
    if (input) input.disabled = !_composerEnabled;
    _syncComposerState();
  }

  function _syncComposerState() {
    var input = document.getElementById('chat-input');
    var btn = document.getElementById('chat-send-btn');
    var hasText = !!(input && String(input.value || '').trim());
    if (input) input.disabled = !_composerEnabled;
    if (btn) btn.disabled = !_composerEnabled || !hasText;
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

  function _activateStarterCategory(category) {
    if (!category) return;
    document.querySelectorAll('.xb-starter-tab').forEach(function (tab) {
      var active = tab.getAttribute('data-starter-category') === category;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.xb-starter-panel').forEach(function (panel) {
      var active = panel.getAttribute('data-starter-panel') === category;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  }

  function _setContextPreview(summary) {
    var el = document.getElementById('chat-context-preview');
    if (!el) return;

    var text = String(summary || '').replace(/\s+/g, ' ').trim();
    if (!text) {
      el.textContent = '命盘摘要会显示在这里。';
      return;
    }

    if (text.length > 150) text = text.slice(0, 150) + '…';
    el.innerHTML = _esc(text);
  }

  function _setBackgroundStatus(text, tone) {
    var el = document.getElementById('chat-background-status');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'chat-background-status' + (tone ? (' is-' + tone) : '');
    el.style.display = text ? 'block' : 'none';
  }

  function _upgradeChatLayout() {
    return;
  }

  function _setModeBadge(isTransient) {
    var badge = document.getElementById('chat-badge-mode');
    if (!badge) return;
    badge.textContent = isTransient ? '临时' : '已连接';
    badge.classList.toggle('chat-badge-ok', !isTransient);
    badge.classList.toggle('chat-badge-stale', false);
    badge.classList.toggle('chat-badge-transient', !!isTransient);
  }

  function _setMemorySources(meta, activeTargets) {
    var el = document.getElementById('chat-memory-sources');
    if (!el) return;

    var baseReady = !!meta;
    var targets = activeTargets || {};
    function topicItem(key, label) {
      var active = !!targets[key];
      return {
        label: label,
        cls: active ? 'is-used' : 'is-demand',
        title: active
          ? '本轮问题命中该专题，会优先读取已有结论；没有结论时用命盘明细补判。'
          : '用户问到相关主题时才调入，避免每次都消耗算力。'
      };
    }

    var items = [
      { label: '基础命盘', cls: baseReady ? 'is-ready' : '' },
      topicItem('needsA1', '整体结论'),
      topicItem('needsA2', '身宫结论'),
      topicItem('needsA3', '大运结论'),
      topicItem('needsA4', '流年结论'),
    ];

    el.innerHTML = items.map(function (item) {
      return '<span class="chat-memory-source ' + (item.cls || '') + '"' +
        (item.title ? ' title="' + item.title + '"' : '') + '>' +
        item.label +
        '</span>';
    }).join('');
  }

  function _updateBadges(hasA, hasB, bVersion, staleA) {
    var badgeA = document.getElementById('chat-badge-a');
    var badgeB = document.getElementById('chat-badge-b');

    if (badgeA) {
      badgeA.textContent = staleA ? '需重读' : (hasA ? '已读盘' : '待排盘');
      if (staleA) {
        badgeA.classList.remove('chat-badge-ok');
        badgeA.classList.add('chat-badge-stale');
      } else {
        badgeA.classList.toggle('chat-badge-ok', !!hasA);
        badgeA.classList.remove('chat-badge-stale');
      }
    }

    if (badgeB) {
      badgeB.textContent = hasB ? ('已整理 v' + (bVersion || 1)) : '未整理';
      badgeB.classList.toggle('chat-badge-ok', !!hasB);
    }
  }

  function _getChatBox() {
    var box = document.getElementById('chat-messages');
    if (box && !_chatScrollBound) {
      _chatScrollBound = true;
      box.addEventListener('scroll', function () {
        _chatPinnedToBottom = _isChatPinnedToBottom(box);
      }, { passive: true });
    }
    return box;
  }

  function _isChatPinnedToBottom(box) {
    if (!box) return false;
    return box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  }

  function _scrollToBottom(shouldScroll, force) {
    if (!shouldScroll) return;
    var box = _getChatBox();
    if (box) {
      requestAnimationFrame(function () {
        if (!force && !_chatPinnedToBottom) return;
        box.scrollTop = box.scrollHeight;
        _chatPinnedToBottom = true;
      });
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

    _upgradeChatLayout();

    if (btn) btn.addEventListener('click', send);
    if (refreshBtn) refreshBtn.addEventListener('click', rebuildMemoryA);

    if (input) {
      input.addEventListener('input', _syncComposerState);
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
        _syncComposerState();
        chatInput.focus();
      });
    });

    document.querySelectorAll('.xb-starter-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        _activateStarterCategory(tab.getAttribute('data-starter-category'));
      });
    });
  });
}());
