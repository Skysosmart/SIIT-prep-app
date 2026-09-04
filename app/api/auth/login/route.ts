import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const p = db();
  if (!p) return NextResponse.json({ error: "Accounts are not available on this build." }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });

  try {
    await ensureSchema(p);
    const { rows } = await p.query(
      "select id, name, password_hash, provider from users where email = $1", [email],
    );
    const u = rows[0];
    // Generic message so we don't reveal whether the email exists.
    if (!u || !u.password_hash || !(await verifyPassword(password, u.password_hash))) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }
    await createSession({ id: u.id, email, name: u.name, provider: "email" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Login failed." }, { status: 500 });
  }
}
