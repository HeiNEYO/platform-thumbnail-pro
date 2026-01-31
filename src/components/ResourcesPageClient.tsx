"use client";

import { useState } from "react";
import { ResourceCard } from "@/components/ui/ResourceCard";
import type { ResourceRow } from "@/lib/supabase/database.types";

interface ResourcesPageClientProps {
  resources: ResourceRow[];
  categories: string[];
}

export function ResourcesPageClient({
  resources,
  categories,
}: ResourcesPageClientProps) {
  const [tab, setTab] = useState<string>(categories[0] ?? "all");

  const filtered =
    tab === "all" || !tab
      ? resources
      : resources.filter((r) => r.category === tab);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Ressources</h1>
        <p className="text-gray-400 mt-1">
          Templates, polices, palettes et outils pour vos thumbnails.
        </p>
      </div>

      {(categories.length > 0 || resources.length > 0) && (
        <div className="border-b border-[#2a2a2a]">
          <nav className="flex gap-1 overflow-x-auto pb-px">
            {categories.length > 0 && (
              <button
                onClick={() => setTab("all")}
                className={`shrink-0 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === "all"
                    ? "bg-[#2a2a2a] text-white border border-[#2a2a2a] border-b-transparent"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Toutes
              </button>
            )}
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setTab(c)}
                className={`shrink-0 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors capitalize ${
                  tab === c
                    ? "bg-[#2a2a2a] text-white border border-[#2a2a2a] border-b-transparent"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <ResourceCard
            key={r.id}
            resource={{
              id: r.id,
              categorie: r.category,
              titre: r.title,
              type: r.type,
              url: r.url,
              previewUrl: r.preview_url ?? undefined,
            }}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          Aucune ressource dans cette catégorie.
        </p>
      )}
    </div>
  );
}
