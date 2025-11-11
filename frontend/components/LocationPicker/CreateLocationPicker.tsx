'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';

interface CreateLocationPickerMapProps {
  center?: [number, number];
  markerPosition?: [number, number] | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  shouldSetView?: boolean;
  flyToTarget?: [number, number] | null;
  onFlyEnd?: () => void;
  flyToDuration?: number;
}

const CreateLocationPickerMap = dynamic(() => import('./CreateLocationPickerMap'), { ssr: false });
// Cast to a typed React component when rendering to avoid prop-type mismatches
const TypedCreateLocationPickerMap = CreateLocationPickerMap as unknown as React.ComponentType<CreateLocationPickerMapProps>;
import { TextField } from '../TextField/TextField';

// Map rendering is handled by a client-only dynamically imported wrapper

interface CreateLocationPickerProps {
  height?: string;
  onChange?: (coordinates: { lat: number; lng: number } | null) => void;
}

// (map click handler and view setter live in CreateLocationPickerMap)

const CreateLocationPicker: React.FC<CreateLocationPickerProps> = ({ 
  height = '400px', 
  onChange 
}) => {
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-33.45, -70.6667]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [shouldCenterMap, setShouldCenterMap] = useState(true); // Controlar centrado automático
  const [flyToTarget, setFlyToTarget] = useState<[number, number] | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleFlyEnd = useCallback(() => {
    setFlyToTarget(null);
  }, []);

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
            setShouldCenterMap(true); // Permitir centrado para ubicación inicial
            setFlyToTarget(null);

            console.log('CreateLocationPicker - ✅ Ubicación obtenida del navegador:', newCoords, `Precisión: ${accuracy}m`);
            onChangeRef.current?.(newCoords);
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
                setShouldCenterMap(true); // Permitir centrado para ubicación inicial
                setFlyToTarget(null);

                console.log('CreateLocationPicker - ✅ Ubicación obtenida del sistema:', systemCoords, `Fuente: ${systemLocation.source}`);
                onChangeRef.current?.(systemCoords);
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
            setShouldCenterMap(true); // Permitir centrado para ubicación inicial
            setFlyToTarget(null);

            console.log('CreateLocationPicker - ⚠️ Usando ubicación por defecto:', defaultCoords);
            onChangeRef.current?.(defaultCoords);
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
            setShouldCenterMap(true); // Permitir centrado para ubicación inicial

            console.log('CreateLocationPicker - ✅ Ubicación obtenida del sistema:', systemCoords);
            onChangeRef.current?.(systemCoords);
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
        setShouldCenterMap(true); // Permitir centrado para ubicación inicial
    setFlyToTarget(null);

        console.log('CreateLocationPicker - ⚠️ Usando ubicación por defecto:', defaultCoords);
        onChangeRef.current?.(defaultCoords);
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
    setMapCenter([lat, lng]);
    // NO centrar el mapa automáticamente al seleccionar nueva ubicación
    setShouldCenterMap(false); // Desactivar centrado automático tras click del usuario
    setIsUserSelected(true);
    setFlyToTarget([lat, lng]);

    const changeHandler = onChangeRef.current;
    if (changeHandler) {
      console.log('CreateLocationPicker - Notificando cambio a padre:', newCoords);
      changeHandler(newCoords);
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
      
          <div 
            style={{ 
              height, 
              width: '100%', 
              borderRadius: '0.375rem', 
              overflow: 'hidden'
            }}
            className="cursor-crosshair hover:cursor-pointer"
          >
            <TypedCreateLocationPickerMap
              center={mapCenter}
              markerPosition={markerPosition}
              onLocationSelect={handleLocationSelect}
              shouldSetView={shouldCenterMap}
              flyToTarget={flyToTarget}
              onFlyEnd={handleFlyEnd}
            />
          </div>
        </div>
      )}
      <div className="mt-4 space-y-4">
      
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </>
  );
};

export default CreateLocationPicker;
