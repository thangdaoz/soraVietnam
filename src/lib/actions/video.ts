'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { calculateVideoPrice } from '@/lib/pricing';

// Types based on third-party API
interface CreateVideoInput {
  prompt: string;
  aspect_ratio?: 'portrait' | 'landscape';
  image_url?: string; // For image-to-video
  type?: 'text_to_video' | 'image_to_video';
}

interface CreateVideoResponse {
  code: number;
  message: string;
  data?: {
    taskId: string;
  };
}

interface VideoStatusResponse {
  code: number;
  message: string;
  data?: {
    taskId: string;
    model: string;
    state: 'waiting' | 'queuing' | 'generating' | 'success' | 'fail';
    param: string;
    resultJson?: string;
    failCode?: string;
    failMsg?: string;
    completeTime?: number;
    createTime: number;
    updateTime: number;
    consumeCredits?: number;
    costTime?: number;
  };
}

interface VideoResult {
  resultUrls: string[];
}

/**
 * Create a new video generation task
 * This will:
 * 1. Validate user has enough credits
 * 2. Call third-party API to create task
 * 3. Deduct credits from user
 * 4. Store video metadata in database
 */
export async function createVideoTask(input: CreateVideoInput) {
  try {
    const supabase = await createClient();
    const videoType: 'text_to_video' | 'image_to_video' = input.type || 'text_to_video';

    if (videoType === 'image_to_video' && !input.image_url) {
      return { success: false, error: 'Image URL is required for image-to-video generation.' };
    }
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please log in.' };
    }

    // Get user profile and check credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Could not fetch user profile.' };
    }

    // Calculate credits needed from database pricing (dynamic)
    const creditsNeeded = await calculateVideoPrice({
      type: videoType,
      aspect_ratio: input.aspect_ratio,
    });
    
    if (profile.credits < creditsNeeded) {
      return { 
        success: false, 
        error: `Insufficient credits. You need ${creditsNeeded} credits but only have ${profile.credits}.` 
      };
    }

    // Prepare callback URL for webhook
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/video-callback`;

    // Debug logging
    console.log('=== Video API Request ===');
    console.log('API URL:', process.env.VIDEO_API_URL);
    console.log('API Key exists:', !!process.env.VIDEO_API_KEY);
    console.log('Callback URL:', callbackUrl);
    console.log('Prompt:', input.prompt);
    console.log('Aspect Ratio:', input.aspect_ratio || 'landscape');
    console.log('Video Type:', videoType);
    if (input.image_url) {
      console.log('Image URL provided:', input.image_url);
    }

    const model =
      videoType === 'image_to_video' ? 'sora-2-image-to-video' : 'sora-2-text-to-video';

    const apiInput: Record<string, any> = {
      prompt: input.prompt,
      aspect_ratio: input.aspect_ratio || 'landscape',
    };

    // For image-to-video, add image_urls as an ARRAY (API expects array, not single string)
    if (videoType === 'image_to_video' && input.image_url) {
      apiInput.image_urls = [input.image_url]; // Wrap in array!
    }

    // Log the complete request body for debugging
    const requestBody: Record<string, any> = {
      model,
      callBackUrl: callbackUrl,
      input: apiInput,
    };

    console.log('=== REQUEST BODY ===');
    console.log(JSON.stringify(requestBody, null, 2));

    // Call third-party API to create video task
    const apiResponse = await fetch(`${process.env.VIDEO_API_URL}/api/v1/jobs/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VIDEO_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('API Response Status:', apiResponse.status);
    console.log('API Response OK:', apiResponse.ok);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Third-party API error response:', errorText);
      console.error('API Response status:', apiResponse.status);
      return { 
        success: false, 
        error: `API Error (${apiResponse.status}): ${errorText.substring(0, 200)}` 
      };
    }

    const apiData: CreateVideoResponse = await apiResponse.json();
    console.log('API Response Data:', JSON.stringify(apiData, null, 2));

    if (apiData.code !== 200 || !apiData.data?.taskId) {
      console.error('API returned error code:', apiData.code, 'Message:', apiData.message);
      
      // Handle specific error codes
      let errorMessage = apiData.message || 'Failed to create video task.';
      
      if (apiData.code === 433) {
        errorMessage = 'API quota exceeded. Please try again later or contact support.';
      } else if (apiData.code === 401) {
        errorMessage = 'Invalid API key. Please check your configuration.';
      } else if (apiData.code === 500) {
        errorMessage = 'Video service is temporarily unavailable. Please try again later.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }

    // Store video metadata in database
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        prompt: input.prompt,
        type: videoType,
        image_url: videoType === 'image_to_video' ? input.image_url : null,
        status: 'pending',
        credits_used: creditsNeeded,
        external_job_id: apiData.data.taskId,
        progress_percentage: 0,
      })
      .select()
      .single();

    if (videoError) {
      console.error('Database error:', videoError);
      return { 
        success: false, 
        error: 'Failed to save video metadata.' 
      };
    }

    // Deduct credits from user and increment video counter
    // First, get current total_videos_generated to increment it
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('total_videos_generated')
      .eq('user_id', user.id)
      .single();

    const { error: creditError } = await supabase
      .from('profiles')
      .update({ 
        credits: profile.credits - creditsNeeded,
        total_videos_generated: (currentProfile?.total_videos_generated || 0) + 1,
      })
      .eq('user_id', user.id);

    if (creditError) {
      console.error('Credit deduction error:', creditError);
      // Rollback: delete the video record
      await supabase.from('videos').delete().eq('id', video.id);
      return { 
        success: false, 
        error: 'Failed to deduct credits.' 
      };
    }

    // Create transaction record
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'video_deduction',
      credits: -creditsNeeded,
      description: `Video generation (${videoType === 'image_to_video' ? 'image' : 'text'}): ${input.prompt.substring(0, 50)}...`,
      status: 'completed',
    });

    revalidatePath('/dashboard');
    revalidatePath('/gallery');

    return { 
      success: true, 
      data: {
        videoId: video.id,
        taskId: apiData.data.taskId,
        creditsRemaining: profile.credits - creditsNeeded,
      }
    };
  } catch (error) {
    console.error('Create video task error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

/**
 * Query video generation status from third-party API
 * Used for polling to check if video is ready
 */
export async function queryVideoStatus(videoId: string) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get video from database
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single();

    if (videoError || !video) {
      return { success: false, error: 'Video not found.' };
    }

    // If video already completed or failed, return cached status
    if (video.status === 'completed' || video.status === 'failed') {
      return {
        success: true,
        data: {
          status: video.status,
          videoUrl: video.video_url,
          thumbnailUrl: video.thumbnail_url,
          progress: 100,
        },
      };
    }

    // Query third-party API for status
    const apiResponse = await fetch(
      `${process.env.VIDEO_API_URL}/api/v1/jobs/recordInfo?taskId=${video.external_job_id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.VIDEO_API_KEY}`,
        },
      }
    );

    if (!apiResponse.ok) {
      return { success: false, error: 'Failed to query video status.' };
    }

    const apiData: VideoStatusResponse = await apiResponse.json();

    if (apiData.code !== 200 || !apiData.data) {
      return { success: false, error: apiData.message || 'Failed to get status.' };
    }

    // Map API state to our database status
    let dbStatus: 'pending' | 'processing' | 'completed' | 'failed' = 'pending';
    let progress = 0;
    let videoUrl: string | null = null;
    let errorMessage: string | null = null;

    switch (apiData.data.state) {
      case 'waiting':
      case 'queuing':
        dbStatus = 'pending';
        progress = 10;
        break;
      case 'generating':
        dbStatus = 'processing';
        progress = 50;
        break;
      case 'success':
        dbStatus = 'completed';
        progress = 100;
        if (apiData.data.resultJson) {
          const result: VideoResult = JSON.parse(apiData.data.resultJson);
          videoUrl = result.resultUrls?.[0] || null;
        }
        break;
      case 'fail':
        dbStatus = 'failed';
        progress = 0;
        errorMessage = apiData.data.failMsg || 'Video generation failed';
        break;
    }

    // Update database with new status
    const updateData: any = {
      status: dbStatus,
      progress_percentage: progress,
      updated_at: new Date().toISOString(),
    };

    if (videoUrl) {
      updateData.video_url = videoUrl;
      updateData.completed_at = new Date().toISOString();
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    await supabase
      .from('videos')
      .update(updateData)
      .eq('id', videoId);

    // If failed, refund credits
    if (dbStatus === 'failed' && video.credits_used > 0) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({ credits: profile.credits + video.credits_used })
          .eq('user_id', user.id);

        // Create refund transaction
        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'refund',
          credits: video.credits_used,
          description: `Refund for failed video: ${video.prompt.substring(0, 50)}...`,
          status: 'completed',
        });
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/gallery');

    return {
      success: true,
      data: {
        status: dbStatus,
        videoUrl,
        progress,
        errorMessage,
      },
    };
  } catch (error) {
    console.error('Query video status error:', error);
    return { success: false, error: 'Failed to check video status.' };
  }
}

/**
 * Get all videos for the current user
 */
export async function getUserVideos() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get videos error:', error);
      return { success: false, error: 'Failed to fetch videos.' };
    }

    return { success: true, data: videos };
  } catch (error) {
    console.error('Get user videos error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Soft delete a video (marks as deleted but keeps metadata)
 * Also cleans up the reference image from storage if it exists
 */
export async function deleteVideo(videoId: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // First, get the video to check if it has a reference image
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('image_url')
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Fetch video error:', fetchError);
      return { success: false, error: 'Video not found.' };
    }

    // Soft delete by setting deleted_at timestamp
    const { error } = await supabase
      .from('videos')
      .update({ 
        deleted_at: new Date().toISOString(),
        status: 'deleted',
      })
      .eq('id', videoId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Delete video error:', error);
      return { success: false, error: 'Failed to delete video.' };
    }

    // Cleanup: Delete reference image from storage if it exists
    if (video.image_url) {
      try {
        // Extract the file path from the public URL
        // URL format: https://{project}.supabase.co/storage/v1/object/public/images/{path}
        const url = new URL(video.image_url);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)$/);
        
        if (pathMatch && pathMatch[1]) {
          const filePath = pathMatch[1];
          
          // Delete the file from storage
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([filePath]);

          if (deleteError) {
            console.error('Failed to delete reference image:', deleteError);
            // Don't fail the whole operation if image deletion fails
          } else {
            console.log(`Successfully deleted reference image: ${filePath}`);
          }
        }
      } catch (error) {
        console.error('Error parsing image URL for cleanup:', error);
        // Don't fail the whole operation if image cleanup fails
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/gallery');

    return { success: true };
  } catch (error) {
    console.error('Delete video error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Get current video price based on parameters
 * Used by frontend to display credit cost dynamically
 */
export async function getVideoPrice(options?: {
  aspectRatio?: 'landscape' | 'portrait';
  type?: 'text_to_video' | 'image_to_video';
}) {
  try {
    const price = await calculateVideoPrice({
      type: options?.type || 'text_to_video',
      aspect_ratio: options?.aspectRatio,
    });

    return {
      success: true,
      data: { credits: price },
    };
  } catch (error) {
    console.error('Get video price error:', error);
    return {
      success: false,
      error: 'Could not fetch video price',
      data: { credits: 100 }, // Fallback
    };
  }
}

/**
 * Get user credit balance
 */
export async function getUserCredits() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (error || !profile) {
      return { success: false, error: 'Failed to fetch credits.' };
    }

    return { success: true, data: { credits: profile.credits } };
  } catch (error) {
    console.error('Get user credits error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
