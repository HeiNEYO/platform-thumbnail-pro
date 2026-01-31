import { createClient } from "@/lib/supabase/client";

/** Côté client : % total formation (pour sidebar, etc.) */
export async function getGlobalProgressClient(
  userId: string
): Promise<number> {
  const supabase = createClient();
  const { count: totalEpisodes } = await supabase
    .from("episodes")
    .select("*", { count: "exact", head: true });
  if (!totalEpisodes) return 0;
  const { count: completed } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  return Math.round(((completed ?? 0) / totalEpisodes) * 100);
}

/** Côté client : marquer un épisode comme terminé */
export async function markEpisodeComplete(
  userId: string,
  episodeId: string
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const payload = {
    user_id: userId,
    episode_id: episodeId,
    completed_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("progress").upsert(payload as never, {
    onConflict: "user_id,episode_id",
  });
  return { error: error as unknown as Error };
}

/** Côté client : annuler la complétion */
export async function markEpisodeIncomplete(
  userId: string,
  episodeId: string
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("progress")
    .delete()
    .eq("user_id", userId)
    .eq("episode_id", episodeId);
  return { error: error as unknown as Error };
}
