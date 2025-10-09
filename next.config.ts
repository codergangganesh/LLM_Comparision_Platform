import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable performance optimizations
  reactStrictMode: true,
  
  // Enable automatic static optimization
  poweredByHeader: false,
  
  // Enable compression
  compress: true,
  
  // Enable prefetching for faster navigation
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@supabase/ssr',
      'framer-motion'
    ]
  },
  
  // Configure webpack for better performance
  webpack: (config, { isServer }) => {
    // Reduce bundle size by excluding unnecessary modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Enable tree shaking
    config.optimization.concatenateModules = true;
    
    return config;
  }
};

export default nextConfig;
