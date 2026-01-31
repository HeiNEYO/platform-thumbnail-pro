"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { EpisodeCard } from "./EpisodeCard";
import type { Module, Episode } from "@/lib/types";

interface ModuleAccordionProps {
  module: Module;
  episodes: Episode[];
  completedIds: string[];
}

export function ModuleAccordion({ module, episodes, completedIds }: ModuleAccordionProps) {
  const [open, setOpen] = useState(false);
  const completed = episodes.filter((e) => completedIds.includes(e.id)).length;
  const percent = episodes.length ? Math.round((completed / episodes.length) * 100) : 0;

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[#2a2a2a]/80"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-bold">
            {module.ordre}
          </span>
          <div>
            <h3 className="font-semibold text-white">{module.titre}</h3>
            <p className="text-sm text-gray-400">
              {episodes.length} épisodes · {module.dureeEstimee}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24">
            <ProgressBar value={percent} />
          </div>
          <span className="text-sm text-gray-500">{percent}%</span>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {open && (
        <div className="border-t border-[#2a2a2a] px-6 pb-4 pt-2">
          <p className="text-sm text-gray-400 mb-3">{module.description}</p>
          <div className="space-y-2">
            {episodes.map((ep) => (
              <EpisodeCard
                key={ep.id}
                id={ep.id}
                titre={ep.titre}
                duree={ep.duree}
                completed={completedIds.includes(ep.id)}
                moduleId={module.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
