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

interface CreateLocationPickerProps {
  height?: string;
  onChange?: (coordinates: { lat: number; lng: number } | null) => void;
}

// Componente para manejar los clicks en el mapa
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      console.log('MapClickHandler - Click detectado en:', e.latlng);
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

const CreateLocationPicker: React.FC<CreateLocationPickerProps> = ({ 
  height = '400px', 
  onChange 
}) => {
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-33.45, -70.6667]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [locationSource, setLocationSource] = useState<'auto' | 'user' | 'default'>('auto');
  const [updateKey, setUpdateKey] = useState(0); // Para forzar re-render

  // Obtener ubicación actual del usuario automáticamente al cargar
  useEffect(() => {
    // Si el usuario ya seleccionó una ubicación manualmente, no hacer geolocalización automática
    if (isUserSelected) {
      console.log('CreateLocationPicker - Usuario ya seleccionó ubicación manualmente, saltando geolocalización automática');
      return;
    }

    const getLocation = async () => {
      // PRIMERO: Intentar geolocalización del navegador
      if (navigator.geolocation) {
        console.log('CreateLocationPicker - Intentando geolocalización del navegador...');
        console.log('CreateLocationPicker - Navigator geolocation disponible:', !!navigator.geolocation);
        console.log('CreateLocationPicker - User agent:', navigator.userAgent);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const newCoords = { lat: latitude, lng: longitude };
            const userLocation: [number, number] = [latitude, longitude];

            setCurrentCoordinates(newCoords);
            setMapCenter(userLocation);
            setMarkerPosition(userLocation);
            setIsLoading(false);
            setLocationSource('auto');

            console.log('CreateLocationPicker - ✅ Ubicación obtenida del navegador:', newCoords, `Precisión: ${accuracy}m`);
            if (onChange) {
              onChange(newCoords);
            }
          },
          async (error) => {
            console.warn('CreateLocationPicker - ❌ Error en geolocalización del navegador:', error);
            console.warn('CreateLocationPicker - Código de error:', error.code);
            console.warn('CreateLocationPicker - Mensaje de error:', error.message);

            // SEGUNDO: Intentar geolocalización del sistema como fallback
            try {
              console.log('CreateLocationPicker - Intentando geolocalización del sistema...');
              if (typeof window !== 'undefined' && window.api && window.api.getSystemLocation) {
                const systemLocation = await window.api.getSystemLocation();
                const systemCoords = { lat: systemLocation.lat, lng: systemLocation.lng };
                const systemLocationArr: [number, number] = [systemLocation.lat, systemLocation.lng];

                setCurrentCoordinates(systemCoords);
                setMapCenter(systemLocationArr);
                setMarkerPosition(systemLocationArr);
                setIsLoading(false);
                setLocationSource('auto');

                console.log('CreateLocationPicker - ✅ Ubicación obtenida del sistema:', systemCoords, `Fuente: ${systemLocation.source}`);
                if (onChange) {
                  onChange(systemCoords);
                }
                return;
              }
            } catch (systemError) {
              console.warn('CreateLocationPicker - ❌ Error en geolocalización del sistema:', systemError);
            }

            // TERCERO: Usar ubicación por defecto como último recurso
            const defaultCoords = { lat: -33.45, lng: -70.6667 };
            const defaultLocation = [-33.45, -70.6667] as [number, number];

            setCurrentCoordinates(defaultCoords);
            setMapCenter(defaultLocation);
            setMarkerPosition(defaultLocation);
            setIsLoading(false);
            setLocationSource('default');

            console.log('CreateLocationPicker - ⚠️ Usando ubicación por defecto:', defaultCoords);
            if (onChange) {
              onChange(defaultCoords);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 15000, // Aumentado a 15 segundos
            maximumAge: 300000 // 5 minutos
          }
        );
      } else {
        // Sin geolocalización del navegador, intentar sistema directamente
        console.log('CreateLocationPicker - Navegador sin geolocalización, intentando sistema...');
        try {
          if (typeof window !== 'undefined' && window.api && window.api.getSystemLocation) {
            const systemLocation = await window.api.getSystemLocation();
            const systemCoords = { lat: systemLocation.lat, lng: systemLocation.lng };
            const systemLocationArr: [number, number] = [systemLocation.lat, systemLocation.lng];

            setCurrentCoordinates(systemCoords);
            setMapCenter(systemLocationArr);
            setMarkerPosition(systemLocationArr);
            setIsLoading(false);
            setLocationSource('auto');

            console.log('CreateLocationPicker - ✅ Ubicación obtenida del sistema:', systemCoords);
            if (onChange) {
              onChange(systemCoords);
            }
            return;
          }
        } catch (systemError) {
          console.warn('CreateLocationPicker - ❌ Error en geolocalización del sistema:', systemError);
        }

        // Usar ubicación por defecto
        const defaultCoords = { lat: -33.45, lng: -70.6667 };
        const defaultLocation = [-33.45, -70.6667] as [number, number];

        setCurrentCoordinates(defaultCoords);
        setMapCenter(defaultLocation);
        setMarkerPosition(defaultLocation);
        setIsLoading(false);
        setLocationSource('default');

        console.log('CreateLocationPicker - ⚠️ Usando ubicación por defecto:', defaultCoords);
        if (onChange) {
          onChange(defaultCoords);
        }
      }
    };

    getLocation();
  }, [isUserSelected]); // Solo depende de isUserSelected, no de onChange

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log('CreateLocationPicker - Click en mapa detectado:', { lat, lng });
    const newCoords = { lat, lng };

    console.log('CreateLocationPicker - Actualizando estado con:', newCoords);
    setCurrentCoordinates(newCoords);
    setMarkerPosition([lat, lng]);
    setMapCenter([lat, lng]); // Centrar el mapa en la nueva ubicación
    setIsUserSelected(true);
    setLocationSource('user');
    setUpdateKey(prev => prev + 1); // Forzar re-render

    if (onChange) {
      console.log('CreateLocationPicker - Notificando cambio a padre:', newCoords);
      onChange(newCoords);
    } else {
      console.log('CreateLocationPicker - No hay función onChange definida');
    }
  };

  return (
    <>
      {isLoading ? (
        <div style={{ height, width: '100%' }} className="flex items-center justify-center bg-gray-100">
          <p className="text-secondary">Obteniendo ubicación...</p>
        </div>
      ) : (
        <div>
          {/* <div className="mb-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              📍 <strong>Instrucciones:</strong> Haz click en el mapa para seleccionar una nueva ubicación. 
              {locationSource === 'auto' && ' La ubicación inicial se obtuvo automáticamente de tu dispositivo.'}
              {locationSource === 'default' && ' Se está usando una ubicación por defecto (Santiago, Chile).'}
              {locationSource === 'user' && ' Has seleccionado una nueva ubicación.'}
            </p>
          </div> */}
          <div style={{ height, width: '100%', borderRadius: '0.375rem', overflow: 'hidden', cursor: 'crosshair' }}>
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
        </div>
      )}
      <div className="mt-4 space-y-4">
      
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            key={`lat-${updateKey}`}
            label="Latitud"
            value={currentCoordinates ? currentCoordinates.lat.toFixed(6) : ''}
            onChange={() => {}}
            readOnly={true}
          />
          <TextField
            key={`lng-${updateKey}`}
            label="Longitud"
            value={currentCoordinates ? currentCoordinates.lng.toFixed(6) : ''}
            onChange={() => {}}
            readOnly={true}
          />
        </div>
      </div>
    </>
  );
};

export default CreateLocationPicker;
