import videoUrls from "@/data/video-urls.json";

/** Récupère l'URL vidéo : priorité Supabase (episode.video_url), sinon JSON par titre */
export function getVideoUrl(
  episode: { video_url?: string | null; title: string }
): string | null {
  if (episode.video_url?.trim()) return episode.video_url;
  const fromJson = (videoUrls as Record<string, string>)[episode.title];
  return fromJson?.trim() || null;
}
