-- Migration: Security Hardening
-- Description: Implements defense-in-depth security improvements
-- Created: 2025-10-07
-- Version: 1.2.0
-- Depends on: 20251007_enhanced_security.sql

-- ============================================================================
-- SECURITY IMPROVEMENT 1: REMOVE PROFILES INSERT POLICY
-- ============================================================================

-- RATIONALE:
-- We have a handle_new_user() trigger that automatically creates profiles
-- when users sign up. Allowing user-initiated INSERTs creates two paths
-- for profile creation, which could lead to inconsistent state.
--
-- By removing this policy, we guarantee:
-- 1. 100% of profiles are created via trigger (consistent)
-- 2. All profiles get proper initial state (10 free credits)
-- 3. No way to bypass trigger logic
-- 4. Single source of truth for profile creation

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Profiles are now ONLY created via handle_new_user() trigger
-- This is triggered automatically when a user signs up via auth.users

COMMENT ON TABLE public.profiles IS 
'User profiles are automatically created by handle_new_user() trigger. 
Direct INSERT is not allowed to ensure consistent initial state.';

-- ============================================================================
-- SECURITY IMPROVEMENT 2: EXPLICIT FUNCTION PERMISSIONS
-- ============================================================================

-- RATIONALE:
-- PostgreSQL grants EXECUTE on functions to PUBLIC by default.
-- Following the Principle of Least Privilege, we should:
-- 1. Explicitly REVOKE from PUBLIC
-- 2. Grant only to roles that need access
--
-- This prevents anonymous users from wasting resources calling functions
-- that would fail anyway due to auth checks.

-- ----------------------------------------------------------------------------
-- Functions that should ONLY be callable by authenticated users
-- ----------------------------------------------------------------------------

-- Revoke default PUBLIC access
-- Use DO block to handle functions that might not exist
DO $$ 
BEGIN
  -- Only revoke if function exists
  EXECUTE 'REVOKE EXECUTE ON FUNCTION public.user_has_credits FROM PUBLIC' 
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'user_has_credits');
  EXECUTE 'REVOKE EXECUTE ON FUNCTION public.deduct_credits_for_video FROM PUBLIC'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'deduct_credits_for_video');
  EXECUTE 'REVOKE EXECUTE ON FUNCTION public.add_credits_from_purchase FROM PUBLIC'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'add_credits_from_purchase');
  EXECUTE 'REVOKE EXECUTE ON FUNCTION public.refund_credits FROM PUBLIC'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'refund_credits');
  EXECUTE 'REVOKE EXECUTE ON FUNCTION public.create_video_generation FROM PUBLIC'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_video_generation');
  EXECUTE 'REVOKE EXECUTE ON FUNCTION public.get_user_stats FROM PUBLIC'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_user_stats');
  EXECUTE 'REVOKE EXECUTE ON FUNCTION public.soft_delete_video FROM PUBLIC'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'soft_delete_video');
  EXECUTE 'REVOKE EXECUTE ON FUNCTION public.restore_video FROM PUBLIC'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'restore_video');
  EXECUTE 'REVOKE EXECUTE ON FUNCTION public.refund_video_credits FROM PUBLIC'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'refund_video_credits');
  EXECUTE 'REVOKE EXECUTE ON FUNCTION public.get_credit_info FROM PUBLIC'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_credit_info');
END $$;

-- Grant ONLY to authenticated users
-- Use DO block to handle functions that might not exist
DO $$
BEGIN
  -- Only grant if function exists
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.user_has_credits TO authenticated'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'user_has_credits');
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.deduct_credits_for_video TO authenticated'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'deduct_credits_for_video');
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.add_credits_from_purchase TO authenticated'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'add_credits_from_purchase');
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.refund_credits TO authenticated'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'refund_credits');
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.create_video_generation TO authenticated'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_video_generation');
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_user_stats TO authenticated'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_user_stats');
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.soft_delete_video TO authenticated'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'soft_delete_video');
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.restore_video TO authenticated'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'restore_video');
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.refund_video_credits TO authenticated'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'refund_video_credits');
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_credit_info TO authenticated'
    WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_credit_info');
END $$;

-- ----------------------------------------------------------------------------
-- Functions that can be called by BOTH authenticated AND anonymous users
-- ----------------------------------------------------------------------------

-- get_video_pricing should be callable by anonymous users
-- (So they can see prices before signing up)
DO $$
BEGIN
  -- Only revoke/grant if function exists
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_video_pricing') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.get_video_pricing FROM PUBLIC';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_video_pricing TO authenticated, anon';
  END IF;
END $$;

-- Add comment separately (outside DO block to avoid delimiter conflicts)
COMMENT ON FUNCTION public.get_video_pricing IS 
'Publicly accessible function to retrieve video pricing. 
Allows anonymous users to see prices before signup.';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

/*
-- 1. Verify profiles INSERT policy is removed
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles' 
  AND cmd = 'INSERT';
-- Expected: No results (or only service_role policies)

-- 2. Verify function permissions
SELECT 
  p.proname AS function_name,
  pg_catalog.pg_get_userbyid(p.proowner) AS owner,
  array_agg(a.rolname) AS granted_to
FROM pg_proc p
LEFT JOIN pg_namespace n ON n.oid = p.pronamespace
LEFT JOIN pg_auth_members m ON m.member = p.proowner
LEFT JOIN pg_authid a ON a.oid = m.roleid OR a.oid = p.proowner
WHERE n.nspname = 'public'
  AND p.proname IN (
    'create_video_generation',
    'deduct_credits_for_video',
    'get_video_pricing',
    'soft_delete_video'
  )
GROUP BY p.proname, p.proowner
ORDER BY p.proname;

-- 3. Test profile creation (should fail for users)
-- Login as authenticated user
INSERT INTO public.profiles (id, user_id, full_name, credits)
VALUES (auth.uid(), auth.uid(), 'Test User', 100);
-- Expected: ERROR - No INSERT policy allows this action

-- 4. Test function call as anonymous user (should fail)
-- As anonymous user
SELECT public.create_video_generation(...);
-- Expected: ERROR - permission denied for function

-- 5. Test function call as authenticated user (should work)
-- As authenticated user
SELECT public.get_video_pricing('text_to_video', 5, '1920x1080', 'high');
-- Expected: Returns credits cost
*/

-- ============================================================================
-- SECURITY AUDIT CHECKLIST
-- ============================================================================

/*
DEFENSE-IN-DEPTH SECURITY LAYERS:

Layer 1: Network Security
✅ Supabase provides SSL/TLS encryption
✅ API keys and JWT tokens for authentication

Layer 2: Row Level Security (RLS)
✅ All tables have RLS enabled
✅ Users can only access their own data
✅ Service role bypasses RLS for admin operations

Layer 3: Function Security
✅ Functions use SECURITY DEFINER (elevated privileges)
✅ Explicit REVOKE from PUBLIC (this migration)
✅ GRANT only to necessary roles (authenticated, anon)
✅ Functions validate auth.uid() internally

Layer 4: Application Logic
✅ Atomic transactions prevent partial updates
✅ FOR UPDATE locking prevents race conditions
✅ CHECK constraints enforce data integrity
✅ Triggers ensure consistent state

Layer 5: Audit & Monitoring
✅ All transactions logged
✅ Timestamps on all records
✅ Soft delete preserves history
✅ Transaction records immutable

COMPLIANCE CHECKLIST:
✅ Least Privilege Principle - Users have minimal necessary permissions
✅ Defense in Depth - Multiple security layers
✅ Separation of Duties - Triggers handle profile creation, not users
✅ Audit Trail - Complete transaction history
✅ Data Integrity - Constraints prevent corruption
✅ Fail-Safe Defaults - Deny by default, allow explicitly
*/

-- ============================================================================
-- DEPLOYMENT NOTES
-- ============================================================================

/*
BEFORE DEPLOYMENT:
1. Backup production database
2. Test in development environment first
3. Verify all existing users have profiles
4. Ensure handle_new_user() trigger is working

AFTER DEPLOYMENT:
1. Monitor auth.users table for new signups
2. Verify profiles are auto-created
3. Check that no INSERT errors occur
4. Validate function permissions work correctly

ROLLBACK PLAN:
If issues occur, restore the INSERT policy:
```sql
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

However, this should NOT be necessary if:
- handle_new_user() trigger is properly configured
- Trigger is on auth.users AFTER INSERT
- Trigger successfully creates profiles
*/

-- ============================================================================
-- FINAL SECURITY POSTURE
-- ============================================================================

/*
After this migration:

PROFILES TABLE:
❌ Users CANNOT insert their own profiles
✅ Profiles auto-created by trigger only
✅ Users CAN view their own profile
✅ Users CAN update their own profile
❌ Users CANNOT update credits directly
✅ Credits updated via secure functions only

FUNCTIONS:
❌ Anonymous users CANNOT call protected functions
✅ Authenticated users CAN call necessary functions
✅ Anonymous users CAN call get_video_pricing (intentional)
✅ All functions use SECURITY DEFINER for elevated privileges
✅ All functions validate auth.uid() internally

RESULT:
🔒 Maximum security with least privilege
🔒 Single source of truth for profile creation
🔒 No resource waste from anonymous function calls
🔒 Clear and explicit permission model
*/

-- Migration complete
SELECT 'Security hardening migration completed successfully' AS status;
