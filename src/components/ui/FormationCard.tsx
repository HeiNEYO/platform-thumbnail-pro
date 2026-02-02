"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Play, FileText } from "lucide-react";

interface FormationCardProps {
  type: "formation" | "plateforme" | "communaute";
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  ctaStyle: "blue" | "white";
  stats?: {
    duration?: string;
    parts?: number;
    videos?: number;
    members?: number;
    coaches?: number;
    availability?: string;
  };
}

const cardConfig = {
  formation: {
    icon: BookOpen,
    imagePath: "/images/formations/polaris.png",
  },
  plateforme: {
    icon: Play,
    imagePath: "/images/formations/cours-videos.png",
  },
  communaute: {
    icon: FileText,
    imagePath: "/images/formations/ateliers.png",
  },
};

export function FormationCard({
  type,
  title,
  description,
  ctaText,
  ctaHref,
  ctaStyle,
  stats,
}: FormationCardProps) {
  const config = cardConfig[type];
  const Icon = config.icon;

  return (
    <Link
      href={ctaHref}
      className="group block bg-[#0A0A0A] border border-white/10 rounded-[16px] overflow-hidden"
    >
      {/* Zone visuelle en haut - Image en plein écran avec ratio adaptatif */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={config.imagePath}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Zone de contenu en bas (30-40% de la hauteur) */}
      <div className="p-5 md:p-6 bg-[#0A0A0A]">
        {/* Icône + Titre */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="p-1.5 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
            <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-white">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-[#999999] text-xs md:text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Statistiques */}
        {stats && (
          <div className="flex items-center gap-4 mb-4">
            {stats.duration && (
              <div>
                <div className="text-white text-base font-semibold">{stats.duration}</div>
                <div className="text-[#999999] text-xs">Durée totale</div>
              </div>
            )}
            {stats.parts !== undefined && (
              <div>
                <div className="text-white text-base font-semibold">{stats.parts}</div>
                <div className="text-[#999999] text-xs">Parties</div>
              </div>
            )}
            {stats.videos !== undefined && (
              <div>
                <div className="text-white text-base font-semibold">{stats.videos}</div>
                <div className="text-[#999999] text-xs">Vidéos</div>
              </div>
            )}
            {stats.members !== undefined && (
              <div>
                <div className="text-white text-base font-semibold">{stats.members}</div>
                <div className="text-[#999999] text-xs">Membres</div>
              </div>
            )}
            {stats.coaches !== undefined && (
              <div>
                <div className="text-white text-base font-semibold">{stats.coaches}</div>
                <div className="text-[#999999] text-xs">Coachs</div>
              </div>
            )}
            {stats.availability && (
              <div>
                <div className="text-white text-base font-semibold">{stats.availability}</div>
                <div className="text-[#999999] text-xs">Disponibilité</div>
              </div>
            )}
          </div>
        )}

        {/* Bouton CTA */}
        <div
          className={`w-full py-2 px-4 rounded-xl font-semibold text-xs md:text-sm text-center transition-all duration-300 flex items-center justify-center ${
            ctaStyle === "blue"
              ? "bg-gradient-to-r from-[#5C6FFF] to-[#4C5FEF] text-white group-hover:brightness-75"
              : "bg-white text-[#0A0A0A] group-hover:brightness-75"
          }`}
        >
          <span>{ctaText}</span>
        </div>
      </div>
    </Link>
  );
}
