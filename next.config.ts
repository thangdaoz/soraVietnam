import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Enable experimental features
  experimental: {
    // Optimize for better performance
    optimizePackageImports: ['@supabase/supabase-js'],
  },

  // Configure image domains if needed for video thumbnails
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
