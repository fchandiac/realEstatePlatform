'use client'
import React, { useState } from 'react';
import { Button } from './Button';
import Link from 'next/link';

export default function ButtonShowcase() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Button Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente de botón flexible con múltiples variantes, tamaños y estados de carga.
            Soporta diferentes estilos visuales y comportamientos interactivos.
          </p>
        </div>

        {/* Variants Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variantes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Primary (Principal)</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="primary" disabled>Primary Disabled</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Secondary (Secundario)</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="secondary" disabled>Secondary Disabled</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Outlined (Contorno)</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outlined">Outlined Button</Button>
                <Button variant="outlined" disabled>Outlined Disabled</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Text (Texto)</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="text">Text Button</Button>
                <Button variant="text" disabled>Text Disabled</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sizes Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tamaños</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Small (Pequeño)</h3>
              <Button variant="primary" size="sm">Small Button</Button>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Medium (Mediano) - Default</h3>
              <Button variant="primary" size="md">Medium Button</Button>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Large (Grande)</h3>
              <Button variant="primary" size="lg">Large Button</Button>
            </div>
          </div>
        </div>

        {/* Loading States Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Estados de Carga</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Botón con Loading</h3>
              <p className="text-gray-600 mb-3">
                Haz clic en el botón para ver el estado de carga (2 segundos)
              </p>
              <Button
                variant="primary"
                isLoading={isLoading}
                onClick={handleLoadingClick}
              >
                {isLoading ? 'Cargando...' : 'Iniciar Carga'}
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Botón siempre en loading</h3>
              <Button variant="secondary" isLoading={true}>
                Siempre Cargando
              </Button>
            </div>
          </div>
        </div>

        {/* With Icons Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Con Iconos</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Iconos de Material Symbols</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" startIcon="add">Agregar</Button>
                <Button variant="secondary" startIcon="delete">Eliminar</Button>
                <Button variant="outlined" startIcon="edit">Editar</Button>
                <Button variant="primary" endIcon="arrow_forward">Continuar</Button>
                <Button variant="secondary" endIcon="download">Descargar</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Uso</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Botón de Acción Principal</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Button variant="primary" size="lg" onClick={handleSubmit}>
  Guardar Cambios
</Button>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Botón de Acción Secundaria</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Button variant="outlined" onClick={handleCancel}>
  Cancelar
</Button>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Botón con Loading</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Button
  variant="primary"
  isLoading={isSubmitting}
  onClick={handleSubmit}
>
  {isSubmitting ? 'Guardando...' : 'Guardar'}
</Button>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Botón con Icono</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Button variant="primary" startIcon="add" onClick={handleAdd}>
  Nuevo Elemento
</Button>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Props Reference */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Referencia de Props</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Prop</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tipo</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Default</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">variant</td>
                  <td className="px-4 py-2 text-sm text-gray-600">"primary" | "secondary" | "outlined" | "text"</td>
                  <td className="px-4 py-2 text-sm text-gray-600">"primary"</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Estilo visual del botón</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">size</td>
                  <td className="px-4 py-2 text-sm text-gray-600">"sm" | "md" | "lg"</td>
                  <td className="px-4 py-2 text-sm text-gray-600">"md"</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Tamaño del botón</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">isLoading</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Muestra indicador de carga</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">startIcon</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Icono al inicio (Material Symbols)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">endIcon</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Icono al final (Material Symbols)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">disabled</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Deshabilita el botón</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">onClick</td>
                  <td className="px-4 py-2 text-sm text-gray-600">function</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Manejador de click</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}