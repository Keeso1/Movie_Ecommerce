import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://image.tmdb.org/**")],
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
