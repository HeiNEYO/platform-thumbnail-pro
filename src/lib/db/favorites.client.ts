"use client";

import { createClient } from "@/lib/supabase/client";
import type { FavoriteRow } from "@/lib/supabase/database.types";

export async function getFavoritesClient(userId: string): Promise<FavoriteRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as FavoriteRow[];
}

export async function addFavoriteEpisode(userId: string, episodeId: string): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("favorites").insert({
    user_id: userId,
    item_type: "episode",
    episode_id: episodeId,
    resource_id: null,
  } as never);
  return { error: error as unknown as Error };
}

export async function addFavoriteResource(userId: string, resourceId: string): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("favorites").insert({
    user_id: userId,
    item_type: "resource",
    episode_id: null,
    resource_id: resourceId,
  } as never);
  return { error: error as unknown as Error };
}

export async function removeFavorite(favoriteId: string): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
  return { error: error as unknown as Error };
}

export async function removeFavoriteByItem(
  userId: string,
  itemType: "episode" | "resource",
  itemId: string
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const col = itemType === "episode" ? "episode_id" : "resource_id";
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq(col, itemId);
  return { error: error as unknown as Error };
}

export async function isFavoriteEpisode(userId: string, episodeId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("item_type", "episode")
    .eq("episode_id", episodeId)
    .maybeSingle();
  return !!data;
}

export async function isFavoriteResource(userId: string, resourceId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("item_type", "resource")
    .eq("resource_id", resourceId)
    .maybeSingle();
  return !!data;
}
