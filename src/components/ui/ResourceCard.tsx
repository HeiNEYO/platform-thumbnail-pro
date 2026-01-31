"use client";

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
      className="group block rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] overflow-hidden transition-colors hover:border-indigo-500/50"
    >
      {resource.previewUrl && (
        <div className="aspect-video bg-[#1a1a1a] overflow-hidden">
          <img
            src={resource.previewUrl}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-white group-hover:text-indigo-400 transition-colors">
            {resource.titre}
          </p>
          <p className="text-xs text-gray-500 capitalize">{resource.categorie}</p>
        </div>
        <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-indigo-400 shrink-0" />
      </div>
    </a>
  );
}
