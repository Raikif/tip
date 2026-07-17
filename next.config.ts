import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: true,
  reactCompiler: true,
  allowedDevOrigins: ['192.168.1.15'],
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/a/**")],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;