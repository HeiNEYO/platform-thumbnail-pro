"use client";

import { useState, useMemo } from "react";
import { ResourceCard } from "@/components/ui/ResourceCard";
import type { ResourceRow } from "@/lib/supabase/database.types";
import { Filter } from "lucide-react";

interface ResourcesPageClientProps {
  resources: ResourceRow[];
  categories: string[];
  types: string[];
}

export function ResourcesPageClient({
  resources,
  categories,
  types,
}: ResourcesPageClientProps) {
  const [category, setCategory] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = resources;
    if (category !== "all") list = list.filter((r) => r.category === category);
    if (typeFilter !== "all") list = list.filter((r) => r.type === typeFilter);
    return list;
  }, [resources, category, typeFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Ressources</h1>
        <p className="text-white/70 text-sm">
          Templates, polices, palettes et outils pour vos thumbnails.
        </p>
      </div>

      {(categories.length > 0 || types.length > 0 || resources.length > 0) && (
        <div className="rounded-lg border border-card-border bg-black p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-white">Filtres</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-white/70">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-card-border bg-black px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              >
                <option value="all">Toutes</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-white/70">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-card-border bg-black px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              >
                <option value="all">Tous</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
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
        <p className="text-white/50 text-center py-8 text-sm">
          Aucune ressource avec ces filtres.
        </p>
      )}
    </div>
  );
}
