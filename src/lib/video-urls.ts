import videoUrls from "@/data/video-urls.json";

/** Récupère l'URL vidéo : priorité Supabase (episode.video_url), sinon JSON par titre */
export function getVideoUrl(
  episode: { video_url?: string | null; title: string }
): string | null {
  if (episode.video_url?.trim()) return episode.video_url;
  const fromJson = (videoUrls as Record<string, string>)[episode.title];
  return fromJson?.trim() || null;
}

/**
 * Extrait l'URL de la miniature Bunny CDN à partir d'une video_url Bunny Stream.
 * Format: https://player.mediadelivery.net/embed/{libraryId}/{videoId}
 * → https://vz-{libraryId}.b-cdn.net/{videoId}/thumbnail.jpg
 */
export function getBunnyThumbnailUrl(videoUrl: string | null | undefined): string | null {
  if (!videoUrl?.trim() || !videoUrl.includes("mediadelivery.net")) return null;
  const m = videoUrl.match(/mediadelivery\.net\/embed\/(\d+)\/([a-f0-9-]+)/i);
  if (!m) return null;
  const [, libraryId, videoId] = m;
  return `https://vz-${libraryId}.b-cdn.net/${videoId}/thumbnail.jpg`;
}
