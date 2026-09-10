import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth-server";
import { passwordProblem, requiresCurrentPassword } from "@/lib/password-policy";

export const dynamic = "force-dynamic";

/** Does this account have a password at all? Drives which form the profile shows. */
export async function GET() {
  const p = db();
  if (!p) return NextResponse.json({ error: "Accounts are not available on this build." }, { status: 503 });
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  try {
    await ensureSchema(p);
    const { rows } = await p.query("select password_hash from users where id = $1", [session.id]);
    const hasPassword = Boolean(rows[0]?.password_hash);
    return NextResponse.json({
      hasPassword,
      provider: session.provider,
      needsCurrent: requiresCurrentPassword({ hasPassword, provider: session.provider }),
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Lookup failed." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const p = db();
  if (!p) return NextResponse.json({ error: "Accounts are not available on this build." }, { status: 503 });

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");

  const problem = passwordProblem(newPassword);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  try {
    await ensureSchema(p);
    const { rows } = await p.query("select password_hash from users where id = $1", [session.id]);
    if (!rows[0]) return NextResponse.json({ error: "Account not found." }, { status: 404 });

    const existing: string | null = rows[0].password_hash;
    const hasPassword = Boolean(existing);

    if (requiresCurrentPassword({ hasPassword, provider: session.provider })) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
      }
      if (!(await verifyPassword(currentPassword, existing!))) {
        return NextResponse.json({ error: "Your current password is incorrect." }, { status: 401 });
      }
    }

    if (hasPassword && (await verifyPassword(newPassword, existing!))) {
      return NextResponse.json({ error: "That is already your password." }, { status: 400 });
    }

    await p.query("update users set password_hash = $1 where id = $2", [await hashPassword(newPassword), session.id]);
    return NextResponse.json({ ok: true, hadPassword: hasPassword });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not update the password." }, { status: 500 });
  }
}
