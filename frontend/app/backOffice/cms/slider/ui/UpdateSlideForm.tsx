'use client';

import React, { useState } from 'react';
import UpdateBaseForm, { BaseUpdateFormField } from '@/components/BaseForm/UpdateBaseForm';
import { updateSlideWithMultimedia, updateSlide } from '@/app/actions/slides';
import type { Slide } from '@/app/actions/slides';
import { useAlert } from '@/app/hooks/useAlert';

interface UpdateSlideFormProps {
  slide: Slide;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface SlideFormData {
  [key: string]: any;
  title: string;
  description: string;
  linkUrl: string;
  duration: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  multimediaUrl: string;
  multimediaUrlFile: File | null;
}

export default function UpdateSlideForm({ slide, onSuccess, onCancel }: UpdateSlideFormProps) {
  const { showAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const initialState: SlideFormData = {
    title: slide.title || '',
    description: slide.description || '',
    linkUrl: slide.linkUrl || '',
    duration: slide.duration || 3,
    startDate: slide.startDate?.split('T')[0] || '',
    endDate: slide.endDate?.split('T')[0] || '',
    isActive: slide.isActive ?? true,
    multimediaUrl: slide.multimediaUrl || '',
    multimediaUrlFile: null,
  };

  const validateForm = (values: SlideFormData): string[] => {
    const newErrors: string[] = [];

    if (!values.title.trim()) {
      newErrors.push('El título es requerido');
    } else if (values.title.length < 3) {
      newErrors.push('El título debe tener al menos 3 caracteres');
    }

    if (!values.multimediaUrl && !values.multimediaUrlFile && !slide.multimediaUrl) {
      newErrors.push('Debe mantener la imagen actual o subir una nueva');
    }

    if (values.linkUrl.trim() && !values.linkUrl.match(/^https?:\/\/.+/) && !values.linkUrl.match(/^\/.+/)) {
      newErrors.push('La URL debe ser válida (http://, https:// o comenzar con /)');
    }

    if (values.duration < 1 || values.duration > 60) {
      newErrors.push('La duración debe estar entre 1 y 60 segundos');
    }

    if (values.startDate && values.endDate) {
      const start = new Date(values.startDate);
      const end = new Date(values.endDate);
      if (start >= end) {
        newErrors.push('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    return newErrors;
  };

  const handleSubmit = async (values: any) => {
    const validationErrors = validateForm(values);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      showAlert({
        message: 'Por favor corrige los errores del formulario',
        type: 'error',
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      let result;

      if (values.multimediaUrlFile) {
        // Update with new multimedia
        const formData = new FormData();
        formData.append('title', values.title.trim());
        formData.append('description', values.description);
        formData.append('duration', values.duration.toString());
        formData.append('isActive', values.isActive.toString());
        formData.append('linkUrl', values.linkUrl.trim());

        if (values.startDate) formData.append('startDate', values.startDate);
        if (values.endDate) formData.append('endDate', values.endDate);

        formData.append('multimedia', values.multimediaUrlFile);

        result = await updateSlideWithMultimedia(slide.id, formData);
      } else {
        // Update without multimedia
        const updateData = {
          title: values.title.trim(),
          description: values.description,
          linkUrl: values.linkUrl.trim(),
          duration: values.duration,
          startDate: values.startDate || undefined,
          endDate: values.endDate || undefined,
          isActive: values.isActive,
        };

        result = await updateSlide(slide.id, updateData);
      }

      if (result.success) {
        showAlert({
          message: 'Slide actualizado exitosamente',
          type: 'success',
          duration: 3000,
        });
        onSuccess?.();
      } else {
        const errorMsg = result.error || 'Error al actualizar el slide';
        setErrors([errorMsg]);
        showAlert({
          message: errorMsg,
          type: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('[UpdateSlideForm] Exception:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error interno del servidor';
      setErrors([errorMsg]);
      showAlert({
        message: errorMsg,
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields: BaseUpdateFormField[] = [
    {
      name: 'title',
      label: 'Título del Slide',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      rows: 3,
      multiline: true,
    },
    {
      name: 'multimediaUrl',
      label: 'Imagen o Video',
      type: 'image',
      required: true,
      currentUrl: slide.multimediaUrl,
      currentType: slide.multimediaUrl?.includes('.mp4') || slide.multimediaUrl?.includes('.webm') ? 'video' : 'image',
      acceptedTypes: ['image/*', 'video/*'],
      maxSize: 60,
      aspectRatio: '16:9',
      previewSize: 'lg',
    },
    {
      name: 'linkUrl',
      label: 'URL de destino',
      type: 'text',
    },
    {
      name: 'duration',
      label: 'Duración (segundos)',
      type: 'number',
      min: 1,
      max: 60,
    },
    {
      name: 'startDate',
      label: 'Fecha de inicio',
      type: 'text',
    },
    {
      name: 'endDate',
      label: 'Fecha de fin',
      type: 'text',
    },
    {
      name: 'isActive',
      label: 'Slide activo',
      type: 'switch',
    },
  ];

  return (
    <UpdateBaseForm
      fields={fields}
      initialState={initialState}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
      submitLabel="Actualizar Slide"
      cancelButton={true}
      cancelButtonText="Cancelar"
      onCancel={onCancel}
    />
  );
}
