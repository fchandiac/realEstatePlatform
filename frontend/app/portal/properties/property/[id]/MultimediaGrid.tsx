'use client';

/**
 * MultimediaGrid Component - Dynamic Layout
 * 
 * Responsable de visualizar la galería de multimedia con layout dinámico.
 * 
 * Layout rules (up to 4 images):
 * - 1 image: Full width
 * - 2 images: First ~61.8% (golden ratio), second ~38.2% (stacked vertically on right)
 * - 3+ images: To be implemented
 * 
 * Props:
 * - mainImageUrl: URL de la imagen/video principal
 * - multimedia: Array de multimedia adicionales
 * - propertyTitle: Título de la propiedad
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
  return isVideoFile(item.url) ? 'video' : 'image';
}

export default function MultimediaGrid({
  mainImageUrl,
  multimedia = [],
  propertyTitle,
}: MultimediaGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build complete media array: mainImageUrl first + additional multimedia (max 4)
  const allMedia = useMemo(() => {
    const items: (MediaItem & { type: 'image' | 'video' })[] = [];

    if (mainImageUrl) {
      items.push({
        id: 'main',
        url: mainImageUrl,
        type: getMediaType({ url: mainImageUrl }),
      });
    }

    // Add up to 3 more multimedia items (total max 4)
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

    console.log('[MultimediaGrid] Debug:', {
      mainImageUrl,
      multimediaCount: multimedia?.length || 0,
      allMediaCount: items.length,
      items: items.map(i => ({ id: i.id, url: i.url?.substring(0, 50) })),
    });

    return items;
  }, [mainImageUrl, multimedia]);

  // Determine layout based on image count
  const layoutType = useMemo(() => {
    if (allMedia.length === 0) return 'empty';
    if (allMedia.length === 1) return 'single';
    if (allMedia.length === 2) return 'double';
    if (allMedia.length === 3) return 'triple';
    return 'quad';
  }, [allMedia.length]);

  if (layoutType === 'empty') {
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

  const renderMediaItem = (media: typeof allMedia[0], index: number) => {
    const isVideo = media.type === 'video';
    
    return (
      <div
        key={media.id || index}
        className="relative w-full h-full bg-gray-900 flex items-center justify-center cursor-pointer group overflow-hidden"
        onClick={() => {
          setSelectedIndex(index);
          setIsModalOpen(true);
        }}
      >
        {isVideo ? (
          <video
            src={media.url}
            className="w-full h-full object-cover"
            muted
            autoPlay
            loop
          />
        ) : (
          <img
            src={media.url}
            alt={`${propertyTitle} - ${index}`}
            className="w-full h-full object-cover"
          />
        )}

        {/* Hover fullscreen icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-white/90 hover:bg-white p-3 rounded-full transition-colors">
            <FontAwesome icon="expand" className="text-gray-800" />
          </button>
        </div>

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/40 rounded-full p-4">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '32px' }}>
                play_circle
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // LAYOUT SINGLE (1 image - full width)
  if (layoutType === 'single') {
    return (
      <>
        <div className="w-full rounded-lg overflow-hidden bg-gray-900" style={{ aspectRatio: '16/9' }}>
          {renderMediaItem(allMedia[0], 0)}
        </div>

        {/* Fullscreen Modal */}
        {isModalOpen && (
          <FullscreenModal
            media={allMedia}
            selectedIndex={selectedIndex}
            propertyTitle={propertyTitle}
            onClose={() => setIsModalOpen(false)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onKeyDown={handleKeyDown}
          />
        )}
      </>
    );
  }

  // LAYOUT DOUBLE (2 images - golden ratio: 61.8% + 38.2%)
  if (layoutType === 'double') {
    return (
      <>
        <div className="w-full rounded-lg overflow-hidden flex gap-2" style={{ height: '400px', background: 'transparent' }}>
          {/* First image: ~61.8% width */}
          <div style={{ width: '61.8%', background: 'white' }} className="rounded-lg overflow-hidden">
            {renderMediaItem(allMedia[0], 0)}
          </div>

          {/* Second image: ~38.2% width */}
          <div style={{ width: '38.2%', background: 'white' }} className="rounded-lg overflow-hidden">
            {renderMediaItem(allMedia[1], 1)}
          </div>
        </div>

        {/* Fullscreen Modal */}
        {isModalOpen && (
          <FullscreenModal
            media={allMedia}
            selectedIndex={selectedIndex}
            propertyTitle={propertyTitle}
            onClose={() => setIsModalOpen(false)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onKeyDown={handleKeyDown}
          />
        )}
      </>
    );
  }

  // LAYOUT TRIPLE & QUAD (to be implemented)
  if (layoutType === 'triple') {
    // Golden ratio: left 61.8%, right 38.2% (stacked vertically)
    return (
      <>
        <div className="w-full rounded-lg overflow-hidden flex gap-2" style={{ height: '400px', background: 'transparent' }}>
          {/* First image: ~61.8% width */}
          <div style={{ width: '61.8%', background: 'white' }} className="rounded-lg overflow-hidden">
            {renderMediaItem(allMedia[0], 0)}
          </div>

          {/* Second and third images stacked vertically: ~38.2% width */}
          <div style={{ width: '38.2%', background: 'white' }} className="flex flex-col gap-2 rounded-lg overflow-hidden">
            <div style={{ height: '61.8%' }} className="rounded-lg overflow-hidden">
              {renderMediaItem(allMedia[1], 1)}
            </div>
            <div style={{ height: '38.2%' }} className="rounded-lg overflow-hidden">
              {renderMediaItem(allMedia[2], 2)}
            </div>
          </div>
        </div>

        {/* Fullscreen Modal */}
        {isModalOpen && (
          <FullscreenModal
            media={allMedia}
            selectedIndex={selectedIndex}
            propertyTitle={propertyTitle}
            onClose={() => setIsModalOpen(false)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onKeyDown={handleKeyDown}
          />
        )}
      </>
    );
  }

  // LAYOUT QUAD (to be implemented)
  return (
    <>
      <div className="w-full rounded-lg overflow-hidden bg-gray-900" style={{ aspectRatio: '16/9' }}>
        {renderMediaItem(allMedia[0], 0)}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <FullscreenModal
          media={allMedia}
          selectedIndex={selectedIndex}
          propertyTitle={propertyTitle}
          onClose={() => setIsModalOpen(false)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onKeyDown={handleKeyDown}
        />
      )}
    </>
  );
}

interface FullscreenModalProps {
  media: (MediaItem & { type: 'image' | 'video' })[];
  selectedIndex: number;
  propertyTitle: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

function FullscreenModal({
  media,
  selectedIndex,
  propertyTitle,
  onClose,
  onPrevious,
  onNext,
  onKeyDown,
}: FullscreenModalProps) {
  const currentMedia = media[selectedIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={onKeyDown}
      role="dialog"
      tabIndex={-1}
    >
      {/* Close button */}
      <button
        onClick={onClose}
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
        {currentMedia.type === 'video' ? (
          <video
            src={currentMedia.url}
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            controls
          />
        ) : (
          <img
            src={currentMedia.url}
            alt={`${propertyTitle} - ${selectedIndex}`}
            className="w-full h-full object-contain"
          />
        )}

        {/* Navigation arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
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
                onNext();
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
        {selectedIndex + 1} / {media.length}
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-4 left-4 text-gray-400 text-xs">
        <p>← → = Navegar | ESC = Cerrar</p>
      </div>
    </div>
  );
}
