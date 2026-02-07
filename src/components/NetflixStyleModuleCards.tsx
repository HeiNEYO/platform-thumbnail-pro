"use client";

import Link from "next/link";
import { BookOpen, Play } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {modules.map((module) => {
        const progressPercent =
          module.episodeCount > 0
            ? Math.round((module.completedCount / module.episodeCount) * 100)
            : 0;

        return (
          <Link
            key={module.id}
            href={`/dashboard/modules/${module.id}`}
            className="group block bg-[#0A0A0A] border border-white/10 rounded-[16px] overflow-hidden"
          >
            {/* Zone visuelle en haut - même ratio que FormationCard */}
            <div className="relative w-full aspect-video overflow-hidden">
              {module.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={module.image_url}
                  alt={module.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-[#0a0a0a] flex items-center justify-center">
                  <Play className="h-16 w-16 text-white/30 group-hover:text-icon transition-colors" />
                </div>
              )}
            </div>

            {/* Zone de contenu en bas - même structure que FormationCard */}
            <div className="p-5 md:p-6 bg-[#0A0A0A]">
              {/* Icône + Titre */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="p-1.5 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
                  <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-white line-clamp-1">
                  {module.title}
                </h3>
              </div>

              {/* Description */}
              {module.description && (
                <p className="text-[#999999] text-xs md:text-sm leading-relaxed mb-4 line-clamp-2">
                  {module.description}
                </p>
              )}

              {/* Statistiques - même style que FormationCard */}
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <div className="text-white text-base font-semibold">
                    {module.episodeCount}
                  </div>
                  <div className="text-[#999999] text-xs">
                    Épisode{module.episodeCount > 1 ? "s" : ""}
                  </div>
                </div>
                <div>
                  <div className="text-white text-base font-semibold">
                    {module.completedCount}
                  </div>
                  <div className="text-[#999999] text-xs">Complétés</div>
                </div>
                <div>
                  <div className="text-white text-base font-semibold">
                    {progressPercent}%
                  </div>
                  <div className="text-[#999999] text-xs">Progression</div>
                </div>
              </div>

              {/* Bouton CTA - même style que FormationCard (blanc) */}
              <div className="w-full py-2 px-4 rounded-xl font-semibold text-xs md:text-sm text-center transition-all duration-300 flex items-center justify-center bg-white text-[#0A0A0A] hover:brightness-95 hover:scale-[0.98]">
                <span>Accéder au module</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
