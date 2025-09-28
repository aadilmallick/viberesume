import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverComponentsExternalPackages: ["pdf-parse"],
  ignoreBuildErrors: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
