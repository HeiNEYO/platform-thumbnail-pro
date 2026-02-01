import { createClient } from "@/lib/supabase/server";

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

function mapMembers(rows: any[]) {
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
      };
    })
    .sort((a, b) => b.community_score - a.community_score);
}

export async function getAllCommunityMembers(): Promise<CommunityMember[]> {
  const supabase = await createClient();

  try {
    let query = supabase
      .from("users")
      .select("id, email, full_name, avatar_url, role, twitter_handle, discord_tag, community_score")
      .order("created_at", { ascending: false });

    const { data: users, error } = await query;

    if (error) {
      const message = (error.message || "").toLowerCase();
      const isMissingColumn = message.includes("community_score") || message.includes("column \"community_score\"");
      if (isMissingColumn) {
        console.warn("⚠️ Colonne community_score absente, on la retire");
        const { data: fallbackUsers, error: fallbackError } = await supabase
          .from("users")
          .select("id, email, full_name, avatar_url, role, twitter_handle, discord_tag")
          .order("created_at", { ascending: false });

        if (fallbackError) {
          console.error("❌ Erreur lors de la récupération des membres (fallback):", fallbackError);
          return [];
        }

        return mapMembers(fallbackUsers);
      }

      console.error("❌ Erreur lors de la récupération des membres:", error);
      return [];
    }

    if (!users || users.length === 0) {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        return [
          {
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name ?? null,
            email: authUser.email ?? "",
            avatar_url: authUser.user_metadata?.avatar_url ?? null,
            twitter_handle: null,
            discord_tag: null,
            community_score: 0,
            role: "member",
          },
        ];
      }
      return [];
    }

    return mapMembers(users);
  } catch (err) {
    console.error("Erreur inattendue lors de la récupération des membres:", err);
    return [];
  }
}
