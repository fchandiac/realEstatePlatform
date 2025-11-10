'use client';

import { useState } from 'react';
import PropertyFilter from './ui/PropertyFilter';
import ListProperties from './ui/ListProperties';
import { PropertyData } from '@/app/actions/portalProperties';

interface PortalClientProps {
  initialProperties: PropertyData[];
}

export default function PortalClient({ initialProperties }: PortalClientProps) {
  const [properties, setProperties] = useState<PropertyData[]>(initialProperties);

  const handleFiltersApplied = (result: any) => {
    if (result && result.data) {
      setProperties(result.data);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <PropertyFilter onFiltersApplied={handleFiltersApplied} />
      </div>

      {properties && properties.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <ListProperties properties={properties} />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-gray-500 text-lg">No se encontraron propiedades con los filtros seleccionados.</p>
        </div>
      )}
    </>
  );
}
