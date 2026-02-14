import videoUrls from "@/data/video-urls.json";

/** URL Vimeo placeholder à ignorer (afficher "Le contenu sera prochainement ajouté" à la place) */
const VIMEO_PLACEHOLDER_ID = "1104426446";

/** Récupère l'URL vidéo : priorité Supabase (episode.video_url), sinon JSON par titre. Retourne null si pas de vidéo ou si placeholder Vimeo. */
export function getVideoUrl(
  episode: { video_url?: string | null; title: string }
): string | null {
  const fromDb = episode.video_url?.trim();
  if (fromDb) {
    // Ignorer le placeholder Vimeo (LP1) utilisé avant migration vers Bunny
    if (fromDb.includes(VIMEO_PLACEHOLDER_ID)) return null;
    return fromDb;
  }
  const fromJson = (videoUrls as Record<string, string>)[episode.title];
  const url = fromJson?.trim() || null;
  if (url?.includes(VIMEO_PLACEHOLDER_ID)) return null;
  return url;
}
