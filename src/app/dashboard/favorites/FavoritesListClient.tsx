"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ExternalLink, Trash2, BookOpen, FileText } from "lucide-react";
import type { FavoriteWithDetails } from "@/lib/db/favorites";
import { removeFavorite } from "@/lib/db/favorites.client";

export function FavoritesListClient({
  favorites,
  userId,
}: {
  favorites: FavoriteWithDetails[];
  userId: string;
}) {
  const [list, setList] = useState(favorites);

  const handleRemove = async (favoriteId: string) => {
    const { error } = await removeFavorite(favoriteId);
    if (error) {
      alert("Impossible de retirer ce favori. Réessayez.");
      return;
    }
    setList((prev) => prev.filter((f) => f.id !== favoriteId));
  };

  if (list.length === 0) {
    return (
      <div className="rounded-lg border border-card-border bg-black p-12 text-center">
        <Heart className="h-12 w-12 text-white/30 mx-auto mb-4" />
        <p className="text-white/70 font-medium mb-2">Aucun favori</p>
        <p className="text-white/50 text-sm">
          Ajoutez des épisodes ou des ressources en favori depuis les pages Formation ou Ressources.
        </p>
        <Link
          href="/dashboard/modules"
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-icon hover:opacity-90"
        >
          <BookOpen className="h-4 w-4" />
          Voir les modules
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {list.map((f) => {
        const isEpisode = f.item_type === "episode" && f.episode;
        const isResource = f.item_type === "resource" && f.resource;
        const deletedEpisode = f.item_type === "episode" && !f.episode;
        const deletedResource = f.item_type === "resource" && !f.resource;
        const title = isEpisode
          ? f.episode!.title
          : isResource
            ? f.resource!.title
            : deletedEpisode
              ? "Épisode supprimé"
              : deletedResource
                ? "Ressource supprimée"
                : "—";
        const href = isEpisode
          ? `/dashboard/modules/${f.episode!.module_id}/episode/${f.episode_id}`
          : isResource
            ? f.resource!.url
            : deletedEpisode
              ? "/dashboard/modules"
              : deletedResource
                ? "/dashboard/resources"
                : "#";
        const isExternal = !!isResource && !!f.resource;

        return (
          <div
            key={f.id}
            className="flex items-center gap-4 rounded-lg border border-card-border bg-black p-4"
          >
            <div className="p-2 rounded-lg border border-card-border shrink-0">
              {f.item_type === "episode" ? (
                <BookOpen className="h-5 w-5 text-icon" />
              ) : (
                <FileText className="h-5 w-5 text-icon" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{title}</p>
              <p className="text-xs text-white/50 capitalize">
                {f.item_type === "episode" ? "Épisode" : "Ressource"}
                {isResource && f.resource?.category ? ` · ${f.resource.category}` : ""}
                {(deletedEpisode || deletedResource) ? " (supprimé)" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isExternal ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-card-border text-white/70 hover:text-icon hover:border-icon/50 transition-colors"
                  title="Ouvrir"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={href}
                  className="p-2 rounded-lg border border-card-border text-white/70 hover:text-icon hover:border-icon/50 transition-colors"
                  title="Ouvrir"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
              <button
                type="button"
                onClick={() => handleRemove(f.id)}
                className="p-2 rounded-lg border border-card-border text-white/50 hover:text-error hover:border-error/50 transition-colors"
                title="Retirer des favoris"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
