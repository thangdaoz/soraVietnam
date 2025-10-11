# PayOS Embedded Checkout - URL Validation Fix

## Issue
When opening the embedded payment modal, PayOS shows:
> **"Thông báo: Thông tin truyền lên không hợp lệ"**
> (Notification: Invalid information sent)

But the payment link is created successfully on the server (confirmed in logs).

## Root Cause

The issue is a **mismatch between the URLs** used in different places:

1. **Server creates payment link** with `returnUrl` and `cancelUrl`
2. **Frontend embedded config** uses a different `RETURN_URL`
3. PayOS validates that these URLs match

Additionally, **query parameters in URLs** can cause validation issues in embedded mode.

## Solution

### 1. Simplified Return URLs (Server-Side)

**File: `src/lib/actions/payment.ts`**

**Before:**
```typescript
returnUrl: `${APP_URL}/payment-success?transactionId=${transaction.id}`,
cancelUrl: `${APP_URL}/payment-cancelled?transactionId=${transaction.id}`,
```

**After:**
```typescript
returnUrl: `${APP_URL}/payment-success`,
cancelUrl: `${APP_URL}/payment-cancelled`,
// No query parameters - track via orderCode instead
```

**Why:** Query parameters can cause validation issues. We store the `orderCode` in the transaction record, so we can look it up later.

### 2. Matched Frontend Config

**File: `src/components/payment/EmbeddedPaymentModal.tsx`**

**Before:**
```typescript
RETURN_URL: window.location.href, // Points to /checkout
```

**After:**
```typescript
RETURN_URL: `${window.location.origin}/payment-success`, // Matches server
```

**Why:** The `RETURN_URL` in the embedded config must match the `returnUrl` from the payment link creation.

### 3. Added Debug Logging

Added console logs to help diagnose issues:

**Server logs:**
```typescript
console.log("Creating PayOS payment link with data:", paymentData);
console.log("PayOS response:", {
  paymentLinkId: paymentLinkResponse.paymentLinkId,
  checkoutUrl: paymentLinkResponse.checkoutUrl,
  status: paymentLinkResponse.status,
});
```

**Client logs:**
```typescript
console.log("Initializing PayOS embedded checkout with URL:", checkoutUrl);
console.log("PayOS config:", config);
console.log("PayOS checkout opened successfully");
```

## Testing Steps

### 1. Clear Browser Cache
```
Ctrl + Shift + R (hard refresh)
```

### 2. Check Server Logs

Start dev server and watch the terminal:
```bash
npm run dev
```

### 3. Attempt Payment

1. Go to: `http://localhost:3000/checkout`
2. Select a package
3. Click "Tiếp tục thanh toán"
4. **Check terminal for logs:**

```
Creating PayOS payment link with data: {
  orderCode: 82709,
  amount: 50000,
  description: 'DH82709',
  returnUrl: 'http://localhost:3000/payment-success',    ← Should be simple
  cancelUrl: 'http://localhost:3000/payment-cancelled'   ← Should be simple
}

PayOS response: {
  paymentLinkId: '...',
  checkoutUrl: 'https://pay.payos.vn/...',
  status: 'PENDING'
}
```

### 4. Check Browser Console

Open browser DevTools (F12) and check Console:
```
Initializing PayOS embedded checkout with URL: https://pay.payos.vn/...
PayOS config: {
  RETURN_URL: 'http://localhost:3000/payment-success',
  ELEMENT_ID: 'payos-container-...',
  CHECKOUT_URL: 'https://pay.payos.vn/...',
  embedded: true
}
PayOS checkout opened successfully
```

### 5. Expected Result

✅ Modal opens
✅ PayOS checkout interface loads
✅ QR code displays
✅ No error message

## If Error Persists

### Check #1: PayOS Script Loaded?

Open browser console and type:
```javascript
window.PayOSCheckout
```

Should return an object. If `undefined`, the script didn't load.

**Fix:** Check `src/app/layout.tsx` has:
```tsx
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js" async></script>
```

### Check #2: Valid Checkout URL?

In browser console, check:
```javascript
// The checkoutUrl should be a PayOS domain
// https://pay.payos.vn/web/...
```

If it's not a valid PayOS URL, there's an issue with payment link creation.

### Check #3: Localhost Issues

PayOS embedded mode might not work with `localhost` URLs. Try using `127.0.0.1`:

**In `.env.local`:**
```env
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

Or use **ngrok** for HTTPS:
```bash
npx ngrok http 3000

# Update .env.local with the ngrok URL:
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
```

### Check #4: PayOS Credentials

Verify your PayOS credentials are correct:
```bash
echo $env:PAYOS_CLIENT_ID
echo $env:PAYOS_API_KEY
echo $env:PAYOS_CHECKSUM_KEY
```

Go to [PayOS Dashboard](https://my.payos.vn/) and verify:
- API keys are active
- Account is in good standing
- No restrictions on your account

## Alternative Solution: Use Hosted Checkout

If embedded checkout continues to have issues, you can temporarily revert to hosted checkout (external redirect):

**In `src/app/checkout/page.tsx`:**
```typescript
// Instead of opening modal:
if (result.success && result.checkoutUrl) {
  window.location.href = result.checkoutUrl; // Direct redirect
}
```

This is more reliable but users will leave your site temporarily.

## Transaction Tracking Without Query Params

Since we removed transaction ID from URLs, track payments via `orderCode`:

### In Webhook Handler
```typescript
// Find transaction by orderCode
const transaction = await supabase
  .from('transactions')
  .select('*')
  .eq('payment_id', orderCode.toString())
  .single();
```

### In Success Page
```typescript
// Get orderCode from PayOS callback or session
const { orderCode } = await payOS.getPaymentLinkInformation(paymentLinkId);

// Find transaction
const transaction = await supabase
  .from('transactions')
  .select('*')
  .eq('payment_id', orderCode.toString())
  .single();
```

## Summary

The error was caused by:
1. ❌ Long URLs with query parameters
2. ❌ Mismatched `RETURN_URL` between server and client
3. ❌ Possible localhost URL restrictions

The fix:
1. ✅ Simplified URLs (no query params)
2. ✅ Matched `RETURN_URL` in both places
3. ✅ Added comprehensive logging
4. ✅ Track transactions via `orderCode` instead

## Next Steps

1. **Test the payment flow** following the steps above
2. **Check logs** in both terminal and browser console
3. **Report back** with any error messages you see
4. If it works, we can remove the extra console.log statements

## Files Modified

- `src/lib/actions/payment.ts` - Simplified URLs, added logging
- `src/components/payment/EmbeddedPaymentModal.tsx` - Matched RETURN_URL, added logging
- `docs/PAYOS-EMBEDDED-URL-FIX.md` - This document (NEW)
