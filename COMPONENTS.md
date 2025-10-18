# 📦 Guía Completa de Componentes - AppStart NextEl

> Documentación exhaustiva de todos los componentes UI reutilizables para aplicaciones Electron + Next.js

---

## 📑 Índice

1. [Introducción](#introducción)
2. [Convenciones del Proyecto](#convenciones-del-proyecto)
3. [Componentes por Categoría](#componentes-por-categoría)
   - [Formularios y Entrada de Datos](#formularios-y-entrada-de-datos)
   - [Navegación y Layout](#navegación-y-layout)
   - [Visualización de Datos](#visualización-de-datos)
   - [Retroalimentación al Usuario](#retroalimentación-al-usuario)
   - [Interacción](#interacción)
4. [Patrones de Integración](#patrones-de-integración)
5. [Integración con Electron](#integración-con-electron)

---

## 🎯 Introducción

Este proyecto utiliza una biblioteca de componentes UI diseñada específicamente para aplicaciones de escritorio construidas con **Electron + Next.js 15 + TypeScript**. Todos los componentes están optimizados para:

- ✅ **Renderizado del lado del servidor (SSR)** con Next.js App Router
- ✅ **Integración con TypeORM** para persistencia en SQLite
- ✅ **Autenticación con NextAuth.js** (roles admin/operator)
- ✅ **Material Symbols** para iconografía
- ✅ **Tailwind CSS 4** para estilos
- ✅ **TypeScript estricto** con tipado completo

---

## 🏗️ Convenciones del Proyecto

### Arquitectura Cliente/Servidor

Este proyecto sigue el patrón de **Server Components** de Next.js 15:

```typescript
// ✅ Server Component (por defecto)
// No necesita 'use client'
import { getUserRepository, initializeDatabase } from '@/db/config';

export default async function UsersPage() {
  await initializeDatabase();
  const userRepo = getUserRepository();
  const users = await userRepo.find();
  
  return <UsersList users={users} />;
}

// ✅ Client Component (cuando se necesita interactividad)
'use client';

import { useState } from 'react';
import { TextField } from '@/components';

export default function UserForm() {
  const [name, setName] = useState('');
  
  return (
    <TextField 
      label="Nombre" 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
    />
  );
}
```

### Patrón de Inicialización de Base de Datos

**Crítico**: Siempre inicializar la base de datos en API routes y Server Components:

```typescript
// app/api/users/route.ts
import { initializeDatabase, getUserRepository } from '@/db/config';

export async function GET() {
  await initializeDatabase(); // ⚠️ SIEMPRE llamar primero
  const userRepo = getUserRepository();
  const users = await userRepo.find();
  return Response.json(users);
}
```

### Estructura de Importaciones

```typescript
// Importaciones desde barrel file (recomendado)
import { Button, TextField, Alert } from '@/components';

// Importación específica (para componentes con variantes)
import { CreateBaseForm, UpdateBaseForm } from '@/components/BaseForm';

// Importación de tipos
import type { AlertVariant } from '@/components/Alert';
```

### Integración con NextAuth

```typescript
// Server Component
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/');
  }
  
  return <AdminPanel userRole={session.user.role} />;
}

// Client Component
'use client';

import { useSession } from 'next-auth/react';

export default function UserProfile() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <CircularProgress />;
  if (!session) return <Alert variant="error">No autorizado</Alert>;
  
  return <div>Hola, {session.user.name}</div>;
}
```

---

## 📦 Componentes por Categoría

---

## 🔤 Formularios y Entrada de Datos

### TextField

**Categoría:** Formularios y Entrada de Datos  
**Ruta:** `components/TextField/`

#### 📝 Descripción

Componente de entrada de texto versátil con soporte para múltiples tipos de input (text, email, password, number, currency, dni), validación integrada, iconos personalizables y variantes visuales. Diseñado para formularios de aplicaciones de escritorio con experiencia de usuario optimizada.

#### 🎯 Casos de Uso

- **Formularios de login/registro** en aplicaciones Electron
- **Entrada de datos** con validación en tiempo real
- **Campos de búsqueda** con iconos descriptivos
- **Inputs especializados** (RUT, moneda, email)
- **Áreas de texto** multilínea con `rows`

#### 📦 Importación

```typescript
import { TextField } from '@/components';
// o
import TextField from '@/components/TextField/TextField';
```

#### 🔧 Props/API

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `label` | `string` | ✅ | - | Etiqueta del campo |
| `value` | `string` | ✅ | - | Valor controlado del input |
| `onChange` | `(e: ChangeEvent<HTMLInputElement \| HTMLTextAreaElement>) => void` | ✅ | - | Manejador de cambios |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'currency' \| 'dni'` | ⚪ | `'text'` | Tipo de input |
| `placeholder` | `string` | ⚪ | `''` | Texto de placeholder |
| `disabled` | `boolean` | ⚪ | `false` | Deshabilitar input |
| `readOnly` | `boolean` | ⚪ | `false` | Solo lectura |
| `required` | `boolean` | ⚪ | `false` | Campo obligatorio |
| `autoFocus` | `boolean` | ⚪ | `false` | Enfoque automático |
| `startIcon` | `string` | ⚪ | - | Icono Material Symbol al inicio |
| `endIcon` | `string` | ⚪ | - | Icono Material Symbol al final |
| `variant` | `'normal' \| 'contrast'` | ⚪ | `'normal'` | Variante visual |
| `rows` | `number` | ⚪ | - | Número de filas (convierte a textarea) |
| `className` | `string` | ⚪ | `''` | Clases CSS adicionales |

#### 💡 Ejemplos

**Ejemplo Básico - Client Component:**

```typescript
'use client';

import { useState } from 'react';
import { TextField } from '@/components';

export default function BasicForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-4">
      <TextField
        label="Nombre completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ingresa tu nombre"
        startIcon="person"
        required
      />

      <TextField
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        startIcon="email"
      />
    </div>
  );
}
```

**Ejemplo con Server Action:**

```typescript
// app/actions/createUser.ts
'use server';

import { initializeDatabase, getUserRepository } from '@/db/config';

export async function createUser(formData: FormData) {
  await initializeDatabase();
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  
  const userRepo = getUserRepository();
  const user = userRepo.create({ name, email });
  await userRepo.save(user);
  
  return { success: true, user };
}

// app/admin/users/new/page.tsx
'use client';

import { useState } from 'react';
import { TextField, Button, Alert } from '@/components';
import { createUser } from '@/app/actions/createUser';

export default function NewUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    
    try {
      const result = await createUser(formData);
      if (result.success) {
        // Redirigir o mostrar éxito
        alert('Usuario creado!');
      }
    } catch (err) {
      setError('Error al crear usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      
      <TextField
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Button type="submit">Crear Usuario</Button>
    </form>
  );
}
```

**Ejemplo con Tipos Especializados:**

```typescript
'use client';

import { useState } from 'react';
import { TextField } from '@/components';

export default function SpecializedInputs() {
  const [dni, setDni] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="space-y-4">
      {/* Input tipo DNI (formato chileno) */}
      <TextField
        label="RUT"
        type="dni"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        placeholder="12.345.678-9"
        startIcon="badge"
      />

      {/* Input tipo moneda */}
      <TextField
        label="Monto"
        type="currency"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="$0"
        startIcon="attach_money"
      />

      {/* Input tipo password con toggle de visibilidad */}
      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Ingresa tu contraseña"
        startIcon="lock"
      />
    </div>
  );
}
```

**Ejemplo Textarea:**

```typescript
'use client';

import { useState } from 'react';
import { TextField } from '@/components';

export default function TextareaExample() {
  const [description, setDescription] = useState('');

  return (
    <TextField
      label="Descripción"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={5}
      placeholder="Ingresa una descripción detallada..."
    />
  );
}
```

#### ⚠️ Consideraciones

- **Electron**: El componente funciona tanto en ventanas principales como en modales
- **SSR**: Requiere `'use client'` porque usa hooks de React
- **Validación**: Los tipos especializados (`dni`, `currency`) tienen formato automático
- **Performance**: El componente está optimizado con `React.memo` internamente
- **Accesibilidad**: Incluye labels asociados y atributos ARIA

#### 🔗 Componentes Relacionados

- **BaseForm** - Para formularios completos con validación
- **AutoComplete** - Para entrada con sugerencias
- **Select** - Para selección de opciones

#### 📚 Referencias

- [README completo de TextField](components/TextField/README.md)

---

### Alert

**Categoría:** Retroalimentación al Usuario  
**Ruta:** `components/Alert/`

#### 📝 Descripción

Componente de alerta elegante y accesible con múltiples variantes visuales (success, info, warning, error) para mostrar mensajes importantes al usuario. Incluye overlay semi-transparente y diseño adaptativo.

#### 🎯 Casos de Uso

- **Mensajes de validación** en formularios
- **Notificaciones de éxito/error** después de operaciones
- **Advertencias** antes de acciones destructivas
- **Información contextual** en páginas
- **Feedback de API routes** en aplicaciones Electron

#### 📦 Importación

```typescript
import { Alert } from '@/components';
// o
import Alert from '@/components/Alert/Alert';
import type { AlertVariant } from '@/components/Alert/Alert';
```

#### 🔧 Props/API

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `variant` | `AlertVariant` | ⚪ | `'info'` | Tipo de alerta (success, info, warning, error) |
| `children` | `React.ReactNode` | ✅ | - | Contenido de la alerta |
| `className` | `string` | ⚪ | `''` | Clases CSS adicionales |
| `data-test-id` | `string` | ⚪ | auto | ID para testing automatizado |

**AlertVariant Type:**
```typescript
type AlertVariant = "success" | "info" | "warning" | "error";
```

#### 💡 Ejemplos

**Ejemplo Básico:**

```typescript
'use client';

import { Alert } from '@/components';

export default function BasicAlerts() {
  return (
    <div className="space-y-4">
      <Alert variant="success">
        ¡Operación completada exitosamente!
      </Alert>

      <Alert variant="info">
        Información importante para el usuario.
      </Alert>

      <Alert variant="warning">
        Advertencia: revisa antes de continuar.
      </Alert>

      <Alert variant="error">
        Error: no se pudo completar la operación.
      </Alert>
    </div>
  );
}
```

**Ejemplo con Validación de Formulario:**

```typescript
'use client';

import { useState } from 'react';
import { Alert, TextField, Button } from '@/components';

export default function FormWithAlerts() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    // Validación
    const newErrors: string[] = [];
    if (!email) newErrors.push('El email es requerido');
    if (!password) newErrors.push('La contraseña es requerida');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Usuario creado exitosamente');
      setEmail('');
      setPassword('');
    } catch (error) {
      setErrors(['Error al crear el usuario']);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <Alert variant="success">{success}</Alert>
      )}

      {errors.map((error, index) => (
        <Alert key={index} variant="error">{error}</Alert>
      ))}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit">Crear Usuario</Button>
    </form>
  );
}
```

**Ejemplo con API Route:**

```typescript
// app/api/users/route.ts
import { initializeDatabase, getUserRepository } from '@/db/config';

export async function POST(request: Request) {
  await initializeDatabase();
  
  try {
    const data = await request.json();
    const userRepo = getUserRepository();
    const user = userRepo.create(data);
    await userRepo.save(user);
    
    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Error al crear usuario' }, 
      { status: 500 }
    );
  }
}

// app/admin/users/page.tsx
'use client';

import { useState } from 'react';
import { Alert, Button } from '@/components';

export default function UsersPage() {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', email: 'test@test.com' })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Usuario creado exitosamente' });
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <Alert variant={message.type}>{message.text}</Alert>
      )}
      
      <Button onClick={handleCreate}>Crear Usuario</Button>
    </div>
  );
}
```

**Alertas Dismissibles:**

```typescript
'use client';

import { useState } from 'react';
import { Alert, IconButton } from '@/components';

export default function DismissibleAlerts() {
  const [visibleAlerts, setVisibleAlerts] = useState({
    success: true,
    warning: true,
    error: true
  });

  const dismissAlert = (type: keyof typeof visibleAlerts) => {
    setVisibleAlerts(prev => ({ ...prev, [type]: false }));
  };

  return (
    <div className="space-y-4">
      {visibleAlerts.success && (
        <Alert variant="success">
          <div className="flex items-center justify-between w-full">
            <span>Operación completada</span>
            <IconButton
              icon="close"
              size="xs"
              variant="text"
              onClick={() => dismissAlert('success')}
              aria-label="Cerrar alerta"
            />
          </div>
        </Alert>
      )}

      {visibleAlerts.warning && (
        <Alert variant="warning">
          <div className="flex items-center justify-between w-full">
            <span>Advertencia importante</span>
            <IconButton
              icon="close"
              size="xs"
              variant="text"
              onClick={() => dismissAlert('warning')}
              aria-label="Cerrar alerta"
            />
          </div>
        </Alert>
      )}
    </div>
  );
}
```

#### ⚠️ Consideraciones

- **Electron**: Funciona en todas las ventanas, incluidas modales y splash screens
- **SSR**: Compatible con Server Components (no necesita `'use client'` si no hay interactividad)
- **Accesibilidad**: Incluye `role="alert"` para lectores de pantalla
- **Performance**: Componente ligero sin re-renders innecesarios
- **Testing**: Incluye `data-test-id` automático por variante

#### 🔗 Componentes Relacionados

- **Dialog** - Para mensajes modales
- **CircularProgress** - Para indicadores de carga
- **IconButton** - Para botones de cerrar en alertas dismissibles

#### 📚 Referencias

- [README completo de Alert](components/Alert/README.md)

---

## 🔄 Patrones de Integración

### Patrón 1: CRUD Completo con DataGrid + API Routes

Este es el patrón más común para gestionar entidades en la aplicación:

```typescript
// 1. Definir Entidad TypeORM
// db/entities/Product.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  stock: number;
}

// 2. Agregar a config.ts
// db/config.ts
import { Product } from './entities/Product';

export const AppDataSource = new DataSource({
  // ...
  entities: [User, Product], // Agregar Product
});

export function getProductRepository() {
  return AppDataSource.getRepository(Product);
}

// 3. API Route con Paginación
// app/api/products/route.ts
import { initializeDatabase, getProductRepository } from '@/db/config';

export async function GET(request: Request) {
  await initializeDatabase();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  const productRepo = getProductRepository();

  const query = productRepo.createQueryBuilder('product');

  if (search) {
    query.where('product.name LIKE :search', { search: `%${search}%` });
  }

  const [products, total] = await query
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return Response.json({
    data: products,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  });
}

export async function POST(request: Request) {
  await initializeDatabase();

  const data = await request.json();
  const productRepo = getProductRepository();

  const product = productRepo.create(data);
  await productRepo.save(product);

  return Response.json({ success: true, product });
}

// 4. DataGrid en Página Admin
// app/admin/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { DataGrid, Alert } from '@/components';
import type { DataGridColumn } from '@/components/DataGrid/DataGrid';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const columns: DataGridColumn[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Producto', width: 200 },
    { 
      field: 'price', 
      headerName: 'Precio', 
      width: 120,
      valueFormatter: (value) => `$${value.toLocaleString()}`
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
  ];

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products?page=${page}&limit=10`);
      const data = await response.json();
      setProducts(data.data);
      setTotal(data.total);
    } catch (err) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  if (error) return <Alert variant="error">{error}</Alert>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      
      <DataGrid
        columns={columns}
        rows={products}
        loading={loading}
        pagination={{
          page,
          pageSize: 10,
          total,
          onPageChange: setPage
        }}
      />
    </div>
  );
}
```

### Patrón 2: Autenticación con Rutas Protegidas

```typescript
// Middleware de Autenticación
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/',
  },
});

export const config = {
  matcher: ['/admin/:path*'],
};

// Layout Protegido con Validación de Rol
// app/admin/layout.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  if (session.user.role !== 'admin') {
    redirect('/unauthorized');
  }

  return (
    <div>
      <TopBar userName={session.user.name} />
      <div className="flex">
        <SideBar userRole={session.user.role} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

// Componente Client con Validación
// app/admin/settings/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { Alert, CircularProgress } from '@/components';

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!session) {
    return <Alert variant="error">Sesión no válida</Alert>;
  }

  if (session.user.role !== 'admin') {
    return <Alert variant="warning">No tienes permisos para acceder</Alert>;
  }

  return (
    <div>
      <h1>Configuración</h1>
      {/* Contenido de la página */}
    </div>
  );
}
```

### Patrón 3: BaseForm con Validación

```typescript
// Formulario de Creación con BaseForm
'use client';

import { useState } from 'react';
import { CreateBaseForm, Alert } from '@/components';
import type { BaseFormField } from '@/components/BaseForm/CreateBaseForm';

export default function CreateProductPage() {
  const [values, setValues] = useState({
    name: '',
    price: '',
    stock: '',
    description: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fields: BaseFormField[] = [
    {
      name: 'name',
      label: 'Nombre del Producto',
      type: 'text',
      required: true,
      col: 2
    },
    {
      name: 'price',
      label: 'Precio',
      type: 'currency',
      required: true,
      col: 1
    },
    {
      name: 'stock',
      label: 'Stock',
      type: 'number',
      required: true,
      col: 1
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      rows: 4,
      col: 2
    }
  ];

  const handleChange = (field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setErrors([]);
    setIsSubmitting(true);

    // Validación
    const newErrors: string[] = [];
    if (!values.name) newErrors.push('El nombre es requerido');
    if (!values.price) newErrors.push('El precio es requerido');
    if (!values.stock) newErrors.push('El stock es requerido');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        setSuccess(true);
        setValues({ name: '', price: '', stock: '', description: '' });
      } else {
        setErrors(['Error al crear el producto']);
      }
    } catch (error) {
      setErrors(['Error de conexión']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear Producto</h1>

      {success && (
        <Alert variant="success">Producto creado exitosamente</Alert>
      )}

      {errors.map((error, index) => (
        <Alert key={index} variant="error">{error}</Alert>
      ))}

      <CreateBaseForm
        fields={fields}
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Crear Producto"
        columns={2}
      />
    </div>
  );
}
```

---

## ⚡ Integración con Electron

### Consideraciones Específicas para Aplicaciones de Escritorio

#### 1. Diferencias entre Dev y Producción

```typescript
// Detectar modo de ejecución
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const isPackaged = app.isPackaged;

// En componentes
'use client';

import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Detectar si estamos en Electron
    setIsElectron(typeof window !== 'undefined' && window.electron !== undefined);
  }, []);

  return (
    <div>
      {isElectron ? 'Ejecutando en Electron' : 'Ejecutando en navegador'}
    </div>
  );
}
```

#### 2. Comunicación IPC (si es necesaria)

```typescript
// src/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
});

// Componente que usa IPC
'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    electron?: {
      getAppVersion: () => Promise<string>;
      getPlatform: () => Promise<string>;
    };
  }
}

export default function AppInfo() {
  const [version, setVersion] = useState('');
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    if (window.electron) {
      window.electron.getAppVersion().then(setVersion);
      window.electron.getPlatform().then(setPlatform);
    }
  }, []);

  return (
    <div>
      <p>Versión: {version}</p>
      <p>Plataforma: {platform}</p>
    </div>
  );
}
```

#### 3. Manejo de Ventanas Modales

```typescript
// Los componentes Dialog funcionan como modales nativos
'use client';

import { useState } from 'react';
import { Dialog, Button } from '@/components';

export default function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmación"
      >
        <p>¿Estás seguro de que deseas continuar?</p>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button variant="danger" onClick={() => {
            // Acción confirmada
            setIsOpen(false);
          }}>Confirmar</Button>
        </div>
      </Dialog>
    </>
  );
}
```

#### 4. Debugging en Electron DevTools

```typescript
// En desarrollo, los componentes se pueden inspeccionar en DevTools
// src/main.ts

if (!app.isPackaged) {
  mainWindow.webContents.openDevTools();
}

// Logging útil en componentes
'use client';

import { useEffect } from 'react';

export default function DebugComponent() {
  useEffect(() => {
    console.log('[Component] Montado');
    
    return () => {
      console.log('[Component] Desmontado');
    };
  }, []);

  return <div>Debug Component</div>;
}
```

#### 5. Optimización de Performance

```typescript
// Lazy loading de componentes pesados
import { lazy, Suspense } from 'react';
import { CircularProgress } from '@/components';

const HeavyDataGrid = lazy(() => import('@/components/DataGrid/DataGrid'));

export default function OptimizedPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <HeavyDataGrid columns={[]} rows={[]} />
    </Suspense>
  );
}

// Memoización de componentes
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }: { data: any[] }) {
  // Componente que no necesita re-renderizar frecuentemente
  return <div>{/* ... */}</div>;
});
```

---

## 📚 Referencias Adicionales

### Documentación por Componente

Cada componente tiene su propia documentación detallada en su carpeta:

- [Alert - README](components/Alert/README.md)
- [TextField - README](components/TextField/README.md)
- [DataGrid - README](components/DataGrid/README.md)
- [BaseForm - README](components/BaseForm/README.md)
- [LocationPicker - README](components/LocationPicker/README.md)

### Recursos del Proyecto

- [README Principal](README.md)
- [Guía de Configuración](SOURCE_GUIDE.md)
- [Configuración de TypeORM](db/config.ts)
- [Configuración de NextAuth](app/lib/auth.ts)

### Tecnologías Utilizadas

- **Next.js 15** - Framework React con SSR
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Estilos utility-first
- **TypeORM** - ORM para SQLite
- **NextAuth.js** - Autenticación
- **Material Symbols** - Iconografía
- **Electron 28** - Framework de escritorio

---

## 🤝 Contribución

Para contribuir a esta biblioteca de componentes:

1. **Mantén la consistencia** con los patrones existentes
2. **Agrega documentación** para nuevos componentes
3. **Incluye ejemplos** de uso real
4. **Tipado completo** con TypeScript
5. **Testing** con `data-test-id` en todos los componentes
6. **Accesibilidad** siguiendo estándares WCAG

---

## 📝 Notas Finales

Esta guía se actualizará continuamente conforme se agreguen nuevos componentes o se mejoren los existentes. Para reportar errores o sugerir mejoras, por favor crea un issue en el repositorio del proyecto.

**Versión del documento:** 1.0.0  
**Última actualización:** 18 de octubre de 2025
