'use client';

import React, { useState, useMemo } from 'react';
import FontAwesome from '@/components/FontAwesome/FontAwesome';
import GalleryModal from './GalleryModal';

interface MediaItem {
  id?: string;
  url: string;
  type?: string;
  format?: string;
}

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

  // Construir lista de imágenes: mainImageUrl primero, luego resto
  const mediaList = useMemo(() => {
    const list: MediaItem[] = [];

    // Agregar mainImageUrl primero si existe
    if (mainImageUrl) {
      list.push({ url: mainImageUrl, type: 'MAIN_IMAGE' });
    }

    // Agregar resto de multimedia (excluyendo duplicados con mainImageUrl)
    if (multimedia && multimedia.length > 0) {
      multimedia.forEach((item) => {
        if (item.url !== mainImageUrl) {
          list.push(item);
        }
      });
    }

    return list;
  }, [mainImageUrl, multimedia]);

  // Golden ratio: 1.618
  const goldenRatio = 1.618;
  const mainWidthPercent = (goldenRatio / (1 + goldenRatio)) * 100; // ~61.8%
  const thumbWidthPercent = (1 / (1 + goldenRatio)) * 100; // ~38.2%

  // Mostrar máximo 5 imágenes: 1 grande + 4 miniaturas
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
      <div className="w-full aspect-video rounded-lg bg-muted flex items-center justify-center">
        <FontAwesome
          icon="image-not-supported"
          className="text-muted-foreground text-4xl"
        />
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
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
            <div className="w-full h-full bg-muted flex items-center justify-center">
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
                <div className="w-full h-full bg-muted flex items-center justify-center">
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

      {/* Gallery Modal */}
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
