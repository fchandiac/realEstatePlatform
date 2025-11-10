'use client';

import { useState, useCallback } from 'react';
import PropertyFilter from './ui/PropertyFilter';
import ListProperties from './ui/ListProperties';
import { PropertyData, getPublishedPropertiesFiltered } from '@/app/actions/portalProperties';

interface PortalClientProps {
  initialProperties: PropertyData[];
  initialPagination?: any;
}

export default function PortalClient({ initialProperties, initialPagination }: PortalClientProps) {
  const [properties, setProperties] = useState<PropertyData[]>(initialProperties);
  const [pagination, setPagination] = useState<any>(initialPagination);
  const [currentFilters, setCurrentFilters] = useState<{
    operation?: string;
    typeProperty?: string;
    state?: string;
    city?: string;
    currency?: string;
  }>({
    operation: '',
    typeProperty: '',
    state: '',
    city: '',
    currency: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadProperties = useCallback(async (filters: typeof currentFilters, page: number = 1) => {
    setIsLoading(true);
    try {
      const result = await getPublishedPropertiesFiltered({
        currency: filters.currency,
        state: filters.state,
        city: filters.city,
        typeProperty: filters.typeProperty,
        operation: filters.operation,
        page: page,
      });

      if (result) {
        setProperties(result.data);
        setPagination(result.pagination);

        // Actualizar URL sin reload
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
          if (val) {
            params.set(key, String(val));
          }
        });
        if (page > 1) {
          params.set('page', page.toString());
        }

        window.history.replaceState(null, '', `?${params.toString()}`);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFiltersChange = useCallback((newFilters: typeof currentFilters) => {
    setCurrentFilters(newFilters);
    loadProperties(newFilters, 1); // Siempre empezar en página 1 cuando cambian filtros
  }, [loadProperties]);

  const handlePageChange = useCallback((newPage: number) => {
    loadProperties(currentFilters, newPage);
  }, [currentFilters, loadProperties]);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <PropertyFilter onFiltersChange={handleFiltersChange} isLoading={isLoading} />
      </div>

      {properties && properties.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <ListProperties
            properties={properties}
            pagination={pagination}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-gray-500 text-lg">No se encontraron propiedades con los filtros seleccionados.</p>
        </div>
      )}
    </>
  );
}
