"use client";

import { Twitter, Users, GraduationCap, Shield } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { DiscordIcon } from "./DiscordIcon";
import type { CommunityMember } from "@/lib/db/community";

interface MemberCardProps {
  member: CommunityMember;
}

// Configuration des grades avec couleurs et icônes
const gradeConfig = {
  member: {
    label: "Membre",
    color: "#82ACFF",
    icon: Users,
  },
  intervenant: {
    label: "Intervenant",
    color: "#82FFBC",
    icon: GraduationCap,
  },
  admin: {
    label: "Admin",
    color: "#FF8282",
    icon: Shield,
  },
} as const;

export function MemberCard({ member }: MemberCardProps) {
  const displayName = member.full_name || member.email.split("@")[0];
  const role = member.role || "member";
  const config = gradeConfig[role] || gradeConfig.member;
  const GradeIcon = config.icon;

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
              backgroundColor: "rgba(36, 36, 36, 0.8)",
              border: `1px solid rgba(255, 255, 255, 0.1)`,
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

      {/* Informations sociales en bas */}
      <div className="flex items-center gap-4 text-white/60 text-xs">
        {/* Twitter */}
        {member.twitter_handle ? (
          <div className="flex items-center gap-2">
            <Twitter className="h-4 w-4 shrink-0" />
            <span className="truncate">{member.twitter_handle}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-white/30">
            <Twitter className="h-4 w-4 shrink-0" />
            <span>—</span>
          </div>
        )}

        {/* Discord */}
        {member.discord_tag ? (
          <div className="flex items-center gap-2">
            <DiscordIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">{member.discord_tag}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-white/30">
            <DiscordIcon className="h-4 w-4 shrink-0" />
            <span>—</span>
          </div>
        )}
      </div>
    </div>
  );
}
