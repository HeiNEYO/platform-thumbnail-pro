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
        
        // Essayer avec les nouveaux champs
        const { data, error: queryError } = await supabase
          .from("users")
          .select("id, email, full_name, avatar_url, twitter_handle, discord_tag, community_score")
          .order("community_score", { ascending: false });

        console.log("📊 Résultat requête:", { dataCount: data?.length, error: queryError });

        if (queryError) {
          console.error("❌ Erreur requête avec nouveaux champs:", queryError);
          
          // Fallback : essayer sans les nouveaux champs
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("users")
            .select("id, email, full_name, avatar_url")
            .order("created_at", { ascending: false });

          console.log("📊 Résultat fallback:", { dataCount: fallbackData?.length, error: fallbackError });

          if (fallbackError) {
            console.error("❌ Erreur fallback:", fallbackError);
            throw fallbackError;
          }

          if (fallbackData) {
            const mappedMembers = fallbackData.map((row: any) => ({
              id: row.id,
              full_name: row.full_name,
              email: row.email,
              avatar_url: row.avatar_url,
              twitter_handle: null,
              discord_tag: null,
              community_score: 0,
            }));
            
            // Vérifier si l'utilisateur actuel est dans la liste
            const isCurrentUserInList = authUser && mappedMembers.some(m => m.id === authUser.id);
            console.log("✅ Utilisateur actuel dans la liste:", isCurrentUserInList);
            if (!isCurrentUserInList && authUser) {
              console.warn("⚠️ L'utilisateur actuel n'est pas dans la liste des membres !");
            }
            
            setMembers(mappedMembers);
          }
        } else if (data) {
          const mappedMembers = data.map((row: any) => ({
            id: row.id,
            full_name: row.full_name,
            email: row.email,
            avatar_url: row.avatar_url,
            twitter_handle: row.twitter_handle || null,
            discord_tag: row.discord_tag || null,
            community_score: row.community_score || 0,
          }));
          
          // Vérifier si l'utilisateur actuel est dans la liste
          const isCurrentUserInList = authUser && mappedMembers.some(m => m.id === authUser.id);
          console.log("✅ Utilisateur actuel dans la liste:", isCurrentUserInList);
          if (!isCurrentUserInList && authUser) {
            console.warn("⚠️ L'utilisateur actuel n'est pas dans la liste des membres !");
            console.log("📋 IDs dans la liste:", mappedMembers.map(m => m.id));
            console.log("👤 ID utilisateur actuel:", authUser.id);
          }
          
          setMembers(mappedMembers);
        }
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
