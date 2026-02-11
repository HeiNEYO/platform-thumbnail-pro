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
  if (list.length === 0) return [];

  const episodeIds = [...new Set(list.filter((f) => f.item_type === "episode" && f.episode_id).map((f) => f.episode_id!))];
  const resourceIds = [...new Set(list.filter((f) => f.item_type === "resource" && f.resource_id).map((f) => f.resource_id!))];

  const [episodesRes, resourcesRes] = await Promise.all([
    episodeIds.length > 0
      ? supabase.from("episodes").select("id, title, module_id").in("id", episodeIds)
      : { data: [] },
    resourceIds.length > 0
      ? supabase.from("resources").select("id, title, category, type, url").in("id", resourceIds)
      : { data: [] },
  ]);

  type EpShape = Pick<EpisodeRow, "id" | "title" | "module_id">;
  type ResShape = Pick<ResourceRow, "id" | "title" | "category" | "type" | "url">;
  const episodesData = (episodesRes.data ?? []) as EpShape[];
  const resourcesData = (resourcesRes.data ?? []) as ResShape[];
  const epMap = new Map(episodesData.map((e) => [e.id, e]));
  const resMap = new Map(resourcesData.map((r) => [r.id, r]));

  return list.map((f) => ({
    ...f,
    episode: f.item_type === "episode" && f.episode_id ? (epMap.get(f.episode_id) ?? null) : null,
    resource: f.item_type === "resource" && f.resource_id ? (resMap.get(f.resource_id) ?? null) : null,
  }));
}
