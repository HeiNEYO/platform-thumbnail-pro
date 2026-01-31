"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, className = "" }: StatCardProps) {
  return (
    <div
      className={`rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] p-6 transition-colors hover:border-[#3a3a3a] ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-lg bg-indigo-600/20 p-2 text-indigo-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
