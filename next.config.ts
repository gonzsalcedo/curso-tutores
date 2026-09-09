import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
