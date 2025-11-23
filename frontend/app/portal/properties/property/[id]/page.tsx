import React from 'react';
import { getPublishedPropertyPublic } from './actions';
import PropertyDetailClient from './PropertyDetailClient';
import NavBar from '../../../ui/NavBar';

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;

  // Fetch property data on server (public endpoint, no auth required)
  const propertyResult = await getPublishedPropertyPublic(id);

  if (!propertyResult.success || !propertyResult.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Propiedad no encontrada
          </h1>
          {/* Solo mostrar mensaje secundario si es distinto al título */}
          {propertyResult.error && propertyResult.error !== 'Propiedad no encontrada' && (
            <p className="text-muted-foreground">
              {propertyResult.error}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Pass data to client component for interactivity
  return (
    <>
      {/* NavBar - Sticky */}
      <div className="sticky top-16 z-40 bg-background shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12)]">
        <NavBar />
      </div>

      {/* Property Detail */}
      <PropertyDetailClient property={propertyResult.data} />
    </>
  );
}
