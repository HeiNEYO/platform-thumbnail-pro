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

  return (
    <div className="space-y-5">
      {/* SECTION 1 : LA MINIATURE */}
      <Link
        href={`/dashboard/modules/${moduleId}/episode/${episode.id}`}
        className="group relative block aspect-video rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300"
      >
        {/* Image de preview de la vid�o */}
        <div className="relative w-full h-full bg-gradient-to-br from-[#1D4ED8]/20 to-[#0a0a0a]">
          {/* Placeholder pour la miniature - � remplacer par thumbnail_url quand disponible */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/30 text-sm">Miniature � ajouter</div>
          </div>

          {/* Overlay PiP du formateur dans le coin inf�rieur droit */}
          <div className="absolute bottom-3 right-3 w-[25%] aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-xl">
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

            {/* Badge de dur�e superpos� sur la PiP */}
            <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-white text-sm font-semibold">
              {duration}
            </div>
          </div>
        </div>
      </Link>

      {/* SECTION 2 : TITRE DE LA VID�O */}
      <h3 className="text-lg font-semibold text-white leading-relaxed line-clamp-2">
        {episode.title}
      </h3>

      {/* SECTION 3 : INFORMATIONS VID�O (Stats) */}
      <div className="flex justify-around">
        {/* Colonne 1 : Dur�e */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white leading-tight mb-1">
            {duration}
          </div>
          <div className="text-sm text-[#999999] font-normal">Dur�e</div>
        </div>

        {/* Colonne 2 : Progr�s */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white leading-tight mb-1">
            {completed ? "100%" : `${progressPercent}%`}
          </div>
          <div className="text-sm text-[#999999] font-normal">Progr�s</div>
        </div>
      </div>

      {/* SECTION 4 : CTA ET AVATAR */}
      <div className="flex items-center justify-between">
        {/* Bouton CTA */}
        <Link
          href={`/dashboard/modules/${moduleId}/episode/${episode.id}`}
          className="group/cta inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/20 hover:bg-[#1D4ED8]/10 hover:border-[#1D4ED8] transition-all duration-300 text-white text-base font-semibold"
        >
          <span>Visionner la vid�o</span>
          <ArrowRight className="h-4 w-4 group-hover/cta:translate-x-1 transition-transform" />
        </Link>

        {/* Avatar formateur */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
          {instructorAvatar ? (
            <Image
              src={instructorAvatar}
              alt={instructorName}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <UserAvatar name={instructorName} size="md" />
          )}
        </div>
      </div>
    </div>
  );
}
