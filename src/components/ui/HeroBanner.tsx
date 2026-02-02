"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 1000);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 1000);
  };

  const goToPrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, 1000);
  };

  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 1000);
  };

  const getSlideIndex = (offset: number) => {
    return (currentIndex + offset + images.length) % images.length;
  };

  if (images.length === 0) {
    return (
      <div className="relative w-full h-[350px] md:h-[420px] rounded-[16px] bg-[#0A0A0A] border border-white/10 flex items-center justify-center">
        <p className="text-white/50 text-sm">Aucune image disponible</p>
      </div>
    );
  }

  const prevIndex = getSlideIndex(-1);
  const nextIndex = getSlideIndex(1);

  return (
    <div className="relative w-full h-[350px] md:h-[420px] lg:h-[490px] rounded-[16px] overflow-hidden border border-white/10">
      {/* Container principal */}
      <div className="relative w-full h-full overflow-hidden">
        
        {/* BANDEAU CENTRAL - Image actuelle à 100% */}
        <div
          className={`absolute left-0 top-0 h-full w-full z-[2] transition-transform duration-1000 ease-in-out ${
            isTransitioning ? "-translate-x-full" : "translate-x-0"
          }`}
        >
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
            
            {/* Overlay sombre pour la lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>

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

        {/* BANDEAU GAUCHE - Petit aperçu de l'image précédente, coupé */}
        {images.length > 1 && (
          <div
            className={`absolute -left-[8%] top-0 h-full w-[12%] z-[1] transition-transform duration-1000 ease-in-out overflow-hidden ${
              isTransitioning ? "-translate-x-full" : "translate-x-0"
            }`}
          >
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

        {/* BANDEAU DROITE - Petit aperçu de l'image suivante, coupé */}
        {images.length > 1 && (
          <div
            className={`absolute -right-[8%] top-0 h-full w-[12%] z-[1] transition-transform duration-1000 ease-in-out overflow-hidden ${
              isTransitioning ? "translate-x-full" : "translate-x-0"
            }`}
          >
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

      {/* Flèches de navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/50 group"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5 text-white group-hover:text-white/90" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/50 group"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-5 h-5 text-white group-hover:text-white/90" />
          </button>
        </>
      )}

      {/* Indicateurs dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentIndex
                  ? "w-8 h-2 bg-white shadow-lg"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
