'use server';

import { env } from '@/lib/env';

// Define Property type locally to avoid importing auth dependencies
export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  currencyPrice: 'CLP' | 'UF';
  status: string;
  operationType: 'RENT' | 'SALE';
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  propertyType?: {
    id: string;
    name: string;
  };
  assignedAgent?: {
    id: string;
    username?: string;
    email?: string;
    personalInfo?: {
      firstName?: string;
      lastName?: string;
    };
  };
  // Location fields - exactly as backend returns them
  state?: string; // RegionEnum
  city?: string; // ComunaEnum
  address?: string;
  latitude?: number;
  longitude?: number;
  // Multimedia array
  multimedia?: Array<{
    id: string;
    url: string;
    type: string;
  }>;
  mainImageUrl?: string;
  // Additional data
  builtSquareMeters?: number;
  landSquareMeters?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floors?: number;
  publishedAt?: string;
}

/**
 * Public: Get a single property by ID (accessible from portal)
 * No authentication required - returns any property that exists
 */
export async function getPublishedPropertyPublic(id: string): Promise<{
  success: boolean;
  data?: Property;
  error?: string;
}> {
  try {
    // Try to fetch the full property details without authentication
    const res = await fetch(`${env.backendApiUrl}/properties/${id}/full`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error('Error fetching property:', {
        status: res.status,
        error: errorData,
        id
      });
      return {
        success: false,
        error: errorData?.message || `Property not found: ${res.status}`,
      };
    }

    const data = await res.json();
    
    // Log what we received for debugging
    console.log('Property fetched from /full endpoint:', {
      id: data?.id,
      title: data?.title,
      status: data?.status,
      state: data?.state,
      city: data?.city,
      address: data?.address,
      latitude: data?.latitude,
      longitude: data?.longitude,
      multimedia: data?.multimedia?.length || 0,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching published property (public):', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
