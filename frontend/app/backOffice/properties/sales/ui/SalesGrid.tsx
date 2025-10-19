'use client'
import React from 'react';
import DataGrid from '@/components/DataGrid/DataGridWrapper';
import type { DataGridColumn } from '@/components/DataGrid/DataGrid';
import { env } from '@/lib/env';
import type { SalePropertyGridRow } from '@/app/actions/properties';

type SalesGridProps = {
  rows: SalePropertyGridRow[];
  totalRows?: number;
  title?: string;
};

// Mapea los campos del backend a los esperados por el DataGrid
function mapRow(row: any) {
  return {
    id: row.p_id ?? row.id,
    title: row.p_title ?? row.title,
    status: row.p_status ?? row.status,
    operationType: row.p_operationType ?? row.operationType,
    typeName: row.typeName,
    assignedAgentName: row.assignedAgentName,
    city: row.p_city ?? row.city,
    state: row.p_state ?? row.state,
    price: row.p_price ?? row.price,
    createdAt: row.p_createdAt ?? row.createdAt,
    // Puedes agregar más campos si los necesitas en el grid
  };
}

export default function SalesGrid({ rows, totalRows, title }: SalesGridProps) {
  const columns: DataGridColumn[] = [
    { field: 'title', headerName: 'Título', flex: 1.6, minWidth: 220 },
    { field: 'status', headerName: 'Estado', width: 140 },
    { field: 'operationType', headerName: 'Operación', width: 130, hide: true },
    { field: 'typeName', headerName: 'Tipo', width: 160 },
    { field: 'assignedAgentName', headerName: 'Agente', width: 180 },
    { field: 'city', headerName: 'Ciudad', width: 150 },
    { field: 'state', headerName: 'Región', width: 140, hide: true },
    { field: 'price', headerName: 'Precio', type: 'number', renderType: 'currency', width: 140, align: 'right', headerAlign: 'right' },
    { field: 'createdAt', headerName: 'Creado', type: 'date', renderType: 'dateString', width: 160 },
  ];

  const excelEndpoint = `${env.backendApiUrl}/properties/grid-sale/excel`;
  const excelFields = [
    'id',
    'title',
    'status',
    'operationType',
    'typeName',
    'assignedAgentName',
    'city',
    'state',
    'price',
    'createdAt',
  ].join(',');

  // Aplica el mapeo antes de pasar los datos al DataGrid
  const mappedRows = rows.map(mapRow);

  return (
    <DataGrid
      title={'Propiedades en Venta'}
      columns={columns}
      rows={mappedRows}
      totalRows={totalRows ?? mappedRows.length}
      height="70vh"
      data-test-id="sales-properties-grid"
      excelUrl={excelEndpoint}
      excelFields={excelFields}
      limit={25}
    />
  );
}
