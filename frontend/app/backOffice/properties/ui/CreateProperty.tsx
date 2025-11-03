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
import { PROPERTY_STATUS_MAPPING, PROPERTY_OPERATION_TYPE_MAPPING, CURRENCY_PRICE_MAPPING } from '@/lib/enums';
import { getPropertyTypesMinimal } from '@/app/actions/propertyTypesMinimal';
import { getPropertyType, PropertyType } from '@/app/actions/propertyTypes';
import { getRegiones, getComunasByRegion } from '@/app/actions/commons';
import { createProperty } from '@/app/actions/properties';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | null>(null);

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
    operationType: 'SALE', // ✅ Valor por defecto como string
    location: undefined, // Cambiar de null a undefined para compatibilidad con backend
    state: { id: '', label: '' },
    city: { id: '', label: '' },
    currencyPrice: 'CLP',
    address: '',
    multimedia: [],
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    floors: 0,
    builtSquareMeters: 0,
    landSquareMeters: 0,
    constructionYear: 0,
    seoTitle: '',
    seoDescription: '',
    status: 'REQUEST', // ✅ Valor por defecto como string
    propertyTypeId: '',
    internalNotes: '', // Campo opcional para notas internas
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

  useEffect(() => {
    const loadPropertyTypeDetails = async () => {
      if (!formData.propertyTypeId) {
        setSelectedPropertyType(null);
        return;
      }

      try {
        const propertyTypeDetails = await getPropertyType(formData.propertyTypeId);
        setSelectedPropertyType(propertyTypeDetails);
      } catch (error) {
        console.error('Error loading property type details:', error);
        setSelectedPropertyType(null);
      }
    };

    loadPropertyTypeDetails();
  }, [formData.propertyTypeId]);

  const handleChange = (field: string, value: any) => {
    // Campos numéricos que deben convertirse a number
    const numericFields = ['bedrooms', 'bathrooms', 'parkingSpaces', 'floors', 'builtSquareMeters', 'landSquareMeters', 'constructionYear'];

    let processedValue = value;
    if (numericFields.includes(field)) {
      // Convertir a número, usar 0 si está vacío o no es válido
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : (typeof value === 'number' ? value : 0);
      processedValue = numValue;
    }
    
    // Manejo especial para el precio
    if (field === 'price') {
      // Si el valor es undefined o null, mantenlo así
      processedValue = value === undefined || value === null ? value : Number(value);
    }

    if (field === 'state') {
      // Cuando cambia la región, resetear la ciudad seleccionada
      setFormData({ ...formData, [field]: value || { id: '', label: '' }, city: { id: '', label: '' } });
    } else {
      setFormData({ ...formData, [field]: processedValue });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Transformar los valores del frontend a los que espera el backend
      const transformedData = {
        ...formData,
        // Enviar strings directamente para enums (backend maneja transformación)
        status: formData.status, // ✅ Envía string (ej. 'REQUEST')
        operationType: formData.operationType, // ✅ Envía string (ej. 'SALE')
        currencyPrice: formData.currencyPrice, // ✅ Envía string (ej. 'CLP')
        
        // Convertir campos numéricos de strings a numbers
        bedrooms: formData.bedrooms || undefined,
        bathrooms: formData.bathrooms || undefined,
        parkingSpaces: formData.parkingSpaces || undefined,
        floors: formData.floors || undefined,
        builtSquareMeters: formData.builtSquareMeters || undefined,
        landSquareMeters: formData.landSquareMeters || undefined,
        constructionYear: formData.constructionYear || undefined,
        
        // Extraer IDs de objetos de ubicación
        state: formData.state?.id || '',
        city: formData.city?.id || '',
      };

      // Transformar price a número antes de filtrar
      const transformedDataFixed = {
        ...formData,
        price:
          typeof formData.price === 'string'
            ? formData.price.trim() === ''
              ? undefined
              : Number(formData.price)
            : formData.price,
        status: formData.status,
        operationType: formData.operationType,
        currencyPrice: formData.currencyPrice,
        bedrooms: formData.bedrooms || undefined,
        bathrooms: formData.bathrooms || undefined,
        parkingSpaces: formData.parkingSpaces || undefined,
        floors: formData.floors || undefined,
        builtSquareMeters: formData.builtSquareMeters || undefined,
        landSquareMeters: formData.landSquareMeters || undefined,
        constructionYear: formData.constructionYear || undefined,
        state: formData.state?.id || '',
        city: formData.city?.id || '',
      };

      const dataToSend = Object.fromEntries(
        Object.entries(transformedDataFixed).filter(([key, value]) => {
          // Excluir price solo si está undefined o null (NO si es 0)
          if (key === 'price' && (value === undefined || value === null)) return false;
          // Excluir multimedia ya que se envía como archivos separados
          if (key === 'multimedia') return false;
          return true;
        })
      );

      console.log('Filtered data to send:', dataToSend);

      // Crear FormData para enviar archivos junto con datos JSON
      const formDataToSend = new FormData();

      // Transformar price a número si existe
      if (typeof dataToSend.price === 'string') {
        dataToSend.price = dataToSend.price !== '' ? Number(dataToSend.price) : undefined;
      }

      // Agregar datos JSON como string
      formDataToSend.append('data', JSON.stringify(dataToSend));

      // Agregar archivos multimedia si existen
      if (formData.multimedia && formData.multimedia.length > 0) {
        formData.multimedia.forEach((file: File, index: number) => {
          formDataToSend.append(`multimediaFiles`, file);
        });
      }

      // Enviar FormData al backend
      const result = await createProperty(formDataToSend);

      if (result.success) {
        console.log('Property created successfully:', result.data);
        // Aquí podrías mostrar un mensaje de éxito y cerrar el modal
        onClose();
      } else {
        setSubmitError(result.error || 'Error desconocido al crear la propiedad');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      setSubmitError('Error inesperado al crear la propiedad');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determinar el tipo del campo de precio basado en la moneda
  const getPriceFieldType = () => {
    // Siempre usar type="text" para evitar problemas con el formato de moneda
    return "text";
  };

  // Formatear el precio para mostrar en el input
  const formatPriceForDisplay = (price: string | number) => {
    if (!price && price !== 0) return '';
    const numericValue = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
    if (isNaN(numericValue)) return '';
    
    if (formData.currencyPrice === 'CLP') {
      return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(numericValue);
    } else {
      return new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numericValue);
    }
  };

  // Limpiar el formato de moneda y convertir a número
  const cleanPriceValue = (price: string): number | undefined => {
    if (!price) return undefined;
    const cleanValue = price.replace(/[^\d.-]/g, '');
    const numericValue = parseFloat(cleanValue);
    return isNaN(numericValue) ? undefined : numericValue;
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
              value={formatPriceForDisplay(formData.price)}
              onChange={(e) => handleChange('price', cleanPriceValue(e.target.value))}
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
            onChange={(location) => handleChange('location', location)}
          />
          <FileImageUploader
            uploadPath="/uploads/media"
            label="Upload Media"
            accept="image/*,video/*"
            onChange={(files: File[]) => handleChange('multimedia', files)}
          />
          <Select
            placeholder={loadingTypes ? "Cargando tipos..." : "Property Type"}
            options={propertyTypes}
            value={formData.propertyTypeId}
            onChange={(value) => handleChange('propertyTypeId', value)}
            required
          />
          {selectedPropertyType?.hasBedrooms && (
            <TextField
              label="Bedrooms"
              value={formData.bedrooms.toString()}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              type="number"
            />
          )}
          {selectedPropertyType?.hasBathrooms && (
            <TextField
              label="Bathrooms"
              value={formData.bathrooms.toString()}
              onChange={(e) => handleChange('bathrooms', e.target.value)}
              type="number"
            />
          )}
          {selectedPropertyType?.hasParkingSpaces && (
            <TextField
              label="Parking Spaces"
              value={formData.parkingSpaces.toString()}
              onChange={(e) => handleChange('parkingSpaces', e.target.value)}
              type="number"
            />
          )}
          {selectedPropertyType?.hasFloors && (
            <TextField
              label="Floors"
              value={formData.floors.toString()}
              onChange={(e) => handleChange('floors', e.target.value)}
              type="number"
            />
          )}
          {selectedPropertyType?.hasBuiltSquareMeters && (
            <TextField
              label="Built Square Meters"
              value={formData.builtSquareMeters.toString()}
              onChange={(e) => handleChange('builtSquareMeters', e.target.value)}
              type="number"
            />
          )}
          {selectedPropertyType?.hasLandSquareMeters && (
            <TextField
              label="Land Square Meters"
              value={formData.landSquareMeters.toString()}
              onChange={(e) => handleChange('landSquareMeters', e.target.value)}
              type="number"
            />
          )}
          {selectedPropertyType?.hasConstructionYear && (
            <TextField
              label="Construction Year"
              value={formData.constructionYear.toString()}
              onChange={(e) => handleChange('constructionYear', e.target.value)}
              type="number"
            />
          )}
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
          <TextField
            label="Internal Notes"
            value={formData.internalNotes}
            onChange={(e) => handleChange('internalNotes', e.target.value)}
            rows={3}
          />
          {submitError && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {submitError}
            </div>
          )}
          <Button 
            onClick={handleSubmit} 
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  );
}

