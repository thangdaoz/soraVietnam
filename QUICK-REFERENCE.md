# 📋 Developer Quick Reference

**Project:** Sora Vietnam Gateway  
**Last Updated:** October 7, 2025

---

## 🗄️ Database Quick Reference

### Tables

```sql
-- Core Tables
profiles           → User profiles & credit balance
videos             → Video generation requests & metadata  
transactions       → Financial transaction log (immutable)
credit_packages    → Available credit packages for sale
video_pricing      → Credit costs for video generation
```

### Key Relationships

```
auth.users (1) ──→ (1) profiles
profiles (1) ──→ (N) videos
profiles (1) ──→ (N) transactions
videos (1) ──→ (0..1) transactions
credit_packages (1) ──→ (N) transactions
```

### Important Functions

```sql
-- Credit Operations (atomic)
create_video_request(...)      → Creates video + deducts credits
deduct_credits_for_video(...)  → Deducts credits atomically
add_credits_from_purchase(...) → Adds credits from payment
refund_credits(...)            → Refunds transaction

-- Utilities
user_has_credits(...)          → Check if user can afford action
get_video_pricing(...)         → Get credit cost for video
get_user_stats(...)            → Get user statistics
```

---

## 🌐 API Quick Reference

### Authentication

```typescript
// src/app/actions/auth.ts
signUp(formData)                    → Create new user
signIn(formData)                    → Login user
signOut()                           → Logout user
signInWithOAuth(provider)           → OAuth login (Google/Facebook)
requestPasswordReset(email)         → Send reset email
updatePassword(newPassword)         → Change password
```

### Videos

```typescript
// src/app/actions/videos.ts
createVideoRequest(input)           → Create video generation request
getUserVideos(page, limit)          → Get user's videos (paginated)
getVideoById(videoId)               → Get single video details
deleteVideo(videoId)                → Soft delete video
getVideoDownloadUrl(videoId)        → Get signed download URL
```

### Credits

```typescript
// src/app/actions/credits.ts
getCreditPackages()                 → Get available packages
getUserCreditBalance()              → Get current credit balance
getTransactionHistory(page, limit)  → Get transaction history
getUserStatistics()                 → Get user stats (RPC)
```

### Payments

```typescript
// src/app/actions/payments.ts
createPaymentIntent(packageId)      → Create payment for package
verifyPayment(transactionId)        → Check payment status
```

### Webhooks (API Routes)

```typescript
// src/app/api/webhooks/payment/route.ts
POST → Process payment confirmation from Casso

// src/app/api/webhooks/video/route.ts
POST → Process video generation status from Sora API

// src/app/api/auth/callback/route.ts
GET → Handle OAuth callback
```

---

## 💰 Pricing Quick Reference

### Credit Packages

| Name               | Credits | Price (VND) | Discount |
| ------------------ | ------- | ----------- | -------- |
| Starter            | 50      | 99,000      | 0%       |
| Basic (Popular)    | 200     | 299,000     | 10%      |
| Pro                | 500     | 699,000     | 15%      |
| Business           | 1,200   | 1,499,000   | 20%      |

### Video Pricing

| Type           | Duration | Resolution | Quality  | Credits |
| -------------- | -------- | ---------- | -------- | ------- |
| text_to_video  | 5s       | 1280x720   | standard | 10      |
| text_to_video  | 5s       | 1920x1080  | high     | 15      |
| text_to_video  | 10s      | 1280x720   | standard | 18      |
| text_to_video  | 10s      | 1920x1080  | high     | 25      |
| image_to_video | 5s       | 1280x720   | standard | 15      |
| image_to_video | 5s       | 1920x1080  | high     | 20      |
| image_to_video | 10s      | 1280x720   | standard | 25      |
| image_to_video | 10s      | 1920x1080  | high     | 35      |

**New User Bonus:** 10 free credits on signup

---

## 🔒 Security Checklist

### Before Deploying

- [ ] All RLS policies enabled on tables
- [ ] Service role key is in environment variables (not committed)
- [ ] All server actions validate user authentication
- [ ] Input validation with Zod schemas
- [ ] Webhook signatures verified
- [ ] CORS configured for API routes
- [ ] Rate limiting enabled on sensitive endpoints
- [ ] Error messages don't leak sensitive info
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (sanitize user input)

### RLS Policy Reminders

```sql
-- Users can only see their own data
auth.uid() = user_id

-- Public read access for pricing
active = true

-- Service role only for admin
auth.role() = 'service_role'
```

---

## 🚀 Deployment Checklist

### Supabase Setup

1. **Create Project**
   ```bash
   # Create new project at supabase.com
   # Note: Project URL and anon key
   ```

2. **Run Migrations**
   ```bash
   # In Supabase SQL Editor, run in order:
   supabase/migrations/20251007_initial_schema.sql
   supabase/migrations/20251007_rls_policies.sql
   supabase/migrations/20251007_security_functions.sql
   ```

3. **Configure Auth**
   - Enable Email/Password
   - Enable Google OAuth (optional)
   - Enable Facebook OAuth (optional)
   - Set redirect URLs

4. **Configure Storage**
   - Buckets created automatically in migration
   - Verify policies are active

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Server-side only!
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Payment Gateway (Casso)
CASSO_API_KEY=xxx
CASSO_WEBHOOK_SECRET=xxx

# Video API (Sora or alternative)
SORA_API_KEY=xxx
SORA_WEBHOOK_SECRET=xxx
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add production URLs for webhooks
```

---

## 🧪 Testing Quick Guide

### Test Database Setup

```sql
-- Create test user
insert into auth.users (id, email, encrypted_password) 
values ('test-uuid', 'test@example.com', crypt('password', gen_salt('bf')));

-- Verify profile created automatically
select * from profiles where user_id = 'test-uuid';

-- Check initial credits
select credits from profiles where user_id = 'test-uuid';
-- Should return: 10 (welcome bonus)
```

### Test Server Actions

```typescript
// In a test file or dev page
import { createVideoRequest } from '@/app/actions/videos';

const result = await createVideoRequest({
  prompt: 'A beautiful sunset over the ocean',
  type: 'text_to_video',
  durationSeconds: 5,
  resolution: '1280x720',
  quality: 'standard',
});

console.log(result); // { success: true, videoId: '...' }
```

### Test RLS Policies

```sql
-- Set test user context
select auth.uid(); -- Should return test user ID

-- Try to access own data (should work)
select * from videos where user_id = auth.uid();

-- Try to access other user's data (should return nothing)
select * from videos where user_id = 'other-user-id';
```

---

## 📝 Common Commands

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

### Database

```bash
# Supabase local development
npx supabase init
npx supabase start
npx supabase db reset

# Generate types from database
npx supabase gen types typescript --local > src/types/database.ts
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Insufficient credits" error
```typescript
// Check user credit balance
const { data } = await supabase
  .from('profiles')
  .select('credits')
  .eq('user_id', userId)
  .single();
console.log('Current credits:', data.credits);
```

**Issue:** RLS policy blocking access
```sql
-- Check if RLS is enabled
select schemaname, tablename, rowsecurity 
from pg_tables 
where schemaname = 'public';

-- View policies
select * from pg_policies where schemaname = 'public';

-- Test as service role (bypass RLS)
-- Use service role key in createClient()
```

**Issue:** Server action not working
```typescript
// Ensure 'use server' directive at top
'use server'

// Verify user authentication
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error('Not authenticated');
```

---

## 🔗 Useful Links

### Documentation
- [Database Schema](./docs/database-schema.md)
- [RLS Policies](./docs/database-rls-policies.md)
- [API Endpoints](./docs/api-endpoints.md)
- [Pricing Model](./docs/pricing-model.md)

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

## 💡 Pro Tips

1. **Always use Server Actions** for mutations (create, update, delete)
2. **Use RLS policies** as primary security - don't rely on app logic alone
3. **Use database functions** for atomic operations (credits, payments)
4. **Log all financial transactions** - they're immutable by design
5. **Test RLS policies** before deploying to production
6. **Use Zod** for input validation on all server actions
7. **Revalidate paths** after mutations for fresh data
8. **Never expose service role key** in client code

---

**Quick Start:** See [QUICKSTART.md](./QUICKSTART.md)  
**Full Setup:** See [SETUP.md](./SETUP.md)  
**Questions?** Check [docs/README.md](./docs/README.md)
