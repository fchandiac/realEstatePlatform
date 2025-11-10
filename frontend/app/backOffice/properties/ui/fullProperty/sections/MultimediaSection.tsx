'use client';

import React, { useState, useRef } from 'react';
import { MultimediaPropertyCard } from '../components';
import type { MultimediaSectionProps } from '../types/property.types';
import { Button } from '@/components/Button/Button';
import IconButton from '@/components/IconButton/IconButton';
import Alert from '@/components/Alert/Alert';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { uploadPropertyMultimedia } from '@/app/actions/properties';
import { revalidatePath } from 'next/cache';

export default function MultimediaSection({ property }: MultimediaSectionProps) {
  const [localMainImageUrl, setLocalMainImageUrl] = useState(property.mainImageUrl);
  const [multimedia, setMultimedia] = useState(property.multimedia || []);
  const [selectedFiles, setSelectedFiles] = useState<Array<{ file: File; url: string }>>([]);
  const createdUrlsRef = React.useRef<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageUpdate = (newMainImageUrl: string) => {
    setLocalMainImageUrl(newMainImageUrl);
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
      setAlert({ type: 'error', message: 'Por favor selecciona al menos un archivo' });
      return;
    }

    setUploading(true);
  try {
  // send raw File objects to the upload action
  const filesToUpload = selectedFiles.map(s => s.file);
  const result = await uploadPropertyMultimedia(property.id, filesToUpload as File[]);

      if (!result.success) {
        setAlert({ type: 'error', message: result.error || 'Error al subir multimedia' });
        setUploading(false);
        return;
      }

      // Update the multimedia list with the new items
      // Backend may return { message, data: [...] } or return an array directly
      if (Array.isArray(result.data?.data)) {
        setMultimedia(prev => [...prev, ...result.data.data]);
      } else if (Array.isArray(result.data)) {
        setMultimedia(prev => [...prev, ...result.data]);
      } else if (Array.isArray(result)) {
        setMultimedia(prev => [...prev, ...result]);
      }

  // revoke object URLs tracked
  createdUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
  createdUrlsRef.current = [];
  setSelectedFiles([]);
      setAlert({ type: 'success', message: 'Multimedia subida exitosamente' });
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Error desconocido' 
      });
    } finally {
      setUploading(false);
    }
  };

  // cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
      createdUrlsRef.current = [];
    };
    // we intentionally omit deps to only run on unmount
     
  }, []);

  return (
    <div className="space-y-6">
      {/* Multimedia Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Multimedia ({multimedia.length})
        </h2>

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
                multimediaId={item.id}
                propertyId={property.id}
                mainImageUrl={localMainImageUrl}
                onUpdate={handleMainImageUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Divisor */}
      <div className="border-t border-border my-6" />

      {/* Alert */}
      {alert && (
        <Alert 
          variant={alert.type} 
          className={alert.type === 'error' ? 'alert-error' : alert.type === 'success' ? 'alert-success' : 'alert-info'}
        >
          {alert.message}
        </Alert>
      )}

      {/* Upload Section */}
      <div className="space-y-4">
        {/* Row 1: Plus Icon Button */}
        <div>
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

        {/* Row 2: Selected Files Preview */}
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
                    {/* Preview thumbnail */}
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

        {/* Row 3: Upload Button */}
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
