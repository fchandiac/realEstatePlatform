import { User, ApiResponse, ApiFilters, CreateUserData, UpdateUserData } from './types';
import { mockUsers } from './usersData';

// Simular delay de red
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Función auxiliar para filtrar usuarios
const filterUsers = (users: User[], filters: ApiFilters): User[] => {
  let filtered = [...users];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(user =>
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.userName.toLowerCase().includes(searchLower) ||
      user.phone.includes(searchLower)
    );
  }

  if (filters.role) {
    filtered = filtered.filter(user => user.role === filters.role);
  }

  if (filters.status) {
    filtered = filtered.filter(user => user.status === filters.status);
  }

  if (filters.department) {
    filtered = filtered.filter(user => user.department === filters.department);
  }

  if (filters.isVerified !== undefined) {
    filtered = filtered.filter(user => user.isVerified === filters.isVerified);
  }

  return filtered;
};

// Función auxiliar para ordenar usuarios
const sortUsers = (users: User[], sortField?: string, sort?: string): User[] => {
  if (!sortField || !sort) return users;

  return [...users].sort((a, b) => {
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sort === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sort === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
};

// API simulada para obtener usuarios
export const fetchUsers = async (
  page: number = 1,
  limit: number = 10,
  filters: ApiFilters = {}
): Promise<ApiResponse<User>> => {
  await delay(300); // Simular delay de red

  let filteredUsers = filterUsers(mockUsers, filters);
  filteredUsers = sortUsers(filteredUsers, filters.sortField, filters.sort);

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    data: paginatedUsers,
    total,
    page,
    limit,
    totalPages
  };
};

// API simulada para obtener un usuario por ID
export const fetchUserById = async (id: number): Promise<User | null> => {
  await delay(200);
  return mockUsers.find(user => user.id === id) || null;
};

// API simulada para crear un usuario
export const createUser = async (userData: CreateUserData): Promise<User> => {
  await delay(800); // Simular delay más largo para creación

  const newId = Math.max(...mockUsers.map(u => u.id)) + 1;
  const newUser: User = {
    id: newId,
    userName: userData.userName,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    address: userData.address,
    role: userData.role,
    status: 'pending',
    department: userData.department,
    birthDate: userData.birthDate,
    gender: userData.gender,
    isVerified: false,
    createdAt: new Date().toISOString(),
    preferences: {
      theme: 'light',
      language: 'es',
      notifications: true
    }
  };

  // En un entorno real, aquí se haría la llamada a la API
  // mockUsers.push(newUser); // No modificamos el mock original

  return newUser;
};

// API simulada para actualizar un usuario
export const updateUser = async (id: number, userData: UpdateUserData): Promise<User> => {
  await delay(600);

  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado');
  }

  const existingUser = mockUsers[userIndex];
  const updatedUser: User = {
    ...existingUser,
    ...userData,
    address: userData.address ? { ...existingUser.address, ...userData.address } : existingUser.address,
    preferences: userData.preferences ? { ...existingUser.preferences, ...userData.preferences } : existingUser.preferences,
    id // Asegurar que el ID no cambie
  };

  // En un entorno real, aquí se haría la llamada a la API
  // mockUsers[userIndex] = updatedUser;

  return updatedUser;
};

// API simulada para eliminar un usuario
export const deleteUser = async (id: number): Promise<void> => {
  await delay(400);

  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado');
  }

  // En un entorno real, aquí se haría la llamada a la API
  // mockUsers.splice(userIndex, 1);
};

// API simulada para obtener estadísticas de usuarios
export const fetchUserStats = async () => {
  await delay(250);

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const inactiveUsers = mockUsers.filter(u => u.status === 'inactive').length;
  const pendingUsers = mockUsers.filter(u => u.status === 'pending').length;
  const suspendedUsers = mockUsers.filter(u => u.status === 'suspended').length;

  const roleStats = mockUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentStats = mockUsers.reduce((acc, user) => {
    acc[user.department] = (acc[user.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: totalUsers,
    byStatus: {
      active: activeUsers,
      inactive: inactiveUsers,
      pending: pendingUsers,
      suspended: suspendedUsers
    },
    byRole: roleStats,
    byDepartment: departmentStats,
    verifiedUsers: mockUsers.filter(u => u.isVerified).length,
    averageSalary: mockUsers.reduce((sum, u) => sum + (u.salary || 0), 0) / totalUsers
  };
};

// API simulada para búsqueda avanzada
export const searchUsers = async (query: string): Promise<User[]> => {
  await delay(150);

  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  return mockUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm) ||
    user.lastName.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    user.userName.toLowerCase().includes(searchTerm) ||
    user.phone.includes(searchTerm) ||
    user.department.toLowerCase().includes(searchTerm) ||
    user.address.city.toLowerCase().includes(searchTerm)
  ).slice(0, 10); // Limitar resultados
};

// API simulada para exportar usuarios
export const exportUsers = async (filters: ApiFilters = {}, format: 'csv' | 'excel' = 'csv'): Promise<string> => {
  await delay(1000); // Simular procesamiento de exportación

  const filteredUsers = filterUsers(mockUsers, filters);

  if (format === 'csv') {
    const headers = ['ID', 'Usuario', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Rol', 'Estado', 'Departamento', 'Ciudad'];
    const rows = filteredUsers.map(user => [
      user.id,
      user.userName,
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.role,
      user.status,
      user.department,
      user.address.city
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Para Excel, en un entorno real se generaría un archivo Excel
  // Aquí solo devolvemos un mensaje indicando que se generó
  return `Archivo Excel generado con ${filteredUsers.length} usuarios`;
};