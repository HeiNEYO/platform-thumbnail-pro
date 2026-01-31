import { createClient } from "@/lib/supabase/server";
import type { ModuleRow, EpisodeRow } from "@/lib/supabase/database.types";

export async function getModules(): Promise<ModuleRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .order("order_index", { ascending: true });
    
    if (error) {
      console.error("Erreur lors de la récupération des modules:", error);
      return [];
    }
    
    return (data ?? []) as ModuleRow[];
  } catch (err) {
    console.error("Erreur dans getModules:", err);
    return [];
  }
}

export async function getModuleById(id: string): Promise<ModuleRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") return null;
      console.error("Erreur lors de la récupération du module:", error);
      return null;
    }
    
    return data as ModuleRow | null;
  } catch (err) {
    console.error("Erreur dans getModuleById:", err);
    return null;
  }
}

export async function getModuleProgress(
  userId: string,
  moduleId: string
): Promise<number> {
  try {
    const supabase = await createClient();
    const { data: episodesData } = await supabase
      .from("episodes")
      .select("id")
      .eq("module_id", moduleId);
    const episodes = (episodesData ?? []) as Pick<EpisodeRow, "id">[];
    
    if (!episodes.length) return 0;

    const { count } = await supabase
      .from("progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in(
        "episode_id",
        episodes.map((e) => e.id)
      );
    
    const total = episodes.length;
    return total ? Math.round(((count ?? 0) / total) * 100) : 0;
  } catch (err) {
    console.error("Erreur dans getModuleProgress:", err);
    return 0;
  }
}
