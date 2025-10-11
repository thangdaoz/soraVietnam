import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pjgwpksoqubtzfsetjbu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZ3dwa3NvcXVidHpmc2V0amJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTgxMjk3NCwiZXhwIjoyMDc1Mzg4OTc0fQ.B_XhttP472wE8gY6EK8LtxdpYgWhl1TUfbg3xe_Mzwo'
);

async function showPricing() {
  const { data, error } = await supabase
    .from('video_pricing')
    .select('*')
    .order('video_type')
    .order('duration_seconds')
    .order('resolution');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n=== CURRENT VIDEO PRICING ===\n');
  data.forEach(p => {
    console.log(`${p.video_type.padEnd(16)} | ${String(p.duration_seconds).padEnd(2)}s | ${p.resolution.padEnd(10)} | ${p.quality.padEnd(8)} = ${p.credits_cost.toLocaleString().padStart(8)} credits`);
  });
  console.log('\n');
}

showPricing();
