/**
 * Mapping des épisodes vers leurs miniatures
 * Pour changer une miniature, modifiez simplement le chemin ici
 */
export const EPISODE_THUMBNAILS: Record<string, string> = {
  // Exemple de mapping - à remplacer par les vrais IDs d'épisodes
  // "episode-id-1": "/images/episodes/thumbnail-1.jpg",
  // "episode-id-2": "/images/episodes/thumbnail-2.jpg",
};

/**
 * Récupère le chemin de la miniature pour un épisode
 * @param episodeId - ID de l'épisode
 * @param episodeTitle - Titre de l'épisode (pour fallback)
 * @returns Chemin de la miniature ou null si non trouvé
 */
export function getEpisodeThumbnail(
  episodeId: string,
  episodeTitle?: string
): string | null {
  // D'abord, chercher par ID
  if (EPISODE_THUMBNAILS[episodeId]) {
    return EPISODE_THUMBNAILS[episodeId];
  }

  // Sinon, chercher par mots-clés dans le titre (fallback)
  if (episodeTitle) {
    const titleLower = episodeTitle.toLowerCase();
    
    // Mapping basé sur les mots-clés
    if (titleLower.includes("déplacement") || titleLower.includes("déplacements")) {
      return "/images/episodes/1-outils-deplacements.png";
    }
    if (titleLower.includes("sélectionneur") || titleLower.includes("sélection")) {
      return "/images/episodes/2-selectionneur-forme.png";
    }
    if (titleLower.includes("lasso") || titleLower.includes("lassos")) {
      return "/images/episodes/3-outils-lassos.png";
    }
    if (titleLower.includes("baguette") || titleLower.includes("magic")) {
      return "/images/episodes/4-outils-baguette-selection.png";
    }
    if (titleLower.includes("recadrage") || titleLower.includes("crop")) {
      return "/images/episodes/5-outils-recadrage.png";
    }
    if (titleLower.includes("pipette")) {
      return "/images/episodes/6-pipette.png";
    }
    if (titleLower.includes("correcteur") || titleLower.includes("correct")) {
      return "/images/episodes/7-outils-correcteur.png";
    }
    if (titleLower.includes("pinceau") || titleLower.includes("gomme")) {
      return "/images/episodes/8-outils-pinceau-gomme.png";
    }
    if (titleLower.includes("doigt")) {
      return "/images/episodes/9-outils-doigt.png";
    }
    if (titleLower.includes("plume") || titleLower.includes("plumes")) {
      return "/images/episodes/10-outils-plumes.png";
    }
    if (titleLower.includes("texte") || titleLower.includes("textes")) {
      return "/images/episodes/11-outils-textes.png";
    }
    if (titleLower.includes("forme") || titleLower.includes("formes")) {
      return "/images/episodes/12-outils-formes.png";
    }
    if (titleLower.includes("dodge") || titleLower.includes("burn")) {
      return "/images/episodes/dodge-burn.png";
    }
    if ((titleLower.includes("analyse") && titleLower.includes("photos")) || (titleLower.includes("analyse") && titleLower.includes("light"))) {
      return "/images/episodes/analyse-lights.png";
    }
    if (titleLower.includes("light") || titleLower.includes("lights") || titleLower.includes("lumière")) {
      return "/images/episodes/lights.png";
    }
    if (titleLower.includes("ombre") || titleLower.includes("ombres")) {
      return "/images/episodes/ombres.png";
    }
    if (titleLower.includes("ia") && titleLower.includes("photoshop")) {
      return "/images/episodes/ia-photoshop.png";
    }
    if (titleLower.includes("qualité") || titleLower.includes("qualite") || (titleLower.includes("augmenter") && titleLower.includes("qualit"))) {
      return "/images/episodes/qualite-image.png";
    }
  }

  return null;
}
