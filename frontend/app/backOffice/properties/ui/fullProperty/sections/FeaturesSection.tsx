'use client';

import { TextField } from '@/components/TextField/TextField';
import type { FeaturesSectionProps } from '../types/property.types';
import { getPropertyType } from '@/app/actions/propertyTypes';
import { useEffect, useState } from 'react';

export default function FeaturesSection({ property, onChange }: FeaturesSectionProps) {
  const [features, setFeatures] = useState({
    hasBedrooms: true,
    hasBathrooms: true,
    hasBuiltSquareMeters: true,
    hasLandSquareMeters: true,
    hasParkingSpaces: true,
    hasFloors: true,
    hasConstructionYear: true,
  });

  const propertyTypeId = property.propertyType?.id;

  useEffect(() => {
    const loadPropertyTypeFeatures = async () => {
      if (!propertyTypeId) {
        // Si no hay tipo definido, mostrar todas las características habilitadas
        setFeatures({
          hasBedrooms: true,
          hasBathrooms: true,
          hasBuiltSquareMeters: true,
          hasLandSquareMeters: true,
          hasParkingSpaces: true,
          hasFloors: true,
          hasConstructionYear: true,
        });
        return;
      }

      try {
        // Obtener el tipo de propiedad completo desde la API usando el ID
        const propertyType = await getPropertyType(propertyTypeId);

        // Usar las propiedades reales del tipo de propiedad para determinar qué deshabilitar
        setFeatures({
          hasBedrooms: propertyType.hasBedrooms ?? true,
          hasBathrooms: propertyType.hasBathrooms ?? true,
          hasBuiltSquareMeters: propertyType.hasBuiltSquareMeters ?? true,
          hasLandSquareMeters: propertyType.hasLandSquareMeters ?? true,
          hasParkingSpaces: propertyType.hasParkingSpaces ?? true,
          hasFloors: propertyType.hasFloors ?? true,
          hasConstructionYear: propertyType.hasConstructionYear ?? true,
        });
      } catch (error) {
        console.error('Error fetching property type features:', error);
        // En caso de error, mostrar todas las características habilitadas
        setFeatures({
          hasBedrooms: true,
          hasBathrooms: true,
          hasBuiltSquareMeters: true,
          hasLandSquareMeters: true,
          hasParkingSpaces: true,
          hasFloors: true,
          hasConstructionYear: true,
        });
      }
    };

    loadPropertyTypeFeatures();
  }, [propertyTypeId]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Mostrar tipo de propiedad */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Características de la propiedad
        </h3>
        {property.propertyType?.name && (
          <p className="text-sm text-muted-foreground">
            Tipo: <span className="font-medium text-foreground">{property.propertyType.name}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Metros Construidos"
          type="number"
          startIcon="home"
          value={property.builtSquareMeters?.toString() || ''}
          onChange={(e) => onChange('builtSquareMeters', parseFloat(e.target.value) || 0)}
          disabled={!features.hasBuiltSquareMeters}
        />

        <TextField
          label="Metros Terreno"
          type="number"
          startIcon="screenshot_frame_2"
          value={property.landSquareMeters?.toString() || ''}
          onChange={(e) => onChange('landSquareMeters', parseFloat(e.target.value) || 0)}
          disabled={!features.hasLandSquareMeters}
        />

        <TextField
          label="Dormitorios"
          type="number"
          startIcon="bed"
          value={property.bedrooms?.toString() || ''}
          onChange={(e) => onChange('bedrooms', parseInt(e.target.value) || 0)}
          disabled={!features.hasBedrooms}
        />

        <TextField
          label="Baños"
          type="number"
          startIcon="bathtub"
          value={property.bathrooms?.toString() || ''}
          onChange={(e) => onChange('bathrooms', parseInt(e.target.value) || 0)}
          disabled={!features.hasBathrooms}
        />

        <TextField
          label="Estacionamientos"
          type="number"
          startIcon="parking_sign"
          value={property.parkingSpaces?.toString() || ''}
          onChange={(e) => onChange('parkingSpaces', parseInt(e.target.value) || 0)}
          disabled={!features.hasParkingSpaces}
        />

        <TextField
          label="Plantas"
          type="number"
          startIcon="apartment"
          value={property.floors?.toString() || ''}
          onChange={(e) => onChange('floors', parseInt(e.target.value) || 0)}
          disabled={!features.hasFloors}
        />

        <TextField
          label="Año Construcción"
          type="number"
          startIcon="calendar_today"
          value={property.constructionYear?.toString() || ''}
          onChange={(e) => onChange('constructionYear', parseInt(e.target.value) || 0)}
          disabled={!features.hasConstructionYear}
        />
      </div>
    </div>
  );
}
