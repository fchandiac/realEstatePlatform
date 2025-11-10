'use server';

import { env } from '@/lib/env';
import { revalidatePath } from 'next/cache';

export interface PropertyData {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  operationType: string;
  state: string;
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  totalArea: number;
  mainImageUrl: string;
  createdAt: string;
}

export interface PublishedPropertiesResponse {
  data: PropertyData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function getPublishedPropertiesFiltered(filters: {
  currency?: string;
  state?: string;
  city?: string;
  typeProperty?: string;
  operation?: string;
  page?: number;
}): Promise<PublishedPropertiesResponse | null> {
  try {
    const params = new URLSearchParams();

    // Convertir 'rent' -> 'RENT', 'sale' -> 'SALE'
    if (filters.operation) {
      const operationMap: { [key: string]: string } = {
        rent: 'RENT',
        sale: 'SALE',
      };
      const mappedOperation = operationMap[filters.operation.toLowerCase()] || filters.operation;
      params.append('operation', mappedOperation);
    }

    if (filters.currency && filters.currency !== 'all') params.append('currency', filters.currency);
    if (filters.state) params.append('state', filters.state);
    if (filters.city) params.append('city', filters.city);
    if (filters.typeProperty) params.append('typeProperty', filters.typeProperty);
    if (filters.page) params.append('page', filters.page.toString());

    const url = `${env.backendApiUrl}/properties/published/filtered?${params.toString()}`;

    console.log('📡 Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error('Error fetching published properties:', response.status, errorText);
      return null;
    }

    const rawData = await response.json();
    
    // Mapear los datos del backend al formato esperado
    const mappedData: PropertyData[] = (rawData.data || []).map((prop: any) => ({
      id: prop.id,
      title: prop.title,
      description: prop.description,
      price: prop.price,
      currency: prop.currency || 'CLP',
      operationType: prop.operationType,
      state: prop.state,
      city: prop.city,
      address: prop.address,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      totalArea: prop.builtSquareMeters,
      mainImageUrl: prop.mainImageUrl,
      createdAt: prop.createdAt,
    }));

    console.log('✅ Properties fetched:', mappedData.length, 'items');
    
    return {
      data: mappedData,
      pagination: rawData.pagination || {},
    };
  } catch (error) {
    console.error('Failed to fetch published properties:', error);
    return null;
  }
}

export async function refreshPortalProperties() {
  'use server';
  revalidatePath('/portal');
}
