/** @type {import('next').NextConfig} */

// Bundle analyzer for performance monitoring
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Modern image formats for better performance
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Legacy Strapi (can be removed when fully migrated)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Cloudinary CDN
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // EEMB website
      {
        protocol: 'https',
        hostname: 'www.eemb.ucsb.edu',
        pathname: '/**',
      },
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Supabase project-specific (eemb-website)
      {
        protocol: 'https',
        hostname: 'jgmrtzxxggvdilsjhzxn.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Environment variables (keeping Strapi for backward compatibility)
  env: {
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api',
  },
  // Experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
