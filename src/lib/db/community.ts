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
    // Charger d'abord les données de base (toujours présentes)
    const { data: baseData, error: baseError } = await supabase
      .from("users")
      .select("id, email, full_name, avatar_url, role")
      .order("created_at", { ascending: false });

    if (baseError || !baseData) {
      console.error("Erreur lors de la récupération des membres:", baseError);
      return [];
    }

    // Charger les handles et scores en une seule requête
    let handlesMap: Record<string, { twitter_handle?: string | null; discord_tag?: string | null; community_score?: number }> = {};
    
    const { data: handlesData, error: handlesError } = await supabase
      .from("users")
      .select("id, twitter_handle, discord_tag, community_score");

    if (handlesError) {
      console.warn("Erreur lors du chargement des handles (colonnes peuvent ne pas exister):", handlesError.message);
    } else if (handlesData) {
      handlesData.forEach((row: any) => {
        handlesMap[row.id] = {
          twitter_handle: row.twitter_handle || null,
          discord_tag: row.discord_tag || null,
          community_score: row.community_score || 0,
        };
      });
    }

    // Mapper les données avec les handles
    const members = baseData.map((row: UserRow) => {
      const handles = handlesMap[row.id] || {};
      // Nettoyer les handles : s'assurer qu'ils ne sont pas des chaînes vides
      const twitterHandle = handles.twitter_handle && handles.twitter_handle.trim() !== "" 
        ? handles.twitter_handle.trim() 
        : null;
      const discordTag = handles.discord_tag && handles.discord_tag.trim() !== "" 
        ? handles.discord_tag.trim() 
        : null;
      
      return {
        id: row.id,
        full_name: row.full_name,
        email: row.email,
        avatar_url: row.avatar_url,
        twitter_handle: twitterHandle,
        discord_tag: discordTag,
        community_score: handles.community_score || 0,
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
