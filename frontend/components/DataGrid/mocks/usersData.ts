import { User } from './types';

// Base de datos simulada de usuarios
export const mockUsers: User[] = [
  {
    id: 1,
    userName: 'jperez',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+56 9 1234 5678',
    address: {
      street: 'Calle Los Alamos 123',
      city: 'Santiago',
      state: 'Metropolitana',
      zipCode: '7500000',
      country: 'Chile'
    },
    role: 'admin',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juan',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T14:25:00Z',
    department: 'Tecnología',
    salary: 2500000,
    birthDate: '1985-03-15',
    gender: 'male',
    isVerified: true,
    preferences: {
      theme: 'dark',
      language: 'es',
      notifications: true
    }
  },
  {
    id: 2,
    userName: 'mgonzalez',
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@example.com',
    phone: '+56 9 2345 6789',
    address: {
      street: 'Avenida Providencia 456',
      city: 'Santiago',
      state: 'Metropolitana',
      zipCode: '7500000',
      country: 'Chile'
    },
    role: 'manager',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    createdAt: '2024-01-20T09:15:00Z',
    lastLogin: '2024-01-21T11:45:00Z',
    department: 'Ventas',
    salary: 2200000,
    birthDate: '1988-07-22',
    gender: 'female',
    isVerified: true,
    preferences: {
      theme: 'light',
      language: 'es',
      notifications: false
    }
  },
  {
    id: 3,
    userName: 'crodriguez',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@example.com',
    phone: '+56 9 3456 7890',
    address: {
      street: 'Pasaje Los Jardines 789',
      city: 'Viña del Mar',
      state: 'Valparaíso',
      zipCode: '2520000',
      country: 'Chile'
    },
    role: 'user',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    createdAt: '2024-01-25T16:20:00Z',
    lastLogin: '2024-01-22T08:30:00Z',
    department: 'Marketing',
    salary: 1800000,
    birthDate: '1990-11-08',
    gender: 'male',
    isVerified: false,
    preferences: {
      theme: 'light',
      language: 'es',
      notifications: true
    }
  },
  {
    id: 4,
    userName: 'asanchez',
    firstName: 'Ana',
    lastName: 'Sánchez',
    email: 'ana.sanchez@example.com',
    phone: '+56 9 4567 8901',
    address: {
      street: 'Calle Las Acacias 321',
      city: 'Concepción',
      state: 'Biobío',
      zipCode: '4030000',
      country: 'Chile'
    },
    role: 'moderator',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
    createdAt: '2024-02-01T12:45:00Z',
    lastLogin: '2024-01-23T15:10:00Z',
    department: 'Soporte',
    salary: 1900000,
    birthDate: '1987-05-14',
    gender: 'female',
    isVerified: true,
    preferences: {
      theme: 'dark',
      language: 'es',
      notifications: true
    }
  },
  {
    id: 5,
    userName: 'pmartinez',
    firstName: 'Pedro',
    lastName: 'Martínez',
    email: 'pedro.martinez@example.com',
    phone: '+56 9 5678 9012',
    address: {
      street: 'Avenida Los Carrera 654',
      city: 'Temuco',
      state: 'Araucanía',
      zipCode: '4780000',
      country: 'Chile'
    },
    role: 'user',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
    createdAt: '2024-02-05T14:30:00Z',
    lastLogin: '2024-01-18T09:20:00Z',
    department: 'Recursos Humanos',
    salary: 1700000,
    birthDate: '1992-09-30',
    gender: 'male',
    isVerified: false,
    preferences: {
      theme: 'light',
      language: 'es',
      notifications: false
    }
  },
  {
    id: 6,
    userName: 'llopez',
    firstName: 'Laura',
    lastName: 'López',
    email: 'laura.lopez@example.com',
    phone: '+56 9 6789 0123',
    address: {
      street: 'Calle Los Cerezos 987',
      city: 'Antofagasta',
      state: 'Antofagasta',
      zipCode: '1240000',
      country: 'Chile'
    },
    role: 'user',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=laura',
    createdAt: '2024-02-10T11:15:00Z',
    department: 'Finanzas',
    salary: 1850000,
    birthDate: '1989-12-03',
    gender: 'female',
    isVerified: false,
    preferences: {
      theme: 'light',
      language: 'es',
      notifications: true
    }
  },
  {
    id: 7,
    userName: 'dhernandez',
    firstName: 'Diego',
    lastName: 'Hernández',
    email: 'diego.hernandez@example.com',
    phone: '+56 9 7890 1234',
    address: {
      street: 'Pasaje Las Palmeras 147',
      city: 'La Serena',
      state: 'Coquimbo',
      zipCode: '1700000',
      country: 'Chile'
    },
    role: 'manager',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diego',
    createdAt: '2024-02-15T13:45:00Z',
    lastLogin: '2024-01-25T16:50:00Z',
    department: 'Operaciones',
    salary: 2300000,
    birthDate: '1984-06-18',
    gender: 'male',
    isVerified: true,
    preferences: {
      theme: 'dark',
      language: 'es',
      notifications: true
    }
  },
  {
    id: 8,
    userName: 'cgomez',
    firstName: 'Carolina',
    lastName: 'Gómez',
    email: 'carolina.gomez@example.com',
    phone: '+56 9 8901 2345',
    address: {
      street: 'Avenida Los Leones 258',
      city: 'Rancagua',
      state: 'O\'Higgins',
      zipCode: '2910000',
      country: 'Chile'
    },
    role: 'user',
    status: 'suspended',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carolina',
    createdAt: '2024-02-20T10:30:00Z',
    lastLogin: '2024-01-15T12:15:00Z',
    department: 'Legal',
    salary: 1950000,
    birthDate: '1991-08-27',
    gender: 'female',
    isVerified: true,
    preferences: {
      theme: 'light',
      language: 'es',
      notifications: false
    }
  },
  {
    id: 9,
    userName: 'atorres',
    firstName: 'Andrés',
    lastName: 'Torres',
    email: 'andres.torres@example.com',
    phone: '+56 9 9012 3456',
    address: {
      street: 'Calle Los Olivos 369',
      city: 'Talca',
      state: 'Maule',
      zipCode: '3460000',
      country: 'Chile'
    },
    role: 'moderator',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=andres',
    createdAt: '2024-02-25T15:20:00Z',
    lastLogin: '2024-01-26T14:40:00Z',
    department: 'Calidad',
    salary: 2000000,
    birthDate: '1986-04-12',
    gender: 'male',
    isVerified: true,
    preferences: {
      theme: 'dark',
      language: 'es',
      notifications: true
    }
  },
  {
    id: 10,
    userName: 'mfernandez',
    firstName: 'Marcela',
    lastName: 'Fernández',
    email: 'marcela.fernandez@example.com',
    phone: '+56 9 0123 4567',
    address: {
      street: 'Pasaje Las Violetas 741',
      city: 'Chillán',
      state: 'Ñuble',
      zipCode: '3780000',
      country: 'Chile'
    },
    role: 'user',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcela',
    createdAt: '2024-03-01T08:45:00Z',
    lastLogin: '2024-01-27T10:25:00Z',
    department: 'Logística',
    salary: 1750000,
    birthDate: '1993-01-09',
    gender: 'female',
    isVerified: false,
    preferences: {
      theme: 'light',
      language: 'es',
      notifications: true
    }
  }
];

// Funciones auxiliares para trabajar con los datos
export const getUserById = (id: number): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByStatus = (status: User['status']): User[] => {
  return mockUsers.filter(user => user.status === status);
};

export const getUsersByRole = (role: User['role']): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getUsersByDepartment = (department: string): User[] => {
  return mockUsers.filter(user => user.department === department);
};