'use client';

import React, { useState } from 'react';
import { TextField } from '@/components/TextField/TextField';
import { FileImageUploader } from '@/components/FileUploader/FileImageUploader';
import { createSlideWithMultimedia } from '@/app/actions/slides';
import Alert from '@/components/Alert/Alert';
import { Button } from '@/components/Button/Button';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import Switch from '@/components/Switch/Switch';

interface CreateSlideFormProps {
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

export default function CreateSlideForm({ onSuccess, onCancel }: CreateSlideFormProps) {
  // Estado principal del formulario (patrón IdentityPage)
  const [slide, setSlide] = useState<SlideFormData>({
    title: '',
    description: '',
    linkUrl: '',
    duration: 3,
    startDate: '',
    endDate: '',
    isActive: true
  });
  
  // Estado separado para archivo (patrón IdentityPage)
  const [multimediaFile, setMultimediaFile] = useState<File[]>([]);
  
  // Estados UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState('');

  // Handlers para campos regulares (patrón IdentityPage)
  const handleInputChange = (field: keyof SlideFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.type === 'number' 
      ? Number(event.target.value) 
      : event.target.value;
    
    setSlide(prev => ({ ...prev, [field]: value }));
    setErrors([]); // Limpiar errores
  };

  const handleSwitchChange = (checked: boolean) => {
    setSlide(prev => ({ ...prev, isActive: checked }));
  };

  // Handler para FileUploader (patrón IdentityPage)
  const handleMultimediaChange = (files: File[]) => {
    setMultimediaFile(files);
    setErrors([]);
  };

  // Validación personalizada
  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    // Validar título
    if (!slide.title.trim()) {
      newErrors.push('El título es requerido');
    } else if (slide.title.length < 3) {
      newErrors.push('El título debe tener al menos 3 caracteres');
    } else if (slide.title.length > 255) {
      newErrors.push('El título no puede exceder 255 caracteres');
    }

    // Validar multimedia
    if (multimediaFile.length === 0) {
      newErrors.push('La imagen o video es requerida');
    }

    // Validar URL si se proporciona (solo si tiene contenido)
    if (slide.linkUrl.trim() && !slide.linkUrl.match(/^https?:\/\/.+/)) {
      newErrors.push('La URL debe ser válida (http:// o https://)');
    }

    // Validar duración
    if (slide.duration < 1 || slide.duration > 60) {
      newErrors.push('La duración debe estar entre 1 y 60 segundos');
    }

    // Validar fechas si se proporcionan
    if (slide.startDate && slide.endDate) {
      const start = new Date(slide.startDate);
      const end = new Date(slide.endDate);
      if (start >= end) {
        newErrors.push('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    return newErrors;
  };

  // Submit handler (patrón IdentityPage)
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    setSuccess('');

    try {
      // FormData manual (patrón IdentityPage)
      const formData = new FormData();
      
      // Campos obligatorios
      formData.append('title', slide.title.trim());
      formData.append('description', slide.description);
      
      // URL OPCIONAL - solo enviar si tiene contenido
      if (slide.linkUrl.trim()) {
        formData.append('linkUrl', slide.linkUrl.trim());
      }
      
      // Duration y isActive (backend los convertirá automáticamente)
      formData.append('duration', slide.duration.toString());
      formData.append('isActive', slide.isActive.toString());
      
      // Fechas opcionales
      if (slide.startDate) formData.append('startDate', slide.startDate);
      if (slide.endDate) formData.append('endDate', slide.endDate);

      // Archivo multimedia
      if (multimediaFile.length > 0) {
        formData.append('multimedia', multimediaFile[0]);
      }

      // Server action
      const result = await createSlideWithMultimedia(formData);

      if (result.success) {
        setSuccess('Slide creado exitosamente');
        setTimeout(() => onSuccess?.(), 1000);
      } else {
        setErrors([result.error || 'Error al crear el slide']);
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
      {/* Feedback */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <Alert key={index} variant="error">
              {error}
            </Alert>
          ))}
        </div>
      )}
      
      {success && (
        <Alert variant="success">
          {success}
        </Alert>
      )}

      {/* Campo título */}
      <TextField
        label="Título del Slide"
        value={slide.title}
        onChange={handleInputChange('title')}
        required
        placeholder="Ej: ¡Vende tu Propiedad con Nosotros!"
      />

      {/* Campo descripción */}
      <TextField
        label="Descripción"
        value={slide.description}
        onChange={handleInputChange('description')}
        rows={3}
        placeholder="Descripción del slide (opcional)"
      />

      {/* FileUploader directo (patrón IdentityPage) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen o Video *
        </label>
        <FileImageUploader
          uploadPath="/slide"
          onChange={handleMultimediaChange}
          label="Subir multimedia"
          accept="image/*,video/*"
          maxFiles={1}
          maxSize={10}
          aspectRatio="auto"
          buttonType="icon"
        />
        {multimediaFile.length > 0 && (
          <p className="text-sm text-green-600 mt-2">
            ✓ Archivo seleccionado: {multimediaFile[0].name}
          </p>
        )}
      </div>

      {/* Grid para campos pequeños */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* URL destino */}
        <TextField
          label="URL de destino"
          type="url"
          value={slide.linkUrl}
          onChange={handleInputChange('linkUrl')}
          placeholder="https://ejemplo.com (opcional)"
        />

        {/* Duración */}
        <TextField
          label="Duración (segundos)"
          type="number"
          value={slide.duration.toString()}
          onChange={handleInputChange('duration')}
        />
      </div>

      {/* Grid para fechas con date picker nativo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de inicio (opcional)
          </label>
          <input
            type="date"
            value={slide.startDate}
            onChange={(e) => setSlide(prev => ({ ...prev, startDate: e.target.value }))}
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
            value={slide.endDate}
            onChange={(e) => setSlide(prev => ({ ...prev, endDate: e.target.value }))}
            min={slide.startDate || new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Switch activo/inactivo */}
      <div className="flex items-center gap-3">
        <Switch
          checked={slide.isActive}
          onChange={handleSwitchChange}
        />
        <span className="text-sm font-medium text-gray-700">
          Slide activo
        </span>
      </div>

      {/* Botón de acción al final */}
      <div className="pt-4 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || multimediaFile.length === 0}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={16} className="mr-2" />
              Creando...
            </>
          ) : (
            'Crear Slide'
          )}
        </Button>
      </div>
    </div>
  );
}
