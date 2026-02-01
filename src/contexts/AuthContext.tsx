"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthUser } from "@/lib/auth";
import type { UserRole, UserRow } from "@/lib/supabase/database.types";

type SupabaseClient = ReturnType<typeof createClient>;

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const clientRef = useRef<SupabaseClient | null>(null);

  const fetchUserProfile = useCallback(async (authId: string, authEmail: string): Promise<AuthUser | null> => {
    const client = clientRef.current;
    if (!client) return null;

    try {
      const { data, error } = await client
        .from("users")
        .select("id, email, full_name, avatar_url, role")
        .eq("id", authId)
        .single();

      const row = data as UserRow | null;
      if (row && !error) {
        return {
          id: row.id,
          email: row.email,
          full_name: row.full_name,
          avatar_url: row.avatar_url,
          role: row.role as UserRole,
        };
      }

      if (error?.code === 'PGRST116' || error?.message?.includes('No rows')) {
        const insertPayload = {
          id: authId,
          email: authEmail,
          full_name: null,
          role: "member",
        };
        const { data: newProfile, error: insertError } = await client
          .from("users")
          .insert(insertPayload as never)
          .select()
          .single();

        if (insertError) {
          return {
            id: authId,
            email: authEmail,
            full_name: null,
            avatar_url: null,
            role: 'member',
          };
        }

        const newRow = newProfile as UserRow | null;
        if (newRow) {
          return {
            id: newRow.id,
            email: newRow.email,
            full_name: newRow.full_name,
            avatar_url: newRow.avatar_url,
            role: newRow.role as UserRole,
          };
        }
      }

      return null;
    } catch {
      return null;
    }
  }, []);

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

    if (typeof window === "undefined") return;

    let client: SupabaseClient;
    try {
      client = createClient();
      clientRef.current = client;
    } catch (err) {
      console.error("Erreur création client Supabase:", err);
      setLoading(false);
      return;
    }

    let cancelled = false;
    let sessionChecked = false;
    
    // Timeout réduit à 1 seconde pour éviter les pages noires
    // Le middleware a déjà vérifié la session, donc on peut afficher le contenu rapidement
    const loadingTimeout = setTimeout(() => {
      if (!cancelled && !sessionChecked) {
        sessionChecked = true;
        setLoading(false);
      }
    }, 1000);

    const finish = () => {
      if (!cancelled && !sessionChecked) {
        sessionChecked = true;
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    };

    // Vérifier la session avec retry en cas d'échec
    const checkSession = async (retryCount = 0) => {
      try {
        // Essayer de récupérer la session avec un timeout plus court
        // Utiliser getUser() qui peut être plus fiable que getSession() après refresh
        const sessionPromise = client.auth.getSession();
        const userPromise = client.auth.getUser();
        
        const { data: { session }, error: sessionError } = await Promise.race([
          sessionPromise,
          new Promise<{ data: { session: null }; error: Error }>((_, reject) => 
            setTimeout(() => reject(new Error('timeout')), 2000)
          ),
        ]).catch(() => ({ data: { session: null }, error: new Error('timeout') }));
        
        // Essayer aussi getUser() comme fallback
        let userData = null;
        try {
          const { data: { user } } = await Promise.race([
            userPromise,
            new Promise<{ data: { user: null } }>((_, reject) => 
              setTimeout(() => reject(new Error('timeout')), 2000)
            ),
          ]).catch(() => ({ data: { user: null } }));
          userData = user;
        } catch {
          // Ignore les erreurs de getUser
        }
        
        if (cancelled) return;

        // Utiliser la session ou userData comme fallback
        const effectiveSession = session || (userData ? { user: userData } : null);
        const effectiveError = sessionError && !effectiveSession ? sessionError : null;

        // Si erreur mais qu'on peut retry, réessayer une fois
        if (effectiveError && retryCount < 2) {
          console.warn("Erreur getSession, retry:", effectiveError.message);
          setTimeout(() => checkSession(retryCount + 1), 300);
          return;
        }

        if (effectiveError && retryCount >= 2) {
          console.warn("Erreur getSession après retry:", effectiveError.message);
          // Ne pas bloquer même en cas d'erreur - le middleware a déjà vérifié
          finish();
          return;
        }

        if (effectiveSession?.user) {
          const minimalUser: AuthUser = {
            id: effectiveSession.user.id,
            email: effectiveSession.user.email ?? '',
            full_name: effectiveSession.user.user_metadata?.full_name ?? null,
            avatar_url: null,
            role: 'member',
          };
          
          // Mettre à jour immédiatement avec minimalUser pour éviter la page noire
          setUser(minimalUser);
          
          // Charger le profil en arrière-plan sans bloquer
          fetchUserProfile(effectiveSession.user.id, effectiveSession.user.email || '')
            .then((profile) => {
              if (!cancelled && profile) {
                setUser(profile);
              }
            })
            .catch(() => {
              // Ignore les erreurs de profil, on garde minimalUser
            });
        } else {
          // Pas de session trouvée, mais le middleware a peut-être autorisé l'accès
          // On laisse RequireAuth gérer la redirection si nécessaire
        }
        
        finish();
      } catch (err) {
        console.error("Erreur lors de la vérification de session:", err);
        // Si première tentative, réessayer
        if (retryCount < 2) {
          setTimeout(() => checkSession(retryCount + 1), 300);
        } else {
          // Ne pas bloquer même en cas d'erreur - le middleware a déjà vérifié
          finish();
        }
      }
    };

    // Essayer immédiatement
    checkSession();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;
      
      try {
        if (event === "SIGNED_OUT" || !session?.user) {
          setUser(null);
          return;
        }
        
        if (session.user && (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED")) {
          const minimalUser: AuthUser = {
            id: session.user.id,
            email: session.user.email ?? '',
            full_name: session.user.user_metadata?.full_name ?? null,
            avatar_url: null,
            role: 'member',
          };
          
          // Mettre à jour immédiatement
          if (!cancelled) {
            setUser(minimalUser);
          }
          
          // Charger le profil complet en arrière-plan
          fetchUserProfile(session.user.id, session.user.email || '')
            .then((profile) => {
              if (!cancelled && profile) {
                setUser(profile);
              }
            })
            .catch(() => {
              // Ignore les erreurs de profil
            });
        }
      } catch {
        // Ignore les erreurs
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [isDevMode, fetchUserProfile]);

  const signIn = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
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

      const client = clientRef.current;
      if (!client) {
        return { error: new Error("Chargement en cours. Réessayez dans quelques secondes.") };
      }

      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) return { error: error as unknown as Error };
        if (!data.user) return { error: new Error("Aucun utilisateur retourné") };

        const minimalUser: AuthUser = {
          id: data.user.id,
          email: data.user.email ?? '',
          full_name: data.user.user_metadata?.full_name ?? null,
          avatar_url: data.user.user_metadata?.avatar_url ?? null,
          role: 'member',
        };
        setUser(minimalUser);

        fetchUserProfile(data.user.id, data.user.email ?? '').then((profile) => {
          if (profile) setUser(profile);
        });

        return { error: null };
      } catch (err) {
        return { error: err instanceof Error ? err : new Error("Erreur de connexion") };
      }
    },
    [isDevMode, fetchUserProfile]
  );

  const signOut = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    try {
      await client.auth.signOut();
      setUser(null);
    } catch {
      setUser(null);
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (!user || isDevMode) return;

    const client = clientRef.current;
    if (!client) return;

    try {
      const profile = await fetchUserProfile(user.id, user.email);
      if (profile) {
        setUser(profile);
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du profil:", error);
    }
  }, [user, isDevMode, fetchUserProfile]);

  const value: AuthContextType = {
    user,
    role: user?.role ?? null,
    loading,
    signIn,
    signOut,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined)
    throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
