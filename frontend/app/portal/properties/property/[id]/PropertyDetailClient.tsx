'use client';

import React, { useState } from 'react';
import { Property } from './actions';
import { Button } from '@/components/Button/Button';
import { TextField } from '@/components/TextField/TextField';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { useAlert } from '@/app/hooks/useAlert';
import FontAwesome from '@/components/FontAwesome/FontAwesome';
import { env } from '@/lib/env';

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

  const mainImage = property.multimedia?.[0];
  const thumbnailImages = property.multimedia?.slice(1, 4) || [];

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
  const thumbnailUrls = thumbnailImages.map(img => normalizeImageUrl(img.url));

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <div className="flex items-center justify-center space-x-2">
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
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Galería de la Propiedad
              </h2>

              {/* Image Grid */}
              <div className="flex flex-col md:flex-row gap-4 h-96">
                {/* Main Image - 75% width */}
                <div className="w-full md:w-3/4 h-full overflow-hidden rounded-lg shadow-md">
                  {mainImageUrl ? (
                    <img
                      src={mainImageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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

                {/* Thumbnail Grid - 25% width */}
                <div className="w-full md:w-1/4 h-full flex flex-row md:flex-col gap-4">
                  {thumbnailUrls.length > 0 ? (
                    thumbnailUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="w-1/3 md:w-full h-full md:h-1/3 overflow-hidden rounded-lg shadow-md"
                      >
                        {url ? (
                          <img
                            src={url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                    ))
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
                      <FontAwesome
                        icon="image-not-supported"
                        className="text-muted-foreground text-2xl"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key Characteristics */}
            {(property.bedrooms !== undefined || property.bathrooms !== undefined || 
              property.builtSquareMeters !== undefined || property.landSquareMeters !== undefined || 
              property.parkingSpaces !== undefined) && (
              <div className="mb-6 border-t pt-4">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Características Clave
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {property.bedrooms !== undefined && (
                    <div className="flex items-center space-x-2 p-3 rounded-lg">
                      <FontAwesome icon="bed" className="text-primary text-lg" />
                      <span className="font-medium text-sm text-foreground">
                        {property.bedrooms} Dormitorios
                      </span>
                    </div>
                  )}
                  {property.bathrooms !== undefined && (
                    <div className="flex items-center space-x-2 p-3 rounded-lg">
                      <FontAwesome icon="bath" className="text-primary text-lg" />
                      <span className="font-medium text-sm text-foreground">
                        {property.bathrooms} Baños
                      </span>
                    </div>
                  )}
                  {property.builtSquareMeters !== undefined && (
                    <div className="flex items-center space-x-2 p-3 rounded-lg">
                      <FontAwesome
                        icon="house-chimney"
                        className="text-primary text-lg"
                      />
                      <span className="font-medium text-sm text-foreground">
                        {property.builtSquareMeters} m² const.
                      </span>
                    </div>
                  )}
                  {property.landSquareMeters !== undefined && (
                    <div className="flex items-center space-x-2 p-3 rounded-lg">
                      <FontAwesome icon="square" className="text-primary text-lg" />
                      <span className="font-medium text-sm text-foreground">
                        {property.landSquareMeters} m² terreno
                      </span>
                    </div>
                  )}
                  {property.parkingSpaces !== undefined && (
                    <div className="flex items-center space-x-2 p-3 rounded-lg">
                      <FontAwesome
                        icon="square-parking"
                        className="text-primary text-lg"
                      />
                      <span className="font-medium text-sm text-foreground">
                        {property.parkingSpaces} Estacionamiento
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Descripción General
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  placeholder="Me interesa esta propiedad. Por favor, contáctame para más detalles o para agendar una visita."
                  rows={4}
                  value={formData.message}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150 resize-none"
                />
              </div>

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
            {property.assignedAgent?.username && (
              <a
                href={`https://wa.me/${property.assignedAgent.username.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
              >
                <FontAwesome icon="whatsapp" />
                <span>Contactar por WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Location Map Section */}
        {(property.state || property.city || property.address || (property.latitude && property.longitude)) && (
          <div className="w-full rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Ubicación de la Propiedad
            </h3>
            
            {/* Location Details */}
            <div className="mb-6 space-y-2">
              {property.address && (
                <p className="text-foreground">
                  <span className="font-semibold">Dirección:</span> {property.address}
                </p>
              )}
              {property.city && (
                <p className="text-foreground">
                  <span className="font-semibold">Comuna:</span> {property.city}
                </p>
              )}
              {property.state && (
                <p className="text-foreground">
                  <span className="font-semibold">Región:</span> {property.state}
                </p>
              )}
            </div>

            {/* Map if coordinates available */}
            {property.latitude && property.longitude && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${
                    property.longitude
                  }!3d${
                    property.latitude
                  }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x${Math.random().toString(16).slice(2)}!2s${encodeURIComponent(
                    property.address || `${property.city}, ${property.state}`
                  )}!5e0!3m2!1sen!2scl!4v1709292812260`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
