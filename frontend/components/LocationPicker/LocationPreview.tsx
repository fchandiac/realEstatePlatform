'use client'
import React from 'react';

interface LocationPreviewProps {
  latitude: number;
  longitude: number;
  className?: string;
}

const LocationPreviewMap = dynamic(() => import('./LocationPreviewMap'), { ssr: false });

const LocationPreview: React.FC<LocationPreviewProps> = ({
  latitude,
  longitude,
  className = ''
}) => {
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
      >
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          Mapa: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </div>
      </div>
    </div>
  );
};

export default LocationPreview;