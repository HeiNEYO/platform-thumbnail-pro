"use client";

import Link from "next/link";
import { Play, CheckCircle } from "lucide-react";
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
  if (modules.length === 0) {
    return (
      <div className="w-full py-12 text-center text-white/50">
        Aucun module disponible
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {modules.map((module) => {
        const progressPercent =
          module.episodeCount > 0
            ? Math.round((module.completedCount / module.episodeCount) * 100)
            : 0;

        return (
          <Link
            key={module.id}
            href={`/dashboard/modules/${module.id}`}
            className="group/module bg-[#141414] rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Image du module */}
                    <div className="relative h-[200px] bg-gradient-to-br from-primary/20 to-[#0a0a0a] flex items-center justify-center">
                      {module.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
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
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white group-hover/module:text-primary transition-colors mb-2 line-clamp-2">
                {module.title}
              </h3>
              {module.description && (
                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {module.description}
                </p>
              )}

              {/* Statistiques */}
              <div className="flex items-center justify-between text-sm text-white/70 mb-3">
                <span>{module.episodeCount} épisode{module.episodeCount > 1 ? "s" : ""}</span>
                {module.completedCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{module.completedCount}/{module.episodeCount}</span>
                  </span>
                )}
              </div>

              {/* Barre de progression */}
              {module.episodeCount > 0 && (
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
