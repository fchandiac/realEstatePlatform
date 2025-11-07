'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button/Button';
import IconButton from '@/components/IconButton/IconButton';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import Alert from '@/components/Alert/Alert';
import { updateMainImage, uploadPropertyMultimedia } from '@/app/actions/properties';
import type { MultimediaSectionProps } from '../types/property.types';
import { MultimediaPropertyCard } from '../components';
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect';

export default function MultimediaSection({ property, onChange }: MultimediaSectionProps) {
  const [pendingMultimedia, setPendingMultimedia] = useState<File[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { handleAuthError } = useAuthRedirect();

  const handleSetMainImage = async (mediaUrl: string) => {
    try {
      const result = await updateMainImage(property.id, mediaUrl);

      if (result.success) {
        onChange('mainImageUrl', mediaUrl);
        setUpdateMessage({ type: 'success', message: 'Multimedia principal actualizada' });
        setTimeout(() => setUpdateMessage(null), 3000);
      } else {
        // Verificar si es error de autenticación
        if (handleAuthError(result.error || 'Error desconocido')) {
          return; // Ya se redirigió, no mostrar mensaje
        }

        setUpdateMessage({ type: 'error', message: result.error || 'Error al actualizar multimedia principal' });
      }
    } catch (error) {
      // Verificar si es error de autenticación
      if (handleAuthError('Error inesperado')) {
        return; // Ya se redirigió, no mostrar mensaje
      }

      setUpdateMessage({ type: 'error', message: 'Error inesperado' });
    }
  };

  const handleAddMultimedia = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      setPendingMultimedia(prev => [...prev, ...files]);
    };
    input.click();
  };

  const handleRemovePending = (index: number) => {
    setPendingMultimedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMultimedia = async () => {
    if (pendingMultimedia.length === 0) return;

    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const result = await uploadPropertyMultimedia(property.id, pendingMultimedia);

      if (result.success) {
        // Actualizar la propiedad con los nuevos archivos
        onChange('multimedia', [...(property.multimedia || []), ...result.data]);
        setPendingMultimedia([]);
        setUpdateMessage({ type: 'success', message: 'Multimedia actualizada correctamente' });
        setTimeout(() => setUpdateMessage(null), 3000);
      } else {
        // Verificar si es error de autenticación
        if (handleAuthError(result.error || 'Error desconocido')) {
          return; // Ya se redirigió, no mostrar mensaje
        }

        setUpdateMessage({ type: 'error', message: result.error || 'Error al actualizar multimedia' });
      }
    } catch (error) {
      // Verificar si es error de autenticación
      if (handleAuthError('Error inesperado al actualizar multimedia')) {
        return; // Ya se redirigió, no mostrar mensaje
      }

      setUpdateMessage({ type: 'error', message: 'Error inesperado al actualizar multimedia' });
    } finally {
      setIsUpdating(false);
    }
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return '/placeholder-video.png'; // Placeholder para videos
  };

  return (
    <div className="space-y-6">
      {/* Título de la sección */}
      <h3 className="text-lg font-semibold">Multimedia de la Propiedad</h3>

      {/* Galería de multimedia existente */}
      {property.multimedia && property.multimedia.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {property.multimedia.map((media) => (
            <MultimediaPropertyCard
              key={media.id}
              multimediaId={media.id}
              propertyId={property.id}
              isMain={media.url === property.mainImageUrl}
              onMainChange={(newMainUrl: string) => onChange('mainImageUrl', newMainUrl)}
              onDelete={(deletedId: string) => {
                // Actualizar la lista de multimedia removiendo el elemento eliminado
                const updatedMultimedia = property.multimedia?.filter(m => m.id !== deletedId) || [];
                onChange('multimedia', updatedMultimedia);
                
                // Si la multimedia eliminada era la principal, limpiar mainImageUrl
                if (media.url === property.mainImageUrl) {
                  onChange('mainImageUrl', null);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <span className="material-symbols-outlined text-4xl mb-2">photo_library</span>
          <p>No hay archivos multimedia asociados a esta propiedad</p>
        </div>
      )}

      {/* Sección de opciones - Agregar multimedia */}
      <div className="border-t pt-4">
        <div className="flex justify-end mb-4">
          <IconButton
            icon="add"
            variant="containedSecondary"
            onClick={handleAddMultimedia}
          />
        </div>

        {/* Lista de multimedia pendiente */}
        {pendingMultimedia.length > 0 && (
          <div className="space-y-2 mb-4">
            {pendingMultimedia.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white border border-secondary border-l-4 border-l-secondary rounded-lg">
                {/* Preview pequeño */}
                <div className="w-12 h-12 bg-background rounded overflow-hidden flex-shrink-0">
                  {file.type.startsWith('image/') ? (
                    <Image
                      src={getFilePreview(file)}
                      alt={file.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      {/* Sin ícono, solo placeholder vacío */}
                    </div>
                  )}
                </div>

                {/* Información del archivo */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Botón eliminar */}
                <IconButton
                  icon="delete"
                  variant="text"
                  size="sm"
                  onClick={() => handleRemovePending(index)}
                />
              </div>
            ))}

            {/* Botón de subir multimedia - solo visible cuando hay archivos */}
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleUpdateMultimedia}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <CircularProgress size={16} thickness={2} className="mr-2" />
                    Subiendo...
                  </>
                ) : (
                  'Subir contenido multimedia'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
