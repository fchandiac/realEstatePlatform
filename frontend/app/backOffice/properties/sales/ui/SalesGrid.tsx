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

export default function SalesGrid({ rows, totalRows, title }: SalesGridProps) {
  const columns: DataGridColumn[] = [
    { field: 'title', headerName: 'Título', flex: 1.6, minWidth: 220 },
    { field: 'status', headerName: 'Estado', width: 140 },
    { field: 'operationType', headerName: 'Operación', width: 130 },
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

  return (
    <DataGrid
      title={'Propiedades en Venta'}
      columns={columns}
      rows={rows}
      totalRows={totalRows ?? rows.length}
      height="70vh"
      data-test-id="sales-properties-grid"
      excelUrl={excelEndpoint}
      excelFields={excelFields}
      limit={25}
    />
  );
}
