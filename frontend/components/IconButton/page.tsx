'use client'
import React, { useState } from 'react';
import IconButton from './IconButton';
import Link from 'next/link';

export default function IconButtonShowcase() {
  const [clickCount, setClickCount] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<'containedPrimary' | 'containedSecondary' | 'text' | 'basic' | 'outlined'>('containedPrimary');
  const [selectedSize, setSelectedSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');

  const iconExamples = [
    { name: 'home', label: 'Inicio' },
    { name: 'search', label: 'Buscar' },
    { name: 'favorite', label: 'Favorito' },
    { name: 'settings', label: 'Configuración' },
    { name: 'delete', label: 'Eliminar' },
    { name: 'edit', label: 'Editar' },
    { name: 'add', label: 'Agregar' },
    { name: 'close', label: 'Cerrar' },
    { name: 'menu', label: 'Menú' },
    { name: 'share', label: 'Compartir' },
    { name: 'download', label: 'Descargar' },
    { name: 'upload', label: 'Subir' },
    { name: 'refresh', label: 'Actualizar' },
    { name: 'info', label: 'Información' },
    { name: 'help', label: 'Ayuda' },
    { name: 'notifications', label: 'Notificaciones' },
  ];

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IconButton Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente de botón con icono que utiliza Material Symbols de Google.
            Incluye múltiples variantes de estilo, tamaños personalizables y
            transiciones suaves para una experiencia de usuario óptima.
          </p>
        </div>

        {/* Basic Usage Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Uso Básico</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            {iconExamples.slice(0, 8).map((icon) => (
              <div key={icon.name} className="text-center">
                <IconButton
                  icon={icon.name}
                  ariaLabel={icon.label}
                  onClick={() => console.log(`Clicked ${icon.label}`)}
                />
                <div className="text-xs text-gray-500 mt-2">{icon.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Variant Showcase Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variantes de Estilo</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Variante:</label>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="containedPrimary">Contained Primary</option>
              <option value="containedSecondary">Contained Secondary</option>
              <option value="text">Text</option>
              <option value="basic">Basic</option>
              <option value="outlined">Outlined</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Contained Primary</h3>
              <IconButton icon="home" variant="containedPrimary" ariaLabel="Home" />
              <div className="text-xs text-gray-500 mt-2">Botón relleno primario</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Contained Secondary</h3>
              <IconButton icon="search" variant="containedSecondary" ariaLabel="Search" />
              <div className="text-xs text-gray-500 mt-2">Botón relleno secundario</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Text</h3>
              <IconButton icon="favorite" variant="text" ariaLabel="Favorite" />
              <div className="text-xs text-gray-500 mt-2">Botón solo texto</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Basic</h3>
              <IconButton icon="settings" variant="basic" ariaLabel="Settings" />
              <div className="text-xs text-gray-500 mt-2">Botón básico</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Outlined</h3>
              <IconButton icon="delete" variant="outlined" ariaLabel="Delete" />
              <div className="text-xs text-gray-500 mt-2">Botón con borde</div>
            </div>
          </div>
        </div>

        {/* Size Variants Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variantes de Tamaño</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="xs">Extra Small (xs)</option>
              <option value="sm">Small (sm)</option>
              <option value="md">Medium (md)</option>
              <option value="lg">Large (lg)</option>
              <option value="xl">Extra Large (xl)</option>
            </select>
          </div>

          <div className="flex items-end gap-6 mb-6">
            <div className="text-center">
              <IconButton icon="home" size="xs" ariaLabel="Home XS" />
              <div className="text-xs text-gray-500 mt-2">xs (24px)</div>
            </div>
            <div className="text-center">
              <IconButton icon="home" size="sm" ariaLabel="Home SM" />
              <div className="text-xs text-gray-500 mt-2">sm (28px)</div>
            </div>
            <div className="text-center">
              <IconButton icon="home" size="md" ariaLabel="Home MD" />
              <div className="text-xs text-gray-500 mt-2">md (32px)</div>
            </div>
            <div className="text-center">
              <IconButton icon="home" size="lg" ariaLabel="Home LG" />
              <div className="text-xs text-gray-500 mt-2">lg (40px)</div>
            </div>
            <div className="text-center">
              <IconButton icon="home" size="xl" ariaLabel="Home XL" />
              <div className="text-xs text-gray-500 mt-2">xl (48px)</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {iconExamples.slice(0, 8).map((icon) => (
              <div key={icon.name} className="text-center p-4 border rounded-lg">
                <IconButton icon={icon.name} size={selectedSize} ariaLabel={icon.label} />
                <div className="text-sm text-gray-600 mt-2">{icon.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Demo Interactivo</h2>
          <div className="max-w-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-2">{clickCount}</div>
              <div className="text-sm text-gray-600">Clicks realizados</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <IconButton
                  icon="add"
                  variant="containedPrimary"
                  size="lg"
                  onClick={handleClick}
                  ariaLabel="Incrementar contador"
                />
                <div className="text-xs text-gray-500 mt-2">Agregar</div>
              </div>

              <div className="text-center">
                <IconButton
                  icon="remove"
                  variant="containedSecondary"
                  size="lg"
                  onClick={() => setClickCount(Math.max(0, clickCount - 1))}
                  ariaLabel="Decrementar contador"
                />
                <div className="text-xs text-gray-500 mt-2">Quitar</div>
              </div>

              <div className="text-center">
                <IconButton
                  icon="refresh"
                  variant="outlined"
                  size="lg"
                  onClick={() => setClickCount(0)}
                  ariaLabel="Reiniciar contador"
                />
                <div className="text-xs text-gray-500 mt-2">Reiniciar</div>
              </div>

              <div className="text-center">
                <IconButton
                  icon="favorite"
                  variant="text"
                  size="lg"
                  onClick={() => alert('¡Favorito!')}
                  ariaLabel="Marcar como favorito"
                />
                <div className="text-xs text-gray-500 mt-2">Favorito</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Haz click en los botones para interactuar. Cada botón tiene diferentes estilos y comportamientos.
                Observa las transiciones suaves y el efecto de escala al presionar.
              </p>
            </div>
          </div>
        </div>

        {/* Common Use Cases Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Casos de Uso Comunes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Navegación y Acciones</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <IconButton icon="menu" variant="text" ariaLabel="Menú" />
                  <span className="text-sm text-gray-600">Botón de menú hamburguesa</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <IconButton icon="arrow_back" variant="text" ariaLabel="Atrás" />
                  <span className="text-sm text-gray-600">Navegación hacia atrás</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <IconButton icon="home" variant="basic" ariaLabel="Inicio" />
                  <span className="text-sm text-gray-600">Ir al inicio</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Acciones CRUD</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                  <IconButton icon="add" variant="containedPrimary" ariaLabel="Agregar" />
                  <span className="text-sm text-gray-600">Crear nuevo elemento</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                  <IconButton icon="edit" variant="outlined" ariaLabel="Editar" />
                  <span className="text-sm text-gray-600">Editar elemento</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded">
                  <IconButton icon="delete" variant="containedSecondary" ariaLabel="Eliminar" />
                  <span className="text-sm text-gray-600">Eliminar elemento</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Multimedia</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded">
                  <IconButton icon="play_arrow" variant="containedPrimary" ariaLabel="Reproducir" />
                  <span className="text-sm text-gray-600">Reproducir/Pausar</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded">
                  <IconButton icon="volume_up" variant="text" ariaLabel="Volumen" />
                  <span className="text-sm text-gray-600">Control de volumen</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded">
                  <IconButton icon="fullscreen" variant="basic" ariaLabel="Pantalla completa" />
                  <span className="text-sm text-gray-600">Pantalla completa</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Social y Compartir</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                  <IconButton icon="share" variant="outlined" ariaLabel="Compartir" />
                  <span className="text-sm text-gray-600">Compartir contenido</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded">
                  <IconButton icon="favorite" variant="text" ariaLabel="Me gusta" />
                  <span className="text-sm text-gray-600">Marcar como favorito</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                  <IconButton icon="chat" variant="basic" ariaLabel="Comentarios" />
                  <span className="text-sm text-gray-600">Ver comentarios</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Uso</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Uso Básico</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import IconButton from './components/IconButton/IconButton';

function MyComponent() {
  return (
    <IconButton
      icon="home"
      variant="containedPrimary"
      size="md"
      onClick={() => console.log('Home clicked')}
      ariaLabel="Ir al inicio"
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Botón de Acción en Toolbar</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<div className="flex gap-2 p-4 bg-gray-100 rounded">
  <IconButton icon="edit" variant="text" ariaLabel="Editar" />
  <IconButton icon="delete" variant="text" ariaLabel="Eliminar" />
  <IconButton icon="share" variant="text" ariaLabel="Compartir" />
</div>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Botón Flotante (FAB)</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<div className="fixed bottom-6 right-6">
  <IconButton
    icon="add"
    variant="containedPrimary"
    size="xl"
    className="shadow-lg hover:shadow-xl"
    onClick={handleAdd}
    ariaLabel="Agregar nuevo elemento"
  />
</div>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Toggle Button</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function ToggleButton() {
  const [isActive, setIsActive] = useState(false);

  return (
    <IconButton
      icon={isActive ? "favorite" : "favorite_border"}
      variant={isActive ? "containedPrimary" : "outlined"}
      onClick={() => setIsActive(!isActive)}
      ariaLabel={isActive ? "Quitar de favoritos" : "Agregar a favoritos"}
    />
  );
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Props Reference Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Referencia de Props</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Prop</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Por defecto</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">icon</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Nombre del icono de Material Symbols</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">variant</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'containedPrimary' | 'containedSecondary' | 'text' | 'basic' | 'outlined'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'containedPrimary'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Estilo visual del botón</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">size</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'xs' | 'sm' | 'md' | 'lg' | 'xl' | number</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'md'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Tamaño del botón e icono</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onClick</td>
                  <td className="px-4 py-2 text-sm text-gray-600">React.MouseEventHandler&lt;HTMLButtonElement&gt;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Función a ejecutar al hacer click</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">ariaLabel</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Etiqueta de accesibilidad para lectores de pantalla</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">className</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">''</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Clases CSS adicionales</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🔧 Requisitos Técnicos</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Material Symbols:</strong> Requiere la fuente Material Symbols de Google</li>
                <li><strong>Link CSS:</strong> {`<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />`}</li>
                <li><strong>Tamaños:</strong> xs=16px, sm=20px, md=24px, lg=32px, xl=40px</li>
                <li><strong>Accesibilidad:</strong> Siempre incluye ariaLabel para lectores de pantalla</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">✨ Características</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Transiciones:</strong> Animaciones suaves de 200ms en hover y active</li>
                <li><strong>Escala:</strong> Efecto de reducción al 90% cuando se presiona</li>
                <li><strong>Responsive:</strong> Diseño circular que se adapta a diferentes tamaños</li>
                <li><strong>Focus:</strong> Soporte completo para navegación por teclado</li>
                <li><strong>Customizable:</strong> Acepta className para personalización adicional</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-800 mb-2">🎯 Mejores Prácticas</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li><strong>Accesibilidad:</strong> Siempre proporciona ariaLabel descriptivo</li>
                <li><strong>Semántica:</strong> Elige iconos que representen claramente la acción</li>
                <li><strong>Consistencia:</strong> Usa la misma variante en contextos similares</li>
                <li><strong>Espaciado:</strong> Considera el tamaño del botón en diseños compactos</li>
                <li><strong>Estados:</strong> Proporciona feedback visual para estados de carga</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}