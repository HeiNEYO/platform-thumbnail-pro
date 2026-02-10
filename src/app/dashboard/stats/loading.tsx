import { Skeleton } from "@/components/ui/Skeleton";

export default function StatsLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Streak + Level */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>

      {/* Prochaine étape */}
      <Skeleton className="h-28 rounded-2xl" />

      {/* Activité hebdomadaire */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex items-end gap-2 h-24">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="flex-1 rounded-t-md min-h-[20px]" style={{ height: `${20 + i * 8}%` }} />
          ))}
        </div>
        <Skeleton className="h-4 w-40 mt-2" />
      </div>

      {/* Progression globale */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-4 w-24 mt-2" />
      </div>

      {/* 2 colonnes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-2 w-2 rounded-full shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-3 w-12 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
