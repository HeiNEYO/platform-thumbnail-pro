import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  getGlobalProgress,
  getProgressByModule,
  getStreak,
  getRecentActivity,
  getTotalTimeWatched,
  getNextEpisode,
  getActivityHeatmap,
} from "@/lib/db/progress";
import { getLevelFromProgress } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Fragment } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Target,
  Flame,
  Clock,
  Play,
  ChevronRight,
  Trophy,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`;
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((today.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7) return `Il y a ${diff} j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatHeatmapDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default async function StatsPage() {
  const isDevMode =
    process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
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
  let streak = 0;
  let recentActivity: Awaited<ReturnType<typeof getRecentActivity>> = [];
  let totalMinutes = 0;
  let nextEpisode: Awaited<ReturnType<typeof getNextEpisode>> = null;
  let heatmapData: Awaited<ReturnType<typeof getActivityHeatmap>> = [];
  try {
    const [
      percent,
      moduleStats,
      streakVal,
      recent,
      minutes,
      next,
      heatmap,
    ] = await Promise.all([
      getGlobalProgress(authUser.id),
      getProgressByModule(authUser.id),
      getStreak(authUser.id),
      getRecentActivity(authUser.id, 6),
      getTotalTimeWatched(authUser.id),
      getNextEpisode(authUser.id),
      getActivityHeatmap(authUser.id, 14),
    ]);
    progressPercent = percent;
    byModule = moduleStats;
    streak = streakVal;
    recentActivity = recent;
    totalMinutes = minutes;
    nextEpisode = next;
    heatmapData = heatmap;
  } catch {
    // Tables absentes ou erreur : valeurs par défaut
  }

  const totalEpisodes = byModule.reduce((s, m) => s + m.total, 0);
  const completedEpisodes = byModule.reduce((s, m) => s + m.completed, 0);
  const level = getLevelFromProgress(progressPercent);
  const maxHeatmap = Math.max(1, ...heatmapData.map((d) => d.count));
  const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const numWeeks = 14;
  const grid: { count: number; date: string }[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: numWeeks }, () => ({ count: 0, date: "" }))
  );
  heatmapData.forEach(({ date, count }, i) => {
    const weekIndex = Math.floor(i / 7);
    const rowIndex = (new Date(date).getDay() + 6) % 7;
    if (weekIndex < numWeeks) grid[rowIndex][weekIndex] = { count, date };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Statistiques</h1>
        <p className="text-white/70 text-sm">Votre progression et vos KPIs pour suivre votre apprentissage</p>
      </div>

      {/* Streak + Level - Hero cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/10 via-[#0a0a0a] to-[#0a0a0a] p-6 transition-all hover:border-orange-500/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.15),transparent)]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 border border-orange-500/30">
              <Flame className="h-7 w-7 text-orange-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{streak}</p>
              <p className="text-sm text-white/70">jour{streak > 1 ? "s" : ""} d&apos;affilée</p>
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-[#0a0a0a] to-[#0a0a0a] p-6 transition-all hover:border-violet-500/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.15),transparent)]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30">
              <Trophy className="h-7 w-7 text-violet-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{level}</p>
              <p className="text-sm text-white/70">niveau actuel</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs - 4 cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0044FF]/15 border border-[#0044FF]/30">
              <Target className="h-5 w-5 text-[#0044FF]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{progressPercent}%</p>
              <p className="text-xs text-white/60 font-medium">Progression globale</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedEpisodes}</p>
              <p className="text-xs text-white/60 font-medium">Épisodes complétés</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatDuration(totalMinutes)}</p>
              <p className="text-xs text-white/60 font-medium">Temps estimé regardé</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
              <BookOpen className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{byModule.length}</p>
              <p className="text-xs text-white/60 font-medium">Modules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prochain épisode - CTA */}
      {nextEpisode && (
        <div className="rounded-2xl border border-[#0044FF]/30 bg-gradient-to-r from-[#0044FF]/10 via-transparent to-transparent p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#0044FF]" />
            Prochaine étape
          </h2>
          <Link
            href={`/dashboard/modules/${nextEpisode.module_id}/episode/${nextEpisode.episode_id}`}
            className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-[#0044FF]/50 hover:bg-[#0044FF]/10"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white truncate">{nextEpisode.episode_title}</p>
              <p className="text-sm text-white/60 truncate">{nextEpisode.module_title}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0044FF] px-4 py-2 text-sm font-medium text-white group-hover:bg-[#0038cc] transition-colors">
              <Play className="h-4 w-4" />
              Continuer
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      )}

      {/* Activité - heatmap type GitHub */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-white/80" />
          Activité
        </h2>
        <div
          className="w-full grid gap-[3px] min-h-[80px]"
          style={{ gridTemplateColumns: `auto repeat(${numWeeks}, minmax(0, 1fr))`, gridTemplateRows: "repeat(7, minmax(12px, 1fr))" }}
        >
          {grid.map((row, rowIndex) => (
            <Fragment key={rowIndex}>
              <span className="text-[10px] text-white/50 flex items-center pr-2">
                {dayLabels[rowIndex]}
              </span>
              {row.map((cell, colIndex) => {
                const opacity = cell?.count === 0 || !cell?.date ? 0.08 : 0.15 + (cell.count / maxHeatmap) * 0.85;
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="aspect-square w-full min-w-0 rounded-[2px] bg-[#0044FF] transition-opacity hover:ring-1 hover:ring-white/30"
                    style={{ opacity }}
                    title={cell?.date ? `${formatHeatmapDate(cell.date)}${cell.count ? ` · ${cell.count} épisode${cell.count > 1 ? "s" : ""}` : ""}` : undefined}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-[10px] text-white/40">Moins</span>
          <div className="flex gap-[2px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[10px] h-[10px] rounded-[2px] bg-[#0044FF]"
                style={{ opacity: i === 0 ? 0.1 : 0.2 + (i / 4) * 0.8 }}
              />
            ))}
          </div>
          <span className="text-[10px] text-white/40">Plus</span>
        </div>
      </div>

      {/* Progression globale */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-lg font-bold text-white mb-4">Progression globale</h2>
        <ProgressBar value={progressPercent} showLabel />
        <p className="text-xs text-white/50 mt-2">
          {completedEpisodes} / {totalEpisodes} épisodes
        </p>
      </div>

      {/* 2 colonnes : Progression par module + Activité récente */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
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
                      className="font-medium text-white hover:text-[#0044FF] transition-colors truncate pr-2"
                    >
                      {m.moduleTitle}
                    </Link>
                    <span className="text-white/60 shrink-0">
                      {m.completed}/{m.total} · {m.percent}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0044FF] to-[#3366FF] transition-all duration-500"
                      style={{ width: `${m.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-lg font-bold text-white mb-4">Activité récente</h2>
          {recentActivity.length === 0 ? (
            <p className="text-white/50 text-sm">Aucun épisode complété récemment.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((a) => (
                <li key={a.episode_id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="h-2 w-2 rounded-full bg-emerald-500/80 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{a.episode_title}</p>
                    <p className="text-xs text-white/50 truncate">{a.module_title}</p>
                  </div>
                  <span className="text-xs text-white/40 shrink-0">{formatDateShort(a.completed_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
