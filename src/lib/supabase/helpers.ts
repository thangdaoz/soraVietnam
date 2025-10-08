/**
 * Database Helper Utilities
 * Common database operations and utilities
 */

import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

export type TypedSupabaseClient = SupabaseClient<Database>;
type Tables = Database['public']['Tables'];
type Enums = Database['public']['Enums'];

// ============================================================================
// PROFILE OPERATIONS
// ============================================================================

/**
 * Get user profile by user ID
 */
export async function getProfile(
  supabase: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user profile
 */
export async function updateProfile(
  supabase: TypedSupabaseClient,
  userId: string,
  updates: Tables['profiles']['Update']
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user credit balance
 */
export async function getUserCredits(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<number> {
  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data.credits;
}

// ============================================================================
// VIDEO OPERATIONS
// ============================================================================

/**
 * Get all videos for a user
 */
export async function getUserVideos(
  supabase: TypedSupabaseClient,
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    status?: Enums['video_status'];
  }
) {
  let query = supabase
    .from('videos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Get single video by ID
 */
export async function getVideo(
  supabase: TypedSupabaseClient,
  videoId: string
) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new video generation request
 */
export async function createVideo(
  supabase: TypedSupabaseClient,
  video: Tables['videos']['Insert']
) {
  const { data, error } = await supabase
    .from('videos')
    .insert(video)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update video status
 */
export async function updateVideoStatus(
  supabase: TypedSupabaseClient,
  videoId: string,
  status: Enums['video_status'],
  updates?: {
    video_url?: string;
    thumbnail_url?: string;
    duration_seconds?: number;
    error_message?: string;
    completed_at?: string;
  }
) {
  const { data, error } = await supabase
    .from('videos')
    .update({
      status,
      ...updates,
    })
    .eq('id', videoId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// TRANSACTION OPERATIONS
// ============================================================================

/**
 * Get user transaction history
 */
export async function getUserTransactions(
  supabase: TypedSupabaseClient,
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    type?: Enums['transaction_type'];
  }
) {
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.type) {
    query = query.eq('type', options.type);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Create a new transaction
 */
export async function createTransaction(
  supabase: TypedSupabaseClient,
  transaction: Tables['transactions']['Insert']
) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Purchase credits transaction (atomic operation)
 */
export async function purchaseCredits(
  supabase: TypedSupabaseClient,
  userId: string,
  credits: number,
  amountVnd: number,
  paymentMethod: Enums['payment_method'],
  paymentReference: string
) {
  // Start transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'purchase',
      status: 'completed',
      credits,
      amount_vnd: amountVnd,
      payment_method: paymentMethod,
      payment_reference: paymentReference,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (transactionError) throw transactionError;

  // Update user credits (simplified - in production use database function)
  const currentProfile = await getProfile(supabase, userId);
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({
      credits: currentProfile.credits + credits,
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (profileError) throw profileError;

  return { transaction, profile };
}

/**
 * Deduct credits for video generation (atomic operation)
 */
export async function deductCredits(
  supabase: TypedSupabaseClient,
  userId: string,
  videoId: string,
  credits: number
) {
  // Check if user has enough credits
  const userCredits = await getUserCredits(supabase, userId);
  if (userCredits < credits) {
    throw new Error('Insufficient credits');
  }

  // Create deduction transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'video_deduction',
      status: 'completed',
      credits: -credits,
      video_id: videoId,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (transactionError) throw transactionError;

  // Update user credits and increment video count
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({
      credits: userCredits - credits,
      total_videos_generated: (await getProfile(supabase, userId))
        .total_videos_generated + 1,
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (profileError) throw profileError;

  return { transaction, profile };
}

// ============================================================================
// CREDIT PACKAGE OPERATIONS
// ============================================================================

/**
 * Get all active credit packages
 */
export async function getActiveCreditPackages(
  supabase: TypedSupabaseClient
) {
  const { data, error } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get single credit package
 */
export async function getCreditPackage(
  supabase: TypedSupabaseClient,
  packageId: string
) {
  const { data, error } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('id', packageId)
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// VIDEO PRICING OPERATIONS
// ============================================================================

/**
 * Get video pricing by type and duration
 */
export async function getVideoPricing(
  supabase: TypedSupabaseClient,
  videoType: Enums['video_type'],
  durationSeconds: number
) {
  const { data, error } = await supabase
    .from('video_pricing')
    .select('*')
    .eq('video_type', videoType)
    .eq('duration_seconds', durationSeconds)
    .eq('active', true)
    .single();

  if (error) {
    // If no exact match, get the default pricing
    const { data: defaultPricing, error: defaultError } = await supabase
      .from('video_pricing')
      .select('*')
      .eq('video_type', videoType)
      .eq('is_default', true)
      .eq('active', true)
      .single();

    if (defaultError) throw defaultError;
    return defaultPricing;
  }

  return data;
}

/**
 * Get all video pricing options
 */
export async function getAllVideoPricing(
  supabase: TypedSupabaseClient
) {
  const { data, error } = await supabase
    .from('video_pricing')
    .select('*')
    .eq('active', true)
    .order('video_type', { ascending: true })
    .order('duration_seconds', { ascending: true });

  if (error) throw error;
  return data;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user exists
 */
export async function userExists(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  return !error && !!data;
}

/**
 * Calculate total spending by user
 */
export async function getUserTotalSpending(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<number> {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount_vnd')
    .eq('user_id', userId)
    .eq('type', 'purchase')
    .eq('status', 'completed');

  if (error) throw error;

  return data.reduce((total, transaction) => {
    return total + (transaction.amount_vnd || 0);
  }, 0);
}

/**
 * Get video generation statistics for user
 */
export async function getUserVideoStats(
  supabase: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from('videos')
    .select('status')
    .eq('user_id', userId);

  if (error) throw error;

  const stats = {
    total: data.length,
    pending: data.filter((v) => v.status === 'pending').length,
    processing: data.filter((v) => v.status === 'processing').length,
    completed: data.filter((v) => v.status === 'completed').length,
    failed: data.filter((v) => v.status === 'failed').length,
  };

  return stats;
}
