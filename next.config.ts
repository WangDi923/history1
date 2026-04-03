import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.app.github.dev"],
    },
  },
  images: {
    domains: ["upload.wikimedia.org"],
  },
};

export default nextConfig;
