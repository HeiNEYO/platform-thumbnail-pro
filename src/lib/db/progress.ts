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

export type ModuleProgressStat = {
  moduleId: string;
  moduleTitle: string;
  completed: number;
  total: number;
  percent: number;
};

/** Côté serveur : stats par module pour graphiques */
export async function getProgressByModule(userId: string): Promise<ModuleProgressStat[]> {
  const supabase = await createClient();
  const { data: modulesData } = await supabase
    .from("modules")
    .select("id, title")
    .order("order_index", { ascending: true });
  const modules = (modulesData ?? []) as { id: string; title: string }[];
  const result: ModuleProgressStat[] = [];
  for (const m of modules) {
    const { count: total } = await supabase
      .from("episodes")
      .select("*", { count: "exact", head: true })
      .eq("module_id", m.id);
    const { data: episodeRows } = await supabase
      .from("episodes")
      .select("id")
      .eq("module_id", m.id);
    const episodeIds = (episodeRows ?? []).map((e: { id: string }) => e.id);
    let completed = 0;
    if (episodeIds.length > 0) {
      const { count } = await supabase
        .from("progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("episode_id", episodeIds);
      completed = count ?? 0;
    }
    const totalNum = total ?? 0;
    result.push({
      moduleId: m.id,
      moduleTitle: m.title,
      completed,
      total: totalNum,
      percent: totalNum ? Math.round((completed / totalNum) * 100) : 0,
    });
  }
  return result;
}
