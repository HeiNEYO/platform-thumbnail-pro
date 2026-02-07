"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Check, Clock } from "lucide-react";
import type { EpisodeRow, ModuleRow } from "@/lib/supabase/database.types";

interface ModuleWithEpisodes extends ModuleRow {
  episodes: EpisodeRow[];
  completedFlags: boolean[];
}

interface NetflixStyleModulesProps {
  modules: ModuleWithEpisodes[];
  userId: string;
}

export function NetflixStyleModules({
  modules,
  userId,
}: NetflixStyleModulesProps) {
  const [scrollStates, setScrollStates] = useState<Record<string, { left: boolean; right: boolean }>>({});
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // Initialiser les états de scroll pour chaque module
    const initialStates: Record<string, { left: boolean; right: boolean }> = {};
    modules.forEach((module) => {
      const container = containerRefs.current[module.id];
      if (container) {
        initialStates[module.id] = {
          left: container.scrollLeft > 0,
          right: container.scrollLeft < container.scrollWidth - container.clientWidth - 10,
        };
      } else {
        initialStates[module.id] = { left: false, right: true };
      }
    });
    setScrollStates(initialStates);
  }, [modules]);

  const scroll = (moduleId: string, direction: "left" | "right") => {
    const container = containerRefs.current[moduleId];
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

  const handleScroll = (moduleId: string) => {
    const container = containerRefs.current[moduleId];
    if (!container) return;

    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight =
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10;

    setScrollStates((prev) => ({
      ...prev,
      [moduleId]: { left: canScrollLeft, right: canScrollRight },
    }));
  };

  return (
    <div className="space-y-8">
      {modules.map((module) => {
        const completedCount = module.completedFlags.filter(Boolean).length;
        const progressPercent =
          module.episodes.length > 0
            ? Math.round((completedCount / module.episodes.length) * 100)
            : 0;

        const scrollState = scrollStates[module.id] || { left: false, right: true };
        const canScrollLeft = scrollState.left;
        const canScrollRight = scrollState.right;

        return (
          <div key={module.id} className="relative group">
            {/* Titre de la section */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{module.title}</h2>
                {module.description && (
                  <p className="text-sm text-white/60">{module.description}</p>
                )}
              </div>
              {module.episodes.length > 0 && (
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span>
                    {completedCount}/{module.episodes.length} complétés
                  </span>
                  <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Conteneur scrollable */}
            <div className="relative">
              {/* Bouton gauche */}
              {canScrollLeft && (
                <button
                  onClick={() => scroll(module.id, "left")}
                  className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Défiler vers la gauche"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
              )}

              {/* Grille d'épisodes scrollable */}
              <div
                ref={(el) => {
                  containerRefs.current[module.id] = el;
                }}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                onScroll={() => handleScroll(module.id)}
              >
                {module.episodes.length === 0 ? (
                  <div className="w-full py-12 text-center text-white/50">
                    Aucun épisode disponible
                  </div>
                ) : (
                  module.episodes.map((episode, index) => {
                    const isCompleted = module.completedFlags[index] || false;
                    return (
                      <Link
                        key={episode.id}
                        href={`/dashboard/modules/${module.id}/episode/${episode.id}`}
                        className="group/episode flex-shrink-0 w-[280px] bg-[#141414] rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                      >
                        {/* Image de l'épisode (placeholder pour l'instant) */}
                        <div className="relative h-[160px] bg-gradient-to-br from-primary/20 to-[#0a0a0a] flex items-center justify-center">
                          {isCompleted ? (
                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                              <Check className="h-12 w-12 text-green-500" />
                            </div>
                          ) : (
                            <Play className="h-12 w-12 text-white/30 group-hover/episode:text-icon transition-colors" />
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
                                  : "text-white group-hover/episode:text-icon"
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
              {canScrollRight && (
                <button
                  onClick={() => scroll(module.id, "right")}
                  className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Défiler vers la droite"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
