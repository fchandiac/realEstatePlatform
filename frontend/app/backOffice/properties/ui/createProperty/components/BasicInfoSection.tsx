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
}

export default function BasicInfoSection({
  formData,
  handleChange,
  propertyTypes,
  loadingTypes,
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
    label: currency === 'CLP' ? 'CLP - Peso Chileno' : 'UF - Unidad de Fomento',
  }));

  // Determinar el símbolo de moneda según el tipo seleccionado
  const currencySymbol = formData.currencyPrice === 'UF' ? 'UF' : '$';

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
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <TextField
            label="Precio"
            type="currency"
            currencySymbol={currencySymbol}
            value={formData.price?.toString() || ''}
            onChange={(e) => handleChange('price', e.target.value ? parseFloat(e.target.value) : undefined)}
            required
          />
        </div>
        <div>
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
