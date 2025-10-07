# API Endpoints & Server Actions

**Last Updated:** October 7, 2025  
**Framework:** Next.js 15 with App Router  
**API Type:** Server Actions + API Routes

## Overview

This document defines all API endpoints and Next.js server actions for the Sora Vietnam Gateway application. We use **Server Actions** for most operations (preferred in Next.js 15) and **API Routes** only when necessary (webhooks, external integrations).

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Components                     │
│  (Forms, Buttons, Interactive UI)                       │
└───────────────────┬─────────────────────────────────────┘
                    │
                    │ Server Actions (POST)
                    ▼
┌─────────────────────────────────────────────────────────┐
│              Server Actions (TypeScript)                 │
│  - Type-safe                                            │
│  - Direct database access                               │
│  - Built-in security                                    │
│  └─────────────┬───────────────────────────────────────┘
                 │
                 │ Supabase Client
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   Supabase Database                      │
│  - Row Level Security (RLS)                             │
│  - Database Functions                                   │
└─────────────────────────────────────────────────────────┘

External APIs (Webhooks, OAuth) → API Routes → Database
```

---

## 📂 File Structure

```
src/
├── app/
│   ├── api/                          # API Routes (external integrations)
│   │   ├── auth/
│   │   │   └── callback/route.ts     # OAuth callback handler
│   │   ├── webhooks/
│   │   │   ├── payment/route.ts      # Casso payment webhook
│   │   │   └── video/route.ts        # Sora API webhook
│   │   └── admin/
│   │       └── [...admin]/route.ts   # Admin operations
│   └── actions/                      # Server Actions
│       ├── auth.ts                   # Authentication actions
│       ├── videos.ts                 # Video management actions
│       ├── credits.ts                # Credit management actions
│       └── payments.ts               # Payment actions
└── lib/
    ├── supabase/
    │   ├── client.ts                 # Browser client
    │   └── server.ts                 # Server client
    └── api/
        ├── sora.ts                   # Sora API client
        └── casso.ts                  # Casso payment client
```

---

## 🔐 Authentication Actions

**File:** `src/app/actions/auth.ts`

### 1. Sign Up with Email

```typescript
'use server'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  
  // Validation
  if (!email || !password || !fullName) {
    return { error: 'All fields are required' };
  }
  
  const supabase = createServerClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, data };
}
```

**Usage:**
```typescript
// In a client component
import { signUp } from '@/app/actions/auth';

async function handleSubmit(formData: FormData) {
  const result = await signUp(formData);
  if (result.error) {
    setError(result.error);
  } else {
    router.push('/auth/verify-email');
  }
}
```

### 2. Sign In with Email

```typescript
'use server'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }
  
  const supabase = createServerClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/', 'layout');
  return { success: true, data };
}
```

### 3. Sign Out

```typescript
'use server'

export async function signOut() {
  const supabase = createServerClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/', 'layout');
  redirect('/');
}
```

### 4. OAuth Sign In

```typescript
'use server'

export async function signInWithOAuth(provider: 'google' | 'facebook') {
  const supabase = createServerClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  
  if (error) {
    return { error: error.message };
  }
  
  redirect(data.url);
}
```

### 5. Reset Password Request

```typescript
'use server'

export async function requestPasswordReset(email: string) {
  const supabase = createServerClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, message: 'Password reset email sent' };
}
```

### 6. Update Password

```typescript
'use server'

export async function updatePassword(newPassword: string) {
  const supabase = createServerClient();
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, message: 'Password updated successfully' };
}
```

---

## 🎬 Video Management Actions

**File:** `src/app/actions/videos.ts`

### 1. Create Video Request

```typescript
'use server'

import { z } from 'zod';

const createVideoSchema = z.object({
  prompt: z.string().min(10).max(500),
  type: z.enum(['text_to_video', 'image_to_video']),
  imageUrl: z.string().url().optional(),
  durationSeconds: z.number().int().min(5).max(20),
  resolution: z.enum(['1280x720', '1920x1080']),
  quality: z.enum(['standard', 'high']),
});

export async function createVideoRequest(input: z.infer<typeof createVideoSchema>) {
  const supabase = createServerClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  // Validate input
  const validatedInput = createVideoSchema.safeParse(input);
  if (!validatedInput.success) {
    return { error: 'Invalid input', details: validatedInput.error.errors };
  }
  
  const { prompt, type, imageUrl, durationSeconds, resolution, quality } = validatedInput.data;
  
  // Create video request using database function
  const { data, error } = await supabase.rpc('create_video_request', {
    p_user_id: user.id,
    p_prompt: prompt,
    p_video_type: type,
    p_image_url: imageUrl || null,
    p_duration_seconds: durationSeconds,
    p_resolution: resolution,
    p_quality: quality,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  // Trigger video generation job (queue or direct API call)
  await triggerVideoGeneration(data as string, prompt, type, imageUrl);
  
  revalidatePath('/dashboard/videos');
  return { success: true, videoId: data };
}
```

### 2. Get User Videos

```typescript
'use server'

export async function getUserVideos(page = 1, limit = 20) {
  const supabase = createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  const { data, error, count } = await supabase
    .from('videos')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  
  if (error) {
    return { error: error.message };
  }
  
  return { 
    success: true, 
    videos: data,
    totalCount: count,
    totalPages: Math.ceil((count || 0) / limit),
  };
}
```

### 3. Get Video by ID

```typescript
'use server'

export async function getVideoById(videoId: string) {
  const supabase = createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .eq('user_id', user.id)
    .single();
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, video: data };
}
```

### 4. Delete Video (Soft Delete)

```typescript
'use server'

export async function deleteVideo(videoId: string) {
  const supabase = createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  // Soft delete
  const { error } = await supabase
    .from('videos')
    .update({ 
      deleted_at: new Date().toISOString(),
      status: 'deleted'
    })
    .eq('id', videoId)
    .eq('user_id', user.id);
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/dashboard/videos');
  return { success: true };
}
```

### 5. Download Video

```typescript
'use server'

export async function getVideoDownloadUrl(videoId: string) {
  const supabase = createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  // Verify ownership
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .select('video_url, status')
    .eq('id', videoId)
    .eq('user_id', user.id)
    .single();
  
  if (videoError || !video) {
    return { error: 'Video not found' };
  }
  
  if (video.status !== 'completed') {
    return { error: 'Video not ready for download' };
  }
  
  // Generate signed URL with expiration
  const { data, error } = await supabase.storage
    .from('videos')
    .createSignedUrl(video.video_url, 3600); // 1 hour expiry
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, downloadUrl: data.signedUrl };
}
```

---

## 💳 Credit Management Actions

**File:** `src/app/actions/credits.ts`

### 1. Get Credit Packages

```typescript
'use server'

export async function getCreditPackages() {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, packages: data };
}
```

### 2. Get User Credit Balance

```typescript
'use server'

export async function getUserCreditBalance() {
  const supabase = createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('user_id', user.id)
    .single();
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, credits: data.credits };
}
```

### 3. Get Transaction History

```typescript
'use server'

export async function getTransactionHistory(page = 1, limit = 20) {
  const supabase = createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  const { data, error, count } = await supabase
    .from('transactions')
    .select('*, video:videos(prompt, status)', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  
  if (error) {
    return { error: error.message };
  }
  
  return { 
    success: true, 
    transactions: data,
    totalCount: count,
    totalPages: Math.ceil((count || 0) / limit),
  };
}
```

### 4. Get User Statistics

```typescript
'use server'

export async function getUserStatistics() {
  const supabase = createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  const { data, error } = await supabase.rpc('get_user_stats', {
    p_user_id: user.id
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, stats: data };
}
```

---

## 💰 Payment Actions

**File:** `src/app/actions/payments.ts`

### 1. Create Payment Intent

```typescript
'use server'

export async function createPaymentIntent(packageId: string) {
  const supabase = createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  // Get package details
  const { data: package, error: packageError } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('id', packageId)
    .eq('active', true)
    .single();
  
  if (packageError || !package) {
    return { error: 'Package not found' };
  }
  
  // Create pending transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: 'purchase',
      status: 'pending',
      amount_vnd: package.price_vnd,
      credits: package.credits,
      credit_package_id: packageId,
      description: `Purchase: ${package.name}`,
    })
    .select()
    .single();
  
  if (transactionError) {
    return { error: transactionError.message };
  }
  
  // Create payment with Casso (or other gateway)
  const paymentData = await createCassoPayment({
    amount: package.price_vnd,
    description: `Mua ${package.credits} credits - ${package.name}`,
    orderId: transaction.id,
    customerEmail: user.email,
  });
  
  if (!paymentData.success) {
    return { error: 'Failed to create payment' };
  }
  
  // Update transaction with payment ID
  await supabase
    .from('transactions')
    .update({ payment_id: paymentData.paymentId })
    .eq('id', transaction.id);
  
  return { 
    success: true, 
    paymentUrl: paymentData.paymentUrl,
    transactionId: transaction.id
  };
}
```

### 2. Verify Payment

```typescript
'use server'

export async function verifyPayment(transactionId: string) {
  const supabase = createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  // Get transaction
  const { data: transaction, error } = await supabase
    .from('transactions')
    .select('*, credit_package:credit_packages(*)')
    .eq('id', transactionId)
    .eq('user_id', user.id)
    .single();
  
  if (error || !transaction) {
    return { error: 'Transaction not found' };
  }
  
  if (transaction.status === 'completed') {
    return { success: true, status: 'completed' };
  }
  
  // Check payment status with Casso
  const paymentStatus = await checkCassoPaymentStatus(transaction.payment_id);
  
  if (paymentStatus === 'completed') {
    // Add credits using secure function
    await supabase.rpc('add_credits_from_purchase', {
      p_user_id: user.id,
      p_credits: transaction.credits,
      p_amount_vnd: transaction.amount_vnd,
      p_payment_id: transaction.payment_id,
      p_payment_method: 'bank_transfer',
      p_credit_package_id: transaction.credit_package_id,
    });
    
    revalidatePath('/dashboard');
    return { success: true, status: 'completed' };
  }
  
  return { success: true, status: transaction.status };
}
```

---

## 🌐 API Routes (Webhooks & External)

### 1. Payment Webhook

**File:** `src/app/api/webhooks/payment/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Verify webhook signature
    const signature = request.headers.get('x-casso-signature');
    if (!verifyWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Process payment notification
    const { orderId, status, amount, paymentId } = payload;
    
    if (status === 'success') {
      const supabase = createServerClient();
      
      // Get transaction
      const { data: transaction } = await supabase
        .from('transactions')
        .select('*, credit_package:credit_packages(*)')
        .eq('id', orderId)
        .single();
      
      if (!transaction) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      }
      
      // Add credits (idempotent - check if already processed)
      if (transaction.status !== 'completed') {
        await supabase.rpc('add_credits_from_purchase', {
          p_user_id: transaction.user_id,
          p_credits: transaction.credits,
          p_amount_vnd: transaction.amount_vnd,
          p_payment_id: paymentId,
          p_payment_method: 'bank_transfer',
          p_credit_package_id: transaction.credit_package_id,
        });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### 2. Video Generation Webhook

**File:** `src/app/api/webhooks/video/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Verify webhook signature from Sora API
    const signature = request.headers.get('x-sora-signature');
    if (!verifySoraWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const { jobId, status, videoUrl, thumbnailUrl, error } = payload;
    
    const supabase = createServerClient();
    
    // Update video status
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString(),
    };
    
    if (status === 'completed') {
      updateData.video_url = videoUrl;
      updateData.thumbnail_url = thumbnailUrl;
      updateData.completed_at = new Date().toISOString();
      updateData.progress_percentage = 100;
    } else if (status === 'failed') {
      updateData.error_message = error;
    } else if (status === 'processing') {
      updateData.progress_percentage = payload.progress || 50;
    }
    
    await supabase
      .from('videos')
      .update(updateData)
      .eq('external_job_id', jobId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Video webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### 3. OAuth Callback

**File:** `src/app/api/auth/callback/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const supabase = createServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // Redirect to dashboard after OAuth
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

---

## 🔒 Security Considerations

1. **Always validate user authentication** in server actions
2. **Use database RLS policies** as the first line of defense
3. **Validate all inputs** using Zod or similar
4. **Use transactions** for critical operations (credits, payments)
5. **Verify webhook signatures** for external webhooks
6. **Rate limit** API routes and server actions
7. **Log all financial transactions** for audit
8. **Never expose sensitive keys** in client code

---

## 📝 Next Steps

1. Implement all server actions in `src/app/actions/`
2. Create API route handlers for webhooks
3. Set up Casso payment integration
4. Integrate Sora API for video generation
5. Add rate limiting middleware
6. Set up error tracking (Sentry)
7. Write integration tests

---

**Implementation Priority:**
1. ✅ Authentication actions
2. ✅ Video management actions  
3. ✅ Credit management actions
4. ✅ Payment actions
5. ⏳ Webhook handlers
6. ⏳ External API integrations
