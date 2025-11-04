'use client';

import { TextField } from '@/components/TextField/TextField';
import type { FeaturesSectionProps } from '../types/property.types';

export default function FeaturesSection({ property, onChange }: FeaturesSectionProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField 
          label="Metros Construidos" 
          type="number"
          value={property.builtSquareMeters?.toString() || ''} 
          onChange={(e) => onChange('builtSquareMeters', parseFloat(e.target.value) || 0)}
        />
        <TextField 
          label="Metros Terreno" 
          type="number"
          value={property.landSquareMeters?.toString() || ''} 
          onChange={(e) => onChange('landSquareMeters', parseFloat(e.target.value) || 0)}
        />
        <TextField 
          label="Dormitorios" 
          type="number"
          value={property.bedrooms?.toString() || ''} 
          onChange={(e) => onChange('bedrooms', parseInt(e.target.value) || 0)}
        />
        <TextField 
          label="Baños" 
          type="number"
          value={property.bathrooms?.toString() || ''} 
          onChange={(e) => onChange('bathrooms', parseInt(e.target.value) || 0)}
        />
        <TextField 
          label="Estacionamientos" 
          type="number"
          value={property.parkingSpaces?.toString() || ''} 
          onChange={(e) => onChange('parkingSpaces', parseInt(e.target.value) || 0)}
        />
        <TextField 
          label="Plantas" 
          type="number"
          value={property.floors?.toString() || ''} 
          onChange={(e) => onChange('floors', parseInt(e.target.value) || 0)}
        />
        <TextField 
          label="Año Construcción" 
          type="number"
          value={property.constructionYear?.toString() || ''} 
          onChange={(e) => onChange('constructionYear', parseInt(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}
