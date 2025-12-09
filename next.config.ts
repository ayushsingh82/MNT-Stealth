import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore test files and other non-production files from thread-stream
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    // Add rule to ignore test files and other problematic files
    config.module.rules.push({
      test: /node_modules[\\/]thread-stream[\\/].*\.(test|spec|bench)\.(js|ts|mjs)$/,
      use: 'ignore-loader',
    });
    
    config.module.rules.push({
      test: /node_modules[\\/]thread-stream[\\/]test[\\/]/,
      use: 'ignore-loader',
    });
    
    config.module.rules.push({
      test: /node_modules[\\/]thread-stream[\\/].*\.(md|txt|zip|sh|LICENSE)$/,
      use: 'ignore-loader',
    });

    return config;
  },
  // Exclude problematic packages from server-side rendering
  serverExternalPackages: ['thread-stream'],
  // Add empty turbopack config to allow webpack config to work
  turbopack: {},
};

export default nextConfig;
