'use client'
import React from 'react';
import CircularProgress from './CircularProgress';
import Link from 'next/link';

export default function CircularProgressShowcase() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CircularProgress Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente de indicador de progreso circular animado. Ideal para mostrar estados de carga,
            procesamiento o cualquier actividad en curso. Utiliza animaciones CSS suaves y es
            completamente personalizable en tamaño y grosor.
          </p>
        </div>

        {/* Basic Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos Básicos</h2>
          <div className="flex flex-wrap items-center gap-8">
            <div className="text-center">
              <CircularProgress />
              <p className="text-sm text-gray-600 mt-2">Por defecto (40px)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={24} />
              <p className="text-sm text-gray-600 mt-2">Pequeño (24px)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={32} />
              <p className="text-sm text-gray-600 mt-2">Mediano (32px)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={48} />
              <p className="text-sm text-gray-600 mt-2">Grande (48px)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={64} />
              <p className="text-sm text-gray-600 mt-2">Extra grande (64px)</p>
            </div>
          </div>
        </div>

        {/* Different Thickness Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Diferentes Grosor</h2>
          <div className="flex flex-wrap items-center gap-8">
            <div className="text-center">
              <CircularProgress size={48} thickness={2} />
              <p className="text-sm text-gray-600 mt-2">Fino (2px)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={48} thickness={4} />
              <p className="text-sm text-gray-600 mt-2">Estándar (4px)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={48} thickness={6} />
              <p className="text-sm text-gray-600 mt-2">Grueso (6px)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={48} thickness={8} />
              <p className="text-sm text-gray-600 mt-2">Muy grueso (8px)</p>
            </div>
          </div>
        </div>

        {/* In Context Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">En Contexto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Loading Button */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Botón de Carga</h3>
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                <CircularProgress size={16} thickness={2} />
                Cargando...
              </button>
            </div>

            {/* Loading Card */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Card de Carga</h3>
              <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[120px]">
                <CircularProgress size={32} />
                <p className="text-sm text-gray-600 mt-3">Cargando datos...</p>
              </div>
            </div>

            {/* Inline Loading */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Carga en Línea</h3>
              <div className="flex items-center gap-3">
                <CircularProgress size={20} />
                <span className="text-sm text-gray-600">Procesando solicitud...</span>
              </div>
            </div>

            {/* Full Page Loading */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Carga de Página Completa</h3>
              <div className="bg-gray-900 rounded-lg p-8 flex flex-col items-center justify-center min-h-[120px]">
                <CircularProgress size={48} className="text-white" />
                <p className="text-white text-sm mt-3">Cargando aplicación...</p>
              </div>
            </div>

            {/* Form Submission */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Envío de Formulario</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-green-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                  <CircularProgress size={16} thickness={2} />
                  Enviando...
                </button>
              </div>
            </div>

            {/* Data Refresh */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Actualización de Datos</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última actualización:</span>
                <div className="flex items-center gap-2">
                  <CircularProgress size={14} />
                  <span className="text-xs text-gray-500">Actualizando...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Variations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variaciones de Color</h2>
          <p className="text-gray-600 mb-4">
            El componente CircularProgress utiliza las variables CSS de Tailwind para los colores.
            Puedes personalizar los colores usando clases de Tailwind.
          </p>
          <div className="flex flex-wrap items-center gap-8">
            <div className="text-center">
              <CircularProgress size={40} className="text-blue-500" />
              <p className="text-sm text-gray-600 mt-2">Azul (text-blue-500)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={40} className="text-green-500" />
              <p className="text-sm text-gray-600 mt-2">Verde (text-green-500)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={40} className="text-red-500" />
              <p className="text-sm text-gray-600 mt-2">Rojo (text-red-500)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={40} className="text-purple-500" />
              <p className="text-sm text-gray-600 mt-2">Morado (text-purple-500)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={40} className="text-yellow-500" />
              <p className="text-sm text-gray-600 mt-2">Amarillo (text-yellow-500)</p>
            </div>
            <div className="text-center">
              <CircularProgress size={40} className="text-gray-500" />
              <p className="text-sm text-gray-600 mt-2">Gris (text-gray-500)</p>
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
{`import CircularProgress from './components/CircularProgress';

function LoadingComponent() {
  return <CircularProgress />;
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Tamaños Personalizados</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<CircularProgress size={24} />  {/* Pequeño */}
<CircularProgress size={40} />  {/* Estándar */}
<CircularProgress size={64} />  {/* Grande */}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Grosor Personalizado</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<CircularProgress size={48} thickness={2} />  {/* Fino */}
<CircularProgress size={48} thickness={6} />  {/* Grueso */}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Colores Personalizados</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<CircularProgress className="text-blue-500" />
<CircularProgress className="text-green-500" />
<CircularProgress className="text-red-500" />`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">En un Botón de Carga</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function LoadingButton({ loading, children }) {
  return (
    <button className="flex items-center gap-2" disabled={loading}>
      {loading && <CircularProgress size={16} thickness={2} />}
      {children}
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
                  <td className="px-4 py-2 text-sm text-gray-600">40</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Tamaño del componente en píxeles</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">thickness</td>
                  <td className="px-4 py-2 text-sm text-gray-600">number</td>
                  <td className="px-4 py-2 text-sm text-gray-600">4</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Grosor del borde del círculo en píxeles</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">className</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">''</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Clases CSS adicionales para personalización</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Consejos de Uso</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Usa tamaños pequeños (16-24px) para botones e indicadores inline</li>
              <li>• El tamaño estándar (40px) es ideal para cargas de página o secciones</li>
              <li>• Para fondos oscuros, agrega la clase <code className="bg-blue-100 px-1 rounded">text-white</code></li>
              <li>• El componente incluye automáticamente la animación de giro</li>
              <li>• Es accesible y funciona bien con lectores de pantalla</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}