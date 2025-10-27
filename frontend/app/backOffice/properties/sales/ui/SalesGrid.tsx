'use client'
import React from 'react';
import SaleMoreButton from './SaleMoreButton';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataGrid from '@/components/DataGrid/DataGridWrapper';
import type { DataGridColumn } from '@/components/DataGrid/DataGrid';
import { env } from '@/lib/env';
import type { SalePropertyGridRow } from '@/app/actions/properties';
import { createProperty, type CreatePropertyDto } from '@/app/actions/properties';
import { uploadPropertyMultimedia } from '@/app/actions/multimedia';
import CreateProperty from '../../ui/CreateProperty';
import { useAlert } from '@/app/contexts/AlertContext';

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
  const alert = useAlert();
  const [createLoading, setCreateLoading] = useState(false);
  const router = useRouter();

  const handleCreateSave = async (propertyData: any) => {
    setCreateLoading(true);
    try {
      // Validate required fields before sending
      if (!propertyData.status) {
        throw new Error('El estado de publicación es obligatorio');
      }
      if (!propertyData.operationType) {
        throw new Error('El tipo de operación es obligatorio');
      }
      if (!propertyData.state) {
        throw new Error('La región es obligatoria');
      }
      if (!propertyData.city) {
        throw new Error('La comuna es obligatoria');
      }
      
      // Professional helper functions for data type extraction
      const extractNumberId = (value: any): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return parseInt(value, 10);
        if (value && typeof value === 'object' && value.id) {
          return typeof value.id === 'number' ? value.id : parseInt(value.id, 10);
        }
        return 1; // Default fallback
      };

      const extractStringId = (value: any): string | undefined => {
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        if (value && typeof value === 'object' && value.id) {
          return value.id.toString();
        }
        return undefined;
      };
      
      // Professional data transformation with proper type handling
      const createData: CreatePropertyDto = {
        title: propertyData.title,
        description: propertyData.description,
        
        // STATUS & OPERATION: Send as numbers, backend @Transform converts to enum strings
        status: extractNumberId(propertyData.status),
        operationType: extractNumberId(propertyData.operationType),
        
        // IDs: Extract string IDs
        propertyTypeId: extractStringId(propertyData.propertyTypeId),
        assignedAgentId: extractStringId(propertyData.assignedAgentId),

        // LOCATION: Send as objects, backend @Transform extracts IDs
        state: propertyData.state,
        city: propertyData.city,
        address: propertyData.address,
        location: propertyData.location ? {
          lat: propertyData.location.lat || propertyData.location.latitude,
          lng: propertyData.location.lng || propertyData.location.longitude,
          address: propertyData.address,
        } : undefined,

        // Características
        bedrooms: propertyData.bedrooms !== undefined && propertyData.bedrooms !== null ? parseInt(propertyData.bedrooms) : undefined,
        bathrooms: propertyData.bathrooms !== undefined && propertyData.bathrooms !== null ? parseInt(propertyData.bathrooms) : undefined,
        parkingSpaces: propertyData.parkingSpaces !== undefined && propertyData.parkingSpaces !== null ? parseInt(propertyData.parkingSpaces) : undefined,
        floors: propertyData.floors !== undefined && propertyData.floors !== null ? parseInt(propertyData.floors) : undefined,
        builtSquareMeters: propertyData.builtSquareMeters !== undefined && propertyData.builtSquareMeters !== null ? parseInt(propertyData.builtSquareMeters) : undefined,
        landSquareMeters: propertyData.landSquareMeters !== undefined && propertyData.landSquareMeters !== null ? parseInt(propertyData.landSquareMeters) : undefined,
        constructionYear: propertyData.constructionYear !== undefined && propertyData.constructionYear !== null ? parseInt(propertyData.constructionYear) : undefined,

        // PRICE: String and number for currency
        price: propertyData.price?.toString(),
        currencyPrice: extractNumberId(propertyData.currencyPrice),

        // SEO
        seoTitle: propertyData.seoTitle,
        seoDescription: propertyData.seoDescription,

        // Multimedia
        multimedia: propertyData.multimedia,

        // Internos
        internalNotes: propertyData.internalNotes,
      };

      console.log('Complete createData:', createData);

      // Create the property
      const result = await createProperty(createData);
      
      if (result.success && result.data) {
        // Refresh the page to show new property
        router.refresh();
      } else {
        throw new Error(result.error || 'Error desconocido al crear la propiedad');
      }
      
    } catch (error) {
      alert.error('Error al crear la propiedad');
      // Re-throw the error to keep the dialog open and show error message
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  const columns: DataGridColumn[] = [
    { field: 'title', headerName: 'Título', flex: 1.6, minWidth: 220, sortable: true, filterable: true },
    { field: 'status', headerName: 'Estado', width: 140, sortable: true, filterable: true },
    { field: 'operationType', headerName: 'Operación', width: 130, hide: true, sortable: true, filterable: true },
    { field: 'typeName', headerName: 'Tipo', width: 160, sortable: true, filterable: true },
    { field: 'assignedAgentName', headerName: 'Agente', width: 180, sortable: true, filterable: true },
    { field: 'city', headerName: 'Ciudad', width: 150, sortable: true, filterable: true },
    { field: 'state', headerName: 'Región', width: 140, hide: true, sortable: true, filterable: true },
    { field: 'price', headerName: 'Precio', type: 'number', renderType: 'currency', width: 140, align: 'right', headerAlign: 'right', sortable: true, filterable: true },
    { field: 'createdAt', headerName: 'Creado', type: 'date', renderType: 'dateString', width: 100, sortable: true, filterable: true },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      actionComponent: ({ row }) => <SaleMoreButton property={row} />,
    },
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
    <>
      <DataGrid
        title={'Propiedades en Venta'}
        columns={columns}
        rows={mappedRows}
        totalRows={totalRows ?? mappedRows.length}
        height="70vh"
        data-test-id="sales-properties-grid"
        excelUrl={excelEndpoint}
        limit={25}
        excelFields={excelFields}
        createForm={
          <CreateProperty
            open={true}
            onClose={() => {}}
            onSave={handleCreateSave}
            size="lg"
          />
        }
      
   
      />
    </>
  );
}



