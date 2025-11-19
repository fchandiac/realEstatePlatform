'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import FontAwesome from '@/components/FontAwesome/FontAwesome';

interface MediaItem {
  id?: string;
  url: string;
  type?: string;
  format?: string;
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

    if (mainImageUrl) {
      list.push({ url: mainImageUrl, type: 'MAIN_IMAGE' });
    }

    if (multimedia && multimedia.length > 0) {
      multimedia.forEach((item) => {
        if (item.url !== mainImageUrl) {
          list.push(item);
        }
      });
    }

    return list;
  }, [mainImageUrl, multimedia]);

  const goldenRatio = 1.618;
  const mainWidthPercent = (goldenRatio / (1 + goldenRatio)) * 100;
  const thumbWidthPercent = (1 / (1 + goldenRatio)) * 100;

  const visibleCount = 5;
  const displayedMedia = mediaList.slice(0, visibleCount);
  const hasMoreImages = mediaList.length > visibleCount;

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

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 h-96">
        {/* Main Image */}
        <div
          className="overflow-hidden rounded-lg shadow-md cursor-pointer group"
          style={{ width: `${mainWidthPercent}%` }}
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
          className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-x-visible"
          style={{ width: `${thumbWidthPercent}%` }}
        >
          {displayedMedia.slice(1).map((item, idx) => (
            <div
              key={`${item.url}-${idx}`}
              className="flex-shrink-0 rounded-lg shadow-md cursor-pointer group overflow-hidden"
              style={{
                width: `${thumbWidthPercent - 2}%`,
                height: displayedMedia.length > 2 ? `calc((100% - 12px) / ${Math.min(4, displayedMedia.length - 1)})` : '100%',
              }}
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

          {hasMoreImages && (
            <button
              onClick={() => {
                setSelectedIndex(0);
                setIsModalOpen(true);
              }}
              className="flex-shrink-0 rounded-lg shadow-md bg-black/50 hover:bg-black/70 transition-colors flex items-center justify-center text-white font-semibold text-sm cursor-pointer"
              style={{
                width: `${thumbWidthPercent - 2}%`,
                height: displayedMedia.length > 2 ? `calc((100% - 12px) / ${Math.min(4, displayedMedia.length - 1)})` : '100%',
              }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">+{mediaList.length - visibleCount}</div>
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
