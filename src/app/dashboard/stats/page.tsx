import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getGlobalProgress, getProgressByModule } from "@/lib/db/progress";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BarChart3, BookOpen, CheckCircle, Target } from "lucide-react";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (isDevMode) {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="text-[27px] font-bold text-white">Statistiques</h1>
        <p className="text-white/70 text-sm">Activez la production pour voir vos stats.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  let progressPercent = 0;
  let byModule: Awaited<ReturnType<typeof getProgressByModule>> = [];
  try {
    const [percent, moduleStats] = await Promise.all([
      getGlobalProgress(authUser.id),
      getProgressByModule(authUser.id),
    ]);
    progressPercent = percent;
    byModule = moduleStats;
  } catch {
    // Tables progress/episodes absentes ou erreur : afficher des zéros
  }
  const totalEpisodes = byModule.reduce((s, m) => s + m.total, 0);
  const completedEpisodes = byModule.reduce((s, m) => s + m.completed, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Statistiques</h1>
        <p className="text-white/70 text-sm">Votre progression et vos KPIs</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-card-border bg-black p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border border-card-border">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{progressPercent}%</p>
              <p className="text-xs text-white/70 font-medium">Progression globale</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-card-border bg-black p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border border-card-border">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedEpisodes}</p>
              <p className="text-xs text-white/70 font-medium">Épisodes complétés</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-card-border bg-black p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border border-card-border">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalEpisodes}</p>
              <p className="text-xs text-white/70 font-medium">Épisodes au total</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-card-border bg-black p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border border-card-border">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{byModule.length}</p>
              <p className="text-xs text-white/70 font-medium">Modules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre globale */}
      <div className="rounded-lg border border-card-border bg-black p-6">
        <h2 className="text-lg font-bold text-white mb-4">Progression globale</h2>
        <ProgressBar value={progressPercent} showLabel />
        <p className="text-xs text-white/50 mt-2">
          {completedEpisodes} / {totalEpisodes} épisodes
        </p>
      </div>

      {/* Progression par module (graphiques en barres) */}
      <div className="rounded-lg border border-card-border bg-black p-6">
        <h2 className="text-lg font-bold text-white mb-4">Progression par module</h2>
        <div className="space-y-4">
          {byModule.length === 0 ? (
            <p className="text-white/50 text-sm">Aucun module pour l&apos;instant.</p>
          ) : (
            byModule.map((m) => (
              <div key={m.moduleId} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Link
                    href={`/dashboard/modules/${m.moduleId}`}
                    className="font-medium text-white hover:text-primary transition-colors truncate pr-2"
                  >
                    {m.moduleTitle}
                  </Link>
                  <span className="text-white/70 shrink-0">
                    {m.completed}/{m.total} · {m.percent}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-black border border-card-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${m.percent}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
