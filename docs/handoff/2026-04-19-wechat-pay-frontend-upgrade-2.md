# WeChat Pay Frontend — Phase 2 Upgrade (2026-04-19)

## What changed (`js/payment.js`)

### 1. Production/dev mock isolation
- Added `isLocalDev()` — true when hostname is localhost/127.0.0.1/""
- If backend `create-order` fails:
  - **Local dev**: falls back to browser-local mock (full test flow as before)
  - **Production**: shows "支付服务暂不可用" modal phase — no mock buttons exposed to real users

### 2. Real payment UI
- After `create-session` returns `payUrl`:
  - **native mode**: renders WeChat QR code using `QRCode` library (CDN loaded in chart.html)
  - **h5 mode**: renders green "在微信中打开并支付" button + refresh button
- `_s.payUrl` and `_s.payMethod` stored in state
- QR canvas rendered via `renderQR('pay-qr-canvas', url)` after innerHTML set

### 3. Backend product sync
- `fetchBackendProduct()` called on DOMContentLoaded — GET `/api/payments/products`
- Updates local `PRODUCT.name/price/desc` if backend responds
- Refreshes shop card after fetch

### 4. Order-closed handling in poller
- `checkStatus()` now maps `closed` status → error modal with "订单已过期，请重新下单"

### 5. Mock button routing fix
- `doSuccess()` / `doFail()` detect local mock (orderNo starts with 'MOCK') vs backend mock mode correctly

## What changed (`css/payment.css`)
- Added `.pay-qr-area`, `.pay-qr-area canvas` — centered QR with white bg + padding
- Added `.pay-qr-hint` — "微信扫码支付" label
- Added `.pay-qr-fallback` — shown when QRCode library fails to load
- Added `.pay-h5-area`, `.pay-h5-btn` — green WeChat-style H5 redirect button

## What changed (`pages/chart.html`)
- Added QRCode CDN script before `payment.js`:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  ```

## Testing (local dev)
1. Open chart.html locally
2. Open shop modal → 立即开通 → modal opens
3. Backend unreachable → local mock mode with mock buttons (as before)
4. If backend is up in mock mode → mock buttons appear with backend order no
5. If backend is up in real mode → QR code or H5 button appears

## Going live (when WeChat Pay credentials are set)
- No frontend changes needed
- Backend switches to real mode → `create-session` returns real `payUrl`
- Native: QR auto-renders; H5: redirect button auto-renders
