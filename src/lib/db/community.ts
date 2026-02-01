import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/lib/supabase/database.types";

export interface CommunityMember {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  twitter_handle: string | null;
  discord_tag: string | null;
  instagram_handle: string | null;
  community_score: number;
  role: "member" | "admin" | "intervenant";
}

export async function getAllCommunityMembers(): Promise<CommunityMember[]> {
  const supabase = await createClient();
  
  try {
    // Charger TOUS les utilisateurs avec leurs handles en une seule requête
    const { data: allUsersData, error: allUsersError } = await supabase
      .from("users")
      .select("id, email, full_name, avatar_url, role, twitter_handle, discord_tag, instagram_handle, community_score")
      .order("created_at", { ascending: false });

    if (allUsersError) {
      console.error("❌ Erreur lors de la récupération des membres:", allUsersError);
      return [];
    }

    if (!allUsersData) {
      return [];
    }

    console.log("✅ Membres chargés (serveur):", allUsersData.length);
    
    // Afficher les handles trouvés
    const usersWithHandles = allUsersData.filter((u: any) => 
      (u.discord_tag && u.discord_tag.trim() !== "") || 
      (u.instagram_handle && u.instagram_handle.trim() !== "")
    );
    console.log("👥 Utilisateurs avec handles (serveur):", usersWithHandles.length);
    if (usersWithHandles.length > 0) {
      console.log("📋 Handles trouvés (serveur):", usersWithHandles.map((u: any) => ({
        email: u.email,
        discord: u.discord_tag,
        instagram: u.instagram_handle,
      })));
    }

    // Mapper les données avec les handles nettoyés
    const members = allUsersData.map((row: any) => {
      // Nettoyer les handles : s'assurer qu'ils ne sont pas des chaînes vides
      const discordTag = row.discord_tag && row.discord_tag.trim() !== "" 
        ? row.discord_tag.trim() 
        : null;
      const instagramHandle = row.instagram_handle && row.instagram_handle.trim() !== "" 
        ? row.instagram_handle.trim() 
        : null;
      
      return {
        id: row.id,
        full_name: row.full_name,
        email: row.email,
        avatar_url: row.avatar_url,
        twitter_handle: null, // On garde pour compatibilité mais on n'affiche plus
        discord_tag: discordTag,
        instagram_handle: instagramHandle,
        community_score: row.community_score || 0,
        role: (row.role || "member") as "member" | "admin" | "intervenant",
      };
    });

    // Trier par score communautaire (décroissant)
    return members.sort((a, b) => b.community_score - a.community_score);
  } catch (err) {
    console.error("Erreur inattendue lors de la récupération des membres:", err);
    return [];
  }
}
