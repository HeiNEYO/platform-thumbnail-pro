import { MemberCardSkeleton } from "@/components/ui/MemberCardSkeleton";

export default function CommunityLoading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 bg-white/10 rounded mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <MemberCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
