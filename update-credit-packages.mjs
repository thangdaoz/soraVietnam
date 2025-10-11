/**
 * Update Credit Packages in Database
 * 
 * This script updates the credit_packages table with correct data
 * Run: node update-credit-packages.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseServiceKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

async function updatePackages() {
  console.log('🚀 Updating credit packages...\n');

  try {
    // Delete all existing packages
    const { error: deleteError } = await supabase
      .from('credit_packages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('❌ Error deleting old packages:', deleteError.message);
      process.exit(1);
    }

    console.log('✅ Deleted old packages');

    // Insert new packages
    const { data: insertedPackages, error: insertError } = await supabase
      .from('credit_packages')
      .insert(PACKAGES)
      .select();

    if (insertError) {
      console.error('❌ Error inserting packages:', insertError.message);
      process.exit(1);
    }

    console.log('✅ Inserted new packages\n');

    // Display the packages
    console.log('📦 Available Credit Packages:\n');
    insertedPackages.forEach(pkg => {
      const pricePerCredit = (Number(pkg.price_vnd) / pkg.credits).toFixed(2);
      console.log(`  ${pkg.is_popular ? '⭐ ' : ''}${pkg.name} (${pkg.name_en})`);
      console.log(`     ID: ${pkg.id}`);
      console.log(`     Credits: ${pkg.credits.toLocaleString('vi-VN')}`);
      console.log(`     Price: ${Number(pkg.price_vnd).toLocaleString('vi-VN')} VND`);
      console.log(`     Price per credit: ${pricePerCredit} VND`);
      console.log(`     Discount: ${pkg.discount_percentage}%`);
      console.log('');
    });

    console.log('✅ Credit packages updated successfully!');
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    process.exit(1);
  }
}

updatePackages();
