import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllCommunityMembers } from "@/lib/db/community";
import { CommunityClient } from "./CommunityClient";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  
  if (isDevMode) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-[27px] font-bold text-white mb-2">Communauté</h1>
          <p className="text-white/70 text-sm">Activez la production pour voir les membres.</p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let members: any[] = [];
  
  try {
    members = await getAllCommunityMembers();
  } catch (error) {
    console.error("❌ Erreur lors du chargement initial des membres:", error);
    // En cas d'erreur, essayer une requête simple sans les nouveaux champs
    try {
      const { data: fallbackUsers, error: fallbackError } = await supabase
        .from("users")
        .select("id, email, full_name, avatar_url, role, twitter_handle, discord_tag, latitude, longitude, city, country, show_location")
        .order("created_at", { ascending: false })
        .limit(100); // Limiter pour éviter les timeouts
      
      if (!fallbackError && fallbackUsers) {
        members = fallbackUsers.map((row: any) => ({
          id: row.id,
          full_name: row.full_name,
          email: row.email,
          avatar_url: row.avatar_url,
          twitter_handle: row.twitter_handle ?? null,
          discord_tag: row.discord_tag ?? null,
          community_score: 0,
          role: (row.role || "member") as "member" | "admin" | "intervenant",
          latitude: row.latitude != null ? Number(row.latitude) : null,
          longitude: row.longitude != null ? Number(row.longitude) : null,
          city: row.city ?? null,
          country: row.country ?? null,
          show_location: row.show_location ?? false,
        }));
      }
    } catch (fallbackErr) {
      console.error("❌ Erreur même avec le fallback:", fallbackErr);
      // En dernier recours, retourner au moins l'utilisateur connecté
      members = [{
        id: user.id,
        full_name: user.user_metadata?.full_name ?? null,
        email: user.email ?? "",
        avatar_url: user.user_metadata?.avatar_url ?? null,
        twitter_handle: null,
        discord_tag: null,
        community_score: 0,
        role: "member",
      }];
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Communauté</h1>
        <p className="text-white/70 text-sm">
          Découvrez tous les membres de la plateforme et connectez-vous avec eux
        </p>
        {members.length > 0 && (
          <p className="text-white/50 text-xs mt-1">
            {members.length} membre{members.length > 1 ? "s" : ""} inscrit{members.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Composant client pour recharger et afficher les erreurs */}
      <CommunityClient initialMembers={members} />
    </div>
  );
}
