import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getModuleById } from "@/lib/db/modules";
import { getEpisodesByModule } from "@/lib/db/episodes";
import { getModuleProgress } from "@/lib/db/modules";
import { isEpisodeCompleted } from "@/lib/db/episodes";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { NetflixStyleEpisodes } from "@/components/NetflixStyleEpisodes";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: moduleId } = await params;
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const [module, episodes] = await Promise.all([
    getModuleById(moduleId),
    getEpisodesByModule(moduleId),
  ]);

  if (!module) notFound();

  const progressPercent = await getModuleProgress(authUser.id, moduleId);
  const completedFlags = await Promise.all(
    episodes.map((ep) => isEpisodeCompleted(authUser.id, ep.id))
  );

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/60">
        <Link href="/dashboard/modules" className="hover:text-primary transition-colors">
          Formation
        </Link>
        <span>/</span>
        <span className="text-white">{module.title}</span>
      </div>

      {/* En-tête du module */}
      <div className="rounded-lg border border-card-border bg-black p-6">
        <h1 className="text-2xl font-bold text-white mb-2">{module.title}</h1>
        {module.description && (
          <p className="text-white/70 mb-4">{module.description}</p>
        )}
        <div className="flex items-center gap-6 text-sm text-white/60">
          <span>{episodes.length} épisode{episodes.length > 1 ? "s" : ""}</span>
          {module.duration_estimate && (
            <>
              <span>•</span>
              <span>{module.duration_estimate}</span>
            </>
          )}
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progression</span>
            <span className="text-primary font-medium">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} />
        </div>
      </div>

      {/* Épisodes style Netflix - cartes scrollables */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Épisodes</h2>
        <NetflixStyleEpisodes
          episodes={episodes}
          moduleId={moduleId}
          completedFlags={completedFlags}
        />
      </div>
    </div>
  );
}
