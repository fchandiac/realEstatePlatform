'use client';

import { formatFieldName, formatValue } from '../utils/formatters';
import type { ChangeHistoryEntry } from '../types/property.types';

interface ChangeHistoryItemProps {
  change: ChangeHistoryEntry;
}

export default function ChangeHistoryItem({ change }: ChangeHistoryItemProps) {
  return (
    <div className="border rounded-lg p-4 bg-muted/20">
      <div className="flex items-start justify-between mb-2">
        <div className="text-sm font-medium">
          {formatFieldName(change.field)}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(change.timestamp).toLocaleString('es-ES')}
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mb-2">
        Cambiado por: {change.changedByName || change.changedBy || 'Usuario desconocido'}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-red-600">Antes:</span>
          <div className="mt-1">{formatValue(change.previousValue, change.field)}</div>
        </div>
        <div>
          <span className="font-medium text-green-600">Después:</span>
          <div className="mt-1">{formatValue(change.newValue, change.field)}</div>
        </div>
      </div>
    </div>
  );
}
