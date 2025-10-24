'use client'
import React from 'react';
import CreateLocationPicker from './CreateLocationPickerWrapper';

interface LocationPickerProps {
  height?: string;
  onChange?: (coordinates: { lat: number; lng: number } | null) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = (props) => {
  return <CreateLocationPicker {...props} />;
};

export default LocationPicker;