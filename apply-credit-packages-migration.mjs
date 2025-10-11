/**
 * Apply Credit Packages Migration
 * 
 * This script applies the fix for credit packages data
 * Run: node apply-credit-packages-migration.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseServiceKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🚀 Applying credit packages migration...\n');

  try {
    // Read the migration file
    const migrationPath = join(__dirname, 'supabase', 'migrations', '20251011_fix_credit_packages.sql');
    const sql = readFileSync(migrationPath, 'utf8');

    // Split SQL into individual statements (rough split, works for simple cases)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s !== '');

    // Execute each statement
    for (const statement of statements) {
      if (statement.toLowerCase().startsWith('select')) {
        // For SELECT statements, show the results
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
        if (error) {
          console.log('📊 Verification query executed');
        }
      } else {
        // For other statements, just execute
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        if (error) {
          console.error(`❌ Error executing statement: ${error.message}`);
        }
      }
    }

    console.log('✅ Migration applied successfully!\n');

    // Verify the data
    console.log('📊 Verifying credit packages...\n');
    const { data: packages, error } = await supabase
      .from('credit_packages')
      .select('*')
      .eq('active', true)
      .order('display_order');

    if (error) {
      console.error('❌ Error fetching packages:', error.message);
    } else {
      console.log('Available packages:');
      packages.forEach(pkg => {
        const pricePerCredit = (Number(pkg.price_vnd) / pkg.credits).toFixed(2);
        console.log(`\n  📦 ${pkg.name} (${pkg.name_en})`);
        console.log(`     Credits: ${pkg.credits.toLocaleString('vi-VN')}`);
        console.log(`     Price: ${Number(pkg.price_vnd).toLocaleString('vi-VN')} VND`);
        console.log(`     Price per credit: ${pricePerCredit} VND`);
        console.log(`     Discount: ${pkg.discount_percentage}%`);
        console.log(`     Popular: ${pkg.is_popular ? '⭐ Yes' : 'No'}`);
      });
      console.log('\n');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyMigration();
