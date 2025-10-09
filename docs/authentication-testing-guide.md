# Authentication Testing Guide - Sora Vietnam Gateway

This document provides comprehensive testing scenarios for all authentication flows in the Sora Vietnam Gateway application.

## 📋 Testing Checklist Overview

- [ ] User Registration Flow
- [ ] Email Verification Flow
- [ ] Login Flow (Email/Password)
- [ ] OAuth Login Flow (Google)
- [ ] Password Reset Flow
- [ ] Profile Update Flow
- [ ] Password Change Flow
- [ ] Session Management & Middleware
- [ ] Account Deletion Flow
- [ ] RLS Policy Verification
- [ ] Error Handling & Edge Cases

---

## 1. User Registration Flow

### Test Case 1.1: Successful Registration

**Steps:**
1. Navigate to `/sign-up`
2. Fill in the form:
   - Full Name: "Nguyễn Văn A"
   - Email: "test@example.com"
   - Password: "Test123456" (meets requirements)
   - Confirm Password: "Test123456"
3. Click "Đăng ký" button

**Expected Results:**
- ✅ Form submits without errors
- ✅ Success message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
- ✅ User redirected to `/auth/verify-email`
- ✅ Email sent to user's inbox
- ✅ Profile created in `profiles` table with `id = user_id`
- ✅ Initial `credit_balance = 0`

**Database Verification:**
```sql
-- Check user was created
SELECT * FROM auth.users WHERE email = 'test@example.com';

-- Check profile was created via trigger
SELECT * FROM public.profiles WHERE email = 'test@example.com';

-- Verify id matches user_id
SELECT 
  p.id, 
  p.user_id, 
  p.id = p.user_id as ids_match 
FROM public.profiles p
WHERE p.email = 'test@example.com';
```

### Test Case 1.2: Duplicate Email Registration

**Steps:**
1. Try to register with same email as Test Case 1.1

**Expected Results:**
- ✅ Error message: "Email đã được sử dụng"
- ✅ Form stays on same page
- ✅ No duplicate profile created

### Test Case 1.3: Password Validation

**Test weak passwords:**
- "test" → ❌ "Mật khẩu phải có ít nhất 8 ký tự"
- "testtest" → ❌ "Mật khẩu phải có ít nhất 1 chữ hoa"
- "TESTTEST" → ❌ "Mật khẩu phải có ít nhất 1 chữ thường"
- "TestTest" → ❌ "Mật khẩu phải có ít nhất 1 chữ số"
- "Test1234" → ✅ Accepted

### Test Case 1.4: Password Mismatch

**Steps:**
1. Password: "Test123456"
2. Confirm Password: "Test654321"

**Expected Results:**
- ✅ Error: "Mật khẩu xác nhận không khớp"

---

## 2. Email Verification Flow

### Test Case 2.1: Email Verification Link

**Steps:**
1. Complete registration from Test Case 1.1
2. Check email inbox for verification email
3. Click the verification link

**Expected Results:**
- ✅ Redirected to `/auth/callback`
- ✅ Then redirected to `/auth/success` or `/dashboard`
- ✅ User's `email_confirmed_at` is set in `auth.users`
- ✅ Can now log in

**Database Verification:**
```sql
SELECT 
  email, 
  email_confirmed_at,
  email_confirmed_at IS NOT NULL as is_verified
FROM auth.users 
WHERE email = 'test@example.com';
```

### Test Case 2.2: Expired Verification Link

**Steps:**
1. Wait for token to expire (24 hours default)
2. Try to click verification link

**Expected Results:**
- ✅ Error message displayed
- ✅ Option to resend verification email

---

## 3. Login Flow (Email/Password)

### Test Case 3.1: Successful Login

**Steps:**
1. Navigate to `/login`
2. Enter:
   - Email: "test@example.com"
   - Password: "Test123456"
3. Click "Đăng nhập"

**Expected Results:**
- ✅ Redirected to `/dashboard`
- ✅ Session cookie set
- ✅ User data loaded in UI
- ✅ Credit balance displayed in header
- ✅ Logout button visible

### Test Case 3.2: Wrong Password

**Steps:**
1. Navigate to `/login`
2. Enter correct email, wrong password

**Expected Results:**
- ✅ Error: "Email hoặc mật khẩu không đúng"
- ✅ Form stays on same page
- ✅ No session created

### Test Case 3.3: Unverified Email Login

**Steps:**
1. Try to login with unverified account

**Expected Results:**
- ✅ Error: "Vui lòng xác thực email trước khi đăng nhập"
- ✅ Link to resend verification email

### Test Case 3.4: Remember Me Functionality

**Steps:**
1. Check "Ghi nhớ đăng nhập" checkbox
2. Login successfully
3. Close browser
4. Reopen browser and visit site

**Expected Results:**
- ✅ User still logged in (session persisted)

### Test Case 3.5: Protected Route Redirect

**Steps:**
1. While logged out, navigate to `/profile`

**Expected Results:**
- ✅ Redirected to `/login?redirectTo=/profile`
- ✅ After login, redirected back to `/profile`

---

## 4. OAuth Login Flow (Google)

### Test Case 4.1: Successful Google OAuth

**Steps:**
1. Navigate to `/login`
2. Click "Đăng nhập với Google"
3. Select Google account
4. Approve permissions

**Expected Results:**
- ✅ Redirected to Google consent screen
- ✅ After approval, redirected to `/auth/callback`
- ✅ Then redirected to `/dashboard`
- ✅ Profile created with Google email
- ✅ `avatar_url` populated with Google profile picture
- ✅ `full_name` populated from Google

**Database Verification:**
```sql
-- Check OAuth identity
SELECT 
  u.email,
  u.raw_user_meta_data->>'avatar_url' as avatar,
  u.raw_user_meta_data->>'full_name' as name
FROM auth.users u
WHERE email = 'google-test@gmail.com';

-- Check profile
SELECT * FROM public.profiles WHERE email = 'google-test@gmail.com';
```

### Test Case 4.2: OAuth Account Already Exists

**Steps:**
1. Register with email/password
2. Try to login with Google using same email

**Expected Results:**
- ✅ Accounts linked OR
- ✅ Clear error message about existing account

### Test Case 4.3: OAuth Cancellation

**Steps:**
1. Click Google login
2. Cancel on Google consent screen

**Expected Results:**
- ✅ Redirected back to login page
- ✅ Error message: "Đăng nhập bị hủy"

---

## 5. Password Reset Flow

### Test Case 5.1: Successful Password Reset Request

**Steps:**
1. Navigate to `/forgot-password`
2. Enter registered email
3. Click "Gửi liên kết đặt lại"

**Expected Results:**
- ✅ Success message displayed
- ✅ Reset email sent
- ✅ Email contains reset link

### Test Case 5.2: Reset with Invalid Email

**Steps:**
1. Enter non-existent email
2. Submit form

**Expected Results:**
- ✅ Generic message (security): "Nếu email tồn tại, liên kết đặt lại đã được gửi"
- ✅ No error revealing email doesn't exist

### Test Case 5.3: Complete Password Reset

**Steps:**
1. Click reset link from email
2. Redirected to `/reset-password?token=...`
3. Enter new password
4. Confirm new password
5. Submit

**Expected Results:**
- ✅ Success message
- ✅ Password updated in database
- ✅ Redirected to `/login`
- ✅ Can login with new password

### Test Case 5.4: Expired Reset Token

**Steps:**
1. Use old/expired reset link

**Expected Results:**
- ✅ Error: "Liên kết đã hết hạn"
- ✅ Option to request new reset link

---

## 6. Profile Update Flow

### Test Case 6.1: Successful Profile Update

**Steps:**
1. Login and navigate to `/profile`
2. Update fields:
   - Full Name: "Nguyễn Văn B"
   - Phone: "+84 901 234 567"
   - Company: "ABC Corp"
3. Click "Lưu thay đổi"

**Expected Results:**
- ✅ Success message: "Cập nhật thông tin thành công!"
- ✅ Changes reflected in database
- ✅ `updated_at` timestamp updated

**Database Verification:**
```sql
SELECT 
  full_name,
  phone,
  company,
  updated_at
FROM public.profiles 
WHERE email = 'test@example.com';
```

### Test Case 6.2: Invalid Phone Number

**Steps:**
1. Enter invalid phone: "abc123"
2. Submit form

**Expected Results:**
- ✅ Validation error displayed
- ✅ Form not submitted

---

## 7. Password Change Flow

### Test Case 7.1: Successful Password Change

**Steps:**
1. Navigate to `/profile`
2. Scroll to "Đổi mật khẩu" section
3. Enter:
   - Current Password: "Test123456"
   - New Password: "NewTest123456"
   - Confirm Password: "NewTest123456"
4. Submit

**Expected Results:**
- ✅ Success message
- ✅ Password updated
- ✅ Can login with new password
- ✅ Cannot login with old password

### Test Case 7.2: Wrong Current Password

**Steps:**
1. Enter wrong current password
2. Submit

**Expected Results:**
- ✅ Error: "Mật khẩu hiện tại không đúng"
- ✅ Password not changed

### Test Case 7.3: Password Mismatch

**Steps:**
1. New password and confirm password don't match

**Expected Results:**
- ✅ Error: "Mật khẩu xác nhận không khớp"

---

## 8. Session Management & Middleware

### Test Case 8.1: Protected Routes Require Auth

**Test each protected route while logged out:**
- `/dashboard` → Redirect to `/login?redirectTo=/dashboard`
- `/profile` → Redirect to `/login?redirectTo=/profile`
- `/checkout` → Redirect to `/login?redirectTo=/checkout`
- `/gallery` → Redirect to `/login?redirectTo=/gallery`

### Test Case 8.2: Auth Routes Redirect When Logged In

**Test each auth route while logged in:**
- `/login` → Redirect to `/dashboard`
- `/sign-up` → Redirect to `/dashboard`
- `/forgot-password` → Redirect to `/dashboard`
- `/reset-password` → Redirect to `/dashboard`

### Test Case 8.3: Session Persistence

**Steps:**
1. Login
2. Refresh page multiple times
3. Navigate between pages

**Expected Results:**
- ✅ Session persists across refreshes
- ✅ No unexpected logouts
- ✅ User data remains loaded

### Test Case 8.4: Logout Functionality

**Steps:**
1. Login to dashboard
2. Click logout button in `AuthButtons` component
3. Confirm logout

**Expected Results:**
- ✅ Session cleared
- ✅ Redirected to home page `/`
- ✅ Cannot access protected routes
- ✅ Login button visible in header

---

## 9. Account Deletion Flow

### Test Case 9.1: Successful Account Deletion

**Steps:**
1. Login and navigate to `/profile`
2. Scroll to "Xóa tài khoản" section
3. Click "Xóa tài khoản"
4. Confirm deletion

**Expected Results:**
- ✅ Confirmation prompt appears
- ✅ After confirmation, account soft-deleted
- ✅ `deleted_at` timestamp set
- ✅ User logged out
- ✅ Cannot login anymore
- ✅ Email available for new registration

**Database Verification:**
```sql
-- Check soft delete
SELECT 
  email,
  deleted_at,
  deleted_at IS NOT NULL as is_deleted
FROM public.profiles 
WHERE email = 'test@example.com';

-- Auth user should also be deleted
SELECT * FROM auth.users WHERE email = 'test@example.com';
```

### Test Case 9.2: Cancel Account Deletion

**Steps:**
1. Click "Xóa tài khoản"
2. Click "Hủy" on confirmation

**Expected Results:**
- ✅ Deletion cancelled
- ✅ Account remains active

---

## 10. RLS Policy Verification

### Test Case 10.1: Users Can Only Read Their Own Profile

**Manual Database Test:**
```sql
-- As user A, try to read user B's profile
SET request.jwt.claims.sub = 'user-a-id';
SELECT * FROM profiles WHERE user_id = 'user-b-id';
-- Should return 0 rows
```

### Test Case 10.2: Users Can Only Update Their Own Profile

**Manual Database Test:**
```sql
-- As user A, try to update user B's profile
SET request.jwt.claims.sub = 'user-a-id';
UPDATE profiles 
SET full_name = 'Hacked' 
WHERE user_id = 'user-b-id';
-- Should fail or affect 0 rows
```

### Test Case 10.3: Credit Balance Cannot Be Manipulated

**Test via Browser DevTools:**
1. Open browser console
2. Try to update profile with modified credit_balance:
```javascript
await fetch('/api/profile', {
  method: 'POST',
  body: JSON.stringify({ credit_balance: 999999999 })
});
```

**Expected Results:**
- ✅ Credit balance remains unchanged
- ✅ RLS policy blocks unauthorized update

---

## 11. Error Handling & Edge Cases

### Test Case 11.1: Network Errors

**Steps:**
1. Disable network
2. Try to login

**Expected Results:**
- ✅ User-friendly error message
- ✅ No app crash

### Test Case 11.2: Malformed Inputs

**Test with various malformed inputs:**
- SQL injection attempts: `' OR '1'='1`
- XSS attempts: `<script>alert('XSS')</script>`
- Very long strings (> 1000 chars)
- Special characters: `éàçñ@#$%`

**Expected Results:**
- ✅ Input sanitized
- ✅ Validation errors shown
- ✅ No security vulnerabilities

### Test Case 11.3: Concurrent Sessions

**Steps:**
1. Login on Browser A
2. Login on Browser B with same account
3. Logout on Browser A
4. Try to use Browser B

**Expected Results:**
- ✅ Browser B session still valid OR
- ✅ Clear session invalidation behavior

### Test Case 11.4: Token Expiry

**Steps:**
1. Login
2. Wait for token to expire (1 hour default)
3. Try to access protected route

**Expected Results:**
- ✅ Session refresh attempted automatically
- ✅ If refresh fails, redirected to login
- ✅ No unexpected errors

---

## 12. Performance & Load Testing

### Test Case 12.1: Multiple Concurrent Logins

**Steps:**
1. Simulate 50 concurrent login requests

**Expected Results:**
- ✅ All requests handled
- ✅ No timeouts
- ✅ Response time < 2 seconds

### Test Case 12.2: Database Query Performance

**Verify query performance:**
```sql
EXPLAIN ANALYZE 
SELECT * FROM profiles WHERE user_id = 'some-id';

EXPLAIN ANALYZE
SELECT * FROM profiles WHERE email = 'test@example.com';
```

**Expected Results:**
- ✅ Indexes used efficiently
- ✅ Query time < 50ms

---

## 13. Mobile & Browser Compatibility

### Test Case 13.1: Mobile Responsive Testing

**Test on devices:**
- iOS Safari
- Android Chrome
- Tablet (iPad)

**Expected Results:**
- ✅ Forms usable on mobile
- ✅ OAuth works on mobile browsers
- ✅ No layout issues

### Test Case 13.2: Browser Compatibility

**Test on browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Expected Results:**
- ✅ All features work
- ✅ Consistent UX

---

## 📊 Test Results Summary Template

```
=== Authentication Testing Results ===
Date: __________
Tester: __________

Registration Flow:          ✅ ❌
Email Verification:         ✅ ❌
Login (Email/Password):     ✅ ❌
OAuth Login:                ✅ ❌
Password Reset:             ✅ ❌
Profile Update:             ✅ ❌
Password Change:            ✅ ❌
Session Management:         ✅ ❌
Account Deletion:           ✅ ❌
RLS Policies:               ✅ ❌
Error Handling:             ✅ ❌

Critical Issues Found: ____
Non-Critical Issues: ____

Notes:
- 
- 
- 
```

---

## 🔧 Automated Testing Considerations

For future implementation, consider these automated tests:

### Unit Tests (Jest + React Testing Library)
```typescript
// Example: Login form validation
describe('LoginPage', () => {
  it('shows error for invalid email', async () => {
    render(<LoginPage />);
    // Test implementation
  });
});
```

### Integration Tests (Playwright/Cypress)
```typescript
// Example: Full login flow
test('user can login and access dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'Test123456');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### API Tests (Postman/Supertest)
```typescript
// Example: Server action test
describe('POST /auth/login', () => {
  it('returns session on valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'Test123456' });
    expect(response.status).toBe(200);
  });
});
```

---

**Last Updated:** October 9, 2025  
**Next Review:** Before Production Launch
