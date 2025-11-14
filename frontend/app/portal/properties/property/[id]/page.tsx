import React from 'react';
import { getPublishedPropertyPublic } from './actions';
import PropertyDetailClient from './PropertyDetailClient';

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
          <p className="text-muted-foreground">
            {propertyResult.error || 'No pudimos cargar los datos de la propiedad'}
          </p>
        </div>
      </div>
    );
  }

  // Pass data to client component for interactivity
  return <PropertyDetailClient property={propertyResult.data} />;
}
