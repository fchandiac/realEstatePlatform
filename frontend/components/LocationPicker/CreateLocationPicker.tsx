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
  onChange?: (coordinates: { lat: number; lng: number } | null) => void;
}

// (map click handler and view setter live in CreateLocationPickerMap)

const CreateLocationPicker: React.FC<CreateLocationPickerProps> = ({ 
  onChange 
}) => {
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-33.45, -70.6667]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [shouldCenterMap, setShouldCenterMap] = useState(true); // Controlar centrado automático
  const [flyToTarget, setFlyToTarget] = useState<[number, number] | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleFlyEnd = useCallback(() => {
    setFlyToTarget(null);
  }, []);

  // Verificar estado de permiso de geolocalización
  useEffect(() => {
    const checkPermission = async () => {
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionStatus(permission.state as 'prompt' | 'granted' | 'denied');
          console.log('CreateLocationPicker - Estado de permiso:', permission.state);

          // Escuchar cambios en el permiso
          permission.addEventListener('change', () => {
            setPermissionStatus(permission.state as 'prompt' | 'granted' | 'denied');
            console.log('CreateLocationPicker - Estado de permiso actualizado:', permission.state);
          });
        } catch (error) {
          console.warn('CreateLocationPicker - No se puede verificar permiso de geolocalización:', error);
        }
      }
    };

    checkPermission();
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
        console.log('CreateLocationPicker - Solicitando geolocalización del navegador...');

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const newCoords = { lat: latitude, lng: longitude };
            const userLocation: [number, number] = [latitude, longitude];

            setCurrentCoordinates(newCoords);
            setMapCenter(userLocation);
            setMarkerPosition(userLocation);
            setIsLoading(false);
            setShouldCenterMap(true);
            setFlyToTarget(null);
            setPermissionStatus('granted');
            setPermissionError(null);

            console.log('CreateLocationPicker - ✅ Ubicación obtenida del navegador:', newCoords, `Precisión: ${accuracy}m`);
            onChangeRef.current?.(newCoords);
          },
          async (error) => {
            console.warn('CreateLocationPicker - ❌ Error en geolocalización del navegador:', error);
            console.warn('CreateLocationPicker - Código de error:', error.code);

            // Manejar diferentes códigos de error
            let errorMessage = 'No se pudo obtener la ubicación';
            if (error.code === 1) {
              errorMessage = 'Permiso de geolocalización denegado. Por favor, habilita la geolocalización en la configuración del navegador.';
              setPermissionStatus('denied');
            } else if (error.code === 2) {
              errorMessage = 'No se pudo obtener la posición. Intenta de nuevo en unos momentos.';
              setPermissionStatus('prompt');
            } else if (error.code === 3) {
              errorMessage = 'La solicitud de geolocalización tardó demasiado.';
            }

            setPermissionError(errorMessage);
            console.warn('CreateLocationPicker - Mensaje de error:', errorMessage);

            // Usar ubicación por defecto como fallback
            const defaultCoords = { lat: -33.45, lng: -70.6667 };
            const defaultLocation = [-33.45, -70.6667] as [number, number];

            setCurrentCoordinates(defaultCoords);
            setMapCenter(defaultLocation);
            setMarkerPosition(defaultLocation);
            setIsLoading(false);
            setShouldCenterMap(true);
            setFlyToTarget(null);

            console.log('CreateLocationPicker - ⚠️ Usando ubicación por defecto:', defaultCoords);
            onChangeRef.current?.(defaultCoords);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
          }
        );
      } else {
        console.warn('CreateLocationPicker - El navegador no soporta geolocalización');
        setPermissionError('Tu navegador no soporta geolocalización.');

        // Usar ubicación por defecto
        const defaultCoords = { lat: -33.45, lng: -70.6667 };
        const defaultLocation = [-33.45, -70.6667] as [number, number];

        setCurrentCoordinates(defaultCoords);
        setMapCenter(defaultLocation);
        setMarkerPosition(defaultLocation);
        setIsLoading(false);
        setShouldCenterMap(true);
        setFlyToTarget(null);

        onChangeRef.current?.(defaultCoords);
      }
    };

    getLocation();
  }, [isUserSelected]);

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
        <div className="w-full bg-gray-100 flex items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
          <p className="text-secondary">Obteniendo ubicación...</p>
        </div>
      ) : (
        <div>
      
          <div 
            style={{ 
              width: '100%', 
              aspectRatio: '16 / 9',
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
