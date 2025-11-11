'use client';

import React, { useState } from 'react';
import MultimediaUploader from './MultimediaUploader';

export default function MultimediaUploaderAvatarExample() {
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);

  const handleAvatarChange = (files: File[]) => {
    setAvatarFiles(files);
    console.log('Avatar files:', files);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">MultimediaUploader - Variante Avatar</h1>
        <p className="text-gray-600">Ejemplo de uso de la variante avatar para selección de un solo archivo de imagen</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4 text-center">Subir Avatar</h2>

        <MultimediaUploader
          uploadPath="/api/user/avatar"
          onChange={handleAvatarChange}
          label="Haz clic para seleccionar tu avatar"
          variant="avatar"
          accept="image/*"
          maxFiles={1}
          maxSize={2}
        />

        {avatarFiles.length > 0 && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
              <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
              <span className="text-sm text-green-800">
                Avatar seleccionado: {avatarFiles[0].name}
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          Solo imágenes • Máximo 2MB • Formato circular
        </div>
      </div>

      {/* Información técnica */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Características de la variante Avatar:</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Solo permite un archivo a la vez</li>
          <li>• Solo acepta imágenes (no videos)</li>
          <li>• Límite de tamaño: 2MB</li>
          <li>• Vista previa circular con borde</li>
          <li>• Ícono de persona cuando no hay imagen</li>
          <li>• Diseño compacto y centrado</li>
        </ul>
      </div>
    </div>
  );
}