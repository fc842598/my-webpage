/**
 * payment.js — 许半仙月度会员支付
 *
 * 环境自动适配：
 *   本地开发 (localhost/127.0.0.1): 后端不可用时降级为本地 mock，完整测试流程
 *   生产环境: 后端不可用时显示「支付服务暂不可用」，不暴露 mock 入口
 *
 * 后端就绪后：
 *   mock 模式 (WECHAT_PAY_MODE≠real): 显示 Mock 测试按钮
 *   真实模式 (WECHAT_PAY_MODE=real):
 *     native — 渲染微信扫码二维码
 *     h5     — 显示「在微信中打开」跳转按钮
 */
(function () {
  'use strict';

  var BACKEND = 'https://ai-piming-backend-production.up.railway.app';
  var CHAT_QUOTA_UNLIMITED = true;

  // 本地兜底商品（backend 不可用时使用）
  var PRODUCT = {
    key:   'monthly_member',
    name:  '许半仙月度会员',
    desc:  '每日200次AI命理对话，解锁许半仙完整功能',
    price: '19.90',
    icon:  '✦',
    perks: ['每日200次深度命理对话', '许半仙带命盘记忆持续作答', '支持感情/事业/流年全方位追问', '会员标识显示'],
  };

  var _s = {
    orderNo:   null,
    isMock:    false,
    pollTimer: null,
    payUrl:    null,
    payMethod: 'native',
  };

  function isLocalDev() {
    var h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '';
  }

  // ── DOM ──────────────────────────────────────────────────────
  function show(id) { var e = document.getElementById(id); if (e) e.style.display = 'flex'; }
  function hide(id) { var e = document.getElementById(id); if (e) e.style.display = 'none'; }
  function qs(id)   { return document.getElementById(id); }

  // ── 本地 Mock（仅本地开发，后端不可用时降级）─────────────────
  var _mockOrders = {};

  function _mockOrderNo() {
    var p = function(n,l){ return String(n).padStart(l,'0'); };
    var d = new Date();
    return 'MOCK' + d.getFullYear() + p(d.getMonth()+1,2) + p(d.getDate(),2)
           + p(d.getHours(),2) + p(d.getMinutes(),2) + p(d.getSeconds(),2)
           + p(Math.floor(Math.random()*9999),4);
  }

  // ── API（失败自动降级）──────────────────────────────────────
  async function tryPost(path, body) {
    try {
      var r = await fetch(BACKEND + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      var j = await r.json();
      if (!r.ok) throw new Error(j.error || 'error');
      return { ok: true, data: j };
    } catch (e) { return { ok: false, error: e.message }; }
  }

  async function tryGet(path) {
    try {
      var r = await fetch(BACKEND + path);
      var j = await r.json();
      if (!r.ok) throw new Error(j.error || 'error');
      return { ok: true, data: j };
    } catch (e) { return { ok: false, error: e.message }; }
  }

  function normalizeQuota(quota) {
    var normalized = quota || {};
    if (!CHAT_QUOTA_UNLIMITED) return normalized;
    return {
      testingUnlimited: true,
      isMember: !!normalized.isMember,
      dailyLimit: null,
      remaining: null,
    };
  }

  // ── 启动时拉取后端商品（保持价格/描述与 DB 一致）──────────
  async function fetchBackendProduct() {
    var r = await tryGet('/api/payments/products');
    if (!r.ok || !r.data.products || !r.data.products.length) return;
    var p = r.data.products.find(function(x){ return x.productKey === PRODUCT.key; });
    if (p) {
      PRODUCT.name  = p.name  || PRODUCT.name;
      PRODUCT.price = p.amountYuan || PRODUCT.price;
      PRODUCT.desc  = p.description || PRODUCT.desc;
    }
  }

  // ── 购买流程 ──────────────────────────────────────────────────
  async function startPurchase() {
    _s.orderNo  = null;
    _s.isMock   = false;
    _s.payUrl   = null;
    _s.payMethod = 'native';
    stopPoll();
    show('pay-modal');
    renderModal('loading');

    var r1 = await tryPost('/api/payments/create-order', {
      productKey:     PRODUCT.key,
      chartRecordId:  window._chartRecordId || null,
    });

    if (!r1.ok) {
      if (isLocalDev()) {
        // 本地开发：降级本地 mock
        _s.isMock   = true;
        _s.orderNo  = _mockOrderNo();
        _mockOrders[_s.orderNo] = 'pending';
        renderModal('pending', {
          orderNo: _s.orderNo,
          tip: '本地模拟模式（后端 DB 未就绪）',
        });
      } else {
        // 生产环境：直接告知服务不可用
        renderModal('unavailable');
      }
      return;
    }

    _s.orderNo  = r1.data.orderNo;
    _s.isMock   = !!r1.data.mockMode;

    var r2 = await tryPost('/api/payments/create-session', {
      orderNo:   _s.orderNo,
      payMethod: _s.payMethod,
    });

    if (r2.ok) {
      _s.payUrl    = r2.data.payUrl  || null;
      _s.payMethod = r2.data.payMethod || _s.payMethod;
    }

    var tip = '';
    if (_s.isMock) {
      tip = '模拟模式：点击「模拟支付成功」测试完整流程。';
    } else if (_s.payMethod === 'h5') {
      tip = '请点击下方按钮，在微信中完成支付。';
    } else {
      tip = '请使用微信扫描二维码完成支付。';
    }

    renderModal('pending', { orderNo: _s.orderNo, tip: tip });
    if (!_s.isMock) startPoll(_s.orderNo);
  }

  // ── QR 码渲染 ─────────────────────────────────────────────────
  function renderQR(containerId, url) {
    var el = qs(containerId);
    if (!el || !url) return;
    if (typeof QRCode !== 'undefined') {
      QRCode.toCanvas(el, url, { width: 180, margin: 1 }, function(err) {
        if (err) el.title = url;
      });
    } else {
      el.style.display = 'none';
      var fallback = document.createElement('div');
      fallback.className = 'pay-qr-fallback';
      fallback.textContent = '二维码加载失败，请刷新重试';
      el.parentNode.insertBefore(fallback, el);
    }
  }

  // ── Modal 渲染 ────────────────────────────────────────────────
  function renderModal(phase, data) {
    var wrap = qs('pay-modal-content');
    if (!wrap) return;
    data = data || {};

    var mockBadge = _s.isMock ? '<span class="pay-mock-badge">模拟模式</span>' : '';
    var body = '';

    if (phase === 'loading') {
      body = '<div class="pay-spinner"></div><div class="pay-loading-text">正在创建订单…</div>';

    } else if (phase === 'pending') {
      var lines = (data.tip || '').replace(/\n/g, '<br>');

      // QR code / H5 button / mock buttons area
      var actionArea = '';
      if (_s.isMock) {
        actionArea =
          '<div class="pay-mock-btns">' +
            '<div class="pay-mock-label">🧪 Mock 测试</div>' +
            '<button class="pay-mock-btn pay-mock-success" id="pm-ok">✓ 模拟支付成功</button>' +
            '<button class="pay-mock-btn pay-mock-fail"    id="pm-fail">✕ 模拟支付失败</button>' +
            '<button class="pay-mock-btn pay-mock-refresh" id="pm-refresh">↻ 刷新状态</button>' +
          '</div>';
      } else if (_s.payUrl && _s.payMethod === 'h5') {
        actionArea =
          '<div class="pay-h5-area">' +
            '<a class="pay-h5-btn" href="' + encodeURI(_s.payUrl) + '" target="_blank" rel="noopener">在微信中打开并支付</a>' +
            '<button class="pay-mock-btn pay-mock-refresh" id="pm-refresh" style="margin-top:8px">↻ 已支付，刷新状态</button>' +
          '</div>';
      } else if (_s.payUrl) {
        actionArea =
          '<div class="pay-qr-area">' +
            '<canvas id="pay-qr-canvas"></canvas>' +
            '<div class="pay-qr-hint">微信扫码支付</div>' +
          '</div>';
      } else {
        // payUrl not ready yet — show refresh only
        actionArea =
          '<div class="pay-mock-btns">' +
            '<button class="pay-mock-btn pay-mock-refresh" id="pm-refresh">↻ 刷新状态</button>' +
          '</div>';
      }

      body =
        '<div class="pay-order-row"><span>商品</span><span>' + PRODUCT.name + '</span></div>' +
        '<div class="pay-order-row"><span>实付金额</span><strong>¥' + PRODUCT.price + '<span style="font-size:13px;font-weight:400;color:#7a6a4a;margin-left:2px">/ 月</span></strong></div>' +
        '<div class="pay-order-row"><span>订单号</span><code>' + (data.orderNo || '') + '</code></div>' +
        '<div class="pay-order-row"><span>状态</span><span class="pay-state pay-state-pending">待支付</span></div>' +
        (lines ? '<div class="pay-tip">' + lines + '</div>' : '') +
        actionArea;

    } else if (phase === 'paid') {
      body =
        '<div class="pay-success-icon">✓</div>' +
        '<div class="pay-success-title">支付成功，已开通会员</div>' +
        '<div class="pay-order-row"><span>订单号</span><code>' + (_s.orderNo || '') + '</code></div>' +
        '<div class="pay-entitlement">✦ 许半仙月度会员已激活<br>每日200次AI命理对话额度已就绪</div>' +
        '<button class="pay-retry-btn" id="pm-close-ok" style="margin-top:12px">开始使用</button>';

    } else if (phase === 'failed') {
      body =
        '<div class="pay-fail-icon">✕</div>' +
        '<div class="pay-fail-title">支付失败</div>' +
        '<div class="pay-order-row"><span>订单号</span><code>' + (_s.orderNo || '') + '</code></div>' +
        '<button class="pay-retry-btn" id="pm-retry">重新支付</button>';

    } else if (phase === 'unavailable') {
      body =
        '<div class="pay-fail-icon">!</div>' +
        '<div class="pay-fail-title">支付服务暂不可用</div>' +
        '<div class="pay-error-msg">支付通道正在维护，请稍后再试。</div>' +
        '<button class="pay-retry-btn" id="pm-retry">稍后重试</button>';

    } else if (phase === 'error') {
      body =
        '<div class="pay-fail-icon">!</div>' +
        '<div class="pay-fail-title">出错了</div>' +
        '<div class="pay-error-msg">' + (data.error || '未知错误') + '</div>' +
        '<button class="pay-retry-btn" id="pm-retry">重试</button>';
    }

    wrap.innerHTML =
      '<div class="pay-modal-head">' +
        '<span class="pay-modal-title">' + PRODUCT.name + '</span>' +
        mockBadge +
        '<button class="pay-modal-close" id="pm-close">×</button>' +
      '</div>' +
      '<div class="pay-modal-body">' + body + '</div>';

    var el;
    el = qs('pm-close');    if (el) el.onclick = closeModal;
    el = qs('pm-close-ok'); if (el) el.onclick = function(){ closeModal(); location.reload(); };
    el = qs('pm-retry');    if (el) el.onclick = startPurchase;
    el = qs('pm-ok');       if (el) el.onclick = doSuccess;
    el = qs('pm-fail');     if (el) el.onclick = doFail;
    el = qs('pm-refresh');  if (el) el.onclick = function(){ if (_s.orderNo) checkStatus(_s.orderNo); };

    // Render QR code after DOM is ready
    if (phase === 'pending' && !_s.isMock && _s.payUrl && _s.payMethod !== 'h5') {
      renderQR('pay-qr-canvas', _s.payUrl);
    }
  }

  function closeModal() { stopPoll(); hide('pay-modal'); }

  // ── Mock 操作 ─────────────────────────────────────────────────
  async function doSuccess() {
    var btn = qs('pm-ok');
    if (btn) btn.disabled = true;
    stopPoll();

    if (_s.isMock && !_s.orderNo.startsWith('MOCK')) {
      // Backend mock mode
      var r = await tryPost('/api/payments/mock/complete', { orderNo: _s.orderNo });
      if (!r.ok) { if (btn) btn.disabled = false; alert('模拟失败：' + r.error); return; }
    } else if (_s.orderNo) {
      // Local mock
      _mockOrders[_s.orderNo] = 'paid';
    }
    renderModal('paid');
    updateQuotaDisplay({ isMember: true, dailyLimit: 200, remaining: 200 });
  }

  async function doFail() {
    var btn = qs('pm-fail');
    if (btn) btn.disabled = true;
    stopPoll();

    if (_s.isMock && !_s.orderNo.startsWith('MOCK')) {
      await tryPost('/api/payments/mock/fail', { orderNo: _s.orderNo, reason: '用户取消' });
    } else if (_s.orderNo) {
      _mockOrders[_s.orderNo] = 'failed';
    }
    renderModal('failed');
  }

  // ── 状态轮询 ──────────────────────────────────────────────────
  async function checkStatus(orderNo) {
    var r = await tryGet('/api/payments/order-status?orderNo=' + encodeURIComponent(orderNo));
    if (!r.ok) return;
    var st = r.data.status;
    if (st === 'paid') { stopPoll(); renderModal('paid'); updateQuotaDisplay({ isMember: true, dailyLimit: 200, remaining: 200 }); }
    else if (st === 'failed' || st === 'closed') { stopPoll(); renderModal(st === 'closed' ? 'error' : 'failed', { error: st === 'closed' ? '订单已过期，请重新下单' : '' }); }
  }

  function startPoll(no) {
    stopPoll();
    _s.pollTimer = setInterval(function(){ checkStatus(no); }, 3000);
  }
  function stopPoll() {
    if (_s.pollTimer) { clearInterval(_s.pollTimer); _s.pollTimer = null; }
  }

  // ── 配额显示（由 ai-chat.js 返回的 quota 字段驱动）──────────
  function updateQuotaDisplay(quota) {
    quota = normalizeQuota(quota);
    if (!quota) return;
    var bar = qs('chat-quota-bar');
    var txt = qs('chat-quota-text');
    var upg = qs('chat-quota-upgrade');
    if (!bar || !txt) return;

    bar.style.display = 'flex';

    var defaultPlaceholder = '问一个问题… 命理、运势、感情、事业都可以';
    if (quota.testingUnlimited) {
      txt.textContent = '测试期不限次数';
      txt.className = 'chat-quota-text chat-quota-member';
      txt.textContent = '当前不限次数';
      if (upg) upg.style.display = 'none';
      var testingInput = qs('chat-input');
      var testingBtn = qs('chat-send-btn');
      if (testingInput) {
        testingInput.disabled = false;
        testingInput.placeholder = defaultPlaceholder;
      }
      if (testingBtn) testingBtn.disabled = false;
      return;
    }

    if (quota.isMember) {
      txt.textContent = '会员 · 今日剩余 ' + quota.remaining + ' 次';
      txt.className = 'chat-quota-text chat-quota-member';
      if (upg) upg.style.display = 'none';
    } else {
      txt.textContent = '今日剩余 ' + quota.remaining + ' 次（免费）';
      txt.className = 'chat-quota-text';
      if (upg) upg.style.display = quota.remaining <= 2 ? 'inline-block' : 'none';
    }

    var chatInput = qs('chat-input');
    var chatBtn   = qs('chat-send-btn');
    if (chatInput) {
      chatInput.disabled = false;
      chatInput.placeholder = defaultPlaceholder;
    }
    if (chatBtn) chatBtn.disabled = false;
    if (quota.remaining === 0) {
      if (chatInput) { chatInput.disabled = true; chatInput.placeholder = '今日额度已用完，开通会员继续使用'; }
      if (chatBtn)   chatBtn.disabled = true;
      if (upg)       upg.style.display = 'inline-block';
    }
  }

  window._updateQuotaDisplay = updateQuotaDisplay;

  // ── 商城弹层渲染（单品卡片）────────────────────────────────
  function renderShop(containerId) {
    var c = document.getElementById(containerId);
    if (!c) return;
    var perks = PRODUCT.perks.map(function(p){ return '<li>' + p + '</li>'; }).join('');
    c.innerHTML =
      '<div class="pay-member-card">' +
        '<div class="pay-member-hero">' +
          '<div class="pay-member-icon-wrap">' +
            '<span class="pay-member-icon">' + PRODUCT.icon + '</span>' +
          '</div>' +
          '<div class="pay-member-hero-text">' +
            '<div class="pay-member-name">' + PRODUCT.name + '</div>' +
            '<div class="pay-member-tagline">每日200次 · 解锁全功能</div>' +
          '</div>' +
          '<button class="pay-member-close-btn" id="pay-shop-close">×</button>' +
        '</div>' +
        '<div class="pay-member-price-wrap">' +
          '<span class="pay-member-currency">¥</span>' +
          '<span class="pay-member-amount">' + PRODUCT.price + '</span>' +
          '<span class="pay-member-period">/ 月</span>' +
        '</div>' +
        '<ul class="pay-member-perks">' + perks + '</ul>' +
        '<button class="pay-product-btn" id="pay-shop-buy-btn">' + PRODUCT.icon + ' 立即开通</button>' +
        '<div class="pay-member-note">支持微信支付 · 随时可取消</div>' +
      '</div>';
    var btn = qs('pay-shop-buy-btn');
    if (btn) btn.onclick = function(){ hide('pay-shop-modal'); startPurchase(); };
    var closeBtn = qs('pay-shop-close');
    if (closeBtn) closeBtn.onclick = function(){ hide('pay-shop-modal'); };
  }

  // ── 初始化 ────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    var payModal  = qs('pay-modal');
    var shopModal = qs('pay-shop-modal');
    if (payModal)  payModal.onclick  = function(e){ if (e.target === payModal)  closeModal(); };
    if (shopModal) shopModal.onclick = function(e){ if (e.target === shopModal) hide('pay-shop-modal'); };

    var shopClose = qs('pay-shop-close');
    if (shopClose) shopClose.onclick = function(){ hide('pay-shop-modal'); };

    renderShop('pay-shop-products');

    document.querySelectorAll('[data-pay-open]').forEach(function(btn) {
      btn.onclick = function() {
        var key = btn.dataset.payOpen;
        if (key === 'shop' || !key) { show('pay-shop-modal'); }
        else { startPurchase(); }
      };
    });

    // 拉取后端商品后刷新商城卡片
    fetchBackendProduct().then(function() {
      renderShop('pay-shop-products');
    });
    updateQuotaDisplay({ testingUnlimited: true, isMember: false, dailyLimit: null, remaining: null });
  });

  window.PaymentPanel = {
    openShop:    function(){ show('pay-shop-modal'); },
    buy:         startPurchase,
    close:       closeModal,
    updateQuota: updateQuotaDisplay,
  };

}());
