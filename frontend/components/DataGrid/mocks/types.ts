// Tipos de datos para el mock de usuarios
export interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: 'admin' | 'user' | 'moderator' | 'manager';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  department: string;
  salary?: number;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  isVerified: boolean;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiFilters {
  search?: string;
  role?: string;
  status?: string;
  department?: string;
  isVerified?: boolean;
  sort?: string;
  sortField?: string;
}

export interface CreateUserData {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: User['role'];
  department: string;
  birthDate: string;
  gender: User['gender'];
}

export interface UpdateUserData extends Partial<CreateUserData> {
  status?: User['status'];
  preferences?: Partial<User['preferences']>;
}