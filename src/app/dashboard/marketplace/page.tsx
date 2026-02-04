"use client";

import { useState } from "react";
import { Search, Filter, Building2, Laptop, MoreHorizontal, Star, ArrowRight } from "lucide-react";

type Category = "services" | "outils" | "autres";

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("outils");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "services" as Category, label: "Services", icon: Building2 },
    { id: "outils" as Category, label: "Outils", icon: Laptop },
    { id: "autres" as Category, label: "Autres", icon: MoreHorizontal },
  ];

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-[27px] font-bold text-white mb-2">Marketplace</h1>
          <p className="text-white/70 text-sm">
            Accédez à des partenaires de confiance pour accélérer votre développement.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:flex-initial md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher par mots-clés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/20 bg-[#0a0a0a] text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 bg-[#0a0a0a] text-white text-sm hover:border-white/40 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-[#0a0a0a]"
                  : "bg-[#0a0a0a] text-white/60 border border-white/20 hover:text-white/90 hover:border-white/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* LegalPlace Card */}
        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] overflow-hidden">
          {/* Banner Area - White Background */}
          <div className="bg-white p-6">
            <h2 className="text-2xl font-bold text-[#0a0a0a] mb-2">
              Lancez votre société, simplement.
            </h2>
            <p className="text-sm text-[#666666] mb-4">
              Créez et gérez votre entreprise en toute simplicité. Des démarches administratives à la gestion quotidienne, simplifiez vos procédures légales.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition-colors">
                Créer mon entreprise
              </button>
              <button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition-colors">
                Découvrir mes offres
              </button>
            </div>

            {/* Trustpilot and Google Ratings */}
            <div className="flex items-center gap-4 text-xs text-[#666666]">
              <div className="flex items-center gap-1">
                <span className="font-medium">Excellent</span>
                <span>Trustpilot</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-[#FFA500] text-[#FFA500]" />
                ))}
                <span className="ml-1">Google</span>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="border-t border-white/10"></div>

          {/* Main Content Area */}
          <div className="p-5 bg-[#0a0a0a]">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-white">LegalPlace</h3>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium">
                Fiscalité
              </span>
            </div>
            
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Simplifiez vos démarches légales avec LegalPlace. Création d'entreprise, contrats, comptabilité, RH : tous vos besoins juridiques en un seul endroit. Gagnez du temps et concentrez-vous sur votre croissance.
            </p>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0a0a0a] rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
              <span>En savoir plus</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Placeholder for other cards - can be added later */}
      </div>
    </div>
  );
}
