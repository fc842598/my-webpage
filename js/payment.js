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

  var BACKEND = getBackendBase();
  var CHAT_QUOTA_UNLIMITED = true;
  var SUPABASE_URL = 'https://jmmlijqeexdbxgpfyhgf.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_Y2W9eDscfJwK1sgSitbmFA_ta5btvaR';
  var _authClient = null;
  var _pendingPurchaseAfterLogin = false;

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
    paidReloadTimer: null,
    checkingStatus: false,
    expiredAt: null,
    expiryTimer: null,
  };

  function isLocalDev() {
    var h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '';
  }

  // ── DOM ──────────────────────────────────────────────────────
  function show(id) { var e = document.getElementById(id); if (e) e.style.display = 'flex'; }
  function hide(id) { var e = document.getElementById(id); if (e) e.style.display = 'none'; }
  function qs(id)   { return document.getElementById(id); }

  function getAuthClient() {
    if (_authClient) return _authClient;
    if (!window.supabase || typeof window.supabase.createClient !== 'function') return null;
    _authClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _authClient;
  }

  async function getAuthSession() {
    var client = getAuthClient();
    if (!client) return null;
    try {
      var res = await client.auth.getSession();
      return res && res.data ? res.data.session : null;
    } catch (_) {
      return null;
    }
  }

  async function getAuthToken() {
    var session = await getAuthSession();
    return session && session.access_token ? session.access_token : '';
  }

  function phoneToEmail(phone) {
    var digits = String(phone || '').replace(/\D/g, '');
    if (!digits || digits.length < 6 || digits.length > 20) return '';
    return 'phone_' + digits + '@yuetianai.local';
  }

  function getUserLabel(session) {
    var user = session && session.user;
    if (!user) return '';
    if (user.user_metadata && user.user_metadata.phone) return user.user_metadata.phone;
    return user.email || '已登录';
  }

  async function requirePurchaseAuth() {
    var session = await getAuthSession();
    if (session && session.user) return session;
    _pendingPurchaseAfterLogin = true;
    show('pay-modal');
    renderModal('auth', { mode: 'login' });
    return null;
  }

  function requireChartRecord() {
    if (window._chartRecordId) return true;
    show('pay-modal');
    renderModal('needChart');
    return false;
  }

  function updateAuthButtons(session) {
    document.querySelectorAll('[data-auth-open]').forEach(function(btn) {
      if (session && session.user) {
        btn.textContent = '已登录';
        btn.classList.add('is-logged-in');
        btn.dataset.authOpen = 'account';
      } else {
        btn.textContent = '注册 / 登录';
        btn.classList.remove('is-logged-in');
        btn.dataset.authOpen = 'register';
      }
    });
  }

  async function initAuthButtons() {
    var client = getAuthClient();
    if (!client) return;
    var session = await getAuthSession();
    updateAuthButtons(session);
    client.auth.onAuthStateChange(function(_event, nextSession) {
      updateAuthButtons(nextSession);
    });
  }

  async function openAuthPanel(mode) {
    var session = await getAuthSession();
    show('pay-modal');
    if (session && session.user) {
      renderModal('account', { session: session });
      return;
    }
    renderModal('auth', { mode: mode === 'login' ? 'login' : 'register' });
  }

  // ── 本地 Mock（仅本地开发，后端不可用时降级）─────────────────
  var _mockOrders = {};

  function getBackendBase() {
    try {
      var qsBase = new URLSearchParams(location.search).get('aiBackendBase') || '';
      var cfgBase = window.SITE_CONFIG && window.SITE_CONFIG.aiBackendBase;
      return (qsBase || cfgBase || 'https://ai-piming-backend-production.up.railway.app').replace(/\/$/, '');
    } catch (_) {
      return 'https://ai-piming-backend-production.up.railway.app';
    }
  }

  function _mockOrderNo() {
    var p = function(n,l){ return String(n).padStart(l,'0'); };
    var d = new Date();
    return 'MOCK' + d.getFullYear() + p(d.getMonth()+1,2) + p(d.getDate(),2)
           + p(d.getHours(),2) + p(d.getMinutes(),2) + p(d.getSeconds(),2)
           + p(Math.floor(Math.random()*9999),4);
  }

  // ── API（失败自动降级）──────────────────────────────────────
  async function tryPost(path, body, options) {
    try {
      options = options || {};
      var headers = { 'Content-Type': 'application/json' };
      if (!options.noAuth) {
        var token = await getAuthToken();
        if (token) headers.Authorization = 'Bearer ' + token;
      }
      var r = await fetch(BACKEND + path, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
      var j = await r.json();
      if (!r.ok) throw new Error(j.error || 'error');
      return { ok: true, data: j };
    } catch (e) { return { ok: false, error: e.message }; }
  }

  async function tryGet(path, options) {
    try {
      options = options || {};
      var headers = {};
      if (!options.noAuth) {
        var token = await getAuthToken();
        if (token) headers.Authorization = 'Bearer ' + token;
      }
      var r = await fetch(BACKEND + path, { headers: headers });
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
    var r = await tryGet('/api/payments/products', { noAuth: true });
    if (!r.ok || !r.data.products || !r.data.products.length) return;
    var p = r.data.products.find(function(x){ return x.productKey === PRODUCT.key; });
    if (p) {
      PRODUCT.name  = p.name  || PRODUCT.name;
      PRODUCT.price = p.amountYuan || PRODUCT.price;
      PRODUCT.desc  = p.description || PRODUCT.desc;
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDateTime(value) {
    if (!value) return '';
    try {
      return new Date(value).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (_) {
      return '';
    }
  }

  async function loadRefundOrders() {
    var box = qs('pay-refund-list');
    if (!box) return;
    box.innerHTML = '<div class="pay-refund-empty">正在加载订单...</div>';

    var r = await tryGet('/api/payments/refunds');
    if (!r.ok) {
      box.innerHTML = '<div class="pay-refund-empty">订单加载失败，请稍后重试</div>';
      return;
    }
    renderRefundOrders(r.data.orders || []);
  }

  function renderRefundOrders(orders) {
    var box = qs('pay-refund-list');
    if (!box) return;
    if (!orders.length) {
      box.innerHTML = '<div class="pay-refund-empty">暂无可退款订单</div>';
      return;
    }

    box.innerHTML = orders.map(function(order) {
      var status = order.refundRequested
        ? '已申请退款'
        : (order.status === 'refunded' ? '已退款' : (order.refundable ? '7天内可退' : order.refundBlockedReason || '不可退款'));
      var btn = order.refundable
        ? '<button class="pay-refund-btn" data-refund-order="' + escapeHtml(order.orderNo) + '">申请退款</button>'
        : '<button class="pay-refund-btn" disabled>' + escapeHtml(status) + '</button>';
      return (
        '<div class="pay-refund-item">' +
          '<div class="pay-refund-main">' +
            '<div class="pay-refund-name">' + escapeHtml(order.productName || '会员订单') + '</div>' +
            '<div class="pay-refund-meta">订单 ' + escapeHtml(order.orderNo) + '</div>' +
            '<div class="pay-refund-meta">支付 ' + formatDateTime(order.paidAt) + ' · 截止 ' + formatDateTime(order.refundDeadline) + '</div>' +
          '</div>' +
          '<div class="pay-refund-side">' +
            '<div class="pay-refund-amount">¥' + escapeHtml(order.amountYuan || '0.00') + '</div>' +
            btn +
          '</div>' +
        '</div>'
      );
    }).join('');

    box.querySelectorAll('[data-refund-order]').forEach(function(btn) {
      btn.onclick = function() { submitRefundRequest(btn.dataset.refundOrder, btn); };
    });
  }

  async function submitRefundRequest(orderNo, btn) {
    if (!orderNo) return;
    if (!confirm('确认申请退款？提交后我们会按订单记录处理。')) return;
    if (btn) {
      btn.disabled = true;
      btn.textContent = '提交中...';
    }
    var r = await tryPost('/api/payments/refunds', {
      orderNo: orderNo,
      reason: '用户7天内自助申请退款',
    });
    if (!r.ok) {
      alert(r.error || '退款申请失败');
      if (btn) {
        btn.disabled = false;
        btn.textContent = '申请退款';
      }
      return;
    }
    loadRefundOrders();
  }

  // ── 购买流程 ──────────────────────────────────────────────────
  async function startPurchase() {
    var session = await requirePurchaseAuth();
    if (!session) return;
    if (!requireChartRecord()) return;

    clearPaidReload();
    clearExpiryTimer();
    _s.orderNo  = null;
    _s.isMock   = false;
    _s.payUrl   = null;
    _s.payMethod = 'native';
    _s.checkingStatus = false;
    _s.expiredAt = null;
    stopPoll();
    show('pay-modal');
    renderModal('loading');

    var r1 = await tryPost('/api/payments/create-order', {
      productKey:     PRODUCT.key,
      chartRecordId:  window._chartRecordId || null,
    });

    if (!r1.ok) {
      if (/登录|登陆|login/i.test(r1.error || '')) {
        _pendingPurchaseAfterLogin = true;
        renderModal('auth', { mode: 'login', error: r1.error });
        return;
      }
      if (/排盘|chart/i.test(r1.error || '')) {
        renderModal('needChart', { error: r1.error });
        return;
      }
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
    _s.expiredAt = r1.data.expiredAt || null;
    if (r1.data.amountYuan) PRODUCT.price = r1.data.amountYuan;

    var r2 = await tryPost('/api/payments/create-session', {
      orderNo:   _s.orderNo,
      payMethod: _s.payMethod,
    });

    if (r2.ok) {
      _s.payUrl    = r2.data.payUrl  || null;
      _s.payMethod = r2.data.payMethod || _s.payMethod;
    } else if (!_s.isMock) {
      renderModal('error', { error: r2.error || '二维码生成失败，请稍后重试' });
      return;
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
    if (!_s.isMock) {
      startPoll(_s.orderNo);
      startExpiryCountdown();
    }
  }

  // ── QR 码渲染 ─────────────────────────────────────────────────
  function renderQR(containerId, url) {
    var el = qs(containerId);
    if (!el || !url) return;
    if (typeof QRCode !== 'undefined' && typeof QRCode.toCanvas === 'function') {
      QRCode.toCanvas(el, url, { width: 180, margin: 1 }, function(err) {
        if (err) el.title = url;
      });
    } else if (typeof QRCode === 'function') {
      var holder = document.createElement('div');
      holder.id = containerId;
      holder.className = el.className || '';
      el.parentNode.replaceChild(holder, el);
      new QRCode(holder, {
        text: url,
        width: 180,
        height: 180,
        correctLevel: QRCode.CorrectLevel ? QRCode.CorrectLevel.M : undefined,
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
  async function submitAuth(mode) {
    var client = getAuthClient();
    if (!client) {
      renderModal('auth', { mode: mode, error: '登录组件加载失败，请刷新后重试' });
      return;
    }

    var phoneInput = qs('pay-auth-phone');
    var passwordInput = qs('pay-auth-password');
    var submitBtn = qs('pay-auth-submit');
    var phone = phoneInput ? phoneInput.value : '';
    var password = passwordInput ? passwordInput.value : '';
    var email = phoneToEmail(phone);

    if (!email) {
      renderModal('auth', { mode: mode, error: '请输入正确手机号' });
      return;
    }
    if (!password || password.length < 6) {
      renderModal('auth', { mode: mode, error: '密码至少 6 位' });
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '处理中...';
    }

    try {
      if (mode === 'register') {
        var created = await tryPost('/api/auth/register-phone', {
          phone: phone,
          password: password,
        }, { noAuth: true });
        if (!created.ok && !/已注册|already|exists/i.test(created.error || '')) {
          throw new Error(created.error || '注册失败');
        }
      }

      var signed = await client.auth.signInWithPassword({ email: email, password: password });
      if (signed.error) throw signed.error;

      updateAuthButtons(signed.data.session);
      hide('pay-modal');
      if (_pendingPurchaseAfterLogin) {
        _pendingPurchaseAfterLogin = false;
        startPurchase();
      }
    } catch (err) {
      renderModal('auth', { mode: mode, error: err.message || '登录失败' });
    }
  }

  async function startGoogleLogin() {
    var client = getAuthClient();
    if (!client) {
      renderModal('auth', { mode: 'login', error: '登录组件加载失败，请刷新后重试' });
      return;
    }
    var redirectUrl = new URL(window.location.href);
    redirectUrl.hash = '';
    await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl.toString() },
    });
  }

  function renderModal(phase, data) {
    var wrap = qs('pay-modal-content');
    if (!wrap) return;
    data = data || {};

    var mockBadge = _s.isMock ? '<span class="pay-mock-badge">模拟模式</span>' : '';
    var body = '';

    if (phase === 'account') {
      var label = getUserLabel(data.session);
      body =
        '<div class="pay-account-box">' +
          '<div class="pay-account-title">账号已登录</div>' +
          '<div class="pay-account-user">' + escapeHtml(label || '已登录') + '</div>' +
          '<div class="pay-refund-section">' +
            '<div class="pay-refund-title">退款申请</div>' +
            '<div class="pay-refund-note">支付成功后7天内可以自助提交申请。</div>' +
            '<div class="pay-refund-list" id="pay-refund-list"><div class="pay-refund-empty">正在加载订单...</div></div>' +
          '</div>' +
          '<button class="pay-auth-submit" id="pay-account-buy">去购买会员</button>' +
          '<button class="pay-auth-google" id="pay-auth-logout">退出登录</button>' +
        '</div>';

    } else if (phase === 'auth') {
      var mode = data.mode === 'register' ? 'register' : 'login';
      var isRegister = mode === 'register';
      body =
        '<div class="pay-auth-box">' +
          '<div class="pay-auth-title">' + (isRegister ? '注册账号' : '登录账号') + '</div>' +
          '<div class="pay-auth-subtitle">会员会绑定到你的账号，换设备也能找回。</div>' +
          (data.error ? '<div class="pay-auth-error">' + data.error + '</div>' : '') +
          '<div class="pay-auth-tabs">' +
            '<button class="pay-auth-tab ' + (!isRegister ? 'active' : '') + '" id="pay-auth-tab-login">登录</button>' +
            '<button class="pay-auth-tab ' + (isRegister ? 'active' : '') + '" id="pay-auth-tab-register">注册</button>' +
          '</div>' +
          '<label class="pay-auth-label">手机号</label>' +
          '<input class="pay-auth-input" id="pay-auth-phone" inputmode="tel" autocomplete="tel" placeholder="输入手机号">' +
          '<label class="pay-auth-label">密码</label>' +
          '<input class="pay-auth-input" id="pay-auth-password" type="password" autocomplete="' + (isRegister ? 'new-password' : 'current-password') + '" placeholder="至少 6 位">' +
          '<button class="pay-auth-submit" id="pay-auth-submit">' + (isRegister ? '注册并登录' : '登录并继续') + '</button>' +
          '<button class="pay-auth-google" id="pay-auth-google">用 Google 登录</button>' +
          '<div class="pay-auth-note">手机号登录使用密码，不发验证码。</div>' +
        '</div>';

    } else if (phase === 'needChart') {
      body =
        '<div class="pay-fail-icon">!</div>' +
        '<div class="pay-fail-title">请先完成排盘</div>' +
        '<div class="pay-error-msg">' + (data.error || '会员会绑定到当前命盘记录，先排盘后再购买最稳。') + '</div>' +
        '<button class="pay-retry-btn" id="pm-close-ok">去排盘</button>';

    } else if (phase === 'loading') {
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
            '<button class="pay-mock-btn pay-confirm-btn" id="pm-refresh">已支付，确认状态</button>' +
            '<div class="pay-confirm-line pay-confirm-waiting" id="pay-confirm-line">付款后本页会自动确认</div>' +
          '</div>';
      } else if (_s.payUrl) {
        actionArea =
          '<div class="pay-qr-area">' +
            '<canvas id="pay-qr-canvas"></canvas>' +
            '<div class="pay-qr-hint">微信扫码支付</div>' +
            '<button class="pay-mock-btn pay-confirm-btn" id="pm-refresh">我已支付，立即确认</button>' +
            '<div class="pay-confirm-line pay-confirm-waiting" id="pay-confirm-line">自动确认中，付款后会进入会员状态</div>' +
          '</div>';
      } else {
        // payUrl not ready yet — show refresh only
        actionArea =
          '<div class="pay-mock-btns">' +
            '<button class="pay-mock-btn pay-mock-refresh" id="pm-refresh">↻ 刷新状态</button>' +
          '</div>';
      }

      body =
        '<div class="pay-steps pay-steps-pending">' +
          '<span>扫码付款</span><i></i><span>自动确认</span><i></i><span>开通会员</span>' +
        '</div>' +
        '<div class="pay-order-row"><span>商品</span><span>' + PRODUCT.name + '</span></div>' +
        '<div class="pay-order-row"><span>实付金额</span><strong>¥' + PRODUCT.price + '<span style="font-size:13px;font-weight:400;color:#7a6a4a;margin-left:2px">/ 月</span></strong></div>' +
        '<div class="pay-order-row"><span>订单号</span><code>' + (data.orderNo || '') + '</code></div>' +
        (_s.expiredAt ? '<div class="pay-order-row"><span>有效时间</span><span id="pay-expire-countdown">--:--</span></div>' : '') +
        '<div class="pay-order-row"><span>状态</span><span class="pay-state pay-state-pending">待支付</span></div>' +
        (lines ? '<div class="pay-tip">' + lines + '</div>' : '') +
        actionArea;

    } else if (phase === 'paid') {
      body =
        '<div class="pay-steps pay-steps-done">' +
          '<span>扫码付款</span><i></i><span>确认完成</span><i></i><span>已开通</span>' +
        '</div>' +
        '<div class="pay-success-icon">✓</div>' +
        '<div class="pay-success-title">支付成功，已开通会员</div>' +
        '<div class="pay-order-row"><span>订单号</span><code>' + (_s.orderNo || '') + '</code></div>' +
        '<div class="pay-entitlement">✦ 许半仙月度会员已激活<br>每日200次AI命理对话额度已就绪</div>' +
        '<div class="pay-success-subtitle">正在刷新页面，进入会员状态…</div>' +
        '<button class="pay-retry-btn" id="pm-close-ok" style="margin-top:12px">立即进入</button>';

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
    el = qs('pm-close-ok'); if (el) el.onclick = phase === 'needChart'
      ? function(){
          closeModal();
          var form = qs('form-section');
          if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      : function(){ closeModal(); location.reload(); };
    el = qs('pm-retry');    if (el) el.onclick = startPurchase;
    el = qs('pm-ok');       if (el) el.onclick = doSuccess;
    el = qs('pm-fail');     if (el) el.onclick = doFail;
    el = qs('pm-refresh');  if (el) el.onclick = function(){ if (_s.orderNo) checkStatus(_s.orderNo, true); };
    el = qs('pay-auth-tab-login');    if (el) el.onclick = function(){ renderModal('auth', { mode: 'login' }); };
    el = qs('pay-auth-tab-register'); if (el) el.onclick = function(){ renderModal('auth', { mode: 'register' }); };
    el = qs('pay-auth-submit');       if (el) el.onclick = function(){ submitAuth(data.mode === 'register' ? 'register' : 'login'); };
    el = qs('pay-auth-google');       if (el) el.onclick = startGoogleLogin;
    el = qs('pay-auth-password');     if (el) el.onkeydown = function(e){ if (e.key === 'Enter') submitAuth(data.mode === 'register' ? 'register' : 'login'); };
    el = qs('pay-account-buy');       if (el) el.onclick = function(){ closeModal(); show('pay-shop-modal'); };
    el = qs('pay-auth-logout');       if (el) el.onclick = async function(){
      var client = getAuthClient();
      if (client) await client.auth.signOut();
      updateAuthButtons(null);
      closeModal();
    };

    // Render QR code after DOM is ready
    if (phase === 'pending' && !_s.isMock && _s.payUrl && _s.payMethod !== 'h5') {
      renderQR('pay-qr-canvas', _s.payUrl);
    }
    if (phase === 'account') {
      loadRefundOrders();
    }
  }

  function closeModal() { stopPoll(); clearPaidReload(); clearExpiryTimer(); hide('pay-modal'); }

  function clearPaidReload() {
    if (_s.paidReloadTimer) {
      clearTimeout(_s.paidReloadTimer);
      _s.paidReloadTimer = null;
    }
  }

  function clearExpiryTimer() {
    if (_s.expiryTimer) {
      clearInterval(_s.expiryTimer);
      _s.expiryTimer = null;
    }
  }

  function formatRemaining(ms) {
    var total = Math.max(0, Math.floor(ms / 1000));
    var m = String(Math.floor(total / 60)).padStart(2, '0');
    var s = String(total % 60).padStart(2, '0');
    return m + ':' + s;
  }

  function updateExpiryCountdown() {
    if (!_s.expiredAt) return;
    var el = qs('pay-expire-countdown');
    var remaining = new Date(_s.expiredAt).getTime() - Date.now();
    if (el) el.textContent = formatRemaining(remaining);
    if (remaining <= 0) {
      clearExpiryTimer();
      stopPoll();
      renderModal('error', { error: '订单已过期，请重新下单' });
    }
  }

  function startExpiryCountdown() {
    clearExpiryTimer();
    if (!_s.expiredAt) return;
    updateExpiryCountdown();
    _s.expiryTimer = setInterval(updateExpiryCountdown, 1000);
  }

  function setConfirmState(state, message, lockButton) {
    var btn = qs('pm-refresh');
    var line = qs('pay-confirm-line');
    if (btn) {
      btn.disabled = !!lockButton && state === 'checking';
      btn.textContent = !!lockButton && state === 'checking'
        ? '正在确认…'
        : (_s.payMethod === 'h5' ? '已支付，确认状态' : '我已支付，立即确认');
    }
    if (line && message) {
      line.className = 'pay-confirm-line pay-confirm-' + state;
      line.textContent = message;
    }
  }

  function handlePaid() {
    _s.checkingStatus = false;
    stopPoll();
    clearExpiryTimer();
    renderModal('paid');
    updateQuotaDisplay({ isMember: true, dailyLimit: 200, remaining: 200 });
    clearPaidReload();
    _s.paidReloadTimer = setTimeout(function(){ location.reload(); }, 1500);
  }

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
    handlePaid();
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
    var manual = arguments.length > 1 ? !!arguments[1] : false;
    if (_s.checkingStatus) return;
    _s.checkingStatus = true;
    setConfirmState('checking', manual ? '正在向微信确认支付结果…' : '自动确认中，付款后会进入会员状态', manual);
    var r = await tryGet('/api/payments/order-status?orderNo=' + encodeURIComponent(orderNo));
    _s.checkingStatus = false;
    if (!r.ok) {
      setConfirmState('error', '暂时没有确认成功，稍后会自动重试');
      return;
    }
    if (r.data.expiredAt && !_s.expiredAt) {
      _s.expiredAt = r.data.expiredAt;
      startExpiryCountdown();
    }
    var st = r.data.status;
    if (st === 'paid') { handlePaid(); }
    else if (st === 'created' || st === 'pending') {
      setConfirmState('waiting', manual ? '还没查到支付成功，请稍后再确认' : '自动确认中，付款后会进入会员状态');
    } else if (st === 'failed' || st === 'closed') {
      stopPoll();
      renderModal(st === 'closed' ? 'error' : 'failed', { error: st === 'closed' ? '订单已过期，请重新下单' : '' });
    }
  }

  function startPoll(no) {
    stopPoll();
    _s.pollTimer = setInterval(function(){ checkStatus(no); }, 3000);
    checkStatus(no);
  }
  function stopPoll() {
    if (_s.pollTimer) { clearInterval(_s.pollTimer); _s.pollTimer = null; }
  }

  function confirmActivePayment() {
    if (!_s.orderNo || _s.isMock || !_s.payUrl) return;
    checkStatus(_s.orderNo, true);
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

    document.addEventListener('keydown', function(e) {
      if (e.key !== 'Escape') return;
      hide('pay-shop-modal');
      closeModal();
    });
    window.addEventListener('focus', confirmActivePayment);
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) confirmActivePayment();
    });

    renderShop('pay-shop-products');

    document.querySelectorAll('[data-pay-open]').forEach(function(btn) {
      btn.onclick = function() {
        var key = btn.dataset.payOpen;
        if (key === 'shop' || !key) { show('pay-shop-modal'); }
        else { startPurchase(); }
      };
    });

    document.querySelectorAll('[data-auth-open]').forEach(function(btn) {
      btn.onclick = function() {
        openAuthPanel(btn.dataset.authOpen || 'register');
      };
    });

    // 拉取后端商品后刷新商城卡片
    fetchBackendProduct().then(function() {
      renderShop('pay-shop-products');
    });
    updateQuotaDisplay({ testingUnlimited: true, isMember: false, dailyLimit: null, remaining: null });
    initAuthButtons();
  });

  window.PaymentPanel = {
    openShop:    function(){ show('pay-shop-modal'); },
    openAuth:    openAuthPanel,
    buy:         startPurchase,
    close:       closeModal,
    updateQuota: updateQuotaDisplay,
  };

}());
