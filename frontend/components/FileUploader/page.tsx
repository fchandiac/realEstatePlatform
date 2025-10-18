'use client'
import React, { useState } from 'react';
import FileImageUploader from './FileImageUploader';
import Link from 'next/link';

export default function FileUploaderShowcase() {
  const [basicFiles, setBasicFiles] = useState<File[]>([]);
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [customPathFiles, setCustomPathFiles] = useState<File[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FileImageUploader Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Componente avanzado para subir imágenes con previews en tiempo real,
            selección múltiple, eliminación individual y validación automática.
            Perfecto para formularios que requieren carga de imágenes.
          </p>
        </div>

        {/* Basic FileImageUploader Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">FileImageUploader Básico</h2>
          <div className="max-w-2xl">
            <FileImageUploader
              uploadPath="/uploads/images"
              onChange={setBasicFiles}
              label="Selecciona imágenes para subir"
              maxFiles={5}
            />

            {basicFiles.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Archivos seleccionados:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {basicFiles.map((file, index) => (
                    <li key={index}>
                      {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Single File Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Subida de Archivo Único</h2>
          <div className="max-w-2xl">
            <FileImageUploader
              uploadPath="/uploads/avatars"
              onChange={setSingleFile}
              label="Selecciona una imagen de perfil"
              maxFiles={1}
            />

            {singleFile.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Imagen de perfil seleccionada:</h3>
                <p className="text-sm text-green-800">
                  {singleFile[0].name} - {(singleFile[0].size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <p className="mt-4 text-sm text-gray-600">
              Configurado para aceptar solo 1 archivo máximo. Útil para avatares o imágenes de perfil.
            </p>
          </div>
        </div>

        {/* Multiple Files with Custom Path Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Múltiples Archivos con Ruta Personalizada</h2>
          <div className="max-w-2xl">
            <FileImageUploader
              uploadPath="/uploads/gallery/images"
              onChange={setMultipleFiles}
              label="Sube imágenes para la galería"
              maxFiles={10}
            />

            {multipleFiles.length > 0 && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">
                  Galería: {multipleFiles.length} imágenes seleccionadas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-purple-800">
                  {multipleFiles.map((file, index) => (
                    <div key={index} className="bg-purple-100 p-2 rounded">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-4 text-sm text-gray-600">
              Configurado para hasta 10 archivos. Las imágenes se subirán a <code className="bg-gray-100 px-1 rounded">/uploads/gallery/images</code>.
            </p>
          </div>
        </div>

        {/* Custom Path Example Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplo con Ruta Personalizada</h2>
          <div className="max-w-2xl">
            <FileImageUploader
              uploadPath="/api/uploads/documents/scans"
              onChange={setCustomPathFiles}
              label="Sube documentos escaneados"
              maxFiles={3}
            />

            {customPathFiles.length > 0 && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">Documentos listos para subir:</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  {customPathFiles.map((file, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{file.name}</span>
                      <span>{(file.size / 1024).toFixed(0)} KB</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-4 text-sm text-gray-600">
              Ruta de API personalizada para integración con servicios backend específicos.
            </p>
          </div>
        </div>

        {/* Features Overview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Características del Componente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Funcionalidades Principales</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Previews de imágenes en tiempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Selección múltiple de archivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Eliminación individual de archivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Límite configurable de archivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Prevención de archivos duplicados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Layout responsivo con grid</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Casos de Uso</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📷</span>
                  <span>Galerías de imágenes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">👤</span>
                  <span>Avatares y fotos de perfil</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📄</span>
                  <span>Documentos escaneados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🏢</span>
                  <span>Imágenes de productos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🎨</span>
                  <span>Portafolios creativos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📊</span>
                  <span>Reportes con imágenes</span>
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
{`import FileImageUploader from './components/FileUploader/FileImageUploader';

function ImageUploadForm() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileImageUploader
      uploadPath="/uploads/images"
      onChange={setFiles}
      label="Selecciona imágenes"
      maxFiles={5}
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Avatar Upload</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<FileImageUploader
  uploadPath="/uploads/avatars"
  onChange={setAvatar}
  label="Selecciona imagen de perfil"
  maxFiles={1}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Galería de Imágenes</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<FileImageUploader
  uploadPath="/api/gallery/upload"
  onChange={setGalleryImages}
  label="Sube imágenes para la galería"
  maxFiles={20}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Con Manejo de Estado</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`function ProductForm() {
  const [productImages, setProductImages] = useState<File[]>([]);

  const handleSubmit = async () => {
    const formData = new FormData();
    productImages.forEach((file, index) => {
      formData.append(\`image_\${index}\`, file);
    });

    // Enviar a API
    await fetch('/api/products', {
      method: 'POST',
      body: formData
    });
  };

  return (
    <div>
      <FileImageUploader
        uploadPath="/uploads/products"
        onChange={setProductImages}
        maxFiles={5}
      />

      <button onClick={handleSubmit}>
        Crear Producto
      </button>
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
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">uploadPath</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Ruta donde se guardarán los archivos en el backend</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onChange</td>
                  <td className="px-4 py-2 text-sm text-gray-600">(files: File[]) =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Callback llamado cuando cambian los archivos seleccionados</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">label</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&quot;Selecciona imágenes&quot;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Texto del label del input file</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">accept</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&quot;image/*&quot;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Tipos de archivo aceptados (atributo accept del input)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">maxFiles</td>
                  <td className="px-4 py-2 text-sm text-gray-600">number</td>
                  <td className="px-4 py-2 text-sm text-gray-600">5</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Número máximo de archivos que se pueden seleccionar</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🔧 Funcionalidades Técnicas</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Object URLs:</strong> Usa URL.createObjectURL() para previews eficientes</li>
                <li><strong>Deduplicación:</strong> Evita archivos duplicados por nombre y tamaño</li>
                <li><strong>Memory management:</strong> Los URLs se liberan automáticamente al cambiar archivos</li>
                <li><strong>Responsive grid:</strong> Layout adaptable con CSS Grid</li>
                <li><strong>Accessibility:</strong> Labels apropiados y navegación por teclado</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">📁 Consideraciones de Backend</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Multipart form data:</strong> El backend debe manejar FormData con archivos</li>
                <li><strong>File validation:</strong> Validar tipos, tamaños y contenido en el servidor</li>
                <li><strong>Storage:</strong> Implementar estrategia de almacenamiento (local, cloud, etc.)</li>
                <li><strong>Security:</strong> Escanear archivos en busca de malware</li>
                <li><strong>Naming:</strong> Generar nombres únicos para evitar conflictos</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-800 mb-2">🎨 Personalización</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li><strong>Custom accept:</strong> Cambiar tipos de archivo aceptados</li>
                <li><strong>Styling:</strong> Personalizar apariencia con CSS/Tailwind</li>
                <li><strong>Validation:</strong> Agregar validación adicional de archivos</li>
                <li><strong>Drag & drop:</strong> Extender con funcionalidad de arrastrar y soltar</li>
                <li><strong>Progress bars:</strong> Agregar indicadores de progreso de subida</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
