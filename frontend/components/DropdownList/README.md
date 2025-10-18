# DropdownList Component

Componente de lista desplegable reutilizable y flexible, diseñado como base fundamental para componentes como Select y AutoComplete. Proporciona posicionamiento inteligente, scroll automático y estilos consistentes.

## 🚀 Características Principales

- ✅ **Posicionamiento Inteligente**: Soporte para drop-down y drop-up
- ✅ **Scroll Automático**: Manejo de listas largas con max-height
- ✅ **Estilos Consistentes**: Clase CSS predefinida para opciones
- ✅ **TypeScript**: Completamente tipado
- ✅ **Data Test IDs**: Soporte completo para testing automatizado
- ✅ **Responsive**: Diseño adaptativo
- ✅ **Accesibilidad**: Soporte para navegación por teclado
- ✅ **Performance**: Renderizado condicional optimizado

## 📦 Instalación

```bash
# El componente ya está incluido en el proyecto
import DropdownList, { dropdownOptionClass } from '@/components/DropdownList';
```

## 🎯 Uso Básico

```tsx
import React, { useState } from 'react';
import DropdownList, { dropdownOptionClass } from '@/components/DropdownList';

export default function BasicDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const options = ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'];

  return (
    <div className="relative max-w-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {selectedItem || 'Seleccionar opción...'}
        <span className="float-right">▼</span>
      </button>

      <DropdownList open={isOpen} testId="basic-dropdown">
        {options.map((option, index) => (
          <li
            key={index}
            className={dropdownOptionClass}
            onClick={() => {
              setSelectedItem(option);
              setIsOpen(false);
            }}
          >
            {option}
          </li>
        ))}
      </DropdownList>
    </div>
  );
}
```

## 🔧 API Reference

### Props del DropdownList

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controla la visibilidad de la lista desplegable |
| `children` | `React.ReactNode` | - | Contenido de la lista (normalmente elementos `<li>`) |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor |
| `style` | `React.CSSProperties` | - | Estilos inline adicionales |
| `testId` | `string` | `"dropdown-list"` | ID para testing automatizado |
| `dropUp` | `boolean` | `false` | Si es `true`, la lista se abre hacia arriba |

### Clase CSS Predefinida

```tsx
// Clase exportada para opciones consistentes
export const dropdownOptionClass =
  "px-3 py-2 cursor-pointer text-sm font-light rounded transition-colors duration-200 hover:bg-secondary/30 hover:rounded-none";
```

## 🎯 Casos de Uso Comunes

### Dropdown Básico con Selección

```tsx
import React, { useState } from 'react';
import DropdownList, { dropdownOptionClass } from '@/components/DropdownList';

interface Option {
  id: string;
  label: string;
  value: any;
}

export default function SelectionDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const options: Option[] = [
    { id: '1', label: 'Primera opción', value: 'first' },
    { id: '2', label: 'Segunda opción', value: 'second' },
    { id: '3', label: 'Tercera opción', value: 'third' },
  ];

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative max-w-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {selectedOption?.label || 'Seleccionar opción...'}
        <span className={`float-right transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      <DropdownList open={isOpen} testId="selection-dropdown">
        {options.map((option) => (
          <li
            key={option.id}
            className={`${dropdownOptionClass} ${
              selectedOption?.id === option.id ? 'bg-blue-50 text-blue-700' : ''
            }`}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </li>
        ))}
      </DropdownList>
    </div>
  );
}
```

### Dropdown con Íconos y Estilos Personalizados

```tsx
import React, { useState } from 'react';
import DropdownList, { dropdownOptionClass } from '@/components/DropdownList';

export default function StyledDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Perfil', icon: '👤', action: () => console.log('Perfil') },
    { label: 'Configuración', icon: '⚙️', action: () => console.log('Configuración') },
    { label: 'Ayuda', icon: '❓', action: () => console.log('Ayuda') },
    { label: 'Cerrar sesión', icon: '🚪', action: () => console.log('Logout'), danger: true },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="mr-2">👤</span>
        Usuario
        <span className="ml-auto">▼</span>
      </button>

      <DropdownList
        open={isOpen}
        className="border border-gray-200 min-w-[200px]"
        testId="user-menu"
      >
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`${dropdownOptionClass} ${
              item.danger ? 'text-red-600 hover:bg-red-50' : ''
            }`}
            onClick={() => {
              item.action();
              setIsOpen(false);
            }}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </DropdownList>
    </div>
  );
}
```

### Dropdown con Scroll (Listas Largas)

```tsx
import React, { useState } from 'react';
import DropdownList, { dropdownOptionClass } from '@/components/DropdownList';

export default function LongListDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Generar lista larga
  const items = Array.from({ length: 100 }, (_, i) => `Elemento ${i + 1}`);

  return (
    <div className="relative max-w-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {selectedItem || 'Seleccionar elemento...'}
        <span className="float-right">▼</span>
      </button>

      <DropdownList
        open={isOpen}
        className="max-h-64" // Altura máxima personalizada
        testId="long-list-dropdown"
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={dropdownOptionClass}
            onClick={() => {
              setSelectedItem(item);
              setIsOpen(false);
            }}
          >
            {item}
          </li>
        ))}
      </DropdownList>
    </div>
  );
}
```

### Dropdown con Búsqueda (Base para AutoComplete)

```tsx
import React, { useState, useMemo } from 'react';
import DropdownList, { dropdownOptionClass } from '@/components/DropdownList';

export default function SearchableDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const allItems = [
    'Manzana', 'Banana', 'Cereza', 'Durazno', 'Frambuesa',
    'Granada', 'Higo', 'Kiwi', 'Limón', 'Mango', 'Naranja'
  ];

  const filteredItems = useMemo(() => {
    if (!searchTerm) return allItems;
    return allItems.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allItems]);

  return (
    <div className="relative max-w-sm">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar frutas..."
          className="w-full px-4 py-2 pr-8 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          ▼
        </button>
      </div>

      <DropdownList open={isOpen && filteredItems.length > 0} testId="search-dropdown">
        {filteredItems.map((item, index) => (
          <li
            key={index}
            className={dropdownOptionClass}
            onClick={() => {
              setSelectedItem(item);
              setSearchTerm(item);
              setIsOpen(false);
            }}
          >
            {item}
          </li>
        ))}
      </DropdownList>
    </div>
  );
}
```

### Dropdown con Drop-Up (Para posiciones bajas)

```tsx
import React, { useState } from 'react';
import DropdownList, { dropdownOptionClass } from '@/components/DropdownList';

export default function DropUpDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const options = ['Editar', 'Duplicar', 'Mover', 'Eliminar'];

  return (
    <div className="relative max-w-sm">
      {/* Contenedor posicionado al final de la pantalla */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Acciones ▼
        </button>

        <DropdownList
          open={isOpen}
          dropUp={true} // Se abre hacia arriba
          className="min-w-[150px]"
          testId="dropup-menu"
        >
          {options.map((option, index) => (
            <li
              key={index}
              className={`${dropdownOptionClass} ${
                option === 'Eliminar' ? 'text-red-600 hover:bg-red-50' : ''
              }`}
              onClick={() => {
                console.log(`Acción: ${option}`);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </DropdownList>
      </div>
    </div>
  );
}
```

## 🎨 Personalización

### Estilos de Opciones Personalizados

```tsx
// Usando la clase base y agregando estilos
const customOptionClass = `${dropdownOptionClass} font-medium text-gray-800`;

// O creando estilos completamente personalizados
const myCustomStyles = {
  padding: '12px 16px',
  cursor: 'pointer',
  backgroundColor: 'var(--color-primary)',
  color: 'white',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
};
```

### Tema Oscuro

```tsx
// Para tema oscuro, modifica las variables CSS
<DropdownList
  open={isOpen}
  className="bg-gray-800 border-gray-600"
  style={{
    backgroundColor: 'var(--color-background-dark)',
    borderColor: 'var(--color-border-dark)',
  }}
>
  {options.map((option, index) => (
    <li
      key={index}
      className={`${dropdownOptionClass} text-gray-200 hover:bg-gray-700`}
      onClick={() => handleSelect(option)}
    >
      {option}
    </li>
  ))}
</DropdownList>
```

### Posicionamiento Personalizado

```tsx
// Dropdown con posicionamiento absoluto personalizado
<DropdownList
  open={isOpen}
  style={{
    position: 'fixed',
    top: '100px',
    left: '200px',
    width: '300px',
    zIndex: 1000,
  }}
  className="shadow-2xl border-2 border-blue-200"
>
  {/* Contenido personalizado */}
</DropdownList>
```

## 📱 Responsive Design

El DropdownList es completamente responsive:

```tsx
// Dropdown responsive que se adapta al tamaño de pantalla
<div className="relative">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-md"
  >
    Opciones
  </button>

  <DropdownList
    open={isOpen}
    className="w-full sm:w-64" // Ancho completo en móvil, fijo en desktop
  >
    {options.map((option, index) => (
      <li
        key={index}
        className={dropdownOptionClass}
        onClick={() => handleSelect(option)}
      >
        {option}
      </li>
    ))}
  </DropdownList>
</div>
```

## 🎯 Mejores Prácticas

### 1. Gestiona el Estado Correctamente

```tsx
// ✅ Bien - estado controlado con limpieza
const [isOpen, setIsOpen] = useState(false);

const handleSelect = (option: Option) => {
  setSelectedOption(option);
  setIsOpen(false); // Cierra el dropdown al seleccionar
};

// ✅ Bien - cierra al hacer click fuera
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

### 2. Usa Data Test IDs para Testing

```tsx
// ✅ Bien - IDs descriptivos para testing
<DropdownList open={isOpen} testId="user-role-dropdown">
  <li data-test-id="role-admin" className={dropdownOptionClass}>
    Administrador
  </li>
  <li data-test-id="role-user" className={dropdownOptionClass}>
    Usuario
  </li>
</DropdownList>
```

### 3. Maneja Listas Largas Eficientemente

```tsx
// ✅ Bien - virtualización para listas muy largas
import { FixedSizeList as List } from 'react-window';

<DropdownList open={isOpen} className="h-64 overflow-hidden">
  <List
    height={256}
    itemCount={items.length}
    itemSize={32}
  >
    {({ index, style }) => (
      <li
        style={style}
        className={dropdownOptionClass}
        onClick={() => handleSelect(items[index])}
      >
        {items[index].label}
      </li>
    )}
  </List>
</DropdownList>
```

### 4. Accesibilidad

```tsx
// ✅ Bien - navegación por teclado
const handleKeyDown = (event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      // Mover foco a siguiente opción
      break;
    case 'ArrowUp':
      event.preventDefault();
      // Mover foco a opción anterior
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      // Seleccionar opción actual
      break;
    case 'Escape':
      setIsOpen(false);
      break;
  }
};
```

## 🐛 Solución de Problemas

### Problema: El dropdown no se cierra al seleccionar

```tsx
// Asegúrate de cerrar el dropdown en el onClick
<li
  className={dropdownOptionClass}
  onClick={() => {
    handleSelect(option);
    setIsOpen(false); // ✅ Importante: cerrar el dropdown
  }}
>
  {option.label}
</li>
```

### Problema: Z-index insuficiente

```tsx
// Aumenta el z-index si el dropdown se oculta detrás de otros elementos
<DropdownList
  open={isOpen}
  className="z-[100]" // O usa style={{ zIndex: 100 }}
>
  {/* opciones */}
</DropdownList>
```

### Problema: Scroll no funciona en listas largas

```tsx
// El componente tiene max-height por defecto, pero puedes personalizarlo
<DropdownList
  open={isOpen}
  className="max-h-32 overflow-y-auto" // Altura máxima personalizada
>
  {/* muchas opciones */}
</DropdownList>
```

### Problema: Posicionamiento incorrecto

```tsx
// Para dropUp, usa la prop dropUp
<DropdownList
  open={isOpen}
  dropUp={true} // ✅ Se abre hacia arriba
>
  {/* opciones */}
</DropdownList>

// Para posicionamiento personalizado, usa style
<DropdownList
  open={isOpen}
  style={{
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
  }}
>
  {/* opciones */}
</DropdownList>
```

## 📚 Ejemplos Completos

Para ver ejemplos completos de uso, revisa:

- `app/components/DropdownList/page.tsx` - Showcase completo con diferentes variantes
- `app/components/Select/Select.tsx` - Uso en componente Select
- `app/components/AutoComplete/AutoComplete.tsx` - Uso en componente AutoComplete

## 🤝 Contribución

Para contribuir al componente DropdownList:

1. Mantén la compatibilidad con la API existente
2. Agrega nuevas opciones de personalización manteniendo la simplicidad
3. Incluye ejemplos de uso para nuevas características
4. Actualiza esta documentación cuando agregues nuevas funcionalidades
5. Asegura que el componente siga siendo accesible y usable con teclado
6. Prueba el componente con listas de diferentes tamaños