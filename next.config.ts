import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  async rewrites() {
    return [
      {
        source: "/esoteric",
        destination: "/esoteric.html",
      },
    ];
  },
};

export default nextConfig;
