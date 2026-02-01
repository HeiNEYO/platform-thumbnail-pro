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

  try {
    // createBrowserClient stocke la session dans les COOKIES → le middleware peut la lire après connexion
    // Note: createBrowserClient gère automatiquement les cookies pour Next.js
    // IMPORTANT: Ce package est déprécié mais fonctionne encore. Pour une meilleure gestion des cookies,
    // considérez migrer vers @supabase/ssr à l'avenir.
    supabaseClient = createBrowserClient<Database>(url, key, {
      global: { 
        headers: { "x-client-info": "platform-thumbnail-pro" },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        // Ne pas utiliser localStorage pour éviter les problèmes de synchronisation avec les cookies
        storage: undefined,
      },
    });

    // Forcer la récupération de la session depuis les cookies après initialisation
    // Cela aide à résoudre les problèmes de cookies après refresh
    if (supabaseClient) {
      supabaseClient.auth.getSession().catch(() => {
        // Ignore les erreurs silencieuses lors de la récupération initiale
      });
    }

    console.log("✅ Client Supabase initialisé avec succès (session en cookies)");
    return supabaseClient;
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation du client Supabase:", error);
    throw error;
  }
}
