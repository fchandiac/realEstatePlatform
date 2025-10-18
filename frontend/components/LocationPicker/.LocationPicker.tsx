'use client'
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TextField } from '../TextField/TextField';

// Crear icono personalizado con Material Symbols del proyecto
const createCustomIcon = () => {
  return L.divIcon({
    html: `
      <span class="material-symbols-outlined text-primary" style="
        font-size: 24px;
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      ">location_on</span>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

interface LocationPickerProps {
  height?: string;
  onChange?: (coordinates: { lat: number; lng: number } | null) => void;
  initialCoordinates?: { lat: number; lng: number } | null;
}

// Componente para manejar los clicks en el mapa
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ height = '400px', onChange, initialCoordinates }) => {
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(initialCoordinates || null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialCoordinates ? [initialCoordinates.lat, initialCoordinates.lng] : null
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialCoordinates ? [initialCoordinates.lat, initialCoordinates.lng] : [-33.45, -70.6667]
  );
  const [isLoading, setIsLoading] = useState(!initialCoordinates);

  // Inicialización: Obtener ubicación actual del usuario automáticamente
  useEffect(() => {
    // Solo inicializar si no tenemos coordenadas actuales y no hay coordenadas iniciales
    if (!currentCoordinates && !initialCoordinates && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords = { lat: latitude, lng: longitude };
          const userLocation: [number, number] = [latitude, longitude];
          
          // Actualizar todas las coordenadas como si fueran iniciales
          setCurrentCoordinates(newCoords);
          setMapCenter(userLocation);
          setMarkerPosition(userLocation);
          setIsLoading(false);
          
          // Llamar onChange con la ubicación obtenida
          if (onChange) {
            console.log('Ubicación obtenida automáticamente:', newCoords);
            onChange(newCoords);
          }
        },
        (error) => {
          console.warn('Error obteniendo ubicación:', error);
          // Si hay error, usar ubicación por defecto
          const defaultCoords = { lat: -33.45, lng: -70.6667 };
          const defaultLocation = [-33.45, -70.6667] as [number, number];
          
          setCurrentCoordinates(defaultCoords);
          setMapCenter(defaultLocation);
          setMarkerPosition(defaultLocation);
          setIsLoading(false);
          
          if (onChange) {
            console.log('Usando ubicación por defecto:', defaultCoords);
            onChange(defaultCoords);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    } else if (!currentCoordinates && !initialCoordinates) {
      // Sin geolocalización disponible, usar ubicación por defecto
      const defaultCoords = { lat: -33.45, lng: -70.6667 };
      const defaultLocation = [-33.45, -70.6667] as [number, number];
      
      setCurrentCoordinates(defaultCoords);
      setMapCenter(defaultLocation);
      setMarkerPosition(defaultLocation);
      setIsLoading(false);
      
      if (onChange) {
        console.log('Sin geolocalización, usando ubicación por defecto:', defaultCoords);
        onChange(defaultCoords);
      }
    }
  }, [currentCoordinates, initialCoordinates, onChange]);

  // Efecto separado para manejar cambios en initialCoordinates (para modo actualización)
  useEffect(() => {
    if (initialCoordinates) {
      const shouldUpdate = !currentCoordinates || 
        currentCoordinates.lat !== initialCoordinates.lat || 
        currentCoordinates.lng !== initialCoordinates.lng;
        
      if (shouldUpdate) {
        console.log('Actualizando coordenadas desde props:', initialCoordinates);
        setCurrentCoordinates(initialCoordinates);
        const newPosition: [number, number] = [initialCoordinates.lat, initialCoordinates.lng];
        setMarkerPosition(newPosition);
        setMapCenter(newPosition);
      }
    }
  }, [initialCoordinates]); // Solo depende de initialCoordinates

  const handleLocationSelect = (lat: number, lng: number) => {
    const newCoords = { lat, lng };
    setCurrentCoordinates(newCoords);
    setMarkerPosition([lat, lng]);
    // Llamar onChange si está definido
    if (onChange) {
      onChange(newCoords);
    }
  };

  return (
    <>
    {isLoading ? (
      <div style={{ height, width: '100%' }} className="flex items-center justify-center bg-gray-100">
        <p className="text-secondary">Obteniendo ubicación...</p>
      </div>
    ) : (
    <div style={{ height, width: '100%', borderRadius: '0.375rem', overflow: 'hidden' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />
        <ZoomControl position="topleft" />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        {markerPosition && (
          <Marker 
            position={markerPosition} 
            icon={createCustomIcon()}
          />
        )}
      </MapContainer>
    </div>
    )}
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Latitud"
          value={currentCoordinates ? currentCoordinates.lat.toFixed(6) : ''}
          onChange={() => {}}
          readOnly={true}
        />
        <TextField
          label="Longitud"
          value={currentCoordinates ? currentCoordinates.lng.toFixed(6) : ''}
          onChange={() => {}}
          readOnly={true}
        />
    </div>
    </>
  );
};

export default LocationPicker;
