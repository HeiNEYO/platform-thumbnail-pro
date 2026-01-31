import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { UserRole, UserRow } from "@/lib/supabase/database.types";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
}

export type { UserRole };

/** Inscription : crée le compte Auth + insert dans users avec role 'member' */
export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<{ error: Error | null }> {
  const supabase = createBrowserClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (authError) return { error: authError as unknown as Error };
  if (!authData.user) return { error: new Error("User not created") };

  const insertPayload = {
    id: authData.user.id,
    email: authData.user.email!,
    full_name: fullName,
    role: "member",
  };
  const { error: dbError } = await supabase.from("users").insert(insertPayload as never);
  if (dbError) return { error: dbError as unknown as Error };
  return { error: null };
}

/** Connexion */
export async function signIn(
  email: string,
  password: string
): Promise<{ error: Error | null }> {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error as unknown as Error };
}

/** Déconnexion */
export async function signOut(): Promise<void> {
  const supabase = createBrowserClient();
  await supabase.auth.signOut();
}

/** Récupère l'utilisateur courant + son role depuis la table users (côté serveur) */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, role")
    .eq("id", authUser.id)
    .single();
  const row = data as UserRow | null;
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
    role: row.role as UserRole,
  };
}

/** Mise à jour du profil (full_name, avatar_url) */
export async function updateProfile(
  userId: string,
  updates: { full_name?: string; avatar_url?: string }
): Promise<{ error: Error | null }> {
  const supabase = createBrowserClient();
  const updatePayload = {
    ...(updates.full_name !== undefined && { full_name: updates.full_name }),
    ...(updates.avatar_url !== undefined && { avatar_url: updates.avatar_url }),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("users").update(updatePayload as never).eq("id", userId);
  return { error: error as unknown as Error };
}
