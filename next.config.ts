import type { NextConfig } from "next";

// Validates every SAT form and THROWS on a blueprint violation. It lives here
// on purpose: next.config.ts is the one module Node always evaluates, for both
// `next build` and `next dev`. Importing the registry from a page instead does
// NOT gate the build - client-component modules are loaded lazily on first
// render, and AuthGate keeps /sat from rendering during prerender, so the
// check would silently never run. This repo has no test suite; this is it.
import "./lib/sat/forms";

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
