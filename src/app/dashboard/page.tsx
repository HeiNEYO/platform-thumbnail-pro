import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { FormationCard } from "@/components/ui/FormationCard";
import { DiscordBanner } from "@/components/ui/DiscordBanner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
          {/* Carte 1 : Formation */}
          <FormationCard
            type="formation"
            title="Formation"
            description="Un programme conçu pour vous faire progresser dans la création de miniatures avec des contenus à jour et directement applicables."
            ctaText="Découvrir la Formation →"
            ctaHref="/dashboard/modules"
            ctaStyle="white"
            stats={{
              duration: "44h12",
              parts: 8,
              videos: 150,
            }}
          />

          {/* Carte 2 : Plateforme */}
          <FormationCard
            type="plateforme"
            title="Plateforme"
            description="Un espace conçu pour les créateurs qui veulent maîtriser l'art des miniatures, optimiser leur workflow et développer leur expertise."
            ctaText="Explorer la Plateforme →"
            ctaHref="/dashboard/modules"
            ctaStyle="white"
            stats={{
              duration: "14h44",
              parts: 10,
              videos: 55,
            }}
          />

          {/* Carte 3 : Communauté */}
          <FormationCard
            type="communaute"
            title="Communauté"
            description="Un espace d'entraide, de partages et de connexions avec des créateurs partageant les mêmes ambitions dans le minia making."
            ctaText="Rejoindre la Communauté"
            ctaHref="/dashboard/community"
            ctaStyle="white"
            stats={{
              members: 1944,
              coaches: 4,
              availability: "24h/6j",
            }}
          />
        </div>

        {/* Bandeau Discord */}
        <div className="mt-8">
          <DiscordBanner />
        </div>

        {/* Bouton Explorer la formation */}
        <div className="flex justify-center mt-6">
          <Link
            href="/dashboard/modules"
            className="bg-white text-[#0A0A0A] px-8 py-4 rounded-xl font-semibold text-sm md:text-base flex items-center gap-2 hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1"
          >
            <span>Explorer la formation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
