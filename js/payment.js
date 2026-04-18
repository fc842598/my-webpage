/**
 * payment.js — 微信支付前端逻辑
 * 支持 mock 模式完整测试和未来真实微信支付切换
 */
(function () {
  'use strict';

  var BACKEND = 'https://ai-piming-backend-production.up.railway.app';

  // 商品列表（本地 fallback，后端 DB 为准）
  var PRODUCTS = [
    {
      key: 'overall_report',
      name: '整体批命',
      desc: '完整紫微斗数命盘解读，事业、感情、财运全覆盖',
      price: '29.00',
      icon: '☆',
    },
    {
      key: 'shengong_report',
      name: '身宫专项',
      desc: '身宫与后天倾向深度解读',
      price: '19.00',
      icon: '◈',
    },
    {
      key: 'dayun_report',
      name: '大运流年专项',
      desc: '大运叠加流年，精准定位当前阶段',
      price: '24.00',
      icon: '◉',
    },
    {
      key: 'chat_package',
      name: '许半仙深度对话包',
      desc: '30次深度命理追问对话',
      price: '39.00',
      icon: '❋',
    },
    {
      key: 'vip_upgrade',
      name: '高级版',
      desc: '解锁全部功能与对话',
      price: '99.00',
      icon: '✦',
    },
  ];

  var ENTITLEMENT_LABELS = {
    overall_report: '已解锁整体批命',
    shengong_report: '已解锁身宫专项',
    dayun_report: '已解锁大运流年专项',
    chat_package: '已解锁许半仙深度对话包（30次）',
    vip_upgrade: '已升级为高级版，全功能解锁',
  };

  var _state = {
    orderNo: null,
    productKey: null,
    mockMode: false,
    pollTimer: null,
  };

  // ── DOM helpers ──────────────────────────────────────────────

  function show(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }

  function hide(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function qs(id) {
    return document.getElementById(id);
  }

  // ── API ──────────────────────────────────────────────────────

  async function apiPost(path, body) {
    var resp = await fetch(BACKEND + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    var json = await resp.json();
    if (!resp.ok) throw new Error(json.error || '请求失败');
    return json;
  }

  async function apiGet(path) {
    var resp = await fetch(BACKEND + path);
    var json = await resp.json();
    if (!resp.ok) throw new Error(json.error || '请求失败');
    return json;
  }

  // ── Product shop ─────────────────────────────────────────────

  function renderProducts(containerId) {
    var container = qs(containerId);
    if (!container) return;
    container.innerHTML = PRODUCTS.map(function (p) {
      return (
        '<div class="pay-product-card">' +
          '<div class="pay-product-icon">' + p.icon + '</div>' +
          '<div class="pay-product-name">' + p.name + '</div>' +
          '<div class="pay-product-desc">' + p.desc + '</div>' +
          '<div class="pay-product-price">¥' + p.price + '</div>' +
          '<button class="pay-product-btn" data-key="' + p.key + '">立即购买</button>' +
        '</div>'
      );
    }).join('');
    container.querySelectorAll('.pay-product-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        hide('pay-shop-modal');
        startPurchase(btn.dataset.key);
      });
    });
  }

  // ── Purchase flow ────────────────────────────────────────────

  async function startPurchase(productKey) {
    _state.productKey = productKey;
    _state.orderNo = null;
    _state.mockMode = false;
    stopPoll();

    var product = PRODUCTS.find(function (p) { return p.key === productKey; });
    show('pay-modal');
    renderPayModal({ phase: 'loading', product: product });

    try {
      // Step 1: create order
      var orderData = await apiPost('/api/payments/create-order', {
        productKey: productKey,
        chartRecordId: window._chartRecordId || null,
      });
      _state.orderNo = orderData.orderNo;
      _state.mockMode = !!orderData.mockMode;

      // Step 2: create payment session
      var session = await apiPost('/api/payments/create-session', {
        orderNo: orderData.orderNo,
        payMethod: 'native',
      });

      renderPayModal({ phase: 'pending', product: product, order: orderData, session: session });
      startPollStatus(orderData.orderNo);
    } catch (err) {
      renderPayModal({ phase: 'error', product: product, error: err.message });
    }
  }

  // ── Modal rendering ──────────────────────────────────────────

  function renderPayModal(opts) {
    var wrap = qs('pay-modal-content');
    if (!wrap) return;

    var product = opts.product || {};
    var order = opts.order || {};
    var session = opts.session || {};
    var phase = opts.phase || 'loading';

    var mockBadge = _state.mockMode ? '<span class="pay-mock-badge">模拟模式</span>' : '';

    var body = '';

    if (phase === 'loading') {
      body = '<div class="pay-spinner"></div><div class="pay-loading-text">正在创建订单…</div>';

    } else if (phase === 'pending') {
      var mockSection = _state.mockMode
        ? '<div class="pay-mock-btns">' +
            '<div class="pay-mock-label">🧪 Mock 测试操作</div>' +
            '<button class="pay-mock-btn pay-mock-success" id="pay-mock-ok">模拟支付成功</button>' +
            '<button class="pay-mock-btn pay-mock-fail" id="pay-mock-fail">模拟支付失败</button>' +
            '<button class="pay-mock-btn pay-mock-refresh" id="pay-mock-refresh">刷新订单状态</button>' +
          '</div>'
        : '';

      body =
        '<div class="pay-order-row"><span>订单号</span><code>' + (order.orderNo || '') + '</code></div>' +
        '<div class="pay-order-row"><span>商品</span><span>' + (product.name || '') + '</span></div>' +
        '<div class="pay-order-row"><span>金额</span><strong>¥' + (order.amountYuan || '') + '</strong></div>' +
        '<div class="pay-order-row"><span>状态</span><span class="pay-state pay-state-pending">待支付</span></div>' +
        (session.tip ? '<div class="pay-tip">' + session.tip + '</div>' : '') +
        mockSection;

    } else if (phase === 'paid') {
      body =
        '<div class="pay-success-icon">✓</div>' +
        '<div class="pay-success-title">支付成功</div>' +
        '<div class="pay-order-row"><span>订单号</span><code>' + (_state.orderNo || '') + '</code></div>' +
        '<div class="pay-entitlement" id="pay-entitlement-line">' +
          (ENTITLEMENT_LABELS[_state.productKey] || '权益已发放') +
        '</div>';

    } else if (phase === 'failed') {
      body =
        '<div class="pay-fail-icon">✕</div>' +
        '<div class="pay-fail-title">支付失败</div>' +
        '<div class="pay-order-row"><span>订单号</span><code>' + (_state.orderNo || '') + '</code></div>' +
        '<button class="pay-retry-btn" id="pay-retry">重新购买</button>';

    } else if (phase === 'error') {
      body =
        '<div class="pay-fail-icon">!</div>' +
        '<div class="pay-fail-title">出错了</div>' +
        '<div class="pay-error-msg">' + (opts.error || '未知错误') + '</div>' +
        '<button class="pay-retry-btn" id="pay-retry">重试</button>';
    }

    wrap.innerHTML =
      '<div class="pay-modal-head">' +
        '<span class="pay-modal-title">' + (product.name || '购买服务') + '</span>' +
        mockBadge +
        '<button class="pay-modal-close" id="pay-close-btn">×</button>' +
      '</div>' +
      '<div class="pay-modal-body">' + body + '</div>';

    // Bind events
    var closeBtn = qs('pay-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closePayModal);

    var retryBtn = qs('pay-retry');
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        if (_state.productKey) startPurchase(_state.productKey);
      });
    }

    var mockOk = qs('pay-mock-ok');
    if (mockOk) mockOk.addEventListener('click', doMockComplete);

    var mockFail = qs('pay-mock-fail');
    if (mockFail) mockFail.addEventListener('click', doMockFail);

    var mockRefresh = qs('pay-mock-refresh');
    if (mockRefresh) {
      mockRefresh.addEventListener('click', function () {
        if (_state.orderNo) checkStatus(_state.orderNo);
      });
    }
  }

  function closePayModal() {
    stopPoll();
    hide('pay-modal');
  }

  // ── Mock actions ──────────────────────────────────────────────

  async function doMockComplete() {
    if (!_state.orderNo) return;
    var btn = qs('pay-mock-ok');
    if (btn) btn.disabled = true;
    try {
      stopPoll();
      await apiPost('/api/payments/mock/complete', { orderNo: _state.orderNo });
      var product = PRODUCTS.find(function (p) { return p.key === _state.productKey; });
      renderPayModal({ phase: 'paid', product: product });
    } catch (err) {
      if (btn) btn.disabled = false;
      alert('模拟支付失败：' + err.message);
    }
  }

  async function doMockFail() {
    if (!_state.orderNo) return;
    var btn = qs('pay-mock-fail');
    if (btn) btn.disabled = true;
    try {
      stopPoll();
      await apiPost('/api/payments/mock/fail', { orderNo: _state.orderNo, reason: '用户取消' });
      var product = PRODUCTS.find(function (p) { return p.key === _state.productKey; });
      renderPayModal({ phase: 'failed', product: product });
    } catch (err) {
      if (btn) btn.disabled = false;
      alert('操作失败：' + err.message);
    }
  }

  // ── Status polling ────────────────────────────────────────────

  async function checkStatus(orderNo) {
    try {
      var data = await apiGet('/api/payments/order-status?orderNo=' + encodeURIComponent(orderNo));
      if (data.status === 'paid') {
        stopPoll();
        var product = PRODUCTS.find(function (p) { return p.key === _state.productKey; });
        renderPayModal({ phase: 'paid', product: product });
      } else if (data.status === 'failed' || data.status === 'closed') {
        stopPoll();
        var product = PRODUCTS.find(function (p) { return p.key === _state.productKey; });
        renderPayModal({ phase: 'failed', product: product });
      }
    } catch (_) {}
  }

  function startPollStatus(orderNo) {
    stopPoll();
    _state.pollTimer = setInterval(function () { checkStatus(orderNo); }, 3000);
  }

  function stopPoll() {
    if (_state.pollTimer) {
      clearInterval(_state.pollTimer);
      _state.pollTimer = null;
    }
  }

  // ── Init ──────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    // Backdrop click closes modals
    var payModal = qs('pay-modal');
    if (payModal) {
      payModal.addEventListener('click', function (e) {
        if (e.target === payModal) closePayModal();
      });
    }

    var shopModal = qs('pay-shop-modal');
    if (shopModal) {
      shopModal.addEventListener('click', function (e) {
        if (e.target === shopModal) hide('pay-shop-modal');
      });
    }

    // Close shop button
    var shopClose = qs('pay-shop-close');
    if (shopClose) shopClose.addEventListener('click', function () { hide('pay-shop-modal'); });

    // Render product grid in shop modal
    renderProducts('pay-shop-products');

    // Entry buttons (data-pay-product="key" → direct buy, no key → open shop)
    document.querySelectorAll('[data-pay-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.payOpen;
        if (key && key !== 'shop') {
          startPurchase(key);
        } else {
          show('pay-shop-modal');
        }
      });
    });
  });

  // ── Public API ────────────────────────────────────────────────

  window.PaymentPanel = {
    openShop: function () { show('pay-shop-modal'); },
    buy: function (productKey) { startPurchase(productKey); },
    close: closePayModal,
  };

}());
