"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface BannerImage {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
}

interface HeroBannerProps {
  images: BannerImage[];
  interval?: number; // Durée en ms (défaut: 5000)
}

export function HeroBanner({ images, interval = 5000 }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  // Refs pour gérer le timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const imagesRef = useRef(images);
  const intervalRef = useRef(interval);

  // Mettre à jour les refs
  useEffect(() => {
    imagesRef.current = images;
    intervalRef.current = interval;
  }, [images, interval]);

  // Fonction pour obtenir l'index avec offset
  const getSlideIndex = (offset: number) => {
    return (currentIndex + offset + imagesRef.current.length) % imagesRef.current.length;
  };

  // Fonction pour passer à la slide suivante (toujours vers la droite) - cut instantané
  const goToNext = () => {
    if (imagesRef.current.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % imagesRef.current.length);
  };

  // Gérer le timer automatique
  useEffect(() => {
    if (images.length <= 1) return;

    // Nettoyer le timer existant
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Créer un nouveau timer
    timerRef.current = setInterval(() => {
      goToNext();
    }, intervalRef.current);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [images.length, interval]);

  if (images.length === 0) {
    return (
      <div className="relative w-full h-[350px] md:h-[420px] rounded-[16px] bg-[#0A0A0A] border border-white/10 flex items-center justify-center">
        <p className="text-white/50 text-sm">Aucune image disponible</p>
      </div>
    );
  }

  // Calculer les indices
  const prevIndex = getSlideIndex(-1);
  const nextIndex = getSlideIndex(1);

  return (
    <div className="relative w-full h-[350px] md:h-[420px] lg:h-[490px] rounded-[16px] overflow-hidden border border-white/10">
      {/* Container principal */}
      <div className="relative w-full h-full overflow-hidden">
        
        {/* BANDEAU GAUCHE - Image précédente (aperçu) */}
        {images.length > 1 && (
          <div className="absolute -left-[8%] top-0 h-full w-[12%] z-[1] overflow-hidden">
            <div className="relative w-full h-full">
              {!imageErrors.has(prevIndex) ? (
                <Image
                  src={images[prevIndex].src}
                  alt={images[prevIndex].alt}
                  fill
                  className="object-cover blur-sm opacity-60"
                  sizes="12vw"
                  onError={() => setImageErrors((prev) => new Set(prev).add(prevIndex))}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] opacity-60"></div>
              )}
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
          </div>
        )}

        {/* BANDEAU CENTRAL - Image actuelle à 100% */}
        <div className="absolute left-0 top-0 h-full w-full z-[2]">
          <div className="relative w-full h-full">
            {!imageErrors.has(currentIndex) ? (
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-cover"
                priority={currentIndex === 0}
                sizes="100vw"
                onError={() => setImageErrors((prev) => new Set(prev).add(currentIndex))}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"></div>
            )}
            
            {/* Masque d'opacité : sombre en bas (où sera le texte), clair en haut */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/90"></div>

            {/* Contenu texte en bas à gauche */}
            <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-10 z-30 max-w-2xl">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 uppercase tracking-tight leading-tight">
                {images[currentIndex].title}
              </h2>
              <p className="text-xs md:text-sm lg:text-base text-white/90 leading-relaxed">
                {images[currentIndex].subtitle}
              </p>
            </div>

            {/* Tag "What's new" en haut à droite */}
            <div className="absolute top-4 right-4 z-30">
              <div className="px-3 py-1.5 bg-white rounded-lg shadow-lg">
                <span className="text-xs font-semibold text-[#0A0A0A]">What's new</span>
              </div>
            </div>
          </div>
        </div>

        {/* BANDEAU DROITE - Image suivante (aperçu) */}
        {images.length > 1 && (
          <div className="absolute -right-[8%] top-0 h-full w-[12%] z-[1] overflow-hidden">
            <div className="relative w-full h-full">
              {!imageErrors.has(nextIndex) ? (
                <Image
                  src={images[nextIndex].src}
                  alt={images[nextIndex].alt}
                  fill
                  className="object-cover blur-sm opacity-60"
                  sizes="12vw"
                  onError={() => setImageErrors((prev) => new Set(prev).add(nextIndex))}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] opacity-60"></div>
              )}
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
          </div>
        )}
      </div>

      {/* Indicateurs dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`rounded-full ${
                index === currentIndex
                  ? "w-8 h-2 bg-white shadow-lg"
                  : "w-2 h-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
