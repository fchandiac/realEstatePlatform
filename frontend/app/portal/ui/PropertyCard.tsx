"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/Button/Button';
import { env } from '@/lib/env';
import { useAlert } from '@/app/hooks/useAlert';
import { togglePropertyFavorite } from '@/app/actions/properties';

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
  hasBedrooms?: boolean;
  hasBathrooms?: boolean;
  hasBuiltSquareMeters?: boolean;
  hasLandSquareMeters?: boolean;
  hasParkingSpaces?: boolean;
  hasFloors?: boolean;
  hasConstructionYear?: boolean;
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
    </svg>`
  );

function normalizeMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  // Sanea rutas con ../
  const cleaned = url.replace('/../', '/');

  // Si ya es absoluta (http:// o https://), devuélvela tal cual
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    // Si apunta a localhost:3000 (frontend), convertirlo a backend
    if (cleaned.includes('localhost:3000') || cleaned.includes('127.0.0.1:3000')) {
      const backendUrl = cleaned.replace(/https?:\/\/[^\/]+/, env.backendApiUrl);
      console.log('🔄 [PropertyCard] Converted localhost URL to backend:', backendUrl);
      return backendUrl;
    }
    console.log('✅ [PropertyCard] Already absolute:', cleaned);
    return cleaned;
  }

  // Si es relativa (comienza con /), prepend backend API URL
  if (cleaned.startsWith('/')) {
    const absolute = `${env.backendApiUrl}${cleaned}`;
    console.log('✅ [PropertyCard] Made absolute:', absolute);
    return absolute;
  }

  console.log('⚠️ [PropertyCard] Unexpected URL format:', url);
  // Cualquier otro caso, devolver limpiada
  return cleaned;
}

function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext));
}

function getOrderedImages(property: PortalProperty): string[] {
  const images: string[] = [];

  const isDebugProperty = property.id === '047c17f4-a582-4509-ac61-8177b12750ee';
  const logPrefix = isDebugProperty ? '🔍🔍 [DEBUG PROPERTY]' : '🔍 [getOrderedImages]';

  console.log(`${logPrefix} Property multimedia details:`, {
    propertyId: property.id,
    mainImageUrl: property.mainImageUrl,
    multimedia: property.multimedia?.map(m => ({
      id: m.id,
      url: m.url,
      type: m.type,
      format: m.format
    })) || []
  });

  // Si hay mainImageUrl y es una imagen (no video), agregarla primero
  if (property.mainImageUrl) {
    const mainUrl = normalizeMediaUrl(property.mainImageUrl);
    if (mainUrl && !isVideoFile(mainUrl)) {
      images.push(mainUrl);
      console.log(`${logPrefix} Added mainImageUrl:`, mainUrl);
    } else {
      console.log(`${logPrefix} Skipped mainImageUrl:`, { mainUrl, isVideo: isVideoFile(mainUrl || '') });
    }
  }

  // Agregar todas las imágenes del array multimedia (excluyendo videos)
  if (property.multimedia && property.multimedia.length > 0) {
    console.log(`${logPrefix} Processing ${property.multimedia.length} multimedia items`);

    property.multimedia.forEach((media, index) => {
      console.log(`${logPrefix} Processing media ${index + 1}/${property.multimedia!.length}:`, {
        id: media.id,
        url: media.url,
        type: media.type,
        format: media.format,
        isVideo: isVideoFile(media.url),
        urlLength: media.url?.length || 0
      });

      const url = normalizeMediaUrl(media.url);
      const isValidImage = url && !isVideoFile(url);

      console.log(`${logPrefix} Media ${index + 1} validation:`, {
        originalUrl: media.url,
        normalizedUrl: url,
        isValidImage,
        isVideo: isVideoFile(url || ''),
        hasUrl: !!url
      });

      if (isValidImage) {
        // Evitar duplicados con mainImageUrl
        if (!images.includes(url)) {
          images.push(url);
          console.log(`${logPrefix} ✅ Added multimedia image ${index + 1}:`, url);
        } else {
          console.log(`${logPrefix} ⚠️ Skipped duplicate ${index + 1}:`, url);
        }
      } else {
        console.log(`${logPrefix} ❌ Skipped invalid media ${index + 1}:`, {
          url,
          type: media.type,
          format: media.format,
          isVideo: isVideoFile(url || ''),
          reason: !url ? 'no url' : isVideoFile(url) ? 'is video' : 'other'
        });
      }
    });
  } else {
    console.log(`${logPrefix} No multimedia array found`);
  }

  console.log(`${logPrefix} Final result:`, {
    totalMultimedia: property.multimedia?.length || 0,
    imagesFound: images.length,
    images: images
  });

  return images;
}

function getPrimaryMedia(property: PortalProperty): { type: 'image' | 'video'; url: string } | undefined {
  // Primero, intentar obtener la primera imagen de multimedia (más confiable)
  if (property.multimedia && property.multimedia.length > 0) {
    // Buscar imagen primero
    const firstImage = property.multimedia.find(m => m.type === 'PROPERTY_IMG' || m.format === 'IMG');
    if (firstImage) {
      const url = normalizeMediaUrl(firstImage.url);
      if (url && !isVideoFile(url)) {
        return { type: 'image', url };
      }
    }
    
    // Si no hay imagen, buscar video
    const firstVideo = property.multimedia.find(m => m.type === 'PROPERTY_VIDEO' || isVideoFile(m.url));
    if (firstVideo) {
      const url = normalizeMediaUrl(firstVideo.url);
      if (url) {
        return { type: 'video', url };
      }
    }
  }

  // Fallback: usar mainImageUrl
  if (property.mainImageUrl) {
    const url = normalizeMediaUrl(property.mainImageUrl);
    if (!url) return undefined;
    
    if (isVideoFile(url)) {
      return { type: 'video', url };
    } else {
      return { type: 'image', url };
    }
  }

  // Si no hay nada, devolver undefined (mostrar placeholder)
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
  const primaryMedia = getPrimaryMedia(property);
  const isDebugProperty = property.id === '047c17f4-a582-4509-ac61-8177b12750ee';
  const logPrefix = isDebugProperty ? '🎯🎯 [DEBUG PROPERTY]' : '🎯 [PropertyCard]';

  console.log(`${logPrefix} Property ID:`, property.id);
  console.log(`${logPrefix} mainImageUrl:`, property.mainImageUrl);
  console.log(`${logPrefix} primaryMedia (after getPrimaryMedia):`, primaryMedia);
  
  // Get ordered images for navigation
  const images = getOrderedImages(property);
  const hasImages = images.length > 0;
  
  console.log(`${logPrefix} Debug info:`, {
    propertyId: property.id,
    mainImageUrl: property.mainImageUrl,
    multimediaCount: property.multimedia?.length || 0,
    imagesFound: images.length,
    hasImages,
    currentImageIndex: hasImages ? 0 : -1,
    allImages: images
  });
  
  const [mediaSrc, setMediaSrc] = useState<{ type: 'image' | 'video'; url: string } | undefined>(() => {
    console.log('🎯 [PropertyCard] Initial mediaSrc state:', primaryMedia);
    return primaryMedia;
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(hasImages ? 0 : -1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const { showAlert } = useAlert();
  
  const isUF = property.currencyPrice === 'UF';
  const opText = operationLabel(property.operationType);
  const featured = !!property.isFeatured;

  const propertyTypeName = property.propertyType?.name || '';
  const region = property.state || '';
  const commune = property.city || '';

  // Check favorite status on mount and from cookies
  useEffect(() => {
    const checkFavorite = () => {
      try {
        const favCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith('favorites='));
        
        if (favCookie) {
          const favoritesStr = decodeURIComponent(favCookie.split('=')[1]);
          const favorites = JSON.parse(favoritesStr);
          setIsFavorited(Array.isArray(favorites) && favorites.includes(property.id));
        } else {
          setIsFavorited(false);
        }
      } catch (error) {
        console.error('Error reading favorites cookie:', error);
        setIsFavorited(false);
      }
    };

    checkFavorite();
  }, [property.id]);

  // Check if cookies were accepted
  useEffect(() => {
    const consentCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('cookieConsent='));
    
    const accepted = consentCookie?.includes('accepted') || false;
    setCookiesAccepted(accepted);
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLoadingFav) return;
    setIsLoadingFav(true);

    try {
      // Update DB and cookies
      const result = await togglePropertyFavorite(property.id);

      if (!result.success) {
        showAlert({
          message: result.error || 'Error al agregar/remover favorito',
          type: 'error',
          duration: 3000,
        });
        setIsLoadingFav(false);
        return;
      }

      // Update cookie - read fresh state from cookie
      try {
        const favCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith('favorites='));
        
        let favorites: string[] = [];
        if (favCookie) {
          const favoritesStr = decodeURIComponent(favCookie.split('=')[1]);
          favorites = JSON.parse(favoritesStr);
        }

        // Toggle: if already favorited, remove it; otherwise add it
        const isFavoritedBefore = favorites.includes(property.id);
        const newFavorites = isFavoritedBefore
          ? favorites.filter((id) => id !== property.id)
          : [...favorites, property.id];

        // Save to cookie
        const expires = new Date();
        expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = `favorites=${encodeURIComponent(JSON.stringify(newFavorites))}; expires=${expires.toUTCString()}; path=/`;

        // Update UI state
        const isFavNow = newFavorites.includes(property.id);
        setIsFavorited(isFavNow);

        showAlert({
          message: isFavNow
            ? 'Agregado a favoritos'
            : 'Removido de favoritos',
          type: 'success',
          duration: 2000,
        });
      } catch (error) {
        console.error('Error updating favorites cookie:', error);
        showAlert({
          message: 'Error al actualizar favorito',
          type: 'error',
          duration: 2000,
        });
      }
    } finally {
      setIsLoadingFav(false);
    }
  };

  const handleClick = () => {
    // Redirigir a la página de detalle en una nueva ventana
    window.open(`/portal/properties/property/${property.id}`, '_blank');
    if (onClick) onClick(property.id);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => {
      const newIndex = prev <= 0 ? images.length - 1 : prev - 1;
      console.log('⬅️ [PropertyCard] Previous image:', newIndex);
      return newIndex;
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => {
      const newIndex = prev >= images.length - 1 ? 0 : prev + 1;
      console.log('➡️ [PropertyCard] Next image:', newIndex);
      return newIndex;
    });
  };

  // Media container (img or video or fallback)
  const mediaEl = useMemo(() => {
    // If we have images, show the current image from the array
    if (hasImages && currentImageIndex >= 0 && currentImageIndex < images.length) {
      const currentImageUrl = images[currentImageIndex];
      return (
        <img
          src={currentImageUrl}
          alt={`${propertyTypeName || property.title} - Imagen ${currentImageIndex + 1} de ${images.length}`}
          className="object-cover w-full h-full"
          style={{ aspectRatio: '16/9' }}
          loading="lazy"
          onError={(e) => {
            console.warn('⚠️ [PropertyCard] Image failed to load, trying next:', e.currentTarget.src);
            // Try next image automatically
            handleNextImage();
          }}
        />
      );
    }

    // Fallback to original logic if no images available
    if (!mediaSrc) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-200">
          <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '64px' }}>
            image_not_supported
          </span>
        </div>
      );
    }

    if (mediaSrc.type === 'video') {
      return (
        <video
          src={mediaSrc.url}
          className="object-cover w-full h-full"
          style={{ aspectRatio: '16/9' }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={(e) => {
            console.warn('⚠️ [PropertyCard] Video failed to load, showing fallback:', mediaSrc.url);
            setMediaSrc(undefined);
          }}
          onLoadedData={() => {
            console.log('✅ [PropertyCard] Video loaded successfully');
          }}
        />
      );
    }

    // Fallback image (shouldn't reach here with new logic, but kept for safety)
    return (
      <img
        src={mediaSrc.url}
        alt={propertyTypeName || property.title}
        className="object-cover w-full h-full"
        style={{ aspectRatio: '16/9' }}
        onError={(e) => {
          console.warn('⚠️ [PropertyCard] Image failed to load, showing fallback:', e.currentTarget.src);
          setMediaSrc(undefined);
        }}
      />
    );
  }, [mediaSrc, hasImages, currentImageIndex, images, propertyTypeName, property.title]);

  const CardInner = (
    <div
      className="relative bg-white rounded-lg w-full text-left property-card shadow-lg overflow-hidden z-0"
      data-test-id="property-card-root"
    >
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
        className="flex items-center justify-center w-full aspect-[16/9] bg-gray-200 text-gray-400 overflow-hidden relative"
        data-test-id="property-card-media"
      >
        {mediaEl}

        {/* Navigation chevrons - only show if multiple images */}
        {hasImages && images.length > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-80 hover:opacity-100 shadow-lg"
              aria-label="Imagen anterior"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                chevron_left
              </span>
            </button>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-80 hover:opacity-100 shadow-lg"
              aria-label="Imagen siguiente"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                chevron_right
              </span>
            </button>
          </>
        )}
      </div>

      <div
        className="property-icons-container justify-center flex items-center gap-3 px-4 py-2 bg-gray-100"
        data-test-id="property-card-icons"
      >
        {property.propertyType?.hasBedrooms && property.bedrooms != null && (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
              bed
            </span>
            <span className="text-thin text-xs text-gray-700">{property.bedrooms}</span>
          </div>
        )}
        {property.propertyType?.hasBathrooms && property.bathrooms != null && (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
              bathtub
            </span>
            <span className="text-thin text-xs text-gray-700">{property.bathrooms}</span>
          </div>
        )}
        {property.propertyType?.hasBuiltSquareMeters && property.builtSquareMeters != null && (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
              home
            </span>
            <span className="text-thin text-xs text-gray-700">{Math.round(property.builtSquareMeters)} m²</span>
          </div>
        )}
        {property.propertyType?.hasLandSquareMeters && property.landSquareMeters != null && (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
              screenshot_frame_2
            </span>
            <span className="text-thin text-xs text-gray-700">{property.landSquareMeters} m²</span>
          </div>
        )}
        {property.propertyType?.hasParkingSpaces && property.parkingSpaces != null && (
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

        {/* Property Title */}
        <h2 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
          {property.title}
        </h2>

        <h3 className="text-xl font-bold text-gray-800 mb-2" data-test-id={isUF ? 'property-card-uf' : 'property-card-clp'}>
          {formatPrice(property.price, property.currencyPrice)}
        </h3>

        <div className="flex flex-col items-center space-y-1 text-center" data-test-id="property-card-location">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {region && <span className="text-xs text-gray-600 font-medium">{region}</span>}
            {region && commune && <span className="text-xs text-gray-400">•</span>}
            {commune && <span className="text-xs text-gray-600 font-medium">{commune}</span>}
          </div>
        </div>
      </div>

      {/* Row inferior con botón y corazón */}
      <div className="flex justify-between items-center px-6 py-1 border-t border-gray-100">
        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            window.open(`/portal/properties/property/${property.id}`, '_blank');
          }}
          className="px-3 py-1 text-xs font-medium"
          variant="primary"
        >
          Ver propiedad
        </Button>

        {/* Favorite heart button - only show if cookies accepted */}
        {cookiesAccepted && (
          <button
            onClick={handleToggleFavorite}
            disabled={isLoadingFav}
            className="transition-all duration-200 hover:scale-110 disabled:opacity-50 p-2"
            title={isFavorited ? 'Remover de favoritos' : 'Agregar a favoritos'}
          >
            <span
              className={`material-symbols-outlined transition-all ${
                isFavorited
                  ? 'text-accent fill-accent'
                  : 'text-gray-400 hover:text-accent'
              }`}
              style={{ fontSize: '24px' }}
            >
              {isFavorited ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        )}
      </div>
    </div>
  );

  return CardInner;
}
