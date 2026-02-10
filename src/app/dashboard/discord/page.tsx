"use client";

import { ExternalLink, AlertTriangle } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

export default function DiscordPage() {
  const discordLink = "https://discord.gg/kApU9zQNWe";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Discord</h1>
        <p className="text-white/70 text-sm">
          Rejoignez notre communauté Discord exclusive
        </p>
      </div>

      {/* Warning */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white mb-1">Lien privé – Ne pas partager</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Ce lien est réservé aux membres. <strong className="text-white">Ne le partagez jamais</strong> en dehors de la formation.
            </p>
          </div>
        </div>
      </div>

      {/* Discord Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/20">
            <DiscordIcon className="h-14 w-14 text-[#5865F2]" />
          </div>
          
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-semibold text-white">Rejoindre la communauté</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Accédez au serveur Discord privé pour échanger avec les membres, poser vos questions et profiter du support communauté.
            </p>
          </div>

          <a
            href={discordLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium px-6 py-3 transition-colors text-sm"
          >
            <DiscordIcon className="h-5 w-5" />
            Rejoindre Discord
            <ExternalLink className="h-4 w-4 opacity-80" />
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h3 className="font-medium text-white mb-4 text-sm">À propos du serveur</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            "Accès exclusif aux membres de la formation",
            "Support et entraide entre membres",
            "Annonces et mises à jour importantes",
            "Partage de ressources et astuces",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5865F2]/60 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
