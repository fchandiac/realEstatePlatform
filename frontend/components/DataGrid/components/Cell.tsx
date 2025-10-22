'use client'
import React from 'react';
import { DataGridStyles } from '../utils/columnStyles';
import type { DataGridColumn } from '../DataGrid';

interface CellProps {
  column: DataGridColumn;
  row: any;
  value: any;
  computedStyle?: Record<string, any>;
  hoveredRowId?: string | number | null;
  onHoverRow?: (id: string | number | null) => void;
  isFirstRow?: boolean;
  isLastRow?: boolean;
}

const Cell: React.FC<CellProps> = ({ column, row, value, computedStyle, hoveredRowId, onHoverRow, isFirstRow = false, isLastRow = false }) => {
  const { align, headerAlign, width, flex, minWidth, maxWidth, renderCell, renderType, actionComponent } = column;
  // Prefer explicit column.align; if missing, fall back to headerAlign so cells match header alignment
  const actualAlign = align ?? headerAlign ?? 'left';
  
  const cellStyle = {
    ...(flex !== undefined ? { flex } : {}),
    ...(width !== undefined ? { width } : {}),
    ...(minWidth !== undefined ? { minWidth } : {}),
    ...(maxWidth !== undefined ? { maxWidth } : {}),
  };

  // Si la columna tiene un actionComponent, renderizarlo con la fila completa
  if (actionComponent) {
    const ActionComponent = actionComponent;
    return (
      <div
        className={`${DataGridStyles.bodyCell}
          ${actualAlign === 'center' ? 'text-center' : actualAlign === 'right' ? 'text-right' : 'text-left'}
          ${hoveredRowId !== null && (row.id ?? row._id ?? row.key ?? row.index) === hoveredRowId ? 'bg-secondary/20' : ''}
          ${isFirstRow ? 'border-b-2 border-gray-300' : ''}
          ${isLastRow ? 'border-b-0' : ''}`}
        style={{ ...cellStyle, ...(computedStyle || {}) }}
        onMouseEnter={() => onHoverRow?.(row.id ?? row._id ?? row.key ?? row.index)}
        onMouseLeave={() => onHoverRow?.(null)}
        data-test-id={`data-grid-cell-${column.field}-${row.id ?? row._id ?? row.key ?? row.index}`}
      >
        <ActionComponent row={row} column={column} />
      </div>
    );
  }

  // Si hay un renderType serializable, interpretar aquí en el cliente
  let cellContent: React.ReactNode = value;

  if (renderType === 'currency') {
    try {
      cellContent = typeof value === 'number' ? new Intl.NumberFormat('es-CL').format(value) : value;
      cellContent = `$${cellContent}`;
    } catch (e) {
      cellContent = value;
    }
  } else if (renderType === 'badge') {
    cellContent = (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {value ? 'Activo' : 'Inactivo'}
      </span>
    );
  } else if (renderType === 'dateString' || column.type === 'date' || column.type === 'dateTime') {
    try {
      const date = value instanceof Date ? value : new Date(value);
      if (!isNaN(date.getTime())) {
        if (column.type === 'dateTime') {
          cellContent = new Intl.DateTimeFormat('es-CL', {
            dateStyle: 'short',
            timeStyle: 'medium',
            timeZone: 'America/Santiago',
          }).format(date);
        } else {
          cellContent = new Intl.DateTimeFormat('es-CL', {
            dateStyle: 'short',
            timeZone: 'America/Santiago',
          }).format(date);
        }
      } else {
        cellContent = value;
      }
    } catch (e) {
      cellContent = value;
    }
  } else if (typeof renderCell === 'function') {
    // fallback: if renderCell exists (client-side), use it
    cellContent = renderCell({ row, field: column.field, value });
  }

  return (
    <div
      className={`${DataGridStyles.bodyCell}
        ${actualAlign === 'center' ? 'text-center' : actualAlign === 'right' ? 'text-right' : 'text-left'}
        ${hoveredRowId !== null && (row.id ?? row._id ?? row.key ?? row.index) === hoveredRowId ? 'bg-secondary/20' : ''}
        ${isFirstRow ? 'border-b-2 border-gray-300' : ''}
        ${isLastRow ? 'border-b-0' : ''}`}
      style={{ ...cellStyle, ...(computedStyle || {}) }}
      onMouseEnter={() => onHoverRow?.(row.id ?? row._id ?? row.key ?? row.index)}
      onMouseLeave={() => onHoverRow?.(null)}
      data-test-id={`data-grid-cell-${column.field}-${row.id ?? row._id ?? row.key ?? row.index}`}
    >
      {cellContent}
    </div>
  );
};

export default Cell;
