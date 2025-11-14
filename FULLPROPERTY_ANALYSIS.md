# Análisis de Errores - Componente FullProperty

## 📋 Resumen Ejecutivo

El componente `FullProperty.tsx` y sus componentes asociados presentan **múltiples errores de diseño y funcionales** que afectan la usabilidad, mantenibilidad y confiabilidad del sistema. Estos errores se distribuyen en 7 categorías principales.

---

## 🔴 ERRORES CRÍTICOS (Impacto Alto)

### 1. **Hook useAlert() Usado Incorrectamente**
**Archivo:** `usePropertyData.ts`, línea 26  
**Severidad:** 🔴 CRÍTICA

```typescript
const alert = useAlert();
// ...
alert.error(errorMessage);
```

**Problema:**
- El hook `useAlert()` espera un objeto con propiedades `{ message, type, duration }`
- El código intenta llamar `alert.error()` que no existe
- Genera error en runtime: `TypeError: alert.error is not a function`

**Impacto:** Los errores de carga de datos nunca se notifican al usuario correctamente

**Solución:**
```typescript
const { showAlert } = useAlert();
// ...
showAlert({ message: errorMessage, type: 'error', duration: 5000 });
```

---

### 2. **Destrucción Incorrecta del Objeto de Usuarios**
**Archivo:** `usePropertyData.ts`, línea 50  
**Severidad:** 🔴 CRÍTICA

```typescript
if (usersResult.success && usersResult.data) {
  setUsers(usersResult.data.data || []);  // ❌ INCORRECTO
}
```

**Problema:**
- La acción `listAdminsAgents({})` devuelve: `{ success, data: { data: [...], count: ... } }`
- El código intenta acceder a `usersResult.data.data` cuando debería ser `usersResult.data.data` directamente
- Esto requiere verificar la estructura real

**Impacto:** Los usuarios (agentes) nunca se cargan correctamente, causando fallos en selects

**Solución:** Verificar estructura real y ajustar:
```typescript
setUsers(Array.isArray(usersResult.data) ? usersResult.data : usersResult.data.data || []);
```

---

### 3. **Falta de Manejo de Promesas en Hook**
**Archivo:** `usePropertyForm.ts`, línea 87  
**Severidad:** 🔴 CRÍTICA

```typescript
const handleUpdateBasic = useCallback(async (payload: UpdatePropertyBasicDto) => {
  // ... NO hay validación de que formData exista
  if (!formData) return;  // ⚠️ Silent return, sin error
  // ...
}, [formData, alert, onSave]);
```

**Problema:**
- El hook retorna `undefined` silenciosamente en caso de error
- El componente que lo llama no sabe si la operación falló o no
- No hay forma de saber si `updatePropertyBasic` se ejecutó

**Impacto:** El componente BasicSection recibe una Promise rechazada

**Solución:** Lanzar error o retornar objeto con estado
```typescript
const handleUpdateBasic = useCallback(async (payload: UpdatePropertyBasicDto) => {
  if (!formData) {
    alert.error('No hay datos de propiedad');
    throw new Error('Property data not available');
  }
  // ...
}, [formData, alert, onSave]);
```

---

## 🟠 ERRORES ALTOS (Impacto Medio-Alto)

### 4. **Dependencia Faltante en useEffect**
**Archivo:** `usePropertyForm.ts`, línea 32  
**Severidad:** 🟠 ALTO

```typescript
useEffect(() => {
  setFormData(initialProperty);
  setOriginalData(initialProperty);
}, [initialProperty]);  // ✅ Correcto
```

**Pero en usePropertyData.ts línea 28:**
```typescript
const loadData = async () => {
  // ...
};

useEffect(() => {
  if (propertyId) {
    loadData();
  }
}, [propertyId]);  // ⚠️ Falta incluir 'alert'
```

**Problema:**
- El linter debería advertir sobre dependencia faltante `alert` en `useEffect`
- `loadData` captura `alert` pero no está en las dependencias
- Puede causar comportamiento inesperado

**Solución:**
```typescript
useEffect(() => {
  if (propertyId) {
    loadData();
  }
}, [propertyId, alert]);
```

---

### 5. **Inconsistencia en Actualización de originalData**
**Archivo:** `usePropertyForm.ts`, línea 125-134  
**Severidad:** 🟠 ALTO

```typescript
setOriginalData(prev => ({
  ...prev,
  title: payload.title || prev.title,
  description: payload.description !== undefined ? payload.description : prev.description,
  status: payload.status || prev.status,
  operationType: payload.operationType || prev.operationType,
  isFeatured: payload.isFeatured !== undefined ? payload.isFeatured : prev.isFeatured,
}));
```

**Problema:**
- Solo actualiza 5 campos, pero `UpdatePropertyBasicDto` podría tener más
- Los campos `propertyTypeId` y `assignedAgentId` del payload NO se reflejan en `originalData`
- Esto causará que el usuario vea "cambios no guardados" después de guardar
- Inconsistencia: algunos campos verifican `!== undefined`, otros usan `||`

**Impacto:** El form nunca refleja correctamente el estado guardado

**Solución:**
```typescript
if (result.data) {
  setFormData(result.data);
  setOriginalData(result.data);
} else {
  // Actualizar manualmente
  setOriginalData(prev => ({ ...prev, ...payload }));
}
```

---

### 6. **Props Derivadas No Se Sincronizan**
**Archivo:** `usePropertyForm.ts` + `FullProperty.tsx`  
**Severidad:** 🟠 ALTO

**En BasicSection, línea 73-81:**
```typescript
<Select
  placeholder="Tipo de Propiedad"
  value={property.propertyType?.id || ''}
  onChange={(value) => {
    const selectedType = propertyTypes.find(type => type.id === value);
    onChange('propertyType', selectedType);  // ❌ Actualiza objeto completo
  }}
  options={propertyTypes.map(type => ({
    id: type.id,
    label: type.name
  }))}
/>
```

**Problema:**
- `onChange` actualiza el objeto completo `propertyType`
- Pero el payload a guardar usa `propertyTypeId` (string)
- En `handleUpdateBasic`, se extrae correctamente: `propertyTypeId: formData.propertyType?.id`
- Pero esto requiere que el objeto esté sincronizado correctamente

**Impacto:** Errores silenciosos cuando se intenta guardar sin cambiar el select

---

### 7. **Falta de Validación de Cargas Paralelas**
**Archivo:** `usePropertyData.ts`, línea 36-47  
**Severidad:** 🟠 ALTO

```typescript
const [propertyResult, typesResult, usersResult, regionsResult] = await Promise.all([
  getFullProperty(propertyId),
  listPropertyTypes(),
  listAdminsAgents({}),
  getRegiones()
]);

// Luego verifica cada uno, pero con inconsistencia:
if (propertyResult.success && propertyResult.data) { /* ... */ }
if (typesResult.success && typesResult.data) { /* ... */ }
if (usersResult.success && usersResult.data) { /* ... */ }
// ⚠️ regions NO se verifica si es error
console.log('🗺️ [usePropertyData] Regiones cargadas:', regionsResult.length);
setRegions(regionsResult);
```

**Problema:**
- `regionsResult` puede ser `undefined` o un error, pero el código lo usa directamente
- No hay validación: `?.length` podría fallar si es undefined
- Si `listPropertyTypes()` falla, `propertyTypes` queda vacío sin advertencia clara

**Impacto:** Crashes no esperados cuando algún endpoint retorna error

---

## 🟡 ERRORES MEDIANOS (Impacto Medio)

### 8. **Tipo `BasicSectionProps` Incoherente**
**Archivo:** `property.types.ts`, línea 143-150  
**Severidad:** 🟡 MEDIO

```typescript
export interface BasicSectionProps extends BaseSectionProps {
  propertyTypes: PropertyType[];
  users: User[];
  saving: boolean;  // ⚠️ Falta 'onSave'
}
```

**Pero en BasicSection.tsx, línea 9:**
```typescript
export default function BasicSection({
  property,
  propertyTypes,
  users,
  onChange,
  onSave,  // ❌ Recibe pero no está en la interfaz
  saving
}: BasicSectionProps) {
```

**Problema:**
- Interfaz no documenta correctamente todos los props
- TypeScript debería lanzar error pero el componente es 'as any' en algún lado
- Dificulta el mantenimiento y causa confusión

**Solución:**
```typescript
export interface BasicSectionProps extends BaseSectionProps {
  propertyTypes: PropertyType[];
  users: User[];
  saving: boolean;
  onSave?: () => Promise<void>;
}
```

---

### 9. **Ícono Animado Que Se Repite**
**Archivo:** `PropertySidebar.tsx`, línea 33  
**Severidad:** 🟡 MEDIO

```typescript
{activeSection === section.id && (
  <span className="material-symbols-outlined text-xs ml-auto text-secondary animate-pulse">
    chevron_right
  </span>
)}
```

**Problema:**
- El chevron con `animate-pulse` está dentro del botón que YA cambia de color
- Crea redundancia visual
- En mobile puede parecer glitch

**Impacto:** UX confusa, animación innecesaria

---

### 10. **Estructura de Sidebar No Responsiva**
**Archivo:** `PropertySidebar.tsx`, línea 24  
**Severidad:** 🟡 MEDIO

```typescript
<span className="truncate hidden md:inline">{section.label}</span>
```

**Problema:**
- En mobile, solo muestra el icono
- No hay indicador visual de qué sección está activa en mobile (solo el icono)
- No es accesible para screen readers

**Impacto:** Mobile users no pueden saber qué sección está activa

---

### 11. **Loading Skeleton Incorrecto**
**Archivo:** `FullProperty.tsx`, línea 50-70  
**Severidad:** 🟡 MEDIO

```typescript
{Array.from({ length: 8 }).map((_, i) => (
  <div 
    key={i} 
    className="h-10 bg-neutral-200 rounded animate-pulse"
  ></div>
))}
```

**Problema:**
- El skeleton no refleja la estructura real del sidebar
- Los items del sidebar tienen altura variable según el texto
- Crea expectativa incorrecta sobre el layout

**Impacto:** Layout shift cuando carga completamente

---

## 🔵 ERRORES BAJOS (Impacto Bajo)

### 12. **Tipos de Datos Impreciso**
**Archivo:** `property.types.ts`, línea 42, 89, 96  
**Severidad:** 🔵 BAJO

```typescript
timestamp: Date | string;  // ⚠️ Inconsistente
viewedAt: string;  // pero aquí es solo string
createdAt: string;  // y aquí también
```

**Problema:**
- Mezcla `Date | string` con `string`
- Sin normalización, el código debe hacer casteos
- Dificulta debugging

---

### 13. **Falta documentación JSDoc**
**Archivos:** Todos excepto `usePropertyData.ts`  
**Severidad:** 🔵 BAJO

```typescript
export interface BasicSectionProps extends BaseSectionProps {
  // Sin documentación de qué significa cada prop
  propertyTypes: PropertyType[];
  users: User[];
  saving: boolean;
}
```

**Problema:**
- Nuevos desarrolladores no saben qué hace cada componente
- Sin ejemplos de uso

---

### 14. **Imports No Organizados**
**Archivo:** `BasicSection.tsx`, línea 1-9  
**Severidad:** 🔵 BAJO

```typescript
import { TextField } from '@/components/TextField/TextField';
import Select from '@/components/Select/Select';
import Switch from '@/components/Switch/Switch';
import { Button } from '@/components/Button/Button';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
```

**Problema:**
- Inconsistencia: algunos usan named imports, otros default
- Orden alfabético no respetado

**Solución:**
```typescript
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import Select from '@/components/Select/Select';
import Switch from '@/components/Switch/Switch';
import { Button } from '@/components/Button/Button';
import { TextField } from '@/components/TextField/TextField';
```

---

## 📊 Resumen de Errores por Tipo

| Tipo | Cantidad | Severidad |
|------|----------|-----------|
| Lógica | 6 | 🔴 CRÍTICA |
| Tipos | 3 | 🟠 ALTA |
| UX | 3 | 🟡 MEDIA |
| Mantenibilidad | 2 | 🔵 BAJA |

---

## 🛠️ Recomendaciones de Prioridad

### Fase 1 (Inmediata - Sprint Actual)
- ✅ Arreglar `useAlert()` - Afecta toda notificación de errores
- ✅ Arreglar estructura de `usersResult` - Impide que funcione
- ✅ Arreglar validación de `regionsResult` - Crash potencial
- ✅ Corregir interfaz `BasicSectionProps` - Error de tipos

### Fase 2 (Próximo Sprint)
- ✅ Sincronización de `originalData` con campos guardados
- ✅ Dependencias en `useEffect`
- ✅ Manejo de promesas rechazadas

### Fase 3 (Backlog)
- ✅ Mejorar UX mobile del sidebar
- ✅ Documentación JSDoc
- ✅ Normalizar tipos Date/string
- ✅ Organizar imports

---

## 📝 Checklist de Correcciones

- [ ] Implementar `useAlert` correctamente
- [ ] Validar estructura de `usersResult`
- [ ] Agregar validación para `regionsResult`
- [ ] Actualizar interfaz `BasicSectionProps`
- [ ] Sincronizar `originalData` después de guardar
- [ ] Agregar dependencias en `useEffect`
- [ ] Manejar promesas rechazadas
- [ ] Mejorar skeleton loading
- [ ] Documentar componentes con JSDoc
- [ ] Testing e2e para flujos de guardado

---

## 💡 Notas Adicionales

- El componente es demasiado complejo para una sola entidad. Considerar dividir en sub-componentes más pequeños
- Falta manejo de estados de error específicos (red error, 404, 500, etc.)
- No hay retry logic para fallos de red
- El componente no implementa optimistic updates
- Los cambios no guardados no se persisten (ej: en sessionStorage)

