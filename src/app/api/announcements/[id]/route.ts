import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 };
  const { data: row } = await supabase.from("users").select("role").eq("id", user.id).single();
  const role = (row as { role?: string } | null)?.role;
  if (role !== "admin") return { ok: false as const, status: 403 };
  return { ok: true as const, supabase };
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Non autorisé" }, { status: auth.status });
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
  const { error } = await auth.supabase.from("announcements").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
