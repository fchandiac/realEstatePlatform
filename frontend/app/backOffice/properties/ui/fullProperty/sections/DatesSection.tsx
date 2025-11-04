'use client';

import { TextField } from '@/components/TextField/TextField';
import type { DatesSectionProps } from '../types/property.types';
import { formatDate } from '../utils/formatters';

export default function DatesSection({ property }: DatesSectionProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-4">
        <TextField
          label="Creado"
          value={formatDate(property.createdAt)}
          onChange={() => {}}
          readOnly
        />
        <TextField
          label="Actualizado"
          value={formatDate(property.updatedAt)}
          onChange={() => {}}
          readOnly
        />
        <TextField
          label="Eliminado"
          value={property.deletedAt ? formatDate(property.deletedAt) : 'No eliminado'}
          onChange={() => {}}
          readOnly
        />
        <TextField
          label="Publicado"
          value={property.publishedAt ? formatDate(property.publishedAt) : 'No publicado'}
          onChange={() => {}}
          readOnly
        />
        <TextField
          label="Fecha Publicación"
          value={property.publicationDate ? formatDate(property.publicationDate) : 'No definida'}
          onChange={() => {}}
          readOnly
        />
      </div>
    </div>
  );
}
