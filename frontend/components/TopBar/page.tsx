'use client'
import React, { useState } from 'react';
import TopBar from './TopBar';
import Link from 'next/link';

// Mock SideBar component for demo
const MockSideBar: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800">Menú</h2>
      <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Cerrar menú"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
    <nav className="space-y-4">
      <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Inicio</a>
      <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Perfil</a>
      <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Configuración</a>
      <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Ayuda</a>
    </nav>
  </div>
);

export default function TopBarShowcase() {
  const [selectedExample, setSelectedExample] = useState<string>('basic');

  const examples = [
    {
      id: 'basic',
      title: 'TopBar Básica',
      description: 'Barra superior simple con logo y menú',
      props: {
        title: 'Mi App',
      },
    },
    {
      id: 'customTitle',
      title: 'Con Título Personalizado',
      description: 'TopBar con título largo y descriptivo',
      props: {
        title: 'Sistema de Gestión de Alertas',
      },
    },
    {
      id: 'withSidebar',
      title: 'Con SideBar',
      description: 'TopBar que abre un menú lateral al hacer click',
      props: {
        title: 'Dashboard',
        SideBarComponent: MockSideBar,
      },
    },
    {
      id: 'customLogo',
      title: 'Con Logo Personalizado',
      description: 'TopBar con logo personalizado',
      props: {
        title: 'Mi Empresa',
        logoSrc: '/logo.svg',
      },
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TopBar Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente de barra superior con logo, título y menú desplegable.
            Ideal para navegación principal y branding de aplicaciones.
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

          <div className="max-w-4xl">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{currentExample.title}</h3>
              <p className="text-gray-600 mb-6">{currentExample.description}</p>

              {/* Mock content area to show TopBar positioning */}
              <div className="relative bg-white rounded-lg border-2 border-dashed border-gray-300 min-h-32">
                <TopBar {...currentExample.props} />

                {/* Spacer for fixed TopBar */}
                <div className="pt-16 p-4">
                  <div className="text-center text-gray-500">
                    <div className="text-lg font-medium mb-2">Contenido de la Página</div>
                    <div className="text-sm">
                      La TopBar está posicionada fixed en la parte superior.
                      Haz click en el botón de menú para ver el sidebar.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Props Aplicadas:</h4>
                <pre className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {JSON.stringify(currentExample.props, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* All Examples Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Variaciones</h2>
          <div className="space-y-6">
            {examples.map((example) => (
              <div key={example.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{example.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{example.description}</p>

                <div className="relative bg-gray-50 rounded-lg border min-h-20">
                  <TopBar {...example.props} />

                  {/* Spacer for fixed TopBar */}
                  <div className="pt-12 p-2">
                    <div className="text-xs text-gray-500 text-center">
                      Contenido de ejemplo
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-world Examples */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Casos de Uso Reales</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Aplicación de Dashboard</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <TopBar
                  title="Dashboard Administrativo"
                  SideBarComponent={MockSideBar}
                />
                <div className="pt-16 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800">Estadísticas</h4>
                      <p className="text-sm text-gray-600">Vista general del sistema</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800">Usuarios</h4>
                      <p className="text-sm text-gray-600">Gestión de usuarios activos</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800">Reportes</h4>
                      <p className="text-sm text-gray-600">Análisis y reportes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Aplicación Móvil/Web</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <TopBar
                  title="Mi App"
                  logoSrc="/logo.svg"
                  SideBarComponent={MockSideBar}
                />
                <div className="pt-16 p-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Bienvenido</h3>
                    <p className="text-gray-600">Esta es una aplicación híbrida con navegación superior</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Sistema Empresarial</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <TopBar
                  title="Sistema de Gestión Empresarial"
                  SideBarComponent={MockSideBar}
                />
                <div className="pt-16 p-4">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800">Módulos del Sistema</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Ventas</span>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Inventario</span>
                        <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">Finanzas</span>
                        <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">RRHH</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Características del Componente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Funcionalidades Principales</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Barra superior fija (fixed positioning)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Logo integrado con componente Logo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Título configurable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Botón de menú hamburguesa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Sidebar opcional con componente personalizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Overlay oscuro al abrir sidebar</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Casos de Uso</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🏢</span>
                  <span>Aplicaciones empresariales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📱</span>
                  <span>Apps móviles/web responsive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📊</span>
                  <span>Dashboards administrativos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🛍️</span>
                  <span>Plataformas de e-commerce</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📋</span>
                  <span>Sistemas de gestión</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🎓</span>
                  <span>Plataformas educativas</span>
                </li>
              </ul>
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
{`import TopBar from './components/TopBar/TopBar';

function AppLayout() {
  return (
    <div>
      <TopBar title="Mi Aplicación" />
      <main className="pt-16">
        {/* Contenido de la página */}
      </main>
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Logo Personalizado</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function BrandedApp() {
  return (
    <TopBar
      title="Mi Empresa"
      logoSrc="/logo-empresa.svg"
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con SideBar Personalizado</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import CustomSideBar from './components/CustomSideBar';

function DashboardLayout() {
  return (
    <TopBar
      title="Dashboard"
      SideBarComponent={CustomSideBar}
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Clases Personalizadas</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function ThemedTopBar() {
  return (
    <TopBar
      title="App con Tema"
      className="bg-gradient-to-r from-purple-600 to-blue-600"
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Layout Completo</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function CompleteLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Sistema Completo"
        logoSrc="/logo.svg"
        SideBarComponent={NavigationSideBar}
      />

      <main className="pt-16 px-4">
        {children}
      </main>
    </div>
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
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">title</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'title'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Texto del título que aparece en la barra</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">logoSrc</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">URL de la imagen del logo</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">className</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Clases CSS adicionales para personalización</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onMenuClick</td>
                  <td className="px-4 py-2 text-sm text-gray-600">() =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Callback cuando se hace click en el menú (no usado actualmente)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">SideBarComponent</td>
                  <td className="px-4 py-2 text-sm text-gray-600">React.ComponentType&lt;{`{onClose: () => void}`}&gt;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Componente de sidebar que se renderiza al abrir el menú</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🔧 Características Técnicas</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Posicionamiento:</strong> Fixed en top-0 left-0 con z-40</li>
                <li><strong>Responsive:</strong> Diseño adaptable con flexbox</li>
                <li><strong>Accesibilidad:</strong> aria-label en botón de menú</li>
                <li><strong>Material Icons:</strong> Usa Google Material Symbols</li>
                <li><strong>Overlay:</strong> Fondo oscuro semitransparente para sidebar</li>
                <li><strong>Estado local:</strong> Manejo interno del estado del sidebar</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">✨ Estados y Comportamiento</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Closed:</strong> Sidebar oculto, solo TopBar visible</li>
                <li><strong>Open:</strong> Sidebar visible con overlay oscuro</li>
                <li><strong>Hover:</strong> Efectos visuales en botón de menú</li>
                <li><strong>Click outside:</strong> Cerrar sidebar al hacer click en overlay</li>
                <li><strong>Close button:</strong> Botón X en sidebar para cerrar</li>
                <li><strong>Fixed positioning:</strong> Siempre visible en la parte superior</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-800 mb-2">🎯 Mejores Prácticas</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li><strong>Espaciado:</strong> Agregar pt-16 al contenido para compensar TopBar fija</li>
                <li><strong>SideBar personalizado:</strong> Crear componentes de sidebar específicos</li>
                <li><strong>Logo apropiado:</strong> Usar logos SVG para mejor escalabilidad</li>
                <li><strong>Títulos descriptivos:</strong> Usar títulos claros y concisos</li>
                <li><strong>Testing:</strong> Usar data-test-id para pruebas automatizadas</li>
                <li><strong>Responsive:</strong> Considerar sidebar en móviles vs desktop</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}