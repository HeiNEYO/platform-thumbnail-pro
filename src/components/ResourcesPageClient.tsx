"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import type { ResourceRow } from "@/lib/supabase/database.types";
import {
  FileText,
  Image as ImageIcon,
  Palette,
  Code,
  Video,
  Music,
  Type,
  FolderOpen,
} from "lucide-react";

interface ResourcesPageClientProps {
  resources: ResourceRow[];
  categories: string[];
  types: string[];
}

const predefinedFolders = [
  { key: "templates", name: "Templates", icon: FileText, color: "from-blue-500/20 to-blue-600/5" },
  { key: "images", name: "Images & Icônes", icon: ImageIcon, color: "from-emerald-500/20 to-emerald-600/5" },
  { key: "palettes", name: "Palettes de Couleurs", icon: Palette, color: "from-violet-500/20 to-violet-600/5" },
  { key: "fonts", name: "Polices", icon: Type, color: "from-amber-500/20 to-amber-600/5" },
  { key: "outils", name: "Outils", icon: Code, color: "from-red-500/20 to-red-600/5" },
  { key: "videos", name: "Vidéos", icon: Video, color: "from-pink-500/20 to-pink-600/5" },
  { key: "audio", name: "Audio", icon: Music, color: "from-yellow-500/20 to-yellow-600/5" },
  { key: "autres", name: "Autres", icon: FolderOpen, color: "from-white/10 to-white/5" },
];

export function ResourcesPageClient({
  resources,
  categories,
  types,
}: ResourcesPageClientProps) {
  const folders = useMemo(() => {
    const foldersMap = new Map<string, ResourceRow[]>();
    resources.forEach((resource) => {
      const category = resource.category || "autres";
      if (!foldersMap.has(category)) foldersMap.set(category, []);
      foldersMap.get(category)!.push(resource);
    });
    return predefinedFolders.map((folderConfig) => {
      const folderResources = (foldersMap.get(folderConfig.key) || []).sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      return { ...folderConfig, resources: folderResources };
    });
  }, [resources]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Ressources</h1>
        <p className="text-white/70 text-sm">
          Templates, polices, palettes et outils pour vos thumbnails. Téléchargez les fichiers par catégorie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((folder) => {
          const Icon = folder.icon;
          return (
            <div
              key={folder.key}
              className="group block bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
            >
              {/* Zone visuelle - style modules */}
              <div
                className={`relative w-full aspect-video overflow-hidden bg-gradient-to-br ${folder.color} flex items-center justify-center`}
              >
                <Icon className="h-14 w-14 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>

              {/* Contenu */}
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-1.5 rounded-lg border border-white/10 bg-white/5">
                    <Icon className="h-4 w-4 text-white/80" />
                  </div>
                  <h3 className="text-base font-semibold text-white truncate">{folder.name}</h3>
                </div>

                {folder.resources.length > 0 ? (
                  <div className="space-y-2">
                    {folder.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 hover:border-white/20 transition-colors"
                      >
                        <span className="text-sm text-white truncate flex-1 min-w-0">
                          {resource.title}
                        </span>
                        {resource.url ? (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-[#0044FF] text-white hover:bg-[#0038cc] transition-colors shrink-0"
                            title="Télécharger"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Télécharger
                          </a>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-white/10 text-white/50 shrink-0"
                            title="Fichier à venir"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Bientôt
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center rounded-xl border border-white/5 bg-white/[0.02]">
                    <p className="text-white/40 text-sm">Aucune ressource</p>
                    <p className="text-white/30 text-xs mt-1">Fichiers à venir</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
