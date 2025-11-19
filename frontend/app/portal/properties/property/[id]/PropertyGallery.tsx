'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { env } from '@/lib/env';
import FontAwesome from '@/components/FontAwesome/FontAwesome';

interface MediaItem {
  id?: string;
  url: string;
  type?: string;
  format?: string;
}

// Helper to normalize URLs
function normalizeImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const cleaned = url.replace('/../', '/');
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    // Not an absolute URL
  }
  if (cleaned.startsWith('/')) {
    return `${env.backendApiUrl}${cleaned}`;
  }
  return cleaned;
}

// Gallery Modal Component
function GalleryModal({
  mediaList,
  initialIndex,
  propertyTitle,
  onClose,
}: {
  mediaList: MediaItem[];
  initialIndex: number;
  propertyTitle: string;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

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
        <div className="text-white text-sm font-medium">
          {currentIndex + 1} de {mediaList.length}
        </div>

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
        <button
          onClick={goToPrevious}
          className="absolute left-4 z-10 text-white hover:bg-white/20 p-3 rounded-lg transition-colors"
          title="Anterior (Flecha izquierda)"
        >
          <FontAwesome icon="chevron-left" className="text-4xl" />
        </button>

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
                <div className="w-full h-full flex items-center justify-center">
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

// Property Gallery Component
interface PropertyGalleryProps {
  mainImageUrl?: string;
  multimedia?: MediaItem[];
  propertyTitle: string;
}

export default function PropertyGallery({
  mainImageUrl,
  multimedia = [],
  propertyTitle,
}: PropertyGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const mediaList = useMemo(() => {
    const list: MediaItem[] = [];

    // Normalizar y agregar mainImageUrl primero
    const normalizedMainUrl = mainImageUrl ? normalizeImageUrl(mainImageUrl) : undefined;
    if (normalizedMainUrl) {
      list.push({ url: normalizedMainUrl, type: 'MAIN_IMAGE' });
    }

    // Normalizar y agregar resto de multimedia (sin duplicar la principal)
    if (multimedia && multimedia.length > 0) {
      multimedia.forEach((item) => {
        const normalizedUrl = normalizeImageUrl(item.url);
        // Comparar URLs normalizadas para evitar duplicados
        if (normalizedUrl && normalizedUrl.toLowerCase() !== normalizedMainUrl?.toLowerCase()) {
          list.push({ ...item, url: normalizedUrl });
        }
      });
    }

    return list;
  }, [mainImageUrl, multimedia]);

  // Golden ratio: 1.618
  const goldenRatio = 1.618;
  const mainWidthPercent = (goldenRatio / (1 + goldenRatio)) * 100; // ~61.8%
  const thumbWidthPercent = (1 / (1 + goldenRatio)) * 100; // ~38.2%

  // Máximo 4 imágenes: 1 principal + 3 miniaturas
  const maxVisibleImages = 4;
  const displayedMedia = mediaList.slice(0, maxVisibleImages);
  const hasMoreImages = mediaList.length > maxVisibleImages;
  const numThumbnails = displayedMedia.length - 1;

  const handleMainImageClick = () => {
    setSelectedIndex(0);
    setIsModalOpen(true);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  if (mediaList.length === 0) {
    return (
      <div className="w-full aspect-video rounded-lg flex items-center justify-center border border-border">
        <FontAwesome
          icon="image-not-supported"
          className="text-muted-foreground text-4xl"
        />
      </div>
    );
  }

  // Si hay solo una imagen, ocupar 100% del ancho
  const isSingleImage = mediaList.length === 1;

  if (isSingleImage) {
    return (
      <>
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-md cursor-pointer group" onClick={handleMainImageClick}>
          {displayedMedia[0]?.url ? (
            <img
              src={displayedMedia[0].url}
              alt={propertyTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center border border-border">
              <FontAwesome
                icon="image-not-supported"
                className="text-muted-foreground text-3xl"
              />
            </div>
          )}
        </div>

        {isModalOpen && (
          <GalleryModal
            mediaList={mediaList}
            initialIndex={selectedIndex}
            propertyTitle={propertyTitle}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </>
    );
  }

  // Múltiples imágenes: usar CSS Grid con proporción dorada
  return (
    <>
      <div
        className="w-full h-96 gap-4"
        style={{
          display: 'grid',
          gridTemplateColumns: `${mainWidthPercent}% 1fr`,
        }}
      >
        {/* Main Image */}
        <div
          className="overflow-hidden rounded-lg shadow-md cursor-pointer group"
          onClick={handleMainImageClick}
        >
          {displayedMedia[0]?.url ? (
            <img
              src={displayedMedia[0].url}
              alt={propertyTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center border border-border">
              <FontAwesome
                icon="image-not-supported"
                className="text-muted-foreground text-3xl"
              />
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${hasMoreImages ? 3 : numThumbnails}, 1fr)`,
            gap: '16px',
          }}
        >
          {displayedMedia.slice(1).map((item, idx) => (
            <div
              key={`${item.url}-${idx}`}
              className="overflow-hidden rounded-lg shadow-md cursor-pointer group"
              onClick={() => handleThumbnailClick(idx + 1)}
            >
              {item.url ? (
                <img
                  src={item.url}
                  alt={`${propertyTitle} - ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-border">
                  <FontAwesome
                    icon="image-not-supported"
                    className="text-muted-foreground text-lg"
                  />
                </div>
              )}
            </div>
          ))}

          {/* "Ver más" button if there are more images */}
          {hasMoreImages && (
            <button
              onClick={() => {
                setSelectedIndex(0);
                setIsModalOpen(true);
              }}
              className="rounded-lg shadow-md bg-black/50 hover:bg-black/70 transition-colors flex items-center justify-center text-white font-semibold text-sm cursor-pointer"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">+{mediaList.length - maxVisibleImages}</div>
                <div className="text-xs">Ver más</div>
              </div>
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <GalleryModal
          mediaList={mediaList}
          initialIndex={selectedIndex}
          propertyTitle={propertyTitle}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
