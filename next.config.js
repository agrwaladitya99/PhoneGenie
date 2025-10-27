/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Production optimizations
  output: 'standalone',
  
  // Allow build to complete even without all env vars
  // The API key is only needed at runtime, not build time
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  },
  
  // Optimize for build performance
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Compress responses
  compress: true,
  
  // Optimize production builds
  productionBrowserSourceMaps: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Experimental features for better performance
  experimental: {
    // optimizeCss: true, // Requires critters package - disabled to avoid build errors
    optimizePackageImports: ['lucide-react'],
  },
  
  // HTTP headers for caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig


