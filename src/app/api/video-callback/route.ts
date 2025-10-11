import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook endpoint to receive callbacks from third-party video API
 * This handles both success and failure notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Received video callback:', JSON.stringify(body, null, 2));

    // Validate callback structure
    if (!body.data || !body.data.taskId) {
      console.error('Invalid callback payload:', body);
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const callbackData = body.data;

    // Find the video by external_job_id
    const { data: video, error: findError } = await supabase
      .from('videos')
      .select('*')
      .eq('external_job_id', callbackData.taskId)
      .single();

    if (findError || !video) {
      console.error('Video not found for taskId:', callbackData.taskId);
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Parse the state and prepare update data
    let dbStatus: 'pending' | 'processing' | 'completed' | 'failed' = 'pending';
    let progress = 0;
    let videoUrl: string | null = null;
    let errorMessage: string | null = null;

    // Success callback (code 200)
    if (body.code === 200 && callbackData.state === 'success') {
      dbStatus = 'completed';
      progress = 100;
      
      // Parse resultJson to get video URL
      if (callbackData.resultJson) {
        try {
          const result = JSON.parse(callbackData.resultJson);
          videoUrl = result.resultUrls?.[0] || null;
        } catch (e) {
          console.error('Failed to parse resultJson:', e);
        }
      }
    } 
    // Failure callback (code 501 or state is 'fail')
    else if (body.code === 501 || callbackData.state === 'fail') {
      dbStatus = 'failed';
      progress = 0;
      errorMessage = callbackData.failMsg || body.msg || 'Video generation failed';
    }
    // Other states
    else {
      switch (callbackData.state) {
        case 'waiting':
        case 'queuing':
          dbStatus = 'pending';
          progress = 10;
          break;
        case 'generating':
          dbStatus = 'processing';
          progress = 50;
          break;
      }
    }

    // Prepare update object
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

    // Update video in database
    const { error: updateError } = await supabase
      .from('videos')
      .update(updateData)
      .eq('id', video.id);

    if (updateError) {
      console.error('Failed to update video:', updateError);
      return NextResponse.json(
        { error: 'Failed to update video' },
        { status: 500 }
      );
    }

    // If failed, refund credits to user
    if (dbStatus === 'failed' && video.credits_used > 0) {
      // Get user's current credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('user_id', video.user_id)
        .single();

      if (profile) {
        // Refund credits
        await supabase
          .from('profiles')
          .update({ 
            credits: (profile.credits as number) + video.credits_used 
          })
          .eq('user_id', video.user_id);

        // Create refund transaction record
        await supabase.from('transactions').insert({
          user_id: video.user_id,
          type: 'refund',
          credits: video.credits_used,
          description: `Refund for failed video: ${video.prompt.substring(0, 50)}...`,
          status: 'completed',
        });

        console.log(`Refunded ${video.credits_used} credits to user ${video.user_id}`);
      }
    }

    // Cleanup: Delete reference image from storage if this was image-to-video
    // We only need the image during generation, not after completion/failure
    // Use service role client to bypass RLS (works even if user is signed out)
    if (video.image_url && (dbStatus === 'completed' || dbStatus === 'failed')) {
      try {
        // Extract the file path from the public URL
        // URL format: https://{project}.supabase.co/storage/v1/object/public/images/{path}
        const url = new URL(video.image_url);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)$/);
        
        if (pathMatch && pathMatch[1]) {
          const filePath = pathMatch[1];
          
          // Use service role client to delete - bypasses RLS and works regardless of user session
          const serviceClient = createServiceRoleClient();
          const { error: deleteError } = await serviceClient.storage
            .from('images')
            .remove([filePath]);

          if (deleteError) {
            console.error('Failed to delete reference image:', deleteError);
          } else {
            console.log(`Successfully deleted reference image: ${filePath}`);
          }
        }
      } catch (error) {
        console.error('Error parsing image URL for cleanup:', error);
      }
    }

    console.log(`Video ${video.id} updated to status: ${dbStatus}`);

    return NextResponse.json({ 
      success: true,
      message: 'Callback processed successfully' 
    });

  } catch (error) {
    console.error('Error processing video callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
