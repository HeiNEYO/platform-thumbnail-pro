"use client";

export function SiteSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex min-h-screen">
        <section className="w-[240px] border-r border-[#1a1a1a] bg-[#0a0a0a]/70 p-4 space-y-4 animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-8 rounded-xl bg-gradient-to-r from-[#1f1f1f] to-[#0f0f0f]" />
          ))}
          <div className="pt-8 space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-4 rounded-full bg-[#141414]" />
            ))}
          </div>
        </section>

        <main className="flex-1 p-8 space-y-6">
          <header className="space-y-3">
            <div className="h-8 w-1/3 rounded-full bg-gradient-to-r from-[#5c6fff88] to-[#7f85ff88]" />
            <div className="h-4 w-2/3 rounded-full bg-[#141414]" />
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-28 rounded-2xl border border-[#1a1a1a] bg-gradient-to-r from-[#101010] to-[#1c1c1c] p-4"
              >
                <div className="h-5 w-3/4 rounded-full bg-[#141414]" />
                <div className="mt-4 h-3 w-1/2 rounded-full bg-[#141414]" />
                <div className="mt-2 h-3 w-1/3 rounded-full bg-[#141414]" />
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <div className="h-56 rounded-3xl border border-[#1a1a1a] bg-[#0f0f0f]/80 shadow-lg" />
            <div className="grid gap-4 sm:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-24 rounded-2xl border border-[#1a1a1a] bg-[#111111]">
                  <div className="m-4 h-3 rounded-full bg-[#141414]" />
                  <div className="mt-3 h-3 rounded-full bg-[#141414]" />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
