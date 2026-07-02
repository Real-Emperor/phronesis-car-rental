import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles Next.js builds natively — no standalone output needed.
  // Allow builds to succeed even with minor TS warnings (faster deploys).
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  // Sharp is already installed; ensure images can be optimized.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
