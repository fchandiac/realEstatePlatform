'use client';

import { TextField } from '@/components/TextField/TextField';
import { CreatePropertyFormData } from '../types';

interface SeoSectionProps {
  formData: CreatePropertyFormData;
  handleChange: (field: string, value: any) => void;
}

export default function SeoSection({
  formData,
  handleChange,
}: SeoSectionProps) {
  return (
    <div className="space-y-4 border-b pb-4 mb-4">
      <h2 className="text-lg font-semibold">SEO</h2>
      
      <TextField
        label="Título SEO"
        placeholder="Título optimizado para buscadores"
        value={formData.seoTitle}
        onChange={(e) => handleChange('seoTitle', e.target.value)}
      />

      <TextField
        label="Descripción SEO"
        placeholder="Descripción breve para buscadores"
        value={formData.seoDescription}
        onChange={(e) => handleChange('seoDescription', e.target.value)}
        rows={3}
      />
    </div>
  );
}
