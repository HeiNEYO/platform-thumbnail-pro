"use client";

import Link from "next/link";
import { BookOpen, Play, FileText } from "lucide-react";

interface FormationCardProps {
  type: "polaris" | "cours" | "ateliers";
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  ctaStyle: "blue" | "white";
}

const cardConfig = {
  polaris: {
    icon: BookOpen,
    imageTitle: "Polaris",
  },
  cours: {
    icon: Play,
    imageTitle: "Cours vidéos",
  },
  ateliers: {
    icon: FileText,
    imageTitle: "Ateliers",
  },
};

export function FormationCard({
  type,
  title,
  description,
  ctaText,
  ctaHref,
  ctaStyle,
}: FormationCardProps) {
  const config = cardConfig[type];
  const Icon = config.icon;

  return (
    <Link
      href={ctaHref}
      className="group block bg-[#141414] border border-[#2A2A2A] rounded-[20px] overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(59,130,246,0.3)]"
    >
      {/* Zone image */}
      <div className="relative h-[240px] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-t-[20px] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-5xl md:text-6xl font-bold italic text-white drop-shadow-lg">
            {config.imageTitle}
          </h3>
        </div>
      </div>

      {/* Zone contenu */}
      <div className="p-8 bg-[#141414]">
        {/* Icône + Titre */}
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-5 w-5 text-white" />
          <h3 className="text-xl md:text-2xl font-semibold text-white">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-[#999999] text-base leading-relaxed mb-6 line-height-1.6">
          {description}
        </p>

        {/* Bouton CTA */}
        <div
          className={`w-full py-4 px-4 rounded-xl font-semibold text-base text-center transition-all duration-300 ${
            ctaStyle === "blue"
              ? "bg-[#3B82F6] text-white group-hover:bg-[#2563EB] group-hover:shadow-lg"
              : "bg-white text-[#0A0A0A] group-hover:bg-gray-100 group-hover:shadow-lg"
          } group-hover:transform group-hover:translate-y-[-2px]`}
        >
          {ctaText}
        </div>
      </div>
    </Link>
  );
}
