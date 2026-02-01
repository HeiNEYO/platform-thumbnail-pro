import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getModules } from "@/lib/db/modules";
import { getModuleProgress } from "@/lib/db/modules";
import { getEpisodesByModule } from "@/lib/db/episodes";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BookOpen, Clock, ArrowRight, Play } from "lucide-react";

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

    // Récupérer la progression et les épisodes pour chaque module
    const modulesWithProgress = await Promise.all(
      modules.map(async (module) => {
        try {
          const [progress, episodes] = await Promise.all([
            getModuleProgress(authUser.id, module.id),
            getEpisodesByModule(module.id),
          ]);
          return { ...module, progress, episodeCount: episodes?.length || 0 };
        } catch (err) {
          console.error(`Erreur pour le module ${module.id}:`, err);
          return { ...module, progress: 0, episodeCount: 0 };
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
            {modules.length} module{modules.length > 1 ? "s" : ""} disponible{modules.length > 1 ? "s" : ""}
          </p>
        </div>

        {modulesWithProgress.length === 0 ? (
          <div className="rounded-lg border border-card-border bg-black p-12 text-center">
            <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">Aucun module disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modulesWithProgress.map((module) => (
              <Link
                key={module.id}
                href={`/dashboard/modules/${module.id}`}
                className="rounded-lg border border-card-border bg-black p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white mb-2 break-words">
                      {module.title}
                    </h2>
                    {module.description && (
                      <p className="text-sm text-white/70 line-clamp-2 break-words">
                        {module.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/50 shrink-0 ml-2" />
                </div>

                <div className="space-y-4">
                  {module.duration_estimate && (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span className="truncate">{module.duration_estimate}</span>
                    </div>
                  )}

                  {/* Nombre d'épisodes */}
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Play className="h-4 w-4 shrink-0" />
                    <span>{module.episodeCount} épisode{module.episodeCount > 1 ? "s" : ""}</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white/70">Progression</span>
                      <span className="text-xs font-bold text-primary">{module.progress}%</span>
                    </div>
                    <ProgressBar value={module.progress} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
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
