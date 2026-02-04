"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { EpisodeRow } from "@/lib/supabase/database.types";
import { UserAvatar } from "./ui/UserAvatar";

interface EpisodeGridCardProps {
  episode: EpisodeRow;
  moduleId: string;
  completed: boolean;
  progressPercent: number;
  instructorName?: string;
  instructorAvatar?: string;
}

// Mapping des titres d'�pisodes vers les miniatures
const getThumbnailPath = (title: string): string | null => {
  const titleLower = title.toLowerCase();
  
  // Mapping bas� sur les mots-cl�s dans les titres
  if (titleLower.includes("d�placement") || titleLower.includes("d�placements")) {
    return "/images/episodes/1-outils-deplacements.png";
  }
  if (titleLower.includes("s�lectionneur") || titleLower.includes("s�lection")) {
    return "/images/episodes/2-selectionneur-forme.png";
  }
  if (titleLower.includes("lasso") || titleLower.includes("lassos")) {
    return "/images/episodes/3-outils-lassos.png";
  }
  if (titleLower.includes("baguette") || titleLower.includes("magic")) {
    return "/images/episodes/4-outils-baguette-selection.png";
  }
  if (titleLower.includes("recadrage") || titleLower.includes("crop")) {
    return "/images/episodes/5-outils-recadrage.png";
  }
  if (titleLower.includes("pipette")) {
    return "/images/episodes/6-pipette.png";
  }
  if (titleLower.includes("correcteur") || titleLower.includes("correct")) {
    return "/images/episodes/7-outils-correcteur.png";
  }
  if (titleLower.includes("pinceau") || titleLower.includes("gomme")) {
    return "/images/episodes/8-outils-pinceau-gomme.png";
  }
  if (titleLower.includes("doigt")) {
    return "/images/episodes/9-outils-doigt.png";
  }
  if (titleLower.includes("plume") || titleLower.includes("plumes")) {
    return "/images/episodes/10-outils-plumes.png";
  }
  if (titleLower.includes("texte") || titleLower.includes("textes")) {
    return "/images/episodes/11-outils-textes.png";
  }
  if (titleLower.includes("forme") || titleLower.includes("formes")) {
    return "/images/episodes/12-outils-formes.png";
  }
  
  return null;
};

export function EpisodeGridCard({
  episode,
  moduleId,
  completed,
  progressPercent,
  instructorName = "Corentin",
  instructorAvatar,
}: EpisodeGridCardProps) {
  // Formater la dur�e (supposons que episode.duration est au format "MM:SS" ou "HH:MM:SS")
  const formatDuration = (duration: string | null | undefined): string => {
    if (!duration) return "00:00";
    // Si la dur�e est d�j� au format MM:SS, la retourner telle quelle
    if (duration.match(/^\d{2}:\d{2}$/)) return duration;
    // Sinon, essayer de parser d'autres formats
    return duration;
  };

  const duration = formatDuration(episode.duration);
  const thumbnailPath = getThumbnailPath(episode.title);

  return (
    <div className="overflow-hidden rounded-[20px] border border-white/10">
      {/* SECTION 1 : LA MINIATURE */}
      <Link
        href={`/dashboard/modules/${moduleId}/episode/${episode.id}`}
        className="relative block aspect-video overflow-hidden"
      >
        {/* Image de preview de la vid�o */}
        <div className="relative w-full h-full bg-gradient-to-br from-[#1D4ED8]/20 to-[#0a0a0a]">
          {thumbnailPath ? (
            <Image
              src={thumbnailPath}
              alt={episode.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white/30 text-sm">Miniature � ajouter</div>
            </div>
          )}
        </div>
      </Link>

      {/* Trait de s�paration */}
      <div className="border-t border-white/10"></div>

      {/* Contenu de la carte */}
      <div className="p-4 space-y-4">
        {/* SECTION 2 : TITRE DE LA VID�O */}
        <h3 className="text-base font-semibold text-white leading-relaxed line-clamp-2">
          {episode.title}
        </h3>

        {/* Description */}
        {episode.description && (
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
            {episode.description}
          </p>
        )}

        {/* SECTION 3 : CTA ET AVATAR */}
        <div className="flex items-center justify-between">
          {/* Bouton CTA */}
          <Link
            href={`/dashboard/modules/${moduleId}/episode/${episode.id}`}
            className="group/cta inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/20 hover:bg-[#1D4ED8]/10 hover:border-[#1D4ED8] transition-all duration-300 text-white text-sm font-medium"
          >
            <span>Visionner</span>
            <ArrowRight className="h-3 w-3 group-hover/cta:translate-x-1 transition-transform" />
          </Link>

          {/* Avatar formateur */}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
            {instructorAvatar ? (
              <Image
                src={instructorAvatar}
                alt={instructorName}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <UserAvatar name={instructorName} size="sm" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
