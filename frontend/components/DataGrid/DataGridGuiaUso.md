# Guía de Uso — DataGrid Genérico (Next.js + SQLite)

Esta guía explica cómo implementar un endpoint y un server component para usar el componente DataGrid con cualquier entidad/tablas en tu proyecto Next.js + SQLite. Incluye plantilla de endpoint, configuración, ejemplos y buenas prácticas.

---

## 1. Idea General

El endpoint debe:
- Validar y filtrar los campos solicitados (evitar exponer columnas no permitidas).
- Construir el SELECT con posibles JOINs y alias.
- Construir el WHERE a partir de filtros por columna (`filters`) y búsqueda global (`search`).
- Aplicar `ORDER BY` solo sobre campos permitidos.
- Aplicar paginación (`LIMIT`/`OFFSET`) y devolver total y totalPages.
- Ejecutar consultas parametrizadas para evitar inyección SQL.

---

## 2. Configuración de la Entidad

Define un objeto de configuración por entidad (tabla):

```ts
// config.ts (ejemplo para workers)
export const ENTITY_CONFIG = {
  table: 'workers',
  alias: 'w',
  join: 'LEFT JOIN stores s ON w.storeId = s.id',
  availableFields: [
    'id', 'name', 'dni', 'storeId', 'storeName', 'storeAddress'
  ],
  fieldMappings: {
    id: 'w.id',
    name: 'w.name',
    dni: 'w.dni',
    storeId: 'w.storeId',
    storeName: 's.name AS storeName',
    storeAddress: 's.address AS storeAddress'
  },
  textSearchFields: ['w.name', 'w.dni', 's.name', 's.address']
};
```

Para otra entidad, cambia `table`, `join`, `availableFields` y `fieldMappings`.

---

## 3. Endpoint Genérico (Next.js API Route)

El siguiente ejemplo muestra cómo implementar un endpoint genérico para manejar consultas parametrizadas y devolver datos compatibles con el DataGrid. Este endpoint incluye validación de campos, filtros por columna, búsqueda global, ordenamiento y paginación.

```ts
// app/api/<entity>/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { ENTITY_CONFIG } from './config'; // importa el config

const dbPromise = open({ filename: 'data/database.sqlite', driver: sqlite3.Database });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // --- parse params ---
    const fieldsParam = searchParams.get('fields');
    const sort = (searchParams.get('sort') as 'asc' | 'desc' | null);
    const sortField = searchParams.get('sortField');
    const search = searchParams.get('search');
    const filtration = searchParams.get('filtration');
    const filters = searchParams.get('filters');
    const pagination = searchParams.get('pagination');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    // --- fields (validate) ---
    const fields = fieldsParam
      ? fieldsParam.split(',').map(f => f.trim()).filter(f => ENTITY_CONFIG.availableFields.includes(f))
      : ENTITY_CONFIG.availableFields;

    if (fields.length === 0) {
      return NextResponse.json(pagination === 'true' ? { data: [], total: 0, page: 1, limit: 10, totalPages: 0 } : []);
    }

    // --- column filters ---
    let columnFilters: Array<{ column: string; value: string }> = [];
    if (filtration === 'true' && filters) {
      columnFilters = parseColumnFilters(filters, ENTITY_CONFIG.availableFields);
    }

    // --- pagination config ---
    let paginationConfig: { page: number; limit: number } | null = null;
    if (pagination === 'true') {
      const pageNum = Math.max(1, parseInt(pageParam || '1'));
      const limitNum = Math.min(Math.max(1, parseInt(limitParam || '10')), 100);
      paginationConfig = { page: pageNum, limit: limitNum };
    }

    const db = await dbPromise;
    const result = await findWithFilters(db, ENTITY_CONFIG, fields, sort, sortField, search, columnFilters, paginationConfig);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Grid endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(ENTITY_CONFIG.availableFields);
}

/* ---- helper functions (parseColumnFilters, normalizeString, findWithFilters) ---- */
function parseColumnFilters(filters: string, allowed: string[]) {
  return filters
    .split(',')
    .map(f => f.trim())
    .filter(f => f.includes('-'))
    .map(f => {
      const dash = f.indexOf('-');
      return { column: f.substring(0, dash).trim(), value: decodeURIComponent(f.substring(dash + 1).trim()) };
    })
    .filter(f => f.column && f.value && allowed.includes(f.column));
}

function normalizeString(str: string) {
  return str
    .toLowerCase()
    .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u').replace(/ñ/g,'n');
}

async function findWithFilters(
  db: any,
  config: any,
  fields: string[],
  sort?: 'asc' | 'desc' | null,
  sortField?: string | null,
  search?: string | null,
  columnFilters: Array<{ column: string; value: string }> = [],
  paginationConfig?: { page: number; limit: number } | null
) {
  // SELECT fields
  const selectFields = fields.map((f: string) => config.fieldMappings[f] || f).join(', ');
  const baseFrom = `FROM ${config.table} ${config.alias} ${config.join ?? ''}`;
  const countFrom = `FROM ${config.table} ${config.alias} ${config.join ?? ''}`;

  const conditions: string[] = [];
  const params: any[] = [];

  // Column filters -> normalized LIKE
  columnFilters.forEach(filter => {
    const normalizedValue = normalizeString(filter.value);
    let dbField = config.fieldMappings[filter.column] ? (config.fieldMappings[filter.column].split(' AS ')[0]) : `${config.alias}.${filter.column}`;
    conditions.push(`REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(${dbField}), 'á','a'),'é','e'),'í','i'),'ó','o'),'ú','u') LIKE ?`);
    params.push(`%${normalizedValue}%`);
  });

  // Global search
  if (search && search.trim() !== '') {
    const normalizedSearch = normalizeString(search.trim());
    const searchConds: string[] = [];

    if (/^\d+$/.test(search)) {
      searchConds.push(`CAST(${config.alias}.id AS TEXT) LIKE ?`);
      params.push(`${search}%`);
      searchConds.push(`${config.alias}.id = ?`);
      params.push(parseInt(search));
    }

    config.textSearchFields.forEach((field: string) => {
      searchConds.push(`REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(${field}), 'á','a'),'é','e'),'í','i'),'ó','o'),'ú','u') LIKE ?`);
      params.push(`%${normalizedSearch}%`);
    });

    if (/^\d+$/.test(search)) {
      searchConds.push(`${config.alias}.storeId = ?`);
      params.push(parseInt(search));
    }

    if (searchConds.length) conditions.push(`(${searchConds.join(' OR ')})`);
  }

  const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';

  let orderClause = '';
  if (sortField && config.availableFields.includes(sortField)) {
    let dbSortField = (config.fieldMappings[sortField] || `${config.alias}.${sortField}`).split(' AS ')[0];
    const dir = sort === 'desc' ? 'DESC' : 'ASC';
    orderClause = ` ORDER BY ${dbSortField} ${dir}`;
  }

  if (paginationConfig) {
    const totalRow = await db.get(`SELECT COUNT(*) as total ${countFrom} ${whereClause}`, params);
    const total = totalRow.total;
    const totalPages = Math.ceil(total / paginationConfig.limit);
    const offset = (paginationConfig.page - 1) * paginationConfig.limit;
    const finalQuery = `SELECT ${selectFields} ${baseFrom} ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
    const data = await db.all(finalQuery, [...params, paginationConfig.limit, offset]);
    return { data, total, page: paginationConfig.page, limit: paginationConfig.limit, totalPages };
  }

  const finalQuery = `SELECT ${selectFields} ${baseFrom} ${whereClause} ${orderClause}`;
  return await db.all(finalQuery, params);
}
```

### Notas:
- Este endpoint es genérico y puede adaptarse a cualquier entidad cambiando la configuración en `ENTITY_CONFIG`.
- Valida los campos solicitados y los filtros para evitar exponer datos no permitidos.
- Usa consultas parametrizadas para prevenir inyección SQL.

---

## 3.1. Server Action para Consumir el Endpoint

El siguiente server action se encarga de consumir el endpoint genérico para obtener los datos necesarios para el DataGrid. Este server action es reutilizable y parametrizable para adaptarse a las necesidades del frontend.

```ts
// actions/workers.ts
export interface WorkersGridParams {
  fields?: string;
  sort?: 'asc' | 'desc';
  sortField?: string;
  search?: string;
  filtration?: boolean;
  filters?: string;
  pagination?: boolean;
  page?: number;
  limit?: number;
}

export async function getWorkersGrid(params: WorkersGridParams = {}) {
  try {
    const url = new URL('/api/workers/grid', 'http://localhost:3000');
    url.searchParams.set('fields', params.fields ?? 'id,name,dni,storeId,storeName,storeAddress');
    if (params.sort && params.sortField) {
      url.searchParams.set('sort', params.sort);
      url.searchParams.set('sortField', params.sortField);
    }
    if (params.search) url.searchParams.set('search', params.search);
    if (params.filtration && params.filters) {
      url.searchParams.set('filtration', 'true');
      url.searchParams.set('filters', params.filters);
    }
    if (params.pagination !== false) {
      url.searchParams.set('pagination', 'true');
      url.searchParams.set('page', (params.page || 1).toString());
      url.searchParams.set('limit', (params.limit || 10).toString());
    }

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    return params.pagination !== false && result.data
      ? {
          data: result.data,
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        }
      : {
          data: Array.isArray(result) ? result : [],
          total: Array.isArray(result) ? result.length : 0,
          page: 1,
          limit: Array.isArray(result) ? result.length : 0,
          totalPages: 1,
        };
  } catch (error) {
    console.error('Error fetching workers grid:', error);
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}
```

### Notas:
- Este server action construye dinámicamente la URL con los parámetros necesarios para la consulta.
- Valida y maneja errores en caso de que el endpoint no responda correctamente.
- Devuelve los datos en un formato compatible con el DataGrid, incluyendo paginación y metadatos como `total` y `totalPages`.

---

## 4. Ejemplo de URL desde el Frontend

```
/api/workers?fields=id,name,storeName&search=juan&filtration=true&filters=name-juan,storeName-Tienda&pagination=true&page=2&limit=20&sort=asc&sortField=name
```

---

## 5. Ejemplo de Configuración para Otra Entidad

```ts
export const ENTITY_CONFIG = {
  table: 'products',
  alias: 'p',
  join: 'LEFT JOIN categories c ON p.categoryId = c.id',
  availableFields: ['id','title','sku','price','categoryName'],
  fieldMappings: {
    id: 'p.id',
    title: 'p.title',
    sku: 'p.sku',
    price: 'p.price',
    categoryName: 'c.name AS categoryName'
  },
  textSearchFields: ['p.title','p.sku','c.name']
};
```

---

## 6. Ejemplo de Uso en un Server Component

```tsx
import React from 'react';
import { redirect } from 'next/navigation';
import DataGrid from './DataGrid';
import type { DataGridColumn } from './DataGrid';
import { getWorkersGrid } from '../../actions/workers';

interface PageProps {
  searchParams?: Promise<{
    sort?: 'asc' | 'desc';
    sortField?: string;
    search?: string;
    filters?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function DataGridPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;
  const needsRedirect = !params?.page || !params?.limit;
  if (needsRedirect) {
    const searchParamsObj = new URLSearchParams();
    if (params?.sort) searchParamsObj.set('sort', params.sort);
    if (params?.sortField) searchParamsObj.set('sortField', params.sortField);
    if (params?.search) searchParamsObj.set('search', params.search);
    if (params?.filters) searchParamsObj.set('filters', params.filters);
    searchParamsObj.set('page', params?.page || '1');
    searchParamsObj.set('limit', params?.limit || '10');
    redirect(`/components/DataGrid?${searchParamsObj.toString()}`);
  }
  const sort = params?.sort === 'asc' ? 'asc' : (params?.sort === 'desc' ? 'desc' : undefined);
  const sortField = typeof params?.sortField === 'string' ? params?.sortField : Array.isArray(params?.sortField) ? params?.sortField[0] : undefined;
  const search = typeof params?.search === 'string' ? params?.search : Array.isArray(params?.search) ? params?.search[0] : '';
  const filters = typeof params?.filters === 'string' ? params?.filters : Array.isArray(params?.filters) ? params?.filters[0] : '';
  const pageParam = typeof params?.page === 'string' ? params?.page : Array.isArray(params?.page) ? params?.page[0] : '1';
  const limitParam = typeof params?.limit === 'string' ? params?.limit : Array.isArray(params?.limit) ? params?.limit[0] : '10';
  const page = parseInt(pageParam) || 1;
  const limit = parseInt(limitParam) || 10;
  const result = await getWorkersGrid({
    fields: 'id,name,dni,storeId,storeName,storeAddress',
    sort,
    sortField,
    search,
    filtration: !!filters,
    filters,
    pagination: true,
    page,
    limit
  });
  const initialData = result.data;
  const totalRows = result.total;
  const columns: DataGridColumn[] = [
    { field: 'id', headerName: 'ID', width: 80, type: 'id', align: 'center', sortable: true },
    { field: 'name', headerName: 'Nombre Completo', flex: 2, type: 'string', sortable: true, minWidth: 180 },
    { field: 'dni', headerName: 'DNI', width: 120, type: 'string', align: 'center', sortable: true },
    { field: 'storeName', headerName: 'Tienda', flex: 2, type: 'string', sortable: true, minWidth: 180 },
    { field: 'storeAddress', headerName: 'Dirección', flex: 2, type: 'string', sortable: true, minWidth: 200 },
    { field: 'storeId', headerName: 'Store ID', width: 90, type: 'number', align: 'center', sortable: true }
  ];
  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <DataGrid
        columns={columns}
        title="Workers"
        rows={initialData}
        sort={sort}
        sortField={sortField}
        filters={filters}
        height={600}
        totalRows={totalRows}
      />
    </div>
  );
}
```

---

## 7. Notas de Seguridad y Optimización
- Valida siempre los campos solicitados y los filtros contra `availableFields`.
- Usa queries parametrizadas (`?` y array de params) para evitar inyección SQL.
- Limita el `limit` máximo (ej: 100) para evitar abusos.
- No expongas campos sensibles en `availableFields`.

---

## 8. Resumen

- El endpoint y el server component son genéricos y adaptables a cualquier tabla.
- Solo necesitas cambiar la configuración de la entidad y los nombres de campos/joins.
- El DataGrid del frontend funciona igual para cualquier entidad si el endpoint respeta el contrato de paginación, filtros y campos.

---

¿Dudas? Revisa el código de ejemplo y adapta la plantilla a tu caso. ¡Listo para usar DataGrid con cualquier tabla de tu base de datos!
