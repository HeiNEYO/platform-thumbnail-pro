import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getModuleById } from "@/lib/db/modules";
import { getEpisodeById, isEpisodeCompleted } from "@/lib/db/episodes";
import { getEpisodesByModule } from "@/lib/db/episodes";
import { getNoteForEpisode } from "@/lib/db/notes";
import { EpisodeViewer } from "@/components/EpisodeViewer";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

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

  const [module, episode, episodes, completed, note] =
    await Promise.all([
      getModuleById(moduleId),
      getEpisodeById(episodeId),
      getEpisodesByModule(moduleId),
      isEpisodeCompleted(authUser.id, episodeId),
      getNoteForEpisode(authUser.id, episodeId),
    ]);

  if (!module || !episode || episode.module_id !== moduleId) notFound();

  const currentIndex = episodes.findIndex((e) => e.id === episodeId);
  const nextEpisode =
    currentIndex >= 0 && currentIndex < episodes.length - 1
      ? episodes[currentIndex + 1]
      : null;
  const previousEpisode =
    currentIndex > 0
      ? episodes[currentIndex - 1]
      : null;

  return (
    <div className="space-y-6">
      <EpisodeViewer
        episode={episode}
        moduleId={moduleId}
        completed={completed}
        userId={authUser.id}
        nextEpisode={nextEpisode}
        previousEpisode={previousEpisode}
        initialNoteContent={note?.content ?? ""}
      />
    </div>
  );
}
