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
      <div className="rounded-lg border border-warning/30 bg-warning/10 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-warning/20 rounded-lg shrink-0">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">⚠️ Lien privé - Ne pas partager</h3>
            <p className="text-sm text-white/70">
              Ce lien Discord est réservé aux membres de la plateforme. <strong className="text-white">Ne partagez jamais ce lien</strong> avec des personnes extérieures à la formation.
            </p>
          </div>
        </div>
      </div>

      {/* Discord Card */}
      <div className="rounded-lg border border-card-border bg-black p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-black rounded-lg border border-card-border">
            <DiscordIcon className="h-12 w-12 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-[22.5px] font-bold text-white">Rejoindre la communauté</h2>
            <p className="text-white/70 max-w-md text-sm">
              Accédez à notre serveur Discord privé pour échanger avec les autres membres, 
              poser vos questions et bénéficier du support de la communauté.
            </p>
          </div>

          <a
            href={discordLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-lg bg-gradient-premium hover:opacity-90 text-white font-semibold px-8 py-4 transition-opacity duration-200 text-sm"
          >
            <DiscordIcon className="h-5 w-5" />
            Rejoindre Discord
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg border border-card-border bg-black p-6">
        <h3 className="font-semibold text-white mb-3 text-sm">À propos du serveur</h3>
        <ul className="space-y-2 text-xs text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Accès exclusif aux membres de la formation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Support et entraide entre membres</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Annonces et mises à jour importantes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Partage de ressources et astuces</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
