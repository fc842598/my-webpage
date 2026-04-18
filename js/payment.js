/**
 * payment.js — 许半仙月度会员支付
 *
 * 模式自动切换：
 *   后端 DB 就绪 → 调后端 API，订单入库
 *   后端不可用   → 本地 mock，全程在浏览器跑，不依赖数据库
 *
 * 真实微信支付：后端填好 WECHAT_PAY_* env 即可，前端零改动。
 */
(function () {
  'use strict';

  var BACKEND = 'https://ai-piming-backend-production.up.railway.app';

  var PRODUCT = {
    key:   'monthly_member',
    name:  '许半仙月度会员',
    desc:  '每日200次AI命理对话，解锁许半仙完整功能',
    price: '19.90',
    icon:  '✦',
    perks: ['每日200次深度命理对话', '许半仙带命盘记忆持续作答', '支持感情/事业/流年全方位追问', '会员标识显示'],
  };

  var _s = { orderNo: null, isMock: false, pollTimer: null };

  // ── DOM ──────────────────────────────────────────────────────
  function show(id) { var e = document.getElementById(id); if (e) e.style.display = 'flex'; }
  function hide(id) { var e = document.getElementById(id); if (e) e.style.display = 'none'; }
  function qs(id)   { return document.getElementById(id); }

  // ── 本地 Mock（后端不可用时的降级）──────────────────────────
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

  // ── 购买流程 ──────────────────────────────────────────────────
  async function startPurchase() {
    _s.orderNo = null;
    _s.isMock = false;
    stopPoll();
    show('pay-modal');
    renderModal('loading');

    var r1 = await tryPost('/api/payments/create-order', {
      productKey: PRODUCT.key,
      chartRecordId: window._chartRecordId || null,
    });

    if (!r1.ok) {
      // 后端不可用 → 本地 mock
      _s.isMock = true;
      _s.orderNo = _mockOrderNo();
      _mockOrders[_s.orderNo] = 'pending';
      renderModal('pending', {
        orderNo: _s.orderNo,
        tip: '当前为本地模拟模式（后端 DB 未就绪）。\n点击「模拟支付成功」测试完整流程。',
      });
      return;
    }

    _s.orderNo = r1.data.orderNo;
    _s.isMock = !!r1.data.mockMode;

    await tryPost('/api/payments/create-session', { orderNo: _s.orderNo, payMethod: 'native' });

    renderModal('pending', {
      orderNo: _s.orderNo,
      tip: _s.isMock ? '模拟模式：点击「模拟支付成功」测试完整流程。' : '请扫码或前往微信完成支付。',
    });
    startPoll(_s.orderNo);
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
      body =
        '<div class="pay-order-row"><span>商品</span><span>' + PRODUCT.name + '</span></div>' +
        '<div class="pay-order-row"><span>金额</span><strong>¥' + PRODUCT.price + ' / 月</strong></div>' +
        '<div class="pay-order-row"><span>订单号</span><code>' + (data.orderNo || '') + '</code></div>' +
        '<div class="pay-order-row"><span>状态</span><span class="pay-state pay-state-pending">待支付</span></div>' +
        (lines ? '<div class="pay-tip">' + lines + '</div>' : '') +
        '<div class="pay-mock-btns">' +
          '<div class="pay-mock-label">🧪 Mock 测试</div>' +
          '<button class="pay-mock-btn pay-mock-success" id="pm-ok">✓ 模拟支付成功</button>' +
          '<button class="pay-mock-btn pay-mock-fail"    id="pm-fail">✕ 模拟支付失败</button>' +
          '<button class="pay-mock-btn pay-mock-refresh" id="pm-refresh">↻ 刷新状态</button>' +
        '</div>';

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
  }

  function closeModal() { stopPoll(); hide('pay-modal'); }

  // ── Mock 操作 ─────────────────────────────────────────────────
  async function doSuccess() {
    var btn = qs('pm-ok');
    if (btn) btn.disabled = true;
    stopPoll();

    if (_s.isMock) {
      if (_s.orderNo) _mockOrders[_s.orderNo] = 'paid';
      renderModal('paid');
    } else {
      var r = await tryPost('/api/payments/mock/complete', { orderNo: _s.orderNo });
      if (!r.ok) { if (btn) btn.disabled = false; alert('模拟失败：' + r.error); return; }
      renderModal('paid');
    }
    updateQuotaDisplay({ isMember: true, dailyLimit: 200, remaining: 200 });
  }

  async function doFail() {
    var btn = qs('pm-fail');
    if (btn) btn.disabled = true;
    stopPoll();

    if (_s.isMock) {
      if (_s.orderNo) _mockOrders[_s.orderNo] = 'failed';
    } else {
      await tryPost('/api/payments/mock/fail', { orderNo: _s.orderNo, reason: '用户取消' });
    }
    renderModal('failed');
  }

  // ── 状态轮询 ──────────────────────────────────────────────────
  async function checkStatus(orderNo) {
    var r = await tryGet('/api/payments/order-status?orderNo=' + encodeURIComponent(orderNo));
    if (!r.ok) return;
    if (r.data.status === 'paid') { stopPoll(); renderModal('paid'); }
    else if (r.data.status === 'failed' || r.data.status === 'closed') { stopPoll(); renderModal('failed'); }
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
    if (!quota) return;
    var bar = qs('chat-quota-bar');
    var txt = qs('chat-quota-text');
    var upg = qs('chat-quota-upgrade');
    if (!bar || !txt) return;

    bar.style.display = 'flex';

    if (quota.isMember) {
      txt.textContent = '会员 · 今日剩余 ' + quota.remaining + ' 次';
      txt.className = 'chat-quota-text chat-quota-member';
      if (upg) upg.style.display = 'none';
    } else {
      txt.textContent = '今日剩余 ' + quota.remaining + ' 次（免费）';
      txt.className = 'chat-quota-text';
      if (upg) upg.style.display = quota.remaining <= 2 ? 'inline-block' : 'none';
    }

    // 配额为 0 时禁用输入框
    var chatInput = qs('chat-input');
    var chatBtn   = qs('chat-send-btn');
    if (quota.remaining === 0) {
      if (chatInput) { chatInput.disabled = true; chatInput.placeholder = '今日额度已用完，开通会员继续使用'; }
      if (chatBtn)   chatBtn.disabled = true;
      if (upg)       upg.style.display = 'inline-block';
    }
  }

  // 供 ai-chat.js 调用
  window._updateQuotaDisplay = updateQuotaDisplay;

  // ── 商城弹层渲染（单品卡片）────────────────────────────────
  function renderShop(containerId) {
    var c = document.getElementById(containerId);
    if (!c) return;
    var perks = PRODUCT.perks.map(function(p){ return '<li>' + p + '</li>'; }).join('');
    c.innerHTML =
      '<div class="pay-member-card">' +
        '<div class="pay-member-icon">' + PRODUCT.icon + '</div>' +
        '<div class="pay-member-name">' + PRODUCT.name + '</div>' +
        '<div class="pay-member-price">¥<span class="pay-member-amount">' + PRODUCT.price + '</span><span class="pay-member-period">/ 月</span></div>' +
        '<ul class="pay-member-perks">' + perks + '</ul>' +
        '<button class="pay-product-btn" id="pay-shop-buy-btn">' + PRODUCT.icon + ' 立即开通</button>' +
        '<div class="pay-member-note">支持微信支付 · 随时可取消</div>' +
      '</div>';
    var btn = qs('pay-shop-buy-btn');
    if (btn) btn.onclick = function(){ hide('pay-shop-modal'); startPurchase(); };
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
  });

  window.PaymentPanel = {
    openShop:  function(){ show('pay-shop-modal'); },
    buy:       startPurchase,
    close:     closeModal,
    updateQuota: updateQuotaDisplay,
  };

}());
