export default function CommunityLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-white/10 rounded mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-[#141414] rounded-lg border border-white/10 p-5 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-2">
                <div className="h-6 w-20 bg-white/10 rounded" />
                <div className="h-5 w-32 bg-white/5 rounded" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
