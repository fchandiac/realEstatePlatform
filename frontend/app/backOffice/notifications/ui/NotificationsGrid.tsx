'use client';
import React, { useState } from 'react';
import DataGrid from '@/components/DataGrid/DataGridWrapper';
import type { DataGridColumn } from '@/components/DataGrid/DataGrid';
import MarkAsReadButton from '@/app/backOffice/notifications/ui/MarkAsReadButton';
import DetailNotificationDialog from '@/app/backOffice/notifications/ui/DetailNotificationDialog';
import DeleteNotificationDialog from '@/app/backOffice/notifications/ui/DeleteNotificationDialog';
import IconButton from '@/components/IconButton/IconButton';
import { useAlert } from '@/app/contexts/AlertContext';

type NotificationRow = {
  id: string;
  message?: string;
  type?: string;
  status?: string;
  senderName?: string;
  senderType?: string;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

type NotificationsGridProps = {
  rows: NotificationRow[];
  totalRows?: number;
  title?: string;
};

export default function NotificationsGrid({ rows, totalRows, title }: NotificationsGridProps) {
  const alert = useAlert();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [selectedNotificationMessage, setSelectedNotificationMessage] = useState<string>('');

  const handleViewDetails = (notificationId: string, message: string) => {
    setSelectedNotificationId(notificationId);
    setSelectedNotificationMessage(message);
    setDetailDialogOpen(true);
  };

  const handleDelete = (notificationId: string, message: string) => {
    setSelectedNotificationId(notificationId);
    setSelectedNotificationMessage(message);
    setDeleteDialogOpen(true);
  };

  const handleRefresh = () => {
    // Refresh the page to reload notifications
    window.location.reload();
  };

  const columns: DataGridColumn[] = [
    {
      field: 'message',
      headerName: 'Mensaje',
      flex: 2,
      minWidth: 300,
      sortable: true,
      filterable: true,
      renderCell: ({ value }) => (
        <div className="line-clamp-2 text-sm">{value}</div>
      )
    },
    {
      field: 'type',
      headerName: 'Tipo',
      width: 150,
      sortable: true,
      filterable: true,
      renderCell: ({ value }) => {
        const typeLabels = {
          'INTEREST': 'Interés',
          'CONTACT': 'Contacto',
          'PAYMENT_RECEIPT': 'Recibo de Pago',
          'PAYMENT_OVERDUE': 'Pago Vencido',
          'PUBLICATION_STATUS_CHANGE': 'Cambio de Estado',
          'CONTRACT_STATUS_CHANGE': 'Cambio de Contrato',
          'PROPERTY_AGENT_ASSIGNMENT': 'Asignación de Agente'
        };
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {typeLabels[value as keyof typeof typeLabels] || value}
          </span>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 120,
      sortable: true,
      filterable: true,
      renderCell: ({ value }) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'SEND' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {value === 'SEND' ? 'Enviado' : 'Leído'}
        </span>
      )
    },
    {
      field: 'senderName',
      headerName: 'Remitente',
      width: 180,
      sortable: true,
      filterable: true
    },
    {
      field: 'senderType',
      headerName: 'Tipo Remitente',
      width: 140,
      sortable: true,
      filterable: true,
      renderCell: ({ value }) => {
        const typeLabels = {
          'USER': 'Usuario',
          'SYSTEM': 'Sistema',
          'ANONYMOUS': 'Anónimo'
        };
        return typeLabels[value as keyof typeof typeLabels] || value;
      }
    },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      type: 'date',
      renderType: 'dateString',
      width: 120,
      sortable: true,
      filterable: true
    },
    {
      field: 'actions',
      headerName: '',
      width: 140,
      sortable: false,
      filterable: false,
      actionComponent: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconButton
            icon="visibility"
            variant="text"
            ariaLabel="Ver detalles"
            onClick={() => handleViewDetails(row.id, row.message || '')}
            style={{
              minWidth: 32,
              minHeight: 32,
              width: 32,
              height: 32,
              padding: 4
            }}
          />
          {row.status === 'SEND' && (
            <MarkAsReadButton notificationId={row.id} />
          )}
          <IconButton
            icon="delete"
            variant="text"
            ariaLabel="Eliminar notificación"
            onClick={() => handleDelete(row.id, row.message || '')}
            className="text-red-500"
            style={{
              minWidth: 32,
              minHeight: 32,
              width: 32,
              height: 32,
              padding: 4
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        title={title || 'Notificaciones'}
        columns={columns}
        rows={rows}
        totalRows={totalRows ?? rows.length}
        height="70vh"
        data-test-id="notifications-grid"
      />

      <DetailNotificationDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        notificationId={selectedNotificationId}
      />

      <DeleteNotificationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        notificationId={selectedNotificationId}
        notificationMessage={selectedNotificationMessage}
        onSave={handleRefresh}
      />
    </>
  );
}