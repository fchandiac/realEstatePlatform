'use client';

import React from 'react';
import { useCreatePropertyForm } from '../../hooks/useCreatePropertyForm';
import BasicInfoSection from './components/BasicInfoSection';
import LocationSection from './components/LocationSection';
import MultimediaSection from './components/MultimediaSection';
import PropertyDetailsSection from './components/PropertyDetailsSection';
import SeoSection from './components/SeoSection';
import InternalNotesSection from './components/InternalNotesSection';
import SubmitSection from './components/SubmitSection';
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

  const handleSubmit = async () => {
    await handleFormSubmit();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Crear Propiedad</h1>

      {submitError && (
        <div className="mb-6">
          <Alert variant="error">
            {submitError}
          </Alert>
        </div>
      )}

      <form className="space-y-6">
        <BasicInfoSection
          formData={formData}
          handleChange={handleChange}
          propertyTypes={propertyTypes}
          loadingTypes={loadingTypes}
        />

        <PropertyDetailsSection
          formData={formData}
          handleChange={handleChange}
          propertyType={selectedPropertyType}
        />

        <LocationSection
          formData={formData}
          handleChange={handleChange}
          stateOptions={stateOptions}
          loadingStates={loadingStates}
          cityOptions={cityOptions}
          loadingCities={loadingCities}
        />

        <MultimediaSection
          formData={formData}
          handleChange={handleChange}
        />

        <SeoSection
          formData={formData}
          handleChange={handleChange}
        />

        <InternalNotesSection
          formData={formData}
          handleChange={handleChange}
        />

        <SubmitSection
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}
