"use client";

import { Folder, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { ResourceRow } from "@/lib/supabase/database.types";
import { ResourceCard } from "./ResourceCard";

interface FolderCardProps {
  folderName: string;
  resources: ResourceRow[];
  icon?: React.ReactNode;
}

export function FolderCard({ folderName, resources, icon }: FolderCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-white/10 bg-[#0A0A0A] overflow-hidden">
      {/* En-tête du dossier */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#141414] transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon || <Folder className="h-5 w-5 text-white/60 shrink-0" />}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-base truncate">
              {folderName}
            </h3>
            <p className="text-white/50 text-xs mt-0.5">
              {resources.length} {resources.length === 1 ? "ressource" : "ressources"}
            </p>
          </div>
        </div>
        <ChevronRight
          className={`h-5 w-5 text-white/40 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Contenu du dossier (ressources) */}
      {isOpen && (
        <div className="border-t border-white/10 p-4 bg-[#0F0F0F]">
          {resources.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={{
                    id: resource.id,
                    categorie: resource.category,
                    titre: resource.title,
                    type: resource.type,
                    url: resource.url,
                    previewUrl: resource.preview_url ?? undefined,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-sm text-center py-4">
              Aucune ressource dans ce dossier
            </p>
          )}
        </div>
      )}
    </div>
  );
}
