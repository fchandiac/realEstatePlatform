import { PropertyStatus, PropertyOperationType } from '@/app/backOffice/properties/enums';

export const PROPERTY_STATUSES = [
  { id: PropertyStatus.REQUEST, label: 'Solicitud' },
  { id: PropertyStatus.PRE_APPROVED, label: 'Pre-aprobado' },
  { id: PropertyStatus.PUBLISHED, label: 'Publicada' },
  { id: PropertyStatus.INACTIVE, label: 'Inactivo' },
  { id: PropertyStatus.SOLD, label: 'Vendido' },
  { id: PropertyStatus.RENTED, label: 'Arrendado' },
  { id: PropertyStatus.CONTRACT_IN_PROGRESS, label: 'Contrato en Progreso' }
];

export const OPERATION_TYPES = [
  { id: PropertyOperationType.SALE, label: 'Venta' },
  { id: PropertyOperationType.RENT, label: 'Arriendo' }
];

export const SECTIONS = [
  { id: 'basic', label: 'Información Básica', icon: 'info' },
  { id: 'price', label: 'Precio y SEO', icon: 'attach_money' },
  { id: 'features', label: 'Características', icon: 'home_work' },
  { id: 'location', label: 'Ubicación', icon: 'location_on' },
  { id: 'multimedia', label: 'Multimedia', icon: 'photo_library' },
  { id: 'postRequest', label: 'Solicitud de Publicación', icon: 'post_add' },
  { id: 'history', label: 'Historial y Estadísticas', icon: 'history' },
  { id: 'dates', label: 'Fechas', icon: 'schedule' }
];
