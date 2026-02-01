"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, CheckCircle } from "lucide-react";
import type { ModuleRow } from "@/lib/supabase/database.types";

interface ModuleWithStats extends ModuleRow {
  episodeCount: number;
  completedCount: number;
}

interface NetflixStyleModuleCardsProps {
  modules: ModuleWithStats[];
}

export function NetflixStyleModuleCards({
  modules,
}: NetflixStyleModuleCardsProps) {
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
  }, [modules]);

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

        {/* Grille de modules scrollable */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {modules.length === 0 ? (
            <div className="w-full py-12 text-center text-white/50">
              Aucun module disponible
            </div>
          ) : (
            modules.map((module) => {
              const progressPercent =
                module.episodeCount > 0
                  ? Math.round((module.completedCount / module.episodeCount) * 100)
                  : 0;

              return (
                <Link
                  key={module.id}
                  href={`/dashboard/modules/${module.id}`}
                  className="group/module flex-shrink-0 w-[320px] bg-[#141414] rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  {/* Image du module */}
                  <div className="relative h-[180px] bg-gradient-to-br from-primary/20 to-[#0a0a0a] flex items-center justify-center">
                    {module.image_url ? (
                      <img
                        src={module.image_url}
                        alt={module.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="h-16 w-16 text-white/30 group-hover/module:text-primary transition-colors" />
                    )}
                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-black/0 group-hover/module:bg-black/30 transition-colors" />
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-white group-hover/module:text-primary transition-colors mb-2 line-clamp-2">
                      {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-xs text-white/60 mb-3 line-clamp-2">
                        {module.description}
                      </p>
                    )}

                    {/* Statistiques */}
                    <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                      <span>{module.episodeCount} épisode{module.episodeCount > 1 ? "s" : ""}</span>
                      {module.completedCount > 0 && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {module.completedCount}/{module.episodeCount}
                        </span>
                      )}
                    </div>

                    {/* Barre de progression */}
                    {module.episodeCount > 0 && (
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
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
