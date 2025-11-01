'use client';

import { StepperBaseForm } from '@/components/BaseForm';
import React, { useState, useEffect } from 'react';
import { TextField } from '@/components/TextField/TextField';
import Select from '@/components/Select/Select';
import LocationPicker from '@/components/LocationPicker/LocationPicker';
import { Button } from '@/components/Button/Button';
import AutoComplete from '@/components/AutoComplete/AutoComplete';
import { FileImageUploader } from '@/components/FileUploader/FileImageUploader';
import { PropertyStatus, PropertyOperationType, CurrencyPriceEnum } from '../enums';
import { getPropertyTypesMinimal } from '@/app/actions/propertyTypesMinimal';
import { getRegiones, getComunasByRegion } from '@/app/actions/commons';

interface CreatePropertyProps {
  open: boolean;
  onClose: () => void;
  size: string;
}

export default function CreateProperty({
  open,
  onClose,
  size,
}: CreatePropertyProps) {
  const [propertyTypes, setPropertyTypes] = useState<{ id: string; label: string }[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [stateOptions, setStateOptions] = useState<{ id: string; label: string }[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [cityOptions, setCityOptions] = useState<{ id: string; label: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const loadPropertyTypes = async () => {
      try {
        const types = await getPropertyTypesMinimal();
        const formattedTypes = types.map(type => ({
          id: type.id,
          label: type.name,
        }));
        setPropertyTypes(formattedTypes);
      } catch (error) {
        console.error('Error loading property types:', error);
      } finally {
        setLoadingTypes(false);
      }
    };

    loadPropertyTypes();
  }, []);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const states = await getRegiones();
        setStateOptions(states);
      } catch (error) {
        console.error('Error loading states:', error);
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    operationType: '',
    location: null,
    state: { id: '', label: '' },
    city: { id: '', label: '' },
    currencyPrice: 'CLP',
    address: '',
    multimedia: [],
    bedrooms: '',
    bathrooms: '',
    parkingSpaces: '',
    floors: '',
    builtSquareMeters: '',
    landSquareMeters: '',
    constructionYear: '',
    seoTitle: '',
    seoDescription: '',
    status: '',
    propertyTypeId: '',
  });

  useEffect(() => {
    const loadCities = async () => {
      if (!formData.state || !formData.state.id) {
        setCityOptions([]);
        return;
      }

      setLoadingCities(true);
      try {
        const cities = await getComunasByRegion(formData.state.id);
        setCityOptions(cities);
      } catch (error) {
        console.error('Error loading cities:', error);
        setCityOptions([]);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [formData.state?.id]);

  const handleChange = (field: string, value: any) => {
    if (field === 'state') {
      // Cuando cambia la región, resetear la ciudad seleccionada
      setFormData({ ...formData, [field]: value || { id: '', label: '' }, city: { id: '', label: '' } });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Aquí puedes agregar la lógica para enviar los datos al backend
  };

  // Determinar el tipo del campo de precio basado en la moneda
  const getPriceFieldType = () => {
    return formData.currencyPrice === 'CLP' ? 'currency' : 'number';
  };

  const propertyTypeOptions = Object.values(PropertyOperationType).map((type) => ({
    id: type as string,
    label: type.replace(/_/g, ' ').toLowerCase(),
  }));

  const statusOptions = Object.values(PropertyStatus).map((status) => ({
    id: status as string,
    label: status.replace(/_/g, ' ').toLowerCase(),
  }));

  const currencyOptions = Object.values(CurrencyPriceEnum).map((currency) => ({
    id: currency as string,
    label: currency,
  }));

  return (
    <div className={`modal ${open ? 'open' : ''}`} style={{ width: size }}>
      <button onClick={onClose}>Close</button>
      <div className="p-2">
        <h1 className="text-2xl font-bold mb-4">Create Property</h1>
        <form className="space-y-4">
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
          />
          <Select
            placeholder="Operation Type"
            options={propertyTypeOptions}
            value={formData.operationType}
            onChange={(value) => handleChange('operationType', value)}
            required
          />
          <div className="flex space-x-4">
            <TextField
              label="Price"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              type={getPriceFieldType()}
              required
            />
            <Select
              placeholder="Currency"
              options={currencyOptions}
              value={formData.currencyPrice}
              onChange={(value) => handleChange('currencyPrice', value)}
              required
            />
          </div>
          <Select
            placeholder={loadingTypes ? "Cargando tipos..." : "Property Type"}
            options={propertyTypes}
            value={formData.propertyTypeId}
            onChange={(value) => handleChange('propertyTypeId', value)}
            required
          />
          <Select
            placeholder="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => handleChange('status', value)}
          />
          <TextField
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            required
          />
          <div className="flex space-x-4">
            <AutoComplete
              label="State"
              options={stateOptions}
              value={formData.state}
              onChange={(value) => handleChange('state', value)}
              required
              placeholder={loadingStates ? "Cargando regiones..." : "Selecciona una región"}
            />
            <AutoComplete
              label="City"
              options={cityOptions}
              value={formData.city}
              onChange={(value) => handleChange('city', value)}
              required
              placeholder={
                !formData.state || !formData.state.id
                  ? "Primero selecciona una región"
                  : loadingCities
                  ? "Cargando comunas..."
                  : "Selecciona una comuna"
              }
            />
          </div>
          <LocationPicker
            onChange={(coords) => handleChange('location', coords)}
          />
          <FileImageUploader
            uploadPath="/uploads/media"
            label="Upload Media"
            accept="image/*,video/*"
            onChange={(files: File[]) => handleChange('multimedia', files)}
          />
          <TextField
            label="Bedrooms"
            value={formData.bedrooms}
            onChange={(e) => handleChange('bedrooms', e.target.value)}
            type="number"
          />
          <TextField
            label="Bathrooms"
            value={formData.bathrooms}
            onChange={(e) => handleChange('bathrooms', e.target.value)}
            type="number"
          />
          <TextField
            label="Parking Spaces"
            value={formData.parkingSpaces}
            onChange={(e) => handleChange('parkingSpaces', e.target.value)}
            type="number"
          />
          <TextField
            label="Floors"
            value={formData.floors}
            onChange={(e) => handleChange('floors', e.target.value)}
            type="number"
          />
          <TextField
            label="Built Square Meters"
            value={formData.builtSquareMeters}
            onChange={(e) => handleChange('builtSquareMeters', e.target.value)}
            type="number"
          />
          <TextField
            label="Land Square Meters"
            value={formData.landSquareMeters}
            onChange={(e) => handleChange('landSquareMeters', e.target.value)}
            type="number"
          />
          <TextField
            label="Construction Year"
            value={formData.constructionYear}
            onChange={(e) => handleChange('constructionYear', e.target.value)}
            type="number"
          />
          <TextField
            label="SEO Title"
            value={formData.seoTitle}
            onChange={(e) => handleChange('seoTitle', e.target.value)}
          />
          <TextField
            label="SEO Description"
            value={formData.seoDescription}
            onChange={(e) => handleChange('seoDescription', e.target.value)}
          />
          <Button onClick={handleSubmit} variant="primary">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

