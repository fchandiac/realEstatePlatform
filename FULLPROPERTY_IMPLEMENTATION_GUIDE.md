# 🚀 Guía de Implementación - Correcciones FullProperty

## Pre-Requisitos
- [ ] Tener todo el código pusheado
- [ ] Branch `main` actualizado
- [ ] Entorno de desarrollo funcionando

---

## PASO 1: Corregir useAlert en usePropertyData.ts (5 min)

**Archivo:** `/root/apps/realEstatePlatform/frontend/app/backOffice/properties/ui/fullProperty/hooks/usePropertyData.ts`

**Cambios:**
1. Línea 6: Cambiar import
2. Línea 24: Desestructurar correctamente
3. Línea 60: Usar showAlert correctamente
4. Línea 77: Usar showAlert en catch

**Comandos de verificación:**
```bash
# Buscar uso incorrecto de alert
grep -n "alert\." frontend/app/backOffice/properties/ui/fullProperty/hooks/usePropertyData.ts

# Después del fix, no debería encontrar nada
```

**Prueba:**
- Abrir una propiedad inexistente
- Verificar que aparece error notificado
- Revisar console (no debe haber TypeError)

---

## PASO 2: Validar regionsResult (5 min)

**Archivo:** `usePropertyData.ts` líneas 52-54

**Cambio Simple:**
```typescript
// ANTES
console.log('🗺️ [usePropertyData] Regiones cargadas:', regionsResult.length);
setRegions(regionsResult);

// DESPUÉS
if (Array.isArray(regionsResult) && regionsResult.length > 0) {
  console.log('🗺️ [usePropertyData] Regiones cargadas:', regionsResult.length);
  setRegions(regionsResult);
} else {
  console.warn('⚠️ [usePropertyData] Sin regiones disponibles');
  setRegions([]);
}
```

**Prueba:**
- Cargar propiedad
- Ir a sección Location
- Verificar que SelectRegion funciona sin error

---

## PASO 3: Validar usersResult (10 min)

**Archivo:** `usePropertyData.ts` línea 50

**Verificación Previa:**
```bash
# Revisar qué retorna exactamente listAdminsAgents
# Buscar en backend:
grep -A 20 "listAdminsAgents" backend/src/modules/users/users.controller.ts
```

**Cambio:**
```typescript
// ANTES
if (usersResult.success && usersResult.data) {
  setUsers(usersResult.data.data || []);
}

// DESPUÉS (OPCIÓN SEGURA)
if (usersResult.success && usersResult.data) {
  let usersList = [];
  if (Array.isArray(usersResult.data)) {
    usersList = usersResult.data;
  } else if (Array.isArray(usersResult.data.data)) {
    usersList = usersResult.data.data;
  }
  setUsers(usersList);
} else {
  console.warn('⚠️ No se pudieron cargar usuarios');
  setUsers([]);
}
```

**Prueba:**
- Cargar propiedad
- En BasicSection, verificar que "Agente Asignado" tiene opciones
- Poder seleccionar un agente

---

## PASO 4: Corregir dependencias useEffect (5 min)

**Archivo:** `usePropertyData.ts` líneas 64-68

**Cambio:**
```typescript
// ANTES
useEffect(() => {
  if (propertyId) {
    loadData();
  }
}, [propertyId]);

// DESPUÉS
useEffect(() => {
  if (propertyId) {
    loadData();
  }
}, [propertyId, showAlert]);
```

**Verificación:**
```bash
# ESLint debería pasar sin warnings
npm run lint -- frontend/app/backOffice/properties/ui/fullProperty/hooks/usePropertyData.ts
```

---

## PASO 5: Actualizar Interfaz BasicSectionProps (5 min)

**Archivo:** `property.types.ts` línea 143-150

**Cambio:**
```typescript
// ANTES
export interface BasicSectionProps extends BaseSectionProps {
  propertyTypes: PropertyType[];
  users: User[];
  saving: boolean;
}

// DESPUÉS
export interface BasicSectionProps extends BaseSectionProps {
  propertyTypes: PropertyType[];
  users: User[];
  saving: boolean;
  /** Callback para guardar cambios básicos */
  onSave?: () => Promise<boolean>;
}
```

**Verificación:**
```bash
# Verificar no hay TypeScript errors
npm run build -- frontend
```

---

## PASO 6: Sincronizar originalData Completamente (15 min)

**Archivo:** `usePropertyForm.ts` línea 125-134

**Cambio Grande - Reemplazar handleUpdateBasic completo:**

```typescript
/**
 * Actualiza solo la información básica de la propiedad
 */
const handleUpdateBasic = useCallback(async (payload: UpdatePropertyBasicDto) => {
  if (!formData) {
    showAlert({
      message: 'No hay datos de propiedad disponibles',
      type: 'error',
      duration: 3000
    });
    return false;
  }

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

      // OPCIÓN 1: Si el backend retorna objeto completo
      if (result.data) {
        console.log('✅ [usePropertyForm] Backend retornó objeto actualizado');
        setFormData(result.data);
        setOriginalData(result.data);
        return true;
      }

      // OPCIÓN 2: Actualizar manualmente (fallback)
      setOriginalData(prev => {
        const updated = { ...prev };
        
        if (payload.title !== undefined) updated.title = payload.title;
        if (payload.description !== undefined) updated.description = payload.description;
        if (payload.status !== undefined) updated.status = payload.status;
        if (payload.operationType !== undefined) updated.operationType = payload.operationType;
        if (payload.isFeatured !== undefined) updated.isFeatured = payload.isFeatured;
        
        // IMPORTANTE: Actualizar también los objetos derivados
        if (payload.propertyTypeId !== undefined && propertyTypes.length > 0) {
          const foundType = propertyTypes.find(t => t.id === payload.propertyTypeId);
          if (foundType) {
            updated.propertyType = foundType;
          }
        }
        
        if (payload.assignedAgentId !== undefined && users.length > 0) {
          const foundUser = users.find(u => u.id === payload.assignedAgentId);
          updated.assignedAgent = foundUser || null;
        }
        
        return updated;
      });

      if (onSave && result.data) {
        onSave(result.data as Property);
      }

      return true;

    } else {
      showAlert({
        message: result.error || 'No se pudo actualizar la información básica',
        type: 'error',
        duration: 5000
      });
      return false;
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ [usePropertyForm] Error al actualizar básica:', message);
    showAlert({
      message: 'Error al actualizar la información básica',
      type: 'error',
      duration: 5000
    });
    return false;
  } finally {
    setSavingBasic(false);
  }
}, [formData, users, propertyTypes, showAlert, onSave]);
```

**Cambiar también el return type:**
```typescript
// En UsePropertyFormReturn interface
handleUpdateBasic: (payload: UpdatePropertyBasicDto) => Promise<boolean>;  // ← Cambiar a boolean
```

**Prueba:**
- Editar cualquier campo básico
- Guardar
- Verificar que form NO muestra "cambios no guardados" después
- Refresh página, verificar que cambios persisten

---

## PASO 7: Mejorar Manejo de Promesas (10 min)

**Archivo:** `BasicSection.tsx` línea 14-24

**Cambio:**
```typescript
// ANTES
const handleUpdateBasic = async () => {
  if (!onSave) return;
  
  const payload = {
    // ...
  };

  await onSave();
};

// DESPUÉS
const handleUpdateBasic = async () => {
  if (!onSave) {
    console.warn('⚠️ onSave no está disponible');
    return;
  }
  
  try {
    const success = await onSave();
    if (!success) {
      console.warn('⚠️ Guardado retornó false');
    }
  } catch (error) {
    console.error('❌ Error en handleUpdateBasic:', error);
    // Alert ya fue mostrado por el hook
  }
};
```

---

## PASO 8: Mejorar Sidebar Mobile (10 min)

**Archivo:** `PropertySidebar.tsx`

**Cambio:**
```tsx
// Agregar responsive improvements
<button
  onClick={() => onSectionChange(section.id)}
  className={`...`}
  title={section.label}  // ← Tooltip en mobile
  aria-label={`Ir a ${section.label}`}  // ← Accesibilidad
  aria-current={activeSection === section.id ? 'page' : undefined}
>
  {/* ... */}
  {activeSection === section.id && (
    <span className="material-symbols-outlined text-sm ml-auto text-secondary flex-shrink-0">
      check_circle  {/* ← Cambiar de chevron_right a check_circle */}
    </span>
  )}
</button>
```

---

## PASO 9: Testing Completo (20-30 min)

### Test Manual Checklist:

```
[ ] CARGA DE PROPIEDAD
  [ ] Abrir propiedad existente
  [ ] Verificar que se cargan todos los datos
  [ ] Verificar loading skeleton
  [ ] Verificar error handling (intentar propiedad no-existente)

[ ] INFORMACIÓN BÁSICA
  [ ] Editar título
  [ ] Editar descripción
  [ ] Cambiar estado
  [ ] Cambiar operación
  [ ] Cambiar tipo de propiedad
  [ ] Cambiar agente asignado ← Verificar que hay opciones
  [ ] Toggle destacada
  [ ] Guardar cambios
  [ ] Verificar que form limpia "cambios no guardados"
  [ ] Refresh y verificar que cambios persisten

[ ] ERRORES Y EDGE CASES
  [ ] Desconectar internet, intentar guardar
  [ ] Verificar error message aparece ← NUEVO: useAlert fix
  [ ] Reconectar y guardar
  [ ] Abrir dev tools, verificar no hay console errors
  [ ] Propiedad sin agente asignado → cambiar a agente
  [ ] Agente asignado → cambiar a "ninguno"

[ ] RESPONSIVIDAD
  [ ] Desktop: Sidebar con labels completos ✅
  [ ] Tablet: Sidebar con labels ✅
  [ ] Mobile: Sidebar contraída, check_circle indica activo ✅
  [ ] Mobile: Tooltip en hover muestra label ✅

[ ] PERFORMANCE
  [ ] Medir tiempo de carga de propiedad (< 2s)
  [ ] Medir tiempo de guardado (< 1s)
  [ ] Verificar no hay re-renders innecesarios
```

### Test Automatizado (si existe):
```bash
# Ejecutar tests existentes
npm test -- frontend/app/backOffice/properties/ui/fullProperty

# Esperar que pasen
```

---

## PASO 10: Code Review Checklist

Antes de hacer merge, verificar:

- [ ] useAlert se usa correctamente en todos lados (showAlert + { message, type, duration })
- [ ] Todas las dependencias en useEffect están correctas
- [ ] Promise.all tiene validación de CADA resultado
- [ ] originalData se sincroniza con TODOS los campos
- [ ] Los tipos TypeScript están actualizados
- [ ] No hay console.error o console.warn relevantes
- [ ] La interfaz BasicSectionProps tiene onSave documentado
- [ ] handleUpdateBasic retorna boolean
- [ ] Sidebar mejora mobile UX
- [ ] Tests pasan

---

## PASO 11: Deploy Checklist

- [ ] Todas las correcciones implementadas
- [ ] Tests pasando
- [ ] Code review aprobado
- [ ] Build sin errores: `npm run build -- frontend`
- [ ] No hay warnings críticos
- [ ] Cambios pusheados a branch de feature
- [ ] Pull request creada
- [ ] PR review aprobado
- [ ] Merge a main
- [ ] Deploying a staging
- [ ] Testing en staging

---

## Rollback Plan

Si algo falla en producción:

```bash
# Revertir cambios
git revert <commit-hash>

# O si es urgente
git revert -m 1 <merge-commit>

# Pushing
git push origin main

# Redeploy
# (dependiendo de tu CI/CD)
```

---

## Estimación de Tiempo

| Paso | Tiempo | Acumulado |
|------|--------|-----------|
| 1. useAlert | 5 min | 5 min |
| 2. regions | 5 min | 10 min |
| 3. users | 10 min | 20 min |
| 4. dependencies | 5 min | 25 min |
| 5. Types | 5 min | 30 min |
| 6. originalData | 15 min | 45 min |
| 7. Promises | 10 min | 55 min |
| 8. Sidebar | 10 min | 65 min |
| 9. Testing | 30 min | 95 min |
| 10. Code Review | 20 min | 115 min |
| **TOTAL** | | **~2 horas** |

---

## Notas Importantes

1. **Mantener orden:** Hacer los pasos en orden ayuda a debugging
2. **Testing después de cada paso:** No esperar hasta el final
3. **Commits pequeños:** Un commit por paso, no todo junto
4. **Branch:** Usar `fix/fullproperty-errors` o similar
5. **Messages claros:** Describir qué error se corrige

---

## Archivos a Revisar Después

- [ ] FULLPROPERTY_ANALYSIS.md - Referencia de errores
- [ ] FULLPROPERTY_SOLUTIONS.md - Código detallado
- [ ] FULLPROPERTY_SUMMARY.md - Resumen ejecutivo
- [ ] FULLPROPERTY_VISUAL_GUIDE.md - Diagramas

---

## Preguntas Comunes

**P: ¿Por qué el orden?**
R: Paso a paso permite identificar qué arregla qué problema

**P: ¿Qué pasa si un paso falla?**
R: Ir al análisis en FULLPROPERTY_ANALYSIS.md para ese error específico

**P: ¿Necesito actualizar tests?**
R: Si hay, sí. Buscar tests existentes del componente

**P: ¿Cómo sé si funcionó?**
R: Todos los checks en Testing Checklist deben pasar

