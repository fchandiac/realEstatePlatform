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
      className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
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

      {/* Overlay gradiente sutil en la parte inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Badge de categoría - esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 shadow-sm">
          {category}
        </div>
      </div>

      {/* Fecha de publicación - esquina inferior izquierda */}
      {publishedAt && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-black/70 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-lg">
            {formatDate(publishedAt)}
          </div>
        </div>
      )}

      {/* Contenido principal - parte inferior con mejor espaciado */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="text-left">
          <h3
            className="text-white text-xl font-bold mb-2 leading-tight"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {title.length > 60 ? `${title.substring(0, 60)}...` : title}
          </h3>
          {subtitle && (
            <p
              className="text-gray-200 text-sm leading-relaxed font-medium"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.4)'
              }}
            >
              {subtitle.length > 80 ? `${subtitle.substring(0, 80)}...` : subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Overlay hover sutil */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {/* Indicador de hover en la esquina */}
      <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
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