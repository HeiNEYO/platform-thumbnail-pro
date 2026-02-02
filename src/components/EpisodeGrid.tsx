"use client";

import { EpisodeGridCard } from "./EpisodeGridCard";
import type { EpisodeRow } from "@/lib/supabase/database.types";

interface EpisodeGridProps {
  episodes: EpisodeRow[];
  moduleId: string;
  completedFlags: boolean[];
  userId: string;
  instructorName?: string;
  instructorAvatar?: string;
}

export function EpisodeGrid({
  episodes,
  moduleId,
  completedFlags,
  userId,
  instructorName = "Corentin",
  instructorAvatar,
}: EpisodeGridProps) {
  // Pour chaque épisode, calculer le pourcentage de progression (0% ou 100% selon completed)
  const getProgressPercent = (index: number): number => {
    return completedFlags[index] ? 100 : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {episodes.length === 0 ? (
        <div className="col-span-full py-12 text-center text-white/50">
          Aucun épisode disponible
        </div>
      ) : (
        episodes.map((episode, index) => (
          <EpisodeGridCard
            key={episode.id}
            episode={episode}
            moduleId={moduleId}
            completed={completedFlags[index] || false}
            progressPercent={getProgressPercent(index)}
            instructorName={instructorName}
            instructorAvatar={instructorAvatar}
          />
        ))
      )}
    </div>
  );
}
