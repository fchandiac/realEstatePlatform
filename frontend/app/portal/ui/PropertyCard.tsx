"use client";

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/Button/Button';
import { env } from '@/lib/env';

type Currency = 'CLP' | 'UF';
type OperationType = 'SALE' | 'RENT';

type MediaItem = {
  id?: string;
  url: string;
  type?: string;     // e.g. 'PROPERTY_IMG', 'VIDEO'
  format?: string;   // e.g. 'IMG'
};

type PropertyTypeLite = {
  id: string;
  name: string;
};

export interface PortalProperty {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
  operationType: OperationType;
  price: number;
  currencyPrice: Currency;
  state?: string | null; // Región
  city?: string | null;  // Comuna
  propertyType?: PropertyTypeLite | null;
  mainImageUrl?: string | null;
  multimedia?: MediaItem[];
  bedrooms?: number | null;
  bathrooms?: number | null;
  builtSquareMeters?: number | null;
  landSquareMeters?: number | null;
  parkingSpaces?: number | null;
  isFeatured?: boolean;
}

export interface PropertyCardProps {
  property: PortalProperty;
  href?: string;                      // opcional, si se quiere navegar a detalle
  onClick?: (id: string) => void;     // opcional, callback al hacer click
}

const FALLBACK_IMAGE_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="32" font-family="Arial, Helvetica, sans-serif">
        Imagen no disponible
      </text>
    </svg>`
  );

function normalizeMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  // Sanea rutas con ../
  const cleaned = url.replace('/../', '/');

  // Si ya es absoluta, devuélvela tal cual (canónica desde el backend)
  try {
    // Esto lanzará si no es URL absoluta
    new URL(cleaned);
    return cleaned;
  } catch {
    // no-op
  }

  // Si es relativa, prepend backend (misma base en SSR y cliente)
  if (cleaned.startsWith('/')) {
    return `${env.backendApiUrl}${cleaned}`;
  }

  // Cualquier otro caso, devolver limpiada
  return cleaned;
}

function getPrimaryImage(property: PortalProperty): string | undefined {
  // 1) mainImageUrl si existe
  const main = normalizeMediaUrl(property.mainImageUrl);
  if (main) return main;

  // 2) buscar en multimedia una imagen
  const media = property.multimedia || [];
  const image = media.find(
    (m) => m?.format === 'IMG' || m?.type === 'PROPERTY_IMG'
  );
  if (image?.url) {
    return normalizeMediaUrl(image.url);
  }

  // 3) si nada, undefined (caller pondrá fallback)
  return undefined;
}

function formatPrice(price: number, currency: Currency): string {
  if (currency === 'UF') {
    return `UF ${price.toLocaleString('es-CL')}`;
  }
  // CLP
  return `$ ${price.toLocaleString('es-CL')}`;
}

function operationLabel(op: OperationType): string {
  return op === 'SALE' ? 'En Venta' : op === 'RENT' ? 'En Arriendo' : op;
}

export default function PropertyCard({ property, href, onClick }: PropertyCardProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(() => getPrimaryImage(property));
  const isUF = property.currencyPrice === 'UF';
  const opText = operationLabel(property.operationType);
  const featured = !!property.isFeatured;

  // Debug logging
  console.log('PropertyCard Debug:', {
    id: property.id,
    operationType: property.operationType,
    opText: opText,
    hasOpText: !!opText && opText.trim().length > 0
  });

  const propertyTypeName = property.propertyType?.name || '';
  const region = property.state || '';
  const commune = property.city || '';

  const handleClick = () => {
    if (onClick) onClick(property.id);
  };

  // Media container (img or fallback)
  const mediaEl = useMemo(() => {
    const src = imgSrc || FALLBACK_IMAGE_DATA_URL;
    return (
      <img
        src={src}
        alt={propertyTypeName || property.title}
        className="object-cover w-full h-full"
        style={{ aspectRatio: '16/9' }}
        onError={(e) => {
          // evitar bucle: si ya es fallback, no re-asignar
          if (e.currentTarget.src !== FALLBACK_IMAGE_DATA_URL) {
            console.error('Error loading image:', e.currentTarget.src);
            e.currentTarget.src = FALLBACK_IMAGE_DATA_URL;
          }
        }}
      />
    );
  }, [imgSrc, propertyTypeName, property.title]);

  const CardInner = (
    <div
      className="relative bg-white rounded-lg w-full text-left property-card shadow-lg overflow-hidden group"
      data-test-id="property-card-root"
      onClick={href ? undefined : handleClick}
      role={href ? undefined : 'button'}
      tabIndex={href ? -1 : 0}
    >
      {/* Overlay al hacer hover */}
      <div
        className="absolute inset-0 bg-foreground opacity-0 group-hover:opacity-30 transition-opacity duration-200 z-10"
        style={{ pointerEvents: 'none' }}
      />
      {/* Botón centrado sobre el overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <Button
          variant="primary"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-6 py-2 text-base font-semibold pointer-events-auto"
          style={{ transform: 'translateY(-30%)' }}
        >
          Ver propiedad
        </Button>
      </div>

      {featured && (
        <div
          className="featured-ribbon"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#16a34a',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.7rem',
            padding: '0.25rem 2rem',
            transformOrigin: '0% 0%',
            transform: 'translate(-20%, 270%) rotate(-45deg)',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
          }}
          data-test-id="property-card-featured"
        >
          DESTACADA
        </div>
      )}

      {opText && opText.trim() && (
        <div
          className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full border-2 border-white shadow-lg z-10"
          data-test-id="property-card-operation"
        >
          {opText}
        </div>
      )}

      <div
        className="flex items-center justify-center w-full aspect-[16/9] bg-gray-200 text-gray-400 overflow-hidden"
        data-test-id="property-card-media"
      >
        {mediaEl}
      </div>

      <div
        className="property-icons-container justify-center flex items-center gap-3 px-4 py-2 bg-gray-100"
        data-test-id="property-card-icons"
      >
        {property.bedrooms != null && (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
              bed
            </span>
            <span className="text-thin text-xs text-gray-700">{property.bedrooms}</span>
          </div>
        )}
        {property.bathrooms != null && (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
              bathtub
            </span>
            <span className="text-thin text-xs text-gray-700">{property.bathrooms}</span>
          </div>
        )}
        {property.builtSquareMeters != null && (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
              home
            </span>
            <span className="text-thin text-xs text-gray-700">{property.builtSquareMeters} m²</span>
          </div>
        )}
        {property.landSquareMeters != null && (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
              screenshot_frame_2
            </span>
            <span className="text-thin text-xs text-gray-700">{property.landSquareMeters} m²</span>
          </div>
        )}
        {property.parkingSpaces != null && (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
              parking_sign
            </span>
            <span className="text-thin text-xs text-gray-700">{property.parkingSpaces}</span>
          </div>
        )}
      </div>

      <div className="p-6 text-center">
        <div className="flex justify-center mb-2 text-thin text-xs" data-test-id="property-card-type">
          <p>{propertyTypeName}</p>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2" data-test-id={isUF ? 'property-card-uf' : 'property-card-clp'}>
          {formatPrice(property.price, property.currencyPrice)}
        </h3>

        <div className="flex flex-col items-center space-y-2 text-center" data-test-id="property-card-location">
          <p className="text-xs text-gray-400">
            Region {region || '-'}, {commune || '-'}
          </p>
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
