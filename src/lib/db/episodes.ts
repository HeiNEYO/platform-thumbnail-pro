import { createClient } from "@/lib/supabase/server";
import type { EpisodeRow } from "@/lib/supabase/database.types";

export async function getEpisodesByModule(
  moduleId: string
): Promise<EpisodeRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("episodes")
      .select("*")
      .eq("module_id", moduleId)
      .order("order_index", { ascending: true });
    
    if (error) {
      console.error(`Erreur lors de la récupération des épisodes pour le module ${moduleId}:`, error);
      return [];
    }
    
    return data ?? [];
  } catch (err) {
    console.error(`Erreur dans getEpisodesByModule pour le module ${moduleId}:`, err);
    return [];
  }
}

export async function getEpisodeById(
  id: string
): Promise<EpisodeRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("episodes")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") return null;
      console.error("Erreur lors de la récupération de l'épisode:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Erreur dans getEpisodeById:", err);
    return null;
  }
}

export async function isEpisodeCompleted(
  userId: string,
  episodeId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("progress")
      .select("episode_id")
      .eq("user_id", userId)
      .eq("episode_id", episodeId)
      .maybeSingle();
    return !!data;
  } catch (err) {
    console.error("Erreur dans isEpisodeCompleted:", err);
    return false;
  }
}
