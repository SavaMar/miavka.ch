import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
