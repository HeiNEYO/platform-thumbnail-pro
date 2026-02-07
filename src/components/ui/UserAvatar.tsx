"use client";

import Image from "next/image";

interface UserAvatarProps {
  name: string;
  photo?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = { 
  sm: "h-8 w-8 text-xs", 
  md: "h-10 w-10 text-sm", 
  lg: "h-24 w-24 text-2xl" 
};

/** Première lettre du prénom (premier mot) pour l'avatar par défaut */
function getFirstLetter(name: string): string {
  const firstWord = name.trim().split(/\s+/)[0];
  return (firstWord?.[0] ?? "?").toUpperCase();
}

export function UserAvatar({ name, photo, size = "md", className = "" }: UserAvatarProps) {
  const s = sizeClasses[size];
  if (photo) {
    const sizePx = size === "sm" ? 32 : size === "md" ? 40 : 96;
    return (
      <Image
        src={photo}
        alt={name}
        width={sizePx}
        height={sizePx}
        className={`rounded-full object-cover ${s} ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[#1a1a1a] text-white font-semibold border border-white/20 ${s} ${className}`}
    >
      {getFirstLetter(name)}
    </div>
  );
}
