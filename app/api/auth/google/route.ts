import { NextResponse } from "next/server";
import { googleConfigured } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

/** Redirect the user to Google's consent screen. */
export async function GET(req: Request) {
  if (!googleConfigured()) {
    return NextResponse.json({ error: "Google sign-in is not configured." }, { status: 503 });
  }
  const origin = new URL(req.url).origin;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
  });
  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
