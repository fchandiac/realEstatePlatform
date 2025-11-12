"use client";

import React from 'react';
import { Button } from '@/components/Button/Button';

export enum BlogCategory {
  COMPRAR = 'Comprar',
  ARRENDAR = 'Arrendar',
  INVERSION = 'Inversión',
  DECORACION = 'Decoración',
  MERCADO = 'Mercado',
}

export interface BlogCardProps {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  category: BlogCategory;
  imageUrl?: string;
  publishedAt?: Date;
  href?: string;
  onClick?: (id: string) => void;
}

const FALLBACK_IMAGE_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="16" font-family="Arial, Helvetica, sans-serif">
        Imagen no disponible
      </text>
    </svg>`
  );

function formatDate(date?: Date): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

export default function BlogCard({
  id,
  title,
  subtitle,
  content,
  category,
  imageUrl,
  publishedAt,
  href,
  onClick
}: BlogCardProps) {
  const handleClick = () => {
    if (onClick) onClick(id);
  };

  const CardInner = (
    <div
      className="relative bg-white rounded-lg overflow-hidden shadow-lg group cursor-pointer"
      style={{ aspectRatio: '4/3' }}
      onClick={href ? undefined : handleClick}
      role={href ? undefined : 'button'}
      tabIndex={href ? -1 : 0}
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl || FALLBACK_IMAGE_DATA_URL})`
        }}
      />

      {/* Overlay oscuro para mejor legibilidad */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />

      {/* Badge de categoría - esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
          {category}
        </div>
      </div>

      {/* Fecha de publicación - esquina inferior izquierda */}
      {publishedAt && (
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
            {formatDate(publishedAt)}
          </div>
        </div>
      )}

      {/* Contenido principal - abajo a la derecha */}
      <div className="absolute bottom-4 right-4 left-4">
        <div className="text-right">
          <h3
            className="text-white text-lg font-bold mb-1 leading-tight drop-shadow-lg"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.5)'
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className="text-white/90 text-sm leading-tight drop-shadow-md"
              style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0px 0px 4px rgba(0,0,0,0.5)'
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Overlay hover con botón */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <Button
          variant="primary"
          className="px-6 py-2 text-sm font-semibold"
        >
          Leer artículo
        </Button>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {CardInner}
      </a>
    );
  }

  return CardInner;
}