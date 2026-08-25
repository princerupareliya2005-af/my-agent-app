import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.216.112.190', 'localhost', '127.0.0.1'],
  experimental: {
    // Allows cross-origin development resources
  },
};

export default nextConfig;
