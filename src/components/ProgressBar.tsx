"use client";

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  color = "#6366f1",
  height = 8,
  showLabel,
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, progress));
  return (
    <div className={className}>
      <div
        className="w-full rounded-full overflow-hidden bg-[#3a3a3a]"
        style={{ height: `${height}px` }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1">{pct}%</p>
      )}
    </div>
  );
}
