"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
}

interface HeroCarouselProps {
  images: CarouselImage[];
  interval?: number; // Durée en ms (défaut: 5000)
}

export function HeroCarousel({ images, interval = 5000 }: HeroCarouselProps) {
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
    setCurrentIndex(index);
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  if (images.length === 0) {
    return (
      <div className="relative w-full h-full min-h-[500px] rounded-[20px] bg-gradient-to-b from-[#0044FF] via-[#2255FF] to-[#0033CC] flex items-center justify-center">
        <p className="text-white/50">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] rounded-[20px] overflow-hidden bg-gradient-to-b from-[#0044FF] via-[#2255FF] to-[#0033CC] p-8 lg:p-10">
      {/* Images du carrousel */}
      <div className="relative w-full h-full">
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          const hasError = imageErrors.has(index);
          const showImage = image.src && image.src.startsWith('/') && !hasError;

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
                {/* Image si disponible */}
                {showImage ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover rounded-lg"
                    priority={index === 0}
                    onError={() => handleImageError(index)}
                  />
                ) : null}
                
                {/* Placeholder avec titre (toujours visible en overlay ou seul) */}
                <div className={`w-full h-full bg-white/10 rounded-lg flex items-center justify-center ${showImage ? 'absolute inset-0 backdrop-blur-sm' : ''}`}>
                  {image.title && (
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold italic text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-10">
                      {image.title}
                    </h3>
                  )}
                  {!image.title && (
                    <p className="text-white/50">Image {index + 1}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicateurs dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-10 h-2 bg-white"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
