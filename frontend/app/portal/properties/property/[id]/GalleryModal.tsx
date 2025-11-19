'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FontAwesome from '@/components/FontAwesome/FontAwesome';

interface MediaItem {
  id?: string;
  url: string;
  type?: string;
  format?: string;
}

interface GalleryModalProps {
  mediaList: MediaItem[];
  initialIndex: number;
  propertyTitle: string;
  onClose: () => void;
}

export default function GalleryModal({
  mediaList,
  initialIndex,
  propertyTitle,
  onClose,
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Navegación con teclado
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [mediaList.length, onClose]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
  }, [mediaList.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
  }, [mediaList.length]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-sm border-b border-white/10">
        {/* Counter */}
        <div className="text-white text-sm font-medium">
          {currentIndex + 1} de {mediaList.length}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          title="Cerrar (ESC)"
        >
          <FontAwesome icon="xmark" className="text-2xl" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-8">
        {/* Left Chevron */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 z-10 text-white hover:bg-white/20 p-3 rounded-lg transition-colors"
          title="Anterior (Flecha izquierda)"
        >
          <FontAwesome icon="chevron-left" className="text-4xl" />
        </button>

        {/* Image */}
        {mediaList[currentIndex]?.url ? (
          <img
            src={mediaList[currentIndex].url}
            alt={`${propertyTitle} - ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center text-white">
            <FontAwesome icon="image-not-supported" className="text-6xl text-muted-foreground" />
          </div>
        )}

        {/* Right Chevron */}
        <button
          onClick={goToNext}
          className="absolute right-4 z-10 text-white hover:bg-white/20 p-3 rounded-lg transition-colors"
          title="Siguiente (Flecha derecha)"
        >
          <FontAwesome icon="chevron-right" className="text-4xl" />
        </button>
      </div>

      {/* Bottom Thumbnails Bar */}
      <div className="bg-black/50 backdrop-blur-sm border-t border-white/10 px-4 py-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {mediaList.map((item, idx) => (
            <button
              key={`${item.url}-${idx}`}
              onClick={() => handleThumbnailClick(idx)}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                idx === currentIndex
                  ? 'ring-2 ring-primary h-20 w-32'
                  : 'opacity-60 hover:opacity-100 h-16 w-24'
              }`}
            >
              {item.url ? (
                <img
                  src={item.url}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <FontAwesome icon="image-not-supported" className="text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
