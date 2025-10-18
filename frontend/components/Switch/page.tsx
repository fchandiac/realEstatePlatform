'use client'
import React, { useState } from 'react';
import Switch from './Switch';
import Link from 'next/link';

export default function SwitchShowcase() {
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  const [labelPosition, setLabelPosition] = useState<'left' | 'right'>('right');

  const settings = [
    {
      id: 'notifications',
      title: 'Notificaciones Push',
      description: 'Recibe notificaciones en tiempo real',
      value: notifications,
      onChange: setNotifications,
    },
    {
      id: 'darkMode',
      title: 'Modo Oscuro',
      description: 'Cambia el tema de la aplicación',
      value: darkMode,
      onChange: setDarkMode,
    },
    {
      id: 'autoSave',
      title: 'Guardado Automático',
      description: 'Guarda automáticamente tus cambios',
      value: autoSave,
      onChange: setAutoSave,
    },
    {
      id: 'emailUpdates',
      title: 'Actualizaciones por Email',
      description: 'Recibe correos con novedades',
      value: emailUpdates,
      onChange: setEmailUpdates,
    },
    {
      id: 'locationServices',
      title: 'Servicios de Ubicación',
      description: 'Permite acceso a tu ubicación',
      value: locationServices,
      onChange: setLocationServices,
    },
    {
      id: 'analytics',
      title: 'Análisis de Uso',
      description: 'Ayuda a mejorar la app con datos anónimos',
      value: analytics,
      onChange: setAnalytics,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Switch Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente de interruptor toggle con label opcional y posiciones configurables.
            Ideal para configuraciones, preferencias y controles booleanos.
          </p>
        </div>

        {/* Interactive Demo Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Demo Interactivo</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Posición del Label:</label>
            <select
              value={labelPosition}
              onChange={(e) => setLabelPosition(e.target.value as 'left' | 'right')}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Izquierda</option>
              <option value="right">Derecha</option>
            </select>
          </div>

          <div className="max-w-2xl">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuraciones de Usuario</h3>
              <p className="text-gray-600 mb-6">Prueba diferentes configuraciones con el switch</p>

              <div className="space-y-4">
                {settings.slice(0, 3).map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{setting.title}</div>
                      <div className="text-sm text-gray-600">{setting.description}</div>
                    </div>
                    <Switch
                      checked={setting.value}
                      onChange={setting.onChange}
                      label=""
                      labelPosition={labelPosition}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">Estado Actual:</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {settings.slice(0, 3).map((setting) => (
                    <div key={setting.id} className="flex justify-between">
                      <span>{setting.title}:</span>
                      <span className={setting.value ? 'text-green-600 font-medium' : 'text-gray-500'}>
                        {setting.value ? 'Activado' : 'Desactivado'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Examples Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Casos de Uso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Preferencias de Usuario</h3>
              <div className="space-y-3">
                {settings.slice(0, 3).map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">{setting.title}</div>
                      <div className="text-xs text-gray-500">{setting.description}</div>
                    </div>
                    <Switch
                      checked={setting.value}
                      onChange={setting.onChange}
                      label=""
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Controles de Privacidad</h3>
              <div className="space-y-3">
                {settings.slice(3).map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">{setting.title}</div>
                      <div className="text-xs text-gray-500">{setting.description}</div>
                    </div>
                    <Switch
                      checked={setting.value}
                      onChange={setting.onChange}
                      label=""
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Label Positions Demo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Posiciones del Label</h2>
          <div className="max-w-2xl space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-800 mb-4">Label a la Izquierda</h3>
              <div className="space-y-3">
                <Switch
                  checked={true}
                  onChange={() => {}}
                  label="Activar notificaciones"
                  labelPosition="left"
                />
                <Switch
                  checked={false}
                  onChange={() => {}}
                  label="Modo oscuro"
                  labelPosition="left"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-4">Label a la Derecha</h3>
              <div className="space-y-3">
                <Switch
                  checked={true}
                  onChange={() => {}}
                  label="Activar notificaciones"
                  labelPosition="right"
                />
                <Switch
                  checked={false}
                  onChange={() => {}}
                  label="Modo oscuro"
                  labelPosition="right"
                />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-purple-800 mb-4">Sin Label</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">Solo icono:</span>
                  <Switch checked={true} onChange={() => {}} />
                  <Switch checked={false} onChange={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* States and Visual Feedback */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Estados y Retroalimentación Visual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Estados del Switch</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Switch checked={true} onChange={() => {}} />
                  <div>
                    <div className="font-medium text-green-800">Activado (On)</div>
                    <div className="text-sm text-green-600">Switch en posición "encendido"</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Switch checked={false} onChange={() => {}} />
                  <div>
                    <div className="font-medium text-gray-800">Desactivado (Off)</div>
                    <div className="text-sm text-gray-600">Switch en posición "apagado"</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Interacciones</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">Click</div>
                  <div className="text-sm text-gray-600">Alterna entre estados on/off</div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">Hover</div>
                  <div className="text-sm text-gray-600">Efecto visual sutil en el thumb</div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">Focus</div>
                  <div className="text-sm text-gray-600">Accesible por teclado (Tab)</div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">Label Click</div>
                  <div className="text-sm text-gray-600">También activa el switch</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-world Examples */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos del Mundo Real</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Configuración de Notificaciones</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">Notificaciones Push</div>
                      <div className="text-sm text-gray-600">Recibe alertas importantes</div>
                    </div>
                    <Switch checked={notifications} onChange={setNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">Emails de Marketing</div>
                      <div className="text-sm text-gray-600">Ofertas y promociones</div>
                    </div>
                    <Switch checked={emailUpdates} onChange={setEmailUpdates} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">Recordatorios</div>
                      <div className="text-sm text-gray-600">Notificaciones de tareas pendientes</div>
                    </div>
                    <Switch checked={true} onChange={() => {}} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Preferencias de Privacidad</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">Ubicación</div>
                      <div className="text-sm text-gray-600">Permitir acceso a tu ubicación</div>
                    </div>
                    <Switch checked={locationServices} onChange={setLocationServices} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">Análisis de Uso</div>
                      <div className="text-sm text-gray-600">Ayudar a mejorar la app</div>
                    </div>
                    <Switch checked={analytics} onChange={setAnalytics} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">Cookies de Terceros</div>
                      <div className="text-sm text-gray-600">Permitir cookies de publicidad</div>
                    </div>
                    <Switch checked={false} onChange={() => {}} />
                  </div>
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
{`import Switch from './components/Switch/Switch';

function SettingsPage() {
  const [notifications, setNotifications] = useState(false);

  return (
    <Switch
      checked={notifications}
      onChange={setNotifications}
      label="Notificaciones"
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Label a la Izquierda</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function PrivacySettings() {
  const [analytics, setAnalytics] = useState(false);

  return (
    <div className="space-y-4">
      <Switch
        checked={analytics}
        onChange={setAnalytics}
        label="Permitir análisis de uso"
        labelPosition="left"
      />
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Switch sin Label</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function IconToggle() {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="flex items-center gap-2">
      <span>Activo:</span>
      <Switch
        checked={isActive}
        onChange={setIsActive}
      />
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Múltiples Switches en Formulario</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function UserPreferences({ preferences, onUpdate }) {
  const updatePreference = (key, value) => {
    onUpdate({ ...preferences, [key]: value });
  };

  return (
    <div className="space-y-4">
      <Switch
        checked={preferences.notifications}
        onChange={(value) => updatePreference('notifications', value)}
        label="Notificaciones push"
        labelPosition="right"
      />

      <Switch
        checked={preferences.darkMode}
        onChange={(value) => updatePreference('darkMode', value)}
        label="Modo oscuro"
        labelPosition="right"
      />

      <Switch
        checked={preferences.autoSave}
        onChange={(value) => updatePreference('autoSave', value)}
        label="Guardado automático"
        labelPosition="right"
      />
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Data Test ID</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function TestableSettings() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      label="Función experimental"
      data-test-id="experimental-feature-toggle"
    />
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
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">checked</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Estado del switch (activado/desactivado)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onChange</td>
                  <td className="px-4 py-2 text-sm text-gray-600">(checked: boolean) =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Callback cuando cambia el estado</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">label</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Texto del label asociado al switch</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">labelPosition</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'left' | 'right'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'left'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Posición del label respecto al switch</td>
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
                <li><strong>Estado interno:</strong> Mantiene estado local con useState</li>
                <li><strong>Transiciones CSS:</strong> Animaciones suaves con duration-200</li>
                <li><strong>Variables CSS:</strong> Usa --color-primary, --color-neutral, --color-background</li>
                <li><strong>Accesibilidad:</strong> role="switch" y aria-checked</li>
                <li><strong>Interacción:</strong> Click tanto en switch como en label</li>
                <li><strong>Estilos:</strong> Box-shadow inset para el borde del track</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">✨ Estados y Comportamiento</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Checked (true):</strong> Thumb azul, transladado a la derecha</li>
                <li><strong>Unchecked (false):</strong> Thumb gris, posición izquierda</li>
                <li><strong>Hover:</strong> Efecto sutil en el thumb no seleccionado</li>
                <li><strong>Focus:</strong> Accesible por navegación por teclado</li>
                <li><strong>Transition:</strong> Animación suave al cambiar estados</li>
                <li><strong>Callback:</strong> onChange se ejecuta inmediatamente al click</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-800 mb-2">🎯 Mejores Prácticas</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li><strong>Labels claros:</strong> Usar labels descriptivos que indiquen la acción</li>
                <li><strong>Estados iniciales:</strong> Definir valores por defecto apropiados</li>
                <li><strong>Feedback visual:</strong> Mostrar cambios inmediatamente al usuario</li>
                <li><strong>Accesibilidad:</strong> Siempre incluir labels o contexto claro</li>
                <li><strong>Testing:</strong> Usar data-test-id para pruebas automatizadas</li>
                <li><strong>Performance:</strong> Evitar re-renders excesivos en onChange</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}