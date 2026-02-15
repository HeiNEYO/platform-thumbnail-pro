"use client";

export function MemberCardSkeleton() {
  return (
    <div 
      className="rounded-lg card-biseau p-5 relative overflow-hidden scale-105 animate-pulse"
    >
      {/* En-tête avec identifiant et titre */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Badge de grade skeleton */}
          <div className="h-7 w-24 bg-white/10 rounded-md" />
          {/* Pseudo skeleton */}
          <div className="h-6 w-32 bg-white/10 rounded" />
        </div>
        {/* Avatar skeleton */}
        <div className="ml-3 shrink-0 w-12 h-12 bg-white/10 rounded-full" />
      </div>

      {/* Informations sociales skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-4 w-20 bg-white/5 rounded" />
        <div className="h-4 w-24 bg-white/5 rounded" />
      </div>
    </div>
  );
}
