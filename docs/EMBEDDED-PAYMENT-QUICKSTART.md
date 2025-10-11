# Embedded Payment - Quick Start

## What Changed? 🎯

### Before: External Redirect ❌
```
User clicks "Pay" → Redirected to PayOS website → Pays → Redirected back
```

### After: Embedded Modal ✅
```
User clicks "Pay" → Modal opens on your site → Pays → Modal closes
```

## 3 Simple Steps to Test

### 1️⃣ Start Dev Server
```bash
npm run dev
```

### 2️⃣ Go to Checkout
Open browser: `http://localhost:3000/checkout`

### 3️⃣ Select Package & Pay
- Choose a credit package
- Click "Tiếp tục thanh toán"
- Modal opens with QR code
- Scan & pay
- Modal closes automatically

## Files Changed

| File | What Changed |
|------|-------------|
| `src/app/layout.tsx` | Added PayOS script |
| `src/types/payos.d.ts` | TypeScript types (new) |
| `src/components/payment/EmbeddedPaymentModal.tsx` | Modal component (new) |
| `src/app/checkout/page.tsx` | Uses modal instead of redirect |

## Key Code Changes

### Checkout Page - Before:
```tsx
if (result.success && result.checkoutUrl) {
  window.location.href = result.checkoutUrl; // Redirects away
}
```

### Checkout Page - After:
```tsx
if (result.success && result.checkoutUrl) {
  setCheckoutUrl(result.checkoutUrl);
  setIsPaymentModalOpen(true); // Opens modal
}

// At the end of JSX:
<EmbeddedPaymentModal
  isOpen={isPaymentModalOpen}
  onClose={() => setIsPaymentModalOpen(false)}
  checkoutUrl={checkoutUrl}
  onSuccess={handlePaymentSuccess}
  orderDetails={orderDetails}
/>
```

## Visual Flow

```
┌─────────────────────────────────────────────────────┐
│  Checkout Page (/checkout)                         │
│                                                     │
│  [Select Package: Gói Cơ Bản - 100,000 VND]       │
│  [Select Package: Gói Tiêu Chuẩn - 300,000 VND]   │
│  [Select Package: Gói Cao Cấp - 1,000,000 VND]    │
│                                                     │
│  [Tiếp tục thanh toán] ← User clicks               │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════╗ │
│  ║  Thanh toán                              [X]  ║ │
│  ║  ─────────────────────────────────────────    ║ │
│  ║  Chi tiết đơn hàng                           ║ │
│  ║  Gói: Gói Cơ Bản                             ║ │
│  ║  Số credits: 100,000                         ║ │
│  ║  Số tiền: 100,000 VND                        ║ │
│  ║  ─────────────────────────────────────────    ║ │
│  ║  ┌─────────────────────────────────────┐     ║ │
│  ║  │  PayOS Checkout Interface           │     ║ │
│  ║  │  ┌───────────────┐                  │     ║ │
│  ║  │  │   QR Code     │  Bank Transfer   │     ║ │
│  ║  │  │   [IMAGE]     │  Instructions    │     ║ │
│  ║  │  └───────────────┘                  │     ║ │
│  ║  │  Scan to pay: 100,000 VND           │     ║ │
│  ║  └─────────────────────────────────────┘     ║ │
│  ║                                              ║ │
│  ║  ⚠️ Không đóng cửa sổ khi thanh toán        ║ │
│  ║  [Đóng]                                     ║ │
│  ╚═══════════════════════════════════════════════╝ │
│                                                     │
│  This modal appears OVER your checkout page        │
└─────────────────────────────────────────────────────┘
                     │
                     │ User completes payment
                     ▼
┌─────────────────────────────────────────────────────┐
│  Profile Page (/profile?payment=success)           │
│                                                     │
│  ✅ Thanh toán thành công!                         │
│  Credits đã được thêm vào tài khoản của bạn       │
│                                                     │
│  Số dư credits: 150,000 (+100,000)                │
└─────────────────────────────────────────────────────┘
```

## How Modal Works

```tsx
// 1. User clicks payment button
handlePurchase() {
  const result = await createPaymentLink(packageId);
  
  // 2. Open modal with checkout URL
  setCheckoutUrl(result.checkoutUrl);
  setIsPaymentModalOpen(true);
}

// 3. Modal initializes PayOS
useEffect(() => {
  const config = {
    CHECKOUT_URL: checkoutUrl,
    embedded: true, // ← Key setting!
    onSuccess: () => {
      // 4. Close modal and redirect
      onClose();
      window.location.href = "/profile?payment=success";
    }
  };
  
  const { open } = window.PayOSCheckout.usePayOS(config);
  open(); // Display payment UI
}, [checkoutUrl]);
```

## Configuration Options

### Modal Size
```tsx
// In EmbeddedPaymentModal.tsx
<div className="relative w-full max-w-2xl"> // ← Change width
  <div className="min-h-[500px]">          // ← Change height
```

### Success Action
```tsx
// In page.tsx
const handlePaymentSuccess = () => {
  // Option 1: Redirect
  window.location.href = "/profile?payment=success";
  
  // Option 2: Stay and show message
  // alert("Thanh toán thành công!");
  
  // Option 3: Reload page
  // window.location.reload();
};
```

## Security Notes 🔒

### ❌ Don't Trust Frontend
```tsx
onSuccess: () => {
  // This can be faked by users!
  // Don't grant credits here
  alert("Payment successful");
}
```

### ✅ Trust Only Webhook
```tsx
// src/app/api/webhook/payos/route.ts
const verified = payOS.verifyPaymentWebhookData(body);
if (verified.status === 'PAID') {
  // This is secure - signature verified
  await addCredits(userId, amount);
}
```

## Common Issues

### Modal doesn't open
✅ **Check**: Is PayOS script loaded?
```tsx
// src/app/layout.tsx - should have:
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js" async></script>
```

### TypeScript errors
✅ **Fix**: Restart TypeScript server
- VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

### Payment not confirmed
✅ **Check**: Is webhook URL accessible?
- PayOS Dashboard → Webhooks → Test endpoint

## Testing Checklist

- [ ] Modal opens when clicking "Tiếp tục thanh toán"
- [ ] Order details display correctly
- [ ] PayOS QR code appears in modal
- [ ] Modal closes on payment success
- [ ] Redirect to profile page works
- [ ] Credits added after webhook confirmation
- [ ] Close button works
- [ ] Cancel payment works
- [ ] No console errors

## Next Steps

1. **Test in development**: Follow the 3 steps above
2. **Test in production**: Deploy and test with real PayOS account
3. **Monitor webhooks**: Check logs for payment confirmations
4. **Customize UI**: Adjust modal styling to match your brand

## Support

- 📖 [Full Implementation Guide](./EMBEDDED-PAYMENT-IMPLEMENTATION.md)
- 🔗 [PayOS Documentation](https://payos.vn/docs)
- 💬 Need help? Check the troubleshooting section above

---

**TL;DR**: Payment now happens in a modal on your site. Users don't leave your page. Everything else works the same (webhook, security, credits). 🎉
