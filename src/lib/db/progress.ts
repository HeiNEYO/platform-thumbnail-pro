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

/** Côté serveur : stats par module pour graphiques (optimisé, pas de N+1) */
export async function getProgressByModule(userId: string): Promise<ModuleProgressStat[]> {
  const supabase = await createClient();
  const [
    { data: modulesData },
    { data: episodesData },
    { data: progressData },
  ] = await Promise.all([
    supabase.from("modules").select("id, title").order("order_index", { ascending: true }),
    supabase.from("episodes").select("id, module_id"),
    supabase.from("progress").select("episode_id").eq("user_id", userId),
  ]);
  const modules = (modulesData ?? []) as { id: string; title: string }[];
  const episodes = (episodesData ?? []) as { id: string; module_id: string }[];
  const completedSet = new Set(
    (progressData ?? []).map((p: { episode_id: string }) => p.episode_id)
  );
  const episodesByModule = new Map<string, { id: string }[]>();
  for (const ep of episodes) {
    const arr = episodesByModule.get(ep.module_id) ?? [];
    arr.push({ id: ep.id });
    episodesByModule.set(ep.module_id, arr);
  }
  return modules.map((m) => {
    const episodeIds = episodesByModule.get(m.id) ?? [];
    const total = episodeIds.length;
    const completed = episodeIds.filter((e) => completedSet.has(e.id)).length;
    return {
      moduleId: m.id,
      moduleTitle: m.title,
      completed,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  });
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

/** Derniers épisodes complétés avec titres (optimisé, pas de N+1) */
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
  const prog = progressData as { episode_id: string; completed_at: string }[];
  const episodeIds = [...new Set(prog.map((p) => p.episode_id))];
  const { data: episodesData } = await supabase
    .from("episodes")
    .select("id, title, module_id")
    .in("id", episodeIds);
  const episodes = (episodesData ?? []) as { id: string; title: string; module_id: string }[];
  const moduleIds = [...new Set(episodes.map((e) => e.module_id))];
  const { data: modulesData } = await supabase
    .from("modules")
    .select("id, title")
    .in("id", moduleIds);
  const modules = (modulesData ?? []) as { id: string; title: string }[];
  const modMap = new Map(modules.map((m) => [m.id, m.title]));
  const epMap = new Map(episodes.map((e) => [e.id, e]));
  return prog
    .map((p) => {
      const ep = epMap.get(p.episode_id);
      if (!ep) return null;
      return {
        episode_id: p.episode_id,
        episode_title: ep.title,
        module_title: modMap.get(ep.module_id) ?? "Module",
        completed_at: p.completed_at,
      };
    })
    .filter((x): x is RecentActivityItem => x !== null);
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

/** Prochain épisode à regarder (premier non complété dans l'ordre, optimisé) */
export async function getNextEpisode(userId: string): Promise<NextEpisodeItem | null> {
  const supabase = await createClient();
  const [
    { data: episodes },
    { data: progress },
    { data: modules },
  ] = await Promise.all([
    supabase.from("episodes").select("id, title, module_id, order_index").order("order_index", { ascending: true }),
    supabase.from("progress").select("episode_id").eq("user_id", userId),
    supabase.from("modules").select("id, title"),
  ]);
  const completed = new Set((progress ?? []).map((p: { episode_id: string }) => p.episode_id));
  const modMap = new Map((modules ?? []).map((m: { id: string; title: string }) => [m.id, m.title]));
  for (const ep of episodes ?? []) {
    const e = ep as { id: string; title: string; module_id: string };
    if (!completed.has(e.id)) {
      return {
        episode_id: e.id,
        episode_title: e.title,
        module_id: e.module_id,
        module_title: modMap.get(e.module_id) ?? "Module",
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

/** Grille d'activité type GitHub : jours x semaines, count par jour (pour heatmap) */
export async function getActivityHeatmap(
  userId: string,
  weeks = 14
): Promise<{ date: string; count: number }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("completed_at")
    .eq("user_id", userId);
  const byDay = new Map<string, number>();
  const totalDays = weeks * 7;
  const today = new Date();
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  if (!error && data?.length) {
    for (const p of data as { completed_at: string }[]) {
      const day = p.completed_at.slice(0, 10);
      if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }
  }
  return Array.from(byDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));
}
