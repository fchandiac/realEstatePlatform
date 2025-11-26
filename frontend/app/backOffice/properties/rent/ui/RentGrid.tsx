'use client';
import React from 'react';
import RentMoreButton from './RentMoreButton';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataGrid from '@/components/DataGrid/DataGridWrapper';
import type { DataGridColumn } from '@/components/DataGrid/DataGrid';
import { env } from '@/lib/env';
import type { RentPropertyGridRow } from '@/app/actions/properties';
import CreateProperty from '../../ui/createProperty/CreateProperty';
import DeletePropertyButton from '../../ui/DeletePropertyButton';
import { useAlert } from '@/app/contexts/AlertContext';

type RentGridProps = {
  rows: RentPropertyGridRow[];
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
    currencyPrice: row.p_currencyPrice ?? row.currencyPrice,
    createdAt: row.p_createdAt ?? row.createdAt,
    // Puedes agregar más campos si los necesitas en el grid
  };
}

export default function RentGrid({ rows, totalRows, title }: RentGridProps) {
  const alert = useAlert();
  const router = useRouter();

  const columns: DataGridColumn[] = [
    { field: 'title', headerName: 'Título', flex: 1.6, minWidth: 220, sortable: true, filterable: true },
    { field: 'status', headerName: 'Estado', width: 140, sortable: true, filterable: true },
    { field: 'operationType', headerName: 'Operación', width: 130, hide: true, sortable: true, filterable: true },
    { field: 'typeName', headerName: 'Tipo', width: 160, sortable: true, filterable: true },
    { field: 'assignedAgentName', headerName: 'Agente', width: 180, sortable: true, filterable: true },
    { field: 'city', headerName: 'Ciudad', width: 150, sortable: true, filterable: true },
    { field: 'state', headerName: 'Región', width: 140, hide: true, sortable: true, filterable: true },
    { 
      field: 'price', 
      headerName: 'Precio', 
      type: 'number', 
      width: 140, 
      align: 'right', 
      headerAlign: 'right', 
      sortable: true, 
      filterable: true,
      renderCell: ({ row, value }) => {
        if (value === undefined || value === null) return '';
        const currency = row.currencyPrice || 'CLP';
        
        if (currency === 'UF') {
          return `UF ${new Intl.NumberFormat('es-CL', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          }).format(value)}`;
        }
        
        return new Intl.NumberFormat('es-CL', { 
          style: 'currency', 
          currency: 'CLP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      }
    },
    { field: 'createdAt', headerName: 'Creado', type: 'date', renderType: 'dateString', width: 100, sortable: true, filterable: true },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      actionComponent: ({ row }) => (
        <div className="flex items-center">
          <DeletePropertyButton propertyId={row.id} propertyTitle={row.title} />
          <RentMoreButton property={row} />
        </div>
      ),
    },
  ];

  const excelEndpoint = `${env.backendApiUrl}/properties/grid-rent/excel`;
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
    <>
      <DataGrid
        title={'Propiedades en Arriendo'}
        columns={columns}
        rows={mappedRows}
        totalRows={totalRows ?? mappedRows.length}
        height="70vh"
        data-test-id="rent-properties-grid"
        excelUrl={excelEndpoint}
        limit={25}
        excelFields={excelFields}
        createForm={<CreateProperty onClose={() => { router.refresh(); }} size='lg' />}
      />
    </>
  );
}
