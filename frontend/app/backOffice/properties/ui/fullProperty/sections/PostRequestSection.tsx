'use client';

import { TextField } from '@/components/TextField/TextField';
import type { PostRequestSectionProps } from '../types/property.types';
import { formatDate } from '../utils/formatters';

export default function PostRequestSection({ property }: PostRequestSectionProps) {
  return (
    <div className="space-y-4">
        <TextField 
          label="Mensaje" 
          value={property.postRequest?.message || ''} 
          onChange={() => {}} 
          rows={3} 
          readOnly 
        />
        <TextField 
          label="Estado de la solicitud"
          value={property.postRequest?.status || 'Estado no disponible'}
          onChange={() => {}}
          readOnly
        />
        <TextField 
          label="Nombre Contacto" 
          value={property.postRequest?.contactName || ''} 
          onChange={() => {}} 
          readOnly 
        />
        <TextField 
          label="Email Contacto" 
          value={property.postRequest?.contactEmail || ''} 
          onChange={() => {}} 
          readOnly 
        />
        <TextField 
          label="Teléfono Contacto" 
          value={property.postRequest?.contactPhone || ''} 
          onChange={() => {}} 
          readOnly 
        />
        <TextField 
          label="Fecha Solicitud" 
          value={property.postRequest?.requestedAt ? formatDate(property.postRequest.requestedAt) : 'Fecha no disponible'} 
          onChange={() => {}} 
          readOnly 
        />
      </div>
  );
}
