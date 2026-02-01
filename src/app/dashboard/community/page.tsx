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

  let members = await getAllCommunityMembers();

  // Si aucun membre, vérifier s'il y a des utilisateurs dans la table
  if (members.length === 0) {
    const { data: usersCheck } = await supabase
      .from("users")
      .select("id")
      .limit(1);
    
    if (usersCheck && usersCheck.length > 0) {
      // Il y a des utilisateurs mais la requête a échoué, réessayer sans les nouveaux champs
      const { data: allUsers } = await supabase
        .from("users")
        .select("id, email, full_name, avatar_url, role")
        .order("created_at", { ascending: false });
      
      if (allUsers) {
        members = allUsers.map((row: { id: string; email: string; full_name: string | null; avatar_url: string | null; role?: string }) => ({
          id: row.id,
          full_name: row.full_name,
          email: row.email,
          avatar_url: row.avatar_url,
          twitter_handle: null,
          discord_tag: null,
          community_score: 0,
          role: (row.role || "member") as "member" | "admin" | "intervenant",
        }));
      }
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
