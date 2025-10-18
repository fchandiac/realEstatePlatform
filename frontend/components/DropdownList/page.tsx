'use client'
import React, { useState } from 'react';
import DropdownList, { dropdownOptionClass } from './DropdownList';
import Link from 'next/link';

export default function DropdownListShowcase() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [styledOpen, setStyledOpen] = useState(false);
  const [dropUpOpen, setDropUpOpen] = useState(false);
  const [longListOpen, setLongListOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const basicItems = ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'];
  const styledItems = ['Perfil', 'Configuración', 'Ayuda', 'Cerrar sesión'];
  const longListItems = Array.from({ length: 50 }, (_, i) => `Elemento ${i + 1}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DropdownList Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente de lista desplegable reutilizable con soporte para scroll,
            posicionamiento personalizado y estilos consistentes. Base fundamental
            para componentes como Select y AutoComplete.
          </p>
        </div>

        {/* Basic DropdownList Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">DropdownList Básico</h2>
          <div className="max-w-md">
            <div className="relative">
              <button
                onClick={() => setBasicOpen(!basicOpen)}
                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {selectedItem || 'Seleccionar opción...'}
                <span className="float-right">▼</span>
              </button>

              <DropdownList open={basicOpen} testId="basic-dropdown">
                {basicItems.map((item, index) => (
                  <li
                    key={index}
                    className={dropdownOptionClass}
                    onClick={() => {
                      setSelectedItem(item);
                      setBasicOpen(false);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </DropdownList>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Dropdown básico con elementos simples. Usa la clase CSS {dropdownOptionClass} para estilos consistentes.
            </p>
          </div>
        </div>

        {/* Styled DropdownList Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">DropdownList con Estilos Personalizados</h2>
          <div className="max-w-md">
            <div className="relative">
              <button
                onClick={() => setStyledOpen(!styledOpen)}
                className="w-full px-4 py-2 text-left bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                Menú de usuario
                <span className="float-right">▼</span>
              </button>

              <DropdownList
                open={styledOpen}
                className="border border-gray-200"
                testId="styled-dropdown"
              >
                {styledItems.map((item, index) => (
                  <li
                    key={index}
                    className={`${dropdownOptionClass} ${
                      item === 'Cerrar sesión' ? 'text-red-600 hover:bg-red-50' : ''
                    }`}
                    onClick={() => {
                      alert(`Seleccionado: ${item}`);
                      setStyledOpen(false);
                    }}
                  >
                    {item === 'Cerrar sesión' && '🚪'} {item}
                  </li>
                ))}
              </DropdownList>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Dropdown con estilos personalizados, incluyendo colores especiales para acciones destructivas.
            </p>
          </div>
        </div>

        {/* DropUp DropdownList Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">DropdownList con DropUp</h2>
          <div className="max-w-md mt-32">
            <div className="relative">
              <button
                onClick={() => setDropUpOpen(!dropUpOpen)}
                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                Abrir hacia arriba
                <span className="float-right">▲</span>
              </button>

              <DropdownList
                open={dropUpOpen}
                dropUp={true}
                testId="dropup-dropdown"
              >
                {basicItems.map((item, index) => (
                  <li
                    key={index}
                    className={dropdownOptionClass}
                    onClick={() => {
                      alert(`Seleccionado: ${item}`);
                      setDropUpOpen(false);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </DropdownList>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Dropdown que se abre hacia arriba cuando hay poco espacio debajo. Útil para elementos cerca del borde inferior.
            </p>
          </div>
        </div>

        {/* Long List with Scroll Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Lista Larga con Scroll</h2>
          <div className="max-w-md">
            <div className="relative">
              <button
                onClick={() => setLongListOpen(!longListOpen)}
                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                Lista de 50 elementos
                <span className="float-right">▼</span>
              </button>

              <DropdownList
                open={longListOpen}
                className="max-h-64"
                testId="long-list-dropdown"
              >
                {longListItems.map((item, index) => (
                  <li
                    key={index}
                    className={dropdownOptionClass}
                    onClick={() => {
                      alert(`Seleccionado: ${item}`);
                      setLongListOpen(false);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </DropdownList>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Lista larga con scroll automático. La altura máxima es de 56 unidades (14rem) por defecto, pero se puede personalizar.
            </p>
          </div>
        </div>

        {/* Custom Styling Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Estilos Personalizados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Bordes Redondeados</h3>
              <div className="relative">
                <button
                  onClick={() => {}}
                  className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm"
                >
                  Dropdown redondeado
                </button>
                <DropdownList
                  open={false}
                  className="rounded-lg border-2 border-blue-200"
                >
                  <li className={dropdownOptionClass}>Opción 1</li>
                  <li className={dropdownOptionClass}>Opción 2</li>
                </DropdownList>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Tema Oscuro</h3>
              <div className="relative">
                <button
                  onClick={() => {}}
                  className="w-full px-4 py-2 text-left bg-gray-800 text-white border border-gray-600 rounded-md"
                >
                  Dropdown oscuro
                </button>
                <DropdownList
                  open={false}
                  className="bg-gray-800 border-gray-600"
                  style={{ backgroundColor: '#1f2937' }}
                >
                  <li className={`${dropdownOptionClass} text-white hover:bg-gray-700`}>
                    Opción 1
                  </li>
                  <li className={`${dropdownOptionClass} text-white hover:bg-gray-700`}>
                    Opción 2
                  </li>
                </DropdownList>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Iconos</h3>
              <div className="relative">
                <button
                  onClick={() => {}}
                  className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md"
                >
                  Con iconos
                </button>
                <DropdownList open={false}>
                  <li className={dropdownOptionClass}>
                    <span className="flex items-center gap-2">
                      <span>👤</span> Perfil
                    </span>
                  </li>
                  <li className={dropdownOptionClass}>
                    <span className="flex items-center gap-2">
                      <span>⚙️</span> Configuración
                    </span>
                  </li>
                  <li className={dropdownOptionClass}>
                    <span className="flex items-center gap-2">
                      <span>🚪</span> Salir
                    </span>
                  </li>
                </DropdownList>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Separadores</h3>
              <div className="relative">
                <button
                  onClick={() => {}}
                  className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md"
                >
                  Con separadores
                </button>
                <DropdownList open={false}>
                  <li className={dropdownOptionClass}>Acción 1</li>
                  <li className={dropdownOptionClass}>Acción 2</li>
                  <li className="border-t border-gray-200 my-1"></li>
                  <li className={`${dropdownOptionClass} text-red-600`}>Eliminar</li>
                </DropdownList>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Integración</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Select Component</h3>
              <p className="text-sm text-gray-600 mb-4">
                DropdownList se usa internamente en el componente Select para mostrar las opciones.
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Dentro de Select.tsx
<DropdownList open={isOpen} testId="select-dropdown">
  {options.map(option => (
    <li
      key={option.id}
      className={dropdownOptionClass}
      onClick={() => handleSelect(option)}
    >
      {option.label}
    </li>
  ))}
</DropdownList>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con AutoComplete Component</h3>
              <p className="text-sm text-gray-600 mb-4">
                DropdownList filtra y muestra opciones en el componente AutoComplete.
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Dentro de AutoComplete.tsx
<DropdownList open={open && filteredOptions.length > 0}>
  {filteredOptions.map((opt, idx) => (
    <li
      key={getValue(opt)}
      className={dropdownOptionClass + (highlightedIndex === idx ? " bg-primary/30" : "")}
      onMouseDown={() => handleSelect(opt)}
    >
      {getLabel(opt)}
    </li>
  ))}
</DropdownList>`}
              </pre>
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
{`import DropdownList, { dropdownOptionClass } from './components/DropdownList';

function MyDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        Abrir Dropdown
      </button>

      <DropdownList open={isOpen}>
        <li className={dropdownOptionClass} onClick={() => setIsOpen(false)}>
          Opción 1
        </li>
        <li className={dropdownOptionClass} onClick={() => setIsOpen(false)}>
          Opción 2
        </li>
      </DropdownList>
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con DropUp</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<DropdownList open={isOpen} dropUp={true}>
  {/* Opciones del dropdown */}
</DropdownList>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Estilos Personalizados</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<DropdownList
  open={isOpen}
  className="max-h-32 border-2 border-blue-200 rounded-lg"
  style={{ backgroundColor: '#f8fafc' }}
  testId="custom-dropdown"
>
  {/* Opciones personalizadas */}
</DropdownList>`}
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
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">open</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Controla si el dropdown está visible</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">children</td>
                  <td className="px-4 py-2 text-sm text-gray-600">React.ReactNode</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Contenido del dropdown (generalmente elementos li)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">className</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&quot;&quot;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Clases CSS adicionales para el contenedor ul</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">style</td>
                  <td className="px-4 py-2 text-sm text-gray-600">React.CSSProperties</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Estilos CSS inline adicionales</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">testId</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&quot;dropdown-list&quot;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">ID para testing automatizado</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">dropUp</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Si el dropdown se abre hacia arriba</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🎨 Clase CSS Exportada</h3>
              <div className="text-sm text-blue-700">
                <p className="mb-2"><strong>dropdownOptionClass:</strong></p>
                <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                  &quot;px-3 py-2 cursor-pointer text-sm font-light rounded transition-colors duration-200 hover:bg-secondary/30 hover:rounded-none&quot;
                </code>
                <p className="mt-2">Clase CSS predefinida para opciones de dropdown con estilos consistentes.</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">🎯 Características Técnicas</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Scroll automático:</strong> Altura máxima de 56 unidades con scroll interno</li>
                <li><strong>Posicionamiento absoluto:</strong> z-index alto (60) para aparecer sobre otros elementos</li>
                <li><strong>Variables CSS:</strong> Usa --color-background para integración con temas</li>
                <li><strong>Responsive:</strong> Ancho completo relativo al contenedor padre</li>
                <li><strong>Accesibilidad:</strong> Soporte para navegación por teclado en componentes padre</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-800 mb-2">🔧 Casos de Uso</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li><strong>Select components:</strong> Base para listas desplegables de selección</li>
                <li><strong>Autocomplete:</strong> Contenedor para opciones filtradas</li>
                <li><strong>Menus contextuales:</strong> Dropdowns con acciones rápidas</li>
                <li><strong>Filtros:</strong> Listas de opciones de filtrado</li>
                <li><strong>Navigation:</strong> Menus de navegación desplegables</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}