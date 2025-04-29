import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily ignore TypeScript errors during development
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
