# 2026-04-18 微信支付系统前端交接

## 1. 做了什么

- 新增支付模态框 UI（商城弹层 + 支付详情弹层）
- AI 半仙面板里加了购买入口栏
- 支持完整 mock 购买链路（点按钮即可测试）
- 支付成功后显示权益提示

---

## 2. 修改 / 新增文件

| 文件 | 说明 |
|---|---|
| `js/payment.js` | 支付前端逻辑（创建订单、会话、mock 测试、状态轮询） |
| `css/payment.css` | 支付 UI 样式（深色主题，与 chart.css 风格统一） |
| `pages/chart.html` | 新增：CSS 引用 + 支付入口栏 + 两个 modal + JS 引用 |

---

## 3. UI 在哪里

打开 AI 半仙对话面板（左侧导航→ AI 半仙 → 许半仙对话），
在快捷发问按钮下方有"解锁更多服务"入口栏：
- **许半仙深度对话包** → 直接进支付弹层
- **整体批命** → 直接进支付弹层
- **查看全部** → 打开商城弹层，展示全部 5 款商品

---

## 4. Mock 模式下前端怎么测

**不需要任何配置**，后端默认就是 mock 模式。

1. 打开排盘页面，排一个命盘
2. 切到 AI 半仙 → 许半仙对话面板
3. 点「许半仙深度对话包」按钮
4. 弹出支付弹层，可以看到"模拟模式"橙色标签
5. 弹层内有三个 Mock 测试按钮：
   - **模拟支付成功** → 状态变为绿色"支付成功"，显示"已解锁许半仙深度对话包（30次）"
   - **模拟支付失败** → 状态变为红色"支付失败"，可重新购买
   - **刷新订单状态** → 手动轮询一次状态
6. 后台 Supabase 里可查到 `payment_orders`、`payment_events`、`payment_entitlements` 三张表的记录

---

## 5. JavaScript API

```js
// 打开商城（展示所有商品）
window.PaymentPanel.openShop();

// 直接购买某商品
window.PaymentPanel.buy('chat_package');

// 关闭支付弹层
window.PaymentPanel.close();
```

`data-pay-open` 属性也可直接在任意 HTML 元素上用：
```html
<!-- 直接购买 -->
<button data-pay-open="chat_package">购买对话包</button>

<!-- 打开商城 -->
<button data-pay-open="shop">查看全部服务</button>
```

---

## 6. 切换真实模式后前端需要做什么

**不需要改前端代码。**

后端切到 real 模式后，`create-session` 返回的数据会包含真实的 `payUrl`（微信 Native 二维码链接或 H5 跳转链接）。前端目前展示了 `session.tip`，下一步要做的是：
1. Native 模式：用 `payUrl` 生成二维码图片（可用 `qrcode.js` 库）
2. H5 模式：弹层里加"前往微信支付"按钮，`window.location.href = payUrl`

这两个点在 `renderPayModal({ phase: 'pending' })` 里扩展即可，核心逻辑不用动。

---

## 7. 还没做完的

1. **Native 二维码渲染**：real 模式下拿到 `payUrl` 后需要渲染成二维码图片供用户扫。
2. **H5 支付跳转**：H5 模式需要 redirect 或弹窗。
3. **支付成功后刷新功能解锁状态**：现在只是显示文字，未来可联动 AI 批命功能（调 `window._aipCallBackend` 或直接解锁 UI 元素）。
4. **购买历史页面**：目前没有"我的订单"页面。
