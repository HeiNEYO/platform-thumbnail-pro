import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase/database.types";

// Singleton côté client uniquement (évite les problèmes SSR)
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (typeof window === "undefined") {
    throw new Error("createClient() ne peut être appelé que côté client. Utilisez createClient() de server.ts côté serveur.");
  }

  if (supabaseClient) {
    return supabaseClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    const errorMsg = "Variables Supabase manquantes. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local à la racine du projet, puis redémarrez (npm run dev).";
    console.error("❌", errorMsg);
    throw new Error(errorMsg);
  }

  // createBrowserClient stocke la session dans les COOKIES → le middleware peut la lire après connexion
  supabaseClient = createBrowserClient<Database>(url, key, {
    global: { headers: { "x-client-info": "platform-thumbnail-pro" } },
  });

  console.log("✅ Client Supabase initialisé avec succès (session en cookies)");
  return supabaseClient;
}
