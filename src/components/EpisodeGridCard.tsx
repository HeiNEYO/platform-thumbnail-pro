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

// Mapping des titres d'épisodes vers les miniatures
const getThumbnailPath = (title: string): string | null => {
  const titleLower = title.toLowerCase();
  
  // Mapping basé sur les mots-clés dans les titres
  if (titleLower.includes("déplacement") || titleLower.includes("déplacements")) {
    return "/images/episodes/1-outils-deplacements.png";
  }
  if (titleLower.includes("sélectionneur") || titleLower.includes("sélection")) {
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
  // Formater la durée (supposons que episode.duration est au format "MM:SS" ou "HH:MM:SS")
  const formatDuration = (duration: string | null | undefined): string => {
    if (!duration) return "00:00";
    // Si la durée est déjà au format MM:SS, la retourner telle quelle
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
        className="group relative block aspect-video overflow-hidden hover:scale-[1.02] transition-transform duration-300"
      >
        {/* Image de preview de la vidéo */}
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
              <div className="text-white/30 text-sm">Miniature à ajouter</div>
            </div>
          )}

          {/* Overlay PiP du formateur dans le coin inférieur droit */}
          <div className="absolute bottom-2 right-2 w-[25%] aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-xl">
            {instructorAvatar ? (
              <Image
                src={instructorAvatar}
                alt={instructorName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1D4ED8]/30 to-[#0a0a0a] flex items-center justify-center">
                <UserAvatar name={instructorName} size="sm" />
              </div>
            )}

            {/* Badge de durée superposé sur la PiP */}
            <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-white text-xs font-semibold">
              {duration}
            </div>
          </div>
        </div>
      </Link>

      {/* Trait de séparation */}
      <div className="border-t border-white/10"></div>

      {/* Contenu de la carte */}
      <div className="p-4 space-y-4">
        {/* SECTION 2 : TITRE DE LA VIDÉO */}
        <h3 className="text-base font-semibold text-white leading-relaxed line-clamp-2">
          {episode.title}
        </h3>

      {/* SECTION 3 : INFORMATIONS VIDÉO (Stats) */}
      <div className="flex justify-around">
        {/* Colonne 1 : Durée */}
        <div className="text-center">
          <div className="text-xl font-bold text-white leading-tight mb-0.5">
            {duration}
          </div>
          <div className="text-xs text-[#999999] font-normal">Durée</div>
        </div>

        {/* Colonne 2 : Progrès */}
        <div className="text-center">
          <div className="text-xl font-bold text-white leading-tight mb-0.5">
            {completed ? "100%" : `${progressPercent}%`}
          </div>
          <div className="text-xs text-[#999999] font-normal">Progrès</div>
        </div>
      </div>

        {/* SECTION 4 : CTA ET AVATAR */}
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
