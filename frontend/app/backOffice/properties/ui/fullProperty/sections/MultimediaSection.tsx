'use client';

import IconButton from '@/components/IconButton/IconButton';
import MultimediaGallery from '@/components/FileUploader/MultimediaGallery';
import { env } from '@/lib/env';
import type { MultimediaSectionProps } from '../types/property.types';
import { getAbsoluteUrl } from '../utils/formatters';

export default function MultimediaSection({ property, onChange }: MultimediaSectionProps) {
  
  const handleAddFiles = () => {
    const fileInput = document.getElementById('multimedia-file-input') as HTMLInputElement;
    fileInput?.click();
  };

  const handleFilesChange = (files: any[]) => {
    console.log('Archivos multimedia seleccionados:', files);
    
    // Agregar nuevos archivos a la multimedia existente
    const existingMedia = property.multimedia || [];
    const newMedia = files.map((file: any) => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      filename: file.name,
      url: URL.createObjectURL(file),
      format: file.type.startsWith('image/') ? 'IMG' : 'VIDEO',
      type: file.type.startsWith('image/') ? 'PROPERTY_IMG' : 'VIDEO',
      fileSize: file.size,
      uploadedAt: new Date().toISOString()
    }));
    
    onChange('multimedia', [...existingMedia, ...newMedia]);
  };

  const handleRemoveMedia = (index: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este archivo multimedia?')) {
      const updatedMultimedia = property.multimedia?.filter((_, i) => i !== index) || [];
      onChange('multimedia', updatedMultimedia);
    }
  };

  const handlePreviewMedia = (url: string) => {
    window.open(getAbsoluteUrl(url, env.backendApiUrl), '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div>
        {/* Botón para agregar */}
        <div className="flex items-center gap-3 mb-4">
          <IconButton
            icon="add"
            variant="containedSecondary"
            onClick={handleAddFiles}
            aria-label="Agregar multimedia"
            style={{
              borderRadius: '50%',
              minWidth: 40,
              minHeight: 40,
              width: 40,
              height: 40
            }}
          />
          <span className="text-sm text-muted-foreground">Agregar archivos multimedia</span>
        </div>
        
        {/* Multimedia existente */}
        {property.multimedia && property.multimedia.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3">
              Multimedia Existente ({property.multimedia.length} archivos)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {property.multimedia.map((media, index) => (
                <div key={media.id || index} className="relative group border border-border rounded-lg overflow-hidden">
                  {/* Mostrar imagen o video */}
                  {media.format === 'IMG' || media.type === 'PROPERTY_IMG' ? (
                    <img
                      src={getAbsoluteUrl(media.url, env.backendApiUrl)}
                      alt={media.filename || `Media ${index + 1}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        console.error('Error loading image:', getAbsoluteUrl(media.url, env.backendApiUrl));
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
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
                  
                  {/* Overlay con acciones */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                      <IconButton
                        icon="visibility"
                        variant="text"
                        className="text-white bg-black/50 hover:bg-black/70"
                        onClick={() => handlePreviewMedia(media.url)}
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
        )}
        
        {/* Si no hay multimedia existente */}
        {(!property.multimedia || property.multimedia.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <span className="material-symbols-outlined text-4xl mb-2">photo_library</span>
            <p>No hay archivos multimedia asociados a esta propiedad</p>
          </div>
        )}
        
        {/* Componente para agregar nueva multimedia */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Agregar Nueva Multimedia</h4>
          <MultimediaGallery
            uploadPath="/uploads/properties"
            onChange={handleFilesChange}
            maxFiles={20}
          />
        </div>
      </div>
    </div>
  );
}
