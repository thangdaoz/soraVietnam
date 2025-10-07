-- Migration: Initial Schema Setup
-- Description: Creates all tables, enums, indexes, and helper functions
-- Created: 2025-10-07
-- Version: 1.0.0

-- ============================================================================
-- ENUMS
-- ============================================================================

create type video_type as enum ('text_to_video', 'image_to_video');
create type video_status as enum ('pending', 'processing', 'completed', 'failed', 'deleted');
create type transaction_type as enum ('purchase', 'video_deduction', 'refund', 'bonus');
create type transaction_status as enum ('pending', 'completed', 'failed', 'cancelled');
create type payment_method as enum ('bank_transfer', 'momo', 'zalopay', 'card');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- TABLES
-- ============================================================================

-- -----------------------------------------------------------------------------
-- Table: profiles
-- Description: User profile information and credit balance
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  full_name text,
  avatar_url text,
  credits integer not null default 0,
  total_videos_generated integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint profiles_credits_check check (credits >= 0)
);

-- Index for faster lookups
create index profiles_user_id_idx on public.profiles(user_id);

-- Trigger to update updated_at timestamp
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- Table: credit_packages
-- Description: Available credit packages for purchase
-- -----------------------------------------------------------------------------
create table public.credit_packages (
  id uuid default gen_random_uuid() primary key,
  
  -- Package details
  name text not null,
  name_en text not null,
  description text,
  
  -- Pricing
  credits integer not null,
  price_vnd numeric(15, 2) not null,
  discount_percentage integer default 0,
  
  -- Package metadata
  is_popular boolean default false,
  display_order integer default 0,
  active boolean default true,
  
  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint credit_packages_credits_check check (credits > 0),
  constraint credit_packages_price_check check (price_vnd > 0),
  constraint credit_packages_discount_check check (discount_percentage >= 0 and discount_percentage <= 100)
);

-- Index for active packages
create index credit_packages_active_idx on public.credit_packages(active, display_order);

-- Trigger to update updated_at timestamp
create trigger handle_updated_at before update on public.credit_packages
  for each row execute procedure public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- Table: video_pricing
-- Description: Credit costs for different video types and parameters
-- -----------------------------------------------------------------------------
create table public.video_pricing (
  id uuid default gen_random_uuid() primary key,
  
  -- Video specifications
  video_type video_type not null,
  duration_seconds integer not null,
  resolution text not null,
  quality text not null,
  
  -- Pricing
  credits_cost integer not null,
  
  -- Metadata
  description text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint video_pricing_credits_check check (credits_cost > 0),
  constraint video_pricing_duration_check check (duration_seconds > 0)
);

-- Index for lookups
create index video_pricing_lookup_idx on public.video_pricing(video_type, duration_seconds, resolution, quality) where active = true;

-- Trigger to update updated_at timestamp
create trigger handle_updated_at before update on public.video_pricing
  for each row execute procedure public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- Table: videos
-- Description: Video generation requests and metadata
-- -----------------------------------------------------------------------------
create table public.videos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(user_id) on delete cascade not null,
  
  -- Video generation details
  prompt text not null,
  type video_type not null,
  image_url text,
  
  -- Generation status
  status video_status not null default 'pending',
  progress_percentage integer default 0,
  error_message text,
  
  -- Video output
  video_url text,
  thumbnail_url text,
  duration_seconds integer,
  resolution text,
  file_size_mb numeric(10, 2),
  
  -- Credits and costs
  credits_used integer not null,
  
  -- Third-party API details
  external_job_id text,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  deleted_at timestamp with time zone,
  
  constraint videos_progress_check check (progress_percentage >= 0 and progress_percentage <= 100),
  constraint videos_credits_check check (credits_used > 0)
);

-- Indexes for performance
create index videos_user_id_idx on public.videos(user_id);
create index videos_status_idx on public.videos(status);
create index videos_created_at_idx on public.videos(created_at desc);
create index videos_external_job_id_idx on public.videos(external_job_id);

-- -----------------------------------------------------------------------------
-- Table: transactions
-- Description: Credit purchases, deductions, and refunds
-- -----------------------------------------------------------------------------
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(user_id) on delete cascade not null,
  
  -- Transaction details
  type transaction_type not null,
  status transaction_status not null default 'pending',
  
  -- Financial details
  amount_vnd numeric(15, 2),
  credits integer not null,
  
  -- Payment details
  payment_method payment_method,
  payment_id text,
  payment_metadata jsonb,
  
  -- Related entities
  video_id uuid references public.videos(id) on delete set null,
  credit_package_id uuid references public.credit_packages(id) on delete set null,
  
  -- Metadata
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  
  constraint transactions_credits_check check (credits != 0)
);

-- Indexes for performance
create index transactions_user_id_idx on public.transactions(user_id);
create index transactions_status_idx on public.transactions(status);
create index transactions_type_idx on public.transactions(type);
create index transactions_payment_id_idx on public.transactions(payment_id);
create index transactions_created_at_idx on public.transactions(created_at desc);

-- ============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================

-- Function to automatically create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, user_id, full_name, credits)
  values (
    new.id,
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    0 -- Start with 0 credits (v2.0: users purchase credits, no free bonus for now)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create storage buckets for videos, images, and avatars
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('videos', 'videos', true, 524288000, array['video/mp4', 'video/webm', 'video/quicktime']), -- 500MB limit
  ('images', 'images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']), -- 10MB limit
  ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']); -- 2MB limit

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert credit packages
insert into public.credit_packages (name, name_en, description, credits, price_vnd, discount_percentage, is_popular, display_order) values
  ('Gói Dùng Thử', 'Starter Pack', 'Hoàn hảo để bắt đầu trải nghiệm', 99000, 99000, 0, false, 1),
  ('Gói Cơ Bản', 'Basic Pack', 'Phù hợp cho người dùng thường xuyên', 299000, 299000, 0, true, 2),
  ('Gói Chuyên Nghiệp', 'Pro Pack', 'Dành cho nhà sáng tạo nội dung', 699000, 699000, 0, false, 3),
  ('Gói Doanh Nghiệp', 'Business Pack', 'Giải pháp tốt nhất cho doanh nghiệp', 1499000, 1499000, 0, false, 4);

-- Insert video pricing
insert into public.video_pricing (video_type, duration_seconds, resolution, quality, credits_cost, description) values
  ('text_to_video', 5, '1280x720', 'standard', 20000, '5 giây, HD, chất lượng tiêu chuẩn'),
  ('text_to_video', 5, '1920x1080', 'high', 30000, '5 giây, Full HD, chất lượng cao'),
  ('text_to_video', 10, '1280x720', 'standard', 36000, '10 giây, HD, chất lượng tiêu chuẩn'),
  ('text_to_video', 10, '1920x1080', 'high', 50000, '10 giây, Full HD, chất lượng cao'),
  ('image_to_video', 5, '1280x720', 'standard', 30000, '5 giây từ ảnh, HD, chất lượng tiêu chuẩn'),
  ('image_to_video', 5, '1920x1080', 'high', 40000, '5 giây từ ảnh, Full HD, chất lượng cao'),
  ('image_to_video', 10, '1280x720', 'standard', 50000, '10 giây từ ảnh, HD, chất lượng tiêu chuẩn'),
  ('image_to_video', 10, '1920x1080', 'high', 70000, '10 giây từ ảnh, Full HD, chất lượng cao');
