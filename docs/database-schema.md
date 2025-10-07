# Database Schema - Sora Vietnam Gateway

**Last Updated:** October 7, 2025  
**Database:** Supabase (PostgreSQL)

## Overview

This document defines the complete database schema for the Sora Vietnam Gateway application. The schema is designed to support user authentication, video generation tracking, credit management, and payment processing.

---

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
│  - id (uuid)    │
│  - email        │
│  - created_at   │
└────────┬────────┘
         │
         │ 1:1
         │
┌────────▼────────┐       ┌──────────────────┐
│    profiles     │       │   credit_packages│
│  - id (uuid)    │       │  - id (uuid)     │
│  - user_id      │       │  - name          │
│  - full_name    │       │  - credits       │
│  - avatar_url   │       │  - price_vnd     │
│  - credits      │◄──┐   │  - active        │
└────────┬────────┘   │   └──────────────────┘
         │            │
         │ 1:N        │
         │            │
┌────────▼────────┐   │   ┌──────────────────┐
│     videos      │   │   │  transactions    │
│  - id (uuid)    │   │   │  - id (uuid)     │
│  - user_id      │   └───┤  - user_id       │
│  - prompt       │       │  - amount        │
│  - type         │       │  - credits       │
│  - status       │       │  - type          │
│  - video_url    │       │  - status        │
│  - credits_used │       │  - payment_id    │
└─────────────────┘       └──────────────────┘
```

---

## 📋 Table Definitions

### 1. `profiles` Table

Stores user profile information and credit balance. Extends Supabase's `auth.users` table.

```sql
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

-- Create index for faster lookups
create index profiles_user_id_idx on public.profiles(user_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Trigger to update updated_at timestamp
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();
```

**Fields:**
- `id` (uuid, PK): Primary key, matches auth.users.id
- `user_id` (uuid, FK): Reference to auth.users (redundant for easier queries)
- `full_name` (text): User's display name
- `avatar_url` (text): Profile picture URL (stored in Supabase Storage)
- `credits` (integer): Current credit balance (cannot be negative)
- `total_videos_generated` (integer): Lifetime video count
- `created_at` (timestamp): Account creation timestamp
- `updated_at` (timestamp): Last profile update timestamp

---

### 2. `videos` Table

Stores all video generation requests and their metadata.

```sql
create type video_type as enum ('text_to_video', 'image_to_video');
create type video_status as enum ('pending', 'processing', 'completed', 'failed', 'deleted');

create table public.videos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(user_id) on delete cascade not null,
  
  -- Video generation details
  prompt text not null,
  type video_type not null,
  image_url text, -- Only for image_to_video type
  
  -- Generation status
  status video_status not null default 'pending',
  progress_percentage integer default 0,
  error_message text,
  
  -- Video output
  video_url text,
  thumbnail_url text,
  duration_seconds integer,
  resolution text, -- e.g., "1920x1080"
  file_size_mb numeric(10, 2),
  
  -- Credits and costs
  credits_used integer not null,
  
  -- Third-party API details
  external_job_id text, -- ID from Sora API or other provider
  
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

-- Enable Row Level Security
alter table public.videos enable row level security;
```

**Fields:**
- `id` (uuid, PK): Unique video identifier
- `user_id` (uuid, FK): References profiles.user_id
- `prompt` (text): User's text prompt for video generation
- `type` (enum): 'text_to_video' or 'image_to_video'
- `image_url` (text): URL of uploaded image (for image_to_video)
- `status` (enum): Current generation status
- `progress_percentage` (integer): 0-100 progress indicator
- `error_message` (text): Error details if failed
- `video_url` (text): Final video URL in storage
- `thumbnail_url` (text): Video thumbnail preview
- `duration_seconds` (integer): Video length in seconds
- `resolution` (text): Video dimensions (e.g., "1920x1080")
- `file_size_mb` (numeric): Video file size
- `credits_used` (integer): Credits deducted for this video
- `external_job_id` (text): Third-party API job ID
- `created_at` (timestamp): Request creation time
- `completed_at` (timestamp): Video completion time
- `deleted_at` (timestamp): Soft delete timestamp

---

### 3. `transactions` Table

Records all credit purchases, deductions, and refunds.

```sql
create type transaction_type as enum ('purchase', 'video_deduction', 'refund', 'bonus');
create type transaction_status as enum ('pending', 'completed', 'failed', 'cancelled');
create type payment_method as enum ('bank_transfer', 'momo', 'zalopay', 'card');

create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(user_id) on delete cascade not null,
  
  -- Transaction details
  type transaction_type not null,
  status transaction_status not null default 'pending',
  
  -- Financial details
  amount_vnd numeric(15, 2), -- Amount in Vietnamese Dong
  credits integer not null, -- Credits added or deducted
  
  -- Payment details (for purchase transactions)
  payment_method payment_method,
  payment_id text, -- External payment gateway transaction ID
  payment_metadata jsonb, -- Additional payment info from gateway
  
  -- Related entities
  video_id uuid references public.videos(id) on delete set null, -- For video_deduction type
  credit_package_id uuid references public.credit_packages(id) on delete set null, -- For purchase type
  
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

-- Enable Row Level Security
alter table public.transactions enable row level security;
```

**Fields:**
- `id` (uuid, PK): Unique transaction identifier
- `user_id` (uuid, FK): References profiles.user_id
- `type` (enum): Transaction type (purchase, deduction, refund, bonus)
- `status` (enum): Transaction status
- `amount_vnd` (numeric): Payment amount in Vietnamese Dong
- `credits` (integer): Credits affected (positive for add, negative for deduct)
- `payment_method` (enum): Payment method used
- `payment_id` (text): External payment gateway transaction ID
- `payment_metadata` (jsonb): Additional payment information
- `video_id` (uuid, FK): Related video (for deductions)
- `credit_package_id` (uuid, FK): Related credit package (for purchases)
- `description` (text): Transaction description
- `created_at` (timestamp): Transaction creation time
- `completed_at` (timestamp): Transaction completion time

---

### 4. `credit_packages` Table

Defines available credit packages for purchase.

```sql
create table public.credit_packages (
  id uuid default uuid_generate_v4() primary key,
  
  -- Package details
  name text not null, -- e.g., "Gói Khởi Đầu", "Gói Cơ Bản"
  name_en text not null, -- English name for reference
  description text,
  
  -- Pricing
  credits integer not null,
  price_vnd numeric(15, 2) not null,
  discount_percentage integer default 0,
  
  -- Package metadata
  is_popular boolean default false, -- Highlight as "Most Popular"
  display_order integer default 0, -- Sort order in UI
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

-- Enable Row Level Security (public read access)
alter table public.credit_packages enable row level security;

-- Trigger to update updated_at timestamp
create trigger handle_updated_at before update on public.credit_packages
  for each row execute procedure public.handle_updated_at();
```

**Fields:**
- `id` (uuid, PK): Unique package identifier
- `name` (text): Vietnamese package name
- `name_en` (text): English package name
- `description` (text): Package description
- `credits` (integer): Number of credits in package
- `price_vnd` (numeric): Price in Vietnamese Dong
- `discount_percentage` (integer): Discount percentage (0-100)
- `is_popular` (boolean): Mark as "Most Popular" in UI
- `display_order` (integer): Display sort order
- `active` (boolean): Whether package is available for purchase
- `created_at` (timestamp): Package creation time
- `updated_at` (timestamp): Last update time

---

### 5. `video_pricing` Table

Defines credit costs for different video generation types and parameters.

```sql
create table public.video_pricing (
  id uuid default uuid_generate_v4() primary key,
  
  -- Video specifications
  video_type video_type not null,
  duration_seconds integer not null, -- e.g., 5, 10, 20
  resolution text not null, -- e.g., "1920x1080", "1280x720"
  quality text not null, -- e.g., "standard", "high", "ultra"
  
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

-- Enable Row Level Security (public read access)
alter table public.video_pricing enable row level security;

-- Trigger to update updated_at timestamp
create trigger handle_updated_at before update on public.video_pricing
  for each row execute procedure public.handle_updated_at();
```

**Fields:**
- `id` (uuid, PK): Unique pricing rule identifier
- `video_type` (enum): Type of video generation
- `duration_seconds` (integer): Video duration
- `resolution` (text): Video resolution
- `quality` (text): Quality tier (standard/high/ultra)
- `credits_cost` (integer): Credits required
- `description` (text): Pricing rule description
- `active` (boolean): Whether this pricing is active
- `created_at` (timestamp): Rule creation time
- `updated_at` (timestamp): Last update time

---

## 🔧 Helper Functions

### Updated At Trigger Function

```sql
-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;
```

### Create Profile on Signup

```sql
-- Function to automatically create profile when user signs up
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

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 🔒 Row Level Security (RLS) Policies

See `database-rls-policies.md` for complete RLS policy definitions.

---

## 📝 Sample Data

### Credit Packages

```sql
insert into public.credit_packages (name, name_en, description, credits, price_vnd, discount_percentage, is_popular, display_order) values
  ('Gói Dùng Thử', 'Starter Pack', 'Hoàn hảo để bắt đầu trải nghiệm', 50, 99000, 0, false, 1),
  ('Gói Cơ Bản', 'Basic Pack', 'Phù hợp cho người dùng thường xuyên', 200, 299000, 10, true, 2),
  ('Gói Chuyên Nghiệp', 'Pro Pack', 'Dành cho nhà sáng tạo nội dung', 500, 699000, 15, false, 3),
  ('Gói Doanh Nghiệp', 'Business Pack', 'Giải pháp tốt nhất cho doanh nghiệp', 1200, 1499000, 20, false, 4);
```

### Video Pricing

```sql
insert into public.video_pricing (video_type, duration_seconds, resolution, quality, credits_cost, description) values
  ('text_to_video', 5, '1280x720', 'standard', 10, '5 giây, HD, chất lượng tiêu chuẩn'),
  ('text_to_video', 5, '1920x1080', 'high', 15, '5 giây, Full HD, chất lượng cao'),
  ('text_to_video', 10, '1280x720', 'standard', 18, '10 giây, HD, chất lượng tiêu chuẩn'),
  ('text_to_video', 10, '1920x1080', 'high', 25, '10 giây, Full HD, chất lượng cao'),
  ('image_to_video', 5, '1280x720', 'standard', 15, '5 giây từ ảnh, HD, chất lượng tiêu chuẩn'),
  ('image_to_video', 5, '1920x1080', 'high', 20, '5 giây từ ảnh, Full HD, chất lượng cao'),
  ('image_to_video', 10, '1280x720', 'standard', 25, '10 giây từ ảnh, HD, chất lượng tiêu chuẩn'),
  ('image_to_video', 10, '1920x1080', 'high', 35, '10 giây từ ảnh, Full HD, chất lượng cao');
```

---

## 🚀 Deployment Steps

1. **Create Supabase Project**
   ```bash
   # Visit https://supabase.com and create new project
   ```

2. **Run Migration Scripts**
   ```sql
   -- Execute all table creation scripts in order
   -- Execute helper functions
   -- Execute RLS policies
   -- Insert sample data
   ```

3. **Configure Storage Buckets**
   ```sql
   -- Create buckets for videos, images, and avatars
   insert into storage.buckets (id, name, public) values
     ('videos', 'videos', true),
     ('images', 'images', true),
     ('avatars', 'avatars', true);
   ```

4. **Test Database**
   ```sql
   -- Verify all tables exist
   -- Test RLS policies
   -- Verify triggers work correctly
   ```

---

## 📊 Performance Considerations

1. **Indexes**: All foreign keys and frequently queried columns have indexes
2. **Partitioning**: Consider partitioning `videos` and `transactions` tables by date for large datasets
3. **Archiving**: Implement soft delete and archival strategy for old videos
4. **Caching**: Use Redis/Vercel KV for frequently accessed data (credit packages, pricing)

---

## 🔄 Future Enhancements

- Add `user_preferences` table for UI settings
- Add `api_keys` table for developer API access
- Add `webhooks` table for event notifications
- Add `usage_analytics` table for detailed tracking
- Add `referrals` table for referral program

---

**Next Steps:**
1. Review and approve this schema
2. Create RLS policies document
3. Set up Supabase project
4. Run migration scripts
5. Test with sample data
