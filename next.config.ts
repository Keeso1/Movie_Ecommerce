import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://image.tmdb.org/**")],
  },
  reactCompiler: true,
};

export default nextConfig;
