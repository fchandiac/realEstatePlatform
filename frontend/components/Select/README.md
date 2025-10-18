# Select Component

Un componente de selección desplegable altamente accesible con navegación por teclado, búsqueda integrada, validación automática y múltiples opciones de personalización.

## 🚀 Características Principales

- ✅ **Navegación por Teclado**: Arrow keys, Enter, Escape, Tab
- ✅ **Accesibilidad**: ARIA labels, screen reader support, focus management
- ✅ **Validación**: Campos requeridos con indicadores visuales
- ✅ **Estados**: Focus, hover, disabled, required
- ✅ **Limpieza**: Botón para limpiar selección
- ✅ **Responsive**: Diseño adaptativo
- ✅ **TypeScript**: Completamente tipado

## 📦 Instalación

```bash
# El componente ya está incluido en el proyecto
import Select from '@/components/Select';
import type { Option } from '@/components/Select';
```

## 🎯 Uso Básico

```tsx
import React, { useState } from 'react';
import Select from '@/components/Select';

export default function BasicSelect() {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  const roleOptions: Option[] = [
    { id: 1, label: 'Administrador' },
    { id: 2, label: 'Usuario' },
    { id: 3, label: 'Invitado' },
    { id: 4, label: 'Moderador' }
  ];

  return (
    <div className="w-64">
      <Select
        options={roleOptions}
        placeholder="Selecciona un rol"
        value={selectedRole}
        onChange={setSelectedRole}
        required
      />
    </div>
  );
}
```

## 🔧 API Reference

### Props del Select

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `options` | `Option[]` | **Requerido** | Array de opciones disponibles |
| `placeholder` | `string` | **Requerido** | Placeholder y label del campo |
| `value` | `number \| null` | `null` | ID de la opción seleccionada |
| `onChange` | `function` | `undefined` | Función llamada al cambiar selección |
| `required` | `boolean` | `false` | Campo obligatorio |
| `name` | `string` | `undefined` | Nombre para validación de formularios |
| `data-test-id` | `string` | `undefined` | ID para testing |

### Interface Option

```tsx
interface Option {
  id: number;      // Identificador único numérico
  label: string;   // Texto mostrado al usuario
}
```

## 🎨 Estados y Variantes

### Campo Requerido

```tsx
<Select
  options={options}
  placeholder="Selecciona una opción *"
  value={value}
  onChange={setValue}
  required  // Agrega * al label y validación
/>
```

### Campo con Valor Seleccionado

```tsx
const [selectedCountry, setSelectedCountry] = useState<number | null>(1);

<Select
  options={[
    { id: 1, label: 'Chile' },
    { id: 2, label: 'Argentina' },
    { id: 3, label: 'México' }
  ]}
  placeholder="País"
  value={selectedCountry}  // Chile estará seleccionado
  onChange={setSelectedCountry}
/>
```

### Campo Vacío

```tsx
const [selectedValue, setSelectedValue] = useState<number | null>(null);

<Select
  options={options}
  placeholder="Selecciona una opción"
  value={selectedValue}  // Ninguna opción seleccionada
  onChange={setSelectedValue}
/>
```

## 🎯 Navegación por Teclado

El componente soporta navegación completa por teclado:

- **Arrow Down/Up**: Navegar entre opciones
- **Enter**: Seleccionar opción resaltada
- **Escape**: Cerrar dropdown sin seleccionar
- **Tab**: Mover foco al siguiente campo

```tsx
// El componente maneja automáticamente la navegación por teclado
<Select
  options={options}
  placeholder="Selecciona"
  value={value}
  onChange={setValue}
/>
```

## 🔄 Limpieza de Selección

### Botón de Limpiar

```tsx
const [selectedValue, setSelectedValue] = useState<number | null>(1);

<Select
  options={options}
  placeholder="Selecciona"
  value={selectedValue}
  onChange={setSelectedValue}
/>

// Aparece automáticamente un botón X cuando hay una selección
// Al hacer click, setSelectedValue(null) es llamado
```

## 📱 Responsive Design

El Select es completamente responsive:

```tsx
// Se adapta automáticamente al ancho del contenedor
<div className="w-full md:w-1/2 lg:w-1/3">
  <Select
    options={options}
    placeholder="Selecciona"
    value={value}
    onChange={setValue}
  />
</div>
```

## 🎯 Integración con Formularios

### Formulario Básico

```tsx
import React, { useState } from 'react';
import Select from '@/components/Select';

interface FormData {
  name: string;
  role: number | null;
  department: number | null;
}

export default function UserForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: null,
    department: null
  });

  const roleOptions = [
    { id: 1, label: 'Admin' },
    { id: 2, label: 'User' },
    { id: 3, label: 'Guest' }
  ];

  const departmentOptions = [
    { id: 1, label: 'Ventas' },
    { id: 2, label: 'Marketing' },
    { id: 3, label: 'IT' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <Select
        options={roleOptions}
        placeholder="Rol del usuario"
        value={formData.role}
        onChange={(role) => setFormData(prev => ({ ...prev, role }))}
        required
      />

      <Select
        options={departmentOptions}
        placeholder="Departamento"
        value={formData.department}
        onChange={(dept) => setFormData(prev => ({ ...prev, department: dept }))}
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Crear Usuario
      </button>
    </form>
  );
}
```

### Formulario con Validación

```tsx
import React, { useState } from 'react';
import Select from '@/components/Select';

export default function ValidatedForm() {
  const [formData, setFormData] = useState({
    category: null,
    priority: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { id: 1, label: 'Bug' },
    { id: 2, label: 'Feature' },
    { id: 3, label: 'Improvement' }
  ];

  const priorityOptions = [
    { id: 1, label: 'Low' },
    { id: 2, label: 'Medium' },
    { id: 3, label: 'High' },
    { id: 4, label: 'Critical' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'Debes seleccionar una categoría';
    }

    if (!formData.priority) {
      newErrors.priority = 'Debes seleccionar una prioridad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Formulario válido:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Select
          options={categoryOptions}
          placeholder="Categoría"
          value={formData.category}
          onChange={(cat) => setFormData(prev => ({ ...prev, category: cat }))}
          required
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      <div>
        <Select
          options={priorityOptions}
          placeholder="Prioridad"
          value={formData.priority}
          onChange={(pri) => setFormData(prev => ({ ...prev, priority: pri }))}
        />
        {errors.priority && (
          <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Enviar
      </button>
    </form>
  );
}
```

## 🎯 Casos de Uso Comunes

### Selección de País

```tsx
const countryOptions = [
  { id: 1, label: 'Chile' },
  { id: 2, label: 'Argentina' },
  { id: 3, label: 'México' },
  { id: 4, label: 'Colombia' },
  { id: 5, label: 'Perú' }
];

<Select
  options={countryOptions}
  placeholder="Selecciona tu país"
  value={selectedCountry}
  onChange={setSelectedCountry}
  required
/>
```

### Selección de Categoría con Muchas Opciones

```tsx
const categoryOptions = [
  { id: 1, label: 'Electrónicos' },
  { id: 2, label: 'Ropa y Accesorios' },
  { id: 3, label: 'Hogar y Jardín' },
  { id: 4, label: 'Deportes y Recreación' },
  { id: 5, label: 'Libros y Educación' },
  { id: 6, label: 'Salud y Belleza' },
  { id: 7, label: 'Automotriz' },
  { id: 8, label: 'Juguetes y Juegos' }
];

<Select
  options={categoryOptions}
  placeholder="Categoría del producto"
  value={selectedCategory}
  onChange={setSelectedCategory}
/>
```

### Selección de Estado/Provincia

```tsx
const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
const [selectedState, setSelectedState] = useState<number | null>(null);

const countryOptions = [
  { id: 1, label: 'Chile' },
  { id: 2, label: 'Argentina' }
];

const chileStates = [
  { id: 1, label: 'Santiago' },
  { id: 2, label: 'Valparaíso' },
  { id: 3, label: 'Concepción' }
];

const argentinaStates = [
  { id: 4, label: 'Buenos Aires' },
  { id: 5, label: 'Córdoba' },
  { id: 6, label: 'Rosario' }
];

const stateOptions = selectedCountry === 1 ? chileStates :
                    selectedCountry === 2 ? argentinaStates : [];

return (
  <div className="space-y-4">
    <Select
      options={countryOptions}
      placeholder="País"
      value={selectedCountry}
      onChange={(country) => {
        setSelectedCountry(country);
        setSelectedState(null); // Reset state when country changes
      }}
    />

    <Select
      options={stateOptions}
      placeholder="Estado/Provincia"
      value={selectedState}
      onChange={setSelectedState}
      disabled={!selectedCountry}
    />
  </div>
);
```

## 🎯 Mejores Prácticas

### 1. Usa Placeholders Descriptivos

```tsx
// ✅ Bien
<Select
  options={roleOptions}
  placeholder="Selecciona el rol del usuario"
  value={role}
  onChange={setRole}
/>

// ❌ Mal - muy genérico
<Select
  options={roleOptions}
  placeholder="Selecciona"
  value={role}
  onChange={setRole}
/>
```

### 2. Ordena las Opciones Lógicamente

```tsx
// ✅ Bien - ordenado alfabéticamente
const countryOptions = [
  { id: 1, label: 'Argentina' },
  { id: 2, label: 'Chile' },
  { id: 3, label: 'México' }
];

// ✅ Bien - ordenado por frecuencia de uso
const priorityOptions = [
  { id: 1, label: 'Normal' },
  { id: 2, label: 'Alta' },
  { id: 3, label: 'Crítica' }
];
```

### 3. Maneja Estados de Carga

```tsx
const [options, setOptions] = useState<Option[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadOptions = async () => {
    try {
      const data = await fetchOptions();
      setOptions(data);
    } finally {
      setLoading(false);
    }
  };

  loadOptions();
}, []);

if (loading) {
  return <div>Cargando opciones...</div>;
}

<Select
  options={options}
  placeholder="Selecciona una opción"
  value={value}
  onChange={setValue}
/>
```

### 4. Usa IDs Numéricos Consistentes

```tsx
// ✅ Bien - IDs numéricos únicos
const options = [
  { id: 1, label: 'Opción A' },
  { id: 2, label: 'Opción B' },
  { id: 3, label: 'Opción C' }
];

// ❌ Mal - mezcla de tipos
const badOptions = [
  { id: '1', label: 'Opción A' },  // string
  { id: 2, label: 'Opción B' },    // number
  { id: 'three', label: 'Opción C' } // string
];
```

## 🐛 Solución de Problemas

### Problema: El dropdown no se abre

```tsx
// Asegúrate de que el contenedor tenga ancho suficiente
<div className="w-64"> {/* o min-w-[180px] */}
  <Select
    options={options}
    placeholder="Selecciona"
    value={value}
    onChange={setValue}
  />
</div>
```

### Problema: La validación no funciona

```tsx
// Para validación HTML nativa, proporciona un name único
<Select
  options={options}
  placeholder="Selecciona"
  value={value}
  onChange={setValue}
  required
  name="category-select" // Importante para validación
/>
```

### Problema: Las opciones no se muestran correctamente

```tsx
// Asegúrate de que las opciones tengan id y label
const options = [
  { id: 1, label: 'Opción 1' }, // ✅ Correcto
  { id: '1', label: 'Opción 1' } // ❌ id debe ser number
];

// Y que value sea number | null
const [value, setValue] = useState<number | null>(null);
```

### Problema: El foco se pierde al navegar

```tsx
// El componente maneja automáticamente el foco
// Si tienes problemas, asegúrate de que no haya interferencias
<Select
  options={options}
  placeholder="Selecciona"
  value={value}
  onChange={setValue}
  data-test-id="my-select" // Para debugging
/>
```

## 📚 Ejemplos Completos

Para ver ejemplos completos de uso, revisa:

- `app/components/Select/page.tsx` - Showcase completo con todas las variantes
- `app/components/BaseForm/` - Ejemplos de uso en formularios complejos

## 🤝 Contribución

Para contribuir al componente Select:

1. Mantén la compatibilidad con la API existente
2. Agrega nuevas funcionalidades manteniendo la accesibilidad
3. Incluye ejemplos de uso para nuevas características
4. Actualiza esta documentación cuando agregues nuevas funcionalidades
5. Asegura que todas las interacciones por teclado funcionen correctamente</content>
<parameter name="filePath">/Users/felipe/dev/DSP-App/app/components/Select/README.md