'use client'
import React, { useState } from 'react';
import Alert from './Alert';
import { Button } from '../Button/Button';
import Link from 'next/link';

export default function AlertShowcase() {
  const [visibleAlerts, setVisibleAlerts] = useState({
    success: true,
    error: true,
    warning: true,
    info: true,
    custom: true
  });

  const toggleAlert = (type: keyof typeof visibleAlerts) => {
    setVisibleAlerts(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Alert Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente de notificación para mostrar mensajes informativos, de éxito, error o advertencia
            a los usuarios. Soporta diferentes variantes visuales y contenido personalizado.
          </p>
        </div>

        {/* Variants Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variantes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Success (Éxito)</h3>
              {visibleAlerts.success ? (
                <div className="space-y-2">
                  <Alert variant="success">
                    ¡Operación completada exitosamente! Los datos se han guardado correctamente.
                  </Alert>
                  <Button variant="outlined" size="sm" onClick={() => toggleAlert('success')}>
                    Ocultar
                  </Button>
                </div>
              ) : (
                <Button variant="outlined" onClick={() => toggleAlert('success')}>
                  Mostrar Alerta de Éxito
                </Button>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Error</h3>
              {visibleAlerts.error ? (
                <div className="space-y-2">
                  <Alert variant="error">
                    Ha ocurrido un error al procesar la solicitud. Por favor, inténtalo de nuevo.
                  </Alert>
                  <Button variant="outlined" size="sm" onClick={() => toggleAlert('error')}>
                    Ocultar
                  </Button>
                </div>
              ) : (
                <Button variant="outlined" onClick={() => toggleAlert('error')}>
                  Mostrar Alerta de Error
                </Button>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Warning (Advertencia)</h3>
              {visibleAlerts.warning ? (
                <div className="space-y-2">
                  <Alert variant="warning">
                    Atención: Esta acción no se puede deshacer. Revisa los datos antes de continuar.
                  </Alert>
                  <Button variant="outlined" size="sm" onClick={() => toggleAlert('warning')}>
                    Ocultar
                  </Button>
                </div>
              ) : (
                <Button variant="outlined" onClick={() => toggleAlert('warning')}>
                  Mostrar Alerta de Advertencia
                </Button>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Info (Información)</h3>
              {visibleAlerts.info ? (
                <div className="space-y-2">
                  <Alert variant="info">
                    Información importante: Recuerda guardar tus cambios antes de salir.
                  </Alert>
                  <Button variant="outlined" size="sm" onClick={() => toggleAlert('info')}>
                    Ocultar
                  </Button>
                </div>
              ) : (
                <Button variant="outlined" onClick={() => toggleAlert('info')}>
                  Mostrar Alerta de Información
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Without Close Button Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sin Botón de Cerrar</h2>
          <div className="space-y-4">
            <Alert variant="success">
              Esta alerta no se puede cerrar. Es útil para mensajes persistentes.
            </Alert>
            <Alert variant="error">
              Error crítico del sistema que requiere atención inmediata.
            </Alert>
          </div>
        </div>

        {/* Custom Content Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contenido Personalizado</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Elementos Interactivos</h3>
              {visibleAlerts.custom ? (
                <div className="space-y-2">
                  <Alert variant="info">
                    <div className="flex items-center justify-between">
                      <span>Nuevo mensaje recibido de soporte técnico.</span>
                      <Button variant="primary" size="sm" className="ml-4">
                        Ver Mensaje
                      </Button>
                    </div>
                  </Alert>
                  <Button variant="outlined" size="sm" onClick={() => toggleAlert('custom')}>
                    Ocultar
                  </Button>
                </div>
              ) : (
                <Button variant="outlined" onClick={() => toggleAlert('custom')}>
                  Mostrar Alerta Personalizada
                </Button>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Múltiples Líneas</h3>
              <Alert variant="warning">
                <div>
                  <strong>Advertencia de Seguridad:</strong>
                  <ul className="mt-2 ml-4 list-disc">
                    <li>Tu sesión expirará en 5 minutos</li>
                    <li>Guarda tu trabajo para evitar perder cambios</li>
                    <li>Considera extender tu sesión si necesitas más tiempo</li>
                  </ul>
                </div>
              </Alert>
            </div>
          </div>
        </div>

        {/* Usage Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Uso</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Alerta de Éxito Básica</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Alert variant="success">
  Los datos se han guardado correctamente.
</Alert>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Alerta con Botón de Cerrar</h3>
              <p className="text-gray-600 mb-3">
                El componente Alert no incluye botón de cerrar integrado. Para alertas dismissibles,
                maneja la visibilidad desde el componente padre.
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`const [showAlert, setShowAlert] = useState(true);

{showAlert && (
  <div className="space-y-2">
    <Alert variant="error">
      Ha ocurrido un error. Inténtalo de nuevo.
    </Alert>
    <Button variant="outlined" size="sm" onClick={() => setShowAlert(false)}>
      Cerrar
    </Button>
  </div>
)}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Alerta con Contenido Complejo</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Alert variant="warning">
  <div>
    <strong>Importante:</strong> Revisa estos puntos:
    <ul className="mt-2 ml-4 list-disc">
      <li>Punto 1</li>
      <li>Punto 2</li>
    </ul>
  </div>
</Alert>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Common Use Cases Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Casos de Uso Comunes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-700 mb-2">✅ Operaciones Exitosas</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Guardar datos</li>
                <li>• Enviar formularios</li>
                <li>• Completar tareas</li>
                <li>• Actualizar información</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-700 mb-2">❌ Errores y Problemas</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Validación fallida</li>
                <li>• Error de conexión</li>
                <li>• Permisos insuficientes</li>
                <li>• Datos inválidos</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-yellow-700 mb-2">⚠️ Advertencias</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Acciones irreversibles</li>
                <li>• Cambios importantes</li>
                <li>• Información crítica</li>
                <li>• Decisiones importantes</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-700 mb-2">ℹ️ Información General</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Consejos y guías</li>
                <li>• Actualizaciones</li>
                <li>• Recordatorios</li>
                <li>• Notificaciones</li>
              </ul>
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
                  <td className="px-4 py-2 text-sm text-gray-600">"success" | "error" | "warning" | "info"</td>
                  <td className="px-4 py-2 text-sm text-gray-600">"info"</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Estilo visual de la alerta</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">children</td>
                  <td className="px-4 py-2 text-sm text-gray-600">ReactNode</td>
                  <td className="px-4 py-2 text-sm text-gray-600">required</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Contenido de la alerta</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">className</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">""</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Clases CSS adicionales</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-gray-900">dataTestId</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Atributo para testing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}