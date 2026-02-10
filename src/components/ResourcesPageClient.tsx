"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import type { ResourceRow } from "@/lib/supabase/database.types";

interface ResourcesPageClientProps {
  resources: ResourceRow[];
  categories: string[];
  types: string[];
}

const panels = [
  { key: "psd", name: "PSD Photoshop" },
  { key: "textures", name: "Textures" },
  { key: "fonts", name: "Polices d'écriture" },
  { key: "palettes", name: "Palettes" },
  { key: "templates", name: "Templates" },
  { key: "images", name: "Images & Icônes" },
  { key: "outils", name: "Outils" },
  { key: "autres", name: "Autres" },
];

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Ressources</h1>
        <p className="text-white/70 text-sm">
          Téléchargez les fichiers par type de ressource.
        </p>
      </div>

      {/* Panels en ligne - sélection */}
      <div className="flex flex-wrap gap-2">
        {panels.map((panel) => (
          <button
            key={panel.key}
            onClick={() => setActivePanel(panel.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activePanel === panel.key
                ? "bg-white text-[#0a0a0a]"
                : "bg-white/10 text-white/80 hover:bg-white/15 border border-white/10"
            }`}
          >
            {panel.name}
          </button>
        ))}
      </div>

      {/* Grille 4 par ligne - éléments téléchargeables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeResources.length > 0 ? (
          activeResources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5"
            >
              <div className="aspect-square bg-gradient-to-br from-[#333] via-[#222] to-[#2a2a2a] flex items-center justify-center p-6">
                {resource.preview_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resource.preview_url}
                    alt={resource.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-lg" />
                )}
              </div>
              <div className="p-4 flex flex-col items-center gap-3">
                <p className="text-sm font-medium text-white truncate w-full text-center">
                  {resource.title}
                </p>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/50">
                    <Download className="h-4 w-4" />
                    Bientôt
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
            <p className="text-white/50 text-sm">Aucune ressource dans cette catégorie</p>
            <p className="text-white/30 text-xs mt-1">Fichiers à venir</p>
          </div>
        )}
      </div>
    </div>
  );
}
