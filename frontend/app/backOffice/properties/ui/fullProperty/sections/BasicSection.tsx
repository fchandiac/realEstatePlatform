'use client';

import { TextField } from '@/components/TextField/TextField';
import Select from '@/components/Select/Select';
import Switch from '@/components/Switch/Switch';
import { Button } from '@/components/Button/Button';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import CreatorProfile from '../components/CreatorProfile';
import { PROPERTY_STATUSES, OPERATION_TYPES } from '../utils/constants';
import type { BasicSectionProps } from '../types/property.types';

export default function BasicSection({
  property,
  propertyTypes,
  users,
  onChange,
  onSave,
  saving
}: BasicSectionProps) {
  
  const handleUpdateBasic = async () => {
    if (!onSave) return;
    
    const payload = {
      title: property.title || undefined,
      description: property.description || undefined,
      status: property.status || undefined,
      operationType: property.operationType || undefined,
      propertyTypeId: property.propertyType?.id || undefined,
      assignedAgentId: property.assignedAgent?.id || undefined,
      isFeatured: property.isFeatured || false,
    };

    await onSave();
  };

  return (
    <div className="space-y-6 w-full">
        {/* Título - ancho completo */}
        <div className="w-full">
          <TextField 
            label="Título" 
            value={property.title || ''} 
            onChange={(e) => onChange('title', e.target.value)}
            required
          />
        </div>
        
        {/* Descripción - ancho completo */}
        <div className="w-full">
          <TextField 
            label="Descripción" 
            value={property.description || ''} 
            onChange={(e) => onChange('description', e.target.value)}
            rows={3} 
          />
        </div>

        {/* Grid de campos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estado */}
          <Select
            placeholder="Estado"
            value={(property.status || '').toUpperCase()}
            onChange={(value) => onChange('status', value)}
            options={PROPERTY_STATUSES.map(status => ({
              id: status.id,
              label: status.label
            }))}
            required
          />

          {/* Tipo de Operación */}
          <Select
            placeholder="Tipo de Operación"
            value={(property.operationType || '').toUpperCase()}
            onChange={(value) => onChange('operationType', value)}
            options={OPERATION_TYPES.map(type => ({
              id: type.id,
              label: type.label
            }))}
            required
          />

          {/* Tipo de Propiedad */}
          <Select
            placeholder="Tipo de Propiedad"
            value={property.propertyType?.id || ''}
            onChange={(value) => {
              const selectedType = propertyTypes.find(type => type.id === value);
              onChange('propertyType', selectedType);
            }}
            options={propertyTypes.map(type => ({
              id: type.id,
              label: type.name
            }))}
            required
          />

          {/* Agente Asignado */}
          <Select
            placeholder="Agente Asignado"
            value={property.assignedAgent?.id || ''}
            onChange={(value) => {
              const selectedAgent = users.find(user => user.id === value);
              onChange('assignedAgent', selectedAgent || null);
            }}
            options={[
              { id: '', label: 'Ninguno' },
              ...users.map(user => ({
                id: user.id,
                label: `${user.personalInfo?.firstName || ''} ${user.personalInfo?.lastName || ''} - ${user.role === 'ADMIN' ? 'Administrador' : 'Agente'}`.trim()
              }))
            ]}
          />
        </div>

        {/* Switch para propiedad destacada */}
        <div className="flex items-center gap-2">
          <Switch
            checked={property.isFeatured || false}
            onChange={(checked) => onChange('isFeatured', checked)}
            label="Destacada"
          />
        </div>

        {/* Botón para actualizar información básica */}
        <div className="mb-2 flex items-center justify-end">
          <Button
            variant="primary"
            onClick={handleUpdateBasic}
            disabled={saving}
            aria-label="Actualizar información básica"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <CircularProgress size={16} />
                Actualizando información básica...
              </span>
            ) : (
              'Actualizar información básica'
            )}
          </Button>
        </div>

        {/* Perfil del Creador */}
        <CreatorProfile user={property.creatorUser} />
      </div>
  );
}
