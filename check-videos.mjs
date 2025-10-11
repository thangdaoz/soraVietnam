// Check videos in database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pjgwpksoqubtzfsetjbu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZ3dwa3NvcXVidHpmc2V0amJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTgxMjk3NCwiZXhwIjoyMDc1Mzg4OTc0fQ.B_XhttP472wE8gY6EK8LtxdpYgWhl1TUfbg3xe_Mzwo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVideos() {
  console.log('🔍 Checking videos in database...\n');
  
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('❌ Error fetching videos:', error);
    return;
  }
  
  if (!videos || videos.length === 0) {
    console.log('📭 No videos found in database');
    return;
  }
  
  console.log(`📊 Found ${videos.length} videos:\n`);
  
  videos.forEach((video, index) => {
    console.log(`\n--- Video ${index + 1} ---`);
    console.log('ID:', video.id);
    console.log('User ID:', video.user_id);
    console.log('Prompt:', video.prompt.substring(0, 80) + '...');
    console.log('Status:', video.status);
    console.log('Video URL:', video.video_url || 'null');
    console.log('External Job ID:', video.external_job_id);
    console.log('Progress:', video.progress_percentage + '%');
    console.log('Credits Used:', video.credits_used);
    console.log('Created:', video.created_at);
    console.log('Deleted:', video.deleted_at || 'No');
  });
}

checkVideos();
