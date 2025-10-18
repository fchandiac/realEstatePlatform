/**
 * ⚠️ CONFIGURACIÓN IMPORTANTE: DataGrid con Componentes de Acción
 *
 * Esta configuración es CRÍTICA para habilitar componentes interactivos
 * que operan sobre filas completas del DataGrid.
 *
 * IMPORTANTE:
 * - Los componentes de acción reciben TODOS los datos de la fila
 * - Permite crear botones de editar, eliminar, ver detalles, etc.
 * - Es type-safe y flexible para cualquier funcionalidad personalizada
 * - Se renderiza solo cuando es necesario para optimizar performance
 */

import React from 'react';
import DataGrid, { DataGridColumn } from '../DataGrid';
import { RowActions } from '../components/RowActions';

// ⚠️ CONFIGURACIÓN CRÍTICA: Columnas con acciones de fila
export const ALERT_GRID_COLUMNS: DataGridColumn[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 80,
    type: 'id',
    sortable: true,
  },
  {
    field: 'type',
    headerName: 'Tipo',
    width: 120,
    sortable: true,
  },
  {
    field: 'status',
    headerName: 'Estado',
    width: 100,
    renderType: 'badge',
    sortable: true,
  },
  {
    field: 'received_at',
    headerName: 'Fecha Recepción',
    width: 180,
    type: 'dateTime',
    sortable: true,
  },
  {
    field: 'assignedUserNames',
    headerName: 'Usuarios Asignados',
    flex: 1,
    sortable: false,
  },
  // ⚠️ COLUMNA CRÍTICA: Componentes de acción
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    align: 'center',
    sortable: false, // ⚠️ IMPORTANTE: Las acciones NO se ordenan
    hide: false,     // ⚠️ IMPORTANTE: Nunca ocultar esta columna
    // ⚠️ CONFIGURACIÓN CRÍTICA: Componente que recibe toda la fila
    actionComponent: RowActions,
  },
];

// ⚠️ CONFIGURACIÓN PARA GRIDS SIN ACCIONES (si no se necesitan)
export const READONLY_GRID_COLUMNS: DataGridColumn[] = [
  // ... otras columnas sin actionComponent
];

// ⚠️ EJEMPLO DE COMPONENTE DE ACCIÓN PERSONALIZADO
export const CustomAlertActions: React.FC<{ row: any; column: DataGridColumn }> = ({ row, column }) => {
  const handleViewDetails = () => {
    // ⚠️ IMPORTANTE: Aquí tienes acceso a TODOS los datos de la fila
    console.log('Ver detalles de alerta:', row.id, row.type, row.status);
    // Implementar navegación o modal de detalles
  };

  const handleAssignUsers = () => {
    // ⚠️ IMPORTANTE: Acceso completo a datos de usuarios asignados
    console.log('Asignar usuarios a alerta:', row.id, row.assignedUserNames);
    // Implementar modal de asignación
  };

  const handleMarkResolved = () => {
    // ⚠️ IMPORTANTE: Cambiar estado usando datos completos de la fila
    console.log('Marcar como resuelta:', row.id, row.status);
    // Implementar lógica de cambio de estado
  };

  return (
    <div className="flex items-center gap-1 justify-center">
      <button
        onClick={handleViewDetails}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Ver detalles"
      >
        👁️
      </button>
      <button
        onClick={handleAssignUsers}
        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
        title="Asignar usuarios"
      >
        👥
      </button>
      <button
        onClick={handleMarkResolved}
        className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
        title="Marcar resuelta"
      >
        ✅
      </button>
    </div>
  );
};

// ⚠️ CONFIGURACIÓN AVANZADA: Múltiples tipos de acciones
export const ADVANCED_GRID_COLUMNS: DataGridColumn[] = [
  // ... otras columnas
  {
    field: 'customActions',
    headerName: 'Acciones Avanzadas',
    width: 200,
    align: 'center',
    sortable: false,
    actionComponent: CustomAlertActions, // ⚠️ Componente personalizado
  },
];

/**
 * ⚠️ INSTRUCCIONES CRÍTICAS PARA DESARROLLADORES:
 *
 * 1. SIEMPRE incluir `sortable: false` en columnas de acciones
 * 2. SIEMPRE incluir `align: 'center'` para mejor UX
 * 3. NUNCA usar `hide: true` en columnas de acciones críticas
 * 4. Los componentes reciben `{ row, column }` como props
 * 5. `row` contiene TODOS los datos de la fila del DataGrid
 * 6. `column` contiene la configuración de la columna actual
 * 7. Usar `actionComponent` en lugar de `renderCell` para acciones
 *
 * ⚠️ VENTAJAS DE ESTA IMPLEMENTACIÓN:
 * - ✅ Type-safe con TypeScript
 * - ✅ Acceso completo a datos de fila
 * - ✅ Flexible para cualquier funcionalidad
 * - ✅ Reutilizable entre diferentes grids
 * - ✅ Optimizado para performance
 * - ✅ Fácil de mantener y extender
 */