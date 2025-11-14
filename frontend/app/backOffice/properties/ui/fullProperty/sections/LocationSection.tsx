'use client';

import { useState, useEffect, useCallback } from 'react';
import { TextField } from '@/components/TextField/TextField';
import UpdateLocationPicker from '@/components/LocationPicker/UpdateLocationPickerWrapper';
import AutoComplete from '@/components/AutoComplete/AutoComplete';
import { Button } from '@/components/Button/Button';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import Alert from '@/components/Alert/Alert';
import { getComunasByRegion } from '@/app/actions/commons';
import { updatePropertyLocation } from '@/app/actions/properties';
import { useAlert } from '@/app/hooks/useAlert';
import type { LocationSectionProps, Region } from '../types/property.types';

export default function LocationSection({ property, regions, onChange }: LocationSectionProps) {
  // Estados locales para los inputs
  const [address, setAddress] = useState(property.address || '');
  const [latitude, setLatitude] = useState(property.latitude || '');
  const [longitude, setLongitude] = useState(property.longitude || '');
  
  const [cityOptions, setCityOptions] = useState<Region[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedState, setSelectedState] = useState<Region | null>(null);
  const [selectedCity, setSelectedCity] = useState<Region | null>(null);

  // Estados para la actualización
  const [isUpdating, setIsUpdating] = useState(false);
  const { showAlert } = useAlert();

  // Inicializar región y comuna seleccionadas cuando se carga la propiedad
  useEffect(() => {
    console.log('🔄 LocationSection - Inicializando con property:', { state: property.state, city: property.city });
    
    if (regions.length === 0) {
      console.log('⚠️ Regions aún no cargadas');
      return;
    }

    // Buscar la región coincidente
    if (property.state) {
      // Intentar diferentes formas de buscar la región
      const matchedState: Region | undefined = regions.find(r => r.id === property.state) || 
                     regions.find(r => r.label === property.state) ||
                     regions.find(r => r.id?.toLowerCase() === property.state?.toLowerCase());
      
      if (matchedState) {
        console.log('✅ Región encontrada:', matchedState);
        setSelectedState(matchedState);
      } else {
        console.log('❌ Región NO encontrada. Buscado:', property.state, 'Disponibles:', regions);
      }
    }
  }, [property.state, regions]);

  // Cargar comunas cuando cambia la región seleccionada
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedState?.id) {
        console.log('⚠️ No hay región seleccionada, limpiando comunas');
        setCityOptions([]);
        setSelectedCity(null);
        return;
      }

      console.log('🔄 Cargando comunas para región:', selectedState.id);
      setLoadingCities(true);
      try {
        const cities = await getComunasByRegion(selectedState.id);
        console.log('✅ Comunas cargadas:', cities.length, cities);
        setCityOptions(cities);
        
        // Preseleccionar comuna si existe
        if (property.city && cities.length > 0) {
          const matchedCity = cities.find(c => c.id === property.city) || 
                              cities.find(c => c.label === property.city) ||
                              cities.find(c => c.id?.toLowerCase() === property.city?.toLowerCase());
          
          if (matchedCity) {
            console.log('✅ Comuna encontrada:', matchedCity);
            setSelectedCity(matchedCity);
          } else {
            console.log('❌ Comuna NO encontrada. Buscada:', property.city, 'Disponibles:', cities);
          }
        }
      } catch (error) {
        console.error('❌ Error loading cities:', error);
        setCityOptions([]);
        showAlert({
          message: 'Error al cargar comunas',
          type: 'error',
          duration: 3000
        });
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [selectedState?.id, property.city, showAlert]);

  // Actualizar campo de dirección desde onChange
  useEffect(() => {
    if (property.address !== undefined) {
      setAddress(property.address);
    }
  }, [property.address]);

  // Actualizar coordenadas desde onChange
  useEffect(() => {
    if (property.latitude) setLatitude(property.latitude);
    if (property.longitude) setLongitude(property.longitude);
  }, [property.latitude, property.longitude]);

  const handleUpdateLocation = useCallback(async () => {
    setIsUpdating(true);

    try {
      // Validar que todos los campos requeridos estén llenos
      if (!address.trim()) {
        showAlert({
          message: 'La dirección es requerida',
          type: 'error',
          duration: 3000
        });
        setIsUpdating(false);
        return;
      }

      if (!selectedState) {
        showAlert({
          message: 'Debe seleccionar una región',
          type: 'error',
          duration: 3000
        });
        setIsUpdating(false);
        return;
      }

      if (!selectedCity) {
        showAlert({
          message: 'Debe seleccionar una comuna',
          type: 'error',
          duration: 3000
        });
        setIsUpdating(false);
        return;
      }

      if (!latitude || !longitude) {
        showAlert({
          message: 'Debe especificar latitud y longitud',
          type: 'error',
          duration: 3000
        });
        setIsUpdating(false);
        return;
      }

      const locationData = {
        address: address.trim(),
        state: selectedState.id,
        city: selectedCity.id,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };

      console.log('📍 Enviando datos de ubicación:', locationData);

      const result = await updatePropertyLocation(property.id, locationData);

      if (result.success) {
        showAlert({
          message: 'Ubicación actualizada correctamente',
          type: 'success',
          duration: 3000
        });
      } else {
        showAlert({
          message: result.error || 'Error al actualizar ubicación',
          type: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('❌ Error al actualizar ubicación:', error);
      showAlert({
        message: error instanceof Error ? error.message : 'Error inesperado al actualizar ubicación',
        type: 'error',
        duration: 5000
      });
    } finally {
      setIsUpdating(false);
    }
  }, [property.id, address, selectedState, selectedCity, latitude, longitude, showAlert]);

  return (
    <div className="space-y-6">
      {/* Dirección */}
      <div className="w-full">
        <TextField
          label="Dirección"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            onChange('address', e.target.value);
          }}
          required
          placeholder="Ej: Calle Principal 123, Apartamento 5B"
        />
      </div>

      {/* Región y Comuna */}
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

      {/* Coordenadas desde el mapa */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Ubicación en el mapa
        </label>
        <p className="text-xs text-muted-foreground">
          {latitude && longitude 
            ? `Coordenadas actuales: ${latitude}, ${longitude}` 
            : 'Haz click en el mapa para seleccionar la ubicación exacta de la propiedad'}
        </p>
        {/* Mostrar si hay coordenadas guardadas */}
        {property.latitude && property.longitude && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
            <span className="material-symbols-outlined text-sm align-text-bottom mr-1">info</span>
            Ubicación guardada: {property.latitude}, {property.longitude}
          </div>
        )}
        <UpdateLocationPicker
          initialCoordinates={{
            lat: latitude ? parseFloat(latitude) : (property.latitude ? parseFloat(property.latitude) : -33.8688),
            lng: longitude ? parseFloat(longitude) : (property.longitude ? parseFloat(property.longitude) : -51.2093)
          }}
          onChange={(coords) => {
            if (!coords) return;
            console.log('📍 Usuario cambió ubicación a:', coords);
            const lat = coords.lat.toFixed(6);
            const lng = coords.lng.toFixed(6);
            setLatitude(lat);
            setLongitude(lng);
            onChange('latitude', lat);
            onChange('longitude', lng);
          }}
        />
      </div>

      {/* Botón de actualizar ubicación */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleUpdateLocation}
          disabled={isUpdating || !address || !selectedState || !selectedCity || !latitude || !longitude}
          variant="primary"
        >
          {isUpdating ? (
            <>
              <CircularProgress size={16} thickness={2} className="mr-2" />
              Actualizando ubicación...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm mr-2">location_on</span>
              Guardar ubicación
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
