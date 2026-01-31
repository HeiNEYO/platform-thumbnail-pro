"use client";

import { useRouter } from "next/navigation";
import { EpisodeCard } from "@/components/EpisodeCard";
import { markEpisodeComplete } from "@/lib/db/progress.client";
import type { EpisodeRow } from "@/lib/supabase/database.types";

interface EpisodeListProps {
  episodes: EpisodeRow[];
  moduleId: string;
  completedFlags: boolean[];
  userId: string;
}

export function EpisodeList({
  episodes,
  moduleId,
  completedFlags,
  userId,
}: EpisodeListProps) {
  const router = useRouter();

  const handleMarkComplete = async (episodeId: string) => {
    await markEpisodeComplete(userId, episodeId);
    router.refresh();
  };

  return (
    <ul className="space-y-2">
      {episodes.map((episode, i) => (
        <li key={episode.id}>
          <EpisodeCard
            episode={episode}
            moduleId={moduleId}
            completed={completedFlags[i] ?? false}
            onMarkComplete={handleMarkComplete}
          />
        </li>
      ))}
    </ul>
  );
}
