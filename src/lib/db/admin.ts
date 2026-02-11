import { createClient } from "@/lib/supabase/server";
import type { UserRow, ModuleRow } from "@/lib/supabase/database.types";

export interface UserWithStats extends UserRow {
  completed_episodes?: number;
  total_episodes?: number;
  progress_percent?: number;
  last_login?: string | null;
}

export async function getAllUsers(): Promise<UserWithStats[]> {
  const supabase = await createClient();
  const [
    { data: usersData, error: usersError },
    { count: totalEpisodes },
    { data: progressData },
  ] = await Promise.all([
    supabase.from("users").select("*").order("created_at", { ascending: false }),
    supabase.from("episodes").select("*", { count: "exact", head: true }),
    supabase.from("progress").select("user_id"),
  ]);
  const users = (usersData ?? []) as UserRow[];
  if (usersError || !users.length) return [];

  const total = totalEpisodes ?? 0;
  const completedByUser = new Map<string, number>();
  for (const p of progressData ?? []) {
    const uid = (p as { user_id: string }).user_id;
    completedByUser.set(uid, (completedByUser.get(uid) ?? 0) + 1);
  }

  return users
    .filter((u) => u.role === "member")
    .map((u) => {
      const completed = completedByUser.get(u.id) ?? 0;
      return {
        ...u,
        completed_episodes: completed,
        total_episodes: total,
        progress_percent: total ? Math.round((completed / total) * 100) : 0,
      };
    });
}

export async function getUserStats(userId: string): Promise<{
  completedEpisodes: number;
  totalEpisodes: number;
  progressPercent: number;
  byModule: { moduleId: string; completed: number; total: number; percent: number }[];
}> {
  const supabase = await createClient();
  const [
    { data: modulesData },
    { data: episodesData },
    { data: progressData },
  ] = await Promise.all([
    supabase.from("modules").select("id").order("order_index"),
    supabase.from("episodes").select("id, module_id"),
    supabase.from("progress").select("episode_id").eq("user_id", userId),
  ]);
  const modules = (modulesData ?? []) as Pick<ModuleRow, "id">[];
  const episodes = (episodesData ?? []) as { id: string; module_id: string }[];
  const completedSet = new Set((progressData ?? []).map((p: { episode_id: string }) => p.episode_id));

  const episodesByModule = new Map<string, string[]>();
  for (const ep of episodes) {
    const arr = episodesByModule.get(ep.module_id) ?? [];
    arr.push(ep.id);
    episodesByModule.set(ep.module_id, arr);
  }

  const totalEpisodes = episodes.length;
  const completedTotal = completedSet.size;
  const byModule = modules.map((m) => {
    const episodeIds = episodesByModule.get(m.id) ?? [];
    const total = episodeIds.length;
    const completed = episodeIds.filter((id) => completedSet.has(id)).length;
    return {
      moduleId: m.id,
      completed,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  });

  return {
    completedEpisodes: completedTotal,
    totalEpisodes,
    progressPercent: totalEpisodes ? Math.round((completedTotal / totalEpisodes) * 100) : 0,
    byModule,
  };
}

export async function getUserActivity(
  userId: string
): Promise<{ completed_at: string; episode_id: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("completed_at, episode_id")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(50);
  if (error) return [];
  return data ?? [];
}

export async function getGlobalStats(): Promise<{
  totalUsers: number;
  avgCompletionPercent: number;
  activeThisWeek: number;
  newThisMonth: number;
}> {
  const supabase = await createClient();
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "member");
  const users = await getAllUsers();
  const avgCompletionPercent =
    users.length > 0
      ? Math.round(
          users.reduce((a, u) => a + (u.progress_percent ?? 0), 0) / users.length
        )
      : 0;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: updated } = await supabase
    .from("users")
    .select("id")
    .gte("updated_at", weekAgo);
  const { data: created } = await supabase
    .from("users")
    .select("id")
    .eq("role", "member")
    .gte("created_at", monthAgo);
  return {
    totalUsers: totalUsers ?? 0,
    avgCompletionPercent,
    activeThisWeek: updated?.length ?? 0,
    newThisMonth: created?.length ?? 0,
  };
}
