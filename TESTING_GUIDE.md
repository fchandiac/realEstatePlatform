# 🧪 GUÍA DE TESTING - Mejoras FullProperty

**Implementación:** 2025-11-14  
**Estado:** Listo para Testing  
**Cambios:** 9 mejoras en 5 archivos

---

## ✅ Checklist de Testing Manual

### 1. 🧪 Cargar Propiedad Existente

```
[ ] Ir a backOffice → Properties
[ ] Hacer click en una propiedad
[ ] Verificar que se carga el componente FullProperty
[ ] Verificar que NO hay errores en console
```

**Qué verificar:**
- ✅ Loading skeleton debe desaparecer
- ✅ Datos de propiedad deben aparecer
- ✅ Sidebar con secciones debe ser visible
- ✅ BasicSection con formulario debe cargar
- ✅ Console sin errores

---

### 2. 🔴 Cargar Propiedad No-Existente

```
[ ] Cambiar URL a una propiedad con ID inválido
[ ] Verificar error handling
[ ] Verificar que showAlert aparece (NUEVO)
```

**Qué verificar (ANTES vs DESPUÉS):**
- ❌ ANTES: Error silencioso, usuario no sabía qué pasó
- ✅ DESPUÉS: Alerta roja con mensaje de error

---

### 3. 👥 Selects de Agentes

```
[ ] En BasicSection → "Agente Asignado"
[ ] Hacer click en el select
[ ] Verificar que lista de agentes aparece
```

**Qué verificar (MEJORA #3):**
- ✅ ANTES: Select vacío (ERROR: usersResult no se validaba)
- ✅ DESPUÉS: Select lleno con opciones de agentes

---

### 4. 🗺️ Sección Location

```
[ ] Click en "Ubicación" en sidebar
[ ] Verificar que se carga LocationSection
[ ] Verificar select de regiones
```

**Qué verificar (MEJORA #2):**
- ✅ ANTES: Posible crash si regiones vacío
- ✅ DESPUÉS: Carga segura con validación

---

### 5. 💾 Guardar Cambios - Información Básica

```
[ ] En BasicSection:
    [ ] Cambiar título
    [ ] Cambiar descripción
    [ ] Cambiar estado
    [ ] Click "Actualizar información básica"
[ ] Verificar que se guarda (MEJORADO)
[ ] Verificar que form no muestra "cambios" falsos
```

**Qué verificar (MEJORA #5):**
- ✅ ANTES: Form mostraba "cambios no guardados" después de guardar
- ✅ DESPUÉS: Form limpio, sincronizado correctamente

---

### 6. 📱 Mobile UX - Sidebar

```
[ ] Abrir en device móvil (chrome dev tools)
[ ] Verificar sidebar responsive
[ ] Hacer click en secciones
```

**Qué verificar (MEJORA #7):**
- ✅ ANTES: Icon chevron_right, sin feedback visual en mobile
- ✅ DESPUÉS: 
  - Check circle cuando activo
  - Tooltip con nombre de sección
  - Background color cuando activo
  - Accesible (aria-labels)

---

### 7. ⚠️ Errores de Red

```
[ ] Con DevTools:
    [ ] Abrir Network tab
    [ ] Simular connection lenta (Slow 3G)
    [ ] Cargar propiedad
[ ] Desconectar internet
    [ ] Intentar guardar cambios
    [ ] Verificar error message
```

**Qué verificar (MEJORA #1, #9):**
- ✅ ANTES: Errores silenciosos
- ✅ DESPUÉS: Alertas con mensajes claros

---

### 8. 🔄 Refresh y Persistencia

```
[ ] Hacer cambios en un campo
[ ] Guardar
[ ] Refresh la página (F5)
[ ] Verificar que cambios persisten
```

**Qué verificar:**
- ✅ Cambios deben persistir en backend
- ✅ Form debe cargar con datos guardados

---

## 🎯 Testing por Función

### Cambio #1: useAlert Hook
```
Prueba: Cargar propiedad con ID inválido
Esperado: Alerta roja con mensaje de error
Cómo verificar: 
  1. Console.log de showAlert debe ejecutarse
  2. alert { message, type: 'error', duration: 5000 }
```

### Cambio #2: Validar regionsResult
```
Prueba: Ir a Location section
Esperado: Select de regiones funcional
Cómo verificar:
  1. Hacer click en select de regiones
  2. Debe aparecer lista sin error
```

### Cambio #3: Validar usersResult
```
Prueba: Ir a BasicSection → Agente Asignado
Esperado: Select con lista de agentes
Cómo verificar:
  1. Hacer click en select
  2. Debe aparecer lista de usuarios
  3. Poder seleccionar uno
```

### Cambio #4: useCallback Dependencias
```
Prueba: Abrir DevTools → Console
Esperado: NO debe haber warnings de ESLint
Cómo verificar:
  1. No debe haber "React Hook has missing dependencies"
  2. Funcionalidad debe ser la misma
```

### Cambio #5: Sincronizar originalData
```
Prueba: 
  1. Cambiar título
  2. Guardar
  3. Verificar que no muestra "cambios no guardados"
Esperado: Form limpio después de guardar
```

### Cambio #6: BasicSectionProps Interface
```
Prueba: npm run build en frontend
Esperado: Sin TypeScript errors
Cómo verificar:
  1. onSave debe ser Promise<boolean>
  2. Sin warnings de tipos incompletos
```

### Cambio #7: Sidebar Mobile
```
Prueba: Abrir en mobile
Esperado: Mejor UX y feedback visual
Verificar:
  1. Check circle cuando está activo
  2. Tooltip al hover
  3. aria-labels en buttons
```

### Cambio #8: handleUpdateBasic Retorno
```
Prueba: BasicSection → Guardar
Esperado: onSave retorna boolean (éxito/fallo)
Verificar:
  1. Guardar exitoso: true
  2. Guardar fallido: false
```

### Cambio #9: Manejo de Errores
```
Prueba: Provocar errores en diferentes escenarios
Esperado: showAlert consistente en todo el hook
Verificar:
  1. Error de carga de datos
  2. Error de guardado
  3. Error de validación
```

---

## 📊 Resultados Esperados

### Antes de Mejoras
- ❌ Errores silenciosos
- ❌ Selects vacíos
- ❌ Form desincronizado
- ❌ UX pobre en mobile
- ❌ Warnings de ESLint

### Después de Mejoras
- ✅ Errores notificados
- ✅ Selects funcionan
- ✅ Form sincronizado
- ✅ Mejor UX mobile
- ✅ Sin warnings

---

## 🐛 Posibles Problemas y Soluciones

### Problema: Select de agentes aún vacío
```
Solución: Verificar que API /users/admins retorna datos correctamente
Debug: Console.log(usersResult.data) en usePropertyData
```

### Problema: Form muestra "cambios" después de guardar
```
Solución: Verificar que originalData se actualiza completamente
Debug: Añadir console.log en handleUpdateBasic después de guardar
```

### Problema: Sidebar no muestra check_circle
```
Solución: Verificar que CSS está compilando correctamente
Debug: Inspeccionar elemento en DevTools
```

### Problema: Error al cargar pero no aparece alert
```
Solución: Verificar que useAlert está importado correctamente
Debug: Console.error debe mostrar el error
```

---

## ✅ Criterios de Aceptación

Para que el testing sea exitoso:

- [ ] Todas las secciones se cargan sin errores
- [ ] Los errores se notifican al usuario (NUEVO)
- [ ] Los selects tienen datos
- [ ] Guardar cambios funciona
- [ ] Form se sincroniza correctamente
- [ ] Sidebar mobile es funcional
- [ ] Console está limpia (sin errors)
- [ ] No hay TypeScript errors

---

## 🚀 Después de Testing

Si todo pasa:

```bash
# Verificar build
npm run build

# Verificar lint
npm run lint

# Crear commit
git add .
git commit -m "refactor(fullProperty): improve error handling, data validation, and mobile UX

- Fix useAlert hook usage in usePropertyData
- Add proper validation for regionsResult and usersResult
- Improve error notifications with showAlert
- Synchronize originalData completely after save
- Add useCallback dependencies for useEffect
- Improve sidebar mobile UX with check_circle and aria-labels
- Update BasicSectionProps interface with onSave type

Fixes: Errors not notified, users select empty, form desync issues"

# Push
git push origin feature/fullproperty-improvements
```

---

## 📝 Notas Importantes

1. **Cambios No Afectan Lógica de Negocio**
   - Solo mejoramientos de confiabilidad y UX
   - Mismos endpoints backend
   - Sin cambios en BD

2. **Backward Compatible**
   - Todos los cambios son internos
   - API no cambió
   - Props pueden retornar boolean

3. **Seguro para Producción**
   - TypeScript validado
   - Sin breaking changes
   - Mejora estabilidad general

---

**¡Listo para testing! 🎉**

