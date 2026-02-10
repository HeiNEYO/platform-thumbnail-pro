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

/** Série de jours consécutifs avec au moins un épisode complété */
export async function getStreak(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });
  if (error || !data?.length) return 0;
  const uniqueDays = new Set(
    data.map((p) => (p as { completed_at: string }).completed_at.slice(0, 10))
  );
  const sorted = Array.from(uniqueDays).sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  if (sorted[0] !== today && sorted[0] !== getYesterday()) return 0;
  let streak = 0;
  let expected = today;
  for (const d of sorted) {
    if (d === expected) {
      streak++;
      expected = addDays(d, -1);
    } else if (d < expected) break;
  }
  return streak;
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export type RecentActivityItem = {
  episode_id: string;
  episode_title: string;
  module_title: string;
  completed_at: string;
};

/** Derniers épisodes complétés avec titres */
export async function getRecentActivity(
  userId: string,
  limit = 8
): Promise<RecentActivityItem[]> {
  const supabase = await createClient();
  const { data: progressData, error } = await supabase
    .from("progress")
    .select("episode_id, completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(limit);
  if (error || !progressData?.length) return [];
  const items: RecentActivityItem[] = [];
  for (const p of progressData as { episode_id: string; completed_at: string }[]) {
    const { data: ep } = await supabase
      .from("episodes")
      .select("id, title, module_id")
      .eq("id", p.episode_id)
      .single();
    if (!ep) continue;
    const { data: mod } = await supabase
      .from("modules")
      .select("title")
      .eq("id", (ep as { module_id: string }).module_id)
      .single();
    items.push({
      episode_id: p.episode_id,
      episode_title: (ep as { title: string }).title,
      module_title: (mod as { title: string } | null)?.title ?? "Module",
      completed_at: p.completed_at,
    });
  }
  return items;
}

/** Temps total estimé (durée des épisodes complétés) en minutes */
export async function getTotalTimeWatched(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data: progressData } = await supabase
    .from("progress")
    .select("episode_id")
    .eq("user_id", userId);
  if (!progressData?.length) return 0;
  const ids = (progressData as { episode_id: string }[]).map((p) => p.episode_id);
  const { data: episodes } = await supabase
    .from("episodes")
    .select("duration")
    .in("id", ids);
  let totalMin = 0;
  for (const ep of episodes ?? []) {
    const d = (ep as { duration: string | null }).duration;
    if (!d) continue;
    const parts = d.split(":").map(Number);
    if (parts.length === 2) totalMin += parts[0] * 60 + parts[1];
    else if (parts.length === 3) totalMin += parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return totalMin;
}

export type NextEpisodeItem = {
  episode_id: string;
  episode_title: string;
  module_id: string;
  module_title: string;
};

/** Prochain épisode à regarder (premier non complété dans l'ordre) */
export async function getNextEpisode(userId: string): Promise<NextEpisodeItem | null> {
  const supabase = await createClient();
  const { data: episodes } = await supabase
    .from("episodes")
    .select("id, title, module_id, order_index")
    .order("order_index", { ascending: true });
  const { data: progress } = await supabase
    .from("progress")
    .select("episode_id")
    .eq("user_id", userId);
  const completed = new Set(
    (progress ?? []).map((p: { episode_id: string }) => p.episode_id)
  );
  for (const ep of episodes ?? []) {
    const e = ep as { id: string; title: string; module_id: string };
    if (!completed.has(e.id)) {
      const { data: mod } = await supabase
        .from("modules")
        .select("title")
        .eq("id", e.module_id)
        .single();
      return {
        episode_id: e.id,
        episode_title: e.title,
        module_id: e.module_id,
        module_title: (mod as { title: string } | null)?.title ?? "Module",
      };
    }
  }
  return null;
}

/** Activité par jour sur les 7 derniers jours (pour graphique) */
export async function getWeeklyActivity(
  userId: string
): Promise<{ date: string; count: number }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("completed_at")
    .eq("user_id", userId);
  if (error || !data?.length) {
    const days: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ date: d.toISOString().slice(0, 10), count: 0 });
    }
    return days;
  }
  const byDay = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const p of data as { completed_at: string }[]) {
    const day = p.completed_at.slice(0, 10);
    if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  return Array.from(byDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));
}
