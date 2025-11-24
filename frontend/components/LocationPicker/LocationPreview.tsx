'use client'
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPreviewProps {
  latitude: number;
  longitude: number;
  className?: string;
}

const LocationPreview: React.FC<LocationPreviewProps> = ({
  latitude,
  longitude,
  className = ''
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Ensure Leaflet CSS is loaded
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!isClient) {
    return (
      <div className={`w-full ${className}`}>
        <h5 className="text-base font-semibold mb-2">Ubicación en mapa</h5>
        <div
          style={{
            width: '100%',
            height: '200px',
            borderRadius: '0.375rem',
            overflow: 'hidden',
            backgroundColor: '#f3f4f6'
          }}
          className="flex items-center justify-center"
        >
          <div className="text-center text-gray-500 text-sm">
            <div className="mb-2">📍</div>
            <div>Cargando mapa...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <h5 className="text-base font-semibold mb-2">Ubicación en mapa</h5>
      <div
        style={{
          width: '100%',
          height: '200px',
          borderRadius: '0.375rem',
          overflow: 'hidden'
        }}
      >
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          boxZoom={false}
          keyboard={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[latitude, longitude]} />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPreview;