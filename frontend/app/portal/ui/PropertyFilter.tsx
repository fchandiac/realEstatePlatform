'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Select, { type Option as SelectOption } from '@/components/Select/Select';
import AutoComplete, { type Option as AutoCompleteOption } from '@/components/AutoComplete/AutoComplete';
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
  onFiltersApplied?: (filters: any) => void;
}

export default function PropertyFilter({ initialFilters = {}, onFiltersApplied }: PropertyFilterProps) {
  const currentParams = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [regions, setRegions] = useState<AutoCompleteOption[]>([]);
  const [communes, setCommunes] = useState<AutoCompleteOption[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [originalRegions, setOriginalRegions] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      setIsLoadingRegions(true);
      try {
        const fetchedRegions = await getRegions();
        setOriginalRegions(fetchedRegions);
        setRegions(fetchedRegions.map((r, index) => ({ id: index + 1, label: r.name })));
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
          const selectedRegionIndex = parseInt(filters.state) - 1;
          const originalRegion = originalRegions[selectedRegionIndex];
          
          if (originalRegion) {
            const fetchedCommunes = await getCommunesByRegion(originalRegion.id);
            setCommunes(fetchedCommunes.map((c, index) => ({ id: index + 1, label: c.name })));
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

    const params = new URLSearchParams(currentParams.toString());
    
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        params.set(key, String(val));
      } else {
        params.delete(key);
      }
    });

    // Actualizar URL sin reload
    window.history.replaceState(null, '', `?${params.toString()}`);
    
    // Cargar datos directamente en el Client Component - MÁS RÁPIDO
    setIsLoadingProperties(true);
    (async () => {
      try {
        const result = await getPublishedPropertiesFiltered({
          currency: newFilters.currency,
          state: newFilters.state,
          city: newFilters.city,
          typeProperty: newFilters.typeProperty,
          operation: newFilters.operation,
          page: 1,
        });
        
        if (result && onFiltersApplied) {
          onFiltersApplied(result);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoadingProperties(false);
      }
    })();
  }, [filters, currentParams, onFiltersApplied]);

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
      <div className={`p-4 bg-white rounded-lg shadow-md transition-opacity duration-200 ${isLoadingProperties ? 'opacity-70' : 'opacity-100'}`}>
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
            <AutoComplete
              label="Región"
              placeholder="Seleccione Región"
              options={regions}
              value={regions.find(option => option.id.toString() === filters.state) || null}
              onChange={(option) => handleFilterChange('state', option?.id.toString() ?? null)}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.id}
            />
          </div>

          <div className="w-full">
            <AutoComplete
              label="Comuna"
              placeholder="Seleccione Comuna"
              options={communes}
              value={communes.find(option => option.id.toString() === filters.city) || null}
              onChange={(option) => handleFilterChange('city', option?.id.toString() ?? null)}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.id}
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
