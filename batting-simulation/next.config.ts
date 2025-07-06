import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, context) => {
      config.watchOptions = {
          poll: 10,
          aggregateTimeout: 3
      }
      return config
  },
};

export default nextConfig;
