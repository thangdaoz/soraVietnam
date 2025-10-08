/**
 * Test Supabase Connection
 * Run this page to verify database setup
 */

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export default async function TestSupabasePage() {
  const supabase = await createClient();

  // Test 1: Check connection
  let connectionTest = {
    success: false,
    message: '',
  };

  try {
    const { data, error } = await supabase.from('profiles').select('count');
    if (error) throw error;
    connectionTest.success = true;
    connectionTest.message = 'Connected successfully';
  } catch (error: any) {
    connectionTest.message = error.message;
  }

  // Test 2: Check authentication
  let authTest = {
    success: false,
    message: '',
    user: null as any,
  };

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    authTest.success = true;
    authTest.user = user;
    authTest.message = user ? 'User authenticated' : 'No user logged in';
  } catch (error: any) {
    authTest.message = error.message;
  }

  // Test 3: Check tables exist
  const tablesTest = {
    profiles: false,
    videos: false,
    transactions: false,
    credit_packages: false,
    video_pricing: false,
  };

  for (const table of Object.keys(tablesTest)) {
    try {
      const { error } = await supabase.from(table as any).select('count');
      if (!error) {
        tablesTest[table as keyof typeof tablesTest] = true;
      }
    } catch (error) {
      // Table doesn't exist or other error
    }
  }

  // Test 4: Check RLS is enabled
  let rlsTest = {
    enabled: false,
    message: '',
  };

  try {
    // Try to query profiles without auth (should fail if RLS is working)
    const supabaseAnon = await createClient();
    const { error } = await supabaseAnon.from('profiles').select('*');

    if (error && error.message.includes('RLS')) {
      rlsTest.enabled = true;
      rlsTest.message = 'RLS is properly configured';
    } else {
      rlsTest.message = 'RLS might not be enabled';
    }
  } catch (error: any) {
    rlsTest.message = error.message;
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Supabase Connection Test</h1>

      <div className="space-y-6">
        {/* Connection Test */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            1. Database Connection
          </h2>
          <div
            className={`flex items-center gap-2 ${connectionTest.success ? 'text-green-600' : 'text-red-600'}`}
          >
            <span className="text-2xl">
              {connectionTest.success ? '✅' : '❌'}
            </span>
            <span>{connectionTest.message}</span>
          </div>
        </div>

        {/* Auth Test */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">2. Authentication</h2>
          <div
            className={`mb-2 flex items-center gap-2 ${authTest.success ? 'text-green-600' : 'text-yellow-600'}`}
          >
            <span className="text-2xl">
              {authTest.success ? '✅' : '⚠️'}
            </span>
            <span>{authTest.message}</span>
          </div>
          {authTest.user && (
            <div className="mt-4 rounded bg-gray-100 p-4">
              <p className="text-sm">
                <strong>User ID:</strong> {authTest.user.id}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {authTest.user.email}
              </p>
            </div>
          )}
        </div>

        {/* Tables Test */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">3. Database Tables</h2>
          <div className="space-y-2">
            {Object.entries(tablesTest).map(([table, exists]) => (
              <div
                key={table}
                className={`flex items-center gap-2 ${exists ? 'text-green-600' : 'text-red-600'}`}
              >
                <span className="text-xl">{exists ? '✅' : '❌'}</span>
                <span className="font-mono">{table}</span>
              </div>
            ))}
          </div>
          {!Object.values(tablesTest).every(Boolean) && (
            <div className="mt-4 rounded bg-yellow-50 p-4 text-sm text-yellow-800">
              ⚠️ Some tables are missing. Please run the migrations from{' '}
              <code className="rounded bg-yellow-200 px-1">
                supabase/migrations/
              </code>
            </div>
          )}
        </div>

        {/* RLS Test */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            4. Row Level Security (RLS)
          </h2>
          <div
            className={`flex items-center gap-2 ${rlsTest.enabled ? 'text-green-600' : 'text-yellow-600'}`}
          >
            <span className="text-2xl">
              {rlsTest.enabled ? '✅' : '⚠️'}
            </span>
            <span>{rlsTest.message}</span>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">5. Environment Config</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}
              </span>
              <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span>
              <span className="text-gray-500">
                {process.env.NEXT_PUBLIC_SUPABASE_URL
                  ? '(configured)'
                  : '(missing)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✅' : '❌'}
              </span>
              <span className="font-mono">
                NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
              </span>
              <span className="text-gray-500">
                {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
                  ? '(configured)'
                  : '(missing)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'}
              </span>
              <span className="font-mono">SUPABASE_SERVICE_ROLE_KEY</span>
              <span className="text-gray-500">
                {process.env.SUPABASE_SERVICE_ROLE_KEY
                  ? '(configured)'
                  : '(missing)'}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-blue-900">
            📝 Next Steps
          </h2>
          <ol className="list-inside list-decimal space-y-2 text-sm text-blue-800">
            {!connectionTest.success && (
              <li>Fix database connection issues</li>
            )}
            {!Object.values(tablesTest).every(Boolean) && (
              <li>
                Apply migrations from{' '}
                <code className="rounded bg-blue-200 px-1">
                  scripts/apply-migrations.md
                </code>
              </li>
            )}
            {!rlsTest.enabled && <li>Enable RLS policies</li>}
            <li>
              Configure authentication providers in Supabase Dashboard (
              <strong>Authentication → Providers</strong>)
            </li>
            <li>Set up email templates for verification and password reset</li>
            <li>Test user registration and login flows</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/"
          className="inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
