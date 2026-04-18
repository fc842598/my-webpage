/**
 * payment.js — 支付前端
 *
 * 两种模式自动切换：
 *   ① 后端可用（Supabase 表已建）→ 调后端 API，走真实数据库
 *   ② 后端不可用 / 返回错误       → 自动切本地 mock，全流程在浏览器跑
 *
 * 真实微信支付：后端 WECHAT_PAY_MODE=real + 填好所有 env 即可，前端不用改。
 */
(function () {
  'use strict';

  var BACKEND = 'https://ai-piming-backend-production.up.railway.app';

  var PRODUCTS = [
    { key: 'overall_report',  name: '整体批命',         desc: '完整紫微斗数命盘解读，事业感情财运全覆盖', price: '29.00', icon: '☆' },
    { key: 'shengong_report', name: '身宫专项',          desc: '身宫与后天倾向深度解读',                   price: '19.00', icon: '◈' },
    { key: 'dayun_report',    name: '大运流年专项',      desc: '大运叠加流年，精准定位当前阶段',           price: '24.00', icon: '◉' },
    { key: 'chat_package',    name: '许半仙深度对话包',  desc: '30次深度命理追问对话',                     price: '39.00', icon: '❋' },
    { key: 'vip_upgrade',     name: '高级版',            desc: '解锁全部功能与对话',                       price: '99.00', icon: '✦' },
  ];

  var ENTITLEMENT_LABELS = {
    overall_report:  '已解锁整体批命',
    shengong_report: '已解锁身宫专项',
    dayun_report:    '已解锁大运流年专项',
    chat_package:    '已解锁许半仙深度对话包（30次）',
    vip_upgrade:     '已升级为高级版，全功能解锁',
  };

  // ── 状态 ─────────────────────────────────────────────────────
  var _s = {
    orderNo: null,
    productKey: null,
    isMock: false,      // true = 本地mock，false = 已对接后端
    pollTimer: null,
  };

  // ── DOM ──────────────────────────────────────────────────────
  function show(id) { var e = document.getElementById(id); if (e) e.style.display = 'flex'; }
  function hide(id) { var e = document.getElementById(id); if (e) e.style.display = 'none'; }
  function qs(id)   { return document.getElementById(id); }

  // ── 本地 Mock ─────────────────────────────────────────────────
  // 完全在浏览器内跑，不依赖后端 DB，用于 Supabase 表未建时

  var _mockOrders = {};   // orderNo → { status, productKey, ... }

  function _mockGenerateOrderNo() {
    var now = new Date();
    var p = function(n,l){ return String(n).padStart(l,'0'); };
    var d = now.getFullYear() + p(now.getMonth()+1,2) + p(now.getDate(),2);
    var t = p(now.getHours(),2) + p(now.getMinutes(),2) + p(now.getSeconds(),2);
    return 'MOCK' + d + t + p(Math.floor(Math.random()*10000),4);
  }

  function _mockCreateOrder(productKey) {
    var product = PRODUCTS.find(function(p){ return p.key === productKey; });
    var orderNo = _mockGenerateOrderNo();
    _mockOrders[orderNo] = {
      orderNo: orderNo,
      productKey: productKey,
      productName: product ? product.name : productKey,
      amountYuan: product ? product.price : '0.00',
      status: 'pending',
      mockMode: true,
    };
    return _mockOrders[orderNo];
  }

  function _mockComplete(orderNo) {
    if (_mockOrders[orderNo]) _mockOrders[orderNo].status = 'paid';
  }

  function _mockFail(orderNo) {
    if (_mockOrders[orderNo]) _mockOrders[orderNo].status = 'failed';
  }

  // ── API（优先后端，失败降级本地 mock）──────────────────────────

  async function tryPost(path, body) {
    try {
      var resp = await fetch(BACKEND + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      var json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'API error');
      return { ok: true, data: json };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async function tryGet(path) {
    try {
      var resp = await fetch(BACKEND + path);
      var json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'API error');
      return { ok: true, data: json };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  // ── 购买流程 ──────────────────────────────────────────────────

  async function startPurchase(productKey) {
    _s.productKey = productKey;
    _s.orderNo = null;
    _s.isMock = false;
    stopPoll();

    var product = PRODUCTS.find(function(p){ return p.key === productKey; });
    show('pay-modal');
    renderModal({ phase: 'loading', product: product });

    // 先试后端
    var r1 = await tryPost('/api/payments/create-order', {
      productKey: productKey,
      chartRecordId: window._chartRecordId || null,
    });

    if (!r1.ok) {
      // 后端不可用 → 本地 mock
      _s.isMock = true;
      var mockOrder = _mockCreateOrder(productKey);
      _s.orderNo = mockOrder.orderNo;
      renderModal({ phase: 'pending', product: product, order: mockOrder,
        tip: '当前为本地模拟模式（后端 DB 未就绪）。点击「模拟支付成功」测试完整流程。' });
      return;
    }

    // 后端正常
    _s.orderNo = r1.data.orderNo;
    _s.isMock = !!r1.data.mockMode;

    var r2 = await tryPost('/api/payments/create-session', {
      orderNo: r1.data.orderNo,
      payMethod: 'native',
    });

    var tip = (r2.ok && r2.data.tip) ? r2.data.tip
      : (_s.isMock ? '模拟模式：点击「模拟支付成功」测试完整流程。' : '');

    renderModal({ phase: 'pending', product: product, order: r1.data, tip: tip });
    startPoll(_s.orderNo);
  }

  // ── Modal 渲染 ────────────────────────────────────────────────

  function renderModal(opts) {
    var wrap = qs('pay-modal-content');
    if (!wrap) return;
    var product = opts.product || {};
    var order   = opts.order   || {};
    var phase   = opts.phase   || 'loading';
    var tip     = opts.tip     || '';

    var mockLabel = (_s.isMock || (order.mockMode))
      ? '<span class="pay-mock-badge">模拟模式</span>' : '';

    var body = '';

    if (phase === 'loading') {
      body = '<div class="pay-spinner"></div><div class="pay-loading-text">正在创建订单…</div>';

    } else if (phase === 'pending') {
      var mockBtns =
        '<div class="pay-mock-btns">' +
          '<div class="pay-mock-label">🧪 Mock 测试</div>' +
          '<button class="pay-mock-btn pay-mock-success" id="pm-ok">✓ 模拟支付成功</button>' +
          '<button class="pay-mock-btn pay-mock-fail"    id="pm-fail">✕ 模拟支付失败</button>' +
          '<button class="pay-mock-btn pay-mock-refresh" id="pm-refresh">↻ 刷新状态</button>' +
        '</div>';

      body =
        '<div class="pay-order-row"><span>订单号</span><code>' + (_s.orderNo || '') + '</code></div>' +
        '<div class="pay-order-row"><span>商品</span><span>'   + (product.name || '') + '</span></div>' +
        '<div class="pay-order-row"><span>金额</span><strong>¥' + (order.amountYuan || product.price || '') + '</strong></div>' +
        '<div class="pay-order-row"><span>状态</span><span class="pay-state pay-state-pending">待支付</span></div>' +
        (tip ? '<div class="pay-tip">' + tip + '</div>' : '') +
        mockBtns;

    } else if (phase === 'paid') {
      body =
        '<div class="pay-success-icon">✓</div>' +
        '<div class="pay-success-title">支付成功</div>' +
        '<div class="pay-order-row"><span>订单号</span><code>' + (_s.orderNo || '') + '</code></div>' +
        '<div class="pay-entitlement">' + (ENTITLEMENT_LABELS[_s.productKey] || '权益已发放') + '</div>';

    } else if (phase === 'failed') {
      body =
        '<div class="pay-fail-icon">✕</div>' +
        '<div class="pay-fail-title">支付失败</div>' +
        '<div class="pay-order-row"><span>订单号</span><code>' + (_s.orderNo || '') + '</code></div>' +
        '<button class="pay-retry-btn" id="pm-retry">重新购买</button>';

    } else if (phase === 'error') {
      body =
        '<div class="pay-fail-icon">!</div>' +
        '<div class="pay-fail-title">出错了</div>' +
        '<div class="pay-error-msg">' + (opts.error || '未知错误') + '</div>' +
        '<button class="pay-retry-btn" id="pm-retry">重试</button>';
    }

    wrap.innerHTML =
      '<div class="pay-modal-head">' +
        '<span class="pay-modal-title">' + (product.name || '购买服务') + '</span>' +
        mockLabel +
        '<button class="pay-modal-close" id="pm-close">×</button>' +
      '</div>' +
      '<div class="pay-modal-body">' + body + '</div>';

    // 绑定事件
    var el;
    el = qs('pm-close');   if (el) el.onclick = closeModal;
    el = qs('pm-retry');   if (el) el.onclick = function(){ if (_s.productKey) startPurchase(_s.productKey); };
    el = qs('pm-ok');      if (el) el.onclick = doSuccess;
    el = qs('pm-fail');    if (el) el.onclick = doFail;
    el = qs('pm-refresh'); if (el) el.onclick = function(){ if (_s.orderNo) checkStatus(_s.orderNo); };
  }

  function closeModal() {
    stopPoll();
    hide('pay-modal');
  }

  // ── Mock 操作 ─────────────────────────────────────────────────

  async function doSuccess() {
    if (!_s.orderNo) return;
    var btn = qs('pm-ok');
    if (btn) btn.disabled = true;
    stopPoll();

    if (_s.isMock) {
      // 本地 mock：直接改状态
      _mockComplete(_s.orderNo);
    } else {
      // 后端 mock 模式：调 API
      var r = await tryPost('/api/payments/mock/complete', { orderNo: _s.orderNo });
      if (!r.ok) { if (btn) btn.disabled = false; alert('模拟失败：' + r.error); return; }
    }

    var product = PRODUCTS.find(function(p){ return p.key === _s.productKey; });
    renderModal({ phase: 'paid', product: product });
  }

  async function doFail() {
    if (!_s.orderNo) return;
    var btn = qs('pm-fail');
    if (btn) btn.disabled = true;
    stopPoll();

    if (_s.isMock) {
      _mockFail(_s.orderNo);
    } else {
      var r = await tryPost('/api/payments/mock/fail', { orderNo: _s.orderNo, reason: '用户取消' });
      if (!r.ok) { if (btn) btn.disabled = false; alert('操作失败：' + r.error); return; }
    }

    var product = PRODUCTS.find(function(p){ return p.key === _s.productKey; });
    renderModal({ phase: 'failed', product: product });
  }

  // ── 轮询（仅后端模式需要）────────────────────────────────────

  async function checkStatus(orderNo) {
    var r = await tryGet('/api/payments/order-status?orderNo=' + encodeURIComponent(orderNo));
    if (!r.ok) return;
    var product = PRODUCTS.find(function(p){ return p.key === _s.productKey; });
    if (r.data.status === 'paid') {
      stopPoll();
      renderModal({ phase: 'paid', product: product });
    } else if (r.data.status === 'failed' || r.data.status === 'closed') {
      stopPoll();
      renderModal({ phase: 'failed', product: product });
    }
  }

  function startPoll(orderNo) {
    stopPoll();
    _s.pollTimer = setInterval(function(){ checkStatus(orderNo); }, 3000);
  }

  function stopPoll() {
    if (_s.pollTimer) { clearInterval(_s.pollTimer); _s.pollTimer = null; }
  }

  // ── 商品列表渲染 ──────────────────────────────────────────────

  function renderProducts(containerId) {
    var c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = PRODUCTS.map(function(p) {
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
    c.querySelectorAll('.pay-product-btn').forEach(function(btn) {
      btn.onclick = function() {
        hide('pay-shop-modal');
        startPurchase(btn.dataset.key);
      };
    });
  }

  // ── 初始化 ────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function() {
    // 遮罩点击关闭
    var payModal = qs('pay-modal');
    if (payModal) payModal.onclick = function(e){ if (e.target === payModal) closeModal(); };

    var shopModal = qs('pay-shop-modal');
    if (shopModal) shopModal.onclick = function(e){ if (e.target === shopModal) hide('pay-shop-modal'); };

    var shopClose = qs('pay-shop-close');
    if (shopClose) shopClose.onclick = function(){ hide('pay-shop-modal'); };

    renderProducts('pay-shop-products');

    // data-pay-open 属性绑定
    document.querySelectorAll('[data-pay-open]').forEach(function(btn) {
      btn.onclick = function() {
        var key = btn.dataset.payOpen;
        if (key && key !== 'shop') { startPurchase(key); }
        else { show('pay-shop-modal'); }
      };
    });
  });

  // ── 外部 API ──────────────────────────────────────────────────
  window.PaymentPanel = {
    openShop: function(){ show('pay-shop-modal'); },
    buy: startPurchase,
    close: closeModal,
  };

}());
