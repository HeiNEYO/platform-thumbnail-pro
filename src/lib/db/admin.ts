import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/lib/supabase/database.types";

export interface UserWithStats extends UserRow {
  completed_episodes?: number;
  total_episodes?: number;
  progress_percent?: number;
  last_login?: string | null;
}

export async function getAllUsers(): Promise<UserWithStats[]> {
  const supabase = await createClient();
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  if (usersError || !users?.length) return [];

  const { count: totalEpisodes } = await supabase
    .from("episodes")
    .select("*", { count: "exact", head: true });

  const result: UserWithStats[] = [];
  for (const u of users) {
    if (u.role !== "member") continue;
    const { count: completed } = await supabase
      .from("progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", u.id);
    const total = totalEpisodes ?? 0;
    const progressPercent = total ? Math.round(((completed ?? 0) / total) * 100) : 0;
    result.push({
      ...u,
      completed_episodes: completed ?? 0,
      total_episodes: total,
      progress_percent: progressPercent,
    });
  }
  return result;
}

export async function getUserStats(userId: string): Promise<{
  completedEpisodes: number;
  totalEpisodes: number;
  progressPercent: number;
  byModule: { moduleId: string; completed: number; total: number; percent: number }[];
}> {
  const supabase = await createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select("id")
    .order("order_index");
  const { count: totalEpisodes } = await supabase
    .from("episodes")
    .select("*", { count: "exact", head: true });
  const { count: completedTotal } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const byModule: { moduleId: string; completed: number; total: number; percent: number }[] = [];
  for (const m of modules ?? []) {
    const { count: modTotal } = await supabase
      .from("episodes")
      .select("*", { count: "exact", head: true })
      .eq("module_id", m.id);
    const { count: modCompleted } = await supabase
      .from("progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in(
        "episode_id",
        (
          await supabase.from("episodes").select("id").eq("module_id", m.id)
        ).data?.map((e) => e.id) ?? []
      );
    const total = modTotal ?? 0;
    const completed = modCompleted ?? 0;
    byModule.push({
      moduleId: m.id,
      completed,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
    });
  }

  return {
    completedEpisodes: completedTotal ?? 0,
    totalEpisodes: totalEpisodes ?? 0,
    progressPercent: totalEpisodes
      ? Math.round(((completedTotal ?? 0) / totalEpisodes) * 100)
      : 0,
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
