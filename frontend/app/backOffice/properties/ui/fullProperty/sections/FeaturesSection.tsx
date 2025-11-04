'use client';

import { TextField } from '@/components/TextField/TextField';
import type { FeaturesSectionProps } from '../types/property.types';

// Función para determinar qué características deshabilitar según el tipo de propiedad
const getPropertyTypeFeatures = (propertyTypeName?: string) => {
  if (!propertyTypeName) {
    // Si no hay tipo definido, mostrar todas las características
    return {
      hasBedrooms: true,
      hasBathrooms: true,
      hasBuiltSquareMeters: true,
      hasLandSquareMeters: true,
      hasParkingSpaces: true,
      hasFloors: true,
      hasConstructionYear: true,
    };
  }

  const type = propertyTypeName.toLowerCase();

  // Lógica basada en tipos comunes de propiedades
  if (type.includes('departamento') || type.includes('apartamento')) {
    return {
      hasBedrooms: true,
      hasBathrooms: true,
      hasBuiltSquareMeters: true,
      hasLandSquareMeters: false, // Los deptos generalmente no tienen terreno propio
      hasParkingSpaces: true,
      hasFloors: false, // Los deptos están en un piso específico del edificio
      hasConstructionYear: true,
    };
  }

  if (type.includes('casa') || type.includes('villa') || type.includes('chalet')) {
    return {
      hasBedrooms: true,
      hasBathrooms: true,
      hasBuiltSquareMeters: true,
      hasLandSquareMeters: true,
      hasParkingSpaces: true,
      hasFloors: true,
      hasConstructionYear: true,
    };
  }

  if (type.includes('oficina') || type.includes('local') || type.includes('comercial')) {
    return {
      hasBedrooms: false,
      hasBathrooms: true,
      hasBuiltSquareMeters: true,
      hasLandSquareMeters: false,
      hasParkingSpaces: true,
      hasFloors: true,
      hasConstructionYear: true,
    };
  }

  if (type.includes('parcela') || type.includes('terreno') || type.includes('sitio')) {
    return {
      hasBedrooms: false,
      hasBathrooms: false,
      hasBuiltSquareMeters: false,
      hasLandSquareMeters: true,
      hasParkingSpaces: false,
      hasFloors: false,
      hasConstructionYear: false,
    };
  }

  if (type.includes('bodega') || type.includes('depósito')) {
    return {
      hasBedrooms: false,
      hasBathrooms: false,
      hasBuiltSquareMeters: true,
      hasLandSquareMeters: true,
      hasParkingSpaces: false,
      hasFloors: false,
      hasConstructionYear: true,
    };
  }

  // Por defecto, mostrar todas las características
  return {
    hasBedrooms: true,
    hasBathrooms: true,
    hasBuiltSquareMeters: true,
    hasLandSquareMeters: true,
    hasParkingSpaces: true,
    hasFloors: true,
    hasConstructionYear: true,
  };
};

export default function FeaturesSection({ property, onChange }: FeaturesSectionProps) {
  const propertyTypeName = property.propertyType?.name;
  const features = getPropertyTypeFeatures(propertyTypeName);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Mostrar tipo de propiedad */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Características de la propiedad
        </h3>
        {propertyTypeName && (
          <p className="text-sm text-muted-foreground">
            Tipo: <span className="font-medium text-foreground">{propertyTypeName}</span>
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
