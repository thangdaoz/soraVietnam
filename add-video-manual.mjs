// Manually add video to database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pjgwpksoqubtzfsetjbu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZ3dwa3NvcXVidHpmc2V0amJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTgxMjk3NCwiZXhwIjoyMDc1Mzg4OTc0fQ.B_XhttP472wE8gY6EK8LtxdpYgWhl1TUfbg3xe_Mzwo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addVideoManually() {
  console.log('📹 Adding video to database manually...\n');
  
  // Your video details
  const userId = '7d0db514-1fba-4678-b0ae-d383b529ab76'; // User with 100k credits
  const prompt = 'tạo cho tôi video 1 con chó ở sau vườn của một ngôi ở nhà miền quê việt nam con chó đang bị gió từ cơn bão cuốn dần dần lên video này được quay từ camera';
  const videoUrl = 'https://tempfile.aiquickdraw.com/f/f826930313f43b95efd5d69f98ac4425/a5ab88e5-15a9-47ab-800b-86738be41736.mp4';
  const externalJobId = 'manual-import-' + Date.now(); // Fake job ID
  
  // Insert video
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .insert({
      user_id: userId,
      prompt: prompt,
      type: 'text_to_video',
      status: 'completed',
      progress_percentage: 100,
      video_url: videoUrl,
      credits_used: 100,
      external_job_id: externalJobId,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (videoError) {
    console.error('❌ Error adding video:', videoError);
    return;
  }
  
  console.log('✅ Video added successfully!');
  console.log('Video ID:', video.id);
  console.log('Status:', video.status);
  console.log('URL:', video.video_url);
  
  // Create transaction record
  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'video_deduction',
      credits: -100,
      description: `Video generation: ${prompt.substring(0, 50)}...`,
      status: 'completed',
    });
  
  if (txError) {
    console.error('⚠️  Warning: Could not create transaction:', txError);
  } else {
    console.log('✅ Transaction record created');
  }
  
  console.log('\n🎉 Done! Refresh your dashboard to see the video.');
}

addVideoManually();
