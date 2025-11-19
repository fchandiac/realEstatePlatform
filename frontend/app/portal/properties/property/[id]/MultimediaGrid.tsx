'use client';

/**
 * MultimediaGrid Component
 * 
 * Responsable de visualizar la galería de imágenes de una propiedad.
 * 
 * Características:
 * - Muestra máximo 4 imágenes: 1 principal (izquierda) + 3 miniaturas (derecha)
 * - Usa proporción dorada (Phi = 1.618): 61.8% imagen principal, 38.2% miniaturas
 * - Imagen única: ocupa 100% del ancho
 * - Modal fullscreen: navega con flechas, ESC para cerrar
 * - Imágenes adicionales: accesibles mediante "Ver más" y modal
 * 
 * Props:
 * - mainImageUrl: URL de la imagen principal (normalizada)
 * - multimedia: Array de imágenes adicionales
 * - propertyTitle: Título de la propiedad (para alt text)
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import FontAwesome from '@/components/FontAwesome/FontAwesome';

interface MediaItem {
  id?: string;
  url: string;
  type?: string;
  format?: string;
}

/**
 * GalleryModal - Modal fullscreen para visualización de imágenes
 * 
 * Características:
 * - Navegación: Flechas izquierda/derecha, ESC para cerrar
 * - Contador: X de Y imágenes
 * - Banda de miniaturas en la base para saltar a imagen específica
 * - Controles en la parte superior para cerrar
 */
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
      {/* Top Bar - Contador y botón cerrar */}
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

      {/* Main Image Container con navegación */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-8">
        {/* Botón navegar anterior */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 z-10 text-white hover:bg-white/20 p-3 rounded-lg transition-colors"
          title="Anterior (Flecha izquierda)"
        >
          <FontAwesome icon="chevron-left" className="text-4xl" />
        </button>

        {/* Imagen actual */}
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

        {/* Botón navegar siguiente */}
        <button
          onClick={goToNext}
          className="absolute right-4 z-10 text-white hover:bg-white/20 p-3 rounded-lg transition-colors"
          title="Siguiente (Flecha derecha)"
        >
          <FontAwesome icon="chevron-right" className="text-4xl" />
        </button>
      </div>

      {/* Bottom Thumbnails Bar - Banda de miniaturas con scroll */}
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

/**
 * MultimediaGrid Component
 * 
 * Renderiza la grilla de imágenes usando proporción dorada.
 * 
 * Layout:
 * - 1 imagen: ocupa 100% del ancho
 * - 2+ imágenes: imagen principal 61.8% (izquierda), miniaturas 38.2% (derecha)
 * - Máximo 4 imágenes visibles (1 principal + 3 miniaturas)
 * - Si hay más imágenes, se acceden mediante botón "Ver más" y modal fullscreen
 */
interface MultimediaGridProps {
  mainImageUrl?: string;
  multimedia?: MediaItem[];
  propertyTitle: string;
}

export default function MultimediaGrid({
  mainImageUrl,
  multimedia = [],
  propertyTitle,
}: MultimediaGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Construir lista de medios: imagen principal primero, luego resto
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

  // Cálculos de proporción dorada
  const goldenRatio = 1.618;
  const mainWidthPercent = (goldenRatio / (1 + goldenRatio)) * 100; // ~61.8%
  const thumbWidthPercent = (1 / (1 + goldenRatio)) * 100; // ~38.2%

  // Configuración de imágenes visibles
  const maxVisibleImages = 4; // 1 principal + 3 miniaturas
  const displayedMedia = mediaList.slice(0, maxVisibleImages);
  const hasMoreImages = mediaList.length > maxVisibleImages;

  const handleMainImageClick = () => {
    setSelectedIndex(0);
    setIsModalOpen(true);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  // Estado vacío: sin imágenes
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

  // Lógica para imagen única vs múltiples
  const isSingleImage = mediaList.length === 1;
  const mainWidth = isSingleImage ? '100%' : `${mainWidthPercent}%`;
  const thumbWidth = isSingleImage ? '0%' : `${thumbWidthPercent}%`;

  return (
    <>
      {/* Contenedor principal: grid de imágenes */}
      <div className={`flex flex-col ${isSingleImage ? '' : 'md:flex-row'} gap-4 h-96 w-full`}>
        
        {/* Imagen Principal - Ocupa 61.8% en desktop, 100% en mobile si es única */}
        <div
          className="overflow-hidden rounded-lg shadow-md cursor-pointer group flex-shrink-0"
          style={{ width: mainWidth, height: '100%' }}
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

        {/* Franja de Miniaturas - Ocupa 38.2% en desktop */}
        {!isSingleImage && (
        <div
          className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:overflow-x-visible flex-1"
          style={{ width: isSingleImage ? '0%' : 'auto' }}
        >
          {/* Mapeo de miniaturas (máximo 3) */}
          {displayedMedia.slice(1).map((item, idx) => {
            // Cálculo dinámico de altura para miniaturas
            const numThumbnails = displayedMedia.length - 1; // Cantidad de miniaturas reales
            const totalThumbnails = hasMoreImages ? 3 : numThumbnails; // Si hay más, mostrar 3 espacios
            const gapSize = 16; // gap-4 = 16px
            const thumbHeight = `calc((100% - ${(totalThumbnails - 1) * gapSize}px) / ${totalThumbnails})`;
            
            return (
            <div
              key={`${item.url}-${idx}`}
              className="flex-shrink-0 rounded-lg shadow-md cursor-pointer group overflow-hidden"
              style={{
                width: '100%',
                height: thumbHeight,
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
            );
          })}

          {/* Botón "Ver más" para acceder a imágenes adicionales en modal */}
          {hasMoreImages && (() => {
            const totalThumbnails = 3;
            const numThumbnails = displayedMedia.length - 1;
            const gapSize = 16;
            const thumbHeight = `calc((100% - ${(totalThumbnails - 1) * gapSize}px) / ${totalThumbnails})`;
            
            return (
            <button
              onClick={() => {
                setSelectedIndex(0);
                setIsModalOpen(true);
              }}
              className="flex-shrink-0 rounded-lg shadow-md bg-black/50 hover:bg-black/70 transition-colors flex items-center justify-center text-white font-semibold text-sm cursor-pointer"
              style={{
                width: '100%',
                height: thumbHeight,
              }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">+{mediaList.length - maxVisibleImages}</div>
                <div className="text-xs">Ver más</div>
              </div>
            </button>
            );
          })()}
        </div>
        )}
      </div>

      {/* Modal Fullscreen para ver todas las imágenes */}
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
