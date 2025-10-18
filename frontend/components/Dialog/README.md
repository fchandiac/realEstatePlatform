# Dialog Component

Un componente de diálogo modal completamente accesible con múltiples tamaños, opciones de scroll, animaciones suaves y bloqueo automático del scroll del body.

## 🚀 Características Principales

- ✅ **Modal Completo**: Bloquea interacción con el contenido detrás
- ✅ **Múltiples Tamaños**: xs, sm, md, lg, xl con responsive design
- ✅ **Opciones de Scroll**: Contenido dentro del dialog o en el overlay
- ✅ **Animaciones**: Transiciones suaves de entrada/salida
- ✅ **Accesibilidad**: Navegación por teclado, ARIA attributes
- ✅ **Auto-Bloqueo**: Scroll del body bloqueado automáticamente
- ✅ **Click Outside**: Cierra al hacer click en el overlay
- ✅ **TypeScript**: Completamente tipado

## 📦 Instalación

```bash
# El componente ya está incluido en el proyecto
import Dialog from '@/components/Dialog';
```

## 🎯 Uso Básico

```tsx
import React, { useState } from 'react';
import Dialog from '@/components/Dialog';
import { Button } from '@/components/Button';

export default function BasicDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Diálogo
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Mi Diálogo"
      >
        <p>Este es el contenido del diálogo.</p>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </div>
      </Dialog>
    </>
  );
}
```

## 🔧 API Reference

### Props del Dialog

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `open` | `boolean` | **Requerido** | Controla si el dialog está visible |
| `onClose` | `function` | **Requerido** | Función llamada para cerrar el dialog |
| `title` | `string` | `undefined` | Título opcional del dialog |
| `children` | `React.ReactNode` | **Requerido** | Contenido del dialog |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamaño del dialog |
| `scroll` | `'body' \| 'paper'` | `'paper'` | Controla dónde ocurre el scroll |

## 📏 Tamaños Disponibles

### Tamaño Extra Small (xs)
```tsx
<Dialog open={open} onClose={onClose} size="xs">
  Contenido pequeño
</Dialog>
// min-width: 320px, max-width: 448px (md) / 384px (sm)
```

### Tamaño Small (sm)
```tsx
<Dialog open={open} onClose={onClose} size="sm">
  Contenido pequeño-mediano
</Dialog>
// min-width: 400px, max-width: 512px (lg) / 448px (md)
```

### Tamaño Medium (md) - Default
```tsx
<Dialog open={open} onClose={onClose} size="md">
  Contenido mediano
</Dialog>
// min-width: 480px, max-width: 576px (xl) / 512px (lg)
```

### Tamaño Large (lg)
```tsx
<Dialog open={open} onClose={onClose} size="lg">
  Contenido grande
</Dialog>
// min-width: 560px, max-width: 672px (2xl) / 576px (xl)
```

### Tamaño Extra Large (xl)
```tsx
<Dialog open={open} onClose={onClose} size="xl">
  Contenido muy grande
</Dialog>
// min-width: 640px, max-width: 1024px (4xl) / 672px (2xl)
```

## 📜 Opciones de Scroll

### Scroll en Paper (Default - Recomendado)

```tsx
<Dialog
  open={open}
  onClose={onClose}
  title="Contenido Largo"
  scroll="paper"  // Default
>
  <div className="space-y-4">
    {/* Contenido que puede ser largo */}
    {Array.from({ length: 20 }, (_, i) => (
      <p key={i}>Párrafo {i + 1} con mucho contenido...</p>
    ))}
  </div>

  <div className="flex justify-end mt-4">
    <Button onClick={() => setIsOpen(false)}>Cerrar</Button>
  </div>
</Dialog>
```

### Scroll en Body

```tsx
<Dialog
  open={open}
  onClose={onClose}
  title="Contenido Muy Largo"
  scroll="body"
>
  <div className="space-y-4">
    {/* Contenido muy largo que hace scroll en el overlay */}
    {Array.from({ length: 50 }, (_, i) => (
      <p key={i}>Párrafo {i + 1} con mucho contenido...</p>
    ))}
  </div>

  <div className="flex justify-end mt-4">
    <Button onClick={() => setIsOpen(false)}>Cerrar</Button>
  </div>
</Dialog>
```

## 🎯 Casos de Uso Comunes

### Diálogo de Confirmación

```tsx
import React, { useState } from 'react';
import Dialog from '@/components/Dialog';
import { Button } from '@/components/Button';

export default function ConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItem();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setIsOpen(true)}>
        Eliminar Elemento
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar este elemento?
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="text"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
```

### Diálogo de Formulario

```tsx
import React, { useState } from 'react';
import Dialog from '@/components/Dialog';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';

export default function FormDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createUser(formData);
      setIsOpen(false);
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Crear Usuario
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Nuevo Usuario"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Nombre completo"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <TextField
            label="Correo electrónico"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="text"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
```

### Diálogo con Contenido Dinámico

```tsx
import React, { useState } from 'react';
import Dialog from '@/components/Dialog';
import { Button } from '@/components/Button';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UserDetailsDialog() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users: User[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'User' },
  ];

  return (
    <>
      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="flex justify-between items-center p-4 border rounded">
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setSelectedUser(user)}
            >
              Ver Detalles
            </Button>
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name || ''}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <p className="text-sm">{selectedUser.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <p className="text-sm">{selectedUser.role}</p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm">{selectedUser.email}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setSelectedUser(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
```

## 🎯 Gestión de Estado

### Control de Múltiples Diálogos

```tsx
import React, { useState } from 'react';
import Dialog from '@/components/Dialog';
import { Button } from '@/components/Button';

type DialogType = 'create' | 'edit' | 'delete' | null;

export default function MultiDialogExample() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const openDialog = (type: DialogType, item?: any) => {
    setActiveDialog(type);
    setSelectedItem(item);
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => openDialog('create')}>
        Crear Nuevo
      </Button>

      <Button onClick={() => openDialog('edit', { id: 1, name: 'Item 1' })}>
        Editar Item
      </Button>

      <Button onClick={() => openDialog('delete', { id: 1, name: 'Item 1' })}>
        Eliminar Item
      </Button>

      {/* Diálogo de Crear */}
      <Dialog
        open={activeDialog === 'create'}
        onClose={closeDialog}
        title="Crear Nuevo Elemento"
        size="md"
      >
        <p>Formulario de creación aquí...</p>
        <div className="flex justify-end mt-4">
          <Button onClick={closeDialog}>Cerrar</Button>
        </div>
      </Dialog>

      {/* Diálogo de Editar */}
      <Dialog
        open={activeDialog === 'edit'}
        onClose={closeDialog}
        title={`Editar ${selectedItem?.name || ''}`}
        size="md"
      >
        <p>Formulario de edición aquí...</p>
        <div className="flex justify-end mt-4">
          <Button onClick={closeDialog}>Cerrar</Button>
        </div>
      </Dialog>

      {/* Diálogo de Eliminar */}
      <Dialog
        open={activeDialog === 'delete'}
        onClose={closeDialog}
        title="Confirmar Eliminación"
        size="sm"
      >
        <p>¿Eliminar {selectedItem?.name}?</p>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="text" onClick={closeDialog}>Cancelar</Button>
          <Button variant="primary" onClick={closeDialog}>Eliminar</Button>
        </div>
      </Dialog>
    </div>
  );
}
```

## 🎨 Personalización

### Diálogo con Contenido Custom

```tsx
<Dialog
  open={open}
  onClose={onClose}
  title="Diálogo Personalizado"
  size="lg"
>
  <div className="space-y-6">
    {/* Header custom */}
    <div className="flex items-center gap-3 pb-4 border-b">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-600 font-bold">i</span>
      </div>
      <div>
        <h3 className="font-medium">Información Importante</h3>
        <p className="text-sm text-gray-600">Revisa los detalles a continuación</p>
      </div>
    </div>

    {/* Contenido */}
    <div className="text-gray-700">
      <p>Aquí va el contenido principal del diálogo...</p>
    </div>

    {/* Footer custom */}
    <div className="flex justify-between items-center pt-4 border-t">
      <Button variant="text" onClick={onClose}>
        Más tarde
      </Button>

      <div className="flex gap-3">
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  </div>
</Dialog>
```

## 📱 Responsive Design

El Dialog es completamente responsive:

```tsx
// Se adapta automáticamente a diferentes tamaños de pantalla
<Dialog
  open={open}
  onClose={onClose}
  title="Diálogo Responsive"
  size="md"  // Los tamaños ya incluyen breakpoints responsivos
>
  <p>Contenido que se adapta al tamaño del dispositivo</p>
</Dialog>
```

## 🎯 Mejores Prácticas

### 1. Usa Tamaños Apropiados

```tsx
// ✅ Bien - tamaño según contenido
<Dialog open={open} onClose={onClose} size="sm">
  <p>¿Estás seguro?</p>  {/* Contenido simple */}
</Dialog>

<Dialog open={open} onClose={onClose} size="lg">
  <form>{/* Formulario complejo */}</form>  {/* Contenido complejo */}
</Dialog>
```

### 2. Maneja el Estado Correctamente

```tsx
// ✅ Bien - estado controlado
const [isOpen, setIsOpen] = useState(false);

// ❌ Mal - estado no controlado
// No uses variables sin estado para controlar la visibilidad
```

### 3. Proporciona Títulos Descriptivos

```tsx
// ✅ Bien
<Dialog open={open} onClose={onClose} title="Eliminar Usuario">
  <p>¿Eliminar a Juan Pérez?</p>
</Dialog>

// ❌ Mal - título genérico
<Dialog open={open} onClose={onClose} title="Confirmación">
  <p>¿Eliminar a Juan Pérez?</p>
</Dialog>
```

### 4. Incluye Botones de Acción Claros

```tsx
// ✅ Bien - acciones claras
<div className="flex justify-end gap-3">
  <Button variant="text" onClick={onClose}>Cancelar</Button>
  <Button variant="primary" onClick={handleConfirm}>Confirmar</Button>
</div>

// ❌ Mal - acciones confusas
<div className="flex justify-end gap-3">
  <Button onClick={onClose}>No</Button>
  <Button onClick={handleConfirm}>Sí</Button>
</div>
```

### 5. Maneja Errores en Diálogos

```tsx
const [error, setError] = useState<string | null>(null);

<Dialog open={open} onClose={onClose} title="Crear Elemento">
  {error && (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
      <p className="text-red-700 text-sm">{error}</p>
    </div>
  )}

  {/* Formulario */}
</Dialog>
```

## 🐛 Solución de Problemas

### Problema: El dialog no se abre

```tsx
// Asegúrate de que el estado esté controlado correctamente
const [isOpen, setIsOpen] = useState(false);

// ✅ Correcto
<Button onClick={() => setIsOpen(true)}>Abrir</Button>
<Dialog open={isOpen} onClose={() => setIsOpen(false)}>...</Dialog>

// ❌ Incorrecto - estado no actualizado
<Button onClick={() => console.log('click')}>Abrir</Button>
<Dialog open={true} onClose={() => {}}>...</Dialog>
```

### Problema: Scroll del body no se bloquea

```tsx
// El componente bloquea automáticamente el scroll
// Si tienes problemas, verifica que no haya interferencias CSS
<Dialog open={open} onClose={onClose}>
  {/* Contenido */}
</Dialog>
```

### Problema: Click outside no funciona

```tsx
// Asegúrate de que onClose esté definido
<Dialog
  open={open}
  onClose={() => setIsOpen(false)}  // ✅ Requerido
>
  {/* Contenido */}
</Dialog>
```

### Problema: Contenido se corta

```tsx
// Usa scroll="paper" para contenido largo (recomendado)
<Dialog
  open={open}
  onClose={onClose}
  scroll="paper"  // ✅ Contenido hace scroll dentro del dialog
>
  <div className="max-h-96 overflow-y-auto">
    {/* Contenido largo */}
  </div>
</Dialog>

// O scroll="body" para contenido muy largo
<Dialog
  open={open}
  onClose={onClose}
  scroll="body"  // ✅ Contenido hace scroll en el overlay
>
  {/* Contenido muy largo */}
</Dialog>
```

### Problema: Animaciones no funcionan

```tsx
// Las animaciones requieren que open cambie de false a true
const [isOpen, setIsOpen] = useState(false);

// ✅ Correcto - cambio de estado
<Button onClick={() => setIsOpen(true)}>Abrir</Button>

// ❌ Incorrecto - siempre true
<Dialog open={true} onClose={onClose}>...</Dialog>
```

## 📚 Ejemplos Completos

Para ver ejemplos completos de uso, revisa:

- `app/components/Dialog/page.tsx` - Showcase completo con todas las variantes
- `app/components/BaseForm/` - Ejemplos de uso en formularios modales

## 🤝 Contribución

Para contribuir al componente Dialog:

1. Mantén la compatibilidad con la API existente
2. Agrega nuevos tamaños siguiendo el patrón responsive
3. Incluye ejemplos de uso para nuevas características
4. Actualiza esta documentación cuando agregues nuevas funcionalidades
5. Asegura que la accesibilidad se mantenga en todas las modificaciones</content>
<parameter name="filePath">/Users/felipe/dev/DSP-App/app/components/Dialog/README.md