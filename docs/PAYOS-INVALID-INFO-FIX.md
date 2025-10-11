# PayOS "Invalid Information" Error Fix

## Problem
Error: **"Thông tin truyền lên không hợp lệ"** (Invalid information sent)

This error occurs when creating PayOS payment links, especially for embedded checkout.

## Root Causes

### 1. **Description Field Validation**
PayOS has **strict validation** for the description field:
- ❌ Long descriptions fail
- ❌ Vietnamese special characters (ạ, ế, ô, etc.) may cause issues
- ❌ Complex formatted strings fail
- ✅ Simple alphanumeric strings work

### 2. **Field Requirements**
PayOS requires specific fields in a specific format:
```typescript
// ❌ This might fail:
{
  description: "Mua Gói Cơ Bản - 100,000 credits", // Too long, special chars
  items: [...] // Items array might cause issues
}

// ✅ This works:
{
  description: "DH123456", // Simple, short
  // No items field needed
}
```

## Solution Applied

### Changed Payment Data Format

**Before:**
```typescript
const paymentData = {
  orderCode,
  amount: priceVnd,
  description: `Mua ${creditPackage.name} - ${credits} credits`, // ❌ Too long
  items: [
    {
      name: packageName,
      quantity: 1,
      price: priceVnd,
    },
  ],
  returnUrl: "...",
  cancelUrl: "...",
};
```

**After:**
```typescript
const paymentData = {
  orderCode,
  amount: Math.floor(priceVnd), // Ensure integer
  description: `DH${orderCode}`, // ✅ Simple format
  returnUrl: "...",
  cancelUrl: "...",
  // No items field - not required
};
```

### Key Changes

1. **Simplified Description**
   - Format: `DH{orderCode}` (e.g., "DH123456")
   - Under 25 characters
   - No special Vietnamese characters
   - No spaces or punctuation

2. **Removed Items Array**
   - PayOS doesn't require `items` for basic payments
   - Simplifies the request

3. **Ensured Integer Amount**
   - Used `Math.floor(priceVnd)` to ensure no decimals
   - PayOS requires integer amounts

4. **Added Better Error Logging**
   - Full error details logged to console
   - Easier to debug future issues

## Files Modified

### 1. `src/lib/actions/payment.ts`

**Lines 46-57: Simplified package names and descriptions**
```typescript
// Custom amount
packageName = "Goi Tuy Chinh"; // No special chars
description = "Nap credits"; // Simple

// Package purchase
packageName = creditPackage.name;
description = "Mua goi credits"; // Simple
```

**Lines 112-127: Simplified payment data**
```typescript
const paymentData = {
  orderCode,
  amount: Math.floor(priceVnd),
  description: `DH${orderCode}`,
  returnUrl: `${APP_URL}/payment-success?transactionId=${transaction.id}`,
  cancelUrl: `${APP_URL}/payment-cancelled?transactionId=${transaction.id}`,
};
```

**Lines 148-158: Enhanced error logging**
```typescript
if (error && typeof error === 'object') {
  console.error("Error details:", JSON.stringify(error, null, 2));
}
```

## Testing

### 1. Try Creating a Payment
```bash
npm run dev
```

Navigate to: `http://localhost:3000/checkout`

### 2. Select a Package
- Choose any credit package
- Click "Tiếp tục thanh toán"

### 3. Check Console
If there's still an error, check the terminal/console for detailed error logs:
```
Creating PayOS payment link with data: { orderCode: 123456, amount: 100000, description: 'DH123456' }
```

### 4. Verify Modal Opens
- Modal should open with PayOS checkout
- QR code should display
- No error messages

## Additional Validation Rules

Based on PayOS documentation and testing:

| Field | Rule | Example |
|-------|------|---------|
| `orderCode` | 6-digit integer | `123456` |
| `amount` | Integer (VND), min 1000 | `100000` |
| `description` | Max 25 chars, alphanumeric | `DH123456` |
| `returnUrl` | Valid HTTPS URL (prod) | `https://yoursite.com/success` |
| `cancelUrl` | Valid HTTPS URL (prod) | `https://yoursite.com/cancel` |

## Common Mistakes to Avoid

### ❌ Don't Use These in Description:
- Vietnamese characters: ạ, ă, â, đ, ê, ô, ơ, ư, etc.
- Long text: "Mua Gói Cơ Bản - 100,000 credits"
- Special chars: @, #, $, %, &, *, etc.
- Emojis: 🎉, 💰, ✨

### ✅ Use Simple Descriptions:
- `DH123456` (Order + order code)
- `PAYMENT123456`
- `ORDER-123456`
- `TXN123456`

## If Error Persists

### 1. Check Environment Variables
```bash
# In terminal
echo $env:PAYOS_CLIENT_ID
echo $env:PAYOS_API_KEY
echo $env:PAYOS_CHECKSUM_KEY
```

Make sure they're set correctly in `.env.local`:
```env
PAYOS_CLIENT_ID="your-client-id"
PAYOS_API_KEY="your-api-key"
PAYOS_CHECKSUM_KEY="your-checksum-key"
```

### 2. Verify PayOS Credentials
- Go to [PayOS Dashboard](https://my.payos.vn/)
- Check that your API keys are active
- Verify your account is in good standing

### 3. Check Console Logs
Look for detailed error in terminal:
```json
{
  "code": "400",
  "desc": "Invalid description format",
  "data": null
}
```

### 4. Test with Minimal Data
Try the simplest possible payment:
```typescript
const paymentData = {
  orderCode: 123456,
  amount: 10000,
  description: "TEST",
  returnUrl: `${APP_URL}/success`,
  cancelUrl: `${APP_URL}/cancel`,
};
```

### 5. Check URL Format
In development, PayOS might not accept `localhost` URLs. Try using ngrok or similar:
```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use the HTTPS URL in .env.local
NEXT_PUBLIC_APP_URL="https://abc123.ngrok.io"
```

## Rollback Plan

If the changes cause issues, you can revert by restoring the items array:

```typescript
const paymentData = {
  orderCode,
  amount: priceVnd,
  description: "Payment", // Keep it simple
  returnUrl: `${APP_URL}/payment-success`,
  cancelUrl: `${APP_URL}/payment-cancelled`,
  items: [
    {
      name: "Credits", // Simple name
      quantity: 1,
      price: priceVnd,
    },
  ],
};
```

## Summary

The error "Thông info truyền lên không hợp lệ" was caused by:
1. Long, complex descriptions with Vietnamese characters
2. Potentially unnecessary `items` array
3. Possible non-integer amount values

The fix simplifies the payment data to meet PayOS's strict validation requirements, using a simple `DH{orderCode}` description format and removing optional fields.

## References

- [PayOS Node.js SDK Documentation](https://github.com/payOSHQ/payos-node)
- [PayOS API Reference](https://payos.vn/docs/api-reference)
- Our Implementation: `src/lib/actions/payment.ts`
