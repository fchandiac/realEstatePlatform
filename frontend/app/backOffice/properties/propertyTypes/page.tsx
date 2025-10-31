import React from 'react';
import PropertyTypeList from './ui/PropertyTypeList';
import { getPropertyTypes } from '@/app/actions/propertyTypes';

export default async function PropertyTypesPage() {
  const propertyTypes = await getPropertyTypes();

  return (
    <div>
      <PropertyTypeList propertyTypes={propertyTypes} />
    </div>
  );
}
