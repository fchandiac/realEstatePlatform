import { BaseFormField, BaseFormOption } from '../../../../../components/BaseForm/StepperBaseForm';
import { PropertyTypeOption, LocationOption } from './types';

// Tipo extendido para opciones que pueden tener id como string o number
export interface ExtendedOption {
  id: string | number;
  label: string;
}

const mapExtendedOptions = (options: ExtendedOption[]): BaseFormOption[] =>
  options.map(option => ({
    id: option.id,
    label: option.label,
  }));

const mapPropertyTypeOptions = (propertyTypes: PropertyTypeOption[]): BaseFormOption[] =>
  propertyTypes.map(type => ({
    id: type.id,
    label: type.label ?? type.name ?? 'Tipo de propiedad',
  }));

const mapLocationOptions = (locations: LocationOption[]): BaseFormOption[] =>
  locations.map(location => ({
    id: location.id,
    label: location.label,
  }));

// Tipos para los campos del formulario de propiedad
export interface PropertyFormData {
  // Información básica
  title: string;
  description: string;
  propertyTypeId: string; // Cambiado a string para coincidir con el hook
  price: number;
  currencyPrice: string; // Cambiado a string para usar 'CLP' y 'UF'

  // Detalles dinámicos (dependen del tipo de propiedad)
  builtSquareMeters?: number;
  landSquareMeters?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floors?: number;
  constructionYear?: number;

  // Ubicación
  stateId: string; // Cambiado a string para coincidir con LocationOption
  cityId: string; // Cambiado a string para coincidir con LocationOption
  address: string;
  coordinates: { lat: number; lng: number };

  // Multimedia
  multimedia: File[];

  // SEO y Marketing
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;

  // Notas internas
  internalNotes?: string;
}

// Función para obtener campos de información básica
export const getBasicInfoFields = (
  propertyTypes: PropertyTypeOption[],
  currencies: ExtendedOption[] = [
    { id: 'CLP', label: 'Pesos Chilenos (CLP)' },
    { id: 'UF', label: 'Unidad de Fomento (UF)' }
  ]
): BaseFormField[][] => [
  [{
    name: 'title',
    label: 'Título de la Propiedad',
    type: 'text',
    required: true,
    width: '100%',
  }],
  [{
    name: 'description',
    label: 'Descripción',
    type: 'textarea',
    required: true,
    rows: 3,
    width: '100%',
  }],
  [{
    name: 'propertyTypeId',
    label: 'Tipo de Propiedad',
    type: 'select',
    required: true,
    options: mapPropertyTypeOptions(propertyTypes),
    width: '100%',
  }],
  [
    {
      name: 'price',
      label: 'Precio',
      type: 'currency',
      required: true,
      width: '50%',
      props: {
        currencyField: 'currencyPrice',
        currencies: [
          { id: 'CLP', symbol: '$', label: 'CLP' },
          { id: 'UF', symbol: 'UF', label: 'UF' }
        ]
      }
    },
    {
      name: 'currencyPrice',
      label: 'Moneda',
      type: 'select',
      required: true,
      options: mapExtendedOptions(currencies),
      width: '50%',
    }
  ],
];

// Función para obtener campos de detalles dinámicos basados en el tipo de propiedad
export const getPropertyDetailsFields = (
  selectedPropertyType?: { name?: string | null } | null,
): BaseFormField[][] => {
  const fields: BaseFormField[][] = [];

  // Campos comunes para todas las propiedades
  fields.push([
    {
      name: 'builtSquareMeters',
      label: 'Metros Construidos (m²)',
      type: 'number',
      min: 0,
      width: '50%',
    },
    {
      name: 'landSquareMeters',
      label: 'Metros de Terreno (m²)',
      type: 'number',
      min: 0,
      width: '50%',
    }
  ]);

  // Campos específicos según el tipo de propiedad
  const normalizedName = selectedPropertyType?.name?.toLowerCase() ?? '';

  if (normalizedName) {
    // Para casas y departamentos
    if (['casa', 'departamento', 'house', 'apartment'].some(type =>
      normalizedName.includes(type)
    )) {
      fields.push(
        [{
          name: 'bedrooms',
          label: 'Dormitorios',
          type: 'number',
          min: 0,
          width: '33.33%',
        },
        {
          name: 'bathrooms',
          label: 'Baños',
          type: 'number',
          min: 0,
          width: '33.33%',
        },
        {
          name: 'parkingSpaces',
          label: 'Estacionamientos',
          type: 'number',
          min: 0,
          width: '33.33%',
        }]
      );
    }

    // Para edificios o propiedades comerciales
    if (['edificio', 'oficina', 'local', 'building', 'office', 'commercial'].some(type =>
      normalizedName.includes(type)
    )) {
      fields.push(
        [{
          name: 'floors',
          label: 'Número de Pisos',
          type: 'number',
          min: 1,
          width: '50%',
        }]
      );
    }

    // Campo común: año de construcción
    fields.push(
      [{
        name: 'constructionYear',
        label: 'Año de Construcción',
        type: 'number',
        min: 1800,
        max: new Date().getFullYear(),
        width: '50%',
      }]
    );
  }

  return fields;
};

// Función para obtener campos de ubicación
export const getLocationFields = (
  stateOptions: LocationOption[],
  cityOptions: LocationOption[]
): BaseFormField[][] => [
  [
    {
      name: 'state',
      label: 'Estado/Región',
      type: 'select',
      required: true,
      options: mapLocationOptions(stateOptions),
      width: '50%',
    },
    {
      name: 'city',
      label: 'Comuna',
      type: 'select',
      required: true,
      options: mapLocationOptions(cityOptions),
      width: '50%',
    },
  ],
  [{
    name: 'address',
    label: 'Dirección Completa',
    type: 'textarea',
    required: true,
    rows: 3,
    width: '100%',
  }],
  [{
    name: 'coordinates',
    label: 'Ubicación en Mapa',
    type: 'location',
    required: true,
    width: '100%',
  }],
];

// Función para obtener campos de multimedia
export const getMultimediaFields = (): BaseFormField[][] => [
  [{
    name: 'multimedia',
    label: '',
    type: 'multimedia',
    required: true,
    props: {
      uploadPath: '/uploads/properties',
      accept: 'image/*,video/*',
      maxFiles: 20,
      maxSize: 10, // 10MB por archivo
    },
    width: '100%',
  }],
];

// Función para obtener campos de SEO
export const getSeoFields = (): BaseFormField[][] => [
  [{
    name: 'seoTitle',
    label: 'Título SEO',
    type: 'text',
    width: '100%',
  }],
  [{
    name: 'seoDescription',
    label: 'Descripción SEO',
    type: 'textarea',
    rows: 3,
    width: '100%',
  }],
  [{
    name: 'seoKeywords',
    label: 'Palabras Clave SEO',
    type: 'text',
    width: '100%',
  }],
];

// Función para obtener campos de notas internas
export const getInternalNotesFields = (): BaseFormField[][] => [
  [{
    name: 'internalNotes',
    label: 'Notas Internas',
    type: 'textarea',
    rows: 4,
    width: '100%',
  }],
];