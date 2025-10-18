'use client'
import React from 'react';
import { ColHeader } from './ColHeader';
import Cell from './Cell';
import type { DataGridColumn } from '../DataGrid';

interface ColProps {
  column: DataGridColumn;
  rows: any[];
  computedStyle?: Record<string, any>;
  filterMode?: boolean;
  hoveredRowId?: string | number | null;
  onHoverRow?: (id: string | number | null) => void;
}

const Col: React.FC<ColProps> = ({ column, rows, computedStyle, filterMode = false, hoveredRowId, onHoverRow }) => {
  return (
  <div className="flex flex-col flex-1 min-h-0 h-full" style={computedStyle as React.CSSProperties} data-test-id={`data-grid-column-${column.field}`}>
      {/* Header de la columna */}
      <ColHeader column={column} computedStyle={computedStyle} filterMode={filterMode} />
      
      {/* Celdas de la columna */}
      {rows.map((row, index) => {
        const value = row[column.field];
        return (
          <Cell 
            key={`${column.field}-${row.id || index}`}
            column={column}
            row={row}
            value={value}
            computedStyle={computedStyle}
            hoveredRowId={hoveredRowId}
            onHoverRow={onHoverRow}
          />
        );
      })}
    </div>
  );
};

export default Col;
