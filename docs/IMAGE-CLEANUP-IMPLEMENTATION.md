# Image Cleanup Implementation

**Date:** October 10, 2025  
**Feature:** Automatic cleanup of reference images after video generation  
**Status:** Complete

---

## 📋 Overview

Implemented automatic deletion of reference images from Supabase Storage after video generation completes (either success or failure). This prevents unnecessary storage usage since reference images are only needed during the video generation process.

---

## ✅ What Was Implemented

### 1. **Webhook Callback Cleanup** (`src/app/api/video-callback/route.ts`)

When the video API provider sends a completion callback (success or failure), the webhook now:

1. Processes the video status update
2. **NEW:** Extracts the image file path from the `image_url` stored in the database
3. **NEW:** Deletes the reference image from Supabase Storage
4. Logs the cleanup operation

**Trigger Conditions:**
- Video status becomes `completed` OR `failed`
- Video has an `image_url` (was image-to-video generation)

**Code Location:** Lines 128-152 in `video-callback/route.ts`

```typescript
// Cleanup: Delete reference image from storage if this was image-to-video
if (video.image_url && (dbStatus === 'completed' || dbStatus === 'failed')) {
  // Extract file path from URL
  // Delete from storage
  // Log result
}
```

---

### 2. **Manual Delete Cleanup** (`src/lib/actions/video.ts`)

When a user manually deletes a video from the dashboard, the system now:

1. Fetches the video to check for `image_url`
2. Performs soft delete (sets `deleted_at` timestamp)
3. **NEW:** If image exists, extracts the file path
4. **NEW:** Deletes the reference image from Supabase Storage
5. Logs the cleanup operation

**Trigger Conditions:**
- User clicks delete button on a video
- Video has an `image_url` (was image-to-video generation)

**Code Location:** Updated `deleteVideo()` function in `video.ts`

---

### 3. **Storage Policies Update** (`supabase/migrations/20251010_fix_images_storage.sql`)

Updated Supabase Storage policies to allow deletion:

**Added Policy:**
```sql
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Security:**
- Users can only delete images in their own folder (`{user_id}/...`)
- Requires authentication
- Applies to `images` bucket only

---

## 🔄 Cleanup Flow

### Image-to-Video Generation Flow:

```
1. User uploads image
   ↓
2. Image stored at: {user_id}/reference-images/{timestamp}-{random}.{ext}
   ↓
3. Video generation starts (API receives image URL)
   ↓
4. API processes video...
   ↓
5. API sends webhook callback (success/failure)
   ↓
6. Webhook processes callback
   ↓
7. ✨ AUTO-DELETE: Reference image removed from storage
   ↓
8. User sees completed video (no storage waste!)
```

### Manual Delete Flow:

```
1. User clicks delete on video
   ↓
2. System fetches video metadata
   ↓
3. Video marked as deleted in database
   ↓
4. ✨ AUTO-DELETE: Reference image removed from storage (if exists)
   ↓
5. Dashboard revalidated
```

---

## 📊 Storage Impact

### Before Implementation:
- ❌ Every reference image stored permanently
- ❌ Storage grows with every image-to-video generation
- ❌ Unused images accumulate over time
- ❌ Storage costs increase indefinitely

### After Implementation:
- ✅ Reference images deleted after video generation
- ✅ Minimal storage footprint
- ✅ Only active (pending/processing) videos have images
- ✅ Storage usage remains constant

### Example Calculation:
- Average reference image: 2 MB
- 1000 image-to-video generations/month
- **Before:** 2 GB storage/month = 2 GB accumulated forever
- **After:** ~10 MB storage at any time (only pending videos)
- **Savings:** 99.5% storage reduction! 🎉

---

## 🔧 Technical Details

### URL Parsing Logic:

```typescript
// Input: https://pjgwpksoqubtzfsetjbu.supabase.co/storage/v1/object/public/images/7d0db514-1fba-4678-b0ae-d383b529ab76/reference-images/1760071049486-4ha9ko495um.png

// Extract path after "/public/images/"
const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)$/);

// Result: 7d0db514-1fba-4678-b0ae-d383b529ab76/reference-images/1760071049486-4ha9ko495um.png
const filePath = pathMatch[1];

// Delete using storage API
await supabase.storage.from('images').remove([filePath]);
```

### Error Handling:

- ✅ Cleanup errors are logged but don't fail the main operation
- ✅ If image deletion fails, video status still updates correctly
- ✅ Failed cleanup operations are logged for debugging
- ✅ Graceful degradation - worst case is orphaned image files

---

## 🔒 Security Considerations

### Implemented:
- ✅ Users can only delete images in their own folder (manual delete)
- ✅ Authentication required for manual delete operations
- ✅ RLS policies enforce user-level isolation for manual deletes
- ✅ **Service role used in webhook** - bypasses RLS, works even if user signed out
- ✅ Webhook uses service role client for guaranteed cleanup

### Service Role Usage:
The webhook callback uses `SUPABASE_SERVICE_ROLE_KEY` to delete images because:
- ✅ **User might be signed out** while video is generating
- ✅ **No user session** in webhook context (it's a server-to-server call)
- ✅ **Guaranteed cleanup** regardless of user authentication state
- ✅ **Secure** - service role key only accessible server-side

**Important:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client!

### Not a Concern:
- Image URLs are public (images bucket is public)
- Images are temporary (deleted after use)
- No sensitive data in reference images

---

## 🧪 Testing Checklist

### Test Scenarios:

1. **Image-to-Video Success:**
   - [ ] Upload image
   - [ ] Create video with image
   - [ ] Wait for completion webhook
   - [ ] Verify image is deleted from storage
   - [ ] Verify video URL still works

2. **Image-to-Video Failure:**
   - [ ] Upload image
   - [ ] Create video that will fail (invalid prompt?)
   - [ ] Wait for failure webhook
   - [ ] Verify image is deleted from storage
   - [ ] Verify credits refunded

3. **Manual Delete:**
   - [ ] Upload image
   - [ ] Create video with image
   - [ ] Manually delete video from dashboard
   - [ ] Verify image is deleted from storage
   - [ ] Verify video marked as deleted

4. **Text-to-Video (No Image):**
   - [ ] Create text-only video
   - [ ] Wait for completion
   - [ ] Verify no errors (no image to delete)

5. **Edge Cases:**
   - [ ] Delete video before generation completes
   - [ ] Multiple videos with same image (shouldn't happen)
   - [ ] Invalid image URL in database
   - [ ] Network error during image deletion

6. **✨ User Sign-Out Test (NEW):**
   - [ ] Upload image and start video generation
   - [ ] Sign out immediately
   - [ ] Wait for video to complete
   - [ ] Verify image is still deleted (service role works!)
   - [ ] Sign back in and check video is there

---

## 📝 Migration Instructions

### To Apply This Feature:

1. **Update Code Files:**
   - ✅ `src/lib/supabase/server.ts` - Added service role client
   - ✅ `src/app/api/video-callback/route.ts` - Webhook cleanup with service role
   - ✅ `src/lib/actions/video.ts` - Manual delete cleanup

2. **Set Environment Variable:**
   ```bash
   # Add to .env.local:
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
   
   **Where to find it:**
   - Go to: https://supabase.com/dashboard/project/pjgwpksoqubtzfsetjbu/settings/api
   - Copy the "service_role" key (keep it secret!)
   - ⚠️ **Never commit this to git!** It bypasses all RLS.

3. **Apply Database Migration:**
   ```sql
   -- Run in Supabase SQL Editor:
   -- https://supabase.com/dashboard/project/pjgwpksoqubtzfsetjbu/sql/new
   
   -- Copy contents from:
   supabase/migrations/20251010_fix_images_storage.sql
   ```

4. **Verify Policies:**
   - Check Storage > Policies in Supabase dashboard
   - Ensure "Users can delete own images" policy exists
   - Ensure "Authenticated users can upload images" policy exists

5. **Test:**
   - Upload image and create video
   - Sign out (optional - to test service role works!)
   - Check storage before and after completion
   - Verify image is deleted

---

## 🎯 Future Enhancements

### Potential Improvements:

1. **Scheduled Cleanup Job:**
   - Add cron job to clean up orphaned images
   - Delete images older than 24 hours (in case webhook fails)
   - Use Supabase Edge Functions or external cron

2. **Storage Quota Monitoring:**
   - Track storage usage per user
   - Alert when storage exceeds threshold
   - Implement auto-cleanup for old images

3. **Image Optimization:**
   - Compress images before upload
   - Convert to WebP for smaller size
   - Resize to API's maximum dimensions

4. **Batch Cleanup:**
   - Delete multiple images in one operation
   - Clean up when user deletes account
   - Bulk delete for admin operations

---

## 🐛 Known Issues

### ✅ RESOLVED: User Sign-Out During Generation

**Issue:** Previously, if a user signed out while video was generating, the webhook couldn't delete the reference image because it relied on user authentication.

**Solution:** Now using `createServiceRoleClient()` in the webhook callback, which:
- Bypasses RLS policies
- Works regardless of user session state
- Guarantees cleanup even if user is signed out

**Status:** ✅ Fixed in this implementation

---

## 📞 Troubleshooting

### Issue: Images not being deleted

**Possible Causes:**
1. RLS policy not applied
2. File path extraction failing
3. User doesn't own the image folder

**Debug Steps:**
1. Check webhook logs: `console.log` messages
2. Verify image URL format in database
3. Test delete operation manually in Supabase dashboard
4. Check RLS policies in Storage settings

### Issue: "Permission denied" when deleting

**Solution:**
- Ensure migration was applied
- Check that file path starts with user's ID
- Verify user is authenticated

---

## 📚 Related Documentation

- **Video Generation:** `docs/video-generation-implementation.md`
- **Storage Setup:** `supabase/migrations/20251007_initial_schema.sql`
- **RLS Policies:** `supabase/migrations/20251007_rls_policies.sql`
- **API Documentation:** `docs/third-service-api.md`

---

**Summary:** This implementation ensures efficient storage usage by automatically cleaning up reference images after they're no longer needed, reducing storage costs and maintaining a clean storage bucket.
