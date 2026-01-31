import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import type { ModuleRow } from "@/lib/supabase/database.types";

interface ModuleCardProps {
  module: ModuleRow;
  progressPercent: number;
  userId: string;
}

export function ModuleCard({
  module,
  progressPercent,
  userId,
}: ModuleCardProps) {
  return (
    <Link
      href={`/dashboard/modules/${module.id}`}
      className="block rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] p-6 transition-colors hover:border-indigo-500/50 hover:bg-[#2a2a2a]/80"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white">{module.title}</h3>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {module.description}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {module.duration_estimate ?? "—"}
          </p>
        </div>
        <div className="shrink-0 w-24">
          <ProgressBar progress={progressPercent} showLabel />
        </div>
      </div>
      <div className="mt-4">
        <span className="inline-flex items-center rounded-lg bg-indigo-600/20 px-3 py-1.5 text-sm font-medium text-indigo-400">
          {progressPercent === 100 ? "Terminé" : progressPercent > 0 ? "Continuer" : "Commencer"}
        </span>
      </div>
    </Link>
  );
}
