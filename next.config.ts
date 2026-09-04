import type { NextConfig } from "next";

// Static export for GitHub Pages at https://<user>.github.io/SIIT-prep-app/
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NODE_ENV === "production" ? "/SIIT-prep-app" : "",
  images: { unoptimized: true },
};

export default nextConfig;
