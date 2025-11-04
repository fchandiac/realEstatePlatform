'use client';

import { useState } from 'react';
import IconButton from '@/components/IconButton/IconButton';
import MultimediaGallery from '@/components/FileUploader/MultimediaGallery';
import { env } from '@/lib/env';
import type { MultimediaSectionProps } from '../types/property.types';
import { getAbsoluteUrl } from '../utils/formatters';

export default function MultimediaSection({ property, onChange }: MultimediaSectionProps) {
  const [newFiles, setNewFiles] = useState<any[]>([]);

  // Combinar archivos existentes con archivos nuevos
  const allMultimedia = [
    ...(property.multimedia || []),
    ...newFiles
  ];

  const handleNewFilesChange = (files: any[]) => {
    console.log('Nuevos archivos multimedia seleccionados:', files);

    // Convertir archivos del MultimediaGallery al formato esperado
    const formattedFiles = files.map((fileData: any) => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      filename: fileData.file.name,
      url: fileData.preview, // URL temporal para preview
      format: fileData.type === 'image' ? 'IMG' : 'VIDEO',
      type: fileData.type === 'image' ? 'PROPERTY_IMG' : 'VIDEO',
      fileSize: fileData.file.size,
      uploadedAt: new Date().toISOString(),
      isNew: true, // Marcar como archivo nuevo
      fileData: fileData // Guardar referencia al archivo original
    }));

    setNewFiles(formattedFiles);
  };

  const handleRemoveMedia = (index: number) => {
    const mediaToRemove = allMultimedia[index];

    if (mediaToRemove.isNew) {
      // Es un archivo nuevo, remover del estado local
      if (window.confirm('¿Estás seguro de que quieres eliminar este archivo nuevo?')) {
        const updatedNewFiles = newFiles.filter((_, i) =>
          allMultimedia.findIndex(m => m.id === newFiles[i].id) !== index
        );
        setNewFiles(updatedNewFiles);
      }
    } else {
      // Es un archivo existente, remover de la propiedad
      if (window.confirm('¿Estás seguro de que quieres eliminar este archivo multimedia existente?')) {
        const updatedMultimedia = property.multimedia?.filter((_, i) => i !== index) || [];
        onChange('multimedia', updatedMultimedia);
      }
    }
  };

  const handlePreviewMedia = (index: number) => {
    const media = allMultimedia[index];

    if (media.isNew) {
      // Para archivos nuevos, abrir preview directo
      window.open(media.url, '_blank');
    } else {
      // Para archivos existentes, usar la URL completa
      window.open(getAbsoluteUrl(media.url, env.backendApiUrl), '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con contador total */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Multimedia de la Propiedad</h3>
        <div className="text-sm text-muted-foreground">
          {allMultimedia.length} archivo{allMultimedia.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Galería unificada de multimedia */}
      {allMultimedia.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-semibold">Archivos Multimedia</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allMultimedia.map((media, index) => (
              <div key={media.id || index} className="relative group border border-border rounded-lg overflow-hidden">
                {/* Mostrar imagen o video */}
                {media.format === 'IMG' || media.type === 'PROPERTY_IMG' ? (
                  <img
                    src={media.isNew ? media.url : getAbsoluteUrl(media.url, env.backendApiUrl)}
                    alt={media.filename || `Media ${index + 1}`}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      if (!media.isNew) {
                        console.error('Error loading image:', getAbsoluteUrl(media.url, env.backendApiUrl));
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                      }
                    }}
                  />
                ) : media.type === 'VIDEO' ? (
                  <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-2xl text-muted-foreground mb-1">videocam</span>
                      <p className="text-xs text-muted-foreground">Video</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-2xl text-muted-foreground mb-1">insert_drive_file</span>
                      <p className="text-xs text-muted-foreground">{media.format || 'Archivo'}</p>
                    </div>
                  </div>
                )}

                {/* Badge para archivos nuevos */}
                {media.isNew && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Nuevo
                  </div>
                )}

                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                    <IconButton
                      icon="visibility"
                      variant="text"
                      className="text-white bg-black/50 hover:bg-black/70"
                      onClick={() => handlePreviewMedia(index)}
                      aria-label="Ver multimedia"
                    />

                    <IconButton
                      icon="delete"
                      variant="text"
                      className="text-white bg-red-500/80 hover:bg-red-600"
                      onClick={() => handleRemoveMedia(index)}
                      aria-label="Eliminar multimedia"
                    />
                  </div>
                </div>

                {/* Información del archivo */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                  <p className="text-xs truncate" title={media.filename}>
                    {media.filename}
                  </p>
                  {media.fileSize && (
                    <p className="text-xs opacity-75">
                      {(media.fileSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <span className="material-symbols-outlined text-4xl mb-2">photo_library</span>
          <p>No hay archivos multimedia asociados a esta propiedad</p>
        </div>
      )}

      {/* Sección para agregar nueva multimedia */}
      <div className="border-t pt-6">
        <h4 className="font-semibold mb-3">Agregar Nueva Multimedia</h4>
        <MultimediaGallery
          uploadPath="/uploads/properties"
          onChange={handleNewFilesChange}
          maxFiles={20}
          label="Selecciona archivos multimedia"
        />
      </div>
    </div>
  );
}
