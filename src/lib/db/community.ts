import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/lib/supabase/database.types";

export interface CommunityMember {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  twitter_handle: string | null;
  discord_tag: string | null;
  community_score: number;
  role: "member" | "admin" | "intervenant";
}

export async function getAllCommunityMembers(): Promise<CommunityMember[]> {
  const supabase = await createClient();
  
  try {
    // Essayer d'abord avec les nouveaux champs
    let query = supabase
      .from("users")
      .select("id, email, full_name, avatar_url, twitter_handle, discord_tag, community_score, role");
    
    const { data, error } = await query.order("community_score", { ascending: false });

    if (error) {
      // Si erreur (colonnes manquantes), essayer sans les nouveaux champs
      console.warn("Erreur avec nouveaux champs, tentative sans:", error.message);
      
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("users")
        .select("id, email, full_name, avatar_url")
        .order("created_at", { ascending: false });

      if (fallbackError) {
        console.error("Erreur lors de la récupération des membres:", fallbackError);
        return [];
      }

      if (!fallbackData) return [];

      return fallbackData.map((row: UserRow) => ({
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

    if (!data) return [];

    return data.map((row: UserRow & { twitter_handle?: string | null; discord_tag?: string | null; community_score?: number | null }) => ({
      id: row.id,
      full_name: row.full_name,
      email: row.email,
      avatar_url: row.avatar_url,
      twitter_handle: row.twitter_handle || null,
      discord_tag: row.discord_tag || null,
      community_score: row.community_score || 0,
      role: (row.role || "member") as "member" | "admin" | "intervenant",
    }));
  } catch (err) {
    console.error("Erreur inattendue lors de la récupération des membres:", err);
    return [];
  }
}
