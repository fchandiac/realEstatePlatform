'use client';

/**
 * MultimediaGrid Component
 * 
 * Responsable de visualizar la galería de multimedia de una propiedad.
 * 
 * Características:
 * - Muestra máximo 4 items: 1 principal (mainImageUrl) + 3 adicionales de multimedia
 * - Soporta imágenes y videos
 * - Modal fullscreen para ver todos los items
 * - Navega con flechas, ESC para cerrar
 * 
 * Props:
 * - mainImageUrl: URL de la imagen/video principal (normalizada)
 * - multimedia: Array de multimedia adicionales (imágenes y videos)
 * - propertyTitle: Título de la propiedad (para alt text)
 */

import React, { useMemo, useState } from 'react';
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

function getMediaType(item: MediaItem): 'image' | 'video' {
  if (isVideoFile(item.url)) return 'video';
  if (item.format === 'IMG' || item.type === 'PROPERTY_IMG') return 'image';
  if (item.format === 'VIDEO' || item.type === 'PROPERTY_VIDEO') return 'video';
  // Default: detect by extension
  return isVideoFile(item.url) ? 'video' : 'image';
}

export default function MultimediaGrid({
  mainImageUrl,
  multimedia = [],
  propertyTitle,
}: MultimediaGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build complete media array: mainImageUrl first + additional multimedia
  const allMedia = useMemo(() => {
    const items: (MediaItem & { type: 'image' | 'video' })[] = [];

    // Add main image if it exists
    if (mainImageUrl) {
      items.push({
        id: 'main',
        url: mainImageUrl,
        type: getMediaType({ url: mainImageUrl }),
      });
    }

    // Add additional multimedia (up to 3 more to make 4 total)
    const remainingSlots = 4 - items.length;
    if (multimedia && multimedia.length > 0) {
      const additionalMedia = multimedia.slice(0, remainingSlots);
      items.push(
        ...additionalMedia.map((m) => ({
          id: m.id,
          url: m.url,
          type: getMediaType(m),
        }))
      );
    }

    return items;
  }, [mainImageUrl, multimedia]);

  // If no media, don't render anything
  if (allMedia.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setIsModalOpen(false);
  };

  // Render main media
  const mainMedia = allMedia[0];

  return (
    <>
      {/* Main Gallery */}
      <div className="w-full rounded-lg overflow-hidden shadow-md bg-gray-900">
        {/* Main Media Container */}
        <div
          className="relative w-full bg-gray-200 flex items-center justify-center cursor-pointer group"
          style={{ aspectRatio: '16/9' }}
          onClick={() => setIsModalOpen(true)}
        >
          {mainMedia.type === 'video' ? (
            <video
              src={mainMedia.url}
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
            />
          ) : (
            <img
              src={mainMedia.url}
              alt={propertyTitle}
              className="w-full h-full object-cover"
            />
          )}

          {/* Hover fullscreen icon */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button className="bg-white/90 hover:bg-white p-3 rounded-full transition-colors">
              <FontAwesome icon="expand" className="text-gray-800" />
            </button>
          </div>
        </div>

        {/* Thumbnail Strip (if more than 1 media) */}
        {allMedia.length > 1 && (
          <div className="flex gap-2 p-2 bg-gray-100 overflow-x-auto">
            {allMedia.map((media, idx) => (
              <button
                key={media.id || idx}
                onClick={() => {
                  setSelectedIndex(idx);
                  setIsModalOpen(true);
                }}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === selectedIndex
                    ? 'border-blue-500 ring-2 ring-blue-400'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {media.type === 'video' ? (
                  <>
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
                        play_circle
                      </span>
                    </div>
                  </>
                ) : (
                  <img
                    src={media.url}
                    alt={`${propertyTitle} - ${idx}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
          onKeyDown={handleKeyDown}
          role="dialog"
          tabIndex={-1}
        >
          {/* Close button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 transition-colors"
            title="Cerrar (ESC)"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
              close
            </span>
          </button>

          {/* Main content */}
          <div
            className="relative w-full max-w-4xl flex items-center justify-center"
            style={{ maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media display */}
            {allMedia[selectedIndex].type === 'video' ? (
              <video
                src={allMedia[selectedIndex].url}
                className="w-full h-full object-contain"
                autoPlay
                muted
                loop
                controls
              />
            ) : (
              <img
                src={allMedia[selectedIndex].url}
                alt={`${propertyTitle} - ${selectedIndex}`}
                className="w-full h-full object-contain"
              />
            )}

            {/* Navigation arrows */}
            {allMedia.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
                  title="Anterior"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                    chevron_left
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
                  title="Siguiente"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                    chevron_right
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Counter */}
          <div className="mt-4 text-white text-sm">
            {selectedIndex + 1} / {allMedia.length}
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-4 left-4 text-gray-400 text-xs">
            <p>↑ ↓ = Navegar | ESC = Cerrar</p>
          </div>
        </div>
      )}
    </>
  );
}
