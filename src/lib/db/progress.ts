import { createClient } from "@/lib/supabase/server";
import type { ProgressRow } from "@/lib/supabase/database.types";

/** Côté serveur : toute la progression d'un user */
export async function getUserProgress(
  userId: string
): Promise<ProgressRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId);
  if (error) return [];
  return data ?? [];
}

/** Côté serveur : % total formation */
export async function getGlobalProgress(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count: totalEpisodes, error: errEpisodes } = await supabase
    .from("episodes")
    .select("*", { count: "exact", head: true });
  if (errEpisodes || !totalEpisodes) return 0;
  const { count: completed, error: errProgress } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (errProgress) return 0;
  return Math.round(((completed ?? 0) / totalEpisodes) * 100);
}
