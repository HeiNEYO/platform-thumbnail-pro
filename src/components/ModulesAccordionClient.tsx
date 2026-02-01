"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Play, Check } from "lucide-react";
import type { EpisodeRow, ModuleRow } from "@/lib/supabase/database.types";

interface ModuleWithEpisodes extends ModuleRow {
  episodes: EpisodeRow[];
  completedFlags: boolean[];
}

interface ModulesAccordionClientProps {
  modules: ModuleWithEpisodes[];
  userId: string;
}

export function ModulesAccordionClient({
  modules,
  userId,
}: ModulesAccordionClientProps) {
  // Par défaut, ouvrir le premier module
  const [openModules, setOpenModules] = useState<Set<string>>(
    new Set(modules.length > 0 ? [modules[0].id] : [])
  );

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  if (modules.length === 0) {
    return (
      <div className="rounded-lg border border-card-border bg-black p-12 text-center">
        <p className="text-white/70">Aucun module disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {modules.map((module) => {
        const isOpen = openModules.has(module.id);
        const completedCount = module.completedFlags.filter(Boolean).length;
        const progressPercent =
          module.episodes.length > 0
            ? Math.round((completedCount / module.episodes.length) * 100)
            : 0;

        return (
          <div
            key={module.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          >
            {/* En-tête du module */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-700 shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-700 shrink-0" />
                )}
                <h2 className="text-base font-bold text-gray-900 truncate">
                  {module.title}
                </h2>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                {module.episodes.length > 0 && completedCount > 0 && (
                  <span className="text-sm text-gray-600 font-medium">
                    {completedCount}/{module.episodes.length}
                  </span>
                )}
              </div>
            </button>

            {/* Contenu du module (épisodes) */}
            {isOpen && (
              <div className="border-t border-gray-200 bg-gray-50/50">
                <div className="px-6 py-3 space-y-0.5">
                  {module.episodes.length === 0 ? (
                    <p className="text-sm text-gray-500 italic px-4 py-2">
                      Aucun épisode disponible
                    </p>
                  ) : (
                    module.episodes.map((episode, index) => {
                      const isCompleted = module.completedFlags[index] || false;
                      return (
                        <Link
                          key={episode.id}
                          href={`/dashboard/modules/${module.id}/episode/${episode.id}`}
                          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-white transition-colors group"
                        >
                          {/* Icône */}
                          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            {isCompleted ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Play className="h-3.5 w-3.5 text-blue-600 group-hover:text-blue-700" />
                            )}
                          </div>

                          {/* Titre */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm truncate ${
                                isCompleted
                                  ? "text-green-700 line-through"
                                  : "text-blue-600 group-hover:text-blue-700"
                              }`}
                            >
                              {episode.title}
                            </p>
                          </div>

                          {/* Badge de durée si présent */}
                          {episode.duration && (
                            <span className="text-xs text-gray-600 bg-blue-50 px-2 py-0.5 rounded shrink-0 font-medium">
                              {episode.duration}
                            </span>
                          )}
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
