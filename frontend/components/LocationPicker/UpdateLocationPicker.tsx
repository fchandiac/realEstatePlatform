'use client'
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, Marker, useMapEvents } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';
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

interface UpdateLocationPickerProps {
  height?: string;
  initialCoordinates: { lat: number; lng: number }; // Requerido para UpdateLocationPicker
  onChange?: (coordinates: { lat: number; lng: number } | null) => void;
}

// Componente para manejar los clicks en el mapa
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

const UpdateLocationPicker: React.FC<UpdateLocationPickerProps> = ({ 
  height = '400px', 
  initialCoordinates,
  onChange 
}) => {
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number }>(initialCoordinates);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([initialCoordinates.lat, initialCoordinates.lng]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([initialCoordinates.lat, initialCoordinates.lng]);

  // Actualizar TODOS los estados cuando cambien las coordenadas iniciales
  useEffect(() => {
    console.log('🗺️ UpdateLocationPicker - Actualizando desde props:', initialCoordinates);
    setCurrentCoordinates(initialCoordinates);
    const newPosition: [number, number] = [initialCoordinates.lat, initialCoordinates.lng];
    setMarkerPosition(newPosition);
    setMapCenter(newPosition);
  }, [initialCoordinates.lat, initialCoordinates.lng]);

  const handleLocationSelect = (lat: number, lng: number) => {
    const newCoords = { lat, lng };
    console.log('📍 UpdateLocationPicker - Usuario seleccionó:', newCoords);
    setCurrentCoordinates(newCoords);
    setMarkerPosition([lat, lng]);
    setMapCenter([lat, lng]);
    
    if (onChange) {
      onChange(newCoords);
    }
  };

  return (
    <>
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
          <Marker 
            position={markerPosition} 
            icon={createCustomIcon()}
          />
        </MapContainer>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Latitud"
          value={currentCoordinates.lat.toFixed(6)}
          onChange={() => {}}
          readOnly={true}
        />
        <TextField
          label="Longitud"
          value={currentCoordinates.lng.toFixed(6)}
          onChange={() => {}}
          readOnly={true}
        />
      </div>
    </>
  );
};

export default UpdateLocationPicker;
