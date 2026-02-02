"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioningRef = useRef(false);
  const imagesRef = useRef(images);
  const intervalRef = useRef(interval);

  // Mettre à jour les refs
  useEffect(() => {
    imagesRef.current = images;
    intervalRef.current = interval;
  }, [images, interval]);

  // Fonction pour réinitialiser le timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const nextSlide = () => {
      if (!isTransitioningRef.current) {
        setIsTransitioning(true);
        setDirection("left");
        isTransitioningRef.current = true;
        
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % imagesRef.current.length);
          setIsTransitioning(false);
          isTransitioningRef.current = false;
        }, 1000);
      }
    };

    timerRef.current = setInterval(nextSlide, intervalRef.current);
  }, []);

  // Fonction pour passer à la slide suivante (vers la droite)
  const goToNext = useCallback(() => {
    if (isTransitioningRef.current || imagesRef.current.length <= 1) return;
    
    setIsTransitioning(true);
    setDirection("left");
    isTransitioningRef.current = true;
    
    // Réinitialiser le timer
    resetTimer();
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % imagesRef.current.length);
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }, 1000);
  }, [resetTimer]);

  // Fonction pour passer à la slide précédente (vers la gauche)
  const goToPrevious = useCallback(() => {
    if (isTransitioningRef.current || imagesRef.current.length <= 1) return;
    
    setIsTransitioning(true);
    setDirection("right");
    isTransitioningRef.current = true;
    
    // Réinitialiser le timer
    resetTimer();
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + imagesRef.current.length) % imagesRef.current.length);
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }, 1000);
  }, [resetTimer]);

  // Fonction pour aller à une slide spécifique
  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex || isTransitioningRef.current || imagesRef.current.length <= 1) return;
    
    const newDirection = index > currentIndex ? "left" : "right";
    setIsTransitioning(true);
    setDirection(newDirection);
    isTransitioningRef.current = true;
    
    // Réinitialiser le timer
    resetTimer();
    
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }, 1000);
  }, [currentIndex, resetTimer]);

  // Initialiser et gérer le timer automatique
  useEffect(() => {
    if (images.length <= 1) return;

    // Fonction pour passer à la suivante
    const nextSlide = () => {
      if (!isTransitioningRef.current) {
        setIsTransitioning(true);
        setDirection("left");
        isTransitioningRef.current = true;
        
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % imagesRef.current.length);
          setIsTransitioning(false);
          isTransitioningRef.current = false;
        }, 1000);
      }
    };

    // Nettoyer le timer existant
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Créer un nouveau timer
    timerRef.current = setInterval(nextSlide, intervalRef.current);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [images.length, interval]);

  // Réinitialiser le timer après chaque transition
  useEffect(() => {
    if (images.length <= 1 || isTransitioning) return;

    // Nettoyer le timer existant
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Créer un nouveau timer après la transition
    const timeoutId = setTimeout(() => {
      const nextSlide = () => {
        if (!isTransitioningRef.current) {
          setIsTransitioning(true);
          setDirection("left");
          isTransitioningRef.current = true;
          
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % imagesRef.current.length);
            setIsTransitioning(false);
            isTransitioningRef.current = false;
          }, 1000);
        }
      };

      timerRef.current = setInterval(nextSlide, intervalRef.current);
    }, 1000); // Attendre la fin de la transition

    return () => {
      clearTimeout(timeoutId);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, images.length, isTransitioning]);

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
        
        {/* BANDEAU GAUCHE - Image précédente */}
        {images.length > 1 && (
          <div
            className={`absolute -left-[8%] top-0 h-full w-[12%] z-[1] transition-transform duration-1000 ease-in-out overflow-hidden ${
              isTransitioning && direction === "right" 
                ? "translate-x-[calc(100%+8%)]" 
                : isTransitioning && direction === "left"
                ? "-translate-x-[calc(100%+8%)]"
                : "translate-x-0"
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

        {/* BANDEAU PRÉCÉDENT - Image précédente qui arrive par la gauche (quand on va vers la gauche) */}
        {images.length > 1 && direction === "right" && (
          <div
            className={`absolute -left-full top-0 h-full w-full z-[2] transition-transform duration-1000 ease-in-out ${
              isTransitioning ? "translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="relative w-full h-full">
              {!imageErrors.has(prevIndex) ? (
                <Image
                  src={images[prevIndex].src}
                  alt={images[prevIndex].alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  onError={() => setImageErrors((prev) => new Set(prev).add(prevIndex))}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-10 z-30 max-w-2xl">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 uppercase tracking-tight leading-tight">
                  {images[prevIndex].title}
                </h2>
                <p className="text-xs md:text-sm lg:text-base text-white/90 leading-relaxed">
                  {images[prevIndex].subtitle}
                </p>
              </div>
              <div className="absolute top-4 right-4 z-30">
                <div className="px-3 py-1.5 bg-white rounded-lg shadow-lg">
                  <span className="text-xs font-semibold text-[#0A0A0A]">What's new</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BANDEAU CENTRAL - Image actuelle à 100% */}
        <div
          className={`absolute left-0 top-0 h-full w-full z-[2] transition-transform duration-1000 ease-in-out ${
            isTransitioning && direction === "left" 
              ? "-translate-x-full" 
              : isTransitioning && direction === "right"
              ? "translate-x-full"
              : "translate-x-0"
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

        {/* BANDEAU SUIVANT - Image suivante qui glisse depuis la droite (quand on va vers la droite) */}
        {images.length > 1 && direction === "left" && (
          <div
            className={`absolute left-full top-0 h-full w-full z-[2] transition-transform duration-1000 ease-in-out ${
              isTransitioning ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="relative w-full h-full">
              {!imageErrors.has(nextIndex) ? (
                <Image
                  src={images[nextIndex].src}
                  alt={images[nextIndex].alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  onError={() => setImageErrors((prev) => new Set(prev).add(nextIndex))}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-10 z-30 max-w-2xl">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 uppercase tracking-tight leading-tight">
                  {images[nextIndex].title}
                </h2>
                <p className="text-xs md:text-sm lg:text-base text-white/90 leading-relaxed">
                  {images[nextIndex].subtitle}
                </p>
              </div>
              <div className="absolute top-4 right-4 z-30">
                <div className="px-3 py-1.5 bg-white rounded-lg shadow-lg">
                  <span className="text-xs font-semibold text-[#0A0A0A]">What's new</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BANDEAU DROITE - Image suivante (aperçu) */}
        {images.length > 1 && (
          <div
            className={`absolute -right-[8%] top-0 h-full w-[12%] z-[1] transition-transform duration-1000 ease-in-out overflow-hidden ${
              isTransitioning && direction === "left"
                ? "translate-x-[calc(100%+8%)]"
                : isTransitioning && direction === "right"
                ? "-translate-x-[calc(100%+8%)]"
                : "translate-x-0"
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
            disabled={isTransitioningRef.current}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/50 group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5 text-white group-hover:text-white/90" />
          </button>
          <button
            onClick={goToNext}
            disabled={isTransitioningRef.current}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/50 group disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isTransitioningRef.current}
              className={`transition-all duration-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed ${
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
