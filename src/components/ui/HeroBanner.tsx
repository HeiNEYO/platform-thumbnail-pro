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
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const getSlideIndex = (offset: number) => {
    return (currentIndex + offset + images.length) % images.length;
  };

  if (images.length === 0) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] rounded-[16px] bg-[#0A0A0A] border border-white/10 flex items-center justify-center">
        <p className="text-white/50">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-[16px] overflow-hidden border border-white/10">
      {/* Container principal avec images visibles */}
      <div className="relative w-full h-full flex items-center">
        {/* Image précédente (gauche) */}
        {images.length > 1 && !imageErrors.has(getSlideIndex(-1)) && (
          <div className="absolute left-0 w-[12%] h-full z-10 transition-all duration-500 ease-in-out">
            <div className="relative w-full h-full">
              <Image
                src={images[getSlideIndex(-1)].src}
                alt={images[getSlideIndex(-1)].alt}
                fill
                className="object-cover opacity-50 blur-[2px]"
                sizes="12vw"
                onError={() => setImageErrors((prev) => new Set(prev).add(getSlideIndex(-1)))}
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          </div>
        )}

        {/* Image active (centre) */}
        <div className="relative flex-1 h-full z-20 transition-all duration-700 ease-in-out">
          <div className="relative w-full h-full">
            {!imageErrors.has(currentIndex) ? (
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-cover transition-opacity duration-700 ease-in-out"
                priority={currentIndex === 0}
                sizes="76vw"
                onError={() => setImageErrors((prev) => new Set(prev).add(currentIndex))}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"></div>
            )}
            
            {/* Overlay sombre pour la lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>

            {/* Contenu texte en bas à gauche */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16 z-30 max-w-2xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 uppercase tracking-tight leading-tight">
                {images[currentIndex].title}
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-white/90 leading-relaxed">
                {images[currentIndex].subtitle}
              </p>
            </div>

            {/* Tag "What's new" en haut à droite */}
            <div className="absolute top-6 right-6 z-30">
              <div className="px-4 py-2 bg-white rounded-lg shadow-lg">
                <span className="text-sm font-semibold text-[#0A0A0A]">What's new</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image suivante (droite) */}
        {images.length > 1 && !imageErrors.has(getSlideIndex(1)) && (
          <div className="absolute right-0 w-[12%] h-full z-10 transition-all duration-500 ease-in-out">
            <div className="relative w-full h-full">
              <Image
                src={images[getSlideIndex(1)].src}
                alt={images[getSlideIndex(1)].alt}
                fill
                className="object-cover opacity-50 blur-[2px]"
                sizes="12vw"
                onError={() => setImageErrors((prev) => new Set(prev).add(getSlideIndex(1)))}
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          </div>
        )}
      </div>

      {/* Flèches de navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/50 group"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:text-white/90" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/50 group"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:text-white/90" />
          </button>
        </>
      )}

      {/* Indicateurs dots */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentIndex
                  ? "w-10 h-2.5 bg-white shadow-lg"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
