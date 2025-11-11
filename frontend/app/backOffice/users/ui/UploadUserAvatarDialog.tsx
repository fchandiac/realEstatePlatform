'use client';

import React, { useState, useRef } from 'react';
import Dialog from '@/components/Dialog/Dialog';
import { Button } from '@/components/Button/Button';
import { useAlert } from '@/app/contexts/AlertContext';
import { updateUserAvatar } from '@/app/actions/users';

interface UploadUserAvatarDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  currentAvatarUrl?: string;
}

const UploadUserAvatarDialog: React.FC<UploadUserAvatarDialogProps> = ({
  open,
  onClose,
  userId,
  currentAvatarUrl,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useAlert();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        error('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        error('La imagen no puede ser mayor a 5MB');
        return;
      }

      setSelectedFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      error('Por favor selecciona una imagen primero');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const result = await updateUserAvatar(userId, formData);

      if (result.success) {
        success('Avatar actualizado exitosamente');
        onClose();
        // Limpiar estado
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        error(result.error || 'Error al actualizar el avatar');
      }
    } catch (err) {
      console.error('Upload error:', err);
      error('Error al actualizar el avatar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Limpiar estado
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Actualizar Avatar"
      size="sm"
      actions={
        <div className="flex justify-between gap-3">
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cerrar
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-6">
        {/* Preview del avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-neutral-100 border-4 border-secondary flex items-center justify-center overflow-hidden">
              {displayUrl ? (
                <img
                  src={displayUrl}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '3rem' }}>
                  person
                </span>
              )}
            </div>
         
          </div>

          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-2">
              {selectedFile
                ? `Archivo seleccionado: ${selectedFile.name}`
                : 'Selecciona una imagen para tu avatar'
              }
            </p>
            <p className="text-xs text-neutral-500">
              Formatos permitidos: JPEG, PNG, WebP (máx. 5MB)
            </p>
          </div>
        </div>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Botón para seleccionar archivo */}
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full"
        >
          <span className="material-symbols-outlined mr-2" style={{ fontSize: '1.2rem' }}>
            upload
          </span>
          Seleccionar Imagen
        </Button>
      </div>
    </Dialog>
  );
};

export default UploadUserAvatarDialog;