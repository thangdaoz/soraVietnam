/**
 * Pricing Service
 * Fetches pricing from video_pricing table (existing schema)
 * Allows changing prices without redeploying the app
 */

import { createClient } from '@/lib/supabase/server';

// Type definitions matching your database schema
export interface VideoPricing {
  id: string;
  video_type: 'sora-2-text-to-video' | 'sora-2-image-to-video'; // API model names
  duration_seconds: number;
  resolution: string;
  quality: string;
  credits_cost: number;
  description: string;
  active: boolean;
}

export interface VideoParams {
  type: 'text_to_video' | 'image_to_video'; // Simplified internal type
  aspect_ratio?: 'landscape' | 'portrait';
  duration?: '5s' | '10s';
  resolution?: string;
  quality?: string;
}

// In-memory cache to reduce database queries
let pricingCache: Map<string, { data: VideoPricing; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get video pricing from database with caching
 * Matches: video_type (API model name), duration_seconds, resolution, quality
 */
async function getVideoPricingFromDB(
  videoType: string, // API model name like 'sora-2-text-to-video'
  durationSeconds: number,
  resolution: string,
  quality: string
): Promise<VideoPricing | null> {
  const cacheKey = `${videoType}_${durationSeconds}_${resolution}_${quality}`;

  // Check cache first
  const cached = pricingCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Pricing] Using cached price: ${cached.data.credits_cost} credits`);
    return cached.data;
  }

  // Fetch from database
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('video_pricing')
    .select('*')
    .eq('video_type', videoType)
    .eq('duration_seconds', durationSeconds)
    .eq('resolution', resolution)
    .eq('quality', quality)
    .eq('active', true)
    .single();

  if (error || !data) {
    console.error(`[Pricing] Error fetching price:`, error);
    return null;
  }

  // Update cache
  pricingCache.set(cacheKey, {
    data: data as VideoPricing,
    timestamp: Date.now(),
  });

  console.log(`[Pricing] Fetched fresh price: ${data.credits_cost} credits (${data.description})`);
  return data as VideoPricing;
}

/**
 * Calculate the credit cost for a video based on parameters
 * Uses existing video_pricing table from your schema
 * 
 * Note: video_type should be the API model name like 'sora-2-text-to-video'
 */
export async function calculateVideoPrice(params: VideoParams): Promise<number> {
  // Map to API model names
  const modelName = params.type === 'text_to_video' 
    ? 'sora-2-text-to-video' 
    : 'sora-2-image-to-video';
  
  // Currently all videos are 10s, 720p, standard quality
  const durationSeconds = 10;
  const resolution = params.resolution || '1280x720';
  const quality = params.quality || 'standard';

  const pricing = await getVideoPricingFromDB(
    modelName as any,
    durationSeconds,
    resolution,
    quality
  );

  if (!pricing) {
    // Fallback to current standard pricing
    console.warn('[Pricing] Using fallback pricing');
    return 7000; // Default for both text-to-video and image-to-video
  }

  return pricing.credits_cost;
}

/**
 * Clear pricing cache
 * Call this after updating pricing in database
 */
export function clearPricingCache() {
  pricingCache.clear();
  console.log('[Pricing] Cache cleared');
}
