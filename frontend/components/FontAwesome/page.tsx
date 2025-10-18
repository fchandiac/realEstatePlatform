'use client'
import React, { useState } from 'react';
import FontAwesome from './FontAwesome';
import Link from 'next/link';

export default function FontAwesomeShowcase() {
  const [selectedStyle, setSelectedStyle] = useState<'solid' | 'regular' | 'light' | 'duotone' | 'brands'>('solid');
  const [selectedSize, setSelectedSize] = useState<'sm' | 'lg' | 'xl' | '2xl'>('lg');
  const [customColor, setCustomColor] = useState('#3B82F6');

  const iconExamples = [
    { name: 'user', label: 'Usuario' },
    { name: 'home', label: 'Inicio' },
    { name: 'search', label: 'Buscar' },
    { name: 'heart', label: 'Corazón' },
    { name: 'star', label: 'Estrella' },
    { name: 'check', label: 'Check' },
    { name: 'times', label: 'Cerrar' },
    { name: 'cog', label: 'Configuración' },
    { name: 'bell', label: 'Notificación' },
    { name: 'camera', label: 'Cámara' },
    { name: 'download', label: 'Descargar' },
    { name: 'upload', label: 'Subir' },
    { name: 'trash', label: 'Eliminar' },
    { name: 'edit', label: 'Editar' },
    { name: 'save', label: 'Guardar' },
    { name: 'share', label: 'Compartir' },
  ];

  const brandIcons = [
    { name: 'facebook', label: 'Facebook' },
    { name: 'twitter', label: 'Twitter' },
    { name: 'instagram', label: 'Instagram' },
    { name: 'linkedin', label: 'LinkedIn' },
    { name: 'github', label: 'GitHub' },
    { name: 'youtube', label: 'YouTube' },
    { name: 'google', label: 'Google' },
    { name: 'apple', label: 'Apple' },
    { name: 'microsoft', label: 'Microsoft' },
    { name: 'amazon', label: 'Amazon' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FontAwesome Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente para usar iconos de FontAwesome con múltiples estilos,
            tamaños, colores y efectos. Soporta todas las variantes de FontAwesome
            incluyendo solid, regular, light, duotone y brands.
          </p>
        </div>

        {/* Basic Usage Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Uso Básico</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {iconExamples.slice(0, 12).map((icon) => (
              <div key={icon.name} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <FontAwesome icon={icon.name} size="2xl" className="text-blue-600 mb-2" />
                <div className="text-sm text-gray-600">{icon.label}</div>
                <div className="text-xs text-gray-400 font-mono">fa-{icon.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Style Variants Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variantes de Estilo</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estilo:</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="solid">Solid (fas)</option>
              <option value="regular">Regular (far)</option>
              <option value="light">Light (fal)</option>
              <option value="duotone">Duotone (fad)</option>
              <option value="brands">Brands (fab)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {iconExamples.slice(0, 12).map((icon) => (
              <div key={icon.name} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <FontAwesome icon={icon.name} style={selectedStyle} size="2xl" className="text-blue-600 mb-2" />
                <div className="text-sm text-gray-600">{icon.label}</div>
                <div className="text-xs text-gray-400 font-mono">{selectedStyle}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Nota sobre estilos:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>Solid:</strong> Iconos rellenos, requieren FontAwesome Pro para light/duotone</li>
              <li><strong>Regular:</strong> Iconos outline, gratuitos</li>
              <li><strong>Brands:</strong> Iconos de marcas, gratuitos</li>
              <li><strong>Light/Duotone:</strong> Requieren FontAwesome Pro</li>
            </ul>
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
              <option value="sm">Small (sm)</option>
              <option value="lg">Large (lg)</option>
              <option value="xl">Extra Large (xl)</option>
              <option value="2xl">2X Large (2xl)</option>
            </select>
          </div>

          <div className="flex items-end gap-4 mb-6">
            <div className="text-center">
              <FontAwesome icon="user" size="sm" className="text-blue-600" />
              <div className="text-xs text-gray-500 mt-1">sm</div>
            </div>
            <div className="text-center">
              <FontAwesome icon="user" size="lg" className="text-blue-600" />
              <div className="text-xs text-gray-500 mt-1">lg</div>
            </div>
            <div className="text-center">
              <FontAwesome icon="user" size="xl" className="text-blue-600" />
              <div className="text-xs text-gray-500 mt-1">xl</div>
            </div>
            <div className="text-center">
              <FontAwesome icon="user" size="2xl" className="text-blue-600" />
              <div className="text-xs text-gray-500 mt-1">2xl</div>
            </div>
            <div className="text-center">
              <FontAwesome icon="user" size="3xl" className="text-blue-600" />
              <div className="text-xs text-gray-500 mt-1">3xl</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {iconExamples.slice(0, 8).map((icon) => (
              <div key={icon.name} className="text-center p-4 border rounded-lg">
                <FontAwesome icon={icon.name} size={selectedSize} className="text-blue-600 mb-2" />
                <div className="text-sm text-gray-600">{icon.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Customization Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personalización de Color</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Color personalizado:</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">{customColor}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {iconExamples.slice(0, 12).map((icon) => (
              <div key={icon.name} className="text-center p-4 border rounded-lg">
                <FontAwesome icon={icon.name} size="2xl" color={customColor} className="mb-2" />
                <div className="text-sm text-gray-600">{icon.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Effects Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Efectos Especiales</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Spin</h3>
              <FontAwesome icon="spinner" size="3xl" spin className="text-blue-600" />
              <div className="text-sm text-gray-600 mt-2">fa-spin</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Pulse</h3>
              <FontAwesome icon="spinner" size="3xl" pulse className="text-green-600" />
              <div className="text-sm text-gray-600 mt-2">fa-pulse</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Border</h3>
              <FontAwesome icon="star" size="3xl" border className="text-yellow-600" />
              <div className="text-sm text-gray-600 mt-2">fa-border</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Fixed Width</h3>
              <div className="space-y-2">
                <FontAwesome icon="home" fixedWidth className="text-blue-600" />
                <FontAwesome icon="user" fixedWidth className="text-blue-600" />
                <FontAwesome icon="cog" fixedWidth className="text-blue-600" />
              </div>
              <div className="text-sm text-gray-600 mt-2">fa-fw</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Pull Left</h3>
              <div className="flex items-center gap-2">
                <FontAwesome icon="quote-left" pull="left" size="2xl" className="text-gray-600" />
                <span className="text-sm text-gray-600">Texto con icono a la izquierda</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">fa-pull-left</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Pull Right</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Texto con icono a la derecha</span>
                <FontAwesome icon="quote-right" pull="right" size="2xl" className="text-gray-600" />
              </div>
              <div className="text-sm text-gray-600 mt-2">fa-pull-right</div>
            </div>
          </div>
        </div>

        {/* Brand Icons Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Iconos de Marcas (Brands)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {brandIcons.map((icon) => (
              <div key={icon.name} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <FontAwesome icon={icon.name} style="brands" size="2xl" className="text-gray-700 mb-2" />
                <div className="text-sm text-gray-600">{icon.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Example Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplo Interactivo</h2>
          <div className="max-w-2xl">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icono:</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {iconExamples.map((icon) => (
                    <option key={icon.name} value={icon.name}>{icon.label} (fa-{icon.name})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estilo:</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="solid">Solid</option>
                    <option value="regular">Regular</option>
                    <option value="brands">Brands</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño:</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="sm">Small</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                    <option value="2xl">2X Large</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Spin</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Pulse</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Border</span>
                </label>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg text-center">
                <FontAwesome icon="user" size="3xl" className="text-blue-600" />
                <div className="text-sm text-gray-600 mt-2">Vista previa del icono</div>
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
{`import FontAwesome from './components/FontAwesome/FontAwesome';

function MyComponent() {
  return (
    <div>
      <FontAwesome icon="user" />
      <FontAwesome icon="home" style="solid" size="lg" />
      <FontAwesome icon="search" style="regular" color="#3B82F6" />
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Botón con Icono</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<button
  onClick={handleSave}
  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
>
  <FontAwesome icon="save" />
  Guardar
</button>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Iconos de Marcas</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<div className="flex gap-4">
  <FontAwesome icon="facebook" style="brands" size="2xl" />
  <FontAwesome icon="twitter" style="brands" size="2xl" />
  <FontAwesome icon="instagram" style="brands" size="2xl" />
</div>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Iconos con Efectos</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<div className="flex gap-4">
  <FontAwesome icon="spinner" spin size="2xl" />
  <FontAwesome icon="heart" pulse color="red" />
  <FontAwesome icon="star" border size="2xl" />
</div>`}
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
                  <td className="px-4 py-2 text-sm text-gray-600">Nombre del icono FontAwesome (sin prefijo fa-)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">style</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'solid' | 'regular' | 'light' | 'duotone' | 'brands'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'solid'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Estilo del icono</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">size</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Tamaño del icono (xs, sm, lg, xl, 2xl, etc.)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">color</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Color del icono (cualquier valor CSS válido)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">spin</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Hace que el icono gire continuamente</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">pulse</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Hace que el icono gire con un efecto de pulso</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">fixedWidth</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Fija el ancho del icono para alineación</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">border</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Añade un borde alrededor del icono</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">pull</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'left' | 'right'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Flota el icono a la izquierda o derecha</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onClick</td>
                  <td className="px-4 py-2 text-sm text-gray-600">() =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Función a ejecutar al hacer click</td>
                </tr>
                <tr>
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
              <h3 className="text-sm font-semibold text-blue-800 mb-2">📚 Requisitos de FontAwesome</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>CSS:</strong> Necesitas incluir el CSS de FontAwesome en tu proyecto</li>
                <li><strong>Pro:</strong> Light y Duotone requieren FontAwesome Pro</li>
                <li><strong>Brands:</strong> Los iconos de marcas están disponibles gratuitamente</li>
                <li><strong>CDN:</strong> O usa el CDN: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">🎯 Mejores Prácticas</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Accesibilidad:</strong> Usa el prop title para tooltips</li>
                <li><strong>Semántica:</strong> Elige iconos que representen claramente la acción</li>
                <li><strong>Consistencia:</strong> Mantén el mismo estilo en toda la aplicación</li>
                <li><strong>Rendimiento:</strong> Solo importa los estilos que uses</li>
                <li><strong>Responsive:</strong> Los tamaños se adaptan automáticamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}