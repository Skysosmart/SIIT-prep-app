import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { hashPassword, createSession, EMAIL_RE } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const p = db();
  if (!p) return NextResponse.json({ error: "Accounts are not available on this build." }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const name = String(body.name ?? "").trim().slice(0, 40);
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (name.length < 2) return NextResponse.json({ error: "Please enter your name (at least 2 characters)." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

  try {
    await ensureSchema(p);
    const exists = await p.query("select 1 from users where email = $1", [email]);
    if (exists.rowCount) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

    const hash = await hashPassword(password);
    const { rows } = await p.query(
      "insert into users (email, name, password_hash, provider) values ($1, $2, $3, 'email') returning id",
      [email, name, hash],
    );
    await createSession({ id: rows[0].id, email, name, provider: "email" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Sign-up failed." }, { status: 500 });
  }
}
