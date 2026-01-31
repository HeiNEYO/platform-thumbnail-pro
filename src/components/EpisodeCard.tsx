"use client";

import Link from "next/link";
import { Check, Play } from "lucide-react";
import type { EpisodeRow } from "@/lib/supabase/database.types";

interface EpisodeCardProps {
  episode: EpisodeRow;
  moduleId: string;
  completed: boolean;
  onMarkComplete?: (episodeId: string) => void;
}

export function EpisodeCard({
  episode,
  moduleId,
  completed,
  onMarkComplete,
}: EpisodeCardProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3 transition-colors ${
        completed
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-[#2a2a2a] bg-[#2a2a2a]"
      }`}
    >
      <Link
        href={`/dashboard/modules/${moduleId}/episode/${episode.id}`}
        className="flex flex-1 items-center gap-3 min-w-0"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${
            completed ? "bg-emerald-500/20 text-emerald-400" : "bg-[#3a3a3a] text-gray-400"
          }`}
        >
          {completed ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-white">{episode.title}</p>
          <p className="text-xs text-gray-500">{episode.duration ?? "—"}</p>
        </div>
      </Link>
      <span className="text-sm text-gray-500 shrink-0">
        {completed ? "Terminé" : episode.duration ?? "—"}
      </span>
      {!completed && onMarkComplete && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onMarkComplete(episode.id);
          }}
          className="shrink-0 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-600/30 transition-colors"
        >
          Marquer terminé
        </button>
      )}
    </div>
  );
}
