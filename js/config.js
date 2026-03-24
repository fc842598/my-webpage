/**
 * 全站可配置项 — 所有外部链接、支付链接、图片路径集中在这里修改
 * 修改此文件即可更新对应功能，不需要改 HTML
 */
const SITE_CONFIG = {

  // ── 排盘入口 ──────────────────────────────────────────────
  // 可选替换为任意在线紫微斗数排盘工具：
  //   ziwei.pub:   https://ziwei.pub/
  //   iztro demo:  https://syazi.com/
  //   astro.com:   https://astro.click/zwds
  chartEntryUrl: "https://ziwei.pub/",

  // ── 套餐支付链接（替换为你的真实收款链接/二维码页面）────────
  basicPackagePayUrl:    "#pay-basic",    // ¥29 基础版
  advancedPackagePayUrl: "#pay-advanced", // ¥79 进阶版
  premiumPackagePayUrl:  "#pay-premium",  // ¥198 深度解读版

  // ── 联系方式 ──────────────────────────────────────────────
  // 替换为你的微信号、客服链接或表单链接
  contactUrl:     "#contact",
  wechatId:       "【你的微信号】",

  // ── 微信收款二维码图片路径 ──────────────────────────────────
  // 把你的收款码图片放到 images/ 目录，替换文件名即可
  wechatQrImage:  "images/pay-qr.png",

  // ── 服务说明页（可选）──────────────────────────────────────
  serviceNoticeUrl: "#faq",
};
