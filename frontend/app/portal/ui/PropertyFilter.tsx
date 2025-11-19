'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Select, { type Option as SelectOption } from '@/components/Select/Select';
import { getRegions, getCommunesByRegion } from '@/app/actions/locations';
import { getPublishedPropertiesFiltered } from '@/app/actions/portalProperties';

interface PropertyFilterProps {
  initialFilters?: {
    operation?: string;
    typeProperty?: string;
    state?: string;
    city?: string;
    currency?: string;
  };
  onFiltersChange?: (filters: {
    operation?: string;
    typeProperty?: string;
    state?: string;
    city?: string;
    currency?: string;
  }) => void;
  isLoading?: boolean;
}

export default function PropertyFilter({ initialFilters = {}, onFiltersChange, isLoading = false }: PropertyFilterProps) {
  const currentParams = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [regions, setRegions] = useState<SelectOption[]>([]);
  const [communes, setCommunes] = useState<SelectOption[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);
  const [originalRegions, setOriginalRegions] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      setIsLoadingRegions(true);
      try {
        const fetchedRegions = await getRegions();
        setOriginalRegions(fetchedRegions);
        // Store regions with their actual names as IDs for filtering
        setRegions(fetchedRegions.map((r) => ({ id: r.name, label: r.name })));
      } catch (error) {
        console.error('Error loading regions:', error);
      } finally {
        setIsLoadingRegions(false);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchCommunes = async () => {
      if (filters.state && originalRegions.length > 0) {
        setIsLoadingCommunes(true);
        try {
          // filters.state now contains the actual region name
          const originalRegion = originalRegions.find(r => r.name === filters.state);
          
          if (originalRegion) {
            const fetchedCommunes = await getCommunesByRegion(originalRegion.id);
            setCommunes(fetchedCommunes.map((c) => ({ id: c.name, label: c.name })));
          }
        } catch (error) {
          console.error('Error loading communes:', error);
        } finally {
          setIsLoadingCommunes(false);
        }
      } else {
        setCommunes([]);
      }
    };
    fetchCommunes();
  }, [filters.state, originalRegions]);

  const handleFilterChange = useCallback((filterName: string, value: string | number | null) => {
    const newFilters = { ...filters, [filterName]: value || '' };

    if (filterName === 'state') {
      newFilters.city = '';
    }

    setFilters(newFilters);

    // Informar al componente padre sobre el cambio de filtros
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  }, [filters, onFiltersChange]);

  const operationOptions: SelectOption[] = [
    { id: 'rent', label: 'Arriendo' },
    { id: 'sale', label: 'Venta' },
  ];

  const propertyTypeOptions: SelectOption[] = [
    { id: 'Casa', label: 'Casa' },
    { id: 'Departamento', label: 'Departamento' },
    { id: 'Terreno', label: 'Terreno' },
    { id: 'Local Comercial', label: 'Local Comercial' },
    { id: 'Oficina', label: 'Oficina' },
  ];

  const currencyOptions: SelectOption[] = [
    { id: 'CLP', label: 'Pesos' },
    { id: 'UF', label: 'UF' },
    { id: 'all', label: 'Ambos' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className={`p-4 bg-white rounded-lg shadow-md transition-opacity duration-200 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="w-full">
            <Select
              placeholder="Arriendo/Venta"
              options={operationOptions}
              value={filters.operation}
              onChange={(value) => handleFilterChange('operation', value)}
            />
          </div>

          <div className="w-full">
            <Select
              placeholder="Tipo de Propiedad"
              options={propertyTypeOptions}
              value={filters.typeProperty}
              onChange={(value) => handleFilterChange('typeProperty', value)}
            />
          </div>

          <div className="w-full">
            <Select
              placeholder="Región"
              options={regions}
              value={filters.state}
              onChange={(value) => handleFilterChange('state', value)}
            />
          </div>

          <div className="w-full">
            <Select
              placeholder="Comuna"
              options={communes}
              value={filters.city}
              onChange={(value) => handleFilterChange('city', value)}
            />
          </div>

          <div className="w-full">
            <Select
              placeholder="Pesos/UF"
              options={currencyOptions}
              value={filters.currency}
              onChange={(value) => handleFilterChange('currency', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
