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
  const [createLoading, setCreateLoading] = useState(false);
  const router = useRouter();

  const handleCreateSave = async (propertyData: any) => {
    setCreateLoading(true);
    try {
      console.log('Guardando propiedad:', propertyData);
      
      // Transform form data to CreatePropertyDto format
      const createData: CreatePropertyDto = {
        title: propertyData.title,
        description: propertyData.description,
        price: parseFloat(propertyData.price) || 0,
        currencyPrice: propertyData.currencyPrice === 1 ? 'CLP' : 'UF',
        operationType: propertyData.operationType === 1 ? 'SALE' : 'RENT',
        propertyTypeId: propertyData.propertyTypeId?.toString(),
        assignedAgentId: propertyData.assignedAgentId?.toString(),
        isPublished: propertyData.status === 1,
        isFeatured: false,
        publicDescription: propertyData.seoDescription,
        privateNotes: propertyData.internalNotes,
        location: {
          city: propertyData.city,
          region: propertyData.state,
          address: propertyData.address,
          coordinates: propertyData.location ? {
            latitude: propertyData.location.lat || propertyData.location.latitude,
            longitude: propertyData.location.lng || propertyData.location.longitude,
          } : undefined,
        },
        characteristics: {
          bedrooms: parseInt(propertyData.bedrooms) || undefined,
          bathrooms: parseInt(propertyData.bathrooms) || undefined,
          builtArea: parseInt(propertyData.builtSquareMeters) || undefined,
          totalArea: parseInt(propertyData.landSquareMeters) || undefined,
          parkingSpaces: parseInt(propertyData.parkingSpaces) || undefined,
          floors: parseInt(propertyData.floors) || undefined,
          yearBuilt: parseInt(propertyData.constructionYear) || undefined,
        },
      };

      // Create the property
      const result = await createProperty(createData);
      
      if (result.success && result.data) {
        console.log('Propiedad creada exitosamente:', result.data);
        
        // Upload multimedia files if any
        if (propertyData.multimedia && propertyData.multimedia.length > 0) {
          const multimediaResult = await uploadPropertyMultimedia(
            result.data.id,
            propertyData.multimedia,
            'IMAGE' // Default to IMAGE, could be enhanced to detect video files
          );
          
          if (multimediaResult.success) {
            console.log('Multimedia subida exitosamente:', multimediaResult.data);
          } else {
            console.warn('Error subiendo multimedia:', multimediaResult.error);
          }
        }
        
        // Refresh the page to show new property
        router.refresh();
      } else {
        throw new Error(result.error || 'Error desconocido al crear la propiedad');
      }
      
    } catch (error) {
      console.error('Error creando propiedad:', error);
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



