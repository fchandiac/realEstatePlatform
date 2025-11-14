# 🎨 Diagrama Visual de Errores - FullProperty Component

## Flujo de Datos (CON ERRORES SEÑALADOS)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FullProperty Component                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
           ┌────────▼────────┐  ┌──────▼──────────┐
           │ usePropertyData │  │ usePropertyForm │
           └────────┬────────┘  └──────┬──────────┘
                    │                   │
        ❌ ERROR #1 ┌─┴──────────────────┘
        useAlert()  │
        incorrecta  │
                    │
        ❌ ERROR #2 │  Promise.all([
        regions sin │    getFullProperty() ─ ✅
        validación  │    listPropertyTypes() ─ ✅
                    │    listAdminsAgents() ─ ❌ (ERROR #3: users)
        ❌ ERROR #4 │    getRegiones() ─ ❌ (sin validación)
        Deps falta  │  ])
        alert       │
                    │
                    └────────┬─────────────┐
                             │             │
                    ┌────────▼───┐  ┌─────▼──────┐
                    │ formData   │  │originalData│
                    │            │  │            │
                    └────────┬───┘  └─────┬──────┘
                             │            │
                ❌ ERROR #5  │ ❌ ERROR #6 │
                Props sync  │ Not synced  │
                inconsist.  │ completely  │
                             │            │
                    ┌────────▼────────────▼──┐
                    │   basicSection Props   │
                    │  ❌ propertyType      │
                    │  ❌ assignedAgent     │
                    │  ❌ onSave            │
                    └────────┬───────────────┘
                             │
                    ┌────────▼──────────┐
                    │  BasicSection    │
                    │                  │
                    │ ┌──────────────┐ │
                    │ │ TextField    │ │ ✅
                    │ │ Select       │ │ ❌ (agents not loading)
                    │ │ Switch       │ │ ✅
                    │ │ Save Button  │ │ ❌ (status unknown)
                    │ └──────────────┘ │
                    └───────┬──────────┘
                            │
                    ❌ ERROR #7
                    Promesa sin
                    validación
                            │
                    ┌───────▼─────────┐
                    │ updatePropertyB │
                    │ asic (ACTION)   │
                    └─────────────────┘
```

---

## Mapa de Errores por Componente

```
┌──────────────────────────────────────────────────────────────────┐
│ usePropertyData.ts                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔴 ERROR #1: useAlert() incorrecta (Línea 26)                 │
│     ├─ Síntoma: alert.error is not a function                 │
│     ├─ Causa: Uso de método que no existe                     │
│     ├─ Fix: const { showAlert } = useAlert()                  │
│     └─ Impacto: Errores nunca se notifican                    │
│                                                                  │
│  🔴 ERROR #3: usersResult destructuring (Línea 50)           │
│     ├─ Síntoma: Selects de agentes vacíos                     │
│     ├─ Causa: Estructura de datos inesperada                  │
│     ├─ Fix: Validar Array.isArray()                           │
│     └─ Impacto: Usuarios no se cargan                         │
│                                                                  │
│  🔴 ERROR #4: regionsResult sin validación (Línea 52)        │
│     ├─ Síntoma: TypeError si es undefined                     │
│     ├─ Causa: Acceso directo sin validación                   │
│     ├─ Fix: if (Array.isArray(regionsResult))                │
│     └─ Impacto: Crash en regiones                            │
│                                                                  │
│  🟠 ERROR #2: Dependencias en useEffect (Línea 28)           │
│     ├─ Síntoma: Comportamiento inesperado                     │
│     ├─ Causa: Falta 'alert' en dependencies                   │
│     ├─ Fix: [propertyId, alert]                               │
│     └─ Impacto: Stale closures                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ usePropertyForm.ts                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🟠 ERROR #5: originalData parcialmente actualizado (L.125-134)│
│     ├─ Síntoma: Form muestra "cambios no guardados"           │
│     ├─ Causa: Solo actualiza 5 de 7+ campos                   │
│     ├─ Fix: Actualizar propertyType y assignedAgent          │
│     └─ Impacto: UX confusa                                    │
│                                                                  │
│  🟠 ERROR #6: Props derived inconsistentes (L.87)            │
│     ├─ Síntoma: Guardado silencioso falla                     │
│     ├─ Causa: Objeto completo vs ID inconsistente            │
│     ├─ Fix: Sincronizar en save                              │
│     └─ Impacto: Errores de tipo en backend                    │
│                                                                  │
│  🟠 ERROR #7: Promesa sin validación retorno (L.87)          │
│     ├─ Síntoma: Unknown promise rejection                     │
│     ├─ Causa: Silent return si !formData                     │
│     ├─ Fix: Retornar boolean con error                       │
│     └─ Impacto: Componente no sabe si guardó                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ property.types.ts                                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🟡 ERROR #8: BasicSectionProps interface incompleta          │
│     ├─ Síntoma: Props mismatch con componente                 │
│     ├─ Causa: Falta onSave en interfaz                        │
│     ├─ Fix: Agregar onSave?: () => Promise<void>             │
│     └─ Impacto: TypeScript warnings                           │
│                                                                  │
│  🔵 ERROR #9: Tipos Date | string inconsistentes            │
│     ├─ Síntoma: Casting innecesarios                          │
│     ├─ Causa: Mezcla de tipos                                 │
│     ├─ Fix: Normalizar a string o Date consistentemente      │
│     └─ Impacto: Difícil debugging                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ PropertySidebar.tsx + FullProperty.tsx                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🟡 ERROR #10: Sidebar no responsiva en mobile (L.24)        │
│     ├─ Síntoma: Solo icon en mobile, sin indicador            │
│     ├─ Causa: hidden md:inline no muestra estado activo       │
│     ├─ Fix: Agregar indicador visual + tooltip                │
│     └─ Impacto: UX confusa en mobile                          │
│                                                                  │
│  🟡 ERROR #11: Loading skeleton incorrecto (L.60-70)         │
│     ├─ Síntoma: Layout shift al cargar                        │
│     ├─ Causa: Skeleton no refleja estructura real             │
│     ├─ Fix: Replicar estructura sidebar                       │
│     └─ Impacto: Layout shift, CLS issue                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Árbol de Dependencias de Errores

```
                        ┌─ ERROR #1 (useAlert)
                        │     ↓
                        │  Sin notificaciones
                        │     ↓
        ERROR #2 ─────┬─┤  ERROR #3 (users)
        (deps)        │ │     ↓
                      │ │  Selects vacíos
                      │ │     ↓
                      └─┼─ ERROR #4 (regions)
                        │     ↓
                        │  Crash potencial
                        │
        ERROR #5 ─────┬─┼─ ERROR #6 (props)
        (originalData)│ │     ↓
                      │ └─ ERROR #7 (promise)
                      │     ↓
                      └──  Form nunca sincroniza
```

---

## Matriz de Severidad vs Esfuerzo

```
IMPACTO
  HIGH   │  ❌ ERROR #1      ❌ ERROR #4
         │  ❌ ERROR #3      ❌ ERROR #5
         │
  MED    │  ❌ ERROR #2      ❌ ERROR #6  ❌ ERROR #7
         │  ⚠️ ERROR #8
         │
  LOW    │                  ⚠️ ERROR #10
         │                  ⚠️ ERROR #11
         │                  🔵 ERROR #9
         │
         └────────────────────────────────────────────── EFFORT
           5min  10min  20min  30min  1h   2h   3h+

Legend:
❌ = Crítica/Alta
⚠️ = Media  
🔵 = Baja
```

---

## Impacto por Caso de Uso

### Use Case: Cargar Propiedad

```
Usuario abre propiedad
        │
        ▼
    Loading (✅ OK)
        │
        ├─ usePropertyData llama Promise.all()
        │   ├─ getFullProperty() ─ ✅
        │   ├─ listPropertyTypes() ─ ✅
        │   ├─ listAdminsAgents() ─ ❌ ERROR #3
        │   └─ getRegiones() ─ ❌ ERROR #4
        │
        ├─ Si error en #3: Selects de agentes vacíos
        ├─ Si error en #4: Posible crash
        └─ Si error: ❌ ERROR #1 (alert no funciona)
                       Usuario no ve error
```

### Use Case: Actualizar Info Básica

```
Usuario edita título
        │
        ▼
    onChange('title', valor)
        │
        ▼
    formData actualizado ✅
        │
        ├─ Usuario hace click en "Guardar"
        │   │
        │   ├─ handleUpdateBasic() llamado
        │   │   ├─ if (!formData) return ❌ ERROR #7
        │   │   └─ Creando payload
        │   │       ├─ title ✅
        │   │       ├─ propertyTypeId ❌ ERROR #6 (inconsistente)
        │   │       ├─ assignedAgentId ❌ ERROR #6
        │   │       └─ resto ✅
        │   │
        │   ├─ updatePropertyBasic(id, payload)
        │   │   └─ Backend guarda
        │   │
        │   └─ setOriginalData() ❌ ERROR #5
        │       ├─ title actualizado ✅
        │       ├─ propertyType NO actualizado ❌
        │       ├─ assignedAgent NO actualizado ❌
        │       └─ formData aún tiene "cambios"
        │
        └─ Usuario ve "Cambios no guardados" aunque guardó ❌
```

---

## Recomendaciones por Rol

### Para Developers
1. Leer FULLPROPERTY_SOLUTIONS.md
2. Implementar en orden: ERROR #1, #3, #4, #2, #5, #6, #7
3. Testar cada cambio

### Para Code Reviewers
1. Verificar cada cambio con checklist
2. Buscar patrones similares en otros componentes
3. Verificar tests

### Para QA
1. Testar flujo completo de guardado
2. Testar con conexión lenta
3. Testar selects de usuarios
4. Testar en mobile

### Para PMs
1. Estos errores han estado en producción
2. Usuarios no ven algunos errores (ERROR #1)
3. Algunos campos no se guardan correctamente (ERROR #5)
4. Reporte detallado disponible en FULLPROPERTY_ANALYSIS.md

---

## Cronograma Visual

```
DÍA 1 (2-3 horas)
├─ 0:00-0:30  Implementar ERROR #1, #3, #4
├─ 0:30-1:00  Testing básico
├─ 1:00-1:30  Implementar ERROR #2, #5, #6, #7
├─ 1:30-2:00  Testing integral
└─ 2:00+      Code review + merge

DÍA 2-3 (2-3 horas)
├─ ERROR #8, #10, #11
├─ Documentación
└─ Tests e2e

BACKLOG (1-2 horas)
├─ ERROR #9
├─ Refactoring
└─ Mejoras arquitectónicas
```

