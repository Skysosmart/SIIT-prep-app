import type { NextConfig } from "next";

// Two deployment modes from one repo:
// - GitHub Pages (workflow sets GITHUB_PAGES=true): static export under
//   /SIIT-prep-app, no API routes (the workflow strips app/api), local-only
//   leaderboard.
// - Vercel / any Node host: regular Next server with /api/scores backed by
//   Postgres (Neon) via DATABASE_URL; shared leaderboard enabled.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/SIIT-prep-app" : "";

const nextConfig: NextConfig = {
  output: isPages ? "export" : undefined,
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_HAS_API: isPages ? "" : "1",
  },
  images: { unoptimized: true },
};

export default nextConfig;
