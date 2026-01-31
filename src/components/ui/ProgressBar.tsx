"use client";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className = "", showLabel }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={className}>
      <div className="h-3 w-full rounded-full bg-black border border-card-border overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-premium transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-white/70 mt-2 font-medium">{pct}% complété</p>
      )}
    </div>
  );
}
