'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { env } from '@/lib/env';
import { revalidatePath } from 'next/cache';

export type GridSort = 'asc' | 'desc';

export interface SalePropertiesGridParams {
  fields?: string; // comma-separated list of fields
  sort?: GridSort;
  sortField?: string;
  search?: string;
  filtration?: boolean;
  filters?: string; // e.g. "city-Las Condes,typeName-Departamento"
  pagination?: boolean;
  page?: number;
  limit?: number;
}

export interface SalePropertyGridRow {
  id: string;
  title?: string;
  status?: string;
  operationType?: string;
  typeName?: string;
  characteristics?: string;
  assignedAgentName?: string;
  city?: string;
  state?: string;
  priceDisplay?: string;
  price?: number;
  currencyPrice?: 'CLP' | 'UF';
  createdAt?: string;
  updatedAt?: string;
  // allow additional fields without strict typing
  [key: string]: any;
}

export type SalePropertiesGridResponse =
  | SalePropertyGridRow[]
  | { data: SalePropertyGridRow[]; total: number; page: number; limit: number; totalPages: number };

export async function getSalePropertiesGrid(
  params: SalePropertiesGridParams = {}
): Promise<SalePropertiesGridResponse> {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error('No hay una sesión activa para consultar propiedades.');
  }

  console.log('[DEBUG] getSalePropertiesGrid - params.filters received:', params.filters);
  console.log('[DEBUG] getSalePropertiesGrid - params.filtration:', params.filtration);

  const url = new URL(`${env.backendApiUrl}/properties/grid-sale`);

  // map boolean flags to 'true'|'false' strings
  const setBoolParam = (key: string, value?: boolean) => {
    if (typeof value === 'boolean') url.searchParams.set(key, value ? 'true' : 'false');
  };

  // attach params
  if (params.fields) url.searchParams.set('fields', params.fields);
  if (params.sort) url.searchParams.set('sort', params.sort);
  if (params.sortField) url.searchParams.set('sortField', params.sortField);
  if (typeof params.search === 'string') url.searchParams.set('search', params.search);
  if (typeof params.filters === 'string') url.searchParams.set('filters', params.filters);
  setBoolParam('filtration', params.filtration);
  setBoolParam('pagination', params.pagination);
  if (typeof params.page === 'number') url.searchParams.set('page', String(params.page));
  if (typeof params.limit === 'number') url.searchParams.set('limit', String(params.limit));

  console.log('[DEBUG] getSalePropertiesGrid - Final URL sent to backend:', url.toString());

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  console.log('[DEBUG] getSalePropertiesGrid - Response status:', response.status);

  if (!response.ok) {
    let message = `Error ${response.status} al obtener propiedades en venta`;
    try {
      const payload = await response.json();
      if (payload?.message) message = payload.message;
    } catch {}
    throw new Error(message);
  }

  const result = await response.json();
  console.log('[DEBUG] getSalePropertiesGrid - Response data length:', Array.isArray(result) ? result.length : 'Not an array');
  return result as SalePropertiesGridResponse;
}

export async function getSalePropertiesCountSale(): Promise<number> {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  if (!accessToken) throw new Error('No hay sesión activa');
  const res = await fetch(`${env.backendApiUrl}/properties/count-sale`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al obtener el total de propiedades en venta');
  const data = await res.json();
  return data.total;
}

export async function getSalePropertiesCountPublished(): Promise<number> {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  if (!accessToken) throw new Error('No hay sesión activa');
  const res = await fetch(`${env.backendApiUrl}/properties/count-published`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al obtener el total de propiedades publicadas');
  const data = await res.json();
  return data.total;
}

export async function getSalePropertiesCountFeatured(): Promise<number> {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  if (!accessToken) throw new Error('No hay sesión activa');
  const res = await fetch(`${env.backendApiUrl}/properties/count-featured`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al obtener el total de propiedades destacadas');
  const data = await res.json();
  return data.total;
}

export async function listPropertyTypes(): Promise<{
  success: boolean;
  data?: Array<{ id: string; name: string }>;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const url = `${env.backendApiUrl}/property-types`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `HTTP ${response.status}` 
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error listing property types:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ===================================
// Property Entity Interface
// ===================================

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  currencyPrice: 'CLP' | 'UF';
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RESERVED';
  operationType: 'RENT' | 'SALE';
  availableFrom?: string;
  publicDescription?: string;
  privateNotes?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  propertyType: {
    id: string;
    name: string;
  };
  assignedAgent?: {
    id: string;
    username: string;
    personalInfo?: {
      firstName?: string;
      lastName?: string;
    };
  };
  location?: {
    country?: string;
    region?: string;
    province?: string;
    city?: string;
    neighborhood?: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  characteristics?: {
    totalArea?: number;
    builtArea?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpaces?: number;
    floors?: number;
    amenities?: string[];
    orientation?: string;
    condition?: string;
    yearBuilt?: number;
  };
  multimedia?: Array<{
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'VIRTUAL_TOUR';
    isMain?: boolean;
    order?: number;
  }>;
}

export interface CreatePropertyDto {
  // Datos generales
  title: string;
  description?: string;
  status: number; // Número que se mapea a string en el backend
  operationType: number; // Número que se mapea a string en el backend
  propertyTypeId?: string;

  // Ubicación  
  state: string; // ID extraído del objeto
  city: string; // ID extraído del objeto
  address?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };

  // Características (todas opcionales ahora)
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floors?: number;
  builtSquareMeters?: number;
  landSquareMeters?: number;
  constructionYear?: number;

  // Precio (opcionales)
  price?: string;
  currencyPrice?: number; // Número que se mapea a string en el backend

  // SEO
  seoTitle?: string;
  seoDescription?: string;

  // Multimedia
  multimedia?: Array<{
    id?: string;
    url: string;
    filename: string;
    type: 'image' | 'video';
    order?: number;
  }>;

  // Imagen principal
  mainImageUrl?: string;

  // Internos
  internalNotes?: string;
}

export interface UpdatePropertyDto {
  title?: string;
  description?: string;
  price?: number;
  currencyPrice?: 'CLP' | 'UF';
  status?: 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RESERVED';
  operationType?: 'RENT' | 'SALE';
  propertyTypeId?: string;
  assignedAgentId?: string;
  availableFrom?: string;
  publicDescription?: string;
  privateNotes?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  location?: {
    country?: string;
    region?: string;
    province?: string;
    city?: string;
    neighborhood?: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  characteristics?: {
    totalArea?: number;
    builtArea?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpaces?: number;
    floors?: number;
    amenities?: string[];
    orientation?: string;
    condition?: string;
    yearBuilt?: number;
  };
}

export interface UpdatePropertyBasicDto {
  title?: string;
  description?: string;
  status?: string; // backend enum string
  operationType?: string; // backend enum string
  propertyTypeId?: string;
  assignedAgentId?: string;
  isFeatured?: boolean;
}

/**
 * Create a new property
 */
export async function createProperty(data: FormData): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    // El FormData ya viene preparado con 'data' como JSON string y 'multimediaFiles' como archivos
    const response = await fetch(`${env.backendApiUrl}/properties`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        // No incluir Content-Type para que el navegador lo setee automáticamente con boundary
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to create property: ${response.status}` 
      };
    }

    const result = await response.json();
    
    // Revalidate the sales properties path
    revalidatePath('http://localhost:3001/backOffice/properties/sales');
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating property:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get a property by ID
 */
export async function getProperty(id: string): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to fetch property: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching property:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get full property details with all relations and aggregated data
 */
export async function getFullProperty(id: string): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    console.log('🔍 [getFullProperty] Llamando a /properties/' + id + '/full');

    const response = await fetch(`${env.backendApiUrl}/properties/${id}/full`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('❌ [getFullProperty] Error response:', {
        status: response.status,
        error: errorData
      });
      return { 
        success: false, 
        error: errorData?.message || `Failed to fetch full property: ${response.status}` 
      };
    }

    const result = await response.json();
    console.log('✅ [getFullProperty] Resultado completo:', {
      id: result?.id,
      title: result?.title,
      hasMultimedia: result?.multimedia ? result.multimedia.length : 0,
      hasPropertyType: !!result?.propertyType,
      propertyType: result?.propertyType,
      hasChangeHistory: !!result?.changeHistory,
      changeHistoryCount: result?.changeHistory?.length || 0
    });
    
    // Resolver nombres de usuarios del historial en el servidor
    if (result.changeHistory && Array.isArray(result.changeHistory) && result.changeHistory.length > 0) {
      console.log('📜 [getFullProperty] Resolviendo nombres de usuarios del historial...');
      
      // Obtener IDs únicos de usuarios
      const uniqueUserIds = [...new Set(
        result.changeHistory
          .map((h: any) => h.changedBy)
          .filter((id: any) => id && typeof id === 'string' && id !== 'system')
      )] as string[];
      
      console.log('👥 [getFullProperty] IDs de usuarios a resolver:', uniqueUserIds);
      
      // Cargar nombres de usuarios en paralelo
      const userPromises = uniqueUserIds.map(async (userId: string) => {
        try {
          const userResponse = await fetch(`${env.backendApiUrl}/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            },
            cache: 'no-store',
          });
          
          if (!userResponse.ok) {
            console.warn(`⚠️ [getFullProperty] No se pudo cargar usuario ${userId}`);
            return { id: userId, name: 'Usuario desconocido' };
          }
          
          const user = await userResponse.json();
          const name = `${user.personalInfo?.firstName || ''} ${user.personalInfo?.lastName || ''}`.trim() 
            || user.username 
            || 'Usuario desconocido';
          
          return { id: userId, name };
        } catch (error) {
          console.error(`❌ [getFullProperty] Error cargando usuario ${userId}:`, error);
          return { id: userId, name: 'Usuario desconocido' };
        }
      });
      
      const users = await Promise.all(userPromises);
      const userMap = Object.fromEntries(users.map(u => [u.id, u.name]));
      
      console.log('✅ [getFullProperty] Nombres de usuarios resueltos:', userMap);
      
      // Agregar nombres al historial
      result.changeHistory = result.changeHistory.map((change: any) => ({
        ...change,
        changedByName: change.changedBy === 'system' 
          ? 'Sistema' 
          : (userMap[change.changedBy] || 'Usuario desconocido')
      }));
      
      console.log('✅ [getFullProperty] Historial enriquecido con nombres de usuarios');
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ [getFullProperty] Error fetching full property:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update a property
 */
export async function updateProperty(id: string, data: UpdatePropertyDto): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to update property: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating property:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update basic property information (title, description, status, operationType, propertyTypeId, assignedAgentId)
 */
export async function updatePropertyBasic(id: string, data: UpdatePropertyBasicDto): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${id}/basic`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.message || `Failed to update property basic info: ${response.status}`,
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating property basic info:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a property (soft delete)
 */
export async function deleteProperty(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to delete property: ${response.status}` 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Toggle property published status
 */
export async function togglePropertyPublished(id: string): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${id}/toggle-published`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to toggle published status: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error toggling published status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Toggle property featured status
 */
export async function togglePropertyFeatured(id: string): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${id}/toggle-featured`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to toggle featured status: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error toggling featured status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Assign agent to property
 */
export async function assignPropertyAgent(id: string, agentId: string): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${id}/assign-agent`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agentId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to assign agent: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error assigning agent:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get properties by agent
 */
export async function getPropertiesByAgent(agentId: string, params: {
  page?: number;
  limit?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RESERVED';
} = {}): Promise<{
  success: boolean;
  data?: {
    data: Property[];
    total: number;
    page: number;
    limit: number;
  };
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.status) searchParams.set('status', params.status);

    const url = `${env.backendApiUrl}/properties/by-agent/${agentId}?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to fetch properties by agent: ${response.status}` 
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching properties by agent:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export interface UpdatePropertyCharacteristicsDto {
  builtSquareMeters?: number;
  landSquareMeters?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floors?: number;
  constructionYear?: number;
}

/**
 * Update property characteristics
 */
export async function updatePropertyCharacteristics(id: string, data: UpdatePropertyCharacteristicsDto): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${id}/characteristics`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to update property characteristics: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating property characteristics:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export interface UpdatePropertyLocationDto {
  address?: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdatePropertyPriceDto {
  price?: number;
  currencyPrice?: 'CLP' | 'UF';
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Update property price and SEO information
 */
export async function updatePropertyPrice(id: string, data: UpdatePropertyPriceDto): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${id}/price`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to update property price: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating property price:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update property location
 */
export async function updatePropertyLocation(id: string, data: UpdatePropertyLocationDto): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${id}/location`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to update property location: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating property location:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export interface PublicPropertyItem {
  id: string;
  title: string;
  description?: string;
  status?: string;
  operationType: 'RENT' | 'SALE';
  price: number;
  currencyPrice: 'CLP' | 'UF';
  city?: string;
  state?: string;
  mainImageUrl?: string;
  publishedAt?: string;
  propertyType?: { id: string; name: string };
  bedrooms?: number;
  bathrooms?: number;
  builtSquareMeters?: number;
  landSquareMeters?: number;
  parkingSpaces?: number;
  isFeatured?: boolean;
}

/**
 * Public: list all published properties (no token required)
 */
export async function getPublishedPropertiesPublic(): Promise<{
  success: boolean;
  data?: PublicPropertyItem[];
  error?: string;
}> {
  try {
    const res = await fetch(`${env.backendApiUrl}/properties/public`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return {
        success: false,
        error: errorData?.message || `Failed to fetch published properties: ${res.status}`,
      };
    }

    const data = (await res.json()) as PublicPropertyItem[];
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching published properties (public):', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function updateMainImage(
  propertyId: string,
  mainImageUrl: string | null
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No autorizado' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${propertyId}/main-image`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ mainImageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Error al actualizar imagen principal'
      };
    }

    const updatedProperty = await response.json();
    return { success: true, data: updatedProperty };
  } catch (error) {
    console.error('Error updating main image:', error);
    return {
      success: false,
      error: 'Error inesperado al actualizar imagen principal'
    };
  }
}

export async function uploadPropertyMultimedia(
  propertyId: string,
  files: File[]
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No autorizado' };
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${env.backendApiUrl}/properties/${propertyId}/multimedia`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Error al subir multimedia'
      };
    }

    const uploadedFiles = await response.json();
    return { success: true, data: uploadedFiles };
  } catch (error) {
    console.error('Error uploading multimedia:', error);
    return {
      success: false,
      error: 'Error inesperado al subir multimedia'
    };
  }
}

/**
 * Check if a multimedia item is the main image of a property
 */
export async function isMultimediaMain(
  propertyId: string,
  multimediaId: string
): Promise<{
  success: boolean;
  isMain?: boolean;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No autorizado' };
    }

    const response = await fetch(`${env.backendApiUrl}/properties/${propertyId}/multimedia/${multimediaId}/is-main`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Error al verificar si la multimedia es principal'
      };
    }

    const result = await response.json();
    return { success: true, isMain: result.isMain };
  } catch (error) {
    console.error('Error checking if multimedia is main:', error);
    return {
      success: false,
      error: 'Error inesperado al verificar multimedia principal'
    };
  }
}
