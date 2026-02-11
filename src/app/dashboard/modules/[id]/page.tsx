import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getModuleById } from "@/lib/db/modules";
import { getEpisodesByModule, getCompletedEpisodeIds } from "@/lib/db/episodes";
import { getModuleProgress } from "@/lib/db/modules";
import { EpisodeGrid } from "@/components/EpisodeGrid";
import { Video, Users, Clock } from "lucide-react";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: moduleId } = await params;
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const [module, episodes] = await Promise.all([
    getModuleById(moduleId),
    getEpisodesByModule(moduleId),
  ]);

  if (!module) notFound();

  const [progressPercent, completedSet] = await Promise.all([
    getModuleProgress(authUser.id, moduleId),
    getCompletedEpisodeIds(authUser.id, episodes.map((ep) => ep.id)),
  ]);
  const completedFlags = episodes.map((ep) => completedSet.has(ep.id));

  // Récupérer les informations de Corentin (instructeur pour tous les modules)
  const { data: corentinProfile } = await supabase
    .from("users")
    .select("full_name, avatar_url")
    .or("full_name.ilike.%Corentin%,email.ilike.%corentin%")
    .limit(1)
    .maybeSingle();

  const corentinData = corentinProfile as { full_name: string | null; avatar_url: string | null } | null;

  // Compter les intervenants (utilisateurs avec rôle admin ou intervenant)
  const { count: intervenantsCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .in("role", ["admin", "intervenant"]);

  // Calculer la durée totale des épisodes du module
  const totalDuration = episodes.reduce((total, ep) => {
    if (!ep.duration) return total;
    // Format attendu: "HH:MM:SS" ou "MM:SS"
    const parts = ep.duration.split(":").map(Number);
    if (parts.length === 2) {
      // MM:SS
      return total + parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // HH:MM:SS
      return total + parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return total;
  }, 0);

  // Formater la durée totale en heures et minutes
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const formattedDuration = hours > 0 
    ? `${hours}h ${minutes}min`
    : `${minutes}min`;

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/60">
        <Link href="/dashboard/modules" className="hover:text-primary transition-colors">
          Formation
        </Link>
        <span>/</span>
        <span className="text-white">{module.title}</span>
      </div>

      {/* En-tête du module avec image et blur */}
      <div className="relative h-[450px] rounded-lg border border-white/10 overflow-hidden bg-[#0a0a0a]">
        {/* Image de fond - pleine hauteur */}
        <div className="absolute inset-0 w-full h-full">
          {module.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={module.image_url}
              alt={module.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-[#0a0a0a]" />
          )}
        </div>

        {/* Blur sur 22% du bas de l'image */}
        <div className="absolute bottom-0 left-0 right-0 h-[22%] backdrop-blur-md bg-gradient-to-t from-black/60 via-black/40 to-transparent border-t border-white/10">
          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
            <h1 className="text-xl font-bold text-white">{module.title}</h1>
            {module.description && (
              <p className="text-white/80 text-sm line-clamp-2">{module.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Ligne de séparation */}
      <div className="border-t border-white/10 my-4"></div>

      {/* Rectangles avec statistiques sous l'image */}
      <div className="flex items-center gap-3">
        {/* Rectangle Épisodes */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-transparent">
          <Video className="h-4 w-4 text-white/70" />
          <span className="text-sm text-white/80">{episodes.length} épisode{episodes.length > 1 ? "s" : ""}</span>
        </div>

        {/* Rectangle Durée */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-transparent">
          <Clock className="h-4 w-4 text-white/70" />
          <span className="text-sm text-white/80">{formattedDuration}</span>
        </div>

        {/* Rectangle Intervenants */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-transparent">
          <Users className="h-4 w-4 text-white/70" />
          <span className="text-sm text-white/80">{intervenantsCount || 0} intervenant{(intervenantsCount || 0) > 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Épisodes en grille verticale */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-6">Épisodes</h2>
        <EpisodeGrid
          episodes={episodes}
          moduleId={moduleId}
          completedFlags={completedFlags}
          userId={authUser.id}
          instructorName={corentinData?.full_name || "Corentin"}
          instructorAvatar={corentinData?.avatar_url || undefined}
        />
      </div>
    </div>
  );
}
