import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-actual-image-cdn.com", // replace if needed
      },
    ],
  },

  reactCompiler: true,

  //  Fix Turbopack invalid source map spam (dev only)
  experimental: {
    turbo: {
      sourceMaps: false,
    },
  },
}

export default nextConfig
