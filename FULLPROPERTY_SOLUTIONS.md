# Soluciones Detalladas - Componente FullProperty

## 1️⃣ CORRECCIÓN: useAlert Hook (CRÍTICA)

### ❌ Código Actual (INCORRECTO)
```typescript
// usePropertyData.ts
const alert = useAlert();

// ...
catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
  console.error('❌ [usePropertyData] Error:', errorMessage);
  setError(errorMessage);
  alert.error(errorMessage);  // ❌ CRASH: alert.error is not a function
}
```

### ✅ Código Corregido

**usePropertyData.ts:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAlert } from '@/app/hooks/useAlert';  // ✅ Correcto
import { getFullProperty } from '@/app/actions/properties';
import { listPropertyTypes } from '@/app/actions/properties';
import { listAdminsAgents } from '@/app/actions/users';
import { getRegiones } from '@/app/actions/commons';
import type { Property, PropertyType, User, Region } from '../types/property.types';

interface UsePropertyDataReturn {
  property: Property | null;
  propertyTypes: PropertyType[];
  users: User[];
  regions: Region[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePropertyData(propertyId: string): UsePropertyDataReturn {
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();  // ✅ Desestructura correctamente

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [propertyResult, typesResult, usersResult, regionsResult] = await Promise.all([
        getFullProperty(propertyId),
        listPropertyTypes(),
        listAdminsAgents({}),
        getRegiones()
      ]);

      // Procesar propiedad
      if (propertyResult.success && propertyResult.data) {
        console.log('🏠 [usePropertyData] Propiedad cargada:', propertyResult.data.id);
        setProperty(propertyResult.data as Property);
      } else {
        throw new Error(propertyResult.error || 'No se pudo cargar la propiedad');
      }

      // Procesar tipos de propiedad
      if (typesResult.success && typesResult.data) {
        console.log('🏷️ [usePropertyData] Tipos de propiedad cargados:', typesResult.data.length);
        setPropertyTypes(typesResult.data);
      }

      // Procesar usuarios
      if (usersResult.success && usersResult.data) {
        console.log('👥 [usePropertyData] Usuarios cargados:', usersResult.data.data?.length || 0);
        setUsers(usersResult.data.data || []);
      }

      // Procesar regiones con validación
      if (Array.isArray(regionsResult) && regionsResult.length > 0) {
        console.log('🗺️ [usePropertyData] Regiones cargadas:', regionsResult.length);
        setRegions(regionsResult);
      } else {
        console.warn('⚠️ [usePropertyData] Sin regiones disponibles');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
      console.error('❌ [usePropertyData] Error:', errorMessage);
      setError(errorMessage);
      
      // ✅ USO CORRECTO DE showAlert
      showAlert({
        message: errorMessage,
        type: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      loadData();
    }
  }, [propertyId]);

  return {
    property,
    propertyTypes,
    users,
    regions,
    loading,
    error,
    refetch: loadData
  };
}
```

---

## 2️⃣ CORRECCIÓN: Estructura de usersResult (CRÍTICA)

### ❌ Problema Identificado
```typescript
// El endpoint retorna:
// { success: true, data: { data: [...], count: ... } }

// Pero el código hace:
setUsers(usersResult.data.data || []);  // ✅ Esto está correcto
```

**ACTUALIZACIÓN:** El código está correcto. Sin embargo, necesita mejor validación:

### ✅ Código Mejorado
```typescript
// Procesar usuarios - con mejor validación
if (usersResult.success && usersResult.data) {
  // El endpoint retorna { data: [...], count: ... }
  const usersList = Array.isArray(usersResult.data)
    ? usersResult.data
    : Array.isArray(usersResult.data.data)
    ? usersResult.data.data
    : [];
  
  console.log('👥 [usePropertyData] Usuarios cargados:', usersList.length);
  setUsers(usersList);
} else {
  console.warn('⚠️ [usePropertyData] No se pudieron cargar usuarios');
  setUsers([]);
}
```

---

## 3️⃣ CORRECCIÓN: Validación de regionsResult (CRÍTICA)

### ❌ Código Actual (INCORRECTO)
```typescript
// Procesar regiones
console.log('🗺️ [usePropertyData] Regiones cargadas:', regionsResult.length);
setRegions(regionsResult);  // ❌ Puede ser undefined
```

### ✅ Código Corregido
```typescript
// Procesar regiones - CON VALIDACIÓN
try {
  if (Array.isArray(regionsResult) && regionsResult.length > 0) {
    console.log('🗺️ [usePropertyData] Regiones cargadas:', regionsResult.length);
    setRegions(regionsResult);
  } else {
    console.warn('⚠️ [usePropertyData] Sin regiones disponibles');
    setRegions([]);
  }
} catch (err) {
  console.error('❌ [usePropertyData] Error procesando regiones:', err);
  setRegions([]);
}
```

---

## 4️⃣ CORRECCIÓN: Dependencias en useEffect

### ❌ Código Actual
```typescript
useEffect(() => {
  if (propertyId) {
    loadData();
  }
}, [propertyId]);  // ⚠️ Falta 'alert'
```

### ✅ Código Corregido
```typescript
// Mover loadData fuera del effect para evitar dependencias circulares
const loadData = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    // ... código de loadData
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
    setError(errorMessage);
    showAlert({ message: errorMessage, type: 'error', duration: 5000 });
  } finally {
    setLoading(false);
  }
}, [showAlert]);  // ✅ Dependencia explícita

useEffect(() => {
  if (propertyId) {
    loadData();
  }
}, [propertyId, loadData]);  // ✅ Ambas dependencias
```

---

## 5️⃣ CORRECCIÓN: Sincronización de originalData (ALTA)

### ❌ Código Actual (INCORRECTO)
```typescript
setOriginalData(prev => ({
  ...prev,
  title: payload.title || prev.title,
  description: payload.description !== undefined ? payload.description : prev.description,
  status: payload.status || prev.status,
  operationType: payload.operationType || prev.operationType,
  isFeatured: payload.isFeatured !== undefined ? payload.isFeatured : prev.isFeatured,
}));
// ⚠️ NO actualiza propertyType ni assignedAgent
```

### ✅ Código Corregido
```typescript
const handleUpdateBasic = useCallback(async (payload: UpdatePropertyBasicDto) => {
  if (!formData) return;

  setSavingBasic(true);
  try {
    console.log('💾 [usePropertyForm] Actualizando información básica...', payload);
    const result = await updatePropertyBasic(formData.id, payload);

    if (result.success) {
      showAlert({
        message: 'Información básica actualizada',
        type: 'success',
        duration: 3000
      });

      // ✅ OPCIÓN 1: Si el endpoint retorna el objeto actualizado completo
      if (result.data) {
        setFormData(result.data);
        setOriginalData(result.data);
      } else {
        // ✅ OPCIÓN 2: Actualización manual de todos los campos
        setOriginalData(prev => {
          const updated = { ...prev };
          
          if (payload.title !== undefined) updated.title = payload.title;
          if (payload.description !== undefined) updated.description = payload.description;
          if (payload.status !== undefined) updated.status = payload.status;
          if (payload.operationType !== undefined) updated.operationType = payload.operationType;
          if (payload.propertyTypeId !== undefined) {
            // Buscar el tipo de propiedad en la lista cargada
            updated.propertyType = propertyTypes.find(t => t.id === payload.propertyTypeId);
          }
          if (payload.assignedAgentId !== undefined) {
            // Buscar el usuario en la lista cargada
            updated.assignedAgent = users.find(u => u.id === payload.assignedAgentId) || null;
          }
          if (payload.isFeatured !== undefined) updated.isFeatured = payload.isFeatured;
          
          return updated;
        });
      }

      if (onSave && result.data) {
        onSave(result.data as Property);
      }
    } else {
      showAlert({
        message: result.error || 'No se pudo actualizar la información básica',
        type: 'error',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('❌ [usePropertyForm] Error al actualizar básica:', error);
    showAlert({
      message: 'Error al actualizar la información básica',
      type: 'error',
      duration: 5000
    });
  } finally {
    setSavingBasic(false);
  }
}, [formData, users, propertyTypes, showAlert, onSave]);
```

---

## 6️⃣ CORRECCIÓN: Interfaz BasicSectionProps (MEDIA)

### ❌ Código Actual
```typescript
export interface BasicSectionProps extends BaseSectionProps {
  propertyTypes: PropertyType[];
  users: User[];
  saving: boolean;  // ❌ Falta onSave
}
```

### ✅ Código Corregido
```typescript
export interface BasicSectionProps extends BaseSectionProps {
  propertyTypes: PropertyType[];
  users: User[];
  saving: boolean;
  onSave?: () => Promise<void>;  // ✅ Agregado explícitamente
}
```

**Actualizar también en BasicSection.tsx para ser consistente:**
```typescript
export default function BasicSection({
  property,
  propertyTypes,
  users,
  onChange,
  onSave,
  saving
}: BasicSectionProps) {
  // ... componente
}
```

---

## 7️⃣ CORRECCIÓN: Manejo de Promesas en Hook

### ❌ Código Actual
```typescript
const handleUpdateBasic = useCallback(async (payload: UpdatePropertyBasicDto) => {
  if (!formData) return;  // ⚠️ Silent return
  // ...
}, [formData, alert, onSave]);
```

### ✅ Código Corregido
```typescript
const handleUpdateBasic = useCallback(async (payload: UpdatePropertyBasicDto) => {
  if (!formData) {
    const message = 'No hay datos de propiedad disponibles';
    showAlert({ message, type: 'error', duration: 3000 });
    return false;  // ✅ Retorna flag de éxito/fallo
  }

  setSavingBasic(true);
  try {
    const result = await updatePropertyBasic(formData.id, payload);
    
    if (!result.success) {
      throw new Error(result.error || 'Error desconocido');
    }

    showAlert({
      message: 'Actualizado exitosamente',
      type: 'success',
      duration: 3000
    });

    return true;  // ✅ Indica éxito
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al guardar';
    showAlert({ message, type: 'error', duration: 5000 });
    return false;  // ✅ Indica fallo
  } finally {
    setSavingBasic(false);
  }
}, [formData, showAlert, onSave]);
```

**En BasicSection.tsx:**
```typescript
const handleUpdateBasic = async () => {
  if (!onSave) return;
  
  const success = await onSave();  // ✅ Captura resultado
  if (!success) {
    console.warn('No se guardó correctamente');
  }
};
```

---

## 8️⃣ CORRECCIÓN: Sidebar Responsivo (MEDIA)

### ❌ Código Actual
```tsx
<span className="truncate hidden md:inline">{section.label}</span>
```

### ✅ Código Corregido
```tsx
'use client';

import { useState } from 'react';

interface PropertySidebarProps {
  sections: Array<{ id: string; label: string; icon: string }>;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  className?: string;
}

export default function PropertySidebar({
  sections,
  activeSection,
  onSectionChange,
  className = ''
}: PropertySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`bg-background text-foreground flex flex-col shadow-lg border-r border-border/20 overflow-y-auto ${className} ${isCollapsed ? 'w-20' : ''}`}>
      <nav className="flex-1 p-4 overflow-y-auto">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-4 p-2 hover:bg-muted rounded-lg w-full"
          title={isCollapsed ? 'Expandir' : 'Contraer'}
          aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          <span className="material-symbols-outlined text-lg">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>

        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left px-2 py-2 rounded-lg transition-all duration-200 font-medium text-sm group relative flex items-center gap-3 ${
                  activeSection === section.id
                    ? 'text-secondary bg-secondary/5'
                    : 'text-foreground/90 hover:text-foreground'
                }`}
                title={section.label}  // ✅ Tooltip en mobile
                aria-current={activeSection === section.id ? 'page' : undefined}
                data-test-id={`section-${section.id}`}
              >
                <span className={`material-symbols-outlined text-lg flex-shrink-0 ${
                  activeSection === section.id ? 'text-secondary' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {section.icon}
                </span>

                {/* Label: mostrar siempre en desktop, solo con tooltip en mobile */}
                <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>
                  {section.label}
                </span>

                {/* Indicador visual para mobile cuando está activo */}
                {activeSection === section.id && (
                  <span className="material-symbols-outlined text-sm ml-auto text-secondary flex-shrink-0">
                    check_circle
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
```

---

## 9️⃣ CORRECCIÓN: Loading Skeleton

### ❌ Código Actual
```typescript
{Array.from({ length: 8 }).map((_, i) => (
  <div 
    key={i} 
    className="h-10 bg-neutral-200 rounded animate-pulse"
  ></div>
))}
```

### ✅ Código Corregido
```typescript
{/* Sidebar skeleton - ESTRUCTURA REAL */}
{Array.from({ length: 8 }).map((_, i) => (
  <div
    key={i}
    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg bg-neutral-200 animate-pulse"
  >
    {/* Icon skeleton */}
    <div className="w-6 h-6 rounded-full bg-neutral-300 flex-shrink-0"></div>
    {/* Label skeleton */}
    <div className="flex-1 h-4 bg-neutral-300 rounded w-24"></div>
  </div>
))}
```

---

## 🔟 Archivo de Tipos Actualizado

### ✅ property.types.ts (Corregido)
```typescript
// Types and interfaces for FullProperty component

/**
 * Tipo de propiedad en el sistema
 */
export interface PropertyType {
  id: string;
  name: string;
  description?: string;
}

/**
 * Usuario del sistema (agente, administrador, etc.)
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role?: 'ADMIN' | 'AGENT' | 'USER';
  personalInfo?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  } | null;
}

/**
 * Item multimedia asociado a propiedad
 */
export interface MultimediaItem {
  id: string;
  url: string;
  filename: string;
  type: 'image' | 'video' | 'document';
  format: string;
  fileSize?: number;
  uploadedAt?: string;
}

/**
 * Entrada del historial de cambios
 */
export interface ChangeHistoryEntry {
  id?: string;
  timestamp: Date | string;
  changedBy: string;
  changedByName?: string;
  field: string;
  previousValue: any;
  newValue: any;
}

/**
 * Entrada de vista/visita a propiedad
 */
export interface ViewEntry {
  userId: string;
  userName?: string;
  duration?: number;
  viewedAt: string;
}

/**
 * Entrada de lead/interés
 */
export interface LeadEntry {
  id?: string;
  timestamp: string;
  status: string;
  contactName?: string;
  contactEmail?: string;
  [key: string]: any;
}

/**
 * Solicitud de publicación de propiedad
 */
export interface PostRequest {
  requestedAt?: string;
  requestedBy?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  message?: string;
  notes?: string;
  status?: string;
}

/**
 * Entidad principal de Propiedad
 */
export interface Property {
  id: string;
  title: string;
  description?: string;
  status: 'REQUEST' | 'PRE_APPROVED' | 'PUBLISHED' | 'INACTIVE' | 'SOLD' | 'RENTED' | 'CONTRACT_IN_PROGRESS';
  operationType: 'SALE' | 'RENT';
  creatorUser?: User;
  assignedAgent?: User | null;
  price: number;
  currencyPrice: string;
  seoTitle?: string;
  seoDescription?: string;
  publicationDate?: string;
  isFeatured: boolean;
  propertyType?: PropertyType;
  builtSquareMeters?: number;
  landSquareMeters?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floors?: number;
  constructionYear?: number;
  state?: string;
  city?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  multimedia?: MultimediaItem[];
  mainImageUrl?: string;
  postRequest?: PostRequest;
  favoritesCount?: number;
  leadsCount?: number;
  viewsCount?: number;
  internalNotes?: string;
  views?: ViewEntry[];
  changeHistory?: ChangeHistoryEntry[];
  leads?: LeadEntry[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  publishedAt?: string | null;
}

export interface Region {
  id: string;
  label: string;
}

/**
 * DTO para actualizar información básica de propiedad
 */
export interface UpdatePropertyBasicDto {
  title?: string;
  description?: string;
  status?: string;
  operationType?: string;
  propertyTypeId?: string;
  assignedAgentId?: string;
  isFeatured?: boolean;
}

// ====== PROPS INTERFACES ======

/**
 * Props base para todas las secciones
 */
export interface BaseSectionProps {
  /** Los datos de la propiedad */
  property: Property;
  /** Callback para cuando cambia un campo */
  onChange: (field: string, value: any) => void;
  /** Callback opcional para guardar cambios */
  onSave?: () => Promise<boolean>;
}

/**
 * Props para BasicSection
 */
export interface BasicSectionProps extends BaseSectionProps {
  propertyTypes: PropertyType[];
  users: User[];
  saving: boolean;
  onSave?: () => Promise<boolean>;
}

/**
 * Props para LocationSection
 */
export interface LocationSectionProps extends BaseSectionProps {
  regions: Region[];
}

/**
 * Props para HistorySection
 */
export interface HistorySectionProps extends BaseSectionProps {}

/**
 * Props para PriceSection
 */
export interface PriceSectionProps extends BaseSectionProps {}

/**
 * Props para FeaturesSection
 */
export interface FeaturesSectionProps extends BaseSectionProps {}

/**
 * Props para MultimediaSection
 */
export interface MultimediaSectionProps extends BaseSectionProps {}

/**
 * Props para PostRequestSection
 */
export interface PostRequestSectionProps {
  property: Property;
}

/**
 * Props para DatesSection
 */
export interface DatesSectionProps {
  property: Property;
}
```

---

## 📋 Orden de Implementación Recomendado

1. **Día 1:**
   - [ ] Arreglar useAlert en usePropertyData.ts
   - [ ] Validar regionsResult
   - [ ] Actualizar interfaz BasicSectionProps

2. **Día 2:**
   - [ ] Corregir sincronización de originalData
   - [ ] Agregar dependencias en useEffect
   - [ ] Mejorar manejo de promesas

3. **Día 3:**
   - [ ] Testing de flujos críticos
   - [ ] Mejorar UX sidebar
   - [ ] Documentación

