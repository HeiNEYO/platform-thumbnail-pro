import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getModuleById } from "@/lib/db/modules";
import { getEpisodeById, isEpisodeCompleted } from "@/lib/db/episodes";
import { getEpisodesByModule } from "@/lib/db/episodes";
import { getModuleProgress } from "@/lib/db/modules";
import { EpisodeViewer } from "@/components/EpisodeViewer";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ id: string; episodeId: string }>;
}) {
  const { id: moduleId, episodeId } = await params;
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const [module, episode, episodes, progressPercent, completed] =
    await Promise.all([
      getModuleById(moduleId),
      getEpisodeById(episodeId),
      getEpisodesByModule(moduleId),
      getModuleProgress(authUser.id, moduleId),
      isEpisodeCompleted(authUser.id, episodeId),
    ]);

  if (!module || !episode || episode.module_id !== moduleId) notFound();

  const currentIndex = episodes.findIndex((e) => e.id === episodeId);
  const nextEpisode =
    currentIndex >= 0 && currentIndex < episodes.length - 1
      ? episodes[currentIndex + 1]
      : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <Link href={`/dashboard/modules/${moduleId}`} className="hover:text-indigo-400 transition-colors">
          ← {module.title}
        </Link>
      </div>

      <div className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] p-4">
        <p className="text-xs text-gray-500 mb-1">Progression du module</p>
        <ProgressBar value={progressPercent} showLabel />
      </div>

      <EpisodeViewer
        episode={episode}
        moduleId={moduleId}
        completed={completed}
        userId={authUser.id}
        nextEpisode={nextEpisode}
      />
    </div>
  );
}
