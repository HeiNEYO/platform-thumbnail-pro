"use client";

import { Skeleton } from "@/components/ui/Skeleton";

/** Squelette du contenu principal (titre + cartes + liste) – style YouTube */
export function DashboardContentSkeleton() {
  return (
    <div className="space-y-7">
      {/* Titre + sous-titre */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Grille de cartes (3 colonnes) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-card-border bg-black p-5 flex items-center gap-4"
          >
            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Barre de progression */}
      <div className="rounded-lg border border-card-border bg-black p-6 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Liste / cartes secondaires */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-16" />
        </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-card-border bg-black p-4 space-y-2"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-[75%]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
