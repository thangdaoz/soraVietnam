// Check users in database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pjgwpksoqubtzfsetjbu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZ3dwa3NvcXVidHpmc2V0amJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTgxMjk3NCwiZXhwIjoyMDc1Mzg4OTc0fQ.B_XhttP472wE8gY6EK8LtxdpYgWhl1TUfbg3xe_Mzwo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking database...\n');
  
  // Check users
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('user_id, full_name, credits, total_videos_generated')
    .limit(5);
  
  if (usersError) {
    console.error('❌ Error fetching users:', usersError);
  } else {
    console.log(`👥 Users (${users?.length || 0}):`);
    users?.forEach(user => {
      console.log(`  - ID: ${user.user_id.substring(0, 8)}... Name: ${user.full_name || 'N/A'}: ${user.credits} credits, ${user.total_videos_generated} videos`);
    });
  }
  
  // Check videos
  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select('id, status, prompt, created_at')
    .limit(5);
  
  if (videosError) {
    console.error('\n❌ Error fetching videos:', videosError);
  } else {
    console.log(`\n🎥 Videos (${videos?.length || 0}):`);
    if (videos && videos.length > 0) {
      videos.forEach(video => {
        console.log(`  - ${video.status}: ${video.prompt.substring(0, 50)}...`);
      });
    } else {
      console.log('  No videos found');
    }
  }
  
  // Check transactions
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('type, credits, description, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (txError) {
    console.error('\n❌ Error fetching transactions:', txError);
  } else {
    console.log(`\n💰 Recent Transactions (${transactions?.length || 0}):`);
    if (transactions && transactions.length > 0) {
      transactions.forEach(tx => {
        console.log(`  - ${tx.type}: ${tx.credits} credits - ${tx.description}`);
      });
    } else {
      console.log('  No transactions found');
    }
  }
}

checkDatabase();
