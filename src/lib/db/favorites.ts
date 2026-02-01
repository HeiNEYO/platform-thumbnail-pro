import { createClient } from "@/lib/supabase/server";
import type { FavoriteRow, EpisodeRow, ResourceRow } from "@/lib/supabase/database.types";

export type FavoriteWithDetails = FavoriteRow & {
  episode?: Pick<EpisodeRow, "id" | "title" | "module_id"> | null;
  resource?: Pick<ResourceRow, "id" | "title" | "category" | "type" | "url"> | null;
};

export async function getFavoritesWithDetails(userId: string): Promise<FavoriteWithDetails[]> {
  const supabase = await createClient();
  const { data: favs, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];

  const list = (favs ?? []) as FavoriteRow[];
  const result: FavoriteWithDetails[] = [];
  for (const f of list) {
    const item: FavoriteWithDetails = { ...f, episode: null, resource: null };
    if (f.item_type === "episode" && f.episode_id) {
      const { data: ep } = await supabase
        .from("episodes")
        .select("id, title, module_id")
        .eq("id", f.episode_id)
        .single();
      item.episode = ep as FavoriteWithDetails["episode"];
    }
    if (f.item_type === "resource" && f.resource_id) {
      const { data: res } = await supabase
        .from("resources")
        .select("id, title, category, type, url")
        .eq("id", f.resource_id)
        .single();
      item.resource = res as FavoriteWithDetails["resource"];
    }
    result.push(item);
  }
  return result;
}
