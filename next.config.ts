import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "http://localhost:3000",
        "https://jubilant-waddle-7vj79w57p99r2xpgr-3000.app.github.dev",
      ],
    },
  },
};

export default nextConfig;
