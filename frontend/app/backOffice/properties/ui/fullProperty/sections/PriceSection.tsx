'use client';

import { TextField } from '@/components/TextField/TextField';
import Select from '@/components/Select/Select';
import type { PriceSectionProps } from '../types/property.types';

// Opciones de moneda (coincide con CurrencyPriceEnum del backend)
const CURRENCY_OPTIONS = [
  { id: 'CLP', label: 'CLP - Peso Chileno' },
  { id: 'UF', label: 'UF - Unidad de Fomento' }
];

export default function PriceSection({ property, onChange }: PriceSectionProps) {
  // Determinar el símbolo de moneda según el tipo seleccionado
  const currencySymbol = property.currencyPrice === 'UF' ? 'UF' : '$';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-4">
        <Select
          placeholder="Moneda"
          options={CURRENCY_OPTIONS}
          value={property.currencyPrice || 'CLP'}
          onChange={(value) => onChange('currencyPrice', value as string)}
          required
        />

        <TextField
          label="Precio"
          type="currency"
          currencySymbol={currencySymbol}
          value={property.price?.toString() || ''}
          onChange={(e) => {
            // Extraer solo los números del valor formateado
            const numericValue = e.target.value.replace(/[^\d]/g, '');
            onChange('price', parseFloat(numericValue) || 0);
          }}
          required
        />

        <TextField
          label="Título SEO"
          value={property.seoTitle || ''}
          onChange={(e) => onChange('seoTitle', e.target.value)}
        />
        <TextField
          label="Descripción SEO"
          value={property.seoDescription || ''}
          onChange={(e) => onChange('seoDescription', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
