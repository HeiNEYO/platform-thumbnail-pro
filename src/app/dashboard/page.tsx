import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { FormationCard } from "@/components/ui/FormationCard";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

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

  // Récupérer le nom de l'utilisateur
  const { data: profileData } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", authUser.id)
    .single();

  type ProfileData = { full_name: string | null } | null;
  const profile = profileData as ProfileData;
  const displayName = profile?.full_name || authUser.email?.split("@")[0] || "Membre";

  // Images du bandeau avec titres et sous-titres
  const bannerImages = [
    {
      src: "/images/carousel/image1.png",
      alt: "Homme entre Lamborghini et Audi R8 devant un château",
      title: "DÉCOUVREZ LE 8LAB ECOSYSTEM : THE INFINITE",
      subtitle: "Le début d'une nouvelle ère pour le e-commerce francophone.",
    },
    {
      src: "/images/carousel/image2.png",
      alt: "Scène de soirée avec voitures de luxe",
      title: "EXPÉRIENCE PREMIUM",
      subtitle: "Rejoignez une communauté exclusive et développez votre business.",
    },
    {
      src: "/images/carousel/image3.png",
      alt: "Moment décontracté entre amis",
      title: "COMMUNAUTÉ & PARTAGE",
      subtitle: "Connectez-vous avec d'autres entrepreneurs et partagez vos expériences.",
    },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Message de bienvenue */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Bonjour {displayName}
        </h1>
        <p className="text-sm md:text-base text-[#999999]">
          Bienvenue dans le laboratoire. Chaque connexion vous rapproche du prochain palier. Let's grind.
        </p>
      </div>

      {/* SECTION 1 : BANDEAU PRINCIPAL */}
      <section>
        <HeroBanner images={bannerImages} interval={5000} />
      </section>

      {/* SECTION 2 : CARTES DE FORMATIONS */}
      <section>
        {/* Titre de section */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Formations
          </h2>
          <p className="text-sm md:text-base text-[#999999]">
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
            title="Ateliers interactifs"
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
