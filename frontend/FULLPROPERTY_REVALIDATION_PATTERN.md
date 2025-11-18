# Patrón de Revalidación para FullPropertyDialog

## 📝 Descripción

Cuando el usuario cierra el diálogo `FullPropertyDialog` después de hacer cambios en una propiedad, la ruta actual se revalida automáticamente para refrescar el grid o lista de propiedades.

Este patrón utiliza:
- **Hook personalizado**: `useFullPropertyRevalidation()` - Maneja la revalidación
- **Server Action**: `revalidatePropertyRoute()` - Ejecuta la revalidación en el servidor
- **React Transition**: Proporciona estado `isPending` para UI feedback

## 🎯 Ventajas

✅ **Componente genérico**: `FullPropertyDialog` no sabe dónde está usado (reutilizable)
✅ **Flexible**: Cada integración revalida su propia ruta
✅ **Escalable**: Funciona para sales, rentals, o cualquier otra sección
✅ **Limpio**: Separación clara de responsabilidades

## 📦 Componentes

### 1. Hook: `useFullPropertyRevalidation()`
**Ubicación**: `app/hooks/useFullPropertyRevalidation.ts`

**Uso**:
```tsx
const { revalidate, isPending } = useFullPropertyRevalidation();

// Revalidar ruta actual (por defecto)
await revalidate();

// O revalidar una ruta específica
const { revalidate } = useFullPropertyRevalidation('/backOffice/properties/sales');
await revalidate();
```

### 2. Server Action: `revalidatePropertyRoute()`
**Ubicación**: `app/actions/properties.ts`

**Qué hace**:
- Recibe una ruta como parámetro
- Llama a `revalidatePath()` de Next.js
- Refresca el cache de esa ruta en el servidor

## 🔌 Cómo Integrar en una Nueva Sección

### Paso 1: Crear el componente "MoreButton" (ej: RentMoreButton.tsx)

```tsx
'use client';

import { useCallback, useState } from 'react';
import IconButton from '@/components/IconButton/IconButton';
import FullPropertyDialog from '../../ui/fullProperty/FullPropertyDialog';
import { useFullPropertyRevalidation } from '@/app/hooks/useFullPropertyRevalidation';

interface RentMoreButtonProps {
  property: any;
}

const RentMoreButton: React.FC<RentMoreButtonProps> = ({ property }) => {
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});
  const { revalidate } = useFullPropertyRevalidation();

  const isOpen = openDialogs[property.id] || false;

  const handleOpen = useCallback(() => {
    setOpenDialogs(prev => ({
      ...prev,
      [property.id]: true
    }));
  }, [property.id]);

  const handleClose = useCallback(async () => {
    setOpenDialogs(prev => ({
      ...prev,
      [property.id]: false
    }));
    // Revalidate the current route to refresh the rental grid
    await revalidate();
  }, [property.id, revalidate]);

  return (
    <>
      <IconButton
        icon="more_horiz"
        variant="text"
        onClick={handleOpen}
      />
      <FullPropertyDialog 
        open={isOpen} 
        onClose={handleClose}
        propertyId={property.id}
      />
    </>
  );
};

export default RentMoreButton;
```

### Paso 2: Usar en el Grid

```tsx
// En RentalsGrid.tsx o donde sea que uses el grid
import RentMoreButton from './RentMoreButton';

const columns = [
  // ... otras columnas
  {
    field: 'actions',
    headerName: '',
    width: 60,
    actionComponent: ({ row }) => <RentMoreButton property={row} />,
  },
];
```

## 🎨 Con UI Feedback Opcional

Si quieres mostrar un estado "guardando" mientras se revalida:

```tsx
const handleClose = useCallback(async () => {
  setOpenDialogs(prev => ({
    ...prev,
    [property.id]: false
  }));
  
  // Mostrar mensaje de carga (opcional)
  const { showAlert } = useAlert();
  showAlert({ 
    message: 'Actualizando propiedades...', 
    type: 'info' 
  });
  
  await revalidate();
  
  // Confirmar actualización
  showAlert({ 
    message: 'Propiedades actualizadas', 
    type: 'success',
    duration: 2000
  });
}, [property.id, revalidate]);
```

## 📋 Checklist para Nueva Sección

- [ ] Crear `<SectionMoreButton>` que use `useFullPropertyRevalidation()`
- [ ] Importar hook en el botón
- [ ] Llamar `await revalidate()` en `handleClose`
- [ ] Usar el botón en el grid como `actionComponent`
- [ ] Verificar que el grid se refresca después de cerrar el diálogo

## 🔄 Flujo de Ejecución

```
Usuario hace click en botón "Más" (ej: "⋯")
    ↓
Se abre FullPropertyDialog
    ↓
Usuario hace cambios (edita, sube imagenes, etc.)
    ↓
Usuario cierra el diálogo (click X o botón cerrar)
    ↓
SaleMoreButton/RentMoreButton.handleClose() ejecuta:
    - setOpenDialogs(...) para cerrar el diálogo
    - revalidate() para refrescar la ruta actual
    ↓
Server Action revalidatePropertyRoute() ejecuta:
    - revalidatePath(currentPathname)
    ↓
Next.js limpia el cache de esa ruta
    ↓
Grid se recarga automáticamente con datos nuevos
    ↓
Usuario ve cambios reflejados al instante ✅
```

## 🚀 Ventaja Clave

El hook es **agnóstico de ubicación** - funciona igual en:
- `/backOffice/properties/sales`
- `/backOffice/properties/rentals`
- `/backOffice/properties/projects`
- Cualquier otra sección futura

Sin necesidad de modificar `FullPropertyDialog` o el hook cada vez que agregues una nueva sección.

## 💡 Notas

- El parámetro `pathOverride` es opcional; por defecto usa `usePathname()`
- El `isPending` del hook es útil si quieres deshabilitar botones durante la revalidación
- La revalidación es rápida (solo refresca la ruta especificada, no todo el app)
