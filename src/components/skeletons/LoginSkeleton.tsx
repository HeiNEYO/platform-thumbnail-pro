"use client";

import { Skeleton } from "@/components/ui/Skeleton";

/** Squelette de la page de connexion – style YouTube */
export function LoginSkeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-card-border bg-card p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-56 mx-auto" />
          </div>

          {/* Champs */}
          <div className="space-y-5">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
