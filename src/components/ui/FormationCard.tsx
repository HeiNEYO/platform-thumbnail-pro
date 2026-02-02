"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Play, FileText, ArrowRight } from "lucide-react";

interface FormationCardProps {
  type: "formation" | "plateforme" | "communaute";
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  ctaStyle: "blue" | "white";
  stats?: {
    duration?: string;
    parts?: number;
    videos?: number;
    members?: number;
    coaches?: number;
    availability?: string;
  };
}

const cardConfig = {
  formation: {
    icon: BookOpen,
    imageTitle: "FORMATION",
    imagePath: "/images/formations/polaris.png",
  },
  plateforme: {
    icon: Play,
    imageTitle: "PLATEFORME",
    imagePath: "/images/formations/cours-videos.png",
  },
  communaute: {
    icon: FileText,
    imageTitle: "COMMUNAUTÉ",
    imagePath: "/images/formations/ateliers.png",
  },
};

// Composant pour l'écran d'ordinateur avec contenu spécifique
function LaptopScreen({ type }: { type: "formation" | "plateforme" | "communaute" }) {
  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      {/* Cadre de l'écran */}
      <div className="relative bg-[#0A0A0A] rounded-lg border-2 border-[#1A1A1A] shadow-2xl overflow-hidden">
        {/* Barre supérieure de l'écran */}
        <div className="h-6 bg-[#0F0F0F] border-b border-[#1A1A1A] flex items-center justify-center">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#2A2A2A]"></div>
            <div className="w-2 h-2 rounded-full bg-[#2A2A2A]"></div>
            <div className="w-2 h-2 rounded-full bg-[#2A2A2A]"></div>
          </div>
        </div>
        
        {/* Contenu de l'écran */}
        <div className="aspect-video bg-[#0A0A0A] p-4">
          {type === "formation" && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Système solaire */}
              <div className="relative w-32 h-32">
                {/* Centre orange lumineux */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-[0_0_20px_rgba(251,146,60,0.8)] animate-pulse"></div>
                </div>
                {/* Orbites avec icônes */}
                {[0, 1, 2, 3].map((i) => {
                  const angle = (i * 90) * (Math.PI / 180);
                  const radius = 40;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return (
                    <div
                      key={i}
                      className="absolute w-6 h-6 bg-blue-500 rounded-full"
                      style={{
                        left: `calc(50% + ${x}px - 12px)`,
                        top: `calc(50% + ${y}px - 12px)`,
                        animation: `orbit 8s linear infinite`,
                        animationDelay: `${i * 2}s`,
                      }}
                    ></div>
                  );
                })}
              </div>
              {/* Étoiles en arrière-plan */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                ></div>
              ))}
            </div>
          )}
          
          {type === "plateforme" && (
            <div className="grid grid-cols-4 gap-2 w-full h-full">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-video bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded border border-[#2A2A2A] flex items-center justify-center"
                >
                  <Play className="w-3 h-3 text-white/30" />
                </div>
              ))}
            </div>
          )}
          
          {type === "communaute" && (
            <div className="w-full h-full flex flex-col gap-2">
              {/* Barre d'outils */}
              <div className="h-8 bg-[#1A1A1A] rounded border border-[#2A2A2A] flex items-center gap-2 px-2">
                <div className="w-2 h-2 bg-[#2A2A2A] rounded"></div>
                <div className="w-2 h-2 bg-[#2A2A2A] rounded"></div>
                <div className="w-2 h-2 bg-[#2A2A2A] rounded"></div>
              </div>
              {/* Zone principale */}
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="col-span-2 bg-[#0F0F0F] rounded border border-[#2A2A2A] p-2">
                  <div className="w-full h-20 bg-[#1A1A1A] rounded mb-2"></div>
                  <div className="space-y-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-2 bg-[#1A1A1A] rounded w-full"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-[#1A1A1A] rounded border border-[#2A2A2A]"></div>
                  ))}
                </div>
              </div>
              {/* Timeline */}
              <div className="h-12 bg-[#1A1A1A] rounded border border-[#2A2A2A] flex items-center px-2">
                <div className="w-16 h-6 bg-[#2A2A2A] rounded"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Base de l'ordinateur */}
      <div className="h-2 w-[120%] -ml-[10%] bg-[#0A0A0A] rounded-b-lg border-x-2 border-b-2 border-[#1A1A1A]"></div>
    </div>
  );
}

export function FormationCard({
  type,
  title,
  description,
  ctaText,
  ctaHref,
  ctaStyle,
  stats,
}: FormationCardProps) {
  const config = cardConfig[type];
  const Icon = config.icon;

  return (
    <Link
      href={ctaHref}
      className="group block bg-[#0A0A0A] border border-white/10 rounded-[16px] overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(92,111,255,0.25)] hover:border-white/20"
    >
      {/* Zone visuelle en haut (60-70% de la hauteur) */}
      <div className="relative h-[280px] md:h-[320px] bg-gradient-to-b from-[#2A1A4A] via-[#1A0F3A] to-[#0F0A1F] overflow-hidden">
        {/* Texture granulaire fine */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0),
              radial-gradient(circle at 6px 6px, rgba(255,255,255,0.08) 1px, transparent 0),
              radial-gradient(circle at 10px 10px, rgba(255,255,255,0.06) 1px, transparent 0)
            `,
            backgroundSize: '12px 12px, 16px 16px, 20px 20px',
          }}
        ></div>
        
        {/* Gradient supplémentaire pour la profondeur - éclaircit vers le haut */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F3A]/60 via-[#1A0F3A]/20 to-transparent"></div>
        
        {/* Titre grand en haut à gauche - semi-transparent */}
        <div className="absolute top-4 left-4 z-10">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/60 drop-shadow-2xl">
            {config.imageTitle}
          </h3>
        </div>
        
        {/* Image en haut à droite - 6% de la taille */}
        <div className="absolute top-4 right-4 z-10 w-[6%] aspect-square">
          <Image
            src={config.imagePath}
            alt={config.imageTitle}
            fill
            className="object-contain opacity-80"
            sizes="6vw"
          />
        </div>
        
        {/* Écran d'ordinateur au centre */}
        <div className="absolute inset-0 flex items-center justify-center pt-12">
          <LaptopScreen type={type} />
        </div>
        
        {/* Effet de lumière subtil */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Zone de contenu en bas (30-40% de la hauteur) */}
      <div className="p-5 md:p-6 bg-[#0A0A0A]">
        {/* Icône + Titre */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="p-1.5 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
            <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-white">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-[#999999] text-xs md:text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Statistiques */}
        {stats && (
          <div className="flex items-center gap-4 mb-4">
            {stats.duration && (
              <div>
                <div className="text-white text-base font-semibold">{stats.duration}</div>
                <div className="text-[#999999] text-xs">Durée totale</div>
              </div>
            )}
            {stats.parts !== undefined && (
              <div>
                <div className="text-white text-base font-semibold">{stats.parts}</div>
                <div className="text-[#999999] text-xs">Parties</div>
              </div>
            )}
            {stats.videos !== undefined && (
              <div>
                <div className="text-white text-base font-semibold">{stats.videos}</div>
                <div className="text-[#999999] text-xs">Vidéos</div>
              </div>
            )}
            {stats.members !== undefined && (
              <div>
                <div className="text-white text-base font-semibold">{stats.members}</div>
                <div className="text-[#999999] text-xs">Membres</div>
              </div>
            )}
            {stats.coaches !== undefined && (
              <div>
                <div className="text-white text-base font-semibold">{stats.coaches}</div>
                <div className="text-[#999999] text-xs">Coachs</div>
              </div>
            )}
            {stats.availability && (
              <div>
                <div className="text-white text-base font-semibold">{stats.availability}</div>
                <div className="text-[#999999] text-xs">Disponibilité</div>
              </div>
            )}
          </div>
        )}

        {/* Bouton CTA */}
        <div
          className={`w-full py-3 px-4 rounded-xl font-semibold text-xs md:text-sm text-center transition-all duration-300 flex items-center justify-center gap-2 ${
            ctaStyle === "blue"
              ? "bg-gradient-to-r from-[#5C6FFF] to-[#4C5FEF] text-white group-hover:from-[#4C5FEF] group-hover:to-[#3C4FDF] group-hover:shadow-[0_8px_20px_rgba(92,111,255,0.4)]"
              : "bg-white text-[#0A0A0A] group-hover:bg-gray-50 group-hover:shadow-lg"
          } group-hover:transform group-hover:translate-y-[-2px]`}
        >
          <span>{ctaText}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
