'use client'
import React, { useState } from 'react';
import Dialog from './Dialog';
import Link from 'next/link';

export default function DialogShowcase() {
  const [basicDialog, setBasicDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [formDialog, setFormDialog] = useState(false);
  const [largeDialog, setLargeDialog] = useState(false);
  const [scrollDialog, setScrollDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dialog Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente modal avanzado con múltiples tamaños responsivos, control de scroll,
            animaciones suaves y overlay. Perfecto para confirmaciones, formularios, información
            detallada y cualquier contenido que requiera atención completa del usuario.
          </p>
        </div>

        {/* Basic Dialog Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dialog Básico</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setBasicDialog(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Abrir Dialog Básico
            </button>
          </div>

          <Dialog
            open={basicDialog}
            onClose={() => setBasicDialog(false)}
            title="Dialog Básico"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Este es un dialog básico con título y contenido simple.
                Puedes cerrar este dialog haciendo clic en el overlay o en el botón de cerrar.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setBasicDialog(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setBasicDialog(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </Dialog>
        </div>

        {/* Confirmation Dialog Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dialog de Confirmación</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setConfirmDialog(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Eliminar Elemento
            </button>
          </div>

          <Dialog
            open={confirmDialog}
            onClose={() => setConfirmDialog(false)}
            title="Confirmar Eliminación"
            size="sm"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">¿Estás seguro de que quieres eliminar este elemento?</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Esta acción no se puede deshacer. El elemento será eliminado permanentemente.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDialog(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    alert('Elemento eliminado');
                    setConfirmDialog(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </Dialog>
        </div>

        {/* Form Dialog Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dialog con Formulario</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFormDialog(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Crear Nuevo Usuario
            </button>
          </div>

          <Dialog
            open={formDialog}
            onClose={() => setFormDialog(false)}
            title="Crear Nuevo Usuario"
            size="lg"
          >
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingresa el nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingresa el apellido"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Usuario</option>
                  <option>Administrador</option>
                  <option>Moderador</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setFormDialog(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    alert('Usuario creado exitosamente');
                    setFormDialog(false);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </Dialog>
        </div>

        {/* Size Variations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variaciones de Tamaño</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setBasicDialog(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Tamaño XS (Pequeño)
            </button>
            <button
              onClick={() => setConfirmDialog(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Tamaño SM (Confirmación)
            </button>
            <button
              onClick={() => setFormDialog(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Tamaño LG (Formulario)
            </button>
            <button
              onClick={() => setLargeDialog(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Tamaño XL (Grande)
            </button>
          </div>

          <Dialog
            open={largeDialog}
            onClose={() => setLargeDialog(false)}
            title="Dialog Extra Grande"
            size="xl"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Este es un dialog extra grande (XL) perfecto para contenido extenso,
                tablas grandes, o formularios complejos que necesitan mucho espacio.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">Información del Sistema</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Versión:</span>
                      <span className="font-mono">2.1.4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="text-green-600">Activo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usuarios:</span>
                      <span>1,234</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">Configuración</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Notificaciones activas</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Modo oscuro</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setLargeDialog(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </Dialog>
        </div>

        {/* Scroll Behavior Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comportamiento de Scroll</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setScrollDialog(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Contenido Largo (Scroll Paper)
            </button>
          </div>

          <Dialog
            open={scrollDialog}
            onClose={() => setScrollDialog(false)}
            title="Contenido con Scroll Interno"
            size="md"
            scroll="paper"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Este dialog tiene mucho contenido y usa scroll interno (scroll="paper").
                El contenido se desplaza dentro del dialog mientras el overlay permanece fijo.
              </p>

              {/* Contenido largo para demostrar scroll */}
              <div className="space-y-4">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Sección {i + 1}</h4>
                    <p className="text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Tag {i + 1}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Status</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setScrollDialog(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </Dialog>
        </div>

        {/* Usage Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Uso</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Dialog Básico</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import { useState } from 'react';
import Dialog from './components/Dialog';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir Dialog</button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Mi Dialog"
      >
        <p>Contenido del dialog</p>
      </Dialog>
    </>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Dialog de Confirmación</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Dialog
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  title="Confirmar Acción"
  size="sm"
>
  <div className="space-y-4">
    <p>¿Estás seguro de que quieres continuar?</p>
    <div className="flex justify-end gap-3">
      <button onClick={() => setConfirmOpen(false)}>Cancelar</button>
      <button onClick={handleConfirm}>Confirmar</button>
    </div>
  </div>
</Dialog>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Dialog con Formulario</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Dialog
  open={formOpen}
  onClose={() => setFormOpen(false)}
  title="Crear Nuevo Elemento"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    {/* Campos del formulario */}
    <div className="flex justify-end gap-3">
      <button type="button" onClick={() => setFormOpen(false)}>
        Cancelar
      </button>
      <button type="submit">Guardar</button>
    </div>
  </form>
</Dialog>`}
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
                  <td className="px-4 py-2 text-sm text-gray-600">Controla si el dialog está visible</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onClose</td>
                  <td className="px-4 py-2 text-sm text-gray-600">() =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Función llamada para cerrar el dialog</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">title</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Título opcional del dialog</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">children</td>
                  <td className="px-4 py-2 text-sm text-gray-600">React.ReactNode</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Contenido del dialog</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">size</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&apos;md&apos;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Tamaño responsivo del dialog</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">scroll</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&apos;body&apos; | &apos;paper&apos;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&apos;paper&apos;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Controla dónde ocurre el scroll del contenido</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">📏 Tamaños Disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                <div>
                  <strong>XS:</strong> min 320px, max 448px<br/>
                  <strong>SM:</strong> min 400px, max 512px
                </div>
                <div>
                  <strong>MD:</strong> min 480px, max 576px<br/>
                  <strong>LG:</strong> min 560px, max 672px
                </div>
                <div>
                  <strong>XL:</strong> min 640px, max 1024px
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">🎯 Comportamiento de Scroll</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>&apos;paper&apos; (recomendado):</strong> Scroll dentro del dialog, overlay fijo</li>
                <li><strong>&apos;body&apos;:</strong> Scroll en el overlay, dialog se mueve con el contenido</li>
                <li><strong>Nota:</strong> El scroll del body siempre está bloqueado cuando hay un dialog abierto</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
