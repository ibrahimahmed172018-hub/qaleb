import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  },
};

export default nextConfig;
