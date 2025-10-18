'use client'
import React from 'react';
import { useState } from 'react';
import Cell from './Cell';
import { calculateColumnStyles } from '../utils/columnStyles';
import type { DataGridColumn } from '../DataGrid';

interface BodyProps {
  columns?: DataGridColumn[];
  rows?: any[];
  filterMode?: boolean;
  screenWidth?: number;
}

const Body: React.FC<BodyProps> = ({ columns = [], rows = [], filterMode = false, screenWidth = 1024 }) => {
  const [hoveredRowId, setHoveredRowId] = useState<string | number | null>(null);
  const visibleColumns = columns.filter((c) => !c.hide);

  // Usar utilidad centralizada para calcular estilos
  const computedStyles = calculateColumnStyles(columns, screenWidth);

  return (
    <div className="flex-1" data-test-id="data-grid-body">
      {/* Renderizar por filas para sincronizar alturas */}
      {rows.map((row, rowIndex) => (
        <div key={row.id || rowIndex} className="flex w-full items-stretch">
          {visibleColumns.map((column, colIndex) => {
            const value = row[column.field];
            return (
              <Cell
                key={`${column.field}-${row.id || rowIndex}`}
                column={column}
                row={row}
                value={value}
                computedStyle={computedStyles[colIndex]}
                hoveredRowId={hoveredRowId}
                onHoverRow={setHoveredRowId}
                isLastRow={rowIndex === rows.length - 1}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Body;