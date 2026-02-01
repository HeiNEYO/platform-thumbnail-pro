"use client";

import { Twitter, MessageCircle } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { DiscordIcon } from "./DiscordIcon";
import type { CommunityMember } from "@/lib/db/community";

interface MemberCardProps {
  member: CommunityMember;
}

export function MemberCard({ member }: MemberCardProps) {
  const displayName = member.full_name || member.email.split("@")[0];
  const score = member.community_score || 0;

  return (
    <div className="rounded-lg border border-card-border bg-black p-5 hover:border-primary/30 transition-all duration-200">
      {/* En-tête avec identifiant et titre */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          {/* Identifiant/Score en haut à gauche */}
          <div className="text-white/50 text-xs font-medium mb-1">
            SCORE-{score.toString().padStart(3, "0")}
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
