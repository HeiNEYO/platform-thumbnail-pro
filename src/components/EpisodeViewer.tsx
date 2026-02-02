"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart, ExternalLink, ArrowRight } from "lucide-react";
import { markEpisodeComplete } from "@/lib/db/progress.client";
import { upsertNote } from "@/lib/db/notes.client";
import { addFavoriteEpisode, removeFavoriteByItem, isFavoriteEpisode } from "@/lib/db/favorites.client";
import type { EpisodeRow } from "@/lib/supabase/database.types";
import { UserAvatar } from "./ui/UserAvatar";

interface EpisodeViewerProps {
  episode: EpisodeRow;
  moduleId: string;
  completed: boolean;
  userId: string;
  nextEpisode: EpisodeRow | null;
  previousEpisode: EpisodeRow | null;
  initialNoteContent?: string;
  instructorName?: string;
  instructorTitle?: string;
  instructorAvatar?: string;
  complementaryResource?: {
    title: string;
    url: string;
  };
}

export function EpisodeViewer({
  episode,
  moduleId,
  completed,
  userId,
  nextEpisode,
  previousEpisode,
  initialNoteContent = "",
  instructorName = "Corentin",
  instructorTitle = "CEO Thumbnail Pro",
  instructorAvatar,
  complementaryResource,
}: EpisodeViewerProps) {
  const router = useRouter();
  const [noteContent, setNoteContent] = useState(initialNoteContent);
  const [noteSaving, setNoteSaving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    setNoteContent(initialNoteContent);
  }, [initialNoteContent]);

  useEffect(() => {
    isFavoriteEpisode(userId, episode.id).then(setIsFavorite);
  }, [userId, episode.id]);

  const handleSaveNote = async () => {
    setNoteSaving(true);
    await upsertNote(userId, episode.id, noteContent);
    setNoteSaving(false);
    router.refresh();
  };

  const handleToggleFavorite = async () => {
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        const { error } = await removeFavoriteByItem(userId, "episode", episode.id);
        if (error) {
          return;
        }
        setIsFavorite(false);
      } else {
        const { error } = await addFavoriteEpisode(userId, episode.id);
        if (error) {
          setIsFavorite(true);
        } else {
          setIsFavorite(true);
        }
      }
      router.refresh();
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0">
      {/* Zone principale - Lecteur vidéo et contenu */}
      <div className="flex-1 space-y-6">
        {/* Conteneur unifié pour vidéo et notes */}
        <div className="flex flex-col lg:flex-row border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0A]">
          {/* Lecteur vidéo principal */}
          <div className="relative w-full lg:flex-1 aspect-video bg-[#0A0A0A] overflow-hidden border-r-0 lg:border-r border-white/10">
            {/* Vidéo Vimeo principale - remplit toute la zone */}
            <iframe
              src="https://player.vimeo.com/video/1104426446?autoplay=0&controls=1&title=0&byline=0&portrait=0"
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Instructeur"
            />
          </div>

          {/* Panneau de notes à droite */}
          <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 border-white/10">
            <div className="h-full flex flex-col">
              {/* En-tête du panneau */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0F0F0F]">
                <h2 className="text-base font-semibold text-white">Notes</h2>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  disabled={noteSaving}
                  className="px-4 py-2 rounded-lg bg-[#5C6FFF] hover:bg-[#4C5FEF] hover:shadow-lg text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {noteSaving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>

              {/* Zone de texte */}
              <div className="p-4 flex-1">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Commencez à écrire votre note ici..."
                  className="w-full h-full min-h-[400px] rounded-lg border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#5C6FFF] focus:outline-none focus:ring-1 focus:ring-[#5C6FFF]/20 resize-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section informations sous la vidéo */}
        <div className="space-y-6">
          {/* Bouton favoris et titre */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <button
                type="button"
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                className={`inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full border transition-all ${
                  isFavorite
                    ? "text-[#5C6FFF] border-[#5C6FFF]/50 bg-[#5C6FFF]/10"
                    : "text-white/70 border-white/20 bg-[#0A0A0A] hover:text-white hover:border-white/30"
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                <span className="text-sm font-normal">Favoris</span>
              </button>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {episode.title}
              </h1>
            </div>
          </div>

          {/* Ressources complémentaires */}
          {complementaryResource && (
            <div className="rounded-lg border border-white/10 bg-[#0A0A0A] p-4">
              <h3 className="text-sm font-semibold text-white/80 mb-3">
                Ressources complémentaires utilisées dans ce cours
              </h3>
              <a
                href={complementaryResource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors group"
              >
                <span className="group-hover:text-[#5C6FFF] transition-colors">{complementaryResource.title}</span>
                <ExternalLink className="h-4 w-4 group-hover:text-[#5C6FFF] transition-colors" />
              </a>
            </div>
          )}

          {/* Informations instructeur et navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
            {/* Informations instructeur */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-white/20 bg-[#0A0A0A]">
              <UserAvatar 
                name={instructorName} 
                photo={instructorAvatar} 
                size="md" 
              />
              <div>
                <p className="text-sm font-semibold text-white">{instructorName}</p>
                <p className="text-xs text-white/60 font-normal">CEO Thumbnail Pro</p>
              </div>
            </div>

            {/* Navigation précédent/suivant */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {previousEpisode && (
                <Link
                  href={`/dashboard/modules/${moduleId}/episode/${previousEpisode.id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-[#0A0A0A] hover:bg-[#141414] hover:border-white/20 transition-all text-sm text-white font-normal flex-1 sm:flex-initial justify-center"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Précédent</span>
                </Link>
              )}
              {nextEpisode && (
                <Link
                  href={`/dashboard/modules/${moduleId}/episode/${nextEpisode.id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5C6FFF] hover:bg-[#4C5FEF] hover:shadow-lg transition-all text-sm text-white font-medium flex-1 sm:flex-initial justify-center"
                >
                  <span>Suivant</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Section "Continuer le module" */}
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white/80 mb-4">
              Continuer le module
            </h3>
            <Link
              href={`/dashboard/modules/${moduleId}`}
              className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-[#5C6FFF] transition-colors group"
            >
              <span>Voir tous les épisodes</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
