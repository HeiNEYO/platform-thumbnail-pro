"use client";

export function AuthIllustration() {
  return (
    <div className="w-full lg:w-1/2 h-[300px] lg:h-auto relative overflow-hidden bg-gradient-to-b from-[#0044FF] via-[#2255FF] to-[#0033CC]">
      {/* Nuages décoratifs */}
      <div className="absolute inset-0 opacity-80">
        {/* Nuage 1 - Coin supérieur gauche */}
        <div className="absolute top-10 lg:top-20 left-5 lg:left-10 w-24 lg:w-32 h-16 lg:h-20 bg-white/70 rounded-full blur-xl" />
        {/* Nuage 2 - Milieu gauche */}
        <div className="absolute top-1/4 lg:top-1/3 left-10 lg:left-20 w-32 lg:w-40 h-20 lg:h-24 bg-white/60 rounded-full blur-xl" />
        {/* Nuage 3 - Coin supérieur droit */}
        <div className="absolute top-8 lg:top-16 right-8 lg:right-16 w-28 lg:w-36 h-18 lg:h-22 bg-white/70 rounded-full blur-xl" />
        {/* Nuage 4 - Milieu droit */}
        <div className="absolute top-2/3 right-10 lg:right-20 w-36 lg:w-44 h-22 lg:h-28 bg-white/60 rounded-full blur-xl" />
        {/* Nuage 5 - Bas centre */}
        <div className="absolute bottom-10 lg:bottom-20 left-1/2 transform -translate-x-1/2 w-40 lg:w-48 h-24 lg:h-30 bg-white/50 rounded-full blur-xl" />
      </div>

      {/* Zone centrale pour illustration future */}
      <div className="relative z-10 flex items-center justify-center h-full p-8 lg:p-12">
        <div className="text-center text-white/90">
          <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span className="text-white/40 text-xs lg:text-sm">Illustration à venir</span>
          </div>
        </div>
      </div>
    </div>
  );
}
