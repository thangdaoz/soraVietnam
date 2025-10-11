/**
 * Quick Update Credit Packages
 * 
 * Simple script to update credit packages via Supabase API
 * Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local
 */

const PACKAGES = [
  {
    name: 'Gói Dùng Thử',
    name_en: 'Trial Package',
    description: 'Hoàn hảo để bắt đầu trải nghiệm',
    credits: 99000,
    price_vnd: 99000,
    discount_percentage: 0,
    is_popular: false,
    display_order: 1,
    active: true,
  },
  {
    name: 'Gói Cơ Bản',
    name_en: 'Basic Package',
    description: 'Phù hợp cho người dùng thường xuyên',
    credits: 299000,
    price_vnd: 299000,
    discount_percentage: 0,
    is_popular: true,
    display_order: 2,
    active: true,
  },
  {
    name: 'Gói Chuyên Nghiệp',
    name_en: 'Professional Package',
    description: 'Dành cho nhà sáng tạo nội dung',
    credits: 699000,
    price_vnd: 699000,
    discount_percentage: 0,
    is_popular: false,
    display_order: 3,
    active: true,
  },
  {
    name: 'Gói Doanh Nghiệp',
    name_en: 'Business Package',
    description: 'Giải pháp tốt nhất cho doanh nghiệp',
    credits: 1499000,
    price_vnd: 1499000,
    discount_percentage: 0,
    is_popular: false,
    display_order: 4,
    active: true,
  },
];

// Instructions for manual update via Supabase Dashboard
console.log('\n📝 HƯỚNG DẪN CẬP NHẬT CREDIT PACKAGES\n');
console.log('Bước 1: Truy cập Supabase Dashboard');
console.log('Bước 2: Vào Table Editor → credit_packages');
console.log('Bước 3: Xóa tất cả records cũ');
console.log('Bước 4: Insert các packages sau:\n');

PACKAGES.forEach((pkg, index) => {
  console.log(`\n📦 Package ${index + 1}:`);
  console.log(`   name: ${pkg.name}`);
  console.log(`   name_en: ${pkg.name_en}`);
  console.log(`   description: ${pkg.description}`);
  console.log(`   credits: ${pkg.credits}`);
  console.log(`   price_vnd: ${pkg.price_vnd}`);
  console.log(`   discount_percentage: ${pkg.discount_percentage}`);
  console.log(`   is_popular: ${pkg.is_popular}`);
  console.log(`   display_order: ${pkg.display_order}`);
  console.log(`   active: ${pkg.active}`);
});

console.log('\n\n📋 SQL Script để chạy trong SQL Editor:\n');
console.log('-- Delete old packages');
console.log('DELETE FROM public.credit_packages;\n');
console.log('-- Insert new packages');
console.log('INSERT INTO public.credit_packages (');
console.log('  name, name_en, description, credits, price_vnd,');
console.log('  discount_percentage, is_popular, display_order, active');
console.log(') VALUES');

PACKAGES.forEach((pkg, index) => {
  const comma = index < PACKAGES.length - 1 ? ',' : ';';
  console.log(`  ('${pkg.name}', '${pkg.name_en}', '${pkg.description}', ${pkg.credits}, ${pkg.price_vnd}, ${pkg.discount_percentage}, ${pkg.is_popular}, ${pkg.display_order}, ${pkg.active})${comma}`);
});

console.log('\n✅ Copy SQL script ở trên và chạy trong Supabase SQL Editor\n');
