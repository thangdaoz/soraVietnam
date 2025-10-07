# Pricing Configuration Guide

**Last Updated:** October 7, 2025  
**Version:** 2.0.0  
**Status:** ✅ REVIEWED

## Overview

Sora Vietnam Gateway uses a simple **1:1 ratio between VND and credits** for maximum transparency and user understanding.

---

## 💡 Core Principle

### 1:1 Ratio
- **1,000 VND = 1,000 credits**
- **99,000 VND = 99,000 credits**
- **1,499,000 VND = 1,499,000 credits**

**Why this is better:**
- ✅ **Crystal clear:** No confusing conversions
- ✅ **Intuitive:** Users instantly understand value
- ✅ **Simple:** No mental math required
- ✅ **Transparent:** Trust-building pricing strategy

---

## 📦 Current Pricing Structure

### Credit Packages

| Package          | Credits   | Price (VND) | Best For               |
| ---------------- | --------- | ----------- | ---------------------- |
| Starter Pack     | 99,000    | 99,000      | First-time users       |
| Basic Pack ⭐    | 299,000   | 299,000     | Regular users          |
| Pro Pack         | 699,000   | 699,000     | Professional creators  |
| Business Pack    | 1,499,000 | 1,499,000   | Businesses & teams     |

### Video Generation Costs

#### Text-to-Video
| Duration | Resolution | Quality  | Credits | VND Equivalent |
| -------- | ---------- | -------- | ------- | -------------- |
| 5s       | HD         | Standard | 20,000  | 20,000 VND     |
| 5s       | Full HD    | High     | 30,000  | 30,000 VND     |
| 10s      | HD         | Standard | 36,000  | 36,000 VND     |
| 10s      | Full HD    | High     | 50,000  | 50,000 VND     |

#### Image-to-Video
| Duration | Resolution | Quality  | Credits | VND Equivalent |
| -------- | ---------- | -------- | ------- | -------------- |
| 5s       | HD         | Standard | 30,000  | 30,000 VND     |
| 5s       | Full HD    | High     | 40,000  | 40,000 VND     |
| 10s      | HD         | Standard | 50,000  | 50,000 VND     |
| 10s      | Full HD    | High     | 70,000  | 70,000 VND     |

---

## 🔧 How to Adjust Pricing

### Configuration Method: Database Only

**Philosophy:** Keep it simple. All pricing is stored in the database and can be updated via SQL.

### Step 1: Update Credit Packages

```sql
-- Example: Change Starter Pack from 99k to 79k
UPDATE public.credit_packages
SET 
  credits = 79000,
  price_vnd = 79000
WHERE name_en = 'Starter Pack';

-- Example: Add a new "Mega Pack"
INSERT INTO public.credit_packages (
  name, 
  name_en, 
  description, 
  credits, 
  price_vnd, 
  discount_percentage, 
  is_popular, 
  display_order
) VALUES (
  'Gói Siêu Khủng',
  'Mega Pack',
  'Giải pháp cho doanh nghiệp lớn',
  3000000,  -- 3 million credits
  3000000,  -- 3 million VND
  0,
  false,
  5
);
```

### Step 2: Update Video Pricing

```sql
-- Example: Reduce 5s HD cost from 20k to 15k
UPDATE public.video_pricing
SET credits_cost = 15000
WHERE 
  video_type = 'text_to_video' 
  AND duration_seconds = 5 
  AND resolution = '1280x720'
  AND quality = 'standard';

-- Example: Add pricing for 15-second videos
INSERT INTO public.video_pricing (
  video_type,
  duration_seconds,
  resolution,
  quality,
  credits_cost,
  description,
  active
) VALUES
  ('text_to_video', 15, '1280x720', 'standard', 54000, '15 giây, HD, chất lượng tiêu chuẩn', true),
  ('text_to_video', 15, '1920x1080', 'high', 75000, '15 giây, Full HD, chất lượng cao', true);
```

### Step 3: Verify Changes

```sql
-- Check all active packages
SELECT name_en, credits, price_vnd, credits = price_vnd as "is_1_to_1"
FROM public.credit_packages
WHERE active = true
ORDER BY display_order;

-- Check all active video pricing
SELECT 
  video_type, 
  duration_seconds, 
  resolution, 
  quality, 
  credits_cost,
  credits_cost || ' VND' as equivalent_vnd
FROM public.video_pricing
WHERE active = true
ORDER BY video_type, duration_seconds, resolution;
```

---

## 📊 Pricing Formulas

### Video Cost Calculation

```
Base Cost (5s HD text-to-video) = 20,000 credits

Duration Multiplier:
- 5s  = 1.0x
- 10s = 1.8x
- 15s = 2.7x (if added later)

Resolution Multiplier:
- HD (720p)      = 1.0x
- Full HD (1080p) = 1.5x

Type Multiplier:
- Text-to-video  = 1.0x
- Image-to-video = 1.5x

Final Cost = Base × Duration × Resolution × Type

Example: 10s Full HD image-to-video
= 20,000 × 1.8 × 1.5 × 1.5
= 81,000 credits
≈ 70,000 credits (rounded for competitive pricing)
```

---

## 🎯 Pricing Strategy

### Current Approach (v2.0)
- ✅ **1:1 ratio**: No confusion
- ✅ **No promotions**: Keep it simple for launch
- ✅ **Database-only**: Easy to understand and maintain
- ✅ **Fair pricing**: Competitive with market

### Future Considerations (v3.0+)
Once we have market data and user feedback, we MAY consider:

1. **Welcome Bonus**: Give new users 20,000 free credits
2. **Referral Program**: Reward users for bringing friends
3. **Seasonal Promotions**: Tết bonuses, Black Friday deals
4. **Loyalty Tiers**: Reward frequent buyers
5. **Subscription Plans**: Monthly credit packages with discounts

But for **NOW**: Keep it simple! 1:1 ratio, no promotions, database-only configuration.

---

## 🔄 Price Adjustment Best Practices

### When to Adjust Prices

1. **Cost Changes**
   - API costs increase/decrease by >15%
   - Payment gateway fees change
   - Exchange rates fluctuate significantly

2. **Market Competition**
   - Competitor launches lower pricing
   - New market entrant appears
   - Market leader changes strategy

3. **User Feedback**
   - Conversion rate drops below 10%
   - Users complain about specific video costs
   - Surveys indicate price sensitivity

### How to Test Price Changes

```sql
-- Option 1: Create a test package to A/B test
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
  'Gói Thử Nghiệm',
  'Test Pack',
  'Giá khuyến mãi thử nghiệm',
  150000,
  150000,
  0,
  false,
  99,
  true  -- Show to users
);

-- After testing, deactivate
UPDATE public.credit_packages
SET active = false
WHERE name_en = 'Test Pack';
```

### Communication Checklist

Before changing prices:
- [ ] Analyze impact on revenue and margins
- [ ] Draft user communication (email, in-app notice)
- [ ] Grandfather existing credit balances
- [ ] Update pricing page
- [ ] Update marketing materials
- [ ] Announce changes 1-2 weeks in advance
- [ ] Implement database changes
- [ ] Monitor conversion rates post-change

---

## 💾 Backup and Rollback

### Before Making Changes

```sql
-- Backup current pricing to a text file
COPY (
  SELECT * FROM public.credit_packages WHERE active = true
) TO '/path/to/backup/credit_packages_backup.csv' CSV HEADER;

COPY (
  SELECT * FROM public.video_pricing WHERE active = true
) TO '/path/to/backup/video_pricing_backup.csv' CSV HEADER;
```

### If You Need to Rollback

```sql
-- Restore previous pricing (example)
UPDATE public.credit_packages
SET credits = 99000, price_vnd = 99000
WHERE name_en = 'Starter Pack';

-- Or restore from backup CSV using psql
\copy public.credit_packages FROM '/path/to/backup/credit_packages_backup.csv' CSV HEADER;
```

---

## 🎓 Examples

### Example 1: Promotional Limited-Time Package

```sql
-- Add a special Tết package (valid for 2 weeks)
INSERT INTO public.credit_packages (
  name, 
  name_en, 
  description, 
  credits, 
  price_vnd, 
  discount_percentage, 
  is_popular, 
  display_order
) VALUES (
  'Gói Tết 2026',
  'Lunar New Year Special',
  'Ưu đãi đặc biệt mừng Tết Ất Tỵ - Có hạn đến 15/2/2026',
  399000,   -- Same as price
  399000,   -- Special price
  0,
  true,     -- Mark as popular
  2         -- Show prominently
);

-- After Tết, deactivate it
UPDATE public.credit_packages
SET active = false
WHERE name_en = 'Lunar New Year Special';
```

### Example 2: Adjust for API Cost Increase

```sql
-- API costs increased by 20%, adjust video pricing proportionally
UPDATE public.video_pricing
SET credits_cost = ROUND(credits_cost * 1.2);

-- Round to nice numbers
UPDATE public.video_pricing
SET credits_cost = 24000  -- was 20000 × 1.2 = 24000
WHERE credits_cost BETWEEN 23000 AND 25000;

UPDATE public.video_pricing
SET credits_cost = 36000  -- was 30000 × 1.2 = 36000
WHERE credits_cost BETWEEN 35000 AND 37000;
```

### Example 3: Add New Video Duration

```sql
-- Users requested 20-second videos
INSERT INTO public.video_pricing (
  video_type,
  duration_seconds,
  resolution,
  quality,
  credits_cost,
  description,
  active
) VALUES
  -- Text-to-video 20s
  ('text_to_video', 20, '1280x720', 'standard', 72000, '20 giây, HD, chất lượng tiêu chuẩn', true),
  ('text_to_video', 20, '1920x1080', 'high', 100000, '20 giây, Full HD, chất lượng cao', true),
  
  -- Image-to-video 20s
  ('image_to_video', 20, '1280x720', 'standard', 100000, '20 giây từ ảnh, HD, chất lượng tiêu chuẩn', true),
  ('image_to_video', 20, '1920x1080', 'high', 140000, '20 giây từ ảnh, Full HD, chất lượng cao', true);
```

---

## ✅ Summary

**Simple Rules:**
1. **1 VND = 1 credit** (always)
2. **All pricing in database** (single source of truth)
3. **Update via SQL** (direct and transparent)
4. **Test before deploying** (create test packages)
5. **Communicate changes** (tell users in advance)
6. **Monitor results** (track conversion rates)

**No complicated .env configurations, no dynamic multipliers, no promotional complexity.**

Just simple, transparent, database-driven pricing that users can understand at a glance.

---

**Document Version:** 2.0.0  
**Review Date:** October 7, 2025  
**Next Review:** Post-launch (Month 3)  
**Approved by:** Project Lead
