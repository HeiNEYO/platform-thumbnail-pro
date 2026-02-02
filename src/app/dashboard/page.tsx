import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { FormationCard } from "@/components/ui/FormationCard";

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

  // Images du carrousel (placeholder - à remplacer par les vraies images)
  const carouselImages = [
    {
      src: "/images/carousel/polaris.jpg",
      alt: "Polaris - Système solaire",
      title: "Polaris",
    },
    {
      src: "/images/carousel/cours-videos.jpg",
      alt: "Interface de cours vidéos",
      title: "Cours vidéos",
    },
    {
      src: "/images/carousel/ateliers.jpg",
      alt: "Interface d'atelier",
      title: "Ateliers",
    },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      {/* SECTION 1 : HERO / BANNIÈRE PRINCIPALE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* BLOC GAUCHE - Texte de bienvenue */}
        <div className="relative min-h-[500px] lg:min-h-[600px] rounded-[20px] p-12 md:p-16 lg:p-20 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A] border border-[#2A2A2A] overflow-hidden">
          {/* Effet glow bleu en arrière-plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Badge/Tag */}
            <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full border border-white/30 bg-transparent">
              <span className="text-xs md:text-sm font-medium text-white">Polaris</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              Polaris
            </h1>

            {/* Sous-titre */}
            <p className="text-lg md:text-xl lg:text-2xl text-[#A0A0A0] mb-10">
              Prend une nouvelle dimension
            </p>

            {/* Description principale */}
            <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed">
              Découvrez la refonte{" "}
              <span className="text-[#3B82F6]">complète</span> de la plateforme
            </p>
          </div>
        </div>

        {/* BLOC DROITE - Carrousel d'images automatique */}
        <div className="min-h-[500px] lg:min-h-[600px]">
          <HeroCarousel images={carouselImages} interval={5000} />
        </div>
      </section>

      {/* SECTION 2 : CARTES DE FORMATIONS */}
      <section>
        {/* Titre de section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Formations
          </h2>
          <p className="text-base md:text-lg text-[#999999]">
            Continuez à vous former à travers notre contenu : Polaris, cours vidéos et ateliers interactifs
          </p>
        </div>

        {/* Grid de 3 cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Carte 1 : Polaris */}
          <FormationCard
            type="polaris"
            title="Polaris"
            description="Découvrez la méthode VKStudio pour progresser rapidement et efficacement."
            ctaText="Progresser à travers Polaris →"
            ctaHref="/dashboard/modules"
            ctaStyle="blue"
          />

          {/* Carte 2 : Cours vidéos */}
          <FormationCard
            type="cours"
            title="Cours vidéos"
            description="Regardez des cours vidéos pour apprendre à utiliser les outils de VKStudio."
            ctaText="Suivre les cours vidéos →"
            ctaHref="/dashboard/modules"
            ctaStyle="white"
          />

          {/* Carte 3 : Ateliers */}
          <FormationCard
            type="ateliers"
            title="Ateliers"
            description="Participez à des ateliers interactifs pour apprendre à utiliser les outils de VKStudio."
            ctaText="Obtenir les clefs du succès →"
            ctaHref="/dashboard/modules"
            ctaStyle="white"
          />
        </div>
      </section>
    </div>
  );
}
