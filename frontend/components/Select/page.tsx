'use client'
import React, { useState } from 'react';
import Select from './Select';
import Link from 'next/link';

export default function SelectShowcase() {
  const [country, setCountry] = useState<number | null>(null);
  const [category, setCategory] = useState<number | null>(null);
  const [priority, setPriority] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [requiredField, setRequiredField] = useState<number | null>(null);
  const [emptySelect, setEmptySelect] = useState<number | null>(null);

  const countries = [
    { id: 1, label: 'Argentina' },
    { id: 2, label: 'Brasil' },
    { id: 3, label: 'Chile' },
    { id: 4, label: 'Colombia' },
    { id: 5, label: 'México' },
    { id: 6, label: 'Perú' },
    { id: 7, label: 'Uruguay' },
    { id: 8, label: 'Venezuela' },
  ];

  const categories = [
    { id: 1, label: 'Tecnología' },
    { id: 2, label: 'Diseño' },
    { id: 3, label: 'Marketing' },
    { id: 4, label: 'Ventas' },
    { id: 5, label: 'Recursos Humanos' },
    { id: 6, label: 'Finanzas' },
    { id: 7, label: 'Operaciones' },
    { id: 8, label: 'Legal' },
  ];

  const priorities = [
    { id: 1, label: 'Baja' },
    { id: 2, label: 'Media' },
    { id: 3, label: 'Alta' },
    { id: 4, label: 'Crítica' },
  ];

  const statuses = [
    { id: 1, label: 'Pendiente' },
    { id: 2, label: 'En Progreso' },
    { id: 3, label: 'Completado' },
    { id: 4, label: 'Cancelado' },
    { id: 5, label: 'En Espera' },
  ];

  const [selectedExample, setSelectedExample] = useState<string>('country');

  const examples = [
    {
      id: 'country',
      title: 'Selección de País',
      description: 'Selector de países para formularios de registro',
      options: countries,
      value: country,
      onChange: setCountry,
      placeholder: 'Selecciona un país',
    },
    {
      id: 'category',
      title: 'Categoría de Trabajo',
      description: 'Selector de categorías laborales',
      options: categories,
      value: category,
      onChange: setCategory,
      placeholder: 'Selecciona una categoría',
    },
    {
      id: 'priority',
      title: 'Prioridad de Tarea',
      description: 'Selector de niveles de prioridad',
      options: priorities,
      value: priority,
      onChange: setPriority,
      placeholder: 'Selecciona la prioridad',
    },
    {
      id: 'status',
      title: 'Estado del Proyecto',
      description: 'Selector de estados de proyecto',
      options: statuses,
      value: status,
      onChange: setStatus,
      placeholder: 'Selecciona el estado',
    },
  ];

  const currentExample = examples.find(ex => ex.id === selectedExample) || examples[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Select Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente de selección desplegable con navegación por teclado,
            validación HTML nativa, label flotante y accesibilidad completa.
            Ideal para formularios y selección de opciones.
          </p>
        </div>

        {/* Interactive Demo Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Demo Interactivo</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ejemplo:</label>
            <select
              value={selectedExample}
              onChange={(e) => setSelectedExample(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {examples.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.title}
                </option>
              ))}
            </select>
          </div>

          <div className="max-w-2xl">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{currentExample.title}</h3>
              <p className="text-gray-600 mb-6">{currentExample.description}</p>

              <div className="space-y-4">
                <Select
                  options={currentExample.options}
                  placeholder={currentExample.placeholder}
                  value={currentExample.value}
                  onChange={currentExample.onChange}
                />

                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Valor Seleccionado:</div>
                  <div className="text-lg font-medium text-blue-600">
                    {currentExample.value !== null
                      ? currentExample.options.find(opt => opt.id === currentExample.value)?.label
                      : 'Ninguno'
                    }
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ID: {currentExample.value !== null ? currentExample.value : 'null'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Examples Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Casos de Uso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examples.map((example) => (
              <div key={example.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-2">{example.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{example.description}</p>

                <Select
                  options={example.options}
                  placeholder={example.placeholder}
                  value={example.value}
                  onChange={example.onChange}
                />

                <div className="text-xs text-gray-500 mt-2">
                  Seleccionado: {example.value !== null
                    ? example.options.find(opt => opt.id === example.value)?.label
                    : 'Ninguno'
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Field Demo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Campo Requerido</h2>
          <div className="max-w-2xl space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-800 mb-2">Campo Obligatorio</h3>
              <p className="text-red-700 text-sm mb-4">
                Este campo es requerido y mostrará validación HTML nativa.
              </p>

              <Select
                options={countries}
                placeholder="Selecciona tu país de residencia"
                value={requiredField}
                onChange={setRequiredField}
                required={true}
                name="country-required"
              />

              <div className="mt-4 text-sm">
                <span className="text-gray-600">Estado: </span>
                <span className={requiredField === null ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                  {requiredField === null ? 'Sin seleccionar (inválido)' : 'Seleccionado (válido)'}
                </span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-800 mb-2">Campo Opcional</h3>
              <p className="text-green-700 text-sm mb-4">
                Este campo es opcional y puede dejarse vacío.
              </p>

              <Select
                options={categories}
                placeholder="Selecciona una categoría (opcional)"
                value={emptySelect}
                onChange={setEmptySelect}
                required={false}
              />

              <div className="mt-4 text-sm">
                <span className="text-gray-600">Estado: </span>
                <span className="text-green-600 font-medium">Opcional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Navigation Demo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Navegación por Teclado</h2>
          <div className="max-w-2xl">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-yellow-800 mb-4">Prueba la Navegación</h3>
              <div className="space-y-4">
                <Select
                  options={priorities}
                  placeholder="Usa las flechas ↑↓ para navegar"
                  value={null}
                  onChange={() => {}}
                />

                <div className="text-sm text-yellow-700 space-y-2">
                  <div><strong>Teclas disponibles:</strong></div>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><kbd className="px-1 py-0.5 bg-yellow-200 rounded text-xs">Tab</kbd> - Enfocar el campo</li>
                    <li><kbd className="px-1 py-0.5 bg-yellow-200 rounded text-xs">↓</kbd> / <kbd className="px-1 py-0.5 bg-yellow-200 rounded text-xs">↑</kbd> - Abrir y navegar opciones</li>
                    <li><kbd className="px-1 py-0.5 bg-yellow-200 rounded text-xs">Enter</kbd> - Seleccionar opción resaltada</li>
                    <li><kbd className="px-1 py-0.5 bg-yellow-200 rounded text-xs">Escape</kbd> - Cerrar lista</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* States and Behaviors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Estados y Comportamientos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Estados del Componente</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <div>
                    <div className="font-medium text-gray-800">Vacío</div>
                    <div className="text-sm text-gray-600">Sin selección, muestra placeholder</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <div>
                    <div className="font-medium text-gray-800">Enfocado</div>
                    <div className="text-sm text-gray-600">Campo activo, borde azul</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <div>
                    <div className="font-medium text-gray-800">Seleccionado</div>
                    <div className="text-sm text-gray-600">Opción elegida, muestra valor</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <div>
                    <div className="font-medium text-gray-800">Abierto</div>
                    <div className="text-sm text-gray-600">Lista desplegada visible</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Interacciones</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">Click</div>
                  <div className="text-sm text-gray-600">Abre/cierra la lista de opciones</div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">Botón X</div>
                  <div className="text-sm text-gray-600">Limpia la selección actual</div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">Hover</div>
                  <div className="text-sm text-gray-600">Resalta opciones en la lista</div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">Teclado</div>
                  <div className="text-sm text-gray-600">Navegación completa por teclado</div>
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
{`import Select from './components/Select/Select';

function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const countries = [
    { id: 1, label: 'Argentina' },
    { id: 2, label: 'Brasil' },
    { id: 3, label: 'Chile' },
  ];

  return (
    <Select
      options={countries}
      placeholder="Selecciona un país"
      value={selectedCountry}
      onChange={setSelectedCountry}
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Campo Requerido con Validación</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function RequiredFieldForm() {
  const [category, setCategory] = useState(null);

  const categories = [
    { id: 1, label: 'Tecnología' },
    { id: 2, label: 'Diseño' },
    { id: 3, label: 'Marketing' },
  ];

  return (
    <form>
      <Select
        options={categories}
        placeholder="Selecciona una categoría"
        value={category}
        onChange={setCategory}
        required={true}
        name="user-category"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Selector con Data Test ID</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function TestableComponent() {
  const [priority, setPriority] = useState(null);

  return (
    <Select
      options={[
        { id: 1, label: 'Baja' },
        { id: 2, label: 'Media' },
        { id: 3, label: 'Alta' },
      ]}
      placeholder="Prioridad"
      value={priority}
      onChange={setPriority}
      data-test-id="priority-selector"
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Manejo de Estados Complejo</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function TaskForm({ onTaskCreate }) {
  const [formData, setFormData] = useState({
    title: '',
    priority: null,
    category: null,
    status: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onTaskCreate(formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título de la tarea"
        value={formData.title}
        onChange={(e) => updateField('title', e.target.value)}
      />

      <Select
        options={priorities}
        placeholder="Prioridad"
        value={formData.priority}
        onChange={(value) => updateField('priority', value)}
        required
      />

      <Select
        options={categories}
        placeholder="Categoría"
        value={formData.category}
        onChange={(value) => updateField('category', value)}
      />

      <button type="submit">Crear Tarea</button>
    </form>
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
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">options</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Option[]</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Array de opciones con id y label</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">placeholder</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Texto placeholder cuando no hay selección</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">value</td>
                  <td className="px-4 py-2 text-sm text-gray-600">number | null</td>
                  <td className="px-4 py-2 text-sm text-gray-600">null</td>
                  <td className="px-4 py-2 text-sm text-gray-600">ID de la opción seleccionada</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onChange</td>
                  <td className="px-4 py-2 text-sm text-gray-600">(id: number | null) =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Callback cuando cambia la selección</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">required</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Campo obligatorio con validación HTML</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">name</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Nombre del campo para formularios</td>
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
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🔧 Características Técnicas</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Validación HTML nativa:</strong> Input oculto para validación de formularios</li>
                <li><strong>Label flotante:</strong> Placeholder se convierte en label al seleccionar</li>
                <li><strong>Navegación por teclado:</strong> Soporte completo para accesibilidad</li>
                <li><strong>Gestión de foco:</strong> Estados focused/blurred apropiados</li>
                <li><strong>Scroll automático:</strong> Opciones resaltadas se mantienen visibles</li>
                <li><strong>Prevención de eventos:</strong> Manejo correcto de clicks y teclado</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">✨ Estados y Comportamiento</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Idle:</strong> Estado normal, esperando interacción</li>
                <li><strong>Focused:</strong> Campo activo, borde azul, listo para teclado</li>
                <li><strong>Open:</strong> Lista desplegada, opciones visibles</li>
                <li><strong>Selecting:</strong> Usuario seleccionando opción, previene cierre prematuro</li>
                <li><strong>Highlighted:</strong> Opción resaltada por hover o teclado</li>
                <li><strong>Valid/Invalid:</strong> Estados de validación para campos requeridos</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-800 mb-2">🎯 Mejores Prácticas</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li><strong>IDs únicos:</strong> Cada opción debe tener un ID único y consistente</li>
                <li><strong>Labels descriptivos:</strong> Usar labels claros y concisos</li>
                <li><strong>Campos requeridos:</strong> Usar required solo cuando sea realmente necesario</li>
                <li><strong>Manejo de estado:</strong> Sincronizar value con estado del componente padre</li>
                <li><strong>Testing:</strong> Usar data-test-id para pruebas automatizadas</li>
                <li><strong>Accesibilidad:</strong> Probar navegación por teclado en todos los casos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}