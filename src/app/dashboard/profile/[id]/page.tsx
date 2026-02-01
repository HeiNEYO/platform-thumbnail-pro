import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { Twitter } from "lucide-react";
import { getGlobalProgress } from "@/lib/db/progress";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = await params;
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (isDevMode) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-[27px] font-bold text-white">Profil</h1>
        <p className="text-white/70 text-sm">Mode développement - Profil public à venir</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  
  if (!currentUser) {
    redirect("/login");
  }

  // Récupérer le profil de l'utilisateur ciblé
  const { data: profileData, error } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, discord_tag, twitter_handle, community_score, created_at")
    .eq("id", userId)
    .single();

  if (error || !profileData) {
    notFound();
  }

  const profile = profileData as {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    discord_tag: string | null;
    twitter_handle: string | null;
    community_score: number | null;
    created_at: string;
  };

  const displayName = profile.full_name || profile.email.split("@")[0];
  
  // Récupérer la progression
  let progressPercent = 0;
  try {
    progressPercent = await getGlobalProgress(userId);
  } catch {
    // Ignore les erreurs
  }

  // Compter les épisodes complétés
  const { count: completedEpisodes } = await supabase
    .from("progress")
    .select("episode_id", { count: "exact", head: true })
    .eq("user_id", userId);

  const isOwnProfile = currentUser.id === userId;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* En-tête */}
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">
          {isOwnProfile ? "Mon Profil" : `Profil de ${displayName}`}
        </h1>
        <p className="text-white/70 text-sm">
          {isOwnProfile 
            ? "Votre profil public visible par la communauté"
            : "Profil public du membre"
          }
        </p>
      </div>

      {/* Carte principale */}
      <div className="rounded-lg border border-card-border bg-black p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <UserAvatar
              name={displayName}
              photo={profile.avatar_url}
              size="lg"
            />
          </div>

          {/* Informations */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{displayName}</h2>
              <p className="text-white/70 text-sm">{profile.email}</p>
            </div>

            {/* Score communautaire */}
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-xs font-medium">SCORE-</span>
              <span className="text-primary text-xl font-bold">
                {(profile.community_score || 0).toString().padStart(3, "0")}
              </span>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex flex-wrap gap-4 pt-2">
              {profile.twitter_handle ? (
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Twitter className="h-5 w-5 text-white/60" />
                  <span>@{profile.twitter_handle}</span>
                </div>
              ) : null}
              
              {profile.discord_tag ? (
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <DiscordIcon className="h-5 w-5 text-white/60" />
                  <span>@{profile.discord_tag}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-card-border bg-black p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-white/70">Progression globale</p>
            <span className="text-lg font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-sidebar-selected rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-card-border bg-black p-6">
          <p className="text-sm font-semibold text-white/70 mb-2">Épisodes complétés</p>
          <p className="text-3xl font-bold text-white">{completedEpisodes || 0}</p>
        </div>
      </div>

      {/* Lien vers son propre profil si on regarde celui d'un autre */}
      {!isOwnProfile && (
        <div className="rounded-lg border border-card-border bg-black p-4 text-center">
          <p className="text-white/70 text-sm">
            Vous consultez le profil d&apos;un autre membre
          </p>
        </div>
      )}
    </div>
  );
}
