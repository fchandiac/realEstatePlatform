'use client'
import React, { useState } from 'react';
import UpdateLocationPicker from './UpdateLocationPickerWrapper';
import CreateLocationPicker from './CreateLocationPickerWrapper';
import Link from 'next/link';

interface Coordinates {
  lat: number;
  lng: number;
}

export default function LocationPickerShowcase() {
  const [newLocation, setNewLocation] = useState<Coordinates | null>(null);
  const [existingLocation, setExistingLocation] = useState<Coordinates>({
    lat: -33.45,
    lng: -70.6667 // Santiago, Chile
  });
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null);
  const [demoMode, setDemoMode] = useState<'create' | 'update'>('create');

  const demoLocations = [
    { name: 'Santiago, Chile', coords: { lat: -33.45, lng: -70.6667 } },
    { name: 'Buenos Aires, Argentina', coords: { lat: -34.6037, lng: -58.3816 } },
    { name: 'São Paulo, Brasil', coords: { lat: -23.5505, lng: -46.6333 } },
    { name: 'Lima, Perú', coords: { lat: -12.0464, lng: -77.0428 } },
    { name: 'Bogotá, Colombia', coords: { lat: 4.7110, lng: -74.0721 } },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">LocationPicker Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Sistema completo de selección de ubicaciones con mapas interactivos,
            geolocalización automática y soporte para crear y editar coordenadas.
            Utiliza React Leaflet para una experiencia de mapa fluida.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Modo de Demonstración</h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setDemoMode('create')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                demoMode === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Modo Creación
            </button>
            <button
              onClick={() => setDemoMode('update')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                demoMode === 'update'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Modo Edición
            </button>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>{demoMode === 'create' ? 'Modo Creación:' : 'Modo Edición:'}</strong>{' '}
              {demoMode === 'create'
                ? 'Obtiene automáticamente la ubicación del usuario y permite seleccionar una nueva ubicación.'
                : 'Recibe coordenadas iniciales y permite modificar la ubicación existente.'
              }
            </p>
          </div>
        </div>

        {/* CreateLocationPicker Demo */}
        {demoMode === 'create' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">CreateLocationPicker</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Este componente es ideal para <strong>crear nuevas ubicaciones</strong>.
                  Automáticamente solicita la geolocalización del usuario y permite
                  seleccionar una nueva ubicación en el mapa.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Características:</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Obtiene automáticamente la ubicación del usuario</li>
                      <li>• No requiere coordenadas iniciales</li>
                      <li>• Perfecto para formularios de creación</li>
                      <li>• Compatible con SSR (carga dinámica)</li>
                      <li>• Fallback a ubicación por defecto si falla la geolocalización</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Cómo funciona:</h3>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Intenta obtener ubicación del navegador</li>
                      <li>2. Si falla, intenta ubicación del sistema</li>
                      <li>3. Si todo falla, usa Santiago, Chile como defecto</li>
                      <li>4. Usuario puede hacer click en el mapa para cambiar</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div>
                <CreateLocationPicker
                  height="400px"
                  onChange={(coords) => {
                    setNewLocation(coords);
                    console.log('Nueva ubicación creada:', coords);
                  }}
                />

                {newLocation && (
                  <div className="mt-4 p-4 bg-green-100 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Ubicación Seleccionada:</h3>
                    <div className="text-sm text-green-700 space-y-1">
                      <p><strong>Latitud:</strong> {newLocation.lat.toFixed(6)}</p>
                      <p><strong>Longitud:</strong> {newLocation.lng.toFixed(6)}</p>
                      <p><strong>Precisión:</strong> ~10-100 metros (dependiendo del dispositivo)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* UpdateLocationPicker Demo */}
        {demoMode === 'update' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">UpdateLocationPicker</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Este componente es ideal para <strong>actualizar ubicaciones existentes</strong>.
                  Recibe coordenadas iniciales y permite al usuario modificar la ubicación actual.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Características:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Recibe coordenadas iniciales como prop</li>
                      <li>• Muestra la ubicación actual en el mapa</li>
                      <li>• Perfecto para formularios de edición</li>
                      <li>• Compatible con SSR (carga dinámica)</li>
                      <li>• Mantiene el estado de la ubicación original</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Ubicación Inicial:</h3>
                    <p className="text-sm text-purple-700">
                      <strong>{demoLocations.find(loc =>
                        Math.abs(loc.coords.lat - existingLocation.lat) < 0.01 &&
                        Math.abs(loc.coords.lng - existingLocation.lng) < 0.01
                      )?.name || 'Ubicación Personalizada'}</strong>
                    </p>
                    <p className="text-sm text-purple-700">
                      Latitud: {existingLocation.lat.toFixed(6)}
                    </p>
                    <p className="text-sm text-purple-700">
                      Longitud: {existingLocation.lng.toFixed(6)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cambiar Ubicación Inicial:
                    </label>
                    <select
                      value={`${existingLocation.lat},${existingLocation.lng}`}
                      onChange={(e) => {
                        const [lat, lng] = e.target.value.split(',').map(Number);
                        setExistingLocation({ lat, lng });
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {demoLocations.map((location) => (
                        <option
                          key={`${location.coords.lat},${location.coords.lng}`}
                          value={`${location.coords.lat},${location.coords.lng}`}
                        >
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <UpdateLocationPicker
                  initialCoordinates={existingLocation}
                  height="400px"
                  onChange={(coords) => {
                    if (coords) {
                      setExistingLocation(coords);
                      console.log('Ubicación actualizada:', coords);
                    }
                  }}
                />

                <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Ubicación Actual:</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Latitud:</strong> {existingLocation.lat.toFixed(6)}</p>
                    <p><strong>Longitud:</strong> {existingLocation.lng.toFixed(6)}</p>
                    <p><strong>Ciudad aproximada:</strong> {
                      demoLocations.find(loc =>
                        Math.abs(loc.coords.lat - existingLocation.lat) < 0.01 &&
                        Math.abs(loc.coords.lng - existingLocation.lng) < 0.01
                      )?.name || 'Ubicación personalizada'
                    }</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Demo Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Demo Interactivo Avanzado</h2>
          <div className="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Selector de Ubicaciones</h3>
                <div className="space-y-3">
                  {demoLocations.map((location) => (
                    <button
                      key={`${location.coords.lat},${location.coords.lng}`}
                      onClick={() => setSelectedLocation(location.coords)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedLocation &&
                        Math.abs(selectedLocation.lat - location.coords.lat) < 0.01 &&
                        Math.abs(selectedLocation.lng - location.coords.lng) < 0.01
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-500">
                        {location.coords.lat.toFixed(4)}, {location.coords.lng.toFixed(4)}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedLocation && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Ubicación Seleccionada:</h4>
                    <p className="text-sm text-green-700">
                      <strong>Lat:</strong> {selectedLocation.lat.toFixed(6)}
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Lng:</strong> {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Mapa con Ubicación Seleccionada</h3>
                {selectedLocation ? (
                  <UpdateLocationPicker
                    initialCoordinates={selectedLocation}
                    height="300px"
                    onChange={(coords) => {
                      if (coords) {
                        setSelectedLocation(coords);
                      }
                    }}
                  />
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Selecciona una ubicación para ver el mapa</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Características del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Funcionalidades Principales</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Geolocalización automática del navegador</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Geolocalización del sistema como fallback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Selección manual de ubicación por click</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Marcadores personalizados con Material Symbols</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Compatible con Server-Side Rendering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Controles de zoom personalizados</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Casos de Uso</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📍</span>
                  <span>Registro de ubicación de usuarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🏪</span>
                  <span>Selección de ubicación de tiendas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📱</span>
                  <span>Check-in en puntos de interés</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🚗</span>
                  <span>Sistema de delivery y logística</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🏠</span>
                  <span>Registro de propiedades inmobiliarias</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📊</span>
                  <span>Recolección de datos geoespaciales</span>
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
              <h3 className="text-lg font-medium text-gray-700 mb-3">Crear Nueva Ubicación</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import CreateLocationPicker from './components/LocationPicker/CreateLocationPickerWrapper';

function CreateLocationForm() {
  const [coordinates, setCoordinates] = useState(null);

  const handleSubmit = async () => {
    if (coordinates) {
      await fetch('/api/locations', {
        method: 'POST',
        body: JSON.stringify({
          lat: coordinates.lat,
          lng: coordinates.lng
        })
      });
    }
  };

  return (
    <div>
      <CreateLocationPicker
        height="400px"
        onChange={setCoordinates}
      />

      <button onClick={handleSubmit}>
        Crear Ubicación
      </button>
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Editar Ubicación Existente</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import UpdateLocationPicker from './components/LocationPicker/UpdateLocationPickerWrapper';

function EditLocationForm({ location }) {
  const [coordinates, setCoordinates] = useState(location.coordinates);

  const handleSubmit = async () => {
    await fetch(\`/api/locations/\${location.id}\`, {
      method: 'PUT',
      body: JSON.stringify({
        lat: coordinates.lat,
        lng: coordinates.lng
      })
    });
  };

  return (
    <div>
      <UpdateLocationPicker
        initialCoordinates={location.coordinates}
        height="400px"
        onChange={setCoordinates}
      />

      <button onClick={handleSubmit}>
        Actualizar Ubicación
      </button>
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Integración con Formulario</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function LocationForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coordinates: null
  });

  const handleLocationChange = (coords) => {
    setFormData(prev => ({
      ...prev,
      coordinates: coords
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre del lugar"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          name: e.target.value
        }))}
      />

      <CreateLocationPicker
        height="300px"
        onChange={handleLocationChange}
      />

      <button
        type="submit"
        disabled={!formData.coordinates}
      >
        Guardar Lugar
      </button>
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
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Componente</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Prop</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Por defecto</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600" rowSpan={2}>CreateLocationPicker</td>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">height</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'400px'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Altura del contenedor del mapa</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onChange</td>
                  <td className="px-4 py-2 text-sm text-gray-600">(coordinates: {'{lat: number, lng: number}'} | null) =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Callback llamado cuando cambian las coordenadas</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600" rowSpan={3}>UpdateLocationPicker</td>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">initialCoordinates</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{'{lat: number, lng: number}'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Coordenadas iniciales para mostrar en el mapa</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">height</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">'400px'</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Altura del contenedor del mapa</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onChange</td>
                  <td className="px-4 py-2 text-sm text-gray-600">(coordinates: {'{lat: number, lng: number}'} | null) =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Callback llamado cuando cambian las coordenadas</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🔧 Requisitos Técnicos</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>React Leaflet:</strong> npm install react-leaflet leaflet</li>
                <li><strong>Leaflet CSS:</strong> import 'leaflet/dist/leaflet.css'</li>
                <li><strong>Material Symbols:</strong> Fuente de iconos del proyecto</li>
                <li><strong>Next.js:</strong> Carga dinámica para evitar errores de SSR</li>
                <li><strong>Geolocalización:</strong> Permisos del navegador requeridos</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">⚡ Características Técnicas</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Geolocalización múltiple:</strong> Navegador → Sistema → Defecto</li>
                <li><strong>Precisión configurable:</strong> enableHighAccuracy: true</li>
                <li><strong>Timeout inteligente:</strong> 15 segundos máximo</li>
                <li><strong>Cache de ubicación:</strong> maximumAge: 5 minutos</li>
                <li><strong>Marcadores personalizados:</strong> Iconos de Material Symbols</li>
                <li><strong>Controles de zoom:</strong> Posicionados en esquina superior derecha</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-800 mb-2">🎯 Mejores Prácticas</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li><strong>Permisos:</strong> Explica por qué necesitas la ubicación</li>
                <li><strong>Fallback:</strong> Siempre proporciona ubicación por defecto</li>
                <li><strong>Validación:</strong> Verifica coordenadas antes de enviar</li>
                <li><strong>Performance:</strong> Usa carga dinámica para mapas</li>
                <li><strong>UX:</strong> Muestra indicadores de carga durante geolocalización</li>
                <li><strong>Accesibilidad:</strong> Proporciona alternativas sin mapa</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
