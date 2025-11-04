# TextField Component

Un componente de entrada de texto altamente personalizable con soporte para diferentes tipos de datos, validación automática, formateo inteligente y múltiples variantes visuales.

## 🚀 Características Principales

- ✅ **Múltiples Tipos**: Texto, email, password, textarea, DNI chileno, moneda
- ✅ **Formateo Automático**: DNI chileno y moneda con formato inteligente
- ✅ **Iconos**: Soporte para iconos de inicio y fin
- ✅ **Variantes Visuales**: Normal y contrast
- ✅ **Estados**: Focus, hover, disabled, readonly
- ✅ **Validación**: Campos requeridos con indicadores visuales
- ✅ **Accesibilidad**: Labels flotantes, navegación por teclado
- ✅ **Responsive**: Diseño adaptativo para todos los dispositivos

## 📦 Instalación

```bash
# El componente ya está incluido en el proyecto
import { TextField } from '@/components/TextField';
```

## 🎯 Uso Básico

```tsx
import React, { useState } from 'react';
import { TextField } from '@/components/TextField';

export default function BasicExample() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-4">
      <TextField
        label="Nombre completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ingresa tu nombre"
        required
      />

      <TextField
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
      />
    </div>
  );
}
```

## 🔧 API Reference

### Props del TextField

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | **Requerido** | Etiqueta del campo |
| `value` | `string` | **Requerido** | Valor del campo |
| `onChange` | `function` | **Requerido** | Función que maneja cambios |
| `type` | `string` | `'text'` | Tipo de input (text, email, password, dni, currency) |
| `name` | `string` | `undefined` | Nombre del campo para formularios |
| `placeholder` | `string` | `undefined` | Placeholder del campo |
| `startIcon` | `string` | `undefined` | Icono Material Symbols al inicio |
| `endIcon` | `string` | `undefined` | Icono Material Symbols al final |
| `className` | `string` | `''` | Clases CSS adicionales |
| `variante` | `'normal' \| 'contrast'` | `'normal'` | Variante visual del componente |
| `rows` | `number` | `undefined` | Número de filas (convierte a textarea) |
| `required` | `boolean` | `false` | Campo obligatorio |
| `readOnly` | `boolean` | `false` | Campo de solo lectura |
| `disabled` | `boolean` | `false` | Campo deshabilitado (combina con readOnly, estilos visuales aplicados) |
| `style` | `React.CSSProperties` | `undefined` | Estilos inline para el input |
| `labelStyle` | `React.CSSProperties` | `undefined` | Estilos inline para el label |
| `placeholderColor` | `string` | `undefined` | Color personalizado del placeholder |
| `data-test-id` | `string` | `undefined` | ID para testing |

## 🎨 Variantes

### Variante Normal (Default)

```tsx
<TextField
  label="Nombre"
  value={name}
  onChange={(e) => setName(e.target.value)}
  variante="normal" // o simplemente omitir
/>
```

### Variante Contrast

```tsx
<TextField
  label="Nombre"
  value={name}
  onChange={(e) => setName(e.target.value)}
  variante="contrast"
/>
```

## 📝 Tipos de Input

### Texto Básico

```tsx
<TextField
  label="Nombre completo"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Ingresa tu nombre completo"
/>
```

### Email

```tsx
<TextField
  label="Correo electrónico"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="tu@email.com"
/>
```

### Password con Toggle de Visibilidad

```tsx
const [password, setPassword] = useState('');

<TextField
  label="Contraseña"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Ingresa tu contraseña"
/>
```

### DNI Chileno (Formateo Automático)

```tsx
const [dni, setDni] = useState('');

<TextField
  label="RUT/DNI"
  type="dni"
  value={dni}
  onChange={(e) => setDni(e.target.value)}
  placeholder="12.345.678-9"
/>

// Formatos soportados automáticamente:
// • 12345678-9 → 12.345.678-9
// • 1234567-8 → 1.234.567-8
// • 12345678k → 12.345.678-k
// • 1234567k → 1.234.567-k
```

### Moneda Chilena (Formateo Automático)

```tsx
const [salary, setSalary] = useState('');

<TextField
  label="Salario"
  type="currency"
  value={salary}
  onChange={(e) => setSalary(e.target.value)}
  placeholder="$1.000.000"
/>

// Formatea automáticamente:
// • 1000000 → $1.000.000
// • 500000 → $500.000
```

### Textarea

```tsx
const [description, setDescription] = useState('');

<TextField
  label="Descripción"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  placeholder="Describe tu proyecto..."
/>
```

## 🎯 Iconos

### Iconos de Material Symbols

```tsx
<TextField
  label="Buscar"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  startIcon="search"
  placeholder="Buscar productos..."
/>

<TextField
  label="Usuario"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  startIcon="person"
  endIcon="check_circle"
  placeholder="Nombre de usuario"
/>
```

### Lista de Iconos Comunes

- `person` - Usuario
- `email` - Correo
- `phone` - Teléfono
- `search` - Búsqueda
- `lock` - Candado/Contraseña
- `visibility` / `visibility_off` - Ver/Ocultar (automático en password)
- `check_circle` - Check/Confirmación
- `error` - Error
- `warning` - Advertencia
- `info` - Información

## 🔒 Estados Especiales

### Campo Requerido

```tsx
<TextField
  label="Nombre"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required // Agrega * al label y validación HTML5
/>
```

### Solo Lectura

```tsx
<TextField
  label="ID"
  value={userId}
  onChange={() => {}} // No hace nada
  readOnly // Campo no editable
/>
```

### Campo Deshabilitado

```tsx
<TextField
  label="Campo deshabilitado"
  value="Valor fijo"
  onChange={() => {}}
  disabled // Aplica estilos visuales (opacidad, cursor) y previene cambios
/>
```

**Características del estado disabled:**
- Combina automáticamente con `readOnly` (si `disabled={true}`, se comporta como `readOnly`)
- Aplica estilos visuales: `opacity-50`, `cursor-not-allowed`, `bg-muted`
- Previene la ejecución de `onChange` cuando está activo
- Deshabilita el botón de mostrar/ocultar contraseña
- Aplica opacidad reducida a iconos
- Mantiene el atributo `disabled` en elementos HTML para accesibilidad

## 🎨 Personalización

### Estilos Personalizados

```tsx
<TextField
  label="Campo personalizado"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  style={{
    borderRadius: '8px',
    borderColor: '#custom-color',
    fontSize: '16px'
  }}
  labelStyle={{
    backgroundColor: '#custom-bg',
    color: '#custom-text'
  }}
  placeholderColor="#999"
/>
```

### Color de Placeholder Personalizado

```tsx
<TextField
  label="Buscar"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Escribe para buscar..."
  placeholderColor="#666"
/>
```

## 📱 Responsive Design

El TextField es completamente responsive:

```tsx
// Se adapta automáticamente a diferentes tamaños de pantalla
<TextField
  label="Campo responsive"
  value={value}
  onChange={(e) => setChange(e.target.value)}
  className="w-full md:w-1/2 lg:w-1/3"
/>
```

## 🔧 Integración con Formularios

### Formulario Básico

```tsx
import React, { useState } from 'react';
import { TextField } from '@/components/TextField';

interface FormData {
  name: string;
  email: string;
  password: string;
  dni: string;
}

export default function UserForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    dni: ''
  });

  const handleChange = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="Nombre completo"
        value={formData.name}
        onChange={handleChange('name')}
        required
        startIcon="person"
      />

      <TextField
        label="Correo electrónico"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        required
        startIcon="email"
      />

      <TextField
        label="Contraseña"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        required
        startIcon="lock"
      />

      <TextField
        label="RUT/DNI"
        type="dni"
        value={formData.dni}
        onChange={handleChange('dni')}
        required
        startIcon="badge"
      />

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

### Formulario con Validación

```tsx
import React, { useState } from 'react';
import { TextField } from '@/components/TextField';

export default function ValidatedForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'La edad es requerida';
    } else if (isNaN(Number(formData.age))) {
      newErrors.age = 'La edad debe ser un número';
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
      <TextField
        label="Nombre"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
        className={errors.name ? 'border-red-500' : ''}
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
        className={errors.email ? 'border-red-500' : ''}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <TextField
        label="Edad"
        type="number"
        value={formData.age}
        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
        required
        className={errors.age ? 'border-red-500' : ''}
      />
      {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}

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

## 🎯 Mejores Prácticas

### 1. Usa Labels Descriptivos

```tsx
// ✅ Bien
<TextField
  label="Correo electrónico de contacto"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// ❌ Mal - muy genérico
<TextField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### 2. Proporciona Placeholders Útiles

```tsx
// ✅ Bien
<TextField
  label="Número de teléfono"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="+56 9 1234 5678"
/>

// ❌ Mal - placeholder redundante
<TextField
  label="Número de teléfono"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Número de teléfono"
/>
```

### 3. Usa Tipos Específicos para Mejor UX

```tsx
// ✅ Bien - usa tipos específicos
<TextField label="Email" type="email" ... />
<TextField label="Contraseña" type="password" ... />
<TextField label="RUT" type="dni" ... />

// ❌ Mal - todo como texto
<TextField label="Email" type="text" ... />
<TextField label="Contraseña" type="text" ... />
<TextField label="RUT" type="text" ... />
```

### 4. Maneja Estados de Error

```tsx
// ✅ Bien - muestra errores claramente
<div>
  <TextField
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className={errors.email ? 'border-red-500' : ''}
  />
  {errors.email && (
    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
  )}
</div>
```

## 🐛 Solución de Problemas

### Problema: El formateo automático no funciona

```tsx
// Asegúrate de usar el tipo correcto
<TextField
  type="dni" // Para RUT chileno
  // o
  type="currency" // Para moneda chilena
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Problema: Los iconos no aparecen

```tsx
// Usa nombres de iconos de Material Symbols
<TextField
  startIcon="search" // ✅ Correcto
  // No uses:
  // startIcon="🔍" // ❌ Emoji
  // startIcon="fa-search" // ❌ FontAwesome
/>
```

### Problema: El label no flota correctamente

```tsx
// Asegúrate de manejar el estado focused correctamente
<TextField
  label="Campo"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  // El componente maneja automáticamente el focus
/>
```

## 📚 Ejemplos Completos

Para ver ejemplos completos de uso, revisa:

- `app/components/TextField/page.tsx` - Showcase completo con todas las variantes
- `app/components/BaseForm/` - Ejemplos de uso en formularios complejos

## 🤝 Contribución

Para contribuir al componente TextField:

1. Mantén la compatibilidad con la API existente
2. Agrega nuevos tipos de formateo siguiendo el patrón de `dni` y `currency`
3. Actualiza esta documentación cuando agregues nuevas funcionalidades
4. Incluye ejemplos de uso para nuevas características</content>
<parameter name="filePath">/Users/felipe/dev/DSP-App/app/components/TextField/README.md