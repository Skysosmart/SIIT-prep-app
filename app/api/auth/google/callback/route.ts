import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { createSession, googleConfigured } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

/** Handle Google's redirect: exchange the code, upsert the user, start a session. */
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const fail = (msg: string) => NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(msg)}`);

  if (!googleConfigured()) return fail("Google sign-in is not configured.");
  const p = db();
  if (!p) return fail("Accounts are not available.");

  const code = new URL(req.url).searchParams.get("code");
  if (!code) return fail("Google sign-in was cancelled.");

  try {
    // exchange the authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) return fail("Could not complete Google sign-in.");
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const profRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!profRes.ok) return fail("Could not read your Google profile.");
    const prof = (await profRes.json()) as { id: string; email: string; name?: string };

    await ensureSchema(p);
    const email = prof.email.toLowerCase();
    const name = (prof.name || email.split("@")[0]).slice(0, 40);

    // link by google_sub, else by email, else create
    const existing = await p.query(
      "select id, name from users where google_sub = $1 or email = $2 limit 1", [prof.id, email],
    );
    let id: string;
    if (existing.rowCount) {
      id = existing.rows[0].id;
      await p.query("update users set google_sub = $1, provider = 'google' where id = $2", [prof.id, id]);
    } else {
      const ins = await p.query(
        "insert into users (email, name, google_sub, provider) values ($1, $2, $3, 'google') returning id",
        [email, name, prof.id],
      );
      id = ins.rows[0].id;
    }
    await createSession({ id, email, name, provider: "google" });
    return NextResponse.redirect(`${origin}/dashboard`);
  } catch {
    return fail("Google sign-in failed. Please try again.");
  }
}
