import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thwztchapter.dramaboxdb.com',
      },
      {
        protocol: 'https',
        hostname: 'hwztchapter.dramaboxdb.com',
      },
      {
        protocol: 'https',
        hostname: 'dramaboxdb.com',
      },
    ],
  },
};

export default nextConfig;
