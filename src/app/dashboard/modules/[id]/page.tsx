import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getModuleById } from "@/lib/db/modules";
import { getEpisodesByModule } from "@/lib/db/episodes";
import { getModuleProgress } from "@/lib/db/modules";
import { isEpisodeCompleted } from "@/lib/db/episodes";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EpisodeList } from "@/components/EpisodeList";

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: moduleId } = await params;
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const [module, episodes] = await Promise.all([
    getModuleById(moduleId),
    getEpisodesByModule(moduleId),
  ]);

  if (!module) notFound();

  const progressPercent = await getModuleProgress(authUser.id, moduleId);
  const completedFlags = await Promise.all(
    episodes.map((ep) => isEpisodeCompleted(authUser.id, ep.id))
  );

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <Link href="/dashboard/modules" className="hover:text-indigo-400 transition-colors">
          ← Formation
        </Link>
      </div>

      <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white">{module.title}</h1>
        <p className="text-gray-400 mt-2">{module.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          {module.duration_estimate ?? "—"}
        </p>
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progression du module</span>
            <span className="text-indigo-400 font-medium">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} showLabel />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Épisodes</h2>
        <EpisodeList
          episodes={episodes}
          moduleId={moduleId}
          completedFlags={completedFlags}
          userId={authUser.id}
        />
      </div>
    </div>
  );
}
