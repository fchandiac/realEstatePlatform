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
        {/* Bedrooms */}
        {propertyType?.hasBedrooms && (
          <NumberStepper
            label="Dormitorios"
            value={formData.bedrooms || 0}
            onChange={(value) => handleChange('bedrooms', value)}
            min={0}
            max={20}
            step={1}
          />
        )}

        {/* Bathrooms */}
        {propertyType?.hasBathrooms && (
          <NumberStepper
            label="Baños"
            value={formData.bathrooms || 0}
            onChange={(value) => handleChange('bathrooms', value)}
            min={0}
            max={20}
            step={1}
          />
        )}

        {/* Parking Spaces */}
        {propertyType?.hasParkingSpaces && (
          <NumberStepper
            label="Estacionamientos"
            value={formData.parkingSpaces || 0}
            onChange={(value) => handleChange('parkingSpaces', value)}
            min={0}
            max={20}
            step={1}
          />
        )}

        {/* Floors */}
        {propertyType?.hasFloors && (
          <NumberStepper
            label="Pisos"
            value={formData.floors || 0}
            onChange={(value) => handleChange('floors', value)}
            min={0}
            max={50}
            step={1}
          />
        )}

        {/* Built Square Meters */}
        {propertyType?.hasBuiltSquareMeters && (
          <TextField
            type="number"
            label="Metros (m²) Construidos"
            placeholder="ej. 120.50"
            value={formData.builtSquareMeters?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              handleChange('builtSquareMeters', e.target.value ? parseFloat(e.target.value) : 0)
            }
          />
        )}

        {/* Land Square Meters */}
        {propertyType?.hasLandSquareMeters && (
          <TextField
            type="number"
            label="Terreno (m²)"
            placeholder="ej. 250.75"
            value={formData.landSquareMeters?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              handleChange('landSquareMeters', e.target.value ? parseFloat(e.target.value) : 0)
            }
          />
        )}

        {/* Construction Year */}
        {propertyType?.hasConstructionYear && (
          <TextField
            type="number"
            label="Año de Construcción"
            placeholder="ej. 2020"
            value={formData.constructionYear?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              handleChange('constructionYear', e.target.value ? parseInt(e.target.value) : null)
            }
          />
        )}
      </div>
    </div>
  );
}
