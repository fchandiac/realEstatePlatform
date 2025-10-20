'use client'
import React, { useState } from 'react';
import { TextField } from './TextField';
import Link from 'next/link';

export default function TextFieldShowcase() {
  const [values, setValues] = useState({
    text: 'Texto de ejemplo',
    email: 'usuario@ejemplo.com',
    password: 'password123',
    number: '42',
    textarea: 'Este es un texto largo que demuestra el funcionamiento del textarea con múltiples líneas.',
    dni: '12345678A',
    currency: '1234.56'
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }));
  };

  // Removed unused helper functions (formatCurrency, formatDNI) to satisfy linter

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TextField Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Campo de texto flexible con soporte para diferentes tipos de entrada, validación,
            formato personalizado y múltiples opciones de configuración.
          </p>
        </div>

        {/* Basic Types Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tipos Básicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Text (Texto)</h3>
              <TextField
                label="Nombre completo"
                value={values.text}
                onChange={handleChange('text')}
                placeholder="Ingresa tu nombre"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Email</h3>
              <TextField
                label="Correo electrónico"
                type="email"
                value={values.email}
                onChange={handleChange('email')}
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Password</h3>
              <TextField
                label="Contraseña"
                type="password"
                value={values.password}
                onChange={handleChange('password')}
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Number</h3>
              <TextField
                label="Edad"
                type="number"
                value={values.number}
                onChange={handleChange('number')}
                placeholder="Ingresa tu edad"
              />
            </div>
          </div>
        </div>

        {/* Textarea Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Textarea</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Textarea Básico</h3>
              <TextField
                label="Descripción"
                value={values.textarea}
                onChange={handleChange('textarea')}
                rows={4}
                placeholder="Escribe una descripción detallada..."
              />
            </div>
          </div>
        </div>

        {/* With Icons Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Con Iconos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Icono al Inicio</h3>
              <TextField
                label="Buscar"
                value=""
                onChange={() => {}}
                placeholder="Buscar productos..."
                startIcon="search"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Icono al Final</h3>
              <TextField
                label="Usuario"
                value=""
                onChange={() => {}}
                placeholder="Nombre de usuario"
                endIcon="person"
              />
            </div>
          </div>
        </div>

        {/* Special Types Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tipos Especiales con Formato Automático</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">DNI Chileno</h3>
              <p className="text-sm text-gray-600 mb-3">
                Formato automático inteligente:
                <br />• <code className="bg-gray-100 px-2 py-1 rounded">XX.XXX.XXX-X</code> (9 dígitos)
                <br />• <code className="bg-gray-100 px-2 py-1 rounded">X.XXX.XXX-X</code> (8 dígitos)
                <br />• <code className="bg-gray-100 px-2 py-1 rounded">XX.XXX.XXX-k</code> (8 dígitos + k)
                <br />• <code className="bg-gray-100 px-2 py-1 rounded">X.XXX.XXX-k</code> (7 dígitos + k)
              </p>
              <TextField
                label="DNI Chileno"
                type="dni"
                value={values.dni}
                onChange={handleChange('dni')}
                placeholder="12345678K"
              />
              <p className="text-xs text-gray-500 mt-2">
                Prueba escribiendo: 123456789 → 12.345.678-9
                <br />O: 12345678 → 1.234.567-8
                <br />O: 1234567k → 1.234.567-k
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Moneda Chilena</h3>
              <p className="text-sm text-gray-600 mb-3">
                Formato automático: <code className="bg-gray-100 px-2 py-1 rounded">$X.XXX.XXX</code>
              </p>
              <TextField
                label="Precio"
                type="currency"
                value={values.currency}
                onChange={handleChange('currency')}
                placeholder="$0"
              />
                            <p className="text-xs text-gray-500 mt-2">
                Prueba escribiendo: 1234567 → se formatea a $1.234.567
              </p>
            </div>
          </div>
        </div>

        {/* States Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Estados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Campo Requerido</h3>
              <TextField
                label="Campo obligatorio"
                value=""
                onChange={() => {}}
                required
                placeholder="Este campo es requerido"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Campo Deshabilitado</h3>
              <TextField
                label="Campo deshabilitado"
                value="No se puede editar"
                onChange={() => {}}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Usage Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Uso</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Campo de Texto Básico</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<TextField
  label="Nombre"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Ingresa tu nombre"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Campo con Formato</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<TextField
  label='Precio'
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  formatFn={(input) => \`$\${input.replace(/[^0-9.]/g, '')}\`}
  placeholder='$0.00'
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Textarea</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<TextField
  label="Descripción"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  multiline
  rows={4}
  placeholder="Escribe una descripción..."
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Campo con Iconos</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<TextField
  label="Buscar"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  startIcon="search"
  placeholder="Buscar productos..."
/>`}
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
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">label</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Etiqueta del campo</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">value</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">""</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Valor del campo</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">onChange</td>
                  <td className="px-4 py-2 text-sm text-gray-600">function</td>
                  <td className="px-4 py-2 text-sm text-gray-600">required</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Manejador de cambio</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">type</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">"text"</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Tipo de input HTML</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">placeholder</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Texto placeholder</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">multiline</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Convierte en textarea</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">rows</td>
                  <td className="px-4 py-2 text-sm text-gray-600">number</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Número de filas para textarea</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">required</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Campo requerido</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">disabled</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Campo deshabilitado</td>
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
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">formatFn</td>
                  <td className="px-4 py-2 text-sm text-gray-600">(input: string) =&gt; string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Función para formatear el input</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}