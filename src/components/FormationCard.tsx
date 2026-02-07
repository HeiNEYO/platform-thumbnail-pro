"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Play, CheckCircle, Sparkles } from "lucide-react";
import type { ModuleRow } from "@/lib/supabase/database.types";

interface FormationCardProps {
  module: ModuleRow & {
    episodeCount: number;
    completedCount: number;
  };
}

export function FormationCard({ module }: FormationCardProps) {
  const progressPercent =
    module.episodeCount > 0
      ? Math.round((module.completedCount / module.episodeCount) * 100)
      : 0;

  const hasImage = module.image_url && module.image_url.trim() !== "";

  return (
    <Link
      href={`/dashboard/modules/${module.id}`}
      className="group relative block h-[280px] rounded-lg border border-white/10 overflow-hidden bg-[#0a0a0a] hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Image de fond - 80% du rectangle */}
      <div className="absolute inset-0 w-full h-[80%]">
        {hasImage ? (
          <Image
            src={module.image_url!}
            alt={module.title}
            fill
            className="object-cover"
            onError={(e) => {
              // Si l'image ne charge pas, utiliser le gradient
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          // Gradient par défaut si aucune image
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-[#0a0a0a]" />
        )}
      </div>

      {/* Masque flou avec opacité réduite - 20% restant en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm">
        {/* Contenu sur le masque */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
          {/* Nom de la formation */}
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
            {module.title}
          </h3>

          {/* Informations : modules et progression */}
          <div className="flex items-center gap-4 text-sm text-white/80">
            {/* Nombre d'épisodes */}
            <div className="flex items-center gap-1.5">
              <Play className="h-4 w-4 text-icon shrink-0" />
              <span>{module.episodeCount} épisodes</span>
            </div>

            {/* Progression */}
            {module.completedCount > 0 && (
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <span>{module.completedCount}/{module.episodeCount}</span>
              </div>
            )}

            {/* Icône décorative */}
            <div className="ml-auto">
              <Sparkles className="h-4 w-4 text-icon/80 shrink-0" />
            </div>
          </div>

          {/* Barre de progression */}
          {module.episodeCount > 0 && (
            <div className="mt-1">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-white/60 mt-1">{progressPercent}% complété</p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay au survol */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
    </Link>
  );
}
