// @ts-nocheck
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

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng || { lat: 0, lng: 0 };
      onLocationSelect(lat, lng);
    }
  });
  return null;
};

const MapViewSetter = ({ center, shouldSetView = true }) => {
  const map = useMap();
  React.useEffect(() => {
    // Solo actualizar vista si está habilitado (para ubicación inicial)
    if (shouldSetView) {
      try { map.setView(center, 15); } catch (e) {}
    }
  }, [center, map, shouldSetView]);
  return null;
};

export default function CreateLocationPickerMap({ center = [-33.45, -70.6667], markerPosition = null, onLocationSelect, shouldSetView = false }) {
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
      <MapClickHandler onLocationSelect={onLocationSelect} />
      {markerPosition ? (<Marker position={markerPosition} icon={createCustomIcon()} />) : null}
    </MapContainer>
  );
}
