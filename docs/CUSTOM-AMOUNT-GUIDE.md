# Hướng Dẫn Nạp Credits Tùy Chỉnh

## Tổng Quan

Hệ thống đã được cập nhật với 2 tính năng mới:
1. **Quy đổi đơn giản**: 1 VND = 1 credit
2. **Nạp tùy chỉnh**: Cho phép người dùng nhập số tiền từ 30,000 - 20,000,000 VND

## Thay Đổi Chi Tiết

### 1. Cấu Trúc Pricing Mới

**Quy đổi**: 1 VND = 1 credit (không còn chiết khấu phức tạp)

**Các gói có sẵn**:
- **Gói Dùng Thử**: 99,000 VND = 99,000 credits
- **Gói Cơ Bản** ⭐: 299,000 VND = 299,000 credits
- **Gói Chuyên Nghiệp**: 699,000 VND = 699,000 credits
- **Gói Doanh Nghiệp**: 1,499,000 VND = 1,499,000 credits

### 2. Tính Năng Nạp Tùy Chỉnh

**Giới hạn**:
- Tối thiểu: 30,000 VND
- Tối đa: 20,000,000 VND

**Ưu điểm**:
- Linh hoạt theo nhu cầu
- Không bị ràng buộc bởi gói cố định
- Quy đổi trực tiếp 1:1

## Files Đã Thay Đổi

### 1. `update-credit-packages.mjs`
Cập nhật packages với giá trị mới (credits = price_vnd):

```javascript
const PACKAGES = [
  {
    name: 'Gói Dùng Thử',
    credits: 99000,
    price_vnd: 99000,
    // ...
  },
  // ...
];
```

### 2. `src/app/checkout/page.tsx`
**Thêm mới**:
- State `customAmount` để lưu số tiền nhập
- State `useCustomAmount` để theo dõi chế độ
- Hàm `handleCustomAmountChange()` xử lý input
- Hàm `getCustomAmountError()` validate số tiền
- UI card "Nhập số tiền tùy chỉnh"
- Quick buttons: 50k, 100k, 500k, 1M
- Logic disable packages khi chọn custom amount

**Cập nhật**:
- `handlePurchase()` hỗ trợ cả package và custom amount
- Summary sidebar hiển thị thông tin custom amount
- Button disable logic mới

### 3. `src/lib/actions/payment.ts`
**Signature mới**:
```typescript
createPaymentLink(packageId?: string | null, customAmount?: number)
```

**Logic mới**:
- Hỗ trợ custom amount (1 VND = 1 credit)
- Validate range 30k - 20M
- Tạo transaction với `is_custom: true` flag
- Package name: "Gói Tùy Chỉnh" cho custom amount

### 4. `supabase/migrations/20251011_fix_credit_packages.sql`
Cập nhật data với giá trị credits = price_vnd

## Cách Sử Dụng

### Bước 1: Cập Nhật Database

```powershell
node update-credit-packages.mjs
```

Kết quả mong đợi:
```
✅ Deleted old packages
✅ Inserted new packages

📦 Available Credit Packages:

  ⭐ Gói Cơ Bản (Basic Package)
     ID: uuid...
     Credits: 299,000
     Price: 299,000 VND
     Price per credit: 1.00 VND
     Discount: 0%
```

### Bước 2: Test Tính Năng

1. **Test gói có sẵn**:
   - Chọn một gói
   - Xem summary cập nhật
   - Tiếp tục thanh toán

2. **Test custom amount**:
   - Click vào input "Số tiền (VND)"
   - Nhập số tiền hoặc click quick button
   - Xem validation (min/max)
   - Xem summary cập nhật với số credits tương ứng
   - Tiếp tục thanh toán

3. **Test switching**:
   - Chọn package → switch sang custom amount → packages disabled
   - Clear custom amount → packages enabled lại
   - Custom amount active → packages có opacity 50%

## UI/UX Chi Tiết

### Custom Amount Input Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Hoặc nhập số tiền tùy chỉnh</CardTitle>
    <CardDescription>
      Nạp credits với số tiền bạn mong muốn (1 VND = 1 credit)
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Input field với validation */}
    {/* Quick amount buttons */}
    {/* Info box về quy đổi */}
  </CardContent>
</Card>
```

**Features**:
- Auto-format số tiền với thousand separator
- Validation realtime (min 30k, max 20M)
- Error message màu đỏ
- Success message màu xanh với số credits
- Clear button (X) để xóa
- Quick buttons: 50k, 100k, 500k, 1M
- Focus state: border primary, ring effect

### Package Selection

**Behavior khi custom amount active**:
- Packages có `opacity-50`
- Cursor `not-allowed`
- Không thể click
- Checkmark biến mất

**Behavior khi clear custom amount**:
- Packages trở lại bình thường
- Có thể click
- Auto-select package trước đó

### Summary Sidebar

**Khi chọn package**:
```
Gói credits: Gói Cơ Bản
Số credits: 299,000
Giá gốc: 299,000₫
─────────────────────
Tổng cộng: 299,000₫
```

**Khi custom amount**:
```
Loại: Gói Tùy Chỉnh
Số tiền: 150,000₫
Số credits: 150,000
─────────────────────
Tổng cộng: 150,000₫
```

**Khi chưa chọn gì**:
```
Chọn gói credits hoặc nhập số tiền tùy chỉnh
```

## Validation Rules

### Custom Amount

1. **Format**: Chỉ chấp nhận số
2. **Minimum**: 30,000 VND
3. **Maximum**: 20,000,000 VND
4. **Display**: Auto-format với thousand separator

### Button State

```typescript
disabled={
  loading || 
  (!selectedPackage && !useCustomAmount) || 
  (useCustomAmount && !customAmount)
}
```

Disabled khi:
- Đang loading
- Không chọn package và không custom amount
- Chọn custom amount nhưng chưa nhập số tiền

## Payment Flow

### Flow 1: Package Payment
```
User chọn package → Click "Tiếp tục thanh toán"
→ createPaymentLink(packageId)
→ Create transaction (from package)
→ Create PayOS link
→ Redirect to PayOS
```

### Flow 2: Custom Amount Payment
```
User nhập custom amount → Click "Tiếp tục thanh toán"
→ Validate amount (30k - 20M)
→ createPaymentLink(null, customAmount)
→ Create transaction (is_custom: true, credits = amount)
→ Create PayOS link
→ Redirect to PayOS
```

## Transaction Metadata

### Package Transaction
```json
{
  "package_id": "uuid",
  "package_name": "Gói Cơ Bản",
  "order_code": 123456,
  "is_custom": false
}
```

### Custom Amount Transaction
```json
{
  "package_id": "custom",
  "package_name": "Gói Tùy Chỉnh",
  "order_code": 123456,
  "is_custom": true
}
```

## Testing Checklist

- [ ] Database packages đã update (1 VND = 1 credit)
- [ ] Packages hiển thị đúng trên checkout page
- [ ] Custom amount input hoạt động
- [ ] Validation min/max đúng
- [ ] Quick buttons hoạt động
- [ ] Format số tiền đúng
- [ ] Switch giữa package và custom amount
- [ ] Summary sidebar cập nhật đúng
- [ ] Button disable logic đúng
- [ ] Payment flow với package thành công
- [ ] Payment flow với custom amount thành công
- [ ] Transaction lưu đúng metadata

## Ví Dụ Sử Dụng

### Ví dụ 1: Nạp 100,000 VND
```
Input: 100000
Credits nhận: 100,000
Giá: 100,000₫
```

### Ví dụ 2: Nạp 500,000 VND
```
Input: 500000
Credits nhận: 500,000
Giá: 500,000₫
```

### Ví dụ 3: Nạp 1,500,000 VND
```
Input: 1500000
Credits nhận: 1,500,000
Giá: 1,500,000₫
```

## API Reference

### `createPaymentLink()`

```typescript
async function createPaymentLink(
  packageId?: string | null,
  customAmount?: number
): Promise<{
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}>
```

**Parameters**:
- `packageId`: ID của package (optional)
- `customAmount`: Số tiền tùy chỉnh 30k-20M (optional)

**Notes**:
- Phải có ít nhất 1 trong 2 params
- customAmount ưu tiên hơn packageId nếu cả 2 đều có

## Troubleshooting

### Lỗi: "Số tiền phải từ 30,000 VND đến 20,000,000 VND"
- Kiểm tra input value
- Đảm bảo >= 30,000 và <= 20,000,000

### Custom amount không submit được
- Kiểm tra validation error
- Xem console logs
- Đảm bảo format đúng (integer)

### Packages không load
- Chạy lại `node update-credit-packages.mjs`
- Kiểm tra Supabase connection
- Xem API logs `/api/credit-packages`

---

**Cập nhật**: 11/10/2025
**Version**: 2.0.0
