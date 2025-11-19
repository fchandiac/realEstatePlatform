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

import React from 'react';
import FontAwesome from '@/components/FontAwesome/FontAwesome';

interface MediaItem {
  id?: string;
  url: string;
  type?: string;
  format?: string;
}

/**
 * MultimediaGrid Component - Versión Simplificada
 * 
 * Renderiza una única imagen principal.
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
  // Estado vacío: sin imagen principal
  if (!mainImageUrl) {
    return (
      <div className="w-full aspect-video rounded-lg flex items-center justify-center border border-border">
        <FontAwesome
          icon="image-not-supported"
          className="text-muted-foreground text-4xl"
        />
      </div>
    );
  }

  // Renderizar solo la imagen principal
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
      <img
        src={mainImageUrl}
        alt={propertyTitle}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
