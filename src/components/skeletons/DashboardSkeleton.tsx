"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { DashboardContentSkeleton } from "./DashboardContentSkeleton";

/** Squelette du layout dashboard (header + sidebar + zone principale) – style YouTube */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="h-[61.6px] shrink-0 border-b border-sidebar-border bg-black flex items-center justify-between px-[22px]">
        <div className="flex items-center gap-[22px]">
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-[15px]">
          <Skeleton className="h-9 w-48 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[232px] shrink-0 bg-black border-r border-sidebar-border flex flex-col p-4">
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-3">
                <Skeleton className="h-8 w-full rounded-lg mb-2" />
                <div className="space-y-1.5 pl-2">
                  <Skeleton className="h-8 w-full rounded-lg" />
                  <Skeleton className="h-8 w-[85%] rounded-lg" />
                  <Skeleton className="h-8 w-[75%] rounded-lg" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-sidebar-border space-y-2">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
          <div className="mt-4 pt-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2.5 mb-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-black">
          <div className="p-7 max-w-7xl mx-auto">
            <DashboardContentSkeleton />
          </div>
        </main>
      </div>
    </div>
  );
}
