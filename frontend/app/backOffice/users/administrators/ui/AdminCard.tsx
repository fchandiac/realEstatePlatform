import React from 'react';
import { AdministratorType, AdministratorStatus } from './types';
import IconButton from '@/components/Button/IconButton';

export interface AdminCardProps {
  admin: AdministratorType;
  onEdit?: (admin: AdministratorType) => void;
}

const STATUS_STYLES: Record<AdministratorStatus, { className: string; label: string }> = {
  ACTIVE: { className: 'bg-emerald-600 text-white', label: 'ACTIVO' },
  INVITED: { className: 'bg-sky-600 text-white', label: 'INVITADO' },
  INACTIVE: { className: 'bg-neutral-500 text-white', label: 'INACTIVO' },
  SUSPENDED: { className: 'bg-rose-600 text-white', label: 'SUSPENDIDO' },
};

const AdminCard: React.FC<AdminCardProps> = ({ admin, onEdit }) => {
  const fullName = `${admin.personalInfo?.firstName ?? ''} ${admin.personalInfo?.lastName ?? ''}`.trim() || admin.username || admin.email;

  const status = STATUS_STYLES[admin.status as AdministratorStatus] ?? {
    className: 'bg-neutral-500 text-white',
    label: (admin.status ?? 'DESCONOCIDO').toString().toUpperCase(),
  };

  return (
  <article className="border border-neutral-200 bg-white rounded-lg shadow-sm p-2 flex flex-col justify-between">
      <div className="grid grid-cols-[30%_70%] gap-4 items-center">
        {/* Columna del Avatar */}
        <div className="flex justify-center items-center">
          <div className="relative flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-neutral-100 border-4 border-secondary flex items-center justify-center overflow-hidden">
              {admin.personalInfo?.avatarUrl ? (
                // eslint-disable-next-line @next/next/next/no-img-element
                <img src={admin.personalInfo.avatarUrl as string} alt={`Avatar ${fullName}`} className="h-full w-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '4rem' }}>person</span>
              )}
            </div>
            {!admin.personalInfo?.avatarUrl && (
              <IconButton
                icon="add"
                variant="primary"
                size="xs"
                className="absolute bottom-0 right-2 z-10"
                aria-label="Agregar avatar"
                title="Agregar avatar"
                onClick={() => {}}
              />
            )}
          </div>
        </div>

        {/* Columna de Información */}
        <div className="flex flex-col gap-2">
          {/* Status alineado a la derecha */}
          <div className="flex justify-end mr-4">
            <span className={`text-[11px] font-semibold uppercase px-3 py-2 rounded-full ${status.className}`}>
              {status.label}
            </span>
          </div>

          {/* Nombre */}
          <h3 className="text-lg font-semibold text-foreground break-words whitespace-normal">{fullName}</h3>

          {/* Nombre de usuario */}
          <p className="text-sm text-neutral-600 break-words whitespace-normal">@{admin.username}</p>

          {/* Correo con icono */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-500" style={{ fontSize: '1rem' }}>email</span>
            <p className="text-sm text-neutral-500 break-words whitespace-normal">{admin.email}</p>
          </div>

          {/* Teléfono con icono */}
          {admin.personalInfo?.phone && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-neutral-500" style={{ fontSize: '1rem' }}>phone</span>
              <p className="text-sm text-neutral-500 break-words whitespace-normal">{admin.personalInfo.phone}</p>
            </div>
          )}
        </div>
      </div>

  <div className="flex justify-end gap-2 mt-3">
       
          <IconButton
            icon="edit"
            variant="text"
            size="sm"
            aria-label={`Editar ${fullName}`}
            title="Editar"
            onClick={() => onEdit?.(admin)}
          />



          <IconButton
            icon="delete"
            variant="text"
            size="sm"
            aria-label={`Eliminar ${fullName}`}
            title="Eliminar"
            onClick={() => {}}
          />
   
      </div>
    </article>
  );
};

export default AdminCard;
