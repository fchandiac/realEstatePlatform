/**
 * ⚠️ CONFIGURACIÓN IMPORTANTE: DataGrid con Componentes de Acción
 *
 * IMPORTANTE: Esta configuración es CRÍTICA para habilitar componentes interactivos
 * que operan sobre filas completas del DataGrid.
 */

import React from 'react';
import { DataGridColumn } from '../DataGrid';
import { RowActions } from '../components/RowActions';

// ⚠️ CONFIGURACIÓN CRÍTICA PARA ALERTAS
export const ALERT_GRID_CONFIG: DataGridColumn[] = [
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
    actionComponent: RowActions, // ⚠️ CONFIGURACIÓN CRÍTICA
  },
];

// ⚠️ CONFIGURACIÓN PARA USUARIOS
export const USER_GRID_CONFIG: DataGridColumn[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 80,
    type: 'id',
  },
  {
    field: 'name',
    headerName: 'Nombre',
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
  },
  {
    field: 'role',
    headerName: 'Rol',
    width: 120,
  },
  {
    field: 'createdAt',
    headerName: 'Fecha Creación',
    width: 150,
    type: 'dateTime',
  },
  // ⚠️ ACCIONES PARA USUARIOS
  {
    field: 'userActions',
    headerName: 'Acciones',
    width: 150,
    align: 'center',
    sortable: false,
    actionComponent: RowActions,
  },
];

// ⚠️ COMPONENTE DE ACCIÓN PERSONALIZADO PARA INSPECTORES
export const InspectorActions: React.FC<{ row: any; column: DataGridColumn }> = ({ row, column }) => {
  const handleViewInspections = () => {
    console.log('Ver inspecciones de:', row.name);
  };

  const handleAssignInspection = () => {
    console.log('Asignar inspección a:', row.name);
  };

  return (
    <div className="flex items-center gap-1 justify-center">
      <button
        onClick={handleViewInspections}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Ver inspecciones"
      >
        📋
      </button>
      <button
        onClick={handleAssignInspection}
        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
        title="Asignar inspección"
      >
        🔍
      </button>
    </div>
  );
};

// ⚠️ CONFIGURACIÓN PARA INSPECTORES
export const INSPECTOR_GRID_CONFIG: DataGridColumn[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 80,
    type: 'id',
  },
  {
    field: 'name',
    headerName: 'Nombre',
    flex: 1,
  },
  {
    field: 'specialty',
    headerName: 'Especialidad',
    width: 150,
  },
  {
    field: 'status',
    headerName: 'Estado',
    width: 100,
    renderType: 'badge',
  },
  // ⚠️ ACCIONES ESPECÍFICAS PARA INSPECTORES
  {
    field: 'inspectorActions',
    headerName: 'Acciones',
    width: 150,
    align: 'center',
    sortable: false,
    actionComponent: InspectorActions, // ⚠️ Componente personalizado
  },
];

/**
 * ⚠️ INSTRUCCIONES CRÍTICAS PARA USAR ESTA CONFIGURACIÓN:
 *
 * 1. Importar la configuración deseada:
 *    import { ALERT_GRID_CONFIG } from './config/IMPORTANT_DataGridConfigs';
 *
 * 2. Usar en el DataGrid:
 *    <DataGrid columns={ALERT_GRID_CONFIG} rows={data} />
 *
 * 3. Los componentes de acción reciben automáticamente:
 *    - row: Todos los datos de la fila
 *    - column: Configuración de la columna
 *
 * 4. ⚠️ NUNCA modificar sortable/hide en columnas de acciones
 * 5. ⚠️ SIEMPRE mantener align: 'center' para mejor UX
 */