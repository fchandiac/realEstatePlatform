'use client';

import React, { useState, useRef } from 'react';
import { MultimediaPropertyCard } from '../components';
import type { MultimediaSectionProps } from '../types/property.types';
import { Button } from '@/components/Button/Button';
import IconButton from '@/components/IconButton/IconButton';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { uploadPropertyMultimedia } from '@/app/actions/properties';
import { deleteMultimedia } from '@/app/actions/multimedia';
import { useAlert } from '@/app/contexts/AlertContext';

export default function MultimediaSection({ property }: MultimediaSectionProps) {
  const [localMainImageUrl, setLocalMainImageUrl] = useState(property.mainImageUrl);
  const [multimedia, setMultimedia] = useState(property.multimedia || []);
  const [selectedFiles, setSelectedFiles] = useState<Array<{ file: File; url: string }>>([]);
  const createdUrlsRef = React.useRef<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { success, error: showError } = useAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageUpdate = (newMainImageUrl: string) => {
    setLocalMainImageUrl(newMainImageUrl);
  };

  const handleDeleteMultimedia = async (multimediaId: string) => {
    setDeletingId(multimediaId);
    try {
      const result = await deleteMultimedia(multimediaId);
      if (!result.success) {
        showError(result.error || 'Error al eliminar el archivo.');
      } else {
        setMultimedia(prev => prev.filter(m => m.id !== multimediaId));
        success('Archivo eliminado correctamente.');
        const deletedItem = multimedia.find(m => m.id === multimediaId);
        if (deletedItem && localMainImageUrl && deletedItem.url === localMainImageUrl) {
          setLocalMainImageUrl(undefined);
        }
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error desconocido.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddMultimediaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      const fileArray = Array.from(files);
      const mapped = fileArray.map((f) => {
        const u = URL.createObjectURL(f);
        createdUrlsRef.current.push(u);
        return { file: f, url: u };
      });
      setSelectedFiles((prev) => [...prev, ...mapped]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const item = prev[index];
      if (item?.url) {
        URL.revokeObjectURL(item.url);
        createdUrlsRef.current = createdUrlsRef.current.filter(u => u !== item.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUploadMultimedia = async () => {
    if (selectedFiles.length === 0) {
      showError('Por favor selecciona al menos un archivo');
      return;
    }

    setUploading(true);
    try {
      const filesToUpload = selectedFiles.map(s => s.file);
      const result = await uploadPropertyMultimedia(property.id, filesToUpload);

      if (!result.success) {
        showError(result.error || 'Error al subir multimedia');
        setUploading(false);
        return;
      }

      if (Array.isArray(result.data)) {
        setMultimedia(prev => [...prev, ...result.data]);
      }

      createdUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
      createdUrlsRef.current = [];
      setSelectedFiles([]);
      success('Multimedia subida exitosamente');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
      createdUrlsRef.current = [];
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Multimedia ({multimedia.length})
          </h2>
          <IconButton
            icon="add"
            onClick={handleAddMultimediaClick}
            disabled={uploading}
            variant="containedSecondary"
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </div>
       

        {multimedia.length === 0 ? (
          <div className="flex items-center justify-center h-48 rounded-lg border border-dashed border-border bg-neutral/50">
            <div className="text-center text-muted-foreground">
              <span className="material-symbols-outlined text-4xl mb-2 block">image</span>
              <p className="text-sm">No hay multimedia asociada a esta propiedad</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {multimedia.map((item) => (
              <MultimediaPropertyCard
                key={item.id}
                multimediaItem={item}
                propertyId={property.id}
                mainImageUrl={localMainImageUrl}
                isDeleting={deletingId === item.id}
                onSetMain={handleMainImageUpdate}
                onDelete={handleDeleteMultimedia}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border my-6" />

      <div className="space-y-4">
      

        {selectedFiles.length > 0 && (
          <div className="bg-neutral/50 rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Archivos seleccionados ({selectedFiles.length})
            </h3>
            <div className="space-y-2">
              {selectedFiles.map((item, index) => {
                const file = item.file;
                const url = item.url;
                return (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-white rounded p-2 border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {file.type.startsWith('image/') ? (
                      <img src={url} alt={file.name} className="w-16 h-10 object-cover rounded" />
                    ) : (
                      <video src={url} className="w-16 h-10 object-cover rounded" muted playsInline />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <IconButton
                    icon="close"
                    variant="containedSecondary"
                    onClick={() => handleRemoveFile(index)}
                    className="shrink-0"
                  />
                </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedFiles.length > 0 && (
          <Button
            variant="primary"
            onClick={handleUploadMultimedia}
            disabled={uploading}
            className="flex items-center justify-center gap-2 w-full"
          >
            {uploading ? (
              <>
                <CircularProgress size={20} />
                Subiendo...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">upload</span>
                Añadir multimedia
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}