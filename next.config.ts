import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-actual-image-cdn.com", // TODO: Replace with actual image CDN domain
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
