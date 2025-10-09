# OAuth Setup Guide - Sora Vietnam Gateway

This guide walks you through setting up Google OAuth authentication for the Sora Vietnam Gateway application.

## Prerequisites

- Active Supabase project
- Google Cloud Console account
- `NEXT_PUBLIC_APP_URL` configured in `.env.local`

## Part 1: Google Cloud Console Setup

### Step 1: Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen first

### Step 2: Configure OAuth Consent Screen

1. Click **Configure Consent Screen**
2. Select **External** user type (or Internal if using Google Workspace)
3. Fill in the required information:
   - **App name:** Sora Vietnam Gateway
   - **User support email:** Your support email
   - **Developer contact information:** Your email
4. Click **Save and Continue**
5. On **Scopes** page, add these scopes:
   - `userinfo.email`
   - `userinfo.profile`
6. Click **Save and Continue**
7. Review and click **Back to Dashboard**

### Step 3: Create OAuth Client ID

1. Go back to **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Select **Web application** as application type
3. Configure the following:
   - **Name:** Sora Vietnam Gateway Web Client
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://your-domain.com
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/auth/callback
     https://your-domain.com/auth/callback
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
4. Click **Create**
5. **IMPORTANT:** Copy the **Client ID** and **Client Secret** - you'll need these next

## Part 2: Supabase Configuration

### Step 1: Enable Google Provider

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list
5. Click to expand Google settings

### Step 2: Configure Google Provider

1. Toggle **Enable Sign in with Google** to ON
2. Paste your Google OAuth credentials:
   - **Client ID:** (from Google Cloud Console)
   - **Client Secret:** (from Google Cloud Console)
3. Click **Save**

### Step 3: Get Supabase Callback URL

1. In the same Google provider settings, you'll see the callback URL:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
2. Copy this URL

### Step 4: Update Google Cloud Console with Supabase Callback

1. Go back to Google Cloud Console
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add the Supabase callback URL if not already added:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
5. Click **Save**

## Part 3: Environment Variables

Add the following to your `.env.local` file:

```bash
# Already configured
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# Your app URL (for OAuth redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# In production: NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Part 4: Testing OAuth Flow

### Local Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login or sign-up page:
   ```
   http://localhost:3000/login
   ```

3. Click the **"Đăng nhập với Google"** button

4. You should be redirected to Google's login page

5. After successful authentication, you should be redirected back to your app

### Expected Flow

1. User clicks "Sign in with Google"
2. App calls `signInWithOAuth('google')`
3. User is redirected to Google's consent screen
4. User approves access
5. Google redirects to Supabase callback URL
6. Supabase processes the OAuth response
7. Supabase redirects to your app's `/auth/callback` route
8. Your callback route processes the session
9. User is redirected to dashboard

## Part 5: Troubleshooting

### Common Issues

#### 1. "redirect_uri_mismatch" Error

**Cause:** The redirect URI in your request doesn't match the one configured in Google Cloud Console.

**Solution:**
- Ensure all redirect URIs are added in Google Cloud Console:
  - Local: `http://localhost:3000/auth/callback`
  - Supabase: `https://your-project-ref.supabase.co/auth/v1/callback`
  - Production: `https://your-domain.com/auth/callback`

#### 2. User Data Not Syncing to Database

**Cause:** The profile creation trigger may not be working or RLS policies are blocking inserts.

**Solution:**
- Check Supabase logs: **Database** → **Logs**
- Verify the trigger exists:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```
- Check RLS policies on `profiles` table

#### 3. Session Not Persisting

**Cause:** Cookie settings or middleware configuration issue.

**Solution:**
- Ensure middleware is properly configured in `src/middleware.ts`
- Check browser console for cookie errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct

#### 4. "Invalid OAuth State" Error

**Cause:** State mismatch between OAuth request and callback.

**Solution:**
- Clear browser cookies
- Ensure your app URL is consistent across environments
- Check that you're not mixing localhost and 127.0.0.1

### Debugging Tools

1. **Supabase Logs:**
   - Go to **Logs** → **Auth Logs** in Supabase Dashboard
   - Filter by timestamp to see recent OAuth attempts

2. **Browser DevTools:**
   - Check **Network** tab for failed requests
   - Look at **Application** → **Cookies** for session cookies

3. **Server Logs:**
   - Check terminal output for server-side errors
   - Look for Supabase client errors

## Part 6: Facebook OAuth (Optional)

To add Facebook login, follow similar steps:

### Facebook Developer Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add **Facebook Login** product
4. Configure OAuth Redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
5. Get your **App ID** and **App Secret**

### Supabase Configuration

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Facebook**
3. Enter your Facebook **App ID** and **App Secret**
4. Save

### Update Code

The code already supports Facebook OAuth:
```typescript
await signInWithOAuth('facebook');
```

## Part 7: Production Deployment Checklist

Before deploying to production:

- [ ] Update all OAuth redirect URIs to use production domain
- [ ] Set `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Verify OAuth consent screen is published (not in testing mode)
- [ ] Test OAuth flow end-to-end in production
- [ ] Set up proper error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure CORS settings if needed
- [ ] Review and test RLS policies
- [ ] Set up rate limiting for OAuth endpoints

## Part 8: Security Best Practices

1. **Never expose secrets:** Client Secret should only be in Supabase, never in frontend code
2. **Use HTTPS in production:** OAuth requires secure connections
3. **Validate redirect URLs:** Always validate where users are redirected after auth
4. **Monitor OAuth logs:** Regularly check Supabase auth logs for suspicious activity
5. **Implement rate limiting:** Prevent OAuth abuse with rate limits
6. **Keep credentials rotated:** Periodically rotate OAuth secrets

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)

---

**Last Updated:** October 9, 2025  
**Tested With:** Supabase v2.38.0, Next.js 15.1.8
