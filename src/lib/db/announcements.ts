import { createClient } from "@/lib/supabase/server";
import type { AnnouncementRow } from "@/lib/supabase/database.types";

export async function getAnnouncements(
  limit?: number
): Promise<AnnouncementRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  if (limit != null) query = query.limit(limit);
  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function getImportantAnnouncements(): Promise<AnnouncementRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_important", true)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}
