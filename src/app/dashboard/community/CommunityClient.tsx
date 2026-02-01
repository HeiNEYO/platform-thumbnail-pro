"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MemberCard } from "@/components/ui/MemberCard";
import { createClient } from "@/lib/supabase/client";
import type { CommunityMember } from "@/lib/db/community";

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
      };
    })
    .sort((a, b) => b.community_score - a.community_score);
}

async function queryMembers(fallbackWithoutScore = false) {
  const supabase = createClient();
  const columns = fallbackWithoutScore
    ? "id, email, full_name, avatar_url, role, twitter_handle, discord_tag"
    : "id, email, full_name, avatar_url, role, twitter_handle, discord_tag, community_score";
  return supabase
    .from("users")
    .select(columns)
    .order("created_at", { ascending: false });
}

export function CommunityClient({ initialMembers }: { initialMembers: CommunityMember[] }) {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState<CommunityMember[]>(initialMembers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      setError(null);

      try {
        let { data, error } = await queryMembers();

        if (error) {
          const message = (error.message || "").toLowerCase();
          const requiresFallback =
            message.includes("community_score") || message.includes("column \"community_score\"");

          if (requiresFallback) {
            console.warn("⚠️ Column community_score missing, retry without it (client)");
            ({ data, error } = await queryMembers(true));
          } else {
            throw error;
          }
        }

        if (error) {
          throw error;
        }

        const mapped = mapMembersFromRows(data || []);

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
      } catch (err: any) {
        console.error("❌ Erreur lors du chargement des membres:", err);
        setError(err.message || "Erreur lors du chargement des membres");
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="rounded-lg border border-card-border bg-[#0a0a0a] p-12 text-center">
        <p className="text-white/70">Chargement des membres...</p>
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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
