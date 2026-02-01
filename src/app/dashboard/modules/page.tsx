import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getModules } from "@/lib/db/modules";
import { getEpisodesByModule } from "@/lib/db/episodes";
import { isEpisodeCompleted } from "@/lib/db/episodes";
import { getModuleProgress } from "@/lib/db/modules";
import { BookOpen } from "lucide-react";
import { FormationCard } from "@/components/FormationCard";

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

    const modules = await getModules();

    // Si aucun module, afficher un message
    if (!modules || modules.length === 0) {
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

    // Récupérer les statistiques pour chaque module (épisodes, progression)
    const modulesWithStats = await Promise.all(
      modules.map(async (module) => {
        try {
          const episodes = await getEpisodesByModule(module.id);
          const completedFlags = await Promise.all(
            episodes.map((ep) => isEpisodeCompleted(authUser.id, ep.id))
          );
          const completedCount = completedFlags.filter(Boolean).length;
          
          return {
            ...module,
            episodeCount: episodes.length,
            completedCount,
          };
        } catch (err) {
          console.error(`Erreur pour le module ${module.id}:`, err);
          return {
            ...module,
            episodeCount: 0,
            completedCount: 0,
          };
        }
      })
    );

    return (
      <div className="space-y-7 animate-fade-in">
        <div>
          <h1 className="text-[27px] font-bold mb-2 text-white">
            Formation
          </h1>
          <p className="text-white/70 text-sm">
            {modules.length} formation{modules.length > 1 ? "s" : ""} disponible{modules.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Grille de cartes de formation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulesWithStats.map((module) => (
            <FormationCard key={module.id} module={module} />
          ))}
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
