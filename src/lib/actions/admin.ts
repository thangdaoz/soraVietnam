/**
 * Admin Actions
 * Functions to manage pricing and other admin tasks
 * Uses existing video_pricing table from schema
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { clearPricingCache } from '@/lib/pricing';

/**
 * Update video pricing in database
 * @param id - The pricing record ID to update
 * @param creditsCost - New credit cost
 */
export async function updateVideoPricing(id: string, creditsCost: number) {
  // TODO: Add admin role check here
  // Currently any authenticated user can update pricing (you should restrict this!)
  
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Update pricing
  const { error } = await supabase
    .from('video_pricing')
    .update({
      credits_cost: creditsCost,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating video pricing:', error);
    return { success: false, error: error.message };
  }

  // Clear cache so new pricing takes effect immediately
  clearPricingCache();

  // Revalidate pages that show pricing
  revalidatePath('/dashboard');
  revalidatePath('/admin/pricing');

  return { success: true };
}

/**
 * Get all pricing configurations for admin dashboard
 */
export async function getAllVideoPricing() {
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized', data: [] };
  }

  const { data, error } = await supabase
    .from('video_pricing')
    .select('*')
    .order('video_type')
    .order('duration_seconds')
    .order('quality');

  if (error) {
    console.error('Error fetching video pricing:', error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data };
}

/**
 * Toggle active status of a pricing configuration
 */
export async function toggleVideoPricingActive(id: string, active: boolean) {
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('video_pricing')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error toggling pricing status:', error);
    return { success: false, error: error.message };
  }

  // Clear cache
  clearPricingCache();

  // Revalidate
  revalidatePath('/dashboard');
  revalidatePath('/admin/pricing');

  return { success: true };
}
