"use client";

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

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({ name, photo, size = "md", className = "" }: UserAvatarProps) {
  const s = sizeClasses[size];
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`rounded-full object-cover ${s} ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-indigo-600/30 text-indigo-300 font-medium ${s} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
