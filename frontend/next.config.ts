import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore ESLint errors during `next build` to allow compiling while
  // we address linter/type issues incrementally.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable standalone output for production deployments
  output: 'standalone',
  // Increase server actions body size limit for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  /* other config options here */
};

export default nextConfig;
