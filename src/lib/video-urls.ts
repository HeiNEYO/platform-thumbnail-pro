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
 * Bunny Stream: https://{pull_zone}.b-cdn.net/{videoId}/thumbnail.jpg
 *
 * Si les miniatures ne s'affichent pas, vérifie dans ton dashboard Bunny (Stream > ta librairie)
 * l'URL du pull zone (ex: vz-597170-frh). Tu peux la définir dans .env.local :
 * NEXT_PUBLIC_BUNNY_PULL_ZONE=vz-597170-frh
 */
export function getBunnyThumbnailUrl(videoUrl: string | null | undefined): string | null {
  if (!videoUrl?.trim() || !videoUrl.includes("mediadelivery.net")) return null;
  const m = videoUrl.match(/mediadelivery\.net\/embed\/(\d+)\/([a-f0-9-]+)/i);
  if (!m) return null;
  const [, libraryId, videoId] = m;
  const pullZone =
    process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE?.trim() || `vz-${libraryId}`;
  return `https://${pullZone}.b-cdn.net/${videoId}/thumbnail.jpg`;
}
