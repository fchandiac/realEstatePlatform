'use client'
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import DataGrid, { DataGridColumn } from './DataGrid';
import Link from 'next/link';
import { User } from './mocks/types';
import { fetchUsers, createUser, updateUser, deleteUser, exportUsers } from './mocks/userApi';

// Columnas para el DataGrid de usuarios
const userColumns: DataGridColumn[] = [
  { field: 'id', headerName: 'ID', width: 80, type: 'id', sortable: true },
  { field: 'firstName', headerName: 'Nombre', width: 150, sortable: true },
  { field: 'lastName', headerName: 'Apellido', width: 150, sortable: true },
  { field: 'email', headerName: 'Email', width: 250, sortable: true },
  { field: 'role', headerName: 'Rol', width: 120, renderType: 'badge', sortable: true },
  { field: 'status', headerName: 'Estado', width: 100, renderType: 'badge', sortable: true },
  { field: 'department', headerName: 'Departamento', width: 150, sortable: true },
  { field: 'createdAt', headerName: 'Creado', width: 120, type: 'date', sortable: true },
];

export default function DataGridShowcase() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<boolean>(false);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Aplicar filtros cuando cambien
  // Memoize applyFilters to avoid missing dependency warnings
  const applyFilters = useCallback(() => {
    let filtered = [...allUsers];

    // Filtro de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.userName.toLowerCase().includes(searchLower) ||
        user.phone.includes(searchLower)
      );
    }

    // Filtro por rol
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Filtro por departamento
    if (departmentFilter) {
      filtered = filtered.filter(user => user.department === departmentFilter);
    }

    // Ordenamiento
    if (sortField) {
      filtered.sort((a: User, b: User) => {
        const aValue = (a as any)[sortField as keyof User];
        const bValue = (b as any)[sortField as keyof User];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    setUsers(filtered);
  }, [allUsers, searchTerm, sortField, sortDirection, roleFilter, statusFilter, departmentFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await fetchUsers();
      setAllUsers(result.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // applyFilters is memoized above with useCallback

  // Función para manejar ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCreateUser = async () => {
    try {
      const newUser = await createUser({
        userName: 'nuevo_usuario',
        firstName: 'Nuevo',
        lastName: 'Usuario',
        email: 'nuevo@example.com',
        phone: '+1234567890',
        birthDate: '1990-01-01',
        gender: 'other',
        role: 'user',
        department: 'General',
        address: {
          street: 'Calle Principal 123',
          city: 'Ciudad',
          state: 'Estado',
          zipCode: '12345',
          country: 'País'
        }
      });
      setAllUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (user: User) => {
    try {
      const updatedUser = await updateUser(user.id, {
        firstName: user.firstName + ' (Actualizado)',
        status: user.status === 'active' ? 'inactive' : 'active'
      });
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`¿Estás seguro de eliminar a ${user.firstName} ${user.lastName}?`)) return;

    try {
      await deleteUser(user.id);
      setAllUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleExport = async () => {
    try {
      await exportUsers();
      alert('Datos exportados exitosamente');
    } catch (error) {
      console.error('Error exporting users:', error);
    }
  };

  // Columnas con acciones
  const columnsWithActions: DataGridColumn[] = [
    ...userColumns.map(col => ({
      ...col,
      renderCell: col.sortable ? (params: { value?: unknown }) => (
        <div className="flex items-center justify-between">
          <span>{String(params.value ?? '')}</span>
          <button
            onClick={() => handleSort(col.field)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            {sortField === col.field ? (
              sortDirection === 'asc' ? '↑' : '↓'
            ) : '↕'}
          </button>
        </div>
      ) : undefined
    })),
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 200,
      sortable: false,
      align: 'center',
      renderCell: (params: { row: User }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdateUser(params.row)}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Actualizar
          </button>
          <button
            onClick={() => handleDeleteUser(params.row)}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DataGrid Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente avanzado de tabla con funcionalidades de filtrado, ordenamiento, paginación,
            acciones por fila y exportación. Este showcase demuestra integración con una API simulada
            para operaciones CRUD reales.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Controles de Demo</h2>
          <div className="space-y-4">
            {/* Botones de acción */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                ➕ Crear Usuario
              </button>
              <button
                onClick={loadUsers}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                🔄 Recargar Datos
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                📤 Exportar Datos
              </button>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filterMode}
                  onChange={(e) => setFilterMode(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Modo de filtrado</span>
              </label>
            </div>

            {/* Controles de filtrado */}
            {filterMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🔍 Buscar
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nombre, email, teléfono..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    👤 Rol
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los roles</option>
                    <option value="admin">Administrador</option>
                    <option value="user">Usuario</option>
                    <option value="moderator">Moderador</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📊 Estado
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los estados</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="pending">Pendiente</option>
                    <option value="suspended">Suspendido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🏢 Departamento
                  </label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los deptos</option>
                    <option value="Engineering">Ingeniería</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Ventas</option>
                    <option value="HR">RRHH</option>
                    <option value="Finance">Finanzas</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
            )}

            {/* Estadísticas */}
            <div className="text-sm text-gray-600">
              <p><strong>Usuarios totales:</strong> {allUsers.length} | <strong>Filtrados:</strong> {users.length}</p>
            </div>
          </div>
        </div>

        {/* DataGrid with Real API Integration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">DataGrid con API Simulada</h2>
          <p className="text-gray-600 mb-4">
            Esta tabla está conectada a una API simulada que soporta operaciones CRUD completas.
            Los botones de acción ejecutan llamadas reales a la API (con delays simulados).
          </p>
          <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
            <DataGrid
              columns={columnsWithActions}
              rows={users}
              title="Usuarios del Sistema"
              height="500px"
            />
          </Suspense>
          {filterMode && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Pro tip:</strong> Activa el modo de filtrado para ver los inputs de búsqueda
                en cada columna. Los filtros se aplican en tiempo real sobre los datos cargados.
              </p>
            </div>
          )}
        </div>

        {/* API Response Demo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Demo de Respuestas de API</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Último Usuario Creado</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{users.length > 0 ? JSON.stringify(users[users.length - 1], null, 2) : 'Ningún usuario creado aún'}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Estadísticas</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm"><strong>Total de usuarios:</strong> {allUsers.length}</p>
                <p className="text-sm"><strong>Activos:</strong> {allUsers.filter(u => u.status === 'active').length}</p>
                <p className="text-sm"><strong>Inactivos:</strong> {allUsers.filter(u => u.status === 'inactive').length}</p>
                <p className="text-sm"><strong>Administradores:</strong> {allUsers.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Características Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-700 mb-2">🔍 Filtrado Avanzado</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Filtros por columna</li>
                <li>• Búsqueda global</li>
                <li>• Filtros persistentes en URL</li>
                <li>• Control granular de filtros</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-700 mb-2">📊 Ordenamiento</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Orden ascendente/descendente</li>
                <li>• Múltiples columnas</li>
                <li>• Indicadores visuales</li>
                <li>• Estado persistente</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-purple-700 mb-2">📄 Paginación</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Control de página</li>
                <li>• Tamaño de página personalizable</li>
                <li>• Información de resultados</li>
                <li>• Navegación eficiente</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-orange-700 mb-2">🎯 Acciones por Fila</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Botones de acción reales</li>
                <li>• Integración con API</li>
                <li>• Estados de carga</li>
                <li>• Manejo de errores</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-700 mb-2">📤 Exportación</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Exportar a Excel</li>
                <li>• Respeta filtros aplicados</li>
                <li>• Formatos personalizables</li>
                <li>• Descarga automática</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-teal-700 mb-2">⚡ Rendimiento</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Virtualización de filas</li>
                <li>• Carga diferida</li>
                <li>• Optimización de re-renders</li>
                <li>• Manejo eficiente de memoria</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Uso con API</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">DataGrid con API Simulada y Filtros</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import { useState, useEffect } from 'react';
import DataGrid from './components/DataGrid';
import { fetchUsers, createUser, updateUser, deleteUser } from './api/userApi';

function UserManagement() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allUsers, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    const result = await fetchUsers();
    setAllUsers(result.data);
  };

  const applyFilters = () => {
    let filtered = [...allUsers];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const columns = [
    { field: 'firstName', headerName: 'Nombre', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button onClick={() => handleUpdate(params.row)}>Editar</button>
          <button onClick={() => handleDelete(params.row)}>Eliminar</button>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Controles de filtro */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
        <DataGrid
          columns={columns}
          rows={filteredUsers}
          loading={loading}
        />
      </Suspense>
    </div>
  );
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Column Types Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tipos de Columna Soportados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Tipos Básicos</h3>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-gray-100 px-2 py-1 rounded">string</code> - Texto plano</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">number</code> - Números</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">boolean</code> - Verdadero/falso</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">date</code> - Fechas</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Tipos Especiales</h3>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-gray-100 px-2 py-1 rounded">badge</code> - Etiquetas con color</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">currency</code> - Valores monetarios</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">percentage</code> - Porcentajes</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">custom</code> - Renderizado personalizado</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Para tipos de columna avanzados y renderizado personalizado,
              consulta la documentación completa del componente DataGrid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
