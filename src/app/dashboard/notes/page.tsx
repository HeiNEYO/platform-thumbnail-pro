import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNotesWithEpisodes } from "@/lib/db/notes";
import { NotesListClient } from "./NotesListClient";
import type { NoteWithEpisode } from "@/lib/db/notes";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (isDevMode) {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="text-[27px] font-bold text-white">Mes notes</h1>
        <p className="text-white/70 text-sm">Activez la production pour gérer vos notes.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let notes: NoteWithEpisode[] = [];
  try {
    notes = await getNotesWithEpisodes(user.id);
  } catch {
    // Table notes absente ou erreur : liste vide
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Mes notes</h1>
        <p className="text-white/70 text-sm">Notes liées à chaque épisode de la formation</p>
      </div>
      <NotesListClient notes={notes} userId={user.id} />
    </div>
  );
}
