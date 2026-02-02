"use client";

import Link from "next/link";

export function DiscordBanner() {
  return (
    <div className="w-full rounded-lg bg-[#1A1A1A] border border-white/10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Logo + Texte à gauche */}
      <div className="flex items-center gap-4 flex-1">
        {/* Logo/Icon */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center shrink-0">
            <div className="grid grid-cols-2 gap-0.5 p-1">
              <div className="w-2 h-2 bg-[#0A0A0A] rounded-sm"></div>
              <div className="w-2 h-2 bg-[#0A0A0A] rounded-sm"></div>
              <div className="w-2 h-2 bg-[#0A0A0A] rounded-sm"></div>
              <div className="w-2 h-2 bg-[#0A0A0A] rounded-sm"></div>
            </div>
          </div>
          <span className="text-white font-normal text-sm md:text-base">Thumbnail Pro</span>
        </div>

        {/* Séparateur vertical */}
        <div className="hidden md:block w-px h-6 bg-white/20"></div>

        {/* Texte principal */}
        <p className="text-white font-normal text-sm md:text-base">
          Vous souhaitez rejoindre une communauté active de créateurs de miniatures ? Rejoignez-nous sur Discord.
        </p>
      </div>

      {/* Bouton à droite */}
      <Link
        href="/dashboard/discord"
        className="bg-white text-[#0A0A0A] px-6 py-2 rounded-full font-semibold text-sm md:text-base flex items-center hover:bg-gray-50 transition-colors shrink-0"
      >
        <span>Rejoindre Discord</span>
      </Link>
    </div>
  );
}
