import Link from 'next/link';
import { Button } from './Button/Button';

interface ComponentInfo {
  name: string;
  description: string;
  path: string;
  category: string;
}

const components: ComponentInfo[] = [
  // Form Components
  {
    name: 'BaseForm',
    description: 'Formularios flexibles y reutilizables para crear y editar datos con validación y múltiples layouts',
    path: '/components/BaseForm',
    category: 'Forms'
  },
  {
    name: 'TextField',
    description: 'Campo de texto con soporte para diferentes tipos, validación y formato personalizado',
    path: '/components/TextField',
    category: 'Forms'
  },
  {
    name: 'Select',
    description: 'Selector desplegable con opciones personalizables y búsqueda',
    path: '/components/Select',
    category: 'Forms'
  },
  {
    name: 'AutoComplete',
    description: 'Campo de autocompletado con búsqueda en tiempo real y opciones dinámicas',
    path: '/components/AutoComplete',
    category: 'Forms'
  },
  {
    name: 'Switch',
    description: 'Interruptor de encendido/apagado con estados booleanos',
    path: '/components/Switch',
    category: 'Forms'
  },
  {
    name: 'RangeSlider',
    description: 'Control deslizante para selección de rangos numéricos',
    path: '/components/RangeSlider',
    category: 'Forms'
  },
  {
    name: 'LocationPicker',
    description: 'Selector de ubicación con mapa interactivo para coordenadas geográficas',
    path: '/components/LocationPicker',
    category: 'Forms'
  },
  {
    name: 'FileUploader',
    description: 'Componente para subir archivos con validación y preview',
    path: '/components/FileUploader',
    category: 'Forms'
  },

  // UI Components
  {
    name: 'Button',
    description: 'Botones con múltiples variantes, tamaños y estados de carga',
    path: '/components/Button',
    category: 'UI'
  },
  {
    name: 'IconButton',
    description: 'Botones con iconos para acciones rápidas y compactas',
    path: '/components/IconButton',
    category: 'UI'
  },
  {
    name: 'Card',
    description: 'Contenedores con sombra y padding para agrupar contenido',
    path: '/components/Card',
    category: 'UI'
  },
  {
    name: 'Dialog',
    description: 'Modales y diálogos para confirmaciones y contenido adicional',
    path: '/components/Dialog',
    category: 'UI'
  },
  {
    name: 'Alert',
    description: 'Mensajes de notificación con diferentes niveles de severidad',
    path: '/components/Alert',
    category: 'UI'
  },
  {
    name: 'TopBar',
    description: 'Barra superior de navegación con título y acciones',
    path: '/components/TopBar',
    category: 'UI'
  },
  {
    name: 'Logo',
    description: 'Componente de logo con diferentes variantes y tamaños',
    path: '/components/Logo',
    category: 'UI'
  },

  // Data Display
  {
    name: 'DataGrid',
    description: 'Tabla avanzada con filtrado, ordenamiento, paginación y acciones por fila',
    path: '/components/DataGrid',
    category: 'Data Display'
  },
  {
    name: 'Dropdown',
    description: 'Menús desplegables con opciones anidadas y acciones',
    path: '/components/Dropdown',
    category: 'Data Display'
  },
  {
    name: 'DropdownList',
    description: 'Listas desplegables para navegación y selección múltiple',
    path: '/components/DropdownList',
    category: 'Data Display'
  },

  // Feedback
  {
    name: 'CircularProgress',
    description: 'Indicadores de carga circulares con diferentes tamaños',
    path: '/components/CircularProgress',
    category: 'Feedback'
  },
  {
    name: 'DotProgress',
    description: 'Indicadores de carga con puntos animados',
    path: '/components/DotProgress',
    category: 'Feedback'
  },

  // Navigation
  {
    name: 'LoginForm',
    description: 'Formulario completo de autenticación con validación',
    path: '/components/LoginForm',
    category: 'Navigation'
  },

  // Utilities
  {
    name: 'FontAwesome',
    description: 'Biblioteca de iconos FontAwesome con soporte para múltiples estilos',
    path: '/components/FontAwesome',
    category: 'Utilities'
  }
];

const categories = [...new Set(components.map(c => c.category))];

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Component Library</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explora nuestra biblioteca completa de componentes reutilizables. Cada componente incluye
            documentación interactiva, ejemplos de uso y opciones de personalización.
          </p>
        </div>

        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {components
                .filter(component => component.category === category)
                .map(component => (
                  <div
                    key={component.name}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{component.name}</h3>
                      <Link href={component.path}>
                        <Button variant="outlined" size="sm">
                          Ver Showcase
                        </Button>
                      </Link>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {component.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">¿Quieres contribuir?</h3>
          <p className="text-blue-700">
            Si has creado un nuevo componente o mejorado uno existente, asegúrate de crear su página
            de showcase correspondiente siguiendo el patrón establecido.
          </p>
        </div>
      </div>
    </div>
  );
}