import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getModuleById } from "@/lib/db/modules";
import { getEpisodesByModule } from "@/lib/db/episodes";
import { getModuleProgress } from "@/lib/db/modules";
import { isEpisodeCompleted } from "@/lib/db/episodes";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EpisodeGrid } from "@/components/EpisodeGrid";

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

  // Récupérer les informations de Corentin (instructeur pour tous les modules)
  const { data: corentinProfile } = await supabase
    .from("users")
    .select("full_name, avatar_url")
    .or("full_name.ilike.%Corentin%,email.ilike.%corentin%")
    .limit(1)
    .maybeSingle();

  const corentinData = corentinProfile as { full_name: string | null; avatar_url: string | null } | null;

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

      {/* En-tête du module avec image et blur */}
      <div className="relative h-[280px] rounded-lg border border-white/10 overflow-hidden bg-[#0a0a0a]">
        {/* Image de fond - pleine hauteur */}
        <div className="absolute inset-0 w-full h-full">
          {module.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={module.image_url}
              alt={module.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-[#0a0a0a]" />
          )}
        </div>

        {/* Blur sur 15% du bas de l'image */}
        <div className="absolute bottom-0 left-0 right-0 h-[15%] backdrop-blur-md bg-gradient-to-t from-black/60 via-black/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
            <h1 className="text-xl font-bold text-white">{module.title}</h1>
            {module.description && (
              <p className="text-white/80 text-sm line-clamp-2">{module.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span>{episodes.length} épisode{episodes.length > 1 ? "s" : ""}</span>
              {module.duration_estimate && (
                <>
                  <span>•</span>
                  <span>{module.duration_estimate}</span>
                </>
              )}
            </div>
            <div className="mt-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70">Progression</span>
                <span className="text-primary font-medium">{progressPercent}%</span>
              </div>
              <ProgressBar value={progressPercent} />
            </div>
          </div>
        </div>
      </div>

      {/* Épisodes en grille verticale */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-6">Épisodes</h2>
        <EpisodeGrid
          episodes={episodes}
          moduleId={moduleId}
          completedFlags={completedFlags}
          userId={authUser.id}
          instructorName={corentinData?.full_name || "Corentin"}
          instructorAvatar={corentinData?.avatar_url || undefined}
        />
      </div>
    </div>
  );
}
