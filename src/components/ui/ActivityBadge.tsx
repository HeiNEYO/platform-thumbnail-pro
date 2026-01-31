"use client";

import { Star } from "lucide-react";

interface ActivityBadgeProps {
  score: number; // 0-5
  className?: string;
}

export function ActivityBadge({ score, className = "" }: ActivityBadgeProps) {
  const s = Math.min(5, Math.max(0, Math.round(score)));
  const color =
    s <= 1 ? "text-red-400 bg-red-500/20" : s <= 3 ? "text-amber-400 bg-amber-500/20" : "text-emerald-400 bg-emerald-500/20";
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${color} ${className}`}
      title={
        s <= 1 ? "Inactif" : s <= 3 ? "Activité moyenne" : "Très actif"
      }
    >
      <Star className="h-3 w-3 fill-current" />
      {s}
    </span>
  );
}
