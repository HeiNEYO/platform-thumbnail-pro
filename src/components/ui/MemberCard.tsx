"use client";

import { Twitter, Users, GraduationCap, Shield } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { DiscordIcon } from "./DiscordIcon";
import { InstagramIcon } from "./InstagramIcon";
import type { CommunityMember } from "@/lib/db/community";

interface MemberCardProps {
  member: CommunityMember;
}

// Configuration des grades avec couleurs et icônes
const gradeConfig = {
  member: {
    label: "Membre",
    color: "#82ACFF", // Couleur principale (bleu clair)
    bgColor: "rgba(130, 172, 255, 0.15)", // Fond plus sombre (bleu avec opacité)
    icon: Users,
  },
  intervenant: {
    label: "Intervenant",
    color: "#82FFBC", // Couleur principale (vert clair)
    bgColor: "rgba(130, 255, 188, 0.15)", // Fond plus sombre (vert avec opacité)
    icon: GraduationCap,
  },
  admin: {
    label: "Admin",
    color: "#FF8282", // Couleur principale (rouge clair)
    bgColor: "rgba(255, 130, 130, 0.15)", // Fond plus sombre (rouge avec opacité)
    icon: Shield,
  },
} as const;

export function MemberCard({ member }: MemberCardProps) {
  const displayName = member.full_name || member.email.split("@")[0];
  const role = member.role || "member";
  const config = gradeConfig[role] || gradeConfig.member;
  const GradeIcon = config.icon;

  // Debug : vérifier les handles (toujours actif pour debug)
  console.log(`🔍 MemberCard [${displayName}]:`, {
    id: member.id,
    discord: member.discord_tag,
    instagram: member.instagram_handle,
    hasDiscord: !!member.discord_tag,
    hasInstagram: !!member.instagram_handle,
  });

  return (
    <div 
      className="rounded-lg border border-card-border p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(36, 36, 36, 0.98) 100%)",
      }}
    >
      {/* En-tête avec identifiant et titre */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          {/* Badge de grade stylisé */}
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md mb-2"
            style={{
              backgroundColor: config.bgColor,
              border: `1px solid ${config.color}40`, // Bordure avec opacité de la couleur principale
            }}
          >
            <GradeIcon 
              className="h-4 w-4 shrink-0" 
              style={{ color: config.color }}
            />
            <span 
              className="text-sm font-medium"
              style={{ color: config.color }}
            >
              {config.label}
            </span>
          </div>
          {/* Pseudo principal */}
          <h3 className="text-white font-semibold text-base truncate">
            {displayName}
          </h3>
        </div>
        {/* Avatar */}
        <div className="ml-3 shrink-0">
          <UserAvatar name={displayName} photo={member.avatar_url} size="md" />
        </div>
      </div>

      {/* Informations sociales en bas - Affichage seulement si remplis */}
      {(member.discord_tag || member.instagram_handle) && (
        <div className="flex items-center gap-4 text-white/60 text-xs">
          {/* Discord - Affiché seulement si rempli */}
          {member.discord_tag && (
            <a
              href={`https://discord.com/users/${member.discord_tag.replace(/^@+/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <DiscordIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{member.discord_tag}</span>
            </a>
          )}

          {/* Instagram - Affiché seulement si rempli */}
          {member.instagram_handle && (
            <a
              href={`https://instagram.com/${member.instagram_handle.replace(/^@+/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <InstagramIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{member.instagram_handle}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
