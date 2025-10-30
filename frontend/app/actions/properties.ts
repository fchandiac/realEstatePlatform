'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { env } from '@/lib/env';

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
  status: number;
  operationType: number;
  propertyTypeId?: string;
  assignedAgentId?: string;

  // Ubicación  
  state: { id: string; label: string } | string;
  city: { id: string; label: string } | string;
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
  currencyPrice?: number;

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

// ===================================
// Property CRUD Operations
// ===================================

/**
 * Create a new property
 */
export async function createProperty(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');

  const res = await fetch(`${env.backendApiUrl}/properties`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.accessToken}` },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create property: ${res.status} ${errorText}`);
  }

  return res.json();
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
