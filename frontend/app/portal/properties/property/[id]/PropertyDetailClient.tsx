'use client';

import React, { useState, useEffect } from 'react';
import { Property } from './actions';
import { Button } from '@/components/Button/Button';
import { TextField } from '@/components/TextField/TextField';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { useAlert } from '@/app/hooks/useAlert';
import FontAwesome from '@/components/FontAwesome/FontAwesome';
import { env } from '@/lib/env';
import { togglePropertyFavorite } from '@/app/actions/properties';
import PropertyMapWrapper from './PropertyMapWrapper';
import MultimediaGrid from './MultimediaGrid';

interface PropertyDetailClientProps {
  property: Property;
}

// Helper function to normalize image URLs (same as PropertyCard)
function normalizeImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  // Clean up paths with ../
  const cleaned = url.replace('/../', '/');

  // If already absolute URL, return as is
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    // Not an absolute URL, continue
  }

  // If relative, prepend backend URL
  if (cleaned.startsWith('/')) {
    return `${env.backendApiUrl}${cleaned}`;
  }

  // Return cleaned version
  return cleaned;
}

interface PropertyDetailClientProps {
  property: Property;
}

export default function PropertyDetailClient({
  property,
}: PropertyDetailClientProps) {
  const { showAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [favoritesCount, setFavoritesCount] = useState(property.favoritesCount || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFav, setIsLoadingFav] = useState(false);

  // Check if user has favorited this property
  useEffect(() => {
    try {
      const favCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('favorites='));
      
      if (favCookie) {
        const favoritesStr = decodeURIComponent(favCookie.split('=')[1]);
        const favorites = JSON.parse(favoritesStr);
        setIsFavorited(Array.isArray(favorites) && favorites.includes(property.id));
      }
    } catch (error) {
      console.error('Error reading favorites from cookie:', error);
    }
  }, [property.id]);

  const mainImage = property.multimedia?.[0];

  const agentName =
    property.assignedAgent?.personalInfo?.firstName ||
    property.assignedAgent?.username ||
    'Agente Inmobiliario';

  const priceFormatted = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: property.currencyPrice === 'UF' ? 'USD' : 'CLP',
    minimumFractionDigits: 0,
  }).format(property.price);

  const locationText = property.state && property.city
    ? `${property.city}, ${property.state}`
    : property.address
    ? property.address
    : 'Ubicación no especificada';

  // Normalize image URLs
  const mainImageUrl = mainImage ? normalizeImageUrl(mainImage.url) : undefined;
  
  // Normalize all multimedia URLs except the first one (which is mainImageUrl)
  const normalizedMultimedia = property.multimedia?.slice(1).map((m) => ({
    ...m,
    url: normalizeImageUrl(m.url) || m.url,
  })) || [];

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleFavorite = async () => {
    if (isLoadingFav) return;
    setIsLoadingFav(true);

    try {
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

      // Update cookie
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
        const isFavBefore = favorites.includes(property.id);
        const newFavorites = isFavBefore
          ? favorites.filter((id) => id !== property.id)
          : [...favorites, property.id];

        // Save to cookie
        const expires = new Date();
        expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = `favorites=${encodeURIComponent(JSON.stringify(newFavorites))}; expires=${expires.toUTCString()}; path=/`;

        // Update UI
        const isFavNow = newFavorites.includes(property.id);
        setIsFavorited(isFavNow);
        setFavoritesCount(prev => isFavNow ? prev + 1 : Math.max(prev - 1, 0));

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      showAlert({
        message: 'Por favor completa todos los campos',
        type: 'warning',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement contact form submission to backend
      // For now, show success message
      showAlert({
        message: 'Mensaje enviado correctamente. El agente se pondrá en contacto pronto.',
        type: 'success',
        duration: 3000,
      });

      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      showAlert({
        message: 'Error al enviar el mensaje. Intenta nuevamente.',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section - Centered Info */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          {/* Title */}
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {property.title}
          </h1>

          {/* Property Type */}
          <div className="mb-2">
            <span className="text-sm font-light text-muted-foreground">
              {property.propertyType?.name || 'Propiedad'} en{' '}
              {property.operationType === 'RENT' ? 'Arriendo' : 'Venta'}
            </span>
          </div>

          {/* Price */}
          <div className="mb-2">
            <span className="text-2xl font-bold text-foreground">
              {priceFormatted}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center space-x-2 mb-3">
            <FontAwesome icon="location-dot" className="text-muted-foreground" />
            <span className="text-sm font-light text-muted-foreground">
              {locationText}
            </span>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Left Column - Images and Details */}
          <div className="w-full lg:w-3/4 rounded-lg p-6">
            {/* Gallery Section */}
            <div className="mb-6">
              <MultimediaGrid
                mainImageUrl={mainImageUrl}
                multimedia={normalizedMultimedia}
                propertyTitle={property.title}
              />
            </div>

            {/* Key Characteristics */}
            {(property.bedrooms !== undefined || property.bathrooms !== undefined || 
              property.builtSquareMeters !== undefined || property.landSquareMeters !== undefined || 
              property.parkingSpaces !== undefined) && (
              <div className="mb-6 border-t pt-4">
                <div className="flex flex-row items-center gap-4 min-h-[40px] py-1">
                  {/* Características */}
                  {property.bedrooms != null && property.bedrooms > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
                        bed
                      </span>
                      <span className="text-xs text-foreground">
                        {property.bedrooms}
                      </span>
                    </div>
                  )}
                  {property.bathrooms != null && property.bathrooms > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
                        bathtub
                      </span>
                      <span className="text-xs text-foreground">
                        {property.bathrooms}
                      </span>
                    </div>
                  )}
                  {property.builtSquareMeters != null && property.builtSquareMeters > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
                        home
                      </span>
                      <span className="text-xs text-foreground">
                        {Math.round(property.builtSquareMeters)}
                      </span>
                    </div>
                  )}
                  {property.landSquareMeters != null && property.landSquareMeters > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
                        screenshot_frame_2
                      </span>
                      <span className="text-xs text-foreground">
                        {property.landSquareMeters}
                      </span>
                    </div>
                  )}
                  {property.parkingSpaces != null && property.parkingSpaces > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-rounded text-primary" style={{ fontSize: '20px' }}>
                        local_parking
                      </span>
                      <span className="text-xs text-foreground">
                        {property.parkingSpaces}
                      </span>
                    </div>
                  )}
                  {/* Botón de favorito alineado vertical y derecha */}
                  <div className="flex-1 flex justify-end items-center">
                    <button
                      onClick={handleToggleFavorite}
                      disabled={isLoadingFav}
                      className="flex items-center justify-center p-1 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50"
                      title={isFavorited ? 'Remover de favoritos' : 'Agregar a favoritos'}
                    >
                      <span
                        className={`material-symbols-outlined transition-all ${
                          isFavorited
                            ? 'text-red-500 fill-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        style={{ fontSize: '22px' }}
                      >
                        {isFavorited ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Descripción
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Contact Form */}
          <div className="w-full lg:w-1/4 rounded-lg p-6 h-fit lg:sticky lg:top-20">
            <h3 className="text-xl font-bold text-foreground text-center mb-4 pb-3 border-b">
              Contáctanos
            </h3>

            {/* Agent Info */}
            {property.assignedAgent && (
              <div className="flex flex-col items-center space-y-3 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <FontAwesome
                    icon="user"
                    className="text-primary text-2xl"
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">
                    {agentName}
                  </p>
                  <div className="flex flex-col items-center text-sm text-muted-foreground mt-2 space-y-1">
                    {property.assignedAgent.username && (
                      <div className="flex items-center">
                        <FontAwesome icon="phone" className="text-primary mr-2" />
                        <span>{property.assignedAgent.username}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                label="Nombre"
                type="text"
                placeholder="Tu Nombre"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                disabled={isSubmitting}
              />

              <TextField
                label="Correo"
                type="email"
                placeholder="Tu Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                disabled={isSubmitting}
              />

              <TextField
                label="Mensaje"
                type="textarea"
                name="message"
                placeholder="Escribe tu mensaje..."
                value={formData.message}
                onChange={handleFormChange}
                disabled={isSubmitting}
                rows={4}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center"
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} />
                    <span className="ml-2">Enviando...</span>
                  </>
                ) : (
                  'Estoy interesado'
                )}
              </Button>
            </form>

            {/* WhatsApp Button */}
            {/* WhatsApp Button eliminado por requerimiento */}
          </div>
        </div>

        {/* Location Map Section */}
        {(property.state || property.city || property.address || (property.latitude && property.longitude)) && (
          <div className="w-full rounded-lg p-6">
            {/* Map if coordinates available */}
            {property.latitude && property.longitude && (
              <PropertyMapWrapper
                latitude={property.latitude}
                longitude={property.longitude}
                title={property.title}
                address={property.address}
                city={property.city}
                state={property.state}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
