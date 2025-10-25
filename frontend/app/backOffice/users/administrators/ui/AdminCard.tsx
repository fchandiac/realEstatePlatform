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
  <article className="border border-neutral-200 bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between">
      <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
        <div className="flex items-start gap-4 min-w-0">
          <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {admin.personalInfo?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={admin.personalInfo.avatarUrl as string} alt={`Avatar ${fullName}`} className="h-full w-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-2xl text-neutral-400">admin_panel_settings</span>
          )}
        </div>

          <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground break-words whitespace-normal">{fullName}</h3>
          <p className="text-sm text-neutral-500 break-words whitespace-normal">{admin.email}</p>
          {admin.personalInfo?.phone ? (
            <p className="text-sm text-neutral-500 break-words whitespace-normal">{admin.personalInfo.phone}</p>
          ) : null}
          </div>
        </div>

        <div className="flex items-start justify-end flex-shrink-0">
          <span className={`text-[11px] font-semibold uppercase px-3 py-1 rounded-full ${status.className}`}>
            {status.label}
          </span>
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
