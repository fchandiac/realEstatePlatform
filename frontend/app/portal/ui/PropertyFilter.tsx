'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Select, { type Option as SelectOption } from '@/components/Select/Select';
import AutoComplete, { type Option as AutoCompleteOption } from '@/components/AutoComplete/AutoComplete';
import { getRegions, getCommunesByRegion } from '@/app/actions/locations';

// Tipos de datos que recibirá el componente
interface PropertyFilterProps {
  initialFilters?: {
    operation?: string;
    typeProperty?: string;
    state?: string;
    city?: string;
    currency?: string;
  };
}

export default function PropertyFilter({ initialFilters = {} }: PropertyFilterProps) {
  const currentParams = useSearchParams();

  const [filters, setFilters] = useState(initialFilters);
  const [regions, setRegions] = useState<AutoCompleteOption[]>([]);
  const [communes, setCommunes] = useState<AutoCompleteOption[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);

  // Mantenemos una referencia a las regiones originales para mapear IDs
  const [originalRegions, setOriginalRegions] = useState<{id: string, name: string}[]>([]);



  // Efecto para cargar las regiones al montar el componente
  useEffect(() => {
    const fetchRegions = async () => {
      setIsLoadingRegions(true);
      try {
        const fetchedRegions = await getRegions();
        setOriginalRegions(fetchedRegions); // Guardamos las regiones originales
        // Mapear a { id: number, label: string } para AutoComplete
        setRegions(fetchedRegions.map((r, index) => ({ id: index + 1, label: r.name })));
      } catch (error) {
        console.error('Error loading regions:', error);
      } finally {
        setIsLoadingRegions(false);
      }
    };
    fetchRegions();
  }, []);

  // Efecto para cargar las comunas cuando cambia la región
  useEffect(() => {
    const fetchCommunes = async () => {
      if (filters.state && originalRegions.length > 0) {
        setIsLoadingCommunes(true);
        try {
          // Encontrar la región seleccionada por su índice
          const selectedRegionIndex = parseInt(filters.state) - 1;
          const originalRegion = originalRegions[selectedRegionIndex];
          
          if (originalRegion) {
            const fetchedCommunes = await getCommunesByRegion(originalRegion.id);
            // Mapear a { id: number, label: string } para AutoComplete
            setCommunes(fetchedCommunes.map((c, index) => ({ id: index + 1, label: c.name })));
          }
        } catch (error) {
          console.error('Error loading communes:', error);
        } finally {
          setIsLoadingCommunes(false);
        }
      } else {
        setCommunes([]); // Limpiar comunas si no hay región
      }
    };
    fetchCommunes();
  }, [filters.state, originalRegions]);

  // Función para actualizar solo la URL sin hacer redirects
  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(currentParams);
    
    // Actualizar parámetros en la URL
    if (newFilters) {
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
    }

    // Solo actualizar la URL en el navegador sin hacer redirect
    const newUrl = `/portal?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  const handleFilterChange = (filterName: string, value: string | number | null) => {
    const newFilters = { ...filters, [filterName]: value || '' };
    // Si cambiamos la región, reseteamos la comuna
    if (filterName === 'state') {
      newFilters.city = '';
    }
    setFilters(newFilters);
    // Actualizar URL automáticamente al cambiar cualquier filtro
    updateURL(newFilters);
  };

  const operationOptions: SelectOption[] = [
    { id: 'Arriendo', label: 'Arriendo' },
    { id: 'Venta', label: 'Venta' },
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
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end justify-center">
          {/* 1. Operación */}
          <div className="w-full">
            <Select
              placeholder="Arriendo/Venta"
              options={operationOptions}
              value={filters.operation}
              onChange={(value) => handleFilterChange('operation', value)}
            />
          </div>

          {/* 2. Tipo de Propiedad */}
          <div className="w-full">
            <Select
              placeholder="Tipo de Propiedad"
              options={propertyTypeOptions}
              value={filters.typeProperty}
              onChange={(value) => handleFilterChange('typeProperty', value)}
            />
          </div>

          {/* 3. Región (State) */}
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

          {/* 4. Comuna (City) */}
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

          {/* 5. Pesos/UF */}
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