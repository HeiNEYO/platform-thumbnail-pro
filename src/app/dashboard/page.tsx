import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getModules } from "@/lib/db/modules";
import { getGlobalProgress } from "@/lib/db/progress";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BookOpen, CheckCircle, Clock, ArrowRight, Sparkles } from "lucide-react";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

function getLevel(progress: number): string {
  if (progress <= 25) return "Débutant";
  if (progress <= 50) return "Intermédiaire";
  if (progress <= 75) return "Avancé";
  return "Expert";
}

export default async function DashboardHomePage() {
  // Mode dev : bypasser Supabase
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  if (isDevMode) {
    return (
      <div className="space-y-7 animate-fade-in">
        <div>
          <h1 className="text-[27px] font-bold mb-2 text-white">
            Bonjour, <span className="text-primary">Utilisateur Développement</span> 👋
          </h1>
          <p className="text-white/70 mt-2 text-sm">
            Bienvenue sur votre espace formation premium
          </p>
        </div>
        <div className="rounded-lg border border-card-border bg-black p-[22px]">
          <p className="text-white/70 text-sm">Mode développement activé - Supabase en maintenance</p>
          <p className="text-xs text-white/50 mt-2">Les données réelles seront chargées une fois Supabase disponible.</p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  type ProfileRow = { full_name: string | null; role: string };
  let profile: ProfileRow | null = null;
  let modules: Awaited<ReturnType<typeof getModules>> = [];
  let progressPercent = 0;
  let completedEpisodes = 0;
  let totalEpisodes = 0;

  try {
    const [{ data: profileData }, modulesList, percent] = await Promise.all([
      supabase.from("users").select("full_name, role").eq("id", authUser.id).single(),
      getModules(),
      getGlobalProgress(authUser.id),
    ]);
    profile = profileData as ProfileRow | null;
    modules = modulesList;
    progressPercent = percent;

    const [{ count: completedCount }, { count: totalCount }] = await Promise.all([
      supabase.from("progress").select("episode_id", { count: "exact", head: true }).eq("user_id", authUser.id),
      supabase.from("episodes").select("*", { count: "exact", head: true }),
    ]);
    completedEpisodes = completedCount ?? 0;
    totalEpisodes = totalCount ?? 0;
  } catch {
    // Tables manquantes ou erreur : afficher un dashboard minimal
  }

  const displayName =
    profile?.full_name ?? authUser.email ?? "Membre";
  const level = getLevel(progressPercent);

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-[27px] font-bold mb-2 text-white">
          Bonjour, <span className="text-primary">{displayName}</span> 👋
        </h1>
        <p className="text-white/70 mt-2 text-sm">
          Bienvenue sur votre espace formation. Niveau actuel :{" "}
          <span className="font-semibold text-primary">{level}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-[14px] md:grid-cols-3">
        <div className="rounded-lg border border-card-border bg-black p-[22px]">
          <div className="flex items-center gap-[14px]">
            <div className="p-[10px] bg-black rounded-lg border border-card-border">
              <BookOpen className="h-[22px] w-[22px] text-primary" />
            </div>
            <div>
              <p className="text-[27px] font-bold text-white">{modules.length}</p>
              <p className="text-xs text-white/70 font-medium">Modules disponibles</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-card-border bg-black p-[22px]">
          <div className="flex items-center gap-[14px]">
            <div className="p-[10px] bg-black rounded-lg border border-card-border">
              <CheckCircle className="h-[22px] w-[22px] text-success" />
            </div>
            <div>
              <p className="text-[27px] font-bold text-white">{completedEpisodes}</p>
              <p className="text-xs text-white/70 font-medium">
                Épisodes complétés
                {totalEpisodes ? ` / ${totalEpisodes}` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-card-border bg-black p-[22px]">
          <div className="flex items-center gap-[14px]">
            <div className="p-[10px] bg-black rounded-lg border border-card-border">
              <Clock className="h-[22px] w-[22px] text-warning" />
            </div>
            <div>
              <p className="text-[27px] font-bold text-white">{progressPercent}%</p>
              <p className="text-xs text-white/70 font-medium">Progression globale</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="rounded-lg border border-card-border bg-black p-[22px]">
        <div className="flex items-center justify-between mb-[14px]">
          <h2 className="text-lg font-bold text-white">Votre progression</h2>
          <span className="text-base font-bold text-primary">{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} showLabel />
        <p className="text-xs text-white/70 mt-[14px]">
          {completedEpisodes} épisode{completedEpisodes > 1 ? "s" : ""} complété
          {completedEpisodes > 1 ? "s" : ""} sur {totalEpisodes ?? 0} au total
        </p>
      </div>

      {/* Modules Section */}
      {modules.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-[22px]">
            <h2 className="text-[22.5px] font-bold text-white">Modules disponibles</h2>
            <Link
              href="/dashboard/modules"
              className="text-xs font-semibold text-primary hover:opacity-80 flex items-center gap-2 transition-opacity duration-200"
            >
              Voir tout <ArrowRight className="h-[14px] w-[14px]" />
            </Link>
          </div>
          <div className="grid gap-[14px] md:grid-cols-2 lg:grid-cols-3">
            {modules.slice(0, 6).map((module) => (
              <Link
                key={module.id}
                href={`/dashboard/modules/${module.id}`}
                className="rounded-lg border border-card-border bg-black p-[18px]"
              >
                <h3 className="font-bold text-white mb-2 text-sm">
                  {module.title}
                </h3>
                {module.description && (
                  <p className="text-xs text-white/70 line-clamp-2">{module.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {modules.length > 0 && (
        <div className="rounded-lg border border-card-border bg-black p-7">
          <div className="flex items-center gap-[22px]">
            <div className="p-[14px] bg-black rounded-lg border border-card-border">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">Continuez votre formation</h3>
              <p className="text-white/70 mb-[14px] text-sm">
                {modules.length} module{modules.length > 1 ? "s" : ""} vous attendent. Commencez dès maintenant !
              </p>
              <Link
                href="/dashboard/modules"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:opacity-80 transition-opacity duration-200"
              >
                Voir les modules <ArrowRight className="h-[14px] w-[14px]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
