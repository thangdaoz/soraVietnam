# Hướng Dẫn Cập Nhật Credit Packages

## Tổng Quan

Hệ thống đã được cập nhật để lấy dữ liệu credit packages từ database thay vì sử dụng mock data. Điều này cho phép quản lý gói credits linh hoạt hơn mà không cần deploy lại code.

## Thay Đổi Chính

### 1. API Route Mới
- **File**: `src/app/api/credit-packages/route.ts`
- **Endpoint**: `GET /api/credit-packages`
- **Chức năng**: Fetch tất cả gói credits active từ database

### 2. Cập Nhật Packages Library
- **File**: `src/lib/payos/packages.ts`
- **Thay đổi**:
  - Xóa mock data `CREDIT_PACKAGES`
  - Thêm hàm `fetchCreditPackages()` để fetch từ API
  - Thêm caching (5 phút) để giảm số lần gọi API
  - Cập nhật `getPackageById()` thành async function

### 3. Cập Nhật Checkout Page
- **File**: `src/app/checkout/page.tsx`
- **Thay đổi**:
  - Sử dụng `useEffect` để fetch packages khi component mount
  - Thêm loading state cho packages
  - Xử lý trường hợp không có packages

### 4. Migration Database
- **File**: `supabase/migrations/20251011_fix_credit_packages.sql`
- **Chức năng**: Cập nhật dữ liệu credit packages với giá trị chính xác

## Cấu Trúc Pricing

### Gói Khởi Đầu
- **Credits**: 500
- **Giá**: 50,000 VND
- **Giá/credit**: 100 VND
- **Discount**: 0%

### Gói Cơ Bản ⭐ (Phổ biến nhất)
- **Credits**: 2,000
- **Giá**: 180,000 VND
- **Giá/credit**: 90 VND
- **Discount**: 10%

### Gói Cao Cấp
- **Credits**: 5,000
- **Giá**: 400,000 VND
- **Giá/credit**: 80 VND
- **Discount**: 20%

## Cài Đặt & Sử Dụng

### Bước 1: Cập Nhật Database

Chạy script để cập nhật credit packages trong database:

```bash
node update-credit-packages.mjs
```

Script này sẽ:
- Xóa tất cả packages cũ
- Thêm 3 packages mới với giá trị chính xác
- Hiển thị thông tin các packages đã tạo

### Bước 2: Kiểm Tra API

Test API endpoint:

```bash
# Sử dụng curl (PowerShell)
curl http://localhost:3000/api/credit-packages

# Hoặc truy cập trực tiếp trong browser
# http://localhost:3000/api/credit-packages
```

Kết quả mong đợi:
```json
{
  "success": true,
  "packages": [
    {
      "id": "uuid-here",
      "name": "Gói Khởi Đầu",
      "nameEn": "Starter Package",
      "credits": 500,
      "priceVnd": 50000,
      ...
    }
  ]
}
```

### Bước 3: Test Checkout Page

1. Khởi động dev server: `npm run dev`
2. Truy cập: http://localhost:3000/checkout
3. Kiểm tra:
   - Packages được load từ database
   - Hiển thị đúng thông tin
   - Có thể chọn package
   - Nút thanh toán hoạt động

## Quản Lý Packages

### Thêm Package Mới

```sql
INSERT INTO public.credit_packages (
  name, 
  name_en, 
  description, 
  credits, 
  price_vnd, 
  discount_percentage, 
  is_popular, 
  display_order,
  active
) VALUES (
  'Gói Mới',
  'New Package',
  'Mô tả package',
  1000,
  90000,
  10,
  false,
  4,
  true
);
```

### Cập Nhật Package

```sql
UPDATE public.credit_packages
SET 
  price_vnd = 85000,
  discount_percentage = 15
WHERE name = 'Gói Khởi Đầu';
```

### Vô Hiệu Hóa Package

```sql
UPDATE public.credit_packages
SET active = false
WHERE name = 'Gói Cũ';
```

### Đổi Package Phổ Biến

```sql
-- Bỏ popular cho tất cả
UPDATE public.credit_packages
SET is_popular = false;

-- Set popular cho package mới
UPDATE public.credit_packages
SET is_popular = true
WHERE name = 'Gói Cao Cấp';
```

## Caching

Hệ thống sử dụng caching để tối ưu performance:

- **Client-side cache**: 5 phút
- **API route**: `cache: "no-store"` (luôn fetch fresh data từ DB)

Để xóa cache:
- Refresh trang sau 5 phút
- Hoặc restart dev server

## Lưu Ý Quan Trọng

1. **ID Packages**: Khi fetch từ database, ID là UUID thay vì string như "starter", "basic"
2. **Payment Actions**: File `payment.ts` đã được cập nhật để sử dụng async `getPackageById()`
3. **Features**: Features được generate tự động dựa trên credits và discount
4. **RLS Policies**: Đảm bảo table `credit_packages` có policy cho phép public read

## Troubleshooting

### Lỗi: "Không có gói credits nào khả dụng"
- Kiểm tra database có packages với `active = true`
- Chạy lại script `update-credit-packages.mjs`

### Lỗi: "Failed to fetch credit packages"
- Kiểm tra API route hoạt động
- Kiểm tra Supabase connection
- Xem console logs

### Packages không update
- Đợi 5 phút để cache expire
- Hoặc restart dev server
- Clear browser cache

## Files Liên Quan

```
src/
├── app/
│   ├── api/
│   │   └── credit-packages/
│   │       └── route.ts          # API endpoint
│   └── checkout/
│       └── page.tsx               # Checkout page (updated)
├── lib/
│   ├── payos/
│   │   └── packages.ts            # Package utilities (updated)
│   └── actions/
│       └── payment.ts             # Payment actions (updated)

supabase/
└── migrations/
    └── 20251011_fix_credit_packages.sql  # Migration

update-credit-packages.mjs         # Script cập nhật DB
```

## Kiểm Tra Database

Xem tất cả packages:
```sql
SELECT 
  name,
  credits,
  price_vnd,
  discount_percentage,
  ROUND(price_vnd::numeric / credits, 2) as price_per_credit,
  is_popular,
  active
FROM public.credit_packages
ORDER BY display_order;
```

## API Reference

### GET /api/credit-packages

**Response:**
```typescript
{
  success: boolean;
  packages: CreditPackage[];
}

interface CreditPackage {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  credits: number;
  priceVnd: number;
  discountPercentage: number;
  isPopular: boolean;
  displayOrder: number;
  features: string[];
}
```

---

**Cập nhật**: 11/10/2025
**Version**: 1.0.0
