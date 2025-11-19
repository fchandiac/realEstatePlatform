'use client';

/**
 * MultimediaGrid Component
 * 
 * Galería de multimedia para propiedad con:
 * - Imagen/video principal en grande
 * - Miniaturas de imágenes y videos adicionales
 * - Modal fullscreen para navegación
 * - Soporte para imágenes y videos con autoplay
 */

import React, { useState, useCallback } from 'react';
import FontAwesome from '@/components/FontAwesome/FontAwesome';

interface MediaItem {
  id?: string;
  url: string;
  type?: string;
  format?: string;
}

interface MultimediaGridProps {
  mainImageUrl?: string;
  multimedia?: MediaItem[];
  propertyTitle: string;
}

function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext));
}

export default function MultimediaGrid({
  mainImageUrl,
  multimedia = [],
  propertyTitle,
}: MultimediaGridProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Crear lista de todos los media (main + multimedia)
  const allMedia: MediaItem[] = [];
  if (mainImageUrl) {
    allMedia.push({
      id: 'main',
      url: mainImageUrl,
      type: isVideoFile(mainImageUrl) ? 'PROPERTY_VIDEO' : 'PROPERTY_IMG',
      format: isVideoFile(mainImageUrl) ? 'VIDEO' : 'IMG',
    });
  }
  if (multimedia && multimedia.length > 0) {
    allMedia.push(...multimedia);
  }

  // Si no hay media, no renderizar
  if (allMedia.length === 0) {
    return null;
  }

  const currentMedia = allMedia[currentIndex];

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  }, [allMedia.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  }, [allMedia.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showModal) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setShowModal(false);
    },
    [showModal, handlePrevious, handleNext]
  );

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Main display (primer item o mainImageUrl)
  const mainMedia = allMedia[0];
  const isMainVideo = mainMedia?.type === 'PROPERTY_VIDEO' || isVideoFile(mainMedia?.url || '');

  return (
    <>
      {/* Main Media Container */}
      <div 
        className="w-full rounded-lg overflow-hidden shadow-md bg-gray-900 cursor-pointer group relative"
        style={{ height: '400px' }}
        onClick={() => setShowModal(true)}
      >
        {isMainVideo ? (
          <video
            src={mainMedia.url}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={mainMedia.url}
            alt={propertyTitle}
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-200 flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
            fullscreen
          </span>
        </div>

        {/* Counter */}
        {allMedia.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {allMedia.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {allMedia.map((media, index) => {
            const isVideo = media.type === 'PROPERTY_VIDEO' || isVideoFile(media.url);
            return (
              <button
                key={media.id || index}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowModal(true);
                }}
                className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ width: '80px', height: '80px' }}
              >
                {isVideo ? (
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={`${propertyTitle} ${index}`}
                    className="w-full h-full object-cover"
                  />
                )}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="material-symbols-outlined text-white">play_circle</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal fullscreen */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          {/* Close button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors"
            title="Cerrar (ESC)"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>

          {/* Main content */}
          <div className="flex-1 flex items-center justify-center">
            {isMainVideo ? (
              <video
                src={currentMedia?.url}
                className="max-w-full max-h-full"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            ) : (
              <img
                src={currentMedia?.url}
                alt={propertyTitle}
                className="max-w-full max-h-full"
              />
            )}
          </div>

          {/* Navigation */}
          {allMedia.length > 1 && (
            <div className="flex justify-between items-center px-4 py-4 bg-black/50">
              <button
                onClick={handlePrevious}
                className="text-white hover:text-gray-300 transition-colors p-2"
                title="Anterior (←)"
              >
                <span className="material-symbols-outlined text-3xl">chevron_left</span>
              </button>

              <span className="text-white text-center flex-1">
                {currentIndex + 1} / {allMedia.length}
              </span>

              <button
                onClick={handleNext}
                className="text-white hover:text-gray-300 transition-colors p-2"
                title="Siguiente (→)"
              >
                <span className="material-symbols-outlined text-3xl">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
