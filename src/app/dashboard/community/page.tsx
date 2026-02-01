import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllCommunityMembers } from "@/lib/db/community";
import { MemberCard } from "@/components/ui/MemberCard";

// Force le rendu dynamique car on utilise cookies() pour l'authentification
export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  
  if (isDevMode) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-[27px] font-bold text-white mb-2">Communauté</h1>
          <p className="text-white/70 text-sm">Activez la production pour voir les membres.</p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const members = await getAllCommunityMembers();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Communauté</h1>
        <p className="text-white/70 text-sm">
          Découvrez tous les membres de la plateforme et connectez-vous avec eux
        </p>
      </div>

      {/* Grille des membres */}
      {members.length === 0 ? (
        <div className="rounded-lg border border-card-border bg-black p-12 text-center">
          <p className="text-white/70 mb-2">Aucun membre pour le moment.</p>
          <p className="text-xs text-white/50">Les membres apparaîtront ici une fois inscrits.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
