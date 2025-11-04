'use client';

import { TextField } from '@/components/TextField/TextField';
import type { User } from '../types/property.types';

interface CreatorProfileProps {
  user?: User;
}

export default function CreatorProfile({ user }: CreatorProfileProps) {
  if (!user) {
    return (
      <div className="border-t pt-6 mt-6">
        <h4 className="text-lg font-semibold mb-4 text-foreground">Perfil del Creador</h4>
        <p className="text-muted-foreground">No hay información del creador disponible</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-6 mt-6">
      <h4 className="text-lg font-semibold mb-4 text-foreground">Perfil del Creador</h4>
      <div className="space-y-4">
        {/* Avatar y nombre */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
          {user.personalInfo?.avatarUrl && (
            <img
              src={user.personalInfo.avatarUrl}
              alt="Avatar del creador"
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          )}
          <div>
            <h5 className="font-medium text-lg">
              {user.personalInfo?.firstName} {user.personalInfo?.lastName}
            </h5>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        {/* Detalles en grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField 
            label="Nombre" 
            value={user.personalInfo?.firstName || ''} 
            onChange={() => {}} 
            readOnly 
          />
          <TextField 
            label="Apellido" 
            value={user.personalInfo?.lastName || ''} 
            onChange={() => {}} 
            readOnly 
          />
          <TextField 
            label="Email" 
            value={user.email || ''} 
            onChange={() => {}} 
            readOnly 
          />
          <TextField 
            label="Teléfono" 
            value={user.personalInfo?.phone || ''} 
            onChange={() => {}} 
            readOnly 
          />
          <TextField 
            label="Nombre de Usuario" 
            value={user.username || ''} 
            onChange={() => {}} 
            readOnly 
          />
          <TextField 
            label="ID Usuario" 
            value={user.id || ''} 
            onChange={() => {}} 
            readOnly 
          />
        </div>
      </div>
    </div>
  );
}
