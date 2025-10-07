-- Migration: Row Level Security Policies
-- Description: Sets up RLS policies for all tables
-- Created: 2025-10-07
-- Version: 1.0.0
-- Depends on: 20251007_initial_schema.sql

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

alter table public.profiles enable row level security;

-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- ============================================================================
-- VIDEOS TABLE POLICIES
-- ============================================================================

alter table public.videos enable row level security;

-- Users can view their own videos
create policy "Users can view own videos"
  on public.videos for select
  using (auth.uid() = user_id);

-- Users can insert their own videos
create policy "Users can insert own videos"
  on public.videos for insert
  with check (auth.uid() = user_id);

-- Users can update their own videos
create policy "Users can update own videos"
  on public.videos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own videos
create policy "Users can delete own videos"
  on public.videos for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- TRANSACTIONS TABLE POLICIES
-- ============================================================================

alter table public.transactions enable row level security;

-- Users can view their own transactions
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

-- Users can insert transactions (through authenticated functions)
create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- Only service role can update transactions
create policy "Service role can update transactions"
  on public.transactions for update
  using (auth.role() = 'service_role');

-- ============================================================================
-- CREDIT PACKAGES TABLE POLICIES
-- ============================================================================

alter table public.credit_packages enable row level security;

-- Anyone can view active credit packages
create policy "Anyone can view active credit packages"
  on public.credit_packages for select
  using (active = true);

-- Only service role can manage credit packages
create policy "Service role can manage credit packages"
  on public.credit_packages for all
  using (auth.role() = 'service_role');

-- ============================================================================
-- VIDEO PRICING TABLE POLICIES
-- ============================================================================

alter table public.video_pricing enable row level security;

-- Anyone can view active video pricing
create policy "Anyone can view active video pricing"
  on public.video_pricing for select
  using (active = true);

-- Only service role can manage video pricing
create policy "Service role can manage video pricing"
  on public.video_pricing for all
  using (auth.role() = 'service_role');

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Videos bucket policies
create policy "Users can upload own videos"
  on storage.objects for insert
  with check (
    bucket_id = 'videos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view own videos"
  on storage.objects for select
  using (
    bucket_id = 'videos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view public videos"
  on storage.objects for select
  using (bucket_id = 'videos');

-- Images bucket policies
create policy "Users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view own images"
  on storage.objects for select
  using (
    bucket_id = 'images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Avatars bucket policies
create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');
