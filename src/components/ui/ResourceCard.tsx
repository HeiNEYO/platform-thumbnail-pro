"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface ResourceCardProps {
  resource: {
    id: string;
    titre: string;
    categorie: string;
    type: string;
    url: string;
    previewUrl?: string;
  };
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-white/10 bg-[#141414] overflow-hidden transition-all hover:border-white/20 hover:bg-[#1A1A1A]"
    >
      {resource.previewUrl && (
        <div className="aspect-video bg-[#0A0A0A] overflow-hidden relative">
          <Image
            src={resource.previewUrl}
            alt={resource.titre}
            fill
            unoptimized
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-3 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-normal text-sm text-white group-hover:text-[#1D4ED8] transition-colors truncate">
            {resource.titre}
          </p>
          <p className="text-xs text-white/50 capitalize mt-0.5">{resource.type}</p>
        </div>
        <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-[#1D4ED8] shrink-0 ml-2" />
      </div>
    </a>
  );
}
