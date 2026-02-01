"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Check, Clock } from "lucide-react";
import type { EpisodeRow } from "@/lib/supabase/database.types";

interface NetflixStyleEpisodesProps {
  episodes: EpisodeRow[];
  moduleId: string;
  completedFlags: boolean[];
}

export function NetflixStyleEpisodes({
  episodes,
  moduleId,
  completedFlags,
}: NetflixStyleEpisodesProps) {
  const [scrollState, setScrollState] = useState({ left: false, right: true });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateScrollState = () => {
        setScrollState({
          left: container.scrollLeft > 0,
          right:
            container.scrollLeft < container.scrollWidth - container.clientWidth - 10,
        });
      };
      updateScrollState();
      container.addEventListener("scroll", updateScrollState);
      return () => container.removeEventListener("scroll", updateScrollState);
    }
  }, [episodes]);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const currentScroll = container.scrollLeft;
    const newPosition =
      direction === "left"
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {/* Conteneur scrollable */}
      <div className="relative">
        {/* Bouton gauche */}
        {scrollState.left && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Défiler vers la gauche"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
        )}

        {/* Grille d'épisodes scrollable */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {episodes.length === 0 ? (
            <div className="w-full py-12 text-center text-white/50">
              Aucun épisode disponible
            </div>
          ) : (
            episodes.map((episode, index) => {
              const isCompleted = completedFlags[index] || false;
              return (
                <Link
                  key={episode.id}
                  href={`/dashboard/modules/${moduleId}/episode/${episode.id}`}
                  className="group/episode flex-shrink-0 w-[280px] bg-[#141414] rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  {/* Image de l'épisode */}
                  <div className="relative h-[160px] bg-gradient-to-br from-primary/20 to-[#0a0a0a] flex items-center justify-center">
                    {isCompleted ? (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <Check className="h-12 w-12 text-green-500" />
                      </div>
                    ) : (
                      <Play className="h-12 w-12 text-white/30 group-hover/episode:text-primary transition-colors" />
                    )}
                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-black/0 group-hover/episode:bg-black/30 transition-colors" />
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className={`text-sm font-semibold line-clamp-2 flex-1 ${
                          isCompleted
                            ? "text-green-400 line-through"
                            : "text-white group-hover/episode:text-primary"
                        } transition-colors`}
                      >
                        {episode.title}
                      </h3>
                      {isCompleted && (
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      )}
                    </div>

                    {/* Durée */}
                    {episode.duration && (
                      <div className="flex items-center gap-1.5 text-xs text-white/60">
                        <Clock className="h-3 w-3" />
                        <span>{episode.duration}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Bouton droit */}
        {scrollState.right && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Défiler vers la droite"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
