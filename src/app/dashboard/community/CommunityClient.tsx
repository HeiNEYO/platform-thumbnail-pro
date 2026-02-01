"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MemberCard } from "@/components/ui/MemberCard";
import { createClient } from "@/lib/supabase/client";
import type { CommunityMember } from "@/lib/db/community";

export function CommunityClient({ initialMembers }: { initialMembers: CommunityMember[] }) {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState<CommunityMember[]>(initialMembers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recharger les membres côté client pour voir les erreurs en temps réel
    const loadMembers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        // Récupérer l'utilisateur actuel pour debug
        const { data: { user: authUser } } = await supabase.auth.getUser();
        console.log("🔍 Utilisateur connecté:", authUser?.id, authUser?.email);
        
        // Charger les données de base
        const { data: baseData, error: baseError } = await supabase
          .from("users")
          .select("id, email, full_name, avatar_url, role")
          .order("created_at", { ascending: false });

        if (baseError) {
          throw baseError;
        }

        if (!baseData) {
          setMembers([]);
          return;
        }

        // Charger les handles séparément (pour éviter les erreurs si les colonnes n'existent pas)
        let handlesMap: Record<string, { twitter_handle?: string | null; discord_tag?: string | null; community_score?: number }> = {};
        
        const { data: handlesData, error: handlesError } = await supabase
          .from("users")
          .select("id, twitter_handle, discord_tag, community_score");

        if (handlesError) {
          console.warn("⚠️ Erreur lors du chargement des handles:", handlesError.message);
        } else if (handlesData) {
          handlesData.forEach((row: any) => {
            handlesMap[row.id] = {
              twitter_handle: row.twitter_handle || null,
              discord_tag: row.discord_tag || null,
              community_score: row.community_score || 0,
            };
          });
        }

        // Mapper les membres avec leurs handles
        const mappedMembers = baseData.map((row: any) => {
          const handles = handlesMap[row.id] || {};
          return {
            id: row.id,
            full_name: row.full_name,
            email: row.email,
            avatar_url: row.avatar_url,
            twitter_handle: handles.twitter_handle || null,
            discord_tag: handles.discord_tag || null,
            community_score: handles.community_score || 0,
            role: (row.role || "member") as "member" | "admin" | "intervenant",
          };
        });

        // Trier par score communautaire
        mappedMembers.sort((a, b) => b.community_score - a.community_score);

        // Debug : vérifier les handles chargés
        console.log("📊 Membres chargés:", mappedMembers.length);
        const membersWithHandles = mappedMembers.filter(m => m.twitter_handle || m.discord_tag);
        console.log("👥 Membres avec handles:", membersWithHandles.length);
        if (membersWithHandles.length > 0) {
          console.log("📋 Exemples de handles:", membersWithHandles.slice(0, 3).map(m => ({
            name: m.full_name || m.email,
            twitter: m.twitter_handle,
            discord: m.discord_tag
          })));
        }
        
        setMembers(mappedMembers);
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
      <div className="rounded-lg border border-card-border bg-black p-12 text-center">
        <p className="text-white/70">Chargement des membres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-card-border bg-black p-12 text-center">
        <p className="text-white/70 mb-2">Erreur : {error}</p>
        <p className="text-xs text-white/50">
          Vérifiez la console pour plus de détails (F12)
        </p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-card-border bg-black p-12 text-center">
        <p className="text-white/70 mb-2">Aucun membre pour le moment.</p>
        <p className="text-xs text-white/50 mb-4">
          Les membres apparaîtront ici une fois inscrits.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg text-left">
            <p className="text-warning text-xs font-semibold mb-2">🔍 Debug Info:</p>
            <p className="text-white/70 text-xs">
              Utilisateur connecté: {currentUser?.email || "Non connecté"}
            </p>
            <p className="text-white/70 text-xs">
              ID: {currentUser?.id || "N/A"}
            </p>
            <p className="text-white/70 text-xs mt-2">
              Ouvrez la console (F12) pour voir les logs détaillés.
            </p>
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
