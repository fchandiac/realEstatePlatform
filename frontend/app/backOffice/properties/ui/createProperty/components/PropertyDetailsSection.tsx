'use client';

import { TextField } from '@/components/TextField/TextField';
import NumberStepper from '@/components/NumberStepper/NumberStepper';
import { CreatePropertyFormData } from '../types';
import { PropertyType } from '@/app/actions/propertyTypes';

interface PropertyDetailsSectionProps {
  formData: CreatePropertyFormData;
  handleChange: (field: string, value: any) => void;
  propertyType?: PropertyType | null;
}

export default function PropertyDetailsSection({
  formData,
  handleChange,
  propertyType,
}: PropertyDetailsSectionProps) {
  if (!propertyType) {
    return null;
  }

  return (
    <div className="space-y-4 border-b pb-4 mb-4">
      <h2 className="text-lg font-semibold">Características</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dormitorios */}
        {propertyType?.hasBedrooms && (
          <NumberStepper
            label="Dormitorios"
            value={formData.bedrooms || 0}
            onChange={(value) => handleChange('bedrooms', value || null)}
            min={0}
            max={20}
            step={1}
          />
        )}

        {/* Baños */}
        {propertyType?.hasBathrooms && (
          <NumberStepper
            label="Baños"
            value={formData.bathrooms || 0}
            onChange={(value) => handleChange('bathrooms', value || null)}
            min={0}
            max={20}
            step={1}
          />
        )}

        {/* Estacionamientos */}
        {propertyType?.hasParkingSpaces && (
          <NumberStepper
            label="Estacionamientos"
            value={formData.parkingSpaces || 0}
            onChange={(value) => handleChange('parkingSpaces', value || null)}
            min={0}
            max={20}
            step={1}
          />
        )}

        {/* Pisos */}
        {propertyType?.hasFloors && (
          <NumberStepper
            label="Pisos"
            value={formData.floors || 0}
            onChange={(value) => handleChange('floors', value || null)}
            min={0}
            max={50}
            step={1}
          />
        )}

        {/* Metros Construidos */}
        {propertyType?.hasBuiltSquareMeters && (
          <TextField
            type="number"
            label="Metros (m²) Construidos"
            placeholder="ej. 120.50"
            value={formData.builtSquareMeters ? String(formData.builtSquareMeters) : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const val = e.target.value;
              handleChange('builtSquareMeters', val ? parseFloat(val) : null);
            }}
          />
        )}

        {/* Terreno */}
        {propertyType?.hasLandSquareMeters && (
          <TextField
            type="number"
            label="Terreno (m²)"
            placeholder="ej. 250.75"
            value={formData.landSquareMeters ? String(formData.landSquareMeters) : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const val = e.target.value;
              handleChange('landSquareMeters', val ? parseFloat(val) : null);
            }}
          />
        )}

        {/* Año de Construcción */}
        {propertyType?.hasConstructionYear && (
          <TextField
            type="number"
            label="Año de Construcción"
            placeholder="ej. 2020"
            value={formData.constructionYear ? String(formData.constructionYear) : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const val = e.target.value;
              handleChange('constructionYear', val ? parseInt(val, 10) : null);
            }}
          />
        )}
      </div>
    </div>
  );
}
