"use client";

import { useMemo, useState } from "react";
import { Download, FileImage, Palette, Type, Layers, Image as ImageIcon, Wrench, FolderOpen } from "lucide-react";
import type { ResourceRow } from "@/lib/supabase/database.types";

interface ResourcesPageClientProps {
  resources: ResourceRow[];
  categories: string[];
  types: string[];
}

const panels = [
  { key: "psd", name: "PSD Photoshop", icon: Layers },
  { key: "textures", name: "Textures", icon: FileImage },
  { key: "fonts", name: "Polices d'écriture", icon: Type },
  { key: "palettes", name: "Palettes", icon: Palette },
  { key: "templates", name: "Templates", icon: Layers },
  { key: "images", name: "Images & Icônes", icon: ImageIcon },
  { key: "outils", name: "Outils", icon: Wrench },
  { key: "autres", name: "Autres", icon: FolderOpen },
];

const PLACEHOLDER_COUNT = 8;

export function ResourcesPageClient({
  resources,
  categories,
  types,
}: ResourcesPageClientProps) {
  const [activePanel, setActivePanel] = useState(panels[0].key);

  const byCategory = useMemo(() => {
    const map = new Map<string, ResourceRow[]>();
    resources.forEach((r) => {
      const cat = r.category || "autres";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(r);
    });
    panels.forEach((p) => {
      if (!map.has(p.key)) map.set(p.key, []);
    });
    return map;
  }, [resources]);

  const activeResources = (byCategory.get(activePanel) || []).sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  const itemsToShow = useMemo(() => {
    const placeholders = Array.from({ length: Math.max(0, PLACEHOLDER_COUNT - activeResources.length) }, (_, i) => ({
      id: `placeholder-${activePanel}-${i}`,
      isPlaceholder: true as const,
    }));
    return [
      ...activeResources.map((r) => ({ ...r, isPlaceholder: false as const })),
      ...placeholders,
    ].slice(0, PLACEHOLDER_COUNT);
  }, [activeResources, activePanel]);

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Header - style marketplace */}
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Ressources</h1>
        <p className="text-white/70 text-sm">
          Téléchargez les fichiers par type de ressource. Templates, polices, textures et outils pour vos thumbnails.
        </p>
      </div>

      {/* Navigation Tabs - style marketplace */}
      <div className="flex flex-wrap items-center gap-3">
        {panels.map((panel) => {
          const Icon = panel.icon;
          const isActive = activePanel === panel.key;
          return (
            <button
              key={panel.key}
              onClick={() => setActivePanel(panel.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-[#0a0a0a]"
                  : "bg-[#0a0a0a] text-white/60 border border-white/20 hover:text-white/90 hover:border-white/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{panel.name}</span>
            </button>
          );
        })}
      </div>

      {/* Content Cards Grid - style marketplace */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {itemsToShow.map((item) => {
          if ("isPlaceholder" in item && item.isPlaceholder) {
            return (
              <div
                key={item.id}
                className="block rounded-lg border border-white/10 bg-[#0a0a0a] overflow-hidden"
              >
                <div className="relative h-[180px] overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#151515] to-[#1a1a1a]" />
                <div className="border-t border-white/10" />
                <div className="p-5 bg-[#0a0a0a]">
                  <p className="text-sm text-white/40 mb-3 text-center">À venir</p>
                  <span className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-white/20 bg-white/5 text-white/40 text-sm">
                    <Download className="h-4 w-4" />
                    Télécharger
                  </span>
                </div>
              </div>
            );
          }
          const resource = item as ResourceRow;
          return (
            <div
              key={resource.id}
              className="block rounded-lg border border-white/10 bg-[#0a0a0a] overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="relative h-[180px] overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#151515] to-[#1a1a1a]">
                {resource.preview_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resource.preview_url}
                    alt={resource.title}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/[0.04] to-transparent" />
                )}
              </div>
              <div className="border-t border-white/10" />
              <div className="p-5 bg-[#0a0a0a]">
                <p className="text-sm font-medium text-white truncate mb-3 text-center">
                  {resource.title}
                </p>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-[#0a0a0a] rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </a>
                ) : (
                  <span className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-white/20 bg-white/5 text-white/50 text-sm">
                    <Download className="h-4 w-4" />
                    Bientôt
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
