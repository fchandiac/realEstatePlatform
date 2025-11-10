import React from 'react';
import PropertyCard, { PortalProperty } from './PropertyCard';

interface PropertyFromAPI {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  operationType: string;
  state: string;
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  totalArea: number;
  mainImageUrl: string;
  createdAt: string;
}

interface ListPropertiesProps {
  properties: PropertyFromAPI[];
}

export default function ListProperties({ properties }: ListPropertiesProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          // Mapear los campos de la API a la interfaz que PropertyCard espera
          const mappedProperty: PortalProperty = {
            id: property.id,
            title: property.title,
            description: property.description || null,
            operationType: (property.operationType === 'SALE' ? 'SALE' : 'RENT') as any,
            price: property.price,
            currencyPrice: (property.currency as 'CLP' | 'UF') || 'CLP',
            state: property.state,
            city: property.city,
            mainImageUrl: property.mainImageUrl || null,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            builtSquareMeters: property.totalArea,
            landSquareMeters: null,
            parkingSpaces: null,
            isFeatured: false,
          };

          return <PropertyCard key={property.id} property={mappedProperty} />;
        })}
      </div>
    </div>
  );
}
