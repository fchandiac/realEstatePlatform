'use client';

import { useState, useEffect } from 'react';
import { getPropertyTypesMinimal } from '@/app/actions/propertyTypesMinimal';
import { getPropertyType, PropertyType } from '@/app/actions/propertyTypes';
import { getRegiones, getComunasByRegion } from '@/app/actions/commons';
import { createProperty } from '@/app/actions/properties';
import { CreatePropertyFormData, PropertyTypeOption, LocationOption } from '../ui/createProperty/types';

interface UseCreatePropertyFormProps {
  onClose?: () => void;
}

export const useCreatePropertyForm = (onCloseCallback?: () => void) => {
  const onClose = onCloseCallback || (() => {});
  // Estado de datos del formulario
  const [formData, setFormData] = useState<CreatePropertyFormData>({
    title: '',
    description: '',
    price: '',
    operationType: 'SALE',
    location: undefined,
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
    status: 'REQUEST',
    propertyTypeId: '',
    internalNotes: '',
  });

  // Estados de carga y opciones
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeOption[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [stateOptions, setStateOptions] = useState<LocationOption[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [cityOptions, setCityOptions] = useState<LocationOption[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cargar tipos de propiedades
  useEffect(() => {
    const loadPropertyTypes = async () => {
      try {
        const types = await getPropertyTypesMinimal();
        // PropertyTypeMinimal solo tiene id y name, crearemos propiedades básicas
        const formattedTypes: PropertyTypeOption[] = types.map(type => ({
          id: type.id,
          name: type.name,
          label: type.name,
          hasBedrooms: false,
          hasBathrooms: false,
          hasBuiltSquareMeters: false,
          hasLandSquareMeters: false,
          hasParkingSpaces: false,
          hasFloors: false,
          hasConstructionYear: false,
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

  // Cargar regiones
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

  // Cargar comunas cuando cambia la región
  useEffect(() => {
    const loadCities = async () => {
      console.log('🔍 [useCreatePropertyForm] loadCities triggered, formData.state:', formData.state);
      if (!formData.state || !formData.state.id) {
        console.log('❌ [useCreatePropertyForm] No state selected, clearing cities');
        setCityOptions([]);
        return;
      }

      console.log('📡 [useCreatePropertyForm] Loading cities for region:', formData.state.id);
      setLoadingCities(true);
      try {
        const cities = await getComunasByRegion(formData.state.id);
        console.log('✅ [useCreatePropertyForm] Cities loaded:', cities.length, 'cities');
        setCityOptions(cities);
      } catch (error) {
        console.error('❌ [useCreatePropertyForm] Error loading cities:', error);
        setCityOptions([]);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [formData.state?.id]);

  // Cargar detalles del tipo de propiedad cuando cambia
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
    console.log('🔄 [useCreatePropertyForm] handleChange called:', { field, value, type: typeof value });

    const numericFields = [
      'bedrooms',
      'bathrooms',
      'parkingSpaces',
      'floors',
      'builtSquareMeters',
      'landSquareMeters',
      'constructionYear',
    ];

    let processedValue = value;
    if (numericFields.includes(field)) {
      const numValue =
        typeof value === 'string' ? parseFloat(value) || 0 : typeof value === 'number' ? value : 0;
      processedValue = numValue;
    }

    if (field === 'price') {
      processedValue = value === undefined || value === null ? value : Number(value);
    }

    if (field === 'state') {
      // El Select devuelve el id de la opción seleccionada
      console.log('🏛️ [useCreatePropertyForm] Processing state change, value:', value);
      const selectedState = stateOptions.find(state => state.id === value);
      console.log('🏛️ [useCreatePropertyForm] Found state:', selectedState);
      setFormData({
        ...formData,
        [field]: selectedState || { id: '', label: '' },
        city: { id: '', label: '' },
      });
    } else if (field === 'city') {
      // El Select devuelve el id de la opción seleccionada
      console.log('🏙️ [useCreatePropertyForm] Processing city change, value:', value);
      const selectedCity = cityOptions.find(city => city.id === value);
      console.log('🏙️ [useCreatePropertyForm] Found city:', selectedCity);
      setFormData({
        ...formData,
        [field]: selectedCity || { id: '', label: '' },
      });
    } else {
      setFormData({ ...formData, [field]: processedValue });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
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
          if (key === 'price' && (value === undefined || value === null)) return false;
          if (key === 'multimedia') return false;
          return true;
        })
      );

      console.log('Filtered data to send:', dataToSend);

      const formDataToSend = new FormData();

      if (typeof dataToSend.price === 'string') {
        dataToSend.price = dataToSend.price !== '' ? Number(dataToSend.price) : undefined;
      }

      formDataToSend.append('data', JSON.stringify(dataToSend));

      if (formData.multimedia && formData.multimedia.length > 0) {
        console.log('🎯 [useCreatePropertyForm] Adding multimedia files to FormData:', formData.multimedia.length);
        formData.multimedia.forEach((file: File, index: number) => {
          console.log(`📎 [useCreatePropertyForm] Appending file ${index + 1}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
          });
          formDataToSend.append(`multimediaFiles`, file);
        });
        console.log('✅ [useCreatePropertyForm] FormData entries after adding files:');
        for (const [key, value] of formDataToSend.entries()) {
          if (value instanceof File) {
            console.log(`  - ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`  - ${key}: ${value}`);
          }
        }
      } else {
        console.log('📭 [useCreatePropertyForm] No multimedia files to add');
      }

      const result = await createProperty(formDataToSend);

      if (result.success) {
        console.log('Property created successfully:', result.data);
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

  // Helper functions for price formatting
  const formatPriceForDisplay = (price: string | number | undefined) => {
    if (!price && price !== 0) return '';
    const numericValue = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
    if (isNaN(numericValue)) return '';
    
    if (formData.currencyPrice === 'CLP') {
      return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(numericValue);
    } else {
      return new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numericValue);
    }
  };

  const cleanPriceValue = (price: string): number | undefined => {
    if (!price) return undefined;
    const cleanValue = price.replace(/[^\d.-]/g, '');
    const numericValue = parseFloat(cleanValue);
    return isNaN(numericValue) ? undefined : numericValue;
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    propertyTypes,
    loadingTypes,
    stateOptions,
    loadingStates,
    cityOptions,
    loadingCities,
    selectedPropertyType,
    isSubmitting,
    submitError,
  };
};
