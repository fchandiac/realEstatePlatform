# DotProgress Component

Componente de indicador de progreso animado con puntos que se activan secuencialmente. Ideal para estados de carga, procesamiento o espera en interfaces de usuario.

## 🚀 Características Principales

- ✅ **Animación Fluida**: Transiciones suaves entre estados
- ✅ **Personalizable**: Tamaño, colores, velocidad y espaciado configurables
- ✅ **CSS Variables**: Integración con sistema de diseño
- ✅ **Performance**: Animaciones optimizadas con CSS
- ✅ **Accesibilidad**: Soporte para lectores de pantalla
- ✅ **TypeScript**: Completamente tipado
- ✅ **Responsive**: Funciona en todos los dispositivos
- ✅ **Data Test IDs**: Soporte para testing automatizado

## 📦 Instalación

```bash
# El componente ya está incluido en el proyecto
import DotProgress from '@/components/DotProgress/DotProgress';
```

## 🎯 Uso Básico

```tsx
import React, { useState } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';

export default function LoadingExample() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="flex items-center gap-4">
          <DotProgress />
          <span className="text-gray-600">Cargando datos...</span>
        </div>
      ) : (
        <div>Datos cargados</div>
      )}
    </div>
  );
}
```

## 🔧 API Reference

### Props del DotProgress

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | `number` | `16` | Tamaño de cada punto en píxeles |
| `gap` | `number` | `8` | Espaciado entre puntos en píxeles |
| `colorPrimary` | `string` | `"var(--color-primary)"` | Color del punto activo |
| `colorNeutral` | `string` | `"var(--color-neutral)"` | Color de los puntos inactivos |
| `className` | `string` | `""` | Clases CSS adicionales |
| `interval` | `number` | `350` | Intervalo de animación en milisegundos |

## 🎯 Casos de Uso Comunes

### Loading States

```tsx
import React, { useState, useEffect } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';

export default function DataLoader() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <DotProgress size={20} />
          <p className="text-gray-600 text-sm">Cargando información...</p>
        </div>
      ) : (
        <DataDisplay data={data} />
      )}
    </div>
  );
}
```

### Form Submissions

```tsx
import React, { useState } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';
import Button from '@/components/Button/Button';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitForm(formData);
      alert('Mensaje enviado exitosamente');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      alert('Error al enviar el mensaje');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full p-3 border rounded"
          disabled={isSubmitting}
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full p-3 border rounded"
          disabled={isSubmitting}
        />

        <textarea
          placeholder="Mensaje"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full p-3 border rounded h-32"
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <DotProgress size={14} colorPrimary="#ffffff" colorNeutral="#ffffff80" />
              Enviando...
            </div>
          ) : (
            'Enviar Mensaje'
          )}
        </Button>
      </div>
    </form>
  );
}
```

### File Upload Progress

```tsx
import React, { useState } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';

export default function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    // Simular progreso de subida
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
      {uploading ? (
        <div className="space-y-4">
          <DotProgress size={24} />
          <p className="text-gray-600">Subiendo archivo... {progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">Arrastra un archivo aquí o</p>
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Seleccionar Archivo
          </label>
        </div>
      )}
    </div>
  );
}
```

### API Calls con Loading

```tsx
import React, { useState, useEffect } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <DotProgress size={20} interval={300} />
          <p className="text-gray-600 mt-4">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map(user => (
        <div key={user.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### Skeleton Loading

```tsx
import React, { useState, useEffect } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';

export default function ContentLoader() {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    // Simular carga de contenido
    const timer = setTimeout(() => {
      setContent("Este es el contenido cargado desde el servidor.");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Artículo</h1>

      {content ? (
        <div className="prose">
          <p>{content}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Skeleton del título */}
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '60%' }} />
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '80%' }} />
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '70%' }} />

          {/* Indicador de carga */}
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <DotProgress size={16} colorPrimary="#6b7280" />
              <p className="text-gray-500 text-sm mt-2">Cargando contenido...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Progress Steps

```tsx
import React, { useState, useEffect } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';

const STEPS = ['Validando', 'Procesando', 'Finalizando', 'Completado'];

export default function MultiStepProcess() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (currentStep < STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setCompleted(true);
    }
  }, [currentStep]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-center">Procesando Solicitud</h2>

      {!completed ? (
        <div className="text-center space-y-4">
          <DotProgress size={18} interval={400} />
          <p className="text-gray-600">{STEPS[currentStep]}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <p className="text-green-600 font-semibold">¡Proceso completado!</p>
        </div>
      )}
    </div>
  );
}
```

## 🎨 Personalización

### Diferentes Tamaños y Velocidades

```tsx
// Variaciones de tamaño y velocidad
const SizeVariations = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Extra pequeño */}
      <div className="flex items-center gap-4">
        <DotProgress size={8} interval={200} />
        <span className="text-sm text-gray-600">Extra pequeño (rápido)</span>
      </div>

      {/* Pequeño */}
      <div className="flex items-center gap-4">
        <DotProgress size={12} interval={300} />
        <span className="text-sm text-gray-600">Pequeño</span>
      </div>

      {/* Normal (default) */}
      <div className="flex items-center gap-4">
        <DotProgress />
        <span className="text-sm text-gray-600">Normal</span>
      </div>

      {/* Grande */}
      <div className="flex items-center gap-4">
        <DotProgress size={24} interval={500} />
        <span className="text-sm text-gray-600">Grande (lento)</span>
      </div>

      {/* Extra grande */}
      <div className="flex items-center gap-4">
        <DotProgress size={32} interval={600} />
        <span className="text-sm text-gray-600">Extra grande (muy lento)</span>
      </div>
    </div>
  );
};
```

### Colores Personalizados

```tsx
// Diferentes esquemas de color
const ColorVariations = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Tema primario (default) */}
      <div className="flex items-center gap-4">
        <DotProgress />
        <span className="text-sm text-gray-600">Tema primario</span>
      </div>

      {/* Verde para éxito */}
      <div className="flex items-center gap-4">
        <DotProgress colorPrimary="#10b981" colorNeutral="#d1fae5" />
        <span className="text-sm text-gray-600">Éxito</span>
      </div>

      {/* Rojo para error/warning */}
      <div className="flex items-center gap-4">
        <DotProgress colorPrimary="#ef4444" colorNeutral="#fecaca" />
        <span className="text-sm text-gray-600">Error</span>
      </div>

      {/* Amarillo para atención */}
      <div className="flex items-center gap-4">
        <DotProgress colorPrimary="#f59e0b" colorNeutral="#fef3c7" />
        <span className="text-sm text-gray-600">Atención</span>
      </div>

      {/* Púrpura para creativo */}
      <div className="flex items-center gap-4">
        <DotProgress colorPrimary="#8b5cf6" colorNeutral="#e9d5ff" />
        <span className="text-sm text-gray-600">Creativo</span>
      </div>

      {/* Blanco sobre fondo oscuro */}
      <div className="flex items-center gap-4 bg-gray-800 p-4 rounded">
        <DotProgress colorPrimary="#ffffff" colorNeutral="#4b5563" />
        <span className="text-sm text-white">Tema oscuro</span>
      </div>
    </div>
  );
};
```

### Espaciado Personalizado

```tsx
// Diferentes configuraciones de espaciado
const SpacingVariations = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Compacto */}
      <div className="flex items-center gap-4">
        <DotProgress gap={4} size={14} />
        <span className="text-sm text-gray-600">Compacto</span>
      </div>

      {/* Normal */}
      <div className="flex items-center gap-4">
        <DotProgress gap={8} />
        <span className="text-sm text-gray-600">Normal</span>
      </div>

      {/* Espaciado */}
      <div className="flex items-center gap-4">
        <DotProgress gap={16} size={18} />
        <span className="text-sm text-gray-600">Espaciado</span>
      </div>

      {/* Muy espaciado */}
      <div className="flex items-center gap-4">
        <DotProgress gap={24} size={20} />
        <span className="text-sm text-gray-600">Muy espaciado</span>
      </div>
    </div>
  );
};
```

### Integración con Tema

```tsx
// Uso con variables CSS del tema
const ThemedDotProgress = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Usa variables CSS del proyecto */}
      <div className="flex items-center gap-4">
        <DotProgress
          colorPrimary="var(--color-primary)"
          colorNeutral="var(--color-neutral)"
        />
        <span className="text-sm text-gray-600">Tema del sistema</span>
      </div>

      {/* Tema personalizado con CSS-in-JS */}
      <div className="custom-theme">
        <style jsx>{`
          .custom-theme {
            --custom-primary: #06b6d4;
            --custom-neutral: #cffafe;
          }
        `}</style>
        <div className="flex items-center gap-4">
          <DotProgress
            colorPrimary="var(--custom-primary)"
            colorNeutral="var(--custom-neutral)"
          />
          <span className="text-sm text-gray-600">Tema personalizado</span>
        </div>
      </div>
    </div>
  );
};
```

## 📱 Responsive Design

El DotProgress es completamente responsive:

```tsx
// Diseño responsive automático
<DotProgress />

// En diferentes tamaños de pantalla
<div className="flex items-center gap-4">
  {/* Móvil: pequeño */}
  <div className="sm:hidden">
    <DotProgress size={12} gap={6} />
  </div>

  {/* Tablet y desktop: normal */}
  <div className="hidden sm:block">
    <DotProgress size={16} gap={8} />
  </div>
</div>

// En cards responsivas
<div className="max-w-sm mx-auto sm:max-w-md lg:max-w-lg">
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
    <div className="flex items-center justify-center py-8">
      <DotProgress size={20} />
    </div>
    <p className="text-center text-gray-600 text-sm sm:text-base">
      Cargando contenido...
    </p>
  </div>
</div>
```

## 🎯 Mejores Prácticas

### 1. Contextos Apropiados

```tsx
// ✅ Bien - usar para operaciones que toman tiempo predecible
<DotProgress />
<span>Cargando datos...</span>

// ✅ Bien - usar para procesos en background
<DotProgress size={14} />
<span>Procesando archivo...</span>

// ✅ Bien - usar para estados de transición
<DotProgress interval={200} />
<span>Cambiando vista...</span>

// ❌ Mal - no usar para operaciones instantáneas
<button onClick={handleClick}>
  {loading ? <DotProgress size={12} /> : 'Guardar'}
</button>

// ❌ Mal - no usar sin contexto
<div className="flex justify-center py-8">
  <DotProgress />
  {/* Falta mensaje explicativo */}
</div>
```

### 2. Mensajes Claros

```tsx
// ✅ Bien - mensajes descriptivos
<div className="flex items-center gap-3">
  <DotProgress />
  <span className="text-gray-600">Cargando 247 productos...</span>
</div>

// ✅ Bien - mensajes contextuales
<DotProgress />
<span>
  {step === 1 && "Validando datos..."}
  {step === 2 && "Procesando información..."}
  {step === 3 && "Generando reporte..."}
</span>

// ✅ Bien - incluir tiempo estimado cuando sea posible
<div className="text-center">
  <DotProgress size={18} />
  <p className="text-gray-600 mt-2">
    Sincronizando datos... (aprox. 30 segundos)
  </p>
</div>
```

### 3. Estados de Error

```tsx
// ✅ Bien - manejar errores gracefully
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

if (error) {
  return (
    <div className="text-center py-8">
      <div className="text-red-500 mb-2">⚠️ Error al cargar</div>
      <button
        onClick={() => {
          setError(null);
          setLoading(true);
          retryLoad();
        }}
        className="text-blue-500 hover:text-blue-700"
      >
        Reintentar
      </button>
    </div>
  );
}

return loading ? (
  <div className="text-center py-8">
    <DotProgress />
    <p className="text-gray-600 mt-2">Cargando...</p>
  </div>
) : (
  <Content />
);
```

### 4. Performance

```tsx
// ✅ Bien - usar intervalos apropiados
<DotProgress interval={350} /> // Default - buen balance

// ✅ Bien - ajustar velocidad según contexto
<DotProgress interval={200} /> // Para operaciones rápidas
<DotProgress interval={500} /> // Para operaciones lentas

// ✅ Bien - cleanup automático con useEffect
useEffect(() => {
  let mounted = true;

  const loadData = async () => {
    // ... loading logic
    if (mounted) {
      setLoading(false);
    }
  };

  loadData();

  return () => {
    mounted = false;
  };
}, []);

// ❌ Mal - intervalos demasiado rápidos
<DotProgress interval={50} /> // Sobrecarga visual

// ❌ Mal - intervalos demasiado lentos
<DotProgress interval={2000} /> // Parece congelado
```

## 🐛 Solución de Problemas

### Problema: La animación no funciona

```tsx
// Verifica que el componente esté montado
const [showLoader, setShowLoader] = useState(false);

useEffect(() => {
  setShowLoader(true);
  // ... lógica de carga
}, []);

// ✅ Correcto
{showLoader && <DotProgress />}

// Verifica que no haya CSS que interfiera
// Asegúrate de que no haya transform: none !important
// o animation: none !important en el CSS global
```

### Problema: Los colores no se aplican

```tsx
// ✅ Bien - usar colores válidos
<DotProgress
  colorPrimary="#3b82f6"
  colorNeutral="#e5e7eb"
/>

// ✅ Bien - usar variables CSS
<DotProgress
  colorPrimary="var(--color-primary)"
  colorNeutral="var(--color-neutral)"
/>

// ❌ Mal - colores inválidos
<DotProgress
  colorPrimary="invalid-color"
  colorNeutral="not-a-color"
/>

// Verifica que las variables CSS estén definidas
:root {
  --color-primary: #3b82f6;
  --color-neutral: #e5e7eb;
}
```

### Problema: El componente se ve pixelado

```tsx
// Usa tamaños pares para mejor apariencia
<DotProgress size={16} /> {/* ✅ Bien - par */}
<DotProgress size={20} /> {/* ✅ Bien - par */}

// ❌ Mal - tamaños impares pueden verse pixelados
<DotProgress size={15} />

// Para pantallas retina, considera tamaños más grandes
<DotProgress size={24} /> {/* Mejor en pantallas de alta densidad */}
```

### Problema: Performance issues con muchos DotProgress

```tsx
// ✅ Bien - usar un solo DotProgress por vista
<div className="loading-state">
  <DotProgress />
  <p>Cargando...</p>
</div>

// ❌ Mal - múltiples DotProgress en la misma vista
<div className="loading-state">
  <DotProgress />
  <DotProgress />
  <DotProgress />
</div>

// ✅ Bien - condicional rendering
{loading ? (
  <DotProgress />
) : (
  <Content />
)}
```

### Problema: La animación se reinicia al re-render

```tsx
// ✅ Bien - usar keys estables
<DotProgress key="stable-key" />

// ✅ Bien - usar useMemo para props
const dotProgressProps = useMemo(() => ({
  size: 16,
  interval: 350,
}), []);

<DotProgress {...dotProgressProps} />

// ✅ Bien - evitar re-renders innecesarios
const LoadingComponent = memo(() => (
  <div>
    <DotProgress />
    <p>Cargando...</p>
  </div>
));
```

### Problema: No funciona en navegadores antiguos

```tsx
// El componente usa CSS moderno
// Para soporte IE11, considera un fallback

const FallbackDotProgress = () => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
  </div>
);

// Detectar soporte de CSS custom properties
const supportsCSSVars = CSS.supports('color', 'var(--color-primary)');

{supportsCSSVars ? <DotProgress /> : <FallbackDotProgress />}
```

## 📚 Ejemplos Completos

Para ver ejemplos completos de uso, revisa:

- `app/components/DotProgress/DotProgress.tsx` - Implementación completa
- `app/components/CircularProgress/CircularProgress.tsx` - Componente relacionado
- `app/hooks/useLoading.ts` - Hook personalizado para estados de carga

## 🤝 Contribución

Para contribuir al componente DotProgress:

1. Mantén la API simple y la animación fluida
2. Agrega nuevas opciones de personalización manteniendo la performance
3. Incluye ejemplos de uso para nuevas características
4. Actualiza esta documentación cuando agregues nuevas funcionalidades
5. Asegura que las animaciones funcionen en todos los navegadores modernos
6. Prueba el componente con diferentes tamaños, colores y velocidades
7. Considera el impacto en performance de nuevas animaciones