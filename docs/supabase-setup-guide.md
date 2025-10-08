# Supabase Setup Guide

## Step 1: Apply Database Migrations ✅ **DO THIS FIRST**

### Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar  
   - Click "New query"

3. **Apply Each Migration File in Order:**

   Run these SQL files **one by one**, in this exact order:

   #### Migration 1: Initial Schema
   ```bash
   File: supabase/migrations/20251007_initial_schema.sql
   ```
   - Copy the entire file content
   - Paste into SQL Editor
   - Click "Run" button
   - ✅ Should see "Success" message

   #### Migration 2: RLS Policies  
   ```bash
   File: supabase/migrations/20251007_rls_policies.sql
   ```

   #### Migration 3: Security Functions
   ```bash
   File: supabase/migrations/20251007_security_functions.sql
   ```

   #### Migration 4: Enhanced Security
   ```bash
   File: supabase/migrations/20251007_enhanced_security.sql
   ```

   #### Migration 5: Security Hardening
   ```bash
   File: supabase/migrations/20251007_security_hardening.sql
   ```

4. **Verify Tables Created**
   - Go to "Table Editor" in left sidebar
   - You should see these tables:
     - ✅ `profiles`
     - ✅ `videos`
     - ✅ `transactions`
     - ✅ `credit_packages`
     - ✅ `video_pricing`

---

## Step 2: Configure Authentication Providers

### Email/Password Authentication

1. Go to **Authentication → Providers** in Supabase Dashboard
2. Find "Email" provider
3. Enable "Email Authentication"
4. Configure settings:
   - ✅ **Enable email confirmations** (recommended)
   - ✅ **Enable signup** (allow new users to register)
   - Set **Minimum password length**: 8
5. Click **Save**

### Google OAuth (Optional but Recommended)

1. **Create Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://pjgwpksoqubtzfsetjbu.supabase.co/auth/v1/callback
     ```
   - Copy **Client ID** and **Client Secret**

2. **Configure in Supabase:**
   - Go to **Authentication → Providers** in Supabase Dashboard
   - Find "Google" provider
   - Enable it
   - Paste your **Client ID** and **Client Secret**
   - Click **Save**

### Site URL Configuration

1. Go to **Authentication → URL Configuration**
2. Set **Site URL**: `http://localhost:3000` (for development)
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/**
   https://your-production-domain.com/**
   ```
4. Click **Save**

---

## Step 3: Set Up Email Templates

### Configure Email Templates

1. Go to **Authentication → Email Templates** in Supabase Dashboard

2. **Confirm signup** template:
   - Subject: `Xác nhận tài khoản của bạn / Confirm your account`
   - Body: Customize with Vietnamese translation (see example below)

3. **Reset password** template:
   - Subject: `Đặt lại mật khẩu / Reset your password`
   - Body: Customize with Vietnamese translation

4. **Magic link** template (optional):
   - Subject: `Đăng nhập nhanh / Quick login`
   - Body: Customize with Vietnamese translation

### Example Confirmation Email (Vietnamese + English):

```html
<h2>Chào mừng đến với Sora Vietnam Gateway!</h2>
<p>Cảm ơn bạn đã đăng ký. Vui lòng xác nhận địa chỉ email của bạn:</p>
<p><a href="{{ .ConfirmationURL }}">Xác nhận email</a></p>

<hr/>

<h2>Welcome to Sora Vietnam Gateway!</h2>
<p>Thanks for signing up! Please confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
```

---

## Step 4: Insert Initial Data

### Add Credit Packages

Run this SQL in the SQL Editor to add initial credit packages:

```sql
INSERT INTO public.credit_packages (name, name_en, description, credits, price_vnd, discount_percentage, is_popular, display_order, active) 
VALUES
  ('Gói Khởi Đầu', 'Starter Package', 'Hoàn hảo để thử nghiệm', 100, 100000, 0, false, 1, true),
  ('Gói Phổ Biến', 'Popular Package', 'Lựa chọn phổ biến nhất', 500, 450000, 10, true, 2, true),
  ('Gói Chuyên Nghiệp', 'Professional Package', 'Cho người dùng thường xuyên', 1000, 850000, 15, false, 3, true),
  ('Gói Doanh Nghiệp', 'Enterprise Package', 'Giải pháp doanh nghiệp', 5000, 4000000, 20, false, 4, true);
```

### Add Video Pricing

```sql
INSERT INTO public.video_pricing (video_type, duration_seconds, credits_required, is_default, active)
VALUES
  ('text_to_video', 5, 10, true, true),
  ('text_to_video', 10, 20, false, true),
  ('image_to_video', 5, 15, true, true),
  ('image_to_video', 10, 30, false, true);
```

---

## Step 5: Test the Setup

### Run the Test Page

1. **Start the development server:**
   ```powershell
   npm run dev
   ```

2. **Open the test page:**
   ```
   http://localhost:3000/test-supabase
   ```

3. **Check all tests pass:**
   - ✅ Database connection
   - ✅ Tables exist
   - ✅ RLS is enabled
   - ✅ Environment variables configured

### Test Authentication

1. **Go to login page:**
   ```
   http://localhost:3000/login
   ```

2. **Try to sign up a new user**

3. **Check Supabase Dashboard → Authentication → Users**
   - You should see your new user

---

## Step 6: Security Checklist

Before going to production:

- [ ] All migrations applied successfully
- [ ] RLS (Row Level Security) enabled on all tables
- [ ] Email confirmations enabled
- [ ] Strong password requirements set (min 8 characters)
- [ ] Site URL and redirect URLs configured correctly
- [ ] Email templates translated to Vietnamese
- [ ] Service role key kept secret (never expose in client-side code)
- [ ] Test user registration and login flows
- [ ] Test password reset flow
- [ ] Verify users can only access their own data

---

## Troubleshooting

### Error: "relation does not exist"
❌ **Problem:** Tables haven't been created  
✅ **Solution:** Apply migrations in Step 1

### Error: "new row violates row-level security policy"
❌ **Problem:** RLS is blocking access  
✅ **Solution:** Check if RLS policies were applied (Migration 2)

### Error: "Invalid API key"
❌ **Problem:** Environment variables not set correctly  
✅ **Solution:** Check `.env.local` file has correct keys

### Users can't sign up
❌ **Problem:** Email provider not enabled  
✅ **Solution:** Enable Email authentication in Step 2

### Email confirmation not working
❌ **Problem:** Email templates not configured  
✅ **Solution:** Set up email templates in Step 3

---

## Next Steps

After completing this setup:

1. ✅ Mark "Supabase Setup" tasks complete in TODO.md
2. ✅ Move to Week 5-8: User Management
3. ✅ Build registration and login flows
4. ✅ Implement profile management
5. ✅ Create session middleware

---

## Quick Reference

**Supabase Project URL:**  
```
https://pjgwpksoqubtzfsetjbu.supabase.co
```

**Test Page:**  
```
http://localhost:3000/test-supabase
```

**Supabase Dashboard:**  
```
https://supabase.com/dashboard/project/pjgwpksoqubtzfsetjbu
```

---

**Need Help?** Check the [Supabase Documentation](https://supabase.com/docs) or the project's technical documentation in `docs/`
