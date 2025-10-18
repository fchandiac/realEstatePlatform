'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = `Error ${response.status} al obtener propiedades en venta`;
    try {
      const payload = await response.json();
      if (payload?.message) message = payload.message;
    } catch {}
    throw new Error(message);
  }

  return (await response.json()) as SalePropertiesGridResponse;
}
