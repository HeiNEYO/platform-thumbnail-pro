import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnnouncements } from "@/lib/db/announcements";
import type { Database } from "@/lib/supabase/database.types";

type AnnouncementInsert = Database["public"]["Tables"]["announcements"]["Insert"];

export async function GET() {
  try {
    const announcements = await getAnnouncements(50);
    return NextResponse.json(announcements);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 };
  const { data: row } = await supabase.from("users").select("role").eq("id", user.id).single();
  const role = (row as { role?: string } | null)?.role;
  if (role !== "admin") return { ok: false as const, status: 403 };
  return { ok: true as const, supabase };
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Non autorisé" }, { status: auth.status });
  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const is_important = Boolean(body.is_important);
    if (!title || !content) {
      return NextResponse.json({ error: "Titre et contenu requis" }, { status: 400 });
    }
    const row: AnnouncementInsert = { title, content, is_important };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await auth.supabase
      .from("announcements")
      .insert(row as any)
      .select("id, title, content, created_at, is_important, updated_at")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
