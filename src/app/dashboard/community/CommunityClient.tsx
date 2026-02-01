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
        
        // Essayer d'abord avec toutes les colonnes (y compris instagram_handle)
        let allUsersData: any[] | null = null;
        let allUsersError: any = null;
        
        const { data, error } = await supabase
          .from("users")
          .select("id, email, full_name, avatar_url, role, discord_tag, instagram_handle, community_score")
          .order("created_at", { ascending: false });

        allUsersData = data;
        allUsersError = error;

        // Si erreur due à une colonne manquante (instagram_handle), réessayer sans
        if (allUsersError) {
          const errorMessage = allUsersError.message || "";
          const errorCode = allUsersError.code || "";
          
          if (
            errorMessage.includes("instagram_handle") ||
            errorMessage.includes("column") ||
            errorMessage.includes("does not exist") ||
            errorCode === "PGRST116" ||
            errorCode === "42703"
          ) {
            console.warn("⚠️ Colonne instagram_handle absente, chargement sans cette colonne");
            
            // Réessayer sans instagram_handle
            const { data: fallbackData, error: fallbackError } = await supabase
              .from("users")
              .select("id, email, full_name, avatar_url, role, discord_tag, community_score")
              .order("created_at", { ascending: false });
            
            if (fallbackError) {
              console.error("❌ Erreur lors du chargement complet (fallback):", fallbackError);
              throw fallbackError;
            }
            
            allUsersData = fallbackData;
            allUsersError = null;
          } else {
            console.error("❌ Erreur lors du chargement complet:", allUsersError);
            throw allUsersError;
          }
        }

        if (!allUsersData) {
          setMembers([]);
          return;
        }

        console.log("✅ Tous les utilisateurs chargés:", allUsersData.length);
        
        // Afficher les handles trouvés
        const usersWithHandles = allUsersData.filter((u: any) => 
          (u.discord_tag && u.discord_tag.trim() !== "") || 
          (u.instagram_handle && u.instagram_handle.trim() !== "")
        );
        console.log("👥 Utilisateurs avec handles:", usersWithHandles.length);
        if (usersWithHandles.length > 0) {
          console.log("📋 Handles trouvés:", usersWithHandles.map((u: any) => ({
            email: u.email,
            discord: u.discord_tag,
            instagram: u.instagram_handle,
          })));
        }

        // Mapper directement depuis allUsersData (qui contient déjà les handles)
        const mappedMembers = allUsersData.map((row: any) => {
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

        // Trier par score communautaire
        mappedMembers.sort((a, b) => b.community_score - a.community_score);

        // Debug : vérifier les handles chargés
        console.log("📊 Membres chargés:", mappedMembers.length);
        const membersWithHandles = mappedMembers.filter(m => m.discord_tag || m.instagram_handle);
        console.log("👥 Membres avec handles:", membersWithHandles.length);
        if (membersWithHandles.length > 0) {
          console.log("📋 Exemples de handles:", membersWithHandles.slice(0, 3).map(m => ({
            id: m.id,
            name: m.full_name || m.email,
            discord: m.discord_tag,
            instagram: m.instagram_handle,
          })));
        } else {
          console.warn("⚠️ Aucun membre avec handles trouvé !");
          console.log("📋 Tous les membres:", mappedMembers.map(m => ({
            id: m.id,
            name: m.full_name || m.email,
            discord: m.discord_tag,
            instagram: m.instagram_handle,
          })));
        }
        
        let finalMembers = mappedMembers;
        if (finalMembers.length === 0 && authUser) {
          const displayName = authUser.user_metadata?.full_name ?? null;
          const avatarUrl = authUser.user_metadata?.avatar_url ?? null;
          finalMembers = [
            {
              id: authUser.id,
              full_name: displayName,
              email: authUser.email ?? "",
              avatar_url: avatarUrl,
              twitter_handle: null,
              discord_tag: null,
              instagram_handle: null,
              community_score: 0,
              role: "member" as const,
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
