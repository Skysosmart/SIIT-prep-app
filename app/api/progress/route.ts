import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

/** Read the logged-in user's saved profile. */
export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const p = db();
  if (!p) return NextResponse.json({ error: "Storage unavailable." }, { status: 503 });
  try {
    await ensureSchema(p);
    const { rows } = await p.query("select data from profiles where user_id = $1", [user.id]);
    return NextResponse.json({ data: rows[0]?.data ?? null });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Read failed." }, { status: 500 });
  }
}

/** Upsert the logged-in user's profile (whole-object save). */
export async function PUT(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const p = db();
  if (!p) return NextResponse.json({ error: "Storage unavailable." }, { status: 503 });

  let data: unknown;
  try { data = (await req.json())?.data; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof data !== "object" || data === null) return NextResponse.json({ error: "Invalid profile." }, { status: 400 });

  try {
    await ensureSchema(p);
    await p.query(
      `insert into profiles (user_id, data, updated_at) values ($1, $2, now())
       on conflict (user_id) do update set data = excluded.data, updated_at = now()`,
      [user.id, JSON.stringify(data)],
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Save failed." }, { status: 500 });
  }
}
