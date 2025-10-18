/**
 * EJEMPLO DE USO: DataGrid con componentes de acción
 *
 * Este archivo muestra cómo implementar componentes que operan sobre filas completas
 * en el DataGrid, como botones de editar, eliminar, ver detalles, etc.
 */

import React, { useState } from 'react';
import DataGrid, { DataGridColumn } from '../DataGrid';
import { RowActions } from '../components/RowActions';

// Ejemplo de componente de acciones personalizado
const CustomRowActions: React.FC<{ row: any; column: DataGridColumn }> = ({ row, column }) => {
  const handleEdit = () => {
    // Lógica para editar la fila
    console.log('Editando:', row);
  };

  const handleDelete = () => {
    // Lógica para eliminar la fila
    console.log('Eliminando:', row);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleEdit}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Editar
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Eliminar
      </button>
    </div>
  );
};

// Configuración de columnas con acciones
const columns: DataGridColumn[] = [
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
    field: 'status',
    headerName: 'Estado',
    width: 100,
    renderType: 'badge',
  },
  {
    field: 'createdAt',
    headerName: 'Fecha Creación',
    width: 150,
    type: 'dateTime',
  },
  // Columna de acciones usando el componente predefinido
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    align: 'center',
    sortable: false, // Las acciones no se ordenan
    actionComponent: RowActions, // ← Componente de acciones
  },
];

// O usando un componente personalizado
const columnsWithCustomActions: DataGridColumn[] = [
  // ... otras columnas
  {
    field: 'customActions',
    headerName: 'Acciones',
    width: 200,
    align: 'center',
    sortable: false,
    actionComponent: CustomRowActions, // ← Componente personalizado
  },
];

// Ejemplo de uso en un componente
const ExampleDataGrid: React.FC = () => {
  const [rows] = useState([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      status: true,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@example.com',
      status: false,
      createdAt: '2024-01-16T14:20:00Z',
    },
  ]);

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      title="Usuarios"
      height="500px"
    />
  );
};

export default ExampleDataGrid;

/**
 * VENTAJAS DE ESTA IMPLEMENTACIÓN:
 *
 * 1. **Flexibilidad**: Puedes crear cualquier tipo de componente de acción
 * 2. **Acceso completo a la fila**: El componente recibe toda la información de la fila
 * 3. **Reutilizable**: Puedes crear componentes de acciones reutilizables
 * 4. **Type-safe**: TypeScript garantiza que los props sean correctos
 * 5. **Performance**: Solo se renderiza cuando es necesario
 *
 * USOS COMUNES:
 * - Botones de editar/eliminar/ver detalles
 * - Checkboxes para selección múltiple
 * - Menús desplegables con acciones
 * - Estados switches/toggles
 * - Enlaces a páginas relacionadas
 */