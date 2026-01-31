"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthUser } from "@/lib/auth";
import type { UserRole } from "@/lib/supabase/database.types";

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => {
    // En mode dev, ne pas créer le client Supabase
    if (isDevMode) {
      return null;
    }
    try {
      return createClient();
    } catch {
      return null;
    }
  });

  // Fonction pour récupérer le profil utilisateur depuis la table users
  const fetchUserProfile = useCallback(async (authId: string, authEmail: string): Promise<AuthUser | null> => {
    if (!supabase) return null;

    try {
      // Essayer de récupérer le profil existant
      const { data, error } = await supabase
        .from("users")
        .select("id, email, full_name, avatar_url, role")
        .eq("id", authId)
        .single();

      // Si le profil existe, le retourner
      if (data && !error) {
        return {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          role: data.role as UserRole,
        };
      }

      // Si le profil n'existe pas (erreur PGRST116 = not found), le créer
      if (error?.code === 'PGRST116' || error?.message?.includes('No rows')) {
        console.log("Profil non trouvé, création automatique...");
        
        const { data: newProfile, error: insertError } = await supabase
          .from("users")
          .insert({
            id: authId,
            email: authEmail,
            full_name: null,
            role: 'member',
          })
          .select()
          .single();

        if (insertError) {
          console.error("Erreur lors de la création du profil:", insertError);
          // Même en cas d'erreur, retourner un profil minimal
          return {
            id: authId,
            email: authEmail,
            full_name: null,
            avatar_url: null,
            role: 'member',
          };
        }

        if (newProfile) {
          return {
            id: newProfile.id,
            email: newProfile.email,
            full_name: newProfile.full_name,
            avatar_url: newProfile.avatar_url,
            role: newProfile.role as UserRole,
          };
        }
      }

      // Autre erreur
      console.error("Erreur fetchUserProfile:", error?.message || "Données manquantes");
      return null;
    } catch (err) {
      console.error("Erreur lors de la récupération du profil:", err);
      return null;
    }
  }, [supabase]);

  // Mode dev : initialiser avec un utilisateur mock
  useEffect(() => {
    if (isDevMode) {
      setUser({
        id: 'dev-user-123',
        email: 'dev@example.com',
        full_name: 'Utilisateur Développement',
        avatar_url: null,
        role: 'admin',
      });
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    // Timeout de sécurité : ne jamais rester en chargement plus de 4 s
    const loadingTimeout = setTimeout(() => {
      if (cancelled) return;
      setLoading(false);
    }, 4000);

    // Récupérer la session initiale (cookies)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;

      if (session?.user) {
        const minimalUser: AuthUser = {
          id: session.user.id,
          email: session.user.email ?? '',
          full_name: session.user.user_metadata?.full_name ?? null,
          avatar_url: null,
          role: 'member',
        };
        try {
          // Timeout 3 s sur le profil pour éviter une boucle infinie si la requête bloque
          const profile = await Promise.race([
            fetchUserProfile(session.user.id, session.user.email || ''),
            new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
          ]).catch(() => null);
          if (!cancelled) {
            setUser(profile ?? minimalUser);
          }
        } catch (err) {
          if (!cancelled) setUser(minimalUser);
        }
      }

      if (!cancelled) {
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;

      try {
        if (event === "SIGNED_OUT" || !session?.user) {
          setUser(null);
          return;
        }

        if (session.user && event === "SIGNED_IN") {
          const profile = await fetchUserProfile(session.user.id, session.user.email || '');
          if (!cancelled) {
            // Si le profil n'a pas pu être chargé (ex. RLS), utiliser un profil minimal pour permettre la redirection
            setUser(profile ?? {
              id: session.user.id,
              email: session.user.email ?? '',
              full_name: session.user.user_metadata?.full_name ?? null,
              avatar_url: null,
              role: 'member',
            });
          }
        }

        if (event === "USER_UPDATED" && session.user) {
          const profile = await fetchUserProfile(session.user.id, session.user.email || '');
          if (!cancelled) {
            setUser(profile ?? {
              id: session.user.id,
              email: session.user.email ?? '',
              full_name: session.user.user_metadata?.full_name ?? null,
              avatar_url: null,
              role: 'member',
            });
          }
        }
      } catch (err) {
        console.error("Erreur dans onAuthStateChange:", err);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile, isDevMode]);

  const signIn = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      // En mode dev, accepter n'importe quel identifiant
      if (isDevMode) {
        setUser({
          id: 'dev-user-123',
          email: email.trim() || 'dev@example.com',
          full_name: 'Utilisateur Développement',
          avatar_url: null,
          role: 'admin',
        });
        return { error: null };
      }

      if (!supabase) {
        return { error: new Error("Client Supabase non initialisé") };
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          return { error: error as unknown as Error };
        }

        if (!data.user) {
          return { error: new Error("Aucun utilisateur retourné") };
        }

        // Connexion instantanée : définir l'utilisateur tout de suite (pas d'attente du profil DB)
        const minimalUser: AuthUser = {
          id: data.user.id,
          email: data.user.email ?? '',
          full_name: data.user.user_metadata?.full_name ?? null,
          avatar_url: data.user.user_metadata?.avatar_url ?? null,
          role: 'member',
        };
        setUser(minimalUser);

        // Charger le vrai profil (rôle admin, etc.) en arrière-plan et mettre à jour
        fetchUserProfile(data.user.id, data.user.email ?? '').then((profile) => {
          if (profile) setUser(profile);
        });

        return { error: null };
      } catch (err) {
        return { error: err instanceof Error ? err : new Error("Erreur de connexion") };
      }
    },
    [supabase, isDevMode, fetchUserProfile]
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;

    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      setUser(null);
    }
  }, [supabase]);

  const value: AuthContextType = {
    user,
    role: user?.role ?? null,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined)
    throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
