'use client';

import React from 'react';
import { Button } from '@/components/Button/Button';
import Dialog from '@/components/Dialog/Dialog';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import type { TeamMember } from '@/app/actions/ourTeam';

interface ConfirmDeleteDialogProps {
  open: boolean;
  member: TeamMember | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  member,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDeleteDialogProps) {
  if (!open || !member) return null;

  return (
    <Dialog open={open} onClose={onCancel} title="Confirmar eliminación">
      <div className="py-4">
        <p className="text-foreground">
          ¿Estás seguro de que deseas eliminar a <strong>{member.name}</strong>?
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Esta acción no se puede deshacer.
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          onClick={onCancel}
          variant="secondary"
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} className="mr-2" />
              Eliminando...
            </>
          ) : (
            'Eliminar'
          )}
        </Button>
      </div>
    </Dialog>
  );
}
