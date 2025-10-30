'use client';

import React from 'react';
import Switch from '@/components/Switch/Switch';

export interface PropertyType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  hasBedrooms?: boolean;
  hasBathrooms?: boolean;
  hasBuiltSquareMeters?: boolean;
  hasLandSquareMeters?: boolean;
  hasParkingSpaces?: boolean;
  hasFloors?: boolean;
  hasConstructionYear?: boolean;
}

const defaultPropertyType: PropertyType = {
  id: '',
  name: 'Unknown Type',
  description: 'No description available',
  icon: 'home',
  color: '#007bff',
  isActive: true,
};

interface PropertyTypeCardProps {
  propertyType: PropertyType;
  onClick?: () => void;
  onToggleFeature?: (feature: keyof PropertyType, value: boolean) => void;
}

export default function PropertyTypeCard({
  propertyType = defaultPropertyType,
  onClick,
  onToggleFeature,
}: PropertyTypeCardProps) {
  const {
    name,
    description,
    icon,
    color,
    isActive,
    hasBedrooms,
    hasBathrooms,
    hasBuiltSquareMeters,
    hasLandSquareMeters,
    hasParkingSpaces,
    hasFloors,
    hasConstructionYear,
  } = { ...defaultPropertyType, ...propertyType };

  const features = [
    { label: 'Dormitorios', key: 'hasBedrooms' as keyof PropertyType, value: hasBedrooms },
    { label: 'Baños', key: 'hasBathrooms' as keyof PropertyType, value: hasBathrooms },
    { label: 'M² Construidos', key: 'hasBuiltSquareMeters' as keyof PropertyType, value: hasBuiltSquareMeters },
    { label: 'M² Terreno', key: 'hasLandSquareMeters' as keyof PropertyType, value: hasLandSquareMeters },
    { label: 'Estacionamientos', key: 'hasParkingSpaces' as keyof PropertyType, value: hasParkingSpaces },
    { label: 'Pisos', key: 'hasFloors' as keyof PropertyType, value: hasFloors },
    { label: 'Año Construcción', key: 'hasConstructionYear' as keyof PropertyType, value: hasConstructionYear },
  ];

  const handleFeatureToggle = (featureKey: keyof PropertyType, value: boolean) => {
    onToggleFeature?.(featureKey, value);
  };

  return (
    <div
      className="w-full mb-3 cursor-pointer transition-all duration-200 hover:shadow-lg"
      onClick={onClick}
    >
      <div
        className="rounded-lg p-4 border-l-4 border-secondary border-t border-b border-r border-border shadow-lg"
      >
        <div className="flex items-start space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            <i className={`fas fa-${icon}`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground truncate">{name}</h3>
              {!isActive && (
                <span className="text-xs text-red-500 font-medium ml-2">Inactivo</span>
              )}
            </div>
            {description && (
              <p className="text-sm text-secondary mb-3">{description}</p>
            )}
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-secondary flex-1">{feature.label}</span>
                  <Switch
                    checked={feature.value || false}
                    onChange={(checked) => handleFeatureToggle(feature.key, checked)}
                    data-test-id={`switch-${feature.key}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
