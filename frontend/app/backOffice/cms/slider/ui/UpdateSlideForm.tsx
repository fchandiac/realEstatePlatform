'use client';

import React, { useState, useEffect } from 'react';
import { TextField } from '@/components/TextField/TextField';
import { FileImageUploader } from '@/components/FileUploader/FileImageUploader';
import { Button } from '@/components/Button/Button';
import Switch from '@/components/Switch/Switch';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { updateSlideWithMultimedia } from '@/app/actions/slides';
import type { Slide } from '@/app/actions/slides';

interface UpdateSlideFormProps {
  slide: Slide;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface SlideFormData {
  title: string;
  description: string;
  linkUrl: string;
  duration: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function UpdateSlideForm({ slide, onSuccess, onCancel }: UpdateSlideFormProps) {
  // Estados para el formulario
  const [formData, setFormData] = useState<SlideFormData>({
    title: slide.title || '',
    description: slide.description || '',
    linkUrl: slide.linkUrl || '',
    duration: slide.duration || 3,
    startDate: slide.startDate?.split('T')[0] || '',
    endDate: slide.endDate?.split('T')[0] || '',
    isActive: slide.isActive ?? true,
  });

  // Estado para multimedia
  const [currentImage, setCurrentImage] = useState<string>(slide.multimediaUrl || '');
  const [newMultimediaFile, setNewMultimediaFile] = useState<File[]>([]);
  const [showImageUploader, setShowImageUploader] = useState(false);

  // Estados UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Handlers para campos regulares
  const handleInputChange = (field: keyof SlideFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.type === 'number' 
      ? Number(event.target.value) 
      : event.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  // Handler para cambio de multimedia
  const handleMultimediaChange = (files: File[]) => {
    setNewMultimediaFile(files);
    setErrors([]);
  };

  const handleChangeImage = () => {
    setShowImageUploader(true);
    setCurrentImage('');
  };

  const handleKeepCurrentImage = () => {
    setShowImageUploader(false);
    setNewMultimediaFile([]);
    setCurrentImage(slide.multimediaUrl || '');
  };

  // Validación
  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    if (!formData.title.trim()) {
      newErrors.push('El título es requerido');
    } else if (formData.title.length < 3) {
      newErrors.push('El título debe tener al menos 3 caracteres');
    }

    if (!currentImage && newMultimediaFile.length === 0) {
      newErrors.push('Debe mantener la imagen actual o subir una nueva');
    }

    if (formData.linkUrl.trim() && !formData.linkUrl.match(/^https?:\/\/.+/)) {
      newErrors.push('La URL debe ser válida (http:// o https://)');
    }

    if (formData.duration < 1 || formData.duration > 60) {
      newErrors.push('La duración debe estar entre 1 y 60 segundos');
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.push('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    return newErrors;
  };

  // Submit
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const formDataToSend = new FormData();
      
      // Campos regulares
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration.toString());
      formDataToSend.append('isActive', formData.isActive.toString());
      
      // Siempre enviar linkUrl, incluso si está vacío (para permitir eliminarlo)
      formDataToSend.append('linkUrl', formData.linkUrl.trim());
      
      if (formData.startDate) formDataToSend.append('startDate', formData.startDate);
      if (formData.endDate) formDataToSend.append('endDate', formData.endDate);

      // Multimedia solo si hay archivo nuevo
      if (newMultimediaFile.length > 0) {
        formDataToSend.append('multimedia', newMultimediaFile[0]);
      }

      const result = await updateSlideWithMultimedia(slide.id, formDataToSend);

      if (result.success) {
        onSuccess?.();
      } else {
        setErrors([result.error || 'Error al actualizar el slide']);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors(['Error interno del servidor']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Campos básicos */}
      <TextField
        label="Título del Slide"
        value={formData.title}
        onChange={handleInputChange('title')}
        required
        placeholder="Ej: ¡Vende tu Propiedad con Nosotros!"
      />

      <TextField
        label="Descripción"
        value={formData.description}
        onChange={handleInputChange('description')}
        rows={3}
        placeholder="Descripción del slide (opcional)"
      />

      {/* Gestión de multimedia */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen o Video *
        </label>
        
        {/* Mostrar imagen actual */}
        {currentImage && !showImageUploader && (
          <div className="mb-4">
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              {currentImage.includes('.mp4') || currentImage.includes('.webm') ? (
                <video 
                  src={currentImage} 
                  className="w-full h-full object-cover"
                  controls={false}
                  muted
                />
              ) : (
                <img 
                  src={currentImage} 
                  alt="Imagen actual" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                onClick={handleChangeImage}
                variant="secondary"
                size="sm"
              >
                Cambiar imagen
              </Button>
            </div>
          </div>
        )}

        {/* Uploader para nueva imagen */}
        {(showImageUploader || !currentImage) && (
          <div>
            <FileImageUploader
              uploadPath="/uploads/web/slides"
              onChange={handleMultimediaChange}
              accept="image/*,video/*"
              maxFiles={1}
              maxSize={10}
              aspectRatio="video"
              buttonType="icon"
            />
            {newMultimediaFile.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Nuevo archivo seleccionado: {newMultimediaFile[0].name}
              </p>
            )}
            {currentImage && (
              <Button
                onClick={handleKeepCurrentImage}
                variant="text"
                size="sm"
                className="mt-2"
              >
                Mantener imagen actual
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Grid para campos pequeños */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="URL de destino"
          type="url"
          value={formData.linkUrl}
          onChange={handleInputChange('linkUrl')}
          placeholder="https://ejemplo.com (opcional)"
        />

        <TextField
          label="Duración (segundos)"
          type="number"
          value={formData.duration.toString()}
          onChange={handleInputChange('duration')}
        />
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de inicio (opcional)
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de fin (opcional)
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            min={formData.startDate || new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Switch */}
      <div className="flex items-center gap-3">
        <Switch
          checked={formData.isActive}
          onChange={handleSwitchChange}
        />
        <span className="text-sm font-medium text-gray-700">
          Slide activo
        </span>
      </div>

      {/* Botones */}
      <div className="pt-4 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={16} className="mr-2" />
              Actualizando...
            </>
          ) : (
            'Actualizar Slide'
          )}
        </Button>
      </div>
    </div>
  );
}
