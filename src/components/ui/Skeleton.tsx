"use client";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`rounded-md bg-white/5 animate-skeleton ${className}`}
      style={style}
      aria-hidden
    />
  );
}
