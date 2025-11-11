'use client';

import React, { useState } from 'react';
import MultimediaUpdater from './MultimediaUpdater';

const MultimediaUpdaterExample: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    console.log('Archivo seleccionado:', file);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">MultimediaUpdater Examples</h1>

      {/* Ejemplo básico */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ejemplo Básico</h2>
        <MultimediaUpdater
          currentUrl="https://via.placeholder.com/300x300"
          currentType="image"
          onFileChange={handleFileChange}
          buttonText="Seleccionar imagen"
          acceptedTypes={['image/*']}
          maxSize={2}
        />
      </div>

      {/* Ejemplo con video */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ejemplo con Video</h2>
        <MultimediaUpdater
          currentUrl="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
          currentType="video"
          onFileChange={handleFileChange}
          buttonText="Seleccionar video"
          acceptedTypes={['video/*']}
          maxSize={10}
          aspectRatio="16:9"
        />
      </div>

      {/* Ejemplo avatar */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ejemplo Avatar (estilo AdminCard)</h2>
        <MultimediaUpdater
          currentUrl="/api/placeholder-avatar.jpg"
          currentType="image"
          onFileChange={handleFileChange}
          buttonText="Cambiar avatar"
          acceptedTypes={['image/*']}
          maxSize={1}
          variant="avatar"
        />
        <p className="text-sm text-gray-600 mt-2">
          Estilos: w-24 h-24, rounded-full, border-4 border-secondary, bg-neutral-100, icono person
        </p>
      </div>

      {/* Ejemplo con drag & drop */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ejemplo con Drag & Drop</h2>
        <MultimediaUpdater
          onFileChange={handleFileChange}
          buttonText="Seleccionar o arrastrar archivo"
          acceptedTypes={['image/*', 'video/*']}
          maxSize={5}
          allowDragDrop={true}
          aspectRatio="1:1"
        />
      </div>

      {/* Estado del archivo seleccionado */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold">Archivo seleccionado:</h3>
        {selectedFile ? (
          <div>
            <p>Nombre: {selectedFile.name}</p>
            <p>Tipo: {selectedFile.type}</p>
            <p>Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <p>Ningún archivo seleccionado</p>
        )}
      </div>
    </div>
  );
};

export default MultimediaUpdaterExample;