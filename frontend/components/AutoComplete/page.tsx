'use client'
import React, { useState } from 'react';
import AutoComplete from './AutoComplete';
import Link from 'next/link';

interface Country {
  id: number;
  label: string;
  code: string;
}

interface User {
  id: number;
  label: string;
  email: string;
  role: string;
}

export default function AutoCompleteShowcase() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedFruit, setSelectedFruit] = useState<string | null>(null);
  const [requiredValue, setRequiredValue] = useState<Country | null>(null);
  const [customValue, setCustomValue] = useState<Country | null>(null);

  const countries: Country[] = [
    { id: 1, label: 'Argentina', code: 'AR' },
    { id: 2, label: 'Brasil', code: 'BR' },
    { id: 3, label: 'Chile', code: 'CL' },
    { id: 4, label: 'Colombia', code: 'CO' },
    { id: 5, label: 'México', code: 'MX' },
    { id: 6, label: 'Perú', code: 'PE' },
    { id: 7, label: 'Uruguay', code: 'UY' },
    { id: 8, label: 'Venezuela', code: 'VE' },
    { id: 9, label: 'Estados Unidos', code: 'US' },
    { id: 10, label: 'Canadá', code: 'CA' },
  ];

  const users: User[] = [
    { id: 1, label: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
    { id: 2, label: 'María García', email: 'maria@example.com', role: 'User' },
    { id: 3, label: 'Carlos López', email: 'carlos@example.com', role: 'Moderator' },
    { id: 4, label: 'Ana Rodríguez', email: 'ana@example.com', role: 'User' },
    { id: 5, label: 'Pedro Martínez', email: 'pedro@example.com', role: 'Admin' },
    { id: 6, label: 'Laura Sánchez', email: 'laura@example.com', role: 'User' },
  ];

  const fruits = [
    'Manzana', 'Banana', 'Naranja', 'Pera', 'Uva', 'Mango', 'Piña', 'Sandía', 'Melón', 'Kiwi'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AutoComplete Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente de autocompletado avanzado con filtrado en tiempo real,
            navegación por teclado, validación y soporte para objetos complejos.
            Ideal para formularios donde el usuario necesita seleccionar de una lista grande.
          </p>
        </div>

        {/* Basic AutoComplete Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">AutoComplete Básico</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AutoComplete
                options={fruits}
                label="Fruta favorita"
                placeholder="Escribe para buscar frutas..."
                value={selectedFruit}
                onChange={setSelectedFruit}
              />
              <p className="mt-2 text-sm text-gray-600">
                Seleccionado: {selectedFruit || 'Ninguno'}
              </p>
            </div>
            <div>
              <AutoComplete
                options={countries}
                label="País de origen"
                placeholder="Buscar país..."
                value={selectedCountry}
                onChange={setSelectedCountry}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.id}
              />
              <p className="mt-2 text-sm text-gray-600">
                Seleccionado: {selectedCountry ? `${selectedCountry.label} (${selectedCountry.code})` : 'Ninguno'}
              </p>
            </div>
          </div>
        </div>

        {/* Complex Objects Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Objetos Complejos</h2>
          <div className="max-w-md">
            <AutoComplete
              options={users}
              label="Seleccionar usuario"
              placeholder="Buscar por nombre..."
              value={selectedUser}
              onChange={setSelectedUser}
              getOptionLabel={(user) => `${user.label} (${user.email})`}
              getOptionValue={(user) => user.id}
            />
            {selectedUser && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900">Usuario seleccionado:</h3>
                <p className="text-blue-800"><strong>Nombre:</strong> {selectedUser.label}</p>
                <p className="text-blue-800"><strong>Email:</strong> {selectedUser.email}</p>
                <p className="text-blue-800"><strong>Rol:</strong> {selectedUser.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Validation Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Validación Requerida</h2>
          <div className="max-w-md">
            <AutoComplete
              options={countries}
              label="País requerido"
              placeholder="Este campo es obligatorio..."
              value={requiredValue}
              onChange={setRequiredValue}
              required
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.id}
            />
            <p className="mt-2 text-sm text-gray-600">
              Este campo muestra validación cuando es requerido y está vacío.
            </p>
          </div>
        </div>

        {/* Custom Styling Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Estilos Personalizados</h2>
          <div className="space-y-6">
            <div className="max-w-md">
              <AutoComplete
                options={countries}
                label="Con estilos personalizados"
                placeholder="Buscar país..."
                value={customValue}
                onChange={setCustomValue}
                getOptionLabel={(option) => `${option.label} - ${option.code}`}
                getOptionValue={(option) => option.id}
                data-test-id="custom-autocomplete"
              />
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Nota:</strong> El componente usa variables CSS personalizadas para colores
                (--color-background, --color-primary, --color-secondary, --color-foreground, --color-border)
                que permiten integración perfecta con temas personalizados.
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Navigation Demo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Navegación por Teclado</h2>
          <div className="max-w-md">
            <AutoComplete
              options={fruits}
              label="Demo navegación teclado"
              placeholder="Prueba las flechas ↑↓, Enter y Escape..."
              value={null}
              onChange={() => {}}
            />
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Controles de teclado:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li><strong>↓/↑</strong> - Navegar entre opciones</li>
                <li><strong>Enter</strong> - Seleccionar opción resaltada</li>
                <li><strong>Escape</strong> - Cerrar dropdown</li>
                <li><strong>Clic en ícono X</strong> - Limpiar selección</li>
                <li><strong>Clic en ícono ↓</strong> - Abrir/cerrar dropdown</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Uso</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">AutoComplete Simple</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import AutoComplete from './components/AutoComplete';

const fruits = ['Manzana', 'Banana', 'Naranja', 'Pera'];

function MyComponent() {
  const [selectedFruit, setSelectedFruit] = useState(null);

  return (
    <AutoComplete
      options={fruits}
      label="Fruta favorita"
      placeholder="Buscar fruta..."
      value={selectedFruit}
      onChange={setSelectedFruit}
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">AutoComplete con Objetos</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`interface Country {
  id: number;
  label: string;
  code: string;
}

const countries: Country[] = [
  { id: 1, label: 'Argentina', code: 'AR' },
  { id: 2, label: 'Brasil', code: 'BR' }
];

function MyComponent() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <AutoComplete
      options={countries}
      label="País"
      placeholder="Seleccionar país..."
      value={selectedCountry}
      onChange={setSelectedCountry}
      getOptionLabel={(country) => country.label}
      getOptionValue={(country) => country.id}
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">AutoComplete Requerido</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<AutoComplete
  options={options}
  label="Campo obligatorio"
  placeholder="Este campo es requerido..."
  value={value}
  onChange={setValue}
  required
/>`}
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
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">options</td>
                  <td className="px-4 py-2 text-sm text-gray-600">T[]</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Array de opciones para autocompletar</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">label</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Etiqueta del campo</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">placeholder</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Placeholder del input</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">value</td>
                  <td className="px-4 py-2 text-sm text-gray-600">T | null</td>
                  <td className="px-4 py-2 text-sm text-gray-600">null</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Valor seleccionado actualmente</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onChange</td>
                  <td className="px-4 py-2 text-sm text-gray-600">(option: T | null) =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Callback cuando cambia la selección</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">required</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Si el campo es obligatorio</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">getOptionLabel</td>
                  <td className="px-4 py-2 text-sm text-gray-600">(option: T) =&gt; string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">default</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Función para obtener el label de una opción</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">getOptionValue</td>
                  <td className="px-4 py-2 text-sm text-gray-600">(option: T) =&gt; any</td>
                  <td className="px-4 py-2 text-sm text-gray-600">default</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Función para obtener el value de una opción</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">data-test-id</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">ID para testing automatizado</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🔍 Funcionalidades Avanzadas</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Filtrado automático:</strong> Las opciones se filtran en tiempo real según el input</li>
                <li><strong>Navegación por teclado:</strong> Soporte completo para accesibilidad</li>
                <li><strong>Validación integrada:</strong> Soporte para campos requeridos</li>
                <li><strong>Objetos complejos:</strong> Funciones personalizables para label y value</li>
                <li><strong>Testing friendly:</strong> data-test-id en todos los elementos interactivos</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">🎨 Personalización</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Variables CSS:</strong> Usa --color-background, --color-primary, etc.</li>
                <li><strong>Responsive:</strong> Diseño adaptable a diferentes tamaños de pantalla</li>
                <li><strong>Accesibilidad:</strong> Soporte completo para lectores de pantalla</li>
                <li><strong>Performance:</strong> Filtrado eficiente y renderizado optimizado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}