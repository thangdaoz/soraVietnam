# Row Level Security (RLS) Policies

**Last Updated:** October 7, 2025  
**Database:** Supabase (PostgreSQL)

## Overview

This document defines all Row Level Security (RLS) policies for the Sora Vietnam Gateway database. RLS ensures that users can only access and modify their own data, providing database-level security.

---

## 🔒 Security Principles

1. **Least Privilege**: Users can only access their own data
2. **Defense in Depth**: Security at database level, not just application level
3. **Explicit Allow**: All access must be explicitly granted via policies
4. **Audit Trail**: All transactions are logged and immutable

---

## 📋 RLS Policies by Table

### 1. `profiles` Table Policies

```sql
-- Enable RLS
alter table public.profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

-- Policy: Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- SECURITY HARDENING: INSERT policy removed
-- Profiles are ONLY created via handle_new_user() trigger
-- This guarantees 100% consistent profile creation with proper initial state

-- Note: Credits should only be updated through transactions
-- Direct credit updates should be restricted to service role
```

**Explanation:**
- Users can only SELECT and UPDATE their own profile
- **INSERT REMOVED**: Profiles are created automatically by `handle_new_user()` trigger
- The `auth.uid()` function returns the authenticated user's ID
- Credits should be modified through transactions, not direct updates

**Why No INSERT Policy?**

The `handle_new_user()` trigger automatically creates a profile when a user signs up:

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, user_id, full_name, credits)
  values (
    new.id,
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    10 -- Give 10 free credits to new users
  );
  return new;
end;
$$ language plpgsql security definer;
```

**Benefits of Removing INSERT Policy:**
1. ✅ **Single Source of Truth**: Only one way to create profiles (via trigger)
2. ✅ **Guaranteed Initial State**: All profiles get 10 free credits
3. ✅ **Consistency**: No way to bypass trigger logic
4. ✅ **Security**: Can't manually set credits or other fields during creation
5. ✅ **Simplicity**: Less code paths = fewer bugs

**What If Client Code Tries to INSERT?**
```typescript
// This will FAIL with "policy violation" error
const { error } = await supabase
  .from('profiles')
  .insert({ 
    id: userId, 
    user_id: userId, 
    credits: 9999  // ❌ Can't bypass trigger!
  });
// Expected: Error - no policy allows INSERT
```

---

### 2. `videos` Table Policies

```sql
-- Enable RLS
alter table public.videos enable row level security;

-- ENHANCED: Automatically hide soft-deleted videos from normal queries
create policy "Users can view own active videos"
  on public.videos for select
  using (
    auth.uid() = user_id 
    and deleted_at is null  -- Soft-deleted videos automatically hidden
  );

-- ENHANCED: Separate policy for viewing deleted videos (restore functionality)
create policy "Users can view own deleted videos"
  on public.videos for select
  using (
    auth.uid() = user_id 
    and deleted_at is not null  -- Only show explicitly deleted videos
  );

-- Policy: Users can insert their own videos
create policy "Users can insert own videos"
  on public.videos for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own videos
create policy "Users can update own videos"
  on public.videos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: Users can soft delete their own videos
create policy "Users can delete own videos"
  on public.videos for delete
  using (auth.uid() = user_id);
```

**Explanation:**
- **ENHANCED**: Two separate SELECT policies for active and deleted videos
- Soft deletes are **transparent**: developers don't need `WHERE deleted_at IS NULL`
- Users can view deleted videos separately for restore functionality
- Performance optimized with partial indexes on `deleted_at IS NULL`
- Video status updates should be validated in application logic

**Soft Delete Strategy Benefits:**
1. **Transparent Filtering**: Deleted videos automatically hidden from normal queries
2. **Easy Restore**: Separate policy allows viewing deleted videos for restore
3. **Audit Trail**: Maintains complete history of video generations
4. **Performance**: Partial indexes dramatically improve query speed

**Example Usage:**
```typescript
// Get active videos (deleted_at automatically filtered by RLS)
const { data: activeVideos } = await supabase
  .from('videos')
  .select('*')
  .order('created_at', { ascending: false });

// Get deleted videos for restore functionality
const { data: deletedVideos } = await supabase
  .from('videos')
  .select('*')
  .not('deleted_at', 'is', null)
  .order('deleted_at', { ascending: false });

// Soft delete (use helper function for safety)
const { data } = await supabase.rpc('soft_delete_video', { 
  p_video_id: videoId 
});

// Restore deleted video
const { data } = await supabase.rpc('restore_video', { 
  p_video_id: videoId 
});
```

---

### 3. `transactions` Table Policies

```sql
-- Enable RLS
alter table public.transactions enable row level security;

-- Policy: Users can view their own transactions
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

-- Policy: Only service role can insert transactions
-- (Transactions should be created through server-side functions)
create policy "Service role can insert transactions"
  on public.transactions for insert
  with check (
    auth.role() = 'service_role' 
    or auth.uid() = user_id -- Allow user inserts from authenticated functions
  );

-- Policy: No user updates or deletes
-- (Transactions are immutable for audit purposes)
-- Only service role can update transaction status
create policy "Service role can update transactions"
  on public.transactions for update
  using (auth.role() = 'service_role');
```

**Explanation:**
- Users can VIEW their transaction history
- Users CANNOT directly INSERT, UPDATE, or DELETE transactions
- Transactions are created through authenticated server actions
- Transactions are immutable for audit trail

---

### 4. `credit_packages` Table Policies

```sql
-- Enable RLS
alter table public.credit_packages enable row level security;

-- Policy: Anyone can view active credit packages (public read)
create policy "Anyone can view active credit packages"
  on public.credit_packages for select
  using (active = true);

-- Policy: Only service role can manage credit packages
create policy "Service role can manage credit packages"
  on public.credit_packages for all
  using (auth.role() = 'service_role');
```

**Explanation:**
- All users (authenticated and anonymous) can VIEW active packages
- Only admins (service role) can CREATE, UPDATE, or DELETE packages
- Inactive packages are hidden from public view

---

### 5. `video_pricing` Table Policies

```sql
-- Enable RLS
alter table public.video_pricing enable row level security;

-- Policy: Anyone can view active video pricing (public read)
create policy "Anyone can view active video pricing"
  on public.video_pricing for select
  using (active = true);

-- Policy: Only service role can manage video pricing
create policy "Service role can manage video pricing"
  on public.video_pricing for all
  using (auth.role() = 'service_role');
```

**Explanation:**
- All users can VIEW active pricing rules
- Only admins can modify pricing
- Pricing is public to show costs before authentication

---

## 🛡️ Advanced Security Functions

### Enhanced: Atomic Video Generation Transaction

```sql
-- ENHANCED: Atomic video generation with guaranteed consistency
-- This function ensures credits are NEVER deducted without creating a video
create or replace function public.create_video_generation(
  p_user_id uuid,
  p_prompt text,
  p_video_type video_type,
  p_image_url text,
  p_duration_seconds integer,
  p_resolution text,
  p_quality text
)
returns jsonb as $$
declare
  v_credits_required integer;
  v_video_id uuid;
  v_current_credits integer;
  v_transaction_id uuid;
begin
  -- STEP 1: Get pricing (fails fast if invalid parameters)
  v_credits_required := public.get_video_pricing(
    p_video_type, p_duration_seconds, p_resolution, p_quality
  );
  
  -- STEP 2: Lock user profile row and check credits atomically
  -- FOR UPDATE prevents race conditions
  select credits into v_current_credits
  from public.profiles
  where user_id = p_user_id
  for update;  -- CRITICAL: Locks row until transaction completes
  
  if v_current_credits < v_credits_required then
    raise exception 'Insufficient credits. You have % credits, but need % credits.',
      v_current_credits, v_credits_required;
  end if;
  
  -- STEP 3: Create video record
  insert into public.videos (user_id, prompt, type, image_url, status, credits_used, duration_seconds, resolution)
  values (p_user_id, p_prompt, p_video_type, p_image_url, 'pending', v_credits_required, p_duration_seconds, p_resolution)
  returning id into v_video_id;
  
  -- STEP 4: Deduct credits and increment counter
  update public.profiles
  set credits = credits - v_credits_required,
      total_videos_generated = total_videos_generated + 1,
      updated_at = now()
  where user_id = p_user_id;
  
  -- STEP 5: Create transaction record (audit trail)
  insert into public.transactions (user_id, type, status, credits, video_id, description, completed_at)
  values (p_user_id, 'video_deduction', 'completed', -v_credits_required, v_video_id, 
    format('Credits deducted for %s video (%ss, %s)', p_video_type, p_duration_seconds, p_resolution), now())
  returning id into v_transaction_id;
  
  -- Return detailed response
  return jsonb_build_object(
    'success', true,
    'video_id', v_video_id,
    'transaction_id', v_transaction_id,
    'credits_used', v_credits_required,
    'credits_remaining', v_current_credits - v_credits_required,
    'message', 'Video generation started successfully'
  );
  
exception
  when others then
    -- Any failure automatically ROLLS BACK all changes
    raise exception 'Video generation failed: %', sqlerrm;
end;
$$ language plpgsql security definer;
```

**Why This Enhancement Matters:**

1. **Atomicity**: All operations succeed together or fail together
   - If video creation fails → credits not deducted
   - If credit deduction fails → video not created
   - If transaction log fails → everything rolled back

2. **Race Condition Protection**: `FOR UPDATE` lock prevents:
   - Double spending: Two concurrent requests can't deduct same credits
   - Negative balance: Lock ensures atomic credit check + deduction
   - Lost updates: Row is locked during entire transaction

3. **Better Error Messages**: Users see exactly what went wrong
   ```json
   {
     "error": "Insufficient credits. You have 5 credits, but need 15 credits."
   }
   ```

4. **Detailed Response**: Frontend gets complete transaction info
   ```json
   {
     "success": true,
     "video_id": "uuid",
     "transaction_id": "uuid",
     "credits_used": 15,
     "credits_remaining": 85,
     "message": "Video generation started successfully"
   }
   ```

**Example Usage:**
```typescript
// Backend API route or Server Action
export async function createVideoGeneration(userId: string, params: VideoParams) {
  const { data, error } = await supabase.rpc('create_video_generation', {
    p_user_id: userId,
    p_prompt: params.prompt,
    p_video_type: params.type,
    p_image_url: params.imageUrl,
    p_duration_seconds: params.duration,
    p_resolution: params.resolution,
    p_quality: params.quality
  });
  
  if (error) {
    // User-friendly error message
    throw new Error(error.message);
  }
  
  return data; // { success: true, video_id: '...', credits_remaining: 85, ... }
}
```

### 1. Check User Has Sufficient Credits

```sql
-- Function to check if user has enough credits for an action
create or replace function public.user_has_credits(user_uuid uuid, required_credits integer)
returns boolean as $$
declare
  user_credits integer;
begin
  select credits into user_credits
  from public.profiles
  where user_id = user_uuid;
  
  return user_credits >= required_credits;
end;
$$ language plpgsql security definer;
```

### 2. Deduct Credits and Create Transaction (Atomic)

```sql
-- Function to safely deduct credits and create transaction record
create or replace function public.deduct_credits_for_video(
  p_user_id uuid,
  p_video_id uuid,
  p_credits integer
)
returns boolean as $$
declare
  current_credits integer;
begin
  -- Lock the user's profile row for update
  select credits into current_credits
  from public.profiles
  where user_id = p_user_id
  for update;
  
  -- Check if user has enough credits
  if current_credits < p_credits then
    raise exception 'Insufficient credits';
  end if;
  
  -- Deduct credits from profile
  update public.profiles
  set credits = credits - p_credits,
      total_videos_generated = total_videos_generated + 1,
      updated_at = now()
  where user_id = p_user_id;
  
  -- Create transaction record
  insert into public.transactions (
    user_id,
    type,
    status,
    credits,
    video_id,
    description,
    completed_at
  ) values (
    p_user_id,
    'video_deduction',
    'completed',
    -p_credits,
    p_video_id,
    'Credits deducted for video generation',
    now()
  );
  
  return true;
exception
  when others then
    -- Rollback happens automatically
    raise;
end;
$$ language plpgsql security definer;
```

### 3. Add Credits from Purchase (Atomic)

```sql
-- Function to add credits after successful payment
create or replace function public.add_credits_from_purchase(
  p_user_id uuid,
  p_credits integer,
  p_amount_vnd numeric,
  p_payment_id text,
  p_payment_method text,
  p_credit_package_id uuid
)
returns uuid as $$
declare
  transaction_id uuid;
begin
  -- Add credits to profile
  update public.profiles
  set credits = credits + p_credits,
      updated_at = now()
  where user_id = p_user_id;
  
  -- Create transaction record
  insert into public.transactions (
    user_id,
    type,
    status,
    amount_vnd,
    credits,
    payment_method,
    payment_id,
    credit_package_id,
    description,
    completed_at
  ) values (
    p_user_id,
    'purchase',
    'completed',
    p_amount_vnd,
    p_credits,
    p_payment_method::payment_method,
    p_payment_id,
    p_credit_package_id,
    'Credits purchased',
    now()
  )
  returning id into transaction_id;
  
  return transaction_id;
exception
  when others then
    raise;
end;
$$ language plpgsql security definer;
```

### 4. Refund Credits (Atomic)

```sql
-- Function to refund credits and update transaction
create or replace function public.refund_credits(
  p_original_transaction_id uuid,
  p_refund_reason text
)
returns uuid as $$
declare
  original_tx record;
  refund_transaction_id uuid;
begin
  -- Get original transaction details
  select * into original_tx
  from public.transactions
  where id = p_original_transaction_id
    and type = 'purchase'
    and status = 'completed';
  
  if not found then
    raise exception 'Original transaction not found or not eligible for refund';
  end if;
  
  -- Deduct refunded credits from profile
  update public.profiles
  set credits = credits - original_tx.credits,
      updated_at = now()
  where user_id = original_tx.user_id;
  
  -- Create refund transaction
  insert into public.transactions (
    user_id,
    type,
    status,
    amount_vnd,
    credits,
    payment_method,
    payment_id,
    description,
    completed_at
  ) values (
    original_tx.user_id,
    'refund',
    'completed',
    -original_tx.amount_vnd,
    -original_tx.credits,
    original_tx.payment_method,
    original_tx.payment_id,
    'Refund: ' || p_refund_reason,
    now()
  )
  returning id into refund_transaction_id;
  
  return refund_transaction_id;
exception
  when others then
    raise;
end;
$$ language plpgsql security definer;
```

---

## 🧪 Testing RLS Policies

### Test Setup

```sql
-- Create test users (run as service role)
insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000001', 'user1@test.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'user2@test.com', crypt('password123', gen_salt('bf')), now(), now(), now());
```

### Test Profiles Access

```sql
-- Login as user1 (set auth.uid() = '00000000-0000-0000-0000-000000000001')

-- Should return user1's profile only
select * from public.profiles;

-- Should fail: Cannot view other user's profile
select * from public.profiles where user_id = '00000000-0000-0000-0000-000000000002';
```

### Test Videos Access

```sql
-- Login as user1

-- Should return only user1's videos
select * from public.videos;

-- Should succeed: Can create own video
insert into public.videos (user_id, prompt, type, credits_used)
values (auth.uid(), 'Test prompt', 'text_to_video', 10);

-- Should fail: Cannot create video for another user
insert into public.videos (user_id, prompt, type, credits_used)
values ('00000000-0000-0000-0000-000000000002', 'Test', 'text_to_video', 10);
```

### Test Transactions Access

```sql
-- Login as user1

-- Should return only user1's transactions
select * from public.transactions;

-- Should fail: Cannot directly insert transaction
insert into public.transactions (user_id, type, status, credits)
values (auth.uid(), 'purchase', 'completed', 100);
-- (Must use server function instead)
```

### Test Public Access

```sql
-- No authentication required

-- Should succeed: Can view active credit packages
select * from public.credit_packages where active = true;

-- Should succeed: Can view active video pricing
select * from public.video_pricing where active = true;
```

---

## 🔐 Security Best Practices

### 1. Never Trust Client Input

```typescript
// ❌ BAD: Direct database update from client
const { error } = await supabase
  .from('profiles')
  .update({ credits: 9999 }) // User could modify this!
  .eq('user_id', userId);

// ✅ GOOD: Use authenticated server function
const { data, error } = await supabase
  .rpc('add_credits_from_purchase', {
    p_user_id: userId,
    p_credits: 100,
    p_amount_vnd: 299000,
    p_payment_id: paymentId,
    p_payment_method: 'bank_transfer',
    p_credit_package_id: packageId
  });
```

### 2. Use Service Role Sparingly

```typescript
// ❌ BAD: Exposing service role key in client code
// NEVER DO THIS!

// ✅ GOOD: Use service role only in API routes/server actions
// app/api/admin/update-pricing/route.ts
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-side only
);
```

### 3. Validate All Inputs

```typescript
// ✅ GOOD: Validate before database operations
export async function deductCreditsForVideo(
  userId: string,
  videoId: string,
  creditsRequired: number
) {
  // Validate inputs
  if (creditsRequired <= 0) {
    throw new Error('Credits must be positive');
  }
  
  // Use stored procedure for atomic operation
  const { data, error } = await supabase
    .rpc('deduct_credits_for_video', {
      p_user_id: userId,
      p_video_id: videoId,
      p_credits: creditsRequired
    });
    
  if (error) throw error;
  return data;
}
```

### 4. Explicit Function Permissions (Defense in Depth)

**Problem:** By default, PostgreSQL grants EXECUTE on functions to PUBLIC.

**Solution:** Explicitly REVOKE from PUBLIC, then GRANT only to necessary roles.

```sql
-- ❌ BAD: Relying on default permissions
CREATE FUNCTION public.my_function() ...;
-- PUBLIC can execute by default!

-- ✅ GOOD: Explicit permission control
CREATE FUNCTION public.my_function() ...;

-- Remove default PUBLIC access
REVOKE EXECUTE ON FUNCTION public.my_function FROM PUBLIC;

-- Grant only to authenticated users
GRANT EXECUTE ON FUNCTION public.my_function TO authenticated;
```

**Benefits:**
- ✅ **Least Privilege**: Only necessary roles can execute
- ✅ **Resource Protection**: Prevents anonymous users from wasting compute
- ✅ **Defense in Depth**: Extra security layer beyond auth checks
- ✅ **Clear Intent**: Explicitly documents who can call functions

**Example: Our Implementation**

```sql
-- All protected functions follow this pattern:
REVOKE EXECUTE ON FUNCTION public.create_video_generation FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_video_generation TO authenticated;

REVOKE EXECUTE ON FUNCTION public.soft_delete_video FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.soft_delete_video TO authenticated;

-- Public pricing function (intentionally accessible to anonymous users)
REVOKE EXECUTE ON FUNCTION public.get_video_pricing FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_video_pricing TO authenticated, anon;
```

**Why This Matters:**

```typescript
// WITHOUT explicit REVOKE (BAD):
// Anonymous user can waste resources calling function
const supabaseAnon = createClient(url, anonKey); // No auth
await supabaseAnon.rpc('create_video_generation', { ... });
// ^ Function is called, uses CPU, then fails auth check

// WITH explicit REVOKE (GOOD):
// Anonymous user gets immediate permission denied
const supabaseAnon = createClient(url, anonKey); // No auth
await supabaseAnon.rpc('create_video_generation', { ... });
// ^ ERROR: permission denied for function (immediate, no resource waste)
```

### 5. Profile Creation Security

**Problem:** Allowing user-initiated profile INSERTs creates two creation paths.

**Solution:** Remove INSERT policy; profiles created ONLY via trigger.

```sql
-- ❌ BAD: Multiple creation paths
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
-- Problem: Users could bypass trigger logic!

-- ✅ GOOD: Single creation path via trigger only
-- No INSERT policy = profiles ONLY created by handle_new_user() trigger
-- Guarantees: All profiles get 10 free credits, consistent initial state
```

**Trigger that creates profiles:**

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

**Benefits:**
- ✅ **100% Consistent**: Every profile has same initial state
- ✅ **No Bypass**: Can't skip trigger logic to set custom credits
- ✅ **Single Source of Truth**: One creation method only
- ✅ **Guaranteed Free Credits**: All users get 10 credits on signup

### 4. Audit Critical Operations

```sql
-- Create audit log table
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default now()
);

-- Create audit trigger function
create or replace function public.audit_trigger()
returns trigger as $$
begin
  insert into public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data
  ) values (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    coalesce(NEW.id, OLD.id),
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  return NEW;
end;
$$ language plpgsql security definer;

-- Apply audit trigger to critical tables
create trigger audit_transactions
  after insert or update or delete on public.transactions
  for each row execute procedure public.audit_trigger();

create trigger audit_profiles_credits
  after update on public.profiles
  for each row
  when (OLD.credits is distinct from NEW.credits)
  execute procedure public.audit_trigger();
```

---

## 📊 Monitoring & Alerts

### 1. Credit Balance Anomalies

```sql
-- Query to detect suspicious credit increases
select
  p.user_id,
  p.full_name,
  p.credits,
  sum(t.credits) as total_credit_changes,
  count(*) as transaction_count
from public.profiles p
join public.transactions t on t.user_id = p.user_id
where t.created_at > now() - interval '1 hour'
  and t.type = 'purchase'
group by p.user_id, p.full_name, p.credits
having sum(t.credits) > 1000; -- Alert if >1000 credits added in 1 hour
```

### 2. Failed Transaction Patterns

```sql
-- Query to detect repeated failed transactions
select
  user_id,
  count(*) as failed_attempts,
  max(created_at) as last_attempt
from public.transactions
where status = 'failed'
  and created_at > now() - interval '1 day'
group by user_id
having count(*) > 5; -- Alert if >5 failures in 24 hours
```

---

## 🚀 Deployment Checklist

- [ ] All RLS policies created and tested
- [ ] Helper functions deployed with `security definer`
- [ ] Service role key stored securely (environment variables only)
- [ ] Audit logging enabled for critical tables
- [ ] Monitoring queries set up
- [ ] Test suite for RLS policies passing
- [ ] Documentation reviewed by security team

---

**Next Steps:**
1. Review RLS policies with team
2. Set up automated testing for RLS
3. Deploy to Supabase development environment
4. Conduct security penetration testing
5. Deploy to production

