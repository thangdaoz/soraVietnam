# Video Generation & Pricing - Complete Reference

**Date:** October 9, 2025  
**Status:** ✅ Production Ready

---

## 🎯 **Overview**

This document explains how video generation works from pricing to API calls.

---

## 📊 **Current Pricing (Database)**

### Video Pricing Table

| ID | Model Name | Duration | Resolution | Quality | Cost |
|----|------------|----------|------------|---------|------|
| `46e230cd...` | `sora-2-text-to-video` | 10s | 1280x720 | standard | **7,000 credits** |
| `9428321f...` | `sora-2-image-to-video` | 10s | 1280x720 | standard | **7,000 credits** |

**Simple pricing:**
- ✅ Both models cost the same: **7,000 credits**
- ✅ Fixed duration: **10 seconds**
- ✅ Fixed resolution: **720p HD**
- ✅ Fixed quality: **standard**

---

## 🔄 **Flow: User → API**

### **1. User Creates Video**

User fills out form in dashboard:
```javascript
{
  prompt: "A dog running in a field",
  aspect_ratio: "landscape" // or "portrait"
}
```

### **2. Calculate Price** (`src/lib/pricing.ts`)

```typescript
const price = await calculateVideoPrice({
  type: 'text_to_video',  // Internal type
  aspect_ratio: 'landscape'
});
// Returns: 7,000 credits
```

**How it works:**
1. Maps `'text_to_video'` → `'sora-2-text-to-video'` (API model name)
2. Queries database: `video_pricing` table
3. Returns: `credits_cost` = 7,000

### **3. Check User Credits** (`src/lib/actions/video.ts`)

```typescript
if (user.credits < 7000) {
  return { error: 'Insufficient credits' };
}
```

### **4. Call API** (Kie AI Sora API)

```typescript
POST https://api.kie.ai/api/v1/jobs/createTask

Headers:
  Authorization: Bearer {VIDEO_API_KEY}
  Content-Type: application/json

Body:
{
  "model": "sora-2-text-to-video",  // ← From video_pricing.video_type
  "callBackUrl": "https://your-app.com/api/video-callback",
  "input": {
    "prompt": "A dog running in a field",
    "aspect_ratio": "landscape"
  }
}
```

**Response:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "task_12345678"
  }
}
```

### **5. Deduct Credits**

```typescript
// Deduct 7,000 credits from user
UPDATE profiles 
SET credits = credits - 7000
WHERE user_id = '...';

// Record transaction
INSERT INTO transactions (type, credits, description)
VALUES ('video_deduction', -7000, 'Video generation: A dog running...');

// Save video record
INSERT INTO videos (prompt, credits_used, external_job_id, status)
VALUES ('A dog running...', 7000, 'task_12345678', 'pending');
```

### **6. Poll Status** (Client-side)

Dashboard polls every 5 seconds:
```typescript
GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=task_12345678

Response:
{
  "code": 200,
  "data": {
    "state": "generating", // waiting → queuing → generating → success
    "taskId": "task_12345678"
  }
}
```

### **7. Video Complete** (Webhook or Polling)

When `state === 'success'`:
```json
{
  "code": 200,
  "data": {
    "state": "success",
    "resultJson": "{\"resultUrls\":[\"https://cdn.example.com/video.mp4\"]}"
  }
}
```

Update database:
```sql
UPDATE videos
SET status = 'completed',
    video_url = 'https://cdn.example.com/video.mp4',
    completed_at = NOW()
WHERE external_job_id = 'task_12345678';
```

---

## 🔧 **Model Name Mapping**

### Internal Type → API Model Name

| Internal (`VideoParams.type`) | API Model (`video_pricing.video_type`) | Used In |
|-------------------------------|----------------------------------------|---------|
| `text_to_video` | `sora-2-text-to-video` | API requests, database |
| `image_to_video` | `sora-2-image-to-video` | API requests, database |

**Why two names?**
- **Internal:** Simplified for code readability
- **API:** Exact model name required by Kie AI API

**Mapping happens in:** `src/lib/pricing.ts`
```typescript
const modelName = params.type === 'text_to_video' 
  ? 'sora-2-text-to-video' 
  : 'sora-2-image-to-video';
```

---

## 📝 **API Model Names**

According to `third-service-api.md`:

### Available Models

| Model Name | Description | Duration | Aspect Ratios |
|------------|-------------|----------|---------------|
| `sora-2-text-to-video` | Generate video from text prompt | 10s | landscape, portrait |
| `sora-2-image-to-video` | Generate video from image + prompt | 10s | landscape, portrait |

### API Request Parameters

```json
{
  "model": "sora-2-text-to-video",  // ← Must match exactly
  "callBackUrl": "https://your-app.com/api/callback",
  "input": {
    "prompt": "Text description...",
    "aspect_ratio": "landscape"  // or "portrait"
  }
}
```

---

## 💰 **Pricing Configuration**

### Database Schema: `video_pricing`

```sql
CREATE TABLE video_pricing (
  id UUID PRIMARY KEY,
  video_type TEXT,              -- 'sora-2-text-to-video' | 'sora-2-image-to-video'
  duration_seconds INTEGER,     -- 10
  resolution TEXT,              -- '1280x720'
  quality TEXT,                 -- 'standard'
  credits_cost INTEGER,         -- 7000
  description TEXT,             -- Vietnamese description
  active BOOLEAN,               -- true
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### How to Change Pricing

**Option 1: Supabase Dashboard**
1. Go to Table Editor → `video_pricing`
2. Edit `credits_cost` value (e.g., change 7000 → 5000)
3. Save
4. New price takes effect in ≤5 minutes (cache refresh)

**Option 2: SQL**
```sql
-- Change text-to-video price to 5,000 credits
UPDATE video_pricing 
SET credits_cost = 5000, updated_at = NOW()
WHERE video_type = 'sora-2-text-to-video';

-- Change both models to same price
UPDATE video_pricing 
SET credits_cost = 6000, updated_at = NOW()
WHERE video_type IN ('sora-2-text-to-video', 'sora-2-image-to-video');
```

**Option 3: Admin API** (future)
```typescript
import { updateVideoPricing } from '@/lib/actions/admin';

await updateVideoPricing('46e230cd...', 5000);
```

---

## 🎨 **Adding New Models**

If Kie AI adds new models (e.g., `sora-2-text-to-video-4k`):

### **Step 1: Add to Database**

```sql
INSERT INTO video_pricing (
  video_type,
  duration_seconds,
  resolution,
  quality,
  credits_cost,
  description,
  active
) VALUES (
  'sora-2-text-to-video-4k',  -- New model name
  10,
  '3840x2160',                -- 4K resolution
  'ultra',
  15000,                      -- Higher price for 4K
  '10 giây, 4K, chất lượng siêu cao',
  true
);
```

### **Step 2: Update Types** (if needed)

```typescript
// src/lib/pricing.ts
export interface VideoPricing {
  video_type: 'sora-2-text-to-video' 
    | 'sora-2-image-to-video' 
    | 'sora-2-text-to-video-4k';  // ← Add new model
  // ...
}
```

### **Step 3: Update UI** (if needed)

Add model selector in dashboard:
```tsx
<select name="model">
  <option value="sora-2-text-to-video">Standard (7,000 credits)</option>
  <option value="sora-2-text-to-video-4k">4K (15,000 credits)</option>
</select>
```

---

## 🔍 **Troubleshooting**

### **Price Not Updating?**

Cache may not have expired yet:
```typescript
// Clear cache manually
import { clearPricingCache } from '@/lib/pricing';
clearPricingCache();
```

Or restart dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### **Wrong Price Charged?**

Check logs for price calculation:
```
[Pricing] Fetched fresh price: 7000 credits (10 giây, HD, chất lượng tiêu chuẩn)
```

Or query database directly:
```bash
node show-pricing.mjs
```

### **API Error: Invalid Model**

Make sure `video_type` in database matches API model name exactly:
- ✅ `sora-2-text-to-video`
- ❌ `text_to_video`
- ❌ `sora2-text-to-video`

---

## 📊 **Complete Example**

### User Journey

1. **User has:** 50,000 credits
2. **User requests:** Text-to-video with prompt "A dog running"
3. **System calculates:** 7,000 credits needed
4. **System checks:** 50,000 ≥ 7,000 ✅
5. **System calls API:**
   ```json
   POST /api/v1/jobs/createTask
   {
     "model": "sora-2-text-to-video",
     "input": { "prompt": "A dog running", "aspect_ratio": "landscape" }
   }
   ```
6. **API returns:** `taskId: "abc123"`
7. **System deducts:** 50,000 - 7,000 = 43,000 credits
8. **System saves:** Video record with `external_job_id = "abc123"`
9. **Client polls:** Every 5s, checks task status
10. **Video completes:** Status → success, URL available
11. **User downloads:** Video from CDN URL

---

## 🎯 **Key Files**

| File | Purpose |
|------|---------|
| `src/lib/pricing.ts` | Price calculation, maps types to model names |
| `src/lib/actions/video.ts` | Video creation, API calls, credit deduction |
| `src/app/api/video-callback/route.ts` | Webhook handler (when video completes) |
| `src/app/dashboard/page.tsx` | User interface, polling |
| `supabase/migrations/20251007_initial_schema.sql` | Database schema (includes `video_pricing`) |
| `docs/third-service-api.md` | API documentation (model names, parameters) |

---

## ✅ **Summary**

### Current Setup

- ✅ **Pricing:** 7,000 credits for both text-to-video and image-to-video
- ✅ **Database-driven:** Change price anytime without redeploy
- ✅ **Model mapping:** Internal `text_to_video` → API `sora-2-text-to-video`
- ✅ **Caching:** 5-minute TTL for performance
- ✅ **API integration:** Uses correct model names from `video_pricing` table

### To Change Pricing

1. Edit `video_pricing` table in Supabase
2. Wait 5 minutes (or restart server)
3. Done! New price takes effect

### To Add New Models

1. Insert into `video_pricing` table
2. Update TypeScript types (optional)
3. Update UI to show new options (optional)

---

**Your pricing system is now fully integrated with the API!** 🚀
