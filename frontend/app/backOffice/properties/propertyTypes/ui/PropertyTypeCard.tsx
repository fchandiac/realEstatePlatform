'use client';

import React, { useState } from 'react';
import Switch from '@/components/Switch/Switch';
import IconButton from '@/components/IconButton/IconButton';
import Dialog from '@/components/Dialog/Dialog';
import UpdatePropertyTypeForm from './updatePropertyTypeForm';
import DeletePropertyTypeForm from './DeletePropertyTypeForm';
import { useRouter } from 'next/navigation';

export interface PropertyType {
  id: string;
  name: string;
  description?: string;
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
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const {
    name,
    description,
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShowUpdateDialog(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateDialog(false);
    // Refresh the page to get updated data
    router.refresh();
  };

  const handleUpdateCancel = () => {
    setShowUpdateDialog(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShowDeleteDialog(true);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false);
    // Refresh the page to get updated data
    router.refresh();
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <div
      className="w-full h-full cursor-pointer transition-all duration-200 hover:shadow-lg"
      onClick={onClick}
    >
      <div
        className="rounded-lg p-4 border-l-4 border-secondary border-t border-b border-r border-border shadow-lg h-full flex flex-col"
      >
        <div className="flex items-start flex-1">
          <div className="flex-1 min-w-0 flex flex-col">
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
                <div key={index} className="flex items-center justify-start">
                  <Switch
                    label={feature.label}
                    labelPosition="right"
                    checked={feature.value || false}
                    onChange={(checked) => handleFeatureToggle(feature.key, checked)}
                    data-test-id={`switch-${feature.key}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de editar y eliminar en la parte inferior */}
        <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-border">
          <IconButton
            aria-label="Editar tipo de propiedad"
            variant="text"
            onClick={handleEditClick}
            icon="edit"
            size="sm"
          />
          <IconButton
            aria-label="Eliminar tipo de propiedad"
            variant="text"
            onClick={handleDeleteClick}
            icon="delete"
            size="sm"
          />
        </div>
      </div>

      {/* Dialog para actualizar */}
      <Dialog
        open={showUpdateDialog}
        onClose={handleUpdateCancel}
        title="Editar Tipo de Propiedad"
        size="lg"
      >
        <UpdatePropertyTypeForm
          propertyType={propertyType}
          onSuccess={handleUpdateSuccess}
          onCancel={handleUpdateCancel}
        />
      </Dialog>

      {/* Dialog para eliminar */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleDeleteCancel}
        title="Eliminar Tipo de Propiedad"
        size="md"
      >
        <DeletePropertyTypeForm
          propertyType={propertyType}
          onSuccess={handleDeleteSuccess}
          onCancel={handleDeleteCancel}
        />
      </Dialog>
    </div>
  );
}
