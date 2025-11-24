'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAlert } from '@/app/hooks/useAlert';
import Select from '@/components/Select/Select';
import { Button } from '@/components/Button/Button';
import { FilterRentPropertiesDto } from '@/app/actions/rentProperties';

interface PropertyFilterRentProps {
  onFiltersChange?: (filters: FilterRentPropertiesDto) => void;
  className?: string;
}

export default function PropertyFilterRent({
  onFiltersChange,
  className = ''
}: PropertyFilterRentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterRentPropertiesDto>({
    filters: {
      typeProperty: searchParams.get('typeProperty') || '',
      state: searchParams.get('state') || '',
      city: searchParams.get('city') || '',
      currency: searchParams.get('currency') || 'CLP',
    },
    sort: searchParams.get('sort') || 'created_desc',
    page: 1,
    limit: 9,
  });

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterRentPropertiesDto) => {
    const params = new URLSearchParams();

    if (newFilters.filters) {
      if (newFilters.filters.typeProperty) {
        params.set('typeProperty', newFilters.filters.typeProperty);
      }
      if (newFilters.filters.state) {
        params.set('state', newFilters.filters.state);
      }
      if (newFilters.filters.city) {
        params.set('city', newFilters.filters.city);
      }
      if (newFilters.filters.currency) {
        params.set('currency', newFilters.filters.currency);
      }
    }

    if (newFilters.sort) {
      params.set('sort', newFilters.sort);
    }

    // Always reset to page 1 when filters change
    params.set('page', '1');

    const newUrl = `/portal/properties/rent?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [router]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters };

    if (key === 'sort') {
      newFilters.sort = value;
    } else {
      // It's a filter field
      if (!newFilters.filters) {
        newFilters.filters = {};
      }
      (newFilters.filters as any)[key] = value;
    }

    // Reset page to 1 when filters change
    newFilters.page = 1;

    setFilters(newFilters);
    updateURL(newFilters);

    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    const clearedFilters: FilterRentPropertiesDto = {
      filters: {
        currency: 'CLP',
      },
      sort: 'created_desc',
      page: 1,
      limit: 9,
    };

    setFilters(clearedFilters);
    updateURL(clearedFilters);

    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }

    showAlert({
      message: 'Filtros limpiados',
      type: 'info',
      duration: 2000,
    });
  };

  // Property types options
  const propertyTypes = [
    { id: '', label: 'Todos los tipos' },
    { id: 'Casa', label: 'Casa' },
    { id: 'Departamento', label: 'Departamento' },
    { id: 'Oficina', label: 'Oficina' },
    { id: 'Local comercial', label: 'Local comercial' },
    { id: 'Bodega', label: 'Bodega' },
    { id: 'Terreno', label: 'Terreno' },
  ];

  // Regions options
  const regions = [
    { id: '', label: 'Todas las regiones' },
    { id: 'Región Metropolitana', label: 'Región Metropolitana' },
    { id: 'Valparaíso', label: 'Valparaíso' },
    { id: 'Biobío', label: 'Biobío' },
    // Add more regions as needed
  ];

  // Communes options (filtered by selected region)
  const getCommunesForRegion = (region: string) => {
    const communesByRegion: Record<string, { id: string; label: string }[]> = {
      'Región Metropolitana': [
        { id: '', label: 'Todas las comunas' },
        { id: 'Santiago', label: 'Santiago' },
        { id: 'Providencia', label: 'Providencia' },
        { id: 'Las Condes', label: 'Las Condes' },
        { id: 'Vitacura', label: 'Vitacura' },
        { id: 'Ñuñoa', label: 'Ñuñoa' },
        { id: 'La Reina', label: 'La Reina' },
        { id: 'Macul', label: 'Macul' },
        { id: 'Peñalolén', label: 'Peñalolén' },
        { id: 'La Florida', label: 'La Florida' },
        { id: 'Puente Alto', label: 'Puente Alto' },
        { id: 'Maipú', label: 'Maipú' },
        { id: 'La Cisterna', label: 'La Cisterna' },
        { id: 'San Miguel', label: 'San Miguel' },
        { id: 'Quinta Normal', label: 'Quinta Normal' },
        { id: 'Recoleta', label: 'Recoleta' },
        { id: 'Independencia', label: 'Independencia' },
        { id: 'Conchalí', label: 'Conchalí' },
        { id: 'Huechuraba', label: 'Huechuraba' },
        { id: 'Renca', label: 'Renca' },
        { id: 'Cerro Navia', label: 'Cerro Navia' },
        { id: 'Lo Prado', label: 'Lo Prado' },
        { id: 'Pudahuel', label: 'Pudahuel' },
        { id: 'Quilicura', label: 'Quilicura' },
        { id: 'Colina', label: 'Colina' },
        { id: 'Lampa', label: 'Lampa' },
        { id: 'Tiltil', label: 'Tiltil' },
        { id: 'Buin', label: 'Buin' },
        { id: 'Calera de Tango', label: 'Calera de Tango' },
        { id: 'Paine', label: 'Paine' },
        { id: 'Peñaflor', label: 'Peñaflor' },
        { id: 'Talagante', label: 'Talagante' },
        { id: 'El Monte', label: 'El Monte' },
        { id: 'Isla de Maipo', label: 'Isla de Maipo' },
        { id: 'Padre Hurtado', label: 'Padre Hurtado' },
        { id: 'Alhué', label: 'Alhué' },
        { id: 'Curacaví', label: 'Curacaví' },
        { id: 'María Pinto', label: 'María Pinto' },
        { id: 'Melipilla', label: 'Melipilla' },
        { id: 'San Pedro', label: 'San Pedro' },
      ],
      'Valparaíso': [
        { id: '', label: 'Todas las comunas' },
        { id: 'Valparaíso', label: 'Valparaíso' },
        { id: 'Viña del Mar', label: 'Viña del Mar' },
        { id: 'Quilpué', label: 'Quilpué' },
        { id: 'Villa Alemana', label: 'Villa Alemana' },
        { id: 'Concón', label: 'Concón' },
        { id: 'Quintero', label: 'Quintero' },
        { id: 'Puchuncaví', label: 'Puchuncaví' },
        { id: 'Casablanca', label: 'Casablanca' },
        { id: 'Juan Fernández', label: 'Juan Fernández' },
        { id: 'San Antonio', label: 'San Antonio' },
        { id: 'Cartagena', label: 'Cartagena' },
        { id: 'El Tabo', label: 'El Tabo' },
        { id: 'El Quisco', label: 'El Quisco' },
        { id: 'Algarrobo', label: 'Algarrobo' },
        { id: 'Santo Domingo', label: 'Santo Domingo' },
        { id: 'Limache', label: 'Limache' },
        { id: 'Olmué', label: 'Olmué' },
        { id: 'Rinconada', label: 'Rinconada' },
      ],
      'Biobío': [
        { id: '', label: 'Todas las comunas' },
        { id: 'Concepción', label: 'Concepción' },
        { id: 'Talcahuano', label: 'Talcahuano' },
        { id: 'San Pedro de la Paz', label: 'San Pedro de la Paz' },
        { id: 'Penco', label: 'Penco' },
        { id: 'Tomé', label: 'Tomé' },
        { id: 'Hualpén', label: 'Hualpén' },
        { id: 'Chiguayante', label: 'Chiguayante' },
        { id: 'Coronel', label: 'Coronel' },
        { id: 'Lota', label: 'Lota' },
        { id: 'Arauco', label: 'Arauco' },
        { id: 'Cañete', label: 'Cañete' },
        { id: 'Contulmo', label: 'Contulmo' },
        { id: 'Curanilahue', label: 'Curanilahue' },
        { id: 'Lebu', label: 'Lebu' },
        { id: 'Los Álamos', label: 'Los Álamos' },
        { id: 'Tirúa', label: 'Tirúa' },
        { id: 'Los Ángeles', label: 'Los Ángeles' },
        { id: 'Antuco', label: 'Antuco' },
        { id: 'Cabrero', label: 'Cabrero' },
        { id: 'Laja', label: 'Laja' },
        { id: 'Mulchén', label: 'Mulchén' },
        { id: 'Nacimiento', label: 'Nacimiento' },
        { id: 'Negrete', label: 'Negrete' },
        { id: 'Quilaco', label: 'Quilaco' },
        { id: 'Quilleco', label: 'Quilleco' },
        { id: 'San Rosendo', label: 'San Rosendo' },
        { id: 'Santa Bárbara', label: 'Santa Bárbara' },
        { id: 'Tucapel', label: 'Tucapel' },
        { id: 'Yumbel', label: 'Yumbel' },
        { id: 'Alto Biobío', label: 'Alto Biobío' },
        { id: 'Chillán', label: 'Chillán' },
        { id: 'Bulnes', label: 'Bulnes' },
        { id: 'Cobquecura', label: 'Cobquecura' },
        { id: 'Coelemu', label: 'Coelemu' },
        { id: 'Coihueco', label: 'Coihueco' },
        { id: 'Chillán Viejo', label: 'Chillán Viejo' },
        { id: 'El Carmen', label: 'El Carmen' },
        { id: 'Ninhue', label: 'Ninhue' },
        { id: 'Ñiquén', label: 'Ñiquén' },
        { id: 'Pemuco', label: 'Pemuco' },
        { id: 'Pinto', label: 'Pinto' },
        { id: 'Portezuelo', label: 'Portezuelo' },
        { id: 'Quillón', label: 'Quillón' },
        { id: 'Quirihue', label: 'Quirihue' },
        { id: 'Ránquil', label: 'Ránquil' },
        { id: 'San Carlos', label: 'San Carlos' },
        { id: 'San Fabián', label: 'San Fabián' },
        { id: 'San Ignacio', label: 'San Ignacio' },
        { id: 'San Nicolás', label: 'San Nicolás' },
        { id: 'Treguaco', label: 'Treguaco' },
        { id: 'Yungay', label: 'Yungay' },
      ],
    };

    return communesByRegion[region] || [{ id: '', label: 'Selecciona una región primero' }];
  };

  // Sort options
  const sortOptions = [
    { id: 'created_desc', label: 'Más recientes' },
    { id: 'created_asc', label: 'Más antiguos' },
    { id: 'price_asc', label: 'Precio: menor a mayor' },
    { id: 'price_desc', label: 'Precio: mayor a menor' },
    { id: 'title_asc', label: 'Título: A-Z' },
    { id: 'title_desc', label: 'Título: Z-A' },
  ];

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros de Propiedades en Arriendo</h3>
        <Button
          variant="text"
          onClick={handleClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Limpiar filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Property Type */}
        <Select
          placeholder="Tipo de propiedad"
          value={filters.filters?.typeProperty || ''}
          onChange={(value) => handleFilterChange('typeProperty', value)}
          options={propertyTypes}
        />

        {/* Region */}
        <Select
          placeholder="Región"
          value={filters.filters?.state || ''}
          onChange={(value) => {
            handleFilterChange('state', value);
            // Clear commune when region changes
            handleFilterChange('city', '');
          }}
          options={regions}
        />

        {/* Commune */}
        <Select
          placeholder="Comuna"
          value={filters.filters?.city || ''}
          onChange={(value) => handleFilterChange('city', value)}
          options={getCommunesForRegion(filters.filters?.state || '')}
        />

        {/* Sort */}
        <Select
          placeholder="Ordenar por"
          value={filters.sort || 'created_desc'}
          onChange={(value) => handleFilterChange('sort', value)}
          options={sortOptions}
        />

        {/* Currency */}
        <Select
          placeholder="Moneda"
          value={filters.filters?.currency || 'CLP'}
          onChange={(value) => handleFilterChange('currency', value)}
          options={[
            { id: 'CLP', label: 'CLP' },
            { id: 'UF', label: 'UF' },
          ]}
        />
      </div>
    </div>
  );
}