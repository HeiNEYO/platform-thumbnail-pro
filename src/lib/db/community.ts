import { createClient } from "@/lib/supabase/server";

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

const baseColumns = ["id", "email", "full_name", "avatar_url", "role"];
const optionalColumns = ["discord_tag", "instagram_handle", "community_score"];

async function selectUsersFlexibly() {
  const supabase = await createClient();
  let optional = [...optionalColumns];

  while (true) {
    const columnsToSelect = [...baseColumns, ...optional].join(", ");
    const { data, error } = await supabase
      .from("users")
      .select(columnsToSelect)
      .order("created_at", { ascending: false });

    if (!error) {
      return data || [];
    }

    const message = (error.message || "").toLowerCase();
    const missingColumn = optional.find((column) => message.includes(column));

    if (!missingColumn) {
      console.error("❌ Erreur inattendue lors de la récupération des membres :", error);
      return [];
    }

    console.warn(`⚠️ Colonne ${missingColumn} manquante, on la retire de la requête`);
    optional = optional.filter((column) => column !== missingColumn);
  }
}

export async function getAllCommunityMembers(): Promise<CommunityMember[]> {
  const supabase = await createClient();

  try {
    const rows = await selectUsersFlexibly();

    if (rows.length === 0) {
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
            instagram_handle: null,
            community_score: 0,
            role: "member",
          },
        ];
      }
    }

    return rows
      .map((row: any) => {
        const discordTag = row.discord_tag && row.discord_tag.trim() !== "" ? row.discord_tag.trim() : null;
        const instagramHandle =
          row.instagram_handle && row.instagram_handle.trim() !== "" ? row.instagram_handle.trim() : null;
        const communityScore = typeof row.community_score === "number" ? row.community_score : 0;

        return {
          id: row.id,
          full_name: row.full_name,
          email: row.email,
          avatar_url: row.avatar_url,
          twitter_handle: null,
          discord_tag: discordTag,
          instagram_handle: instagramHandle,
          community_score: communityScore,
          role: (row.role || "member") as "member" | "admin" | "intervenant",
        };
      })
      .sort((a, b) => b.community_score - a.community_score);
  } catch (err) {
    console.error("Erreur inattendue lors de la récupération des membres:", err);
    return [];
  }
}
