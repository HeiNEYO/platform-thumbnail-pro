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

/**
 * Fonction optimisée : récupère tous les modules avec leurs statistiques en une seule requête
 * Au lieu de faire N requêtes (une par module), on fait 2 requêtes au total
 */
export async function getModulesWithStats(userId: string): Promise<Array<ModuleRow & { episodeCount: number; completedCount: number }>> {
  try {
    const supabase = await createClient();
    
    // 1. Récupérer tous les modules
    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .select("*")
      .order("order_index", { ascending: true });
    
    if (modulesError || !modules) {
      console.error("Erreur lors de la récupération des modules:", modulesError);
      return [];
    }

    // 2. Récupérer tous les épisodes avec leur module_id en une seule requête
    const { data: episodesData, error: episodesError } = await supabase
      .from("episodes")
      .select("id, module_id")
      .order("order_index", { ascending: true });
    
    if (episodesError) {
      console.error("Erreur lors de la récupération des épisodes:", episodesError);
    }

    const episodes = (episodesData || []) as Array<{ id: string; module_id: string }>;

    // 3. Récupérer toutes les progressions de l'utilisateur en une seule requête
    const episodeIds = episodes.map(e => e.id);
    const { data: progressData, error: progressError } = episodeIds.length > 0
      ? await supabase
          .from("progress")
          .select("episode_id")
          .eq("user_id", userId)
          .in("episode_id", episodeIds)
      : { data: [], error: null };
    
    if (progressError) {
      console.error("Erreur lors de la récupération des progressions:", progressError);
    }

    // Créer un Set pour une recherche rapide O(1)
    const progressArray = (progressData || []) as Array<{ episode_id: string }>;
    const completedEpisodeIds = new Set(progressArray.map(p => p.episode_id));

    // Compter les épisodes et complétions par module
    const episodeCountByModule = new Map<string, number>();
    const completedCountByModule = new Map<string, number>();

    episodes.forEach(episode => {
      const moduleId = episode.module_id;
      episodeCountByModule.set(moduleId, (episodeCountByModule.get(moduleId) || 0) + 1);
      if (completedEpisodeIds.has(episode.id)) {
        completedCountByModule.set(moduleId, (completedCountByModule.get(moduleId) || 0) + 1);
      }
    });

    // Combiner les données
    return modules.map(module => ({
      ...module,
      episodeCount: episodeCountByModule.get(module.id) || 0,
      completedCount: completedCountByModule.get(module.id) || 0,
    })) as Array<ModuleRow & { episodeCount: number; completedCount: number }>;
  } catch (err) {
    console.error("Erreur dans getModulesWithStats:", err);
    return [];
  }
}
