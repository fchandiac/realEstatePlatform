'use client';

import { TextField } from '@/components/TextField/TextField';
import type { PriceSectionProps } from '../types/property.types';

export default function PriceSection({ property, onChange }: PriceSectionProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-4">
        <TextField
          label="Precio"
          type="number"
          value={property.price?.toString() || ''}
          onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
          required
        />
        <TextField
          label="Moneda"
          value={property.currencyPrice || ''}
          onChange={(e) => onChange('currencyPrice', e.target.value)}
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
