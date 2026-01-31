"use client";

import Link from "next/link";
import { Check, Play } from "lucide-react";

interface EpisodeCardProps {
  id: string;
  titre: string;
  duree: string;
  completed: boolean;
  moduleId: string;
}

export function EpisodeCard({ id, titre, duree, completed, moduleId }: EpisodeCardProps) {
  return (
    <Link
      href={`/dashboard/formation/${moduleId}/episode/${id}`}
      className="flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 transition-colors hover:border-indigo-500/50 hover:bg-[#2a2a2a]/80"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
            completed ? "bg-emerald-500/20 text-emerald-400" : "bg-[#3a3a3a] text-gray-400"
          }`}
        >
          {completed ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </span>
        <span className="font-medium text-white">{titre}</span>
      </div>
      <span className="text-sm text-gray-500">{duree}</span>
    </Link>
  );
}
