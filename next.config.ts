import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "example.com",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
