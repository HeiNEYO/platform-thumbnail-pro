import Link from "next/link";
import { MessageCircle, ExternalLink } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

export default function CommunityPage() {
  const discordLink = "https://discord.gg/kApU9zQNWe";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Communauté</h1>
        <p className="text-white/70 text-sm">
          Échangez avec les autres membres et accédez au support
        </p>
      </div>

      <div className="rounded-lg border border-card-border bg-black p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-lg border border-card-border bg-black">
            <DiscordIcon className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-[22.5px] font-bold text-white">Serveur Discord</h2>
            <p className="text-white/70 max-w-md text-sm">
              Rejoignez notre serveur Discord privé pour poser vos questions,
              partager vos réalisations et bénéficier de l&apos;entraide de la communauté.
            </p>
          </div>
          <Link
            href={discordLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-lg bg-gradient-premium hover:opacity-90 text-white font-semibold px-8 py-4 transition-opacity duration-200 text-sm"
          >
            <DiscordIcon className="h-5 w-5" />
            Rejoindre Discord
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/discord"
          className="rounded-lg border border-card-border bg-black p-6 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-3">
            <DiscordIcon className="h-6 w-6 text-primary group-hover:opacity-90" />
            <span className="font-semibold text-white">Discord</span>
          </div>
          <p className="text-sm text-white/70">
            Lien d&apos;invitation et règles du serveur
          </p>
        </Link>
        <div className="rounded-lg border border-card-border bg-black p-6">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <span className="font-semibold text-white">Entraide</span>
          </div>
          <p className="text-sm text-white/70">
            Support entre membres, annonces et partage de ressources
          </p>
        </div>
      </div>
    </div>
  );
}
