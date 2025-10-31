'use client';

import React, { useEffect, useState } from 'react';
import PropertyTypeList from './ui/PropertyTypeList';
import { getPropertyTypes, type PropertyType } from '@/app/actions/propertyTypes';
import DotProgress from '@/components/DotProgress/DotProgress';

export default function PropertyTypesPage() {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const data = await getPropertyTypes();
        console.log('Property Types:', data);
        setPropertyTypes(data);
      } catch (error) {
        console.error('Error fetching property types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <DotProgress />
      </div>
    );
  }

  return (
    <div>
      <PropertyTypeList propertyTypes={propertyTypes} />
    </div>
  );
}
