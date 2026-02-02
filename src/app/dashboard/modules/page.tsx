import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getModulesWithStats } from "@/lib/db/modules";
import { BookOpen } from "lucide-react";
import { NetflixStyleModuleCards } from "@/components/NetflixStyleModuleCards";

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
            <div className="relative h-[280px] rounded-lg border border-white/10 overflow-hidden bg-[#0a0a0a]">
              {/* Image de fond - 80% */}
              <div className="absolute inset-0 w-full h-[80%]">
                {mainModule.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mainModule.image_url}
                    alt="Thumbnail Pro"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-[#0a0a0a]" />
                )}
              </div>

              {/* Masque flou avec opacité réduite - 20% en bas */}
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm">
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                  <h2 className="text-xl font-bold text-white">Thumbnail Pro</h2>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <span>{modulesWithStats.length} modules</span>
                    <span>•</span>
                    <span>{totalEpisodes} épisodes</span>
                    {totalCompleted > 0 && (
                      <>
                        <span>•</span>
                        <span>{totalCompleted}/{totalEpisodes} complétés</span>
                      </>
                    )}
                  </div>
                  {totalEpisodes > 0 && (
                    <div className="mt-1">
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${globalProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
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
