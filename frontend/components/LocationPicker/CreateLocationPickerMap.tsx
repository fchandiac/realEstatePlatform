import React from 'react';
import { MapContainer, TileLayer, ZoomControl, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createCustomIcon = () => {
  return L.divIcon({
    html: `<span class="material-symbols-outlined text-primary" style="font-size:24px;">location_on</span>`,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

const MapDragHandler = () => {
  const map = useMap();

  React.useEffect(() => {
    const handleDragStart = () => {
      map.getContainer().style.cursor = 'grabbing';
    };

    const handleDragEnd = () => {
      map.getContainer().style.cursor = 'crosshair';
    };

    map.on('dragstart', handleDragStart);
    map.on('dragend', handleDragEnd);

    // Cleanup
    return () => {
      map.off('dragstart', handleDragStart);
      map.off('dragend', handleDragEnd);
    };
  }, [map]);

  return null;
};

interface MapClickHandlerProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      onLocationSelect?.(lat, lng);
    }
  });
  return null;
};

interface MapViewSetterProps {
  center: [number, number];
  shouldSetView?: boolean;
}

const MapViewSetter: React.FC<MapViewSetterProps> = ({ center, shouldSetView = true }) => {
  const map = useMap();
  React.useEffect(() => {
    // Solo actualizar vista si está habilitado (para ubicación inicial)
    if (shouldSetView) {
      try { map.setView(center, 15); } catch {}
    }
  }, [center, map, shouldSetView]);
  return null;
};

interface MapFlyToHandlerProps {
  target: [number, number] | null;
  duration?: number;
  onFlyEnd?: () => void;
}

const MapFlyToHandler: React.FC<MapFlyToHandlerProps> = ({ target, duration = 1.2, onFlyEnd }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!target) {
      return;
    }

    const handleMoveEnd = () => {
      onFlyEnd?.();
    };

    try {
      map.flyTo(target, map.getZoom(), { duration });
      map.once('moveend', handleMoveEnd);
    } catch {
      onFlyEnd?.();
    }

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, target, duration, onFlyEnd]);

  return null;
};

interface CreateLocationPickerMapProps {
  center?: [number, number];
  markerPosition?: [number, number] | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  shouldSetView?: boolean;
  flyToTarget?: [number, number] | null;
  onFlyEnd?: () => void;
  flyToDuration?: number;
}

export default function CreateLocationPickerMap({
  center = [-33.45, -70.6667],
  markerPosition = null,
  onLocationSelect,
  shouldSetView = false,
  flyToTarget = null,
  onFlyEnd,
  flyToDuration
}: CreateLocationPickerMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: '100%', width: '100%', cursor: 'crosshair' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ZoomControl position="topleft" />
      <MapViewSetter center={center} shouldSetView={shouldSetView} />
      <MapFlyToHandler target={flyToTarget} duration={flyToDuration} onFlyEnd={onFlyEnd} />
      <MapDragHandler />
      <MapClickHandler onLocationSelect={onLocationSelect} />
      {markerPosition ? (<Marker position={markerPosition} icon={createCustomIcon()} />) : null}
    </MapContainer>
  );
}
