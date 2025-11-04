import moment from 'moment';
import 'moment/locale/es';

/**
 * Formatea nombres de campos del historial de cambios a español legible
 */
export function formatFieldName(field: string): string {
  const fieldNames: Record<string, string> = {
    title: 'Título',
    description: 'Descripción',
    status: 'Estado',
    operationType: 'Tipo de Operación',
    propertyTypeId: 'Tipo de Propiedad',
    assignedAgentId: 'Agente Asignado',
    isFeatured: 'Destacada',
    mainImageUrl: 'Imagen Principal',
    price: 'Precio',
    currencyPrice: 'Moneda',
    bedrooms: 'Dormitorios',
    bathrooms: 'Baños',
    builtSquareMeters: 'Metros Construidos',
    landSquareMeters: 'Metros Terreno',
    parkingSpaces: 'Estacionamientos',
    floors: 'Pisos',
    constructionYear: 'Año de Construcción',
    city: 'Ciudad',
    state: 'Región',
    address: 'Dirección',
    creation: 'Creación',
    deletion: 'Eliminación',
  };
  return fieldNames[field] || field;
}

/**
 * Formatea valores para mostrar en el historial de cambios
 */
export function formatValue(value: any, field: string): string {
  if (value === null || value === undefined) return 'N/A';
  
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'number') {
    if (field === 'price') {
      return `$ ${value.toLocaleString('es-ES')}`;
    }
    return value.toLocaleString('es-ES');
  }
  
  return String(value);
}

/**
 * Formatea fechas usando moment.js
 */
export function formatDate(date: string | Date | undefined | null, format: 'short' | 'long' = 'long'): string {
  if (!date) return 'Fecha no disponible';
  
  const momentDate = moment(date);
  
  if (!momentDate.isValid()) return 'Fecha no disponible';
  
  return format === 'short' 
    ? momentDate.format('DD/MM/YYYY')
    : momentDate.format('DD/MM/YYYY HH:mm:ss');
}

/**
 * Convierte URL relativa a absoluta usando el backend URL
 */
export function getAbsoluteUrl(url: string, backendUrl: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${backendUrl}${url}`;
}

/**
 * Formatea el nombre completo de un usuario
 */
export function formatUserName(user?: { personalInfo?: { firstName?: string; lastName?: string }; username?: string } | null): string {
  if (!user) return 'Usuario desconocido';
  
  const firstName = user.personalInfo?.firstName || '';
  const lastName = user.personalInfo?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  
  return fullName || user.username || 'Usuario desconocido';
}
