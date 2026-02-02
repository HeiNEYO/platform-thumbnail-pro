export default function ModulesLoading() {
  return (
    <div className="space-y-7">
      <div>
        <div className="h-8 w-48 bg-white/10 rounded mb-2 animate-pulse" />
        <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-[#141414] rounded-lg border border-white/10 overflow-hidden">
            <div className="h-[200px] bg-white/5 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-1.5 bg-white/10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
