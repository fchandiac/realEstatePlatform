'use client'
import React, { useState } from 'react';
import DotProgress from './DotProgress';
import Link from 'next/link';

export default function DotProgressShowcase() {
  const [customSize, setCustomSize] = useState(16);
  const [customGap, setCustomGap] = useState(8);
  const [customInterval, setCustomInterval] = useState(350);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DotProgress Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Indicador de carga animado con puntos que se iluminan secuencialmente.
            Perfecto para estados de carga, procesamiento en background, o cualquier
            situación donde se necesite mostrar progreso sin información específica.
          </p>
        </div>

        {/* Basic Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos Básicos</h2>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <DotProgress />
              <span className="text-gray-600">Tamaño por defecto (16px)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress size={12} />
              <span className="text-gray-600">Tamaño pequeño (12px)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress size={20} />
              <span className="text-gray-600">Tamaño mediano (20px)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress size={24} />
              <span className="text-gray-600">Tamaño grande (24px)</span>
            </div>
          </div>
        </div>

        {/* Size Variations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variaciones de Tamaño</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <DotProgress size={8} />
              </div>
              <p className="text-sm text-gray-600">XS (8px)</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <DotProgress size={12} />
              </div>
              <p className="text-sm text-gray-600">SM (12px)</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <DotProgress size={16} />
              </div>
              <p className="text-sm text-gray-600">MD (16px)</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <DotProgress size={20} />
              </div>
              <p className="text-sm text-gray-600">LG (20px)</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <DotProgress size={24} />
              </div>
              <p className="text-sm text-gray-600">XL (24px)</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <DotProgress size={32} />
              </div>
              <p className="text-sm text-gray-600">XXL (32px)</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <DotProgress size={6} />
              </div>
              <p className="text-sm text-gray-600">Tiny (6px)</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <DotProgress size={40} />
              </div>
              <p className="text-sm text-gray-600">Huge (40px)</p>
            </div>
          </div>
        </div>

        {/* Gap Variations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variaciones de Espaciado</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <DotProgress gap={4} />
              <span className="text-gray-600">Espaciado mínimo (4px)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress gap={8} />
              <span className="text-gray-600">Espaciado normal (8px)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress gap={12} />
              <span className="text-gray-600">Espaciado amplio (12px)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress gap={16} />
              <span className="text-gray-600">Espaciado extra (16px)</span>
            </div>
          </div>
        </div>

        {/* Speed Variations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variaciones de Velocidad</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <DotProgress interval={150} />
              <span className="text-gray-600">Muy rápido (150ms)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress interval={350} />
              <span className="text-gray-600">Normal (350ms)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress interval={600} />
              <span className="text-gray-600">Lento (600ms)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress interval={1000} />
              <span className="text-gray-600">Muy lento (1000ms)</span>
            </div>
          </div>
        </div>

        {/* Color Variations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variaciones de Color</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <DotProgress colorPrimary="#3B82F6" colorNeutral="#E5E7EB" />
              <span className="text-gray-600">Azul (personalizado)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress colorPrimary="#10B981" colorNeutral="#D1FAE5" />
              <span className="text-gray-600">Verde (personalizado)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress colorPrimary="#F59E0B" colorNeutral="#FEF3C7" />
              <span className="text-gray-600">Ámbar (personalizado)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress colorPrimary="#EF4444" colorNeutral="#FEE2E2" />
              <span className="text-gray-600">Rojo (personalizado)</span>
            </div>

            <div className="flex items-center gap-4">
              <DotProgress colorPrimary="#8B5CF6" colorNeutral="#EDE9FE" />
              <span className="text-gray-600">Violeta (personalizado)</span>
            </div>
          </div>
        </div>

        {/* Interactive Customization Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personalización Interactiva</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño de puntos: {customSize}px
                </label>
                <input
                  type="range"
                  min="6"
                  max="40"
                  value={customSize}
                  onChange={(e) => setCustomSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Espaciado: {customGap}px
                </label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={customGap}
                  onChange={(e) => setCustomGap(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo: {customInterval}ms
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={customInterval}
                  onChange={(e) => setCustomInterval(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <DotProgress
                  size={customSize}
                  gap={customGap}
                  interval={customInterval}
                  colorPrimary="#3B82F6"
                  colorNeutral="#E5E7EB"
                />
                <p className="mt-4 text-sm text-gray-600">
                  Preview con configuración personalizada
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Contexts Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contextos de Uso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">En Formularios</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Guardando cambios...</span>
                  <DotProgress size={14} />
                </div>
                <button
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg opacity-50 cursor-not-allowed"
                  disabled
                >
                  Guardar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">En Botones</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2">
                  <DotProgress size={12} colorPrimary="#FFFFFF" colorNeutral="#FFFFFF" />
                  Procesando...
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">En Modales</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <DotProgress size={18} />
                  <p className="mt-2 text-sm text-gray-600">Cargando datos...</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">En Listas</h3>
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Elemento 1</span>
                  <DotProgress size={10} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Elemento 2</span>
                  <DotProgress size={10} />
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
{`import DotProgress from './components/DotProgress';

function LoadingComponent() {
  return (
    <div className="flex items-center gap-2">
      <DotProgress />
      <span>Cargando...</span>
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Personalización Completa</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<DotProgress
  size={20}
  gap={12}
  colorPrimary="#3B82F6"
  colorNeutral="#E5E7EB"
  interval={500}
  className="my-custom-class"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">En Componentes Controlados</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function MyButton({ loading }) {
  return (
    <button disabled={loading} className="...">
      {loading ? (
        <>
          <DotProgress size={12} />
          Procesando...
        </>
      ) : (
        'Enviar'
      )}
    </button>
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
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">size</td>
                  <td className="px-4 py-2 text-sm text-gray-600">number</td>
                  <td className="px-4 py-2 text-sm text-gray-600">16</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Tamaño de cada punto en píxeles</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">gap</td>
                  <td className="px-4 py-2 text-sm text-gray-600">number</td>
                  <td className="px-4 py-2 text-sm text-gray-600">8</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Espaciado entre puntos en píxeles</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">colorPrimary</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">var(--color-primary)</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Color del punto activo</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">colorNeutral</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">var(--color-neutral)</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Color de los puntos inactivos</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">interval</td>
                  <td className="px-4 py-2 text-sm text-gray-600">number</td>
                  <td className="px-4 py-2 text-sm text-gray-600">350</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Intervalo de animación en milisegundos</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">className</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&quot;&quot;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Clases CSS adicionales</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🎨 Características de Animación</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Animación secuencial:</strong> Los puntos se iluminan uno por uno en secuencia</li>
                <li><strong>Efecto de pulso:</strong> El punto activo tiene una animación de escala y opacidad</li>
                <li><strong>Transiciones suaves:</strong> Cambios de color con duración de 0.2s</li>
                <li><strong>Bucle infinito:</strong> La animación continúa hasta que se desmonta el componente</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">🎯 Casos de Uso Recomendados</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Estados de carga indeterminados:</strong> Cuando no se conoce el progreso exacto</li>
                <li><strong>Procesos en background:</strong> Operaciones que toman tiempo variable</li>
                <li><strong>Interfaces responsivas:</strong> Indicadores compactos que no distraen</li>
                <li><strong>Botones de acción:</strong> Estados de loading en formularios y acciones</li>
                <li><strong>Placeholders de contenido:</strong> Mientras se cargan datos o imágenes</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-800 mb-2">⚡ Variables CSS Soportadas</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li><strong>--color-primary:</strong> Color del punto activo (por defecto)</li>
                <li><strong>--color-neutral:</strong> Color de los puntos inactivos (por defecto)</li>
                <li><strong>Colores personalizados:</strong> Cualquier valor CSS válido (hex, rgb, hsl, etc.)</li>
                <li><strong>Integración con temas:</strong> Automáticamente usa las variables del sistema</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}