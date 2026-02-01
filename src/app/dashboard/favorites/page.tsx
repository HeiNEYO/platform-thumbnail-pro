import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFavoritesWithDetails } from "@/lib/db/favorites";
import { FavoritesListClient } from "./FavoritesListClient";
import type { FavoriteWithDetails } from "@/lib/db/favorites";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (isDevMode) {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="text-[27px] font-bold text-white">Mes favoris</h1>
        <p className="text-white/70 text-sm">Activez la production pour gérer vos favoris.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let favorites: FavoriteWithDetails[] = [];
  try {
    favorites = await getFavoritesWithDetails(user.id);
  } catch {
    // Table favorites absente ou erreur : liste vide
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Mes favoris</h1>
        <p className="text-white/70 text-sm">Épisodes et ressources que vous avez mis de côté</p>
      </div>
      <FavoritesListClient favorites={favorites} userId={user.id} />
    </div>
  );
}
