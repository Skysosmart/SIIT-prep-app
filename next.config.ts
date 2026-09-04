import type { NextConfig } from "next";

// Static export that deploys two ways:
// - GitHub Pages (workflow sets GITHUB_PAGES=true): served under /SIIT-prep-app
// - Vercel or any root domain: no basePath
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.GITHUB_PAGES === "true" ? "/SIIT-prep-app" : "",
  images: { unoptimized: true },
};

export default nextConfig;
