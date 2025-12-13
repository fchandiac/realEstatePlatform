import type { NextConfig } from "next";

const webpack = require('webpack');

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
      bodySizeLimit: '70mb',
    },
  },
  // Configure images to allow loading from backend
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/public/**',
      },
      {
        protocol: 'http',
        hostname: '72.61.6.232',
        port: '3000',
        pathname: '/public/**',
      },
      {
        protocol: 'http',
        hostname: '72.61.6.232',
        port: '3001',
        pathname: '/public/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/public/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      buffer: require.resolve('buffer'),
      util: require.resolve('util'),
      process: require.resolve('process/browser'),
    };
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: ['process'],
      })
    );
    return config;
  },
};

export default nextConfig;
