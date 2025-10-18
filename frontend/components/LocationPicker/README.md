# LocationPicker Component

Sistema completo y avanzado de selección de ubicaciones con mapas interactivos, geolocalización automática y soporte para crear y editar coordenadas. Utiliza React Leaflet para proporcionar una experiencia de mapa fluida y moderna.

## 🚀 Características Principales

- ✅ **Dos Modos de Operación**: CreateLocationPicker y UpdateLocationPicker
- ✅ **Geolocalización Automática**: Detecta ubicación del usuario automáticamente
- ✅ **Mapas Interactivos**: Basado en React Leaflet con OpenStreetMap
- ✅ **Fallback Robusto**: Múltiples estrategias de geolocalización
- ✅ **Interfaz Intuitiva**: Click-to-select en el mapa
- ✅ **Campos de Solo Lectura**: Muestra coordenadas precisas
- ✅ **Responsive**: Diseño adaptativo para diferentes tamaños
- ✅ **TypeScript**: Completamente tipado
- ✅ **SSR Compatible**: Carga dinámica para evitar problemas de hidratación
- ✅ **Accesibilidad**: Soporte para navegación por teclado

## 📦 Instalación

```bash
# El componente ya está incluido en el proyecto
import CreateLocationPicker from '@/components/LocationPicker/CreateLocationPickerWrapper';
import UpdateLocationPicker from '@/components/LocationPicker/UpdateLocationPickerWrapper';

# Asegúrate de que React Leaflet esté disponible
npm install react-leaflet leaflet
# Y los tipos
npm install --save-dev @types/leaflet

# También necesitas incluir los estilos de Leaflet
import 'leaflet/dist/leaflet.css';
```

## 🎯 Uso Básico

### CreateLocationPicker - Para Crear Nuevas Ubicaciones

```tsx
import React, { useState } from 'react';
import CreateLocationPicker from '@/components/LocationPicker/CreateLocationPickerWrapper';

export default function CreateLocationForm() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationChange = (coords: { lat: number; lng: number } | null) => {
    setCoordinates(coords);
    console.log('Nueva ubicación seleccionada:', coords);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Crear Nueva Ubicación</h2>

      <CreateLocationPicker
        height="400px"
        onChange={handleLocationChange}
      />

      {coordinates && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium text-green-800">Ubicación Seleccionada:</h3>
          <p className="text-green-700">
            Latitud: {coordinates.lat.toFixed(6)}<br />
            Longitud: {coordinates.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}
```

### UpdateLocationPicker - Para Editar Ubicaciones Existentes

```tsx
import React, { useState } from 'react';
import UpdateLocationPicker from '@/components/LocationPicker/UpdateLocationPickerWrapper';

export default function EditLocationForm() {
  const [coordinates, setCoordinates] = useState({
    lat: -33.45,  // Santiago, Chile
    lng: -70.6667
  });

  const handleLocationChange = (coords: { lat: number; lng: number } | null) => {
    if (coords) {
      setCoordinates(coords);
      console.log('Ubicación actualizada:', coords);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Editar Ubicación</h2>

      <UpdateLocationPicker
        height="400px"
        initialCoordinates={coordinates}
        onChange={handleLocationChange}
      />

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800">Ubicación Actual:</h3>
        <p className="text-blue-700">
          Latitud: {coordinates.lat.toFixed(6)}<br />
          Longitud: {coordinates.lng.toFixed(6)}
        </p>
      </div>
    </div>
  );
}
```

## 🔧 API Reference

### CreateLocationPicker Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `height` | `string` | `"400px"` | Altura del mapa |
| `onChange` | `(coordinates: { lat: number; lng: number } \| null) => void` | - | Callback cuando cambia la ubicación |

### UpdateLocationPicker Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `height` | `string` | `"400px"` | Altura del mapa |
| `initialCoordinates` | `{ lat: number; lng: number }` | - | Coordenadas iniciales (requerido) |
| `onChange` | `(coordinates: { lat: number; lng: number } \| null) => void` | - | Callback cuando cambia la ubicación |

## 🎯 Casos de Uso Comunes

### Formulario de Registro de Usuario con Ubicación

```tsx
import React, { useState } from 'react';
import CreateLocationPicker from '@/components/LocationPicker/CreateLocationPickerWrapper';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';

export default function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: null as { lat: number; lng: number } | null,
  });

  const handleLocationChange = (coords: { lat: number; lng: number } | null) => {
    setFormData(prev => ({ ...prev, location: coords }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.location) {
      alert('Por favor selecciona una ubicación');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Usuario registrado exitosamente');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Registro de Usuario</h1>

      <TextField
        label="Nombre"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />

      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación
        </label>
        <CreateLocationPicker
          height="300px"
          onChange={handleLocationChange}
        />
        <p className="text-xs text-gray-500 mt-1">
          Haz click en el mapa para seleccionar tu ubicación
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={!formData.name || !formData.email || !formData.location}
        className="w-full"
      >
        Registrarse
      </Button>
    </form>
  );
}
```

### Edición de Perfil con Ubicación

```tsx
import React, { useState, useEffect } from 'react';
import UpdateLocationPicker from '@/components/LocationPicker/UpdateLocationPickerWrapper';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';

interface UserProfile {
  name: string;
  location: { lat: number; lng: number };
}

export default function EditProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos del usuario
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLocationChange = (coords: { lat: number; lng: number } | null) => {
    if (coords && profile) {
      setProfile(prev => prev ? { ...prev, location: coords } : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) return;

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        alert('Perfil actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Cargando perfil...</div>;
  }

  if (!profile) {
    return <div className="p-6 text-center">Error al cargar perfil</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Editar Perfil</h1>

      <TextField
        label="Nombre"
        value={profile.name}
        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación
        </label>
        <UpdateLocationPicker
          height="300px"
          initialCoordinates={profile.location}
          onChange={handleLocationChange}
        />
        <p className="text-xs text-gray-500 mt-1">
          Haz click en el mapa para cambiar tu ubicación
        </p>
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Guardar Cambios
      </Button>
    </form>
  );
}
```

### Sistema de Reportes con Ubicación

```tsx
import React, { useState } from 'react';
import CreateLocationPicker from '@/components/LocationPicker/CreateLocationPickerWrapper';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';

interface Report {
  title: string;
  description: string;
  location: { lat: number; lng: number } | null;
  category: string;
}

export default function ReportIncidentForm() {
  const [report, setReport] = useState<Report>({
    title: '',
    description: '',
    location: null,
    category: 'other',
  });

  const categories = [
    { value: 'infrastructure', label: 'Infraestructura' },
    { value: 'safety', label: 'Seguridad' },
    { value: 'environment', label: 'Medio Ambiente' },
    { value: 'other', label: 'Otro' },
  ];

  const handleLocationChange = (coords: { lat: number; lng: number } | null) => {
    setReport(prev => ({ ...prev, location: coords }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!report.location) {
      alert('Por favor selecciona la ubicación del incidente');
      return;
    }

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      if (response.ok) {
        alert('Reporte enviado exitosamente');
        setReport({
          title: '',
          description: '',
          location: null,
          category: 'other',
        });
      }
    } catch (error) {
      console.error('Error al enviar reporte:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reportar Incidente</h1>

      <TextField
        label="Título del Reporte"
        value={report.title}
        onChange={(e) => setReport(prev => ({ ...prev, title: e.target.value }))}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <select
          value={report.category}
          onChange={(e) => setReport(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <TextField
        label="Descripción"
        value={report.description}
        onChange={(e) => setReport(prev => ({ ...prev, description: e.target.value }))}
        multiline
        rows={4}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación del Incidente *
        </label>
        <CreateLocationPicker
          height="350px"
          onChange={handleLocationChange}
        />
        <p className="text-xs text-gray-500 mt-1">
          Selecciona la ubicación exacta donde ocurrió el incidente
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={!report.title || !report.description || !report.location}
        className="w-full"
      >
        Enviar Reporte
      </Button>
    </form>
  );
}
```

### Dashboard con Múltiples Ubicaciones

```tsx
import React, { useState } from 'react';
import UpdateLocationPicker from '@/components/LocationPicker/UpdateLocationPickerWrapper';
import { Button } from '@/components/Button';

interface Location {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
}

export default function LocationManager() {
  const [locations, setLocations] = useState<Location[]>([
    { id: '1', name: 'Oficina Central', coordinates: { lat: -33.45, lng: -70.6667 } },
    { id: '2', name: 'Sucursal Norte', coordinates: { lat: -33.35, lng: -70.7 } },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleLocationUpdate = (locationId: string, coords: { lat: number; lng: number } | null) => {
    if (coords) {
      setLocations(prev => prev.map(loc =>
        loc.id === locationId ? { ...loc, coordinates: coords } : loc
      ));
    }
  };

  const saveChanges = () => {
    console.log('Guardando todas las ubicaciones:', locations);
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Ubicaciones</h1>
        <Button onClick={saveChanges} variant="primary">
          Guardar Cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold mb-2">{location.name}</h3>

            <div className="mb-4">
              <UpdateLocationPicker
                height="250px"
                initialCoordinates={location.coordinates}
                onChange={(coords) => handleLocationUpdate(location.id, coords)}
              />
            </div>

            <div className="text-sm text-gray-600">
              <p>Lat: {location.coordinates.lat.toFixed(6)}</p>
              <p>Lng: {location.coordinates.lng.toFixed(6)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🎨 Personalización

### Altura y Dimensiones Personalizadas

```tsx
// Mapas de diferentes tamaños
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <h3>Mini Mapa</h3>
    <CreateLocationPicker height="200px" onChange={handleLocation} />
  </div>

  <div>
    <h3>Mapa Grande</h3>
    <CreateLocationPicker height="500px" onChange={handleLocation} />
  </div>
</div>

// Mapa de ancho completo
<CreateLocationPicker
  height="400px"
  className="w-full"
/>
```

### Integración con Formularios Complejos

```tsx
// Usando con React Hook Form
import { useForm, Controller } from 'react-hook-form';

export default function AdvancedForm() {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log('Datos del formulario:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Otros campos del formulario */}

      <Controller
        name="location"
        control={control}
        rules={{ required: 'La ubicación es requerida' }}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            <CreateLocationPicker
              height="350px"
              onChange={(coords) => field.onChange(coords)}
            />
            {errors.location && (
              <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>
        )}
      />

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Enviar
      </button>
    </form>
  );
}
```

## 📱 Responsive Design

El LocationPicker es completamente responsive:

```tsx
// Diseño responsive automático
<CreateLocationPicker
  height="400px" // Se adapta al contenedor padre
  onChange={handleLocation}
/>

// En grids responsivos
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div>
    <CreateLocationPicker height="300px" onChange={handleLocation1} />
  </div>
  <div>
    <CreateLocationPicker height="300px" onChange={handleLocation2} />
  </div>
</div>

// Alturas responsivas
<CreateLocationPicker
  height={window.innerWidth < 640 ? "250px" : "400px"}
  onChange={handleLocation}
/>
```

## 🎯 Mejores Prácticas

### 1. Manejo de Estados de Carga

```tsx
// ✅ Bien - mostrar feedback durante la geolocalización
const [isLoadingLocation, setIsLoadingLocation] = useState(true);

<CreateLocationPicker
  height="400px"
  onChange={(coords) => {
    setIsLoadingLocation(false);
    handleLocationChange(coords);
  }}
/>

{isLoadingLocation && (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
      <p className="text-sm text-gray-600">Obteniendo tu ubicación...</p>
    </div>
  </div>
)}
```

### 2. Validación de Ubicaciones

```tsx
// ✅ Bien - validar coordenadas antes de enviar
const validateCoordinates = (coords: { lat: number; lng: number } | null) => {
  if (!coords) return 'La ubicación es requerida';

  if (coords.lat < -90 || coords.lat > 90) {
    return 'Latitud inválida';
  }

  if (coords.lng < -180 || coords.lng > 180) {
    return 'Longitud inválida';
  }

  return null;
};

const handleSubmit = () => {
  const error = validateCoordinates(selectedLocation);
  if (error) {
    setError(error);
    return;
  }

  // Proceder con el envío
};
```

### 3. Manejo de Errores de Geolocalización

```tsx
// ✅ Bien - proporcionar alternativas cuando falla la geolocalización
const [locationError, setLocationError] = useState<string | null>(null);

<CreateLocationPicker
  height="400px"
  onChange={(coords) => {
    setLocationError(null);
    handleLocationChange(coords);
  }}
/>

{locationError && (
  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
    <p className="text-yellow-800 text-sm">
      {locationError}
      <button
        onClick={() => window.location.reload()}
        className="ml-2 text-yellow-600 underline hover:text-yellow-800"
      >
        Reintentar
      </button>
    </p>
  </div>
)}
```

### 4. Optimización de Performance

```tsx
// ✅ Bien - lazy loading para mapas grandes
const [showMap, setShowMap] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setShowMap(true), 100);
  return () => clearTimeout(timer);
}, []);

return (
  <div>
    {showMap ? (
      <CreateLocationPicker height="400px" onChange={handleLocation} />
    ) : (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    )}
  </div>
);
```

## 🐛 Solución de Problemas

### Problema: El mapa no se carga

```tsx
// Asegúrate de que React Leaflet esté correctamente instalado
import { MapContainer, TileLayer } from 'react-leaflet';

// Verifica que los estilos de Leaflet estén incluidos
import 'leaflet/dist/leaflet.css';

// Para SSR, usa los wrappers dinámicos incluidos
import CreateLocationPicker from '@/components/LocationPicker/CreateLocationPickerWrapper';
```

### Problema: Error de hidratación en SSR

```tsx
// ✅ Solución - usa siempre los wrappers dinámicos
import CreateLocationPicker from '@/components/LocationPicker/CreateLocationPickerWrapper';
import UpdateLocationPicker from '@/components/LocationPicker/UpdateLocationPickerWrapper';

// ❌ Incorrecto - importar directamente los componentes
// import CreateLocationPicker from '@/components/LocationPicker/CreateLocationPicker';
```

### Problema: La geolocalización no funciona

```tsx
// Verifica permisos del navegador
// El componente maneja automáticamente fallbacks:
// 1. Geolocalización del navegador
// 2. Geolocalización del sistema (Electron)
// 3. Ubicación por defecto (Santiago, Chile)

// Para debugging, revisa la consola del navegador
console.log('Permisos de geolocalización:', navigator.permissions);
```

### Problema: Las coordenadas no se actualizan

```tsx
// Asegúrate de que el callback onChange esté memoizado
const handleLocationChange = useCallback((coords) => {
  setCoordinates(coords);
}, []);

// O usa useEffect para manejar cambios
useEffect(() => {
  if (coordinates) {
    console.log('Coordenadas actualizadas:', coordinates);
    // Aquí puedes hacer llamadas a API, validaciones, etc.
  }
}, [coordinates]);
```

### Problema: El marcador no aparece

```tsx
// El componente incluye un marcador automático
// Si necesitas personalizarlo, puedes modificar el createCustomIcon

const createCustomIcon = () => {
  return L.divIcon({
    html: `<span class="material-symbols-outlined text-red-500 text-xl">location_on</span>`,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};
```

### Problema: El mapa se ve pixelado

```tsx
// Leaflet funciona mejor con tamaños específicos
// Usa alturas que sean múltiplos de 256px (tamaño de tiles)

<CreateLocationPicker
  height="384px" // 256 * 1.5
  onChange={handleLocation}
/>

// O usa porcentajes
<div style={{ height: '400px' }}>
  <CreateLocationPicker
    height="100%"
    onChange={handleLocation}
  />
</div>
```

## 📚 Ejemplos Completos

Para ver ejemplos completos de uso, revisa:

- `app/components/LocationPicker/page.tsx` - Showcase completo con ambos modos
- `app/components/LocationPicker/examples.tsx` - Ejemplos adicionales de integración

## 🤝 Contribución

Para contribuir al componente LocationPicker:

1. Mantén la separación entre CreateLocationPicker y UpdateLocationPicker
2. Agrega nuevas opciones de personalización manteniendo la simplicidad
3. Incluye ejemplos de uso para nuevas características
4. Actualiza esta documentación cuando agregues nuevas funcionalidades
5. Asegura que el componente siga siendo SSR-compatible
6. Prueba el componente con diferentes navegadores y dispositivos
7. Considera el impacto en performance al agregar nuevas características