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
