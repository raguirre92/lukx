import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lukx.com.mx",
        pathname: "/wp-content/**",
      },
      {
        protocol: "http",
        hostname: "lukx.com.mx",
        pathname: "/wp-content/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
