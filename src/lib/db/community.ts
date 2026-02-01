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
}

export async function getAllCommunityMembers(): Promise<CommunityMember[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, twitter_handle, discord_tag, community_score")
    .order("community_score", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des membres:", error);
    return [];
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
  }));
}
