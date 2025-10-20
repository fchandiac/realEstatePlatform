import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore ESLint errors during `next build` to allow compiling while
  // we address linter/type issues incrementally.
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* other config options here */
};

export default nextConfig;
