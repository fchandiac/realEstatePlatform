# CircularProgress Component

Un indicador de progreso circular elegante y animado, perfecto para mostrar estados de carga, procesamiento o espera en la aplicación.

## 🚀 Características Principales

- ✅ **Animación Suave**: Rotación continua con CSS animations
- ✅ **Tamaño Configurable**: Control total sobre dimensiones
- ✅ **Grosor Personalizable**: Ajusta el ancho del trazo
- ✅ **Colores Temáticos**: Usa variables CSS para consistencia
- ✅ **Inline Display**: Se comporta como texto inline
- ✅ **Responsive**: Diseño adaptativo
- ✅ **TypeScript**: Completamente tipado
- ✅ **Data Test IDs**: Soporte para testing automatizado

## 📦 Instalación

```bash
# El componente ya está incluido en el proyecto
import CircularProgress from '@/components/CircularProgress';
```

## 🎯 Uso Básico

```tsx
import React, { useState } from 'react';
import CircularProgress from '@/components/CircularProgress';
import { Button } from '@/components/Button';

export default function BasicCircularProgress() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? (
          <>
            <CircularProgress size={16} className="mr-2" />
            Cargando...
          </>
        ) : (
          'Iniciar Carga'
        )}
      </Button>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <CircularProgress size={48} />
        </div>
      )}
    </div>
  );
}
```

## 🔧 API Reference

### Props del CircularProgress

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | `number` | `40` | Diámetro del indicador en píxeles |
| `thickness` | `number` | `4` | Grosor del trazo circular |
| `className` | `string` | `""` | Clases CSS adicionales |

## 📏 Tamaños y Grosor

### Tamaños Predefinidos

```tsx
// Extra pequeño - para botones
<CircularProgress size={12} thickness={2} />

// Pequeño - para elementos compactos
<CircularProgress size={16} thickness={2} />

// Mediano - default
<CircularProgress size={24} thickness={3} />

// Grande - para áreas destacadas
<CircularProgress size={32} thickness={4} />

// Extra grande - para pantallas de carga
<CircularProgress size={48} thickness={5} />

// Muy grande - para loading screens
<CircularProgress size={64} thickness={6} />
```

### Grosor del Trazo

```tsx
// Trazo fino
<CircularProgress size={40} thickness={2} />

// Trazo normal - default
<CircularProgress size={40} thickness={4} />

// Trazo grueso
<CircularProgress size={40} thickness={6} />
```

## 🎯 Casos de Uso Comunes

### Loading en Botones

```tsx
import React, { useState } from 'react';
import CircularProgress from '@/components/CircularProgress';
import { Button } from '@/components/Button';

export default function ButtonWithLoading() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="min-w-[120px]"
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={16} thickness={2} className="mr-2" />
            Guardando...
          </>
        ) : (
          'Guardar'
        )}
      </Button>

      <Button
        variant="outlined"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <CircularProgress size={14} thickness={2} />
        ) : (
          'Enviar'
        )}
      </Button>
    </div>
  );
}
```

### Pantalla de Carga Completa

```tsx
import React, { useState, useEffect } from 'react';
import CircularProgress from '@/components/CircularProgress';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchData();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-center">
          <CircularProgress size={64} thickness={6} className="mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Cargando...</h3>
          <p className="text-sm text-gray-500 mt-2">
            Por favor espera mientras procesamos tu solicitud
          </p>
        </div>
      </div>
    );
  }

  return <div>Contenido cargado</div>;
}
```

### Loading Inline en Texto

```tsx
import React, { useState } from 'react';
import CircularProgress from '@/components/CircularProgress';

export default function InlineLoading() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleAction = async () => {
    setStatus('loading');
    try {
      await performAction();
      setStatus('success');
    } catch (error) {
      setStatus('idle');
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAction}
        disabled={status === 'loading'}
        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
      >
        {status === 'loading' && (
          <CircularProgress size={14} thickness={2} className="mr-2" />
        )}
        {status === 'loading' ? 'Procesando...' : 'Iniciar Acción'}
      </button>

      {status === 'success' && (
        <p className="text-green-600 flex items-center">
          <span className="mr-2">✓</span>
          Acción completada exitosamente
        </p>
      )}
    </div>
  );
}
```

### Loading en Cards/Contenedores

```tsx
import React, { useState } from 'react';
import CircularProgress from '@/components/CircularProgress';
import Card from '@/components/Card';

export default function CardWithLoading() {
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga de datos
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card
      height="300px"
      content={
        isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <CircularProgress size={48} thickness={4} className="mb-4" />
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Datos Cargados</h3>
            <p className="text-gray-600">Contenido disponible</p>
          </div>
        )
      }
    />
  );
}
```

### Loading en Formularios

```tsx
import React, { useState } from 'react';
import CircularProgress from '@/components/CircularProgress';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';

export default function FormWithLoading() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitForm(formData);
      // Éxito
    } catch (error) {
      // Error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <TextField
        label="Nombre"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        disabled={isSubmitting}
      />

      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        disabled={isSubmitting}
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <CircularProgress size={16} thickness={2} className="mr-2" />
            Enviando...
          </div>
        ) : (
          'Enviar Formulario'
        )}
      </Button>
    </form>
  );
}
```

## 🎨 Personalización

### Colores Personalizados

```tsx
// El componente usa variables CSS para colores
// --color-primary: color del progreso
// --color-neutral: color del fondo

// Para cambiar colores, modifica las variables CSS globales
// o usa clases de Tailwind

<CircularProgress
  size={40}
  className="text-blue-500"  // Color personalizado
/>

// O usa clases de color de Tailwind
<div className="text-red-500">
  <CircularProgress size={32} />
</div>
```

### Animaciones Personalizadas

```tsx
// Animación por defecto (spin)
<CircularProgress className="animate-spin" />

// Animación personalizada
<CircularProgress className="animate-pulse" />

// Sin animación (solo para estados estáticos)
<CircularProgress className="animate-none" />
```

### Posicionamiento

```tsx
// Centrado en contenedor
<div className="flex items-center justify-center h-32">
  <CircularProgress size={32} />
</div>

// Alineado con texto
<p className="flex items-center">
  <CircularProgress size={16} className="mr-2" />
  Procesando solicitud...
</p>

// Flotante sobre contenido
<div className="relative">
  <div className="opacity-50 pointer-events-none">
    {/* Contenido deshabilitado */}
  </div>
  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
    <CircularProgress size={48} />
  </div>
</div>
```

## 📱 Responsive Design

El CircularProgress es completamente responsive:

```tsx
// Tamaño responsivo
<div className="flex items-center">
  <CircularProgress
    size={window.innerWidth < 640 ? 24 : 32}
    thickness={window.innerWidth < 640 ? 3 : 4}
  />
  <span className="ml-2">Cargando...</span>
</div>

// En grids responsivos
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => (
    <div key={item.id} className="p-4 border rounded">
      {item.loading ? (
        <div className="flex justify-center py-8">
          <CircularProgress size={32} />
        </div>
      ) : (
        <div>{item.content}</div>
      )}
    </div>
  ))}
</div>
```

## 🎯 Mejores Prácticas

### 1. Usa Tamaños Apropiados por Contexto

```tsx
// ✅ Bien - tamaños según contexto
// En botones pequeños
<CircularProgress size={14} thickness={2} />

// En áreas de contenido
<CircularProgress size={32} thickness={4} />

// En pantallas de carga
<CircularProgress size={48} thickness={5} />

// ❌ Mal - tamaños inapropiados
// CircularProgress gigante en un botón pequeño
<CircularProgress size={64} /> // En un botón
```

### 2. Proporciona Feedback Visual

```tsx
// ✅ Bien - combina con texto descriptivo
<div className="flex items-center">
  <CircularProgress size={16} className="mr-2" />
  <span>Guardando cambios...</span>
</div>

// ✅ Bien - usa en estados de carga completos
{isLoading ? (
  <div className="flex flex-col items-center py-8">
    <CircularProgress size={48} className="mb-4" />
    <h3>Cargando datos...</h3>
  </div>
) : (
  <DataTable data={data} />
)}
```

### 3. Gestiona Estados de Carga

```tsx
// ✅ Bien - previene múltiples submissions
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  if (isSubmitting) return; // Previene doble submit

  setIsSubmitting(true);
  try {
    await apiCall();
  } finally {
    setIsSubmitting(false);
  }
};
```

### 4. Accesibilidad

```tsx
// ✅ Bien - incluye texto descriptivo para lectores de pantalla
<div role="status" aria-live="polite">
  <CircularProgress size={24} aria-hidden="true" />
  <span className="sr-only">Cargando contenido...</span>
</div>

// ✅ Bien - usa dataTestId para testing
<CircularProgress
  size={32}
  data-test-id="loading-spinner"
/>
```

## 🐛 Solución de Problemas

### Problema: El spinner no gira

```tsx
// Asegúrate de que la clase animate-spin esté presente
<CircularProgress className="animate-spin" /> // ✅ Correcto

// Si sobrescribes la clase, incluye animate-spin
<CircularProgress className="animate-spin text-blue-500" /> // ✅ Correcto

// ❌ Incorrecto - sin animate-spin
<CircularProgress className="text-blue-500" />
```

### Problema: Tamaño no funciona

```tsx
// El size debe ser un número en píxeles
<CircularProgress size={32} /> // ✅ Correcto - 32px

// ❌ Incorrecto - string
<CircularProgress size="32px" />

// ❌ Incorrecto - clase de Tailwind
<CircularProgress size="w-8" />
```

### Problema: Colores no se aplican

```tsx
// Usa clases de Tailwind para colores
<CircularProgress className="text-red-500" /> // ✅ Correcto

// O envuelve en un elemento con color
<div className="text-blue-600">
  <CircularProgress /> // Hereda el color del padre
</div>

// ❌ Incorrecto - intenta usar style
<CircularProgress style={{ color: 'red' }} />
```

### Problema: Performance en animaciones

```tsx
// Para muchos spinners, considera usar CSS containment
<div className="contain-paint">
  {spinners.map(spinner => (
    <CircularProgress key={spinner.id} />
  ))}
</div>
```

## 📚 Ejemplos Completos

Para ver ejemplos completos de uso, revisa:

- `app/components/CircularProgress/page.tsx` - Showcase completo con diferentes tamaños y usos
- `app/components/Button/` - Ejemplos de uso en botones con loading
- `app/components/BaseForm/` - Ejemplos en formularios

## 🤝 Contribución

Para contribuir al componente CircularProgress:

1. Mantén la compatibilidad con la API existente
2. Agrega nuevas opciones de personalización manteniendo la simplicidad
3. Incluye ejemplos de uso para nuevas características
4. Actualiza esta documentación cuando agregues nuevas funcionalidades
5. Asegura que la performance de animaciones se mantenga óptima</content>
<parameter name="filePath">/Users/felipe/dev/DSP-App/app/components/CircularProgress/README.md