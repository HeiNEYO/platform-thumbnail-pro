"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { MemberCard } from "@/components/ui/MemberCard";
import { MemberCardSkeleton } from "@/components/ui/MemberCardSkeleton";
import { createClient } from "@/lib/supabase/client";
import type { CommunityMember } from "@/lib/db/community";
import { MapPin, Users } from "lucide-react";
import dynamic from "next/dynamic";

// Import dynamique de la carte pour éviter les problèmes SSR
const MembersMap = dynamic(() => import("./MembersMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-lg border border-white/10 bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-white/50">Chargement de la carte...</div>
    </div>
  ),
});

function mapMembersFromRows(rows: any[]): CommunityMember[] {
  return rows
    .map((row: any) => {
      const twitterHandle = row.twitter_handle && row.twitter_handle.trim() !== "" ? row.twitter_handle.trim() : null;
      const discordTag = row.discord_tag && row.discord_tag.trim() !== "" ? row.discord_tag.trim() : null;
      const communityScore = typeof row.community_score === "number" ? row.community_score : 0;

      return {
        id: row.id,
        full_name: row.full_name,
        email: row.email,
        avatar_url: row.avatar_url,
        twitter_handle: twitterHandle,
        discord_tag: discordTag,
        community_score: communityScore,
        role: (row.role || "member") as "member" | "admin" | "intervenant",
        latitude: row.latitude != null ? Number(row.latitude) : null,
        longitude: row.longitude != null ? Number(row.longitude) : null,
        city: row.city ?? null,
        country: row.country ?? null,
        show_location: row.show_location ?? false,
      };
    })
    .sort((a, b) => b.community_score - a.community_score);
}

/**
 * Récupère TOUS les membres de la communauté sans aucun filtre
 * Tous les membres authentifiés doivent pouvoir voir tous les autres membres
 */
async function queryMembers(fallbackWithoutScore = false) {
  const supabase = createClient();
  const columns = fallbackWithoutScore
    ? "id, email, full_name, avatar_url, role, twitter_handle, discord_tag, latitude, longitude, city, country, show_location"
    : "id, email, full_name, avatar_url, role, twitter_handle, discord_tag, community_score, latitude, longitude, city, country, show_location";
  // Récupération de TOUS les utilisateurs sans filtre
  return supabase
    .from("users")
    .select(columns)
    .order("created_at", { ascending: false });
}

type TabType = "list" | "map";

export function CommunityClient({ initialMembers }: { initialMembers: CommunityMember[] }) {
  const { user: currentUser } = useAuth();
  const pathname = usePathname();
  const [members, setMembers] = useState<CommunityMember[]>(initialMembers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("list");
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const lastLoadTimeRef = useRef<number>(0);
  const lastPathnameRef = useRef<string>("");

  const loadMembers = async (forceRefresh = false) => {
    // Éviter les requêtes multiples simultanées
    if (isLoadingRef.current) return;
    
    // Si on a déjà chargé récemment (moins de 5 secondes) et qu'on ne force pas, ne pas recharger
    const now = Date.now();
    if (!forceRefresh && hasLoadedRef.current && (now - lastLoadTimeRef.current < 5000)) {
      return;
    }
    
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

      try {
        // Essayer d'abord avec community_score
        let { data, error } = await queryMembers();

        if (error) {
          const message = (error.message || "").toLowerCase();
          const requiresFallback =
            message.includes("community_score") || 
            message.includes("column \"community_score\"") ||
            message.includes("does not exist");

          if (requiresFallback) {
            console.warn("⚠️ Column community_score missing, retry without it (client)");
            ({ data, error } = await queryMembers(true));
            
            // Si le fallback échoue aussi, vérifier les politiques RLS
            if (error) {
              const rlsError = message.includes("policy") || message.includes("permission") || message.includes("row-level");
              if (rlsError) {
                console.error("❌ Erreur RLS détectée. Vérifiez les politiques dans Supabase.");
                throw new Error("Erreur de permissions. Vérifiez que les politiques RLS permettent aux membres de voir tous les autres membres.");
              }
              throw error;
            }
          } else {
            // Autre type d'erreur
            console.error("❌ Erreur lors de la récupération des membres:", error);
            throw error;
          }
        }

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn("⚠️ Aucune donnée retournée par la requête");
          // Si aucun membre mais qu'on a un utilisateur connecté, afficher au moins son profil
          if (currentUser) {
            setMembers([{
              id: currentUser.id,
              full_name: currentUser.full_name ?? null,
              email: currentUser.email ?? "",
              avatar_url: currentUser.avatar_url ?? null,
              twitter_handle: null,
              discord_tag: null,
              community_score: 0,
              role: "member",
            }]);
            return;
          }
          setMembers([]);
          return;
        }

        const mapped = mapMembersFromRows(data);

        let finalMembers = mapped.sort((a, b) => b.community_score - a.community_score);

        if (finalMembers.length === 0 && currentUser) {
          finalMembers = [
            {
              id: currentUser.id,
              full_name: currentUser.full_name ?? null,
              email: currentUser.email ?? "",
              avatar_url: currentUser.avatar_url ?? null,
              twitter_handle: null,
              discord_tag: null,
              community_score: 0,
              role: "member",
            },
          ];
        }

        setMembers(finalMembers);
        hasLoadedRef.current = true;
        lastLoadTimeRef.current = Date.now();
        console.log(`✅ ${finalMembers.length} membre(s) chargé(s) avec succès`);
      } catch (err: any) {
        console.error("❌ Erreur lors du chargement des membres:", err);
        const errorMessage = err.message || err.toString() || "Erreur lors du chargement des membres";
        
        // Ne pas afficher l'erreur si on a déjà des membres initiaux
        // Cela évite de casser l'affichage si le rechargement échoue
        if (initialMembers.length === 0) {
          setError(errorMessage);
        } else {
          // Garder les membres initiaux même en cas d'erreur
          console.warn("⚠️ Erreur lors du rechargement, utilisation des données initiales");
        }
        
        // Afficher plus de détails en développement
        if (process.env.NODE_ENV === "development") {
          console.error("Détails de l'erreur:", {
            message: err.message,
            code: err.code,
            details: err.details,
            hint: err.hint,
            status: err.status,
          });
        }
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
  };

  // Chargement initial
  useEffect(() => {
    // Si on a déjà des membres initiaux, ne pas recharger immédiatement
    // Utiliser les données du serveur directement
    if (initialMembers.length > 0 && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      lastLoadTimeRef.current = Date.now();
      return;
    }

    // Si on a déjà chargé ou si une requête est en cours, ne pas recharger
    if (hasLoadedRef.current || isLoadingRef.current) {
      return;
    }

    // Ne charger qu'une seule fois, seulement si on n'a pas de membres initiaux
    if (initialMembers.length === 0 && currentUser) {
      loadMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, initialMembers.length]);

  // Rafraîchir quand on revient sur la route /dashboard/community
  useEffect(() => {
    // Si on vient d'une autre route et qu'on revient sur /dashboard/community
    if (pathname === "/dashboard/community" && lastPathnameRef.current !== pathname && hasLoadedRef.current && currentUser) {
      // Attendre un peu avant de rafraîchir pour éviter les requêtes multiples
      const timeoutId = setTimeout(() => {
        loadMembers(true);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
    lastPathnameRef.current = pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, currentUser?.id]);

  // Rafraîchir quand la page redevient visible (quand on revient sur l'onglet du navigateur)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && hasLoadedRef.current && currentUser && pathname === "/dashboard/community") {
        // Attendre un peu avant de rafraîchir pour éviter les requêtes multiples
        setTimeout(() => {
          loadMembers(true);
        }, 500);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, pathname]);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton pour Administrateurs */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-5 w-8 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2].map((i) => (
              <MemberCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Skeleton pour Intervenants */}
        <div className="space-y-4">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-28 bg-white/10 rounded animate-pulse" />
            <div className="h-5 w-8 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3].map((i) => (
              <MemberCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Skeleton pour Membres */}
        <div className="space-y-4">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-5 w-8 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <MemberCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-card-border bg-[#0a0a0a] p-12 text-center">
        <p className="text-white/70 mb-2">Erreur : {error}</p>
        <p className="text-xs text-white/50">Vérifiez la console pour plus de détails (F12)</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-card-border bg-[#0a0a0a] p-12 text-center">
        <p className="text-white/70 mb-2">Aucun membre pour le moment.</p>
        <p className="text-xs text-white/50 mb-4">Les membres apparaîtront ici une fois inscrits.</p>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg text-left">
            <p className="text-warning text-xs font-semibold mb-2">🔍 Debug Info:</p>
            <p className="text-white/70 text-xs">Utilisateur connecté: {currentUser?.email || "Non connecté"}</p>
            <p className="text-white/70 text-xs">ID: {currentUser?.id || "N/A"}</p>
            <p className="text-white/70 text-xs mt-2">Ouvrez la console (F12) pour voir les logs détaillés.</p>
          </div>
        )}
      </div>
    );
  }

  // Séparer les membres par rôle et trier par score dans chaque section
  const admins = members
    .filter((m) => m.role === "admin")
    .sort((a, b) => b.community_score - a.community_score);
  
  const intervenants = members
    .filter((m) => m.role === "intervenant")
    .sort((a, b) => b.community_score - a.community_score);
  
  const regularMembers = members
    .filter((m) => m.role === "member" || (!m.role || (m.role !== "admin" && m.role !== "intervenant")))
    .sort((a, b) => b.community_score - a.community_score);

  // Composant de section réutilisable
  const Section = ({ 
    title, 
    members: sectionMembers, 
    showDivider = true 
  }: { 
    title: string; 
    members: CommunityMember[]; 
    showDivider?: boolean;
  }) => {
    if (sectionMembers.length === 0) return null;

    return (
      <div className="space-y-4">
        {showDivider && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
          </div>
        )}
        
        {/* Titre de section */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            {title}
          </h2>
          <span className="text-sm text-white/50 font-medium">
            ({sectionMembers.length})
          </span>
        </div>

        {/* Grille de cartes */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sectionMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    );
  };

  // Membres avec localisation activée pour la carte (show_location = true + lat/lng valides)
  const showLocationTruthy = (v: unknown) => v === true || v === "true" || v === 1;
  const membersWithLocation = members.filter(m => {
    const lat = m.latitude != null ? Number(m.latitude) : NaN;
    const lng = m.longitude != null ? Number(m.longitude) : NaN;
    const showOk = showLocationTruthy(m.show_location);
    return showOk && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  });

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="flex items-center gap-3 border-b border-white/10">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "list"
              ? "text-white border-[#1D4ED8]"
              : "text-white/60 border-transparent hover:text-white/80"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Liste</span>
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "map"
              ? "text-white border-[#1D4ED8]"
              : "text-white/60 border-transparent hover:text-white/80"
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Cartes membres</span>
          {membersWithLocation.length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-[#1D4ED8]/20 text-[#1D4ED8]">
              {membersWithLocation.length}
            </span>
          )}
        </button>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === "list" ? (
        <div className="space-y-8">
          {/* Section Administrateurs */}
          <Section 
            title="Administrateurs" 
            members={admins} 
            showDivider={false}
          />

          {/* Section Intervenants */}
          <Section 
            title="Intervenants" 
            members={intervenants}
            showDivider={admins.length > 0}
          />

          {/* Section Membres */}
          <Section 
            title="Membres" 
            members={regularMembers}
            showDivider={admins.length > 0 || intervenants.length > 0}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {membersWithLocation.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-white/70 text-sm">
                  {membersWithLocation.length} membre{membersWithLocation.length > 1 ? "s" : ""} visible{membersWithLocation.length > 1 ? "s" : ""} sur la carte
                </p>
                <p className="text-white/50 text-xs">
                  Activez l'affichage de votre localisation dans votre profil pour apparaître sur la carte
                </p>
              </div>
              {/* Diagnostic : vérifier que les données ont bien lat/lng */}
              <div className="rounded-lg border border-white/10 bg-[#0a0a0a]/80 px-3 py-2 text-xs text-white/60">
                Données reçues : {members.length} membre(s) au total. Affichés sur la carte : {membersWithLocation.length} (avec localisation activée et coordonnées valides).
                {membersWithLocation.length > 0 && (
                  <span className="block mt-1 text-white/50">
                    Ex. {membersWithLocation[0].full_name || "Membre"} — {membersWithLocation[0].city || ""} {membersWithLocation[0].country || ""} ({Number(membersWithLocation[0].latitude)?.toFixed(2)}, {Number(membersWithLocation[0].longitude)?.toFixed(2)})
                  </span>
                )}
              </div>
              <MembersMap members={membersWithLocation as any} />
            </>
          ) : (
            <div className="h-[600px] rounded-lg border border-white/10 bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center">
              <MapPin className="h-12 w-12 text-white/30 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Aucun membre visible sur la carte</h3>
              <p className="text-white/60 text-sm max-w-md mb-4">
                Aucun membre n'a activé l'affichage de sa localisation pour le moment.
                Activez cette option dans votre profil pour apparaître sur la carte !
              </p>
              <p className="text-white/40 text-xs max-w-md">
                Données : {members.length} membre(s) chargé(s). Pour apparaître ici : Profil → Ville et Pays → cocher « Afficher ma localisation » → Enregistrer. Vérifiez aussi que le script <code className="bg-white/10 px-1 rounded">supabase-add-location-fields.sql</code> a été exécuté dans Supabase.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
