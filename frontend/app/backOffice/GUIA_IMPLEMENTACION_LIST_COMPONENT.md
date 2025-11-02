# Guía de Implementación: List Component Pattern

Esta guía te ayudará a crear componentes de lista administrativos siguiendo el patrón establecido en el proyecto, basado en `PropertyTypeList.tsx`.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Backend: Server Actions](#backend-server-actions)
4. [Frontend: Componentes](#frontend-componentes)
5. [Ejemplo Completo](#ejemplo-completo)
6. [Checklist de Implementación](#checklist-de-implementación)

---

## Requisitos Previos

### Backend
- ✅ Entidad definida en `backend/src/entities/`
- ✅ Módulo con Controller, Service y DTO configurados
- ✅ Endpoint GET con soporte para parámetro `search`

### Frontend
- ✅ Server Actions implementados (getAll, create, update, delete)
- ✅ Tipos TypeScript definidos

---

## Estructura de Archivos

Para una entidad llamada `Feature`, crea esta estructura:

```
frontend/app/backOffice/features/
├── page.tsx                    # Server Component (página principal)
├── ui/
│   ├── FeatureList.tsx        # Lista principal (Client Component)
│   ├── FeatureCard.tsx        # Card individual
│   ├── CreateFeatureForm.tsx  # Formulario de creación
│   └── index.ts               # Exports del módulo
└── actions/
    └── features.ts            # Server Actions
```

---

## Backend: Server Actions

### 1. Implementar Server Action con Search

```typescript
// frontend/app/actions/features.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { env } from '@/lib/env';

export interface GetFeaturesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export async function listFeatures(params: GetFeaturesParams = {}): Promise<{
  success: boolean;
  data?: Feature[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const url = new URL(`${env.backendApiUrl}/features`);
    
    // Agregar parámetros de búsqueda
    if (params.search) {
      url.searchParams.set('search', params.search);
    }
    if (params.page) {
      url.searchParams.set('page', params.page.toString());
    }
    if (params.limit) {
      url.searchParams.set('limit', params.limit.toString());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Para datos que cambian frecuentemente
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `HTTP ${response.status}` 
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error listing features:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function createFeature(data: CreateFeatureDto): Promise<{
  success: boolean;
  data?: Feature;
  error?: string;
}> {
  // Implementar creación...
}

export async function updateFeature(id: string, data: Partial<Feature>): Promise<{
  success: boolean;
  data?: Feature;
  error?: string;
}> {
  // Implementar actualización...
}
```

### 2. Backend Controller con Search

**IMPORTANTE:** El backend debe implementar el parámetro `search` en el endpoint:

```typescript
// backend/src/modules/features/features.controller.ts
@Get()
async findAll(@Query() query: any) {
  const { search, page, limit } = query;
  return this.featuresService.findAll({ search, page, limit });
}
```

```typescript
// backend/src/modules/features/features.service.ts
async findAll(params: { search?: string; page?: number; limit?: number }) {
  const qb = this.featureRepository.createQueryBuilder('feature');
  
  // Implementar búsqueda
  if (params.search && params.search.trim()) {
    const searchTerm = `%${params.search.trim().toLowerCase()}%`;
    qb.andWhere(
      'LOWER(feature.name) LIKE :search OR LOWER(feature.description) LIKE :search',
      { search: searchTerm }
    );
  }
  
  // Ordenamiento y paginación
  qb.orderBy('feature.name', 'ASC');
  
  if (params.page && params.limit) {
    qb.skip((params.page - 1) * params.limit);
    qb.take(params.limit);
  }
  
  return qb.getMany();
}
```

---

## Frontend: Componentes

### 1. Server Component (Page)

```typescript
// frontend/app/backOffice/features/page.tsx
import { Suspense } from 'react';
import { listFeatures } from './actions/features';
import { FeatureList } from './ui';
import { CircularProgress } from '@/components';

interface FeaturesPageProps {
  searchParams: {
    search?: string;
    page?: string;
  };
}

export default async function FeaturesPage({ searchParams }: FeaturesPageProps) {
  const result = await listFeatures({
    search: searchParams.search,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
  });

  if (!result.success) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Features</h1>
        <div className="text-red-600">
          Error: {result.error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Features</h1>
      <Suspense fallback={<CircularProgress />}>
        <FeatureList features={result.data || []} />
      </Suspense>
    </div>
  );
}
```

### 2. Client Component (Lista Principal)

```typescript
// frontend/app/backOffice/features/ui/FeatureList.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from '@/app/contexts/AlertContext';
import { TextField, IconButton, Dialog } from '@/components';
import { Feature } from '../types';
import { FeatureCard } from './FeatureCard';
import { CreateFeatureForm } from './CreateFeatureForm';
import { updateFeature } from '../actions/features';

export interface FeatureListProps {
  features: Feature[];
  emptyMessage?: string;
}

const defaultEmptyMessage = 'No hay features para mostrar.';

export const FeatureList: React.FC<FeatureListProps> = ({
  features: initialFeatures,
  emptyMessage = defaultEmptyMessage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const alert = useAlert();

  // Sincronizar con URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setFeatures(initialFeatures);
  }, [initialFeatures]);

  // Manejar cambio de búsqueda con sincronización URL
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    
    // Actualizar URL sin recargar página
    router.replace(`?${params.toString()}`);
  };

  // Handlers CRUD
  const handleAddFeature = () => {
    setShowCreateForm(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    router.refresh(); // Re-fetch desde server
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
  };

  // Edición inline con updates optimistas
  const handleInlineEdit = async (featureId: string, field: keyof Feature, value: any) => {
    try {
      // 1. Update optimista local
      setFeatures(prevFeatures => 
        prevFeatures.map(feature => 
          feature.id === featureId 
            ? { ...feature, [field]: value }
            : feature
        )
      );

      // 2. Server action
      const result = await updateFeature(featureId, { [field]: value });
      
      if (!result.success) {
        throw new Error(result.error || 'Error updating feature');
      }

      // 3. Success feedback
      alert.success(`Feature actualizado exitosamente`);
    } catch (err) {
      console.error('Error updating feature:', err);
      
      // 4. Rollback optimistic update
      setFeatures(initialFeatures);
      alert.error('Error al actualizar. Por favor, inténtalo de nuevo.');
    }
  };

  // Filtrado local (opcional si search es server-side)
  const filteredFeatures = features.filter(feature =>
    feature.name.toLowerCase().includes(search.toLowerCase()) ||
    (feature.description && feature.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full">
      {/* Toolbar: Create + Search */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex-shrink-0">
          <IconButton
            aria-label="Agregar feature"
            variant="containedPrimary"
            onClick={handleAddFeature}
            icon="add"
          />
        </div>
        <div className="flex-1 min-w-0 max-w-xs sm:max-w-sm">
          <TextField
            label="Buscar"
            value={search}
            onChange={handleSearchChange}
            startIcon="search"
            placeholder="Buscar features..."
          />
        </div>
      </div>

      {/* Modal de creación */}
      <Dialog
        open={showCreateForm}
        onClose={handleCreateCancel}
        size="lg"
      >
        <CreateFeatureForm
          onSuccess={handleCreateSuccess}
          onCancel={handleCreateCancel}
        />
      </Dialog>

      {/* Grid de features */}
      {filteredFeatures.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {search ? `No se encontraron features para "${search}"` : emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredFeatures.map(feature => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              onInlineEdit={handleInlineEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureList;
```

### 3. Card Component

```typescript
// frontend/app/backOffice/features/ui/FeatureCard.tsx
'use client';

import { Card, Switch } from '@/components';
import { Feature } from '../types';

interface FeatureCardProps {
  feature: Feature;
  onInlineEdit: (id: string, field: keyof Feature, value: any) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onInlineEdit,
}) => {
  const handleToggle = (field: keyof Feature, value: boolean) => {
    onInlineEdit(feature.id, field, value);
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-lg">{feature.name}</h3>
          {feature.description && (
            <p className="text-sm text-gray-600 mt-1">
              {feature.description}
            </p>
          )}
        </div>

        {/* Features toggles */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Activo</span>
            <Switch
              checked={feature.isActive}
              onChange={(checked) => handleToggle('isActive', checked)}
            />
          </div>
          
          {/* Agregar más toggles según necesidad */}
        </div>

        {/* Metadata */}
        <div className="text-xs text-gray-400 pt-2 border-t">
          Creado: {new Date(feature.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};
```

### 4. Create Form Component

```typescript
// frontend/app/backOffice/features/ui/CreateFeatureForm.tsx
'use client';

import { useState } from 'react';
import { TextField, Button, Switch } from '@/components';
import { useAlert } from '@/app/contexts/AlertContext';
import { createFeature } from '../actions/features';
import { CreateFeatureDto } from '../types';

interface CreateFeatureFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateFeatureForm: React.FC<CreateFeatureFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateFeatureDto>({
    name: '',
    description: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const alert = useAlert();

  const handleChange = (field: keyof CreateFeatureDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert.error('El nombre es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createFeature(formData);
      
      if (result.success) {
        alert.success('Feature creado exitosamente');
        onSuccess();
      } else {
        alert.error(result.error || 'Error al crear feature');
      }
    } catch (error) {
      console.error('Error creating feature:', error);
      alert.error('Error inesperado al crear feature');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Feature</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Nombre"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        
        <TextField
          label="Descripción"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />
        
        <div className="flex items-center justify-between">
          <span>Activo por defecto</span>
          <Switch
            checked={formData.isActive}
            onChange={(checked) => handleChange('isActive', checked)}
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando...' : 'Crear Feature'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
```

### 5. Exports (index.ts)

```typescript
// frontend/app/backOffice/features/ui/index.ts
export { FeatureList } from './FeatureList';
export { FeatureCard } from './FeatureCard';
export { CreateFeatureForm } from './CreateFeatureForm';
```

---

## Ejemplo Completo

### Tipos TypeScript

```typescript
// frontend/app/backOffice/features/types.ts
export interface Feature {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureDto {
  name: string;
  description?: string;
  isActive: boolean;
}
```

---

## Checklist de Implementación

### Backend ✅
- [ ] Entidad creada en `backend/src/entities/`
- [ ] Controller con endpoint GET que acepta `?search=`
- [ ] Service implementa búsqueda con LIKE en campos relevantes
- [ ] DTOs para Create/Update definidos

### Server Actions ✅
- [ ] `listEntities()` con parámetro search
- [ ] `createEntity()` 
- [ ] `updateEntity()` para ediciones inline
- [ ] Manejo de errores consistente
- [ ] Headers de autenticación incluidos

### Frontend Components ✅
- [ ] Page.tsx como Server Component
- [ ] EntityList.tsx como Client Component
- [ ] EntityCard.tsx para cada item
- [ ] CreateEntityForm.tsx en Dialog
- [ ] Sincronización search con URL
- [ ] Updates optimistas implementados
- [ ] Alert context integrado

### UX/UI ✅
- [ ] Grid responsivo (1/2/3 columnas)
- [ ] IconButton para "agregar"
- [ ] TextField con ícono search
- [ ] Dialog para creación
- [ ] Estados vacíos manejados
- [ ] Loading states en forms

### Funcionalidades ✅
- [ ] Búsqueda en tiempo real
- [ ] URL sincronizada con filtros
- [ ] Creación mediante modal
- [ ] Edición inline (toggles, etc.)
- [ ] Feedback visual (alerts)
- [ ] Manejo de errores robusto

---

## 🚨 Puntos Críticos

1. **Backend DEBE implementar search**: Sin esto, el TextField de búsqueda no funcionará
2. **Server Actions con autenticación**: Siempre incluir `Bearer ${accessToken}`
3. **Updates optimistas**: Para UX fluida en ediciones inline
4. **Sincronización URL**: Para mantener estado en navegación
5. **Manejo de errores**: En todos los niveles (network, validation, server)

---

## 📚 Referencias

- Componente base: [`frontend/app/backOffice/properties/propertyTypes/ui/PropertyTypeList.tsx`](frontend/app/backOffice/properties/propertyTypes/ui/PropertyTypeList.tsx)
- Componentes UI: [`frontend/components/`](frontend/components/)
- Server Actions pattern: [`frontend/app/actions/`](frontend/app/actions/)

¡Siguiendo esta guía tendrás un componente de lista administrativo robusto y consistente con el resto de la aplicación!