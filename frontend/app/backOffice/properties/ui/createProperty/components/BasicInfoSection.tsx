'use client';

import { TextField } from '@/components/TextField/TextField';
import Select from '@/components/Select/Select';
import { PropertyOperationType, PropertyStatus, CurrencyPriceEnum } from '../../../enums';
import { CreatePropertyFormData, PropertyTypeOption } from '../types';

interface BasicInfoSectionProps {
  formData: CreatePropertyFormData;
  handleChange: (field: string, value: any) => void;
  propertyTypes: PropertyTypeOption[];
  loadingTypes: boolean;
  formatPriceForDisplay: (price: string | number) => string;
  cleanPriceValue: (price: string) => number | undefined;
}

export default function BasicInfoSection({
  formData,
  handleChange,
  propertyTypes,
  loadingTypes,
  formatPriceForDisplay,
  cleanPriceValue,
}: BasicInfoSectionProps) {
  const propertyTypeOptions = Object.values(PropertyOperationType).map((type) => ({
    id: type as string,
    label: type.replace(/_/g, ' ').toLowerCase(),
  }));

  const statusOptions = Object.values(PropertyStatus).map((status) => ({
    id: status as string,
    label: status.replace(/_/g, ' ').toLowerCase(),
  }));

  const currencyOptions = Object.values(CurrencyPriceEnum).map((currency) => ({
    id: currency as string,
    label: currency,
  }));

  return (
    <div className="space-y-4 border-b pb-4 mb-4">
      <h2 className="text-lg font-semibold">Información Básica</h2>
      
      <TextField
        label="Título"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
      />
      
      <TextField
        label="Descripción"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        rows={4}
      />
      
      <Select
        placeholder="Tipo de Operación"
        options={propertyTypeOptions}
        value={formData.operationType}
        onChange={(value) => handleChange('operationType', value)}
        required
      />
      
      <div className="flex space-x-4">
        <div className="flex-1">
          <TextField
            label="Precio"
            value={formatPriceForDisplay(formData.price || '')}
            onChange={(e) => handleChange('price', cleanPriceValue(e.target.value))}
            type="text"
            required
          />
        </div>
        <div className="w-32">
          <Select
            placeholder="Moneda"
            options={currencyOptions}
            value={formData.currencyPrice}
            onChange={(value) => handleChange('currencyPrice', value)}
            required
          />
        </div>
      </div>
      
      <Select
        placeholder="Estado"
        options={statusOptions}
        value={formData.status}
        onChange={(value) => handleChange('status', value)}
      />
      
      <Select
        placeholder={loadingTypes ? "Cargando tipos..." : "Tipo de Propiedad"}
        options={propertyTypes.map(pt => ({
          id: pt.id,
          label: pt.label || pt.name || pt.id,
        }))}
        value={formData.propertyTypeId}
        onChange={(value) => handleChange('propertyTypeId', value)}
        required
      />
    </div>
  );
}
