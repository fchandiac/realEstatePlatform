'use client';

import { useState } from 'react';
import { TextField } from '@/components/TextField/TextField';
import Select from '@/components/Select/Select';
import { Button } from '@/components/Button/Button';
import { updateProperty, updatePropertyPrice } from '@/app/actions/properties';
import Alert from '@/components/Alert/Alert';
import type { PriceSectionProps } from '../types/property.types';

// Opciones de moneda (coincide con CurrencyPriceEnum del backend)
const CURRENCY_OPTIONS = [
  { id: 'CLP', label: 'CLP - Peso Chileno' },
  { id: 'UF', label: 'UF - Unidad de Fomento' }
];

export default function PriceSection({ property, onChange }: PriceSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Determinar el símbolo de moneda según el tipo seleccionado
  const currencySymbol = property.currencyPrice === 'UF' ? 'UF' : '$';

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const currencyPrice: 'CLP' | 'UF' = property.currencyPrice === 'UF' ? 'UF' : 'CLP';

      const result = await updatePropertyPrice(property.id, {
        price: property.price,
        currencyPrice,
        seoTitle: property.seoTitle,
        seoDescription: property.seoDescription,
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Precio y SEO actualizados correctamente' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Error al actualizar' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error inesperado al actualizar' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-4">
        {message && (
          <Alert
            variant={message.type}
            className="mb-4"
          >
            {message.text}
          </Alert>
        )}

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
          onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
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

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2"
          >
            {isLoading ? 'Guardando...' : 'Actualizar Precio y SEO'}
          </Button>
        </div>
      </div>
    </div>
  );
}
