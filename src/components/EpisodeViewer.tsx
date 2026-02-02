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
  instructorName = "Clément | Lemiento",
  instructorTitle = "CEO 8lab & Ecom Brands",
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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Zone principale - Lecteur vidéo et contenu */}
      <div className="flex-1 space-y-6">
        {/* Lecteur vidéo principal avec picture-in-picture */}
        <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-[#0A0A0A] overflow-hidden">
          {/* Vidéo principale */}
          {episode.video_url ? (
            <video
              src={episode.video_url}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]">
              <div className="text-center text-white/50">
                <p className="text-lg font-medium mb-2">{episode.title}</p>
                <p className="text-sm">Vidéo à intégrer</p>
              </div>
            </div>
          )}

          {/* Picture-in-picture (vidéo instructeur) - En bas à droite */}
          <div className="absolute bottom-4 right-4 w-64 h-40 rounded-lg overflow-hidden border-2 border-white/40 bg-[#0A0A0A] shadow-2xl z-10">
            <iframe
              src="https://player.vimeo.com/video/1104426446?autoplay=0&controls=1&title=0&byline=0&portrait=0"
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Instructeur"
            />
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
                className={`inline-flex items-center gap-2 mb-4 transition-colors ${
                  isFavorite
                    ? "text-[#5C6FFF]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
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
            <div className="flex items-center gap-3">
              <UserAvatar 
                name={instructorName} 
                photo={instructorAvatar} 
                size="md" 
              />
              <div>
                <p className="text-sm font-semibold text-white">{instructorName}</p>
                <p className="text-xs text-white/60 font-normal">{instructorTitle}</p>
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

      {/* Panneau de notes à droite */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="sticky top-6 rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-xl">
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
          <div className="p-4">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Commencez à écrire votre note ici..."
              className="w-full h-[400px] rounded-lg border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#5C6FFF] focus:outline-none focus:ring-1 focus:ring-[#5C6FFF]/20 resize-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
