import { env } from '@/lib/env';

export interface FilterSalePropertiesDto {
  search?: string;
  filters?: {
    priceMin?: number;
    priceMax?: number;
    bedrooms?: number;
    bathrooms?: number;
    typeProperty?: string;
    state?: string;
    city?: string;
    currency?: string;
  };
  sort?: string;
  page?: number;
  limit?: number;
}

export interface SalePropertiesResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get published sale properties with filters
 */
export async function getSalePropertiesFiltered(
  filters: FilterSalePropertiesDto
): Promise<SalePropertiesResponse> {
  try {
    console.log('🔍 [getSalePropertiesFiltered] Starting with filters:', filters);

    // Build query parameters
    const params = new URLSearchParams();

    if (filters.search) {
      params.append('search', filters.search);
    }

    if (filters.filters) {
      if (filters.filters.priceMin !== undefined) {
        params.append('priceMin', filters.filters.priceMin.toString());
      }
      if (filters.filters.priceMax !== undefined) {
        params.append('priceMax', filters.filters.priceMax.toString());
      }
      if (filters.filters.bedrooms !== undefined) {
        params.append('bedrooms', filters.filters.bedrooms.toString());
      }
      if (filters.filters.bathrooms !== undefined) {
        params.append('bathrooms', filters.filters.bathrooms.toString());
      }
      if (filters.filters.typeProperty) {
        params.append('typeProperty', filters.filters.typeProperty);
      }
      if (filters.filters.state) {
        params.append('state', filters.filters.state);
      }
      if (filters.filters.city) {
        params.append('city', filters.filters.city);
      }
      if (filters.filters.currency) {
        params.append('currency', filters.filters.currency);
      }
    }

    if (filters.sort) {
      params.append('sort', filters.sort);
    }

    if (filters.page !== undefined) {
      params.append('page', filters.page.toString());
    }

    if (filters.limit !== undefined) {
      params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const url = `${env.backendApiUrl}/properties/sale${queryString ? `?${queryString}` : ''}`;

    console.log('🌐 [getSalePropertiesFiltered] Making request to:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [getSalePropertiesFiltered] API error:', response.status, errorText);
      throw new Error(`Failed to fetch sale properties: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ [getSalePropertiesFiltered] Success:', {
      total: data.total,
      page: data.page,
      totalPages: data.totalPages,
      dataLength: data.data?.length || 0
    });

    return data;
  } catch (error) {
    console.error('❌ [getSalePropertiesFiltered] Error:', error);
    throw error;
  }
}