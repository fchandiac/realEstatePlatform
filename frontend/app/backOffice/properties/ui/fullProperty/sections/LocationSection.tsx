'use client';

import { useState, useEffect } from 'react';
import { TextField } from '@/components/TextField/TextField';
import LocationPicker from '@/components/LocationPicker/LocationPicker';
import AutoComplete from '@/components/AutoComplete/AutoComplete';
import { getComunasByRegion } from '@/app/actions/commons';
import type { LocationSectionProps, Region } from '../types/property.types';

export default function LocationSection({ property, regions, onChange }: LocationSectionProps) {
  const [cityOptions, setCityOptions] = useState<Region[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedState, setSelectedState] = useState<Region | null>(null);
  const [selectedCity, setSelectedCity] = useState<Region | null>(null);

  // Inicializar región seleccionada
  useEffect(() => {
    if (property.state && regions.length > 0) {
      const match = regions.find(r => r.id === property.state || r.label === property.state);
      if (match) setSelectedState(match);
    }
  }, [property.state, regions]);

  // Cargar comunas cuando cambia la región
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedState?.id) {
        setCityOptions([]);
        setSelectedCity(null);
        return;
      }

      setLoadingCities(true);
      try {
        const cities = await getComunasByRegion(selectedState.id);
        setCityOptions(cities);
        
        // Preseleccionar comuna si existe
        if (property.city) {
          const match = cities.find(c => c.id === property.city || c.label === property.city);
          if (match) setSelectedCity(match);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
        setCityOptions([]);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [selectedState?.id, property.city]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-4">
        {/* Dirección */}
        <div className="w-full">
          <TextField
            label="Dirección"
            value={property.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
          />
        </div>

        {/* Picker de ubicación */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Selecciona un punto en el mapa para actualizar la latitud y longitud.
          </p>
          <LocationPicker
            height="320px"
            onChange={(coords) => {
              if (!coords) return;
              // Guardar con 6 decimales como string
              onChange('latitude', coords.lat.toFixed(6));
              onChange('longitude', coords.lng.toFixed(6));
            }}
          />
        </div>

        {/* Región y Comuna con AutoComplete */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AutoComplete
            label="Región"
            options={regions}
            value={selectedState}
            onChange={(opt) => {
              setSelectedState(opt);
              onChange('state', opt?.id || '');
              // Resetear comuna al cambiar región
              setSelectedCity(null);
              onChange('city', '');
            }}
            required
            placeholder="Selecciona una región"
            data-test-id="autocomplete-region"
          />
          
          <AutoComplete
            label="Comuna"
            options={cityOptions}
            value={selectedCity}
            onChange={(opt) => {
              setSelectedCity(opt);
              onChange('city', opt?.id || '');
            }}
            required
            placeholder={
              !selectedState?.id 
                ? 'Primero selecciona una región' 
                : (loadingCities ? 'Cargando comunas...' : 'Selecciona una comuna')
            }
            data-test-id="autocomplete-city"
          />
        </div>
      </div>
    </div>
  );
}
