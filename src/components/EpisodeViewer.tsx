"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { markEpisodeComplete } from "@/lib/db/progress.client";
import type { EpisodeRow } from "@/lib/supabase/database.types";

interface EpisodeViewerProps {
  episode: EpisodeRow;
  moduleId: string;
  completed: boolean;
  userId: string;
  nextEpisode: EpisodeRow | null;
}

export function EpisodeViewer({
  episode,
  moduleId,
  completed,
  userId,
  nextEpisode,
}: EpisodeViewerProps) {
  const router = useRouter();

  const handleMarkComplete = async () => {
    await markEpisodeComplete(userId, episode.id);
    router.refresh();
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
      </div>
    </div>
  );
}
