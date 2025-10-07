-- Migration: Security Functions
-- Description: Helper functions for credit management and security
-- Created: 2025-10-07
-- Version: 1.0.0
-- Depends on: 20251007_initial_schema.sql, 20251007_rls_policies.sql

-- ============================================================================
-- CREDIT MANAGEMENT FUNCTIONS
-- ============================================================================

-- Function to check if user has enough credits
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

-- Function to deduct credits for video generation (atomic operation)
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
    raise;
end;
$$ language plpgsql security definer;

-- Function to add credits from purchase (atomic operation)
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

-- Function to refund credits (atomic operation)
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

-- Function to get video pricing
create or replace function public.get_video_pricing(
  p_video_type video_type,
  p_duration_seconds integer,
  p_resolution text,
  p_quality text
)
returns integer as $$
declare
  pricing_credits integer;
begin
  select credits_cost into pricing_credits
  from public.video_pricing
  where video_type = p_video_type
    and duration_seconds = p_duration_seconds
    and resolution = p_resolution
    and quality = p_quality
    and active = true
  limit 1;
  
  if pricing_credits is null then
    raise exception 'Pricing not found for specified parameters';
  end if;
  
  return pricing_credits;
end;
$$ language plpgsql security definer;

-- Function to create video request (with credit check)
create or replace function public.create_video_request(
  p_user_id uuid,
  p_prompt text,
  p_video_type video_type,
  p_image_url text,
  p_duration_seconds integer,
  p_resolution text,
  p_quality text
)
returns uuid as $$
declare
  v_credits_required integer;
  v_video_id uuid;
begin
  -- Get pricing
  v_credits_required := public.get_video_pricing(
    p_video_type,
    p_duration_seconds,
    p_resolution,
    p_quality
  );
  
  -- Check if user has enough credits
  if not public.user_has_credits(p_user_id, v_credits_required) then
    raise exception 'Insufficient credits';
  end if;
  
  -- Create video record
  insert into public.videos (
    user_id,
    prompt,
    type,
    image_url,
    status,
    credits_used,
    duration_seconds,
    resolution
  ) values (
    p_user_id,
    p_prompt,
    p_video_type,
    p_image_url,
    'pending',
    v_credits_required,
    p_duration_seconds,
    p_resolution
  )
  returning id into v_video_id;
  
  -- Deduct credits
  perform public.deduct_credits_for_video(p_user_id, v_video_id, v_credits_required);
  
  return v_video_id;
exception
  when others then
    raise;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to get user statistics
create or replace function public.get_user_stats(p_user_id uuid)
returns jsonb as $$
declare
  stats jsonb;
begin
  select jsonb_build_object(
    'total_credits', p.credits,
    'total_videos_generated', p.total_videos_generated,
    'videos_pending', count(*) filter (where v.status = 'pending'),
    'videos_processing', count(*) filter (where v.status = 'processing'),
    'videos_completed', count(*) filter (where v.status = 'completed'),
    'videos_failed', count(*) filter (where v.status = 'failed'),
    'total_spent_vnd', coalesce(sum(t.amount_vnd) filter (where t.type = 'purchase'), 0),
    'total_credits_purchased', coalesce(sum(t.credits) filter (where t.type = 'purchase'), 0),
    'total_credits_used', coalesce(abs(sum(t.credits)) filter (where t.type = 'video_deduction'), 0)
  ) into stats
  from public.profiles p
  left join public.videos v on v.user_id = p.user_id
  left join public.transactions t on t.user_id = p.user_id
  where p.user_id = p_user_id
  group by p.credits, p.total_videos_generated;
  
  return stats;
end;
$$ language plpgsql security definer;

-- Grant execute permissions
grant execute on function public.user_has_credits to authenticated;
grant execute on function public.deduct_credits_for_video to authenticated;
grant execute on function public.add_credits_from_purchase to authenticated;
grant execute on function public.refund_credits to authenticated;
grant execute on function public.get_video_pricing to authenticated, anon;
grant execute on function public.create_video_request to authenticated;
grant execute on function public.get_user_stats to authenticated;
