'use client'
import React from 'react';
import Card from './Card';
import Link from 'next/link';

export default function CardShowcase() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Card Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente versátil de tarjeta que organiza el contenido en áreas distintas:
            área superior, contenido principal y área de acciones. Ideal para mostrar información
            estructurada de manera clara y atractiva.
          </p>
        </div>

        {/* Basic Card Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Card Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              height="200px"
              content={
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Título de la Card</h3>
                  <p className="text-sm text-gray-600">
                    Esta es una card básica con contenido simple.
                  </p>
                </div>
              }
            />
            <Card
              height="200px"
              topArea={
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">📊</span>
                </div>
              }
              content={
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Estadísticas</h3>
                  <p className="text-sm text-gray-600">
                    Card con área superior destacada.
                  </p>
                </div>
              }
            />
            <Card
              height="200px"
              content={
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Acciones</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Card con botones de acción.
                  </p>
                </div>
              }
              actionsArea={
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                    Ver
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600">
                    Editar
                  </button>
                </div>
              }
            />
          </div>
        </div>

        {/* Different Heights Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Diferentes Alturas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              height="150px"
              content={
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Card Compacta</h3>
                  <p className="text-xs text-gray-600">150px de altura</p>
                </div>
              }
            />
            <Card
              height="250px"
              content={
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Card Estándar</h3>
                  <p className="text-sm text-gray-600">250px de altura</p>
                </div>
              }
            />
            <Card
              height="350px"
              content={
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Card Grande</h3>
                  <p className="text-sm text-gray-600">350px de altura</p>
                </div>
              }
            />
          </div>
        </div>

        {/* Top Area Variations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variaciones del Área Superior</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              height="280px"
              topAreaHeight="60%"
              topArea={
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white text-3xl">🌱</span>
                </div>
              }
              content={
                <div className="text-center px-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Área Superior Grande</h3>
                  <p className="text-xs text-gray-600">60% de la altura total</p>
                </div>
              }
            />
            <Card
              height="280px"
              topAreaHeight="30%"
              topArea={
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl">💎</span>
                </div>
              }
              content={
                <div className="text-center px-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Área Superior Pequeña</h3>
                  <p className="text-xs text-gray-600">30% de la altura total</p>
                </div>
              }
            />
            <Card
              height="280px"
              topArea={
                <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4">
                  <img
                    src="https://via.placeholder.com/150x80/cccccc/666666?text=Image"
                    alt="Placeholder"
                    className="max-w-full max-h-full object-cover rounded"
                  />
                </div>
              }
              content={
                <div className="text-center px-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Con Imagen</h3>
                  <p className="text-xs text-gray-600">Área superior con imagen</p>
                </div>
              }
            />
            <Card
              height="280px"
              topArea={
                <div className="w-full h-full bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm">Completado</div>
                  </div>
                </div>
              }
              content={
                <div className="text-center px-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Métricas</h3>
                  <p className="text-xs text-gray-600">Visualización de datos</p>
                </div>
              }
            />
          </div>
        </div>

        {/* Content Variations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variaciones de Contenido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              height="300px"
              content={
                <div className="w-full px-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Lista de Elementos</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Primer elemento
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Segundo elemento
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Tercer elemento
                    </li>
                  </ul>
                </div>
              }
            />
            <Card
              height="300px"
              content={
                <div className="w-full px-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Estadísticas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">1,234</div>
                      <div className="text-xs text-gray-500">Usuarios</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">567</div>
                      <div className="text-xs text-gray-500">Activos</div>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        {/* Actions Area Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Área de Acciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              height="250px"
              content={
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Proyecto A</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Descripción breve del proyecto en desarrollo.
                  </p>
                  <div className="text-xs text-gray-500">Estado: En progreso</div>
                </div>
              }
              actionsArea={
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                    Ver detalles
                  </button>
                  <button className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">
                    Completar
                  </button>
                </div>
              }
            />
            <Card
              height="250px"
              content={
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Usuario Premium</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Plan activo con beneficios exclusivos.
                  </p>
                  <div className="text-xs text-gray-500">Vence: 15/12/2024</div>
                </div>
              }
              actionsArea={
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600">
                    Renovar
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600">
                    Gestionar
                  </button>
                </div>
              }
            />
            <Card
              height="250px"
              content={
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Notificación</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Tienes 3 mensajes sin leer en tu bandeja.
                  </p>
                  <div className="text-xs text-gray-500">Hace 2 horas</div>
                </div>
              }
              actionsArea={
                <button className="px-4 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
                  Ver mensajes
                </button>
              }
            />
          </div>
        </div>

        {/* Usage Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Uso</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Card Básica</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import Card from './components/Card';

<Card
  height="200px"
  content={
    <div className="text-center">
      <h3>Título</h3>
      <p>Contenido de la card</p>
    </div>
  }
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Card Completa</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Card
  height="300px"
  topArea={
    <div className="w-full h-full bg-blue-500 flex items-center justify-center">
      <span>Icono</span>
    </div>
  }
  topAreaHeight="40%"
  content={
    <div>
      <h3>Título Principal</h3>
      <p>Contenido descriptivo</p>
    </div>
  }
  actionsArea={
    <div className="flex gap-2">
      <button>Acción 1</button>
      <button>Acción 2</button>
    </div>
  }
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Card con Imagen</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Card
  height="250px"
  topArea={
    <img src="/path/to/image.jpg" alt="Descripción" className="w-full h-full object-cover" />
  }
  content={<h3>Título con imagen</h3>}
  actionsArea={<button>Ver más</button>}
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
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">height</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string | number</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'20rem'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Altura total de la card</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">topArea</td>
                  <td className="px-4 py-2 text-sm text-gray-600">React.ReactNode</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Contenido del área superior</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">topAreaHeight</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string | number</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'40%'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Altura del área superior</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">content</td>
                  <td className="px-4 py-2 text-sm text-gray-600">React.ReactNode</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Contenido principal de la card</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">actionsArea</td>
                  <td className="px-4 py-2 text-sm text-gray-600">React.ReactNode</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Área de acciones (botones, etc.)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">className</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">''</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Clases CSS adicionales</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">dataTestId</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'card-root'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">ID para testing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}