import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getModulesWithStats } from "@/lib/db/modules";
import { BookOpen, Video, Users, Clock } from "lucide-react";
import { NetflixStyleModuleCards } from "@/components/NetflixStyleModuleCards";
import type { EpisodeRow } from "@/lib/supabase/database.types";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

export default async function ModulesPage() {
  // Mode dev : bypasser Supabase
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  if (isDevMode) {
    return (
      <div className="space-y-7 animate-fade-in">
        <div>
          <h1 className="text-[27px] font-bold mb-2 text-white">
            Formation
          </h1>
          <p className="text-white/70 text-sm">Mode développement - Les modules seront chargés une fois Supabase disponible</p>
        </div>
        <div className="rounded-lg border border-card-border bg-black p-12 text-center">
          <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/70">Supabase en maintenance - Mode développement actif</p>
        </div>
      </div>
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      redirect("/login");
    }

    // Récupérer tous les modules avec leurs statistiques en une seule requête optimisée
    const modulesWithStats = await getModulesWithStats(authUser.id);

    // Si aucun module, afficher un message
    if (!modulesWithStats || modulesWithStats.length === 0) {
      return (
        <div className="space-y-7 animate-fade-in">
          <div>
            <h1 className="text-[27px] font-bold mb-2 text-white">
              Formation
            </h1>
            <p className="text-white/70 text-sm">Aucun module disponible</p>
          </div>
          <div className="rounded-lg border border-card-border bg-black p-12 text-center">
            <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70 mb-2">Aucun module disponible pour le moment.</p>
            <p className="text-xs text-white/50">Les modules seront ajoutés prochainement.</p>
          </div>
        </div>
      );
    }

    // Filtrer pour n'afficher que les 5 modules demandés : Les Outils, Les Bases, La Pratique, Business, Bonus
    const modulesToDisplay = modulesWithStats.filter((module) => {
      const title = module.title;
      return (
        title === "1 • Les Outils" ||
        title === "2 • Les Bases" ||
        title === "3 • La Pratique" ||
        title === "4 • Business" ||
        title === "5 • Bonus"
      );
    }).sort((a, b) => a.order_index - b.order_index); // Trier par order_index pour avoir le bon ordre

    // Calculer les statistiques globales de la formation (tous les modules)
    const totalEpisodes = modulesWithStats.reduce((sum, m) => sum + m.episodeCount, 0);
    const totalCompleted = modulesWithStats.reduce((sum, m) => sum + m.completedCount, 0);
    const globalProgress = totalEpisodes > 0 ? Math.round((totalCompleted / totalEpisodes) * 100) : 0;

    // Compter les intervenants (utilisateurs avec rôle admin ou intervenant)
    const { count: intervenantsCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .in("role", ["admin", "intervenant"]);

    // Calculer la durée totale de tous les épisodes
    const { data: allEpisodesData } = await supabase
      .from("episodes")
      .select("duration");
    
    const allEpisodes = (allEpisodesData || []) as Pick<EpisodeRow, "duration">[];
    
    const totalDuration = allEpisodes.reduce((total, ep) => {
      if (!ep.duration) return total;
      // Format attendu: "HH:MM:SS" ou "MM:SS"
      const parts = ep.duration.split(":").map(Number);
      if (parts.length === 2) {
        // MM:SS
        return total + parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        // HH:MM:SS
        return total + parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      return total;
    }, 0);

    // Formater la durée totale en heures et minutes
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const formattedDuration = hours > 0 
      ? `${hours}h ${minutes}min`
      : `${minutes}min`;

    // Trouver le module principal (celui avec l'image, généralement le premier)
    const mainModule = modulesWithStats.find((m) => m.image_url) || modulesWithStats[0];

    return (
      <div className="space-y-7 animate-fade-in">
        <div>
          <h1 className="text-[27px] font-bold mb-2 text-white">
            Formation
          </h1>
          <p className="text-white/70 text-sm">
            {modulesWithStats.length} module{modulesWithStats.length > 1 ? "s" : ""} disponible{modulesWithStats.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Carte principale Thumbnail Pro */}
        {mainModule && (
          <div className="mb-8">
            <div className="relative h-[450px] rounded-lg border border-white/10 overflow-hidden bg-[#0f0f0f]">
              {/* Image de fond - pleine hauteur */}
              <div className="absolute inset-0 w-full h-full">
                {mainModule.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mainModule.image_url}
                    alt="Thumbnail Pro"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-[#0f0f0f]" />
                )}
              </div>

              {/* Blur sur 22% du bas de l'image */}
              <div className="absolute bottom-0 left-0 right-0 h-[22%] backdrop-blur-md bg-gradient-to-t from-black/60 via-black/40 to-transparent border-t border-white/10">
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                  <h2 className="text-xl font-bold text-white">Thumbnail Pro</h2>
                  {mainModule.description && (
                    <p className="text-white/80 text-sm line-clamp-2">{mainModule.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Ligne de séparation */}
            <div className="border-t border-white/10 my-4"></div>

            {/* Rectangles avec statistiques sous l'image */}
            <div className="flex items-center gap-3">
              {/* Rectangle Épisodes */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-transparent">
                <Video className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/80">{totalEpisodes} épisode{totalEpisodes > 1 ? "s" : ""}</span>
              </div>

              {/* Rectangle Modules */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-transparent">
                <BookOpen className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/80">{modulesWithStats.length} module{modulesWithStats.length > 1 ? "s" : ""}</span>
              </div>

              {/* Rectangle Durée */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-transparent">
                <Clock className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/80">{formattedDuration}</span>
              </div>

              {/* Rectangle Intervenants */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-transparent">
                <Users className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/80">{intervenantsCount || 0} intervenant{(intervenantsCount || 0) > 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        )}

        {/* Modules style Netflix - cartes scrollables (uniquement les 5 modules demandés) */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Modules de la formation</h2>
          <NetflixStyleModuleCards modules={modulesToDisplay} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erreur lors du chargement des modules:", error);
    return (
      <div className="space-y-7 animate-fade-in">
        <div>
          <h1 className="text-[27px] font-bold mb-2 text-white">
            Formation
          </h1>
        </div>
        <div className="rounded-lg border border-card-border bg-black p-12 text-center">
          <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/70 mb-2">Erreur lors du chargement des modules.</p>
          <p className="text-xs text-white/50">Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }
}
