# DataGrid Component

Un componente avanzado de tabla de datos con funcionalidades completas de filtrado, ordenamiento, paginación y acciones por fila. Diseñado para manejar grandes volúmenes de datos con rendimiento optimizado.

## 🚀 Características Principales

- ✅ **Filtrado Avanzado**: Filtros por columna, búsqueda global y filtros persistentes en URL
- ✅ **Ordenamiento**: Orden ascendente/descendente con indicadores visuales
- ✅ **Paginación**: Control de página y tamaño de página personalizable
- ✅ **Acciones por Fila**: Botones de acción integrados con la API
- ✅ **Exportación**: Exportar datos respetando filtros aplicados
- ✅ **Responsive**: Diseño adaptativo para móviles y tablets
- ✅ **Virtualización**: Optimización de rendimiento para grandes datasets
- ✅ **Tipos de Columna**: Soporte para diferentes tipos de datos (string, number, date, currency, badge, etc.)

## 📦 Instalación

```bash
# El componente ya está incluido en el proyecto
import DataGrid, { DataGridColumn } from '@/components/DataGrid';
```

## 🎯 Uso Básico

```tsx
import React from 'react';
import DataGrid, { DataGridColumn } from '@/components/DataGrid';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const columns: DataGridColumn[] = [
  { field: 'id', headerName: 'ID', width: 80, type: 'id' },
  { field: 'name', headerName: 'Nombre', width: 200, sortable: true },
  { field: 'email', headerName: 'Email', width: 250, sortable: true },
  { field: 'role', headerName: 'Rol', width: 120, renderType: 'badge' },
  { field: 'status', headerName: 'Estado', width: 100, renderType: 'badge' },
];

const users: User[] = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'user', status: 'active' },
];

export default function UsersTable() {
  return (
    <DataGrid
      columns={columns}
      rows={users}
      title="Usuarios del Sistema"
      height="500px"
    />
  );
}
```

## 🔧 API Reference

### Props del DataGrid

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `columns` | `DataGridColumn[]` | **Requerido** | Definición de las columnas |
| `rows` | `any[]` | `[]` | Datos a mostrar en la tabla |
| `title` | `string` | `undefined` | Título de la tabla |
| `height` | `number \| string` | `'70vh'` | Altura del componente |
| `totalRows` | `number` | `undefined` | Total de filas (para paginación) |
| `totalGeneral` | `number` | `undefined` | Total general de registros |
| `createForm` | `React.ReactNode` | `undefined` | Formulario de creación integrado |

### DataGridColumn Interface

```typescript
interface DataGridColumn {
  field: string;                    // Campo del objeto de datos
  headerName: string;              // Nombre a mostrar en el header
  width?: number;                  // Ancho fijo de la columna
  minWidth?: number;              // Ancho mínimo
  maxWidth?: number;              // Ancho máximo
  flex?: number;                  // Factor de crecimiento flexible
  type?: DataGridColumnType;      // Tipo de dato ('string' | 'number' | 'date' | 'id')
  sortable?: boolean;             // Si la columna es ordenable
  editable?: boolean;             // Si la columna es editable
  filterable?: boolean;           // Si la columna es filtrable
  renderCell?: (params: any) => React.ReactNode; // Renderizado personalizado
  renderType?: 'currency' | 'badge' | 'dateString'; // Tipo de renderizado especial
  valueGetter?: (params: any) => any; // Función para obtener el valor
  align?: 'left' | 'right' | 'center'; // Alineación del contenido
  headerAlign?: 'left' | 'right' | 'center'; // Alineación del header
  hide?: boolean;                 // Ocultar la columna
  actionComponent?: React.ComponentType<{ row: any; column: DataGridColumn }>; // Componente de acciones
}
```

## 🎨 Variantes y Tipos de Columna

### Tipos Básicos

```tsx
const columns: DataGridColumn[] = [
  // Texto plano
  { field: 'name', headerName: 'Nombre', type: 'string', width: 200 },

  // Números
  { field: 'age', headerName: 'Edad', type: 'number', width: 100, align: 'right' },

  // Fechas
  { field: 'createdAt', headerName: 'Creado', type: 'date', width: 150 },

  // ID (con formato especial)
  { field: 'id', headerName: 'ID', type: 'id', width: 80 },
];
```

### Tipos Especiales con Renderizado

```tsx
const columns: DataGridColumn[] = [
  // Moneda con formato automático
  {
    field: 'salary',
    headerName: 'Salario',
    width: 120,
    renderType: 'currency',
    align: 'right'
  },

  // Badge con colores según valor
  {
    field: 'status',
    headerName: 'Estado',
    width: 100,
    renderType: 'badge'
  },

  // Fecha formateada como string
  {
    field: 'birthDate',
    headerName: 'Fecha Nacimiento',
    width: 150,
    renderType: 'dateString'
  },
];
```

### Renderizado Personalizado

```tsx
const columns: DataGridColumn[] = [
  {
    field: 'avatar',
    headerName: 'Avatar',
    width: 80,
    renderCell: (params) => (
      <img
        src={params.value}
        alt="Avatar"
        className="w-8 h-8 rounded-full"
      />
    ),
  },

  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(params.row)}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Editar
        </button>
        <button
          onClick={() => handleDelete(params.row)}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
        >
          Eliminar
        </button>
      </div>
    ),
  },
];
```

## 🔍 Filtrado y Búsqueda

### Modo de Filtrado

```tsx
import React, { useState } from 'react';
import DataGrid, { DataGridColumn } from '@/components/DataGrid';

export default function FilteredDataGrid() {
  const [filterMode, setFilterMode] = useState(false);

  return (
    <div>
      <button
        onClick={() => setFilterMode(!filterMode)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {filterMode ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>

      <DataGrid
        columns={columns}
        rows={data}
        title="Datos Filtrables"
        height="500px"
      />
    </div>
  );
}
```

### Filtros Programáticos

```tsx
import React, { useState, useEffect } from 'react';
import DataGrid, { DataGridColumn } from '@/components/DataGrid';

export default function ProgrammaticFilters() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    let filtered = [...allData];

    // Filtro de búsqueda global
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [allData, searchTerm, statusFilter]);

  return (
    <div>
      {/* Controles de filtro */}
      <div className="mb-4 space-x-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      <DataGrid
        columns={columns}
        rows={filteredData}
        title="Datos Filtrados"
        height="500px"
      />
    </div>
  );
}
```

## 🔄 Integración con API

### Ejemplo Completo con API

```tsx
import React, { useState, useEffect } from 'react';
import DataGrid, { DataGridColumn } from '@/components/DataGrid';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const columns: DataGridColumn[] = [
  { field: 'id', headerName: 'ID', width: 80, type: 'id', sortable: true },
  { field: 'name', headerName: 'Nombre', width: 200, sortable: true },
  { field: 'email', headerName: 'Email', width: 250, sortable: true },
  { field: 'role', headerName: 'Rol', width: 120, renderType: 'badge', sortable: true },
  { field: 'status', headerName: 'Estado', width: 100, renderType: 'badge', sortable: true },
  { field: 'createdAt', headerName: 'Creado', width: 150, type: 'date', sortable: true },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(params.row)}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={() => handleDelete(params.row)}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    ),
  },
];

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);

  // Cargar datos
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.data);
      setTotalRows(data.total);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const handleCreate = async () => {
    try {
      const newUser = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Nuevo Usuario',
          email: 'nuevo@example.com',
          role: 'user',
          status: 'active'
        })
      });
      const user = await newUser.json();
      setUsers(prev => [...prev, user]);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Editar usuario
  const handleEdit = async (user: User) => {
    try {
      const updatedUser = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active'
        })
      });
      const updated = await updatedUser.json();
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Eliminar usuario
  const handleDelete = async (user: User) => {
    if (!confirm(`¿Eliminar a ${user.name}?`)) return;

    try {
      await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ➕ Crear Usuario
        </button>
      </div>

      <DataGrid
        columns={columns}
        rows={users}
        title="Gestión de Usuarios"
        height="600px"
        totalRows={totalRows}
      />
    </div>
  );
}
```

## 🎯 Formulario de Creación Integrado

```tsx
import React from 'react';
import DataGrid, { DataGridColumn } from '@/components/DataGrid';
import CreateUserForm from './CreateUserForm'; // Tu componente de formulario

export default function DataGridWithCreateForm() {
  return (
    <DataGrid
      columns={columns}
      rows={data}
      title="Usuarios"
      height="500px"
      createForm={<CreateUserForm onSuccess={handleUserCreated} />}
    />
  );
}
```

## 📱 Responsive Design

El DataGrid se adapta automáticamente a diferentes tamaños de pantalla:

- **Desktop**: Muestra todas las columnas con scroll horizontal si es necesario
- **Tablet**: Oculta columnas menos importantes y ajusta anchos
- **Mobile**: Vista simplificada con scroll horizontal obligatorio

```tsx
// El componente maneja automáticamente el responsive
<DataGrid
  columns={columns}
  rows={data}
  height="500px"
/>
```

## 🎨 Personalización de Estilos

### Altura Personalizada

```tsx
// Altura fija en píxeles
<DataGrid columns={columns} rows={data} height={400} />

// Altura en viewport height
<DataGrid columns={columns} rows={data} height="70vh" />

// Altura en rem
<DataGrid columns={columns} rows={data} height="20rem" />
```

### Columnas con Ancho Flexible

```tsx
const columns: DataGridColumn[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Nombre', flex: 2 }, // Toma 2 partes del espacio disponible
  { field: 'email', headerName: 'Email', flex: 3 }, // Toma 3 partes del espacio disponible
  { field: 'actions', headerName: 'Acciones', width: 150 },
];
```

## 🔧 Configuración Avanzada

### Columnas Ocultas

```tsx
const columns: DataGridColumn[] = [
  { field: 'id', headerName: 'ID', width: 80, hide: true }, // Columna oculta
  { field: 'name', headerName: 'Nombre', width: 200 },
  // ... otras columnas
];
```

### Value Getter para Datos Calculados

```tsx
const columns: DataGridColumn[] = [
  {
    field: 'fullName',
    headerName: 'Nombre Completo',
    width: 200,
    valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
  },
];
```

## 🚨 Consideraciones de Rendimiento

- **Virtualización**: Para datasets grandes (>1000 filas), considera implementar virtualización
- **Paginación**: Usa paginación del lado del servidor para datasets muy grandes
- **Memoización**: Memoiza las columnas y datos cuando sea posible
- **Lazy Loading**: Implementa carga diferida para mejor UX

## 🐛 Solución de Problemas

### Problema: Columnas no se ajustan correctamente
```tsx
// ❌ Mal: Ancho fijo sin flex
const columns = [
  { field: 'name', headerName: 'Nombre', width: 200 },
  { field: 'email', headerName: 'Email', width: 300 },
];

// ✅ Bien: Usar flex para distribución automática
const columns = [
  { field: 'name', headerName: 'Nombre', flex: 2 },
  { field: 'email', headerName: 'Email', flex: 3 },
];
```

### Problema: Scroll horizontal en móviles
```tsx
// El componente maneja automáticamente el scroll en móviles
// No necesitas configuración adicional
<DataGrid columns={columns} rows={data} />
```

## 📚 Ejemplos Completos

Para ver ejemplos completos de uso, revisa:

- `app/components/DataGrid/page.tsx` - Showcase completo con API simulada
- `app/components/DataGrid/examples/` - Ejemplos específicos de uso
- `app/components/DataGrid/mocks/` - Datos de ejemplo y tipos

## 🤝 Contribución

Para contribuir al componente DataGrid:

1. Asegúrate de que tus cambios no rompan la API existente
2. Agrega tests para nuevas funcionalidades
3. Actualiza esta documentación si agregas nuevas props o funcionalidades
4. Sigue las convenciones de código del proyecto</content>
<parameter name="filePath">/Users/felipe/dev/DSP-App/app/components/DataGrid/README.md