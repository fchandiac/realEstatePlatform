'use client';

import React, { useMemo } from 'react';
import { useCreatePropertyForm } from '../../hooks/useCreatePropertyForm';
import StepperBaseForm from '../../../../../components/BaseForm/StepperBaseForm';
import {
  getBasicInfoFields,
  getPropertyDetailsFields,
  getLocationFields,
  getMultimediaFields,
  getSeoFields,
  getInternalNotesFields,
  PropertyFormData
} from './propertyFormFields';
import Alert from '@/components/Alert/Alert';

interface CreatePropertyProps {
  open?: boolean;
  onClose?: () => void;
  size?: string;
}

export default function CreateProperty({
  open = true,
  onClose,
  size,
}: CreatePropertyProps) {
  const {
    formData,
    propertyTypes,
    loadingTypes,
    stateOptions,
    loadingStates,
    cityOptions,
    loadingCities,
    selectedPropertyType,
    isSubmitting,
    submitError,
    handleChange,
    handleSubmit: handleFormSubmit,
  } = useCreatePropertyForm(onClose);

  // Definir los pasos del stepper
  const steps = useMemo(() => [
    {
      title: 'Información Básica',
      description: 'Título, descripción, tipo y precio de la propiedad',
      columns: 2,
      fields: getBasicInfoFields(propertyTypes),
    },
    {
      title: 'Detalles de la Propiedad',
      description: 'Características específicas según el tipo de propiedad',
      fields: getPropertyDetailsFields(selectedPropertyType),
    },
    {
      title: 'Ubicación',
      description: 'Estado, ciudad, dirección y coordenadas',
      fields: getLocationFields(stateOptions, cityOptions, formData.state?.id),
    },
    {
      title: 'Multimedia',
      description: 'Imágenes y videos de la propiedad',
      fields: getMultimediaFields(),
    },
    {
      title: 'SEO y Marketing',
      description: 'Optimización para motores de búsqueda',
      fields: getSeoFields(),
    },
    {
      title: 'Notas Internas',
      description: 'Información adicional para el equipo interno',
      fields: getInternalNotesFields(),
    },
  ], [propertyTypes, selectedPropertyType, stateOptions, cityOptions, formData.state?.id]);

  const handleSubmit = async () => {
    await handleFormSubmit();
  };

  // Mostrar loading si están cargando los tipos de propiedad o estados
  if (loadingTypes || loadingStates) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {submitError && (
        <div className="mb-6">
          <Alert variant="error">
            {submitError}
          </Alert>
        </div>
      )}

      <StepperBaseForm
       title='Crear Propiedad'
        steps={steps}
        values={formData as unknown as Record<string, unknown>}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Crear Propiedad"
        showCloseButton={true}
        closeButtonText="Cancelar"
        onClose={onClose}
      />
    </div>
  );
}
