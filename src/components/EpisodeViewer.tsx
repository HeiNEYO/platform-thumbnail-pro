"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Heart, FileText, Loader2 } from "lucide-react";
import { markEpisodeComplete } from "@/lib/db/progress.client";
import { upsertNote } from "@/lib/db/notes.client";
import { addFavoriteEpisode, removeFavoriteByItem, isFavoriteEpisode } from "@/lib/db/favorites.client";
import type { EpisodeRow } from "@/lib/supabase/database.types";

interface EpisodeViewerProps {
  episode: EpisodeRow;
  moduleId: string;
  completed: boolean;
  userId: string;
  nextEpisode: EpisodeRow | null;
  initialNoteContent?: string;
}

export function EpisodeViewer({
  episode,
  moduleId,
  completed,
  userId,
  nextEpisode,
  initialNoteContent = "",
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

  const handleMarkComplete = async () => {
    await markEpisodeComplete(userId, episode.id);
    router.refresh();
  };

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
          alert("Impossible de retirer des favoris. Réessayez.");
          return;
        }
        setIsFavorite(false);
      } else {
        const { error } = await addFavoriteEpisode(userId, episode.id);
        if (error) {
          // Doublon ou table absente : on considère comme déjà favori pour éviter état incohérent
          setIsFavorite(true);
        } else {
          setIsFavorite(true);
          router.push("/dashboard/favorites");
          return;
        }
      }
      router.refresh();
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] overflow-hidden">
      <div className="aspect-video bg-[#0f0f0f] flex items-center justify-center">
        {episode.video_url ? (
          <video
            src={episode.video_url}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center text-gray-500 p-8">
            <p className="text-lg font-medium text-white mb-2">{episode.title}</p>
            <p className="text-sm">Contenu vidéo à intégrer (video_url)</p>
            <p className="text-xs mt-4">Durée : {episode.duration ?? "—"}</p>
          </div>
        )}
      </div>
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">{episode.title}</h1>
        <p className="text-gray-400 mt-1">Durée : {episode.duration ?? "—"}</p>
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={completed}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              completed
                ? "bg-emerald-500/20 text-emerald-400 cursor-default"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            <Check className="h-4 w-4 mr-2" />
            {completed ? "Terminé" : "Marquer comme terminé"}
          </button>
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isFavorite
                ? "bg-primary/20 text-primary"
                : "bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]"
            }`}
          >
            {favoriteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
            )}
            {isFavorite ? "Favori" : "Ajouter aux favoris"}
          </button>
          {nextEpisode && (
            <Link
              href={`/dashboard/modules/${moduleId}/episode/${nextEpisode.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-[#3a3a3a] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a4a4a] transition-colors"
            >
              Épisode suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-white">Mes notes</span>
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Vos notes pour cet épisode..."
            className="w-full rounded-lg border border-[#2a2a2a] bg-black px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none min-h-[100px]"
          />
          <button
            type="button"
            onClick={handleSaveNote}
            disabled={noteSaving}
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {noteSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Enregistrer les notes
          </button>
        </div>
      </div>
    </div>
  );
}
