-- Migration: Fix Credit Packages Data
-- Description: Update credit packages with correct pricing structure (1 VND = 1 credit)
-- Created: 2025-10-11
-- Version: 1.0.0

-- Delete old incorrect data
DELETE FROM public.credit_packages;

-- Insert corrected credit packages with proper pricing
-- Pricing Structure: 1 VND = 1 credit (simple conversion)

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
) VALUES
  (
    'Gói Dùng Thử',
    'Trial Package',
    'Hoàn hảo để bắt đầu trải nghiệm',
    99000,
    99000,
    0,
    false,
    1,
    true
  ),
  (
    'Gói Cơ Bản',
    'Basic Package',
    'Phù hợp cho người dùng thường xuyên',
    299000,
    299000,
    0,
    true,
    2,
    true
  ),
  (
    'Gói Chuyên Nghiệp',
    'Professional Package',
    'Dành cho nhà sáng tạo nội dung',
    699000,
    699000,
    0,
    false,
    3,
    true
  ),
  (
    'Gói Doanh Nghiệp',
    'Business Package',
    'Giải pháp tốt nhất cho doanh nghiệp',
    1499000,
    1499000,
    0,
    false,
    4,
    true
  );

-- Verify the inserted data
SELECT 
  name,
  name_en,
  credits,
  price_vnd,
  discount_percentage,
  is_popular,
  active
FROM public.credit_packages
ORDER BY display_order;
