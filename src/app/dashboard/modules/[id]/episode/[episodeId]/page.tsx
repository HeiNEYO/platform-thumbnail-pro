import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getModuleById } from "@/lib/db/modules";
import { getEpisodeById, isEpisodeCompleted } from "@/lib/db/episodes";
import { getEpisodesByModule } from "@/lib/db/episodes";
import { getNoteForEpisode } from "@/lib/db/notes";
import { getVideoUrl } from "@/lib/video-urls";
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

  const episodeWithVideo = {
    ...episode,
    video_url: getVideoUrl(episode),
  };

  // Récupérer les informations de Corentin (instructeur pour tous les modules)
  const { data: corentinProfile } = await supabase
    .from("users")
    .select("full_name, avatar_url")
    .or("full_name.ilike.%Corentin%,email.ilike.%corentin%")
    .limit(1)
    .maybeSingle();

  const corentinData = corentinProfile as { full_name: string | null; avatar_url: string | null } | null;

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
        episode={episodeWithVideo}
        moduleId={moduleId}
        completed={completed}
        userId={authUser.id}
        nextEpisode={nextEpisode}
        previousEpisode={previousEpisode}
        initialNoteContent={note?.content ?? ""}
        instructorName={corentinData?.full_name || "Corentin"}
        instructorTitle="CEO Thumbnail Pro"
        instructorAvatar={corentinData?.avatar_url || undefined}
      />
    </div>
  );
}
