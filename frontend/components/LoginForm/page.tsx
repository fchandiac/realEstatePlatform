'use client'
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import Link from 'next/link';

export default function LoginFormShowcase() {
  const [loginAttempts, setLoginAttempts] = useState<Array<{username: string, success: boolean, timestamp: Date}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Demo credentials
    const isValid = (username === 'admin' && password === 'admin123') ||
                   (username === 'operator' && password === 'op123') ||
                   (username === 'demo' && password === 'demo123');

    setLoginAttempts(prev => [{
      username,
      success: isValid,
      timestamp: new Date()
    }, ...prev.slice(0, 4)]); // Keep last 5 attempts

    setIsLoading(false);

    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    // Simulate successful login
    console.log('Login successful:', { username, role: getRoleFromUsername(username) });
  };

  const getRoleFromUsername = (username: string) => {
    if (username === 'admin') return 'admin';
    if (username === 'operator') return 'operator';
    return 'user';
  };

  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'Administrador', description: 'Acceso completo al sistema' },
    { username: 'operator', password: 'op123', role: 'Operador', description: 'Acceso a operaciones diarias' },
    { username: 'demo', password: 'demo123', role: 'Usuario Demo', description: 'Acceso limitado para demostración' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">LoginForm Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Formulario de autenticación completo con integración NextAuth,
            validación de campos, manejo de errores y redirección basada en roles.
            Incluye toggle de visibilidad de contraseña y estados de carga.
          </p>
        </div>

        {/* Demo Toggle */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Demo Interactivo</h2>
              <p className="text-gray-600">
                Prueba el formulario con credenciales de demostración o explora las características estáticas.
              </p>
            </div>
            <button
              onClick={() => setShowDemo(!showDemo)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                showDemo
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showDemo ? 'Ocultar Demo' : 'Mostrar Demo'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form Demo */}
          <div className="space-y-6">
            {showDemo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Formulario de Login</h2>

                <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-lg p-8">
                  <LoginForm
                    onLogin={handleLogin}
                    loading={isLoading}
                    onRegister={() => alert('Función de registro (demo)')}
                  />
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-3">Credenciales de Demostración:</h3>
                  <div className="space-y-2">
                    {demoCredentials.map((cred) => (
                      <div key={cred.username} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-mono bg-yellow-100 px-2 py-1 rounded text-yellow-900">
                            {cred.username}
                          </span>
                          <span className="text-yellow-700 ml-2">•</span>
                          <span className="font-mono bg-yellow-100 px-2 py-1 rounded text-yellow-900 ml-2">
                            {cred.password}
                          </span>
                        </div>
                        <div className="text-yellow-700 text-xs">
                          {cred.role}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-yellow-700 mt-2">
                    * Estas credenciales son solo para demostración
                  </p>
                </div>
              </div>
            )}

            {/* Login Attempts History */}
            {showDemo && loginAttempts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Intentos</h3>
                <div className="space-y-3">
                  {loginAttempts.map((attempt, index) => (
                    <div key={index} className={`p-3 rounded-lg flex items-center justify-between ${
                      attempt.success ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          attempt.success ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900">{attempt.username}</div>
                          <div className="text-sm text-gray-500">
                            {attempt.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${
                        attempt.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {attempt.success ? 'Éxito' : 'Falló'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Static Examples */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos Estáticos</h2>

              {/* Default State */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Estado Normal</h3>
                <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-lg p-8 max-w-sm mx-auto">
                  <div className="w-full max-w-sm mx-auto rounded-lg p-6 flex flex-col gap-4 backdrop-blur-sm"
                       style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 33%, rgba(255,255,255,0.4) 100%)' }}>
                    <div className="flex flex-col items-center mb-2">
                      <div className="w-[180px] h-[180px] bg-gray-300 rounded-full mb-6 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">Logo</span>
                      </div>
                      <div className="mb-6 text-center">
                        <div className="text-xl font-bold text-white">DSPM-App</div>
                        <div className="text-sm opacity-70 text-white">v1.0.0-alpha.1</div>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-2 text-white">Iniciar sesión</h2>
                    <div className="flex flex-col gap-3">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Nombre de usuario</label>
                        <input
                          type="text"
                          placeholder="Nombre de usuario"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/90 backdrop-blur-sm"
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Contraseña</label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="Contraseña"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md bg-white/90 backdrop-blur-sm"
                            disabled
                          />
                          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            👁️
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-2"
                      disabled
                    >
                      Ingresar
                    </button>
                    <button
                      type="button"
                      className="w-full text-white hover:text-blue-200 transition-colors"
                      disabled
                    >
                      ¿No tienes cuenta? Regístrate
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Estado de Carga</h3>
                <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-lg p-8 max-w-sm mx-auto">
                  <div className="w-full max-w-sm mx-auto rounded-lg p-6 flex flex-col gap-4 backdrop-blur-sm"
                       style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 33%, rgba(255,255,255,0.4) 100%)' }}>
                    <div className="flex flex-col items-center mb-2">
                      <div className="w-[180px] h-[180px] bg-gray-300 rounded-full mb-6 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">Logo</span>
                      </div>
                      <div className="mb-6 text-center">
                        <div className="text-xl font-bold text-white">DSPM-App</div>
                        <div className="text-sm opacity-70 text-white">v1.0.0-alpha.1</div>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-2 text-white">Iniciar sesión</h2>
                    <div className="flex flex-col gap-3">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Nombre de usuario</label>
                        <input
                          type="text"
                          value="usuario@ejemplo.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/90 backdrop-blur-sm"
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Contraseña</label>
                        <div className="relative">
                          <input
                            type="password"
                            value="••••••••"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md bg-white/90 backdrop-blur-sm"
                            disabled
                          />
                          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            👁️
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md opacity-75 cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                      disabled
                    >
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Ingresando...
                    </button>
                  </div>
                </div>
              </div>

              {/* Error State */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Estado con Error</h3>
                <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-lg p-8 max-w-sm mx-auto">
                  <div className="w-full max-w-sm mx-auto rounded-lg p-6 flex flex-col gap-4 backdrop-blur-sm"
                       style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 33%, rgba(255,255,255,0.4) 100%)' }}>
                    <div className="flex flex-col items-center mb-2">
                      <div className="w-[180px] h-[180px] bg-gray-300 rounded-full mb-6 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">Logo</span>
                      </div>
                      <div className="mb-6 text-center">
                        <div className="text-xl font-bold text-white">DSPM-App</div>
                        <div className="text-sm opacity-70 text-white">v1.0.0-alpha.1</div>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-2 text-white">Iniciar sesión</h2>
                    <div className="flex flex-col gap-3">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Nombre de usuario</label>
                        <input
                          type="text"
                          placeholder="Nombre de usuario"
                          className="w-full px-3 py-2 border border-red-300 rounded-md bg-white/90 backdrop-blur-sm"
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Contraseña</label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="Contraseña"
                            className="w-full px-3 py-2 pr-10 border border-red-300 rounded-md bg-white/90 backdrop-blur-sm"
                            disabled
                          />
                          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            👁️
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-red-300 text-sm text-center bg-red-900/20 p-2 rounded">
                      Error al iniciar sesión. Verifica tus credenciales.
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-2"
                      disabled
                    >
                      Ingresar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features and Usage */}
          <div className="space-y-6">
            {/* Features Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Características</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Funcionalidades Principales</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Integración completa con NextAuth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Validación de campos requeridos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Toggle para mostrar/ocultar contraseña</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Manejo de errores con mensajes descriptivos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Estados de carga con indicadores visuales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Redirección automática basada en roles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Diseño responsive con backdrop blur</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Integración con componentes Logo y Button</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Role-based Redirect */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Redirección por Roles</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Admin Role</h3>
                  <p className="text-sm text-blue-700 mb-1"><strong>Redirección:</strong> /admin</p>
                  <p className="text-sm text-blue-700">Acceso completo al panel de administración</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Operator Role</h3>
                  <p className="text-sm text-green-700 mb-1"><strong>Redirección:</strong> /operator</p>
                  <p className="text-sm text-green-700">Acceso al panel de operaciones diarias</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">User Role (Default)</h3>
                  <p className="text-sm text-purple-700 mb-1"><strong>Redirección:</strong> router.refresh()</p>
                  <p className="text-sm text-purple-700">Recarga la página actual con sesión activa</p>
                </div>
              </div>
            </div>

            {/* Usage Examples */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Uso</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Uso Básico</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import LoginForm from './components/LoginForm/LoginForm';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
      <LoginForm />
    </div>
  );
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Con Callbacks Personalizados</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function CustomLoginPage() {
  const handleLogin = async (username, password) => {
    // Lógica personalizada de autenticación
    const response = await fetch('/api/custom-auth', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Autenticación fallida');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onRegister={handleRegister}
      loading={false}
    />
  );
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">En Layout con Loading</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function LoginLayout({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 p-4">
      <LoginForm
        loading={isLoading}
        onLogin={async (username, password) => {
          setIsLoading(true);
          try {
            await customLoginLogic(username, password);
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </div>
  );
}`}
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
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Prop</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tipo</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Por defecto</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 text-sm font-mono text-blue-600">onLogin</td>
                      <td className="px-4 py-2 text-sm text-gray-600">(username: string, password: string) =&gt; Promise&lt;void&gt;</td>
                      <td className="px-4 py-2 text-sm text-gray-600">NextAuth signIn</td>
                      <td className="px-4 py-2 text-sm text-gray-600">Función personalizada para manejar el login</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 text-sm font-mono text-blue-600">onRegister</td>
                      <td className="px-4 py-2 text-sm text-gray-600">() =&gt; void</td>
                      <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                      <td className="px-4 py-2 text-sm text-gray-600">Función para manejar el registro</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-mono text-blue-600">loading</td>
                      <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                      <td className="px-4 py-2 text-sm text-gray-600">false</td>
                      <td className="px-4 py-2 text-sm text-gray-600">Estado de carga del formulario</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">🔧 Dependencias</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li><strong>NextAuth:</strong> Para autenticación</li>
                    <li><strong>Next Router:</strong> Para redirecciones</li>
                    <li><strong>TextField:</strong> Componente del proyecto</li>
                    <li><strong>Button:</strong> Componente del proyecto</li>
                    <li><strong>Logo:</strong> Componente del proyecto</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-green-800 mb-2">🎨 Características de UI</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li><strong>Backdrop Blur:</strong> Efecto de desenfoque en el fondo</li>
                    <li><strong>Gradiente:</strong> Fondo degradado azul</li>
                    <li><strong>Transiciones:</strong> Animaciones suaves</li>
                    <li><strong>Responsive:</strong> Diseño adaptable</li>
                    <li><strong>Accesibilidad:</strong> Labels y navegación por teclado</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}