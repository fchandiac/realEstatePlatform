'use client';

import { TextField } from '@/components/TextField/TextField';
import AutoComplete from '@/components/AutoComplete/AutoComplete';
import LocationPicker from '@/components/LocationPicker/LocationPicker';
import { CreatePropertyFormData, LocationOption } from '../types';

interface LocationSectionProps {
  formData: CreatePropertyFormData;
  handleChange: (field: string, value: any) => void;
  stateOptions: LocationOption[];
  loadingStates: boolean;
  cityOptions: LocationOption[];
  loadingCities: boolean;
}

export default function LocationSection({
  formData,
  handleChange,
  stateOptions,
  loadingStates,
  cityOptions,
  loadingCities,
}: LocationSectionProps) {
  return (
    <div className="space-y-4 border-b pb-4 mb-4">
      <h2 className="text-lg font-semibold">Ubicación</h2>
      
      <TextField
        label="Dirección"
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
        required
      />
      
      <div className="flex space-x-4">
        <div className="flex-1">
          <AutoComplete
            label="Región"
            options={stateOptions}
            value={formData.state}
            onChange={(value) => handleChange('state', value)}
            required
            placeholder={loadingStates ? "Cargando regiones..." : "Selecciona una región"}
          />
        </div>
        <div className="flex-1">
          <AutoComplete
            label="Comuna"
            options={cityOptions}
            value={formData.city}
            onChange={(value) => handleChange('city', value)}
            required
            placeholder={
              !formData.state || !formData.state.id
                ? "Primero selecciona una región"
                : loadingCities
                ? "Cargando comunas..."
                : "Selecciona una comuna"
            }
          />
        </div>
      </div>
      
      <LocationPicker
        onChange={(location) => handleChange('location', location)}
      />
    </div>
  );
}
