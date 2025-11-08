'use client';

import { TextField } from '@/components/TextField/TextField';
import { CreatePropertyFormData } from '../types';

interface InternalNotesSectionProps {
  formData: CreatePropertyFormData;
  handleChange: (field: string, value: any) => void;
}

export default function InternalNotesSection({
  formData,
  handleChange,
}: InternalNotesSectionProps) {
  return (
    <div className="space-y-4 border-b pb-4 mb-4">
      <h2 className="text-lg font-semibold">Notas Internas</h2>
      
      <TextField
        label="Notas"
        placeholder="Notas internas sobre la propiedad (no visibles en el portal)"
        value={formData.internalNotes}
        onChange={(e) => handleChange('internalNotes', e.target.value)}
        rows={5}
      />
      
      <p className="text-sm text-gray-500 italic">
        Estas notas solo son visibles para administradores y no aparecerán en el portal público.
      </p>
    </div>
  );
}
